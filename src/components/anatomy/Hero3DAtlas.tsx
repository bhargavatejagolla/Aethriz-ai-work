'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as T from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { decodeModelResponse } from './model-download';
import { SYSTEMS, type Atlas } from './anatomy';

export default function Hero3DAtlas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    let disposed = false;
    let animFrame = 0;
    const abort = new AbortController();

    let renderer: T.WebGLRenderer;
    try {
      renderer = new T.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch {
      setLoadError('WebGL not supported in this browser.');
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    el.appendChild(renderer.domElement);

    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(32, el.clientWidth / el.clientHeight, 0.01, 50);
    camera.position.set(0, 0.92, 3.2);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.88, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableZoom = true;
    controls.minDistance = 1.2;
    controls.maxDistance = 6.0;
    controls.maxPolarAngle = Math.PI * 0.92;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;

    // Lighting
    scene.add(new T.HemisphereLight(0xffffff, 0xb0b8c0, 1.2));
    const keyLight = new T.DirectionalLight(0xfffaf6, 2.5);
    keyLight.position.set(-2, 3.5, 2.5);
    scene.add(keyLight);

    const rimLight = new T.DirectionalLight(0xffe6e6, 2.2);
    rimLight.position.set(2, 2, -2.5);
    scene.add(rimLight);

    // 3D Scanner Platform
    const platformGeo = new T.CylinderGeometry(0.65, 0.68, 0.024, 80);
    const platformMat = new T.MeshStandardMaterial({
      color: 0x1f242d,
      roughness: 0.5,
      metalness: 0.3
    });
    const platform = new T.Mesh(platformGeo, platformMat);
    platform.position.y = -0.012;
    scene.add(platform);

    const baseRing = new T.Mesh(
      new T.RingGeometry(0.58, 0.59, 96),
      new T.MeshBasicMaterial({ color: 0xe3202b, transparent: true, opacity: 0.7, side: T.DoubleSide })
    );
    baseRing.rotation.x = -Math.PI / 2;
    baseRing.position.y = 0.002;
    scene.add(baseRing);

    // 3D Animated Laser Scanning Torus Ring (Encircle the body in 3D space!)
    const scanRingGroup = new T.Group();

    // Primary Torus Laser Tube
    const torusGeo = new T.TorusGeometry(0.52, 0.014, 16, 96);
    const torusMat = new T.MeshStandardMaterial({
      color: 0xe3202b,
      emissive: 0xff1e2b,
      emissiveIntensity: 2.8,
      roughness: 0.15,
      metalness: 0.85
    });
    const torusMesh = new T.Mesh(torusGeo, torusMat);
    torusMesh.rotation.x = Math.PI / 2;
    scanRingGroup.add(torusMesh);

    // Inner Translucent Laser Plane Disk
    const laserDiskGeo = new T.RingGeometry(0.02, 0.52, 64);
    const laserDiskMat = new T.MeshBasicMaterial({
      color: 0xe3202b,
      transparent: true,
      opacity: 0.18,
      side: T.DoubleSide,
      blending: T.AdditiveBlending,
      depthWrite: false
    });
    const laserDisk = new T.Mesh(laserDiskGeo, laserDiskMat);
    laserDisk.rotation.x = Math.PI / 2;
    scanRingGroup.add(laserDisk);

    // Dynamic Scanner Light that illuminates body geometry
    const scanLight = new T.PointLight(0xe3202b, 2.2, 1.8);
    scanRingGroup.add(scanLight);

    scanRingGroup.position.y = 0.08;
    scene.add(scanRingGroup);

    // Systems to display for the muscular human body
    const activeSystems = new Set(['muscular', 'cardiac', 'skeletal', 'arterial']);

    // Load and build anatomical 3D geometry
    (async () => {
      try {
        const atlasRes = await fetch('/models/atlas.json', { signal: abort.signal });
        if (!atlasRes.ok) throw new Error('Could not load atlas metadata.');
        const atlas: Atlas = await atlasRes.json();
        if (disposed) return;

        // Group parts by chunk
        const chunkIndices = Array.from(new Set(
          atlas.parts
            .filter(p => activeSystems.has(p.system))
            .map(p => p.chunk)
        ));

        let loadedCount = 0;

        for (const ci of chunkIndices) {
          if (disposed) return;
          const chunk = atlas.chunks[ci];
          const compressed = !!chunk.gzip && typeof DecompressionStream !== 'undefined';
          const chunkRes = await fetch(compressed ? chunk.gzip! : chunk.url, { signal: abort.signal });
          const buffer = await decodeModelResponse(chunkRes, chunk.bytes, compressed);
          if (disposed) return;

          const groups = new Map<string, T.BufferGeometry[]>();

          atlas.parts.forEach(p => {
            if (p.chunk !== ci || !activeSystems.has(p.system)) return;
            const g = new T.BufferGeometry();
            g.setAttribute('position', new T.BufferAttribute(new Float32Array(buffer, p.positions, p.vertexCount * 3), 3));
            g.setAttribute('normal', new T.BufferAttribute(new Int16Array(buffer, p.normals, p.vertexCount * 3), 3, true));
            g.setIndex(new T.BufferAttribute(new Uint32Array(buffer, p.indices, p.indexCount), 1));
            
            const list = groups.get(p.system) || [];
            list.push(g);
            groups.set(p.system, list);
          });

          groups.forEach((geoms, system) => {
            const merged = mergeGeometries(geoms, false);
            if (!merged) return;

            let colorHex = 0xa85b50; // muscular terracotta
            let roughness = 0.48;
            let metalness = 0.12;

            if (system === 'cardiac') {
              colorHex = 0xdc2626;
              roughness = 0.35;
            } else if (system === 'skeletal') {
              colorHex = 0xd4c5a9;
              roughness = 0.65;
            } else if (system === 'arterial') {
              colorHex = 0xef4444;
              roughness = 0.3;
            }

            const mat = new T.MeshStandardMaterial({
              color: colorHex,
              roughness,
              metalness,
              side: T.DoubleSide
            });

            const mesh = new T.Mesh(merged, mat);
            scene.add(mesh);
          });

          loadedCount++;
          setLoadingProgress(Math.round((loadedCount / chunkIndices.length) * 100));
        }

        if (!disposed) {
          setIsLoaded(true);
        }
      } catch (err: unknown) {
        if (!disposed && err instanceof Error && err.name !== 'AbortError') {
          setLoadError(err.message || 'Error loading 3D model.');
        }
      }
    })();

    // Resize observer
    const handleResize = () => {
      if (!el || !renderer || !camera) return;
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    const resizeObs = new ResizeObserver(handleResize);
    resizeObs.observe(el);

    // Animation Loop
    const clock = new T.Clock();
    const animate = () => {
      if (disposed) return;
      animFrame = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth 3D vertical travel of the scanner ring from feet (0.06) to head (1.75)
      const scanCycle = (Math.sin(elapsedTime * 0.95) + 1) * 0.5; // 0 to 1
      scanRingGroup.position.y = T.MathUtils.lerp(0.06, 1.74, scanCycle);

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(animFrame);
      abort.abort();
      resizeObs.disconnect();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Loading Progress Overlay */}
      {!isLoaded && !loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#F1F5F9]/40 backdrop-blur-xs pointer-events-none">
          <div className="w-9 h-9 rounded-full border-2 border-[#E3202B]/20 border-t-[#E3202B] animate-spin" />
          <div className="text-center font-mono text-xs text-[#545B61] space-y-0.5">
            <div className="font-semibold text-[#1D1F22]">Initializing 3D Atlas</div>
            <div>{loadingProgress}% • BodyParts3D Muscular Model</div>
          </div>
        </div>
      )}

      {/* Error state */}
      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-xs text-[#C8161F] bg-white/70 backdrop-blur-sm">
          {loadError}
        </div>
      )}

      {/* 3D Interaction Hint Badge */}
      {isLoaded && (
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-white/80 shadow-xs text-[11px] text-[#545B61] pointer-events-none select-none flex items-center gap-1.5 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E3202B] ae-pulse" />
          <span>Drag to orbit 3D • Pinch to zoom</span>
        </div>
      )}
    </div>
  );
}
