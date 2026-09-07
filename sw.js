/* ============================================================
   Service Worker — offline cache for static assets
   Cache-first for local files; network-first for Google Fonts.
   ============================================================ */
(function () {
  'use strict';

  var CACHE = 'alfredai-site-v3';
  var GHP_PAGES_PREFIX = '/alfredai-site/';

  // Determine the site root path so this works on both localhost and GitHub Pages.
  var basePath = '/';
  if (location.pathname.indexOf('/alfredai-site/') === 0) {
    basePath = GHP_PAGES_PREFIX;
  }

  var ASSETS = [
    basePath,
    basePath + 'index.html',
    basePath + 'styles.css',
    basePath + 'blackhole.js',
    basePath + 'app.js',
    basePath + 'manifest.json',
    basePath + 'assets/favicon.ico',
    basePath + 'assets/favicon.svg',
    basePath + 'assets/CV_Mohit_Kumar.pdf',
    basePath + 'assets/papers/ai-interventional-procedures.pdf',
    basePath + 'assets/papers/photon-counting-ct-detectors.pdf',
    basePath + 'assets/papers/figures/fig1_architecture.png',
    basePath + 'assets/papers/figures/fig2_e1_latency.png',
    basePath + 'assets/papers/figures/fig3_e2_segmentation.png',
    basePath + 'assets/papers/figures/fig4_e3_grounding.png',
    basePath + 'assets/papers/figures/fig5_e4_roundtrip.png'
  ];

  // ---------- install ----------
  self.addEventListener('install', function (evt) {
    evt.waitUntil(
      caches.open(CACHE).then(function (cache) {
        return cache.addAll(ASSETS);
      }).catch(function () {
        /* offline install continues gracefully even if an asset fails */
      })
    );
    self.skipWaiting();
  });

  // ---------- activate — clean old caches ----------
  self.addEventListener('activate', function (evt) {
    evt.waitUntil(
      caches.keys().then(function (keys) {
        return Promise.all(
          keys.map(function (key) {
            if (key !== CACHE) {
              return caches.delete(key);
            }
            return null;
          })
        );
      })
    );
    self.clients.claim();
  });

  // ---------- fetch ----------
  self.addEventListener('fetch', function (evt) {
    var url = evt.request.url;

    // 1. Network-first with cache fallback for external Google Fonts
    if (url.indexOf('fonts.googleapis.com') !== -1 ||
        url.indexOf('fonts.gstatic.com') !== -1) {
      evt.respondWith(
        fetch(evt.request).then(function (networkResp) {
          if (networkResp && networkResp.status === 200) {
            var copy = networkResp.clone();
            caches.open(CACHE).then(function (cache) {
              cache.put(evt.request, copy);
            });
          }
          return networkResp;
        }).catch(function () {
          return caches.match(evt.request);
        })
      );
      return;
    }

    // 2. Stale-While-Revalidate for same-origin resources:
    // Serve from cache immediately for speed, while updating cache in background
    evt.respondWith(
      caches.match(evt.request).then(function (cachedResp) {
        var fetchPromise = fetch(evt.request).then(function (networkResp) {
          if (networkResp &&
              networkResp.status === 200 &&
              networkResp.type === 'basic' &&
              evt.request.method === 'GET') {
            var copy = networkResp.clone();
            caches.open(CACHE).then(function (cache) {
              cache.put(evt.request, copy);
            });
          }
          return networkResp;
        }).catch(function () {
          // Offline fallback for HTML navigation
          if (evt.request.mode === 'navigate') {
            return caches.match(basePath + 'index.html');
          }
        });

        return cachedResp || fetchPromise;
      })
    );
  });
})();
