# Portfolio
Personal portfolio website for Sharan R showcasing skills, projects, education, and contact details.

## Structure
- `index.html` main page
- `style.css` styling
- `script.js` interactions/animations
- `sharan resume.pdf` resume download
- `*.jpg` / `*.png` assets

## Features
- **3D Hero & Motion System:** WebGL Three.js interactive constellation, 3D photo tilt, orbiting satellite badges, role typewriter, and magnetic buttons
- **Motion Toggle Switch:** Navbar `[✨ Motion: ON/OFF]` controller allowing manual animation override regardless of OS accessibility flags
- **About Me & Engineering Ethos:** Comprehensive background narrative, university details, and terminal profile card
- **Skills Category Filter:** Dynamic filtering across Languages, Frontend, Backend & DB, and DevOps & Tools
- **Interactive Developer CLI Terminal:** Retro-modern in-browser terminal (`~/sharan-cli $`) with autocomplete commands (`about`, `skills`, `projects`, `hire`, etc.)
- **Resume In-Page Modal Viewer:** Instant PDF preview in-page without requiring a file download
- **Work Experience & Timeline:** Industrial internship at Inteovo Edu (School Automation Software), 45-hr ML Training, OCI 2025 Associate certification, and IBM Data Visualization
- **Project Bento Grid & Case Studies:** GSAP Flip layout filter, real-time animated architecture pipeline diagram, radar metric DNA chart modal, and company-assigned `school-app` project
- **Theme Toggle:** Circular SVG clip-path morph between dark and light modes
- **Milestones & Timeline:** Ease-out counter animation and scroll-drawn progress line with scroll-linked milestone dot ignition
- **Holographic Mouse Sheen & Specular Glow:** Real-time radial light tracking across project, skill, and credential cards
- **Matrix Text Scramble / Decoder:** Cyber-style text decryption effect on section titles and project cards on hover
- **One-Click Copy Email & Direct Mailto Fallback:** Instant clipboard copying with animated feedback and mailto dispatch fallback
- **Certificate Verification Modal System:** Deep-dive credential inspection with skills validated, issuing authority, and profile verification links
- **Web Audio API Synthesized Sound Haptics:** Zero-asset browser audio engine with interactive navbar mute/sound switch
- **Spotlight Command Palette (Ctrl+K):** Keyboard-driven search & jump launcher for instant navigation, actions, and project search
- **Interactive Project Simulators:** Live playgrounds in case study modals for `school-app` (staff attendance & payroll engine) and `Online Banking` (real-time ML anomaly streaming)
- **Live Accent Color Customizer:** 4-theme palette switcher (Solar Amber, Cyber Cyan, Neon Emerald, Electric Violet) with persistent CSS custom properties
- **GitHub Contribution Matrix & Stack Card:** Profile metrics, 48-day active streak, commit heatmap, and primary language breakdown
- **PWA & Enhanced Meta:** Web App Manifest (`manifest.json`) and rich OpenGraph/Twitter Card social sharing metadata
- **Floating Glass Capsule Navbar (Linear/Apple Grade):** 3-zone architecture with brand availability beacon, center frosted glass navigation pill, and unified preferences cluster
- **Live Local Timezone & Status Beacon:** Real-time ticking IST clock and "Ready for Software Roles" status pill in the hero section
- **Computer Science Foundations & DSA Matrix:** Dedicated engineering core matrix showing 150+ problems solved, DSA (85%), DBMS (90%), OOP (92%), and OS/Networks (84%)
- **Instant Project Tech Search:** Real-time multi-attribute search and filter bar for projects by technology stack, title, and tags
- **Floating Quick Action Dock:** Bottom-centered glass action pill with 1-click access to CV, WhatsApp, Email, and Keyboard Shortcuts
- **Keyboard Shortcuts HUD Modal (?):** Complete pro developer shortcut cheat sheet with hotkeys (`Ctrl+K`, `Ctrl+``, `O`, `T`, `M`, `S`, `Esc`, `?`)
- **15-Second Audio Elevator Pitch & Equalizer:** Voice speech pitch in Hero with animated audio visualizer waves
- **Live Interactive Code Playground ("Run Sharan's Code"):** In-browser virtual IDE executing live TypeScript/Python algorithms (`payrollEngine.ts`, `fraudClassifier.ts`, `binaryBenchmark.ts`) with parameter adjustments and stdout console
- **Interactive Full-Stack Architecture Flow Diagram:** Animated micro-tier pipeline in Case Studies (React 19 SPA -> Express Gateway -> PostgreSQL Database -> Python ML Service) with live packet flow and tier inspector
- **Community Reactions & Recruiter Endorsement Bar:** Live star counter with confetti burst, reaction pills (🔥, 🚀, 💡, 👏), and interactive visitor guestbook stream
- **Printable Recruiter Executive One-Pager:** Dedicated 1-page condensed dashboard optimized with print-CSS (`window.print()`) for instant recruiter interviews with zero ink waste
- **Contact & Lead Generation:** Floating glassmorphism form with multi-state button morph and celebratory confetti burst

## Run Locally
Open `index.html` directly in a browser, or serve locally:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Automated Playwright Testing
An end-to-end Playwright test suite is included in `tests/portfolio.spec.js`. It validates the preloader, 3D hero canvas, global interactions, theme toggle, project filters, modal expansion, contact form, and responsive behavior (375px, 768px, 1440px).

### Install & Run Tests
```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browser binaries (one time)
npx playwright install

# 3. Run all tests headlessly across Chrome, Firefox, Safari & Mobile
npm test

# 4. Run tests with visible browser UI
npm run test:headed

# 5. Open interactive Playwright Test UI
npm run test:ui

# 6. View generated test report
npm run test:report
```

## Motion System
See [`MOTION.md`](MOTION.md) for full documentation of the animation tokens, duration controls, component breakdowns, and how to tweak speeds or disable specific motion modules.

## Configuration Notes
- Update the Formspree endpoint in `index.html` to receive contact form submissions.
- Replace project GitHub links with the actual repository URLs.

## Image Optimization
Images have been converted to WebP for faster load times. To re-run conversion:

```bash
python convert_images.py
```
