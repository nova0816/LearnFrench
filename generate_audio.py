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
            
        file_path = os.path.join(audio_dir, f"{sentence_id}.mp3")
        
        # Check if file already exists so we don't redownload unnecessarily
        if os.path.exists(file_path):
            print(f"[{index + 1}/{len(sentences)}] Audio for '{sentence_id}' already exists. Skipping.")
            continue
            
        print(f"[{index + 1}/{len(sentences)}] Generating audio for '{sentence_id}'...")
        
        try:
            tts = gTTS(text=text, lang="fr", slow=False)
            tts.save(file_path)
            # Sleep briefly to be respectful to the API
            time.sleep(0.5)
        except Exception as e:
            print(f"Error generating audio for {sentence_id}: {e}")
            
    print("Audio generation completed!")

if __name__ == "__main__":
    generate_audio()
