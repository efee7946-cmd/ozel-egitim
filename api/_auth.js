// Ortak oturum doğrulama — token'lı uçlar (auth, data, chat, tts, photo, video) buradan import eder.
// Token'lar DB'de SHA-256 hash'iyle saklanır; tablo sızsa bile aktif oturumlar çalınamaz.
// Eski (düz metin) oturum kayıtları ilk kullanımda hash'e taşınır.

import crypto from 'crypto';
import { query } from './_db.js';

export function hashToken(token) {
    return crypto.createHash('sha256').update(String(token)).digest('hex');
}

export async function resolveToken(token) {
    if (!token) return null;
    const hashed = hashToken(token);
    const byHash = await query('SELECT 1 FROM sessions WHERE token = $1 AND expires_at > now()', [hashed]);
    if (byHash.length) return hashed;
    const legacy = await query('SELECT 1 FROM sessions WHERE token = $1 AND expires_at > now()', [token]);
    if (!legacy.length) return null;
    await query('UPDATE sessions SET token = $1 WHERE token = $2', [hashed, token]);
    return hashed;
}

export function bearerToken(req) {
    const header = req.headers.authorization || '';
    return header.startsWith('Bearer ') ? header.slice(7) : null;
}

export async function sessionUsername(req) {
    const token = bearerToken(req);
    const stored = await resolveToken(token);
    if (!stored) return null;
    const rows = await query(
        `SELECT s.username
         FROM sessions s
         JOIN users u ON u.username = s.username
         WHERE s.token = $1 AND s.expires_at > now() AND u.email_verified = true`,
        [stored]
    );
    return rows.length ? rows[0].username : null;
}

// Misafir cihaz kaydı: token guest_devices tablosunda hash'iyle durur.
// Tablo guest_start sırasında oluşturulur; yoksa misafir token'ı da yoktur.
export async function guestByToken(token) {
    if (!token || !String(token).startsWith('guest_')) return null;
    try {
        const rows = await query(
            'SELECT * FROM guest_devices WHERE token_hash = $1 AND token_expires > now()',
            [hashToken(token)]
        );
        return rows[0] || null;
    } catch {
        return null;
    }
}

const GUEST_CALL_COLUMNS = ['chat_calls', 'tts_calls', 'photo_calls', 'video_calls'];

// Misafirin toplam (saatlik değil, ömürlük) çağrı tavanı — sayaç cihaz
// kaydında tutulur, uygulama silinip yeniden kurulsa da sıfırlanmaz.
export async function guestCallAllowed(req, column, cap) {
    if (!GUEST_CALL_COLUMNS.includes(column)) return null;
    const token = bearerToken(req);
    const g = await guestByToken(token);
    if (!g) return null;
    if ((g[column] || 0) >= cap) return null;
    await query(
        `UPDATE guest_devices SET ${column} = ${column} + 1, last_seen = now() WHERE device_hash = $1`,
        [g.device_hash]
    );
    return 'guest:' + g.device_hash.slice(0, 16);
}
