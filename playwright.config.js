import { defineConfig, devices } from '@playwright/test'

const BASE = 'http://127.0.0.1:4173'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list']],
  timeout: 30_000,
  expect: { timeout: 7_000 },

  use: {
    baseURL: BASE,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },

  webServer: {
    command: 'node scripts/serve.mjs',
    url: BASE,
    reuseExistingServer: !process.env.CI,
    timeout: 20_000
  },

  projects: [
    {
      name: 'tv-1080p',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1920, height: 1080 } }
    },
    {
      name: 'tv-4k',
      use: { ...devices['Desktop Chrome'], viewport: { width: 3840, height: 2160 }, deviceScaleFactor: 1 }
    },
    {
      name: 'touch',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        hasTouch: true,
        isMobile: false
      }
    }
  ]
})
