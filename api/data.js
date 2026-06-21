// LMS veri kalıcılığı — Vercel KV (Upstash Redis REST API).
// Kurulum: Vercel Dashboard → Storage → KV → Create Store → bu projeye bağla.
// Bağlandığında KV_REST_API_URL ve KV_REST_API_TOKEN env var olarak enjekte edilir.
// KV yoksa 503 döner — frontend localStorage'a fallback yapar.

export default async function handler(req, res) {
    const KV_URL   = process.env.KV_REST_API_URL;
    const KV_TOKEN = process.env.KV_REST_API_TOKEN;

    res.setHeader('Access-Control-Allow-Origin',  '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (!KV_URL || !KV_TOKEN) {
        return res.status(503).json({ fallback: true, error: 'KV_NOT_CONFIGURED' });
    }

    async function kv(commands) {
        const r = await fetch(KV_URL + '/pipeline', {
            method: 'POST',
            headers: { Authorization: 'Bearer ' + KV_TOKEN, 'Content-Type': 'application/json' },
            body: JSON.stringify(commands),
        });
        if (!r.ok) throw new Error('KV ' + r.status);
        return r.json();
    }

    const NS = 'lms:'; // namespace prefix

    try {
        if (req.method === 'GET') {
            const { key } = req.query;
            if (!key) return res.status(400).json({ error: 'key required' });
            const results = await kv([['GET', NS + key]]);
            const raw = results[0]?.result;
            return res.json({ value: raw ? JSON.parse(raw) : null });
        }

        if (req.method === 'POST') {
            const { key, value } = req.body || {};
            if (!key) return res.status(400).json({ error: 'key required' });
            await kv([['SET', NS + key, JSON.stringify(value)]]);
            return res.json({ ok: true });
        }

        if (req.method === 'DELETE') {
            const { key } = req.query;
            if (!key) return res.status(400).json({ error: 'key required' });
            await kv([['DEL', NS + key]]);
            return res.json({ ok: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
