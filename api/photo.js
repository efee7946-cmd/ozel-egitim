import { sessionUsername } from './_auth.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (!(await sessionUsername(req))) {
        return res.status(401).json({ error: 'AUTH_REQUIRED' });
    }

    const { query } = req.query;
    if (!query) return res.status(400).json({ error: 'query gerekli' });

    try {
        const response = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=15&locale=tr-TR`,
            { headers: { Authorization: process.env.PEXELS_KEY } }
        );
        const data = await response.json();
        res.status(200).json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
