import { sessionUsername } from './_auth.js';
import { checkRateLimit } from './_rateLimit.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const username = await sessionUsername(req);
    if (!username) {
        return res.status(401).json({ error: 'AUTH_REQUIRED' });
    }
    if (!(await checkRateLimit('video:' + username, 30))) {
        return res.status(429).json({ error: 'RATE_LIMITED' });
    }

    const PEXELS_KEY = process.env.PEXELS_KEY;
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: 'query gerekli' });

    try {
        const response = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=15&orientation=landscape`, {
            headers: { Authorization: PEXELS_KEY }
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (e) {
        console.error('Video error:', e);
        res.status(500).json({ error: 'SERVER_ERROR' });
    }
}
