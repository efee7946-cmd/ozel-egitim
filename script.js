// =============================================
// I18N — Çok Dil Desteği
// =============================================
const STRINGS = {
  tr: {
    back_menu: '← Menü',
    back_menu_plain: 'Menü',
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
    auth_tagline: 'Özel eğitim yönetim platformu',
    auth_username_label: 'Kullanıcı Adı',
    auth_password_label: 'Şifre',
    auth_password_hint: '(en az 8 karakter)',
    auth_password_repeat: 'Şifre Tekrar',
    auth_student_name: 'Öğrencinin Adı',
    auth_student_emoji: 'Öğrenci Emojisi',
    auth_edu_level: 'Eğitim Kademesi',
    auth_level_mild: 'Hafif – Öğretilebilir',
    auth_level_moderate: 'Orta – Eğitilebilir',
    auth_level_severe: 'Ağır/İleri – Desteklenen',
    auth_diagnosis: 'Tanı / Eşlik Eden Durumlar',
    auth_cond_osb: 'OSB',
    auth_cond_dehb: 'DEHB',
    auth_cond_dil: 'Dil / Konuşma',
    auth_cond_down: 'Down Sendromu',
    auth_cond_cp: 'Serebral Palsi',
    auth_cond_oog: 'Öz. Öğrenme Güçlüğü',
    auth_cond_ekolali: 'Ekolali',
    auth_cond_stereotipik: 'Stereotipik Hareket',
    reg_username_placeholder: 'örnek: ahmet_ogretmen (harf, rakam, _)',
    reg_student_placeholder: 'örn: Ali',
    auth_kvkk_link1: 'Aydınlatma Metni',
    auth_kvkk_sep: "'ni ve",
    auth_kvkk_link2: 'Gizlilik Politikası',
    auth_kvkk_agree: "'nı okudum, kabul ediyorum.",
    auth_fill_all: 'Tüm alanları doldurun',
    auth_passwords_mismatch: 'Şifreler uyuşmuyor',
    auth_password_short: 'Şifre en az 8 karakter olmalı',
    auth_kvkk_required: 'Devam etmek için Aydınlatma Metni\'ni kabul etmelisiniz',
    AUTH_FIELDS_REQUIRED: 'Kullanıcı adı ve şifre gerekli',
    AUTH_USERNAME_TOO_SHORT: 'Kullanıcı adı en az 3 karakter olmalı',
    AUTH_PASSWORD_TOO_SHORT: 'Şifre en az 8 karakter olmalı',
    AUTH_PASSWORD_PWNED: 'Bu şifre daha önce bir veri ihlalinde açığa çıkmış. Lütfen farklı bir şifre seç.',
    AUTH_USERNAME_INVALID_CHARS: 'Sadece harf, rakam ve alt çizgi kullanabilirsin',
    AUTH_USERNAME_TAKEN: 'Bu kullanıcı adı zaten alınmış',
    AUTH_INVALID_CREDENTIALS: 'Kullanıcı adı veya şifre yanlış',
    AUTH_TOO_MANY_ATTEMPTS: 'Çok fazla hatalı deneme yapıldı. 15 dakika sonra tekrar deneyin veya şifrenizi sıfırlayın',
    AUTH_RATE_LIMITED: 'Çok fazla istek yapıldı, lütfen biraz sonra tekrar deneyin.',
    SERVER_ERROR: 'Sunucu hatası, lütfen tekrar deneyin',
    setup_title: 'Öğrenci Bilgileri',
    setup_name: 'Öğrenci adı',
    setup_age: 'Yaş',
    setup_level: 'Destek düzeyi',
    setup_btn: 'Başla',
    menu_greeting_default: 'Merhaba!',
    menu_therapy: 'Konuşma Pratiği',
    menu_therapy_desc: 'Sorulara sesli cevap ver',
    menu_schedule: 'Günlük Görevler',
    menu_schedule_desc: 'Bugünün görevlerini tamamla',
    menu_report: 'Rapor',
    menu_aac: 'AAC',
    menu_aac_desc: 'Görsellerle iletişim kur',
    menu_sequence: 'Nesne Tanıma',
    menu_sequence_desc: '3D nesneleri tanı, söyle',
    menu_analysis_report: 'Analiz & Rapor',
    menu_analysis_report_desc: 'Gelişimi takip et',
    menu_store: 'Giyim Mağazası',
    menu_store_desc: 'Yıldızlarını harca, giydir',
    menu_parent_report: 'Veli Raporu',
    help_title: '❓ Yardım',
    help_sections_title: 'Bölümler Ne İşe Yarar?',
    help_therapy_desc: 'Yapay zeka çocuğa sorular sorar, çocuk sesli cevap verir; konuşma becerisi zamanla takip edilir.',
    help_object_desc: 'Çocuk 3D nesneyi inceleyip döndürür, ne olduğunu söyler ya da yazar; doğru cevapta bir sonraki nesneye geçilir.',
    help_aac_desc: 'Sözel iletişimde zorlanan çocuklar için görsel kartlarla ihtiyaç ve duygularını ifade etme.',
    help_schedule_desc: 'Her gün otomatik belirlenen küçük görevler tamamlandıkça yıldız kazandırır.',
    help_analysis_desc: 'Çocuğun gelişimini zaman içinde takip eder, veli ve uzmanlar için özet rapor oluşturur.',
    help_store_desc: 'Kazanılan yıldızlarla karakteri giydirmeyi sağlayan bir ödül/motivasyon sistemi.',
    help_faq_title: 'Sık Sorulan Sorular',
    help_faq_q1: '⭐ Yıldızları nasıl kazanırım?',
    help_faq_a1: 'Konuşma pratiği, nesne tanıma ve günlük görevleri tamamlayarak yıldız kazanılır. Yıldızlar Giyim Mağazası\'nda harcanabilir.',
    help_faq_q2: '👥 Birden fazla öğrenci ekleyebilir miyim?',
    help_faq_a2: 'Evet. Öğrenci seç kısmından "Yeni Öğrenci Ekle" ile istediğiniz kadar öğrenci ekleyip aralarında geçiş yapabilirsiniz.',
    help_faq_q3: '🔑 Şifremi unuttum, ne yapmalıyım?',
    help_faq_a3: 'Giriş ekranındaki "Şifremi unuttum" bağlantısına tıklayıp e-postanıza gelen kodla yeni şifre belirleyebilirsiniz.',
    help_faq_q4: '🔒 Verilerim güvende mi?',
    help_faq_a4: 'Veriler önce cihazınızda saklanır, ardından hesabınıza bağlı olarak şifrelenmiş şekilde sunucuya yedeklenir. Verilerinizi Erişilebilirlik panelinden indirebilir veya kalıcı olarak silebilirsiniz.',
    stars_earned: '+{n} ⭐ kazandın!',
    star_info_title: '⭐ Yıldızlar Nasıl Kazanılır?',
    star_info_therapy: 'Konuşma pratiğinde yardım almadan mikrofona konuşarak',
    star_info_object: 'Nesne tanımayı hatasız veya az hatayla tamamlayarak',
    star_info_schedule: 'Günlük görevleri tamamlayarak',
    star_info_purpose: "Kazandığın yıldızları Giyim Mağazası'nda ayı için şapka, gözlük ve daha fazla aksesuar satın almak için harcayabilirsin!",
    star_info_goto_store: 'Giyim Mağazasına Git',
    store_title: '🏪 Giyim Mağazası',
    store_cat_hat: 'Şapkalar',
    store_cat_face: 'Yüz',
    store_cat_neck: 'Boyun',
    store_buy_btn: 'Satın Al',
    store_equip_btn: 'Giydir',
    store_unequip_btn: 'Çıkar',
    store_owned_label: 'Sahipsin',
    store_equipped_label: 'Kullanılıyor ✓',
    store_need_more: '{n} yıldız daha lazım',
    store_bought_toast: '🎉 {item} satın alındı!',
    store_not_enough_toast: 'Yeterli yıldızın yok — {n} yıldız daha topla!',
    acc_cap: 'Kep', acc_bowtie: 'Papyon', acc_glasses: 'Gözlük', acc_sunhat: 'Güneş Şapkası',
    acc_scarf: 'Atkı', acc_sunglasses: 'Güneş Gözlüğü', acc_gradcap: 'Mezuniyet Kepi',
    acc_necklace: 'Kolye', acc_tophat: 'Silindir Şapka', acc_medal: 'Madalya',
    acc_mask: 'Maske', acc_helmet: 'Kask', acc_crown: 'Taç',
    greet_child: 'Merhaba {name}! Bugün ne oynayalım?',
    nudge_therapy_gap: '{d} gündür konuşma pratiği yapılmadı — kısa bir seans?',
    nudge_sort_again: '{game}: son doğruluk %{acc} — tekrar dene!',
    nudge_first: 'Hadi başlayalım! İlk konuşma pratiğini yap',
    menu_analysis: 'Analiz',
    therapy_title: 'Konuşma Pratiği',
    therapy_hint: 'Hazırlanıyorum...',
    report_title: 'Rapor',
    report_generate: 'Rapor Oluştur',
    bep_title: 'Dönemsel BEP Taslağı',
    bep_generate: 'BEP Taslağı Oluştur',
    bep_disclaimer: '⚠️ Bu taslak yalnızca rehberlik amaçlıdır. Lisanslı özel eğitim uzmanı tarafından gözden geçirilmelidir.',
    aac_title: 'AAC Panosu',
    a11y_title: '⚙️ Ayarlar',
    a11y_large_text: 'Büyük Metin',
    a11y_large_text_desc: 'Yazı boyutunu artırır',
    a11y_high_contrast: 'Yüksek Kontrast',
    a11y_high_contrast_desc: 'Renk kontrastını artırır',
    a11y_reduce_motion: 'Hareketi Azalt',
    a11y_reduce_motion_desc: 'Animasyonları kapatır',
    a11y_large_touch: 'Büyük Dokunma',
    a11y_large_touch_desc: 'Buton boyutunu artırır',
    a11y_export: '📥 Verilerimi İndir',
    a11y_logout: '🚪 Çıkış Yap',
    sound_hint: '🔔 Ses duymuyorsan telefonunun yan sessiz anahtarını kontrol et.',
    offline_banner: '📡 İnternet bağlantın yok — giriş yapmak için bağlantı gerekiyor.',
    offline_toast: 'Çevrimdışı moddasın — internet isteyen özellikler kapalı, ilerlemen bağlantı gelince eşitlenir.',
    offline_action: 'Bu etkinlik için internet bağlantısı gerekiyor 📡',
    a11y_delete: '🗑️ Hesabı Sil',
    a11y_privacy: 'Gizlilik Politikası & KVKK',
    lang_toggle: 'EN',
    score_label: 'puan',
    choose_student: 'Öğrenci seç veya ekle',
    add_new_student: '+ Yeni Öğrenci Ekle',
    student_placeholder: 'Öğrenci adı',
    age_label: 'Yaş',
    level_label: 'Destek düzeyi',
    level1: 'Hafif',
    level2: 'Orta',
    level3: 'Ağır',
    start_btn: 'Başla',
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
    confirm_delete: 'Silmek istediğinizden emin misiniz?',
    data_saved: 'Kaydedildi',
    copy_success: 'Kopyalandı',
    no_student: 'Öğrenci seçilmedi',
    // BEP ekranı
    bep_preparing: '⏳ Taslak hazırlanıyor...',
    bep_draft_failed: 'Taslak oluşturulamadı. Gemini API yanıt vermedi.',
    bep_error_prefix: 'Hata: ',
    bep_copied_btn: '✓ Kopyalandı!',
    bep_copy_btn: '📋 Metni Kopyala',
    bep_generate_ai_btn: '⚡ Yapay Zeka BEP Taslağı Oluştur',
    bep_periodic_title: 'Dönemsel BEP Taslağı',
    bep_periodic_sub: "Seans verileri kullanılarak BEP'e aktarılabilecek bir taslak metin oluşturulur. Yetkili ekip tarafından gözden geçirilmesi gerekir.",
    bep_disclaimer_short: '⚠️ Bu metin bir taslaktır. Resmi BEP için yetkili ekip (öğretmen, uzman, veli) tarafından incelenmeli ve onaylanmalıdır.',
    bep_disclaimer_full: '⚠️ TASLAK BELGE — Bu metin yapay zeka tarafından oluşturulmuştur. Resmi BEP belgesi olarak kullanılabilmesi için yetkili BEP ekibi (öğretmen, uzman, okul idaresi, veli) tarafından incelenmeli ve onaylanmalıdır.',
    // Report ekranı
    report_generated_at: 'Rapor oluşturulma tarihi: {date}',
    report_minutes: '{minutes} dk',
    report_no_usage_days: 'Henüz kayıtlı bir kullanım günü yok.',
    report_no_city_sessions: 'Henüz şehir temelli konuşma pratiği oturumu yapılmadı.',
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
    report_session_detail: '{minutes} dk • {turns} yanıt • {mic} mikrofon',
    report_stat_stars: 'Toplam Yıldız',
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
    aac_edit_btn: 'Düzenle',
    aac_edit_done: 'Bitti',
    aac_hold_to_edit: 'Düzenlemek için 2 saniye basılı tutun',
    aac_add_symbol: '+ Sembol',
    aac_add_category: '+ Kategori',
    aac_edit_category: '✏️ Kategori',
    aac_new_board_name: 'Yeni kategori adı:',
    aac_card_edit_title: '✏️ Kartı Düzenle',
    aac_board_edit_title: '✏️ Kategoriyi Düzenle',
    aac_card_label: 'Kart adı',
    aac_card_spoken: 'Söylenecek metin',
    aac_board_label: 'Kategori adı',
    aac_save: 'Kaydet',
    aac_delete: '🗑️ Sil',
    aac_move: '↔️ Taşı',
    aac_move_hint: 'Taşımak için boş bir kutuya dokun',
    aac_move_other_board: 'Bu kartı taşımak için önce kendi kategorisine geç',
    aac_delete_confirm: 'Bu kart silinsin mi?',
    aac_board_delete_confirm: 'Bu kategori ve içindeki tüm kartlar silinsin mi?',
    aac_last_board: 'Son kategori silinemez',
    aac_settings_title: '⚙️ AAC Ayarları',
    aac_grid_size: 'Izgara boyutu (satır × sütun)',
    aac_core_strip: 'Çekirdek şerit (üstteki hızlı kartlar)',
    aac_tts_rate: 'Konuşma hızı',
    aac_shrink_warn: 'Küçültme bazı kartları gizleyecek (silinmez, ızgara büyütülünce geri gelir). Devam edilsin mi?',
    therapy_card_answer_btn: '🗂️ Kartla Yanıtla',
    therapy_wait_turn: 'Önce Yıldız Can konuşmasını bitirsin',
    analysis_card_label: 'Kartla Yanıt',
    analysis_card_hint: 'AAC kartlarına dokunarak yanıt verdi',
    analysis_summary_card: 'Ayrıca yanıtların %{pct} kadarını iletişim kartlarıyla verdi.',
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
    veli_consent_pre: 'Bu öğrencinin velisi ',
    veli_consent_link: 'KVKK Aydınlatma Metni',
    veli_consent_post: ' kapsamında bilgilendirildi ve rıza verdi.',
    guest_name_hint: 'Denemek için gerçek isim yerine takma ad yazabilirsiniz.',
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

    bep_cat_ogreti: 'Hafif Düzey – Öğretilebilir',
    bep_cat_egit: 'Orta Düzey – Eğitilebilir',
    bep_cat_destekli: 'Ağır/İleri – Desteklenen',

    bep_cond_osb: 'OSB',
    bep_cond_dehb: 'DEHB',
    bep_cond_dil: 'Dil / Konuşma',
    bep_cond_down: 'Down Sendromu',
    bep_cond_cp: 'Serebral Palsi',
    bep_cond_oog: 'Öz. Öğrenme Güçlüğü',
    bep_cond_ekolali: 'Ekolali',
    bep_cond_stereotipik: 'Stereotipik Hareket',

    object_title: '🔍 Nesne Tanıma',
    object_rotate_hint: '👆 Döndürmek için sürükle',
    object_prompt: 'Bu ne? Mikrofona söyle ya da yaz',
    object_type_ph: 'Cevabını yaz...',
    object_submit_btn: 'Gönder',
    object_skip_btn: 'Bilmiyorum, geç →',
    object_skip_answer: 'Cevap: {label} idi',
    object_no_input: 'Bir şey duyamadım, tekrar dener misin?',
    object_correct: 'Doğru! Aferin!',
    object_try_again: 'Tekrar dene!',
    object_wrong: 'Olmadı, bir daha dene!',
    object_progress: '{a} / {t}',
    object_complete_title: 'Hepsini Bildin!',
    object_complete_sub: 'Nesne tanımada harikaydın!',
    object_play_again: '🔁 Tekrar Oyna',
    object_back_to_menu: '← Menüye Dön',
    report_no_obj: 'Henüz nesne tanıma oynanmadı.',
    obj_summary_line: '{plays} oyun • %{acc} doğruluk • {perfect} hatasız',
    obj_ball: 'Top',
    obj_star: 'Yıldız',
    obj_apple: 'Elma',
    obj_balloon: 'Balon',
    obj_tree: 'Ağaç',
    obj_fish: 'Balık',
    obj_cup: 'Bardak',
    obj_strawberry: 'Çilek',
    obj_icecream: 'Dondurma',
    obj_sun: 'Güneş',
    obj_banana: 'Muz',
    obj_train: 'Tren',
    obj_plane: 'Uçak',

    therapy_topic_title: 'Hangi konuyu çalışalım?',
    therapy_topic_sub: 'Bir konu yaz, Yıldız Can o konuyla ilgili sorular soracak.',
    therapy_topic_placeholder: 'örn: alışveriş, futbol, okul...',
    therapy_level_title: 'Hangi düzeyde başlamak istersin?',
    therapy_level_word: 'Tek Kelime',
    therapy_level_word_example: 'Örn: su, anne, top',
    therapy_level_sentence: 'Kısa Cümle',
    therapy_level_sentence_example: 'Örn: Okula annemle giderim',
    therapy_level_tell: 'Anlat Bakalım',
    therapy_level_tell_example: 'Örn: Bugün neler yaptığını anlat',
    therapy_start_btn: 'Başla →',
    therapy_error_no_topic: 'Başlamak için önce bir konu yaz ya da seç ✏️',
    therapy_error_no_level: 'Başlamak için bir düzey seç 👆',
    therapy_loading: 'Sorular hazırlanıyor...',
    therapy_progress: 'Soru {a} / {t}',
    therapy_fallback_q: '{topic} hakkında ne düşünüyorsun?',
    therapy_complete_title: 'Tebrikler!',
    therapy_complete_msg: 'Bu konuyu tamamladın! Yeni bir konu seçebilir ya da menüye dönebilirsin.',
    therapy_complete_new_topic: 'Yeni Konu Seç',
    therapy_complete_menu: 'Menüye Dön',
    video_loading: 'Video yükleniyor...',
    topic_shopping: 'Alışveriş',
    topic_school: 'Okul',
    topic_football: 'Futbol',
    topic_friendship: 'Arkadaşlık',
    topic_food: 'Yemek',
    topic_emotions: 'Duygular',
    app_name: 'YıldızCan',
    bottom_nav_home: 'Ana Ekran',
    bottom_nav_therapy: 'Konuşma',
    bottom_nav_aac: 'AAC',
    bottom_nav_schedule: 'Görevler',
    bottom_nav_analysis: 'Analiz',
    mic_prompt: 'Konuşmak için mikrofona bas!',
    welcome_sub: 'Bugün ne yapmak istersin?',
    logout: 'Çıkış Yap',
    repeat_btn: '🔄 Tekrar Et',
    simplify_btn: '🟢 Daha Basit',
    tab_analysis: 'BEP Analizi',
    tab_parent: 'Veli Özeti',
    analysis_title: 'Konuşma Pratiği Performans Analizi',
    analysis_date_label: 'Analiz tarihi:',
    analysis_lang_title: 'Dil ve Sosyal Uyum Göstergeleri',
    analysis_ind_comm: 'İletişim Bağımsızlığı',
    analysis_ind_comm_hint: 'Hiçbir yardım almadan doğrudan mikrofona konuştu',
    analysis_repeat_label: 'Tekrar Dinleme İhtiyacı',
    analysis_repeat_hint: '"Tekrar Et" butonuna basarak soruyu yeniden dinledi',
    analysis_simplify_label: 'Dil Adaptasyon İhtiyacı',
    analysis_simplify_hint: '"Daha Basit" butonu ile dili hafifletmesini istedi',
    analysis_no_data: 'Henüz seans kaydı yok. İlk konuşma pratiği seansını tamamladıktan sonra veriler burada görünür.',
    analysis_collecting: '{n} seans kaydı var. Bağımsız konuşma verisi toplanıyor.',
    analysis_summary: '{name}, son {n} seansta %{ind} oranında tamamen bağımsız konuştu{rep}{sim}.',
    analysis_summary_rep: ', %{pct} oranında tekrar dinlemeye',
    analysis_summary_sim: ' ve %{pct} oranında dili basitleştirmeye',
    analysis_summary_need: ' ihtiyaç duydu',
    report_eval_fallback: '{name}\'in bu oturumda uygulamaya aktif katılım gösterdiği görülmektedir. Düzenli oturumlar çocuğun konuşma güveni ve ifade becerilerini destekleyecektir. Yıldız Can ile çalışmaya devam etmenizi öneririz.',
    info_next_question: 'Hadi yeni soruya geçelim! ➡️',
    info_no_speech_support: 'Tarayıcı ses tanımayı desteklemiyor. Chrome veya Edge kullanmayı dene.',
    info_no_speech_native: 'Bu cihazda konuşma tanıma kullanılamıyor. Lütfen tekrar dene ya da farklı bir cihazla dene.',
    info_press_next: 'İleri butonuna basabilirsin! ➡️',
    info_listening: 'Seni dinliyorum... 🎙️',
    info_no_sound: 'Sesi duymadım, tekrar dene!',
    info_repeat_please: 'Duyamadım, tekrar eder misin?',
    therapy_session_end: 'Seninle konuşmak harikaydı! Hadi şimdi yeni bir videoya bakalım!',
    city_open_area: '{label} alanını aç',
    city_go_therapy: 'Konuşma Pratiğine Git',
    city_in_focus: '{label} odakta',
    star_title_5: 'Muhteşemsin! 🎉',
    star_sub_5: 'Bu seans kendi başına çok güzel konuştun!',
    star_title_3: 'Aferin! ⭐',
    star_sub_3: 'Harika bir seans geçirdin, her gün daha iyisin!',
    star_title_1: 'Eline sağlık! 💪',
    star_sub_1: 'Bugün de konuşmak için çaba gösterdin, bu çok değerli!',
    star_close_btn: 'Harika! ✨',
    menu_panel_mode: 'Panel Modu',
    menu_panel_parent: 'YıldızCan Paneli',
    menu_panel_copy_parent: 'Seçili öğrenci için uygun çalışmayı seçip gelişimini tek panelden izleyebilirsin.',
    menu_student_summary: 'Öğrenci Özeti',
    menu_not_selected: 'Henüz seçilmedi',
    menu_student_summary_hint: 'Öğrenci seçince notları ve temel bilgileri burada göreceksin.',
    menu_total_students: 'Toplam Öğrenci',
    menu_count_copy_parent: 'Bu hesapta takip edilen aktif öğrenci sayısı.',
    sd_selected_student: 'Seçili Öğrenci',
    sd_none_selected: 'Öğrenci seçilmedi',
    sd_pick_hint: 'Bir öğrenci seçtiğinde güçlü yönler, destek notları ve oturum özeti burada görünür.',
    sd_manage_btn: 'Öğrenci Yönet',
    sd_support_note: 'Destek Notu',
    sd_note_empty: 'Henüz destek notu eklenmedi.',
    sd_focus_label: 'Öğrenme Odağı',
    sd_focus_empty: 'Destek notlarına göre odak alanı burada özetlenir.',
    sd_last_session: 'Son Oturum',
    sd_no_session: 'Henüz kayıtlı oturum yok.',
    sd_total_sessions: 'Toplam Oturum',
    sd_total_minutes: 'Toplam Dakika',
    sd_last_summary: 'Son Kayıt Özeti',
    sd_session_line: '{date} tarihinde {min} dk, {turns} yanıt',
    sd_turns_line: '{n} yanıt',
    sd_subtitle_default: 'Seçili öğrenci için destek notları ve oturum özeti burada.',
    sd_subtitle_with_year: 'Doğum yılı {year}. Seçili öğrenci için destek notları ve oturum özeti burada.',
    sd_birth_year: 'Doğum yılı: {y}',
    sd_birth_missing: 'Doğum yılı girilmedi',
    sd_unnamed: 'İsimsiz öğrenci',
    min_unit: 'dk',
    la_age_48: '4-8 yaş',
    la_age_47: '4-7 yaş',
    la_speech_title: 'Konuşma ve İfade',
    la_speech_sum: 'Kısa cümle kurma, soru anlama ve ihtiyaç ifade etme becerileri.',
    la_speech_o1: 'Basit sorulara uygun yanıt verir',
    la_speech_o2: 'Tek kelime yerine kısa cümle kurar',
    la_speech_o3: 'İhtiyacını sözel olarak ifade eder',
    la_speech_plan: 'Konuşma pratiği ekranında kısa soru, yanıt ve geri bildirimle ilerler.',
    la_visual_title: 'Görsel Dikkat',
    la_visual_sum: 'Eşleştirme, sıralama ve yönerge takibi için görsel hazırlık alanı.',
    la_visual_o1: 'Görsel eşleştirme yapar',
    la_visual_o2: 'Sıralı yönergeyi takip eder',
    la_visual_o3: 'Farklılıkları ayırt eder',
    la_visual_plan: 'Kart, eşleştirme ve adım takibi etkinlikleriyle kısa görevler sunulur.',
    la_daily_title: 'Günlük Yaşam Becerileri',
    la_daily_sum: 'Rutin, bekleme, yardım isteme ve temel özbakım davranışları.',
    la_daily_o1: 'Günlük rutinleri tanır',
    la_daily_o2: 'Yardım isteme davranışı geliştirir',
    la_daily_o3: 'Bekleme ve sıra alma becerisini uygular',
    la_daily_plan: 'Gerçek yaşam senaryoları ve kısa karar kartlarıyla çalışılır.',
    report_first_focus: 'Önerilen ilk odak',
    report_answer_prefix: 'Yanıt: ',
    report_other: 'Diğer',
    report_new_questions: 'Bu alanda yeni sorular çalışıldı.',
    report_story_full: '✅ Tam',
    report_preparing: 'Hazırlanıyor...',
    report_stat_sessions: 'Bu Hafta Seans',
    report_stat_duration: 'Bu Hafta Süre',
    report_stat_story: 'Hikâye İlerlemesi',
    report_stat_turns: 'Bu Hafta Yanıt',
    report_stat_intervention: 'Zorlandığı / Olumlu Seçimler',
    report_choice_analysis: '🔍 Seçim Analizi',
    report_speech_summary: '🎙️ Konuşma Pratiği Özeti',
    report_ai_eval: "🤖 Yıldız Can'ın Değerlendirmesi",
    report_no_story: 'Henüz hikâye oturumu yapılmadı.',
    report_no_session: 'Henüz oturum yapılmadı.',
    report_print: '🖨️ Yazdır',
    login_pick_who: 'Kim olduğunu seç!',
    login_add_student: '+ Yeni Öğrenci Ekle',
    login_no_students: 'Henüz öğrenci eklenmedi.',
    login_add_first: 'Aşağıdan ilk öğrenciyi ekleyin!',
    student_fallback: 'Öğrenci',
    student_notes_ph: 'Destek notu, ilgi alanı...',
    btn_create: 'Oluştur',
    auth_waiting: 'Bekleniyor...',
    schedule_screen_title: '🎯 Günlük Görevler',
    schedule_sub: 'Her gün farklı görevler seni bekliyor. Tamamladıkça yıldız kazanırsın!',
    task_therapy: '{n} konuşma pratiği seansı tamamla',
    task_object: '{n} nesne tanıma sorusu tamamla',
    task_completed: '✓ Görev tamamlandı: {label} — +5 ⭐',
    task_all_done_toast: '🏆 Bugünün tüm görevlerini bitirdin! +10 ⭐ bonus',
    task_all_done_title: 'Bugünü Tamamladın!',
    task_all_done_sub: 'Yarın yeni görevler seni bekliyor. Harikasın!',
    aac_add_card: '➕ Kart Ekle',
    aac_mode_emoji: '😊 Emoji',
    aac_mode_photo: '📷 Fotoğraf',
    aac_photo_search_ph: 'Kelime ara... (elma, köpek, oyun)',
    aac_photo_hint: 'Türkçe veya İngilizce kelime yaz, fotoğraflar gelsin.',
    aac_card_name_ph: 'Kart adı yaz...',
    a11y_account: 'Hesap',
    search_btn: 'Ara',
    add_btn: 'Ekle',
    student_pill: 'Öğrenci seç',
    info_mic_permission: 'Mikrofon izni gerekli.',
    auth_login_success: 'Başarıyla giriş yapıldı! 👋',
    auth_register_success: 'Kayıt tamamlandı, hoş geldiniz! 🎉',
    bottom_nav_games: 'Nesne Tanıma',
    auth_forgot_link: 'Şifremi unuttum',
    auth_identifier_label: 'Kullanıcı Adı veya E-posta',
    auth_identifier_ph: 'kullaniciadi veya ornek@gmail.com',
    auth_new_password_label: 'Yeni Şifre',
    auth_reset_btn: 'Şifreyi Sıfırla',
    auth_back_to_login: '← Girişe dön',
    auth_reset_success: 'Şifreniz yenilendi!',
    verify_modal_title: 'E-postanızı Doğrulayın',
    verify_modal_sub: '{email} adresine 6 haneli doğrulama kodu gönderdik. 📁 Gelen kutunuzda yoksa SPAM/Gereksiz klasörüne bakın!',
    verify_modal_nudge: 'E-postanız henüz doğrulanmamış. "Kodu tekrar gönder"e basın, e-postanıza gelen 6 haneli kodu girin. 📁 Kod SPAM/Gereksiz klasörüne düşebilir!',
    verify_btn: 'Doğrula ✓',
    verify_resend: 'Kodu tekrar gönder',
    verify_later: 'Daha sonra',
    set_email_modal_title: 'E-posta Ekleyin',
    set_email_modal_sub: 'Devam etmek için hesabınıza geçerli bir e-posta adresi eklemelisiniz.',
    set_email_modal_btn: 'E-postayı Kaydet',
    verify_success: 'E-postanız doğrulandı! ✓',
    email_verified_label: 'Doğrulandı',
    email_unverified_label: 'Doğrulanmadı',
    email_missing_label: 'E-posta eklenmedi',
    AUTH_VERIFY_CODE_INVALID: 'Kod hatalı veya süresi dolmuş',
    AUTH_EMAIL_TAKEN: 'Bu e-posta başka bir hesapta kayıtlı',
    sync_last: 'Son senkron: {time}',
    sync_never: 'Henüz senkron olmadı',
    analysis_trend_title: 'Bağımsız Konuşma Gelişimi',
    analysis_trend_sub: 'Her seansta yardımsız konuşma oranı. Çizgi yukarı gidiyorsa bağımsızlık artıyor demektir.',
    analysis_trend_table: 'Tablo görünümü',
    analysis_trend_col_date: 'Tarih',
    analysis_trend_col_pct: 'Bağımsız %',
    ob_step1_title: 'Konuşma Pratiği ile başlayın',
    ob_step1_text: 'Bir konu yazın (örn. "alışveriş"), Yıldız Can o konuda sorular sorsun. Çocuk mikrofona konuşarak yanıt verir, anında teşvik alır.',
    ob_step2_title: 'Günlük Görevler ve AAC her zaman elinizde',
    ob_step2_text: 'Günlük Görevler ile çocuğu her gün farklı hedeflere yönlendirin, AAC panosuyla konuşamayan anlarda kartlara dokunarak iletişim kurun.',
    ob_step3_title: 'Gelişim kendiliğinden kaydedilir',
    ob_step3_text: 'Her seans otomatik kaydedilir. Analiz ekranında gelişim grafiğini görün, veli raporu ve BEP taslağı oluşturun.',
    ob_skip: 'Atla',
    ob_next: 'İleri →',
    ob_start: 'Başlayalım! 🎉',
    auth_email_label: 'E-posta',
    AUTH_EMAIL_REQUIRED: 'E-posta adresi gerekli',
    auth_reset_email_info: 'Kullanıcı adınızı veya e-postanızı girin, kayıtlı e-postanıza sıfırlama kodu gönderelim.',
    auth_send_code_btn: 'E-postama Kod Gönder',
    auth_email_code_label: 'E-postadaki 6 Haneli Kod',
    auth_code_sent_info: 'Kod {email} adresine gönderildi. 📁 Gelen kutunuzda yoksa SPAM/Gereksiz klasörüne bakın!',
    auth_code_sent_generic: 'Bilgileriniz kayıtlıysa e-posta adresinize kod gönderildi. 📁 SPAM/Gereksiz klasörünü de kontrol edin!',
    auth_code_sent_toast: 'Sıfırlama kodu gönderildi! 📧',
    auth_reset_requested_generic: 'Bilgileriniz kayıtlıysa e-postanıza bir sıfırlama kodu gönderildi.',
    auth_email_not_verified_register: 'Bu hesabın e-postası henüz doğrulanmamış. Kod gelmediyse Kayıt Ol sekmesinden tekrar deneyin.',
    auth_use_recovery_code: 'Kurtarma kodum var',
    auth_use_email_code: 'E-posta ile sıfırla',
    AUTH_NO_EMAIL: 'Bu hesapta kayıtlı e-posta yok. Kurtarma kodunuzla sıfırlayabilirsiniz.',
    AUTH_EMAIL_INVALID: 'Geçerli bir e-posta adresi girin',
    AUTH_RESET_CODE_INVALID: 'Kod hatalı veya süresi dolmuş',
    AUTH_RESET_TOO_SOON: 'Az önce kod gönderildi, lütfen e-postanızı kontrol edin',
    a11y_set_email: '📧 E-posta Ekle/Güncelle',
    a11y_email_label: 'E-posta',
    a11y_email_edit: 'Düzenle',
    set_email_prompt: 'Şifre sıfırlama için e-posta adresiniz:',
    set_email_success: 'E-posta kaydedildi: {email}',
    parent_gate_title: 'Veli Kapısı',
    parent_gate_sub: 'Bu bölüm yetişkinler içindir. Devam etmek için sonucu yazın:',
    parent_gate_wrong: 'Cevap doğru değil, tekrar deneyin.',
    parent_gate_ok: 'Devam',
    weekly_title: '📬 Bu Haftanın Özeti',
    weekly_loading: 'Haftalık özet hazırlanıyor...',
    weekly_refresh: '↻ Yenile',
    weekly_empty: 'Bu hafta henüz pratik yapılmadı. Kısa bir seans her zaman iyi bir başlangıçtır.',
    weekly_empty_btn: '🎤 Pratiği Başlat',
    weekly_tip_label: '🏠 Evde deneyin',
    routine_title: '⏰ Günlük Hatırlatma',
    routine_sub: 'Pratik için en uygun saati seçin; o saatte tek ve nazik bir hatırlatma gönderelim. Kaçan gün dert değil.',
    routine_enable: 'Hatırlatmayı Kur',
    routine_disable: 'Kapat',
    routine_active: 'Her gün {time} için kurulu ✓',
    routine_off: 'Hatırlatma kapalı',
    routine_native_only: 'Hatırlatma bildirimi mobil uygulamada çalışır.',
    routine_notif_title: 'YıldızCan',
    routine_notif_body: '{name} için yıldız vakti 🌟 Kısa bir pratiğe ne dersiniz?',
    routine_notif_denied: 'Bildirim izni verilmediği için hatırlatma kurulamadı.',
    routine_saved_toast: 'Hatırlatma kuruldu: her gün {time} ⏰',
    routine_removed_toast: 'Hatırlatma kapatıldı',
    auth_guest_try: 'Uygulamayı Keşfet',
    auth_guest_hint: 'Kayıt olmadan dene',
    guest_banner_title: '👀 Misafir modundasın — deneme hakkın: 1 konuşma pratiği + 1 nesne tanıma',
    guest_banner_sub: 'Kayıt tamamen ücretsiz: tüm etkinliklere tam erişim kazanırsın, ilerlemen kaybolmaz.',
    guest_banner_btn: 'Ücretsiz Kayıt Ol',
    guest_limit_title: 'Deneme hakkın doldu 🌟',
    guest_limit_sub: 'Beğendiysen ücretsiz kayıt ol — tüm etkinliklere tam erişim kazanırsın, ilerlemen buluta yedeklenir ve verilerin kaybolmaz.',
    guest_limit_btn: 'Ücretsiz Kayıt Ol',
    guest_limit_later: 'Menüye dön',
    therapy_complete_stat: '{name} bugün {n} soruya cevap verdi! 👏',
    therapy_complete_show: 'Bu ekranı ailene göster 🌟',
    first_run_toast: 'Harika, hazırsınız! İlk pratik için bir konu seçin 🎤',

    map_title: 'Konu Haritası',
    map_greeting: 'Merhaba!',
    map_greeting_sub: 'Konuşma pratiğine başlamadan önce konu yolculuğunu tamamlayalım.',
    map_star_points: 'Yıldız Puanın',
    map_progress_label: 'İlerleme Durumun',
    map_bubble: 'Her konuyu tamamla, yeni maceraların kilidini aç!',
    map_completed: 'Tamamlandı!',
    map_locked_toast: 'Önce "{label}" konusunu tamamla 🔒',
    map_level_chip: '🎚️ Düzey: {level}',
    map_level_modal_title: 'Hangi düzeyde çalışalım?',
    map_level_modal_sub: 'İstediğin zaman haritadan değiştirebilirsin.',
    map_finished_title: 'Şehir Kaşifi! 🏆',
    map_finished_sub: 'Bütün konuları tamamladın! İstediğin konuyu tekrar çalışabilirsin.',
    map_complete_next: '🎉 Yeni konu açıldı: {label}',
    map_back_to_map: '🗺️ Haritaya Dön',

    map_topic_greetings: 'Selamlaşma',
    map_topic_introduce: 'Kendini Tanıtma',
    map_topic_emotions: 'Duygularını İfade Etme',
    map_topic_daily: 'Günlük Aktiviteler',
    map_topic_school: 'Okul ve Arkadaşlar',
    map_topic_food: 'Yemek ve İçecekler',
    map_topic_hobbies: 'Hobiler ve İlgi Alanları',
    map_topic_places: 'Yerler ve Yönler',
    map_topic_problem: 'Problem Çözme',
    map_topic_dreams: 'Hayaller ve Gelecek',

    map_greet_q1: 'Sabah uyanınca ailene ne dersin?',
    map_greet_qgoal1: 'Günaydın deme',
    map_intro_q1: 'Senin adın ne? Bana söyler misin?',
    map_intro_qgoal1: 'Adını söyleme',
    map_intro_q2: 'Kaç yaşındasın?',
    map_intro_qgoal2: 'Yaşını söyleme',
    map_intro_q3: 'Evde kimlerle yaşıyorsun?',
    map_intro_qgoal3: 'Aile üyelerini sayma',
    map_intro_q4: 'En sevdiğin oyuncağın ne? Bana anlatır mısın?',
    map_intro_qgoal4: 'Sevdiği şeyi tanıtma',
    map_food_q1: 'En sevdiğin yemek ne?',
    map_food_qgoal1: 'Yemek tercihini söyleme',
    map_hobby_q1: 'Boş zamanında ne yapmayı seversin?',
    map_hobby_qgoal1: 'Hobisini anlatma',
    map_hobby_q2: 'En sevdiğin çizgi film hangisi?',
    map_hobby_qgoal2: 'Tercihini söyleme',
    map_hobby_q3: 'Hangi oyunları oynamayı seversin?',
    map_hobby_qgoal3: 'Sevdiği oyunları sayma',
    map_places_q1: 'Okula nasıl gidiyorsun? Yürüyerek mi, arabayla mı?',
    map_places_qgoal1: 'Ulaşım şeklini söyleme',
    map_places_q2: 'Evde en çok hangi odada olmayı seversin?',
    map_places_qgoal2: 'Yer bildirme',
    map_places_q3: 'Parka gitmek istediğinde kime, ne söylersin?',
    map_places_qgoal3: 'İstek bildirme',
    map_places_q4: 'Gezmek için nereye gitmeyi seversin? Park mı, deniz mi?',
    map_places_qgoal4: 'Yer tercihi söyleme',
    map_problem_q1: 'Yüksekteki bir şeye ulaşamazsan ne yaparsın, kimden yardım istersin?',
    map_problem_qgoal1: 'Yardım isteme',
    map_problem_q2: 'Oyuncağın kırılırsa ne yaparsın?',
    map_problem_qgoal2: 'Sorun karşısında çözüm söyleme',
    map_dream_q1: 'Büyüyünce ne olmak istersin?',
    map_dream_qgoal1: 'Hayalini söyleme',
    map_dream_q2: 'Bir süper gücün olsaydı ne yapmak isterdin?',
    map_dream_qgoal2: 'Hayal kurup anlatma',
    map_dream_q3: 'Bir gün nereye seyahat etmek isterdin?',
    map_dream_qgoal3: 'Yer tercihi söyleme',
    map_dream_q4: 'Doğum gününde ne hediye istersin?',
    map_dream_qgoal4: 'İstek bildirme',
    map_dream_q5: 'Yarın ne yapmak istersin?',
    map_dream_qgoal5: 'Plan anlatma',
    map_dream_q6: 'En büyük hayalin ne? Bana anlatır mısın?',
    map_dream_qgoal6: 'Hayalini anlatma',
  },
  en: {
    back_menu: '← Menu',
    back_menu_plain: 'Menu',
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
    auth_tagline: 'Special education management platform',
    auth_username_label: 'Username',
    auth_password_label: 'Password',
    auth_password_hint: '(at least 6 characters)',
    auth_password_repeat: 'Confirm Password',
    auth_student_name: "Student's Name",
    auth_student_emoji: 'Student Emoji',
    auth_edu_level: 'Education Level',
    auth_level_mild: 'Mild – Educable',
    auth_level_moderate: 'Moderate – Trainable',
    auth_level_severe: 'Severe – Supported',
    auth_diagnosis: 'Diagnosis / Co-occurring Conditions',
    auth_cond_osb: 'ASD',
    auth_cond_dehb: 'ADHD',
    auth_cond_dil: 'Speech / Language',
    auth_cond_down: 'Down Syndrome',
    auth_cond_cp: 'Cerebral Palsy',
    auth_cond_oog: 'Learning Disability',
    auth_cond_ekolali: 'Echolalia',
    auth_cond_stereotipik: 'Stereotypic Movement',
    reg_username_placeholder: 'e.g.: john_teacher (letters, numbers, _)',
    reg_student_placeholder: 'e.g.: Alex',
    auth_kvkk_link1: 'Privacy Notice',
    auth_kvkk_sep: ' and',
    auth_kvkk_link2: 'Privacy Policy',
    auth_kvkk_agree: ' – I have read and agree.',
    auth_fill_all: 'Please fill in all fields',
    auth_passwords_mismatch: 'Passwords do not match',
    auth_password_short: 'Password must be at least 6 characters',
    auth_kvkk_required: 'You must accept the Privacy Notice to continue',
    AUTH_FIELDS_REQUIRED: 'Username and password are required',
    AUTH_USERNAME_TOO_SHORT: 'Username must be at least 3 characters',
    AUTH_PASSWORD_TOO_SHORT: 'Password must be at least 6 characters',
    AUTH_USERNAME_INVALID_CHARS: 'Only letters, numbers and underscores are allowed',
    AUTH_USERNAME_TAKEN: 'This username is already taken',
    AUTH_INVALID_CREDENTIALS: 'Incorrect username or password',
    AUTH_TOO_MANY_ATTEMPTS: 'Too many failed attempts. Try again in 15 minutes or reset your password',
    AUTH_RATE_LIMITED: 'Too many requests, please try again in a little while.',
    SERVER_ERROR: 'Server error, please try again',
    setup_title: 'Student Information',
    setup_name: 'Student name',
    setup_age: 'Age',
    setup_level: 'Support level',
    setup_btn: 'Start',
    menu_greeting_default: 'Hello!',
    menu_therapy: 'Speech Practice',
    menu_therapy_desc: 'Answer questions out loud',
    menu_schedule: 'Daily Tasks',
    menu_schedule_desc: "Finish today's tasks",
    menu_report: 'Report',
    menu_aac: 'AAC',
    menu_aac_desc: 'Communicate with pictures',
    menu_sequence: 'Object Recognition',
    menu_sequence_desc: 'Recognize 3D objects, say it',
    menu_analysis_report: 'Analysis & Report',
    menu_analysis_report_desc: 'Track progress',
    menu_store: 'Clothing Store',
    menu_store_desc: 'Spend your stars, dress up',
    menu_parent_report: 'Parent Report',
    help_title: '❓ Help',
    help_sections_title: 'What Do The Sections Do?',
    help_therapy_desc: 'The AI asks the child questions and the child answers out loud; speech progress is tracked over time.',
    help_object_desc: 'The child inspects and rotates a 3D object, then says or types what it is; a correct answer moves to the next object.',
    help_aac_desc: 'Picture cards that help children who struggle with verbal communication express their needs and feelings.',
    help_schedule_desc: 'A different set of small tasks appears each day; completing them earns stars.',
    help_analysis_desc: 'Tracks the child\'s progress over time and generates a summary report for parents and specialists.',
    help_store_desc: 'A reward/motivation system where earned stars are spent to dress up the character.',
    help_faq_title: 'Frequently Asked Questions',
    help_faq_q1: '⭐ How do I earn stars?',
    help_faq_a1: 'Stars are earned by completing speech practice, object recognition, and daily tasks. They can be spent in the Clothing Store.',
    help_faq_q2: '👥 Can I add more than one student?',
    help_faq_a2: 'Yes. Use "Add New Student" from the student selection screen to add as many students as you like and switch between them.',
    help_faq_q3: '🔑 I forgot my password, what do I do?',
    help_faq_a3: 'Tap "Forgot my password" on the login screen and set a new password with the code sent to your email.',
    help_faq_q4: '🔒 Is my data safe?',
    help_faq_a4: 'Your data is stored on your device first, then backed up encrypted to the server tied to your account. You can export or permanently delete your data from the Accessibility panel.',
    stars_earned: 'You earned +{n} ⭐!',
    star_info_title: '⭐ How to Earn Stars?',
    star_info_therapy: 'Speak into the microphone without help during speech practice',
    star_info_object: 'Complete object recognition with no or few mistakes',
    star_info_schedule: 'Complete daily tasks',
    star_info_purpose: "Spend the stars you earn in the Clothing Store to buy hats, glasses and more accessories for the bear!",
    star_info_goto_store: 'Go to Clothing Store',
    store_title: '🏪 Clothing Store',
    store_cat_hat: 'Hats',
    store_cat_face: 'Face',
    store_cat_neck: 'Neck',
    store_buy_btn: 'Buy',
    store_equip_btn: 'Wear',
    store_unequip_btn: 'Remove',
    store_owned_label: 'Owned',
    store_equipped_label: 'Wearing ✓',
    store_need_more: '{n} more stars needed',
    store_bought_toast: '🎉 Bought {item}!',
    store_not_enough_toast: 'Not enough stars — collect {n} more!',
    acc_cap: 'Cap', acc_bowtie: 'Bow Tie', acc_glasses: 'Glasses', acc_sunhat: 'Sun Hat',
    acc_scarf: 'Scarf', acc_sunglasses: 'Sunglasses', acc_gradcap: 'Graduation Cap',
    acc_necklace: 'Necklace', acc_tophat: 'Top Hat', acc_medal: 'Medal',
    acc_mask: 'Mask', acc_helmet: 'Helmet', acc_crown: 'Crown',
    greet_child: 'Hello {name}! What shall we play today?',
    nudge_therapy_gap: 'No speech practice for {d} days — a quick session?',
    nudge_sort_again: '{game}: last accuracy {acc}% — try again!',
    nudge_first: "Let's begin! Do your first speech practice",
    menu_analysis: 'Analysis',
    therapy_title: 'Speech Practice',
    therapy_hint: 'Getting ready...',
    report_title: 'Report',
    report_generate: 'Generate Report',
    bep_title: 'IEP Draft',
    bep_generate: 'Generate IEP Draft',
    bep_disclaimer: '⚠️ This draft is for guidance only. It must be reviewed by a licensed special education specialist.',
    aac_title: 'AAC Board',
    a11y_title: '⚙️ Settings',
    a11y_large_text: 'Large Text',
    a11y_large_text_desc: 'Increases font size',
    a11y_high_contrast: 'High Contrast',
    a11y_high_contrast_desc: 'Increases color contrast',
    a11y_reduce_motion: 'Reduce Motion',
    a11y_reduce_motion_desc: 'Disables animations',
    a11y_large_touch: 'Large Touch',
    a11y_large_touch_desc: 'Increases button size',
    a11y_export: '📥 Export My Data',
    a11y_logout: '🚪 Log Out',
    sound_hint: '🔔 If you can\'t hear anything, check your phone\'s silent switch.',
    offline_banner: '📡 No internet connection — you need to be online to sign in.',
    offline_toast: 'You\'re offline — online features are disabled and your progress will sync when you reconnect.',
    offline_action: 'This activity needs an internet connection 📡',
    a11y_delete: '🗑️ Delete Account',
    a11y_privacy: 'Privacy Policy & KVKK',
    lang_toggle: 'TR',
    score_label: 'pts',
    choose_student: 'Select or add a student',
    add_new_student: '+ Add New Student',
    student_placeholder: 'Student name',
    age_label: 'Age',
    level_label: 'Support level',
    level1: 'Mild',
    level2: 'Moderate',
    level3: 'Severe',
    start_btn: 'Start',
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
    confirm_delete: 'Are you sure you want to delete?',
    data_saved: 'Saved',
    copy_success: 'Copied',
    no_student: 'No student selected',
    // BEP screen
    bep_preparing: '⏳ Preparing draft...',
    bep_draft_failed: 'Could not generate draft. The Gemini API did not respond.',
    bep_error_prefix: 'Error: ',
    bep_copied_btn: '✓ Copied!',
    bep_copy_btn: '📋 Copy Text',
    bep_generate_ai_btn: '⚡ Generate AI IEP Draft',
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
    report_session_detail: '{minutes} min • {turns} responses • {mic} microphone',
    report_stat_stars: 'Total Stars',
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
    aac_edit_btn: 'Edit',
    aac_edit_done: 'Done',
    aac_hold_to_edit: 'Hold for 2 seconds to edit',
    aac_add_symbol: '+ Symbol',
    aac_add_category: '+ Category',
    aac_edit_category: '✏️ Category',
    aac_new_board_name: 'New category name:',
    aac_card_edit_title: '✏️ Edit Card',
    aac_board_edit_title: '✏️ Edit Category',
    aac_card_label: 'Card name',
    aac_card_spoken: 'Spoken text',
    aac_board_label: 'Category name',
    aac_save: 'Save',
    aac_delete: '🗑️ Delete',
    aac_move: '↔️ Move',
    aac_move_hint: 'Tap an empty slot to move',
    aac_move_other_board: "Switch to this card's category first to move it",
    aac_delete_confirm: 'Delete this card?',
    aac_board_delete_confirm: 'Delete this category and all its cards?',
    aac_last_board: "The last category can't be deleted",
    aac_settings_title: '⚙️ AAC Settings',
    aac_grid_size: 'Grid size (rows × columns)',
    aac_core_strip: 'Core strip (quick cards at the top)',
    aac_tts_rate: 'Speech rate',
    aac_shrink_warn: 'Shrinking will hide some cards (not deleted; they return when the grid grows). Continue?',
    therapy_card_answer_btn: '🗂️ Answer with Cards',
    therapy_wait_turn: "Let Yıldız Can finish speaking first",
    analysis_card_label: 'Card Responses',
    analysis_card_hint: 'Answered by tapping AAC cards',
    analysis_summary_card: 'Also gave {pct}% of responses using communication cards.',
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
    veli_consent_pre: "This student's parent/guardian has been informed via the ",
    veli_consent_link: 'Privacy Notice (KVKK)',
    veli_consent_post: ' and has given consent.',
    guest_name_hint: 'You can use a nickname instead of a real name while trying the app.',
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

    bep_cat_ogreti: 'Mild Level – Educable',
    bep_cat_egit: 'Moderate Level – Trainable',
    bep_cat_destekli: 'Severe/Advanced – Supported',

    bep_cond_osb: 'ASD',
    bep_cond_dehb: 'ADHD',
    bep_cond_dil: 'Language / Speech',
    bep_cond_down: 'Down Syndrome',
    bep_cond_cp: 'Cerebral Palsy',
    bep_cond_oog: 'Specific Learning Disability',
    bep_cond_ekolali: 'Echolalia',
    bep_cond_stereotipik: 'Stereotypic Movement',

    object_title: '🔍 Object Recognition',
    object_rotate_hint: '👆 Drag to rotate',
    object_prompt: 'What is this? Say it or type it',
    object_type_ph: 'Type your answer...',
    object_submit_btn: 'Submit',
    object_skip_btn: "I don't know, skip →",
    object_skip_answer: 'The answer was: {label}',
    object_no_input: "I didn't catch that, try again?",
    object_correct: 'Correct! Well done!',
    object_try_again: 'Try again!',
    object_wrong: "Not quite, try again!",
    object_progress: '{a} / {t}',
    object_complete_title: 'You Got Them All!',
    object_complete_sub: 'Great job recognizing objects!',
    object_play_again: '🔁 Play Again',
    object_back_to_menu: '← Back to Menu',
    report_no_obj: 'No object recognition played yet.',
    obj_summary_line: '{plays} plays • {acc}% accuracy • {perfect} flawless',
    obj_ball: 'Ball',
    obj_star: 'Star',
    obj_apple: 'Apple',
    obj_balloon: 'Balloon',
    obj_tree: 'Tree',
    obj_fish: 'Fish',
    obj_cup: 'Cup',
    obj_strawberry: 'Strawberry',
    obj_icecream: 'Ice Cream',
    obj_sun: 'Sun',
    obj_banana: 'Banana',
    obj_train: 'Train',
    obj_plane: 'Plane',

    therapy_topic_title: 'What topic shall we work on?',
    therapy_topic_sub: 'Type a topic and Yıldız Can will ask questions about it.',
    therapy_topic_placeholder: 'e.g. shopping, sports, school...',
    therapy_level_title: 'How would you like to start?',
    therapy_level_word: 'One Word',
    therapy_level_word_example: 'e.g. water, mom, ball',
    therapy_level_sentence: 'Short Sentence',
    therapy_level_sentence_example: 'e.g. I go with my mom',
    therapy_level_tell: 'Tell Me More',
    therapy_level_tell_example: 'e.g. Tell me what you did today',
    therapy_start_btn: 'Start →',
    therapy_error_no_topic: 'Type or pick a topic to start ✏️',
    therapy_error_no_level: 'Choose a level to start 👆',
    therapy_loading: 'Getting questions ready...',
    therapy_progress: 'Question {a} / {t}',
    therapy_fallback_q: 'What do you think about {topic}?',
    therapy_complete_title: 'Well done!',
    therapy_complete_msg: 'You completed this topic! Pick a new topic or go back to the menu.',
    therapy_complete_new_topic: 'New Topic',
    therapy_complete_menu: 'Back to Menu',
    video_loading: 'Loading video...',
    topic_shopping: 'Shopping',
    topic_school: 'School',
    topic_football: 'Football',
    topic_friendship: 'Friendship',
    topic_food: 'Food',
    topic_emotions: 'Emotions',
    app_name: 'YildizCan',
    bottom_nav_home: 'Home',
    bottom_nav_therapy: 'Speech',
    bottom_nav_aac: 'AAC',
    bottom_nav_schedule: 'Tasks',
    bottom_nav_analysis: 'Analysis',
    mic_prompt: 'Press the microphone to speak!',
    welcome_sub: 'What would you like to do today?',
    logout: 'Log Out',
    repeat_btn: '🔄 Repeat',
    simplify_btn: '🟢 Simpler',
    tab_analysis: 'IEP Analysis',
    tab_parent: 'Parent Summary',
    analysis_title: 'Speech Practice Performance Analysis',
    analysis_date_label: 'Analysis date:',
    analysis_lang_title: 'Language and Social Indicators',
    analysis_ind_comm: 'Communication Independence',
    analysis_ind_comm_hint: 'Spoke directly into the microphone without any help',
    analysis_repeat_label: 'Need for Repeat Listening',
    analysis_repeat_hint: 'Listened to the question again using the "Repeat" button',
    analysis_simplify_label: 'Language Adaptation Need',
    analysis_simplify_hint: 'Requested simpler language using the "Simpler" button',
    analysis_no_data: 'No sessions recorded yet. Complete your first speech practice session to see data here.',
    analysis_collecting: '{n} session(s) recorded. Independent speech data is being collected.',
    analysis_summary: '{name} spoke fully independently {ind}% of the time across the last {n} session(s){rep}{sim}.',
    analysis_summary_rep: ', needed to re-listen {pct}%',
    analysis_summary_sim: ' and requested simpler language {pct}%',
    analysis_summary_need: '',
    report_eval_fallback: '{name} showed active engagement with the app during this session. Regular sessions will support the child\'s speech confidence and expressive skills. We recommend continuing to work with Yıldız Can.',
    info_next_question: "Let's move on to a new question! ➡️",
    info_no_speech_support: 'Your browser does not support speech recognition. Try Chrome or Edge.',
    info_no_speech_native: 'Speech recognition is not available on this device. Please try again or use a different device.',
    info_press_next: 'You can press the next button! ➡️',
    info_listening: "I'm listening... 🎙️",
    info_no_sound: "I didn't hear you, try again!",
    info_repeat_please: "I couldn't hear that, can you say it again?",
    therapy_session_end: "It was great talking with you! Let's look at a new video now!",
    city_open_area: 'Open the {label} area',
    city_go_therapy: 'Go to Speech Practice',
    city_in_focus: '{label} in focus',
    star_title_5: "You're amazing! 🎉",
    star_sub_5: 'You spoke wonderfully on your own this session!',
    star_title_3: 'Well done! ⭐',
    star_sub_3: "You had a great session, you're getting better every day!",
    star_title_1: 'Great effort! 💪',
    star_sub_1: 'You worked hard on speaking today, and that is so valuable!',
    star_close_btn: 'Great! ✨',
    menu_panel_mode: 'Panel Mode',
    menu_panel_parent: 'YıldızCan Panel',
    menu_panel_copy_parent: 'Pick the right activity for the selected student and track progress from one panel.',
    menu_student_summary: 'Student Summary',
    menu_not_selected: 'Not selected yet',
    menu_student_summary_hint: 'Select a student to see their notes and basic info here.',
    menu_total_students: 'Total Students',
    menu_count_copy_parent: 'Active students tracked in this account.',
    sd_selected_student: 'Selected Student',
    sd_none_selected: 'No student selected',
    sd_pick_hint: 'When you select a student, strengths, support notes and session summary appear here.',
    sd_manage_btn: 'Manage Students',
    sd_support_note: 'Support Note',
    sd_note_empty: 'No support note added yet.',
    sd_focus_label: 'Learning Focus',
    sd_focus_empty: 'The focus area is summarized here based on support notes.',
    sd_last_session: 'Last Session',
    sd_no_session: 'No recorded sessions yet.',
    sd_total_sessions: 'Total Sessions',
    sd_total_minutes: 'Total Minutes',
    sd_last_summary: 'Last Record Summary',
    sd_session_line: '{min} min, {turns} answers on {date}',
    sd_turns_line: '{n} answers',
    sd_subtitle_default: 'Support notes and session summary for the selected student.',
    sd_subtitle_with_year: 'Born {year}. Support notes and session summary for the selected student.',
    sd_birth_year: 'Birth year: {y}',
    sd_birth_missing: 'Birth year not entered',
    sd_unnamed: 'Unnamed student',
    min_unit: 'min',
    la_age_48: 'ages 4-8',
    la_age_47: 'ages 4-7',
    la_speech_title: 'Speech and Expression',
    la_speech_sum: 'Building short sentences, understanding questions and expressing needs.',
    la_speech_o1: 'Responds appropriately to simple questions',
    la_speech_o2: 'Uses short sentences instead of single words',
    la_speech_o3: 'Expresses needs verbally',
    la_speech_plan: 'Progresses on the speech practice screen with short questions, answers and feedback.',
    la_visual_title: 'Visual Attention',
    la_visual_sum: 'Visual readiness area for matching, sequencing and following instructions.',
    la_visual_o1: 'Matches visually',
    la_visual_o2: 'Follows sequential instructions',
    la_visual_o3: 'Distinguishes differences',
    la_visual_plan: 'Short tasks are offered with cards, matching and step-tracking activities.',
    la_daily_title: 'Daily Living Skills',
    la_daily_sum: 'Routines, waiting, asking for help and basic self-care behaviors.',
    la_daily_o1: 'Recognizes daily routines',
    la_daily_o2: 'Develops help-seeking behavior',
    la_daily_o3: 'Practices waiting and turn-taking',
    la_daily_plan: 'Practiced with real-life scenarios and short decision cards.',
    report_first_focus: 'Recommended first focus',
    report_answer_prefix: 'Answer: ',
    report_other: 'Other',
    report_new_questions: 'New questions were practiced in this area.',
    report_story_full: '✅ Full',
    report_preparing: 'Preparing...',
    report_stat_sessions: 'Sessions This Week',
    report_stat_duration: 'Time This Week',
    report_stat_story: 'Story Progress',
    report_stat_turns: 'Answers This Week',
    report_stat_intervention: 'Challenging / Positive Choices',
    report_choice_analysis: '🔍 Choice Analysis',
    report_speech_summary: '🎙️ Speech Practice Summary',
    report_ai_eval: "🤖 Yıldız Can's Evaluation",
    report_no_story: 'No story session yet.',
    report_no_session: 'No session yet.',
    report_print: '🖨️ Print',
    login_pick_who: 'Pick who you are!',
    login_add_student: '+ Add New Student',
    login_no_students: 'No students added yet.',
    login_add_first: 'Add your first student below!',
    student_fallback: 'Student',
    student_notes_ph: 'Support note, interests...',
    btn_create: 'Create',
    auth_waiting: 'Please wait...',
    schedule_screen_title: '🎯 Daily Tasks',
    schedule_sub: 'Different tasks await you every day. Complete them to earn stars!',
    task_therapy: 'Complete {n} speech practice session(s)',
    task_object: 'Complete {n} object recognition question(s)',
    task_completed: '✓ Task complete: {label} — +5 ⭐',
    task_all_done_toast: '🏆 You finished all of today\'s tasks! +10 ⭐ bonus',
    task_all_done_title: 'You Completed Today!',
    task_all_done_sub: 'New tasks await tomorrow. You\'re amazing!',
    aac_add_card: '➕ Add Card',
    aac_mode_emoji: '😊 Emoji',
    aac_mode_photo: '📷 Photo',
    aac_photo_search_ph: 'Search a word... (apple, dog, play)',
    aac_photo_hint: 'Type a Turkish or English word to get photos.',
    aac_card_name_ph: 'Type a card name...',
    a11y_account: 'Account',
    search_btn: 'Search',
    add_btn: 'Add',
    student_pill: 'Select student',
    info_mic_permission: 'Microphone permission is required.',
    auth_login_success: 'Signed in successfully! 👋',
    auth_register_success: 'Registration complete, welcome! 🎉',
    bottom_nav_games: 'Object Recognition',
    auth_forgot_link: 'Forgot my password',
    auth_identifier_label: 'Username or Email',
    auth_identifier_ph: 'username or example@gmail.com',
    auth_new_password_label: 'New Password',
    auth_reset_btn: 'Reset Password',
    auth_back_to_login: '← Back to login',
    auth_reset_success: 'Your password has been reset!',
    verify_modal_title: 'Verify Your Email',
    verify_modal_sub: 'We sent a 6-digit verification code to {email}. 📁 Not in your inbox? Check your SPAM/Junk folder!',
    verify_modal_nudge: 'Your email is not verified yet. Tap "Resend code" and enter the 6-digit code from your email. 📁 The code may land in your SPAM/Junk folder!',
    verify_btn: 'Verify ✓',
    verify_resend: 'Resend code',
    verify_later: 'Later',
    set_email_modal_title: 'Add Email',
    set_email_modal_sub: 'To continue, you must add a valid email address to your account.',
    set_email_modal_btn: 'Save Email',
    verify_success: 'Your email is verified! ✓',
    email_verified_label: 'Verified',
    email_unverified_label: 'Not verified',
    email_missing_label: 'No email added',
    AUTH_VERIFY_CODE_INVALID: 'Code is incorrect or expired',
    AUTH_EMAIL_TAKEN: 'This email is registered to another account',
    sync_last: 'Last sync: {time}',
    sync_never: 'Not synced yet',
    analysis_trend_title: 'Independent Speech Progress',
    analysis_trend_sub: 'Unassisted speech rate per session. An upward line means growing independence.',
    analysis_trend_table: 'Table view',
    analysis_trend_col_date: 'Date',
    analysis_trend_col_pct: 'Independent %',
    ob_step1_title: 'Start with Speech Practice',
    ob_step1_text: 'Type a topic (e.g. "shopping") and Yıldız Can will ask questions about it. The child answers by speaking into the microphone and gets instant encouragement.',
    ob_step2_title: 'Daily Tasks and AAC always at hand',
    ob_step2_text: 'Daily Tasks guide the child toward a different goal every day, and use the AAC board to communicate by tapping cards when speaking is hard.',
    ob_step3_title: 'Progress is recorded automatically',
    ob_step3_text: 'Every session is saved automatically. See the progress chart on the Analysis screen and generate parent reports and IEP drafts.',
    ob_skip: 'Skip',
    ob_next: 'Next →',
    ob_start: "Let's start! 🎉",
    auth_email_label: 'Email',
    AUTH_EMAIL_REQUIRED: 'Email address is required',
    auth_reset_email_info: 'Enter your username or email and we will send a reset code to your registered email.',
    auth_send_code_btn: 'Send Code to My Email',
    auth_email_code_label: '6-Digit Code from Email',
    auth_code_sent_info: 'Code sent to {email}. 📁 Not in your inbox? Check your SPAM/Junk folder!',
    auth_code_sent_generic: 'If your details are registered, a code was sent to your email. 📁 Check your SPAM/Junk folder too!',
    auth_code_sent_toast: 'Reset code sent! 📧',
    auth_reset_requested_generic: 'If your details are registered, a reset code was sent to your email.',
    auth_email_not_verified_register: 'This account email is not verified yet. If no code arrives, try again from the Register tab.',
    auth_use_recovery_code: 'I have a recovery code',
    auth_use_email_code: 'Reset via email',
    AUTH_NO_EMAIL: 'No email on this account. You can reset with your recovery code.',
    AUTH_EMAIL_INVALID: 'Enter a valid email address',
    AUTH_RESET_CODE_INVALID: 'Code is incorrect or expired',
    AUTH_RESET_TOO_SOON: 'A code was just sent, please check your email',
    a11y_set_email: '📧 Add/Update Email',
    a11y_email_label: 'Email',
    a11y_email_edit: 'Edit',
    set_email_prompt: 'Your email address for password reset:',
    set_email_success: 'Email saved: {email}',
    parent_gate_title: 'Parent Gate',
    parent_gate_sub: 'This area is for adults. Type the result to continue:',
    parent_gate_wrong: 'Not quite, try again.',
    parent_gate_ok: 'Continue',
    weekly_title: '📬 This Week\'s Summary',
    weekly_loading: 'Preparing the weekly summary...',
    weekly_refresh: '↻ Refresh',
    weekly_empty: 'No practice yet this week. A short session is always a good start.',
    weekly_empty_btn: '🎤 Start Practice',
    weekly_tip_label: '🏠 Try at home',
    routine_title: '⏰ Daily Reminder',
    routine_sub: 'Pick the best time for practice; we will send one gentle reminder at that time. Missed days are no problem.',
    routine_enable: 'Set Reminder',
    routine_disable: 'Turn Off',
    routine_active: 'Set for {time} every day ✓',
    routine_off: 'Reminder is off',
    routine_native_only: 'Reminder notifications work in the mobile app.',
    routine_notif_title: 'YıldızCan',
    routine_notif_body: 'Star time for {name} 🌟 How about a short practice?',
    routine_notif_denied: 'Reminder could not be set because notification permission was denied.',
    routine_saved_toast: 'Reminder set: every day at {time} ⏰',
    routine_removed_toast: 'Reminder turned off',
    auth_guest_try: 'Explore the App',
    auth_guest_hint: 'Try without signing up',
    guest_banner_title: '👀 Guest mode — your trial: 1 speech practice + 1 object recognition',
    guest_banner_sub: 'Signing up is completely free: you get full access to all activities and your progress is saved.',
    guest_banner_btn: 'Sign Up Free',
    guest_limit_title: 'Your trial is used up 🌟',
    guest_limit_sub: 'Liked it? Sign up for free — you get full access to all activities, your progress is backed up to the cloud and nothing gets lost.',
    guest_limit_btn: 'Sign Up Free',
    guest_limit_later: 'Back to menu',
    therapy_complete_stat: '{name} answered {n} questions today! 👏',
    therapy_complete_show: 'Show this screen to your family 🌟',
    first_run_toast: 'Great, you are all set! Pick a topic for the first practice 🎤',

    map_title: 'Topic Map',
    map_greeting: 'Hello!',
    map_greeting_sub: "Let's complete the topic journey before starting speech practice.",
    map_star_points: 'Your Star Points',
    map_progress_label: 'Your Progress',
    map_bubble: 'Complete every topic to unlock new adventures!',
    map_completed: 'Completed!',
    map_locked_toast: 'Finish "{label}" first 🔒',
    map_level_chip: '🎚️ Level: {level}',
    map_level_modal_title: 'Which level should we practice at?',
    map_level_modal_sub: 'You can change it anytime from the map.',
    map_finished_title: 'City Explorer! 🏆',
    map_finished_sub: 'You completed every topic! You can practice any topic again.',
    map_complete_next: '🎉 New topic unlocked: {label}',
    map_back_to_map: '🗺️ Back to Map',

    map_topic_greetings: 'Greetings',
    map_topic_introduce: 'Introducing Yourself',
    map_topic_emotions: 'Expressing Feelings',
    map_topic_daily: 'Daily Activities',
    map_topic_school: 'School and Friends',
    map_topic_food: 'Food and Drinks',
    map_topic_hobbies: 'Hobbies and Interests',
    map_topic_places: 'Places and Directions',
    map_topic_problem: 'Problem Solving',
    map_topic_dreams: 'Dreams and Future',

    map_greet_q1: 'What do you say to your family when you wake up in the morning?',
    map_greet_qgoal1: 'Saying good morning',
    map_intro_q1: 'What is your name? Can you tell me?',
    map_intro_qgoal1: 'Saying their name',
    map_intro_q2: 'How old are you?',
    map_intro_qgoal2: 'Saying their age',
    map_intro_q3: 'Who do you live with at home?',
    map_intro_qgoal3: 'Naming family members',
    map_intro_q4: 'What is your favorite toy? Can you tell me about it?',
    map_intro_qgoal4: 'Describing a favorite thing',
    map_food_q1: 'What is your favorite food?',
    map_food_qgoal1: 'Stating a food preference',
    map_hobby_q1: 'What do you like to do in your free time?',
    map_hobby_qgoal1: 'Talking about a hobby',
    map_hobby_q2: 'What is your favorite cartoon?',
    map_hobby_qgoal2: 'Stating a preference',
    map_hobby_q3: 'Which games do you like to play?',
    map_hobby_qgoal3: 'Naming favorite games',
    map_places_q1: 'How do you get to school? Walking or by car?',
    map_places_qgoal1: 'Describing transportation',
    map_places_q2: 'Which room at home do you like being in the most?',
    map_places_qgoal2: 'Naming a place',
    map_places_q3: 'When you want to go to the park, who do you ask and what do you say?',
    map_places_qgoal3: 'Expressing a request',
    map_places_q4: 'Where do you like to go for a trip? The park or the sea?',
    map_places_qgoal4: 'Stating a place preference',
    map_problem_q1: "If you can't reach something up high, what do you do and who do you ask for help?",
    map_problem_qgoal1: 'Asking for help',
    map_problem_q2: 'What do you do if your toy breaks?',
    map_problem_qgoal2: 'Suggesting a solution to a problem',
    map_dream_q1: 'What do you want to be when you grow up?',
    map_dream_qgoal1: 'Sharing a dream',
    map_dream_q2: 'If you had a superpower, what would you do?',
    map_dream_qgoal2: 'Imagining and telling',
    map_dream_q3: 'Where would you like to travel one day?',
    map_dream_qgoal3: 'Stating a place preference',
    map_dream_q4: 'What present do you want for your birthday?',
    map_dream_qgoal4: 'Expressing a wish',
    map_dream_q5: 'What do you want to do tomorrow?',
    map_dream_qgoal5: 'Telling a plan',
    map_dream_q6: 'What is your biggest dream? Can you tell me?',
    map_dream_qgoal6: 'Describing a dream',
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
  // Menu ipucu banner'ı data-i18n değil, JS ile textContent yazıyor —
  // applyLang() bunu göremez, dil değişince manuel yeniden render gerekir.
  if (currentScreenId === 'menu-screen') renderMenuNudge();
  if (currentScreenId === 'aac-screen') renderAacBoard();
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
  document.title = t('app_name') + ' | ' + (t('therapy_title') || 'Speech Practice');
}

// =============================================

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

const API_BASE = (typeof Capacitor !== 'undefined' && Capacitor.isNativePlatform())
    ? 'https://ozel-egitim.vercel.app'
    : '';

function apiAuthHeaders() {
    return (_authToken && !_authToken.startsWith('demo_'))
        ? { 'Authorization': 'Bearer ' + _authToken }
        : {};
}

// =============================================
// HATA İZLEME — client hataları /api/log'a gider
// =============================================
const _reportedErrors = new Set();

function reportClientError(message, stack) {
    try {
        if (!message || _reportedErrors.size >= 10) return;
        const key = String(message).slice(0, 120);
        if (_reportedErrors.has(key)) return;
        if (key === 'Script error.' || key.includes('ResizeObserver loop')) return;
        _reportedErrors.add(key);
        fetch(API_BASE + '/api/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: key,
                stack: String(stack || '').slice(0, 3000),
                screen: typeof currentScreenId !== 'undefined' ? currentScreenId : '',
                lang: _lang
            })
        }).catch(() => {});
    } catch(_) {}
}

