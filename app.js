// ==========================================
// APPLICATION STATE
// ==========================================
let sentences = [];
let favorites = JSON.parse(localStorage.getItem('elan_favorites')) || [];
let mastered = JSON.parse(localStorage.getItem('elan_mastered')) || [];
let currentTab = 'explore';
let currentCategory = 'All';
let currentAudio = null;

// Flashcard Mode State
let quizQueue = [];
let quizIndex = 0;
let isCardFlipped = false;

// Speech Recognition State
let recognition = null;
let isRecording = false;

// ==========================================
// APP INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

async function initApp() {
  // 1. Register PWA Service Worker
  registerServiceWorker();

  // 2. Fetch Sentences Data
  try {
    const response = await fetch('sentences.json');
    if (!response.ok) throw new Error('Failed to load sentences.json');
    sentences = await response.json();
  } catch (error) {
    console.error('Error loading sentences:', error);
    showErrorMessage();
    return;
  }

  // 3. Load stats
  updateStats();

  // 4. Set up Category bar
  renderCategoryBar();

  // 5. Render Explore List
  renderExploreGrid();

  // 6. Set up Event Listeners
  setupEventListeners();

  // Initialize Speech Recognition support check
  initSpeechRecognition();
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then(reg => console.log('Service Worker registered!'))
        .catch(err => console.log('Service Worker registration failed:', err));
    });
  }
}

function updateStats() {
  document.getElementById('star-count').textContent = favorites.length;
  document.getElementById('mastered-count').textContent = mastered.length;
}

function showErrorMessage() {
  const grid = document.getElementById('sentences-grid');
  grid.innerHTML = `
    <div class="empty-state">
      <i class="fa-solid fa-circle-exclamation text-error"></i>
      <p>Error loading learning materials. Please run the server and try again.</p>
    </div>
  `;
}

// ==========================================
// CATEGORY HANDLING
// ==========================================
function renderCategoryBar() {
  const categoryBar = document.getElementById('category-bar');
  const categories = ['All', ...new Set(sentences.map(s => s.category))];
  
  categoryBar.innerHTML = categories.map(cat => `
    <button class="category-chip ${cat === currentCategory ? 'active' : ''}" 
            onclick="selectCategory('${cat.replace(/'/g, "\\'")}')">
      ${cat}
    </button>
  `).join('');
}

window.selectCategory = function(category) {
  currentCategory = category;
  renderCategoryBar();
  renderExploreGrid();
};

