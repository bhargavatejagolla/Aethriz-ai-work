"use client";

import * as T from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { decodeModelResponse } from "./model-download";
import { type Atlas } from "./anatomy";

export interface SystemGeometry {
  system: string;
  geometry: T.BufferGeometry;
}

// Global in-memory cache across pages and component unmounts
let cachedGeometries: SystemGeometry[] | null = null;
let activeFetchPromise: Promise<SystemGeometry[]> | null = null;

export async function loadAtlasModel(
  onChunkGeometry?: (item: SystemGeometry) => void,
  activeSystems: Set<string> = new Set(["muscular", "cardiac", "skeletal", "arterial"])
): Promise<SystemGeometry[]> {
  // 1. If already cached in memory, immediately dispatch each system and return
  if (cachedGeometries && cachedGeometries.length > 0) {
    if (onChunkGeometry) {
      for (const item of cachedGeometries) {
        onChunkGeometry(item);
      }
    }
    return cachedGeometries;
  }

  // 2. If a request is already in progress, await it
  if (activeFetchPromise) {
    const list = await activeFetchPromise;
    if (onChunkGeometry) {
      for (const item of list) {
        onChunkGeometry(item);
      }
    }
    return list;
  }

  // 3. Initiate chunk fetch and progressive streaming
  activeFetchPromise = (async () => {
    try {
      const atlasRes = await fetch("/models/atlas.json");
      if (!atlasRes.ok) throw new Error("Could not load atlas.json");
      const atlas: Atlas = await atlasRes.json();

      const chunkIndices = Array.from(
        new Set(
          atlas.parts
            .filter((p) => activeSystems.has(p.system))
            .map((p) => p.chunk)
        )
      );

      const systemGeomsMap = new Map<string, T.BufferGeometry[]>();
      const results: SystemGeometry[] = [];

      for (const ci of chunkIndices) {
        try {
          const chunk = atlas.chunks[ci];
          const compressed = !!chunk.gzip && typeof DecompressionStream !== "undefined";
          const chunkRes = await fetch(compressed ? chunk.gzip! : chunk.url);
          const buffer = await decodeModelResponse(chunkRes, chunk.bytes, compressed);

          const chunkSystemGeoms = new Map<string, T.BufferGeometry[]>();

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

            const list = chunkSystemGeoms.get(p.system) || [];
            list.push(g);
            chunkSystemGeoms.set(p.system, list);

            const allList = systemGeomsMap.get(p.system) || [];
            allList.push(g);
            systemGeomsMap.set(p.system, allList);
          });

          // Stream this chunk immediately
          chunkSystemGeoms.forEach((geoms, system) => {
            const merged = mergeGeometries(geoms, false);
            if (merged && onChunkGeometry) {
              onChunkGeometry({ system, geometry: merged });
            }
          });
        } catch (chunkErr) {
          console.warn(`Chunk ${ci} loading error:`, chunkErr);
        }
      }

      // Merge entire systems for long-term cache
      systemGeomsMap.forEach((geoms, system) => {
        const merged = mergeGeometries(geoms, false);
        if (merged) {
          results.push({ system, geometry: merged });
        }
      });

      cachedGeometries = results;
      return results;
    } catch (err) {
      console.error("Atlas loading failed:", err);
      activeFetchPromise = null;
      return [];
    }
  })();

  return activeFetchPromise;
}