window.addEventListener('error', (e) => {
    reportClientError(e.message, e.error && e.error.stack);
});

window.addEventListener('unhandledrejection', (e) => {
    const r = e.reason;
    reportClientError(
        (r && r.message) || String(r || 'unhandledrejection'),
        r && r.stack
    );
});

function _isTherapyDebugEnabled() {
    try {
        const search = window.location && window.location.search ? new URLSearchParams(window.location.search) : null;
        const host = window.location && window.location.hostname ? window.location.hostname : '';
        return host === 'localhost' || host === '127.0.0.1' || (search && search.get('debug') === '1');
    } catch (_) {
        return false;
    }
}

function _installDebugTherapyGuards() {
    if (!_isTherapyDebugEnabled()) return;
    window.__debugTherapyGuards = async function __debugTherapyGuards() {
        const results = [];
        const originalCurrentObj = currentObj;
        const originalIsWaiting = isWaiting;
        const originalTurnCount = turnCount;
        const infoEl = document.getElementById('info');
        const micBtn = document.getElementById('micBtn');
        const originalInfo = infoEl ? infoEl.innerText : '';
        const originalMicDisabled = micBtn ? micBtn.disabled : null;
        const originalDBGet = DB.get;
        const originalGetCurrentUserId = getCurrentUserId;
        const originalWarn = console.warn;
        const warnCalls = [];

        console.warn = function() {
            warnCalls.push(Array.from(arguments));
            return originalWarn.apply(console, arguments);
        };

        async function runCase(name, fn) {
            try {
                const detail = await fn();
                results.push({ test: name, status: 'pass', detail: detail || '' });
            } catch (error) {
                results.push({
                    test: name,
                    status: 'fail',
                    detail: error && error.message ? error.message : String(error)
                });
            }
        }

        try {
            await runCase('startQuestion currentObj null guard', async function() {
                currentObj = null;
                isWaiting = true;
                startQuestion();
                if (isWaiting !== false) throw new Error('isWaiting should reset to false');
                if (!warnCalls.some(call => String(call[0]).indexOf('startQuestion: missing currentObj') === 0)) {
                    throw new Error('missing startQuestion warning');
                }
                return 'guard returned without crash';
            });

            await runCase('processTherapySpeech safe exit', async function() {
                currentObj = null;
                isWaiting = true;
                if (micBtn) micBtn.disabled = true;
                await processTherapySpeech('debug answer', 'mic');
                if (isWaiting !== false) throw new Error('isWaiting should reset to false');
                if (micBtn && micBtn.disabled) throw new Error('mic button should be re-enabled');
                if (!warnCalls.some(call => String(call[0]).indexOf('processTherapySpeech: missing currentObj') === 0)) {
                    throw new Error('missing processTherapySpeech warning');
                }
                return 'speech aborted safely';
            });

            await runCase('loadReportHistory payload normalization', async function() {
                const payloads = [
                    { label: 'array', value: [] },
                    { label: 'wrapped', value: { data: [] } },
                    { label: 'null', value: null },
                    { label: 'error-object', value: { error: 'debug' } }
                ];
                getCurrentUserId = async function() { return 'debug-user'; };
                for (const payload of payloads) {
                    DB.get = async function(key) {
                        if (String(key).indexOf('session_history_') === 0) return payload.value;
                        return null;
                    };
                    const history = await loadReportHistory();
                    if (!Array.isArray(history)) {
                        throw new Error(payload.label + ' did not return an array');
                    }
                }
                const sawWrapped = warnCalls.some(call => String(call[0]).indexOf('loadReportHistory: normalized wrapped history payload') === 0);
                const sawUnexpected = warnCalls.some(call => String(call[0]).indexOf('loadReportHistory: unexpected history payload') === 0);
                if (!sawWrapped || !sawUnexpected) {
                    throw new Error('expected normalization warnings were not emitted');
                }
                return 'array, wrapped, null and error object handled';
            });
        } finally {
            console.warn = originalWarn;
            DB.get = originalDBGet;
            getCurrentUserId = originalGetCurrentUserId;
            currentObj = originalCurrentObj;
            isWaiting = originalIsWaiting;
            turnCount = originalTurnCount;
            if (infoEl) infoEl.innerText = originalInfo;
            if (micBtn && originalMicDisabled !== null) micBtn.disabled = originalMicDisabled;
        }

        console.table(results);
        return results;
    };
}

