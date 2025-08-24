// frontend/src/services/api.js
const BASE = "http://127.0.0.1:8000";

// Text → Speech: returns an object URL (blob) that frontend can play instantly
export async function apiTextToSpeech(text) {
  const form = new FormData();
  form.append("text", text);

  const res = await fetch(`${BASE}/api/text-to-speech`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`TTS failed: ${res.status} ${body}`);
  }

  const blob = await res.blob(); // audio/mpeg
  return URL.createObjectURL(blob);
}

// Sign → Text (file upload)
export async function apiSignToText(file) {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${BASE}/api/sign-to-text`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const body = await res.text().catch(()=> "");
    throw new Error(`Sign→Text failed: ${res.status} ${body}`);
  }
  return res.json();
}

// Speech → Text (file upload)
export async function apiSpeechToText(file) {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${BASE}/api/speech-to-text`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const body = await res.text().catch(()=> "");
    throw new Error(`Speech→Text failed: ${res.status} ${body}`);
  }
  return res.json();
}
