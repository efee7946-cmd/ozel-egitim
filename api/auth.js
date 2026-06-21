// Kullanıcı kimlik doğrulama — Vercel KV üzerinde çalışır.
// SHA-256 + salt ile şifre hash'i, 32-byte random session token'ı.
// KV_REST_API_URL ve KV_REST_API_TOKEN env var'ları gereklidir.

import crypto from 'crypto';

const KV_URL   = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const SESSION_SECS = 60 * 60 * 24 * 14; // 2 hafta

function cors(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

async function kvPipeline(commands) {
    if (!KV_URL || !KV_TOKEN) throw Object.assign(new Error('KV_NOT_CONFIGURED'), { fallback: true });
    const r = await fetch(KV_URL + '/pipeline', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + KV_TOKEN, 'Content-Type': 'application/json' },
        body: JSON.stringify(commands),
    });
    if (!r.ok) throw new Error('KV HTTP ' + r.status);
    return r.json();
}

async function kvGet(key) {
    const [res] = await kvPipeline([['GET', 'auth:' + key]]);
    return res.result ? JSON.parse(res.result) : null;
}

async function kvSet(key, value, exSecs) {
    const cmd = ['SET', 'auth:' + key, JSON.stringify(value)];
    if (exSecs) { cmd.push('EX', exSecs); }
    await kvPipeline([cmd]);
}

async function kvDel(key) {
    await kvPipeline([['DEL', 'auth:' + key]]);
}

function hashPw(password, salt) {
    return crypto.createHash('sha256')
        .update(salt + ':' + password + ':yz2026')
        .digest('hex');
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

            const exists = await kvGet('user:' + u);
            if (exists) return res.status(409).json({ error: 'Bu kullanıcı adı zaten alınmış' });

            const salt = crypto.randomBytes(16).toString('hex');
            const hash = hashPw(password, salt);
            await kvSet('user:' + u, {
                username: u, displayName: username.trim(),
                hash, salt, createdAt: new Date().toISOString(),
            });

            const tok = crypto.randomBytes(32).toString('hex');
            await kvSet('session:' + tok, { username: u, displayName: username.trim() }, SESSION_SECS);
            return res.json({ ok: true, token: tok, displayName: username.trim() });
        }

        /* ---- GİRİŞ YAP ---- */
        if (action === 'login') {
            if (!username || !password)
                return res.status(400).json({ error: 'Kullanıcı adı ve şifre gerekli' });
            const u = username.trim().toLowerCase();

            const user = await kvGet('user:' + u);
            if (!user) return res.status(401).json({ error: 'Kullanıcı adı veya şifre yanlış' });

            const hash = hashPw(password, user.salt);
            if (hash !== user.hash)
                return res.status(401).json({ error: 'Kullanıcı adı veya şifre yanlış' });

            const tok = crypto.randomBytes(32).toString('hex');
            await kvSet('session:' + tok, { username: u, displayName: user.displayName }, SESSION_SECS);
            return res.json({ ok: true, token: tok, displayName: user.displayName });
        }

        /* ---- OTURUM DOĞRULA ---- */
        if (action === 'verify') {
            if (!token) return res.json({ valid: false });
            const session = await kvGet('session:' + token);
            if (!session) return res.json({ valid: false });
            return res.json({ valid: true, displayName: session.displayName, username: session.username });
        }

        /* ---- ÇIKIŞ ---- */
        if (action === 'logout') {
            if (token) await kvDel('session:' + token);
            return res.json({ ok: true });
        }

        return res.status(400).json({ error: 'Geçersiz action' });

    } catch (err) {
        if (err.fallback) {
            return res.status(503).json({ error: 'Sunucu yapılandırılmamış', fallback: true });
        }
        console.error('Auth error:', err.message);
        return res.status(500).json({ error: 'Sunucu hatası' });
    }
}