_installDebugTherapyGuards();

// =============================================
// GENEL DEĞİŞKENLER
// =============================================
let childName = "";
let appStarted = false;
let currentScreenId = 'start-screen';
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
    cardUsedInTherapy: 0,
    repeatUsed: 0,
    simplifyUsed: 0,
    simplifyByCategory: {},
    noResponseByCategory: {},
    reportEntryId: null,
    lastRewardedTotal: 0,
};

let selectedHistoryDateKey = null;
let historyCalendarMonth = null;

const LEARNING_AREAS = [
    {
        key: 'speech',
        get title() { return t('la_speech_title'); },
        get ageRange() { return t('la_age_48'); },
        get summary() { return t('la_speech_sum'); },
        get outcomes() { return [t('la_speech_o1'), t('la_speech_o2'), t('la_speech_o3')]; },
        get screenPlan() { return t('la_speech_plan'); }
    },
    {
        key: 'visual',
        get title() { return t('la_visual_title'); },
        get ageRange() { return t('la_age_47'); },
        get summary() { return t('la_visual_sum'); },
        get outcomes() { return [t('la_visual_o1'), t('la_visual_o2'), t('la_visual_o3')]; },
        get screenPlan() { return t('la_visual_plan'); }
    },
    {
        key: 'daily',
        get title() { return t('la_daily_title'); },
        get ageRange() { return t('la_age_48'); },
        get summary() { return t('la_daily_sum'); },
        get outcomes() { return [t('la_daily_o1'), t('la_daily_o2'), t('la_daily_o3')]; },
        get screenPlan() { return t('la_daily_plan'); }
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
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    if (window.avatar3d && window.avatar3d.triggerCelebration) {
        window.avatar3d.triggerCelebration();
    }
    setTimeout(() => setCharacterEmotion(CharacterEmotion.NEUTRAL), 3000);
}

// =============================================
// EKRAN YÖNETİMİ
// =============================================
let _restoringScreen = false;

function isTherapyInProgress() {
    const container = document.getElementById('game-container');
    const mainCard = document.getElementById('therapyMainCard');
    const completeBox = document.getElementById('therapyCompleteBox');

    return container && container.style.display !== 'none' &&
           mainCard && mainCard.style.display !== 'none' &&
           !completeBox;
}

function showCustomConfirm(message) {
    return new Promise((resolve) => {
        const overlay = document.getElementById('confirmModal');
        const textEl = document.getElementById('confirmModalText');
        const titleEl = document.getElementById('confirmModalTitle');
        const cancelBtn = document.getElementById('confirmBtnCancel');
        const okBtn = document.getElementById('confirmBtnOk');
        if (!overlay || !textEl) {
            resolve(confirm(message));
            return;
        }
        titleEl.textContent = _lang === 'en' ? 'Are you sure?' : 'Emin misiniz?';
        textEl.textContent = message;
        cancelBtn.textContent = t('cancel');
        okBtn.textContent = t('yes');
        overlay.style.display = 'flex';
        const cleanUp = () => {
            overlay.style.display = 'none';
            cancelBtn.onclick = null;
            okBtn.onclick = null;
        };
        cancelBtn.onclick = () => {
            cleanUp();
            resolve(false);
        };
        okBtn.onclick = () => {
            cleanUp();
            resolve(true);
        };
    });
}

async function showOnly(id, options = {}) {
    if (!options.skipTherapyConfirm && isTherapyInProgress() && id !== 'game-container') {
        const msg = _lang === 'en'
            ? "Are you sure you want to leave the speech practice session? Your progress will be lost."
            : "Konuşma pratiği seansını yarıda bırakmak istediğine emin misin? İlerlemen kaybolacak.";
        const confirmed = await showCustomConfirm(msg);
        if (!confirmed) {
            _updateBottomNav('game-container');
            return;
        }
        currentTopic = '';
        therapySessionCompleted = false;
        try { window.speechSynthesis.cancel(); } catch(_){}
    }

    const screens = ['start-screen','student-setup-screen','menu-screen','game-container',
                      'speechmap-screen','schedule-screen','aac-screen','store-screen','object-screen',
                      'login-screen','auth-screen','analysis-screen'];
    const isNewScreen = currentScreenId !== id;
    const prevScreen = currentScreenId;
    screens.forEach(s => {
        const el = document.getElementById(s);
        if (el) el.style.display = 'none';
    });
    const target = document.getElementById(id);
    if (target) target.style.display = 'flex';

    if (id === 'menu-screen') {
        try {
            updateStarBadge();
            renderMenuNudge();
            updateGuestBanner();
        } catch (_) {}
    }
    currentScreenId = id;
    if (id === 'menu-screen') {
        maybeShowOnboarding();
    }
    if (id === 'speechmap-screen') {
        requestAnimationFrame(() => renderSpeechMap());
    }
    _updateBottomNav(id);
    if (_objStopRender) (id === 'object-screen' ? _objStartRender : _objStopRender)();
    _maybeToggleSoundHint(id);
    _updateOfflineBanner();

    if (!_restoringScreen && isNewScreen) {
        const entryScreens = ['auth-screen', 'splash-screen', 'start-screen', 'login-screen'];
        const replace = history.state === null || entryScreens.includes(prevScreen) || entryScreens.includes(id);
        try {
            if (replace) history.replaceState({ screen: id }, '');
            else history.pushState({ screen: id }, '');
        } catch(_) {}
    }
}

window.addEventListener('popstate', (e) => {
    if (e.state && e.state.screen && e.state.screen !== currentScreenId) {
        _restoringScreen = true;
        try { showOnly(e.state.screen); } finally { _restoringScreen = false; }
    }
});

function _updateBottomNav(screenId) {
    const nav = document.getElementById('bottomNav');
    if (!nav) return;
    const hideOn = ['auth-screen', 'splash-screen', 'start-screen', 'login-screen', 'student-setup-screen', 'game-container'];
    nav.style.display = hideOn.includes(screenId) ? 'none' : 'flex';
    const map = {
        'menu-screen': 'bnMenu',
        'game-container': 'bnTherapy',
        'speechmap-screen': 'bnTherapy',
        'aac-screen': 'bnAAC',
        'schedule-screen': 'bnSchedule',
        'analysis-screen': 'bnAnalysis',
        'object-screen': 'bnGames',
    };
    nav.querySelectorAll('.bottom-nav-item').forEach(btn => btn.classList.remove('active'));
    const activeId = map[screenId];
    if (activeId) { const el = document.getElementById(activeId); if (el) el.classList.add('active'); }
}

function _maybeToggleSoundHint(screenId) {
    const el = document.getElementById('soundHintBanner');
    if (!el) return;
    let show = false;
    try {
        show = (screenId === 'game-container' || screenId === 'aac-screen')
            && Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios'
            && !localStorage.getItem('lms_sound_hint_done');
    } catch (_) {}
    el.style.display = show ? 'flex' : 'none';
}

function dismissSoundHint() {
    try { localStorage.setItem('lms_sound_hint_done', '1'); } catch (_) {}
    const el = document.getElementById('soundHintBanner');
    if (el) el.style.display = 'none';
}

function _updateOfflineBanner() {
    const el = document.getElementById('offlineBanner');
    if (!el) return;
    el.style.display = (currentScreenId === 'auth-screen' && navigator.onLine === false) ? 'flex' : 'none';
}
window.addEventListener('online', _updateOfflineBanner);
window.addEventListener('offline', _updateOfflineBanner);

function connectionErrorMsg() {
    return navigator.onLine === false
        ? t('offline_banner')
        : (t('auth_connection_error') || t('AUTH_FIELDS_REQUIRED'));
}

// =============================================
// VELİ KAPISI — analiz ekranının girişini basit bir toplama sorusuyla korur
// =============================================
const GATE_UNLOCK_MS = 10 * 60 * 1000;
let _parentGateAnswer = null;
let _gateNext = null;
let _gateUnlockedUntil = 0;

function requireAdultGate(next) {
    if (Date.now() < _gateUnlockedUntil) { next(); return; }
    _gateNext = next;
    openParentGate();
}

function openParentGate() {
    const a = 2 + Math.floor(Math.random() * 8);
    const b = 21 + Math.floor(Math.random() * 29);
    _parentGateAnswer = a + b;
    document.getElementById('parentGateQuestion').textContent = `${a} + ${b} = ?`;
    document.getElementById('parentGateInput').value = '';
    document.getElementById('parentGateError').textContent = '';
    document.getElementById('parentGateModal').style.display = 'flex';
    setTimeout(() => document.getElementById('parentGateInput').focus(), 60);
}

function closeParentGate() {
    document.getElementById('parentGateModal').style.display = 'none';
    _parentGateAnswer = null;
    _gateNext = null;
}

function submitParentGate() {
    const val = parseInt(document.getElementById('parentGateInput').value, 10);
    if (_parentGateAnswer === null || val !== _parentGateAnswer) {
        document.getElementById('parentGateError').textContent = t('parent_gate_wrong');
        document.getElementById('parentGateInput').value = '';
        return;
    }
    const next = _gateNext;
    closeParentGate();
    _gateUnlockedUntil = Date.now() + GATE_UNLOCK_MS;
    if (typeof next === 'function') next();
}

// =============================================
// MİSAFİR MODU — kayıt olmadan deneme: cihaz başına TOPLAM
// 1 konuşma pratiği + 1 nesne tanıma hakkı. Hak, seans fiilen
// başlarken düşülür; sayaç localStorage'da tutulur ve misafir
// çıkış yapıp yeniden girse de sıfırlanmaz.
// =============================================
function isGuestUser() {
    return !!(_authToken && (String(_authToken).startsWith('demo_') || String(_authToken).startsWith('guest_')));
}

function _guestUsed() {
    try { return JSON.parse(localStorage.getItem('lms_guest_used')) || {}; } catch { return {}; }
}

function guestTryConsume(kind) {
    if (!isGuestUser()) return true;
    const used = _guestUsed();
    if (used[kind]) { showGuestLimitModal(); return false; }
    used[kind] = Date.now();
    try { localStorage.setItem('lms_guest_used', JSON.stringify(used)); } catch {}
    if (String(_authToken).startsWith('guest_')) {
        authApi('guest_use', { token: _authToken, kind }).catch(() => {});
    }
    return true;
}

const GUEST_PRAISE = {
    tr: ['Harika söyledin! 👏', 'Çok güzel! Devam edelim 🌟', 'Bravo, seni duydum!', 'Süpersin! Sıradaki soruya geçelim ⭐', 'Ne güzel anlattın! 👏', 'Aferin sana! 🌟'],
    en: ['Great job! 👏', 'Wonderful! Let\'s keep going 🌟', 'Bravo, I heard you!', 'Awesome! On to the next one ⭐', 'You said that so nicely! 👏', 'Well done! 🌟'],
};
let _guestPraiseIdx = -1;

function guestPraise() {
    const list = GUEST_PRAISE[_lang] || GUEST_PRAISE.tr;
    _guestPraiseIdx = (_guestPraiseIdx + 1) % list.length;
    return list[_guestPraiseIdx];
}

function updateGuestBanner() {
    const el = document.getElementById('guestBanner');
    if (el) el.style.display = isGuestUser() ? '' : 'none';
}

function showGuestLimitModal() {
    const modal = document.getElementById('guestLimitModal');
    if (modal) modal.style.display = 'flex';
}

function closeGuestLimitModal() {
    const modal = document.getElementById('guestLimitModal');
    if (modal) modal.style.display = 'none';
}

async function guestExitToRegister() {
    closeGuestLimitModal();
    await clearAuthSessionLocal();
    showOnly('auth-screen');
    document.getElementById('authError').textContent = '';
    switchAuthTab('register');
}

// =============================================
// HAFTALIK VELİ ÖZETİ + EV ÖNERİSİ
// =============================================
function _weekKey() {
    const d = new Date();
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const week = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
    return `${date.getUTCFullYear()}-W${week}`;
}

function weeklySummaryStorageKey() { return `weekly_summary_${activeStudentId || 'default'}`; }

async function _weeklyData() {
    const weekAgo = Date.now() - 7 * 86400000;
    const history = await loadReportHistory();
    const sessions = history.filter(h => {
        const ts = new Date(h.createdAt).getTime();
        return ts && ts >= weekAgo;
    });
    const objAll = await DB.get('obj_results_' + activeStudentId) || [];
    const obj = (Array.isArray(objAll) ? objAll : []).filter(r => new Date(r.date).getTime() >= weekAgo);
    const topics = [];
    sessions.forEach(s => (s.therapyTurns || []).forEach(turn => {
        const label = turn.location || turn.category;
        if (label && !topics.includes(label)) topics.push(label);
    }));
    return {
        sessions: sessions.length,
        minutes: sessions.reduce((a, s) => a + (s.durationMin || 0), 0),
        turns: sessions.reduce((a, s) => a + (s.totalTurns || 0), 0),
        mic: sessions.reduce((a, s) => a + (s.micUsedInTherapy || 0), 0),
        topics: topics.slice(0, 5),
        objPlays: obj.length,
        objItems: obj.reduce((a, r) => a + (r.items || 0), 0),
        objErrors: obj.reduce((a, r) => a + (r.errors || 0), 0),
    };
}

function _weeklyLocalText(d) {
    const name = activeStudentName || '';
    return _lang === 'en'
        ? `${name} completed ${d.sessions} session(s) and gave ${d.turns} answers this week.`
        : `${name} bu hafta ${d.sessions} seans tamamladı ve ${d.turns} yanıt verdi.`;
}

function _weeklyPrompt(d) {
    const name = activeStudentName || (_lang === 'en' ? 'the child' : 'çocuk');
    const acc = (d.objItems + d.objErrors) > 0 ? Math.round((d.objItems / (d.objItems + d.objErrors)) * 100) : null;
    const objLine = d.objPlays ? `${d.objPlays}${_lang === 'en' ? ' plays, ' : ' kez, '}${acc !== null ? '%' + acc : '-'}` : '-';
    if (_lang === 'en') {
        return `You are an assistant for special education teachers and parents. Summarize the weekly usage data below, addressing the parent directly.
Rules: no diagnosis, no medical claims. Be encouraging and concrete. Refer to the child by first name only. Produce exactly these two lines:
SUMMARY: at most two sentences
TIP: one short, concrete activity suggestion the family can try at home this week
Data -> Child: ${name}. Speech sessions: ${d.sessions}. Total answers: ${d.turns}. Answers by microphone: ${d.mic}. Practice minutes: ${d.minutes}. Topics: ${d.topics.join(', ') || '-'}. Object recognition game: ${objLine}.`;
    }
    return `Özel eğitim öğretmenlerine ve velilere yardımcı olan bir asistansın. Aşağıdaki haftalık kullanım verilerini veliye hitaben özetle.
Kurallar: Tanı veya tıbbi yorum yapma. Cesaretlendirici ve somut ol. Çocuktan yalnızca adıyla bahset. Tam olarak şu iki satırı üret:
ÖZET: en fazla iki cümlelik özet
ÖNERİ: ailenin bu hafta evde deneyebileceği tek, kısa ve somut etkinlik önerisi
Veriler -> Çocuk: ${name}. Konuşma seansı: ${d.sessions}. Toplam yanıt: ${d.turns}. Mikrofonla yanıt: ${d.mic}. Pratik dakikası: ${d.minutes}. Çalışılan konular: ${d.topics.join(', ') || '-'}. Nesne tanıma oyunu: ${objLine}.`;
}

function _parseWeekly(text) {
    const sumRe = _lang === 'en' ? /SUMMARY:\s*([\s\S]*?)(?:TIP:|$)/i : /ÖZET:\s*([\s\S]*?)(?:ÖNERİ:|$)/i;
    const tipRe = _lang === 'en' ? /TIP:\s*([\s\S]*)/i : /ÖNERİ:\s*([\s\S]*)/i;
    const summary = (text.match(sumRe)?.[1] || '').trim();
    const tip = (text.match(tipRe)?.[1] || '').trim();
    if (summary) return { summary, tip };
    return { summary: text.trim().slice(0, 400), tip: '' };
}

function _weeklyShell(bodyEl) {
    const card = document.getElementById('weeklySummaryCard');
    card.innerHTML = '';
    const head = document.createElement('div');
    head.className = 'weekly-card-head';
    const title = document.createElement('strong');
    title.textContent = t('weekly_title');
    const refresh = document.createElement('button');
    refresh.type = 'button';
    refresh.className = 'weekly-refresh-btn';
    refresh.textContent = t('weekly_refresh');
    refresh.onclick = () => renderWeeklySummaryCard(true);
    head.appendChild(title);
    head.appendChild(refresh);
    card.appendChild(head);
    card.appendChild(bodyEl);
}

let _weeklyBusy = false;
async function renderWeeklySummaryCard(force = false) {
    const card = document.getElementById('weeklySummaryCard');
    if (!card) return;
    if (!activeStudentId) { card.style.display = 'none'; return; }
    card.style.display = '';

    const stored = DB.getSync(weeklySummaryStorageKey());
    if (!force && stored && stored.week === _weekKey() && stored.summary) {
        _paintWeekly(stored.summary, stored.tip);
        return;
    }
    if (_weeklyBusy) return;
    _weeklyBusy = true;
    const loading = document.createElement('p');
    loading.className = 'weekly-text weekly-muted';
    loading.textContent = t('weekly_loading');
    _weeklyShell(loading);
    try {
        const d = await _weeklyData();
        if (!d.sessions && !d.objPlays) {
            const wrap = document.createElement('div');
            const p = document.createElement('p');
            p.className = 'weekly-text';
            p.textContent = t('weekly_empty');
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'weekly-start-btn';
            btn.textContent = t('weekly_empty_btn');
            btn.onclick = () => goToTherapy();
            wrap.appendChild(p);
            wrap.appendChild(btn);
            _weeklyShell(wrap);
            return;
        }
        let summary = _weeklyLocalText(d);
        let tip = '';
        let aiOk = false;
        try {
            if (isGuestUser()) throw new Error('guest');
            const r = await fetch(API_BASE + '/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...apiAuthHeaders() },
                body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: _weeklyPrompt(d) }] }] }),
                signal: AbortSignal.timeout(20000)
            });
            const data = await r.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            if (text) {
                const parsed = _parseWeekly(text);
                if (parsed.summary) { summary = parsed.summary; tip = parsed.tip; aiOk = true; }
            }
        } catch (_) {}
        if (aiOk) DB.set(weeklySummaryStorageKey(), { week: _weekKey(), summary, tip, createdAt: new Date().toISOString() });
        _paintWeekly(summary, tip);
    } finally {
        _weeklyBusy = false;
    }
}

function _paintWeekly(summary, tip) {
    const wrap = document.createElement('div');
    const p = document.createElement('p');
    p.className = 'weekly-text';
    p.textContent = summary;
    wrap.appendChild(p);
    if (tip) {
        const tipBox = document.createElement('div');
        tipBox.className = 'weekly-tip';
        const label = document.createElement('strong');
        label.textContent = t('weekly_tip_label');
        const tipText = document.createElement('p');
        tipText.textContent = tip;
        tipBox.appendChild(label);
        tipBox.appendChild(tipText);
        wrap.appendChild(tipBox);
    }
    _weeklyShell(wrap);
}

// =============================================
// GÜNLÜK RUTİN HATIRLATMASI (yerel bildirim)
// =============================================
const ROUTINE_NOTIF_ID = 7001;

function _routineStore() {
    try { return JSON.parse(localStorage.getItem('lms_routine')) || null; } catch { return null; }
}

function _routineSave(v) {
    try { localStorage.setItem('lms_routine', JSON.stringify(v)); } catch {}
}

function _localNotifPlugin() {
    try {
        if (typeof Capacitor !== 'undefined' && Capacitor.isNativePlatform()
            && Capacitor.Plugins && Capacitor.Plugins.LocalNotifications) {
            return Capacitor.Plugins.LocalNotifications;
        }
    } catch (_) {}
    return null;
}

function renderRoutineCard() {
    const statusEl = document.getElementById('routineStatus');
    const btn = document.getElementById('routineToggleBtn');
    const timeInput = document.getElementById('routineTime');
    if (!statusEl || !btn || !timeInput) return;
    const cfg = _routineStore();
    const plugin = _localNotifPlugin();
    if (cfg && cfg.enabled) {
        if (cfg.time) timeInput.value = cfg.time;
        statusEl.textContent = t('routine_active').replace('{time}', cfg.time);
        btn.textContent = t('routine_disable');
        btn.disabled = false;
    } else {
        statusEl.textContent = plugin ? t('routine_off') : t('routine_native_only');
        btn.textContent = t('routine_enable');
        btn.disabled = !plugin;
    }
}

async function toggleRoutineReminder() {
    const cfg = _routineStore();
    const plugin = _localNotifPlugin();
    if (cfg && cfg.enabled) {
        if (plugin) {
            try { await plugin.cancel({ notifications: [{ id: ROUTINE_NOTIF_ID }] }); } catch (_) {}
        }
        _routineSave({ enabled: false, time: cfg.time });
        showToast(t('routine_removed_toast'));
        renderRoutineCard();
        return;
    }
    if (!plugin) { showToast(t('routine_native_only')); return; }
    const time = document.getElementById('routineTime')?.value || '18:30';
    try {
        const perm = await plugin.requestPermissions();
        if (perm && perm.display && perm.display !== 'granted') {
            showToast(t('routine_notif_denied'));
            renderRoutineCard();
            return;
        }
        try { await plugin.cancel({ notifications: [{ id: ROUTINE_NOTIF_ID }] }); } catch (_) {}
        const [h, m] = time.split(':').map(Number);
        await plugin.schedule({
            notifications: [{
                id: ROUTINE_NOTIF_ID,
                title: t('routine_notif_title'),
                body: t('routine_notif_body').replace('{name}', activeStudentName || ''),
                schedule: { on: { hour: h, minute: m }, allowWhileIdle: true },
            }]
        });
        _routineSave({ enabled: true, time });
        showToast(t('routine_saved_toast').replace('{time}', time));
    } catch (_) {
        showToast(t('routine_notif_denied'));
    }
    renderRoutineCard();
}

// İlk öğrenci oluşturulduğunda menü yerine doğrudan ilk pratiğe götür
async function maybeStartFirstPractice() {
    try {
        const history = await loadReportHistory();
        if (history.length) return;
        showToast(t('first_run_toast'));
        goToTherapy();
    } catch (_) {}
}

function updateMenuIdentity() {
    const emailEl = document.getElementById('account-email');
    const studentEl = document.getElementById('active-student-name');
    if (emailEl) {
        emailEl.textContent = (_authUser && _authUser.displayName) ? _authUser.displayName : 'Misafir';
    }
    if (studentEl) {
        studentEl.textContent = activeStudentName || t('student_pill');
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
        sessionData.cardUsedInTherapy = 0;
        sessionData.repeatUsed = 0;
        sessionData.simplifyUsed = 0;
        sessionData.simplifyByCategory = {};
        sessionData.noResponseByCategory = {};
        sessionData.reportEntryId = null;
        sessionData.lastRewardedTotal = 0;
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
    loadCustomQuestions();
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
});
window.addEventListener('pagehide', persistSessionSnapshot);
document.addEventListener('DOMContentLoaded', function() {
    ensureStudentEnhancements();
});

async function goToMenu() {
    if (isTherapyInProgress()) {
        const msg = _lang === 'en'
            ? "Are you sure you want to leave the speech practice session? Your progress will be lost."
            : "Konuşma pratiği seansını yarıda bırakmak istediğine emin misin? İlerlemen kaybolacak.";
        const confirmed = await showCustomConfirm(msg);
        if (!confirmed) {
            return;
        }
        currentTopic = '';
        therapySessionCompleted = false;
    }
    try { window.speechSynthesis.cancel(); } catch(_){}
    clearTimeout(idleTimer);
    const shouldAwardStars = therapySessionCompleted;
    therapySessionCompleted = false;
    persistSessionSnapshot();
    await showOnly('menu-screen', { skipTherapyConfirm: true });
    maybeGreetChild();
    if (shouldAwardStars) _showStarReward();
}

let currentTopic = '';
let sessionTotalQuestions = 0;
let therapySessionCompleted = false;

async function goToTherapy() {
    await showOnly('speechmap-screen');
}

function returnToMapFromComplete() {
    const box = document.getElementById('therapyCompleteBox');
    if (box) box.remove();
    document.getElementById('therapyMainCard').style.display = 'none';
    goToTherapy();
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
    return date.toLocaleDateString(_lang === 'en' ? 'en-US' : 'tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
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
        createdAt: getHistoryTimestamp(row),
        dateKey: row.session_date || row.dateKey || getDateKey(new Date()),
        childName: row.child_name || '',
        durationMin: row.duration_min || row.durationMin || 0,
        totalMic: row.total_mic || row.totalMic || 0,
        storyPct: row.story_pct || row.storyPct || '-',
        totalTurns: row.total_turns || row.totalTurns || 0,
        storyCompleted: typeof row.story_completed !== 'undefined' ? !!row.story_completed : !!row.storyCompleted,
        storyName: row.story_name || row.storyName || '',
        totalScenesReached: row.total_scenes_reached || row.totalScenesReached || 0,
        totalScenes: row.total_scenes || row.totalScenes || 0,
        micUsedInStory: row.mic_used_in_story || row.micUsedInStory || 0,
        micUsedInTherapy: row.mic_used_in_therapy || row.micUsedInTherapy || 0,
        cardUsedInTherapy: row.card_used_in_therapy || row.cardUsedInTherapy || 0,
        repeatUsed: row.repeat_used || row.repeatUsed || 0,
        simplifyUsed: row.simplify_used || row.simplifyUsed || 0,
        therapyTurns: Array.isArray(row.therapy_turns) ? row.therapy_turns : (Array.isArray(row.therapyTurns) ? row.therapyTurns : []),
        storyChoices: Array.isArray(row.story_choices) ? row.story_choices : (Array.isArray(row.storyChoices) ? row.storyChoices : []),
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
                <span class="menu-insight-label">${t('menu_panel_mode')}</span>
                <strong id="role-mode-title">${t('menu_panel_parent')}</strong>
                <p id="role-mode-copy">${t('menu_panel_copy_parent')}</p>
            </div>
            <div class="menu-insight-card">
                <span class="menu-insight-label">${t('menu_student_summary')}</span>
                <strong id="student-summary-name">${t('menu_not_selected')}</strong>
                <p id="student-summary-copy">${t('menu_student_summary_hint')}</p>
            </div>
            <div class="menu-insight-card">
                <span class="menu-insight-label">${t('menu_total_students')}</span>
                <strong id="student-count-value">0</strong>
                <p id="student-count-copy">${t('menu_count_copy_parent')}</p>
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
                    <span class="student-detail-kicker">${t('sd_selected_student')}</span>
                    <h3 id="student-detail-title">${t('sd_none_selected')}</h3>
                    <p id="student-detail-subtitle">${t('sd_pick_hint')}</p>
                </div>
                <button type="button" class="menu-ghost-btn" onclick="openStudentSetup()">${t('sd_manage_btn')}</button>
            </div>
            <div class="student-detail-grid">
                <div class="student-detail-card">
                    <span class="student-detail-label">${t('sd_support_note')}</span>
                    <p id="student-detail-notes">${t('sd_note_empty')}</p>
                </div>
                <div class="student-detail-card">
                    <span class="student-detail-label">${t('sd_focus_label')}</span>
                    <p id="student-detail-goal">${t('sd_focus_empty')}</p>
                </div>
                <div class="student-detail-card">
                    <span class="student-detail-label">${t('sd_last_session')}</span>
                    <p id="student-detail-session">${t('sd_no_session')}</p>
                </div>
            </div>
            <div class="student-detail-meta-row">
                <div class="student-mini-stat">
                    <span>${t('sd_total_sessions')}</span>
                    <strong id="student-detail-total-sessions">0</strong>
                </div>
                <div class="student-mini-stat">
                    <span>${t('sd_total_minutes')}</span>
                    <strong id="student-detail-total-minutes">0 ${t('min_unit')}</strong>
                </div>
                <div class="student-mini-stat">
                    <span>${t('sd_last_summary')}</span>
                    <strong id="student-detail-story-progress">-</strong>
                </div>
            </div>
        `;
        menuHeader.insertAdjacentElement('afterend', detailPanel);
    }

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

function renderLearningAreaBlueprint() {
    const showcase = document.getElementById('learning-area-showcase');
    if (showcase) showcase.remove();

    const roadmap = document.getElementById('learning-roadmap-panel');
    if (roadmap) roadmap.remove();
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

    if (roleTitleEl) roleTitleEl.textContent = t('menu_panel_parent');
    if (roleCopyEl) roleCopyEl.textContent = t('menu_panel_copy_parent');

    if (studentSummaryNameEl) studentSummaryNameEl.textContent = activeStudentName || t('menu_not_selected');
    if (studentSummaryCopyEl) {
        if (student) {
            const note = student.support_notes ? student.support_notes : t('sd_note_empty');
            const yearText = student.birth_year ? t('sd_birth_year').replace('{y}', student.birth_year) + '. ' : '';
            studentSummaryCopyEl.textContent = `${yearText}${note}`;
        } else {
            studentSummaryCopyEl.textContent = t('menu_student_summary_hint');
        }
    }

    if (studentCountEl) studentCountEl.textContent = String(studentsCache.length);
    if (studentCountCopyEl) {
        studentCountCopyEl.textContent = t('menu_count_copy_parent');
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
        subtitleEl.textContent = t('sd_pick_hint');
        notesEl.textContent = t('sd_note_empty');
        goalEl.textContent = t('sd_focus_empty');
        sessionEl.textContent = t('sd_no_session');
        totalSessionsEl.textContent = '0';
        totalMinutesEl.textContent = '0 ' + t('min_unit');
        storyProgressEl.textContent = '-';
        return;
    }

    titleEl.textContent = student.full_name || t('sd_unnamed');
    subtitleEl.textContent = student.birth_year
        ? t('sd_subtitle_with_year').replace('{year}', student.birth_year)
        : t('sd_subtitle_default');
    notesEl.textContent = student.support_notes || t('sd_note_empty');

    const userId = await getCurrentUserId();
    const metrics = await loadStudentDetailMetrics(userId, student.id);
    goalEl.textContent = student.support_notes ? student.support_notes : t('sd_focus_empty');

    const recommendedArea = inferLearningArea(student);
    if (recommendedArea) {
        goalEl.textContent = `${recommendedArea.title} (${recommendedArea.ageRange}) • ${recommendedArea.outcomes[0]}`;
    }

    if (metrics.latestSession) {
        const sessionDate = new Date(getHistoryTimestamp(metrics.latestSession)).toLocaleDateString(_lang === 'en' ? 'en-US' : 'tr-TR');
        sessionEl.textContent = t('sd_session_line')
            .replace('{date}', sessionDate)
            .replace('{min}', metrics.latestSession.duration_min || 0)
            .replace('{turns}', metrics.latestSession.total_turns || 0);
        storyProgressEl.textContent = metrics.latestSession.story_completed
            ? t('report_completed')
            : t('sd_turns_line').replace('{n}', metrics.latestSession.total_turns || 0);
    } else {
        sessionEl.textContent = t('sd_no_session');
        storyProgressEl.textContent = '-';
    }

    totalSessionsEl.textContent = String(metrics.totalSessions);
    totalMinutesEl.textContent = `${metrics.totalMinutes} ${t('min_unit')}`;
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
        <button type="button" class="student-card ${student.id === activeStudentId ? 'active' : ''}" data-student-id="${escapeHtml(student.id)}">
            <h4>${escapeHtml(student.full_name) || t('sd_unnamed')}</h4>
            <p>${escapeHtml(student.support_notes) || t('sd_note_empty')}</p>
            <span class="student-card-meta">${student.birth_year ? t('sd_birth_year').replace('{y}', escapeHtml(String(student.birth_year))) : t('sd_birth_missing')}</span>
        </button>
    `).join('');
    listEl.querySelectorAll('.student-card').forEach(btn => {
        btn.addEventListener('click', () => selectStudent(btn.dataset.studentId));
    });
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
        consent_at: new Date().toISOString(),
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
    if (existing.length === 1) maybeStartFirstPractice();
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
    const createdAt = new Date().toISOString();
    return {
        id: sessionData.reportEntryId || createSessionHistoryId(),
        user_id: userId,
        created_by: userId,
        created_at: createdAt,
        updated_at: createdAt,
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
        card_used_in_therapy: sessionData.cardUsedInTherapy,
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
        sessionData.micUsedInTherapy ||
        sessionData.cardUsedInTherapy
    );
}

