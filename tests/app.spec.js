import { test, expect } from '@playwright/test';

test.describe('Yıldız Can AI App Tests', () => {

  test('should load the app and allow guest navigation directly to the menu', async ({ page }, testInfo) => {
    await page.goto('/');

    // Check if the title is correct
    await expect(page).toHaveTitle(/YildizCan|Yıldız/);

    // The app now skips auth and shows the main menu directly
    const menuScreen = page.locator('#menu-screen');
    await expect(menuScreen).toBeVisible();

    // Take a screenshot of the menu screen
    await page.screenshot({ path: testInfo.outputPath('menu-screen.png') });

    // Test that the app start works and greeting updates correctly
    await page.evaluate(() => {
        childName = "Test Çocuğu";
        currentUserEmail = "test@example.com";
        window.startApp(true);
    });

    const greeting = page.locator('#menu-greeting');
    await expect(greeting).toContainText('Test Çocuğu');

    // Test Navigation to Therapy
    await page.evaluate(() => {
        window.goToTherapy();
    });

    const gameContainer = page.locator('#game-container');
    await expect(gameContainer).toBeVisible();
    await page.evaluate(() => {
        window.startFocusedCityLocation();
    });
    await expect(page.locator('#qBar')).not.toHaveText('Hazırlanıyorum...');
    await expect(page.locator('#chat-bubbles .ai-bubble').first()).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath('therapy-screen.png') });

    // Go back to menu
    await page.evaluate(() => {
        window.goToMenu();
    });

    // Test Navigation to Report
    await page.evaluate(() => {
        window.goToReport();
    });

    const reportScreen = page.locator('#report-screen');
    await expect(reportScreen).toBeVisible();
    await expect(page.locator('.report-header')).toBeVisible();
    await expect(page.locator('#statDuration')).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath('report-screen.png') });

  });
});
