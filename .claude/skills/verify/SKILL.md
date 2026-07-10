---
name: verify
description: YildizCan degisikliklerini calisan uygulamada dogrulama tarifi — dev sunucu, API handler harness ve tarayici surusu
---

# Dogrulama tarifi

## Uygulamayi calistirma
- `node server.js` → http://localhost:3000 (statik dosyalar + birkac inline /api route'u).
- Dikkat: `server.js` gercek `api/*.js` Vercel fonksiyonlarini MOUNT ETMEZ (kendi inline implementasyonlari var). API degisikligini yerelde surmek icin asagidaki harness sart.

## api/*.js handler'larini gercek HTTP ile surme
- Handler'lar `export default (req, res)` — Express ile birebir uyumlu: `app.all('/api/data', (req,res) => dataHandler(req,res))`.
- `api/_db.js` havuzu lazy kurar; `DATABASE_URL` olmadan import guvenli. OPTIONS/CORS ve auth'suz 401 yollari DB'siz surulebilir; DB isteyen yollar "DATABASE_URL tanimli degil" hatasina duser (ortam, bug degil).
- Windows'ta dizin adinda bosluk/parantez oldugu icin ESM import'lari `file:///...ozel-egitim-main%20(16)/...` URL'siyle yaz.

## Tarayici surusu (Playwright)
- `import { chromium } from '<repo>/node_modules/@playwright/test/index.mjs'` calisiyor; ayrica test runner gerekmez.
- Native (Capacitor) modunu simule etmek icin:
  - `ctx.addInitScript`: `window.Capacitor = { isNativePlatform: () => true, getPlatform: () => 'ios', Plugins: {} }`
  - Oturum icin `localStorage.setItem('lms_auth_token', JSON.stringify('<token>'))` (demo_/guest_ prefixsiz).
  - `ctx.route('**://ozel-egitim.vercel.app/**', ...)` ile prod'a giden istekleri kes/gozlemle — canliya hicbir sey sizmasin.
- Uygulama acilista girissiz bulut cagrisi YAPMAZ; veri katmanini sayfa icinden `DB.get/set/del` ile tetikle. Hata loglayicisini `setTimeout(() => { throw ... })` ile tetikleyip `/api/log` cagrisini gozlemleyebilirsin.
- Acilis dogrulamasi: sayfa basligi "YildizCan | ..." ve giris ekrani gorunur; `pageerror`/console error toplamak yeterli sinyal.
