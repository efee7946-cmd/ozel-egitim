// Have I Been Pwned — Pwned Passwords API. Ücretsiz, API key gerekmez,
// k-anonymity ile çalışır: şifrenin SHA-1 hash'inin yalnızca ilk 5 karakteri
// ağa gönderilir, şifrenin kendisi hiçbir zaman dışarı çıkmaz.

import crypto from 'crypto';

export async function isPasswordPwned(password) {
    try {
        const hash = crypto.createHash('sha1').update(password, 'utf8').digest('hex').toUpperCase();
        const prefix = hash.slice(0, 5);
        const suffix = hash.slice(5);
        const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
            signal: AbortSignal.timeout(3000),
        });
        if (!res.ok) return false; // API'ye erişilemiyorsa kaydı engelleme (fail open)
        const text = await res.text();
        return text.split('\n').some(line => line.split(':')[0].trim() === suffix);
    } catch {
        return false; // ağ hatası/timeout — kayıt engellenmesin
    }
}