// ==========================================
// RENDER EXPLORE LIST (CHAT BUBBLE LAYOUT)
// ==========================================
function renderExploreGrid() {
  const grid = document.getElementById('sentences-grid');
  const filtered = currentCategory === 'All' 
    ? sentences 
    : sentences.filter(s => s.category === currentCategory);

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-folder-open"></i>
        <p>No sentences found in this category.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(s => {
    const isFav = favorites.includes(s.id);
    const isMast = mastered.includes(s.id);
    
    // Determine chat bubble alignment (left for Guest/Customer/Passenger, right for Staff)
    const isLeft = s.speaker === 'Guest' || s.speaker === 'Passenger' || s.speaker === 'Customer';
    const alignClass = isLeft ? 'left' : 'right';

    return `
      <div class="dialogue-bubble ${alignClass}" id="bubble-${s.id}">
        <div class="bubble-header">
          <span class="speaker-tag">${s.speaker}</span>
          <div class="bubble-actions">
            <button class="bubble-action-btn check-btn ${isMast ? 'active' : ''}" 
                    onclick="event.stopPropagation(); toggleMastered('${s.id}')"
                    title="${isMast ? 'Marked as mastered' : 'Mark as mastered'}">
              <i class="fa-solid ${isMast ? 'fa-circle-check' : 'fa-circle'}"></i>
            </button>
            <button class="bubble-action-btn star-btn ${isFav ? 'active' : ''}" 
                    onclick="event.stopPropagation(); toggleFavorite('${s.id}')"
                    title="${isFav ? 'Remove from favorites' : 'Add to favorites'}">
              <i class="fa-solid fa-star"></i>
            </button>
          </div>
        </div>
        
        <div onclick="playAudio('${s.id}', false)">
          <p class="french-bubble-text">${s.french}</p>
          <p class="phonetic-bubble-text">${s.phonetic}</p>
          
          <div class="english-bubble-text">
            <span>${s.english}</span>
            <div class="bubble-tools">
              <button class="bubble-btn" onclick="event.stopPropagation(); playAudio('${s.id}', false)" title="Play Normal Speed">
                <i class="fa-solid fa-volume-high"></i> Play
              </button>
              <button class="bubble-btn slow-play-btn" onclick="event.stopPropagation(); playAudio('${s.id}', true)" title="Play Slow Speed">
                <i class="fa-solid fa-snail"></i> Slow
              </button>
              <button class="bubble-btn mic-play-btn" onclick="event.stopPropagation(); openSpeechOverlay('${s.id}')" title="Practice Speaking">
                <i class="fa-solid fa-microphone"></i> Talk
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ==========================================
// AUDIO PLAYBACK CONTROLLER (DUAL-SPEED SUPPORT)
// ==========================================
window.playAudio = function(id, isSlow = false) {
  if (currentAudio) {
    currentAudio.pause();
  }
  
  const fileSuffix = isSlow ? '_slow' : '';
  currentAudio = new Audio(`audio/${id}${fileSuffix}.mp3`);
  
  // Visual feedback: highlight bubble borders during playback
  const bubble = document.getElementById(`bubble-${id}`);
  if (bubble) {
    const originalBorder = bubble.style.borderColor;
    bubble.style.borderColor = isSlow ? 'var(--amber)' : 'var(--accent)';
    currentAudio.onended = () => {
      bubble.style.borderColor = originalBorder;
    };
  }

  currentAudio.play().catch(err => {
    console.error("Audio playback failed:", err);
  });
};

// ==========================================
// USER STATE MANAGEMENTS (LOCAL STORAGE)
// ==========================================
window.toggleFavorite = function(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(favId => favId !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem('elan_favorites', JSON.stringify(favorites));
  updateStats();
  
  // Refresh views
  if (currentTab === 'favorites') {
    renderFavoritesGrid();
  } else {
    renderExploreGrid();
  }
};

window.toggleMastered = function(id) {
  if (mastered.includes(id)) {
    mastered = mastered.filter(mId => mId !== id);
  } else {
    mastered.push(id);
  }
  localStorage.setItem('elan_mastered', JSON.stringify(mastered));
  updateStats();
  
  // Refresh views
  renderExploreGrid();
  if (currentTab === 'favorites') renderFavoritesGrid();
};

// ==========================================
// RENDER FAVORITES VIEW
// ==========================================
function renderFavoritesGrid() {
  const grid = document.getElementById('favorites-grid');
  const favItems = sentences.filter(s => favorites.includes(s.id));
  
  if (favItems.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-star-half-stroke"></i>
        <p>Your starred phrases list is currently empty.</p>
        <button onclick="switchTab('explore')" class="empty-action-btn">Browse Phrases</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = favItems.map(s => {
    const isMast = mastered.includes(s.id);
    const isLeft = s.speaker === 'Guest' || s.speaker === 'Passenger' || s.speaker === 'Customer';
    const alignClass = isLeft ? 'left' : 'right';

    return `
      <div class="dialogue-bubble ${alignClass}" id="bubble-${s.id}">
        <div class="bubble-header">
          <span class="speaker-tag">${s.speaker}</span>
          <div class="bubble-actions">
            <button class="bubble-action-btn check-btn ${isMast ? 'active' : ''}" 
                    onclick="event.stopPropagation(); toggleMastered('${s.id}')">
              <i class="fa-solid ${isMast ? 'fa-circle-check' : 'fa-circle'}"></i>
            </button>
            <button class="bubble-action-btn star-btn active" 
                    onclick="event.stopPropagation(); toggleFavorite('${s.id}')">
              <i class="fa-solid fa-star"></i>
            </button>
          </div>
        </div>
        
        <div onclick="playAudio('${s.id}', false)">
          <p class="french-bubble-text">${s.french}</p>
          <p class="phonetic-bubble-text">${s.phonetic}</p>
          
          <div class="english-bubble-text">
            <span>${s.english}</span>
            <div class="bubble-tools">
              <button class="bubble-btn" onclick="event.stopPropagation(); playAudio('${s.id}', false)">
                <i class="fa-solid fa-volume-high"></i> Play
              </button>
              <button class="bubble-btn slow-play-btn" onclick="event.stopPropagation(); playAudio('${s.id}', true)">
                <i class="fa-solid fa-snail"></i> Slow
              </button>
              <button class="bubble-btn mic-play-btn" onclick="event.stopPropagation(); openSpeechOverlay('${s.id}')">
                <i class="fa-solid fa-microphone"></i> Talk
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ==========================================
// FLASHCARDS MODE ENGINE
// ==========================================
function initFlashcards() {
  isCardFlipped = false;
  document.getElementById('flashcard').classList.remove('flipped');
  document.getElementById('flashcard-feedback').classList.add('hidden');

  // Load only non-mastered sentences, or fall back to all sentences if all are mastered
  quizQueue = sentences.filter(s => !mastered.includes(s.id));
  if (quizQueue.length === 0) {
    quizQueue = [...sentences];
  }
  
  // Shuffle cards
  quizQueue.sort(() => Math.random() - 0.5);
  quizIndex = 0;
  
  renderFlashcard();
}

function renderFlashcard() {
  if (quizQueue.length === 0) return;
  
  const currentCard = quizQueue[quizIndex];
  
  // Render Front
  document.getElementById('card-tag').textContent = currentCard.category;
  document.getElementById('card-speaker').textContent = currentCard.speaker;
  document.getElementById('card-french').textContent = currentCard.french;
  document.getElementById('card-phonetic').textContent = currentCard.phonetic;
  
  // Render Back
  document.getElementById('card-english').textContent = currentCard.english;

  // Reset flips
  isCardFlipped = false;
  document.getElementById('flashcard').classList.remove('flipped');
  document.getElementById('flashcard-feedback').classList.add('hidden');

  // Update progress
  const fill = document.getElementById('quiz-progress-fill');
  const text = document.getElementById('quiz-progress-text');
  const progressPercent = (quizIndex / quizQueue.length) * 100;
  
  fill.style.width = `${progressPercent}%`;
  text.textContent = `${quizIndex} / ${quizQueue.length} Completed`;
}

function nextFlashcard() {
  quizIndex++;
  if (quizIndex >= quizQueue.length) {
    quizIndex = 0;
    // Reshuffle
    quizQueue.sort(() => Math.random() - 0.5);
  }
  renderFlashcard();
}

// ==========================================
// SPEECH RECOGNITION (PRONUNCIATION TESTING)
// ==========================================
function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.warn("Speech recognition is not supported in this browser.");
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = 'fr-FR';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    isRecording = true;
    updateSpeechUI('recording');
  };

  recognition.onerror = (event) => {
    console.error("Speech Recognition Error:", event.error);
    isRecording = false;
    updateSpeechUI('error', `Error: ${event.error}. Try again.`);
  };

  recognition.onend = () => {
    isRecording = false;
    if (document.getElementById('speech-status').textContent === 'Listening...') {
      updateSpeechUI('idle');
    }
  };

  recognition.onresult = (event) => {
    const speechResult = event.results[0][0].transcript;
    processSpeechResult(speechResult);
  };
}

window.openSpeechOverlay = function(id) {
  const sentence = sentences.find(s => s.id === id);
  if (!sentence) return;

  const overlay = document.getElementById('speech-overlay');
  overlay.dataset.sentenceId = id;
  
  document.getElementById('target-phrase-speech').textContent = sentence.french;
  document.getElementById('transcription-box').classList.add('hidden');
  
  overlay.classList.remove('hidden');
  updateSpeechUI('idle');
};

function updateSpeechUI(state, customMessage) {
  const micBtn = document.getElementById('mic-recording-btn');
  const statusMsg = document.getElementById('speech-status');
  const overlay = document.getElementById('speech-overlay');

  if (state === 'recording') {
    overlay.classList.add('recording');
    statusMsg.textContent = "Listening... Speak now";
    micBtn.style.transform = "scale(1.1)";
  } else if (state === 'idle') {
    overlay.classList.remove('recording');
    statusMsg.textContent = "Tap microphone and speak in French";
    micBtn.style.transform = "scale(1)";
  } else if (state === 'error') {
    overlay.classList.remove('recording');
    statusMsg.textContent = customMessage || "Speech not recognized. Tap to retry.";
    micBtn.style.transform = "scale(1)";
  }
}

function processSpeechResult(spokenText) {
  const sentenceId = document.getElementById('speech-overlay').dataset.sentenceId;
  const sentence = sentences.find(s => s.id === sentenceId);
  if (!sentence) return;

  const targetText = sentence.french;
  const score = calculateSimilarity(spokenText, targetText);

  // Show results
  const box = document.getElementById('transcription-box');
  const textVal = document.getElementById('user-transcription');
  const scoreBadge = document.getElementById('match-score');

  textVal.textContent = `"${spokenText}"`;
  scoreBadge.textContent = `${score}% Match`;

  if (score >= 70) {
    scoreBadge.className = "match-score-pill success";
    document.getElementById('speech-status').textContent = "Excellent pronunciation!";
    
    // Automatically flag as Mastered if pronunciation is > 85%
    if (score >= 85 && !mastered.includes(sentenceId)) {
      toggleMastered(sentenceId);
    }
  } else {
    scoreBadge.className = "match-score-pill fail";
    document.getElementById('speech-status').textContent = "Let's try that again.";
  }

  box.classList.remove('hidden');
  updateSpeechUI('result');
}

// Normalized text similarity scoring
function calculateSimilarity(s1, s2) {
  const clean = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Strip accents
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?¿¡]/g, "") // Strip punctuation
      .replace(/\s+/g, " ")
      .trim();
  };

  const words1 = clean(s1).split(" ");
  const words2 = clean(s2).split(" ");

  if (words1.length === 0 || words2.length === 0) return 0;

  // Count matching words
  let matches = 0;
  const set2 = new Set(words2);
  
  words1.forEach(w => {
    if (set2.has(w)) {
      matches++;
    }
  });

  const precision = matches / words1.length;
  const recall = matches / words2.length;
  
  if (precision + recall === 0) return 0;
  
  // F1-Score Similarity
  const f1 = (2 * precision * recall) / (precision + recall);
  return Math.round(f1 * 100);
}

