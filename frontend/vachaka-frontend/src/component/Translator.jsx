import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Box,
  Alert,
} from "@mui/material";
import { apiTextToSpeech } from "../services/api";

const Translator = () => {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const audioRef = useRef(null);

  // cleanup object URLs on unmount / when audioUrl changes
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text!");
      return;
    }

    setLoading(true);
    setError("");
    setTranslatedText("");
    // revoke previous blob URL if any
    if (audioUrl) {
      try { URL.revokeObjectURL(audioUrl); } catch {}
      setAudioUrl("");
    }

    try {
      // get object URL for audio blob
      const objUrl = await apiTextToSpeech(inputText);
      setTranslatedText(inputText);
      setAudioUrl(objUrl);

      // attach to audio element and attempt immediate play
      if (audioRef.current) {
        audioRef.current.src = objUrl;
        const playPromise = audioRef.current.play();
        if (playPromise && typeof playPromise.then === "function") {
          playPromise.catch((err) => {
            // Autoplay blocked — user can use Play button
            console.warn("Autoplay blocked", err);
            // don't set error, show player
          });
        }
      } else {
        // fallback: new Audio
        const a = new Audio(objUrl);
        a.play().catch((err) => console.warn("Autoplay blocked (fallback)", err));
      }
    } catch (err) {
      console.error("TTS error", err);
      setError("Failed to generate speech. See console for details.");
      setTranslatedText("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Card sx={{ p: 3, boxShadow: 5, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            🧏‍♀️ Sign to Speech Translator
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <TextField
            fullWidth
            label="Enter text to translate"
            variant="outlined"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            sx={{ mt: 2 }}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            onClick={handleTranslate}
            disabled={loading}
          >
            {loading ? "Processing..." : "Translate"}
          </Button>

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <CircularProgress />
            </Box>
          )}

          {translatedText && (
            <Typography variant="h6" align="center" sx={{ mt: 3, color: "#333" }}>
              {translatedText}
            </Typography>
          )}

          {audioUrl && (
            <Box sx={{ mt: 3, textAlign: "center" }}>
              {/* visible player to allow replay and manual play */}
              <audio id="tts-audio" ref={audioRef} controls src={audioUrl} />
              <Box sx={{ mt: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    const el = document.getElementById("tts-audio");
                    if (el) el.play().catch((e) => console.warn("play fail", e));
                  }}
                >
                  ▶ Play
                </Button>
                <Button
                  variant="text"
                  sx={{ ml: 2 }}
                  onClick={() => {
                    // revoke and clear
                    try { URL.revokeObjectURL(audioUrl); } catch {}
                    setAudioUrl("");
                  }}
                >
                  ✖ Clear
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default Translator;
