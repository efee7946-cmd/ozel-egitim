import { sessionUsername, guestCallAllowed } from './_auth.js';
import { checkRateLimit } from './_rateLimit.js';
import { allowOrigin } from './_cors.js';

const GUEST_CHAT_CAP = 30;

export default async function handler(req, res) {
    allowOrigin(req, res);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();

    // Vercel panelindeki GEMINI_KEY (Google AI Studio anahtarı ikisi için de geçerli)
    const GEMINI_KEY = process.env.GEMINI_KEY;

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Sadece POST isteği atılabilir.' });
    }

    let actor = await sessionUsername(req);
    if (!actor) actor = await guestCallAllowed(req, 'chat_calls', GUEST_CHAT_CAP);
    if (!actor) {
        return res.status(401).json({ error: 'AUTH_REQUIRED' });
    }
    if (!(await checkRateLimit('chat:' + actor, 60))) {
        return res.status(429).json({ error: 'RATE_LIMITED' });
    }

    const { contents, system_instruction } = req.body;

    if (!Array.isArray(contents) || JSON.stringify(req.body).length > 32000) {
        return res.status(400).json({ error: 'Geçersiz istek' });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${GEMINI_KEY}`;

    const requestBody = { contents };
    if (system_instruction) requestBody.system_instruction = system_instruction;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        // Eğer Google hata döndürürse bunu yakalayalım
        if (!response.ok) {
            console.error("Google API Hatası:", data);
            return res.status(response.status).json(data);
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'SERVER_ERROR' });
    }
}
