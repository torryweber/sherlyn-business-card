/* =========================================
   SHERLYN CHONG
   SERVICE WORKER
   PWA / NFC BUSINESS CARD
========================================= */


/* =========================================
   CACHE VERSION
========================================= */

const CACHE_NAME =
    "sherlyn-card-v2";


/* =========================================
   FILES
========================================= */

const APP_FILES = [

    "./",

    "./index.html",

    "./style.css",

    "./script.js",

    "./manifest.json",

    "./sherlyn.jpg",

    "./weber-logo.png",

    "./share-preview.png"

];


/* =========================================
   INSTALL
========================================= */

self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches
                .open(
                    CACHE_NAME
                )
                .then(
                    cache => {

                        return cache.addAll(
                            APP_FILES
                        );

                    }
                )

        );


        self.skipWaiting();

    }
);


/* =========================================
   ACTIVATE
========================================= */

self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches
                .keys()
                .then(
                    cacheNames => {

                        return Promise.all(

                            cacheNames
                                .filter(
                                    cacheName =>
                                        cacheName !==
                                        CACHE_NAME
                                )
                                .map(
                                    cacheName =>
                                        caches.delete(
                                            cacheName
                                        )
                                )

                        );

                    }
                )

        );


        self.clients.claim();

    }
);


/* =========================================
   FETCH
========================================= */

self.addEventListener(
    "fetch",
    event => {

        if (
            event.request.method !==
            "GET"
        ) {

            return;

        }


        event.respondWith(

            caches
                .match(
                    event.request
                )
                .then(
                    cachedResponse => {

                        if (
                            cachedResponse
                        ) {

                            return cachedResponse;

                        }


                        return fetch(
                            event.request
                        )
                        .then(
                            networkResponse => {

                                if (
                                    networkResponse &&
                                    networkResponse.status === 200 &&
                                    networkResponse.type ===
                                        "basic"
                                ) {

                                    const responseClone =
                                        networkResponse.clone();


                                    caches
                                        .open(
                                            CACHE_NAME
                                        )
                                        .then(
                                            cache => {

                                                cache.put(
                                                    event.request,
                                                    responseClone
                                                );

                                            }
                                        );

                                }


                                return networkResponse;

                            }
                        );

                    }
                )

        );

    }
);