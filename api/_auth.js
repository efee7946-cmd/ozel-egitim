// Ortak oturum doğrulama — token'lı uçlar (data, chat, tts, photo, video) buradan import eder.
// Bearer token'ı sessions tablosunda doğrular; e-posta doğrulanmışsa kullanıcı adını döner.

import { query } from './_db.js';

export async function sessionUsername(req) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return null;
    const rows = await query(
        `SELECT s.username
         FROM sessions s
         JOIN users u ON u.username = s.username
         WHERE s.token = $1 AND s.expires_at > now() AND u.email_verified = true`,
        [token]
    );
    return rows.length ? rows[0].username : null;
}
