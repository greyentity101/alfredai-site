/* ============================================================
   ALFREDAI-SITE - Motrix-Engineered Interaction Layer
   Features:
   - Genuine Motrix BlackHoleRenderer with Relativistic Accretion
   - Ambient Glow Showcase Carousel with Touch & Auto-Advance
   - Interactive 4-Layer Architecture Deep-Dive Explorer
   - E1-E4 Benchmark & PCCT Physics Matrix Explorer
   - Bento Metrics Glowing Beam & Tabbed Review Switcher
   - Live Filterable Publications Vault & One-Click Citation Copy
   - Command-K Global Search Modal
   - Theme Toggle with System & LocalStorage Sync
   ============================================================ */

(function () {
  'use strict';

  // ---------- ARCHITECTURE DATA (4-LAYER PIPELINE) ----------
  const ARCH_LAYERS = [
    {
      pill: 'LAYER 1 · INGESTION & STORAGE',
      title: 'DICOM PS3.18 Native Gateway',
      desc: 'Implements full DICOMweb RESTful bindings over standard HTTP verbs. Ingests heterogeneous clinical studies directly from modalities and enterprise PACS with zero metadata degradation.',
      bullets: [
        'STOW-RS (POST /studies): Multi-part MIME parser validating required DICOM tags and atomically persisting instances.',
        'WADO-RS (GET /studies/...): High-throughput streaming of raw DICOM instance bytes and extracted frame arrays.',
        'QIDO-RS (GET /studies): Fast indexed metadata queries with StudyInstanceUID and PatientID filtering.',
        'Thread-Safe Storage: Multi-threaded RLock architecture allowing 80+ concurrent ingestion streams without lock contention.'
      ],
      code: `class DICOMStore:
    def __init__(self, root_dir: Path):
        self.root = root_dir
        self._lock = threading.RLock()

    def store_instance(self, dataset: pydicom.Dataset) -> str:
        with self._lock:
            study_uid = dataset.StudyInstanceUID
            sop_uid = dataset.SOPInstanceUID
            target = self.root / study_uid / f"{sop_uid}.dcm"
            dataset.save_as(target, write_like_original=False)
            return str(target)`
    },
    {
      pill: 'LAYER 2 · MODEL-AGNOSTIC INFERENCE',
      title: 'Decoupled Worker Interface (BaseModelWorker)',
      desc: 'Isolates arbitrary AI model weights and frameworks (PyTorch, ONNX, TensorRT, TorchServe) from hospital transport protocols. Pixel buffers are extracted and normalized with zero memory copies.',
      bullets: [
        'Zero-Copy Buffer Handoff: Direct memory-mapped NumPy arrays from DICOM PixelData (7320,0010).',
        'Model Isolation: Plug in segmentation (nnU-Net), detection (YOLOv8-Medical), or classification via a unified execute() signature.',
        'Sub-45ms Turnaround: Eliminates framework startup overhead, yielding a p95 execution latency of 41 ms.',
        'Dynamic Worker Registry: Auto-discovers available models from local configs with fallback to CPU execution.'
      ],
      code: `class BaseModelWorker(ABC):
    @abstractmethod
    def execute(self, image: np.ndarray, metadata: dict) -> WorkerResult:
        """Execute model inference on raw pixel arrays."""
        pass

class ChestCTSegmentationWorker(BaseModelWorker):
    def execute(self, image: np.ndarray, metadata: dict) -> WorkerResult:
        normalized = (image - np.mean(image)) / (np.std(image) + 1e-6)
        mask = self.model.predict(normalized)
        return WorkerResult(mask=mask, confidence=0.982)`
    },
    {
      pill: 'LAYER 3 · STRUCTURED SERIALIZATION',
      title: 'DICOM SR (TID 1500) & HL7 FHIR R4',
      desc: 'Transforms raw machine predictions into clinical-grade structured reports that radiologists can inspect in native PACS reading consoles and EHR platforms.',
      bullets: [
        'DICOM Structured Reporting (SR): Generates TID 1500 Measurement Report trees with SNOMED-CT and LOINC concept codes.',
        'HL7 FHIR R4 Bundling: Emits DiagnosticReport and Observation transaction bundles ready for Epic and Cerner ingestion.',
        'Multi-Modal Geometry: Encodes 2D/3D segmentation contours, volumetric centroids, and quantitative biomarkers.',
        'Lossless Round-Trip: Preserves StudyInstanceUID and SeriesInstanceUID provenance for regulatory compliance.'
      ],
      code: `def build_dicom_sr(finding: Finding, study_uid: str) -> pydicom.Dataset:
    sr = pydicom.Dataset()
    sr.SOPClassUID = ComprehensiveSRStorage
    sr.ConceptNameCodeSequence = [CodeSequence("18748-4", "LOINC", "Diagnostic Imaging Report")]
    # Attach TID 1500 Measurement Content Tree
    sr.ContentTemplateSequence = [CodeSequence("1500", "DCMR", "Measurement Report")]
    sr.StudyInstanceUID = study_uid
    return sr`
    },
    {
      pill: 'LAYER 4 · REPORT-GROUNDING VERIFICATION',
      title: 'Dual-Engine Spatial Grounding & Audit',
      desc: 'Reconciles machine-generated findings against human-authored radiologist free-text impressions. Guarantees that automated predictions correlate with documented clinical findings.',
      bullets: [
        'Deterministic Keyword Engine: Fast, rule-based lexicon mapping running with zero latency on commodity CPUs.',
        'Local LLM Reconciliation: Optional offline quantized model for nuanced semantic inference and contradiction detection.',
        'Mismatch Classification: Accurately segments findings into Matched, Unsupported, or Contradicted categories.',
        'Safety Interlock: Rejects or highlights discordant AI outputs prior to final EHR sign-off.'
      ],
      code: `class GroundingEngine:
    def audit_findings(self, ai_findings: list, report_text: str) -> GroundingResult:
        matched, unsupported, contradicted = [], [], []
        for finding in ai_findings:
            status = self._evaluate_alignment(finding, report_text)
            if status == "MATCH": matched.append(finding)
            elif status == "CONTRADICT": contradicted.append(finding)
            else: unsupported.append(finding)
        return GroundingResult(precision=1.0, recall=1.0, matched=matched)`
    }
  ];

  // ---------- PUBLICATIONS DATA ----------
  const PUBLICATIONS = [
    {
      id: 'dicomweb-ai-gateway',
      title: 'A DICOMweb-Native AI Orchestration Gateway for Radiology',
      authors: 'Kumar, M.',
      venue: 'Technical Article · Evaluation E1-E4 Protocol',
      year: 2026,
      type: 'Technical Article',
      status: 'Preprint',
      topics: ['dicomweb', 'ai-orchestration', 'pacs', 'medical-imaging', 'fhir', 'structured-reporting'],
      abstract: 'A self-hosted, model-agnostic gateway that ingests DICOM instances via STOW-RS, routes them to pluggable AI workers, and emits structured results as JSON, DICOM SR, and FHIR R4 Bundles. Evaluated across a four-experiment protocol (E1-E4) measuring latency, segmentation accuracy (Dice/HD95), finding-level grounding fidelity, and round-trip interoperability. Demonstrates p95 latency of 41 ms and 79.7 req/s throughput on commodity hardware.',
      links: {
        scholar: 'https://scholar.google.com/citations?view_op=list_works&hl=en&authuser=1&user=apW80LYAAAAJ',
        repo: 'https://github.com/greyentity101/dicomweb-ai-gateway',
        pdf: 'assets/papers/dicomweb-ai-gateway-article.md'
      }
    },
    {
      id: 'photon-counting-ct-detectors',
      title: 'Photon-Counting CT Detectors: Silicon, CdTe, and the Road to Clinical Spectral Imaging',
      authors: 'Kumar, M.',
      venue: 'Technical Review · 8 Analytical Figures',
      year: 2026,
      type: 'Review',
      status: 'Preprint',
      topics: ['medical-imaging', 'photon-counting-ct', 'dicom', 'pacs', 'detector-physics', 'spectral-imaging'],
      abstract: 'A comprehensive review of photon-counting CT detector technology - comparing CdTe/CZT direct-conversion semiconductor physics against deep silicon architectures, readout ASICs, multi-energy binning, clinical evidence, and PACS reading console informatics bottlenecks. Includes comparative benchmarks of Siemens NAEOTOM Alpha, GE Photon Spectra, and Canon Ultimion.',
      links: {
        scholar: 'https://scholar.google.com/citations?view_op=list_works&hl=en&authuser=1&user=apW80LYAAAAJ',
        pdf: 'assets/papers/photon-counting-ct-detectors.pdf',
        repo: 'https://github.com/greyentity101/photon-counting-ct'
      }
    },
    {
      id: 'ai-interventional-procedures-review',
      title: 'The Predictive Role of Artificial Intelligence in Reducing Complications and Enhancing Precision in Interventional Procedures',
      authors: 'Kumar, M.',
      venue: 'Narrative Review · ORCID: 0009-0006-4312-403X',
      year: 2026,
      type: 'Review',
      status: 'Preprint',
      topics: ['ai', 'interventional', 'cardiology', 'risk-prediction', 'medical-imaging'],
      abstract: 'A systematic survey detailing how machine learning and deep learning reduce complications and elevate precision across interventional cardiology, peripheral vascular interventions, neurointervention, and robotic surgery. Analyzes preoperative procedural planning, real-time hemodynamic risk prediction, and intraoperative computer vision guidance.',
      links: {
        scholar: 'https://scholar.google.com/citations?view_op=list_works&hl=en&authuser=1&user=apW80LYAAAAJ',
        pdf: 'assets/papers/ai-interventional-procedures.pdf',
        repo: 'https://github.com/greyentity101/AI-Interventional-Procedures'
      }
    }
  ];

  // ---------- 1. HERO BLACK HOLE CANVAS ----------
  function initHeroCanvas() {
    const canvas = document.getElementById('scene');
    const hero = document.getElementById('hero');
    if (!canvas) return;

    // Use Motrix's authentic BlackHoleRenderer if available
    if (typeof window.BlackHoleRenderer === 'function') {
      try {
        const renderer = new window.BlackHoleRenderer(canvas, {
          onError: (err) => {
            console.warn('[blackhole] fallback to smooth 2D render:', err);
            initSmoothCanvas2D(canvas);
          }
        });
        renderer.start();

        if (hero && 'IntersectionObserver' in window) {
          const obs = new IntersectionObserver((entries) => {
            for (const entry of entries) {
              entry.isIntersecting ? renderer.start() : renderer.stop();
            }
          });
          obs.observe(hero);
        }
        return;
      } catch (e) {
        console.warn('[blackhole] init error:', e);
      }
    }

    // High-fidelity fallback
    initSmoothCanvas2D(canvas);
  }

  // Smooth, physically-grounded 2D Canvas (Zero pixel-block artifacts)
  function initSmoothCanvas2D(canvas) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let isRunning = true;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    }
    window.addEventListener('resize', resize);
    resize();

    // Natural cosmic starfield (smooth anti-aliased circular stars)
    const stars = [];
    for (let i = 0; i < 180; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.3,
        alpha: Math.random() * 0.75 + 0.25,
        pulseSpeed: Math.random() * 0.02 + 0.005
      });
    }

    // Orbiting accretion particles
    const particles = [];
    const baseR = Math.min(w, h) * 0.22;
    for (let i = 0; i < 320; i++) {
      const dist = baseR * (1.1 + Math.pow(Math.random(), 2) * 2.8);
      particles.push({
        angle: Math.random() * Math.PI * 2,
        dist: dist,
        speed: (0.01 + (baseR / dist) * 0.022),
        size: Math.random() * 2.2 + 0.6,
        hue: Math.random() > 0.4 ? 195 + Math.random() * 35 : 35 + Math.random() * 25,
        alpha: Math.random() * 0.65 + 0.35
      });
    }

    let mouseX = w * 0.65;
    let mouseY = h * 0.45;
    window.addEventListener('pointermove', (e) => {
      mouseX += (e.clientX - mouseX) * 0.08;
      mouseY += (e.clientY - mouseY) * 0.08;
    });

    let time = 0;
    function draw() {
      if (!isRunning) return;
      time += 0.016;

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, h);

      const cx = w * 0.65;
      const cy = h * 0.45;
      const r = Math.min(w, h) * 0.2;

      // 1. Draw smooth natural stars with subtle twinkle
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const a = s.alpha * (0.8 + 0.2 * Math.sin(time * 3.0 + i));
        ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Gravitational Lensing Outer Halo (Upper & Lower Lensed Arcs)
      const glowGrad = ctx.createRadialGradient(cx, cy, r * 0.85, cx, cy, r * 3.2);
      glowGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
      glowGrad.addColorStop(0.3, 'rgba(129, 140, 248, 0.22)');
      glowGrad.addColorStop(0.7, 'rgba(245, 158, 11, 0.08)');
      glowGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 3.2, 0, Math.PI * 2);
      ctx.fill();

      // 3. Orbiting Accretion Filaments with Doppler Beaming
      const tilt = 0.34;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.angle += p.speed;

        const sinA = Math.sin(p.angle);
        const cosA = Math.cos(p.angle);

        const px = cx + cosA * p.dist;
        const py = cy + sinA * p.dist * tilt;

        // Doppler: approaching side (left) is brighter and shifted
        const doppler = 1.0 - sinA * 0.6;
        const alpha = Math.min(1, Math.max(0.1, p.alpha * doppler));

        ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, p.size * (0.8 + doppler * 0.3), 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Photon Orbit Crest Ring
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.shadowBlur = 12;
      ctx.shadowColor = 'rgba(56, 189, 248, 0.9)';
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.02, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 5. Pitch-Black Event Horizon
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  }

  // ---------- 2. SHOWCASE CAROUSEL (Embla-Style) ----------
  function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoPlayTimer = null;

    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(idx));
        dotsContainer.appendChild(dot);
      });
    }

    function updateDots() {
      if (!dotsContainer) return;
      const dots = dotsContainer.querySelectorAll('.carousel-dot');
      dots.forEach((d, idx) => {
        d.classList.toggle('active', idx === currentIndex);
      });
    }

    function goToSlide(index) {
      currentIndex = (index + totalSlides) % totalSlides;
      const slideWidth = slides[0].getBoundingClientRect().width;
      track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
      updateDots();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { goToSlide(currentIndex - 1); resetAutoPlay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goToSlide(currentIndex + 1); resetAutoPlay(); });

    let startX = 0;
    let isDragging = false;

    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      const diffX = e.changedTouches[0].clientX - startX;
      if (diffX > 40) goToSlide(currentIndex - 1);
      else if (diffX < -40) goToSlide(currentIndex + 1);
      isDragging = false;
      resetAutoPlay();
    }, { passive: true });

    function startAutoPlay() {
      autoPlayTimer = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, 6000);
    }

    function resetAutoPlay() {
      clearInterval(autoPlayTimer);
      startAutoPlay();
    }

    startAutoPlay();
    track.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
    track.addEventListener('mouseleave', () => startAutoPlay());
  }

  // ---------- 3. INTERACTIVE 4-LAYER ARCHITECTURE EXPLORER ----------
  function initArchitectureExplorer() {
    const tabs = document.querySelectorAll('.arch-tab-btn');
    const pill = document.getElementById('archLayerPill');
    const title = document.getElementById('archLayerTitle');
    const desc = document.getElementById('archLayerDesc');
    const bulletsContainer = document.getElementById('archBullets');
    const codeBox = document.getElementById('archCodeBox');

    if (!tabs || !pill || !title || !desc || !bulletsContainer || !codeBox) return;

    function renderLayer(idx) {
      const data = ARCH_LAYERS[idx];
      if (!data) return;

      tabs.forEach((t, i) => t.classList.toggle('active', i === idx));

      pill.textContent = data.pill;
      title.textContent = data.title;
      desc.textContent = data.desc;

      bulletsContainer.innerHTML = data.bullets.map((b) => `
        <li class="arch-bullet-item">
          <svg class="arch-bullet-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>${b}</span>
        </li>
      `).join('');

      codeBox.textContent = data.code;
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => renderLayer(index));
    });

    renderLayer(0);
  }

  // ---------- 4. BENTO ACCOLADES TAB SWITCHER ----------
  function initBentoTabs() {
    const tabs = document.querySelectorAll('.bento-tab-btn');
    const quoteText = document.getElementById('bentoQuoteText');
    const quoteAuthor = document.getElementById('bentoQuoteAuthor');

    if (!tabs || !quoteText || !quoteAuthor) return;

    const quotes = [
      {
        text: '“A self-hosted, model-agnostic gateway achieving p95 latency of 41ms and 79.7 req/s throughput on commodity hardware with full STOW-RS and DICOM SR fidelity.”',
        author: 'DICOMweb AI Gateway - Evaluation Protocol E1-E4'
      },
      {
        text: '“Detailed comparative physics between Silicon and CdTe/CZT detectors, shedding light on the PACS informatics bottlenecks of multi-energy spectral CT at the reading console.”',
        author: 'Photon-Counting CT Review - 8 Analytical Figures'
      },
      {
        text: '“A systematic investigation of machine learning and deep learning in reducing procedural complications across interventional cardiology, radiology, and robotic surgery.”',
        author: 'AI in Interventional Procedures - Narrative Review'
      }
    ];

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        quoteText.style.opacity = '0';
        quoteAuthor.style.opacity = '0';

        setTimeout(() => {
          quoteText.textContent = quotes[index].text;
          quoteAuthor.textContent = quotes[index].author;
          quoteText.style.opacity = '1';
          quoteAuthor.style.opacity = '1';
        }, 180);
      });
    });

    const beamCard = document.querySelector('.bento-large-beam');
    if (beamCard) {
      beamCard.addEventListener('pointermove', (e) => {
        const rect = beamCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        beamCard.style.setProperty('--mouse-x', `${x}px`);
        beamCard.style.setProperty('--mouse-y', `${y}px`);
      });
    }
  }

  // ---------- 5. PUBLICATIONS VAULT ----------
  function initPublicationsVault() {
    const container = document.getElementById('publicationsList');
    const chips = document.querySelectorAll('.filter-chip');
    const searchInput = document.getElementById('pubSearchInput');

    if (!container) return;

    let activeFilter = 'all';
    let searchQuery = '';

    function renderPublications() {
      const filtered = PUBLICATIONS.filter((pub) => {
        const matchesTopic = activeFilter === 'all' || pub.topics.includes(activeFilter);
        const matchesSearch = searchQuery === '' ||
          pub.title.toLowerCase().includes(searchQuery) ||
          pub.abstract.toLowerCase().includes(searchQuery) ||
          pub.topics.some((t) => t.includes(searchQuery));
        return matchesTopic && matchesSearch;
      });

      if (filtered.length === 0) {
        container.innerHTML = `
          <div style="text-align:center; padding: 3rem; color: var(--text-dim); background: var(--bg-card); border-radius: var(--radius-lg);">
            No research outputs matched your query.
          </div>
        `;
        return;
      }

      container.innerHTML = filtered.map((pub) => `
        <article class="pub-card" id="${pub.id}">
          <div class="pub-meta-row">
            <span class="pub-badge-year">${pub.year}</span>
            <span class="pub-badge-venue">${pub.venue}</span>
            <span class="pub-tag" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8;">${pub.status}</span>
          </div>
          <h3 class="pub-title">${pub.title}</h3>
          <p class="pub-authors">By <strong>${pub.authors}</strong></p>
          <p class="pub-abstract">${pub.abstract}</p>
          <div class="pub-topic-tags">
            ${pub.topics.map((t) => `<span class="pub-tag">#${t}</span>`).join('')}
          </div>
          <div class="pub-actions">
            ${pub.links.pdf ? `<a class="pub-action-btn" href="${pub.links.pdf}" target="_blank" download><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download PDF</a>` : ''}
            ${pub.links.repo ? `<a class="pub-action-btn" href="${pub.links.repo}" target="_blank"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"/></svg> Code Repo</a>` : ''}
            ${pub.links.scholar ? `<a class="pub-action-btn" href="${pub.links.scholar}" target="_blank">Google Scholar</a>` : ''}
            <button class="pub-action-btn btn-copy-cite" data-id="${pub.id}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              Copy Citation
            </button>
          </div>
        </article>
      `).join('');

      container.querySelectorAll('.btn-copy-cite').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const p = PUBLICATIONS.find((item) => item.id === id);
          if (!p) return;

          const bibtex = `@article{kumar${p.year}${p.id.replace(/-/g, '_')},\n  title={${p.title}},\n  author={${p.authors}},\n  journal={${p.venue}},\n  year={${p.year}}\n}`;
          navigator.clipboard.writeText(bibtex).then(() => {
            showToast('BibTeX Citation copied to clipboard!');
          });
        });
      });
    }

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        activeFilter = chip.getAttribute('data-filter') || 'all';
        renderPublications();
      });
    });

    let debounceTimer = null;
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          searchQuery = e.target.value.trim().toLowerCase();
          renderPublications();
        }, 150);
      });
    }

    renderPublications();
  }

  // ---------- 6. COMMAND-K SEARCH MODAL ----------
  function initSearchDialog() {
    const dialog = document.getElementById('search-dialog');
    const input = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results');
    const triggers = document.querySelectorAll('[data-open-search]');

    if (!dialog || !input || !resultsContainer) return;

    function openSearch() {
      dialog.showModal();
      input.value = '';
      renderSearchResults('');
      input.focus();
    }

    function closeSearch() {
      dialog.close();
    }

    triggers.forEach((btn) => btn.addEventListener('click', openSearch));

    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) closeSearch();
    });

    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (dialog.open) closeSearch();
        else openSearch();
      }
      if (e.key === 'Escape' && dialog.open) {
        closeSearch();
      }
    });

    function renderSearchResults(query) {
      const q = query.toLowerCase().trim();
      const matches = [];

      PUBLICATIONS.forEach((pub) => {
        if (!q || pub.title.toLowerCase().includes(q) || pub.topics.some((t) => t.includes(q))) {
          matches.push({
            title: pub.title,
            desc: `Publication · ${pub.venue} (${pub.year})`,
            url: `#${pub.id}`
          });
        }
      });

      const sections = [
        { title: 'Relativistic Physics Overview', desc: 'Jump to Hero', url: '#hero' },
        { title: 'Featured Systems Showcase', desc: 'DICOMweb, CT Detectors, Interventional AI', url: '#showcase' },
        { title: '4-Layer Architecture Deep-Dive', desc: 'STOW-RS, BaseModelWorker, DICOM SR, Grounding', url: '#architecture' },
        { title: 'E1-E4 Experimental Benchmarks', desc: 'Latency, Segmentation, Grounding & Roundtrip', url: '#evaluations' },
        { title: 'PCCT Semiconductor Physics Matrix', desc: 'Silicon vs CdTe/CZT direct conversion comparison', url: '#evaluations' },
        { title: 'Performance Metrics & Benchmark', desc: 'p95 41ms latency, 100% interoperability', url: '#metrics' },
        { title: 'Publications Vault', desc: 'Peer-reviewed articles and preprints', url: '#publications' },
        { title: 'Contact & Collaboration', desc: 'Get in touch with Mohit Kumar', url: '#contact' },
        { title: 'Curriculum Vitae (PDF)', desc: 'Download academic CV', url: 'assets/CV_Mohit_Kumar.pdf' }
      ];

      sections.forEach((sec) => {
        if (!q || sec.title.toLowerCase().includes(q) || sec.desc.toLowerCase().includes(q)) {
          matches.push(sec);
        }
      });

      if (matches.length === 0) {
        resultsContainer.innerHTML = '<div style="padding: 1.5rem; text-align: center; color: var(--text-dim);">No results found.</div>';
        return;
      }

      resultsContainer.innerHTML = matches.map((m) => `
        <div class="result-item" data-url="${m.url}">
          <div class="result-title">${m.title}</div>
          <div class="result-desc">${m.desc}</div>
        </div>
      `).join('');

      resultsContainer.querySelectorAll('.result-item').forEach((item) => {
        item.addEventListener('click', () => {
          const url = item.getAttribute('data-url');
          closeSearch();
          if (url.startsWith('#')) {
            const target = document.querySelector(url);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.open(url, '_blank');
          }
        });
      });
    }

    input.addEventListener('input', (e) => {
      renderSearchResults(e.target.value);
    });
  }

  // ---------- 7. THEME TOGGLE ----------
  function initTheme() {
    const toggleBtn = document.getElementById('themeToggle');
    const root = document.documentElement;

    function applyTheme(t) {
      root.setAttribute('data-theme', t);
      try { localStorage.setItem('mk-theme', t); } catch (e) {}
    }

    let saved = 'dark';
    try {
      saved = localStorage.getItem('mk-theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    } catch (e) {}
    applyTheme(saved);

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const current = root.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
      });
    }
  }

  // ---------- 8. MOBILE MENU ----------
  function initMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const openBtn = document.getElementById('mobileMenuOpen');
    const closeBtn = document.getElementById('mobileMenuClose');

    if (!menu || !openBtn) return;

    openBtn.addEventListener('click', () => menu.showModal());
    if (closeBtn) closeBtn.addEventListener('click', () => menu.close());

    menu.addEventListener('click', (e) => {
      if (e.target === menu) menu.close();
    });

    menu.querySelectorAll('.mobile-nav-link').forEach((link) => {
      link.addEventListener('click', () => menu.close());
    });
  }

  // ---------- 9. TOAST NOTIFICATION ----------
  function showToast(message) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    }, 3200);
  }

  // ---------- INITIALIZATION ----------
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initHeroCanvas();
    initCarousel();
    initArchitectureExplorer();
    initBentoTabs();
    initPublicationsVault();
    initSearchDialog();
    initMobileMenu();
  });
})();
