// Supabase - CDN UMD versiyonu index.html'de yükleniyor (window.supabase)
const supabaseUrl = 'https://mtmskfyufuxahdctwuay.supabase.co'
const supabaseKey = 'sb_publishable_kYPbSRUpyPe6tsQZOCcY0g_U1brYQ6U'
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey)
// =============================================
// GENEL DEĞİŞKENLER
// =============================================
let childName = "";

// Oturum verisi — tüm modüller buraya yazar
const sessionData = {
    startTime: null,
    therapyTurns: [],       // { question, answer } dizisi
    storyChoices: [],       // { scene, sceneLabel, choice, response } dizisi
    storyCompleted: false,
    storyName: '',
    totalScenesReached: 0,
    totalScenes: 0,
    micUsedInStory: 0,
    micUsedInTherapy: 0,
};

// =============================================
// EKRAN YÖNETİMİ
// =============================================
function showOnly(id) {
    const screens = ['start-screen','menu-screen','game-container','story-select-screen','story-screen','report-screen'];
    screens.forEach(s => {
        const el = document.getElementById(s);
        if (el) el.style.display = 'none';
    });
    const target = document.getElementById(id);
    if (target) target.style.display = 'flex';
}

function startApp() {
    const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent);
    const isChrome = /CriOS/.test(navigator.userAgent);
    if (isIOS && isChrome) {
        alert("Mikrofon özelliği iOS Chrome'da çalışmıyor. Lütfen Safari ile aç.");
        return;
    }

    try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.getVoices();
        const warmup = new SpeechSynthesisUtterance(" ");
        warmup.volume = 0;
        window.speechSynthesis.speak(warmup);
    } catch(e) {}

    // Oturumu başlat
    sessionData.startTime = Date.now();
    sessionData.therapyTurns = [];
    sessionData.storyChoices = [];
    sessionData.storyCompleted = false;
    sessionData.micUsedInStory = 0;
    sessionData.micUsedInTherapy = 0;

    document.getElementById('menu-greeting').textContent = `Merhaba, ${childName}! 🌟`;
    showOnly('menu-screen');
}

function goToMenu() {
    window.speechSynthesis.cancel();
    clearTimeout(idleTimer);
    showOnly('menu-screen');
}

function goToTherapy() {
    showOnly('game-container');
    const vEl = document.getElementById('v');
    vEl.muted = true;
    vEl.play().catch(()=>{});
    loadNext();
}

function goToStories() {
    showOnly('story-select-screen');
}

function exitStory() {
    window.speechSynthesis.cancel();
    const v = document.getElementById('storyBgVideo');
    v.pause();
    v.src = '';
    showOnly('story-select-screen');
}

// =============================================
// VELİ RAPORU
// =============================================
async function goToReport() {
    showOnly('report-screen');

    // Temel bilgiler
    const now = new Date();
    document.getElementById('reportSubtitle').textContent =
        `${childName} • ${now.toLocaleDateString('tr-TR', { day:'numeric', month:'long', year:'numeric' })}`;
    document.getElementById('reportDate').textContent =
        `Rapor oluşturulma tarihi: ${now.toLocaleString('tr-TR')}`;

    // Süre
    const durationMs = sessionData.startTime ? Date.now() - sessionData.startTime : 0;
    const durationMin = Math.max(1, Math.round(durationMs / 60000));
    document.getElementById('statDuration').textContent = durationMin + ' dk';

    // Mikrofon sayısı
    const totalMic = sessionData.micUsedInTherapy + sessionData.micUsedInStory;
    document.getElementById('statMicCount').textContent = totalMic;

    // Hikaye ilerleme
    const storyPct = sessionData.totalScenes > 0
        ? Math.round((sessionData.totalScenesReached / sessionData.totalScenes) * 100) + '%'
        : '-';
    document.getElementById('statStoryProgress').textContent =
        sessionData.storyCompleted ? '✅ Tam' : storyPct;

    // Toplam yanıt
    const totalTurns = sessionData.therapyTurns.length + sessionData.storyChoices.length + sessionData.micUsedInStory;
    document.getElementById('statTotalTurns').textContent = totalTurns;

    // Seçim analizi
    const choiceEl = document.getElementById('choiceAnalysis');
    if (sessionData.storyChoices.length > 0) {
        choiceEl.innerHTML = '';
        sessionData.storyChoices.forEach(c => {
            const row = document.createElement('div');
            row.className = 'choice-row';
            row.innerHTML = `
                <div class="choice-icon">${c.sceneEmoji || '📍'}</div>
                <div>
                    <div class="choice-row-scene">${c.sceneLabel}</div>
                    <div class="choice-row-text">${c.choice}</div>
                    <div class="choice-row-meta">Yanıt: "${c.response}"</div>
                </div>`;
            choiceEl.appendChild(row);
        });
    }

    // Terapi logu
    const therapyEl = document.getElementById('therapyLog');
    if (sessionData.therapyTurns.length > 0) {
        therapyEl.innerHTML = '';
        sessionData.therapyTurns.forEach(t => {
            const entry = document.createElement('div');
            entry.className = 'therapy-entry';
            entry.innerHTML = `<div class="therapy-q">🎙️ Soru: ${t.question}</div>${t.answer}`;
            therapyEl.appendChild(entry);
        });
    }

    // AI değerlendirmesi
    document.getElementById('aiEvalLoading').style.display = 'flex';
    document.getElementById('aiEvalText').style.display = 'none';
    await generateAIEvaluation(durationMin, totalMic, storyPct, totalTurns);
}

