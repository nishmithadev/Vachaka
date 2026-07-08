import { useRef, useState, useEffect, useCallback } from "react";
import axios from "axios";

const QUICK_WORDS = [
  "HELLO", "HELP", "YES", "NO", "PLEASE", "SORRY",
  "THANK YOU", "GOOD", "STOP", "COME", "GO", "WANT",
  "NEED", "LOVE", "WHAT", "WHERE", "MORE", "FOOD", "WATER"
];

export default function SignToSpeech() {
  const videoRef = useRef(null);
  const [currentLetter, setCurrentLetter] = useState("");
  const [word, setWord] = useState("");
  const [sentence, setSentence] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");
  const [camReady, setCamReady] = useState(false);
  const [status, setStatus] = useState("Press Start to begin");
  const [mode, setMode] = useState("letter");
  const [fps, setFps] = useState(0);

  const letterBuffer = useRef([]);
  const lastAccepted = useRef("");
  const intervalRef = useRef(null);
  const frameCount = useRef(0);
  const lastFpsTime = useRef(Date.now());

  // ── Camera Setup ──
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({
      video: {
        width: 640,
        height: 480,
        facingMode: "user"
      }
    })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            setCamReady(true);
          };
        }
      })
      .catch((err) => {
        console.error(err);
        setError("❌ Camera access denied. Please allow camera permissions.");
      });
  }, []);

  // ── Frame Capture & Prediction ──
  const captureFrame = useCallback(async () => {
    if (!videoRef.current || !videoRef.current.videoWidth) return;

    // FPS counter
    frameCount.current++;
    const now = Date.now();
    if (now - lastFpsTime.current >= 1000) {
      setFps(frameCount.current);
      frameCount.current = 0;
      lastFpsTime.current = now;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 240;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0, 320, 240);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        const formData = new FormData();
        formData.append("file", blob, "frame.jpg");
        const res = await axios.post(
          "http://localhost:8000/api/sign-to-speech/predict", formData
        );
        const detected = res.data.gesture;

        if (detected === "No hand detected" || detected === "?") {
          setStatus("👋 Show your hand...");
          letterBuffer.current = [];
          setCurrentLetter("");
          return;
        }

        setCurrentLetter(detected);

        // Space sign = confirm current word
        if (detected === "space") {
          if (word.length > 0) {
            setSentence(prev => [...prev, word]);
            setWord("");
            lastAccepted.current = "";
            letterBuffer.current = [];
            setStatus("✅ Word added to sentence!");
          }
          return;
        }

        // Del sign = delete last letter
        if (detected === "del") {
          setWord(prev => prev.slice(0, -1));
          lastAccepted.current = "";
          letterBuffer.current = [];
          setStatus("⌫ Deleted last letter");
          return;
        }

        // Buffer: confirm same letter 3 times before accepting
        letterBuffer.current.push(detected);
        if (letterBuffer.current.length > 3) letterBuffer.current.shift();

        const allSame = letterBuffer.current.every(l => l === detected);
        const isNew = detected !== lastAccepted.current;

        if (allSame && isNew && letterBuffer.current.length === 3) {
          lastAccepted.current = detected;
          setWord(prev => prev + detected);
          setStatus(`✅ Letter "${detected}" added`);
          if (res.data.audio) {
            new Audio(`http://localhost:8000${res.data.audio}`).play();
          }
        } else {
          const count = letterBuffer.current.filter(l => l === detected).length;
          setStatus(`🔍 "${detected}" — confirming ${count}/3...`);
        }

      } catch {
        setError("❌ Backend connection failed. Is the server running?");
      }
    }, "image/jpeg", 0.7);
  }, [word]);

  // ── Start / Stop Detection ──
  const toggleDetection = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
      setStatus("Paused.");
    } else {
      setIsRunning(true);
      setError("");
      setStatus("🔍 Detecting...");
      intervalRef.current = setInterval(captureFrame, 600);
    }
  };

  // ── Word & Sentence Controls ──
  const addWordToSentence = () => {
    if (!word) return;
    setSentence(prev => [...prev, word]);
    setWord("");
    lastAccepted.current = "";
    letterBuffer.current = [];
    setStatus("✅ Word added!");
  };

  const speakSentence = async () => {
    const fullText = [...sentence, word].join(" ").trim();
    if (!fullText) return;
    try {
      const res = await axios.post(
        "http://localhost:8000/api/sign-to-speech/speak-sentence",
        { sentence: fullText }
      );
      new Audio(`http://localhost:8000${res.data.audio}`).play();
    } catch {
      const utterance = new SpeechSynthesisUtterance(fullText);
      window.speechSynthesis.speak(utterance);
    }
  };

  const speakQuickWord = async (w) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/sign-to-speech/speak-word",
        { word: w }
      );
      new Audio(`http://localhost:8000${res.data.audio}`).play();
      setSentence(prev => [...prev, w]);
    } catch {
      const utterance = new SpeechSynthesisUtterance(w);
      window.speechSynthesis.speak(utterance);
      setSentence(prev => [...prev, w]);
    }
  };

  const clearAll = () => {
    setWord("");
    setSentence([]);
    setCurrentLetter("");
    lastAccepted.current = "";
    letterBuffer.current = [];
    setStatus("Cleared! Press Start to begin.");
  };

  // ── Cleanup ──
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  // ── Update interval when captureFrame changes ──
  useEffect(() => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(captureFrame, 600);
    }
  }, [captureFrame, isRunning]);

  const fullSentence = [...sentence, word].join(" ").trim();

  return (
    <div className="flex flex-col items-center gap-5 p-6 max-w-4xl mx-auto">

      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-indigo-400">Sign → Speech</h2>
        <p className="text-gray-400 mt-1">Spell letters with ASL to build words and sentences</p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-300 px-6 py-3 rounded-xl w-full text-center">
          {error}
        </div>
      )}

      {/* Mode Switch */}
      <div className="flex gap-2 bg-gray-900 p-1 rounded-xl border border-gray-700">
        <button onClick={() => setMode("letter")}
          className={`px-6 py-2 rounded-lg font-bold transition ${
            mode === "letter"
              ? "bg-indigo-600 text-white"
              : "text-gray-400 hover:text-white"
          }`}>
          ✋ Letter Mode
        </button>
        <button onClick={() => setMode("quick")}
          className={`px-6 py-2 rounded-lg font-bold transition ${
            mode === "quick"
              ? "bg-green-600 text-white"
              : "text-gray-400 hover:text-white"
          }`}>
          ⚡ Quick Words
        </button>
      </div>

      {mode === "letter" ? (
        <>
          {/* Guide */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-xs text-gray-400 flex gap-4 flex-wrap justify-center">
            <span>✋ Hold sign steady 3x = letter added</span>
            <span>🤚 space sign = confirm word</span>
            <span>👊 del sign = delete letter</span>
          </div>

          {/* Camera Feed */}
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`rounded-2xl border-4 shadow-2xl ${
                isRunning
                  ? "border-green-500 shadow-green-900"
                  : "border-indigo-600 shadow-indigo-900"
              }`}
              style={{ width: "480px", height: "360px", objectFit: "cover" }}
            />

            {/* LIVE badge */}
            {isRunning && (
              <div className="absolute top-3 right-3 flex items-center gap-2 bg-green-600 px-3 py-1 rounded-full text-xs font-bold">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                LIVE • {fps}fps
              </div>
            )}

            {/* Current letter overlay */}
            {currentLetter && isRunning && (
              <div className="absolute bottom-3 left-3 bg-black bg-opacity-80 px-4 py-2 rounded-xl">
                <span className="text-5xl font-extrabold text-yellow-400">
                  {currentLetter}
                </span>
              </div>
            )}

            {/* Camera not ready overlay */}
            {!camReady && (
              <div className="absolute inset-0 bg-gray-900 rounded-2xl flex items-center justify-center">
                <p className="text-gray-400 animate-pulse">Starting camera...</p>
              </div>
            )}
          </div>

          {/* Status */}
          <p className="text-gray-400 text-sm min-h-5">{status}</p>

          {/* Controls */}
          <div className="flex gap-3 flex-wrap justify-center">
            <button
              onClick={toggleDetection}
              disabled={!camReady}
              className={`px-8 py-3 rounded-2xl text-lg font-bold transition ${
                isRunning
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              } disabled:opacity-40`}>
              {isRunning ? "⏹ Stop" : "▶ Start"}
            </button>

            <button
              onClick={() => setWord(prev => prev.slice(0, -1))}
              className="px-5 py-3 bg-yellow-600 rounded-2xl text-lg font-bold hover:bg-yellow-700 transition">
              ⌫
            </button>

            <button
              onClick={addWordToSentence}
              disabled={!word}
              className="px-6 py-3 bg-blue-600 rounded-2xl text-lg font-bold hover:bg-blue-700 disabled:opacity-40 transition">
              + Word
            </button>
          </div>

          {/* Current Word Display */}
          <div className="bg-gray-800 border border-indigo-700 rounded-2xl px-8 py-5 w-full max-w-lg text-center">
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">
              Current Word
            </p>
            <p className="text-5xl font-extrabold text-white tracking-widest min-h-14">
              {word || (
                <span className="text-gray-600 text-2xl">start signing...</span>
              )}
            </p>
          </div>
        </>
      ) : (
        /* ── Quick Words Mode ── */
        <div className="w-full max-w-2xl">
          <p className="text-center text-gray-400 mb-4">
            Tap a word to add it to your sentence and speak it
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {QUICK_WORDS.map((w) => (
              <button
                key={w}
                onClick={() => speakQuickWord(w)}
                className="px-5 py-3 bg-gray-800 border border-gray-600 rounded-xl font-bold text-white hover:bg-indigo-600 hover:border-indigo-500 transition text-lg">
                {w}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Sentence Builder ── */}
      <div className="bg-gray-900 border border-green-800 rounded-2xl px-6 py-4 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-3">
          <p className="text-gray-400 text-xs uppercase tracking-widest">
            Sentence
          </p>
          <div className="flex gap-2">
            <button
              onClick={speakSentence}
              disabled={!fullSentence}
              className="px-4 py-2 bg-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-700 disabled:opacity-40 transition">
              🔊 Speak All
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-gray-700 rounded-xl text-sm font-bold hover:bg-gray-600 transition">
              🗑 Clear
            </button>
          </div>
        </div>

        {fullSentence ? (
          <>
            <p className="text-xl font-bold text-green-300 mb-3">{fullSentence}</p>
            <div className="flex gap-2 flex-wrap">
              {sentence.map((w, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 bg-green-900 text-green-200 px-3 py-1 rounded-lg text-sm">
                  <span>{w}</span>
                  <button
                    onClick={() => setSentence(prev => prev.filter((_, j) => j !== i))}
                    className="text-green-400 hover:text-red-400 ml-1 font-bold">
                    ×
                  </button>
                </div>
              ))}
              {word && (
                <span className="bg-indigo-900 text-indigo-200 px-3 py-1 rounded-lg text-sm border border-indigo-500">
                  {word}
                </span>
              )}
            </div>
          </>
        ) : (
          <p className="text-gray-600 text-center py-2">
            Your sentence will appear here...
          </p>
        )}
      </div>

    </div>
  );
}