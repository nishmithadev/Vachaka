// src/component/HandTracker.js
import React, { useRef, useEffect } from "react";
import { createHandsInstance } from "../utils/handsHelper";
import { Camera } from "@mediapipe/camera_utils";

/**
 * HandTracker component
 * - Renders a hidden video element (webcam) and a canvas overlay for drawing landmarks.
 * - Uses createHandsInstance which forces stable WASM (no SIMD).
 *
 * Props:
 *  - width (number) default 640
 *  - height (number) default 480
 *  - onLandmarks (function) optional callback with results
 */
export default function HandTracker({ width = 640, height = 480, onLandmarks }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);
  const handsRef = useRef(null);

  useEffect(() => {
    let stopped = false;

    function drawResults(results) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // draw the incoming image (video frame)
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (results.image) {
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
      }

      // draw landmarks
      if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
          // draw small circles for landmarks
          for (const lm of landmarks) {
            const x = lm.x * canvas.width;
            const y = lm.y * canvas.height;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fillStyle = "rgba(255, 0, 0, 0.8)";
            ctx.fill();
          }

          // draw simple lines between a few joints to make it more readable
          const connections = [
            [0, 1], [1, 2], [2, 3], [3, 4],       // thumb
            [0, 5], [5, 6], [6, 7], [7, 8],       // index
            [0, 9], [9, 10], [10, 11], [11, 12],  // middle
            [0, 13], [13, 14], [14, 15], [15, 16],// ring
            [0, 17], [17, 18], [18, 19], [19, 20] // pinky
          ];
          ctx.lineWidth = 2;
          ctx.strokeStyle = "rgba(0,0,255,0.7)";
          for (const [a, b] of connections) {
            const A = landmarks[a];
            const B = landmarks[b];
            ctx.beginPath();
            ctx.moveTo(A.x * canvas.width, A.y * canvas.height);
            ctx.lineTo(B.x * canvas.width, B.y * canvas.height);
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      // Optional external callback
      if (typeof onLandmarks === "function") {
        onLandmarks(results);
      }
    }

    async function init() {
      if (stopped) return;
      if (!videoRef.current) return;

      // create Hands instance (this will use stable wasm for SIMD requests)
      const hands = createHandsInstance(drawResults);
      handsRef.current = hands;

      // camera utils expects a video element
      try {
        cameraRef.current = new Camera(videoRef.current, {
          onFrame: async () => {
            try {
              await hands.send({ image: videoRef.current });
            } catch (err) {
              console.error("Error sending frame to MediaPipe Hands:", err);
            }
          },
          width,
          height,
        });

        await cameraRef.current.start();
      } catch (err) {
        console.error("Could not start camera:", err);
      }
    }

    init();

    return () => {
      stopped = true;
      // stop camera
      try {
        if (cameraRef.current && typeof cameraRef.current.stop === "function") {
          cameraRef.current.stop();
        }
      } catch (e) {}
      // close hands
      try {
        if (handsRef.current && typeof handsRef.current.close === "function") {
          handsRef.current.close();
        }
      } catch (e) {}
    };
  }, [width, height, onLandmarks]);

  return (
    <div style={{ position: "relative", width, height }}>
      {/* Hidden video used by MediaPipe camera util */}
      <video
        ref={videoRef}
        id="input_video"
        style={{ display: "none" }}
        playsInline
        autoPlay
        muted
        width={width}
        height={height}
      />
      {/* Canvas overlay */}
      <canvas
        ref={canvasRef}
        id="output_canvas"
        width={width}
        height={height}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width,
          height,
          touchAction: "none",
        }}
      />
    </div>
  );
}
