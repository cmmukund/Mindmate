import {
  getReminders,
  addReminder,
  deleteReminder,
  setReminderStatus,
  calculateAdherence,
  startReminderMonitor,
  REMINDER_STATES,
  REMINDER_CATEGORIES
} from './reminder-engine.js';
import { requestNotifications } from './notifications.js';
import { speakAloud } from './assisted-mode.js';

let activeCategoryFilter = 'all';

export async function initReminderUI() {
  const page = document.getElementById('reminders');
  if (!page) return;

  const oldLegacyGrid = page.querySelector('.reminder-grid');
  if (oldLegacyGrid) oldLegacyGrid.style.display = 'none';

  const oldForm = document.getElementById('customReminderForm');
  if (oldForm) oldForm.style.display = 'none';

  let container = document.getElementById('liveReminderPanel');
  if (!container) {
    container = document.createElement('div');
    container.id = 'liveReminderPanel';
    container.className = 'panel live-reminder-wrapper';
    page.querySelector('.container')?.appendChild(container);
  }

  container.replaceChildren();

  // Header & Tools
  const header = document.createElement('div');
  header.className = 'reminder-header-bar';

  const titleWrap = document.createElement('div');
  const h2 = document.createElement('h2');
  h2.textContent = '⏰ Daily Routine & Reminders';
  const sub = document.createElement('p');
  sub.className = 'panel-sub';
  sub.textContent = 'Track and confirm your daily medication, hydration, meals, and activities.';
  titleWrap.append(h2, sub);

  const tools = document.createElement('div');
  tools.className = 'reminder-top-actions';

  const notifyBtn = document.createElement('button');
  notifyBtn.className = 'btn secondary';
  notifyBtn.textContent = '🔔 Enable Audio Alerts';
  notifyBtn.onclick = async () => {
    await requestNotifications();
    speakAloud('Notifications enabled for your routine reminders.');
  };

  const addToggleBtn = document.createElement('button');
  addToggleBtn.className = 'btn green';
  addToggleBtn.textContent = '➕ Add New Reminder';
  addToggleBtn.onclick = () => toggleAddForm();

  tools.append(notifyBtn, addToggleBtn);
  header.append(titleWrap, tools);

  // Filter Bar
  const filterBar = document.createElement('div');
  filterBar.className = 'reminder-filter-chips';

  const allChip = document.createElement('button');
  allChip.className = `chip ${activeCategoryFilter === 'all' ? 'active' : ''}`;
  allChip.textContent = 'All Reminders';
  allChip.onclick = () => {
    activeCategoryFilter = 'all';
    render();
  };
  filterBar.appendChild(allChip);

  REMINDER_CATEGORIES.forEach((cat) => {
    const chip = document.createElement('button');
    chip.className = `chip ${activeCategoryFilter === cat.id ? 'active' : ''}`;
    chip.textContent = `${cat.icon} ${cat.label}`;
    chip.onclick = () => {
      activeCategoryFilter = cat.id;
      render();
    };
    filterBar.appendChild(chip);
  });

  // Add Reminder Modal / Form
  const formWrap = document.createElement('div');
  formWrap.id = 'elderAddReminderForm';
  formWrap.className = 'panel add-reminder-card';
  formWrap.style.display = 'none';

  const formH = document.createElement('h3');
  formH.textContent = 'Add a Daily Reminder';

  const formGrid = document.createElement('div');
  formGrid.className = 'form-grid';

  const titleIn = document.createElement('input');
  titleIn.id = 'newRemTitle';
  titleIn.placeholder = 'e.g. Afternoon Blood Pressure Tablet';
  titleIn.setAttribute('aria-label', 'Reminder Title');

  const timeIn = document.createElement('input');
  timeIn.id = 'newRemTime';
  timeIn.type = 'time';
  timeIn.value = '14:00';
  timeIn.setAttribute('aria-label', 'Reminder Time');

  const catSelect = document.createElement('select');
  catSelect.id = 'newRemCategory';
  REMINDER_CATEGORIES.forEach((c) => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = `${c.icon} ${c.label}`;
    catSelect.appendChild(opt);
  });

  formGrid.append(titleIn, timeIn, catSelect);

  const formActions = document.createElement('div');
  formActions.className = 'form-actions';

  const saveBtn = document.createElement('button');
  saveBtn.className = 'btn green';
  saveBtn.textContent = 'Save Reminder';
  saveBtn.onclick = async () => {
    if (!titleIn.value.trim() || !timeIn.value) {
      alert('Please provide a title and time for the reminder.');
      return;
    }
    await addReminder({
      title: titleIn.value.trim(),
      time: timeIn.value,
      category: catSelect.value
    });
    titleIn.value = '';
    formWrap.style.display = 'none';
    render();
    speakAloud('New reminder saved successfully.');
  };

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn secondary';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.onclick = () => {
    formWrap.style.display = 'none';
  };

  formActions.append(saveBtn, cancelBtn);
  formWrap.append(formH, formGrid, formActions);

  // List Container
  const listArea = document.createElement('div');
  listArea.id = 'activeReminderTimeline';
  listArea.className = 'timeline-list';

  // Adherence Analytics Card
  const adherenceCard = document.createElement('div');
  adherenceCard.id = 'reminderAdherenceBox';
  adherenceCard.className = 'adherence-summary-card';

  container.append(header, filterBar, formWrap, adherenceCard, listArea);

  // Start background monitoring for live alarms
  startReminderMonitor();

  // Listeners
  window.addEventListener('mindmate:remindersUpdated', render);
  window.addEventListener('mindmate:reminderDue', (e) => showDueModal(e.detail));

  await render();
}

