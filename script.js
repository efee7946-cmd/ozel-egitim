// 🔥 SORU HAVUZU (POOL)
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
let childName = "";

function startGame() {
    const nameVal = document.getElementById('nameInput').value.trim();
    if (!nameVal) return;
    childName = nameVal;

    const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent);
    const isChrome = /CriOS/.test(navigator.userAgent);
    if (isIOS && isChrome) {
        alert("Mikrofon ozelligi iOS Chrome'da calismiyor. Lutfen Safari ile ac.");
        return;
    }

    // Kullanici etkilesimi aninda ses motorunu isit
    try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.getVoices();
        const warmup = new SpeechSynthesisUtterance(" ");
        warmup.volume = 0;
        window.speechSynthesis.speak(warmup);
    } catch(e) {}

    // Video elementini kullanici etkilesimi aninda unlock et (mobil icin kritik)
    const vEl = document.getElementById('v');
    vEl.muted = true;
    vEl.play().catch(() => {});

    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'flex';
    loadNext();
}

function resetIdleTimer() {
    clearTimeout(idleTimer);
    document.getElementById('nextBtn').classList.remove('pulse-anim');
    if (document.getElementById('micBtn').disabled && turnCount >= 7) return;
    idleTimer = setTimeout(() => {
        document.getElementById('nextBtn').classList.add('pulse-anim');
        document.getElementById('info').innerText = "Hadi yeni soruya gecelim! ➡️";
    }, 15000);
}

// Pexels video_files icinden mobil uyumlu MP4 sec
function getBestVideoUrl(videoFiles) {
    if (!videoFiles || videoFiles.length === 0) return null;
    const mp4Files = videoFiles.filter(f => f.file_type === 'video/mp4');
    if (mp4Files.length === 0) return videoFiles[0].link;
    // 720p veya alti tercih et
    const sd = mp4Files.find(f => f.height && f.height <= 720);
    return sd ? sd.link : mp4Files[0].link;
}

async function loadNext() {
    if (isWaiting) return;
    clearTimeout(idleTimer);
    document.getElementById('nextBtn').classList.remove('pulse-anim');
    document.getElementById('micBtn').disabled = true;
    document.getElementById('qBar').innerText = "Hazirlaniyorum...";
    document.getElementById('info').innerText = "Video yukleniyor...";

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
            // Fallback: 5 saniyede video gelmezse soruya gec
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

            vEl.onerror = function() {
                clearTimeout(videoTimeout);
                startQuestion();
            };
        } else {
            startQuestion();
        }
    } catch(e) {
        console.error("Video hatasi:", e);
        startQuestion();
    }
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
        document.getElementById('info').innerText = "Konusmak icin mikrofona bas!";
    });
}