function getHistoryTimestamp(row) {
    const direct = row && (row.createdAt || row.created_at || row.updatedAt || row.updated_at);
    if (direct) {
        const parsed = new Date(direct);
        if (!Number.isNaN(parsed.getTime())) return direct;
    }
    const dateKey = row && (row.dateKey || row.session_date);
    if (typeof dateKey === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
        return `${dateKey}T12:00:00`;
    }
    return '';
}

async function loadReportHistory() {
    const userId = await getCurrentUserId();
    if (!userId) return [];
    const raw = await DB.get('session_history_' + userId);
    let all = [];
    if (Array.isArray(raw)) {
        all = raw;
    } else if (raw && Array.isArray(raw.data)) {
        all = raw.data;
        console.warn('loadReportHistory: normalized wrapped history payload', { userId });
    } else if (raw != null) {
        console.warn('loadReportHistory: unexpected history payload, using empty list', {
            userId,
            payloadType: typeof raw
        });
    }
    const data = activeStudentId ? all.filter(h => h.student_id === activeStudentId) : all;
    return data.slice(0, 180).map(mapHistoryRow);
}

function updateAdaptiveState() {
    if (!activeStudentId || !hasSessionActivity()) return;
    const key = 'adaptive_' + activeStudentId;
    const existing = DB.getSync(key) || {};
    const catStats = existing.categoryStats || {};

    sessionData.therapyTurns.forEach(turn => {
        const c = turn.category || t('report_other');
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

    DB.update(key, current => {
        const snapshot = current || existing || {};
        return {
            categoryStats: catStats,
            simplifyTotal: (snapshot.simplifyTotal || 0) + (sessionData.simplifyUsed || 0),
            totalTurns: (snapshot.totalTurns || 0) + sessionData.therapyTurns.length,
            totalSessions: (snapshot.totalSessions || 0) + 1,
            updatedAt: new Date().toISOString(),
        };
    });
}

async function persistSessionSnapshot() {
    if (!hasSessionActivity()) return loadReportHistory();
    updateAdaptiveState();

    const userId = await getCurrentUserId();
    if (!userId) return [];

    const durationMs = sessionData.startTime ? Date.now() - sessionData.startTime : 0;
    const durationMin = Math.max(1, Math.round(durationMs / 60000));
    const totalMic = sessionData.micUsedInTherapy;
    const totalTurns = sessionData.therapyTurns.length;
    const snapshot = buildSessionSnapshot(userId, durationMin, totalMic, '-', totalTurns);

    const key = 'session_history_' + userId;
    await DB.update(key, history => {
        const next = Array.isArray(history) ? history : [];
        const idx = next.findIndex(h => h.id === snapshot.id);
        if (idx >= 0) next[idx] = snapshot;
        else next.unshift(snapshot);
        if (next.length > 180) next.splice(180);
        return next;
    });

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
                            .replace('{mic}', entry.totalMic)}
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
// VELİ RAPORU (Analiz ekranının "Veli Özeti" sekmesi)
// =============================================
async function _populateReportTab() {
    // Temel bilgiler
    const now = new Date();
    document.getElementById('reportSubtitle').textContent =
        `${childName} • ${now.toLocaleDateString(_lang === 'en' ? 'en-US' : 'tr-TR', { day:'numeric', month:'long', year:'numeric' })}`;
    document.getElementById('reportDate').textContent =
        t('report_generated_at').replace('{date}', now.toLocaleString(_lang === 'en' ? 'en-US' : 'tr-TR'));

    const history = await persistSessionSnapshot();
    renderReportHistory(history);
    renderObjResultsSummary();
    renderWeeklySummaryCard();
    renderRoutineCard();

    // İstatistikler son 7 günü anlatır — rapor ne zaman açılırsa açılsın dolu
    const weekAgo = Date.now() - 7 * 86400000;
    const week = history.filter(h => {
        const ts = getHistoryTimestamp(h);
        return ts ? new Date(ts).getTime() >= weekAgo : false;
    });
    const weekMinutes = week.reduce((s, h) => s + (h.durationMin || 0), 0);
    const weekTurns = week.reduce((s, h) => s + (h.totalTurns || 0), 0);
    const weekMic = week.reduce((s, h) => s + (h.micUsedInTherapy || 0), 0);
    document.getElementById('statWeekSessions').textContent = week.length;
    document.getElementById('statDuration').textContent = t('report_minutes').replace('{minutes}', weekMinutes);
    document.getElementById('statTotalTurns').textContent = weekTurns;
    const starsEl = document.getElementById('statStarsEarned');
    if (starsEl) starsEl.textContent = getStarState().total;

    const learningAreaPlanEl = document.getElementById('learningAreaPlan');
    if (learningAreaPlanEl) {
        const student = studentsCache.find(item => item.id === activeStudentId);
        const recommendedArea = inferLearningArea(student);
        learningAreaPlanEl.innerHTML = `
            <div class="learning-area-plan-card emphasis">
                <span class="learning-area-plan-label">${t('report_first_focus')}</span>
                <strong>${recommendedArea.title}</strong>
                <p>${recommendedArea.summary}</p>
            </div>
        `;
    }

    // Terapi logu — yalnizca bu oturumda konusma yapildiysa goster
    const therapyEl = document.getElementById('therapyLog');
    const therapySection = therapyEl?.closest('.report-section');
    if (sessionData.therapyTurns.length > 0) {
        if (therapySection) therapySection.style.display = '';
        therapyEl.innerHTML = '';
        sessionData.therapyTurns.forEach(turn => {
            const entry = document.createElement('div');
            entry.className = 'therapy-entry';
            entry.innerHTML = `<div class="therapy-q">🎙️ ${turn.location ? `${escapeHtml(turn.location)} • ` : ''}${turn.category ? `${escapeHtml(turn.category)} • ` : ''}${t('report_question_prefix')}${escapeHtml(turn.question)}</div>${escapeHtml(turn.answer)}`;
            therapyEl.appendChild(entry);
        });
    } else if (therapySection) {
        therapySection.style.display = 'none';
    }

    // AI değerlendirmesi — anlamli veri yoksa bolumu gizle, Gemini'yi cagirma
    const aiSection = document.getElementById('aiEvalText')?.closest('.report-section');
    const hasObjData = (DB.getSync('obj_results_' + (activeStudentId || 'default')) || []).length > 0;
    if (!week.length && !hasObjData && !sessionData.therapyTurns.length) {
        if (aiSection) aiSection.style.display = 'none';
    } else {
        if (aiSection) aiSection.style.display = '';
        document.getElementById('aiEvalLoading').style.display = 'block';
        document.getElementById('aiEvalText').style.display = 'none';
        await generateAIEvaluation(week.length, weekMinutes, weekMic, weekTurns);
    }
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

async function generateAIEvaluation(weekSessions, weekMinutes, weekMic, weekTurns) {
    const objResults = (DB.getSync('obj_results_' + (activeStudentId || 'default')) || []).slice(0, 6);
    const sortText = objResults.map(r => {
        const acc = r.items + (r.errors || 0) > 0
            ? Math.round((r.items / (r.items + (r.errors || 0))) * 100) : 100;
        return `- Nesne Tanıma: %${acc} doğruluk (${r.errors || 0} hata)`;
    }).join('\n') || 'Henüz oyun oynanmadı.';

    const therapySample = sessionData.therapyTurns.slice(0, 5).map(t =>
        `Soru: "${t.question}" → Cevap: "${t.answer}"`).join('\n') || 'Terapi oturumu yok.';

    const _adaptiveText = _buildAdaptiveContextText();

    let _contextBlock = '';
    if (_adaptiveText) _contextBlock += `\nKATEGORİ PERFORMANSI (geçmiş seans toplamı):\n${_adaptiveText}\n`;

    const prompt = _lang === 'en'
        ? `You are an empathetic assistant specialized in special education and speech therapy.
The data below comes from a student's session in the Yıldız Can app.

Last 7 days: ${weekSessions} sessions, ${weekMinutes} minutes total, ${weekTurns} answers, ${weekMic} independent microphone uses
${_contextBlock}
Recent sorting/matching game results:
${sortText}

Samples from speech practice:
${therapySample}

Please write a warm, professional evaluation in English addressed to the parent, in 3-4 paragraphs covering:
1. The child's overall engagement and motivation over the last week
2. Cognitive/academic cues observed from the game results
3. Notable points regarding speech and communication
4. ${_adaptiveText ? 'Concrete category-level suggestions for the family referencing the category data (e.g. which themes to reinforce at home) and an encouraging closing' : 'Concrete suggestions for the family and an encouraging closing'}

Do not use any emoji. Use warm, professional and hopeful language.`
        : `Sen özel eğitim ve konuşma terapisi alanında uzman, empati dolu bir asistansın.
Aşağıdaki veriler, bir öğrencinin Yıldız Can uygulamasındaki oturum verisidir.

Son 7 gün: ${weekSessions} seans, toplam ${weekMinutes} dakika, ${weekTurns} yanıt, ${weekMic} bağımsız mikrofon kullanımı
${_contextBlock}
Son sıralama/eşleştirme oyunu sonuçları:
${sortText}

Konuşma terapisinden örnekler:
${therapySample}

Lütfen veliye hitap ederek, 3-4 paragraf halinde şunları içeren sevecen ve profesyonel bir Türkçe değerlendirme yaz:
1. Çocuğun son bir haftadaki genel katılımı ve motivasyonu
2. Oyun sonuçlarından gözlemlenen bilişsel/akademik ipuçları
3. Konuşma ve iletişim açısından dikkat çeken noktalar
4. ${_adaptiveText ? 'Kategori verilerini referans alarak aileye kategori düzeyinde somut öneriler (ör. hangi temalar evde pekiştirilmeli) ve teşvik edici bir kapanış' : 'Aileye somut öneriler ve teşvik edici bir kapanış'}

Kesinlikle emoji kullanma. Sıcak, profesyonel ve umut verici bir dil kullan.`;

    try {
        const res = await fetch(API_BASE + '/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...apiAuthHeaders() },
            body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: prompt }] }]
            })
        });
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        document.getElementById('aiEvalLoading').style.display = 'none';
        const evalEl = document.getElementById('aiEvalText');
        evalEl.textContent = text;
        evalEl.style.display = 'block';
    } catch(e) {
        document.getElementById('aiEvalLoading').style.display = 'none';
        const evalEl = document.getElementById('aiEvalText');
        evalEl.textContent = t('report_eval_fallback').replace('{name}', childName);
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

const THERAPY_LEVELS = {
    word: {
        labelKey: 'therapy_level_word',
        promptHintEn: 'Every question generated must be a grammatically complete, natural, and friendly sentence. Avoid telegraphic, clipped, or fragmented questions (e.g. NEVER ask "Pass to whom?" or "Which color?". Instead, ask complete questions like "Who do you want to pass the ball to when playing soccer?" or "What is the color of your favorite pen?"). The question should be structured so the child can answer with a single word or a very short 2-word phrase.',
        promptHintTr: 'Soruların kendisi kesinlikle dil bilgisi açısından tam, kurallı, doğal, anlaşılır ve akıcı cümlelerden oluşmalıdır. Asla yarım, kesik veya telgraf diliyle soru sorma (Örn: "Kime pas?", "Hangi renk?", "Nerede gitmek?" gibi yetersiz sorular ASLA yazma. Bunun yerine "Futbol oynarken topu kime pas atmak istersin?", "En sevdiğin kalemin rengi nedir?" gibi tam cümleler kur). Soru, çocuğun tek kelime ya da en fazla 2 kelimelik çok kısa bir ifadeyle cevaplayabileceği şekilde (seçim yapma, nesne/kişi adlandırma, yer sorma) tasarlanmalıdır.',
        replyRuleEn: 'ONE-WORD MODE: Every reply must be MAXIMUM 4 short words before the emoji.',
        replyRuleTr: 'TEK KELİME MODU: Her cevabın emojiden önce EN FAZLA 4 kısa kelime olsun.'
    },
    sentence: {
        labelKey: 'therapy_level_sentence',
        promptHintEn: 'Every question generated must be a grammatically complete, natural, and friendly sentence. Frame the question to invite a simple, structured single-sentence response from the child about concrete daily events. Avoid fragmented language.',
        promptHintTr: 'Soruların kendisi kesinlikle dil bilgisi açısından tam, kurallı, doğal, anlaşılır ve akıcı cümlelerden oluşmalıdır. Çocuğu kısa ve basit bir cümle kurmaya teşvik edecek, günlük yaşamdan somut konuları sor. Asla yarım, kesik veya telgraf diliyle soru yazma.',
        replyRuleEn: 'SHORT-SENTENCE MODE: Every reply must be MAXIMUM 7 short words before the emoji.',
        replyRuleTr: 'KISA CÜMLE MODU: Her cevabın emojiden önce EN FAZLA 7 kısa kelime olsun.'
    },
    tell: {
        labelKey: 'therapy_level_tell',
        promptHintEn: 'Every question generated must be a grammatically complete, natural, and friendly sentence. Frame open-ended, child-friendly questions that encourage the child to describe events or tell short stories.',
        promptHintTr: 'Soruların kendisi kesinlikle dil bilgisi açısından tam, kurallı, doğal, anlaşılır ve akıcı cümlelerden oluşmalıdır. Çocuğun daha uzun açıklamalar yapmasını, olayları anlatmasını teşvik edecek açık uçlu ama çocuk dostu sorular sor. Asla yarım, kesik veya telgraf diliyle soru yazma.',
        replyRuleEn: 'TELL-ME-MORE MODE: Every reply must be MAXIMUM 10 simple words before the emoji.',
        replyRuleTr: 'ANLAT BAKALIM MODU: Her cevabın emojiden önce EN FAZLA 10 basit kelime olsun.'
    }
};

const THERAPY_CATEGORIES = {
    daily_life: {
        emoji: '🏠',
        get label() { return t('therapy_daily_life_label'); },
        get summary() { return t('therapy_daily_life_summary'); },
        questions: [
            { get q() { return t('therapy_daily_life_q1'); }, query: "child morning routine home", videoIds: [10565816, 10566600, 12426492], get goal() { return t('therapy_daily_life_goal1'); } },
            { get q() { return t('therapy_daily_life_q2'); }, query: "child getting ready backpack school", videoIds: [5088099, 8097527, 5088098], get goal() { return t('therapy_daily_life_goal2'); } },
            { get q() { return t('therapy_daily_life_q3'); }, query: "family kitchen child asking food", videoIds: [7783337, 6305044, 7677093], get goal() { return t('therapy_daily_life_goal3'); } },
            { get q() { return t('therapy_daily_life_q4'); }, query: "child with parent grocery store", videoIds: [3191108, 5090314, 7652367], get goal() { return t('therapy_daily_life_goal4'); } },
            { get q() { return t('therapy_daily_life_q5'); }, query: "family evening home child smiling", videoIds: [6557760, 7884066, 6668277], get goal() { return t('therapy_daily_life_goal5'); } },
            { get q() { return t('therapy_daily_life_q6'); }, query: "child putting on shoes jacket", videoIds: [8084137, 7413712, 8187799], get goal() { return t('therapy_daily_life_goal6'); } },
            { get q() { return t('therapy_daily_life_q7'); }, query: "child room toys books", videoIds: [4016503, 3676820, 3676981], get goal() { return t('therapy_daily_life_goal7'); } },
            { get q() { return t('therapy_daily_life_q8'); }, query: "child washing hands sink", videoIds: [8799075, 7413438, 7491034], get goal() { return t('therapy_daily_life_goal8'); } },
            { get q() { return t('therapy_daily_life_q9'); }, query: "family visiting child greeting", videoIds: [6149761, 5738133, 5737816], get goal() { return t('therapy_daily_life_goal9'); } },
            { get q() { return t('therapy_daily_life_q10'); }, query: "parent helping child at home", videoIds: [7982002, 7084641, 8122657], get goal() { return t('therapy_daily_life_goal10'); } }
        ]
    },
    emotions: {
        emoji: '😊',
        get label() { return t('therapy_emotions_label'); },
        get summary() { return t('therapy_emotions_summary'); },
        questions: [
            { get q() { return t('therapy_emotions_q1'); }, query: "child face expression happy calm", videoIds: [6248334, 6952296, 4156373], get goal() { return t('therapy_emotions_goal1'); } },
            { get q() { return t('therapy_emotions_q2'); }, query: "happy child playing family", videoIds: [8503011, 7312129, 7312508], get goal() { return t('therapy_emotions_goal2'); } },
            { get q() { return t('therapy_emotions_q3'); }, query: "child comfort emotional support", videoIds: [6594035, 7077315, 7696880], get goal() { return t('therapy_emotions_goal3'); } },
            { get q() { return t('therapy_emotions_q4'); }, query: "excited child jumping smiling", videoIds: [4267882, 8385335, 8142277], get goal() { return t('therapy_emotions_goal4'); } },
            { get q() { return t('therapy_emotions_q5'); }, query: "child seeking comfort parent", videoIds: [6296673, 6296661, 6594035], get goal() { return t('therapy_emotions_goal5'); } },
            { get q() { return t('therapy_emotions_q6'); }, query: "friends hugging happy child", videoIds: [7143731, 7418480, 7119575], get goal() { return t('therapy_emotions_goal6'); } },
            { get q() { return t('therapy_emotions_q7'); }, query: "child calming down quiet activity", videoIds: [8046561, 8046666, 7117643], get goal() { return t('therapy_emotions_goal7'); } },
            { get q() { return t('therapy_emotions_q8'); }, query: "surprised child classroom", videoIds: [5427895, 7327600, 32965117], get goal() { return t('therapy_emotions_goal8'); } },
            { get q() { return t('therapy_emotions_q9'); }, query: "child taking deep breath calm", videoIds: [7414827, 6952367, 8046718], get goal() { return t('therapy_emotions_goal9'); } },
            { get q() { return t('therapy_emotions_q10'); }, query: "child smiling face close up", videoIds: [5553332, 9149384, 7327402], get goal() { return t('therapy_emotions_goal10'); } }
        ]
    },
    social_communication: {
        emoji: '🤝',
        get label() { return t('therapy_social_communication_label'); },
        get summary() { return t('therapy_social_communication_summary'); },
        questions: [
            { get q() { return t('therapy_social_communication_q1'); }, query: "children greeting playground", videoIds: [8813232, 17566449, 8747612], get goal() { return t('therapy_social_communication_goal1'); } },
            { get q() { return t('therapy_social_communication_q2'); }, query: "child asking teacher classroom", videoIds: [8088553, 8612576, 8160138], get goal() { return t('therapy_social_communication_goal2'); } },
            { get q() { return t('therapy_social_communication_q3'); }, query: "children inviting to play", videoIds: [36619321, 8435433, 8951288], get goal() { return t('therapy_social_communication_goal3'); } },
            { get q() { return t('therapy_social_communication_q4'); }, query: "child comforting friend school", videoIds: [8343385, 8411138, 7395345], get goal() { return t('therapy_social_communication_goal4'); } },
            { get q() { return t('therapy_social_communication_q5'); }, query: "children waiting in line school", videoIds: [8466936, 33787982, 32778876], get goal() { return t('therapy_social_communication_goal5'); } },
            { get q() { return t('therapy_social_communication_q6'); }, query: "kids apologizing playground", videoIds: [3820545, 19066157, 3877708], get goal() { return t('therapy_social_communication_goal6'); } },
            { get q() { return t('therapy_social_communication_q7'); }, query: "children sharing toy", videoIds: [8160025, 6949134, 3678330], get goal() { return t('therapy_social_communication_goal7'); } },
            { get q() { return t('therapy_social_communication_q8'); }, query: "children talking together classroom", videoIds: [8088460, 8088621, 8088465], get goal() { return t('therapy_social_communication_goal8'); } },
            { get q() { return t('therapy_social_communication_q9'); }, query: "child introducing self friendly", videoIds: [8159592, 8160271, 6296878], get goal() { return t('therapy_social_communication_goal9'); } },
            { get q() { return t('therapy_social_communication_q10'); }, query: "kids helping each other smiling", videoIds: [8160132, 5378775, 8441301], get goal() { return t('therapy_social_communication_goal10'); } }
        ]
    },
    play_sports: {
        emoji: '⚽',
        get label() { return t('therapy_play_sports_label'); },
        get summary() { return t('therapy_play_sports_summary'); },
        questions: [
            { get q() { return t('therapy_play_sports_q1'); }, query: "children playing in park", videoIds: [35026549, 6300728, 6299173], get goal() { return t('therapy_play_sports_goal1'); } },
            { get q() { return t('therapy_play_sports_q2'); }, query: "kids football basketball playground", videoIds: [8813011, 35005315, 37483482], get goal() { return t('therapy_play_sports_goal2'); } },
            { get q() { return t('therapy_play_sports_q3'); }, query: "children team game outdoors", videoIds: [8813229, 8813010, 8813225], get goal() { return t('therapy_play_sports_goal3'); } },
            { get q() { return t('therapy_play_sports_q4'); }, query: "child indoor game home", videoIds: [35461749, 6337134, 7270073], get goal() { return t('therapy_play_sports_goal4'); } },
            { get q() { return t('therapy_play_sports_q5'); }, query: "kids playing together sharing", videoIds: [8670996, 5266831, 34095824], get goal() { return t('therapy_play_sports_goal5'); } },
            { get q() { return t('therapy_play_sports_q6'); }, query: "children cycling and ball game", videoIds: [32578916, 15092942, 8035236], get goal() { return t('therapy_play_sports_goal6'); } },
            { get q() { return t('therapy_play_sports_q7'); }, query: "active child running smiling", videoIds: [5273821, 6300735, 7106839], get goal() { return t('therapy_play_sports_goal7'); } },
            { get q() { return t('therapy_play_sports_q8'); }, query: "child learning game rules", videoIds: [7789322, 7789317, 7788806], get goal() { return t('therapy_play_sports_goal8'); } },
            { get q() { return t('therapy_play_sports_q9'); }, query: "children passing ball teamwork", videoIds: [8813013, 8812925, 8813008], get goal() { return t('therapy_play_sports_goal9'); } },
            { get q() { return t('therapy_play_sports_q10'); }, query: "child trying sports outdoors", videoIds: [8337361, 8224290, 7844324], get goal() { return t('therapy_play_sports_goal10'); } }
        ]
    }
};

const THERAPY_LEVEL_BUCKETS = {
    category: {
        daily_life: {
            word: [0, 1, 2, 3, 6, 7],
            sentence: [4, 5, 8, 9, 1, 3],
            tell: [0, 4, 5, 8, 9, 6]
        },
        emotions: {
            word: [0, 1, 2, 4, 5, 7],
            sentence: [1, 2, 5, 6, 8, 9],
            tell: [3, 4, 6, 7, 8, 9]
        },
        social_communication: {
            word: [0, 1, 2, 5, 6, 8],
            sentence: [3, 4, 7, 8, 9, 0],
            tell: [1, 2, 3, 4, 7, 9]
        },
        play_sports: {
            word: [0, 1, 2, 3, 8, 9],
            sentence: [4, 5, 6, 7, 8, 0],
            tell: [1, 4, 5, 6, 7, 9]
        }
    },
    location: {
        home: {
            word: [0, 1, 2, 4, 6, 9],
            sentence: [3, 4, 5, 7, 8, 1],
            tell: [0, 3, 5, 8, 9, 2]
        },
        school: {
            word: [0, 1, 2, 5, 7, 9],
            sentence: [3, 4, 6, 8, 9, 1],
            tell: [1, 2, 3, 4, 6, 8]
        },
        market: {
            word: [0, 1, 2, 5, 6, 7],
            sentence: [3, 4, 7, 8, 9, 1],
            tell: [2, 3, 4, 8, 9, 6]
        },
        park: {
            word: [0, 1, 2, 4, 5, 9],
            sentence: [2, 3, 5, 6, 9, 0],
            tell: [3, 6, 7, 8, 9, 4]
        },
        hospital: {
            word: [0, 1, 2, 4, 7, 9],
            sentence: [3, 4, 5, 7, 8, 9],
            tell: [1, 2, 3, 5, 6, 8]
        }
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
            { get q() { return t('city_home_q1'); }, query: "child morning at home with family", videoIds: [6250053, 5426093, 7218626], get goal() { return t('city_home_qgoal1'); } },
            { get q() { return t('city_home_q2'); }, query: "child asking for food at home", videoIds: [7077302, 5426093, 6305044], get goal() { return t('city_home_qgoal2'); } },
            { get q() { return t('city_home_q3'); }, query: "parent helping child find toy at home", videoIds: [10565778, 7312399, 8747240], get goal() { return t('city_home_qgoal3'); } },
            { get q() { return t('city_home_q4'); }, query: "family evening at home child smiling", videoIds: [6557760, 10565817, 6668277], get goal() { return t('city_home_qgoal4'); } },
            { get q() { return t('city_home_q5'); }, query: "child bedtime routine brushing teeth", videoIds: [10565917, 10565816, 10566590], get goal() { return t('city_home_qgoal5'); } },
            { get q() { return t('city_home_q6'); }, query: "child greeting guest at home", videoIds: [7418264, 7119590, 6194388], get goal() { return t('city_home_qgoal6'); } },
            { get q() { return t('city_home_q7'); }, query: "child asking for blanket at home", videoIds: [10555330, 7505573, 7505331], get goal() { return t('city_home_qgoal7'); } },
            { get q() { return t('city_home_q8'); }, query: "family dinner child speaking politely", videoIds: [7783337, 6305041, 6305176], get goal() { return t('city_home_qgoal8'); } },
            { get q() { return t('city_home_q9'); }, query: "child organizing room toys books", videoIds: [8363236, 6949133, 6949125], get goal() { return t('city_home_qgoal9'); } },
            { get q() { return t('city_home_q10'); }, query: "happy child home family moment", videoIds: [8503011, 7218708, 6667314], get goal() { return t('city_home_qgoal10'); } }
        ]
    },
    school: {
        get label() { return t('city_school_label'); },
        category: 'social_communication',
        get summary() { return t('city_school_summary'); },
        get description() { return t('city_school_description'); },
        get goals() { return [t('city_school_goal1'), t('city_school_goal2'), t('city_school_goal3')]; },
        questions: [
            { get q() { return t('city_school_q1'); }, query: "child greeting teacher classroom morning", videoIds: [8160023, 8160138, 8499766], get goal() { return t('city_school_qgoal1'); } },
            { get q() { return t('city_school_q2'); }, query: "teacher giving instruction to child in classroom", videoIds: [5904542, 8926828, 8617052], get goal() { return t('city_school_qgoal2'); } },
            { get q() { return t('city_school_q3'); }, query: "child asking teacher for help classroom", videoIds: [8927383, 8617296, 5200023], get goal() { return t('city_school_qgoal3'); } },
            { get q() { return t('city_school_q4'); }, query: "children talking in schoolyard", videoIds: [5391540, 8439331, 8439337], get goal() { return t('city_school_qgoal4'); } },
            { get q() { return t('city_school_q5'); }, query: "child helping classmate pencil classroom", videoIds: [8363891, 5897659, 8363261], get goal() { return t('city_school_qgoal5'); } },
            { get q() { return t('city_school_q6'); }, query: "child raising hand in classroom", videoIds: [8088631, 8342247, 8363230], get goal() { return t('city_school_qgoal6'); } },
            { get q() { return t('city_school_q7'); }, query: "teacher and child talking about lessons", videoIds: [7580121, 7580126, 8927545], get goal() { return t('city_school_qgoal7'); } },
            { get q() { return t('city_school_q8'); }, query: "child introducing self at school", videoIds: [8612577, 8500530, 8926873], get goal() { return t('city_school_qgoal8'); } },
            { get q() { return t('city_school_q9'); }, query: "children waiting in line at school", videoIds: [8466936, 33787982, 32778876], get goal() { return t('city_school_qgoal9'); } },
            { get q() { return t('city_school_q10'); }, query: "child saying goodbye to teacher", videoIds: [6935841, 8088619, 8617296], get goal() { return t('city_school_qgoal10'); } }
        ]
    },
    market: {
        get label() { return t('city_market_label'); },
        category: 'daily_life',
        get summary() { return t('city_market_summary'); },
        get description() { return t('city_market_description'); },
        get goals() { return [t('city_market_goal1'), t('city_market_goal2'), t('city_market_goal3')]; },
        questions: [
            { get q() { return t('city_market_q1'); }, query: "child in grocery store asking for item", videoIds: [3191108, 4121754, 4122971], get goal() { return t('city_market_qgoal1'); } },
            { get q() { return t('city_market_q2'); }, query: "child choosing fruit in market", videoIds: [5100074, 8802294, 4121739], get goal() { return t('city_market_qgoal2'); } },
            { get q() { return t('city_market_q3'); }, query: "parent and child shopping together", videoIds: [3191108, 7652367, 5090314], get goal() { return t('city_market_qgoal3'); } },
            { get q() { return t('city_market_q4'); }, query: "family waiting at grocery checkout", videoIds: [7457422, 4121754, 4122971], get goal() { return t('city_market_qgoal4'); } },
            { get q() { return t('city_market_q5'); }, query: "store worker helping child in supermarket", videoIds: [4122971, 3191108, 4230414], get goal() { return t('city_market_qgoal5'); } },
            { get q() { return t('city_market_q6'); }, query: "child asking snack at market", videoIds: [36066727, 15955693, 8576591], get goal() { return t('city_market_qgoal6'); } },
            { get q() { return t('city_market_q7'); }, query: "child deciding drink in market aisle", videoIds: [29846453, 33006235, 13752470], get goal() { return t('city_market_qgoal7'); } },
            { get q() { return t('city_market_q8'); }, query: "child saying thank you cashier store", videoIds: [14936143, 1322056, 29832466], get goal() { return t('city_market_qgoal8'); } },
            { get q() { return t('city_market_q9'); }, query: "child asking help carrying grocery bag", videoIds: [6950817, 6248171, 7652369], get goal() { return t('city_market_qgoal9'); } },
            { get q() { return t('city_market_q10'); }, query: "shopping basket groceries child speaking", videoIds: [3191108, 8027660, 8420585], get goal() { return t('city_market_qgoal10'); } }
        ]
    },
    park: {
        get label() { return t('city_park_label'); },
        category: 'play_sports',
        get summary() { return t('city_park_summary'); },
        get description() { return t('city_park_description'); },
        get goals() { return [t('city_park_goal1'), t('city_park_goal2'), t('city_park_goal3')]; },
        questions: [
            { get q() { return t('city_park_q1'); }, query: "children choosing game in park", videoIds: [8034251, 8034266, 8034261], get goal() { return t('city_park_qgoal1'); } },
            { get q() { return t('city_park_q2'); }, query: "children at playground talking", videoIds: [8439337, 8440014, 8441305], get goal() { return t('city_park_qgoal2'); } },
            { get q() { return t('city_park_q3'); }, query: "kids passing ball in park", videoIds: [7844070, 7844079, 8034942], get goal() { return t('city_park_qgoal3'); } },
            { get q() { return t('city_park_q4'); }, query: "children waiting for slide in park", videoIds: [4978365, 17566449, 35026549], get goal() { return t('city_park_qgoal4'); } },
            { get q() { return t('city_park_q5'); }, query: "active child running in park", videoIds: [7102395, 7106803, 8208864], get goal() { return t('city_park_qgoal5'); } },
            { get q() { return t('city_park_q6'); }, query: "children talking after game in park", videoIds: [8034251, 8034225, 8034266], get goal() { return t('city_park_qgoal6'); } },
            { get q() { return t('city_park_q7'); }, query: "children playing football and hide and seek", videoIds: [35025845, 8813022, 38026650], get goal() { return t('city_park_qgoal7'); } },
            { get q() { return t('city_park_q8'); }, query: "child explaining game rules to friend", videoIds: [7789319, 8034226, 8083044], get goal() { return t('city_park_qgoal8'); } },
            { get q() { return t('city_park_q9'); }, query: "child helping friend who fell at park", videoIds: [10397888, 8747610, 7981668], get goal() { return t('city_park_qgoal9'); } },
            { get q() { return t('city_park_q10'); }, query: "children leaving park saying goodbye", videoIds: [6299146, 8813155, 6300525], get goal() { return t('city_park_qgoal10'); } }
        ]
    },
    hospital: {
        get label() { return t('city_hospital_label'); },
        category: 'emotions',
        get summary() { return t('city_hospital_summary'); },
        get description() { return t('city_hospital_description'); },
        get goals() { return [t('city_hospital_goal1'), t('city_hospital_goal2'), t('city_hospital_goal3')]; },
        questions: [
            { get q() { return t('city_hospital_q1'); }, query: "child at hospital waiting room calm", videoIds: [8460065, 8460057, 6997945], get goal() { return t('city_hospital_qgoal1'); } },
            { get q() { return t('city_hospital_q2'); }, query: "doctor listening to child patient", videoIds: [5998350, 5998345, 5998348], get goal() { return t('city_hospital_qgoal2'); } },
            { get q() { return t('city_hospital_q3'); }, query: "child seeking comfort hospital", videoIds: [8375451, 8460012, 6036525], get goal() { return t('city_hospital_qgoal3'); } },
            { get q() { return t('city_hospital_q4'); }, query: "doctor and child talking gently", videoIds: [5998347, 5998348, 8460056], get goal() { return t('city_hospital_qgoal4'); } },
            { get q() { return t('city_hospital_q5'); }, query: "nurse helping child in hospital", videoIds: [8460012, 6036525], get goal() { return t('city_hospital_qgoal5'); } },
            { get q() { return t('city_hospital_q6'); }, query: "child relieved after doctor visit", videoIds: [5998345, 8460052, 8460055], get goal() { return t('city_hospital_qgoal6'); } },
            { get q() { return t('city_hospital_q7'); }, query: "family in hospital waiting room", videoIds: [6997945, 6997934, 6129938], get goal() { return t('city_hospital_qgoal7'); } },
            { get q() { return t('city_hospital_q8'); }, query: "child asking for blanket hospital", videoIds: [10555330, 5858754, 5894886], get goal() { return t('city_hospital_qgoal8'); } },
            { get q() { return t('city_hospital_q9'); }, query: "doctor checking child wellness", videoIds: [5998345, 5998350, 8460053], get goal() { return t('city_hospital_qgoal9'); } },
            { get q() { return t('city_hospital_q10'); }, query: "child thanking doctor after appointment", videoIds: [5998347, 5998348, 8460055], get goal() { return t('city_hospital_qgoal10'); } }
        ]
    }
};