async function generateAIEvaluation(durationMin, totalMic, storyPct, totalTurns) {
    const choices = sessionData.storyChoices.map(c =>
        `- "${c.sceneLabel}" sahnesinde "${c.choice}" seçti`).join('\n') || 'Henüz hikaye oturumu yok.';

    const therapySample = sessionData.therapyTurns.slice(0, 5).map(t =>
        `Soru: "${t.question}" → Cevap: "${t.answer}"`).join('\n') || 'Terapi oturumu yok.';

    const prompt = `Sen özel eğitim ve konuşma terapisi alanında uzman, empati dolu bir asistansın. 
Aşağıdaki veriler, "${childName}" adlı bir çocuğun Yıldız Can uygulamasındaki oturum verisidir.

Oturum süresi: ${durationMin} dakika
Toplam yanıt sayısı: ${totalTurns}
Mikrofon kullanım sayısı: ${totalMic}
Hikaye ilerlemesi: ${storyPct}
Hikaye tamamlandı mı: ${sessionData.storyCompleted ? 'Evet' : 'Hayır'}

Hikayede yapılan seçimler:
${choices}

Konuşma terapisinden örnekler:
${therapySample}

Lütfen veliye hitap ederek, 3-4 paragraf halinde şunları içeren sevecen ve profesyonel bir Türkçe değerlendirme yaz:
1. Çocuğun bu oturumdaki genel katılımı ve motivasyonu
2. Hikayedeki seçimlerden gözlemlenen sosyal/duygusal ipuçları
3. Konuşma ve iletişim açısından dikkat çeken noktalar
4. Aileye somut öneriler ve teşvik edici bir kapanış

Kesinlikle emoji kullanma. Sıcak, profesyonel ve umut verici bir dil kullan.`;

    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: prompt }] }]
            })
        });
        const data = await res.json();
        const text = data.candidates[0].content.parts[0].text;
        document.getElementById('aiEvalLoading').style.display = 'none';
        const evalEl = document.getElementById('aiEvalText');
        evalEl.textContent = text;
        evalEl.style.display = 'block';
    } catch(e) {
        document.getElementById('aiEvalLoading').style.display = 'none';
        const evalEl = document.getElementById('aiEvalText');
        evalEl.textContent = `${childName}'in bu oturumda uygulamaya aktif katılım gösterdiği görülmektedir. Düzenli oturumlar çocuğun konuşma güveni ve ifade becerilerini destekleyecektir. Yıldız Can ile çalışmaya devam etmenizi öneririz.`;
        evalEl.style.display = 'block';
    }
}

// =============================================
// KONUŞMA TERAPİSTİ (orijinal kod)
// =============================================
const pool = [
    { q: "Bugün okulda neler yaptın?", query: "school kids" },
    { q: "Hangi oyunları seversin?", query: "children playing" },
    { q: "En sevdiğin yemek ne?", query: "child eating" },
    { q: "En sevdiğin hayvan hangisi?", query: "cute puppy" },
    { q: "Büyüyünce ne olmak istiyorsun?", query: "child dreaming" },
    { q: "Hafta sonu ne yapmayı seversin?", query: "family park" },
    { q: "En sevdiğin renk ne?", query: "colorful balloons" },
    { q: "Arkadaşlarınla neler oynarsınız?", query: "kids running" },
    { q: "En sevdiğin meyve nedir?", query: "eating fruit" },
    { q: "Tatillerde nereye gitmek istersin?", query: "beach kids" },
    { q: "Bugün seni en çok ne mutlu etti?", query: "happy child" },
    { q: "Sence zürafaların boynu neden uzundur?", query: "giraffe" },
    { q: "Arkadaşına yardım etmek sence nasıl bir duygu?", query: "kids helping" },
    { q: "Yağmur yağdığında neler yapmayı seversin?", query: "rainy day kids" },
    { q: "En sevdiğin kurabiyenin içine ne koyalım?", query: "child baking" },
    { q: "Yıldızlara dokunabilsen ne hissederdin?", query: "stars night" },
    { q: "Basketbol mu yoksa koşu mu daha eğlenceli?", query: "kids basketball" },
    { q: "Yatmadan önce hangi masalı dinlemek istersin?", query: "bedtime story" },
    { q: "Bugün hangi renk kıyafetini giymek istersin?", query: "kid getting dressed" },
    { q: "İtfaiyeci olsan ilk kimi kurtarırdın?", query: "firefighter kids" },
    { q: "Denizin altında hangi hayvanla tanışmak istersin?", query: "underwater fish" },
    { q: "Kendi robotunu yapsan adı ne olurdu?", query: "kid with robot" },
    { q: "En sevdiğin dondurma hangisi?", query: "kid eating ice cream" },
    { q: "Ormanda bir gezintiye çıksak neler görürüz?", query: "kids in forest" },
    { q: "Uçan bir araban olsa nereye gitmek istersin?", query: "flying car dream" }
];

