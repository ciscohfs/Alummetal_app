const CACHE_NAME = 'alum-metal-web-v8';
const ASSETS = ['./', './index.html', './styles.css', './app.js', './prices.json', './catalog.json', './calculator.json', './alloys.json', './manifest.webmanifest', './logo1.png', './Yekan.ttf', './BYekan.ttf', './site-hero.png', './factory-banner.jpg'];
self.addEventListener('install', (event) => event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))));
self.addEventListener('activate', (event) => event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))));
self.addEventListener('fetch', (event) => event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => { const copy = response.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)); return response; }).catch(() => caches.match('./index.html')))));
