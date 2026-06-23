// Kullanıcı kimlik doğrulama — Aiven PostgreSQL üzerinde çalışır.
// SHA-256 + salt ile şifre hash'i, 32-byte random session token'ı.
// DATABASE_URL env var'ı gereklidir.

import crypto from 'crypto';
import { query } from './_db.js';

const SESSION_DAYS = 14;

function cors(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function hashPw(password, salt) {
    return crypto.createHash('sha256')
        .update(salt + ':' + password + ':yz2026')
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

            const salt = crypto.randomBytes(16).toString('hex');
            const hash = hashPw(password, salt);
            const displayName = username.trim();
            await query(
                'INSERT INTO users (username, display_name, hash, salt) VALUES ($1, $2, $3, $4)',
                [u, displayName, hash, salt]
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
            if (hashPw(password, user.salt) !== user.hash)
                return res.status(401).json({ error: 'Kullanıcı adı veya şifre yanlış' });

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

        return res.status(400).json({ error: 'Geçersiz action' });

    } catch (err) {
        console.error('Auth error:', err.message);
        return res.status(500).json({ error: 'Sunucu hatası: ' + err.message });
    }
}
