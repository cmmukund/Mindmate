import { currentPack } from './content-packs.js';
import { recommend, recordAttempt } from './adaptive-engine.js';
import { speakAloud } from './assisted-mode.js';

let activeGame = null;
let startTime = 0;
let attemptsCount = 0;
let hintsUsed = 0;

/**
 * Launch an interactive cognitive game for one of the 5 domains.
 */
export async function launchGame(domain, targetElementId = 'gamePlayArea') {
  const container = document.getElementById(targetElementId);
  if (!container) return;

  const rec = await recommend(domain);
  const diff = rec.difficulty;
  const pack = currentPack();

  startTime = performance.now();
  attemptsCount = 0;
  hintsUsed = 0;

  activeGame = {
    domain,
    difficulty: diff,
    targetElementId,
    correctAnswer: null,
    userSelection: null,
    mistakes: 0,
    startTime
  };

  container.replaceChildren();

  // Create Header with Category & Difficulty Level
  const header = document.createElement('div');
  header.className = 'game-header-bar';

  const badge = document.createElement('span');
  badge.className = 'goal';
  badge.textContent = `${pack.domainTitles[domain] || domain.toUpperCase()} · LEVEL ${diff}`;

  const explainP = document.createElement('p');
  explainP.className = 'adaptive-note';
  explainP.textContent = rec.reason;

  header.append(badge, explainP);
  container.appendChild(header);

  // Render specific game interface
  const stage = document.createElement('div');
  stage.className = 'game-stage';
  container.appendChild(stage);

  switch (domain) {
    case 'memory':
      renderMemoryGame(stage, diff, pack);
      break;
    case 'attention':
      renderAttentionGame(stage, diff, pack);
      break;
    case 'routine':
      renderRoutineGame(stage, diff, pack);
      break;
    case 'recognition':
      renderRecognitionGame(stage, diff, pack);
      break;
    case 'engagement':
      renderEngagementGame(stage, diff, pack);
      break;
    default:
      renderMemoryGame(stage, diff, pack);
  }
}

/* =========================================================================
   DOMAIN 1: MEMORY (Sequence Recall & Delayed Card Memory)
   ========================================================================= */
function renderMemoryGame(stage, difficulty, pack) {
  const instr = document.createElement('p');
  instr.className = 'game-instruction';
  instr.textContent = 'Remember the sequence, then repeat it in the exact order.';
  speakAloud(instr.textContent);

  // Difficulty scales sequence length from 3 digits (Level 1) to 7 digits (Level 5)
  const length = Math.min(3 + difficulty, 7);
  const sequence = Array.from({ length }, () => Math.floor(Math.random() * 9) + 1);
  activeGame.correctAnswer = sequence.join('');

  const displayBox = document.createElement('div');
  displayBox.className = 'sequence-display';
  displayBox.textContent = sequence.join('   ');

  const timerNote = document.createElement('div');
  timerNote.className = 'timer-subnote';
  timerNote.textContent = 'Memorize the numbers...';

  const inputArea = document.createElement('div');
  inputArea.className = 'game-input-container';
  inputArea.style.display = 'none';

  const prompt = document.createElement('label');
  prompt.textContent = 'Enter the numbers in order:';
  prompt.className = 'input-label-large';

  const keypad = document.createElement('div');
  keypad.className = 'elder-keypad';

  const answerDisplay = document.createElement('div');
  answerDisplay.className = 'keypad-display';
  answerDisplay.textContent = '—';

  let currentInput = '';

  for (let i = 1; i <= 9; i++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn secondary keypad-btn';
    btn.textContent = String(i);
    btn.onclick = () => {
      if (currentInput.length < length) {
        currentInput += String(i);
        answerDisplay.textContent = currentInput;
      }
    };
    keypad.appendChild(btn);
  }

  const clearBtn = document.createElement('button');
  clearBtn.type = 'button';
  clearBtn.className = 'btn orange keypad-btn';
  clearBtn.textContent = '⌫';
  clearBtn.onclick = () => {
    currentInput = currentInput.slice(0, -1);
    answerDisplay.textContent = currentInput || '—';
  };
  keypad.appendChild(clearBtn);

  const checkBtn = document.createElement('button');
  checkBtn.type = 'button';
  checkBtn.className = 'btn green keypad-btn submit-btn-elder';
  checkBtn.textContent = '✓ Check';
  checkBtn.onclick = () => {
    activeGame.userSelection = currentInput;
    const isCorrect = currentInput === activeGame.correctAnswer;
    handleGameCompletion(isCorrect, isCorrect ? 1 : 0);
  };
  keypad.appendChild(checkBtn);

  inputArea.append(prompt, answerDisplay, keypad);
  stage.append(instr, displayBox, timerNote, inputArea);

  // Reveal countdown based on difficulty
  const memorizationMs = Math.max(2000, 4500 - difficulty * 400);
  setTimeout(() => {
    displayBox.textContent = Array(length).fill('?').join('   ');
    timerNote.textContent = 'Now enter the numbers:';
    inputArea.style.display = 'block';
  }, memorizationMs);
}

