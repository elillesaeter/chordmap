// Offline support.
// - The page itself (navigations): network first, so a deploy shows up on the next load. Falls back to the cache offline.
// - Everything else (icons, fonts, manifest): served from cache, refreshed in the background.
// Installs always bypass the browser's HTTP cache, so a new version can never precache an old index.html.
const CACHE = 'chordmap-v8';
const PRECACHE = ['./', 'index.html', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE)
    .then(c => c.addAll(PRECACHE.map(u => new Request(u, { cache: 'reload' }))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const res = await fetch(req, { cache: 'no-cache' });
        if (res.ok) cache.put('./', res.clone());
        return res;
      } catch {
        return (await cache.match('./')) || (await cache.match('index.html')) || Response.error();
      }
    })());
    return;
  }

  e.respondWith(caches.open(CACHE).then(async cache => {
    const cached = await cache.match(req);
    const fresh = fetch(req)
      .then(res => { if (res.ok || res.type === 'opaque') cache.put(req, res.clone()); return res; })
      .catch(() => cached);
    return cached || fresh;
  }));
});
