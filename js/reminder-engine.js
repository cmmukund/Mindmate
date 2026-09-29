import { all, put, remove, uid, get } from './storage.js';

export const REMINDER_STATES = {
  SCHEDULED: 'scheduled',
  TRIGGERED: 'triggered',
  ACKNOWLEDGED: 'acknowledged',
  COMPLETED: 'completed',
  SNOOZED: 'snoozed',
  MISSED: 'missed'
};

export const REMINDER_CATEGORIES = [
  { id: 'medicine', label: 'Medicine', icon: '💊' },
  { id: 'hydration', label: 'Hydration', icon: '💧' },
  { id: 'meals', label: 'Meals & Food', icon: '🍲' },
  { id: 'exercise', label: 'Walking & Exercise', icon: '🚶' },
  { id: 'cognitive', label: 'Cognitive Activity', icon: '🧠' },
  { id: 'appointment', label: 'Doctor & Clinic', icon: '📅' },
  { id: 'custom', label: 'Daily Routine', icon: '⏰' }
];

const DEFAULT_SEEDS = [
  { id: 'default-med-morning', title: 'Morning Heart & Blood Pressure Medicine', time: '08:00', icon: '💊', category: 'medicine' },
  { id: 'default-water-1', title: 'Drink a glass of warm water', time: '10:00', icon: '💧', category: 'hydration' },
  { id: 'default-meal-lunch', title: 'Healthy Lunch & Fresh Salad', time: '12:30', icon: '🍲', category: 'meals' },
  { id: 'default-walk', title: 'Gentle Garden Walk', time: '16:30', icon: '🚶', category: 'exercise' },
  { id: 'default-cognitive', title: 'MINDMATE 10-Min Cognitive Journey', time: '18:00', icon: '🧠', category: 'cognitive' },
  { id: 'default-med-night', title: 'Night Routine & Medicine', time: '20:30', icon: '💊', category: 'medicine' }
];

export async function seedReminders() {
  const existing = await all('reminders');
  if (existing.length) return existing;

  for (const item of DEFAULT_SEEDS) {
    const nextAt = calculateNextOccurrence(item.time);
    await put('reminders', {
      ...item,
      enabled: true,
      status: REMINDER_STATES.SCHEDULED,
      nextAt,
      snoozeCount: 0,
      createdAt: Date.now()
    });
  }
  return all('reminders');
}

export function calculateNextOccurrence(timeStr) {
  const [h, m] = (timeStr || '08:00').split(':').map(Number);
  const target = new Date();
  target.setHours(h, m, 0, 0);
  if (target.getTime() <= Date.now()) {
    target.setDate(target.getDate() + 1);
  }
  return target.getTime();
}

export async function getReminders(categoryFilter = null) {
  const rows = await seedReminders();
  const sorted = rows.sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  if (!categoryFilter || categoryFilter === 'all') return sorted;
  return sorted.filter((r) => r.category === categoryFilter);
}

export async function addReminder({ title, time, category = 'custom', icon = null }) {
  const catObj = REMINDER_CATEGORIES.find((c) => c.id === category) || REMINDER_CATEGORIES[6];
  const newReminder = {
    id: uid('rem'),
    title: (title || '').trim(),
    time,
    category: catObj.id,
    icon: icon || catObj.icon,
    enabled: true,
    status: REMINDER_STATES.SCHEDULED,
    nextAt: calculateNextOccurrence(time),
    snoozeCount: 0,
    createdAt: Date.now()
  };

  await put('reminders', newReminder);
  await logReminderEvent(newReminder, REMINDER_STATES.SCHEDULED);
  return newReminder;
}

export async function updateReminder(id, updates) {
  const r = await get('reminders', id);
  if (!r) return null;

  const merged = { ...r, ...updates };
  if (updates.time) {
    merged.nextAt = calculateNextOccurrence(updates.time);
  }
  await put('reminders', merged);
  window.dispatchEvent(new CustomEvent('mindmate:remindersUpdated'));
  return merged;
}

export async function deleteReminder(id) {
  await remove('reminders', id);
  window.dispatchEvent(new CustomEvent('mindmate:remindersUpdated'));
  return true;
}

