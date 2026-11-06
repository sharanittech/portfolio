# Motion System Documentation (`MOTION.md`)

This portfolio is powered by a high-performance, GPU-accelerated motion system designed for 60fps responsiveness, tactile micro-interactions, and accessibility.

---

## 1. Core Architecture & Philosophy

- **Single Source of Truth**: All easing curves and duration tokens are centralized in [`motion-config.js`](file:///d:/protofolio/motion-config.js).
- **GPU Compositing**: All animations strictly animate `transform` (`translate3d`, `scale`, `rotateX`, `rotateY`) and `opacity`. Layout properties (`top`, `left`, `width`, `height`, `margin`) are never animated during scroll or continuous loops.
- **Offscreen Efficiency**: Heavy loops (Three.js particle canvas, orbiting badges) use `IntersectionObserver` to pause execution when offscreen, preserving battery and CPU.
- **Accessibility**: Automatic fallback for `prefers-reduced-motion: reduce`. Heavy particles, 3D tilts, custom cursor, and parallax are automatically disabled for users requesting reduced motion.

---

## 2. Motion Tokens (`motion-config.js`)

```javascript
window.MOTION_CONFIG = {
    ease: {
        out: 'power3.out',               // Primary deceleration curve for entrances
        inOut: 'power2.inOut',           // Smooth transition curve for continuous loops
        elastic: 'elastic.out(1, 0.4)',  // Physical bounce for magnetic buttons & chips
        smooth: 'power1.out',            // Gentle tracking for cursor & 3D tilt
        linear: 'none'                   // For continuous loops & marquee
    },
    duration: {
        fast: 0.3,                       // Micro-interactions, ripples, tech chips
        base: 0.6,                       // Card entrances, section line reveals
        slow: 1.0,                       // Curtain wipes, modal transitions
        ambient: 6.0                     // Photo float cycle
    },
    stagger: 0.08,                       // Default stagger offset between siblings
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};
```

---

## 3. Component Animation Breakdown

### A. Preloader & Hero Entrance
- **Preloader**: Runs once per session via `sessionStorage.getItem('portfolio_preloader_seen')`.
  - SVG brackets and `SHARAN.R` monogram draw using `stroke-dashoffset` (`duration: 1.2s`).
  - Amber progress counter counts `0 → 100` (`duration: 1.4s, ease: power2.inOut`).
  - Curtain wipes upward with GPU `translateY(-100%)` (`duration: 1.0s, ease: power2.inOut`).
- **Hero Entrance**: Triggered as the curtain lifts:
  - Navigation slides down from top (`yPercent: -100 → 0`).
  - Headline lines execute a masked slide-up using `SplitType` (`.line-mask`).
  - Subtext fades in with slight elevation.
  - Photo scales in from `0.9 → 1.0`.
  - Action buttons pop in with `0.1s` overlapping choreography.

### B. Hero Experience
- **Interactive Three.js Canvas (`#hero-canvas`)**:
  - WebGL particle constellation in amber `#F5B301` / `#FF8A00` with dynamic connecting line network.
  - Smooth camera offset tracking cursor proximity.
  - Auto-pauses when the hero section scrolls out of view.
  - Desktop: 80 particles; Mobile (`< 768px`): throttled to 32 particles.
- **Orbiting Tech Badges**:
  - 4 glassmorphism badges (React, Python, Docker, Node) rotating on 3D elliptical orbits.
  - Dynamically calculates scale (`0.85 → 1.1x`) and depth blur (`filter: blur(...)`) when orbiting behind the portrait.
- **Portrait Photo Card**:
  - 6-second sine wave idle floating loop (`y: -10px, yoyo: true`).
  - 3D perspective tilt (`rotateX`, `rotateY`) following cursor position with elastic return.
  - 14s rotating conic-gradient amber glow ring (`#F5B301` → `#FF8A00`).
- **Role Typewriter**: Cycles between `"Full Stack Developer"` and `"ML Enthusiast"` with an animated amber blinking cursor (`|`).
- **Gradient Shimmer**: 4s linear background shimmer loop across the word `"Future"`.
- **Scroll Prompt**: Mouse indicator with animated descending wheel dot that fades out on scroll.

### C. Global Interactions
- **Lenis Smooth Scroll**: Integrated with GSAP Ticker and ScrollTrigger.
- **Scroll Progress Bar (`#scroll-progress`)**: 3px amber gradient bar pinned to the top, scrubbed with page scroll.
- **Dual-Stage Custom Cursor (`.cursor-dot`, `.cursor-ring`)**:
  - Precision center dot + trailing glow ring with `0.18` lerp damping.
  - Expands to `54px` over links and buttons (`.cursor-hover`).
  - Morphs into an amber pill displaying `"VIEW"` over project cards (`.cursor-view`).
  - Automatically hidden on touch devices (`@media (pointer: coarse)`).
- **Magnetic Buttons**: Applied to `.nav-cta`, `.btn-resume`, `.btn-work`, `.filter-btn`, `.theme-toggle`, `.to-top`. Attracts within an 80px radius with `elastic.out(1, 0.4)` return.
- **Button Micro-Interactions**: Hover shine sweep (25° light bar) and click ripple (`.btn-ripple`).
- **Smart Navbar**:
  - Hides on scroll down (`translateY(-100%)`), reveals on scroll up.
  - Frosted glass backdrop blur (`24px`) activates after 50px of scroll.
  - Sliding amber underline (`.nav-indicator`) tracks the active section and previews on link hover.
- **Theme Toggle**: Circular expanding clip-path transition (`::view-transition-new(root)`) with SVG morphing between crescent moon and radiating sun.
- **Headings Decode**: Section titles scramble with randomized alphanumeric glyphs and decode from left to right on initial view.

### D. Milestones & Skills
- **Milestones**:
  - Staggered card entrance from below (`y: 45`, slight `±2°` rotation).
  - GSAP ease-out count-up (`power2.out`) for 5, 5, 45, 19.
  - Delayed suffix reveal: `" hrs"` fades in only after `45` finishes counting.
  - 3D card tilt and cursor-following glass spotlight.
- **Skills**:
  - Section header pins smoothly on desktop screens (`≥ 850px`).
  - Radial wave stagger reveal from top-left (`grid: "auto", from: "start"`).
  - 3D tile tilt with real-time radial spotlight glow (`--mouse-x`, `--mouse-y`).
  - Unique micro-animations: React atom spin, Docker whale float/bob, GitHub pulse.
  - Infinite marquee strip under the grid that slows down smoothly on hover.
  - Subtitle word-by-word scroll-scrubbed highlight (`#555555 → #ffffff`).

### E. Projects Ecosystem
- **Filter Bar & GSAP Flip**:
  - Sliding pill indicator under active category button.
  - 60fps layout reflow via `Flip.from()` with card scale/fade exit and staggered entrance.
- **Card Hover**: 8px lift, 1.06x image zoom, rotating conic-gradient border.
- **Tech Chips**: Pop in sequentially with spring ease (`back.out(2)`) as each card enters viewport.
- **Flagship Project**:
  - Scroll-driven image parallax (`yPercent: 12`).
  - Sequential bullet-point reveals.
  - Animated Architecture Diagram (**Transactions → Streaming → ML Model → Alerts**) with flowing amber dashed strokes and rhythmic node pulse glows.
- **Shared-Element Modal**: Scales in (`0.88 → 1.0`) with 14px backdrop blur, staggered content cascading, and reversible exit with ESC key support.

### F. Timeline, Contact & Extras
- **Timeline**: Vertical amber line draws downward with scroll; nodes pop into view as the line reaches them; cards slide in from alternating sides.
- **Contact Form**:
  - Floating labels using CSS `:focus` and `:not(:placeholder-shown)`.
  - Expanding amber focus underline (`.focus-line`).
  - Submit button morphs into a loading spinner, then into a checkmark icon, triggering a multi-color confetti particle burst.
- **"Top" Button**: Scales in after 400px scroll; displays a circular SVG scroll-progress ring around the button; ample margin prevents right-edge clipping.
- **Logo Easter Egg**: 5 rapid clicks on the `SHARAN.R` logo triggers an amber/gold confetti firework burst and playful logo bounce.

---

## 4. How to Tweak Speeds

### Change Global Animation Speeds
Open [`motion-config.js`](file:///d:/protofolio/motion-config.js) and modify the `duration` tokens:
```javascript
duration: {
    fast: 0.3,     // Increase to e.g. 0.45s for slower button animations
    base: 0.6,     // Increase to e.g. 0.9s for more cinematic card reveals
    slow: 1.0,     // Adjust curtain wipe and modal speed
    ambient: 6.0   // Adjust hero photo floating speed
}
```

### Change Preloader Duration
In [`script.js`](file:///d:/protofolio/script.js) inside the `preloaderTl` timeline:
```javascript
.to(countObj, { val: 100, duration: 1.4, ease: "power2.inOut" }) // change 1.4 to e.g. 1.0 for faster preloader
```

### Change Particle Count / Orbit Speeds
In [`script.js`](file:///d:/protofolio/script.js):
- **Particle density**: In `initHeroParticles()`, adjust `particleCount` (`80` desktop, `32` mobile).
- **Orbit speeds**: In `initHeroOrbits()`, modify the `speed` property in `badges` (`0.55`, `0.40`, `0.48`, `0.35`).

### Change Marquee Scroll Speed
In [`style.css`](file:///d:/protofolio/style.css):
```css
.skills-marquee-track {
    animation: marquee-scroll 32s linear infinite; /* decrease to e.g. 20s for faster, increase to 45s for slower */
}
```

---

## 5. How to Disable Specific Effects

### Disable All Motion (Programmatic Reduced Motion)
In [`motion-config.js`](file:///d:/protofolio/motion-config.js), set:
```javascript
reducedMotion: true
```
This activates instant fallback across the entire portfolio.

### Disable Hero Particle Canvas Only
In [`style.css`](file:///d:/protofolio/style.css):
```css
.hero-canvas { display: none !important; }
```

### Disable Custom Cursor (Use System Cursor)
In [`style.css`](file:///d:/protofolio/style.css):
```css
.cursor-dot, .cursor-ring { display: none !important; }
```

### Disable Preloader Completely
In [`script.js`](file:///d:/protofolio/script.js):
```javascript
sessionStorage.setItem("portfolio_preloader_seen", "true");
```
Or remove the `#preloader` block in [`index.html`](file:///d:/protofolio/index.html).
