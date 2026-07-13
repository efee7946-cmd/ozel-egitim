import { test, expect } from '@playwright/test';

const DATA_KEY = 'a'.repeat(64);

function mockAuthRoute(page, { username, onRegister } = {}) {
  return page.route('**/api/auth', async route => {
    const body = route.request().postDataJSON() || {};
    const respond = json => route.fulfill({ contentType: 'application/json', body: JSON.stringify(json) });

    if (body.action === 'register') {
      if (onRegister) onRegister(body);
      return respond({
        ok: true, token: 'tok_reg_1', displayName: body.username,
        dataKey: DATA_KEY, emailMasked: 't***@e***.com', emailVerificationPending: true,
      });
    }
    if (body.action === 'login') {
      return respond({
        ok: true, token: 'tok_login_1', displayName: username || body.username,
        email: 'test@example.com', emailVerified: true, hasEmail: true, dataKey: DATA_KEY,
      });
    }
    if (body.action === 'verify_email') {
      return respond(body.code === '123456' ? { ok: true } : { error: 'AUTH_VERIFY_CODE_INVALID' });
    }
    return respond({ ok: true });
  });
}

function mockDataRoutes(page, posts) {
  const now = () => new Date().toISOString();
  return Promise.all([
    page.route('**/api/data*', route => {
      const req = route.request();
      if (req.method() === 'POST' && posts) posts.push(req.postDataJSON());
      const body = req.method() === 'GET' ? { value: null } : { ok: true, updatedAt: now() };
      route.fulfill({ contentType: 'application/json', body: JSON.stringify(body) });
    }),
    page.route('**/api/data/batch', route => {
      const body = route.request().postDataJSON() || {};
      const result = Array.isArray(body.items)
        ? body.items.map(i => ({ key: i.key, updatedAt: now() }))
        : [];
      route.fulfill({ contentType: 'application/json', body: JSON.stringify(result) });
    }),
    page.route('**/api/log', route =>
      route.fulfill({ contentType: 'application/json', body: '{"ok":true}' })),
  ]);
}

async function freshStart(page) {
  await page.goto('/');
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); localStorage.setItem('lms_lang', 'tr'); });
  await page.reload();
  await page.waitForSelector('#auth-screen', { state: 'visible' });
}

