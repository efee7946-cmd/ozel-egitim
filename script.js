// =============================================
// I18N — Çok Dil Desteği
// =============================================
const STRINGS = {
  tr: {
    back_menu: '← Menü',
    back: '← Geri',
    save: 'Kaydet',
    cancel: 'İptal',
    delete: 'Sil',
    yes: 'Evet',
    no: 'Hayır',
    close: 'Kapat',
    ok: 'Tamam',
    loading: 'Yükleniyor...',
    error: 'Hata',
    login_title: 'Yıldız Sınıfı',
    login_subtitle: 'Özel eğitimde dijital destek',
    login_username: 'Kullanıcı adı',
    login_password: 'Şifre',
    login_btn: 'Giriş Yap',
    register_btn: 'Kayıt Ol',
    guest_btn: 'Misafir olarak devam et',
    login_tab: 'Giriş',
    register_tab: 'Kayıt',
    consent_label: 'Öğrenci verilerini işlemek için veli/yasal temsilci onayını aldım',
    setup_title: 'Öğrenci Bilgileri',
    setup_name: 'Öğrenci adı',
    setup_age: 'Yaş',
    setup_level: 'Destek düzeyi',
    setup_btn: 'Başla',
    menu_greeting_default: 'Merhaba!',
    menu_therapy: 'Konuşma Pratiği',
    menu_schedule: 'Günlük Plan',
    menu_skills: 'Beceri Takibi',
    menu_behavior: 'Davranış',
    menu_bep: 'BEP',
    menu_report: 'Rapor',
    menu_aac: 'AAC',
    menu_sequence: 'Sıralama Oyunları',
    menu_sort: 'Sınıflandırma',
    menu_analysis: 'Analiz',
    therapy_title: 'Konuşma Pratiği',
    therapy_hint: 'Hazırlanıyorum...',
    sort_title: 'Sınıflandırma',
    sort_subtitle: 'Nesneleri doğru sepete sürükle!',
    sort_back: '← Oyun Seçimine Dön',
    sort_correct: 'Harika!',
    sort_wrong: 'Tekrar dene!',
    sort_complete_title: 'Tebrikler!',
    sort_complete_msg: 'Tüm nesneleri doğru sepete koydun!',
    sort_play_again: 'Tekrar Oyna',
    sort_other_game: 'Başka Oyun',
    sort_perfect: '🌟 Mükemmel!',
    report_title: 'Rapor',
    report_generate: 'Rapor Oluştur',
    bep_title: 'Dönemsel BEP Taslağı',
    bep_generate: 'BEP Taslağı Oluştur',
    bep_disclaimer: '⚠️ Bu taslak yalnızca rehberlik amaçlıdır. Lisanslı özel eğitim uzmanı tarafından gözden geçirilmelidir.',
    aac_title: 'AAC Panosu',
    sequence_title: 'Sıralama Oyunları',
    skills_title: 'Beceri Takibi',
    behavior_title: 'Davranış Takibi',
    a11y_title: '⚙️ Erişilebilirlik',
    a11y_large_text: 'Büyük Metin',
    a11y_large_text_desc: 'Yazı boyutunu artırır',
    a11y_high_contrast: 'Yüksek Kontrast',
    a11y_high_contrast_desc: 'Renk kontrastını artırır',
    a11y_reduce_motion: 'Hareketi Azalt',
    a11y_reduce_motion_desc: 'Animasyonları kapatır',
    a11y_large_touch: 'Büyük Dokunma',
    a11y_large_touch_desc: 'Buton boyutunu artırır',
    a11y_export: '📥 Verilerimi İndir',
    a11y_delete: '🗑️ Hesabı Sil',
    a11y_privacy: 'Gizlilik Politikası & KVKK',
    lang_toggle: 'EN',
    // Sort oyunu kategorileri ve sepetler
    sort_game1_title: 'Hayvan mı, Araç mı?',
    sort_game2_title: 'Yiyecek mi, Oyuncak mı?',
    sort_game3_title: 'Dışarıda mı, İçeride mi?',
    sort_game4_title: 'Büyük mü, Küçük mü?',
    sort_cat_animals: 'Hayvanlar',
    sort_cat_vehicles: 'Araçlar',
    sort_cat_food: 'Yiyecekler',
    sort_cat_toys: 'Oyuncaklar',
    sort_cat_outside: 'Dışarısı',
    sort_cat_inside: 'İçerisi',
    sort_cat_big: 'Büyük',
    sort_cat_small: 'Küçük',
    item_cat: 'Kedi', item_car: 'Araba', item_dog: 'Köpek', item_plane: 'Uçak',
    item_bird: 'Kuş', item_ship: 'Gemi', item_fish: 'Balık', item_bike: 'Bisiklet',
    item_lion: 'Aslan', item_helicopter: 'Helikopter',
    item_apple: 'Elma', item_teddy: 'Oyun Ayısı', item_pizza: 'Pizza', item_ball: 'Top',
    item_banana: 'Muz', item_gamepad: 'Oyun Kolu', item_ice_cream: 'Dondurma',
    item_paint: 'Boya Seti', item_cake: 'Pasta', item_target: 'Hedef Tahtası',
    item_flower: 'Çiçek', item_sofa: 'Kanepe', item_cloud: 'Bulut', item_tv: 'Televizyon',
    item_tree: 'Ağaç', item_bed: 'Yatak', item_sea: 'Deniz', item_chair: 'Sandalye',
    item_tent: 'Çadır', item_computer: 'Bilgisayar',
    item_elephant: 'Fil', item_mouse: 'Fare', item_house: 'Ev', item_bee: 'Arı',
    item_airplane2: 'Uçak', item_ant: 'Karınca', item_ring: 'Yüzük',
    item_world: 'Dünya', item_butterfly: 'Kelebek',
    score_label: 'puan',
    sort_items_count: 'nesne',
    sort_tries: 'deneme',
    choose_student: 'Öğrenci seç veya ekle',
    add_new_student: '+ Yeni Öğrenci Ekle',
    student_placeholder: 'Öğrenci adı',
    age_label: 'Yaş',
    level_label: 'Destek düzeyi',
    level1: 'Hafif',
    level2: 'Orta',
    level3: 'Ağır',
    start_btn: 'Başla',
    teacher_panel: 'Öğretmen Paneli',
    teacher_pin: 'PIN gir',
    teacher_enter: 'Giriş',
    teacher_wrong_pin: 'Yanlış PIN!',
    change_student: 'Öğrenci Değiştir',
    thinking: 'Düşünüyorum...',
    mic_start: 'Mikrofon',
    send_btn: 'Gönder',
    session_end: 'Oturumu Bitir',
    back_to_menu: '← Menüye Dön',
    report_no_data: 'Henüz veri yok.',
    report_session: 'Oturum',
    report_duration: 'Süre',
    report_messages: 'Mesaj',
    generating: 'Oluşturuluyor...',
    bep_generate_btn: 'BEP Taslağı Oluştur',
    bep_copy: 'Kopyala',
    bep_copied: 'Kopyalandı!',
    add_skill: '+ Beceri Ekle',
    skill_name_ph: 'Beceri adı',
    skill_goal_ph: 'Hedef',
    skill_save: 'Kaydet',
    skill_trial: 'Deneme Ekle',
    add_behavior: '+ Davranış Ekle',
    behavior_name_ph: 'Davranış adı',
    behavior_freq: 'Sıklık',
    confirm_delete: 'Silmek istediğinizden emin misiniz?',
    data_saved: 'Kaydedildi',
    copy_success: 'Kopyalandı',
    no_student: 'Öğrenci seçilmedi',
    // Schedule ekranı
    schedule_empty: 'Henüz etkinlik eklenmedi.',
    schedule_help: '"+ Etkinlik Ekle" butonuyla bu öğrencinin programını oluşturun.',
    schedule_progress: '{done} / {total} tamamlandı',
    schedule_activity_done: '{label} tamamlandı!',
    schedule_undo: 'Geri al',
    schedule_mark_done: 'Tamamlandı işaretle',
    schedule_delete: 'Sil',
    schedule_activity_ph: 'Etkinlik adı',
    // Skills ekranı
    skill_mastered: 'Kazanıldı!',
    skill_learning_status: 'Öğreniliyor',
    skill_reset: 'Sıfırlandı',
    skill_legend_not_started: '⬜ Başlanmadı',
    skill_legend_learning: '🔄 Öğreniliyor',
    skill_legend_mastered: '✅ Kazanıldı',
    // Behavior ekranı
    behavior_empty: 'Henüz kayıt yok.',
    behavior_added: 'Kayıt eklendi!',
    behavior_duration_unit: '{duration} dk',
    behavior_delete: 'Sil',
    behavior_label: 'Davranış',
    behavior_what_happened_ph: 'Ne oldu?',
    behavior_antecedent_label: 'Öncesi (A)',
    behavior_consequence_label: 'Sonrası (C)',
    behavior_frequency_label: 'Sıklık',
    behavior_duration_label: 'Süre (dk)',
    // BEP/IEP ekranı
    bep_preparing: '⏳ Taslak hazırlanıyor...',
    bep_draft_failed: 'Taslak oluşturulamadı. Gemini API yanıt vermedi.',
    bep_error_prefix: 'Hata: ',
    bep_copied_btn: '✓ Kopyalandı!',
    bep_copy_btn: '📋 Metni Kopyala',
    bep_periodic_title: 'Dönemsel BEP Taslağı',
    bep_periodic_sub: "Seans verileri kullanılarak BEP'e aktarılabilecek bir taslak metin oluşturulur. Yetkili ekip tarafından gözden geçirilmesi gerekir.",
    bep_disclaimer_short: '⚠️ Bu metin bir taslaktır. Resmi BEP için yetkili ekip (öğretmen, uzman, veli) tarafından incelenmeli ve onaylanmalıdır.',
    bep_disclaimer_full: '⚠️ TASLAK BELGE — Bu metin yapay zeka tarafından oluşturulmuştur. Resmi BEP belgesi olarak kullanılabilmesi için yetkili BEP ekibi (öğretmen, uzman, okul idaresi, veli) tarafından incelenmeli ve onaylanmalıdır.',
    // Report ekranı
    report_generated_at: 'Rapor oluşturulma tarihi: {date}',
    report_minutes: '{minutes} dk',
    report_no_usage_days: 'Henüz kayıtlı bir kullanım günü yok.',
    report_no_city_sessions: 'Henüz şehir temelli terapi oturumu yapılmadı.',
    report_general_area: 'Genel alan',
    report_top_area: 'En yoğun alan',
    report_top_area_summary: '{count} soru ile bu alan en çok çalışılan konuşma noktası oldu.',
    report_location_count: '{count} farklı mekân',
    report_general_speech: 'Genel konuşma',
    report_question_prefix: 'Soru: ',
    report_no_records: 'Kayıt yok',
    report_no_session_for_day: 'Bu gün için kayıtlı bir oturum yok.',
    report_session_summary: '{count} oturum kaydı • {minutes} dk toplam süre • {turns} toplam yanıt • {mic} mikrofon kullanımı',
    report_speech_practice: 'Konuşma çalışması',
    report_story_speech_practice: '{story} + konuşma çalışması',
    report_session_detail: '{minutes} dk • {turns} yanıt • {mic} mikrofon • Hikaye ilerleme: {progress}',
    report_completed: 'Tamamlandı',
    report_records_count: '{count} kayıt',
    report_title_full: 'Veli Gelişim Raporu',
    report_history_section_title: 'Takvimli Kullanım Geçmişi',
    report_history_section_sub: 'Hangi günlerde kullanıldığını ve her güne ait oturum detaylarını buradan inceleyebilirsin.',
    report_learning_area_plan: '📚 Gelişim Alanı Planı',
    report_city_summary: '🏙️ Şehir Özeti',
    weekday_mon: 'Pzt', weekday_tue: 'Sal', weekday_wed: 'Çar', weekday_thu: 'Per',
    weekday_fri: 'Cum', weekday_sat: 'Cmt', weekday_sun: 'Paz',
    // AAC ekranı
    aac_sentence_placeholder: 'Kart seç, cümle oluştur...',
    aac_searching: 'Aranıyor...',
    aac_no_results: 'Sonuç bulunamadı. Farklı bir kelime deneyin.',
    aac_connection_error: 'Bağlantı hatası. İnternet bağlantınızı kontrol edin.',
    aac_search_ph: '🔍 Kart ara...',
    aac_cat_feelings: 'Duygular',
    aac_cat_foods: 'Yiyecekler',
    aac_cat_activities: 'Etkinlikler',
    aac_cat_people: 'İnsanlar',
    aac_cat_animals: 'Hayvanlar',
    aac_cat_places: 'Yerler',
    aac_cat_symbols: 'Semboller',
    // Teacher panel / Student setup
    setup_select_student: 'Öğrenci Seç',
    setup_name_label: 'Ad',
    setup_birth_year_label: 'Doğum Yılı',
    setup_note_label: 'Not',
    setup_create_btn: 'Oluştur',
    setup_add_new_divider: 'Yeni öğrenci ekle',
    veli_consent_label: 'Bu öğrencinin velisi KVKK kapsamında bilgilendirildi ve rıza verdi.',
    // Accessibility panel
    a11y_export_label: '📥 Verilerimi İndir',
    a11y_delete_label: '🗑️ Hesabı Sil',
    a11y_privacy_label: 'Gizlilik Politikası & KVKK',
    a11y_large_text_label: 'Büyük Metin',
    a11y_large_text_hint: 'Yazı boyutunu artırır',
    a11y_high_contrast_label: 'Yüksek Kontrast',
    a11y_high_contrast_hint: 'Renkleri belirginleştirir',
    a11y_large_touch_label: 'Büyük Dokunma Hedefi',
    a11y_large_touch_hint: 'Butonları daha kolay tıklanır hale getirir',
    a11y_reduce_motion_label: 'Animasyonları Azalt',
    a11y_reduce_motion_hint: 'Hareket ve geçişleri kapatır',
    a11y_voice_label_label: 'Sesli Etiket',
    a11y_voice_label_hint: 'Her butona basıldığında sesli okur',
    // Genel / dağınık string'ler
    menu_greeting_named: 'Merhaba, {name}! 🌟',
    profile_not_entered: 'Profil girilmemiş',
    update_info_btn: 'Bilgileri Güncelle',
    // Alert/Confirm/Status mesajları
    confirm_delete_account_1: 'Hesabınız ve tüm verileriniz kalıcı olarak silinecek. Bu işlem geri alınamaz. Emin misiniz?',
    confirm_delete_account_2: 'Son kez onaylıyın: tüm öğrenci verileri, BEP kayıtları ve ilerleme bilgileri silinecek.',
    account_deleted_msg: 'Hesabınız silindi. İyi günler.',
    kvkk_confirm_required: 'Devam etmek için velinin KVKK kapsamında bilgilendirildiğini onaylayın.',
    consent_required: 'Veli onayını işaretleyin.',
    student_name_required: 'Öğrenci adı zorunlu.',
    creating_student: 'Öğrenci oluşturuluyor...',
    update_name_required: 'Güncelleme için öğrenci adı zorunlu.',
    updating_student: 'Öğrenci bilgileri güncelleniyor...',
    student_updated: 'Öğrenci bilgileri güncellendi.',
    no_students_yet: 'Henüz öğrenci eklenmemiş. Devam etmek için ilk öğrencini oluştur.',
    select_or_add_student: 'Bir öğrenciyi seçebilir ya da yeni öğrenci ekleyebilirsin.',
    // Sıra kartı oyunu geri bildirimleri
    seq_correct_order: '🎉 Harika! Doğru sıraladın!',
    seq_correct_order_speak: 'Harika! Doğru sıraladın!',
    seq_wrong_order: '❌ Bu doğru sıra değil, tekrar dene!',
    seq_try_again_speak: 'Tekrar dene!',
    seq_select_cause_first: 'Önce bir sebep seç!',
    seq_correct_match: '✅ Doğru eşleştirme!',
    seq_correct_match_speak: 'Doğru! Aferin!',
    seq_all_pairs_found: '🎉 Tüm çiftleri buldun!',
    seq_all_pairs_found_speak: 'Tüm çiftleri buldun! Harika!',
    seq_wrong_match: '❌ Bu doğru eşleşme değil!',

    therapy_daily_life_label: 'Günlük Hayat',
    therapy_daily_life_summary: 'Rutinler, ihtiyaçlar ve ev-okul yaşamı üzerine kısa konuşmalar.',
    therapy_daily_life_q1: 'Sabah uyanınca ilk ne yaparsın?',
    therapy_daily_life_goal1: 'günlük rutin anlatma',
    therapy_daily_life_q2: 'Okula giderken yanına neler alırsın?',
    therapy_daily_life_goal2: 'nesne ve rutin anlatma',
    therapy_daily_life_q3: 'Acıkınca evde ne söylersin?',
    therapy_daily_life_goal3: 'ihtiyaç ifade etme',
    therapy_daily_life_q4: 'Markete gidince en çok hangi şeyi almak istersin?',
    therapy_daily_life_goal4: 'tercih belirtme',
    therapy_daily_life_q5: 'Akşam olunca evde en sevdiğin şey nedir?',
    therapy_daily_life_goal5: 'günlük yaşamı anlatma',
    therapy_daily_life_q6: 'Dışarı çıkmadan önce hangi hazırlıkları yaparsın?',
    therapy_daily_life_goal6: 'adım sıralama',
    therapy_daily_life_q7: 'Odanda en çok hangi eşyanı kullanırsın?',
    therapy_daily_life_goal7: 'eşya tanımlama',
    therapy_daily_life_q8: 'Yemekten önce ellerin için ne yaparsın?',
    therapy_daily_life_goal8: 'özbakım rutini anlatma',
    therapy_daily_life_q9: 'Eve misafir gelince onlara ne dersin?',
    therapy_daily_life_goal9: 'günlük sosyal ifade',
    therapy_daily_life_q10: 'Bugün evde sana en çok kim yardım etti?',
    therapy_daily_life_goal10: 'olay anlatma',

    therapy_emotions_label: 'Duygular',
    therapy_emotions_summary: 'Mutlu, üzgün, heyecanlı gibi duyguları fark edip ifade etmeye odaklanır.',
    therapy_emotions_q1: 'Bugün kendini en çok nasıl hissediyorsun?',
    therapy_emotions_goal1: 'duygu ifade etme',
    therapy_emotions_q2: 'Seni en hızlı ne mutlu eder?',
    therapy_emotions_goal2: 'neden belirtme',
    therapy_emotions_q3: 'Üzüldüğünde yanında ne olsun istersin?',
    therapy_emotions_goal3: 'duygusal ihtiyaç söyleme',
    therapy_emotions_q4: 'Heyecanlanınca bedeninde neler olur?',
    therapy_emotions_goal4: 'bedensel farkındalık',
    therapy_emotions_q5: 'Korktuğunda kime haber verirsin?',
    therapy_emotions_goal5: 'yardım isteme',
    therapy_emotions_q6: 'Bir arkadaşın seni sevindirince ne hissedersin?',
    therapy_emotions_goal6: 'duyguyu ilişkilendirme',
    therapy_emotions_q7: 'Canın sıkılınca kendini rahatlatmak için ne yaparsın?',
    therapy_emotions_goal7: 'rahatlama stratejisi',
    therapy_emotions_q8: 'Bugün seni şaşırtan bir şey oldu mu?',
    therapy_emotions_goal8: 'duygu ve olay anlatma',
    therapy_emotions_q9: 'Kızgın olduğunda sesini nasıl kullanman iyi olur?',
    therapy_emotions_goal9: 'duygu düzenleme',
    therapy_emotions_q10: 'Mutlu olduğunda bunu yüzünden nasıl anlarız?',
    therapy_emotions_goal10: 'duygu farkındalığı',

    therapy_social_communication_label: 'Sosyal İletişim',
    therapy_social_communication_summary: 'Selamlaşma, yardım isteme ve arkadaşlarla konuşma becerileri.',
    therapy_social_communication_q1: 'Bir arkadaşına oyun başlarken nasıl selam verirsin?',
    therapy_social_communication_goal1: 'selamlaşma becerisi',
    therapy_social_communication_q2: 'Bir şeyi anlamazsan öğretmene ne söylersin?',
    therapy_social_communication_goal2: 'yardım isteme',
    therapy_social_communication_q3: 'Oyuna katılmak istersen arkadaşına nasıl sorarsın?',
    therapy_social_communication_goal3: 'oyuna katılma dili',
    therapy_social_communication_q4: 'Bir arkadaşın üzgün görünürse ona ne dersin?',
    therapy_social_communication_goal4: 'empati ifadesi',
    therapy_social_communication_q5: 'Sıranı beklerken nasıl davranırsın?',
    therapy_social_communication_goal5: 'sosyal kural anlatma',
    therapy_social_communication_q6: 'Yanlışlıkla birine çarparsan ne söylersin?',
    therapy_social_communication_goal6: 'özür dileme',
    therapy_social_communication_q7: 'Bir oyuncağı paylaşmak istediğinde nasıl konuşursun?',
    therapy_social_communication_goal7: 'paylaşma dili',
    therapy_social_communication_q8: 'Bir arkadaşın sana soru sorarsa nasıl cevap verirsin?',
    therapy_social_communication_goal8: 'karşılıklı konuşma',
    therapy_social_communication_q9: 'Yeni biriyle tanışınca kendini nasıl tanıtırsın?',
    therapy_social_communication_goal9: 'kendini tanıtma',
    therapy_social_communication_q10: 'Yardım ettiğin birine sonra ne demek güzel olur?',
    therapy_social_communication_goal10: 'sosyal kapanış ifadesi',

    therapy_play_sports_label: 'Oyun ve Spor',
    therapy_play_sports_summary: 'İlgi alanı üzerinden seçim yapma, karşılaştırma ve anlatım becerileri.',
    therapy_play_sports_q1: 'Parkta en çok hangi oyunu oynamayı seversin?',
    therapy_play_sports_goal1: 'tercih belirtme',
    therapy_play_sports_q2: 'Futbol mu basketbol mu sana daha eğlenceli geliyor?',
    therapy_play_sports_goal2: 'karşılaştırma yapma',
    therapy_play_sports_q3: 'Takım oyunlarında hangi görevi yapmak istersin?',
    therapy_play_sports_goal3: 'rol seçme',
    therapy_play_sports_q4: 'Evde oynadığın en sevdiğin oyun hangisi?',
    therapy_play_sports_goal4: 'oyun anlatma',
    therapy_play_sports_q5: 'Bir oyunu arkadaşınla oynarken en çok neye dikkat edersin?',
    therapy_play_sports_goal5: 'oyun kuralı anlatma',
    therapy_play_sports_q6: 'Bisiklet mi top oyunu mu seni daha çok hareket ettirir?',
    therapy_play_sports_goal6: 'karşılaştırmalı ifade',
    therapy_play_sports_q7: 'Spor yapınca bedeninde nasıl bir his olur?',
    therapy_play_sports_goal7: 'bedensel duygu anlatma',
    therapy_play_sports_q8: 'Yeni bir oyun öğrenirken önce ne yaparsın?',
    therapy_play_sports_goal8: 'adım anlatma',
    therapy_play_sports_q9: 'Top oynarken arkadaşına nasıl pas istersin?',
    therapy_play_sports_goal9: 'oyun içi iletişim',
    therapy_play_sports_q10: 'Bugün dışarı çıksan hangi sporu denemek isterdin?',
    therapy_play_sports_goal10: 'hayal kurma ve tercih',

    city_home_label: 'Ev',
    city_home_summary: 'Evdeki rutinler, ihtiyaçlar ve günlük yaşam konuşmaları.',
    city_home_description: 'Ev içindeki rutinleri, aileyle iletişimi ve temel ihtiyaç cümlelerini çalışır.',
    city_home_goal1: 'rutin anlatma',
    city_home_goal2: 'yardım isteme',
    city_home_goal3: 'özbakım dili',
    city_home_q1: 'Sabah evde ilk olarak kiminle konuşursun?',
    city_home_qgoal1: 'ev içi iletişimi anlatma',
    city_home_q2: 'Karnın acıktığında evde ne söylersin?',
    city_home_qgoal2: 'ihtiyaç ifade etme',
    city_home_q3: 'Oyuncağını bulamazsan annenden ya da babandan nasıl yardım istersin?',
    city_home_qgoal3: 'yardım isteme cümlesi kurma',
    city_home_q4: 'Akşam olunca evde en sevdiğin şey nedir?',
    city_home_qgoal4: 'günlük yaşam tercihi anlatma',
    city_home_q5: 'Yatmadan önce hangi hazırlıkları yaparsın?',
    city_home_qgoal5: 'adım sıralama',
    city_home_q6: 'Eve misafir gelince kapıda ne dersin?',
    city_home_qgoal6: 'nazik karşılama dili',
    city_home_q7: 'Üşüdüğünde evde ne istersin?',
    city_home_qgoal7: 'bedensel ihtiyacı söyleme',
    city_home_q8: 'Birlikte yemek yerken senden bir şey uzatmanı isteseler ne dersin?',
    city_home_qgoal8: 'karşılıklı konuşma',
    city_home_q9: 'Odanı toplarken hangi eşyayı yerine koyduğunu anlatır mısın?',
    city_home_qgoal9: 'eylem anlatma',
    city_home_q10: 'Evde mutlu olduğun bir anı kısaca anlatır mısın?',
    city_home_qgoal10: 'olay anlatma',

    city_school_label: 'Okul',
    city_school_summary: 'Öğretmen, arkadaş ve sınıf içi iletişim soruları.',
    city_school_description: 'Sınıf içinde kendini ifade etme, öğretmene cevap verme ve arkadaşlarla iletişim kurma çalışılır.',
    city_school_goal1: 'öğretmene cevap verme',
    city_school_goal2: 'arkadaşla konuşma',
    city_school_goal3: 'yardım isteme',
    city_school_q1: 'Sınıfa girince öğretmenine nasıl günaydın dersin?',
    city_school_qgoal1: 'selamlama',
    city_school_q2: 'Öğretmen defterini açmanı isterse ne yaparsın?',
    city_school_qgoal2: 'yönerge anlatma',
    city_school_q3: 'Dersi anlamadığında öğretmeninden nasıl yardım istersin?',
    city_school_qgoal3: 'yardım isteme',
    city_school_q4: 'Teneffüste arkadaşına oyuna katılmak için ne söylersin?',
    city_school_qgoal4: 'oyuna katılma dili',
    city_school_q5: 'Kalemini düşüren arkadaşına ne demek güzel olur?',
    city_school_qgoal5: 'destekleyici ifade',
    city_school_q6: 'Sınıfta söz almak istediğinde nasıl davranırsın?',
    city_school_qgoal6: 'sosyal kural anlatma',
    city_school_q7: 'Öğretmenin sana en sevdiğin dersi sorsa ne cevap verirsin?',
    city_school_qgoal7: 'tercih belirtme',
    city_school_q8: 'Yeni bir arkadaşla tanışırken kendini nasıl tanıtırsın?',
    city_school_qgoal8: 'kendini tanıtma',
    city_school_q9: 'Sırada beklerken bir arkadaşın önüne geçerse ne söylersin?',
    city_school_qgoal9: 'nazik sınır koyma',
    city_school_q10: 'Okuldan çıkarken öğretmenine nasıl veda edersin?',
    city_school_qgoal10: 'konuşmayı uygun kapatma',

    city_market_label: 'Market',
    city_market_summary: 'İhtiyaç söyleme, seçim yapma ve rica etme çalışmaları.',
    city_market_description: 'Market içinde ürün isteme, seçim yapma ve kısa rica cümleleri kullanma becerileri desteklenir.',
    city_market_goal1: 'ürün isteme',
    city_market_goal2: 'tercih belirtme',
    city_market_goal3: 'kısa rica cümlesi',
    city_market_q1: 'Markete girince almak istediğin ilk şeyi nasıl söylersin?',
    city_market_qgoal1: 'ürün isteme',
    city_market_q2: 'Meyve bölümünde elma mı muz mu istediğini nasıl anlatırsın?',
    city_market_qgoal2: 'tercih belirtme',
    city_market_q3: 'Sepete koymak için annenden bir şey uzatmasını nasıl istersin?',
    city_market_qgoal3: 'rica etme',
    city_market_q4: 'Kasada beklerken sıranı nasıl korursun?',
    city_market_qgoal4: 'sosyal kural anlatma',
    city_market_q5: 'Bir ürün çok yukarıdaysa market görevlisine ne dersin?',
    city_market_qgoal5: 'yardım isteme',
    city_market_q6: 'Canın atıştırmalık istediğinde bunu nasıl anlatırsın?',
    city_market_qgoal6: 'ihtiyaç ifade etme',
    city_market_q7: 'Süt ile meyve suyu arasında seçim yaparken ne söylersin?',
    city_market_qgoal7: 'karşılaştırma',
    city_market_q8: 'Aldığın şey için teşekkür etmek istesen ne dersin?',
    city_market_qgoal8: 'nazik kapanış',
    city_market_q9: 'Poşeti taşımakta zorlanırsan nasıl yardım istersin?',
    city_market_qgoal9: 'yardım talebi',
    city_market_q10: 'Marketten eve götürmek istediğin üç şeyi söyler misin?',
    city_market_qgoal10: 'listeleme',

    city_park_label: 'Park',
    city_park_summary: 'Oyun, spor, takım olma ve arkadaşlık konuşmaları.',
    city_park_description: 'Parkta oyun başlatma, spor tercihi yapma ve arkadaşlarla konuşma cümleleri öne çıkar.',
    city_park_goal1: 'oyun başlatma',
    city_park_goal2: 'spor tercihi',
    city_park_goal3: 'arkadaşla konuşma',
    city_park_q1: 'Parka gidince ilk hangi oyunu oynamak istersin?',
    city_park_qgoal1: 'tercih belirtme',
    city_park_q2: 'Bir arkadaşını salıncağa çağırmak için ne söylersin?',
    city_park_qgoal2: 'oyuna davet etme',
    city_park_q3: 'Top oynamak istersen arkadaşından nasıl pas istersin?',
    city_park_qgoal3: 'oyun içi iletişim',
    city_park_q4: 'Parkta sıra beklerken nasıl davranırsın?',
    city_park_qgoal4: 'sıra alma becerisi',
    city_park_q5: 'Koşunca ya da zıplayınca bedeninde nasıl bir his olur?',
    city_park_qgoal5: 'bedensel farkındalık',
    city_park_q6: 'Arkadaşın oyunu bırakmak isterse ona ne dersin?',
    city_park_qgoal6: 'karşılıklı konuşma',
    city_park_q7: 'Futbol mu saklambaç mı sana daha eğlenceli geliyor?',
    city_park_qgoal7: 'karşılaştırma yapma',
    city_park_q8: 'Yeni bir oyun öğretmek istersen önce ne söylersin?',
    city_park_qgoal8: 'yönerge verme',
    city_park_q9: 'Parkta düşen bir arkadaşını görünce ne yaparsın?',
    city_park_qgoal9: 'empatik ifade',
    city_park_q10: 'Parktan ayrılırken arkadaşlarına nasıl veda edersin?',
    city_park_qgoal10: 'uygun kapanış cümlesi',

    city_hospital_label: 'Hastane',
    city_hospital_summary: 'Duygu, beden farkındalığı ve yardım isteme konuşmaları.',
    city_hospital_description: 'Kendini iyi hissetmediğinde duygunu, bedenindeki rahatsızlığı ve ihtiyacını söyleme çalışılır.',
    city_hospital_goal1: 'duygu söyleme',
    city_hospital_goal2: 'beden farkındalığı',
    city_hospital_goal3: 'yardım isteme',
    city_hospital_q1: 'Hastaneye geldiğinde kendini nasıl hissediyorsun?',
    city_hospital_qgoal1: 'duygu ifade etme',
    city_hospital_q2: 'Karnın ağrıyorsa bunu doktora nasıl anlatırsın?',
    city_hospital_qgoal2: 'bedensel durumu söyleme',
    city_hospital_q3: 'İğneden korkarsan yanında ne olmasını istersin?',
    city_hospital_qgoal3: 'duygusal ihtiyaç belirtme',
    city_hospital_q4: 'Doktor sana bir soru sorunca nasıl cevap verirsin?',
    city_hospital_qgoal4: 'soruya uygun yanıt verme',
    city_hospital_q5: 'Canın acıyınca hemşireden nasıl yardım istersin?',
    city_hospital_qgoal5: 'yardım isteme',
    city_hospital_q6: 'Muayeneden sonra rahatladığında ne söylersin?',
    city_hospital_qgoal6: 'duyguyu güncelleme',
    city_hospital_q7: 'Beklerken sıkıldıysan annene ya da babana ne dersin?',
    city_hospital_qgoal7: 'ihtiyaç ifade etme',
    city_hospital_q8: 'Üşüdüğünde battaniye istemek için ne söylersin?',
    city_hospital_qgoal8: 'kısa rica kurma',
    city_hospital_q9: 'Doktor sana iyi misin diye sorarsa ne dersin?',
    city_hospital_qgoal9: 'durumu değerlendirme',
    city_hospital_q10: 'Hastaneden çıkarken doktora nasıl teşekkür edersin?',
    city_hospital_qgoal10: 'nazik kapanış',
  },
  en: {
    back_menu: '← Menu',
    back: '← Back',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    yes: 'Yes',
    no: 'No',
    close: 'Close',
    ok: 'OK',
    loading: 'Loading...',
    error: 'Error',
    login_title: 'Star Class',
    login_subtitle: 'Digital support for special education',
    login_username: 'Username',
    login_password: 'Password',
    login_btn: 'Sign In',
    register_btn: 'Register',
    guest_btn: 'Continue as guest',
    login_tab: 'Sign In',
    register_tab: 'Register',
    consent_label: 'I have obtained parental/guardian consent to process student data',
    setup_title: 'Student Information',
    setup_name: 'Student name',
    setup_age: 'Age',
    setup_level: 'Support level',
    setup_btn: 'Start',
    menu_greeting_default: 'Hello!',
    menu_therapy: 'Speech Practice',
    menu_schedule: 'Daily Schedule',
    menu_skills: 'Skill Tracking',
    menu_behavior: 'Behavior',
    menu_bep: 'IEP',
    menu_report: 'Report',
    menu_aac: 'AAC',
    menu_sequence: 'Sorting Games',
    menu_sort: 'Sorting',
    menu_analysis: 'Analysis',
    therapy_title: 'Speech Practice',
    therapy_hint: 'Getting ready...',
    sort_title: 'Sorting',
    sort_subtitle: 'Drag objects into the correct basket!',
    sort_back: '← Game Selection',
    sort_correct: 'Great!',
    sort_wrong: 'Try again!',
    sort_complete_title: 'Congratulations!',
    sort_complete_msg: 'You sorted all objects correctly!',
    sort_play_again: 'Play Again',
    sort_other_game: 'Other Game',
    sort_perfect: '🌟 Perfect!',
    report_title: 'Report',
    report_generate: 'Generate Report',
    bep_title: 'IEP Draft',
    bep_generate: 'Generate IEP Draft',
    bep_disclaimer: '⚠️ This draft is for guidance only. It must be reviewed by a licensed special education specialist.',
    aac_title: 'AAC Board',
    sequence_title: 'Sorting Games',
    skills_title: 'Skill Tracking',
    behavior_title: 'Behavior Tracking',
    a11y_title: '⚙️ Accessibility',
    a11y_large_text: 'Large Text',
    a11y_large_text_desc: 'Increases font size',
    a11y_high_contrast: 'High Contrast',
    a11y_high_contrast_desc: 'Increases color contrast',
    a11y_reduce_motion: 'Reduce Motion',
    a11y_reduce_motion_desc: 'Disables animations',
    a11y_large_touch: 'Large Touch',
    a11y_large_touch_desc: 'Increases button size',
    a11y_export: '📥 Export My Data',
    a11y_delete: '🗑️ Delete Account',
    a11y_privacy: 'Privacy Policy & KVKK',
    lang_toggle: 'TR',
    sort_game1_title: 'Animal or Vehicle?',
    sort_game2_title: 'Food or Toy?',
    sort_game3_title: 'Outside or Inside?',
    sort_game4_title: 'Big or Small?',
    sort_cat_animals: 'Animals',
    sort_cat_vehicles: 'Vehicles',
    sort_cat_food: 'Foods',
    sort_cat_toys: 'Toys',
    sort_cat_outside: 'Outside',
    sort_cat_inside: 'Inside',
    sort_cat_big: 'Big',
    sort_cat_small: 'Small',
    item_cat: 'Cat', item_car: 'Car', item_dog: 'Dog', item_plane: 'Plane',
    item_bird: 'Bird', item_ship: 'Ship', item_fish: 'Fish', item_bike: 'Bicycle',
    item_lion: 'Lion', item_helicopter: 'Helicopter',
    item_apple: 'Apple', item_teddy: 'Teddy Bear', item_pizza: 'Pizza', item_ball: 'Ball',
    item_banana: 'Banana', item_gamepad: 'Gamepad', item_ice_cream: 'Ice Cream',
    item_paint: 'Paint Set', item_cake: 'Cake', item_target: 'Target Board',
    item_flower: 'Flower', item_sofa: 'Sofa', item_cloud: 'Cloud', item_tv: 'TV',
    item_tree: 'Tree', item_bed: 'Bed', item_sea: 'Sea', item_chair: 'Chair',
    item_tent: 'Tent', item_computer: 'Computer',
    item_elephant: 'Elephant', item_mouse: 'Mouse', item_house: 'House', item_bee: 'Bee',
    item_airplane2: 'Airplane', item_ant: 'Ant', item_ring: 'Ring',
    item_world: 'Earth', item_butterfly: 'Butterfly',
    score_label: 'pts',
    sort_items_count: 'items',
    sort_tries: 'tries',
    choose_student: 'Select or add a student',
    add_new_student: '+ Add New Student',
    student_placeholder: 'Student name',
    age_label: 'Age',
    level_label: 'Support level',
    level1: 'Mild',
    level2: 'Moderate',
    level3: 'Severe',
    start_btn: 'Start',
    teacher_panel: 'Teacher Panel',
    teacher_pin: 'Enter PIN',
    teacher_enter: 'Enter',
    teacher_wrong_pin: 'Wrong PIN!',
    change_student: 'Change Student',
    thinking: 'Thinking...',
    mic_start: 'Microphone',
    send_btn: 'Send',
    session_end: 'End Session',
    back_to_menu: '← Back to Menu',
    report_no_data: 'No data yet.',
    report_session: 'Session',
    report_duration: 'Duration',
    report_messages: 'Messages',
    generating: 'Generating...',
    bep_generate_btn: 'Generate IEP Draft',
    bep_copy: 'Copy',
    bep_copied: 'Copied!',
    add_skill: '+ Add Skill',
    skill_name_ph: 'Skill name',
    skill_goal_ph: 'Goal',
    skill_save: 'Save',
    skill_trial: 'Add Trial',
    add_behavior: '+ Add Behavior',
    behavior_name_ph: 'Behavior name',
    behavior_freq: 'Frequency',
    confirm_delete: 'Are you sure you want to delete?',
    data_saved: 'Saved',
    copy_success: 'Copied',
    no_student: 'No student selected',
    // Schedule screen
    schedule_empty: 'No activities added yet.',
    schedule_help: 'Use the "+ Add Activity" button to build this student\'s schedule.',
    schedule_progress: '{done} / {total} completed',
    schedule_activity_done: '{label} completed!',
    schedule_undo: 'Undo',
    schedule_mark_done: 'Mark as completed',
    schedule_delete: 'Delete',
    schedule_activity_ph: 'Activity name',
    // Skills screen
    skill_mastered: 'Mastered!',
    skill_learning_status: 'Learning',
    skill_reset: 'Reset',
    skill_legend_not_started: '⬜ Not started',
    skill_legend_learning: '🔄 Learning',
    skill_legend_mastered: '✅ Mastered',
    // Behavior screen
    behavior_empty: 'No records yet.',
    behavior_added: 'Record added!',
    behavior_duration_unit: '{duration} min',
    behavior_delete: 'Delete',
    behavior_label: 'Behavior',
    behavior_what_happened_ph: 'What happened?',
    behavior_antecedent_label: 'Antecedent (A)',
    behavior_consequence_label: 'Consequence (C)',
    behavior_frequency_label: 'Frequency',
    behavior_duration_label: 'Duration (min)',
    // BEP/IEP screen
    bep_preparing: '⏳ Preparing draft...',
    bep_draft_failed: 'Could not generate draft. The Gemini API did not respond.',
    bep_error_prefix: 'Error: ',
    bep_copied_btn: '✓ Copied!',
    bep_copy_btn: '📋 Copy Text',
    bep_periodic_title: 'Periodic IEP Draft',
    bep_periodic_sub: 'Generates a draft text that can be transferred into the IEP using session data. It must be reviewed by the authorized team.',
    bep_disclaimer_short: '⚠️ This text is a draft. It must be reviewed and approved by the authorized team (teacher, specialist, parent) for the official IEP.',
    bep_disclaimer_full: '⚠️ DRAFT DOCUMENT — This text was generated by AI. It must be reviewed by the authorized IEP team (teacher, specialist, school administration, parent) before it can be used as an official IEP document.',
    // Report screen
    report_generated_at: 'Report generated on: {date}',
    report_minutes: '{minutes} min',
    report_no_usage_days: 'No recorded usage days yet.',
    report_no_city_sessions: 'No city-based therapy session has been done yet.',
    report_general_area: 'General area',
    report_top_area: 'Most active area',
    report_top_area_summary: 'With {count} questions, this area was the most worked-on conversation point.',
    report_location_count: '{count} different places',
    report_general_speech: 'General conversation',
    report_question_prefix: 'Question: ',
    report_no_records: 'No records',
    report_no_session_for_day: 'No recorded session for this day.',
    report_session_summary: '{count} session records • {minutes} min total duration • {turns} total responses • {mic} microphone uses',
    report_speech_practice: 'Speech practice',
    report_story_speech_practice: '{story} + speech practice',
    report_session_detail: '{minutes} min • {turns} responses • {mic} microphone • Story progress: {progress}',
    report_completed: 'Completed',
    report_records_count: '{count} records',
    report_title_full: 'Parent Progress Report',
    report_history_section_title: 'Usage History Calendar',
    report_history_section_sub: 'You can review which days the app was used and the session details for each day here.',
    report_learning_area_plan: '📚 Learning Area Plan',
    report_city_summary: '🏙️ City Summary',
    weekday_mon: 'Mon', weekday_tue: 'Tue', weekday_wed: 'Wed', weekday_thu: 'Thu',
    weekday_fri: 'Fri', weekday_sat: 'Sat', weekday_sun: 'Sun',
    // AAC screen
    aac_sentence_placeholder: 'Pick a card, build a sentence...',
    aac_searching: 'Searching...',
    aac_no_results: 'No results found. Try a different word.',
    aac_connection_error: 'Connection error. Please check your internet connection.',
    aac_search_ph: '🔍 Search cards...',
    aac_cat_feelings: 'Feelings',
    aac_cat_foods: 'Foods',
    aac_cat_activities: 'Activities',
    aac_cat_people: 'People',
    aac_cat_animals: 'Animals',
    aac_cat_places: 'Places',
    aac_cat_symbols: 'Symbols',
    // Teacher panel / Student setup
    setup_select_student: 'Select Student',
    setup_name_label: 'Name',
    setup_birth_year_label: 'Birth Year',
    setup_note_label: 'Note',
    setup_create_btn: 'Create',
    setup_add_new_divider: 'Add new student',
    veli_consent_label: "I confirm that this student's parent/guardian has been informed and has given consent under KVKK.",
    // Accessibility panel
    a11y_export_label: '📥 Export My Data',
    a11y_delete_label: '🗑️ Delete Account',
    a11y_privacy_label: 'Privacy Policy & KVKK',
    a11y_large_text_label: 'Large Text',
    a11y_large_text_hint: 'Increases font size',
    a11y_high_contrast_label: 'High Contrast',
    a11y_high_contrast_hint: 'Makes colors more distinct',
    a11y_large_touch_label: 'Large Touch Target',
    a11y_large_touch_hint: 'Makes buttons easier to tap',
    a11y_reduce_motion_label: 'Reduce Motion',
    a11y_reduce_motion_hint: 'Turns off animations and transitions',
    a11y_voice_label_label: 'Voice Label',
    a11y_voice_label_hint: 'Reads aloud whenever a button is pressed',
    // General / misc strings
    menu_greeting_named: 'Hello, {name}! 🌟',
    profile_not_entered: 'Profile not entered',
    update_info_btn: 'Update Information',
    // Alert/Confirm/Status messages
    confirm_delete_account_1: 'Your account and all your data will be permanently deleted. This action cannot be undone. Are you sure?',
    confirm_delete_account_2: 'Final confirmation: all student data, IEP records, and progress information will be deleted.',
    account_deleted_msg: 'Your account has been deleted. Have a nice day.',
    kvkk_confirm_required: 'To continue, please confirm that the parent has been informed under KVKK.',
    consent_required: 'Please check the parental consent.',
    student_name_required: 'Student name is required.',
    creating_student: 'Creating student...',
    update_name_required: 'Student name is required to update.',
    updating_student: 'Updating student information...',
    student_updated: 'Student information updated.',
    no_students_yet: 'No students added yet. Create your first student to continue.',
    select_or_add_student: 'You can select a student or add a new one.',
    // Sequence game feedback
    seq_correct_order: '🎉 Great! You sequenced it correctly!',
    seq_correct_order_speak: 'Great! You sequenced it correctly!',
    seq_wrong_order: '❌ That\'s not the right order, try again!',
    seq_try_again_speak: 'Try again!',
    seq_select_cause_first: 'Select a cause first!',
    seq_correct_match: '✅ Correct match!',
    seq_correct_match_speak: 'Correct! Well done!',
    seq_all_pairs_found: '🎉 You found all the pairs!',
    seq_all_pairs_found_speak: 'You found all the pairs! Great job!',
    seq_wrong_match: '❌ That\'s not the right match!',

    therapy_daily_life_label: 'Daily Life',
    therapy_daily_life_summary: 'Short conversations about routines, needs, and home-school life.',
    therapy_daily_life_q1: 'What\'s the first thing you do when you wake up?',
    therapy_daily_life_goal1: 'describing a daily routine',
    therapy_daily_life_q2: 'What do you bring with you when you go to school?',
    therapy_daily_life_goal2: 'naming objects and routines',
    therapy_daily_life_q3: 'What do you say at home when you\'re hungry?',
    therapy_daily_life_goal3: 'expressing a need',
    therapy_daily_life_q4: 'What\'s the thing you most want to get at the store?',
    therapy_daily_life_goal4: 'stating a preference',
    therapy_daily_life_q5: 'What\'s your favorite thing to do at home in the evening?',
    therapy_daily_life_goal5: 'describing daily life',
    therapy_daily_life_q6: 'What do you get ready before going outside?',
    therapy_daily_life_goal6: 'sequencing steps',
    therapy_daily_life_q7: 'Which thing in your room do you use the most?',
    therapy_daily_life_goal7: 'describing objects',
    therapy_daily_life_q8: 'What do you do with your hands before eating?',
    therapy_daily_life_goal8: 'describing a self-care routine',
    therapy_daily_life_q9: 'What do you say when guests come to your house?',
    therapy_daily_life_goal9: 'everyday social expression',
    therapy_daily_life_q10: 'Who helped you the most at home today?',
    therapy_daily_life_goal10: 'recounting an event',

    therapy_emotions_label: 'Emotions',
    therapy_emotions_summary: 'Focuses on noticing and expressing feelings like happy, sad, and excited.',
    therapy_emotions_q1: 'How are you feeling today?',
    therapy_emotions_goal1: 'expressing emotion',
    therapy_emotions_q2: 'What makes you happy the fastest?',
    therapy_emotions_goal2: 'giving a reason',
    therapy_emotions_q3: 'When you\'re sad, what do you want to have nearby?',
    therapy_emotions_goal3: 'naming an emotional need',
    therapy_emotions_q4: 'What happens in your body when you get excited?',
    therapy_emotions_goal4: 'bodily awareness',
    therapy_emotions_q5: 'Who do you tell when you\'re scared?',
    therapy_emotions_goal5: 'asking for help',
    therapy_emotions_q6: 'How do you feel when a friend makes you happy?',
    therapy_emotions_goal6: 'connecting an emotion to a cause',
    therapy_emotions_q7: 'What do you do to calm down when you\'re bored?',
    therapy_emotions_goal7: 'using a calming strategy',
    therapy_emotions_q8: 'Did anything surprise you today?',
    therapy_emotions_goal8: 'describing emotion and event',
    therapy_emotions_q9: 'What\'s a good way to use your voice when you\'re angry?',
    therapy_emotions_goal9: 'emotion regulation',
    therapy_emotions_q10: 'How can we tell from your face that you\'re happy?',
    therapy_emotions_goal10: 'emotion awareness',

    therapy_social_communication_label: 'Social Communication',
    therapy_social_communication_summary: 'Skills for greeting, asking for help, and talking with friends.',
    therapy_social_communication_q1: 'How do you greet a friend when you start playing?',
    therapy_social_communication_goal1: 'greeting skills',
    therapy_social_communication_q2: 'What do you tell your teacher when you don\'t understand something?',
    therapy_social_communication_goal2: 'asking for help',
    therapy_social_communication_q3: 'How do you ask a friend if you can join their game?',
    therapy_social_communication_goal3: 'language for joining play',
    therapy_social_communication_q4: 'What do you say to a friend who looks sad?',
    therapy_social_communication_goal4: 'expressing empathy',
    therapy_social_communication_q5: 'How do you behave while waiting for your turn?',
    therapy_social_communication_goal5: 'explaining a social rule',
    therapy_social_communication_q6: 'What do you say if you bump into someone by accident?',
    therapy_social_communication_goal6: 'apologizing',
    therapy_social_communication_q7: 'What do you say when you want to share a toy?',
    therapy_social_communication_goal7: 'language for sharing',
    therapy_social_communication_q8: 'How do you answer when a friend asks you a question?',
    therapy_social_communication_goal8: 'reciprocal conversation',
    therapy_social_communication_q9: 'How do you introduce yourself to someone new?',
    therapy_social_communication_goal9: 'self-introduction',
    therapy_social_communication_q10: 'What\'s a nice thing to say after you\'ve helped someone?',
    therapy_social_communication_goal10: 'closing a social exchange',

    therapy_play_sports_label: 'Play & Sports',
    therapy_play_sports_summary: 'Skills for choosing, comparing, and describing things based on interests.',
    therapy_play_sports_q1: 'What\'s your favorite game to play at the park?',
    therapy_play_sports_goal1: 'stating a preference',
    therapy_play_sports_q2: 'Do you find football or basketball more fun?',
    therapy_play_sports_goal2: 'making a comparison',
    therapy_play_sports_q3: 'Which role would you like to play in a team game?',
    therapy_play_sports_goal3: 'choosing a role',
    therapy_play_sports_q4: 'What\'s your favorite game to play at home?',
    therapy_play_sports_goal4: 'describing a game',
    therapy_play_sports_q5: 'What do you pay attention to most when playing a game with a friend?',
    therapy_play_sports_goal5: 'explaining game rules',
    therapy_play_sports_q6: 'Does riding a bike or playing ball get you moving more?',
    therapy_play_sports_goal6: 'comparative expression',
    therapy_play_sports_q7: 'How does your body feel after playing sports?',
    therapy_play_sports_goal7: 'describing a bodily feeling',
    therapy_play_sports_q8: 'What do you do first when learning a new game?',
    therapy_play_sports_goal8: 'describing steps',
    therapy_play_sports_q9: 'How do you ask a friend to pass the ball while playing?',
    therapy_play_sports_goal9: 'in-game communication',
    therapy_play_sports_q10: 'If you went outside today, which sport would you want to try?',
    therapy_play_sports_goal10: 'imagining and stating a preference',

    city_home_label: 'Home',
    city_home_summary: 'Conversations about routines, needs, and daily life at home.',
    city_home_description: 'Practices routines around the house, communicating with family, and basic need sentences.',
    city_home_goal1: 'describing a routine',
    city_home_goal2: 'asking for help',
    city_home_goal3: 'self-care language',
    city_home_q1: 'Who do you talk to first at home in the morning?',
    city_home_qgoal1: 'describing communication at home',
    city_home_q2: 'What do you say at home when your tummy is hungry?',
    city_home_qgoal2: 'expressing a need',
    city_home_q3: 'How do you ask Mom or Dad for help when you can\'t find your toy?',
    city_home_qgoal3: 'forming a request for help',
    city_home_q4: 'What\'s your favorite thing to do at home in the evening?',
    city_home_qgoal4: 'describing a daily preference',
    city_home_q5: 'What do you get ready before going to bed?',
    city_home_qgoal5: 'sequencing steps',
    city_home_q6: 'What do you say at the door when a guest arrives?',
    city_home_qgoal6: 'polite greeting language',
    city_home_q7: 'What do you ask for at home when you\'re cold?',
    city_home_qgoal7: 'stating a physical need',
    city_home_q8: 'What do you say if someone asks you to pass something during dinner?',
    city_home_qgoal8: 'reciprocal conversation',
    city_home_q9: 'Can you tell me which toy you put away while tidying your room?',
    city_home_qgoal9: 'describing an action',
    city_home_q10: 'Can you tell me about a happy moment you had at home?',
    city_home_qgoal10: 'recounting an event',

    city_school_label: 'School',
    city_school_summary: 'Questions about the teacher, friends, and communicating in class.',
    city_school_description: 'Practices expressing yourself in class, answering the teacher, and talking with friends.',
    city_school_goal1: 'answering the teacher',
    city_school_goal2: 'talking with a friend',
    city_school_goal3: 'asking for help',
    city_school_q1: 'How do you say good morning to your teacher when you walk into class?',
    city_school_qgoal1: 'greeting',
    city_school_q2: 'What do you do when the teacher asks you to open your notebook?',
    city_school_qgoal2: 'following instructions',
    city_school_q3: 'How do you ask your teacher for help when you don\'t understand the lesson?',
    city_school_qgoal3: 'asking for help',
    city_school_q4: 'What do you say to a friend at recess to join their game?',
    city_school_qgoal4: 'language for joining play',
    city_school_q5: 'What\'s a nice thing to say to a friend who dropped their pencil?',
    city_school_qgoal5: 'supportive expression',
    city_school_q6: 'How do you behave when you want to speak up in class?',
    city_school_qgoal6: 'explaining a social rule',
    city_school_q7: 'What would you say if your teacher asked about your favorite subject?',
    city_school_qgoal7: 'stating a preference',
    city_school_q8: 'How do you introduce yourself when meeting a new friend?',
    city_school_qgoal8: 'self-introduction',
    city_school_q9: 'What do you say if a friend cuts in line in front of you?',
    city_school_qgoal9: 'setting a polite boundary',
    city_school_q10: 'How do you say goodbye to your teacher when leaving school?',
    city_school_qgoal10: 'properly closing a conversation',

    city_market_label: 'Grocery Store',
    city_market_summary: 'Practice naming needs, making choices, and making polite requests.',
    city_market_description: 'Builds skills for asking for items, choosing, and making short polite requests at the store.',
    city_market_goal1: 'asking for an item',
    city_market_goal2: 'stating a preference',
    city_market_goal3: 'short polite request',
    city_market_q1: 'How do you say the first thing you want to get when you walk into the store?',
    city_market_qgoal1: 'asking for an item',
    city_market_q2: 'How do you say whether you want an apple or a banana in the fruit section?',
    city_market_qgoal2: 'stating a preference',
    city_market_q3: 'How do you ask Mom to hand you something to put in the cart?',
    city_market_qgoal3: 'making a request',
    city_market_q4: 'How do you keep your place while waiting at the checkout?',
    city_market_qgoal4: 'explaining a social rule',
    city_market_q5: 'What do you say to a store worker if an item is too high up?',
    city_market_qgoal5: 'asking for help',
    city_market_q6: 'How do you say it when you want a snack?',
    city_market_qgoal6: 'expressing a need',
    city_market_q7: 'What do you say when choosing between milk and juice?',
    city_market_qgoal7: 'making a comparison',
    city_market_q8: 'What do you say if you want to thank someone for what you bought?',
    city_market_qgoal8: 'polite closing',
    city_market_q9: 'How do you ask for help if you\'re struggling to carry the bag?',
    city_market_qgoal9: 'requesting help',
    city_market_q10: 'Can you name three things you want to take home from the store?',
    city_market_qgoal10: 'listing',

    city_park_label: 'Park',
    city_park_summary: 'Conversations about play, sports, teamwork, and friendship.',
    city_park_description: 'Highlights sentences for starting a game, choosing a sport, and talking with friends at the park.',
    city_park_goal1: 'starting a game',
    city_park_goal2: 'sport preference',
    city_park_goal3: 'talking with a friend',
    city_park_q1: 'What\'s the first game you want to play when you get to the park?',
    city_park_qgoal1: 'stating a preference',
    city_park_q2: 'What do you say to invite a friend to the swings?',
    city_park_qgoal2: 'inviting someone to play',
    city_park_q3: 'How do you ask a friend to pass the ball if you want to play?',
    city_park_qgoal3: 'in-game communication',
    city_park_q4: 'How do you behave while waiting your turn at the park?',
    city_park_qgoal4: 'turn-taking skills',
    city_park_q5: 'How does your body feel when you run or jump?',
    city_park_qgoal5: 'bodily awareness',
    city_park_q6: 'What do you say to a friend who wants to stop playing?',
    city_park_qgoal6: 'reciprocal conversation',
    city_park_q7: 'Do you find football or hide-and-seek more fun?',
    city_park_qgoal7: 'making a comparison',
    city_park_q8: 'What do you say first if you want to teach a friend a new game?',
    city_park_qgoal8: 'giving instructions',
    city_park_q9: 'What do you do when you see a friend fall down at the park?',
    city_park_qgoal9: 'empathetic expression',
    city_park_q10: 'How do you say goodbye to your friends when leaving the park?',
    city_park_qgoal10: 'appropriate closing sentence',

    city_hospital_label: 'Hospital',
    city_hospital_summary: 'Conversations about emotions, body awareness, and asking for help.',
    city_hospital_description: 'Practices naming feelings, describing discomfort in the body, and stating needs when you don\'t feel well.',
    city_hospital_goal1: 'naming a feeling',
    city_hospital_goal2: 'body awareness',
    city_hospital_goal3: 'asking for help',
    city_hospital_q1: 'How do you feel when you arrive at the hospital?',
    city_hospital_qgoal1: 'expressing emotion',
    city_hospital_q2: 'How do you tell the doctor if your tummy hurts?',
    city_hospital_qgoal2: 'describing a physical state',
    city_hospital_q3: 'If you\'re scared of a shot, what do you want to have nearby?',
    city_hospital_qgoal3: 'stating an emotional need',
    city_hospital_q4: 'How do you answer when the doctor asks you a question?',
    city_hospital_qgoal4: 'answering a question appropriately',
    city_hospital_q5: 'How do you ask the nurse for help when something hurts?',
    city_hospital_qgoal5: 'asking for help',
    city_hospital_q6: 'What do you say when you feel relieved after the check-up?',
    city_hospital_qgoal6: 'updating an emotion',
    city_hospital_q7: 'What do you tell Mom or Dad if you\'re bored while waiting?',
    city_hospital_qgoal7: 'expressing a need',
    city_hospital_q8: 'What do you say to ask for a blanket when you\'re cold?',
    city_hospital_qgoal8: 'forming a short request',
    city_hospital_q9: 'What do you say if the doctor asks whether you\'re okay?',
    city_hospital_qgoal9: 'assessing a state',
    city_hospital_q10: 'How do you thank the doctor when leaving the hospital?',
    city_hospital_qgoal10: 'polite closing',
  }
};

