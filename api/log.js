import { query } from './_db.js';

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

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        await ensureTable();

        if (req.method === 'POST') {
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
                    String(message).slice(0, 500),
                    String(stack || '').slice(0, 3000),
                    String(screen || '').slice(0, 100),
                    String(req.headers['user-agent'] || '').slice(0, 300),
                    String(lang || '').slice(0, 10)
                ]
            );
            return res.json({ ok: true });
        }

        if (req.method === 'GET') {
            const adminKey = process.env.ADMIN_KEY;
            const provided = req.headers['x-admin-key'] || req.query.key;
            if (!adminKey || provided !== adminKey) {
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
