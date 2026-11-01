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
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  sugar: number;
  allergens: string[];
  healthyIngredients: string[];
  additives: { code: string; name: string; safety: "safe" | "caution" | "avoid"; note: string }[];
  clinicalVerdict: string;
}

const PRESET_FOODS: FoodPreset[] = [
  {
    id: "label-scan",
    name: "Almond & Flax Seed Granola",
    nameHi: "बादाम एवं अलसी ग्रेनोला",
    category: "Packaged Snack / Breakfast",
    fileName: "label_scan.jpg",
    fileSize: "340 KB",
    healthScore: 84,
    glycemicIndex: 38,
    giRating: "Low",
    calories: 220,
    protein: 8.5,
    carbs: 24.0,
    fats: 9.8,
    fiber: 6.2,
    sugar: 4.5,
    allergens: ["Tree nuts (Almonds)"],
    healthyIngredients: ["Rolled whole oats", "Raw California almonds", "Golden flaxseeds", "Chia seeds", "Organic cinnamon"],
    additives: [
      { code: "E306", name: "Natural Tocopherols (Vitamin E)", safety: "safe", note: "Plant-derived antioxidant protecting healthy oils" }
    ],
    clinicalVerdict: "Clean formulation with high beta-glucan soluble fiber that prevents postprandial glucose spikes and supports optimal lipid metabolism."
  },
  {
    id: "thali-scan",
    name: "Dal Tadka with Brown Rice & Bhindi Sabzi",
    nameHi: "दाल तड़का, ब्राउन राइस एवं भिंडी सब्जी",
    category: "Home Cooked Meal Plate",
    fileName: "thali_photo.jpg",
    fileSize: "480 KB",
    healthScore: 92,
    glycemicIndex: 42,
    giRating: "Low",
    calories: 385,
    protein: 16.4,
    carbs: 52.0,
    fats: 8.5,
    fiber: 9.6,
    sugar: 2.1,
    allergens: ["None detected"],
    healthyIngredients: ["Moong & Toor dal", "Brown basmati rice", "Fresh okra (bhindi)", "Turmeric & cumin", "Cold-pressed mustard oil"],
    additives: [],
    clinicalVerdict: "Exemplary balanced Indian plate. 2:1 ratio of vegetables and lentils to grains aligns with your glucose stability and HbA1c target."
  },
  {
    id: "snack-scan",
    name: "Roasted Makhana (Foxnuts) with Himalayan Pink Salt",
    nameHi: "भुना हुआ मखाना (सेंधा नमक)",
    category: "Natural Superfood Snack",
    fileName: "makhana_packet.jpg",
    fileSize: "290 KB",
    healthScore: 94,
    glycemicIndex: 32,
    giRating: "Low",
    calories: 140,
    protein: 4.8,
    carbs: 22.0,
    fats: 2.2,
    fiber: 4.2,
    sugar: 0.2,
    allergens: ["None detected"],
    healthyIngredients: ["Air-roasted fox nuts", "A2 Ghee (light mist)", "Himalayan rock salt", "Black pepper"],
    additives: [],
    clinicalVerdict: "Low glycemic, low sodium, and potassium-rich. An ideal afternoon snack that will not cause insulin or blood sugar surges."
  }
];

