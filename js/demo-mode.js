import { setOfflineSimulation, syncNow, queueCount } from './sync-queue.js';
import { recordAttempt, recommend, baseline } from './adaptive-engine.js';
import { setReminderStatus, REMINDER_STATES, getReminders } from './reminder-engine.js';
import { refreshAllDashboards } from './dashboards.js';
import { speakAloud } from './assisted-mode.js';
import { resetAllData } from './storage.js';
import { seedReminders } from './reminder-engine.js';

let currentDemoStep = 1;
const TOTAL_STEPS = 6;

export function openDemoRunner() {
  currentDemoStep = 1;
  let modal = document.getElementById('competitionDemoModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'competitionDemoModal';
    modal.className = 'demo-runner-modal';
    document.body.appendChild(modal);
  }
  modal.style.display = 'block';
  renderDemoStep();
}

async function resetDemoState() {
  setOfflineSimulation(false);
  await resetAllData();
  await seedReminders();
  await refreshAllDashboards();
}

export function closeDemoRunner() {
  const modal = document.getElementById('competitionDemoModal');
  if (modal) modal.style.display = 'none';
}

async function renderDemoStep() {
  const modal = document.getElementById('competitionDemoModal');
  if (!modal) return;
  modal.replaceChildren();

  const card = document.createElement('div');
  card.className = 'demo-runner-card';

  const badge = document.createElement('div');
  badge.className = 'demo-badge';
  badge.textContent = `🏆 Competition Prototype Tour · Step ${currentDemoStep} of ${TOTAL_STEPS}`;

  const title = document.createElement('h3');
  const desc = document.createElement('p');
  const actionArea = document.createElement('div');
  actionArea.className = 'demo-step-actions';

  switch (currentDemoStep) {
    case 1:
      title.textContent = 'Step 1: Patient Home & Cognitive Journey';
      desc.textContent = 'MINDMATE welcomes the elderly user with clean contrast, routine check-ins, and a 10-minute multi-domain daily journey.';
      if (window.showPage) window.showPage('journey');
      speakAloud('Step 1: Good morning. Welcome to your daily cognitive journey.');
      break;

    case 2:
      title.textContent = 'Step 2: Explainable Adaptive Personalization';
      desc.textContent = 'A local rules engine adjusts the next challenge using accuracy, response time, and retries. It is not a diagnostic model.';

      const testStruggleBtn = document.createElement('button');
      testStruggleBtn.className = 'btn orange';
      testStruggleBtn.textContent = 'Simulate Struggle (Level 3 ➔ 2)';
      testStruggleBtn.onclick = async () => {
        // Record 2 struggling attempts
        await recordAttempt({ category: 'memory', difficulty: 3, accuracy: 0.4, responseTimeMs: 7500, retries: 2 });
        await recordAttempt({ category: 'memory', difficulty: 3, accuracy: 0.5, responseTimeMs: 8200, retries: 2 });
        const rec = await recommend('memory');
        desc.textContent = `Adaptive Personalization: Level 3 ➔ Level ${rec.difficulty}\nReason: ${rec.reason}`;
        speakAloud(desc.textContent, true);
        refreshAllDashboards();
      };

      const testSuccessBtn = document.createElement('button');
      testSuccessBtn.className = 'btn green';
      testSuccessBtn.textContent = 'Simulate Success (Level 2 ➔ 3)';
      testSuccessBtn.onclick = async () => {
        // Record 3 brisk, accurate attempts
        await recordAttempt({ category: 'memory', difficulty: 2, accuracy: 1.0, responseTimeMs: 1800, retries: 0 });
        await recordAttempt({ category: 'memory', difficulty: 2, accuracy: 1.0, responseTimeMs: 1900, retries: 0 });
        await recordAttempt({ category: 'memory', difficulty: 2, accuracy: 0.95, responseTimeMs: 2100, retries: 0 });
        const rec = await recommend('memory');
        desc.textContent = `Adaptive Personalization: Level 2 ➔ Level ${rec.difficulty}\nReason: ${rec.reason}`;
        speakAloud(desc.textContent, true);
        refreshAllDashboards();
      };

      actionArea.append(testStruggleBtn, testSuccessBtn);
      break;

    case 3:
      title.textContent = 'Step 3: Offline-First Operation';
      desc.textContent = 'Simulating network disconnection. Games, reminders, and IndexedDB continue functioning seamlessly offline.';

      const goOfflineBtn = document.createElement('button');
      goOfflineBtn.className = 'btn orange';
      goOfflineBtn.textContent = 'Turn On Offline Mode';
      goOfflineBtn.onclick = async () => {
        setOfflineSimulation(true);
        // Record an offline activity attempt and reminder
        await recordAttempt({ category: 'routine', difficulty: 2, accuracy: 1, responseTimeMs: 2200 });
        const rems = await getReminders();
        if (rems.length) await setReminderStatus(rems[0].id, REMINDER_STATES.COMPLETED);
        const q = await queueCount();
        desc.textContent = `OFFLINE MODE ACTIVE: ${q} event(s) waiting in local sync queue.`;
        speakAloud(desc.textContent, true);
        refreshAllDashboards();
      };
      actionArea.appendChild(goOfflineBtn);
      break;

    case 4:
      title.textContent = 'Step 4: Reconnection & Synchronization';
      desc.textContent = 'Restoring connectivity in local prototype mode. The queue processes local events with duplicate prevention; no cloud server is claimed.';

      const goOnlineBtn = document.createElement('button');
      goOnlineBtn.className = 'btn green';
      goOnlineBtn.textContent = 'Restore Online & Synchronize';
      goOnlineBtn.onclick = async () => {
        setOfflineSimulation(false);
        const res = await syncNow();
        desc.textContent = `LOCAL DEMO SYNC COMPLETE: ${res.synced} event(s) processed. Queue status: 0 pending. Duplicate protection active.`;
        speakAloud(desc.textContent, true);
        refreshAllDashboards();
      };
      actionArea.appendChild(goOnlineBtn);
      break;

    case 5:
      title.textContent = 'Step 5: Caregiver & Health Worker Dashboards';
      desc.textContent = 'Viewing locally recorded reminder adherence, personal baselines, and transparent personalization reasons. Remote alerts are not part of this prototype.';
      if (window.showPage) window.showPage('caregiver');
      refreshAllDashboards();
      break;

    case 6:
      title.textContent = 'Step 6: Multilingual & Cultural Content Packs';
      desc.textContent = 'Switching content packs dynamically demonstrates regional language UI, culturally familiar objects, and voice prompts.';

      const langSelect = document.createElement('select');
      langSelect.className = 'demo-lang-select';
      [
        { code: 'as', name: 'Assamese (অসমীয়া)' },
        { code: 'brx', name: 'Bodo (बर\')' },
        { code: 'mni', name: 'Meitei (মৈতৈলোন)' },
        { code: 'kha', name: 'Khasi' },
        { code: 'lus', name: 'Mizo' },
        { code: 'en', name: 'English' }
      ].forEach((l) => {
        const opt = document.createElement('option');
        opt.value = l.code;
        opt.textContent = l.name;
        langSelect.appendChild(opt);
      });

      langSelect.onchange = () => {
        if (window.changeLanguage) window.changeLanguage(langSelect.value);
        desc.textContent = `Switched to ${langSelect.options[langSelect.selectedIndex].text}. Cultural routine, objects, and stories reloaded.`;
      };

      actionArea.appendChild(langSelect);
      break;
  }

  // Nav buttons
  const navRow = document.createElement('div');
  navRow.className = 'demo-nav-row';

  if (currentDemoStep > 1) {
    const prevBtn = document.createElement('button');
    prevBtn.className = 'btn secondary';
    prevBtn.textContent = '◀ Previous';
    prevBtn.onclick = () => {
      currentDemoStep--;
      renderDemoStep();
    };
    navRow.appendChild(prevBtn);
  }

  if (currentDemoStep < TOTAL_STEPS) {
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn green';
    nextBtn.textContent = 'Next Step ▶';
    nextBtn.onclick = () => {
      currentDemoStep++;
      renderDemoStep();
    };
    navRow.appendChild(nextBtn);
  } else {
    const finishBtn = document.createElement('button');
    finishBtn.className = 'btn green';
    finishBtn.textContent = '✓ Finish Tour';
    finishBtn.onclick = () => closeDemoRunner();
    navRow.appendChild(finishBtn);
  }

  const closeBtn = document.createElement('button');
  closeBtn.className = 'btn secondary';
  closeBtn.textContent = 'Close';
  closeBtn.onclick = () => closeDemoRunner();
  navRow.appendChild(closeBtn);

  const resetBtn = document.createElement('button');
  resetBtn.className = 'btn secondary';
  resetBtn.textContent = '↻ Reset Demo Data';
  resetBtn.onclick = async () => {
    await resetDemoState();
    desc.textContent = 'Demo data reset. Start again from Step 1 for a predictable local demonstration.';
    currentDemoStep = 1;
    refreshAllDashboards();
  };
  navRow.appendChild(resetBtn);

  card.append(badge, title, desc, actionArea, navRow);
  modal.appendChild(card);
}
