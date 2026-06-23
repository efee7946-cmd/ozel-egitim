function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// =============================================
// GENEL DEĞİŞKENLER
// =============================================
let childName = "";
let appStarted = false;
let currentUserRole = "parent";
let currentScreenId = 'start-screen';
let currentMenuSection = 'overview';
let activeStudentId = '';
let activeStudentName = '';
let studentsCache = [];

// Oturum verisi — tüm modüller buraya yazar
const sessionData = {
    startTime: null,
    therapyTurns: [],
    storyChoices: [],
    storyCompleted: false,
    storyName: '',
    totalScenesReached: 0,
    totalScenes: 0,
    micUsedInStory: 0,
    micUsedInTherapy: 0,
    repeatUsed: 0,
    simplifyUsed: 0,
    reportEntryId: null,
};

let selectedHistoryDateKey = null;
let historyCalendarMonth = null;

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
    const screens = ['start-screen','student-setup-screen','menu-screen','game-container','report-screen','matching-screen',
                      'schedule-screen','aac-screen','sequence-screen',
                      'login-screen','iep-screen','skills-screen','behavior-screen','auth-screen','splash-screen','analysis-screen'];
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

function updateMenuIdentity() {
    const emailEl = document.getElementById('account-email');
    const studentEl = document.getElementById('active-student-name');
    if (emailEl) {
        const roleLabel = currentUserRole === 'specialist' ? 'Uzman' : 'Veli';
        emailEl.textContent = (_authUser && _authUser.displayName) ? `${_authUser.displayName} • ${roleLabel}` : 'Misafir';
    }
    if (studentEl) {
        studentEl.textContent = activeStudentName || 'Öğrenci seç';
    }
    // Pill dot: green if student selected
    const dot = document.querySelector('.pill-dot');
    if (dot) dot.style.background = activeStudentName ? '#22c55e' : '#f59e0b';
}

function openOnboarding() {
    const panel = document.getElementById('onboarding-panel');
    if (!panel) return;

    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
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
        sessionData.repeatUsed = 0;
        sessionData.simplifyUsed = 0;
        sessionData.reportEntryId = null;
    }

    document.getElementById('menu-greeting').textContent = `Merhaba, ${childName}! 🌟`;
    appStarted = true;
    // Auth kontrolü: oturum var mı?
    checkAuthSession();
}

// Supabase auth listener kaldırıldı — kendi auth sistemi kullanılıyor

document.addEventListener('DOMContentLoaded', function() {
    // Supabase auth atlanıyor — kendi auth sistemimizi kullanıyoruz
    checkAuthSession();
});
window.addEventListener('pagehide', persistSessionSnapshot);
document.addEventListener('DOMContentLoaded', function() {
    ensureStudentEnhancements();
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
    const hadTherapy = sessionData.micUsedInTherapy > 0 || sessionData.therapyTurns.length > 0;
    persistSessionSnapshot();
    setTherapySelectionMode(false);
    syncCityEntryPlacement(false);
    const cityShell = document.getElementById('cityEntryShell');
    if (cityShell) cityShell.style.display = '';
    showOnly('menu-screen');
    renderCityScene();
    if (hadTherapy) _showStarReward();
}

let currentTopic = '';

function goToTherapy() {
    showOnly('game-container');
    document.getElementById('topicOverlay').style.display = 'flex';
    document.getElementById('therapyMainCard').style.display = 'none';
    document.getElementById('topicInput').value = '';
    document.getElementById('topicLoading').style.display = 'none';
    document.getElementById('topicStartBtn').style.display = '';
    setTimeout(() => document.getElementById('topicInput').focus(), 100);
}

function setTopicChip(topic) {
    document.getElementById('topicInput').value = topic;
    document.getElementById('topicInput').focus();
}

async function startTherapyWithTopic() {
    const input = document.getElementById('topicInput').value.trim();
    if (!input) return;
    currentTopic = input;

    document.getElementById('topicLoading').style.display = 'flex';
    document.getElementById('topicStartBtn').style.display = 'none';

    try {
        const prompt = `Özel eğitim öğrencisi (8-12 yaş, orta düzey) için "${currentTopic}" konusunda 6 kısa soru üret. Her soru günlük yaşam ve sosyal beceriye yönelik olsun. Her soru yeni satırda, maksimum 10 kelime. Sadece soruları yaz.`;
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }] }),
            signal: AbortSignal.timeout(15000)
        });
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const questions = text.split('\n')
            .map(q => q.replace(/^[\d\-\.\*]+\s*/, '').trim())
            .filter(q => q.length > 5)
            .slice(0, 6)
            .map(q => ({ q, query: currentTopic, goal: currentTopic }));

        unaskedQuestions = questions.length ? questions : [{ q: `${currentTopic} hakkında ne düşünüyorsun?`, query: currentTopic, goal: currentTopic }];
    } catch {
        unaskedQuestions = [{ q: `${currentTopic} hakkında ne düşünüyorsun?`, query: currentTopic, goal: currentTopic }];
    }

    chatHistory = [];
    turnCount = 0;
    currentObj = null;

    const badge = document.getElementById('therapyTopicBadge');
    if (badge) badge.textContent = `🎯 ${currentTopic}`;

    document.getElementById('topicOverlay').style.display = 'none';
    document.getElementById('therapyMainCard').style.display = '';
    document.getElementById('chat-bubbles').innerHTML = '';

    updateProgressBar();
    await loadNext();
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
        repeatUsed: row.repeat_used || 0,
        simplifyUsed: row.simplify_used || 0,
        therapyTurns: Array.isArray(row.therapy_turns) ? row.therapy_turns : [],
        storyChoices: Array.isArray(row.story_choices) ? row.story_choices : [],
    };
}

