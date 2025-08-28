import React from "react";

/*
 Dashboard shows 3 cards:
 - Text → Speech
 - Speech → Text
 - Sign → Speech
 Each card calls onOpen(mode) when clicked.
*/
export default function Dashboard({ onOpen }) {
  return (
    <section className="dashboard">
      <h2 className="section-title">Quick Actions</h2>
      <p className="section-sub">Choose a task to get started</p>

      <div className="cards">
        <div className="card" onClick={() => onOpen("textToSpeech")}>
          <div className="card-icon">🔊</div>
          <div className="card-title">Text → Speech</div>
          <div className="card-desc">Type text and convert it to natural audio.</div>
          <button className="card-cta">Open</button>
        </div>

        <div className="card" onClick={() => onOpen("speechToText")}>
          <div className="card-icon">🎤</div>
          <div className="card-title">Speech → Text</div>
          <div className="card-desc">Upload or record audio and get a transcript.</div>
          <button className="card-cta">Open</button>
        </div>

        <div className="card" onClick={() => onOpen("signToSpeech")}>
          <div className="card-icon">🤟</div>
          <div className="card-title">Sign → Speech</div>
          <div className="card-desc">Upload sign video or use camera to speak via gestures.</div>
          <button className="card-cta">Open</button>
        </div>
      </div>
    </section>
  );
}
