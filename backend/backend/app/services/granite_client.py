import os
import requests
from dotenv import load_dotenv

load_dotenv()

WATSONX_API_KEY = os.getenv("WATSONX_API_KEY")
WATSONX_URL = os.getenv("WATSONX_URL")
WATSONX_PROJECT_ID = os.getenv("WATSONX_PROJECT_ID")
WATSONX_MODEL_ID = os.getenv("WATSONX_MODEL_ID")

def generate_response(prompt: str) -> str:
    headers = {
        "Authorization": f"Bearer {WATSONX_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model_id": WATSONX_MODEL_ID,
        "input": prompt,
        "project_id": WATSONX_PROJECT_ID,
        "parameters": {"decoding_method": "greedy", "max_new_tokens": 100}
    }
    response = requests.post(f"{WATSONX_URL}/ml/v1/text/generation?version=2023-05-29",
                             headers=headers, json=payload)
    if response.status_code == 200:
        return response.json()["results"][0]["generated_text"]
    return f"Error: {response.text}"
