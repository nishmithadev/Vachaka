# backend/main.py
import os
import uuid
from gtts import gTTS
from fastapi import FastAPI, Request, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="Vachaka API", version="1.0")

# CORS (adjust as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve generated audio files
AUDIO_DIR = "tts_audio"
os.makedirs(AUDIO_DIR, exist_ok=True)
app.mount("/tts_audio", StaticFiles(directory=AUDIO_DIR), name="tts_audio")


@app.get("/api/ping")
def ping():
    return {"ok": True, "message": "Vachaka backend is running 🚀"}


@app.post("/api/text-to-speech")
async def text_to_speech(request: Request, text: str | None = Form(default=None)):
    """
    Accepts either JSON: {"text": "..."} or form-data: text=...
    Saves MP3 using gTTS and returns a public URL.
    """
    try:
        # Try JSON first
        data_text = None
        try:
            payload = await request.json()
            data_text = (payload or {}).get("text")
        except Exception:
            pass

        # Fallback to form (if sent as FormData)
        if data_text is None:
            data_text = text

        if not data_text or not str(data_text).strip():
            return JSONResponse({"error": "Text is required"}, status_code=400)

        filename = f"{uuid.uuid4()}.mp3"
        filepath = os.path.join(AUDIO_DIR, filename)

        tts = gTTS(text=str(data_text), lang="en")
        tts.save(filepath)

        # return relative path; frontend will prefix with API base
        return {"audio_url": f"/tts_audio/{filename}"}
    except Exception as e:
        return JSONResponse({"error": f"{type(e).__name__}: {e}"}, status_code=500)
