// LMS Veri Katmanı
// Hassas veriler (öğrenci, BEP, IEP, beceri, davranış) AES-GCM ile şifrelenir —
// hem localStorage'da hem de /api/data üzerinden sunucuya giderken; app_data
// tablosu yalnızca opak şifreli metin içerir. Anahtar malzemesi (data_key)
// sunucuda üretilir ve users tablosunda DATA_KEY_SECRET ile şifrelenmiş olarak
// saklanır — yani bu uçtan uca şifreleme DEĞİLDİR: oturum açılışında sunucu
// data_key'i çözüp istemciye verir. Koruduğu şey: app_data'nın tek başına
// sızması (yedek, log vb.) ve DATA_KEY_SECRET olmadan tam DB sızıntısı.
// sessionStorage: hızlı sync okuma için plaintext cache (sekme kapanınca silinir).
// localStorage: şifreli kalıcı cache (offline destek).
// /api/data üzerinden Aiven PostgreSQL ile cihazlar arası senkronizasyon.

const DB = (function () {
    const PFX = 'lms_';
    const PFX_S = 'lms_s_'; // sessionStorage prefix (plaintext)
    const TS_KEY = 'lms__key_ts'; // anahtar başına son yazma zamanı (epoch ms)
    const CLOUD_RETRY_MS = 30000;
    let _cloud = true;
    let _cloudRetryTimer = null;
    let _lastSyncAt = null;
    let _encKey = null; // AES-GCM CryptoKey, bellekte, diske yazılmaz
    let _legacyEncKey = null; // eski sabit-salt anahtarı — sadece geriye dönük okuma için
    let _encKeyMaterial = null;

    function _cloudDown() {
        _cloud = false;
        if (_cloudRetryTimer) return;
        _cloudRetryTimer = setTimeout(() => {
            _cloudRetryTimer = null;
            _cloud = true;
        }, CLOUD_RETRY_MS);
    }

    function _tsMap() {
        try { return JSON.parse(localStorage.getItem(TS_KEY)) || {}; } catch { return {}; }
    }
    function _tsGet(key) { return _tsMap()[key] || 0; }
    function _tsSet(key, ms) {
        try {
            const m = _tsMap();
            m[key] = ms;
            localStorage.setItem(TS_KEY, JSON.stringify(m));
        } catch {}
    }

    // Şifreli saklanacak anahtarlar (KVKK md.6 özel nitelikli veri)
    const SENSITIVE = ['students', 'bep_profile_', 'iep_', 'skills_', 'behavior_', 'adaptive_', 'trials_'];
    function isSensitive(key) { return SENSITIVE.some(p => key.startsWith(p)); }

    function deepClone(val) {
        if (val === undefined) return undefined;
        try { return JSON.parse(JSON.stringify(val)); }
        catch { return val; }
    }

    function deepEqual(a, b) {
        try { return JSON.stringify(a) === JSON.stringify(b); }
        catch { return a === b; }
    }

    function uniqueList(values) {
        return Array.from(new Set((Array.isArray(values) ? values : []).filter(v => v !== undefined && v !== null)));
    }

    function mergeByIdentity(remote, local, identify, limit) {
        const order = [];
        const map = new Map();
        const add = (items, preferLocal) => {
            (Array.isArray(items) ? items : []).forEach(item => {
                const id = identify(item);
                if (!id) return;
                if (!map.has(id)) order.push(id);
                if (preferLocal || !map.has(id)) map.set(id, deepClone(item));
            });
        };
        add(remote, false);
        add(local, true);
        const merged = order.map(id => map.get(id)).filter(item => item !== undefined);
        return typeof limit === 'number' ? merged.slice(0, limit) : merged;
    }

    function sortByNewest(items, field) {
        return (Array.isArray(items) ? items : []).slice().sort((a, b) => {
            const aTs = Date.parse(a?.[field] || '') || 0;
            const bTs = Date.parse(b?.[field] || '') || 0;
            return bTs - aTs;
        });
    }

    function mergeFlatObject(base, remote, local) {
        const baseObj = base && typeof base === 'object' && !Array.isArray(base) ? base : {};
        const remoteObj = remote && typeof remote === 'object' && !Array.isArray(remote) ? remote : {};
        const localObj = local && typeof local === 'object' && !Array.isArray(local) ? local : {};
        const merged = { ...remoteObj };
        Object.keys(localObj).forEach(k => {
            const baseVal = baseObj[k];
            const remoteVal = remoteObj[k];
            const localVal = localObj[k];
            if (deepEqual(localVal, baseVal)) return;
            if (deepEqual(remoteVal, baseVal) || !deepEqual(remoteVal, localVal)) merged[k] = deepClone(localVal);
        });
        return merged;
    }

    function mergeStars(base, remote, local) {
        const baseState = base || {};
        const remoteState = remote || {};
        const localState = local || {};
        const totalDelta = Math.max(0, (localState.total || 0) - (baseState.total || 0));
        const spentDelta = Math.max(0, (localState.spent || 0) - (baseState.spent || 0));
        const addedOwned = (Array.isArray(localState.owned) ? localState.owned : [])
            .filter(id => !(Array.isArray(baseState.owned) ? baseState.owned : []).includes(id));
        const merged = {
            total: Math.max(0, (remoteState.total || 0) + totalDelta),
            spent: Math.max(0, (remoteState.spent || 0) + spentDelta),
            owned: uniqueList([...(remoteState.owned || []), ...addedOwned]),
            equipped: remoteState.equipped || null,
        };
        if (!merged.owned.includes(merged.equipped) && merged.equipped) merged.owned.push(merged.equipped);
        if (!deepEqual(localState.equipped || null, baseState.equipped || null)) merged.equipped = localState.equipped || null;
        if (merged.equipped && !merged.owned.includes(merged.equipped)) merged.owned.push(merged.equipped);
        return merged;
    }

    function mergeAdaptive(base, remote, local) {
        const baseState = base || {};
        const remoteState = remote || {};
        const localState = local || {};
        const mergedStats = deepClone(remoteState.categoryStats || {});
        const categories = uniqueList([
            ...Object.keys(localState.categoryStats || {}),
            ...Object.keys(baseState.categoryStats || {}),
            ...Object.keys(remoteState.categoryStats || {}),
        ]);
        categories.forEach(cat => {
            const baseCat = (baseState.categoryStats || {})[cat] || {};
            const remoteCat = (remoteState.categoryStats || {})[cat] || { turns: 0, simplify: 0, noResponse: 0 };
            const localCat = (localState.categoryStats || {})[cat] || {};
            const turnsDelta = Math.max(0, (localCat.turns || 0) - (baseCat.turns || 0));
            const simplifyDelta = Math.max(0, (localCat.simplify || 0) - (baseCat.simplify || 0));
            const noResponseDelta = Math.max(0, (localCat.noResponse || 0) - (baseCat.noResponse || 0));
            mergedStats[cat] = {
                turns: Math.max(0, (remoteCat.turns || 0) + turnsDelta),
                simplify: Math.max(0, (remoteCat.simplify || 0) + simplifyDelta),
                noResponse: Math.max(0, (remoteCat.noResponse || 0) + noResponseDelta),
            };
        });
        return {
            categoryStats: mergedStats,
            simplifyTotal: Math.max(0, (remoteState.simplifyTotal || 0) + Math.max(0, (localState.simplifyTotal || 0) - (baseState.simplifyTotal || 0))),
            totalTurns: Math.max(0, (remoteState.totalTurns || 0) + Math.max(0, (localState.totalTurns || 0) - (baseState.totalTurns || 0))),
            totalSessions: Math.max(0, (remoteState.totalSessions || 0) + Math.max(0, (localState.totalSessions || 0) - (baseState.totalSessions || 0))),
            updatedAt: localState.updatedAt || remoteState.updatedAt || new Date().toISOString(),
        };
    }

    function mergeKeyData(key, base, remote, local) {
        if (key.startsWith('session_history_')) {
            return sortByNewest(mergeByIdentity(remote, local, item => item && item.id), 'created_at').slice(0, 180);
        }
        if (key.startsWith('obj_results_')) {
            return sortByNewest(
                mergeByIdentity(remote, local, item => item && (item.id || `${item.date}|${item.items}|${item.errors || 0}`)),
                'date'
            ).slice(0, 100);
        }
        if (key.startsWith('behavior_')) {
            return sortByNewest(mergeByIdentity(remote, local, item => item && item.id), 'date').slice(0, 100);
        }
        if (key.startsWith('trials_')) {
            return sortByNewest(
                mergeByIdentity(remote, local, item => item && (item.id || `${item.goalId}|${item.date}|${(item.trials || []).length}|${item.notes || ''}`)),
                'date'
            );
        }
        if (key.startsWith('iep_')) {
            return mergeByIdentity(remote, local, item => item && item.id);
        }
        if (key.startsWith('skills_')) {
            return mergeFlatObject(base, remote, local);
        }
        if (key.startsWith('stars_')) {
            return mergeStars(base, remote, local);
        }
        if (key.startsWith('adaptive_')) {
            return mergeAdaptive(base, remote, local);
        }
        return deepClone(local);
    }

    function getLocalValue(key) {
        if (isSensitive(key)) return ssGet(key);
        try {
            const raw = localStorage.getItem(PFX + key);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }

    async function persistValue(key, val) {
        if (isSensitive(key)) {
            ssPut(key, val);
            await lsPut(key, val);
        } else {
            try { localStorage.setItem(PFX + key, JSON.stringify(val)); } catch {}
        }
        _tsSet(key, Date.now());
        await cloudPut(key, val);
    }

    // Cihaza özel anahtarlar — buluta asla gönderilmez (oturum güvenliği)
    const LOCAL_ONLY = ['auth_token', 'auth_user', 'auth_data_key', 'auth_email_verified'];
    function isLocalOnly(key) { return LOCAL_ONLY.includes(key); }

    function _apiToken() {
        try {
            const raw = localStorage.getItem(PFX + 'auth_token');
            const token = raw ? JSON.parse(raw) : null;
            if (!token || String(token).startsWith('demo_') || String(token).startsWith('guest_')) return null;
            return token;
        } catch { return null; }
    }

    /* ---------- Şifreleme ---------- */
    // useLegacySalt=false: token başına benzersiz salt (token'ın kendi
    // hash'inden türetilir — ekstra depolama gerekmez). useLegacySalt=true:
    // eski sabit salt — yalnızca daha önce o salt'la şifrelenmiş mevcut
    // verileri çözebilmek için tutuluyor (bkz. _decrypt).
    async function _deriveKey(token, useLegacySalt) {
        const enc = new TextEncoder();
        const km = await crypto.subtle.importKey(
            'raw', enc.encode(token), 'PBKDF2', false, ['deriveKey']
        );
        const salt = useLegacySalt
            ? enc.encode('yldzSNF26')
            : new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode('yldzSNF26:' + token)));
        return crypto.subtle.deriveKey(
            { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
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

    async function _decryptWithKey(key, buf) {
        const pt = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: buf.slice(0, 12) }, key, buf.slice(12)
        );
        return JSON.parse(new TextDecoder().decode(pt));
    }

    async function _decrypt(raw) {
        if (!raw) return null;
        if (!raw.startsWith('ENC1:')) { try { return JSON.parse(raw); } catch { return null; } }
        if (!_encKey) return null;
        const buf = Uint8Array.from(atob(raw.slice(5)), c => c.charCodeAt(0));
        try {
            return await _decryptWithKey(_encKey, buf);
        } catch {
            // Yeni (kullanıcıya özel salt) anahtarla çözülemedi — eski sabit
            // salt'la şifrelenmiş olabilir, onunla dene. Bir sonraki yazımda
            // otomatik olarak yeni anahtara göç eder.
            if (!_legacyEncKey) return null;
            try { return await _decryptWithKey(_legacyEncKey, buf); }
            catch { return null; }
        }
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

    /* ---------- Cloud ---------- */
    // Hassas anahtarlar sunucuya da AES-GCM ile şifreli gönderilir; sunucu
    // yalnızca opak bir metin görür. Eski (şifresiz) kayıtlar geriye dönük
    // uyumluluk için düz nesne olarak da kabul edilir (bir sonraki yazımda
    // otomatik şifrelenir).
    async function cloudFetch(key) {
        if (!_cloud || isLocalOnly(key)) return null;
        const token = _apiToken();
        if (!token) return null;
        try {
            const r = await fetch('/api/data?key=' + encodeURIComponent(key), {
                headers: { 'Authorization': 'Bearer ' + token },
                signal: AbortSignal.timeout(4000)
            });
            if (r.status === 401) return null;
            const d = await r.json();
            if (d.fallback) { _cloudDown(); return null; }
            _lastSyncAt = Date.now();
            const value = (isSensitive(key) && typeof d.value === 'string')
                ? await _decrypt(d.value)
                : (d.value ?? null);
            return { value, ts: d.updatedAt ? Date.parse(d.updatedAt) : 0 };
        } catch { _cloudDown(); return null; }
    }
    async function cloudGet(key) {
        const r = await cloudFetch(key);
        return r ? r.value : null;
    }
    async function cloudPut(key, val) {
        if (!_cloud || isLocalOnly(key)) return;
        const token = _apiToken();
        if (!token) return;
        const body = isSensitive(key) ? await _encrypt(val) : val;
        return fetch('/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify({ key, value: body }),
            signal: AbortSignal.timeout(6000),
        }).then(r => r.json()).then(d => {
            if (d && d.updatedAt) _tsSet(key, Date.parse(d.updatedAt));
            _lastSyncAt = Date.now();
        }).catch(() => { _cloudDown(); });
    }
    async function cloudPutBatch(items) {
        if (!_cloud || !Array.isArray(items) || !items.length) return;
        const token = _apiToken();
        if (!token) return;

        const payload = [];
        for (const item of items) {
            const key = item?.key;
            if (!key || isLocalOnly(key)) continue;
            const value = await (isSensitive(key) ? _encrypt(item.value) : Promise.resolve(item.value));
            payload.push({ key, value });
        }
        if (!payload.length) return;

        try {
            const r = await fetch('/api/data/batch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                body: JSON.stringify({ items: payload }),
                signal: AbortSignal.timeout(10000)
            });
            if (!r.ok) {
                if (r.status === 401) return;
                throw new Error('Batch write failed: ' + r.status);
            }
            const json = await r.json();
            _lastSyncAt = Date.now();
            for (const row of json) {
                if (row?.key && row.updatedAt) _tsSet(row.key, Date.parse(row.updatedAt));
            }
        } catch (_) {
            _cloudDown();
        }
    }
    function cloudDel(key) {
        if (!_cloud || isLocalOnly(key)) return;
        const token = _apiToken();
        if (!token) return;
        fetch('/api/data?key=' + encodeURIComponent(key), {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        }).catch(() => {});
    }

    /* ---------- Public API ---------- */
    return {
        /**
         * Şifrelemeyi başlatır. Oturum açıldığında çağrılmalı.
         * Mevcut şifreli localStorage verilerini sessionStorage'a yükler.
         */
        async initEncryption(sessionToken) {
            if (!sessionToken) return;
            if (_encKey && _encKeyMaterial === sessionToken) return;
            try {
                _encKey = null;
                _legacyEncKey = null;
                _encKeyMaterial = sessionToken;
                _encKey = await _deriveKey(sessionToken, false);
                _legacyEncKey = await _deriveKey(sessionToken, true);
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
        async set(key, val) {
            await persistValue(key, val);
        },

        async update(key, updater) {
            const base = deepClone(getLocalValue(key));
            const next = await updater(deepClone(base));
            const remote = await cloudFetch(key);
            const merged = remote ? mergeKeyData(key, base, remote.value, next) : next;
            await persistValue(key, merged);
            return merged;
        },

        del(key) {
            if (isSensitive(key)) ssDel(key);
            lsDel(key);
            cloudDel(key);
        },

        /** LS'deki tüm lms_ verilerini cloud'a yükler */
        async pushAll() {
            if (!_cloud) return;
            const items = [];
            for (let i = 0; i < localStorage.length; i++) {
                const full = localStorage.key(i);
                if (full && full.startsWith(PFX)) {
                    const k = full.slice(PFX.length);
                    if (!k || isLocalOnly(k)) continue;
                    if (isSensitive(k)) {
                        const ss = ssGet(k);
                        if (ss !== null) items.push({ key: k, value: ss });
                    } else {
                        try {
                            const raw = localStorage.getItem(full);
                            if (raw) items.push({ key: k, value: JSON.parse(raw) });
                        } catch {}
                    }
                }
            }
            if (items.length) await cloudPutBatch(items);
        },

        isCloud() { return _cloud; },

        lastSyncAt() { return _lastSyncAt; },

        /**
         * Cihazlar arası uzlaştırma: verilen anahtarlar için buluttaki
         * sürüm daha yeniyse yereli günceller, yerel daha yeniyse buluta yazar.
         * Değişen (buluttan güncellenen) anahtar listesini döndürür.
         */
        async refreshKeys(keys) {
            const changed = [];
            const writes = [];
            const SKEW_MS = 5000;
            const validKeys = Array.isArray(keys) ? keys.filter(k => typeof k === 'string' && k.trim()) : [];
            if (!validKeys.length) return changed;

            const token = _apiToken();
            if (!_cloud || !token) return changed;

            try {
                const r = await fetch('/api/data/batch', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify({ keys: validKeys }),
                    signal: AbortSignal.timeout(6000)
                });
                if (!r.ok) {
                    if (r.status === 401) return changed;
                    throw new Error('Batch fetch failed: ' + r.status);
                }

                const results = await r.json();
                _lastSyncAt = Date.now();

                for (const item of results) {
                    const key = item?.key;
                    if (!key) continue;
                    let remoteValue = item.value;
                    if (isSensitive(key) && typeof remoteValue === 'string') {
                        remoteValue = await _decrypt(remoteValue);
                    }
                    const remote = { value: remoteValue, ts: item.updatedAt ? Date.parse(item.updatedAt) : 0 };
                    if (!remote.value && remote.value !== null) continue;

                    const localTs = _tsGet(key);
                    const localVal = getLocalValue(key);

                    if (remote.value === null) {
                        if (localVal !== null) writes.push({ key, value: localVal });
                        continue;
                    }
                    if (localVal === null || remote.ts > localTs + SKEW_MS) {
                        if (isSensitive(key)) { ssPut(key, remote.value); lsPut(key, remote.value); }
                        else { try { localStorage.setItem(PFX + key, JSON.stringify(remote.value)); } catch {} }
                        _tsSet(key, remote.ts);
                        changed.push(key);
                    } else if (localTs > remote.ts + SKEW_MS) {
                        writes.push({ key, value: localVal });
                    }
                }
                if (writes.length) await cloudPutBatch(writes);
            } catch (err) {
                _cloudDown();
            }

            return changed;
        },
    };
})();

window.DB = DB;