/* =========================================================================
   DOMAIN 2: ATTENTION (Visual Search & Distraction Filtering)
   ========================================================================= */
function renderAttentionGame(stage, difficulty, pack) {
  const targetSymbol = pack.objects[Math.floor(Math.random() * pack.objects.length)];
  activeGame.correctAnswer = targetSymbol.id;

  const instr = document.createElement('p');
  instr.className = 'game-instruction';
  instr.textContent = `Visual Search: Find and tap every "${targetSymbol.name}" (${targetSymbol.icon})!`;
  speakAloud(instr.textContent);

  // Grid size and distractors scale with difficulty (Level 1: 9 tiles, Level 5: 25 tiles)
  const totalTiles = difficulty <= 2 ? 9 : difficulty <= 4 ? 16 : 25;
  const targetCount = Math.max(1, Math.min(3, Math.floor(difficulty / 2) + 1));

  let tiles = [];
  for (let i = 0; i < targetCount; i++) {
    tiles.push({ ...targetSymbol, isTarget: true });
  }

  const otherObjects = pack.objects.filter((o) => o.id !== targetSymbol.id);
  while (tiles.length < totalTiles) {
    const distractor = otherObjects[Math.floor(Math.random() * otherObjects.length)];
    tiles.push({ ...distractor, isTarget: false });
  }

  // Shuffle tiles
  tiles = tiles.sort(() => Math.random() - 0.5);

  const grid = document.createElement('div');
  grid.className = `attention-matrix grid-${totalTiles}`;

  let targetsFound = 0;
  let falseTaps = 0;

  tiles.forEach((item, idx) => {
    const tileBtn = document.createElement('button');
    tileBtn.type = 'button';
    tileBtn.className = 'attention-tile-card';
    tileBtn.setAttribute('aria-label', item.name);

    const iconSpan = document.createElement('span');
    iconSpan.className = 'tile-icon';
    iconSpan.textContent = item.icon;

    const labelSpan = document.createElement('span');
    labelSpan.className = 'tile-label';
    labelSpan.textContent = item.name;

    tileBtn.append(iconSpan, labelSpan);

    tileBtn.onclick = () => {
      if (tileBtn.disabled) return;
      tileBtn.disabled = true;

      if (item.isTarget) {
        tileBtn.classList.add('found-correct');
        targetsFound++;
        if (targetsFound >= targetCount) {
          const accuracy = Math.max(0, 1 - falseTaps * 0.25);
          handleGameCompletion(true, accuracy);
        }
      } else {
        tileBtn.classList.add('found-wrong');
        falseTaps++;
        activeGame.mistakes++;
        attemptsCount++;
      }
    };
    grid.appendChild(tileBtn);
  });

  const statusNote = document.createElement('div');
  statusNote.className = 'attention-counter';
  statusNote.textContent = `Targets to find: ${targetCount}`;

  stage.append(instr, statusNote, grid);
}

/* =========================================================================
   DOMAIN 3: ROUTINE RECALL ("What Comes Next in Your Day?")
   ========================================================================= */
