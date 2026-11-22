// Çalıştır: node --test scripts/reply-engine.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
function load(file) {
    const module = { exports: {} };
    vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), { module, console });
    return module.exports;
}
const Engine = load('reply-engine.js');
const Data = load('therapy-replies.js');

// script.js içindeki soru anahtarları
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const qids = [...new Set([...script.matchAll(/^\s+((?:therapy|city|map)_[a-z_]+_q\d+):/gm)].map(m => m[1]))];

const fixed = () => 0;
const say = (qid, text, o = {}) => Engine.reply(Data, { qid, text, lang: 'tr', level: 'sentence', rnd: fixed, ...o });

test('her soru için iki dilde de cevap verisi var', () => {
    assert.equal(qids.length, 111, 'soru anahtarları bulunamadı: ' + qids.length);
    for (const id of qids) {
        for (const lang of ['tr', 'en']) {
            const e = (Data.q[id] || {})[lang];
            assert.ok(e, `${id}.${lang} yok`);
            assert.ok(e.m && e.m.w && e.m.s && e.m.e && e.m.f, `${id}.${lang} örnek cevap eksik`);
            assert.ok(e.simple, `${id}.${lang} simple yok`);
            assert.ok(Array.isArray(e.i) && e.i.length, `${id}.${lang} cevap grubu yok`);
            for (const intent of e.i) {
                assert.ok(intent.s && [].concat(intent.s).length, `${id}.${lang} boş s`);
                for (const name of intent.lex || []) assert.ok(Data.lex[lang][name], `${id}.${lang} sözlük yok: ${name}`);
            }
        }
    }
});

test('örnek cevap kendi sorusunda tanınır ve çıktıda yer tutucu kalmaz', () => {
    const misses = [];
    for (const id of qids) {
        for (const lang of ['tr', 'en']) {
            const m = Data.q[id][lang].m;
            for (const level of ['word', 'sentence', 'tell']) {
                for (const text of [m.w, m.s]) {
                    const r = Engine.reply(Data, { qid: id, text, lang, level, rnd: fixed, name: 'Ada' });
                    assert.ok(!/[{}]/.test(r.text), `${id}.${lang} yer tutucu kaldı: ${r.text}`);
                    assert.ok(r.text.length > 3, `${id}.${lang} boş cevap`);
                    if (level === 'sentence' && ['model', 'echo'].includes(r.intent)) misses.push(`${id}.${lang}: "${text}"`);
                }
            }
        }
    }
    // map_intro_q1 ad sorusu: örnekte ad yok, sabit geri dönüş kullanılır
    assert.deepEqual(misses, []);
});

test('ilgili cevaplar doğru gruba düşer (yazım hatası ve ekler dahil)', () => {
    assert.match(say('therapy_daily_life_q3', 'acıktım').text, /Acıktım/);
    assert.match(say('map_food_q1', 'makarnayı çok severim').text, /Makarna/);
    assert.match(say('map_food_q1', 'pynir').text, /Peynir/);
    assert.match(say('therapy_play_sports_q2', 'basketbolu').text, /Basketbol/);
    assert.match(say('city_market_q7', 'meyve suyu').text, /Meyve suyu/);
    assert.match(say('therapy_emotions_q5', 'babama söylerim').text, /Baban/);
    assert.match(say('map_dream_q1', 'polis olmak istiyorum').text, /Polis/);
    assert.match(say('map_hobby_q2', 'rafadan tayfa').text, /Rafadan Tayfa/);
    assert.match(say('map_intro_q1', 'benim adım ada', { name: 'Ada Yılmaz' }).text, /Ada/);
});

test('kısa kelimeler yanlış eşleşmez', () => {
    // "baba" ile "bana", "top" ile "topla" karışmamalı
    assert.notEqual(say('therapy_emotions_q5', 'bana').intent, 'match');
    assert.doesNotMatch(say('therapy_play_sports_q2', 'toplama yaparım').text, /Futbol/);
});

test('küfür model cevaba yönlendirilir, "sıkıldım" küfür sayılmaz', () => {
    const r = say('therapy_daily_life_q1', 'siktir git');
    assert.equal(r.intent, 'redirect');
    assert.doesNotMatch(r.text, /siktir/i);
    assert.notEqual(say('city_hospital_q7', 'sıkıldım').intent, 'redirect');
    assert.equal(say('city_hospital_q7', 'sıkıldım').intent, 'match');
    assert.notEqual(say('therapy_daily_life_q6', 'götürürüm').intent, 'redirect');
});

