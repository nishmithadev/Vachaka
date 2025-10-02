import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./component/Header";
import Home from "./pages/Home";
import Dashboard from "./component/Dashboard";
import Translator from "./component/Translator";
import Demo from "./pages/Demo";
import "./styles.css";
import TestHands from "./component/TestHands"; // 👈 test component

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navbar always visible */}
        <Header />

        {/* Define routes for each page */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/translator" element={<Translator />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/test-hands" element={<TestHands />} /> {/* 👈 NEW route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
