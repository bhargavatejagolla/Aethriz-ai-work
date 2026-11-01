"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { getSession, clearSession, UserProfile } from "@/lib/auth";
import DashboardBodyMapSchematic from "@/components/anatomy/DashboardBodyMapSchematic";

const DashboardBodyMap3D = dynamic(
  () => import("@/components/anatomy/DashboardBodyMap3D"),
  { ssr: false }
);

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  time?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [activeBodyHotspot, setActiveBodyHotspot] = useState<"metabolic" | "heart" | "brain" | "thyroid">("metabolic");
  const [bodyMapMode, setBodyMapMode] = useState<"schematic" | "3d">("schematic");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Today's Plan interactive state
  const [tasks, setTasks] = useState([
    { id: 1, title: "20-minute morning walk", subtitle: "Helps post-meal glucose", completed: true },
    { id: 2, title: "15 minutes of sunlight", subtitle: "Before 10 AM, for vitamin D", completed: false },
    { id: 3, title: "Fibre-first lunch", subtitle: "Salad or sabzi before roti", completed: false },
    { id: 4, title: "Lights out by 11 PM", subtitle: "Keeps your sleep score up", completed: false },
  ]);

  // AETHRIZ Assistant interactive chat
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m-1",
      sender: "user",
      text: "What does my HbA1c mean?",
    },
    {
      id: "m-2",
      sender: "assistant",
      text: "Your HbA1c is 6.1% — slightly above the ideal range. It reflects your average blood sugar over about three months. Small, steady changes to meals and daily activity usually help. It is worth discussing with your doctor.",
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (session) {
      setUser(session);
    } else {
      // Default demo profile for seamless offline preview
      setUser({
        id: "demo-aarav",
        name: "Aarav Kapoor",
        email: "aarav@aethriz.com",
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

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputQuestion).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion("");
    setIsTyping(true);

    setTimeout(() => {
      let reply = "I've noted that. Monitoring your metabolic trajectory in correlation with your recent lab report.";

      const lower = text.toLowerCase();
      if (lower.includes("hba1c") || lower.includes("sugar") || lower.includes("glucose")) {
        reply = language === "hi"
          ? "आपका HbA1c 6.1% है, जो सामान्य सीमा से थोड़ा अधिक है। भोजन में पहले सलाद और फाइबर लें, फिर चपाती या चावल। इससे स्पाइक्स नियंत्रित होंगे।"
          : "Your HbA1c is 6.1% — slightly above ideal. Prioritizing fibre before carbs and a 15-minute post-meal walk is your highest impact lever.";
      } else if (lower.includes("eat") || lower.includes("dinner") || lower.includes("tonight") || lower.includes("food")) {
        reply = language === "hi"
          ? "रात के भोजन में मूंग दाल का सूप, हरी सब्ज़ियां और 1 मल्टीग्रेन रोटी लें। रात 8:30 बजे से पहले डिनर करने से सुबह का शुगर लेवल बहुत बेहतर रहेगा।"
          : "For tonight, opt for a light, fibre-rich dinner: a bowl of dal, sautéed seasonal vegetables, and 1 multigrain roti before 8:30 PM.";
      } else if (lower.includes("vitamin d") || lower.includes("vit d")) {
        reply = language === "hi"
          ? "आपका विटामिन डी 18.2 ng/mL (कम) है। सुबह 8 से 10 बजे के बीच 15 मिनट धूप लें और डॉक्टर की सलाह से 60,000 IU सप्लीमेंट पर विचार करें।"
          : "Your Vitamin D is currently 18.2 ng/mL (Low). Aim for 15 minutes of direct morning sunlight before 10 AM, and review once with your clinician.";
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "assistant",
        text: reply,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handleReportUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadSuccess(false);
      }, 1200);
    }, 1000);
  };

  const userName = user?.name?.split(" ")[0] || "Aarav";

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-[#1D1F22] font-sans antialiased selection:bg-[#E3202B] selection:text-white pb-14">
      {/* ============ TOP NAVBAR ============ */}
      <header className="sticky top-4 z-40 px-4 sm:px-6">
        <nav
          aria-label="Main"
          className="relative max-w-[1240px] mx-auto p-2 pl-4 sm:pl-5 flex items-center justify-between gap-3 rounded-full border border-white/80 shadow-[0_20px_50px_rgba(120,60,90,0.1),0_2px_8px_rgba(29,31,34,0.04),inset_0_1.5px_0_rgba(255,255,255,0.95)]"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.72) 50%, rgba(255,255,255,0.88) 100%)",
            backdropFilter: "blur(28px) saturate(200%)",
            WebkitBackdropFilter: "blur(28px) saturate(200%)",
          }}
        >
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-2.5 group">
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
                className="font-semibold text-[15.5px] tracking-[0.14em] text-[#1D1F22]"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                AETHRIZ
              </span>
              <span className="text-[8.5px] tracking-[0.22em] text-[#C8161F] mt-[2px] font-mono">
                BIO-HEALTH AI
              </span>
            </span>
          </Link>

          {/* Center Navigation Pills */}
          <div className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-slate-100/70 border border-slate-200/50 text-[13px] font-medium text-[#545B61]">
            <Link
              href="/dashboard"
              className="px-3.5 py-1.5 rounded-full bg-white text-[#1D1F22] font-semibold shadow-xs transition-all"
            >
              AI Health
            </Link>
            <Link
              href="/health-analysis"
              className="px-3.5 py-1.5 rounded-full hover:text-[#1D1F22] hover:bg-white/50 transition-all"
            >
              Analysis
            </Link>
            <Link
              href="/doctors"
              className="px-3.5 py-1.5 rounded-full hover:text-[#1D1F22] hover:bg-white/50 transition-all"
            >
              Doctors
            </Link>
            <Link
              href="/booking"
              className="px-3.5 py-1.5 rounded-full hover:text-[#1D1F22] hover:bg-white/50 transition-all"
            >
              Bookings
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
              href="/stories"
              className="px-3.5 py-1.5 rounded-full hover:text-[#1D1F22] hover:bg-white/50 transition-all"
            >
              Articles
            </Link>
          </div>

          {/* Right Action: Profile Capsule & Logout */}
          <div className="flex items-center gap-2">
            <Link
              href="/profile"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FCECEE] hover:bg-[#F9DFE2] border border-[#F6C6CC] text-xs font-semibold text-[#1D1F22] transition-all cursor-pointer shadow-2xs"
            >
              <div className="w-6 h-6 rounded-full bg-[#E3202B] text-white flex items-center justify-center font-bold text-[10.5px]">
                {userName.substring(0, 2).toUpperCase()}
              </div>
              <span className="hidden sm:inline font-medium">My profile</span>
            </Link>

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

      {/* ============ MAIN DASHBOARD CONTAINER ============ */}
      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        
        {/* ============ SUBHEADER: GREETING & REPORT ACTIONS ============ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[#64748B]">
              Friday, 30 October · Last report analysed 2 days ago
            </p>
            <h1
              className="text-3xl sm:text-4xl lg:text-[42px] font-semibold tracking-tight text-[#1D1F22] mt-1"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              Good evening, {userName}.
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher Pill */}
            <div className="flex items-center bg-slate-200/80 p-1 rounded-full text-xs font-medium">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  language === "en"
                    ? "bg-white text-[#1D1F22] font-semibold shadow-xs"
                    : "text-[#64748B] hover:text-[#1D1F22]"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage("hi")}
                className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  language === "hi"
                    ? "bg-white text-[#1D1F22] font-semibold shadow-xs"
                    : "text-[#64748B] hover:text-[#1D1F22]"
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Upload Report Button */}
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white shadow-[0_8px_20px_rgba(14,15,17,0.2)] hover:opacity-95 active:scale-95 transition-all cursor-pointer"
              style={{
                background: "linear-gradient(180deg, #32363A 0%, #1D1F22 100%)",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
              <span>Upload report</span>
            </button>
          </div>
        </div>

        {/* ============ 3-COLUMN CORE TELEMETRY GRID ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* ============ LEFT: HEALTH SCORE & BODY MAP (8 COLS) ============ */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            
            {/* TOP SUB-GRID: HEALTH SCORE & BODY MAP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* CARD 1: HEALTH SCORE */}
              <div className="bg-white rounded-[28px] p-6 border border-slate-200/80 shadow-[0_12px_36px_rgba(29,31,34,0.04)] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[#1D1F22]">Health score</h3>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    +4 this month
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center my-auto">
                  {/* Circular Dial */}
                  <div className="sm:col-span-5 flex justify-center">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {/* Background track */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          className="stroke-slate-100"
                          strokeWidth="9"
                          fill="none"
                        />
                        {/* Progress ring 86% */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="url(#scoreGrad)"
                          strokeWidth="9"
                          strokeDasharray={2 * Math.PI * 40}
                          strokeDashoffset={2 * Math.PI * 40 * (1 - 0.86)}
                          strokeLinecap="round"
                          fill="none"
                          className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FF6469" />
                            <stop offset="100%" stopColor="#E3202B" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-extrabold tracking-tight text-[#1D1F22]">
                          86
                        </span>
                        <span className="text-[11px] text-[#64748B] font-medium">of 100</span>
                      </div>
                    </div>
                  </div>

                  {/* 4 Categorical Bars */}
                  <div className="sm:col-span-7 space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-[#475569]">Metabolic</span>
                        <span className="text-[#E3202B]">72</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full bg-[#E3202B]" style={{ width: "72%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-[#475569]">Heart</span>
                        <span className="text-amber-600">80</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full bg-amber-500" style={{ width: "80%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-[#475569]">Nutrition</span>
                        <span className="text-emerald-600">91</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: "91%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-[#475569]">Sleep</span>
                        <span className="text-emerald-600">88</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: "88%" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

                            {/* CARD 2: BODY MAP WITH 3D VOLUMETRIC ANATOMY & CLINICAL TELEMETRY */}
              <div
                className="rounded-[28px] p-6 border border-white/80 shadow-[0_12px_36px_rgba(29,31,34,0.04)] relative overflow-hidden flex flex-col justify-between"
                style={{
                  background: "linear-gradient(145deg, #FFFFFF 0%, #FFF7F8 100%)",
                }}
              >
                <div className="flex items-center justify-between mb-3 z-10">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-[#1D1F22]">Body map</h3>
                    <div className="flex items-center bg-slate-100 p-0.5 rounded-full text-[10px] font-semibold">
                      <button
                        type="button"
                        onClick={() => setBodyMapMode("schematic")}
                        className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                          bodyMapMode === "schematic"
                            ? "bg-white text-[#1D1F22] shadow-2xs"
                            : "text-[#64748B] hover:text-[#1D1F22]"
                        }`}
                      >
                        Schematic
                      </button>
                      <button
                        type="button"
                        onClick={() => setBodyMapMode("3d")}
                        className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                          bodyMapMode === "3d"
                            ? "bg-[#E3202B] text-white shadow-2xs"
                            : "text-[#64748B] hover:text-[#1D1F22]"
                        }`}
                      >
                        3D Atlas
                      </button>
                    </div>
                  </div>
                  <Link
                    href="/body-explorer"
                    className="text-[11px] font-semibold text-[#E3202B] hover:underline flex items-center gap-1"
                  >
                    <span>Full Explorer</span>
                    <span>→</span>
                  </Link>
                </div>

                <div className="grid grid-cols-12 gap-3 items-center relative z-10">
                  {/* Left: Interactive Organ Status Toggles with Connected Telemetry Guides */}
                  <div className="col-span-6 sm:col-span-7 space-y-2 relative">
                    {/* Brain & sleep */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setActiveBodyHotspot("brain")}
                        className={`w-full text-left p-2.5 rounded-2xl text-xs flex items-center justify-between transition-all cursor-pointer relative z-10 ${
                          activeBodyHotspot === "brain"
                            ? "bg-white shadow-xs border-2 border-emerald-400 ring-2 ring-emerald-100 scale-[1.01]"
                            : "bg-white/70 hover:bg-white border border-slate-200/60"
                        }`}
                      >
                        <span className="flex items-center gap-2 font-semibold text-[#1D1F22]">
                          <span className={`w-2.5 h-2.5 rounded-full bg-emerald-500 ${activeBodyHotspot === "brain" ? "ae-pulse-glow" : ""}`} />
                          Brain & sleep
                        </span>
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/90 shadow-2xs">
                          Stable
                        </span>
                      </button>
                      {activeBodyHotspot === "brain" && (
                        <div className="hidden sm:block absolute right-0 top-1/2 w-4 h-[2px] bg-emerald-400 translate-x-full z-0" />
                      )}
                    </div>

                    {/* Heart */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setActiveBodyHotspot("heart")}
                        className={`w-full text-left p-2.5 rounded-2xl text-xs flex items-center justify-between transition-all cursor-pointer relative z-10 ${
                          activeBodyHotspot === "heart"
                            ? "bg-white shadow-xs border-2 border-amber-400 ring-2 ring-amber-100 scale-[1.01]"
                            : "bg-white/70 hover:bg-white border border-slate-200/60"
                        }`}
                      >
                        <span className="flex items-center gap-2 font-semibold text-[#1D1F22]">
                          <span className={`w-2.5 h-2.5 rounded-full bg-amber-500 ${activeBodyHotspot === "heart" ? "ae-pulse-glow" : ""}`} />
                          Heart
                        </span>
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold border border-amber-300 shadow-2xs">
                          Watch
                        </span>
                      </button>
                      {activeBodyHotspot === "heart" && (
                        <div className="hidden sm:block absolute right-0 top-1/2 w-4 h-[2px] bg-amber-400 translate-x-full z-0" />
                      )}
                    </div>

                    {/* Metabolic */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setActiveBodyHotspot("metabolic")}
                        className={`w-full text-left p-2.5 rounded-2xl text-xs flex items-center justify-between transition-all cursor-pointer relative z-10 ${
                          activeBodyHotspot === "metabolic"
                            ? "bg-white shadow-xs border-2 border-[#E3202B] ring-2 ring-[#E3202B]/20 scale-[1.01]"
                            : "bg-white/70 hover:bg-white border border-slate-200/60"
                        }`}
                      >
                        <span className="flex items-center gap-2 font-bold text-[#1D1F22]">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#E3202B] ae-pulse-glow" />
                          Metabolic
                        </span>
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-red-50 text-[#E3202B] font-bold border border-red-300 shadow-2xs">
                          Borderline
                        </span>
                      </button>
                      {activeBodyHotspot === "metabolic" && (
                        <div className="hidden sm:block absolute right-0 top-1/2 w-4 h-[2px] bg-[#E3202B] translate-x-full z-0" />
                      )}
                    </div>

                    {/* Thyroid */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setActiveBodyHotspot("thyroid")}
                        className={`w-full text-left p-2.5 rounded-2xl text-xs flex items-center justify-between transition-all cursor-pointer relative z-10 ${
                          activeBodyHotspot === "thyroid"
                            ? "bg-white shadow-xs border-2 border-emerald-400 ring-2 ring-emerald-100 scale-[1.01]"
                            : "bg-white/70 hover:bg-white border border-slate-200/60"
                        }`}
                      >
                        <span className="flex items-center gap-2 font-semibold text-[#1D1F22]">
                          <span className={`w-2.5 h-2.5 rounded-full bg-emerald-500 ${activeBodyHotspot === "thyroid" ? "ae-pulse-glow" : ""}`} />
                          Thyroid
                        </span>
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/90 shadow-2xs">
                          Balanced
                        </span>
                      </button>
                      {activeBodyHotspot === "thyroid" && (
                        <div className="hidden sm:block absolute right-0 top-1/2 w-4 h-[2px] bg-emerald-400 translate-x-full z-0" />
                      )}
                    </div>
                  </div>

                  {/* Right: Real 3D Volumetric Anatomy Canvas with Raycast Hotspots */}
                  <div className="col-span-6 sm:col-span-5 relative h-48 flex items-center justify-center">
                    {bodyMapMode === "schematic" ? (
                      <DashboardBodyMapSchematic
                        activeHotspot={activeBodyHotspot}
                        onSelectHotspot={setActiveBodyHotspot}
                      />
                    ) : (
                      <DashboardBodyMap3D
                        activeHotspot={activeBodyHotspot}
                        onSelectHotspot={setActiveBodyHotspot}
                      />
                    )}
                  </div>
                </div>

                {/* Bottom Callout Pill - Dynamically updates based on active hotspot */}
                <div className="mt-3 p-3.5 rounded-2xl bg-white/95 border border-red-100/90 shadow-2xs z-10 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#E3202B] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#E3202B]" />
                      {activeBodyHotspot === "metabolic"
                        ? "HbA1c 6.1% · Borderline"
                        : activeBodyHotspot === "heart"
                        ? "Resting HR 72 bpm · Watch"
                        : activeBodyHotspot === "brain"
                        ? "Sleep score 88 · Stable"
                        : "TSH 2.1 μIU/mL · Balanced"}
                    </span>
                    <span className="text-[10px] font-mono text-[#94A3B8] uppercase">Active Target</span>
                  </div>
                  <p className="text-[11.5px] text-[#64748B] mt-1 leading-snug">
                    {activeBodyHotspot === "metabolic"
                      ? "Post-meal spikes mid-week. Small meal swaps are your biggest lever."
                      : activeBodyHotspot === "heart"
                      ? "Occasional afternoon cardiac rhythm variation. Maintain hydration & limit post-3 PM caffeine."
                      : activeBodyHotspot === "brain"
                      ? "Consistent 6.5h sleep cycle with deep restorative phase between 1 AM and 3 AM."
                      : "Metabolic and thyroid hormone levels reflect steady endocrine homeostasis."}
                  </p>
                </div>
              </div>
            </div>

            {/* MIDDLE SUB-GRID: POST-MEAL GLUCOSE & TODAY'S PLAN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* CARD 3: POST-MEAL GLUCOSE */}
              <div className="bg-white rounded-[28px] p-6 border border-slate-200/80 shadow-[0_12px_36px_rgba(29,31,34,0.04)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-[#1D1F22]">Post-meal glucose</h3>
                      <p className="text-[11.5px] text-[#64748B]">mg/dL · last 7 days</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-[#E3202B] border border-red-200/60">
                      Borderline
                    </span>
                  </div>

                  {/* SVG Line / Area Graph */}
                  <div className="mt-4 relative h-32 w-full">
                    <svg viewBox="0 0 320 120" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="glucoseGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#E3202B" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#E3202B" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Target Line */}
                      <line
                        x1="0"
                        y1="75"
                        x2="320"
                        y2="75"
                        stroke="#10B981"
                        strokeWidth="1.2"
                        strokeDasharray="4 4"
                        opacity="0.8"
                      />
                      <text x="285" y="71" fill="#10B981" fontSize="9" fontWeight="600">
                        target
                      </text>

                      {/* Area Fill */}
                      <path
                        d="M 10,95 Q 60,80 110,45 T 210,65 T 310,88 L 310,120 L 10,120 Z"
                        fill="url(#glucoseGrad)"
                      />

                      {/* Line Curve */}
                      <path
                        d="M 10,95 Q 60,80 110,45 T 210,65 T 310,88"
                        fill="none"
                        stroke="#E3202B"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                      />

                      {/* Spike Node on Peak (Tue/Wed) */}
                      <circle cx="110" cy="45" r="4.5" fill="#E3202B" className="ae-pulse-glow" />
                      <circle cx="110" cy="45" r="2" fill="#FFFFFF" />
                    </svg>

                    {/* Days X-Axis */}
                    <div className="flex justify-between text-[11px] text-[#94A3B8] font-medium mt-1 px-1">
                      <span>Sat</span>
                      <span>Sun</span>
                      <span>Mon</span>
                      <span className="text-[#E3202B] font-bold">Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-[#64748B]">
                  <span className="text-[#E3202B] font-bold">〰</span>
                  <span>Peaks mid-week — likely linked to late dinners.</span>
                </div>
              </div>

              {/* CARD 4: TODAY'S PLAN */}
              <div className="bg-white rounded-[28px] p-6 border border-slate-200/80 shadow-[0_12px_36px_rgba(29,31,34,0.04)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-[#1D1F22]">Today&apos;s plan</h3>
                    <span className="text-xs font-bold text-[#E3202B] font-mono">
                      {completedCount}/{tasks.length}
                    </span>
                  </div>

                  {/* Red progress line */}
                  <div className="h-1 rounded-full bg-slate-100 overflow-hidden mb-4">
                    <div
                      className="h-full bg-[#E3202B] rounded-full transition-all duration-300"
                      style={{ width: `${(completedCount / tasks.length) * 100}%` }}
                    />
                  </div>

                  {/* Tasks list */}
                  <div className="space-y-2.5">
                    {tasks.map((task) => (
                      <button
                        key={task.id}
                        type="button"
                        onClick={() => toggleTask(task.id)}
                        className={`w-full text-left p-2.5 rounded-2xl flex items-start gap-3 transition-all cursor-pointer ${
                          task.completed
                            ? "bg-slate-50 border border-slate-200/60"
                            : "bg-[#F8FAFC] border border-slate-200/90 hover:bg-slate-50"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                            task.completed
                              ? "bg-[#E3202B] text-white shadow-2xs"
                              : "border-2 border-slate-300 bg-white"
                          }`}
                        >
                          {task.completed && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                        <div className="leading-tight">
                          <h4
                            className={`text-xs font-semibold ${
                              task.completed ? "line-through text-slate-400" : "text-[#1D1F22]"
                            }`}
                          >
                            {task.title}
                          </h4>
                          <p className="text-[11px] text-[#64748B] mt-0.5">{task.subtitle}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* ============ RIGHT COLUMN: AETHRIZ ASSISTANT CHAT (4 COLS) ============ */}
          <div className="lg:col-span-4 bg-[#111216] text-white rounded-[32px] p-6 shadow-[0_24px_50px_rgba(0,0,0,0.3)] flex flex-col justify-between border border-white/10 relative overflow-hidden min-h-[560px]">
            {/* Crimson Background Ambient Light */}
            <div
              className="absolute -right-16 -top-16 w-56 h-56 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(227,32,43,0.3) 0%, transparent 70%)",
                filter: "blur(32px)",
              }}
            />

            {/* Top Header */}
            <div className="relative z-10 flex items-center gap-3 pb-4 border-b border-white/10">
              <div className="w-9 h-9 rounded-full bg-[#E3202B] flex items-center justify-center text-white shadow-xs ae-pulse-glow flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-wide">AETHRIZ Assistant</h3>
                <p className="text-[11px] text-white/60 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Online · {language === "hi" ? "हिन्दी में उत्तर" : "answers in English"}
                </p>
              </div>
            </div>

            {/* Chat Body & Scroll Area */}
            <div className="relative z-10 flex-1 overflow-y-auto py-4 space-y-3.5 pr-1 max-h-[360px]">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"} ae-fade-in`}
                >
                  <div
                    className={`max-w-[88%] text-xs leading-relaxed p-3.5 rounded-2xl ${
                      m.sender === "user"
                        ? "bg-white text-[#1D1F22] font-medium shadow-xs"
                        : "bg-[#1C1E24] text-white/90 border border-white/10"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start ae-fade-in">
                  <div className="bg-[#1C1E24] text-white/70 text-xs p-3 rounded-2xl border border-white/10 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E3202B] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E3202B] animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E3202B] animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <p className="text-[10px] text-white/40 text-center pt-2">
                AETHRIZ supports awareness — it does not replace your doctor.
              </p>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="relative z-10 pt-2 pb-3 space-y-1.5">
              {[
                "What does my HbA1c mean?",
                "What should I eat tonight?",
                "How is my vitamin D?",
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleSendMessage(chip)}
                  className="block w-full text-left px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11.5px] text-white/80 transition-all cursor-pointer hover:border-white/20 truncate"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Message Input Box */}
            <div className="relative z-10 pt-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2 p-1.5 rounded-full bg-[#1C1E24] border border-white/15 focus-within:border-[#E3202B]/60 transition-all"
              >
                <input
                  type="text"
                  value={inputQuestion}
                  onChange={(e) => setInputQuestion(e.target.value)}
                  placeholder="Ask anything about your health..."
                  className="w-full bg-transparent px-3 text-xs text-white placeholder:text-white/40 focus:outline-none"
                />
                <button
                  type="button"
                  title="Voice input"
                  className="p-1.5 text-white/60 hover:text-white transition-colors cursor-pointer"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                </button>
                <button
                  type="submit"
                  disabled={!inputQuestion.trim()}
                  className="w-8 h-8 rounded-full bg-[#E3202B] hover:bg-[#C8161F] text-white flex items-center justify-center transition-all cursor-pointer flex-shrink-0 disabled:opacity-40"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* ============ BOTTOM SECTION: YOUR BIOMARKERS ============ */}
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-slate-200/80 shadow-[0_12px_36px_rgba(29,31,34,0.04)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <h2 className="text-xl font-semibold text-[#1D1F22] tracking-tight">
              Your biomarkers
            </h2>
            <div className="flex items-center gap-5 text-xs font-semibold">
              <Link href="/health-analysis" className="text-[#64748B] hover:text-[#1D1F22] transition-colors">
                See full analysis
              </Link>
              <Link href="/doctors" className="text-[#E3202B] hover:underline flex items-center gap-1">
                <span>Talk to a doctor</span>
                <span className="font-bold">→</span>
              </Link>
            </div>
          </div>

          {/* 5 Biomarker Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            
            {/* Card 1: HbA1c */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 flex flex-col justify-between hover:shadow-2xs transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-[#64748B]">HbA1c</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-[#E3202B] border border-red-200/60">
                    Borderline
                  </span>
                </div>
                <div className="flex items-baseline gap-1 my-1">
                  <span className="text-2xl font-bold text-[#1D1F22]">6.1</span>
                  <span className="text-xs text-[#64748B]">%</span>
                </div>
              </div>
              <div className="mt-3">
                <div className="relative h-1.5 rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 to-[#E3202B]">
                  <div className="absolute top-1/2 right-[25%] -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-[#E3202B] shadow-2xs" />
                </div>
                <p className="text-[10px] text-[#94A3B8] mt-1.5 font-medium">Ref 4.0–5.6</p>
              </div>
            </div>

            {/* Card 2: Vitamin D */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 flex flex-col justify-between hover:shadow-2xs transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-[#64748B]">Vitamin D</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                    Low
                  </span>
                </div>
                <div className="flex items-baseline gap-1 my-1">
                  <span className="text-2xl font-bold text-[#1D1F22]">18.2</span>
                  <span className="text-xs text-[#64748B]">ng/mL</span>
                </div>
              </div>
              <div className="mt-3">
                <div className="relative h-1.5 rounded-full bg-gradient-to-r from-amber-400 via-emerald-400 to-emerald-500">
                  <div className="absolute top-1/2 left-[20%] -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-amber-500 shadow-2xs" />
                </div>
                <p className="text-[10px] text-[#94A3B8] mt-1.5 font-medium">Ref 30–100</p>
              </div>
            </div>

            {/* Card 3: LDL-C */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 flex flex-col justify-between hover:shadow-2xs transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-[#64748B]">LDL-C</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-[#E3202B] border border-red-200/60">
                    Elevated
                  </span>
                </div>
                <div className="flex items-baseline gap-1 my-1">
                  <span className="text-2xl font-bold text-[#1D1F22]">142</span>
                  <span className="text-xs text-[#64748B]">mg/dL</span>
                </div>
              </div>
              <div className="mt-3">
                <div className="relative h-1.5 rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 to-[#E3202B]">
                  <div className="absolute top-1/2 right-[18%] -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-[#E3202B] shadow-2xs" />
                </div>
                <p className="text-[10px] text-[#94A3B8] mt-1.5 font-medium">Ref &lt; 100</p>
              </div>
            </div>

            {/* Card 4: TSH */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 flex flex-col justify-between hover:shadow-2xs transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-[#64748B]">TSH</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    In range
                  </span>
                </div>
                <div className="flex items-baseline gap-1 my-1">
                  <span className="text-2xl font-bold text-[#1D1F22]">2.1</span>
                  <span className="text-xs text-[#64748B]">μIU/mL</span>
                </div>
              </div>
              <div className="mt-3">
                <div className="relative h-1.5 rounded-full bg-gradient-to-r from-amber-300 via-emerald-400 to-amber-300">
                  <div className="absolute top-1/2 left-[48%] -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-emerald-500 shadow-2xs" />
                </div>
                <p className="text-[10px] text-[#94A3B8] mt-1.5 font-medium">Ref 0.4–4.0</p>
              </div>
            </div>

            {/* Card 5: Haemoglobin */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 flex flex-col justify-between hover:shadow-2xs transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-[#64748B]">Haemoglobin</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    In range
                  </span>
                </div>
                <div className="flex items-baseline gap-1 my-1">
                  <span className="text-2xl font-bold text-[#1D1F22]">13.8</span>
                  <span className="text-xs text-[#64748B]">g/dL</span>
                </div>
              </div>
              <div className="mt-3">
                <div className="relative h-1.5 rounded-full bg-gradient-to-r from-amber-300 via-emerald-400 to-amber-300">
                  <div className="absolute top-1/2 left-[52%] -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-emerald-500 shadow-2xs" />
                </div>
                <p className="text-[10px] text-[#94A3B8] mt-1.5 font-medium">Ref 13–17</p>
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* ============ UPLOAD REPORT MODAL ============ */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm ae-fade-in">
          <div className="bg-white rounded-[28px] max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <button
              type="button"
              onClick={() => setShowUploadModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-2 cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E3202B] flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-[#1D1F22]">Upload Health Report</h3>
            <p className="text-xs text-[#64748B] mt-1">
              Upload blood test (CBC, Lipid, HbA1c, Thyroid) or diagnostic PDF / image.
            </p>

            <form onSubmit={handleReportUpload} className="mt-5 space-y-4">
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-[#E3202B]/60 transition-colors cursor-pointer bg-slate-50/50">
                <p className="text-xs font-semibold text-[#1D1F22]">
                  Drag and drop your file here, or <span className="text-[#E3202B]">browse</span>
                </p>
                <p className="text-[11px] text-[#94A3B8] mt-1">PDF, JPG, PNG up to 25MB</p>
              </div>

              {uploadSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-semibold flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Report uploaded and queued for AI biomarker parsing!
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-[#64748B] hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || uploadSuccess}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold text-white shadow-xs hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                  style={{ background: "linear-gradient(180deg, #32363A 0%, #1D1F22 100%)" }}
                >
                  {isUploading ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    <span>Process with AI</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
