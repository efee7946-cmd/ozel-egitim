// Kullanıcı kimlik doğrulama — Aiven PostgreSQL üzerinde çalışır.
// bcrypt ile şifre hash'i, 32-byte random session token'ı.
// DATABASE_URL env var'ı gereklidir.

import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { query } from './_db.js';

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

export default async function handler(req, res) {
    cors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST gerekli' });

    const { action, username, password, token } = req.body || {};

    try {
        /* ---- KAYIT OL ---- */
        if (action === 'register') {
            if (!username || !password)
                return res.status(400).json({ error: 'Kullanıcı adı ve şifre gerekli' });
            const u = username.trim().toLowerCase();
            if (u.length < 3)
                return res.status(400).json({ error: 'Kullanıcı adı en az 3 karakter olmalı' });
            if (password.length < 6)
                return res.status(400).json({ error: 'Şifre en az 6 karakter olmalı' });
            if (!/^[a-z0-9_]+$/.test(u))
                return res.status(400).json({ error: 'Sadece harf, rakam ve alt çizgi kullanabilirsin' });

            const existing = await query('SELECT username FROM users WHERE username = $1', [u]);
            if (existing.length > 0)
                return res.status(409).json({ error: 'Bu kullanıcı adı zaten alınmış' });

            // bcrypt ile yeni kayıt
            const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
            const displayName = username.trim();
            await query(
                'INSERT INTO users (username, display_name, hash, salt) VALUES ($1, $2, $3, $4)',
                [u, displayName, hash, '']  // bcrypt hash'i salt içeriyor, ayrı sütun boş
            );

            const tok = crypto.randomBytes(32).toString('hex');
            await query(
                'INSERT INTO sessions (token, username, display_name, expires_at) VALUES ($1, $2, $3, $4)',
                [tok, u, displayName, expiresAt()]
            );
            return res.json({ ok: true, token: tok, displayName });
        }

        /* ---- GİRİŞ YAP ---- */
        if (action === 'login') {
            if (!username || !password)
                return res.status(400).json({ error: 'Kullanıcı adı ve şifre gerekli' });
            const u = username.trim().toLowerCase();

            const rows = await query('SELECT * FROM users WHERE username = $1', [u]);
            if (!rows.length)
                return res.status(401).json({ error: 'Kullanıcı adı veya şifre yanlış' });

            const user = rows[0];
            let valid = false;
            let needsMigration = false;

            if (user.hash.startsWith('$2')) {
                // Yeni format: bcrypt
                valid = await bcrypt.compare(password, user.hash);
            } else {
                // Eski format: SHA-256 — doğrulayıp bcrypt'e geçir
                valid = _legacyHash(password, user.salt) === user.hash;
                if (valid) needsMigration = true;
            }

            if (!valid)
                return res.status(401).json({ error: 'Kullanıcı adı veya şifre yanlış' });

            // SHA-256 kullanan eski hesabı bcrypt'e geçir
            if (needsMigration) {
                const newHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
                await query('UPDATE users SET hash = $1, salt = $2 WHERE username = $3', [newHash, '', u]);
            }

            const tok = crypto.randomBytes(32).toString('hex');
            await query(
                'INSERT INTO sessions (token, username, display_name, expires_at) VALUES ($1, $2, $3, $4)',
                [tok, u, user.display_name, expiresAt()]
            );
            return res.json({ ok: true, token: tok, displayName: user.display_name });
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
