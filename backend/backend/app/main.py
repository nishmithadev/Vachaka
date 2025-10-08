from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from app.routes import translate

app = FastAPI(title="Vachaka - Sign Language to Speech")

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(translate.router)

@app.get("/")
def root():
    return {"message": "Vachaka backend running"}
