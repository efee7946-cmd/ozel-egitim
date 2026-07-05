# Yıldız Sınıfı — CLAUDE.md

## Proje Özeti
Özel eğitim öğretmenleri, terapistler ve veliler için Türkçe web uygulaması. Hedef kitle 4-8 yaş özel gereksinimli çocuklar. Vanilla JS + HTML + CSS single-page app; backend Vercel serverless + PostgreSQL (Aiven).

## Çalıştırma
```bash
npm install
node server.js        # http://localhost:3000
npm test              # Playwright e2e testleri
```

## Temel Dosyalar
- `index.html` — Tüm ekranların HTML'i (tek sayfa, ~1250 satır)
- `script.js` — Uygulama mantığının tamamı (~7000 satır, vanilla JS)
- `style.css` — Tasarım sistemi (~5500 satır)
- `db-client.js` — localStorage + sessionStorage (şifreli cache) + `/api/data` (Aiven Postgres) çift modlu veri katmanı
- `server.js` — Express geliştirme sunucusu (port 3000)
- `api/` — Vercel serverless fonksiyonlar (`auth`, `data`, `chat`, `tts`, `video`, `photo`, `log`, ve dahili `_db`/`_auth`/`_mail`)
- `models/objects/*.glb` — Nesne Tanıma için Blender'da üretilen 3D modeller

## State Yönetimi
Framework yok — global değişkenler (`childName`, `activeStudentId`, `currentScreenId`). Ekran geçişleri `showOnly()` ile DOM göster/gizle (History API entegre, Android geri tuşu çalışır). Veri: localStorage (önce) → arka planda `/api/data` → PostgreSQL.

## Hesap Modeli
Tek tip hesap: bir yetişkin (öğretmen/terapist/veli ayrımı yok) kayıt olur, altına öğrenciler ekler. Rol/PIN mekanizması yoktur. Kimlik: kullanıcı adı + şifre + zorunlu e-posta (şifre sıfırlama ve doğrulama 6 haneli e-posta koduyla, Gmail SMTP). `/api/data` oturum token'ı ister; veriler sunucuda `kullanıcıadı:anahtar` olarak izole edilir.

## Veri Anahtarları
Tüm anahtarlar `lms_` öneki ile başlar: `lms_students`, `lms_iep_<studentId>`, `lms_skills_<studentId>`, `lms_behavior_<studentId>`, vb.

## Dış API'ler
- `GEMINI_KEY` — Google Gemini (konuşma pratiği geri bildirimi, veli raporu)
- `GOOGLE_TTS_CREDENTIALS` — Google Cloud TTS (Chirp 3 HD) servis hesabı JSON'ı
- `PEXELS_KEY` — Pexels fotoğraf/video
- `GMAIL_USER` + `GMAIL_APP_PASSWORD` — Gmail SMTP (şifre sıfırlama/doğrulama kodları)
- `DATABASE_URL` — PostgreSQL/Aiven bağlantısı
- `ALLOWED_ORIGIN` — CORS kısıtı (https://ozel-egitim.vercel.app)
- `ADMIN_KEY` — /api/log hata listesini görüntüleme anahtarı

## Kodlama Kuralları
- Yorum yazma — değişken adları yeterince açıklayıcı
- Türkçe değişken/fonksiyon ismi kullanma
- Gereksiz soyutlama yapma — uygulama kasıtlı olarak framework'süz
- Erişilebilirlik önemli: büyük dokunma hedefleri (min 44px), yüksek kontrast desteği
- Çevrimdışı-önce: her write önce localStorage'a gitmeli

## Test
Playwright ile e2e. Test dosyası: `tests/app.spec.js`. CI: GitHub Actions, Node 24.

## Deploy
Vercel — `main` branch her push'ta otomatik deploy edilir (https://ozel-egitim.vercel.app).

## Android
Capacitor ile paketlenir (`capacitor.config.json`, appId `app.yildizcan`), WebView içinde canlı Vercel URL'sini açar (yerel dosya kopyası değil). `.github/workflows/android-build.yml` ile CI'da APK/AAB üretilir; Play Store'da kapalı test aşamasında.
