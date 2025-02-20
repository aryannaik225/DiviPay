self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("divipay-cache").then((cache) => {
      return cache.addAll([
        "/",
        "/manifest.json",
        "/icon-192x192.png",
        "/icon-256x256.png",
        "/icon-384x384.png",
        "/icon-512x512.png",
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
