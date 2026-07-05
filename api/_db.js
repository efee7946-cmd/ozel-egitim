// Paylaşılan PostgreSQL bağlantı havuzu — tüm API dosyaları buradan import eder.
// DATABASE_URL env var'ı Aiven bağlantı string'ini içermelidir.

import pg from 'pg';
const { Pool } = pg;

let _pool = null;

function getPool() {
    if (!_pool) {
        if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL tanımlı değil');
        // sslmode parametresini URL'den çıkar — SSL'i aşağıda direkt yapılandırıyoruz
        const connectionString = process.env.DATABASE_URL.replace(/([?&])sslmode=[^&]*/g, '$1').replace(/[?&]$/, '');
        // DATABASE_CA_CERT: Aiven konsolundan indirilen ca.pem içeriği.
        // Tanımlıysa sertifika doğrulanır; değilse eski davranışa düşülür
        // (rejectUnauthorized:false — bağlantı MITM'e açık kalır). Bu sadece
        // env var eksikse başvurulan bir yedek; asıl düzeltme Aiven
        // Console → servis → ca.pem'i indirip Vercel'e DATABASE_CA_CERT
        // olarak eklemek. Kod tarafından zorlanamaz çünkü sertifik
        // olmadan rejectUnauthorized:true bağlantıyı tamamen keser.
        if (!process.env.DATABASE_CA_CERT) {
            console.warn('UYARI: DATABASE_CA_CERT tanımlı değil — DB bağlantısı sertifika doğrulaması olmadan (rejectUnauthorized:false) kuruluyor. Aiven Console\'dan ca.pem indirip env var olarak eklemen önerilir.');
        }
        _pool = new Pool({
            connectionString,
            ssl: process.env.DATABASE_CA_CERT
                ? { rejectUnauthorized: true, ca: process.env.DATABASE_CA_CERT }
                : { rejectUnauthorized: false },
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
