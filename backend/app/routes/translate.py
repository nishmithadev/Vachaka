from fastapi import APIRouter, UploadFile, File
from app.services.gesture_model import predict_sign
from app.services.watson_client import text_to_speech
from app.utils.speech import save_audio

router = APIRouter(prefix="/api", tags=["Translate"])

@router.post("/sign-to-text")
async def sign_to_text(file: UploadFile = File(...)):
    text = predict_sign(file.file)
    return {"text": text}

@router.post("/sign-to-speech")
async def sign_to_speech(file: UploadFile = File(...)):
    text = predict_sign(file.file)
    audio_path = save_audio(text_to_speech(text))
    return {"text": text, "audio": audio_path}
