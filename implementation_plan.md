# Project Blueprint & Implementation Plan: Élan French PWA

This document serves as the complete, single-source-of-truth blueprint of the **Élan French Learning Progressive Web App (PWA)**. It summarizes everything built from the beginning so that any new session or developer can easily replicate the entire project, and details the plan for the dialogue and slow-play enhancements.

---

## 1. Project Overview & Architecture
**Élan** is an interactive, premium mobile-first French learning PWA. It is designed to work 100% offline on Android devices and features:
- **Pre-generated Audio**: A Python script runs locally during development to compile high-quality speech files for every sentence, saving them to disk so they can be cached and played offline.
- **Microphone Pronunciation Testing**: Uses the HTML5 `webkitSpeechRecognition` API (native in Android Chrome) to listen to the user speak in French and compute a similarity score.
- **Active Recall Flashcards**: Interactive digital cards that flip to reveal English translations and track mastered items using local browser storage (`localStorage`).
- **Offline PWA Engine**: Manifest and service worker cache all web files and audio clips, allowing launcher installation.

---

## 2. Directory Structure (Current State)
The project is located at `c:\Users\nova\Documents\AgenticAI\Antigravity\LearnFrench` and contains the following assets:
```
LearnFrench/
├── index.html           # Main UI layout & responsive container
├── index.css            # Dark-theme design system, typography, glassmorphism
├── app.js               # Event routing, speech recognition, audio player
├── sentences.json       # Vocabulary database
├── generate_audio.py    # Python gTTS audio file downloader
├── manifest.json        # PWA descriptor for home screen install
├── sw.js                # Offline service worker caching assets & audio
├── package.json         # Server dependency configuration (http-server)
├── dialogues.md         # Syllabus detailing conversations (New)
├── .gitignore           # Excludes node_modules/ and system metadata
├── audio/               # Pre-generated MP3 voice clips (e.g. greet_01.mp3)
└── icons/               # Launcher icons (icon-192.png, icon-512.png)
```

---

## 3. Replication Guide (How to Rebuild/Replicate from Scratch)

If starting a brand-new session, follow these steps to recreate the application:

### Step 1: Initialize Files
Create the project folder and copy/create the core files: `index.html`, `index.css`, `app.js`, `sentences.json`, `manifest.json`, `sw.js`, `package.json`, and `generate_audio.py`.

### Step 2: Install Local Runtimes
Make sure Python (3.x) and Node.js are installed. Run:
```bash
pip install gTTS
npm install
```

### Step 3: Download French Audio Assets
Generate the offline audio files by running the Python downloader:
```bash
python generate_audio.py
```
This will read `sentences.json` and generate all `.mp3` files in the `audio/` directory.

### Step 4: Run the Local Server
Start the development server to test local and mobile connections:
```bash
npm start
```

### Step 5: Push to GitHub Pages
To publish the app publicly:
1. Create a public GitHub repository named `LearnFrench`.
2. Connect your local directory and push:
   ```bash
   git remote add origin https://github.com/your-username/LearnFrench.git
   git branch -M master
   git push -u origin master
   ```
3. Enable GitHub Pages in your repository settings under the `master` branch.

---

## 4. Enhancement Plan: Dialogues & Slow Playback

We are now augmenting the learning materials with dialogue-based topics and dedicated slow-speed playback.

### Part A: Dialogue Conversion
We will replace the list of individual sentences in [sentences.json](file:///c:/Users/nova/Documents/AgenticAI/Antigravity/LearnFrench/sentences.json) with structured conversations for 4 topics:
1. **At the Hotel (À l'Hôtel)** - 10 sentences
2. **On the Bus (Dans le Bus)** - 10 sentences
3. **At the Restaurant (Au Restaurant)** - 10 sentences
4. **At the Supermarket (Au Supermarché)** - 10 sentences

**New Data Schema:**
Each sentence item will include a `speaker` string ("Guest", "Receptionist", "Driver", "Passenger", "Waiter", "Customer", "Cashier") and a `dialogue_id` to group consecutive sentences into continuous dialogues.

### Part B: Chat-Style UI Layout
We will update [index.html](file:///c:/Users/nova/Documents/AgenticAI/Antigravity/LearnFrench/index.html) and [index.css](file:///c:/Users/nova/Documents/AgenticAI/Antigravity/LearnFrench/index.css) to render the phrases as dialogue exchanges:
- Speakers will appear as chat bubbles aligning to the left/right (alternating sides).
- Each bubble will look like a messaging app with a colored speaker name tag.

### Part C: Dual-Speed Audio Generation
Instead of a global speed setting, we will provide two play buttons inside each bubble:
- **Normal Play Button** (<i class="fa-solid fa-play"></i>)
- **Slow Play Button** (<i class="fa-solid fa-snail"></i>)

We will modify [generate_audio.py](file:///c:/Users/nova/Documents/AgenticAI/Antigravity/LearnFrench/generate_audio.py) to generate two MP3 files for every sentence:
1. `audio/{id}.mp3` (normal speed)
2. `audio/{id}_slow.mp3` (slow speed, generated using `gTTS(text, lang='fr', slow=True)`).

[sw.js](file:///c:/Users/nova/Documents/AgenticAI/Antigravity/LearnFrench/sw.js) will be updated to cache both normal and slow files so they are available offline.
