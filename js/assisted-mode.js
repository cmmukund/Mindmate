import { currentPack } from './content-packs.js';

let isAssistedMode = localStorage.getItem('mindmateAssistedMode') === 'true';
let lastSpokenText = '';

export function isAssistedModeActive() {
  return isAssistedMode;
}

export function setAssistedMode(enabled) {
  isAssistedMode = Boolean(enabled);
  localStorage.setItem('mindmateAssistedMode', String(isAssistedMode));

  if (isAssistedMode) {
    document.body.classList.add('assisted-mode-active');
    speakAloud('Assisted mode enabled. Spoken instructions and larger buttons are active.');
  } else {
    document.body.classList.remove('assisted-mode-active');
  }

  updateAssistedUI();
  window.dispatchEvent(new CustomEvent('mindmate:assistedModeChanged', { detail: { enabled: isAssistedMode } }));
}

export function toggleAssistedMode() {
  setAssistedMode(!isAssistedMode);
  return isAssistedMode;
}

export function speakAloud(text, force = false) {
  if (!text) return;
  lastSpokenText = text;

  // Only auto-speak in Assisted Mode unless explicitly forced
  if (!isAssistedMode && !force) return;

  if (!('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech
    const utterance = new SpeechSynthesisUtterance(text);
    const pack = currentPack();
    utterance.lang = pack.speechLang || 'en-IN';
    utterance.rate = 0.88; // Slightly slower, clearer pacing for elderly users
    utterance.pitch = 1.0;

    // Try finding matching voice
    const voices = window.speechSynthesis.getVoices();
    if (voices.length) {
      const prefix = (pack.speechLang || 'en').split('-')[0].toLowerCase();
      const match = voices.find((v) => v.lang.toLowerCase().startsWith(prefix));
      if (match) utterance.voice = match;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
}

export function repeatLastInstruction() {
  if (lastSpokenText) {
    speakAloud(lastSpokenText, true);
  } else {
    speakAloud('Select an activity from the screen to begin.', true);
  }
}

function updateAssistedUI() {
  const toggleBtn = document.getElementById('assistedModeToggleBtn');
  if (toggleBtn) {
    toggleBtn.textContent = isAssistedMode ? '🧓 Assisted Mode: ON' : '🧓 Assisted Mode: OFF';
    toggleBtn.classList.toggle('active-mode', isAssistedMode);
  }
}

export function initAssistedMode() {
  if (isAssistedMode) {
    document.body.classList.add('assisted-mode-active');
  }
  updateAssistedUI();

  // Floating replay button for elderly audio assistance
  if (!document.getElementById('floatingReplayAudioBtn')) {
    const replayBtn = document.createElement('button');
    replayBtn.id = 'floatingReplayAudioBtn';
    replayBtn.className = 'floating-audio-replay-btn';
    replayBtn.type = 'button';
    replayBtn.title = 'Repeat voice instruction';
    replayBtn.setAttribute('aria-label', 'Repeat instruction aloud');
    replayBtn.innerHTML = '🔊 <span>Repeat</span>';
    replayBtn.onclick = () => repeatLastInstruction();
    document.body.appendChild(replayBtn);
  }
}
