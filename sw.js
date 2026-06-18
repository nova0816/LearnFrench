const CACHE_NAME = 'elan-french-cache-v8';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './index.css?v=7',
  './app.js',
  './sentences.json',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',

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
  './audio/supermarket_10.mp3', './audio/supermarket_10_slow.mp3',

  // At the Hotel - 2
  './audio/hotel2_01.mp3', './audio/hotel2_01_slow.mp3',
  './audio/hotel2_02.mp3', './audio/hotel2_02_slow.mp3',
  './audio/hotel2_03.mp3', './audio/hotel2_03_slow.mp3',
  './audio/hotel2_04.mp3', './audio/hotel2_04_slow.mp3',
  './audio/hotel2_05.mp3', './audio/hotel2_05_slow.mp3',
  './audio/hotel2_06.mp3', './audio/hotel2_06_slow.mp3',
  './audio/hotel2_07.mp3', './audio/hotel2_07_slow.mp3',
  './audio/hotel2_08.mp3', './audio/hotel2_08_slow.mp3',
  './audio/hotel2_09.mp3', './audio/hotel2_09_slow.mp3',
  './audio/hotel2_10.mp3', './audio/hotel2_10_slow.mp3',

  // On the Bus - 2
  './audio/bus2_01.mp3', './audio/bus2_01_slow.mp3',
  './audio/bus2_02.mp3', './audio/bus2_02_slow.mp3',
  './audio/bus2_03.mp3', './audio/bus2_03_slow.mp3',
  './audio/bus2_04.mp3', './audio/bus2_04_slow.mp3',
  './audio/bus2_05.mp3', './audio/bus2_05_slow.mp3',
  './audio/bus2_06.mp3', './audio/bus2_06_slow.mp3',
  './audio/bus2_07.mp3', './audio/bus2_07_slow.mp3',
  './audio/bus2_08.mp3', './audio/bus2_08_slow.mp3',
  './audio/bus2_09.mp3', './audio/bus2_09_slow.mp3',
  './audio/bus2_10.mp3', './audio/bus2_10_slow.mp3',

  // At the Restaurant - 2
  './audio/restaurant2_01.mp3', './audio/restaurant2_01_slow.mp3',
  './audio/restaurant2_02.mp3', './audio/restaurant2_02_slow.mp3',
  './audio/restaurant2_03.mp3', './audio/restaurant2_03_slow.mp3',
  './audio/restaurant2_04.mp3', './audio/restaurant2_04_slow.mp3',
  './audio/restaurant2_05.mp3', './audio/restaurant2_05_slow.mp3',
  './audio/restaurant2_06.mp3', './audio/restaurant2_06_slow.mp3',
  './audio/restaurant2_07.mp3', './audio/restaurant2_07_slow.mp3',
  './audio/restaurant2_08.mp3', './audio/restaurant2_08_slow.mp3',
  './audio/restaurant2_09.mp3', './audio/restaurant2_09_slow.mp3',
  './audio/restaurant2_10.mp3', './audio/restaurant2_10_slow.mp3',

  // At the Train Station
  './audio/train_01.mp3', './audio/train_01_slow.mp3',
  './audio/train_02.mp3', './audio/train_02_slow.mp3',
  './audio/train_03.mp3', './audio/train_03_slow.mp3',
  './audio/train_04.mp3', './audio/train_04_slow.mp3',
  './audio/train_05.mp3', './audio/train_05_slow.mp3',
  './audio/train_06.mp3', './audio/train_06_slow.mp3',
  './audio/train_07.mp3', './audio/train_07_slow.mp3',
  './audio/train_08.mp3', './audio/train_08_slow.mp3',
  './audio/train_09.mp3', './audio/train_09_slow.mp3',
  './audio/train_10.mp3', './audio/train_10_slow.mp3',

  // Renting a Car
  './audio/car_01.mp3', './audio/car_01_slow.mp3',
  './audio/car_02.mp3', './audio/car_02_slow.mp3',
  './audio/car_03.mp3', './audio/car_03_slow.mp3',
  './audio/car_04.mp3', './audio/car_04_slow.mp3',
  './audio/car_05.mp3', './audio/car_05_slow.mp3',
  './audio/car_06.mp3', './audio/car_06_slow.mp3',
  './audio/car_07.mp3', './audio/car_07_slow.mp3',
  './audio/car_08.mp3', './audio/car_08_slow.mp3',
  './audio/car_09.mp3', './audio/car_09_slow.mp3',
  './audio/car_10.mp3', './audio/car_10_slow.mp3',

  // At the Pharmacy
  './audio/pharmacy_01.mp3', './audio/pharmacy_01_slow.mp3',
  './audio/pharmacy_02.mp3', './audio/pharmacy_02_slow.mp3',
  './audio/pharmacy_03.mp3', './audio/pharmacy_03_slow.mp3',
  './audio/pharmacy_04.mp3', './audio/pharmacy_04_slow.mp3',
  './audio/pharmacy_05.mp3', './audio/pharmacy_05_slow.mp3',
  './audio/pharmacy_06.mp3', './audio/pharmacy_06_slow.mp3',
  './audio/pharmacy_07.mp3', './audio/pharmacy_07_slow.mp3',
  './audio/pharmacy_08.mp3', './audio/pharmacy_08_slow.mp3',
  './audio/pharmacy_09.mp3', './audio/pharmacy_09_slow.mp3',
  './audio/pharmacy_10.mp3', './audio/pharmacy_10_slow.mp3',

  // At the Museum
  './audio/museum_01.mp3', './audio/museum_01_slow.mp3',
  './audio/museum_02.mp3', './audio/museum_02_slow.mp3',
  './audio/museum_03.mp3', './audio/museum_03_slow.mp3',
  './audio/museum_04.mp3', './audio/museum_04_slow.mp3',
  './audio/museum_05.mp3', './audio/museum_05_slow.mp3',
  './audio/museum_06.mp3', './audio/museum_06_slow.mp3',
  './audio/museum_07.mp3', './audio/museum_07_slow.mp3',
  './audio/museum_08.mp3', './audio/museum_08_slow.mp3',
  './audio/museum_09.mp3', './audio/museum_09_slow.mp3',
  './audio/museum_10.mp3', './audio/museum_10_slow.mp3',

  // At the Airport
  './audio/airport_01.mp3', './audio/airport_01_slow.mp3',
  './audio/airport_02.mp3', './audio/airport_02_slow.mp3',
  './audio/airport_03.mp3', './audio/airport_03_slow.mp3',
  './audio/airport_04.mp3', './audio/airport_04_slow.mp3',
  './audio/airport_05.mp3', './audio/airport_05_slow.mp3',
  './audio/airport_06.mp3', './audio/airport_06_slow.mp3',
  './audio/airport_07.mp3', './audio/airport_07_slow.mp3',
  './audio/airport_08.mp3', './audio/airport_08_slow.mp3',
  './audio/airport_09.mp3', './audio/airport_09_slow.mp3',
  './audio/airport_10.mp3', './audio/airport_10_slow.mp3',

  // At a Cafe
  './audio/cafe_01.mp3', './audio/cafe_01_slow.mp3',
  './audio/cafe_02.mp3', './audio/cafe_02_slow.mp3',
  './audio/cafe_03.mp3', './audio/cafe_03_slow.mp3',
  './audio/cafe_04.mp3', './audio/cafe_04_slow.mp3',
  './audio/cafe_05.mp3', './audio/cafe_05_slow.mp3',
  './audio/cafe_06.mp3', './audio/cafe_06_slow.mp3',
  './audio/cafe_07.mp3', './audio/cafe_07_slow.mp3',
  './audio/cafe_08.mp3', './audio/cafe_08_slow.mp3',
  './audio/cafe_09.mp3', './audio/cafe_09_slow.mp3',
  './audio/cafe_10.mp3', './audio/cafe_10_slow.mp3',

  // Seine Boat Cruise
  './audio/boat_01.mp3', './audio/boat_01_slow.mp3',
  './audio/boat_02.mp3', './audio/boat_02_slow.mp3',
  './audio/boat_03.mp3', './audio/boat_03_slow.mp3',
  './audio/boat_04.mp3', './audio/boat_04_slow.mp3',
  './audio/boat_05.mp3', './audio/boat_05_slow.mp3',
  './audio/boat_06.mp3', './audio/boat_06_slow.mp3',
  './audio/boat_07.mp3', './audio/boat_07_slow.mp3',
  './audio/boat_08.mp3', './audio/boat_08_slow.mp3',
  './audio/boat_09.mp3', './audio/boat_09_slow.mp3',
  './audio/boat_10.mp3', './audio/boat_10_slow.mp3',

  // Emergency - Lost Child
  './audio/lost_01.mp3', './audio/lost_01_slow.mp3',
  './audio/lost_02.mp3', './audio/lost_02_slow.mp3',
  './audio/lost_03.mp3', './audio/lost_03_slow.mp3',
  './audio/lost_04.mp3', './audio/lost_04_slow.mp3',
  './audio/lost_05.mp3', './audio/lost_05_slow.mp3',
  './audio/lost_06.mp3', './audio/lost_06_slow.mp3',
  './audio/lost_07.mp3', './audio/lost_07_slow.mp3',
  './audio/lost_08.mp3', './audio/lost_08_slow.mp3',
  './audio/lost_09.mp3', './audio/lost_09_slow.mp3',
  './audio/lost_10.mp3', './audio/lost_10_slow.mp3',

  // Renting Bicycles
  './audio/bike_01.mp3', './audio/bike_01_slow.mp3',
  './audio/bike_02.mp3', './audio/bike_02_slow.mp3',
  './audio/bike_03.mp3', './audio/bike_03_slow.mp3',
  './audio/bike_04.mp3', './audio/bike_04_slow.mp3',
  './audio/bike_05.mp3', './audio/bike_05_slow.mp3',
  './audio/bike_06.mp3', './audio/bike_06_slow.mp3',
  './audio/bike_07.mp3', './audio/bike_07_slow.mp3',
  './audio/bike_08.mp3', './audio/bike_08_slow.mp3',
  './audio/bike_09.mp3', './audio/bike_09_slow.mp3',
  './audio/bike_10.mp3', './audio/bike_10_slow.mp3',

  // At the Bakery
  './audio/bakery_01.mp3', './audio/bakery_01_slow.mp3',
  './audio/bakery_02.mp3', './audio/bakery_02_slow.mp3',
  './audio/bakery_03.mp3', './audio/bakery_03_slow.mp3',
  './audio/bakery_04.mp3', './audio/bakery_04_slow.mp3',
  './audio/bakery_05.mp3', './audio/bakery_05_slow.mp3',
  './audio/bakery_06.mp3', './audio/bakery_06_slow.mp3',
  './audio/bakery_07.mp3', './audio/bakery_07_slow.mp3',
  './audio/bakery_08.mp3', './audio/bakery_08_slow.mp3',
  './audio/bakery_09.mp3', './audio/bakery_09_slow.mp3',
  './audio/bakery_10.mp3', './audio/bakery_10_slow.mp3',
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