// ==========================================
// TAB ROUTING & NAVIGATION
// ==========================================
window.switchTab = function(tabName) {
  currentTab = tabName;
  
  // Reset window scroll position to top on tab switch
  window.scrollTo(0, 0);
  
  // Update Navbar visual active states
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  document.getElementById(`nav-${tabName}`).classList.add('active');

  // Toggle visible sections
  document.querySelectorAll('.app-view').forEach(view => view.classList.remove('active'));
  document.getElementById(`view-${tabName}`).classList.add('active');

  // Handle Category bar visibility
  const categoryBar = document.getElementById('category-bar-container');
  if (tabName === 'explore') {
    categoryBar.style.display = 'block';
    renderExploreGrid();
  } else {
    categoryBar.style.display = 'none';
  }

  // View specific initialization
  if (tabName === 'flashcards') {
    initFlashcards();
  } else if (tabName === 'favorites') {
    renderFavoritesGrid();
  }
};

// ==========================================
// EVENT LISTENERS
// ==========================================
function setupEventListeners() {
  // Close Speech overlay
  document.getElementById('close-speech-overlay').addEventListener('click', () => {
    if (recognition && isRecording) {
      recognition.stop();
    }
    document.getElementById('speech-overlay').classList.add('hidden');
  });

  // Microphone toggle button click
  document.getElementById('mic-recording-btn').addEventListener('click', () => {
    if (!recognition) {
      alert("Voice speech recognition is not supported in this browser. Please use Chrome on Android.");
      return;
    }
    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
    }
  });

  // Flashcards flipping action
  const flashcard = document.getElementById('flashcard');
  flashcard.addEventListener('click', () => {
    isCardFlipped = !isCardFlipped;
    flashcard.classList.toggle('flipped', isCardFlipped);
  });

  // Flashcards actions
  document.getElementById('card-btn-listen').addEventListener('click', (e) => {
    e.stopPropagation();
    if (quizQueue.length > 0) {
      playAudio(quizQueue[quizIndex].id, false);
    }
  });

  document.getElementById('card-btn-listen-slow').addEventListener('click', (e) => {
    e.stopPropagation();
    if (quizQueue.length > 0) {
      playAudio(quizQueue[quizIndex].id, true);
    }
  });

  document.getElementById('card-btn-practice').addEventListener('click', (e) => {
    e.stopPropagation();
    if (quizQueue.length > 0) {
      openSpeechOverlay(quizQueue[quizIndex].id);
    }
  });

  document.getElementById('btn-got-it').addEventListener('click', () => {
    if (quizQueue.length > 0) {
      const currentCard = quizQueue[quizIndex];
      if (!mastered.includes(currentCard.id)) {
        toggleMastered(currentCard.id);
      }
      nextFlashcard();
    }
  });

  document.getElementById('btn-need-practice').addEventListener('click', () => {
    nextFlashcard();
  });
}