function cityQ(locationKey, n) { return CITY_LOCATIONS[locationKey].questions[n - 1]; }
function catQ(categoryKey, n) { return THERAPY_CATEGORIES[categoryKey].questions[n - 1]; }
function mapQ(prefix, n, query) {
    return {
        get q() { return t('map_' + prefix + '_q' + n); },
        query,
        get goal() { return t('map_' + prefix + '_qgoal' + n); }
    };
}

const SPEECH_MAP_TOPICS = [
    {
        key: 'greetings', emoji: '👋', category: 'social_communication',
        get label() { return t('map_topic_greetings'); },
        questions: [cityQ('school', 1), cityQ('home', 6), catQ('social_communication', 1), cityQ('school', 10), cityQ('park', 10), mapQ('greet', 1, 'child waking up morning family')]
    },
    {
        key: 'introduce', emoji: '🙋', category: 'social_communication',
        get label() { return t('map_topic_introduce'); },
        questions: [mapQ('intro', 1, 'child saying name introduction'), mapQ('intro', 2, 'child showing age fingers smiling'), mapQ('intro', 3, 'happy family portrait home'), mapQ('intro', 4, 'child favorite toy playing'), catQ('social_communication', 9), cityQ('school', 8)]
    },
    {
        key: 'emotions', emoji: '😊', category: 'emotions',
        get label() { return t('map_topic_emotions'); },
        questions: [catQ('emotions', 1), catQ('emotions', 2), catQ('emotions', 3), catQ('emotions', 4), catQ('emotions', 5), catQ('emotions', 9)]
    },
    {
        key: 'daily', emoji: '🌞', category: 'daily_life',
        get label() { return t('map_topic_daily'); },
        questions: [catQ('daily_life', 1), catQ('daily_life', 2), catQ('daily_life', 6), catQ('daily_life', 8), cityQ('home', 5), catQ('daily_life', 7)]
    },
    {
        key: 'school', emoji: '🏫', category: 'social_communication',
        get label() { return t('map_topic_school'); },
        questions: [cityQ('school', 2), cityQ('school', 3), cityQ('school', 5), cityQ('school', 6), catQ('social_communication', 3), catQ('social_communication', 7)]
    },
    {
        key: 'food', emoji: '🍎', category: 'daily_life',
        get label() { return t('map_topic_food'); },
        questions: [cityQ('home', 2), catQ('daily_life', 3), cityQ('market', 2), cityQ('market', 7), cityQ('home', 8), mapQ('food', 1, 'child eating favorite food happy')]
    },
    {
        key: 'hobbies', emoji: '⚽', category: 'play_sports',
        get label() { return t('map_topic_hobbies'); },
        questions: [catQ('play_sports', 1), catQ('play_sports', 2), cityQ('park', 1), mapQ('hobby', 1, 'child drawing painting hobby'), mapQ('hobby', 2, 'child watching cartoon happy'), mapQ('hobby', 3, 'children playing board game home')]
    },
    {
        key: 'places', emoji: '🗺️', category: 'daily_life',
        get label() { return t('map_topic_places'); },
        questions: [mapQ('places', 1, 'child going to school walking'), mapQ('places', 2, 'child cozy bedroom playing'), cityQ('home', 3), mapQ('places', 3, 'family going to park together'), mapQ('places', 4, 'family trip children beach'), cityQ('market', 1)]
    },
    {
        key: 'problem', emoji: '💡', category: 'social_communication',
        get label() { return t('map_topic_problem'); },
        questions: [catQ('social_communication', 2), cityQ('park', 9), catQ('social_communication', 6), cityQ('market', 9), mapQ('problem', 1, 'child asking parent help reaching'), mapQ('problem', 2, 'child broken toy sad')]
    },
    {
        key: 'dreams', emoji: '🌟', category: 'emotions',
        get label() { return t('map_topic_dreams'); },
        questions: [mapQ('dream', 1, 'child dreaming future profession'), mapQ('dream', 2, 'child superhero cape playing'), mapQ('dream', 3, 'child airplane travel window'), mapQ('dream', 4, 'child birthday present excited'), mapQ('dream', 5, 'children planning fun activity'), mapQ('dream', 6, 'happy child looking at sky')]
    }
];

let currentTherapyCategoryKey = 'daily_life';
let currentTherapyLevelKey = '';
let currentMapTopic = null;
let _pendingMapTopicKey = null;
let _mapSessionBaseline = null;
let unaskedQuestions = [];
let isWaiting = false;
let isProcessingTherapySpeech = false;
let chatHistory = [];
let idleTimer;
let turnCount = 0;

// =============================================
// İLERLEME & YARDIMCI FONKSIYONLAR
// =============================================
function updateProgressBar() {
    const total = sessionTotalQuestions || 6;
    const answered = total - unaskedQuestions.length;
    const pct = total > 0 ? Math.round((answered / total) * 100) : 0;

    const fill = document.getElementById('therapyProgressFill');
    const label = document.getElementById('therapyProgressLabel');
    if (fill) fill.style.width = pct + '%';
    if (label) label.textContent = t('therapy_progress').replace('{a}', answered).replace('{t}', total);
}

function rereadQuestion() {
    if (currentObj) {
        speak(currentObj.q, () => {});
    }
}

async function askAIMode(mode) {
    if (!currentObj) return;
    if (mode === 'repeat') {
        sessionData.repeatUsed++;
        addMessage(_lang === 'en' ? 'Reading the question again...' : 'Soruyu tekrar okuyorum...', 'ai');
        speak(currentObj.q, () => {});
    } else if (mode === 'simplify') {
        sessionData.simplifyUsed++;
        const _sCat = getCurrentTherapyCategory().label;
        sessionData.simplifyByCategory[_sCat] = (sessionData.simplifyByCategory[_sCat] || 0) + 1;
        const simplePrompt = _lang === 'en'
            ? `Explain this question in very simple words (1-2 words max) for a child aged 4-8 with special education needs: "${currentObj.q}". Maximum 1 short sentence.`
            : `Şu soruyu, 4-8 yaş arası özel eğitim desteği alan bir çocuk için çok basit 1-2 kelimeyle açıkla: "${currentObj.q}". Maksimum 1 kısa cümle.`;
        const res = await getGemmaResponse(simplePrompt);
        addMessage(res, 'ai');
        speak(res, () => {});
    }
}

let _thAacBoardKey = null;
let _thAacSentence = [];

function openTherapyAacPicker() {
    const boards = AACData.boards;
    if (!_thAacBoardKey || !boards.find(b => b.key === _thAacBoardKey)) {
        _thAacBoardKey = boards[0].key;
    }
    _thAacSentence = [];
    document.getElementById('therapy-aac-modal').style.display = 'flex';
    _renderTherapyAacPicker();
}

function _renderTherapyAacPicker() {
    detectAacAssets();
    const boards = AACData.boards;
    const board = boards.find(b => b.key === _thAacBoardKey) || boards[0];
    const tabs = document.getElementById('thAacTabs');
    tabs.innerHTML = boards.map(b => `
        <button type="button" class="aac-nav-btn${b.key === board.key ? ' active' : ''}"
            data-board-key="${escapeHtml(b.key)}">
            ${escapeHtml(b.visual.value)} ${escapeHtml(b.label)}
        </button>
    `).join('');
    tabs.querySelectorAll('.aac-nav-btn').forEach(btn => {
        btn.addEventListener('click', () => setTherapyAacBoard(btn.dataset.boardKey));
    });
    const grid = document.getElementById('thAacGrid');
    grid.innerHTML = board.cards.map(c => `
        <button type="button" class="aac-card"
            data-spoken="${escapeHtml(c.spoken || c.label)}" data-label="${escapeHtml(c.label)}">
            ${_aacCardVisual(c)}
            <span class="aac-card-text">${escapeHtml(c.label)}</span>
        </button>
    `).join('');
    grid.querySelectorAll('.aac-card').forEach(btn => {
        btn.addEventListener('click', () => tapTherapyAacCard(btn.dataset.spoken, btn.dataset.label));
    });
    _updateTherapyAacSentence();
}

function setTherapyAacBoard(boardKey) {
    _thAacBoardKey = boardKey;
    _renderTherapyAacPicker();
}

function tapTherapyAacCard(spoken, label) {
    _thAacSentence.push({ spoken, label });
    speakFallback(spoken, null, _aacTtsRate);
    _updateTherapyAacSentence();
}

function removeTherapyAacWord(index) {
    _thAacSentence.splice(index, 1);
    _updateTherapyAacSentence();
}

function clearTherapyAacSentence() {
    _thAacSentence = [];
    _updateTherapyAacSentence();
}

function _updateTherapyAacSentence() {
    const wrap = document.getElementById('thAacSentence');
    const btn = document.getElementById('thAacSpeakBtn');
    if (!wrap) return;
    if (!_thAacSentence.length) {
        wrap.innerHTML = `<span class="aac-sentence-placeholder">${t('aac_sentence_placeholder')}</span>`;
        if (btn) btn.disabled = true;
        return;
    }
    wrap.innerHTML = _thAacSentence.map((w, i) => `
        <span class="aac-word-chip" onclick="removeTherapyAacWord(${i})">${escapeHtml(w.label)} ✕</span>
    `).join('');
    if (btn) btn.disabled = false;
}

async function submitTherapyAacAnswer() {
    if (!_thAacSentence.length) return;
    const micBtn = document.getElementById('micBtn');
    // micBtn aktif = uygulama cevap bekliyor (isWaiting soru okununca true
    // kalir, "AI konusuyor" anlamina gelmez — kapi olarak kullanilamaz)
    if (micBtn && micBtn.disabled) {
        showToast(t('therapy_wait_turn'));
        return;
    }
    const text = _thAacSentence.map(w => w.spoken).join(' ');
    document.getElementById('therapy-aac-modal').style.display = 'none';
    _thAacSentence = [];
    if (micBtn) micBtn.disabled = true;
    isWaiting = true;
    document.getElementById('info').innerText = '🗂️ ' + text;
    await processTherapySpeech(text, 'card');
}

function getCurrentTherapyCategory() {
    return THERAPY_CATEGORIES[currentTherapyCategoryKey] || THERAPY_CATEGORIES.daily_life;
}

function getCurrentTherapyLevel() {
    return THERAPY_LEVELS[currentTherapyLevelKey] || THERAPY_LEVELS.sentence;
}

function getCurrentMapTopic() {
    return currentMapTopic || SPEECH_MAP_TOPICS[0];
}

function updateTherapyTopicBadge() {
    const badge = document.getElementById('therapyTopicBadge');
    if (!badge) return;
    const levelLabel = t(getCurrentTherapyLevel().labelKey);
    const topic = getCurrentMapTopic();
    badge.textContent = `${topic.emoji} ${topic.label} • ${levelLabel}`;
}

function getQuestionsForCurrentLevel(questions, sourceType, sourceKey) {
    if (!Array.isArray(questions) || !questions.length) return [];
    const sourceBuckets = THERAPY_LEVEL_BUCKETS[sourceType] && THERAPY_LEVEL_BUCKETS[sourceType][sourceKey];
    const indexes = sourceBuckets && Array.isArray(sourceBuckets[currentTherapyLevelKey]) ? sourceBuckets[currentTherapyLevelKey] : null;
    if (!indexes || !indexes.length) return questions;
    const selected = indexes.map(index => questions[index]).filter(Boolean);
    const seen = new Set(selected);
    for (const question of questions) {
        if (selected.length >= 6) break;
        if (seen.has(question)) continue;
        selected.push(question);
        seen.add(question);
    }
    return selected;
}

let _customQuestions = [];
let _customOverrides = {};

function customQuestionsForTopic(topicKey) {
    const useEn = _lang === 'en';
    return _customQuestions
        .filter(c => c && c.topic === topicKey && (useEn ? c.en : c.tr))
        .map(c => ({
            q: useEn ? c.en : c.tr,
            query: c.query || 'happy child talking',
            goal: (useEn ? c.goalEn : c.goalTr) || ''
        }));
}

function applyQuestionOverrides(topicKey, questions) {
    if (!_customOverrides || !Object.keys(_customOverrides).length) return questions;
    const useEn = _lang === 'en';
    const out = [];
    questions.forEach((orig, i) => {
        const o = _customOverrides[topicKey + ':' + i];
        if (!o) { out.push(orig); return; }
        if (o.hidden) return;
        out.push({
            q: (useEn ? o.en : o.tr) || orig.q,
            query: o.query || orig.query,
            goal: orig.goal
        });
    });
    return out;
}

async function loadCustomQuestions() {
    try {
        const cached = JSON.parse(localStorage.getItem('lms_custom_questions'));
        if (Array.isArray(cached)) {
            _customQuestions = cached;
        } else if (cached && typeof cached === 'object') {
            _customQuestions = Array.isArray(cached.q) ? cached.q : [];
            _customOverrides = cached.o && typeof cached.o === 'object' ? cached.o : {};
        }
    } catch (_) { _customQuestions = []; _customOverrides = {}; }
    try {
        const r = await fetch(API_BASE + '/api/content', { signal: AbortSignal.timeout(8000) });
        if (!r.ok) return;
        const d = await r.json();
        if (Array.isArray(d.questions)) {
            _customQuestions = d.questions;
            _customOverrides = d.overrides && typeof d.overrides === 'object' ? d.overrides : {};
            try { localStorage.setItem('lms_custom_questions', JSON.stringify({ q: _customQuestions, o: _customOverrides })); } catch (_) {}
        }
    } catch (_) {}
}

function getActiveTherapyQuestions() {
    const topic = getCurrentMapTopic();
    const base = applyQuestionOverrides(topic.key, getQuestionsForCurrentLevel(topic.questions, 'map', topic.key));
    return [...base, ...customQuestionsForTopic(topic.key)];
}

function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function resetTherapyQuestionPool() {
    const all = [...getActiveTherapyQuestions()];
    unaskedQuestions = shuffleArray(all).slice(0, 6);
    sessionTotalQuestions = unaskedQuestions.length;
    updateTherapyTopicBadge();
}

function computeMapSessionStars() {
    const base = _mapSessionBaseline || { mic: 0, card: 0, repeat: 0, simplify: 0 };
    const mic = Math.max(0, (sessionData.micUsedInTherapy || 0) - base.mic);
    const card = Math.max(0, (sessionData.cardUsedInTherapy || 0) - base.card);
    const repeat = Math.max(0, (sessionData.repeatUsed || 0) - base.repeat);
    const simplify = Math.max(0, (sessionData.simplifyUsed || 0) - base.simplify);
    const total = mic + card + repeat + simplify;
    if (total <= 0) return 2;
    const indPct = Math.round(((mic + card) / total) * 100);
    return indPct >= 75 ? 3 : (indPct >= 45 ? 2 : 1);
}

function showTherapySessionComplete() {
    clearTimeout(idleTimer);
    document.getElementById('micBtn').disabled = true;
    document.getElementById('nextBtn').classList.remove('pulse-anim');
    document.querySelectorAll('#therapyMainCard .therapy-session-ui').forEach(el => el.style.display = 'none');
    incrementDailyTask('therapy');
    speakFallback(t('therapy_complete_msg'), () => {});
    therapySessionCompleted = true;

    const topic = getCurrentMapTopic();
    const prevState = getSpeechMapState();
    const firstCompletion = !prevState.stars[topic.key];
    const earnedStars = computeMapSessionStars();
    const nextTopic = SPEECH_MAP_TOPICS[SPEECH_MAP_TOPICS.indexOf(topic) + 1];
    const finishedAll = firstCompletion && !nextTopic;
    recordSpeechMapCompletion(topic.key, earnedStars);
    confetti({ particleCount: finishedAll ? 220 : 120, spread: finishedAll ? 120 : 90 });

    const card = document.getElementById('therapyMainCard');
    const box = document.createElement('div');
    box.className = 'therapy-complete therapy-session-ui';
    box.id = 'therapyCompleteBox';
    const answered = sessionTotalQuestions || turnCount || 0;
    const achName = escapeHtml(activeStudentName || childName || '');
    const achDate = new Date().toLocaleDateString(_lang === 'en' ? 'en-US' : 'tr-TR', { day: 'numeric', month: 'long' });
    const unlockLine = firstCompletion && nextTopic
        ? `<p class="therapy-complete-unlock">${t('map_complete_next').replace('{label}', nextTopic.label)}</p>`
        : (finishedAll ? `<p class="therapy-complete-unlock">${t('map_finished_sub')}</p>` : '');
    box.innerHTML = `
        <div class="therapy-complete-glow" aria-hidden="true"></div>
        <div class="therapy-complete-badge">${finishedAll ? '🎖️' : '🏆'}</div>
        <div class="therapy-complete-copy">
            <h2>${finishedAll ? t('map_finished_title') : t('therapy_complete_title')}</h2>
            <div class="therapy-complete-stars">${'⭐'.repeat(earnedStars)}</div>
            <p class="therapy-complete-stat">${t('therapy_complete_stat').replace('{name}', achName).replace('{n}', answered)}</p>
            ${unlockLine}
            <p class="therapy-complete-date">${escapeHtml(achDate)}</p>
            <p class="therapy-complete-show">${t('therapy_complete_show')}</p>
        </div>
        <div class="therapy-complete-actions">
            <button type="button" class="btn-primary-gradient therapy-complete-btn" onclick="returnToMapFromComplete()">${t('map_back_to_map')}</button>
            <button type="button" class="menu-ghost-btn therapy-complete-btn" onclick="goToMenu();">${t('therapy_complete_menu')}</button>
        </div>
    `;
    card.appendChild(box);
}

function _speechMapKey() { return 'speechmap_' + (activeStudentId || 'default'); }

function getSpeechMapState() {
    const s = DB.getSync(_speechMapKey()) || {};
    s.stars = s.stars || {};
    if (!THERAPY_LEVELS[s.level]) s.level = null;
    return s;
}

function speechMapUnlockedCount(state) {
    let unlocked = 1;
    for (const topic of SPEECH_MAP_TOPICS) {
        if (!state.stars[topic.key]) break;
        unlocked++;
    }
    return Math.min(unlocked, SPEECH_MAP_TOPICS.length);
}

function recordSpeechMapCompletion(topicKey, stars) {
    const s = getSpeechMapState();
    s.stars[topicKey] = Math.max(s.stars[topicKey] || 0, stars);
    DB.set(_speechMapKey(), s);
}

let _mapAssetState = null;
function detectMapAssets() {
    if (_mapAssetState) return;
    _mapAssetState = 'checking';
    const probe = new Image();
    probe.onload = () => {
        _mapAssetState = 'ready';
        if (currentScreenId === 'speechmap-screen') renderSpeechMap();
    };
    probe.onerror = () => { _mapAssetState = 'missing'; };
    probe.src = 'map-assets/node-greetings.jpg';
}

function renderSpeechMap() {
    detectMapAssets();
    const state = getSpeechMapState();
    const unlocked = speechMapUnlockedCount(state);
    const doneCount = SPEECH_MAP_TOPICS.filter(topic => state.stars[topic.key]).length;

    const starEl = document.getElementById('mapStarCount');
    if (starEl) starEl.textContent = storeBalance(getStarState());

    const levelChip = document.getElementById('mapLevelChip');
    if (levelChip) {
        const levelLabel = state.level ? t(THERAPY_LEVELS[state.level].labelKey) : '—';
        levelChip.textContent = t('map_level_chip').replace('{level}', levelLabel);
    }

    const progressLabel = document.getElementById('mapProgressCount');
    if (progressLabel) progressLabel.textContent = `${doneCount}/${SPEECH_MAP_TOPICS.length}`;
    const progressFill = document.getElementById('mapProgressFill');
    if (progressFill) progressFill.style.width = Math.round((doneCount / SPEECH_MAP_TOPICS.length) * 100) + '%';

    const trail = document.getElementById('mapTrail');
    if (!trail) return;
    trail.querySelectorAll('.map-node').forEach(node => node.remove());

    SPEECH_MAP_TOPICS.forEach((topic, i) => {
        const isLast = i === SPEECH_MAP_TOPICS.length - 1;
        const row = Math.floor(i / 3);
        const col = isLast ? 1 : (row % 2 ? 2 - (i % 3) : i % 3);
        const stars = state.stars[topic.key] || 0;
        const status = stars ? 'done' : (i < unlocked ? 'current' : 'locked');

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'map-node map-node-' + status;
        btn.style.gridRow = String(row + 1);
        btn.style.gridColumn = String(col + 1);
        btn.dataset.topic = topic.key;
        if (status === 'locked') btn.setAttribute('aria-disabled', 'true');
        btn.setAttribute('aria-label', `${i + 1}. ${topic.label}`);
        btn.onclick = () => onMapNodeTap(topic.key);
        btn.innerHTML = `
            <span class="map-node-num">${i + 1}</span>
            <span class="map-node-circle">
                <img class="map-node-img" src="${_mapAssetState === 'ready' ? 'map-assets/node-' + topic.key + '.jpg' : 'avatar.png'}" alt="" onerror="this.onerror=null;this.src='avatar.png'">
                ${status === 'locked' ? '<span class="map-node-lock">🔒</span>' : ''}
                ${status === 'done' ? '<span class="map-node-check">✓</span>' : ''}
                ${status === 'current' ? '<span class="map-node-flag">🚩</span>' : ''}
            </span>
            <span class="map-node-plate">
                <span class="map-node-label">${topic.label}</span>
                ${status === 'done' ? `<span class="map-node-stars">${'⭐'.repeat(stars)}</span>` : ''}
            </span>`;
        trail.appendChild(btn);
    });

    requestAnimationFrame(drawMapPath);
}

function drawMapPath() {
    const trail = document.getElementById('mapTrail');
    const road = document.getElementById('mapRoad');
    const roadDash = document.getElementById('mapRoadDash');
    const svg = document.getElementById('mapPathSvg');
    if (!trail || !road || !roadDash || !svg) return;
    const circles = [...trail.querySelectorAll('.map-node-circle')];
    if (circles.length < 2) return;
    const box = trail.getBoundingClientRect();
    if (!box.width || !box.height) return;
    svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
    const pts = circles.map(el => {
        const r = el.getBoundingClientRect();
        return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 };
    });
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
        const prev = pts[i - 1];
        const cur = pts[i];
        const midX = (prev.x + cur.x) / 2;
        d += ` C ${midX} ${prev.y}, ${midX} ${cur.y}, ${cur.x} ${cur.y}`;
    }
    road.setAttribute('d', d);
    roadDash.setAttribute('d', d);
}

window.addEventListener('resize', () => {
    if (currentScreenId === 'speechmap-screen') drawMapPath();
});

function onMapNodeTap(topicKey) {
    const state = getSpeechMapState();
    const index = SPEECH_MAP_TOPICS.findIndex(topic => topic.key === topicKey);
    if (index < 0) return;
    if (index >= speechMapUnlockedCount(state)) {
        const prev = SPEECH_MAP_TOPICS[index - 1];
        showToast(t('map_locked_toast').replace('{label}', prev.label));
        const node = document.querySelector(`.map-node[data-topic="${topicKey}"]`);
        if (node) {
            node.classList.remove('shake');
            void node.offsetWidth;
            node.classList.add('shake');
        }
        return;
    }
    if (!state.level) {
        _pendingMapTopicKey = topicKey;
        openMapLevelModal();
        return;
    }
    currentTherapyLevelKey = state.level;
    startMapTopic(topicKey);
}

function openMapLevelModal() {
    renderMapLevelOptions();
    document.getElementById('mapLevelModal').style.display = 'flex';
}

function closeMapLevelModal() {
    document.getElementById('mapLevelModal').style.display = 'none';
    _pendingMapTopicKey = null;
}

function renderMapLevelOptions() {
    const active = getSpeechMapState().level || currentTherapyLevelKey;
    document.querySelectorAll('#mapLevelModal .topic-level-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.level === active);
    });
}

function chooseMapLevel(levelKey) {
    if (!THERAPY_LEVELS[levelKey]) return;
    currentTherapyLevelKey = levelKey;
    const s = getSpeechMapState();
    s.level = levelKey;
    DB.set(_speechMapKey(), s);
    document.getElementById('mapLevelModal').style.display = 'none';
    const pending = _pendingMapTopicKey;
    _pendingMapTopicKey = null;
    if (pending) startMapTopic(pending);
    else renderSpeechMap();
}

function startMapTopic(topicKey) {
    const topic = SPEECH_MAP_TOPICS.find(item => item.key === topicKey);
    if (!topic) return;
    if (navigator.onLine === false) {
        showToast(t('offline_action'));
        return;
    }
    if (!guestTryConsume('therapy')) return;
    currentMapTopic = topic;
    currentTherapyCategoryKey = topic.category;
    currentTopic = '';
    turnCount = 0;
    currentObj = null;
    chatHistory = [];
    therapySessionCompleted = false;
    _mapSessionBaseline = {
        mic: sessionData.micUsedInTherapy || 0,
        card: sessionData.cardUsedInTherapy || 0,
        repeat: sessionData.repeatUsed || 0,
        simplify: sessionData.simplifyUsed || 0
    };
    resetTherapyQuestionPool();
    const bubbles = document.getElementById('chat-bubbles');
    if (bubbles) bubbles.innerHTML = '';
    showOnly('game-container');
    document.getElementById('therapyMainCard').style.display = '';
    document.querySelectorAll('#therapyMainCard .therapy-session-ui').forEach(el => el.style.display = '');
    updateProgressBar();
    const vEl = document.getElementById('v');
    vEl.muted = true;
    vEl.play().catch(() => {});
    loadNext();
}