let _lang = localStorage.getItem('lms_lang') || (navigator.language && navigator.language.startsWith('tr') ? 'tr' : 'en');

function t(key) {
  return (STRINGS[_lang] && STRINGS[_lang][key]) || (STRINGS.tr[key]) || key;
}

function setLang(lang) {
  _lang = lang;
  localStorage.setItem('lms_lang', lang);
  applyLang();
}

function applyLang() {
  document.documentElement.lang = _lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (el.tagName === 'INPUT' && el.placeholder !== undefined) {
      el.placeholder = val;
    } else {
      el.textContent = val;
    }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });
  const langBtn = document.getElementById('langToggleBtn');
  if (langBtn) langBtn.textContent = t('lang_toggle');
}

// =============================================

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

const API_BASE = (typeof Capacitor !== 'undefined' && Capacitor.isNativePlatform())
    ? 'https://ozel-egitim.vercel.app'
    : '';

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
    simplifyByCategory: {},
    noResponseByCategory: {},
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
    if (!analyserNode) return;
    const { wrapper, lipOuter, lipInner } = getActiveLipsyncElements();
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

        // 3D avatar morph targets
        if (window.avatar3d) {
            window.avatar3d.clearVisemes();
            if (viseme === 'open') window.avatar3d.setViseme('viseme_aa', Math.min(1, openAmount / 8));
            else if (viseme === 'mid') window.avatar3d.setViseme('viseme_aa', Math.min(0.45, openAmount / 5));
        }

        // SVG fallback (eğer varsa)
        if (wrapper) wrapper.dataset.viseme = viseme;
        if (lipOuter && lipInner) {
            const rx = viseme === 'open' ? 13 : (viseme === 'mid' ? 11.2 : 10);
            const ry = viseme === 'open' ? 10.5 : (viseme === 'mid' ? 6 : 3.2);
            lipOuter.setAttribute('ry', ry.toFixed(1));
            lipOuter.setAttribute('rx', rx.toFixed(1));
            lipInner.setAttribute('ry', viseme === 'open' ? '6.8' : (viseme === 'mid' ? '3.2' : '0.8'));
            lipInner.style.opacity = viseme === 'closed' ? '0' : '1';
        }
    }
    animate();
}

