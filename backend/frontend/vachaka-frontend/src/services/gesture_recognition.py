import cv2
import pickle
import numpy as np

# Load trained model
model = pickle.load(open("models/gesture_model.pkl", "rb"))

def predict_gesture(frame):
    resized = cv2.resize(frame, (64, 64))  # Adjust size to match training input
    gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)
    flattened = gray.flatten().reshape(1, -1)
    prediction = model.predict(flattened)
    return prediction[0]
