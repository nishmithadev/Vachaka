import { Hands } from "@mediapipe/hands";

export function createHandsInstance(onResultsCallback) {
  const hands = new Hands({
    locateFile: (file) => {
      // ✅ Force redirect to stable wasm if simd is requested
      if (file.includes("simd")) {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands_solution_wasm_bin.js`;
      }
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    },
  });

  hands.setOptions({
    maxNumHands: 2,          // adjust per component
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7,
  });

  if (onResultsCallback) {
    hands.onResults(onResultsCallback);
  }

  return hands;
}
