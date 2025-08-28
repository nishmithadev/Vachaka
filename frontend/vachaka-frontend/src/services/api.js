import axios from "axios";

const API_URL = "http://127.0.0.1:8000"; // Change if backend runs elsewhere

export const apiSignToText = async (imageData) => {
  try {
    const response = await axios.post(`${API_URL}/sign-to-text`, { image: imageData });
    return response.data;
  } catch (error) {
    console.error("Sign to Text API Error:", error);
    throw error;
  }
};

export const apiTextToSpeech = async (text) => {
  try {
    const response = await axios.post(`${API_URL}/text-to-speech`, { text });
    return response.data.audio_url;
  } catch (error) {
    console.error("Text-to-Speech API Error:", error);
    throw error;
  }
};
