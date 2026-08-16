const CACHE = 'mypool-github-pages-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './service-worker.js',
  './mqttws31.min.js',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(async cache => {
        for (const url of ASSETS) {
          try { await cache.add(url); } catch (err) { console.warn('Skip caching', url, err); }
        }
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
