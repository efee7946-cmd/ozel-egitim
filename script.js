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

    // 🔥 MOBİL SES KİLİDİNİ AÇMAK İÇİN BOŞ BİR SES OYNAT
    window.speechSynthesis.getVoices();
    const silentUtterance = new SpeechSynthesisUtterance("");
    window.speechSynthesis.speak(silentUtterance);

    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'flex';
    loadNext();
}

// BEKLEME SÜRESİ DOLUNCA BUTONU PARLAT
function resetIdleTimer() {
    clearTimeout(idleTimer);
    document.getElementById('nextBtn').classList.remove('pulse-anim');
    if (document.getElementById('micBtn').disabled && turnCount >= 7) return;
    idleTimer = setTimeout(() => {
        document.getElementById('nextBtn').classList.add('pulse-anim');
        document.getElementById('info').innerText = "Hadi yeni soruya geçelim! ➡️";
    }, 15000); 
}

// SIRADAKİ VİDEO VE SORUYU YÜKLE
async function loadNext() {
    if(isWaiting) return;
    clearTimeout(idleTimer);
    document.getElementById('nextBtn').classList.remove('pulse-anim');
    document.getElementById('micBtn').disabled = true;

    if (unaskedQuestions.length === 0) unaskedQuestions = [...pool];
    const rIndex = Math.floor(Math.random() * unaskedQuestions.length);
    currentObj = unaskedQuestions[rIndex]; 
    unaskedQuestions.splice(rIndex, 1); 

    const vEl = document.getElementById('v');
    chatHistory = []; 
    turnCount = 0; 
    document.getElementById('chat-bubbles').innerHTML = ""; 

    try {
        // 🔥 Backend'deki video servisine gidiyoruz (Güvenli yol)
        const r = await fetch(`/api/video?query=${currentObj.query}`);
        const d = await r.json();
        if(d.videos?.[0]) {
            vEl.src = d.videos[0].video_files[0].link;
            vEl.onloadeddata = () => {
                document.getElementById('qBar').innerText = currentObj.q;
                setTimeout(() => { 
                    vEl.pause(); 
                    isWaiting = true; 
                    chatHistory.push({ role: "model", parts: [{ text: currentObj.q }] });
                    addMessage(currentObj.q, "ai"); 
                    speak(currentObj.q, () => {
                        document.getElementById('micBtn').disabled = false; 
                        resetIdleTimer();
                        document.getElementById('info').innerText = "Konuşmak için mikrofona bas!";
                    }); 
                }, 4000);
            };
        }
    } catch(e) { console.error("Video hatası:", e); }
}

// SES KAYIT (MİKROFON) İŞLEMLERİ
async function rec() {
    clearTimeout(idleTimer);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Tarayıcı ses tanımayı desteklemiyor."); return; }

    // Mobil Chrome için önce mikrofon iznini açıkça al
    let permStream = null;
    try {
        permStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (permErr) {
        document.getElementById('info').innerText = "Mikrofon izni verilmedi. Lütfen tarayıcı ayarlarından izin ver.";
        return;
    }

    document.getElementById('micBtn').disabled = true;

    const r = new SpeechRecognition();
    r.lang = "tr-TR";
    r.onstart = () => {
        // İzin stream'ini recognition başladıktan sonra kapat
        if (permStream) {
            permStream.getTracks().forEach(track => track.stop());
            permStream = null;
        }
        document.getElementById('micBtn').classList.add('listening');
        document.getElementById('info').innerText = "Seni dinliyorum...";
    };
    r.onresult = async (e) => {
        const speech = e.results[0][0].transcript;
        addMessage(speech, "user");
        turnCount++;

        if (turnCount >= 7) {
            const final = `Seninle konuşmak harikaydı ${childName}! Hadi şimdi yeni bir videoya bakalım!`;
            addMessage(final, "ai");
            speak(final, () => {
                document.getElementById('nextBtn').classList.add('pulse-anim');
                document.getElementById('info').innerText = "İleri butonuna basabilirsin! ➡️";
            });
            isWaiting = false;
            return;
        }

        document.getElementById('info').innerText = "Düşünüyorum...";
        const aiRes = await getGemmaResponse(speech);
        addMessage(aiRes, "ai");
        confetti({ particleCount: 50 });
        document.getElementById('v').play();
        speak(aiRes, () => {
            document.getElementById('micBtn').disabled = false;
            isWaiting = false;
            resetIdleTimer();
            document.getElementById('info').innerText = "Konuşmak için mikrofona bas!";
        });
    };
    r.onerror = (err) => { 
        alert("HATA: " + err.error);
        if (permStream) { permStream.getTracks().forEach(t => t.stop()); permStream = null; }
        document.getElementById('micBtn').disabled = false;
        document.getElementById('micBtn').classList.remove('listening');
        if (err.error === 'not-allowed') {
            document.getElementById('info').innerText = "Mikrofon izni gerekli. Lütfen tarayıcı ayarlarından izin ver.";
        } else if (err.error === 'no-speech') {
            document.getElementById('info').innerText = "Ses algılanamadı, tekrar dene!";
        } else {
            document.getElementById('info').innerText = "Duyamadım, tekrar eder misin?";
        }
    };
    r.onend = () => {
        if (permStream) { permStream.getTracks().forEach(t => t.stop()); permStream = null; }
        document.getElementById('micBtn').classList.remove('listening');
    };
    r.start();
}

// YAPAY ZEKA CEVABI (BACKEND ÜZERİNDEN)
async function getGemmaResponse(text) {
    const url = "/api/chat"; // 🔥 Backend'deki chat servisine gidiyoruz
    
    chatHistory.push({ role: "user", parts: [{ text: text }] });

    const instructions = `Sen 5-8 yaş arası çocuklarla konuşan neşeli Yıldız Can'sın. Karşındaki çocuğun adı ${childName}. 
    KRİTİK KURALLAR:
    1. KONU BÜTÜNLÜĞÜ: Çocuk neyden bahsediyorsa o konuda kal. 
    2. EMOJİ YASAĞI: Emoji kullanma. 
    3. CÜMLE SINIRI: MAX 2 KISA CÜMLE (Toplam 8-10 kelime).
    4. SORUYLA BİTİR: Konuyu derinleştiren çok basit bir soru sor.
    5. DOĞAL DÜZELTME: Çocuk hata yaparsa nazikçe doğrusunu kendi cümlende kullan.`;

    const payload = {
        contents: [
            { role: "user", parts: [{ text: "GÖREV: " + instructions }] },
            { role: "model", parts: [{ text: "Tamam! Sohbeti başlatıyorum." }] },
            ...chatHistory
        ]
    };

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        let reply = data.candidates[0].content.parts[0].text;
        chatHistory.push({ role: "model", parts: [{ text: reply }] });
        return reply;
    } catch (e) { 
        return `Çok güzel anlattın ${childName}! Başka neler var?`;
    }
}

// MESAJLARI BALONCUK OLARAK EKLE
function addMessage(text, type) {
    const chatDiv = document.getElementById('chat-bubbles');
    const b = document.createElement('div');
    b.className = `bubble ${type}-bubble`;
    b.innerText = text;
    chatDiv.appendChild(b);
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

// SESLİ KONUŞTURMA
function speak(t, callback) {
    window.speechSynthesis.cancel();
    let u = new SpeechSynthesisUtterance(t);
    u.lang = 'tr-TR';
    u.pitch = 1.2; 
    u.rate = 0.7; 
    if(callback) u.onend = callback;
    window.speechSynthesis.speak(u);
}
