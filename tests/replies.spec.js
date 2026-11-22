import { test, expect } from '@playwright/test';

test('konuşma pratiği cevapları cihazda üretilir, /api/chat çağrılmaz', async ({ page }) => {
  const chatCalls = [];
  page.on('request', req => { if (req.url().includes('/api/chat')) chatCalls.push(req.url()); });
  await page.goto('/');
  await page.evaluate(() => { localStorage.clear(); localStorage.setItem('lms_lang', 'tr'); localStorage.setItem('lms_intro_seen', '1'); });
  await page.reload();
  await page.waitForFunction(() => window.ReplyEngine && window.ReplyData && window.ReportText);

  const out = await page.evaluate(() => {
    currentTherapyLevelKey = 'sentence';
    currentObj = THERAPY_CATEGORIES.daily_life.questions[2];
    const qid = currentQuestionId();
    const first = getLocalReply('acıktım');
    const second = getLocalReply('acıktım');
    getLocalReply('acıktım');
    const third = getLocalReply('acıktım');
    currentObj = THERAPY_CATEGORIES.emotions.questions[0];
    const sad = getLocalReply('biraz üzgünüm');
    const simple = window.ReplyEngine.simplify(window.ReplyData, currentQuestionId(), _lang);
    return { qid, first, second, third, sad, simple };
  });
  expect(out.qid).toBe('therapy_daily_life_q3');
  expect(out.first).toMatch(/Acıktım|Karnım aç/);
  expect(out.second).not.toBe(out.first);
  expect(out.third).toMatch(/sıradaki|yeni bir soru/);
  // FEEL_NEG iki cevaptan birini rastgele seçer
  expect(out.sad).toMatch(/Üzgün hissettiğini|söylediğin için teşekkürler/);
  expect(out.simple).toBe('Bugün nasılsın?');
  expect(chatCalls).toEqual([]);
});