function renderRoutineGame(stage, difficulty, pack) {
  const routine = pack.routine;
  // Pick an anchor step based on difficulty
  const stepIdx = Math.floor(Math.random() * (routine.length - 1));
  const currentStep = routine[stepIdx];
  const nextStep = routine[stepIdx + 1];

  activeGame.correctAnswer = nextStep.title;

  const instr = document.createElement('p');
  instr.className = 'game-instruction';
  instr.textContent = 'Daily Routine Recall: What activity comes next in this routine?';
  speakAloud(instr.textContent);

  const sequenceFlow = document.createElement('div');
  sequenceFlow.className = 'routine-flow-card';

  const anchorBox = document.createElement('div');
  anchorBox.className = 'routine-step active-step';
  anchorBox.textContent = `${currentStep.icon} ${currentStep.title}`;

  const arrow = document.createElement('div');
  arrow.className = 'routine-arrow';
  arrow.textContent = '➔';

  const targetBox = document.createElement('div');
  targetBox.className = 'routine-step question-step';
  targetBox.textContent = '❓ What comes next?';

  sequenceFlow.append(anchorBox, arrow, targetBox);

  // Present choices
  const choiceGrid = document.createElement('div');
  choiceGrid.className = 'elder-choice-grid';

  const options = [...routine].sort(() => Math.random() - 0.5);

  options.forEach((opt) => {
    const optBtn = document.createElement('button');
    optBtn.type = 'button';
    optBtn.className = 'btn secondary elder-choice-btn';
    optBtn.textContent = `${opt.icon} ${opt.title}`;

    optBtn.onclick = () => {
      choiceGrid.querySelectorAll('button').forEach((b) => b.classList.remove('selected'));
      optBtn.classList.add('selected');
      activeGame.userSelection = opt.title;

      const isCorrect = opt.title === activeGame.correctAnswer;
      setTimeout(() => {
        handleGameCompletion(isCorrect, isCorrect ? 1 : 0);
      }, 400);
    };
    choiceGrid.appendChild(optBtn);
  });

  stage.append(instr, sequenceFlow, choiceGrid);
}

/* =========================================================================
   DOMAIN 4: PATTERN / OBJECT RECOGNITION (Culturally Familiar Match)
   ========================================================================= */
function renderRecognitionGame(stage, difficulty, pack) {
  const target = pack.objects[Math.floor(Math.random() * pack.objects.length)];
  activeGame.correctAnswer = target.id;

  const instr = document.createElement('p');
  instr.className = 'game-instruction';
  instr.textContent = 'Recognition: Look closely at the shown object and match it below.';
  speakAloud(instr.textContent);

  const displayCard = document.createElement('div');
  displayCard.className = 'recognition-showcase';

  const iconEl = document.createElement('div');
  iconEl.className = 'showcase-icon';
  iconEl.textContent = target.icon;

  const nameEl = document.createElement('div');
  nameEl.className = 'showcase-name';
  nameEl.textContent = target.name;

  displayCard.append(iconEl, nameEl);

  const choiceGrid = document.createElement('div');
  choiceGrid.className = 'elder-choice-grid';

  // Shuffle available choices
  const choices = [...pack.objects].sort(() => Math.random() - 0.5);

  choices.forEach((item) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn secondary elder-choice-btn';
    btn.textContent = `${item.icon} ${item.name}`;

    btn.onclick = () => {
      const isCorrect = item.id === activeGame.correctAnswer;
      btn.classList.add(isCorrect ? 'btn-success' : 'btn-error');
      setTimeout(() => {
        handleGameCompletion(isCorrect, isCorrect ? 1 : 0);
      }, 400);
    };
    choiceGrid.appendChild(btn);
  });

  stage.append(instr, displayCard, choiceGrid);
}

/* =========================================================================
   DOMAIN 5: MENTAL & EMOTIONAL ENGAGEMENT (Story & Mood Check-In)
   ========================================================================= */
function renderEngagementGame(stage, difficulty, pack) {
  const story = pack.story;

  const instr = document.createElement('p');
  instr.className = 'game-instruction';
  instr.textContent = 'Story & Reflection: Read the short story and answer a warm question.';
  speakAloud(instr.textContent);

  const storyBox = document.createElement('article');
  storyBox.className = 'story-card-elder';

  const storyTitle = document.createElement('h3');
  storyTitle.textContent = story.title;

  const storyBody = document.createElement('p');
  storyBody.textContent = story.text;

  storyBox.append(storyTitle, storyBody);

  const questionBox = document.createElement('div');
  questionBox.className = 'story-question-box';

  const qLabel = document.createElement('strong');
  qLabel.textContent = `Question: ${story.question}`;

  const choicesContainer = document.createElement('div');
  choicesContainer.className = 'elder-choice-grid';

  story.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn secondary elder-choice-btn';
    btn.textContent = opt;

    btn.onclick = () => {
      const isCorrect = idx === story.correctIndex;
      btn.classList.add(isCorrect ? 'btn-success' : 'btn-error');

      // Prompt mood check-in after story
      setTimeout(() => {
        renderMoodFollowup(stage, pack);
      }, 500);
    };
    choicesContainer.appendChild(btn);
  });

  questionBox.append(qLabel, choicesContainer);
  stage.append(instr, storyBox, questionBox);
}

