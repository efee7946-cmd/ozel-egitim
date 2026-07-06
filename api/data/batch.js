import { query } from '../_db.js';
import { sessionUsername } from '../_auth.js';

function cors(res) {
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(req, res) {
    cors(res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Sadece POST isteği atılabilir.' });

    const username = await sessionUsername(req);
    if (!username) return res.status(401).json({ error: 'AUTH_REQUIRED' });

    const keys = Array.isArray(req.body?.keys) ? req.body.keys : null;
    if (!keys) return res.status(400).json({ error: 'keys array required' });

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
            return {
                key,
                value: row ? row.value : null,
                updatedAt: row ? row.updated_at : null,
            };
        });

        return res.json(result);
    } catch (err) {
        console.error('Data batch error:', err);
        return res.status(500).json({ error: 'SERVER_ERROR' });
    }
}
