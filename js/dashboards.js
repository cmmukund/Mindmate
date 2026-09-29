import { all } from './storage.js';
import { allBaselines, longitudinalTrends, recentAttempts, recommend, DOMAINS } from './adaptive-engine.js';
import { calculateAdherence, getReminders, REMINDER_STATES } from './reminder-engine.js';
import { queueCount, isOffline } from './sync-queue.js';
import { currentPack } from './content-packs.js';

let activeDaysFilter = 7;

export async function refreshAllDashboards() {
  await refreshPatientDashboard(activeDaysFilter);
  await refreshCaregiverDashboard(30);
  await refreshHealthWorkerDashboard(30);
}

/* =========================================================================
   1. PATIENT DASHBOARD ("My Progress")
   ========================================================================= */
export async function refreshPatientDashboard(days = 7) {
  activeDaysFilter = days;
  const pack = currentPack();
  const baselines = await allBaselines(days);
  const adh = await calculateAdherence(null, days);
  const qCount = await queueCount();
  const sessions = await recentAttempts(null, 5);

  // Overall Cognitive Activity Performance
  const establishedList = Object.values(baselines).filter((b) => b.established);
  const avgScore = establishedList.length
    ? Math.round((establishedList.reduce((acc, b) => acc + b.score, 0) / establishedList.length) * 100)
    : null;

  const scoreEl = document.getElementById('score');
  if (scoreEl) scoreEl.textContent = avgScore !== null ? `${avgScore}%` : '—';

  const perfBar = document.getElementById('performanceBar');
  const perfText = document.getElementById('performanceText');
  if (perfBar) perfBar.style.width = avgScore !== null ? `${avgScore}%` : '0%';
  if (perfText) perfText.textContent = avgScore !== null ? `${avgScore}%` : 'Baseline pending';

  // Personal Baselines Breakdown per Domain
  const baselineHost = document.getElementById('patientBaselineGrid');
  if (baselineHost) {
    baselineHost.replaceChildren();

    DOMAINS.forEach((d) => {
      const b = baselines[d];
      const card = document.createElement('div');
      card.className = 'metric';

      const label = document.createElement('div');
      label.className = 'metric-label';
      label.textContent = pack.domainTitles[d] || d.toUpperCase();

      const stat = document.createElement('p');
      stat.className = 'stat';

      const changeSpan = document.createElement('small');
      changeSpan.className = 'stat-change';

      if (b.established) {
        stat.textContent = `${Math.round(b.score * 100)}%`;
        const chg = b.baselineChangePercent || 0;
        if (chg > 0) {
          changeSpan.textContent = `↑ +${chg}% vs earlier baseline`;
          changeSpan.classList.add('stat-up');
        } else if (chg < 0) {
          changeSpan.textContent = `↓ ${chg}% vs earlier baseline`;
          changeSpan.classList.add('stat-down');
        } else {
          changeSpan.textContent = `─ Steady vs baseline`;
        }
      } else {
        stat.textContent = '—';
        changeSpan.textContent = `Pending (${b.sampleSize}/3 sessions)`;
      }

      card.append(label, stat, changeSpan);
      baselineHost.appendChild(card);
    });
  }

  // Sync Status Indicator
  const syncEls = document.querySelectorAll('[data-v2-sync]');
  syncEls.forEach((el) => {
    if (isOffline()) {
      el.textContent = `📴 Offline: ${qCount} event(s) waiting to sync`;
    } else if (qCount > 0) {
      el.textContent = `🔄 Syncing: ${qCount} event(s) pending`;
    } else {
      el.textContent = '🟢 All local events synchronized';
    }
  });

  // Reminder Adherence Indicator
  const adhEl = document.querySelector('[data-v2-adherence]');
  if (adhEl) {
    adhEl.textContent = adh.completedRate !== null ? `${adh.completedRate}% completed` : 'No reminder events recorded yet';
  }
}

/* =========================================================================
   2. CAREGIVER DASHBOARD
   ========================================================================= */
