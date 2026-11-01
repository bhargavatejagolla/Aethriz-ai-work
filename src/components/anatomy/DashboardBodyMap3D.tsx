"use client";

import React, { useEffect, useRef, useState } from "react";
import * as T from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { decodeModelResponse } from "./model-download";
import { type Atlas } from "./anatomy";

export type HotspotId = "brain" | "heart" | "metabolic" | "thyroid";

interface Props {
  activeHotspot: HotspotId;
  onSelectHotspot?: (hotspot: HotspotId) => void;
}

interface CachedMeshPayload {
  groups: { system: string; geometry: T.BufferGeometry }[];
}

// Module-level cache for parsed geometry groups so page switching/re-renders are instant
let cachedMeshes: CachedMeshPayload | null = null;
let meshLoadPromise: Promise<CachedMeshPayload | null> | null = null;

async function loadAtlasMeshes(signal?: AbortSignal) {
  if (cachedMeshes) return cachedMeshes;
  if (meshLoadPromise) return meshLoadPromise;

  meshLoadPromise = (async () => {
    try {
      const atlasRes = await fetch("/models/atlas.json", { signal });
      if (!atlasRes.ok) throw new Error("Could not load atlas.json");
      const atlas: Atlas = await atlasRes.json();

      const activeSystems = new Set(["muscular", "cardiac", "skeletal", "arterial"]);
      const chunkIndices = Array.from(
        new Set(
          atlas.parts
            .filter((p) => activeSystems.has(p.system))
            .map((p) => p.chunk)
        )
      );

      const systemGeoms = new Map<string, T.BufferGeometry[]>();

      // Load prioritized chunks
      for (const ci of chunkIndices) {
        try {
          const chunk = atlas.chunks[ci];
          const compressed = !!chunk.gzip && typeof DecompressionStream !== "undefined";
          const chunkRes = await fetch(compressed ? chunk.gzip! : chunk.url, { signal });
          const buffer = await decodeModelResponse(chunkRes, chunk.bytes, compressed);

          atlas.parts.forEach((p) => {
            if (p.chunk !== ci || !activeSystems.has(p.system)) return;
            const g = new T.BufferGeometry();
            g.setAttribute(
              "position",
              new T.BufferAttribute(new Float32Array(buffer, p.positions, p.vertexCount * 3), 3)
            );
            g.setAttribute(
              "normal",
              new T.BufferAttribute(new Int16Array(buffer, p.normals, p.vertexCount * 3), 3, true)
            );
            g.setIndex(new T.BufferAttribute(new Uint32Array(buffer, p.indices, p.indexCount), 1));

            const list = systemGeoms.get(p.system) || [];
            list.push(g);
            systemGeoms.set(p.system, list);
          });
        } catch (e) {
          console.warn(`Chunk ${ci} loading skipped`, e);
        }
      }

      const mergedGroups: { system: string; geometry: T.BufferGeometry }[] = [];
      systemGeoms.forEach((geoms, system) => {
        const merged = mergeGeometries(geoms, false);
        if (merged) {
          mergedGroups.push({ system, geometry: merged });
        }
      });

      cachedMeshes = { groups: mergedGroups };
      return cachedMeshes;
    } catch (err) {
      console.warn("Atlas load error:", err);
      return null;
    }
  })();

  return meshLoadPromise;
}

