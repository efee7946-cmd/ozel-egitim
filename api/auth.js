// Kullanıcı kimlik doğrulama — Aiven PostgreSQL üzerinde çalışır.
// bcrypt ile şifre hash'i, 32-byte random session token'ı.
// DATABASE_URL env var'ı gereklidir.

import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { query } from './_db.js';
import { sendMail, resetCodeEmailHtml } from './_mail.js';

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

// Karışması zor karakterler: 0/O, 1/I/L yok
const RECOVERY_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

function generateRecoveryCode() {
    const bytes = crypto.randomBytes(8);
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += RECOVERY_ALPHABET[bytes[i] % RECOVERY_ALPHABET.length];
        if (i === 3) code += '-';
    }
    return code;
}

function normalizeRecoveryCode(input) {
    return String(input || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

let _columnsEnsured = false;
async function ensureRecoveryColumn() {
    if (_columnsEnsured) return;
    await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS recovery_hash TEXT');
    await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT');
    await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_hash TEXT');
    await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_expires TIMESTAMPTZ');
    await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_attempts INT DEFAULT 0');
    _columnsEnsured = true;
}

function isValidEmail(e) {
    return typeof e === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) && e.length <= 200;
}

function maskEmail(e) {
    const [local, domain] = e.split('@');
    return local[0] + '***@' + domain[0] + '***' + domain.slice(domain.lastIndexOf('.'));
}

export default async function handler(req, res) {
    cors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST gerekli' });

    const { action, username, password, token, email } = req.body || {};

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

            // bcrypt ile yeni kayıt
            await ensureRecoveryColumn();
            const userEmail = email && String(email).trim().toLowerCase();
            if (userEmail && !isValidEmail(userEmail))
                return res.status(400).json({ error: 'AUTH_EMAIL_INVALID' });
            const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
            const recoveryCode = generateRecoveryCode();
            const recoveryHash = await bcrypt.hash(normalizeRecoveryCode(recoveryCode), BCRYPT_ROUNDS);
            const displayName = username.trim();
            await query(
                'INSERT INTO users (username, display_name, hash, salt, recovery_hash, email) VALUES ($1, $2, $3, $4, $5, $6)',
                [u, displayName, hash, '', recoveryHash, userEmail || null]  // bcrypt hash'i salt içeriyor, ayrı sütun boş
            );

            const tok = crypto.randomBytes(32).toString('hex');
            await query(
                'INSERT INTO sessions (token, username, display_name, expires_at) VALUES ($1, $2, $3, $4)',
                [tok, u, displayName, expiresAt()]
            );
            return res.json({ ok: true, token: tok, displayName, recoveryCode });
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

            // Eski hesapta kurtarma kodu yoksa üret ve bir kez göster
            let recoveryCode = null;
            await ensureRecoveryColumn();
            if (!user.recovery_hash) {
                recoveryCode = generateRecoveryCode();
                const recoveryHash = await bcrypt.hash(normalizeRecoveryCode(recoveryCode), BCRYPT_ROUNDS);
                await query('UPDATE users SET recovery_hash = $1 WHERE username = $2', [recoveryHash, u]);
            }

            const tok = crypto.randomBytes(32).toString('hex');
            await query(
                'INSERT INTO sessions (token, username, display_name, expires_at) VALUES ($1, $2, $3, $4)',
                [tok, u, user.display_name, expiresAt()]
            );
            return res.json({ ok: true, token: tok, displayName: user.display_name, recoveryCode, hasEmail: !!user.email });
        }

        /* ---- SIFIRLAMA KODU GÖNDER (e-posta) ---- */
        if (action === 'request_reset') {
            if (!username) return res.status(400).json({ error: 'AUTH_FIELDS_REQUIRED' });
            const u = username.trim().toLowerCase();
            await ensureRecoveryColumn();
            const rows = await query('SELECT * FROM users WHERE username = $1', [u]);
            if (!rows.length)
                return res.status(404).json({ error: 'AUTH_INVALID_CREDENTIALS' });
            if (!rows[0].email)
                return res.status(400).json({ error: 'AUTH_NO_EMAIL' });

            // 60 sn içinde tekrar istenmesin
            if (rows[0].reset_expires && new Date(rows[0].reset_expires).getTime() - Date.now() > 14 * 60 * 1000)
                return res.status(429).json({ error: 'AUTH_RESET_TOO_SOON' });

            const code = String(crypto.randomInt(100000, 1000000));
            const codeHash = await bcrypt.hash(code, 8);
            await query(
                `UPDATE users SET reset_hash = $1, reset_expires = now() + interval '15 minutes', reset_attempts = 0 WHERE username = $2`,
                [codeHash, u]
            );
            await sendMail(rows[0].email, 'YıldızCan şifre sıfırlama kodu', resetCodeEmailHtml(code));
            return res.json({ ok: true, emailMasked: maskEmail(rows[0].email) });
        }

        /* ---- ŞİFRE SIFIRLA (e-posta koduyla) ---- */
        if (action === 'reset_with_email_code') {
            const { code, newPassword } = req.body || {};
            if (!username || !code || !newPassword)
                return res.status(400).json({ error: 'AUTH_FIELDS_REQUIRED' });
            if (newPassword.length < 6)
                return res.status(400).json({ error: 'AUTH_PASSWORD_TOO_SHORT' });
            const u = username.trim().toLowerCase();
            await ensureRecoveryColumn();
            const rows = await query('SELECT * FROM users WHERE username = $1', [u]);
            const user = rows[0];
            if (!user || !user.reset_hash || !user.reset_expires || new Date(user.reset_expires) < new Date())
                return res.status(401).json({ error: 'AUTH_RESET_CODE_INVALID' });
            if ((user.reset_attempts || 0) >= 5)
                return res.status(429).json({ error: 'AUTH_RESET_CODE_INVALID' });

            const valid = await bcrypt.compare(String(code).trim(), user.reset_hash);
            if (!valid) {
                await query('UPDATE users SET reset_attempts = reset_attempts + 1 WHERE username = $1', [u]);
                return res.status(401).json({ error: 'AUTH_RESET_CODE_INVALID' });
            }

            const newHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
            await query(
                'UPDATE users SET hash = $1, salt = $2, reset_hash = NULL, reset_expires = NULL, reset_attempts = 0 WHERE username = $3',
                [newHash, '', u]
            );
            await query('DELETE FROM sessions WHERE username = $1', [u]);

            const tok = crypto.randomBytes(32).toString('hex');
            await query(
                'INSERT INTO sessions (token, username, display_name, expires_at) VALUES ($1, $2, $3, $4)',
                [tok, u, user.display_name, expiresAt()]
            );
            return res.json({ ok: true, token: tok, displayName: user.display_name });
        }

        /* ---- E-POSTA EKLE/GÜNCELLE (oturumlu) ---- */
        if (action === 'set_email') {
            if (!token) return res.status(400).json({ error: 'Token gerekli' });
            const userEmail = email && String(email).trim().toLowerCase();
            if (!isValidEmail(userEmail))
                return res.status(400).json({ error: 'AUTH_EMAIL_INVALID' });
            const rows = await query('SELECT username FROM sessions WHERE token = $1 AND expires_at > now()', [token]);
            if (!rows.length) return res.status(401).json({ error: 'Geçersiz oturum' });
            await ensureRecoveryColumn();
            await query('UPDATE users SET email = $1 WHERE username = $2', [userEmail, rows[0].username]);
            return res.json({ ok: true, emailMasked: maskEmail(userEmail) });
        }

        /* ---- ŞİFRE SIFIRLA (kurtarma koduyla) ---- */
        if (action === 'reset_password') {
            const { recoveryCode, newPassword } = req.body || {};
            if (!username || !recoveryCode || !newPassword)
                return res.status(400).json({ error: 'AUTH_FIELDS_REQUIRED' });
            if (newPassword.length < 6)
                return res.status(400).json({ error: 'AUTH_PASSWORD_TOO_SHORT' });
            const u = username.trim().toLowerCase();

            await ensureRecoveryColumn();
            const rows = await query('SELECT * FROM users WHERE username = $1', [u]);
            if (!rows.length || !rows[0].recovery_hash)
                return res.status(401).json({ error: 'AUTH_RECOVERY_INVALID' });

            const valid = await bcrypt.compare(normalizeRecoveryCode(recoveryCode), rows[0].recovery_hash);
            if (!valid)
                return res.status(401).json({ error: 'AUTH_RECOVERY_INVALID' });

            const newHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
            const nextCode = generateRecoveryCode();
            const nextHash = await bcrypt.hash(normalizeRecoveryCode(nextCode), BCRYPT_ROUNDS);
            await query('UPDATE users SET hash = $1, salt = $2, recovery_hash = $3 WHERE username = $4',
                [newHash, '', nextHash, u]);
            await query('DELETE FROM sessions WHERE username = $1', [u]);

            const tok = crypto.randomBytes(32).toString('hex');
            await query(
                'INSERT INTO sessions (token, username, display_name, expires_at) VALUES ($1, $2, $3, $4)',
                [tok, u, rows[0].display_name, expiresAt()]
            );
            return res.json({ ok: true, token: tok, displayName: rows[0].display_name, recoveryCode: nextCode });
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
