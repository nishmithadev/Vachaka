import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TranslatePage from "./pages/TranslatePage";
import Dashboard from "./component/Dashboard";
import Sidebar from "./component/Sidebar";
import "./styles/global.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/translate" element={<TranslatePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
