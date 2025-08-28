// src/component/HandTracker.js
import React, { useRef, useEffect } from 'react';
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

const HandTracker = ({ onResults }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;

    // Initialize MediaPipe Hands
    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7
    });

    hands.onResults((results) => {
      // Draw results on canvas
      if (canvasRef.current && results.multiHandLandmarks) {
        const canvasCtx = canvasRef.current.getContext('2d');
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

        // Draw hand landmarks
        results.multiHandLandmarks.forEach((landmarks) => {
          for (let i = 0; i < landmarks.length; i++) {
            const x = landmarks[i].x * canvasRef.current.width;
            const y = landmarks[i].y * canvasRef.current.height;
            canvasCtx.beginPath();
            canvasCtx.arc(x, y, 5, 0, 2 * Math.PI);
            canvasCtx.fillStyle = 'red';
            canvasCtx.fill();
          }
        });
        canvasCtx.restore();
      }

      // Pass results up if needed
      if (onResults) onResults(results);
    });

    // Initialize camera
    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await hands.send({ image: videoRef.current });
      },
      width: 640,
      height: 480
    });
    camera.start();

    // Cleanup on unmount
    return () => {
      hands.close();
      camera.stop();
    };
  }, [onResults]);

  return (
    <div style={{ position: 'relative' }}>
      <video
        ref={videoRef}
        style={{ display: 'none' }}
        width="640"
        height="480"
      />
      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        style={{ border: '1px solid #ccc' }}
      />
    </div>
  );
};

export default HandTracker;