export async function refreshCaregiverDashboard(days = 30) {
  const pack = currentPack();
  const baselines = await allBaselines(days);
  const adh = await calculateAdherence(null, days);
  const qCount = await queueCount();
  const recentSessions = await recentAttempts(null, 6);
  const reminders = await getReminders();

  // Caregiver Overview Stats
  const careScore = document.getElementById('careScore');
  const establishedList = Object.values(baselines).filter((b) => b.established);
  const avg = establishedList.length
    ? Math.round((establishedList.reduce((s, x) => s + x.score, 0) / establishedList.length) * 100)
    : null;

  if (careScore) careScore.textContent = avg !== null ? `${avg}%` : '—';

  const careAdherence = document.getElementById('careAdherenceStat');
  if (careAdherence) careAdherence.textContent = adh.completedRate !== null ? `${adh.completedRate}%` : '—';

  const careSync = document.getElementById('careSyncStat');
  if (careSync) careSync.textContent = qCount > 0 ? `${qCount} Pending` : 'Up to date';

  // One plain-language, non-diagnostic action card for a family caregiver.
  const attentionCard = document.getElementById('caregiverAttentionCard');
  if (attentionCard) {
    const missedOrDue = reminders.filter((r) => r.status === REMINDER_STATES.MISSED || r.status === REMINDER_STATES.TRIGGERED);
    attentionCard.classList.toggle('is-clear', missedOrDue.length === 0);
    attentionCard.textContent = missedOrDue.length
      ? `Needs attention (local prototype): ${missedOrDue.length} reminder${missedOrDue.length > 1 ? 's are' : ' is'} missed or awaiting confirmation. Please check in with the elder.`
      : 'Routine check: no local reminders currently need follow-up. This prototype does not send remote caregiver alerts.';
  }

  // Adaptive personalization explanations feed
  const careExplanation = document.querySelector('[data-v2-care-explanation]');
  if (careExplanation) {
    careExplanation.replaceChildren();

    const explanationsContainer = document.createElement('div');
    explanationsContainer.className = 'caregiver-explanations-list';

    for (const d of DOMAINS) {
      const rec = await recommend(d);
      const b = baselines[d];
      const item = document.createElement('div');
      item.className = 'explanation-item';

      const title = document.createElement('strong');
      title.textContent = `${pack.domainTitles[d] || d.toUpperCase()} (Next Challenge: Level ${rec.difficulty})`;

      const reasonP = document.createElement('p');
      reasonP.textContent = rec.reason;

      const subNote = document.createElement('small');
      subNote.textContent = b.established
        ? `Personal Baseline: ${Math.round(b.score * 100)}% (${b.sampleSize} sessions recorded)`
        : 'Baseline is pending further session data.';

      item.append(title, reasonP, subNote);
      explanationsContainer.appendChild(item);
    }
    careExplanation.appendChild(explanationsContainer);
  }

  // Caregiver Recent Sessions Table
  const sessionLogArea = document.getElementById('caregiverRecentSessions');
  if (sessionLogArea) {
    sessionLogArea.replaceChildren();

    if (!recentSessions.length) {
      const p = document.createElement('p');
      p.className = 'insight';
      p.textContent = 'No activity sessions recorded yet on this device.';
      sessionLogArea.appendChild(p);
    } else {
      const table = document.createElement('table');
      table.className = 'elder-data-table';
      table.innerHTML = `
        <thead>
          <tr>
            <th>Domain</th>
            <th>Difficulty</th>
            <th>Accuracy</th>
            <th>Response Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody></tbody>
      `;
      const tbody = table.querySelector('tbody');

      recentSessions.forEach((s) => {
        const row = document.createElement('tr');
        const domName = pack.domainTitles[s.category] || s.category.toUpperCase();
        const accPct = `${Math.round((s.accuracy || 0) * 100)}%`;
        const timeSec = `${((s.responseTimeMs || 0) / 1000).toFixed(1)}s`;
        const statusText = s.completionStatus || 'completed';

        row.innerHTML = `
          <td><strong>${domName}</strong></td>
          <td>Level ${s.difficulty || 2}</td>
          <td>${accPct}</td>
          <td>${timeSec}</td>
          <td><span class="status-pill pill-${statusText}">${statusText}</span></td>
        `;
        tbody.appendChild(row);
      });
      sessionLogArea.appendChild(table);
    }
  }

  // Caregiver Missed / Pending Reminders
  const missedList = document.getElementById('caregiverMissedReminders');
  if (missedList) {
    missedList.replaceChildren();
    const missedReminders = reminders.filter((r) => r.status === REMINDER_STATES.MISSED || r.status === REMINDER_STATES.TRIGGERED);

    if (!missedReminders.length) {
      const p = document.createElement('p');
      p.className = 'insight';
      p.textContent = '✓ No missed or overdue reminders today. Great routine adherence!';
      missedList.appendChild(p);
    } else {
      missedReminders.forEach((r) => {
        const item = document.createElement('div');
        item.className = 'alert attention';
        item.innerHTML = `
          <div>${r.icon || '⏰'}</div>
          <div>
            <strong>${r.time} · ${r.title}</strong>
            <span>Status: ${r.status.toUpperCase()}</span>
          </div>
        `;
        missedList.appendChild(item);
      });
    }
  }
}

