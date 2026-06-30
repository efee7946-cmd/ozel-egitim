// LMS Veri Katmanı
// localStorage'a anında yazar (offline-capable, sıfır gecikme).
// /api/data üzerinden Vercel KV ile cihazlar arası senkronizasyon yapar.
// KV kurulmamışsa localStorage ile çalışmaya devam eder.

const DB = (function () {
    const PFX = 'lms_';
    let _cloud = true; // false olursa cloud denemeleri durdurulur

    /* ---------- localStorage ---------- */
    function lsGet(key) {
        try { const r = localStorage.getItem(PFX + key); return r ? JSON.parse(r) : null; }
        catch { return null; }
    }
    function lsPut(key, val) {
        try { localStorage.setItem(PFX + key, JSON.stringify(val)); } catch {}
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
    function cloudPut(key, val) { // fire-and-forget
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
        /** Senkron okuma (render için) */
        getSync(key) { return lsGet(key); },

        /** Async okuma: önce LS, yoksa cloud */
        async get(key) {
            const local = lsGet(key);
            if (local !== null) return local;
            const remote = await cloudGet(key);
            if (remote !== null) lsPut(key, remote);
            return remote;
        },

        /** Yazar: LS'ye anında, cloud'a arka planda */
        set(key, val) {
            lsPut(key, val);
            cloudPut(key, val);
        },

        del(key) {
            lsDel(key);
            cloudDel(key);
        },

        /** LS'deki tüm lms_ verilerini cloud'a yükler (ilk kurulum) */
        pushAll() {
            if (!_cloud) return;
            for (let i = 0; i < localStorage.length; i++) {
                const full = localStorage.key(i);
                if (full && full.startsWith(PFX)) {
                    const k = full.slice(PFX.length);
                    const v = lsGet(k);
                    if (v !== null) cloudPut(k, v);
                }
            }
        },

        isCloud() { return _cloud; },
    };
})();

window.DB = DB;
