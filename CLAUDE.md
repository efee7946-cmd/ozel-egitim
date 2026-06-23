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
- `index.html` — Tüm ekranların HTML'i (tek sayfa)
- `script.js` — Uygulama mantığının tamamı (~4200 satır, vanilla JS)
- `style.css` — Tasarım sistemi (~4900 satır)
- `db-client.js` — localStorage + Vercel KV çift modlu veri katmanı
- `server.js` — Express geliştirme sunucusu (port 3000)
- `api/` — Vercel serverless fonksiyonlar (auth, chat, tts, data, video, _db)

## State Yönetimi
Framework yok — global değişkenler (`childName`, `activeStudentId`, `currentUserRole`, `currentScreenId`). Ekran geçişleri `showOnly()` ile DOM göster/gizle. Veri: localStorage (önce) → Vercel KV (arka plan) → PostgreSQL.

## Veri Anahtarları
Tüm anahtarlar `lms_` öneki ile başlar: `lms_students`, `lms_iep_<studentId>`, `lms_skills_<studentId>`, `lms_behavior_<studentId>`, vb.

## Dış API'ler
- `GEMINI_KEY` — Google Gemini (terapi geri bildirimi, veli raporu)
- `ELEVEN_KEY` + `ELEVENLABS_VOICE` — ElevenLabs TTS
- `PEXELS_KEY` — Pexels fotoğraf/video
- `KV_REST_API_URL` + `KV_REST_API_TOKEN` — Vercel KV (opsiyonel)
- `DATABASE_URL` — PostgreSQL/Aiven bağlantısı

## Kodlama Kuralları
- Yorum yazma — değişken adları yeterince açıklayıcı
- Türkçe değişken/fonksiyon ismi kullanma
- Gereksiz soyutlama yapma — uygulama kasıtlı olarak framework'süz
- Erişilebilirlik önemli: büyük dokunma hedefleri (min 44px), yüksek kontrast desteği
- Çevrimdışı-önce: her write önce localStorage'a gitmeli

## Test
Playwright ile e2e. Test dosyası: `tests/app.spec.js`. CI: GitHub Actions, Node 24.

## Öğretmen Paneli
PIN korumalı (varsayılan: `1234`). Sağ üst köşe öğretmen simgesinden erişilir.

## Deploy
Vercel — `main` branch her push'ta otomatik deploy edilir.
