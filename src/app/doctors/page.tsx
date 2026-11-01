"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

export interface Doctor {
  id: string;
  name: string;
  specialty: "Endocrinology" | "Cardiology" | "Nutrition" | "Thyroid" | "General Physician";
  experienceYears: number;
  rating: number;
  reviewCount: number;
  initials: string;
  avatarBg: string;
  avatarTextColor: string;
  isAiMatch?: boolean;
  languages: string[];
  nextAvailable: string;
  hasVideo: boolean;
  hasClinic: boolean;
  consultFee: number;
  location: string;
  bio: string;
}

const DOCTORS_DATA: Doctor[] = [
  {
    id: "ananya-rao",
    name: "Dr. Ananya Rao",
    specialty: "Endocrinology",
    experienceYears: 14,
    rating: 4.9,
    reviewCount: 412,
    initials: "AR",
    avatarBg: "bg-[#FCECEE]",
    avatarTextColor: "text-[#E3202B]",
    isAiMatch: true,
    languages: ["English", "हिन्दी", "ಕನ್ನಡ"],
    nextAvailable: "Today, 6:30 PM",
    hasVideo: true,
    hasClinic: true,
    consultFee: 800,
    location: "Koramangala, Bengaluru",
    bio: "Specialises in metabolic syndromic management, HbA1c reversal protocols, and hormonal homeostasis.",
  },
  {
    id: "vikram-menon",
    name: "Dr. Vikram Menon",
    specialty: "Cardiology",
    experienceYears: 18,
    rating: 4.8,
    reviewCount: 538,
    initials: "VM",
    avatarBg: "bg-[#EFF6FF]",
    avatarTextColor: "text-[#2563EB]",
    isAiMatch: false,
    languages: ["English", "മലയാളം"],
    nextAvailable: "Tomorrow, 10:00 AM",
    hasVideo: true,
    hasClinic: true,
    consultFee: 1200,
    location: "Indiranagar, Bengaluru",
    bio: "Senior Interventional Cardiologist. Focuses on lipid profile optimisation and preventative cardiovascular health.",
  },
  {
    id: "meera-iyer",
    name: "Dr. Meera Iyer",
    specialty: "Nutrition",
    experienceYears: 9,
    rating: 4.9,
    reviewCount: 298,
    initials: "MI",
    avatarBg: "bg-[#ECFDF5]",
    avatarTextColor: "text-[#059669]",
    isAiMatch: true,
    languages: ["English", "தமிழ்", "हिन्दी"],
    nextAvailable: "Today, 7:15 PM",
    hasVideo: true,
    hasClinic: false,
    consultFee: 600,
    location: "Jayanagar, Bengaluru",
    bio: "Clinical nutritionist specialising in glycemic load regulation, regional Indian diet integration, and gut microbiome health.",
  },
  {
    id: "arjun-sethi",
    name: "Dr. Arjun Sethi",
    specialty: "General Physician",
    experienceYears: 11,
    rating: 4.7,
    reviewCount: 821,
    initials: "AS",
    avatarBg: "bg-[#FEF3C7]",
    avatarTextColor: "text-[#D97706]",
    isAiMatch: false,
    languages: ["English", "हिन्दी", "ਪੰਜਾਬੀ"],
    nextAvailable: "In 30 min",
    hasVideo: true,
    hasClinic: true,
    consultFee: 500,
    location: "Whitefield, Bengaluru",
    bio: "Primary care physician managing multi-system chronic health patterns, acute triage, and periodic metabolic health checks.",
  },
  {
    id: "farah-siddiqui",
    name: "Dr. Farah Siddiqui",
    specialty: "Thyroid",
    experienceYears: 12,
    rating: 4.8,
    reviewCount: 233,
    initials: "FS",
    avatarBg: "bg-[#FFF1F2]",
    avatarTextColor: "text-[#E11D48]",
    isAiMatch: false,
    languages: ["English", "اردو", "हिन्दी"],
    nextAvailable: "Sat, 11:30 AM",
    hasVideo: false,
    hasClinic: true,
    consultFee: 900,
    location: "Bandra West, Mumbai",
    bio: "Endocrine specialist with dedicated clinical practice in Hashimoto's, subclinical hypothyroidism, and T3/T4 balance.",
  },
  {
    id: "rohan-kulkarni",
    name: "Dr. Rohan Kulkarni",
    specialty: "Endocrinology",
    experienceYears: 8,
    rating: 4.6,
    reviewCount: 154,
    initials: "RK",
    avatarBg: "bg-[#EEF2FF]",
    avatarTextColor: "text-[#4F46E5]",
    isAiMatch: true,
    languages: ["English", "मराठी"],
    nextAvailable: "Tomorrow, 5:00 PM",
    hasVideo: true,
    hasClinic: false,
    consultFee: 700,
    location: "Shivajinagar, Pune",
    bio: "Specialises in pre-diabetic interventions, continuous glucose telemetry (CGM), and insulin resistance reversal.",
  },
  {
    id: "priya-banerjee",
    name: "Dr. Priya Banerjee",
    specialty: "Cardiology",
    experienceYears: 16,
    rating: 4.9,
    reviewCount: 367,
    initials: "PB",
    avatarBg: "bg-[#F0FDFA]",
    avatarTextColor: "text-[#0D9488]",
    isAiMatch: false,
    languages: ["English", "বাংলা"],
    nextAvailable: "Mon, 9:30 AM",
    hasVideo: false,
    hasClinic: true,
    consultFee: 1100,
    location: "Salt Lake, Kolkata",
    bio: "Consultant preventative cardiologist with emphasis on arterial elasticity, ApoB / LDL risk mitigation, and lifestyle protocols.",
  },
  {
    id: "kavya-reddy",
    name: "Dr. Kavya Reddy",
    specialty: "Nutrition",
    experienceYears: 7,
    rating: 4.7,
    reviewCount: 189,
    initials: "KR",
    avatarBg: "bg-[#FFF7ED]",
    avatarTextColor: "text-[#EA580C]",
    isAiMatch: false,
    languages: ["English", "తెలుగు"],
    nextAvailable: "Today, 8:00 PM",
    hasVideo: true,
    hasClinic: true,
    consultFee: 550,
    location: "Banjara Hills, Hyderabad",
    bio: "Nutritional biochemist focusing on insulin sensitivity improvement, anti-inflammatory whole-food plans, and athletic recovery.",
  },
];