let unaskedQuestions = [...pool];
let currentObj = null;
let isWaiting = false;
let chatHistory = [];
let idleTimer;
let turnCount = 0;

function resetIdleTimer() {
    clearTimeout(idleTimer);
    document.getElementById('nextBtn').classList.remove('pulse-anim');
    if (document.getElementById('micBtn').disabled && turnCount >= 7) return;
    idleTimer = setTimeout(() => {
        document.getElementById('nextBtn').classList.add('pulse-anim');
        document.getElementById('info').innerText = "Hadi yeni soruya geçelim! ➡️";
    }, 15000);
}

function getBestVideoUrl(videoFiles) {
    if (!videoFiles || videoFiles.length === 0) return null;
    const mp4Files = videoFiles.filter(f => f.file_type === 'video/mp4');
    if (mp4Files.length === 0) return videoFiles[0].link;
    const sd = mp4Files.find(f => f.height && f.height <= 720);
    return sd ? sd.link : mp4Files[0].link;
}

async function loadNext() {
    if (isWaiting) return;
    clearTimeout(idleTimer);
    document.getElementById('nextBtn').classList.remove('pulse-anim');
    document.getElementById('micBtn').disabled = true;
    document.getElementById('qBar').innerText = "Hazırlanıyorum...";
    document.getElementById('info').innerText = "Video yükleniyor...";

    if (unaskedQuestions.length === 0) unaskedQuestions = [...pool];
    const rIndex = Math.floor(Math.random() * unaskedQuestions.length);
    currentObj = unaskedQuestions[rIndex];
    unaskedQuestions.splice(rIndex, 1);

    const vEl = document.getElementById('v');
    chatHistory = [];
    turnCount = 0;
    document.getElementById('chat-bubbles').innerHTML = "";

    try {
        const r = await fetch('/api/video?query=' + currentObj.query);
        const d = await r.json();
        if (d.videos && d.videos[0]) {
            const videoUrl = getBestVideoUrl(d.videos[0].video_files);
            if (!videoUrl) { startQuestion(); return; }
            vEl.muted = true;
            vEl.setAttribute('playsinline', '');
            vEl.src = videoUrl;
            vEl.load();
            let videoReady = false;
            const videoTimeout = setTimeout(function() {
                if (!videoReady) { videoReady = true; startQuestion(); }
            }, 5000);
            vEl.onloadeddata = function() {
                if (videoReady) return;
                videoReady = true;
                clearTimeout(videoTimeout);
                var p = vEl.play();
                if (p !== undefined) p.catch(function() {});
                setTimeout(function() { startQuestion(); }, 2000);
            };
            vEl.onerror = function() { clearTimeout(videoTimeout); startQuestion(); };
        } else { startQuestion(); }
    } catch(e) { startQuestion(); }
}

function startQuestion() {
    var vEl = document.getElementById('v');
    vEl.pause();
    isWaiting = true;
    chatHistory.push({ role: "model", parts: [{ text: currentObj.q }] });
    document.getElementById('qBar').innerText = currentObj.q;
    addMessage(currentObj.q, "ai");
    speak(currentObj.q, function() {
        document.getElementById('micBtn').disabled = false;
        resetIdleTimer();
        document.getElementById('info').innerText = "Konuşmak için mikrofona bas!";
    });
}

