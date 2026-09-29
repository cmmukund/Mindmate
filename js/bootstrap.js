import { ensureUser } from './storage.js';
import { seedReminders } from './reminder-engine.js';
import { syncNow } from './sync-queue.js';
import { initJourney } from './journey.js';
import { initReminderUI } from './reminder-ui.js';
import { refreshAllDashboards } from './dashboards.js';
import { requestNotifications } from './notifications.js';
import { initAssistedMode, toggleAssistedMode } from './assisted-mode.js';
import { openDemoRunner } from './demo-mode.js';
import { authenticateRole, getActiveRole, canAccess, ROLES, getConsentStatus, grantConsent } from './auth-rbac.js';
import { launchGame } from './games-engine.js';
import { startVoiceListening } from './voice-assistant.js';

async function boot() {
  await ensureUser();
  await seedReminders();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').catch((err) => {
      console.warn('Service worker registration note:', err);
    });
  }

  initAssistedMode();
  await initJourney();
  await initReminderUI();
  await refreshAllDashboards();

  // Wire up global page navigation hook to enforce RBAC and views
  setupNavigationGuards();

  // Wire up top action bar (Assisted Mode, Role Switcher, Demo Tour, Voice Mic)
  setupHeaderControls();

  // Setup Games Catalog for 5 Cognitive Domains
  setupGamesCatalog();

  // Setup Consent & Privacy check
  checkConsentPrompt();

  // Network and Sync Listeners
  window.addEventListener('mindmate:sync', refreshAllDashboards);
  window.addEventListener('mindmate:remindersUpdated', refreshAllDashboards);
  window.addEventListener('mindmate:sessionRecorded', refreshAllDashboards);
  window.addEventListener('mindmate:roleChanged', () => {
    updateRoleUI();
    refreshAllDashboards();
  });
  window.addEventListener('online', () => syncNow().catch(() => {}));
  window.addEventListener('offline', refreshAllDashboards);

  // Periodic background dashboard refresh
  setInterval(() => {
    refreshAllDashboards().catch(() => {});
  }, 15000);

  syncNow().catch(() => {});
  enhanceUIIntegrity();
}

function setupHeaderControls() {
  const nav = document.querySelector('.main-nav');
  if (!nav) return;

  // 1. Assisted Mode Toggle Button
  if (!document.getElementById('assistedModeToggleBtn')) {
    const assistedBtn = document.createElement('button');
    assistedBtn.id = 'assistedModeToggleBtn';
    assistedBtn.className = 'nav-pill-btn';
    assistedBtn.type = 'button';
    assistedBtn.textContent = '🧓 Assisted Mode: OFF';
    assistedBtn.title = 'Toggle large text and voice narration';
    assistedBtn.onclick = () => toggleAssistedMode();
    nav.prepend(assistedBtn);
  }

  // 2. Role Switcher Badge / Button
  if (!document.getElementById('roleSwitcherBtn')) {
    const roleBtn = document.createElement('button');
    roleBtn.id = 'roleSwitcherBtn';
    roleBtn.className = 'nav-pill-btn role-badge-btn';
    roleBtn.type = 'button';
    roleBtn.textContent = `👤 Role: ${getActiveRole().toUpperCase()}`;
    roleBtn.onclick = () => showRoleDialog();
    nav.prepend(roleBtn);
  }

  // 3. 5-Min Competition Demo Button
  if (!document.getElementById('competitionDemoBtn')) {
    const demoBtn = document.createElement('button');
    demoBtn.id = 'competitionDemoBtn';
    demoBtn.className = 'nav-pill-btn demo-pill-btn';
    demoBtn.type = 'button';
    demoBtn.textContent = '🏆 5-Min Demo Tour';
    demoBtn.onclick = () => openDemoRunner();
    nav.prepend(demoBtn);
  }

  // 4. Voice Mic Trigger in Header
  if (!document.getElementById('headerVoiceBtn')) {
    const voiceBtn = document.createElement('button');
    voiceBtn.id = 'headerVoiceBtn';
    voiceBtn.className = 'nav-pill-btn voice-mic-btn';
    voiceBtn.type = 'button';
    voiceBtn.textContent = '🎙️ Speak';
    voiceBtn.title = 'Speak a voice command';
    voiceBtn.onclick = () => {
      startVoiceListening(
        (transcript, reply) => {
          alert(`You said: "${transcript}"\nMINDMATE: ${reply}`);
        },
        (status) => {
          voiceBtn.textContent = status.includes('Listening') ? '🔴 Listening...' : '🎙️ Speak';
        }
      );
    };
    nav.prepend(voiceBtn);
  }
}

