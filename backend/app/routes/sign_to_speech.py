from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse
from app.utils.mediapipe_utils import extract_landmarks
from app.utils.tts_utils import text_to_speech
from app.models.gesture_model import predict, load_model
import numpy as np
import cv2

router = APIRouter()
load_model()

# Common ASL words mapped to letter sequences
# These are detected as whole words when spelled fast
COMMON_WORDS = {
    "HELLO", "HELP", "YES", "NO", "PLEASE", "SORRY",
    "THANK", "YOU", "GOOD", "BAD", "STOP", "GO",
    "COME", "WANT", "NEED", "LOVE", "NAME", "WHAT",
    "WHERE", "WHEN", "WHY", "HOW", "WHO", "MORE",
    "FOOD", "WATER", "HOME", "WORK", "TIME", "MONEY"
}

@router.post("/predict")
async def predict_sign(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if frame is None:
            return JSONResponse(status_code=400, content={"error": "Invalid image"})

        landmarks = extract_landmarks(frame)

        if landmarks is None:
            return JSONResponse(content={
                "gesture": "No hand detected",
                "audio": None,
                "type": "none"
            })

        gesture = predict(landmarks)
        audio_path = text_to_speech(gesture) if gesture != "?" else None

        return {
            "gesture": gesture,
            "audio": audio_path,
            "type": "letter"
        }

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.post("/speak-word")
async def speak_word(data: dict):
    """Speak a complete word"""
    word = data.get("word", "").strip()
    if not word:
        return JSONResponse(status_code=400, content={"error": "No word provided"})
    audio_path = text_to_speech(word)
    return {"word": word, "audio": audio_path}


@router.post("/speak-sentence")
async def speak_sentence(data: dict):
    """Speak a complete sentence"""
    sentence = data.get("sentence", "").strip()
    if not sentence:
        return JSONResponse(status_code=400, content={"error": "No sentence provided"})
    audio_path = text_to_speech(sentence)
    return {"sentence": sentence, "audio": audio_path}