# alfredai-site — Researcher Site

> A single-page academic site with a Bento-grid hero, dark/light themes, and filterable
> publications. Plain static HTML/CSS/JS — no build step, host-agnostic.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Live](https://img.shields.io/badge/Live-greyentity101.github.io%2Falfredai-site-0f766e)](https://greyentity101.github.io/alfredai-site/)

## What & why

A fast, dependency-free home for research output: a bio, publications with topic/year/venue
filtering, and links to Google Scholar, ORCID, GitHub, and email. Built to load instantly on any
static host and to be easy for the owner to extend — every editable spot carries a
`data-placeholder` marker so nothing needs to be hunted down in the markup.

## Features

- **Bento-grid hero** with auto-computed stats (publication count, focus areas, earliest year).
- **Dark/light themes** — toggle persists to `localStorage`, first visit follows the OS.
- **Filterable publications** — Topic / Year / Venue chips generated from the data.
- **Frosted-glass transparency slider** — adjust hero blur live, persists (`localStorage`).
- **No build step** — static files; deploy anywhere (Netlify, GitHub Pages, a folder).

## Quickstart

```bash
# Open locally (Brave) — or just open index.html in any browser
powershell -ExecutionPolicy Bypass -File launch-brave.ps1
```

Add `?edit=1` to the URL to outline every `data-placeholder` spot (local-only helper).

## Customize

- **Email & publications** — `app.js`: `EMAIL` constant and the `PUBLICATIONS` array (title,
  authors, venue, year, type, status, topics, doi, abstract, links).
- **Identity & social links** — `index.html`: hero line, role, affiliation, focus bullets, tags,
  and the four social `href`s.
- **CV & portrait** — add `assets/CV_Mohit_Kumar.pdf` and `assets/portrait.jpg` (both gitignored —
  not distributed by this repo).
- **Profiles & citation** — `index.html` publications aside: Scholar / ORCID / GitHub URLs.

## Deploy

This is plain static files — copy the folder to any static host (Netlify, GitHub Pages). Fonts
load from Google Fonts with system fallbacks, so it works fully offline otherwise.

## License

[MIT](LICENSE)
