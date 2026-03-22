import React, { useState } from 'react';
import './SignGuide.css';

function SignGuide() {
  const [selectedSign, setSelectedSign] = useState('A');

  const signs = {
    // Numbers (1-9) - All single hand
    '1': { hands: 1, desc: 'Index finger pointing straight up, other fingers closed in fist', tips: 'Keep index very straight, thumb tucked' },
    '2': { hands: 1, desc: 'Index and middle fingers up in V-shape (peace sign)', tips: 'Fingers slightly spread apart, palm facing forward' },
    '3': { hands: 1, desc: 'Thumb, index, and middle fingers extended', tips: 'Three fingers spread, ring and pinky down' },
    '4': { hands: 1, desc: 'All four fingers up together, thumb tucked', tips: 'Fingers straight and touching, palm forward' },
    '5': { hands: 1, desc: 'Open palm, all five fingers spread wide', tips: 'Hand completely open, fingers apart' },
    '6': { hands: 1, desc: 'Thumb and pinky extended, other fingers closed', tips: 'Classic "hang loose" gesture' },
    '7': { hands: 1, desc: 'Curved hand forming hook/claw shape', tips: 'Fingers curved inward, thumb out to side' },
    '8': { hands: 1, desc: 'Index and middle fingers extended, palm facing forward', tips: 'Like peace sign but fingers together' },
    '9': { hands: 1, desc: 'Thumb and index pointing sideways/horizontally', tips: 'Like pointing with thumb out' },
    
    // Letters A-G - Single hand
    'A': { hands: 1, desc: 'Three middle fingers up together, thumb and pinky down', tips: 'Index, middle, ring fingers straight up touching' },
    'B': { hands: 1, desc: 'All four fingers up straight together, thumb across palm', tips: 'Palm facing forward, fingers touching' },
    'C': { hands: 1, desc: 'Open palm with all fingers extended', tips: 'Hand flat, all fingers spread slightly' },
    'D': { hands: 1, desc: 'Thumb and pinky out, three middle fingers closed', tips: 'Hang loose gesture, palm forward' },
    'E': { hands: 1, desc: 'Curved hand making C or claw shape', tips: 'Fingers curved inward like holding ball' },
    'F': { hands: 1, desc: 'Index and middle extended, palm facing forward', tips: 'Peace sign position, two fingers up' },
    'G': { hands: 1, desc: 'Thumb pointing sideways, fingers closed', tips: 'Pointing gesture with thumb horizontal' },
    
    // Letters H-L - TWO HANDS
    'H': { hands: 2, desc: 'Both hands in fists, knuckles touching horizontally', tips: 'Fists side by side, touching at knuckles, both palms down' },
    'I': { hands: 2, desc: 'Both hands curved, fingertips touching to form arch/dome', tips: 'Hands mirror each other, fingertips meet at top' },
    'J': { hands: 2, desc: 'One hand curved over other hand with index pointing', tips: 'Right hand index points, left hand curves over it' },
    'K': { hands: 2, desc: 'One hand index and thumb form L, touches other hand fist', tips: 'L-shape hand meets closed fist' },
    'L': { hands: 2, desc: 'Both hands with index and pinky extended, interlocked', tips: 'Rock-on gesture both hands, fingers interlock' },
    
    // Letters M-S - Mixed
    'M': { hands: 2, desc: 'One palm flat horizontal over other vertical fist', tips: 'Flat hand on top of closed fist' },
    'N': { hands: 1, desc: 'Closed fist, palm down, knuckles facing camera', tips: 'Tight fist, palm facing down' },
    'O': { hands: 2, desc: 'Both hands curved, all fingertips touching forming circle/O', tips: 'Make oval shape with both hands together' },
    'P': { hands: 1, desc: 'Index finger pointing forward at camera', tips: 'Point straight ahead, other fingers closed' },
    'Q': { hands: 1, desc: 'Index and middle fingers extended sideways', tips: 'Two fingers pointing horizontally to the side' },
    'R': { hands: 1, desc: 'Thumb up gesture, fist with thumb extended', tips: 'Classic thumbs up sign' },
    'S': { hands: 1, desc: 'Index finger pointing upward from L-shape hand', tips: 'Thumb and index form L, index points up' },
    
    // Letters T-Z - Mixed  
    'T': { hands: 2, desc: 'Both hands in peace sign (two fingers), one horizontal', tips: 'V-signs, one hand rotated 90 degrees' },
    'U': { hands: 1, desc: 'Three fingers up in "rock on" gesture', tips: 'Index, middle, pinky extended, thumb holds ring down' },
    'V': { hands: 1, desc: 'Index and middle fingers up in V, fingers spread apart', tips: 'Classic peace sign, fingers separated' },
    'W': { hands: 2, desc: 'Both hands fingers interlocked, fingers interweaved', tips: 'Hands clasped together, fingers interwoven' },
    'X': { hands: 2, desc: 'Both hands with index fingers crossed forming X', tips: 'Index fingers cross each other' },
    'Y': { hands: 2, desc: 'One hand thumb/pinky out, other hand pinky hooks it', tips: 'Hang loose gesture, other hand hooks pinky' },
    'Z': { hands: 2, desc: 'Both hands pointing, one finger traces Z motion', tips: 'Draw Z shape with index fingers crossing' },
  };

  const signList = Object.keys(signs);

  return (
    <div className="sign-guide">
      <div className="card">
        <h2>📖 ISL Sign Reference Guide</h2>
        <p className="subtitle">Learn how to make each sign correctly for accurate detection</p>

        <div className="guide-container">
          {/* Sign selector */}
          <div className="sign-selector">
            <h3>Select a Sign:</h3>
            <div className="sign-grid">
              {signList.map(sign => (
                <button
                  key={sign}
                  className={`sign-btn ${selectedSign === sign ? 'active' : ''}`}
                  onClick={() => setSelectedSign(sign)}
                >
                  {sign}
                </button>
              ))}
            </div>
          </div>

          {/* Sign details */}
          <div className="sign-details">
            <div className="sign-header">
              <h1 className="sign-letter">{selectedSign}</h1>
              <span className={`hand-count ${signs[selectedSign].hands === 2 ? 'two-hands' : 'one-hand'}`}>
                {signs[selectedSign].hands === 2 ? '🤚🤚 Two Hands' : '🤚 One Hand'}
              </span>
            </div>

            <div className="sign-info">
              <div className="info-box">
                <h4>📋 Description:</h4>
                <p>{signs[selectedSign].desc}</p>
              </div>

              <div className="info-box">
                <h4> Tips:</h4>
                <p>{signs[selectedSign].tips}</p>
              </div>

              <div className="info-box checklist">
                <h4> Checklist for Accurate Detection:</h4>
                <ul>
                  <li>✓ Use <strong>Black Background</strong> mode in app</li>
                  <li>✓ Hand fills <strong>70-80%</strong> of frame</li>
                  <li>✓ <strong>Centered</strong> in camera view</li>
                  <li>✓ <strong>Good lighting</strong> on hands</li>
                  <li>✓ Hold <strong>very steady</strong> for 2-3 seconds</li>
                  <li>✓ Palm facing <strong>camera</strong> (not sideways)</li>
                  {signs[selectedSign].hands === 2 && (
                    <li>✓ Both hands <strong>same distance</strong> from camera</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="practice-tip">
              <strong> Practice Tip:</strong> Look at the training images from Kaggle for this sign. 
              Mirror the exact hand position, angle, and spacing. The model knows what it was trained on!
            </div>
          </div>
        </div>

        <div className="help-note">
          <p><strong>Note:</strong> The model was trained on specific hand positions. 
          The closer you match the training images, the better the accuracy!</p>
        </div>
      </div>
    </div>
  );
}

export default SignGuide;