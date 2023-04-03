// Part: playwright.config.ts
// Code Reference: https://github.com/microsoft/playwright
// Documentation: https://playwright.dev/docs/test-configuration

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/playwright',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'html' : 'line',
  use: {
    baseURL: 'http://127.0.0.1:4173',
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
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
  },
  expect: {
    toMatchSnapshot: async (actual, options = {}) => {
      // Check if options.snapshotSuffix is defined, if not, set it to an empty string
      if (!options.snapshotSuffix) {
        options.snapshotSuffix = '';
      }

      // Remove the OS part from the snapshot suffix
      options.snapshotSuffix = options.snapshotSuffix.replace(
        /-darwin|-linux|-windows/,
        ''
      );

      // Call the original toMatchSnapshot function with the modified options
      return await expect._toMatchSnapshot(actual, options);
    },
  },
});
