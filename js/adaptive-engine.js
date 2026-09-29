import { all, put, uid } from './storage.js';

export const DOMAINS = ['memory', 'attention', 'routine', 'recognition', 'engagement'];
const MIN_SESSIONS_FOR_BASELINE = 3;
const WINDOW_SIZE = 5;

const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

/**
 * Fetch recent activity sessions for a specific domain or all domains.
 */
export async function recentAttempts(category, limit = WINDOW_SIZE, sinceMs = 0) {
  const allSessions = await all('sessions');
  return allSessions
    .filter((s) => (!category || s.category === category) && (sinceMs === 0 || s.createdAt >= Date.now() - sinceMs))
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, limit);
}

/**
 * Calculate the user's personal baseline for a cognitive domain.
 * Purely based on the individual's own performance history.
 * Guarded by insufficient-data protection.
 */
export async function baseline(category, days = null) {
  const sinceMs = days ? days * 86400000 : 0;
  const sessions = (await all('sessions'))
    .filter((s) => s.category === category && (sinceMs === 0 || s.createdAt >= Date.now() - sinceMs))
    .sort((a, b) => b.createdAt - a.createdAt);

  if (sessions.length < MIN_SESSIONS_FOR_BASELINE) {
    return {
      established: false,
      sampleSize: sessions.length,
      requiredSize: MIN_SESSIONS_FOR_BASELINE,
      score: null,
      responseTime: null,
      retries: null,
      message: `Complete ${MIN_SESSIONS_FOR_BASELINE - sessions.length} more session(s) to establish your personal baseline.`
    };
  }

  const score = sessions.reduce((acc, s) => acc + (s.accuracy || 0), 0) / sessions.length;
  const responseTime = sessions.reduce((acc, s) => acc + (s.responseTimeMs || 0), 0) / sessions.length;
  const retries = sessions.reduce((acc, s) => acc + (s.retries || 0), 0) / sessions.length;

  // Calculate recent change (compare latest 2 sessions to earlier baseline sessions)
  let baselineChange = 0;
  if (sessions.length >= 4) {
    const recentAvg = (sessions[0].accuracy + sessions[1].accuracy) / 2;
    const earlier = sessions.slice(2);
    const earlierAvg = earlier.reduce((acc, s) => acc + (s.accuracy || 0), 0) / earlier.length;
    baselineChange = Math.round((recentAvg - earlierAvg) * 100);
  }

  return {
    established: true,
    sampleSize: sessions.length,
    score: Math.round(score * 100) / 100,
    responseTime: Math.round(responseTime),
    retries: Math.round(retries * 10) / 10,
    baselineChangePercent: baselineChange,
    establishedDate: sessions[sessions.length - 1].createdAt
  };
}

/**
 * Returns baseline data for all five cognitive domains.
 */
export async function allBaselines(days = null) {
  const result = {};
  for (const d of DOMAINS) {
    result[d] = await baseline(d, days);
  }
  return result;
}

/**
 * Explainable Adaptive Decision Engine.
 * Evaluates performance telemetry against the user's personal baseline.
 * Outputs the recommended difficulty (1-5), the direction, and an explicit plain-text reason.
 */
