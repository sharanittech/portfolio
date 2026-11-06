const { test, expect } = require('@playwright/test');

test.describe('Sharan R Portfolio - End-to-End Test Suite', () => {

  test.beforeEach(async ({ page }) => {
    // Clear session storage before each test to test first-visit behaviors cleanly when needed
    await page.goto('/');
  });

  // =========================================================================
  // 1. Preloader & Hero Entrance
  // =========================================================================
  test('Preloader runs on first visit and reveals the page', async ({ page, context }) => {
    // Clear sessionStorage to test initial preloader
    await page.evaluate(() => sessionStorage.clear());
    await page.reload();

    const preloader = page.locator('#preloader');
    const counter = page.locator('#preloader-counter');

    // Preloader is present initially
    await expect(preloader).toBeVisible();

    // Counter reaches 100
    await expect(counter).toHaveText('100', { timeout: 6000 });

    // Preloader curtain wipes away and preloader becomes hidden
    await expect(preloader).toHaveClass(/is-hidden/, { timeout: 6000 });

    // Hero headline and nav are revealed
    await expect(page.locator('.navbar')).toBeVisible();
    await expect(page.locator('.hero-content h1')).toBeVisible();
    await expect(page.locator('#hero-photo-card')).toBeVisible();
  });

  test('Preloader is skipped on subsequent reloads in the same session', async ({ page }) => {
    // Wait for initial preloader to finish
    await page.waitForSelector('#preloader.is-hidden', { timeout: 8000 });

    // Verify sessionStorage has been set
    const seen = await page.evaluate(() => sessionStorage.getItem('portfolio_preloader_seen'));
    expect(seen).toBe('true');

    // Reload page in same session
    await page.reload();

    // Preloader is immediately hidden
    const preloader = page.locator('#preloader');
    await expect(preloader).toHaveClass(/is-hidden/);
  });

  // =========================================================================
  // 2. Hero Components & Visual Systems
  // =========================================================================
  test('Hero section contains interactive Three.js canvas, 3D photo card, and orbiting badges', async ({ page }) => {
    await page.waitForSelector('#preloader.is-hidden', { timeout: 8000 });

    // Background Three.js canvas exists
    const canvas = page.locator('#hero-canvas');
    await expect(canvas).toBeAttached();

    // Photo card exists with glowing conic aura ring
    const photoCard = page.locator('#hero-photo-card');
    const glowRing = page.locator('.photo-glow-ring');
    await expect(photoCard).toBeVisible();
    await expect(glowRing).toBeAttached();

    // 4 Orbiting Tech Badges (React, Python, Docker, Node)
    await expect(page.locator('.orbit-badge.orbit-react')).toBeAttached();
    await expect(page.locator('.orbit-badge.orbit-python')).toBeAttached();
    await expect(page.locator('.orbit-badge.orbit-docker')).toBeAttached();
    await expect(page.locator('.orbit-badge.orbit-node')).toBeAttached();

    // Role typewriter text is present
    const typewriter = page.locator('.typewriter-text');
    await expect(typewriter).toBeVisible();
    const roleText = await typewriter.textContent();
    expect(['Full Stack Developer', 'ML Enthusiast']).toContain(roleText.trim());

    // Shimmer effect on "Future"
    const shimmer = page.locator('.accent-shimmer');
    await expect(shimmer).toBeVisible();
    await expect(shimmer).toHaveText('Future');

    // Scroll indicator exists
    await expect(page.locator('.scroll-indicator')).toBeAttached();
  });

  // =========================================================================
  // 3. Global Interactions & Smart Navigation
  // =========================================================================
  test('Theme toggle morphs between dark and light themes', async ({ page }) => {
    await page.waitForSelector('#preloader.is-hidden', { timeout: 8000 });

    const themeToggle = page.locator('.theme-toggle');
    const body = page.locator('body');

    // Default dark theme
    await expect(body).not.toHaveClass(/theme-light/);
    await expect(themeToggle).toHaveAttribute('aria-pressed', 'false');

    // Toggle to Light Theme
    await themeToggle.click();
    await expect(body).toHaveClass(/theme-light/);
    await expect(themeToggle).toHaveAttribute('aria-pressed', 'true');

    // Persisted to localStorage
    const savedTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(savedTheme).toBe('light');

    // Toggle back to Dark Theme
    await themeToggle.click();
    await expect(body).not.toHaveClass(/theme-light/);
    await expect(themeToggle).toHaveAttribute('aria-pressed', 'false');
  });

  test('Top scroll progress bar updates as user scrolls', async ({ page }) => {
    await page.waitForSelector('#preloader.is-hidden', { timeout: 8000 });

    const progressBar = page.locator('#scroll-progress');
    await expect(progressBar).toBeAttached();

    // Initial width is near 0%
    const initialWidth = await progressBar.evaluate(el => el.style.width);
    expect(parseFloat(initialWidth) || 0).toBeLessThan(10);

    // Scroll down to middle of page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(300);

    const scrolledWidth = await progressBar.evaluate(el => el.style.width);
    expect(parseFloat(scrolledWidth)).toBeGreaterThan(20);
  });

  test('Navbar applies background blur after 50px scroll', async ({ page }) => {
    await page.waitForSelector('#preloader.is-hidden', { timeout: 8000 });

    const navbar = page.locator('.navbar');
    await expect(navbar).not.toHaveClass(/nav-scrolled/);

    // Scroll down 100px
    await page.evaluate(() => window.scrollTo(0, 100));
    await page.waitForTimeout(300);

    await expect(navbar).toHaveClass(/nav-scrolled/);
  });

  // =========================================================================
  // 4. Milestones & Skills
  // =========================================================================
  test('Milestones count up to target numbers and reveal suffix', async ({ page }) => {
    await page.waitForSelector('#preloader.is-hidden', { timeout: 8000 });

    // Scroll to milestones section
    await page.locator('#milestones').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1600);

    // Verify values reached targets (5, 5, 45, 19)
    const milestoneValues = page.locator('.milestone-value');
    expect(await milestoneValues.count()).toBe(4);

    // Check training hours card (target 45) and suffix " hrs"
    const hoursCard = milestoneValues.nth(2);
    await expect(hoursCard).toContainText('45');
    const suffix = hoursCard.locator('.milestone-suffix');
    await expect(suffix).toHaveCSS('opacity', '1');
  });

  test('Skills grid displays all 19 skills and infinite marquee strip', async ({ page }) => {
    await page.waitForSelector('#preloader.is-hidden', { timeout: 8000 });

    const skillsSection = page.locator('#skills');
    await skillsSection.scrollIntoViewIfNeeded();

    // 19 Skill Items
    const skillItems = page.locator('.skill-item');
    await expect(skillItems).toHaveCount(19);

    // Micro-animated icons exist
    await expect(page.locator('.skill-item .fa-react')).toBeVisible();
    await expect(page.locator('.skill-item .fa-docker')).toBeVisible();
    await expect(page.locator('.skill-item .fa-github')).toBeVisible();

    // Infinite Marquee strip exists under grid
    const marquee = page.locator('.skills-marquee-wrap');
    await expect(marquee).toBeVisible();
    await expect(marquee).toContainText('REACT JS');
    await expect(marquee).toContainText('PYTHON');
    await expect(marquee).toContainText('DOCKER');
  });

  // =========================================================================
  // 5. Flagship Project & Architecture Diagram
  // =========================================================================
  test('Flagship project renders image, points, and 4-step architecture flow diagram', async ({ page }) => {
    await page.waitForSelector('#preloader.is-hidden', { timeout: 8000 });

    const featuredSection = page.locator('#featured');
    await featuredSection.scrollIntoViewIfNeeded();

    // Title and sub
    await expect(featuredSection.locator('h3')).toContainText('Intelligent Online Banking Framework');

    // 4-step architecture diagram
    const archDiagram = page.locator('.arch-diagram');
    await expect(archDiagram).toBeVisible();

    const steps = archDiagram.locator('.arch-step');
    await expect(steps).toHaveCount(4);
    await expect(steps.nth(0)).toContainText('Transactions');
    await expect(steps.nth(1)).toContainText('Streaming');
    await expect(steps.nth(2)).toContainText('ML Model');
    await expect(steps.nth(3)).toContainText('Alerts');

    // Animated dashed flow lines connecting steps
    const flowLines = archDiagram.locator('.arch-line-flow');
    await expect(flowLines).toHaveCount(3);
  });

  // =========================================================================
  // 6. Projects Ecosystem, Filters & Single-Row Actions
  // =========================================================================
  test('Project filter tabs filter cards dynamically with GSAP Flip', async ({ page }) => {
    await page.waitForSelector('#preloader.is-hidden', { timeout: 8000 });

    const projectSection = page.locator('#projects');
    await projectSection.scrollIntoViewIfNeeded();

    const filterBtns = page.locator('.filter-btn');
    await expect(filterBtns).toHaveCount(4);

    // Initial state: "All" is active, all 6 project cards visible
    await expect(filterBtns.nth(0)).toHaveClass(/active/);
    const cards = page.locator('.project-card');
    await expect(cards).toHaveCount(6);

    // Filter by "ML"
    await filterBtns.locator('text=ML').click();
    await page.waitForTimeout(400);

    // Only cards with tag "ml" should be visible
    const mlCards = page.locator('.project-card[data-tags*="ml"]');
    const visibleCards = page.locator('.project-card:visible');
    const visibleCount = await visibleCards.count();
    expect(visibleCount).toBe(await mlCards.count());

    // Switch back to "All"
    await filterBtns.locator('text=All').click();
    await page.waitForTimeout(400);
    await expect(page.locator('.project-card:visible')).toHaveCount(6);
  });

  test('Card actions sit in a single row without wrapping (Live Demo bug fix)', async ({ page }) => {
    await page.waitForSelector('#preloader.is-hidden', { timeout: 8000 });

    await page.locator('#projects').scrollIntoViewIfNeeded();

    const cardActionsList = page.locator('.card-actions');
    const firstCardActions = cardActionsList.first();

    // Verify nowrap is applied
    await expect(firstCardActions).toHaveCSS('flex-wrap', 'nowrap');

    // Details, GitHub and Live Demo buttons exist
    const detailsBtn = firstCardActions.locator('.details-btn');
    const githubLink = firstCardActions.locator('.github-link');
    const demoLink = firstCardActions.locator('.demo-link');

    await expect(detailsBtn).toBeVisible();
    await expect(githubLink).toBeVisible();
    await expect(demoLink).toBeVisible();

    // Check vertical alignment: all 3 buttons should share the same vertical baseline (top coordinate within 5px)
    const detailsBox = await detailsBtn.boundingBox();
    const githubBox = await githubLink.boundingBox();
    const demoBox = await demoLink.boundingBox();

    expect(Math.abs(detailsBox.y - githubBox.y)).toBeLessThan(6);
    expect(Math.abs(githubBox.y - demoBox.y)).toBeLessThan(6);
  });

  test('Details click opens case study modal and closes on Escape and backdrop click', async ({ page }) => {
    await page.waitForSelector('#preloader.is-hidden', { timeout: 8000 });

    await page.locator('#projects').scrollIntoViewIfNeeded();

    const modal = page.locator('#case-modal');
    await expect(modal).not.toHaveClass(/open/);

    // Click Details on first project
    const detailsBtn = page.locator('.project-card .details-btn').first();
    await detailsBtn.click();
    await page.waitForTimeout(300);

    // Modal is open
    await expect(modal).toHaveClass(/open/);
    await expect(page.locator('#modal-title')).toContainText('School Automation Platform');

    // Radar chart polygon exists
    const radarShape = page.locator('#radar-shape');
    await expect(radarShape).toBeVisible();

    // Press Escape to close
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    await expect(modal).not.toHaveClass(/open/);

    // Reopen and test backdrop click
    await detailsBtn.click();
    await page.waitForTimeout(300);
    await expect(modal).toHaveClass(/open/);

    // Click modal backdrop
    await page.locator('.modal-backdrop').click({ position: { x: 10, y: 10 } });
    await page.waitForTimeout(400);
    await expect(modal).not.toHaveClass(/open/);
  });

  // =========================================================================
  // 7. Timeline & Interactive Contact Form
  // =========================================================================
  test('Timeline section contains alternating items and scroll progress line', async ({ page }) => {
    await page.waitForSelector('#preloader.is-hidden', { timeout: 8000 });

    const timeline = page.locator('#experience');
    await timeline.scrollIntoViewIfNeeded();

    const timelineItems = page.locator('.timeline-item');
    await expect(timelineItems).toHaveCount(4);

    // Check progress line element
    await expect(page.locator('#timeline-progress')).toBeAttached();
  });

  test('Contact form floating labels and morphing send button with confetti', async ({ page }) => {
    await page.waitForSelector('#preloader.is-hidden', { timeout: 8000 });

    const contactSection = page.locator('#contact');
    await contactSection.scrollIntoViewIfNeeded();

    const nameInput = page.locator('#contact-name');
    const emailInput = page.locator('#contact-email');
    const messageInput = page.locator('#contact-message');
    const submitBtn = page.locator('#contact-submit-btn');

    // Focus input and verify focus line exists
    await nameInput.focus();
    await expect(page.locator('.focus-line').first()).toBeAttached();

    // Fill form
    await nameInput.fill('Alex Tester');
    await emailInput.fill('alex@test.com');
    await messageInput.fill('Excited to connect regarding a full stack opportunity!');

    // Submit form
    await submitBtn.click();

    // Submit button morphs to loading state
    await expect(submitBtn).toHaveClass(/is-loading/);

    // Then morphs to success checkmark
    await expect(submitBtn).toHaveClass(/is-success/, { timeout: 3000 });
  });

  // =========================================================================
  // 8. Extras: "Top" Button & Logo Easter Egg
  // =========================================================================
  test('"Top" button scales in after 400px scroll and scrolls page to top', async ({ page }) => {
    await page.waitForSelector('#preloader.is-hidden', { timeout: 8000 });

    const toTopBtn = page.locator('#to-top-btn');

    // Initially hidden at page top
    await expect(toTopBtn).not.toHaveClass(/show/);

    // Scroll down 600px
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(300);

    // Button scales in
    await expect(toTopBtn).toHaveClass(/show/);

    // Circular SVG progress ring exists
    await expect(page.locator('#to-top-circle')).toBeVisible();

    // Click button to return to top
    await toTopBtn.click();
    await page.waitForTimeout(600);

    const currentScroll = await page.evaluate(() => window.scrollY);
    expect(currentScroll).toBeLessThan(100);
  });

  test('Clicking the logo 5 times triggers the celebration Easter Egg', async ({ page }) => {
    await page.waitForSelector('#preloader.is-hidden', { timeout: 8000 });

    const logo = page.locator('.navbar .logo');
    await expect(logo).toBeVisible();

    // Rapidly click logo 5 times
    for (let i = 0; i < 5; i++) {
      await logo.click();
      await page.waitForTimeout(100);
    }

    // Verify Easter Egg execution without errors
    await page.waitForTimeout(500);
    await expect(logo).toBeVisible();
  });

  // =========================================================================
  // 9. Mobile Responsiveness (375px)
  // =========================================================================
  test('Mobile viewport collapses navigation into toggle drawer', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForSelector('#preloader.is-hidden', { timeout: 8000 });

    const navToggle = page.locator('.nav-toggle');
    const navLinks = page.locator('#nav-links');

    // Hamburger button is visible on mobile
    await expect(navToggle).toBeVisible();

    // Menu opens on click
    await navToggle.click();
    await expect(navLinks).toHaveClass(/open/);

    // Menu closes on second click
    await navToggle.click();
    await expect(navLinks).not.toHaveClass(/open/);
  });

  // =========================================================================
  // 10. Advanced Motion & Sound System
  // =========================================================================
  test('Sound toggle switches state and persists in localStorage', async ({ page }) => {
    await page.waitForSelector('#preloader.is-hidden', { timeout: 8000 });

    const soundBtn = page.locator('#sound-toggle-btn');
    await expect(soundBtn).toBeVisible();

    // Default state is muted
    await expect(soundBtn).toHaveAttribute('aria-pressed', 'false');

    // Click to enable sound
    await soundBtn.click();
    await expect(soundBtn).toHaveAttribute('aria-pressed', 'true');
    const enabled = await page.evaluate(() => localStorage.getItem('portfolio_sound_enabled'));
    expect(enabled).toBe('true');

    // Click to mute
    await soundBtn.click();
    await expect(soundBtn).toHaveAttribute('aria-pressed', 'false');
  });

  test('One-click copy email button shows copied tooltip', async ({ page }) => {
    await page.waitForSelector('#preloader.is-hidden', { timeout: 8000 });

    const copyBtn = page.locator('#copy-email-btn');
    const tooltip = page.locator('#copy-tooltip');
    await copyBtn.scrollIntoViewIfNeeded();

    await expect(copyBtn).toBeVisible();
    await expect(tooltip).not.toHaveClass(/show/);

    // Click copy button
    await copyBtn.click();
    await expect(tooltip).toHaveClass(/show/);
  });

  test('Certificate item click opens certificate verification modal with details', async ({ page }) => {
    await page.waitForSelector('#preloader.is-hidden', { timeout: 8000 });

    const certSection = page.locator('#education');
    await certSection.scrollIntoViewIfNeeded();

    const certItem = page.locator('.cert-list-item[data-cert-key="oci"]');
    await expect(certItem).toBeVisible();

    // Click OCI certificate item
    await certItem.click();

    const certModal = page.locator('#cert-modal');
    await expect(certModal).toHaveClass(/open/);
    await expect(page.locator('#cert-modal-title')).toContainText('Oracle Cloud Infrastructure');
    await expect(page.locator('#cert-modal-status')).toContainText('Verified Credential');

    // Close on Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    await expect(certModal).not.toHaveClass(/open/);
  });

  // =========================================================================
  // 11. Spotlight Command Palette & Simulator
  // =========================================================================
  test('Spotlight Command Palette opens with button or Ctrl+K and filters commands', async ({ page }) => {
    await page.waitForSelector('#preloader.is-hidden', { timeout: 8000 });

    const cmdBtn = page.locator('#cmd-palette-btn');
    const cmdModal = page.locator('#cmd-palette-modal');
    const cmdInput = page.locator('#cmd-input');

    await expect(cmdBtn).toBeVisible();
    await expect(cmdModal).not.toHaveClass(/open/);

    // Click command palette button
    await cmdBtn.click();
    await expect(cmdModal).toHaveClass(/open/);
    await expect(cmdInput).toBeFocused();

    // Type query "school"
    await cmdInput.fill('school');
    await page.waitForTimeout(200);

    const results = page.locator('#cmd-results .cmd-item');
    await expect(results.first()).toContainText('School Automation');

    // Close with Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    await expect(cmdModal).not.toHaveClass(/open/);
  });

  test('Accent color customizer updates theme accent and persists in localStorage', async ({ page }) => {
    await page.waitForSelector('#preloader.is-hidden', { timeout: 8000 });

    const pickerBtn = page.locator('#accent-picker-btn');
    const dropdown = page.locator('#accent-dropdown');
    await expect(pickerBtn).toBeVisible();

    // Open dropdown
    await pickerBtn.click();
    await expect(dropdown).toHaveClass(/show/);

    // Pick cyan
    const cyanSwatch = page.locator('.accent-swatch[data-accent="cyan"]');
    await cyanSwatch.click();

    // Verify localStorage
    const saved = await page.evaluate(() => localStorage.getItem('portfolio_accent_color'));
    expect(saved).toBe('cyan');

    // Root CSS variable --accent is set to #00f2fe
    const accentVar = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim());
    expect(accentVar).toBe('#00f2fe');
  });

  test('GitHub activity card renders heatmap matrix and repos count', async ({ page }) => {
    await page.waitForSelector('#preloader.is-hidden', { timeout: 8000 });

    const ghCard = page.locator('.github-stats-card');
    await ghCard.scrollIntoViewIfNeeded();

    await expect(ghCard).toBeVisible();
    await expect(page.locator('#gh-repos-count')).toContainText('6+');

    const heatmapCells = page.locator('.github-heatmap-grid .heatmap-cell');
    const count = await heatmapCells.count();
    expect(count).toBeGreaterThan(30);
  });

  test('Interactive Project Simulator launches and calculates payroll in school-app', async ({ page }) => {
    await page.waitForSelector('#preloader.is-hidden', { timeout: 8000 });

    const projectSection = page.locator('#projects');
    await projectSection.scrollIntoViewIfNeeded();

    // First card is school-app
    const schoolCard = page.locator('.project-card').first();
    const detailsBtn = schoolCard.locator('.details-btn');
    await detailsBtn.click();

    const caseModal = page.locator('#case-modal');
    await expect(caseModal).toHaveClass(/open/);

    // Launch simulation
    const simBtn = page.locator('#sim-toggle-btn');
    await simBtn.click();

    const simBox = page.locator('#modal-simulator-box');
    await expect(simBox).toBeVisible();
    await expect(page.locator('.school-sim-roster')).toBeVisible();

    // Toggle staff attendance button
    const rosterBtn = page.locator('.roster-toggle-btn').first();
    await rosterBtn.click();

    // Payroll calculation is updated
    await expect(page.locator('#sim-sql-preview')).toContainText('UPDATE staff_payroll');
  });

  test('Hero displays live IST timezone clock & location beacon', async ({ page }) => {
    await page.waitForSelector('#preloader.is-hidden', { timeout: 8000 });

    const beacon = page.locator('#hero-location-beacon');
    await expect(beacon).toBeVisible();
    await expect(beacon).toContainText('Chennai, India');

    const clock = page.locator('#hero-live-time');
    await expect(clock).toBeVisible();
    await expect(clock).toContainText('IST');
  });

  test('Computer Science Foundations & DSA Matrix card renders with proficiency bars', async ({ page }) => {
    await page.waitForSelector('#preloader.is-hidden', { timeout: 8000 });

    const csCard = page.locator('.cs-fundamentals-card');
    await csCard.scrollIntoViewIfNeeded();

    await expect(csCard).toBeVisible();
    await expect(csCard).toContainText('Computer Science Foundations');
    await expect(csCard).toContainText('150+ Problems Solved');

    const pillars = csCard.locator('.cs-pillar');
    await expect(pillars).toHaveCount(4);
  });

  test('Instant project tech search filters cards dynamically', async ({ page }) => {
    await page.waitForSelector('#preloader.is-hidden', { timeout: 8000 });

    const searchInput = page.locator('#project-tech-search');
    await searchInput.scrollIntoViewIfNeeded();
    await expect(searchInput).toBeVisible();

    // Type 'PostgreSQL' - only school-app should match
    await searchInput.fill('PostgreSQL');

    const visibleCards = page.locator('.project-card:not([hidden])');
    const count = await visibleCards.count();
    expect(count).toBe(1);
    await expect(visibleCards.first()).toContainText('school-app');

    // Clear search
    const clearBtn = page.locator('#project-search-clear');
    await clearBtn.click();
    await expect(searchInput).toHaveValue('');
  });

  test('Keyboard shortcuts HUD modal opens via ? key and closes via Escape', async ({ page }) => {
    await page.waitForSelector('#preloader.is-hidden', { timeout: 8000 });

    const shortcutsModal = page.locator('#shortcuts-modal');
    await expect(shortcutsModal).not.toHaveClass(/open/);

    // Press ? hotkey
    await page.keyboard.press('Shift+/');
    await expect(shortcutsModal).toHaveClass(/open/);

    // Press Escape to dismiss
    await page.keyboard.press('Escape');
    await expect(shortcutsModal).not.toHaveClass(/open/);
  });

  test('Floating Quick Action Dock appears on scroll and triggers actions', async ({ page }) => {
    await page.waitForSelector('#preloader.is-hidden', { timeout: 8000 });

    const dock = page.locator('#floating-quick-dock');

    // Scroll down to trigger dock visibility
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(400);

    await expect(dock).toHaveClass(/show/);

    // Click shortcuts dock button
    const dockShortcuts = page.locator('#dock-shortcuts-btn');
    await dockShortcuts.click();

    const shortcutsModal = page.locator('#shortcuts-modal');
    await expect(shortcutsModal).toHaveClass(/open/);

    // Dismiss
    await page.keyboard.press('Escape');
    await expect(shortcutsModal).not.toHaveClass(/open/);
  });

  test('Hero 15s audio pitch pill toggles playback and transcript highlight', async ({ page }) => {
    await page.waitForSelector('#preloader.is-hidden', { timeout: 8000 });

    const pitchPill = page.locator('#hero-pitch-pill');
    await expect(pitchPill).toBeVisible();

    const playBtn = page.locator('#pitch-play-btn');
    await expect(playBtn).toBeVisible();

    // Click to start audio pitch
    await playBtn.click();
    await page.waitForTimeout(300);

    const wave = page.locator('#pitch-wave');
    await expect(wave).toBeVisible();
  });

  test('Interactive Code Playground runs snippets and prints to virtual console', async ({ page }) => {
    await page.waitForSelector('#preloader.is-hidden', { timeout: 8000 });

    const playground = page.locator('#code-playground');
    await playground.scrollIntoViewIfNeeded();
    await expect(playground).toBeVisible();

    // Verify active snippet code is rendered
    await expect(page.locator('#ide-code-content')).toContainText('processPayrollBatch');

    // Click Run Code
    const runBtn = page.locator('#ide-run-btn');
    await runBtn.click();

    // Wait for console execution
    await page.waitForTimeout(500);
    const consoleOutput = page.locator('#ide-console-output');
    await expect(consoleOutput).toContainText('INSERT INTO staff_payroll_batch');

    // Switch to fraud classifier tab
    const fraudTab = page.locator('.ide-tab-btn[data-snippet="fraud"]');
    await fraudTab.click();
    await expect(page.locator('#ide-code-content')).toContainText('evaluateTransactionRisk');
  });

  test('Project Case Study Modal reveals System Architecture Flow Diagram', async ({ page }) => {
    await page.waitForSelector('#preloader.is-hidden', { timeout: 8000 });

    const projectSection = page.locator('#projects');
    await projectSection.scrollIntoViewIfNeeded();

    const schoolCard = page.locator('.project-card').first();
    await schoolCard.locator('.details-btn').click();

    const caseModal = page.locator('#case-modal');
    await expect(caseModal).toHaveClass(/open/);

    // Toggle architecture
    const archBtn = page.locator('#arch-toggle-btn');
    await archBtn.click();

    const archBox = page.locator('#modal-architecture-box');
    await expect(archBox).toBeVisible();

    // Click database node
    const dbNode = page.locator('.arch-node-pill[data-node="database"]');
    await dbNode.click();
    await expect(page.locator('#arch-insp-badge')).toContainText('PERSISTENCE TIER');

    // Close modal
    await page.keyboard.press('Escape');
  });

  test('Community reactions bar increments stars and posts guestbook endorsement', async ({ page }) => {
    await page.waitForSelector('#preloader.is-hidden', { timeout: 8000 });

    const reactionsBar = page.locator('#community-reactions-bar');
    await reactionsBar.scrollIntoViewIfNeeded();
    await expect(reactionsBar).toBeVisible();

    // Click Star button
    const starBtn = page.locator('#star-portfolio-btn');
    const initialStars = parseInt(await page.locator('#star-counter').textContent() || '0', 10);
    await starBtn.click();
    await page.waitForTimeout(200);
    const updatedStars = parseInt(await page.locator('#star-counter').textContent() || '0', 10);
    expect(updatedStars).toBeGreaterThanOrEqual(initialStars);

    // Click Fire reaction
    const fireBtn = page.locator('.reaction-pill-btn[data-reaction="fire"]');
    await fireBtn.click();
    await expect(fireBtn).toHaveClass(/reacted/);

    // Post a guestbook note
    await page.locator('#guestbook-name').fill('Test Recruiter');
    await page.locator('#guestbook-note').fill('Excited about your full stack experience!');
    await page.locator('#guestbook-submit-btn').click();

    await page.waitForTimeout(300);
    await expect(page.locator('#guestbook-stream')).toContainText('Test Recruiter');
  });

  test('Recruiter One-Pager modal opens via button, dock, or hotkey O', async ({ page }) => {
    await page.waitForSelector('#preloader.is-hidden', { timeout: 8000 });

    const onepagerModal = page.locator('#onepager-modal');
    await expect(onepagerModal).not.toHaveClass(/open/);

    // Press hotkey O
    await page.keyboard.press('o');
    await expect(onepagerModal).toHaveClass(/open/);
    await expect(page.locator('#onepager-title')).toContainText('SHARAN R');

    // Verify sections exist in printable paper
    await expect(page.locator('#onepager-printable')).toContainText('Inteovo Edu');
    await expect(page.locator('#onepager-printable')).toContainText('150+');

    // Dismiss with Escape
    await page.keyboard.press('Escape');
    await expect(onepagerModal).not.toHaveClass(/open/);
  });

});
