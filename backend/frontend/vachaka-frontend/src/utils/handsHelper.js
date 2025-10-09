// src/utils/handsHelper.js
import { Hands } from "@mediapipe/hands";

export function createHandsInstance(onResultsCallback) {
  const hands = new Hands({
    locateFile: (file) => {
      if (file.includes("simd")) {
        console.warn("⚠️ SIMD wasm requested → using stable wasm.");
        return `${window.location.origin}/assets/hands_solution_wasm_bin.wasm`;
      }
      if (file.endsWith(".data")) {
        return `${window.location.origin}/assets/hands_solution_packed_assets.bin`;
      }
      return `${window.location.origin}/assets/${file}`;
    },
  });

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
