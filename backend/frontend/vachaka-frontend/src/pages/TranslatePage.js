import React, { useEffect, useRef } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { createHandsInstance } from "../utils/handsHelper";
import "./TranslatePage.css";

export default function TranslatePage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const hands = createHandsInstance((results) => {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);
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
    <div className="translate-container">
      <h1 className="translate-title">Live Sign Detection</h1>
      <video ref={videoRef} className="video-feed" autoPlay playsInline></video>
      <canvas ref={canvasRef} className="output-canvas"></canvas>
    </div>
  );
}
