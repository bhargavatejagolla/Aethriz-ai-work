"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

type Severity = "Attention" | "Watch" | "Optimal";

interface Patient {
  id: string;
  name: string;
  avatar: string;
  avatarBg: string;
  gender: string;
  age: number;
  languages: string;
  diet: string;
  severity: Severity;
  flag: string;
  flagColor: string;
  summaryHeadline: string;
  hba1c: {
    value: string;
    trend: string;
    percent: number;
    alert: boolean;
  };
  glucosePeak: {
    value: string;
    label?: string;
    note: string;
    percent: number;
    alert: boolean | "watch";
  };
  vitaminD: {
    value: string;
    label?: string;
    note: string;
    percent: number;
    alert: boolean | "watch";
  };
  glucoseData: { time: string; val: number }[];
  peakCallout: string;
  peakAnalysis: string;
  foodScan: {
    item: string;
    status: string;
    sugar: string;
  };
  sharedNote: string;
  teleconsultTime: string;
}

const PATIENTS: Patient[] = [
  {
    id: "AE-30418",
    name: "Aarav Kapoor",
    avatar: "AK",
    avatarBg: "bg-rose-100 text-rose-800",
    gender: "M",
    age: 34,
    languages: "हिन्दी / EN",
    diet: "Vegetarian · low-GI plan",
    severity: "Attention",
    flag: "△ Post-meal spikes",
    flagColor: "text-[#E3202B]",
    summaryHeadline: "Rising glucose pattern",
    hba1c: {
      value: "6.1%",
      trend: "↑ from 5.8% in July",
      percent: 55,
      alert: true,
    },
    glucosePeak: {
      value: "168 mg/dL",
      note: "after 9:30 PM dinner",
      percent: 78,
      alert: true,
    },
    vitaminD: {
      value: "18.2 ng/mL",
      note: "below range",
      percent: 28,
      alert: "watch",
    },
    glucoseData: [
      { time: "6 AM", val: 86 },
      { time: "Breakfast", val: 114 },
      { time: "Lunch", val: 126 },
      { time: "Dinner", val: 168 },
      { time: "Now", val: 142 },
    ],
    peakCallout: "Peak 168 mg/dL",
    peakAnalysis: "Late, carb-heavy dinners line up with the highest readings this week.",
    foodScan: {
      item: "Dinner: 3 rotis, aloo sabzi, gulab jamun",
      status: "Over limit",
      sugar: "32 / 25 g",
    },
    sharedNote: "Shared before today's 6:30 PM video visit.",
    teleconsultTime: "Join 6:30 PM teleconsult",
  },
  {
    id: "AE-28812",
    name: "Meena Pillai",
    avatar: "MP",
    avatarBg: "bg-purple-100 text-purple-900",
    gender: "F",
    age: 58,
    languages: "മലയാളം / EN",
    diet: "Non-vegetarian · heart-healthy",
    severity: "Attention",
    flag: "△ LDL rising",
    flagColor: "text-[#E3202B]",
    summaryHeadline: "Accelerating atherogenic lipids",
    hba1c: {
      value: "5.8%",
      trend: "Stable glycemic control",
      percent: 46,
      alert: false,
    },
    glucosePeak: {
      value: "138 mg/dL",
      note: "within target ceiling",
      percent: 54,
      alert: false,
    },
    vitaminD: {
      value: "128 mg/dL",
      label: "LDL CHOLESTEROL",
      note: "Cohort target < 100",
      percent: 82,
      alert: true,
    },
    glucoseData: [
      { time: "6 AM", val: 90 },
      { time: "Breakfast", val: 118 },
      { time: "Lunch", val: 138 },
      { time: "Dinner", val: 124 },
      { time: "Now", val: 106 },
    ],
    peakCallout: "LDL 128 mg/dL",
    peakAnalysis: "Repeated elevation across two consecutive panels indicates statin review.",
    foodScan: {
      item: "Lunch: Fish curry, brown rice, coconut oil",
      status: "Moderate sat-fat",
      sugar: "14 / 25 g",
    },
    sharedNote: "Lipid panel and food journal shared today.",
    teleconsultTime: "Join 7:15 PM teleconsult",
  },
  {
    id: "AE-29907",
    name: "Rohit Verma",
    avatar: "RV",
    avatarBg: "bg-emerald-100 text-emerald-800",
    gender: "M",
    age: 45,
    languages: "हिन्दी",
    diet: "Vegetarian · low sodium",
    severity: "Watch",
    flag: "BP 142/91",
    flagColor: "text-[#1D1F22]",
    summaryHeadline: "Post-prandial hypertension",
    hba1c: {
      value: "5.6%",
      trend: "Optimal metabolic range",
      percent: 40,
      alert: false,
    },
    glucosePeak: {
      value: "142/91",
      label: "BLOOD PRESSURE",
      note: "after lunch spike",
      percent: 75,
      alert: "watch",
    },
    vitaminD: {
      value: "24.5 ng/mL",
      note: "improving with D3",
      percent: 48,
      alert: false,
    },
    glucoseData: [
      { time: "6 AM", val: 84 },
      { time: "Breakfast", val: 108 },
      { time: "Lunch", val: 136 },
      { time: "Dinner", val: 122 },
      { time: "Now", val: 96 },
    ],
    peakCallout: "Peak BP 142/91",
    peakAnalysis: "Systolic pressure increases transiently after sodium-rich mid-day cafeteria meals.",
    foodScan: {
      item: "Lunch: Paneer butter masala, 2 naans, pickle",
      status: "High sodium",
      sugar: "18 / 25 g",
    },
    sharedNote: "Ambulatory BP cuff telemetry synced 1h ago.",
    teleconsultTime: "Schedule BP review",
  },
  {
    id: "AE-31024",
    name: "Sana Qureshi",
    avatar: "SQ",
    avatarBg: "bg-amber-100 text-amber-800",
    gender: "F",
    age: 29,
    languages: "اردو / EN",
    diet: "Non-vegetarian · iron focus",
    severity: "Watch",
    flag: "Low iron & Vit D",
    flagColor: "text-[#F59E0B]",
    summaryHeadline: "Micronutrient deficiency cluster",
    hba1c: {
      value: "5.4%",
      trend: "Stable glycemic control",
      percent: 34,
      alert: false,
    },
    glucosePeak: {
      value: "28 ng/mL",
      label: "FERRITIN",
      note: "borderline iron store",
      percent: 28,
      alert: "watch",
    },
    vitaminD: {
      value: "16.4 ng/mL",
      note: "deficiency detected",
      percent: 22,
      alert: "watch",
    },
    glucoseData: [
      { time: "6 AM", val: 82 },
      { time: "Breakfast", val: 98 },
      { time: "Lunch", val: 114 },
      { time: "Dinner", val: 108 },
      { time: "Now", val: 90 },
    ],
    peakCallout: "Vit D 16.4 ng/mL",
    peakAnalysis: "Correlates with reported afternoon fatigue and hair thinning. Oral supplementation advised.",
    foodScan: {
      item: "Breakfast: Eggs, spinach toast, black coffee",
      status: "Iron boosted",
      sugar: "4 / 25 g",
    },
    sharedNote: "CBC and ferritin panel synced yesterday.",
    teleconsultTime: "Schedule nutrition review",
  },
  {
    id: "AE-27140",
    name: "K. Sundaram",
    avatar: "KS",
    avatarBg: "bg-purple-100 text-purple-900",
    gender: "M",
    age: 63,
    languages: "தமிழ்",
    diet: "Vegetarian · balanced",
    severity: "Optimal",
    flag: "Stable",
    flagColor: "text-[#10B981]",
    summaryHeadline: "Thyroid and vitals within target",
    hba1c: {
      value: "5.5%",
      trend: "Optimal control",
      percent: 38,
      alert: false,
    },
    glucosePeak: {
      value: "2.1 μIU/mL",
      label: "TSH LEVEL",
      note: "Euthyroid target met",
      percent: 50,
      alert: false,
    },
    vitaminD: {
      value: "38.6 ng/mL",
      note: "healthy range",
      percent: 75,
      alert: false,
    },
    glucoseData: [
      { time: "6 AM", val: 84 },
      { time: "Breakfast", val: 104 },
      { time: "Lunch", val: 118 },
      { time: "Dinner", val: 112 },
      { time: "Now", val: 92 },
    ],
    peakCallout: "TSH 2.1 μIU/mL",
    peakAnalysis: "Thyroxine 50 mcg regimen is fully stabilized. Next standard follow-up in 3 months.",
    foodScan: {
      item: "Dinner: Idli, sambar, coconut chutney",
      status: "Optimal",
      sugar: "8 / 25 g",
    },
    sharedNote: "Thyroid panel synced 3 days ago.",
    teleconsultTime: "View historical trends",
  },
];

