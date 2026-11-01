"use client";

import React, { useEffect, useRef, useState } from "react";
import * as T from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { loadAtlasModel, type SystemGeometry } from "./atlas-loader";

export type HotspotId = "brain" | "heart" | "metabolic" | "thyroid";

interface Props {
  activeHotspot: HotspotId;
  onSelectHotspot?: (hotspot: HotspotId) => void;
}

export default function DashboardBodyMap3D({ activeHotspot, onSelectHotspot }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeHotspotRef = useRef<HotspotId>(activeHotspot);
  const onSelectRef = useRef(onSelectHotspot);
  const cameraRef = useRef<T.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const [activeView, setActiveView] = useState<"front" | "side" | "back">("front");
  const [modelReady, setModelReady] = useState(false);

  activeHotspotRef.current = activeHotspot;
  onSelectRef.current = onSelectHotspot;

  // Smooth camera orientation transition when Front / Side / Back buttons are tapped
  const handleViewChange = (view: "front" | "side" | "back") => {
    setActiveView(view);
    if (!cameraRef.current || !controlsRef.current) return;

    const camera = cameraRef.current;
    const controls = controlsRef.current;

    let targetX = 0;
    let targetZ = 2.75;

    if (view === "side") {
      targetX = 2.75;
      targetZ = 0;
    } else if (view === "back") {
      targetX = 0;
      targetZ = -2.75;
    }

    const startX = camera.position.x;
    const startZ = camera.position.z;
    let frame = 0;
    const totalFrames = 22;

    const transition = () => {
      frame++;
      const t = frame / totalFrames;
      const ease = t * (2 - t);
      camera.position.x = startX + (targetX - startX) * ease;
      camera.position.z = startZ + (targetZ - startZ) * ease;
      controls.update();

      if (frame < totalFrames) {
        requestAnimationFrame(transition);
      }
    };
    transition();
  };

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    let disposed = false;
    let animFrame = 0;

    // WebGL Renderer
    let renderer: T.WebGLRenderer;
    try {
      renderer = new T.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
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
    const camera = new T.PerspectiveCamera(32, el.clientWidth / el.clientHeight, 0.05, 50);
    camera.position.set(0, 0.95, 2.75);
    cameraRef.current = camera;

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.88, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableZoom = false; // card layout stability
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.7;
    controls.minPolarAngle = Math.PI * 0.25;
    controls.maxPolarAngle = Math.PI * 0.75;
    controlsRef.current = controls;

    // Studio Lighting
    scene.add(new T.HemisphereLight(0xffffff, 0xb0b8c0, 1.4));
    const keyLight = new T.DirectionalLight(0xfffaf6, 2.4);
    keyLight.position.set(-2, 3.5, 2.5);
    scene.add(keyLight);

    const rimLight = new T.DirectionalLight(0xffe6e6, 2.0);
    rimLight.position.set(2, 2, -2.5);
    scene.add(rimLight);

    // Base Pedestal
    const pedestal = new T.Mesh(
      new T.CylinderGeometry(0.55, 0.58, 0.02, 64),
      new T.MeshStandardMaterial({ color: 0x181a20, metalness: 0.25, roughness: 0.5 })
    );
    pedestal.position.y = -0.01;
    scene.add(pedestal);

    const baseRing = new T.Mesh(
      new T.RingGeometry(0.5, 0.51, 64),
      new T.MeshBasicMaterial({ color: 0xe3202b, transparent: true, opacity: 0.7, side: T.DoubleSide })
    );
    baseRing.rotation.x = -Math.PI / 2;
    baseRing.position.y = 0.002;
    scene.add(baseRing);

    // Dynamic 3D Laser Scanning Torus Ring
    const scanRingGroup = new T.Group();
    const torusMesh = new T.Mesh(
      new T.TorusGeometry(0.44, 0.012, 16, 64),
      new T.MeshStandardMaterial({
        color: 0xe3202b,
        emissive: 0xff1e2b,
        emissiveIntensity: 3.0,
        roughness: 0.15,
        metalness: 0.85,
      })
    );
    torusMesh.rotation.x = Math.PI / 2;
    scanRingGroup.add(torusMesh);

    const laserDisk = new T.Mesh(
      new T.RingGeometry(0.02, 0.44, 48),
      new T.MeshBasicMaterial({
        color: 0xe3202b,
        transparent: true,
        opacity: 0.18,
        side: T.DoubleSide,
        blending: T.AdditiveBlending,
        depthWrite: false,
      })
    );
    laserDisk.rotation.x = Math.PI / 2;
    scanRingGroup.add(laserDisk);

    const scanLight = new T.PointLight(0xe3202b, 2.5, 1.4);
    scanRingGroup.add(scanLight);
    scanRingGroup.position.y = 1.05;
    scene.add(scanRingGroup);

    // Interactive Hotspot Beacons (Raycastable)
    const hotspotGroup = new T.Group();
    const hotspotMeshes: { id: HotspotId; mesh: T.Mesh; auraMesh: T.Mesh; y: number }[] = [];

    const createBeacon = (
      id: HotspotId,
      pos: [number, number, number],
      colorHex: number,
      radius: number
    ) => {
      const core = new T.Mesh(
        new T.SphereGeometry(radius, 16, 16),
        new T.MeshStandardMaterial({
          color: colorHex,
          emissive: colorHex,
          emissiveIntensity: 2.8,
          roughness: 0.2,
        })
      );
      core.position.set(...pos);
      core.userData = { hotspotId: id };

      const aura = new T.Mesh(
        new T.SphereGeometry(radius * 1.8, 16, 16),
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
      hotspotMeshes.push({ id, mesh: core, auraMesh: aura, y: pos[1] });
    };

    // 1. Brain (Cranial) -> Emerald
    createBeacon("brain", [0, 1.55, 0.02], 0x10b981, 0.045);
    // 2. Thyroid (Cervical / Throat) -> Emerald
    createBeacon("thyroid", [0, 1.38, 0.04], 0x059669, 0.035);
    // 3. Heart (Thoracic / Cardiac) -> Amber
    createBeacon("heart", [-0.035, 1.22, 0.05], 0xf59e0b, 0.048);
    // 4. Metabolic (Abdominal / Liver) -> Crimson
    createBeacon("metabolic", [0.04, 1.05, 0.05], 0xe3202b, 0.052);

    scene.add(hotspotGroup);

    // Real 3D Anatomical Human Body Mesh Streamer
    const anatomyGroup = new T.Group();
    scene.add(anatomyGroup);

    const addSystemMesh = ({ system, geometry }: SystemGeometry) => {
      if (disposed) return;
      let colorHex = 0xa85b50; // muscular terracotta
      let roughness = 0.48;
      let metalness = 0.12;

      if (system === "cardiac") {
        colorHex = 0xdc2626;
        roughness = 0.35;
      } else if (system === "skeletal") {
        colorHex = 0xd4c5a9;
        roughness = 0.65;
      } else if (system === "arterial") {
        colorHex = 0xef4444;
        roughness = 0.3;
      }

      const mat = new T.MeshStandardMaterial({
        color: colorHex,
        roughness,
        metalness,
        side: T.DoubleSide,
      });

      const mesh = new T.Mesh(geometry, mat);
      anatomyGroup.add(mesh);
    };

    // Load from central model cache / progressive stream
    loadAtlasModel((item) => {
      addSystemMesh(item);
    }).then(() => {
      if (!disposed) setModelReady(true);
    });

    // Raycast Interaction
    const raycaster = new T.Raycaster();
    const mouse = new T.Vector2();

    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(
        hotspotMeshes.map((h) => h.mesh),
        false
      );

      if (hits.length > 0) {
        const clickedId = hits[0].object.userData.hotspotId as HotspotId;
        if (clickedId && onSelectRef.current) {
          onSelectRef.current(clickedId);
        }
      }
    };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(
        hotspotMeshes.map((h) => h.mesh),
        false
      );
      renderer.domElement.style.cursor = hits.length > 0 ? "pointer" : "grab";
    };

    renderer.domElement.addEventListener("click", handleClick);
    renderer.domElement.addEventListener("mousemove", handlePointerMove);

    // Animation Loop
    const clock = new T.Clock();

    const animate = () => {
      if (disposed) return;
      animFrame = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const currentActive = activeHotspotRef.current;

      // Find target Y based on active hotspot
      let targetY = 1.05;
      let activeColor = 0xe3202b;

      if (currentActive === "brain") {
        targetY = 1.55;
        activeColor = 0x10b981;
      } else if (currentActive === "thyroid") {
        targetY = 1.38;
        activeColor = 0x059669;
      } else if (currentActive === "heart") {
        targetY = 1.22;
        activeColor = 0xf59e0b;
      } else {
        targetY = 1.05;
        activeColor = 0xe3202b;
      }

      // Smoothly glide scanner ring to active organ height
      scanRingGroup.position.y += (targetY - scanRingGroup.position.y) * 0.085;

      // Smoothly interpolate scanner torus color and light
      (torusMesh.material as T.MeshStandardMaterial).color.lerp(new T.Color(activeColor), 0.1);
      (torusMesh.material as T.MeshStandardMaterial).emissive.lerp(new T.Color(activeColor), 0.1);
      (laserDisk.material as T.MeshBasicMaterial).color.lerp(new T.Color(activeColor), 0.1);
      scanLight.color.lerp(new T.Color(activeColor), 0.1);

      // Pulse active beacon and rotate auras
      hotspotMeshes.forEach((h) => {
        const isActive = h.id === currentActive;
        const pulse = 1 + Math.sin(elapsedTime * (isActive ? 4.5 : 2.0)) * (isActive ? 0.22 : 0.08);

        h.mesh.scale.set(pulse, pulse, pulse);
        h.auraMesh.scale.set(pulse * 1.3, pulse * 1.3, pulse * 1.3);
        (h.auraMesh.material as T.MeshBasicMaterial).opacity = isActive ? 0.55 : 0.15;
      });

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!el || disposed) return;
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };

    const resizeObs = new ResizeObserver(handleResize);
    resizeObs.observe(el);

    return () => {
      disposed = true;
      cancelAnimationFrame(animFrame);
      resizeObs.disconnect();
      renderer.domElement.removeEventListener("click", handleClick);
      renderer.domElement.removeEventListener("mousemove", handlePointerMove);
      controls.dispose();
      renderer.dispose();
      if (el.contains(renderer.domElement)) {
        el.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[220px] flex items-center justify-center">
      {/* 3D WebGL Canvas Host */}
      <div ref={mountRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* View Angle Selector Buttons (Front / Side / Back) */}
      <div className="absolute top-1 right-1 z-20 flex items-center bg-white/80 backdrop-blur-md p-0.5 rounded-full border border-slate-200/60 shadow-2xs text-[10px] font-semibold">
        {(["front", "side", "back"] as const).map((view) => (
          <button
            key={view}
            type="button"
            onClick={() => handleViewChange(view)}
            className={`px-2 py-0.5 rounded-full capitalize transition-all cursor-pointer ${
              activeView === view
                ? "bg-[#1D1F22] text-white shadow-2xs"
                : "text-[#64748B] hover:text-[#1D1F22]"
            }`}
          >
            {view}
          </button>
        ))}
      </div>

      {/* Subtle Hologram Ground Flare */}
      <div
        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-6 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(227,32,43,0.3) 0%, transparent 70%)",
          filter: "blur(6px)",
        }}
      />
    </div>
  );
}
