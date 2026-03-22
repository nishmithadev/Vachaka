import React, { useState, useRef, useEffect } from 'react';
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import './PracticeMode.css';

const PRACTICE_SIGNS = [
  { id: 1, sign: 'Hello', emoji: '👋' },
  { id: 2, sign: 'Thank You', emoji: '🙏' },
  { id: 3, sign: 'Yes', emoji: '👍' },
  { id: 4, sign: 'No', emoji: '👎' },
  { id: 5, sign: 'Help', emoji: '🆘' },
  { id: 6, sign: 'Please', emoji: '🙏' },
  { id: 7, sign: 'Water', emoji: '💧' },
  { id: 8, sign: 'Food', emoji: '🍽️' }
];

function PracticeMode() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameMode, setGameMode] = useState('practice'); // practice or challenge

  useEffect(() => {
    if (gameMode === 'challenge' && currentChallenge && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && currentChallenge) {
      handleTimeout();
    }
  }, [timeLeft, currentChallenge, gameMode]);

  useEffect(() => {
    if (!isActive) return;

    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    hands.onResults(onResults);

    if (videoRef.current) {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await hands.send({ image: videoRef.current });
        },
        width: 640,
        height: 480
      });
      camera.start();
    }

    return () => {
      hands.close();
    };
  }, [isActive]);

  const onResults = (results) => {
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext('2d');
    
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    if (results.multiHandLandmarks && currentChallenge) {
      for (const landmarks of results.multiHandLandmarks) {
        drawHand(canvasCtx, landmarks);
        checkSign(landmarks);
      }
    }
    canvasCtx.restore();
  };

  const drawHand = (ctx, landmarks) => {
    // Draw connections
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4],
      [0, 5], [5, 6], [6, 7], [7, 8],
      [0, 9], [9, 10], [10, 11], [11, 12],
      [0, 13], [13, 14], [14, 15], [15, 16],
      [0, 17], [17, 18], [18, 19], [19, 20],
      [5, 9], [9, 13], [13, 17]
    ];

    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 2;

    connections.forEach(([start, end]) => {
      ctx.beginPath();
      ctx.moveTo(landmarks[start].x * ctx.canvas.width, landmarks[start].y * ctx.canvas.height);
      ctx.lineTo(landmarks[end].x * ctx.canvas.width, landmarks[end].y * ctx.canvas.height);
      ctx.stroke();
    });

    // Draw landmarks
    ctx.fillStyle = '#FF0000';
    landmarks.forEach(landmark => {
      ctx.beginPath();
      ctx.arc(
        landmark.x * ctx.canvas.width,
        landmark.y * ctx.canvas.height,
        5,
        0,
        2 * Math.PI
      );
      ctx.fill();
    });
  };

  const checkSign = (landmarks) => {
    // Simplified sign recognition - you'll implement proper ML model
    const recognized = Math.random() > 0.7; // Placeholder
    
    if (recognized && currentChallenge) {
      handleCorrectSign();
    }
  };

  const startPractice = () => {
    setGameMode('practice');
    setIsActive(true);
    nextChallenge();
  };

  const startChallenge = () => {
    setGameMode('challenge');
    setScore(0);
    setAttempts(0);
    setIsActive(true);
    nextChallenge();
  };

  const nextChallenge = () => {
    const randomSign = PRACTICE_SIGNS[Math.floor(Math.random() * PRACTICE_SIGNS.length)];
    setCurrentChallenge(randomSign);
    setFeedback('');
    setTimeLeft(10);
  };

  const handleCorrectSign = () => {
    setScore(score + 1);
    setAttempts(attempts + 1);
    setFeedback('✓ Correct!');
    
    setTimeout(() => {
      nextChallenge();
    }, 1500);
  };

  const handleTimeout = () => {
    setAttempts(attempts + 1);
    setFeedback('⏰ Time\'s up! Try the next one.');
    
    setTimeout(() => {
      nextChallenge();
    }, 2000);
  };

  const skipSign = () => {
    setAttempts(attempts + 1);
    nextChallenge();
  };

  const stopPractice = () => {
    setIsActive(false);
    setCurrentChallenge(null);
  };

  const accuracy = attempts > 0 ? Math.round((score / attempts) * 100) : 0;

  return (
    <div className="practice-mode">
      <div className="card">
        <h2>🎯 Practice Mode</h2>
        <p>Test your ISL skills in real-time!</p>

        {!isActive ? (
          <div className="start-section">
            <div className="mode-selection">
              <div className="mode-card" onClick={startPractice}>
                <div className="mode-icon">📝</div>
                <h3>Practice Mode</h3>
                <p>Take your time to practice signs at your own pace</p>
                <button className="btn btn-primary">Start Practice</button>
              </div>

              <div className="mode-card" onClick={startChallenge}>
                <div className="mode-icon">⚡</div>
                <h3>Challenge Mode</h3>
                <p>Beat the clock! 10 seconds per sign</p>
                <button className="btn btn-primary">Start Challenge</button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="practice-stats">
              <div className="stat">
                <span className="stat-label">Score</span>
                <span className="stat-value">{score}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Accuracy</span>
                <span className="stat-value">{accuracy}%</span>
              </div>
              {gameMode === 'challenge' && (
                <div className="stat timer">
                  <span className="stat-label">Time</span>
                  <span className={`stat-value ${timeLeft <= 3 ? 'urgent' : ''}`}>
                    {timeLeft}s
                  </span>
                </div>
              )}
            </div>

            {currentChallenge && (
              <div className="challenge-card">
                <div className="challenge-emoji">{currentChallenge.emoji}</div>
                <h3>Show the sign for:</h3>
                <div className="challenge-sign">{currentChallenge.sign}</div>
              </div>
            )}

            <div className="video-container">
              <video
                ref={videoRef}
                className="practice-video"
                autoPlay
                playsInline
              />
              <canvas
                ref={canvasRef}
                className="practice-canvas"
                width="640"
                height="480"
              />
              {feedback && (
                <div className={`feedback-overlay ${feedback.includes('✓') ? 'correct' : ''}`}>
                  {feedback}
                </div>
              )}
            </div>

            <div className="practice-controls">
              <button className="btn btn-secondary" onClick={skipSign}>
                Skip
              </button>
              <button className="btn btn-danger" onClick={stopPractice}>
                Stop Practice
              </button>
            </div>
          </>
        )}
      </div>

      {!isActive && attempts > 0 && (
        <div className="card results-card">
          <h3>Session Results</h3>
          <div className="results-grid">
            <div className="result-item">
              <div className="result-label">Total Signs</div>
              <div className="result-value">{attempts}</div>
            </div>
            <div className="result-item">
              <div className="result-label">Correct</div>
              <div className="result-value success">{score}</div>
            </div>
            <div className="result-item">
              <div className="result-label">Accuracy</div>
              <div className="result-value">{accuracy}%</div>
            </div>
          </div>
        </div>
      )}

      <div className="card tips-card">
        <h3>💡 Practice Tips</h3>
        <ul>
          <li>Ensure good lighting for better hand detection</li>
          <li>Keep your hands clearly visible in the camera frame</li>
          <li>Practice each sign slowly before attempting challenges</li>
          <li>Review the Learning Mode if you're stuck on a sign</li>
        </ul>
      </div>
    </div>
  );
}

export default PracticeMode;
