var supabaseUrl = 'https://mtmskfyufuxahdctwuay.supabase.co';
var supabaseKey = 'sb_publishable_kYPbSRUpyPe6tsQZOCcY0g_U1brYQ6U';

// Değişken ismini 'supabaseClient' olarak değiştirerek çakışmayı önleyelim
var supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
// =============================================
// GENEL DEĞİŞKENLER
// =============================================
let childName = "";
let appStarted = false;
let currentUserEmail = "";
let currentUserRole = "parent";
let currentScreenId = 'start-screen';
let currentMenuSection = 'overview';
let activeStudentId = '';
let activeStudentName = '';
let studentsCache = [];

function getUserRoleFromUser(user) {
    if (!user || !user.user_metadata || !user.user_metadata.role) return 'parent';
    return user.user_metadata.role === 'specialist' ? 'specialist' : 'parent';
}

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
    reportEntryId: null,
};

let selectedHistoryDateKey = null;
let historyCalendarMonth = null;
let currentHearingModuleKey = '';
let currentHearingStepIndex = 0;

const LEARNING_AREAS = [
    {
        key: 'speech',
        title: 'Konuşma ve İfade',
        ageRange: '4-8 yaş',
        summary: 'Kısa cümle kurma, soru anlama ve ihtiyaç ifade etme becerileri.',
        outcomes: [
            'Basit sorulara uygun yanıt verir',
            'Tek kelime yerine kısa cümle kurar',
            'İhtiyacını sözel olarak ifade eder'
        ],
        screenPlan: 'Terapi ekranında kısa soru, yanıt ve terapist geri bildirimiyle ilerler.'
    },
    {
        key: 'visual',
        title: 'Görsel Dikkat',
        ageRange: '4-7 yaş',
        summary: 'Eşleştirme, sıralama ve yönerge takibi için görsel hazırlık alanı.',
        outcomes: [
            'Görsel eşleştirme yapar',
            'Sıralı yönergeyi takip eder',
            'Farklılıkları ayırt eder'
        ],
        screenPlan: 'Kart, eşleştirme ve adım takibi etkinlikleriyle kısa görevler sunulur.'
    },
    {
        key: 'daily',
        title: 'Günlük Yaşam Becerileri',
        ageRange: '4-8 yaş',
        summary: 'Rutin, bekleme, yardım isteme ve temel özbakım davranışları.',
        outcomes: [
            'Günlük rutinleri tanır',
            'Yardım isteme davranışı geliştirir',
            'Bekleme ve sıra alma becerisini uygular'
        ],
        screenPlan: 'Gerçek yaşam senaryoları ve kısa karar kartlarıyla çalışılır.'
    }
];

const THERAPY_STAGES = [
    {
        title: 'Hazırlık',
        focus: 'Tanıdık ve rahatlatıcı sorularla başlıyoruz',
        brief: 'Kısa ve anlaşılır cevaplar vererek başlayacağız.',
        coachTitle: 'Sakin başlangıç',
        coachCopy: 'Önce çocuğun rahat konuşmasını sağlayan kısa ve tanıdık sorularla ilerleyeceğiz.'
    },
    {
        title: 'İfade',
        focus: 'Kısa cümle kurma ve açıklama becerisi',
        brief: 'Yanıtı biraz daha açmasını destekleyen sorular seçiyoruz.',
        coachTitle: 'İfade geliştirme',
        coachCopy: 'Bu bölümde tek kelimeden kısa cümleye geçişi destekleyen sorular öne çıkıyor.'
    },
    {
        title: 'Genelleme',
        focus: 'Günlük yaşamla bağlantı kurma',
        brief: 'Yanıtları günlük hayatla ilişkilendirerek beceriyi kalıcılaştırıyoruz.',
        coachTitle: 'Günlük yaşama taşıma',
        coachCopy: 'Son bölümde çocuk verdiği yanıtı günlük hayatına bağlamaya teşvik edilir.'
    }
];

const HEARING_SUPPORT_MODULES = {
    visual_cues: {
        title: 'Görsel Yönerge Takibi',
        description: 'Günlük sınıf ve ev rutinlerinde sıralı görsel yönergeleri izleme çalışması.',
        badge: 'Yönerge',
        steps: [
            {
                emoji: '1-2-3',
                title: 'Sırayı izle',
                prompt: 'Öğretmen görsel kartlarla “çantanı as, yerine geç, defterini aç” yönergesi veriyor. İkinci adım hangisi?',
                visualCopy: 'Çantanı as → Yerine geç → Defterini aç',
                options: ['Çantanı as', 'Yerine geç', 'Defterini aç'],
                correctIndex: 1,
                feedbackCorrect: 'Doğru. İkinci adım yerine geçmekti.',
                feedbackWrong: 'Bir daha bakalım. Çantayı astıktan sonra yerine geçiyordu.'
            },
            {
                emoji: 'EL',
                title: 'Sınıf işaretini anla',
                prompt: 'Öğretmen önce “bekle”, sonra “gel” işareti gösteriyor. İkinci işaret hangisi?',
                visualCopy: 'Bekle → Gel',
                options: ['Gel', 'Bekle', 'Otur'],
                correctIndex: 0,
                feedbackCorrect: 'Evet. İkinci işaret “gel” anlamına geliyor.',
                feedbackWrong: 'Bu adımda ikinci işaret “gel”di.'
            }
        ]
    },
    lip_reading: {
        title: 'Dudak Okuma Farkındalığı',
        description: 'Ağız şekli, yüz ifadesi ve dikkatli bakışla temel kelime ipuçlarını ayırt etme çalışması.',
        badge: 'Yüz ipucu',
        steps: [
            {
                emoji: 'AĞIZ',
                title: 'Kısa kelimeyi tahmin et',
                prompt: 'Öğretmenin dudakları kısa ve tek heceli bir kelime söylüyor. Hangisi dudak hareketiyle daha kolay ayırt edilir?',
                visualCopy: 'Kısa ağız açılıp kapanması',
                options: ['Su', 'Kalemlik', 'Oyuncak'],
                correctIndex: 0,
                feedbackCorrect: 'Güzel. Kısa ve net dudak hareketiyle en kolay ayırt edilen seçenek buydu.',
                feedbackWrong: 'Burada kısa ve net hareket “su” kelimesinde görülür.'
            },
            {
                emoji: 'YÜZ',
                title: 'İfadeyi oku',
                prompt: 'Yüz ifadesi sakin ve destekleyici görünüyor. Bu ifade daha çok hangi mesajı verir?',
                visualCopy: 'Kaşlar yumuşak, bakış sakin, ağız hafif açık',
                options: ['Dinlemeye hazırım', 'Çok kızgınım', 'Buradan gidiyorum'],
                correctIndex: 0,
                feedbackCorrect: 'Doğru. Bu yüz ifadesi iletişime açık ve dinlemeye hazır bir mesaj veriyor.',
                feedbackWrong: 'Bu yüz ifadesi daha çok “dinlemeye hazırım” mesajı verir.'
            }
        ]
    },
    symbol_match: {
        title: 'Simge ve Rutin Eşleştirme',
        description: 'Günlük yaşam simgelerini ihtiyaç, etkinlik ve rutinlerle eşleştirme çalışması.',
        badge: 'Rutin',
        steps: [
            {
                emoji: '🍽️',
                title: 'Rutini seç',
                prompt: 'Tabak ve kaşık simgesi gösteriliyor. Bu simge hangi günlük rutini anlatır?',
                visualCopy: 'Tabak + kaşık',
                options: ['Yemek zamanı', 'Uyku zamanı', 'Dışarı çıkma'],
                correctIndex: 0,
                feedbackCorrect: 'Evet. Bu simge yemek zamanını anlatır.',
                feedbackWrong: 'Bu simge yemek zamanını gösterir.'
            },
            {
                emoji: '✋',
                title: 'Temel işareti anla',
                prompt: 'Avuç içi açık ve öne dönük. Bu temel işaret günlük kullanımda en çok ne anlatır?',
                visualCopy: 'Açık avuç öne dönük',
                options: ['Bekle', 'Koş', 'Bitir'],
                correctIndex: 0,
                feedbackCorrect: 'Doğru. Bu işaret genelde “bekle” anlamına gelir.',
                feedbackWrong: 'Bu görsel daha çok “bekle” anlamına gelir.'
            }
        ]
    }
};

// =============================================
// LIPSYNC + KARAKTER MOTORU
// =============================================
const CharacterEmotion = {
    NEUTRAL: 'neutral',
    HAPPY: 'happy',
    THINKING: 'thinking',
    SAD: 'sad',
    EXCITED: 'excited'
};

let audioCtx = null;
let analyserNode = null;
let lipsyncRaf = null;
let currentEmotion = CharacterEmotion.NEUTRAL;

function getActiveLipsyncElements() {
    const wrappers = Array.from(document.querySelectorAll('.avatar-lipsync-wrap'));
    for (const wrap of wrappers) {
        const container = wrap.closest('#game-container, #story-screen');
        if (!container || container.style.display === 'none') continue;
        const lipOuter = wrap.querySelector('.lip-outer');
        const lipInner = wrap.querySelector('.lip-inner');
        const overlay = wrap.querySelector('.emotion-overlay');
        if (lipOuter && lipInner) return { wrapper: wrap, lipOuter, lipInner, overlay };
    }
    return { wrapper: null, lipOuter: null, lipInner: null, overlay: null };
}

function initAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyserNode = audioCtx.createAnalyser();
        analyserNode.fftSize = 256;
        analyserNode.smoothingTimeConstant = 0.6;
    }
}

function startLipsync() {
    const { wrapper, lipOuter, lipInner } = getActiveLipsyncElements();
    if (!lipOuter || !analyserNode) return;

    const dataArray = new Uint8Array(analyserNode.frequencyBinCount);

    function animate() {
        lipsyncRaf = requestAnimationFrame(animate);
        analyserNode.getByteFrequencyData(dataArray);
        const speechBins = dataArray.slice(2, 25);
        const avg = speechBins.reduce((a, b) => a + b, 0) / speechBins.length;
        const openAmount = Math.min(8, (avg / 255) * 14);
        let viseme = 'closed';
        if (openAmount > 5.3) viseme = 'open';
        else if (openAmount > 2.2) viseme = 'mid';
        if (wrapper) wrapper.dataset.viseme = viseme;

        const rx = viseme === 'open' ? 13 : (viseme === 'mid' ? 11.2 : 10);
        const ry = viseme === 'open' ? 10.5 : (viseme === 'mid' ? 6 : 3.2);

        lipOuter.setAttribute('ry', ry.toFixed(1));
        lipOuter.setAttribute('rx', rx.toFixed(1));
        lipInner.setAttribute('ry', viseme === 'open' ? '6.8' : (viseme === 'mid' ? '3.2' : '0.8'));
        lipInner.style.opacity = viseme === 'closed' ? '0' : '1';
    }
    animate();
}

function stopLipsync() {
    if (lipsyncRaf) cancelAnimationFrame(lipsyncRaf);
    const { wrapper, lipOuter, lipInner } = getActiveLipsyncElements();
    if (wrapper) wrapper.dataset.viseme = 'closed';
    if (lipOuter) { lipOuter.setAttribute('ry', '3'); lipOuter.setAttribute('rx', '10'); }
    if (lipInner) lipInner.style.opacity = '0';
}

function setCharacterEmotion(emotion) {
    currentEmotion = emotion;
    const { overlay } = getActiveLipsyncElements();
    if (!overlay) return;
    overlay.className = `emotion-overlay emotion-${emotion}`;
}

function celebrateCorrectAnswer() {
    setCharacterEmotion(CharacterEmotion.EXCITED);
    confetti({ particleCount: 60, spread: 70 });
    setTimeout(() => setCharacterEmotion(CharacterEmotion.NEUTRAL), 3000);
}

// =============================================
// EKRAN YÖNETİMİ
// =============================================
function showOnly(id) {
    const screens = ['start-screen','student-setup-screen','menu-screen','hearing-support-screen','game-container','story-select-screen','story-screen','report-screen'];
    screens.forEach(s => {
        const el = document.getElementById(s);
        if (el) el.style.display = 'none';
    });
    const target = document.getElementById(id);
    if (target) target.style.display = 'flex';
    currentScreenId = id;
    if (id === 'menu-screen') {
        requestAnimationFrame(() => renderCityScene());
    }
}

function getChildNameFromUser(user) {
    if (!user) return "";

    const displayName = user.user_metadata && user.user_metadata.display_name;
    if (displayName && displayName.trim()) return displayName.trim();

    if (user.email) return user.email.split('@')[0];

    return "Arkadaşım";
}

function getOnboardingStorageKey() {
    return currentUserEmail ? `onboarding_seen_${currentUserEmail}` : '';
}

function updateMenuIdentity() {
    const emailEl = document.getElementById('account-email');
    const studentEl = document.getElementById('active-student-name');
    if (emailEl) {
        const roleLabel = currentUserRole === 'specialist' ? 'Uzman' : 'Veli';
        emailEl.textContent = currentUserEmail ? `${currentUserEmail} • ${roleLabel}` : 'Misafir';
    }
    if (studentEl) {
        studentEl.textContent = activeStudentName || 'Henüz seçilmedi';
    }
}

function openOnboarding() {
    const panel = document.getElementById('onboarding-panel');
    if (!panel) return;

    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
}

function dismissOnboarding(persistPreference) {
    const panel = document.getElementById('onboarding-panel');
    if (panel) panel.style.display = 'none';

    if (persistPreference) {
        const storageKey = getOnboardingStorageKey();
        if (storageKey) localStorage.setItem(storageKey, '1');
    }
}

async function logout() {
    const confirmed = window.confirm('Çıkış yapmak istiyor musun? Bu cihazda tekrar giriş yapman gerekecek.');
    if (!confirmed) return;

    const { error } = await supabaseClient.auth.signOut();
    if (error) {
        alert('Çıkış yapılırken bir hata oluştu. Lütfen tekrar dene.');
    }
}
async function startApp(resetSession) {
    if (appStarted && !resetSession) {
        if (currentScreenId && currentScreenId !== 'start-screen') {
            showOnly(currentScreenId);
        } else {
            showOnly('menu-screen');
        }
        renderCityScene();
        return;
    }
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
    if (!appStarted || resetSession) {
        sessionData.startTime = Date.now();
        sessionData.therapyTurns = [];
        sessionData.storyChoices = [];
        sessionData.storyCompleted = false;
        sessionData.storyName = '';
        sessionData.totalScenesReached = 0;
        sessionData.totalScenes = 0;
        sessionData.micUsedInStory = 0;
        sessionData.micUsedInTherapy = 0;
        sessionData.reportEntryId = null;
    }

    document.getElementById('menu-greeting').textContent = `Merhaba, ${childName}! 🌟`;
    const hasStudentContext = await ensureActiveStudent();
    if (!hasStudentContext) return;

    document.getElementById('menu-greeting').textContent = `Merhaba, ${activeStudentName || childName}!`;
    document.getElementById('menu-greeting').textContent = `Merhaba, ${activeStudentName || childName}!`;
    appStarted = true;
    updateMenuIdentity();
    showOnly('menu-screen');
    renderCityScene();
    dismissOnboarding(false);
}

