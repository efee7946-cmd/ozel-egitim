import { sessionUsername, guestCallAllowed } from './_auth.js';
import { checkRateLimit } from './_rateLimit.js';
import { allowOrigin } from './_cors.js';

const GUEST_PHOTO_CAP = 30;

export default async function handler(req, res) {
    allowOrigin(req, res);
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();

    let actor = await sessionUsername(req);
    if (!actor) actor = await guestCallAllowed(req, 'photo_calls', GUEST_PHOTO_CAP);
    if (!actor) {
        return res.status(401).json({ error: 'AUTH_REQUIRED' });
    }
    if (!(await checkRateLimit('photo:' + actor, 30))) {
        return res.status(429).json({ error: 'RATE_LIMITED' });
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
        console.error('Photo error:', e);
        res.status(500).json({ error: 'SERVER_ERROR' });
    }
}
