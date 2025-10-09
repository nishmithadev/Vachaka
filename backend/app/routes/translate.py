from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import FileResponse, JSONResponse
from app.services.gesture_model import predict_sign
from app.utils.speech import save_audio
from gtts import gTTS
import uuid
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


# 🟢 Text → Speech (gTTS version)
@router.post("/text-to-speech")
async def text_to_speech(text: str = Form(...)):
    try:
        filename = f"tts_{uuid.uuid4().hex}.mp3"
        tts = gTTS(text=text, lang="en")
        tts.save(filename)
        return FileResponse(filename, media_type="audio/mpeg", filename=filename)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


# 🔵 Speech → Text (placeholder — later we can integrate a free STT engine like Vosk/Whisper)
@router.post("/speech-to-text")
async def speech_to_text(file: UploadFile = File(...)):
    try:
        # Save uploaded file temporarily
        temp_file = f"upload_{uuid.uuid4().hex}.wav"
        with open(temp_file, "wb") as f:
            f.write(await file.read())

        # Placeholder response
        text = f"Received audio file: {file.filename}, saved as {temp_file}"

        return {"transcribed_text": text}
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


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