export default function DoctorPatientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<"All" | Severity>("All");
  const [selectedPatientId, setSelectedPatientId] = useState<string>("AE-30418");
  const [flaggedPatients, setFlaggedPatients] = useState<Record<string, boolean>>({});
  const [signedOffReports, setSignedOffReports] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [teleconsultModal, setTeleconsultModal] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Filtered patients list
  const filteredPatients = useMemo(() => {
    return PATIENTS.filter((p) => {
      const matchSeverity = filterSeverity === "All" || p.severity === filterSeverity;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.flag.toLowerCase().includes(q) ||
        p.diet.toLowerCase().includes(q);
      return matchSeverity && matchQuery;
    });
  }, [searchQuery, filterSeverity]);

  const selectedPatient = useMemo(() => {
    return PATIENTS.find((p) => p.id === selectedPatientId) || PATIENTS[0];
  }, [selectedPatientId]);

  const counts = useMemo(() => {
    return {
      all: PATIENTS.length,
      attention: PATIENTS.filter((p) => p.severity === "Attention").length,
      watch: PATIENTS.filter((p) => p.severity === "Watch").length,
      optimal: PATIENTS.filter((p) => p.severity === "Optimal").length,
    };
  }, []);

  const toggleFlag = (id: string) => {
    setFlaggedPatients((prev) => {
      const next = !prev[id];
      showToast(next ? `Flagged ${selectedPatient.name} for priority clinical review.` : `Removed flag for ${selectedPatient.name}.`);
      return { ...prev, [id]: next };
    });
  };

  const handleSignOff = (id: string) => {
    setSignedOffReports((prev) => ({ ...prev, [id]: true }));
    showToast(`Signed off AI analysis report for ${selectedPatient.name}. Verified.`);
  };

  const handleDownload = () => {
    showToast(`Downloading clinical PDF dossier for ${selectedPatient.name}...`);
  };

  return (
    <div className="min-h-screen bg-[#F4F5F8] text-[#1D1F22] font-sans antialiased selection:bg-[#E3202B] selection:text-white pb-20 relative overflow-x-hidden">
      
      {/* ============================================================== */}
      {/* SIGNATURE TOP AMBIENT RED GLOW HALO (MATCHING MOCKUP NAVBAR)   */}
      {/* ============================================================== */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-48 sm:h-56 pointer-events-none z-30 overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 65% 180px at 85% -20px, rgba(227, 32, 43, 0.38) 0%, rgba(254, 205, 211, 0.22) 42%, transparent 75%), " +
            "radial-gradient(ellipse 65% 180px at 15% -20px, rgba(244, 63, 94, 0.30) 0%, rgba(254, 205, 211, 0.18) 42%, transparent 75%), " +
            "radial-gradient(ellipse 80% 150px at 50% -20px, rgba(251, 113, 133, 0.24) 0%, rgba(254, 226, 226, 0.12) 48%, transparent 78%)",
          filter: "blur(20px)",
        }}
      />

      {/* ============ TOP FLOATING NAVBAR ============ */}
      <header className="sticky top-4 z-40 px-4 sm:px-6">
        <nav
          aria-label="Doctor Portal Navigation"
          className="relative max-w-[1240px] mx-auto p-2 pl-4 sm:pl-5 flex items-center justify-between gap-3 rounded-full border border-white/80 shadow-[0_20px_50px_rgba(220,120,140,0.14),0_2px_8px_rgba(29,31,34,0.04),inset_0_1.5px_0_rgba(255,255,255,0.95)]"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.82) 50%, rgba(255,255,255,0.92) 100%)",
            backdropFilter: "blur(28px) saturate(200%)",
            WebkitBackdropFilter: "blur(28px) saturate(200%)",
          }}
        >
          {/* Brand Logo & Name with DOCTOR PORTAL badge */}
          <Link href="/doctor-portal" className="flex items-center gap-2.5 group">
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
            <div className="flex items-center gap-2">
              <span
                className="font-semibold text-[15.5px] tracking-[0.14em] text-[#1D1F22]"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                AETHRIZ
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#18191E] text-white text-[9px] font-mono tracking-wider font-semibold uppercase">
                DOCTOR PORTAL
              </span>
            </div>
          </Link>

          {/* Center Navigation Pills */}
          <div className="hidden md:flex items-center gap-1 text-[13px] font-medium text-[#545B61]">
            <Link
              href="/doctor-portal"
              className="px-3.5 py-1.5 rounded-full hover:text-[#1D1F22] hover:bg-white/50 transition-all"
            >
              Dashboard
            </Link>
            <Link
              href="/doctor/patients"
              className="px-3.5 py-1.5 rounded-full bg-white text-[#1D1F22] font-semibold shadow-xs transition-all"
            >
              Patients
            </Link>
            <Link
              href="/booking"
              className="px-3.5 py-1.5 rounded-full hover:text-[#1D1F22] hover:bg-white/50 transition-all"
            >
              Appointments
            </Link>
            <Link
              href="/doctor/nexus"
              className="px-3.5 py-1.5 rounded-full hover:text-[#1D1F22] hover:bg-white/50 transition-all"
            >
              AI Analysis
            </Link>
            <Link
              href="/doctor/join"
              className="px-3.5 py-1.5 rounded-full hover:text-[#1D1F22] hover:bg-white/50 transition-all"
            >
              Join the team
            </Link>
          </div>

          {/* Right Doctor Identity Capsule */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/doctor/profile"
              className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full bg-white/70 hover:bg-white border border-slate-200/60 shadow-2xs transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-rose-100 text-[#E3202B] font-semibold text-xs flex items-center justify-center">
                AR
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-[#1D1F22] leading-tight">Dr. Ananya Rao</p>
                <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 leading-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Available
                </p>
              </div>
            </Link>
          </div>
        </nav>
      </header>

      {/* ============ MAIN CONTAINER ============ */}
      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        
        {/* ============ SUBHEADER: BREADCRUMB & TITLE ============ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[#64748B]">
              Doctor portal · Patients
            </p>
            <h1
              className="text-3xl sm:text-4xl lg:text-[42px] font-semibold tracking-tight text-[#1D1F22] mt-1"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              Your patients.
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B]">
            <span className="w-2 h-2 rounded-full bg-[#E3202B] animate-ping" />
            <span>Sorted by AI triage priority</span>
          </div>
        </div>

        {/* ============ SEARCH & FILTER BAR ============ */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Search Input Box */}
          <div className="relative flex-1 max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, ID or condition"
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white border border-slate-200/80 shadow-2xs text-xs sm:text-sm text-[#1D1F22] placeholder:text-slate-400 focus:outline-hidden focus:border-[#E3202B] focus:ring-2 focus:ring-red-100 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center flex-wrap gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setFilterSeverity("All")}
              className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
                filterSeverity === "All"
                  ? "bg-[#1D1F22] text-white shadow-xs"
                  : "bg-white text-[#64748B] hover:text-[#1D1F22] border border-slate-200/80"
              }`}
            >
              <span>All</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${filterSeverity === "All" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
                {counts.all}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilterSeverity("Attention")}
              className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
                filterSeverity === "Attention"
                  ? "bg-[#E3202B] text-white shadow-xs"
                  : "bg-white text-[#64748B] hover:text-[#1D1F22] border border-slate-200/80"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#E3202B]" />
              <span>Attention</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${filterSeverity === "Attention" ? "bg-white/20 text-white" : "bg-red-50 text-[#E3202B]"}`}>
                {counts.attention}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilterSeverity("Watch")}
              className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
                filterSeverity === "Watch"
                  ? "bg-amber-500 text-white shadow-xs"
                  : "bg-white text-[#64748B] hover:text-[#1D1F22] border border-slate-200/80"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Watch</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${filterSeverity === "Watch" ? "bg-white/20 text-white" : "bg-amber-50 text-amber-700"}`}>
                {counts.watch}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilterSeverity("Optimal")}
              className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
                filterSeverity === "Optimal"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-[#64748B] hover:text-[#1D1F22] border border-slate-200/80"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Optimal</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${filterSeverity === "Optimal" ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-700"}`}>
                {counts.optimal}
              </span>
            </button>
          </div>
        </div>

        {/* ============ MAIN 2-COLUMN GRID ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ============ LEFT COLUMN: PATIENT CARDS DIRECTORY (5 COLS) ============ */}
          <div className="lg:col-span-5 space-y-3">
            {filteredPatients.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/80">
                <p className="text-sm font-semibold text-[#1D1F22]">No patients found</p>
                <p className="text-xs text-[#64748B] mt-1">Try relaxing your search terms or filter criteria.</p>
                <button
                  type="button"
                  onClick={() => { setSearchQuery(""); setFilterSeverity("All"); }}
                  className="mt-3 text-xs text-[#E3202B] font-semibold hover:underline"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              filteredPatients.map((patient) => {
                const isSelected = patient.id === selectedPatient.id;
                const isFlagged = !!flaggedPatients[patient.id];

                return (
                  <div
                    key={patient.id}
                    onClick={() => setSelectedPatientId(patient.id)}
                    className={`rounded-[22px] p-4 transition-all cursor-pointer relative ${
                      isSelected
                        ? "bg-white border-2 border-red-200/90 shadow-[0_12px_28px_rgba(227,32,43,0.08)] ring-2 ring-red-100/60 scale-[1.01]"
                        : "bg-white/80 hover:bg-white border border-slate-200/70 hover:shadow-xs hover:border-slate-300"
                    }`}
                  >
                    {/* Top Row: Avatar, Name, Metadata & Severity Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className={`w-11 h-11 rounded-full ${patient.avatarBg} font-bold text-sm flex items-center justify-center flex-shrink-0`}>
                            {patient.avatar}
                          </div>
                          <span
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                              patient.severity === "Attention"
                                ? "bg-[#E3202B]"
                                : patient.severity === "Watch"
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-[#1D1F22]">
                              {patient.name}
                            </h3>
                            {isFlagged && (
                              <span className="text-[10px] text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded-full font-bold">
                                Flagged
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#64748B]">
                            {patient.age} y · {patient.gender} · {patient.languages} · {patient.id}
                          </p>
                        </div>
                      </div>

                      {/* Severity Pill */}
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          patient.severity === "Attention"
                            ? "bg-red-50 text-[#E3202B] border-red-200/80"
                            : patient.severity === "Watch"
                            ? "bg-amber-50 text-amber-800 border-amber-200/80"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                        }`}
                      >
                        {patient.severity}
                      </span>
                    </div>

                    {/* Bottom Row: Diet on Left, Condition on Right */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[#64748B] text-[11px] font-medium truncate max-w-[55%]">
                        {patient.diet}
                      </span>
                      <span className={`text-[11px] font-bold ${patient.flagColor}`}>
                        {patient.flag}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ============ RIGHT COLUMN: DETAILED PATIENT TELEMETRY PANE (7 COLS) ============ */}
          <div className="lg:col-span-7 bg-white rounded-[28px] p-6 sm:p-7 border border-slate-200/80 shadow-[0_16px_40px_rgba(29,31,34,0.05)] space-y-6">
            
            {/* Header: Avatar, Name, Condition Headline, and Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3.5">
                <div className={`w-12 h-12 rounded-full ${selectedPatient.avatarBg} font-bold text-base flex items-center justify-center flex-shrink-0`}>
                  {selectedPatient.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-bold text-[#1D1F22]">
                      {selectedPatient.name}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-[#E3202B] border border-rose-200/60">
                      {selectedPatient.summaryHeadline}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    {selectedPatient.id} · {selectedPatient.age} y · {selectedPatient.gender} · {selectedPatient.languages} · {selectedPatient.diet}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Download PDF & Flag Patient */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={handleDownload}
                  title="Download clinical report PDF"
                  className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-[#1D1F22] border border-slate-200/80 flex items-center justify-center transition-all cursor-pointer"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => toggleFlag(selectedPatient.id)}
                  title={flaggedPatients[selectedPatient.id] ? "Remove flag" : "Flag for urgent review"}
                  className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                    flaggedPatients[selectedPatient.id]
                      ? "bg-red-50 border-red-300 text-red-600"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-red-600 border-slate-200/80"
                  }`}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill={flaggedPatients[selectedPatient.id] ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 3 Biomarker Metric Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              
              {/* Metric 1: HBA1C */}
              <div className="p-4 rounded-2xl bg-[#FCFDFE] border border-slate-200/70 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] font-bold">
                  HBA1C
                </span>
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-bold ${selectedPatient.hba1c.alert ? "text-[#E3202B]" : "text-[#1D1F22]"}`}>
                    {selectedPatient.hba1c.value}
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B]">
                  {selectedPatient.hba1c.trend}
                </p>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-1">
                  <div
                    className={`h-full rounded-full ${selectedPatient.hba1c.alert ? "bg-[#E3202B]" : "bg-emerald-500"}`}
                    style={{ width: `${selectedPatient.hba1c.percent}%` }}
                  />
                </div>
              </div>

              {/* Metric 2: GLUCOSE PEAK */}
              <div className="p-4 rounded-2xl bg-[#FCFDFE] border border-slate-200/70 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] font-bold">
                  {selectedPatient.glucosePeak.label || "GLUCOSE PEAK"}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-bold ${selectedPatient.glucosePeak.alert === true ? "text-[#E3202B]" : selectedPatient.glucosePeak.alert === "watch" ? "text-amber-600" : "text-[#1D1F22]"}`}>
                    {selectedPatient.glucosePeak.value}
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B]">
                  {selectedPatient.glucosePeak.note}
                </p>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-1">
                  <div
                    className={`h-full rounded-full ${selectedPatient.glucosePeak.alert === true ? "bg-[#E3202B]" : selectedPatient.glucosePeak.alert === "watch" ? "bg-amber-500" : "bg-emerald-500"}`}
                    style={{ width: `${selectedPatient.glucosePeak.percent}%` }}
                  />
                </div>
              </div>

              {/* Metric 3: VITAMIN D */}
              <div className="p-4 rounded-2xl bg-[#FCFDFE] border border-slate-200/70 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] font-bold">
                  {selectedPatient.vitaminD.label || "VITAMIN D"}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-bold ${selectedPatient.vitaminD.alert === true ? "text-[#E3202B]" : selectedPatient.vitaminD.alert === "watch" ? "text-amber-600" : "text-[#1D1F22]"}`}>
                    {selectedPatient.vitaminD.value}
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B]">
                  {selectedPatient.vitaminD.note}
                </p>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-1">
                  <div
                    className={`h-full rounded-full ${selectedPatient.vitaminD.alert === true ? "bg-[#E3202B]" : selectedPatient.vitaminD.alert === "watch" ? "bg-amber-500" : "bg-emerald-500"}`}
                    style={{ width: `${selectedPatient.vitaminD.percent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Continuous Glucose Monitoring (CGM) Graph Card */}
            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/70 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[#1D1F22] flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E3202B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                  <span>Glucose · last 24 h</span>
                </span>
                <span className="text-[#E3202B] font-bold">
                  Evening spike
                </span>
              </div>

              {/* CGM SVG Curve Chart */}
              <div className="relative w-full h-36 select-none">
                <svg viewBox="0 0 540 140" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="glucoseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E3202B" stopOpacity="0.32" />
                      <stop offset="60%" stopColor="#E3202B" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="#E3202B" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Target Zone Shading: 70 - 140 mg/dL */}
                  <rect
                    x="20"
                    y="45"
                    width="500"
                    height="60"
                    fill="#10B981"
                    fillOpacity="0.05"
                    rx="4"
                  />
                  <line
                    x1="20"
                    y1="45"
                    x2="520"
                    y2="45"
                    stroke="#10B981"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    strokeOpacity="0.35"
                  />
                  <line
                    x1="20"
                    y1="105"
                    x2="520"
                    y2="105"
                    stroke="#10B981"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    strokeOpacity="0.35"
                  />

                  {/* Fill Under Curve */}
                  <path
                    d="M 25 102 C 60 102, 90 98, 120 86 C 145 76, 175 78, 205 92 C 235 102, 265 65, 305 78 C 340 92, 385 104, 435 22 C 465 24, 495 56, 520 62 L 520 120 L 25 120 Z"
                    fill="url(#glucoseGrad)"
                  />

                  {/* Glucose Line Path */}
                  <path
                    d="M 25 102 C 60 102, 90 98, 120 86 C 145 76, 175 78, 205 92 C 235 102, 265 65, 305 78 C 340 92, 385 104, 435 22 C 465 24, 495 56, 520 62"
                    fill="none"
                    stroke="#E3202B"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                  />

                  {/* Key Points */}
                  <circle cx="25" cy="102" r="3.5" fill="#E3202B" />
                  <circle cx="120" cy="86" r="3.5" fill="#E3202B" />
                  <circle cx="305" cy="78" r="3.5" fill="#E3202B" />
                  <circle cx="520" cy="62" r="3.5" fill="#E3202B" />

                  {/* Peak Marker Dot (Dinner 168 mg/dL) */}
                  <circle cx="435" cy="22" r="10" fill="#E3202B" fillOpacity="0.2" className="animate-ping" />
                  <circle cx="435" cy="22" r="5" fill="#E3202B" stroke="#FFFFFF" strokeWidth="2" />
                </svg>

                {/* X-axis labels */}
                <div className="flex justify-between text-[10px] font-semibold text-[#94A3B8] px-2 mt-1">
                  <span>6 AM</span>
                  <span>Breakfast</span>
                  <span>Lunch</span>
                  <span>Dinner</span>
                  <span>Now</span>
                </div>
              </div>

              {/* Callout Banner Below Graph */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-2.5 text-xs">
                <span className="px-2.5 py-1 rounded-full bg-[#1D1F22] text-white font-mono text-[11px] font-semibold flex-shrink-0">
                  {selectedPatient.peakCallout}
                </span>
                <span className="text-[#64748B] font-medium leading-relaxed">
                  {selectedPatient.peakAnalysis}
                </span>
              </div>
            </div>

            {/* Split Telemetry Cards: AI Food Scan & AETHRIZ Summary Shared */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Card 1: AI Food Scan */}
              <div className="p-4 rounded-2xl bg-[#FCFDFE] border border-slate-200/70 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200/60 text-[#E3202B] flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-[#1D1F22]">AI food scan</span>
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-red-50 text-[#E3202B] border border-red-200/80">
                      {selectedPatient.foodScan.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                    {selectedPatient.foodScan.item}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-[9px] font-mono text-[#94A3B8] uppercase block">ADDED SUGAR</span>
                  <span className="text-xs font-bold text-[#E3202B]">{selectedPatient.foodScan.sugar}</span>
                </div>
              </div>

              {/* Card 2: AETHRIZ summary shared */}
              <div className="p-4 rounded-2xl bg-[#FCFDFE] border border-slate-200/70 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E3202B] to-[#991B1B] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l2.5 6.5L21 11l-5 4.5L17.5 22 12 18.5 6.5 22 8 15.5 3 11l6.5-2.5z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-[#1D1F22] block">AETHRIZ summary shared</span>
                  <p className="text-[11px] text-[#64748B] mt-0.5 leading-tight">
                    {selectedPatient.sharedNote}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Action Buttons: Join Teleconsult & Sign Off AI Report */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTeleconsultModal(true)}
                className="sm:col-span-8 py-3 px-6 rounded-full text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-[0_10px_24px_rgba(227,32,43,0.28)] hover:opacity-95 active:scale-98 transition-all cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #E3202B 0%, #C41822 100%)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
                <span>{selectedPatient.teleconsultTime}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSignOff(selectedPatient.id)}
                className={`sm:col-span-4 py-3 px-4 rounded-full text-xs sm:text-sm font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  signedOffReports[selectedPatient.id]
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                    : "bg-[#F4F5F8] text-[#1D1F22] hover:bg-slate-200/80 border-slate-200/80"
                }`}
              >
                {signedOffReports[selectedPatient.id] ? (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Signed off</span>
                  </>
                ) : (
                  <span>Sign off AI report</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ============ TELECONSULT POPUP MODAL ============ */}
      {teleconsultModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="text-base font-bold text-[#1D1F22]">Encrypted Teleconsult Room</h3>
              </div>
              <button
                type="button"
                onClick={() => setTeleconsultModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-[#1D1F22] flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="relative aspect-video rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center text-center p-4">
              <div className="space-y-2 z-10 text-white">
                <div className="w-16 h-16 rounded-full bg-white/10 mx-auto flex items-center justify-center text-xl font-bold border border-white/20">
                  {selectedPatient.avatar}
                </div>
                <p className="text-sm font-semibold">{selectedPatient.name}</p>
                <p className="text-xs text-slate-400">Waiting in patient waiting room · Telehealth HD enabled</p>
              </div>

              <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/50 text-[10px] text-white font-mono backdrop-blur-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>AES-256 GCM Live</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#64748B]">
              <p className="font-semibold text-[#1D1F22]">Pre-consult note:</p>
              <p className="mt-0.5">{selectedPatient.peakAnalysis}</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTeleconsultModal(false)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setTeleconsultModal(false);
                  showToast(`Connected to video room with ${selectedPatient.name}.`);
                }}
                className="px-5 py-2 rounded-full text-xs font-semibold bg-[#E3202B] text-white shadow-xs hover:opacity-95"
              >
                Start Consultation Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1D1F22] text-white px-4 py-2.5 rounded-full shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-[#E3202B]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