function resetIdleTimer() {
    clearTimeout(idleTimer);
    document.getElementById('nextBtn').classList.remove('pulse-anim');
    if (document.getElementById('micBtn').disabled && turnCount >= 7) return;
    idleTimer = setTimeout(() => {
        document.getElementById('nextBtn').classList.add('pulse-anim');
        document.getElementById('info').innerText = t('info_next_question');
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
    const completeBox = document.getElementById('therapyCompleteBox');
    if (completeBox) completeBox.remove();
    document.querySelectorAll('#therapyMainCard .therapy-session-ui').forEach(el => el.style.display = '');
    clearTimeout(idleTimer);
    document.getElementById('nextBtn').classList.remove('pulse-anim');
    document.getElementById('micBtn').disabled = true;
    const _qBar = document.getElementById('qBar');
    _qBar.textContent = '';
    _qBar.classList.add('skeleton');
    document.getElementById('info').innerText = t('video_loading');

    if (unaskedQuestions.length === 0) {
        return showTherapySessionComplete();
    }
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
        const _videoParam = (Array.isArray(currentObj.videoIds) && currentObj.videoIds.length)
            ? 'id=' + currentObj.videoIds[Math.floor(Math.random() * currentObj.videoIds.length)]
            : 'query=' + currentObj.query;
        const r = await fetch(API_BASE + '/api/video?' + _videoParam, { signal: _videoCtrl.signal, headers: apiAuthHeaders() });
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
    if (!currentObj || typeof currentObj.q !== 'string' || !currentObj.q.trim()) {
        console.warn('startQuestion: missing currentObj, skipping question render', {
            hasCurrentObj: Boolean(currentObj),
            turnCount
        });
        document.getElementById('info').innerText = t('info_next_question');
        isWaiting = false;
        return;
    }
    var vEl = document.getElementById('v');
    vEl.pause();
    isWaiting = true;
    chatHistory.push({ role: "model", parts: [{ text: currentObj.q }] });
    const _qBarEl = document.getElementById('qBar');
    _qBarEl.classList.remove('skeleton');
    _qBarEl.innerText = currentObj.q;
    addMessage(currentObj.q, "ai");
    speak(currentObj.q, function() {
        document.getElementById('micBtn').disabled = false;
        resetIdleTimer();
        document.getElementById('info').innerText = t('mic_prompt');
    });
}

async function processTherapySpeech(speech, source) {
    if (!speech) return;
    isProcessingTherapySpeech = true;
    const questionText = currentObj && typeof currentObj.q === 'string' ? currentObj.q : '';
    if (!questionText) {
        console.warn('processTherapySpeech: missing currentObj, aborting speech processing safely', {
            source: source || 'mic',
            speechLength: speech.length,
            turnCount
        });
        document.getElementById('micBtn').disabled = false;
        document.getElementById('info').innerText = t('info_next_question');
        isWaiting = false;
        isProcessingTherapySpeech = false;
        return;
    }
    const category = getCurrentTherapyCategory();
    const categoryLabel = category && category.label ? category.label : t('report_other');
    if (source === 'card') sessionData.cardUsedInTherapy++;
    else sessionData.micUsedInTherapy++;
    addMessage(speech, "user");
    if (turnCount >= 7) {
        var final = t('therapy_session_end');
        addMessage(final, "ai");
        speak(final, function() {
            document.getElementById('nextBtn').classList.add('pulse-anim');
            document.getElementById('info').innerText = t('info_press_next');
            isProcessingTherapySpeech = false;
        });
        isWaiting = false;
        return;
    }
    document.getElementById('info').innerHTML = `
        <div class="thinking-loader">
            <span class="thinking-dot"></span>
            <span class="thinking-dot"></span>
            <span class="thinking-dot"></span>
            <span class="thinking-label">${t('thinking')}</span>
        </div>
    `;
    var aiRes = await getGemmaResponse(speech);
    addMessage(aiRes, "ai");
    sessionData.therapyTurns.push({
        location: getCurrentMapTopic().label,
        category: categoryLabel,
        question: questionText,
        answer: speech,
        via: source === 'card' ? 'card' : 'mic'
    });
    celebrateCorrectAnswer();
    var vEl = document.getElementById('v');
    var pp = vEl.play();
    if (pp !== undefined) pp.catch(function() {});
    speak(aiRes, function() {
        document.getElementById('micBtn').disabled = false;
        isWaiting = false;
        resetIdleTimer();
        document.getElementById('info').innerText = t('mic_prompt');
        isProcessingTherapySpeech = false;
    });
}

// =============================================
// İLK AÇILIŞ REHBERİ
// =============================================
let _onboardingStep = 0;
const ONBOARDING_STEPS = 3;

function maybeShowOnboarding() {
    if (localStorage.getItem('lms_onboarding_done')) return;
    const modal = document.getElementById('onboardingModal');
    if (!modal) return;
    _onboardingStep = 0;
    _renderOnboardingStep();
    modal.style.display = 'flex';
}

function _renderOnboardingStep() {
    document.querySelectorAll('#onboardingModal .onboarding-step').forEach(el => {
        el.style.display = Number(el.dataset.step) === _onboardingStep ? '' : 'none';
    });
    const dots = document.getElementById('onboardingDots');
    if (dots) {
        dots.innerHTML = Array.from({ length: ONBOARDING_STEPS }, (_, i) =>
            `<span class="ob-dot${i === _onboardingStep ? ' active' : ''}"></span>`).join('');
    }
    const nextBtn = document.getElementById('onboardingNextBtn');
    if (nextBtn) nextBtn.textContent = _onboardingStep === ONBOARDING_STEPS - 1 ? t('ob_start') : t('ob_next');
}

function nextOnboardingStep() {
    if (_onboardingStep >= ONBOARDING_STEPS - 1) return finishOnboarding();
    _onboardingStep++;
    _renderOnboardingStep();
}

function finishOnboarding() {
    localStorage.setItem('lms_onboarding_done', '1');
    const modal = document.getElementById('onboardingModal');
    if (modal) modal.style.display = 'none';
}

function _getNativeSpeech() {
    try {
        if (typeof Capacitor !== 'undefined' && Capacitor.isNativePlatform()
            && Capacitor.Plugins && Capacitor.Plugins.SpeechRecognition) {
            return Capacitor.Plugins.SpeechRecognition;
        }
    } catch(_) {}
    return null;
}

async function rec() {
    clearTimeout(idleTimer);
    if (isProcessingTherapySpeech) return;
    const micBtn = document.getElementById('micBtn');
    const infoEl = document.getElementById('info');
    if (micBtn.disabled) return;
    if (!_getNativeSpeech() && !(window.SpeechRecognition || window.webkitSpeechRecognition)) {
        infoEl.innerText = t('info_no_speech_support');
        micBtn.disabled = true;
        return;
    }
    micBtn.disabled = true;
    micBtn.classList.add('listening');
    infoEl.innerText = t('info_listening');
    let speech = '';
    try {
        speech = await recognizeSpeechOnce();
    } finally {
        micBtn.classList.remove('listening');
    }
    if (!speech) {
        const cat = getCurrentTherapyCategory().label;
        sessionData.noResponseByCategory[cat] = (sessionData.noResponseByCategory[cat] || 0) + 1;
        infoEl.innerText = t('info_no_sound');
        micBtn.disabled = false;
        return;
    }
    infoEl.innerText = '🎙️ ' + speech;
    await processTherapySpeech(speech);
}

async function getGemmaResponse(text) {
    var url = API_BASE + "/api/chat";
    chatHistory.push({ role: "user", parts: [{ text: text }] });
    const currentCategory = getCurrentTherapyCategory();
    const currentLevel = getCurrentTherapyLevel();
    const currentGoal = currentObj && currentObj.goal ? currentObj.goal : (_lang === 'en' ? 'clear and concise communication' : 'kısa ve anlaşılır konuşma');
    var instructions = _lang === 'en'
        ? `You are a friendly AAC (Augmentative and Alternative Communication) companion bot working with special-education students on social skills, daily routines, and community life. Your name is Yıldız Can. Current topic: ${getCurrentMapTopic().label}. Goal for this question: ${currentGoal}. Always remember the student's limited attention and verbal comprehension.

STRICT INTERACTION RULES:
1. ${currentLevel.replyRuleEn} No long paragraphs, lectures, or conditional advice.
2. EMOJI SUPPORT: Add one appropriate emoji at the end of your sentence to support comprehension (e.g. ⚽ 🟥 🤫 👋).
3. INAPPROPRIATE LANGUAGE: If the student uses swearing or rude words, NEVER repeat, criticize, or comment on them. Ignore the behavior entirely and redirect.
4. NO ANSWERING FOR THE CHILD: Never generate confirmations or statements on the child's behalf. Always keep control with the student.
5. PEER-LANGUAGE REDIRECTION: If the student persists with negative behavior, briefly acknowledge the feeling, offer a short peer-appropriate alternative, and change the scene. (e.g. "Getting mad at a game is normal! ⚽ You can say 'I disagree with that call'.") Reply in English only.
6. SPEECH RECOGNITION (STT) TOLERANCE: Since the student has special needs, tolerate articulation errors, letter omissions, phonetically distorted words, and speech-to-text typos. If the answer is phonetically similar to a correct or logical response, accept it and provide positive reinforcement. Never correct the child's pronunciation or spelling.`
        : `Sen özel eğitim öğrencileriyle sosyal uyum, kurallar ve günlük yaşam rutinleri çalışan, çok kısa ve somut konuşan bir AAC (Alternatif İletişim) oyun arkadaşı botsun. Adın Yıldız Can. Çalışılan konu: ${getCurrentMapTopic().label}. Bu sorunun hedefi: ${currentGoal}. Öğrencinin dikkat ve sözel anlama sınırililiklerini asla unutma.

KATI ETKİLEŞİM VE DİL KURALLARI:
1. TEK CÜMLE KURALI: Her cevabın MAKSİMUM 1 kısa cümleden oluşmalıdır (En fazla 6-7 kelime). Asla uzun paragraflar, didaktik açıklamalar veya şartlı nasihatler yapma.
2. SOYUT DÜŞÜNME VE EMOJİ DESTEĞİ: Soyut kavramları somutlaştırmak için cümlenin sonuna tek bir uygun emoji koy (Örn: ⚽ 🟥 🤫 👋).
3. ARGO VE REAKSİYONEL DİRENÇ SÖNÜMLENDİRME: Öğrenci küfür veya argo kullanırsa bu kelimeleri ASLA tekrarlama, eleştirme veya "küfür etme" deme. Hatalı davranışı tamamen görmezden gel.
4. ÇOCUĞUN ADINA CEVAP VERME YASAĞI: Öğrenci yerine onun söylemediği onaylama cümleleri üretme. Kontrolü her zaman öğrenciye bırak.
5. AKRAN DİLİYLE ALTERNATİF SUNMA: Öğrenci olumsuz davranışta ısrar ederse duyguyu çok kısa onayla, kabul edilebilir akran modelini sun ve sahneyi değiştir. (Örn: "Maçta öfkelenmek normal! ⚽ Ama hakeme sadece 'Hocam bence fauldü' diyebiliriz.")
6. SES TANIMA VE FONETİK TOLERANS: Öğrencinin özel gereksinimleri olduğu için artikülasyon (harf/hece yutma), yarım konuşma, kekemelik kaynaklı hataları ve ses tanıma yazılımının (STT) kelime çevrim hatalarını tolere et. Eğer cevap fonetik/sesletim olarak doğru veya mantıklı bir cevaba benziyorsa, bunu doğru kabul et ve olumlu pekiştireç ver. Çocuğun telaffuzunu veya kelime hatalarını düzeltmeye çalışma.`;

    if (_lang !== 'en') {
        instructions = `Sen özel eğitim öğrencileriyle sosyal uyum, kurallar ve günlük yaşam rutinleri çalışan, çok kısa ve somut konuşan bir AAC (Alternatif İletişim) oyun arkadaşı botsun. Adın Yıldız Can. Çalışılan konu: ${getCurrentMapTopic().label}. Bu sorunun hedefi: ${currentGoal}. Öğrencinin dikkat ve sözel anlama sınırlılıklarını asla unutma.

KATI ETKİLEŞİM VE DİL KURALLARI:
1. ${currentLevel.replyRuleTr} Asla uzun paragraflar, didaktik açıklamalar veya şartlı nasihatler yapma.
2. SOYUT DÜŞÜNME VE EMOJİ DESTEĞİ: Soyut kavramları somutlaştırmak için cümlenin sonuna tek bir uygun emoji koy (Örn: ⚽ 🟥 🤫 👋).
3. ARGO VE REAKSİYONEL DİRENÇ SÖNÜMLENDİRME: Öğrenci küfür veya argo kullanırsa bu kelimeleri ASLA tekrarlama, eleştirme veya "küfür etme" deme. Hatalı davranışı tamamen görmezden gel.
4. ÇOCUĞUN ADINA CEVAP VERME YASAĞI: Öğrenci yerine onun söylemediği onaylama cümleleri üretme. Kontrolü her zaman öğrenciye bırak.
5. AKRAN DİLİYLE ALTERNATİF SUNMA: Öğrenci olumsuz davranışta ısrar ederse duyguyu çok kısa onayla, kabul edilebilir akran modelini sun ve sahneyi değiştir. (Örn: "Maçta öfkelenmek normal! ⚽ Ama hakeme sadece 'Hocam bence fauldü' diyebiliriz.")
6. SES TANIMA VE FONETİK TOLERANS: Öğrencinin özel gereksinimleri olduğu için artikülasyon (harf/hece yutma), yarım konuşma, kekemelik kaynaklı hataları ve ses tanıma yazılımının (STT) kelime çevrim hatalarını tolere et. Eğer cevap fonetik/sesletim olarak doğru veya mantıklı bir cevaba benziyorsa, bunu doğru kabul et ve olumlu pekiştireç ver. Çocuğun telaffuzunu veya kelime hatalarını düzeltmeye çalışma.`;
    }

    if (currentTherapyLevelKey === 'word') {
        instructions += _lang === 'en'
            ? `\n7. WORD-MODE FEEDBACK: If the answer is unclear or off-topic, do not talk about numbers, prices, or mistakes. Give one simple model word or very short phrase related to the question and move on.`
            : `\n7. TEK KELİME GERİ BİLDİRİMİ: Cevap belirsiz veya konu dışıysa sayı, fiyat ya da hata tartışması yapma. Soruya uygun tek kelimelik ya da çok kısa bir model verip devam et.`;
    }

    var payload = {
        contents: [
            { role: "user", parts: [{ text: "GÖREV: " + instructions }] },
            { role: "model", parts: [{ text: _lang === 'en' ? "Got it! Starting the conversation." : "Tamam! Sohbeti başlatıyorum." }] }
        ].concat(chatHistory)
    };
    try {
        var res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...apiAuthHeaders() }, body: JSON.stringify(payload) });
        var data = await res.json();
        var reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!reply) {
            console.error('Gemini yanıt boş:', JSON.stringify(data));
            if (isGuestUser()) return guestPraise();
            return _lang === 'en' ? 'AI is not responding right now, please wait.' : 'Yapay zeka şu an yanıt veremiyor, biraz bekle.';
        }
        chatHistory.push({ role: "model", parts: [{ text: reply }] });
        return reply;
    } catch (e) {
        console.error('Gemini hata:', e);
        if (isGuestUser()) return guestPraise();
        return _lang === 'en' ? 'AI is not responding right now, please wait.' : 'Yapay zeka şu an yanıt veremiyor, biraz bekle.';
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

function sanitizeForSpeech(text) {
    return text
        .replace(/[\u{1F1E6}-\u{1F1FF}\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu, '')
        .replace(/[‘’ʼʻ`]/g, "'")
        .replace(/\s+/g, ' ')
        .trim();
}

function speakFallback(t, callback, rate) {
    try {
        t = sanitizeForSpeech(t);
        window.speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(t);
        u.lang = _lang === 'en' ? 'en-US' : 'tr-TR'; u.pitch = 1.2; u.rate = rate || 0.7;
        var ended = false;
        var safeEnd = function() { if (ended) return; ended = true; if (callback) callback(); };
        u.onend = safeEnd;
        var wordCount = t.split(' ').length;
        setTimeout(safeEnd, (wordCount * 500) + 2500);
        window.speechSynthesis.speak(u);
    } catch(_) { if (callback) callback(); }
}

async function speak(t, callback) {
    return speakWithLipsync(t, callback, CharacterEmotion.NEUTRAL);
}

async function speakWithLipsync(text, onEnd, emotion = CharacterEmotion.NEUTRAL) {
    text = sanitizeForSpeech(text);
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
            headers: { 'Content-Type': 'application/json', ...apiAuthHeaders() },
            body: JSON.stringify({ text, lang: _lang }),
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
// =============================================
// GÜNLÜK GÖREVLER (daily quest sistemi)
// =============================================
function _dailyDateKey() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const r = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${r}`;
}
function _dailyProgressKey() {
    return `daily_${activeStudentId || 'default'}_${_dailyDateKey()}`;
}

function _seededRandom(seedStr) {
    let h = 0;
    for (let i = 0; i < seedStr.length; i++) { h = (h * 31 + seedStr.charCodeAt(i)) >>> 0; }
    return function () { h = (h * 1103515245 + 12345) >>> 0; return (h % 10000) / 10000; };
}

const DAILY_TASK_DEFS = {
    therapy: { icon: '🎤', choices: [1, 1, 2],     get key() { return 'task_therapy'; }, action: 'goToTherapy' },
    object:  { icon: '🔍', choices: [3, 4, 5, 6],  get key() { return 'task_object'; },  action: 'goToObjectRecognition' },
};

function getDailyTasks() {
    const seed = _seededRandom(_dailyDateKey() + ':' + (activeStudentId || 'default'));
    return Object.entries(DAILY_TASK_DEFS).map(([type, def]) => {
        const target = def.choices[Math.floor(seed() * def.choices.length)];
        return { type, target, icon: def.icon, action: def.action, get label() { return t(def.key).replace('{n}', target); } };
    });
}

function loadDailyProgress() {
    const raw = localStorage.getItem(_dailyProgressKey());
    const p = raw ? (() => { try { return JSON.parse(raw); } catch (e) { return {}; } })() : {};
    p.counts = p.counts || { therapy: 0, object: 0 };
    p.claimed = p.claimed || { therapy: false, object: false, all: false };
    return p;
}
function saveDailyProgress(p) {
    localStorage.setItem(_dailyProgressKey(), JSON.stringify(p));
}

function incrementDailyTask(type) {
    const p = loadDailyProgress();
    p.counts[type] = (p.counts[type] || 0) + 1;
    const tasks = getDailyTasks();
    const task = tasks.find(x => x.type === type);
    if (task && !p.claimed[type] && p.counts[type] >= task.target) {
        p.claimed[type] = true;
        addStars(5);
        showToast(t('task_completed').replace('{label}', task.label));
        if (tasks.every(x => p.claimed[x.type]) && !p.claimed.all) {
            p.claimed.all = true;
            setTimeout(() => {
                addStars(10);
                showToast(t('task_all_done_toast'));
                if (typeof confetti === 'function') confetti({ particleCount: 150, spread: 100 });
            }, 900);
        }
    }
    saveDailyProgress(p);
    if (currentScreenId === 'schedule-screen') renderDailyTasks();
}

function goToSchedule() {
    showOnly('schedule-screen');
    const today = new Date();
    document.getElementById('scheduleDate').textContent =
        today.toLocaleDateString(_lang === 'en' ? 'en-US' : 'tr-TR', { weekday: 'long', day: 'numeric', month: 'long' });
    renderDailyTasks();
}

function renderDailyTasks() {
    const tasks = getDailyTasks();
    const progress = loadDailyProgress();
    const list = document.getElementById('scheduleList');
    if (!list) return;

    const allDone = tasks.every(t2 => progress.claimed[t2.type]);

    list.innerHTML = tasks.map(task => {
        const count = Math.min(progress.counts[task.type] || 0, task.target);
        const done = progress.claimed[task.type];
        const pct = Math.round((count / task.target) * 100);
        return `
            <button type="button" class="task-card${done ? ' done' : ''}" onclick="${task.action}()">
                <span class="task-icon">${done ? '✅' : task.icon}</span>
                <span class="task-body">
                    <span class="task-label">${escapeHtml(task.label)}</span>
                    <span class="task-progress-track"><span class="task-progress-fill" style="width:${pct}%"></span></span>
                    <span class="task-progress-text">${count} / ${task.target}</span>
                </span>
            </button>`;
    }).join('') + (allDone ? `
        <div class="task-all-done">
            <span>🎉</span>
            <strong>${t('task_all_done_title')}</strong>
            <p>${t('task_all_done_sub')}</p>
        </div>` : '');
}

// =============================================
// AAC PANOSU — sabit şablon, düzenleme yok
// =============================================
let _aacSentence = [];
let _aacAudioObj = null;
let _aacCurrentBoardKey = null;
let _aacTtsRate = 1.0;
let _aacAssetState = null;
const _aacMissingAssets = new Set();

function detectAacAssets() {
    if (_aacAssetState) return;
    _aacAssetState = 'checking';
    const probe = new Image();
    probe.onload = () => {
        _aacAssetState = 'ready';
        if (currentScreenId === 'aac-screen') renderAacBoard();
    };
    probe.onerror = () => { _aacAssetState = 'missing'; };
    probe.src = 'aac-assets/cat_core.jpg';
}

function _aacCardVisual(card) {
    const emoji = escapeHtml((card.visual && card.visual.value) || '❓');
    const key = card.key || '';
    if (_aacAssetState !== 'ready' || !key || _aacMissingAssets.has(key)) {
        return `<span class="aac-card-emoji">${emoji}</span>`;
    }
    return `<img class="aac-card-img" src="aac-assets/${key}.jpg" alt="" loading="lazy"
        onerror="_aacImgFail(this, '${key}')"><span class="aac-card-emoji" style="display:none">${emoji}</span>`;
}

function _aacImgFail(img, key) {
    _aacMissingAssets.add(key);
    img.style.display = 'none';
    if (img.nextElementSibling) img.nextElementSibling.style.display = '';
}

function goToAac() {
    showOnly('aac-screen');
    _aacSentence = [];
    const boards = AACData.boards;
    if (!_aacCurrentBoardKey || !boards.find(b => b.key === _aacCurrentBoardKey)) {
        _aacCurrentBoardKey = boards[0].key;
    }
    renderAacBoard();
}

function renderAacBoard() {
    detectAacAssets();
    const boards = AACData.boards;
    const board = boards.find(b => b.key === _aacCurrentBoardKey) || boards[0];

    const cats = document.getElementById('aacCats');
    if (cats) {
        cats.innerHTML = boards.map(b => {
            const catKey = 'cat_' + b.key;
            const emoji = escapeHtml((b.visual && b.visual.value) || '❓');
            const visual = (_aacAssetState === 'ready' && !_aacMissingAssets.has(catKey))
                ? `<img class="aac-cat-img" src="aac-assets/${catKey}.jpg" alt="" loading="lazy"
                    onerror="_aacImgFail(this, '${catKey}')"><span class="aac-cat-emoji" style="display:none">${emoji}</span>`
                : `<span class="aac-cat-emoji">${emoji}</span>`;
            return `
                <button type="button" class="aac-cat-btn${b.key === board.key ? ' active' : ''}"
                    data-board-key="${escapeHtml(b.key)}" aria-pressed="${b.key === board.key}">
                    <span class="aac-cat-visual">${visual}</span>
                    <span class="aac-cat-label">${escapeHtml(b.label)}</span>
                </button>`;
        }).join('');
        cats.querySelectorAll('.aac-cat-btn').forEach(btn => {
            btn.addEventListener('click', () => setAacBoard(btn.dataset.boardKey));
        });
        const activeBtn = cats.querySelector('.aac-cat-btn.active');
        if (activeBtn) activeBtn.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }

    const grid = document.getElementById('aacGrid');
    if (grid) {
        grid.innerHTML = board.cards.map(c => `
            <button type="button" class="aac-card"
                data-label="${escapeHtml(c.label)}" data-spoken="${escapeHtml(c.spoken || c.label)}">
                ${_aacCardVisual(c)}
                <span class="aac-card-text">${escapeHtml(c.label)}</span>
            </button>
        `).join('');
        grid.querySelectorAll('.aac-card').forEach(btn => {
            btn.addEventListener('click', () => tapAacCard(btn));
        });
    }
    const gridWrap = document.querySelector('.aac-grid-wrap');
    if (gridWrap) gridWrap.scrollTop = 0;

    _aacUpdateSentenceBar();
}

function setAacBoard(boardKey) {
    _aacCurrentBoardKey = boardKey;
    renderAacBoard();
}

function tapAacCard(btn) {
    _aacSentence.push({ label: btn.dataset.label, spoken: btn.dataset.spoken });
    _aacUpdateSentenceBar();
    btn.classList.remove('tapped');
    void btn.offsetWidth;
    btn.classList.add('tapped');
    speakFallback(btn.dataset.spoken, null, _aacTtsRate);
}

function _aacUpdateSentenceBar() {
    const wrap = document.getElementById('aacSentenceWords');
    const speakBtn = document.getElementById('aacSpeakBtn');
    if (!wrap) return;
    if (!_aacSentence.length) {
        wrap.innerHTML = `<span class="aac-sentence-placeholder">${t('aac_sentence_placeholder')}</span>`;
        if (speakBtn) speakBtn.disabled = true;
        return;
    }
    wrap.innerHTML = _aacSentence.map((w, i) => `
        <span class="aac-word-chip" onclick="removeAacWord(${i})">${escapeHtml(w.label)} ✕</span>
    `).join('');
    wrap.scrollLeft = wrap.scrollWidth;
    if (speakBtn) speakBtn.disabled = false;
}

function removeAacWord(index) {
    _aacSentence.splice(index, 1);
    _aacUpdateSentenceBar();
}

async function speakAacSentence() {
    if (!_aacSentence.length) return;
    const text = sanitizeForSpeech(_aacSentence.map(w => w.spoken).join(' '));
    try {
        if (_aacAudioObj) {
            try { _aacAudioObj.pause(); } catch(e) {}
            _aacAudioObj = null;
        }
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 8000);
        const res = await fetch(API_BASE + '/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...apiAuthHeaders() },
            body: JSON.stringify({ text, lang: _lang }),
            signal: ctrl.signal
        });
        clearTimeout(timer);
        if (!res.ok) return speakFallback(text, null, _aacTtsRate);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        _aacAudioObj = audio;
        audio.onended = () => {
            URL.revokeObjectURL(url);
            if (_aacAudioObj === audio) _aacAudioObj = null;
        };
        await audio.play();
    } catch {
        speakFallback(text, null, _aacTtsRate);
    }
}

function clearAacSentence() {
    _aacSentence = [];
    _aacUpdateSentenceBar();
}

// =============================================
// YILDIZ KOLEKSİYONU VE GİYİM MAĞAZASI (token ekonomisi)
// =============================================
const CLOTHING_ITEMS = [
    { id: 'cap',        cat: 'hat',  emoji: '🧢',   cost: 10,  pos: 'top',    get label() { return t('acc_cap'); } },
    { id: 'bowtie',     cat: 'neck', emoji: '🎀',   cost: 15,  pos: 'bottom', get label() { return t('acc_bowtie'); } },
    { id: 'glasses',    cat: 'face', emoji: '👓',   cost: 20,  pos: 'mid',    get label() { return t('acc_glasses'); } },
    { id: 'sunhat',     cat: 'hat',  emoji: '👒',   cost: 25,  pos: 'top',    get label() { return t('acc_sunhat'); } },
    { id: 'scarf',      cat: 'neck', emoji: '🧣',   cost: 30,  pos: 'bottom', get label() { return t('acc_scarf'); } },
    { id: 'sunglasses', cat: 'face', emoji: '🕶️',  cost: 35,  pos: 'mid',    get label() { return t('acc_sunglasses'); } },
    { id: 'gradcap',    cat: 'hat',  emoji: '🎓',   cost: 45,  pos: 'top',    get label() { return t('acc_gradcap'); } },
    { id: 'necklace',   cat: 'neck', emoji: '📿',   cost: 55,  pos: 'bottom', get label() { return t('acc_necklace'); } },
    { id: 'tophat',     cat: 'hat',  emoji: '🎩',   cost: 70,  pos: 'top',    get label() { return t('acc_tophat'); } },
    { id: 'medal',      cat: 'neck', emoji: '🏅',   cost: 90,  pos: 'bottom', get label() { return t('acc_medal'); } },
    { id: 'mask',       cat: 'face', emoji: '🎭',   cost: 110, pos: 'mid',    get label() { return t('acc_mask'); } },
    { id: 'helmet',     cat: 'hat',  emoji: '⛑️',  cost: 130, pos: 'top',    get label() { return t('acc_helmet'); } },
    { id: 'crown',      cat: 'hat',  emoji: '👑',   cost: 200, pos: 'top',    get label() { return t('acc_crown'); } },
];
const STORE_CATS = ['hat', 'face', 'neck'];

function _starsKey() { return 'stars_' + (activeStudentId || 'default'); }
function getStarState() {
    const s = DB.getSync(_starsKey()) || {};
    s.total = Number(s.total) || 0;
    s.spent = Number(s.spent) || 0;
    s.owned = Array.isArray(s.owned) ? s.owned : [];
    s.equipped = s.equipped || null;
    if (s.equipped && !s.owned.includes(s.equipped)) s.owned.push(s.equipped);
    return s;
}
function storeBalance(s) { return Math.max(0, s.total - s.spent); }

function addStars(n) {
    if (!n) return;
    const s = getStarState();
    s.total += n;
    DB.update(_starsKey(), () => s);
    showToast(t('stars_earned').replace('{n}', n));
    updateStarBadge();
}

function updateStarBadge() {
    const s = getStarState();
    const badge = document.getElementById('welcomeStarBadge');
    if (badge) { badge.style.display = ''; badge.textContent = '⭐ ' + storeBalance(s); }
    const acc = document.getElementById('welcomeAccessory');
    if (acc) {
        const a = CLOTHING_ITEMS.find(x => x.id === s.equipped);
        acc.textContent = a ? a.emoji : '';
        acc.className = 'welcome-accessory' + (a ? ' acc-' + a.pos : '');
    }
}

function openStarInfo() {
    const s = getStarState();
    const balEl = document.getElementById('starInfoBalance');
    if (balEl) balEl.textContent = '⭐ ' + storeBalance(s);
    document.getElementById('star-info-modal').style.display = 'flex';
}

let _storeCat = STORE_CATS[0];

function goToStore() {
    showOnly('store-screen');
    _storeCat = STORE_CATS[0];
    _renderStoreTabs();
    _renderStoreMannequin();
    _renderStoreGrid();
}

function _renderStoreTabs() {
    const el = document.getElementById('storeCatTabs');
    if (!el) return;
    el.innerHTML = STORE_CATS.map(c =>
        `<button type="button" class="store-cat-tab${c === _storeCat ? ' active' : ''}" onclick="_setStoreCat('${c}')">${t('store_cat_' + c)}</button>`
    ).join('');
}

function _setStoreCat(cat) {
    _storeCat = cat;
    _renderStoreTabs();
    _renderStoreGrid();
}

function _renderStoreMannequin() {
    const s = getStarState();
    const balEl = document.getElementById('storeBalance');
    if (balEl) balEl.textContent = '⭐ ' + storeBalance(s);
    const itemEl = document.getElementById('storeMannequinItem');
    if (itemEl) {
        const a = CLOTHING_ITEMS.find(x => x.id === s.equipped);
        itemEl.textContent = a ? a.emoji : '';
        itemEl.className = 'store-mannequin-item' + (a ? ' acc-' + a.pos : '');
    }
}

function _renderStoreGrid() {
    const grid = document.getElementById('storeGrid');
    if (!grid) return;
    const s = getStarState();
    const balance = storeBalance(s);
    const items = CLOTHING_ITEMS.filter(i => i.cat === _storeCat);
    grid.innerHTML = items.map(item => {
        const owned = s.owned.includes(item.id);
        const equipped = s.equipped === item.id;
        const affordable = balance >= item.cost;
        let statusHtml, actionHtml;
        if (equipped) {
            statusHtml = `<span class="store-item-status equipped">${t('store_equipped_label')}</span>`;
            actionHtml = `<button type="button" class="store-item-btn secondary" onclick="unequipStoreItem()">${t('store_unequip_btn')}</button>`;
        } else if (owned) {
            statusHtml = `<span class="store-item-status">${t('store_owned_label')}</span>`;
            actionHtml = `<button type="button" class="store-item-btn" onclick="equipStoreItem('${item.id}')">${t('store_equip_btn')}</button>`;
        } else {
            statusHtml = `<span class="store-item-status price">⭐ ${item.cost}</span>`;
            actionHtml = affordable
                ? `<button type="button" class="store-item-btn primary" onclick="buyStoreItem('${item.id}')">${t('store_buy_btn')}</button>`
                : `<span class="store-item-need">${t('store_need_more').replace('{n}', item.cost - balance)}</span>`;
        }
        return `<div class="store-item-card${equipped ? ' equipped' : ''}${!owned && !affordable ? ' locked' : ''}">
            <span class="store-item-emoji">${item.emoji}</span>
            <span class="store-item-label">${item.label}</span>
            ${statusHtml}
            ${actionHtml}
        </div>`;
    }).join('');
}

function buyStoreItem(id) {
    const item = CLOTHING_ITEMS.find(i => i.id === id);
    if (!item) return;
    const s = getStarState();
    if (s.owned.includes(id)) return;
    if (storeBalance(s) < item.cost) {
        showToast(t('store_not_enough_toast').replace('{n}', item.cost - storeBalance(s)));
        return;
    }
    s.spent += item.cost;
    s.owned.push(id);
    s.equipped = id;
    DB.update(_starsKey(), () => s);
    showToast(t('store_bought_toast').replace('{item}', item.emoji + ' ' + item.label));
    if (typeof confetti === 'function') confetti({ particleCount: 90, spread: 75 });
    _renderStoreMannequin();
    _renderStoreGrid();
    updateStarBadge();
}

function equipStoreItem(id) {
    const s = getStarState();
    if (!s.owned.includes(id)) return;
    s.equipped = id;
    DB.update(_starsKey(), () => s);
    _renderStoreMannequin();
    _renderStoreGrid();
    updateStarBadge();
}

function unequipStoreItem() {
    const s = getStarState();
    s.equipped = null;
    DB.update(_starsKey(), () => s);
    _renderStoreMannequin();
    _renderStoreGrid();
    updateStarBadge();
}

let _greetedStudentId = null;
function maybeGreetChild() {
    if (!activeStudentName || _greetedStudentId === activeStudentId) return;
    _greetedStudentId = activeStudentId;
    const wrap = document.getElementById('welcomeAvatarWrap');
    if (wrap) {
        wrap.classList.add('wave');
        setTimeout(() => wrap.classList.remove('wave'), 2000);
    }
    speakFallback(t('greet_child').replace('{name}', activeStudentName));
}

async function renderMenuNudge() {
    const el = document.getElementById('menuNudge');
    if (!el) return;
    el.style.display = 'none';
    if (!activeStudentId) return;
    try {
        const results = await DB.get('obj_results_' + activeStudentId) || [];
        const history = await loadReportHistory();
        const lastTherapy = history[0];
        const daysSince = lastTherapy
            ? Math.floor((Date.now() - new Date(lastTherapy.createdAt).getTime()) / 86400000)
            : null;

        let text = '', action = null;
        if (daysSince !== null && daysSince >= 3) {
            text = '🎤 ' + t('nudge_therapy_gap').replace('{d}', daysSince);
            action = () => goToTherapy();
        } else if (results[0]) {
            const last = results[0];
            const acc = last.items + (last.errors || 0) > 0
                ? Math.round((last.items / (last.items + (last.errors || 0))) * 100) : 100;
            text = `🔍 ` + t('nudge_sort_again').replace('{game}', t('object_title')).replace('{acc}', acc);
            action = () => goToObjectRecognition();
        } else if (!history.length) {
            text = '✨ ' + t('nudge_first');
            action = () => goToTherapy();
        }
        if (text && action) {
            el.textContent = text;
            el.onclick = action;
            el.style.display = '';
        }
    } catch (_) {}
}

function _showStarReward() {
    const mic = sessionData.micUsedInTherapy || 0;
    const card = sessionData.cardUsedInTherapy || 0;
    const repeat = sessionData.repeatUsed || 0;
    const simplify = sessionData.simplifyUsed || 0;
    const total = mic + card + repeat + simplify;
    // goToMenu() her cagrildiginda calisir; yeni bir aktivite olmadan tekrar
    // menuye donulmesi ayni odulu sonsuza kadar tekrar tekrar vermesin.
    if (total === 0 || total <= sessionData.lastRewardedTotal) return;

    const indPct = Math.round(((mic + card) / total) * 100);
    let stars, title, sub;
    if (indPct >= 75) {
        stars = 5;
        title = t('star_title_5');
        sub = t('star_sub_5');
    } else if (indPct >= 45) {
        stars = 3;
        title = t('star_title_3');
        sub = t('star_sub_3');
    } else {
        stars = 1;
        title = t('star_title_1');
        sub = t('star_sub_1');
    }

    const starsEl = document.getElementById('starModalStars');
    const titleEl = document.getElementById('starModalTitle');
    const subEl = document.getElementById('starModalSub');
    const modal = document.getElementById('starRewardModal');
    if (!modal) return;
    sessionData.lastRewardedTotal = total;

    starsEl.innerHTML = Array.from({ length: 5 }, (_, i) =>
        `<span class="star-icon ${i < stars ? 'star-on' : 'star-off'}" style="animation-delay:${i * 0.12}s">⭐</span>`
    ).join('');
    titleEl.textContent = title;
    subEl.textContent = sub;
    modal.style.display = 'flex';

    if (typeof confetti === 'function' && stars >= 3) {
        setTimeout(() => confetti({ particleCount: stars === 5 ? 140 : 70, spread: 80, origin: { y: 0.45 } }), 400);
    }
    addStars(stars);
    speakFallback(title + ' ' + sub);
}

function closeStarModal() {
    const modal = document.getElementById('starRewardModal');
    if (modal) modal.style.display = 'none';
}

// =============================================
// OYUNLAR — artik dogrudan Nesne Tanima'ya yonlendiriyor
// (Siniflandirma/Siralama/Sebep-Sonuc oyunlari kaldirildi)
// =============================================
function goToSequence() { return goToObjectRecognition(); }
function goToGames() { return goToObjectRecognition(); }

// =============================================
// NESNE TANIMA (3D)
// =============================================
// Yeni nesne eklemek için: Blender'da modeli hazırla, .glb olarak dışa aktar
// (dokular gömülü, orijin merkezli), models/objects/ klasörüne koy, aşağıya
// { id, type:'glb', model:'models/objects/dosya.glb', answers:{tr:[...],en:[...]} }
// şeklinde bir satır ekle. type:'primitive' olanlar Blender gerektirmez.
const OBJECT_RECOGNITION_ITEMS = [
    { id: 'ball', type: 'glb', model: 'models/objects/top.glb',
        answers: { tr: ['top', 'küre'], en: ['ball', 'sphere'] },
        get label() { return t('obj_ball'); } },
    { id: 'star', type: 'glb', model: 'models/objects/yildiz.glb',
        answers: { tr: ['yıldız', 'yildiz'], en: ['star'] },
        get label() { return t('obj_star'); } },
    { id: 'apple', type: 'glb', model: 'models/objects/elma.glb',
        answers: { tr: ['elma'], en: ['apple'] },
        get label() { return t('obj_apple'); } },
    { id: 'balloon', type: 'glb', model: 'models/objects/balon.glb',
        answers: { tr: ['balon'], en: ['balloon'] },
        get label() { return t('obj_balloon'); } },
    { id: 'tree', type: 'glb', model: 'models/objects/agac.glb',
        answers: { tr: ['ağaç', 'agac'], en: ['tree'] },
        get label() { return t('obj_tree'); } },
    { id: 'fish', type: 'glb', model: 'models/objects/balik.glb',
        answers: { tr: ['balık', 'balik'], en: ['fish'] },
        get label() { return t('obj_fish'); } },
    { id: 'cup', type: 'glb', model: 'models/objects/bardak.glb',
        answers: { tr: ['bardak'], en: ['cup', 'glass'] },
        get label() { return t('obj_cup'); } },
    { id: 'strawberry', type: 'glb', model: 'models/objects/cilek.glb',
        answers: { tr: ['çilek', 'cilek'], en: ['strawberry'] },
        get label() { return t('obj_strawberry'); } },
    { id: 'icecream', type: 'glb', model: 'models/objects/dondurma.glb',
        answers: { tr: ['dondurma'], en: ['ice cream', 'icecream'] },
        get label() { return t('obj_icecream'); } },
    { id: 'sun', type: 'glb', model: 'models/objects/gunes.glb',
        answers: { tr: ['güneş', 'gunes'], en: ['sun'] },
        get label() { return t('obj_sun'); } },
    { id: 'train', type: 'glb', model: 'models/objects/tren.glb',
        answers: { tr: ['tren'], en: ['train'] },
        get label() { return t('obj_train'); } },
    { id: 'plane', type: 'glb', model: 'models/objects/ucak.glb',
        answers: { tr: ['uçak', 'ucak'], en: ['plane', 'airplane'] },
        get label() { return t('obj_plane'); } },
];

let _objThree = null, _objGLTFLoader = null;
let _objScene = null, _objCamera = null, _objRenderer = null, _objControls = null, _objMesh = null;
let _objItems = [], _objIndex = 0, _objErrors = 0, _objAnimating = false, _objBusy = false;
let _objAnimState = null, _objAnimTimer = 0, _objLoadSeq = 0;
let _objStartRender = null, _objStopRender = null;

async function goToObjectRecognition() {
    if (!guestTryConsume('obj')) return;
    showOnly('object-screen');
    document.getElementById('objComplete').style.display = 'none';
    document.querySelector('.object-canvas-card').style.display = '';
    document.querySelector('.object-answer-row').style.display = '';
    document.querySelector('.object-prompt').style.display = '';
    document.getElementById('objSkipBtn').style.display = '';

    _objItems = [...OBJECT_RECOGNITION_ITEMS].sort(() => Math.random() - 0.5);
    _objIndex = 0;
    _objErrors = 0;

    const ok = await _objInitThree();
    if (ok) window.dispatchEvent(new Event('resize'));
    const canvas = document.getElementById('objectCanvas');
    const fallback = document.getElementById('objFallback');
    const hint = document.querySelector('.object-hint');
    if (!ok) {
        if (canvas) canvas.style.display = 'none';
        if (fallback) fallback.style.display = 'flex';
        if (hint) hint.style.display = 'none';
    } else {
        if (canvas) canvas.style.display = 'block';
        if (fallback) fallback.style.display = 'none';
        if (hint) hint.style.display = 'block';
    }
    _objShowCurrent();
}

async function _objInitThree() {
    if (_objRenderer) return true;
    const canvas = document.getElementById('objectCanvas');
    if (!canvas) return false;
    try {
        const [THREE, controlsMod, gltfMod] = await Promise.all([
            import('three'),
            import('three/addons/controls/OrbitControls.js'),
            import('three/addons/loaders/GLTFLoader.js'),
        ]);
        _objThree = THREE;
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
        scene.add(new THREE.AmbientLight(0xffffff, 1.3));
        const key = new THREE.DirectionalLight(0xffffff, 1.4);
        key.position.set(3, 4, 5);
        scene.add(key);
        const fill = new THREE.DirectionalLight(0xd0e8ff, 0.6);
        fill.position.set(-3, 1, 2);
        scene.add(fill);

        const controls = new controlsMod.OrbitControls(camera, renderer.domElement);
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 2.2;
        controls.addEventListener('start', () => { controls.autoRotate = false; });

        _objRenderer = renderer; _objScene = scene; _objCamera = camera; _objControls = controls;
        _objGLTFLoader = new gltfMod.GLTFLoader();

        function resize() {
            const w = canvas.clientWidth || 260, h = canvas.clientHeight || 260;
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        }
        window.addEventListener('resize', resize);
        resize();

        let renderActive = false;
        function animate() {
            if (!renderActive) return;
            requestAnimationFrame(animate);
            if (_objMesh) {
                if (_objAnimState === 'correct') {
                    _objAnimTimer += 0.15;
                    _objMesh.position.y = Math.sin(_objAnimTimer) * 0.45;
                    _objMesh.rotation.y += 0.15;
                    var scale = 1.0 + Math.abs(Math.sin(_objAnimTimer)) * 0.25;
                    _objMesh.scale.set(scale, scale, scale);
                } else {
                    _objMesh.position.y = 0;
                    _objMesh.scale.set(1, 1, 1);
                }
            }
            controls.update();
            renderer.render(scene, camera);
        }
        _objStartRender = () => {
            if (renderActive) return;
            renderActive = true;
            requestAnimationFrame(animate);
        };
        _objStopRender = () => { renderActive = false; };
        _objStartRender();
        return true;
    } catch (e) {
        console.error('Nesne Tanıma: WebGL başlatılamadı', e);
        reportClientError('object3d init failed: ' + (e && e.message ? e.message : String(e)), e && e.stack);
        return false;
    }
}

function _objBuildPrimitiveGeometry(THREE, shape) {
    if (shape === 'sphere') return new THREE.SphereGeometry(1, 32, 32);
    if (shape === 'box') return new THREE.BoxGeometry(1.5, 1.5, 1.5);
    if (shape === 'star') {
        const pts = [];
        const spikes = 5, outerR = 1.3, innerR = 0.55;
        for (let i = 0; i < spikes * 2; i++) {
            const r = i % 2 === 0 ? outerR : innerR;
            const a = (Math.PI / spikes) * i - Math.PI / 2;
            pts.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r));
        }
        const shape2d = new THREE.Shape(pts);
        return new THREE.ExtrudeGeometry(shape2d, { depth: 0.5, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 2 });
    }
    return new THREE.BoxGeometry(1, 1, 1);
}