export async function recommend(category) {
  const attempts = await recentAttempts(category, WINDOW_SIZE);
  const base = await baseline(category);

  // If no attempts exist yet, start with gentle/moderate baseline challenge level 2
  if (!attempts.length) {
    return {
      difficulty: 2,
      direction: 'hold',
      reason: 'Starting at Level 2 (gentle challenge) for your initial session.',
      metrics: { accuracy: null, avgResponseTime: null, retries: 0 }
    };
  }

  const recentAcc = attempts.reduce((s, x) => s + (x.accuracy ?? 0), 0) / attempts.length;
  const avgTime = attempts.reduce((s, x) => s + (x.responseTimeMs ?? 2500), 0) / attempts.length;
  const avgRetries = attempts.reduce((s, x) => s + (x.retries ?? 0), 0) / attempts.length;
  const currentDiff = attempts[0].difficulty || 2;

  let nextDiff = currentDiff;
  let direction = 'hold';
  let reason = '';

  const pct = Math.round(recentAcc * 100);
  const timeSec = (avgTime / 1000).toFixed(1);

  // Logic: High accuracy + brisk responses + zero/minimal retries -> Level UP
  if (recentAcc >= 0.85 && avgRetries <= 0.2 && avgTime <= 4500) {
    nextDiff = currentDiff + 1;
    direction = 'increase';
    reason = `Recent accuracy is ${pct}% with fast response times (${timeSec}s) and ${avgRetries === 0 ? 'no' : 'minimal'} retries. Challenge level stepped up.`;
  }
  // Logic: Low accuracy OR frequent retries OR very slow response -> Level DOWN
  else if (recentAcc <= 0.60 || avgRetries >= 1.2 || avgTime >= 9000) {
    nextDiff = currentDiff - 1;
    direction = 'decrease';
    if (base.established && base.score && recentAcc < base.score - 0.15) {
      reason = `Recent performance (${pct}%) is below your personal baseline. Challenge level reduced to keep activities comfortable.`;
    } else {
      reason = `Recent accuracy was ${pct}% with ${avgRetries.toFixed(1)} average retries. MINDMATE adjusted the challenge to maintain a positive experience.`;
    }
  }
  // Logic: Stable performance -> HOLD
  else {
    nextDiff = currentDiff;
    direction = 'hold';
    reason = `Recent activity performance (${pct}%) is steady and within your comfortable challenge range. Maintained at Level ${currentDiff}.`;
  }

  nextDiff = clamp(nextDiff, 1, 5);

  return {
    difficulty: nextDiff,
    currentDifficulty: currentDiff,
    direction,
    reason,
    metrics: {
      accuracy: pct,
      avgResponseTimeMs: Math.round(avgTime),
      retries: avgRetries
    }
  };
}

/**
 * Record a game or task attempt into IndexedDB sessions store and sync queue.
 */
export async function recordAttempt(data) {
  const sessionRecord = {
    id: uid('session'),
    createdAt: Date.now(),
    userId: 'local-user',
    gameId: data.gameId || `game-${data.category}`,
    category: data.category || 'memory',
    difficulty: data.difficulty || 2,
    accuracy: data.accuracy ?? 1,
    responseTimeMs: data.responseTimeMs || 2000,
    retries: data.retries || 0,
    hints: data.hints || 0,
    completionStatus: data.completionStatus || 'completed',
    metadata: data.metadata || {}
  };

  await put('sessions', sessionRecord);

  // Create an offline sync event for this telemetry record
  const syncEvent = {
    id: uid('evt-session'),
    createdAt: sessionRecord.createdAt,
    userId: 'local-user',
    deviceId: getDeviceId(),
    eventType: 'game_session',
    payload: sessionRecord,
    status: 'pending',
    retryCount: 0
  };

  await put('events', syncEvent);

  // Broadcast local event for live UI reactivity
  window.dispatchEvent(new CustomEvent('mindmate:sessionRecorded', { detail: sessionRecord }));

  return sessionRecord;
}

/**
 * Longitudinal analytics query (7, 30, or 90 days).
 * Formats data for dashboards and charts without diagnostic claims.
 */
export async function longitudinalTrends(days = 7) {
  const since = Date.now() - days * 86400000;
  const sessions = (await all('sessions'))
    .filter((s) => s.createdAt >= since)
    .sort((a, b) => a.createdAt - b.createdAt);

  const domainStats = {};
  for (const d of DOMAINS) {
    const domainSessions = sessions.filter((s) => s.category === d);
    const count = domainSessions.length;
    const avgAcc = count ? Math.round((domainSessions.reduce((acc, s) => acc + s.accuracy, 0) / count) * 100) : null;
    const avgTime = count ? Math.round(domainSessions.reduce((acc, s) => acc + s.responseTimeMs, 0) / count) : null;
    const b = await baseline(d);

    domainStats[d] = {
      sessionsCount: count,
      averageAccuracy: avgAcc,
      averageResponseTimeMs: avgTime,
      baselineEstablished: b.established,
      baselineScore: b.score ? Math.round(b.score * 100) : null,
      baselineChange: b.baselineChangePercent || 0
    };
  }

  return {
    days,
    totalSessions: sessions.length,
    domains: domainStats
  };
}

let cachedDeviceId = null;
function getDeviceId() {
  if (cachedDeviceId) return cachedDeviceId;
  let id = localStorage.getItem('mindmateDeviceId');
  if (!id) {
    id = uid('device');
    localStorage.setItem('mindmateDeviceId', id);
  }
  cachedDeviceId = id;
  return cachedDeviceId;
}
