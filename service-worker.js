const CACHE = 'mindmate-v2-cache-2';
const CORE = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/agent.js',
  './js/bootstrap.js',
  './js/storage.js',
  './js/adaptive-engine.js',
  './js/games-engine.js',
  './js/journey.js',
  './js/reminder-engine.js',
  './js/reminder-ui.js',
  './js/sync-queue.js',
  './js/api-client.js',
  './js/auth-rbac.js',
  './js/assisted-mode.js',
  './js/voice-assistant.js',
  './js/dashboards.js',
  './js/demo-mode.js',
  './js/content-packs.js',
  './js/notifications.js',
  './manifest.json',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      return (
        cached ||
        fetch(e.request)
          .then((r) => {
            const copy = r.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
            return r;
          })
          .catch(() => cached)
      );
    })
  );
});
