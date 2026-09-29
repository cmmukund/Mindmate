import { speakAloud } from './assisted-mode.js';
import { currentPack } from './content-packs.js';
import { calculateAdherence } from './reminder-engine.js';
import { allBaselines, recentAttempts } from './adaptive-engine.js';

let recognition = null;
let isListening = false;

/* Ordered Command Definitions: Specific Commands Evaluated First */
export const VOICE_COMMAND_REGISTRY = [
  /* Highest Priority: Specific Game & Journey Launches */
  {
    id: 'start_memory_game',
    priority: 100,
    patterns: [
      'start my memory game', 'start memory game', 'play memory game', 'open memory game', 'memory game',
      'स्मृति खेल शुरू करें', 'நினைவக விளையாட்டைத் தொடங்கு', 'স্মৃতিৰ খেল আৰম্ভ কৰক',
      'ഓർമ്മ കളി തുടങ്ങുക', 'జ్ఞాపకశక్తి ఆట ప్రారంభించు', 'ನೆನಪಿನ ಆಟ ಶುರುಮಾಡು', 'memory'
    ],
    action: () => {
      if (window.showPage) window.showPage('games');
      if (window.launchGameDomain) window.launchGameDomain('memory');
      return 'Starting your Memory activity.';
    }
  },
  {
    id: 'start_attention_game',
    priority: 100,
    patterns: [
      'start my attention game', 'start attention game', 'play attention game', 'open attention game', 'attention game',
      'ध्यान खेल', 'கவன விளையாட்டு', 'মনোযোগৰ খেল', 'ശ്രദ്ധ കളി', 'శ్రద్ధ ఆట', 'ಗಮನದ ಆಟ'
    ],
    action: () => {
      if (window.showPage) window.showPage('games');
      if (window.launchGameDomain) window.launchGameDomain('attention');
      return 'Starting your Attention and Focus activity.';
    }
  },
  {
    id: 'start_routine_game',
    priority: 100,
    patterns: [
      'start my routine game', 'start routine game', 'routine recall', 'daily routine game',
      'दिनचर्या खेल', 'தினசரி வரிசை விளையாட்டு', 'ৰুটিন খেল'
    ],
    action: () => {
      if (window.showPage) window.showPage('games');
      if (window.launchGameDomain) window.launchGameDomain('routine');
      return 'Starting your Daily Routine Recall activity.';
    }
  },
  {
    id: 'start_recognition_game',
    priority: 100,
    patterns: [
      'start my recognition game', 'start recognition game', 'object recognition', 'match objects',
      'पहचान खेल', 'அடையாள விளையாட்டு', 'চিনাক্তকৰণ খেল'
    ],
    action: () => {
      if (window.showPage) window.showPage('games');
      if (window.launchGameDomain) window.launchGameDomain('recognition');
      return 'Starting your Object Recognition activity.';
    }
  },
  {
    id: 'start_engagement_game',
    priority: 100,
    patterns: [
      'start my engagement game', 'start story game', 'reflection activity', 'read a story',
      'कहानी गतिविधि', 'கதை செயல்பாடு', 'কাহিনী কাৰ্যকলাপ'
    ],
    action: () => {
      if (window.showPage) window.showPage('games');
      if (window.launchGameDomain) window.launchGameDomain('engagement');
      return 'Starting your Story and Reflection activity.';
    }
  },
  {
    id: 'start_cognitive_journey',
    priority: 95,
    patterns: [
      'start my cognitive journey', 'start cognitive journey', 'start today journey', 'begin journey', 'start journey', 'my journey',
      'मेरी यात्रा शुरू करें', 'என் பயணத்தைத் தொடங்கு', 'মোৰ যাত্ৰা আৰম্ভ কৰক', 'യാത്ര ആരംഭിക്കുക', 'ప్రయాణం ప్రారంభించండి', 'ಪ್ರಯಾಣ ಪ್ರಾರಂಭಿಸಿ'
    ],
    action: () => {
      if (window.showPage) window.showPage('journey');
      const startBtn = document.getElementById('startJourneyBtn');
      if (startBtn) startBtn.click();
      return 'Beginning your personalized 10-minute Cognitive Journey.';
    }
  },
  {
    id: 'remind_medicine',
    priority: 90,
    patterns: [
      'remind me about my medicine', 'medicine reminder', 'did i take my medicine', 'check medicine',
      'दवा का रिमाइंडर', 'மருந்து நினைவூட்டல்', 'ঔষধৰ সোঁৱৰনি'
    ],
    action: async () => {
      if (window.showPage) window.showPage('reminders');
      const adh = await calculateAdherence('medicine', 7);
      const med = adh.categories.medicine;
      if (med && med.adherenceRate !== null) {
        return `Your recent medicine adherence is ${med.adherenceRate}%. All scheduled reminders are open on your screen.`;
      }
      return 'Opening your medicine schedule and reminders.';
    }
  },
  {
    id: 'how_did_i_perform',
    priority: 85,
    patterns: [
      'how did i perform today', 'how did i do', 'how was my performance', 'show my results',
      'मैंने कैसा किया', 'நான் எப்படி செய்தேன்', 'মই কেনেকুৱা কৰিলোঁ', 'ഞാൻ എങ്ങനെ ചെയ്തു', 'నేను ఎలా చేశాను', 'ನಾನು ಹೇಗೆ ಮಾಡಿದೆ'
    ],
    action: async () => {
      if (window.showPage) window.showPage('dashboard');
      const attempts = await recentAttempts(null, 3);
      if (!attempts.length) {
        return 'You have not completed any activities yet today. Open My Journey to start!';
      }
      const avg = Math.round((attempts.reduce((acc, a) => acc + (a.accuracy || 0), 0) / attempts.length) * 100);
      return `In your recent activities, your average performance accuracy was ${avg}%. Opening your progress dashboard.`;
    }
  },
  {
    id: 'what_do_i_have_today',
    priority: 80,
    patterns: [
      'what do i have today', "what is on my schedule", "today schedule", "today routine",
      'आज क्या है', 'இன்று என்ன இருக்கிறது', 'আজি কি আছে'
    ],
    action: () => {
      if (window.showPage) window.showPage('reminders');
      return 'Here is your daily check-in and routine schedule.';
    }
  },
  {
    id: 'open_caregiver_mode',
    priority: 75,
    patterns: [
      'open caregiver mode', 'caregiver dashboard', 'caregiver mode', 'caregiver view',
      'केयरगिवर मोड', 'பராமரிப்பாளர் முறை', 'যত্নদাতা ড্যাশব’ৰ্ড'
    ],
    action: () => {
      if (window.showPage) window.showPage('caregiver');
      return 'Opening Caregiver Dashboard.';
    }
  },
  {
    id: 'open_health_worker_mode',
    priority: 75,
    patterns: [
      'open health worker mode', 'health worker dashboard', 'health worker view', 'health worker',
      'स्वास्थ्य कार्यकर्ता', 'சுகாதாரப் பணியாளர்', 'স্বাস্থ্য কৰ্মী'
    ],
    action: () => {
      if (window.showPage) window.showPage('healthworker');
      return 'Opening Health Worker View.';
    }
  },

  /* Lower Priority: Generic Navigation & Information */
  {
    id: 'show_reminders',
    priority: 50,
    patterns: ['show my reminders', 'show reminders', 'open reminders', 'reminders', 'reminder', 'रिमाइंडर', 'நினைவூட்டல்', 'সোঁৱৰনি'],
    action: () => {
      if (window.showPage) window.showPage('reminders');
      return 'Here are your reminders.';
    }
  },
  {
    id: 'open_progress',
    priority: 50,
    patterns: ['open my progress', 'my progress', 'progress', 'dashboard', 'प्रगति', 'முன்னேற்றம்', 'অগ্ৰগতি', 'score'],
    action: () => {
      if (window.showPage) window.showPage('dashboard');
      return 'Opening your progress dashboard.';
    }
  },
  {
    id: 'show_games',
    priority: 45,
    patterns: ['brain games', 'open games', 'games', 'game', 'खेल', 'விளையாட்டு', 'খেল'],
    action: () => {
      if (window.showPage) window.showPage('games');
      return 'Here are your 5 cognitive activities.';
    }
  },
  {
    id: 'navigate_home',
    priority: 40,
    patterns: ['home', 'go home', 'main menu', 'घर', 'முகப்பு', 'ঘৰ'],
    action: () => {
      if (window.showPage) window.showPage('home');
      return 'Returned to Home.';
    }
  },
  {
    id: 'greeting',
    priority: 30,
    patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'नमस्ते', 'வணக்கம்', 'নমস্কাৰ'],
    action: () => {
      return 'Hello! I am your MINDMATE guide. How can I assist your day?';
    }
  },
  {
    id: 'check_time',
    priority: 25,
    patterns: ['what time is it', 'time', 'समय', 'நேரம்', 'সময়'],
    action: () => {
      const now = new Date();
      return `The current time is ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`;
    }
  },
  {
    id: 'help',
    priority: 10,
    patterns: ['help', 'what can you do', 'मदद', 'உதவி', 'সহায়'],
    action: () => {
      return 'You can say: "Start my cognitive journey", "Start my memory game", "Show my reminders", or "How did I perform today?".';
    }
  }
];

