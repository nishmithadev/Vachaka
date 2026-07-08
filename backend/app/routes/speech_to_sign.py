from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()

# Real working ASL GIF URLs from lifeprint.com & handspeak.com
ASL_DICT = {
    # Common words
    "hello":     "https://www.handspeak.com/word/h/hel/hello.gif",
    "yes":       "https://www.handspeak.com/word/y/yes/yes.gif",
    "no":        "https://www.handspeak.com/word/n/no/no.gif",
    "please":    "https://www.handspeak.com/word/p/ple/please.gif",
    "sorry":     "https://www.handspeak.com/word/s/sor/sorry.gif",
    "thank":     "https://www.handspeak.com/word/t/tha/thank-you.gif",
    "you":       "https://www.handspeak.com/word/y/you/you.gif",
    "help":      "https://www.handspeak.com/word/h/hel/help.gif",
    "good":      "https://www.handspeak.com/word/g/goo/good.gif",
    "bad":       "https://www.handspeak.com/word/b/bad/bad.gif",
    "stop":      "https://www.handspeak.com/word/s/sto/stop.gif",
    "go":        "https://www.handspeak.com/word/g/go/go.gif",
    "come":      "https://www.handspeak.com/word/c/com/come.gif",
    "want":      "https://www.handspeak.com/word/w/wan/want.gif",
    "need":      "https://www.handspeak.com/word/n/nee/need.gif",
    "love":      "https://www.handspeak.com/word/l/lov/love.gif",
    "what":      "https://www.handspeak.com/word/w/wha/what.gif",
    "where":     "https://www.handspeak.com/word/w/whe/where.gif",
    "when":      "https://www.handspeak.com/word/w/whe/when.gif",
    "why":       "https://www.handspeak.com/word/w/why/why.gif",
    "how":       "https://www.handspeak.com/word/h/how/how.gif",
    "who":       "https://www.handspeak.com/word/w/who/who.gif",
    "more":      "https://www.handspeak.com/word/m/mor/more.gif",
    "food":      "https://www.handspeak.com/word/f/foo/food.gif",
    "water":     "https://www.handspeak.com/word/w/wat/water.gif",
    "home":      "https://www.handspeak.com/word/h/hom/home.gif",
    "work":      "https://www.handspeak.com/word/w/wor/work.gif",
    "name":      "https://www.handspeak.com/word/n/nam/name.gif",
    "my":        "https://www.handspeak.com/word/m/my/my.gif",
    "i":         "https://www.handspeak.com/word/i/i/i.gif",
    "happy":     "https://www.handspeak.com/word/h/hap/happy.gif",
    "sad":       "https://www.handspeak.com/word/s/sad/sad.gif",
    "eat":       "https://www.handspeak.com/word/e/eat/eat.gif",
    "drink":     "https://www.handspeak.com/word/d/dri/drink.gif",
    "sleep":     "https://www.handspeak.com/word/s/sle/sleep.gif",
    "school":    "https://www.handspeak.com/word/s/sch/school.gif",
    "friend":    "https://www.handspeak.com/word/f/fri/friend.gif",
    "family":    "https://www.handspeak.com/word/f/fam/family.gif",
    "mother":    "https://www.handspeak.com/word/m/mot/mother.gif",
    "father":    "https://www.handspeak.com/word/f/fat/father.gif",
    "again":     "https://www.handspeak.com/word/a/aga/again.gif",
    "understand":"https://www.handspeak.com/word/u/und/understand.gif",

    # ASL Alphabet fallback
    "a": "https://www.handspeak.com/word/a/alp/alphabet-a.gif",
    "b": "https://www.handspeak.com/word/a/alp/alphabet-b.gif",
    "c": "https://www.handspeak.com/word/a/alp/alphabet-c.gif",
    "d": "https://www.handspeak.com/word/a/alp/alphabet-d.gif",
    "e": "https://www.handspeak.com/word/a/alp/alphabet-e.gif",
    "f": "https://www.handspeak.com/word/a/alp/alphabet-f.gif",
    "g": "https://www.handspeak.com/word/a/alp/alphabet-g.gif",
    "h": "https://www.handspeak.com/word/a/alp/alphabet-h.gif",
    "i": "https://www.handspeak.com/word/a/alp/alphabet-i.gif",
    "j": "https://www.handspeak.com/word/a/alp/alphabet-j.gif",
    "k": "https://www.handspeak.com/word/a/alp/alphabet-k.gif",
    "l": "https://www.handspeak.com/word/a/alp/alphabet-l.gif",
    "m": "https://www.handspeak.com/word/a/alp/alphabet-m.gif",
    "n": "https://www.handspeak.com/word/a/alp/alphabet-n.gif",
    "o": "https://www.handspeak.com/word/a/alp/alphabet-o.gif",
    "p": "https://www.handspeak.com/word/a/alp/alphabet-p.gif",
    "q": "https://www.handspeak.com/word/a/alp/alphabet-q.gif",
    "r": "https://www.handspeak.com/word/a/alp/alphabet-r.gif",
    "s": "https://www.handspeak.com/word/a/alp/alphabet-s.gif",
    "t": "https://www.handspeak.com/word/a/alp/alphabet-t.gif",
    "u": "https://www.handspeak.com/word/a/alp/alphabet-u.gif",
    "v": "https://www.handspeak.com/word/a/alp/alphabet-v.gif",
    "w": "https://www.handspeak.com/word/a/alp/alphabet-w.gif",
    "x": "https://www.handspeak.com/word/a/alp/alphabet-x.gif",
    "y": "https://www.handspeak.com/word/a/alp/alphabet-y.gif",
    "z": "https://www.handspeak.com/word/a/alp/alphabet-z.gif",
}

@router.get("/convert")
async def speech_to_sign(text: str):
    try:
        words = text.lower().strip().split()
        signs = []

        for word in words:
            clean = word.strip(".,!?'\"")

            if clean in ASL_DICT:
                # Word found directly
                signs.append({
                    "word": clean,
                    "sign_url": ASL_DICT[clean],
                    "type": "word",
                    "found": True
                })
            else:
                # Spell it out letter by letter
                letters = []
                for ch in clean:
                    if ch in ASL_DICT:
                        letters.append({
                            "word": ch.upper(),
                            "sign_url": ASL_DICT[ch],
                            "type": "letter",
                            "found": True
                        })
                    else:
                        letters.append({
                            "word": ch.upper(),
                            "sign_url": None,
                            "type": "letter",
                            "found": False
                        })
                signs.extend(letters)

        found = sum(1 for s in signs if s["found"])
        return {
            "text": text,
            "signs": signs,
            "coverage": f"{found}/{len(signs)} signs found"
        }

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})