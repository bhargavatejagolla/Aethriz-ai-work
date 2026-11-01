"use client";

import React, { useEffect, useRef } from "react";
import * as T from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface Props {
  viewMode: "Front" | "Back" | "Side";
  systemLayer: "Surface" | "Muscle" | "Skeletal" | "Organ";
  focusedIssue: "shoulder" | "back";
  zoomLevel: number;
  rotationOffset: number;
}

export default function BodyExplorer3DViewer({
  viewMode,
  systemLayer,
  focusedIssue,
  zoomLevel,
  rotationOffset,
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<T.PerspectiveCamera | null>(null);
  const bodyGroupRef = useRef<T.Group | null>(null);

  // Synchronize Camera angles when viewMode changes
  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;

    const dist = 3.2 / (zoomLevel / 100);

    if (viewMode === "Front") {
      cam.position.set(0, 1.0, dist);
    } else if (viewMode === "Back") {
      cam.position.set(0, 1.0, -dist);
    } else if (viewMode === "Side") {
      cam.position.set(dist, 1.0, 0);
    }
    ctrl.target.set(0, 0.9, 0);
    ctrl.update();
  }, [viewMode, zoomLevel]);

  // Synchronize Rotation offset
  useEffect(() => {
    if (!bodyGroupRef.current) return;
    bodyGroupRef.current.rotation.y = (rotationOffset * Math.PI) / 180;
  }, [rotationOffset]);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    let disposed = false;
    let animFrame = 0;

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

    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(32, el.clientWidth / el.clientHeight, 0.05, 50);
    camera.position.set(0, 1.0, 3.2);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.9, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 1.0;
    controls.maxDistance = 6.0;
    controls.maxPolarAngle = Math.PI * 0.92;
    controlsRef.current = controls;

    // Lights
    scene.add(new T.HemisphereLight(0xffffff, 0xb0b8c0, 1.4));
    const key = new T.DirectionalLight(0xfff5f0, 2.4);
    key.position.set(-2, 3.5, 2.5);
    scene.add(key);

    const rim = new T.DirectionalLight(0xffe6e8, 2.0);
    rim.position.set(2, 2, -2.5);
    scene.add(rim);

    // Clinical circular telemetry platform
    const platform = new T.Mesh(
      new T.CylinderGeometry(0.65, 0.68, 0.024, 80),
      new T.MeshStandardMaterial({ color: 0x181a20, metalness: 0.2, roughness: 0.5 })
    );
    platform.position.y = -0.012;
    scene.add(platform);

    const baseRing = new T.Mesh(
      new T.RingGeometry(0.58, 0.59, 96),
      new T.MeshBasicMaterial({ color: 0xe3202b, transparent: true, opacity: 0.7, side: T.DoubleSide })
    );
    baseRing.rotation.x = -Math.PI / 2;
    baseRing.position.y = 0.002;
    scene.add(baseRing);

    // Dynamic 3D depth-encircling elliptical scanner
    const scanRing = new T.Group();
    const torusMesh = new T.Mesh(
      new T.TorusGeometry(0.54, 0.012, 16, 96),
      new T.MeshStandardMaterial({
        color: 0xe3202b,
        emissive: 0xff1e2b,
        emissiveIntensity: 3.0,
        roughness: 0.15,
        metalness: 0.85,
      })
    );
    torusMesh.rotation.x = Math.PI / 2;
    scanRing.add(torusMesh);

    const laserDisk = new T.Mesh(
      new T.RingGeometry(0.02, 0.54, 64),
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
    scanRing.add(laserDisk);

    const scanLight = new T.PointLight(0xe3202b, 2.0, 1.8);
    scanRing.add(scanLight);
    scene.add(scanRing);

    // ==========================================
    // 3D HUMAN ANATOMICAL MODEL
    // ==========================================
    const bodyGroup = new T.Group();
    bodyGroupRef.current = bodyGroup;

    // Material dynamically adapts to chosen system layer
    let bodyMat: T.Material;
    if (systemLayer === "Skeletal") {
      bodyMat = new T.MeshStandardMaterial({
        color: 0xe2d9ba,
        roughness: 0.45,
        metalness: 0.1,
      });
    } else if (systemLayer === "Muscle") {
      bodyMat = new T.MeshStandardMaterial({
        color: 0xa85b50,
        roughness: 0.35,
        metalness: 0.15,
      });
    } else if (systemLayer === "Organ") {
      bodyMat = new T.MeshPhysicalMaterial({
        color: 0xffdada,
        roughness: 0.25,
        metalness: 0.05,
        transmission: 0.7,
        transparent: true,
        opacity: 0.75,
      });
    } else {
      // Surface layer
      bodyMat = new T.MeshPhysicalMaterial({
        color: 0xffdcdb,
        roughness: 0.22,
        metalness: 0.05,
        transmission: 0.65,
        thickness: 0.55,
        transparent: true,
        opacity: 0.88,
        ior: 1.34,
      });
    }

    // Head
    const headGeo = new T.SphereGeometry(0.125, 32, 32);
    headGeo.scale(0.9, 1.15, 0.95);
    const head = new T.Mesh(headGeo, bodyMat);
    head.position.set(0, 1.55, 0);
    bodyGroup.add(head);

    // Neck
    const neckGeo = new T.CylinderGeometry(0.052, 0.065, 0.1, 24);
    const neck = new T.Mesh(neckGeo, bodyMat);
    neck.position.set(0, 1.39, 0);
    bodyGroup.add(neck);

    // Chest & Abdomen
    const chestGeo = new T.CylinderGeometry(0.19, 0.16, 0.32, 32);
    chestGeo.scale(1.15, 1, 0.72);
    const chest = new T.Mesh(chestGeo, bodyMat);
    chest.position.set(0, 1.2, 0);
    bodyGroup.add(chest);

    const abdomenGeo = new T.CylinderGeometry(0.155, 0.175, 0.26, 32);
    abdomenGeo.scale(1.1, 1, 0.7);
    const abdomen = new T.Mesh(abdomenGeo, bodyMat);
    abdomen.position.set(0, 0.93, 0);
    bodyGroup.add(abdomen);

    // Pelvis
    const pelvisGeo = new T.CylinderGeometry(0.175, 0.14, 0.16, 32);
    pelvisGeo.scale(1.1, 1, 0.75);
    const pelvis = new T.Mesh(pelvisGeo, bodyMat);
    pelvis.position.set(0, 0.74, 0);
    bodyGroup.add(pelvis);

    // Limbs Builder
    const addLimb = (x: number, y: number, z: number, rotZ: number, len: number, rT: number, rB: number) => {
      const g = new T.CylinderGeometry(rT, rB, len, 24);
      const m = new T.Mesh(g, bodyMat);
      m.position.set(x, y, z);
      m.rotation.z = rotZ;
      bodyGroup.add(m);
    };

    // Arms
    addLimb(-0.25, 1.18, 0, 0.14, 0.32, 0.05, 0.042);
    addLimb(0.25, 1.18, 0, -0.14, 0.32, 0.05, 0.042);
    addLimb(-0.29, 0.88, 0.02, 0.08, 0.32, 0.04, 0.032);
    addLimb(0.29, 0.88, 0.02, -0.08, 0.32, 0.04, 0.032);

    // Legs
    addLimb(-0.11, 0.48, 0, 0.04, 0.42, 0.068, 0.052);
    addLimb(0.11, 0.48, 0, -0.04, 0.42, 0.068, 0.052);
    addLimb(-0.115, 0.16, 0, 0.01, 0.38, 0.05, 0.038);
    addLimb(0.115, 0.16, 0, -0.01, 0.38, 0.05, 0.038);

    // Hotspot Nodes
    // Right Shoulder Node (Focus issue)
    const shoulderNodeMat = new T.MeshStandardMaterial({
      color: 0xe3202b,
      emissive: 0xff1e2b,
      emissiveIntensity: 3.5,
      roughness: 0.15,
    });
    const shoulderNode = new T.Mesh(new T.SphereGeometry(0.045, 24, 24), shoulderNodeMat);
    shoulderNode.position.set(0.22, 1.28, 0.04);
    bodyGroup.add(shoulderNode);

    // Lower Back Node
    const backNodeMat = new T.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xf59e0b,
      emissiveIntensity: 2.5,
      roughness: 0.2,
    });
    const backNode = new T.Mesh(new T.SphereGeometry(0.042, 24, 24), backNodeMat);
    backNode.position.set(0, 0.88, -0.1);
    bodyGroup.add(backNode);

    // Beating Heart
    const heartMesh = new T.Mesh(
      new T.SphereGeometry(0.045, 20, 20),
      new T.MeshStandardMaterial({
        color: 0xe3202b,
        emissive: 0xe3202b,
        emissiveIntensity: 2.0,
      })
    );
    heartMesh.position.set(-0.035, 1.22, 0.045);
    bodyGroup.add(heartMesh);

    scene.add(bodyGroup);

    // Animation Loop
    let clock = new T.Clock();

    const animate = () => {
      if (disposed) return;
      animFrame = requestAnimationFrame(animate);

      const t = clock.getElapsedTime();

      // Scanner Ring vertical movement
      scanRing.position.y = 0.88 + Math.sin(t * 1.5) * 0.42;

      // Pulsing hotspot nodes
      const p1 = 1 + Math.sin(t * 4.5) * 0.15;
      shoulderNode.scale.set(p1, p1, p1);

      const p2 = 1 + Math.sin(t * 3.5) * 0.12;
      backNode.scale.set(p2, p2, p2);

      const hP = 1 + Math.sin(t * 4.2) * 0.08;
      heartMesh.scale.set(hP, hP, hP);

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
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      renderer.dispose();
      if (el.contains(renderer.domElement)) {
        el.removeChild(renderer.domElement);
      }
    };
  }, [systemLayer]);

  return (
    <div className="relative w-full h-[520px] flex items-center justify-center">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Target Node Callout */}
      <div className="absolute top-1/3 right-1/4 pointer-events-none ae-fade-in">
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-red-200 shadow-lg flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-red-50 text-[#E3202B] flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="8" />
            </svg>
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#1D1F22]">Right shoulder</h4>
            <p className="text-[10px] text-[#E3202B] font-semibold">Tension cluster · selected</p>
          </div>
        </div>
      </div>
    </div>
  );
}
