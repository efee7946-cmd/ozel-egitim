// LMS veri kalıcılığı — Aiven PostgreSQL üzerinde çalışır.
// Her istek oturum token'ı gerektirir; veriler kullanıcı bazında ayrılır
// (user_key = "<kullanıcıadı>:<anahtar>"). DATABASE_URL env var'ı gereklidir.

import { query } from './_db.js';

function cors(res) {
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

let _cleanupDone = false;
async function cleanupLeakedAuthKeys() {
    if (_cleanupDone) return;
    // Eski sürüm oturum token'larını paylaşılan anahtarlara yazmıştı — temizle
    await query("DELETE FROM app_data WHERE user_key IN ('auth_token', 'auth_user')");
    _cleanupDone = true;
}

async function authUsername(req) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return null;
    const rows = await query(
        'SELECT username FROM sessions WHERE token = $1 AND expires_at > now()',
        [token]
    );
    return rows.length ? rows[0].username : null;
}

export default async function handler(req, res) {
    cors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        await cleanupLeakedAuthKeys();

        const username = await authUsername(req);
        if (!username) return res.status(401).json({ error: 'AUTH_REQUIRED' });

        if (req.method === 'GET') {
            const { key } = req.query;
            if (!key) return res.status(400).json({ error: 'key gerekli' });
            const scoped = `${username}:${key}`;
            let rows = await query('SELECT value, updated_at FROM app_data WHERE user_key = $1', [scoped]);

            // Geçiş köprüsü: kullanıcı adını içeren eski (kapsamsız) anahtarları taşı
            if (!rows.length && key.includes(username)) {
                const legacy = await query('SELECT value, updated_at FROM app_data WHERE user_key = $1', [key]);
                if (legacy.length) {
                    await query(
                        `INSERT INTO app_data (user_key, value, updated_at) VALUES ($1, $2, $3)
                         ON CONFLICT (user_key) DO NOTHING`,
                        [scoped, legacy[0].value, legacy[0].updated_at]
                    );
                    rows = legacy;
                }
            }

            const raw = rows.length ? rows[0].value : null;
            return res.json({
                value: raw ? JSON.parse(raw) : null,
                updatedAt: rows.length ? rows[0].updated_at : null
            });
        }

        if (req.method === 'POST') {
            const { key, value } = req.body || {};
            if (!key) return res.status(400).json({ error: 'key gerekli' });
            const v = typeof value === 'string' ? value : JSON.stringify(value);
            if (v && v.length > 262144)
                return res.status(413).json({ error: 'VALUE_TOO_LARGE' });
            const rows = await query(
                `INSERT INTO app_data (user_key, value, updated_at) VALUES ($1, $2, now())
                 ON CONFLICT (user_key) DO UPDATE SET value = $2, updated_at = now()
                 RETURNING updated_at`,
                [`${username}:${key}`, v]
            );
            return res.json({ ok: true, updatedAt: rows[0].updated_at });
        }

        if (req.method === 'DELETE') {
            const { key } = req.query;
            if (!key) return res.status(400).json({ error: 'key gerekli' });
            await query('DELETE FROM app_data WHERE user_key = $1', [`${username}:${key}`]);
            return res.json({ ok: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (err) {
        console.error('Data error:', err);
        return res.status(500).json({ error: 'SERVER_ERROR' });
    }
}