async function initializeAuth() {
    try {
        const { data, error } = await supabaseClient.auth.getSession();
        if (error) throw error;

        const user = data.session && data.session.user;
        if (user) {
            childName = getChildNameFromUser(user);
            currentUserEmail = user.email || '';
            currentUserRole = getUserRoleFromUser(user);
            startApp(false);
            return;
        }
    } catch (error) {
        console.error('Oturum kontrol edilemedi:', error);
    }

    showOnly('start-screen');
}

supabaseClient.auth.onAuthStateChange(function(event, session) {
    if (event === 'SIGNED_IN' && session && session.user) {
        childName = getChildNameFromUser(session.user);
        currentUserEmail = session.user.email || '';
        currentUserRole = getUserRoleFromUser(session.user);
        startApp(false);
    }

    if (event === 'SIGNED_OUT') {
        persistSessionSnapshot();
        appStarted = false;
        childName = "";
        currentUserEmail = "";
        currentUserRole = "parent";
        dismissOnboarding(false);
        showOnly('start-screen');
    }
});

document.addEventListener('DOMContentLoaded', initializeAuth);
window.addEventListener('pagehide', persistSessionSnapshot);
document.addEventListener('DOMContentLoaded', function() {
    ensureStudentEnhancements();
    const side = document.querySelector('.story-side');
    if (side) defaultStorySideMarkup = side.innerHTML;
    renderStoryLibrary();
    renderStoryResumeCard();
    syncCityEntryPlacement(false);
    renderCityScene();
});

function syncCityEntryPlacement(useTherapyHost) {
    const cityShell = document.getElementById('cityEntryShell');
    const menuHost = document.getElementById('menuCityHost');
    const therapyHost = document.getElementById('therapyCityHost');
    const startBtn = document.getElementById('cityStartBtn');
    if (!cityShell || !menuHost || !therapyHost) return;
    const targetHost = useTherapyHost ? therapyHost : menuHost;
    cityShell.classList.toggle('therapy-entry-card', !useTherapyHost);
    cityShell.classList.toggle('therapy-city-shell', useTherapyHost);
    if (startBtn) {
        startBtn.onclick = useTherapyHost ? startFocusedCityLocation : goToTherapy;
    }
    if (cityShell.parentElement !== targetHost) {
        targetHost.appendChild(cityShell);
    }
}

function setTherapySelectionMode(isSelecting) {
    syncCityEntryPlacement(isSelecting);
    const cityShell = document.getElementById('cityEntryShell');
    const sideCard = document.getElementById('therapySideCard');
    document.querySelectorAll('.therapy-session-ui').forEach((element) => {
        element.style.display = isSelecting ? 'none' : '';
    });
    if (cityShell) {
        cityShell.style.display = isSelecting ? '' : 'none';
    }
    if (sideCard) {
        sideCard.style.display = isSelecting ? 'none' : '';
    }
}

function goToMenu() {
    window.speechSynthesis.cancel();
    clearTimeout(idleTimer);
    setTherapySelectionMode(false);
    syncCityEntryPlacement(false);
    const cityShell = document.getElementById('cityEntryShell');
    if (cityShell) cityShell.style.display = '';
    showOnly('menu-screen');
    renderCityScene();
}

function goToTherapy() {
    showOnly('game-container');
    setTherapySelectionMode(true);
    renderCityScene();
}

function renderHearingModuleList() {
    const listEl = document.getElementById('hearingModuleList');
    if (!listEl) return;

    listEl.innerHTML = Object.entries(HEARING_SUPPORT_MODULES).map(([key, module]) => `
        <button type="button" class="hearing-module-card ${currentHearingModuleKey === key ? 'active' : ''}" onclick="startHearingModule('${key}')">
            <span class="hearing-module-badge">${module.badge}</span>
            <strong>${module.title}</strong>
            <p>${module.description}</p>
        </button>
    `).join('');
}

function renderHearingStep() {
    const titleEl = document.getElementById('hearingTitle');
    const descEl = document.getElementById('hearingDescription');
    const stepLabelEl = document.getElementById('hearingStepLabel');
    const promptEl = document.getElementById('hearingPrompt');
    const visualEmojiEl = document.getElementById('hearingVisualEmoji');
    const visualTitleEl = document.getElementById('hearingVisualTitle');
    const visualCopyEl = document.getElementById('hearingVisualCopy');
    const optionsEl = document.getElementById('hearingOptions');
    const feedbackEl = document.getElementById('hearingFeedback');
    const nextBtn = document.getElementById('hearingNextBtn');
    if (!titleEl || !descEl || !stepLabelEl || !promptEl || !visualEmojiEl || !visualTitleEl || !visualCopyEl || !optionsEl || !feedbackEl || !nextBtn) return;

    const module = HEARING_SUPPORT_MODULES[currentHearingModuleKey];
    if (!module) {
        titleEl.textContent = 'İşitme desteği çalışmaları';
        descEl.textContent = 'Soldaki modüllerden birini seçerek günlük yaşama yakın görsel etkinlikleri açabilirsin.';
        stepLabelEl.textContent = 'Modül seç';
        promptEl.textContent = 'Hazır olduğunda bir modül seç.';
        visualEmojiEl.textContent = '◉';
        visualTitleEl.textContent = 'Görsel odak';
        visualCopyEl.textContent = 'Seçilen modülün ana ipucu burada gösterilir.';
        optionsEl.innerHTML = '';
        feedbackEl.textContent = 'Bu alanda her seçimden sonra kısa ve açıklayıcı geri bildirim göreceksin.';
        nextBtn.disabled = true;
        return;
    }

    const step = module.steps[currentHearingStepIndex];
    titleEl.textContent = module.title;
    descEl.textContent = module.description;
    stepLabelEl.textContent = `Adım ${currentHearingStepIndex + 1}/${module.steps.length}`;
    promptEl.textContent = step.prompt;
    visualEmojiEl.textContent = step.emoji;
    visualTitleEl.textContent = step.title;
    visualCopyEl.textContent = step.visualCopy;
    feedbackEl.textContent = 'Doğru cevabı bulunca sonraki adıma geçebilirsin.';
    nextBtn.disabled = true;

    optionsEl.innerHTML = step.options.map((option, index) => `
        <button type="button" class="hearing-option-btn" onclick="chooseHearingOption(${index})">${option}</button>
    `).join('');
}

function startHearingModule(moduleKey) {
    currentHearingModuleKey = moduleKey;
    currentHearingStepIndex = 0;
    renderHearingModuleList();
    renderHearingStep();
}

function chooseHearingOption(optionIndex) {
    const module = HEARING_SUPPORT_MODULES[currentHearingModuleKey];
    if (!module) return;

    const step = module.steps[currentHearingStepIndex];
    const feedbackEl = document.getElementById('hearingFeedback');
    const nextBtn = document.getElementById('hearingNextBtn');
    const optionButtons = Array.from(document.querySelectorAll('.hearing-option-btn'));
    if (!feedbackEl || !nextBtn || !optionButtons.length) return;

    optionButtons.forEach((button, index) => {
        button.disabled = true;
        if (index === step.correctIndex) button.classList.add('correct');
        if (index === optionIndex && index !== step.correctIndex) button.classList.add('wrong');
    });

    feedbackEl.textContent = optionIndex === step.correctIndex ? step.feedbackCorrect : step.feedbackWrong;
    nextBtn.disabled = false;
}

function nextHearingStep() {
    const module = HEARING_SUPPORT_MODULES[currentHearingModuleKey];
    if (!module) return;

    if (currentHearingStepIndex < module.steps.length - 1) {
        currentHearingStepIndex += 1;
        renderHearingStep();
        return;
    }

    const titleEl = document.getElementById('hearingTitle');
    const descEl = document.getElementById('hearingDescription');
    const stepLabelEl = document.getElementById('hearingStepLabel');
    const promptEl = document.getElementById('hearingPrompt');
    const visualEmojiEl = document.getElementById('hearingVisualEmoji');
    const visualTitleEl = document.getElementById('hearingVisualTitle');
    const visualCopyEl = document.getElementById('hearingVisualCopy');
    const optionsEl = document.getElementById('hearingOptions');
    const feedbackEl = document.getElementById('hearingFeedback');
    const nextBtn = document.getElementById('hearingNextBtn');
    if (!titleEl || !descEl || !stepLabelEl || !promptEl || !visualEmojiEl || !visualTitleEl || !visualCopyEl || !optionsEl || !feedbackEl || !nextBtn) return;

    titleEl.textContent = `${module.title} tamamlandı`;
    descEl.textContent = 'Bu modülü bitirdin. İstersen aynı alanı tekrar açabilir ya da rapora geçebilirsin.';
    stepLabelEl.textContent = 'Tamamlandı';
    promptEl.textContent = 'Görsel odaklı tüm adımları tamamladın.';
    visualEmojiEl.textContent = '✓';
    visualTitleEl.textContent = 'Modül bitti';
    visualCopyEl.textContent = 'Şimdi başka bir modül seçerek devam edebiliriz.';
    optionsEl.innerHTML = '';
    feedbackEl.textContent = 'Planlı ve anlaşılır bir görsel takip çalışmasını tamamladın.';
    nextBtn.disabled = true;
}

function goToHearingSupport() {
    renderHearingModuleList();
    renderHearingStep();
    showOnly('hearing-support-screen');
}

function goToStories() {
    renderStoryLibrary();
    renderStoryResumeCard();
    showOnly('story-select-screen');
}

function exitStory() {
    window.speechSynthesis.cancel();
    const v = document.getElementById('storyBgVideo');
    v.pause();
    v.src = '';
    saveStoryProgress();
    renderStoryResumeCard();
    showOnly('story-select-screen');
}

function getDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getMonthKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function formatHistoryDate(dateKey) {
    const date = new Date(`${dateKey}T12:00:00`);
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function createSessionHistoryId() {
    if (window.crypto && window.crypto.randomUUID) {
        return window.crypto.randomUUID();
    }

    return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(ch) {
        const rand = Math.random() * 16 | 0;
        const val = ch === 'x' ? rand : (rand & 0x3 | 0x8);
        return val.toString(16);
    });
}

function mapHistoryRow(row) {
    return {
        id: row.id,
        createdAt: row.created_at,
        dateKey: row.session_date,
        childName: row.child_name || '',
        durationMin: row.duration_min || 0,
        totalMic: row.total_mic || 0,
        storyPct: row.story_pct || '-',
        totalTurns: row.total_turns || 0,
        storyCompleted: !!row.story_completed,
        storyName: row.story_name || '',
        totalScenesReached: row.total_scenes_reached || 0,
        totalScenes: row.total_scenes || 0,
        micUsedInStory: row.mic_used_in_story || 0,
        micUsedInTherapy: row.mic_used_in_therapy || 0,
        therapyTurns: Array.isArray(row.therapy_turns) ? row.therapy_turns : [],
        storyChoices: Array.isArray(row.story_choices) ? row.story_choices : [],
    };
}

async function getCurrentUserId() {
    const result = await supabaseClient.auth.getUser();
    return result && result.data && result.data.user ? result.data.user.id : null;
}

function getStudentStorageKey(userId) {
    return userId ? `active_student_${userId}` : '';
}

function setActiveStudent(student) {
    activeStudentId = student && student.id ? student.id : '';
    activeStudentName = student && student.full_name ? student.full_name : '';
    if (activeStudentName) childName = activeStudentName;
    updateMenuIdentity();
    syncStudentForm(student);
    renderRoleDashboard();
    renderStudentDetailPanel();
}

function ensureStudentEnhancements() {
    const createBtn = document.getElementById('createStudentBtn');
    const existingUpdateBtn = document.getElementById('updateStudentBtn');
    if (createBtn && !existingUpdateBtn) {
        const updateBtn = document.createElement('button');
        updateBtn.type = 'button';
        updateBtn.id = 'updateStudentBtn';
        updateBtn.className = 'menu-ghost-btn student-secondary-btn';
        updateBtn.textContent = 'Bilgileri Güncelle';
        updateBtn.style.display = 'none';
        updateBtn.onclick = updateStudent;
        createBtn.insertAdjacentElement('afterend', updateBtn);
    }

    const menuHeader = document.querySelector('.menu-header');
    if (menuHeader && !document.querySelector('.menu-insights')) {
        const insights = document.createElement('div');
        insights.className = 'menu-insights';
        insights.innerHTML = `
            <div class="menu-insight-card">
                <span class="menu-insight-label">Panel Modu</span>
                <strong id="role-mode-title">Veli Paneli</strong>
                <p id="role-mode-copy">Seçili öğrenci için doğru akışı seçip oturumları tek panelden takip edebilirsin.</p>
            </div>
            <div class="menu-insight-card">
                <span class="menu-insight-label">Öğrenci Özeti</span>
                <strong id="student-summary-name">Henüz seçilmedi</strong>
                <p id="student-summary-copy">Öğrenci seçince notları ve temel bilgileri burada göreceksin.</p>
            </div>
            <div class="menu-insight-card">
                <span class="menu-insight-label">Toplam Öğrenci</span>
                <strong id="student-count-value">0</strong>
                <p id="student-count-copy">Bu hesap için takip edilen aktif öğrenci sayısı.</p>
            </div>
        `;
        menuHeader.insertAdjacentElement('afterend', insights);
    }

    if (menuHeader && !document.getElementById('student-detail-panel')) {
        const detailPanel = document.createElement('section');
        detailPanel.id = 'student-detail-panel';
        detailPanel.className = 'student-detail-panel';
        detailPanel.innerHTML = `
            <div class="student-detail-head">
                <div>
                    <span class="student-detail-kicker">Seçili Öğrenci</span>
                    <h3 id="student-detail-title">Öğrenci seçilmedi</h3>
                    <p id="student-detail-subtitle">Bir öğrenci seçtiğinde güçlü yönler, destek notları ve oturum özeti burada görünür.</p>
                </div>
                <button type="button" class="menu-ghost-btn" onclick="openStudentSetup()">Öğrenci Yönet</button>
            </div>
            <div class="student-detail-grid">
                <div class="student-detail-card">
                    <span class="student-detail-label">Destek Notu</span>
                    <p id="student-detail-notes">Henüz destek notu eklenmedi.</p>
                </div>
                <div class="student-detail-card">
                    <span class="student-detail-label">Öğrenme Odağı</span>
                    <p id="student-detail-goal">Destek notlarına göre odak alanı burada özetlenir.</p>
                </div>
                <div class="student-detail-card">
                    <span class="student-detail-label">Son Oturum</span>
                    <p id="student-detail-session">Henüz kayıtlı oturum yok.</p>
                </div>
            </div>
            <div class="student-detail-meta-row">
                <div class="student-mini-stat">
                    <span>Toplam Oturum</span>
                    <strong id="student-detail-total-sessions">0</strong>
                </div>
                <div class="student-mini-stat">
                    <span>Toplam Dakika</span>
                    <strong id="student-detail-total-minutes">0 dk</strong>
                </div>
                <div class="student-mini-stat">
                    <span>Son Kayıt Özeti</span>
                    <strong id="student-detail-story-progress">-</strong>
                </div>
            </div>
        `;
        menuHeader.insertAdjacentElement('afterend', detailPanel);
    }

    ensureMenuWorkspace();
}

