import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/playwright',
  fullyParallel: true,
  snapshotPathTemplate:
    'tests/playwright/screenshots/{testFilePath}/{arg}{ext}',
  expect: {
    toMatchSnapshot: {
      maxDiffPixelRatio: 0.1,
    },
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.1,
    },
  },
  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4173/postapoc/',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    /*    {
          name: "firefox",
          use: { ...devices["Desktop Firefox"] }
        },

        {
          name: "webkit",
          use: { ...devices["Desktop Safari"] }
        }*/

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ..devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
  webServer: {
    command: 'yarn serve',
    port: 4173,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
});