export async function setReminderStatus(id, newStatus, extraNotes = '') {
  const r = await get('reminders', id);
  if (!r) return null;

  r.status = newStatus;
  r.lastActionAt = Date.now();

  if (newStatus === REMINDER_STATES.COMPLETED) {
    // Schedule for next day
    r.nextAt = calculateNextOccurrence(r.time);
    r.snoozeCount = 0;
  } else if (newStatus === REMINDER_STATES.SNOOZED) {
    r.nextAt = Date.now() + 15 * 60 * 1000; // +15 mins
    r.snoozeCount = (r.snoozeCount || 0) + 1;
  } else if (newStatus === REMINDER_STATES.MISSED) {
    r.nextAt = calculateNextOccurrence(r.time);
  }

  await put('reminders', r);
  await logReminderEvent(r, newStatus, extraNotes);
  window.dispatchEvent(new CustomEvent('mindmate:remindersUpdated'));
  return r;
}

async function logReminderEvent(reminder, status, notes = '') {
  const eventPayload = {
    reminderId: reminder.id,
    title: reminder.title,
    category: reminder.category,
    time: reminder.time,
    status,
    notes,
    timestamp: Date.now()
  };

  await put('events', {
    id: uid('evt-rem'),
    createdAt: Date.now(),
    userId: 'local-user',
    deviceId: localStorage.getItem('mindmateDeviceId') || 'local-device',
    eventType: 'reminder_event',
    payload: eventPayload,
    status: 'pending',
    retryCount: 0
  });

  window.dispatchEvent(new CustomEvent('mindmate:reminderEventLogged', { detail: eventPayload }));
}

/**
 * Calculate comprehensive adherence statistics.
 * Computes Completed, Snoozed, and Missed percentages.
 */
export async function calculateAdherence(categoryFilter = null, days = 30) {
  const since = Date.now() - days * 86400000;
  const allEvents = (await all('events'))
    .filter((e) => e.eventType === 'reminder_event' && e.createdAt >= since);

  const filtered = categoryFilter && categoryFilter !== 'all'
    ? allEvents.filter((e) => e.payload && e.payload.category === categoryFilter)
    : allEvents;

  const counts = {
    completed: 0,
    snoozed: 0,
    missed: 0,
    acknowledged: 0,
    scheduled: 0
  };

  filtered.forEach((e) => {
    const s = e.payload?.status;
    if (counts[s] !== undefined) counts[s]++;
  });

  const actionTotal = counts.completed + counts.snoozed + counts.missed;

  // Breakdown by category
  const categoriesBreakdown = {};
  REMINDER_CATEGORIES.forEach((cat) => {
    const catEvents = allEvents.filter((e) => e.payload && e.payload.category === cat.id);
    const catCompleted = catEvents.filter((e) => e.payload?.status === REMINDER_STATES.COMPLETED).length;
    const catMissed = catEvents.filter((e) => e.payload?.status === REMINDER_STATES.MISSED).length;
    const catSnoozed = catEvents.filter((e) => e.payload?.status === REMINDER_STATES.SNOOZED).length;
    const catTotal = catCompleted + catMissed + catSnoozed;

    categoriesBreakdown[cat.id] = {
      label: cat.label,
      icon: cat.icon,
      completed: catCompleted,
      missed: catMissed,
      snoozed: catSnoozed,
      adherenceRate: catTotal > 0 ? Math.round((catCompleted / catTotal) * 100) : null
    };
  });

  return {
    days,
    counts,
    totalActions: actionTotal,
    completedRate: actionTotal > 0 ? Math.round((counts.completed / actionTotal) * 100) : null,
    snoozedRate: actionTotal > 0 ? Math.round((counts.snoozed / actionTotal) * 100) : 0,
    missedRate: actionTotal > 0 ? Math.round((counts.missed / actionTotal) * 100) : 0,
    categories: categoriesBreakdown
  };
}

/**
 * Background Reminder Monitor:
 * Checks periodically for reminders that are due and dispatches events.
 */
let monitorInterval = null;
export function startReminderMonitor() {
  if (monitorInterval) clearInterval(monitorInterval);

  async function checkDue() {
    const list = await all('reminders');
    const now = Date.now();

    for (const r of list) {
      if (r.enabled && r.nextAt && r.nextAt <= now && r.status === REMINDER_STATES.SCHEDULED) {
        r.status = REMINDER_STATES.TRIGGERED;
        await put('reminders', r);
        window.dispatchEvent(new CustomEvent('mindmate:reminderDue', { detail: r }));
      }
    }
  }

  monitorInterval = setInterval(checkDue, 15000); // Check every 15 seconds
  checkDue().catch(() => {});
}
