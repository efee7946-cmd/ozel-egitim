// LMS Veri Katmanı
// Hassas veriler (öğrenci, BEP, IEP, beceri, davranış) AES-GCM ile şifrelenir.
// sessionStorage: hızlı sync okuma için plaintext cache (sekme kapanınca silinir).
// localStorage: şifreli kalıcı cache (offline destek).
// /api/data üzerinden Vercel KV ile cihazlar arası senkronizasyon.

const DB = (function () {
    const PFX = 'lms_';
    const PFX_S = 'lms_s_'; // sessionStorage prefix (plaintext)
    let _cloud = true;
    let _encKey = null; // AES-GCM CryptoKey, bellekte, diske yazılmaz

    // Şifreli saklanacak anahtarlar (KVKK md.6 özel nitelikli veri)
    const SENSITIVE = ['students', 'bep_profile_', 'iep_', 'skills_', 'behavior_', 'adaptive_', 'trials_'];
    function isSensitive(key) { return SENSITIVE.some(p => key.startsWith(p)); }

    /* ---------- Şifreleme ---------- */
    async function _deriveKey(token) {
        const enc = new TextEncoder();
        const km = await crypto.subtle.importKey(
            'raw', enc.encode(token), 'PBKDF2', false, ['deriveKey']
        );
        return crypto.subtle.deriveKey(
            { name: 'PBKDF2', salt: enc.encode('yldzSNF26'), iterations: 100000, hash: 'SHA-256' },
            km, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
        );
    }

    async function _encrypt(val) {
        if (!_encKey) return JSON.stringify(val);
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const ct = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv }, _encKey,
            new TextEncoder().encode(JSON.stringify(val))
        );
        const buf = new Uint8Array(12 + ct.byteLength);
        buf.set(iv);
        buf.set(new Uint8Array(ct), 12);
        return 'ENC1:' + btoa(String.fromCharCode(...buf));
    }

    async function _decrypt(raw) {
        if (!raw) return null;
        if (!raw.startsWith('ENC1:')) { try { return JSON.parse(raw); } catch { return null; } }
        if (!_encKey) return null;
        try {
            const buf = Uint8Array.from(atob(raw.slice(5)), c => c.charCodeAt(0));
            const pt = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: buf.slice(0, 12) }, _encKey, buf.slice(12)
            );
            return JSON.parse(new TextDecoder().decode(pt));
        } catch { return null; }
    }

    /* ---------- sessionStorage (plaintext hızlı cache) ---------- */
    function ssGet(key) {
        try { const r = sessionStorage.getItem(PFX_S + key); return r ? JSON.parse(r) : null; }
        catch { return null; }
    }
    function ssPut(key, val) {
        try { sessionStorage.setItem(PFX_S + key, JSON.stringify(val)); } catch {}
    }
    function ssDel(key) {
        try { sessionStorage.removeItem(PFX_S + key); } catch {}
    }

    /* ---------- localStorage ---------- */
    function lsGet(key) {
        try { const r = localStorage.getItem(PFX + key); return r || null; }
        catch { return null; }
    }
    async function lsGetDecrypted(key) {
        const raw = lsGet(key);
        if (!raw) return null;
        return _decrypt(raw);
    }
    async function lsPut(key, val) {
        try {
            const stored = isSensitive(key) ? await _encrypt(val) : JSON.stringify(val);
            localStorage.setItem(PFX + key, stored);
        } catch {}
    }
    function lsDel(key) {
        try { localStorage.removeItem(PFX + key); } catch {}
    }

    /* ---------- Cloud (Vercel KV) ---------- */
    async function cloudGet(key) {
        if (!_cloud) return null;
        try {
            const r = await fetch('/api/data?key=' + encodeURIComponent(key),
                { signal: AbortSignal.timeout(4000) });
            const d = await r.json();
            if (d.fallback) { _cloud = false; return null; }
            return d.value ?? null;
        } catch { _cloud = false; return null; }
    }
    function cloudPut(key, val) {
        if (!_cloud) return;
        fetch('/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key, value: val }),
            signal: AbortSignal.timeout(6000),
        }).catch(() => { _cloud = false; });
    }
    function cloudDel(key) {
        if (!_cloud) return;
        fetch('/api/data?key=' + encodeURIComponent(key), { method: 'DELETE' }).catch(() => {});
    }

    /* ---------- Public API ---------- */
    return {
        /**
         * Şifrelemeyi başlatır. Oturum açıldığında çağrılmalı.
         * Mevcut şifreli localStorage verilerini sessionStorage'a yükler.
         */
        async initEncryption(sessionToken) {
            if (!sessionToken || _encKey) return;
            try {
                _encKey = await _deriveKey(sessionToken);
                // Şifreli localStorage → sessionStorage (sync erişim için)
                for (const pfx of SENSITIVE) {
                    for (let i = 0; i < localStorage.length; i++) {
                        const full = localStorage.key(i);
                        if (!full || !full.startsWith(PFX)) continue;
                        const k = full.slice(PFX.length);
                        if (!k.startsWith(pfx)) continue;
                        const val = await lsGetDecrypted(k);
                        if (val !== null) ssPut(k, val);
                    }
                }
            } catch (e) {
                console.warn('Şifreleme başlatılamadı:', e);
                _encKey = null;
            }
        },

        /** Senkron okuma (render için). Hassas veri: sessionStorage'dan. */
        getSync(key) {
            if (isSensitive(key)) return ssGet(key);
            try { const r = localStorage.getItem(PFX + key); return r ? JSON.parse(r) : null; }
            catch { return null; }
        },

        /** Async okuma: önce (ss/)ls, yoksa cloud */
        async get(key) {
            if (isSensitive(key)) {
                const ss = ssGet(key);
                if (ss !== null) return ss;
                const ls = await lsGetDecrypted(key);
                if (ls !== null) { ssPut(key, ls); return ls; }
                const remote = await cloudGet(key);
                if (remote !== null) { ssPut(key, remote); lsPut(key, remote); }
                return remote;
            }
            try {
                const r = localStorage.getItem(PFX + key);
                const local = r ? JSON.parse(r) : null;
                if (local !== null) return local;
            } catch {}
            const remote = await cloudGet(key);
            if (remote !== null) {
                try { localStorage.setItem(PFX + key, JSON.stringify(remote)); } catch {}
            }
            return remote;
        },

        /** Yazar: anında (ss+ls), cloud'a arka planda */
        set(key, val) {
            if (isSensitive(key)) {
                ssPut(key, val);
                lsPut(key, val); // async, fire-and-forget
            } else {
                try { localStorage.setItem(PFX + key, JSON.stringify(val)); } catch {}
            }
            cloudPut(key, val);
        },

        del(key) {
            if (isSensitive(key)) ssDel(key);
            lsDel(key);
            cloudDel(key);
        },

        /** LS'deki tüm lms_ verilerini cloud'a yükler */
        pushAll() {
            if (!_cloud) return;
            for (let i = 0; i < localStorage.length; i++) {
                const full = localStorage.key(i);
                if (full && full.startsWith(PFX)) {
                    const k = full.slice(PFX.length);
                    // Hassas veri: cloud'a şifresiz gönder (cloud kendi güvenliği var)
                    if (isSensitive(k)) {
                        const ss = ssGet(k);
                        if (ss !== null) cloudPut(k, ss);
                    } else {
                        try {
                            const raw = localStorage.getItem(full);
                            if (raw) cloudPut(k, JSON.parse(raw));
                        } catch {}
                    }
                }
            }
        },

        isCloud() { return _cloud; },
    };
})();

window.DB = DB;
