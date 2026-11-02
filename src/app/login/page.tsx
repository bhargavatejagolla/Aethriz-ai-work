"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MOCK_USERS, saveSession } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successRole, setSuccessRole] = useState<string | null>(null);

  // Quick filler for testing mock accounts
  const fillMock = (mockEmail: string) => {
    const mock = MOCK_USERS[mockEmail];
    if (mock) {
      setTab("email");
      setEmail(mock.user.email);
      setPassword(mock.password);
      setErrorMsg("");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    setTimeout(() => {
      // Check mock user matching
      const targetUser = MOCK_USERS[email.toLowerCase().trim()];

      if (tab === "email") {
        if (!email || !password) {
          setErrorMsg("Please enter both email and password.");
          setIsLoading(false);
          return;
        }

        if (targetUser && targetUser.password === password) {
          saveSession(targetUser.user);
          setSuccessRole(targetUser.user.role);
          setTimeout(() => {
            router.push(targetUser.redirect);
          }, 800);
          return;
        }

        // Generic fallback for any email
        const fallbackUser = {
          id: `usr-${Date.now()}`,
          name: email.split("@")[0].replace(".", " "),
          email,
          role: email.includes("doctor") ? "doctor" : "patient",
        } as const;

        saveSession(fallbackUser);
        setSuccessRole(fallbackUser.role);
        setTimeout(() => {
          router.push(fallbackUser.role === "doctor" ? "/doctor-portal" : "/dashboard");
        }, 800);
      } else {
        // OTP login
        if (!phone || phone.length < 10) {
          setErrorMsg("Please enter a valid 10-digit mobile number.");
          setIsLoading(false);
          return;
        }

        const patientMock = MOCK_USERS["patient@aethriz.com"];
        saveSession(patientMock.user);
        setSuccessRole("patient");
        setTimeout(() => {
          router.push(patientMock.redirect);
        }, 800);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1D1F22] font-sans antialiased selection:bg-[#E3202B] selection:text-white flex flex-col justify-between">
      {/* ============ TOP FLOATING NAVBAR ============ */}
      <header className="sticky top-3 sm:top-4 z-40 px-3 sm:px-6 w-full">
        <nav
          aria-label="Main"
          className="relative max-w-[1280px] mx-auto p-2 sm:p-2.5 pl-4 sm:pl-5 flex items-center justify-between gap-4 rounded-full border border-slate-200/80 bg-white shadow-[0_4px_24px_rgba(29,31,34,0.04)]"
        >
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3 group">
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
                className="font-bold text-[16px] tracking-[0.14em] text-[#1D1F22]"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                AETHRIZ
              </span>
              <span className="text-[8.5px] tracking-[0.22em] text-[#C8161F] mt-[2px] font-mono">
                BIO-HEALTH AI
              </span>
            </span>
          </Link>

          {/* Right Action: Create account CTA */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-[#64748B] font-medium">New here?</span>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold text-white shadow-xs hover:opacity-95 transition-all cursor-pointer bg-[#1D1F22]"
            >
              <span>Create account</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* ============ MAIN SPLIT CONTENT ============ */}
      <main className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 flex-1 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* ============ LEFT COLUMN: SIGN IN FORM ============ */}
          <div className="lg:col-span-6 bg-white/85 backdrop-blur-xl rounded-[32px] p-6 sm:p-10 border border-white/90 shadow-[0_24px_60px_rgba(29,31,34,0.06),0_2px_8px_rgba(29,31,34,0.03),inset_0_1px_0_rgba(255,255,255,0.9)] flex flex-col justify-between">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF1F2] border border-[#FFE4E6] text-xs font-medium text-[#E11D48] mb-5">
                <span className="w-2 h-2 rounded-full bg-[#E11D48] ae-pulse" />
                <span>Secure sign-in</span>
              </div>

              {/* Title & Subtitle */}
              <h1
                className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1D1F22] mb-2"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                Welcome back.
              </h1>
              <p className="text-sm text-[#64748B] mb-6">
                Sign in to see your latest health insights.
              </p>

              {/* Mock Accounts Quick Select Pill Bar */}
              <div className="mb-5 p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="text-[11px] font-semibold tracking-wider uppercase text-[#64748B] mb-2 flex items-center justify-between">
                  <span>Quick Test Roles (One-Click Auto-Fill)</span>
                  <span className="text-[10px] text-[#C8161F] font-mono">Mock Auth</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => fillMock("patient@aethriz.com")}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-[#1D1F22] hover:border-[#E3202B] hover:text-[#E3202B] shadow-2xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 text-[#64748B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span>Patient</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillMock("doctor@aethriz.com")}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-[#1D1F22] hover:border-[#E3202B] hover:text-[#E3202B] shadow-2xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 text-[#E3202B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
                      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
                      <circle cx="20" cy="10" r="2" />
                    </svg>
                    <span>Doctor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillMock("admin@aethriz.com")}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-[#1D1F22] hover:border-[#E3202B] hover:text-[#E3202B] shadow-2xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <span>Admin</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillMock("nurse@aethriz.com")}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-[#1D1F22] hover:border-[#E3202B] hover:text-[#E3202B] shadow-2xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="4" />
                      <path d="M12 8v8M8 12h8" />
                    </svg>
                    <span>Nurse</span>
                  </button>
                </div>
              </div>

              {/* Tabs: Email vs Mobile OTP */}
              <div className="p-1 rounded-2xl bg-[#F1F5F9] flex items-center mb-6">
                <button
                  type="button"
                  onClick={() => setTab("email")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                    tab === "email"
                      ? "bg-white text-[#1D1F22] shadow-xs"
                      : "text-[#64748B] hover:text-[#1D1F22]"
                  }`}
                >
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setTab("otp")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                    tab === "otp"
                      ? "bg-white text-[#1D1F22] shadow-xs"
                      : "text-[#64748B] hover:text-[#1D1F22]"
                  }`}
                >
                  Mobile OTP
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleLogin} className="space-y-4">
                {tab === "email" ? (
                  <>
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
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-medium text-[#475569]">Password</label>
                        <Link
                          href="#forgot"
                          onClick={(e) => {
                            e.preventDefault();
                            alert("Password reset instructions sent to your email!");
                          }}
                          className="text-xs font-medium text-[#E3202B] hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full px-4 py-3 pr-11 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 text-sm text-[#1D1F22] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#E3202B]/20 focus:border-[#E3202B] transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] transition-colors cursor-pointer"
                        >
                          {showPassword ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-[#475569] mb-1.5">
                        Mobile number
                      </label>
                      <div className="flex rounded-2xl bg-[#F8FAFC] border border-slate-200/90 overflow-hidden focus-within:ring-2 focus-within:ring-[#E3202B]/20 focus-within:border-[#E3202B]">
                        <span className="px-3.5 py-3 text-xs font-medium text-[#64748B] bg-slate-100/70 border-r border-slate-200 flex items-center gap-1.5">
                          <svg className="w-4 h-3 rounded-xs overflow-hidden shadow-2xs flex-shrink-0" viewBox="0 0 30 20">
                            <rect width="30" height="6.66" fill="#FF9933" />
                            <rect y="6.66" width="30" height="6.66" fill="#FFFFFF" />
                            <rect y="13.33" width="30" height="6.67" fill="#138808" />
                            <circle cx="15" cy="10" r="2.2" fill="none" stroke="#000080" strokeWidth="0.6" />
                          </svg>
                          <span>+91</span>
                        </span>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="98765 43210"
                          maxLength={10}
                          className="w-full px-4 py-3 bg-transparent text-sm text-[#1D1F22] placeholder:text-[#94A3B8] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#475569] mb-1.5">
                        Verification code (OTP)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="6-digit OTP"
                          maxLength={6}
                          className="flex-1 px-4 py-3 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 text-sm text-[#1D1F22] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#E3202B]/20 focus:border-[#E3202B]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setOtp("123456");
                            alert("Mock OTP generated: 123456");
                          }}
                          className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-xs font-medium text-[#1D1F22] transition-colors cursor-pointer"
                        >
                          Send OTP
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Keep me signed in */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#E3202B] focus:ring-[#E3202B] border-slate-300 cursor-pointer"
                  />
                  <label htmlFor="remember" className="text-xs text-[#64748B] cursor-pointer">
                    Keep me signed in on this device
                  </label>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium animate-in fade-in">
                    {errorMsg}
                  </div>
                )}

                {/* Success Banner */}
                {successRole && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-medium flex items-center gap-2 animate-in fade-in">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>Signing in as {successRole.toUpperCase()}... Redirecting now.</span>
                  </div>
                )}

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3.5 px-6 rounded-full text-sm font-semibold text-white shadow-[0_12px_24px_rgba(29,31,34,0.18)] hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  style={{
                    background: "linear-gradient(180deg, #32363A 0%, #1D1F22 100%)",
                  }}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    <>
                      <span>Sign in</span>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {/* Or continue with */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative px-3 bg-white text-xs text-[#94A3B8]">
                  or continue with
                </span>
              </div>

              {/* Social Login Buttons: Google & ABHA Health ID */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => fillMock("patient@aethriz.com")}
                  className="py-2.5 px-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 hover:bg-slate-50 text-xs font-semibold text-[#1D1F22] flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.28-2.1 3.645-5.2 3.645-9.15z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.73-2.1-6.66-4.93H1.28v3.13C3.26 21.36 7.33 24 12 24z" />
                    <path fill="#FBBC05" d="M5.34 14.27c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.6H1.28C.46 8.24 0 10.07 0 12s.46 3.76 1.28 5.4l4.06-3.13z" />
                    <path fill="#EA4335" d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.28 6.6l4.06 3.13c.93-2.83 3.56-4.96 6.66-4.96z" />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillMock("patient@aethriz.com")}
                  className="py-2.5 px-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 hover:bg-slate-50 text-xs font-semibold text-[#1D1F22] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span className="w-4 h-4 rounded-full bg-[#E3202B] text-white text-[9px] font-bold flex items-center justify-center">
                    A
                  </span>
                  <span>ABHA Health ID</span>
                </button>
              </div>

              {/* Create account link */}
              <p className="text-center text-xs text-[#64748B]">
                New to AETHRIZ?{" "}
                <Link href="/register" className="font-semibold text-[#E3202B] hover:underline">
                  Create an account
                </Link>
              </p>
            </div>

            {/* Doctor Portal Callout Box */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-[#64748B]">
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-red-50 text-[#E3202B] flex items-center justify-center font-bold text-xs">
                  +
                </span>
                <span>Are you a doctor?</span>
              </span>
              <button
                type="button"
                onClick={() => fillMock("doctor@aethriz.com")}
                className="font-semibold text-[#E3202B] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Open the doctor portal</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          {/* ============ RIGHT COLUMN: VISUAL TELEMETRY CARD ============ */}
          <div
            className="lg:col-span-6 rounded-[36px] p-8 sm:p-12 relative overflow-hidden flex flex-col justify-between min-h-[580px] shadow-[0_24px_60px_rgba(200,100,120,0.12)] border border-white/60"
            style={{
              background:
                "linear-gradient(145deg, #FFF5F5 0%, #F5F0FF 45%, #F0F7FF 100%)",
            }}
          >
            {/* Top Security Badge */}
            <div className="relative z-10 flex items-start justify-between">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-white/80 shadow-xs text-xs font-medium text-[#1D1F22]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                <span className="font-semibold">End-to-end encrypted</span>
                <span className="text-[#94A3B8]">|</span>
                <span className="text-[#64748B]">Your reports stay private</span>
              </div>
            </div>

            {/* Ambient 3D Red Floating Specular Orb */}
            <div
              className="ae-float-b absolute top-12 right-12 w-16 h-16 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, #FF8A90 0%, #E3202B 55%, #7D0A11 100%)",
                boxShadow: "0 18px 36px rgba(227,32,43,0.35), inset 0 2px 4px rgba(255,255,255,0.6)",
              }}
            />

            {/* Ambient 3D Dark Metallic Floating Orb */}
            <div
              className="ae-float-c absolute bottom-36 left-8 w-10 h-10 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, #5E646A 0%, #1D1F22 65%, #0B0C0E 100%)",
                boxShadow: "0 14px 28px rgba(0,0,0,0.25), inset 0 1px 2px rgba(255,255,255,0.4)",
              }}
            />

            {/* Central 3D Biometric Frosted Pearl Sphere & Telemetry Orbit */}
            <div className="relative w-full py-10 flex items-center justify-center">
              {/* Pearl Sphere */}
              <div
                className="relative w-56 h-56 rounded-full flex items-center justify-center shadow-[0_30px_70px_rgba(120,60,90,0.18)]"
                style={{
                  background:
                    "radial-gradient(circle at 35% 30%, #FFFFFF 0%, #F5EFF8 50%, #E8DFEE 100%)",
                }}
              >
                {/* Glowing Biometric Core Anomaly */}
                <div
                  className="w-24 h-24 rounded-full ae-pulse"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(227,32,43,0.55) 0%, rgba(227,32,43,0.18) 55%, transparent 75%)",
                  }}
                />

                {/* Hotspot Target Node */}
                <div className="absolute top-16 right-20 flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-[#E3202B]/20 animate-ping absolute" />
                  <div className="w-3 h-3 rounded-full bg-[#E3202B] border-2 border-white shadow-xs" />
                </div>

                {/* Wave Curves Overlay */}
                <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full pointer-events-none opacity-60">
                  <path d="M 20 100 Q 60 70 100 100 T 180 100" fill="none" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3" />
                  <path d="M 20 120 Q 60 140 100 120 T 180 120" fill="none" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="65" cy="88" r="2.5" fill="#64748B" />
                  <circle cx="140" cy="115" r="2.5" fill="#64748B" />
                </svg>
              </div>

              {/* Floating Diagnostic Card on Sphere */}
              <div className="ae-float absolute right-2 sm:right-6 top-16 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-[0_16px_36px_rgba(29,31,34,0.1)] border border-white/90 w-48 text-xs">
                <div className="flex items-center justify-between text-[#64748B] text-[10.5px] font-medium mb-2.5">
                  <span>Last report</span>
                  <span className="font-mono text-[#1D1F22]">2 days ago</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between font-semibold mb-1">
                      <span className="text-[#1D1F22]">HbA1c</span>
                      <span className="text-[#E3202B] text-[11px]">Borderline</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-[#E3202B] w-[72%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between font-semibold mb-1">
                      <span className="text-[#1D1F22]">Vitamin D</span>
                      <span className="text-amber-600 text-[11px]">Low</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-amber-500 w-[38%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Testimonial Card */}
            <div className="relative z-10 bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/80 shadow-[0_10px_25px_rgba(0,0,0,0.04)]">
              <p className="text-sm font-medium text-[#1D1F22] leading-snug mb-3">
                “Finally, a report I can actually understand — in my own language.”
              </p>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#E2E8F0] text-[#475569] font-bold text-xs flex items-center justify-center">
                  PM
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-[#1D1F22]">Priyadarshini Mishra</span>
                  <span className="text-[#94A3B8]"> · </span>
                  <span className="text-[#64748B]">Cuttack</span>
                </div>
              </div>
            </div>
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
