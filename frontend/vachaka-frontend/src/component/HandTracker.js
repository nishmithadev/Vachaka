import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

const HandTracker = ({ onResults }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const outputRef = useRef(null);
  const handLandmarkerRef = useRef(null);

  const [detectedSign, setDetectedSign] = useState("Waiting...");
  const [audioUrl, setAudioUrl] = useState(null);

  useEffect(() => {
    let stream, animationId;

    async function init() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
        );

        handLandmarkerRef.current = await HandLandmarker.createFromOptions(
          vision,
          {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            },
            runningMode: "VIDEO",
            numHands: 1,
          }
        );

        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          requestAnimationFrame(detectHands);
        };
      } catch (err) {
        console.error("Camera init failed:", err);
      }
    }

    async function detectHands() {
      const video = videoRef.current;
      const landmarker = handLandmarkerRef.current;
      if (!video || !landmarker || video.readyState < 2) {
        animationId = requestAnimationFrame(detectHands);
        return;
      }

      const ctx = canvasRef.current.getContext("2d");
      const outCtx = outputRef.current.getContext("2d");
      ctx.drawImage(video, 0, 0, canvasRef.current.width, canvasRef.current.height);
      outCtx.clearRect(0, 0, outputRef.current.width, outputRef.current.height);

      try {
        const results = await landmarker.detectForVideo(video, performance.now());

        if (results.landmarks && results.landmarks.length > 0) {
          results.landmarks.forEach((landmarks) => {
            landmarks.forEach((pt) => {
              outCtx.beginPath();
              outCtx.arc(
                pt.x * outputRef.current.width,
                pt.y * outputRef.current.height,
                4,
                0,
                2 * Math.PI
              );
              outCtx.fillStyle = "#ef4444";
              outCtx.fill();
            });
          });

          if (Math.random() < 0.04) {
            const frame = canvasRef.current.toDataURL("image/jpeg");
            sendFrameToBackend(frame);
          }
        }

        if (onResults) onResults(results);
      } catch (err) {
        if (!String(err).includes("ROI width and height must be > 0")) {
          console.error("Detection error:", err);
        }
      }

      animationId = requestAnimationFrame(detectHands);
    }

    async function sendFrameToBackend(frameData) {
      try {
        const blob = await fetch(frameData).then((r) => r.blob());
        const formData = new FormData();
        formData.append("file", blob, "frame.jpg");

        const response = await axios.post("http://127.0.0.1:8000/api/predict", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const sign = response.data.prediction || "Unknown";
        setDetectedSign(sign);

        const ttsResponse = await axios.get(`http://127.0.0.1:8000/api/speak/${sign}`, {
          responseType: "arraybuffer",
        });
        const audioBlob = new Blob([ttsResponse.data], { type: "audio/mp3" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      } catch (err) {
        console.error("Prediction/TTS error:", err);
      }
    }

    init();
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [onResults]);

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <canvas
          ref={canvasRef}
          width="320"
          height="240"
          style={{ border: "2px solid #3b82f6", borderRadius: "8px" }}
        />
        <canvas
          ref={outputRef}
          width="320"
          height="240"
          style={{ border: "2px solid #10b981", borderRadius: "8px" }}
        />
      </div>

      <video
        ref={videoRef}
        width="640"
        height="480"
        autoPlay
        playsInline
        style={{ display: "none" }}
      />

      <div style={{ marginTop: "15px" }}>
        <h3>Detected Sign: {detectedSign}</h3>
        {audioUrl && (
          <audio controls autoPlay src={audioUrl}>
            Your browser does not support audio.
          </audio>
        )}
      </div>
    </div>
  );
};

export default HandTracker;
