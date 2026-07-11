# Vachaka
Vachaka is an AI-powered web application that enables seamless communication between hearing-impaired and non-sign-language users. The system converts sign language gestures into text and speech, and converts speech/text into corresponding sign language animations.

Some project files are **not included in this repository** because they exceed GitHub's 100 MB file size limit.
Download them here:

📥 **Google Drive:** 
https://drive.google.com/file/d/1BGLA0jUiAvR_5A598DhBWEd5WlF-l05w/view?usp=drive_link

## Setup

1. Clone the repository.
2. Download the project files from the Google Drive link above.
3. Extract the downloaded ZIP file.
4. Copy the extracted files into the project directory.
5. Install dependencies.

Backend:

```bash
cd backend
pip install -r requirements.txt
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Start the backend:

```bash
uvicorn app.main:app --reload
```

The application should now be ready to use.