async function getCurrentUserId() {
    // Yeni auth: aktif kullanıcı adını döndür (Supabase UUID yerine)
    if (_authUser && _authUser.username) return _authUser.username;
    // Fallback: localStorage'dan oku
    const saved = DB.getSync('auth_user');
    return saved && saved.username ? saved.username : null;
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
    return; // Sade menü tasarımı aktif — karmaşık workspace devre dışı
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
    const history = await DB.get('session_history_' + userId) || [];
    const rows = history.filter(h => h.student_id === studentId).slice(0, 20);
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
        <button type="button" class="student-card ${student.id === activeStudentId ? 'active' : ''}" onclick="selectStudent('${escapeHtml(student.id)}')">
            <h4>${escapeHtml(student.full_name) || 'İsimsiz öğrenci'}</h4>
            <p>${escapeHtml(student.support_notes) || 'Henüz destek notu eklenmedi.'}</p>
            <span class="student-card-meta">${student.birth_year ? `Doğum yılı: ${escapeHtml(String(student.birth_year))}` : 'Doğum yılı girilmedi'}</span>
        </button>
    `).join('');
    renderRoleDashboard();
    renderStudentDetailPanel();
}

async function loadStudentsForCurrentUser() {
    const userId = await getCurrentUserId();
    if (!userId) { studentsCache = []; return []; }
    const data = await DB.get('teacher_students_' + userId) || [];
    studentsCache = data.filter(s => s.active !== false);
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

    const newStudent = {
        id: 'st_' + Date.now(),
        full_name: fullName,
        birth_year: Number.isFinite(birthYear) ? birthYear : null,
        support_notes: supportNotes,
        active: true,
        created_at: new Date().toISOString(),
    };
    const key = 'teacher_students_' + userId;
    const existing = await DB.get(key) || [];
    existing.unshift(newStudent);
    await DB.set(key, existing);

    nameEl.value = '';
    yearEl.value = '';
    notesEl.value = '';
    createBtn.disabled = false;
    await ensureActiveStudent();
    await selectStudent(newStudent.id);
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
    const userId = await getCurrentUserId();

    const key = 'teacher_students_' + userId;
    const list = await DB.get(key) || [];
    const idx = list.findIndex(s => s.id === activeStudentId);
    if (idx >= 0) {
        list[idx] = { ...list[idx], full_name: fullName, birth_year: Number.isFinite(birthYear) ? birthYear : null, support_notes: supportNotes, updated_at: new Date().toISOString() };
        await DB.set(key, list);
    }

    updateBtn.disabled = false;
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
        repeat_used: sessionData.repeatUsed,
        simplify_used: sessionData.simplifyUsed,
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
    const all = await DB.get('session_history_' + userId) || [];
    const data = activeStudentId ? all.filter(h => h.student_id === activeStudentId) : all;
    return data.slice(0, 180).map(mapHistoryRow);
}

async function persistSessionSnapshot() {
    if (!hasSessionActivity()) return loadReportHistory();

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

    const key = 'session_history_' + userId;
    const history = await DB.get(key) || [];
    const idx = history.findIndex(h => h.id === snapshot.id);
    if (idx >= 0) history[idx] = snapshot;
    else history.unshift(snapshot);
    if (history.length > 180) history.splice(180);
    await DB.set(key, history);

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
                        <strong>${entry.storyName ? `${escapeHtml(entry.storyName)} + konuşma çalışması` : 'Konuşma çalışması'}</strong>
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
            entry.innerHTML = `<div class="therapy-q">🎙️ ${t.location ? `${escapeHtml(t.location)} • ` : ''}${t.category ? `${escapeHtml(t.category)} • ` : ''}Soru: ${escapeHtml(t.question)}</div>${escapeHtml(t.answer)}`;
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
        emoji: '🏠',
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
        emoji: '😊',
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
        emoji: '🤝',
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
        emoji: '⚽',
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
let _useLocationQuestions = true;
let unaskedQuestions = [...CITY_LOCATIONS[currentCityLocationKey].questions];
let currentObj = null;
let isWaiting = false;
let chatHistory = [];
let idleTimer;
let turnCount = 0;

// =============================================
// EŞLEŞTİRME OYUNLARI
// =============================================
const MATCHING_GAMES = [
    {
        key: 'animals',
        title: 'Hayvanları Eşleştir',
        icon: '🐾',
        description: 'Hayvan adını doğru resmiyle eşleştir!',
        usePhotos: true,
        pairs: [
            { label: 'Kedi', emoji: '🐱', query: 'cute cat' },
            { label: 'Köpek', emoji: '🐶', query: 'cute dog' },
            { label: 'Kuş', emoji: '🐦', query: 'colorful bird' },
            { label: 'Balık', emoji: '🐟', query: 'colorful fish' }
        ]
    },
    {
        key: 'colors',
        title: 'Renkleri Eşleştir',
        icon: '🌈',
        description: 'Renk adını doğru renkle eşleştir!',
        usePhotos: false,
        pairs: [
            { label: 'Kırmızı', emoji: '🔴' },
            { label: 'Mavi', emoji: '🔵' },
            { label: 'Sarı', emoji: '🟡' },
            { label: 'Yeşil', emoji: '🟢' }
        ]
    },
    {
        key: 'daily',
        title: 'Eşyaları Eşleştir',
        icon: '🏠',
        description: 'Eşya adını doğru resmiyle eşleştir!',
        usePhotos: true,
        pairs: [
            { label: 'Kalem', emoji: '✏️', query: 'pencil' },
            { label: 'Kitap', emoji: '📚', query: 'book' },
            { label: 'Elma', emoji: '🍎', query: 'red apple' },
            { label: 'Top', emoji: '⚽', query: 'soccer ball' }
        ]
    },
    {
        key: 'fruits',
        title: 'Meyveleri Eşleştir',
        icon: '🍓',
        description: 'Meyve adını doğru resmiyle eşleştir!',
        usePhotos: true,
        pairs: [
            { label: 'Elma', emoji: '🍎', query: 'red apple fruit' },
            { label: 'Muz', emoji: '🍌', query: 'banana fruit' },
            { label: 'Çilek', emoji: '🍓', query: 'strawberry fruit' },
            { label: 'Üzüm', emoji: '🍇', query: 'grapes fruit' }
        ]
    }
];

let currentMatchingGame = null;
let selectedLeftKey = null;
let matchedPairs = [];
let matchingErrors = 0;

function goToMatching() {
    showOnly('matching-screen');
    renderMatchingMenu();
}

async function renderMatchingMenu() {
    const gridEl = document.getElementById('matchingMenuGrid');
    const menuSection = document.getElementById('matchingMenuSection');
    const gameSection = document.getElementById('matchingGameSection');
    if (!gridEl) return;
    if (menuSection) menuSection.style.display = 'block';
    if (gameSection) gameSection.style.display = 'none';

    const customGames = (await DB.get('custom_matching_games')) || [];
    const allGames = [...MATCHING_GAMES, ...customGames];

    gridEl.innerHTML = allGames.map(game => `
        <button type="button" class="matching-game-card" onclick="startMatchingGame('${game.key}')">
            <div class="matching-game-icon">${game.icon}</div>
            <strong>${game.title}</strong>
            <p>${game.description}</p>
            ${game.isCustom ? '<span class="matching-custom-badge">Özel</span>' : ''}
        </button>
    `).join('');
    speakFallback('Bir oyun seç!', () => {});
}

async function startMatchingGame(gameKey) {
    let game = MATCHING_GAMES.find(g => g.key === gameKey);
    if (!game) {
        const customGames = (await DB.get('custom_matching_games')) || [];
        game = customGames.find(g => g.key === gameKey);
    }
    currentMatchingGame = game;
    if (!currentMatchingGame) return;
    selectedLeftKey = null;
    matchedPairs = [];
    matchingErrors = 0;

    const menuSection = document.getElementById('matchingMenuSection');
    const gameSection = document.getElementById('matchingGameSection');
    const titleEl = document.getElementById('matchingGameTitle');
    if (menuSection) menuSection.style.display = 'none';
    if (gameSection) gameSection.style.display = 'block';
    if (titleEl) titleEl.textContent = currentMatchingGame.title;

    renderMatchingGame();
    loadMatchingPhotos(currentMatchingGame);
    speakFallback(currentMatchingGame.description, () => {});
}

function renderMatchingGame() {
    const container = document.getElementById('matchingGameArea');
    if (!container || !currentMatchingGame) return;

    const pairs = currentMatchingGame.pairs;
    const usePhotos = currentMatchingGame.usePhotos;
    const shuffledRight = [...pairs].sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <div class="matching-columns">
            <div class="matching-column" id="matchingLeft">
                ${pairs.map(pair => `
                    <button type="button" class="matching-card matching-label-card ${matchedPairs.includes(pair.label) ? 'matched' : ''}"
                            data-key="${pair.label}"
                            onclick="selectMatchLeft('${pair.label}')">
                        ${pair.label}
                    </button>
                `).join('')}
            </div>
            <div class="matching-column" id="matchingRight">
                ${shuffledRight.map(pair => `
                    <button type="button" class="matching-card matching-emoji-card ${matchedPairs.includes(pair.label) ? 'matched' : ''}"
                            data-key="${pair.label}"
                            onclick="selectMatchRight('${pair.label}', this)">
                        ${usePhotos
                            ? pair.photoUrl
                                ? `<img src="${pair.photoUrl}" alt="${pair.label}" class="matching-card-photo" onerror="this.outerHTML='<span class=\\'matching-emoji\\'>${pair.emoji || '❓'}</span>'">`
                                : `<div class="matching-photo-shimmer" data-photo-key="${pair.label}">
                                       <span class="shimmer-emoji">${pair.emoji}</span>
                                   </div>`
                            : `<span class="matching-emoji">${pair.emoji}</span>`
                        }
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

async function fetchCardPhoto(query) {
    try {
        const r = await fetch('/api/video?query=' + encodeURIComponent(query));
        const d = await r.json();
        if (d && d.videos && d.videos[0] && d.videos[0].image) {
            return d.videos[0].image;
        }
    } catch (e) {}
    return null;
}

async function loadMatchingPhotos(game) {
    if (!game || !game.usePhotos) return;
    for (const pair of game.pairs) {
        if (pair.photoUrl) continue; // özel oyunlarda URL zaten var
        const photoUrl = await fetchCardPhoto(pair.query);
        if (!photoUrl) continue;
        const shimmer = document.querySelector(`.matching-photo-shimmer[data-photo-key="${pair.label}"]`);
        if (shimmer) {
            shimmer.innerHTML = `<img src="${photoUrl}" alt="${pair.label}" class="matching-card-photo" onerror="this.parentNode.innerHTML='<span class=\\'matching-emoji\\'>${pair.emoji}</span>'">`;
            shimmer.classList.add('loaded');
        }
    }
}

/* ========== EŞLEŞTİRME EDITÖRÜ ========== */
let _editorPairs = [];
let _photoDebounceTimers = {};

function openMatchingEditor() {
    const overlay = document.getElementById('matchingEditorOverlay');
    if (overlay) overlay.style.display = 'flex';
    switchEditorTab('list');
    renderEditorGameList();
}

function closeMatchingEditor() {
    const overlay = document.getElementById('matchingEditorOverlay');
    if (overlay) overlay.style.display = 'none';
}

function switchEditorTab(tab) {
    document.getElementById('medListView').style.display = tab === 'list' ? 'block' : 'none';
    document.getElementById('medCreateView').style.display = tab === 'create' ? 'block' : 'none';
    document.getElementById('medTabList').classList.toggle('active', tab === 'list');
    document.getElementById('medTabCreate').classList.toggle('active', tab === 'create');
    if (tab === 'create') {
        _editorPairs = [
            { label: '', photoUrl: '', emoji: '❓' },
            { label: '', photoUrl: '', emoji: '❓' },
            { label: '', photoUrl: '', emoji: '❓' }
        ];
        const titleEl = document.getElementById('medGameTitle');
        const iconEl = document.getElementById('medGameIcon');
        if (titleEl) titleEl.value = '';
        if (iconEl) iconEl.value = '🎯';
        renderEditorPairs();
    }
}

async function renderEditorGameList() {
    const list = document.getElementById('medCustomGameList');
    if (!list) return;
    const games = (await DB.get('custom_matching_games')) || [];
    if (!games.length) {
        list.innerHTML = '<p class="med-empty">Henüz özel oyun yok. "+ Yeni Oyun" ile başla!</p>';
        return;
    }
    list.innerHTML = games.map(g => `
        <div class="med-game-item">
            <span class="med-game-icon">${g.icon}</span>
            <span class="med-game-title">${g.title}</span>
            <span class="med-game-count">${g.pairs.length} çift</span>
            <button type="button" class="med-delete-btn" onclick="deleteCustomMatchingGame('${g.key}')">🗑️</button>
        </div>
    `).join('');
}

function renderEditorPairs() {
    const el = document.getElementById('medPairsList');
    if (!el) return;
    el.innerHTML = _editorPairs.map((pair, i) => `
        <div class="med-pair-row" id="medPair_${i}">
            <input type="text" class="med-pair-input" placeholder="Kelime gir..."
                value="${pair.label}"
                oninput="debounceEditorPhoto(${i}, this.value)">
            <div class="med-pair-preview ${pair.photoUrl ? 'has-photo' : ''}" id="medPreview_${i}">
                ${pair.photoUrl
                    ? `<img src="${pair.photoUrl}" alt="${pair.label}">`
                    : `<span>${pair.emoji || '❓'}</span>`
                }
            </div>
            <button type="button" class="med-pair-remove"
                onclick="removeEditorPair(${i})"
                ${_editorPairs.length <= 2 ? 'disabled' : ''}>✕</button>
        </div>
    `).join('');
}

function debounceEditorPhoto(index, value) {
    _editorPairs[index].label = value;
    clearTimeout(_photoDebounceTimers[index]);
    if (!value.trim()) return;
    _photoDebounceTimers[index] = setTimeout(() => fetchEditorPhoto(index, value.trim()), 700);
}

async function fetchEditorPhoto(index, query) {
    const preview = document.getElementById('medPreview_' + index);
    if (preview) preview.innerHTML = '<span style="font-size:1rem;opacity:0.5">⏳</span>';
    try {
        const r = await fetch('/api/video?query=' + encodeURIComponent(query));
        const d = await r.json();
        const url = d?.videos?.[0]?.image;
        if (url && _editorPairs[index] !== undefined) {
            _editorPairs[index].photoUrl = url;
            const p = document.getElementById('medPreview_' + index);
            if (p) {
                p.classList.add('has-photo');
                p.innerHTML = `<img src="${url}" alt="${query}">`;
            }
        } else {
            const p = document.getElementById('medPreview_' + index);
            if (p) p.innerHTML = '<span>🖼️</span>';
        }
    } catch {
        const p = document.getElementById('medPreview_' + index);
        if (p) p.innerHTML = '<span>❓</span>';
    }
}

function addEditorPair() {
    _editorPairs.push({ label: '', photoUrl: '', emoji: '❓' });
    renderEditorPairs();
}

function removeEditorPair(index) {
    if (_editorPairs.length <= 2) return;
    _editorPairs.splice(index, 1);
    renderEditorPairs();
}

async function saveCustomMatchingGame() {
    const title = (document.getElementById('medGameTitle')?.value || '').trim();
    const icon = (document.getElementById('medGameIcon')?.value || '').trim() || '🎯';
    const validPairs = _editorPairs.filter(p => p.label.trim());

    if (!title) { alert('Oyun adı girin!'); return; }
    if (validPairs.length < 2) { alert('En az 2 kelime girin!'); return; }

    const games = (await DB.get('custom_matching_games')) || [];
    const key = 'custom_' + Date.now();
    const newGame = {
        key,
        title,
        icon,
        description: `${validPairs.length} kelime çifti`,
        usePhotos: validPairs.some(p => p.photoUrl),
        pairs: validPairs.map(p => ({
            label: p.label.trim(),
            emoji: '🖼️',
            query: p.label.trim(),
            photoUrl: p.photoUrl || null
        })),
        isCustom: true
    };
    games.push(newGame);
    DB.set('custom_matching_games', games);
    switchEditorTab('list');
    renderEditorGameList();
}

async function deleteCustomMatchingGame(key) {
    if (!confirm('Bu oyunu silmek istiyor musun?')) return;
    const games = (await DB.get('custom_matching_games')) || [];
    DB.set('custom_matching_games', games.filter(g => g.key !== key));
    renderEditorGameList();
}
/* ========================================== */

function selectMatchLeft(key) {
    if (matchedPairs.includes(key)) return;
    selectedLeftKey = key;
    document.querySelectorAll('#matchingLeft .matching-label-card').forEach(card => {
        card.classList.toggle('selected', card.dataset.key === key);
    });
    speakFallback(key, () => {});
}

function selectMatchRight(key, btn) {
    if (!selectedLeftKey || matchedPairs.includes(key)) return;

    if (selectedLeftKey === key) {
        matchedPairs.push(key);
        btn.classList.add('matched');
        document.querySelectorAll('#matchingLeft .matching-label-card').forEach(card => {
            if (card.dataset.key === key) {
                card.classList.add('matched');
                card.classList.remove('selected');
            }
        });
        selectedLeftKey = null;
        confetti({ particleCount: 30, spread: 45, origin: { y: 0.6 } });
        speakFallback('Harika! Doğru!', () => {});

        if (matchedPairs.length === currentMatchingGame.pairs.length) {
            setTimeout(showMatchingComplete, 700);
        }
    } else {
        matchingErrors++;
        btn.classList.add('error');
        setTimeout(() => btn.classList.remove('error'), 600);
        speakFallback('Tekrar deneyelim!', () => {});
    }
}

function showMatchingComplete() {
    const container = document.getElementById('matchingGameArea');
    if (!container) return;
    confetti({ particleCount: 100, spread: 80 });
    speakFallback('Tebrikler! Çok güzel yaptın!', () => {});
    container.innerHTML = `
        <div class="matching-complete">
            <div class="matching-complete-icon">⭐</div>
            <h3>Tebrikler!</h3>
            <p>Tüm eşleştirmeleri doğru yaptın!</p>
            <div class="matching-complete-stats">
                <span>${currentMatchingGame.pairs.length} doğru eşleştirme</span>
                ${matchingErrors > 0 ? `<span>${matchingErrors} deneme</span>` : ''}
            </div>
            <div class="matching-complete-btns">
                <button type="button" class="btn-primary-gradient" onclick="startMatchingGame('${currentMatchingGame.key}')">Tekrar Oyna</button>
                <button type="button" class="menu-ghost-btn" onclick="renderMatchingMenu()">Başka Oyun</button>
            </div>
        </div>
    `;
}

// =============================================
// İLERLEME & YARDIMCI FONKSIYONLAR
// =============================================
function updateProgressBar() {
    const allQuestions = getActiveTherapyQuestions();
    const total = allQuestions.length;
    const answered = total - unaskedQuestions.length;
    const pct = total > 0 ? Math.round((answered / total) * 100) : 0;

    const fill = document.getElementById('therapyProgressFill');
    const label = document.getElementById('therapyProgressLabel');
    if (fill) fill.style.width = pct + '%';
    if (label) label.textContent = `Soru ${answered} / ${total}`;
}

function rereadQuestion() {
    if (currentObj) {
        speakFallback(currentObj.q, () => {});
    }
}

async function askAIMode(mode) {
    if (!currentObj) return;
    if (mode === 'repeat') {
        sessionData.repeatUsed++;
        addMessage('Soruyu tekrar okuyorum...', 'ai');
        speakFallback(currentObj.q, () => {});
    } else if (mode === 'simplify') {
        sessionData.simplifyUsed++;
        const simplePrompt = `Şu soruyu, 4-8 yaş arası özel eğitim desteği alan bir çocuk için çok basit 1-2 kelimeyle açıkla: "${currentObj.q}". Maksimum 1 kısa cümle.`;
        const res = await getGemmaResponse(simplePrompt);
        addMessage(res, 'ai');
        speakFallback(res, () => {});
    }
}

function getCurrentTherapyCategory() {
    return THERAPY_CATEGORIES[currentTherapyCategoryKey] || THERAPY_CATEGORIES.daily_life;
}

function getCurrentCityLocation() {
    return CITY_LOCATIONS[currentCityLocationKey] || CITY_LOCATIONS.school;
}

function getActiveTherapyQuestions() {
    if (_useLocationQuestions) {
        const location = getCurrentCityLocation();
        if (location && Array.isArray(location.questions) && location.questions.length) {
            return location.questions;
        }
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
            <span class="therapy-cat-emoji">${category.emoji || ''}</span> ${category.label}
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
    _useLocationQuestions = false;
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
    _useLocationQuestions = true;
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
    updateProgressBar();
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
    updateProgressBar();

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
        } else {
            const fallbackVideoUrl = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
            vEl.muted = true;
            vEl.setAttribute('playsinline', '');
            vEl.src = fallbackVideoUrl;
            vEl.load();
            const videoTimeout = setTimeout(function() {
                startQuestion();
            }, 5000);
            vEl.onloadeddata = function() {
                clearTimeout(videoTimeout);
                vEl.play().catch(function() {});
                setTimeout(function() { startQuestion(); }, 1200);
            };
            vEl.onerror = function() { clearTimeout(videoTimeout); startQuestion(); };
        }
    } catch(e) {
        const fallbackVideoUrl = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
        vEl.muted = true;
        vEl.setAttribute('playsinline', '');
        vEl.src = fallbackVideoUrl;
        vEl.load();
        const videoTimeout = setTimeout(function() {
            startQuestion();
        }, 5000);
        vEl.onloadeddata = function() {
            clearTimeout(videoTimeout);
            vEl.play().catch(function() {});
            setTimeout(function() { startQuestion(); }, 1200);
        };
        vEl.onerror = function() { clearTimeout(videoTimeout); startQuestion(); };
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
    if (!SpeechRecognition) {
        document.getElementById('info').innerText = "Tarayıcı ses tanımayı desteklemiyor. Chrome veya Edge kullanmayı dene.";
        document.getElementById('micBtn').disabled = true;
        return;
    }
    document.getElementById('micBtn').disabled = true;
    document.getElementById('info').innerText = "Dinlemeye hazırlanıyorum...";
    var recognition = new SpeechRecognition();
    recognition.lang = "tr-TR";
    recognition.interimResults = true;   // anlık metin gösterimi için
    recognition.maxAlternatives = 1;
    recognition.continuous = true;       // duraksayınca kapanmasın
    var _speechBuffer = '';
    var _silenceTimer = null;
    var _recognized = false;

    async function _finalizeSpeech() {
        recognition.stop();
        const speech = _speechBuffer.trim();
        if (!speech) return;
        _speechBuffer = '';
        addMessage(speech, "user");
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
    }

    var _volStream = null, _volCtx = null, _volFrame = null;

    function _startVolumeRings() {
        var rings = document.querySelectorAll('.mic-ring');
        navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(function(stream) {
            _volStream = stream;
            _volCtx = new (window.AudioContext || window.webkitAudioContext)();
            var source = _volCtx.createMediaStreamSource(stream);
            var analyser = _volCtx.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);
            var data = new Uint8Array(analyser.frequencyBinCount);

            function tick() {
                analyser.getByteFrequencyData(data);
                var sum = 0;
                for (var i = 0; i < data.length; i++) sum += data[i];
                var vol = sum / data.length; // 0–128 arası tipik
                rings.forEach(function(ring, i) {
                    var scale = 1 + (vol / 128) * (0.55 + i * 0.35);
                    var opacity = Math.min(vol / 60, 1) * (1 - i * 0.28);
                    ring.style.transform = 'scale(' + scale + ')';
                    ring.style.opacity = opacity;
                });
                _volFrame = requestAnimationFrame(tick);
            }
            tick();
        }).catch(function() { /* izin reddedildi veya zaten kullanımda — sessizce geç */ });
    }

    function _stopVolumeRings() {
        if (_volFrame) { cancelAnimationFrame(_volFrame); _volFrame = null; }
        if (_volStream) { _volStream.getTracks().forEach(function(t) { t.stop(); }); _volStream = null; }
        if (_volCtx) { _volCtx.close(); _volCtx = null; }
        document.querySelectorAll('.mic-ring').forEach(function(r) {
            r.style.transform = 'scale(1)';
            r.style.opacity = 0;
        });
    }

    recognition.onstart = function() {
        document.getElementById('micBtn').classList.add('listening');
        document.getElementById('info').innerText = "Seni dinliyorum... 🎙️";
        _startVolumeRings();
    };

    recognition.onresult = function(e) {
        clearTimeout(_silenceTimer);
        var interim = '';
        for (var i = e.resultIndex; i < e.results.length; i++) {
            if (e.results[i].isFinal) {
                _speechBuffer += e.results[i][0].transcript + ' ';
                _recognized = true;
            } else {
                interim = e.results[i][0].transcript;
            }
        }
        // Anlık metni göster — öğrenci duyulduğunu hisseder
        var display = (_speechBuffer + interim).trim();
        if (display) document.getElementById('info').innerText = '🎙️ ' + display;

        // 2.5 sn sessizlik sonrası gönder
        _silenceTimer = setTimeout(_finalizeSpeech, 2500);
    };

    recognition.onerror = function(err) {
        clearTimeout(_silenceTimer);
        _stopVolumeRings();
        document.getElementById('micBtn').disabled = false;
        document.getElementById('micBtn').classList.remove('listening');
        if (err.error === 'not-allowed') document.getElementById('info').innerText = "Mikrofon izni gerekli.";
        else if (err.error === 'no-speech') {
            // Ses gelmedi ama buffer'da bir şey varsa gönder
            if (_speechBuffer.trim()) { _finalizeSpeech(); return; }
            document.getElementById('info').innerText = "Sesi duymadım, tekrar dene!";
        } else document.getElementById('info').innerText = "Duyamadım, tekrar eder misin?";
    };

    recognition.onend = function() {
        clearTimeout(_silenceTimer);
        _stopVolumeRings();
        document.getElementById('micBtn').classList.remove('listening');
        // Buffer'da metin varsa gönder (tarayıcı kendi kapattıysa)
        if (_speechBuffer.trim() && _recognized) {
            _finalizeSpeech();
        } else if (document.getElementById('micBtn').disabled && isWaiting) {
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
    var instructions = `Sen özel eğitim öğrencileriyle sosyal uyum, kurallar ve günlük yaşam rutinleri çalışan, çok kısa ve somut konuşan bir AAC (Alternatif İletişim) oyun arkadaşı botsun. Adın Yıldız Can. Öğrencinin adı ${childName}. Çalışılan konu: ${currentTopic || currentCategory.label}. Bu sorunun hedefi: ${currentGoal}. Öğrencinin dikkat ve sözel anlama sınırlılıklarını asla unutma.

KATI ETKİLEŞİM VE DİL KURALLARI:
1. TEK CÜMLE KURALI: Her cevabın MAKSİMUM 1 kısa cümleden oluşmalıdır (En fazla 6-7 kelime). Asla uzun paragraflar, didaktik açıklamalar veya şartlı nasihatler yapma.
2. SOYUT DÜŞÜNME VE EMOJİ DESTEĞİ: Soyut kavramları somutlaştırmak için cümlenin sonuna tek bir uygun emoji koy (Örn: ⚽ 🟥 🤫 👋).
3. ARGO VE REAKSİYONEL DİRENÇ SÖNÜMLENDİRME: Öğrenci küfür veya argo kullanırsa bu kelimeleri ASLA tekrarlama, eleştirme veya "küfür etme" deme. Hatalı davranışı tamamen görmezden gel.
4. ÇOCUĞUN ADINA CEVAP VERME YASAĞI: Öğrenci yerine onun söylemediği onaylama cümleleri üretme. Kontrolü her zaman öğrenciye bırak.
5. AKRAN DİLİYLE ALTERNATİF SUNMA: Öğrenci olumsuz davranışta ısrar ederse duyguyu çok kısa onayla, kabul edilebilir akran modelini sun ve sahneyi değiştir. (Örn: "Maçta öfkelenmek normal! ⚽ Ama hakeme sadece 'Hocam bence fauldü' diyebiliriz.")`;

    var payload = {
        contents: [
            { role: "user", parts: [{ text: "GÖREV: " + instructions }] },
            { role: "model", parts: [{ text: "Tamam! Sohbeti başlatıyorum." }] }
        ].concat(chatHistory)
    };
    try {
        var res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        var data = await res.json();
        var reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!reply) {
            console.error('Gemini yanıt boş:', JSON.stringify(data));
            return 'Yapay zeka şu an yanıt veremiyor, biraz bekle.';
        }
        chatHistory.push({ role: "model", parts: [{ text: reply }] });
        return reply;
    } catch (e) {
        console.error('Gemini hata:', e);
        return 'Yapay zeka şu an yanıt veremiyor, biraz bekle.';
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
// GÜNLÜK PROGRAM (SCHEDULE)
// =============================================
// Activities (the list itself) are per-student and persist across days.
// Completion status is per-student per-day.
function scheduleActivitiesKey() {
    return `sched_acts_${activeStudentId || 'default'}`;
}
function scheduleCompletionKey() {
    const today = new Date().toISOString().slice(0, 10);
    return `sched_done_${activeStudentId || 'default'}_${today}`;
}

function loadScheduleActivities() {
    const raw = localStorage.getItem(scheduleActivitiesKey());
    if (raw) { try { return JSON.parse(raw); } catch(e) {} }
    return [];
}
function saveScheduleActivities(acts) {
    localStorage.setItem(scheduleActivitiesKey(), JSON.stringify(acts));
}
function loadScheduleCompletion() {
    const raw = localStorage.getItem(scheduleCompletionKey());
    if (raw) { try { return JSON.parse(raw); } catch(e) {} }
    return {};
}
function saveScheduleCompletion(done) {
    localStorage.setItem(scheduleCompletionKey(), JSON.stringify(done));
}

function goToSchedule() {
    showOnly('schedule-screen');
    const today = new Date();
    const days = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
    const months = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
    document.getElementById('scheduleDate').textContent =
        `${days[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]}`;
    cancelAddActivity();
    renderSchedule();
}

function renderSchedule() {
    const activities = loadScheduleActivities();
    const done = loadScheduleCompletion();
    const list = document.getElementById('scheduleList');
    const progressWrap = document.getElementById('scheduleProgressWrap');
    const resetBtn = document.getElementById('scheduleResetBtn');

    if (!activities.length) {
        list.innerHTML = `
            <div class="schedule-empty">
                <span>📋</span>
                <p>Henüz etkinlik eklenmedi.</p>
                <p><strong>"+ Etkinlik Ekle"</strong> butonuyla bu öğrencinin programını oluşturun.</p>
            </div>`;
        progressWrap.style.display = 'none';
        resetBtn.style.display = 'none';
        return;
    }

    progressWrap.style.display = '';
    resetBtn.style.display = '';
    const doneCount = activities.filter(a => done[a.id]).length;
    const pct = Math.round((doneCount / activities.length) * 100);
    document.getElementById('scheduleProgress').textContent = `${doneCount} / ${activities.length} tamamlandı`;
    document.getElementById('scheduleProgressFill').style.width = pct + '%';

    list.innerHTML = activities.map(a => `
        <div class="schedule-item ${done[a.id] ? 'done' : ''}">
            <button class="schedule-check-btn" onclick="toggleScheduleActivity('${escapeHtml(a.id)}')"
                aria-label="${done[a.id] ? 'Geri al' : 'Tamamlandı işaretle'}">
                ${done[a.id] ? '✅' : '⬜'}
            </button>
            <span class="schedule-item-emoji">${escapeHtml(a.emoji)}</span>
            <span class="schedule-item-label">${escapeHtml(a.label)}</span>
            ${a.time ? `<span class="schedule-item-time">${escapeHtml(a.time)}</span>` : ''}
            <button class="schedule-delete-btn" onclick="deleteScheduleActivity('${escapeHtml(a.id)}')"
                aria-label="Sil">✕</button>
        </div>
    `).join('');
}

function showAddActivityForm() {
    document.getElementById('scheduleAddForm').style.display = '';
    document.getElementById('scheduleLabelInput').focus();
}

function cancelAddActivity() {
    const form = document.getElementById('scheduleAddForm');
    if (form) form.style.display = 'none';
    ['scheduleEmojiInput','scheduleLabelInput','scheduleTimeInput'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
}

function saveNewActivity() {
    const emoji = (document.getElementById('scheduleEmojiInput').value.trim()) || '📌';
    const label = document.getElementById('scheduleLabelInput').value.trim();
    const time  = document.getElementById('scheduleTimeInput').value;
    if (!label) { document.getElementById('scheduleLabelInput').focus(); return; }
    const acts = loadScheduleActivities();
    acts.push({ id: 'a_' + Date.now(), emoji, label, time });
    saveScheduleActivities(acts);
    cancelAddActivity();
    renderSchedule();
}

function deleteScheduleActivity(id) {
    saveScheduleActivities(loadScheduleActivities().filter(a => a.id !== id));
    const done = loadScheduleCompletion();
    delete done[id];
    saveScheduleCompletion(done);
    renderSchedule();
}

function toggleScheduleActivity(id) {
    const done = loadScheduleCompletion();
    const wasDone = !!done[id];
    if (wasDone) { delete done[id]; } else { done[id] = true; }
    saveScheduleCompletion(done);
    if (!wasDone) {
        const act = loadScheduleActivities().find(a => a.id === id);
        if (act) speakFallback(act.label + ' tamamlandı!');
    }
    renderSchedule();
}

function resetSchedule() {
    saveScheduleCompletion({});
    renderSchedule();
}

// =============================================
// AAC PANOSU
// =============================================
const AAC_CATEGORIES = [
    {
        id: 'feelings', label: '😊 Duygular', color: '#ff9f43',
        cards: [
            { emoji: '😊', text: 'Mutluyum' },
            { emoji: '😢', text: 'Üzgünüm' },
            { emoji: '😡', text: 'Kızgınım' },
            { emoji: '😨', text: 'Korkuyorum' },
            { emoji: '😴', text: 'Yorgunum' },
            { emoji: '🤢', text: 'Midem bulanıyor' },
            { emoji: '😍', text: 'Seviyorum' },
            { emoji: '😐', text: 'Fark etmez' },
        ]
    },
    {
        id: 'needs', label: '🙋 İhtiyaçlar', color: '#48dbfb',
        cards: [
            { emoji: '🚰', text: 'Su istiyorum' },
            { emoji: '🍎', text: 'Acıktım' },
            { emoji: '🚽', text: 'Tuvalet' },
            { emoji: '😴', text: 'Uyumak istiyorum' },
            { emoji: '🎮', text: 'Oyun oynamak istiyorum' },
            { emoji: '🤗', text: 'Sarılmak istiyorum' },
            { emoji: '🛑', text: 'Dur / Hayır' },
            { emoji: '✅', text: 'Evet / Tamam' },
        ]
    },
    {
        id: 'activities', label: '🎯 Etkinlikler', color: '#1dd1a1',
        cards: [
            { emoji: '📚', text: 'Okumak istiyorum' },
            { emoji: '✏️', text: 'Çizmek istiyorum' },
            { emoji: '🎵', text: 'Müzik dinlemek istiyorum' },
            { emoji: '📺', text: 'Video izlemek istiyorum' },
            { emoji: '🧩', text: 'Puzzle yapmak istiyorum' },
            { emoji: '🏃', text: 'Koşmak istiyorum' },
            { emoji: '🎨', text: 'Boyama yapmak istiyorum' },
            { emoji: '🤝', text: 'Yardım istiyorum' },
        ]
    },
    {
        id: 'places', label: '📍 Yerler', color: '#a29bfe',
        cards: [
            { emoji: '🏠', text: 'Eve gitmek istiyorum' },
            { emoji: '🏫', text: 'Okula gitmek istiyorum' },
            { emoji: '🌳', text: 'Bahçeye gitmek istiyorum' },
            { emoji: '🏪', text: 'Markete gitmek istiyorum' },
            { emoji: '🚗', text: 'Arabaya binmek istiyorum' },
            { emoji: '🏥', text: 'Doktora gitmek istiyorum' },
            { emoji: '🛁', text: 'Banyoya gitmek istiyorum' },
            { emoji: '🛏️', text: 'Odama gitmek istiyorum' },
        ]
    },
];

let aacSentence = [];
let aacCurrentCategory = 'feelings';

function goToAac() {
    showOnly('aac-screen');
    aacSentence = [];
    aacCurrentCategory = AAC_CATEGORIES[0].id;
    renderAacCategories();
    renderAacGrid();
    updateAacSentenceBar();
}

function renderAacCategories() {
    const wrap = document.getElementById('aacCategories');
    wrap.innerHTML = AAC_CATEGORIES.map(cat => `
        <button type="button"
            class="aac-cat-btn ${cat.id === aacCurrentCategory ? 'active' : ''}"
            style="--cat-color:${escapeHtml(cat.color)}"
            onclick="setAacCategory('${escapeHtml(cat.id)}')">
            ${escapeHtml(cat.label)}
        </button>
    `).join('');
}

function setAacCategory(id) {
    aacCurrentCategory = id;
    renderAacCategories();
    renderAacGrid();
}

function renderAacGrid() {
    const cat = AAC_CATEGORIES.find(c => c.id === aacCurrentCategory);
    if (!cat) return;
    const grid = document.getElementById('aacGrid');
    grid.innerHTML = cat.cards.map((card, i) => `
        <button type="button" class="aac-card" onclick="tapAacCard(${i})"
            style="--cat-color:${escapeHtml(cat.color)}">
            <span class="aac-card-emoji">${escapeHtml(card.emoji)}</span>
            <span class="aac-card-text">${escapeHtml(card.text)}</span>
        </button>
    `).join('');
}

function tapAacCard(index) {
    const cat = AAC_CATEGORIES.find(c => c.id === aacCurrentCategory);
    if (!cat) return;
    const card = cat.cards[index];
    if (!card) return;
    aacSentence.push(card.text);
    updateAacSentenceBar();
    speakFallback(card.text);
}

function updateAacSentenceBar() {
    const wrap = document.getElementById('aacSentenceWords');
    if (!aacSentence.length) {
        wrap.innerHTML = '<span class="aac-sentence-placeholder">Kart seç, cümle oluştur...</span>';
        return;
    }
    wrap.innerHTML = aacSentence.map((w, i) => `
        <span class="aac-word-chip" onclick="removeAacWord(${i})">${escapeHtml(w)} ✕</span>
    `).join('');
}

function removeAacWord(index) {
    aacSentence.splice(index, 1);
    updateAacSentenceBar();
}

function speakAacSentence() {
    if (!aacSentence.length) return;
    speakFallback(aacSentence.join('. '));
}

function clearAacSentence() {
    aacSentence = [];
    updateAacSentenceBar();
}

// =============================================
// ÖDÜL SİSTEMİ (TOKEN ECONOMY)
// =============================================
// GİZLİ YILDIZ ÖDÜL — seans sonu otomatik
// =============================================
function _showStarReward() {
    const mic = sessionData.micUsedInTherapy || 0;
    const repeat = sessionData.repeatUsed || 0;
    const simplify = sessionData.simplifyUsed || 0;
    const total = mic + repeat + simplify;
    if (total === 0) return;

    const indPct = Math.round((mic / total) * 100);
    let stars, title, sub;
    if (indPct >= 75) {
        stars = 5;
        title = 'Muhteşemsin! 🎉';
        sub = 'Bu seans kendi başına çok güzel konuştun!';
    } else if (indPct >= 45) {
        stars = 3;
        title = 'Aferin! ⭐';
        sub = 'Harika bir seans geçirdin, her gün daha iyisin!';
    } else {
        stars = 1;
        title = 'Eline sağlık! 💪';
        sub = 'Bugün de konuşmak için çaba gösterdin, bu çok değerli!';
    }

    const starsEl = document.getElementById('starModalStars');
    const titleEl = document.getElementById('starModalTitle');
    const subEl = document.getElementById('starModalSub');
    const modal = document.getElementById('starRewardModal');
    if (!modal) return;

    starsEl.innerHTML = Array.from({ length: 5 }, (_, i) =>
        `<span class="star-icon ${i < stars ? 'star-on' : 'star-off'}" style="animation-delay:${i * 0.12}s">⭐</span>`
    ).join('');
    titleEl.textContent = title;
    subEl.textContent = sub;
    modal.style.display = 'flex';

    if (typeof confetti === 'function' && stars >= 3) {
        setTimeout(() => confetti({ particleCount: stars === 5 ? 140 : 70, spread: 80, origin: { y: 0.45 } }), 400);
    }
    speakFallback(title + ' ' + sub);
}

function closeStarModal() {
    const modal = document.getElementById('starRewardModal');
    if (modal) modal.style.display = 'none';
}

// =============================================
// SIRALAMA OYUNLARI
// =============================================
const SEQUENCE_GAMES = [
    {
        id: 'morning', title: 'Sabah Rutini', emoji: '🌅',
        type: 'order',
        items: [
            { emoji: '😴', text: 'Uyan' },
            { emoji: '🦷', text: 'Diş Fırçala' },
            { emoji: '👕', text: 'Giy' },
            { emoji: '🍳', text: 'Kahvaltı Et' },
            { emoji: '🎒', text: 'Çantanı Al' },
            { emoji: '🚌', text: 'Okula Git' },
        ]
    },
    {
        id: 'washing', title: 'El Yıkama', emoji: '🧼',
        type: 'order',
        items: [
            { emoji: '🚰', text: 'Musluğu Aç' },
            { emoji: '💧', text: 'Elleri Islatır' },
            { emoji: '🧴', text: 'Sabun Al' },
            { emoji: '🤲', text: 'Ova Ova Yıka' },
            { emoji: '🚿', text: 'Durula' },
            { emoji: '🧻', text: 'Kurula' },
        ]
    },
    {
        id: 'meal', title: 'Yemek Hazırlığı', emoji: '🍽️',
        type: 'order',
        items: [
            { emoji: '🪑', text: 'Masaya Otur' },
            { emoji: '🧺', text: 'Önlük Tak' },
            { emoji: '🥄', text: 'Kaşık Al' },
            { emoji: '😋', text: 'Ye' },
            { emoji: '🧹', text: 'Masayı Temizle' },
        ]
    },
    {
        id: 'cause', title: 'Sebep-Sonuç', emoji: '🔗',
        type: 'cause',
        pairs: [
            { cause: { emoji: '🌧️', text: 'Yağmur yağıyor' }, effect: { emoji: '☂️', text: 'Şemsiye alıyoruz' } },
            { cause: { emoji: '😢', text: 'Düşüp acıdı' }, effect: { emoji: '😭', text: 'Ağlıyor' } },
            { cause: { emoji: '🌱', text: 'Çiçeği suladım' }, effect: { emoji: '🌸', text: 'Çiçek açtı' } },
            { cause: { emoji: '🌑', text: 'Hava karardı' }, effect: { emoji: '💡', text: 'Işık yaktık' } },
        ]
    },
];

let seqState = null;

function goToSequence() {
    showOnly('sequence-screen');
    seqState = null;
    document.getElementById('sequenceGame').style.display = 'none';
    document.getElementById('sequenceMenu').style.display = '';
    renderSequenceMenu();
}

function renderSequenceMenu() {
    const menu = document.getElementById('sequenceMenu');
    menu.innerHTML = `
        <h2 class="seq-menu-title">🔢 Sıralama Oyunları</h2>
        <div class="seq-menu-grid">
            ${SEQUENCE_GAMES.map((g, i) => `
                <button type="button" class="seq-menu-card" onclick="startSequenceGame(${i})">
                    <span class="seq-menu-emoji">${escapeHtml(g.emoji)}</span>
                    <span class="seq-menu-label">${escapeHtml(g.title)}</span>
                    <span class="seq-menu-type">${g.type === 'cause' ? 'Sebep-Sonuç' : 'Sıralama'}</span>
                </button>
            `).join('')}
        </div>
    `;
}

function startSequenceGame(index) {
    const game = SEQUENCE_GAMES[index];
    document.getElementById('sequenceMenu').style.display = 'none';
    document.getElementById('sequenceGame').style.display = '';
    if (game.type === 'cause') {
        renderCauseEffectGame(game);
    } else {
        renderOrderingGame(game);
    }
}

function renderOrderingGame(game) {
    const shuffled = [...game.items].sort(() => Math.random() - 0.5);
    seqState = { game, shuffled, selected: null, placed: [], errors: 0 };
    const el = document.getElementById('sequenceGame');
    el.innerHTML = `
        <div class="seq-game-header">
            <h3>${escapeHtml(game.emoji)} ${escapeHtml(game.title)}</h3>
            <p class="seq-hint">Adımları doğru sıraya diz!</p>
        </div>
        <div class="seq-target-slots" id="seqTargetSlots">
            ${game.items.map((_, i) => `<div class="seq-slot" id="seqSlot_${i}">${i+1}</div>`).join('')}
        </div>
        <div class="seq-cards-pool" id="seqCardsPool">
            ${shuffled.map((item, i) => `
                <button type="button" class="seq-card" id="seqCard_${i}"
                    onclick="tapSequenceCard(${i})">
                    <span class="seq-card-emoji">${escapeHtml(item.emoji)}</span>
                    <span class="seq-card-text">${escapeHtml(item.text)}</span>
                </button>
            `).join('')}
        </div>
        <div class="seq-feedback" id="seqFeedback"></div>
        <button type="button" class="seq-back-btn" onclick="goToSequence()">← Oyun Seçimine Dön</button>
    `;
}

function tapSequenceCard(cardIndex) {
    if (!seqState || seqState.placed.includes(cardIndex)) return;
    const item = seqState.shuffled[cardIndex];
    const nextPos = seqState.placed.length;
    const correctItem = seqState.game.items[nextPos];
    const cardEl = document.getElementById('seqCard_' + cardIndex);

    if (item.text === correctItem.text) {
        seqState.placed.push(cardIndex);
        const slot = document.getElementById('seqSlot_' + (nextPos));
        if (slot) slot.innerHTML = `<span>${escapeHtml(item.emoji)}</span><span>${escapeHtml(item.text)}</span>`;
        if (slot) slot.classList.add('filled');
        if (cardEl) { cardEl.classList.add('used'); cardEl.disabled = true; }
        speakFallback(item.text);
        document.getElementById('seqFeedback').textContent = '';

        if (seqState.placed.length === seqState.game.items.length) {
            setTimeout(() => {
                document.getElementById('seqFeedback').textContent = '🎉 Harika! Doğru sıraladın!';
                speakFallback('Harika! Doğru sıraladın!');
                if (typeof confetti === 'function') confetti({ particleCount: 80, spread: 60, origin: {y: 0.6} });
            }, 300);
        }
    } else {
        seqState.errors++;
        if (cardEl) cardEl.classList.add('shake');
        setTimeout(() => { if (cardEl) cardEl.classList.remove('shake'); }, 500);
        document.getElementById('seqFeedback').textContent = '❌ Bu doğru sıra değil, tekrar dene!';
        speakFallback('Tekrar dene!');
    }
}

function renderCauseEffectGame(game) {
    const pairs = [...game.pairs].sort(() => Math.random() - 0.5);
    const effectsShuffled = [...pairs].sort(() => Math.random() - 0.5);
    seqState = { game, pairs, effectsShuffled, selectedCause: null, matched: 0, errors: 0 };

    const el = document.getElementById('sequenceGame');
    el.innerHTML = `
        <div class="seq-game-header">
            <h3>${escapeHtml(game.emoji)} ${escapeHtml(game.title)}</h3>
            <p class="seq-hint">Sebebi seç, sonra sonucuna dokun!</p>
        </div>
        <div class="cause-effect-area">
            <div class="cause-col">
                <h4>Sebep</h4>
                <div class="cause-cards" id="causeCards">
                    ${pairs.map((p, i) => `
                        <button type="button" class="seq-card cause-card" id="causeCard_${i}"
                            onclick="selectCause(${i})">
                            <span class="seq-card-emoji">${escapeHtml(p.cause.emoji)}</span>
                            <span class="seq-card-text">${escapeHtml(p.cause.text)}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
            <div class="effect-col">
                <h4>Sonuç</h4>
                <div class="effect-cards" id="effectCards">
                    ${effectsShuffled.map((p, i) => `
                        <button type="button" class="seq-card effect-card" id="effectCard_${i}"
                            onclick="selectEffect(${i})">
                            <span class="seq-card-emoji">${escapeHtml(p.effect.emoji)}</span>
                            <span class="seq-card-text">${escapeHtml(p.effect.text)}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        </div>
        <div class="seq-feedback" id="seqFeedback"></div>
        <button type="button" class="seq-back-btn" onclick="goToSequence()">← Oyun Seçimine Dön</button>
    `;
}

function selectCause(i) {
    document.querySelectorAll('.cause-card').forEach(c => c.classList.remove('selected'));
    const el = document.getElementById('causeCard_' + i);
    if (el) el.classList.add('selected');
    seqState.selectedCause = i;
    speakFallback(seqState.pairs[i].cause.text);
}

function selectEffect(i) {
    if (seqState.selectedCause === null) {
        document.getElementById('seqFeedback').textContent = 'Önce bir sebep seç!';
        return;
    }
    const causePair = seqState.pairs[seqState.selectedCause];
    const effectPair = seqState.effectsShuffled[i];

    if (causePair.effect.text === effectPair.effect.text) {
        const causeEl = document.getElementById('causeCard_' + seqState.selectedCause);
        const effectEl = document.getElementById('effectCard_' + i);
        if (causeEl) { causeEl.classList.add('used'); causeEl.disabled = true; }
        if (effectEl) { effectEl.classList.add('used'); effectEl.disabled = true; }
        seqState.matched++;
        seqState.selectedCause = null;
        document.getElementById('seqFeedback').textContent = '✅ Doğru eşleştirme!';
        speakFallback('Doğru! Aferin!');
        if (seqState.matched === seqState.pairs.length) {
            setTimeout(() => {
                document.getElementById('seqFeedback').textContent = '🎉 Tüm çiftleri buldun!';
                speakFallback('Tüm çiftleri buldun! Harika!');
                if (typeof confetti === 'function') confetti({ particleCount: 80, spread: 60, origin: {y: 0.6} });
            }, 300);
        }
    } else {
        seqState.errors++;
        const effectEl = document.getElementById('effectCard_' + i);
        if (effectEl) { effectEl.classList.add('shake'); setTimeout(() => effectEl.classList.remove('shake'), 500); }
        document.getElementById('seqFeedback').textContent = '❌ Bu doğru eşleşme değil!';
        speakFallback('Tekrar dene!');
    }
}

// =============================================
// ERİŞİLEBİLİRLİK AYARLARI
// =============================================
function loadA11ySettings() {
    const raw = localStorage.getItem('a11y_settings');
    if (raw) { try { return JSON.parse(raw); } catch(e) {} }
    return { largeText: false, highContrast: false, largeTouch: false, reduceMotion: false, voiceLabel: false };
}

function saveA11ySettings(settings) {
    localStorage.setItem('a11y_settings', JSON.stringify(settings));
}

function applyA11y() {
    const settings = {
        largeText:     document.getElementById('a11y-large-text')?.checked || false,
        highContrast:  document.getElementById('a11y-high-contrast')?.checked || false,
        largeTouch:    document.getElementById('a11y-large-touch')?.checked || false,
        reduceMotion:  document.getElementById('a11y-reduce-motion')?.checked || false,
        voiceLabel:    document.getElementById('a11y-voice-label')?.checked || false,
    };
    saveA11ySettings(settings);
    applyA11yClasses(settings);
}

function _a11yVoiceHandler(e) {
    const btn = e.target.closest('button');
    if (!btn) return;
    const txt = btn.getAttribute('aria-label') || btn.textContent.replace(/\s+/g, ' ').trim().slice(0, 80);
    if (txt) speakFallback(txt);
}

function applyA11yClasses(settings) {
    document.body.classList.toggle('a11y-large-text',    settings.largeText);
    document.body.classList.toggle('a11y-high-contrast', settings.highContrast);
    document.body.classList.toggle('a11y-large-touch',   settings.largeTouch);
    document.body.classList.toggle('a11y-reduce-motion', settings.reduceMotion);
    document.body.classList.toggle('a11y-voice-label',   settings.voiceLabel);
    document.removeEventListener('click', _a11yVoiceHandler, true);
    if (settings.voiceLabel) {
        document.addEventListener('click', _a11yVoiceHandler, true);
    }
}

function toggleA11yPanel() {
    const panel = document.getElementById('a11y-panel');
    if (!panel) return;
    const isOpen = panel.style.display !== 'none';
    panel.style.display = isOpen ? 'none' : 'flex';
    if (!isOpen) {
        const settings = loadA11ySettings();
        const map = {
            'a11y-large-text':    'largeText',
            'a11y-high-contrast': 'highContrast',
            'a11y-large-touch':   'largeTouch',
            'a11y-reduce-motion': 'reduceMotion',
            'a11y-voice-label':   'voiceLabel',
        };
        Object.entries(map).forEach(([id, key]) => {
            const el = document.getElementById(id);
            if (el) el.checked = !!settings[key];
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const settings = loadA11ySettings();
    applyA11yClasses(settings);
});

// =============================================
// WINDOW EXPORT (HTML onclick için)
// =============================================
window.goToMenu = goToMenu;
window.goToTherapy = goToTherapy;
window.setTopicChip = setTopicChip;
window.startTherapyWithTopic = startTherapyWithTopic;
window.setTherapyCategory = setTherapyCategory;
window.focusCityLocation = focusCityLocation;
window.startFocusedCityLocation = startFocusedCityLocation;
window.openCityLocation = openCityLocation;
window.goToReport = goToReport;
window.rec = rec;
window.loadNext = loadNext;
window.logout = authLogout;
window.openOnboarding = openOnboarding;
window.openStudentSetup = openStudentSetup;
window.createStudent = createStudent;
window.updateStudent = updateStudent;
window.selectStudent = selectStudent;
window.changeHistoryMonth = changeHistoryMonth;
window.goToMatching = goToMatching;
window.renderMatchingMenu = renderMatchingMenu;
window.startMatchingGame = startMatchingGame;
window.selectMatchLeft = selectMatchLeft;
window.selectMatchRight = selectMatchRight;
window.rereadQuestion = rereadQuestion;
window.askAIMode = askAIMode;
// Yeni özellikler
window.goToSchedule = goToSchedule;
window.showAddActivityForm = showAddActivityForm;
window.cancelAddActivity = cancelAddActivity;
window.saveNewActivity = saveNewActivity;
window.deleteScheduleActivity = deleteScheduleActivity;
window.toggleScheduleActivity = toggleScheduleActivity;
window.resetSchedule = resetSchedule;
window.goToAac = goToAac;
window.setAacCategory = setAacCategory;
window.tapAacCard = tapAacCard;
window.removeAacWord = removeAacWord;
window.speakAacSentence = speakAacSentence;
window.clearAacSentence = clearAacSentence;
window.closeStarModal = closeStarModal;
window.goToSequence = goToSequence;
window.startSequenceGame = startSequenceGame;
window.tapSequenceCard = tapSequenceCard;
window.selectCause = selectCause;
window.selectEffect = selectEffect;
window.toggleA11yPanel = toggleA11yPanel;
window.applyA11y = applyA11y;
window.switchAuthTab = switchAuthTab;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.authLogout = authLogout;
window.selectRegisterEmoji = selectRegisterEmoji;
window.openMatchingEditor = openMatchingEditor;
window.closeMatchingEditor = closeMatchingEditor;
window.switchEditorTab = switchEditorTab;
window.addEditorPair = addEditorPair;
window.removeEditorPair = removeEditorPair;
window.debounceEditorPhoto = debounceEditorPhoto;
window.saveCustomMatchingGame = saveCustomMatchingGame;
window.deleteCustomMatchingGame = deleteCustomMatchingGame;

// =============================================
// KİMLİK DOĞRULAMA (AUTH)
// =============================================
let _authToken    = null;
let _authUser     = null; // { username, displayName }
let _authMode     = 'login'; // 'login' | 'register'

function authStorageKey()  { return 'auth_token'; }
function authUserStorageKey() { return 'auth_user'; }

async function authApi(action, body = {}) {
    try {
        const r = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, ...body }),
            signal: AbortSignal.timeout(8000),
        });
        return r.json();
    } catch {
        return { fallback: true, error: 'Bağlantı hatası' };
    }
}

function hideSplash() {
    const splash = document.getElementById('splash-screen');
    if (splash) splash.style.display = 'none';
}

async function checkAuthSession() {
    const savedToken = DB.getSync(authStorageKey());
    const savedUser  = DB.getSync(authUserStorageKey());

    if (savedToken && savedUser) {
        const res = await authApi('verify', { token: savedToken });
        if (res.valid) {
            _authToken = savedToken;
            _authUser  = { username: res.username, displayName: res.displayName };
            hideSplash();
            onAuthSuccess();
            return;
        } else if (res.fallback && !savedToken.startsWith('demo_')) {
            _authToken = savedToken;
            _authUser  = savedUser;
            hideSplash();
            onAuthSuccess();
            return;
        }
        DB.del(authStorageKey());
        DB.del(authUserStorageKey());
    }

    hideSplash();
    showOnly('auth-screen');
}

function onAuthSuccess() {
    // Farklı kullanıcı giriş yaptıysa paylaşılan eski 'students' anahtarını temizle
    const prevUser = localStorage.getItem('lms_last_user');
    const curUser  = _authUser?.username || '';
    if (prevUser !== curUser) {
        DB.del('students');
        activeStudentId   = null;
        activeStudentName = '';
    }
    initLoginScreen();
    showOnly('login-screen');
}

function onAuthSuccessWithStudent(student) {
    const nameEl = document.getElementById('active-student-name');
    if (nameEl) nameEl.textContent = student.name;
    const greetEl = document.getElementById('menu-greeting');
    if (greetEl) greetEl.textContent = `Merhaba, ${student.name}! 🌟`;
    showOnly('menu-screen');
    renderCityScene();
}

function renderRegisterEmojiPicker() {
    const wrap = document.getElementById('regEmojiPicker');
    if (!wrap) return;
    wrap.innerHTML = STUDENT_EMOJIS.map(em => `
        <button type="button" class="emoji-pick-btn${em === '🌟' ? ' selected' : ''}"
            onclick="selectRegisterEmoji('${em}')">${em}</button>
    `).join('');
}

function selectRegisterEmoji(em) {
    document.getElementById('regStudentEmoji').value = em;
    document.querySelectorAll('#regEmojiPicker .emoji-pick-btn').forEach(b => {
        b.classList.toggle('selected', b.textContent === em);
    });
}

function switchAuthTab(mode) {
    _authMode = mode;
    document.getElementById('loginForm').style.display    = mode === 'login'    ? '' : 'none';
    document.getElementById('registerForm').style.display = mode === 'register' ? '' : 'none';
    document.getElementById('tabLogin').classList.toggle('active',    mode === 'login');
    document.getElementById('tabRegister').classList.toggle('active', mode === 'register');
    document.getElementById('authError').textContent = '';
    if (mode === 'register') renderRegisterEmojiPicker();
}

function setAuthLoading(loading) {
    const btn = document.getElementById(_authMode === 'login' ? 'loginBtn' : 'registerBtn');
    if (btn) { btn.disabled = loading; btn.textContent = loading ? 'Bekleniyor...' : (_authMode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'); }
}

function showAuthError(msg) {
    const el = document.getElementById('authError');
    if (el) { el.textContent = msg; }
}

async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    if (!username || !password) return showAuthError('Tüm alanları doldurun');
    setAuthLoading(true);

    const res = await authApi('login', { username, password });
    setAuthLoading(false);

    if (res.fallback) {
        return showAuthError('Sunucu bağlantısı kurulamadı. Vercel KV yapılandırmasını kontrol et.');
    }
    if (!res.ok) return showAuthError(res.error || 'Giriş başarısız');
    _authToken = res.token;
    _authUser  = { username: username.toLowerCase(), displayName: res.displayName };
    DB.set(authStorageKey(), _authToken);
    DB.set(authUserStorageKey(), _authUser);
    localStorage.setItem('lms_last_user', _authUser.username);

    // Öğrenci varsa direkt menüye, yoksa öğrenci seçim ekranına
    const students = await loadStudents();
    if (students.length > 0) {
        const student = students[0];
        activeStudentId   = student.id;
        activeStudentName = student.name;
        onAuthSuccessWithStudent(student);
    } else {
        onAuthSuccess();
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username    = document.getElementById('regUsername').value.trim();
    const password    = document.getElementById('regPassword').value;
    const password2   = document.getElementById('regPassword2').value;
    const studentName = document.getElementById('regStudentName').value.trim();
    const emoji       = document.getElementById('regStudentEmoji').value || '🌟';
    if (!username || !password || !studentName) return showAuthError('Tüm alanları doldurun');
    if (password !== password2) return showAuthError('Şifreler uyuşmuyor');
    if (password.length < 6) return showAuthError('Şifre en az 6 karakter olmalı');
    setAuthLoading(true);

    const res = await authApi('register', { username, password });
    setAuthLoading(false);

    if (res.fallback) {
        return showAuthError('Sunucu bağlantısı kurulamadı. Vercel KV yapılandırmasını kontrol et.');
    }
    if (!res.ok) return showAuthError(res.error || 'Kayıt başarısız');
    _authToken = res.token;
    _authUser  = { username: username.toLowerCase(), displayName: res.displayName };
    DB.set(authStorageKey(), _authToken);
    DB.set(authUserStorageKey(), _authUser);

    // BEP profilini kaydet
    const level = document.querySelector('input[name="regLevel"]:checked')?.value || 'egit';
    const conditions = [...document.querySelectorAll('.reg-cond:checked')].map(c => c.value);
    await DB.set('bep_profile_' + username.toLowerCase(), { category: level, conditions });

    // Öğrenciyi hemen oluştur ve menüye git
    const student = { id: 'st_' + Date.now(), name: studentName, emoji, createdAt: new Date().toISOString() };
    await saveStudents([student]);
    activeStudentId   = student.id;
    activeStudentName = student.name;
    localStorage.setItem('lms_last_user', _authUser.username);
    onAuthSuccessWithStudent(student);
}

async function authLogout() {
    if (_authToken && !_authToken.startsWith('demo_')) {
        authApi('logout', { token: _authToken });
    }
    DB.del(authStorageKey());
    DB.del(authUserStorageKey());
    _authToken = null;
    _authUser  = null;
    showOnly('auth-screen');
    document.getElementById('authError').textContent = '';
    switchAuthTab('login');
}

// =============================================
// GİRİŞ EKRANI (LOGIN)
// =============================================
const STUDENT_EMOJIS = [
    '🦁','🐯','🐻','🐼','🦊','🐸','🐧','🦋',
    '🌸','🌻','⭐','🌈','🎈','🚀','🦄','🐬',
];

async function initLoginScreen() {
    const students = await loadStudents();
    renderLoginStudents(students);
    const settings = loadA11ySettings();
    applyA11yClasses(settings);
}

function studentsKey() {
    return _authUser ? 'students_' + _authUser.username : 'students';
}

async function loadStudents() {
    const key = studentsKey();
    let list = DB.getSync(key);
    if (!list) list = await DB.get(key);
    return list || [];
}

async function saveStudents(list) {
    DB.set(studentsKey(), list);
}

function renderLoginStudents(students) {
    const wrap = document.getElementById('loginStudents');
    if (!wrap) return;
    if (!students.length) {
        wrap.innerHTML = `<div class="login-empty">
            <p>Henüz öğrenci eklenmedi.</p>
            <p>Aşağıdan ilk öğrenciyi ekleyin!</p>
        </div>`;
        return;
    }
    wrap.innerHTML = students.map(s => `
        <button type="button" class="login-student-card" onclick="selectStudentLogin('${escapeHtml(s.id)}')">
            <span class="login-student-emoji">${escapeHtml(s.emoji || '🌟')}</span>
            <span class="login-student-name">${escapeHtml(s.name)}</span>
        </button>
    `).join('');
}

function showLoginAddForm() {
    document.getElementById('loginAddForm').style.display = '';
    const picker = document.getElementById('loginEmojiPicker');
    picker.innerHTML = STUDENT_EMOJIS.map((e, i) => `
        <button type="button" class="emoji-pick-btn ${i === 0 ? 'selected' : ''}"
            onclick="selectLoginEmoji('${e}', this)">${e}</button>
    `).join('');
    document.getElementById('loginNameInput').focus();
}

function hideLoginAddForm() {
    document.getElementById('loginAddForm').style.display = 'none';
    document.getElementById('loginNameInput').value = '';
}

function selectLoginEmoji(emoji, btn) {
    document.querySelectorAll('.emoji-pick-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
}

async function createStudentFromLogin() {
    const name = document.getElementById('loginNameInput').value.trim();
    if (!name) { document.getElementById('loginNameInput').focus(); return; }
    const selectedBtn = document.querySelector('.emoji-pick-btn.selected');
    const emoji = selectedBtn ? selectedBtn.textContent : '🌟';
    const students = await loadStudents();
    const student = { id: 'st_' + Date.now(), name, emoji, createdAt: new Date().toISOString() };
    students.push(student);
    await saveStudents(students);
    hideLoginAddForm();
    renderLoginStudents(students);
}

async function selectStudentLogin(id) {
    const students = await loadStudents();
    const student = students.find(s => s.id === id);
    if (!student) return;
    // Mevcut öğrenci sistemini güncelle
    activeStudentId = student.id;
    activeStudentName = student.name;
    const nameEl = document.getElementById('active-student-name');
    if (nameEl) nameEl.textContent = student.name;
    document.getElementById('menu-greeting').textContent = `Merhaba, ${student.name}! 🌟`;
    speakFallback(`Merhaba ${student.name}! Hoş geldin!`);
    showOnly('menu-screen');
    renderCityScene();
}

function goToLogin() {
    window.speechSynthesis.cancel();
    showOnly('login-screen');
    loadStudents().then(renderLoginStudents);
}

// =============================================
// ANALİZ / BEP EKRANI
// =============================================
const BEP_CATEGORY_LABELS = {
    ogreti: 'Hafif Düzey – Öğretilebilir',
    egit:   'Orta Düzey – Eğitilebilir',
    destekli: 'Ağır/İleri – Desteklenen'
};
const BEP_CONDITION_LABELS = {
    osb: 'OSB', dehb: 'DEHB', dil: 'Dil / Konuşma',
    down: 'Down Sendromu', cp: 'Serebral Palsi',
    oog: 'Öz. Öğrenme Güçlüğü', ekolali: 'Ekolali',
    stereotipik: 'Stereotipik Hareket',
    // eski değerler uyumluluk için
    ekolali: 'Ekolali', stereotipik: 'Stereotipik Hareket'
};

async function goToAnalysis() {
    showOnly('analysis-screen');
    const userId = await getCurrentUserId();
    const profile = userId ? (await DB.get('bep_profile_' + userId) || {}) : {};
    const history = await loadReportHistory();
    _renderAzIdentityCard(profile);
    _renderAzMetrics(history);
}

function _renderAzIdentityCard(profile) {
    const nameEl = document.getElementById('azStudentName');
    const tagsEl = document.getElementById('azStudentTags');
    const metaEl = document.getElementById('azSessionMeta');

    if (nameEl) nameEl.textContent = activeStudentName || 'Öğrenci';

    if (tagsEl) {
        const levelTag = profile.category
            ? `<span class="az-tag az-tag-level">${BEP_CATEGORY_LABELS[profile.category] || profile.category}</span>`
            : '';
        const condTags = (profile.conditions || [])
            .map(c => `<span class="az-tag az-tag-cond">${BEP_CONDITION_LABELS[c] || c}</span>`)
            .join('');
        tagsEl.innerHTML = levelTag + condTags || '<span class="az-tag-empty">Profil girilmemiş</span>';
    }

    if (metaEl) {
        const now = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
        metaEl.textContent = `Analiz tarihi: ${now}`;
    }
}

function _renderAzMetrics(history) {
    // Aggregate across all sessions
    let totalMicSum = 0, totalRepeat = 0, totalSimplify = 0;
    history.forEach(h => {
        totalMicSum += (h.micUsedInTherapy || 0);
        totalRepeat += (h.repeatUsed || 0);
        totalSimplify += (h.simplifyUsed || 0);
    });
    const total = totalMicSum + totalRepeat + totalSimplify;

    const indPct = total > 0 ? Math.round((totalMicSum / total) * 100) : null;
    const repPct = total > 0 ? Math.round((totalRepeat / total) * 100) : null;
    const simPct = total > 0 ? Math.round((totalSimplify / total) * 100) : null;

    function setMetric(pctId, barId, pct) {
        const pctEl = document.getElementById(pctId);
        const barEl = document.getElementById(barId);
        if (!pctEl || !barEl) return;
        if (pct === null) { pctEl.textContent = '—'; barEl.style.width = '0%'; return; }
        pctEl.textContent = '%' + pct;
        barEl.style.width = Math.min(pct, 100) + '%';
    }

    setMetric('azIndependentPct', 'azIndependentBar', indPct);
    setMetric('azRepeatPct', 'azRepeatBar', repPct);
    setMetric('azSimplifyPct', 'azSimplifyBar', simPct);

    const insightEl = document.getElementById('azInsightText');
    if (insightEl) {
        if (!history.length) {
            insightEl.textContent = 'Henüz seans kaydı yok. İlk konuşma terapisi seansını tamamladıktan sonra veriler burada görünür.';
        } else if (indPct === null) {
            insightEl.textContent = `${history.length} seans kaydı var. Bağımsız konuşma verisi toplanıyor.`;
        } else {
            const name = activeStudentName || 'Öğrenci';
            insightEl.textContent = `${name}, son ${history.length} seansta %${indPct} oranında tamamen bağımsız konuştu` +
                (repPct ? `, %${repPct} oranında tekrar dinlemeye` : '') +
                (simPct ? ` ve %${simPct} oranında dili basitleştirmeye` : '') +
                ' ihtiyaç duydu.';
        }
    }

    // Store for BEP report use
    window._azMetrics = { totalMicSum, totalRepeat, totalSimplify, total, indPct, repPct, simPct, sessionCount: history.length };
}

// Keep old function names as no-ops for safety
async function renderBepProfileSummary() {}
async function loadAnalysisSessions() {}

async function generateBepReport() {
    const btn = document.getElementById('bepReportBtn');
    const output = document.getElementById('bepReportOutput');
    const textEl = document.getElementById('bepReportText');

    btn.disabled = true;
    btn.textContent = '⏳ Rapor hazırlanıyor...';

    const userId = await getCurrentUserId();
    const profile = await DB.get('bep_profile_' + userId) || {};
    const history = await loadReportHistory();

    const categoryLabels = {
        ogreti: 'Hafif Düzey (Öğretilebilir)',
        egit: 'Orta Düzey (Eğitilebilir)',
        destekli: 'Ağır/İleri Düzey (Desteklenen)'
    };
    const conditionLabels = { ekolali: 'Ekolali', stereotipik: 'Stereotipik Hareketler', dehb: 'DEHB / Anksiyete' };

    const profileText = `Öğrenci Adı: ${activeStudentName || 'Belirtilmemiş'}
Eğitim Kademesi: ${categoryLabels[profile.category] || 'Belirtilmemiş'}
Eşlik Eden Durumlar: ${(profile.conditions || []).map(c => conditionLabels[c] || c).join(', ') || 'Yok'}`;

    const sessionText = history.slice(0, 10).map(h =>
        `• ${formatHistoryDate(h.dateKey)}: ${h.durationMin} dk, ${h.totalTurns} yanıt, ${h.micUsedInTherapy || 0} bağımsız mikrofon, ${h.repeatUsed || 0} tekrar, ${h.simplifyUsed || 0} basitleştirme`
    ).join('\n') || 'Kayıtlı seans verisi yok.';

    const m = window._azMetrics || {};
    const metricsText = m.total > 0
        ? `İletişim Bağımsızlığı: %${m.indPct} (bağımsız mikrofon kullanımı)\nTekrar Dinleme İhtiyacı: %${m.repPct}\nDil Adaptasyon İhtiyacı: %${m.simPct}`
        : 'Metrik verisi henüz toplanmamış.';

    const systemPrompt = `Sen özel eğitim kurumları ve RAM için çalışan uzman bir BEP (Bireyselleştirilmiş Eğitim Programı) hazırlama asistanısın. Görevin, sana ham olarak verilen öğrenci etkileşim verilerini resmi bir "Gelişim Özet Raporu"na dönüştürmektir.

YAZIM KURALLARI:
1. Kesinlikle "Tıbbi Model" dili kullanma. "Sosyal Model" dilini esas al: toplumsal katılım, akran etkileşimi ve sosyal uyum odaklı yaz.
2. Eğer öğrencide "Ekolali" veya "Stereotipik hareket" varsa, yapay zekanın sönümlendirme ve bağımsızlaştırma etkisini vurgula.
3. Çıktıyı doğrudan MEB BEP dosyalarına kopyalanabilecek resmi, gözlemlenebilir ve performans odaklı cümlelerle kur.
4. Raporu Türkçe yaz. 300-400 kelime arası tut.`;

    const userPrompt = `Aşağıdaki öğrenci profili, bağımsızlık metrikleri ve seans verilerini kullanarak resmi bir BEP Dönemsel Gelişim Raporu oluştur:

ÖĞRENCİ PROFİLİ:
${profileText}

İLETİŞİM BAĞIMSIZLIK METRİKLERİ (${m.sessionCount || history.length} seans toplamı):
${metricsText}

SON SEANSLAR (${Math.min(history.length, 10)} seans):
${sessionText}

Raporu "📝 Bireyselleştirilmiş Eğitim Programı (BEP) Dönemsel Gelişim Raporu" başlığıyla başlat. Şu bölümleri içersin: 1) Öğrenci Kademesi ve Tanı Özeti, 2) İletişim Bağımsızlığı Gelişimi (metrikleri yorumla), 3) Gözlemlenen Güçlü Yönler, 4) Sonraki Dönem Hedefleri. Metrikleri açıklarken somut rakamlar kullan.`;

    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: systemPrompt }] },
                contents: [{ role: 'user', parts: [{ text: userPrompt }] }]
            }),
            signal: AbortSignal.timeout(30000)
        });

        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Rapor oluşturulamadı. Gemini API yanıt vermedi.';
        textEl.value = text;
        output.style.display = 'flex';
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
        textEl.value = 'Hata: ' + err.message;
        output.style.display = 'flex';
    }

    btn.disabled = false;
    btn.textContent = '📝 BEP Gelişim Raporu Oluştur';
}

