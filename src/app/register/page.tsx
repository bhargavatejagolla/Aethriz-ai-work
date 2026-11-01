"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { saveSession, UserProfile } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Account fields (Pre-filled with demo values for smooth 1-click testability)
  const [fullName, setFullName] = useState("Priyadarshini Mishra");
  const [mobile, setMobile] = useState("98765 43210");
  const [email, setEmail] = useState("patient@aethriz.com");
  const [password, setPassword] = useState("Aethriz@2026");

  // Step 2: Health Profile fields
  const [diet, setDiet] = useState("Vegetarian");
  const [goals, setGoals] = useState<string[]>(["Blood sugar", "Heart health"]);
  const [ageGroup, setAgeGroup] = useState("28-40 years");
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Female");
  const [activity, setActivity] = useState("Light");
  const [sleepHours, setSleepHours] = useState(6.5);

  // Step 3: Language & Compliance
  const [language, setLanguage] = useState("हिन्दी");
  const [agreedTerms, setAgreedTerms] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;
    return Math.max(score, 1);
  };

  const strength = getPasswordStrength();

  // Profile completion % based on current step and fields
  const calculateProgress = () => {
    if (currentStep === 1) return 33;
    if (currentStep === 2) return 67;
    return 100;
  };

  const toggleGoal = (goal: string) => {
    if (goals.includes(goal)) {
      if (goals.length > 1) {
        setGoals(goals.filter((g) => g !== goal));
      }
    } else {
      setGoals([...goals, goal]);
    }
  };

  const handleNext = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg("");

    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!agreedTerms) {
        setErrorMsg("Please agree to the privacy policy & terms to proceed.");
        return;
      }

      setIsLoading(true);
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        name: fullName || "Early User",
        email: email || "patient@aethriz.com",
        phone: mobile ? `+91 ${mobile}` : undefined,
        role: "patient",
        diet,
        goals,
        language,
      };

      saveSession(newUser);

      setTimeout(() => {
        router.push("/dashboard");
      }, 800);
    }
  };

  const handleBack = () => {
    setErrorMsg("");
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3);
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1D1F22] font-sans antialiased selection:bg-[#E3202B] selection:text-white flex flex-col justify-between">
      {/* ============ TOP FLOATING NAVBAR ============ */}
      <header className="sticky top-4 z-40 px-4 sm:px-6">
        <nav
          aria-label="Main"
          className="relative max-w-[1200px] mx-auto p-2.5 pl-4 sm:pl-5 flex items-center justify-between gap-4 rounded-full border border-white/80 shadow-[0_20px_50px_rgba(120,60,90,0.12),0_2px_8px_rgba(29,31,34,0.04),inset_0_1.5px_0_rgba(255,255,255,0.95)]"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0.75) 100%)",
            backdropFilter: "blur(28px) saturate(200%)",
            WebkitBackdropFilter: "blur(28px) saturate(200%)",
          }}
        >
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-[10px] overflow-hidden shadow-xs flex-shrink-0 transition-transform group-hover:scale-105">
              <Image
                src="/brand/aethriz-hero-logo.png"
                alt="AETHRIZ logo"
                width={36}
                height={36}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <span className="flex flex-col leading-none">
              <span
                className="font-semibold text-[17px] tracking-[0.14em] text-[#1D1F22]"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                AETHRIZ
              </span>
              <span className="text-[9px] tracking-[0.22em] text-[#C8161F] mt-[2px] font-mono">
                BIO-HEALTH AI
              </span>
            </span>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-7 text-[14.5px] font-medium text-[#545B61]">
            <Link href="/" className="hover:text-[#1D1F22] transition-colors">
              AI Health
            </Link>
            <Link href="/" className="hover:text-[#1D1F22] transition-colors">
              Analysis
            </Link>
            <Link href="/" className="hover:text-[#1D1F22] transition-colors">
              Doctors
            </Link>
            <Link href="/" className="hover:text-[#1D1F22] transition-colors">
              Bookings
            </Link>
          </div>

          {/* Right Action: Sign in */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-[#64748B] font-medium">Have an account?</span>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold text-white shadow-[0_8px_20px_rgba(14,15,17,0.22)] hover:opacity-95 transition-all cursor-pointer"
              style={{
                background: "linear-gradient(180deg, #32363A 0%, #1D1F22 100%)",
              }}
            >
              <span>Sign in</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* ============ MAIN SPLIT CONTENT ============ */}
      <main className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 flex-1 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ============ LEFT COLUMN: STEPPER & LIVE PREVIEW ============ */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            {/* Stepper Card - 100% Clickable at Any Time */}
            <div className="bg-white/85 backdrop-blur-xl rounded-[28px] p-3 border border-white/90 shadow-[0_16px_40px_rgba(29,31,34,0.05)] space-y-1.5">
              {/* Step 1 Item */}
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className={`w-full text-left p-3.5 rounded-2xl flex items-center justify-between transition-all duration-200 cursor-pointer ${
                  currentStep === 1
                    ? "bg-[#F8FAFC] border border-slate-200/90 shadow-2xs scale-[1.01]"
                    : "hover:bg-slate-50/80 hover:scale-[1.005]"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      currentStep === 1
                        ? "bg-[#1D1F22] text-white shadow-xs"
                        : "bg-[#F1F5F9] text-[#1D1F22]"
                    }`}
                  >
                    01
                  </span>
                  <div>
                    <h3 className={`text-sm font-semibold leading-tight ${currentStep === 1 ? "text-[#1D1F22]" : "text-[#475569]"}`}>
                      Account
                    </h3>
                    <p className="text-[11.5px] text-[#64748B]">Name, contact and password</p>
                  </div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={currentStep === 1 ? "text-[#E3202B]" : "text-[#94A3B8]"}>
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>

              {/* Step 2 Item */}
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className={`w-full text-left p-3.5 rounded-2xl flex items-center justify-between transition-all duration-200 cursor-pointer ${
                  currentStep === 2
                    ? "bg-[#F8FAFC] border border-slate-200/90 shadow-2xs scale-[1.01]"
                    : "hover:bg-slate-50/80 hover:scale-[1.005]"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      currentStep === 2
                        ? "bg-[#1D1F22] text-white shadow-xs"
                        : "bg-[#F1F5F9] text-[#1D1F22]"
                    }`}
                  >
                    02
                  </span>
                  <div>
                    <h3 className={`text-sm font-semibold leading-tight ${currentStep === 2 ? "text-[#1D1F22]" : "text-[#475569]"}`}>
                      Health profile
                    </h3>
                    <p className="text-[11.5px] text-[#64748B]">Diet, goals and age</p>
                  </div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={currentStep === 2 ? "text-[#E3202B]" : "text-[#94A3B8]"}>
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>

              {/* Step 3 Item */}
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className={`w-full text-left p-3.5 rounded-2xl flex items-center justify-between transition-all duration-200 cursor-pointer ${
                  currentStep === 3
                    ? "bg-[#F8FAFC] border border-slate-200/90 shadow-2xs scale-[1.01]"
                    : "hover:bg-slate-50/80 hover:scale-[1.005]"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      currentStep === 3
                        ? "bg-[#1D1F22] text-white shadow-xs"
                        : "bg-[#F1F5F9] text-[#1D1F22]"
                    }`}
                  >
                    03
                  </span>
                  <div>
                    <h3 className={`text-sm font-semibold leading-tight ${currentStep === 3 ? "text-[#1D1F22]" : "text-[#475569]"}`}>
                      Language
                    </h3>
                    <p className="text-[11.5px] text-[#64748B]">How we talk to you</p>
                  </div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={currentStep === 3 ? "text-[#E3202B]" : "text-[#94A3B8]"}>
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>

            {/* Dark Obsidian Live Profile Preview Card */}
            <div
              className="rounded-[28px] p-6 text-white relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
              style={{
                background: "linear-gradient(145deg, #18191E 0%, #101115 60%, #1F0D12 100%)",
              }}
            >
              {/* Crimson Glow Accent */}
              <div
                className="absolute -right-8 -top-8 w-44 h-44 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(227,32,43,0.4) 0%, transparent 70%)",
                  filter: "blur(20px)",
                }}
              />

              {/* Header */}
              <div className="relative z-10 flex items-center justify-between mb-5">
                <span className="text-[10.5px] font-mono tracking-[0.2em] uppercase text-[#E3202B] font-bold flex items-center gap-1.5">
                  Live profile preview
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#E3202B] ae-pulse-glow" />
              </div>

              {/* Live Values */}
              <div className="relative z-10 space-y-3.5 text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="text-white/60">Diet</span>
                  <span className="font-semibold text-white bg-white/10 px-2.5 py-1 rounded-lg">
                    {diet}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="text-white/60">Goals</span>
                  <span className="font-semibold text-white max-w-[170px] truncate text-right">
                    {goals.join(", ")}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="text-white/60">Language</span>
                  <span className="font-semibold text-[#FF8A90] font-sans bg-white/10 px-2.5 py-1 rounded-lg">
                    {language}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative z-10 mt-5 pt-1">
                <div className="w-full h-2 rounded-full bg-white/15 overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#FF6B6F] via-[#E3202B] to-[#FF4A52] transition-all duration-500 ease-out shadow-[0_0_12px_rgba(227,32,43,0.6)]"
                    style={{ width: `${calculateProgress()}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-white/60">
                  <span>Profile {calculateProgress()}% complete</span>
                  <span className="font-mono text-white/80">Step {currentStep} of 3</span>
                </div>
              </div>
            </div>
          </div>

          {/* ============ RIGHT COLUMN: MULTI-STEP FORM ============ */}
          <div className="lg:col-span-8 bg-white/85 backdrop-blur-xl rounded-[32px] p-6 sm:p-10 border border-white/90 shadow-[0_24px_60px_rgba(29,31,34,0.06),0_2px_8px_rgba(29,31,34,0.03),inset_0_1px_0_rgba(255,255,255,0.9)]">
            <form onSubmit={handleNext}>
              {/* STEP 1: ACCOUNT */}
              {currentStep === 1 && (
                <div className="space-y-6 ae-fade-in">
                  <div>
                    <span className="text-xs font-mono font-bold tracking-[0.2em] text-[#E3202B] uppercase">
                      Step 1 of 3
                    </span>
                    <h2
                      className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1D1F22] mt-1 mb-2"
                      style={{ fontFamily: "'Inter Tight', sans-serif" }}
                    >
                      Create your account.
                    </h2>
                    <p className="text-sm text-[#64748B]">
                      Early access is free. It takes under two minutes.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#475569] mb-1.5">
                        Full name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        required
                        className="w-full px-4 py-3 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 text-sm text-[#1D1F22] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#E3202B]/20 focus:border-[#E3202B] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#475569] mb-1.5">
                        Mobile number
                      </label>
                      <div className="flex rounded-2xl bg-[#F8FAFC] border border-slate-200/90 overflow-hidden focus-within:ring-2 focus-within:ring-[#E3202B]/20 focus-within:border-[#E3202B]">
                        <span className="px-3.5 py-3 text-xs font-medium text-[#64748B] bg-slate-100/70 border-r border-slate-200 flex items-center gap-1">
                          <span>+91</span>
                        </span>
                        <input
                          type="tel"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          placeholder="98765 43210"
                          maxLength={10}
                          className="w-full px-4 py-3 bg-transparent text-sm text-[#1D1F22] placeholder:text-[#94A3B8] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#475569] mb-1.5">
                      Email address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full px-4 py-3 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 text-sm text-[#1D1F22] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#E3202B]/20 focus:border-[#E3202B] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#475569] mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter a secure password"
                        required
                        className="w-full px-4 py-3 pr-12 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 text-sm text-[#1D1F22] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#E3202B]/20 focus:border-[#E3202B] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
                    
                    {/* 4-Segment Strength Indicator */}
                    <div className="mt-2.5">
                      <div className="grid grid-cols-4 gap-2.5 h-1.5">
                        <div className={`rounded-full transition-all duration-300 ${strength >= 1 ? "bg-[#E3202B] shadow-[0_0_8px_rgba(227,32,43,0.35)]" : "bg-slate-200"}`} />
                        <div className={`rounded-full transition-all duration-300 ${strength >= 2 ? "bg-[#E3202B] shadow-[0_0_8px_rgba(227,32,43,0.35)]" : "bg-slate-200"}`} />
                        <div className={`rounded-full transition-all duration-300 ${strength >= 3 ? "bg-[#FCA5A5]" : "bg-slate-200"}`} />
                        <div className={`rounded-full transition-all duration-300 ${strength >= 4 ? "bg-emerald-500" : "bg-slate-200"}`} />
                      </div>
                      <p className="text-[11px] text-[#94A3B8] mt-1.5 flex items-center justify-between">
                        <span>Use 8+ characters with a number and a symbol.</span>
                        <span className="font-medium text-[#1D1F22]">
                          {strength >= 4 ? "Strong password" : strength >= 2 ? "Moderate" : strength === 1 ? "Basic" : ""}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: HEALTH PROFILE */}
              {currentStep === 2 && (
                <div className="space-y-6 ae-fade-in">
                  <div>
                    <span className="text-xs font-mono font-bold tracking-[0.2em] text-[#E3202B] uppercase">
                      Step 2 of 3
                    </span>
                    <h2
                      className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1D1F22] mt-1 mb-2"
                      style={{ fontFamily: "'Inter Tight', sans-serif" }}
                    >
                      Personalize your health.
                    </h2>
                    <p className="text-sm text-[#64748B]">
                      Dietary habits and focus goals guide AETHRIZ’s biostatistical engine.
                    </p>
                  </div>

                  {/* Diet Selector Pills */}
                  <div>
                    <label className="block text-xs font-semibold text-[#475569] mb-2 uppercase tracking-wider">
                      Diet Pattern
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {[
                        { id: "Vegetarian", label: "Vegetarian" },
                        { id: "Eggetarian", label: "Eggetarian" },
                        { id: "Non-vegetarian", label: "Non-vegetarian" },
                        { id: "Vegan", label: "Vegan" },
                        { id: "Jain", label: "Jain" },
                        { id: "Sattvic", label: "Sattvic" },
                      ].map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => setDiet(d.id)}
                          className={`px-4 py-2.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer ${
                            diet === d.id
                              ? "bg-[#1D1F22] text-white shadow-xs scale-[1.02]"
                              : "bg-white text-[#475569] border border-slate-200/90 hover:bg-slate-50"
                          }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Primary Health Goal Pills */}
                  <div>
                    <label className="block text-xs font-semibold text-[#475569] mb-2 uppercase tracking-wider">
                      Primary Health Goals (Click to Toggle)
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {[
                        { id: "Blood sugar", label: "Blood sugar" },
                        { id: "Heart health", label: "Heart health" },
                        { id: "Weight management", label: "Weight" },
                        { id: "Energy & sleep", label: "Energy" },
                        { id: "Sleep", label: "Sleep" },
                        { id: "Gut & digestion", label: "Gut health" },
                        { id: "Longevity", label: "Longevity" },
                      ].map((g) => {
                        const isSelected = goals.includes(g.id);
                        return (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => toggleGoal(g.id)}
                            className={`px-4 py-2.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer ${
                              isSelected
                                ? "bg-[#1D1F22] text-white shadow-xs scale-[1.02]"
                                : "bg-white text-[#475569] border border-slate-200/90 hover:bg-slate-50"
                            }`}
                          >
                            {isSelected && <span className="mr-1.5 text-[#E3202B]">●</span>}
                            {g.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Daily Activity Level */}
                  <div>
                    <label className="block text-xs font-semibold text-[#475569] mb-2 uppercase tracking-wider">
                      Daily Activity
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {["Sedentary", "Light", "Moderate", "Active"].map((act) => (
                        <button
                          key={act}
                          type="button"
                          onClick={() => setActivity(act)}
                          className={`px-4 py-2.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer ${
                            activity === act
                              ? "bg-[#1D1F22] text-white shadow-xs scale-[1.02]"
                              : "bg-white text-[#475569] border border-slate-200/90 hover:bg-slate-50"
                          }`}
                        >
                          {act}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Average Nightly Sleep Slider */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-[#475569] uppercase tracking-wider">
                        Average Nightly Sleep
                      </label>
                      <span className="text-sm font-bold text-[#E3202B] font-mono">{sleepHours} h</span>
                    </div>
                    <input
                      type="range"
                      min={4}
                      max={10}
                      step={0.5}
                      value={sleepHours}
                      onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                      className="w-full accent-[#E3202B] cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-[#94A3B8] mt-1">
                      <span>4 h</span>
                      <span>Recommended 7–9 h</span>
                      <span>10 h</span>
                    </div>
                  </div>

                  {/* Age Group & Gender */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-1.5 uppercase tracking-wider">
                        Age Cohort
                      </label>
                      <select
                        value={ageGroup}
                        onChange={(e) => setAgeGroup(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 text-sm text-[#1D1F22] focus:outline-none focus:ring-2 focus:ring-[#E3202B]/20 focus:border-[#E3202B] cursor-pointer"
                      >
                        <option value="18-27 years">18-27 years (Young adult)</option>
                        <option value="28-40 years">28-40 years (Active adult)</option>
                        <option value="41-55 years">41-55 years (Midlife focus)</option>
                        <option value="56+ years">56+ years (Senior vitality)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-1.5 uppercase tracking-wider">
                        Phenotype / Gender
                      </label>
                      <div className="flex rounded-2xl bg-[#F8FAFC] border border-slate-200/90 p-1">
                        {(["Male", "Female", "Other"] as const).map((gn) => (
                          <button
                            key={gn}
                            type="button"
                            onClick={() => setGender(gn)}
                            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                              gender === gn
                                ? "bg-white text-[#1D1F22] shadow-xs"
                                : "text-[#64748B] hover:text-[#1D1F22]"
                            }`}
                          >
                            {gn}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: LANGUAGE & TERMS */}
              {currentStep === 3 && (
                <div className="space-y-6 ae-fade-in">
                  <div>
                    <span className="text-xs font-mono font-bold tracking-[0.2em] text-[#E3202B] uppercase">
                      Step 3 of 3
                    </span>
                    <h2
                      className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1D1F22] mt-1 mb-2"
                      style={{ fontFamily: "'Inter Tight', sans-serif" }}
                    >
                      Choose your language.
                    </h2>
                    <p className="text-sm text-[#64748B]">
                      AETHRIZ communicates telemetry and clinical actions in your native tongue.
                    </p>
                  </div>

                  {/* Languages Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[280px] overflow-y-auto pr-1">
                    {[
                      { code: "hi", name: "Hindi", script: "हिन्दी" },
                      { code: "en", name: "English", script: "English" },
                      { code: "or", name: "Odia", script: "ଓଡ଼ିଆ" },
                      { code: "te", name: "Telugu", script: "తెలుగు" },
                      { code: "bn", name: "Bengali", script: "বাংলা" },
                      { code: "ta", name: "Tamil", script: "தமிழ்" },
                      { code: "mr", name: "Marathi", script: "मराठी" },
                      { code: "gu", name: "Gujarati", script: "ગુજરાતી" },
                      { code: "kn", name: "Kannada", script: "ಕನ್ನಡ" },
                      { code: "ml", name: "Malayalam", script: "മലയാളം" },
                      { code: "pa", name: "Punjabi", script: "ਪੰਜਾਬੀ" },
                      { code: "ur", name: "Urdu", script: "اردو" },
                    ].map((lang) => {
                      const isSelected = language === lang.script;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => setLanguage(lang.script)}
                          className={`p-3 rounded-2xl border text-left flex flex-col transition-all duration-150 cursor-pointer ${
                            isSelected
                              ? "bg-[#1D1F22] text-white border-[#1D1F22] shadow-xs scale-[1.02]"
                              : "bg-[#F8FAFC] text-[#1D1F22] border-slate-200/90 hover:bg-slate-50"
                          }`}
                        >
                          <span className="text-xs font-semibold">{lang.name}</span>
                          <span className={`text-sm mt-0.5 ${isSelected ? "text-[#FF8A90]" : "text-[#64748B]"}`}>
                            {lang.script}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Terms Checkbox */}
                  <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-[#E3202B] focus:ring-[#E3202B] border-slate-300 cursor-pointer"
                    />
                    <label htmlFor="terms" className="text-xs text-[#64748B] leading-relaxed cursor-pointer">
                      I agree to the{" "}
                      <span className="font-semibold text-[#1D1F22]">AETHRIZ Bio-Algorithmic Privacy Charter</span> and
                      acknowledge that AI recommendations support health awareness and do not substitute hospital emergency care.
                    </label>
                  </div>
                </div>
              )}

              {/* Error Banner */}
              {errorMsg && (
                <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium ae-fade-in">
                  {errorMsg}
                </div>
              )}

              {/* Action Buttons: Back & Continue */}
              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold text-[#475569] bg-[#ECEFF3] hover:bg-[#E2E8F0] active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="py-3 px-8 rounded-full text-xs font-semibold text-white shadow-[0_10px_24px_rgba(29,31,34,0.18)] hover:opacity-95 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                  style={{
                    background: "linear-gradient(180deg, #32363A 0%, #1D1F22 100%)",
                  }}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : currentStep === 3 ? (
                    <>
                      <span>Complete registration</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  ) : (
                    <>
                      <span>Continue</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

        </div>
      </main>

      {/* Footer copyright */}
      <footer className="text-center py-4 text-xs text-[#94A3B8]">
        © 2026 AETHRIZ AI Healthcare And Advanced Research Private Limited · Privacy & Terms
      </footer>
    </div>
  );
}
