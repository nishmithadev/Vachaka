import os
from datetime import datetime

OUTPUT_DIR = "static/tts"

os.makedirs(OUTPUT_DIR, exist_ok=True)

def save_audio(audio_bytes):
    filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}.mp3"
    path = os.path.join(OUTPUT_DIR, filename)
    with open(path, "wb") as f:
        f.write(audio_bytes)
    return f"/static/tts/{filename}"
