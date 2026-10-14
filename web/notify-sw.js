/* Notification-only service worker.
   It never answers fetch events, so it caches nothing and cannot serve stale
   app files — the static app in index.html keeps clearing its own caches. */
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
