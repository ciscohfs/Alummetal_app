const CACHE_NAME = 'alum-metal-web-v22';
const ASSETS = ['./', './index.html', './styles.css', './app.js', './catalog.json', './calculator.json', './alloys.json', './manifest.webmanifest', './img/logo1.png', './img/favicon-48.png', './img/apple-touch-icon.png', './img/icon-192.png', './img/icon-512.png', './fonts/Yekan.ttf', './fonts/BYekan.ttf', './img/site-hero.png', './img/factory-banner.jpg'];
const NETWORK_FIRST = new Set(['index.html', 'styles.css', 'app.js', 'sw.js', 'catalog.json', 'calculator.json', 'alloys.json']);
self.addEventListener('install', (event) => event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', (event) => event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const file = new URL(request.url).pathname.split('/').pop();
  if (request.method !== 'GET') return;
  if (NETWORK_FIRST.has(file)) {
    event.respondWith(fetch(request, { cache: 'no-store' }).then((response) => { const copy = response.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)); return response; }).catch(() => caches.match(request).then((cached) => cached || caches.match('./index.html'))));
  } else {
    event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => { const copy = response.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)); return response; })));
  }
});
