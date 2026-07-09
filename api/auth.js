// Kullanıcı kimlik doğrulama — Aiven PostgreSQL üzerinde çalışır.
// bcrypt ile şifre hash'i, 32-byte random session token'ı.
// Şifre sıfırlama ve e-posta doğrulama: Gmail SMTP ile 6 haneli kod.
// DATABASE_URL env var'ı gereklidir.

import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { query } from './_db.js';
import { hashToken, resolveToken } from './_auth.js';
import { sendMail, resetCodeEmailHtml, verifyCodeEmailHtml } from './_mail.js';
import { checkRateLimit } from './_rateLimit.js';
import { isPasswordPwned } from './_pwned.js';

const SESSION_DAYS = 14;
const BCRYPT_ROUNDS = 12;

function cors(res) {
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Vercel gercek istemci IP'sini x-forwarded-for'un ilk degerinde verir
function getClientIp(req) {
    const fwd = req.headers['x-forwarded-for'];
    if (fwd) return String(fwd).split(',')[0].trim();
    return req.socket?.remoteAddress || 'unknown';
}

// Legacy SHA-256 — kullanıcı geçişi sırasında kontrol için korunuyor
function _legacyHash(password, salt) {
    const pepper = process.env.AUTH_PEPPER || 'yz2026';
    return crypto.createHash('sha256')
        .update(salt + ':' + password + ':' + pepper)
        .digest('hex');
}

function expiresAt() {
    return new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
}

async function sessionRows(token) {
    const stored = await resolveToken(token);
    if (!stored) return [];
    return query('SELECT username FROM sessions WHERE token = $1 AND expires_at > now()', [stored]);
}

let _columnsEnsured = false;
async function ensureAuthColumns() {
    if (_columnsEnsured) return;
    await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT');
    await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false');
    await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS data_key TEXT');
    await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_hash TEXT');
    await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_expires TIMESTAMPTZ');
    await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_attempts INT DEFAULT 0');
    await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS verify_hash TEXT');
    await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS verify_expires TIMESTAMPTZ');
    await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS verify_attempts INT DEFAULT 0');
    await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS failed_logins INT DEFAULT 0');
    await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS lock_until TIMESTAMPTZ');
    _columnsEnsured = true;
}

function isValidEmail(e) {
    return typeof e === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) && e.length <= 200;
}

function maskEmail(e) {
    const [local, domain] = e.split('@');
    return local[0] + '***@' + domain[0] + '***' + domain.slice(domain.lastIndexOf('.'));
}

function genericResetResponse() {
    return {
        ok: true,
        emailMasked: null,
        generic: true
    };
}

// Kullanıcı adı VEYA e-posta ile kullanıcı bul
async function findUserByIdentifier(identifier) {
    const id = String(identifier || '').trim().toLowerCase();
    if (!id) return null;
    const rows = id.includes('@')
        ? await query('SELECT * FROM users WHERE email = $1', [id])
        : await query('SELECT * FROM users WHERE username = $1', [id]);
    return rows[0] || null;
}

async function emailInUse(userEmail, exceptUsername) {
    const rows = await query('SELECT username FROM users WHERE email = $1', [userEmail]);
    return rows.some(r => r.username !== exceptUsername);
}

function generateSixDigitCode() {
    return String(crypto.randomInt(100000, 1000000));
}

// data_key sütunu DATA_KEY_SECRET'tan türetilen anahtarla AES-GCM ile
// şifrelenir (dk1: öneki). Böylece tek başına DB sızıntısı app_data'daki
// şifreli verileri çözmeye yetmez; env var yoksa eski (düz metin) davranışa
// düşülür. Bu uçtan uca şifreleme değildir — sunucu çalışırken anahtarı görür.
const DK_PREFIX = 'dk1:';
let _kekWarned = false;

function dataKeyKek() {
    const secret = process.env.DATA_KEY_SECRET;
    if (!secret) {
        if (!_kekWarned) {
            _kekWarned = true;
            console.warn('UYARI: DATA_KEY_SECRET tanımlı değil — users.data_key düz metin saklanıyor. Güçlü bir rastgele değer üretip Vercel\'e eklemen önerilir.');
        }
        return null;
    }
    return crypto.createHash('sha256').update(secret).digest();
}

