import cv2
import mediapipe as mp
import numpy as np

mp_hands = mp.solutions.hands
hands = mp_hands.Hands()
mp_draw = mp.solutions.drawing_utils

def predict_sign(file_stream):
    # Load image
    file_bytes = np.asarray(bytearray(file_stream.read()), dtype=np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    # Detect hands
    result = hands.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))

    if result.multi_hand_landmarks:
        return "Hello"   # placeholder (train with Kaggle dataset later)
    return "No sign detected"