function copyBepReport() {
    const text = document.getElementById('bepReportText').value;
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.querySelector('.bep-copy-btn');
        btn.textContent = '✓ Kopyalandı!';
        setTimeout(() => { btn.textContent = '📋 Metni Kopyala'; }, 2000);
    });
}

// =============================================
// IEP HEDEFLERİ
// =============================================
const IEP_DOMAINS = [
    { id: 'communication', label: 'İletişim',   emoji: '🗣️', color: '#48dbfb' },
    { id: 'academic',      label: 'Akademik',   emoji: '📚', color: '#ff9f43' },
    { id: 'selfcare',      label: 'Öz Bakım',   emoji: '🧼', color: '#1dd1a1' },
    { id: 'social',        label: 'Sosyal',      emoji: '🤝', color: '#a29bfe' },
    { id: 'motor',         label: 'Motor',       emoji: '🏃', color: '#fd79a8' },
];

let _iepCurrentGoalId = null;
let _iepCurrentTrials = [];
let _iepSelectedDomain = 'communication';

function iepBack() {
    showOnly('analysis-screen');
}

function goToIep() {

    showOnly('iep-screen');
    document.getElementById('iepStudentBadge').textContent = activeStudentName || '';
    hideIepGoalForm();
    closeSessionPanel();
    renderIepGoals();
}

