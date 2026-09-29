const DB_NAME = 'mindmate-v2';
const DB_VERSION = 2;
const STORES = ['events', 'sessions', 'reminders', 'preferences', 'content', 'profiles', 'audit_logs'];

function openDB() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB unavailable in this environment'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = req.result;
      STORES.forEach((name) => {
        if (!db.objectStoreNames.contains(name)) {
          const store = db.createObjectStore(name, { keyPath: 'id', autoIncrement: false });
          if (name === 'events') {
            store.createIndex('status', 'status', { unique: false });
            store.createIndex('createdAt', 'createdAt', { unique: false });
            store.createIndex('eventType', 'eventType', { unique: false });
          }
          if (name === 'sessions') {
            store.createIndex('category', 'category', { unique: false });
            store.createIndex('createdAt', 'createdAt', { unique: false });
            store.createIndex('userId', 'userId', { unique: false });
          }
          if (name === 'reminders') {
            store.createIndex('nextAt', 'nextAt', { unique: false });
            store.createIndex('status', 'status', { unique: false });
            store.createIndex('category', 'category', { unique: false });
          }
          if (name === 'audit_logs') {
            store.createIndex('timestamp', 'timestamp', { unique: false });
            store.createIndex('role', 'role', { unique: false });
          }
        }
      });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function put(store, value) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).put(value);
    tx.oncomplete = () => res(value);
    tx.onerror = () => rej(tx.error);
  });
}

export async function get(store, id) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const r = db.transaction(store).objectStore(store).get(id);
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}

export async function all(store) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const r = db.transaction(store).objectStore(store).getAll();
    r.onsuccess = () => res(r.result || []);
    r.onerror = () => rej(r.error);
  });
}

export async function remove(store, id) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).delete(id);
    tx.oncomplete = () => res(true);
    tx.onerror = () => rej(tx.error);
  });
}

export async function clearStore(store) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).clear();
    tx.oncomplete = () => res(true);
    tx.onerror = () => rej(tx.error);
  });
}

export async function count(store) {
  return (await all(store)).length;
}

export async function ensureUser() {
  let p = await get('profiles', 'local-user');
  if (!p) {
    p = {
      id: 'local-user',
      name: localStorage.getItem('mindmateName') || 'Elder Participant',
      createdAt: Date.now(),
      role: 'patient',
      language: localStorage.getItem('mindmateLanguage') || 'en',
      assistedMode: localStorage.getItem('mindmateAssistedMode') === 'true',
      consentGiven: localStorage.getItem('mindmateConsentGiven') === 'true',
      consentDate: localStorage.getItem('mindmateConsentDate') || null
    };
    await put('profiles', p);
  }
  return p;
}

export async function logAudit(role, action, details = {}) {
  const entry = {
    id: uid('audit'),
    timestamp: Date.now(),
    role: role || 'patient',
    action,
    details
  };
  try {
    await put('audit_logs', entry);
  } catch (err) {
    console.warn('Audit log write error:', err);
  }
  return entry;
}

export async function exportAllData() {
  const data = {};
  for (const s of STORES) {
    data[s] = await all(s);
  }
  data.exportedAt = Date.now();
  data.version = DB_VERSION;
  return data;
}

export async function resetAllData() {
  for (const s of STORES) {
    await clearStore(s);
  }
  localStorage.removeItem('mindmateDeviceId');
  localStorage.removeItem('mindmateLastSync');
  await ensureUser();
  return true;
}

export function uid(prefix = 'evt') {
  return `${prefix}-${crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(36).slice(2, 9)}`;
}
