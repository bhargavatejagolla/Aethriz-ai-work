"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { getSession, UserProfile } from "@/lib/auth";

interface FoodPreset {
  id: string;
  name: string;
  nameHi: string;
  category: string;
  fileName: string;
  fileSize: string;
  healthScore: number;
  glycemicIndex: number;
  giRating: "Low" | "Medium" | "High";
  giRatingHi: "कम (सुरक्षित)" | "मध्यम" | "उच्च (सतर्क)";
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  sugar: number;
  allergens: string[];
  allergensHi: string[];
  healthyIngredients: string[];
  additives: { code: string; name: string; safety: "safe" | "caution" | "avoid"; note: string }[];
  clinicalVerdict: string;
  clinicalVerdictHi: string;
}

const PRESET_FOODS: FoodPreset[] = [
  {
    id: "granola",
    name: "Almond & Flax Seed Granola",
    nameHi: "बादाम एवं अलसी ग्रेनोला",
    category: "Packaged Food Label",
    fileName: "label_scan.jpg",
    fileSize: "340 KB",
    healthScore: 84,
    glycemicIndex: 38,
    giRating: "Low",
    giRatingHi: "कम (सुरक्षित)",
    calories: 220,
    protein: 8.5,
    carbs: 24.0,
    fats: 9.8,
    fiber: 6.2,
    sugar: 4.5,
    allergens: ["Tree nuts (Almonds)"],
    allergensHi: ["ड्राई फ्रूट्स (बादाम)"],
    healthyIngredients: ["Rolled whole oats", "Raw California almonds", "Golden flaxseeds", "Chia seeds", "Organic cinnamon"],
    additives: [
      { code: "E306", name: "Natural Tocopherols (Vitamin E)", safety: "safe", note: "Plant-derived antioxidant protecting healthy oils" }
    ],
    clinicalVerdict: "Excellent choice for your metabolic profile. High beta-glucan soluble fiber prevents post-meal glucose spikes and supports LDL reduction.",
    clinicalVerdictHi: "आपकी मेटाबॉलिक स्थिति के लिए उत्तम विकल्प। घुलनशील फाइबर ब्लड शुगर स्पाइक को रोकता है और बैड कोलेस्ट्रॉल कम करने में सहायक है।"
  },
  {
    id: "dal-plate",
    name: "Dal Tadka with Brown Rice & Bhindi Sabzi",
    nameHi: "दाल तड़का, ब्राउन राइस एवं भिंडी सब्जी",
    category: "Home Cooked Meal Plate",
    fileName: "meal_plate_scan.jpg",
    fileSize: "480 KB",
    healthScore: 92,
    glycemicIndex: 42,
    giRating: "Low",
    giRatingHi: "कम (सुरक्षित)",
    calories: 385,
    protein: 16.4,
    carbs: 52.0,
    fats: 8.5,
    fiber: 9.6,
    sugar: 2.1,
    allergens: ["None detected"],
    allergensHi: ["कोई एलर्जी कारक नहीं"],
    healthyIngredients: ["Moong & Toor dal", "Brown basmati rice", "Fresh okra (bhindi)", "Turmeric & cumin", "Cold pressed mustard oil"],
    additives: [],
    clinicalVerdict: "Perfect balanced Indian plate. 2:1 ratio of sabzi to rice aligns with your 30-day nutrition plan to steady HbA1c.",
    clinicalVerdictHi: "पूरी तरह संतुलित भारतीय थाली। सब्जियों और दाल का यह अनुपात ब्लड शुगर को स्थिर रखने के लिए बिल्कुल उपयुक्त है।"
  },
  {
    id: "protein-bar",
    name: "Chocolate Fudge Whey Protein Bar",
    nameHi: "चॉकलेट वे प्रोटीन बार",
    category: "Packaged Snack",
    fileName: "protein_bar_label.jpg",
    fileSize: "290 KB",
    healthScore: 68,
    glycemicIndex: 54,
    giRating: "Medium",
    giRatingHi: "मध्यम",
    calories: 260,
    protein: 21.0,
    carbs: 26.0,
    fats: 7.2,
    fiber: 3.5,
    sugar: 8.2,
    allergens: ["Milk (Whey)", "Soy lecithin"],
    allergensHi: ["दूध (व्हे)", "सोया"],
    healthyIngredients: ["Whey protein isolate", "Cocoa powder", "Almond butter"],
    additives: [
      { code: "E955", name: "Sucralose", safety: "caution", note: "Artificial non-caloric sweetener; may alter gut microbiome in sensitive individuals" },
      { code: "E471", name: "Mono- and diglycerides of fatty acids", safety: "caution", note: "Emulsifier used for bar shelf texture" }
    ],
    clinicalVerdict: "High protein support for muscle synthesis, but watch the artificial sweeteners and emulsifiers. Consume occasionally.",
    clinicalVerdictHi: "प्रोटीन की मात्रा अच्छी है, परंतु कृत्रिम मिठास होने के कारण सीमित मात्रा में ही सेवन करें।"
  }
];

