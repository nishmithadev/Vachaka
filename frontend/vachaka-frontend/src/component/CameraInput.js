import React, { useEffect, useRef } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { createHandsInstance } from "../utils/handsHelper";
import "./CameraInput.css";

function CameraInput() {
  const videoRef = useRef(null);

  useEffect(() => {
    const hands = createHandsInstance(() => {});

    if (videoRef.current) {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => await hands.send({ image: videoRef.current }),
        width: 640,
        height: 480,
      });
      camera.start();
    }
  }, []);

  return <video ref={videoRef} className="camera-feed" autoPlay muted playsInline />;
}

export default CameraInput;
