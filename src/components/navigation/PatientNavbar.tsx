"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getSession, clearSession, UserProfile } from "@/lib/auth";
import { useLanguage } from "@/lib/language";

export type PatientNavTab =
  | "dashboard"
  | "analysis"
  | "doctors"
  | "bookings"
  | "food-scanner"
  | "body-explorer"
  | "stories";

interface Props {
  activeTab?: PatientNavTab;
}

export default function PatientNavbar({ activeTab }: Props) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [language, setLanguage] = useLanguage();

  useEffect(() => {
    const session = getSession();
    if (session) {
      setUser(session);
    } else {
      // Default fallback matching canonical design mockup
      setUser({
        id: "usr-pat-01",
        name: "Priyadarshini Rao",
        email: "patient@aethriz.com",
        role: "patient",
        diet: "Vegetarian",
        goals: ["Blood sugar", "Heart health"],
        language: "English",
      });
    }
  }, []);

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  const cleanName = (user?.name || "Priyadarshini Rao").replace(/^Dr\.?\s+/i, "");
  const initials = cleanName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "PR";

  return (
    <header className="sticky top-3 sm:top-4 z-40 px-3 sm:px-6 w-full relative">
      <nav
        aria-label="Main Navigation"
        className="relative max-w-[1280px] mx-auto p-2 sm:p-2.5 pl-4 sm:pl-5 flex items-center justify-between gap-3 rounded-full border border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-[0_4px_24px_rgba(29,31,34,0.04)]"
      >
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
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

        {/* Center Navigation Pills (7 core patient features) */}
        <div className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-slate-100/80 border border-slate-200/60 text-[13px] font-medium text-[#545B61]">
          <Link
            href="/dashboard"
            className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-white text-[#1D1F22] font-semibold shadow-xs"
                : "hover:text-[#1D1F22] hover:bg-white/50"
            }`}
          >
            AI Health
          </Link>
          <Link
            href="/health-analysis"
            className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              activeTab === "analysis"
                ? "bg-white text-[#1D1F22] font-semibold shadow-xs"
                : "hover:text-[#1D1F22] hover:bg-white/50"
            }`}
          >
            Analysis
          </Link>
          <Link
            href="/doctors"
            className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              activeTab === "doctors"
                ? "bg-white text-[#1D1F22] font-semibold shadow-xs"
                : "hover:text-[#1D1F22] hover:bg-white/50"
            }`}
          >
            Doctors
          </Link>
          <Link
            href="/booking"
            className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              activeTab === "bookings"
                ? "bg-white text-[#1D1F22] font-semibold shadow-xs"
                : "hover:text-[#1D1F22] hover:bg-white/50"
            }`}
          >
            Bookings
          </Link>
          <Link
            href="/food-scanner"
            className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              activeTab === "food-scanner"
                ? "bg-white text-[#1D1F22] font-semibold shadow-xs"
                : "hover:text-[#1D1F22] hover:bg-white/50"
            }`}
          >
            Food Scanner
          </Link>
          <Link
            href="/body-explorer"
            className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              activeTab === "body-explorer"
                ? "bg-white text-[#1D1F22] font-semibold shadow-xs"
                : "hover:text-[#1D1F22] hover:bg-white/50"
            }`}
          >
            Body Explorer
          </Link>
          <Link
            href="/stories"
            className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              activeTab === "stories"
                ? "bg-white text-[#1D1F22] font-semibold shadow-xs"
                : "hover:text-[#1D1F22] hover:bg-white/50"
            }`}
          >
            Articles
          </Link>
        </div>

        {/* Right Action: Language Switcher, User Profile Capsule & Logout */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          {/* Universal Language Switcher Pill */}
          <div className="flex items-center bg-slate-100/90 border border-slate-200/80 p-0.5 rounded-full text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                language === "en"
                  ? "bg-white text-[#1D1F22] shadow-2xs font-bold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage("hi")}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                language === "hi"
                  ? "bg-[#E3202B] text-white shadow-2xs font-bold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* User Profile Pill Capsule */}
          <Link
            href={user?.role === "doctor" ? "/doctor-portal" : "/profile"}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FCECEE] hover:bg-[#F9DFE2] border border-[#F6C6CC] text-xs font-semibold text-[#1D1F22] transition-all cursor-pointer shadow-2xs group"
          >
            <div className="w-6 h-6 rounded-full bg-[#E3202B] text-white flex items-center justify-center font-bold text-[10.5px] transition-transform group-hover:scale-105">
              {initials}
            </div>
            <span className="hidden sm:inline font-medium">
              {user?.role === "doctor" ? "Doctor Portal" : "My profile"}
            </span>
          </Link>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            title="Sign out"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}
