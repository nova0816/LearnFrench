const CACHE_NAME = 'elan-french-cache-v3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './index.css',
  './app.js',
  './sentences.json',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  
  // Pre-generated Audio Files - Normal & Slow (40 sentences = 80 files)
  // At the Hotel
  './audio/hotel_01.mp3', './audio/hotel_01_slow.mp3',
  './audio/hotel_02.mp3', './audio/hotel_02_slow.mp3',
  './audio/hotel_03.mp3', './audio/hotel_03_slow.mp3',
  './audio/hotel_04.mp3', './audio/hotel_04_slow.mp3',
  './audio/hotel_05.mp3', './audio/hotel_05_slow.mp3',
  './audio/hotel_06.mp3', './audio/hotel_06_slow.mp3',
  './audio/hotel_07.mp3', './audio/hotel_07_slow.mp3',
  './audio/hotel_08.mp3', './audio/hotel_08_slow.mp3',
  './audio/hotel_09.mp3', './audio/hotel_09_slow.mp3',
  './audio/hotel_10.mp3', './audio/hotel_10_slow.mp3',

  // On the Bus
  './audio/bus_01.mp3', './audio/bus_01_slow.mp3',
  './audio/bus_02.mp3', './audio/bus_02_slow.mp3',
  './audio/bus_03.mp3', './audio/bus_03_slow.mp3',
  './audio/bus_04.mp3', './audio/bus_04_slow.mp3',
  './audio/bus_05.mp3', './audio/bus_05_slow.mp3',
  './audio/bus_06.mp3', './audio/bus_06_slow.mp3',
  './audio/bus_07.mp3', './audio/bus_07_slow.mp3',
  './audio/bus_08.mp3', './audio/bus_08_slow.mp3',
  './audio/bus_09.mp3', './audio/bus_09_slow.mp3',
  './audio/bus_10.mp3', './audio/bus_10_slow.mp3',

  // At the Restaurant
  './audio/restaurant_01.mp3', './audio/restaurant_01_slow.mp3',
  './audio/restaurant_02.mp3', './audio/restaurant_02_slow.mp3',
  './audio/restaurant_03.mp3', './audio/restaurant_03_slow.mp3',
  './audio/restaurant_04.mp3', './audio/restaurant_04_slow.mp3',
  './audio/restaurant_05.mp3', './audio/restaurant_05_slow.mp3',
  './audio/restaurant_06.mp3', './audio/restaurant_06_slow.mp3',
  './audio/restaurant_07.mp3', './audio/restaurant_07_slow.mp3',
  './audio/restaurant_08.mp3', './audio/restaurant_08_slow.mp3',
  './audio/restaurant_09.mp3', './audio/restaurant_09_slow.mp3',
  './audio/restaurant_10.mp3', './audio/restaurant_10_slow.mp3',

  // At the Supermarket
  './audio/supermarket_01.mp3', './audio/supermarket_01_slow.mp3',
  './audio/supermarket_02.mp3', './audio/supermarket_02_slow.mp3',
  './audio/supermarket_03.mp3', './audio/supermarket_03_slow.mp3',
  './audio/supermarket_04.mp3', './audio/supermarket_04_slow.mp3',
  './audio/supermarket_05.mp3', './audio/supermarket_05_slow.mp3',
  './audio/supermarket_06.mp3', './audio/supermarket_06_slow.mp3',
  './audio/supermarket_07.mp3', './audio/supermarket_07_slow.mp3',
  './audio/supermarket_08.mp3', './audio/supermarket_08_slow.mp3',
  './audio/supermarket_09.mp3', './audio/supermarket_09_slow.mp3',
  './audio/supermarket_10.mp3', './audio/supermarket_10_slow.mp3'
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
