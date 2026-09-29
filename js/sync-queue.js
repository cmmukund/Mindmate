import { all, put } from './storage.js';
import { apiClient } from './api-client.js';

let isOfflineSimulated = localStorage.getItem('mindmateSimulateOffline') === 'true';

export function isOffline() {
  if (isOfflineSimulated) return true;
  return !navigator.onLine;
}

export function setOfflineSimulation(enable) {
  isOfflineSimulated = Boolean(enable);
  localStorage.setItem('mindmateSimulateOffline', String(isOfflineSimulated));
  window.dispatchEvent(new CustomEvent('mindmate:networkStatusChanged', { detail: { offline: isOffline() } }));
  if (!isOffline()) {
    syncNow().catch(() => {});
  }
}

export async function pendingEvents() {
  const events = await all('events');
  return events
    .filter((e) => e.status === 'pending')
    .sort((a, b) => a.createdAt - b.createdAt);
}

export async function queueCount() {
  return (await pendingEvents()).length;
}

export async function allEventsHistory(limit = 50) {
  const events = await all('events');
  return events
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, limit);
}

export async function syncNow() {
  const pending = await pendingEvents();
  const count = pending.length;

  if (isOffline()) {
    const statusObj = {
      synced: 0,
      pending: count,
      offline: true,
      simulated: isOfflineSimulated,
      lastSync: localStorage.getItem('mindmateLastSync') || null
    };
    broadcastSyncStatus(statusObj);
    return statusObj;
  }

  if (count === 0) {
    const statusObj = {
      synced: 0,
      pending: 0,
      offline: false,
      lastSync: localStorage.getItem('mindmateLastSync') || null
    };
    broadcastSyncStatus(statusObj);
    return statusObj;
  }

  // Broadcast that sync is currently in progress
  window.dispatchEvent(
    new CustomEvent('mindmate:syncProgress', {
      detail: { inProgress: true, total: count, message: `Syncing ${count} event(s)...` }
    })
  );

  let syncedCount = 0;
  try {
    // Send batch to API client (which handles local mock or cloud endpoint)
    const result = await apiClient.syncBatch(pending);

    for (const ev of pending) {
      // Idempotency / duplicate check
      const duplicateKey = `mindmate-synced-${ev.id}`;
      if (!localStorage.getItem(duplicateKey)) {
        localStorage.setItem(duplicateKey, '1');
      }

      ev.status = 'synced';
      ev.syncedAt = Date.now();
      ev.retryCount = (ev.retryCount || 0) + 1;
      await put('events', ev);
      syncedCount++;
    }

    const lastSyncTime = Date.now();
    localStorage.setItem('mindmateLastSync', String(lastSyncTime));

    const statusObj = {
      synced: syncedCount,
      pending: 0,
      offline: false,
      lastSync: String(lastSyncTime),
      adapter: result.adapter
    };

    broadcastSyncStatus(statusObj);
    return statusObj;
  } catch (err) {
    console.error('Sync failed:', err);
    // Increment retry counts on pending events
    for (const ev of pending) {
      ev.retryCount = (ev.retryCount || 0) + 1;
      await put('events', ev);
    }
    const statusObj = {
      synced: 0,
      pending: count,
      offline: false,
      error: err.message,
      lastSync: localStorage.getItem('mindmateLastSync') || null
    };
    broadcastSyncStatus(statusObj);
    return statusObj;
  }
}

function broadcastSyncStatus(detail) {
  window.dispatchEvent(new CustomEvent('mindmate:syncStatusChanged', { detail }));
  window.dispatchEvent(new CustomEvent('mindmate:sync', { detail }));
}

// Automatic online reconnection sync
window.addEventListener('online', () => {
  if (!isOfflineSimulated) syncNow().catch(() => {});
});

window.addEventListener('offline', () => {
  queueCount().then((count) => {
    broadcastSyncStatus({
      synced: 0,
      pending: count,
      offline: true,
      lastSync: localStorage.getItem('mindmateLastSync') || null
    });
  });
});
