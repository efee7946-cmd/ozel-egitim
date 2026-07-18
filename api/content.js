// Herkese açık içerik ucu — panelden yayınlanan konuşma pratiği sorularını döner.
// Auth yok (içerik hassas değil, misafirler de alır); yalnızca published=true
// olanlar iner, taslaklar panelde kalır. CDN cache: yayın ~5 dk içinde yayılır.

import { query } from './_db.js';
import { allowOrigin } from './_cors.js';

const CONTENT_KEY = '__global:content_questions';

export default async function handler(req, res) {
    allowOrigin(req, res);
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const rows = await query('SELECT value FROM app_data WHERE user_key = $1', [CONTENT_KEY]);
        let list = [];
        if (rows.length) {
            try { list = JSON.parse(rows[0].value) || []; } catch { list = []; }
        }
        const questions = (Array.isArray(list) ? list : [])
            .filter(q => q && q.published === true && q.topic && q.tr)
            .map(q => ({
                id: q.id,
                topic: q.topic,
                tr: q.tr,
                en: q.en || '',
                goalTr: q.goalTr || '',
                goalEn: q.goalEn || '',
                query: q.query || '',
            }));
        res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
        return res.json({ questions });
    } catch (err) {
        console.error('Content error:', err);
        return res.status(500).json({ error: 'SERVER_ERROR' });
    }
}