const SPECIALTY_OPTIONS = [
  "All",
  "Endocrinology",
  "Cardiology",
  "Nutrition",
  "Thyroid",
  "General Physician",
] as const;

export default function FindDoctorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("All");
  const [selectedMode, setSelectedMode] = useState<"All" | "Video" | "In-clinic">("All");
  const [selectedCity, setSelectedCity] = useState("Bengaluru, KA");
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [sortBy, setSortBy] = useState<"soonest" | "rating" | "fee">("soonest");

  // Filtering doctors based on search, specialty, and consultation mode
  const filteredDoctors = useMemo(() => {
    return DOCTORS_DATA.filter((doc) => {
      // Specialty filter
      if (selectedSpecialty !== "All" && doc.specialty !== selectedSpecialty) {
        return false;
      }

      // Mode filter
      if (selectedMode === "Video" && !doc.hasVideo) {
        return false;
      }
      if (selectedMode === "In-clinic" && !doc.hasClinic) {
        return false;
      }

      // Search query (name, specialty, condition, language, location)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = doc.name.toLowerCase().includes(q);
        const matchesSpecialty = doc.specialty.toLowerCase().includes(q);
        const matchesLanguages = doc.languages.some((l) => l.toLowerCase().includes(q));
        const matchesLocation = doc.location.toLowerCase().includes(q);
        const matchesBio = doc.bio.toLowerCase().includes(q);

        // Common condition aliases
        const isSugar = q.includes("sugar") || q.includes("glucose") || q.includes("diabetes") || q.includes("hba1c");
        if (isSugar && (doc.specialty === "Endocrinology" || doc.specialty === "Nutrition")) {
          return true;
        }
        const isHeart = q.includes("heart") || q.includes("bp") || q.includes("cholesterol") || q.includes("cardio");
        if (isHeart && doc.specialty === "Cardiology") {
          return true;
        }
        const isThyroid = q.includes("thyroid") || q.includes("tsh") || q.includes("goitre");
        if (isThyroid && (doc.specialty === "Thyroid" || doc.specialty === "Endocrinology")) {
          return true;
        }

        return matchesName || matchesSpecialty || matchesLanguages || matchesLocation || matchesBio;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "fee") return a.consultFee - b.consultFee;
      // "soonest" preserves default verified clinical order
      return 0;
    });
  }, [searchQuery, selectedSpecialty, selectedMode, sortBy]);

  return (
    <div className="min-h-screen bg-[#F4F5F8] text-[#1D1F22] font-sans antialiased selection:bg-[#E3202B] selection:text-white pb-24">
      {/* ============ TOP FLOATING NAVBAR MATCHING EXACT MOCKUP ============ */}
      <header className="sticky top-4 z-40 px-4 sm:px-6">
        <nav
          aria-label="Main"
          className="relative max-w-[1100px] mx-auto p-2 pl-4 sm:pl-5 flex items-center justify-between gap-3 rounded-full border border-white/80 shadow-[0_20px_50px_rgba(220,120,140,0.12),0_2px_8px_rgba(29,31,34,0.04),inset_0_1.5px_0_rgba(255,255,255,0.95)]"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.80) 50%, rgba(255,255,255,0.92) 100%)",
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
            <div className="flex flex-col">
              <span
                className="font-semibold text-[15.5px] tracking-[0.14em] text-[#1D1F22] leading-none"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                AETHRIZ
              </span>
              <span className="text-[8px] font-mono tracking-widest text-[#E3202B] uppercase font-bold mt-0.5">
                BIO-HEALTH AI
              </span>
            </div>
          </Link>

          {/* Center Navigation Pills */}
          <div className="hidden lg:flex items-center gap-1 text-[13px] font-medium text-[#545B61]">
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
              className="px-4 py-1.5 rounded-full bg-white text-[#1D1F22] font-semibold shadow-xs border border-slate-200/70 transition-all"
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
              className="px-3.5 py-1.5 rounded-full hover:text-[#1D1F22] hover:bg-white/50 transition-all"
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

          {/* Right User Avatar Pill Matching Exact Mockup */}
          <Link
            href="/profile"
            className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-[#FCECEE] hover:bg-[#F9DDE1] border border-[#F6C6CC] transition-all cursor-pointer shadow-2xs group"
          >
            <div className="relative w-6 h-6 rounded-full bg-[#E3202B] text-white flex items-center justify-center font-bold text-[10px]">
              AK
              {/* Active Red Dot */}
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#E3202B] border-2 border-white ring-1 ring-red-400" />
            </div>
            <span className="text-xs font-semibold text-[#7F1D1D] hidden sm:inline">
              My profile
            </span>
          </Link>
        </nav>
      </header>

      {/* ============ MAIN VIEWPORT CONTAINER ============ */}
      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        
        {/* ============ BREADCRUMB & HEADER WITH MODE TOGGLE ============ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[#64748B]">Care · Doctors</p>
            <h1
              className="text-4xl sm:text-5xl font-light tracking-tight text-[#1D1F22] mt-1"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              Find the right doctor.
            </h1>
          </div>

          {/* Mode Switcher Pill: All | Video | In-clinic */}
          <div className="flex items-center bg-[#E5E7EB]/70 p-1 rounded-full text-xs font-medium shadow-inner self-start md:self-auto">
            <button
              type="button"
              onClick={() => setSelectedMode("All")}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                selectedMode === "All"
                  ? "bg-white text-[#1D1F22] font-semibold shadow-xs"
                  : "text-[#64748B] hover:text-[#1D1F22]"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setSelectedMode("Video")}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                selectedMode === "Video"
                  ? "bg-white text-[#1D1F22] font-semibold shadow-xs"
                  : "text-[#64748B] hover:text-[#1D1F22]"
              }`}
            >
              Video
            </button>
            <button
              type="button"
              onClick={() => setSelectedMode("In-clinic")}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                selectedMode === "In-clinic"
                  ? "bg-white text-[#1D1F22] font-semibold shadow-xs"
                  : "text-[#64748B] hover:text-[#1D1F22]"
              }`}
            >
              In-clinic
            </button>
          </div>
        </div>

        {/* ============ SEARCH BAR & LOCATION PILL ============ */}
        <div className="relative flex items-center bg-white rounded-full p-2 pl-5 border border-slate-200/80 shadow-[0_4px_20px_rgba(29,31,34,0.03)] focus-within:border-slate-400 focus-within:shadow-[0_6px_24px_rgba(29,31,34,0.06)] transition-all">
          <svg
            className="w-5 h-5 text-[#94A3B8] flex-shrink-0 mr-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search by name, specialty or condition — try "thyroid"'
            className="w-full bg-transparent text-sm sm:text-base text-[#1D1F22] placeholder:text-[#94A3B8] focus:outline-none pr-2"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="p-1 mr-2 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
              title="Clear search"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Location Badge Pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCityPicker(!showCityPicker)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#475569] text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex-shrink-0"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{selectedCity}</span>
            </button>

            {/* City Selector Dropdown */}
            {showCityPicker && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 ae-fade-in text-xs">
                <div className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider text-[#94A3B8]">
                  Select Your City
                </div>
                {["Bengaluru, KA", "Mumbai, MH", "Delhi NCR", "Hyderabad, TS", "Pune, MH", "Kolkata, WB"].map(
                  (city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => {
                        setSelectedCity(city);
                        setShowCityPicker(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                        selectedCity === city
                          ? "bg-slate-100 font-bold text-[#1D1F22]"
                          : "hover:bg-slate-50 text-[#475569]"
                      }`}
                    >
                      <span>{city}</span>
                      {selectedCity === city && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E3202B]" />
                      )}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* ============ SPECIALTY FILTER PILLS ============ */}
        <div className="flex flex-wrap items-center gap-2">
          {SPECIALTY_OPTIONS.map((spec) => {
            const isActive = selectedSpecialty === spec;
            return (
              <button
                key={spec}
                type="button"
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#18191E] text-white shadow-xs"
                    : "bg-white text-[#475569] hover:bg-slate-100 border border-slate-200/80"
                }`}
              >
                {spec}
              </button>
            );
          })}
        </div>

        {/* ============ AI CLINICAL RECOMMENDATION OBSIDIAN CARD ============ */}
        <div
          className="relative rounded-[28px] p-6 sm:p-7 overflow-hidden text-white border border-white/10 shadow-[0_20px_45px_rgba(20,22,25,0.18)]"
          style={{
            background: "linear-gradient(135deg, #18191E 0%, #1A1215 50%, #201116 100%)",
          }}
        >
          {/* Subtle Ambient Red Glow Background */}
          <div
            className="absolute top-1/2 left-10 -translate-y-1/2 w-48 h-48 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(227,32,43,0.35) 0%, transparent 70%)",
              filter: "blur(32px)",
            }}
          />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* Glowing Red Pearl Reticle Graphic */}
              <div className="relative w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 shadow-[0_0_30px_rgba(227,32,43,0.45)]">
                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full border border-red-500/30" />
                {/* Glowing Core Sphere */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: "radial-gradient(circle at 35% 35%, #FF6B72 0%, #E3202B 60%, #99000A 100%)",
                    boxShadow: "inset 0 -2px 6px rgba(0,0,0,0.4), 0 0 16px rgba(227,32,43,0.6)",
                  }}
                >
                  {/* Four-pointed sparkle star */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" className="text-white drop-shadow-xs">
                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                  </svg>
                </div>
              </div>

              {/* Text Message */}
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FF858B]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E3202B] ae-pulse-glow" />
                  <span>AI-matched for you</span>
                </div>
                <h3 className="text-lg sm:text-[19px] font-medium text-white tracking-tight leading-snug">
                  Your last report shows a borderline HbA1c. An endocrinologist is a good next conversation.
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  AETHRIZ can share your summary with the doctor you book, so the visit starts informed.
                </p>
              </div>
            </div>

            {/* Right Action Button */}
            <button
              type="button"
              onClick={() => {
                setSelectedSpecialty("Endocrinology");
                setSearchQuery("");
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#18191E] hover:bg-slate-100 text-xs font-semibold shadow-md transition-all active:scale-95 cursor-pointer flex-shrink-0 self-start md:self-auto"
            >
              <span>Show endocrinologists</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* ============ DOCTOR CARDS GRID HEADER ============ */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm font-semibold text-[#1D1F22]">
            {filteredDoctors.length} {filteredDoctors.length === 1 ? "doctor" : "doctors"} available this week
          </p>

          <div className="flex items-center gap-1 text-xs text-[#64748B]">
            <span>Sorted by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-medium text-[#1D1F22] focus:outline-none cursor-pointer"
            >
              <option value="soonest">soonest available</option>
              <option value="rating">highest rated</option>
              <option value="fee">consult fee</option>
            </select>
          </div>
        </div>

        {/* ============ 3-COLUMN DOCTOR CARDS GRID ============ */}
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-[26px] p-5 sm:p-6 border border-slate-200/80 shadow-[0_8px_30px_rgba(29,31,34,0.03)] hover:shadow-[0_12px_36px_rgba(29,31,34,0.07)] transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header: Avatar & Info */}
                  <div className="flex items-start gap-3.5">
                    {/* Doctor Avatar with Verified Badge */}
                    <div className="relative flex-shrink-0">
                      <div
                        className={`w-12 h-12 rounded-2xl ${doc.avatarBg} ${doc.avatarTextColor} flex items-center justify-center font-bold text-base shadow-2xs`}
                      >
                        {doc.initials}
                      </div>
                      {/* Red Verified Checkmark */}
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#E3202B] text-white flex items-center justify-center border-2 border-white">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    </div>

                    {/* Doctor Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-semibold text-base text-[#1D1F22] truncate group-hover:text-[#E3202B] transition-colors">
                          {doc.name}
                        </h4>
                        {doc.isAiMatch && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-[#E3202B] border border-red-200/80 bg-red-50/50 flex-shrink-0">
                            AI match
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#64748B] mt-0.5">
                        {doc.specialty} · {doc.experienceYears} yrs
                      </p>

                      <div className="flex items-center gap-1 text-xs text-[#1D1F22] font-semibold mt-1">
                        <span className="text-amber-500">★</span>
                        <span>{doc.rating}</span>
                        <span className="text-[#94A3B8] font-normal">
                          ({doc.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Language Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-4">
                    {doc.languages.map((lang) => (
                      <span
                        key={lang}
                        className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#F8FAFC] text-[#475569] border border-slate-200/60"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>

                  {/* Next Available Slot & Modalities */}
                  <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[11px] text-[#94A3B8] block">Next available</span>
                      <span className="font-semibold text-emerald-600">
                        {doc.nextAvailable}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[#64748B]">
                      {doc.hasVideo && (
                        <span
                          className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600"
                          title="Video consultation available"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="23 7 16 12 23 17 23 7" />
                            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                          </svg>
                        </span>
                      )}
                      {doc.hasClinic && (
                        <span
                          className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600"
                          title="In-clinic visit available"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Consultation Fee & Action CTAs */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-base font-bold text-[#1D1F22]">
                      ₹{doc.consultFee}
                    </span>
                    <span className="text-[11px] text-[#64748B]"> / consult</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/doctor/profile?id=${doc.id}`}
                      className="px-3 py-1.5 rounded-full border border-slate-200/90 text-xs font-semibold text-[#1D1F22] hover:bg-slate-100 transition-all cursor-pointer"
                    >
                      Profile
                    </Link>
                    <Link
                      href={`/booking?doctor=${doc.id}`}
                      className="px-4 py-1.5 rounded-full bg-[#18191E] hover:bg-[#2A2B32] text-white text-xs font-semibold transition-all active:scale-95 cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      <span>Book</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-[26px] border border-slate-200/80 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <h4 className="text-base font-semibold text-[#1D1F22]">No doctors matched your criteria</h4>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto">
              Try adjusting your specialty filter or clear your search keyword to view all 8 verified doctors.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedSpecialty("All");
                setSelectedMode("All");
              }}
              className="px-4 py-2 rounded-full bg-[#18191E] text-white text-xs font-semibold hover:bg-black transition-all cursor-pointer inline-block mt-2"
            >
              Reset filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
