import { Hands } from "@mediapipe/hands";

// 🧠 Optional: Detect SIMD support (basic heuristic)
function supportsSIMD() {
  return typeof WebAssembly === "object" &&
         WebAssembly.validate(new Uint8Array([
           0x00, 0x61, 0x73, 0x6D, // WASM binary magic
           0x01, 0x00, 0x00, 0x00  // WASM binary version
           // This is a minimal stub; real SIMD detection would require a valid SIMD module
         ]));
}

export function createHandsInstance(onResultsCallback) {
  const useStableWasm = !supportsSIMD();

  const hands = new Hands({
   locateFile: (file) => {
  if (useStableWasm && file.includes("simd")) {
    console.warn("⚠️ SIMD not supported. Redirecting to stable WASM...");
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands_solution_wasm_bin.wasm`;
  }
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
},
  });

  hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7,
  });

  if (onResultsCallback) {
    hands.onResults(onResultsCallback);
  }

  return hands;
}
