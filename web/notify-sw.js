/* Notification-only service worker.
   It answers nothing but a tap on the one alert this app sends — the new-version
   alert — so it caches nothing and can never serve a stale app file. */
self.addEventListener('install', (event) => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
    for (const window of windows) {
      if ('focus' in window) {
        if ('navigate' in window) window.navigate('./index.html').catch(() => {});
        return window.focus();
      }
    }
    return clients.openWindow('./index.html');
  }));
});
