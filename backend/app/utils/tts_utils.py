from gtts import gTTS
import os
import uuid

OUTPUT_DIR = "audio_output"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def text_to_speech(text: str) -> str:
    filename = f"{uuid.uuid4()}.mp3"
    filepath = os.path.join(OUTPUT_DIR, filename)
    tts = gTTS(text=text, lang='en')
    tts.save(filepath)
    return f"/audio/{filename}"