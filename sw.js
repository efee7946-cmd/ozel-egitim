const CACHE_NAME = 'yildizcan-shell-v1';

const PRECACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/aac.css',
    '/script.js',
    '/db-client.js',
    '/aac-data.js',
    '/avatar3d.js',
    '/avatar.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;

    const url = new URL(req.url);

    if (url.pathname.startsWith('/api/')) return;

    const isCdn = url.hostname === 'cdn.jsdelivr.net';
    if (!isCdn && url.origin !== self.location.origin) return;

    if (isCdn) {
        event.respondWith(
            caches.match(req).then((cached) => {
                const fetched = fetch(req).then((res) => {
                    if (res.ok) {
                        const clone = res.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
                    }
                    return res;
                }).catch(() => cached);
                return cached || fetched;
            })
        );
        return;
    }

    event.respondWith(
        fetch(req).then((res) => {
            if (res.ok) {
                const clone = res.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
            }
            return res;
        }).catch(() =>
            caches.match(req).then((cached) => cached || (req.mode === 'navigate' ? caches.match('/index.html') : undefined))
        )
    );
});