test('olumsuz cevap olumlu gibi kutlanmaz', () => {
    const r = say('map_food_q1', 'makarna sevmiyorum');
    assert.equal(r.intent, 'negated');
    assert.doesNotMatch(r.text, /lezzetli/);
    assert.equal(say('city_home_q8', 'tamam').intent, 'match');
    assert.notEqual(say('map_food_q1', 'tamam makarna').intent, 'negated');
});

test('bilmiyorum, boş ve tekrar edilen soru', () => {
    assert.equal(say('therapy_daily_life_q1', 'bilmiyorum').intent, 'dont_know');
    assert.equal(say('therapy_daily_life_q1', '   ').intent, 'not_heard');
    const r = Engine.reply(Data, { qid: 'therapy_daily_life_q2', question: 'Okula giderken yanına ne alırsın?', text: 'okula giderken yanına ne alırsın', lang: 'tr', rnd: fixed });
    assert.equal(r.intent, 'echo');
});

test('çocuğun tanınmayan sözü cevapta tekrarlanmaz', () => {
    const r = say('therapy_daily_life_q1', 'xyzzy plumbus');
    assert.doesNotMatch(r.text, /xyzzy|plumbus/);
    assert.equal(r.intent, 'model');
});

test('ikinci turdan sonra sıradaki soruya geçiş önerilir', () => {
    assert.match(say('therapy_daily_life_q3', 'acıktım', { turn: 2 }).text, /sıradaki|yeni bir soru/);
});

test('İngilizce', () => {
    const r = Engine.reply(Data, { qid: 'map_food_q1', text: 'I love pizza', lang: 'en', rnd: fixed });
    assert.match(r.text, /Pizza/);
    assert.equal(Engine.reply(Data, { qid: 'map_food_q1', text: "I don't like pizza", lang: 'en', rnd: fixed }).intent, 'negated');
});

const Report = load('report-text.js');
test('rapor metinleri boş, eksik veya dolu veriyle bozulmaz', () => {
    const full = {
        weekSessions: 4, weekMinutes: 40, weekMic: 6, weekTurns: 20,
        objResults: [{ items: 9, errors: 1 }, { items: 6, errors: 4 }, { items: 3, errors: 7 }],
        categories: [{ label: 'Duygular', turns: 10, simplify: 4, noResponse: 2 }, { label: 'Okul', turns: 8, simplify: 0, noResponse: 0 }]
    };
    for (const lang of ['tr', 'en']) {
        for (const name of ['', 'Ada']) {
            const texts = [
                Report.evaluation({}, lang, name),
                Report.evaluation(full, lang, name),
                Report.weekly({ sessions: 0, objPlays: 2, objItems: 3, objErrors: 5, topics: [] }, lang, name, 47).summary,
                Report.weekly({ sessions: 2, minutes: 12, turns: 9, mic: 2, topics: ['Okul'] }, lang, name, 3).tip,
                Report.bep({ history: [], metrics: {} }, lang, name),
                Report.bep({ categoryLabel: 'Destekli', behaviors: ['x'], history: [{ durationMin: 10, totalTurns: 5, micUsedInTherapy: 1 }, { durationMin: 10, totalTurns: 5, micUsedInTherapy: 1 }, { durationMin: 10, totalTurns: 5, micUsedInTherapy: 4 }, { durationMin: 8, totalTurns: 4, micUsedInTherapy: 1 }], metrics: { total: 20, indPct: 35, repPct: 40, simPct: 30, sessionCount: 4 }, hardest: 'Duygular', easiest: 'Okul' }, lang, name)
            ];
            for (const tx of texts) {
                assert.ok(tx && tx.length > 10);
                assert.doesNotMatch(tx, /undefined|NaN|null|\$\{/);
            }
        }
    }
    assert.match(Report.evaluation(full, 'tr', 'Ada'), /Duygular/);
    assert.match(Report.bep({ history: [], metrics: { total: 10, indPct: 70, repPct: 10, simPct: 5 } }, 'tr', 'Ada'), /%70/);
});
