const CACHE_NAME = "myservice-cache-v27";
const BUILD_ID = "42-ai-turntaking-call-window";

const APP_SHELL = [
  "./styles.css?v=4-pro-desktop",
  "./manifest.json",
  "./install.html"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(
      names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
    );

    await self.clients.claim();

    const clients = await self.clients.matchAll({
      type: "window",
      includeUncontrolled: true
    });

    for (const client of clients) {
      try {
        const url = new URL(client.url);
        if (!url.pathname.endsWith("/install.html")) {
          url.searchParams.set("build", BUILD_ID);
          await client.navigate(url.href);
        }
      } catch (_) {}
    }
  })());
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  const sameOrigin = url.origin === self.location.origin;

  // Never serve stale HTML or JavaScript for the app.
  if (
    event.request.mode === "navigate" ||
    (sameOrigin && (url.pathname.endsWith("/index.html") || url.pathname.endsWith("/app.js") || url.pathname.endsWith("/")))
  ) {
    event.respondWith(
      fetch(event.request, { cache: "no-store" }).catch(() => caches.match("./install.html"))
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (sameOrigin && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