export default function FoodScannerPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // Attached file chip state matching exact mockup
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string } | null>({
    name: "label_scan.jpg",
    size: "340 KB",
  });
  const [userQuery, setUserQuery] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<FoodPreset>(PRESET_FOODS[0]);

  // Exact 3 checkboxes from the mockup:
  // Checked: Allergen scan, Diabetic glycaemic index
  // Unchecked: Additive check
  const [allergenScan, setAllergenScan] = useState(true);
  const [glycemicScan, setGlycemicScan] = useState(true);
  const [additiveCheck, setAdditiveCheck] = useState(false);

  // Vision scanning simulation
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const session = getSession();
    if (session) {
      setUser(session);
    }
  }, []);

  const handleChipClick = (promptText: string, presetIndex: number) => {
    setUserQuery(promptText);
    const preset = PRESET_FOODS[presetIndex];
    setSelectedPreset(preset);
    setAttachedFile({ name: preset.fileName, size: preset.fileSize });
    handleRunScan(preset);
  };

  const handleRunScan = (presetToUse = selectedPreset) => {
    setIsScanning(true);
    setScanProgress(25);
    setShowResults(false);

    const t1 = setTimeout(() => setScanProgress(60), 200);
    const t2 = setTimeout(() => setScanProgress(90), 450);
    const t3 = setTimeout(() => {
      setScanProgress(100);
      setIsScanning(false);
      setShowResults(true);
    }, 700);

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
      setSelectedPreset(PRESET_FOODS[0]);
    }
  };

  const userName = user?.name || "Aarav Kumar";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#F4F5F8] text-[#1D1F22] font-sans antialiased selection:bg-[#E3202B] selection:text-white pb-20 relative overflow-x-hidden">
      {/* Signature Ambient Red Navbar Glow */}
      <div className="ae-top-nav-glow" />
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,.pdf"
        className="hidden"
      />

      {/* ============ TOP FLOATING NAVBAR MATCHING EXACT MOCKUP ============ */}
      <header className="sticky top-4 z-40 px-4 sm:px-6">
        <nav
          aria-label="Main"
          className="relative max-w-[1100px] mx-auto p-2 pl-4 sm:pl-5 flex items-center justify-between gap-3 rounded-full border border-white/80 shadow-[0_20px_50px_rgba(220,120,140,0.12),0_2px_8px_rgba(29,31,34,0.04),inset_0_1.5px_0_rgba(255,255,255,0.95)]"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.78) 50%, rgba(255,255,255,0.90) 100%)",
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
            <span
              className="font-semibold text-[15.5px] tracking-[0.12em] text-[#1D1F22]"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              AETHRIZ
            </span>
          </Link>

          {/* Center Navigation Pills */}
          <div className="hidden md:flex items-center gap-1 text-[13px] font-medium text-[#545B61]">
            <Link
              href="/dashboard"
              className="px-3.5 py-1.5 rounded-full hover:text-[#1D1F22] hover:bg-white/50 transition-all"
            >
              Dashboard
            </Link>
            <Link
              href="/health-analysis"
              className="px-3.5 py-1.5 rounded-full hover:text-[#1D1F22] hover:bg-white/50 transition-all"
            >
              Health Analysis
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
              className="px-4 py-1.5 rounded-full bg-white text-[#1D1F22] font-semibold shadow-xs border border-slate-200/60 transition-all"
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

          {/* Right User Avatar */}
          <Link
            href="/profile"
            className="w-8 h-8 rounded-full bg-[#FCECEE] border border-[#F6C6CC] text-[#7F1D1D] flex items-center justify-center font-bold text-xs shadow-2xs hover:scale-105 transition-transform"
          >
            {userInitials || "AK"}
          </Link>
        </nav>
      </header>

      {/* ============ MAIN VIEWPORT CONTAINER ============ */}
      <main className="max-w-[1060px] mx-auto px-4 sm:px-6 pt-8 sm:pt-12 space-y-6">
        
        {/* ============ SUBHEADER MATCHING EXACT MOCKUP ============ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            {/* Status Eyebrow */}
            <div className="flex items-center gap-2 text-xs text-[#64748B]">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-semibold text-[#475569]">VISION ENGINE v2.4 READY</span>
              <span>·</span>
              <span>Indian food composition data synced</span>
            </div>

            {/* Main Title */}
            <h1
              className="text-4xl sm:text-5xl font-light tracking-tight text-[#1D1F22] pt-1"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              AI Food Scanner.
            </h1>

            {/* Subtitle */}
            <p className="text-sm text-[#475569] leading-relaxed pt-1">
              Scan a packet, an ingredient list or a photo of your thali — and see what it means for you, not an average person.
            </p>
          </div>

          {/* Private Analysis Pill Card */}
          <div className="bg-white/95 rounded-2xl p-3.5 px-4 border border-slate-200/80 shadow-[0_4px_16px_rgba(29,31,34,0.03)] flex items-center gap-3 self-start md:self-auto flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1D1F22] leading-tight">Private analysis</h4>
              <p className="text-[11px] text-[#64748B]">Photos are not kept after scanning</p>
            </div>
          </div>
        </div>

        {/* ============ BIG CENTRAL AI VISION SCANNER CARD ============ */}
        <div className="bg-white rounded-[36px] border border-slate-200/70 shadow-[0_20px_60px_rgba(29,31,34,0.04)] p-8 sm:p-14 text-center relative overflow-hidden">
          
          {/* Floating Left 3D Pearl Sphere (Soft Peach/Pink) */}
          <div
            className="absolute left-8 sm:left-12 top-20 sm:top-24 w-24 sm:w-28 h-24 sm:h-28 rounded-full pointer-events-none shadow-[0_12px_32px_rgba(244,184,193,0.35)]"
            style={{
              background: "radial-gradient(circle at 35% 35%, #FFF2F4 0%, #FED9DF 45%, #F5BAC3 100%)",
            }}
          />

          {/* Floating Right 3D Pearl Sphere (Soft Lavender) */}
          <div
            className="absolute right-8 sm:right-12 bottom-12 sm:bottom-16 w-32 sm:w-36 h-32 sm:h-36 rounded-full pointer-events-none shadow-[0_16px_40px_rgba(221,207,242,0.3)]"
            style={{
              background: "radial-gradient(circle at 35% 35%, #FCF9FE 0%, #EFE7FA 45%, #DFD2F3 100%)",
            }}
          />

          {/* Center Scan Reticle Icon Badge */}
          <div className="relative inline-block mb-6">
            <div className="w-16 h-16 rounded-2xl bg-white border border-red-100 shadow-[0_10px_25px_rgba(227,32,43,0.14)] flex items-center justify-center text-[#E3202B]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                <line x1="7" y1="12" x2="17" y2="12" />
                <line x1="7" y1="9" x2="17" y2="9" />
                <line x1="7" y1="15" x2="17" y2="15" />
              </svg>
            </div>
            {/* Top-Right Red Dot Indicator */}
            <span className="w-3 h-3 rounded-full bg-[#E3202B] absolute -top-1 -right-1 ring-2 ring-white shadow-xs" />
          </div>

          {/* Main Question Heading */}
          <h2
            className="text-2xl sm:text-3xl lg:text-[32px] font-normal text-[#1D1F22] tracking-tight max-w-xl mx-auto leading-tight"
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            What would you like to know about your food?
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-[#64748B] mt-2 mb-7 max-w-md mx-auto leading-relaxed">
            Upload a food label, an ingredient list or a dish photo — or ask a question.
          </p>

          {/* 3 Quick Action Chips Matching Exact Icons and Text */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <button
              type="button"
              onClick={() => handleChipClick("Analyse this food label for diabetic safety, hidden palm oil, and glucose spike potential.", 0)}
              className="px-4 py-2 rounded-full text-xs font-medium bg-white text-[#475569] border border-slate-200/90 hover:border-slate-300 hover:text-[#1D1F22] hover:bg-slate-50 transition-all cursor-pointer shadow-[0_2px_8px_rgba(29,31,34,0.03)] flex items-center gap-2"
            >
              {/* Scan Reticle Icon */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E3202B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
              </svg>
              <span>Analyse a food label</span>
            </button>

            <button
              type="button"
              onClick={() => handleChipClick("Explain all ingredients, check for artificial emulsifiers, and flag potential allergens.", 0)}
              className="px-4 py-2 rounded-full text-xs font-medium bg-white text-[#475569] border border-slate-200/90 hover:border-slate-300 hover:text-[#1D1F22] hover:bg-slate-50 transition-all cursor-pointer shadow-[0_2px_8px_rgba(29,31,34,0.03)] flex items-center gap-2"
            >
              {/* Chemistry Flask Icon */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E3202B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 2v7.31L4.1 19.3A2 2 0 0 0 5.8 22h12.4a2 2 0 0 0 1.7-2.7L14 9.31V2" />
                <line x1="8" y1="2" x2="16" y2="2" />
                <line x1="8.5" y1="14" x2="15.5" y2="14" />
              </svg>
              <span>Explain the ingredients</span>
            </button>

            <button
              type="button"
              onClick={() => handleChipClick("Estimate calories and compare nutritional balance for this meal plate.", 1)}
              className="px-4 py-2 rounded-full text-xs font-medium bg-white text-[#475569] border border-slate-200/90 hover:border-slate-300 hover:text-[#1D1F22] hover:bg-slate-50 transition-all cursor-pointer shadow-[0_2px_8px_rgba(29,31,34,0.03)] flex items-center gap-2"
            >
              {/* Bar Chart Icon */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E3202B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              <span>Compare nutrition</span>
            </button>
          </div>

          {/* ============ SEARCH / PROMPT PILL CONTAINER ============ */}
          <div className="max-w-3xl mx-auto relative z-10">
            <div className="relative flex items-center bg-white border border-slate-200 rounded-full p-2 pl-3 shadow-[0_6px_20px_rgba(29,31,34,0.04)] focus-within:ring-2 focus-within:ring-[#E3202B]/20 focus-within:border-[#E3202B] transition-all">
              
              {/* Camera Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors"
                title="Upload or capture photo"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </button>

              {/* Attached File Chip (e.g. label_scan.jpg 340 KB) */}
              {attachedFile && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-[#E3202B] text-xs font-semibold mr-2 flex-shrink-0 border border-red-100/90 shadow-2xs">
                  <span>{attachedFile.name}</span>
                  <span className="text-[10.5px] font-mono text-[#E3202B]/70 font-normal">
                    {attachedFile.size}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAttachedFile(null)}
                    className="text-[#E3202B]/60 hover:text-[#E3202B] ml-0.5 p-0.5 cursor-pointer font-bold leading-none text-sm"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Text Input with Mockup Placeholder */}
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRunScan();
                }}
                placeholder="Ask about ingredients, allergens or nutrition..."
                className="w-full bg-transparent text-sm text-[#1D1F22] placeholder:text-[#94A3B8] focus:outline-none px-2"
              />

              {/* Red Circular Submit Arrow Button */}
              <button
                type="button"
                disabled={isScanning}
                onClick={() => handleRunScan()}
                className="w-10 h-10 rounded-full bg-[#E3202B] hover:bg-[#C8161F] text-white flex items-center justify-center flex-shrink-0 shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-60"
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

            {/* Checkbox Toggles Matching Exact Mockup */}
            <div className="flex flex-wrap items-center justify-start sm:justify-center gap-6 mt-4 px-3 text-xs font-medium text-[#475569]">
              {/* Allergen scan (Checked) */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={allergenScan}
                  onChange={(e) => setAllergenScan(e.target.checked)}
                  className="w-4 h-4 rounded text-[#E3202B] focus:ring-[#E3202B] border-slate-300 cursor-pointer accent-[#E3202B]"
                />
                <span>Allergen scan</span>
              </label>

              {/* Diabetic glycaemic index (Checked) */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={glycemicScan}
                  onChange={(e) => setGlycemicScan(e.target.checked)}
                  className="w-4 h-4 rounded text-[#E3202B] focus:ring-[#E3202B] border-slate-300 cursor-pointer accent-[#E3202B]"
                />
                <span>Diabetic glycaemic index</span>
              </label>

              {/* Additive check (Unchecked by default in mockup) */}
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
          {showResults && (
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
                    {selectedPreset.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                    {selectedPreset.clinicalVerdict}
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
                      {selectedPreset.giRating} Glycemic
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
                      Whole Ingredients
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
                      Additive & Allergen Safety
                    </h4>
                    <span className="text-[10px] font-mono text-[#E3202B] bg-red-50 px-2 py-0.5 rounded-full font-bold border border-red-200">
                      Clinical Scan
                    </span>
                  </div>

                  {/* Allergen */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs">
                    <span className="font-semibold text-[#1D1F22] block mb-1">
                      Detected Allergens:
                    </span>
                    <span className="text-[#64748B]">
                      {selectedPreset.allergens.join(", ")}
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

        {/* ============ BOTTOM NOTE BAR MATCHING EXACT MOCKUP ============ */}
        <div className="bg-white/90 border border-slate-200/80 rounded-full px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#64748B] shadow-[0_2px_8px_rgba(29,31,34,0.02)]">
          <p className="leading-snug">
            <span className="font-bold text-[#E3202B]">Note:</span> Nutrition estimates and label readings are AI-assisted. They don&apos;t replace a dietitian&apos;s advice or a medical diagnosis.
          </p>
          <div className="flex items-center gap-1.5 text-emerald-700 font-medium flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Photos are not stored</span>
          </div>
        </div>

      </main>
    </div>
  );
}
