import os
import io
import json
import numpy as np
import requests
from PIL import Image
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained model
MODEL_PATH = "models/gesture_model.h5"
model = load_model(MODEL_PATH)

# Example gesture classes (replace with your dataset labels)
class_labels = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]

@app.get("/")
def home():
    return {"message": "Vachaka Backend Running Successfully!"}

@app.post("/detect-sign/")
async def detect_sign(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img = img.resize((64, 64))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        prediction = model.predict(img_array)
        label_index = np.argmax(prediction)
        detected_sign = class_labels[label_index]

        return {"sign": detected_sign}
    except Exception as e:
        return {"error": str(e)}

@app.get("/speak/{text}")
def speak(text: str):
    try:
        url = f"{os.getenv('WATSON_TTS_URL')}/v1/synthesize"
        headers = {"Content-Type": "application/json"}
        auth = ("apikey", os.getenv("WATSON_TTS_API_KEY"))

        data = {
            "text": text,
            "voice": "en-US_AllisonV3Voice",
            "accept": "audio/mp3",
        }

        response = requests.post(url, headers=headers, auth=auth, data=json.dumps(data))
        if response.status_code == 200:
            return response.content
        else:
            return {"error": "TTS request failed"}
    except Exception as e:
        return {"error": str(e)}
