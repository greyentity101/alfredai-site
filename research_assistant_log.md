# Research Assistant Log — Mohit Kumar

This log tracks automated research profile maintenance, publication updates, and site health checks.

---

## 2026-08-17

### Session: Website Enhancement & Deployment Verification

**Time:** 14:30–14:45 IST

**Actions Taken:**
1. Enhanced `index.html` with sharper research profile content:
   - Updated hero headline and lede to emphasize AI in interventional medicine, photon-counting CT, and DICOM-native AI orchestration
   - Refreshed focus areas with concrete technical details (CdTe/CZT detectors, STOW-RS ingestion, E1–E4 evaluation)
   - Updated "Current work" and "Looking for" sections with specific project references
   - Refined hero tags for better keyword relevance

2. Polished `styles.css` with advanced micro-interactions:
   - Enhanced card hover with cubic-bezier transitions and subtle box-shadow glow
   - Added gradient-shift animation to hero accent text
   - Improved aurora orb keyframes with multi-stop drift animations
   - Enhanced chip, social icon, and link-pill hover states with transform and shadow effects
   - Upgraded mobile nav with scale/fade transitions and animated hamburger-to-X morphing
   - Added custom scrollbar styling and enhanced focus-visible outlines
   - Improved stat-card hover with top accent line reveal
   - Enhanced glass-panel open/close transitions

3. Upgraded `app.js` with production-grade features:
   - Added publication search input with real-time filtering across title, authors, abstract, and topics
   - Implemented one-click copy citation button with clipboard API and success feedback
   - Added filter persistence via localStorage so user filter choices survive page reloads
   - Enhanced mobile nav with click-outside-to-close and animated hamburger toggle
   - Improved mobile nav state sync between toggle button and menu

4. Synced latest dicomweb-ai-gateway paper assets:
   - Copied `paper/article.md` → `assets/papers/dicomweb-ai-gateway-article.md`
   - Copied `paper/abstract.txt` → `assets/papers/dicomweb-ai-gateway-abstract.txt`
   - Copied `paper/figures/` → `assets/papers/figures/` (5 PNGs: architecture, E1–E4 results)
   - Updated publication link in app.js to use local synced article

5. Verified site health:
   - Local preview server confirmed running on `http://localhost:8080` (HTTP 200)
   - Site title renders correctly: "Mohit Kumar — Researcher in Healthcare IT, PACS & Networking"
   - Hermes desktop app running (PID 24188), gateway active for cron jobs
   - Cron job "Research Profile Maintainer" scheduled daily at 09:00 IST

**Status:** All enhancements deployed. Site verified live locally. Awaiting production deployment to GitHub Pages.

---

## 2026-08-17 (Earlier)

### Session: Hermes Setup & Website Deployment

**Time:** 09:00–12:00 IST

**Actions Taken:**
1. Configured Hermes with 100% free/local Ollama models:
   - Removed all paid/cloud providers from `config.yaml`
   - Kept only `qwen3.5:9b`, `qwen2.5-coder:14b`, `qwen2.5:3b`, `alfred-soup:latest`
   - Removed duplicate config at `C:\Users\jaat\.hermes\config.yaml`
   - Verified Hermes doctor passes clean

2. Deployed `alfredai-site` to GitHub Pages:
   - Repository: `https://github.com/greyentity101/alfredai-site.git`
   - Live URL: `https://greyentity101.github.io/alfredai-site/`
   - Added `.github/workflows/deploy.yml` for automated deployments
   - Verified site returns HTTP 200

3. Set up Hermes cron job:
   - Name: "Research Profile Maintainer"
   - Schedule: Daily at 9:00 AM IST
   - Workdir: `C:\Users\jaat\github\alfredai-site`
   - Responsibilities: audit publications, commit reports, prepare LinkedIn content, verify site accessibility

---

## Protocol

- Run `python -m http.server 8080` from `C:\Users\jaat\github\alfredai-site` for local preview
- Check site with `Invoke-WebRequest http://localhost:8080`
- Commit changes with `git add . && git commit -m "feat: ..." && git push`
- Update this log after every research profile maintenance session