function _objFrameToObject(object) {
    const THREE = _objThree;
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    object.position.sub(center);
    const maxSize = Math.max(size.x, size.y, size.z) || 1;
    const distance = (maxSize / (2 * Math.atan((Math.PI * _objCamera.fov) / 360))) * 1.6;
    _objCamera.position.set(0, 0, distance);
    _objCamera.near = distance / 100;
    _objCamera.far = distance * 100;
    _objCamera.updateProjectionMatrix();
    _objControls.target.set(0, 0, 0);
    _objControls.update();
}

async function _objShowCurrent() {
    const item = _objItems[_objIndex];
    document.getElementById('objProgress').textContent =
        t('object_progress').replace('{a}', _objIndex + 1).replace('{t}', _objItems.length);
    document.getElementById('objFeedback').textContent = '';
    document.getElementById('objFeedback').className = 'object-feedback';
    document.getElementById('objTextInput').value = '';

    if (!_objRenderer) {
        const fallback = document.getElementById('objFallback');
        if (fallback) {
            const shapeEmoji = { sphere: '⚽', box: '📦', star: '⭐' };
            const idEmoji = {
                ball: '⚽', star: '⭐', apple: '🍎', balloon: '🎈',
                tree: '🌳', fish: '🐟', cup: '🥛', strawberry: '🍓', icecream: '🍦',
                sun: '☀️', banana: '🍌', train: '🚂', plane: '✈️',
            };
            fallback.textContent = (item.type === 'primitive' ? shapeEmoji[item.shape] : idEmoji[item.id]) || '❓';
        }
        return;
    }

    if (_objMesh) {
        _objScene.remove(_objMesh);
        _objMesh.traverse((node) => {
            if (node.isMesh) {
                if (node.geometry) node.geometry.dispose();
                if (node.material) {
                    if (Array.isArray(node.material)) {
                        node.material.forEach(m => m.dispose());
                    } else {
                        node.material.dispose();
                    }
                }
            }
        });
        _objMesh = null;
    }
    const THREE = _objThree;

    if (item.type === 'glb' && item.model) {
        const seq = ++_objLoadSeq;
        let loaded = null;
        try {
            const gltf = await _objGLTFLoader.loadAsync(item.model);
            loaded = gltf.scene;
        } catch (e) {
            console.error('Nesne Tanıma: model yüklenemedi', item.model, e);
            reportClientError('object3d model load failed: ' + item.model, e && e.stack);
        }
        if (seq !== _objLoadSeq) return;
        _objMesh = loaded || new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial({ color: 0xcccccc })
        );
    } else {
        const geo = _objBuildPrimitiveGeometry(THREE, item.shape);
        const mat = new THREE.MeshStandardMaterial({ color: item.color, roughness: 0.4, metalness: 0.1 });
        _objMesh = new THREE.Mesh(geo, mat);
    }
    _objScene.add(_objMesh);
    _objFrameToObject(_objMesh);
    if (_objControls) _objControls.autoRotate = true;
}

function _objFeedbackShow(correct, text) {
    const el = document.getElementById('objFeedback');
    el.textContent = text;
    el.className = 'object-feedback ' + (correct ? 'correct' : 'wrong');
}

function _objNormalize(s) {
    return String(s || '').toLocaleLowerCase(_lang === 'en' ? 'en' : 'tr').trim();
}

function _objCheckAnswer(raw) {
    if (_objBusy) return;
    const heard = _objNormalize(raw);
    if (!heard) {
        _objFeedbackShow(false, t('object_no_input'));
        return;
    }
    const item = _objItems[_objIndex];
    const accepted = (item.answers[_lang] || item.answers.tr || []).map(_objNormalize);
    const correct = accepted.some(a => a && heard.includes(a));

    if (correct) {
        _objBusy = true;
        _objAnimState = 'correct';
        _objAnimTimer = 0;
        _objFeedbackShow(true, t('object_correct'));
        speakFallback(t('object_correct'));
        if (typeof confetti === 'function') confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
        incrementDailyTask('object');
        setTimeout(() => { _objAnimState = null; _objBusy = false; _objNext(); }, 1400);
    } else {
        _objErrors++;
        _objFeedbackShow(false, t('object_wrong'));
        speakFallback(t('object_try_again'));
    }
}

function objSkip() {
    if (_objBusy) return;
    _objBusy = true;
    _objErrors++;
    const item = _objItems[_objIndex];
    const answerText = t('object_skip_answer').replace('{label}', item.label);
    _objFeedbackShow(false, answerText);
    document.getElementById('objFeedback').classList.add('skip');
    speakFallback(answerText);
    setTimeout(() => { _objBusy = false; _objNext(); }, 1800);
}

function objSubmitText() {
    const input = document.getElementById('objTextInput');
    const val = input.value;
    input.value = '';
    _objCheckAnswer(val);
}

async function objRecMic() {
    if (_objBusy) return;
    const btn = document.getElementById('objMicBtn');
    btn.disabled = true;
    btn.classList.add('listening');
    try {
        const heard = await recognizeSpeechOnce();
        _objCheckAnswer(heard);
    } finally {
        btn.disabled = false;
        btn.classList.remove('listening');
    }
}

function _objNext() {
    _objIndex++;
    if (_objIndex >= _objItems.length) {
        _objComplete();
    } else {
        _objShowCurrent();
    }
}

function _objComplete() {
    document.querySelector('.object-canvas-card').style.display = 'none';
    document.querySelector('.object-answer-row').style.display = 'none';
    document.querySelector('.object-prompt').style.display = 'none';
    document.getElementById('objSkipBtn').style.display = 'none';
    document.getElementById('objFeedback').textContent = '';
    document.getElementById('objComplete').style.display = '';
    _saveObjResult().catch(() => {});
    addStars(_objErrors === 0 ? 3 : (_objErrors <= 2 ? 2 : 1));
    if (typeof confetti === 'function') confetti({ particleCount: 120, spread: 90 });
    speakFallback(t('object_complete_title'));
}

async function _saveObjResult() {
    const sid = activeStudentId || 'default';
    const key = 'obj_results_' + sid;
    await DB.update(key, list => {
        const next = Array.isArray(list) ? list : [];
        next.unshift({
            id: 'obj_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
            date: new Date().toISOString(),
            items: _objItems.length,
            errors: _objErrors,
        });
        if (next.length > 100) next.splice(100);
        return next;
    });
}

async function renderObjResultsSummary() {
    const el = document.getElementById('objResultsSummary');
    if (!el) return;
    const sid = activeStudentId || 'default';
    const list = await DB.get('obj_results_' + sid) || [];
    if (!list.length) {
        el.innerHTML = `<p class="report-empty">${t('report_no_obj')}</p>`;
        return;
    }
    const plays = list.length;
    const items = list.reduce((s, r) => s + (r.items || 0), 0);
    const errors = list.reduce((s, r) => s + (r.errors || 0), 0);
    const acc = items + errors > 0 ? Math.round((items / (items + errors)) * 100) : 100;
    const perfect = list.filter(r => !r.errors).length;
    const last = new Date(list[0].date).toLocaleDateString(
        _lang === 'en' ? 'en-US' : 'tr-TR', { day: 'numeric', month: 'short' });
    const line = t('obj_summary_line')
        .replace('{plays}', plays).replace('{acc}', acc).replace('{perfect}', perfect);
    el.innerHTML = `<div class="report-summary-row">
        <span class="report-summary-icon">🔍</span>
        <div class="report-summary-info">
            <strong>${t('object_title')}</strong>
            <span>${line} • ${escapeHtml(last)}</span>
        </div>
    </div>`;
}

/**
 * Genel amaçlı tek seferlik ses tanıma. Native (Capacitor) eklentisi varsa onu,
 * yoksa Web Speech API'yi kullanır. Belirli bir ekranın DOM elemanlarına bağlı
 * değildir — tanınan metni (veya boş string) döndürür.
 */
function _recognizeSpeechOnceIos(native) {
    return new Promise((resolve) => {
        let latest = '';
        let done = false;
        let silenceTimer = null;
        let hardTimer = null;
        const finish = () => {
            if (done) return;
            done = true;
            clearTimeout(hardTimer);
            clearTimeout(silenceTimer);
            try { native.stop().catch(() => {}); } catch (_) {}
            try { Promise.resolve(native.removeAllListeners()).catch(() => {}); } catch (_) {}
            resolve(latest.trim());
        };
        hardTimer = setTimeout(finish, 8000);
        try {
            native.addListener('partialResults', (data) => {
                if (data && Array.isArray(data.matches) && data.matches[0]) {
                    latest = data.matches[0];
                    clearTimeout(silenceTimer);
                    silenceTimer = setTimeout(finish, 1800);
                }
            });
        } catch (_) {}
        native.start({
            language: _lang === 'en' ? 'en-US' : 'tr-TR',
            partialResults: true, popup: false
        }).then((res) => {
            if (res && Array.isArray(res.matches) && res.matches[0]) {
                latest = res.matches[0];
                finish();
            }
        }).catch(() => finish());
    });
}

async function recognizeSpeechOnce() {
    const native = _getNativeSpeech();
    if (native) {
        try {
            const avail = await native.available();
            if (!avail || !avail.available) return '';
            try {
                const perm = await native.requestPermissions();
                if (perm && perm.speechRecognition === 'denied') return '';
            } catch (_) {}
            if (Capacitor.getPlatform() === 'ios') return await _recognizeSpeechOnceIos(native);
            const res = await native.start({
                language: _lang === 'en' ? 'en-US' : 'tr-TR',
                maxResults: 1, partialResults: false, popup: false
            });
            return (res && Array.isArray(res.matches) && res.matches[0]) ? res.matches[0].trim() : '';
        } catch (_) { return ''; }
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return '';
    const isSafari = !window.SpeechRecognition && !!window.webkitSpeechRecognition;

    return new Promise((resolve) => {
        const recognition = new SpeechRecognition();
        recognition.lang = _lang === 'en' ? 'en-US' : 'tr-TR';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.continuous = false;
        let done = false;
        const finish = (val) => { if (done) return; done = true; try { recognition.stop(); } catch (_) {} resolve(val); };
        recognition.onresult = (e) => {
            const text = e.results && e.results[0] && e.results[0][0] ? e.results[0][0].transcript : '';
            finish((text || '').trim());
        };
        recognition.onerror = () => finish('');
        recognition.onend = () => finish('');
        setTimeout(() => finish(''), isSafari ? 6000 : 8000);
        try { recognition.start(); } catch (_) { finish(''); }
    });
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

function toggleHelpPanel() {
    const panel = document.getElementById('help-panel');
    if (!panel) return;
    const isOpen = panel.style.display !== 'none';
    panel.style.display = isOpen ? 'none' : 'flex';
}

document.addEventListener('DOMContentLoaded', function() {
    const settings = loadA11ySettings();
    applyA11yClasses(settings);
    applyLang();
    const gateInput = document.getElementById('parentGateInput');
    if (gateInput) gateInput.addEventListener('keydown', e => { if (e.key === 'Enter') submitParentGate(); });
});

// =============================================
// WINDOW EXPORT (HTML onclick için)
// =============================================
window.setLang = setLang;
window.continueAsGuest = continueAsGuest;
window.goToMenu = goToMenu;
window.goToTherapy = goToTherapy;
window.onMapNodeTap = onMapNodeTap;
window.openMapLevelModal = openMapLevelModal;
window.closeMapLevelModal = closeMapLevelModal;
window.chooseMapLevel = chooseMapLevel;
window.returnToMapFromComplete = returnToMapFromComplete;
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
window.rereadQuestion = rereadQuestion;
window.askAIMode = askAIMode;
window.submitParentGate = submitParentGate;
window.closeParentGate = closeParentGate;
window.toggleRoutineReminder = toggleRoutineReminder;
window.renderWeeklySummaryCard = renderWeeklySummaryCard;
window.guestExitToRegister = guestExitToRegister;
window.closeGuestLimitModal = closeGuestLimitModal;
// Yeni özellikler
window.goToSchedule = goToSchedule;
window.goToAac = goToAac;
window.setAacBoard = setAacBoard;
window.tapAacCard = tapAacCard;
window.removeAacWord = removeAacWord;
window.speakAacSentence = speakAacSentence;
window.clearAacSentence = clearAacSentence;
window.closeStarModal = closeStarModal;
window.goToSequence = goToSequence;
window.goToStore = goToStore;
window.toggleA11yPanel = toggleA11yPanel;
window.toggleHelpPanel = toggleHelpPanel;
window.applyA11y = applyA11y;
window.switchAuthTab = switchAuthTab;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.authLogout = authLogout;
window.exitVerifyModal = exitVerifyModal;
window.selectRegisterEmoji = selectRegisterEmoji;

// =============================================
// KİMLİK DOĞRULAMA (AUTH)
// =============================================
let _authToken    = null;
let _authUser     = null; // { username, displayName }
let _authMode     = 'login'; // 'login' | 'register'
let _verifyModalMandatory = false;
let _pendingPostVerifyAction = null;
let _verifyModalExitMode = 'close';
let _setEmailModalMandatory = false;
let _setEmailModalExitMode = 'close';

function authStorageKey()  { return 'auth_token'; }
function authUserStorageKey() { return 'auth_user'; }
function authDataKeyStorageKey() { return 'auth_data_key'; }
function authEmailVerifiedStorageKey() { return 'auth_email_verified'; }

async function authApi(action, body = {}) {
    try {
        const r = await fetch(API_BASE + '/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, ...body }),
            signal: AbortSignal.timeout(7000),
        });
        const text = await r.text();
        try { return JSON.parse(text); } catch { return { fallback: true, error: 'JSON parse hatası: ' + text.slice(0, 100) }; }
    } catch(e) {
        return { fallback: true, error: e.message || 'Bağlantı hatası' };
    }
}

const _splashShownAt = Date.now();
let _splashHiding = false;
function hideSplash() {
    const splash = document.getElementById('splash-screen');
    if (!splash || _splashHiding) return;
    _splashHiding = true;
    const wait = Math.max(0, 2500 - (Date.now() - _splashShownAt));
    setTimeout(() => {
        splash.classList.add('splash-hide');
        setTimeout(() => { splash.style.display = 'none'; }, 380);
    }, wait);
}

async function checkAuthSession() {
    try {
        const savedToken = DB.getSync(authStorageKey());
        const savedUser  = DB.getSync(authUserStorageKey());
        const savedDataKey = DB.getSync(authDataKeyStorageKey());

        if (savedToken && savedUser) {
            _authToken = savedToken;
            _authUser  = savedUser;
            await DB.initEncryption(savedDataKey || savedToken).catch(() => {});
            const res = await authApi('verify', { token: savedToken });
            if (res && !res.valid && !res.fallback) {
                DB.del(authStorageKey());
                DB.del(authUserStorageKey());
                DB.del(authDataKeyStorageKey());
                DB.del(authEmailVerifiedStorageKey());
                _authToken = null;
                _authUser  = null;
                showOnly('auth-screen');
                hideSplash();
                return;
            }
            if (res && res.valid) {
                _authUser = {
                    username: res.username,
                    displayName: res.displayName,
                    email: res.email || '',
                    emailVerified: !!res.emailVerified
                };
                DB.set(authEmailVerifiedStorageKey(), !!res.emailVerified);
                if (res.dataKey) {
                    DB.set(authDataKeyStorageKey(), res.dataKey);
                    if (res.dataKey !== savedDataKey) {
                        DB.initEncryption(res.dataKey)
                            .then(() => { try { DB.pushAll(); } catch(_) {} })
                            .catch(() => {});
                    }
                }
                if (res.hasEmail && !res.emailVerified) {
                    showOnly('auth-screen');
                    _pendingPostVerifyAction = () => continueAuthenticatedEntry();
                    document.getElementById('authError').textContent = '';
                    switchAuthTab('login');
                    showEmailVerifyModal(null, false, true, 'logout');
                    hideSplash();
                    return;
                }
                if (!res.hasEmail) {
                    showOnly('auth-screen');
                    _pendingPostVerifyAction = () => continueAuthenticatedEntry();
                    document.getElementById('authError').textContent = '';
                    switchAuthTab('login');
                    showSetEmailModal(true, 'logout');
                    hideSplash();
                    return;
                }
            }
            if (res && res.fallback) setTimeout(() => showToast(t('offline_toast')), 800);
            await continueAuthenticatedEntry();
            hideSplash();
            return;
        }
    } catch (e) {}

    hideSplash();
    showOnly('auth-screen');
}

// Cihaz kimliği: Android'de ANDROID_ID (uygulama silinip yeniden kurulsa da
// aynı kalır — deneme hakkı bu sayede sıfırlanmaz), web'de localStorage'da
// saklanan rastgele kimlik.
async function getGuestDeviceId() {
    try {
        if (typeof Capacitor !== 'undefined' && Capacitor.isNativePlatform()
            && Capacitor.Plugins && Capacitor.Plugins.Device) {
            const info = await Capacitor.Plugins.Device.getId();
            const id = info && (info.identifier || info.uuid);
            if (id) return 'and_' + id;
        }
    } catch (_) {}
    let id = null;
    try { id = localStorage.getItem('lms_device_id'); } catch (_) {}
    if (!id) {
        const rand = (crypto.randomUUID && crypto.randomUUID())
            || (Date.now() + '_' + Math.random().toString(36).slice(2, 12));
        id = 'web_' + rand;
        try { localStorage.setItem('lms_device_id', id); } catch (_) {}
    }
    return id;
}

async function continueAsGuest() {
    let started = null;
    try {
        const deviceId = await getGuestDeviceId();
        const res = await authApi('guest_start', { deviceId });
        if (res && res.ok && res.token) started = res;
    } catch (_) {}

    if (started) {
        _authToken = started.token;
        // Sunucudaki hak durumu yereldekini ezer — uygulama silinip yeniden
        // kurulduğunda kota kaldığı yerden devam eder
        const used = {};
        if (started.used && started.used.therapy) used.therapy = Date.now();
        if (started.used && started.used.obj) used.obj = Date.now();
        try { localStorage.setItem('lms_guest_used', JSON.stringify(used)); } catch (_) {}
    } else {
        _authToken = 'demo_' + Date.now();
    }
    _authUser = { username: 'guest', displayName: _lang === 'en' ? 'Guest' : 'Misafir' };
    await DB.initEncryption(_authToken).catch(() => {});
    await continueAuthenticatedEntry();
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
    document.body.classList.add('has-bottom-nav');
    initLoginScreen();
    showOnly('login-screen');
    syncUserDataFromCloud();
}

async function syncUserDataFromCloud() {
    try {
        const userId = await getCurrentUserId();
        if (!userId || userId === 'guest') return;
        // Not: eskiden burada 'teacher_students_' + userId kullanılıyordu ama
        // gerçek öğrenci listesi anahtarı studentsKey() — bu yüzden aşağıdaki
        // per-öğrenci anahtarlar (yıldız, nesne tanıma, AAC vb.) hiçbir zaman
        // gerçekten uzlaştırılmıyordu; iki cihaz sessizce birbirinden
        // ayrışıyordu (aynı hesap farklı ilerleme gösteriyordu).
        const sKey = studentsKey();

        // 1. adım: kullanıcı seviyesi anahtarlar (öğrenci listesi dahil).
        // Per-öğrenci anahtarları bundan ÖNCE bir arada uzlaştırmaya
        // çalışmak işe yaramaz — o anahtarların hangi öğrenci id'lerine
        // ait olduğunu bilmek için önce güncel öğrenci listesine ihtiyaç var.
        const changed1 = await DB.refreshKeys([
            sKey,
            'session_history_' + userId,
            'bep_profile_' + userId,
            'active_student_' + userId,
        ]);
        if (changed1.includes(sKey)) {
            studentsCache = DB.getSync(sKey) || [];
            if (currentScreenId === 'login-screen') initLoginScreen();
            else if (currentScreenId === 'menu-screen') { renderRoleDashboard(); renderStudentDetailPanel(); }
        }

        // 2. adım: (artık güncel olan) öğrenci listesine göre per-öğrenci
        // "konteyner" anahtarlarını uzlaştır
        const students = DB.getSync(sKey) || [];
        if (!students.length) return;
        const containerKeys = [];
        students.forEach(s => {
            containerKeys.push('stars_' + s.id, 'obj_results_' + s.id,
                'aac_settings_' + s.id, 'aac_boards_' + s.id,
                'iep_' + s.id, 'skills_' + s.id, 'behavior_' + s.id, 'adaptive_' + s.id);
        });
        const changed2 = await DB.refreshKeys(containerKeys);

        // 3. adım: (artık güncel olan) AAC pano / IEP hedef listelerine göre
        // yaprak anahtarları (kartlar / denemeler) uzlaştır
        const leafKeys = [];
        students.forEach(s => {
            (DB.getSync('aac_boards_' + s.id) || []).forEach(b => leafKeys.push('aac_cards_' + b.id));
            (DB.getSync('iep_' + s.id) || []).forEach(g => leafKeys.push('trials_' + g.id));
        });
        if (leafKeys.length) await DB.refreshKeys(leafKeys);

        // Aktif öğrencinin yıldız bakiyesi güncellendiyse menüdeki rozeti tazele
        if (activeStudentId && changed2.includes('stars_' + activeStudentId) && currentScreenId === 'menu-screen') {
            updateStarBadge();
        }
    } catch(_) {}
}

function onAuthSuccessWithStudent(student) {
    const nameEl = document.getElementById('active-student-name');
    if (nameEl) nameEl.textContent = student.name;
    const greetEl = document.getElementById('menu-greeting');
    if (greetEl) greetEl.textContent = t('menu_greeting_named').replace('{name}', student.name);
    document.body.classList.add('has-bottom-nav');
    showOnly('menu-screen');
    syncUserDataFromCloud();
}

async function continueAuthenticatedEntry(preferredStudent = null) {
    if (preferredStudent) {
        activeStudentId = preferredStudent.id;
        activeStudentName = preferredStudent.name;
        localStorage.setItem('lms_last_user', _authUser.username);
        onAuthSuccessWithStudent(preferredStudent);
        return;
    }

    const students = await loadStudents();
    if (students.length > 0) {
        const student = students[0];
        activeStudentId = student.id;
        activeStudentName = student.name;
        onAuthSuccessWithStudent(student);
    } else {
        onAuthSuccess();
    }
}

function currentBepProfileKey() {
    const user = getActiveAuthUser();
    return user ? 'bep_profile_' + user.username : '';
}

async function loadCurrentBepProfile() {
    const key = currentBepProfileKey();
    if (!key) return null;
    return DB.getSync(key) || await DB.get(key) || null;
}

function renderLoginEmojiPicker(selectedEmoji = '🌟') {
    const picker = document.getElementById('loginEmojiPicker');
    const hidden = document.getElementById('loginStudentEmoji');
    if (!picker || !hidden) return;
    hidden.value = selectedEmoji;
    picker.innerHTML = STUDENT_EMOJIS.map(e => `
        <button type="button" class="emoji-pick-btn ${e === selectedEmoji ? 'selected' : ''}"
            onclick="selectLoginEmoji('${e}', this)">${e}</button>
    `).join('');
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
    document.getElementById('resetForm').style.display    = 'none';
    document.getElementById('tabLogin').classList.toggle('active',    mode === 'login');
    document.getElementById('tabRegister').classList.toggle('active', mode === 'register');
    document.getElementById('authError').textContent = '';
    if (mode === 'register') renderRegisterEmojiPicker();
}

function showResetForm() {
    document.getElementById('loginForm').style.display    = 'none';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('resetForm').style.display    = '';
    document.getElementById('resetIdentifier').value = document.getElementById('loginUsername').value;
    document.getElementById('resetCodeFields').style.display = 'none';
    document.getElementById('resetCodeInput').value = '';
    document.getElementById('resetInfoText').textContent = t('auth_reset_email_info');
    document.getElementById('authError').textContent = '';
}

function hideResetForm() {
    document.getElementById('resetForm').style.display = 'none';
    switchAuthTab('login');
}

async function requestResetCode() {
    const identifier = document.getElementById('resetIdentifier').value.trim();
    if (!identifier) return showAuthError(t('auth_fill_all'));
    const btn = document.getElementById('sendResetCodeBtn');
    btn.disabled = true; btn.textContent = t('auth_waiting');
    const res = await authApi('request_reset', { identifier });
    btn.disabled = false; btn.textContent = t('auth_send_code_btn');

    if (res.fallback) return showAuthError(connectionErrorMsg());
    if (!res.ok) return showAuthError(t(res.error) || t('auth_fill_all'));

    document.getElementById('resetCodeFields').style.display = '';
    document.getElementById('resetInfoText').textContent = res.emailMasked
        ? t('auth_code_sent_info').replace('{email}', res.emailMasked)
        : t('auth_reset_requested_generic');
    document.getElementById('authError').textContent = '';
    showToast(t('auth_code_sent_toast'));
}

/* ---- E-posta doğrulama modalı ---- */
function showEmailVerifyModal(emailMasked, codeAlreadySent = true, mandatory = false, exitMode = 'close') {
    const modal = document.getElementById('emailVerifyModal');
    if (!modal) return;
    const setEmailModal = document.getElementById('setEmailModal');
    if (setEmailModal) setEmailModal.style.display = 'none';
    _verifyModalMandatory = mandatory;
    _verifyModalExitMode = exitMode;
    document.getElementById('verifyModalText').textContent = codeAlreadySent
        ? t('verify_modal_sub').replace('{email}', emailMasked || '')
        : t('verify_modal_nudge');
    document.getElementById('verifyCodeInput').value = '';
    const laterBtn = document.getElementById('verifyLaterBtn');
    if (laterBtn) laterBtn.style.display = mandatory ? 'none' : '';
    modal.style.display = 'flex';
}

function closeVerifyModal() {
    if (_verifyModalMandatory) return;
    document.getElementById('emailVerifyModal').style.display = 'none';
    _verifyModalExitMode = 'close';
}

function showSetEmailModal(mandatory = false, exitMode = 'close') {
    const modal = document.getElementById('setEmailModal');
    if (!modal) return;
    _setEmailModalMandatory = mandatory;
    _setEmailModalExitMode = exitMode;
    const input = document.getElementById('setEmailInput');
    if (input) {
        input.value = _authUser?.email || '';
        setTimeout(() => input.focus(), 0);
    }
    modal.style.display = 'flex';
}

function closeSetEmailModal() {
    if (_setEmailModalMandatory) return;
    const modal = document.getElementById('setEmailModal');
    if (modal) modal.style.display = 'none';
    _setEmailModalExitMode = 'close';
}

async function clearAuthSessionLocal() {
    DB.del(authStorageKey());
    DB.del(authUserStorageKey());
    DB.del(authDataKeyStorageKey());
    DB.del(authEmailVerifiedStorageKey());
    _authToken = null;
    _authUser  = null;
    _pendingPostVerifyAction = null;
    _verifyModalMandatory = false;
    _verifyModalExitMode = 'close';
    _setEmailModalMandatory = false;
    _setEmailModalExitMode = 'close';
    document.getElementById('emailVerifyModal').style.display = 'none';
    const setEmailModal = document.getElementById('setEmailModal');
    if (setEmailModal) setEmailModal.style.display = 'none';
}

async function exitVerifyModal() {
    if (!_verifyModalMandatory) {
        closeVerifyModal();
        return;
    }

    const exitMode = _verifyModalExitMode;
    if (exitMode === 'delete_signup' && _authToken && !_authToken.startsWith('demo_')) {
        await authApi('delete', { token: _authToken });
        await clearAuthSessionLocal();
        showOnly('auth-screen');
        document.getElementById('authError').textContent = '';
        switchAuthTab('register');
        return;
    }

    if (_authToken && !_authToken.startsWith('demo_')) {
        await authApi('logout', { token: _authToken });
    }
    await clearAuthSessionLocal();
    showOnly('auth-screen');
    document.getElementById('authError').textContent = '';
    switchAuthTab('login');
}

async function exitSetEmailModal() {
    if (!_setEmailModalMandatory) {
        closeSetEmailModal();
        return;
    }

    if (_setEmailModalExitMode === 'delete_signup' && _authToken && !_authToken.startsWith('demo_')) {
        await authApi('delete', { token: _authToken });
        await clearAuthSessionLocal();
        showOnly('auth-screen');
        document.getElementById('authError').textContent = '';
        switchAuthTab('register');
        return;
    }

    if (_authToken && !_authToken.startsWith('demo_')) {
        await authApi('logout', { token: _authToken });
    }
    await clearAuthSessionLocal();
    showOnly('auth-screen');
    document.getElementById('authError').textContent = '';
    switchAuthTab('login');
}

async function submitSetEmailModal() {
    const input = document.getElementById('setEmailInput');
    const email = input ? input.value.trim() : '';
    if (!email) return;
    const res = await authApi('set_email', { token: _authToken, email });
    if (res && res.ok) {
        if (_authUser) {
            _authUser.email = email.toLowerCase();
            _authUser.emailVerified = false;
        }
        const modal = document.getElementById('setEmailModal');
        if (modal) modal.style.display = 'none';
        showEmailVerifyModal(res.emailMasked, !!res.verificationSent, true, _setEmailModalExitMode);
        return;
    }
    showToast(t(res && res.error) || t('AUTH_EMAIL_INVALID'));
}

async function submitEmailVerification() {
    const code = document.getElementById('verifyCodeInput').value.trim();
    if (!code) return;
    const res = await authApi('verify_email', { token: _authToken, code });
    if (res && res.ok) {
        const postVerifyAction = _pendingPostVerifyAction;
        _pendingPostVerifyAction = null;
        _verifyModalMandatory = false;
        _verifyModalExitMode = 'close';
        DB.set(authEmailVerifiedStorageKey(), true);
        if (_authUser) {
            if (res.email) _authUser.email = res.email;
            _authUser.emailVerified = true;
        }
        closeVerifyModal();
        if (typeof postVerifyAction === 'function') await postVerifyAction();
        showToast(t('verify_success'));
    } else {
        showToast(t(res && res.error) || t('AUTH_VERIFY_CODE_INVALID'));
    }
}

async function resendVerificationCode() {
    const res = await authApi('send_email_verification', { token: _authToken });
    if (res && res.ok) {
        document.getElementById('verifyModalText').textContent =
            t('verify_modal_sub').replace('{email}', res.emailMasked || '');
        showToast(t('auth_code_sent_toast'));
    } else {
        showToast(t(res && res.error) || t('error'));
    }
}

async function handleResetPassword(e) {
    e.preventDefault();
    const identifier   = document.getElementById('resetIdentifier').value.trim();
    const codeValue    = document.getElementById('resetCodeInput').value.trim();
    const newPassword  = document.getElementById('resetPassword').value;
    const newPassword2 = document.getElementById('resetPassword2').value;
    if (!identifier || !codeValue || !newPassword) return showAuthError(t('auth_fill_all'));
    if (newPassword !== newPassword2) return showAuthError(t('auth_passwords_mismatch'));
    if (newPassword.length < 6) return showAuthError(t('auth_password_short'));

    const btn = document.getElementById('resetBtn');
    btn.disabled = true; btn.textContent = t('auth_waiting');
    const res = await authApi('reset_with_email_code', { identifier, code: codeValue, newPassword });
    btn.disabled = false; btn.textContent = t('auth_reset_btn');

    if (res.fallback) return showAuthError(connectionErrorMsg());
    if (!res.ok) return showAuthError(t(res.error) || t('AUTH_RESET_CODE_INVALID'));

    _authToken = res.token;
    _authUser  = { username: res.username || identifier.toLowerCase(), displayName: res.displayName };
    await DB.initEncryption(res.dataKey || res.token);
    DB.set(authStorageKey(), _authToken);
    DB.set(authUserStorageKey(), _authUser);
    if (res.dataKey) DB.set(authDataKeyStorageKey(), res.dataKey);
    localStorage.setItem('lms_last_user', _authUser.username);

    hideResetForm();
    showToast(t('auth_reset_success'));

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

function setAuthLoading(loading) {
    const btn = document.getElementById(_authMode === 'login' ? 'loginBtn' : 'registerBtn');
    if (btn) { btn.disabled = loading; btn.textContent = loading ? t('auth_waiting') : (_authMode === 'login' ? t('login_btn') : t('register_btn')); }
}

function showAuthError(msg) {
    const el = document.getElementById('authError');
    if (el) { el.textContent = msg; }
}

function showToast(msg) {
    let el = document.getElementById('appToast');
    if (!el) {
        el = document.createElement('div');
        el.id = 'appToast';
        el.className = 'app-toast';
        document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._hideTimer);
    el._hideTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    if (!username || !password) return showAuthError(t('auth_fill_all'));
    setAuthLoading(true);

    const res = await authApi('login', { username, password });
    setAuthLoading(false);

    if (res.fallback) {
        return showAuthError(connectionErrorMsg());
    }
    if (!res.ok) return showAuthError(t(res.error) || t('auth_fill_all'));
    _authToken = res.token;
    _authUser  = {
        username: username.toLowerCase(),
        displayName: res.displayName,
        email: res.email || '',
        emailVerified: !!res.emailVerified
    };
    await DB.initEncryption(res.dataKey || res.token);
    DB.set(authStorageKey(), _authToken);
    DB.set(authUserStorageKey(), _authUser);
    if (res.dataKey) DB.set(authDataKeyStorageKey(), res.dataKey);
    DB.set(authEmailVerifiedStorageKey(), !!res.emailVerified);
    localStorage.setItem('lms_last_user', _authUser.username);

    if (res.hasEmail && !res.emailVerified) {
        _pendingPostVerifyAction = () => continueAuthenticatedEntry();
        showOnly('auth-screen');
        document.getElementById('authError').textContent = '';
        switchAuthTab('login');
        showEmailVerifyModal(null, false, true, 'logout');
        return;
    }
    if (!res.hasEmail) {
        _pendingPostVerifyAction = () => continueAuthenticatedEntry();
        showOnly('auth-screen');
        document.getElementById('authError').textContent = '';
        switchAuthTab('login');
        showSetEmailModal(true, 'logout');
        return;
    }

    await continueAuthenticatedEntry();
    showToast(t('auth_login_success'));
}

async function handleRegister(e) {
    e.preventDefault();
    const username    = document.getElementById('regUsername').value.trim();
    const password    = document.getElementById('regPassword').value;
    const password2   = document.getElementById('regPassword2').value;
    const regEmail    = document.getElementById('regEmail').value.trim();
    if (!document.getElementById('kvkkConsent').checked) return showAuthError(t('auth_kvkk_required'));
    if (!username || !password || !regEmail) return showAuthError(t('auth_fill_all'));
    if (password !== password2) return showAuthError(t('auth_passwords_mismatch'));
    if (password.length < 8) return showAuthError(t('auth_password_short'));
    setAuthLoading(true);

    const res = await authApi('register', { username, password, email: regEmail, kvkkAccepted: true });
    setAuthLoading(false);

    if (res.fallback) {
        return showAuthError(connectionErrorMsg());
    }
    if (!res.ok) return showAuthError(t(res.error) || t('auth_fill_all'));
    _authToken = res.token;
    _authUser  = {
        username: username.toLowerCase(),
        displayName: res.displayName,
        email: regEmail.toLowerCase(),
        emailVerified: false
    };
    await DB.initEncryption(res.dataKey || res.token);
    DB.set(authStorageKey(), _authToken);
    DB.set(authUserStorageKey(), _authUser);
    if (res.dataKey) DB.set(authDataKeyStorageKey(), res.dataKey);
    DB.set(authEmailVerifiedStorageKey(), false);
    localStorage.setItem('lms_last_user', _authUser.username);
    _pendingPostVerifyAction = () => continueAuthenticatedEntry();
    showOnly('auth-screen');
    showEmailVerifyModal(res.emailMasked, !!res.emailVerificationPending, true, 'delete_signup');
}

async function authLogout() {
    if (_authToken && !_authToken.startsWith('demo_')) {
        authApi('logout', { token: _authToken });
    }
    await clearAuthSessionLocal();
    showOnly('auth-screen');
    document.getElementById('authError').textContent = '';
    switchAuthTab('login');
}

function openKvkkModal(e) {
    if (e) e.preventDefault();
    const isTr = _lang !== 'en';
    document.getElementById('kvkkModalTitle').textContent = isTr
        ? 'Gizlilik ve KVKK Bilgilendirmesi'
        : 'Privacy & Data Protection';
    document.getElementById('kvkkModalBody').innerHTML = isTr ? `
        <h4>Aydınlatma Metni</h4>
        <p><strong>Veri Sorumlusu:</strong> Efe Erman — İstanbul, Tuzla — yildizsiniflari@gmail.com</p>
        <p><strong>Toplanan Veriler:</strong> Kullanıcı adı, e-posta adresi (şifre sıfırlama ve hesap doğrulama amaçlı), öğrenci adı, eğitim kademesi, destek ihtiyacı bilgileri, seans kayıtları, oturum bilgileri. Öğrenci verilerinin işlenmesi için veli/yasal temsilci onayı zorunludur.</p>
        <p><strong>İşleme Amacı:</strong> Özel eğitim süreçlerinin takibi, BEP taslağı hazırlama, yapay zeka destekli geri bildirim oluşturulması.</p>
        <p><strong>Onay Kaydı:</strong> Veli onayı öğrenci kaydıyla, Aydınlatma Metni kabulü hesap kaydıyla birlikte tarih bilgisi olarak saklanır.</p>
        <p><strong>Saklama Süresi:</strong> Hesap silinene kadar. Uygulama içi "Hesabı Sil" ile tüm veriler anında, e-posta ile iletilen silme talepleri en geç 30 gün içinde kalıcı olarak silinir. Kişisel bilgi içermeyen teknik hata kayıtları en fazla 30 gün saklanır.</p>
        <p><strong>Aktarılan Taraflar:</strong> Vercel (barındırma altyapısı), Aiven (veritabanı), Google Gemini (yapay zeka), Gmail SMTP (e-posta gönderimi), Pexels (görsel içerik). Seslendirme (metin okuma) kendi sunucumuzda yerel olarak yapılır; bu amaçla hiçbir veri üçüncü tarafa aktarılmaz. Bu hizmetler yalnızca teknik işleme amacıyla kullanılmakta olup kişisel verileriniz pazarlama amaçlı üçüncü taraflarla paylaşılmamaktadır.</p>
        <p><strong>Misafir Modu:</strong> Kayıt olmadan deneme yapıldığında öğrenci bilgileri yalnızca cihazınızda saklanır, sunucuya gönderilmez. Deneme hakkının kötüye kullanılmasını önlemek için cihaz kimliğinin geri döndürülemez bir karma (hash) özeti sunucuda tutulur; bu özet kimliğinizle ilişkilendirilmez. Seans sırasında verilen yanıtların metni, geri bildirim üretmek için yapay zeka hizmetine iletilir.</p>
        <p><strong>Haklarınız (KVKK Md. 11):</strong> Verilerinize erişim, düzeltme, silme, işlemeyi kısıtlama ve taşıma haklarına sahipsiniz. Talepleriniz için uygulama içi "Hesabı Sil" veya "Verilerimi İndir" özelliklerini kullanabilirsiniz.</p>
        <h4>Gizlilik Politikası</h4>
        <p>YıldızCan, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında kişisel verilerinizi korumayı taahhüt eder. Çocuklara ait veriler yalnızca eğitim amacıyla işlenir, hiçbir koşulda satılmaz veya reklam amacıyla kullanılmaz.</p>
        <p>Veriler önce cihazınızdaki yerel depoya (localStorage) kaydedilir; kayıtlı hesaplarda ayrıca hesabınıza özel olarak sunucu veritabanıyla eşitlenir. Misafir modunda öğrenci verileri yalnızca cihazda kalır.</p>
        <p>Sorularınız için: yildizsiniflari@gmail.com</p>
        <h4>Çerez / Yerel Depolama Politikası</h4>
        <p>Uygulama; oturum belirteci, kullanıcı tercihleri ve öğrenci verilerini cihazınızdaki localStorage'da saklar. Üçüncü taraf çerez kullanılmaz. Tarayıcı verilerini temizlediğinizde yerel veriler de silinir.</p>
    ` : `
        <h4>Privacy Notice</h4>
        <p><strong>Data Controller:</strong> Efe Erman — Istanbul, Tuzla — yildizsiniflari@gmail.com</p>
        <p><strong>Data Collected:</strong> Username, email address (for password reset and account verification), student name, education level, support needs, practice session records, login session information. Parental/guardian consent is required to process student data.</p>
        <p><strong>Purpose:</strong> Tracking special education progress, IEP draft preparation, AI-assisted feedback generation.</p>
        <p><strong>Consent Records:</strong> Parental consent is stored with the student record and Privacy Notice acceptance with the account record, each with a timestamp.</p>
        <p><strong>Retention:</strong> Until account deletion. In-app "Delete Account" removes all data immediately; deletion requests sent by email are fulfilled within 30 days. Technical error logs containing no personal information are kept for at most 30 days.</p>
        <p><strong>Third Parties:</strong> Vercel (hosting), Aiven (database), Google Gemini (AI), Gmail SMTP (email delivery), Pexels (images). Speech synthesis runs locally on our own server; no data is transferred to any third party for this purpose. These services are used for technical processing only — your data is never shared with third parties for marketing purposes.</p>
        <p><strong>Guest Mode:</strong> When trying the app without an account, student data stays on your device only and is not sent to the server. To prevent abuse of the free trial, an irreversible hash of your device identifier is kept on the server; it is never linked to your identity. The text of answers given during a session is sent to the AI service to generate feedback.</p>
        <p><strong>Your Rights:</strong> You have the right to access, correct, delete, restrict processing, and port your data. Use the in-app "Delete Account" or "Export My Data" features to exercise these rights.</p>
        <h4>Privacy Policy</h4>
        <p>YıldızCan is committed to protecting your personal data. Student data is processed solely for educational purposes and will never be sold or used for advertising.</p>
        <p>Data is saved to your device's local storage (localStorage) first; for registered accounts it is additionally synced to the server database, isolated per account. In guest mode student data stays on the device only.</p>
        <p>Questions: yildizsiniflari@gmail.com</p>
        <h4>Cookie / Local Storage Policy</h4>
        <p>The app stores session tokens, user preferences, and student data in your device's localStorage. No third-party cookies are used. Clearing your browser data will also remove local app data.</p>
    `;
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
        ogrenciler: await DB.get(studentsKey()) || [],
        verme_tarihi: new Date().toISOString(),
    };

    const excludedKeys = new Set([
        authStorageKey(),
        authUserStorageKey(),
        authDataKeyStorageKey(),
        authEmailVerifiedStorageKey(),
        '_key_ts',
    ]);

    const keys = Object.keys(localStorage).filter(k => k.startsWith('lms_'));
    for (const fullKey of keys) {
        const logicalKey = fullKey.slice(4);
        if (!logicalKey || excludedKeys.has(logicalKey)) continue;

        let value = await DB.get(logicalKey);
        if (value === null) {
            try { value = JSON.parse(localStorage.getItem(fullKey)); }
            catch { value = localStorage.getItem(fullKey); }
        }
        data[fullKey] = value;
    }
    const json = JSON.stringify(data, null, 2);
    const fileName = `yildiz-siniflari-verilerim-${Date.now()}.json`;

    if (navigator.canShare && navigator.share) {
        const file = new File([json], fileName, { type: 'application/json' });
        if (navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({ files: [file], title: fileName });
                return;
            } catch (e) {
                if (e && e.name === 'AbortError') return;
            }
        }
    }

    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function deleteAccount() {
    const confirmed = confirm(t('confirm_delete_account_1'));
    if (!confirmed) return;
    const confirmed2 = confirm(t('confirm_delete_account_2'));
    if (!confirmed2) return;

    if (_authToken && !_authToken.startsWith('demo_')) {
        await authApi('delete', { token: _authToken });
    }
    // Sunucu tarafı hesapla birlikte tüm app_data kayıtlarını da siliyor;
    // burada sadece yerel kopya temizlenir
    const lsKeys = [...Object.keys(localStorage)].filter(k => k.startsWith('lms_'));
    lsKeys.forEach(k => { try { localStorage.removeItem(k); } catch {} });
    // sessionStorage temizle
    const ssKeys = [...Object.keys(sessionStorage)].filter(k => k.startsWith('lms_s_'));
    ssKeys.forEach(k => sessionStorage.removeItem(k));
    _authToken = null;
    _authUser = null;
    alert(t('account_deleted_msg'));
    showOnly('auth-screen');
    switchAuthTab('login');
}

async function promptSetEmail() {
    if (!_authToken || _authToken.startsWith('demo_')) return;
    openEmailEditor();
}

function openEmailEditor() {
    const editor = document.getElementById('a11yEmailEditor');
    const input = document.getElementById('a11yEmailInput');
    if (!editor || !input) return;
    editor.style.display = 'flex';
    input.value = _authUser?.email || '';
    input.focus();
}

function closeEmailEditor() {
    const editor = document.getElementById('a11yEmailEditor');
    if (editor) editor.style.display = 'none';
}

async function saveEmailInline() {
    if (!_authToken || _authToken.startsWith('demo_')) return;
    const input = document.getElementById('a11yEmailInput');
    const email = input ? input.value.trim() : '';
    if (!email) return showToast(t('AUTH_EMAIL_INVALID'));
    const res = await authApi('set_email', { token: _authToken, email });
    if (res && res.ok) {
        if (_authUser) {
            _authUser.email = email.toLowerCase();
            _authUser.emailVerified = false;
        }
        closeEmailEditor();
        showToast(t('set_email_success').replace('{email}', res.emailMasked || ''));
        updateA11yAccountSection();
        if (res.verificationSent) showEmailVerifyModal(res.emailMasked);
    } else {
        showToast(t(res && res.error) || t('AUTH_EMAIL_INVALID'));
    }
}

function updateA11yAccountSection() {
    const section = document.getElementById('a11yAccountSection');
    const userEl = document.getElementById('a11yAccountUser');
    if (!section) return;
    if (_authUser) {
        section.style.display = 'block';
        if (userEl) {
            const syncAt = DB.lastSyncAt ? DB.lastSyncAt() : null;
            const syncText = syncAt
                ? t('sync_last').replace('{time}', new Date(syncAt).toLocaleTimeString(_lang === 'en' ? 'en-US' : 'tr-TR', { hour: '2-digit', minute: '2-digit' }))
                : t('sync_never');
            userEl.textContent = '@' + _authUser.username + ' • ' + syncText;
        }
    } else {
        section.style.display = 'none';
    }
}

updateA11yAccountSection = function updateA11yAccountSection() {
    const section = document.getElementById('a11yAccountSection');
    const userEl = document.getElementById('a11yAccountUser');
    const emailValueEl = document.getElementById('a11yEmailValue');
    const emailStatusEl = document.getElementById('a11yEmailStatus');
    if (!section) return;
    if (_authUser) {
        section.style.display = 'block';
        if (userEl) {
            const syncAt = DB.lastSyncAt ? DB.lastSyncAt() : null;
            const syncText = syncAt
                ? t('sync_last').replace('{time}', new Date(syncAt).toLocaleTimeString(_lang === 'en' ? 'en-US' : 'tr-TR', { hour: '2-digit', minute: '2-digit' }))
                : t('sync_never');
            const emailText = _authUser.email || t('email_missing_label');
            const verifyText = _authUser.email
                ? (_authUser.emailVerified ? t('email_verified_label') : t('email_unverified_label'))
                : '';
            userEl.innerHTML = `
                <div>@${escapeHtml(_authUser.username)} • ${escapeHtml(syncText)}</div>
                <div class="a11y-account-meta">${escapeHtml(emailText)}${verifyText ? ` • ${escapeHtml(verifyText)}` : ''}</div>
            `;
        }
        if (emailValueEl) emailValueEl.textContent = _authUser.email || t('email_missing_label');
        if (emailStatusEl) emailStatusEl.textContent = _authUser.email
            ? (_authUser.emailVerified ? t('email_verified_label') : t('email_unverified_label'))
            : t('email_missing_label');
    } else {
        section.style.display = 'none';
    }
};

window.openKvkkModal = openKvkkModal;
window.closeKvkkModal = closeKvkkModal;
window.openEmailEditor = openEmailEditor;
window.closeEmailEditor = closeEmailEditor;
window.saveEmailInline = saveEmailInline;
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
    const wrap = document.getElementById('loginStudents');
    if (wrap) {
        wrap.innerHTML = Array(3).fill(0).map(() =>
            `<div class="login-student-card skeleton" aria-hidden="true"></div>`
        ).join('');
    }
    const students = await loadStudents();
    renderLoginStudents(students);
    const settings = loadA11ySettings();
    applyA11yClasses(settings);
}

