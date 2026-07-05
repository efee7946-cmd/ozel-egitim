// Maliyetli/istismara açık uçlar (chat, tts, video, photo, register) için
// saatlik sabit-pencere hız sınırlama — Aiven PostgreSQL üzerinde.
// auth.js'teki failed_logins/lock_until ile aynı desen: her istek atomik
// bir UPSERT ile sayılır, ayrı bir check+increment adımı olmadığı için
// yarış durumu (race condition) yaşanmaz.

import { query } from './_db.js';

let _tableEnsured = false;
async function ensureTable() {
    if (_tableEnsured) return;
    await query(`CREATE TABLE IF NOT EXISTS rate_limits (
        bucket_key   TEXT NOT NULL,
        window_start TIMESTAMPTZ NOT NULL,
        count        INT NOT NULL DEFAULT 0,
        PRIMARY KEY (bucket_key, window_start)
    )`);
    _tableEnsured = true;
}

let _lastCleanup = 0;
async function cleanupOld() {
    const now = Date.now();
    if (now - _lastCleanup < 10 * 60 * 1000) return; // en fazla 10 dakikada bir dene
    _lastCleanup = now;
    await query(`DELETE FROM rate_limits WHERE window_start < now() - interval '2 hours'`);
}

// bucketKey saatte en fazla maxPerHour kez geçebilir. true: devam edilebilir,
// false: limit aşılmış.
export async function checkRateLimit(bucketKey, maxPerHour) {
    await ensureTable();
    cleanupOld().catch(() => {});
    const windowStart = new Date();
    windowStart.setMinutes(0, 0, 0);
    const rows = await query(
        `INSERT INTO rate_limits (bucket_key, window_start, count)
         VALUES ($1, $2, 1)
         ON CONFLICT (bucket_key, window_start) DO UPDATE SET count = rate_limits.count + 1
         RETURNING count`,
        [bucketKey, windowStart]
    );
    return rows[0].count <= maxPerHour;
}
