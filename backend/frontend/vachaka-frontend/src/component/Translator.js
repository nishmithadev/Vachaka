import React, { useState } from "react";
import { translateText, textToSpeech, speechToText } from "../services/api";

const card = { background:"#fff", borderRadius:12, padding:18, boxShadow:"0 4px 18px rgba(0,0,0,.06)" };

export default function Translator() {
  const [input, setInput] = useState("");
  const [lang, setLang] = useState("en");
  const [translated, setTranslated] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [sttFile, setSttFile] = useState(null);
  const [transcript, setTranscript] = useState("");

  async function doTranslate() {
    setTranslated("…");
    try {
      const { translated_text } = await translateText(input, lang);
      setTranslated(translated_text || "");
    } catch (e) {
      setTranslated(`Error: ${e.message}`);
    }
  }

  async function doTTS() {
    if (!translated && !input) return;
    const text = translated || input;
    setAudioUrl("");
    try {
      const { audio_file } = await textToSpeech(text);
      // backend serves /tts_audio – build full URL for <audio> src
      const base = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";
      setAudioUrl(`${base}/${audio_file}`);
    } catch (e) {
      alert("TTS error: " + e.message);
    }
  }

  async function doSTT() {
    if (!sttFile) return alert("Choose an MP3/WAV file first.");
    setTranscript("…");
    try {
      const { transcript } = await speechToText(sttFile);
      setTranscript(transcript || "");
    } catch (e) {
      setTranscript(`Error: ${e.message}`);
    }
  }

  return (
    <div style={{ display:"grid", gap:18 }}>
      <div style={card}>
        <h2>Translate with WatsonX Granite</h2>
        <textarea
          value={input}
          onChange={e=>setInput(e.target.value)}
          placeholder="Enter text to translate…"
          rows={5}
          style={{ width:"100%", padding:12, borderRadius:8, border:"1px solid #e5e7eb" }}
        />
        <div style={{ marginTop:10, display:"flex", gap:10, alignItems:"center" }}>
          <label>Target language code:</label>
          <input value={lang} onChange={e=>setLang(e.target.value)} style={{ padding:8, borderRadius:8, border:"1px solid #e5e7eb", width:120 }} />
          <button onClick={doTranslate} style={btn}>Translate</button>
        </div>
        <div style={{ marginTop:12 }}>
          <strong>Translated:</strong>
          <div style={{ marginTop:6, background:"#f1f5f9", padding:12, borderRadius:8, minHeight:48 }}>{translated}</div>
        </div>
        <div style={{ marginTop:12, display:"flex", gap:10 }}>
          <button onClick={doTTS} style={btn}>Generate Speech (TTS)</button>
          {audioUrl && (
            <audio controls src={audioUrl} style={{ alignSelf:"center" }}>
              Your browser does not support audio.
            </audio>
          )}
        </div>
      </div>

      <div style={card}>
        <h2>Speech to Text (upload)</h2>
        <p style={{ marginTop:0, color:"#475569" }}>
          Upload an audio file (<b>.mp3</b> recommended). The backend forwards it to IBM Watson STT.
        </p>
        <input type="file" accept=".mp3,.wav,.m4a" onChange={e=>setSttFile(e.target.files?.[0] || null)} />
        <button onClick={doSTT} style={{ ...btn, marginLeft:10 }}>Transcribe</button>
        <div style={{ marginTop:12 }}>
          <strong>Transcript:</strong>
          <div style={{ marginTop:6, background:"#f1f5f9", padding:12, borderRadius:8, minHeight:48 }}>{transcript}</div>
        </div>
      </div>
    </div>
  );
}

const btn = {
  background:"#2563eb",
  color:"#fff",
  border:"none",
  borderRadius:8,
  padding:"10px 14px",
  cursor:"pointer"
};