function stopLipsync() {
    if (lipsyncRaf) cancelAnimationFrame(lipsyncRaf);
    lipsyncRaf = null;
    if (window.avatar3d) window.avatar3d.clearVisemes();
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
    const screens = ['start-screen','student-setup-screen','menu-screen','game-container','report-screen','sort-screen',
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
    try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.getVoices();
        const warmup = new SpeechSynthesisUtterance(" ");
        warmup.volume = 0;
        window.speechSynthesis.speak(warmup);
    } catch(e) {}
    try { initAudioContext(); audioCtx.resume(); } catch(e) {}

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
        sessionData.simplifyByCategory = {};
        sessionData.noResponseByCategory = {};
        sessionData.reportEntryId = null;
    }

    document.getElementById('menu-greeting').textContent = t('menu_greeting_named').replace('{name}', childName);
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
let sessionTotalQuestions = 0;

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
        const res = await fetch(API_BASE + '/api/chat', {
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
    sessionTotalQuestions = unaskedQuestions.length;

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
        updateBtn.textContent = t('update_info_btn');
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
                    <strong>YıldızCan</strong>
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
        titleEl.textContent = t('no_student');
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
        statusEl.textContent = t('no_students_yet');
        return;
    }

    statusEl.textContent = t('select_or_add_student');
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

    const veliConsent = document.getElementById('setupVeliConsent');
    if (veliConsent && !veliConsent.checked) {
        statusEl.textContent = t('consent_required');
        return;
    }

    const fullName = nameEl.value.trim();
    const birthYearRaw = yearEl.value.trim();
    const supportNotes = notesEl.value.trim();
    if (!fullName) {
        statusEl.textContent = t('student_name_required');
        return;
    }

    createBtn.disabled = true;
    statusEl.textContent = t('creating_student');
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
        statusEl.textContent = t('update_name_required');
        return;
    }

    updateBtn.disabled = true;
    statusEl.textContent = t('updating_student');
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
    statusEl.textContent = t('student_updated');
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

