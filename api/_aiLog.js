// AI cevap denetim logu — chat.js yazar, admin.js okur/işaretler.
// KVKK kapsamı bilinçli dar: yalnızca AI metni + konu/seviye/dil + hesap.
// Çocuğun söyledikleri asla saklanmaz; çocuk adı kayıt öncesi maskelenir.
// Kayıtlar 30 gün sonra silinir (cleanupOldAiReplies, admin okumasında koşar).

import { query } from './_db.js';

let _ensured = false;

export async function ensureAiRepliesTable() {
    if (_ensured) return;
    await query(`CREATE TABLE IF NOT EXISTS ai_replies (
        id         BIGSERIAL PRIMARY KEY,
        actor      TEXT NOT NULL,
        topic      TEXT,
        level      TEXT,
        lang       TEXT,
        reply      TEXT NOT NULL,
        flagged    BOOLEAN DEFAULT false,
        flag_note  TEXT,
        created_at TIMESTAMPTZ DEFAULT now()
    )`);
    _ensured = true;
}

export async function cleanupOldAiReplies() {
    await query("DELETE FROM ai_replies WHERE created_at < now() - interval '30 days'");
}

export async function logAiReply({ actor, topic, level, lang, reply, mask }) {
    try {
        await ensureAiRepliesTable();
        let text = String(reply || '').slice(0, 2000);
        const name = String(mask || '').trim();
        if (name.length >= 2) {
            const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            text = text.replace(new RegExp(esc, 'gi'), '⭐');
        }
        if (!text.trim()) return;
        await query(
            'INSERT INTO ai_replies (actor, topic, level, lang, reply) VALUES ($1, $2, $3, $4, $5)',
            [
                String(actor || '').slice(0, 80),
                String(topic || '').slice(0, 30),
                String(level || '').slice(0, 20),
                String(lang || '').slice(0, 10),
                text
            ]
        );
    } catch (err) {
        console.warn('ai log failed:', err.message);
    }
}
