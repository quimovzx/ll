self.addEventListener("install",(event)=>{

    event.waitUntil(

        caches.open("cyber-cache")

        .then(cache=>{

            return cache.addAll([

                "/",
                "/index.html",
                "/style.css",
                "/app.js",
                "/admin.html",
                "/admin.js"

            ]);
        })
    );
});

self.addEventListener("fetch",(event)=>{

    event.respondWith(

        caches.match(event.request)

        .then(response=>{

            return response || fetch(event.request);

        })
    );
});