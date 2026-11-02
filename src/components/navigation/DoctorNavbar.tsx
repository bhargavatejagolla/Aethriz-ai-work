"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { clearSession } from "@/lib/auth";

export type DoctorNavTab = "dashboard" | "patients" | "appointments" | "nexus" | "join";

interface Props {
  activeTab: DoctorNavTab;
}

export default function DoctorNavbar({ activeTab }: Props) {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  return (
    <header className="sticky top-3 sm:top-4 z-40 px-3 sm:px-6 w-full relative">
      <nav
        aria-label="Doctor Portal Navigation"
        className="relative max-w-[1280px] mx-auto p-2 sm:p-2.5 pl-4 sm:pl-5 flex items-center justify-between gap-3 sm:gap-4 rounded-full border border-slate-200/80 bg-white shadow-[0_4px_24px_rgba(29,31,34,0.04)]"
      >
        {/* Left: Brand Logo & Doctor Portal Tag */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
          <Link href="/doctor-portal" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-[9px] overflow-hidden shadow-xs flex-shrink-0 transition-transform group-hover:scale-105">
              <Image
                src="/brand/aethriz-hero-logo.png"
                alt="AETHRIZ"
                width={32}
                height={32}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <span
              className="font-bold text-[16px] tracking-[0.14em] text-[#1D1F22]"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              AETHRIZ
            </span>
          </Link>

          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md bg-[#1D1F22] text-[10px] font-bold text-white tracking-[0.12em] font-mono">
            DOCTOR PORTAL
          </span>
        </div>

        {/* Center Navigation Links */}
        <div className="hidden lg:flex items-center gap-1 text-[13px] font-medium text-[#545B61]">
          <Link
            href="/doctor-portal"
            className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-white border border-slate-200/90 text-[#1D1F22] font-semibold shadow-2xs"
                : "hover:text-[#1D1F22] hover:bg-slate-50"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/doctor/patients"
            className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              activeTab === "patients"
                ? "bg-white border border-slate-200/90 text-[#1D1F22] font-semibold shadow-2xs"
                : "hover:text-[#1D1F22] hover:bg-slate-50"
            }`}
          >
            Patients
          </Link>
          <Link
            href="/doctor/appointments"
            className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              activeTab === "appointments"
                ? "bg-white border border-slate-200/90 text-[#1D1F22] font-semibold shadow-2xs"
                : "hover:text-[#1D1F22] hover:bg-slate-50"
            }`}
          >
            Appointments
          </Link>
          <Link
            href="/doctor/nexus"
            className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              activeTab === "nexus"
                ? "bg-white border border-slate-200/90 text-[#1D1F22] font-semibold shadow-2xs"
                : "hover:text-[#1D1F22] hover:bg-slate-50"
            }`}
          >
            AI Analysis
          </Link>
          <Link
            href="/doctor/join"
            className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              activeTab === "join"
                ? "bg-white border border-slate-200/90 text-[#1D1F22] font-semibold shadow-2xs"
                : "hover:text-[#1D1F22] hover:bg-slate-50"
            }`}
          >
            Join the team
          </Link>
        </div>

        {/* Right Action: Status Pill, Notifications & Doctor Profile with Logout */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Green Status Pill */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">Available</span>
          </span>

          {/* Notification Bell with red dot */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
              className="relative p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E3202B] animate-pulse" />
            </button>

            {/* Dropdown Notification Menu */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-2xl p-3 z-50 animate-fade-in text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-bold text-[#1D1F22]">
                  <span>Clinical Alerts</span>
                  <span className="text-[10px] text-[#E3202B]">2 Urgent</span>
                </div>
                <div className="py-2 space-y-2">
                  <div className="p-2 rounded-xl bg-rose-50/60 border border-rose-100">
                    <strong className="block text-[#1D1F22]">Aarav Kapoor</strong>
                    <p className="text-[11px] text-[#475569]">Waiting in teleconsult room (HbA1c 6.1%)</p>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-50/60 border border-amber-100">
                    <strong className="block text-[#1D1F22]">Rohit Verma</strong>
                    <p className="text-[11px] text-[#475569]">Post-lunch BP 142/91 flagged</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Doctor Profile Pill: AR Dr. Ananya Rao · Endocrinologist */}
          <Link
            href="/doctor/profile"
            className="flex items-center gap-2 pl-2 border-l border-slate-200 group cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-[#E3202B] text-white flex items-center justify-center font-bold text-xs shadow-xs transition-transform group-hover:scale-105">
              AR
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold leading-tight text-[#1D1F22] group-hover:text-[#E3202B] transition-colors">
                Dr. Ananya Rao
              </span>
              <span className="text-[10px] text-[#64748B] leading-none mt-0.5">
                Endocrinologist
              </span>
            </div>
          </Link>

          {/* Logout Arrow */}
          <button
            type="button"
            onClick={handleLogout}
            title="Sign out of doctor portal"
            className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
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
