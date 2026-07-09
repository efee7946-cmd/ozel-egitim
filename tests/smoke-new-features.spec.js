import { test, expect } from '@playwright/test';

function solveGate(question) {
  const m = question.match(/(\d+)\s*\+\s*(\d+)/);
  return Number(m[1]) + Number(m[2]);
}

test.describe('Veli kapısı, ilk kullanım akışı ve rapor kartları', () => {
  test('misafir akışı: ilk öğrenci → doğrudan pratik, kapılı analiz girişi', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => { localStorage.clear(); localStorage.setItem('lms_lang', 'tr'); });
    await page.reload();

    await page.evaluate(() => window.continueAsGuest());
    await page.waitForSelector('#login-screen', { state: 'visible' });

    await page.fill('#loginNameInput', 'Deneme Çocuk');
    const consent = page.locator('#loginVeliConsent');
    if (await consent.count()) await consent.check();
    await page.click('#loginSaveBtn');

    // P2: ilk öğrenci sonrası menü yerine doğrudan konuşma pratiği açılmalı
    await page.waitForSelector('#topicOverlay', { state: 'visible', timeout: 8000 });

    // Menüye dön — tüm karolar tek menüde görünür olmalı
    await page.evaluate(() => window.goToMenu());
    await page.waitForSelector('#menu-screen', { state: 'visible' });
    const obSkip = page.locator('#onboardingModal .onboarding-skip');
    if (await obSkip.isVisible().catch(() => false)) await obSkip.click();
    await expect(page.locator('.tile-analysis')).toBeVisible();

    // Analiz girişi veli kapısıyla korunur: önce yanlış cevap
    await page.click('.tile-analysis');
    await page.waitForSelector('#parentGateModal', { state: 'visible' });
    const question = await page.locator('#parentGateQuestion').textContent();
    expect(question).toMatch(/\d+\s*\+\s*\d+/);
    await page.fill('#parentGateInput', '1');
    await page.click('#parentGateModal .recovery-close-btn');
    await expect(page.locator('#parentGateError')).toContainText('doğru değil');

    // Doğru cevapla analiz ekranı açılır
    await page.fill('#parentGateInput', String(solveGate(question)));
    await page.click('#parentGateModal .recovery-close-btn');
    await expect(page.locator('#parentGateModal')).toBeHidden();
    await page.waitForSelector('#analysis-screen', { state: 'visible' });

    // Veli Özeti sekmesi: haftalık kart (boş durum) ve rutin kartı orada
    await page.click('#repTabParent');
    await expect(page.locator('#weeklySummaryCard')).toBeVisible();
    await expect(page.locator('#weeklySummaryCard')).toContainText('Bu hafta henüz pratik yapılmadı');
    await expect(page.locator('#routineCard')).toBeVisible();
    await expect(page.locator('#routineToggleBtn')).toBeDisabled();
    await expect(page.locator('#routineStatus')).toContainText('mobil uygulamada');

    // Kilit açıkken analize tekrar giriş kapısız olmalı
    await page.evaluate(() => window.goToMenu());
    await page.waitForSelector('#menu-screen', { state: 'visible' });
    await page.click('.tile-analysis');
    await expect(page.locator('#parentGateModal')).toBeHidden();
    await page.waitForSelector('#analysis-screen', { state: 'visible' });
  });
});
