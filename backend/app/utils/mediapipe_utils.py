import mediapipe as mp
import numpy as np
import cv2

mp_hands = mp.solutions.hands

hands_detector = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    min_detection_confidence=0.6,
    min_tracking_confidence=0.6
)

def extract_landmarks(frame):
    # Resize frame to speed up processing
    small = cv2.resize(frame, (320, 240))
    rgb = cv2.cvtColor(small, cv2.COLOR_BGR2RGB)
    rgb.flags.writeable = False
    results = hands_detector.process(rgb)
    rgb.flags.writeable = True

    if results.multi_hand_landmarks:
        lm = results.multi_hand_landmarks[0]
        landmarks = np.array([[p.x, p.y, p.z] for p in lm.landmark]).flatten()
        return landmarks
    return None