async function rec() {
    clearTimeout(idleTimer);
    var isIOS = /iP(hone|ad|od)/.test(navigator.userAgent);
    var isChrome = /CriOS/.test(navigator.userAgent);
    if (isIOS && isChrome) {
        document.getElementById('info').innerText = "iOS Chrome'da desteklenmiyor. Safari kullan.";
        return;
    }
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Tarayıcı ses tanımayı desteklemiyor."); return; }
    document.getElementById('micBtn').disabled = true;
    document.getElementById('info').innerText = "Dinlemeye hazırlanıyorum...";
    var recognition = new SpeechRecognition();
    recognition.lang = "tr-TR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;
    recognition.onstart = function() {
        document.getElementById('micBtn').classList.add('listening');
        document.getElementById('info').innerText = "Seni dinliyorum...";
    };
    recognition.onresult = async function(e) {
        var speech = e.results[0][0].transcript;
        addMessage(speech, "user");
        sessionData.micUsedInTherapy++;
        turnCount++;
        if (turnCount >= 7) {
            var final = "Seninle konuşmak harikaydı " + childName + "! Hadi şimdi yeni bir videoya bakalım!";
            addMessage(final, "ai");
            speak(final, function() {
                document.getElementById('nextBtn').classList.add('pulse-anim');
                document.getElementById('info').innerText = "İleri butonuna basabilirsin! ➡️";
            });
            isWaiting = false;
            return;
        }
        document.getElementById('info').innerText = "Düşünüyorum...";
        var aiRes = await getGemmaResponse(speech);
        addMessage(aiRes, "ai");
        // Veriyi kaydet
        sessionData.therapyTurns.push({ question: currentObj.q, answer: speech });
        confetti({ particleCount: 50 });
        var vEl = document.getElementById('v');
        var pp = vEl.play();
        if (pp !== undefined) pp.catch(function() {});
        speak(aiRes, function() {
            document.getElementById('micBtn').disabled = false;
            isWaiting = false;
            resetIdleTimer();
            document.getElementById('info').innerText = "Konuşmak için mikrofona bas!";
        });
    };
    recognition.onerror = function(err) {
        document.getElementById('micBtn').disabled = false;
        document.getElementById('micBtn').classList.remove('listening');
        if (err.error === 'not-allowed') document.getElementById('info').innerText = "Mikrofon izni gerekli.";
        else if (err.error === 'no-speech') document.getElementById('info').innerText = "Ses algılanamadı, tekrar dene!";
        else document.getElementById('info').innerText = "Duyamadım, tekrar eder misin?";
    };
    recognition.onend = function() {
        document.getElementById('micBtn').classList.remove('listening');
        if (document.getElementById('micBtn').disabled && isWaiting) {
            document.getElementById('micBtn').disabled = false;
            document.getElementById('info').innerText = "Konuşmak için mikrofona bas!";
        }
    };
    try { recognition.start(); } catch(e) {
        document.getElementById('micBtn').disabled = false;
        document.getElementById('info').innerText = "Tekrar dene!";
    }
}

async function getGemmaResponse(text) {
    var url = "/api/chat";
    chatHistory.push({ role: "user", parts: [{ text: text }] });
    var instructions = "Sen 5-8 yaş arası çocuklarla konuşan neşeli Yıldız Can'sın. Karşındaki çocuğun adı " + childName + ". KRİTİK KURALLAR: 1. KONU BÜTÜNLÜĞÜ: Çocuk neyden bahsediyorsa o konuda kal. 2. EMOJİ YASAĞI: Emoji kullanma. 3. CÜMLE SINIRI: MAX 2 KISA CÜMLE (Toplam 8-10 kelime). 4. SORUYLA BİTİR: Konuyu derinleştiren çok basit bir soru sor. 5. DOĞAL DÜZELTME: Çocuk hata yaparsa nazikçe doğrusunu kendi cümlenle kullan.";
    var payload = {
        contents: [
            { role: "user", parts: [{ text: "GÖREV: " + instructions }] },
            { role: "model", parts: [{ text: "Tamam! Sohbeti başlatıyorum." }] }
        ].concat(chatHistory)
    };
    try {
        var res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        var data = await res.json();
        var reply = data.candidates[0].content.parts[0].text;
        chatHistory.push({ role: "model", parts: [{ text: reply }] });
        return reply;
    } catch (e) {
        return "Çok güzel anlattın " + childName + "! Başka neler var?";
    }
}

