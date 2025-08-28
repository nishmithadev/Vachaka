import React, { useState } from "react";
import Header from "./component/Header";
import Footer from "./component/Footer";
import Dashboard from "./component/Dashboard";
import Translator from "./component/Translator";
import "./App.css";

/*
  Simple view switcher: Dashboard <-> Translator.
  You can later swap this for react-router if you want real routes.
*/
export default function App() {
  const [view, setView] = useState("dashboard"); // "dashboard" | "translator"

  const openTranslator = (mode) => {
    // mode can be "textToSpeech" | "speechToText" | "signToSpeech"
    setView({ name: "translator", mode });
  };

  const backToDashboard = () => setView("dashboard");

  return (
    <div className="app">
      <Header onHome={backToDashboard} />
      <main className="main">
        {view === "dashboard" && <Dashboard onOpen={openTranslator} />}
        {typeof view === "object" && view.name === "translator" && (
          <Translator mode={view.mode} onBack={backToDashboard} />
        )}
      </main>
      <Footer />
    </div>
  );
}
