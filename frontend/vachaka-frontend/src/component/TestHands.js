// src/components/TestHands.js
import React, { useRef, useEffect } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

export default function TestHands() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const landmarkerRef = useRef(null);

  useEffect(() => {
    let stream;

    async function init() {
      // Load the Mediapipe vision WASM files
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );

      // Create hand landmarker
      landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        },
        runningMode: "VIDEO",
        numHands: 2,
      });

      // Start webcam
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;

      videoRef.current.onloadeddata = () => {
        requestAnimationFrame(detectHands);
      };
    }

    async function detectHands() {
      if (!landmarkerRef.current) return;

      const results = await landmarkerRef.current.detectForVideo(
        videoRef.current,
        performance.now()
      );

      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      // Draw red dots for each landmark
      results.landmarks?.forEach((landmarks) => {
        landmarks.forEach((pt) => {
          ctx.beginPath();
          ctx.arc(
            pt.x * canvasRef.current.width,
            pt.y * canvasRef.current.height,
            5,
            0,
            2 * Math.PI
          );
          ctx.fillStyle = "red";
          ctx.fill();
        });
      });

      requestAnimationFrame(detectHands);
    }

    init();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div>
      <h2>Mediapipe Hands Test</h2>
      <video
        ref={videoRef}
        width="640"
        height="480"
        autoPlay
        playsInline
        style={{ display: "none" }}
      />
      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        style={{ border: "1px solid black" }}
      />
    </div>
  );
}