function addMessage(text, type) {
    var chatDiv = document.getElementById('chat-bubbles');
    var b = document.createElement('div');
    b.className = 'bubble ' + type + '-bubble';
    b.innerText = text;
    chatDiv.appendChild(b);
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

function speakFallback(t, callback) {
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(t);
    u.lang = 'tr-TR'; u.pitch = 1.2; u.rate = 0.7;
    var ended = false;
    var safeEnd = function() { if (ended) return; ended = true; if (callback) callback(); };
    u.onend = safeEnd;
    var wordCount = t.split(' ').length;
    setTimeout(safeEnd, (wordCount * 500) + 2500);
    window.speechSynthesis.speak(u);
}

async function speak(t, callback) {
    try {
        var res = await fetch('/api/tts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: t }) });
        if (!res.ok) throw new Error('TTS başarısız');
        var blob = await res.blob();
        var url = URL.createObjectURL(blob);
        var audio = new Audio(url);
        audio.onended = function() { URL.revokeObjectURL(url); if (callback) callback(); };
        audio.onerror = function() { URL.revokeObjectURL(url); speakFallback(t, callback); };
        var pp = audio.play();
        if (pp !== undefined) pp.catch(function() { speakFallback(t, callback); });
    } catch (e) { speakFallback(t, callback); }
}

// =============================================
// HİKAYE SİSTEMİ
// =============================================

// Kırmızı Başlıklı Kız sahneleri
const STORIES = {
    redhood: {
        title: "Kırmızı Başlıklı Kız",
        scenes: [
            {
                id: 0,
                emoji: "🏠",
                bg: "linear-gradient(135deg, #ffecd2, #fcb69f)",
                bgLabel: "Sıcak bir ev",
                videoQuery: "cozy cottage kitchen sunlight children",
                narration: "Bir varmış bir yokmuş... Kırmızı başlıklı güzel bir kız varmış! Annesi ona bir sepet hazırlamış. Sepette neler varmış sence?",
                taskType: "speak",
                taskText: "Sepette ne olduğunu söyle! 🧺",
                micPrompt: "Sepette ne var sence?",
                choices: [
                    { text: "🍰 Pasta ve meyve!", next: 1, response: "Harika! Neyse ki annesi pastayı koymuş, büyükanne çok sevecek!" },
                    { text: "🌸 Çiçekler ve bal!", next: 1, response: "Ne güzel düşündün! Çiçekler büyükanneyi mutlu eder!" },
                    { text: "📚 Kitaplar!", next: 1, response: "Kitaplar mı? Büyükanne okumayı seviyor olabilir, çok düşünceli bir seçim!" }
                ]
            },
            {
                id: 1,
                emoji: "🌲",
                bg: "linear-gradient(135deg, #a8edea, #c8f7c5)",
                bgLabel: "Geniş orman",
                videoQuery: "magical green forest sunlight path flowers",
                narration: "Kırmızı Başlıklı Kız ormana girdi. Annesi ne demişti hatırlıyor musun? 'Yoldan çıkma!' demişti. Ama karşısına güzel çiçekler çıktı. Ne yapmalı?",
                taskType: "choice",
                taskText: "Kırmızı Başlıklı Kız ne yapmalı?",
                choices: [
                    { text: "💐 Çiçek toplamak için yoldan çıksın", next: 2, response: "Ama dikkatli olalım! Annesi yoldan çıkmamasını söylemişti...", warn: true },
                    { text: "🚶 Yolda kalmaya devam etsin", next: 2, response: "Çok akıllıca! Annesi ne dedi hatırlıyor, hep yolda kalmalı!" }
                ]
            },
            {
                id: 2,
                emoji: "🐺",
                bg: "linear-gradient(135deg, #667eea, #764ba2)",
                bgLabel: "Ormanın içi",
                videoQuery: "mysterious dark forest trees fog",
                narration: "Bir de ne görsün... Büyük, kocaman bir kurt karşısına çıktı! Kurt çok tatlı davrandı ve büyükannenin evine giden yolu sordu. Sen olsaydın ne yapardın?",
                taskType: "both",
                taskText: "Kurt ile konuşulur mu? Seçimini yap ya da söyle!",
                micPrompt: "Sen olsaydın kurda ne söylerdin?",
                choices: [
                    { text: "🏃 Kaçar, kimseye söylemezdim!", next: 3, response: "Akıllıca! Yabancılara her şeyi söylememek çok önemli." },
                    { text: "🤐 Hiçbir şey söylemezdim", next: 3, response: "Sessiz kalmak bazen en doğrusu! Güvende olmak her şeyden önemli." },
                    { text: "📢 Bağırır yardım isterdim", next: 3, response: "Çok cesur! Yardım istemek her zaman doğru şey." }
                ]
            },
            {
                id: 3,
                emoji: "🏡",
                bg: "linear-gradient(135deg, #f093fb, #f5576c)",
                bgLabel: "Büyükannenin evi",
                videoQuery: "small cottage house door garden autumn",
                narration: "Kırmızı Başlıklı Kız büyükannenin evine geldi. Kapıyı çaldı. İçeriden değişik bir ses geldi! Sence kim açacak kapıyı?",
                taskType: "speak",
                taskText: "İçeriden gelen sesi nasıl buldu? Söyle!",
                micPrompt: "Sence kim var içeride?",
                choices: [
                    { text: "😨 Kurt gibi bir ses! Girmemeli!", next: 4, response: "Haklısın! O ses gerçekten garip. Dikkatli olmak lazım!" },
                    { text: "👵 Büyükanne hasta, sesi değişmiş", next: 4, response: "Belki... Ama yine de dikkatli olmak lazım!" }
                ]
            },
            {
                id: 4,
                emoji: "🎉",
                bg: "linear-gradient(135deg, #43e97b, #38f9d7)",
                bgLabel: "Mutlu son!",
                videoQuery: "happy children celebrating confetti colorful",
                narration: "Tam o anda bir avcı geldi ve herkesi kurtardı! Büyükanne, Kırmızı Başlıklı Kız ve avcı hep birlikte pasta yediler. Hikayelerin sonu hep mutlu biter! Sen bu hikayede en çok neyi sevdin?",
                taskType: "both",
                taskText: "Hikayenin en güzel yerini anlat! 🎉",
                micPrompt: "En sevdiğin bölümü söyle!",
                choices: [
                    { text: "🐺 Kurt sahnesi!", next: -1, response: "Kurt çok korkutucuydu ama sonunda her şey yoluna girdi!" },
                    { text: "🏡 Büyükannenin evi!", next: -1, response: "Büyükannenin evi sıcak ve güzeldi, haklısın!" },
                    { text: "🎉 Mutlu son!", next: -1, response: "En güzel kısım tabii ki mutlu son! Hep böyle olsun!" }
                ]
            }
        ]
    }
};

// Hikaye durumu
let currentStory = null;
let currentSceneIdx = 0;
let storyChoiceMade = false;

function startStory(storyKey) {
    currentStory = STORIES[storyKey];
    currentSceneIdx = 0;
    // Rapor için meta
    sessionData.storyName = currentStory.title;
    sessionData.totalScenes = currentStory.scenes.length;
    sessionData.totalScenesReached = 0;
    sessionData.storyCompleted = false;
    showOnly('story-screen');
    buildProgressDots();
    renderScene(0);
}

function buildProgressDots() {
    const container = document.getElementById('progressDots');
    container.innerHTML = '';
    currentStory.scenes.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'p-dot';
        dot.id = 'dot-' + i;
        container.appendChild(dot);
    });
}

