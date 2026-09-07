const CACHE_NAME = 'kooka-cache-v2';
const OFFLINE_URL = '/offline.html';
const APP_SHELL_URL = '/';
const PRECACHE_URLS = [
  '/',
  OFFLINE_URL,
  '/img/kooka-burra-waiving.png',
  '/img/kooka-burra-singing.png',
  '/img/kooka-burra-flying.png',
  '/img/kooka-burra-calling-out.png',
  '/img/kooka-burra-dancing.png',
  '/img/kooka-burra-flying-blue-sky-clouds-bg.jpg',
  '/img/kooka-burra-breathing.png',
  '/audio/echo_prompt.mp3',
];

function isNavigationRequest(request) {
  return request.mode === 'navigate' || request.destination === 'document';
}

function shouldUseNetworkNavigationResponse(response, requestUrl) {
  if (!response || !response.ok) {
    return false;
  }

  if (response.redirected) {
    return false;
  }

  try {
    const requestPath = new URL(requestUrl).pathname;
    const responsePath = new URL(response.url).pathname;
    return requestPath === responsePath;
  } catch {
    return false;
  }
}

function serveAppShell(cacheName, offlineUrl, shellUrl) {
  return caches.open(cacheName).then((cache) =>
    cache.match(shellUrl).then((shell) => {
      const source = shell ? Promise.resolve(shell) : cache.match(offlineUrl);
      return source.then((cached) => {
        if (!cached) {
          return cached;
        }

        return cached.text().then(
          (body) =>
            new Response(body, {
              status: 200,
              headers: { 'Content-Type': 'text/html' },
            })
        );
      });
    })
  );
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((key) => key !== CACHE_NAME ? caches.delete(key) : Promise.resolve()))).then(() => self.clients.claim())
  );
});

function handleNavigationRequest(request) {
  return fetch(request)
    .then((response) => {
      if (shouldUseNetworkNavigationResponse(response, request.url)) {
        return response;
      }
      return serveAppShell(CACHE_NAME, OFFLINE_URL, APP_SHELL_URL);
    })
    .catch(() => serveAppShell(CACHE_NAME, OFFLINE_URL, APP_SHELL_URL));
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
          return networkResponse;
        })
        .catch(() => cached || caches.match(OFFLINE_URL));

      return cached || fetchPromise;
    })
  );
});
