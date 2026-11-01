"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import PatientNavbar from "@/components/navigation/PatientNavbar";
import {
  CLINICAL_DEFAULT_VISIBLE,
  getStructureExplanation,
  type Atlas,
  type Concept,
  type SceneState,
  type SystemId,
  type View,
} from "@/components/anatomy/anatomy";

// Dynamically import AnatomyScene from ashemag-human-atlas
const AnatomyScene = dynamic(
  () => import("@/components/anatomy/AnatomyScene"),
  { ssr: false }
);

const initialSceneState: SceneState = {
  explode: 0,
  visible: CLINICAL_DEFAULT_VISIBLE,
  selected: [],
  isolate: false,
  view: "front",
  rotate: false,
  reset: 0,
};

interface BiomarkerItem {
  label: string;
  value: string;
  status: "optimal" | "watch" | "attention";
}

interface OrganDetail {
  id: string;
  key: string;
  conceptQuery: string;
  name: string;
  vernacular: string;
  system: SystemId;
  systemName: string;
  color: string;
  icon: string;
  badge: string;
  description: string;
  clinicalSignificance: string;
  biomarkers: BiomarkerItem[];
  careRecommendation: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorInitials: string;
}

const ORGAN_DATABASE: Record<string, OrganDetail> = {
  shoulder: {
    id: "NODE R-SHLD-409",
    key: "shoulder",
    conceptQuery: "intrinsic muscle of shoulder",
    name: "Right Shoulder (Deltoid & Rotator Cuff)",
    vernacular: "दाहिना कंधा · स्नायु और टेंडन",
    system: "muscular",
    systemName: "Musculoskeletal System",
    color: "#E3202B",
    icon: "🩺",
    badge: "Active focus · Pain 4/10",
    description: "Multi-axial glenohumeral ball-and-socket articulation stabilized by the supraspinatus, infraspinatus, teres minor, and subscapularis tendon cuff.",
    clinicalSignificance: "Site of repetitive desk-strain impingement, myofascial trigger points, and posture-induced tendon irritation.",
    biomarkers: [
      { label: "Range of Motion", value: "85% (Preserved)", status: "optimal" },
      { label: "Pain Index", value: "4/10 (Desk strain)", status: "watch" },
      { label: "Joint Inflammation", value: "Mild / Localized", status: "optimal" },
    ],
    careRecommendation: "Perform 3x daily scapular blade squeezes, elevate computer screen to 90° eye level, apply 15m cold compression after extended typing.",
    doctorName: "Dr. Sameer Joshi",
    doctorSpecialty: "Orthopaedics & Physiotherapy",
    doctorInitials: "SJ",
  },
  back: {
    id: "NODE L-SPN-201",
    key: "back",
    conceptQuery: "lumbar vertebra",
    name: "Lower Back (Lumbar Spine L1–L5)",
    vernacular: "निचली रीढ़ · लम्बर वर्टिब्रा",
    system: "skeletal",
    systemName: "Skeletal Framework",
    color: "#D4C5A9",
    icon: "🦴",
    badge: "Pending review · Stiffness",
    description: "The 5 lordotic lumbar vertebrae supporting axial body weight and transmitting kinetic loads across the sacrum and pelvis.",
    clinicalSignificance: "High compressive stress zone; subject to morning disc stiffness, paraspinal spasm, and prolonged seated compression.",
    biomarkers: [
      { label: "Morning Stiffness", value: "Eases with walking", status: "watch" },
      { label: "Intervertebral Discs", value: "L4-L5 Spacing Normal", status: "optimal" },
      { label: "Nerve Conduction", value: "Zero impingement", status: "optimal" },
    ],
    careRecommendation: "Gentle cat-camel morning mobility, avoid prolonged uninterrupted sitting (>45 min), engage transversus abdominis core stabilization.",
    doctorName: "Dr. Sameer Joshi",
    doctorSpecialty: "Orthopaedics & Physiotherapy",
    doctorInitials: "SJ",
  },
  heart: {
    id: "NODE HRT-001",
    key: "heart",
    conceptQuery: "heart",
    name: "Cardiovascular Heart & Aorta",
    vernacular: "हृदय / दिल · कार्डियोवैस्कुलर",
    system: "cardiac",
    systemName: "Cardiovascular System",
    color: "#DC2626",
    icon: "🫀",
    badge: "Stable rhythm · 72 bpm",
    description: "Four-chambered myogenic pump driving continuous pulmonary oxygenation and systemic systemic blood circulation through vascular channels.",
    clinicalSignificance: "Primary hemodynamic driver; monitored for pulse rhythm, endothelial shear stress, and coronary perfusion.",
    biomarkers: [
      { label: "Resting Heart Rate", value: "72 bpm (Normal)", status: "optimal" },
      { label: "HR Variability (HRV)", value: "42 ms (Stable)", status: "optimal" },
      { label: "Blood Pressure", value: "120/80 mmHg (Target)", status: "optimal" },
    ],
    careRecommendation: "10-minute post-meal brisk walking to blunt glycemic spikes, reduce dietary sodium, maintain 150 min/week moderate aerobic activity.",
    doctorName: "Dr. Ananya Rao",
    doctorSpecialty: "Endocrinology & Metabolic Health",
    doctorInitials: "AR",
  },
  brain: {
    id: "NODE BRN-101",
    key: "brain",
    conceptQuery: "brain",
    name: "Cerebral Cortex & Nervous System",
    vernacular: "मस्तिष्क और खोपड़ी · केंद्रीय तंत्रिका तंत्र",
    system: "nervous",
    systemName: "Central Nervous System",
    color: "#D97706",
    icon: "🧠",
    badge: "Sleep sync · 7.2 hrs",
    description: "The neural processing center encompassing 86 billion neurons orchestrating circadian sleep-wake cycles, autonomic reflexes, and somatic perception.",
    clinicalSignificance: "Regulates nocturnal cortisol suppression, metabolic circadian clocks, and sympathetic/parasympathetic nervous balance.",
    biomarkers: [
      { label: "Sleep Duration", value: "7.2 hrs (Consistent)", status: "optimal" },
      { label: "REM Sleep Architecture", value: "22% total sleep", status: "optimal" },
      { label: "Neuro-Stress Index", value: "18.4 / 100 (Low)", status: "optimal" },
    ],
    careRecommendation: "Limit blue-light exposure 45m before bedtime, get 15 min natural morning sunlight, practice 4-7-8 parasympathetic breathing.",
    doctorName: "Dr. Ananya Rao",
    doctorSpecialty: "Endocrinology & Metabolic Health",
    doctorInitials: "AR",
  },
  lungs: {
    id: "NODE LNG-301",
    key: "lungs",
    conceptQuery: "lung",
    name: "Pulmonary Lungs & Bronchial Tree",
    vernacular: "फेफड़े और श्वसन तंत्र · ऑक्सीजन विनिमय",
    system: "respiratory",
    systemName: "Respiratory System",
    color: "#0284C7",
    icon: "🫁",
    badge: "SpO2 98.9% · Optimal",
    description: "Bilateral spongy gas-exchange matrix providing ~100 m² of alveolar capillary surface area for oxygen uptake and carbon dioxide clearance.",
    clinicalSignificance: "Direct determinant of systemic oxygen saturation (SpO2) and acid-base metabolic compensation.",
    biomarkers: [
      { label: "Blood Oxygen (SpO2)", value: "98.9% (Optimal)", status: "optimal" },
      { label: "Resting Resp Rate", value: "14 breaths/min", status: "optimal" },
      { label: "Airway Flow Capacity", value: "Preserved capacity", status: "optimal" },
    ],
    careRecommendation: "Maintain clean indoor air quality, practice diaphragmatic breathing exercises, avoid exertion during high AQI index spikes.",
    doctorName: "Dr. Sameer Joshi",
    doctorSpecialty: "Internal Medicine & Care Team",
    doctorInitials: "SJ",
  },
  metabolic: {
    id: "NODE MET-501",
    key: "metabolic",
    conceptQuery: "liver",
    name: "Metabolic Viscera (Liver & Pancreas)",
    vernacular: "पाचन और चयापचय · यकृत और अग्न्याशय",
    system: "digestive",
    systemName: "Metabolic & Digestive Matrix",
    color: "#B45309",
    icon: "🌿",
    badge: "HbA1c 5.9% · Borderline",
    description: "Hepatic and pancreatic metabolic machinery regulating gluconeogenesis, glycogen storage, lipid clearance, and insulin secretion.",
    clinicalSignificance: "Core driver of insulin sensitivity, postprandial glucose surges, and non-alcoholic hepatic metabolic health.",
    biomarkers: [
      { label: "HbA1c (Glycated Hb)", value: "5.9% (Borderline)", status: "watch" },
      { label: "Fasting Blood Sugar", value: "94 mg/dL (Normal)", status: "optimal" },
      { label: "Hepatic Enzymes (ALT)", value: "28 U/L (Healthy)", status: "optimal" },
    ],
    careRecommendation: "Pair rice/rotis with generous dal/sabzi fiber, pace meals over at least 20 minutes, incorporate vinegar/lemon dressing prior to meals.",
    doctorName: "Dr. Ananya Rao",
    doctorSpecialty: "Endocrinology & Metabolic Health",
    doctorInitials: "AR",
  },
  vascular: {
    id: "NODE VAS-701",
    key: "vascular",
    conceptQuery: "artery",
    name: "Arterial Vasculature & Microcirculation",
    vernacular: "धमनी जाल · रक्त परिसंचरण",
    system: "arterial",
    systemName: "Arterial Vasculature",
    color: "#EF4444",
    icon: "🩸",
    badge: "Flow velocity · Optimal",
    description: "High-pressure oxygenated conduit tree branching from the aortic arch to peripheral capillary beds supplying oxygen and nutrients.",
    clinicalSignificance: "Arterial stiffness and lipoprotein particle retention accelerate endothelial dysfunction.",
    biomarkers: [
      { label: "Pulse Wave Velocity", value: "7.1 m/s (Elastic)", status: "optimal" },
      { label: "Capillary Refill", value: "< 2 seconds", status: "optimal" },
      { label: "Endothelial Index", value: "Normal shear stress", status: "optimal" },
    ],
    careRecommendation: "Stay well-hydrated throughout the day (2.5L water), consume omega-3 rich seeds (flax/chia), avoid prolonged immobility.",
    doctorName: "Dr. Ananya Rao",
    doctorSpecialty: "Cardiology & Vascular Medicine",
    doctorInitials: "AR",
  },
};

