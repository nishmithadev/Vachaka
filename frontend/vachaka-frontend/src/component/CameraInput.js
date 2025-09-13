import React, { useRef, useEffect, useState } from "react";
import axios from "axios";

const CameraInput = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [detectedSign, setDetectedSign] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [lastSpoken, setLastSpoken] = useState("");

  useEffect(() => {
    startCamera();
    const interval = setInterval(captureFrame, 1200); // Detect every 1.2 seconds
    return () => clearInterval(interval);
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  const captureFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("file", blob, "frame.jpg");

      try {
        const response = await axios.post("http://127.0.0.1:8000/detect-sign/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const sign = response.data.sign;
        if (sign && sign !== detectedSign) {
          setDetectedSign(sign);

          // Speak only if it's a new sign
          if (sign !== lastSpoken) {
            setLastSpoken(sign);

            const ttsResponse = await axios.get(`http://127.0.0.1:8000/speak/${sign}`, {
              responseType: "arraybuffer",
            });

            const audioBlob = new Blob([ttsResponse.data], { type: "audio/mp3" });
            const url = URL.createObjectURL(audioBlob);
            setAudioUrl(url);
          }
        }
      } catch (error) {
        console.error("Sign detection error:", error);
      }
    }, "image/jpeg");
  };

  return (
    <div>
      <h2>Live Real-Time Sign Detection</h2>
      <video ref={videoRef} autoPlay width="400" height="300" />
      <canvas ref={canvasRef} width="224" height="224" style={{ display: "none" }} />
      <h3>Detected Sign: {detectedSign}</h3>
      {audioUrl && <audio src={audioUrl} autoPlay />}
    </div>
  );
};

export default CameraInput;
