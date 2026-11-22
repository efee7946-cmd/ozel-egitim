// Hazır cevapların öğretmen incelemesi için HTML tablosu.
// Kullanım: node scripts/reply-review.mjs [çıktı.html] [tr|en]
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const load = f => { const module = { exports: {} }; vm.runInNewContext(fs.readFileSync(path.join(root, f), 'utf8'), { module }); return module.exports; };
const Engine = load('reply-engine.js');
const Data = load('therapy-replies.js');
const out = process.argv[2] || path.join(root, 'hazir-cevaplar-inceleme.html');
const lang = process.argv[3] === 'en' ? 'en' : 'tr';

const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const block = lang === 'en' ? script.slice(script.indexOf('\n  en: {')) : script.slice(0, script.indexOf('\n  en: {'));
const qText = {};
for (const m of block.matchAll(/^\s+((?:therapy|city|map)_[a-z_]+_q\d+):\s*(['"])((?:\\.|(?!\2).)*)\2/gm)) {
    if (!qText[m[1]]) qText[m[1]] = m[3].replace(/\\'/g, "'");
}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const words = intent => {
    const list = [];
    (intent.lex || []).forEach(n => list.push('<b>' + n + '</b>'));
    (intent.k || []).forEach(w => list.push(esc(w.split('|')[0].replace(/^=/, ''))));
    if (intent.name) list.push('<b>öğrencinin adı</b>');
    return list.join(', ');
};
const tryIt = (qid, text, level) => Engine.reply(Data, { qid, text, lang, level, rnd: () => 0, name: 'Ada' }).text;

const rows = Object.keys(Data.q).sort().map(qid => {
    const e = Data.q[qid][lang];
    const flags = [e.neg ? 'olumsuz cevap ayrı' : '', e.open ? 'her cevap kabul' : '', e.fb ? 'sabit geri dönüş' : ''].filter(Boolean).join(' · ');
    const groups = e.i.map(intent => `<li><div class="k">${words(intent)}${intent.min ? ` (en az ${intent.min})` : ''}</div>`
        + [].concat(intent.s).map(s => `<div class="s">${esc(s)} ${intent.e || ''}</div>`).join('')
        + (intent.w ? `<div class="w">Kelime düzeyi: ${[].concat(intent.w).map(esc).join(' / ')}</div>` : '')
        + (intent.f ? `<div class="f">Anlat bakalım: + ${esc(intent.f)}</div>` : '') + '</li>').join('');
    return `<tr id="${qid}"><td><div class="q">${esc(qText[qid] || qid)}</div><div class="id">${qid}</div>`
        + `<div class="m">Örnek: ${esc(e.m.s)} ${e.m.e}</div><div class="m">Daha basit: ${esc(e.simple)}</div>${flags ? `<div class="id">${flags}</div>` : ''}</td>`
        + `<td><ul>${groups}</ul></td>`
        + `<td><div class="s">${esc(tryIt(qid, lang === 'en' ? 'purple monkey' : 'mor maymun tabak', 'sentence'))}</div><div class="s">${esc(tryIt(qid, lang === 'en' ? "I don't know" : 'bilmiyorum', 'sentence'))}</div></td></tr>`;
}).join('\n');

const lexRows = Object.entries(Data.lex[lang]).map(([n, list]) =>
    `<tr id="lex-${n}"><td><b>${n}</b></td><td>${list.map(w => esc(w.split('|')[0].replace(/^=/, ''))).join(', ')}</td></tr>`).join('');

const g = Data.generic[lang];
const html = `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Hazır cevaplar</title><style>
body{font:15px/1.45 system-ui,sans-serif;margin:24px;color:#1b1b1f;background:#fff}h1{font-size:22px}h2{font-size:18px;margin-top:32px}
table{border-collapse:collapse;width:100%}td,th{border:1px solid #d8d8e0;padding:8px;vertical-align:top;text-align:left}th{background:#f3f3f7}
.q{font-weight:600}.id{color:#777;font-size:12px}.m{color:#444;font-size:13px;margin-top:4px}ul{margin:0;padding-left:18px}li{margin-bottom:6px}
.k{color:#555;font-size:12px}.s{margin:2px 0}.w,.f{color:#666;font-size:12px}td:first-child{width:28%}td:last-child{width:24%}
@media print{body{margin:8mm}tr{break-inside:avoid}}
</style></head><body>
<h1>Hazır cevaplar: inceleme tablosu</h1>
<p>Her satır bir soru. Orta sütundaki gruplar sırayla denenir; çocuğun cevabında gruptaki kelimelerden biri geçerse o gruptaki cümlelerden biri söylenir. <b>KALIN</b> adlar aşağıdaki sözlüklerdir. {W} çocuğun söylediği ve sözlükte tanınan kelimedir. Hiçbir grup tutmazsa örnek cevap söylenir (sağ sütun). Değişiklik önerilerini satırın soru kimliğiyle not edebilirsiniz.</p>
<p><b>Ortak cevaplar.</b> Tanınmayan cevap: “${esc(g.modelIntro[0])} …” · Küfür: “${esc(g.redirectIntro[0])} …” · Bilmiyorum: “${esc(g.dontKnow[0])} …” · Olumsuz: “${esc(g.negAck[0])}” · Duyulmadı: “${esc(g.notHeard[0])}” · Üçüncü cevaptan sonra: “${esc(g.nextHint[0])}”</p>
<table><tr><th>Soru</th><th>Cevap grupları</th><th>Tanınmayan cevap / “bilmiyorum”</th></tr>
${rows}
</table>
<h2>Sözlükler</h2><table>${lexRows}</table>
</body></html>`;
fs.writeFileSync(out, html);
console.log('Yazıldı:', out, Object.keys(Data.q).length, 'soru');
