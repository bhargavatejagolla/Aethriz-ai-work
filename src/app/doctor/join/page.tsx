"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import DoctorNavbar from "@/components/navigation/DoctorNavbar";

const SPECIALTIES = [
  "Endocrinology",
  "Cardiology",
  "Diabetology",
  "General Medicine",
  "Thyroid & Metabolism",
  "Nutrition & Dietetics",
  "Pediatrics",
  "Neurology",
  "Dermatology",
  "Pulmonology",
];

const AVAILABLE_LANGUAGES = [
  { id: "en", name: "English" },
  { id: "hi", name: "हिन्दी" },
  { id: "bn", name: "বাংলা" },
  { id: "te", name: "తెలుగు" },
  { id: "mr", name: "मराठी" },
  { id: "ta", name: "தமிழ்" },
  { id: "gu", name: "ગુજરાતી" },
  { id: "kn", name: "ಕನ್ನಡ" },
  { id: "ml", name: "മലയാളം" },
  { id: "ur", name: "اردو" },
];

export default function DoctorJoinPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [specialty, setSpecialty] = useState("Endocrinology");
  const [regNo, setRegNo] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["en", "hi"]);
  const [clinicalBio, setClinicalBio] = useState("");
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModal, setIsSuccessModal] = useState(false);

  const toggleLanguage = (id: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setUploadedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFile || !isConfirmed) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccessModal(true);
    }, 1200);
  };

  const wordCount = clinicalBio.trim() ? clinicalBio.trim().split(/\s+/).length : 0;
  const isFormReady = !!uploadedFile && isConfirmed;

  return (
    <div className="min-h-screen bg-[#F4F5F8] text-[#1D1F22] font-sans antialiased selection:bg-[#E3202B] selection:text-white pb-24 relative overflow-x-hidden">
      
      {/* ============================================================== */}
      {/* SIGNATURE TOP AMBIENT RED GLOW HALO                            */}
      {/* ============================================================== */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-48 sm:h-56 pointer-events-none z-30 overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 65% 180px at 85% -20px, rgba(227, 32, 43, 0.38) 0%, rgba(254, 205, 211, 0.22) 42%, transparent 75%), " +
            "radial-gradient(ellipse 65% 180px at 15% -20px, rgba(244, 63, 94, 0.30) 0%, rgba(254, 205, 211, 0.18) 42%, transparent 75%), " +
            "radial-gradient(ellipse 80% 150px at 50% -20px, rgba(251, 113, 133, 0.24) 0%, rgba(254, 226, 226, 0.12) 48%, transparent 78%)",
          filter: "blur(20px)",
        }}
      />

      {/* Decorative 3D Ambient Floating Spheres */}
      {/* Left Pale Pink Sphere */}
      <div
        aria-hidden="true"
        className="hidden xl:block absolute top-[280px] left-6 w-28 h-28 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle at 35% 30%, #FFF5F5 0%, #FED7AA 30%, #FCA5A5 75%, #F87171 100%)",
          boxShadow: "0 20px 40px rgba(239, 68, 68, 0.18)",
          opacity: 0.85,
        }}
      />

      {/* Right Crimson 3D Sphere */}
      <div
        aria-hidden="true"
        className="hidden xl:block absolute top-[480px] right-8 w-24 h-24 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle at 32% 28%, #FF858B 0%, #E3202B 42%, #8E0C14 100%)",
          boxShadow: "0 22px 45px rgba(227, 32, 43, 0.28)",
          opacity: 0.9,
        }}
      />

      {/* ============ STANDARD DOCTOR NAVBAR ============ */}
      <DoctorNavbar activeTab="join" />

      {/* ============ MAIN APPLICATION CONTAINER ============ */}
      <main className="max-w-[940px] mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        
        {/* Verification Subheader Bar */}
        <div className="flex items-center justify-between text-xs font-semibold text-[#64748B]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] uppercase tracking-wider font-mono">AETHRIZ CLINICAL NETWORK</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-slate-600">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              NMC registration verified
            </span>
            <span className="flex items-center gap-1 text-slate-600">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Encrypted documents
            </span>
          </div>
        </div>

        {/* ============ MAIN APPLICATION CARD ============ */}
        <div className="bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-12 border border-slate-200/80 shadow-[0_20px_50px_rgba(29,31,34,0.06)] relative overflow-hidden">
          
          {/* Subtle Top Radial Aura Inside Card */}
          <div
            aria-hidden="true"
            className="absolute -top-16 left-1/2 -translate-x-1/2 w-[540px] h-48 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse, rgba(254, 205, 211, 0.45) 0%, rgba(255, 241, 242, 0.15) 50%, transparent 75%)",
              filter: "blur(20px)",
            }}
          />

          {/* Center Stethoscope Orbit Emblem */}
          <div className="relative flex flex-col items-center text-center space-y-4">
            
            {/* Orbital Ring with Stethoscope */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              {/* Outer Orbit Track */}
              <div className="absolute inset-0 rounded-full border border-dashed border-red-200/90 animate-spin" style={{ animationDuration: "25s" }} />
              
              {/* Orbiting Green Node */}
              <div className="absolute top-1 left-2 w-2 h-2 rounded-full bg-emerald-500 shadow-xs" />
              {/* Orbiting Red Node */}
              <div className="absolute bottom-2 right-1 w-2 h-2 rounded-full bg-[#E3202B] shadow-xs" />

              {/* Center Stethoscope Sphere */}
              <div
                className="relative w-14 h-14 rounded-full flex items-center justify-center text-white shadow-[0_8px_20px_rgba(227,32,43,0.35)]"
                style={{
                  background: "radial-gradient(circle at 32% 28%, #FF6B72 0%, #E3202B 50%, #8E0C14 100%)",
                }}
              >
                {/* Stethoscope Icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.5 3v5a4.5 4.5 0 0 0 9 0V3" />
                  <path d="M9 12.5v3.5a4 4 0 0 0 8 0V11" />
                  <circle cx="17" cy="10" r="2" fill="currentColor" />
                </svg>
              </div>
            </div>

            {/* Applications Open Cohort Badge */}
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-[#E3202B] border border-rose-200/70 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E3202B] animate-ping" />
                <span>Applications open · Cohort 2027</span>
              </span>
            </div>

            {/* Main Headline */}
            <div className="max-w-xl mx-auto space-y-2">
              <h1
                className="text-3xl sm:text-4xl lg:text-[40px] font-semibold text-[#1D1F22] tracking-tight"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                Join the AETHRIZ medical team.
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed max-w-lg mx-auto">
                Consult patients who arrive informed, work alongside AI that does the reading, and help make good care reachable in every language of Bharat.
              </p>
            </div>
          </div>

          {/* 3 Core Value Props in Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-8">
            
            {/* Card 1: AI clinical copilot */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/70 text-center space-y-1">
              <div className="w-7 h-7 mx-auto rounded-full bg-rose-50 text-[#E3202B] flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l2.5 6.5L21 11l-5 4.5L17.5 22 12 18.5 6.5 22 8 15.5 3 11l6.5-2.5z" />
                </svg>
              </div>
              <h3 className="text-xs font-bold text-[#1D1F22]">AI clinical copilot</h3>
              <p className="text-[11px] text-[#64748B]">Reports pre-read and summarised</p>
            </div>

            {/* Card 2: Publish & teach */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/70 text-center space-y-1">
              <div className="w-7 h-7 mx-auto rounded-full bg-rose-50 text-[#E3202B] flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <h3 className="text-xs font-bold text-[#1D1F22]">Publish & teach</h3>
              <p className="text-[11px] text-[#64748B]">Write for patients in their language</p>
            </div>

            {/* Card 3: Smart triage */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/70 text-center space-y-1">
              <div className="w-7 h-7 mx-auto rounded-full bg-rose-50 text-[#E3202B] flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <h3 className="text-xs font-bold text-[#1D1F22]">Smart triage</h3>
              <p className="text-[11px] text-[#64748B]">The right patients, at the right time</p>
            </div>
          </div>

          {/* ============ APPLICATION FORM ============ */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Row 1: Full name, Professional email, Primary specialty */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Full name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#1D1F22]">
                  Full name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Dr. Firstname Lastname"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-[#1D1F22] placeholder:text-slate-400 focus:outline-hidden focus:border-[#E3202B] focus:ring-2 focus:ring-red-100 transition-all shadow-2xs"
                />
              </div>

              {/* Professional email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#1D1F22]">
                  Professional email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@hospital.in"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-[#1D1F22] placeholder:text-slate-400 focus:outline-hidden focus:border-[#E3202B] focus:ring-2 focus:ring-red-100 transition-all shadow-2xs"
                />
              </div>

              {/* Primary specialty */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#1D1F22]">
                  Primary specialty
                </label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-[#1D1F22] focus:outline-hidden focus:border-[#E3202B] focus:ring-2 focus:ring-red-100 transition-all shadow-2xs cursor-pointer"
                >
                  {SPECIALTIES.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: NMC / State council reg. no. */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-[#1D1F22]">
                  NMC / State council reg. no.
                </label>
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Instant check
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  placeholder="e.g. KMC-12345"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50/70 border border-slate-200 text-xs sm:text-sm text-[#1D1F22] placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-[#E3202B] focus:ring-2 focus:ring-red-100 transition-all shadow-2xs"
                />
                {regNo.length >= 5 && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-600 text-xs font-semibold flex items-center gap-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Verified format</span>
                  </div>
                )}
              </div>
            </div>

            {/* Row 3: Languages you consult in (Multi-Select Pills) */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#1D1F22]">
                Languages you consult in
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_LANGUAGES.map((lang) => {
                  const isSelected = selectedLanguages.includes(lang.id);
                  return (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => toggleLanguage(lang.id)}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#1D1F22] text-white shadow-2xs font-semibold"
                          : "bg-white hover:bg-slate-100 text-[#475569] border border-slate-200/80"
                      }`}
                    >
                      {lang.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 4: Clinical background & focus */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-[#1D1F22]">
                  Clinical background & focus
                </label>
                <span className="text-[#94A3B8] font-mono text-[11px]">
                  {wordCount} / 100-300 words
                </span>
              </div>
              <textarea
                rows={4}
                value={clinicalBio}
                onChange={(e) => setClinicalBio(e.target.value)}
                placeholder="Training, hospital affiliations, areas of interest..."
                className="w-full p-4 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-[#1D1F22] placeholder:text-slate-400 focus:outline-hidden focus:border-[#E3202B] focus:ring-2 focus:ring-red-100 transition-all shadow-2xs resize-y"
              />
            </div>

            {/* Row 5: CV & certificates (Dropzone) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-[#1D1F22]">
                  CV & certificates
                </label>
                <span className="text-[#94A3B8] font-mono text-[11px]">
                  PDF · up to 10 MB
                </span>
              </div>

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-red-200/90 hover:border-red-400 rounded-3xl p-6 text-center transition-all bg-rose-50/20"
              >
                <input
                  type="file"
                  id="cv-upload"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {uploadedFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-[#1D1F22]">{uploadedFile.name}</p>
                      <p className="text-[11px] text-[#64748B]">{uploadedFile.size} · Uploaded</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUploadedFile(null)}
                      className="ml-3 text-xs text-red-500 hover:underline font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label htmlFor="cv-upload" className="cursor-pointer block space-y-2">
                    <div className="w-10 h-10 rounded-full bg-rose-100 text-[#E3202B] mx-auto flex items-center justify-center">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-[#1D1F22]">
                        Upload your CV and degree certificates
                      </p>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        Drag and drop, or <span className="text-[#E3202B] underline font-semibold">browse files</span>
                      </p>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Row 6: Confirmation Checkbox */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                id="consent-check"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                className="mt-0.5 rounded text-[#E3202B] focus:ring-red-400 cursor-pointer"
              />
              <label htmlFor="consent-check" className="text-xs text-[#64748B] leading-relaxed cursor-pointer select-none">
                I confirm my medical registration is active and authorise AETHRIZ to verify it with the National Medical Commission and my State Medical Council.
              </label>
            </div>

            {/* Row 7: Action Button */}
            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={!isFormReady || isSubmitting}
                className={`w-full py-3.5 px-6 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs ${
                  isFormReady
                    ? "bg-[#E3202B] hover:bg-[#c91822] text-white shadow-[0_8px_20px_rgba(227,32,43,0.25)] active:scale-98"
                    : "bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Verifying credentials with NMC...</span>
                  </span>
                ) : !uploadedFile ? (
                  "Upload your CV to continue"
                ) : !isConfirmed ? (
                  "Confirm authorization to continue"
                ) : (
                  "Submit application →"
                )}
              </button>
              
              <p className="text-[11px] text-[#94A3B8] text-center">
                Applications are reviewed by our clinical team. Submitting does not create a public profile.
              </p>
            </div>
          </form>
        </div>

        {/* ============ BOTTOM 3 SUPPORTING CARDS ============ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          
          {/* Card 1: AI built into your workflow */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-2xs flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-50 text-[#E3202B] flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1D1F22]">AI built into your workflow</h4>
              <p className="text-[11px] text-[#64748B] mt-0.5 leading-relaxed">
                Report summaries, trends and food-scan data before every visit.
              </p>
            </div>
          </div>

          {/* Card 2: Teleconsult support */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-2xs flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-50 text-[#E3202B] flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1D1F22]">Teleconsult support</h4>
              <p className="text-[11px] text-[#64748B] mt-0.5 leading-relaxed">
                [INDEMNITY & COMPLIANCE DETAILS]
              </p>
            </div>
          </div>

          {/* Card 3: Learning & authorship */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-2xs flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-50 text-[#E3202B] flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="6" />
                <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1D1F22]">Learning & authorship</h4>
              <p className="text-[11px] text-[#64748B] mt-0.5 leading-relaxed">
                Contribute articles and help validate AI models.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ============ SUCCESS SUBMISSION MODAL ============ */}
      {isSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-7 text-center shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#1D1F22]">Application Received</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Thank you, Dr. {fullName || "Doctor"}. Your NMC credentials ({regNo || "KMC-12345"}) and documents have been securely encrypted and routed to our medical director for review.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-left text-xs text-[#64748B] space-y-1">
              <p className="font-semibold text-[#1D1F22]">Next steps:</p>
              <p>• Verification with State Medical Council (24-48h)</p>
              <p>• Clinical copilot orientation & test teleconsult invite</p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3">
              <Link
                href="/doctor-portal"
                className="px-6 py-2.5 rounded-full bg-[#1D1F22] text-white text-xs font-semibold hover:opacity-90"
              >
                Go to Doctor Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
