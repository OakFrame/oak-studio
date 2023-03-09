self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open('keypiece').then(function(cache) {
            return cache.addAll([
                '/',
                '/app.html',
                '/style.css',
                '/bundle.min.js',
                'https://use.fontawesome.com/releases/v5.8.2/css/all.css'
            ]);
        })
    );
});

self.addEventListener('fetch', function(event) {
    console.log(event.request.url);

    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});
