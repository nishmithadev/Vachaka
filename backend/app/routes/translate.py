from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse, JSONResponse
<<<<<<< Updated upstream
from app.services.gesture_model import predict_sign
from app.utils.speech import save_audio
=======
>>>>>>> Stashed changes
from gtts import gTTS
import uuid
<<<<<<< Updated upstream
import os

# Try to import two possible TTS clients (some branches used watson, others used tts_client).
# We import them with different names and fall back gracefully if one is missing.
try:
    from app.services.watson_client import text_to_speech as watson_text_to_speech
except Exception:
    watson_text_to_speech = None

try:
    from app.services.tts_client import text_to_speech as custom_text_to_speech
except Exception:
    custom_text_to_speech = None

router = APIRouter(prefix="/api", tags=["Translate"])
=======
import soundfile as sf
import numpy as np
from vosk import Model, KaldiRecognizer
import json
>>>>>>> Stashed changes


# ----------------------------
# Vosk model setup
# ----------------------------
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
vosk_model_path = os.path.join(BASE_DIR, "models", "vosk-model")

if not os.path.isdir(vosk_model_path):
    raise RuntimeError(f"❌ Vosk model not found at {vosk_model_path}")

vosk_model = Model(vosk_model_path)


# 🟢 Text → Speech (gTTS)
@router.post("/text-to-speech")
async def text_to_speech(text: str = Form(...)):
    try:
        filename = f"tts_{uuid.uuid4().hex}.mp3"
        out_path = os.path.join(BASE_DIR, "tts_audio", filename)
        os.makedirs(os.path.dirname(out_path), exist_ok=True)

        tts = gTTS(text=text, lang="en")
        tts.save(out_path)

        return FileResponse(out_path, media_type="audio/mpeg", filename=filename)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


# 🔵 Speech → Text (Vosk)
@router.post("/speech-to-text")
async def speech_to_text(file: UploadFile = File(...)):
    try:
        if not file.filename.endswith(".wav"):
            raise HTTPException(status_code=415, detail="Please upload a WAV file")

        temp_file = f"upload_{uuid.uuid4().hex}.wav"
        with open(temp_file, "wb") as f:
            f.write(await file.read())

        # Read audio as int16
        data, samplerate = sf.read(temp_file, dtype="int16")

        rec = KaldiRecognizer(vosk_model, samplerate)
        rec.SetWords(True)

        raw = np.array(data, dtype="int16").tobytes()
        chunk_size = 4000 * 2  # 4000 samples * 2 bytes
        for i in range(0, len(raw), chunk_size):
            rec.AcceptWaveform(raw[i:i + chunk_size])

        result = json.loads(rec.FinalResult())

        os.remove(temp_file)
        return {"transcribed_text": result.get("text", "")}
    except HTTPException:
        raise
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
<<<<<<< Updated upstream


@router.post("/sign-to-text")
async def sign_to_text(file: UploadFile = File(...)):
    text = predict_sign(file.file)
    return {"text": text}


@router.post("/sign-to-speech")
async def sign_to_speech(file: UploadFile = File(...)):
    """
    Convert sign (video/frame) to text using predict_sign, then produce audio
    using whichever TTS client is available (Watson preferred, then custom tts_client).
    The produced audio is saved via save_audio and the path returned.
    """
    try:
        text = predict_sign(file.file)

        # Prefer watson_text_to_speech if available, else try custom_text_to_speech.
        audio_bytes = None
        if watson_text_to_speech is not None:
            audio_bytes = watson_text_to_speech(text)
        elif custom_text_to_speech is not None:
            audio_bytes = custom_text_to_speech(text)
        else:
            # Fallback to gTTS and save to a temp file (returns path instead of bytes)
            filename = f"tts_{uuid.uuid4().hex}.mp3"
            tts = gTTS(text=text, lang="en")
            tts.save(filename)
            return {"text": text, "audio": filename}

        # If the TTS client returns raw audio bytes, save via save_audio; otherwise adapt.
        if isinstance(audio_bytes, (bytes, bytearray)):
            audio_path = save_audio(audio_bytes)
        elif isinstance(audio_bytes, str) and os.path.exists(audio_bytes):
            # If client returned a file path
            audio_path = audio_bytes
        else:
            # Last resort: write bytes if possible, else return the raw value
            try:
                audio_path = save_audio(audio_bytes)
            except Exception:
                audio_path = audio_bytes

        return {"text": text, "audio": audio_path}
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
=======
>>>>>>> Stashed changes