function encryptDataKey(plain) {
    const kek = dataKeyKek();
    if (!kek) return plain;
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', kek, iv);
    const ct = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
    return DK_PREFIX + Buffer.concat([iv, ct, cipher.getAuthTag()]).toString('base64');
}

function decryptDataKey(stored) {
    if (!stored || !stored.startsWith(DK_PREFIX)) return stored;
    const kek = dataKeyKek();
    if (!kek) throw new Error('data_key şifreli ama DATA_KEY_SECRET tanımlı değil');
    const buf = Buffer.from(stored.slice(DK_PREFIX.length), 'base64');
    const iv = buf.subarray(0, 12);
    const tag = buf.subarray(buf.length - 16);
    const ct = buf.subarray(12, buf.length - 16);
    const decipher = crypto.createDecipheriv('aes-256-gcm', kek, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(ct), decipher.final()]).toString('utf8');
}

async function unwrapDataKey(username, stored) {
    if (!stored) {
        const dataKey = crypto.randomBytes(32).toString('hex');
        await query('UPDATE users SET data_key = $1 WHERE username = $2', [encryptDataKey(dataKey), username]);
        return dataKey;
    }
    const plain = decryptDataKey(stored);
    if (plain === stored && dataKeyKek()) {
        await query('UPDATE users SET data_key = $1 WHERE username = $2', [encryptDataKey(plain), username]);
    }
    return plain;
}

async function ensureDataKey(username) {
    const rows = await query('SELECT data_key FROM users WHERE username = $1', [username]);
    return unwrapDataKey(username, rows[0]?.data_key);
}

// Doğrulama kodu üretir, kaydeder ve e-postayla gönderir (best-effort)
async function sendVerificationCode(username, userEmail) {
    const code = generateSixDigitCode();
    const codeHash = await bcrypt.hash(code, 8);
    await query(
        `UPDATE users SET verify_hash = $1, verify_expires = now() + interval '15 minutes', verify_attempts = 0 WHERE username = $2`,
        [codeHash, username]
    );
    await sendMail(userEmail, 'YıldızCan e-posta doğrulama kodu', verifyCodeEmailHtml(code));
}