function updateRoleUI() {
  const roleBtn = document.getElementById('roleSwitcherBtn');
  if (roleBtn) {
    roleBtn.textContent = `👤 Role: ${getActiveRole().toUpperCase()}`;
  }
}

function showRoleDialog() {
  let modal = document.getElementById('roleAuthModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'roleAuthModal';
    modal.className = 'due-reminder-modal-overlay';
    document.body.appendChild(modal);
  }
  modal.style.display = 'flex';
  modal.replaceChildren();

  const card = document.createElement('div');
  card.className = 'due-reminder-modal-card';

  const title = document.createElement('h2');
  title.textContent = 'Switch User Role';

  const desc = document.createElement('p');
  desc.textContent = 'Prototype role preview only. It demonstrates which information each role would see; it is not production authentication.';

  const select = document.createElement('select');
  select.className = 'role-select-box';
  [
    { id: ROLES.PATIENT, label: 'Patient (Self Care)' },
    { id: ROLES.CAREGIVER, label: 'Caregiver (local preview)' },
    { id: ROLES.HEALTHWORKER, label: 'Health Worker (local preview)' },
    { id: ROLES.ADMIN, label: 'System Admin (local preview)' }
  ].forEach((r) => {
    const opt = document.createElement('option');
    opt.value = r.id;
    opt.textContent = r.label;
    if (r.id === getActiveRole()) opt.selected = true;
    select.appendChild(opt);
  });

  const actions = document.createElement('div');
  actions.className = 'game-actions';

  const confirmBtn = document.createElement('button');
  confirmBtn.className = 'btn green large';
  confirmBtn.textContent = 'Confirm Switch';
  confirmBtn.onclick = async () => {
    const targetRole = select.value;
    const result = await authenticateRole(targetRole);
    if (result.success) {
      modal.style.display = 'none';
      if (targetRole === ROLES.CAREGIVER) window.showPage('caregiver');
      else if (targetRole === ROLES.HEALTHWORKER) window.showPage('healthworker');
      else window.showPage('home');
    } else {
      alert(result.message || 'Authentication failed. Please verify your PIN.');
    }
  };

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn secondary large';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.onclick = () => {
    modal.style.display = 'none';
  };

  actions.append(confirmBtn, cancelBtn);
  card.append(title, desc, select, actions);
  modal.appendChild(card);
}

function setupNavigationGuards() {
  const originalShowPage = window.showPage;
  window.showPage = function (pageId) {
    if (!canAccess(pageId)) {
      alert(`Access Restricted: Page "${pageId.toUpperCase()}" requires authorized credentials. Switching to role login.`);
      showRoleDialog();
      return;
    }
    if (typeof originalShowPage === 'function') {
      originalShowPage(pageId);
    }
    refreshAllDashboards().catch(() => {});
  };
}

