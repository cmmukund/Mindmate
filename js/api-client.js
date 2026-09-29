/**
 * MINDMATE API Client Abstraction Layer
 * Defines the standard REST contracts for authentication, sessions, reminders,
 * baselines, synchronization, and analytics.
 *
 * Provides a clean Local Mock Adapter for offline/prototype execution,
 * while allowing drop-in switching to a remote HTTPS production cloud backend.
 */

export const API_CONFIG = {
  mode: localStorage.getItem('mindmateApiMode') || 'local-mock', // 'local-mock' | 'cloud-production'
  cloudBaseUrl: localStorage.getItem('mindmateCloudUrl') || 'https://api.mindmate.health/v1',
  mockLatencyMs: 150
};

export const apiClient = {
  getMode() {
    return API_CONFIG.mode;
  },

  setMode(mode) {
    API_CONFIG.mode = mode;
    localStorage.setItem('mindmateApiMode', mode);
  },

  /* Auth & RBAC */
  async login(role, credentials = {}) {
    if (API_CONFIG.mode === 'cloud-production') {
      return httpPost('/auth/login', { role, ...credentials });
    }
    // Local Mock Authentication
    await sleep(API_CONFIG.mockLatencyMs);
    const validRoles = ['patient', 'caregiver', 'healthworker', 'admin'];
    if (!validRoles.includes(role)) {
      throw new Error(`Invalid role requested: ${role}`);
    }
    return {
      success: true,
      token: `mock-token-${role}-${Date.now()}`,
      user: { id: `user-${role}`, role, name: role.toUpperCase() },
      source: 'local-mock'
    };
  },

  async verifyRole(token, requiredRole) {
    if (API_CONFIG.mode === 'cloud-production') {
      return httpPost('/auth/verify', { token, requiredRole });
    }
    await sleep(50);
    return { authorized: true, role: requiredRole, source: 'local-mock' };
  },

  /* Sessions & Telemetry */
  async pushSessions(sessions) {
    if (API_CONFIG.mode === 'cloud-production') {
      return httpPost('/sessions/batch', { sessions });
    }
    await sleep(API_CONFIG.mockLatencyMs);
    return { accepted: sessions.length, syncedAt: Date.now(), source: 'local-mock' };
  },

  /* Reminders */
  async syncReminderEvents(events) {
    if (API_CONFIG.mode === 'cloud-production') {
      return httpPost('/reminder-events/batch', { events });
    }
    await sleep(API_CONFIG.mockLatencyMs);
    return { processed: events.length, syncedAt: Date.now(), source: 'local-mock' };
  },

  /* Sync Queue Endpoint */
  async syncBatch(events) {
    if (API_CONFIG.mode === 'cloud-production') {
      return httpPost('/sync/events', { events });
    }
    // Local Mock Synchronization Adapter
    await sleep(API_CONFIG.mockLatencyMs);
    const processedIds = events.map((e) => e.id);
    return {
      success: true,
      syncedCount: processedIds.length,
      syncedIds: processedIds,
      serverTimestamp: Date.now(),
      adapter: 'Local Mock Adapter (Ready for Cloud HTTPS Integration)'
    };
  },

  /* Analytics & Baselines */
  async getLongitudinalAnalytics(userId, days = 30) {
    if (API_CONFIG.mode === 'cloud-production') {
      return httpGet(`/analytics/longitudinal?userId=${userId}&days=${days}`);
    }
    await sleep(100);
    return { status: 'delegated_to_indexeddb_local_engine', days, source: 'local-mock' };
  }
};

/* Internal HTTP Helpers for Future Cloud Integration */
async function httpPost(endpoint, body) {
  const url = `${API_CONFIG.cloudBaseUrl}${endpoint}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('mindmateAuthToken') || ''}`
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
  return res.json();
}

async function httpGet(endpoint) {
  const url = `${API_CONFIG.cloudBaseUrl}${endpoint}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('mindmateAuthToken') || ''}`
    }
  });
  if (!res.ok) throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
  return res.json();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
