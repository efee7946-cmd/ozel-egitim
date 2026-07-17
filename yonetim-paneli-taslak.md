# YıldızCan Yönetim Paneli — Taslak

> Portföy adı: **YıldızCan Therapy Management System**
> Türkçe: **YıldızCan Özel Eğitim Seans ve İçerik Yönetim Sistemi**
> Durum: planlama · Başlangıç: 2026-07-17

## 1. Amaç
Öğretmen/terapist/veli ve geliştiricinin (Efe) kullanacağı web tabanlı yönetim paneli:
çocuk profillerini, seansları, cevapları, başarı oranlarını görüntülemek; veli raporu üretmek;
ileride içerik hazırlayıp mobile göndermek ve AI cevaplarını denetlemek.

**Neden bu proje?** C#/.NET öğrenme + gerçek kullanıcı/veri + portföy + TÜBİTAK 2209-A analiz ayağı.
Amaç *hız değil öğrenme* — hız olsaydı mevcut Node stack'ine admin sayfası eklenirdi.

## 2. Yığın
| Katman | Teknoloji |
|---|---|
| Backend API | ASP.NET Core Web API |
| Arayüz | Blazor (Server ile başla, WASM'a değil) |
| ORM | EF Core |
| Kimlik | ASP.NET Core Identity (panelin **kendi** kullanıcıları) |
| Grafik | Chart.js veya MudBlazor |
| PDF | QuestPDF |
| Entegrasyon | YıldızCan Node API'sine `HttpClient` ile REST |

## 3. Mimari kararlar (sabit)
1. **.NET paneli YıldızCan'ın PostgreSQL'ine DOKUNMAZ.** Tüm çocuk/seans verisi Node API üzerinden okunur. İki stack tek DB'ye yazma karmaşasından kaçınırız.
2. **EF Core + Identity yalnızca panelin kendi DB'si için** (panel kullanıcıları, ayarlar, işaretlenen AI cevapları gibi panele özel veri). Ayrı, küçük bir Postgres/SQLite.
3. **Gevşek bağlılık:** panel Node API'yi tüketen bir istemci. YıldızCan'ı bozma riski minimum.

```
[Blazor UI] ──> [.NET Web API] ──HttpClient/REST──> [YıldızCan Node API] ──> [YıldızCan Postgres]
                     │
                     └──EF Core──> [Panel'in kendi DB'si (Identity + panel verisi)]
```

## 4. YıldızCan admin API'si (belkemiği) — ✅ v1 YAZILDI + PROD DOĞRULANDI

Tek Vercel fonksiyonu `api/admin.js`, `?resource=` ile yönlendirir (data.js'in `?key=` stiliyle uyumlu).
Auth: `x-admin-key` header + `timingSafeEqual` ([log.js](api/log.js#L77-L84) deseni). Sadece GET, `Cache-Control: no-store`,
her okuma `console.log('[admin] …')` ile loglanır. Sunucudan sunucuya çağrılır; `ADMIN_API_KEY` tarayıcıya inmez.

**Anahtar haritası (kod okumasıyla düzeltildi):** Roster `teacher_students_<username>` altında ve **DÜZ JSON**
(zengin: `full_name/birth_year/support_notes`). `session_history_<username>` de düz, **kullanıcı bazlı**
(öğrenciye `student_id` ile süzülür). `obj_results_`/`speechmap_`/`stars_` öğrenci id'li, düz. Yalnızca
`adaptive_<studentId>` ve normalize `students_<username>` yedeği `ENC1:` şifreli — `api/_dataKey.js` ile
`data_key` çözülüp deşifre edilir (`db-client.js` şemasıyla birebir, round-trip testiyle doğrulandı).
**Prod'da gerçek veriyle doğrulandı: `studentCount>0`, isimler geliyor.**

Gerçekleşen endpoint'ler (hepsi `x-admin-key` ister):

| İstek | Döner |
|---|---|
| `GET /api/admin?resource=users` | `{ users:[{ username, displayName, email, emailVerified, studentCount }] }` |
| `GET /api/admin?resource=students[&user=U]` | `{ students:[{ username, id, fullName, birthYear, supportNotes, createdAt, updatedAt }] }` |
| `GET /api/admin?resource=student&user=U&id=SID` | `{ student:{…}, summary:{ plays, items, errors, accuracy, perfect, lastPlayed } }` |
| `GET /api/admin?resource=sessions&user=U&id=SID` | `{ objResults:[{ id, date, items, errors, accuracy }], speechHistory:[…] }` |
| `GET /api/admin?resource=stats&user=U&id=SID` | `{ summary:{…}, adaptive:{…}, speechMap:{…}, stars:{…} }` |

**v2 (henüz yok):** `POST resource=content` (soru/etkinlik ekle), `resource=ai-flags` (hatalı AI cevabı işaretle/listele).

> Güvenlik: `ADMIN_API_KEY` `DATA_KEY_SECRET` kadar hassas (log key'inden AYRI; yalnızca .NET backend'de,
> tarayıcıya inmez, her erişim loglanır). KVKK envanterine "çapraz kullanıcı özel nitelikli veri okuma" eklenmeli.
>
> ⚠️ **Uygulama tarafı bulgu:** Zengin roster (`teacher_students_`) app_data'da **DÜZ metin** duruyor —
> "app_data sızsa bile PII şifreli" garantisi bu roster için geçerli DEĞİL (şifreli olan sadece normalize
> `students_` kopyası). Panelden bağımsız, YıldızCan tarafında KVKK açısından ayrıca ele alınmalı.

## 5. Sürüm planı
### v1 — Salt-okunur, tam çalışan ürün
1. Panel girişi (ASP.NET Identity, kendi DB)
2. Çocuk/öğrenci listesi (Node admin API'den)
3. Bir öğrencinin seans geçmişi + seans detay ekranı
4. Başarı yüzdesi grafiği
5. PDF veli raporu (QuestPDF)

### v2 — Yazma/denetim
- Yeni soru/etkinlik ekleme + mobile push (mobil içerik modeli değişikliği gerektirir — en riskli parça)
- Hatalı/uygunsuz AI cevaplarını işaretleme
- TR/EN içerik ayrı yönetimi

### v3 — Akıllı özellikler
- "Son 10 seansı analiz et → zorlanılan konu + öneri" (Gemini)
- Yaş + konu + zorluk + dil seçip **soru havuzu üretme** (en güçlü demo)

## 6. v1 iş kalemleri (yapılacaklar)
**Node tarafı (önce):**
- [x] Admin auth mekanizması (`x-admin-key` + timingSafeEqual)
- [x] `api/_dataKey.js` — paylaşılan data_key + ENC1 çözme (auth.js buna bağlandı)
- [x] `api/admin.js` — users / students / student / sessions / stats endpoint'leri
- [x] ENC1 çözme kripto round-trip testiyle doğrulandı (6/6)
- [x] Prod'da `ADMIN_API_KEY` ile gerçek istek — doğrulandı (`studentCount>0`, isimler geliyor)

**.NET tarafı:**
- [ ] Solution iskeleti: `Api` (Web API) + `Web` (Blazor) + `Shared` (DTO'lar)
- [ ] Identity + kendi DB migration'ı
- [ ] Node API'ye bağlanan `YildizCanApiClient` (HttpClient, token yönetimi)
- [ ] Öğrenci listesi ekranı
- [ ] Seans geçmişi + detay ekranı
- [ ] Başarı grafiği bileşeni
- [ ] QuestPDF veli raporu şablonu + indirme

## 7. Riskler / dikkat
- **Admin API kiracı izolasyonunu bozarsa** güvenlik açığı olur — en dikkatli tasarlanacak yer.
- **v2 mobile push** mobil uygulamanın içerik modelini değiştirir; v1'de tutma.
- **İki DB senkronu:** panel DB'si YıldızCan verisini kopyalamamalı, önbelleklemeli/geçici tutmalı.

## 8. Sıradaki adım (seçilecek)
- [x] (A) Node admin API — yazıldı, kripto doğrulandı, **prod'da gerçek veriyle doğrulandı**
- [x] (B) .NET iskeleti kuruldu (kardeş repo `yildizcan-admin-panel`, derleniyor, boot testi geçti)
- [x] (C) Prod duman testi — API katmanı (`curl` ile `studentCount>0`, isimler geldi)
- [ ] Panel uçtan uca: `user-secrets` + `dotnet run` + login → `/students` gerçek veri
- [ ] Öğrenci detay + seans ekranı (`resource=student` / `resource=sessions`)
- [ ] Başarı yüzdesi grafiği; PDF veli raporu (QuestPDF)
- Not: DTO'lar §4'te sabit; .NET `Shared` record'ları bunları birebir yansıtıyor.