function updateDots(idx) {
    currentStory.scenes.forEach((_, i) => {
        const dot = document.getElementById('dot-' + i);
        if (!dot) return;
        dot.className = 'p-dot';
        if (i < idx) dot.classList.add('done');
        else if (i === idx) dot.classList.add('active');
    });
}

function renderScene(idx) {
    const scene = currentStory.scenes[idx];
    storyChoiceMade = false;

    // Fallback arka planı hemen uygula
    const fallback = document.getElementById('storyBgFallback');
    fallback.style.background = scene.bg;
    fallback.style.opacity = '1';

    // Sahne emojisi
    document.getElementById('sceneEmoji').textContent = scene.emoji;

    // Arka plan etiketi
    const sceneImg = document.getElementById('storySceneImg');
    let bgLabel = sceneImg.querySelector('.scene-bg-label');
    if (!bgLabel) {
        bgLabel = document.createElement('div');
        bgLabel.className = 'scene-bg-label';
        sceneImg.appendChild(bgLabel);
    }
    bgLabel.textContent = scene.bgLabel || '';

    // Pexels'ten sahneye uygun video çek
    loadStoryVideo(scene.videoQuery, scene.bg);

    // İlerleme noktaları
    updateDots(idx);
    sessionData.totalScenesReached = Math.max(sessionData.totalScenesReached, idx + 1);

    // Anlatıcı
    document.getElementById('narratorBubble').textContent = scene.narration;

    // Görev
    document.getElementById('storyTask').textContent = scene.taskText;
    document.getElementById('storyTaskLabel').textContent = '🎯 Görevin:';

    // Sohbet temizle
    document.getElementById('storyChatBubbles').innerHTML = '';

    // Seçim butonları
    renderChoices(scene);

    // Mikrofon alanı
    const micArea = document.getElementById('storyMicArea');
    if (scene.taskType === 'speak' || scene.taskType === 'both') {
        micArea.style.display = 'flex';
        document.getElementById('storyMicInfo').textContent = scene.micPrompt || 'Söylemek istiyorsan mikrofona bas!';
        document.getElementById('storyMicBtn').disabled = false;
        document.getElementById('storyMicBtn').classList.remove('listening');
    } else {
        micArea.style.display = 'none';
    }

    // İleri butonu gizle
    document.getElementById('storyNextBtn').style.display = 'none';

    // Anlatıyı seslendir
    speak(scene.narration, () => {});
}

// Sahneye uygun Pexels videosu yükle
async function loadStoryVideo(query, fallbackBg) {
    const videoEl = document.getElementById('storyBgVideo');
    const fallbackEl = document.getElementById('storyBgFallback');

    try {
        const r = await fetch('/api/video?query=' + encodeURIComponent(query));
        const d = await r.json();

        if (d.videos && d.videos[0]) {
            const files = d.videos[0].video_files || [];
            const mp4s = files.filter(f => f.file_type === 'video/mp4');
            const chosen = mp4s.find(f => f.height && f.height <= 720) || mp4s[0] || files[0];
            if (!chosen) return;

            videoEl.src = chosen.link;
            videoEl.muted = true;
            videoEl.loop = true;
            videoEl.setAttribute('playsinline', '');
            videoEl.load();

            videoEl.onloadeddata = function() {
                videoEl.play().catch(() => {});
                // Video hazır olunca fallback rengi kaldır
                fallbackEl.style.opacity = '0';
                setTimeout(() => { fallbackEl.style.opacity = '0'; }, 800);
            };
            videoEl.onerror = function() {
                fallbackEl.style.background = fallbackBg;
                fallbackEl.style.opacity = '1';
            };
        }
    } catch(e) {
        // Video gelmezse fallback renk kalır
        fallbackEl.style.background = fallbackBg;
        fallbackEl.style.opacity = '1';
    }
}

