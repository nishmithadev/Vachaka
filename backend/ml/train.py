import numpy as np
import tensorflow as tf
from tensorflow import keras
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import os, pickle

LABELS = ['A','B','C','D','E','F','G','H','I','J','K','L','M',
          'N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
          'del','space']

DATASET_PATH = "dataset/landmarks/"
SAVE_PATH = "saved_models/gesture_model.h5"

def load_dataset():
    X, y = [], []
    for label in LABELS:
        file = os.path.join(DATASET_PATH, f"{label}.npy")
        if os.path.exists(file):
            data = np.load(file)
            X.extend(data)
            y.extend([label] * len(data))
            print(f"✅ {label}: {len(data)} samples")
        else:
            print(f"⚠️  Missing: {label}")
    return np.array(X), np.array(y)

def train():
    print("📦 Loading dataset...")
    X, y = load_dataset()

    if len(X) == 0:
        print("❌ No data found!")
        return

    print(f"\nTotal samples: {len(X)}")

    le = LabelEncoder()
    y_enc = le.fit_transform(y)

    os.makedirs("saved_models", exist_ok=True)
    with open("saved_models/label_encoder.pkl", "wb") as f:
        pickle.dump(le, f)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y_enc, test_size=0.2, random_state=42
    )

    model = keras.Sequential([
        keras.layers.Dense(256, activation='relu', input_shape=(63,)),
        keras.layers.Dropout(0.3),
        keras.layers.Dense(128, activation='relu'),
        keras.layers.Dropout(0.2),
        keras.layers.Dense(64, activation='relu'),
        keras.layers.Dense(len(LABELS), activation='softmax')
    ])

    model.compile(
        optimizer='adam',
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )

    print("\n🧠 Training...")
    model.fit(
        X_train, y_train,
        epochs=50,
        batch_size=32,
        validation_data=(X_test, y_test),
        verbose=1
    )

    loss, acc = model.evaluate(X_test, y_test, verbose=0)
    print(f"\n✅ Test Accuracy: {acc * 100:.2f}%")

    model.save(SAVE_PATH)
    print(f"💾 Model saved to {SAVE_PATH}")

if __name__ == "__main__":
    train()