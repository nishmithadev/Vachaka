import React, { useState, useEffect } from 'react';
import './History.css';

function History() {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('all'); // all, today, week, month
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const saved = localStorage.getItem('vachaka_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  };

  const deleteItem = (id) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('vachaka_history', JSON.stringify(updated));
  };

  const clearAll = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      setHistory([]);
      localStorage.removeItem('vachaka_history');
    }
  };

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const exportHistory = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vachaka-history-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const filterByDate = (item) => {
    const itemDate = new Date(item.timestamp);
    const now = new Date();
    const dayMs = 24 * 60 * 60 * 1000;

    switch (filter) {
      case 'today':
        return now - itemDate < dayMs;
      case 'week':
        return now - itemDate < 7 * dayMs;
      case 'month':
        return now - itemDate < 30 * dayMs;
      default:
        return true;
    }
  };

  const filterBySearch = (item) => {
    if (!searchTerm) return true;
    return item.text.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const filteredHistory = history
    .filter(filterByDate)
    .filter(filterBySearch);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="history-page">
      <div className="card">
        <div className="history-header">
          <div>
            <h2>📜 Translation History</h2>
            <p>View and manage your saved translations</p>
          </div>
          <div className="header-actions">
            {history.length > 0 && (
              <>
                <button className="btn btn-secondary" onClick={exportHistory}>
                  📥 Export
                </button>
                <button className="btn btn-danger" onClick={clearAll}>
                  🗑️ Clear All
                </button>
              </>
            )}
          </div>
        </div>

        <div className="history-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search translations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${filter === 'today' ? 'active' : ''}`}
              onClick={() => setFilter('today')}
            >
              Today
            </button>
            <button
              className={`filter-btn ${filter === 'week' ? 'active' : ''}`}
              onClick={() => setFilter('week')}
            >
              This Week
            </button>
            <button
              className={`filter-btn ${filter === 'month' ? 'active' : ''}`}
              onClick={() => setFilter('month')}
            >
              This Month
            </button>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No translations found</h3>
            <p>
              {history.length === 0
                ? 'Start translating signs and save them to build your history'
                : 'No translations match your current filters'}
            </p>
          </div>
        ) : (
          <>
            <div className="history-stats">
              <div className="stat-box">
                <span className="stat-number">{history.length}</span>
                <span className="stat-label">Total Translations</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">{filteredHistory.length}</span>
                <span className="stat-label">Showing</span>
              </div>
            </div>

            <div className="history-list">
              {filteredHistory.map((item) => (
                <div key={item.id} className="history-item">
                  <div className="item-content">
                    <div className="item-text">{item.text}</div>
                    <div className="item-meta">{formatDate(item.timestamp)}</div>
                  </div>
                  <div className="item-actions">
                    <button
                      className="action-btn"
                      onClick={() => speakText(item.text)}
                      title="Speak"
                    >
                      🔊
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => copyToClipboard(item.text)}
                      title="Copy"
                    >
                      📋
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => deleteItem(item.id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="card info-card">
        <h3>ℹ️ About History</h3>
        <ul>
          <li>Your translation history is stored locally on your device</li>
          <li>Only the last 50 translations are kept</li>
          <li>Export your history to save it permanently</li>
          <li>Clear history anytime to free up space</li>
        </ul>
      </div>
    </div>
  );
}

export default History;
