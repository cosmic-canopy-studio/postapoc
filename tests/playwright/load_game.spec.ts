import { expect, test } from '@playwright/test';

test.describe('When the game loads', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4173');
  });

  test('the canvas loads and matches the screenshot', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('canvas');
    await expect(page).toHaveScreenshot('titleScreen.png');
    await page.screenshot({
      path: '.reports/playwright-screenshots/titleScreen.png',
    });
  });
});