function setupGamesCatalog() {
  const gamesPage = document.getElementById('games');
  if (!gamesPage) return;

  let catalog = document.getElementById('fiveDomainsCatalog');
  if (!catalog) {
    catalog = document.createElement('div');
    catalog.id = 'fiveDomainsCatalog';
    catalog.className = 'games-catalog-container';
    gamesPage.querySelector('.container')?.prepend(catalog);
  }

  catalog.replaceChildren();

  const titleWrap = document.createElement('div');
  titleWrap.className = 'page-title';
  titleWrap.innerHTML = `
    <div>
      <h1>🧠 Cognitive Engagement Activities</h1>
      <p>Five research-backed domains tailored to your personal baseline challenge level.</p>
    </div>
  `;

  const grid = document.createElement('div');
  grid.className = 'action-grid five-domains-grid';

  const domainsInfo = [
    { id: 'memory', title: 'Memory Recall', icon: '🧠', desc: 'Sequence recall and delayed number memorization.' },
    { id: 'attention', title: 'Visual Focus & Attention', icon: '🎯', desc: 'Target identification and visual search amidst distractors.' },
    { id: 'routine', title: 'Daily Routine Recall', icon: '🗓️', desc: 'Sequencing daily habits: morning walk, medicine, and meals.' },
    { id: 'recognition', title: 'Pattern & Object Match', icon: '🧩', desc: 'Culturally familiar object matching and recognition.' },
    { id: 'engagement', title: 'Story & Reflection', icon: '💬', desc: 'Warm short stories, reflective questions, and mood check-in.' }
  ];

  domainsInfo.forEach((d) => {
    const card = document.createElement('article');
    card.className = 'action-card';

    const icon = document.createElement('div');
    icon.className = 'action-icon';
    icon.textContent = d.icon;

    const h3 = document.createElement('h3');
    h3.textContent = d.title;

    const p = document.createElement('p');
    p.textContent = d.desc;

    const playBtn = document.createElement('button');
    playBtn.className = 'btn large';
    playBtn.textContent = 'Play Activity ▶';
    playBtn.onclick = () => {
      document.querySelector('.game-grid')?.remove();
      catalog.style.display = 'none';

      let stage = document.getElementById('domainGamePlayHost');
      if (!stage) {
        stage = document.createElement('div');
        stage.id = 'domainGamePlayHost';
        stage.className = 'panel';
        gamesPage.querySelector('.container')?.appendChild(stage);
      }
      stage.style.display = 'block';
      launchGame(d.id, 'domainGamePlayHost');
    };

    card.append(icon, h3, p, playBtn);
    grid.appendChild(card);
  });

  catalog.append(titleWrap, grid);

  // Global helper to return to games catalog
  window.showGamesCatalog = function () {
    const stage = document.getElementById('domainGamePlayHost');
    if (stage) stage.style.display = 'none';
    if (catalog) catalog.style.display = 'block';
  };

  window.launchGameDomain = function (domain) {
    if (catalog) catalog.style.display = 'none';
    let stage = document.getElementById('domainGamePlayHost');
    if (!stage) {
      stage = document.createElement('div');
      stage.id = 'domainGamePlayHost';
      stage.className = 'panel';
      gamesPage.querySelector('.container')?.appendChild(stage);
    }
    stage.style.display = 'block';
    launchGame(domain, 'domainGamePlayHost');
  };
}

async function checkConsentPrompt() {
  const { consentGiven } = await getConsentStatus();
  if (consentGiven) return;

  let modal = document.getElementById('consentNoticeModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'consentNoticeModal';
    modal.className = 'due-reminder-modal-overlay';
    document.body.appendChild(modal);
  }
  modal.style.display = 'flex';
  modal.replaceChildren();

  const card = document.createElement('div');
  card.className = 'due-reminder-modal-card';
  card.innerHTML = `
    <h2>🛡️ Privacy & Informed Consent</h2>
    <p><strong>MINDMATE is a cognitive engagement and routine support platform. It is not a medical diagnostic system and does not replace medical assessment.</strong></p>
    <ul style="text-align:left;margin:15px 0 20px 20px;line-height:1.6;">
      <li><strong>Data stored:</strong> Activity performance (accuracy, response times) and daily reminder events.</li>
      <li><strong>Purpose:</strong> To personalize activity difficulty and assist family caregivers.</li>
      <li><strong>Offline first:</strong> All records remain strictly on this device until synchronized with authorized caregiver accounts.</li>
      <li><strong>Revocation:</strong> You can export or erase your data at any time in settings.</li>
    </ul>
    <div class="game-actions">
      <button class="btn green large" id="grantConsentBtn">I Understand & Agree</button>
    </div>
  `;

  card.querySelector('#grantConsentBtn').onclick = async () => {
    await grantConsent();
    modal.style.display = 'none';
  };

  modal.appendChild(card);
}

function enhanceUIIntegrity() {
  // Ensure non-medical disclaimer banner is clearly present
  document.querySelectorAll('[data-key="dashboard_demo"], [data-key="caregiver_demo"], .demo-note').forEach((el) => {
    el.textContent = 'MINDMATE provides cognitive engagement, routine support, and activity insights. It is not a medical diagnostic system and does not replace professional medical assessment.';
    el.className = 'demo-note non-medical-statement';
  });
}

boot();
