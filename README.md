# alfredai-site — Healthcare AI & Medical Imaging Systems

> A high-performance academic and research landing page engineered with Motrix-inspired cosmic design, an interactive WebGL relativistic Kerr black hole simulation, a 4-layer clinical AI architecture deep dive, and live empirical evaluation benchmarks. Plain static HTML/CSS/JS — zero build dependencies, host-agnostic.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Live Site](https://img.shields.io/badge/Live-greyentity101.github.io%2Falfredai-site-0f766e)](https://greyentity101.github.io/alfredai-site/)

---

## 🌌 Core Features & Architecture

- **Interactive Relativistic Black Hole Simulation**: Real-time WebGL accretion ray-marching with relativistic Doppler beaming, gravitational lensing, and interactive mouse parallax (built with Motrix-grade WebGL rendering).
- **Floating Frosted-Glass Pill Navbar**: Glassmorphic navigation with active section highlighting, theme toggle, and Command-K modal search.
- **Ambient Glow Research Showcase Carousel**: Smooth touch-enabled and auto-advancing carousel displaying flagship systems (DICOMweb AI Gateway, Photon-Counting CT, Interventional AI).
- **4-Layer Clinical Architecture Deep Dive**: Interactive tabbed explorer detailing:
  - *Layer 1*: DICOM PS3.18 Native Gateway (STOW-RS, WADO-RS, QIDO-RS, thread-safe `threading.RLock`).
  - *Layer 2*: Decoupled Worker Interface (`BaseModelWorker` with zero-copy NumPy buffers).
  - *Layer 3*: Structured Serialization (DICOM SR TID 1500 & HL7 FHIR R4).
  - *Layer 4*: Report-Grounding Verification (dual-engine audit matching AI findings against radiologist reports).
- **Live Empirical Benchmarks & PCCT Semiconductor Matrix**:
  - *E1–E4 Clinical Validation*: p95 latency (41.0 ms), throughput (79.7 req/s), boundary accuracy (HD95 = 1.0 voxel), grounding F1 (1.000).
  - *PCCT Detector Comparison*: Deep Silicon (GE Photon Spectra) vs. CdTe/CZT (Siemens NAEOTOM Alpha) vs. Canon Ultimion.
- **Filterable Publications Vault**: Instant category filtering, real-time query search, and one-click BibTeX/APA citation copying.
- **Offline PWA Capabilities**: Service Worker caching core assets for zero-latency instant loading.
- **Zero Build Step**: Pure vanilla HTML5, CSS3, and modern JavaScript. Deploys seamlessly on GitHub Pages, Netlify, or any static HTTP host.

---

## 🚀 Quickstart

```bash
# 1. Preview locally via one-click batch runner
run-local.bat

# Or preview with Python HTTP server
python -m http.server 8000

# 2. Or launch directly in Brave / default browser
powershell -ExecutionPolicy Bypass -File launch-brave.ps1

# 3. Global Internet Access
# Hosted on GitHub Pages with global CDN edge distribution:
https://greyentity101.github.io/alfredai-site/
```

### 🌍 Global CDN & Offline PWA Capabilities
- **Global Edge Delivery**: High-speed CDN caching with zero external runtime dependencies.
- **Full Offline PWA Support**: Installed Service Worker (`sw.js`) with `stale-while-revalidate` caching strategy and web app manifest (`manifest.json`) allows the complete site, publication PDFs, and architecture diagrams to load instantly without active internet.

---

## 📚 Flagship Publications

1. **Photon-Counting CT Detectors: Silicon, CdTe, and the Road to Clinical Spectral Imaging**
   - *Venue*: IEEE Reviews in Biomedical Engineering / Technical Review, 2026.
   - *Focus*: High-flux energy binning, semiconductor physics, and PACS integration bottlenecks.

2. **The Predictive Role of AI in Reducing Complications and Enhancing Precision in Interventional Procedures**
   - *Venue*: Nature Reviews Cardiology / Preprint 2026. ORCID: [0009-0006-4312-403X](https://orcid.org/0009-0006-4312-403X).
   - *Focus*: Real-time intraoperative guidance, vascular navigation, and complication forecasting.

3. **DICOMweb AI Gateway: A Vendor-Neutral Framework for Deploying Medical Imaging AI Models**
   - *Venue*: Journal of Digital Imaging (JDI) / IEEE Transactions on Medical Imaging, 2026.
   - *Focus*: Microservice orchestration, DICOM SR TID 1500 serialization, and E1–E4 validation protocols.

---

## 👤 Author & Ownership

**Mohit Kumar**  
Researcher in Healthcare IT, PACS Architecture & Applied Deep Learning  
- **Website**: [https://greyentity101.github.io/alfredai-site/](https://greyentity101.github.io/alfredai-site/)  
- **GitHub**: [@greyentity101](https://github.com/greyentity101)  
- **Google Scholar**: [Mohit Kumar Profile](https://scholar.google.com/citations?view_op=list_works&hl=en&authuser=1&user=apW80LYAAAAJ)  
- **ORCID**: [0009-0006-4312-403X](https://orcid.org/0009-0006-4312-403X)  
- **Email**: [mohitjat202@gmail.com](mailto:mohitjat202@gmail.com)

---

## 📄 License

This project and its original research code are open-source and released under the **[MIT License](LICENSE)**.  
Copyright (c) 2026 Mohit Kumar.

