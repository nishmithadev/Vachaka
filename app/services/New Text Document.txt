from gtts import gTTS
import os
import uuid

def text_to_speech(text: str, lang: str = "en") -> str:
    """
    Convert text to speech using gTTS.
    Returns the path of the saved mp3 file.
    """
    # Create unique filename
    filename = f"tts_{uuid.uuid4().hex}.mp3"
    filepath = os.path.join("app", "static", filename)

    # Ensure static folder exists
    os.makedirs(os.path.dirname(filepath), exist_ok=True)

    # Generate audio
    tts = gTTS(text=text, lang=lang)
    tts.save(filepath)

    return filepath
