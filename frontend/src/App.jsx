import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SignToSpeech from "./pages/SignToSpeech";
import SpeechToSign from "./pages/SpeechToSign";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-950 text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-to-speech" element={<SignToSpeech />} />
          <Route path="/speech-to-sign" element={<SpeechToSign />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;