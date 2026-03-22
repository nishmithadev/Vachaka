import React, { useState } from 'react';
import './LearningMode.css';

// ISL Sign Library
const SIGN_LIBRARY = [
  {
    id: 1,
    sign: 'Hello',
    category: 'Greetings',
    description: 'Wave your hand with palm facing outward',
    difficulty: 'Easy',
    videoUrl: '/videos/hello.mp4', // You'll add actual videos
    imageUrl: '🤚',
    steps: [
      'Raise your dominant hand to shoulder height',
      'Keep your palm facing outward',
      'Wave your hand side to side 2-3 times'
    ]
  },
  {
    id: 2,
    sign: 'Thank You',
    category: 'Greetings',
    description: 'Touch fingers to chin and move hand forward',
    difficulty: 'Easy',
    imageUrl: '🙏',
    steps: [
      'Place fingertips of flat hand on chin',
      'Move hand forward and down',
      'End with palm facing up'
    ]
  },
  {
    id: 3,
    sign: 'Yes',
    category: 'Common',
    description: 'Make a fist and nod it up and down',
    difficulty: 'Easy',
    imageUrl: '👍',
    steps: [
      'Make a closed fist',
      'Move fist up and down like nodding',
      'Repeat 2-3 times'
    ]
  },
  {
    id: 4,
    sign: 'No',
    category: 'Common',
    description: 'Shake your index and middle finger side to side',
    difficulty: 'Easy',
    imageUrl: '👎',
    steps: [
      'Extend index and middle finger',
      'Keep other fingers closed',
      'Shake hand side to side'
    ]
  },
  {
    id: 5,
    sign: 'Help',
    category: 'Emergency',
    description: 'Place one hand on top of the other and raise both',
    difficulty: 'Easy',
    imageUrl: '🆘',
    steps: [
      'Make a fist with your dominant hand',
      'Place it on your open palm',
      'Raise both hands upward together'
    ]
  },
  {
    id: 6,
    sign: 'Please',
    category: 'Greetings',
    description: 'Place hand on chest and move in circular motion',
    difficulty: 'Medium',
    imageUrl: '🙏',
    steps: [
      'Place flat hand on your chest',
      'Move hand in a circular motion',
      'Keep palm against chest'
    ]
  },
  {
    id: 7,
    sign: 'Sorry',
    category: 'Emotions',
    description: 'Make a fist and rub on chest in circular motion',
    difficulty: 'Medium',
    imageUrl: '😔',
    steps: [
      'Make a fist with dominant hand',
      'Place on chest',
      'Rub in circular motion clockwise'
    ]
  },
  {
    id: 8,
    sign: 'Water',
    category: 'Needs',
    description: 'W-shape hand near mouth',
    difficulty: 'Medium',
    imageUrl: '💧',
    steps: [
      'Make W-shape with three fingers',
      'Tap fingers on chin/lips',
      'Repeat 2 times'
    ]
  },
  {
    id: 9,
    sign: 'Food',
    category: 'Needs',
    description: 'Bring fingertips to mouth repeatedly',
    difficulty: 'Easy',
    imageUrl: '🍽️',
    steps: [
      'Bunch all fingertips together',
      'Bring to mouth',
      'Repeat tapping motion 2-3 times'
    ]
  },
  {
    id: 10,
    sign: 'Love',
    category: 'Emotions',
    description: 'Cross arms over chest',
    difficulty: 'Easy',
    imageUrl: '❤️',
    steps: [
      'Cross both arms over chest',
      'Place hands on opposite shoulders',
      'Hold position briefly'
    ]
  }
];

const CATEGORIES = ['All', 'Greetings', 'Common', 'Emergency', 'Needs', 'Emotions'];

function LearningMode() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSign, setSelectedSign] = useState(null);
  const [learnedSigns, setLearnedSigns] = useState(() => {
    const saved = localStorage.getItem('vachaka_learned_signs');
    return saved ? JSON.parse(saved) : [];
  });

  const filteredSigns = selectedCategory === 'All'
    ? SIGN_LIBRARY
    : SIGN_LIBRARY.filter(sign => sign.category === selectedCategory);

  const toggleLearned = (signId) => {
    const newLearned = learnedSigns.includes(signId)
      ? learnedSigns.filter(id => id !== signId)
      : [...learnedSigns, signId];
    
    setLearnedSigns(newLearned);
    localStorage.setItem('vachaka_learned_signs', JSON.stringify(newLearned));
  };

  const progress = Math.round((learnedSigns.length / SIGN_LIBRARY.length) * 100);

  return (
    <div className="learning-mode">
      <div className="card">
        <h2>📚 Learn ISL Signs</h2>
        <p>Master Indian Sign Language one sign at a time</p>

        <div className="progress-section">
          <div className="progress-header">
            <span>Your Progress</span>
            <span className="progress-text">{learnedSigns.length}/{SIGN_LIBRARY.length} signs learned</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}>
              {progress > 10 && `${progress}%`}
            </div>
          </div>
        </div>
      </div>

      <div className="category-filter">
        {CATEGORIES.map(category => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="signs-grid">
        {filteredSigns.map(sign => (
          <div
            key={sign.id}
            className={`sign-card ${learnedSigns.includes(sign.id) ? 'learned' : ''}`}
            onClick={() => setSelectedSign(sign)}
          >
            <div className="sign-icon">{sign.imageUrl}</div>
            <h3>{sign.sign}</h3>
            <p className="sign-description">{sign.description}</p>
            <div className="sign-meta">
              <span className={`difficulty ${sign.difficulty.toLowerCase()}`}>
                {sign.difficulty}
              </span>
              <button
                className="mark-learned-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLearned(sign.id);
                }}
              >
                {learnedSigns.includes(sign.id) ? '✓ Learned' : 'Mark as Learned'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedSign && (
        <div className="modal-overlay" onClick={() => setSelectedSign(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedSign(null)}>×</button>
            
            <div className="modal-header">
              <span className="modal-icon">{selectedSign.imageUrl}</span>
              <h2>{selectedSign.sign}</h2>
            </div>

            <div className="modal-body">
              <p className="modal-description">{selectedSign.description}</p>
              
              <div className="steps-section">
                <h3>How to Sign:</h3>
                <ol className="steps-list">
                  {selectedSign.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="modal-footer">
                <button
                  className={`btn ${learnedSigns.includes(selectedSign.id) ? 'btn-secondary' : 'btn-primary'}`}
                  onClick={() => toggleLearned(selectedSign.id)}
                >
                  {learnedSigns.includes(selectedSign.id) ? '✓ Learned' : 'Mark as Learned'}
                </button>
                <button className="btn btn-secondary" onClick={() => setSelectedSign(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LearningMode;
