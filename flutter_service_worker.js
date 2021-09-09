'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "59fc0ca13b80e715ef685c19a0209c1c",
"index.html": "3e9cc6f5c761aea34ae22472fa882c1a",
"/": "3e9cc6f5c761aea34ae22472fa882c1a",
"main.dart.js": "2f52dc79d0c138ef940db2ff354981d7",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "859e044cddeac0a12c6bc42b0749e8c7",
"assets/config/private.json": "a2d22382af7a02cfacf31e01be29875f",
"assets/AssetManifest.json": "ec7b2e74ef60de02d2bf94b656d8f904",
"assets/NOTICES": "8f74d47c4f5c69da0709e3d2a3232e94",
"assets/FontManifest.json": "8d501ac574479214d315c2e820f73c5e",
"assets/packages/flutter_neumorphic/fonts/NeumorphicIcons.ttf": "32be0c4c86773ba5c9f7791e69964585",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "b14fcf3ee94e3ace300b192e9e7c8c5d",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "ffed6899ceb84c60a1efa51c809a57e4",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "eaed33dc9678381a55cb5c13edaf241d",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "3241d1d9c15448a4da96df05f3292ffe",
"assets/fonts/MaterialIcons-Regular.otf": "1288c9e28052e028aba623321f7826ac",
"assets/assets/audios/intro.mp3": "88721e38c049b5d1c504e219a95ce1a3",
"assets/assets/audios/effects/click.mp3": "a6ac3651198255e6dbefd1863fdee706",
"assets/assets/audios/effects/actual.mp3": "689a392cc6fda7aa5b60e9255ab25b8e",
"assets/assets/audios/effects/InitPlay.mp3": "218f225778913ce3d2ab929c3433404e",
"assets/assets/audios/effects/actual_volume_aumented_x2.mp3": "7023b15a0b145d1a71ad3223eb5a35e6",
"assets/assets/images/comares_card_c.jpg": "f88846f132ba5e38012346bcd23e6754",
"assets/assets/images/loading-dark.gif": "4ba612482debeec96808b5fd52c12534",
"assets/assets/images/icon.png": "cd0af5a33af5261644d0fd3d1aa4ffc2",
"assets/assets/images/flags/ES-INF.jpg": "993f87d517c1a021282779391b476f09",
"assets/assets/images/flags/EN.jpg": "9fdc8cfc73b507886b43c7e533d8379e",
"assets/assets/images/flags/ES.jpg": "bbd3c020679a23ed5c72bba6d1437dd4",
"assets/assets/images/tifloactiva-logo-blanco.png": "ae916a8b4e178bc5c4c8bc21be0e94b9",
"assets/assets/images/ES-INF.jpg": "993f87d517c1a021282779391b476f09",
"assets/assets/images/EN.jpg": "9fdc8cfc73b507886b43c7e533d8379e",
"assets/assets/images/tifloactiva-logo-texto.png": "5d938c6f131407664f8a10ab5c31a286",
"assets/assets/images/loading.gif": "a6178f443133606fe19006604d0cafb5",
"assets/assets/images/ES.jpg": "bbd3c020679a23ed5c72bba6d1437dd4",
"assets/assets/images/Fycma_portada.jpg": "e97cf52daf92b6f8aacc844aae4b70cc",
"assets/assets/images/fycma_portada_grande.jpg": "bf0c459c6ef747de4f31dbb4032d502b",
"assets/assets/images/LogoTifloactiva.png": "60bae2fb1056f3e9aa44948dcbb60de0",
"assets/assets/images/tifloactiva-logo.png": "8d725b438e085c2d547a2134d2704110"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value + '?revision=' + RESOURCES[value], {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