export default async function handler(req, res) {
    cors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST gerekli' });

    const { action, username, password, token, email, identifier } = req.body || {};

    try {
        /* ---- KAYIT OL ---- */
        if (action === 'register') {
            if (!(await checkRateLimit('register_ip:' + getClientIp(req), 5)))
                return res.status(429).json({ error: 'AUTH_RATE_LIMITED' });
            if (!username || !password)
                return res.status(400).json({ error: 'AUTH_FIELDS_REQUIRED' });
            const u = username.trim().toLowerCase();
            if (u.length < 3)
                return res.status(400).json({ error: 'AUTH_USERNAME_TOO_SHORT' });
            if (password.length < 8)
                return res.status(400).json({ error: 'AUTH_PASSWORD_TOO_SHORT' });
            if (!/^[a-z0-9_]+$/.test(u))
                return res.status(400).json({ error: 'AUTH_USERNAME_INVALID_CHARS' });
            if (await isPasswordPwned(password))
                return res.status(400).json({ error: 'AUTH_PASSWORD_PWNED' });

            const existing = await query('SELECT username FROM users WHERE username = $1', [u]);
            if (existing.length > 0)
                return res.status(409).json({ error: 'AUTH_USERNAME_TAKEN' });

            await ensureAuthColumns();
            const userEmail = email && String(email).trim().toLowerCase();
            if (!userEmail)
                return res.status(400).json({ error: 'AUTH_EMAIL_REQUIRED' });
            if (!isValidEmail(userEmail))
                return res.status(400).json({ error: 'AUTH_EMAIL_INVALID' });
            if (await emailInUse(userEmail, u))
                return res.status(409).json({ error: 'AUTH_EMAIL_TAKEN' });

            const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
            const displayName = username.trim();
            const dataKey = crypto.randomBytes(32).toString('hex');
            await query(
                'INSERT INTO users (username, display_name, hash, salt, email, data_key) VALUES ($1, $2, $3, $4, $5, $6)',
                [u, displayName, hash, '', userEmail, encryptDataKey(dataKey)]  // bcrypt hash'i salt içeriyor, ayrı sütun boş
            );

            // Doğrulama kodu gönder — mail hatası kaydı engellemesin
            let emailVerificationPending = false;
            try {
                await sendVerificationCode(u, userEmail);
                emailVerificationPending = true;
            } catch (e) {
                console.error('Doğrulama maili gönderilemedi:', e.message);
            }

            const tok = crypto.randomBytes(32).toString('hex');
            await query(
                'INSERT INTO sessions (token, username, display_name, expires_at) VALUES ($1, $2, $3, $4)',
                [hashToken(tok), u, displayName, expiresAt()]
            );
            return res.json({
                ok: true, token: tok, displayName, dataKey,
                emailVerificationPending,
                emailMasked: userEmail ? maskEmail(userEmail) : null
            });
        }

        /* ---- GİRİŞ YAP ---- */
        if (action === 'login') {
            // Hesap bazlı kilit tek hesabı korur; bu limit aynı IP'den çok
            // sayıda farklı hesaba parola spreylemeyi engeller
            if (!(await checkRateLimit('login_ip:' + getClientIp(req), 100)))
                return res.status(429).json({ error: 'AUTH_RATE_LIMITED' });
            if (!username || !password)
                return res.status(400).json({ error: 'AUTH_FIELDS_REQUIRED' });
            const u = username.trim().toLowerCase();

            await ensureAuthColumns();
            const rows = await query('SELECT * FROM users WHERE username = $1', [u]);
            if (!rows.length)
                return res.status(401).json({ error: 'AUTH_INVALID_CREDENTIALS' });

            const user = rows[0];
            if (user.lock_until && new Date(user.lock_until) > new Date())
                return res.status(429).json({ error: 'AUTH_TOO_MANY_ATTEMPTS' });

            let valid = false;
            let needsMigration = false;

            if (user.hash.startsWith('$2')) {
                valid = await bcrypt.compare(password, user.hash);
            } else {
                valid = _legacyHash(password, user.salt) === user.hash;
                if (valid) needsMigration = true;
            }

            if (!valid) {
                const fails = (user.failed_logins || 0) + 1;
                if (fails >= 5) {
                    await query(
                        `UPDATE users SET failed_logins = 0, lock_until = now() + interval '15 minutes' WHERE username = $1`,
                        [u]
                    );
                    return res.status(429).json({ error: 'AUTH_TOO_MANY_ATTEMPTS' });
                }
                await query('UPDATE users SET failed_logins = $1 WHERE username = $2', [fails, u]);
                return res.status(401).json({ error: 'AUTH_INVALID_CREDENTIALS' });
            }

            if (user.failed_logins || user.lock_until)
                await query('UPDATE users SET failed_logins = 0, lock_until = NULL WHERE username = $1', [u]);

            // SHA-256 kullanan eski hesabı bcrypt'e geçir
            if (needsMigration) {
                const newHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
                await query('UPDATE users SET hash = $1, salt = $2 WHERE username = $3', [newHash, '', u]);
            }

            const tok = crypto.randomBytes(32).toString('hex');
            const dataKey = await unwrapDataKey(u, user.data_key);
            await query(
                'INSERT INTO sessions (token, username, display_name, expires_at) VALUES ($1, $2, $3, $4)',
                [hashToken(tok), u, user.display_name, expiresAt()]
            );
            return res.json({
                ok: true, token: tok, displayName: user.display_name, dataKey,
                hasEmail: !!user.email, email: user.email || '',
                emailVerified: !!user.email_verified
            });
        }

        /* ---- SIFIRLAMA KODU GÖNDER (kullanıcı adı veya e-posta) ---- */
        if (action === 'request_reset') {
            // IP basina: tek bir hesaba deneme sinirinin (reset_expires) yani
            // sira, farkli birçok hesaba e-posta spraylemeyi de engelle
            if (!(await checkRateLimit('reset_ip:' + getClientIp(req), 10)))
                return res.status(429).json({ error: 'AUTH_RATE_LIMITED' });
            const ident = identifier || username;
            if (!ident) return res.status(400).json({ error: 'AUTH_FIELDS_REQUIRED' });
            await ensureAuthColumns();
            const user = await findUserByIdentifier(ident);
            // Hesabın varlığı / e-posta durumu dışarıdan anlaşılamasın.
            if (!user || !user.email) return res.json(genericResetResponse());

            // 60 sn içinde tekrar istenmesin
            if (user.reset_expires && new Date(user.reset_expires).getTime() - Date.now() > 14 * 60 * 1000)
                return res.json(genericResetResponse());

            const code = generateSixDigitCode();
            const codeHash = await bcrypt.hash(code, 8);
            await query(
                `UPDATE users SET reset_hash = $1, reset_expires = now() + interval '15 minutes', reset_attempts = 0 WHERE username = $2`,
                [codeHash, user.username]
            );
            await sendMail(user.email, 'YıldızCan şifre sıfırlama kodu', resetCodeEmailHtml(code));
            return res.json(genericResetResponse());
        }

        /* ---- ŞİFRE SIFIRLA (e-posta koduyla) ---- */
        if (action === 'reset_with_email_code') {
            const { code, newPassword } = req.body || {};
            const ident = identifier || username;
            if (!ident || !code || !newPassword)
                return res.status(400).json({ error: 'AUTH_FIELDS_REQUIRED' });
            if (newPassword.length < 8)
                return res.status(400).json({ error: 'AUTH_PASSWORD_TOO_SHORT' });
            await ensureAuthColumns();
            const user = await findUserByIdentifier(ident);
            if (!user || !user.reset_hash || !user.reset_expires || new Date(user.reset_expires) < new Date())
                return res.status(401).json({ error: 'AUTH_RESET_CODE_INVALID' });
            if ((user.reset_attempts || 0) >= 5)
                return res.status(429).json({ error: 'AUTH_RESET_CODE_INVALID' });

            const valid = await bcrypt.compare(String(code).trim(), user.reset_hash);
            if (!valid) {
                await query('UPDATE users SET reset_attempts = reset_attempts + 1 WHERE username = $1', [user.username]);
                return res.status(401).json({ error: 'AUTH_RESET_CODE_INVALID' });
            }
            if (await isPasswordPwned(newPassword))
                return res.status(400).json({ error: 'AUTH_PASSWORD_PWNED' });

            const newHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
            await query(
                `UPDATE users SET hash = $1, salt = $2, reset_hash = NULL, reset_expires = NULL, reset_attempts = 0,
                 failed_logins = 0, lock_until = NULL, email_verified = true WHERE username = $3`,
                [newHash, '', user.username]
            );
            await query('DELETE FROM sessions WHERE username = $1', [user.username]);

            const tok = crypto.randomBytes(32).toString('hex');
            const dataKey = await unwrapDataKey(user.username, user.data_key);
            await query(
                'INSERT INTO sessions (token, username, display_name, expires_at) VALUES ($1, $2, $3, $4)',
                [hashToken(tok), user.username, user.display_name, expiresAt()]
            );
            return res.json({ ok: true, token: tok, displayName: user.display_name, username: user.username, dataKey });
        }

        /* ---- E-POSTA EKLE/GÜNCELLE (oturumlu) ---- */
        if (action === 'set_email') {
            if (!token) return res.status(400).json({ error: 'Token gerekli' });
            const userEmail = email && String(email).trim().toLowerCase();
            if (!isValidEmail(userEmail))
                return res.status(400).json({ error: 'AUTH_EMAIL_INVALID' });
            const rows = await sessionRows(token);
            if (!rows.length) return res.status(401).json({ error: 'Geçersiz oturum' });
            // Bu action herhangi bir e-postaya sahiplik dogrulamasi olmadan
            // dogrulama maili gonderiyor - sinirsiz cagriya izin verilirse
            // herhangi bir hedef adres bombalanabilir
            if (!(await checkRateLimit('set_email:' + rows[0].username, 5)))
                return res.status(429).json({ error: 'AUTH_RATE_LIMITED' });
            await ensureAuthColumns();
            if (await emailInUse(userEmail, rows[0].username))
                return res.status(409).json({ error: 'AUTH_EMAIL_TAKEN' });
            await query('UPDATE users SET email = $1, email_verified = false WHERE username = $2', [userEmail, rows[0].username]);
            let verificationSent = false;
            try {
                await sendVerificationCode(rows[0].username, userEmail);
                verificationSent = true;
            } catch (e) {
                console.error('Doğrulama maili gönderilemedi:', e.message);
            }
            return res.json({ ok: true, emailMasked: maskEmail(userEmail), verificationSent });
        }

        /* ---- E-POSTA DOĞRULAMA KODU TEKRAR GÖNDER (oturumlu) ---- */
        if (action === 'send_email_verification') {
            if (!token) return res.status(400).json({ error: 'Token gerekli' });
            const rows = await sessionRows(token);
            if (!rows.length) return res.status(401).json({ error: 'Geçersiz oturum' });
            await ensureAuthColumns();
            const users = await query('SELECT * FROM users WHERE username = $1', [rows[0].username]);
            const user = users[0];
            if (!user || !user.email) return res.status(400).json({ error: 'AUTH_NO_EMAIL' });
            if (user.verify_expires && new Date(user.verify_expires).getTime() - Date.now() > 14 * 60 * 1000)
                return res.status(429).json({ error: 'AUTH_RESET_TOO_SOON' });
            await sendVerificationCode(user.username, user.email);
            return res.json({ ok: true, emailMasked: maskEmail(user.email) });
        }

        /* ---- E-POSTA DOĞRULA (oturumlu, kodla) ---- */
        if (action === 'verify_email') {
            const { code } = req.body || {};
            if (!token || !code) return res.status(400).json({ error: 'AUTH_FIELDS_REQUIRED' });
            const rows = await sessionRows(token);
            if (!rows.length) return res.status(401).json({ error: 'Geçersiz oturum' });
            await ensureAuthColumns();
            const users = await query('SELECT * FROM users WHERE username = $1', [rows[0].username]);
            const user = users[0];
            if (!user || !user.verify_hash || !user.verify_expires || new Date(user.verify_expires) < new Date())
                return res.status(401).json({ error: 'AUTH_VERIFY_CODE_INVALID' });
            if ((user.verify_attempts || 0) >= 5)
                return res.status(429).json({ error: 'AUTH_VERIFY_CODE_INVALID' });

            const valid = await bcrypt.compare(String(code).trim(), user.verify_hash);
            if (!valid) {
                await query('UPDATE users SET verify_attempts = verify_attempts + 1 WHERE username = $1', [user.username]);
                return res.status(401).json({ error: 'AUTH_VERIFY_CODE_INVALID' });
            }
            await query(
                'UPDATE users SET email_verified = true, verify_hash = NULL, verify_expires = NULL, verify_attempts = 0 WHERE username = $1',
                [user.username]
            );
            return res.json({ ok: true, email: user.email || '' });
        }

        /* ---- OTURUM DOĞRULA ---- */
        if (action === 'verify') {
            const stored = await resolveToken(token);
            if (!stored) return res.json({ valid: false });
            const rows = await query(
                `SELECT s.username, s.display_name, u.email, u.email_verified
                 FROM sessions s
                 JOIN users u ON u.username = s.username
                 WHERE s.token = $1 AND s.expires_at > now()`,
                [stored]
            );
            if (!rows.length) return res.json({ valid: false });
            const dataKey = await ensureDataKey(rows[0].username);
            return res.json({
                valid: true,
                username: rows[0].username,
                displayName: rows[0].display_name,
                dataKey,
                hasEmail: !!rows[0].email,
                email: rows[0].email || '',
                emailVerified: !!rows[0].email_verified
            });
        }

        /* ---- ÇIKIŞ ---- */
        if (action === 'logout') {
            if (token) await query('DELETE FROM sessions WHERE token = $1 OR token = $2', [hashToken(token), token]);
            return res.json({ ok: true });
        }

        /* ---- HESAP SİL ---- */
        if (action === 'delete') {
            if (!token) return res.status(400).json({ error: 'Token gerekli' });
            const rows = await sessionRows(token);
            if (!rows.length) return res.status(401).json({ error: 'Geçersiz oturum' });
            const { username: uname } = rows[0];
            // KVKK silme hakkı: hesapla birlikte tüm LMS verileri de gitmeli.
            // split_part kullanılıyor çünkü LIKE'ta '_' joker karakter ve
            // kullanıcı adları '_' içerebiliyor.
            await query("DELETE FROM app_data WHERE split_part(user_key, ':', 1) = $1", [uname]);
            await query('DELETE FROM sessions WHERE username = $1', [uname]);
            await query('DELETE FROM users WHERE username = $1', [uname]);
            return res.json({ ok: true });
        }

        return res.status(400).json({ error: 'Geçersiz action' });

    } catch (err) {
        console.error('Auth error:', err);
        return res.status(500).json({ error: 'SERVER_ERROR' });
    }
}