function updateAdaptiveState() {
    if (!activeStudentId || !hasSessionActivity()) return;
    const key = 'adaptive_' + activeStudentId;
    const existing = DB.getSync(key) || {};
    const catStats = existing.categoryStats || {};

    sessionData.therapyTurns.forEach(t => {
        const c = t.category || 'Diğer';
        if (!catStats[c]) catStats[c] = { turns: 0, simplify: 0, noResponse: 0 };
        catStats[c].turns++;
    });
    Object.entries(sessionData.simplifyByCategory || {}).forEach(([c, n]) => {
        if (!catStats[c]) catStats[c] = { turns: 0, simplify: 0, noResponse: 0 };
        catStats[c].simplify += n;
    });
    Object.entries(sessionData.noResponseByCategory || {}).forEach(([c, n]) => {
        if (!catStats[c]) catStats[c] = { turns: 0, simplify: 0, noResponse: 0 };
        catStats[c].noResponse += n;
    });

    DB.set(key, {
        categoryStats: catStats,
        simplifyTotal: (existing.simplifyTotal || 0) + (sessionData.simplifyUsed || 0),
        totalTurns: (existing.totalTurns || 0) + sessionData.therapyTurns.length,
        totalSessions: (existing.totalSessions || 0) + 1,
        updatedAt: new Date().toISOString(),
    });
}

