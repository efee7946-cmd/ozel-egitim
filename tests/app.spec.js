import { test, expect } from '@playwright/test';

test.describe('Yıldız Can AI App Tests', () => {

  test('should load the app and show auth screen', async ({ page }, testInfo) => {
    await page.goto('/');

    // Check if the title is correct
    await expect(page).toHaveTitle(/YildizCan|Yıldız/);

    // App should show auth or splash screen on load
    await page.waitForTimeout(2000);
    const authScreen = page.locator('#auth-screen, #login-screen');
    await expect(authScreen.first()).toBeVisible();

    await page.screenshot({ path: testInfo.outputPath('initial-screen.png') });
  });

  test('should read students from legacy storage key for the active user', async ({ page }) => {
    await page.goto('/');

    await page.evaluate(() => {
      localStorage.removeItem('lms_students_demo');
      localStorage.setItem('lms_teacher_students_demo', JSON.stringify([
        { id: 'st_legacy', name: 'Ali', emoji: '🌟', createdAt: '2024-01-01T00:00:00.000Z' }
      ]));
      window._authUser = { username: 'demo', displayName: 'Demo' };
    });

    const students = await page.evaluate(async () => window.loadStudents());

    expect(students).toHaveLength(1);
    expect(students[0].name).toBe('Ali');
  });
});
