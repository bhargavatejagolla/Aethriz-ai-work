"use client";

import React, { useState, Suspense, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";

interface DoctorSummary {
  id: string;
  name: string;
  specialty: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  initials: string;
  avatarBg: string;
  avatarText: string;
  languages: string[];
  videoFee: number;
  clinicFee: number;
  clinicArea: string;
  isAiMatch: boolean;
}

const DOCTORS_LIST: DoctorSummary[] = [
  {
    id: "ananya-rao",
    name: "Dr. Ananya Rao",
    specialty: "Endocrinology",
    experienceYears: 14,
    rating: 4.9,
    reviewCount: 412,
    initials: "AR",
    avatarBg: "bg-gradient-to-br from-[#FFE5E8] to-[#FFD2D7]",
    avatarText: "text-[#1D1F22]",
    languages: ["English", "हिन्दी", "ಕನ್ನಡ"],
    videoFee: 800,
    clinicFee: 1000,
    clinicArea: "Koramangala, Bengaluru",
    isAiMatch: true,
  },
  {
    id: "vikram-menon",
    name: "Dr. Vikram Menon",
    specialty: "Cardiology",
    experienceYears: 18,
    rating: 4.8,
    reviewCount: 538,
    initials: "VM",
    avatarBg: "bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE]",
    avatarText: "text-[#1E40AF]",
    languages: ["English", "മലയാളം"],
    videoFee: 1200,
    clinicFee: 1500,
    clinicArea: "Indiranagar, Bengaluru",
    isAiMatch: false,
  },
  {
    id: "meera-iyer",
    name: "Dr. Meera Iyer",
    specialty: "Nutrition",
    experienceYears: 9,
    rating: 4.9,
    reviewCount: 298,
    initials: "MI",
    avatarBg: "bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5]",
    avatarText: "text-[#065F46]",
    languages: ["English", "தமிழ்", "हिन्दी"],
    videoFee: 600,
    clinicFee: 800,
    clinicArea: "Jayanagar, Bengaluru",
    isAiMatch: true,
  },
  {
    id: "arjun-sethi",
    name: "Dr. Arjun Sethi",
    specialty: "General Physician",
    experienceYears: 11,
    rating: 4.7,
    reviewCount: 821,
    initials: "AS",
    avatarBg: "bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A]",
    avatarText: "text-[#92400E]",
    languages: ["English", "हिन्दी", "ਪੰਜਾਬੀ"],
    videoFee: 500,
    clinicFee: 700,
    clinicArea: "Whitefield, Bengaluru",
    isAiMatch: false,
  },
  {
    id: "farah-siddiqui",
    name: "Dr. Farah Siddiqui",
    specialty: "Thyroid",
    experienceYears: 12,
    rating: 4.8,
    reviewCount: 233,
    initials: "FS",
    avatarBg: "bg-gradient-to-br from-[#FFF1F2] to-[#FFE4E6]",
    avatarText: "text-[#9F1239]",
    languages: ["English", "اردو", "हिन्दी"],
    videoFee: 800,
    clinicFee: 900,
    clinicArea: "Bandra West, Mumbai",
    isAiMatch: false,
  },
  {
    id: "rohan-kulkarni",
    name: "Dr. Rohan Kulkarni",
    specialty: "Endocrinology",
    experienceYears: 8,
    rating: 4.6,
    reviewCount: 154,
    initials: "RK",
    avatarBg: "bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF]",
    avatarText: "text-[#3730A3]",
    languages: ["English", "मराठी"],
    videoFee: 700,
    clinicFee: 900,
    clinicArea: "Shivajinagar, Pune",
    isAiMatch: true,
  },
  {
    id: "priya-banerjee",
    name: "Dr. Priya Banerjee",
    specialty: "Cardiology",
    experienceYears: 16,
    rating: 4.9,
    reviewCount: 367,
    initials: "PB",
    avatarBg: "bg-gradient-to-br from-[#F0FDFA] to-[#CCFBF1]",
    avatarText: "text-[#115E59]",
    languages: ["English", "বাংলা"],
    videoFee: 950,
    clinicFee: 1100,
    clinicArea: "Salt Lake, Kolkata",
    isAiMatch: false,
  },
  {
    id: "kavya-reddy",
    name: "Dr. Kavya Reddy",
    specialty: "Nutrition",
    experienceYears: 7,
    rating: 4.7,
    reviewCount: 189,
    initials: "KR",
    avatarBg: "bg-gradient-to-br from-[#FFF7ED] to-[#FFEDD5]",
    avatarText: "text-[#9A3412]",
    languages: ["English", "తెలుగు"],
    videoFee: 550,
    clinicFee: 750,
    clinicArea: "Banjara Hills, Hyderabad",
    isAiMatch: false,
  },
];

interface CalendarDay {
  id: string;
  dayLabel: string;
  dayNumber: string;
  monthLabel: string;
  fullDateLabel: string;
  isToday?: boolean;
}

const CALENDAR_DAYS: CalendarDay[] = [
  { id: "d-30", dayLabel: "Today", dayNumber: "30", monthLabel: "Oct", fullDateLabel: "Fri, 30 Oct", isToday: true },
  { id: "d-31", dayLabel: "Sat", dayNumber: "31", monthLabel: "Oct", fullDateLabel: "Sat, 31 Oct" },
  { id: "d-01", dayLabel: "Sun", dayNumber: "1", monthLabel: "Nov", fullDateLabel: "Sun, 1 Nov" },
  { id: "d-02", dayLabel: "Mon", dayNumber: "2", monthLabel: "Nov", fullDateLabel: "Mon, 2 Nov" },
  { id: "d-03", dayLabel: "Tue", dayNumber: "3", monthLabel: "Nov", fullDateLabel: "Tue, 3 Nov" },
  { id: "d-04", dayLabel: "Wed", dayNumber: "4", monthLabel: "Nov", fullDateLabel: "Wed, 4 Nov" },
  { id: "d-05", dayLabel: "Thu", dayNumber: "5", monthLabel: "Nov", fullDateLabel: "Thu, 5 Nov" },
];

interface SlotTime {
  time: string;
  available: boolean;
}

const TIME_SLOTS = {
  morning: [
    { time: "9:00 AM", available: false },
    { time: "9:30 AM", available: false },
    { time: "10:00 AM", available: false },
    { time: "11:30 AM", available: false },
  ],
  afternoon: [
    { time: "1:00 PM", available: false },
    { time: "2:30 PM", available: false },
    { time: "3:00 PM", available: false },
    { time: "4:30 PM", available: true },
  ],
  evening: [
    { time: "5:30 PM", available: true },
    { time: "6:30 PM", available: true },
    { time: "7:00 PM", available: false },
    { time: "8:00 PM", available: true },
  ],
};

function BookingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramDoctorId = searchParams.get("doctor") || "ananya-rao";
  const paramType = searchParams.get("type");

  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(paramDoctorId);
  const [consultType, setConsultType] = useState<"video" | "clinic">(
    paramType === "clinic" ? "clinic" : "video"
  );
  const [selectedDate, setSelectedDate] = useState<CalendarDay>(CALENDAR_DAYS[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [discussNotes, setDiscussNotes] = useState("");
  const [shareHealthSummary, setShareHealthSummary] = useState(true);
  const [showDoctorPicker, setShowDoctorPicker] = useState(false);

  // Animated Booking Confirmation State
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const doctor = useMemo(() => {
    return DOCTORS_LIST.find((d) => d.id === selectedDoctorId) || DOCTORS_LIST[0];
  }, [selectedDoctorId]);

  const consultationFee = consultType === "video" ? doctor.videoFee : doctor.clinicFee;
  const platformFee = 49;
  const totalAmount = consultationFee + platformFee;

  const handleConfirmBooking = () => {
    if (!selectedTime) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setBookingConfirmed(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F4F5F8] text-[#1D1F22] font-sans antialiased selection:bg-[#E3202B] selection:text-white pb-24 relative overflow-x-hidden">
      {/* Signature Ambient Red Navbar Glow */}
      <div className="ae-top-nav-glow" />
      {/* ============ TOP FLOATING NAVBAR MATCHING MOCKUP ============ */}
      <header className="sticky top-4 z-40 px-4 sm:px-6">
        <nav
          aria-label="Main"
          className="relative max-w-[1100px] mx-auto p-2 pl-4 sm:pl-5 flex items-center justify-between gap-3 rounded-full border border-white/80 shadow-[0_20px_50px_rgba(220,120,140,0.12),0_2px_8px_rgba(29,31,34,0.04),inset_0_1.5px_0_rgba(255,255,255,0.95)]"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.80) 50%, rgba(255,255,255,0.92) 100%)",
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
            <div className="flex flex-col">
              <span
                className="font-semibold text-[15.5px] tracking-[0.14em] text-[#1D1F22] leading-none"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                AETHRIZ
              </span>
              <span className="text-[8px] font-mono tracking-widest text-[#E3202B] uppercase font-bold mt-0.5">
                BIO-HEALTH AI
              </span>
            </div>
          </Link>

          {/* Center Navigation Pills */}
          <div className="hidden md:flex items-center gap-1 text-[13px] font-medium text-[#545B61]">
            <Link
              href="/dashboard"
              className="px-3.5 py-1.5 rounded-full hover:text-[#1D1F22] hover:bg-white/50 transition-all"
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
              className="px-4 py-1.5 rounded-full bg-white text-[#1D1F22] font-semibold shadow-xs border border-slate-200/70 transition-all"
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

          {/* Right User Avatar Pill Matching Mockup */}
          <Link
            href="/profile"
            className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-[#FCECEE] hover:bg-[#F9DDE1] border border-[#F6C6CC] transition-all cursor-pointer shadow-2xs group"
          >
            <div className="relative w-6 h-6 rounded-full bg-[#E3202B] text-white flex items-center justify-center font-bold text-[10px]">
              AK
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#E3202B] border-2 border-white ring-1 ring-red-400" />
            </div>
            <span className="text-xs font-semibold text-[#7F1D1D] hidden sm:inline">
              My profile
            </span>
          </Link>
        </nav>
      </header>

      {/* ============ MAIN CONTAINER ============ */}
      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-5 sm:pt-7 space-y-6">
        
        {/* ============ BREADCRUMB & PAGE TITLE ============ */}
        <div>
          <Link
            href="/doctors"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#64748B] hover:text-[#1D1F22] transition-colors mb-2"
          >
            <span>←</span>
            <span>All doctors</span>
          </Link>
          <h1
            className="text-4xl sm:text-5xl font-light tracking-tight text-[#1D1F22]"
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            Book your consultation.
          </h1>
        </div>

        {/* ============ 2-COLUMN MAIN LAYOUT ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ============ LEFT COLUMN: 4 BOOKING STEPS (7 COLS) ============ */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* DOCTOR SUMMARY CARD WITH AMBIENT GRADIENT */}
            <div
              className="rounded-[28px] p-5 sm:p-6 border border-slate-200/80 shadow-[0_8px_30px_rgba(29,31,34,0.03)] flex items-center justify-between gap-4 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #FFFFFF 65%, #FFF0F2 100%)",
              }}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className={`w-14 h-14 rounded-2xl ${doctor.avatarBg} ${doctor.avatarText} flex items-center justify-center font-bold text-lg shadow-2xs flex-shrink-0`}
                >
                  {doctor.initials}
                </div>

                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-[#1D1F22] truncate">
                    {doctor.name}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5 truncate">
                    {doctor.specialty} · {doctor.experienceYears} yrs · {doctor.languages.join(", ")}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    {doctor.isAiMatch && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold text-[#E3202B] bg-[#FFF1F2] border border-red-200/80">
                        AI match for your profile
                      </span>
                    )}
                    <span className="text-xs font-semibold text-[#1D1F22] flex items-center gap-1">
                      <span className="text-amber-500">★</span>
                      <span>{doctor.rating} · {doctor.reviewCount} reviews</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Change Doctor Button */}
              <button
                type="button"
                onClick={() => setShowDoctorPicker(!showDoctorPicker)}
                className="px-4 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#1D1F22] text-xs font-semibold transition-all cursor-pointer flex-shrink-0"
              >
                Change
              </button>
            </div>

            {/* DOCTOR PICKER DRAWER / MODAL */}
            {showDoctorPicker && (
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-lg space-y-2 ae-fade-in">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#94A3B8] font-bold block mb-1">
                  Select a Different Doctor
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DOCTORS_LIST.map((doc) => (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => {
                        setSelectedDoctorId(doc.id);
                        setShowDoctorPicker(false);
                      }}
                      className={`text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                        selectedDoctorId === doc.id
                          ? "bg-red-50 border border-red-300 font-bold text-[#E3202B]"
                          : "bg-slate-50 hover:bg-slate-100 text-[#1D1F22] border border-slate-100"
                      }`}
                    >
                      <div>
                        <p className="font-semibold">{doc.name}</p>
                        <p className="text-[10.5px] text-[#64748B]">{doc.specialty}</p>
                      </div>
                      <span className="text-xs font-bold">₹{doc.videoFee}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 1: HOW WOULD YOU LIKE TO CONSULT? */}
            <div className="bg-white rounded-[28px] p-6 border border-slate-200/80 shadow-[0_8px_30px_rgba(29,31,34,0.03)] space-y-3">
              <h4 className="text-sm font-bold text-[#1D1F22]">
                1 · How would you like to consult?
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Option 1: Video Consult */}
                <div
                  onClick={() => setConsultType("video")}
                  className={`p-4 rounded-2xl transition-all cursor-pointer flex items-center gap-3.5 ${
                    consultType === "video"
                      ? "bg-red-50/40 border-2 border-red-400 ring-2 ring-red-100/60 shadow-xs"
                      : "bg-white border border-slate-200/80 hover:bg-slate-50"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      consultType === "video" ? "bg-red-100 text-[#E3202B]" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <polygon points="23 7 16 12 23 17 23 7" />
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#1D1F22]">Video consult</h5>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      From home · ₹{doctor.videoFee}
                    </p>
                  </div>
                </div>

                {/* Option 2: In-clinic Visit */}
                <div
                  onClick={() => setConsultType("clinic")}
                  className={`p-4 rounded-2xl transition-all cursor-pointer flex items-center gap-3.5 ${
                    consultType === "clinic"
                      ? "bg-red-50/40 border-2 border-red-400 ring-2 ring-red-100/60 shadow-xs"
                      : "bg-white border border-slate-200/80 hover:bg-slate-50"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      consultType === "clinic" ? "bg-red-100 text-[#E3202B]" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#1D1F22]">In-clinic visit</h5>
                    <p className="text-[11px] text-[#64748B] mt-0.5 truncate">
                      {doctor.clinicArea} · ₹{doctor.clinicFee}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 2 & 3: DATE & TIME SELECTOR CONTAINER */}
            <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-slate-200/80 shadow-[0_8px_30px_rgba(29,31,34,0.03)] space-y-6">
              
              {/* STEP 2: PICK A DATE */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#1D1F22]">
                    2 · Pick a date
                  </h4>
                  <span className="text-xs font-medium text-[#64748B]">
                    Oct – Nov 2026
                  </span>
                </div>

                {/* Horizontal Date Picker Strip Matching Exact Mockup */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {CALENDAR_DAYS.map((day) => {
                    const isSelected = selectedDate.id === day.id;
                    return (
                      <button
                        key={day.id}
                        type="button"
                        onClick={() => {
                          setSelectedDate(day);
                          // Reset time to ensure active choice on date switch
                          setSelectedTime(null);
                        }}
                        className={`flex-1 min-w-[58px] py-3 px-2 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#18191E] text-white shadow-md scale-[1.03]"
                            : "bg-white text-[#1D1F22] border border-slate-200/80 hover:bg-slate-50"
                        }`}
                      >
                        <span className={`text-[11px] ${isSelected ? "text-white/80" : "text-[#64748B]"}`}>
                          {day.dayLabel}
                        </span>
                        <span className="text-base sm:text-lg font-bold my-0.5">
                          {day.dayNumber}
                        </span>
                        <span className={`text-[10px] uppercase font-mono ${isSelected ? "text-white/70" : "text-[#94A3B8]"}`}>
                          {day.monthLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 3: CHOOSE A TIME */}
              <div className="space-y-4 pt-3 border-t border-slate-100">
                <h4 className="text-sm font-bold text-[#1D1F22]">
                  3 · Choose a time
                </h4>

                {/* Morning Slots */}
                <div className="space-y-1.5">
                  <span className="text-[11px] text-[#94A3B8] font-medium block">
                    Morning
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {TIME_SLOTS.morning.map((slot) => {
                      const isSelected = selectedTime === slot.time;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => slot.available && setSelectedTime(slot.time)}
                          className={`py-2 px-1 rounded-xl text-xs font-semibold transition-all text-center ${
                            !slot.available
                              ? "bg-slate-100/60 text-[#94A3B8] line-through cursor-not-allowed border border-slate-200/40"
                              : isSelected
                              ? "bg-[#E3202B] text-white shadow-sm ring-2 ring-red-200"
                              : "bg-white border border-slate-200/80 text-[#1D1F22] hover:bg-slate-50 cursor-pointer"
                          }`}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Afternoon Slots */}
                <div className="space-y-1.5">
                  <span className="text-[11px] text-[#94A3B8] font-medium block">
                    Afternoon
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {TIME_SLOTS.afternoon.map((slot) => {
                      const isSelected = selectedTime === slot.time;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => slot.available && setSelectedTime(slot.time)}
                          className={`py-2 px-1 rounded-xl text-xs font-semibold transition-all text-center ${
                            !slot.available
                              ? "bg-slate-100/60 text-[#94A3B8] line-through cursor-not-allowed border border-slate-200/40"
                              : isSelected
                              ? "bg-[#E3202B] text-white shadow-sm ring-2 ring-red-200"
                              : "bg-white border border-slate-200/80 text-[#1D1F22] hover:bg-slate-50 cursor-pointer"
                          }`}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Evening Slots */}
                <div className="space-y-1.5">
                  <span className="text-[11px] text-[#94A3B8] font-medium block">
                    Evening
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {TIME_SLOTS.evening.map((slot) => {
                      const isSelected = selectedTime === slot.time;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => slot.available && setSelectedTime(slot.time)}
                          className={`py-2 px-1 rounded-xl text-xs font-semibold transition-all text-center ${
                            !slot.available
                              ? "bg-slate-100/60 text-[#94A3B8] line-through cursor-not-allowed border border-slate-200/40"
                              : isSelected
                              ? "bg-[#E3202B] text-white shadow-sm ring-2 ring-red-200"
                              : "bg-white border border-slate-200/80 text-[#1D1F22] hover:bg-slate-50 cursor-pointer"
                          }`}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>

            {/* STEP 4: WHAT WOULD YOU LIKE TO DISCUSS? */}
            <div className="bg-white rounded-[28px] p-6 border border-slate-200/80 shadow-[0_8px_30px_rgba(29,31,34,0.03)] space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#1D1F22]">
                  4 · What would you like to discuss?
                </h4>
                <span className="text-xs text-[#94A3B8]">Optional</span>
              </div>

              <textarea
                rows={3}
                value={discussNotes}
                onChange={(e) => setDiscussNotes(e.target.value)}
                placeholder="e.g. My HbA1c is borderline — how should I change my diet?"
                className="w-full p-4 rounded-2xl border border-slate-200/90 text-xs sm:text-sm text-[#1D1F22] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#E3202B] transition-colors resize-none"
              />

              {/* Share AETHRIZ Health Summary Banner */}
              <div
                className="p-4 rounded-2xl flex items-center justify-between gap-4 border transition-all"
                style={{
                  background: "linear-gradient(135deg, #FFF9FA 0%, #FFF1F3 100%)",
                  borderColor: "rgba(244, 63, 94, 0.2)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#E3202B] text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#1D1F22]">
                      Share my AETHRIZ health summary
                    </h5>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      The doctor sees your biomarkers and trends before the visit.
                    </p>
                  </div>
                </div>

                {/* Toggle Switch */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={shareHealthSummary}
                  onClick={() => setShareHealthSummary(!shareHealthSummary)}
                  className={`w-11 h-6 rounded-full transition-colors cursor-pointer p-0.5 flex items-center flex-shrink-0 ${
                    shareHealthSummary ? "bg-[#E3202B]" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      shareHealthSummary ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

          </div>

          {/* ============ RIGHT COLUMN: DARK OBSIDIAN BOOKING SUMMARY CARD (5 COLS) ============ */}
          <div className="lg:col-span-5 sticky top-24">
            <div
              className="rounded-[28px] p-7 text-white shadow-[0_24px_50px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col justify-between"
              style={{
                background: "linear-gradient(145deg, #18191E 0%, #15161A 50%, #201116 100%)",
              }}
            >
              {/* Soft Ambient Diffuse Red Glow in Corner */}
              <div
                className="absolute -top-12 -right-12 w-44 h-44 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(227,32,43,0.3) 0%, transparent 70%)",
                  filter: "blur(32px)",
                }}
              />

              <div className="relative z-10 space-y-4">
                <span className="text-[10px] font-mono tracking-widest text-[#FF6B6F] uppercase font-bold block">
                  BOOKING SUMMARY
                </span>

                {/* Summary Rows Table */}
                <div className="space-y-3 text-xs pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Doctor</span>
                    <span className="font-semibold text-white">{doctor.name}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Type</span>
                    <span className="font-semibold text-white capitalize">
                      {consultType === "video" ? "Video consult" : "In-clinic visit"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Date</span>
                    <span className="font-semibold text-white">
                      {selectedDate.fullDateLabel}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Time</span>
                    {selectedTime ? (
                      <span className="font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
                        {selectedTime}
                      </span>
                    ) : (
                      <span className="font-semibold text-[#FF6B6F] animate-pulse">
                        Select a time
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Health summary</span>
                    <span className={`font-semibold ${shareHealthSummary ? "text-emerald-400" : "text-slate-400"}`}>
                      {shareHealthSummary ? "Shared" : "Not shared"}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 pt-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Consultation fee</span>
                    <span className="font-semibold text-white">₹{consultationFee}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Platform fee</span>
                    <span className="font-semibold text-white">₹{platformFee}</span>
                  </div>
                </div>

                {/* Total Row */}
                <div className="border-t border-white/10 pt-4 flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-white/80">Total</span>
                  <span className="text-3xl font-extrabold text-white">
                    ₹{totalAmount}
                  </span>
                </div>

                {/* Primary CTA Button */}
                <button
                  type="button"
                  disabled={!selectedTime || isProcessing}
                  onClick={handleConfirmBooking}
                  className={`w-full py-4 rounded-full text-xs font-semibold tracking-wide transition-all active:scale-95 cursor-pointer mt-2 shadow-lg flex items-center justify-center gap-2 ${
                    !selectedTime
                      ? "bg-white/10 text-white/40 cursor-not-allowed"
                      : "bg-[#E3202B] hover:bg-[#C8161F] text-white shadow-red-900/30 font-bold"
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Confirming appointment...</span>
                    </div>
                  ) : !selectedTime ? (
                    <span>Choose a time to continue</span>
                  ) : (
                    <span>Confirm & Pay ₹{totalAmount} →</span>
                  )}
                </button>

                {/* Cancellation Note */}
                <p className="text-center text-[11px] text-white/50 pt-1 flex items-center justify-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>Free cancellation up to 4 hours before</span>
                </p>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* ============ ANIMATED BOOKING SUCCESS MODAL ============ */}
      {bookingConfirmed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm ae-fade-in">
          <div className="bg-white rounded-[32px] max-w-lg w-full p-7 sm:p-8 shadow-2xl border border-slate-100 text-center relative overflow-hidden scale-100 transition-all">
            
            {/* Ambient Success Halo */}
            <div
              className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)",
                filter: "blur(32px)",
              }}
            />

            {/* Pulsing Animated Checkmark Ring */}
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-400 mx-auto flex items-center justify-center text-2xl font-bold shadow-lg animate-bounce">
              ✓
            </div>

            <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-700 font-bold block mt-4">
              APPOINTMENT CONFIRMED · #AETH-88219
            </span>

            <h3 className="text-2xl font-bold text-[#1D1F22] mt-1 tracking-tight">
              You&apos;re all set with {doctor.name}!
            </h3>

            <p className="text-xs text-[#64748B] mt-2 max-w-sm mx-auto leading-relaxed">
              We&apos;ve sent the calendar invite and confirmation SMS to your registered contact.
            </p>

            {/* Appointment Details Box */}
            <div className="bg-[#F8FAFC] rounded-2xl p-4 my-5 border border-slate-200/80 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Date & Time</span>
                <span className="font-bold text-[#1D1F22]">
                  {selectedDate.fullDateLabel} at {selectedTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Consultation Format</span>
                <span className="font-bold text-[#1D1F22] capitalize">
                  {consultType === "video" ? "Secure Video Room" : `In-clinic (${doctor.clinicArea})`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">AETHRIZ Clinical Summary</span>
                <span className="font-bold text-emerald-600">Synced to Doctor</span>
              </div>
              {consultType === "video" && (
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[#64748B]">Encrypted Video Link</span>
                  <span className="font-mono text-[#E3202B] font-semibold text-[11px] truncate max-w-[200px]">
                    meet.aethriz.com/consult/88219
                  </span>
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/dashboard"
                className="w-full py-3.5 rounded-full bg-[#18191E] hover:bg-black text-white text-xs font-semibold shadow-md active:scale-95 transition-all text-center"
              >
                Go to Dashboard
              </Link>
              <button
                type="button"
                onClick={() => setBookingConfirmed(false)}
                className="w-full py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-[#1D1F22] text-xs font-semibold transition-all cursor-pointer"
              >
                Close & Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F4F5F8] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-red-200 border-t-[#E3202B] animate-spin" />
        </div>
      }
    >
      <BookingPageContent />
    </Suspense>
  );
}
