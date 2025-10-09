const BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";

export async function translateText(text, target_lang) {
  const form = new FormData();
  form.append("text", text);
  form.append("target_lang", target_lang || "en");

  const res = await fetch(`${BASE}/translate`, { method: "POST", body: form });
  if (!res.ok) throw new Error("Translate failed");
  return res.json(); // { translated_text }
}

export async function textToSpeech(text) {
  const form = new FormData();
  form.append("text", text);

  const res = await fetch(`${BASE}/tts`, { method: "POST", body: form });
  if (!res.ok) throw new Error("TTS failed");
  return res.json(); // { audio_file: "tts_audio/output.mp3" }
}

export async function speechToText(file) {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${BASE}/stt`, { method: "POST", body: form });
  if (!res.ok) throw new Error("STT failed");
  return res.json(); // { transcript }
}
