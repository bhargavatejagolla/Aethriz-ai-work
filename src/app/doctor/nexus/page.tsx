"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { NexusView } from "@/components/anatomy/NexusBodyScanner3D";

const NexusBodyScanner3D = dynamic(
  () => import("@/components/anatomy/NexusBodyScanner3D"),
  { ssr: false }
);

interface TriageItem {
  id: string;
  patient: string;
  condition: string;
  severity: "ATTENTION" | "WATCH" | "OPTIMAL";
  reviewed: boolean;
}

const INITIAL_TRIAGE: TriageItem[] = [
  { id: "tr-1", patient: "Meena Pillai", condition: "LDL rising across 2 reports", severity: "ATTENTION", reviewed: false },
  { id: "tr-2", patient: "Rohit Verma", condition: "BP 142/91 after lunch", severity: "WATCH", reviewed: false },
  { id: "tr-3", patient: "K. Sundaram", condition: "thyroid stable", severity: "OPTIMAL", reviewed: false },
];

export default function DoctorNexusPage() {
  const [selectedCohort, setSelectedCohort] = useState<"All" | "Metabolic" | "Cardiovascular" | "Thyroid">("All");
  const [cameraView, setCameraView] = useState<NexusView>("front");
  const [activeOrgan, setActiveOrgan] = useState<"brain" | "lungs" | "heart" | "metabolic" | null>("heart");
  const [triageList, setTriageList] = useState<TriageItem[]>(INITIAL_TRIAGE);
  const [teleconsultModal, setTeleconsultModal] = useState(false);

  const toggleTriageReview = (id: string) => {
    setTriageList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, reviewed: !item.reviewed } : item))
    );
  };

  return (
    <div className="min-h-screen bg-[#F4F5F8] text-[#1D1F22] font-sans antialiased selection:bg-[#E3202B] selection:text-white pb-24 relative overflow-x-hidden">
      
      {/* ============ SIGNATURE TOP RED AMBIENT GLOW AURA ============ */}
      <div className="ae-top-nav-glow" />

      {/* ============ TOP FLOATING NAVBAR ============ */}
      <header className="sticky top-4 z-40 px-4 sm:px-6">
        <nav
          aria-label="Doctor Portal Navigation"
          className="relative max-w-[1240px] mx-auto p-2 pl-4 sm:pl-5 flex items-center justify-between gap-3 rounded-full border border-white/80 shadow-[0_20px_50px_rgba(220,120,140,0.12),0_2px_8px_rgba(29,31,34,0.04),inset_0_1.5px_0_rgba(255,255,255,0.95)]"
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
              className="px-3.5 py-1.5 rounded-full hover:text-[#1D1F22] hover:bg-white/50 transition-all"
            >
              Patients
            </Link>
            <Link
              href="/doctor/appointments"
              className="px-3.5 py-1.5 rounded-full hover:text-[#1D1F22] hover:bg-white/50 transition-all"
            >
              Appointments
            </Link>
            <Link
              href="/doctor/nexus"
              className="px-4 py-1.5 rounded-full bg-white text-[#1D1F22] font-semibold shadow-xs border border-slate-200/70 transition-all"
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

          {/* Right Action: Dr. Ananya Rao Profile Pill */}
          <div className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-[#FCECEE] border border-[#F6C6CC] text-xs shadow-2xs">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FFE5E8] to-[#FFD2D7] text-[#1D1F22] flex items-center justify-center font-bold text-[10px]">
              AR
            </div>
            <div className="flex flex-col text-left">
              <span className="font-semibold text-[#1D1F22] leading-none text-xs">
                Dr. Ananya Rao
              </span>
              <span className="text-[9px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Available
              </span>
            </div>
          </div>
        </nav>
      </header>

      {/* ============ MAIN CONTAINER ============ */}
      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        
        {/* ============ SUBHEADER & COHORT SWITCHER ============ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1
              className="text-3xl sm:text-4xl font-light tracking-tight text-[#1D1F22]"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              AI analysis centre
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wider font-bold bg-red-100/80 text-[#E3202B] border border-red-200 uppercase">
              LIVE
            </span>
          </div>

          {/* Cohort Segmented Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {(["All", "Metabolic", "Cardiovascular", "Thyroid"] as const).map((cohort) => {
              const isActive = selectedCohort === cohort;
              return (
                <button
                  key={cohort}
                  type="button"
                  onClick={() => setSelectedCohort(cohort)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#E3202B] text-white shadow-xs"
                      : "bg-white text-[#475569] hover:bg-slate-100 border border-slate-200/80"
                  }`}
                >
                  {cohort === "All" ? "All cohorts" : cohort}
                </button>
              );
            })}

            <div className="px-3.5 py-1.5 rounded-full text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/80 flex items-center gap-1.5">
              <span>✓</span>
              <span>142 streams</span>
            </div>
          </div>
        </div>

        {/* ============ 5-PHASE REPORT PIPELINE ACCELERATOR ============ */}
        <div className="bg-white rounded-[28px] p-6 border border-slate-200/80 shadow-[0_8px_30px_rgba(29,31,34,0.03)] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E3202B] to-[#B91C1C] text-white flex items-center justify-center shadow-xs">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                </svg>
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#94A3B8] font-bold uppercase block">
                  AI INTAKE ACCELERATOR
                </span>
                <h3 className="text-sm font-bold text-[#1D1F22]">
                  5-phase report pipeline
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-[#1D1F22]">Auto-batching</span>
              <span>· 121 patients</span>
            </div>
          </div>

          {/* 5 Stages Grid Matching Exact Mockup */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
            {/* 01 // SCAN */}
            <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-1.5">
              <div className="flex items-center justify-between text-[10.5px] font-mono text-[#94A3B8]">
                <span>01 // SCAN</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-[#1D1F22]">48</span>
                <span className="text-[10px] text-[#64748B]">uploaded</span>
              </div>
              <div className="w-full h-1 rounded-full bg-slate-200 overflow-hidden">
                <div className="w-[85%] h-full bg-slate-400 rounded-full" />
              </div>
              <p className="text-[10.5px] text-[#94A3B8] truncate">Lab reports & photos</p>
            </div>

            {/* 02 // ANALYSE */}
            <div className="p-3.5 rounded-2xl bg-[#FFF8F8] border border-red-200/80 space-y-1.5">
              <div className="flex items-center justify-between text-[10.5px] font-mono text-[#E3202B]">
                <span>02 // ANALYSE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#E3202B] animate-ping" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-[#E3202B]">31</span>
                <span className="text-[10px] text-[#E3202B] font-semibold">in progress</span>
              </div>
              <div className="w-full h-1 rounded-full bg-red-100 overflow-hidden">
                <div className="w-[65%] h-full bg-[#E3202B] rounded-full animate-pulse" />
              </div>
              <p className="text-[10.5px] text-[#64748B] truncate">Deep-learning models</p>
            </div>

            {/* 03 // INTERPRET */}
            <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-1.5">
              <div className="flex items-center justify-between text-[10.5px] font-mono text-emerald-700">
                <span>03 // INTERPRET</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-[#1D1F22]">19</span>
                <span className="text-[10px] text-emerald-600 font-semibold">validated</span>
              </div>
              <div className="w-full h-1 rounded-full bg-slate-200 overflow-hidden">
                <div className="w-[50%] h-full bg-emerald-500 rounded-full" />
              </div>
              <p className="text-[10.5px] text-[#94A3B8] truncate">Plain-language insights</p>
            </div>

            {/* 04 // PERSONALISE */}
            <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-1.5">
              <div className="flex items-center justify-between text-[10.5px] font-mono text-amber-700">
                <span>04 // PERSONALISE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-[#1D1F22]">15</span>
                <span className="text-[10px] text-amber-600 font-semibold">building</span>
              </div>
              <div className="w-full h-1 rounded-full bg-slate-200 overflow-hidden">
                <div className="w-[40%] h-full bg-amber-500 rounded-full" />
              </div>
              <p className="text-[10.5px] text-[#94A3B8] truncate">Diet & lifestyle plans</p>
            </div>

            {/* 05 // GUIDE */}
            <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-1.5">
              <div className="flex items-center justify-between text-[10.5px] font-mono text-emerald-700">
                <span>05 // GUIDE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-emerald-700">8</span>
                <span className="text-[10px] text-emerald-600 font-semibold">ready for you</span>
              </div>
              <div className="w-full h-1 rounded-full bg-slate-200 overflow-hidden">
                <div className="w-[100%] h-full bg-emerald-500 rounded-full" />
              </div>
              <p className="text-[10.5px] text-[#94A3B8] truncate">Awaiting sign-off</p>
            </div>
          </div>
        </div>

        {/* ============ MIDDLE SECTION: WHOLE-BODY SCANNER & TELECONSULTS (2 COLS) ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* ============ LEFT COLUMN: WHOLE-BODY HEALTH SCANNER (7 COLS) ============ */}
          <div className="lg:col-span-7 bg-white rounded-[28px] p-6 sm:p-7 border border-slate-200/80 shadow-[0_8px_30px_rgba(29,31,34,0.03)] flex flex-col justify-between relative overflow-hidden">
            
            {/* Header: Title & View Angle Switcher */}
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10.5px] font-mono tracking-widest text-[#94A3B8] uppercase font-bold">
                      BODY MAP // COHORT AVERAGE
                    </span>
                    <span className="px-2 py-0.2 rounded-full text-[9.5px] font-semibold text-[#E3202B] bg-red-50 border border-red-200/70 font-mono">
                      All cohorts
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1D1F22] mt-0.5">
                    Whole-body health scanner
                  </h3>
                </div>

                {/* View Angle Pill Switcher: Front | Side | Back */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-full text-xs font-semibold">
                  {(["front", "side", "back"] as const).map((view) => (
                    <button
                      key={view}
                      type="button"
                      onClick={() => setCameraView(view)}
                      className={`px-3 py-1 rounded-full capitalize transition-all cursor-pointer ${
                        cameraView === view
                          ? "bg-white text-[#1D1F22] shadow-2xs font-bold"
                          : "text-[#64748B] hover:text-[#1D1F22]"
                      }`}
                    >
                      {view}
                    </button>
                  ))}
                </div>
              </div>

              {/* Central 3D / Schematic Visualisation with 4 Dynamic Floating Callouts */}
              <div className="relative h-[360px] sm:h-[400px] w-full mt-4 flex items-center justify-center">
                
                {/* 3D Anatomical Human Viewport */}
                <div className="absolute inset-0">
                  <NexusBodyScanner3D
                    currentView={cameraView}
                    activeHotspot={activeOrgan}
                    onSelectHotspot={setActiveOrgan}
                  />
                </div>

                {/* CALLOUT 1: LUNGS (Top Left) */}
                <div className="absolute top-4 left-0 sm:left-4 z-20 p-3 rounded-2xl bg-white/95 border border-slate-200/80 shadow-md backdrop-blur-xs min-w-[145px]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-[#64748B]">LUNGS</span>
                    <span className="px-2 py-0.2 rounded-full text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
                      STABLE
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#1D1F22]">
                    SpO2 <span className="text-emerald-600">98.9%</span>
                  </div>
                  <div className="text-[10px] text-[#94A3B8]">
                    Resting resp. 14/min
                  </div>
                </div>

                {/* CALLOUT 2: BRAIN & SLEEP (Top Right) */}
                <div className="absolute top-4 right-0 sm:right-4 z-20 p-3 rounded-2xl bg-white/95 border border-slate-200/80 shadow-md backdrop-blur-xs min-w-[145px]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-[#64748B]">BRAIN · SLEEP</span>
                    <span className="px-2 py-0.2 rounded-full text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-200">
                      SYNC
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#1D1F22]">
                    Sleep <span className="text-blue-600">6.8 h</span>
                  </div>
                  <div className="text-[10px] text-[#94A3B8]">
                    Consistency 82%
                  </div>
                </div>

                {/* CALLOUT 3: METABOLIC (Bottom Left) */}
                <div className="absolute bottom-4 left-0 sm:left-4 z-20 p-3 rounded-2xl bg-white/95 border border-amber-200/80 shadow-md backdrop-blur-xs min-w-[145px]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-[#64748B]">METABOLIC</span>
                    <span className="px-2 py-0.2 rounded-full text-[9px] font-bold text-amber-800 bg-amber-50 border border-amber-200">
                      WATCH
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#1D1F22]">
                    HbA1c <span className="text-amber-600">5.9%</span>
                  </div>
                  <div className="text-[10px] text-[#94A3B8]">
                    Post-meal peaks tracked
                  </div>
                </div>

                {/* CALLOUT 4: HEART (Bottom Right) */}
                <div className="absolute bottom-4 right-0 sm:right-4 z-20 p-3 rounded-2xl bg-white/95 border border-red-200/80 shadow-md backdrop-blur-xs min-w-[145px]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-[#64748B]">HEART</span>
                    <span className="px-2 py-0.2 rounded-full text-[9px] font-bold text-[#E3202B] bg-red-50 border border-red-200">
                      ALERT
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#1D1F22]">
                    HRV <span className="text-[#E3202B]">42 ms</span>
                  </div>
                  <div className="text-[10px] text-[#94A3B8]">
                    LDL avg 128 mg/dL
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom 3 Clinical Gauges */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#94A3B8] font-bold block">
                  AVERAGE HR
                </span>
                <span className="text-xl font-bold text-[#1D1F22] block mt-0.5">
                  71 <span className="text-xs text-[#64748B] font-normal">bpm</span>
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">
                  ↑ 1.2% this week
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-[#94A3B8] font-bold block">
                  MEDIAN SPO2
                </span>
                <span className="text-xl font-bold text-[#1D1F22] block mt-0.5">
                  98.9 <span className="text-xs text-[#64748B] font-normal">%</span>
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">
                  • Normal
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-[#94A3B8] font-bold block">
                  STRESS INDEX
                </span>
                <span className="text-xl font-bold text-[#E3202B] block mt-0.5">
                  18.4
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">
                  ↓ 3.1% improved
                </span>
              </div>
            </div>
          </div>

          {/* ============ RIGHT COLUMN: TELECONSULTS & TRIAGE RADAR (5 COLS) ============ */}
          <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
            
            {/* CARD 1: URGENT TELECONSULTS */}
            <div className="bg-white rounded-[28px] p-6 border border-slate-200/80 shadow-[0_8px_30px_rgba(29,31,34,0.03)] space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E3202B] animate-pulse" />
                  <h4 className="font-bold text-sm text-[#1D1F22]">
                    Urgent teleconsults
                  </h4>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-[#64748B] bg-slate-100">
                  3 today
                </span>
              </div>

              {/* Active Patient Box: Aarav Kapoor */}
              <div className="p-4 rounded-2xl bg-[#FFF8F8] border border-red-200/80 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="font-bold text-sm text-[#1D1F22]">
                        Aarav Kapoor
                      </h5>
                      <span className="px-2 py-0.2 rounded-full text-[9.5px] font-bold bg-[#E3202B] text-white">
                        PRIORITY
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-0.5">34 · AE-30418</p>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-sm text-[#E3202B] block">
                      6:30 PM
                    </span>
                    <span className="text-[10px] text-[#94A3B8]">in 18 min</span>
                  </div>
                </div>

                {/* Patient Triage Alert */}
                <div className="p-2.5 rounded-xl bg-white/90 border border-red-100 text-xs text-[#E3202B] flex items-start gap-2">
                  <span>⚠</span>
                  <p className="leading-snug text-[11px]">
                    Rising glucose pattern: HbA1c 5.8 → 6.1%, post-dinner peaks to 168 mg/dL.
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-1">
                  <span>Video room: <strong className="text-emerald-700">ready</strong></span>
                  <span>Summary: <strong className="text-emerald-700">shared</strong></span>
                </div>

                {/* Join Teleconsult CTA */}
                <button
                  type="button"
                  onClick={() => setTeleconsultModal(true)}
                  className="w-full py-2.5 rounded-full bg-[#E3202B] hover:bg-[#C8161F] text-white text-xs font-bold transition-all active:scale-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>▶</span>
                  <span>Join teleconsult</span>
                </button>
              </div>

              {/* Upcoming Queue */}
              <div className="space-y-2 pt-1 text-xs">
                {/* Patient 2 */}
                <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200/60 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-200 font-bold text-[10px] flex items-center justify-center text-slate-700">
                      KS
                    </div>
                    <div>
                      <p className="font-bold text-[#1D1F22]">K. Sundaram</p>
                      <p className="text-[10.5px] text-[#64748B]">Thyroid follow-up</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold block text-[#1D1F22]">7:15 PM</span>
                    <span className="text-[10px] text-emerald-600 font-medium">Pre-checked</span>
                  </div>
                </div>

                {/* Patient 3 */}
                <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200/60 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-200 font-bold text-[10px] flex items-center justify-center text-slate-700">
                      PN
                    </div>
                    <div>
                      <p className="font-bold text-[#1D1F22]">Priya Nair</p>
                      <p className="text-[10.5px] text-[#64748B]">PCOS & diet plan</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold block text-[#1D1F22]">8:00 PM</span>
                    <span className="text-[10px] text-[#94A3B8]">Queue #3</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: REAL-TIME TRIAGE RADAR */}
            <div className="bg-white rounded-[28px] p-6 border border-slate-200/80 shadow-[0_8px_30px_rgba(29,31,34,0.03)] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm">⦿</span>
                  <h4 className="font-bold text-sm text-[#1D1F22]">
                    Real-time triage radar
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-[#94A3B8]">
                  ping 1.2 s
                </span>
              </div>

              {/* Triage Rows */}
              <div className="space-y-2">
                {triageList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleTriageReview(item.id)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                      item.reviewed
                        ? "bg-slate-50 border-slate-200 opacity-60"
                        : item.severity === "ATTENTION"
                        ? "bg-red-50/50 border-red-200/80 hover:bg-red-50"
                        : item.severity === "WATCH"
                        ? "bg-amber-50/50 border-amber-200/80 hover:bg-amber-50"
                        : "bg-emerald-50/50 border-emerald-200/80 hover:bg-emerald-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          item.severity === "ATTENTION"
                            ? "bg-[#E3202B]"
                            : item.severity === "WATCH"
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                      />
                      <span className="text-[#1D1F22] truncate">
                        <strong>{item.patient}</strong> · {item.condition}
                      </span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono uppercase flex-shrink-0 ml-2 ${
                        item.severity === "ATTENTION"
                          ? "bg-red-100 text-[#E3202B]"
                          : item.severity === "WATCH"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {item.reviewed ? "REVIEWED ✓" : item.severity}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-[10.5px] text-[#94A3B8] pt-1">
                Tap a flag to mark it reviewed.
              </p>
            </div>

          </div>

        </div>

        {/* ============ BOTTOM SECTION: 3 BIOMARKER HISTOGRAM CARDS ============ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* CARD 1: LIPIDS */}
          <div className="bg-white rounded-[26px] p-5 sm:p-6 border border-slate-200/80 shadow-[0_8px_30px_rgba(29,31,34,0.03)] flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10.5px] font-mono uppercase tracking-widest text-[#94A3B8] font-bold">
                  LIPIDS
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">
                  Optimal
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <h4 className="text-sm font-bold text-[#1D1F22]">LDL cholesterol</h4>
                <span className="text-xl font-bold text-[#1D1F22]">
                  128 <span className="text-xs text-[#94A3B8] font-normal">mg/dL</span>
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] mt-0.5">
                Cohort target below 100 mg/dL
              </p>
            </div>

            {/* 6 Bar Histogram */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-end gap-1.5 h-10">
                <div className="flex-1 bg-emerald-100 rounded-sm h-[40%]" />
                <div className="flex-1 bg-emerald-200 rounded-sm h-[55%]" />
                <div className="flex-1 bg-emerald-300 rounded-sm h-[65%]" />
                <div className="flex-1 bg-emerald-400 rounded-sm h-[75%]" />
                <div className="flex-1 bg-emerald-500 rounded-sm h-[85%]" />
                <div className="flex-1 bg-emerald-600 rounded-sm h-[100%]" />
              </div>
              <div className="flex justify-between text-[10px] text-emerald-600 font-semibold">
                <span>6-mo trend</span>
                <span>-3.1%</span>
              </div>
            </div>
          </div>

          {/* CARD 2: METABOLIC */}
          <div className="bg-white rounded-[26px] p-5 sm:p-6 border border-slate-200/80 shadow-[0_8px_30px_rgba(29,31,34,0.03)] flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10.5px] font-mono uppercase tracking-widest text-[#94A3B8] font-bold">
                  METABOLIC
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200">
                  Watch
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <h4 className="text-sm font-bold text-[#1D1F22]">HbA1c</h4>
                <span className="text-xl font-bold text-amber-600">
                  5.9 <span className="text-xs text-[#94A3B8] font-normal">%</span>
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] mt-0.5">
                Average glucose equivalent tracked monthly
              </p>
            </div>

            {/* 6 Bar Histogram */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-end gap-1.5 h-10">
                <div className="flex-1 bg-blue-100 rounded-sm h-[50%]" />
                <div className="flex-1 bg-blue-200 rounded-sm h-[60%]" />
                <div className="flex-1 bg-blue-200 rounded-sm h-[58%]" />
                <div className="flex-1 bg-blue-300 rounded-sm h-[68%]" />
                <div className="flex-1 bg-blue-300 rounded-sm h-[72%]" />
                <div className="flex-1 bg-blue-600 rounded-sm h-[80%]" />
              </div>
              <div className="flex justify-between text-[10px] text-amber-600 font-semibold">
                <span>Cohort shift</span>
                <span>=0.1%</span>
              </div>
            </div>
          </div>

          {/* CARD 3: INFLAMMATION */}
          <div className="bg-white rounded-[26px] p-5 sm:p-6 border border-slate-200/80 shadow-[0_8px_30px_rgba(29,31,34,0.03)] flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10.5px] font-mono uppercase tracking-widest text-[#94A3B8] font-bold">
                  INFLAMMATION
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-[#E3202B] bg-red-50 border border-red-200">
                  Attention
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <h4 className="text-sm font-bold text-[#1D1F22]">hs-CRP</h4>
                <span className="text-xl font-bold text-[#E3202B]">
                  2.8 <span className="text-xs text-[#94A3B8] font-normal">mg/L</span>
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] mt-0.5">
                Above 1.0 mg/L in 31% of cohort
              </p>
            </div>

            {/* 6 Bar Histogram */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-end gap-1.5 h-10">
                <div className="flex-1 bg-red-100 rounded-sm h-[35%]" />
                <div className="flex-1 bg-red-200 rounded-sm h-[48%]" />
                <div className="flex-1 bg-red-200 rounded-sm h-[55%]" />
                <div className="flex-1 bg-red-300 rounded-sm h-[65%]" />
                <div className="flex-1 bg-red-400 rounded-sm h-[80%]" />
                <div className="flex-1 bg-[#E3202B] rounded-sm h-[95%]" />
              </div>
              <div className="flex justify-between text-[10px] text-[#E3202B] font-semibold">
                <span>High inflammatory</span>
                <span>-12%</span>
              </div>
            </div>
          </div>

        </div>

        {/* ============ FOOTER DISCLAIMER ============ */}
        <p className="text-center text-xs text-[#94A3B8] pt-4">
          Cohort figures are sample data. AI flags support clinical review — they are not diagnoses.
        </p>

      </main>

      {/* ============ LIVE TELECONSULT ROOM MODAL ============ */}
      {teleconsultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm ae-fade-in">
          <div className="bg-[#18191E] text-white rounded-[32px] max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-white/10 text-center relative overflow-hidden">
            <button
              type="button"
              onClick={() => setTeleconsultModal(false)}
              className="absolute right-4 top-4 text-white/50 hover:text-white p-2"
            >
              ✕
            </button>

            <div className="w-16 h-16 rounded-full bg-red-500/20 text-[#E3202B] border border-red-500/40 mx-auto flex items-center justify-center text-2xl animate-pulse">
              ▶
            </div>

            <span className="text-[10px] font-mono tracking-widest text-[#FF6B6F] font-bold uppercase block mt-4">
              ENCRYPTED CLINICAL TELECONSULT
            </span>

            <h3 className="text-2xl font-bold text-white mt-1">
              Connecting with Aarav Kapoor
            </h3>
            <p className="text-xs text-white/70 mt-1">
              Patient ID: #AE-30418 · Pre-visit metabolic analysis loaded
            </p>

            <div className="my-5 p-4 rounded-2xl bg-white/5 border border-white/10 text-left text-xs space-y-2">
              <div className="flex justify-between text-white/80">
                <span>HbA1c Telemetry:</span>
                <span className="text-[#FF6B6F] font-bold">6.1% (Borderline)</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Fasting Glucose:</span>
                <span className="text-[#FF6B6F] font-bold">108 mg/dL</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Food Scanner Log:</span>
                <span className="text-emerald-400 font-bold">Almond & Flax Granola (GI 38)</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setTeleconsultModal(false)}
                className="w-full py-3 rounded-full bg-white text-[#18191E] font-bold text-xs hover:bg-slate-100 transition-all cursor-pointer"
              >
                Launch Encrypted Room →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
