// Ortak data_key katmanı — auth.js (yazma/oturum) ve admin.js (okuma) buradan import eder.
//
// İki ayrı şifreleme var, karıştırma:
//  1. users.data_key sütunu: DATA_KEY_SECRET'tan türetilen KEK ile AES-GCM (dk1: öneki).
//     Tek başına DB sızıntısı app_data'yı çözmeye yetmesin diye. Env yoksa düz metin.
//  2. app_data ENC1: blobları: data_key'ten PBKDF2 ile türetilen anahtarla AES-GCM.
//     İstemci (db-client.js _deriveKey/_encrypt) ile birebir aynı şema — sunucunun
//     çözebilmesi bu dosyadaki deriveAppDataKey/decryptAppData ile sağlanır.

import crypto from 'crypto';
import { query } from './_db.js';

const DK_PREFIX = 'dk1:';
let _kekWarned = false;

export function dataKeyKek() {
    const secret = process.env.DATA_KEY_SECRET;
    if (!secret) {
        if (!_kekWarned) {
            _kekWarned = true;
            console.warn('UYARI: DATA_KEY_SECRET tanımlı değil — users.data_key düz metin saklanıyor. Güçlü bir rastgele değer üretip Vercel\'e eklemen önerilir.');
        }
        return null;
    }
    return crypto.createHash('sha256').update(secret).digest();
}

export function encryptDataKey(plain) {
    const kek = dataKeyKek();
    if (!kek) return plain;
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', kek, iv);
    const ct = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
    return DK_PREFIX + Buffer.concat([iv, ct, cipher.getAuthTag()]).toString('base64');
}

export function decryptDataKey(stored) {
    if (!stored || !stored.startsWith(DK_PREFIX)) return stored;
    const kek = dataKeyKek();
    if (!kek) throw new Error('data_key şifreli ama DATA_KEY_SECRET tanımlı değil');
    const buf = Buffer.from(stored.slice(DK_PREFIX.length), 'base64');
    const iv = buf.subarray(0, 12);
    const tag = buf.subarray(buf.length - 16);
    const ct = buf.subarray(12, buf.length - 16);
    const decipher = crypto.createDecipheriv('aes-256-gcm', kek, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(ct), decipher.final()]).toString('utf8');
}

// Yazma yolu (auth): kayıt yoksa üret, düz metinse şifreliye göç ettir.
export async function unwrapDataKey(username, stored) {
    if (!stored) {
        const dataKey = crypto.randomBytes(32).toString('hex');
        await query('UPDATE users SET data_key = $1 WHERE username = $2', [encryptDataKey(dataKey), username]);
        return dataKey;
    }
    const plain = decryptDataKey(stored);
    if (plain === stored && dataKeyKek()) {
        await query('UPDATE users SET data_key = $1 WHERE username = $2', [encryptDataKey(plain), username]);
    }
    return plain;
}

export async function ensureDataKey(username) {
    const rows = await query('SELECT data_key FROM users WHERE username = $1', [username]);
    return unwrapDataKey(username, rows[0]?.data_key);
}

// Okuma yolu (admin): yan etkisiz. Kayıt yoksa null döner (yeni anahtar üretmez).
export async function readDataKey(username) {
    const rows = await query('SELECT data_key FROM users WHERE username = $1', [username]);
    const stored = rows[0]?.data_key;
    if (!stored) return null;
    return decryptDataKey(stored);
}

// app_data ENC1: blobunun AES anahtarı — db-client.js _deriveKey ile birebir.
export function deriveAppDataKey(dataKey, legacySalt = false) {
    const salt = legacySalt
        ? Buffer.from('yldzSNF26')
        : crypto.createHash('sha256').update('yldzSNF26:' + dataKey).digest();
    return crypto.pbkdf2Sync(dataKey, salt, 100000, 32, 'sha256');
}

// 'ENC1:' + base64(iv[12] || ciphertext || tag[16]). ENC1 değilse düz JSON kabul edilir.
export function decryptAppData(raw, dataKey) {
    if (raw == null) return null;
    const text = String(raw);
    if (!text.startsWith('ENC1:')) { try { return JSON.parse(text); } catch { return null; } }
    if (!dataKey) return null;
    const buf = Buffer.from(text.slice(5), 'base64');
    const iv = buf.subarray(0, 12);
    const tag = buf.subarray(buf.length - 16);
    const ct = buf.subarray(12, buf.length - 16);
    for (const legacy of [false, true]) {
        try {
            const d = crypto.createDecipheriv('aes-256-gcm', deriveAppDataKey(dataKey, legacy), iv);
            d.setAuthTag(tag);
            return JSON.parse(Buffer.concat([d.update(ct), d.final()]).toString('utf8'));
        } catch { /* diğer salt'ı dene */ }
    }
    return null;
}
