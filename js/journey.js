import { recommend, recordAttempt, allBaselines } from './adaptive-engine.js';
import { currentPack } from './content-packs.js';
import { speakAloud } from './assisted-mode.js';

const DOMAIN_ICONS = {
  memory: '🧠',
  attention: '🎯',
  routine: '🗓️',
  recognition: '🧩',
  engagement: '💬'
};

let plan = [];
let currentIndex = 0;
let currentStep = null;
let stepStartTime = 0;

const $ = (id) => document.getElementById(id);

export async function initJourney() {
  const pack = currentPack();
  const domains = ['memory', 'attention', 'routine', 'recognition', 'engagement'];

  // Query adaptive engine recommendations for each domain
  const recommendations = {};
  for (const d of domains) {
    recommendations[d] = await recommend(d);
  }

  // Build the personalized journey plan
  plan = domains.map((d, idx) => ({
    order: idx + 1,
    domain: d,
    title: pack.domainTitles[d] || d.toUpperCase(),
    icon: DOMAIN_ICONS[d] || '🧠',
    difficulty: recommendations[d].difficulty,
    minutes: 2,
    reason: recommendations[d].reason,
    completed: false
  }));

  renderJourneyOverview();
  renderBaselines();

  const startBtn = $('startJourneyBtn');
  if (startBtn) startBtn.onclick = startJourney;

  const submitBtn = $('submitTaskBtn');
  if (submitBtn) submitBtn.onclick = submitCurrentTask;

  const skipBtn = $('skipTaskBtn');
  if (skipBtn) skipBtn.onclick = () => finishCurrentTask(false, true);
}

function renderJourneyOverview() {
  const pack = currentPack();
  const planContainer = $('journeyPlan');
  if (!planContainer) return;

  planContainer.replaceChildren();

  plan.forEach((item, i) => {
    const card = document.createElement('article');
    card.className = `action-card journey-card ${item.completed ? 'journey-step-done' : ''}`;

    const head = document.createElement('h3');
    head.textContent = `${String(i + 1).padStart(2, '0')} ${item.icon} ${item.title}`;

    const sub = document.createElement('p');
    sub.textContent = `Level ${item.difficulty} · ~${item.minutes} min`;

    const reason = document.createElement('span');
    reason.className = 'journey-reason';
    reason.textContent = item.reason;

    card.append(head, sub, reason);
    planContainer.appendChild(card);
  });
}

