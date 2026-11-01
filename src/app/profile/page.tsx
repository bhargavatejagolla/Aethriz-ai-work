"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getSession, saveSession, clearSession, UserProfile } from "@/lib/auth";

const GOALS_LIST = [
  "Blood sugar",
  "Heart health",
  "Stress & sleep",
  "Better sleep",
  "Strength",
  "Healthy weight",
];

const LANGUAGES_LIST = [
  "English",
  "हिन्दी (Hindi)",
  "বাংলা (Bengali)",
  "తెలుగు (Telugu)",
  "मराठी (Marathi)",
  "தமிழ் (Tamil)",
  "ગુજરાતી (Gujarati)",
  "ಕನ್ನಡ (Kannada)",
  "മലയാളം (Malayalam)",
  "اردو (Urdu)",
  "ਪੰਜਾਬੀ (Punjabi)",
  "ଓଡ଼ିଆ (Odia)",
];

export default function MyProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeConsultTab, setActiveConsultTab] = useState<"upcoming" | "past">("upcoming");

  // Editable Profile Form Fields matching mockup
  const [fullName, setFullName] = useState("Aarav Kapoor");
  const [email, setEmail] = useState("aarav.k@example.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [dob, setDob] = useState("14 Mar 1992");
  const [preferredLang, setPreferredLang] = useState("हिन्दी (Hindi)");
  const [abhaNumber, setAbhaNumber] = useState("91-2048-5928-1049");

  // Health goals multi-select state
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    "Blood sugar",
    "Heart health",
    "Better sleep",
  ]);

  // Privacy toggles
  const [healthAlerts, setHealthAlerts] = useState(true);
  const [shareSummary, setShareSummary] = useState(true);

  // Modals & Feedback
  const [showToast, setShowToast] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => {
      setShowToast(null);
    }, 2800);
  };

  useEffect(() => {
    const sessionUser = getSession();
    if (sessionUser) {
      setUser(sessionUser);
      if (sessionUser.name) setFullName(sessionUser.name);
      if (sessionUser.email) setEmail(sessionUser.email);
      if (sessionUser.phone) setPhone(sessionUser.phone);
      if (sessionUser.goals && sessionUser.goals.length > 0) setSelectedGoals(sessionUser.goals);
    }
  }, []);

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    if (user) {
      const updatedUser: UserProfile = {
        ...user,
        name: fullName,
        email,
        phone,
        goals: selectedGoals,
      };
      saveSession(updatedUser);
      setUser(updatedUser);
    }
    triggerToast("Your profile and clinical preferences have been updated.");
  };

  const handleSignOut = () => {
    clearSession();
    router.push("/login");
  };

  const initials = fullName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "AK";

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-[#1D1F22] font-sans antialiased selection:bg-[#E3202B] selection:text-white pb-20 relative overflow-x-hidden">
      
      {/* ============================================================== */}
      {/* SIGNATURE TOP AMBIENT RED GLOW HALO                            */}
      {/* ============================================================== */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-48 sm:h-56 pointer-events-none z-30 overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 65% 180px at 85% -20px, rgba(227, 32, 43, 0.35) 0%, rgba(254, 205, 211, 0.20) 42%, transparent 75%), " +
            "radial-gradient(ellipse 65% 180px at 15% -20px, rgba(244, 63, 94, 0.28) 0%, rgba(254, 205, 211, 0.16) 42%, transparent 75%), " +
            "radial-gradient(ellipse 80% 150px at 50% -20px, rgba(251, 113, 133, 0.22) 0%, rgba(254, 226, 226, 0.12) 48%, transparent 78%)",
          filter: "blur(20px)",
        }}
      />

      {/* ============ TOP FLOATING NAVBAR ============ */}
      <header className="sticky top-4 z-40 px-4 sm:px-6">
        <nav
          aria-label="Main Navigation"
          className="relative max-w-[1240px] mx-auto p-2 pl-4 sm:pl-5 flex items-center justify-between gap-3 rounded-full border border-white/80 shadow-[0_20px_50px_rgba(120,60,90,0.12),0_2px_8px_rgba(29,31,34,0.04),inset_0_1.5px_0_rgba(255,255,255,0.95)]"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.78) 50%, rgba(255,255,255,0.92) 100%)",
            backdropFilter: "blur(28px) saturate(200%)",
            WebkitBackdropFilter: "blur(28px) saturate(200%)",
          }}
        >
          {/* Brand Logo & Name */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
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
              className="font-semibold text-[15.5px] tracking-[0.14em] text-[#1D1F22]"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              AETHRIZ
            </span>
          </Link>

          {/* Center Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 text-[13px] font-medium text-[#545B61]">
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
              className="px-3.5 py-1.5 rounded-full hover:text-[#1D1F22] hover:bg-white/50 transition-all"
            >
              Doctors
            </Link>
            <Link
              href="/dashboard"
              className="px-3.5 py-1.5 rounded-full hover:text-[#1D1F22] hover:bg-white/50 transition-all"
            >
              Articles
            </Link>
          </div>

          {/* Right Action: Active User Profile Capsule */}
          <div className="flex items-center gap-2">
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E3202B] text-white text-xs font-semibold shadow-[0_8px_20px_rgba(227,32,43,0.25)] transition-all"
            >
              <div className="w-5 h-5 rounded-full bg-[#B91C1C] text-white flex items-center justify-center text-[10px] font-bold">
                {initials}
              </div>
              <span>My profile</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* ============ MAIN PROFILE CONTAINER ============ */}
      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        
        {/* ============ SUBHEADER: BREADCRUMBS & TITLE ============ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
              <span>Home / Account / My profile</span>
              <span className="text-slate-300">·</span>
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Encrypted · ABHA linked
              </span>
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-[44px] font-semibold tracking-tight text-[#1D1F22] mt-1"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              My health{" "}
              <span className="italic text-[#E3202B] font-serif font-normal">
                profile.
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              Manage your details, preferences, consultations and privacy.
            </p>
          </div>

          {/* Right Top Header Actions: Profile Gauge & Edit Button */}
          <div className="flex items-center gap-3">
            {/* Circular Progress Gauge: 85% */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-2xs">
              <div className="relative w-7 h-7 flex items-center justify-center">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#F1F5F9"
                    strokeWidth="3.2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E3202B"
                    strokeWidth="3.2"
                    strokeDasharray="85, 100"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="text-left">
                <span className="text-[9px] font-mono uppercase text-[#94A3B8] font-bold block leading-none">
                  PROFILE COMPLETE
                </span>
                <span className="text-xs font-bold text-[#1D1F22]">85%</span>
              </div>
            </div>

            {/* Edit / Save Profile Button */}
            {isEditing ? (
              <button
                type="button"
                onClick={handleSaveProfile}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#E3202B] text-white shadow-xs hover:bg-[#c91822] transition-all cursor-pointer"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Save changes</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-white hover:bg-slate-50 text-[#1D1F22] border border-slate-200/80 shadow-2xs transition-all cursor-pointer"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                <span>Edit profile</span>
              </button>
            )}
          </div>
        </div>

        {/* ============ TOP PATIENT HERO CARD ============ */}
        <div className="bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-7 border border-slate-200/80 shadow-[0_12px_36px_rgba(29,31,34,0.04)] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Left: Avatar, Name, Badges & Meta Details */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative flex-shrink-0">
              <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-rose-50 border-2 border-rose-200/80 text-[#E3202B] text-xl sm:text-2xl font-bold flex items-center justify-center shadow-xs">
                {initials}
              </div>
              <span className="w-3.5 h-3.5 rounded-full bg-[#E3202B] border-2 border-white absolute bottom-0.5 right-0.5 shadow-2xs" />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-[#1D1F22]">
                  {fullName}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-[#475569] border border-slate-200/60">
                  Patient account
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-[#475569] border border-slate-200/60">
                  Sample profile
                </span>
              </div>

              {/* Contact & Demographics Line */}
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap text-xs text-[#64748B]">
                <span className="flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span>{email}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>{phone}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>{dob} (34)</span>
                </span>
              </div>

              <p className="text-[11px] text-[#94A3B8] flex items-center gap-1.5">
                <span>Member since March 2026</span>
                <span>·</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Records synced
                </span>
              </p>
            </div>
          </div>

          {/* Right: 3 Metric Telemetry Blocks */}
          <div className="flex items-center gap-6 sm:gap-8 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 flex-wrap">
            
            {/* Stat 1: Consultations */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#94A3B8] font-bold block">
                CONSULTATIONS
              </span>
              <span className="text-sm sm:text-base font-bold text-[#1D1F22] mt-0.5 flex items-center gap-1">
                2 recorded <span className="text-emerald-600">✓</span>
              </span>
            </div>

            {/* Stat 2: Wearable Sync */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#94A3B8] font-bold block">
                WEARABLE SYNC
              </span>
              <span className="text-sm sm:text-base font-bold text-emerald-600 mt-0.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live
              </span>
            </div>

            {/* Stat 3: Your Data */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#94A3B8] font-bold block">
                YOUR DATA
              </span>
              <span className="text-sm sm:text-base font-bold text-[#E3202B] mt-0.5 block">
                Never sold
              </span>
            </div>
          </div>
        </div>

        {/* ============ MAIN 2-COLUMN GRID ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ============ LEFT COLUMN: PERSONAL INFO & HEALTH GOALS (7 COLS) ============ */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* CARD 1: PERSONAL INFORMATION */}
            <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-slate-200/80 shadow-[0_12px_36px_rgba(29,31,34,0.04)] space-y-5">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-rose-50 text-[#E3202B] flex items-center justify-center">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="8" y1="6" x2="21" y2="6" />
                      <line x1="8" y1="12" x2="21" y2="12" />
                      <line x1="8" y1="18" x2="21" y2="18" />
                      <line x1="3" y1="6" x2="3.01" y2="6" />
                      <line x1="3" y1="12" x2="3.01" y2="12" />
                      <line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-[#1D1F22]">
                    Personal information
                  </h3>
                </div>

                <span className="text-[11px] font-medium text-[#64748B]">
                  {isEditing ? "Editing" : "Viewing"}
                </span>
              </div>

              {/* 6 Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Full name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#64748B]">
                    Full name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#1D1F22] focus:bg-white focus:outline-hidden focus:border-[#E3202B]"
                    />
                  ) : (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-[#1D1F22]">
                      {fullName}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#64748B]">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#1D1F22] focus:bg-white focus:outline-hidden focus:border-[#E3202B]"
                    />
                  ) : (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-[#1D1F22] truncate">
                      {email}
                    </div>
                  )}
                </div>

                {/* Mobile (SMS alerts) */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#64748B]">
                    Mobile (SMS alerts)
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#1D1F22] focus:bg-white focus:outline-hidden focus:border-[#E3202B]"
                    />
                  ) : (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-[#1D1F22]">
                      {phone}
                    </div>
                  )}
                </div>

                {/* Date of birth */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#64748B]">
                    Date of birth
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#1D1F22] focus:bg-white focus:outline-hidden focus:border-[#E3202B]"
                    />
                  ) : (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-[#1D1F22]">
                      {dob}
                    </div>
                  )}
                </div>

                {/* Preferred language */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#64748B]">
                    Preferred language
                  </label>
                  {isEditing ? (
                    <select
                      value={preferredLang}
                      onChange={(e) => setPreferredLang(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#1D1F22] focus:bg-white focus:outline-hidden focus:border-[#E3202B]"
                    >
                      {LANGUAGES_LIST.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-[#1D1F22]">
                      {preferredLang}
                    </div>
                  )}
                </div>

                {/* ABHA number */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#64748B]">
                    ABHA number
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={abhaNumber}
                      onChange={(e) => setAbhaNumber(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#1D1F22] focus:bg-white focus:outline-hidden focus:border-[#E3202B]"
                    />
                  ) : (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-mono font-semibold text-[#475569] flex items-center justify-between">
                      <span>{abhaNumber}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                        LINKED
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Encrypted Save Indicator */}
              <div className="pt-2 text-[11px] text-emerald-600 font-medium flex items-center gap-1.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Changes are saved to your encrypted record</span>
              </div>
            </div>

            {/* CARD 2: HEALTH & LIFESTYLE PREFERENCES */}
            <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-slate-200/80 shadow-[0_12px_36px_rgba(29,31,34,0.04)] space-y-5">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-rose-50 text-[#E3202B] flex items-center justify-center">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1D1F22]">
                      Health & lifestyle preferences
                    </h3>
                    <p className="text-[11px] text-[#64748B]">
                      These tune your AI recommendations
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  Personalisation on
                </span>
              </div>

              {/* Health Goals Multi-Select Pills */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1D1F22] block">
                  Health goals
                </label>
                <div className="flex flex-wrap gap-2">
                  {GOALS_LIST.map((goal) => {
                    const isSelected = selectedGoals.includes(goal);
                    return (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => toggleGoal(goal)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-rose-50 border border-red-300 text-[#E3202B] font-semibold shadow-2xs"
                            : "bg-white hover:bg-slate-100 text-[#64748B] border border-slate-200/80"
                        }`}
                      >
                        {isSelected ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <circle cx="12" cy="12" r="4" fill="currentColor" />
                          </svg>
                        ) : (
                          <span>+</span>
                        )}
                        <span>{goal}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4 Telemetry Tiles Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                
                {/* Tile 1: Activity */}
                <div className="p-3.5 rounded-2xl bg-[#FCFDFE] border border-slate-200/70 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#94A3B8] font-bold">
                    <span>ACTIVITY</span>
                    <span>↗</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#1D1F22]">
                    Light · 2-3 walks a week
                  </h4>
                  <p className="text-[11px] text-[#64748B]">
                    Goal: 150 min/week
                  </p>
                </div>

                {/* Tile 2: Diet */}
                <div className="p-3.5 rounded-2xl bg-[#FCFDFE] border border-slate-200/70 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#94A3B8] font-bold">
                    <span>DIET</span>
                    <span>☾</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#1D1F22]">
                    Vegetarian · low-GI
                  </h4>
                  <p className="text-[11px] text-[#64748B]">
                    No onion-garlic on Tuesdays
                  </p>
                </div>

                {/* Tile 3: Sleep Target */}
                <div className="p-3.5 rounded-2xl bg-[#FCFDFE] border border-slate-200/70 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#94A3B8] font-bold">
                    <span>SLEEP TARGET</span>
                    <span>☾</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#1D1F22]">
                    7–8 hours a night
                  </h4>
                  <p className="text-[11px] text-[#64748B]">
                    This week: 7 h 10 m average
                  </p>
                </div>

                {/* Tile 4: Consult Format */}
                <div className="p-3.5 rounded-2xl bg-[#FCFDFE] border border-slate-200/70 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#94A3B8] font-bold">
                    <span>CONSULT FORMAT</span>
                    <span>▶</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#1D1F22]">
                    Video (preferred)
                  </h4>
                  <p className="text-[11px] text-[#64748B]">
                    Evenings after 6 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ============ RIGHT COLUMN: CONSULTATIONS & SECURITY (5 COLS) ============ */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* CARD 3: CONSULTATIONS */}
            <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-slate-200/80 shadow-[0_12px_36px_rgba(29,31,34,0.04)] space-y-4">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-rose-50 text-[#E3202B] flex items-center justify-center">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-[#1D1F22]">
                    Consultations
                  </h3>
                </div>

                <Link
                  href="/doctors"
                  className="text-xs font-semibold text-[#E3202B] hover:underline"
                >
                  Find a doctor →
                </Link>
              </div>

              {/* Consultation Switcher Tabs */}
              <div className="flex items-center bg-slate-100 p-1 rounded-full text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveConsultTab("upcoming")}
                  className={`flex-1 py-1.5 rounded-full transition-all cursor-pointer ${
                    activeConsultTab === "upcoming"
                      ? "bg-white text-[#1D1F22] shadow-2xs"
                      : "text-[#64748B] hover:text-[#1D1F22]"
                  }`}
                >
                  Upcoming (1)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveConsultTab("past")}
                  className={`flex-1 py-1.5 rounded-full transition-all cursor-pointer ${
                    activeConsultTab === "past"
                      ? "bg-white text-[#1D1F22] shadow-2xs"
                      : "text-[#64748B] hover:text-[#1D1F22]"
                  }`}
                >
                  Past (1)
                </button>
              </div>

              {/* Consultation Card Content */}
              {activeConsultTab === "upcoming" ? (
                <div className="p-4 rounded-2xl bg-rose-50/30 border border-rose-100 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-rose-100 text-[#E3202B] font-bold text-xs flex items-center justify-center flex-shrink-0">
                        AR
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#1D1F22]">
                          Dr. Ananya Rao
                        </h4>
                        <p className="text-[11px] text-[#64748B]">
                          Endocrinology
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                      • Confirmed
                    </span>
                  </div>

                  {/* Schedule Details Line */}
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#E3202B]">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>Today, 30 Oct · 6:30 PM · Video consult</span>
                  </div>

                  {/* Bottom details and link */}
                  <div className="pt-2 border-t border-rose-100/80 flex items-center justify-between text-xs">
                    <span className="text-[#64748B] text-[11px]">
                      Booking #AE-30418 · summary shared
                    </span>
                    <Link
                      href="/booking"
                      className="text-[11px] font-semibold text-[#1D1F22] hover:text-[#E3202B] flex items-center gap-0.5"
                    >
                      <span>View details</span>
                      <span>↗</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#1D1F22]">
                        Dr. Vikram Menon
                      </h4>
                      <p className="text-[11px] text-[#64748B]">
                        Cardiology · Completed
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      14 Oct 2026
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B]">
                    Lipid review & ECG telemetry interpretation. Routine follow-up scheduled.
                  </p>
                </div>
              )}
            </div>

            {/* CARD 4: SECURITY & PRIVACY */}
            <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-slate-200/80 shadow-[0_12px_36px_rgba(29,31,34,0.04)] space-y-4">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-rose-50 text-[#E3202B] flex items-center justify-center">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-[#1D1F22]">
                    Security & privacy
                  </h3>
                </div>

                <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Protected
                </span>
              </div>

              {/* Setting 1: Password & 2FA */}
              <div
                onClick={() => triggerToast("Password & 2FA security settings are currently locked to your registered device.")}
                className="p-3 rounded-2xl bg-slate-50/70 hover:bg-slate-100/70 border border-slate-100 flex items-center justify-between cursor-pointer transition-all"
              >
                <div>
                  <h4 className="text-xs font-bold text-[#1D1F22]">
                    Password & 2-step verification
                  </h4>
                  <p className="text-[11px] text-[#64748B]">
                    Changed 45 days ago · 2FA on
                  </p>
                </div>
                <span className="text-slate-400 text-sm">›</span>
              </div>

              {/* Setting 2: Health Alerts Toggle */}
              <div className="p-3 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center justify-between">
                <div className="max-w-[75%]">
                  <h4 className="text-xs font-bold text-[#1D1F22]">
                    Health alerts
                  </h4>
                  <p className="text-[11px] text-[#64748B] leading-tight">
                    Push & SMS when a reading needs attention
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setHealthAlerts(!healthAlerts);
                    triggerToast(`Health alerts ${!healthAlerts ? "enabled" : "disabled"}.`);
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    healthAlerts ? "bg-[#E3202B]" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      healthAlerts ? "right-1" : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Setting 3: Share Summary with Doctors Toggle */}
              <div className="p-3 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center justify-between">
                <div className="max-w-[75%]">
                  <h4 className="text-xs font-bold text-[#1D1F22]">
                    Share summary with my doctors
                  </h4>
                  <p className="text-[11px] text-[#64748B] leading-tight">
                    Only doctors you book can see it
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShareSummary(!shareSummary);
                    triggerToast(`Doctor clinical sharing ${!shareSummary ? "authorized" : "revoked"}.`);
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    shareSummary ? "bg-[#E3202B]" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      shareSummary ? "right-1" : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Bottom Actions: Sign out & Delete account */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-[#1D1F22] flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                  </svg>
                  <span>Sign out</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="text-xs font-semibold text-[#E3202B] hover:underline cursor-pointer"
                >
                  Delete account
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ============ FOOTER COMPLIANCE NOTICE ============ */}
        <div className="pt-6 border-t border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#94A3B8]">
          <p className="text-center sm:text-left leading-relaxed">
            Your health data is encrypted, stays under your control and is never sold. Handled in line with India&apos;s Digital Personal Data Protection Act.
          </p>
          <div className="flex items-center gap-4 flex-shrink-0 font-medium">
            <Link href="/" className="hover:text-[#1D1F22] transition-colors">
              Privacy policy
            </Link>
            <button
              type="button"
              onClick={() => triggerToast("Encrypted health telemetry export package prepared.")}
              className="hover:text-[#1D1F22] transition-colors cursor-pointer"
            >
              Data export
            </button>
          </div>
        </div>
      </main>

      {/* ============ DELETE ACCOUNT CONFIRMATION MODAL ============ */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-[#E3202B] mx-auto flex items-center justify-center font-bold">
              !
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#1D1F22]">Delete your account?</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                This will permanently purge your linked ABHA records, 3D anatomical scans, and clinical histories from the AETHRIZ servers.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  handleSignOut();
                }}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-[#E3202B] text-white hover:bg-[#c91822]"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1D1F22] text-white px-4 py-2.5 rounded-full shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{showToast}</span>
        </div>
      )}
    </div>
  );
}
