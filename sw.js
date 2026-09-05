/* ============================================================
   Service Worker — offline cache for static assets
   Cache-first for local files; network-first for Google Fonts.
   ============================================================ */
(function () {
  'use strict';

  var CACHE = 'alfredai-site-v1';
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
    basePath + 'app.js',
    basePath + 'assets/favicon.ico',
    basePath + 'assets/favicon.svg',
    basePath + 'assets/CV_Mohit_Kumar.pdf'
  ];

  // ---------- install ----------
  self.addEventListener('install', function (evt) {
    evt.waitUntil(
      caches.open(CACHE).then(function (cache) {
        return cache.addAll(ASSETS);
      }).catch(function () {
        /* offline install still succeeds even if a URL is unreachable */
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

    // Network-first for Google Fonts (always want fresh, fall back to cache)
    if (url.indexOf('fonts.googleapis.com') !== -1 ||
        url.indexOf('fonts.gstatic.com') !== -1) {
      evt.respondWith(
        fetch(evt.request).catch(function () {
          return caches.match(evt.request);
        })
      );
      return;
    }

    // Cache-first for everything else
    evt.respondWith(
      caches.match(evt.request).then(function (resp) {
        if (resp) return resp;

        return fetch(evt.request).then(function (networkResp) {
          /* optionally cache new requests for same-origin */
          if (networkResp &&
              networkResp.status === 200 &&
              networkResp.type === 'basic' &&
              evt.request.destination !== 'document') {
            var copy = networkResp.clone();
            caches.open(CACHE).then(function (cache) {
              cache.put(evt.request, copy);
            });
          }
          return networkResp;
        }).catch(function () {
          /* offline fallback for same-origin HTML navigation */
          if (evt.request.mode === 'navigate') {
            return caches.match(basePath + 'index.html');
          }
        });
      })
    );
  });
})();
