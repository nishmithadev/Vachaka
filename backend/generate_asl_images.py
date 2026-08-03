import urllib.request
import os

os.makedirs("app/static/asl", exist_ok=True)

# These are from GitHub — free ASL dataset images
BASE = "https://raw.githubusercontent.com/mon95/Sign-Language-and-Static-gesture-recognition-using-sklearn/master/Dataset/"

ASL_URLS = {
    "a": f"{BASE}A/A1.jpg",
    "b": f"{BASE}B/B1.jpg",
    "c": f"{BASE}C/C1.jpg",
    "d": f"{BASE}D/D1.jpg",
    "e": f"{BASE}E/E1.jpg",
    "f": f"{BASE}F/F1.jpg",
    "g": f"{BASE}G/G1.jpg",
    "h": f"{BASE}H/H1.jpg",
    "i": f"{BASE}I/I1.jpg",
    "j": f"{BASE}J/J1.jpg",
    "k": f"{BASE}K/K1.jpg",
    "l": f"{BASE}L/L1.jpg",
    "m": f"{BASE}M/M1.jpg",
    "n": f"{BASE}N/N1.jpg",
    "o": f"{BASE}O/O1.jpg",
    "p": f"{BASE}P/P1.jpg",
    "q": f"{BASE}Q/Q1.jpg",
    "r": f"{BASE}R/R1.jpg",
    "s": f"{BASE}S/S1.jpg",
    "t": f"{BASE}T/T1.jpg",
    "u": f"{BASE}U/U1.jpg",
    "v": f"{BASE}V/V1.jpg",
    "w": f"{BASE}W/W1.jpg",
    "x": f"{BASE}X/X1.jpg",
    "y": f"{BASE}Y/Y1.jpg",
    "z": f"{BASE}Z/Z1.jpg",
}

print("Downloading real ASL hand images...")
success = 0
for letter, url in ASL_URLS.items():
    save_path = f"app/static/asl/{letter}.jpg"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10) as response:
            with open(save_path, "wb") as f:
                f.write(response.read())
        print(f"✅ {letter.upper()} downloaded")
        success += 1
    except Exception as e:
        print(f"❌ {letter.upper()} failed: {e}")

print(f"\n🎉 Done! {success}/26 images downloaded")