// src/services/api.js
const API_BASE = "http://127.0.0.1:8000"; // change to 5000/8000 as needed

// Text -> Speech (returns JSON { audio_url: "/tts_audio/xxx.mp3" } )
export async function apiTextToSpeech(text) {
  const form = new FormData();
  form.append("text", text);
  const res = await fetch(`${API_BASE}/api/text-to-speech`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(`TTS failed: ${res.status}`);
  return res.json();
}

// Speech -> Text (upload audio file)
export async function apiSpeechToText(file) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_BASE}/api/speech-to-text`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Speech->Text failed: ${res.status} ${txt}`);
  }
  return res.json();
}

// Sign -> Text (upload video file)
export async function apiSignToText(file) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_BASE}/api/sign-to-text`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Sign->Text failed: ${res.status} ${txt}`);
  }
  return res.json();
}
