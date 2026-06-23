# Yıldız Sınıfı

Özel eğitim öğretmenleri, terapistler ve veliler için geliştirilmiş; yapay zeka destekli konuşma terapisi, IEP takibi, beceri haritası ve interaktif eğitim oyunlarını tek çatı altında birleştiren web uygulaması.

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
- [Proje Yapısı](#proje-yapısı)
- [Teknik Mimari](#teknik-mimari)
- [Erişilebilirlik](#erişilebilirlik)

---

## Özellikler

- **Konuşma Terapisi** — Gemini AI geri bildirimi, ElevenLabs TTS, Web Speech API ile mikrofon kaydı, Pexels bağlamsal video
- **Eşleştirme Oyunları** — 4 hazır oyun + öğretmenin kendi oyununu oluşturabileceği editör
- **Sıralama ve Sebep-Sonuç Oyunları** — Görsel kartları doğru sıraya yerleştirme
- **AAC (Destekleyici İletişim)** — 4 kategori × 8 kart = 32 sembol, cümle oluşturma ve sesli çıktı
- **Günlük Program** — Emoji + saat + etiket ile aktivite planı, günlük tamamlanma takibi
- **Ödül Sistemi** — Token ekonomisi, 8 ödül seçeneği, kutlama ekranı
- **IEP Hedefleri** — 5 alan, deneme kaydı (Doğru / Destekli / Hatalı), kazanım durumu
- **Beceri Haritası** — 5 alan × 8 beceri = 40 beceri, 3 aşamalı ilerleme
- **Davranış Kaydı** — ABC modeli, frekans, süre, zaman damgalı liste
- **Veli Raporu** — Otomatik seans özeti + Gemini AI değerlendirmesi
- **Çevrimdışı-Önce Mimari** — localStorage anında yazma, Vercel KV arka planda senkronize

---

## Ekranlar ve Modüller

### Giriş ve Öğrenci Seçimi

- **Kimlik doğrulama ekranı** (`auth-screen`) — Kullanıcı adı + şifre ile giriş veya kayıt; kayıt formunda öğrenci profili (ad, yaş, eğitim seviyesi, tanı bilgisi) toplanır
- **Öğrenci seçim ekranı** (`login-screen`) — Emoji kartları ile aktif öğrenciyi seç veya yeni ekle

### Ana Menü

Altı ana faaliyet döşemesi:

| Döşeme | Hedef |
|---|---|
| Konuşma Terapisi | 4-8 yaş konuşma ve sosyal iletişim |
| Eşleştirme Oyunları | Görsel-sözel eşleştirme |
| Sıralama Oyunları | Sıra takibi, sebep-sonuç |
| AAC Panosu | Alternatif ve destekleyici iletişim |
| Günlük Program | Rutin planlaması |
| Ödül Sistemi | Davranış pekiştirme |

### Konuşma Terapisi

**Seans Başlangıcı:**
Sabit kategori butonları yerine serbest konu girişi — öğretmen veya terapist istediği konuyu yazarak seans başlatır. Gemini bu konuya uygun sorular üretir.

**Seans Akışı:**

1. Serbest konu girilir (örn. "piknik", "doğum günü")
2. Pexels API'den bağlamsal video yüklenir
3. Soru ElevenLabs TTS ile seslendirilir; animasyonlu karakter dudak senkronizasyonu yapar
4. Öğrenci Web Speech API ile yanıtını kaydeder (özel eğitim için duraklama toleransı ayarlı)
5. Gemini AI, AAC etkileşim modeline göre gerçek zamanlı geri bildirim verir
6. Seans verileri kaydedilir

**AI Pedagoji Kuralları (4 ilke):**

| Durum | Yanıt |
|---|---|
| Argo / kaba kelime | Kelimeyi tekrar etme; iletişim isteğini onayla, sosyal karşılığı modelle |
| Direnç / "istemem" | İki seçenek sun, otonom karar verme hakkı tanı |
| Alakasız / saçma yanıt | Espriyle geçiştir ve konuya dön |
| Doğru yanıt | Kısa ve samimi övgü ("Harika!", "Süper!") |

### Eşleştirme Oyunları

**Hazır oyunlar:**
- Hayvanları Eşleştir (Kedi, Köpek, Kuş, Balık)
- Renkleri Eşleştir (Kırmızı, Mavi, Sarı, Yeşil)
- Eşyaları Eşleştir (Kalem, Kitap, Elma, Top)
- Meyveleri Eşleştir (Elma, Muz, Çilek, Üzüm)

**Öğretmen Editörü:**
- PIN korumalı öğretmen panelinden erişilir
- Kelime + emoji veya Pexels'tan otomatik fotoğraf ile çift oluşturma
- Tamamlanan oyunlar `custom_matching_games` anahtarında saklanır
- Oyun listesinden silinebilir veya düzenlenebilir

### Sıralama Oyunları

**Sıralama:**
- Sabah Rutini (6 adım)
- El Yıkama (6 adım)
- Yemek Hazırlığı (5 adım)

**Sebep-Sonuç:**
- Yağmur → Şemsiye
- Düşüp acı → Ağlama
- Su verme → Çiçek açma
- Karanlık → Işık

### AAC Panosu

**4 Kategori, 8 Kart:**

| Kategori | Örnek kartlar |
|---|---|
| Duygular | Mutlu, Üzgün, Sinirli, Korkmuş, Yorgun, Mide Bulantısı, Sevgi, Umursamaz |
| İhtiyaçlar | Su, Yemek, Tuvalet, Uyku, Oynama, Sarılma, Dur, Evet |
| Etkinlikler | Oku, Çiz, Müzik, Video, Puzzle, Koş, Boya, Yardım |
| Yerler | Ev, Okul, Bahçe, Market, Araba, Doktor, Banyo, Oda |

Kartlar seçilerek cümle oluşturulur; TTS ile seslendirilir.

### Günlük Program

- Emoji + saat + aktivite etiketi ile yeni görev ekleme
- Günlük tamamlanma durumu (onay kutusu)
- Tamamlanma çubuğu (X/Y)
- Her öğrenci için ayrı, günlük sıfırlama

### Ödül Sistemi

- Davranış hedefi tanımla (serbest metin)
- 8 ödülden birini seç (Tablet Zamanı, Şeker, Boyama, Çizgi Film, Müzik, Bahçe, Hikaye, Oyuncak)
- Hedef token sayısını belirle (3, 5, 7, 10)
- Token ekle / geri al
- Hedefe ulaşınca kutlama ekranı gösterilir
- Seans sonunda gizli yıldız ödülü animasyonu ile pekiştirme yapılır

### Öğretmen Paneli

**Erişim:** Sağ üst köşedeki öğretmen simgesi → PIN girişi (varsayılan: `1234`)

#### IEP Hedefleri

5 alan: İletişim, Akademik, Öz Bakım, Sosyal, Motor

Her hedef için:
- Metin, başlangıç/bitiş tarihi, hedef yüzde ve deneme sayısı
- Deneme kaydı: Doğru / Destekli / Hatalı
- Durum: Başlanmadı → Öğreniliyor → Kazanıldı

#### Beceri Haritası

40 beceri (5 alan × 8 beceri), üç aşamalı ilerleme:

| Alan | Örnek beceriler |
|---|---|
| İletişim | Adını söyleme, İstek ifade, Hayır diyebilme |
| Akademik | Rakam tanıma, Harf tanıma, Renk tanıma, Şekil tanıma |
| Öz Bakım | El yıkama, Diş fırçalama, Tuvalet, Giyinme |
| Sosyal | Göz teması, Sıra bekleme, Paylaşma, Empati |
| Motor | Kalem tutma, Makas, Top, Bağcık, Düğme |

#### Davranış Kaydı

- ABC Modeli: Öncül (A), Davranış (B), Sonuç (C)
- Frekans sayacı ve süre (dakika)
- Son 100 kayıt saklanır

### Veli Raporu ve BEP Çıktısı

**Otomatik veriler:**
- Seans süresi (dakika)
- Mikrofon kullanım sayısı
- Toplam yanıt sayısı

**Rapor bölümleri:**
1. Günlük kullanım takvimi (tıklanabilir günler)
2. Bağımsızlık metrikleri analiz ekranı (bağımsız / destekli / hatalı yanıt oranları)
3. Öğrenme alanı planı (3 gelişim alanı)
4. Konuşma terapisi tur özeti
5. Gemini AI değerlendirmesi (3-4 paragraf):
   - Katılım ve motivasyon gözlemleri
   - Sosyal-duygusal çıkarımlar
   - İletişim becerileri değerlendirmesi
   - Aileye somut öneriler
6. BEP raporu çıktısı — IEP hedeflerine göre biçimlendirilmiş yazılı döküm

---

## Yapay Zeka Entegrasyonları

### Google Gemini

| Parametre | Değer |
|---|---|
| Model | `gemini-3.1-flash-lite` |
| Uç nokta | `/api/chat` |
| Env değişkeni | `GEMINI_KEY` |

**Kullanım alanları:**
- Terapide gerçek zamanlı yanıt değerlendirme
- Soruyu basitleştirme (Daha Basit modu)
- Veli raporu için AI değerlendirmesi

### ElevenLabs TTS

| Parametre | Değer |
|---|---|
| Model | `eleven_multilingual_v2` |
| Uç nokta | `/api/tts` |
| Çıktı | MP3 |
| Env değişkenleri | `ELEVEN_KEY`, `ELEVENLABS_VOICE` |

Yedek: tarayıcı yerleşik Web Speech Synthesis API (`tr-TR`)

### Pexels Video API

| Parametre | Değer |
|---|---|
| Uç nokta | `/api/video` |
| Env değişkeni | `PEXELS_KEY` |

Eşleştirme editörü ve konuşma terapisi için bağlamsal fotoğraf/video getirir.

---

## Veri Katmanı

`db-client.js` — çift modlu veri katmanı:

```
Yazma  →  localStorage (anında)  +  Vercel KV (arka planda)
Okuma  →  localStorage (önce)    →  Vercel KV (yedek)
```

**Metotlar:**

| Metot | Açıklama |
|---|---|
| `DB.getSync(key)` | localStorage'dan anlık okuma |
| `DB.get(key)` | Async okuma (KV yedek) |
| `DB.set(key, val)` | Her iki depoya yaz |
| `DB.del(key)` | Her iki depodan sil |
| `DB.pushAll()` | localStorage → KV toplu yükleme |
| `DB.isCloud()` | KV erişilebilirliğini kontrol et |

**Önemli veri anahtarları** (tümü `lms_` öneki ile başlar):

| Anahtar | İçerik |
|---|---|
| `lms_students` | Öğrenci listesi |
| `lms_session_history_<userId>` | Seans anlık görüntüleri (son 180) |
| `lms_teacher_students_<userId>` | Öğretmene bağlı öğrenciler |
| `lms_iep_<studentId>` | IEP/BEP hedefleri |
| `lms_trials_<goalId>` | Deneme kayıtları |
| `lms_skills_<studentId>` | Beceri haritası durumu |
| `lms_behavior_<studentId>` | Davranış log (son 100) |
| `lms_sched_acts_<studentId>` | Günlük program aktiviteleri |
| `lms_sched_done_<studentId>_<YYYY-MM-DD>` | Günlük tamamlanma |
| `lms_tok_setup_<studentId>` | Token hedef yapılandırması |
| `lms_custom_matching_games` | Öğretmen tarafından oluşturulan oyunlar |
| `lms_teacher_pin` | Öğretmen paneli PIN'i |

---

## Kimlik Doğrulama

`/api/auth` — PostgreSQL (Aiven) üzerinde çalışır; Supabase veya üçüncü taraf auth bağımlılığı yoktur. Bağlantı havuzu `api/_db.js` üzerinden yönetilir.

**Actions:**

| Action | Açıklama |
|---|---|
| `register` | Yeni kullanıcı oluştur |
| `login` | Kullanıcı adı + şifre ile giriş |
| `verify` | Oturum token geçerliliğini kontrol et |
| `logout` | Token'ı geçersiz kıl |

**Güvenlik:**
- SHA-256 + kullanıcıya özel salt ile şifre hash'i
- 32 byte rastgele oturum token (64 char hex)
- 14 günlük oturum süresi (Vercel KV TTL)

**Kurallar:**
- Kullanıcı adı: yalnızca `[a-z0-9_]`, en az 3 karakter
- Şifre: en az 6 karakter

---

## API Uç Noktaları

| Uç nokta | Metot | Açıklama |
|---|---|---|
| `/api/auth` | POST | Kimlik doğrulama (register/login/verify/logout) |
| `/api/data` | GET/POST/DELETE | Vercel KV veri erişim katmanı |
| `/api/chat` | POST | Gemini AI yanıt üretimi |
| `/api/tts` | POST | ElevenLabs TTS ses sentezi |
| `/api/video` | GET | Pexels arama ve video getirme |

---

## Kurulum

**Gereksinimler:** Node.js 20+, npm

```bash
# Repoyu klonla
git clone https://github.com/efee7946-cmd/ozel-egitim.git
cd ozel-egitim

# Bağımlılıkları kur
npm install

# Ortam değişkenlerini oluştur
cp .env.example .env.local
# .env.local dosyasını düzenle (aşağıya bak)

# Geliştirme sunucusunu başlat
node server.js
```

Uygulama `http://localhost:3000` adresinde çalışır.

---

## Ortam Değişkenleri

`.env.local` dosyasını aşağıdaki değişkenlerle oluştur:

```env
# Google AI Studio — https://aistudio.google.com/apikey
GEMINI_KEY=your_gemini_api_key

# ElevenLabs — https://elevenlabs.io/app/settings/api-keys
ELEVEN_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE=your_voice_id

# Pexels — https://www.pexels.com/api
PEXELS_KEY=your_pexels_api_key

# PostgreSQL / Aiven
DATABASE_URL=postgresql://user:pass@host:port/dbname

# Vercel KV (opsiyonel — yoksa localStorage yedek olarak çalışır)
KV_REST_API_URL=https://your-kv.upstash.io
KV_REST_API_TOKEN=your_kv_token
```

> KV değişkenleri olmadan uygulama çalışır; veriler yalnızca tarayıcı localStorage'ında saklanır.

---

## Vercel'e Deploy

1. [Vercel Dashboard](https://vercel.com)'dan "New Project" → GitHub reposunu bağla
2. **Environment Variables** bölümüne yukarıdaki değişkenleri gir
3. Vercel KV için: Dashboard → Storage → Create KV → projeye bağla (KV değişkenleri otomatik eklenir)
4. "Deploy" — her `main` push'unda otomatik yeniden deploy edilir

---

## Proje Yapısı

```
ozel-egitim/
├── index.html          # Tüm ekranların HTML şablonu
├── script.js           # Uygulama mantığı ve özellikler
├── style.css           # Tasarım sistemi ve animasyonlar
├── db-client.js        # localStorage + Vercel KV veri katmanı
├── server.js           # Yerel geliştirme sunucusu (Express)
├── schema.sql          # PostgreSQL şeması (users, sessions, app_data)
├── package.json
├── api/
│   ├── _db.js          # PostgreSQL bağlantı havuzu (Aiven)
│   ├── auth.js         # Kimlik doğrulama (register/login/verify/logout)
│   ├── chat.js         # Gemini AI entegrasyonu
│   ├── tts.js          # ElevenLabs TTS
│   ├── data.js         # Vercel KV erişim ağ geçidi
│   └── video.js        # Pexels API
├── tests/
│   └── app.spec.js     # Playwright uçtan uca testler
└── .github/
    └── workflows/
        └── main.yml    # CI/CD (Node 24 + Playwright)
```

---

## Teknik Mimari

```
Tarayıcı
  ├── index.html + script.js + style.css  (tek sayfa uygulama)
  ├── Web Speech API                       (mikrofon kaydı)
  ├── AudioContext API                     (dudak senkronizasyonu)
  └── localStorage                         (çevrimdışı veri)
        │
        ▼ fetch (arka planda)
Vercel Serverless Functions
  ├── /api/auth    → Vercel KV (oturum ve kullanıcı)
  ├── /api/data    → Vercel KV (uygulama verisi)
  ├── /api/chat    → Google Gemini API
  ├── /api/tts     → ElevenLabs API
  └── /api/video   → Pexels API
```

**Çevrimdışı Davranış:**
- Tüm yazma işlemleri önce localStorage'a gider → kullanıcı gecikme hissetmez
- Vercel KV erişilemez durumdaysa uygulama yalnızca localStorage ile çalışmaya devam eder
- KV bağlantısı yeniden kurulunca `DB.pushAll()` ile yerel veri buluta yüklenir

---

## Erişilebilirlik

Ayarlar panelinden (sağ üst dişli ikonu) açılabilir:

| Seçenek | Açıklama |
|---|---|
| Büyük Metin | Yazı tipi boyutunu artırır |
| Yüksek Kontrast | Renk kontrastını güçlendirir |
| Büyük Dokunma Hedefi | Minimum 44px dokunma alanı |
| Animasyonları Azalt | Geçiş animasyonlarını devre dışı bırakır |
| Sesli Etiket | Düğmelere tıklanınca sesli açıklama okur |

Tercihler localStorage'a kaydedilir, sayfa yenilemeden sonra korunur.

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