function ensureMenuWorkspace() {
    const menuScreen = document.getElementById('menu-screen');
    const menuHeader = document.querySelector('.menu-header');
    const menuTopbar = document.querySelector('.menu-topbar');
    const onboardingPanel = document.getElementById('onboarding-panel');
    const cards = document.querySelector('.menu-cards');
    const insights = document.querySelector('.menu-insights');
    if (!menuScreen || !menuHeader || !menuTopbar || !onboardingPanel || !cards || !insights) return;

    let shell = document.getElementById('menu-app-shell');
    let sidebar = document.getElementById('menu-sidebar');
    let mainPane = document.getElementById('menu-main-pane');
    if (!shell) {
        shell = document.createElement('div');
        shell.id = 'menu-app-shell';
        shell.className = 'menu-app-shell';

        sidebar = document.createElement('aside');
        sidebar.id = 'menu-sidebar';
        sidebar.className = 'menu-sidebar';
        sidebar.innerHTML = `
            <div class="sidebar-brand">
                <img src="avatar.png" class="sidebar-brand-avatar" alt="Yıldız Can">
                <div>
                    <strong>Yıldız Sınıfı</strong>
                    <span>Çocuk destek paneli</span>
                </div>
            </div>
            <div class="sidebar-section">
                <span class="sidebar-label">Çalışma Alanları</span>
                <button type="button" class="sidebar-nav-btn active" data-section="overview">Genel Bakış</button>
                <button type="button" class="sidebar-nav-btn" data-section="students">Öğrenciler</button>
                <button type="button" class="sidebar-nav-btn" data-section="guide">Rehber</button>
                <button type="button" class="sidebar-nav-btn" data-section="activities">Oturumlar</button>
            </div>
            <div class="sidebar-section">
                <span class="sidebar-label">Hızlı Erişim</span>
                <button type="button" class="sidebar-link-btn" onclick="goToTherapy()">Konuşma Terapisti</button>
                <button type="button" class="sidebar-link-btn" onclick="goToReport()">Veli Raporu</button>
                <button type="button" class="sidebar-link-btn" onclick="openStudentSetup()">Öğrenci Yönetimi</button>
            </div>
        `;

        mainPane = document.createElement('div');
        mainPane.id = 'menu-main-pane';
        mainPane.className = 'menu-main-pane';

        shell.appendChild(sidebar);
        shell.appendChild(mainPane);
        menuScreen.appendChild(shell);
    } else {
        sidebar = document.getElementById('menu-sidebar');
        mainPane = document.getElementById('menu-main-pane');
    }

    if (mainPane && menuTopbar.parentNode !== mainPane) {
        mainPane.appendChild(menuTopbar);
    }
    if (mainPane && menuHeader.parentNode !== mainPane) {
        mainPane.appendChild(menuHeader);
    }

    if (sidebar) {
        sidebar.querySelectorAll('.sidebar-nav-btn').forEach(btn => {
            if (!btn.dataset.bound) {
                btn.dataset.bound = '1';
                btn.addEventListener('click', () => switchMenuSection(btn.dataset.section));
            }
        });
    }

    let nav = document.getElementById('menu-workspace-nav');
    if (!nav) {
        nav = document.createElement('div');
        nav.id = 'menu-workspace-nav';
        nav.className = 'menu-workspace-nav';
        nav.innerHTML = `
            <button type="button" class="workspace-tab active" data-section="overview">Genel Bakış</button>
            <button type="button" class="workspace-tab" data-section="students">Öğrenciler</button>
            <button type="button" class="workspace-tab" data-section="guide">Rehber</button>
            <button type="button" class="workspace-tab" data-section="activities">Oturumlar</button>
        `;
        mainPane.appendChild(nav);
        nav.querySelectorAll('.workspace-tab').forEach(btn => {
            btn.addEventListener('click', () => switchMenuSection(btn.dataset.section));
        });
    }

    if (!document.getElementById('menu-overview-section')) {
        const overview = document.createElement('section');
        overview.id = 'menu-overview-section';
        overview.className = 'menu-workspace-section';
        mainPane.appendChild(overview);
        overview.innerHTML = `
            <div class="workspace-section-head">
                <span class="workspace-section-kicker">Genel Bakış</span>
                <h3>Bugünkü genel durum</h3>
                <p>Rolüne ve seçili öğrenciye göre hızlı bir özet, yönlendirme ve bir sonraki adımı gör.</p>
            </div>
        `;
        overview.appendChild(insights);
        overview.appendChild(onboardingPanel);
    }

    if (!document.getElementById('menu-students-section')) {
        const students = document.createElement('section');
        students.id = 'menu-students-section';
        students.className = 'menu-workspace-section';
        mainPane.appendChild(students);
        students.innerHTML = `
            <div class="workspace-section-head">
                <span class="workspace-section-kicker">Öğrenciler</span>
                <h3>Öğrenci yönetimi</h3>
                <p>Seçili öğrenciyi incele, destek notlarını güncelle ve hangi çalışmaya ihtiyacı olduğunu gör.</p>
            </div>
            <div class="students-section-actions">
                <button type="button" class="menu-ghost-btn" onclick="openStudentSetup()">Öğrenci seç veya ekle</button>
                <button type="button" class="menu-ghost-btn" onclick="openOnboarding()">Kullanım rehberini aç</button>
            </div>
        `;
    }

    if (!document.getElementById('menu-guide-section')) {
        const guide = document.createElement('section');
        guide.id = 'menu-guide-section';
        guide.className = 'menu-workspace-section';
        mainPane.appendChild(guide);
        guide.innerHTML = `
            <div class="workspace-section-head">
                <span class="workspace-section-kicker">Rehber</span>
                <h3>Öğretici kullanım akışı</h3>
                <p>Karmaşayı azaltmak için her oturumda terapi ve rapor odağında net bir akış sunuyoruz.</p>
            </div>
            <div class="guide-grid">
                <article class="guide-card">
                    <span class="guide-card-step">1. Hazırlık</span>
                    <h4>Öğrenci notlarını oku</h4>
                    <p>Destek notları çocuğun ilgisini, zorlandığı alanları ve dili nasıl sade tutman gerektiğini hatırlatır.</p>
                </article>
                <article class="guide-card">
                    <span class="guide-card-step">2. Uygulama</span>
                    <h4>Kısa terapiyle başla</h4>
                    <p>İlk olarak konuşma terapisti açılıp mikrofon, dikkat ve kısa cevap akışı denenebilir.</p>
                </article>
                <article class="guide-card">
                    <span class="guide-card-step">3. Pekiştirme</span>
                    <h4>Oturumu notla</h4>
                    <p>Terapi sırasında verilen yanıtları ve dikkat düzeyini gözleyip raporda anlamlı bir özet oluşmasını sağla.</p>
                </article>
                <article class="guide-card guide-card-accent">
                    <span class="guide-card-step">4. Gözlem</span>
                    <h4>Raporla kapat</h4>
                    <p>Son adımda veli raporundan süre, katılım ve değerlendirme özetini inceleyip bir sonraki oturuma not çıkar.</p>
                </article>
            </div>
        `;
    }

    if (!document.getElementById('menu-activities-section')) {
        const activities = document.createElement('section');
        activities.id = 'menu-activities-section';
        activities.className = 'menu-workspace-section';
        mainPane.appendChild(activities);
        activities.innerHTML = `
            <div class="workspace-section-head">
                <span class="workspace-section-kicker">Oturumlar</span>
                <h3>Çalışma alanını seç</h3>
                <p>Bugün konuşma terapisi başlatabilir veya önceki oturumların veli raporlarını inceleyebilirsin.</p>
            </div>
            <div class="activity-playbook">
                <div class="activity-playbook-card">
                    <strong>Hızlı başlangıç</strong>
                    <p>Dikkat dağınıksa önce terapiyi açıp 3-4 kısa yanıtla ısın.</p>
                </div>
                <div class="activity-playbook-card">
                    <strong>Terapi odağı</strong>
                    <p>Bugünün hedefi kısa yanıt, cümle kurma ya da anlama çalışmasıysa konuşma terapisiyle ilerle.</p>
                </div>
                <div class="activity-playbook-card">
                    <strong>Rapor odağı</strong>
                    <p>Önceki oturumları karşılaştırmak, süreyi görmek ve AI değerlendirmesini okumak için raporu aç.</p>
                </div>
                <div class="activity-playbook-card">
                    <strong>Takip</strong>
                    <p>Oturum bitince veli raporuna geçip hangi sorularda daha iyi katılım olduğunu kontrol et.</p>
                </div>
            </div>
        `;
        activities.appendChild(cards);
    }

    const studentsSection = document.getElementById('menu-students-section');
    const detailPanel = document.getElementById('student-detail-panel');
    if (studentsSection && detailPanel && detailPanel.parentNode !== studentsSection) {
        studentsSection.appendChild(detailPanel);
    }

    renderLearningAreaBlueprint();

    switchMenuSection(currentMenuSection);
}

function inferLearningArea(student) {
    const notes = ((student && student.support_notes) || '').toLocaleLowerCase('tr-TR');
    if (notes.includes('dikkat') || notes.includes('görsel') || notes.includes('odak')) {
        return LEARNING_AREAS.find(area => area.key === 'visual');
    }
    if (notes.includes('rutin') || notes.includes('bekle') || notes.includes('yardım') || notes.includes('özbakım')) {
        return LEARNING_AREAS.find(area => area.key === 'daily');
    }
    return LEARNING_AREAS.find(area => area.key === 'speech');
}

function buildLearningAreaCards() {
    return LEARNING_AREAS.map(area => `
        <article class="learning-area-card">
            <div class="learning-area-head">
                <span class="learning-area-age">${area.ageRange}</span>
                <strong>${area.title}</strong>
            </div>
            <p>${area.summary}</p>
            <div class="learning-area-list">
                ${area.outcomes.map(item => `<span>${item}</span>`).join('')}
            </div>
            <div class="learning-area-screen">${area.screenPlan}</div>
        </article>
    `).join('');
}

function renderLearningAreaBlueprint() {
    const showcase = document.getElementById('learning-area-showcase');
    if (showcase) showcase.remove();

    const roadmap = document.getElementById('learning-roadmap-panel');
    if (roadmap) roadmap.remove();
}

function switchMenuSection(section) {
    const sections = {
        overview: document.getElementById('menu-overview-section'),
        students: document.getElementById('menu-students-section'),
        guide: document.getElementById('menu-guide-section'),
        activities: document.getElementById('menu-activities-section')
    };
    currentMenuSection = sections[section] ? section : 'overview';

    Object.entries(sections).forEach(([key, el]) => {
        if (!el) return;
        el.style.display = key === currentMenuSection ? 'block' : 'none';
    });

    const nav = document.getElementById('menu-workspace-nav');
    if (nav) {
        nav.querySelectorAll('.workspace-tab').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.section === currentMenuSection);
        });
    }

    const sidebar = document.getElementById('menu-sidebar');
    if (sidebar) {
        sidebar.querySelectorAll('.sidebar-nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.section === currentMenuSection);
        });
    }
}

function syncStudentForm(student) {
    const nameEl = document.getElementById('studentNameInput');
    const yearEl = document.getElementById('studentBirthYearInput');
    const notesEl = document.getElementById('studentNotesInput');
    const updateBtn = document.getElementById('updateStudentBtn');
    if (!nameEl || !yearEl || !notesEl) return;

    if (!student) {
        nameEl.value = '';
        yearEl.value = '';
        notesEl.value = '';
        if (updateBtn) updateBtn.style.display = 'none';
        return;
    }

    nameEl.value = student.full_name || '';
    yearEl.value = student.birth_year || '';
    notesEl.value = student.support_notes || '';
    if (updateBtn) updateBtn.style.display = 'inline-flex';
}

function renderRoleDashboard() {
    const roleTitleEl = document.getElementById('role-mode-title');
    const roleCopyEl = document.getElementById('role-mode-copy');
    const studentSummaryNameEl = document.getElementById('student-summary-name');
    const studentSummaryCopyEl = document.getElementById('student-summary-copy');
    const studentCountEl = document.getElementById('student-count-value');
    const studentCountCopyEl = document.getElementById('student-count-copy');
    const student = studentsCache.find(item => item.id === activeStudentId);

    if (roleTitleEl) roleTitleEl.textContent = currentUserRole === 'specialist' ? 'Uzman Paneli' : 'Veli Paneli';
    if (roleCopyEl) {
        roleCopyEl.textContent = currentUserRole === 'specialist'
            ? 'Birden fazla öğrenciyi takip edip seçili öğrenci için seansları yönetebilirsin.'
            : 'Seçili öğrenci için uygun çalışmayı seçip gelişimini tek panelden izleyebilirsin.';
    }

    if (studentSummaryNameEl) studentSummaryNameEl.textContent = activeStudentName || 'Henüz seçilmedi';
    if (studentSummaryCopyEl) {
        if (student) {
            const note = student.support_notes ? student.support_notes : 'Destek notu henüz eklenmedi.';
            const yearText = student.birth_year ? `Doğum yılı: ${student.birth_year}. ` : '';
            studentSummaryCopyEl.textContent = `${yearText}${note}`;
        } else {
            studentSummaryCopyEl.textContent = 'Öğrenci seçince notları ve temel bilgileri burada göreceksin.';
        }
    }

    if (studentCountEl) studentCountEl.textContent = String(studentsCache.length);
    if (studentCountCopyEl) {
        studentCountCopyEl.textContent = currentUserRole === 'specialist'
            ? 'Bu uzman hesabına bağlı aktif öğrenci sayısı.'
            : 'Bu veli hesabında takip edilen aktif öğrenci sayısı.';
    }
}