export default function BodyExplorerPage() {
  const [atlas, setAtlas] = useState<Atlas | null>(null);
  const [state, setState] = useState<SceneState>(initialSceneState);
  const [, setProgress] = useState(0);
  const [, setLoadError] = useState("");
  const [focusedIssue, setFocusedIssue] = useState<"shoulder" | "back">("shoulder");
  const [activeLayer, setActiveLayer] = useState<"Surface" | "Muscle" | "Skeletal" | "Organ" | "All">("Surface");
  const [query, setQuery] = useState("");
  const [activeOrganKey, setActiveOrganKey] = useState<string>("shoulder");
  const [rightPanelTab, setRightPanelTab] = useState<"guidance" | "telemetry">("guidance");

  // Selected concept for detail banner
  const [selectedConcept, setSelectedConcept] = useState<{ id: string; name: string } | null>({
    id: "NODE R-SHLD-409",
    name: "Right shoulder · Tension cluster",
  });

  // Care plan checklist
  const [carePlan, setCarePlan] = useState([
    { id: 1, title: "Shoulder-blade squeezes, 3× daily, 10 reps", done: false },
    { id: 2, title: "Raise screen to eye level (90° line-of-sight)", done: true },
    { id: 3, title: "Cold pack 15 min after long typing sessions", done: false },
  ]);

  // Load atlas metadata
  useEffect(() => {
    const abort = new AbortController();
    fetch("/models/atlas.json", { signal: abort.signal })
      .then((r) => {
        if (!r.ok) throw new Error("Could not load atlas catalogue.");
        return r.json();
      })
      .then((data: Atlas) => {
        setAtlas(data);

        // Pre-focus the right shoulder on initial load
        const shoulderConcept = data.concepts.find(
          (c) =>
            c.name.toLowerCase().includes("intrinsic muscle of shoulder") ||
            c.name.toLowerCase().includes("extrinsic muscle of shoulder") ||
            c.name.toLowerCase().includes("deltoid")
        );
        if (shoulderConcept) {
          setState((prev) => ({
            ...prev,
            selected: shoulderConcept.elements,
            view: "front",
          }));
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setLoadError(err.message || "Failed to load 3D anatomy.");
        }
      });

    return () => abort.abort();
  }, []);

  const partsMap = useMemo(() => new Map(atlas?.parts.map((p) => [p.id, p])), [atlas]);

  // Handle Layer switching (Surface, Muscle, Skeletal, Organ, All)
  const handleLayerSwitch = (layer: "Surface" | "Muscle" | "Skeletal" | "Organ" | "All") => {
    setActiveLayer(layer);
    let systems: SystemId[];
    switch (layer) {
      case "Surface":
        systems = ["integumentary", "skeletal"];
        break;
      case "Muscle":
        systems = ["muscular", "skeletal", "cardiac"];
        break;
      case "Skeletal":
        systems = ["skeletal"];
        break;
      case "Organ":
        systems = ["cardiac", "respiratory", "digestive", "endocrine", "urinary", "nervous"];
        break;
      case "All":
      default:
        systems = CLINICAL_DEFAULT_VISIBLE;
        break;
    }
    setState((prev) => ({ ...prev, visible: systems }));
  };

  // Select predefined high-impact anatomical zone
  const handleSelectOrganPreset = (key: string) => {
    if (key === "whole") {
      setActiveOrganKey("whole");
      handleLayerSwitch("All");
      setSelectedConcept({ id: "NODE ATLAS-ALL", name: "Whole Body · 2,234 Modeled Parts" });
      setState((prev) => ({
        ...prev,
        selected: [],
        view: "front",
        isolate: false,
        reset: prev.reset + 1,
      }));
      return;
    }

    const organ = ORGAN_DATABASE[key];
    if (!organ) return;

    setActiveOrganKey(key);
    if (key === "shoulder") setFocusedIssue("shoulder");
    if (key === "back") setFocusedIssue("back");

    // Automatically set the appropriate layer for the organ
    if (organ.system === "cardiac" || organ.system === "respiratory" || organ.system === "digestive" || organ.system === "nervous") {
      handleLayerSwitch("Organ");
    } else if (organ.system === "muscular") {
      handleLayerSwitch("Muscle");
    } else if (organ.system === "skeletal") {
      handleLayerSwitch("Skeletal");
    } else if (organ.system === "arterial") {
      handleLayerSwitch("Organ");
    }

    if (atlas) {
      const match = atlas.concepts.find((c) =>
        c.name.toLowerCase().includes(organ.conceptQuery.toLowerCase())
      );
      if (match) {
        setSelectedConcept({ id: organ.id, name: organ.name });
        setState((prev) => ({
          ...prev,
          selected: match.elements,
          view: key === "back" ? "back" : "front",
          reset: prev.reset + 1,
        }));
      } else {
        setSelectedConcept({ id: organ.id, name: organ.name });
      }
    }
  };

  // Focus Issue 1: Right Shoulder
  const handleFocusShoulder = () => {
    handleSelectOrganPreset("shoulder");
  };

  // Focus Issue 2: Lower Back (Lumbar)
  const handleFocusBack = () => {
    handleSelectOrganPreset("back");
  };

  // Tap-to-Inspect handler from AnatomyScene
  const handleSelectPart = (id: string) => {
    const part = partsMap.get(id);
    if (!part) return;

    const explanation = getStructureExplanation(part.name, part.system);
    setSelectedConcept({
      id: part.conceptId || part.id,
      name: `${part.name} (${part.system})`,
    });

    // Check if it matches any organ in database
    const matchedKey = Object.keys(ORGAN_DATABASE).find(
      (k) =>
        part.name.toLowerCase().includes(k) ||
        part.system.toLowerCase().includes(k) ||
        ORGAN_DATABASE[k].conceptQuery.toLowerCase().includes(part.name.toLowerCase())
    );

    if (matchedKey) {
      setActiveOrganKey(matchedKey);
    }

    setState((prev) => ({
      ...prev,
      selected: [id],
    }));

    // Auto show telemetry tab on interactive tap
    setRightPanelTab("telemetry");
  };

  // View Angle Presets
  const setView = (v: View) => {
    setState((prev) => ({ ...prev, view: v, reset: prev.reset + 1, rotate: false }));
  };

  const handleReset = () => {
    setState({ ...initialSceneState, reset: state.reset + 1 });
    handleLayerSwitch("Surface");
    handleFocusShoulder();
  };

  const toggleCareItem = (id: number) => {
    setCarePlan(
      carePlan.map((c) => (c.id === id ? { ...c, done: !c.done } : c))
    );
  };

  const completedCareCount = carePlan.filter((c) => c.done).length;

  // Search Results for named anatomy structures
  const searchResults = useMemo(() => {
    if (!atlas || !query.trim()) return [];
    const q = query.toLowerCase().trim();
    return atlas.concepts
      .filter((c) => c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q))
      .slice(0, 15);
  }, [atlas, query]);

  const selectSearchConcept = (c: Concept) => {
    setSelectedConcept({ id: c.id, name: c.name });
    setState((prev) => ({
      ...prev,
      selected: c.elements,
      reset: prev.reset + 1,
    }));
    setQuery("");
    setRightPanelTab("telemetry");
  };

  // Current active organ object
  const currentOrgan: OrganDetail = ORGAN_DATABASE[activeOrganKey] || ORGAN_DATABASE.shoulder;

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-[#1D1F22] font-sans antialiased selection:bg-[#E3202B] selection:text-white pb-14 relative overflow-x-hidden">
      {/* Patient Navbar */}
      <PatientNavbar activeTab="body-explorer" />

      {/* ============ MAIN BODY EXPLORER CONTAINER ============ */}
      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        
        {/* ============ TOP BANNER CARD ============ */}
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-slate-200/80 shadow-[0_12px_36px_rgba(29,31,34,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                3D ATLAS ONLINE
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[#64748B] border border-slate-200">
                BodyParts3D Standard Engine · 2,234 Modeled Elements
              </span>
            </div>
            <h1
              className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1D1F22]"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              Interactive Body Explorer.
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Explore how body parts and organ systems connect in real 3D anatomical space with live clinical telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 px-4 py-2 rounded-2xl self-start md:self-auto">
            <div className="w-8 h-8 rounded-xl bg-red-50 text-[#E3202B] flex items-center justify-center font-bold">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="7" r="4" />
                <path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2" />
              </svg>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-[#94A3B8] font-bold">VIEW MODE</span>
              <p className="text-xs font-bold text-[#1D1F22]">{state.view.toUpperCase()} · {activeLayer}</p>
            </div>
          </div>
        </div>

        {/* ============ 3-COLUMN CORE EXPLORER GRID ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* ============ LEFT COLUMN: RECORDED ISSUES & ANATOMY SEARCH (3 COLS) ============ */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-[28px] p-5 border border-slate-200/80 shadow-[0_8px_24px_rgba(29,31,34,0.03)] space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[#1D1F22]">Recorded issues</h3>
                  <p className="text-[11px] text-[#64748B]">2 locations connected to 3D atlas</p>
                </div>
                <div className="w-7 h-7 rounded-full bg-red-50 text-[#E3202B] flex items-center justify-center">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
              </div>

              {/* Issue 1: Right shoulder */}
              <button
                type="button"
                onClick={handleFocusShoulder}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  activeOrganKey === "shoulder"
                    ? "bg-white border-[#E3202B] shadow-sm ring-2 ring-[#E3202B]/15"
                    : "bg-[#F8FAFC] border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-xs font-bold text-[#1D1F22]">Right shoulder</h4>
                  <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-[#E3202B] text-white">
                    ACTIVE FOCUS
                  </span>
                </div>
                <p className="text-[11.5px] text-[#475569] leading-snug">
                  Dull ache after long hours at the desk. Pain 4/10.
                </p>
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px]">
                  <span className="text-[#94A3B8]">19 Oct 2026</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <span>✓</span> Doctor reviewed
                  </span>
                </div>
              </button>

              {/* Issue 2: Lower back */}
              <button
                type="button"
                onClick={handleFocusBack}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  activeOrganKey === "back"
                    ? "bg-white border-[#E3202B] shadow-sm ring-2 ring-[#E3202B]/15"
                    : "bg-[#F8FAFC] border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-xs font-bold text-[#1D1F22]">Lower back</h4>
                  <span className="px-2 py-0.5 rounded-full text-[9.5px] font-semibold bg-slate-200 text-slate-700">
                    PENDING REVIEW
                  </span>
                </div>
                <p className="text-[11.5px] text-[#475569] leading-snug">
                  Stiffness in the morning that eases with light stretching.
                </p>
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px]">
                  <span className="text-[#94A3B8]">12 Oct 2026</span>
                  <span className="text-[#64748B]">Self-reported</span>
                </div>
              </button>

              {/* Search any structure in the 3D Atlas */}
              <div className="pt-2">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#64748B] mb-1.5">
                  Find & Connect Any Organ
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search heart, femur, liver, aorta…"
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs text-[#1D1F22] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#E3202B]"
                  />
                  {searchResults.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl border border-slate-200 shadow-xl max-h-48 overflow-y-auto z-30 p-1">
                      {searchResults.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => selectSearchConcept(c)}
                          className="w-full text-left p-2 rounded-lg text-xs hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                        >
                          <span className="font-medium text-[#1D1F22] truncate">{c.name}</span>
                          <span className="text-[10px] text-[#E3202B] font-mono">{c.elements.length} pcs</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 flex items-start gap-2.5 text-xs text-[#64748B]">
              <span className="text-[#E3202B] mt-0.5 text-sm">💡</span>
              <p className="leading-snug">
                <strong className="text-[#1D1F22]">Interactive Exploration:</strong> Tap directly on any muscle, bone, or organ in 3D to inspect its anatomical name, connected biomarkers, and clinical care plan.
              </p>
            </div>
          </div>

          {/* ============ CENTER COLUMN: REAL 3D ANATOMY ATLAS SCENE (6 COLS) ============ */}
          <div className="lg:col-span-6 bg-white rounded-[32px] p-6 border border-slate-200/80 shadow-[0_12px_36px_rgba(29,31,34,0.04)] relative flex flex-col justify-between min-h-[640px]">
            
            {/* Top Toolbar: System Layers & Node Indicator */}
            <div className="space-y-3 z-10 pb-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* System layer switchers */}
                <div className="flex items-center bg-slate-100/80 p-1 rounded-full text-xs font-medium">
                  {(["Surface", "Muscle", "Skeletal", "Organ", "All"] as const).map((layer) => (
                    <button
                      key={layer}
                      type="button"
                      onClick={() => handleLayerSwitch(layer)}
                      className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                        activeLayer === layer
                          ? "bg-[#E3202B] text-white font-semibold shadow-xs"
                          : "text-[#64748B] hover:text-[#1D1F22]"
                      }`}
                    >
                      {layer}
                    </button>
                  ))}
                </div>

                {/* Dynamic Target Node ID */}
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#E3202B] max-w-[220px] truncate bg-red-50/80 px-2.5 py-1 rounded-full border border-red-100">
                  <span className="w-2 h-2 rounded-full bg-[#E3202B] ae-pulse-glow flex-shrink-0" />
                  <span className="truncate">{selectedConcept?.id || "NODE ACTIVE"}</span>
                </div>
              </div>

              {/* Innovative Quick-Jump Anatomical Zones Carousel Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-medium text-[#545B61]">
                <button
                  type="button"
                  onClick={() => handleSelectOrganPreset("whole")}
                  className={`flex-shrink-0 px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    activeOrganKey === "whole"
                      ? "bg-[#1D1F22] text-white border-[#1D1F22] font-semibold"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-[#475569]"
                  }`}
                >
                  🧍 Whole Body (Full Frame)
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectOrganPreset("shoulder")}
                  className={`flex-shrink-0 px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    activeOrganKey === "shoulder"
                      ? "bg-[#E3202B] text-white border-[#E3202B] font-semibold shadow-xs"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-[#475569]"
                  }`}
                >
                  🩺 Right Shoulder
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectOrganPreset("back")}
                  className={`flex-shrink-0 px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    activeOrganKey === "back"
                      ? "bg-[#E3202B] text-white border-[#E3202B] font-semibold shadow-xs"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-[#475569]"
                  }`}
                >
                  🦴 Lumbar Spine
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectOrganPreset("heart")}
                  className={`flex-shrink-0 px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    activeOrganKey === "heart"
                      ? "bg-[#E3202B] text-white border-[#E3202B] font-semibold shadow-xs"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-[#475569]"
                  }`}
                >
                  🫀 Heart & Cardia
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectOrganPreset("brain")}
                  className={`flex-shrink-0 px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    activeOrganKey === "brain"
                      ? "bg-[#E3202B] text-white border-[#E3202B] font-semibold shadow-xs"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-[#475569]"
                  }`}
                >
                  🧠 Brain & Cranium
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectOrganPreset("lungs")}
                  className={`flex-shrink-0 px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    activeOrganKey === "lungs"
                      ? "bg-[#E3202B] text-white border-[#E3202B] font-semibold shadow-xs"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-[#475569]"
                  }`}
                >
                  🫁 Lungs & SpO2
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectOrganPreset("metabolic")}
                  className={`flex-shrink-0 px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    activeOrganKey === "metabolic"
                      ? "bg-[#E3202B] text-white border-[#E3202B] font-semibold shadow-xs"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-[#475569]"
                  }`}
                >
                  🌿 Liver & Metabolic
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectOrganPreset("vascular")}
                  className={`flex-shrink-0 px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    activeOrganKey === "vascular"
                      ? "bg-[#E3202B] text-white border-[#E3202B] font-semibold shadow-xs"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-[#475569]"
                  }`}
                >
                  🩸 Blood Vessels
                </button>
              </div>
            </div>

            {/* Sub-status line */}
            <div className="flex justify-between text-[11px] font-mono text-[#64748B] px-1 z-10">
              <span className="truncate max-w-[320px]">
                TARGET: <strong className="text-[#1D1F22]">{selectedConcept?.name || "ANATOMICAL MESH"}</strong>
              </span>
              <span className="text-[#94A3B8]">2,234 PIECES LOADED</span>
            </div>

            {/* Real 3D Anatomy WebGL Scene from ashemag-human-atlas */}
            <div className="relative my-auto w-full h-[600px] sm:h-[660px] flex items-center justify-center rounded-2xl overflow-hidden bg-radial from-slate-50/60 to-transparent">
              {atlas ? (
                <AnatomyScene
                  atlas={atlas}
                  state={state}
                  onSelect={handleSelectPart}
                  onProgress={setProgress}
                  onError={setLoadError}
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center text-xs text-[#64748B]">
                  <div className="w-8 h-8 rounded-full border-2 border-[#E3202B]/30 border-t-[#E3202B] animate-spin mb-3" />
                  <p className="font-semibold text-[#1D1F22]">Initializing 3D Human Anatomy Atlas...</p>
                  <p className="text-[11px] text-[#94A3B8] mt-1">Framing full cranial & musculoskeletal volume</p>
                </div>
              )}

              {/* Floating Active Target Badge in 3D Space */}
              <div className="absolute top-4 right-4 pointer-events-none hidden sm:block">
                <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E3202B] animate-ping" />
                  <span className="text-[11px] font-bold text-[#1D1F22]">{currentOrgan.name}</span>
                </div>
              </div>
            </div>

            {/* Bottom 3D Viewport Controls Pill & Explode Slider */}
            <div className="z-10 pt-3 flex flex-col items-center gap-2">
              <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-full bg-slate-100 border border-slate-200/80 shadow-xs text-xs font-medium">
                {/* View angle buttons */}
                {(["front", "back", "side", "three-quarter"] as View[]).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setView(v)}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer capitalize ${
                      state.view === v
                        ? "bg-[#1D1F22] text-white font-semibold shadow-xs"
                        : "text-[#475569] hover:bg-white/60"
                    }`}
                  >
                    {v === "three-quarter" ? "3/4 View" : v}
                  </button>
                ))}

                <span className="w-px h-4 bg-slate-300 mx-1" />

                {/* Auto Rotate Toggle */}
                <button
                  type="button"
                  onClick={() => setState((prev) => ({ ...prev, rotate: !prev.rotate }))}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    state.rotate ? "bg-[#E3202B] text-white font-semibold" : "text-[#475569] hover:bg-white/60"
                  }`}
                >
                  {state.rotate ? "Pause ⏸" : "Rotate 360°"}
                </button>

                <span className="w-px h-4 bg-slate-300 mx-1" />

                {/* Explode Separator Toggle */}
                <button
                  type="button"
                  onClick={() =>
                    setState((prev) => ({ ...prev, explode: prev.explode > 0 ? 0 : 0.45 }))
                  }
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    state.explode > 0 ? "bg-[#E3202B] text-white font-semibold" : "text-[#475569] hover:bg-white/60"
                  }`}
                >
                  {state.explode > 0 ? "Assembled" : "Explode Layers"}
                </button>

                <span className="w-px h-4 bg-slate-300 mx-1" />

                {/* Reset Camera Button */}
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-2.5 py-1 text-slate-500 hover:text-[#1D1F22] text-[11px] font-semibold cursor-pointer"
                >
                  Reset Full Body
                </button>
              </div>

              <p className="text-[11px] text-[#94A3B8]">
                Left-click to orbit 360° · Scroll to zoom · Full cranial-to-pelvis framing preserved
              </p>
            </div>
          </div>

          {/* ============ RIGHT COLUMN: DOCTOR GUIDANCE & ORGAN TELEMETRY TABS (3 COLS) ============ */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-[28px] p-5 border border-slate-200/80 shadow-[0_8px_24px_rgba(29,31,34,0.03)] space-y-4">
              
              {/* Top Tab Bar: Doctor Guidance vs Organ Telemetry */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-2xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setRightPanelTab("guidance")}
                  className={`py-2 px-1 rounded-xl transition-all cursor-pointer text-center ${
                    rightPanelTab === "guidance"
                      ? "bg-white text-[#1D1F22] shadow-xs"
                      : "text-[#64748B] hover:text-[#1D1F22]"
                  }`}
                >
                  🩺 Doctor Plan ({completedCareCount}/{carePlan.length})
                </button>
                <button
                  type="button"
                  onClick={() => setRightPanelTab("telemetry")}
                  className={`py-2 px-1 rounded-xl transition-all cursor-pointer text-center ${
                    rightPanelTab === "telemetry"
                      ? "bg-white text-[#1D1F22] shadow-xs"
                      : "text-[#64748B] hover:text-[#1D1F22]"
                  }`}
                >
                  🔬 Organ Insights
                </button>
              </div>

              {/* ============ TAB 1: DOCTOR GUIDANCE & CARE PLAN ============ */}
              {rightPanelTab === "guidance" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-[#1D1F22]">Doctor guidance</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                      Verified Care
                    </span>
                  </div>

                  {/* Doctor Profile Card */}
                  <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {currentOrgan.doctorInitials}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1D1F22]">{currentOrgan.doctorName}</h4>
                      <p className="text-[10.5px] text-[#E3202B] font-semibold">{currentOrgan.doctorSpecialty}</p>
                      <span className="text-[10px] text-[#94A3B8]">Clinical consultation active</span>
                    </div>
                  </div>

                  {/* Clinical Assessment */}
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-[#1D1F22] flex items-center gap-1.5">
                      <span>📋</span> Clinical assessment
                    </span>
                    <p className="text-xs text-[#475569] leading-relaxed">
                      {currentOrgan.key === "shoulder"
                        ? "Mild tendon irritation from repeated shoulder strain. Neck movement is fully preserved — no signs of nerve involvement."
                        : currentOrgan.key === "back"
                        ? "Morning stiffness in lumbar region. Disc height is preserved. Movement therapy recommended before any pharmacological step."
                        : `Targeted analysis of ${currentOrgan.name}. Telemetry signals remain within stable physiological parameters.`}
                    </p>
                  </div>

                  {/* Care Plan Checklist */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-[#1D1F22]">Personalized care plan</span>
                      <span className="font-mono text-[#E3202B]">{completedCareCount}/{carePlan.length}</span>
                    </div>

                    <div className="space-y-2">
                      {carePlan.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => toggleCareItem(c.id)}
                          className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-start gap-2.5 transition-all cursor-pointer ${
                            c.done
                              ? "bg-slate-50 border-slate-200 text-slate-400"
                              : "bg-[#F8FAFC] border-slate-200/90 text-[#1D1F22] hover:bg-slate-50"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 transition-all ${
                              c.done
                                ? "bg-[#E3202B] text-white"
                                : "border-2 border-slate-300 bg-white"
                            }`}
                          >
                            {c.done && (
                              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </div>
                          <span className={c.done ? "line-through text-slate-400" : ""}>
                            {c.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Follow-up Note */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-[#E3202B] font-semibold">Follow-up timeline</span>
                    <span className="font-bold text-[#1D1F22]">14 days · Video Visit</span>
                  </div>

                  {/* Message Care Team Button */}
                  <button
                    type="button"
                    className="w-full py-3 rounded-full text-xs font-semibold text-white shadow-xs hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                    style={{ background: "#E3202B" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span>Message Dr. {currentOrgan.doctorName.split(" ").slice(-1)[0]}</span>
                  </button>
                </div>
              )}

              {/* ============ TAB 2: ORGAN INTELLIGENCE & BIOMARKERS ============ */}
              {rightPanelTab === "telemetry" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#E3202B] font-bold tracking-wider">
                        {currentOrgan.id}
                      </span>
                      <h3 className="text-sm font-bold text-[#1D1F22]">{currentOrgan.name}</h3>
                      <p className="text-[11px] text-[#64748B] font-medium">{currentOrgan.vernacular}</p>
                    </div>
                    <span className="text-xl">{currentOrgan.icon}</span>
                  </div>

                  {/* System Tag */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: currentOrgan.color }} />
                    <span className="font-semibold text-[#1D1F22]">{currentOrgan.systemName}</span>
                  </div>

                  {/* Anatomical Mechanism */}
                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold text-[#1D1F22]">Biological Function</h4>
                    <p className="text-xs text-[#545B61] leading-relaxed bg-[#F8FAFC] p-3 rounded-xl border border-slate-100">
                      {currentOrgan.description}
                    </p>
                  </div>

                  {/* Live Biomarkers Gauges */}
                  <div className="space-y-2 pt-1">
                    <h4 className="text-xs font-semibold text-[#1D1F22] flex items-center justify-between">
                      <span>Connected Biomarkers</span>
                      <span className="text-[10px] text-emerald-600 font-mono">LIVE TELEMETRY</span>
                    </h4>
                    <div className="space-y-1.5">
                      {currentOrgan.biomarkers.map((b, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl border border-slate-200/80 bg-white flex items-center justify-between text-xs"
                        >
                          <span className="text-[#64748B]">{b.label}</span>
                          <span className={`font-semibold ${
                            b.status === "attention"
                              ? "text-red-600 font-bold"
                              : b.status === "watch"
                              ? "text-amber-600 font-bold"
                              : "text-emerald-600 font-bold"
                          }`}>
                            {b.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Clinical Action Protocol */}
                  <div className="p-3 rounded-2xl bg-red-50/70 border border-red-100 space-y-1 text-xs">
                    <span className="font-bold text-[#E3202B] flex items-center gap-1.5">
                      <span>⚡</span> Clinical Next Step
                    </span>
                    <p className="text-[#1D1F22] text-[11.5px] leading-snug">
                      {currentOrgan.careRecommendation}
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
