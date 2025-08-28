import React, { useRef, useEffect, useState } from "react";
import { Camera } from "@mediapipe/camera_utils";
import * as drawingUtils from "@mediapipe/drawing_utils";
import { apiSignToText, apiTextToSpeech } from "../api";
import { createHandsInstance } from "../utils/handsHelper";
import "../App.css";

export default function Translator() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [result, setResult] = useState("");

  useEffect(() => {
    const hands = createHandsInstance(async (results) => {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

      if (results.multiHandLandmarks?.length > 0) {
        for (const landmarks of results.multiHandLandmarks) {
          drawingUtils.drawConnectors(ctx, landmarks, Hands.HAND_CONNECTIONS, {
            color: "#00FF00",
            lineWidth: 2,
          });
          drawingUtils.drawLandmarks(ctx, landmarks, {
            color: "#FF0000",
            lineWidth: 1,
          });

          try {
            const response = await apiSignToText(landmarks);
            setResult(response.text);
            const audioUrl = await apiTextToSpeech(response.text);
            new Audio(audioUrl).play();
          } catch (err) {
            console.error("API Error:", err);
          }
        }
      }
    });

    if (videoRef.current) {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => await hands.send({ image: videoRef.current }),
        width: 640,
        height: 480,
      });
      camera.start();
    }
  }, []);

  return (
    <div className="translator-container">
      <video ref={videoRef} className="video-feed" autoPlay muted></video>
      <canvas ref={canvasRef} className="canvas-feed"></canvas>
      <div className="result-box">
        <h3>Detected Sign:</h3>
        <p>{result}</p>
      </div>
    </div>
  );
}
