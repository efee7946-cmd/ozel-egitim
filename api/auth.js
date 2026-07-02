// Kullanıcı kimlik doğrulama — Aiven PostgreSQL üzerinde çalışır.
// bcrypt ile şifre hash'i, 32-byte random session token'ı.
// Şifre sıfırlama ve e-posta doğrulama: Gmail SMTP ile 6 haneli kod.
// DATABASE_URL env var'ı gereklidir.

import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { query } from './_db.js';
import { sendMail, resetCodeEmailHtml, verifyCodeEmailHtml } from './_mail.js';

const SESSION_DAYS = 14;
const BCRYPT_ROUNDS = 12;

function cors(res) {
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
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

let _columnsEnsured = false;
async function ensureAuthColumns() {
    if (_columnsEnsured) return;
    await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT');
    await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false');
    await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_hash TEXT');
    await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_expires TIMESTAMPTZ');
    await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_attempts INT DEFAULT 0');
    await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS verify_hash TEXT');
    await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS verify_expires TIMESTAMPTZ');
    await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS verify_attempts INT DEFAULT 0');
    _columnsEnsured = true;
}

function isValidEmail(e) {
    return typeof e === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) && e.length <= 200;
}

function maskEmail(e) {
    const [local, domain] = e.split('@');
    return local[0] + '***@' + domain[0] + '***' + domain.slice(domain.lastIndexOf('.'));
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
            if (!username || !password)
                return res.status(400).json({ error: 'AUTH_FIELDS_REQUIRED' });
            const u = username.trim().toLowerCase();
            if (u.length < 3)
                return res.status(400).json({ error: 'AUTH_USERNAME_TOO_SHORT' });
            if (password.length < 6)
                return res.status(400).json({ error: 'AUTH_PASSWORD_TOO_SHORT' });
            if (!/^[a-z0-9_]+$/.test(u))
                return res.status(400).json({ error: 'AUTH_USERNAME_INVALID_CHARS' });

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
            await query(
                'INSERT INTO users (username, display_name, hash, salt, email) VALUES ($1, $2, $3, $4, $5)',
                [u, displayName, hash, '', userEmail]  // bcrypt hash'i salt içeriyor, ayrı sütun boş
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
                [tok, u, displayName, expiresAt()]
            );
            return res.json({
                ok: true, token: tok, displayName,
                emailVerificationPending,
                emailMasked: userEmail ? maskEmail(userEmail) : null
            });
        }

        /* ---- GİRİŞ YAP ---- */
        if (action === 'login') {
            if (!username || !password)
                return res.status(400).json({ error: 'AUTH_FIELDS_REQUIRED' });
            const u = username.trim().toLowerCase();

            const rows = await query('SELECT * FROM users WHERE username = $1', [u]);
            if (!rows.length)
                return res.status(401).json({ error: 'AUTH_INVALID_CREDENTIALS' });

            const user = rows[0];
            let valid = false;
            let needsMigration = false;

            if (user.hash.startsWith('$2')) {
                valid = await bcrypt.compare(password, user.hash);
            } else {
                valid = _legacyHash(password, user.salt) === user.hash;
                if (valid) needsMigration = true;
            }

            if (!valid)
                return res.status(401).json({ error: 'AUTH_INVALID_CREDENTIALS' });

            // SHA-256 kullanan eski hesabı bcrypt'e geçir
            if (needsMigration) {
                const newHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
                await query('UPDATE users SET hash = $1, salt = $2 WHERE username = $3', [newHash, '', u]);
            }

            await ensureAuthColumns();
            const tok = crypto.randomBytes(32).toString('hex');
            await query(
                'INSERT INTO sessions (token, username, display_name, expires_at) VALUES ($1, $2, $3, $4)',
                [tok, u, user.display_name, expiresAt()]
            );
            return res.json({
                ok: true, token: tok, displayName: user.display_name,
                hasEmail: !!user.email, emailVerified: !!user.email_verified
            });
        }

        /* ---- SIFIRLAMA KODU GÖNDER (kullanıcı adı veya e-posta) ---- */
        if (action === 'request_reset') {
            const ident = identifier || username;
            if (!ident) return res.status(400).json({ error: 'AUTH_FIELDS_REQUIRED' });
            await ensureAuthColumns();
            const user = await findUserByIdentifier(ident);
            if (!user)
                return res.status(404).json({ error: 'AUTH_INVALID_CREDENTIALS' });
            if (!user.email)
                return res.status(400).json({ error: 'AUTH_NO_EMAIL' });

            // 60 sn içinde tekrar istenmesin
            if (user.reset_expires && new Date(user.reset_expires).getTime() - Date.now() > 14 * 60 * 1000)
                return res.status(429).json({ error: 'AUTH_RESET_TOO_SOON' });

            const code = generateSixDigitCode();
            const codeHash = await bcrypt.hash(code, 8);
            await query(
                `UPDATE users SET reset_hash = $1, reset_expires = now() + interval '15 minutes', reset_attempts = 0 WHERE username = $2`,
                [codeHash, user.username]
            );
            await sendMail(user.email, 'YıldızCan şifre sıfırlama kodu', resetCodeEmailHtml(code));
            return res.json({ ok: true, emailMasked: maskEmail(user.email) });
        }

        /* ---- ŞİFRE SIFIRLA (e-posta koduyla) ---- */
        if (action === 'reset_with_email_code') {
            const { code, newPassword } = req.body || {};
            const ident = identifier || username;
            if (!ident || !code || !newPassword)
                return res.status(400).json({ error: 'AUTH_FIELDS_REQUIRED' });
            if (newPassword.length < 6)
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

            const newHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
            await query(
                `UPDATE users SET hash = $1, salt = $2, reset_hash = NULL, reset_expires = NULL, reset_attempts = 0,
                 email_verified = true WHERE username = $3`,
                [newHash, '', user.username]
            );
            await query('DELETE FROM sessions WHERE username = $1', [user.username]);

            const tok = crypto.randomBytes(32).toString('hex');
            await query(
                'INSERT INTO sessions (token, username, display_name, expires_at) VALUES ($1, $2, $3, $4)',
                [tok, user.username, user.display_name, expiresAt()]
            );
            return res.json({ ok: true, token: tok, displayName: user.display_name, username: user.username });
        }

        /* ---- E-POSTA EKLE/GÜNCELLE (oturumlu) ---- */
        if (action === 'set_email') {
            if (!token) return res.status(400).json({ error: 'Token gerekli' });
            const userEmail = email && String(email).trim().toLowerCase();
            if (!isValidEmail(userEmail))
                return res.status(400).json({ error: 'AUTH_EMAIL_INVALID' });
            const rows = await query('SELECT username FROM sessions WHERE token = $1 AND expires_at > now()', [token]);
            if (!rows.length) return res.status(401).json({ error: 'Geçersiz oturum' });
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
            const rows = await query('SELECT username FROM sessions WHERE token = $1 AND expires_at > now()', [token]);
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
            const rows = await query('SELECT username FROM sessions WHERE token = $1 AND expires_at > now()', [token]);
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
            return res.json({ ok: true });
        }

        /* ---- OTURUM DOĞRULA ---- */
        if (action === 'verify') {
            if (!token) return res.json({ valid: false });
            const rows = await query(
                'SELECT username, display_name FROM sessions WHERE token = $1 AND expires_at > now()',
                [token]
            );
            if (!rows.length) return res.json({ valid: false });
            return res.json({ valid: true, username: rows[0].username, displayName: rows[0].display_name });
        }

        /* ---- ÇIKIŞ ---- */
        if (action === 'logout') {
            if (token) await query('DELETE FROM sessions WHERE token = $1', [token]);
            return res.json({ ok: true });
        }

        /* ---- HESAP SİL ---- */
        if (action === 'delete') {
            if (!token) return res.status(400).json({ error: 'Token gerekli' });
            const rows = await query('SELECT username FROM sessions WHERE token = $1 AND expires_at > now()', [token]);
            if (!rows.length) return res.status(401).json({ error: 'Geçersiz oturum' });
            const { username: uname } = rows[0];
            await query('DELETE FROM sessions WHERE username = $1', [uname]);
            await query('DELETE FROM users WHERE username = $1', [uname]);
            return res.json({ ok: true });
        }

        return res.status(400).json({ error: 'Geçersiz action' });

    } catch (err) {
        console.error('Auth error:', err.message);
        return res.status(500).json({ error: 'Sunucu hatası: ' + err.message });
    }
}
