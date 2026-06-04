# Yildiz Sinifi SaaS Faz 1-2 Plan

## Faz 1

- `profiles`: kullanici rolu ve temel kimlik bilgisi
- `students`: ogrenci kartlari
- `parent_student_links`: veli-ogrenci baglari
- `specialist_student_links`: uzman-ogrenci baglari
- `session_history.student_id`: oturumlari ogrenciye baglama
- `parent_goals.student_id`: hedefleri ogrenciye baglama

## Faz 2

- uzman paneli
- coklu ogrenci secimi
- ogrenci detay sayfasi
- haftalik hedefler
- AI yorumlu gelisim ozeti

## Siradaki Uygulama Adimlari

1. Kayit sirasinda rol bilgisini topla.
2. Ilk giriste kullaniciya ogrenci olusturma ekrani goster.
3. Aktif ogrenci secimini local state + Supabase ile takip et.
4. `session_history` ve `parent_goals` yazimlarini `student_id` ile kaydet.
5. Rapor ekranini secili ogrenciye gore filtrele.
