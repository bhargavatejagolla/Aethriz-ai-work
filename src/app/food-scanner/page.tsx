"use client";

import React, { useState, useEffect } from "react";
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
  imageThumbnail: string;
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
    category: "Packaged Snack / Breakfast",
    fileName: "granola_label_scan.jpg",
    fileSize: "340 KB",
    imageThumbnail: "🥣",
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
    name: "Yellow Dal Tadka with Brown Rice & Bhindi Sabzi",
    nameHi: "दाल तड़का, ब्राउन राइस एवं भिंडी सब्जी",
    category: "Home Cooked Meal Plate",
    fileName: "indian_thali_plate.jpg",
    fileSize: "480 KB",
    imageThumbnail: "🍛",
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
    category: "Packaged Health Snack",
    fileName: "protein_bar_nutrition.jpg",
    fileSize: "290 KB",
    imageThumbnail: "🍫",
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
  
  // Interactive state
  const [selectedPreset, setSelectedPreset] = useState<FoodPreset>(PRESET_FOODS[0]);
  const [userPrompt, setUserPrompt] = useState(
    "Is this granola safe for pre-diabetic blood sugar spikes, and does it contain hidden palm oil?"
  );
  const [allergenScan, setAllergenScan] = useState(true);
  const [glycemicScan, setGlycemicScan] = useState(true);
  const [additiveCheck, setAdditiveCheck] = useState(true);

  // Scanning simulation
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [analysisCompleted, setAnalysisCompleted] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "ingredients" | "metabolic">("overview");

  // Free trial tracking
  const [trialUsed, setTrialUsed] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (session) {
      setUser(session);
      if (session.language && session.language.includes("हिन्दी")) {
        setLanguage("hi");
      }
    }
  }, []);

  const handleRunAnalysis = () => {
    setIsScanning(true);
    setScanProgress(15);
    setAnalysisCompleted(false);

    const t1 = setTimeout(() => setScanProgress(45), 300);
    const t2 = setTimeout(() => setScanProgress(78), 650);
    const t3 = setTimeout(() => {
      setScanProgress(100);
      setIsScanning(false);
      setAnalysisCompleted(true);
      setTrialUsed(true);
    }, 950);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  };

  const handleSelectPreset = (preset: FoodPreset) => {
    setSelectedPreset(preset);
    setUserPrompt(
      preset.id === "granola"
        ? "Is this granola safe for pre-diabetic blood sugar spikes, and does it contain hidden palm oil?"
        : preset.id === "dal-plate"
        ? "Estimate calories and check if this thali supports my HbA1c glucose target."
        : "Check additives, artificial sweeteners, and net carbohydrates."
    );
    handleRunAnalysis();
  };

  const userName = user?.name?.split(" ")[0] || "Aarav";

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-[#1D1F22] font-sans antialiased selection:bg-[#E3202B] selection:text-white pb-16">
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
      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        
        {/* ============ SUBHEADER: TITLE & 3D RETICLE ============ */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/70 backdrop-blur-xl rounded-[32px] p-6 sm:p-8 border border-white/80 shadow-[0_12px_36px_rgba(29,31,34,0.04)] relative overflow-hidden">
          {/* Ambient Crimson Halo */}
          <div
            className="absolute -right-16 -top-16 w-56 h-56 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(227,32,43,0.18) 0%, transparent 70%)",
              filter: "blur(28px)",
            }}
          />

          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-[#E3202B] bg-red-50 border border-red-200/80 px-2.5 py-0.5 rounded-full">
                VISION ENGINE V2.4
              </span>
              <span className="text-xs text-[#64748B] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Multimodal Vision
              </span>
            </div>

            <h1
              className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1D1F22]"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              {language === "hi"
                ? "खाद्य एवं पोषण स्कैनर।"
                : "AI Food & Product Scanner."}
            </h1>

            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              {language === "hi"
                ? "खाद्य लेबल, पैकेज्ड स्नैक्स या भोजन की थाली को स्कैन करें। त्वरित मैक्रोन्यूट्रिएंट्स, हानिकारक एडिटिव्स और आपकी व्यक्तिगत रक्त शर्करा के अनुकूल सटीक विश्लेषण प्राप्त करें।"
                : "Scan packaged food labels, ingredient lists, or your meal plate. Instant macronutrient breakdown, additive safety detection, and personalized glycemic response aligned with your health telemetry."}
            </p>
          </div>

          {/* Right: 3D Camera Reticle & Pearl Sphere */}
          <div className="relative z-10 flex items-center gap-4 self-center lg:self-auto">
            <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-slate-900 to-[#18191E] border border-white/20 p-2 shadow-xl flex items-center justify-center overflow-hidden">
              {/* Reticle Scanner Line */}
              <div className="absolute inset-x-2 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#E3202B] to-transparent animate-pulse" />
              
              {/* 3D Glowing Red Sphere */}
              <div
                className="w-14 h-14 rounded-full shadow-[0_0_24px_rgba(227,32,43,0.7)] flex items-center justify-center text-white"
                style={{
                  background: "radial-gradient(circle at 35% 35%, #FF6469 0%, #E3202B 55%, #7F1D1D 100%)",
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>

              {/* Viewfinder Corner Marks */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-red-400" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-red-400" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-red-400" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-red-400" />
            </div>
          </div>
        </div>

        {/* ============ MAIN INTERACTIVE COMMAND CARD ============ */}
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-slate-200/80 shadow-[0_16px_40px_rgba(29,31,34,0.05)] space-y-6">
          
          {/* Quick Action Preset Chips */}
          <div>
            <span className="text-[10.5px] font-mono uppercase tracking-wider text-[#94A3B8] font-bold block mb-2.5">
              {language === "hi" ? "त्वरित परीक्षण नमूने (1-क्लिक टेस्ट)" : "1-CLICK CLINICAL SAMPLE PRESETS"}
            </span>

            <div className="flex flex-wrap items-center gap-2">
              {PRESET_FOODS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                    selectedPreset.id === preset.id
                      ? "bg-[#1D1F22] text-white shadow-xs scale-[1.01]"
                      : "bg-[#F8FAFC] text-[#475569] border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-sm">{preset.imageThumbnail}</span>
                  <span>{language === "hi" ? preset.nameHi : preset.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    selectedPreset.id === preset.id ? "bg-white/20 text-white" : "bg-slate-200/70 text-[#64748B]"
                  }`}>
                    {preset.category}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Query Prompt & Attachment Box */}
          <div className="p-5 sm:p-6 rounded-[24px] bg-[#F8FAFC] border border-slate-200/90 space-y-4">
            
            {/* Active Attachment Chip */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-base">{selectedPreset.imageThumbnail}</span>
                <div className="text-left">
                  <span className="text-xs font-semibold text-[#1D1F22] block leading-tight">
                    {selectedPreset.fileName}
                  </span>
                  <span className="text-[10px] text-[#94A3B8] font-mono">
                    {selectedPreset.fileSize} · High Resolution Scan
                  </span>
                </div>
                <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px] font-bold ml-1">
                  ✓
                </span>
              </div>

              <div className="text-[11px] text-[#64748B] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#E3202B] ae-pulse-glow" />
                <span>Camera Ready</span>
              </div>
            </div>

            {/* Natural Language Prompt Input */}
            <div>
              <label className="block text-xs font-semibold text-[#1D1F22] mb-1.5">
                {language === "hi"
                  ? "आप इस खाद्य पदार्थ के बारे में क्या जानना चाहते हैं?"
                  : "What would you like to know about your food?"}
              </label>
              <textarea
                rows={2}
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Ask anything about this food, ingredients, diabetic safety, or preservatives..."
                className="w-full p-3.5 rounded-2xl bg-white border border-slate-200 text-sm text-[#1D1F22] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#E3202B]/20 focus:border-[#E3202B] transition-all resize-none shadow-2xs"
              />
            </div>

            {/* Bottom Controls: Toggles & Scan Button */}
            <div className="pt-2 border-t border-slate-200/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Checkboxes / Analysis Filters */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#475569]">
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

              {/* Action Button */}
              <button
                type="button"
                disabled={isScanning}
                onClick={handleRunAnalysis}
                className="py-3 px-8 rounded-full text-xs font-semibold text-white shadow-[0_10px_24px_rgba(29,31,34,0.18)] hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                style={{
                  background: "linear-gradient(180deg, #32363A 0%, #1D1F22 100%)",
                }}
              >
                {isScanning ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Vision AI Scanning {scanProgress}%</span>
                  </>
                ) : (
                  <>
                    <span className="text-red-400">✦</span>
                    <span>{language === "hi" ? "स्कैन एवं विश्लेषण करें" : "Scan and analyse"}</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ============ LIVE ANALYSIS RESULTS SECTION ============ */}
          {analysisCompleted && (
            <div className="ae-fade-in space-y-6 pt-2">
              
              {/* Header: Food Identity & Health Score */}
              <div className="p-5 sm:p-6 rounded-[24px] bg-gradient-to-br from-slate-900 via-[#18191E] to-[#1F0D12] text-white relative overflow-hidden shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#E3202B] font-bold">
                      AETHRIZ CLINICAL NUTRITION VERDICT
                    </span>
                    <span className="text-white/40">·</span>
                    <span className="text-xs text-white/70">{selectedPreset.category}</span>
                  </div>

                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    {language === "hi" ? selectedPreset.nameHi : selectedPreset.name}
                  </h2>

                  <p className="text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed">
                    {language === "hi" ? selectedPreset.clinicalVerdictHi : selectedPreset.clinicalVerdict}
                  </p>
                </div>

                {/* Score & GI Dials */}
                <div className="flex items-center gap-5 relative z-10 self-start md:self-auto">
                  {/* Health Score */}
                  <div className="text-center p-3 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xs min-w-[90px]">
                    <span className="text-2xl font-extrabold text-emerald-400 block leading-none">
                      {selectedPreset.healthScore}
                    </span>
                    <span className="text-[10px] text-white/70 block mt-1 uppercase font-mono">
                      Health Score
                    </span>
                  </div>

                  {/* Glycemic Index */}
                  <div className="text-center p-3 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xs min-w-[90px]">
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
                  <span className="text-[10px] text-emerald-600 font-medium">High soluble</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 text-center">
                  <span className="text-xs text-[#64748B] block">Carbohydrates</span>
                  <span className="text-xl font-bold text-[#1D1F22] mt-0.5 block">{selectedPreset.carbs} g</span>
                  <span className="text-[10px] text-[#64748B]">Slow-release</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 text-center">
                  <span className="text-xs text-[#64748B] block">Fats</span>
                  <span className="text-xl font-bold text-[#1D1F22] mt-0.5 block">{selectedPreset.fats} g</span>
                  <span className="text-[10px] text-emerald-600 font-medium">Omega-3 rich</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 text-center">
                  <span className="text-xs text-[#64748B] block">Free Sugar</span>
                  <span className="text-xl font-bold text-amber-600 mt-0.5 block">{selectedPreset.sugar} g</span>
                  <span className="text-[10px] text-amber-600 font-medium">Natural fruit</span>
                </div>
              </div>

              {/* Sub-Tabs: Overview, Ingredients, Additives & Safety */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                
                {/* Ingredients & Beneficial Compounds */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#1D1F22]">
                      {language === "hi" ? "मुख्य प्राकृतिक तत्व" : "Whole Ingredients"}
                    </h3>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                      100% Verified
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

                {/* Additives, Preservatives & Allergen Check */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#1D1F22]">
                      {language === "hi" ? "एलर्जी एवं एडिटिव जांच" : "Additive & Allergen Safety"}
                    </h3>
                    <span className="text-[10px] font-mono text-[#E3202B] bg-red-50 px-2 py-0.5 rounded-full font-bold border border-red-200">
                      Clinical Scan
                    </span>
                  </div>

                  {/* Allergen */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
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
                    <span className="font-semibold text-xs text-[#1D1F22] block">
                      {language === "hi" ? "खाद्य योजक (एडिटिव्स):" : "Food Additives & Preservatives:"}
                    </span>
                    {selectedPreset.additives.length === 0 ? (
                      <p className="text-xs text-emerald-700 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Zero artificial preservatives, sweeteners or industrial fillers found.</span>
                      </p>
                    ) : (
                      selectedPreset.additives.map((add, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/60 text-xs">
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

        {/* ============ FREE TRIAL & MOBILE APP BANNER (PER SPEC) ============ */}
        <div
          className="rounded-[32px] p-6 sm:p-8 relative overflow-hidden shadow-xs border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
          style={{
            background: "linear-gradient(135deg, #FFFFFF 0%, #FFF7F8 100%)",
          }}
        >
          {/* Ambient Crimson Beacon */}
          <div
            className="absolute right-36 -top-10 w-40 h-40 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(227,32,43,0.15) 0%, transparent 70%)",
              filter: "blur(20px)",
            }}
          />

          <div className="relative z-10 max-w-xl space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#E3202B] font-bold bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                WEB TRIAL 1/1 USED
              </span>
              <span className="text-xs font-semibold text-[#1D1F22]">Unlock Full Vision in Mobile App</span>
            </div>
            <h3
              className="text-xl sm:text-2xl font-bold text-[#1D1F22] tracking-tight"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              Scan groceries in real-time with the AETHRIZ Mobile App.
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Continuous barcode scanning, pantry audit, offline camera scanner, and daily meal logging with direct doctor synchronization.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <Link
              href="/register"
              className="px-6 py-3 rounded-full text-xs font-semibold text-white shadow-xs hover:opacity-95 transition-all cursor-pointer flex items-center gap-2"
              style={{ background: "linear-gradient(180deg, #32363A 0%, #1D1F22 100%)" }}
            >
              <span>Download Mobile App</span>
              <span className="font-bold">→</span>
            </Link>

            <Link
              href="/dashboard"
              className="px-5 py-3 rounded-full text-xs font-semibold text-[#1D1F22] bg-white border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
            >
              Dashboard
            </Link>
          </div>
        </div>

        {/* ============ FOOTER DISCLAIMER ============ */}
        <p className="text-center text-xs text-[#94A3B8] pt-2">
          AETHRIZ Vision Engine supports nutritional awareness. It does not replace medical advice, allergen guarantees or clinical dietary diagnosis.
        </p>

      </main>
    </div>
  );
}
