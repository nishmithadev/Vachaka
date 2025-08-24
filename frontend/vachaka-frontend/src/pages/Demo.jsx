import React, { useState } from "react";
import {
  apiTextToSpeech,
  apiSpeechToText,
  apiSignToText,
} from "../services/api";

const Demo = () => {
  const [text, setText] = useState("");
  const [audio, setAudio] = useState(null);
  const [speechText, setSpeechText] = useState("");
  const [signText, setSignText] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle Text → Speech
  const handleTextToSpeech = async () => {
    if (!text.trim()) return alert("Please enter some text!");
    try {
      setLoading(true);
      const audioBlob = await apiTextToSpeech(text);
      const url = URL.createObjectURL(audioBlob);
      setAudio(url);
    } catch (error) {
      alert("Error converting text to speech!");
    } finally {
      setLoading(false);
    }
  };

  // Handle Speech → Text
  const handleSpeechToText = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const result = await apiSpeechToText(file);
      setSpeechText(result.text || "Could not recognize speech");
    } catch (error) {
      alert("Error converting speech to text!");
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign → Text
  const handleSignToText = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const result = await apiSignToText(file);
      setSignText(result.text || "Could not recognize sign language");
    } catch (error) {
      alert("Error converting sign to text!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="demo-container" style={{ padding: "20px" }}>
      <h1>Vachaka Translator</h1>

      {/* Text to Speech */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Text → Speech</h3>
        <textarea
          rows="3"
          cols="50"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text here"
        />
        <br />
        <button onClick={handleTextToSpeech} disabled={loading}>
          Convert to Speech
        </button>
        {audio && (
          <div>
            <h4>Generated Speech:</h4>
            <audio controls src={audio}></audio>
          </div>
        )}
      </div>

      {/* Speech to Text */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Speech → Text</h3>
        <input type="file" accept="audio/*" onChange={handleSpeechToText} />
        {speechText && (
          <div>
            <h4>Recognized Speech:</h4>
            <p>{speechText}</p>
          </div>
        )}
      </div>

      {/* Sign to Text */}
      <div>
        <h3>Sign → Text</h3>
        <input type="file" accept="image/*" onChange={handleSignToText} />
        {signText && (
          <div>
            <h4>Recognized Sign:</h4>
            <p>{signText}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Demo;
