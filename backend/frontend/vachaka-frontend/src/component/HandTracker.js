// src/component/HandTracker.js
import React, { useEffect, useRef } from "react";
import { createHandsInstance } from "../utils/handsHelper";
import { Camera } from "@mediapipe/camera_utils";

const HandTracker = ({ onResults }) => {
  const videoRef = useRef(null);
  const handsRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;

    // ✅ Create a hands instance
    const hands = createHandsInstance(onResults);
    handsRef.current = hands;

    // ✅ Setup camera
    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await hands.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });
    cameraRef.current = camera;

    camera.start();

    return () => {
      // Cleanup when unmounting
      if (cameraRef.current) cameraRef.current.stop();
      if (handsRef.current) handsRef.current.close();
    };
  }, [onResults]);

  return (
    <div className="hand-tracker">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ display: "none" }} // hide raw video if you just want canvas output
      />
      <canvas
        id="output-canvas"
        width="640"
        height="480"
        style={{ border: "1px solid black" }}
      ></canvas>
    </div>
  );
};

export default HandTracker;