function iepGoalsKey() { return `iep_${activeStudentId || 'default'}`; }
function iepTrialsKey(goalId) { return `trials_${goalId}`; }

async function loadIepGoals() {
    let goals = DB.getSync(iepGoalsKey());
    if (!goals) goals = await DB.get(iepGoalsKey());
    return goals || [];
}

async function renderIepGoals() {
    const goals = await loadIepGoals();
    const el = document.getElementById('iepGoalList');
    if (!goals.length) {
        el.innerHTML = `<div class="iep-empty">
            <p>📋 Henüz hedef eklenmedi.</p>
            <p>Aşağıdaki <strong>"+ Hedef Ekle"</strong> butonuyla başlayın.</p>
        </div>`;
        return;
    }
    const items = await Promise.all(goals.map(async g => {
        const trials = await loadTrials(g.id);
        const pct = calcGoalPct(trials);
        const domain = IEP_DOMAINS.find(d => d.id === g.domain) || IEP_DOMAINS[0];
        const statusClass = g.status === 'mastered' ? 'status-mastered'
                          : g.status === 'not_started' ? 'status-not-started'
                          : 'status-learning';
        const statusLabel = g.status === 'mastered' ? '✅ Kazanıldı'
                          : g.status === 'not_started' ? '⬜ Başlanmadı'
                          : '🔄 Öğreniliyor';
        return `
        <div class="iep-goal-card">
            <div class="iep-goal-top">
                <span class="iep-domain-badge" style="background:${domain.color}20;color:${domain.color}">
                    ${domain.emoji} ${domain.label}
                </span>
                <span class="iep-status-badge ${statusClass}">${statusLabel}</span>
                <button class="iep-delete-btn" onclick="deleteIepGoal('${escapeHtml(g.id)}')" aria-label="Sil">✕</button>
            </div>
            <p class="iep-goal-text">${escapeHtml(g.goalText)}</p>
            <div class="iep-progress-row">
                <div class="iep-progress-track">
                    <div class="iep-progress-fill" style="width:${pct}%;background:${domain.color}"></div>
                    <div class="iep-target-line" style="left:${g.targetPct}%"></div>
                </div>
                <span class="iep-pct-label">%${pct} / %${g.targetPct} hedef</span>
            </div>
            <div class="iep-goal-meta">
                <span>${trials.length} seans · ${countTotalTrials(trials)} deneme</span>
                ${g.targetDate ? `<span>Hedef: ${g.targetDate}</span>` : ''}
            </div>
            <button type="button" class="iep-session-btn" onclick="openSessionPanel('${escapeHtml(g.id)}')">
                ▶ Seans Başlat
            </button>
        </div>`;
    }));
    el.innerHTML = items.join('');
}

