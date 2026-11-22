// Veli ve öğretmen metinleri: haftalık özet, rapor değerlendirmesi, BEP taslağı.
// Hepsi cihazda, kullanım verisinden kurallı olarak üretilir; tanı veya tıbbi
// yorum içermez. Sayılar uygulama içi kullanımı yansıtır.
(function (root) {
    'use strict';

    const pct = (a, b) => (b > 0 ? Math.round((a / b) * 100) : null);
    const pickBy = (list, seed) => list[Math.abs(seed) % list.length];

    function accuracyOf(results) {
        const list = (results || []).map(r => pct(r.items || 0, (r.items || 0) + (r.errors || 0))).filter(v => v !== null);
        if (!list.length) return null;
        const avg = Math.round(list.reduce((a, b) => a + b, 0) / list.length);
        // results en yeniden eskiye sıralı gelir
        const trend = list.length >= 3 ? list[0] - list[list.length - 1] : 0;
        return { avg, trend, count: list.length };
    }

    function categoryNeeds(cats) {
        const rows = (cats || []).filter(c => c.turns > 0).map(c => ({
            label: c.label, turns: c.turns, sim: pct(c.simplify || 0, c.turns), nr: pct(c.noResponse || 0, c.turns)
        }));
        if (!rows.length) return null;
        const bySupport = rows.slice().sort((a, b) => (b.sim + b.nr) - (a.sim + a.nr));
        return { rows, hardest: bySupport[0], easiest: bySupport[bySupport.length - 1] };
    }

    /* ---------------- Haftalık özet ---------------- */
    const TIPS = {
        tr: {
            mic: ['Bu hafta yemekte çocuğunuza iki seçenek sunun ("Su mu, ayran mı?") ve cevabını sesli söylemesini bekleyin.',
                'Akşam birlikte bir resme bakıp "Burada ne var?" diye sorun; tek kelimelik cevabı bile coşkuyla karşılayın.'],
            obj: ['Evde 5 nesne seçin (kaşık, top, ayakkabı...). Gün içinde birini gösterip adını söylemesini isteyin.',
                'Market alışverişinde gördüğünüz 3 meyvenin adını birlikte söyleyin.'],
            few: ['Her gün aynı saatte 5 dakikalık kısa bir pratik, uzun ama seyrek oturumlardan daha etkilidir.',
                'Pratiği bir günlük rutine bağlayın (örneğin kahvaltıdan sonra), böylece alışkanlık olur.'],
            general: ['Gün sonunda "Bugün en çok ne hoşuna gitti?" diye sorun ve cevabını genişleterek tekrar edin.',
                'Bir oyun sırasında sıra almayı çalışın: "Şimdi sıra sende, sonra bende."',
                'Evden çıkarken birlikte "Hoşça kal" deyin; selamlaşmayı günlük rutine katın.',
                'Bir hikâye kitabındaki resimleri birlikte anlatın; her sayfada bir cümle kurmasını teşvik edin.']
        },
        en: {
            mic: ['At meals this week, offer two choices ("Water or juice?") and wait for your child to say the answer aloud.',
                'Look at a picture together in the evening and ask "What is here?"; celebrate even a one-word answer.'],
            obj: ['Pick 5 objects at home (spoon, ball, shoe...). During the day, point to one and ask your child to name it.',
                'At the store, name 3 fruits you see together.'],
            few: ['A 5-minute practice at the same time every day works better than long but rare sessions.',
                'Tie practice to a daily routine (for example after breakfast) so it becomes a habit.'],
            general: ['At the end of the day ask "What did you like most today?" and repeat the answer back in a longer sentence.',
                'Practice turn-taking during a game: "Now your turn, then mine."',
                'Say "Goodbye" together when leaving home; make greetings part of the daily routine.',
                'Tell the pictures of a story book together; encourage one sentence per page.']
        }
    };

    function weekly(d, lang, name, weekNo) {
        const en = lang === 'en';
        const who = name || (en ? 'Your child' : 'Çocuğunuz');
        const micShare = pct(d.mic || 0, d.turns || 0);
        const acc = pct(d.objItems || 0, (d.objItems || 0) + (d.objErrors || 0));
        const parts = [];
        if (d.sessions) {
            parts.push(en
                ? `${who} completed ${d.sessions} speech session${d.sessions > 1 ? 's' : ''} this week (${d.minutes || 0} min) and gave ${d.turns || 0} answers.`
                : `${who} bu hafta ${d.sessions} konuşma seansı tamamladı (${d.minutes || 0} dk) ve ${d.turns || 0} yanıt verdi.`);
            if (micShare !== null && d.turns) {
                parts.push(micShare >= 60
                    ? (en ? `Most answers (${micShare}%) were spoken aloud.` : `Yanıtların çoğunu (%${micShare}) sesli verdi.`)
                    : (en ? `${micShare}% of answers were spoken aloud; the rest used picture cards.` : `Yanıtların %${micShare} kadarını sesli verdi, kalanında resim kartlarını kullandı.`));
            }
        }
        if (d.objPlays) {
            parts.push(en
                ? `The object game was played ${d.objPlays} time${d.objPlays > 1 ? 's' : ''}${acc !== null ? ` with ${acc}% accuracy` : ''}.`
                : `Nesne oyununu ${d.objPlays} kez oynadı${acc !== null ? `, doğruluk %${acc}` : ''}.`);
        }
        if (d.topics && d.topics.length) {
            parts.push(en ? `Topics: ${d.topics.join(', ')}.` : `Çalışılan konular: ${d.topics.join(', ')}.`);
        }
        const bank = TIPS[en ? 'en' : 'tr'];
        let pool = bank.general;
        if (d.sessions && d.sessions < 3) pool = bank.few;
        else if (micShare !== null && d.turns >= 3 && micShare < 50) pool = bank.mic;
        else if (acc !== null && acc < 70) pool = bank.obj;
        return { summary: parts.join(' '), tip: pickBy(pool, weekNo || 0) };
    }

    /* ---------------- Rapor değerlendirmesi ---------------- */
    function evaluation(x, lang, name) {
        const en = lang === 'en';
        const who = name || (en ? 'Your child' : 'Çocuğunuz');
        const paras = [];

        // 1) Katılım
        const s = x.weekSessions || 0;
        if (en) {
            paras.push(s === 0
                ? `There are no saved sessions from the last 7 days yet; this evaluation is based on today's activity.`
                : `${who} practised ${s} time${s > 1 ? 's' : ''} in the last 7 days, for a total of ${x.weekMinutes || 0} minutes and ${x.weekTurns || 0} answers. `
                  + (s >= 5 ? 'This is a very regular rhythm, and regularity is one of the strongest supports for progress.'
                      : s >= 3 ? 'This is a regular rhythm; keeping it steady will help skills settle.'
                          : 'This is a good start; short daily practice can make it more regular.'));
        } else {
            paras.push(s === 0
                ? `Son 7 güne ait kayıtlı seans henüz yok; bu değerlendirme bugünkü kullanıma dayanıyor.`
                : `${who} son 7 günde ${s} kez çalıştı; toplam ${x.weekMinutes || 0} dakika ve ${x.weekTurns || 0} yanıt. `
                  + (s >= 5 ? 'Bu çok düzenli bir tempo; düzenlilik gelişimin en güçlü destekçilerinden biridir.'
                      : s >= 3 ? 'Bu düzenli bir tempo; böyle sürmesi becerilerin yerleşmesine yardım eder.'
                          : 'Bu iyi bir başlangıç; her gün kısa bir pratikle daha düzenli hale getirilebilir.'));
        }

        // 2) Oyun sonuçları
        const acc = accuracyOf(x.objResults);
        if (acc) {
            const trendTxt = acc.trend >= 10 ? (en ? ' Recent games show a clear improvement.' : ' Son oyunlarda belirgin bir artış var.')
                : acc.trend <= -10 ? (en ? ' Recent games were a bit harder; shorter rounds may help.' : ' Son oyunlar biraz daha zorlayıcı geçti; daha kısa turlar yardımcı olabilir.') : '';
            paras.push(en
                ? `In the object recognition game, average accuracy over the last ${acc.count} games was ${acc.avg}%. `
                  + (acc.avg >= 85 ? 'Naming and matching familiar objects is a strength.' : acc.avg >= 60 ? 'Object naming is developing steadily.' : 'Object naming still benefits from support; practising with real objects at home can help.') + trendTxt
                : `Nesne tanıma oyununda son ${acc.count} oyunun ortalama doğruluğu %${acc.avg}. `
                  + (acc.avg >= 85 ? 'Tanıdık nesneleri adlandırma ve eşleştirme güçlü bir alan.' : acc.avg >= 60 ? 'Nesne adlandırma düzenli olarak gelişiyor.' : 'Nesne adlandırmada destek hâlâ faydalı; evde gerçek nesnelerle çalışmak yardımcı olabilir.') + trendTxt);
        }

        // 3) Konuşma ve iletişim
        const micShare = pct(x.weekMic || 0, x.weekTurns || 0);
        const needs = categoryNeeds(x.categories);
        let comm = '';
        if (micShare !== null && x.weekTurns) {
            comm += en
                ? (micShare >= 70 ? `Most answers (${micShare}%) were given independently by voice. ` : micShare >= 40 ? `About ${micShare}% of answers were spoken; picture cards supported the rest. ` : `Answers relied mostly on picture cards (${100 - micShare}%); this is a valuable bridge toward spoken answers. `)
                : (micShare >= 70 ? `Yanıtların çoğu (%${micShare}) bağımsız olarak sesli verildi. ` : micShare >= 40 ? `Yanıtların yaklaşık %${micShare} kadarı sesli verildi, kalanında resim kartları destek oldu. ` : `Yanıtlarda ağırlıklı olarak resim kartları kullanıldı (%${100 - micShare}); bu, sesli yanıta giden değerli bir köprüdür. `);
        }
        if (needs && needs.rows.length > 1) {
            comm += en
                ? `The topic needing the most support was "${needs.hardest.label}" (simplified ${needs.hardest.sim}%, no answer ${needs.hardest.nr}%); the most comfortable one was "${needs.easiest.label}".`
                : `En çok destek gereken konu "${needs.hardest.label}" oldu (basitleştirme %${needs.hardest.sim}, yanıtsız %${needs.hardest.nr}); en rahat olduğu konu "${needs.easiest.label}".`;
        }
        if (comm) paras.push(comm.trim());

        // 4) Öneri ve kapanış
        const sugg = [];
        if (needs && needs.hardest && (needs.hardest.sim + needs.hardest.nr) >= 30) {
            sugg.push(en ? `Bring the "${needs.hardest.label}" theme into daily life with short, playful questions.` : `"${needs.hardest.label}" temasını gün içinde kısa ve oyunlu sorularla gündelik hayata taşıyabilirsiniz.`);
        }
        if (micShare !== null && x.weekTurns && micShare < 50) {
            sugg.push(en ? 'Offer two-choice questions and give a few seconds of waiting time for a spoken answer.' : 'İki seçenekli sorular sorup sesli yanıt için birkaç saniye bekleme süresi tanıyın.');
        }
        if (s < 3) sugg.push(en ? 'A short practice at the same time each day can build a helpful routine.' : 'Her gün aynı saatte yapılan kısa bir pratik faydalı bir rutin oluşturur.');
        if (!sugg.length) sugg.push(en ? 'Keep the current rhythm and slightly increase the level when answers feel easy.' : 'Mevcut tempoyu koruyun; yanıtlar kolay gelmeye başladığında seviyeyi biraz artırabilirsiniz.');
        paras.push(sugg.join(' ') + (en ? ' Every small step counts; thank you for your support.' : ' Atılan her küçük adım değerli; desteğiniz için teşekkürler.'));
        return paras.join('\n\n');
    }

    /* ---------------- BEP taslağı ---------------- */
    function bep(x, lang, name) {
        const en = lang === 'en';
        const who = name || (en ? 'The student' : 'Öğrenci');
        const m = x.metrics || {};
        const hist = x.history || [];
        const L = [];
        L.push(en ? '📝 IEP Periodic Progress Draft' : '📝 BEP Dönemsel Gelişim Taslağı');
        L.push('');
        L.push(en ? '1) Student level and observation summary' : '1) Öğrenci kademesi ve gözlem özeti');
        L.push(en ? `Support level: ${x.categoryLabel || 'Not specified'}.` : `Destek düzeyi: ${x.categoryLabel || 'Belirtilmemiş'}.`);
        if (x.behaviors && x.behaviors.length) L.push((en ? 'Noted by the family/teacher: ' : 'Aile/öğretmen tarafından belirtilen: ') + x.behaviors.join('; ') + '.');
        const totalMin = hist.reduce((a, h) => a + (h.durationMin || 0), 0);
        const totalTurns = hist.reduce((a, h) => a + (h.totalTurns || 0), 0);
        L.push(hist.length
            ? (en ? `${who} took part in ${hist.length} recorded sessions (${totalMin} min, ${totalTurns} answers) in community-life themes such as home, school, market, park and hospital.`
                : `${who} ev, okul, market, park ve hastane gibi toplumsal yaşam temalarında ${hist.length} kayıtlı seansa katıldı (${totalMin} dk, ${totalTurns} yanıt).`)
            : (en ? 'No recorded sessions yet.' : 'Henüz kayıtlı seans yok.'));
        L.push('');
        L.push(en ? '2) Communication independence' : '2) İletişim bağımsızlığı gelişimi');
        if (m.total > 0) {
            L.push(en ? `Independent spoken answers: ${m.indPct}%. Need to hear the question again: ${m.repPct}%. Need for simplified language: ${m.simPct}%.`
                : `Bağımsız sesli yanıt: %${m.indPct}. Soruyu tekrar dinleme ihtiyacı: %${m.repPct}. Dil basitleştirme ihtiyacı: %${m.simPct}.`);
            L.push(m.indPct >= 60
                ? (en ? 'The student initiates spoken answers in most interactions.' : 'Öğrenci etkileşimlerin çoğunda sesli yanıtı kendisi başlatıyor.')
                : m.indPct >= 30
                    ? (en ? 'The student answers by voice in part of the interactions and uses picture cards as support in the rest.' : 'Öğrenci etkileşimlerin bir bölümünde sesli yanıt veriyor, kalanında resim kartlarını destek olarak kullanıyor.')
                    : (en ? 'The student currently relies mainly on picture cards; spoken answers are emerging.' : 'Öğrenci şu an ağırlıklı olarak resim kartlarıyla yanıt veriyor; sesli yanıtlar yeni ortaya çıkıyor.'));
        } else {
            L.push(en ? 'Metric data has not been collected yet.' : 'Metrik verisi henüz toplanmadı.');
        }
        const recent = hist.slice(0, 3);
        const older = hist.slice(3, 6);
        const rate = list => { const t = list.reduce((a, h) => a + (h.totalTurns || 0), 0); return t ? pct(list.reduce((a, h) => a + (h.micUsedInTherapy || 0), 0), t) : null; };
        const rNew = rate(recent);
        const rOld = rate(older);
        if (rNew !== null && rOld !== null) {
            L.push(en ? `Spoken answers were ${rOld}% in earlier sessions and ${rNew}% in the latest three.` : `Önceki seanslarda sesli yanıt oranı %${rOld}, son üç seansta %${rNew}.`);
        }
        L.push('');
        L.push(en ? '3) Observed strengths' : '3) Gözlemlenen güçlü yönler');
        const strengths = [];
        if (hist.length >= 3) strengths.push(en ? 'takes part in sessions regularly' : 'seanslara düzenli katılım gösteriyor');
        if (m.total > 0 && m.indPct >= 50) strengths.push(en ? 'answers independently by voice' : 'sesli ve bağımsız yanıt verebiliyor');
        if (m.total > 0 && m.repPct <= 20) strengths.push(en ? 'usually follows the question on first hearing' : 'soruyu çoğunlukla ilk dinleyişte takip ediyor');
        if (x.easiest) strengths.push(en ? `is most comfortable in the "${x.easiest}" theme` : `"${x.easiest}" temasında en rahat`);
        if (!strengths.length) strengths.push(en ? 'participates in the activities with support' : 'etkinliklere destekle katılıyor');
        strengths.forEach(sx => L.push('• ' + sx.charAt(0).toLocaleUpperCase(en ? 'en' : 'tr') + sx.slice(1) + '.'));
        L.push('');
        L.push(en ? '4) Recommendations for the next period' : '4) Sonraki dönem önerileri');
        const recs = [];
        if (m.total > 0 && m.indPct < 50) recs.push(en ? 'Increase spoken answers gradually using two-choice questions and waiting time.' : 'İki seçenekli sorular ve bekleme süresiyle sesli yanıt oranını kademeli olarak artırmak.');
        if (m.total > 0 && m.simPct >= 30) recs.push(en ? 'Introduce questions first in simplified form, then move to the full sentence.' : 'Soruları önce basitleştirilmiş biçimde sunup sonra tam cümleye geçmek.');
        if (m.total > 0 && m.repPct >= 30) recs.push(en ? 'Support listening with a visual cue (picture or gesture) before repeating the question.' : 'Soruyu tekrarlamadan önce görsel ipucuyla (resim, jest) dinlemeyi desteklemek.');
        if (x.hardest) recs.push(en ? `Practise the "${x.hardest}" theme in real-life settings with peers and family.` : `"${x.hardest}" temasını akranlar ve aileyle gerçek yaşam ortamlarında çalışmak.`);
        recs.push(en ? 'Keep short, regular sessions and review progress with the IEP team.' : 'Kısa ve düzenli seansları sürdürmek, gelişimi BEP ekibiyle birlikte değerlendirmek.');
        recs.forEach((r, i) => L.push(`${i + 1}. ${r}`));
        L.push('');
        L.push(en ? 'Note: These figures reflect in-app usage only and are not a diagnosis or assessment result.' : 'Not: Bu rakamlar yalnızca uygulama içi kullanımı yansıtır; tanı ya da değerlendirme sonucu değildir.');
        return L.join('\n');
    }

    const api = { weekly, evaluation, bep, accuracyOf, categoryNeeds };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.ReportText = api;
})(typeof window !== 'undefined' ? window : this);
