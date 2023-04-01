import { expect, test } from '@playwright/test';

test.describe('End-to-end tests for based game loading and entry', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4173');
  });

  test('canvas loads', async ({ page }) => {
    await page.waitForSelector('canvas');
    await expect(page).toHaveScreenshot();
  });
});