function renderMoodFollowup(stage, pack) {
  stage.replaceChildren();

  const title = document.createElement('h3');
  title.className = 'mood-title';
  title.textContent = 'How are you feeling right now?';

  const grid = document.createElement('div');
  grid.className = 'elder-choice-grid';

  pack.moodChoices.forEach((m) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn secondary elder-choice-btn';
    btn.textContent = `${m.icon} ${m.label}`;

    btn.onclick = () => {
      handleGameCompletion(true, 1, { mood: m.label });
    };
    grid.appendChild(btn);
  });

  stage.append(title, grid);
}

/* =========================================================================
   COMPLETION & EXPLAINABLE FEEDBACK HANDLER
   ========================================================================= */
async function handleGameCompletion(isSuccess, accuracyScore = 1, metadata = {}) {
  const responseTime = Math.max(300, Math.round(performance.now() - startTime));
  const record = await recordAttempt({
    category: activeGame.domain,
    difficulty: activeGame.difficulty,
    accuracy: accuracyScore,
    responseTimeMs: responseTime,
    retries: attemptsCount,
    hints: hintsUsed,
    completionStatus: isSuccess ? 'completed' : 'incorrect',
    metadata
  });

  const nextRec = await recommend(activeGame.domain);
  const container = document.getElementById(activeGame.targetElementId);
  if (!container) return;

  container.replaceChildren();

  const resultCard = document.createElement('div');
  resultCard.className = 'game-result-panel';

  const iconDiv = document.createElement('div');
  iconDiv.className = 'result-icon-large';
  iconDiv.textContent = isSuccess ? '🎉' : '🌱';

  const title = document.createElement('h2');
  title.textContent = isSuccess ? 'Well Done!' : 'Activity Completed';

  const statsRow = document.createElement('div');
  statsRow.className = 'result-stats-row';

  const stat1 = document.createElement('div');
  stat1.innerHTML = `<strong>Accuracy</strong><p>${Math.round(accuracyScore * 100)}%</p>`;

  const stat2 = document.createElement('div');
  stat2.innerHTML = `<strong>Response Time</strong><p>${(responseTime / 1000).toFixed(1)}s</p>`;

  const stat3 = document.createElement('div');
  stat3.innerHTML = `<strong>Level</strong><p>${activeGame.difficulty}</p>`;

  statsRow.append(stat1, stat2, stat3);

  // Explainable adaptive-personalization box
  const explainBox = document.createElement('div');
  explainBox.className = 'insight adaptive-explanation-box';

  const explainHead = document.createElement('strong');
  explainHead.textContent = `Adaptive Personalization: Level ${activeGame.difficulty} ➔ Level ${nextRec.difficulty}`;

  const explainBody = document.createElement('p');
  explainBody.textContent = `Reason: ${nextRec.reason}`;

  explainBox.append(explainHead, explainBody);

  // Action Buttons
  const actions = document.createElement('div');
  actions.className = 'game-actions';

  const playAgain = document.createElement('button');
  playAgain.className = 'btn large';
  playAgain.textContent = 'Play Again';
  playAgain.onclick = () => launchGame(activeGame.domain, activeGame.targetElementId);

  const backBtn = document.createElement('button');
  backBtn.className = 'btn secondary large';
  backBtn.textContent = 'All Games';
  backBtn.onclick = () => {
    if (window.showGamesCatalog) window.showGamesCatalog();
  };

  actions.append(playAgain, backBtn);
  resultCard.append(iconDiv, title, statsRow, explainBox, actions);
  container.appendChild(resultCard);

  speakAloud(`${title.textContent}. ${nextRec.reason}`);
}
