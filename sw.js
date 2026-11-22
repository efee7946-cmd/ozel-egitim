const CACHE_NAME = 'yildizcan-shell-v6';

const PRECACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/aac.css',
    '/script.js',
    '/db-client.js',
    '/aac-data.js',
    '/reply-engine.js',
    '/therapy-replies.js',
    '/report-text.js',
    '/avatar3d.js',
    '/avatar.png',
    '/vendor/confetti.browser.js',
    '/vendor/three/three.module.min.js'
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

    if (url.origin !== self.location.origin) return;

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
