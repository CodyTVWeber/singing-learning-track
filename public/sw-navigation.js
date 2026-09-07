function isNavigationRequest(request) {
  return request.mode === 'navigate' || request.destination === 'document';
}

function serveAppShell(cacheName, offlineUrl, shellUrl) {
  return caches.open(cacheName).then((cache) =>
    cache.match(shellUrl).then((shell) => shell || cache.match(offlineUrl))
  );
}