function getActiveAuthUser() {
    if (_authUser && _authUser.username) return _authUser;
    if (typeof window !== 'undefined' && window._authUser && window._authUser.username) return window._authUser;
    const saved = DB.getSync(authUserStorageKey());
    return saved && saved.username ? saved : null;
}

function studentsKey() {
    const user = getActiveAuthUser();
    return user ? 'students_' + user.username : 'students';
}

function legacyStudentsKey() {
    const user = getActiveAuthUser();
    return user ? 'teacher_students_' + user.username : 'teacher_students';
}

function normalizeStudentRecord(student, index = 0) {
    if (!student || typeof student !== 'object') return null;
    return {
        id: student.id || `st_${Date.now()}_${index}`,
        name: String(student.name || student.full_name || '').trim(),
        emoji: student.emoji || '🌟',
        createdAt: student.createdAt || student.created_at || new Date().toISOString(),
        consentAt: student.consentAt || student.consent_at || null,
    };
}

async function loadStudents() {
    const key = studentsKey();
    const legacyKey = legacyStudentsKey();
    let list = DB.getSync(key);
    if (!list) list = await DB.get(key);

    if (!list || !list.length) {
        const legacyList = DB.getSync(legacyKey);
        if (!legacyList) {
            const remoteLegacy = await DB.get(legacyKey);
            if (remoteLegacy && remoteLegacy.length) {
                list = remoteLegacy;
            }
        } else if (legacyList.length) {
            list = legacyList;
        }
    }

    if (list && list.length) {
        try {
            list = await saveStudents(list);
        } catch (_) {}
    }

    return Array.isArray(list) ? list : [];
}

async function saveStudents(list) {
    const normalized = (Array.isArray(list) ? list : [])
        .map((student, index) => normalizeStudentRecord(student, index))
        .filter(Boolean)
        .slice(0, 1);
    await DB.set(studentsKey(), normalized);
    await DB.set(legacyStudentsKey(), normalized);
    return normalized;
}

let _cachedLoginStudents = [];

async function renderLoginStudents(students) {
    _cachedLoginStudents = Array.isArray(students) ? students.slice(0, 1) : [];
    const wrap = document.getElementById('loginStudents');
    if (!wrap) return;
    const subtitleEl = document.getElementById('loginSubtitle');
    const saveBtn = document.getElementById('loginSaveBtn');
    const backBtn = document.getElementById('loginBackBtn');
    const statusEl = document.getElementById('loginProfileStatus');
    const nameInput = document.getElementById('loginNameInput');
    const consentEl = document.getElementById('loginVeliConsent');
    const student = _cachedLoginStudents[0] || null;
    const profile = await loadCurrentBepProfile();

    if (!student) {
        wrap.innerHTML = `<div class="login-empty">
            <p>${t('login_no_students')}</p>
            <p>${t('no_students_yet')}</p>
        </div>`;
    } else {
        wrap.innerHTML = `
            <div class="login-student-card">
                <span class="login-student-emoji">${escapeHtml(student.emoji || '🌟')}</span>
                <span class="login-student-name">${escapeHtml(student.name)}</span>
            </div>
        `;
    }

    if (subtitleEl) subtitleEl.textContent = student
        ? (_lang === 'en' ? 'Update your student information' : 'Öğrenci bilgilerini güncelle')
        : (_lang === 'en' ? 'Create your student profile to continue' : 'Devam etmek için öğrenci profilini oluştur');
    if (saveBtn) saveBtn.textContent = student ? t('save') : t('setup_create_btn');
    if (backBtn) backBtn.style.display = student ? '' : 'none';
    if (statusEl) statusEl.textContent = '';
    if (nameInput) nameInput.value = student?.name || '';
    if (consentEl) consentEl.checked = false;
    const guestHint = document.getElementById('guestNameHint');
    if (guestHint) guestHint.style.display = isGuestUser() ? '' : 'none';
    renderLoginEmojiPicker(student?.emoji || '🌟');
    document.querySelectorAll('input[name="loginLevel"]').forEach(input => {
        input.checked = input.value === (profile?.category || 'egit');
    });
    document.querySelectorAll('.login-cond').forEach(input => {
        input.checked = Array.isArray(profile?.conditions) && profile.conditions.includes(input.value);
    });
}

function selectLoginEmoji(emoji, btn) {
    const hidden = document.getElementById('loginStudentEmoji');
    if (hidden) hidden.value = emoji;
    document.querySelectorAll('#loginEmojiPicker .emoji-pick-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
}

async function createStudentFromLogin() {
    const nameEl = document.getElementById('loginNameInput');
    const statusEl = document.getElementById('loginProfileStatus');
    const saveBtn = document.getElementById('loginSaveBtn');
    const name = nameEl.value.trim();
    if (!name) {
        if (statusEl) statusEl.textContent = t('student_name_required');
        nameEl.focus();
        return;
    }
    const veliConsent = document.getElementById('loginVeliConsent');
    if (veliConsent && !veliConsent.checked) {
        if (statusEl) statusEl.textContent = t('kvkk_confirm_required');
        return;
    }
    const emoji = document.getElementById('loginStudentEmoji')?.value || '🌟';
    const students = await loadStudents();
    const existing = students[0] || null;
    const student = {
        id: existing?.id || ('st_' + Date.now()),
        name,
        emoji,
        createdAt: existing?.createdAt || new Date().toISOString(),
        consentAt: new Date().toISOString(),
    };
    if (saveBtn) saveBtn.disabled = true;
    if (statusEl) statusEl.textContent = existing ? t('updating_student') : t('creating_student');
    await saveStudents([student]);
    const bepKey = currentBepProfileKey();
    if (bepKey) {
        await DB.set(bepKey, {
            category: document.querySelector('input[name="loginLevel"]:checked')?.value || 'egit',
            conditions: [...document.querySelectorAll('.login-cond:checked')].map(c => c.value),
        });
    }
    if (saveBtn) saveBtn.disabled = false;
    if (statusEl) statusEl.textContent = '';
    activeStudentId = student.id;
    activeStudentName = student.name;
    childName = student.name;
    onAuthSuccessWithStudent(student);
    if (!existing) maybeStartFirstPractice();
}

function goToLogin() {
    try { window.speechSynthesis.cancel(); } catch(_){}
    showOnly('login-screen');
    loadStudents().then(renderLoginStudents);
}

async function backFromStudentProfile() {
    const students = await loadStudents();
    const student = students[0];
    if (student) {
        activeStudentId = student.id;
        activeStudentName = student.name;
        childName = student.name;
        onAuthSuccessWithStudent(student);
    }
}

// =============================================
// ANALİZ / BEP EKRANI
// =============================================
const BEP_CATEGORY_LABELS = {
    get ogreti() { return t('bep_cat_ogreti'); },
    get egit() { return t('bep_cat_egit'); },
    get destekli() { return t('bep_cat_destekli'); },
};
const BEP_CONDITION_LABELS = {
    get osb() { return t('bep_cond_osb'); },
    get dehb() { return t('bep_cond_dehb'); },
    get dil() { return t('bep_cond_dil'); },
    get down() { return t('bep_cond_down'); },
    get cp() { return t('bep_cond_cp'); },
    get oog() { return t('bep_cond_oog'); },
    get ekolali() { return t('bep_cond_ekolali'); },
    get stereotipik() { return t('bep_cond_stereotipik'); },
};

function goToAnalysis(tab) {
    requireAdultGate(async () => {
        showOnly('analysis-screen');
        await switchReportTab(tab || 'analysis');
    });
}

async function switchReportTab(tab) {
    const isReport = tab === 'report';
    document.getElementById('repTabAnalysis')?.classList.toggle('active', !isReport);
    document.getElementById('repTabParent')?.classList.toggle('active', isReport);
    const analysisPanel = document.getElementById('analysisTabPanel');
    const reportPanel = document.getElementById('reportTabPanel');
    if (analysisPanel) analysisPanel.style.display = isReport ? 'none' : '';
    if (reportPanel) reportPanel.style.display = isReport ? '' : 'none';
    if (isReport) await _populateReportTab();
    else await _populateAnalysisTab();
}

async function _populateAnalysisTab() {
    document.querySelectorAll('.az-card').forEach(c => c.classList.add('az-loading'));
    const insightEl = document.getElementById('azInsightText');
    if (insightEl) insightEl.innerHTML = `
        <div class="skel-line skel-full skeleton"></div>
        <div class="skel-line skel-med skeleton"></div>
        <div class="skel-line skel-short skeleton"></div>`;
    const userId = await getCurrentUserId();
    const profile = userId ? (await DB.get('bep_profile_' + userId) || {}) : {};
    const history = await loadReportHistory();
    document.querySelectorAll('.az-card').forEach(c => c.classList.remove('az-loading'));
    _renderAzIdentityCard(profile);
    _renderAzMetrics(history);
    _renderAzTrend(history);
}

// Geriye dönük uyumluluk — eski cagrilar dogrudan Veli Ozeti sekmesini acar
function goToReport() { return goToAnalysis('report'); }

function _renderAzTrend(history) {
    const card = document.getElementById('azTrendCard');
    const host = document.getElementById('azTrendChart');
    if (!card || !host) return;

    const points = [...history].reverse()
        .map(h => {
            const total = (h.micUsedInTherapy || 0) + (h.cardUsedInTherapy || 0);
            if (total === 0) return null;
            return {
                dateKey: h.dateKey,
                pct: Math.round(((h.micUsedInTherapy || 0) / total) * 100)
            };
        })
        .filter(Boolean)
        .slice(-20);

    if (points.length < 2) { card.style.display = 'none'; return; }
    card.style.display = '';

    const W = 640, H = 240;
    const PAD = { top: 24, right: 20, bottom: 34, left: 40 };
    const iw = W - PAD.left - PAD.right;
    const ih = H - PAD.top - PAD.bottom;
    const x = i => PAD.left + (points.length === 1 ? iw / 2 : (i / (points.length - 1)) * iw);
    const y = pct => PAD.top + (1 - pct / 100) * ih;

    const locale = _lang === 'en' ? 'en-US' : 'tr-TR';
    const fmtDate = dk => new Date(dk + 'T12:00:00').toLocaleDateString(locale, { day: 'numeric', month: 'short' });

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.pct).toFixed(1)}`).join(' ');
    const gridLines = [0, 50, 100].map(v =>
        `<line x1="${PAD.left}" y1="${y(v)}" x2="${W - PAD.right}" y2="${y(v)}" stroke="#e8ecf4" stroke-width="1"/>
         <text x="${PAD.left - 8}" y="${y(v) + 4}" text-anchor="end" font-size="11" fill="#8a93a8">%${v}</text>`
    ).join('');

    const markers = points.map((p, i) =>
        `<circle cx="${x(i).toFixed(1)}" cy="${y(p.pct).toFixed(1)}" r="4"
            fill="#6C63FF" stroke="#fff" stroke-width="2" data-idx="${i}"/>`
    ).join('');

    const first = points[0], last = points[points.length - 1];
    const endLabels = `
        <text x="${x(0).toFixed(1)}" y="${(y(first.pct) - 10).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="700" fill="#4a5578">%${first.pct}</text>
        <text x="${x(points.length - 1).toFixed(1)}" y="${(y(last.pct) - 10).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="700" fill="#4a5578">%${last.pct}</text>`;

    const xLabels = `
        <text x="${x(0).toFixed(1)}" y="${H - 10}" text-anchor="start" font-size="11" fill="#8a93a8">${fmtDate(first.dateKey)}</text>
        <text x="${x(points.length - 1).toFixed(1)}" y="${H - 10}" text-anchor="end" font-size="11" fill="#8a93a8">${fmtDate(last.dateKey)}</text>`;

    host.innerHTML = `
        <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${t('analysis_trend_title')}" style="width:100%;height:auto;display:block">
            ${gridLines}
            <path d="${linePath}" fill="none" stroke="#6C63FF" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
            ${markers}
            ${endLabels}
            ${xLabels}
        </svg>`;

    const tbl = document.getElementById('azTrendTable');
    if (tbl) {
        tbl.innerHTML = `<table class="az-trend-table">
            <thead><tr><th>${t('analysis_trend_col_date')}</th><th>${t('analysis_trend_col_pct')}</th></tr></thead>
            <tbody>${points.map(p => `<tr><td>${fmtDate(p.dateKey)}</td><td>%${p.pct}</td></tr>`).join('')}</tbody>
        </table>`;
    }

    const tooltip = document.getElementById('azTrendTooltip');
    const svg = host.querySelector('svg');
    if (!tooltip || !svg) return;

    function showTip(clientX) {
        const rect = svg.getBoundingClientRect();
        const relX = (clientX - rect.left) / rect.width * W;
        let best = 0, bestDist = Infinity;
        points.forEach((p, i) => {
            const d = Math.abs(x(i) - relX);
            if (d < bestDist) { bestDist = d; best = i; }
        });
        const p = points[best];
        tooltip.textContent = `${fmtDate(p.dateKey)} • %${p.pct}`;
        tooltip.style.display = 'block';
        const cardRect = host.getBoundingClientRect();
        const px = (x(best) / W) * rect.width + rect.left - cardRect.left;
        tooltip.style.left = Math.max(4, Math.min(px - 45, cardRect.width - 95)) + 'px';
        tooltip.style.top = ((y(p.pct) / H) * rect.height - 38) + 'px';
        svg.querySelectorAll('circle').forEach((c, i) => c.setAttribute('r', i === best ? '6' : '4'));
    }
    function hideTip() {
        tooltip.style.display = 'none';
        svg.querySelectorAll('circle').forEach(c => c.setAttribute('r', '4'));
    }
    svg.addEventListener('pointermove', e => showTip(e.clientX));
    svg.addEventListener('pointerdown', e => showTip(e.clientX));
    svg.addEventListener('pointerleave', hideTip);
}

function _renderAzIdentityCard(profile) {
    const nameEl = document.getElementById('azStudentName');
    const tagsEl = document.getElementById('azStudentTags');
    const metaEl = document.getElementById('azSessionMeta');

    if (nameEl) nameEl.textContent = activeStudentName || t('student_fallback');

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
        const now = new Date().toLocaleDateString(_lang === 'en' ? 'en-US' : 'tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
        metaEl.textContent = `${t('analysis_date_label')} ${now}`;
    }
}

function _renderAzMetrics(history) {
    // Aggregate across all sessions
    let totalMicSum = 0, totalCard = 0, totalRepeat = 0, totalSimplify = 0;
    history.forEach(h => {
        totalMicSum += (h.micUsedInTherapy || 0);
        totalCard += (h.cardUsedInTherapy || 0);
        totalRepeat += (h.repeatUsed || 0);
        totalSimplify += (h.simplifyUsed || 0);
    });
    const total = totalMicSum + totalCard + totalRepeat + totalSimplify;

    const indPct = total > 0 ? Math.round((totalMicSum / total) * 100) : null;
    const cardPct = total > 0 ? Math.round((totalCard / total) * 100) : null;
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
    setMetric('azCardPct', 'azCardBar', cardPct);
    setMetric('azRepeatPct', 'azRepeatBar', repPct);
    setMetric('azSimplifyPct', 'azSimplifyBar', simPct);

    const insightEl = document.getElementById('azInsightText');
    if (insightEl) {
        if (!history.length) {
            insightEl.textContent = t('analysis_no_data');
        } else if (indPct === null) {
            insightEl.textContent = t('analysis_collecting').replace('{n}', history.length);
        } else {
            const name = activeStudentName || (_lang === 'en' ? 'Student' : 'Öğrenci');
            if (_lang === 'en') {
                insightEl.textContent = t('analysis_summary')
                    .replace('{name}', name).replace('{n}', history.length).replace('{ind}', indPct)
                    .replace('{rep}', repPct ? t('analysis_summary_rep').replace('{pct}', repPct) : '')
                    .replace('{sim}', simPct ? t('analysis_summary_sim').replace('{pct}', simPct) : '');
            } else {
                insightEl.textContent = `${name}, son ${history.length} seansta %${indPct} oranında tamamen bağımsız konuştu` +
                    (repPct ? `, %${repPct} oranında tekrar dinlemeye` : '') +
                    (simPct ? ` ve %${simPct} oranında dili basitleştirmeye` : '') +
                    ' ihtiyaç duydu.';
            }
            if (cardPct) {
                insightEl.textContent += ' ' + t('analysis_summary_card').replace('{pct}', cardPct);
            }
        }
    }

    // Store for BEP report use
    window._azMetrics = { totalMicSum, totalCard, totalRepeat, totalSimplify, total, indPct, cardPct, repPct, simPct, sessionCount: history.length };
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
        ogreti: t('bep_cat_ogreti'),
        egit: t('bep_cat_egit'),
        destekli: t('bep_cat_destekli')
    };
    const conditionBehaviors = _lang === 'en' ? {
        ekolali: 'verbal repetition patterns observed',
        stereotipik: 'repetitive movement patterns observed',
        dehb: 'difficulty with attention span and impulse control observed',
        dil: 'needs support in language and speech development',
        down: 'needs individualized support in cognitive and language development',
        cp: 'needs motor coordination support',
        oog: 'receiving support for specific learning difficulty'
    } : {
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
        `• ${formatHistoryDate(h.dateKey)}: ${h.durationMin} dk, ${h.totalTurns} yanıt, ${h.micUsedInTherapy || 0} bağımsız mikrofon, ${h.cardUsedInTherapy || 0} kartla yanıt, ${h.repeatUsed || 0} tekrar, ${h.simplifyUsed || 0} basitleştirme`
    ).join('\n') || 'Kayıtlı seans verisi yok.';

    const m = window._azMetrics || {};
    const metricsText = m.total > 0
        ? `İletişim Bağımsızlığı: %${m.indPct} (bağımsız mikrofon kullanımı)\nTekrar Dinleme İhtiyacı: %${m.repPct}\nDil Adaptasyon İhtiyacı: %${m.simPct}`
        : 'Metrik verisi henüz toplanmamış.';

    const systemPrompt = _lang === 'en'
        ? `You are an IEP (Individualized Education Program) draft-writing assistant working for special education institutions. Your task is to turn raw interaction data into an observation-focused draft text that can serve as input to the IEP. This draft cannot be used as an official document before being reviewed by the authorized IEP team.

WRITING RULES:
1. Do not use "Medical Model" language. Use "Social Model" language: focus on community participation, peer interaction and social adaptation.
2. If the student has "Echolalia" or "Stereotypic movement", emphasize the AI's dampening and independence-building effect.
3. Write observable, performance-focused sentences. Never use "definitive diagnosis" or "official diagnosis" phrasing.
4. Write in English. Keep it between 300-400 words.`
        : `Sen özel eğitim kurumları için çalışan bir BEP (Bireyselleştirilmiş Eğitim Programı) taslak hazırlama asistanısın. Görevin, ham etkileşim verilerini BEP'e girdi olabilecek gözlem odaklı bir taslak metne dönüştürmektir. Bu taslak yetkili BEP ekibi tarafından incelenmeden resmi belge olarak kullanılamaz.

YAZIM KURALLARI:
1. "Tıbbi Model" dili kullanma. "Sosyal Model" dilini esas al: toplumsal katılım, akran etkileşimi ve sosyal uyum odaklı yaz.
2. Eğer öğrencide "Ekolali" veya "Stereotipik hareket" varsa, yapay zekanın sönümlendirme ve bağımsızlaştırma etkisini vurgula.
3. Gözlemlenebilir, performans odaklı cümleler kur. "Kesin tanı" veya "resmi teşhis" ifadesi kullanma.
4. Türkçe yaz. 300-400 kelime arası tut.`;

    const userPrompt = _lang === 'en'
        ? `Create an IEP Periodic Progress Draft using the profile, independence metrics and session data below:

STUDENT PROFILE:
${profileText}

COMMUNICATION INDEPENDENCE METRICS (total of ${m.sessionCount || history.length} sessions):
${metricsText}

RECENT SESSIONS (${Math.min(history.length, 10)} sessions):
${sessionText}

Start the draft with the heading "📝 IEP Periodic Progress Draft". Include these sections: 1) Student Level and Observation Summary, 2) Communication Independence Progress (interpret the metrics), 3) Observed Strengths, 4) Recommendations for the Next Period. Use concrete numbers when explaining the metrics.`
        : `Aşağıdaki profil, bağımsızlık metrikleri ve seans verilerini kullanarak bir BEP Dönemsel Gelişim Taslağı oluştur:

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
            headers: { 'Content-Type': 'application/json', ...apiAuthHeaders() },
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
// WINDOW EXPORTS (YENİ)
// =============================================
window.goToLogin = goToLogin;
window.exitSetEmailModal = exitSetEmailModal;
window.submitSetEmailModal = submitSetEmailModal;
window.selectLoginEmoji = selectLoginEmoji;
window.createStudentFromLogin = createStudentFromLogin;
window.backFromStudentProfile = backFromStudentProfile;
window.goToAnalysis = goToAnalysis;
window.generateBepReport = generateBepReport;
window.copyBepReport = copyBepReport;
