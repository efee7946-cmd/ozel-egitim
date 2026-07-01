import { test, expect } from '@playwright/test';

test.describe('Yıldız Can AI App Tests', () => {

  test('should load the app and show auth screen', async ({ page }, testInfo) => {
    await page.goto('/');

    // Check if the title is correct
    await expect(page).toHaveTitle(/YildizCan|Yıldız/);

    // App should show auth or splash screen on load
    await page.waitForTimeout(2000);
    const authScreen = page.locator('#auth-screen, #splash-screen, #login-screen');
    await expect(authScreen.first()).toBeVisible();

    await page.screenshot({ path: testInfo.outputPath('initial-screen.png') });
  });
});
