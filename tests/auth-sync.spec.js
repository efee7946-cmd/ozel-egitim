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

function mockDataRoutes(page, posts, { probe = { pref: null, hasData: false }, log } = {}) {
  const now = () => new Date().toISOString();
  return Promise.all([
    page.route('**/api/data*', route => {
      const req = route.request();
      if (log) log.push({ method: req.method(), url: req.url(), body: req.postData() || '' });
      if (req.method() === 'POST' && posts) posts.push(req.postDataJSON());
      const isProbe = req.method() === 'GET' && req.url().includes('probe=1');
      const body = isProbe ? probe : req.method() === 'GET' ? { value: null } : { ok: true, updatedAt: now() };
      route.fulfill({ contentType: 'application/json', body: JSON.stringify(body) });
    }),
    page.route('**/api/data/batch', route => {
      if (log) log.push({ method: 'BATCH', url: route.request().url(), body: route.request().postData() || '' });
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
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); localStorage.setItem('lms_lang', 'tr'); localStorage.setItem('lms_intro_seen', '1'); });
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

    // Adımlar sırayla: kayıt butonu son adıma kadar görünmez
    await expect(page.locator('#registerBtn')).toBeHidden();
    await page.click('#regNextBtn');
    await expect(page.locator('#authError')).toContainText('doldurun');

    await page.fill('#regEmail', 'test@example.com');
    await page.click('#regNextBtn');
    await expect(page.locator('#regStepCounter')).toHaveText('2 / 4');

    await page.fill('#regPassword', 'CokGizli1234');
    await page.fill('#regPassword2', 'BaskaSifre99');
    await page.click('#regNextBtn');
    await expect(page.locator('#authError')).toContainText('uyuşmuyor');

    await page.fill('#regPassword2', 'CokGizli1234');
    await page.click('#regNextBtn');
    await expect(page.locator('#regStepCounter')).toHaveText('3 / 4');

    await page.fill('#regUsername', 'testuser');
    await expect(page.locator('#registerBtn')).toBeVisible();

    // KVKK kutusu işaretlenmeden JS tarafındaki koruma isteği engeller
    await page.evaluate(() => document.getElementById('registerForm').requestSubmit());
    await expect(page.locator('#authError')).toContainText('kabul etmelisiniz');
    await expect(page.locator('#emailVerifyModal')).toBeHidden();
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

  test('giriş + öğrenci oluşturma: onay şartı, consentAt kaydı, bulut varsayılan kapalı', async ({ page }) => {
    const posts = [];
    const log = [];
    await mockAuthRoute(page, { username: 'demo' });
    await mockDataRoutes(page, posts, { log });
    await freshStart(page);

    await page.fill('#loginUsername', 'demo');
    await page.fill('#loginPassword', 'CokGizli1234');
    await page.evaluate(() => document.getElementById('loginForm').requestSubmit());
    await page.waitForSelector('#login-screen', { state: 'visible' });

    // Veli onayı işaretlenmeden öğrenci oluşturulamaz
    // Sağlık verisi ayrı, isteğe bağlı onayla açılır; varsayılan seçim yoktur
    await page.fill('#loginNameInput', 'Sync Çocuk');
    for (let i = 0; i < 2; i++) await page.click('#wizNextBtn');
    await expect(page.locator('input[name="loginLevel"]:checked')).toHaveCount(0);
    await expect(page.locator('input[name="loginLevel"][value="ogreti"]')).toBeDisabled();
    await page.check('#loginHealthConsent');
    await page.click('label.wiz-choice-card:has(input[value="ogreti"])');
    await page.click('#wizNextBtn');
    await page.click('label.wiz-cond-chip:has(input[value="osb"])');
    await page.click('#wizNextBtn');
    await page.click('#loginSaveBtn');
    await expect(page.locator('#loginProfileStatus')).toContainText('işaretleyin');

    await page.check('#loginVeliConsent');
    await page.click('#loginSaveBtn');
    await page.waitForSelector('#speechmap-screen', { state: 'visible', timeout: 8000 });

    // Hassas anahtar cihazda şifreli (ENC1:)
    const stored = await page.evaluate(() => localStorage.getItem('lms_students_demo'));
    expect(stored.startsWith('ENC1:')).toBe(true);

    // Bulut yedekleme açılmadıkça hiçbir öğrenci verisi sunucuya gitmez
    await page.waitForTimeout(1500);
    const sent = log.filter(r => r.method !== 'GET');
    expect(sent).toEqual([]);
    expect(await page.evaluate(() => window.DB.syncEnabled())).toBe(false);

    // Veli onayı tarih damgasıyla öğrenci kaydında saklanır
    const student = await page.evaluate(() => window.DB.getSync('students_demo')[0]);
    expect(student.name).toBe('Sync Çocuk');
    expect(Date.parse(student.consentAt)).toBeGreaterThan(0);
    expect(student.consentVersion).toBeTruthy();
    const bep = await page.evaluate(() => window.DB.getSync('bep_profile_demo'));
    expect(bep.category).toBe('ogreti');
    expect(bep.conditions).toEqual(['osb']);
    expect(Date.parse(bep.healthConsentAt)).toBeGreaterThan(0);
  });

  test('bulut yedekleme açıksa veri sunucuya yalnızca şifreli gider', async ({ page }) => {
    await mockAuthRoute(page, { username: 'demo' });
    await mockDataRoutes(page, [], { probe: { pref: 'on', hasData: true } });
    await freshStart(page);

    await page.fill('#loginUsername', 'demo');
    await page.fill('#loginPassword', 'CokGizli1234');
    await page.evaluate(() => document.getElementById('loginForm').requestSubmit());
    await page.waitForSelector('#login-screen', { state: 'visible' });

    const studentsPost = page.waitForRequest(req =>
      req.method() === 'POST' && req.url().endsWith('/api/data')
      && (req.postData() || '').includes('"key":"students_demo"'));
    await page.fill('#loginNameInput', 'Sync Çocuk');
    for (let i = 0; i < 3; i++) await page.click('#wizNextBtn');
    await page.check('#loginVeliConsent');
    await page.click('#loginSaveBtn');

    const wire = (await studentsPost).postDataJSON();
    expect(typeof wire.value).toBe('string');
    expect(wire.value.startsWith('ENC1:')).toBe(true);
    expect(wire.value).not.toContain('Sync Çocuk');
  });

  test('eski kullanıcı: tercih sorulur, "Sadece bu cihaz" buluttaki kopyayı siler', async ({ page }) => {
    const log = [];
    await mockAuthRoute(page, { username: 'demo' });
    await mockDataRoutes(page, [], { probe: { pref: null, hasData: true }, log });
    await freshStart(page);

    await page.fill('#loginUsername', 'demo');
    await page.fill('#loginPassword', 'CokGizli1234');
    await page.evaluate(() => document.getElementById('loginForm').requestSubmit());

    await expect(page.locator('#confirmModalTitle')).toHaveText('Verileriniz nerede dursun?', { timeout: 8000 });
    await expect(page.locator('#confirmBtnCancel')).toHaveText('Sadece bu cihaz');
    const purge = page.waitForRequest(req => req.method() === 'DELETE' && req.url().includes('all=1'));
    const prefPost = page.waitForRequest(req =>
      req.method() === 'POST' && (req.postData() || '').includes('"key":"sync_pref"')
      && (req.postData() || '').includes('"off"'));
    await page.click('#confirmBtnCancel');
    await purge;
    await prefPost;
    expect(await page.evaluate(() => window.DB.syncEnabled())).toBe(false);
    expect(await page.evaluate(() => localStorage.getItem('lms__syncpref:demo'))).toBe('off');
  });

  test('ayarlar: bulut yedekleme onayla açılır, yedek dosyası geri yüklenir', async ({ page }) => {
    await mockAuthRoute(page, { username: 'demo' });
    await mockDataRoutes(page, []);
    await freshStart(page);

    await page.fill('#loginUsername', 'demo');
    await page.fill('#loginPassword', 'CokGizli1234');
    await page.evaluate(() => document.getElementById('loginForm').requestSubmit());
    await page.waitForSelector('#login-screen', { state: 'visible' });
    await page.fill('#loginNameInput', 'Yedek Çocuk');
    for (let i = 0; i < 3; i++) await page.click('#wizNextBtn');
    await page.check('#loginVeliConsent');
    await page.click('#loginSaveBtn');
    await page.waitForSelector('#speechmap-screen', { state: 'visible', timeout: 8000 });

    await page.evaluate(() => { toggleA11yPanel(); updateA11yAccountSection(); });
    const toggle = page.locator('#a11yCloudSync');
    await expect(toggle).not.toBeChecked();

    // Vazgeçilirse kapalı kalır
    await page.evaluate(() => { const el = document.getElementById('a11yCloudSync'); el.checked = true; toggleCloudSync(el); });
    await expect(page.locator('#confirmModalTitle')).toHaveText('Bulut yedekleme açılsın mı?');
    await page.click('#confirmBtnCancel');
    await expect(toggle).not.toBeChecked();

    // Onaylanırsa açılır ve tercih sunucuya yazılır
    const prefPost = page.waitForRequest(req =>
      req.method() === 'POST' && (req.postData() || '').includes('"key":"sync_pref"'));
    await page.evaluate(() => { const el = document.getElementById('a11yCloudSync'); el.checked = true; toggleCloudSync(el); });
    await page.click('#confirmBtnOk');
    expect((await prefPost).postDataJSON().value).toBe('on');
    await expect(toggle).toBeChecked();

    // Yedekten geri yükleme
    const backup = {
      kullanici: { username: 'demo' },
      lms_students_demo: [{ id: 'st_1', name: 'Geri Gelen', emoji: '🦊', createdAt: '2026-01-01T00:00:00Z', consentAt: '2026-01-01T00:00:00Z' }],
      lms_auth_token: 'kotu',
    };
    await page.setInputFiles('#a11yImportFile', { name: 'yedek.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(backup)) });
    await page.click('#confirmBtnOk');
    await expect.poll(() => page.evaluate(() => (window.DB.getSync('students_demo') || [])[0]?.name)).toBe('Geri Gelen');
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('lms_auth_token')))).not.toBe('kotu');
    await expect(page.locator('#appToast')).toContainText('Yedek yüklendi');

    const wrong = { kullanici: { username: 'baskasi' }, lms_students_baskasi: [] };
    await page.setInputFiles('#a11yImportFile', { name: 'y2.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(wrong)) });
    await expect(page.locator('#appToast')).toContainText('başka bir hesaba', { timeout: 4000 });
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

    // Sağlık onayı verilmezse tanı adımı atlanır ve sağlık verisi kaydedilmez
    await page.fill('#loginNameInput', 'Offline Çocuk');
    for (let i = 0; i < 3; i++) await page.click('#wizNextBtn');
    await expect(page.locator('#wizStepCounter')).toHaveText('5 / 5');
    await page.check('#loginVeliConsent');
    await page.click('#loginSaveBtn');

    // Bulut kapalı olsa da ilk pratik akışı açılır ve veri cihazda durur
    await page.waitForSelector('#speechmap-screen', { state: 'visible', timeout: 8000 });
    const bep = await page.evaluate(() => window.DB.getSync('bep_profile_demo'));
    expect(bep).toEqual({ category: null, conditions: [] });
    const stored = await page.evaluate(() => localStorage.getItem('lms_students_demo'));
    expect(stored.startsWith('ENC1:')).toBe(true);
    const student = await page.evaluate(() => window.DB.getSync('students_demo')[0]);
    expect(student.name).toBe('Offline Çocuk');
  });
});
