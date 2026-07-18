// Yönetim paneli okuma API'si — YıldızCan verisini çapraz kullanıcı okur.
// ADMIN_API_KEY ile korunur (x-admin-key header, log.js deseniyle aynı ama AYRI
// anahtar: log görüntüleme key'i sızsa bile PII açılmasın). Sunucudan sunucuya
// çağrılır (.NET paneli); anahtar tarayıcıya asla inmemeli.
//
// Yalnızca okuma (GET). Yazma/işaretleme v2'ye ait.
// Anahtar haritası (app_data user_key = "<username>:<key>"):
//   teacher_students_<username>  roster (DÜZ JSON, zengin: full_name/birth_year/support_notes)
//   session_history_<username>   seans geçmişi (DÜZ, kullanıcı bazlı; öğrenciye student_id ile süzülür)
//   obj_results_<studentId>      nesne tanıma sonuçları (DÜZ)
//   speechmap_<studentId>, stars_<studentId>  (DÜZ)
//   adaptive_<studentId>, students_<username>  ENC1 şifreli — _dataKey.js ile data_key çözülüp deşifre edilir

import crypto from 'crypto';
import { query } from './_db.js';
import { allowOrigin } from './_cors.js';
import { readDataKey, decryptAppData } from './_dataKey.js';

function cors(req, res) {
    allowOrigin(req, res);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');
}

// Panelden yönetilen küresel soru havuzu. '__global' bir kullanıcı adı olamaz,
// bu yüzden gerçek kullanıcı verisiyle çakışmaz. Yayınlananlar /api/content'ten
// uygulamalara iner (taslaklar inmez).
const CONTENT_KEY = '__global:content_questions';
// Yerleşik (koda gömülü) soruların panel düzenlemeleri: "<topic>:<0-5>" ->
// { hidden?, tr?, en?, query? }. Uygulama seans kurarken uygular.
const OVERRIDES_KEY = '__global:content_overrides';
const TOPIC_KEYS = ['greetings', 'introduce', 'emotions', 'daily', 'school', 'food', 'hobbies', 'places', 'problem', 'dreams'];
const OVERRIDE_KEY_RE = new RegExp(`^(?:${TOPIC_KEYS.join('|')}):[0-5]$`);
const MAX_QUESTIONS = 200;

