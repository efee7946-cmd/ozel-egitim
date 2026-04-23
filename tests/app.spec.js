const { test, expect } = require('@playwright/test');

test.describe('Yıldız Can AI App Tests', () => {

  test('should load the start screen and allow guest login simulation', async ({ page }, testInfo) => {
    await page.goto('/');

    // Check if the title is correct
    await expect(page).toHaveTitle(/Yıldız Sınıfı/);

    // Check if the auth container is visible
    const authContainer = page.locator('#start-screen');
    await expect(authContainer).toBeVisible();

    // Verify main title on start screen
    const mainTitle = page.locator('#auth-main-title');
    await expect(mainTitle).toHaveText('Hoş Geldin!');

    // Take a screenshot of the start screen
    await page.screenshot({ path: testInfo.outputPath('start-screen.png') });

    // Test that the app start works despite global variable scope issues by letting UI buttons do the work if we can,
    // or by overriding variables correctly inside the evaluate function.
    await page.evaluate(() => {
        childName = "Test Çocuğu";
        currentUserEmail = "test@example.com";
        window.startApp(true);
    });

    // Wait for the menu screen to be visible
    const menuScreen = page.locator('#menu-screen');
    await expect(menuScreen).toBeVisible();

    // Take a screenshot of the menu screen
    await page.screenshot({ path: testInfo.outputPath('menu-screen.png') });

    // Verify greeting contains "Test Çocuğu"
    const greeting = page.locator('#menu-greeting');
    await expect(greeting).toContainText('Test Çocuğu');

    // Test Navigation to Therapy
    await page.evaluate(() => {
        window.goToTherapy();
    });

    const gameContainer = page.locator('#game-container');
    await expect(gameContainer).toBeVisible();
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
