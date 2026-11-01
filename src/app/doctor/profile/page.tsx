"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

interface DoctorFullProfile {
  id: string;
  name: string;
  initials: string;
  specialtyTag: string;
  headline: string;
  qualifications: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  hospitalName: string;
  languages: string[];
  modalities: string;
  nextAvailable: string;
  videoFee: number;
  clinicFee: number;
  clinicAddress: string;
  isAiMatch: boolean;
  bio: string;
  focusAreas: string[];
  medicalCollege: string;
  institute: string;
  registrationNumber: string;
  fellowship: string;
}

const DOCTORS_PROFILES: Record<string, DoctorFullProfile> = {
  "ananya-rao": {
    id: "ananya-rao",
    name: "Dr. Ananya Rao",
    initials: "AR",
    specialtyTag: "Endocrinology",
    headline: "Endocrinology · Diabetes, thyroid & metabolism",
    qualifications: "MBBS, MD · 14 years in practice",
    experienceYears: 14,
    rating: 4.9,
    reviewCount: 412,
    hospitalName: "Manipal Hospital & AETHRIZ Care Hub",
    languages: ["English", "हिन्दी", "ಕನ್ನಡ"],
    modalities: "Video & in-clinic",
    nextAvailable: "Today, 6:30 PM",
    videoFee: 800,
    clinicFee: 1000,
    clinicAddress: "Koramangala 4th Block, Bengaluru",
    isAiMatch: true,
    bio: "Dr. Ananya is a endocrinology specialist with 14 years of practice. Working with AETHRIZ, Ananya reviews your reports and daily trends before each visit, so consultations focus on what matters — clear explanations, practical plans that fit your food and routine, and follow-ups that actually happen.",
    focusAreas: [
      "Diabetes & prediabetes",
      "Thyroid disorders",
      "PCOS",
      "Metabolic health",
      "Lifestyle medicine",
    ],
    medicalCollege: "Bangalore Medical College & Research Institute",
    institute: "Post Graduate Institute of Medical Education & Research (PGIMER)",
    registrationNumber: "KMC Reg. no. 48921 · verified",
    fellowship: "Endocrine Society of India & RSSDI",
  },
  "vikram-menon": {
    id: "vikram-menon",
    name: "Dr. Vikram Menon",
    initials: "VM",
    specialtyTag: "Cardiology",
    headline: "Cardiology · Preventative lipid & cardiovascular health",
    qualifications: "MBBS, MD, DM · 18 years in practice",
    experienceYears: 18,
    rating: 4.8,
    reviewCount: 538,
    hospitalName: "Apollo Hospitals & Heart Center",
    languages: ["English", "മലയാളം"],
    modalities: "Video & in-clinic",
    nextAvailable: "Tomorrow, 10:00 AM",
    videoFee: 1200,
    clinicFee: 1500,
    clinicAddress: "Indiranagar 100ft Road, Bengaluru",
    isAiMatch: false,
    bio: "Senior Interventional Cardiologist. Specialises in arterial plaque risk mitigation, continuous blood pressure telemetry, and personalized cardiac longevity roadmaps for individuals with elevated ApoB and LDL cholesterol.",
    focusAreas: [
      "Hypertension & BP variability",
      "Lipid management & ApoB",
      "Preventive cardiology",
      "Post-stent cardiac rehabilitation",
      "Cardiovascular longevity",
    ],
    medicalCollege: "Christian Medical College (CMC), Vellore",
    institute: "All India Institute of Medical Sciences (AIIMS), New Delhi",
    registrationNumber: "KMC Reg. no. 31209 · verified",
    fellowship: "Cardiological Society of India (FCSI)",
  },
  "meera-iyer": {
    id: "meera-iyer",
    name: "Dr. Meera Iyer",
    initials: "MI",
    specialtyTag: "Nutrition",
    headline: "Clinical Nutrition · Glycemic load & gut microbiome",
    qualifications: "MSc, PhD · 9 years in practice",
    experienceYears: 9,
    rating: 4.9,
    reviewCount: 298,
    hospitalName: "Cloudnine & AETHRIZ Nutrition Lab",
    languages: ["English", "தமிழ்", "हिन्दी"],
    modalities: "Video consultation",
    nextAvailable: "Today, 7:15 PM",
    videoFee: 600,
    clinicFee: 800,
    clinicAddress: "Jayanagar 9th Block, Bengaluru",
    isAiMatch: true,
    bio: "Clinical nutritionist specialising in insulin sensitivity restoration, Indian thali composition optimization, and micro-nutrient rebalancing based on direct lab panel telemetry.",
    focusAreas: [
      "Low glycemic Indian diets",
      "HbA1c & fasting sugar management",
      "Fatty liver nutritional protocols",
      "Gut microbiome restoration",
      "Sustainable weight equilibrium",
    ],
    medicalCollege: "University of Madras, Clinical Nutrition",
    institute: "National Institute of Nutrition (NIN), Hyderabad",
    registrationNumber: "IDA Reg. no. 14289 · verified",
    fellowship: "Indian Dietetic Association & British Nutrition Society",
  },
  "arjun-sethi": {
    id: "arjun-sethi",
    name: "Dr. Arjun Sethi",
    initials: "AS",
    specialtyTag: "General Physician",
    headline: "Internal Medicine · Multi-system chronic health checks",
    qualifications: "MBBS, DNB · 11 years in practice",
    experienceYears: 11,
    rating: 4.7,
    reviewCount: 821,
    hospitalName: "Fortis Hospital & Sethi Clinic",
    languages: ["English", "हिन्दी", "ਪੰਜਾਬੀ"],
    modalities: "Video & in-clinic",
    nextAvailable: "In 30 min",
    videoFee: 500,
    clinicFee: 700,
    clinicAddress: "Whitefield Main Road, Bengaluru",
    isAiMatch: false,
    bio: "Primary care physician managing chronic fatigue, acute seasonal infections, metabolic lab reviews, and holistic health triage.",
    focusAreas: [
      "Comprehensive health audits",
      "Fever & acute triage",
      "Chronic lifestyle management",
      "Nutrient deficiencies",
      "Preventive health screening",
    ],
    medicalCollege: "Kasturba Medical College (KMC), Manipal",
    institute: "National Board of Examinations (NBE), New Delhi",
    registrationNumber: "KMC Reg. no. 52187 · verified",
    fellowship: "Association of Physicians of India (API)",
  },
  "farah-siddiqui": {
    id: "farah-siddiqui",
    name: "Dr. Farah Siddiqui",
    initials: "FS",
    specialtyTag: "Thyroid",
    headline: "Thyroid & Endocrinology · Hashimoto's & hormone balance",
    qualifications: "MBBS, MD · 12 years in practice",
    experienceYears: 12,
    rating: 4.8,
    reviewCount: 233,
    hospitalName: "Lilavati Hospital & Endocrine Institute",
    languages: ["English", "اردو", "हिन्दी"],
    modalities: "In-clinic visit",
    nextAvailable: "Sat, 11:30 AM",
    videoFee: 800,
    clinicFee: 900,
    clinicAddress: "Bandra West, Mumbai",
    isAiMatch: false,
    bio: "Dedicated thyroid clinician addressing subclinical hypothyroidism, anti-TPO antibody management, and metabolic vitality through tailored endocrine therapies.",
    focusAreas: [
      "Hypothyroidism & Hyperthyroidism",
      "Hashimoto's thyroiditis",
      "Nodular thyroid assessment",
      "Post-pregnancy thyroid recovery",
      "Metabolic rate optimization",
    ],
    medicalCollege: "Grant Medical College & Sir JJ Group of Hospitals, Mumbai",
    institute: "Tata Memorial Hospital & ACTREC",
    registrationNumber: "MMC Reg. no. 78432 · verified",
    fellowship: "American Thyroid Association (ATA) Affiliate",
  },
  "rohan-kulkarni": {
    id: "rohan-kulkarni",
    name: "Dr. Rohan Kulkarni",
    initials: "RK",
    specialtyTag: "Endocrinology",
    headline: "Endocrinology · Continuous glucose monitoring & insulin resistance",
    qualifications: "MBBS, DNB · 8 years in practice",
    experienceYears: 8,
    rating: 4.6,
    reviewCount: 154,
    hospitalName: "Ruby Hall Clinic & Metabolic Hub",
    languages: ["English", "मराठी"],
    modalities: "Video consultation",
    nextAvailable: "Tomorrow, 5:00 PM",
    videoFee: 700,
    clinicFee: 900,
    clinicAddress: "Shivajinagar, Pune",
    isAiMatch: true,
    bio: "Specialises in continuous glucose sensor interpretation, early pre-diabetic reversal, and metabolic syndrome lifestyle interventions.",
    focusAreas: [
      "Continuous glucose telemetry (CGM)",
      "Prediabetes reversal",
      "Metabolic syndrome",
      "Insulin resistance",
      "Exercise & glucose uptake",
    ],
    medicalCollege: "BJ Government Medical College, Pune",
    institute: "Sir Ganga Ram Hospital, New Delhi",
    registrationNumber: "MMC Reg. no. 91045 · verified",
    fellowship: "Research Society for the Study of Diabetes in India (RSSDI)",
  },
  "priya-banerjee": {
    id: "priya-banerjee",
    name: "Dr. Priya Banerjee",
    initials: "PB",
    specialtyTag: "Cardiology",
    headline: "Preventive Cardiology · Arterial elasticity & lipid health",
    qualifications: "MBBS, MD, DM · 16 years in practice",
    experienceYears: 16,
    rating: 4.9,
    reviewCount: 367,
    hospitalName: "AMRI Hospital & Heart Clinic",
    languages: ["English", "বাংলা"],
    modalities: "In-clinic visit",
    nextAvailable: "Mon, 9:30 AM",
    videoFee: 950,
    clinicFee: 1100,
    clinicAddress: "Salt Lake Sector III, Kolkata",
    isAiMatch: false,
    bio: "Consultant preventive cardiologist emphasizing early detection of coronary calcium, vascular health, and functional exercise tolerance.",
    focusAreas: [
      "Coronary artery calcium (CAC) scoring",
      "Cholesterol & triglyceride optimization",
      "Cardiac risk score analysis",
      "Stress-induced cardiovascular health",
      "Cardioprotective lifestyle changes",
    ],
    medicalCollege: "Medical College Kolkata",
    institute: "IPGMER & SSKM Hospital, Kolkata",
    registrationNumber: "WBMC Reg. no. 61284 · verified",
    fellowship: "European Society of Cardiology (FESC)",
  },
  "kavya-reddy": {
    id: "kavya-reddy",
    name: "Dr. Kavya Reddy",
    initials: "KR",
    specialtyTag: "Nutrition",
    headline: "Nutritional Biochemistry · Whole food anti-inflammatory plans",
    qualifications: "MSc, PhD · 7 years in practice",
    experienceYears: 7,
    rating: 4.7,
    reviewCount: 189,
    hospitalName: "Care Hospital & Reddy Wellness Center",
    languages: ["English", "తెలుగు"],
    modalities: "Video & in-clinic",
    nextAvailable: "Today, 8:00 PM",
    videoFee: 550,
    clinicFee: 750,
    clinicAddress: "Road No. 12, Banjara Hills, Hyderabad",
    isAiMatch: false,
    bio: "Nutritional biochemist translating blood panel biomarkers into bio-individual nutrition frameworks, anti-inflammatory whole-food plates, and athletic recovery.",
    focusAreas: [
      "Anti-inflammatory nutrition",
      "Thyroid & PCOS nutritional support",
      "Liver detox & antioxidant diet",
      "Bio-individual macro ratios",
      "Nutrient absorption enhancement",
    ],
    medicalCollege: "Osmania University, Hyderabad",
    institute: "Nizam's Institute of Medical Sciences (NIMS)",
    registrationNumber: "APMC Reg. no. 38102 · verified",
    fellowship: "Indian Association for Parenteral and Enteral Nutrition (IAPEN)",
  },
};

