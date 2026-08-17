/* ============================================================
   Mohit Kumar — Academic Researcher Site · app.js
   Theme · glass transparency · auto stats · filter engine
   nav spy · reveal · edit mode
   ============================================================ */
(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- editable identity (change these) ---------- */
  var EMAIL = 'mohitjat202@gmail.com';
  var MAILTOPICS = {
    email:    { subject: 'Hello from your site',         body: '' },
    speaking: { subject: 'Speaking invitation',          body: '' },
    collab:   { subject: 'Research collaboration',       body: '' }
  };

  /* ============================================================
     PUBLICATIONS — replace the two scaffold rows with your own.
     Each entry:
       id, title, authors, venue, year, type (journal|conference|preprint|thesis),
       status (published|in-press|preprint|under-review),
       topics: [lowercase tags], doi, abstract (plain language),
       links: { scholar, pdf, data, repo } — set only those that exist.
     Set placeholder:true on any row that isn't yet your real data.
     ============================================================ */
  var PUBLICATIONS = [
    {
      id: 'photon-counting-ct-detectors',
      title: 'Photon-Counting CT Detectors: Silicon, CdTe, and the Road to Clinical Spectral Imaging',
      authors: 'Kumar, M.',
      venue: 'Preprint',
      year: 2026,
      type: 'journal',
      status: 'preprint',
      topics: ['medical-imaging', 'photon-counting-ct', 'dicom', 'pacs', 'detector-physics', 'spectral-imaging'],
      doi: '',
      abstract: 'A comprehensive review of photon-counting CT detector technology — covering CdTe/CZT and deep silicon physics, readout ASICs, the vendor landscape (Siemens NAEOTOM Alpha, GE Photon Spectra, Canon Ultimion), clinical evidence, and the PACS informatics challenges of spectral data at the reading console. Includes 8 analytical figures.',
      links: {
        scholar: 'https://scholar.google.com/citations?view_op=list_works&hl=en&authuser=1&user=apW80LYAAAAJ',
        pdf: 'assets/papers/photon-counting-ct-detectors.pdf',
        repo: 'https://github.com/greyentity101/photon-counting-ct'
      },
      placeholder: false
    },
    {
      id: 'ai-interventional-procedures-review',
      title: 'The Predictive Role of Artificial Intelligence in Reducing Complications and Enhancing Precision in Interventional Procedures',
      authors: 'Kumar, M.',
      venue: 'Preprint',
      year: 2026,
      type: 'journal',
      status: 'preprint',
      topics: ['ai', 'interventional', 'cardiology', 'risk-prediction', 'medical-imaging'],
      doi: '',
      abstract: 'A narrative review of how machine learning and deep learning reduce complications and improve precision across interventional cardiology, radiology, neurointervention, and endovascular surgery — spanning procedural planning, risk prediction, imaging, intraoperative guidance, and robotics.',
      links: {
        scholar: 'https://scholar.google.com/citations?view_op=list_works&hl=en&authuser=1&user=apW80LYAAAAJ',
        pdf: 'assets/papers/ai-interventional-procedures.pdf'
      },
      placeholder: false
    }
  ];

  /* ---------- theme toggle ---------- */
  var toggle = document.getElementById('themeToggle');
  function applyTheme(t) {
    root.dataset.theme = t;
    try { localStorage.setItem('mk-theme', t); } catch (e) {}
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.content = t === 'dark' ? '#0f172a' : '#f8fafc';
    if (toggle) toggle.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
    });
    applyTheme(root.dataset.theme); // sync label/meta on load
  }

  /* ---------- glass transparency slider ---------- */
  var GLASS_DEFAULT = 55; // percent (10–95) → --glass-alpha 0.10–0.95
  var glassToggle = document.getElementById('glassToggle');
  var glassPanel = document.getElementById('glassPanel');
  var glassRange = document.getElementById('glassRange');
  var glassReadout = document.getElementById('glassReadout');
  var glassReset = document.getElementById('glassReset');

  function setGlass(pct, persist) {
    if (glassRange) glassRange.value = pct;
    root.style.setProperty('--glass-alpha', (pct / 100).toFixed(2));
    if (glassRange) glassRange.style.setProperty('--fill', pct + '%');
    if (glassReadout) glassReadout.textContent = pct + '%';
    if (persist) { try { localStorage.setItem('mk-glass', String(pct)); } catch (e) {} }
  }

  if (glassRange) {
    var savedGlass = parseFloat(localStorage.getItem('mk-glass'));
    setGlass(isNaN(savedGlass) ? GLASS_DEFAULT : Math.min(95, Math.max(10, savedGlass)), false);

    glassRange.addEventListener('input', function () {
      setGlass(parseInt(glassRange.value, 10), false); // live preview
    });
    glassRange.addEventListener('change', function () {
      setGlass(parseInt(glassRange.value, 10), true); // commit on release
    });
  }
  if (glassReset) {
    glassReset.addEventListener('click', function () { setGlass(GLASS_DEFAULT, true); });
  }
  if (glassToggle && glassPanel) {
    glassToggle.addEventListener('click', function () {
      var open = glassPanel.classList.toggle('open');
      glassToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open && glassRange) glassRange.focus();
    });
    document.addEventListener('click', function (e) {
      if (glassPanel.classList.contains('open') &&
          !glassPanel.contains(e.target) && e.target !== glassToggle) {
        glassPanel.classList.remove('open');
        glassToggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && glassPanel.classList.contains('open')) {
        glassPanel.classList.remove('open');
        glassToggle.setAttribute('aria-expanded', 'false');
        glassToggle.focus();
      }
    });
  }

  /* ---------- mailto wiring (single EMAIL source of truth) ---------- */
  document.querySelectorAll('[data-mail]').forEach(function (a) {
    var key = a.getAttribute('data-mail');
    var cfg = MAILTOPICS[key] || MAILTOPICS.email;
    a.href = 'mailto:' + EMAIL +
      '?subject=' + encodeURIComponent(cfg.subject) +
      '&body=' + encodeURIComponent(cfg.body);
  });

  /* ---------- publication filter engine ---------- */
  var FILTERS = { topic: 'All', year: 'All', venue: 'All' };
  var wrap = document.getElementById('chipGroups');
  var list = document.getElementById('pubList');
  var countEl = document.getElementById('pubCount');

  function distinct(arr) { return Array.from(new Set(arr)); }
  var topics = distinct(PUBLICATIONS.flatMap(function (p) { return p.topics; })).sort();
  var years  = distinct(PUBLICATIONS.map(function (p) { return p.year; })).sort(function (a, b) { return b - a; });
  var venues = distinct(PUBLICATIONS.map(function (p) { return p.venue; })).sort();

  function chip(key, value) {
    var b = document.createElement('button');
    b.className = 'chip';
    b.textContent = value;
    b.dataset.key = key;
    b.setAttribute('aria-pressed', FILTERS[key] === value ? 'true' : 'false');
    b.addEventListener('click', function () {
      FILTERS[key] = value;
      wrap.querySelectorAll('.chip[data-key="' + key + '"]').forEach(function (c) {
        c.setAttribute('aria-pressed', 'false');
      });
      b.setAttribute('aria-pressed', 'true');
      render();
    });
    return b;
  }

  function buildChips() {
    var groups = [
      { key: 'topic', label: 'Topic', values: topics },
      { key: 'year',  label: 'Year',  values: years.map(String) },
      { key: 'venue', label: 'Venue', values: venues }
    ];
    wrap.innerHTML = '';
    groups.forEach(function (g) {
      var div = document.createElement('div');
      div.className = 'chip-group';
      var lab = document.createElement('span');
      lab.className = 'grp-label';
      lab.textContent = g.label;
      div.appendChild(lab);
      div.appendChild(chip(g.key, 'All'));
      g.values.forEach(function (v) { div.appendChild(chip(g.key, v)); });
      wrap.appendChild(div);
    });
  }

  function row(p) {
    var ph = p.placeholder ? ' data-placeholder' : '';
    var links = [
      p.links.pdf     && '<a class="link-pill" href="' + p.links.pdf + '" download>PDF</a>',
      p.links.scholar && '<a class="link-pill" href="' + p.links.scholar + '" target="_blank" rel="noopener">Scholar ↗</a>',
      p.links.data    && '<a class="link-pill" href="' + p.links.data + '" target="_blank" rel="noopener">Data</a>',
      p.links.repo    && '<a class="link-pill" href="' + p.links.repo + '" target="_blank" rel="noopener">Repo ↗</a>'
    ].filter(Boolean).join('');
    var venue = p.doi
      ? p.venue + ' · ' + p.year + ' · DOI: ' + p.doi
      : p.venue + ' · ' + p.year;
    return (
      '<article class="pub-row"' + ph + '>' +
        '<div class="pub-year">' + p.year + '</div>' +
        '<div class="pub-body">' +
          '<div class="pub-type">' + p.type + ' · ' + p.status + '</div>' +
          '<h3><a href="' + (p.links.pdf || '#') + '">' + p.title + '</a></h3>' +
          '<p class="pub-authors">' + p.authors + '</p>' +
          '<span class="pub-venue">' + venue + '</span>' +
          (p.abstract ? '<p class="pub-abstract">' + p.abstract + '</p>' : '') +
          (links ? '<div class="pub-links">' + links + '</div>' : '') +
        '</div>' +
      '</article>'
    );
  }

  function render() {
    var shown = PUBLICATIONS
      .filter(function (p) {
        return (FILTERS.topic === 'All' || p.topics.indexOf(FILTERS.topic) !== -1) &&
               (FILTERS.year  === 'All' || String(p.year) === FILTERS.year) &&
               (FILTERS.venue === 'All' || p.venue === FILTERS.venue);
      })
      .sort(function (a, b) { return b.year - a.year; });

    if (countEl) countEl.textContent = String(shown.length);

    if (!shown.length) {
      list.innerHTML = '<p class="pub-empty">No publications match this filter — clear a filter to see all.</p>';
      return;
    }
    list.classList.add('fade');
    setTimeout(function () {
      list.innerHTML = shown.map(row).join('');
      list.classList.remove('fade');
    }, 200);
  }

  buildChips();
  render();

  /* ---------- auto-computed stats (data-driven band) ---------- */
  var statsBand = document.getElementById('statsBand');
  if (statsBand) {
    var realPubs = PUBLICATIONS.filter(function (p) { return !p.placeholder; });
    var pubYears = distinct(realPubs.map(function (p) { return p.year; }));
    var topicCount = distinct(realPubs.flatMap(function (p) { return p.topics; })).length;

    var STATS = [
      {
        label: 'Publications',
        value: realPubs.length,
        note: realPubs.length ? 'listed on this page' : 'add your papers in app.js',
        numeric: true
      },
      {
        label: 'Focus areas',
        value: topicCount,
        note: topicCount ? 'research topics covered' : 'add topics to your papers',
        numeric: true
      },
      {
        label: 'Active since',
        value: pubYears.length ? Math.min.apply(null, pubYears) : '—',
        note: pubYears.length ? 'earliest listed paper' : '—',
        numeric: false
      }
    ];

    STATS.forEach(function (s) {
      var card = document.createElement('article');
      card.className = 'card stat-card g4';
      var num = document.createElement('div');
      num.className = 'stat-num';
      card.appendChild(num);
      var lab = document.createElement('div');
      lab.className = 'stat-label';
      lab.textContent = s.label;
      card.appendChild(lab);
      var note = document.createElement('div');
      note.className = 'stat-note';
      note.textContent = s.note;
      card.appendChild(note);
      statsBand.appendChild(card);

      /* animate numeric values once when scrolled into view */
      if (s.numeric && s.value && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        num.textContent = '0';
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (!en.isIntersecting) return;
            var target = s.value;
            var dur = 1100, start = null;
            function step(ts) {
              if (!start) start = ts;
              var p = Math.min((ts - start) / dur, 1);
              var eased = 1 - Math.pow(1 - p, 3);
              num.textContent = Math.round(target * eased).toLocaleString();
              if (p < 1) requestAnimationFrame(step);
              else num.textContent = target.toLocaleString();
            }
            requestAnimationFrame(step);
            io.unobserve(en.target);
          });
        }, { threshold: 0.4 });
        io.observe(card);
      } else {
        num.textContent = String(s.value);
      }
    });
  }

  /* ---------- nav scroll-spy ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  var spySections = ['top', 'research', 'publications', 'contact']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        var id = en.target.id;
        navLinks.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  spySections.forEach(function (s) { spy.observe(s); });

  /* ---------- mobile nav ---------- */
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- subtle scroll-reveal on cards ---------- */
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var cards = document.querySelectorAll('.card');
    cards.forEach(function (c) { c.setAttribute('data-reveal', ''); });
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    cards.forEach(function (c) { ro.observe(c); });
  }

  /* ---------- edit / placeholder mode (local only — prevents public access) ---------- */
  var isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.protocol === 'file:';
  if (isLocal && window.location.search.indexOf('edit') !== -1) {
    root.classList.add('edit-mode');
  }
  if (PUBLICATIONS.some(function (p) { return p.placeholder; })) {
    console.info('Placeholder data present in PUBLICATIONS — see README.md to replace.');
  }

  /* ---------- year ---------- */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- service worker (offline cache) ---------- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }
})();