export async function startJourney() {
  currentIndex = 0;
  await initJourney();

  const sessionPanel = $('journeySession');
  if (sessionPanel) {
    sessionPanel.hidden = false;
    sessionPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  loadJourneyTask();
}

function loadJourneyTask() {
  currentStep = plan[currentIndex];
  stepStartTime = performance.now();
  const pack = currentPack();

  $('sessionCategory').textContent = currentStep.title.toUpperCase();
  $('sessionTitle').textContent = `${currentStep.icon} ${currentStep.title} (Level ${currentStep.difficulty})`;
  $('sessionStep').textContent = `${currentIndex + 1} / ${plan.length}`;
  $('adaptationInsight').hidden = true;
  $('submitTaskBtn').disabled = false;
  $('skipTaskBtn').textContent = 'Skip';

  renderJourneyTaskUI();
}

function renderJourneyTaskUI() {
  const area = $('taskArea');
  if (!area) return;
  area.replaceChildren();

  const diff = currentStep.difficulty;
  const pack = currentPack();
  const domain = currentStep.domain;

  /* ===================== MEMORY ===================== */
  if (domain === 'memory') {
    const n = Math.min(3 + diff, 7);
    const seq = Array.from({ length: n }, () => Math.floor(Math.random() * 9) + 1);
    currentStep.answer = seq.join('');

    const instruction = document.createElement('p');
    instruction.className = 'game-instruction';
    instruction.textContent = 'Remember the number sequence, then type it below.';
    speakAloud(instruction.textContent);

    const seqDisplay = document.createElement('div');
    seqDisplay.className = 'sequence';
    seqDisplay.textContent = seq.join('   ');

    const input = document.createElement('input');
    input.id = 'journeyInput';
    input.className = 'journey-input-large';
    input.placeholder = 'Enter sequence';
    input.type = 'number';
    input.autocomplete = 'off';

    area.append(instruction, seqDisplay, input);

    // Hide sequence after timer
    setTimeout(() => {
      seqDisplay.textContent = Array(n).fill('?').join('   ');
      input.focus();
    }, Math.max(1800, 3600 - diff * 300));
  }

  /* ===================== ATTENTION ===================== */
  else if (domain === 'attention') {
    const targetObj = pack.objects[Math.floor(Math.random() * pack.objects.length)];
    currentStep.answer = targetObj.name;

    const instruction = document.createElement('p');
    instruction.className = 'game-instruction';
    instruction.textContent = `Visual Focus: Tap the matching "${targetObj.name}" (${targetObj.icon}).`;
    speakAloud(instruction.textContent);

    const grid = document.createElement('div');
    grid.className = 'attention-grid';

    const tiles = [targetObj];
    const others = pack.objects.filter((o) => o.name !== targetObj.name);
    while (tiles.length < 8) {
      tiles.push(others[Math.floor(Math.random() * others.length)]);
    }
    tiles.sort(() => Math.random() - 0.5);

    tiles.forEach((t) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn secondary attention-tile';
      btn.textContent = `${t.icon} ${t.name}`;
      btn.onclick = () => {
        grid.querySelectorAll('button').forEach((b) => b.classList.remove('selected'));
        btn.classList.add('selected');
        currentStep.userSelection = t.name;
      };
      grid.appendChild(btn);
    });

    area.append(instruction, grid);
  }

  /* ===================== ROUTINE RECALL ===================== */
  else if (domain === 'routine') {
    const stepIdx = Math.min(diff - 1, pack.routine.length - 2);
    const curr = pack.routine[stepIdx];
    const next = pack.routine[stepIdx + 1];
    currentStep.answer = next.title;

    const instruction = document.createElement('p');
    instruction.className = 'game-instruction';
    instruction.textContent = `Daily Routine: After "${curr.title}", what comes next?`;
    speakAloud(instruction.textContent);

    const banner = document.createElement('div');
    banner.className = 'sequence';
    banner.textContent = `${curr.icon} ${curr.title} ➔ ❓`;

    const choiceRow = document.createElement('div');
    choiceRow.className = 'choice-grid';

    const options = [...pack.routine].sort(() => Math.random() - 0.5);
    options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn secondary';
      btn.textContent = `${opt.icon} ${opt.title}`;
      btn.onclick = () => {
        choiceRow.querySelectorAll('button').forEach((b) => b.classList.remove('selected'));
        btn.classList.add('selected');
        currentStep.userSelection = opt.title;
      };
      choiceRow.appendChild(btn);
    });

    area.append(instruction, banner, choiceRow);
  }

  /* ===================== RECOGNITION ===================== */
  else if (domain === 'recognition') {
    const target = pack.objects[(diff - 1) % pack.objects.length];
    currentStep.answer = target.name;

    const instruction = document.createElement('p');
    instruction.className = 'game-instruction';
    instruction.textContent = 'Object Match: Tap the item that matches the picture above.';
    speakAloud(instruction.textContent);

    const showcase = document.createElement('div');
    showcase.className = 'recognition-target';
    showcase.textContent = `${target.icon} ${target.name}`;

    const choiceRow = document.createElement('div');
    choiceRow.className = 'choice-grid';

    const options = [...pack.objects].sort(() => Math.random() - 0.5);
    options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn secondary';
      btn.textContent = `${opt.icon} ${opt.name}`;
      btn.onclick = () => {
        choiceRow.querySelectorAll('button').forEach((b) => b.classList.remove('selected'));
        btn.classList.add('selected');
        currentStep.userSelection = opt.name;
      };
      choiceRow.appendChild(btn);
    });

    area.append(instruction, showcase, choiceRow);
  }

  /* ===================== ENGAGEMENT ===================== */
  else if (domain === 'engagement') {
    const instruction = document.createElement('p');
    instruction.className = 'game-instruction';
    instruction.textContent = pack.story.text;
    speakAloud(instruction.textContent);

    const subPrompt = document.createElement('p');
    subPrompt.className = 'panel-sub';
    subPrompt.textContent = 'How does this story feel to you today?';

    const choiceRow = document.createElement('div');
    choiceRow.className = 'choice-grid';

    pack.moodChoices.forEach((m) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn secondary';
      btn.textContent = `${m.icon} ${m.label}`;
      btn.onclick = () => {
        choiceRow.querySelectorAll('button').forEach((b) => b.classList.remove('selected'));
        btn.classList.add('selected');
        currentStep.userSelection = m.label;
      };
      choiceRow.appendChild(btn);
    });

    currentStep.answer = null; // Engagement always accepts user's personal reflection
    area.append(instruction, subPrompt, choiceRow);
  }
}

