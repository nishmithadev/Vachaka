// src/utils/handsHelper.js
// Centralized MediaPipe Hands helper that forces stable (non-SIMD) WASM
import { Hands } from "@mediapipe/hands";

export function createHandsInstance(onResultsCallback) {
  const hands = new Hands({
    locateFile: (file) => {
      // If MediaPipe tries to load a SIMD WASM, redirect to stable WASM.
      // Prefer a self-hosted stable WASM in /assets if available, otherwise CDN fallback.
      if (file.includes("simd")) {
        console.warn("⚠️ SIMD WASM blocked. Using stable WASM instead...");
        try {
          // If app served from server, this will resolve to e.g. https://yourdomain.com/assets/...
          const selfHosted = `${window.location.origin}/assets/hands_solution_wasm_bin.js`;
          return selfHosted;
        } catch (e) {
          // Fallback to CDN stable wasm if window/location not available for some reason
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands_solution_wasm_bin.js`;
        }
      }
      // Normal files (js bindings, etc.) from CDN
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    },
  });

  // sensible defaults — tweak if you need different behavior
  hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7,
  });

  if (typeof onResultsCallback === "function") {
    hands.onResults(onResultsCallback);
  }

  return hands;
}
