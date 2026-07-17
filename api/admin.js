// Yönetim paneli okuma API'si — YıldızCan verisini çapraz kullanıcı okur.
// ADMIN_API_KEY ile korunur (x-admin-key header, log.js deseniyle aynı ama AYRI
// anahtar: log görüntüleme key'i sızsa bile PII açılmasın). Sunucudan sunucuya
// çağrılır (.NET paneli); anahtar tarayıcıya asla inmemeli.
//
// Yalnızca okuma (GET). Yazma/işaretleme v2'ye ait.
// Öğrenci rosteri ve adaptive verisi app_data'da ENC1 şifreli — _dataKey.js ile
// kullanıcının data_key'i çözülüp burada deşifre edilir. obj_results / speechmap /
// session_history / stars düz JSON, doğrudan okunur.

import crypto from 'crypto';
import { query } from './_db.js';
import { allowOrigin } from './_cors.js';
import { readDataKey, decryptAppData } from './_dataKey.js';

function cors(req, res) {
    allowOrigin(req, res);
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');
}

function safeCompare(a, b) {
    const bufA = Buffer.from(String(a || ''));
    const bufB = Buffer.from(String(b || ''));
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
}

function requireAdmin(req) {
    // /api/log'un ADMIN_KEY'inden ayrı: admin PII endpoint'i kendi anahtarını ister.
    // Ayarlı değilse fail-closed (401).
    const adminKey = process.env.ADMIN_API_KEY;
    // Sadece header — query string tarayıcı geçmişine/loglara/Referer'a sızabilir.
    const provided = req.headers['x-admin-key'];
    return !!adminKey && !!provided && safeCompare(provided, adminKey);
}

function clientIp(req) {
    const fwd = req.headers['x-forwarded-for'];
    if (fwd) return String(fwd).split(',')[0].trim();
    return req.socket?.remoteAddress || 'unknown';
}

// app_data.value daima JSON-encoded: hassas anahtarda "ENC1:..." string'i,
// düz anahtarda nesnenin JSON'ı.
function parseColumn(text) {
    if (text == null) return null;
    try { return JSON.parse(text); } catch { return text; }
}

async function readRaw(username, key) {
    const rows = await query('SELECT value FROM app_data WHERE user_key = $1', [`${username}:${key}`]);
    return rows.length ? parseColumn(rows[0].value) : null;
}

// Düz JSON anahtar: obj_results_, speechmap_, session_history_, stars_
async function readPlain(username, key) {
    return readRaw(username, key);
}

// Hassas anahtar: parseColumn ENC1 string'i verir → çöz. Eski düz metin
// kayıtları (nesne) olduğu gibi döner.
async function readSensitive(username, key, dataKey) {
    const v = await readRaw(username, key);
    if (typeof v === 'string') return decryptAppData(v, dataKey);
    return v;
}

async function listUsers() {
    return query('SELECT username, display_name, email, email_verified FROM users ORDER BY username');
}

async function getStudents(username) {
    const dataKey = await readDataKey(username);
    const arr = await readSensitive(username, 'students', dataKey);
    return Array.isArray(arr) ? arr : [];
}

function studentDto(username, s) {
    return {
        username,
        id: s.id,
        fullName: s.full_name ?? null,
        birthYear: s.birth_year ?? null,
        supportNotes: s.support_notes ?? null,
        createdAt: s.created_at ?? null,
        updatedAt: s.updated_at ?? null,
    };
}

function accuracyOf(items, errors) {
    const i = Number(items) || 0;
    const e = Number(errors) || 0;
    return i + e > 0 ? Math.round((i / (i + e)) * 100) : null;
}

// obj_results en yeni başta (unshift) tutulur.
function summarize(list) {
    const arr = Array.isArray(list) ? list : [];
    const items = arr.reduce((n, r) => n + (Number(r.items) || 0), 0);
    const errors = arr.reduce((n, r) => n + (Number(r.errors) || 0), 0);
    return {
        plays: arr.length,
        items,
        errors,
        accuracy: accuracyOf(items, errors),
        perfect: arr.filter(r => !(Number(r.errors) || 0)).length,
        lastPlayed: arr.length ? (arr[0].date ?? null) : null,
    };
}

export default async function handler(req, res) {
    cors(req, res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    if (!requireAdmin(req)) return res.status(401).json({ error: 'Yetkisiz' });

    const { resource, user, id } = req.query;
    console.log('[admin]', clientIp(req), resource || '-', user || '-', id || '-');
    res.setHeader('Cache-Control', 'no-store');

    try {
        if (resource === 'users') {
            const users = await listUsers();
            const out = [];
            for (const u of users) {
                const students = await getStudents(u.username);
                out.push({
                    username: u.username,
                    displayName: u.display_name,
                    email: u.email,
                    emailVerified: u.email_verified,
                    studentCount: students.length,
                });
            }
            return res.json({ users: out });
        }

        if (resource === 'students') {
            const usernames = user ? [user] : (await listUsers()).map(u => u.username);
            const students = [];
            for (const uname of usernames) {
                for (const s of await getStudents(uname)) students.push(studentDto(uname, s));
            }
            return res.json({ students });
        }

        if (resource === 'student') {
            if (!user || !id) return res.status(400).json({ error: 'user ve id gerekli' });
            const s = (await getStudents(user)).find(x => x.id === id);
            if (!s) return res.status(404).json({ error: 'NOT_FOUND' });
            const objResults = await readPlain(user, 'obj_results_' + id);
            return res.json({ student: studentDto(user, s), summary: summarize(objResults) });
        }

        if (resource === 'sessions') {
            if (!user || !id) return res.status(400).json({ error: 'user ve id gerekli' });
            const objResults = await readPlain(user, 'obj_results_' + id);
            const speechHistory = await readPlain(user, 'session_history_' + id);
            return res.json({
                objResults: (Array.isArray(objResults) ? objResults : []).map(r => ({
                    id: r.id,
                    date: r.date,
                    items: r.items,
                    errors: r.errors,
                    accuracy: accuracyOf(r.items, r.errors),
                })),
                speechHistory: Array.isArray(speechHistory) ? speechHistory : [],
            });
        }

        if (resource === 'stats') {
            if (!user || !id) return res.status(400).json({ error: 'user ve id gerekli' });
            const dataKey = await readDataKey(user);
            const objResults = await readPlain(user, 'obj_results_' + id);
            return res.json({
                summary: summarize(objResults),
                adaptive: (await readSensitive(user, 'adaptive_' + id, dataKey)) || null,
                speechMap: (await readPlain(user, 'speechmap_' + id)) || null,
                stars: (await readPlain(user, 'stars_' + id)) || null,
            });
        }

        return res.status(400).json({ error: 'Geçersiz resource', valid: ['users', 'students', 'student', 'sessions', 'stats'] });

    } catch (err) {
        console.error('Admin error:', err);
        return res.status(500).json({ error: 'SERVER_ERROR' });
    }
}
