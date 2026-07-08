import cv2
import mediapipe as mp
import numpy as np
import os

mp_hands = mp.solutions.hands.Hands(
    static_image_mode=True,
    max_num_hands=1,
    min_detection_confidence=0.5
)

DATASET_PATH = "dataset/asl_alphabet_train/asl_alphabet_train"
SAVE_PATH = "dataset/landmarks"
os.makedirs(SAVE_PATH, exist_ok=True)

labels = sorted(os.listdir(DATASET_PATH))
print(f"Found {len(labels)} classes: {labels}")

for label in labels:
    label_path = os.path.join(DATASET_PATH, label)
    if not os.path.isdir(label_path):
        continue

    landmarks_list = []
    images = os.listdir(label_path)
    print(f"Processing {label} ({len(images)} images)...")

    for img_file in images:
        img_path = os.path.join(label_path, img_file)
        frame = cv2.imread(img_path)
        if frame is None:
            continue

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = mp_hands.process(rgb)

        if results.multi_hand_landmarks:
            lm = results.multi_hand_landmarks[0]
            landmarks = np.array([[p.x, p.y, p.z] for p in lm.landmark]).flatten()
            landmarks_list.append(landmarks)

    if landmarks_list:
        save_file = os.path.join(SAVE_PATH, f"{label}.npy")
        np.save(save_file, np.array(landmarks_list))
        print(f"✅ {label}: saved {len(landmarks_list)} landmarks")
    else:
        print(f"⚠️  {label}: no hands detected, skipping")

print("\n🎉 Landmark extraction complete!")
print(f"Saved to: {SAVE_PATH}")