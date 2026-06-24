const CACHE_NAME = 'ielts-prep-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Failed to cache URLs:', error);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).catch((error) => {
          console.error('Fetch failed:', error);
          // Return a custom offline page or error response if needed
          return new Response('Offline - No network connection', {
            status: 503,
            statusText: 'Service Unavailable',
          });
        });
      })
  );
});

self.addEventListener('push', (event) => {
  try {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'IELTS Reminder';
    const options = {
      body: data.body || 'Time to study!',
      icon: '/icons/icon.svg',
      badge: '/icons/icon.svg',
    };
    event.waitUntil(self.registration.showNotification(title, options));
  } catch (error) {
    console.error('Error handling push notification:', error);
  }
});
