import os
import json
import time

try:
    from gtts import gTTS
except ImportError:
    print("gTTS is not installed. Installing it now...")
    os.system("pip install gTTS")
    from gtts import gTTS

def generate_audio():
    json_path = "sentences.json"
    audio_dir = "audio"

    if not os.path.exists(json_path):
        print(f"Error: {json_path} not found.")
        return

    if not os.path.exists(audio_dir):
        os.makedirs(audio_dir)
        print(f"Created directory: {audio_dir}")

    with open(json_path, "r", encoding="utf-8") as f:
        sentences = json.load(f)

    print(f"Loaded {len(sentences)} sentences.")
    
    for index, item in enumerate(sentences):
        sentence_id = item.get("id")
        text = item.get("french")
        
        if not sentence_id or not text:
            print(f"Skipping entry {index}: missing id or french text.")
            continue
            
        # 1. Normal speed audio file
        normal_file = os.path.join(audio_dir, f"{sentence_id}.mp3")
        if not os.path.exists(normal_file):
            print(f"[{index + 1}/{len(sentences)}] Generating normal audio for '{sentence_id}'...")
            try:
                tts = gTTS(text=text, lang="fr", slow=False)
                tts.save(normal_file)
                time.sleep(0.5)
            except Exception as e:
                print(f"Error generating normal audio for {sentence_id}: {e}")
        else:
            print(f"[{index + 1}/{len(sentences)}] Normal audio for '{sentence_id}' already exists. Skipping.")

        # 2. Slow speed audio file
        slow_file = os.path.join(audio_dir, f"{sentence_id}_slow.mp3")
        if not os.path.exists(slow_file):
            print(f"[{index + 1}/{len(sentences)}] Generating slow audio for '{sentence_id}'...")
            try:
                tts_slow = gTTS(text=text, lang="fr", slow=True)
                tts_slow.save(slow_file)
                time.sleep(0.5)
            except Exception as e:
                print(f"Error generating slow audio for {sentence_id}: {e}")
        else:
            print(f"[{index + 1}/{len(sentences)}] Slow audio for '{sentence_id}' already exists. Skipping.")
            
    print("All audio generation completed successfully!")

if __name__ == "__main__":
    generate_audio()
