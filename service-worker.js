const CACHE = 'mypool-v9';
const ASSETS = [
  'mypool.html',
  'mqttws31.min.js',
  'manifest_fixed.json'
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
