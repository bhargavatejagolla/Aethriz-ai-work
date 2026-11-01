"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import DoctorNavbar from "@/components/navigation/DoctorNavbar";

interface AppointmentSlot {
  id: string;
  time: string;
  patientName: string;
  patientId: string;
  age: number;
  gender: string;
  languages: string;
  chiefComplaint: string;
  bookingSource: string;
  consultType: "Video" | "In-clinic";
  status: "Concluded" | "Imminent" | "Ready" | "Upcoming";
  statusTag: string;
  durationOrEta: string;
  avatar: string;
  abhaLinked: boolean;
  telemetry: {
    heartRate: number;
    heartRateStatus: "normal" | "elevated" | "low";
    rhythm: string;
    hba1c: string;
    hba1cDelta: string;
    glucosePeak: string;
    glucoseContext: string;
    vitaminD: string;
    vitaminDStatus: "low" | "optimal" | "deficient";
  };
  copilotPrompt: {
    headline: string;
    summary: string;
    tags: string[];
  };
  checklist: {
    consent: boolean;
    summarySynced: boolean;
    wearableSynced: boolean;
  };
  waitTimeSeconds: number;
}

const APPOINTMENTS: AppointmentSlot[] = [
  {
    id: "apt-1",
    time: "9:30 AM",
    patientName: "Meena Pillai",
    patientId: "AE-28941",
    age: 48,
    gender: "F",
    languages: "தமிழ் / EN",
    chiefComplaint: "Lipid review & statin tolerance",
    bookingSource: "booked via AETHRIZ",
    consultType: "Video",
    status: "Concluded",
    statusTag: "Concluded",
    durationOrEta: "22 min",
    avatar: "MP",
    abhaLinked: true,
    telemetry: {
      heartRate: 72,
      heartRateStatus: "normal",
      rhythm: "Sinus rhythm · 72 bpm",
      hba1c: "5.6%",
      hba1cDelta: "stable",
      glucosePeak: "134 mg/dL",
      glucoseContext: "post-lunch",
      vitaminD: "24.5 ng/mL",
      vitaminDStatus: "optimal",
    },
    copilotPrompt: {
      headline: "Review lipid panel stability and maintain current statin dose",
      summary: "LDL reduced from 158 to 118 mg/dL over 90 days. Liver enzymes remained within baseline limits.",
      tags: ["Vegetarian", "Adherent", "Follow-up in 6 mo"],
    },
    checklist: { consent: true, summarySynced: true, wearableSynced: true },
    waitTimeSeconds: 0,
  },
  {
    id: "apt-2",
    time: "11:00 AM",
    patientName: "Rohit Verma",
    patientId: "AE-19034",
    age: 42,
    gender: "M",
    languages: "हिन्दी / EN",
    chiefComplaint: "Blood pressure titration",
    bookingSource: "in-clinic referral",
    consultType: "In-clinic",
    status: "Concluded",
    statusTag: "Concluded",
    durationOrEta: "18 min",
    avatar: "RV",
    abhaLinked: true,
    telemetry: {
      heartRate: 84,
      heartRateStatus: "normal",
      rhythm: "Sinus tachycardia · 84 bpm",
      hba1c: "5.9%",
      hba1cDelta: "borderline",
      glucosePeak: "148 mg/dL",
      glucoseContext: "fasting",
      vitaminD: "16.1 ng/mL",
      vitaminDStatus: "low",
    },
    copilotPrompt: {
      headline: "Ambulatory BP monitoring indicates mild afternoon spikes",
      summary: "Patient recorded 142/91 mmHg around 2:30 PM post heavy meals. Advised reduced sodium and morning brisk walk.",
      tags: ["Desk worker", "High stress", "Hydration low"],
    },
    checklist: { consent: true, summarySynced: true, wearableSynced: true },
    waitTimeSeconds: 0,
  },
  {
    id: "apt-3",
    time: "2:00 PM",
    patientName: "Sana Qureshi",
    patientId: "AE-31980",
    age: 29,
    gender: "F",
    languages: "اردو / EN",
    chiefComplaint: "Fatigue & micronutrient deficiency",
    bookingSource: "booked via AETHRIZ",
    consultType: "Video",
    status: "Concluded",
    statusTag: "Concluded",
    durationOrEta: "20 min",
    avatar: "SQ",
    abhaLinked: true,
    telemetry: {
      heartRate: 68,
      heartRateStatus: "normal",
      rhythm: "Sinus rhythm · 68 bpm",
      hba1c: "5.4%",
      hba1cDelta: "normal",
      glucosePeak: "122 mg/dL",
      glucoseContext: "post-breakfast",
      vitaminD: "12.8 ng/mL",
      vitaminDStatus: "low",
    },
    copilotPrompt: {
      headline: "Ferritin 14 ng/mL and Vitamin D3 low; supplement protocol initiated",
      summary: "Fatigue correlates with low serum ferritin and poor sleep efficiency. Prescribed liposomal iron + weekly cholecalciferol.",
      tags: ["Non-vegetarian", "Prefers Urdu", "Lab report synced"],
    },
    checklist: { consent: true, summarySynced: true, wearableSynced: true },
    waitTimeSeconds: 0,
  },
  {
    id: "apt-4",
    time: "6:30 PM",
    patientName: "Aarav Kapoor",
    patientId: "AE-30418",
    age: 34,
    gender: "M",
    languages: "हिन्दी / EN",
    chiefComplaint: "HbA1c review · booked via AETHRIZ",
    bookingSource: "booked via AETHRIZ",
    consultType: "Video",
    status: "Imminent",
    statusTag: "Imminent",
    durationOrEta: "in 18 min",
    avatar: "AK",
    abhaLinked: true,
    telemetry: {
      heartRate: 78,
      heartRateStatus: "normal",
      rhythm: "Sinus rhythm · 78 bpm",
      hba1c: "6.1%",
      hba1cDelta: "↑ from 5.8",
      glucosePeak: "168 mg/dL",
      glucoseContext: "post-dinner",
      vitaminD: "18.2 ng/mL",
      vitaminDStatus: "low",
    },
    copilotPrompt: {
      headline: "Discuss evening meal timing and a 90-day re-test",
      summary: "Glucose peaks follow dinners after 9:30 PM. Lifestyle changes and a repeat HbA1c in 90 days may be appropriate. Vitamin D and iron are low.",
      tags: ["Vegetarian", "Prefers Hindi", "Summary shared by patient"],
    },
    checklist: { consent: true, summarySynced: true, wearableSynced: true },
    waitTimeSeconds: 134, // 02:14
  },
  {
    id: "apt-5",
    time: "7:15 PM",
    patientName: "K. Sundaram",
    patientId: "AE-44109",
    age: 56,
    gender: "M",
    languages: "ಕನ್ನಡ / EN",
    chiefComplaint: "Thyroid follow-up & TSH balance",
    bookingSource: "booked via AETHRIZ",
    consultType: "Video",
    status: "Ready",
    statusTag: "Ready",
    durationOrEta: "Pre-checked",
    avatar: "KS",
    abhaLinked: true,
    telemetry: {
      heartRate: 74,
      heartRateStatus: "normal",
      rhythm: "Sinus rhythm · 74 bpm",
      hba1c: "5.7%",
      hba1cDelta: "stable",
      glucosePeak: "138 mg/dL",
      glucoseContext: "post-meal",
      vitaminD: "22.0 ng/mL",
      vitaminDStatus: "optimal",
    },
    copilotPrompt: {
      headline: "TSH normalised to 2.4 mIU/L on 75mcg Levothyroxine",
      summary: "Thyroid antibodies negative. Patient reports improved morning energy and stable weight. Continue same dosage.",
      tags: ["Pre-checked in", "Wearable active", "Routine follow-up"],
    },
    checklist: { consent: true, summarySynced: true, wearableSynced: true },
    waitTimeSeconds: 45,
  },
  {
    id: "apt-6",
    time: "8:00 PM",
    patientName: "Priya Nair",
    patientId: "AE-50122",
    age: 31,
    gender: "F",
    languages: "മലയാളം / EN",
    chiefComplaint: "PCOS & metabolic diet plan",
    bookingSource: "booked via AETHRIZ",
    consultType: "Video",
    status: "Upcoming",
    statusTag: "Upcoming",
    durationOrEta: "Queue #3",
    avatar: "PN",
    abhaLinked: true,
    telemetry: {
      heartRate: 70,
      heartRateStatus: "normal",
      rhythm: "Sinus rhythm · 70 bpm",
      hba1c: "5.8%",
      hba1cDelta: "borderline",
      glucosePeak: "152 mg/dL",
      glucoseContext: "post-lunch",
      vitaminD: "19.4 ng/mL",
      vitaminDStatus: "low",
    },
    copilotPrompt: {
      headline: "LH:FSH ratio elevated (2.4); insulin resistance pattern evident",
      summary: "Diet log reflects refined carbohydrate consumption at dinner. Recommend inositol, low GI meals and post-meal ambulation.",
      tags: ["Lab report attached", "Diet log synced", "First visit"],
    },
    checklist: { consent: true, summarySynced: true, wearableSynced: true },
    waitTimeSeconds: 0,
  },
];

