"use client";

import React from "react";
import { type HotspotId } from "./DashboardBodyMap3D";

interface Props {
  activeHotspot: HotspotId;
  onSelectHotspot: (hotspot: HotspotId) => void;
}

export default function DashboardBodyMapSchematic({
  activeHotspot,
  onSelectHotspot,
}: Props) {
  return (
    <div className="relative w-full h-full min-h-[210px] flex items-center justify-center select-none">
      {/* Interactive Anatomical Silhouette Matching Image 1 from Mockup */}
      <svg
        viewBox="0 0 140 230"
        className="w-full h-full max-h-[220px] drop-shadow-xs overflow-visible"
        style={{ filter: "drop-shadow(0 4px 12px rgba(244,63,94,0.08))" }}
      >
        <defs>
          {/* Subtle Pink/Coral Torso Fill */}
          <linearGradient id="bodyFillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFF1F2" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFE4E6" stopOpacity="0.4" />
          </linearGradient>

          {/* Metabolic Crimson Pulsing Glow Filter */}
          <filter id="crimsonHalo" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ============ BODY STRUCTURE STROKES ============ */}
        {/* Slender Arms (Exact match to mockup thin pink lines) */}
        <line
          x1="45"
          y1="64"
          x2="28"
          y2="142"
          stroke="#F8A5AB"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <line
          x1="95"
          y1="64"
          x2="112"
          y2="142"
          stroke="#F8A5AB"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Slender Legs (Exact match to mockup thin pink lines) */}
        <line
          x1="55"
          y1="138"
          x2="49"
          y2="218"
          stroke="#F8A5AB"
          strokeWidth="3.6"
          strokeLinecap="round"
        />
        <line
          x1="85"
          y1="138"
          x2="91"
          y2="218"
          stroke="#F8A5AB"
          strokeWidth="3.6"
          strokeLinecap="round"
        />

        {/* Torso Capsule / Shield Outline */}
        <path
          d="M 48 64 C 48 64, 92 64, 92 64 C 98 84, 96 116, 90 138 C 82 142, 58 142, 50 138 C 44 116, 42 84, 48 64 Z"
          fill="url(#bodyFillGrad)"
          stroke="#F8A5AB"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />

        {/* Neck */}
        <line
          x1="70"
          y1="48"
          x2="70"
          y2="64"
          stroke="#F8A5AB"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Head Circle */}
        <circle
          cx="70"
          cy="32"
          r="16"
          fill="url(#bodyFillGrad)"
          stroke="#F8A5AB"
          strokeWidth="2.4"
        />

        {/* ============ INTERACTIVE CLINICAL HOTSPOTS ============ */}

        {/* 1. BRAIN & SLEEP (Cranial Center) */}
        <g
          className="cursor-pointer group"
          onClick={() => onSelectHotspot("brain")}
        >
          {activeHotspot === "brain" && (
            <circle
              cx="70"
              cy="32"
              r="12"
              fill="#10B981"
              opacity="0.25"
              className="animate-ping"
            />
          )}
          <circle
            cx="70"
            cy="32"
            r={activeHotspot === "brain" ? "6.5" : "5"}
            fill="#10B981"
            className="transition-all duration-200 group-hover:scale-125"
            style={{ transformOrigin: "70px 32px" }}
          />
        </g>

        {/* 2. THYROID (Cervical / Throat) */}
        <g
          className="cursor-pointer group"
          onClick={() => onSelectHotspot("thyroid")}
        >
          {activeHotspot === "thyroid" && (
            <circle
              cx="70"
              cy="56"
              r="10"
              fill="#059669"
              opacity="0.25"
              className="animate-ping"
            />
          )}
          <circle
            cx="70"
            cy="56"
            r={activeHotspot === "thyroid" ? "5.5" : "4"}
            fill="#059669"
            className="transition-all duration-200 group-hover:scale-125"
            style={{ transformOrigin: "70px 56px" }}
          />
        </g>

        {/* 3. HEART (Thoracic Chest) */}
        <g
          className="cursor-pointer group"
          onClick={() => onSelectHotspot("heart")}
        >
          {activeHotspot === "heart" && (
            <circle
              cx="67"
              cy="84"
              r="14"
              fill="#F59E0B"
              opacity="0.3"
              className="animate-ping"
            />
          )}
          <circle
            cx="67"
            cy="84"
            r={activeHotspot === "heart" ? "8" : "6.5"}
            fill="#F59E0B"
            className="transition-all duration-200 group-hover:scale-125"
            style={{ transformOrigin: "67px 84px" }}
          />
        </g>

        {/* 4. METABOLIC / LIVER (Lower Torso Abdomen) */}
        <g
          className="cursor-pointer group"
          onClick={() => onSelectHotspot("metabolic")}
        >
          {/* Mockup Soft Red Glow Halo */}
          <circle
            cx="73"
            cy="108"
            r={activeHotspot === "metabolic" ? "16" : "12"}
            fill="#E3202B"
            opacity={activeHotspot === "metabolic" ? "0.3" : "0.15"}
            className={activeHotspot === "metabolic" ? "animate-pulse" : ""}
          />
          {activeHotspot === "metabolic" && (
            <circle
              cx="73"
              cy="108"
              r="18"
              fill="none"
              stroke="#E3202B"
              strokeWidth="1.2"
              opacity="0.6"
              className="animate-ping"
            />
          )}
          <circle
            cx="73"
            cy="108"
            r={activeHotspot === "metabolic" ? "8.5" : "7"}
            fill="#E3202B"
            className="transition-all duration-200 group-hover:scale-125"
            style={{ transformOrigin: "73px 108px" }}
          />
        </g>
      </svg>
    </div>
  );
}