function cleanText(v, maxLen) {
    return String(v ?? '').trim().slice(0, maxLen);
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

// Kanonik roster teacher_students_<username>. 2026-07'den beri istemci ENC1
// şifreli yazar; eski kayıtlar düz JSON olabilir — readSensitive ikisini de okur.
async function getStudents(username) {
    const dataKey = await readDataKey(username);
    const rich = await readSensitive(username, 'teacher_students_' + username, dataKey);
    if (Array.isArray(rich) && rich.length) return rich;
    const norm = await readSensitive(username, 'students_' + username, dataKey);
    return Array.isArray(norm) ? norm : [];
}

function studentDto(username, s) {
    return {
        username,
        id: s.id,
        fullName: s.full_name ?? s.name ?? null,
        birthYear: s.birth_year ?? null,
        supportNotes: s.support_notes ?? null,
        createdAt: s.created_at ?? s.createdAt ?? null,
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

async function readContentList() {
    const rows = await query('SELECT value FROM app_data WHERE user_key = $1', [CONTENT_KEY]);
    if (!rows.length) return [];
    const list = parseColumn(rows[0].value);
    return Array.isArray(list) ? list : [];
}

async function writeGlobal(userKey, value) {
    await query(
        `INSERT INTO app_data (user_key, value, updated_at) VALUES ($1, $2, now())
         ON CONFLICT (user_key) DO UPDATE SET value = $2, updated_at = now()`,
        [userKey, JSON.stringify(value)]
    );
}

async function writeContentList(list) {
    await writeGlobal(CONTENT_KEY, list);
}

async function readOverrides() {
    const rows = await query('SELECT value FROM app_data WHERE user_key = $1', [OVERRIDES_KEY]);
    if (!rows.length) return {};
    const v = parseColumn(rows[0].value);
    return v && typeof v === 'object' && !Array.isArray(v) ? v : {};
}

async function handleContentPost(req, res) {
    const { action } = req.body || {};
    const list = await readContentList();

    if (action === 'upsert') {
        const q = req.body?.question || {};
        const topic = cleanText(q.topic, 30);
        const tr = cleanText(q.tr, 300);
        if (!TOPIC_KEYS.includes(topic)) return res.status(400).json({ error: 'GECERSIZ_TOPIC', valid: TOPIC_KEYS });
        if (!tr) return res.status(400).json({ error: 'TR_METIN_GEREKLI' });
        const entry = {
            id: cleanText(q.id, 40) || 'cq_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
            topic,
            tr,
            en: cleanText(q.en, 300),
            goalTr: cleanText(q.goalTr, 300),
            goalEn: cleanText(q.goalEn, 300),
            query: cleanText(q.query, 100),
        };
        const idx = list.findIndex(x => x.id === entry.id);
        if (idx >= 0) {
            list[idx] = { ...list[idx], ...entry, updatedAt: new Date().toISOString() };
        } else {
            if (list.length >= MAX_QUESTIONS) return res.status(400).json({ error: 'HAVUZ_DOLU', max: MAX_QUESTIONS });
            list.push({ ...entry, published: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
        }
        await writeContentList(list);
        return res.json({ ok: true, question: list[idx >= 0 ? idx : list.length - 1] });
    }

    if (action === 'publish') {
        const id = cleanText(req.body?.id, 40);
        const published = req.body?.published === true;
        const idx = list.findIndex(x => x.id === id);
        if (idx < 0) return res.status(404).json({ error: 'NOT_FOUND' });
        list[idx] = { ...list[idx], published, updatedAt: new Date().toISOString() };
        await writeContentList(list);
        return res.json({ ok: true, question: list[idx] });
    }

    if (action === 'delete') {
        const id = cleanText(req.body?.id, 40);
        const next = list.filter(x => x.id !== id);
        if (next.length === list.length) return res.status(404).json({ error: 'NOT_FOUND' });
        await writeContentList(next);
        return res.json({ ok: true });
    }

    if (action === 'override') {
        const key = cleanText(req.body?.key, 30);
        if (!OVERRIDE_KEY_RE.test(key)) return res.status(400).json({ error: 'GECERSIZ_KEY', format: '<topic>:<0-5>' });
        const o = {};
        if (req.body?.hidden === true) o.hidden = true;
        const tr = cleanText(req.body?.tr, 300);
        const en = cleanText(req.body?.en, 300);
        const q = cleanText(req.body?.query, 100);
        if (tr) o.tr = tr;
        if (en) o.en = en;
        if (q) o.query = q;
        if (!Object.keys(o).length) return res.status(400).json({ error: 'BOS_OVERRIDE' });
        const map = await readOverrides();
        map[key] = { ...o, updatedAt: new Date().toISOString() };
        await writeGlobal(OVERRIDES_KEY, map);
        return res.json({ ok: true, key, override: map[key] });
    }

    if (action === 'restore') {
        const key = cleanText(req.body?.key, 30);
        const map = await readOverrides();
        if (!map[key]) return res.status(404).json({ error: 'NOT_FOUND' });
        delete map[key];
        await writeGlobal(OVERRIDES_KEY, map);
        return res.json({ ok: true });
    }

    return res.status(400).json({ error: 'Gecersiz action', valid: ['upsert', 'publish', 'delete', 'override', 'restore'] });
}

export default async function handler(req, res) {
    cors(req, res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    if (!requireAdmin(req)) return res.status(401).json({ error: 'Yetkisiz' });

    const { resource, user, id } = req.query;
    console.log('[admin]', clientIp(req), req.method, resource || '-', user || '-', id || '-');
    res.setHeader('Cache-Control', 'no-store');

    try {
        if (req.method === 'POST') {
            if (resource !== 'content') return res.status(400).json({ error: 'POST yalnizca resource=content' });
            return await handleContentPost(req, res);
        }

        if (resource === 'content') {
            return res.json({ questions: await readContentList(), overrides: await readOverrides() });
        }

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
            // session_history kullanıcı bazlı ve artık şifreli olabilir; öğrenciye göre süz.
            const historyDataKey = await readDataKey(user);
            const historyAll = await readSensitive(user, 'session_history_' + user, historyDataKey);
            const speechHistory = (Array.isArray(historyAll) ? historyAll : [])
                .filter(h => h && h.student_id === id);
            return res.json({
                objResults: (Array.isArray(objResults) ? objResults : []).map(r => ({
                    id: r.id,
                    date: r.date,
                    items: r.items,
                    errors: r.errors,
                    accuracy: accuracyOf(r.items, r.errors),
                })),
                speechHistory,
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

        return res.status(400).json({ error: 'Geçersiz resource', valid: ['users', 'students', 'student', 'sessions', 'stats', 'content'] });

    } catch (err) {
        console.error('Admin error:', err);
        return res.status(500).json({ error: 'SERVER_ERROR' });
    }
}
