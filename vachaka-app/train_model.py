"""
Vachaka - ISL Model Training Script
=====================================
Step 1: Trains CNN and saves Keras model  → run: python train_model.py
Step 2: Convert to TF.js                 → run: python convert_model.py

Requirements:
    pip install tensorflow matplotlib scikit-learn pillow
"""

import os
import json
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# ─────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────
DATASET_PATH    = "./isl_dataset"
MODEL_SAVE_PATH = "./isl_model"
IMG_SIZE        = 128  # Increased from 64 to capture both hands better
BATCH_SIZE      = 32
EPOCHS          = 30
LEARNING_RATE   = 0.001

# ─────────────────────────────────────────────
# STEP 1: LOAD DATASET
# ─────────────────────────────────────────────
print("\n📂 Loading dataset...")

images = []
labels = []
class_names = sorted([
    d for d in os.listdir(DATASET_PATH)
    if os.path.isdir(os.path.join(DATASET_PATH, d))
])

print(f"Found {len(class_names)} classes: {class_names}")

for label_idx, class_name in enumerate(class_names):
    class_path = os.path.join(DATASET_PATH, class_name)
    count = 0
    for img_file in os.listdir(class_path):
        img_path = os.path.join(class_path, img_file)
        try:
            img = tf.keras.preprocessing.image.load_img(
                img_path, target_size=(IMG_SIZE, IMG_SIZE), color_mode='rgb'
            )
            img_array = tf.keras.preprocessing.image.img_to_array(img)
            images.append(img_array)
            labels.append(label_idx)
            count += 1
        except Exception as e:
            pass
    print(f"  ✅ {class_name}: {count} images")

images = np.array(images, dtype='float32') / 255.0
labels = np.array(labels)
print(f"\n✅ Total: {len(images)} images across {len(class_names)} classes")

# ─────────────────────────────────────────────
# STEP 2: SPLIT DATA
# ─────────────────────────────────────────────
print("\n✂️  Splitting data...")
X_train, X_test, y_train, y_test = train_test_split(
    images, labels, test_size=0.2, random_state=42, stratify=labels
)
X_train, X_val, y_train, y_val = train_test_split(
    X_train, y_train, test_size=0.1, random_state=42, stratify=y_train
)
print(f"  Train: {len(X_train)} | Val: {len(X_val)} | Test: {len(X_test)}")

# ─────────────────────────────────────────────
# STEP 3: DATA AUGMENTATION
# ─────────────────────────────────────────────
datagen = ImageDataGenerator(
    rotation_range=15,
    width_shift_range=0.1,
    height_shift_range=0.1,
    zoom_range=0.1,
    horizontal_flip=False,  # sign language is directional!
    fill_mode='nearest'
)
datagen.fit(X_train)

# ─────────────────────────────────────────────
# STEP 4: BUILD MODEL
# ─────────────────────────────────────────────
print("\n🧠 Building model...")
NUM_CLASSES = len(class_names)

model = keras.Sequential([
    layers.Conv2D(32, (3,3), activation='relu', padding='same', input_shape=(IMG_SIZE, IMG_SIZE, 3)),
    layers.BatchNormalization(),
    layers.Conv2D(32, (3,3), activation='relu', padding='same'),
    layers.MaxPooling2D((2,2)),
    layers.Dropout(0.25),

    layers.Conv2D(64, (3,3), activation='relu', padding='same'),
    layers.BatchNormalization(),
    layers.Conv2D(64, (3,3), activation='relu', padding='same'),
    layers.MaxPooling2D((2,2)),
    layers.Dropout(0.25),

    layers.Conv2D(128, (3,3), activation='relu', padding='same'),
    layers.BatchNormalization(),
    layers.Conv2D(128, (3,3), activation='relu', padding='same'),
    layers.MaxPooling2D((2,2)),
    layers.Dropout(0.4),

    layers.Flatten(),
    layers.Dense(256, activation='relu'),
    layers.BatchNormalization(),
    layers.Dropout(0.5),
    layers.Dense(NUM_CLASSES, activation='softmax')
])

model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=LEARNING_RATE),
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)
model.summary()

# ─────────────────────────────────────────────
# STEP 5: TRAIN
# ─────────────────────────────────────────────
print("\n🚀 Training... (this will take 15-20 minutes)")

os.makedirs(MODEL_SAVE_PATH, exist_ok=True)

callbacks = [
    keras.callbacks.EarlyStopping(monitor='val_accuracy', patience=5, restore_best_weights=True, verbose=1),
    keras.callbacks.ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=3, verbose=1),
    keras.callbacks.ModelCheckpoint(
        filepath=os.path.join(MODEL_SAVE_PATH, 'best_model.keras'),
        monitor='val_accuracy', save_best_only=True, verbose=1
    )
]

history = model.fit(
    datagen.flow(X_train, y_train, batch_size=BATCH_SIZE),
    validation_data=(X_val, y_val),
    epochs=EPOCHS,
    callbacks=callbacks,
    verbose=1
)

# ─────────────────────────────────────────────
# STEP 6: EVALUATE
# ─────────────────────────────────────────────
print("\n📊 Evaluating...")
test_loss, test_acc = model.evaluate(X_test, y_test, verbose=0)
print(f"  ✅ Test Accuracy : {test_acc * 100:.2f}%")
print(f"  ✅ Test Loss     : {test_loss:.4f}")

y_pred = np.argmax(model.predict(X_test), axis=1)
print(classification_report(y_test, y_pred, target_names=class_names))

# ─────────────────────────────────────────────
# STEP 7: SAVE PLOTS
# ─────────────────────────────────────────────
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
ax1.plot(history.history['accuracy'], label='Train')
ax1.plot(history.history['val_accuracy'], label='Val')
ax1.set_title('Accuracy'); ax1.legend(); ax1.grid(True)
ax2.plot(history.history['loss'], label='Train')
ax2.plot(history.history['val_loss'], label='Val')
ax2.set_title('Loss'); ax2.legend(); ax2.grid(True)
plt.tight_layout()
plt.savefig(os.path.join(MODEL_SAVE_PATH, 'training_history.png'))
print(f"\n📈 Plot saved to {MODEL_SAVE_PATH}/training_history.png")

# ─────────────────────────────────────────────
# STEP 8: SAVE CLASS NAMES
# ─────────────────────────────────────────────
class_map = {str(i): name for i, name in enumerate(class_names)}
with open(os.path.join(MODEL_SAVE_PATH, 'class_names.json'), 'w') as f:
    json.dump(class_map, f, indent=2)
print(f"✅ Class names saved to {MODEL_SAVE_PATH}/class_names.json")

# ─────────────────────────────────────────────
# STEP 9: SAVE KERAS MODEL (for conversion)
# ─────────────────────────────────────────────
model.save(os.path.join(MODEL_SAVE_PATH, 'isl_model.keras'))
print(f"✅ Keras model saved to {MODEL_SAVE_PATH}/isl_model.keras")

print("""
════════════════════════════════════════
🎉 Training complete!

Next step → convert to TensorFlow.js:
    python convert_model.py

Then copy public/model/ into your React app.
════════════════════════════════════════
""")