async function loadStudentDetailMetrics(userId, studentId) {
    if (!userId || !studentId) {
        return { totalSessions: 0, totalMinutes: 0, latestSession: null };
    }

    const { data, error } = await supabaseClient
        .from('session_history')
        .select('created_at, duration_min, story_pct, story_completed, total_turns')
        .eq('user_id', userId)
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
        .limit(20);

    if (error) {
        console.error('Öğrenci oturum özetleri okunamadı:', error);
        return { totalSessions: 0, totalMinutes: 0, latestSession: null };
    }

    const rows = data || [];
    return {
        totalSessions: rows.length,
        totalMinutes: rows.reduce((sum, row) => sum + (row.duration_min || 0), 0),
        latestSession: rows[0] || null
    };
}

async function renderStudentDetailPanel() {
    const titleEl = document.getElementById('student-detail-title');
    const subtitleEl = document.getElementById('student-detail-subtitle');
    const notesEl = document.getElementById('student-detail-notes');
    const goalEl = document.getElementById('student-detail-goal');
    const sessionEl = document.getElementById('student-detail-session');
    const totalSessionsEl = document.getElementById('student-detail-total-sessions');
    const totalMinutesEl = document.getElementById('student-detail-total-minutes');
    const storyProgressEl = document.getElementById('student-detail-story-progress');
    if (!titleEl || !subtitleEl || !notesEl || !goalEl || !sessionEl || !totalSessionsEl || !totalMinutesEl || !storyProgressEl) return;

    const student = studentsCache.find(item => item.id === activeStudentId);
    if (!student) {
        titleEl.textContent = 'Öğrenci seçilmedi';
        subtitleEl.textContent = 'Bir öğrenci seçtiğinde güçlü yönler, destek notları ve oturum özeti burada görünür.';
        notesEl.textContent = 'Henüz destek notu eklenmedi.';
        goalEl.textContent = 'Destek notlarına göre odak alanı burada özetlenir.';
        sessionEl.textContent = 'Henüz kayıtlı oturum yok.';
        totalSessionsEl.textContent = '0';
        totalMinutesEl.textContent = '0 dk';
        storyProgressEl.textContent = '-';
        return;
    }

    titleEl.textContent = student.full_name || 'İsimsiz öğrenci';
    subtitleEl.textContent = student.birth_year
        ? `Doğum yılı ${student.birth_year}. Seçili öğrenci için destek notları ve oturum özeti burada.`
        : 'Seçili öğrenci için destek notları ve oturum özeti burada.';
    notesEl.textContent = student.support_notes || 'Henüz destek notu eklenmedi.';

    const userId = await getCurrentUserId();
    const metrics = await loadStudentDetailMetrics(userId, student.id);
    goalEl.textContent = student.support_notes
        ? `Odak: ${student.support_notes}`
        : (currentUserRole === 'specialist'
            ? 'Oturumdan önce destek notu ekleyerek yönlendirmeyi güçlendirebilirsin.'
            : 'Destek notu ekleyerek hangi beceriye odaklanacağını netleştirebilirsin.');

    const recommendedArea = inferLearningArea(student);
    if (recommendedArea) {
        goalEl.textContent = `${recommendedArea.title} (${recommendedArea.ageRange}) • ${recommendedArea.outcomes[0]}`;
    }

    if (metrics.latestSession) {
        const sessionDate = new Date(metrics.latestSession.created_at).toLocaleDateString('tr-TR');
        sessionEl.textContent = `${sessionDate} tarihinde ${metrics.latestSession.duration_min || 0} dk, ${metrics.latestSession.total_turns || 0} yanıt`;
        storyProgressEl.textContent = metrics.latestSession.story_completed ? 'Tamamlandı' : `${metrics.latestSession.total_turns || 0} yanıt`;
    } else {
        sessionEl.textContent = 'Henüz kayıtlı oturum yok.';
        storyProgressEl.textContent = '-';
    }

    totalSessionsEl.textContent = String(metrics.totalSessions);
    totalMinutesEl.textContent = `${metrics.totalMinutes} dk`;
}

function renderStudentList() {
    const listEl = document.getElementById('studentList');
    const statusEl = document.getElementById('studentStatus');
    if (!listEl || !statusEl) return;

    if (!studentsCache.length) {
        listEl.innerHTML = '';
        statusEl.textContent = 'Henüz öğrenci eklenmemiş. Devam etmek için ilk öğrencini oluştur.';
        return;
    }

    statusEl.textContent = 'Bir öğrenciyi seçebilir ya da yeni öğrenci ekleyebilirsin.';
    listEl.innerHTML = studentsCache.map(student => `
        <button type="button" class="student-card ${student.id === activeStudentId ? 'active' : ''}" onclick="selectStudent('${student.id}')">
            <h4>${student.full_name || 'İsimsiz öğrenci'}</h4>
            <p>${student.support_notes || 'Henüz destek notu eklenmedi.'}</p>
            <span class="student-card-meta">${student.birth_year ? `Doğum yılı: ${student.birth_year}` : 'Doğum yılı girilmedi'}</span>
        </button>
    `).join('');
    renderRoleDashboard();
    renderStudentDetailPanel();
}

async function loadStudentsForCurrentUser() {
    const userId = await getCurrentUserId();
    if (!userId) {
        studentsCache = [];
        return [];
    }

    const { data, error } = await supabaseClient
        .from('students')
        .select('id, full_name, birth_year, support_notes, active, created_at')
        .eq('active', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Öğrenciler yüklenemedi:', error);
        studentsCache = [];
        return [];
    }

    studentsCache = data || [];
    return studentsCache;
}

async function ensureActiveStudent() {
    const userId = await getCurrentUserId();
    if (!userId) return true;

    const students = await loadStudentsForCurrentUser();
    if (!students.length) {
        setActiveStudent(null);
        renderStudentList();
        showOnly('student-setup-screen');
        return false;
    }

    const storageKey = getStudentStorageKey(userId);
    const storedStudentId = storageKey ? localStorage.getItem(storageKey) : '';
    const matchedStudent = students.find(student => student.id === activeStudentId)
        || students.find(student => student.id === storedStudentId)
        || students[0];

    setActiveStudent(matchedStudent);
    if (storageKey && matchedStudent) localStorage.setItem(storageKey, matchedStudent.id);
    renderStudentList();
    return true;
}

async function selectStudent(studentId) {
    const userId = await getCurrentUserId();
    const student = studentsCache.find(item => item.id === studentId);
    if (!student) return;

    setActiveStudent(student);
    const storageKey = getStudentStorageKey(userId);
    if (storageKey) localStorage.setItem(storageKey, student.id);
    renderStudentList();
    renderStudentDetailPanel();
    showOnly('menu-screen');
}

async function createStudent() {
    const nameEl = document.getElementById('studentNameInput');
    const yearEl = document.getElementById('studentBirthYearInput');
    const notesEl = document.getElementById('studentNotesInput');
    const statusEl = document.getElementById('studentStatus');
    const createBtn = document.getElementById('createStudentBtn');
    const userId = await getCurrentUserId();
    if (!nameEl || !yearEl || !notesEl || !statusEl || !createBtn || !userId) return;

    const fullName = nameEl.value.trim();
    const birthYearRaw = yearEl.value.trim();
    const supportNotes = notesEl.value.trim();
    if (!fullName) {
        statusEl.textContent = 'Öğrenci adı zorunlu.';
        return;
    }

    createBtn.disabled = true;
    statusEl.textContent = 'Öğrenci oluşturuluyor...';
    const birthYear = birthYearRaw ? Number(birthYearRaw) : null;

    const { data, error } = await supabaseClient
        .from('students')
        .insert({
            created_by: userId,
            full_name: fullName,
            birth_year: Number.isFinite(birthYear) ? birthYear : null,
            support_notes: supportNotes
        })
        .select('id, full_name, birth_year, support_notes, active, created_at')
        .single();

    if (error) {
        console.error('Öğrenci oluşturulamadı:', error);
        statusEl.textContent = 'Öğrenci oluşturulamadı. Lütfen tekrar dene.';
        createBtn.disabled = false;
        return;
    }

    const linkTable = currentUserRole === 'specialist' ? 'specialist_student_links' : 'parent_student_links';
    const linkPayload = currentUserRole === 'specialist'
        ? { specialist_id: userId, student_id: data.id }
        : { parent_id: userId, student_id: data.id, relationship_label: 'parent' };
    await supabaseClient.from(linkTable).upsert(linkPayload, { onConflict: currentUserRole === 'specialist' ? 'specialist_id,student_id' : 'parent_id,student_id' });

    nameEl.value = '';
    yearEl.value = '';
    notesEl.value = '';
    createBtn.disabled = false;
    await ensureActiveStudent();
    await selectStudent(data.id);
}

async function openStudentSetup() {
    await ensureActiveStudent();
    showOnly('student-setup-screen');
}

async function updateStudent() {
    if (!activeStudentId) return;

    const nameEl = document.getElementById('studentNameInput');
    const yearEl = document.getElementById('studentBirthYearInput');
    const notesEl = document.getElementById('studentNotesInput');
    const statusEl = document.getElementById('studentStatus');
    const updateBtn = document.getElementById('updateStudentBtn');
    if (!nameEl || !yearEl || !notesEl || !statusEl || !updateBtn) return;

    const fullName = nameEl.value.trim();
    const birthYearRaw = yearEl.value.trim();
    const supportNotes = notesEl.value.trim();
    if (!fullName) {
        statusEl.textContent = 'Güncelleme için öğrenci adı zorunlu.';
        return;
    }

    updateBtn.disabled = true;
    statusEl.textContent = 'Öğrenci bilgileri güncelleniyor...';
    const birthYear = birthYearRaw ? Number(birthYearRaw) : null;

    const { error } = await supabaseClient
        .from('students')
        .update({
            full_name: fullName,
            birth_year: Number.isFinite(birthYear) ? birthYear : null,
            support_notes: supportNotes,
            updated_at: new Date().toISOString()
        })
        .eq('id', activeStudentId);

    updateBtn.disabled = false;
    if (error) {
        console.error('Öğrenci güncellenemedi:', error);
        statusEl.textContent = 'Öğrenci bilgileri güncellenemedi. Lütfen tekrar dene.';
        return;
    }

    statusEl.textContent = 'Öğrenci bilgileri güncellendi.';
    await ensureActiveStudent();
    await renderStudentDetailPanel();
}

function buildSessionSnapshot(userId, durationMin, totalMic, storyPct, totalTurns) {
    return {
        id: sessionData.reportEntryId || createSessionHistoryId(),
        user_id: userId,
        created_by: userId,
        student_id: activeStudentId || null,
        session_date: getDateKey(new Date()),
        child_name: activeStudentName || childName,
        duration_min: durationMin,
        total_mic: totalMic,
        story_pct: storyPct,
        total_turns: totalTurns,
        story_completed: sessionData.storyCompleted,
        story_name: sessionData.storyName,
        total_scenes_reached: sessionData.totalScenesReached,
        total_scenes: sessionData.totalScenes,
        mic_used_in_story: sessionData.micUsedInStory,
        mic_used_in_therapy: sessionData.micUsedInTherapy,
        therapy_turns: sessionData.therapyTurns.slice(),
        story_choices: sessionData.storyChoices.slice(),
    };
}

function hasSessionActivity() {
    return Boolean(
        sessionData.startTime ||
        sessionData.therapyTurns.length ||
        sessionData.storyChoices.length ||
        sessionData.micUsedInStory ||
        sessionData.micUsedInTherapy
    );
}

