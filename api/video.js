import { sessionUsername } from './_auth.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (!(await sessionUsername(req))) {
        return res.status(401).json({ error: 'AUTH_REQUIRED' });
    }

    const PEXELS_KEY = process.env.PEXELS_KEY;
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: 'query gerekli' });

    try {
        const response = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=5`, {
            headers: { Authorization: PEXELS_KEY }
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (e) {
        console.error('Video error:', e);
        res.status(500).json({ error: 'SERVER_ERROR' });
    }
}
