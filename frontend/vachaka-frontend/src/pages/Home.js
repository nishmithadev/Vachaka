import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1>Welcome to Vachaka</h1>
        <p>
          A smart platform that translates <strong>Sign Language</strong> into
          speech in real-time, bridging communication gaps.
        </p>
        <div className="hero-buttons">
          <Link to="/dashboard" className="btn primary">
            Try Dashboard
          </Link>
          <Link to="/translator" className="btn secondary">
            Go to Translator
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <h2>🤟 Real-Time Detection</h2>
          <p>Detect hand signs instantly with your webcam and AI models.</p>
        </div>
        <div className="feature-card">
          <h2>🔊 Speech Output</h2>
          <p>Convert detected signs into natural speech using TTS.</p>
        </div>
        <div className="feature-card">
          <h2>📊 Dashboard</h2>
          <p>View sign detection history and frequency charts in one place.</p>
        </div>
      </section>
    </div>
  );
}
