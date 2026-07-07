import crypto from 'crypto';
import { query } from './_db.js';
import { checkRateLimit } from './_rateLimit.js';

function safeCompare(a, b) {
    const bufA = Buffer.from(String(a || ''));
    const bufB = Buffer.from(String(b || ''));
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
}

let _tableEnsured = false;
async function ensureTable() {
    if (_tableEnsured) return;
    await query(`CREATE TABLE IF NOT EXISTS client_errors (
        id         BIGSERIAL PRIMARY KEY,
        message    TEXT NOT NULL,
        stack      TEXT,
        screen     TEXT,
        user_agent TEXT,
        app_lang   TEXT,
        created_at TIMESTAMPTZ DEFAULT now()
    )`);
    _tableEnsured = true;
}

function clientIp(req) {
    const fwd = req.headers['x-forwarded-for'];
    if (fwd) return String(fwd).split(',')[0].trim();
    return req.socket?.remoteAddress || 'unknown';
}

function redactSecrets(value, maxLen) {
    let text = String(value || '');
    text = text
        .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[redacted-email]')
        .replace(/\b(?:demo_)?[a-f0-9]{32,128}\b/gi, '[redacted-token]')
        .replace(/(authorization["'\s:=]+bearer\s+)[^\s"'`]+/gi, '$1[redacted-token]')
        .replace(/(["']?(?:password|token|reset[_-]?code|verify[_-]?code)["']?\s*[:=]\s*["'])[^"']+/gi, '$1[redacted]');
    return text.slice(0, maxLen);
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        await ensureTable();

        if (req.method === 'POST') {
            if (!(await checkRateLimit('client_log:' + clientIp(req), 30))) {
                return res.json({ ok: true });
            }
            const { message, stack, screen, lang } = req.body || {};
            if (!message) return res.status(400).json({ error: 'message gerekli' });
            // Taşma koruması: uç kimliksiz olduğu için saatlik tavan var
            const recent = await query(
                "SELECT count(*)::int AS n FROM client_errors WHERE created_at > now() - interval '1 hour'"
            );
            if (recent[0].n >= 300) return res.json({ ok: true });
            await query(
                'INSERT INTO client_errors (message, stack, screen, user_agent, app_lang) VALUES ($1, $2, $3, $4, $5)',
                [
                    redactSecrets(message, 500),
                    redactSecrets(stack, 3000),
                    redactSecrets(screen, 100),
                    redactSecrets(req.headers['user-agent'] || '', 300),
                    redactSecrets(lang || '', 10)
                ]
            );
            return res.json({ ok: true });
        }

        if (req.method === 'GET') {
            const adminKey = process.env.ADMIN_KEY;
            // Sadece header uzerinden kabul edilir - query string tarayici
            // gecmisine, sunucu loglarina ve Referer header'ina sizabilir.
            const provided = req.headers['x-admin-key'];
            if (!adminKey || !provided || !safeCompare(provided, adminKey)) {
                return res.status(401).json({ error: 'Yetkisiz' });
            }
            await query("DELETE FROM client_errors WHERE created_at < now() - interval '30 days'");
            const rows = await query(
                'SELECT id, message, stack, screen, user_agent, app_lang, created_at FROM client_errors ORDER BY id DESC LIMIT 100'
            );
            return res.json({ errors: rows });
        }

        return res.status(405).json({ error: 'GET veya POST gerekli' });
    } catch (err) {
        console.error('Log error:', err);
        return res.status(500).json({ error: 'SERVER_ERROR' });
    }
}
