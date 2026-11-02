"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PatientNavbar from "@/components/navigation/PatientNavbar";

type ActivityLevel = "Sedentary" | "Light" | "Moderate" | "Active";
type DietPattern = "Vegetarian" | "Eggetarian" | "Non-vegetarian" | "Vegan" | "Jain";
type HealthGoal = "Blood sugar" | "Heart health" | "Weight" | "Energy" | "Sleep";

export default function HealthCheckInPage() {
  // Input states with defaults matching mockup
  const [age, setAge] = useState<string>("34");
  const [height, setHeight] = useState<string>("172");
  const [weight, setWeight] = useState<string>("74");
  const [activity, setActivity] = useState<ActivityLevel>("Light");
  const [sleepHours, setSleepHours] = useState<number>(6.5);
  const [diet, setDiet] = useState<DietPattern>("Vegetarian");
  const [goal, setGoal] = useState<HealthGoal>("Blood sugar");

  // Analysis status: "idle" | "analyzing" | "completed"
  const [analysisState, setAnalysisState] = useState<"idle" | "analyzing" | "completed">("idle");
  const [isSaved, setIsSaved] = useState(false);

  // Derived BMI
  const parsedHeightM = parseFloat(height) / 100;
  const parsedWeightKg = parseFloat(weight);
  const bmi =
    parsedHeightM > 0 && parsedWeightKg > 0
      ? (parsedWeightKg / (parsedHeightM * parsedHeightM)).toFixed(1)
      : "25.0";

  // Reset handler
  const handleReset = () => {
    setAge("34");
    setHeight("172");
    setWeight("74");
    setActivity("Light");
    setSleepHours(6.5);
    setDiet("Vegetarian");
    setGoal("Blood sugar");
    setAnalysisState("idle");
    setIsSaved(false);
  };

  // Trigger analysis simulation
  const handleAnalyse = () => {
    setAnalysisState("analyzing");
    setTimeout(() => {
      setAnalysisState("completed");
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] text-[#1D1F22] flex flex-col font-sans selection:bg-[#E11D48]/15 selection:text-[#E11D48] relative overflow-x-hidden">
      
      {/* ============ STANDARD PATIENT NAVBAR ============ */}
      <PatientNavbar activeTab="analysis" />

      {/* ==================== MAIN CONTENT WRAPPER ==================== */}
      <main className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 flex-1 flex flex-col gap-6">

        {/* Subheader: Badges + Heading + Private Session Card */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-black/[0.06] text-xs font-semibold text-[#1D1F22] shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#E11D48]" />
                LIFESTYLE MODULE
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#1D1F22] text-[10px] font-bold text-white font-mono">
                v2.4 ready
              </span>
            </div>

            <h1
              className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1D1F22] mb-1"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              Health check-in.
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] max-w-xl leading-relaxed">
              Tell us a little about your day. AETHRIZ turns it into an overview of your lifestyle, sleep and nutrition — no lab report needed.
            </p>
          </div>

          {/* Right Private Session Badge */}
          <div className="flex items-center gap-3 p-3 px-4 rounded-2xl bg-white/85 border border-white/90 shadow-[0_12px_28px_rgba(29,31,34,0.04)] w-fit">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-100">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <span className="text-xs font-bold text-[#1D1F22] block leading-none">
                Private session
              </span>
              <span className="text-[11px] text-[#64748B] block mt-0.5 leading-none">
                Encrypted · you choose what to save
              </span>
            </div>
          </div>
        </div>

        {/* ==================== 2-COLUMN MAIN GRID ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* ================= LEFT COLUMN (6 COLS): YOUR HEALTH INFORMATION ================= */}
          <div className="lg:col-span-6 bg-white/85 backdrop-blur-xl rounded-[28px] border border-white/90 shadow-[0_24px_60px_rgba(29,31,34,0.06),0_2px_8px_rgba(29,31,34,0.03),inset_0_1px_0_rgba(255,255,255,0.9)] p-6 sm:p-7 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-black/[0.04] mb-5">
                <h2 className="text-base sm:text-lg font-bold text-[#1D1F22]">
                  Your health information
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-[#64748B] text-[11px] font-medium">
                  All optional
                </span>
              </div>

              {/* Age, Height, Weight Row */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div>
                  <label className="block text-[11px] font-medium text-[#64748B] mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-gray-200 focus:border-[#E11D48] focus:bg-white text-sm font-semibold text-[#1D1F22] outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#64748B] mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-gray-200 focus:border-[#E11D48] focus:bg-white text-sm font-semibold text-[#1D1F22] outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#64748B] mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-gray-200 focus:border-[#E11D48] focus:bg-white text-sm font-semibold text-[#1D1F22] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Daily Activity Selector */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-[#1D1F22] mb-2">
                  Daily activity
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(["Sedentary", "Light", "Moderate", "Active"] as ActivityLevel[]).map((level) => {
                    const isActive = activity === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setActivity(level)}
                        className={`py-2 px-3 rounded-full text-xs font-semibold transition-all cursor-pointer text-center ${
                          isActive
                            ? "bg-[#1D1F22] text-white shadow-xs"
                            : "bg-[#F8FAFC] border border-gray-200/80 text-[#64748B] hover:text-[#1D1F22] hover:bg-gray-100"
                        }`}
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Average Nightly Sleep Slider */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#1D1F22]">
                    Average nightly sleep
                  </span>
                  <span className="text-xs font-bold text-[#E11D48] font-mono">
                    {sleepHours.toFixed(1)} h
                  </span>
                </div>

                <input
                  type="range"
                  min={4}
                  max={10}
                  step={0.5}
                  value={sleepHours}
                  onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#E11D48]"
                />

                <div className="flex items-center justify-between text-[11px] text-[#64748B] mt-1.5 font-medium">
                  <span>4 h</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">
                    Recommended 7–9 h
                  </span>
                  <span>10 h</span>
                </div>
              </div>

              {/* Diet Pattern Selector */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-[#1D1F22] mb-2">
                  Diet pattern
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {(["Vegetarian", "Eggetarian", "Non-vegetarian", "Vegan", "Jain"] as DietPattern[]).map((d) => {
                    const isActive = diet === d;
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDiet(d)}
                        className={`py-1.5 px-3.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                          isActive
                            ? "bg-[#1D1F22] text-white shadow-xs"
                            : "bg-[#F8FAFC] border border-gray-200/80 text-[#64748B] hover:text-[#1D1F22] hover:bg-gray-100"
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Primary Health Goal */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-[#1D1F22] mb-2">
                  Primary health goal
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {(["Blood sugar", "Heart health", "Weight", "Energy", "Sleep"] as HealthGoal[]).map((g) => {
                    const isActive = goal === g;
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGoal(g)}
                        className={`py-1.5 px-3.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                          isActive
                            ? "bg-[#1D1F22] text-white shadow-xs"
                            : "bg-[#F8FAFC] border border-gray-200/80 text-[#64748B] hover:text-[#1D1F22] hover:bg-gray-100"
                        }`}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Primary Actions: Analyse Button + Reset */}
              <div className="flex items-center gap-4 mb-4">
                <button
                  type="button"
                  onClick={handleAnalyse}
                  disabled={analysisState === "analyzing"}
                  className="flex-1 py-3 px-6 rounded-full bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold tracking-wide shadow-[0_8px_20px_rgba(225,29,72,0.3)] hover:shadow-[0_12px_28px_rgba(225,29,72,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 group disabled:opacity-70"
                >
                  {analysisState === "analyzing" ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Synthesising lifestyle bio-data...</span>
                    </>
                  ) : (
                    <>
                      <span>Analyse my health</span>
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-3 rounded-full text-xs font-medium text-[#64748B] hover:text-[#1D1F22] transition-colors cursor-pointer"
                >
                  Reset inputs
                </button>
              </div>
            </div>

            {/* Sub-callout: Upload lab report notice */}
            <div className="p-3.5 rounded-2xl bg-[#FFF1F2]/60 border border-[#FFE4E6] flex items-start gap-2.5 mt-2">
              <span className="text-[#E11D48] text-sm mt-0.5">ⓘ</span>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Accurate sleep and activity details make your overview more precise. For a deeper look,{" "}
                <Link href="/health-analysis" className="text-[#E11D48] font-semibold hover:underline">
                  upload a lab report
                </Link>
                .
              </p>
            </div>
          </div>

          {/* ================= RIGHT COLUMN (6 COLS): YOUR HEALTH OVERVIEW ================= */}
          <div className="lg:col-span-6 bg-white/85 backdrop-blur-xl rounded-[28px] border border-white/90 shadow-[0_24px_60px_rgba(29,31,34,0.06),0_2px_8px_rgba(29,31,34,0.03),inset_0_1px_0_rgba(255,255,255,0.9)] p-6 sm:p-7 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-black/[0.04] mb-6">
                <h2 className="text-base sm:text-lg font-bold text-[#1D1F22]">
                  Your health overview
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                    analysisState === "completed"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-gray-100 text-[#64748B]"
                  }`}
                >
                  {analysisState === "completed" ? "Generated" : "Pending"}
                </span>
              </div>

              {/* State A: PENDING (Matches Screenshot exactly) */}
              {analysisState !== "completed" && (
                <div className="flex flex-col items-center justify-center text-center py-8">
                  {/* Glowing Circular Orb with Pulse */}
                  <div className="relative w-36 h-36 flex items-center justify-center mb-6">
                    {/* Multi-layered soft red radial aura */}
                    <div
                      className="absolute inset-0 rounded-full blur-2xl opacity-40 animate-pulse"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(225,29,72,0.45) 0%, rgba(254,205,211,0.2) 60%, transparent 80%)",
                      }}
                    />
                    <div className="relative w-28 h-28 rounded-full bg-gradient-to-b from-white via-rose-50 to-rose-100/60 shadow-[0_12px_32px_rgba(225,29,72,0.12),inset_0_2px_4px_rgba(255,255,255,0.95)] border border-rose-100 flex items-center justify-center">
                      {/* Gentle central pulse line */}
                      <svg className="w-10 h-6 text-[#E11D48] opacity-80" viewBox="0 0 60 24" fill="none">
                        <path
                          d="M0 12h18l4-8 6 16 5-10 4 4 3-2h20"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>

                  <h3
                    className="text-xl sm:text-2xl font-semibold text-[#1D1F22] mb-2 tracking-tight"
                    style={{ fontFamily: "'Inter Tight', sans-serif" }}
                  >
                    Your personalised overview starts here.
                  </h3>
                  <p className="text-xs sm:text-sm text-[#64748B] max-w-sm mx-auto leading-relaxed mb-8">
                    Fill in what you know and press Analyse. You&apos;ll see vitality, rest rhythm and points to discuss with a clinician.
                  </p>

                  {/* 3 Summary Preview Boxes */}
                  <div className="grid grid-cols-3 gap-3 w-full">
                    <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-black/[0.04] text-left">
                      <span className="text-[11px] font-bold text-[#E11D48] block">
                        Vitality
                      </span>
                      <span className="text-xs text-[#64748B] mt-0.5 block">
                        Awaiting input
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-black/[0.04] text-left">
                      <span className="text-[11px] font-bold text-[#E11D48] block">
                        Rest rhythm
                      </span>
                      <span className="text-xs text-[#64748B] mt-0.5 block">
                        Sleep & recovery
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-black/[0.04] text-left">
                      <span className="text-[11px] font-bold text-[#E11D48] block">
                        Clinician prompts
                      </span>
                      <span className="text-xs text-[#64748B] mt-0.5 block">
                        Discussion points
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* State B: COMPLETED ANALYSIS (Dynamic Results) */}
              {analysisState === "completed" && (
                <div className="space-y-5 animate-fade-in">
                  
                  {/* Top Vitality Metric Banner */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50/80 via-white to-amber-50/60 border border-rose-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-[#E11D48] uppercase tracking-wider block">
                        Lifestyle Vitality Index
                      </span>
                      <h4 className="text-2xl font-bold text-[#1D1F22] mt-0.5">
                        81 <span className="text-sm font-normal text-[#64748B]">/ 100</span>
                      </h4>
                      <p className="text-xs text-[#475569] mt-0.5">
                        BMI: <strong className="text-[#1D1F22]">{bmi}</strong> · {activity} activity level
                      </p>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-white shadow-xs border border-rose-100 flex items-center justify-center text-[#E11D48] font-bold text-lg font-mono">
                      81%
                    </div>
                  </div>

                  {/* 3 Active Telemetry Breakdown Cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-black/[0.04]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                        Rest Rhythm
                      </span>
                      <span className="text-base font-bold text-[#1D1F22] block mt-1">
                        {sleepHours} h / night
                      </span>
                      <span className={`text-[11px] font-medium block mt-0.5 ${sleepHours >= 7 && sleepHours <= 9 ? "text-emerald-600" : "text-amber-600"}`}>
                        {sleepHours >= 7 && sleepHours <= 9 ? "Optimal duration" : "Mild sleep debt"}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-black/[0.04]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                        Diet Balance
                      </span>
                      <span className="text-base font-bold text-[#1D1F22] block mt-1">
                        {diet}
                      </span>
                      <span className="text-[11px] font-medium text-emerald-600 block mt-0.5">
                        Good micronutrients
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-black/[0.04]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                        Primary Target
                      </span>
                      <span className="text-base font-bold text-[#E11D48] block mt-1">
                        {goal}
                      </span>
                      <span className="text-[11px] font-medium text-[#64748B] block mt-0.5">
                        Post-meal ambulation
                      </span>
                    </div>
                  </div>

                  {/* Clinician Talking Points */}
                  <div className="p-4 rounded-2xl bg-white border border-gray-200">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#1D1F22] block mb-2 flex items-center gap-1.5">
                      <span className="text-[#E11D48]">✦</span> Clinician discussion points
                    </span>
                    <ul className="space-y-1.5 text-xs text-[#475569]">
                      <li className="flex items-start gap-2">
                        <span className="text-[#E11D48] font-bold">•</span>
                        <span>
                          Targeting <strong>{goal}</strong>: Consider a 10-minute walk after your heaviest meal to blunt glucose spikes.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#E11D48] font-bold">•</span>
                        <span>
                          {sleepHours < 7 ? "Extend sleep opportunity by 30 minutes to lower morning fasting cortisol." : "Maintain current sleep consistency across weekdays and weekends."}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#E11D48] font-bold">•</span>
                        <span>
                          {diet === "Vegetarian" || diet === "Jain" ? "Pair whole grains with legumes (e.g. dal or paneer) to reach 65g daily protein." : "Incorporate omega-3 rich seeds and leafy greens."}
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Actions: Save to Profile & Consult Doctor */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => setIsSaved(true)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-[#1D1F22] hover:bg-black text-white text-xs font-semibold shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {isSaved ? (
                        <>
                          <span className="text-emerald-400">✓</span>
                          <span>Saved to profile</span>
                        </>
                      ) : (
                        <span>Save to my profile</span>
                      )}
                    </button>

                    <Link
                      href="/doctors"
                      className="py-2.5 px-4 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-[#1D1F22] text-xs font-semibold shadow-xs transition-all cursor-pointer text-center"
                    >
                      Discuss with doctor →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* ==================== BOTTOM FOOTER: MEDICAL SAFETY NOTICE ==================== */}
        <footer className="p-4 sm:p-5 rounded-2xl bg-white/85 border border-white/90 shadow-[0_12px_28px_rgba(29,31,34,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0 text-[#E11D48]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <span className="text-xs font-bold text-[#1D1F22] block">
                Medical safety notice
              </span>
              <p className="text-[11px] text-[#64748B] mt-0.5">
                This tool gives general wellness information. It does not replace a qualified doctor, diagnosis or a treatment plan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium self-end sm:self-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Your inputs are not stored unless you save them</span>
          </div>
        </footer>

      </main>

    </div>
  );
}
