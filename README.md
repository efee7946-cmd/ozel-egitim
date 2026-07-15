# Yıldız Sınıfı (YıldızCan)

Özel eğitim öğretmenleri, terapistler ve veliler için geliştirilmiş; yapay zeka destekli konuşma pratiği, 3D nesne tanıma, AAC ve gelişim takibini tek çatı altında birleştiren Türkçe/İngilizce web, Android ve iOS uygulaması. Hedef kitle 4-8 yaş özel gereksinimli çocuklar.

---

## İçindekiler

- [Özellikler](#özellikler)
- [Ekranlar ve Modüller](#ekranlar-ve-modüller)
- [Yapay Zeka Entegrasyonları](#yapay-zeka-entegrasyonları)
- [Veri Katmanı](#veri-katmanı)
- [Kimlik Doğrulama](#kimlik-doğrulama)
- [API Uç Noktaları](#api-uç-noktaları)
- [Kurulum](#kurulum)
- [Ortam Değişkenleri](#ortam-değişkenleri)
- [Vercel'e Deploy](#vercele-deploy)
- [Android ve iOS](#android-ve-ios)
- [Proje Yapısı](#proje-yapısı)
- [Teknik Mimari](#teknik-mimari)
- [Erişilebilirlik](#erişilebilirlik)
- [Testler](#testler)

---

## Özellikler

- **Konuşma Pratiği** — Konu haritası üzerinde ilerleyen seanslar; Gemini AI soru üretimi ve geri bildirimi, Piper TTS ile seslendirme, Web Speech API ile mikrofon kaydı, Pexels bağlamsal video
- **Nesne Tanıma** — Blender'da üretilen 3D modeller (Three.js ile render), döndürülebilir nesneyi mikrofonla söyleyerek veya yazarak tanımlama; yapay zeka geri bildirimi yok, deterministik doğruluk kontrolü
- **AAC (Destekleyici İletişim)** — Kategorilere ayrılmış sabit sembol kartlarıyla cümle oluşturma ve sesli çıktı; salt iletişim panosu (kart ekleme/düzenleme yoktur)
- **Günlük Görevler** — Her gün tohum tabanlı (seeded random) rastgele belirlenen 2 görev (konuşma pratiği + nesne tanıma), tamamlanınca yıldız ödülü
- **Giyim Mağazası** — Yıldız ekonomisi ile ayı karakterine şapka/yüz/boyun aksesuarı satın alma ve giydirme
- **Analiz & Rapor** — "BEP Analizi" (kayıt sırasında alınan destek düzeyi/durum profili + metrikler + trend grafiği) ve "Veli Özeti" (haftalık kullanım özeti + Gemini AI değerlendirmesi) sekmeleri
- **Yardım Paneli** — Bölümlerin ne işe yaradığını anlatan kısa açıklamalar ve sık sorulan sorular
- **Erişilebilirlik Paneli** — Büyük metin, yüksek kontrast, büyük dokunma hedefi, animasyon azaltma, sesli etiket; hesap yönetimi (e-posta ekleme, veri indirme, hesap silme)
- **Çevrimdışı-Önce Mimari** — Her yazma önce localStorage'a gider, arka planda Aiven PostgreSQL'e senkronize edilir
- **İki Dilli** — Türkçe/İngilizce; arayüz, AAC panoları, TTS sesleri ve Gemini prompt'ları iki dilde
- **Android ve iOS** — Capacitor ile paketlenmiş; Android Play Store'da kapalı testte, iOS App Store'da yayında

---

## Ekranlar ve Modüller

### Giriş ve Öğrenci Seçimi

- **Kimlik doğrulama ekranı** (`auth-screen`) — Kullanıcı adı + şifre + zorunlu e-posta ile kayıt/giriş. Kayıt formunda çocuğun destek düzeyi (Öğretilebilir / Eğitilebilir / Destekli) ve durumu (OSB, DEHB, Dil/Konuşma, Down Sendromu, Serebral Palsi, Özel Öğrenme Güçlüğü, Ekolali, Stereotipik Hareket) seçilir — bu profil "BEP Analizi" sekmesinde kullanılır
- Şifremi unuttum ve e-posta doğrulama akışları 6 haneli kod ile (Gmail SMTP)
- **Öğrenci seçim ekranı** (`login-screen`) — Emoji kartları ile aktif öğrenciyi seç veya sınırsız yeni öğrenci ekle

### Ana Menü

Altı ana faaliyet karosu:

| Karo | Hedef |
|---|---|
| Konuşma Pratiği | 4-8 yaş konuşma ve sosyal iletişim |
| Nesne Tanıma | 3D nesne tanıma ve isimlendirme |
| AAC Panosu | Alternatif ve destekleyici iletişim |
| Günlük Görevler | Günlük hedeflerle motivasyon |
| Analiz & Rapor | Gelişim takibi ve veli raporu |
| Giyim Mağazası | Yıldız ekonomisi ile ödüllendirme |

Üst çubukta öğrenci seçimi, dil değiştirme (TR/EN), Yardım (❓) ve Erişilebilirlik (⚙️) panelleri yer alır.

### Konuşma Pratiği

**Düzey Seçimi** (`THERAPY_LEVELS`) — İlk girişte üç düzeyden biri seçilir; düzey, Gemini'nin ürettiği sorunun ve verdiği cevabın uzunluğunu belirler:

| Düzey | Anahtar | Örnek |
|---|---|---|
| Tek Kelime | `word` | su, anne, top |
| Kısa Cümle | `sentence` | Okula annemle giderim |
| Anlat Bakalım | `tell` | Bugün neler yaptığını anlat |

**Konu Haritası** (`speechmap-screen`) — Serbest konu girişi yoktur; sabit konular (👋 Selamlaşma, 🙋 Tanışma, 😊 Duygular, …) harita üzerinde sırayla dizilir. Bir konuda yıldız kazanılmadan sonraki konu açılmaz (`speechMapUnlockedCount`). İlerleme `lms_speechmap_<studentId>` altında düzey + konu yıldızları olarak tutulur.

**Seans Akışı:**

1. Haritadan açık olan konu seçilir
2. Pexels API'den bağlamsal video yüklenir
3. Soru Piper TTS ile seslendirilir; animasyonlu karakter dudak senkronizasyonu yapar
4. Öğrenci Web Speech API ile yanıtını kaydeder
5. Gemini AI gerçek zamanlı geri bildirim verir; "Daha Basit" moduyla soru sadeleştirilebilir, AAC kartlarıyla da cevap verilebilir
6. Seans verileri kaydedilir, rapor geçmişine eklenir; konu tamamlanınca haritada bir sonraki durak açılır

### Nesne Tanıma

- `models/objects/*.glb` altındaki Blender modelleri Three.js (GLTFLoader + OrbitControls) ile 3D olarak gösterilir, parmakla döndürülebilir
- Öğrenci nesnenin adını mikrofona söyler ya da yazarak girer; cevap kontrolü basit metin eşleştirmesiyle yapılır (yapay zeka değerlendirmesi yoktur)
- Doğru cevapta bir sonraki nesneye geçilir; "Bilmiyorum, geç" seçeneğiyle soru atlanabilir
- Tur sonunda hata sayısına göre yıldız kazanılır, sonuçlar rapor sekmesinde özetlenir

### AAC Panosu

Salt iletişim panosu — kart ekleme, düzenleme veya silme yoktur; içerik `aac-data.js` içinde sabittir ve sunucuya yazılmaz. Kategorilere ayrılmış hazır sembol kartları (Çekirdek panosu `Evet / Hayır / İstiyorum / Daha / Dur / Yardım …` ile başlar) seçilerek cümle çubuğunda cümle oluşturulur ve Piper TTS ile seslendirilir.

Panolar iki dilde ayrı ayrı tanımlıdır (`ALL_BOARDS_TR` / `ALL_BOARDS_EN`, her biri ~130 kart); aktif dile göre `getActiveBoards()` ile seçilir.

### Günlük Görevler

- Her gün `(tarih:öğrenciId)` tohumlu rastgele sayı üreticisiyle 2 görev belirlenir: bir konuşma pratiği hedefi ve bir nesne tanıma hedefi (hedef sayılar günden güne değişir)
- Görev tamamlandıkça ilerleme çubuğu güncellenir, tamamlanınca yıldız kazanılır
- Ertesi gün otomatik sıfırlanır (tarih anahtarlı localStorage kaydı)

### Giyim Mağazası

- Kategoriler: Şapkalar, Yüz, Boyun (varsayılan olarak ilk kategori açılır, "Tümü" listesi yoktur)
- Yıldızlarla aksesuar satın alınır ve ayı karakterine giydirilir
- Yıldızlar Konuşma Pratiği, Nesne Tanıma ve Günlük Görevler'den kazanılır

### Analiz & Rapor

İki sekme:

1. **BEP Analizi** — Kayıt sırasında alınan destek düzeyi/durum profili, özet metrikler ve zaman içindeki ilerleme trend grafiği
2. **Veli Özeti** — Otomatik seans özeti (süre, mikrofon kullanımı, yanıt sayısı, nesne tanıma doğruluğu) + Gemini AI değerlendirmesi (katılım/motivasyon gözlemleri, iletişim becerisi değerlendirmesi, aileye somut öneriler)

### Yardım Paneli

Üst çubuktaki ❓ ikonuyla açılır: her ana bölümün ne işe yaradığını anlatan kısa açıklamalar ve açılır-kapanır SSS listesi (yıldız kazanma, birden fazla öğrenci ekleme, şifre sıfırlama, veri güvenliği).

### Erişilebilirlik Paneli

Üst çubuktaki ⚙️ ikonuyla açılır:

| Seçenek | Açıklama |
|---|---|
| Büyük Metin | Yazı tipi boyutunu artırır |
| Yüksek Kontrast | Renk kontrastını güçlendirir |
| Büyük Dokunma Hedefi | Buton boyutunu artırır |
| Animasyonları Azalt | Geçiş animasyonlarını devre dışı bırakır |
| Sesli Etiket | Düğmelere basılınca sesli okur |

Aynı panelde hesap işlemleri de yer alır: e-posta ekleme/güncelleme, verileri indirme (KVKK), hesabı kalıcı olarak silme.

---

## Yapay Zeka Entegrasyonları

### Google Gemini

| Parametre | Değer |
|---|---|
| Model | `gemini-3.1-flash-lite` |
| Uç nokta | `/api/chat` |
| Env değişkeni | `GEMINI_KEY` |

**Kullanım alanları:**
- Konuşma pratiğinde soru üretimi ve gerçek zamanlı yanıt değerlendirme
- Soruyu basitleştirme ("Daha Basit" modu)
- Veli Özeti raporu için AI değerlendirmesi

### Piper TTS

Bulut TTS servisi kullanılmaz. Seslendirme, sunucuda yerel olarak çalışan [Piper](https://github.com/rhasspy/piper) ile yapılır — API anahtarı veya kota yoktur.

| Parametre | Değer |
|---|---|
| Motor | Piper (yerel binary + ONNX model) |
| Ses (TR) | `tr_TR-dfki-medium` |
| Ses (EN) | `en_US-lessac-medium` |
| Uç nokta | `/api/tts` (POST `{ text, lang }`) |
| Çıktı | WAV |
| Yapılandırma | `piper-config.json` (model URL'leri, `length_scale`) |
| Env değişkeni | — (yok) |

Binary ve modeller repoda tutulmaz; `npm run build` sırasında `scripts/setup-piper.js` bunları indirip `bin/piper/` ve `bin/models/` altına yerleştirir. Kurulum yapılmadan `/api/tts` `TTS_ENGINE_MISSING` döner.

Yedek: tarayıcı yerleşik Web Speech Synthesis API.

### Pexels API

| Parametre | Değer |
|---|---|
| Uç nokta | `/api/video` (konuşma pratiği bağlamsal video) |
| Env değişkeni | `PEXELS_KEY` |

---

## Veri Katmanı

`db-client.js` — üç katmanlı veri erişimi:

```
Yazma  →  localStorage (anında, şifreli) + sessionStorage (plaintext hızlı önbellek)  →  arka planda /api/data
Okuma  →  sessionStorage/localStorage (önce)  →  /api/data (Aiven PostgreSQL) yedek
```

- Hassas veriler (öğrenci listesi, BEP profili, beceri/davranış/adaptif veriler) AES-GCM ile istemci tarafında şifrelenir; anahtar oturum token'ından türetilir ve diske yazılmaz
- `/api/data` her istekte `Authorization: Bearer <token>` ister; veriler sunucuda `kullanıcıadı:anahtar` olarak izole edilir (Postgres `app_data` tablosu)

**Metotlar:**

| Metot | Açıklama |
|---|---|
| `DB.getSync(key)` | localStorage/sessionStorage'dan anlık okuma |
| `DB.get(key)` | Async okuma (sunucu yedek) |
| `DB.set(key, val)` | Yerel + sunucuya yaz |
| `DB.del(key)` | Yerel + sunucudan sil |
| `DB.initEncryption(token)` | Oturum token'ından AES-GCM anahtarı türet |

**Önemli veri anahtarları** (tümü `lms_` öneki ile başlar):

| Anahtar | İçerik |
|---|---|
| `lms_students` | Öğrenci listesi |
| `lms_bep_profile_<username>` | Kayıt sırasında alınan destek düzeyi/durum profili |
| `lms_speechmap_<studentId>` | Konu haritası ilerlemesi (seçili düzey + konu yıldızları) |
| `lms_adaptive_<studentId>` | Uyarlanabilir zorluk durumu |
| `lms_daily_<studentId>_<tarih>` | Günlük görev ilerlemesi |
| `lms_obj_results_<studentId>` | Nesne tanıma tur sonuçları |
| `lms_stars_<studentId>` | Yıldız bakiyesi ve mağaza envanteri |
| `lms_session_history_<userId>` | Konuşma pratiği seans geçmişi |
| `lms_lang` | Aktif arayüz dili (`tr` / `en`) |

---

## Kimlik Doğrulama

`/api/auth` — Aiven PostgreSQL üzerinde çalışır; üçüncü taraf auth servisi yoktur. Bağlantı havuzu `api/_db.js` üzerinden yönetilir.

**Hesap modeli:** Tek tip hesap — öğretmen/terapist/veli ayrımı ve PIN mekanizması yoktur. Bir yetişkin kayıt olur, altına sınırsız öğrenci ekler.

**Actions:**

| Action | Açıklama |
|---|---|
| `register` | Yeni kullanıcı oluştur, doğrulama kodu gönder |
| `login` | Kullanıcı adı + şifre ile giriş |
| `verify` | Oturum token geçerliliğini kontrol et |
| `logout` | Token'ı geçersiz kıl |
| `request_reset` / `reset_with_email_code` | Şifre sıfırlama: e-postaya 6 haneli kod gönder, kodla yeni şifre belirle |
| `set_email` | Hesaba e-posta ekle/güncelle |
| `send_email_verification` / `verify_email` | E-posta doğrulama kodu gönder/kontrol et |
| `delete` | Hesabı ve tüm ilişkili verileri kalıcı sil (KVKK) |

**Güvenlik:**
- bcrypt (12 round) ile şifre hash'i; eski SHA-256 hesaplar ilk girişte otomatik bcrypt'e geçirilir
- 32 byte rastgele oturum token'ı, 14 günlük geçerlilik (PostgreSQL `sessions` tablosu)
- 5 başarısız denemede 15 dakikalık hesap kilidi

**Kurallar:**
- Kullanıcı adı: yalnızca `[a-z0-9_]`, en az 3 karakter
- Şifre: en az 6 karakter
- E-posta zorunlu ve doğrulanmalı

---

## API Uç Noktaları

| Uç nokta | Metot | Açıklama |
|---|---|---|
| `/api/auth` | POST | Kimlik doğrulama (register/login/verify/logout/şifre sıfırlama/e-posta doğrulama/hesap silme) |
| `/api/data` | GET/POST/DELETE | Kullanıcı verisi (Aiven PostgreSQL, `app_data` tablosu) |
| `/api/chat` | POST | Gemini AI yanıt üretimi |
| `/api/tts` | POST | Piper TTS ses sentezi (WAV) |
| `/api/video` | GET | Pexels video arama (konuşma pratiği) |
| `/api/photo` | GET | Pexels fotoğraf arama — **kullanılmıyor**, AAC özel kart özelliği kaldırıldığından çağıran kod yok |
| `/api/log` | GET/POST | İstemci hata günlüğü (görüntülemek için `ADMIN_KEY` gerekir) |

---

## Kurulum

**Gereksinimler:** Node.js 24 (CI bu sürümü kullanır), npm

```bash
# Repoyu klonla
git clone https://github.com/efee7946-cmd/ozel-egitim.git
cd ozel-egitim

# Bağımlılıkları kur
npm install

# Piper TTS binary'sini ve ses modellerini indir (bin/ altına)
npm run build

# Ortam değişkenlerini oluştur
cp .env.example .env.local
# .env.local dosyasını düzenle (aşağıya bak)

# Aiven PostgreSQL şemasını oluştur
# schema.sql içeriğini Aiven Console → Query Editor'a yapıştır

# Geliştirme sunucusunu başlat
node server.js
```

Uygulama `http://localhost:3000` adresinde çalışır.

> `npm run build` atlanırsa uygulama açılır ama seslendirme çalışmaz — `/api/tts` `TTS_ENGINE_MISSING` döner.

---

## Ortam Değişkenleri

`.env.local` dosyasını aşağıdaki değişkenlerle oluştur:

```env
# Google AI Studio — https://aistudio.google.com/apikey
GEMINI_KEY=your_gemini_api_key

# Pexels — https://www.pexels.com/api
PEXELS_KEY=your_pexels_api_key

# Aiven PostgreSQL bağlantısı
DATABASE_URL=postgresql://user:pass@host:port/dbname

# users.data_key sütununu AES-GCM ile şifreleyen sunucu sırrı.
# Tanımlı değilse data_key düz metin saklanır; bir kez ayarlandıktan
# sonra DEĞİŞTİRİLMEMELİ ve KAYBEDİLMEMELİ (mevcut veriler çözülemez).
DATA_KEY_SECRET=your_random_secret

# Gmail SMTP — şifre sıfırlama ve e-posta doğrulama kodları
GMAIL_USER=your_gmail_address
GMAIL_APP_PASSWORD=your_gmail_app_password

# CORS kısıtı
ALLOWED_ORIGIN=https://ozel-egitim.vercel.app

# /api/log hata listesini görüntüleme anahtarı
ADMIN_KEY=your_admin_key
```

> TTS için ortam değişkeni gerekmez — Piper yerel çalışır, anahtar istemez.

---

## Vercel'e Deploy

1. [Vercel Dashboard](https://vercel.com)'dan "New Project" → GitHub reposunu bağla
2. **Environment Variables** bölümüne yukarıdaki değişkenleri gir
3. Aiven'da bir PostgreSQL servisi oluştur, `schema.sql`'i çalıştır, `DATABASE_URL`'i ekle
4. "Deploy" — her `main` push'unda otomatik yeniden deploy edilir

---

## Android ve iOS

Her iki platform da Capacitor ile paketlenir (`capacitor.config.json`, appId `app.yildizcan`); WebView içinde canlı Vercel URL'sini açar — yerel dosya kopyası değil.

| Platform | Proje | CI | Durum |
|---|---|---|---|
| Android | `android/` | `.github/workflows/android-build.yml` → APK/AAB | Play Store'da kapalı test |
| iOS | `ios/` | `.github/workflows/ios-build.yml` → IPA | App Store'da yayında |

Repo public olduğu için CI ücretsiz `macos-latest`/Linux runner'larda çalışır.

```bash
npm run cap:sync        # build + npx cap sync
npm run cap:open:ios    # Xcode'da aç
npm run cap:open:android
```

---

## Proje Yapısı

```
ozel-egitim/
├── index.html                  # Tüm ekranların HTML şablonu
├── script.js                   # Uygulama mantığı ve özellikler (~7000 satır)
├── style.css                   # Tasarım sistemi ve animasyonlar
├── aac-data.js                 # AAC panoları (ALL_BOARDS_TR / ALL_BOARDS_EN, ~130 kart)
├── db-client.js                # localStorage + şifreli önbellek + /api/data veri katmanı
├── server.js                   # Yerel geliştirme sunucusu (Express)
├── schema.sql                  # PostgreSQL şeması (users, sessions, app_data, client_errors)
├── capacitor.config.json       # Android/iOS paketleme yapılandırması
├── piper-config.json           # Piper ses modelleri (indirme URL'leri, length_scale)
├── package.json
├── models/
│   └── objects/*.glb           # Nesne Tanıma için Blender 3D modelleri
├── bin/                        # npm run build ile oluşur, repoda yoktur
│   ├── piper/                  # Piper çalıştırılabiliri
│   └── models/*.onnx           # tr_TR-dfki-medium, en_US-lessac-medium
├── scripts/
│   ├── setup-piper.js          # Piper binary + model indirici (build adımı)
│   └── ...                     # Store görseli üretim scriptleri
├── api/
│   ├── _db.js                  # PostgreSQL bağlantı havuzu (Aiven)
│   ├── _auth.js                # Oturum token doğrulama yardımcıları
│   ├── _mail.js                # Gmail SMTP e-posta gönderimi
│   ├── auth.js                 # Kimlik doğrulama
│   ├── data.js                 # Kullanıcı verisi erişim katmanı
│   ├── chat.js                 # Gemini AI entegrasyonu
│   ├── tts.js                  # Piper TTS (yerel binary spawn, WAV)
│   ├── video.js                # Pexels video arama
│   ├── photo.js                # Pexels fotoğraf arama (kullanılmıyor)
│   └── log.js                  # İstemci hata günlüğü
├── android/                    # Capacitor Android projesi
├── ios/                        # Capacitor iOS projesi
├── tests/
│   └── app.spec.js             # Playwright uçtan uca testler
└── .github/
    └── workflows/
        ├── main.yml            # CI (Node 24 + Playwright)
        ├── android-build.yml   # Android APK/AAB build
        └── ios-build.yml       # iOS IPA build
```

---

## Teknik Mimari

```
Tarayıcı / WebView (Capacitor)
  ├── index.html + script.js + style.css   (tek sayfa uygulama)
  ├── Three.js (import map, jsdelivr)      (Nesne Tanıma 3D render)
  ├── Web Speech API                       (mikrofon kaydı)
  └── localStorage / sessionStorage        (çevrimdışı + şifreli önbellek)
        │
        ▼ fetch (arka planda, Bearer token)
Vercel Serverless Functions
  ├── /api/auth     → Aiven PostgreSQL (kullanıcı/oturum)
  ├── /api/data     → Aiven PostgreSQL (uygulama verisi)
  ├── /api/chat     → Google Gemini API
  ├── /api/tts      → Piper (yerel binary spawn, dış servis yok)
  ├── /api/video    → Pexels API
  └── /api/log      → Aiven PostgreSQL (client_errors)
```

**Çevrimdışı Davranış:**
- Tüm yazma işlemleri önce localStorage'a gider → kullanıcı gecikme hissetmez
- Sunucuya erişilemediğinde uygulama yalnızca localStorage ile çalışmaya devam eder
- Bağlantı yeniden kurulunca bir sonraki yazma/okuma ile senkronizasyon devam eder

---

## Erişilebilirlik

Üst çubuktaki ⚙️ ikonundan açılan panelden ayarlanır (bkz. [Erişilebilirlik Paneli](#erişilebilirlik-paneli)). Tercihler localStorage'a kaydedilir, sayfa yenilemeden sonra korunur.

---

## Testler

```bash
# Playwright testlerini çalıştır
npm test
```

GitHub Actions her `main` push ve pull request'te otomatik olarak çalıştırır (Node 24).

---

## Lisans

ISC
