import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Translator from './components/Translator';
import LearningMode from './components/LearningMode';
import PracticeMode from './components/PracticeMode';
import History from './components/History';
import SignGuide from './components/SignGuide';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav className="navbar">
            <div className="nav-brand">
              <h1>🤟 Vachaka</h1>
              <p className="tagline">Your Voice, Your Signs</p>
            </div>
            <ul className="nav-links">
              <li><Link to="/">Translator</Link></li>
              <li><Link to="/guide">Sign Guide</Link></li>
              <li><Link to="/learn">Learn</Link></li>
              <li><Link to="/practice">Practice</Link></li>
              <li><Link to="/history">History</Link></li>
            </ul>
          </nav>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Translator />} />
            <Route path="/guide" element={<SignGuide />} />
            <Route path="/learn" element={<LearningMode />} />
            <Route path="/practice" element={<PracticeMode />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>

        <footer className="App-footer">
          <p>Empowering communication for all 💙</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;