async function loadReportHistory() {
    const userId = await getCurrentUserId();
    if (!userId) return [];

    let query = supabaseClient
        .from('session_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(180);
    if (activeStudentId) query = query.eq('student_id', activeStudentId);
    const { data, error } = await query;

    if (error) {
        console.error('Supabase rapor geçmişi okunamadı:', error);
        return [];
    }

    return (data || []).map(mapHistoryRow);
}

async function persistSessionSnapshot() {
    if (!currentUserEmail || !hasSessionActivity()) return loadReportHistory();

    const userId = await getCurrentUserId();
    if (!userId) return [];

    const durationMs = sessionData.startTime ? Date.now() - sessionData.startTime : 0;
    const durationMin = Math.max(1, Math.round(durationMs / 60000));
    const totalMic = sessionData.micUsedInTherapy + sessionData.micUsedInStory;
    const storyPct = sessionData.totalScenes > 0
        ? Math.round((sessionData.totalScenesReached / sessionData.totalScenes) * 100) + '%'
        : '-';
    const totalTurns = sessionData.therapyTurns.length + sessionData.storyChoices.length + sessionData.micUsedInStory;
    const snapshot = buildSessionSnapshot(userId, durationMin, totalMic, storyPct, totalTurns);

    const { error } = await supabaseClient
        .from('session_history')
        .upsert(snapshot, { onConflict: 'id' });

    if (error) {
        console.error('Supabase rapor geçmişi kaydedilemedi:', error);
        return [];
    }

    sessionData.reportEntryId = snapshot.id;
    return loadReportHistory();
}

function getEntriesForDate(history, dateKey) {
    return history.filter(entry => entry.dateKey === dateKey);
}

function renderHistoryDetails(history, dateKey) {
    const detailEl = document.getElementById('historyDayDetails');
    if (!detailEl) return;

    const entries = getEntriesForDate(history, dateKey);
    if (!entries.length) {
        detailEl.innerHTML = '<p class="report-empty">Bu gün için kayıtlı bir oturum yok.</p>';
        return;
    }

    const totalMinutes = entries.reduce((sum, entry) => sum + (entry.durationMin || 0), 0);
    const totalTurns = entries.reduce((sum, entry) => sum + (entry.totalTurns || 0), 0);
    const totalMic = entries.reduce((sum, entry) => sum + (entry.totalMic || 0), 0);

    detailEl.innerHTML = `
        <div class="history-detail-card">
            <h4>${formatHistoryDate(dateKey)}</h4>
            <div class="history-detail-meta">
                ${entries.length} oturum kaydı • ${totalMinutes} dk toplam süre • ${totalTurns} toplam yanıt • ${totalMic} mikrofon kullanımı
            </div>
        </div>
        <div class="history-session-list">
            ${entries.map(entry => `
                <div class="history-session-item">
                    <div class="history-session-top">
                        <strong>${entry.storyName ? `${entry.storyName} + konuşma çalışması` : 'Konuşma çalışması'}</strong>
                        <span class="history-session-time">${new Date(entry.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div class="history-session-summary">
                        ${entry.durationMin} dk • ${entry.totalTurns} yanıt • ${entry.totalMic} mikrofon • Hikaye ilerleme: ${entry.storyCompleted ? 'Tamamlandı' : entry.storyPct}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderHistoryCalendar(history) {
    const monthDate = historyCalendarMonth || new Date();
    const gridEl = document.getElementById('historyCalendarGrid');
    const monthLabel = document.getElementById('historyMonthLabel');
    if (!gridEl || !monthLabel) return;

    const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const lastDay = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = lastDay.getDate();
    const historyByDate = history.reduce((acc, entry) => {
        acc[entry.dateKey] = (acc[entry.dateKey] || 0) + 1;
        return acc;
    }, {});

    monthLabel.textContent = monthDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
    gridEl.innerHTML = '';

    for (let i = 0; i < startOffset; i++) {
        const empty = document.createElement('div');
        empty.className = 'calendar-day-empty';
        gridEl.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
        const dateKey = getDateKey(date);
        const useCount = historyByDate[dateKey] || 0;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'calendar-day';
        if (useCount) btn.classList.add('used');
        if (selectedHistoryDateKey === dateKey) btn.classList.add('selected');
        btn.onclick = function() {
            selectedHistoryDateKey = dateKey;
            renderHistoryCalendar(history);
            renderHistoryDetails(history, dateKey);
        };
        btn.innerHTML = `
            <span class="calendar-day-number">${day}</span>
            <span class="calendar-day-meta">${useCount ? `${useCount} kayıt` : ''}</span>
        `;
        gridEl.appendChild(btn);
    }
}

function renderReportHistory(history) {
    if (!history.length) {
        const gridEl = document.getElementById('historyCalendarGrid');
        const detailEl = document.getElementById('historyDayDetails');
        const monthLabel = document.getElementById('historyMonthLabel');
        if (gridEl) gridEl.innerHTML = '';
        if (monthLabel) monthLabel.textContent = 'Kayıt yok';
        if (detailEl) detailEl.innerHTML = '<p class="report-empty">Henüz kayıtlı bir kullanım günü yok.</p>';
        return;
    }

    if (!selectedHistoryDateKey || !getEntriesForDate(history, selectedHistoryDateKey).length) {
        selectedHistoryDateKey = history[0].dateKey;
    }

    if (!historyCalendarMonth) {
        const selectedDate = new Date(`${selectedHistoryDateKey}T12:00:00`);
        historyCalendarMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    }

    renderHistoryCalendar(history);
    renderHistoryDetails(history, selectedHistoryDateKey);
}

function renderCitySessionSummary() {
    const container = document.getElementById('citySessionSummary');
    if (!container) return;

    const turns = sessionData.therapyTurns || [];
    if (!turns.length) {
        container.innerHTML = '<p class="report-empty">Henüz şehir temelli terapi oturumu yapılmadı.</p>';
        return;
    }

    const locationMap = new Map();
    turns.forEach((turn) => {
        const key = turn.location || 'Genel alan';
        const current = locationMap.get(key) || { count: 0, categories: new Set(), sample: '' };
        current.count += 1;
        if (turn.category) current.categories.add(turn.category);
        if (!current.sample && turn.question) current.sample = turn.question;
        locationMap.set(key, current);
    });

    const sortedLocations = [...locationMap.entries()].sort((a, b) => b[1].count - a[1].count);
    const topLocation = sortedLocations[0];

    container.innerHTML = `
        <div class="city-session-hero">
            <div>
                <span class="city-session-kicker">En yoğun alan</span>
                <strong>${topLocation[0]}</strong>
                <p>${topLocation[1].count} soru ile bu alan en çok çalışılan konuşma noktası oldu.</p>
            </div>
            <div class="city-session-meta">${sortedLocations.length} farklı mekân</div>
        </div>
        <div class="city-session-grid">
            ${sortedLocations.map(([label, data]) => `
                <article class="city-session-card">
                    <h4>${label}</h4>
                    <p>${data.count} soru • ${[...data.categories].join(', ') || 'Genel konuşma'}</p>
                    <span>${data.sample || 'Bu alanda yeni sorular çalışıldı.'}</span>
                </article>
            `).join('')}
        </div>
    `;
}

async function changeHistoryMonth(offset) {
    historyCalendarMonth = historyCalendarMonth || new Date();
    historyCalendarMonth = new Date(historyCalendarMonth.getFullYear(), historyCalendarMonth.getMonth() + offset, 1);
    const history = await loadReportHistory();
    const currentMonthKey = getMonthKey(historyCalendarMonth);
    const firstMatch = history.find(entry => entry.dateKey.startsWith(currentMonthKey));
    selectedHistoryDateKey = firstMatch ? firstMatch.dateKey : getDateKey(historyCalendarMonth);
    renderHistoryCalendar(history);
    renderHistoryDetails(history, selectedHistoryDateKey);
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
    const interventions = sessionData.storyChoices.filter(c => c.needsIntervention).length;
    const prosocials = sessionData.storyChoices.filter(c => c.ethicsScore > 0).length;
    const interventionEl = document.getElementById('statInterventions');
    if (interventionEl) interventionEl.textContent = `${interventions} / ${prosocials}`;

    const history = await persistSessionSnapshot();
    renderReportHistory(history);
    renderCitySessionSummary();

    const learningAreaPlanEl = document.getElementById('learningAreaPlan');
    if (learningAreaPlanEl) {
        const student = studentsCache.find(item => item.id === activeStudentId);
        const recommendedArea = inferLearningArea(student);
        learningAreaPlanEl.innerHTML = `
            <div class="learning-area-plan-card emphasis">
                <span class="learning-area-plan-label">Önerilen ilk odak</span>
                <strong>${recommendedArea.title}</strong>
                <p>${recommendedArea.summary}</p>
            </div>
            ${LEARNING_AREAS.map(area => `
                <div class="learning-area-plan-card">
                    <span class="learning-area-plan-label">${area.ageRange}</span>
                    <strong>${area.title}</strong>
                    <p>${area.outcomes.join(' • ')}</p>
                </div>
            `).join('')}
        `;
    }

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
            entry.innerHTML = `<div class="therapy-q">🎙️ ${t.location ? `${t.location} • ` : ''}${t.category ? `${t.category} • ` : ''}Soru: ${t.question}</div>${t.answer}`;
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
const THERAPY_CATEGORIES = {
    daily_life: {
        label: 'Günlük Hayat',
        summary: 'Rutinler, ihtiyaçlar ve ev-okul yaşamı üzerine kısa konuşmalar.',
        questions: [
            { q: "Sabah uyanınca ilk ne yaparsın?", query: "child morning routine home", goal: "günlük rutin anlatma" },
            { q: "Okula giderken yanına neler alırsın?", query: "child getting ready backpack school", goal: "nesne ve rutin anlatma" },
            { q: "Acıkınca evde ne söylersin?", query: "family kitchen child asking food", goal: "ihtiyaç ifade etme" },
            { q: "Markete gidince en çok hangi şeyi almak istersin?", query: "child with parent grocery store", goal: "tercih belirtme" },
            { q: "Akşam olunca evde en sevdiğin şey nedir?", query: "family evening home child smiling", goal: "günlük yaşamı anlatma" },
            { q: "Dışarı çıkmadan önce hangi hazırlıkları yaparsın?", query: "child putting on shoes jacket", goal: "adım sıralama" },
            { q: "Odanda en çok hangi eşyanı kullanırsın?", query: "child room toys books", goal: "eşya tanımlama" },
            { q: "Yemekten önce ellerin için ne yaparsın?", query: "child washing hands sink", goal: "özbakım rutini anlatma" },
            { q: "Eve misafir gelince onlara ne dersin?", query: "family visiting child greeting", goal: "günlük sosyal ifade" },
            { q: "Bugün evde sana en çok kim yardım etti?", query: "parent helping child at home", goal: "olay anlatma" }
        ]
    },
    emotions: {
        label: 'Duygular',
        summary: 'Mutlu, üzgün, heyecanlı gibi duyguları fark edip ifade etmeye odaklanır.',
        questions: [
            { q: "Bugün kendini en çok nasıl hissediyorsun?", query: "child face expression happy calm", goal: "duygu ifade etme" },
            { q: "Seni en hızlı ne mutlu eder?", query: "happy child playing family", goal: "neden belirtme" },
            { q: "Üzüldüğünde yanında ne olsun istersin?", query: "child comfort emotional support", goal: "duygusal ihtiyaç söyleme" },
            { q: "Heyecanlanınca bedeninde neler olur?", query: "excited child jumping smiling", goal: "bedensel farkındalık" },
            { q: "Korktuğunda kime haber verirsin?", query: "child seeking comfort parent", goal: "yardım isteme" },
            { q: "Bir arkadaşın seni sevindirince ne hissedersin?", query: "friends hugging happy child", goal: "duyguyu ilişkilendirme" },
            { q: "Canın sıkılınca kendini rahatlatmak için ne yaparsın?", query: "child calming down quiet activity", goal: "rahatlama stratejisi" },
            { q: "Bugün seni şaşırtan bir şey oldu mu?", query: "surprised child classroom", goal: "duygu ve olay anlatma" },
            { q: "Kızgın olduğunda sesini nasıl kullanman iyi olur?", query: "child taking deep breath calm", goal: "duygu düzenleme" },
            { q: "Mutlu olduğunda bunu yüzünden nasıl anlarız?", query: "child smiling face close up", goal: "duygu farkındalığı" }
        ]
    },
    social_communication: {
        label: 'Sosyal İletişim',
        summary: 'Selamlaşma, yardım isteme ve arkadaşlarla konuşma becerileri.',
        questions: [
            { q: "Bir arkadaşına oyun başlarken nasıl selam verirsin?", query: "children greeting playground", goal: "selamlaşma becerisi" },
            { q: "Bir şeyi anlamazsan öğretmene ne söylersin?", query: "child asking teacher classroom", goal: "yardım isteme" },
            { q: "Oyuna katılmak istersen arkadaşına nasıl sorarsın?", query: "children inviting to play", goal: "oyuna katılma dili" },
            { q: "Bir arkadaşın üzgün görünürse ona ne dersin?", query: "child comforting friend school", goal: "empati ifadesi" },
            { q: "Sıranı beklerken nasıl davranırsın?", query: "children waiting in line school", goal: "sosyal kural anlatma" },
            { q: "Yanlışlıkla birine çarparsan ne söylersin?", query: "kids apologizing playground", goal: "özür dileme" },
            { q: "Bir oyuncağı paylaşmak istediğinde nasıl konuşursun?", query: "children sharing toy", goal: "paylaşma dili" },
            { q: "Bir arkadaşın sana soru sorarsa nasıl cevap verirsin?", query: "children talking together classroom", goal: "karşılıklı konuşma" },
            { q: "Yeni biriyle tanışınca kendini nasıl tanıtırsın?", query: "child introducing self friendly", goal: "kendini tanıtma" },
            { q: "Yardım ettiğin birine sonra ne demek güzel olur?", query: "kids helping each other smiling", goal: "sosyal kapanış ifadesi" }
        ]
    },
    play_sports: {
        label: 'Oyun ve Spor',
        summary: 'İlgi alanı üzerinden seçim yapma, karşılaştırma ve anlatım becerileri.',
        questions: [
            { q: "Parkta en çok hangi oyunu oynamayı seversin?", query: "children playing in park", goal: "tercih belirtme" },
            { q: "Futbol mu basketbol mu sana daha eğlenceli geliyor?", query: "kids football basketball playground", goal: "karşılaştırma yapma" },
            { q: "Takım oyunlarında hangi görevi yapmak istersin?", query: "children team game outdoors", goal: "rol seçme" },
            { q: "Evde oynadığın en sevdiğin oyun hangisi?", query: "child indoor game home", goal: "oyun anlatma" },
            { q: "Bir oyunu arkadaşınla oynarken en çok neye dikkat edersin?", query: "kids playing together sharing", goal: "oyun kuralı anlatma" },
            { q: "Bisiklet mi top oyunu mu seni daha çok hareket ettirir?", query: "children cycling and ball game", goal: "karşılaştırmalı ifade" },
            { q: "Spor yapınca bedeninde nasıl bir his olur?", query: "active child running smiling", goal: "bedensel duygu anlatma" },
            { q: "Yeni bir oyun öğrenirken önce ne yaparsın?", query: "child learning game rules", goal: "adım anlatma" },
            { q: "Top oynarken arkadaşına nasıl pas istersin?", query: "children passing ball teamwork", goal: "oyun içi iletişim" },
            { q: "Bugün dışarı çıksan hangi sporu denemek isterdin?", query: "child trying sports outdoors", goal: "hayal kurma ve tercih" }
        ]
    }
};

const CITY_LOCATIONS = {
    home: {
        label: 'Ev',
        category: 'daily_life',
        summary: 'Evdeki rutinler, ihtiyaçlar ve günlük yaşam konuşmaları.',
        description: 'Ev içindeki rutinleri, aileyle iletişimi ve temel ihtiyaç cümlelerini çalışır.',
        goals: ['rutin anlatma', 'yardım isteme', 'özbakım dili'],
        questions: [
            { q: "Sabah evde ilk olarak kiminle konuşursun?", query: "child morning at home with family", goal: "ev içi iletişimi anlatma" },
            { q: "Karnın acıktığında evde ne söylersin?", query: "child asking for food at home", goal: "ihtiyaç ifade etme" },
            { q: "Oyuncağını bulamazsan annenden ya da babandan nasıl yardım istersin?", query: "parent helping child find toy at home", goal: "yardım isteme cümlesi kurma" },
            { q: "Akşam olunca evde en sevdiğin şey nedir?", query: "family evening at home child smiling", goal: "günlük yaşam tercihi anlatma" },
            { q: "Yatmadan önce hangi hazırlıkları yaparsın?", query: "child bedtime routine brushing teeth", goal: "adım sıralama" },
            { q: "Eve misafir gelince kapıda ne dersin?", query: "child greeting guest at home", goal: "nazik karşılama dili" },
            { q: "Üşüdüğünde evde ne istersin?", query: "child asking for blanket at home", goal: "bedensel ihtiyacı söyleme" },
            { q: "Birlikte yemek yerken senden bir şey uzatmanı isteseler ne dersin?", query: "family dinner child speaking politely", goal: "karşılıklı konuşma" },
            { q: "Odanı toplarken hangi eşyayı yerine koyduğunu anlatır mısın?", query: "child organizing room toys books", goal: "eylem anlatma" },
            { q: "Evde mutlu olduğun bir anı kısaca anlatır mısın?", query: "happy child home family moment", goal: "olay anlatma" }
        ]
    },
    school: {
        label: 'Okul',
        category: 'social_communication',
        summary: 'Öğretmen, arkadaş ve sınıf içi iletişim soruları.',
        description: 'Sınıf içinde kendini ifade etme, öğretmene cevap verme ve arkadaşlarla iletişim kurma çalışılır.',
        goals: ['öğretmene cevap verme', 'arkadaşla konuşma', 'yardım isteme'],
        questions: [
            { q: "Sınıfa girince öğretmenine nasıl günaydın dersin?", query: "child greeting teacher classroom morning", goal: "selamlama" },
            { q: "Öğretmen defterini açmanı isterse ne yaparsın?", query: "teacher giving instruction to child in classroom", goal: "yönerge anlatma" },
            { q: "Dersi anlamadığında öğretmeninden nasıl yardım istersin?", query: "child asking teacher for help classroom", goal: "yardım isteme" },
            { q: "Teneffüste arkadaşına oyuna katılmak için ne söylersin?", query: "children talking in schoolyard", goal: "oyuna katılma dili" },
            { q: "Kalemini düşüren arkadaşına ne demek güzel olur?", query: "child helping classmate pencil classroom", goal: "destekleyici ifade" },
            { q: "Sınıfta söz almak istediğinde nasıl davranırsın?", query: "child raising hand in classroom", goal: "sosyal kural anlatma" },
            { q: "Öğretmenin sana en sevdiğin dersi sorsa ne cevap verirsin?", query: "teacher and child talking about lessons", goal: "tercih belirtme" },
            { q: "Yeni bir arkadaşla tanışırken kendini nasıl tanıtırsın?", query: "child introducing self at school", goal: "kendini tanıtma" },
            { q: "Sırada beklerken bir arkadaşın önüne geçerse ne söylersin?", query: "children waiting in line at school", goal: "nazik sınır koyma" },
            { q: "Okuldan çıkarken öğretmenine nasıl veda edersin?", query: "child saying goodbye to teacher", goal: "konuşmayı uygun kapatma" }
        ]
    },
    market: {
        label: 'Market',
        category: 'daily_life',
        summary: 'İhtiyaç söyleme, seçim yapma ve rica etme çalışmaları.',
        description: 'Market içinde ürün isteme, seçim yapma ve kısa rica cümleleri kullanma becerileri desteklenir.',
        goals: ['ürün isteme', 'tercih belirtme', 'kısa rica cümlesi'],
        questions: [
            { q: "Markete girince almak istediğin ilk şeyi nasıl söylersin?", query: "child in grocery store asking for item", goal: "ürün isteme" },
            { q: "Meyve bölümünde elma mı muz mu istediğini nasıl anlatırsın?", query: "child choosing fruit in market", goal: "tercih belirtme" },
            { q: "Sepete koymak için annenden bir şey uzatmasını nasıl istersin?", query: "parent and child shopping together", goal: "rica etme" },
            { q: "Kasada beklerken sıranı nasıl korursun?", query: "family waiting at grocery checkout", goal: "sosyal kural anlatma" },
            { q: "Bir ürün çok yukarıdaysa market görevlisine ne dersin?", query: "store worker helping child in supermarket", goal: "yardım isteme" },
            { q: "Canın atıştırmalık istediğinde bunu nasıl anlatırsın?", query: "child asking snack at market", goal: "ihtiyaç ifade etme" },
            { q: "Süt ile meyve suyu arasında seçim yaparken ne söylersin?", query: "child deciding drink in market aisle", goal: "karşılaştırma" },
            { q: "Aldığın şey için teşekkür etmek istesen ne dersin?", query: "child saying thank you cashier store", goal: "nazik kapanış" },
            { q: "Poşeti taşımakta zorlanırsan nasıl yardım istersin?", query: "child asking help carrying grocery bag", goal: "yardım talebi" },
            { q: "Marketten eve götürmek istediğin üç şeyi söyler misin?", query: "shopping basket groceries child speaking", goal: "listeleme" }
        ]
    },
    park: {
        label: 'Park',
        category: 'play_sports',
        summary: 'Oyun, spor, takım olma ve arkadaşlık konuşmaları.',
        description: 'Parkta oyun başlatma, spor tercihi yapma ve arkadaşlarla konuşma cümleleri öne çıkar.',
        goals: ['oyun başlatma', 'spor tercihi', 'arkadaşla konuşma'],
        questions: [
            { q: "Parka gidince ilk hangi oyunu oynamak istersin?", query: "children choosing game in park", goal: "tercih belirtme" },
            { q: "Bir arkadaşını salıncağa çağırmak için ne söylersin?", query: "children at playground talking", goal: "oyuna davet etme" },
            { q: "Top oynamak istersen arkadaşından nasıl pas istersin?", query: "kids passing ball in park", goal: "oyun içi iletişim" },
            { q: "Parkta sıra beklerken nasıl davranırsın?", query: "children waiting for slide in park", goal: "sıra alma becerisi" },
            { q: "Koşunca ya da zıplayınca bedeninde nasıl bir his olur?", query: "active child running in park", goal: "bedensel farkındalık" },
            { q: "Arkadaşın oyunu bırakmak isterse ona ne dersin?", query: "children talking after game in park", goal: "karşılıklı konuşma" },
            { q: "Futbol mu saklambaç mı sana daha eğlenceli geliyor?", query: "children playing football and hide and seek", goal: "karşılaştırma yapma" },
            { q: "Yeni bir oyun öğretmek istersen önce ne söylersin?", query: "child explaining game rules to friend", goal: "yönerge verme" },
            { q: "Parkta düşen bir arkadaşını görünce ne yaparsın?", query: "child helping friend who fell at park", goal: "empatik ifade" },
            { q: "Parktan ayrılırken arkadaşlarına nasıl veda edersin?", query: "children leaving park saying goodbye", goal: "uygun kapanış cümlesi" }
        ]
    },
    hospital: {
        label: 'Hastane',
        category: 'emotions',
        summary: 'Duygu, beden farkındalığı ve yardım isteme konuşmaları.',
        description: 'Kendini iyi hissetmediğinde duygunu, bedenindeki rahatsızlığı ve ihtiyacını söyleme çalışılır.',
        goals: ['duygu söyleme', 'beden farkındalığı', 'yardım isteme'],
        questions: [
            { q: "Hastaneye geldiğinde kendini nasıl hissediyorsun?", query: "child at hospital waiting room calm", goal: "duygu ifade etme" },
            { q: "Karnın ağrıyorsa bunu doktora nasıl anlatırsın?", query: "doctor listening to child patient", goal: "bedensel durumu söyleme" },
            { q: "İğneden korkarsan yanında ne olmasını istersin?", query: "child seeking comfort hospital", goal: "duygusal ihtiyaç belirtme" },
            { q: "Doktor sana bir soru sorunca nasıl cevap verirsin?", query: "doctor and child talking gently", goal: "soruya uygun yanıt verme" },
            { q: "Canın acıyınca hemşireden nasıl yardım istersin?", query: "nurse helping child in hospital", goal: "yardım isteme" },
            { q: "Muayeneden sonra rahatladığında ne söylersin?", query: "child relieved after doctor visit", goal: "duyguyu güncelleme" },
            { q: "Beklerken sıkıldıysan annene ya da babana ne dersin?", query: "family in hospital waiting room", goal: "ihtiyaç ifade etme" },
            { q: "Üşüdüğünde battaniye istemek için ne söylersin?", query: "child asking for blanket hospital", goal: "kısa rica kurma" },
            { q: "Doktor sana iyi misin diye sorarsa ne dersin?", query: "doctor checking child wellness", goal: "durumu değerlendirme" },
            { q: "Hastaneden çıkarken doktora nasıl teşekkür edersin?", query: "child thanking doctor after appointment", goal: "nazik kapanış" }
        ]
    }
};

let currentTherapyCategoryKey = 'daily_life';
let currentCityLocationKey = 'school';
let unaskedQuestions = [...CITY_LOCATIONS[currentCityLocationKey].questions];
let currentObj = null;
let isWaiting = false;
let chatHistory = [];
let idleTimer;
let turnCount = 0;

function getCurrentTherapyCategory() {
    return THERAPY_CATEGORIES[currentTherapyCategoryKey] || THERAPY_CATEGORIES.daily_life;
}

function getCurrentCityLocation() {
    return CITY_LOCATIONS[currentCityLocationKey] || CITY_LOCATIONS.school;
}

function getActiveTherapyQuestions() {
    const location = getCurrentCityLocation();
    if (location && Array.isArray(location.questions) && location.questions.length) {
        return location.questions;
    }
    return getCurrentTherapyCategory().questions;
}

function resetTherapyQuestionPool() {
    unaskedQuestions = [...getActiveTherapyQuestions()];
}

function renderTherapyCategories() {
    const barEl = document.getElementById('therapyCategoryBar');
    const summaryEl = document.getElementById('therapyCategorySummary');
    if (!barEl || !summaryEl) return;

    barEl.innerHTML = Object.entries(THERAPY_CATEGORIES).map(([key, category]) => `
        <button type="button" class="therapy-category-btn ${currentTherapyCategoryKey === key ? 'active' : ''}" onclick="setTherapyCategory('${key}')">
            ${category.label}
        </button>
    `).join('');

    const location = getCurrentCityLocation();
    summaryEl.textContent = location
        ? `${location.label}: ${location.summary}`
        : getCurrentTherapyCategory().summary;
}

function renderCityScene() {
    const location = getCurrentCityLocation();
    const sceneEl = document.getElementById('cityScene');
    const titleEl = document.getElementById('cityFocusTitle');
    const descEl = document.getElementById('cityFocusDescription');
    const kickerEl = document.getElementById('cityFocusKicker');
    const goalsEl = document.getElementById('cityFocusGoals');
    const startBtn = document.getElementById('cityStartBtn');

    if (sceneEl) {
        sceneEl.querySelectorAll('.city-option-card').forEach((card) => {
            card.classList.toggle('active', card.dataset.location === currentCityLocationKey);
        });
    }

    if (titleEl) titleEl.textContent = location.label;
    if (descEl) descEl.textContent = location.description || location.summary;
    if (kickerEl) kickerEl.textContent = `${location.label} odakta`;
    if (goalsEl) {
        goalsEl.innerHTML = (location.goals || []).map((goal) => `<span>${goal}</span>`).join('');
    }
    if (startBtn) {
        startBtn.textContent = currentScreenId === 'game-container'
            ? `${location.label} alanını aç`
            : 'Konuşma Terapisine Git';
    }
}

function setTherapyCategory(categoryKey, shouldReload = true) {
    if (!THERAPY_CATEGORIES[categoryKey]) return;
    currentTherapyCategoryKey = categoryKey;
    turnCount = 0;
    currentObj = null;
    chatHistory = [];
    resetTherapyQuestionPool();
    renderTherapyCategories();

    const bubbles = document.getElementById('chat-bubbles');
    if (bubbles) bubbles.innerHTML = '';

    if (shouldReload && currentScreenId === 'game-container') {
        loadNext();
    }
}

function focusCityLocation(locationKey) {
    const location = CITY_LOCATIONS[locationKey];
    if (!location) return;
    currentCityLocationKey = locationKey;
    currentTherapyCategoryKey = location.category;
    resetTherapyQuestionPool();
    renderCityScene();
}

function startFocusedCityLocation() {
    const location = getCurrentCityLocation();
    setTherapyCategory(location.category, false);
    setTherapySelectionMode(false);
    renderTherapyCategories();
    resetTherapyQuestionPool();
    turnCount = 0;
    const bubbles = document.getElementById('chat-bubbles');
    if (bubbles) bubbles.innerHTML = '';
    const vEl = document.getElementById('v');
    vEl.muted = true;
    vEl.play().catch(()=>{});
    loadNext();
}

function openCityLocation(locationKey) {
    focusCityLocation(locationKey);
    startFocusedCityLocation();
}

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

    if (unaskedQuestions.length === 0) resetTherapyQuestionPool();
    const rIndex = Math.floor(Math.random() * unaskedQuestions.length);
    currentObj = unaskedQuestions[rIndex];
    unaskedQuestions.splice(rIndex, 1);

    const vEl = document.getElementById('v');
    if (!sessionData.therapyTurns.length && turnCount === 0) {
        chatHistory = [];
        document.getElementById('chat-bubbles').innerHTML = "";
    }

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
        const currentLocation = CITY_LOCATIONS[currentCityLocationKey];
        sessionData.therapyTurns.push({
            location: currentLocation ? currentLocation.label : '',
            category: getCurrentTherapyCategory().label,
            question: currentObj.q,
            answer: speech
        });
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
    const currentCategory = getCurrentTherapyCategory();
    const currentGoal = currentObj && currentObj.goal ? currentObj.goal : 'kısa ve anlaşılır konuşma';
    const currentLocation = CITY_LOCATIONS[currentCityLocationKey];
    var instructions = `Sen, özel eğitim desteği alan 4-8 yaş arası bir çocukla konuşan sabırlı ve pedagojik farkındalığı yüksek Yıldız Can'sın. Çocuğun adı ${childName}.
Şu an seçili şehir noktası: ${currentLocation ? currentLocation.label : 'Genel konuşma alanı'}.
Şu an seçili konuşma alanı: ${currentCategory.label}.
Bu sorunun hedefi: ${currentGoal}.

KRİTİK KURALLAR:
1. Yalnızca seçili konuşma alanı içinde kal, konu dışına çıkma.
2. Çocuk farklı bir konuya kayarsa nazikçe mevcut alana geri dön.
3. Cevabın mevcut soruya ve çocuğun son cümlesine bağlı olsun.
4. Kısa, somut ve anlaşılır Türkçe kullan.
5. Emoji kullanma.
6. En fazla 2 kısa cümle kur.
7. Sonda sadece seçili alanla ilgili tek kısa takip sorusu sor.
8. Asla yargılama; gerekirse doğru modeli nazikçe örnekle.`;
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
        return `${childName}, çok güzel anlattın. ${currentCategory.label} ile ilgili başka ne söylemek istersin?`;
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
    return speakWithLipsync(t, callback, CharacterEmotion.NEUTRAL);
}

async function speakWithLipsync(text, onEnd, emotion = CharacterEmotion.NEUTRAL) {
    setCharacterEmotion(emotion);

    try {
        const res = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        if (!res.ok) {
            setCharacterEmotion(CharacterEmotion.NEUTRAL);
            return speakFallback(text, onEnd);
        }

        initAudioContext();
        if (audioCtx.state === 'suspended') await audioCtx.resume();

        const arrayBuf = await res.arrayBuffer();
        const audioBuf = await audioCtx.decodeAudioData(arrayBuf);

        const source = audioCtx.createBufferSource();
        const gainNode = audioCtx.createGain();
        source.buffer = audioBuf;
        source.connect(analyserNode);
        analyserNode.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        startLipsync();
        source.start(0);
        source.onended = () => {
            stopLipsync();
            setCharacterEmotion(CharacterEmotion.NEUTRAL);
            if (onEnd) onEnd();
        };
    } catch (e) {
        console.warn('Lipsync TTS hatasi, fallback:', e);
        setCharacterEmotion(CharacterEmotion.NEUTRAL);
        speakFallback(text, onEnd);
    }
}

// =============================================
// HİKAYE SİSTEMİ
// =============================================

const STORIES = {
    redhood: {
        title: "Yardım İstiyorum",
        emoji: "??",
        description: "Gerçek hayatta yardım isteme, doğru kişiyi bulma ve net cümle kurma görevi.",
        difficulty: "Kolay",
        ageRange: "5-6",
        theme: "yardim",
        scenes: [
            {
                id: 0,
                emoji: "??",
                bg: "linear-gradient(135deg, #ffe29f, #ffa99f)",
                bgLabel: "Sinif girisi",
                videoQuery: "school hallway child teacher warm light",
                narration: "Defterin yere dustu ve fermuarin sikisti. Ogretmenin yakininda. Simdi yardim istemen gerekiyor.",
                taskType: "both",
                taskText: "Yardim istemek icin en iyi cumleyi sec ya da soyle.",
                micPrompt: "Yardim isterken ne soylersin?",
                choices: [
                    { text: "Ogretmenim, yardim eder misiniz?", next: 1, response: "Bu cok iyi bir baslangic. Nazik ve net bir sekilde yardim istedin." },
                    { text: "Bunu yapamiyorum, bana yardim lazim.", next: 1, response: "Ihtiyacini soylemen cok degerli. Boylece karsindaki seni daha iyi anlar." },
                    { text: "Bekleyip hicbir sey soylemem.", next: 1, response: "Sessiz kalmak zor gelebilir. Yardim istemek seni guclu yapar." }
                ]
            },
            {
                id: 1,
                emoji: "??",
                bg: "linear-gradient(135deg, #a8edea, #c8f7c5)",
                bgLabel: "El kaldirma ani",
                videoQuery: "classroom child raising hand teacher smiling",
                narration: "Ogretmen baska biriyle konusuyor. Yardim istemek istiyorsun ama sirani da beklemen gerekiyor.",
                taskType: "choice",
                taskText: "Simdi hangi davranis daha uygun?",
                choices: [
                    { text: "Elimi kaldirip ogretmenin bana donmesini beklerim.", next: 2, response: "Harika. Bu hem seni gorunur yapar hem de sirayi korur." },
                    { text: "Ogretmenin sozunu keserim.", next: 2, response: "Acil hissettirebilir ama sirayi bozmak karsindakini sasirtabilir." },
                    { text: "Arkadasima bagirarak yardim isterim.", next: 2, response: "Bagirmak bazen karisiklik yaratir. Daha sakin bir yol bulabiliriz." }
                ]
            },
            {
                id: 2,
                emoji: "???",
                bg: "linear-gradient(135deg, #667eea, #764ba2)",
                bgLabel: "Net cumle kurma",
                videoQuery: "child speaking calmly in classroom support",
                narration: "Ogretmenin sana dondu. Simdi yardimi tam olarak ne icin istedigini soylemelisin.",
                taskType: "both",
                taskText: "Ihtiyacini acik bir cumleyle anlat.",
                micPrompt: "Neye yardim lazim oldugunu soyle.",
                choices: [
                    { text: "Defterimin fermuari sikisti, acar misiniz?", next: 3, response: "Mukemmel. Sorunu da ne istedigini de acikca soyledin." },
                    { text: "Bir sey oldu...", next: 3, response: "Baslamak iyi ama biraz daha net olursan yardim daha kolay gelir." },
                    { text: "Ben yapamam!", next: 3, response: "Duygunu anlattın, şimdi bir adım daha atıp nasıl yardım istediğini söyleyebilirsin." }
                ]
            },
            {
                id: 3,
                emoji: "??",
                bg: "linear-gradient(135deg, #f093fb, #f5576c)",
                bgLabel: "Rahatlama ani",
                videoQuery: "child feeling relieved after help classroom",
                narration: "Ogretmenin yardim etti. Simdi tesekkur ederek durumu kapatabilirsin.",
                taskType: "choice",
                taskText: "Hangi kapanis cumlesi daha uygun?",
                choices: [
                    { text: "Tesekkur ederim ogretmenim.", next: -1, response: "Harika kapanis. Hem nazik hem kendinden emin." },
                    { text: "Tamam oldu.", next: -1, response: "Ise yarar ama tesekkur etmek iliskiyi daha guclu hale getirir." }
                ]
            }
        ]
    },
    piggies: {
        title: "Sıramı Bekliyorum",
        emoji: "?",
        description: "Bekleme, sıraya uyma ve heyecanlanınca sakin kalma görevi.",
        difficulty: "Kolay",
        ageRange: "5-6",
        theme: "bekleme",
        scenes: [
            {
                id: 0,
                emoji: "??",
                bg: "linear-gradient(135deg, #fff1c1, #ffd5a0)",
                bgLabel: "Park sirasi",
                videoQuery: "playground children waiting slide sunny day",
                narration: "Parkta kaydirak icin sira var. Sen de cok heyecanlisin ama once beklemen gerekiyor.",
                taskType: "choice",
                taskText: "Beklerken ilk ne yapmak daha iyi olur?",
                choices: [
                    { text: "Ayaklarimi yerde tutup derin nefes alirim.", next: 1, response: "Bu cok iyi bir baslangic. Bedenin sakinlesince beklemek kolaylasir." },
                    { text: "Hemen one gecmeye calisirim.", next: 1, response: "Bu seni hizlandirir gibi gorunur ama diger cocuklarla sorun yaratabilir." },
                    { text: "Ofkelenip siradan cikarim.", next: 1, response: "Zorlandigini anliyorum. Simdi daha guvenli bir bekleme yolu bulalim." }
                ]
            },
            {
                id: 1,
                emoji: "??",
                bg: "linear-gradient(135deg, #d4fc79, #96e6a1)",
                bgLabel: "Beklerken odak",
                videoQuery: "child waiting calmly playground observing turn",
                narration: "Sira beklerken ellerin ve gozlerin ne yapacak? Bunlar da beklemeyi kolaylastirir.",
                taskType: "speak",
                taskText: "Beklerken kendine hangi sakin gorevi verebilirsin?",
                micPrompt: "Beklerken ne yaparsin?",
                choices: [
                    { text: "Icerimden bire kadar sayarim.", next: 2, response: "Saymak cok iyi bir bekleme aracidir." },
                    { text: "Onumdeki cocugu izlerim ve sirami takip ederim.", next: 2, response: "Harika. Sirani takip etmek ne zaman hareket edecegini anlamani saglar." }
                ]
            },
            {
                id: 2,
                emoji: "??",
                bg: "linear-gradient(135deg, #89f7fe, #66a6ff)",
                bgLabel: "Siran geldi",
                videoQuery: "playground children taking turns smiling",
                narration: "Sira sana geldi ama arkandaki cocuk da sabirsiz. Simdi hem kendi siranin tadini cikarip hem de baskasina saygi gostermen gerekiyor.",
                taskType: "choice",
                taskText: "Hangi davranis en dengeli olur?",
                choices: [
                    { text: "Bir kere kayip sonra arkadaki cocuga alan acmak.", next: 3, response: "Bu cok dengeli bir secim. Hem sen oynadin hem sira akisini korudun." },
                    { text: "Uzun sure ayrilmadan kalmak.", next: 3, response: "Eglenceli gelebilir ama baskalarinin sirasini uzatir." }
                ]
            },
            {
                id: 3,
                emoji: "?",
                bg: "linear-gradient(135deg, #cfd9df, #e2ebf0)",
                bgLabel: "Bekleme tamam",
                videoQuery: "child proud after waiting turn playground",
                narration: "Bekledin, sirani kullandin ve baskalarina da alan actin. Simdi bu beceriyi baska nerede kullanabilecegini dusun.",
                taskType: "both",
                taskText: "Sira beklemeyi baska hangi yerde kullanirsin?",
                micPrompt: "Sira beklemeyi nerede kullanirsin?",
                choices: [
                    { text: "Yemek sirasinda.", next: -1, response: "Evet. Sira bekleme yemekte de cok ise yarar." },
                    { text: "Sinifta ogretmenle konusurken.", next: -1, response: "Harika. Sinifta da sirayi takip etmek herkesin rahat etmesini saglar." }
                ]
            }
        ]
    },
    moonseed: {
        title: "Paylaşıyorum ve Konuşuyorum",
        emoji: "??",
        description: "Oyuncak paylaşma, arkadaşa dönüp konuşma ve birlikte oyun kurma görevi.",
        difficulty: "Orta",
        ageRange: "7-8",
        theme: "iletisim",
        scenes: [
            {
                id: 0,
                emoji: "??",
                bg: "linear-gradient(135deg, #1f2a63, #6a5acd)",
                bgLabel: "Oyun kosesi",
                videoQuery: "children playing with toys classroom sharing",
                narration: "Sen bloklarla oynuyorsun. Yanindaki cocuk da ayni bloklari istiyor ve sana bakiyor.",
                taskType: "both",
                taskText: "Oyunu bozmadan nasil cevap verirsin?",
                micPrompt: "Arkadasina ne soylersin?",
                choices: [
                    { text: "Birazdan sana da vereyim, once kulemi bitireyim.", next: 1, response: "Bu harika bir paylasma dili. Hem kendini anlattin hem cozum sundun." },
                    { text: "Hayir, vermem!", next: 1, response: "Duygunu anliyorum ama daha yumusak bir yol kurabiliriz." },
                    { text: "Gel birlikte yapalim.", next: 1, response: "Cok guzel bir ortak oyun daveti sundun." }
                ]
            },
            {
                id: 1,
                emoji: "??",
                bg: "linear-gradient(135deg, #89f7fe, #66a6ff)",
                bgLabel: "Konuşma kurma",
                videoQuery: "children talking together toy negotiation",
                narration: "Arkadasin biraz uzuldu. Simdi onun da kendini iyi hissetmesi icin bir cumle daha ekleyebilirsin.",
                taskType: "choice",
                taskText: "Hangi ek cumle daha iyi gelir?",
                choices: [
                    { text: "Sen de istersen mavi bloklari secebilirsin.", next: 2, response: "Secenek sunman cok iyi. Oyun beraber devam edebilir." },
                    { text: "Biraz beklemek zor olabilir biliyorum.", next: 2, response: "Bu cümle empati kuruyor. Karşındaki anlaşıldığını hisseder." }
                ]
            },
            {
                id: 2,
                emoji: "??",
                bg: "linear-gradient(135deg, #c471ed, #f64f59)",
                bgLabel: "Paylaşma anı",
                videoQuery: "two children sharing blocks smiling teamwork",
                narration: "Kulen bitti. Simdi paylasma zamani. Oyunun devam etmesi icin ne yaparsin?",
                taskType: "choice",
                taskText: "En guclu paylasma davranisini sec.",
                choices: [
                    { text: "Sari bloklari sana vereyim, birlikte kopru yapalim.", next: 3, response: "Mukemmel. Hem paylastin hem ortak oyun kurdun." },
                    { text: "Hepsini birden verip oyundan cikayim.", next: 3, response: "Paylasmak guzel ama oyunda kalman da onemli. Denge kurabiliriz." }
                ]
            },
            {
                id: 3,
                emoji: "??",
                bg: "linear-gradient(135deg, #43cea2, #185a9d)",
                bgLabel: "Ortak oyun",
                videoQuery: "children celebrating finished block tower teamwork",
                narration: "Artik ikiniz de oyundasiniz. Simdi bu guzel oyunu bitirirken nasil bir kapanis yaparsin?",
                taskType: "speak",
                taskText: "Arkadasina oyun sonunda ne soylemek istersin?",
                micPrompt: "Oyun sonunda ne dersin?",
                choices: [
                    { text: "Beraber yapmak guzeldi.", next: -1, response: "Bu sicak bir kapanis. Arkadaslik icin cok iyi." },
                    { text: "Yarin yine oynayalim.", next: -1, response: "Harika. Gelecek oyuna kapi acan cok guzel bir cumle." }
                ]
            }
        ]
    }
};

let currentStory = null;
let currentStoryKey = null;
let currentSceneIdx = 0;
let storyChoiceMade = false;
let defaultStorySideMarkup = '';

function getStoryProgressStorageKey() {
    return currentUserEmail ? `story_progress_${currentUserEmail}` : 'story_progress_guest';
}

function loadSavedStoryProgress() {
    try {
        const raw = localStorage.getItem(getStoryProgressStorageKey());
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        console.error('Hikaye ilerlemesi okunamadı:', error);
        return null;
    }
}

function saveStoryProgress() {
    if (!currentStory || sessionData.storyCompleted) return;

    const payload = {
        storyKey: currentStoryKey,
        sceneIndex: currentSceneIdx,
        totalScenesReached: sessionData.totalScenesReached,
        storyChoices: sessionData.storyChoices.slice(),
        storyName: sessionData.storyName,
        updatedAt: new Date().toISOString()
    };

    localStorage.setItem(getStoryProgressStorageKey(), JSON.stringify(payload));
}

function clearStoryProgress() {
    localStorage.removeItem(getStoryProgressStorageKey());
}

function restoreStorySideMarkup() {
    const side = document.querySelector('.story-side');
    if (side && defaultStorySideMarkup) {
        side.innerHTML = defaultStorySideMarkup;
    }
}

function getStoryThemeLabel(theme) {
    if (theme === 'yardim') return 'Yardım İsteme';
    if (theme === 'bekleme') return 'Sıra Bekleme';
    if (theme === 'iletisim') return 'Paylaşma';
    return theme;
}

function renderStoryLibrary() {
    const grid = document.getElementById('storyGrid');
    if (!grid) return;

    const theme = document.getElementById('storyThemeFilter').value;
    const level = document.getElementById('storyLevelFilter').value;
    const age = document.getElementById('storyAgeFilter').value;

    const items = Object.entries(STORIES).filter(([, story]) => {
        const themeOk = theme === 'all' || story.theme === theme;
        const levelOk = level === 'all' || story.difficulty === level;
        const ageOk = age === 'all' || story.ageRange === age;
        return themeOk && levelOk && ageOk;
    });

    if (!items.length) {
        grid.innerHTML = '<div class="story-empty-state">Bu filtrelere uygun hikaye bulunamadı. Başka bir tema veya seviye seçebilirsin.</div>';
        return;
    }

    grid.innerHTML = items.map(([key, story]) => `
        <div class="story-thumb active-story" onclick="startStory('${key}')">
            <div class="story-thumb-img">${story.emoji}</div>
            <h4>${story.title}</h4>
            <p>${story.description}</p>
            <span class="story-difficulty">${story.difficulty}</span>
            <div class="story-thumb-meta">
                <span class="story-meta-pill">${getStoryThemeLabel(story.theme)}</span>
                <span class="story-meta-pill">${story.ageRange} yaş</span>
                <span class="story-meta-pill">${story.scenes.length} sahne</span>
            </div>
        </div>
    `).join('');
}

function updateStoryFilters() {
    renderStoryLibrary();
}

function renderStoryResumeCard() {
    const card = document.getElementById('storyResumeCard');
    if (!card) return;

    const saved = loadSavedStoryProgress();
    if (!saved || !saved.storyKey || !STORIES[saved.storyKey]) {
        card.style.display = 'none';
        card.innerHTML = '';
        return;
    }

    const story = STORIES[saved.storyKey];
    card.style.display = 'flex';
    card.innerHTML = `
        <div class="story-resume-copy">
            <h3>Kaldığın yerden devam et</h3>
            <p>${story.title} hikayesinde ${saved.sceneIndex + 1}. sahneye kadar geldin. İstersen tek dokunuşla devam edebilirsin.</p>
        </div>
        <div class="story-resume-actions">
            <button class="menu-cta-btn" type="button" onclick="resumeSavedStory()">Devam Et</button>
            <button class="menu-ghost-btn" type="button" onclick="restartSavedStory()">Baştan Başlat</button>
        </div>
    `;
}

function startStory(storyKey, resumeProgress) {
    currentStoryKey = storyKey;
    currentStory = STORIES[storyKey];
    restoreStorySideMarkup();

    currentSceneIdx = resumeProgress ? resumeProgress.sceneIndex || 0 : 0;
    sessionData.storyName = currentStory.title;
    sessionData.totalScenes = currentStory.scenes.length;
    sessionData.totalScenesReached = resumeProgress ? (resumeProgress.totalScenesReached || currentSceneIdx + 1) : 0;
    sessionData.storyCompleted = false;
    sessionData.storyChoices = resumeProgress ? (resumeProgress.storyChoices || []).slice() : [];
    sessionData.storyGoalInjection = '';

    showOnly('story-screen');
    buildProgressDots();
    renderScene(currentSceneIdx);
    saveStoryProgress();
}

function resumeSavedStory() {
    const saved = loadSavedStoryProgress();
    if (!saved || !saved.storyKey) return;
    startStory(saved.storyKey, saved);
}

function restartSavedStory() {
    const saved = loadSavedStoryProgress();
    if (!saved || !saved.storyKey) return;
    clearStoryProgress();
    renderStoryResumeCard();
    startStory(saved.storyKey);
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
    saveStoryProgress();
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
        btn.onclick = () => { handleChoice(choice, btn, scene); };
        container.appendChild(btn);
    });
}

const PROSOCIAL_KEYWORDS = ['yardim', 'yardım', 'paylas', 'paylaş', 'birlikte', 'ozur', 'özür', 'tesekkur', 'teşekkür', 'sor', 'bekle'];
const ANTISOCIAL_KEYWORDS = ['bencil', 'yalan', 'saklamak', 'kirmak', 'kırmak', 'itmek', 'bagirmak', 'bağırmak', 'zorla', 'almak'];

function normalizeTr(text) {
    return (text || '')
        .toLowerCase()
        .replace(/ı/g, 'i')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c');
}

function choiceEthicsScore(choiceText, sceneResponse) {
    const lower = normalizeTr(choiceText);
    const responseLower = normalizeTr(sceneResponse || '');
    let score = 0;
    PROSOCIAL_KEYWORDS.forEach(k => { if (lower.includes(k)) score += 1; });
    ANTISOCIAL_KEYWORDS.forEach(k => { if (lower.includes(k)) score -= 1; });
    // Hikaye metni "riskli/dikkat" sinyali veriyorsa müdahaleyi tetikle.
    if (responseLower.includes('riskli') || responseLower.includes('dikkat') || responseLower.includes('supheli')) {
        score -= 1;
    }
    return score;
}

async function getTherapeuticResponse(choiceText, sceneResponse, sceneContext) {
    const score = choiceEthicsScore(choiceText, sceneResponse);
    const needsIntervention = score < 0;

    const systemPrompt = needsIntervention
        ? `Sen Yildiz Can adli sicak, sabirli bir cocuk gelisim uzmansin.
           "${childName}" adli cocuk hikayede "${choiceText}" secimini yapti.
           Sahne geri bildirimi: "${sceneResponse}".
           Ozel egitim destegi alan cocuklara uygun, sade ve net dil kullan.
           Konudan sapma; sadece bu secim ve bu sahneye odaklan.
           Bu secimin bir arkadasi uzebilecegini nazikce belirt.
           "Bunu yaparsan arkadasin uzulebilir, sence baska ne yapabiliriz?" tarzinda
           rehberlik eden SADECE BIR soru sor. Cok kisa tut (2-3 cumle).`
        : `Sen Yildiz Can adli neseli bir AI arkadassin.
           "${childName}" harika bir secim yapti: "${choiceText}".
           Ozel egitim destegi alan cocuklara uygun, sade ve net dil kullan.
           Sadece bu secime ve sahneye bagli kal.
           Onu 1-2 cumleyle ictenlikle tebrik et ve bu secimin neden guzel oldugunu soyle.`;

    const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: systemPrompt }] }]
        })
    });
    const data = await res.json();
    const reply = data.candidates[0].content.parts[0].text;

    sessionData.storyChoices.push({
        scene: sceneContext.id,
        sceneLabel: sceneContext.label,
        sceneEmoji: sceneContext.emoji,
        choice: choiceText,
        response: reply,
        ethicsScore: score,
        needsIntervention
    });

    const emotion = needsIntervention ? CharacterEmotion.SAD : CharacterEmotion.HAPPY;
    await speakWithLipsync(reply, null, emotion);
    return { reply, needsIntervention };
}

