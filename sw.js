const CACHE = 'devpath-academy-v5-react-route-fix';
const CORE = ['./', './index.html', './manifest.webmanifest', './assets/course-icon.svg'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then(response => {
      const target = new URL(event.request.url).pathname.endsWith('/react.html') ? './react.html' : './index.html';
      if (response.ok) caches.open(CACHE).then(cache => cache.put(target, response.clone()));
      return response;
    }).catch(() => caches.match(new URL(event.request.url).pathname.endsWith('/react.html') ? './react.html' : './index.html')));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok && new URL(event.request.url).origin === location.origin) caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
    return response;
  }).catch(() => caches.match('./index.html'))));
});
