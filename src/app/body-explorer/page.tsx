"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  CLINICAL_DEFAULT_VISIBLE,
  SYSTEMS,
  getStructureExplanation,
  type Atlas,
  type Concept,
  type SceneState,
  type SystemId,
  type View,
} from "@/components/anatomy/anatomy";

// Dynamically import AnatomyScene from ashemag-human-atlas-1c38bf3
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

export default function BodyExplorerPage() {
  const router = useRouter();
  const [atlas, setAtlas] = useState<Atlas | null>(null);
  const [state, setState] = useState<SceneState>(initialSceneState);
  const [progress, setProgress] = useState(0);
  const [loadError, setLoadError] = useState("");
  const [focusedIssue, setFocusedIssue] = useState<"shoulder" | "back">("shoulder");
  const [activeLayer, setActiveLayer] = useState<"Surface" | "Muscle" | "Skeletal" | "Organ" | "All">("Surface");
  const [query, setQuery] = useState("");
  const [selectedConcept, setSelectedConcept] = useState<{ id: string; name: string } | null>({
    id: "NODE R-SHLD-409",
    name: "Right shoulder · Tension cluster",
  });

  // Care plan checklist
  const [carePlan, setCarePlan] = useState([
    { id: 1, title: "Shoulder-blade squeezes, 3× daily, 10 reps", done: false },
    { id: 2, title: "Raise screen to eye level", done: false },
    { id: 3, title: "Cold pack 15 min after long typing", done: false },
  ]);

  // Load atlas.json from public directory
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
            c.name.toLowerCase().includes("extrinsic muscle of shoulder")
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

  // Focus Issue 1: Right Shoulder
  const handleFocusShoulder = () => {
    setFocusedIssue("shoulder");
    if (!atlas) return;

    const shoulderConcept = atlas.concepts.find(
      (c) =>
        c.name.toLowerCase().includes("intrinsic muscle of shoulder") ||
        c.name.toLowerCase().includes("extrinsic muscle of shoulder") ||
        c.name.toLowerCase().includes("deltoid")
    );

    if (shoulderConcept) {
      setSelectedConcept({ id: "NODE R-SHLD-409", name: "Right shoulder · Tension cluster" });
      setState((prev) => ({
        ...prev,
        selected: shoulderConcept.elements,
        view: "front",
        reset: prev.reset + 1,
      }));
    }
  };

  // Focus Issue 2: Lower Back (Lumbar)
  const handleFocusBack = () => {
    setFocusedIssue("back");
    if (!atlas) return;

    const lumbarConcept = atlas.concepts.find(
      (c) => c.name.toLowerCase().includes("lumbar vertebra")
    );

    if (lumbarConcept) {
      setSelectedConcept({ id: "NODE L-SPN-201", name: "Lower back · Lumbar stiffness" });
      setState((prev) => ({
        ...prev,
        selected: lumbarConcept.elements,
        view: "back",
        reset: prev.reset + 1,
      }));
    }
  };

  // Tap-to-Inspect handler from AnatomyScene
  const handleSelectPart = (id: string) => {
    const part = partsMap.get(id);
    if (!part) return;

    setSelectedConcept({
      id: part.conceptId || part.id,
      name: `${part.name} (${part.system})`,
    });

    setState((prev) => ({
      ...prev,
      selected: [id],
    }));
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
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-[#1D1F22] font-sans antialiased selection:bg-[#E3202B] selection:text-white pb-14">
      {/* ============ TOP NAVBAR ============ */}
      <header className="sticky top-4 z-40 px-4 sm:px-6">
        <nav
          aria-label="Main Navigation"
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
              className="px-3.5 py-1.5 rounded-full bg-white text-[#1D1F22] font-semibold shadow-xs transition-all"
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

          {/* Right Action: User Avatar */}
          <div className="flex items-center gap-2">
            <Link
              href="/profile"
              className="w-8 h-8 rounded-full bg-[#FCECEE] hover:bg-[#F9DFE2] border border-[#F6C6CC] text-xs font-semibold text-[#1D1F22] flex items-center justify-center transition-all shadow-2xs"
            >
              AK
            </Link>
          </div>
        </nav>
      </header>

      {/* ============ MAIN BODY EXPLORER CONTAINER ============ */}
      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        
        {/* ============ TOP BANNER CARD ============ */}
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-slate-200/80 shadow-[0_12px_36px_rgba(29,31,34,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                3D VIEWER ACTIVE
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[#64748B] border border-slate-200">
                BodyParts3D Atlas Engine · 2,234 Modeled Pieces
              </span>
            </div>
            <h1
              className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1D1F22]"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              Interactive Body Explorer.
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Explore how body parts and organ systems connect in real 3D anatomical space.
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
              <span className="text-[10px] uppercase font-mono text-[#94A3B8] font-bold">VIEW</span>
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
                  focusedIssue === "shoulder"
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
                  focusedIssue === "back"
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
                    placeholder="Search heart, femur, liver…"
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

            <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 flex items-start gap-2 text-xs text-[#64748B]">
              <span className="text-[#E3202B] mt-0.5">ℹ️</span>
              <p className="leading-snug">
                Tap directly on any muscle, bone, or organ in 3D to inspect its medical name and connections.
              </p>
            </div>
          </div>

          {/* ============ CENTER COLUMN: REAL 3D ANATOMY ATLAS SCENE (6 COLS) ============ */}
          <div className="lg:col-span-6 bg-white rounded-[32px] p-6 border border-slate-200/80 shadow-[0_12px_36px_rgba(29,31,34,0.04)] relative flex flex-col justify-between min-h-[580px]">
            {/* Top Toolbar: System Layers & Node Indicator */}
            <div className="flex flex-wrap items-center justify-between gap-3 z-10 pb-2">
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
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#E3202B] max-w-[220px] truncate">
                <span className="w-2 h-2 rounded-full bg-[#E3202B] ae-pulse-glow flex-shrink-0" />
                <span className="truncate">{selectedConcept?.id || "NODE ACTIVE"}</span>
              </div>
            </div>

            {/* Sub-status line */}
            <div className="flex justify-between text-[10.5px] font-mono text-[#94A3B8] px-2 z-10">
              <span className="truncate max-w-[300px]">
                TARGET: {selectedConcept?.name || "ANATOMICAL MESH"}
              </span>
              <span>2,234 PIECES LOADED</span>
            </div>

            {/* Real 3D Anatomy WebGL Scene from ashemag-human-atlas-1c38bf3 */}
            <div className="relative my-auto w-full h-[460px] flex items-center justify-center rounded-2xl overflow-hidden">
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
                  <p className="text-[11px] text-[#94A3B8] mt-1">Connecting 2,234 modeled anatomical meshes</p>
                </div>
              )}
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
                    {v === "three-quarter" ? "3/4" : v}
                  </button>
                ))}

                <span className="w-px h-4 bg-slate-300 mx-1" />

                {/* Auto Rotate Toggle */}
                <button
                  type="button"
                  onClick={() => setState((prev) => ({ ...prev, rotate: !prev.rotate }))}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    state.rotate ? "bg-[#E3202B] text-white" : "text-[#475569] hover:bg-white/60"
                  }`}
                >
                  {state.rotate ? "Pause" : "Rotate"}
                </button>

                <span className="w-px h-4 bg-slate-300 mx-1" />

                {/* Explode Separator Toggle */}
                <button
                  type="button"
                  onClick={() =>
                    setState((prev) => ({ ...prev, explode: prev.explode > 0 ? 0 : 0.45 }))
                  }
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    state.explode > 0 ? "bg-[#E3202B] text-white" : "text-[#475569] hover:bg-white/60"
                  }`}
                >
                  {state.explode > 0 ? "Assembled" : "Explode"}
                </button>

                <span className="w-px h-4 bg-slate-300 mx-1" />

                {/* Reset Button */}
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-2.5 py-1 text-slate-500 hover:text-[#1D1F22] text-[11px] font-semibold cursor-pointer"
                >
                  Reset
                </button>
              </div>

              <p className="text-[11px] text-[#94A3B8]">
                Drag to orbit · Pinch to zoom · Tap any structure to inspect connections
              </p>
            </div>
          </div>

          {/* ============ RIGHT COLUMN: DOCTOR GUIDANCE (3 COLS) ============ */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-[28px] p-5 border border-slate-200/80 shadow-[0_8px_24px_rgba(29,31,34,0.03)] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#1D1F22]">Doctor guidance</h3>
                <span className="text-[#E3202B] font-bold text-sm">+</span>
              </div>

              {/* Doctor Profile Card */}
              <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  SJ
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1D1F22]">Dr. Sameer Joshi</h4>
                  <p className="text-[10.5px] text-[#E3202B] font-semibold">Orthopaedics & Physiotherapy</p>
                  <span className="text-[10px] text-[#94A3B8]">Video visit · 20 Oct</span>
                </div>
              </div>

              {/* Clinical Assessment */}
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#1D1F22] flex items-center gap-1.5">
                  <span>📋</span> Clinical assessment
                </span>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Mild tendon irritation from repeated shoulder strain. Neck movement is fully preserved — no signs of nerve involvement.
                </p>
              </div>

              {/* Care Plan Checklist */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#1D1F22]">Care plan</span>
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
                <span className="text-[#E3202B] font-semibold">Follow-up</span>
                <span className="font-bold text-[#1D1F22]">14 days</span>
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
                <span>Message care team</span>
              </button>
            </div>
          </div>

        </div>

        {/* ============ FOOTER DISCLAIMER ============ */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#94A3B8] pt-4">
          <p>
            Safety note: This 3D view shows symptoms you&apos;ve logged for reference. It doesn&apos;t diagnose. For severe or sudden pain, seek emergency care.
          </p>
          <span className="text-emerald-600 font-medium flex items-center gap-1.5 flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Shared only with your care team
          </span>
        </div>

      </main>
    </div>
  );
}