function calcGoalPct(trials) {
    if (!trials.length) return 0;
    // Son 3 seansın ortalaması
    const recent = trials.slice(-3);
    let correct = 0, total = 0;
    recent.forEach(s => {
        s.trials.forEach(t => {
            total++;
            if (t.result === 'correct') correct++;
        });
    });
    return total ? Math.round((correct / total) * 100) : 0;
}

function countTotalTrials(trials) {
    return trials.reduce((acc, s) => acc + s.trials.length, 0);
}

async function loadTrials(goalId) {
    let t = DB.getSync(iepTrialsKey(goalId));
    if (!t) t = await DB.get(iepTrialsKey(goalId));
    return t || [];
}

function showIepGoalForm() {
    document.getElementById('iepGoalForm').style.display = '';
    document.getElementById('iepSessionPanel').style.display = 'none';
    // Domain chip'leri render et
    const chips = document.getElementById('iepDomainChips');
    chips.innerHTML = IEP_DOMAINS.map(d => `
        <button type="button" class="iep-domain-chip ${d.id === _iepSelectedDomain ? 'selected' : ''}"
            style="--dc:${d.color}" onclick="selectIepDomain('${d.id}', this)">
            ${d.emoji} ${d.label}
        </button>
    `).join('');
    // Varsayılan tarihler
    const today = new Date().toISOString().slice(0, 10);
    const sixMonths = new Date(Date.now() + 180 * 86400000).toISOString().slice(0, 10);
    document.getElementById('iepStartDate').value = today;
    document.getElementById('iepTargetDate').value = sixMonths;
}

