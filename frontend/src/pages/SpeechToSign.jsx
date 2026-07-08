import { useState } from "react";
import axios from "axios";

export default function SpeechToSign() {
  const [text, setText] = useState("");
  const [signs, setSigns] = useState([]);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const [coverage, setCoverage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("❌ Speech recognition not supported. Please use Chrome.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    setListening(true);
    setError("");
    setSigns([]);
    setText("");
    setCoverage("");
    setCurrentIndex(0);

    recognition.onresult = async (e) => {
      const spoken = e.results[0][0].transcript;
      setText(spoken);
      setListening(false);
      try {
        const res = await axios.get(
          `http://localhost:8000/api/speech-to-sign/convert?text=${encodeURIComponent(spoken)}`
        );
        setSigns(res.data.signs);
        setCoverage(res.data.coverage);
      } catch {
        setError("❌ Backend error. Make sure the server is running.");
      }
    };

    recognition.onerror = () => {
      setError("❌ Microphone error. Please allow mic access.");
      setListening(false);
    };

    recognition.start();
  };

  // Auto-play through signs one by one
  const playSequence = () => {
    if (signs.length === 0) return;
    setIsPlaying(true);
    setCurrentIndex(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i >= signs.length) {
        clearInterval(interval);
        setIsPlaying(false);
        setCurrentIndex(0);
      } else {
        setCurrentIndex(i);
      }
    }, 1500); // show each sign for 1.5s
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 max-w-4xl mx-auto">

      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-green-400">Speech → Sign</h2>
        <p className="text-gray-400 mt-2">
          Speak a word or sentence — see it in ASL sign language
        </p>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-300 px-6 py-3 rounded-xl w-full text-center">
          {error}
        </div>
      )}

      {/* Speak Button */}
      <button
        onClick={startListening}
        disabled={listening}
        className={`px-14 py-6 rounded-full text-2xl font-bold transition shadow-lg ${
          listening
            ? "bg-red-600 animate-pulse shadow-red-900"
            : "bg-green-600 hover:bg-green-700 shadow-green-900"
        }`}>
        {listening ? "🎙️ Listening..." : "🎙️ Speak Now"}
      </button>

      {/* What you said */}
      {text && (
        <div className="bg-gray-800 border border-green-700 rounded-2xl px-10 py-4 text-center w-full max-w-lg">
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">You said</p>
          <p className="text-2xl font-bold text-white">"{text}"</p>
          {coverage && (
            <p className="text-green-400 text-sm mt-1">✅ {coverage}</p>
          )}
        </div>
      )}

      {/* Playback controls */}
      {signs.length > 0 && (
        <button
          onClick={playSequence}
          disabled={isPlaying}
          className="px-8 py-3 bg-indigo-600 rounded-xl font-bold text-lg hover:bg-indigo-700 disabled:opacity-40 transition">
          {isPlaying ? "▶ Playing..." : "▶ Play Sequence"}
        </button>
      )}

      {/* Signs Display */}
      {signs.length > 0 && (
        <div className="w-full">
          <p className="text-center text-gray-400 text-sm mb-4">
            {isPlaying ? `Showing sign ${currentIndex + 1} of ${signs.length}` : "All signs:"}
          </p>

          {/* Full sequence display */}
          <div className="flex gap-4 flex-wrap justify-center">
            {signs.map((s, i) => (
              <div
                key={i}
                className={`flex flex-col items-center rounded-2xl p-3 w-36 border transition-all duration-300 ${
                  isPlaying && i === currentIndex
                    ? "bg-indigo-900 border-indigo-400 scale-110 shadow-lg shadow-indigo-900"
                    : "bg-gray-800 border-gray-700"
                }`}>
                {s.sign_url ? (
                  <img
                    src={s.sign_url}
                    alt={s.word}
                    className="w-24 h-24 object-contain rounded-lg"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className="w-24 h-24 bg-gray-700 rounded-lg items-center justify-center text-center p-2"
                  style={{ display: s.sign_url ? "none" : "flex" }}>
                  <span className="text-gray-400 text-xs">No sign available</span>
                </div>
                <p className="mt-2 text-sm font-bold text-white uppercase">{s.word}</p>
                <span className={`text-xs mt-1 ${
                  s.type === "word" ? "text-green-400" : "text-yellow-400"
                }`}>
                  {s.type === "word" ? "word" : "letter"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}