export default function FoodScannerPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  
  // Prompt & File State
  const [selectedPreset, setSelectedPreset] = useState<FoodPreset>(PRESET_FOODS[0]);
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string } | null>({
    name: "label_scan.jpg",
    size: "340 KB",
  });
  const [userQuery, setUserQuery] = useState("");

  // Scan Checkboxes (matching exact mockup)
  const [allergenScan, setAllergenScan] = useState(true);
  const [glycemicScan, setGlycemicScan] = useState(true);
  const [additiveCheck, setAdditiveCheck] = useState(true);

  // Vision Analysis Execution
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [showAnalysisResults, setShowAnalysisResults] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const session = getSession();
    if (session) {
      setUser(session);
      if (session.language && session.language.includes("हिन्दी")) {
        setLanguage("hi");
      }
    }
  }, []);

  const handleChipClick = (promptText: string, presetIndex: number) => {
    setUserQuery(promptText);
    const preset = PRESET_FOODS[presetIndex];
    setSelectedPreset(preset);
    setAttachedFile({ name: preset.fileName, size: preset.fileSize });
    handleScan(preset);
  };

  const handleScan = (presetToUse = selectedPreset) => {
    setIsScanning(true);
    setScanProgress(20);
    setShowAnalysisResults(false);

    const t1 = setTimeout(() => setScanProgress(55), 250);
    const t2 = setTimeout(() => setScanProgress(88), 500);
    const t3 = setTimeout(() => {
      setScanProgress(100);
      setIsScanning(false);
      setShowAnalysisResults(true);
    }, 750);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAttachedFile({
        name: file.name,
        size: `${Math.round(file.size / 1024)} KB`,
      });
      // Switch preset or analyze
      setSelectedPreset(PRESET_FOODS[0]);
    }
  };

  const userName = user?.name?.split(" ")[0] || "Aarav";

  return (
    <div className="min-h-screen bg-[#F4F5F8] text-[#1D1F22] font-sans antialiased selection:bg-[#E3202B] selection:text-white pb-20">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,.pdf"
        className="hidden"
      />

      {/* ============ TOP FLOATING NAVBAR ============ */}
      <header className="sticky top-4 z-40 px-4 sm:px-6">
        <nav
          aria-label="Main"
          className="relative max-w-[1240px] mx-auto p-2 pl-4 sm:pl-5 flex items-center justify-between gap-3 rounded-full border border-white/80 shadow-[0_20px_50px_rgba(120,60,90,0.1),0_2px_8px_rgba(29,31,34,0.04),inset_0_1.5px_0_rgba(255,255,255,0.95)]"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.75) 50%, rgba(255,255,255,0.88) 100%)",
            backdropFilter: "blur(28px) saturate(200%)",
            WebkitBackdropFilter: "blur(28px) saturate(200%)",
          }}
        >
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-[9px] overflow-hidden shadow-2xs flex-shrink-0 transition-transform group-hover:scale-105">
              <Image
                src="/brand/aethriz-hero-logo.png"
                alt="AETHRIZ logo"
                width={32}
                height={32}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <span className="flex flex-col leading-none">
              <span
                className="font-semibold text-[15.5px] tracking-[0.14em] text-[#1D1F22]"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                AETHRIZ
              </span>
              <span className="text-[8.5px] tracking-[0.22em] text-[#C8161F] mt-[2px] font-mono">
                BIO-HEALTH AI
              </span>
            </span>
          </Link>

          {/* Center Navigation Pills */}
          <div className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-slate-100/70 border border-slate-200/50 text-[13px] font-medium text-[#545B61]">
            <Link
              href="/dashboard"
              className="px-3.5 py-1.5 rounded-full hover:text-[#1D1F22] hover:bg-white/50 transition-all"
            >
              AI Health
            </Link>
            <Link
              href="/health-analysis"
              className="px-3.5 py-1.5 rounded-full hover:text-[#1D1F22] hover:bg-white/50 transition-all"
            >
              Analysis
            </Link>
            <Link
              href="/doctors"
              className="px-3.5 py-1.5 rounded-full hover:text-[#1D1F22] hover:bg-white/50 transition-all"
            >
              Doctors
            </Link>
            <Link
              href="/booking"
              className="px-3.5 py-1.5 rounded-full hover:text-[#1D1F22] hover:bg-white/50 transition-all"
            >
              Bookings
            </Link>
            <Link
              href="/food-scanner"
              className="px-3.5 py-1.5 rounded-full bg-white text-[#1D1F22] font-semibold shadow-xs transition-all"
            >
              Food Scanner
            </Link>
            <Link
              href="/body-explorer"
              className="px-3.5 py-1.5 rounded-full hover:text-[#1D1F22] hover:bg-white/50 transition-all"
            >
              Body Explorer
            </Link>
            <Link
              href="/stories"
              className="px-3.5 py-1.5 rounded-full hover:text-[#1D1F22] hover:bg-white/50 transition-all"
            >
              Articles
            </Link>
          </div>

          {/* Right Action: Language + Profile */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 p-0.5 rounded-full text-xs font-medium">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  language === "en" ? "bg-white text-[#1D1F22] shadow-2xs font-semibold" : "text-[#64748B]"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage("hi")}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  language === "hi" ? "bg-white text-[#1D1F22] shadow-2xs font-semibold" : "text-[#64748B]"
                }`}
              >
                हिन्दी
              </button>
            </div>

            <Link
              href="/profile"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FCECEE] hover:bg-[#F9DFE2] border border-[#F6C6CC] text-xs font-semibold text-[#1D1F22] transition-all shadow-2xs"
            >
              <div className="w-6 h-6 rounded-full bg-[#E3202B] text-white flex items-center justify-center font-bold text-[10.5px]">
                {userName.substring(0, 2).toUpperCase()}
              </div>
              <span className="hidden sm:inline font-medium">My profile</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* ============ MAIN CONTAINER ============ */}
      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-8">
        
        {/* ============ HEADER SECTION MATCHING EXACT MOCKUP ============ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
          <div>
            <p className="text-xs font-medium text-[#64748B] tracking-wide">
              {language === "hi" ? "एआई स्वास्थ्य · खाद्य स्कैनर" : "AI Health · Food scanner"}
            </p>
            <h1
              className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#1D1F22] mt-1"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              {language === "hi" ? "खाद्य स्कैनर।" : "Food scanner."}
            </h1>
            <p className="text-sm sm:text-base text-[#64748B] mt-2">
              {language === "hi"
                ? "किसी भी खाद्य पदार्थ, थाली या पैकेज्ड लेबल को स्कैन करें।"
                : "Scan any food, plate or packaged label."}
            </p>
          </div>

          {/* Right Floating 3D Crimson Pearl Sphere with Camera Reticle */}
          <div className="relative w-28 h-28 flex items-center justify-center self-end md:self-auto flex-shrink-0">
            {/* Viewfinder Reticle Frame */}
            <div className="absolute inset-0 rounded-3xl border border-red-200/60 bg-white/40 backdrop-blur-md shadow-lg flex items-center justify-center">
              {/* Corner brackets */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#E3202B]" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#E3202B]" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#E3202B]" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#E3202B]" />
              
              {/* 3D Radiant Red Sphere */}
              <div
                className="w-14 h-14 rounded-full shadow-[0_8px_20px_rgba(227,32,43,0.45)] flex items-center justify-center text-white ae-pulse-glow"
                style={{
                  background: "radial-gradient(circle at 35% 35%, #FF6469 0%, #E3202B 55%, #7F1D1D 100%)",
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ============ BIG CENTRAL AI VISION COMMAND CARD MATCHING EXACT MOCKUP ============ */}
        <div className="bg-white rounded-[32px] p-8 sm:p-12 border border-slate-200/80 shadow-[0_20px_50px_rgba(29,31,34,0.05)] text-center relative overflow-hidden">
          
          {/* Subtle Background Glow */}
          <div
            className="absolute left-1/2 -top-24 -translate-x-1/2 w-96 h-48 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(ellipse, rgba(227,32,43,0.08) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          {/* Centered Star Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-10 h-10 rounded-full bg-red-50 text-[#E3202B] flex items-center justify-center text-lg shadow-2xs border border-red-100/80">
              ✦
            </div>
          </div>

          {/* Centered Main Question */}
          <h2
            className="text-2xl sm:text-3xl lg:text-[34px] font-semibold text-[#1D1F22] tracking-tight max-w-2xl mx-auto leading-tight"
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            {language === "hi"
              ? "आप अपने भोजन के बारे में क्या जानना चाहते हैं?"
              : "What would you like to know about your food?"}
          </h2>

          <p className="text-xs sm:text-sm text-[#64748B] mt-2 max-w-lg mx-auto">
            {language === "hi"
              ? "तत्वों, स्वास्थ्य प्रभाव, हानिकारक एडिटिव्स या फोटो अपलोड करके पूछें।"
              : "Ask about ingredients, health impact, additives or upload a photo."}
          </p>

          {/* 3 Quick Action Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 my-6">
            <button
              type="button"
              onClick={() => handleChipClick("Analyse this food label for diabetic safety and palm oil.", 0)}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-[#F8FAFC] text-[#475569] border border-slate-200/80 hover:bg-slate-100 hover:text-[#1D1F22] transition-all cursor-pointer shadow-2xs"
            >
              {language === "hi" ? "खाद्य लेबल का विश्लेषण करें" : "Analyse a food label"}
            </button>

            <button
              type="button"
              onClick={() => handleChipClick("Explain all ingredients and check if there are hidden sugars or preservatives.", 0)}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-[#F8FAFC] text-[#475569] border border-slate-200/80 hover:bg-slate-100 hover:text-[#1D1F22] transition-all cursor-pointer shadow-2xs"
            >
              {language === "hi" ? "सामग्री को समझें" : "Explain the ingredients"}
            </button>

            <button
              type="button"
              onClick={() => handleChipClick("Estimate calories and macro breakdown for this meal plate.", 1)}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-[#F8FAFC] text-[#475569] border border-slate-200/80 hover:bg-slate-100 hover:text-[#1D1F22] transition-all cursor-pointer shadow-2xs"
            >
              {language === "hi" ? "पोषण की तुलना करें" : "Compare nutrition"}
            </button>
          </div>

          {/* ============ PILL INPUT BAR MATCHING EXACT MOCKUP ============ */}
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-center bg-[#F8FAFC] border border-slate-200 rounded-full p-2 pl-4 shadow-sm hover:border-slate-300 transition-all focus-within:ring-2 focus-within:ring-[#E3202B]/20 focus-within:border-[#E3202B]">
              
              {/* Paperclip / Image Attachment Trigger */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-slate-400 hover:text-slate-600 p-2 cursor-pointer flex-shrink-0 transition-colors"
                title="Upload food photo or label"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </button>

              {/* Attached File Chip */}
              {attachedFile && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs text-[#1D1F22] font-semibold mr-2 flex-shrink-0 shadow-2xs">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E3202B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span>{attachedFile.name}</span>
                  <span className="text-[10px] text-[#94A3B8] font-mono font-normal">
                    {attachedFile.size}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAttachedFile(null)}
                    className="text-slate-400 hover:text-slate-600 ml-1 p-0.5 cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Natural Text Input */}
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleScan();
                }}
                placeholder={
                  language === "hi"
                    ? "पूछें: क्या यह बिस्किट डायबिटीज के लिए सुरक्षित है?"
                    : "Ask anything about this food, ingredients, or health impact..."
                }
                className="w-full bg-transparent text-sm text-[#1D1F22] placeholder:text-[#94A3B8] focus:outline-none px-2"
              />

              {/* Black Circular Submit Button */}
              <button
                type="button"
                disabled={isScanning}
                onClick={() => handleScan()}
                className="w-11 h-11 rounded-full bg-[#1D1F22] hover:bg-black text-white flex items-center justify-center flex-shrink-0 shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-60"
                title="Scan and analyse"
              >
                {isScanning ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>

            {/* 3 Checkbox Toggles Matching Exact Mockup */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-4 text-xs font-medium text-[#475569]">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={allergenScan}
                  onChange={(e) => setAllergenScan(e.target.checked)}
                  className="w-4 h-4 rounded text-[#E3202B] focus:ring-[#E3202B] border-slate-300 cursor-pointer accent-[#E3202B]"
                />
                <span>Allergen scan</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={glycemicScan}
                  onChange={(e) => setGlycemicScan(e.target.checked)}
                  className="w-4 h-4 rounded text-[#E3202B] focus:ring-[#E3202B] border-slate-300 cursor-pointer accent-[#E3202B]"
                />
                <span>Diabetic glycaemic index</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={additiveCheck}
                  onChange={(e) => setAdditiveCheck(e.target.checked)}
                  className="w-4 h-4 rounded text-[#E3202B] focus:ring-[#E3202B] border-slate-300 cursor-pointer accent-[#E3202B]"
                />
                <span>Additive check</span>
              </label>
            </div>
          </div>

          {/* ============ LIVE CLINICAL TELEMETRY RESULTS ============ */}
          {showAnalysisResults && (
            <div className="ae-fade-in space-y-6 pt-10 text-left border-t border-slate-100 mt-10">
              
              {/* Clinical Verdict Banner */}
              <div className="p-6 rounded-[28px] bg-gradient-to-br from-slate-900 via-[#18191E] to-[#1F0D12] text-white relative overflow-hidden shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 relative z-10 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#E3202B] font-bold">
                      AETHRIZ CLINICAL NUTRITION VERDICT
                    </span>
                    <span className="text-white/40">·</span>
                    <span className="text-xs text-white/70">{selectedPreset.category}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    {language === "hi" ? selectedPreset.nameHi : selectedPreset.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                    {language === "hi" ? selectedPreset.clinicalVerdictHi : selectedPreset.clinicalVerdict}
                  </p>
                </div>

                {/* Score & GI Dials */}
                <div className="flex items-center gap-4 relative z-10 self-start md:self-auto flex-shrink-0">
                  <div className="text-center p-3 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xs min-w-[85px]">
                    <span className="text-2xl font-extrabold text-emerald-400 block leading-none">
                      {selectedPreset.healthScore}
                    </span>
                    <span className="text-[10px] text-white/70 block mt-1 uppercase font-mono">
                      Health Score
                    </span>
                  </div>

                  <div className="text-center p-3 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xs min-w-[85px]">
                    <span className="text-2xl font-extrabold text-[#FF8A90] block leading-none">
                      GI {selectedPreset.glycemicIndex}
                    </span>
                    <span className="text-[10px] text-white/70 block mt-1 uppercase font-mono">
                      {language === "hi" ? selectedPreset.giRatingHi : `${selectedPreset.giRating} Glycemic`}
                    </span>
                  </div>
                </div>
              </div>

              {/* 5 Core Macro Telemetry Gauges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 text-center">
                  <span className="text-xs text-[#64748B] block">Calories</span>
                  <span className="text-xl font-bold text-[#1D1F22] mt-0.5 block">{selectedPreset.calories}</span>
                  <span className="text-[10px] text-[#94A3B8]">kcal / serving</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 text-center">
                  <span className="text-xs text-[#64748B] block">Protein</span>
                  <span className="text-xl font-bold text-emerald-700 mt-0.5 block">{selectedPreset.protein} g</span>
                  <span className="text-[10px] text-emerald-600 font-medium">Clean source</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 text-center">
                  <span className="text-xs text-[#64748B] block">Dietary Fiber</span>
                  <span className="text-xl font-bold text-[#1D1F22] mt-0.5 block">{selectedPreset.fiber} g</span>
                  <span className="text-[10px] text-emerald-600 font-medium">Soluble fiber</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 text-center">
                  <span className="text-xs text-[#64748B] block">Carbohydrates</span>
                  <span className="text-xl font-bold text-[#1D1F22] mt-0.5 block">{selectedPreset.carbs} g</span>
                  <span className="text-[10px] text-[#64748B]">Slow-release</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 text-center">
                  <span className="text-xs text-[#64748B] block">Healthy Fats</span>
                  <span className="text-xl font-bold text-[#1D1F22] mt-0.5 block">{selectedPreset.fats} g</span>
                  <span className="text-[10px] text-emerald-600 font-medium">Omega-3 & MUFA</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 text-center">
                  <span className="text-xs text-[#64748B] block">Free Sugar</span>
                  <span className="text-xl font-bold text-amber-600 mt-0.5 block">{selectedPreset.sugar} g</span>
                  <span className="text-[10px] text-amber-600 font-medium">Natural fruit</span>
                </div>
              </div>

              {/* Sub-Grids: Ingredients vs Safety */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Whole Ingredients */}
                <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#1D1F22]">
                      {language === "hi" ? "प्राकृतिक सामग्रियां" : "Whole Ingredients"}
                    </h4>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                      Clean Formulated
                    </span>
                  </div>

                  <ul className="space-y-2 text-xs text-[#475569]">
                    {selectedPreset.healthyIngredients.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">
                          ✓
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Additives & Allergen Safety */}
                <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#1D1F22]">
                      {language === "hi" ? "एडिटिव एवं एलर्जी जांच" : "Additive & Allergen Safety"}
                    </h4>
                    <span className="text-[10px] font-mono text-[#E3202B] bg-red-50 px-2 py-0.5 rounded-full font-bold border border-red-200">
                      Clinical Scan
                    </span>
                  </div>

                  {/* Allergen */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs">
                    <span className="font-semibold text-[#1D1F22] block mb-1">
                      {language === "hi" ? "पहचाने गए एलर्जी कारक:" : "Detected Allergens:"}
                    </span>
                    <span className="text-[#64748B]">
                      {language === "hi"
                        ? selectedPreset.allergensHi.join(", ")
                        : selectedPreset.allergens.join(", ")}
                    </span>
                  </div>

                  {/* Additives */}
                  <div className="space-y-2">
                    {selectedPreset.additives.length === 0 ? (
                      <p className="text-xs text-emerald-700 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Zero artificial preservatives or chemical fillers found.</span>
                      </p>
                    ) : (
                      selectedPreset.additives.map((add, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl border border-amber-200 bg-amber-50 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-amber-900">{add.code} · {add.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-amber-100 text-amber-800">
                              {add.safety}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#475569] mt-1">{add.note}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* ============ FOOTER DISCLAIMER BAR MATCHING EXACT MOCKUP ============ */}
        <p className="text-center text-xs text-[#94A3B8]">
          AETHRIZ Food Vision supports nutritional awareness. It does not replace medical advice, allergen guarantees or clinical dietary diagnosis.
        </p>

      </main>
    </div>
  );
}