function hideIepGoalForm() {
    document.getElementById('iepGoalForm').style.display = 'none';
}

function selectIepDomain(id, btn) {
    _iepSelectedDomain = id;
    document.querySelectorAll('.iep-domain-chip').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
}

async function saveIepGoal() {
    const goalText = document.getElementById('iepGoalText').value.trim();
    if (!goalText) { document.getElementById('iepGoalText').focus(); return; }
    const goals = await loadIepGoals();
    const goal = {
        id: 'goal_' + Date.now(),
        domain: _iepSelectedDomain,
        goalText,
        targetPct: parseInt(document.getElementById('iepTargetPct').value) || 80,
        targetTrials: parseInt(document.getElementById('iepTargetTrials').value) || 10,
        status: 'not_started',
        startDate: document.getElementById('iepStartDate').value,
        targetDate: document.getElementById('iepTargetDate').value,
    };
    goals.push(goal);
    DB.set(iepGoalsKey(), goals);
    document.getElementById('iepGoalText').value = '';
    hideIepGoalForm();
    renderIepGoals();
}

async function deleteIepGoal(id) {
    const goals = (await loadIepGoals()).filter(g => g.id !== id);
    DB.set(iepGoalsKey(), goals);
    DB.del(iepTrialsKey(id));
    renderIepGoals();
}

