// Hazır cevap motoru: konuşma pratiğinde Gemini'nin yerini alır.
// Hiçbir veri cihazdan çıkmaz. Cevaplar therapy-replies.js içindeki,
// insan tarafından yazılmış metinlerden seçilir; motor yeni cümle üretmez.
// Çocuğun söylediği hiçbir şey olduğu gibi tekrarlanmaz; yalnızca sözlükte
// tanınan kelimeler ({W}) ve kayıtlı öğrenci adı ({NAME}) cevaba girer.
(function (root) {
    'use strict';

    const FOLD = { 'ı': 'i', 'ş': 's', 'ç': 'c', 'ğ': 'g', 'ö': 'o', 'ü': 'u', 'â': 'a', 'î': 'i', 'û': 'u' };

    function lower(s, lang) {
        return String(s || '').toLocaleLowerCase(lang === 'en' ? 'en' : 'tr');
    }

    function fold(s) {
        return s.replace(/[ıişçğöüâîû]/g, c => FOLD[c] || c);
    }

    function tokenize(text, lang) {
        return lower(text, lang)
            .replace(/['’`]/g, '')
            .replace(/[^\p{L}\p{N}]+/gu, ' ')
            .trim()
            .split(/\s+/)
            .filter(Boolean);
    }

    function levenshtein(a, b) {
        if (a === b) return 0;
        if (!a.length) return b.length;
        if (!b.length) return a.length;
        let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
        for (let i = 1; i <= a.length; i++) {
            const cur = [i];
            for (let j = 1; j <= b.length; j++) {
                cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
            }
            prev = cur;
        }
        return prev[b.length];
    }

    // Bir sözlük kökü bir kelimeyle eşleşiyor mu? Kısa kökler (<=2 harf) tam
    // eşleşir; uzun kökler ek almış kelimeyi (peynir -> peyniri) ve ses tanıma
    // ya da telaffuz kaynaklı küçük hataları (pynir) kabul eder.
    // "=kök" yalnızca tam kelimeyle eşleşir (top, topu ama toplamak değil).
    // Yakın eşleşme yalnızca aynı harfle başlayan ve sık kullanılan bir fiil
    // olmayan kelimeye uygulanır ("severim" "şeker" sanılmasın).
    let _stop = [];
    function stemScore(stem, token) {
        if (stem.charAt(0) === '=') {
            const exact = stem.slice(1);
            return token === exact || fold(token) === fold(exact) ? 2 : 0;
        }
        if (stem.length <= 2) return token === stem ? 2 : 0;
        if (token.startsWith(stem)) return 2;
        const fs = fold(stem);
        const ft = fold(token);
        if (ft.startsWith(fs)) return 2;
        if (fs.length < 5 || ft.length < fs.length - 1 || fs[0] !== ft[0]) return 0;
        if (_stop.some(w => ft.startsWith(w))) return 0;
        const maxDist = fs.length >= 8 ? 2 : 1;
        for (let len = fs.length - 1; len <= fs.length + 1; len++) {
            if (len > ft.length) break;
            if (levenshtein(fs, ft.slice(0, len)) <= maxDist) return 1;
        }
        return 0;
    }
    function stemMatches(stem, token) { return stemScore(stem, token) > 0; }

    // Çok kelimeli kök ("diş fırça"): her parça sırayla bir kelimeyle eşleşmeli.
    // Döner: { score, at }; at, eşleşmenin cümledeki ilk kelimesinin sırası
    function phraseHit(phrase, tokens) {
        const parts = phrase.split(' ');
        let from = 0;
        let score = 2;
        let at = -1;
        for (const part of parts) {
            let found = -1;
            let best = 0;
            for (let i = from; i < tokens.length; i++) {
                const sc = stemScore(part, tokens[i]);
                if (sc > best) { best = sc; found = i; if (sc === 2) break; }
            }
            if (found < 0) return { score: 0, at: -1 };
            if (at < 0) at = found;
            score = Math.min(score, best);
            from = found + 1;
        }
        return { score, at, len: parts.length };
    }
    function phraseMatches(phrase, tokens) { return phraseHit(phrase, tokens).score > 0; }

    // Sözlük girdisi: "görünen|kök1|kök2". Görünen ad cevapta {W} olur.
    function parseEntry(entry, lang) {
        const raw = String(entry).split('|').map(p => p.trim()).filter(Boolean);
        const parts = raw.map(p => lower(p, lang));
        const display = raw[0].replace(/^=/, '');
        return { display, stems: parts.length > 1 ? parts.slice(1).concat(parts[0]) : parts };
    }

    const _parsedCache = new Map();
    const PROFANITY_INTENT = { lex: ['PROFANITY'] };
    const DONT_KNOW_INTENT = { lex: ['DONT_KNOW'] };
    function entriesFor(data, lang, intent) {
        const cacheKey = intent;
        let byLang = _parsedCache.get(cacheKey);
        if (byLang && byLang[lang]) return byLang[lang];
        const list = [];
        (intent.lex || []).forEach(name => {
            const words = (data.lex[lang] || {})[name];
            if (!words) throw new Error('Sözlük yok: ' + lang + '.' + name);
            words.forEach(w => list.push(parseEntry(w, lang)));
        });
        (intent.k || []).forEach(w => list.push(parseEntry(w, lang)));
        // Uzun kökler önce: "meyve suyu" "su"dan önce denensin
        const longest = e => Math.max(...e.stems.map(s => s.replace(/^=/, '').length));
        list.sort((a, b) => longest(b) - longest(a));
        if (!byLang) { byLang = {}; _parsedCache.set(cacheKey, byLang); }
        byLang[lang] = list;
        return list;
    }

    function findEntries(data, lang, intent, tokens) {
        _stop = ((data.negation || {})[lang] || {}).stop || [];
        // Önce tam eşleşenler; kendi içinde cümlede önce geçen önce
        // ("köfte patates" -> köfte). Aynı konumda uzun kök önce gelir.
        const hits = [];
        entriesFor(data, lang, intent).forEach((entry, order) => {
            let best = { score: 0, at: -1, len: 0 };
            for (const stem of entry.stems) {
                const h = phraseHit(stem, tokens);
                if (!h.score) continue;
                if (h.score > best.score || (h.score === best.score && (h.at < best.at || (h.at === best.at && h.len > best.len)))) best = h;
            }
            if (best.score) hits.push({ entry, score: best.score, at: best.at, len: best.len, order });
        });
        hits.sort((a, b) => (b.score - a.score) || (a.at - b.at) || (b.len - a.len) || (a.order - b.order));
        return hits.map(h => h.entry);
    }

    function findEntry(data, lang, intent, tokens) {
        return findEntries(data, lang, intent, tokens)[0] || null;
    }

    function isNegated(data, lang, tokens) {
        const neg = (data.negation || {})[lang];
        if (!neg) return false;
        const except = neg.except || [];
        return tokens.some(tok => !except.includes(tok) && (neg.words.includes(tok) || neg.endings.some(e => tok.length > e.length + 1 && tok.endsWith(e))));
    }

    function isEcho(tokens, questionText, lang) {
        if (tokens.length < 3) return false;
        const q = new Set(tokenize(questionText, lang));
        const inQ = tokens.filter(tok => q.has(tok)).length;
        return inQ / tokens.length >= 0.8;
    }

    function capFirst(s, lang) {
        if (!s) return s;
        return s.charAt(0).toLocaleUpperCase(lang === 'en' ? 'en' : 'tr') + s.slice(1);
    }

    function pick(list, avoid, rnd) {
        const arr = Array.isArray(list) ? list : [list];
        const fresh = arr.filter(x => !avoid.includes(x));
        const pool = fresh.length ? fresh : arr;
        return pool[Math.floor(rnd() * pool.length) % pool.length];
    }

    function fill(text, vars, lang) {
        return String(text)
            .replace(/\{Wc\}/g, capFirst(vars.W || '', lang))
            .replace(/\{W\}/g, vars.W || '')
            .replace(/\{NAME\}/g, vars.NAME || '')
            .replace(/\s+([,.!?])/g, '$1')
            .replace(/,\s*!/g, '!')
            .replace(/\s{2,}/g, ' ')
            .trim();
    }

    function compose(parts) {
        return parts.filter(Boolean).join(' ').replace(/\s{2,}/g, ' ').trim();
    }

    /**
     * @param {object} data   therapy-replies.js verisi
     * @param {object} opts   { qid, question, text, level: word|sentence|tell, lang, turn, name, avoid, rnd }
     * @returns {{ text: string, intent: string, used: string[] }}
     */
    function reply(data, opts) {
        const lang = opts.lang === 'en' ? 'en' : 'tr';
        const level = ['word', 'sentence', 'tell'].includes(opts.level) ? opts.level : 'sentence';
        const avoid = opts.avoid || [];
        const rnd = opts.rnd || Math.random;
        const used = [];
        const choose = (list) => { const x = pick(list, avoid, rnd); used.push(x); return x; };
        const g = data.generic[lang];
        const qEntry = (data.q[opts.qid] || {})[lang] || null;
        const tokens = tokenize(opts.text, lang);
        const firstName = String(opts.name || '').trim().split(/\s+/)[0] || '';
        const vars = { W: '', NAME: firstName };
        const nameTokens = firstName ? tokenize(firstName, lang) : [];

        const praise = () => choose(firstName && rnd() < 0.3 ? g.praiseNamed : g.praise, avoid, rnd);
        const model = qEntry ? qEntry.m : null;
        const emojiOf = obj => (obj && obj.e) || (model && model.e) || '🌟';

        const modelReply = (introList) => {
            if (!model) return compose([choose(g.fallbackPraise, avoid, rnd), '🌟']);
            const intro = choose(introList, avoid, rnd);
            if (level === 'word') return compose([intro, model.w, emojiOf(model)]);
            return compose([intro, model.s, emojiOf(model), level === 'tell' ? model.f : '']);
        };

        const withNextHint = (text) => (opts.turn >= 2 ? compose([text, choose(g.nextHint, avoid, rnd)]) : text);
        const done = (text, intent) => ({ text: withNextHint(fill(text, vars, lang)), intent, used });

        if (!tokens.length) return done(choose(g.notHeard, avoid, rnd), 'not_heard');

        if (findEntry(data, lang, PROFANITY_INTENT, tokens)) {
            return done(modelReply(g.redirectIntro), 'redirect');
        }

        if (qEntry) {
            for (const intent of qEntry.i || []) {
                let entry = null;
                if (intent.any) {
                    entry = { display: '' };
                } else if (intent.name) {
                    if (!nameTokens.length || !nameTokens.every(n => tokens.some(tok => stemMatches(n, tok)))) continue;
                    entry = { display: '' };
                } else {
                    if (intent.max && tokens.length > intent.max) continue;
                    const all = findEntries(data, lang, intent, tokens);
                    if (all.length < (intent.min || 1)) continue;
                    entry = all[0];
                }
                if (!entry) continue;
                vars.W = entry.display;
                if (qEntry.neg && !intent.negOk && isNegated(data, lang, tokens)) {
                    return done(compose([choose(g.negAck, avoid, rnd), level === 'tell' && model ? model.f : '']), 'negated');
                }
                const e = emojiOf(intent);
                if (level === 'word') {
                    const w = intent.w ? choose(intent.w, avoid, rnd) : (vars.W ? praise() + ', {W}!' : praise() + '!');
                    return done(compose([w, e]), intent.id || 'match');
                }
                const s = choose(intent.s, avoid, rnd);
                return done(compose([s, e, level === 'tell' ? (intent.f || (model && model.f) || '') : '']), intent.id || 'match');
            }
        }

        if (findEntry(data, lang, DONT_KNOW_INTENT, tokens)) {
            return done(compose([choose(g.dontKnow, avoid, rnd), modelReply(g.modelIntro)]), 'dont_know');
        }

        // Tercih ve açık uçlu sorularda tanınmayan olumsuz cevap kutlanmaz
        if (qEntry && (qEntry.neg || qEntry.open) && isNegated(data, lang, tokens)) {
            return done(compose([choose(g.negAck, avoid, rnd), level === 'tell' && model ? model.f : '']), 'negated');
        }

        if (qEntry && qEntry.fb) {
            const fb = qEntry.fb;
            const text = level === 'word' && fb.w ? choose(fb.w, avoid, rnd) : choose(fb.s, avoid, rnd);
            return done(compose([text, emojiOf(fb), level === 'tell' && model ? model.f : '']), 'fallback');
        }

        if (qEntry && qEntry.open) {
            return done(compose([choose(g.fallbackPraise, avoid, rnd), emojiOf(model), level === 'tell' && model ? model.f : '']), 'open');
        }

        const echo = opts.question && isEcho(tokens, opts.question, lang);
        return done(modelReply(echo ? g.echoIntro : g.modelIntro), echo ? 'echo' : 'model');
    }

    function simplify(data, qid, lang) {
        const qEntry = (data.q[qid] || {})[lang === 'en' ? 'en' : 'tr'];
        return qEntry && qEntry.simple ? qEntry.simple : null;
    }

    const api = { reply, simplify, tokenize, stemMatches, phraseMatches, levenshtein, findEntries };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.ReplyEngine = api;
})(typeof window !== 'undefined' ? window : this);
