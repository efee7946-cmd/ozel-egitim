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
    const screens = ['start-screen','student-setup-screen','menu-screen','game-container','story-select-screen','story-screen','report-screen'];
    screens.forEach(s => {
        const el = document.getElementById(s);
        if (el) el.style.display = 'none';
    });
    const target = document.getElementById(id);
    if (target) target.style.display = 'flex';
    currentScreenId = id;
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

    document.getElementById('menu-greeting').textContent = `Merhaba, ${activeStudentName || childName}! ğŸŒŸ`;
    document.getElementById('menu-greeting').textContent = `Merhaba, ${activeStudentName || childName}!`;
    appStarted = true;
    updateMenuIdentity();
    showOnly('menu-screen');
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
});

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
        updateBtn.textContent = 'Bilgileri Guncelle';
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
                <p id="role-mode-copy">Secili ogrenci icin dogru akisi secip oturumlari tek panelden takip edebilirsin.</p>
            </div>
            <div class="menu-insight-card">
                <span class="menu-insight-label">Ogrenci Ozeti</span>
                <strong id="student-summary-name">Henuz secilmedi</strong>
                <p id="student-summary-copy">Ogrenci secince notlari ve temel bilgileri burada goreceksin.</p>
            </div>
            <div class="menu-insight-card">
                <span class="menu-insight-label">Toplam Ogrenci</span>
                <strong id="student-count-value">0</strong>
                <p id="student-count-copy">Bu hesap icin takip edilen aktif ogrenci sayisi.</p>
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
                    <span class="student-detail-kicker">Secili Ogrenci</span>
                    <h3 id="student-detail-title">Ogrenci secilmedi</h3>
                    <p id="student-detail-subtitle">Bir ogrenci sectiginde guclu yonler, destek notlari ve oturum ozeti burada gorunur.</p>
                </div>
                <button type="button" class="menu-ghost-btn" onclick="openStudentSetup()">Ogrenci Yonet</button>
            </div>
            <div class="student-detail-grid">
                <div class="student-detail-card">
                    <span class="student-detail-label">Destek Notu</span>
                    <p id="student-detail-notes">Henuz destek notu eklenmedi.</p>
                </div>
                <div class="student-detail-card">
                    <span class="student-detail-label">Ogrenme Odagi</span>
                    <p id="student-detail-goal">Destek notlarina gore odak alani burada ozetlenir.</p>
                </div>
                <div class="student-detail-card">
                    <span class="student-detail-label">Son Oturum</span>
                    <p id="student-detail-session">Henuz kayitli oturum yok.</p>
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
                    <span>Son Hikaye Ilerlemesi</span>
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
                <img src="avatar.png" class="sidebar-brand-avatar" alt="Yildiz Can">
                <div>
                    <strong>Yildiz Sinifi</strong>
                    <span>Cocuk destek paneli</span>
                </div>
            </div>
            <div class="sidebar-section">
                <span class="sidebar-label">Calisma Alanlari</span>
                <button type="button" class="sidebar-nav-btn active" data-section="overview">Genel Bakis</button>
                <button type="button" class="sidebar-nav-btn" data-section="students">Ogrenciler</button>
                <button type="button" class="sidebar-nav-btn" data-section="guide">Rehber</button>
                <button type="button" class="sidebar-nav-btn" data-section="activities">Oturumlar</button>
            </div>
            <div class="sidebar-section">
                <span class="sidebar-label">Hizli Erisim</span>
                <button type="button" class="sidebar-link-btn" onclick="goToTherapy()">Konusma Terapisti</button>
                <button type="button" class="sidebar-link-btn" onclick="goToStories()">Hikaye Dunyasi</button>
                <button type="button" class="sidebar-link-btn" onclick="goToReport()">Veli Raporu</button>
                <button type="button" class="sidebar-link-btn" onclick="openStudentSetup()">Ogrenci Yonetimi</button>
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
            <button type="button" class="workspace-tab active" data-section="overview">Genel Bakis</button>
            <button type="button" class="workspace-tab" data-section="students">Ogrenciler</button>
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
                <span class="workspace-section-kicker">Genel Bakis</span>
                <h3>Bugunku genel durum</h3>
                <p>Rolune ve secili ogrenciye gore hizli bir ozet, yonlendirme ve bir sonraki adimi gor.</p>
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
                <span class="workspace-section-kicker">Ogrenciler</span>
                <h3>Ogrenci yonetimi</h3>
                <p>Secili ogrenciyi incele, destek notlarini guncelle ve hangi calismaya ihtiyaci oldugunu gor.</p>
            </div>
            <div class="students-section-actions">
                <button type="button" class="menu-ghost-btn" onclick="openStudentSetup()">Ogrenci sec veya ekle</button>
                <button type="button" class="menu-ghost-btn" onclick="openOnboarding()">Kullanim rehberini ac</button>
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
                <h3>Ogretici kullanim akisi</h3>
                <p>Karmasayi azaltmak icin her oturum once neye bakacagini, sonra hangi alana gececegini net gosteriyoruz.</p>
            </div>
            <div class="guide-grid">
                <article class="guide-card">
                    <span class="guide-card-step">1. Hazirlik</span>
                    <h4>Ogrenci notlarini oku</h4>
                    <p>Destek notlari cocugun ilgisini, zorlandigi alanlari ve dili nasil sade tutman gerektigini hatirlatir.</p>
                </article>
                <article class="guide-card">
                    <span class="guide-card-step">2. Uygulama</span>
                    <h4>Kisa terapiyle basla</h4>
                    <p>Ilk olarak konusma terapisti acilip mikrofon, dikkat ve kisa cevap akisi denenebilir.</p>
                </article>
                <article class="guide-card">
                    <span class="guide-card-step">3. Pekistirme</span>
                    <h4>Hikaye ile genislet</h4>
                    <p>Terapi sonrasi hikaye dunyasinda secim yaptirarak sosyal ipuclari ve ifade becerisi pekistirilir.</p>
                </article>
                <article class="guide-card guide-card-accent">
                    <span class="guide-card-step">4. Gozlem</span>
                    <h4>Raporla kapat</h4>
                    <p>Son adimda veli raporundan sure, katilim ve ilerleme ozetini inceleyip bir sonraki oturuma not cikar.</p>
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
                <h3>Calisma alanini sec</h3>
                <p>Terapi, hikaye ve rapor akislari arasindan ihtiyacina uygun olani ac.</p>
            </div>
            <div class="activity-playbook">
                <div class="activity-playbook-card">
                    <strong>Hizli baslangic</strong>
                    <p>Dikkat daginiksa once terapiyi acip 3-4 kisa yanitla isin.</p>
                </div>
                <div class="activity-playbook-card">
                    <strong>Dil ve ifade</strong>
                    <p>Secenekli kararlar icin hikaye dunyasi sosyal dil ve anlatim calismasi icin daha uygundur.</p>
                </div>
                <div class="activity-playbook-card">
                    <strong>Takip</strong>
                    <p>Oturum bitince veli raporuna gecip hangi alanda daha iyi katilim oldugunu kontrol et.</p>
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

    switchMenuSection(currentMenuSection);
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
            ? 'Birden fazla ogrenciyi takip edip secili ogrenci icin seanslari yonetebilirsin.'
            : 'Secili ogrenci icin uygun calismayi secip gelisimini tek panelden izleyebilirsin.';
    }

    if (studentSummaryNameEl) studentSummaryNameEl.textContent = activeStudentName || 'Henuz secilmedi';
    if (studentSummaryCopyEl) {
        if (student) {
            const note = student.support_notes ? student.support_notes : 'Destek notu henuz eklenmedi.';
            const yearText = student.birth_year ? `Dogum yili: ${student.birth_year}. ` : '';
            studentSummaryCopyEl.textContent = `${yearText}${note}`;
        } else {
            studentSummaryCopyEl.textContent = 'Ogrenci secince notlari ve temel bilgileri burada goreceksin.';
        }
    }

    if (studentCountEl) studentCountEl.textContent = String(studentsCache.length);
    if (studentCountCopyEl) {
        studentCountCopyEl.textContent = currentUserRole === 'specialist'
            ? 'Bu uzman hesabina bagli aktif ogrenci sayisi.'
            : 'Bu veli hesabinda takip edilen aktif ogrenci sayisi.';
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
        console.error('Ogrenci oturum ozetleri okunamadi:', error);
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
        titleEl.textContent = 'Ogrenci secilmedi';
        subtitleEl.textContent = 'Bir ogrenci sectiginde guclu yonler, destek notlari ve oturum ozeti burada gorunur.';
        notesEl.textContent = 'Henuz destek notu eklenmedi.';
        goalEl.textContent = 'Destek notlarina gore odak alani burada ozetlenir.';
        sessionEl.textContent = 'Henuz kayitli oturum yok.';
        totalSessionsEl.textContent = '0';
        totalMinutesEl.textContent = '0 dk';
        storyProgressEl.textContent = '-';
        return;
    }

    titleEl.textContent = student.full_name || 'Isimsiz ogrenci';
    subtitleEl.textContent = student.birth_year
        ? `Dogum yili ${student.birth_year}. Secili ogrenci icin destek notlari ve oturum ozeti burada.`
        : 'Secili ogrenci icin destek notlari ve oturum ozeti burada.';
    notesEl.textContent = student.support_notes || 'Henuz destek notu eklenmedi.';

    const userId = await getCurrentUserId();
    const metrics = await loadStudentDetailMetrics(userId, student.id);
    goalEl.textContent = student.support_notes
        ? `Odak: ${student.support_notes}`
        : (currentUserRole === 'specialist'
            ? 'Oturumdan once destek notu ekleyerek yonlendirmeyi guclendirebilirsin.'
            : 'Destek notu ekleyerek hangi beceriye odaklanacagini netlestirebilirsin.');

    if (metrics.latestSession) {
        const sessionDate = new Date(metrics.latestSession.created_at).toLocaleDateString('tr-TR');
        sessionEl.textContent = `${sessionDate} tarihinde ${metrics.latestSession.duration_min || 0} dk, ${metrics.latestSession.total_turns || 0} yanit`;
        storyProgressEl.textContent = metrics.latestSession.story_completed ? 'Tamamlandi' : (metrics.latestSession.story_pct || '-');
    } else {
        sessionEl.textContent = 'Henuz kayitli oturum yok.';
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
        statusEl.textContent = 'Guncelleme icin ogrenci adi zorunlu.';
        return;
    }

    updateBtn.disabled = true;
    statusEl.textContent = 'Ogrenci bilgileri guncelleniyor...';
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
        console.error('Ogrenci guncellenemedi:', error);
        statusEl.textContent = 'Ogrenci bilgileri guncellenemedi. Lutfen tekrar dene.';
        return;
    }

    statusEl.textContent = 'Ogrenci bilgileri guncellendi.';
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
    var instructions = "Sen 5-8 yas arasi ve ozel egitim destegi alan cocuklarla konusan sabirli Yildiz Can'sin. Karsindaki cocugun adi " + childName + ". KRITIK KURALLAR: 1. SORUYA BAGLILIK: Yanit mevcut soru ve cocugun son cumlesinden kopmasin. 2. BASIT VE GUVENLI DIL: Kisa, somut ve anlasilir kelimeler kullan. 3. EMOJI KULLANMA. 4. MAKS 2 KISA CUMLE (yaklasik 8-12 kelime). 5. SONDA SADECE KONUYLA ILGILI TEK KISA SORU SOR. 6. YANLISI YARGILAMA, NAZIKCE DOGRU ORNEKLE DESTEKLE.";
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
        title: "Yardim Istiyorum",
        emoji: "??",
        description: "Gercek hayatta yardim isteme, dogru kisiyi bulma ve net cumle kurma gorevi.",
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
                    { text: "Ben yapamam!", next: 3, response: "Duygunu anlattin, simdi bir adim daha atip nasil yardim istedigini soyleyebilirsin." }
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
        title: "Sirami Bekliyorum",
        emoji: "?",
        description: "Bekleme, siraya uyma ve heyecanlaninca sakin kalma gorevi.",
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
        title: "Paylasiyorum ve Konusuyorum",
        emoji: "??",
        description: "Oyuncak paylasma, arkadasa donup konusma ve birlikte oyun kurma gorevi.",
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
                bgLabel: "Konusma kurma",
                videoQuery: "children talking together toy negotiation",
                narration: "Arkadasin biraz uzuldu. Simdi onun da kendini iyi hissetmesi icin bir cumle daha ekleyebilirsin.",
                taskType: "choice",
                taskText: "Hangi ek cumle daha iyi gelir?",
                choices: [
                    { text: "Sen de istersen mavi bloklari secebilirsin.", next: 2, response: "Secenek sunman cok iyi. Oyun beraber devam edebilir." },
                    { text: "Biraz beklemek zor olabilir biliyorum.", next: 2, response: "Bu cumle empati kuruyor. Karsindaki anlasildigini hisseder." }
                ]
            },
            {
                id: 2,
                emoji: "??",
                bg: "linear-gradient(135deg, #c471ed, #f64f59)",
                bgLabel: "Paylasma ani",
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
    if (theme === 'yardim') return 'Yardim Isteme';
    if (theme === 'bekleme') return 'Sira Bekleme';
    if (theme === 'iletisim') return 'Paylasma';
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