function openSessionPanel(goalId) {
    _iepCurrentGoalId = goalId;
    _iepCurrentTrials = [];
    document.getElementById('iepSessionPanel').style.display = '';
    document.getElementById('iepGoalForm').style.display = 'none';
    document.getElementById('iepSessionNotes').value = '';
    loadIepGoals().then(goals => {
        const g = goals.find(x => x.id === goalId);
        if (g) {
            const d = IEP_DOMAINS.find(x => x.id === g.domain) || IEP_DOMAINS[0];
            document.getElementById('iepSessionGoalInfo').innerHTML = `
                <span class="iep-domain-badge" style="background:${d.color}20;color:${d.color}">${d.emoji} ${d.label}</span>
                <p>${escapeHtml(g.goalText)}</p>
                <small>Hedef: %${g.targetPct} · ${g.targetTrials} deneme</small>
            `;
        }
    });
    updateTrialTally();
}

function closeSessionPanel() {
    document.getElementById('iepSessionPanel').style.display = 'none';
    _iepCurrentGoalId = null;
    _iepCurrentTrials = [];
}

function recordTrial(result) {
    _iepCurrentTrials.push({ result });
    updateTrialTally();
    // Görsel geri bildirim
    const btn = document.querySelector(`.trial-${result}`);
    if (btn) { btn.classList.add('trial-flash'); setTimeout(() => btn.classList.remove('trial-flash'), 300); }
}

