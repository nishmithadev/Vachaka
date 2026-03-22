# 🤟 Vachaka - ISL Translator

**Your Voice, Your Signs** - A real-time Indian Sign Language translator with learning and practice modes.

## Features

### 🎯 Core Features
- **Real-time ISL Translation** - Webcam-based hand gesture recognition
- **Text-to-Speech** - Hear your translations spoken aloud
- **Translation History** - Save and manage your conversation history

### 📚 Learning Features
- **Sign Library** - Learn 10+ essential ISL signs with step-by-step guides
- **Progress Tracking** - Track which signs you've mastered
- **Category Filters** - Browse signs by category (Greetings, Common, Emergency, etc.)

### 🎮 Practice Features
- **Practice Mode** - Learn at your own pace
- **Challenge Mode** - Beat the clock with 10-second challenges
- **Real-time Feedback** - Get instant feedback on your signing
- **Accuracy Tracking** - Monitor your improvement over time

## Tech Stack

- **React 18** - Frontend framework
- **MediaPipe Hands** - Hand tracking and gesture recognition
- **React Router** - Navigation
- **Web Speech API** - Text-to-speech
- **LocalStorage** - Data persistence

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Webcam

### Setup

1. **Navigate to project directory**
   ```bash
   cd vachaka-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   - App will automatically open at `http://localhost:3000`
   - Allow camera permissions when prompted

## Usage

### Translator
1. Click "Start Camera" to activate webcam
2. Position hands in view of camera
3. Make ISL signs - they'll be translated to text
4. Use "Speak" to hear translations
5. Save important translations to history

### Learning Mode
1. Browse the sign library
2. Click any sign to see detailed instructions
3. Mark signs as "Learned" to track progress
4. Filter by category to find specific signs

### Practice Mode
1. Choose Practice Mode (no time limit) or Challenge Mode (10s per sign)
2. Follow the on-screen prompts
3. Make the requested sign
4. Get instant feedback
5. Track your accuracy and score

### History
1. View all saved translations
2. Filter by date (Today, Week, Month)
3. Search translations
4. Speak, copy, or delete individual items
5. Export history as JSON

## Project Structure

```
vachaka-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Translator.js       # Main translation component
│   │   ├── Translator.css
│   │   ├── LearningMode.js     # Sign library & learning
│   │   ├── LearningMode.css
│   │   ├── PracticeMode.js     # Interactive practice
│   │   ├── PracticeMode.css
│   │   ├── History.js          # Translation history
│   │   └── History.css
│   ├── App.js                  # Main app component
│   ├── App.css
│   ├── index.js                # Entry point
│   └── index.css
└── package.json
```

## Future Enhancements

### Phase 3 (Planned)
- [ ] ML model for accurate ISL recognition
- [ ] Two-way translation (text/speech → animated signs)
- [ ] Multi-language support (Hindi, regional languages)
- [ ] Offline mode with PWA
- [ ] Emergency phrases quick-access
- [ ] Community sign variations
- [ ] Video recordings of signs
- [ ] Custom sign creation
- [ ] Social sharing features

## Browser Compatibility

- Chrome/Edge (recommended) - Full support
- Firefox - Full support
- Safari - Partial support (camera access may vary)

## Troubleshooting

### Camera not working
- Check browser permissions
- Ensure HTTPS or localhost
- Try different browser

### Signs not detected
- Ensure good lighting
- Keep hands clearly visible
- Position camera at appropriate distance
- Review sign instructions in Learning Mode

### Performance issues
- Close unnecessary browser tabs
- Reduce video quality if needed
- Update browser to latest version

## Contributing

This is a learning project. Suggestions and improvements welcome!

## License

MIT License - Feel free to use and modify

## Acknowledgments

- MediaPipe for hand tracking technology
- ISL community for sign language resources
- All contributors and testers

---

Built with ❤️ for the deaf and hard of hearing community
