from ibm_watson import TextToSpeechV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
import os

apikey = os.getenv("WATSON_TTS_API_KEY")
url = os.getenv("WATSON_TTS_URL")

authenticator = IAMAuthenticator(apikey)
tts = TextToSpeechV1(authenticator=authenticator)
tts.set_service_url(url)

def text_to_speech(text: str):
    return tts.synthesize(text, voice="en-US_AllisonV3Voice", accept="audio/mp3").get_result().content
