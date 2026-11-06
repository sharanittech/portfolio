const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright Configuration for Sharan R's Portfolio
 * Validates animations, responsive layouts (375px, 768px, 1440px),
 * global interactions, modal expansions, and reduced-motion fallbacks.
 */
module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],
  use: {
    baseURL: 'http://localhost:8000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // 1. Desktop 1440px
    {
      name: 'Desktop-Chrome-1440',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 }
      },
    },
    {
      name: 'Desktop-Firefox-1440',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1440, height: 900 }
      },
    },
    {
      name: 'Desktop-Safari-1440',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1440, height: 900 }
      },
    },

    // 2. Tablet 768px
    {
      name: 'Tablet-768',
      use: {
        ...devices['iPad Mini'],
        viewport: { width: 768, height: 1024 }
      },
    },

    // 3. Mobile 375px
    {
      name: 'Mobile-Chrome-375',
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 375, height: 667 }
      },
    },
    {
      name: 'Mobile-Safari-375',
      use: {
        ...devices['iPhone SE'],
        viewport: { width: 375, height: 667 }
      },
    },

    // 4. Accessibility: Reduced Motion
    {
      name: 'Reduced-Motion',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        contextOptions: {
          reducedMotion: 'reduce'
        }
      },
    }
  ],

  // Run local web server automatically before tests
  webServer: {
    command: 'python -m http.server 8000',
    port: 8000,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