async function handleChoice(choice, btn, scene) {
    if (storyChoiceMade) return;
    storyChoiceMade = true;

    document.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);
    btn.classList.add('chosen');

    addStoryBubble(choice.text, 'user');
    let therapeuticReply = choice.response;
    let needsIntervention = false;
    try {
        const result = await getTherapeuticResponse(
            choice.text,
            choice.response,
            { id: scene.id, label: scene.bgLabel || `Sahne ${scene.id + 1}`, emoji: scene.emoji }
        );
        therapeuticReply = result.reply;
        needsIntervention = result.needsIntervention;
    } catch (error) {
        addStoryBubble(choice.response, 'ai');
        await speak(choice.response, () => {});
    }

    if (therapeuticReply) addStoryBubble(therapeuticReply, 'ai');
    if (!needsIntervention) celebrateCorrectAnswer();

    if (choice.next === -1) {
        showStoryEnd();
    } else {
        const nextBtn = document.getElementById('storyNextBtn');
        nextBtn.style.display = 'block';
        saveStoryProgress();
    }
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
    clearStoryProgress();
    renderStoryResumeCard();

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
            <button class="btn-restart" style="background:#6C63FF; margin-top:10px" onclick="startStory('${currentStoryKey}')">Tekrar Oyna 🔄</button>
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
        const prompt = `Sen Yildiz Can'sin, 5-8 yas ve ozel egitim destegi alan cocuklarla konusan sabirli bir arkadassin. Cocugun adi ${childName}. 
Hikayedeki sahne: "${scene.narration}"
Çocuğun cevabı: "${speech}"
KURAL: Sahneden ve cocugun verdigi bu cevaptan kopma.
Cok kisa (max 2 cumle, 8-12 kelime) sevecen geri bildirim ver.
Gereksiz yeni konu acma. Emoji kullanma.`;

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
    const nameField = document.getElementById('nameField');
    const roleField = document.getElementById('roleField');
    const forgotLink = document.getElementById('forgot-link');
    const loginTab = document.getElementById('tab-login');
    const registerTab = document.getElementById('tab-register');
    const btnText = document.getElementById('btnText');
    const title = document.getElementById('auth-main-title');
    const subTitle = document.querySelector('.auth-sub');

    if (mode === 'login') {
        roleField.style.display = 'none';
        nameField.style.display = 'none';    // İsmi gizle
        forgotLink.style.display = 'block';  // Şifremi unuttumu göster
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        title.innerText = "Hoş Geldin!";
        subTitle.innerText = "Öğrenme yolculuğuna başlamak için giriş yap.";
        btnText.innerText = "Giriş Yap";
    } else {
        roleField.style.display = 'block';
        nameField.style.display = 'block';   // İsmi göster
        forgotLink.style.display = 'none';   // Şifremi unuttumu gizle
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

// ozel-egitim-main/script.js

// --- AUTH FONKSİYONLARI ---
async function handleAuth() {
    const email = document.getElementById('emailInput').value.trim();
    const password = document.getElementById('passwordInput').value;
    const displayName = document.getElementById('nameInput').value.trim();
    const role = document.getElementById('roleInput').value;
    const authBtn = document.getElementById('mainAuthBtn');

    if (!email || !password) {
        showStatus("Lütfen tüm alanları doldur!", "error");
        return;
    }

    if (authMode === 'register' && !displayName) {
        showStatus("Lütfen çocuğun adını da yaz!", "error");
        return;
    }

    showStatus("İşlem yapılıyor...", "info");
    authBtn.disabled = true;

    try {
        if (authMode === 'register') {
            const { error } = await supabaseClient.auth.signUp({
                email,
                password,
                options: {
                    data: { display_name: displayName, role: role },
                    emailRedirectTo: window.location.origin
                }
            });
            
            authBtn.disabled = false;
            if (error) throw error;
            
            showStatus("Kayıt başarılı! Lütfen e-posta kutunu kontrol et ve onay linkine tıkla.", "success");
        } else {
            const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
            
            authBtn.disabled = false;
            if (error) throw error;
            
            showStatus("Giriş başarılı! Yükleniyor...", "success");
            childName = getChildNameFromUser(data.user);
            currentUserEmail = data.user.email || '';
            currentUserRole = getUserRoleFromUser(data.user);

            setTimeout(() => startApp(true), 800);
        }
    } catch (e) {
        authBtn.disabled = false;
        showStatus(turkishAuthError(e.message), "error");
    }
}

// Şifremi Unuttum Fonksiyonu
async function resetPassword() {
    const email = document.getElementById('emailInput').value.trim();
    if (!email) {
        showStatus("Lütfen şifre sıfırlama linki için e-posta adresini yaz! 📧", "error");
        return;
    }
    
    showStatus("Sıfırlama linki gönderiliyor... ⏳", "info");
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
    });
    
    if (error) {
        showStatus("❌ Hata: " + turkishAuthError(error.message), "error");
    } else {
        showStatus("📧 Şifre sıfırlama maili gönderildi! Kutunu kontrol et.", "success");
    }
}