async function submitCurrentTask() {
  if (!currentStep) return;

  let userInput = '';
  if (currentStep.domain === 'memory') {
    userInput = ($('journeyInput')?.value || '').trim();
  } else {
    userInput = currentStep.userSelection || '';
  }

  const isEngagement = currentStep.domain === 'engagement';
  const isCorrect = isEngagement ? true : normalize(userInput) === normalize(currentStep.answer);

  finishCurrentTask(isCorrect, false);
}

function normalize(str) {
  return String(str || '').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '').trim();
}

async function finishCurrentTask(isCorrect, isSkipped) {
  const durationMs = Math.max(300, Math.round(performance.now() - stepStartTime));
  const accuracy = isSkipped ? 0 : isCorrect ? 1 : 0;

  // Record telemetry in IndexedDB
  await recordAttempt({
    gameId: `journey-${currentStep.domain}`,
    category: currentStep.domain,
    difficulty: currentStep.difficulty,
    accuracy,
    responseTimeMs: durationMs,
    retries: isSkipped ? 1 : 0,
    hints: 0,
    completionStatus: isSkipped ? 'skipped' : isCorrect ? 'completed' : 'incorrect'
  });

  currentStep.completed = true;

  // Fetch explainable adaptive decision for next session
  const nextRec = await recommend(currentStep.domain);

  const insight = $('adaptationInsight');
  if (insight) {
    insight.hidden = false;
    insight.replaceChildren();

    const titleStrong = document.createElement('strong');
    titleStrong.textContent = `Adaptive Personalization: Level ${currentStep.difficulty} ➔ Level ${nextRec.difficulty}`;

    const reasonSpan = document.createElement('span');
    reasonSpan.textContent = ` · ${nextRec.reason}`;

    insight.append(titleStrong, reasonSpan);
  }

  if (currentIndex < plan.length - 1) {
    currentIndex++;
    setTimeout(() => {
      loadJourneyTask();
      renderJourneyOverview();
    }, 1200);
  } else {
    // Journey Complete
    $('sessionTitle').textContent = '🎉 Journey Complete!';
    $('sessionInstruction').textContent = 'All 5 daily activities completed. Your telemetry has been saved locally and queued for synchronization.';
    $('submitTaskBtn').disabled = true;
    $('skipTaskBtn').textContent = 'Done';
    $('skipTaskBtn').onclick = () => {
      $('journeySession').hidden = true;
    };
    renderJourneyOverview();
    renderBaselines();
    speakAloud('Congratulations! You have completed today’s cognitive journey.');
  }
}

async function renderBaselines() {
  const container = $('healthMetrics');
  if (!container) return;

  const baselines = await allBaselines();
  const pack = currentPack();
  container.replaceChildren();

  Object.entries(baselines).forEach(([domain, data]) => {
    const card = document.createElement('div');
    card.className = 'metric';

    const label = document.createElement('div');
    label.className = 'metric-label';
    label.textContent = `${DOMAIN_ICONS[domain] || '🧠'} ${pack.domainTitles[domain] || domain}`;

    const stat = document.createElement('p');
    stat.className = 'stat';
    stat.textContent = data.established ? `${Math.round(data.score * 100)}%` : '—';

    const sub = document.createElement('small');
    sub.textContent = data.established
      ? `Baseline established (${data.sampleSize} sessions)`
      : `Needs ${data.requiredSize - data.sampleSize} more session(s)`;

    card.append(label, stat, sub);
    container.appendChild(card);
  });
}

window.addEventListener('mindmate:languageChanged', () => {
  initJourney().catch(() => {});
});
