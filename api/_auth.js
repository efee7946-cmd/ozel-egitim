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

export async function sessionUsername(req) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
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
