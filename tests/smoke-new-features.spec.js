import { test, expect } from '@playwright/test';

const TR_WORDS = { bir: 1, iki: 2, 'üç': 3, 'dört': 4, 'beş': 5, 'altı': 6, yedi: 7, sekiz: 8, dokuz: 9, on: 10, yirmi: 20, otuz: 30, 'kırk': 40 };

function solveGate(question) {
  const parts = question.replace('kaç eder?', '').split('artı');
  const parse = s => s.trim().split(/\s+/).reduce((sum, w) => sum + (TR_WORDS[w] || 0), 0);
  return parse(parts[0]) + parse(parts[1]);
}

test.describe('Çocuk/Veli modu, veli kapısı ve ilk kullanım akışı', () => {
  test('misafir akışı: ilk öğrenci → doğrudan pratik, mod geçişleri ve kapı', async ({ page }) => {
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

    // Menüye dön — varsayılan veli modu: veli bölümü görünür olmalı
    await page.evaluate(() => window.goToMenu());
    await page.waitForSelector('#menu-screen', { state: 'visible' });
    const obSkip = page.locator('#onboardingModal .onboarding-skip');
    if (await obSkip.isVisible().catch(() => false)) await obSkip.click();
    await expect(page.locator('.menu-section-label')).toBeVisible();
    await expect(page.locator('#weeklySummaryCard')).toBeVisible();
    await expect(page.locator('.tile-iep')).toBeVisible();
    await expect(page.locator('#routineCard')).toBeVisible();

    // Haftalık kart: veri yokken boş durum + başlat butonu
    await expect(page.locator('#weeklySummaryCard')).toContainText('Bu hafta henüz pratik yapılmadı');

    // Rutin kartı webde devre dışı olmalı
    await expect(page.locator('#routineToggleBtn')).toBeDisabled();
    await expect(page.locator('#routineStatus')).toContainText('mobil uygulamada');

    // Çocuk moduna geç: veli bölümü kaybolmalı
    await page.click('#modeToggleBtn');
    await expect(page.locator('.menu-section-label')).toBeHidden();
    await expect(page.locator('#weeklySummaryCard')).toBeHidden();
    await expect(page.locator('#bnAnalysis')).toBeHidden();
    await expect(page.locator('#topbarStudentPill')).toBeHidden();

    // Veli moduna dönüş kapıdan geçer: önce yanlış cevap
    await page.click('#modeToggleBtn');
    await page.waitForSelector('#parentGateModal', { state: 'visible' });
    const question = await page.locator('#parentGateQuestion').textContent();
    await page.fill('#parentGateInput', '1');
    await page.click('#parentGateModal .recovery-close-btn');
    await expect(page.locator('#parentGateError')).toContainText('doğru değil');

    // Doğru cevapla geç
    await page.fill('#parentGateInput', String(solveGate(question)));
    await page.click('#parentGateModal .recovery-close-btn');
    await expect(page.locator('#parentGateModal')).toBeHidden();
    await expect(page.locator('.menu-section-label')).toBeVisible();

    // Mod tercihi kalıcı olmalı
    const mode = await page.evaluate(() => localStorage.getItem('lms_ui_mode'));
    expect(mode).toBe('parent');
  });
});