function DoctorProfileInner() {
  const searchParams = useSearchParams();
  const doctorId = searchParams.get("id") || "ananya-rao";
  const doctor = DOCTORS_PROFILES[doctorId] || DOCTORS_PROFILES["ananya-rao"];

  const [consultFormat, setConsultFormat] = useState<"video" | "clinic">("video");
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageSent, setMessageSent] = useState(false);

  const activeFee = consultFormat === "video" ? doctor.videoFee : doctor.clinicFee;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setMessageText("");
      setShowMessageModal(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F4F5F8] text-[#1D1F22] font-sans antialiased selection:bg-[#E3202B] selection:text-white pb-24">
      {/* ============ TOP FLOATING NAVBAR MATCHING MOCKUP ============ */}
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
              href="/doctors"
              className="px-4 py-1.5 rounded-full bg-white text-[#1D1F22] font-semibold shadow-xs border border-slate-200/70 transition-all"
            >
              Doctors
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
            AK
          </Link>
        </nav>
      </header>

      {/* ============ MAIN VIEWPORT CONTAINER ============ */}
      <main className="max-w-[1060px] mx-auto px-4 sm:px-6 pt-5 sm:pt-7 space-y-6">
        
        {/* ============ BREADCRUMB & BACK NAVIGATION ============ */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Link
              href="/doctors"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 text-[#1D1F22] hover:bg-slate-50 transition-all font-semibold shadow-2xs"
            >
              <span>←</span>
              <span>Back to doctors</span>
            </Link>
            <span className="text-[#94A3B8]">
              Doctors / <span className="text-[#475569] font-medium">{doctor.name}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Sample profile · for illustration</span>
          </div>
        </div>

        {/* ============ HERO DOCTOR CARD MATCHING EXACT MOCKUP ============ */}
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-slate-200/80 shadow-[0_12px_36px_rgba(29,31,34,0.04)] relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          
          {/* Subtle Ambient Red Glow */}
          <div
            className="absolute -top-12 -left-12 w-48 h-48 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(255,100,105,0.18) 0%, transparent 70%)",
              filter: "blur(28px)",
            }}
          />

          {/* Left: Avatar & Doctor Headline */}
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            
            {/* Large 3D Avatar Squircle with Orbit & Badge */}
            <div className="relative flex-shrink-0 self-center sm:self-auto">
              {/* Soft Pink Outer Halo */}
              <div
                className="w-32 h-32 sm:w-36 sm:h-36 rounded-[28px] flex items-center justify-center shadow-[0_12px_28px_rgba(227,32,43,0.12)] border border-[#F6C6CC]/80"
                style={{
                  background: "linear-gradient(135deg, #FFE8EB 0%, #FFD6DC 50%, #FFC9D1 100%)",
                }}
              >
                <span className="text-4xl sm:text-5xl font-light text-[#1D1F22] tracking-tight">
                  {doctor.initials}
                </span>
              </div>

              {/* Decorative Red Dot on Left Orbit */}
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#E3202B]" />

              {/* Registration Verified Bottom Pill */}
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#18191E] text-white text-[10px] font-semibold whitespace-nowrap shadow-md flex items-center gap-1.5 border border-white/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Registration verified</span>
              </div>
            </div>

            {/* Doctor Info */}
            <div className="space-y-2 mt-2 sm:mt-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1
                  className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1F22]"
                  style={{ fontFamily: "'Inter Tight', sans-serif" }}
                >
                  {doctor.name}
                </h1>
                {doctor.isAiMatch && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-[#E3202B] bg-[#FFF1F2] border border-red-200/90 shadow-2xs">
                    AI match for your profile
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-[#E3202B]">
                {doctor.headline}
              </p>

              <p className="text-xs text-[#64748B]">
                {doctor.qualifications} · <span className="text-amber-500 font-bold">★ {doctor.rating}</span> ({doctor.reviewCount} reviews)
              </p>

              {/* 3 Information Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#475569]">
                <span className="px-3 py-1 rounded-full bg-[#F8FAFC] border border-slate-200/80 font-medium flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>{doctor.experienceYears}+ years experience</span>
                </span>

                <span className="px-3 py-1 rounded-full bg-[#F8FAFC] border border-slate-200/80 font-medium flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
                  </svg>
                  <span>{doctor.hospitalName}</span>
                </span>

                <span className="px-3 py-1 rounded-full bg-[#F8FAFC] border border-slate-200/80 font-medium flex items-center gap-1.5">
                  <span className="font-serif">文</span>
                  <span>{doctor.languages.join(", ")}</span>
                </span>
              </div>

              {/* Modality Pill */}
              <div className="pt-1">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-[#E3202B] bg-[#FFF1F2] border border-red-200/70">
                  {doctor.modalities}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Next Available Quick Card */}
          <div className="relative z-10 w-full lg:w-64 bg-[#FAFAFA] rounded-2xl p-5 border border-slate-200/70 flex flex-col justify-between space-y-4 flex-shrink-0">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 uppercase tracking-wider font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>NEXT AVAILABLE</span>
              </div>
              <h4 className="text-lg font-bold text-[#1D1F22] mt-1">
                {doctor.nextAvailable}
              </h4>
            </div>

            <div className="space-y-2">
              <Link
                href={`/booking?doctor=${doctor.id}&type=${consultFormat}`}
                className="w-full py-3 px-4 rounded-full bg-[#E3202B] hover:bg-[#C8161F] text-white text-xs font-semibold shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Book consultation</span>
                <span>→</span>
              </Link>

              <button
                type="button"
                onClick={() => setShowMessageModal(true)}
                className="w-full text-center text-xs text-[#64748B] hover:text-[#1D1F22] transition-colors py-1 cursor-pointer"
              >
                Message care team
              </button>
            </div>
          </div>
        </div>

        {/* ============ TWO-COLUMN DETAILS SECTION ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ============ LEFT COLUMN: CLINICAL BIO & CREDENTIALS (7 COLS) ============ */}
          <div className="lg:col-span-7 bg-white rounded-[28px] p-6 sm:p-7 border border-slate-200/80 shadow-[0_8px_30px_rgba(29,31,34,0.03)] space-y-6">
            
            {/* Header: About Doctor */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-red-50 text-[#E3202B] flex items-center justify-center">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <h3 className="font-bold text-base text-[#1D1F22]">
                  About {doctor.name}
                </h3>
              </div>

              <span className="text-[10px] font-mono tracking-widest text-[#94A3B8] uppercase font-bold">
                CLINICAL BIO
              </span>
            </div>

            {/* Bio Text */}
            <p className="text-xs sm:text-[13px] text-[#475569] leading-relaxed">
              {doctor.bio}
            </p>

            {/* Specialties & Focus Areas */}
            <div className="space-y-3 pt-2">
              <h4 className="text-[11px] font-mono uppercase tracking-widest text-[#94A3B8] font-bold">
                SPECIALTIES & FOCUS AREAS
              </h4>

              <div className="flex flex-wrap items-center gap-2">
                {doctor.focusAreas.map((area) => (
                  <span
                    key={area}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#F8FAFC] border border-slate-200/80 text-[#1D1F22] flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E3202B]" />
                    <span>{area}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Education & Registration */}
            <div className="space-y-3 pt-2">
              <h4 className="text-[11px] font-mono uppercase tracking-widest text-[#94A3B8] font-bold">
                EDUCATION & REGISTRATION
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. MBBS */}
                <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-red-50 text-[#E3202B] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c3 3 9 3 12 0v-5" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#1D1F22]">MBBS</h5>
                    <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug">
                      {doctor.medicalCollege}
                    </p>
                  </div>
                </div>

                {/* 2. MD / Specialisation */}
                <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-red-50 text-[#E3202B] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#1D1F22]">
                      MD / DM - {doctor.specialtyTag}
                    </h5>
                    <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug">
                      {doctor.institute}
                    </p>
                  </div>
                </div>

                {/* 3. Council Reg */}
                <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-red-50 text-[#E3202B] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#1D1F22]">State Medical Council</h5>
                    <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug">
                      {doctor.registrationNumber}
                    </p>
                  </div>
                </div>

                {/* 4. Fellowship */}
                <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-red-50 text-[#E3202B] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#1D1F22]">Fellowship</h5>
                    <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug">
                      {doctor.fellowship}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Callout */}
            <div className="p-3.5 rounded-2xl bg-[#FFF8F8] border border-red-100 flex items-center gap-3 text-xs text-[#64748B]">
              <span className="text-[#E3202B] flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <p className="leading-snug">
                Patient reviews are shown only with consent. Your visits stay private between you and your doctor.
              </p>
            </div>
          </div>

          {/* ============ RIGHT COLUMN: DIRECT BOOKING & CONSULTATION (5 COLS) ============ */}
          <div className="lg:col-span-5 bg-white rounded-[28px] p-6 sm:p-7 border border-slate-200/80 shadow-[0_8px_30px_rgba(29,31,34,0.03)] space-y-5">
            
            {/* Header: Consultation & Direct Booking */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-50 text-[#E3202B] flex items-center justify-center">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <h3 className="font-bold text-base text-[#1D1F22]">Consultation</h3>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
                DIRECT BOOKING
              </span>
            </div>

            {/* Formats Selection */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#94A3B8] font-bold block">
                FORMAT
              </span>

              {/* Option 1: Video Consultation */}
              <div
                onClick={() => setConsultFormat("video")}
                className={`p-3.5 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  consultFormat === "video"
                    ? "bg-white border-2 border-[#E3202B] shadow-xs ring-2 ring-red-100"
                    : "bg-[#F8FAFC] border border-slate-200/80 hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      consultFormat === "video" ? "bg-red-50 text-[#E3202B]" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <polygon points="23 7 16 12 23 17 23 7" />
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h5 className="text-xs font-bold text-[#1D1F22]">Video consultation</h5>
                      <span className="px-2 py-0.2 rounded-full text-[9.5px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">
                        Recommended
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      20–30 min · encrypted · ₹{doctor.videoFee}
                    </p>
                  </div>
                </div>

                {/* Radio Circle */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    consultFormat === "video"
                      ? "border-[#E3202B]"
                      : "border-slate-300"
                  }`}
                >
                  {consultFormat === "video" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E3202B]" />
                  )}
                </div>
              </div>

              {/* Option 2: In-clinic Visit */}
              <div
                onClick={() => setConsultFormat("clinic")}
                className={`p-3.5 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  consultFormat === "clinic"
                    ? "bg-white border-2 border-[#E3202B] shadow-xs ring-2 ring-red-100"
                    : "bg-[#F8FAFC] border border-slate-200/80 hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      consultFormat === "clinic" ? "bg-red-50 text-[#E3202B]" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-[#1D1F22]">In-clinic visit</h5>
                    <p className="text-[11px] text-[#64748B] mt-0.5 truncate">
                      30–45 min · {doctor.clinicAddress} · ₹{doctor.clinicFee}
                    </p>
                  </div>
                </div>

                {/* Radio Circle */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    consultFormat === "clinic"
                      ? "border-[#E3202B]"
                      : "border-slate-300"
                  }`}
                >
                  {consultFormat === "clinic" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E3202B]" />
                  )}
                </div>
              </div>
            </div>

            {/* Before Your Visit Checklist */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#94A3B8] font-bold block mb-2">
                BEFORE YOUR VISIT
              </span>

              <div className="flex items-center gap-2 text-xs text-[#475569]">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Your AETHRIZ health summary is shared automatically</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#475569]">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Upload reports, scans or prescriptions ahead of time</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#475569]">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Short intake questions in your language</span>
              </div>
            </div>

            {/* Price & Payment Summary */}
            <div className="pt-4 border-t border-slate-100 flex items-end justify-between">
              <div>
                <span className="text-xs font-bold text-[#1D1F22] block capitalize">
                  {consultFormat === "video" ? "Video consultation" : "In-clinic visit"}
                </span>
                <span className="text-[10.5px] text-[#64748B] block mt-0.5">
                  Accepted: UPI · Cards · [INSURANCE PARTNERS]
                </span>
              </div>

              <div className="text-right">
                <span className="text-3xl font-extrabold text-[#1D1F22]">
                  ₹{activeFee}
                </span>
              </div>
            </div>

            {/* Choose a slot CTA Button */}
            <Link
              href={`/booking?doctor=${doctor.id}&type=${consultFormat}`}
              className="w-full py-3.5 rounded-full bg-[#18191E] hover:bg-black text-white text-xs font-semibold shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Choose a slot & book</span>
              <span>→</span>
            </Link>

            {/* Cancellation Note */}
            <p className="text-center text-[11px] text-[#94A3B8]">
              Free cancellation up to 4 hours before
            </p>
          </div>

        </div>

        {/* ============ FOOTER DISCLAIMER ============ */}
        <p className="text-center text-xs text-[#94A3B8] pt-4">
          Profiles are shown for booking. For emergencies, go to the nearest hospital or call 112.
        </p>

      </main>

      {/* ============ QUICK MESSAGE CARE TEAM MODAL ============ */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs ae-fade-in">
          <div className="bg-white rounded-[28px] max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative">
            <button
              type="button"
              onClick={() => setShowMessageModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-2 cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-[#1D1F22]">
              Message Care Team for {doctor.name}
            </h3>
            <p className="text-xs text-[#64748B] mt-1">
              Have a pre-booking question about appointment slots or test report requirements?
            </p>

            <form onSubmit={handleSendMessage} className="mt-4 space-y-4">
              <textarea
                rows={4}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Ask your question (e.g., Do I need to re-test fasting glucose before this consult?)..."
                required
                className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs text-[#1D1F22] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#E3202B]"
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMessageModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-[#64748B] hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={messageSent}
                  className="px-5 py-2.5 rounded-full bg-[#18191E] text-white text-xs font-semibold hover:bg-black transition-all"
                >
                  {messageSent ? "Sent to Care Team ✓" : "Send Question →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DoctorProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F4F5F8] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-red-200 border-t-[#E3202B] animate-spin" />
        </div>
      }
    >
      <DoctorProfileInner />
    </Suspense>
  );
}
