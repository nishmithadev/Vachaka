import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as ort from 'onnxruntime-web';
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { HAND_CONNECTIONS } from '@mediapipe/hands';
import './Translator.css';

function Translator() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const sessionRef = useRef(null);
  const classNamesRef = useRef([]);
  const lastSignRef = useRef('');
  const lastSignTimeRef = useRef(0);

  const [isActive, setIsActive] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [currentSign, setCurrentSign] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [translatedText, setTranslatedText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [handDetected, setHandDetected] = useState(false);
  const [backgroundMode, setBackgroundMode] = useState('normal'); // 'normal' or 'black'

  useEffect(() => {
    loadModel();
  }, []);

  const loadModel = async () => {
    try {
      setModelLoading(true);
      
      // Load class names
      const classRes = await fetch('/model/class_names.json');
      const classMap = await classRes.json();
      classNamesRef.current = Object.values(classMap);

      // Load ONNX model
      const session = await ort.InferenceSession.create('/model/model.onnx');
      sessionRef.current = session;

      setModelLoaded(true);
      console.log('✅ ONNX Model loaded! Classes:', classNamesRef.current);
    } catch (err) {
      console.error('❌ Model load failed:', err);
    } finally {
      setModelLoading(false);
    }
  };

  const onResults = useCallback(async (results) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply background mode
    if (backgroundMode === 'black') {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
    }

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      setHandDetected(true);
      
      for (const landmarks of results.multiHandLandmarks) {
        drawConnectors(ctx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 2 });
        drawLandmarks(ctx, landmarks, { color: '#FF0000', lineWidth: 1, radius: 4 });
      }
      
      if (sessionRef.current) await predictSign(canvas);
    } else {
      setHandDetected(false);
    }
    ctx.restore();
  }, [backgroundMode]);

  useEffect(() => {
    if (!isActive) return;

    let hands = null;
    let camera = null;
    let isCleanedUp = false;

    const initMediaPipe = async () => {
      hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      hands.setOptions({
        maxNumHands: 2,  // Detect both hands
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.5
      });

      hands.onResults(onResults);

      if (videoRef.current) {
        camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (!isCleanedUp && hands) {
              try {
                await hands.send({ image: videoRef.current });
              } catch (err) {
                // Ignore errors during cleanup
              }
            }
          },
          width: 640,
          height: 480
        });

        await camera.start();
      }
    };

    initMediaPipe();

    return () => {
      isCleanedUp = true;
      if (camera) {
        camera.stop();
      }
      if (hands) {
        hands.close();
      }
    };
  }, [isActive, onResults]);

  const predictSign = async (canvas) => {
    try {
      console.log("🔍 Running prediction...");
      
      // Resize canvas to 128x128 (matching the new model)
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 128;
      tempCanvas.height = 128;
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.drawImage(canvas, 0, 0, 128, 128);
      const imageData = tempCtx.getImageData(0, 0, 128, 128);
      
      console.log("✅ Image resized to 128x128");
      
      // Convert to float32 array and normalize [0, 255] -> [0, 1]
      const pixels = new Float32Array(128 * 128 * 3);
      for (let i = 0; i < 128 * 128; i++) {
        pixels[i * 3] = imageData.data[i * 4] / 255.0;       // R
        pixels[i * 3 + 1] = imageData.data[i * 4 + 1] / 255.0; // G
        pixels[i * 3 + 2] = imageData.data[i * 4 + 2] / 255.0; // B
      }

      console.log("✅ Pixels normalized");

      // Create tensor with shape [1, 128, 128, 3]
      const tensor = new ort.Tensor('float32', pixels, [1, 128, 128, 3]);
      
      console.log("✅ Tensor created:", tensor.dims);
      
      // Get the actual input name from the session
      const inputName = sessionRef.current.inputNames[0];
      console.log("📥 Input name:", inputName);
      
      const feeds = { [inputName]: tensor };
      
      const results = await sessionRef.current.run(feeds);
      console.log("✅ Inference complete");
      
      // Get predictions from output
      const outputName = sessionRef.current.outputNames[0];
      const output = results[outputName];
      const probs = Array.from(output.data);
      
      const maxIdx = probs.indexOf(Math.max(...probs));
      const maxConf = probs[maxIdx];
      const sign = classNamesRef.current[maxIdx];

      console.log(`🎯 Detected: ${sign} (${(maxConf * 100).toFixed(1)}%) - Threshold: 60%`);

      if (maxConf > 0.1) {
        setCurrentSign(sign);
        setConfidence(maxConf);
        
        const now = Date.now();
        if (sign !== lastSignRef.current) {
          lastSignRef.current = sign;
          lastSignTimeRef.current = now;
          setTranslatedText(prev => {
            if (!prev) return sign;
            return sign.length === 1 && prev[prev.length - 1] !== ' '
              ? prev + sign
              : prev + ' ' + sign;
          });
        }
      } else {
        console.log(`⚠️ Confidence too low: ${(maxConf * 100).toFixed(1)}%`);
      }
    } catch (err) {
      console.error('❌ Prediction error:', err);
    }
  };

  const speakText = () => {
    if (!translatedText || isSpeaking) return;
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = 'en-IN';
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const saveToHistory = () => {
    if (!translatedText.trim()) return;
    const history = JSON.parse(localStorage.getItem('vachaka_history') || '[]');
    history.unshift({ text: translatedText.trim(), timestamp: new Date().toISOString(), id: Date.now() });
    localStorage.setItem('vachaka_history', JSON.stringify(history.slice(0, 50)));
    alert('Saved to history!');
  };

  return (
    <div className="translator">
      <div className={`model-status ${modelLoaded ? 'loaded' : modelLoading ? 'loading' : 'missing'}`}>
        {modelLoading && '⏳ Loading ONNX model...'}
        {modelLoaded && '✅ ONNX Model Ready - 128x128 with GPU training'}
        {!modelLoaded && !modelLoading && <>⚠️ Model not found</>}
      </div>

      <div className="card">
        <h2>🤟 Real-Time ISL Translator</h2>

        <div className="video-container">
          <video ref={videoRef} autoPlay playsInline style={{ display: 'none' }} />
          <canvas ref={canvasRef} width="640" height="480" className="output-canvas"
            style={{ display: isActive ? 'block' : 'none' }} />
          {!isActive && (
            <div className="video-placeholder">
              <p>📷 Click "Start Camera" to begin</p>
            </div>
          )}
          {isActive && (
            <div className={`detection-badge ${handDetected ? 'detected' : 'waiting'}`}>
              {handDetected ? '✋ Hand Detected' : '👁️ Waiting for hand...'}
            </div>
          )}
        </div>

        <div className="controls">
          <button className={`btn ${isActive ? 'btn-danger' : 'btn-primary'}`}
            onClick={() => setIsActive(!isActive)}>
            {isActive ? '⏹ Stop Camera' : '▶ Start Camera'}
          </button>
          
          {isActive && (
            <div className="background-controls">
              <span style={{ marginRight: '10px', fontWeight: '500' }}>Background:</span>
              <button 
                className={`btn btn-secondary ${backgroundMode === 'normal' ? 'active' : ''}`}
                onClick={() => setBackgroundMode('normal')}
              >
                📷 Normal
              </button>
              <button 
                className={`btn btn-secondary ${backgroundMode === 'black' ? 'active' : ''}`}
                onClick={() => setBackgroundMode('black')}
              >
                ⬛ Black
              </button>
            </div>
          )}
        </div>

        {currentSign && (
          <div className="current-sign">
            <span className="sign-label">Detected:</span>
            <span className="sign-text">{currentSign}</span>
            <div className="confidence-bar">
              <div className="confidence-fill" style={{ width: `${confidence * 100}%` }} />
              <span className="confidence-text">{Math.round(confidence * 100)}%</span>
            </div>
          </div>
        )}

        <div className="translation-output">
          <h3>Translation:</h3>
          <div className="translation-text">
            {translatedText || 'Start signing to see translation...'}
          </div>
          {isActive && (
            <div className="letter-controls">
              <button className="btn btn-secondary" onClick={() => setTranslatedText(p => p + ' ')}>⎵ Space</button>
              <button className="btn btn-secondary" onClick={() => setTranslatedText(p => p.slice(0, -1))}>⌫ Delete</button>
              <button className="btn btn-secondary" onClick={() => { setTranslatedText(''); setCurrentSign(''); }}>🗑️ Clear</button>
            </div>
          )}
          {translatedText && (
            <div className="output-controls">
              <button className="btn btn-primary" onClick={speakText} disabled={isSpeaking}>
                {isSpeaking ? '🔊 Speaking...' : '🔊 Speak'}
              </button>
              <button className="btn btn-secondary" onClick={saveToHistory}>💾 Save</button>
            </div>
          )}
        </div>
      </div>

      <div className="card help-section">
        <h3>How to Use</h3>
        <ol>
          <li>Click "Start Camera" and allow camera access</li>
          <li>Hold your hand(s) clearly in view</li>
          <li>Make ISL signs - letters appear in real-time</li>
          <li>Use Space to separate words, Delete to fix mistakes</li>
          <li>Click Speak to hear your sentence</li>
        </ol>
      </div>
    </div>
  );
}

export default Translator;