function updateTrialTally() {
    const c = _iepCurrentTrials.filter(t => t.result === 'correct').length;
    const p = _iepCurrentTrials.filter(t => t.result === 'prompted').length;
    const w = _iepCurrentTrials.filter(t => t.result === 'incorrect').length;
    const total = _iepCurrentTrials.length;
    const pct = total ? Math.round((c / total) * 100) : 0;
    document.getElementById('iepTrialTally').innerHTML = `
        <span class="tally-correct">✓ ${c}</span>
        <span class="tally-prompted">P ${p}</span>
        <span class="tally-incorrect">✗ ${w}</span>
        <span class="tally-pct">${total} deneme · %${pct}</span>
    `;
}

async function submitTrialSession() {
    if (!_iepCurrentGoalId || !_iepCurrentTrials.length) {
        closeSessionPanel();
        return;
    }
    const session = {
        goalId: _iepCurrentGoalId,
        date: new Date().toISOString().slice(0, 10),
        trials: [..._iepCurrentTrials],
        notes: document.getElementById('iepSessionNotes').value.trim(),
    };
    const trials = await loadTrials(_iepCurrentGoalId);
    trials.push(session);
    DB.set(iepTrialsKey(_iepCurrentGoalId), trials);

    // Durumu güncelle (mastery check)
    const goals = await loadIepGoals();
    const goalIdx = goals.findIndex(g => g.id === _iepCurrentGoalId);
    if (goalIdx >= 0) {
        const pct = calcGoalPct(trials);
        const target = goals[goalIdx].targetPct;
        if (goals[goalIdx].status === 'not_started') goals[goalIdx].status = 'learning';
        if (pct >= target && trials.length >= 3) goals[goalIdx].status = 'mastered';
        DB.set(iepGoalsKey(), goals);
        if (goals[goalIdx].status === 'mastered' && typeof confetti === 'function') {
            confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
            speakFallback('Tebrikler! Hedef kazanıldı!');
        } else {
            speakFallback('Seans kaydedildi!');
        }
    }
    closeSessionPanel();
    renderIepGoals();
}

// =============================================
// BECERİ HARİTASI
// =============================================
const SKILL_MAP = {
    communication: {
        label: 'İletişim', emoji: '🗣️', color: '#48dbfb',
        skills: ['Adını söyleme','İstek ifade etme','Hayır diyebilme',
                 'İki kelime cümle','Soru sorma','Selamlama',
                 'Sıra bekleme','Görsel destek kullanma'],
    },
    academic: {
        label: 'Akademik', emoji: '📚', color: '#ff9f43',
        skills: ['Rakam tanıma (1-10)','Harf tanıma','Renk tanıma',
                 'Şekil tanıma','Boyut kavramı','Nesne eşleştirme',
                 'Kategorilere ayırma','Basit toplama'],
    },
    selfcare: {
        label: 'Öz Bakım', emoji: '🧼', color: '#1dd1a1',
        skills: ['El yıkama','Diş fırçalama','Tuvalet terbiyesi',
                 'Giyinme/soyunma','Yemek yeme','Çanta hazırlama',
                 'Uyku rutini','Saç tarama'],
    },
    social: {
        label: 'Sosyal', emoji: '🤝', color: '#a29bfe',
        skills: ['Göz teması','Sıra bekleme','Paylaşma',
                 'Empati','Grup etkinliğine katılma','Uygun davranış',
                 'Kurallara uyma','Duygularını ifade etme'],
    },
    motor: {
        label: 'Motor', emoji: '🏃', color: '#fd79a8',
        skills: ['Kalem tutma','Makas kullanma','Top yakalama/atma',
                 'Bağcık bağlama','Düğme ilikleme','Boyama',
                 'Çizgi takibi','Denge'],
    },
};

let _skillsDomain = 'communication';

function skillsBack() {
    showOnly('analysis-screen');
}

function goToSkills() {
    showOnly('skills-screen');
    document.getElementById('skillsStudentBadge').textContent = activeStudentName || '';
    renderSkillsDomainTabs();
    renderSkillsGrid();
}

function skillsKey() { return `skills_${activeStudentId || 'default'}`; }

function loadSkillsSync() {
    return DB.getSync(skillsKey()) || {};
}

function renderSkillsDomainTabs() {
    const tabs = document.getElementById('skillsDomainTabs');
    tabs.innerHTML = Object.entries(SKILL_MAP).map(([id, d]) => `
        <button type="button" class="skills-tab ${id === _skillsDomain ? 'active' : ''}"
            style="--sc:${d.color}" onclick="switchSkillsDomain('${id}')">
            ${d.emoji} ${d.label}
        </button>
    `).join('');
}

function switchSkillsDomain(id) {
    _skillsDomain = id;
    renderSkillsDomainTabs();
    renderSkillsGrid();
}

function renderSkillsGrid() {
    const domain = SKILL_MAP[_skillsDomain];
    const map = loadSkillsSync();
    const grid = document.getElementById('skillsGrid');
    grid.innerHTML = domain.skills.map((skill, i) => {
        const key = `${_skillsDomain}:${i}`;
        const status = map[key] || 'not_started';
        const icon = status === 'mastered' ? '✅' : status === 'learning' ? '🔄' : '⬜';
        return `
        <button type="button" class="skill-card skill-${status}"
            style="--sc:${domain.color}" onclick="cycleSkill('${key}')">
            <span class="skill-icon">${icon}</span>
            <span class="skill-label">${escapeHtml(skill)}</span>
        </button>`;
    }).join('');
}

function cycleSkill(key) {
    const map = loadSkillsSync();
    const current = map[key] || 'not_started';
    const next = current === 'not_started' ? 'learning'
               : current === 'learning'    ? 'mastered'
               :                             'not_started';
    map[key] = next;
    DB.set(skillsKey(), map);
    renderSkillsGrid();
    const label = next === 'mastered' ? 'Kazanıldı!' : next === 'learning' ? 'Öğreniliyor' : 'Sıfırlandı';
    speakFallback(label);
}

// =============================================
// DAVRANIŞ KAYDI
// =============================================
let _behaviorCount = 1;

function behaviorBack() {
    showOnly('analysis-screen');
}

function goToBehavior() {

    showOnly('behavior-screen');
    document.getElementById('behaviorStudentBadge').textContent = activeStudentName || '';
    _behaviorCount = 1;
    document.getElementById('behaviorCount').textContent = '1';
    renderBehaviorLog();
}

function behaviorKey() { return `behavior_${activeStudentId || 'default'}`; }

function loadBehaviorSync() {
    return DB.getSync(behaviorKey()) || [];
}

function behaviorCountChange(delta) {
    _behaviorCount = Math.max(1, _behaviorCount + delta);
    document.getElementById('behaviorCount').textContent = _behaviorCount;
}

function saveBehaviorEntry() {
    const text = document.getElementById('behaviorText').value.trim();
    if (!text) { document.getElementById('behaviorText').focus(); return; }
    const log = loadBehaviorSync();
    log.unshift({
        id: 'b_' + Date.now(),
        date: new Date().toISOString(),
        behavior: text,
        antecedent: document.getElementById('behaviorAntecedent').value.trim(),
        consequence: document.getElementById('behaviorConsequence').value.trim(),
        frequency: _behaviorCount,
        duration: parseInt(document.getElementById('behaviorDuration').value) || 0,
    });
    DB.set(behaviorKey(), log.slice(0, 100)); // son 100 kayıt
    // formu temizle
    ['behaviorText','behaviorAntecedent','behaviorConsequence','behaviorDuration'].forEach(id => {
        document.getElementById(id).value = '';
    });
    _behaviorCount = 1;
    document.getElementById('behaviorCount').textContent = '1';
    renderBehaviorLog();
    speakFallback('Kayıt eklendi!');
}

function renderBehaviorLog() {
    const log = loadBehaviorSync();
    const el = document.getElementById('behaviorLogList');
    if (!log.length) {
        el.innerHTML = '<p class="behavior-empty">Henüz kayıt yok.</p>';
        return;
    }
    el.innerHTML = log.slice(0, 20).map(e => {
        const d = new Date(e.date);
        const dateStr = `${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()} ${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`;
        return `
        <div class="behavior-log-item">
            <div class="behavior-log-top">
                <strong>${escapeHtml(e.behavior)}</strong>
                <span class="behavior-log-date">${dateStr}</span>
            </div>
            ${e.antecedent ? `<div class="behavior-log-abc"><span>A:</span> ${escapeHtml(e.antecedent)}</div>` : ''}
            ${e.consequence ? `<div class="behavior-log-abc"><span>C:</span> ${escapeHtml(e.consequence)}</div>` : ''}
            <div class="behavior-log-stats">
                <span>×${e.frequency}</span>
                ${e.duration ? `<span>${e.duration} dk</span>` : ''}
            </div>
            <button class="behavior-delete-btn" onclick="deleteBehaviorEntry('${escapeHtml(e.id)}')">Sil</button>
        </div>`;
    }).join('');
}

function deleteBehaviorEntry(id) {
    const log = loadBehaviorSync().filter(e => e.id !== id);
    DB.set(behaviorKey(), log);
    renderBehaviorLog();
}

// =============================================
// WINDOW EXPORTS (YENİ)
// =============================================
window.goToLogin = goToLogin;
window.showLoginAddForm = showLoginAddForm;
window.hideLoginAddForm = hideLoginAddForm;
window.selectLoginEmoji = selectLoginEmoji;
window.createStudentFromLogin = createStudentFromLogin;
window.selectStudentLogin = selectStudentLogin;
window.goToAnalysis = goToAnalysis;
window.generateBepReport = generateBepReport;
window.copyBepReport = copyBepReport;
window.goToIep = goToIep;
window.iepBack = iepBack;
window.showIepGoalForm = showIepGoalForm;
window.hideIepGoalForm = hideIepGoalForm;
window.selectIepDomain = selectIepDomain;
window.saveIepGoal = saveIepGoal;
window.deleteIepGoal = deleteIepGoal;
window.openSessionPanel = openSessionPanel;
window.closeSessionPanel = closeSessionPanel;
window.recordTrial = recordTrial;
window.submitTrialSession = submitTrialSession;
window.goToSkills = goToSkills;
window.skillsBack = skillsBack;
window.switchSkillsDomain = switchSkillsDomain;
window.cycleSkill = cycleSkill;
window.goToBehavior = goToBehavior;
window.behaviorBack = behaviorBack;
window.behaviorCountChange = behaviorCountChange;
window.saveBehaviorEntry = saveBehaviorEntry;
window.deleteBehaviorEntry = deleteBehaviorEntry;






