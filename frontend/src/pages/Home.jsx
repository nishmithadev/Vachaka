import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] text-center px-4">
      <div className="mb-6 text-7xl">🤟</div>
      <h1 className="text-5xl font-extrabold mb-4 text-white">
        Welcome to <span className="text-indigo-400">Vachaka</span>
      </h1>
      <p className="text-gray-400 text-xl mb-12 max-w-2xl leading-relaxed">
        Bridging the gap between sign language and speech — in real time.
        Empowering communication for the deaf and hard-of-hearing community.
      </p>

      <div className="flex flex-col sm:flex-row gap-6">
        <Link to="/sign-to-speech"
          className="px-10 py-5 bg-indigo-600 rounded-2xl text-lg font-bold hover:bg-indigo-700 transition shadow-lg">
          🤟 Sign → Speech
          <p className="text-sm font-normal text-indigo-200 mt-1">Use your camera</p>
        </Link>
        <Link to="/speech-to-sign"
          className="px-10 py-5 bg-green-600 rounded-2xl text-lg font-bold hover:bg-green-700 transition shadow-lg">
          🎙️ Speech → Sign
          <p className="text-sm font-normal text-green-200 mt-1">Use your microphone</p>
        </Link>
      </div>

      <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl">
        {[
          { icon: "⚡", title: "Real-Time", desc: "Instant gesture detection using MediaPipe" },
          { icon: "🧠", title: "AI Powered", desc: "TensorFlow model trained on ASL gestures" },
          { icon: "🌐", title: "Accessible", desc: "Designed for inclusive communication" },
        ].map((f) => (
          <div key={f.title} className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <div className="text-4xl mb-3">{f.icon}</div>
            <h3 className="text-lg font-bold mb-2">{f.title}</h3>
            <p className="text-gray-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}