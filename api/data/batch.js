import { query } from '../_db.js';
import { sessionUsername } from '../_auth.js';
import { allowOrigin } from '../_cors.js';

function cors(req, res) {
    allowOrigin(req, res);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(req, res) {
    cors(req, res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Sadece POST isteği atılabilir.' });

    const username = await sessionUsername(req);
    if (!username) return res.status(401).json({ error: 'AUTH_REQUIRED' });

    const keys = Array.isArray(req.body?.keys) ? req.body.keys : null;
    const items = Array.isArray(req.body?.items) ? req.body.items : null;
    if (!keys && !items) return res.status(400).json({ error: 'keys or items required' });

    if (keys) {
        const scopedKeys = keys
            .filter(k => typeof k === 'string' && k.trim())
            .map(k => `${username}:${k}`);

        try {
            const rows = await query(
                'SELECT user_key, value, updated_at FROM app_data WHERE user_key = ANY($1)',
                [scopedKeys]
            );

            const rowMap = new Map(rows.map(r => [r.user_key, r]));
            const result = keys.map(key => {
                const scoped = `${username}:${key}`;
                const row = rowMap.get(scoped);
                let value = null;
                if (row && row.value != null) {
                    try { value = JSON.parse(row.value); } catch { value = row.value; }
                }
                return {
                    key,
                    value,
                    updatedAt: row ? row.updated_at : null,
                };
            });

            return res.json(result);
        } catch (err) {
            console.error('Data batch error:', err);
            return res.status(500).json({ error: 'SERVER_ERROR' });
        }
    }

    if (items) {
        const validItems = items
            .filter(item => item && typeof item.key === 'string' && item.key.trim())
            .map(item => ({ key: item.key.trim(), value: item.value }));
        if (!validItems.length) return res.status(400).json({ error: 'items array required' });

        const values = [];
        const placeholders = validItems.map((item, index) => {
            const keyIndex = index * 2 + 1;
            const valueIndex = index * 2 + 2;
            const v = JSON.stringify(item.value);
            if (v.length > 262144) throw new Error('VALUE_TOO_LARGE');
            values.push(`${username}:${item.key}`, v);
            return `($${keyIndex}, $${valueIndex}, now())`;
        });

        try {
            const rows = await query(
                `INSERT INTO app_data (user_key, value, updated_at) VALUES ${placeholders.join(', ')}
                 ON CONFLICT (user_key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
                 RETURNING user_key, updated_at`,
                values
            );

            const updatedAtMap = new Map(rows.map(r => [r.user_key, r.updated_at]));
            const result = validItems.map(item => {
                const scoped = `${username}:${item.key}`;
                return {
                    key: item.key,
                    updatedAt: updatedAtMap.get(scoped) || null,
                };
            });
            return res.json(result);
        } catch (err) {
            if (err.message === 'VALUE_TOO_LARGE') {
                return res.status(413).json({ error: 'VALUE_TOO_LARGE' });
            }
            console.error('Data batch write error:', err);
            return res.status(500).json({ error: 'SERVER_ERROR' });
        }
    }

    return res.status(400).json({ error: 'invalid payload' });
}
