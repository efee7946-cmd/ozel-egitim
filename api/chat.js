import { sessionUsername, guestCallAllowed } from './_auth.js';
import { checkRateLimit } from './_rateLimit.js';
import { allowOrigin } from './_cors.js';
import { logAiReply } from './_aiLog.js';

const GUEST_CHAT_CAP = 30;

const PRIMARY_MODEL = process.env.GEMINI_CHAT_MODEL || 'gemini-3.5-flash-lite';
const SECONDARY_MODEL = 'gemini-3.1-flash-lite';
const LAST_RESORT_MODEL = 'gemini-3.8-flash';

const THERAPY_CONFIG = { maxOutputTokens: 256, thinkingConfig: { thinkingLevel: 'minimal' } };
const REPORT_CONFIG = { thinkingConfig: { thinkingLevel: 'low' } };

async function callGemini(apiKey, model, body, signal) {
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            signal
        }
    );
    const data = await response.json();
    const hasText = (data?.candidates?.[0]?.content?.parts || []).some(p => p && p.text);
    return { model, response, data, ok: response.ok && hasText };
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
        const isTherapyChat = !!req.body.meta;
        const buildBody = (generationConfig) => {
            const body = { contents, generationConfig };
            if (system_instruction) body.system_instruction = system_instruction;
            return body;
        };
        const failures = [];
        const attempt = async (model, generationConfig, timeoutMs, cancel) => {
            const signal = cancel
                ? AbortSignal.any([cancel.signal, AbortSignal.timeout(timeoutMs)])
                : AbortSignal.timeout(timeoutMs);
            try {
                const result = await callGemini(GEMINI_KEY, model, buildBody(generationConfig), signal);
                lap(`${model}:${result.response.status}`);
                if (!result.ok) {
                    console.error(`Gemini ${model} hatasi:`, result.response.status, JSON.stringify(result.data).slice(0, 500));
                    failures.push(result);
                    throw new Error(model + ' failed');
                }
                return result;
            } catch (err) {
                if (err.name === 'AbortError' && cancel && cancel.signal.aborted) throw err;
                if (err.name === 'TimeoutError' || err.name === 'TypeError' || err.name === 'SyntaxError') {
                    lap(`${model}:${err.name}`);
                    console.error(`Gemini ${model} ulasilamadi:`, err.name, err.message);
                }
                throw err;
            }
        };

        let winner = null;
        if (isTherapyChat) {
            const cancel = new AbortController();
            try {
                winner = await Promise.any([
                    attempt(PRIMARY_MODEL, THERAPY_CONFIG, 12000, cancel),
                    attempt(SECONDARY_MODEL, THERAPY_CONFIG, 12000, cancel)
                ]);
            } catch (_) {}
            cancel.abort();
            if (!winner) {
                try { winner = await attempt(LAST_RESORT_MODEL, THERAPY_CONFIG, 5000); } catch (_) {}
            }
        } else {
            for (const [model, timeoutMs] of [[PRIMARY_MODEL, 20000], [SECONDARY_MODEL, 15000], [LAST_RESORT_MODEL, 15000]]) {
                try { winner = await attempt(model, REPORT_CONFIG, timeoutMs); break; } catch (_) {}
            }
        }

        const lastFailure = failures[failures.length - 1];
        const response = winner ? winner.response : (lastFailure ? lastFailure.response : null);
        const data = winner ? winner.data : (lastFailure ? lastFailure.data : null);

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