export default function DoctorAppointmentsPage() {
  const [activeTab, setActiveTab] = useState<"timeline" | "triage">("timeline");
  const [selectedId, setSelectedId] = useState<string>("apt-4"); // Default Aarav Kapoor
  const [waitTimer, setWaitTimer] = useState<number>(134); // 02:14
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [copilotDismissed, setCopilotDismissed] = useState(false);
  const [notesAdded, setNotesAdded] = useState(false);
  const [clinicalNotes, setClinicalNotes] = useState<string>("");
  const [showNotesDrawer, setShowNotesDrawer] = useState(false);
  const [showRecordsModal, setShowRecordsModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [inCallModal, setInCallModal] = useState(false);

  // Active patient data
  const currentApt = APPOINTMENTS.find((a) => a.id === selectedId) || APPOINTMENTS[3];

  // Timer simulation for patient waiting
  useEffect(() => {
    const timer = setInterval(() => {
      setWaitTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAddToNotes = () => {
    const noteText = `[AETHRIZ Copilot Note - ${new Date().toLocaleTimeString()}]: ${currentApt.copilotPrompt.headline}. ${currentApt.copilotPrompt.summary}`;
    setClinicalNotes((prev) => (prev ? `${prev}\n\n${noteText}` : noteText));
    setNotesAdded(true);
    setTimeout(() => setNotesAdded(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] text-[#1D1F22] flex flex-col font-sans selection:bg-[#E11D48]/15 selection:text-[#E11D48] relative overflow-x-hidden">
      
      {/* Background Soft Ambient Light */}
      <div
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[360px] opacity-75 blur-[120px] -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(225, 29, 72, 0.18) 0%, rgba(254, 205, 211, 0.25) 45%, rgba(245, 246, 248, 0) 80%)",
        }}
      />

      {/* ==================== STANDARD DOCTOR NAVBAR ==================== */}
      <DoctorNavbar activeTab="appointments" />

      {/* ==================== MAIN CONTENT WRAPPER ==================== */}
      <main className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 flex-1 flex flex-col gap-6">

        {/* Sub-header Bar: Breadcrumb + Title + View Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs text-[#64748B] font-medium mb-1">
              <span className="w-2 h-2 rounded-full bg-[#E11D48]" />
              <span>Doctor portal · Appointments</span>
            </div>
            <div className="flex items-baseline gap-3 flex-wrap">
              <h1
                className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1D1F22]"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                Consultation stream
              </h1>
              <span className="text-sm font-medium text-[#64748B]">
                <strong className="text-[#E11D48] font-semibold">Today</strong> · Fri 30 Oct
              </span>
            </div>
          </div>

          {/* Switcher Buttons: Timeline vs Triage ranked */}
          <div className="flex items-center p-1 rounded-full bg-white/80 border border-black/[0.06] shadow-xs w-fit">
            <button
              onClick={() => setActiveTab("timeline")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "timeline"
                  ? "bg-[#E11D48] text-white shadow-xs"
                  : "text-[#64748B] hover:text-[#1D1F22]"
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setActiveTab("triage")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "triage"
                  ? "bg-[#E11D48] text-white shadow-xs"
                  : "text-[#64748B] hover:text-[#1D1F22]"
              }`}
            >
              Triage ranked
            </button>
          </div>
        </div>

        {/* ==================== HORIZONTAL TIMELINE STRIP ==================== */}
        <div className="relative w-full">
          {/* Subtle horizontal connect line behind slots */}
          <div className="absolute top-[32px] left-8 right-8 h-[2px] bg-gradient-to-r from-gray-200 via-rose-200 to-gray-200 -z-0" />

          {/* Scrollable slots container */}
          <div className="overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            <div className="flex items-stretch gap-3 min-w-max px-1">
              {APPOINTMENTS.map((slot) => {
                const isSelected = slot.id === currentApt.id;
                const isImminent = slot.status === "Imminent";
                const isConcluded = slot.status === "Concluded";
                const isReady = slot.status === "Ready";

                return (
                  <button
                    key={slot.id}
                    onClick={() => {
                      setSelectedId(slot.id);
                      setCopilotDismissed(false);
                    }}
                    className={`relative text-left p-3.5 sm:p-4 rounded-2xl transition-all cursor-pointer w-[200px] sm:w-[220px] flex flex-col justify-between ${
                      isSelected
                        ? "bg-white border-2 border-[#E11D48] shadow-[0_12px_32px_rgba(225,29,72,0.12),0_2px_8px_rgba(0,0,0,0.04)] ring-4 ring-[#E11D48]/10 translate-y-[-2px]"
                        : "bg-white/80 border border-black/[0.06] hover:bg-white hover:border-black/[0.12] shadow-xs"
                    }`}
                  >
                    {/* Top Row: Time & Status Tag */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-semibold text-[#64748B] font-mono">
                        {slot.time}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isImminent
                            ? "bg-[#E11D48] text-white"
                            : isReady
                            ? "bg-emerald-100 text-emerald-800"
                            : isConcluded
                            ? "bg-gray-100 text-gray-600"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {slot.statusTag}
                      </span>
                    </div>

                    {/* Patient Name & Chief Complaint */}
                    <div className="mb-3">
                      <h4 className="text-sm font-bold text-[#1D1F22] truncate">
                        {slot.patientName}
                      </h4>
                      <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                        {slot.chiefComplaint}
                      </p>
                    </div>

                    {/* Bottom Metadata: Consult Type & Duration */}
                    <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-2 border-t border-black/[0.04]">
                      <span className="font-medium flex items-center gap-1">
                        {slot.consultType === "Video" ? (
                          <svg className="w-3 h-3 text-[#E11D48]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        )}
                        {slot.consultType}
                      </span>
                      <span className="font-mono text-[10px] text-[#1D1F22] font-semibold">
                        {slot.durationOrEta}
                      </span>
                    </div>

                    {/* Active Indicator Pip */}
                    {isSelected && (
                      <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#E11D48] border-2 border-white shadow-xs" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ==================== SELECTED PATIENT CONSULTATION DETAIL PANE ==================== */}
        <section className="bg-white/85 backdrop-blur-xl rounded-[28px] border border-white/90 shadow-[0_24px_60px_rgba(29,31,34,0.06),0_2px_8px_rgba(29,31,34,0.03),inset_0_1px_0_rgba(255,255,255,0.9)] p-5 sm:p-7">
          
          {/* Header Bar of Selected Patient */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-black/[0.06]">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-[#FEE2E2] text-[#E11D48] font-bold text-base flex items-center justify-center border border-[#FECDD3] shadow-xs">
                  {currentApt.avatar}
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#1D1F22]">
                    {currentApt.patientName}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-[#E11D48] text-white text-[10px] font-bold tracking-wide">
                    {currentApt.statusTag}
                  </span>
                  <span className="text-xs text-[#64748B] font-mono">
                    {currentApt.patientId}
                  </span>
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">
                  {currentApt.age} y · {currentApt.gender} · {currentApt.languages} · {currentApt.chiefComplaint}
                </p>
              </div>
            </div>

            {/* Right Badges: ABHA + Encrypted Room */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs font-semibold">
                <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                ABHA records linked
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 text-[#64748B] border border-gray-200/80 text-xs font-medium">
                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Encrypted room
              </span>
            </div>
          </div>

          {/* Split Detail Layout: Left Clinical Telemetry & Copilot, Right Live Video & Checklist */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
            
            {/* ================= LEFT COLUMN (7 COLS): TELEMETRY & COPILOT ================= */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              
              {/* Card 1: Live Wearable Feed with Animated SVG ECG Line */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-black/[0.06] shadow-xs">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[#E11D48] text-sm">
                      <svg className="w-4 h-4 text-[#E11D48] animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1D1F22]">
                      Live wearable feed
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    {currentApt.telemetry.rhythm}
                  </span>
                </div>

                {/* SVG Real-time ECG Waveform Simulation */}
                <div className="relative h-[90px] w-full bg-[#FAFBFD] rounded-xl border border-gray-100 overflow-hidden flex items-center">
                  {/* Subtle Grid Lines */}
                  <div
                    className="absolute inset-0 opacity-40 pointer-events-none"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, #E2E8F0 1px, transparent 1px), linear-gradient(to bottom, #E2E8F0 1px, transparent 1px)",
                      backgroundSize: "16px 16px",
                    }}
                  />
                  
                  {/* Flowing ECG Wave SVG */}
                  <svg
                    className="w-full h-[70px] relative z-10"
                    viewBox="0 0 800 100"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="ecgGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#E11D48" stopOpacity="0.4" />
                        <stop offset="70%" stopColor="#E11D48" stopOpacity="1" />
                        <stop offset="100%" stopColor="#FF4D4D" stopOpacity="1" />
                      </linearGradient>
                    </defs>
                    {/* Repeated medical P-Q-R-S-T rhythm pattern */}
                    <path
                      d="M0,50 L40,50 L48,45 L54,50 L70,50 L75,58 L82,10 L90,85 L96,44 L102,50 L120,50 L135,38 L150,50 L200,50 L240,50 L248,45 L254,50 L270,50 L275,58 L282,10 L290,85 L296,44 L302,50 L320,50 L335,38 L350,50 L400,50 L440,50 L448,45 L454,50 L470,50 L475,58 L482,10 L490,85 L496,44 L502,50 L520,50 L535,38 L550,50 L600,50 L640,50 L648,45 L654,50 L670,50 L675,58 L682,10 L690,85 L696,44 L702,50 L720,50 L735,38 L750,50 L800,50"
                      fill="none"
                      stroke="url(#ecgGlow)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* 4 Telemetry Metrics Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  {/* Heart Rate */}
                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-black/[0.04]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                      Heart rate
                    </span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xl font-bold text-[#1D1F22]">
                        {currentApt.telemetry.heartRate}
                      </span>
                      <span className="text-xs text-[#64748B]">bpm</span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600 block mt-0.5">
                      {currentApt.telemetry.heartRateStatus}
                    </span>
                  </div>

                  {/* HbA1c */}
                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-black/[0.04]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                      HbA1c
                    </span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xl font-bold text-[#E11D48]">
                        {currentApt.telemetry.hba1c}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#E11D48] block mt-0.5">
                      {currentApt.telemetry.hba1cDelta}
                    </span>
                  </div>

                  {/* Glucose Peak */}
                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-black/[0.04]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                      Glucose peak
                    </span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xl font-bold text-[#E11D48]">
                        {currentApt.telemetry.glucosePeak.split(" ")[0]}
                      </span>
                      <span className="text-[10px] text-[#64748B]">mg/dL</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#64748B] block mt-0.5">
                      {currentApt.telemetry.glucoseContext}
                    </span>
                  </div>

                  {/* Vitamin D */}
                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-black/[0.04]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                      Vitamin D
                    </span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xl font-bold text-amber-600">
                        {currentApt.telemetry.vitaminD.split(" ")[0]}
                      </span>
                      <span className="text-[10px] text-[#64748B]">ng/mL</span>
                    </div>
                    <span className="text-[11px] font-semibold text-amber-600 block mt-0.5">
                      {currentApt.telemetry.vitaminDStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: AETHRIZ Clinical Copilot Recommendation */}
              {!copilotDismissed ? (
                <div className="bg-gradient-to-br from-rose-50/70 via-white to-amber-50/40 rounded-2xl p-5 border border-rose-200/80 shadow-xs relative">
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-[#E11D48] text-white flex items-center justify-center text-xs shadow-xs">
                        ✦
                      </div>
                      <span className="text-xs font-bold text-[#E11D48] uppercase tracking-wider">
                        AETHRIZ clinical copilot
                      </span>
                    </div>
                    <span className="text-[11px] text-[#64748B]">
                      For clinician review · not a prescription
                    </span>
                  </div>

                  {/* Copilot Recommendation Headline */}
                  <h3 className="text-base sm:text-lg font-bold text-[#1D1F22] mb-1.5">
                    {currentApt.copilotPrompt.headline}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mb-3.5">
                    {currentApt.copilotPrompt.summary}
                  </p>

                  {/* Tags */}
                  <div className="flex items-center gap-1.5 flex-wrap mb-4">
                    {currentApt.copilotPrompt.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-full bg-white border border-rose-200 text-[11px] font-medium text-[#475569] shadow-2xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleAddToNotes}
                      className="px-4 py-2 rounded-xl bg-[#1D1F22] hover:bg-black text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      {notesAdded ? (
                        <>
                          <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Added to visit notes!</span>
                        </>
                      ) : (
                        <span>Add to visit notes</span>
                      )}
                    </button>
                    <button
                      onClick={() => setCopilotDismissed(true)}
                      className="px-4 py-2 rounded-xl bg-white hover:bg-gray-100 text-[#64748B] hover:text-[#1D1F22] text-xs font-medium border border-gray-200 transition-all cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-[#64748B] flex items-center justify-between">
                  <span>Copilot recommendation hidden.</span>
                  <button
                    onClick={() => setCopilotDismissed(false)}
                    className="text-[#E11D48] font-semibold hover:underline"
                  >
                    Restore
                  </button>
                </div>
              )}

              {/* Card 3: Doctor Clinical Visit Notes Area */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-black/[0.06] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1D1F22]">
                    Clinical visit notes
                  </span>
                  <span className="text-[11px] text-[#64748B]">Auto-saves to EMR</span>
                </div>
                <textarea
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="Type visit observations, diet guidelines, and medication adjustments here..."
                  rows={3}
                  className="w-full p-3 rounded-xl bg-[#F8FAFC] border border-gray-200 focus:border-[#E11D48] focus:bg-white text-xs text-[#1D1F22] outline-none transition-all resize-none"
                />
              </div>
            </div>

            {/* ================= RIGHT COLUMN (5 COLS): VIDEO ROOM & CHECKLIST ================= */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              
              {/* Dark Charcoal Video Consultation Preview Frame */}
              <div className="relative rounded-2xl bg-[#12161E] border border-[#232A3B] p-5 shadow-[0_16px_40px_rgba(18,22,30,0.3)] overflow-hidden flex flex-col justify-between h-[280px]">
                {/* Background Subtle Ambient Glow */}
                <div
                  className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-25 blur-3xl pointer-events-none"
                  style={{
                    background: "radial-gradient(circle, #E11D48 0%, transparent 70%)",
                  }}
                />

                {/* Top Status Bar: Patient Waiting & Timer */}
                <div className="flex items-center justify-between relative z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 text-white border border-white/10 text-xs font-medium backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Patient waiting
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-black/50 text-white font-mono text-xs font-semibold border border-white/10 backdrop-blur-md">
                    {formatTimer(waitTimer)}
                  </span>
                </div>

                {/* Center Patient Avatar & Name */}
                <div className="flex flex-col items-center justify-center relative z-10 my-auto">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-rose-200 text-[#1D1F22] text-2xl font-bold flex items-center justify-center shadow-lg border-2 border-white/20 mb-2">
                    {currentApt.avatar}
                  </div>
                  <h4 className="text-white font-bold text-base tracking-wide">
                    {currentApt.patientName}
                  </h4>
                  <span className="text-[11px] text-gray-400 mt-0.5">
                    Ready in secure waiting room
                  </span>
                </div>

                {/* Bottom Media Controls: Mic & Camera Toggle */}
                <div className="flex items-center justify-center gap-3 relative z-10 pt-2 border-t border-white/10">
                  <button
                    onClick={() => setIsMicMuted(!isMicMuted)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isMicMuted
                        ? "bg-[#E11D48] text-white"
                        : "bg-white/15 hover:bg-white/25 text-white"
                    }`}
                    title={isMicMuted ? "Unmute Mic" : "Mute Mic"}
                  >
                    {isMicMuted ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    )}
                  </button>

                  <button
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isVideoOff
                        ? "bg-[#E11D48] text-white"
                        : "bg-white/15 hover:bg-white/25 text-white"
                    }`}
                    title={isVideoOff ? "Turn On Camera" : "Turn Off Camera"}
                  >
                    {isVideoOff ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Pre-flight Checklist Card */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-black/[0.06] shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-3">
                  Pre-flight consultation checklist
                </span>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-[#1D1F22] font-medium">
                      <span className="text-emerald-600 font-bold">✓</span>
                      Digital consent
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 font-mono">
                      SIGNED
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-[#1D1F22] font-medium">
                      <span className="text-emerald-600 font-bold">✓</span>
                      AETHRIZ health summary
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 font-mono">
                      SYNCED
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-[#1D1F22] font-medium">
                      <span className="text-emerald-600 font-bold">✓</span>
                      Wearable data · 24 h
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 font-mono">
                      SYNCED
                    </span>
                  </div>
                </div>
              </div>

              {/* Primary Call Action & Split Aux Actions */}
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => setInCallModal(true)}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-sm tracking-wide shadow-[0_12px_28px_rgba(225,29,72,0.35)] hover:shadow-[0_16px_36px_rgba(225,29,72,0.45)] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Join teleconsult now</span>
                </button>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => setShowRecordsModal(true)}
                    className="py-2.5 px-4 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-[#1D1F22] text-xs font-semibold shadow-xs transition-all cursor-pointer text-center"
                  >
                    Open records
                  </button>
                  <button
                    onClick={() => setShowRescheduleModal(true)}
                    className="py-2.5 px-4 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-[#1D1F22] text-xs font-semibold shadow-xs transition-all cursor-pointer text-center"
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* ==================== LIVE TELECONSULT MODAL ==================== */}
      {inCallModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#12161E] text-white rounded-3xl border border-white/10 w-full max-w-4xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <h3 className="text-lg font-bold">
                    Teleconsultation in progress with {currentApt.patientName}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Encrypted WebRTC Channel · Resolution 1080p · Room ID: AE-ROOM-30418
                  </p>
                </div>
              </div>
              <span className="font-mono text-sm px-3 py-1 rounded-full bg-white/10">
                Live: {formatTimer(waitTimer)}
              </span>
            </div>

            {/* Video Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[320px] mb-6">
              <div className="bg-black/60 rounded-2xl border border-white/10 relative overflow-hidden flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-amber-100 text-[#1D1F22] text-2xl font-bold flex items-center justify-center mx-auto mb-2">
                    {currentApt.avatar}
                  </div>
                  <span className="text-sm font-semibold">{currentApt.patientName}</span>
                </div>
                <span className="absolute bottom-3 left-3 text-[11px] bg-black/60 px-2 py-0.5 rounded text-gray-300">
                  Patient stream
                </span>
              </div>

              <div className="bg-black/60 rounded-2xl border border-white/10 relative overflow-hidden flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-rose-200 text-[#E11D48] text-2xl font-bold flex items-center justify-center mx-auto mb-2">
                    AR
                  </div>
                  <span className="text-sm font-semibold">Dr. Ananya Rao (You)</span>
                </div>
                <span className="absolute bottom-3 left-3 text-[11px] bg-black/60 px-2 py-0.5 rounded text-gray-300">
                  Your feed {isMicMuted ? "(Mic Muted)" : ""}
                </span>
              </div>
            </div>

            {/* In-Call Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMicMuted(!isMicMuted)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold ${
                    isMicMuted ? "bg-red-600 text-white" : "bg-white/15 text-white hover:bg-white/25"
                  }`}
                >
                  {isMicMuted ? "Unmute" : "Mute"}
                </button>
                <button
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold ${
                    isVideoOff ? "bg-red-600 text-white" : "bg-white/15 text-white hover:bg-white/25"
                  }`}
                >
                  {isVideoOff ? "Start Video" : "Stop Video"}
                </button>
              </div>

              <button
                onClick={() => setInCallModal(false)}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg"
              >
                End Consult
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== RECORDS MODAL ==================== */}
      {showRecordsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-[#1D1F22]">
                ABHA Medical Records · {currentApt.patientName}
              </h3>
              <button
                onClick={() => setShowRecordsModal(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs text-[#475569]">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                <strong className="block text-[#1D1F22] mb-1">28 Oct 2026 · Comprehensive Metabolic Panel</strong>
                <p>HbA1c: 6.1% | Fasting Glucose: 112 mg/dL | Serum Creatinine: 0.9 mg/dL</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                <strong className="block text-[#1D1F22] mb-1">15 Jul 2026 · Baseline Lipid & Vitamin Panel</strong>
                <p>Total Cholesterol: 198 mg/dL | LDL: 128 mg/dL | 25-OH Vitamin D: 18.2 ng/mL</p>
              </div>
            </div>
            <button
              onClick={() => setShowRecordsModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#1D1F22] text-white text-xs font-semibold"
            >
              Close Records
            </button>
          </div>
        </div>
      )}

      {/* ==================== RESCHEDULE MODAL ==================== */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100">
            <h3 className="text-base font-bold text-[#1D1F22] mb-2">
              Reschedule {currentApt.patientName}
            </h3>
            <p className="text-xs text-[#64748B] mb-4">
              Select an alternative slot for today or tomorrow. Patient will receive an instant WhatsApp & SMS notification.
            </p>
            <div className="space-y-2 mb-4 text-xs">
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="w-full p-2.5 rounded-xl bg-gray-50 hover:bg-rose-50 text-left font-medium border border-gray-200"
              >
                Tomorrow · Sat 31 Oct at 10:00 AM
              </button>
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="w-full p-2.5 rounded-xl bg-gray-50 hover:bg-rose-50 text-left font-medium border border-gray-200"
              >
                Tomorrow · Sat 31 Oct at 4:30 PM
              </button>
            </div>
            <button
              onClick={() => setShowRescheduleModal(false)}
              className="w-full py-2 rounded-xl bg-gray-100 text-[#64748B] text-xs font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