// MIKROFON - getUserMedia kaldirildi, cift izin sorunu cozuldu
async function rec() {
    clearTimeout(idleTimer);

    var isIOS = /iP(hone|ad|od)/.test(navigator.userAgent);
    var isChrome = /CriOS/.test(navigator.userAgent);
    if (isIOS && isChrome) {
        document.getElementById('info').innerText = "iOS Chrome'da desteklenmiyor. Safari kullan.";
        return;
    }

    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Tarayici ses tanımayi desteklemiyor.");
        return;
    }

    document.getElementById('micBtn').disabled = true;
    document.getElementById('info').innerText = "Dinlemeye hazirlaniyorum...";

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
        turnCount++;

        if (turnCount >= 7) {
            var final = "Seninle konusmak harikaydi " + childName + "! Hadi simdi yeni bir videoya bakalim!";
            addMessage(final, "ai");
            speak(final, function() {
                document.getElementById('nextBtn').classList.add('pulse-anim');
                document.getElementById('info').innerText = "Ileri butonuna basabilirsin! ➡️";
            });
            isWaiting = false;
            return;
        }

        document.getElementById('info').innerText = "Dusunuyorum...";
        var aiRes = await getGemmaResponse(speech);
        addMessage(aiRes, "ai");
        confetti({ particleCount: 50 });

        var vEl = document.getElementById('v');
        var pp = vEl.play();
        if (pp !== undefined) pp.catch(function() {});

        speak(aiRes, function() {
            document.getElementById('micBtn').disabled = false;
            isWaiting = false;
            resetIdleTimer();
            document.getElementById('info').innerText = "Konusmak icin mikrofona bas!";
        });
    };

    recognition.onerror = function(err) {
        document.getElementById('micBtn').disabled = false;
        document.getElementById('micBtn').classList.remove('listening');
        if (err.error === 'not-allowed') {
            document.getElementById('info').innerText = "Mikrofon izni gerekli. Tarayici ayarlarindan izin ver.";
        } else if (err.error === 'no-speech') {
            document.getElementById('info').innerText = "Ses algilanamadi, tekrar dene!";
        } else if (err.error === 'network') {
            document.getElementById('info').innerText = "Ag hatasi, tekrar dene!";
        } else {
            document.getElementById('info').innerText = "Duyamadim, tekrar eder misin?";
        }
    };

    recognition.onend = function() {
        document.getElementById('micBtn').classList.remove('listening');
        // Sonuc gelmeden bitti ve disabled kaldiysa tekrar aktif et
        if (document.getElementById('micBtn').disabled && isWaiting) {
            document.getElementById('micBtn').disabled = false;
            document.getElementById('info').innerText = "Konusmak icin mikrofona bas!";
        }
    };

    try {
        recognition.start();
    } catch(e) {
        document.getElementById('micBtn').disabled = false;
        document.getElementById('info').innerText = "Tekrar dene!";
    }
}

async function getGemmaResponse(text) {
    var url = "/api/chat";
    chatHistory.push({ role: "user", parts: [{ text: text }] });

    var instructions = "Sen 5-8 yas arasi cocuklarla konusan neseli Yildiz Can'sin. Karsindaki cocugun adi " + childName + ". KRITIK KURALLAR: 1. KONU BUTUNLUGU: Cocuk neyden bahsediyorsa o konuda kal. 2. EMOJI YASAGI: Emoji kullanma. 3. CUMLE SINIRI: MAX 2 KISA CUMLE (Toplam 8-10 kelime). 4. SORUYLA BITIR: Konuyu derinlestiren cok basit bir soru sor. 5. DOGAL DUZELTME: Cocuk hata yaparsa nazikce doğrusunu kendi cumlende kullan.";

    var payload = {
        contents: [
            { role: "user", parts: [{ text: "GOREV: " + instructions }] },
            { role: "model", parts: [{ text: "Tamam! Sohbeti baslatiyorum." }] }
        ].concat(chatHistory)
    };

    try {
        var res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        var data = await res.json();
        var reply = data.candidates[0].content.parts[0].text;
        chatHistory.push({ role: "model", parts: [{ text: reply }] });
        return reply;
    } catch (e) {
        return "Cok guzel anlatin " + childName + "! Baska neler var?";
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
    u.lang = 'tr-TR';
    u.pitch = 1.2;
    u.rate = 0.7;
    var ended = false;
    var safeEnd = function() {
        if (ended) return;
        ended = true;
        if (callback) callback();
    };
    u.onend = safeEnd;
    // Mobilde onend bazen calismaz, timeout ile guvenlik
    var wordCount = t.split(' ').length;
    setTimeout(safeEnd, (wordCount * 500) + 2500);
    window.speechSynthesis.speak(u);
}

async function speak(t, callback) {
    try {
        var res = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: t })
        });

        if (!res.ok) throw new Error('ElevenLabs basarisiz');

        var blob = await res.blob();
        var url = URL.createObjectURL(blob);
        var audio = new Audio(url);

        audio.onended = function() {
            URL.revokeObjectURL(url);
            if (callback) callback();
        };
        audio.onerror = function() {
            URL.revokeObjectURL(url);
            speakFallback(t, callback);
        };

        var pp = audio.play();
        if (pp !== undefined) {
            pp.catch(function() {
                speakFallback(t, callback);
            });
        }
    } catch (e) {
        speakFallback(t, callback);
    }
}
