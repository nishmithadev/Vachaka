from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import FileResponse, JSONResponse
from app.services.gesture_model import predict_sign
from app.services.tts_client import text_to_speech as custom_tts
from app.utils.speech import save_audio
from gtts import gTTS
import os
import uuid

router = APIRouter(prefix="/translate", tags=["translate"])

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