test.describe('Kayıt, giriş ve veri eşitleme akışları', () => {

  test('kayıt: KVKK onayı istekle gider, e-posta doğrulama zorunlu, doğru kod içeri alır', async ({ page }) => {
    let registerBody = null;
    await mockAuthRoute(page, { onRegister: b => { registerBody = b; } });
    await mockDataRoutes(page);
    await freshStart(page);

    await page.evaluate(() => window.switchAuthTab('register'));
    await expect(page.locator('#registerForm')).toBeVisible();
    await page.fill('#regUsername', 'testuser');
    await page.fill('#regPassword', 'CokGizli1234');
    await page.fill('#regPassword2', 'CokGizli1234');
    await page.fill('#regEmail', 'test@example.com');

    // KVKK kutusu işaretlenmeden: tarayıcı doğrulaması submit'i durdurur
    await page.evaluate(() => document.getElementById('registerForm').requestSubmit());
    await page.waitForTimeout(300);
    await expect(page.locator('#emailVerifyModal')).toBeHidden();
    expect(registerBody).toBeNull();

    // Tarayıcı doğrulaması atlansa bile JS tarafındaki koruma isteği engeller
    await page.evaluate(() =>
      document.getElementById('registerForm').dispatchEvent(new Event('submit', { cancelable: true })));
    await expect(page.locator('#authError')).toContainText('kabul etmelisiniz');
    expect(registerBody).toBeNull();

    await page.check('#kvkkConsent');
    await page.evaluate(() => document.getElementById('registerForm').requestSubmit());

    // Doğrulama modalı zorunlu olarak açılır, kayıt isteği onay damgasını taşır
    await page.waitForSelector('#emailVerifyModal', { state: 'visible' });
    expect(registerBody.kvkkAccepted).toBe(true);
    expect(registerBody.username).toBe('testuser');
    await expect(page.locator('#verifyLaterBtn')).toBeHidden();

    // Yanlış kod içeri almaz
    await page.fill('#verifyCodeInput', '000000');
    await page.click('#emailVerifyModal .recovery-close-btn');
    await expect(page.locator('#emailVerifyModal')).toBeVisible();

    // Doğru kod: modal kapanır, öğrenci oluşturma ekranına düşer
    await page.fill('#verifyCodeInput', '123456');
    await page.click('#emailVerifyModal .recovery-close-btn');
    await page.waitForSelector('#login-screen', { state: 'visible' });

    const token = await page.evaluate(() => JSON.parse(localStorage.getItem('lms_auth_token')));
    expect(token).toBe('tok_reg_1');
  });

  test('giriş + öğrenci oluşturma: onay şartı, consentAt kaydı ve şifreli senkron', async ({ page }) => {
    const posts = [];
    await mockAuthRoute(page, { username: 'demo' });
    await mockDataRoutes(page, posts);
    await freshStart(page);

    await page.fill('#loginUsername', 'demo');
    await page.fill('#loginPassword', 'CokGizli1234');
    await page.evaluate(() => document.getElementById('loginForm').requestSubmit());
    await page.waitForSelector('#login-screen', { state: 'visible' });

    // Veli onayı işaretlenmeden öğrenci oluşturulamaz
    await page.fill('#loginNameInput', 'Sync Çocuk');
    await page.click('#loginSaveBtn');
    await expect(page.locator('#loginProfileStatus')).toContainText('onaylayın');

    const studentsPost = page.waitForRequest(req =>
      req.method() === 'POST' && req.url().endsWith('/api/data')
      && (req.postData() || '').includes('"key":"students_demo"'));
    await page.check('#loginVeliConsent');
    await page.click('#loginSaveBtn');
    await page.waitForSelector('#speechmap-screen', { state: 'visible', timeout: 8000 });

    // Hassas anahtar cihazda ve ağda şifreli (ENC1:), sunucu düz metin görmez
    const stored = await page.evaluate(() => localStorage.getItem('lms_students_demo'));
    expect(stored.startsWith('ENC1:')).toBe(true);
    const wire = (await studentsPost).postDataJSON();
    expect(typeof wire.value).toBe('string');
    expect(wire.value.startsWith('ENC1:')).toBe(true);
    expect(wire.value).not.toContain('Sync Çocuk');

    // Veli onayı tarih damgasıyla öğrenci kaydında saklanır
    const student = await page.evaluate(() => window.DB.getSync('students_demo')[0]);
    expect(student.name).toBe('Sync Çocuk');
    expect(Date.parse(student.consentAt)).toBeGreaterThan(0);
  });

  test('çevrimdışı-önce: /api/data ulaşılamazken yazma yerelde tamamlanır, akış kırılmaz', async ({ page }) => {
    await mockAuthRoute(page, { username: 'demo' });
    await page.route('**/api/data*', route => route.abort());
    await page.route('**/api/data/batch', route => route.abort());
    await page.route('**/api/log', route => route.abort());
    await freshStart(page);

    await page.fill('#loginUsername', 'demo');
    await page.fill('#loginPassword', 'CokGizli1234');
    await page.evaluate(() => document.getElementById('loginForm').requestSubmit());
    await page.waitForSelector('#login-screen', { state: 'visible' });

    await page.fill('#loginNameInput', 'Offline Çocuk');
    await page.check('#loginVeliConsent');
    await page.click('#loginSaveBtn');

    // Bulut kapalı olsa da ilk pratik akışı açılır ve veri cihazda durur
    await page.waitForSelector('#speechmap-screen', { state: 'visible', timeout: 8000 });
    const stored = await page.evaluate(() => localStorage.getItem('lms_students_demo'));
    expect(stored.startsWith('ENC1:')).toBe(true);
    const student = await page.evaluate(() => window.DB.getSync('students_demo')[0]);
    expect(student.name).toBe('Offline Çocuk');
  });
});
