"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { clearSession, getSession } from "@/lib/auth";
import DoctorNavbar from "@/components/navigation/DoctorNavbar";

export default function DoctorPortalPage() {
  const router = useRouter();
  const [triageAcknowledged, setTriageAcknowledged] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "patients" | "appointments">("dashboard");

  useEffect(() => {
    const session = getSession();
    if (session && session.role === "patient") {
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-[#1D1F22] font-sans antialiased selection:bg-[#E3202B] selection:text-white pb-14 relative overflow-x-hidden">
      {/* Signature Ambient Red Navbar Glow */}
      <div className="ae-top-nav-glow" />

      {/* ============ STANDARD DOCTOR NAVBAR ============ */}
      <DoctorNavbar activeTab="dashboard" />

      {/* ============ MAIN DOCTOR DASHBOARD CONTAINER ============ */}
      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        
        {/* ============ SUBHEADER: GREETING & TRIAGE RADAR ============ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-[#E3202B] border border-red-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E3202B] ae-pulse-glow" />
                AI triage live
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Patient summaries synced
              </span>
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-[40px] font-semibold tracking-tight text-[#1D1F22] mt-1"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              Good evening, Dr. Rao.
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Endocrinology & Metabolic Health · Video and in-clinic
            </p>
            <p className="text-xs font-semibold text-[#1D1F22] mt-2 flex items-center gap-1.5">
              <span>📅 Today: 6 consultations, 2 AI triage flags and 3 reports ready to sign off.</span>
              <Link href="/doctor/nexus" className="text-[#E3202B] hover:underline font-bold">
                View triage queue →
              </Link>
            </p>
          </div>

          {/* Right Top Status Cards */}
          <div className="flex items-center gap-3">
            <div className="p-3 px-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-1.5 text-[10.5px] font-mono uppercase tracking-wider text-[#E3202B] font-bold">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
                <span>Triage Radar</span>
              </div>
              <p className="text-xs font-bold text-[#1D1F22] mt-0.5">2 patterns flagged</p>
            </div>

            <div className="p-3 px-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-[10.5px] font-mono uppercase tracking-wider text-[#64748B] font-bold">
                Fri, 30 Oct
              </div>
              <p className="text-xs font-bold text-[#1D1F22] mt-0.5">6:12 PM IST</p>
            </div>
          </div>
        </div>

        {/* ============ 4 TOP METRIC CARDS ============ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1 */}
          <div className="p-5 rounded-[24px] bg-white border border-slate-200/80 shadow-[0_8px_24px_rgba(29,31,34,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-medium text-[#64748B]">
              <span>ACTIVE PATIENTS</span>
              <span className="w-2 h-2 rounded-full bg-red-400" />
            </div>
            <div className="my-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-[#1D1F22]">1,284</span>
                <span className="text-xs text-[#64748B]">cohort</span>
              </div>
              <span className="text-xs font-semibold text-emerald-600">↑ 12% this month</span>
            </div>
            <div className="h-1 rounded-full bg-slate-100 overflow-hidden mt-1">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: "75%" }} />
            </div>
          </div>

          {/* Metric 2 */}
          <div className="p-5 rounded-[24px] bg-white border border-slate-200/80 shadow-[0_8px_24px_rgba(29,31,34,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-medium text-[#64748B]">
              <span>TODAY&apos;S CONSULTS</span>
              <span className="text-[#E3202B]">⏰</span>
            </div>
            <div className="my-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-[#1D1F22]">6</span>
                <span className="text-xs text-[#64748B]">sessions</span>
              </div>
              <span className="text-xs font-semibold text-[#E3202B]">Next: Aarav Kapoor · 6:30 PM</span>
            </div>
            <div className="h-1 rounded-full bg-slate-100 overflow-hidden mt-1">
              <div className="h-full bg-[#E3202B] rounded-full" style={{ width: "50%" }} />
            </div>
          </div>

          {/* Metric 3 */}
          <div className="p-5 rounded-[24px] bg-white border border-slate-200/80 shadow-[0_8px_24px_rgba(29,31,34,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-medium text-[#64748B]">
              <span>REPORTS TO SIGN OFF</span>
              <span className="text-slate-400">✏️</span>
            </div>
            <div className="my-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-[#1D1F22]">3</span>
                <span className="text-xs text-[#64748B]">ready</span>
              </div>
              <span className="text-xs text-[#64748B]">2 awaiting peer review</span>
            </div>
            <div className="h-1 rounded-full bg-slate-100 overflow-hidden mt-1">
              <div className="h-full bg-slate-400 rounded-full" style={{ width: "60%" }} />
            </div>
          </div>

          {/* Metric 4 */}
          <div className="p-5 rounded-[24px] bg-white border border-slate-200/80 shadow-[0_8px_24px_rgba(29,31,34,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-medium text-[#64748B]">
              <span>AI INSIGHTS READY</span>
              <span className="text-[#E3202B]">✨</span>
            </div>
            <div className="my-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-[#1D1F22]">14</span>
                <span className="text-xs text-[#64748B]">patients</span>
              </div>
              <span className="text-xs font-semibold text-[#E3202B]">⚠ 2 flagged for triage</span>
            </div>
            <div className="h-1 rounded-full bg-slate-100 overflow-hidden mt-1">
              <div className="h-full bg-[#E3202B] rounded-full" style={{ width: "85%" }} />
            </div>
          </div>
        </div>

        {/* ============ AETHRIZ AI REPORT PIPELINE ============ */}
        <div className="p-6 rounded-[28px] bg-white border border-slate-200/80 shadow-[0_8px_24px_rgba(29,31,34,0.03)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#E3202B]">
                AETHRIZ AI · REPORT PIPELINE
              </span>
              <span className="text-sm font-semibold text-[#1D1F22]">
                Patient reports moving through analysis
              </span>
            </div>
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              121 reports today
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* Step 1 */}
            <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/70">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B]">
                <span>01 · SCAN</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              </div>
              <p className="text-2xl font-bold text-[#1D1F22] my-1">48</p>
              <div className="h-1 bg-slate-200 rounded-full mb-1.5" />
              <p className="text-[11px] text-[#64748B]">Reports uploaded</p>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/70">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B]">
                <span>02 · ANALYSE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#E3202B]" />
              </div>
              <p className="text-2xl font-bold text-[#1D1F22] my-1">32</p>
              <div className="h-1 bg-[#E3202B] rounded-full mb-1.5" />
              <p className="text-[11px] text-[#64748B]">Deep-learning models</p>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/70">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B]">
                <span>03 · INTERPRET</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <p className="text-2xl font-bold text-[#1D1F22] my-1">19</p>
              <div className="h-1 bg-emerald-500 rounded-full mb-1.5" />
              <p className="text-[11px] text-[#64748B]">Plain-language insights</p>
            </div>

            {/* Step 4 */}
            <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/70">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B]">
                <span>04 · PERSONALISE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              </div>
              <p className="text-2xl font-bold text-[#1D1F22] my-1">14</p>
              <div className="h-1 bg-amber-500 rounded-full mb-1.5" />
              <p className="text-[11px] text-[#64748B]">Diet & lifestyle plans</p>
            </div>

            {/* Step 5 */}
            <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/70">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B]">
                <span>05 · GUIDE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <p className="text-2xl font-bold text-[#1D1F22] my-1">8</p>
              <div className="h-1 bg-emerald-500 rounded-full mb-1.5" />
              <p className="text-[11px] text-[#64748B]">Ready for your review</p>
            </div>
          </div>
        </div>

        {/* ============ 2-COLUMN MAIN CONTENT ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* ============ LEFT COLUMN: CONSULTATIONS & FEED (8 COLS) ============ */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* CARD: UPCOMING CONSULTATIONS */}
            <div className="p-6 rounded-[28px] bg-white border border-slate-200/80 shadow-[0_8px_24px_rgba(29,31,34,0.03)]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[#E3202B]">📹</span>
                  <h3 className="text-sm font-semibold text-[#1D1F22]">Upcoming consultations</h3>
                  <span className="text-xs text-[#64748B] hidden sm:inline">· AI summaries shared by patients</span>
                </div>
                <span className="text-xs font-semibold text-[#64748B]">3 remaining</span>
              </div>

              <div className="space-y-3">
                {/* Patient 1: Aarav Kapoor */}
                <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#E3202B] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                      AK
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-[#1D1F22]">Aarav Kapoor</h4>
                        <span className="text-[11px] text-[#64748B]">34 · M · हिन्दी</span>
                      </div>
                      <p className="text-[11px] text-[#E3202B] font-semibold mt-0.5">
                        6:30 PM · in 18 min · HbA1c review · summary shared
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/doctor/nexus"
                    className="px-4 py-2 rounded-full text-xs font-semibold text-white shadow-xs hover:opacity-95 text-center cursor-pointer"
                    style={{ background: "linear-gradient(180deg, #32363A 0%, #1D1F22 100%)" }}
                  >
                    Join teleconsult
                  </Link>
                </div>

                {/* Patient 2: K. Sundaram */}
                <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                      KS
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-[#1D1F22]">K. Sundaram</h4>
                        <span className="text-[11px] text-[#64748B]">63 · M · தமிழ்</span>
                      </div>
                      <p className="text-[11px] text-[#64748B] mt-0.5">
                        7:15 PM · Thyroid follow-up
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/doctor/nexus"
                    className="px-4 py-2 rounded-full text-xs font-semibold text-white shadow-xs hover:opacity-95 text-center cursor-pointer"
                    style={{ background: "linear-gradient(180deg, #32363A 0%, #1D1F22 100%)" }}
                  >
                    Join teleconsult
                  </Link>
                </div>

                {/* Patient 3: Priya Nair */}
                <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                      PN
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-[#1D1F22]">Priya Nair</h4>
                        <span className="text-[11px] text-[#64748B]">41 · F · മലയാളം</span>
                      </div>
                      <p className="text-[11px] text-[#64748B] mt-0.5">
                        8:00 PM · PCOS & diet plan
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-full text-xs font-semibold text-[#475569] bg-white border border-slate-200 hover:bg-slate-50 cursor-pointer"
                  >
                    Prepare notes
                  </button>
                </div>
              </div>
            </div>

            {/* CARD: AI PATIENT ANALYSIS FEED */}
            <div className="p-6 rounded-[28px] bg-white border border-slate-200/80 shadow-[0_8px_24px_rgba(29,31,34,0.03)] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[#1D1F22]">AI patient analysis feed</h3>
                  <p className="text-[11.5px] text-[#64748B]">Reports and wearable trends, summarised for review</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </div>

              {/* Feed Item 1: Aarav Kapoor */}
              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1D1F22]">Aarav Kapoor</span>
                    <span className="text-[11px] text-[#64748B] font-mono">AE-30418</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-red-100 text-[#E3202B]">
                      Attention
                    </span>
                  </div>
                  <span className="text-[11px] text-[#94A3B8]">Updated 4 min ago</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                    <span className="text-[11px] text-[#64748B]">HbA1c</span>
                    <p className="text-sm font-bold text-[#E3202B]">6.1% <span className="text-[10px] font-normal text-[#E3202B]">↑ from 5.8</span></p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                    <span className="text-[11px] text-[#64748B]">Post-meal glucose</span>
                    <p className="text-sm font-bold text-[#E3202B]">168 <span className="text-[10px] font-normal text-[#64748B]">mg/dL peak</span></p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                    <span className="text-[11px] text-[#64748B]">Vitamin D</span>
                    <p className="text-sm font-bold text-amber-600">18.2 <span className="text-[10px] font-normal text-[#64748B]">ng/mL · low</span></p>
                  </div>
                </div>

                <p className="text-xs text-[#475569]">
                  Pattern: spikes on days with dinner after 9:30 PM. Patient is vegetarian and prefers Hindi.
                </p>

                <Link
                  href="/doctor/nexus"
                  className="block w-full py-2.5 rounded-xl text-center text-xs font-semibold text-white cursor-pointer hover:opacity-95 transition-all shadow-xs"
                  style={{ background: "linear-gradient(180deg, #32363A 0%, #1D1F22 100%)" }}
                >
                  Review AI report
                </Link>
              </div>

              {/* Feed Item 2: Meena Pillai */}
              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1D1F22]">Meena Pillai</span>
                    <span className="text-[11px] text-[#64748B] font-mono">AE-28812</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-100 text-amber-700">
                      Watch
                    </span>
                  </div>
                  <span className="text-[11px] text-[#94A3B8]">Updated 12 min ago</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-2 rounded-xl bg-white border border-slate-200/80">
                    <span className="text-[10.5px] text-[#64748B]">LDL-C</span>
                    <p className="text-xs font-bold text-[#E3202B]">168 <span className="text-[10px] font-normal text-[#64748B]">high</span></p>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200/80">
                    <span className="text-[10.5px] text-[#64748B]">Triglycerides</span>
                    <p className="text-xs font-bold text-amber-600">182 <span className="text-[10px] font-normal text-[#64748B]">mg/dL</span></p>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200/80">
                    <span className="text-[10.5px] text-[#64748B]">HbA1c</span>
                    <p className="text-xs font-bold text-emerald-600">5.6% <span className="text-[10px] font-normal text-[#64748B]">stable</span></p>
                  </div>
                </div>

                <p className="text-xs text-[#64748B]">
                  Lipids trending up over two reports. Consider cardiology co-review.
                </p>

                <button
                  type="button"
                  className="w-full py-2 rounded-xl text-xs font-semibold text-[#475569] bg-white border border-slate-200 hover:bg-slate-50 cursor-pointer"
                >
                  Open details
                </button>
              </div>
            </div>

          </div>

          {/* ============ RIGHT COLUMN: TRIAGE & COHORT (4 COLS) ============ */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* CARD: AI TRIAGE (DARK OBSIDIAN) */}
            <div className="p-6 rounded-[28px] bg-[#111216] text-white border border-white/10 shadow-[0_24px_50px_rgba(0,0,0,0.3)] relative overflow-hidden">
              <div
                className="absolute -right-12 -top-12 w-48 h-48 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(227,32,43,0.35) 0%, transparent 70%)",
                  filter: "blur(28px)",
                }}
              />

              <div className="relative z-10 flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-[#E3202B] font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#E3202B] ae-pulse-glow" />
                  AI triage
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-950 text-red-300 border border-red-800">
                  High confidence
                </span>
              </div>

              <div className="relative z-10 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-red-500/20 text-[#E3202B] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Rising glucose pattern</h4>
                    <p className="text-[11px] text-white/60">Aarav Kapoor · AE-30418</p>
                  </div>
                </div>

                <p className="text-xs text-white/80 leading-relaxed">
                  <span className="text-[#FF8A90] font-semibold">HbA1c 5.8 → 6.1%</span> over 3 months, with post-meal peaks mid-week linked to late dinners. Vitamin D and ferritin are low.
                </p>

                <p className="text-[11px] text-white/50 italic">
                  Suggested for review: lifestyle plan, repeat HbA1c in 90 days. Clinician decides.
                </p>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setTriageAcknowledged(true)}
                    className={`flex-1 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      triageAcknowledged
                        ? "bg-emerald-600 text-white"
                        : "bg-white text-[#1D1F22] hover:bg-slate-100 shadow-xs"
                    }`}
                  >
                    {triageAcknowledged ? "✓ Acknowledged" : "Acknowledge"}
                  </button>
                  <Link
                    href="/doctor/nexus"
                    className="flex-1 py-2.5 rounded-full text-xs font-semibold border border-white/20 text-white hover:bg-white/10 text-center transition-all cursor-pointer"
                  >
                    Open patient
                  </Link>
                </div>
              </div>
            </div>

            {/* CARD: QUICK ACTIONS */}
            <div className="p-6 rounded-[28px] bg-white border border-slate-200/80 shadow-[0_8px_24px_rgba(29,31,34,0.03)]">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-3">
                Quick actions
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200/70 hover:bg-slate-100 transition-all cursor-pointer">
                  <span className="text-base text-[#E3202B]">📄</span>
                  <h4 className="text-xs font-bold text-[#1D1F22] mt-1">Sign off reports</h4>
                  <p className="text-[10px] text-[#64748B]">3 ready</p>
                </div>

                <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200/70 hover:bg-slate-100 transition-all cursor-pointer">
                  <span className="text-base text-amber-600">📅</span>
                  <h4 className="text-xs font-bold text-[#1D1F22] mt-1">Today&apos;s schedule</h4>
                  <p className="text-[10px] text-[#64748B]">6 sessions</p>
                </div>

                <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200/70 hover:bg-slate-100 transition-all cursor-pointer">
                  <span className="text-base text-emerald-600">✍️</span>
                  <h4 className="text-xs font-bold text-[#1D1F22] mt-1">Write article</h4>
                  <p className="text-[10px] text-[#64748B]">Draft saved</p>
                </div>

                <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200/70 hover:bg-slate-100 transition-all cursor-pointer">
                  <span className="text-base text-[#E3202B]">⚡</span>
                  <h4 className="text-xs font-bold text-[#1D1F22] mt-1">Issue care plan</h4>
                  <p className="text-[10px] text-[#64748B]">Diet & follow-up</p>
                </div>
              </div>
            </div>

            {/* CARD: COHORT SNAPSHOT */}
            <div className="p-6 rounded-[28px] bg-white border border-slate-200/80 shadow-[0_8px_24px_rgba(29,31,34,0.03)] text-center">
              <h3 className="text-xs font-semibold text-[#1D1F22]">Cohort snapshot</h3>
              <p className="text-[11px] text-[#64748B]">Your 1,284 active patients</p>

              {/* Heart rate dial */}
              <div className="relative w-28 h-28 mx-auto my-4 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" className="stroke-slate-100" strokeWidth="6" fill="none" />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#E3202B"
                    strokeWidth="6"
                    strokeDasharray={2 * Math.PI * 38}
                    strokeDashoffset={2 * Math.PI * 38 * 0.3}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold text-[#1D1F22]">71</span>
                  <span className="text-[10px] text-[#64748B] font-mono">bpm avg</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                <div>
                  <p className="text-xs font-bold text-[#1D1F22]">5.9%</p>
                  <span className="text-[10px] text-[#64748B]">avg HbA1c</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-600">38%</p>
                  <span className="text-[10px] text-[#64748B]">low Vit D</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-600">↓ 3%</p>
                  <span className="text-[10px] text-[#64748B]">avg LDL</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Clinical Disclaimer */}
        <p className="text-center text-xs text-[#94A3B8] pt-4">
          AI outputs support clinical judgement and are never used to diagnose or prescribe without a doctor&apos;s review.
        </p>

      </main>
    </div>
  );
}
