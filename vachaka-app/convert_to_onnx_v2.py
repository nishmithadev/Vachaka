"""
Vachaka - ONNX Conversion (SavedModel approach)
================================================
Converts Keras → SavedModel → ONNX to avoid version conflicts

Requirements:
    pip install tf2onnx onnx
"""

import os
import json
import shutil
import subprocess
import sys

print("🔄 Converting to ONNX via SavedModel...")

# Paths
KERAS_MODEL = "./isl_model/isl_model.keras"
SAVED_MODEL_DIR = "./isl_model/saved_model_temp"
ONNX_MODEL = "./public/model/model.onnx"
OUTPUT_DIR = "./public/model"

# Create output directory
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Step 1: Convert Keras to SavedModel
print("\n[1/3] Converting Keras → SavedModel...")
if os.path.exists(SAVED_MODEL_DIR):
    shutil.rmtree(SAVED_MODEL_DIR)

import tensorflow as tf
model = tf.keras.models.load_model(KERAS_MODEL)
model.save(SAVED_MODEL_DIR, save_format='tf')
print("✅ SavedModel created")

# Step 2: Convert SavedModel to ONNX using CLI
print("\n[2/3] Converting SavedModel → ONNX...")
result = subprocess.run([
    sys.executable, "-m", "tf2onnx.convert",
    "--saved-model", SAVED_MODEL_DIR,
    "--output", ONNX_MODEL,
    "--opset", "13"
], capture_output=True, text=True)

if result.returncode != 0:
    print("❌ Conversion failed:")
    print(result.stderr)
    sys.exit(1)

print(f"✅ ONNX model created: {ONNX_MODEL}")

# Step 3: Copy class names
print("\n[3/3] Copying class names...")
shutil.copy("./isl_model/class_names.json", os.path.join(OUTPUT_DIR, "class_names.json"))
print("✅ Class names copied")

# Step 4: Verify
print("\n✅ Verifying ONNX model...")
import onnx
onnx_model = onnx.load(ONNX_MODEL)
onnx.checker.check_model(onnx_model)
print("✅ Model is valid!")

# Cleanup
print("\n🧹 Cleaning up...")
shutil.rmtree(SAVED_MODEL_DIR)

# Get file size
size_mb = os.path.getsize(ONNX_MODEL) / (1024 * 1024)

print(f"""
════════════════════════════════════════
✅ CONVERSION COMPLETE!

Files in {OUTPUT_DIR}/:
  ✅ model.onnx       ({size_mb:.1f} MB)
  ✅ class_names.json (35 classes)

Next steps:
  1. npm install onnxruntime-web
  2. Replace Translator.js with Translator-ONNX.js
  3. npm start

ONNX > TensorFlow.js ✨
════════════════════════════════════════
""")
