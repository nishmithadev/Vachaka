import React, { useRef, useEffect } from 'react';
import { Camera } from '@mediapipe/camera_utils';
import { createHandsInstance } from '../utils/handsHelper';

const HandTracker = ({ onResults }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const hands = createHandsInstance((results) => {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

      results.multiHandLandmarks?.forEach((landmarks) => {
        landmarks.forEach((pt) => {
          const x = pt.x * canvasRef.current.width;
          const y = pt.y * canvasRef.current.height;
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = 'red';
          ctx.fill();
        });
      });

      if (onResults) onResults(results);
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => await hands.send({ image: videoRef.current }),
      width: 640,
      height: 480,
    });
    camera.start();

    return () => {
      hands.close();
      camera.stop();
    };
  }, [onResults]);

  return (
    <div style={{ position: 'relative' }}>
      <video ref={videoRef} style={{ display: 'none' }} width="640" height="480" />
      <canvas ref={canvasRef} width="640" height="480" style={{ border: '1px solid #ccc' }} />
    </div>
  );
};

export default HandTracker;