function renderChoices(scene) {
    const container = document.getElementById('storyChoices');
    container.innerHTML = '';
    if (!scene.choices) return;

    scene.choices.forEach((choice, i) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = choice.text;
        btn.onclick = () => handleChoice(choice, btn, scene);
        container.appendChild(btn);
    });
}

function handleChoice(choice, btn, scene) {
    if (storyChoiceMade) return;
    storyChoiceMade = true;

    document.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);
    btn.classList.add('chosen');

    // Seçimi kaydet
    sessionData.storyChoices.push({
        sceneLabel: scene.bgLabel || `Sahne ${scene.id + 1}`,
        sceneEmoji: scene.emoji,
        choice: choice.text,
        response: choice.response
    });

    addStoryBubble(choice.text, 'user');
    addStoryBubble(choice.response, 'ai');

    // Seslendir + devam et butonu göster
    speak(choice.response, () => {
        if (choice.next === -1) {
            // Son sahne
            showStoryEnd();
        } else {
            const nextBtn = document.getElementById('storyNextBtn');
            nextBtn.style.display = 'block';
            confetti({ particleCount: 60, spread: 70 });
        }
    });
}

function nextScene() {
    currentSceneIdx++;
    if (currentSceneIdx >= currentStory.scenes.length) {
        showStoryEnd();
    } else {
        renderScene(currentSceneIdx);
    }
}

function showStoryEnd() {
    window.speechSynthesis.cancel();
    sessionData.storyCompleted = true;

    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
    setTimeout(() => confetti({ particleCount: 100, spread: 120, origin: { y: 0.4 } }), 500);

    const side = document.querySelector('.story-side');
    side.innerHTML = `
        <div class="story-end-screen">
            <div class="end-emoji">🎉</div>
            <h2>Aferin ${childName}!</h2>
            <p>Hikayeyi tamamladın! Çok başarıldın, harikasın!</p>
            <div style="font-size:2.5rem; margin:16px 0">⭐⭐⭐</div>
            <button class="btn-restart" onclick="exitStory()">Başka Hikayeye Git 📖</button>
            <button class="btn-restart" style="background:#6C63FF; margin-top:10px" onclick="startStory('redhood')">Tekrar Oyna 🔄</button>
        </div>
    `;

    const endMsg = `Aferin ${childName}! Hikayeyi tamamladın, çok başarılısın!`;
    speak(endMsg, () => {});
}

function addStoryBubble(text, type) {
    const container = document.getElementById('storyChatBubbles');
    const b = document.createElement('div');
    b.className = type === 'ai' ? 'story-bubble-ai' : 'story-bubble-user';
    b.textContent = text;
    container.appendChild(b);
    container.scrollTop = container.scrollHeight;
}

// Hikaye mikrofonu
function storyRec() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Tarayıcı ses tanımayı desteklemiyor."); return; }

    const micBtn = document.getElementById('storyMicBtn');
    const micInfo = document.getElementById('storyMicInfo');
    micBtn.disabled = true;
    micInfo.textContent = "Dinliyorum...";

    const recognition = new SpeechRecognition();
    recognition.lang = "tr-TR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
        micBtn.classList.add('listening');
        micInfo.textContent = "Seni dinliyorum! 🎙️";
    };

    recognition.onresult = async (e) => {
        const speech = e.results[0][0].transcript;
        micBtn.classList.remove('listening');
        addStoryBubble(speech, 'user');
        micInfo.textContent = "Düşünüyorum...";
        sessionData.micUsedInStory++;

        // AI'dan kısa geri bildirim al
        const scene = currentStory.scenes[currentSceneIdx];
        const prompt = `Sen Yıldız Can'sın, 5-8 yaş çocuklarla konuşan neşeli bir arkadaş. Çocuğun adı ${childName}. 
Hikayedeki sahne: "${scene.narration}"
Çocuğun cevabı: "${speech}"
Çok kısa (max 2 cümle, 10 kelime) ve sevecen bir geri bildirim ver. Sonra devam etmelerini söyle. Emoji kullanma.`;

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        { role: "user", parts: [{ text: prompt }] }
                    ]
                })
            });
            const data = await res.json();
            const reply = data.candidates[0].content.parts[0].text;
            addStoryBubble(reply, 'ai');
            confetti({ particleCount: 40 });
            speak(reply, () => {
                micBtn.disabled = false;
                micInfo.textContent = scene.micPrompt || 'Tekrar konuşmak ister misin?';
                // Seçim yapılmadıysa devam butonu göster
                if (!storyChoiceMade && scene.taskType === 'speak') {
                    document.getElementById('storyNextBtn').style.display = 'block';
                }
            });
        } catch(err) {
            const fallback = `Harika anlattın ${childName}! Çok güzeldi.`;
            addStoryBubble(fallback, 'ai');
            speak(fallback, () => {
                micBtn.disabled = false;
                micInfo.textContent = scene.micPrompt || 'Tekrar konuşmak ister misin?';
                if (!storyChoiceMade && scene.taskType === 'speak') {
                    document.getElementById('storyNextBtn').style.display = 'block';
                }
            });
        }
    };

    recognition.onerror = (err) => {
        micBtn.classList.remove('listening');
        micBtn.disabled = false;
        if (err.error === 'no-speech') micInfo.textContent = "Duyamadım, tekrar dene!";
        else micInfo.textContent = "Bir sorun oldu, tekrar dene!";
    };

    recognition.onend = () => {
        micBtn.classList.remove('listening');
        if (micBtn.disabled) {
            // onresult gelmediyse
        }
    };

    try { recognition.start(); } catch(e) {
        micBtn.disabled = false;
        micInfo.textContent = "Tekrar dene!";
    }
}