// Sort registry by priority descending
VOICE_COMMAND_REGISTRY.sort((a, b) => b.priority - a.priority);

/**
 * Execute parsed voice command with strict priority evaluation.
 */
export async function executeVoiceCommand(inputTranscript) {
  const clean = (inputTranscript || '').toLowerCase().trim();
  if (!clean) return { reply: 'I did not catch that. Please try speaking again.' };

  for (const cmd of VOICE_COMMAND_REGISTRY) {
    for (const pat of cmd.patterns) {
      const p = pat.toLowerCase();
      // Match exact or starts-with or whole-phrase boundary
      if (clean === p || clean.includes(p)) {
        const reply = await cmd.action();
        speakAloud(reply, true);
        return { matchedCommand: cmd.id, reply };
      }
    }
  }

  const fallback = 'I heard you, but I am not sure what you would like to do. Try saying "Start journey" or "Show reminders".';
  speakAloud(fallback, true);
  return { matchedCommand: null, reply: fallback };
}

/**
 * Speech Recognition Listener
 */
export function startVoiceListening(onResult, onStatusChange) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    if (onStatusChange) onStatusChange('Speech recognition not supported in this browser.');
    return null;
  }

  if (isListening && recognition) {
    try { recognition.stop(); } catch (e) {}
    isListening = false;
    if (onStatusChange) onStatusChange('Stopped listening.');
    return null;
  }

  recognition = new SpeechRecognition();
  const pack = currentPack();
  recognition.lang = pack.speechLang || 'en-IN';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    isListening = true;
    if (onStatusChange) onStatusChange('Listening...');
  };

  recognition.onresult = async (event) => {
    const text = event.results[0][0].transcript;
    if (onStatusChange) onStatusChange(`Processing: "${text}"`);
    const result = await executeVoiceCommand(text);
    if (onResult) onResult(text, result.reply);
  };

  recognition.onerror = (e) => {
    isListening = false;
    if (onStatusChange) onStatusChange(`Voice error: ${e.error}`);
  };

  recognition.onend = () => {
    isListening = false;
    if (onStatusChange) onStatusChange('Idle');
  };

  try {
    recognition.start();
  } catch (err) {
    console.warn('Speech start error:', err);
  }

  return recognition;
}
