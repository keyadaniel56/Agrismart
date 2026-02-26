const CACHE_NAME = 'agrismart-v4';
const OFFLINE_URL = '/index.html';

// Assets that are essential for the app to start
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/apple-touch-icon.png',
  '/src/main.jsx',
  '/@vite/client', // For development
];

// Install: Cache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching app shell');
      return cache.addAll(APP_SHELL).catch(err => {
        console.warn('[SW] Pre-cache failed (some assets may be dynamic):', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch Strategy
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // 1. Navigation Requests: Network-first, fallback to /index.html (Offline Support)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(async (networkResponse) => {
          // Cache the latest version of index.html
          const cache = await caches.open(CACHE_NAME);
          cache.put(OFFLINE_URL, networkResponse.clone());
          return networkResponse;
        })
        .catch(async () => {
          // If network fails, serve index.html from cache
          const cachedResponse = await caches.match(OFFLINE_URL);
          if (cachedResponse) return cachedResponse;
          
          // Absolute fallback if everything fails
          return caches.match('/');
        })
    );
    return;
  }

  // 2. Static Assets & App Logic: Stale-While-Revalidate
  // This serves from cache immediately for speed, but updates in background
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then(async (networkResponse) => {
        if (networkResponse.status === 200 && (url.origin === location.origin || url.hostname.includes('fonts'))) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      }).catch(() => {
        // Silently fail if offline and not in cache
      });

      return cachedResponse || fetchPromise;
    })
  );
});
