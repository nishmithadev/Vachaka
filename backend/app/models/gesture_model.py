import numpy as np
import pickle
import os

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
import tensorflow as tf
from tensorflow import keras

LABELS = ['A','B','C','D','E','F','G','H','I','J','K','L','M',
          'N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
          'del','space']

MODEL_PATH = "ml/saved_models/gesture_model.h5"
ENCODER_PATH = "ml/saved_models/label_encoder.pkl"

model = None
le = None

def load_model():
    global model, le
    if os.path.exists(MODEL_PATH):
        model = keras.models.load_model(MODEL_PATH)
        with open(ENCODER_PATH, "rb") as f:
            le = pickle.load(f)
        print("✅ ASL Model loaded successfully")
    else:
        print("⚠️  No trained model found.")

def predict(landmarks: np.ndarray) -> str:
    if model is None:
        return "Model not loaded"
    pred = model.predict(landmarks.reshape(1, -1), verbose=0)
    index = np.argmax(pred)
    confidence = pred[0][index]
    if confidence < 0.7:
        return "?"
    return le.inverse_transform([index])[0]