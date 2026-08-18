const CACHE = 'devpath-academy-v19-react-reader';
const CORE = [
  './', './index.html', './react.html', './manifest.webmanifest',
  './assets/course-icon.svg', './assets/highlight.min.js',
  './assets/highlight-http.min.js', './assets/highlight-github-dark.min.css',
  './assets/devpath-bundle.css', './assets/course-data.js',
  './assets/course-reader.js', './assets/learning-dashboard.js',
  './assets/catalog-sources.js', './assets/catalog-relationships.js',
  './assets/platform-bundle.js'
];

self.addEventListener('install', event => {
  event.waitUntil((async() => {
    const cache = await caches.open(CACHE);
    await Promise.all(CORE.map(async asset => {
      const response = await fetch(asset, {cache: 'reload'});
      if (!response.ok) throw new Error(`Unable to cache ${asset}`);
      await cache.put(asset, response);
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys()
      .then(keys => Promise.all(
          keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim()));
});

const unavailable = () => new Response('DevPath Academy is unavailable offline.', {
  status: 503,
  headers: {'Content-Type': 'text/plain; charset=utf-8'}
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  if (event.request.mode === 'navigate') {
    event.respondWith((async() => {
      const target = new URL(event.request.url).pathname.endsWith('/react.html') ?
          './react.html' : './index.html';
      try {
        const response = await fetch(event.request);
        if (response.ok) {
          const copy = response.clone();
          event.waitUntil(
              caches.open(CACHE).then(cache => cache.put(target, copy)));
        }
        return response;
      } catch {
        return await caches.match(target) || unavailable();
      }
    })());
    return;
  }

  event.respondWith((async() => {
    try {
      // Runtime assets use stable names. Revalidate online so a previous
      // service worker or HTTP cache can never pin an obsolete bundle.
      const response = await fetch(event.request, {cache: 'no-cache'});
      if (response.ok &&
          new URL(event.request.url).origin === self.location.origin) {
        const copy = response.clone();
        event.waitUntil(
            caches.open(CACHE).then(cache => cache.put(event.request, copy)));
      }
      return response;
    } catch {
      return await caches.match(event.request) || unavailable();
    }
  })());
});
