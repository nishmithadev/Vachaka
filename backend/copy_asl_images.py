import os
import shutil

SOURCE = "ml/dataset/asl_alphabet_train/asl_alphabet_train"
DEST = "app/static/asl"

os.makedirs(DEST, exist_ok=True)

letters = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")

print("Copying ASL images from your own dataset...")
success = 0

for letter in letters:
    folder = os.path.join(SOURCE, letter)
    if os.path.exists(folder):
        images = os.listdir(folder)
        if images:
            src = os.path.join(folder, images[0])
            dst = os.path.join(DEST, f"{letter.lower()}.jpg")
            shutil.copy(src, dst)
            print(f"✅ {letter} copied")
            success += 1
        else:
            print(f"⚠️ {letter} folder empty")
    else:
        print(f"❌ {letter} folder not found")

print(f"\n🎉 Done! {success}/26 images ready!")