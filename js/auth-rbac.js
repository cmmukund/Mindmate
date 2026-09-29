import { logAudit, get, put } from './storage.js';

export const ROLES = {
  PATIENT: 'patient',
  CAREGIVER: 'caregiver',
  HEALTHWORKER: 'healthworker',
  ADMIN: 'admin'
};

// Local role previews are intentionally not presented as real authentication.
// A deployed version must enforce identity and permissions server-side.

const PERMISSIONS = {
  patient: ['home', 'journey', 'games', 'reminders', 'dashboard'],
  caregiver: ['home', 'journey', 'games', 'reminders', 'dashboard', 'caregiver'],
  healthworker: ['home', 'journey', 'games', 'reminders', 'dashboard', 'caregiver', 'healthworker'],
  admin: ['home', 'journey', 'games', 'reminders', 'dashboard', 'caregiver', 'healthworker', 'admin']
};

let currentRole = localStorage.getItem('mindmateUserRole') || ROLES.PATIENT;

export function getActiveRole() {
  return currentRole;
}

export function canAccess(pageId, role = currentRole) {
  const allowed = PERMISSIONS[role] || PERMISSIONS.patient;
  return allowed.includes(pageId);
}

/**
 * Switch role with PIN authentication.
 */
export async function authenticateRole(targetRole) {
  if (targetRole === ROLES.PATIENT) {
    currentRole = ROLES.PATIENT;
    localStorage.setItem('mindmateUserRole', currentRole);
    await logAudit(currentRole, 'role_switched', { targetRole });
    window.dispatchEvent(new CustomEvent('mindmate:roleChanged', { detail: { role: currentRole } }));
    return { success: true, role: currentRole };
  }

  if (Object.values(ROLES).includes(targetRole)) {
    currentRole = targetRole;
    localStorage.setItem('mindmateUserRole', currentRole);
    await logAudit(currentRole, 'demo_role_preview', { targetRole });
    window.dispatchEvent(new CustomEvent('mindmate:roleChanged', { detail: { role: currentRole } }));
    return { success: true, role: currentRole };
  }

  await logAudit(currentRole, 'role_switched_failed', { targetRole });
  return { success: false, message: 'This prototype role is unavailable.' };
}

/**
 * Consent and Privacy Management
 */
export async function getConsentStatus() {
  const profile = await get('profiles', 'local-user');
  return {
    consentGiven: profile?.consentGiven || localStorage.getItem('mindmateConsentGiven') === 'true',
    consentDate: profile?.consentDate || localStorage.getItem('mindmateConsentDate') || null
  };
}

export async function grantConsent() {
  const dateStr = new Date().toISOString();
  localStorage.setItem('mindmateConsentGiven', 'true');
  localStorage.setItem('mindmateConsentDate', dateStr);

  const profile = (await get('profiles', 'local-user')) || { id: 'local-user' };
  profile.consentGiven = true;
  profile.consentDate = dateStr;
  await put('profiles', profile);

  await logAudit(currentRole, 'consent_granted', { timestamp: dateStr, policyVersion: '2.0' });
  window.dispatchEvent(new CustomEvent('mindmate:consentUpdated', { detail: { consentGiven: true } }));
  return true;
}

export async function revokeConsent() {
  localStorage.removeItem('mindmateConsentGiven');
  localStorage.removeItem('mindmateConsentDate');

  const profile = (await get('profiles', 'local-user')) || { id: 'local-user' };
  profile.consentGiven = false;
  profile.consentDate = null;
  await put('profiles', profile);

  await logAudit(currentRole, 'consent_revoked', { timestamp: Date.now() });
  window.dispatchEvent(new CustomEvent('mindmate:consentUpdated', { detail: { consentGiven: false } }));
  return true;
}
