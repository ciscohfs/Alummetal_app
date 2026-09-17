const CACHE_NAME = 'alum-metal-web-v12';
const ASSETS = ['./', './index.html', './styles.css', './app.js', './prices.json', './catalog.json', './calculator.json', './alloys.json', './manifest.webmanifest', './logo1.png', './favicon-48.png', './apple-touch-icon.png', './icon-192.png', './icon-512.png', './Yekan.ttf', './BYekan.ttf', './site-hero.png', './factory-banner.jpg'];
const NETWORK_FIRST = new Set(['index.html', 'styles.css', 'app.js', 'sw.js', 'prices.json', 'catalog.json', 'calculator.json', 'alloys.json']);
self.addEventListener('install', (event) => event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', (event) => event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const file = new URL(request.url).pathname.split('/').pop();
  if (request.method !== 'GET') return;
  if (NETWORK_FIRST.has(file)) {
    event.respondWith(fetch(request).then((response) => { const copy = response.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)); return response; }).catch(() => caches.match(request).then((cached) => cached || caches.match('./index.html'))));
  } else {
    event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => { const copy = response.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)); return response; })));
  }
});