function toggleAddForm() {
  const f = document.getElementById('elderAddReminderForm');
  if (f) {
    f.style.display = f.style.display === 'none' ? 'block' : 'none';
    if (f.style.display === 'block') {
      f.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

async function render() {
  const listArea = document.getElementById('activeReminderTimeline');
  if (!listArea) return;
  listArea.replaceChildren();

  const rows = await getReminders(activeCategoryFilter);

  if (!rows.length) {
    const empty = document.createElement('div');
    empty.className = 'insight';
    empty.textContent = 'No reminders found for this category. Tap "Add New Reminder" above to create one.';
    listArea.appendChild(empty);
  } else {
    rows.forEach((r) => {
      const card = document.createElement('div');
      card.className = `reminder-card-elder state-${r.status || 'scheduled'}`;

      const iconCol = document.createElement('div');
      iconCol.className = 'rem-icon-col';
      iconCol.textContent = r.icon || '⏰';

      const contentCol = document.createElement('div');
      contentCol.className = 'rem-content-col';

      const timeTitle = document.createElement('h3');
      timeTitle.textContent = `${formatTime(r.time)} · ${r.title}`;

      const statusBadge = document.createElement('span');
      statusBadge.className = `status-pill pill-${r.status || 'scheduled'}`;
      statusBadge.textContent = (r.status || 'scheduled').toUpperCase();

      const subInfo = document.createElement('p');
      subInfo.className = 'rem-meta';
      subInfo.textContent = `Category: ${r.category.toUpperCase()}${r.snoozeCount ? ` · Snoozed ${r.snoozeCount}x` : ''}`;

      contentCol.append(timeTitle, statusBadge, subInfo);

      // Action Buttons: TAKEN / SNOOZE / MISSED
      const actionsCol = document.createElement('div');
      actionsCol.className = 'rem-actions-col';

      const takenBtn = document.createElement('button');
      takenBtn.className = 'btn green rem-btn';
      takenBtn.textContent = '✓ Taken';
      takenBtn.title = 'Mark as completed';
      takenBtn.onclick = async () => {
        await setReminderStatus(r.id, REMINDER_STATES.COMPLETED);
        speakAloud(`${r.title} marked as completed.`);
        render();
      };

      const snoozeBtn = document.createElement('button');
      snoozeBtn.className = 'btn secondary rem-btn';
      snoozeBtn.textContent = '⏱ Snooze';
      snoozeBtn.title = 'Snooze for 15 minutes';
      snoozeBtn.onclick = async () => {
        await setReminderStatus(r.id, REMINDER_STATES.SNOOZED);
        speakAloud(`${r.title} snoozed for 15 minutes.`);
        render();
      };

      const missBtn = document.createElement('button');
      missBtn.className = 'btn orange rem-btn';
      missBtn.textContent = '✕ Missed';
      missBtn.title = 'Mark as missed';
      missBtn.onclick = async () => {
        await setReminderStatus(r.id, REMINDER_STATES.MISSED);
        render();
      };

      actionsCol.append(takenBtn, snoozeBtn, missBtn);

      if (!r.id.startsWith('default-')) {
        const delBtn = document.createElement('button');
        delBtn.className = 'btn-icon-del';
        delBtn.textContent = '🗑';
        delBtn.title = 'Delete reminder';
        delBtn.onclick = async () => {
          if (confirm(`Delete reminder "${r.title}"?`)) {
            await deleteReminder(r.id);
            render();
          }
        };
        actionsCol.appendChild(delBtn);
      }

      card.append(iconCol, contentCol, actionsCol);
      listArea.appendChild(card);
    });
  }

  // Update Adherence Analytics
  renderAdherenceCard();
}

async function renderAdherenceCard() {
  const box = document.getElementById('reminderAdherenceBox');
  if (!box) return;

  const adh = await calculateAdherence(activeCategoryFilter, 30);
  box.replaceChildren();

  const title = document.createElement('h3');
  title.textContent = '📊 Reminder Adherence (Last 30 Days)';

  const grid = document.createElement('div');
  grid.className = 'adherence-stats-grid';

  const compBox = document.createElement('div');
  compBox.className = 'adh-stat-item green';
  compBox.innerHTML = `<strong>${adh.completedRate !== null ? adh.completedRate + '%' : '—'}</strong><span>Completed</span>`;

  const snoozeBox = document.createElement('div');
  snoozeBox.className = 'adh-stat-item secondary';
  snoozeBox.innerHTML = `<strong>${adh.snoozedRate}%</strong><span>Snoozed</span>`;

  const missBox = document.createElement('div');
  missBox.className = 'adh-stat-item orange';
  missBox.innerHTML = `<strong>${adh.missedRate}%</strong><span>Missed</span>`;

  grid.append(compBox, snoozeBox, missBox);

  const medAdh = adh.categories.medicine;
  const medNote = document.createElement('p');
  medNote.className = 'med-adherence-note';
  medNote.textContent = medAdh && medAdh.adherenceRate !== null
    ? `💊 Medicine Adherence: ${medAdh.adherenceRate}% (${medAdh.completed} taken, ${medAdh.missed} missed)`
    : '💊 Medicine Adherence: Recording events as you take medication.';

  box.append(title, grid, medNote);
}

function showDueModal(reminder) {
  let modal = document.getElementById('reminderDueAlertModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'reminderDueAlertModal';
    modal.className = 'due-reminder-modal-overlay';
    document.body.appendChild(modal);
  }

  modal.replaceChildren();

  const card = document.createElement('div');
  card.className = 'due-reminder-modal-card';

  const icon = document.createElement('div');
  icon.className = 'due-modal-icon';
  icon.textContent = reminder.icon || '⏰';

  const title = document.createElement('h2');
  title.textContent = reminder.title;

  const prompt = document.createElement('p');
  prompt.textContent = `Scheduled for ${formatTime(reminder.time)}. Please confirm your action:`;

  const actions = document.createElement('div');
  actions.className = 'due-modal-actions';

  const taken = document.createElement('button');
  taken.className = 'btn green large';
  taken.textContent = '✓ Taken / Done';
  taken.onclick = async () => {
    await setReminderStatus(reminder.id, REMINDER_STATES.COMPLETED);
    modal.remove();
  };

  const snooze = document.createElement('button');
  snooze.className = 'btn secondary large';
  snooze.textContent = '⏱ Snooze (+15m)';
  snooze.onclick = async () => {
    await setReminderStatus(reminder.id, REMINDER_STATES.SNOOZED);
    modal.remove();
  };

  const missed = document.createElement('button');
  missed.className = 'btn orange large';
  missed.textContent = '✕ Missed';
  missed.onclick = async () => {
    await setReminderStatus(reminder.id, REMINDER_STATES.MISSED);
    modal.remove();
  };

  actions.append(taken, snooze, missed);
  card.append(icon, title, prompt, actions);
  modal.appendChild(card);

  speakAloud(`Reminder: ${reminder.title}. Please confirm if taken.`);
}

function formatTime(v) {
  if (!v) return '';
  const [h, m] = v.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${suffix}`;
}
