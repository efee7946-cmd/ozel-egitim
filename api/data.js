// LMS veri kalıcılığı — Aiven PostgreSQL üzerinde çalışır.
// DATABASE_URL env var'ı gereklidir.

import { query } from './_db.js';

function cors(res) {
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
    cors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        if (req.method === 'GET') {
            const { key } = req.query;
            if (!key) return res.status(400).json({ error: 'key gerekli' });
            const rows = await query('SELECT value FROM app_data WHERE user_key = $1', [key]);
            const raw = rows.length ? rows[0].value : null;
            return res.json({ value: raw ? JSON.parse(raw) : null });
        }

        if (req.method === 'POST') {
            const { key, value } = req.body || {};
            if (!key) return res.status(400).json({ error: 'key gerekli' });
            const v = typeof value === 'string' ? value : JSON.stringify(value);
            await query(
                `INSERT INTO app_data (user_key, value, updated_at) VALUES ($1, $2, now())
                 ON CONFLICT (user_key) DO UPDATE SET value = $2, updated_at = now()`,
                [key, v]
            );
            return res.json({ ok: true });
        }

        if (req.method === 'DELETE') {
            const { key } = req.query;
            if (!key) return res.status(400).json({ error: 'key gerekli' });
            await query('DELETE FROM app_data WHERE user_key = $1', [key]);
            return res.json({ ok: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (err) {
        console.error('Data error:', err.message);
        return res.status(500).json({ error: err.message });
    }
}
