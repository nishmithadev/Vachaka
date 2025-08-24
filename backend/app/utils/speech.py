import pyttsx3
import os

def convert_text_to_speech(text: str):
    engine = pyttsx3.init()
    audio_path = f"static/{text.replace(' ', '_')}.mp3"

    # Create "static" folder if not exists
    os.makedirs("static", exist_ok=True)

    engine.save_to_file(text, audio_path)
    engine.runAndWait()

    return audio_path
