from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()

# Using Spellingsign.com — reliable ASL letter images
ASL_DICT = {
    letter: f"http://localhost:8000/asl/{letter}.jpg"
    for letter in "abcdefghijklmnopqrstuvwxyz"
}

WORD_EXCEPTIONS = {
    "hello": list("hello"), "yes": list("yes"), "no": list("no"),
    "please": list("please"), "sorry": list("sorry"), "thank": list("thank"),
    "you": list("you"), "help": list("help"), "good": list("good"),
    "bad": list("bad"), "stop": list("stop"), "go": list("go"),
    "come": list("come"), "want": list("want"), "need": list("need"),
    "love": list("love"), "what": list("what"), "where": list("where"),
    "when": list("when"), "why": list("why"), "how": list("how"),
    "more": list("more"), "food": list("food"), "water": list("water"),
    "name": list("name"), "my": list("my"), "happy": list("happy"),
    "sad": list("sad"), "eat": list("eat"), "drink": list("drink"),
}

@router.get("/convert")
async def speech_to_sign(text: str):
    try:
        words = text.lower().strip().split()
        signs = []
        for word in words:
            clean = word.strip(".,!?'\"")
            letters = WORD_EXCEPTIONS.get(clean, list(clean))
            for ch in letters:
                if ch in ASL_DICT:
                    signs.append({
                        "word": ch.upper(),
                        "sign_url": ASL_DICT[ch],
                        "type": "letter",
                        "found": True,
                        "original_word": clean
                    })
                else:
                    signs.append({
                        "word": ch.upper(),
                        "sign_url": None,
                        "type": "letter",
                        "found": False,
                        "original_word": clean
                    })
        found = sum(1 for s in signs if s["found"])
        return {"text": text, "signs": signs, "coverage": f"{found}/{len(signs)} signs found"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})