// Paylaşılan PostgreSQL bağlantı havuzu — tüm API dosyaları buradan import eder.
// DATABASE_URL env var'ı Aiven bağlantı string'ini içermelidir.

import pg from 'pg';
const { Pool } = pg;

let _pool = null;

function getPool() {
    if (!_pool) {
        if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL tanımlı değil');
        _pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
            max: 3,
            idleTimeoutMillis: 20000,
        });
    }
    return _pool;
}

export async function query(sql, params = []) {
    const client = await getPool().connect();
    try {
        return (await client.query(sql, params)).rows;
    } finally {
        client.release();
    }
}
