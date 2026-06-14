const CACHE_NAME = 'elan-french-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './index.css',
  './app.js',
  './sentences.json',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  
  // Pre-generated Audio Files
  './audio/greet_01.mp3',
  './audio/greet_02.mp3',
  './audio/greet_03.mp3',
  './audio/greet_04.mp3',
  './audio/greet_05.mp3',
  './audio/greet_06.mp3',
  './audio/travel_01.mp3',
  './audio/travel_02.mp3',
  './audio/travel_03.mp3',
  './audio/travel_04.mp3',
  './audio/travel_05.mp3',
  './audio/food_01.mp3',
  './audio/food_02.mp3',
  './audio/food_03.mp3',
  './audio/food_04.mp3',
  './audio/food_05.mp3',
  './audio/shop_01.mp3',
  './audio/shop_02.mp3',
  './audio/shop_03.mp3',
  './audio/shop_04.mp3',
  './audio/help_01.mp3',
  './audio/help_02.mp3',
  './audio/help_03.mp3',
  './audio/help_04.mp3'
];

// Install Event - cache all static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching static resources');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event - clear old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Clearing old service worker cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - network first, fallback to cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // If valid network response, clone and update cache
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Network failed, try fetching from cache
        return caches.match(event.request);
      })
  );
});
