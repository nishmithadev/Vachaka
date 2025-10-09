// src/utils/handsHelper.js
import {
  FilesetResolver,
  HandLandmarker,
} from "@mediapipe/tasks-vision";

let handLandmarker;

export async function initHands() {
  if (!handLandmarker) {
    const vision = await FilesetResolver.forVisionTasks(
      // Mediapipe will fetch wasm for you automatically
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
    );

    handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
      },
      runningMode: "VIDEO",
      numHands: 2,
    });
  }
  return handLandmarker;
}