async function persistSessionSnapshot() {
    if (!hasSessionActivity()) return loadReportHistory();
    updateAdaptiveState();

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
        detailEl.innerHTML = `<p class="report-empty">${t('report_no_session_for_day')}</p>`;
        return;
    }

    const totalMinutes = entries.reduce((sum, entry) => sum + (entry.durationMin || 0), 0);
    const totalTurns = entries.reduce((sum, entry) => sum + (entry.totalTurns || 0), 0);
    const totalMic = entries.reduce((sum, entry) => sum + (entry.totalMic || 0), 0);

    detailEl.innerHTML = `
        <div class="history-detail-card">
            <h4>${formatHistoryDate(dateKey)}</h4>
            <div class="history-detail-meta">
                ${t('report_session_summary')
                    .replace('{count}', entries.length)
                    .replace('{minutes}', totalMinutes)
                    .replace('{turns}', totalTurns)
                    .replace('{mic}', totalMic)}
            </div>
        </div>
        <div class="history-session-list">
            ${entries.map(entry => `
                <div class="history-session-item">
                    <div class="history-session-top">
                        <strong>${entry.storyName ? t('report_story_speech_practice').replace('{story}', escapeHtml(entry.storyName)) : t('report_speech_practice')}</strong>
                        <span class="history-session-time">${new Date(entry.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div class="history-session-summary">
                        ${t('report_session_detail')
                            .replace('{minutes}', entry.durationMin)
                            .replace('{turns}', entry.totalTurns)
                            .replace('{mic}', entry.totalMic)
                            .replace('{progress}', entry.storyCompleted ? t('report_completed') : entry.storyPct)}
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
            <span class="calendar-day-meta">${useCount ? t('report_records_count').replace('{count}', useCount) : ''}</span>
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
        if (monthLabel) monthLabel.textContent = t('report_no_records');
        if (detailEl) detailEl.innerHTML = `<p class="report-empty">${t('report_no_usage_days')}</p>`;
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
        container.innerHTML = `<p class="report-empty">${t('report_no_city_sessions')}</p>`;
        return;
    }

    const locationMap = new Map();
    turns.forEach((turn) => {
        const key = turn.location || t('report_general_area');
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
                <span class="city-session-kicker">${t('report_top_area')}</span>
                <strong>${topLocation[0]}</strong>
                <p>${t('report_top_area_summary').replace('{count}', topLocation[1].count)}</p>
            </div>
            <div class="city-session-meta">${t('report_location_count').replace('{count}', sortedLocations.length)}</div>
        </div>
        <div class="city-session-grid">
            ${sortedLocations.map(([label, data]) => `
                <article class="city-session-card">
                    <h4>${label}</h4>
                    <p>${data.count} soru • ${[...data.categories].join(', ') || t('report_general_speech')}</p>
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
        t('report_generated_at').replace('{date}', now.toLocaleString('tr-TR'));

    // Süre
    const durationMs = sessionData.startTime ? Date.now() - sessionData.startTime : 0;
    const durationMin = Math.max(1, Math.round(durationMs / 60000));
    document.getElementById('statDuration').textContent = t('report_minutes').replace('{minutes}', durationMin);

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
        sessionData.therapyTurns.forEach(turn => {
            const entry = document.createElement('div');
            entry.className = 'therapy-entry';
            entry.innerHTML = `<div class="therapy-q">🎙️ ${turn.location ? `${escapeHtml(turn.location)} • ` : ''}${turn.category ? `${escapeHtml(turn.category)} • ` : ''}${t('report_question_prefix')}${escapeHtml(turn.question)}</div>${escapeHtml(turn.answer)}`;
            therapyEl.appendChild(entry);
        });
    }

    // AI değerlendirmesi
    document.getElementById('aiEvalLoading').style.display = 'flex';
    document.getElementById('aiEvalText').style.display = 'none';
    await generateAIEvaluation(durationMin, totalMic, storyPct, totalTurns);
}

function _buildAdaptiveContextText() {
    if (!activeStudentId) return null;
    const adaptive = DB.getSync('adaptive_' + activeStudentId) || {};
    const cats = Object.entries(adaptive.categoryStats || {}).filter(([, s]) => s.turns > 0);
    if (!cats.length) return null;
    return cats.map(([cat, s]) => {
        const simPct = Math.round((s.simplify / s.turns) * 100);
        const nrPct  = Math.round((s.noResponse / s.turns) * 100);
        return `- ${cat}: ${s.turns} tur, %${simPct} dil desteği ihtiyacı, %${nrPct} yanıtsız`;
    }).join('\n');
}

function _buildIEPContextText() {
    if (!activeStudentId) return null;
    const goals = DB.getSync('iep_' + activeStudentId) || [];
    if (!goals.length) return null;
    return goals.slice(0, 6).map(g => {
        const trials = DB.getSync('trials_' + g.id) || [];
        const pct = calcGoalPct(trials);
        const domain = IEP_DOMAINS.find(d => d.id === g.domain);
        return `- ${domain ? domain.label : 'Alan'}: "${g.goalText}" → %${pct} (hedef: %${g.targetPct})`;
    }).join('\n');
}

function _buildSkillsContextText() {
    if (!activeStudentId) return null;
    const map = DB.getSync('skills_' + activeStudentId) || {};
    if (!Object.keys(map).length) return null;
    const lines = Object.entries(SKILL_MAP).map(([domainId, domain]) => {
        const mastered = domain.skills.filter((_, i) => map[`${domainId}:${i}`] === 'mastered').length;
        const learning = domain.skills.filter((_, i) => map[`${domainId}:${i}`] === 'learning').length;
        if (mastered + learning === 0) return null;
        return `- ${domain.label}: ${mastered} kazanıldı, ${learning} öğreniliyor (${domain.skills.length} beceriden)`;
    }).filter(Boolean);
    return lines.length ? lines.join('\n') : null;
}

async function generateAIEvaluation(durationMin, totalMic, storyPct, totalTurns) {
    const choices = sessionData.storyChoices.map(c =>
        `- "${c.sceneLabel}" sahnesinde "${c.choice}" seçti`).join('\n') || 'Henüz hikaye oturumu yok.';

    const therapySample = sessionData.therapyTurns.slice(0, 5).map(t =>
        `Soru: "${t.question}" → Cevap: "${t.answer}"`).join('\n') || 'Terapi oturumu yok.';

    const _adaptiveText = _buildAdaptiveContextText();
    const _iepText      = _buildIEPContextText();
    const _skillsText   = _buildSkillsContextText();

    let _contextBlock = '';
    if (_adaptiveText) _contextBlock += `\nKATEGORİ PERFORMANSI (geçmiş seans toplamı):\n${_adaptiveText}\n`;
    if (_iepText)      _contextBlock += `\nIEP/BEP HEDEFLERİ:\n${_iepText}\n`;
    if (_skillsText)   _contextBlock += `\nBECERİ HARİTASI:\n${_skillsText}\n`;

    const prompt = `Sen özel eğitim ve konuşma terapisi alanında uzman, empati dolu bir asistansın.
Aşağıdaki veriler, bir öğrencinin Yıldız Can uygulamasındaki oturum verisidir.

Oturum süresi: ${durationMin} dakika
Toplam yanıt sayısı: ${totalTurns}
Mikrofon kullanım sayısı: ${totalMic}
Hikaye ilerlemesi: ${storyPct}
Hikaye tamamlandı mı: ${sessionData.storyCompleted ? 'Evet' : 'Hayır'}
${_contextBlock}
Hikayede yapılan seçimler:
${choices}

Konuşma terapisinden örnekler:
${therapySample}

Lütfen veliye hitap ederek, 3-4 paragraf halinde şunları içeren sevecen ve profesyonel bir Türkçe değerlendirme yaz:
1. Çocuğun bu oturumdaki genel katılımı ve motivasyonu
2. Hikayedeki seçimlerden gözlemlenen sosyal/duygusal ipuçları
3. Konuşma ve iletişim açısından dikkat çeken noktalar
4. ${_adaptiveText || _iepText ? 'Kategori/hedef verilerini referans alarak aileye kategori düzeyinde somut öneriler (ör. hangi temalar evde pekiştirilmeli) ve teşvik edici bir kapanış' : 'Aileye somut öneriler ve teşvik edici bir kapanış'}

Kesinlikle emoji kullanma. Sıcak, profesyonel ve umut verici bir dil kullan.`;

    try {
        const res = await fetch(API_BASE + '/api/chat', {
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
const _FALLBACK_VIDEOS = [
    'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4',
    'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flicker-of-hope.mp4',
];
function _pickFallbackVideo() {
    return _FALLBACK_VIDEOS[Math.floor(Math.random() * _FALLBACK_VIDEOS.length)];
}
function _loadFallbackVideo(vEl) {
    vEl.muted = true;
    vEl.setAttribute('playsinline', '');
    vEl.src = _pickFallbackVideo();
    vEl.load();
    const t = setTimeout(function() { startQuestion(); }, 5000);
    vEl.onloadeddata = function() {
        clearTimeout(t);
        vEl.play().catch(function() {});
        setTimeout(function() { startQuestion(); }, 1200);
    };
    vEl.onerror = function() { clearTimeout(t); startQuestion(); };
}
const THERAPY_CATEGORIES = {
    daily_life: {
        emoji: '🏠',
        get label() { return t('therapy_daily_life_label'); },
        get summary() { return t('therapy_daily_life_summary'); },
        questions: [
            { get q() { return t('therapy_daily_life_q1'); }, query: "child morning routine home", get goal() { return t('therapy_daily_life_goal1'); } },
            { get q() { return t('therapy_daily_life_q2'); }, query: "child getting ready backpack school", get goal() { return t('therapy_daily_life_goal2'); } },
            { get q() { return t('therapy_daily_life_q3'); }, query: "family kitchen child asking food", get goal() { return t('therapy_daily_life_goal3'); } },
            { get q() { return t('therapy_daily_life_q4'); }, query: "child with parent grocery store", get goal() { return t('therapy_daily_life_goal4'); } },
            { get q() { return t('therapy_daily_life_q5'); }, query: "family evening home child smiling", get goal() { return t('therapy_daily_life_goal5'); } },
            { get q() { return t('therapy_daily_life_q6'); }, query: "child putting on shoes jacket", get goal() { return t('therapy_daily_life_goal6'); } },
            { get q() { return t('therapy_daily_life_q7'); }, query: "child room toys books", get goal() { return t('therapy_daily_life_goal7'); } },
            { get q() { return t('therapy_daily_life_q8'); }, query: "child washing hands sink", get goal() { return t('therapy_daily_life_goal8'); } },
            { get q() { return t('therapy_daily_life_q9'); }, query: "family visiting child greeting", get goal() { return t('therapy_daily_life_goal9'); } },
            { get q() { return t('therapy_daily_life_q10'); }, query: "parent helping child at home", get goal() { return t('therapy_daily_life_goal10'); } }
        ]
    },
    emotions: {
        emoji: '😊',
        get label() { return t('therapy_emotions_label'); },
        get summary() { return t('therapy_emotions_summary'); },
        questions: [
            { get q() { return t('therapy_emotions_q1'); }, query: "child face expression happy calm", get goal() { return t('therapy_emotions_goal1'); } },
            { get q() { return t('therapy_emotions_q2'); }, query: "happy child playing family", get goal() { return t('therapy_emotions_goal2'); } },
            { get q() { return t('therapy_emotions_q3'); }, query: "child comfort emotional support", get goal() { return t('therapy_emotions_goal3'); } },
            { get q() { return t('therapy_emotions_q4'); }, query: "excited child jumping smiling", get goal() { return t('therapy_emotions_goal4'); } },
            { get q() { return t('therapy_emotions_q5'); }, query: "child seeking comfort parent", get goal() { return t('therapy_emotions_goal5'); } },
            { get q() { return t('therapy_emotions_q6'); }, query: "friends hugging happy child", get goal() { return t('therapy_emotions_goal6'); } },
            { get q() { return t('therapy_emotions_q7'); }, query: "child calming down quiet activity", get goal() { return t('therapy_emotions_goal7'); } },
            { get q() { return t('therapy_emotions_q8'); }, query: "surprised child classroom", get goal() { return t('therapy_emotions_goal8'); } },
            { get q() { return t('therapy_emotions_q9'); }, query: "child taking deep breath calm", get goal() { return t('therapy_emotions_goal9'); } },
            { get q() { return t('therapy_emotions_q10'); }, query: "child smiling face close up", get goal() { return t('therapy_emotions_goal10'); } }
        ]
    },
    social_communication: {
        emoji: '🤝',
        get label() { return t('therapy_social_communication_label'); },
        get summary() { return t('therapy_social_communication_summary'); },
        questions: [
            { get q() { return t('therapy_social_communication_q1'); }, query: "children greeting playground", get goal() { return t('therapy_social_communication_goal1'); } },
            { get q() { return t('therapy_social_communication_q2'); }, query: "child asking teacher classroom", get goal() { return t('therapy_social_communication_goal2'); } },
            { get q() { return t('therapy_social_communication_q3'); }, query: "children inviting to play", get goal() { return t('therapy_social_communication_goal3'); } },
            { get q() { return t('therapy_social_communication_q4'); }, query: "child comforting friend school", get goal() { return t('therapy_social_communication_goal4'); } },
            { get q() { return t('therapy_social_communication_q5'); }, query: "children waiting in line school", get goal() { return t('therapy_social_communication_goal5'); } },
            { get q() { return t('therapy_social_communication_q6'); }, query: "kids apologizing playground", get goal() { return t('therapy_social_communication_goal6'); } },
            { get q() { return t('therapy_social_communication_q7'); }, query: "children sharing toy", get goal() { return t('therapy_social_communication_goal7'); } },
            { get q() { return t('therapy_social_communication_q8'); }, query: "children talking together classroom", get goal() { return t('therapy_social_communication_goal8'); } },
            { get q() { return t('therapy_social_communication_q9'); }, query: "child introducing self friendly", get goal() { return t('therapy_social_communication_goal9'); } },
            { get q() { return t('therapy_social_communication_q10'); }, query: "kids helping each other smiling", get goal() { return t('therapy_social_communication_goal10'); } }
        ]
    },
    play_sports: {
        emoji: '⚽',
        get label() { return t('therapy_play_sports_label'); },
        get summary() { return t('therapy_play_sports_summary'); },
        questions: [
            { get q() { return t('therapy_play_sports_q1'); }, query: "children playing in park", get goal() { return t('therapy_play_sports_goal1'); } },
            { get q() { return t('therapy_play_sports_q2'); }, query: "kids football basketball playground", get goal() { return t('therapy_play_sports_goal2'); } },
            { get q() { return t('therapy_play_sports_q3'); }, query: "children team game outdoors", get goal() { return t('therapy_play_sports_goal3'); } },
            { get q() { return t('therapy_play_sports_q4'); }, query: "child indoor game home", get goal() { return t('therapy_play_sports_goal4'); } },
            { get q() { return t('therapy_play_sports_q5'); }, query: "kids playing together sharing", get goal() { return t('therapy_play_sports_goal5'); } },
            { get q() { return t('therapy_play_sports_q6'); }, query: "children cycling and ball game", get goal() { return t('therapy_play_sports_goal6'); } },
            { get q() { return t('therapy_play_sports_q7'); }, query: "active child running smiling", get goal() { return t('therapy_play_sports_goal7'); } },
            { get q() { return t('therapy_play_sports_q8'); }, query: "child learning game rules", get goal() { return t('therapy_play_sports_goal8'); } },
            { get q() { return t('therapy_play_sports_q9'); }, query: "children passing ball teamwork", get goal() { return t('therapy_play_sports_goal9'); } },
            { get q() { return t('therapy_play_sports_q10'); }, query: "child trying sports outdoors", get goal() { return t('therapy_play_sports_goal10'); } }
        ]
    }
};

const CITY_LOCATIONS = {
    home: {
        get label() { return t('city_home_label'); },
        category: 'daily_life',
        get summary() { return t('city_home_summary'); },
        get description() { return t('city_home_description'); },
        get goals() { return [t('city_home_goal1'), t('city_home_goal2'), t('city_home_goal3')]; },
        questions: [
            { get q() { return t('city_home_q1'); }, query: "child morning at home with family", get goal() { return t('city_home_qgoal1'); } },
            { get q() { return t('city_home_q2'); }, query: "child asking for food at home", get goal() { return t('city_home_qgoal2'); } },
            { get q() { return t('city_home_q3'); }, query: "parent helping child find toy at home", get goal() { return t('city_home_qgoal3'); } },
            { get q() { return t('city_home_q4'); }, query: "family evening at home child smiling", get goal() { return t('city_home_qgoal4'); } },
            { get q() { return t('city_home_q5'); }, query: "child bedtime routine brushing teeth", get goal() { return t('city_home_qgoal5'); } },
            { get q() { return t('city_home_q6'); }, query: "child greeting guest at home", get goal() { return t('city_home_qgoal6'); } },
            { get q() { return t('city_home_q7'); }, query: "child asking for blanket at home", get goal() { return t('city_home_qgoal7'); } },
            { get q() { return t('city_home_q8'); }, query: "family dinner child speaking politely", get goal() { return t('city_home_qgoal8'); } },
            { get q() { return t('city_home_q9'); }, query: "child organizing room toys books", get goal() { return t('city_home_qgoal9'); } },
            { get q() { return t('city_home_q10'); }, query: "happy child home family moment", get goal() { return t('city_home_qgoal10'); } }
        ]
    },
    school: {
        get label() { return t('city_school_label'); },
        category: 'social_communication',
        get summary() { return t('city_school_summary'); },
        get description() { return t('city_school_description'); },
        get goals() { return [t('city_school_goal1'), t('city_school_goal2'), t('city_school_goal3')]; },
        questions: [
            { get q() { return t('city_school_q1'); }, query: "child greeting teacher classroom morning", get goal() { return t('city_school_qgoal1'); } },
            { get q() { return t('city_school_q2'); }, query: "teacher giving instruction to child in classroom", get goal() { return t('city_school_qgoal2'); } },
            { get q() { return t('city_school_q3'); }, query: "child asking teacher for help classroom", get goal() { return t('city_school_qgoal3'); } },
            { get q() { return t('city_school_q4'); }, query: "children talking in schoolyard", get goal() { return t('city_school_qgoal4'); } },
            { get q() { return t('city_school_q5'); }, query: "child helping classmate pencil classroom", get goal() { return t('city_school_qgoal5'); } },
            { get q() { return t('city_school_q6'); }, query: "child raising hand in classroom", get goal() { return t('city_school_qgoal6'); } },
            { get q() { return t('city_school_q7'); }, query: "teacher and child talking about lessons", get goal() { return t('city_school_qgoal7'); } },
            { get q() { return t('city_school_q8'); }, query: "child introducing self at school", get goal() { return t('city_school_qgoal8'); } },
            { get q() { return t('city_school_q9'); }, query: "children waiting in line at school", get goal() { return t('city_school_qgoal9'); } },
            { get q() { return t('city_school_q10'); }, query: "child saying goodbye to teacher", get goal() { return t('city_school_qgoal10'); } }
        ]
    },
    market: {
        get label() { return t('city_market_label'); },
        category: 'daily_life',
        get summary() { return t('city_market_summary'); },
        get description() { return t('city_market_description'); },
        get goals() { return [t('city_market_goal1'), t('city_market_goal2'), t('city_market_goal3')]; },
        questions: [
            { get q() { return t('city_market_q1'); }, query: "child in grocery store asking for item", get goal() { return t('city_market_qgoal1'); } },
            { get q() { return t('city_market_q2'); }, query: "child choosing fruit in market", get goal() { return t('city_market_qgoal2'); } },
            { get q() { return t('city_market_q3'); }, query: "parent and child shopping together", get goal() { return t('city_market_qgoal3'); } },
            { get q() { return t('city_market_q4'); }, query: "family waiting at grocery checkout", get goal() { return t('city_market_qgoal4'); } },
            { get q() { return t('city_market_q5'); }, query: "store worker helping child in supermarket", get goal() { return t('city_market_qgoal5'); } },
            { get q() { return t('city_market_q6'); }, query: "child asking snack at market", get goal() { return t('city_market_qgoal6'); } },
            { get q() { return t('city_market_q7'); }, query: "child deciding drink in market aisle", get goal() { return t('city_market_qgoal7'); } },
            { get q() { return t('city_market_q8'); }, query: "child saying thank you cashier store", get goal() { return t('city_market_qgoal8'); } },
            { get q() { return t('city_market_q9'); }, query: "child asking help carrying grocery bag", get goal() { return t('city_market_qgoal9'); } },
            { get q() { return t('city_market_q10'); }, query: "shopping basket groceries child speaking", get goal() { return t('city_market_qgoal10'); } }
        ]
    },
    park: {
        get label() { return t('city_park_label'); },
        category: 'play_sports',
        get summary() { return t('city_park_summary'); },
        get description() { return t('city_park_description'); },
        get goals() { return [t('city_park_goal1'), t('city_park_goal2'), t('city_park_goal3')]; },
        questions: [
            { get q() { return t('city_park_q1'); }, query: "children choosing game in park", get goal() { return t('city_park_qgoal1'); } },
            { get q() { return t('city_park_q2'); }, query: "children at playground talking", get goal() { return t('city_park_qgoal2'); } },
            { get q() { return t('city_park_q3'); }, query: "kids passing ball in park", get goal() { return t('city_park_qgoal3'); } },
            { get q() { return t('city_park_q4'); }, query: "children waiting for slide in park", get goal() { return t('city_park_qgoal4'); } },
            { get q() { return t('city_park_q5'); }, query: "active child running in park", get goal() { return t('city_park_qgoal5'); } },
            { get q() { return t('city_park_q6'); }, query: "children talking after game in park", get goal() { return t('city_park_qgoal6'); } },
            { get q() { return t('city_park_q7'); }, query: "children playing football and hide and seek", get goal() { return t('city_park_qgoal7'); } },
            { get q() { return t('city_park_q8'); }, query: "child explaining game rules to friend", get goal() { return t('city_park_qgoal8'); } },
            { get q() { return t('city_park_q9'); }, query: "child helping friend who fell at park", get goal() { return t('city_park_qgoal9'); } },
            { get q() { return t('city_park_q10'); }, query: "children leaving park saying goodbye", get goal() { return t('city_park_qgoal10'); } }
        ]
    },
    hospital: {
        get label() { return t('city_hospital_label'); },
        category: 'emotions',
        get summary() { return t('city_hospital_summary'); },
        get description() { return t('city_hospital_description'); },
        get goals() { return [t('city_hospital_goal1'), t('city_hospital_goal2'), t('city_hospital_goal3')]; },
        questions: [
            { get q() { return t('city_hospital_q1'); }, query: "child at hospital waiting room calm", get goal() { return t('city_hospital_qgoal1'); } },
            { get q() { return t('city_hospital_q2'); }, query: "doctor listening to child patient", get goal() { return t('city_hospital_qgoal2'); } },
            { get q() { return t('city_hospital_q3'); }, query: "child seeking comfort hospital", get goal() { return t('city_hospital_qgoal3'); } },
            { get q() { return t('city_hospital_q4'); }, query: "doctor and child talking gently", get goal() { return t('city_hospital_qgoal4'); } },
            { get q() { return t('city_hospital_q5'); }, query: "nurse helping child in hospital", get goal() { return t('city_hospital_qgoal5'); } },
            { get q() { return t('city_hospital_q6'); }, query: "child relieved after doctor visit", get goal() { return t('city_hospital_qgoal6'); } },
            { get q() { return t('city_hospital_q7'); }, query: "family in hospital waiting room", get goal() { return t('city_hospital_qgoal7'); } },
            { get q() { return t('city_hospital_q8'); }, query: "child asking for blanket hospital", get goal() { return t('city_hospital_qgoal8'); } },
            { get q() { return t('city_hospital_q9'); }, query: "doctor checking child wellness", get goal() { return t('city_hospital_qgoal9'); } },
            { get q() { return t('city_hospital_q10'); }, query: "child thanking doctor after appointment", get goal() { return t('city_hospital_qgoal10'); } }
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
// SINIFLANDIRMA OYUNU (SÜRÜKLE & BIRAK)
// =============================================
const SORT_GAMES = [
    {
        key: 'animals-vehicles',
        get title() { return t('sort_game1_title'); },
        icon: '🐾',
        categories: [
            { key: 'hayvan', get label() { return t('sort_cat_animals'); }, emoji: '🐾', color: '#d4edda' },
            { key: 'arac',   get label() { return t('sort_cat_vehicles'); }, emoji: '🚗', color: '#d1ecf1' }
        ],
        items: [
            { emoji: '🐱', get label() { return t('item_cat'); },        cat: 'hayvan' },
            { emoji: '🚗', get label() { return t('item_car'); },        cat: 'arac'   },
            { emoji: '🐶', get label() { return t('item_dog'); },        cat: 'hayvan' },
            { emoji: '✈️', get label() { return t('item_plane'); },      cat: 'arac'   },
            { emoji: '🐦', get label() { return t('item_bird'); },       cat: 'hayvan' },
            { emoji: '🚢', get label() { return t('item_ship'); },       cat: 'arac'   },
            { emoji: '🐠', get label() { return t('item_fish'); },       cat: 'hayvan' },
            { emoji: '🚲', get label() { return t('item_bike'); },       cat: 'arac'   },
            { emoji: '🦁', get label() { return t('item_lion'); },       cat: 'hayvan' },
            { emoji: '🚁', get label() { return t('item_helicopter'); }, cat: 'arac'   },
        ]
    },
    {
        key: 'food-toys',
        get title() { return t('sort_game2_title'); },
        icon: '🍎',
        categories: [
            { key: 'yiyecek', get label() { return t('sort_cat_food'); },  emoji: '🍽️', color: '#fff3cd' },
            { key: 'oyuncak', get label() { return t('sort_cat_toys'); },  emoji: '🧸', color: '#fce4ec' }
        ],
        items: [
            { emoji: '🍎', get label() { return t('item_apple'); },      cat: 'yiyecek' },
            { emoji: '🧸', get label() { return t('item_teddy'); },      cat: 'oyuncak' },
            { emoji: '🍕', get label() { return t('item_pizza'); },      cat: 'yiyecek' },
            { emoji: '⚽', get label() { return t('item_ball'); },       cat: 'oyuncak' },
            { emoji: '🍌', get label() { return t('item_banana'); },     cat: 'yiyecek' },
            { emoji: '🎮', get label() { return t('item_gamepad'); },    cat: 'oyuncak' },
            { emoji: '🍦', get label() { return t('item_ice_cream'); },  cat: 'yiyecek' },
            { emoji: '🎨', get label() { return t('item_paint'); },      cat: 'oyuncak' },
            { emoji: '🍰', get label() { return t('item_cake'); },       cat: 'yiyecek' },
            { emoji: '🎯', get label() { return t('item_target'); },     cat: 'oyuncak' },
        ]
    },
    {
        key: 'nature-home',
        get title() { return t('sort_game3_title'); },
        icon: '🌳',
        categories: [
            { key: 'disari', get label() { return t('sort_cat_outside'); }, emoji: '🌳', color: '#d4edda' },
            { key: 'iceri',  get label() { return t('sort_cat_inside'); },  emoji: '🏠', color: '#e8d5f5' }
        ],
        items: [
            { emoji: '🌻', get label() { return t('item_flower'); },    cat: 'disari' },
            { emoji: '🛋️', get label() { return t('item_sofa'); },     cat: 'iceri'  },
            { emoji: '⛅', get label() { return t('item_cloud'); },     cat: 'disari' },
            { emoji: '📺', get label() { return t('item_tv'); },        cat: 'iceri'  },
            { emoji: '🌲', get label() { return t('item_tree'); },      cat: 'disari' },
            { emoji: '🛏️', get label() { return t('item_bed'); },      cat: 'iceri'  },
            { emoji: '🌊', get label() { return t('item_sea'); },       cat: 'disari' },
            { emoji: '🪑', get label() { return t('item_chair'); },     cat: 'iceri'  },
            { emoji: '⛺', get label() { return t('item_tent'); },      cat: 'disari' },
            { emoji: '🖥️', get label() { return t('item_computer'); }, cat: 'iceri'  },
        ]
    },
    {
        key: 'big-small',
        get title() { return t('sort_game4_title'); },
        icon: '🐘',
        categories: [
            { key: 'buyuk', get label() { return t('sort_cat_big'); },   emoji: '🐘', color: '#d1ecf1' },
            { key: 'kucuk', get label() { return t('sort_cat_small'); }, emoji: '🐭', color: '#fff3cd' }
        ],
        items: [
            { emoji: '🐘', get label() { return t('item_elephant'); },  cat: 'buyuk' },
            { emoji: '🐭', get label() { return t('item_mouse'); },     cat: 'kucuk' },
            { emoji: '🏠', get label() { return t('item_house'); },     cat: 'buyuk' },
            { emoji: '🐝', get label() { return t('item_bee'); },       cat: 'kucuk' },
            { emoji: '✈️', get label() { return t('item_airplane2'); }, cat: 'buyuk' },
            { emoji: '🐜', get label() { return t('item_ant'); },       cat: 'kucuk' },
            { emoji: '💍', get label() { return t('item_ring'); },      cat: 'kucuk' },
            { emoji: '🌍', get label() { return t('item_world'); },     cat: 'buyuk' },
            { emoji: '🦋', get label() { return t('item_butterfly'); }, cat: 'kucuk' },
            { emoji: '🚢', get label() { return t('item_ship'); },      cat: 'buyuk' },
        ]
    }
];

let _sortGame = null;
let _sortItems = [];
let _sortSorted = {};
let _sortErrors = 0;
let _sortSelected = null;
let _dragGhost = null;
let _dragOriginEl = null;
let _dragItemIndex = null;
let _dragStartX = 0;
let _dragStartY = 0;
let _dragMoved = false;

function goToSort() {
    showOnly('sort-screen');
    renderSortMenu();
}

function renderSortMenu() {
    _sortGame = null;
    _sortSelected = null;
    const menuSection = document.getElementById('sortMenuSection');
    const gameSection = document.getElementById('sortGameSection');
    if (menuSection) menuSection.style.display = 'block';
    if (gameSection) gameSection.style.display = 'none';
    const grid = document.getElementById('sortMenuGrid');
    if (!grid) return;
    grid.innerHTML = SORT_GAMES.map(g => `
        <button type="button" class="sort-menu-card" onclick="startSortGame('${g.key}')">
            <div class="sort-menu-icon">${g.icon}</div>
            <strong>${g.title}</strong>
            <p>${g.categories.map(c => c.emoji + ' ' + c.label).join(' & ')}</p>
        </button>
    `).join('');
}

function startSortGame(key) {
    _sortGame = SORT_GAMES.find(g => g.key === key);
    if (!_sortGame) return;
    _sortItems = [..._sortGame.items].sort(() => Math.random() - 0.5);
    _sortSorted = {};
    _sortErrors = 0;
    _sortSelected = null;
    const menuSection = document.getElementById('sortMenuSection');
    const gameSection = document.getElementById('sortGameSection');
    if (menuSection) menuSection.style.display = 'none';
    if (gameSection) {
        gameSection.style.display = 'block';
        gameSection.innerHTML = `
            <div class="sort-header-row">
                <h3 class="sort-game-title" id="sortGameTitle"></h3>
                <div class="sort-score" id="sortScore">0 / 0</div>
            </div>
            <div class="sort-items-area" id="sortItemsArea"></div>
            <div class="sort-baskets-area" id="sortBasketsArea"></div>
            <button type="button" class="menu-ghost-btn sort-back-btn" onclick="renderSortMenu()">${t('sort_back')}</button>
        `;
    }
    const titleEl = document.getElementById('sortGameTitle');
    if (titleEl) titleEl.textContent = _sortGame.title;
    renderSortGame();
    speakFallback(_sortGame.title + '!', () => {});
}

function renderSortGame() {
    _renderSortItems();
    _renderSortBaskets();
    _updateSortScore();
}

function _renderSortItems() {
    const area = document.getElementById('sortItemsArea');
    if (!area || !_sortGame) return;
    area.innerHTML = _sortItems.map((item, i) => {
        const sorted = _sortSorted[i] !== undefined;
        const selected = _sortSelected === i;
        return `<button type="button"
            class="sort-item${sorted ? ' sort-item-done' : ''}${selected ? ' sort-item-selected' : ''}"
            data-index="${i}"
            ${sorted ? 'disabled' : ''}
            ontouchstart="_sortPointerDown(event,${i})"
            onmousedown="_sortPointerDown(event,${i})"
            onclick="_sortTap(${i})">
            <span class="sort-item-emoji">${item.emoji}</span>
            <span class="sort-item-label">${item.label}</span>
            ${sorted ? '<span class="sort-item-check">✓</span>' : ''}
        </button>`;
    }).join('');
}

function _renderSortBaskets() {
    const area = document.getElementById('sortBasketsArea');
    if (!area || !_sortGame) return;
    area.innerHTML = _sortGame.categories.map(cat => {
        const count = Object.values(_sortSorted).filter(c => c === cat.key).length;
        return `<div class="sort-basket" data-cat="${cat.key}" style="background:${cat.color}"
            onclick="_sortBasketTap('${cat.key}')">
            <div class="sort-basket-emoji">${cat.emoji}</div>
            <div class="sort-basket-label">${cat.label}</div>
            <div class="sort-basket-count">${count > 0 ? count : ''}</div>
        </div>`;
    }).join('');
}

function _updateSortScore() {
    const el = document.getElementById('sortScore');
    if (el) el.textContent = `${Object.keys(_sortSorted).length} / ${_sortItems.length}`;
}

function _sortTap(idx) {
    if (_dragMoved) { _dragMoved = false; return; }
    if (_sortSorted[idx] !== undefined) return;
    _sortSelected = (_sortSelected === idx) ? null : idx;
    _renderSortItems();
}

function _sortBasketTap(cat) {
    if (_sortSelected === null) return;
    _checkSortDrop(_sortSelected, cat);
    _sortSelected = null;
}

function _sortPointerDown(e, idx) {
    if (e.type === 'mousedown' && e.button !== 0) return;
    if (_sortSorted[idx] !== undefined) return;
    e.preventDefault();
    e.stopPropagation();
    const pt = e.touches ? e.touches[0] : e;
    _dragItemIndex = idx;
    _dragOriginEl = e.currentTarget;
    _dragStartX = pt.clientX;
    _dragStartY = pt.clientY;
    _dragMoved = false;
    document.addEventListener('mousemove', _onSortDragMove, { passive: false });
    document.addEventListener('touchmove', _onSortDragMove, { passive: false });
    document.addEventListener('mouseup', _onSortDragEnd);
    document.addEventListener('touchend', _onSortDragEnd);
}

function _onSortDragMove(e) {
    e.preventDefault();
    const pt = e.touches ? e.touches[0] : e;
    const dx = pt.clientX - _dragStartX;
    const dy = pt.clientY - _dragStartY;
    if (!_dragMoved && Math.sqrt(dx * dx + dy * dy) > 8) {
        _dragMoved = true;
        _dragGhost = document.createElement('div');
        _dragGhost.className = 'sort-drag-ghost';
        _dragGhost.textContent = _sortItems[_dragItemIndex].emoji;
        document.body.appendChild(_dragGhost);
        if (_dragOriginEl) _dragOriginEl.style.opacity = '0.3';
    }
    if (_dragGhost) {
        _dragGhost.style.left = (pt.clientX - 44) + 'px';
        _dragGhost.style.top  = (pt.clientY - 44) + 'px';
        document.querySelectorAll('.sort-basket').forEach(b => {
            const r = b.getBoundingClientRect();
            b.classList.toggle('sort-basket-hover',
                pt.clientX >= r.left && pt.clientX <= r.right &&
                pt.clientY >= r.top  && pt.clientY <= r.bottom);
        });
    }
}

function _onSortDragEnd(e) {
    document.removeEventListener('mousemove', _onSortDragMove);
    document.removeEventListener('touchmove', _onSortDragMove);
    document.removeEventListener('mouseup', _onSortDragEnd);
    document.removeEventListener('touchend', _onSortDragEnd);
    document.querySelectorAll('.sort-basket').forEach(b => b.classList.remove('sort-basket-hover'));
    if (_dragGhost) { _dragGhost.remove(); _dragGhost = null; }
    if (_dragOriginEl) { _dragOriginEl.style.opacity = ''; _dragOriginEl = null; }
    if (!_dragMoved) { _dragItemIndex = null; return; }
    const pt = e.changedTouches ? e.changedTouches[0] : e;
    let droppedCat = null;
    document.querySelectorAll('.sort-basket').forEach(b => {
        const r = b.getBoundingClientRect();
        if (pt.clientX >= r.left && pt.clientX <= r.right &&
            pt.clientY >= r.top  && pt.clientY <= r.bottom) droppedCat = b.dataset.cat;
    });
    if (droppedCat && _dragItemIndex !== null) _checkSortDrop(_dragItemIndex, droppedCat);
    _dragItemIndex = null;
    _dragMoved = false;
}

function _checkSortDrop(idx, cat) {
    const item = _sortItems[idx];
    if (!item) return;
    if (item.cat === cat) {
        _sortSorted[idx] = cat;
        speakFallback(t('sort_correct') + ' ' + item.label + '!', () => {});
        confetti({ particleCount: 25, spread: 40, origin: { y: 0.7 }, scalar: 0.8 });
        renderSortGame();
        if (Object.keys(_sortSorted).length === _sortItems.length) setTimeout(_showSortComplete, 600);
    } else {
        _sortErrors++;
        speakFallback(t('sort_wrong'), () => {});
        const el = document.querySelector(`.sort-item[data-index="${idx}"]`);
        if (el) { el.classList.add('sort-item-shake'); setTimeout(() => el.classList.remove('sort-item-shake'), 500); }
    }
}

function _showSortComplete() {
    const gameSection = document.getElementById('sortGameSection');
    if (!gameSection) return;
    confetti({ particleCount: 120, spread: 90 });
    speakFallback(t('sort_complete_title') + ' Çok güzel yaptın!', () => {});
    gameSection.innerHTML = `
        <div class="sort-complete">
            <div class="sort-complete-icon">🏆</div>
            <h2>${t('sort_complete_title')}</h2>
            <p>${t('sort_complete_msg')}</p>
            <div class="sort-complete-stats">
                <span>✓ ${_sortItems.length} ${t('sort_items_count')}</span>
                ${_sortErrors > 0 ? `<span>↺ ${_sortErrors} ${t('sort_tries')}</span>` : `<span>${t('sort_perfect')}</span>`}
            </div>
            <div class="sort-complete-btns">
                <button type="button" class="btn-primary-gradient" onclick="startSortGame('${_sortGame.key}')">${t('sort_play_again')}</button>
                <button type="button" class="menu-ghost-btn" onclick="renderSortMenu()">${t('sort_other_game')}</button>
            </div>
        </div>
    `;
}

// =============================================
// İLERLEME & YARDIMCI FONKSIYONLAR
// =============================================
function updateProgressBar() {
    const total = (currentTopic && sessionTotalQuestions) ? sessionTotalQuestions : getActiveTherapyQuestions().length;
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
        const _sCat = getCurrentTherapyCategory().label;
        sessionData.simplifyByCategory[_sCat] = (sessionData.simplifyByCategory[_sCat] || 0) + 1;
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
        const _videoCtrl = new AbortController();
        const _videoFetchTimer = setTimeout(() => _videoCtrl.abort(), 6000);
        const r = await fetch(API_BASE + '/api/video?query=' + currentObj.query, { signal: _videoCtrl.signal });
        clearTimeout(_videoFetchTimer);
        const d = await r.json();
        if (d.videos && d.videos.length) {
            const _pick = d.videos[Math.floor(Math.random() * d.videos.length)];
            const videoUrl = getBestVideoUrl(_pick.video_files);
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
            _loadFallbackVideo(vEl);
        }
    } catch(e) {
        _loadFallbackVideo(vEl);
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
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        document.getElementById('info').innerText = "Tarayıcı ses tanımayı desteklemiyor. Chrome veya Edge kullanmayı dene.";
        document.getElementById('micBtn').disabled = true;
        return;
    }
    var _isSafari = !window.SpeechRecognition && !!window.webkitSpeechRecognition;
    document.getElementById('micBtn').disabled = true;
    document.getElementById('info').innerText = "Dinlemeye hazırlanıyorum...";
    var recognition = new SpeechRecognition();
    recognition.lang = "tr-TR";
    recognition.interimResults = !_isSafari;
    recognition.maxAlternatives = 1;
    recognition.continuous = !_isSafari;
    var _speechBuffer = '';
    var _silenceTimer = null;
    var _recognized = false;
    var _safariActive = false;

    async function _finalizeSpeech() {
        recognition.stop();
        const speech = _speechBuffer.trim();
        if (!speech) return;
        _speechBuffer = '';
        addMessage(speech, "user");
        if (turnCount >= 7) {
            var final = "Seninle konuşmak harikaydı! Hadi şimdi yeni bir videoya bakalım!";
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
        _safariActive = true;
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
        var display = (_speechBuffer + interim).trim();
        if (display) document.getElementById('info').innerText = '🎙️ ' + display;

        if (_isSafari && _recognized) {
            _safariActive = false;
            _finalizeSpeech();
        } else {
            _silenceTimer = setTimeout(_finalizeSpeech, 2500);
        }
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
            const _nrCat = getCurrentTherapyCategory().label;
            sessionData.noResponseByCategory[_nrCat] = (sessionData.noResponseByCategory[_nrCat] || 0) + 1;
            document.getElementById('info').innerText = "Sesi duymadım, tekrar dene!";
        } else document.getElementById('info').innerText = "Duyamadım, tekrar eder misin?";
    };

    recognition.onend = function() {
        clearTimeout(_silenceTimer);
        // Safari: continuous=false olduğu için her utterance sonrası onend gelir;
        // konuşma bitmemişse yeniden başlat
        if (_isSafari && _safariActive && !_recognized) {
            try { recognition.start(); return; } catch(e) {}
        }
        _safariActive = false;
        _stopVolumeRings();
        document.getElementById('micBtn').classList.remove('listening');
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
    var instructions = `Sen özel eğitim öğrencileriyle sosyal uyum, kurallar ve günlük yaşam rutinleri çalışan, çok kısa ve somut konuşan bir AAC (Alternatif İletişim) oyun arkadaşı botsun. Adın Yıldız Can. Çalışılan konu: ${currentTopic || currentCategory.label}. Bu sorunun hedefi: ${currentGoal}. Öğrencinin dikkat ve sözel anlama sınırlılıklarını asla unutma.

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

    // Genel güvenlik: 20sn içinde hiçbir şey olmazsa fallback'e düş
    let _ttsHandled = false;
    const _safetyTimer = setTimeout(() => {
        if (_ttsHandled) return;
        _ttsHandled = true;
        setCharacterEmotion(CharacterEmotion.NEUTRAL);
        speakFallback(text, onEnd);
    }, 20000);

    try {
        const _ttsCtrl = new AbortController();
        const _ttsFetchTimer = setTimeout(() => _ttsCtrl.abort(), 8000);
        const res = await fetch(API_BASE + '/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
            signal: _ttsCtrl.signal
        });
        clearTimeout(_ttsFetchTimer);

        if (!res.ok) {
            clearTimeout(_safetyTimer); _ttsHandled = true;
            setCharacterEmotion(CharacterEmotion.NEUTRAL);
            return speakFallback(text, onEnd);
        }

        initAudioContext();
        if (audioCtx.state === 'suspended') {
            await Promise.race([audioCtx.resume(), new Promise(r => setTimeout(r, 1500))]);
        }
        if (audioCtx.state !== 'running') {
            clearTimeout(_safetyTimer); _ttsHandled = true;
            setCharacterEmotion(CharacterEmotion.NEUTRAL);
            return speakFallback(text, onEnd);
        }

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
        const _durMs = Math.ceil(audioBuf.duration * 1000) + 300;
        let _endFired = false;
        const _fireEnd = () => {
            if (_endFired) return;
            _endFired = true;
            clearTimeout(_safetyTimer); _ttsHandled = true;
            stopLipsync();
            setCharacterEmotion(CharacterEmotion.NEUTRAL);
            if (onEnd) onEnd();
        };
        source.onended = _fireEnd;
        setTimeout(_fireEnd, _durMs);
    } catch (e) {
        if (_ttsHandled) return;
        _ttsHandled = true;
        clearTimeout(_safetyTimer);
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
                <p>${t('schedule_empty')}</p>
                <p><strong>${t('schedule_help')}</strong></p>
            </div>`;
        progressWrap.style.display = 'none';
        resetBtn.style.display = 'none';
        return;
    }

    progressWrap.style.display = '';
    resetBtn.style.display = '';
    const doneCount = activities.filter(a => done[a.id]).length;
    const pct = Math.round((doneCount / activities.length) * 100);
    document.getElementById('scheduleProgress').textContent =
        t('schedule_progress').replace('{done}', doneCount).replace('{total}', activities.length);
    document.getElementById('scheduleProgressFill').style.width = pct + '%';

    list.innerHTML = activities.map(a => `
        <div class="schedule-item ${done[a.id] ? 'done' : ''}">
            <button class="schedule-check-btn" onclick="toggleScheduleActivity('${escapeHtml(a.id)}')"
                aria-label="${done[a.id] ? t('schedule_undo') : t('schedule_mark_done')}">
                ${done[a.id] ? '✅' : '⬜'}
            </button>
            <span class="schedule-item-emoji">${escapeHtml(a.emoji)}</span>
            <span class="schedule-item-label">${escapeHtml(a.label)}</span>
            ${a.time ? `<span class="schedule-item-time">${escapeHtml(a.time)}</span>` : ''}
            <button class="schedule-delete-btn" onclick="deleteScheduleActivity('${escapeHtml(a.id)}')"
                aria-label="${t('schedule_delete')}">✕</button>
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
        if (act) speakFallback(t('schedule_activity_done').replace('{label}', act.label));
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

let _aacBoards = [];
let _aacCurrentBoardId = null;
let _aacSentence = []; // [{ label, spoken }]

async function goToAac() {
    showOnly('aac-screen');
    _aacSentence = [];
    const sid = activeStudentId || 'default';
    await AACData.migrateLegacyIfNeeded(sid);
    await AACData.migrateV2IfNeeded(sid);
    _aacBoards = await AACData.listBoards(sid);
    _aacCurrentBoardId = _aacBoards[0]?.id || null;
    await _aacRenderAll();
}


async function _aacRenderAll() {
    const sid = activeStudentId || 'default';
    const settings = await AACData.getSettings(sid);

    // Çekirdek şerit
    const coreStrip = document.getElementById('aacCoreStrip');
    if (settings.coreStrip) {
        const coreCards = [];
        for (const b of _aacBoards) {
            const cards = await AACData.listCards(b.id);
            coreCards.push(...cards.filter(c => c.isCore));
        }
        coreStrip.style.display = coreCards.length ? 'flex' : 'none';
        coreStrip.innerHTML = coreCards.map(c => `
            <button type="button" class="aac-core-card" onclick="tapAacCard('${escapeHtml(c.id)}','${escapeHtml(c.spoken || c.label)}','${escapeHtml(c.label)}')">
                ${_aacVisualHtml(c.visual, 'aac-card-emoji')}
                <span style="font-size:0.65rem;font-weight:700;">${escapeHtml(c.label)}</span>
            </button>
        `).join('');
    } else {
        coreStrip.style.display = 'none';
    }

    // Navigasyon sekmeleri
    const nav = document.getElementById('aacNav');
    const backBtn = '<button class="aac-nav-btn" onclick="goToMenu()">← Menü</button>';
    const tabs = _aacBoards.map(b => `
        <button type="button"
            class="aac-nav-btn${b.id === _aacCurrentBoardId ? ' active' : ''}"
            onclick="setAacBoard('${escapeHtml(b.id)}')">
            ${_aacVisualHtml(b.visual, 'aac-card-emoji', '1rem')} ${escapeHtml(b.label)}
        </button>
    `).join('');
    nav.innerHTML = backBtn + tabs;

    // Grid
    if (_aacCurrentBoardId) {
        const { rows, cols, matrix } = await AACData.buildGrid(sid, _aacCurrentBoardId);
        const grid = document.getElementById('aacGrid');
        grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        grid.style.gridTemplateRows    = `repeat(${rows}, 1fr)`;
        grid.innerHTML = matrix.flat().map(card => {
            if (!card) return '<div class="aac-card empty"></div>';
            return `
                <button type="button" class="aac-card"
                    data-label="${escapeHtml(card.label)}"
                    onclick="tapAacCard('${escapeHtml(card.id)}','${escapeHtml(card.spoken || card.label)}','${escapeHtml(card.label)}')">
                    ${_aacVisualHtml(card.visual, 'aac-card-emoji')}
                    <span class="aac-card-text">${escapeHtml(card.label)}</span>
                </button>
            `;
        }).join('');
        const searchInput = document.getElementById('aacCardSearch');
        if (searchInput && searchInput.value) filterAacCards(searchInput.value);
    }

    _aacUpdateSentenceBar();
}

function _aacVisualHtml(visual, cls, size) {
    if (!visual) return `<span class="${cls}">❓</span>`;
    if (visual.type === 'image' && visual.value) {
        const s = size ? `style="width:${size};height:${size};object-fit:contain;"` : '';
        return `<img class="aac-card-img" src="${escapeHtml(visual.value)}" alt="" ${s}><span class="aac-pexels-badge">P</span>`;
    }
    const s = size ? `style="font-size:${size}"` : '';
    return `<span class="${cls}" ${s}>${escapeHtml(visual.value || '❓')}</span>`;
}

async function setAacBoard(boardId) {
    _aacCurrentBoardId = boardId;
    await _aacRenderAll();
}

function tapAacCard(cardId, spoken, label) {
    _aacSentence.push({ label, spoken });
    _aacUpdateSentenceBar();
    speakFallback(spoken);
}

function _aacUpdateSentenceBar() {
    const wrap = document.getElementById('aacSentenceWords');
    const speakBtn = document.getElementById('aacSpeakBtn');
    if (!_aacSentence.length) {
        wrap.innerHTML = `<span class="aac-sentence-placeholder">${t('aac_sentence_placeholder')}</span>`;
        if (speakBtn) speakBtn.disabled = true;
        return;
    }
    wrap.innerHTML = _aacSentence.map((w, i) => `
        <span class="aac-word-chip" onclick="removeAacWord(${i})">${escapeHtml(w.label)} ✕</span>
    `).join('');
    if (speakBtn) speakBtn.disabled = false;
}

function removeAacWord(index) {
    _aacSentence.splice(index, 1);
    _aacUpdateSentenceBar();
}

function speakAacSentence() {
    if (!_aacSentence.length) return;
    speakFallback(_aacSentence.map(w => w.spoken).join('. '));
}

function clearAacSentence() {
    _aacSentence = [];
    _aacUpdateSentenceBar();
}

function filterAacCards(q) {
    const term = q.toLowerCase().trim();
    document.querySelectorAll('#aacGrid .aac-card').forEach(card => {
        if (card.classList.contains('empty')) {
            card.style.visibility = term ? 'hidden' : '';
            return;
        }
        const label = (card.dataset.label || '').toLowerCase();
        card.style.visibility = (!term || label.includes(term)) ? '' : 'hidden';
    });
}

const _aacEmojiCats = {
    'Duygular':    ['😊','😢','😡','😨','😴','🤢','😍','😐','🤩','😲','😑','😳','🤒','🥵','🥶','🤕','🤗','😪','😅','🥹'],
    'Yiyecekler':  ['🍞','🍎','🥦','🍖','🍝','🍚','🍲','🥛','🧃','🍪','🍫','🍦','🍕','🍔','🥚','🍌','🍇','🍓','🥕','🍋','🍩','🧁','🍉','🫐'],
    'Etkinlikler': ['📚','✏️','🎨','🧩','📺','🏃','💃','🎤','🏊','🚴','⚽','🎵','🎮','🎲','🏋️','🛝','🎭','🖼️','🎯','🏓'],
    'İnsanlar':    ['👩','👨','👶','👧','👦','👵','👴','👩‍🏫','👫','👨‍⚕️','🙋','👨‍👩‍👧','🧑','👩‍🍳','👮','🧑‍🎨'],
    'Hayvanlar':   ['🐱','🐶','🐦','🐟','🐰','🐴','🐄','🐑','🦁','🐘','🐵','🦋','🐸','🦊','🐼','🐧','🦜','🐢','🦄','🐬'],
    'Yerler':      ['🏠','🏫','🌳','🏥','🚗','🛁','🛏️','🍳','📖','🎡','🏪','🚌','✈️','🏖️','🏞️','🌆'],
    'Semboller':   ['✅','❌','✋','➕','🏁','🆘','🤝','🚶','❤️','⭐','🌈','👍','👎','🔴','🔵','🟢','🟡','🟠','🟣','⬛','⬜'],
};
const _aacEmojiCatLabelKeys = {
    'Duygular': 'aac_cat_feelings',
    'Yiyecekler': 'aac_cat_foods',
    'Etkinlikler': 'aac_cat_activities',
    'İnsanlar': 'aac_cat_people',
    'Hayvanlar': 'aac_cat_animals',
    'Yerler': 'aac_cat_places',
    'Semboller': 'aac_cat_symbols',
};
let _aacPickedEmoji = '';

function openAacSearch() {
    document.getElementById('aac-search-modal').style.display = 'flex';
    document.getElementById('aacEmojiLabelRow').style.display = 'none';
    _aacPickedEmoji = '';
    switchAacMode('emoji');
}

function closeAacSearch(e) {
    if (e.target.id === 'aac-search-modal') {
        document.getElementById('aac-search-modal').style.display = 'none';
    }
}

function switchAacMode(mode) {
    document.getElementById('aacModeEmoji').classList.toggle('active', mode === 'emoji');
    document.getElementById('aacModePhoto').classList.toggle('active', mode === 'photo');
    document.getElementById('aacEmojiMode').style.display  = mode === 'emoji' ? '' : 'none';
    document.getElementById('aacPhotoMode').style.display  = mode === 'photo' ? '' : 'none';
    document.getElementById('aacEmojiLabelRow').style.display = 'none';
    _aacPickedEmoji = '';
    if (mode === 'emoji') {
        _aacRenderEmojiTabs();
        _aacShowEmojiCat(Object.keys(_aacEmojiCats)[0]);
    } else {
        setTimeout(() => document.getElementById('aacPhotoQuery').focus(), 80);
    }
}

async function searchAacPhoto() {
    const q = (document.getElementById('aacPhotoQuery').value || '').trim();
    if (!q) return;
    const grid = document.getElementById('aacPhotoGrid');
    grid.innerHTML = `<p class="aac-photo-hint">${t('aac_searching')}</p>`;
    try {
        const r = await fetch(API_BASE + '/api/photo?query=' + encodeURIComponent(q));
        const d = await r.json();
        if (!d.photos || !d.photos.length) {
            grid.innerHTML = `<p class="aac-photo-hint">${t('aac_no_results')}</p>`;
            return;
        }
        grid.innerHTML = d.photos.map(p => {
            const thumb = p.src.small;
            const alt = escapeHtml(p.alt || q);
            return `<button type="button" class="aac-photo-item" onclick="selectAacPhoto('${escapeHtml(thumb)}','${alt}')">
                <img src="${escapeHtml(thumb)}" alt="${alt}" loading="lazy">
            </button>`;
        }).join('');
    } catch {
        grid.innerHTML = `<p class="aac-photo-hint">${t('aac_connection_error')}</p>`;
    }
}

function selectAacPhoto(url, alt) {
    _aacPickedEmoji = '__photo__' + url;
    const preview = document.getElementById('aacSelectedEmoji');
    preview.innerHTML = `<img src="${escapeHtml(url)}" style="width:48px;height:48px;object-fit:cover;border-radius:8px;">`;
    document.getElementById('aacEmojiLabel').value = alt;
    document.getElementById('aacEmojiLabelRow').style.display = 'flex';
    setTimeout(() => document.getElementById('aacEmojiLabel').focus(), 60);
}

function _aacRenderEmojiTabs() {
    const tabs = document.getElementById('aacEmojiTabs');
    tabs.innerHTML = Object.keys(_aacEmojiCats).map((cat, i) =>
        `<button type="button" class="aac-emoji-tab${i === 0 ? ' active' : ''}" data-cat="${escapeHtml(cat)}" onclick="_aacShowEmojiCat('${escapeHtml(cat)}')">${t(_aacEmojiCatLabelKeys[cat])}</button>`
    ).join('');
}

function _aacShowEmojiCat(cat) {
    document.querySelectorAll('.aac-emoji-tab').forEach(tabEl => tabEl.classList.toggle('active', tabEl.dataset.cat === cat));
    const emojis = _aacEmojiCats[cat] || [];
    document.getElementById('aacEmojiGrid').innerHTML = emojis.map(e =>
        `<button type="button" class="aac-emoji-btn" onclick="selectAacEmoji('${e}')">${e}</button>`
    ).join('');
    document.getElementById('aacEmojiLabelRow').style.display = 'none';
    _aacPickedEmoji = '';
}

function selectAacEmoji(emoji) {
    _aacPickedEmoji = emoji;
    document.getElementById('aacSelectedEmoji').textContent = emoji;
    document.getElementById('aacEmojiLabel').value = '';
    document.getElementById('aacEmojiLabelRow').style.display = 'flex';
    setTimeout(() => document.getElementById('aacEmojiLabel').focus(), 60);
}

async function addEmojiCard() {
    if (!_aacPickedEmoji || !_aacCurrentBoardId) return;
    const label = (document.getElementById('aacEmojiLabel').value || '').trim();
    if (!label) { document.getElementById('aacEmojiLabel').focus(); return; }

    const sid = activeStudentId || 'default';
    const board = _aacBoards.find(b => b.id === _aacCurrentBoardId);
    if (!board) return;

    const isPhoto = _aacPickedEmoji.startsWith('__photo__');
    const visual = isPhoto
        ? { type: 'image', value: _aacPickedEmoji.slice('__photo__'.length) }
        : { type: 'emoji', value: _aacPickedEmoji };

    const { rows, cols, matrix } = await AACData.buildGrid(sid, _aacCurrentBoardId);
    let targetRow = -1, targetCol = -1;
    outer: for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (!matrix[r][c]) { targetRow = r; targetCol = c; break outer; }
        }
    }
    if (targetRow === -1) {
        await AACData.growGrid(sid, { rows: rows + 1, cols });
        targetRow = rows;
        targetCol = 0;
    }

    await AACData.placeCard(board, {
        row: targetRow, col: targetCol,
        label,
        spoken: label,
        visual,
        isCore: false,
    });

    document.getElementById('aac-search-modal').style.display = 'none';
    await _aacRenderAll();
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
                document.getElementById('seqFeedback').textContent = t('seq_correct_order');
                speakFallback(t('seq_correct_order_speak'));
                if (typeof confetti === 'function') confetti({ particleCount: 80, spread: 60, origin: {y: 0.6} });
            }, 300);
        }
    } else {
        seqState.errors++;
        if (cardEl) cardEl.classList.add('shake');
        setTimeout(() => { if (cardEl) cardEl.classList.remove('shake'); }, 500);
        document.getElementById('seqFeedback').textContent = t('seq_wrong_order');
        speakFallback(t('seq_try_again_speak'));
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
        document.getElementById('seqFeedback').textContent = t('seq_select_cause_first');
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
        document.getElementById('seqFeedback').textContent = t('seq_correct_match');
        speakFallback(t('seq_correct_match_speak'));
        if (seqState.matched === seqState.pairs.length) {
            setTimeout(() => {
                document.getElementById('seqFeedback').textContent = t('seq_all_pairs_found');
                speakFallback(t('seq_all_pairs_found_speak'));
                if (typeof confetti === 'function') confetti({ particleCount: 80, spread: 60, origin: {y: 0.6} });
            }, 300);
        }
    } else {
        seqState.errors++;
        const effectEl = document.getElementById('effectCard_' + i);
        if (effectEl) { effectEl.classList.add('shake'); setTimeout(() => effectEl.classList.remove('shake'), 500); }
        document.getElementById('seqFeedback').textContent = t('seq_wrong_match');
        speakFallback(t('seq_try_again_speak'));
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
    if (!isOpen) updateA11yAccountSection();
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
    applyLang();
});

