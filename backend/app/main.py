from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routes import sign_to_speech, speech_to_sign
import os

app = FastAPI(title="Vachaka API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("audio_output", exist_ok=True)
app.mount("/audio", StaticFiles(directory="audio_output"), name="audio")

app.include_router(sign_to_speech.router, prefix="/api/sign-to-speech", tags=["Sign to Speech"])
app.include_router(speech_to_sign.router, prefix="/api/speech-to-sign", tags=["Speech to Sign"])

@app.get("/")
def root():
    return {"message": "Vachaka API is running 🤟"}