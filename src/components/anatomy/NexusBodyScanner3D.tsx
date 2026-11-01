"use client";

import React, { useEffect, useRef, useState } from "react";
import * as T from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { loadAtlasModel, type SystemGeometry } from "./atlas-loader";

export type NexusView = "front" | "side" | "back";

interface Props {
  currentView: NexusView;
  activeHotspot: "brain" | "lungs" | "heart" | "metabolic" | null;
  onSelectHotspot?: (hotspot: "brain" | "lungs" | "heart" | "metabolic") => void;
}

export default function NexusBodyScanner3D({
  currentView,
  activeHotspot,
  onSelectHotspot,
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<T.PerspectiveCamera | null>(null);
  const onSelectRef = useRef(onSelectHotspot);
  onSelectRef.current = onSelectHotspot;

  const [hasAtlasLoaded, setHasAtlasLoaded] = useState(false);

  // Smoothly rotate camera when currentView changes
  useEffect(() => {
    if (!controlsRef.current || !cameraRef.current) return;
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    let targetX = 0;
    let targetZ = 2.45;

    if (currentView === "side") {
      targetX = 2.45;
      targetZ = 0;
    } else if (currentView === "back") {
      targetX = 0;
      targetZ = -2.45;
    }

    // Animate smoothly to new position
    const startX = camera.position.x;
    const startZ = camera.position.z;
    let frame = 0;
    const totalFrames = 25;

    const step = () => {
      frame++;
      const t = frame / totalFrames;
      const ease = t * (2 - t);
      camera.position.x = startX + (targetX - startX) * ease;
      camera.position.z = startZ + (targetZ - startZ) * ease;
      controls.update();

      if (frame < totalFrames) {
        requestAnimationFrame(step);
      }
    };
    step();
  }, [currentView]);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    let disposed = false;
    let animFrame = 0;
    const abort = new AbortController();

    // WebGL Renderer
    let renderer: T.WebGLRenderer;
    try {
      renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    el.appendChild(renderer.domElement);

    // Scene & Camera
    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(34, el.clientWidth / el.clientHeight, 0.05, 50);
    camera.position.set(0, 0.94, 3.0);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.90, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableZoom = false; // preserve layout stability
    controls.autoRotate = false;
    controlsRef.current = controls;
    controls.update();

    // Lighting
    scene.add(new T.HemisphereLight(0xffffff, 0xb0b8c0, 1.4));
    const keyLight = new T.DirectionalLight(0xfff5f0, 2.2);
    keyLight.position.set(-2, 3.5, 2.5);
    scene.add(keyLight);

    const rimLight = new T.DirectionalLight(0xffe6e8, 2.0);
    rimLight.position.set(2, 2, -2.5);
    scene.add(rimLight);

    // Red Holographic Scanning Ellipses (encircling the body horizontally at thorax and abdomen)
    const scanRingGroup = new T.Group();

    // Thorax ellipse
    const thoraxTorus = new T.Mesh(
      new T.TorusGeometry(0.38, 0.007, 16, 64),
      new T.MeshStandardMaterial({
        color: 0xe3202b,
        emissive: 0xff1e2b,
        emissiveIntensity: 2.8,
        roughness: 0.15,
      })
    );
    thoraxTorus.rotation.x = Math.PI / 2;
    thoraxTorus.position.y = 1.25;
    scanRingGroup.add(thoraxTorus);

    // Abdominal ellipse
    const abdomenTorus = new T.Mesh(
      new T.TorusGeometry(0.35, 0.007, 16, 64),
      new T.MeshStandardMaterial({
        color: 0xe3202b,
        emissive: 0xff1e2b,
        emissiveIntensity: 2.5,
        roughness: 0.15,
      })
    );
    abdomenTorus.rotation.x = Math.PI / 2;
    abdomenTorus.position.y = 0.98;
    scanRingGroup.add(abdomenTorus);

    scene.add(scanRingGroup);

    // Hotspots Group
    const hotspotGroup = new T.Group();
    const createBeacon = (
      id: "brain" | "lungs" | "heart" | "metabolic",
      pos: [number, number, number],
      colorHex: number
    ) => {
      const core = new T.Mesh(
        new T.SphereGeometry(0.045, 16, 16),
        new T.MeshStandardMaterial({
          color: colorHex,
          emissive: colorHex,
          emissiveIntensity: 2.8,
        })
      );
      core.position.set(...pos);
      core.userData = { hotspotId: id };

      const aura = new T.Mesh(
        new T.SphereGeometry(0.085, 16, 16),
        new T.MeshBasicMaterial({
          color: colorHex,
          transparent: true,
          opacity: 0.35,
          blending: T.AdditiveBlending,
          depthWrite: false,
        })
      );
      aura.position.set(...pos);

      hotspotGroup.add(core);
      hotspotGroup.add(aura);
    };

    // 1. Brain (Cranial) -> Blue/Cyan
    createBeacon("brain", [0, 1.58, 0.02], 0x3b82f6);
    // 2. Lungs -> Green
    createBeacon("lungs", [0.08, 1.30, 0.05], 0x10b981);
    // 3. Heart -> Crimson Alert
    createBeacon("heart", [-0.04, 1.22, 0.05], 0xe3202b);
    // 4. Metabolic -> Amber
    createBeacon("metabolic", [0.03, 1.05, 0.05], 0xf59e0b);

    scene.add(hotspotGroup);

    // Stream meshes from ashemag-human-atlas
    loadAtlasModel(({ system, geometry }) => {
      if (disposed) return;
      let colorHex = 0xa85b50; // muscular terracotta
      let roughness = 0.45;
      let metalness = 0.15;
      let opacity = 0.95;

      if (system === "cardiac") {
        colorHex = 0xdc2626;
        roughness = 0.3;
      } else if (system === "arterial") {
        colorHex = 0xef4444;
        roughness = 0.25;
      } else if (system === "skeletal") {
        colorHex = 0xd4c5a9;
        roughness = 0.65;
      } else if (system === "integumentary") {
        colorHex = 0xfce7e7;
        opacity = 0.45;
      }

      const mat = new T.MeshStandardMaterial({
        color: colorHex,
        roughness,
        metalness,
        side: T.DoubleSide,
        transparent: opacity < 1,
        opacity,
      });

      const mesh = new T.Mesh(geometry, mat);
      scene.add(mesh);
    }).then(() => {
      if (!disposed) {
        setHasAtlasLoaded(true);
      }
    });

    // Animation Loop
    const clock = new T.Clock();
    const animate = () => {
      if (disposed) return;
      animFrame = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Subtle pulse and float on scanning ellipses
      thoraxTorus.rotation.z = Math.sin(elapsedTime * 0.8) * 0.05;
      abdomenTorus.rotation.z = -Math.sin(elapsedTime * 0.8) * 0.05;

      // Pulse beacon auras
      hotspotGroup.children.forEach((child, i) => {
        if (child instanceof T.Mesh && child.material instanceof T.MeshBasicMaterial) {
          const s = 1 + Math.sin(elapsedTime * 3 + i) * 0.18;
          child.scale.set(s, s, s);
        }
      });

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!el || !renderer || !camera || disposed) return;
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    const obs = new ResizeObserver(handleResize);
    obs.observe(el);

    return () => {
      disposed = true;
      abort.abort();
      cancelAnimationFrame(animFrame);
      obs.disconnect();
      controls.dispose();
      renderer.dispose();
      if (el.contains(renderer.domElement)) {
        el.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[380px] flex items-center justify-center">
      {/* Three.js WebGL Viewport */}
      <div ref={mountRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Instant 2D Schematic Human Outline (Renders in 0ms while WebGL streams or as background silhouette) */}
      {!hasAtlasLoaded && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-80">
          <svg
            viewBox="0 0 160 300"
            className="w-44 h-80 drop-shadow-sm overflow-visible"
          >
            {/* Holographic elliptical scan rings */}
            <ellipse
              cx="80"
              cy="115"
              rx="64"
              ry="22"
              fill="none"
              stroke="#E3202B"
              strokeWidth="1.6"
              strokeDasharray="4 3"
              opacity="0.75"
              className="animate-spin"
              style={{ animationDuration: "14s" }}
            />
            <ellipse
              cx="80"
              cy="165"
              rx="55"
              ry="18"
              fill="none"
              stroke="#E3202B"
              strokeWidth="1.6"
              strokeDasharray="5 3"
              opacity="0.65"
            />

            {/* Stylized Body Silhouette Matching Mockup */}
            {/* Arms */}
            <line x1="52" y1="80" x2="32" y2="180" stroke="#F4A7AE" strokeWidth="3.2" strokeLinecap="round" />
            <line x1="108" y1="80" x2="128" y2="180" stroke="#F4A7AE" strokeWidth="3.2" strokeLinecap="round" />
            {/* Legs */}
            <line x1="65" y1="180" x2="58" y2="285" stroke="#F4A7AE" strokeWidth="3.8" strokeLinecap="round" />
            <line x1="95" y1="180" x2="102" y2="285" stroke="#F4A7AE" strokeWidth="3.8" strokeLinecap="round" />
            {/* Torso */}
            <path
              d="M 54 80 C 54 80, 106 80, 106 80 C 114 105, 112 145, 104 180 C 94 184, 66 184, 56 180 C 48 145, 46 105, 54 80 Z"
              fill="rgba(255, 235, 238, 0.45)"
              stroke="#F4A7AE"
              strokeWidth="2.4"
            />
            {/* Neck & Head */}
            <line x1="80" y1="58" x2="80" y2="80" stroke="#F4A7AE" strokeWidth="3.2" strokeLinecap="round" />
            <circle cx="80" cy="40" r="18" fill="rgba(255, 235, 238, 0.5)" stroke="#F4A7AE" strokeWidth="2.4" />

            {/* Glowing Hotspots matching Mockup */}
            {/* Brain */}
            <circle cx="80" cy="40" r="10" fill="#3B82F6" opacity="0.25" className="animate-ping" />
            <circle cx="80" cy="40" r="5" fill="#3B82F6" />

            {/* Lungs */}
            <circle cx="68" cy="100" r="5" fill="#10B981" />

            {/* Heart Concentric Ripple */}
            <circle cx="80" cy="115" r="14" fill="#E3202B" opacity="0.25" className="animate-ping" />
            <circle cx="80" cy="115" r="7.5" fill="#E3202B" />

            {/* Metabolic */}
            <circle cx="84" cy="148" r="11" fill="#F59E0B" opacity="0.25" className="animate-pulse" />
            <circle cx="84" cy="148" r="6" fill="#F59E0B" />
          </svg>
        </div>
      )}
    </div>
  );
}