// =============================================
// AUTH FONKSİYONLARI
// =============================================
let authMode = 'login';

function switchAuth(mode) {
    authMode = mode;
    const loginTab = document.getElementById('tab-login');
    const registerTab = document.getElementById('tab-register');
    const btnText = document.getElementById('btnText');
    const title = document.getElementById('auth-main-title');
    const subTitle = document.querySelector('.auth-sub');

    if (mode === 'login') {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        title.innerText = "Hoş Geldin!";
        subTitle.innerText = "Öğrenme yolculuğuna başlamak için giriş yap.";
        btnText.innerText = "Giriş Yap";
    } else {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        title.innerText = "Yeni Hesap";
        subTitle.innerText = "Yıldız Can dünyasına katılmak için kayıt ol.";
        btnText.innerText = "Kayıt Ol";
    }
}

function showStatus(msg, type) {
    const status = document.getElementById('auth-status');
    status.innerText = msg;
    if (type === 'error') status.style.color = '#ff4757';
    else if (type === 'success') status.style.color = '#2ed573';
    else status.style.color = '#555';
}

async function handleAuth() {
    const email = document.getElementById('emailInput').value.trim();
    const password = document.getElementById('passwordInput').value;

    if (!email || !password) {
        showStatus("Lütfen tüm alanları doldur! ⚠️", "error");
        return;
    }

    if (password.length < 6) {
        showStatus("Şifre en az 6 karakter olmalı! 🔒", "error");
        return;
    }

    showStatus("İşlem yapılıyor... ⏳", "info");
    document.getElementById('mainAuthBtn').disabled = true;

    try {
        if (authMode === 'register') {
            const { data, error } = await supabase.auth.signUp({ email, password });
            document.getElementById('mainAuthBtn').disabled = false;
            if (error) {
                const msg = turkishAuthError(error.message);
                showStatus("❌ " + msg, "error");
            } else {
                showStatus("🎉 Kayıt başarılı! E-postanı kontrol et ve doğrula.", "success");
            }
        } else {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            document.getElementById('mainAuthBtn').disabled = false;
            if (error) {
                const msg = turkishAuthError(error.message);
                showStatus("❌ " + msg, "error");
            } else {
                childName = data.user.email.split('@')[0];
                showStatus("✅ Giriş başarılı! Yükleniyor...", "success");
                document.getElementById('start-screen').style.transition = 'opacity 0.4s';
                document.getElementById('start-screen').style.opacity = '0';
                setTimeout(() => startApp(), 500);
            }
        }
    } catch (e) {
        document.getElementById('mainAuthBtn').disabled = false;
        showStatus("❌ Bağlantı hatası: " + e.message, "error");
    }
}

function turkishAuthError(msg) {
    if (msg.includes('Invalid login credentials')) return 'E-posta veya şifre yanlış!';
    if (msg.includes('Email not confirmed')) return 'E-posta adresin henüz doğrulanmamış. Gelen kutunu kontrol et!';
    if (msg.includes('User already registered')) return 'Bu e-posta zaten kayıtlı! Giriş yapmayı dene.';
    if (msg.includes('Password should be')) return 'Şifre en az 6 karakter olmalı!';
    if (msg.includes('Unable to validate email')) return 'Geçerli bir e-posta adresi gir!';
    if (msg.includes('Network')) return 'İnternet bağlantını kontrol et!';
    return msg;
}

async function saveSessionToDatabase(type, turns, evaluation) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
        const { error } = await supabase
            .from('user_sessions')
            .insert([{ 
                user_id: user.id, 
                session_type: type, 
                total_turns: turns, 
                ai_evaluation: evaluation 
            }]);
            
        if (error) console.error("Veri saklanamadı:", error);
    }
}

// =============================================
// WINDOW EXPORT (HTML onclick için)
// =============================================
window.switchAuth = switchAuth;
window.handleAuth = handleAuth;
window.goToMenu = goToMenu;
window.goToTherapy = goToTherapy;
window.goToStories = goToStories;
window.goToReport = goToReport;
window.exitStory = exitStory;
window.startStory = startStory;
window.nextScene = nextScene;
window.rec = rec;
window.loadNext = loadNext;
window.storyRec = storyRec;