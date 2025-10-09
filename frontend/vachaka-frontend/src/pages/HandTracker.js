// src/component/HandTracker.js
import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

const HandTracker = ({ onDetect }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const landmarkerRef = useRef(null);
  const [detectedSign, setDetectedSign] = useState("Waiting...");
  const [audioUrl, setAudioUrl] = useState(null);

  useEffect(() => {
    let stream;
    let frameCount = 0; // throttle frame sending

    async function init() {
      try {
        // ✅ Load MediaPipe model
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
        );

        landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          },
          runningMode: "VIDEO",
          numHands: 1,
        });

        // ✅ Start webcam
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        videoRef.current.onloadeddata = () => requestAnimationFrame(detectHands);
      } catch (err) {
        console.error("❌ Error initializing hand tracker:", err);
      }
    }

    async function detectHands() {
      if (!landmarkerRef.current || !videoRef.current) return;

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

      // ✅ Draw red dots for detected hand landmarks
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

      // ✅ Send frame every 15 frames (to reduce backend load)
      if (results.landmarks?.length > 0 && frameCount++ % 15 === 0) {
        const frame = canvasRef.current.toDataURL("image/jpeg");
        sendFrameToBackend(frame);
      }

      requestAnimationFrame(detectHands);
    }

    // ✅ Function to send captured frame → backend → TTS
    async function sendFrameToBackend(frameData) {
      try {
        const blob = await fetch(frameData).then((r) => r.blob());
        const formData = new FormData();
        formData.append("file", blob, "frame.jpg");

        // 🔹 Step 1: Get prediction from backend
        const response = await axios.post("http://127.0.0.1:8000/api/predict", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const sign = response.data.prediction;
        setDetectedSign(sign);
        if (onDetect) onDetect(sign);

        // 🔹 Step 2: Get Text-to-Speech audio for the predicted sign
        const ttsResponse = await axios.get(`http://127.0.0.1:8000/api/speak/${sign}`, {
          responseType: "arraybuffer",
        });

        const audioBlob = new Blob([ttsResponse.data], { type: "audio/mp3" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      } catch (err) {
        console.error("❌ Prediction or TTS failed:", err);
      }
    }

    init();

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [onDetect]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* ✅ Camera and Canvas */}
      <div style={{ position: "relative", width: 640, height: 480 }}>
        <video
          ref={videoRef}
          width="640"
          height="480"
          autoPlay
          playsInline
          style={{
            borderRadius: "12px",
            border: "2px solid #3b82f6",
            background: "black",
          }}
        />
        <canvas
          ref={canvasRef}
          width="640"
          height="480"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            borderRadius: "12px",
          }}
        />
      </div>

      {/* ✅ Prediction and Audio */}
      <div style={{ marginTop: 20, textAlign: "center" }}>
        <h2>
          Detected Sign:{" "}
          <span style={{ color: "#2563eb", fontWeight: "bold" }}>{detectedSign}</span>
        </h2>
        {audioUrl && (
          <audio key={audioUrl} controls autoPlay src={audioUrl}>
            Your browser does not support audio.
          </audio>
        )}
      </div>
    </div>
  );
};

export default HandTracker;
