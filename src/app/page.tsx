"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

const Hero3DAtlas = dynamic(() => import("@/components/anatomy/Hero3DAtlas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-xs text-[#545B61]">
      <div className="w-8 h-8 rounded-full border-2 border-[#E3202B]/30 border-t-[#E3202B] animate-spin" />
      <span>Loading 3D Anatomy Atlas...</span>
    </div>
  ),
});

export default function LandingPage() {
  const [reveal, setReveal] = useState<number>(50);
  const [activeStep, setActiveStep] = useState<number>(4);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"scan" | "3d">("scan");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    language: "English",
    message: "",
    updates: true,
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="bg-[#F1F5F9] text-[#1D1F22] font-sans text-base leading-normal antialiased overflow-x-hidden selection:bg-[#E3202B] selection:text-white min-h-screen">
      {/* ============ STICKY GLASS NAVBAR ============ */}
      <header className="sticky top-4 z-40 px-4">
        <nav
          aria-label="Main"
          className="relative max-w-[1180px] mx-auto p-2.5 pl-4 sm:pl-5 flex items-center justify-between gap-4 flex-wrap rounded-full border border-white/70 shadow-[0_24px_60px_rgba(120,60,90,0.16),0_2px_8px_rgba(29,31,34,0.06),inset_0_1.5px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(255,255,255,0.35),inset_0_0_0_1px_rgba(255,255,255,0.18)]"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.48) 100%)",
            backdropFilter: "blur(30px) saturate(220%) brightness(1.05)",
            WebkitBackdropFilter: "blur(30px) saturate(220%) brightness(1.05)",
          }}
        >
          {/* Top highlight line */}
          <span
            aria-hidden="true"
            className="absolute left-9 right-9 top-0 h-[1px] pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0), #FFFFFF, rgba(255,255,255,0))",
            }}
          />

          {/* Brand Logo & Name */}
          <Link href="#top" className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-[11px] overflow-hidden shadow-sm flex-shrink-0">
              <Image
                src="/brand/aethriz-hero-logo.png"
                alt="AETHRIZ logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <span className="flex flex-col leading-none">
              <span
                className="font-semibold text-lg tracking-[0.14em] text-[#1D1F22]"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                AETHRIZ
              </span>
              <span
                className="text-[9.5px] tracking-[0.22em] text-[#C8161F] mt-[3px] font-mono"
              >
                BIO-HEALTH AI
              </span>
            </span>
          </Link>

          {/* Desktop Navigation with Mega Menus */}
          <div className="ae-nav items-center gap-1 text-[15px] hidden md:flex">
            {/* Platform Dropdown */}
            <div className="ae-dd relative">
              <button
                type="button"
                className="ae-ddbtn"
                aria-haspopup="true"
              >
                Platform
                <svg
                  aria-hidden="true"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <div
                className="ae-menu"
                style={{
                  width: "500px",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                }}
              >
                <Link href="#services">
                  <span className="ae-mi">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 12h4l3-8 4 16 3-8h4" />
                    </svg>
                  </span>
                  <span>
                    <span className="ae-mt">AI Health</span>
                    <span className="ae-md">
                      Personal insights from your health data
                    </span>
                  </span>
                </Link>
                <Link href="#how">
                  <span className="ae-mi">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M7 12h10" />
                    </svg>
                  </span>
                  <span>
                    <span className="ae-mt">Food Scanner</span>
                    <span className="ae-md">
                      Scan a meal, see what it means for you
                    </span>
                  </span>
                </Link>
                <Link href="#how">
                  <span className="ae-mi">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="4.5" r="2.5" />
                      <path d="M12 7v7M8 9.5l4 1.5 4-1.5M9.5 21l2.5-7 2.5 7" />
                    </svg>
                  </span>
                  <span>
                    <span className="ae-mt">3D Anatomy</span>
                    <span className="ae-md">
                      Explore your health, organ by organ
                    </span>
                  </span>
                </Link>
                <Link href="#how">
                  <span className="ae-mi">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </span>
                  <span>
                    <span className="ae-mt">How it works</span>
                    <span className="ae-md">Five steps from report to daily habit</span>
                  </span>
                </Link>
              </div>
            </div>

            {/* Care Dropdown */}
            <div className="ae-dd relative">
              <button
                type="button"
                className="ae-ddbtn"
                aria-haspopup="true"
              >
                Care
                <svg
                  aria-hidden="true"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <div
                className="ae-menu"
                style={{
                  width: "280px",
                  gridTemplateColumns: "1fr",
                }}
              >
                <Link href="#community">
                  <span className="ae-mi">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </span>
                  <span>
                    <span className="ae-mt">Doctors</span>
                    <span className="ae-md">
                      Specialists trained on your reports
                    </span>
                  </span>
                </Link>
                <Link href="#languages">
                  <span className="ae-mi">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  </span>
                  <span>
                    <span className="ae-mt">22+ Languages</span>
                    <span className="ae-md">
                      Care in your mother tongue
                    </span>
                  </span>
                </Link>
              </div>
            </div>

            {/* Company Dropdown */}
            <div className="ae-dd relative">
              <button
                type="button"
                className="ae-ddbtn"
                aria-haspopup="true"
              >
                Company
                <svg
                  aria-hidden="true"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <div
                className="ae-menu"
                style={{
                  width: "280px",
                  gridTemplateColumns: "1fr",
                }}
              >
                <Link href="#mission">
                  <span className="ae-mi">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4M12 8h.01" />
                    </svg>
                  </span>
                  <span>
                    <span className="ae-mt">Mission</span>
                    <span className="ae-md">Preventive health for 1.4 billion people</span>
                  </span>
                </Link>
                <Link href="#contact">
                  <span className="ae-mi">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                  <span>
                    <span className="ae-mt">Contact</span>
                    <span className="ae-md">Reach our clinical team</span>
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            <Link
              href="#contact"
              className="ae-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-[#1D1F22] border border-black/10 shadow-[inset_0_1px_0_#FFF,0_2px_4px_rgba(29,31,34,0.04)] hover:bg-black/5 transition-all"
            >
              <svg
                aria-hidden="true"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="5" width="18" height="14" rx="3" />
                <path d="M3.5 7l8.5 6 8.5-6" />
              </svg>
              <span>Contact</span>
            </Link>

            <Link
              href="#register"
              className="ae-btn-dark inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium text-white shadow-[0_8px_20px_rgba(14,15,17,0.25),inset_0_1px_0_rgba(255,255,255,0.2)]"
              style={{
                background: "linear-gradient(180deg, #32363A 0%, #1D1F22 100%)",
              }}
            >
              <span>Sign in</span>
              <svg
                aria-hidden="true"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 17L17 7M8 7h9v9" />
              </svg>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/70 text-[#1D1F22] border border-slate-200/60 shadow-xs"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 max-w-[1180px] mx-auto p-4 rounded-3xl bg-white/95 backdrop-blur-xl border border-white/80 shadow-2xl flex flex-col gap-2 text-sm animate-in fade-in duration-200">
            <Link
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-slate-50/80 rounded-2xl font-medium text-[#1D1F22] flex items-center justify-between"
            >
              <span>Platform</span>
              <span className="text-xs text-[#C8161F] font-mono">BIO-AI</span>
            </Link>
            <Link
              href="#how"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-slate-50/80 rounded-2xl font-medium text-[#1D1F22]"
            >
              How it works
            </Link>
            <Link
              href="#mission"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-slate-50/80 rounded-2xl font-medium text-[#1D1F22]"
            >
              Mission
            </Link>
            <Link
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-slate-50/80 rounded-2xl font-medium text-[#1D1F22]"
            >
              FAQ
            </Link>
            <Link
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-slate-50/80 rounded-2xl font-medium text-[#1D1F22] flex items-center justify-between"
            >
              <span>Contact</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="5" width="18" height="14" rx="3" />
                <path d="M3.5 7l8.5 6 8.5-6" />
              </svg>
            </Link>
          </div>
        )}
      </header>

      {/* ============ HERO SECTION ============ */}
      <section
        id="top"
        className="relative max-w-[1240px] mx-auto px-6 pt-6 sm:pt-10 pb-12 sm:pb-20 flex flex-wrap items-center gap-8"
      >
        {/* Left Column: Headline & Value Proposition */}
        <div className="flex-[1.25_1_520px] min-w-0 relative z-10">
          <div className="ae-in inline-flex items-center gap-2.5 py-1.5 px-3.5 rounded-full bg-white shadow-xs text-[13px] text-[#545B61]">
            <span className="ae-pulse w-2 h-2 rounded-full bg-[#E3202B]" />
            AI Health Intelligence — Active
          </div>

          <p
            className="ae-in mt-7 mb-2.5 text-sm font-semibold tracking-wider text-[#545B61]"
            style={{ animationDelay: ".08s" }}
          >
            AETHRIZ®
          </p>

          <h1
            className="ae-in m-0 font-light text-[clamp(40px,5.3vw,78px)] leading-[1] tracking-[-0.04em] text-[#1D1F22]"
            style={{ fontFamily: "'Inter Tight', sans-serif", animationDelay: ".14s" }}
          >
            Intelligent health,
            <br />
            personalized.
          </h1>

          <p
            className="ae-in mt-7 max-w-[500px] text-lg leading-relaxed text-[#545B61]"
            style={{ animationDelay: ".22s" }}
          >
            AETHRIZ turns your health data into personalized diet and lifestyle
            guidance — so you can make smarter daily choices, whatever your age,
            diet, language or location.
          </p>

          <div
            className="ae-in mt-10 flex flex-wrap gap-3"
            style={{ animationDelay: ".3s" }}
          >
            <Link
              href="#register"
              className="ae-btn inline-flex items-center gap-2.5 min-h-[52px] px-8 rounded-full text-[#1D1F22] text-base font-medium shadow-[inset_0_0_0_1px_rgba(255,255,255,0.7),0_10px_28px_rgba(227,32,43,0.16)]"
              style={{
                background:
                  "linear-gradient(100deg, #FFD3CF 0%, #F7E0EA 55%, #E9E4F5 100%)",
              }}
            >
              Pre-register now
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>

            <Link
              href="#services"
              className="ae-btn inline-flex items-center gap-2.5 min-h-[52px] pl-2.5 pr-6 rounded-full bg-white text-[#1D1F22] text-base shadow-xs"
            >
              <span className="w-[34px] h-[34px] rounded-full bg-[#1D1F22] text-white flex items-center justify-center">
                <svg
                  aria-hidden="true"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M7 4.5v15l13-7.5z" />
                </svg>
              </span>
              See how it works
            </Link>
          </div>

          <div
            className="ae-in mt-12 flex flex-wrap gap-7 text-[13px] text-[#545B61]"
            style={{ animationDelay: ".38s" }}
          >
            <span className="inline-flex items-center gap-2">
              <svg
                aria-hidden="true"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C8161F"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              Privacy-first by design
            </span>
            <span className="inline-flex items-center gap-2">
              <svg
                aria-hidden="true"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C8161F"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" />
              </svg>
              22+ Indian languages
            </span>
          </div>
        </div>

        {/* Ambient Aurora Glow */}
        <div
          aria-hidden="true"
          className="absolute left-0 right-0 -top-36 h-[300px] pointer-events-none filter blur-[46px]"
        >
          <div
            className="ae-float-c absolute -left-10 top-10 w-[380px] h-[220px] rounded-full bg-[rgba(255,150,150,0.32)]"
          />
          <div
            className="ae-float-b absolute left-[360px] top-5 w-[440px] h-[220px] rounded-full bg-[rgba(200,190,250,0.45)]"
          />
          <div
            className="ae-float-c absolute -right-7 top-12 w-[360px] h-[210px] rounded-full bg-[rgba(255,120,130,0.28)]"
            style={{ animationDelay: "-3s" }}
          />
        </div>

        {/* Right Column: Hero 3D Anatomy Visual */}
        <div
          aria-hidden="true"
          className="flex-1 basis-[460px] min-w-0 relative h-[620px] flex items-center justify-center [perspective:1200px]"
        >
          {/* Interactive View Switcher: Biometric Scan vs 3D WebGL Atlas from ashemag-human-atlas */}
          <div className="absolute top-0 right-2 z-30 flex items-center p-1 rounded-full bg-white/80 backdrop-blur-md border border-white/90 shadow-sm text-xs font-medium">
            <button
              type="button"
              onClick={() => setViewMode("scan")}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                viewMode === "scan"
                  ? "bg-[#1D1F22] text-white shadow-xs"
                  : "text-[#545B61] hover:text-[#1D1F22]"
              }`}
            >
              Biometric Scan
            </button>
            <button
              type="button"
              onClick={() => setViewMode("3d")}
              className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "3d"
                  ? "bg-[#1D1F22] text-white shadow-xs"
                  : "text-[#545B61] hover:text-[#1D1F22]"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#E3202B] ae-pulse" />
              <span>Interactive 3D Atlas</span>
            </button>
          </div>

          {/* Radial Ambient Backing */}
          <div
            className="ae-glow absolute w-[560px] h-[560px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 45%, rgba(255,196,190,0.7) 0%, rgba(233,228,245,0.5) 40%, rgba(241,245,249,0) 70%)",
            }}
          />
          <div
            className="ae-ring absolute w-[540px] h-[540px] rounded-full border border-[rgba(29,31,34,0.10)] shadow-[0_0_0_18px_rgba(255,255,255,0.16)] pointer-events-none"
          />
          <div
            className="ae-ring2 absolute w-[450px] h-[450px] rounded-full border border-dashed border-[rgba(227,32,43,0.30)] pointer-events-none"
          />

          {viewMode === "3d" ? (
            /* Interactive 3D WebGL Three.js Atlas powered by BodyParts3D from ashemag-human-atlas */
            <div className="relative w-full h-[580px] z-10 flex items-center justify-center">
              <Hero3DAtlas />
            </div>
          ) : (
            /* Biometric Scan Mode with True 3D Dual-Layer Encircling Elliptical Scanner Ring */
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Scanner Base Platform */}
              <div className="absolute left-1/2 bottom-3.5 w-[420px] h-[110px] -ml-[210px] pointer-events-none">
                <div
                  className="absolute inset-0 rounded-full shadow-[0_34px_60px_rgba(29,31,34,0.10)]"
                  style={{
                    background:
                      "radial-gradient(ellipse, rgba(255,255,255,0.95) 0%, rgba(255,214,210,0.55) 45%, rgba(255,214,210,0) 72%)",
                  }}
                />
                <div className="absolute left-[16%] right-[16%] top-[16%] bottom-[16%] rounded-full border-[1.5px] border-[rgba(227,32,43,0.5)] bg-white/35" />
                <div className="ae-plat absolute left-[16%] right-[16%] top-[16%] bottom-[16%] rounded-full border-[1.5px] border-[rgba(227,32,43,0.55)]" />
                <div
                  className="ae-plat absolute left-[16%] right-[16%] top-[16%] bottom-[16%] rounded-full border-[1.5px] border-[rgba(227,32,43,0.55)]"
                  style={{ animationDelay: "-1.8s" }}
                />
              </div>

              {/* 3D ELLIPTICAL SCANNING RING - REAR ARC (Passes BEHIND the human body in 3D!) */}
              <div
                className="ae-scanring absolute left-1/2 top-[40px] w-[340px] h-[74px] pointer-events-none z-[6]"
              >
                <svg viewBox="0 0 340 74" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="ae-scan-back-grad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#E3202B" stopOpacity="0.85" />
                      <stop offset="25%" stopColor="#C8161F" stopOpacity="0.6" />
                      <stop offset="50%" stopColor="#A81018" stopOpacity="0.4" />
                      <stop offset="75%" stopColor="#C8161F" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#E3202B" stopOpacity="0.85" />
                    </linearGradient>
                    <filter id="ae-glow-back" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3.5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  {/* Rear ambient laser glow behind body */}
                  <path
                    d="M 12 37 A 158 31 0 0 1 328 37"
                    fill="none"
                    stroke="rgba(227,32,43,0.32)"
                    strokeWidth="8"
                    filter="url(#ae-glow-back)"
                  />
                  {/* Rear laser ring track */}
                  <path
                    d="M 12 37 A 158 31 0 0 1 328 37"
                    fill="none"
                    stroke="url(#ae-scan-back-grad)"
                    strokeWidth="2.8"
                  />
                  {/* Inner rear white laser filament */}
                  <path
                    d="M 16 37 A 154 28 0 0 1 324 37"
                    fill="none"
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth="1.2"
                  />
                </svg>
              </div>

              {/* Photorealistic Muscular Human Anatomy Body (relative z-[10]) */}
              <div className="ae-sway2 relative z-[10] left-1/2 bottom-[62px] w-[238px] h-[516px] -ml-[119px]">
                <svg
                  viewBox="0 0 240 520"
                  width="100%"
                  height="100%"
                  className="overflow-visible"
                >
                  <defs>
                    <linearGradient
                      id="ae-glass"
                      gradientUnits="userSpaceOnUse"
                      x1="30"
                      y1="0"
                      x2="210"
                      y2="0"
                    >
                      <stop offset="0" stopColor="#EEE8F1" />
                      <stop offset="0.3" stopColor="#FFFFFF" />
                      <stop offset="0.52" stopColor="#FDFBFD" />
                      <stop offset="0.8" stopColor="#F0E9F3" />
                      <stop offset="1" stopColor="#E6DEEA" />
                    </linearGradient>
                    <linearGradient
                      id="ae-shade"
                      gradientUnits="userSpaceOnUse"
                      x1="30"
                      y1="0"
                      x2="210"
                      y2="0"
                    >
                      <stop offset="0" stopColor="#8C6E96" stopOpacity="0.28" />
                      <stop offset="0.36" stopColor="#FFFFFF" stopOpacity="0" />
                      <stop offset="0.64" stopColor="#FFFFFF" stopOpacity="0" />
                      <stop offset="1" stopColor="#8C6E96" stopOpacity="0.32" />
                    </linearGradient>

                    {/* Volumetric Muscular Gradients */}
                    <radialGradient id="ae-musc-pectoral-l" cx="45%" cy="38%" r="65%">
                      <stop offset="0%" stopColor="#D96657" stopOpacity="0.9" />
                      <stop offset="55%" stopColor="#B34438" stopOpacity="0.82" />
                      <stop offset="100%" stopColor="#6E2016" stopOpacity="0.92" />
                    </radialGradient>
                    <radialGradient id="ae-musc-pectoral-r" cx="55%" cy="38%" r="65%">
                      <stop offset="0%" stopColor="#D96657" stopOpacity="0.9" />
                      <stop offset="55%" stopColor="#B34438" stopOpacity="0.82" />
                      <stop offset="100%" stopColor="#6E2016" stopOpacity="0.92" />
                    </radialGradient>
                    <radialGradient id="ae-musc-ab-3d" cx="45%" cy="35%" r="65%">
                      <stop offset="0%" stopColor="#CF5E50" stopOpacity="0.9" />
                      <stop offset="60%" stopColor="#A83E32" stopOpacity="0.82" />
                      <stop offset="100%" stopColor="#651B12" stopOpacity="0.92" />
                    </radialGradient>
                    <linearGradient id="ae-musc-oblique" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#C8584A" stopOpacity="0.85" />
                      <stop offset="60%" stopColor="#A43A2E" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#621810" stopOpacity="0.9" />
                    </linearGradient>
                    <linearGradient id="ae-musc-quad-3d" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#C45648" stopOpacity="0.88" />
                      <stop offset="45%" stopColor="#A63C30" stopOpacity="0.82" />
                      <stop offset="100%" stopColor="#5D150E" stopOpacity="0.92" />
                    </linearGradient>
                    <radialGradient id="ae-musc-deltoid" cx="40%" cy="30%" r="70%">
                      <stop offset="0%" stopColor="#DB6859" stopOpacity="0.9" />
                      <stop offset="60%" stopColor="#B44538" stopOpacity="0.82" />
                      <stop offset="100%" stopColor="#6D2116" stopOpacity="0.92" />
                    </radialGradient>
                    <linearGradient id="ae-musc-calf-3d" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#C25244" stopOpacity="0.85" />
                      <stop offset="50%" stopColor="#A33B2F" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#5F1810" stopOpacity="0.9" />
                    </linearGradient>

                    <linearGradient id="ae-beamG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#E3202B" stopOpacity="0" />
                      <stop offset="0.5" stopColor="#E3202B" stopOpacity="0.45" />
                      <stop offset="1" stopColor="#E3202B" stopOpacity="0" />
                    </linearGradient>
                    <radialGradient id="ae-glowR">
                      <stop offset="0" stopColor="#FF3B43" stopOpacity="0.75" />
                      <stop offset="100%" stopColor="#FF3B43" stopOpacity="0" />
                    </radialGradient>
                    <clipPath id="ae-bclip">
                      <ellipse cx="120" cy="40" rx="22" ry="27" />
                      <path d="M110 64 C110 74 110 80 108 86 C96 90 84 93 74 99 C66 103 63 114 67 126 C71 138 76 152 77 166 C79 186 86 200 87 214 C88 228 80 240 79 256 C77 278 80 302 84 330 C87 352 87 364 86 376 C84 398 84 420 89 446 C92 462 94 472 94 482 C88 488 80 493 82 498 C86 503 100 503 106 500 C108 494 107 486 108 478 C110 450 112 420 111 396 C110 384 111 376 112 368 C114 340 117 310 120 288 C123 310 126 340 128 368 C129 376 130 384 129 396 C128 420 130 450 132 478 C133 486 132 494 134 500 C140 503 154 503 158 498 C160 493 152 488 146 482 C146 472 148 462 151 446 C156 420 156 398 154 376 C153 364 153 352 156 330 C160 302 163 278 161 256 C160 240 152 228 153 214 C154 200 161 186 163 166 C164 152 169 138 173 126 C177 114 174 103 166 99 C156 93 144 90 132 86 C130 80 130 74 130 64 Z" />
                      <path d="M72 100 C62 104 56 116 56 132 C55 160 52 180 50 200 C47 225 43 250 40 280 C37 290 33 300 34 312 C35 322 41 326 45 322 C49 316 48 306 50 294 C54 270 58 244 62 218 C64 204 66 196 68 184 C70 170 74 152 76 138 Z" />
                      <path d="M168 100 C178 104 184 116 184 132 C185 160 188 180 190 200 C193 225 197 250 200 280 C203 290 207 300 206 312 C205 322 199 326 195 322 C191 316 192 306 190 294 C186 270 182 244 178 218 C176 204 174 196 172 184 C170 170 166 152 164 138 Z" />
                    </clipPath>
                  </defs>

                  {/* Frosted Glass Silhouette */}
                  <g
                    opacity="0.95"
                    style={{
                      filter: "drop-shadow(0 30px 34px rgba(120,60,90,0.22))",
                    }}
                  >
                    <g fill="url(#ae-glass)">
                      <path d="M72 100 C62 104 56 116 56 132 C55 160 52 180 50 200 C47 225 43 250 40 280 C37 290 33 300 34 312 C35 322 41 326 45 322 C49 316 48 306 50 294 C54 270 58 244 62 218 C64 204 66 196 68 184 C70 170 74 152 76 138 Z" />
                      <path d="M168 100 C178 104 184 116 184 132 C185 160 188 180 190 200 C193 225 197 250 200 280 C203 290 207 300 206 312 C205 322 199 326 195 322 C191 316 192 306 190 294 C186 270 182 244 178 218 C176 204 174 196 172 184 C170 170 166 152 164 138 Z" />
                      <path d="M110 64 C110 74 110 80 108 86 C96 90 84 93 74 99 C66 103 63 114 67 126 C71 138 76 152 77 166 C79 186 86 200 87 214 C88 228 80 240 79 256 C77 278 80 302 84 330 C87 352 87 364 86 376 C84 398 84 420 89 446 C92 462 94 472 94 482 C88 488 80 493 82 498 C86 503 100 503 106 500 C108 494 107 486 108 478 C110 450 112 420 111 396 C110 384 111 376 112 368 C114 340 117 310 120 288 C123 310 126 340 128 368 C129 376 130 384 129 396 C128 420 130 450 132 478 C133 486 132 494 134 500 C140 503 154 503 158 498 C160 493 152 488 146 482 C146 472 148 462 151 446 C156 420 156 398 154 376 C153 364 153 352 156 330 C160 302 163 278 161 256 C160 240 152 228 153 214 C154 200 161 186 163 166 C164 152 169 138 173 126 C177 114 174 103 166 99 C156 93 144 90 132 86 C130 80 130 74 130 64 Z" />
                      <ellipse cx="120" cy="40" rx="22" ry="27" />
                    </g>
                  </g>

                  {/* Real Human Muscular Anatomy with Volumetric Depth */}
                  <g clipPath="url(#ae-bclip)">
                    <rect x="0" y="0" width="240" height="520" fill="url(#ae-shade)" />
                    <rect x="0" y="0" width="240" height="520" fill="rgba(168,91,80,0.14)" />

                    {/* Trapezius & Sternocleidomastoid Neck Muscles */}
                    <g stroke="rgba(255,255,255,0.4)" strokeWidth="0.6">
                      <path d="M113 66 C115 76 117 88 118 98 C116 98 112 86 110 72 Z" fill="url(#ae-musc-ab-3d)" />
                      <path d="M127 66 C125 76 123 88 122 98 C124 98 128 86 130 72 Z" fill="url(#ae-musc-ab-3d)" />
                      <path d="M102 72 C96 80 86 88 78 96 C84 94 94 88 102 82 Z" fill="url(#ae-musc-oblique)" />
                      <path d="M138 72 C144 80 154 88 162 96 C156 94 146 88 138 82 Z" fill="url(#ae-musc-oblique)" />
                    </g>

                    {/* Deltoids (Shoulders) - Volumetric Muscle Caps */}
                    <g stroke="rgba(255,255,255,0.45)" strokeWidth="0.8">
                      <path d="M74 100 C64 105 60 118 64 134 C68 144 76 150 78 142 C76 128 72 116 74 100 Z" fill="url(#ae-musc-deltoid)" />
                      <path d="M70 106 C66 116 66 128 70 138" fill="none" stroke="rgba(255,230,225,0.7)" strokeWidth="0.8" />
                      <path d="M166 100 C176 105 180 118 176 134 C172 144 164 150 162 142 C164 128 168 116 166 100 Z" fill="url(#ae-musc-deltoid)" />
                      <path d="M170 106 C174 116 174 128 170 138" fill="none" stroke="rgba(255,230,225,0.7)" strokeWidth="0.8" />
                    </g>

                    {/* Pectoralis Major (Volumetric Chest Plates) */}
                    <g stroke="rgba(255,255,255,0.5)" strokeWidth="0.9">
                      <path d="M118 106 C105 106 90 114 84 128 C80 138 88 152 104 154 C112 155 118 150 118 142 Z" fill="url(#ae-musc-pectoral-l)" />
                      <path d="M122 106 C135 106 150 114 156 128 C160 138 152 152 136 154 C128 155 122 150 122 142 Z" fill="url(#ae-musc-pectoral-r)" />
                    </g>

                    {/* Pectoralis Striation Lines (Anatomical Fiber Flow) */}
                    <g fill="none" stroke="rgba(255,235,230,0.68)" strokeWidth="0.9" strokeLinecap="round">
                      <path d="M117 114 C104 118 94 126 86 134" />
                      <path d="M123 114 C136 118 146 126 154 134" />
                      <path d="M117 126 C105 130 96 138 88 144" />
                      <path d="M123 126 C135 130 144 138 152 144" />
                      <path d="M117 138 C108 142 100 146 94 150" />
                      <path d="M123 138 C132 142 140 146 146 150" />
                    </g>

                    {/* Serratus Anterior & Intercostals */}
                    <g fill="url(#ae-musc-oblique)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.7">
                      <path d="M82 158 C77 164 74 172 74 180 C78 178 82 174 84 168 Z" />
                      <path d="M158 158 C163 164 166 172 166 180 C162 178 158 174 156 168 Z" />
                      <path d="M84 174 C80 182 78 190 78 196 C82 194 84 190 86 184 Z" />
                      <path d="M156 174 C160 182 162 190 162 196 C158 194 156 190 154 184 Z" />
                      <path d="M86 190 C83 198 82 206 82 212 C86 210 88 204 89 198 Z" />
                      <path d="M154 190 C157 198 158 206 158 212 C154 210 152 204 151 198 Z" />
                    </g>

                    {/* Linea Alba (Abdominal Center Furrow with Dual Shadow & Highlight) */}
                    <line x1="120" y1="154" x2="120" y2="264" stroke="rgba(80,20,15,0.65)" strokeWidth="2.2" strokeLinecap="round" />
                    <line x1="120.7" y1="154" x2="120.7" y2="264" stroke="rgba(255,255,255,0.9)" strokeWidth="0.9" strokeLinecap="round" />

                    {/* Rectus Abdominis (Anatomical 6-Pack with 3D Radial Cushion Relief) */}
                    <g fill="url(#ae-musc-ab-3d)" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8">
                      {/* Upper Abs Pair */}
                      <path d="M106 158 C100 158 96 163 96 172 C96 180 100 185 106 185 C112 185 118 180 118 172 C118 163 112 158 106 158 Z" />
                      <path d="M134 158 C128 158 122 163 122 172 C122 180 128 185 134 185 C140 185 144 180 144 172 C144 163 140 158 134 158 Z" />
                      {/* Mid Abs Pair */}
                      <path d="M106 190 C99 190 95 196 95 206 C95 216 99 222 106 222 C113 222 118 216 118 206 C118 196 113 190 106 190 Z" />
                      <path d="M134 190 C127 190 122 196 122 206 C122 216 127 222 134 222 C141 222 145 216 145 206 C145 196 141 190 134 190 Z" />
                      {/* Lower Abs Pair */}
                      <path d="M107 226 C101 226 97 232 97 242 C97 252 102 258 109 258 C115 258 118 252 118 242 C118 232 114 226 107 226 Z" />
                      <path d="M133 226 C126 226 122 232 122 242 C122 252 125 258 131 258 C137 258 143 252 143 242 C143 232 139 226 133 226 Z" />
                    </g>

                    {/* Transverse Tendinous Inscriptions (Ab Groove 3D Indentations) */}
                    <g fill="none" stroke="rgba(255,255,255,0.88)" strokeWidth="1.3" strokeLinecap="round">
                      <path d="M96 186 Q107 188 118 186" />
                      <path d="M122 186 Q133 188 144 186" />
                      <path d="M95 223 Q106 225 118 223" />
                      <path d="M122 223 Q133 225 145 223" />
                      <path d="M97 259 Q108 261 118 259" />
                      <path d="M122 259 Q132 261 143 259" />
                    </g>

                    {/* External Obliques (Waist Flank Muscles & Inguinal V-Cut) */}
                    <g fill="url(#ae-musc-oblique)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8">
                      <path d="M94 194 C88 202 86 216 86 234 C86 248 90 258 94 260 C96 250 96 234 96 216 Z" />
                      <path d="M146 194 C152 202 154 216 154 234 C154 248 150 258 146 260 C144 250 144 234 144 216 Z" />
                      <path d="M96 258 C104 270 114 274 120 274" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.3" />
                      <path d="M144 258 C136 270 126 274 120 274" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.3" />
                    </g>

                    {/* Biceps Brachii & Forearms */}
                    <g fill="url(#ae-musc-deltoid)" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8">
                      <path d="M62 138 C56 154 54 174 56 194 C60 194 66 180 68 166 C70 152 68 140 62 138 Z" />
                      <path d="M178 138 C184 154 186 174 184 194 C180 194 174 180 172 166 C170 152 172 140 178 138 Z" />
                      <path d="M52 204 C46 228 42 258 40 284 C44 284 50 262 54 234 C56 218 54 208 52 204 Z" />
                      <path d="M188 204 C194 228 198 258 200 284 C196 284 190 262 186 234 C184 218 186 208 188 204 Z" />
                    </g>

                    {/* Quadriceps Femoris (Thigh Muscles) */}
                    <g fill="url(#ae-musc-quad-3d)" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8">
                      {/* Left Central Rectus Femoris */}
                      <path d="M104 274 C98 300 96 332 98 360 C103 360 106 332 107 300 C108 285 107 276 104 274 Z" />
                      {/* Left Outer Vastus Lateralis */}
                      <path d="M93 278 C86 304 84 336 88 362 C92 362 95 336 96 304 C97 290 96 280 93 278 Z" />
                      {/* Left Medial Vastus Medialis (Teardrop) */}
                      <path d="M110 334 C106 342 105 352 106 364 C111 364 115 356 114 346 C113 338 111 334 110 334 Z" fill="url(#ae-musc-pectoral-l)" />

                      {/* Right Central Rectus Femoris */}
                      <path d="M136 274 C142 300 144 332 142 360 C137 360 134 332 133 300 C132 285 133 276 136 274 Z" />
                      {/* Right Outer Vastus Lateralis */}
                      <path d="M147 278 C154 304 156 336 152 362 C148 362 145 336 144 304 C143 290 144 280 147 278 Z" />
                      {/* Right Medial Vastus Medialis (Teardrop) */}
                      <path d="M130 334 C134 342 135 352 134 364 C129 364 125 356 126 346 C127 338 129 334 130 334 Z" fill="url(#ae-musc-pectoral-r)" />
                    </g>

                    {/* Patellar Tendons & Knee Articulations */}
                    <g fill="rgba(255,255,255,0.78)">
                      <circle cx="102" cy="370" r="3.2" />
                      <circle cx="138" cy="370" r="3.2" />
                      <rect x="100.5" y="373" width="3" height="8" rx="1.5" />
                      <rect x="136.5" y="373" width="3" height="8" rx="1.5" />
                    </g>

                    {/* Gastrocnemius (Calves) & Tibialis Anterior (Shins) */}
                    <g fill="url(#ae-musc-calf-3d)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8">
                      <path d="M92 384 C85 402 85 424 90 446 C94 446 97 428 98 410 C99 396 97 386 92 384 Z" />
                      <path d="M102 386 C105 402 106 422 104 442 C101 442 99 424 98 406 C97 394 100 388 102 386 Z" />
                      <path d="M96 442 C94 460 93 474 94 486 C98 486 100 472 101 456 C101 446 98 442 96 442 Z" fill="url(#ae-musc-oblique)" />

                      <path d="M148 384 C155 402 155 424 150 446 C146 446 143 428 142 410 C141 396 143 386 148 384 Z" />
                      <path d="M138 386 C135 402 134 422 136 442 C139 442 141 424 142 406 C143 394 140 388 138 386 Z" />
                      <path d="M144 442 C146 460 147 474 146 486 C142 486 140 472 139 456 C139 446 142 442 144 442 Z" fill="url(#ae-musc-oblique)" />
                    </g>

                    {/* Cardiovascular Vasculature (Aorta & Vena Cava) */}
                    <g fill="none" strokeWidth="1.2">
                      <path d="M125 142 C125 125 120 112 118 98 M125 125 C128 112 130 98 132 98" stroke="#EF4444" opacity="0.82" />
                      <path d="M122 154 V250 C122 258 116 266 108 280 M122 250 C122 258 128 266 136 280" stroke="#EF4444" opacity="0.78" />
                      <path d="M117 140 C117 125 114 112 114 98" stroke="#2563EB" opacity="0.78" />
                      <path d="M117 154 V248 C117 256 112 264 105 278" stroke="#2563EB" opacity="0.72" />
                    </g>

                    {/* Pulsing Myocardial Engine (Beating Heart) */}
                    <circle cx="127" cy="143" r="22" fill="url(#ae-glowR)" />
                    <path
                      className="ae-beat"
                      d="M127 152 C117 145 113 140 113 135 A6.5 6.5 0 0 1 127 131 A6.5 6.5 0 0 1 141 135 C141 140 137 145 127 152 Z"
                      fill="#E3202B"
                      stroke="#FF6B6F"
                      strokeWidth="0.8"
                    />

                    {/* Vertical Moving Scanning Laser Beam */}
                    <rect
                      className="ae-beam"
                      x="0"
                      y="-60"
                      width="240"
                      height="60"
                      fill="url(#ae-beamG)"
                    />
                  </g>

                  {/* Muscular Rim Highlight */}
                  <g
                    fill="none"
                    stroke="rgba(255,255,255,0.95)"
                    strokeWidth="1.4"
                  >
                    <path
                      d="M104 22 Q98 36 102 54"
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity="0.9"
                    />
                    <path
                      d="M82 112 Q76 170 86 222"
                      strokeWidth="4"
                      strokeLinecap="round"
                      opacity="0.8"
                    />
                    <path
                      d="M90 280 Q86 330 92 380"
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity="0.8"
                    />
                  </g>
                </svg>

                {/* Hotspots */}
                <span className="ae-hot" style={{ left: "50%", top: "6.9%" }} />
                <span
                  className="ae-hot"
                  style={{ left: "45.8%", top: "38.5%", animationDelay: ".8s" }}
                />
              </div>

              {/* 3D ELLIPTICAL SCANNING RING - FRONT ARC (Passes IN FRONT OF the human body in 3D!) */}
              <div
                className="ae-scanring absolute left-1/2 top-[40px] w-[340px] h-[74px] pointer-events-none z-[16]"
              >
                <svg viewBox="0 0 340 74" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="ae-scan-front-grad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#E3202B" stopOpacity="0.95" />
                      <stop offset="20%" stopColor="#FF4A52" stopOpacity="1" />
                      <stop offset="50%" stopColor="#FFA6AA" stopOpacity="1" />
                      <stop offset="80%" stopColor="#FF4A52" stopOpacity="1" />
                      <stop offset="100%" stopColor="#E3202B" stopOpacity="0.95" />
                    </linearGradient>
                    <filter id="ae-glow-front" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="4.5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  {/* Front ambient laser bloom passing across body */}
                  <path
                    d="M 12 37 A 158 31 0 0 0 328 37"
                    fill="none"
                    stroke="rgba(227,32,43,0.48)"
                    strokeWidth="11"
                    filter="url(#ae-glow-front)"
                  />
                  {/* Primary high-intensity front laser beam */}
                  <path
                    d="M 12 37 A 158 31 0 0 0 328 37"
                    fill="none"
                    stroke="url(#ae-scan-front-grad)"
                    strokeWidth="3.4"
                  />
                  {/* Core white laser filament in front */}
                  <path
                    d="M 15 37 A 155 29 0 0 0 325 37"
                    fill="none"
                    stroke="rgba(255,255,255,0.95)"
                    strokeWidth="1.4"
                  />
                  {/* Left lateral laser emitter node */}
                  <circle cx="12" cy="37" r="5" fill="#FFFFFF" filter="url(#ae-glow-front)" />
                  <circle cx="12" cy="37" r="2.8" fill="#E3202B" />
                  {/* Right lateral laser emitter node */}
                  <circle cx="328" cy="37" r="5" fill="#FFFFFF" filter="url(#ae-glow-front)" />
                  <circle cx="328" cy="37" r="2.8" fill="#E3202B" />
                </svg>
              </div>
            </div>
          )}

          {/* Floating Spheres Accents */}
          <div
            className="ae-float absolute top-[230px] left-[30px] w-[22px] h-[22px] rounded-full"
            style={{
              background:
                "radial-gradient(circle at 32% 28%, #FFB0AE 0%, #E3202B 40%, #8E0C14 100%)",
              animationDelay: "-3s",
            }}
          />
          <div
            className="ae-float-c absolute bottom-[170px] left-[46px] w-10 h-10 rounded-full shadow-[0_18px_30px_rgba(0,0,0,0.22)]"
            style={{
              background:
                "radial-gradient(circle at 32% 28%, #8A8D93 0%, #2A2C30 34%, #0E0F11 80%)",
            }}
          />
          <div
            className="ae-float-b absolute top-[290px] right-[18px] w-[18px] h-[18px] rounded-full shadow-[0_10px_18px_rgba(0,0,0,0.12)]"
            style={{
              background:
                "radial-gradient(circle at 32% 28%, #FFFFFF 0%, #E2DDE3 50%, #B5ADB7 100%)",
            }}
          />

          {/* Floating Glass Telemetry Cards */}
          {/* Card 1: Top Left - Health Score */}
          <div
            className="ae-float-c ae-hide-sm absolute top-8 -left-4 w-[212px] p-3.5 sm:p-4 rounded-[22px] flex items-center gap-3.5 border border-white/90 shadow-[0_22px_46px_rgba(29,31,34,0.10),inset_0_1px_0_#FFFFFF] text-[13px] leading-snug"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.86), rgba(255,255,255,0.52))",
              backdropFilter: "blur(18px) saturate(180%)",
              WebkitBackdropFilter: "blur(18px) saturate(180%)",
            }}
          >
            <div className="relative flex-none w-[54px] h-[54px]">
              <svg width="54" height="54" viewBox="0 0 54 54">
                <defs>
                  <linearGradient id="ae-scoreG" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#FF7A80" />
                    <stop offset="1" stopColor="#C8161F" />
                  </linearGradient>
                </defs>
                <circle
                  cx="27"
                  cy="27"
                  r="22"
                  fill="none"
                  stroke="#F3E3E5"
                  strokeWidth="6"
                />
                <circle
                  cx="27"
                  cy="27"
                  r="22"
                  fill="none"
                  stroke="url(#ae-scoreG)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="138.2"
                  strokeDashoffset="19.4"
                  transform="rotate(-90 27 27)"
                />
              </svg>
              <span
                className="absolute inset-0 flex items-center justify-center font-semibold text-[17px] tracking-tight text-[#1D1F22]"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                86
              </span>
            </div>
            <div>
              <div className="font-medium text-[#1D1F22]">Health score</div>
              <div className="text-[#6B7178] text-xs">Updated today</div>
              <div className="mt-1 inline-block px-2 py-0.5 rounded-full bg-[#EAF6EF] text-[#1E7A4C] text-[11px] font-medium">
                +4 this month
              </div>
            </div>
          </div>

          {/* Card 2: Top Right - Live Heart Rate */}
          <div
            className="ae-float-b absolute top-[120px] -right-7 w-[200px] p-3.5 sm:p-4 rounded-[22px] border border-white/90 shadow-[0_22px_46px_rgba(29,31,34,0.10),inset_0_1px_0_#FFFFFF] text-[13px]"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.86), rgba(255,255,255,0.52))",
              backdropFilter: "blur(18px) saturate(180%)",
              WebkitBackdropFilter: "blur(18px) saturate(180%)",
            }}
          >
            <div className="flex justify-between items-center">
              <span className="inline-flex items-center gap-2 font-medium text-[#1D1F22]">
                <span className="w-[26px] h-[26px] rounded-lg bg-[#FFE3E1] flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#E3202B">
                    <path d="M12 21C5 16 2 12.5 2 8.5A5 5 0 0 1 12 6a5 5 0 0 1 10 2.5c0 4-3 7.5-10 12.5z" />
                  </svg>
                </span>
                Heart rate
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#C8161F]">
                <span className="ae-pulse w-1.5 h-1.5 rounded-full bg-[#E3202B]" />
                LIVE
              </span>
            </div>
            <div
              className="mt-2 text-[28px] font-normal tracking-tight text-[#1D1F22] leading-none"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              72{" "}
              <span className="text-[13px] text-[#6B7178] tracking-normal">
                bpm
              </span>
            </div>
            <svg
              width="100%"
              height="34"
              viewBox="0 0 168 34"
              preserveAspectRatio="none"
              className="mt-1.5 block"
            >
              <path
                className="ae-ecg"
                d="M0 18 H38 L44 18 L48 6 L53 30 L58 10 L62 18 H96 L102 18 L106 6 L111 30 L116 10 L120 18 H168"
                fill="none"
                stroke="#E3202B"
                strokeWidth="1.8"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Card 3: Bottom Right - Post-Meal Glucose */}
          <div
            className="ae-float-c ae-hide-sm absolute top-[352px] -right-12 w-[228px] p-3.5 sm:p-4 rounded-[22px] border border-white/90 shadow-[0_22px_46px_rgba(29,31,34,0.10),inset_0_1px_0_#FFFFFF] text-[13px]"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.86), rgba(255,255,255,0.52))",
              backdropFilter: "blur(18px) saturate(180%)",
              WebkitBackdropFilter: "blur(18px) saturate(180%)",
              animationDelay: "-2.5s",
            }}
          >
            <div className="flex justify-between items-center gap-2">
              <span className="font-medium text-[#1D1F22] whitespace-nowrap">
                Post-meal glucose
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#FFF1F0] text-[#C8161F] text-[11px] font-semibold">
                Borderline
              </span>
            </div>
            <svg
              width="100%"
              height="48"
              viewBox="0 0 184 48"
              preserveAspectRatio="none"
              className="mt-2.5 block"
            >
              <defs>
                <linearGradient id="ae-sparkG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#E3202B" stopOpacity="0.22" />
                  <stop offset="1" stopColor="#E3202B" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 38 C20 36 30 33 44 29 C60 25 66 12 84 14 C100 16 108 30 124 26 C140 22 152 10 184 8 L184 48 L0 48 Z"
                fill="url(#ae-sparkG)"
              />
              <path
                d="M0 38 C20 36 30 33 44 29 C60 25 66 12 84 14 C100 16 108 30 124 26 C140 22 152 10 184 8"
                fill="none"
                stroke="#E3202B"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle
                cx="180"
                cy="8.4"
                r="3.6"
                fill="#FFFFFF"
                stroke="#E3202B"
                strokeWidth="2"
              />
            </svg>
            <div className="mt-1.5 flex items-center gap-1.5 text-[#6B7178] text-xs">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C8161F"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12h4l3-8 4 16 3-8h4" />
              </svg>
              Pattern detected after meals
            </div>
          </div>

          {/* Card 4: Bottom Left - Multilingual Badge */}
          <div
            className="ae-float absolute bottom-6 -left-6 flex items-center gap-2.5 p-2.5 pr-4 rounded-[18px] border border-white/90 shadow-[0_22px_46px_rgba(29,31,34,0.10),inset_0_1px_0_#FFFFFF] text-[13px] leading-snug"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.86), rgba(255,255,255,0.52))",
              backdropFilter: "blur(18px) saturate(180%)",
              WebkitBackdropFilter: "blur(18px) saturate(180%)",
              animationDelay: "-1.5s",
            }}
          >
            <span className="w-8 h-8 rounded-[10px] bg-[#1D1F22] text-white flex items-center justify-center text-sm font-medium">
              अ
            </span>
            <span>
              <span className="font-medium text-[#1D1F22]">हिन्दी में समझाएँ</span>
              <br />
              <span className="text-[#6B7178]">Explained in your language</span>
            </span>
          </div>
        </div>
      </section>

      {/* ============ MARQUEE: 22+ INDIAN LANGUAGES ============ */}
      <section
        aria-label="Languages supported"
        className="py-2 pb-20"
      >
        <p className="m-0 mb-6 text-center text-sm text-[#6B7178]">
          Built for every community in Bharat — 22+ languages supported
        </p>
        <div
          className="overflow-hidden"
          style={{
            WebkitMaskImage:
              "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
            maskImage:
              "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
          }}
        >
          <div
            className="ae-marquee flex w-max gap-14 pr-14 text-[26px] text-[#8A9097] tracking-tight whitespace-nowrap"
            style={{ fontFamily: "'Inter Tight', 'Noto Sans', sans-serif" }}
          >
            <span>English</span>
            <span>हिन्दी</span>
            <span>বাংলা</span>
            <span>తెలుగు</span>
            <span>मराठी</span>
            <span>தமிழ்</span>
            <span>ગુજરાતી</span>
            <span>ಕನ್ನಡ</span>
            <span>മലയാളം</span>
            <span>ଓଡ଼ିଆ</span>
            <span>ਪੰਜਾਬੀ</span>
            <span>অসমীয়া</span>
            <span>اردو</span>
            {/* Duplicated for seamless loop */}
            <span>English</span>
            <span>हिन्दी</span>
            <span>বাংলা</span>
            <span>తెలుగు</span>
            <span>मराठी</span>
            <span>தமிழ்</span>
            <span>ગુજરાતી</span>
            <span>ಕನ್ನಡ</span>
            <span>മലയാളം</span>
            <span>ଓଡ଼ିଆ</span>
            <span>ਪੰਜਾਬੀ</span>
            <span>অসমীয়া</span>
            <span>اردو</span>
          </div>
        </div>
      </section>

      {/* ============ BEFORE / AFTER: DRAG TO REVEAL ============ */}
      <section
        id="services"
        className="ae-rv max-w-[1240px] mx-auto px-6"
      >
        <div className="relative rounded-[40px] overflow-hidden bg-[#E9EDF1] shadow-[0_30px_60px_rgba(29,31,34,0.06)] select-none">
          {/* BEFORE Layer (Lab Report) */}
          <div className="p-8 sm:p-12 md:p-14 font-mono text-[#545B61]">
            <div className="flex justify-between items-center h-10">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 font-sans text-xs tracking-wider text-[#1D1F22]">
                <svg
                  aria-hidden="true"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                  <path d="M14 3v5h5M9 13h6M9 17h4" />
                </svg>
                BEFORE · YOUR LAB REPORT
              </span>
            </div>

            <div className="mt-6 grid grid-cols-[2fr_repeat(3,1fr)] gap-2 h-9 items-center border-b border-[#D0D7DE] text-[11px] tracking-widest text-[#6B7178]">
              <span>TEST</span>
              <span>RESULT</span>
              <span>REF. RANGE</span>
              <span>FLAG</span>
            </div>

            <div className="grid grid-cols-[2fr_repeat(3,1fr)] gap-2 h-19 items-center border-b border-[#D0D7DE] text-[15px]">
              <span>HBA1C (GLYCATED HB)</span>
              <span>6.1 %</span>
              <span>4.0–5.6</span>
              <span className="text-[#C8161F] font-bold">H</span>
            </div>
            <div className="grid grid-cols-[2fr_repeat(3,1fr)] gap-2 h-19 items-center border-b border-[#D0D7DE] text-[15px]">
              <span>25-OH VITAMIN D</span>
              <span>18.2 ng/mL</span>
              <span>30–100</span>
              <span className="text-[#9A5A00] font-bold">L</span>
            </div>
            <div className="grid grid-cols-[2fr_repeat(3,1fr)] gap-2 h-19 items-center border-b border-[#D0D7DE] text-[15px]">
              <span>LDL-C (DIRECT)</span>
              <span>142 mg/dL</span>
              <span>&lt;100</span>
              <span className="text-[#C8161F] font-bold">H</span>
            </div>
            <div className="grid grid-cols-[2fr_repeat(3,1fr)] gap-2 h-19 items-center text-[15px]">
              <span>TSH (3RD GEN)</span>
              <span>2.1 µIU/mL</span>
              <span>0.4–4.0</span>
              <span>—</span>
            </div>
          </div>

          {/* AFTER Layer (Clipped View with AETHRIZ Actions) */}
          <div
            className="absolute inset-0 bg-white p-8 sm:p-12 md:p-14"
            style={{ clipPath: `inset(0 0 0 ${reveal}%)` }}
          >
            <div className="flex justify-end items-center h-10">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFE9E7] text-xs text-[#C8161F] tracking-wider font-semibold">
                <svg
                  aria-hidden="true"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z" />
                  <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" />
                </svg>
                AFTER · WITH AETHRIZ
              </span>
            </div>

            <div className="mt-6 h-9 border-b border-[#EEF1F4] flex items-center text-[11px] tracking-widest text-[#6B7178] font-semibold">
              WHAT IT MEANS FOR YOU
            </div>

            {/* Insight 1: Blood Sugar */}
            <div className="flex items-center gap-4 h-19 border-b border-[#EEF1F4]">
              <span className="flex-none w-10 h-10 rounded-xl bg-[#FFF1F0] text-[#C8161F] flex items-center justify-center">
                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />
                </svg>
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-[#1D1F22]">
                  Blood sugar is slightly above ideal
                </div>
                <div className="text-sm text-[#545B61]">
                  Small, steady meal swaps that fit how you already eat.
                </div>
              </div>
              <span className="flex-none px-3 py-1 rounded-full bg-[#FFF1F0] text-[#C8161F] text-xs font-semibold">
                Borderline
              </span>
            </div>

            {/* Insight 2: Vitamin D */}
            <div className="flex items-center gap-4 h-19 border-b border-[#EEF1F4]">
              <span className="flex-none w-10 h-10 rounded-xl bg-[#FFF5E6] text-[#9A5A00] flex items-center justify-center">
                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-[#1D1F22]">Vitamin D is low</div>
                <div className="text-sm text-[#545B61]">
                  Everyday food and routine ideas, matched to your diet.
                </div>
              </div>
              <span className="flex-none px-3 py-1 rounded-full bg-[#FFF5E6] text-[#9A5A00] text-xs font-semibold">
                Low
              </span>
            </div>

            {/* Insight 3: LDL */}
            <div className="flex items-center gap-4 h-19 border-b border-[#EEF1F4]">
              <span className="flex-none w-10 h-10 rounded-xl bg-[#FFF1F0] text-[#C8161F] flex items-center justify-center">
                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 21.5l8.8-8.8a5 5 0 0 0 0-7.1z" />
                </svg>
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-[#1D1F22]">
                  LDL cholesterol is elevated
                </div>
                <div className="text-sm text-[#545B61]">
                  Worth discussing with your doctor — lifestyle steps to start today.
                </div>
              </div>
              <span className="flex-none px-3 py-1 rounded-full bg-[#FFF1F0] text-[#C8161F] text-xs font-semibold">
                Elevated
              </span>
            </div>

            {/* Insight 4: Thyroid */}
            <div className="flex items-center gap-4 h-19">
              <span className="flex-none w-10 h-10 rounded-xl bg-[#EAF6EF] text-[#1E7A4C] flex items-center justify-center">
                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12l5 5 9-10" />
                </svg>
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-[#1D1F22]">
                  Thyroid looks balanced
                </div>
                <div className="text-sm text-[#545B61]">
                  Keep doing what you are doing.
                </div>
              </div>
              <span className="flex-none px-3 py-1 rounded-full bg-[#EAF6EF] text-[#1E7A4C] text-xs font-semibold">
                Balanced
              </span>
            </div>
          </div>

          {/* Draggable Divider Handle */}
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 w-0.5 -ml-px bg-white shadow-[0_0_0_1px_rgba(29,31,34,0.06)] pointer-events-none"
            style={{ left: `${reveal}%` }}
          >
            <div className="absolute top-1/2 left-1/2 w-14 h-14 -mt-7 -ml-7 rounded-full bg-white shadow-[0_10px_28px_rgba(29,31,34,0.18)] flex items-center justify-center text-[#1D1F22]">
              <svg
                className="ae-hint"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
              </svg>
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-full bg-[#1D1F22] text-white font-sans text-xs font-medium shadow-md">
              Drag to reveal
            </div>
          </div>

          {/* Range Input for Smooth Drag Interaction */}
          <input
            type="range"
            min="0"
            max="100"
            value={reveal}
            onChange={(e) => setReveal(Number(e.target.value))}
            aria-label="Drag to compare your lab report with the AETHRIZ view"
            className="absolute inset-0 w-full h-full m-0 opacity-0 cursor-ew-resize z-20"
          />
        </div>

        {/* 4 Feature Columns */}
        <div className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-2">
          {/* Pillar 1: Personalized */}
          <div>
            <div className="w-14 h-14 rounded-[18px] bg-gradient-to-br from-white to-[#E9EDF2] shadow-[0_12px_24px_rgba(29,31,34,0.08),inset_0_1px_0_#FFFFFF,inset_0_-3px_6px_rgba(29,31,34,0.05)] flex items-center justify-center">
              <svg
                aria-hidden="true"
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="3.6" stroke="#1D1F22" />
                <path
                  d="M4.5 20.5c1.4-3.8 4.2-5.6 7.5-5.6s6.1 1.8 7.5 5.6"
                  stroke="#1D1F22"
                />
                <path
                  d="M17.5 4.5l1 1.8 2 .4-1.4 1.4.3 2-1.9-1-1.9 1 .3-2-1.4-1.4 2-.4z"
                  stroke="#E3202B"
                />
              </svg>
            </div>
            <h3
              className="mt-5 mb-2.5 font-normal text-[22px] tracking-tight text-[#1D1F22]"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              Personalized
            </h3>
            <p className="m-0 text-[15px] text-[#545B61]">
              Recommendations built around your health data, lifestyle, dietary
              habits and individual needs.
            </p>
          </div>

          {/* Pillar 2: Multilingual */}
          <div>
            <div className="w-14 h-14 rounded-[18px] bg-gradient-to-br from-white to-[#E9EDF2] shadow-[0_12px_24px_rgba(29,31,34,0.08),inset_0_1px_0_#FFFFFF,inset_0_-3px_6px_rgba(29,31,34,0.05)] flex items-center justify-center">
              <svg
                aria-hidden="true"
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  d="M4 5.5A2.5 2.5 0 0 1 6.5 3h7A2.5 2.5 0 0 1 16 5.5v4A2.5 2.5 0 0 1 13.5 12H9l-3.5 3v-3A2.5 2.5 0 0 1 4 9.5z"
                  stroke="#1D1F22"
                />
                <path
                  d="M19 9.5a2 2 0 0 1 1 1.7v4.3a2.5 2.5 0 0 1-2.5 2.5V21l-3.5-3h-3a2.5 2.5 0 0 1-2-1"
                  stroke="#E3202B"
                />
              </svg>
            </div>
            <h3
              className="mt-5 mb-2.5 font-normal text-[22px] tracking-tight text-[#1D1F22]"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              Multilingual
            </h3>
            <p className="m-0 text-[15px] text-[#545B61]">
              AI-powered healthcare made accessible across Indian languages and
              diverse communities.
            </p>
          </div>

          {/* Pillar 3: Predictive */}
          <div>
            <div className="w-14 h-14 rounded-[18px] bg-gradient-to-br from-white to-[#E9EDF2] shadow-[0_12px_24px_rgba(29,31,34,0.08),inset_0_1px_0_#FFFFFF,inset_0_-3px_6px_rgba(29,31,34,0.05)] flex items-center justify-center">
              <svg
                aria-hidden="true"
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 20h18" stroke="#1D1F22" />
                <path d="M4 16l5-5 4 3 7-8" stroke="#1D1F22" />
                <path d="M15 6h5v5" stroke="#E3202B" />
              </svg>
            </div>
            <h3
              className="mt-5 mb-2.5 font-normal text-[22px] tracking-tight text-[#1D1F22]"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              Predictive
            </h3>
            <p className="m-0 text-[15px] text-[#545B61]">
              Deep-learning models read health patterns to flag potential risks and
              offer proactive insights.
            </p>
          </div>

          {/* Pillar 4: Adaptive */}
          <div>
            <div className="w-14 h-14 rounded-[18px] bg-gradient-to-br from-white to-[#E9EDF2] shadow-[0_12px_24px_rgba(29,31,34,0.08),inset_0_1px_0_#FFFFFF,inset_0_-3px_6px_rgba(29,31,34,0.05)] flex items-center justify-center">
              <svg
                aria-hidden="true"
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 12a8 8 0 1 1-2.3-5.6" stroke="#1D1F22" />
                <path d="M20 4v5h-5" stroke="#E3202B" />
                <circle cx="12" cy="12" r="2" stroke="#1D1F22" />
              </svg>
            </div>
            <h3
              className="mt-5 mb-2.5 font-normal text-[22px] tracking-tight text-[#1D1F22]"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              Adaptive
            </h3>
            <p className="m-0 text-[15px] text-[#545B61]">
              Guidance that evolves with your health and changing needs — never
              one-size-fits-all.
            </p>
          </div>
        </div>
      </section>

      {/* ============ DARK STATS & 3D NEURAL GLOBE ============ */}
      <section className="ae-rv max-w-[1240px] mx-auto px-6 pt-20 sm:pt-28">
        <div className="relative overflow-hidden rounded-[40px] bg-[#121316] text-white p-8 sm:p-14 lg:p-20">
          {/* Red Glow Backdrop */}
          <div
            aria-hidden="true"
            className="ae-glow absolute -right-36 -top-44 w-[600px] h-[600px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(227,32,43,0.42) 0%, rgba(227,32,43,0) 65%)",
            }}
          />

          <div className="relative flex flex-wrap gap-12 items-center justify-between">
            {/* Left Content */}
            <div className="flex-1 basis-[420px] min-w-0">
              <p className="m-0 mb-4 inline-flex items-center gap-2 text-sm text-[#A9AEB4]">
                <span className="ae-pulse w-2 h-2 rounded-full bg-[#FF4A51]" />
                Precise by design
              </p>
              <h2
                className="m-0 font-light text-[clamp(34px,4vw,54px)] leading-tight tracking-tight"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                Deep learning, built for
                <br />
                real-world health data.
              </h2>
              <p className="mt-6 max-w-[460px] text-base text-[#C3C7CC]">
                Our models are designed for high-performance health-data analysis —
                fast enough to feel instant, and built to understand people in their
                own language.
              </p>
            </div>

            {/* Right: 3D Rotating Neural Globe */}
            <div
              aria-hidden="true"
              className="flex-none basis-[380px] h-[380px] relative flex items-center justify-center [perspective:900px]"
            >
              <div
                className="ae-glow absolute w-[360px] h-[360px] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(227,32,43,0.35) 0%, rgba(227,32,43,0) 62%)",
                }}
              />
              <div
                className="ae-globe relative w-[280px] h-[280px]"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Longitude / Latitude Rings */}
                <span
                  className="absolute inset-0 rounded-full border border-white/20"
                  style={{ transform: "rotateY(0deg)" }}
                >
                  <span className="absolute top-1/2 -left-1.5 w-2.5 h-2.5 -mt-1 rounded-full bg-[#FF4A51] shadow-[0_0_12px_#FF4A51]" />
                </span>
                <span
                  className="absolute inset-0 rounded-full border border-white/20"
                  style={{ transform: "rotateY(30deg)" }}
                />
                <span
                  className="absolute inset-0 rounded-full border border-white/20"
                  style={{ transform: "rotateY(60deg)" }}
                >
                  <span className="absolute top-[22%] right-[8%] w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#FFFFFF]" />
                </span>
                <span
                  className="absolute inset-0 rounded-full border border-white/20"
                  style={{ transform: "rotateY(90deg)" }}
                />
                <span
                  className="absolute inset-0 rounded-full border border-white/20"
                  style={{ transform: "rotateY(120deg)" }}
                >
                  <span className="absolute bottom-[16%] left-[12%] w-2 h-2 rounded-full bg-[#FF4A51] shadow-[0_0_10px_#FF4A51]" />
                </span>
                <span
                  className="absolute inset-0 rounded-full border border-white/20"
                  style={{ transform: "rotateY(150deg)" }}
                />
                <span
                  className="absolute inset-0 rounded-full border border-white/30"
                  style={{ transform: "rotateX(90deg)" }}
                >
                  <span className="absolute top-1/2 -right-1.5 w-2.5 h-2.5 -mt-1 rounded-full bg-white shadow-[0_0_12px_#FFFFFF]" />
                </span>
                <span
                  className="absolute left-[19px] top-[19px] w-[242px] h-[242px] rounded-full border border-white/15"
                  style={{ transform: "rotateX(90deg) translateZ(70px)" }}
                />
                <span
                  className="absolute left-[19px] top-[19px] w-[242px] h-[242px] rounded-full border border-white/15"
                  style={{ transform: "rotateX(90deg) translateZ(-70px)" }}
                />
                <span
                  className="absolute left-[60px] top-[60px] w-40 h-40 rounded-full border border-white/10"
                  style={{ transform: "rotateX(90deg) translateZ(115px)" }}
                />
                <span
                  className="absolute left-[60px] top-[60px] w-40 h-40 rounded-full border border-white/10"
                  style={{ transform: "rotateX(90deg) translateZ(-115px)" }}
                />
              </div>

              {/* Specular Red Center Sphere */}
              <div
                className="ae-float absolute w-[108px] h-[108px] rounded-full shadow-[0_0_60px_rgba(227,32,43,0.55),inset_-10px_-12px_22px_rgba(0,0,0,0.28)]"
                style={{
                  background:
                    "radial-gradient(circle at 32% 26%, #FFC2C0 0%, #F2343C 28%, #B5111A 68%, #5E080D 100%)",
                }}
              />
              <div
                className="absolute left-1/2 top-1/2 w-[30px] h-[18px] -mt-9 -ml-7 rounded-full"
                style={{
                  background:
                    "radial-gradient(ellipse, rgba(255,255,255,0.85), rgba(255,255,255,0) 70%)",
                  transform: "rotate(-30deg)",
                }}
              />
              <div className="ae-ring absolute w-[360px] h-[360px] rounded-full border border-dashed border-[#FF6B6F]/35" />

              {/* Latency Tag */}
              <div
                className="ae-float-c absolute right-0 bottom-9 inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)] text-xs text-[#E6E8EB] whitespace-nowrap"
                style={{
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                <span className="ae-pulse w-1.5 h-1.5 rounded-full bg-[#FF4A51]" />
                Model inference · 40ms
              </div>
            </div>
          </div>

          {/* 3 Metrics Cards */}
          <div className="relative mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="ae-lift p-7 rounded-3xl bg-white/5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
              <svg
                aria-hidden="true"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FF6B6F"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="12" cy="12" r="1.2" fill="#FF6B6F" />
              </svg>
              <div
                className="mt-5 font-light text-[60px] leading-none tracking-tight text-white"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                98.9<span className="text-[30px] text-[#FF6B6F]">%</span>
              </div>
              <div className="mt-3 text-sm text-[#C3C7CC]">
                model accuracy<sup>1</sup>
              </div>
            </div>

            <div className="ae-lift p-7 rounded-3xl bg-white/5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
              <svg
                aria-hidden="true"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FF6B6F"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" />
              </svg>
              <div
                className="mt-5 font-light text-[60px] leading-none tracking-tight text-white"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                22<span className="text-[30px] text-[#FF6B6F]">+</span>
              </div>
              <div className="mt-3 text-sm text-[#C3C7CC]">languages supported</div>
            </div>

            <div className="ae-lift p-7 rounded-3xl bg-white/5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
              <svg
                aria-hidden="true"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FF6B6F"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M13 2L4 14h7l-1 8 9-12h-7z" />
              </svg>
              <div
                className="mt-5 font-light text-[60px] leading-none tracking-tight text-white"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                40<span className="text-[30px] text-[#FF6B6F]">ms</span>
              </div>
              <div className="mt-3 text-sm text-[#C3C7CC]">inference latency</div>
            </div>
          </div>

          <p className="relative mt-7 text-xs text-[#8D9298]">
            1. Reported accuracy of up to 98.9% in applicable validated model
            evaluations.
          </p>
        </div>
      </section>

      {/* ============ BEYOND STANDARD HEALTHCARE ============ */}
      <section className="ae-rv max-w-[1240px] mx-auto px-6 pt-20 sm:pt-28 flex flex-wrap gap-14 sm:gap-16 items-center">
        {/* Left Telemetry Card Stack */}
        <div
          className="flex-1 basis-[480px] min-w-0 relative rounded-[40px] p-8 sm:p-10 flex flex-col gap-3.5 overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #FFFFFF 0%, #F6E6EA 100%)",
          }}
        >
          {/* Pearl Sphere Decor */}
          <div
            aria-hidden="true"
            className="ae-float-b absolute -right-7 -top-7 w-[140px] h-[140px] rounded-full shadow-[0_30px_60px_rgba(29,31,34,0.12)]"
            style={{
              background:
                "radial-gradient(circle at 32% 28%, #FFFFFF 0%, #F3EEF2 30%, #DCD3DB 75%, #C6BCC6 100%)",
            }}
          />

          <p className="relative m-0 mb-1 text-[13px] text-[#545B61] tracking-wider font-semibold">
            REAL-TIME HEALTH TELEMETRY
          </p>

          {/* Telemetry Item 1: Biomarkers */}
          <div
            className="ae-lift relative p-5 rounded-[22px] bg-white/90 shadow-[0_10px_30px_rgba(29,31,34,0.06)]"
            style={{
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            <div className="flex justify-between items-center gap-3">
              <span className="inline-flex items-center gap-3 font-medium text-[#1D1F22]">
                <span className="w-9 h-9 rounded-xl bg-[#FFE3E1] text-[#C8161F] flex items-center justify-center">
                  <svg
                    aria-hidden="true"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 3v6L4 18a2 2 0 0 0 1.8 3h12.4A2 2 0 0 0 20 18l-5-9V3" />
                    <path d="M8 3h8M7 14h10" />
                  </svg>
                </span>
                Biomarker analysis
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C8161F]">
                <span className="ae-pulse w-1.5 h-1.5 rounded-full bg-[#E3202B]" />
                LIVE
              </span>
            </div>
            <p className="mt-2 mb-3.5 text-sm text-[#545B61]">
              Multi-parameter lab reports and vitals, read for patterns.
            </p>
            {/* Animated Audio / Equalizer Bars */}
            <div
              aria-hidden="true"
              className="flex items-end gap-1 h-9"
            >
              {[
                { bg: "#F3C9CB", delay: "-0.1s" },
                { bg: "#F3C9CB", delay: "-0.6s" },
                { bg: "#EE9EA2", delay: "-0.3s" },
                { bg: "#F3C9CB", delay: "-0.9s" },
                { bg: "#E3202B", delay: "-0.2s" },
                { bg: "#EE9EA2", delay: "-1.1s" },
                { bg: "#F3C9CB", delay: "-0.5s" },
                { bg: "#F3C9CB", delay: "-1.3s" },
                { bg: "#EE9EA2", delay: "-0.7s" },
                { bg: "#F3C9CB", delay: "-0.4s" },
                { bg: "#E3202B", delay: "-1s" },
                { bg: "#F3C9CB", delay: "-0.8s" },
                { bg: "#EE9EA2", delay: "-0.15s" },
                { bg: "#F3C9CB", delay: "-1.2s" },
              ].map((bar, i) => (
                <span
                  key={i}
                  className="ae-eq flex-1 h-full rounded-sm"
                  style={{
                    backgroundColor: bar.bg,
                    animationDelay: bar.delay,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Telemetry Item 2: Diet & Lifestyle Mesh */}
          <div
            className="ae-lift relative p-5 rounded-[22px] bg-white/90 shadow-[0_10px_30px_rgba(29,31,34,0.06)]"
            style={{
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            <div className="flex justify-between items-center gap-3">
              <span className="inline-flex items-center gap-3 font-medium text-[#1D1F22]">
                <span className="w-9 h-9 rounded-xl bg-[#FFF5E6] text-[#9A5A00] flex items-center justify-center">
                  <svg
                    aria-hidden="true"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 21c-4.5 0-8-3.5-8-8h16c0 4.5-3.5 8-8 8z" />
                    <path d="M9 9c0-2 1.5-2 1.5-4M13.5 9c0-2 1.5-2 1.5-4" />
                  </svg>
                </span>
                Diet &amp; lifestyle mesh
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C8161F]">
                <span className="ae-pulse w-1.5 h-1.5 rounded-full bg-[#E3202B]" />
                LIVE
              </span>
            </div>
            <p className="mt-2 m-0 text-sm text-[#545B61]">
              Dietary habits and metabolic windows, calibrated to your routine.
            </p>
          </div>

          {/* Telemetry Item 3: Predictive Insights */}
          <div
            className="ae-lift relative p-5 rounded-[22px] bg-white/90 shadow-[0_10px_30px_rgba(29,31,34,0.06)]"
            style={{
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            <div className="flex justify-between items-center gap-3">
              <span className="inline-flex items-center gap-3 font-medium text-[#1D1F22]">
                <span className="w-9 h-9 rounded-xl bg-[#EEF0FA] text-[#3E4DB8] flex items-center justify-center">
                  <svg
                    aria-hidden="true"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9.5 3a3.5 3.5 0 0 0-3.4 4.3A3.5 3.5 0 0 0 5 13.5 3.5 3.5 0 0 0 9.5 21H12V3z" />
                    <path d="M14.5 3a3.5 3.5 0 0 1 3.4 4.3 3.5 3.5 0 0 1 1.1 6.2 3.5 3.5 0 0 1-4.5 7.5H12" />
                  </svg>
                </span>
                Predictive health insights
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C8161F]">
                <span className="ae-pulse w-1.5 h-1.5 rounded-full bg-[#E3202B]" />
                LIVE
              </span>
            </div>
            <p className="mt-2 m-0 text-sm text-[#545B61]">
              Potential risks identified early, with proactive next steps.
            </p>
          </div>
        </div>

        {/* Right Explanations Checklist */}
        <div className="flex-1 basis-[440px] min-w-0">
          <p className="m-0 mb-4 text-sm text-[#545B61] font-semibold">
            Why we are unique
          </p>
          <h2
            className="m-0 font-light text-[clamp(36px,4vw,54px)] leading-tight tracking-tight text-[#1D1F22]"
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            Beyond standard healthcare.
          </h2>
          <p className="mt-6 text-[17px] leading-relaxed text-[#545B61]">
            Traditional healthcare often tells you what is wrong after a problem
            appears. AETHRIZ understands your health data continuously and turns
            it into simple, personalized actions.
          </p>

          <ul className="mt-9 p-0 list-none flex flex-col gap-4.5 text-base">
            <li className="flex gap-3.5 items-start">
              <span className="flex-none w-9 h-9 rounded-xl bg-white shadow-xs text-[#C8161F] flex items-center justify-center">
                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 16-9 0 12-4 16-9 16z" />
                  <path d="M4 20c4-4 7-6 11-8" />
                </svg>
              </span>
              <span className="pt-1.5 text-[#1D1F22]">
                <span className="font-medium">Your diet, respected</span>{" "}
                <span className="text-[#545B61]">
                  — vegetarian, regional or anything in between.
                </span>
              </span>
            </li>

            <li className="flex gap-3.5 items-start">
              <span className="flex-none w-9 h-9 rounded-xl bg-white shadow-xs text-[#C8161F] flex items-center justify-center">
                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 5h9M8.5 3v2M6 5c1 4 4 7 7 8M11 5c-1 4-4 7-7 8" />
                  <path d="M13 21l4-10 4 10M14.5 17h5" />
                </svg>
              </span>
              <span className="pt-1.5 text-[#1D1F22]">
                <span className="font-medium">Your language</span>{" "}
                <span className="text-[#545B61]">
                  — insights explained the way you speak.
                </span>
              </span>
            </li>

            <li className="flex gap-3.5 items-start">
              <span className="flex-none w-9 h-9 rounded-xl bg-white shadow-xs text-[#C8161F] flex items-center justify-center">
                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
                  <circle cx="12" cy="9.5" r="2.5" />
                </svg>
              </span>
              <span className="pt-1.5 text-[#1D1F22]">
                <span className="font-medium">City or village</span>{" "}
                <span className="text-[#545B61]">
                  — designed to adapt around every community.
                </span>
              </span>
            </li>

            <li className="flex gap-3.5 items-start">
              <span className="flex-none w-9 h-9 rounded-xl bg-white shadow-xs text-[#C8161F] flex items-center justify-center">
                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12a9 9 0 1 1-3-6.7" />
                  <path d="M21 4v5h-5" />
                </svg>
              </span>
              <span className="pt-1.5 text-[#1D1F22]">
                <span className="font-medium">Always evolving</span>{" "}
                <span className="text-[#545B61]">
                  — recommendations change as you do.
                </span>
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* ============ CLEAR INSIGHTS (4 3D Glass Cards) ============ */}
      <section className="ae-rv max-w-[1240px] mx-auto px-6 pt-20 sm:pt-28">
        <div className="rounded-[40px] bg-[#E4E9EF] p-8 sm:p-14 lg:p-20">
          <div className="flex flex-wrap justify-between items-end gap-6">
            <h2
              className="m-0 max-w-[560px] font-light text-[clamp(36px,4vw,54px)] leading-tight tracking-tight text-[#1D1F22]"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              No jargon.
              <br />
              Just clarity you can act on.
            </h2>
            <p className="m-0 max-w-[400px] text-base text-[#545B61]">
              AETHRIZ translates complex medical data into simple, understandable
              insights — colour-coded so you know what matters at a glance.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Elevated */}
            <div className="ae-lift bg-white rounded-[28px] p-5 flex flex-col gap-5 shadow-xs">
              <div
                aria-hidden="true"
                className="relative h-[200px] rounded-[20px] flex items-center justify-center overflow-hidden"
                style={{
                  background:
                    "radial-gradient(circle at 50% 42%, #FFFFFF 0%, #FFEDEB 55%, #FFDCD8 100%)",
                }}
              >
                <div
                  className="ae-float-b absolute right-8 top-6 w-[72px] h-[72px] rounded-full shadow-[0_18px_30px_rgba(181,17,26,0.28)]"
                  style={{
                    background:
                      "radial-gradient(circle at 32% 26%, #FFC2C0 0%, #F2343C 30%, #B5111A 70%, #6E0A10 100%)",
                  }}
                />
                <div
                  className="absolute bottom-8 w-[100px] h-3.5 rounded-full"
                  style={{
                    background:
                      "radial-gradient(ellipse, rgba(140,10,20,0.22), rgba(140,10,20,0) 70%)",
                  }}
                />
                <div
                  className="ae-float relative w-[108px] h-[108px] rounded-[32px] shadow-[0_22px_40px_rgba(181,17,26,0.16),inset_0_1px_0_#FFFFFF,inset_0_0_0_1px_rgba(255,255,255,0.7)] flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(255,255,255,0.88), rgba(255,255,255,0.45))",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                  }}
                >
                  <svg width="60" height="60" viewBox="0 0 56 56">
                    <defs>
                      <linearGradient id="ae-gE" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#FF8A8E" />
                        <stop offset="1" stopColor="#C8161F" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M28 48C10.5 36.5 6 27.5 6 20a11 11 0 0 1 22-3.2A11 11 0 0 1 50 20c0 7.5-4.5 16.5-22 28z"
                      fill="url(#ae-gE)"
                    />
                    <ellipse
                      cx="17"
                      cy="16"
                      rx="6"
                      ry="3.5"
                      fill="#FFFFFF"
                      opacity="0.45"
                      transform="rotate(-30 17 16)"
                    />
                    <path
                      d="M11 27h8l3-6 5 12 4-9 3 3h11"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div
                  className="ae-float-c absolute left-4 bottom-4 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/90 shadow-[0_6px_16px_rgba(29,31,34,0.08)] text-xs text-[#32363A]"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#C8161F"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 19V5M6 11l6-6 6 6" />
                  </svg>
                  LDL · 142 mg/dL
                </div>
              </div>
              <div className="px-1.5 pb-1.5">
                <div
                  className="flex items-center gap-2 text-[21px] tracking-tight font-medium text-[#1D1F22]"
                  style={{ fontFamily: "'Inter Tight', sans-serif" }}
                >
                  <span className="w-2 h-2 rounded-full bg-[#E3202B]" />
                  Elevated
                </div>
                <div className="text-sm text-[#545B61] mt-1">
                  Values outside range, with clear next steps.
                </div>
              </div>
            </div>

            {/* Card 2: Borderline */}
            <div className="ae-lift bg-white rounded-[28px] p-5 flex flex-col gap-5 shadow-xs">
              <div
                aria-hidden="true"
                className="relative h-[200px] rounded-[20px] flex items-center justify-center overflow-hidden"
                style={{
                  background:
                    "radial-gradient(circle at 50% 42%, #FFFFFF 0%, #FFF4E2 55%, #FFE8C7 100%)",
                }}
              >
                <div
                  className="ae-float-b absolute right-8 top-6 w-[72px] h-[72px] rounded-full shadow-[0_18px_30px_rgba(150,90,0,0.26)]"
                  style={{
                    background:
                      "radial-gradient(circle at 32% 26%, #FFE6B8 0%, #F3A93A 32%, #B86A00 72%, #6E3F00 100%)",
                    animationDelay: "-3s",
                  }}
                />
                <div
                  className="absolute bottom-8 w-[100px] h-3.5 rounded-full"
                  style={{
                    background:
                      "radial-gradient(ellipse, rgba(120,70,0,0.2), rgba(120,70,0,0) 70%)",
                  }}
                />
                <div
                  className="ae-float relative w-[108px] h-[108px] rounded-[32px] shadow-[0_22px_40px_rgba(150,90,0,0.16),inset_0_1px_0_#FFFFFF,inset_0_0_0_1px_rgba(255,255,255,0.7)] flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(255,255,255,0.88), rgba(255,255,255,0.45))",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    animationDelay: "-1s",
                  }}
                >
                  <svg width="60" height="60" viewBox="0 0 56 56">
                    <defs>
                      <linearGradient id="ae-gB" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#FFD98A" />
                        <stop offset="1" stopColor="#E0851A" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M28 6c2.1 0 3.6 1.1 4.6 2.9l17.3 30.6c2 3.6-.5 8.5-4.7 8.5H10.8c-4.2 0-6.7-4.9-4.7-8.5L23.4 8.9C24.4 7.1 25.9 6 28 6z"
                      fill="url(#ae-gB)"
                    />
                    <ellipse
                      cx="22"
                      cy="18"
                      rx="5"
                      ry="2.6"
                      fill="#FFFFFF"
                      opacity="0.5"
                      transform="rotate(-58 22 18)"
                    />
                    <path
                      d="M28 20v12"
                      stroke="#FFFFFF"
                      strokeWidth="4.2"
                      strokeLinecap="round"
                    />
                    <circle cx="28" cy="39.5" r="2.6" fill="#FFFFFF" />
                  </svg>
                </div>
                <div
                  className="ae-float-c absolute left-4 bottom-4 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/90 shadow-[0_6px_16px_rgba(29,31,34,0.08)] text-xs text-[#32363A]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E89A2C]" />
                  HbA1c · 6.1%
                </div>
              </div>
              <div className="px-1.5 pb-1.5">
                <div
                  className="flex items-center gap-2 text-[21px] tracking-tight font-medium text-[#1D1F22]"
                  style={{ fontFamily: "'Inter Tight', sans-serif" }}
                >
                  <span className="w-2 h-2 rounded-full bg-[#E89A2C]" />
                  Borderline
                </div>
                <div className="text-sm text-[#545B61] mt-1">
                  Early signals, caught before they grow.
                </div>
              </div>
            </div>

            {/* Card 3: Pattern */}
            <div className="ae-lift bg-white rounded-[28px] p-5 flex flex-col gap-5 shadow-xs">
              <div
                aria-hidden="true"
                className="relative h-[200px] rounded-[20px] flex items-center justify-center overflow-hidden"
                style={{
                  background:
                    "radial-gradient(circle at 50% 42%, #FFFFFF 0%, #EEF0FC 55%, #DFE3F8 100%)",
                }}
              >
                <div
                  className="ae-float-b absolute right-8 top-6 w-[72px] h-[72px] rounded-full shadow-[0_18px_30px_rgba(40,50,140,0.26)]"
                  style={{
                    background:
                      "radial-gradient(circle at 32% 26%, #D2D8FF 0%, #6A79E6 32%, #2F3DA8 72%, #1A2270 100%)",
                    animationDelay: "-1.5s",
                  }}
                />
                <div
                  className="absolute bottom-8 w-[100px] h-3.5 rounded-full"
                  style={{
                    background:
                      "radial-gradient(ellipse, rgba(40,50,140,0.2), rgba(40,50,140,0) 70%)",
                  }}
                />
                <div
                  className="ae-float relative w-[108px] h-[108px] rounded-[32px] shadow-[0_22px_40px_rgba(40,50,140,0.16),inset_0_1px_0_#FFFFFF,inset_0_0_0_1px_rgba(255,255,255,0.7)] flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(255,255,255,0.88), rgba(255,255,255,0.45))",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    animationDelay: "-2.5s",
                  }}
                >
                  <svg width="60" height="60" viewBox="0 0 56 56">
                    <defs>
                      <linearGradient id="ae-gP" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#A9B4FF" />
                        <stop offset="1" stopColor="#3E4DB8" />
                      </linearGradient>
                    </defs>
                    <rect
                      x="7"
                      y="32"
                      width="10"
                      height="17"
                      rx="3.5"
                      fill="url(#ae-gP)"
                      opacity="0.55"
                    />
                    <rect
                      x="23"
                      y="23"
                      width="10"
                      height="26"
                      rx="3.5"
                      fill="url(#ae-gP)"
                      opacity="0.75"
                    />
                    <rect
                      x="39"
                      y="13"
                      width="10"
                      height="36"
                      rx="3.5"
                      fill="url(#ae-gP)"
                    />
                    <path
                      d="M12 24L28 15l16-9"
                      fill="none"
                      stroke="#1F2A80"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="24"
                      r="3.4"
                      fill="#FFFFFF"
                      stroke="#1F2A80"
                      strokeWidth="2.2"
                    />
                    <circle
                      cx="28"
                      cy="15"
                      r="3.4"
                      fill="#FFFFFF"
                      stroke="#1F2A80"
                      strokeWidth="2.2"
                    />
                    <circle
                      cx="44"
                      cy="6"
                      r="3.4"
                      fill="#FFFFFF"
                      stroke="#1F2A80"
                      strokeWidth="2.2"
                    />
                  </svg>
                </div>
                <div
                  className="ae-float-c absolute left-4 bottom-4 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/90 shadow-[0_6px_16px_rgba(29,31,34,0.08)] text-xs text-[#32363A]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5B6BD6]" />
                  Trend across 3 reports
                </div>
              </div>
              <div className="px-1.5 pb-1.5">
                <div
                  className="flex items-center gap-2 text-[21px] tracking-tight font-medium text-[#1D1F22]"
                  style={{ fontFamily: "'Inter Tight', sans-serif" }}
                >
                  <span className="w-2 h-2 rounded-full bg-[#5B6BD6]" />
                  Pattern
                </div>
                <div className="text-sm text-[#545B61] mt-1">
                  Shifts across reports, linked to lifestyle.
                </div>
              </div>
            </div>

            {/* Card 4: Balanced */}
            <div className="ae-lift bg-white rounded-[28px] p-5 flex flex-col gap-5 shadow-xs">
              <div
                aria-hidden="true"
                className="relative h-[200px] rounded-[20px] flex items-center justify-center overflow-hidden"
                style={{
                  background:
                    "radial-gradient(circle at 50% 42%, #FFFFFF 0%, #E8F6EE 55%, #D3EEDF 100%)",
                }}
              >
                <div
                  className="ae-float-b absolute right-8 top-6 w-[72px] h-[72px] rounded-full shadow-[0_18px_30px_rgba(20,90,50,0.26)]"
                  style={{
                    background:
                      "radial-gradient(circle at 32% 26%, #C9F2DA 0%, #4CBC80 32%, #1E7A4C 72%, #0F4A2C 100%)",
                    animationDelay: "-4.5s",
                  }}
                />
                <div
                  className="absolute bottom-8 w-[100px] h-3.5 rounded-full"
                  style={{
                    background:
                      "radial-gradient(ellipse, rgba(20,90,50,0.2), rgba(20,90,50,0) 70%)",
                  }}
                />
                <div
                  className="ae-float relative w-[108px] h-[108px] rounded-[32px] shadow-[0_22px_40px_rgba(20,90,50,0.16),inset_0_1px_0_#FFFFFF,inset_0_0_0_1px_rgba(255,255,255,0.7)] flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(255,255,255,0.88), rgba(255,255,255,0.45))",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    animationDelay: "-3.5s",
                  }}
                >
                  <svg width="60" height="60" viewBox="0 0 56 56">
                    <defs>
                      <linearGradient id="ae-gG" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#8BE6B4" />
                        <stop offset="1" stopColor="#1E7A4C" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M28 5l19 6.5V26c0 11.5-8 20-19 24.5C17 46 9 37.5 9 26V11.5z"
                      fill="url(#ae-gG)"
                    />
                    <ellipse
                      cx="19"
                      cy="15"
                      rx="5"
                      ry="2.6"
                      fill="#FFFFFF"
                      opacity="0.5"
                      transform="rotate(-20 19 15)"
                    />
                    <path
                      d="M19 27.5l6 6 12.5-13"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div
                  className="ae-float-c absolute left-4 bottom-4 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/90 shadow-[0_6px_16px_rgba(29,31,34,0.08)] text-xs text-[#32363A]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3FA36E]" />
                  TSH · 2.1 in range
                </div>
              </div>
              <div className="px-1.5 pb-1.5">
                <div
                  className="flex items-center gap-2 text-[21px] tracking-tight font-medium text-[#1D1F22]"
                  style={{ fontFamily: "'Inter Tight', sans-serif" }}
                >
                  <span className="w-2 h-2 rounded-full bg-[#3FA36E]" />
                  Balanced
                </div>
                <div className="text-sm text-[#545B61] mt-1">
                  What is working, so you can keep it up.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section
        id="how"
        className="ae-rv max-w-[1240px] mx-auto px-6 pt-20 sm:pt-28"
      >
        <div className="text-center">
          <p className="m-0 mb-4 text-sm text-[#545B61] font-semibold">
            How AETHRIZ works
          </p>
          <h2
            className="m-0 font-light text-[clamp(36px,4.4vw,58px)] leading-tight tracking-tight text-[#1D1F22]"
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            From health data to health action.
          </h2>
          <p className="mt-4 mx-auto max-w-[560px] text-[17px] text-[#545B61]">
            A seamless progression that turns complex medical data into practical,
            everyday guidance.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              num: "01",
              title: "Scan",
              desc: "Upload or scan your health reports. We structure them so AI can understand.",
              renderIcon: (isActive: boolean) => (
                <div className="relative flex items-center justify-center">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={isActive ? "#FFFFFF" : "#1D1F22"}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                    <path d="M14 3v5h5" />
                  </svg>
                  <span
                    className="ae-scan absolute left-0 right-0 top-[13px] h-0.5 rounded-full"
                    style={{
                      backgroundColor: isActive ? "#FF6B6F" : "#E3202B",
                      boxShadow: isActive
                        ? "0 0 10px rgba(255,107,111,0.9)"
                        : "0 0 8px rgba(227,32,43,0.7)",
                    }}
                  />
                </div>
              ),
            },
            {
              num: "02",
              title: "Analyze",
              desc: "Deep-learning models process parameters, patterns, lifestyle and diet.",
              renderIcon: (isActive: boolean) => (
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect
                    x="6"
                    y="6"
                    width="12"
                    height="12"
                    rx="2"
                    stroke={isActive ? "#FFFFFF" : "#1D1F22"}
                  />
                  <rect
                    x="9.5"
                    y="9.5"
                    width="5"
                    height="5"
                    rx="1"
                    stroke={isActive ? "#FF6B6F" : "#E3202B"}
                  />
                  <path
                    d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"
                    stroke={isActive ? "#FFFFFF" : "#1D1F22"}
                  />
                </svg>
              ),
            },
            {
              num: "03",
              title: "Interpret",
              desc: "Complex data becomes simple insight. No confusing medical jargon.",
              renderIcon: (isActive: boolean) => (
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    d="M9 18h6M10 21h4"
                    stroke={isActive ? "#FFFFFF" : "#1D1F22"}
                  />
                  <path
                    d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"
                    stroke={isActive ? "#FFFFFF" : "#1D1F22"}
                  />
                  <path
                    d="M12 7v3l2 1"
                    stroke={isActive ? "#FF6B6F" : "#E3202B"}
                  />
                </svg>
              ),
            },
            {
              num: "04",
              title: "Personalize",
              desc: "Recommendations for your profile, food habits, age and needs — not an average person.",
              renderIcon: (isActive: boolean) => (
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"
                    stroke={isActive ? "#FFFFFF" : "#1D1F22"}
                  />
                  <circle
                    cx="16"
                    cy="6"
                    r="2"
                    stroke={isActive ? "#FF6B6F" : "#E3202B"}
                  />
                  <circle
                    cx="10"
                    cy="12"
                    r="2"
                    stroke={isActive ? "#FF6B6F" : "#E3202B"}
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="2"
                    stroke={isActive ? "#FF6B6F" : "#E3202B"}
                  />
                </svg>
              ),
            },
            {
              num: "05",
              title: "Guide",
              desc: "Better everyday decisions on nutrition, lifestyle and preventive health.",
              renderIcon: (isActive: boolean) => (
                <svg
                  className="ae-spin"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke={isActive ? "#FFFFFF" : "#1D1F22"}
                  />
                  <path
                    d="M15.5 8.5l-2 5-5 2 2-5z"
                    stroke={isActive ? "#FF6B6F" : "#E3202B"}
                  />
                </svg>
              ),
            },
          ].map((step, idx) => {
            const isActive =
              hoveredStep !== null ? hoveredStep === idx : activeStep === idx;
            return (
              <div
                key={step.num}
                onMouseEnter={() => setHoveredStep(idx)}
                onMouseLeave={() => setHoveredStep(null)}
                onClick={() => setActiveStep(idx)}
                className={`ae-lift relative overflow-hidden rounded-[28px] p-7 min-h-[320px] flex flex-col justify-between cursor-pointer transition-all duration-300 ${
                  isActive
                    ? "text-white shadow-2xl -translate-y-2.5 scale-[1.02] border border-white/10"
                    : "bg-white text-[#1D1F22] shadow-xs hover:shadow-lg hover:-translate-y-1 border border-slate-100"
                }`}
                style={
                  isActive
                    ? {
                        background:
                          "linear-gradient(145deg, #18191E 0%, #101115 60%, #1A0D12 100%)",
                        boxShadow:
                          "0 24px 50px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
                      }
                    : undefined
                }
              >
                {/* Ambient Red Glow on Active Card */}
                {isActive && (
                  <div
                    aria-hidden="true"
                    className="ae-glow absolute -right-12 -bottom-12 w-[220px] h-[220px] rounded-full pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(227,32,43,0.45), rgba(227,32,43,0) 65%)",
                    }}
                  />
                )}

                <div className="relative flex justify-between items-start">
                  <div
                    aria-hidden="true"
                    className={`w-15 h-15 rounded-[18px] flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-br from-[#3A3C42] to-[#1A1B1E] shadow-[0_12px_24px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.12)]"
                        : "bg-gradient-to-br from-white to-[#E9EDF2] shadow-[0_12px_24px_rgba(29,31,34,0.08),inset_0_1px_0_#FFFFFF,inset_0_-3px_6px_rgba(29,31,34,0.05)]"
                    }`}
                  >
                    {step.renderIcon(isActive)}
                  </div>
                  <span
                    className={`font-mono text-[13px] font-bold transition-colors duration-300 ${
                      isActive ? "text-[#FF6B6F]" : "text-[#C8161F]"
                    }`}
                  >
                    {step.num}
                  </span>
                </div>

                <div className="relative">
                  <h3
                    className={`m-0 mb-2.5 font-normal text-2xl tracking-tight transition-colors duration-300 ${
                      isActive ? "text-white" : "text-[#1D1F22]"
                    }`}
                    style={{ fontFamily: "'Inter Tight', sans-serif" }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`m-0 text-[15px] leading-normal transition-colors duration-300 ${
                      isActive ? "text-[#C3C7CC]" : "text-[#545B61]"
                    }`}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============ MISSION & VISION FOR BHARAT ============ */}
      <section
        id="mission"
        className="ae-rv max-w-[1240px] mx-auto px-6 pt-20 sm:pt-28"
      >
        <p className="m-0 mb-4 text-sm text-[#545B61] font-semibold">Purpose</p>
        <h2
          className="m-0 mb-12 font-light text-[clamp(36px,4.4vw,58px)] leading-tight tracking-tight text-[#1D1F22]"
          style={{ fontFamily: "'Inter Tight', sans-serif" }}
        >
          Mission &amp; vision for Bharat.
        </h2>

        <div className="flex flex-wrap gap-4">
          {/* Mission Card */}
          <div
            className="ae-lift relative overflow-hidden flex-1 basis-[440px] min-w-0 rounded-[40px] p-9 sm:p-14 min-h-[420px] flex flex-col justify-between gap-10 shadow-xs"
            style={{
              background:
                "linear-gradient(150deg, #FFE1DE 0%, #F7E6EE 100%)",
            }}
          >
            <div
              aria-hidden="true"
              className="absolute right-10 top-10 w-[150px] h-[150px] [perspective:500px]"
            >
              <div className="ae-ring absolute -inset-5 rounded-full border border-[#C8161F]/30" />
              <div
                className="ae-float absolute inset-5 rounded-full shadow-[0_30px_50px_rgba(181,17,26,0.3),inset_-8px_-10px_18px_rgba(0,0,0,0.2)]"
                style={{
                  background:
                    "radial-gradient(circle at 32% 26%, #FFC2C0 0%, #F2343C 30%, #B5111A 70%, #6E0A10 100%)",
                }}
              />
            </div>
            <span className="relative inline-flex items-center gap-2 font-mono text-[13px] text-[#C8161F] font-semibold">
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="12" cy="12" r="1" />
              </svg>
              OUR MISSION
            </span>
            <div className="relative">
              <h3
                className="m-0 mb-4 font-normal text-4xl tracking-tight text-[#1D1F22]"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                A healthier Bharat.
              </h3>
              <p className="m-0 text-[17px] text-[#32363A] leading-relaxed">
                To make intelligent, personalized and understandable healthcare
                accessible to every person in Bharat — using AI and deep learning to
                turn health data into better everyday decisions.
              </p>
            </div>
          </div>

          {/* Vision Card */}
          <div className="ae-lift relative overflow-hidden flex-1 basis-[440px] min-w-0 rounded-[40px] p-9 sm:p-14 bg-white min-h-[420px] flex flex-col justify-between gap-10 shadow-xs">
            <div
              aria-hidden="true"
              className="absolute right-10 top-10 w-[150px] h-[150px] [perspective:500px]"
            >
              <div className="ae-ring2 absolute -inset-5 rounded-full border border-dashed border-[#1D1F22]/25" />
              <div
                className="ae-float-b absolute inset-5 rounded-full shadow-[0_30px_50px_rgba(0,0,0,0.25)]"
                style={{
                  background:
                    "radial-gradient(circle at 32% 26%, #8A8D93 0%, #2A2C30 34%, #0E0F11 80%)",
                }}
              />
              <div
                className="ae-float-c absolute right-0 bottom-1.5 w-[30px] h-[30px] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 32% 28%, #FFB0AE, #E3202B 45%, #8E0C14)",
                }}
              />
            </div>
            <span className="relative inline-flex items-center gap-2 font-mono text-[13px] text-[#545B61] font-semibold">
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              OUR VISION
            </span>
            <div className="relative">
              <h3
                className="m-0 mb-4 font-normal text-4xl tracking-tight text-[#1D1F22]"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                Powered by intelligence.
              </h3>
              <p className="m-0 text-[17px] text-[#32363A] leading-relaxed">
                A future where everyone understands their health and acts before small
                problems become big ones — where technology does not replace human
                care, it makes better care more accessible, personal and proactive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ ACCORDION ============ */}
      <section
        id="faq"
        className="ae-rv max-w-[880px] mx-auto px-6 pt-20 sm:pt-28"
      >
        <h2
          className="m-0 mb-10 text-center font-light text-[clamp(36px,4.4vw,58px)] tracking-tight text-[#1D1F22]"
          style={{ fontFamily: "'Inter Tight', sans-serif" }}
        >
          FAQ
        </h2>

        <div className="flex flex-col gap-2.5">
          {/* FAQ 1 */}
          <details
            open
            className="bg-white rounded-[22px] px-6 sm:px-7 shadow-xs group"
          >
            <summary className="flex justify-between items-center gap-4 min-h-[76px] text-lg font-medium text-[#1D1F22]">
              What is AETHRIZ?
              <span
                className="faq-plus flex-none w-9 h-9 rounded-full bg-[#F1F5F9] flex items-center justify-center transition-all duration-300"
                aria-hidden="true"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </summary>
            <p className="m-0 pb-6 pr-12 text-[#545B61] leading-relaxed">
              An AI-powered health intelligence platform that analyzes health data
              and provides personalized diet, lifestyle and health insights based on
              your unique profile.
            </p>
          </details>

          {/* FAQ 2 */}
          <details className="bg-white rounded-[22px] px-6 sm:px-7 shadow-xs group">
            <summary className="flex justify-between items-center gap-4 min-h-[76px] text-lg font-medium text-[#1D1F22]">
              What health data can AETHRIZ analyze?
              <span
                className="faq-plus flex-none w-9 h-9 rounded-full bg-[#F1F5F9] flex items-center justify-center transition-all duration-300"
                aria-hidden="true"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </summary>
            <p className="m-0 pb-6 pr-12 text-[#545B61] leading-relaxed">
              Laboratory reports, health parameters, dietary habits, lifestyle
              information and other available health data — combined into one
              personalized health profile.
            </p>
          </details>

          {/* FAQ 3 */}
          <details className="bg-white rounded-[22px] px-6 sm:px-7 shadow-xs group">
            <summary className="flex justify-between items-center gap-4 min-h-[76px] text-lg font-medium text-[#1D1F22]">
              How is AETHRIZ different from normal health apps?
              <span
                className="faq-plus flex-none w-9 h-9 rounded-full bg-[#F1F5F9] flex items-center justify-center transition-all duration-300"
                aria-hidden="true"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </summary>
            <p className="m-0 pb-6 pr-12 text-[#545B61] leading-relaxed">
              Most apps give general advice. AETHRIZ connects your health data with
              your lifestyle and diet to generate recommendations specifically for
              you.
            </p>
          </details>

          {/* FAQ 4 */}
          <details className="bg-white rounded-[22px] px-6 sm:px-7 shadow-xs group">
            <summary className="flex justify-between items-center gap-4 min-h-[76px] text-lg font-medium text-[#1D1F22]">
              Does AETHRIZ replace a doctor?
              <span
                className="faq-plus flex-none w-9 h-9 rounded-full bg-[#F1F5F9] flex items-center justify-center transition-all duration-300"
                aria-hidden="true"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </summary>
            <p className="m-0 pb-6 pr-12 text-[#545B61] leading-relaxed">
              No. AETHRIZ supports health awareness and informed decisions. It does
              not replace qualified medical professionals, diagnosis or emergency
              care.
            </p>
          </details>

          {/* FAQ 5 */}
          <details className="bg-white rounded-[22px] px-6 sm:px-7 shadow-xs group">
            <summary className="flex justify-between items-center gap-4 min-h-[76px] text-lg font-medium text-[#1D1F22]">
              Does it work for different diets, languages, ages and lifestyles?
              <span
                className="faq-plus flex-none w-9 h-9 rounded-full bg-[#F1F5F9] flex items-center justify-center transition-all duration-300"
                aria-hidden="true"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </summary>
            <p className="m-0 pb-6 pr-12 text-[#545B61] leading-relaxed">
              Yes. Its intelligence layer adapts recommendations to your health data,
              dietary preferences, lifestyle, language and context.
            </p>
          </details>
        </div>
      </section>

      {/* ============ EARLY ACCESS PRE-REGISTRATION FORM ============ */}
      <section
        id="register"
        className="ae-rv max-w-[1240px] mx-auto px-6 pt-20 sm:pt-28"
      >
        <div
          id="contact"
          className="relative overflow-hidden rounded-[40px] bg-white p-8 sm:p-14 lg:p-20 shadow-xs"
        >
          {/* Subtle Ambient Radial Glow */}
          <div
            aria-hidden="true"
            className="ae-glow absolute left-1/2 -top-[260px] w-[760px] h-[540px] -ml-[380px] rounded-full"
            style={{
              background:
                "radial-gradient(ellipse, rgba(255,211,207,0.85) 0%, rgba(247,224,234,0.45) 40%, rgba(255,255,255,0) 70%)",
            }}
          />

          {/* Floating Spheres */}
          <div
            aria-hidden="true"
            className="ae-float-b absolute left-[8%] top-[120px] w-16 h-16 rounded-full shadow-[0_24px_40px_rgba(181,17,26,0.28)]"
            style={{
              background:
                "radial-gradient(circle at 32% 26%, #FFC2C0 0%, #F2343C 30%, #B5111A 70%, #6E0A10 100%)",
            }}
          />
          <div
            aria-hidden="true"
            className="ae-float-c absolute right-[9%] top-20 w-11 h-11 rounded-full shadow-[0_20px_34px_rgba(0,0,0,0.22)]"
            style={{
              background:
                "radial-gradient(circle at 32% 28%, #8A8D93 0%, #2A2C30 34%, #0E0F11 80%)",
            }}
          />
          <div
            aria-hidden="true"
            className="ae-float absolute right-[16%] top-[230px] w-6 h-6 rounded-full shadow-[0_10px_18px_rgba(0,0,0,0.12)]"
            style={{
              background:
                "radial-gradient(circle at 32% 28%, #FFFFFF 0%, #E2DDE3 50%, #B5ADB7 100%)",
            }}
          />

          {/* Header Title & Emblem */}
          <div className="relative text-center max-w-[640px] mx-auto">
            <div className="ae-float inline-block w-18 h-18 rounded-[20px] overflow-hidden shadow-[0_20px_40px_rgba(29,31,34,0.14)]">
              <Image
                src="/brand/aethriz-hero-logo.png"
                alt="AETHRIZ"
                width={72}
                height={72}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mt-6 mb-3.5 text-sm text-[#545B61] font-semibold tracking-wide">
              AETHRIZ® Early Access
            </p>
            <h2
              className="m-0 font-light text-[clamp(38px,4.6vw,62px)] leading-[1.02] tracking-tight text-[#1D1F22]"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              Join the future of
              <br />
              health intelligence.
            </h2>
            <p className="mt-5 text-[17px] text-[#545B61]">
              Be among the first to experience AI-powered personalized health
              guidance. Pre-register for exclusive early access — or send us a
              message.
            </p>
          </div>

          {/* Form */}
          {formSubmitted ? (
            <div className="relative mt-12 max-w-[560px] mx-auto p-8 rounded-3xl bg-[#EAF6EF] border border-[#A7E2C0] text-center animate-in fade-in duration-300">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#1E7A4C] text-white flex items-center justify-center mb-4 shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h3 className="text-2xl font-medium text-[#1E7A4C] mb-2" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
                Pre-Registration Received!
              </h3>
              <p className="text-[#32363A] text-[15px] leading-relaxed">
                Thank you for joining our exclusive early access circle. Our clinical and engineering team will contact you with your personalized invite.
              </p>
              <button
                type="button"
                onClick={() => setFormSubmitted(false)}
                className="mt-6 px-6 py-2 rounded-full bg-white text-[#1E7A4C] font-medium text-sm shadow-xs border border-[#A7E2C0]"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleFormSubmit}
              className="relative mt-12 max-w-[680px] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <label className="flex flex-col gap-2 text-sm text-[#32363A] font-medium">
                Full name
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Dr. Rajesh Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  autoComplete="name"
                  className="h-[52px] px-4.5 rounded-2xl border border-[#DCE2E8] bg-[#F7F9FB] text-[#1D1F22] text-base focus:outline-none focus:border-[#C8161F] focus:bg-white transition-colors"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-[#32363A] font-medium">
                Email address
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@organization.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  autoComplete="email"
                  className="h-[52px] px-4.5 rounded-2xl border border-[#DCE2E8] bg-[#F7F9FB] text-[#1D1F22] text-base focus:outline-none focus:border-[#C8161F] focus:bg-white transition-colors"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-[#32363A] font-medium">
                Phone number
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  autoComplete="tel"
                  className="h-[52px] px-4.5 rounded-2xl border border-[#DCE2E8] bg-[#F7F9FB] text-[#1D1F22] text-base focus:outline-none focus:border-[#C8161F] focus:bg-white transition-colors"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-[#32363A] font-medium">
                Preferred language
                <select
                  name="language"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="h-[52px] px-3.5 rounded-2xl border border-[#DCE2E8] bg-[#F7F9FB] text-[#1D1F22] text-base focus:outline-none focus:border-[#C8161F] focus:bg-white transition-colors cursor-pointer"
                >
                  <option value="English">English</option>
                  <option value="हिन्दी">हिन्दी (Hindi)</option>
                  <option value="বাংলা">বাংলা (Bengali)</option>
                  <option value="తెలుగు">తెలుగు (Telugu)</option>
                  <option value="मराठी">मराठी (Marathi)</option>
                  <option value="தமிழ்">தமிழ் (Tamil)</option>
                  <option value="Other">Other / Regional</option>
                </select>
              </label>

              <label className="sm:col-span-2 flex flex-col gap-2 text-sm text-[#32363A] font-medium">
                Message (optional)
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Tell us about your healthcare needs or clinical practice..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="p-4 rounded-2xl border border-[#DCE2E8] bg-[#F7F9FB] text-[#1D1F22] text-base focus:outline-none focus:border-[#C8161F] focus:bg-white transition-colors resize-y"
                />
              </label>

              <label className="sm:col-span-2 flex gap-3 items-start text-[13px] text-[#545B61] cursor-pointer">
                <input
                  type="checkbox"
                  name="updates"
                  checked={formData.updates}
                  onChange={(e) => setFormData({ ...formData, updates: e.target.checked })}
                  className="mt-0.5 w-4.5 h-4.5 accent-[#C8161F]"
                />
                Send me early-access updates from AETHRIZ by email or SMS. You can
                unsubscribe at any time.
              </label>

              <div className="sm:col-span-2 flex justify-center mt-2">
                <button
                  type="submit"
                  className="ae-btn ae-btn-dark inline-flex items-center gap-2.5 min-h-[54px] px-9 rounded-full bg-[#1D1F22] text-white text-base font-medium cursor-pointer shadow-[0_12px_30px_rgba(29,31,34,0.18)]"
                >
                  Pre-register
                  <svg
                    aria-hidden="true"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="relative overflow-hidden w-full mt-24 sm:mt-36 bg-[#F1F5F9]">
        {/* Soft Radial Ambient */}
        <div
          aria-hidden="true"
          className="ae-glow absolute left-1/2 -top-[220px] w-[900px] h-[620px] -ml-[450px] rounded-full filter blur-[10px]"
          style={{
            background:
              "radial-gradient(ellipse, rgba(255,211,207,0.55) 0%, rgba(233,228,245,0.4) 38%, rgba(241,245,249,0) 68%)",
          }}
        />

        <div className="relative max-w-[1240px] mx-auto px-6 pt-24 sm:pt-36 text-center">
          <h2
            className="m-0 font-normal text-[clamp(44px,7vw,104px)] leading-none tracking-tight text-[#1D1F22]"
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            Understand what matters
          </h2>

          <div className="mt-11 flex justify-center">
            <Link
              href="#register"
              className="ae-btn ae-btn-dark inline-flex items-center min-h-[60px] px-9 rounded-full text-white text-lg font-medium tracking-tight shadow-[0_14px_30px_rgba(14,15,17,0.22),inset_0_1px_0_rgba(255,255,255,0.14)]"
              style={{
                background: "linear-gradient(180deg, #32363A 0%, #1D1F22 100%)",
                fontFamily: "'Inter Tight', sans-serif",
              }}
            >
              Pre-register for early access
            </Link>
          </div>

          <nav
            aria-label="Social"
            className="mt-16 sm:mt-24 flex flex-wrap justify-center gap-x-12 sm:gap-x-20 gap-y-4 text-lg font-medium tracking-tight text-[#0E0F11]"
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 decoration-[1.5px] hover:text-[#C8161F] transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 decoration-[1.5px] hover:text-[#C8161F] transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 decoration-[1.5px] hover:text-[#C8161F] transition-colors"
            >
              YouTube
            </a>
            <a
              href="mailto:contact@aethriz.com"
              className="underline underline-offset-4 decoration-[1.5px] hover:text-[#C8161F] transition-colors"
            >
              Email
            </a>
          </nav>

          <div className="mt-10 flex flex-wrap justify-center gap-x-7 gap-y-2 text-[13px] text-[#6B7178]">
            <span>© 2026 AETHRIZ AI Healthcare And Advanced Research Private Limited</span>
            <Link href="#top" className="hover:text-[#1D1F22] transition-colors">
              Privacy
            </Link>
            <Link href="#top" className="hover:text-[#1D1F22] transition-colors">
              Terms
            </Link>
            <span>Supports health awareness — does not replace qualified medical care.</span>
          </div>
        </div>

        {/* Giant Watermark Typography with Red Dot */}
        <div
          aria-hidden="true"
          className="relative mt-12 sm:mt-20 pb-12 sm:pb-20 text-center whitespace-nowrap font-semibold text-[clamp(64px,18vw,260px)] leading-none tracking-tight select-none"
          style={{ fontFamily: "'Inter Tight', sans-serif" }}
        >
          <span
            className="inline-block bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(180deg, #CAD3DE 0%, #A6B4C4 55%, #8B9AAB 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            AETHR
            <span className="relative inline-block">
              I
              <span
                className="ae-float absolute left-1/2 bottom-full w-[0.16em] h-[0.16em] mb-[0.02em] -ml-[0.08em] rounded-full shadow-[0_0.04em_0.08em_rgba(181,17,26,0.35)]"
                style={{
                  background:
                    "radial-gradient(circle at 32% 26%, #FFC2C0 0%, #F2343C 30%, #B5111A 70%, #6E0A10 100%)",
                }}
              />
            </span>
            Z
          </span>
        </div>
      </footer>
    </div>
  );
}
