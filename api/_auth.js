// Ortak oturum doğrulama — token'lı uçlar (data, chat, tts, photo, video) buradan import eder.
// Bearer token'ı sessions tablosunda doğrular; geçerliyse kullanıcı adını döner.

import { query } from './_db.js';

export async function sessionUsername(req) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return null;
    const rows = await query(
        'SELECT username FROM sessions WHERE token = $1 AND expires_at > now()',
        [token]
    );
    return rows.length ? rows[0].username : null;
}