// =============================================
// WINDOW EXPORT (HTML onclick için)
// =============================================
window.setLang = setLang;
window.continueAsGuest = continueAsGuest;
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
window.goToSort = goToSort;
window.renderSortMenu = renderSortMenu;
window.startSortGame = startSortGame;
window._sortTap = _sortTap;
window._sortBasketTap = _sortBasketTap;
window._sortPointerDown = _sortPointerDown;
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
window.setAacBoard = setAacBoard;
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
        const r = await fetch(API_BASE + '/api/auth', {
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
    const timer = setTimeout(() => hideSplash(), 10000); // her koşulda 10s sonra splash kapanır
    try {
        const savedToken = DB.getSync(authStorageKey());
        const savedUser  = DB.getSync(authUserStorageKey());

        if (savedToken && savedUser) {
            const res = await authApi('verify', { token: savedToken });
            if (res.valid) {
                _authToken = savedToken;
                _authUser  = { username: res.username, displayName: res.displayName };
                await DB.initEncryption(savedToken);
                clearTimeout(timer);
                hideSplash();
                onAuthSuccess();
                return;
            } else if (res.fallback && !savedToken.startsWith('demo_')) {
                _authToken = savedToken;
                _authUser  = savedUser;
                await DB.initEncryption(savedToken);
                clearTimeout(timer);
                hideSplash();
                onAuthSuccess();
                return;
            }
            DB.del(authStorageKey());
            DB.del(authUserStorageKey());
        }

        clearTimeout(timer);
        hideSplash();
        showOnly('auth-screen');
    } catch (e) {
        clearTimeout(timer);
        hideSplash();
        showOnly('auth-screen');
    }
}

function continueAsGuest() {
    _authToken = 'demo_' + Date.now();
    _authUser = { username: 'guest', displayName: _lang === 'en' ? 'Guest' : 'Misafir' };
    DB.initEncryption(_authToken).catch(() => {});
    onAuthSuccess();
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
    await DB.initEncryption(res.token);
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
    if (!document.getElementById('kvkkConsent').checked) return showAuthError('Devam etmek için Aydınlatma Metni\'ni kabul etmelisiniz');
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
    await DB.initEncryption(res.token);
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

function openKvkkModal(e) {
    if (e) e.preventDefault();
    document.getElementById('kvkk-modal').style.display = 'flex';
}

function closeKvkkModal(e) {
    if (e.target === document.getElementById('kvkk-modal')) {
        document.getElementById('kvkk-modal').style.display = 'none';
    }
}

async function exportMyData() {
    if (!_authUser) return;
    const data = {
        kullanici: _authUser,
        ogrenciler: await DB.get('lms_students') || [],
        verme_tarihi: new Date().toISOString(),
    };
    const keys = Object.keys(localStorage).filter(k => k.startsWith('lms_'));
    for (const k of keys) {
        try { data[k] = JSON.parse(localStorage.getItem(k)); } catch { data[k] = localStorage.getItem(k); }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yildiz-siniflari-verilerim-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

async function deleteAccount() {
    const confirmed = confirm(t('confirm_delete_account_1'));
    if (!confirmed) return;
    const confirmed2 = confirm(t('confirm_delete_account_2'));
    if (!confirmed2) return;

    if (_authToken && !_authToken.startsWith('demo_')) {
        await authApi('delete', { token: _authToken });
    }
    // localStorage + cloud (KV/PostgreSQL) temizle
    const lsKeys = [...Object.keys(localStorage)].filter(k => k.startsWith('lms_'));
    lsKeys.forEach(k => DB.del(k.slice(4)));
    // sessionStorage temizle
    const ssKeys = [...Object.keys(sessionStorage)].filter(k => k.startsWith('lms_s_'));
    ssKeys.forEach(k => sessionStorage.removeItem(k));
    _authToken = null;
    _authUser = null;
    alert(t('account_deleted_msg'));
    showOnly('auth-screen');
    switchAuthTab('login');
}

function updateA11yAccountSection() {
    const section = document.getElementById('a11yAccountSection');
    const userEl = document.getElementById('a11yAccountUser');
    if (!section) return;
    if (_authUser) {
        section.style.display = 'block';
        if (userEl) userEl.textContent = '@' + _authUser.username;
    } else {
        section.style.display = 'none';
    }
}

window.openKvkkModal = openKvkkModal;
window.closeKvkkModal = closeKvkkModal;
window.exportMyData = exportMyData;
window.deleteAccount = deleteAccount;

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
    const veliConsent = document.getElementById('loginVeliConsent');
    if (veliConsent && !veliConsent.checked) {
        alert(t('kvkk_confirm_required'));
        return;
    }
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
        tagsEl.innerHTML = levelTag + condTags || `<span class="az-tag-empty">${t('profile_not_entered')}</span>`;
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
    btn.textContent = t('bep_preparing');

    const userId = await getCurrentUserId();
    const profile = await DB.get('bep_profile_' + userId) || {};
    const history = await loadReportHistory();

    const categoryLabels = {
        ogreti: 'Hafif Düzey (Öğretilebilir)',
        egit: 'Orta Düzey (Eğitilebilir)',
        destekli: 'Ağır/İleri Düzey (Desteklenen)'
    };
    const conditionBehaviors = {
        ekolali: 'sözel tekrarlama örüntüleri gözlemleniyor',
        stereotipik: 'tekrarlayıcı hareket örüntüleri gözlemleniyor',
        dehb: 'dikkat süresi ve dürtü kontrolünde güçlük gözlemleniyor',
        dil: 'dil ve konuşma gelişiminde destek ihtiyacı var',
        down: 'bilişsel ve dil gelişiminde bireyselleştirilmiş destek gerekiyor',
        cp: 'motor koordinasyon desteği gerekiyor',
        oog: 'özgül öğrenme güçlüğüne yönelik destek uygulanıyor'
    };

    const profileText = `Öğrenci Destek Düzeyi: ${categoryLabels[profile.category] || 'Belirtilmemiş'}
Gözlemlenen Özellikler: ${(profile.conditions || []).map(c => conditionBehaviors[c] || c).join('; ') || 'Belirtilmemiş'}`;

    const sessionText = history.slice(0, 10).map(h =>
        `• ${formatHistoryDate(h.dateKey)}: ${h.durationMin} dk, ${h.totalTurns} yanıt, ${h.micUsedInTherapy || 0} bağımsız mikrofon, ${h.repeatUsed || 0} tekrar, ${h.simplifyUsed || 0} basitleştirme`
    ).join('\n') || 'Kayıtlı seans verisi yok.';

    const m = window._azMetrics || {};
    const metricsText = m.total > 0
        ? `İletişim Bağımsızlığı: %${m.indPct} (bağımsız mikrofon kullanımı)\nTekrar Dinleme İhtiyacı: %${m.repPct}\nDil Adaptasyon İhtiyacı: %${m.simPct}`
        : 'Metrik verisi henüz toplanmamış.';

    const systemPrompt = `Sen özel eğitim kurumları için çalışan bir BEP (Bireyselleştirilmiş Eğitim Programı) taslak hazırlama asistanısın. Görevin, ham etkileşim verilerini BEP'e girdi olabilecek gözlem odaklı bir taslak metne dönüştürmektir. Bu taslak yetkili BEP ekibi tarafından incelenmeden resmi belge olarak kullanılamaz.

YAZIM KURALLARI:
1. "Tıbbi Model" dili kullanma. "Sosyal Model" dilini esas al: toplumsal katılım, akran etkileşimi ve sosyal uyum odaklı yaz.
2. Eğer öğrencide "Ekolali" veya "Stereotipik hareket" varsa, yapay zekanın sönümlendirme ve bağımsızlaştırma etkisini vurgula.
3. Gözlemlenebilir, performans odaklı cümleler kur. "Kesin tanı" veya "resmi teşhis" ifadesi kullanma.
4. Türkçe yaz. 300-400 kelime arası tut.`;

    const userPrompt = `Aşağıdaki profil, bağımsızlık metrikleri ve seans verilerini kullanarak bir BEP Dönemsel Gelişim Taslağı oluştur:

ÖĞRENCİ PROFİLİ:
${profileText}

İLETİŞİM BAĞIMSIZLIK METRİKLERİ (${m.sessionCount || history.length} seans toplamı):
${metricsText}

SON SEANSLAR (${Math.min(history.length, 10)} seans):
${sessionText}

Taslağı "📝 BEP Dönemsel Gelişim Taslağı" başlığıyla başlat. Şu bölümleri içersin: 1) Öğrenci Kademesi ve Gözlem Özeti, 2) İletişim Bağımsızlığı Gelişimi (metrikleri yorumla), 3) Gözlemlenen Güçlü Yönler, 4) Sonraki Dönem Önerileri. Metrikleri açıklarken somut rakamlar kullan.`;

    try {
        const res = await fetch(API_BASE + '/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: systemPrompt }] },
                contents: [{ role: 'user', parts: [{ text: userPrompt }] }]
            }),
            signal: AbortSignal.timeout(30000)
        });

        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || t('bep_draft_failed');
        const disclaimer = t('bep_disclaimer_full') + '\n\n';
        textEl.value = disclaimer + rawText;
        output.style.display = 'flex';
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
        textEl.value = t('bep_error_prefix') + err.message;
        output.style.display = 'flex';
    }

    btn.disabled = false;
    btn.textContent = '📝 ' + t('bep_generate_btn');
}

function copyBepReport() {
    const text = document.getElementById('bepReportText').value;
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.querySelector('.bep-copy-btn');
        btn.textContent = t('bep_copied_btn');
        setTimeout(() => { btn.textContent = t('bep_copy_btn'); }, 2000);
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
    const label = next === 'mastered' ? t('skill_mastered') : next === 'learning' ? t('skill_learning_status') : t('skill_reset');
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
    speakFallback(t('behavior_added'));
}

function renderBehaviorLog() {
    const log = loadBehaviorSync();
    const el = document.getElementById('behaviorLogList');
    if (!log.length) {
        el.innerHTML = `<p class="behavior-empty">${t('behavior_empty')}</p>`;
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
                ${e.duration ? `<span>${t('behavior_duration_unit').replace('{duration}', e.duration)}</span>` : ''}
            </div>
            <button class="behavior-delete-btn" onclick="deleteBehaviorEntry('${escapeHtml(e.id)}')">${t('behavior_delete')}</button>
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






