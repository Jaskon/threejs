var cacheName = 'offline-v0.9';
var filesToCache = [
    'test.html',
    'https://rawgit.com/mrdoob/three.js/master/build/three.js',
    'https://rawgit.com/mrdoob/three.js/master/examples/js/loaders/MTLLoader.js',
    'https://rawgit.com/mrdoob/three.js/master/examples/js/loaders/OBJLoader.js',
    'https://rawgit.com/mrdoob/three.js/master/examples/js/libs/stats.min.js',
    'socket.io-1.3.7.js',
    'test.css',
    'controls.js',
    'preload.js',
    'test.js',
    'model/Fluttershy1.js',
    'sw-register.js',
    'manifest.json',

    // Fluttershy model parts
    'model/fluttershy_wings.png',
    'model/fluttershy_tail.png',
    'model/fluttershy_hair_back.png',
    'model/BaseNeckTex.png',
    'model/FlutterGemTex.png',
    'model/fluttershy_eyes.png',
    'model/fluttershy_hair_front.png',
    'model/fluttershy_body.png',

    'sprite.png',
    'sprite1.png'
];

self.addEventListener('install', function(event) {
    console.log('[sw] Install event');
    event.waitUntil(
        Promise.all([
            caches.open(cacheName).then(function(cache) {
                console.log('[sw] Caching app');
                return cache.addAll(filesToCache);
            }),
            self.skipWaiting()
        ])
    );
});

self.addEventListener('activate', function(event) {
    console.log('[sw] Activate event');
    event.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(keys.map(function(key) {
                if (key !== cacheName) {
                    console.log('[sw] Removing old cache. Key: ' + key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    console.log('[sw] Fetching: ' + event.request.url);

    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});
