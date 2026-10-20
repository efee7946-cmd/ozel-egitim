import { sessionUsername, guestCallAllowed } from './_auth.js';
import { checkRateLimit } from './_rateLimit.js';
import { allowOrigin } from './_cors.js';
import { logAiReply } from './_aiLog.js';

const GUEST_CHAT_CAP = 30;

const PRIMARY_MODEL = process.env.GEMINI_CHAT_MODEL || 'gemini-3.5-flash-lite';
const FALLBACK_MODELS = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];

function modelAttempts(isTherapyChat) {
    if (isTherapyChat) {
        return [
            { model: PRIMARY_MODEL, timeoutMs: 7000, generationConfig: { maxOutputTokens: 256, thinkingConfig: { thinkingLevel: 'minimal' } } },
            ...FALLBACK_MODELS.map(model => ({ model, timeoutMs: 6000, generationConfig: { maxOutputTokens: 256, thinkingConfig: { thinkingLevel: 'low' } } }))
        ];
    }
    return [
        { model: PRIMARY_MODEL, timeoutMs: 20000, generationConfig: { thinkingConfig: { thinkingLevel: 'low' } } },
        ...FALLBACK_MODELS.map(model => ({ model, timeoutMs: 15000, generationConfig: { thinkingConfig: { thinkingLevel: 'low' } } }))
    ];
}

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

    const timings = [];
    let mark = Date.now();
    const lap = (label) => { const now = Date.now(); timings.push(`${label}=${now - mark}ms`); mark = now; };

    let actor = await sessionUsername(req);
    if (!actor) actor = await guestCallAllowed(req, 'chat_calls', GUEST_CHAT_CAP);
    if (!actor) {
        return res.status(401).json({ error: 'AUTH_REQUIRED' });
    }
    lap('auth');
    if (!(await checkRateLimit('chat:' + actor, 60))) {
        return res.status(429).json({ error: 'RATE_LIMITED' });
    }
    lap('rate');

    const { contents, system_instruction } = req.body;

    if (!Array.isArray(contents) || JSON.stringify(req.body).length > 32000) {
        return res.status(400).json({ error: 'Geçersiz istek' });
    }

    try {
        let response = null;
        let data = null;
        for (const attempt of modelAttempts(!!req.body.meta)) {
            const requestBody = { contents, generationConfig: attempt.generationConfig };
            if (system_instruction) requestBody.system_instruction = system_instruction;
            try {
                response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/${attempt.model}:generateContent?key=${GEMINI_KEY}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(requestBody),
                        signal: AbortSignal.timeout(attempt.timeoutMs)
                    }
                );
                data = await response.json();
            } catch (err) {
                lap(`${attempt.model}:${err.name}`);
                console.error(`Gemini ${attempt.model} ulasilamadi:`, err.name, err.message);
                response = null;
                data = null;
                continue;
            }
            const hasText = (data?.candidates?.[0]?.content?.parts || []).some(p => p && p.text);
            lap(`${attempt.model}:${response.status}`);
            if (response.ok && hasText) break;
            console.error(`Gemini ${attempt.model} hatasi:`, response.status, JSON.stringify(data).slice(0, 500));
        }

        if (!response) {
            return res.status(504).json({ error: 'AI_TIMEOUT' });
        }
        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        // Terapi sohbeti (meta gönderen tek akış) denetim için loglanır.
        // Yalnızca AI metni; kullanıcı turlarına dokunulmaz, çocuk adı maskelenir.
        // Serverless yanıttan sonra donabileceği için res'ten ÖNCE beklenir.
        const meta = req.body.meta;
        if (meta && Array.isArray(data?.candidates) && data.candidates.length) {
            const replyText = (data.candidates[0]?.content?.parts || [])
                .map(p => (p && p.text) || '').join(' ').trim();
            await logAiReply({
                actor,
                topic: meta.topic,
                level: meta.level,
                lang: meta.lang,
                reply: replyText,
                mask: meta.mask
            });
        }

        lap('log');
        console.log('chat timing', timings.join(' '));
        res.status(200).json(data);
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'SERVER_ERROR' });
    }
}