export default function DashboardBodyMap3D({ activeHotspot, onSelectHotspot }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeHotspotRef = useRef<HotspotId>(activeHotspot);
  const onSelectRef = useRef(onSelectHotspot);
  const [loadPercent, setLoadPercent] = useState<number>(cachedMeshes ? 100 : 0);
  const [isReady, setIsReady] = useState<boolean>(!!cachedMeshes);

  activeHotspotRef.current = activeHotspot;
  onSelectRef.current = onSelectHotspot;

  // Single mount effect: keep WebGL canvas alive across activeHotspot clicks!
  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    let disposed = false;
    let animFrame = 0;
    const abort = new AbortController();

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
    camera.position.set(0.1, 1.15, 2.5);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.95, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableZoom = false; // Keep dashboard card layout stable
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.7;
    controls.minPolarAngle = Math.PI * 0.28;
    controls.maxPolarAngle = Math.PI * 0.72;

    // Clinical Studio Lighting
    scene.add(new T.HemisphereLight(0xffffff, 0xb0b8c0, 1.4));
    const keyLight = new T.DirectionalLight(0xfff5f0, 2.2);
    keyLight.position.set(-2, 3.5, 2.5);
    scene.add(keyLight);

    const rimLight = new T.DirectionalLight(0xffe6e8, 2.0);
    rimLight.position.set(2, 2, -2.5);
    scene.add(rimLight);

    // Clinical Ground Pedestal
    const pedestal = new T.Mesh(
      new T.CylinderGeometry(0.55, 0.58, 0.02, 64),
      new T.MeshStandardMaterial({ color: 0x181a20, metalness: 0.2, roughness: 0.5 })
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
      new T.TorusGeometry(0.42, 0.012, 16, 64),
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
      new T.RingGeometry(0.02, 0.42, 48),
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

    // ==============================================================
    // INTERACTIVE HOTSPOT BEACONS (RAYCASTABLE & CLICKABLE)
    // ==============================================================
    const hotspotGroup = new T.Group();
    const hotspotMeshes: { id: HotspotId; mesh: T.Mesh; auraMesh: T.Mesh; y: number }[] = [];

    const createBeacon = (
      id: HotspotId,
      pos: [number, number, number],
      colorHex: number,
      radius: number
    ) => {
      // Core sphere
      const core = new T.Mesh(
        new T.SphereGeometry(radius, 16, 16),
        new T.MeshStandardMaterial({
          color: colorHex,
          emissive: colorHex,
          emissiveIntensity: 3.0,
          roughness: 0.2,
        })
      );
      core.position.set(...pos);
      core.userData = { hotspotId: id };

      // Outer aura ring/sphere
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

    // ==============================================================
    // INSTANT PROCEDURAL ANATOMICAL SILHOUETTE (ZERO-DELAY DISPLAY)
    // ==============================================================
    const silhouetteGroup = new T.Group();
    const silMat = new T.MeshStandardMaterial({
      color: 0x9e5d52,
      roughness: 0.45,
      metalness: 0.15,
      transparent: true,
      opacity: 0.88,
    });

    // Sculpted anatomical segments
    const headMesh = new T.Mesh(new T.SphereGeometry(0.12, 24, 24), silMat);
    headMesh.position.set(0, 1.55, 0);
    headMesh.scale.set(0.9, 1.15, 0.95);
    silhouetteGroup.add(headMesh);

    const neckMesh = new T.Mesh(new T.CylinderGeometry(0.05, 0.065, 0.1, 16), silMat);
    neckMesh.position.set(0, 1.39, 0);
    silhouetteGroup.add(neckMesh);

    const chestMesh = new T.Mesh(new T.CylinderGeometry(0.19, 0.15, 0.28, 20), silMat);
    chestMesh.position.set(0, 1.23, 0);
    chestMesh.scale.set(1.15, 1, 0.85);
    silhouetteGroup.add(chestMesh);

    const abdomenMesh = new T.Mesh(new T.CylinderGeometry(0.15, 0.17, 0.24, 20), silMat);
    abdomenMesh.position.set(0, 0.99, 0);
    abdomenMesh.scale.set(1.08, 1, 0.88);
    silhouetteGroup.add(abdomenMesh);

    const pelvisMesh = new T.Mesh(new T.CylinderGeometry(0.17, 0.15, 0.16, 20), silMat);
    pelvisMesh.position.set(0, 0.8, 0);
    pelvisMesh.scale.set(1.12, 1, 0.9);
    silhouetteGroup.add(pelvisMesh);

    const legLeft = new T.Mesh(new T.CylinderGeometry(0.065, 0.04, 0.76, 16), silMat);
    legLeft.position.set(-0.09, 0.38, 0);
    silhouetteGroup.add(legLeft);

    const legRight = new T.Mesh(new T.CylinderGeometry(0.065, 0.04, 0.76, 16), silMat);
    legRight.position.set(0.09, 0.38, 0);
    silhouetteGroup.add(legRight);

    scene.add(silhouetteGroup);

    // ==============================================================
    // LOAD REAL 3D ANATOMICAL MESHES FROM ashemag-human-atlas
    // ==============================================================
    let atlasMeshGroup: T.Group | null = null;

    loadAtlasMeshes(abort.signal).then((cached) => {
      if (disposed || !cached) return;

      atlasMeshGroup = new T.Group();
      cached.groups.forEach(({ system, geometry }) => {
        let colorHex = 0xa85b50;
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
        atlasMeshGroup!.add(mesh);
      });

      // Smoothly replace procedural silhouette with atlas meshes
      scene.remove(silhouetteGroup);
      scene.add(atlasMeshGroup);
      setIsReady(true);
      setLoadPercent(100);
    });

    // ==============================================================
    // INTERACTION: RAYCASTING ON 3D BODY BEACONS
    // ==============================================================
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

    // ==============================================================
    // ANIMATION LOOP (PERSISTENT & BUTTERY-SMOOTH)
    // ==============================================================
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

      // Gently track camera target towards active organ
      controls.target.y += (targetY * 0.4 + 0.5 - controls.target.y) * 0.04;

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

    window.addEventListener("resize", handleResize);

    return () => {
      disposed = true;
      abort.abort();
      cancelAnimationFrame(animFrame);
      renderer.domElement.removeEventListener("click", handleClick);
      renderer.domElement.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      renderer.dispose();
      if (el.contains(renderer.domElement)) {
        el.removeChild(renderer.domElement);
      }
    };
  }, []); // Run ONCE on mount!

  return (
    <div className="relative w-full h-full min-h-[175px] flex items-center justify-center">
      {/* 3D WebGL Canvas Host */}
      <div ref={mountRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Syncing Status Indicator */}
      {!isReady && loadPercent < 100 && (
        <div className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded-full bg-black/60 text-white font-mono text-[9px] flex items-center gap-1.5 backdrop-blur-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E3202B] animate-ping" />
          <span>Synchronising Body Atlas</span>
        </div>
      )}

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