/* =========================================================================
   3. HEALTH WORKER VIEW (Permission-Limited Routine & Longitudinal Telemetry)
   ========================================================================= */
export async function refreshHealthWorkerDashboard(days = 30) {
  const trends = await longitudinalTrends(days);
  const adh = await calculateAdherence(null, days);
  const container = document.getElementById('healthMetrics');
  if (!container) return;

  container.replaceChildren();

  // Summary Metrics
  const card1 = createMetricCard('Total Activity Sessions', trends.totalSessions, `Recorded in last ${days} days`);
  const card2 = createMetricCard('Routine Adherence Rate', adh.completedRate !== null ? `${adh.completedRate}%` : '—', `${adh.counts.completed} completed, ${adh.counts.missed} missed`);
  const card3 = createMetricCard('Medication Adherence', adh.categories.medicine?.adherenceRate !== null ? `${adh.categories.medicine.adherenceRate}%` : '—', 'Prescribed routines');

  container.append(card1, card2, card3);

  // Longitudinal Breakdown by Domain
  const domainGrid = document.getElementById('healthDomainBreakdown');
  if (domainGrid) {
    domainGrid.replaceChildren();

    Object.entries(trends.domains).forEach(([d, stats]) => {
      const card = document.createElement('div');
      card.className = 'metric';

      const label = document.createElement('div');
      label.className = 'metric-label';
      label.textContent = d.toUpperCase();

      const stat = document.createElement('p');
      stat.className = 'stat';
      stat.textContent = stats.averageAccuracy !== null ? `${stats.averageAccuracy}%` : '—';

      const sub1 = document.createElement('small');
      sub1.textContent = stats.sessionsCount > 0
        ? `Avg latency: ${stats.averageResponseTimeMs ? (stats.averageResponseTimeMs / 1000).toFixed(1) + 's' : '—'} · ${stats.sessionsCount} sessions`
        : 'No session data in period';

      const sub2 = document.createElement('small');
      sub2.textContent = stats.baselineEstablished
        ? `Personal Baseline: ${stats.baselineScore}% (Trend: ${stats.baselineChange >= 0 ? '+' : ''}${stats.baselineChange}%)`
        : 'Baseline pending (needs 3+ sessions)';

      card.append(label, stat, sub1, sub2);
      domainGrid.appendChild(card);
    });
  }
}

function createMetricCard(label, val, note) {
  const card = document.createElement('div');
  card.className = 'metric';

  const l = document.createElement('div');
  l.className = 'metric-label';
  l.textContent = label;

  const s = document.createElement('p');
  s.className = 'stat';
  s.textContent = String(val);

  const n = document.createElement('small');
  n.textContent = note;

  card.append(l, s, n);
  return card;
}
