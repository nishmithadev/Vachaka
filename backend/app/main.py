from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from gtts import gTTS
import io
import speech_recognition as sr
from PIL import Image

app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with frontend URL if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Vachaka Translator Backend is running!"}


# ------------------- TEXT → SPEECH -------------------
@app.post("/text-to-speech/")
async def text_to_speech(text: str = Form(...)):
    try:
        # Convert text to speech
        tts = gTTS(text=text, lang="en")
        audio_bytes = io.BytesIO()
        tts.write_to_fp(audio_bytes)
        audio_bytes.seek(0)

        # Return audio as streaming response
        return StreamingResponse(audio_bytes, media_type="audio/mpeg")
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Text-to-speech failed: {str(e)}"},
        )


# ------------------- SPEECH → TEXT -------------------
@app.post("/speech-to-text/")
async def speech_to_text(file: UploadFile):
    try:
        recognizer = sr.Recognizer()
        with sr.AudioFile(file.file) as source:
            audio_data = recognizer.record(source)
            text = recognizer.recognize_google(audio_data)
        return {"text": text}
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Speech-to-text failed: {str(e)}"},
        )


# ------------------- SIGN → TEXT -------------------
@app.post("/sign-to-text/")
async def sign_to_text(file: UploadFile):
    try:
        # Placeholder for sign detection logic
        img = Image.open(file.file)
        # For now, just return a dummy response
        return {"text": "Sign language recognition not yet implemented"}
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Sign-to-text failed: {str(e)}"},
        )