function turkishAuthError(msg) {
    if (msg.includes('Invalid login credentials')) return 'E-posta veya şifre yanlış! Lütfen tekrar dene.';
    if (msg.includes('Email not confirmed')) return 'E-posta adresin henüz onaylanmamış! Lütfen mailini kontrol et.';
    if (msg.includes('already registered')) return 'Bu e-posta zaten kayıtlı! Giriş yapmayı deneyebilirsin.';
    if (msg.includes('Password should be')) return 'Şifre çok kısa! En az 6 karakter olmalı.';
    return "Bir hata oluştu: " + msg;
}

// window exportlarına ekle
window.resetPassword = resetPassword;
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
window.setTherapyCategory = setTherapyCategory;
window.focusCityLocation = focusCityLocation;
window.startFocusedCityLocation = startFocusedCityLocation;
window.openCityLocation = openCityLocation;
window.goToHearingSupport = goToHearingSupport;
window.goToStories = goToStories;
window.goToReport = goToReport;
window.exitStory = exitStory;
window.startStory = startStory;
window.nextScene = nextScene;
window.rec = rec;
window.loadNext = loadNext;
window.storyRec = storyRec;
window.logout = logout;
window.openOnboarding = openOnboarding;
window.openStudentSetup = openStudentSetup;
window.createStudent = createStudent;
window.updateStudent = updateStudent;
window.selectStudent = selectStudent;
window.changeHistoryMonth = changeHistoryMonth;
window.updateStoryFilters = updateStoryFilters;
window.resumeSavedStory = resumeSavedStory;
window.restartSavedStory = restartSavedStory;
window.startHearingModule = startHearingModule;
window.chooseHearingOption = chooseHearingOption;
window.nextHearingStep = nextHearingStep;






