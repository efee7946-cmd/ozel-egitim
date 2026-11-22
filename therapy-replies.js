// Konuşma pratiği hazır cevapları. reply-engine.js bu veriyi kullanır.
// Yapı:
//   lex      sözlükler. Girdi "görünen|kök1|kök2". "=kök" yalnızca tam kelimeyle eşleşir.
//   generic  bütün sorularda ortak cevaplar
//   q        soru başına: m (örnek cevap: w kelime, s cümle, e emoji, f devam sorusu),
//            simple (basitleştirilmiş soru), i (cevap grupları, sırayla denenir),
//            open (her cevap kabul), neg (olumsuz cümleyi ayrı karşıla), fb (sabit geri dönüş)
//   Cevap grubu: lex veya k (kelimeler), s (cümle cevapları), e (emoji), w (kelime seviyesi),
//            f (anlat bakalım seviyesinde devam sorusu), min/max (en az eşleşme / en çok kelime)
// {W}: çocuğun söylediği ve sözlükte tanınan kelime. {Wc}: büyük harfle başlayan hâli. {NAME}: öğrencinin adı.
// Her metin bir yetişkin tarafından okunup onaylanmalı. Değişiklikten sonra:
//   node --test tools/reply-engine.test.js
(function (root) {
    'use strict';

    const lex = { tr: {}, en: {} };

    /* ===================== TÜRKÇE SÖZLÜKLER ===================== */
    Object.assign(lex.tr, {
        PROFANITY: ['=siktir', '=sikerim', '=siktim', '=amk', '=aq', '=amına', '=amina', '=oç', '=oc', 'orospu', '=piç', '=pic',
            'yavşak', '=göt', '=götü', '=götveren', 'şerefsiz', 'pezevenk', 'ibne', 'gerizekalı', 'salak', 'aptal', '=mal',
            '=lan', 'kahretsin', 'kahrolsun', 'dangalak', 'hıyar', '=puşt', '=it', 'köpoğlu'],
        DONT_KNOW: ['bilmiyorum', 'bilmiyom', '=bilmem', 'bilemedim', 'bilemiyorum', 'hatırlamıyorum', 'emin değilim', 'fikrim yok', 'hiç bilmiyorum'],
        YES: ['evet', '=he', '=hıhı', '=hı', '=oldu', 'tabii', '=tabi', '=olur', '=var', '=vardı'],
        NO: ['hayır', '=yok', '=yoktu', 'olmadı', '=hiç', 'hiçbir şey', '=hiçbiri'],
        GREETING: ['günaydın|günaydin|günaydınnn', 'merhaba|meraba|merhabalar|mrb', 'selam|selamlar|slm', 'hoş geldin|hoşgeldin|hoş geldiniz|hoşgeldiniz',
            'nasılsın|nasılsınız', 'naber|ne haber', '=hey', 'iyi günler', 'iyi akşamlar'],
        GOODBYE: ['hoşça kalın|hoşça kal|hoşçakal|hoşçakalın', 'güle güle', 'görüşürüz|görüşmek üzere|yarın görüşürüz', 'iyi günler', 'iyi akşamlar',
            'bay bay|=bay|=bye|=baybay|=bb', 'iyi geceler'],
        WAVE: ['el sallamak|el sallar|el salla|salla|sallarım'],
        THANKS: ['teşekkür ederim|teşekkür|teşekkürler|tşk|tesekkur', 'sağ ol|sağol|sağolun|sağ olun', '=mersi'],
        SORRY: ['özür dilerim|özür|özr', 'pardon|pardın', 'kusura bakma|kusura', 'affedersin|affedersiniz|affet'],
        PLEASE: ['lütfen|lutfen|lütfennn', 'rica etsem|rica'],
        HELP: ['yardım eder misin|yardım|yardim|yardımcı', 'bana yardım'],
        FAMILY: ['annen|anne|annem|anneme|anneci|annecim|=ana|=anam', 'baban|baba|babam|babama|babacım', 'kardeşin|kardeş', 'ablan|abla', 'abin|=abi|=abim|=abime|ağabey',
            'deden|dede', 'ninen|nine|nene|babaanne|anneanne', 'teyzen|teyze', 'halan|=hala|=halam|=halama', 'amcan|amca', 'dayın|dayı', 'kuzenin|kuzen', 'ailen|aile'],
        TEACHER: ['öğretmenin|öğretmen|ögretmen|hoca'],
        FRIEND: ['arkadaşın|arkadaş|arkadas|kanka'],
        ANIMALS: ['kedi|kedim|pisi', 'köpek|köpeğim|kuçu', 'kuş|kuşum|muhabbet kuşu', 'balık', 'tavşan', 'hamster', 'kaplumbağa', 'papağan',
            'kuzu', 'civciv', 'ördek', 'aslan', 'zürafa', '=fil', 'maymun', 'penguen', 'dinozor', 'at|=at|=atı|=atlar', 'inek', 'yunus'],
        FOOD: ['ekmek', 'peynir', 'yumurta', 'zeytin', '=bal', 'reçel', 'tereyağı', 'simit', 'poğaça', 'makarna', 'pilav', 'köfte', 'tavuk',
            'çorba', 'pizza', 'hamburger', 'patates kızartması|patates|kızartma', 'mantı', 'börek', 'sucuk', 'domates', 'salatalık', 'menemen',
            'omlet', 'tost|sandviç', 'lahmacun', 'döner', 'pide', 'yoğurt', 'pankek|krep', 'kek', 'pasta', 'sebze', 'et|=et|=eti', 'balık', 'kuru fasulye|fasulye',
            'nohut', 'mercimek', 'karnıyarık', 'dolma|sarma', 'kahvaltı', 'yemek'],
        FRUIT: ['elma', 'muz', 'armut', 'portakal', 'mandalina', 'çilek', 'üzüm', 'karpuz', 'kavun', 'kiraz', 'şeftali', 'kayısı', '=nar', 'erik', 'ananas', 'kivi', 'meyve'],
        DRINK: ['meyve suyu|meyve suyu|meyvesuyu', 'süt|=süt|=sütü|sütlü', '=su|=suyu|=suyum|=sular', 'ayran', 'kakao', 'limonata', 'çay', 'ıhlamur', 'boza'],
        SNACK: ['çikolata', 'cips', 'gofret', 'bisküvi', 'kraker', 'kurabiye', 'dondurma', 'şeker|şekerleme', 'lolipop', 'patlamış mısır|mısır', 'kuruyemiş|fındık|fıstık|ceviz|leblebi',
            'kek', 'sakız', 'puding|muhallebi|sütlaç', 'kek'],
        HUNGRY: ['acıktım|acık|acıkt|acıkıyorum', 'karnım aç|karnım|karnım acıktı', '=açım', 'yemek istiyorum|yemek ister', 'yiyebilir miyim|yiyebilir', '=mama'],
        TOYS: ['oyuncak ayı|ayıcık|ayıcığım|=ayı|peluş|pelüş', 'araba|arabam|arabalar|oyuncak araba', 'bebek|bebeğim|bebekler', 'lego|legolar', 'top|=top|=topum|=topu|=topa',
            'robot', 'tren', 'uçak', 'dinozor', 'kamyon|tır|itfaiye arabası', 'yapboz|yap boz|puzzle|bulmaca', 'kukla', 'oyun hamuru|hamur|slime|slaym',
            'blok|bloklar|küp', 'uçurtma', 'balon', 'bebek arabası', 'oyuncak|oyuncaklar|oyuncaklarım'],
        GAMES: ['saklambaç|saklambac|saklanbaç|saklan', 'kovalamaca|kovala|ebelemece|ebelemeç|yakalamaç', 'top oynamak|top oyna|=top|=topu|=topla|=topa',
            'salıncak|salıncağ|sallan', 'kaydırak|kaydırağ|kaydır', 'tahterevalli', 'ip atlama|ip atla', 'seksek', 'körebe', 'yakan top|yakar top|yakartop',
            'kum oyunu|=kum|=kumda|kumla', 'bisiklet', 'scooter|skuter|paten|kaykay', 'lego', 'yapboz|yap boz|puzzle', 'kutu oyunu|kutu oyun|kart oyunu|=kart',
            'evcilik', 'tırmanmak|tırman', 'futbol|maç', 'basketbol|basket', 'dans|dans etmek', 'bebek oyunu|bebek|bebekler', 'araba oyunu|araba|arabalarla',
            'resim|boyama', 'mendil kapmaca', 'istop', 'satranç', 'dama', 'tablet oyunu|tablet|telefon|bilgisayar|minecraft|roblox|playstation', 'oyun oynamak|=oyun|=oyunlar|oynamak|oynamayı|oyun oyna'],
        SPORTS: ['futbol|maç', 'basketbol|basket', 'voleybol|voley', 'yüzme|yüzmek|yüzer|havuz', 'koşu|koşmak|koşar', 'bisiklet', 'tenis|masa tenisi',
            'jimnastik|cimnastik', 'dans|bale', 'karate|tekvando|taekwondo|judo|güreş|boks', 'kayak', 'paten|kaykay|scooter', 'atletizm',
            'okçuluk', 'binicilik|ata binmek|at binmek', 'yoga', 'tırmanma|tırman', 'satranç', 'hentbol', 'ip atlama'],
        TV: ['çizgi film|çizgi', 'televizyon|=tv|televizyon izlemek', 'film izlemek|=film'],
        BOOK: ['masal|masal dinlemek', 'kitap|kitap okumak', 'hikâye|hikaye'],
        MUSIC: ['müzik|müzik dinlemek', 'şarkı|şarkı söylemek', 'dans|dans etmek'],
        DRAW: ['resim yapmak|resim|boya|boyama|çizmek|çiz'],
        HUG: ['sarılmak|sarıl|sarılır|sarılsın|kucak', 'öpmek|öp|öpücük'],
        CARTOON: ['Pepee|pepe|pepee', 'Rafadan Tayfa|rafadan', 'Kral Şakir|şakir', 'Niloya', 'Keloğlan', 'Elif ve Arkadaşları|elif ve', 'Maşa ile Koca Ayı|maşa|masha',
            'Peppa Pig|peppa', 'Paw Patrol|paw patrol|patrol|köpek devriyesi', 'Bluey|bluy', 'Örümcek Adam|örümcek|spiderman|spider', 'Batman',
            'Süpermen|superman', 'Karlar Ülkesi|elsa|frozen', 'Arabalar|şimşek|cars', 'Sünger Bob|sünger|spongebob', 'Tom ve Jerry|tom ve|jerry',
            'Pokemon|pokemon|pikaçu|pikachu', 'Caillou|kayu', 'Dora', 'Barbie|barbi', 'Minyonlar|minyon', 'Ninja Kaplumbağalar|ninja', 'Cocomelon|kokomelon',
            'Kukuli', 'Sonic|sonik', 'Mickey Mouse|miki|mickey', 'Arı Maya|arı maya', 'Ben 10|ben ten', 'Oggy|oggi', 'Pırıl', 'Akıllı Tavşan Momo|momo',
            'Kare Kare', 'Aslan Kral', 'Buz Devri', 'Oyuncak Hikayesi|toy story'],
        SCHOOL_ITEMS: ['çanta|çantam|çantamı', 'kalem|kalemim', 'defter', 'silgi', 'kitap', 'kalemlik', 'boya kalemi|boya|pastel|keçeli', 'cetvel', 'makas',
            'yapıştırıcı|tutkal', 'beslenme|beslenme çantası|yemek kabı', 'su şişesi|matara|suluk|=su|=suyumu', 'kalemtıraş|açacak', 'mont|ceket', 'önlük'],
        ROOM_ITEMS: ['yatak|yatağım', 'masa|masam', 'sandalye', 'dolap', 'kitap|kitaplar', 'boya kalemleri|boya|kalem', 'tablet', 'bilgisayar', 'televizyon|=tv',
            'lamba|gece lambası', 'yastık', 'battaniye', 'halı', 'oyuncak sepeti|oyuncak kutusu'],
        CLOTHES: ['kıyafet|kıyafetler|elbise|giysi', 'çorap|çoraplar', 'pijama', 'tişört|tshirt', 'pantolon', 'ayakkabı|ayakkabılar', 'kazak', 'mont|ceket', 'şapka'],
        MORNING: ['yüz yıkamak|yüzümü yıka|yüz yıka|yüzümü', 'diş fırçalamak|dişimi fırç|dişlerimi fırç|diş fırç|fırçala', 'kahvaltı', 'giyinmek|giyin|üstümü değiş',
            'tuvalete gitmek|tuvalet|çiş', 'yatağı toplamak|yatağımı topla|yatak topla', 'saç taramak|saçımı tara|saç tara', 'gerinmek|gerin|esne',
            'el yıkamak|elimi yıka|ellerimi yıka', 'su içmek|su iç', 'süt içmek|süt iç', 'uyanmak|uyanırım|kalkarım', 'pencereyi açmak|perde'],
        OUTGOING: ['ayakkabı giymek|ayakkabı|ayakkabımı', 'mont giymek|mont|ceket|montumu', 'giyinmek|giyin|elbise|kıyafet', 'çanta almak|çanta',
            'şapka takmak|şapka|bere|atkı|eldiven', 'saç taramak|saçımı tara|tara', 'tuvalete gitmek|tuvalet|çiş', 'el yıkamak|elimi yıka|ellerimi yıka',
            'su şişesi almak|su şişesi|matara', 'haber vermek|izin|haber ver|anneme söyle', 'diş fırçalamak|dişimi fırç', 'güneş kremi|krem'],
        BEDTIME: ['diş fırçalamak|diş fırç|dişimi|dişlerimi|fırçala', 'pijama giymek|pijama', 'tuvalete gitmek|tuvalet|çiş', 'masal dinlemek|masal|hikaye|hikâye|kitap',
            'el yüz yıkamak|yüzümü yıka|elimi yıka', 'banyo yapmak|banyo|duş', 'iyi geceler demek|iyi geceler', 'su içmek|su iç',
            'oyuncakları toplamak|oyuncaklarımı topla|toplarım', 'ışığı kapatmak|ışık|lamba', 'sarılmak|sarıl|öp', 'dua etmek|dua'],
        COLD: ['battaniye|battaniy|örtü|yorgan|pike', 'kazak|hırka|sweat', 'mont|ceket', 'çorap|terlik|patik', 'sıcak süt', 'sıcak su', 'sıcak çorba|çorba', 'sıcak çay|=çay|ıhlamur', 'sıcak bir şey|=sıcak', 'kalorifer|soba|ısıtıcı|klima', 'pencereyi kapatmak|pencere|kapat', 'sarılmak|sarıl'],
        FEEL_POS: ['mutlu|mutluyum', 'iyi|iyiyim', 'neşeli', 'sevinçli|sevindim|seviniyorum', 'harika', 'süper', 'çok güzel|=güzel', 'heyecanlı|heyecan', 'rahat|rahatım', 'enerjik|enerji'],
        FEEL_NEG: ['üzgün|üzüldüm|üzülüyorum|mutsuz|ağlıyorum|ağladım', 'kızgın|kızdım|=kızıyorum|sinirli|sinirlendim|öfkeli', 'korkmuş|korktum|korkuyorum|=korku',
            'yorgun|yoruldum|uykum|uykulu', 'sıkılmış|sıkıldım|sıkılıyorum|sıkkın', 'hasta|hastayım', 'kötü|kötüyüm'],
        CALM: ['derin nefes almak|derin nefes|nefes', 'sarılmak|sarıl', 'müzik dinlemek|müzik|şarkı', 'resim yapmak|resim|boya|çiz', 'oyun oynamak|oyna|=oyun|=oyunlar', 'odana gitmek|odama|odamda|tek başıma|yalnız kalmak|yalnız',
            'uyumak|uyu|dinlen|=yatarım', 'su içmek|su iç', 'saymak|sayı sayarım|sayarım', 'kitap okumak|kitap|masal', 'yürümek|yürü|dolaş', 'konuşmak|anlatırım|konuşurum',
            'çizgi film izlemek|çizgi film|izlerim', 'oyuncakla oynamak|oyuncak', 'sakinleşmek|sakin'],
        JOBS: ['doktor|doktır', 'öğretmen', 'polis', 'itfaiyeci|itfaiye', 'pilot', 'astronot', 'aşçı|şef', 'futbolcu|sporcu|basketbolcu', 'veteriner', 'hemşire',
            'mühendis', 'şoför', 'ressam', 'şarkıcı', 'dansçı|balerin', 'asker', 'bilim insanı|bilim adamı|bilimci', 'YouTuber|youtuber|yutuber', 'oyuncu|aktör',
            'kuaför', 'berber', 'çiftçi', 'marangoz', 'kaptan|denizci', 'diş doktoru|dişçi', 'avukat', 'hâkim|hakim', 'mimar', 'pastacı', 'fırıncı',
            'süper kahraman|kahraman', 'prenses', 'kraliçe|=kral', 'tamirci', 'bilgisayarcı|yazılımcı', 'garson', 'kasiyer', 'postacı'],
        POWER: ['uçmak|uçma|uçar|uçabil|uçmayı', 'görünmez olmak|görünmez', 'çok güçlü olmak|güçlü|kuvvetli', 'çok hızlı koşmak|çok hızlı|=hızlı|hız',
            'ışınlanmak|ışınla', 'sihir yapmak|sihir|büyü', 'insanlara yardım etmek|yardım', 'hayvanlarla konuşmak|hayvanlarla', 'zamanı durdurmak|zaman',
            'iyileştirmek|iyileştir', 'buz yapmak|=buz', 'ateş|alev'],
        PLACES: ['park|parka|parkta', 'deniz|denize|plaj|kumsal|sahil', 'havuz', 'orman', 'lunapark|luna park', 'hayvanat bahçesi|hayvanat', 'dede evi|dedem|ninem|anneannem|babaannem|köy',
            'AVM|avm|alışveriş merkezi|alışveriş', 'sinema', 'kamp', 'dağ|=dağa', 'göl', 'akvaryum', 'oyun parkı|top havuzu|oyun alanı', 'müze', 'kütüphane'],
        TRAVEL: ['İstanbul|istanbul', 'Ankara|ankara', 'İzmir|izmir', 'Antalya|antalya', 'Kapadokya|kapadokya', 'Paris|paris', 'Londra|londra', 'Amerika|amerika',
            'Almanya|almanya', 'Japonya|japonya', 'Mısır|piramit', 'Disneyland|disney', 'uzay|uzaya|=ay|=aya|mars', 'kutuplar|kutup', 'Afrika|safari',
            'deniz|denize|plaj', 'köy|köye', 'yurt dışı|yurtdışı', 'Karadeniz|karadeniz', 'Bodrum|bodrum'],
        ROOMS: ['kendi odan|odam|odamda|kendi odam|benim odam|yatak odası', 'salon|oturma odası|misafir odası', 'mutfak|mutfakta', 'banyo|banyoda', 'balkon', 'bahçe',
            'oyun odası', 'kardeşinin odası|kardeşimin'],
        TRANSPORT: ['yürüyerek|yürü|yayan', 'arabayla|=araba|=arabamızla|arabayla', 'servisle|servis', 'otobüsle|otobüs', 'metroyla|metro', 'tramvayla|tramvay',
            'bisikletle|bisiklet', 'minibüsle|minibüs|dolmuş', 'taksiyle|taksi', 'scooterla|scooter', 'motorla|motor', 'vapurla|vapur'],
        SUBJECTS: ['matematik|=mat|sayılar|toplama', 'Türkçe|türkçe', 'resim|boyama|çizim', 'müzik|şarkı', 'beden eğitimi|beden|=spor|jimnastik', 'hayat bilgisi|hayat',
            'fen bilimleri|=fen|deney', 'İngilizce|ingilizce', 'okuma|okumak|=kitap', 'yazı|yazmak', 'oyun saati|=oyun', 'bilgisayar', 'drama|tiyatro'],
        AGE: ['on dört|=14', 'on üç|=13', 'on iki|=12', 'on bir|=11', '=on|=10', 'iki|=2', '=üç|=3|=üçüm', 'dört|=4', 'beş|=5', 'altı|=6', 'yedi|=7', 'sekiz|=8', 'dokuz|=9'],
        GIFT: ['bisiklet', 'kitap', 'pasta', 'tablet', 'telefon', 'oyun konsolu|playstation', 'saat', 'boya seti|boya', 'lego', 'sürpriz', 'kıyafet|elbise',
            'paten|kaykay|scooter', 'balon']
    });

    /* ===================== ENGLISH LEXICONS ===================== */
    Object.assign(lex.en, {
        PROFANITY: ['=fuck', '=fucking', '=shit', '=bitch', '=damn', '=crap', '=stupid', '=idiot', '=dumb', '=ass', '=bastard', '=hell'],
        DONT_KNOW: ['dont know|i dont know|=idk|dunno', 'not sure', 'cant remember|dont remember', 'no idea'],
        YES: ['yes|=yeah|=yep|=yup|=uh huh|sure|=did'],
        NO: ['=no|=nope|=nothing|=didnt|=not'],
        GREETING: ['good morning|morning', 'hello|=hi|=hey|=hiya', 'welcome', 'how are you', 'good afternoon', 'good evening'],
        GOODBYE: ['goodbye|=bye|bye bye|=byebye', 'see you|see ya', 'good night', 'have a nice day', 'take care'],
        WAVE: ['wave|waving'],
        THANKS: ['thank you|thanks|thank|=thx|=ty'],
        SORRY: ['sorry|=sory', 'excuse me|excuse', 'my bad', 'pardon'],
        PLEASE: ['please|=pls|=plz'],
        HELP: ['help|helping|can you help'],
        FAMILY: ['mom|=mum|=mommy|=mummy|=mama|mother', 'dad|daddy|=papa|father', 'brother', 'sister', 'grandma|granny|nana|grandmother', 'grandpa|grandfather|=grampa',
            'aunt|auntie', 'uncle', 'cousin', 'family'],
        TEACHER: ['teacher|=miss|=mister'],
        FRIEND: ['friend|buddy|=pal'],
        ANIMALS: ['cat|=kitty|kitten', 'dog|puppy|doggy', 'bird', 'fish', 'rabbit|bunny', 'hamster', 'turtle', 'parrot', 'horse', 'lion', 'elephant', 'monkey', 'penguin', 'dinosaur', 'dolphin'],
        FOOD: ['bread', 'cheese', 'eggs|egg', 'pancakes|pancake', 'pasta|spaghetti|noodles', 'rice', 'chicken|nuggets', 'soup', 'pizza', 'burger|hamburger', 'fries|chips',
            'meatballs', 'sandwich|toast', 'cereal', 'yogurt', 'sausage|hot dog', 'tacos', 'fish', 'vegetables|veggies|carrots|broccoli', 'cake', 'breakfast', 'food'],
        FRUIT: ['apple', 'banana', 'pear', 'orange', 'strawberry|strawberries', 'grapes|grape', 'watermelon', 'cherry|cherries', 'peach', 'pineapple', 'kiwi', 'blueberries|berries', 'fruit'],
        DRINK: ['juice|apple juice|orange juice', 'milk', '=water', 'hot chocolate|cocoa', 'lemonade', 'tea', 'smoothie'],
        SNACK: ['chocolate', 'chips|crisps', 'cookies|cookie|biscuit', 'crackers|cracker', 'ice cream|icecream', 'candy|sweets', 'lollipop', 'popcorn', 'cake|cupcake', 'nuts', 'pudding', 'gummies|gummy'],
        HUNGRY: ['hungry|hungy', 'want food|want to eat|something to eat', 'can i eat|can i have', 'tummy'],
        TOYS: ['teddy bear|teddy|stuffed animal|plushie', 'car|cars|toy car', 'doll|dolls', 'lego|legos', 'ball', 'robot', 'train', 'plane|airplane', 'dinosaur', 'truck|fire truck',
            'puzzle', 'puppet', 'play dough|playdough|slime', 'blocks', 'kite', 'balloon', 'toy|toys'],
        GAMES: ['hide and seek|hide', 'tag|=chase', 'ball|football|soccer', 'swing|swings', 'slide', 'seesaw', 'jump rope|skipping', 'hopscotch', 'sandbox|sand',
            'bike|bicycle', 'scooter|skates|skateboard', 'lego|legos', 'puzzle|puzzles', 'board game|cards', 'pretend|house', 'climbing|climb', 'basketball', 'dance|dancing',
            'dolls', 'cars', 'drawing|painting', 'chess', 'video games|tablet|minecraft|roblox|playstation'],
        SPORTS: ['football|soccer', 'basketball', 'volleyball', 'swimming|swim', 'running|run', 'cycling|bike', 'tennis', 'gymnastics', 'dance|ballet', 'karate|judo|taekwondo',
            'skiing', 'skating|skateboard', 'baseball', 'yoga', 'climbing', 'chess', 'jump rope'],
        TV: ['cartoons|cartoon', 'tv|television', 'movie|movies'],
        BOOK: ['story|stories|bedtime story', 'book|books|reading'],
        MUSIC: ['music', 'singing|sing|song', 'dance|dancing'],
        DRAW: ['drawing|draw|painting|paint|coloring|colour'],
        HUG: ['hug|hugs|cuddle', 'kiss'],
        CARTOON: ['Bluey|bluey', 'Peppa Pig|peppa', 'Paw Patrol|paw patrol|patrol', 'Frozen|elsa', 'Spider-Man|spiderman|spider', 'Batman', 'Superman', 'Cars|lightning mcqueen',
            'SpongeBob|spongebob', 'Tom and Jerry|tom and jerry|jerry', 'Pokemon|pokemon|pikachu', 'Cocomelon|cocomelon', 'Masha and the Bear|masha', 'Minions|minion',
            'Sonic|sonic', 'Mickey Mouse|mickey', 'Toy Story|toy story', 'Dora', 'Barbie', 'Ninja Turtles|ninja', 'Ben 10', 'Paddington', 'Sesame Street|elmo'],
        SCHOOL_ITEMS: ['backpack|bag|schoolbag', 'pencil|pen', 'notebook', 'eraser|rubber', 'book', 'pencil case', 'crayons|markers|colors', 'ruler', 'scissors', 'glue',
            'lunch box|lunch|snack', 'water bottle|water', 'jacket|coat'],
        ROOM_ITEMS: ['bed', 'desk|table', 'chair', 'closet|wardrobe', 'books|book', 'crayons|pencils', 'tablet|ipad', 'computer', 'tv', 'lamp|night light', 'pillow', 'blanket', 'toy box'],
        CLOTHES: ['clothes', 'socks', 'pajamas|pyjamas', 'shirt|t-shirt', 'pants|trousers', 'shoes', 'sweater', 'jacket|coat', 'hat'],
        MORNING: ['wash my face|wash face|face', 'brush my teeth|brush teeth|teeth|brush', 'breakfast|eat', 'get dressed|dress|clothes', 'bathroom|toilet|potty|pee',
            'make my bed|make the bed', 'brush my hair|comb', 'stretch|yawn', 'wash my hands|hands', 'drink water|water', 'wake up|get up', 'say good morning|good morning'],
        OUTGOING: ['put on my shoes|shoes', 'put on my coat|coat|jacket', 'get dressed|dress|clothes', 'take my bag|bag|backpack', 'hat|scarf|gloves', 'brush my hair|comb',
            'go to the bathroom|bathroom|toilet|potty', 'wash my hands|hands', 'water bottle', 'tell mom|tell my mom|ask', 'sunscreen'],
        BEDTIME: ['brush my teeth|brush teeth|teeth', 'put on pajamas|pajamas|pyjamas', 'go to the bathroom|bathroom|toilet|potty', 'bedtime story|story|book', 'wash my face|wash',
            'take a bath|bath|shower', 'say good night|good night', 'drink water|water', 'tidy my toys|tidy|clean up', 'turn off the light|light|lamp', 'hug|kiss', 'pray'],
        COLD: ['blanket|blankie', 'sweater|hoodie|jumper', 'jacket|coat', 'socks|slippers', 'hot chocolate|warm milk|hot drink|warm|soup|tea', 'heater', 'close the window|window', 'hug|cuddle'],
        FEEL_POS: ['happy', 'good|great|fine|okay|=ok', 'excited', 'cheerful', 'awesome|amazing', 'calm|relaxed', 'energetic'],
        FEEL_NEG: ['sad|upset|crying|cried', 'angry|mad|grumpy', 'scared|afraid|worried|nervous', 'tired|sleepy', 'bored', 'sick|ill', 'bad'],
        CALM: ['take deep breaths|deep breath|breathe|breath', 'hug|cuddle', 'listen to music|music|song', 'drawing|draw|paint|color', 'play|game', 'sleep|rest|lie down',
            'drink water|water', 'count|counting', 'read a book|read|book|story', 'go for a walk|walk', 'talk|tell', 'watch cartoons|cartoon|tv', 'toy|toys'],
        JOBS: ['doctor', 'teacher', 'police officer|police|cop', 'firefighter|fireman', 'pilot', 'astronaut', 'chef|cook', 'football player|soccer player|athlete', 'vet|veterinarian',
            'nurse', 'engineer', 'driver|bus driver', 'artist|painter', 'singer', 'dancer|ballerina', 'soldier', 'scientist', 'YouTuber|youtuber', 'actor|actress',
            'hairdresser', 'farmer', 'builder', 'captain|sailor', 'dentist', 'lawyer', 'baker', 'superhero|hero', 'princess', 'king|queen', 'mechanic', 'programmer'],
        POWER: ['fly|flying', 'invisible|invisibility', 'super strong|strong|strength', 'super fast|fast|speed', 'teleport', 'magic', 'help people|help', 'talk to animals',
            'freeze time|time', 'heal|healing', 'ice', 'fire'],
        PLACES: ['park', 'beach|sea|seaside', 'pool', 'forest|woods', 'amusement park|funfair', 'zoo', 'grandma|grandpa|grandparents', 'mall|shopping', 'cinema|movies', 'camping',
            'mountains|mountain', 'lake', 'aquarium', 'playground', 'museum', 'library'],
        TRAVEL: ['Paris|paris', 'London|london', 'America|america|usa', 'Japan|japan', 'Egypt|pyramids', 'Disneyland|disney', 'space|moon|mars', 'Istanbul|istanbul',
            'Turkey|turkey', 'Africa|safari', 'beach|sea', 'North Pole|arctic', 'Australia|australia', 'Italy|italy', 'Spain|spain'],
        ROOMS: ['my room|bedroom', 'living room|lounge', 'kitchen', 'bathroom', 'balcony', 'garden|yard', 'playroom', "brother's room|sister's room"],
        TRANSPORT: ['walking|walk|on foot', 'car', 'school bus|bus', 'subway|metro|train', 'tram', 'bike|bicycle', 'taxi', 'scooter'],
        SUBJECTS: ['math|maths|numbers', 'reading', 'writing', 'art|drawing', 'music', 'PE|=pe|gym|sports', 'science', 'English|english', 'Turkish|turkish', 'computers', 'drama', 'play time|playtime'],
        AGE: ['fourteen|=14', 'thirteen|=13', 'twelve|=12', 'eleven|=11', 'ten|=10', '=two|=2', 'three|=3', 'four|=4', 'five|=5', '=six|=6', 'seven|=7', 'eight|=8', 'nine|=9'],
        GIFT: ['bike|bicycle', 'book', 'cake', 'tablet|ipad', 'phone', 'video game|playstation|nintendo|switch', 'watch', 'paints|crayons', 'lego', 'surprise', 'dress|clothes',
            'scooter|skates', 'balloons']
    });

    /* ===================== ORTAK CEVAPLAR ===================== */
    const generic = {
        tr: {
            praise: ['Süper', 'Harika', 'Aferin', 'Çok güzel', 'Bravo', 'Mükemmel'],
            praiseNamed: ['Aferin {NAME}', 'Bravo {NAME}', 'Süper {NAME}'],
            fallbackPraise: ['Anlattığın için teşekkürler!', 'Seni dinlemek çok güzel!', 'Bunu bana anlattığın için teşekkür ederim!'],
            modelIntro: ['Şöyle diyebiliriz:', 'Bir fikir:', 'Mesela:'],
            redirectIntro: ['Hadi şöyle söyleyelim:', 'Şöyle diyelim:'],
            echoIntro: ['Şimdi sıra sende! Mesela:', 'Sen de şöyle diyebilirsin:'],
            dontKnow: ['Sorun değil!', 'Hiç sorun değil!', 'Olsun, birlikte düşünelim.'],
            negAck: ['Tamam, anladım! 👍', 'Peki, anladım! 👍'],
            notHeard: ['Seni tam duyamadım, bir daha söyler misin? 🎤'],
            nextHint: ['Hadi sıradaki soruya geçelim! ➡️', 'Şimdi yeni bir soruya geçelim! ➡️']
        },
        en: {
            praise: ['Super', 'Great', 'Well done', 'Nice', 'Bravo', 'Awesome'],
            praiseNamed: ['Well done {NAME}', 'Great job {NAME}', 'Super {NAME}'],
            fallbackPraise: ['Thank you for telling me!', 'I love listening to you!', 'Thanks for sharing that with me!'],
            modelIntro: ['We can say:', 'An idea:', 'For example:'],
            redirectIntro: ["Let's say it like this:", 'We can say:'],
            echoIntro: ['Now your turn! For example:', 'You can say:'],
            dontKnow: ["That's okay!", 'No problem!', "Let's think together."],
            negAck: ['Okay, got it! 👍', 'Alright, I understand! 👍'],
            notHeard: ["I couldn't hear you well, can you say it again? 🎤"],
            nextHint: ["Let's go to the next question! ➡️", "Time for a new question! ➡️"]
        }
    };

    const negation = {
        tr: {
            words: ['yok', 'hayır', 'değil', 'değilim', 'istemem', 'istemiyorum', 'sevmem', 'sevmiyorum', 'olmaz', 'hiç', 'hiçbir', 'hiçbirini', 'hiçbiri'],
            endings: ['mem', 'mam', 'miyorum', 'mıyorum', 'muyorum', 'müyorum'],
            except: ['tamam', 'hamam', 'madem'],
            // Bu kelimelerle başlayan sözcüklere yazım hatası toleransı uygulanmaz
            stop: ['sever', 'seviyo', 'sevdi', 'isterim', 'istiyo', 'istedi', 'oynar', 'oynuyo', 'yapar', 'yapıyo', 'yapiyo', 'gider', 'gidiyo',
                'yerim', 'yiyo', 'içer', 'icer', 'derim', 'diyo', 'bence', 'benim', 'bende', 'sonra', 'çünkü', 'cunku', 'şimdi', 'simdi']
        },
        en: {
            words: ['no', 'not', 'dont', 'never', 'nothing', 'hate', 'doesnt', 'didnt', 'nope'],
            endings: [],
            except: [],
            stop: ['like', 'love', 'want', 'play', 'think', 'because', 'really', 'going']
        }
    };

    /* ===================== YARDIMCILAR ===================== */
    const L = (names, s, e, x) => Object.assign({ lex: [].concat(names), s, e }, x || {});
    const K = (words, s, e, x) => Object.assign({ k: words, s, e }, x || {});
    const E = (m, simple, i, x) => Object.assign({ m: { w: m[0], s: m[1], e: m[2], f: m[3] }, simple, i }, x || {});

    /* ===================== SORULAR ===================== */
    const q = {};
    const set = (ids, tr, en) => [].concat(ids).forEach(id => { q[id] = { tr, en }; });

    // ---------- GÜNLÜK YAŞAM ----------
    set('therapy_daily_life_q1',
        E(['Yüzümü yıkarım!', 'Ben sabah önce yüzümü yıkarım.', '🌞', 'Ya sen ne yaparsın?'], 'Sabah ilk ne yaparsın?', [
            L('MORNING', ['{Wc}, çok güzel bir başlangıç!', 'Sabah {W}, harika bir alışkanlık!'], '🌞', { f: 'Sonra ne yaparsın?' }),
            L(['GREETING', 'FAMILY'], ['Sabah ailene günaydın demek çok güzel!'], '👋', { f: 'Sonra ne yaparsın?' })
        ]),
        E(['I wash my face!', 'In the morning I wash my face first.', '🌞', 'What do you do?'], 'What do you do first in the morning?', [
            L('MORNING', ['{Wc}, a great way to start the day!', 'Nice, {W} is a great habit!'], '🌞', { f: 'What do you do next?' }),
            L(['GREETING', 'FAMILY'], ['Saying good morning to your family is lovely!'], '👋', { f: 'What do you do next?' })
        ]));

    set('therapy_daily_life_q2',
        E(['Çantamı!', 'Ben okula çantamı ve kalemimi alırım.', '🎒', 'Sen ne alırsın?'], 'Okula ne götürürsün?', [
            L('SCHOOL_ITEMS', ['{Wc}, okulda çok işine yarar!', '{Wc} almak çok iyi fikir!'], '🎒', { f: 'Başka ne alırsın?' }),
            L(['FOOD', 'FRUIT', 'SNACK'], ['Beslenmen için {W}, çok güzel!'], '🍎', { f: 'Başka ne alırsın?' })
        ]),
        E(['My backpack!', 'I take my backpack and my pencil to school.', '🎒', 'What do you take?'], 'What do you take to school?', [
            L('SCHOOL_ITEMS', ['A {W} is very useful at school!', 'Taking a {W} is a great idea!'], '🎒', { f: 'What else do you take?' }),
            L(['FOOD', 'FRUIT', 'SNACK'], ['A {W} for your snack, yummy!'], '🍎', { f: 'What else do you take?' })
        ]));

    const hungryTr = E(['Acıktım!', 'Anne, acıktım, yemek istiyorum.', '🍽️', 'Sen ne yemek istersin?'], 'Karnın acıkınca ne dersin?', [
        L('HUNGRY', ['Çok güzel, “Acıktım” demek tam doğru!', 'Evet, “Karnım aç” diyebilirsin!'], '🍽️', { w: ['Evet, acıktım!', 'Aynen öyle!'], f: 'Ne yemek istersin?' }),
        L(['FOOD', 'FRUIT', 'SNACK', 'DRINK'], ['“{Wc} istiyorum” demek çok güzel!', '{Wc}, güzel seçim! “Acıktım, {W} istiyorum” diyebilirsin.'], '😋', { f: 'Bunu kime söylersin?' }),
        L('PLEASE', ['“Lütfen” demen çok kibar!'], '🙏', { f: 'Ne yemek istersin?' })
    ]);
    const hungryEn = E(["I'm hungry!", "Mom, I'm hungry, can I have some food?", '🍽️', 'What would you like to eat?'], 'What do you say when you are hungry?', [
        L('HUNGRY', ["Great, saying “I'm hungry” is just right!", 'Yes, you can say “My tummy is hungry!”'], '🍽️', { w: ["Yes, I'm hungry!", 'Exactly!'], f: 'What would you like to eat?' }),
        L(['FOOD', 'FRUIT', 'SNACK', 'DRINK'], ['Saying “I want {W}” is great!', '{Wc}, good choice! You can say “I am hungry, can I have {W}?”'], '😋', { f: 'Who do you tell?' }),
        L('PLEASE', ['Saying “please” is so polite!'], '🙏', { f: 'What would you like to eat?' })
    ]);
    set(['therapy_daily_life_q3', 'city_home_q2'], hungryTr, hungryEn);

    set('therapy_daily_life_q4',
        E(['Elma!', 'Ben markette elma almak isterim.', '🍎', 'Sen ne almak istersin?'], 'Markette ne almak istersin?', [
            L(['FRUIT', 'SNACK', 'DRINK', 'FOOD', 'TOYS'], ['{Wc}, güzel seçim!', 'Oo, {W}! Çok güzel.'], '🛒', { f: 'Başka ne alırsın?' })
        ], { neg: true }),
        E(['An apple!', 'At the store I want to get an apple.', '🍎', 'What do you want to get?'], 'What do you want at the store?', [
            L(['FRUIT', 'SNACK', 'DRINK', 'FOOD', 'TOYS'], ['{Wc}, good choice!', 'Ooh, {W}! Lovely.'], '🛒', { f: 'What else would you get?' })
        ], { neg: true }));

    const eveningTr = E(['Oyun oynamak!', 'Ben akşam ailemle oyun oynamayı severim.', '🏠', 'Sen akşam ne yaparsın?'], 'Akşam evde ne seversin?', [
        L('TV', ['Akşam çizgi film izlemek çok keyifli!'], '📺', { f: 'Hangisini izlersin?' }),
        L('BOOK', ['Akşam masal dinlemek çok güzel!'], '📖', { f: 'Hangi masalı seversin?' }),
        L('FAMILY', ['Ailenle vakit geçirmek çok güzel!'], '👨‍👩‍👧', { f: 'Birlikte ne yaparsınız?' }),
        L(['GAMES', 'TOYS'], ['{Wc}, çok eğlenceli!', 'Oo, {W}! Harika.'], '🧸', { f: 'Kiminle oynarsın?' }),
        L(['FOOD', 'SNACK', 'FRUIT'], ['{Wc}, çok lezzetli!'], '😋', { f: 'Başka ne seversin?' }),
        L(['DRAW', 'MUSIC'], ['{Wc}, çok güzel bir uğraş!'], '🎨', { f: 'Başka ne seversin?' }),
        K(['banyo|banyo yapmak|köpük'], ['Akşam banyosu çok rahatlatır!'], '🛁')
    ], { open: true, neg: true });
    const eveningEn = E(['Playing games!', 'In the evening I like playing games with my family.', '🏠', 'What do you do in the evening?'], 'What do you like at home in the evening?', [
        L('TV', ['Watching cartoons in the evening is so fun!'], '📺', { f: 'Which one do you watch?' }),
        L('BOOK', ['A bedtime story is lovely!'], '📖', { f: 'Which story do you like?' }),
        L('FAMILY', ['Spending time with your family is lovely!'], '👨‍👩‍👧', { f: 'What do you do together?' }),
        L(['GAMES', 'TOYS'], ['{Wc}, so much fun!', 'Ooh, {W}! Great.'], '🧸', { f: 'Who do you play with?' }),
        L(['FOOD', 'SNACK', 'FRUIT'], ['{Wc}, yummy!'], '😋', { f: 'What else do you like?' }),
        L(['DRAW', 'MUSIC'], ['{Wc}, what a nice thing to do!'], '🎨', { f: 'What else do you like?' }),
        K(['bath|bubbles'], ['An evening bath is so relaxing!'], '🛁')
    ], { open: true, neg: true });
    set(['therapy_daily_life_q5', 'city_home_q4'], eveningTr, eveningEn);

    set('therapy_daily_life_q6',
        E(['Ayakkabı giyerim!', 'Ben önce ayakkabımı ve montumu giyerim.', '👟', 'Sen ne yaparsın?'], 'Dışarı çıkmadan önce ne giyersin?', [
            L('OUTGOING', ['{Wc}, çok iyi bir hazırlık!', 'Önce {W}, harika!'], '👟', { f: 'Sonra ne yaparsın?' }),
            L('CLOTHES', ['{Wc} giymek çok iyi bir hazırlık!'], '👕', { f: 'Sonra ne yaparsın?' })
        ]),
        E(['Put on my shoes!', 'First I put on my shoes and my coat.', '👟', 'What do you do?'], 'What do you put on before going out?', [
            L('OUTGOING', ['{Wc}, great getting ready!', 'First {W}, well done!'], '👟', { f: 'What do you do next?' }),
            L('CLOTHES', ['Putting on {W} is a great way to get ready!'], '👕', { f: 'What do you do next?' })
        ]));

    set('therapy_daily_life_q7',
        E(['Oyuncaklarım!', 'Ben odamda en çok oyuncaklarımı kullanırım.', '🧸', 'Sen neyi kullanırsın?'], 'Odanda en çok neyi kullanırsın?', [
            L(['TOYS', 'ROOM_ITEMS'], ['{Wc}, çok güzel bir eşya!', '{Wc}, demek onu çok kullanıyorsun!'], '🛏️', { f: 'Onunla ne yaparsın?' })
        ]),
        E(['My toys!', 'In my room I use my toys the most.', '🧸', 'What do you use?'], 'What do you use most in your room?', [
            L(['TOYS', 'ROOM_ITEMS'], ['A {W}, what a nice thing!', '{Wc}, so you use it a lot!'], '🛏️', { f: 'What do you do with it?' })
        ]));

    set('therapy_daily_life_q8',
        E(['Ellerimi yıkarım!', 'Yemekten önce ellerimi sabunla yıkarım.', '🧼', 'Sen ne yaparsın?'], 'Yemekten önce ellerini ne yaparsın?', [
            K(['el yıkamak|yıka|yıkarım|yıkıyorum|yıkamak|yıkadım'], ['Evet, ellerimizi sabunla yıkarız!', 'Harika, el yıkamak çok önemli!'], '🧼', { w: ['Evet, yıkarız!', 'Aynen öyle!'], f: 'Sonra ellerini neyle kurularsın?' }),
            K(['sabun|sabunla|köpük'], ['Evet, sabunla yıkarız, çok güzel!'], '🧼', { f: 'Sonra ellerini neyle kurularsın?' }),
            K(['=su|=suyla|=suya|=suyu'], ['Evet, su ve sabunla yıkarız!'], '💧', { f: 'Sonra ellerini neyle kurularsın?' }),
            K(['havlu|kurula'], ['Havluyla kurulamak da çok önemli! Önce de sabunla yıkarız.'], '🧼')
        ]),
        E(['I wash my hands!', 'Before eating I wash my hands with soap.', '🧼', 'What do you do?'], 'What do you do with your hands before eating?', [
            K(['wash|washing|clean'], ['Yes, we wash our hands with soap!', 'Great, washing hands is so important!'], '🧼', { w: ['Yes, we wash!', 'Exactly!'], f: 'What do you dry them with?' }),
            K(['soap|bubbles'], ['Yes, we wash with soap, great!'], '🧼', { f: 'What do you dry them with?' }),
            K(['=water'], ['Yes, we wash with water and soap!'], '💧', { f: 'What do you dry them with?' }),
            K(['towel|dry'], ['Drying with a towel is important too! First we wash with soap.'], '🧼')
        ]));

    const guestTr = E(['Hoş geldiniz!', 'Misafire “Hoş geldiniz” derim.', '🏠', 'Sonra ne söylersin?'], 'Misafir gelince ne dersin?', [
        K(['hoş geldin|hoşgeldin|hoş geldiniz|hoşgeldiniz|hoşgeldinizz'], ['“Hoş geldiniz” demek çok kibar!', 'Harika, “Hoş geldiniz” çok güzel!'], '🏠', { w: ['Harika, hoş geldiniz!'], f: 'Sonra ne söylersin?' }),
        L('GREETING', ['“{Wc}” demek çok güzel!'], '👋', { f: 'Bir de “Hoş geldiniz” diyebilirsin!' }),
        L('WAVE', ['El sallamak çok tatlı! “Hoş geldiniz” de diyebilirsin.'], '👋')
    ]);
    const guestEn = E(['Welcome!', 'I say “Welcome!” to our guests.', '🏠', 'What do you say next?'], 'What do you say when guests come?', [
        K(['welcome|come in'], ['Saying “Welcome” is so polite!', 'Great, “Welcome” is lovely!'], '🏠', { f: 'What do you say next?' }),
        L('GREETING', ['Saying “{Wc}” is lovely!'], '👋', { f: 'You can also say “Welcome!”' }),
        L('WAVE', ['Waving is sweet! You can also say “Welcome!”'], '👋')
    ]);
    set(['therapy_daily_life_q9', 'city_home_q6'], guestTr, guestEn);

    set('therapy_daily_life_q10',
        E(['Annem!', 'Bugün bana annem yardım etti.', '🤝', 'Sana nasıl yardım etti?'], 'Bugün sana kim yardım etti?', [
            K(['=kimse|hiç kimse|kimse yardım'], ['Anladım. Yarın birinden yardım isteyebilirsin!'], '🤝'),
            K(['=kendim|kendi kendime|tek başıma'], ['Kendin yapmışsın, aferin!'], '💪', { f: 'Neyi kendin yaptın?' }),
            L(['FAMILY', 'TEACHER', 'FRIEND'], ['{Wc} sana yardım etmiş, ne güzel!', 'Çok güzel, {W} yardım etmiş!'], '🤝', { f: 'Sana nasıl yardım etti?' })
        ]),
        E(['My mom!', 'Today my mom helped me.', '🤝', 'How did they help you?'], 'Who helped you today?', [
            K(['nobody|no one|=noone'], ['I see. Tomorrow you can ask someone for help!'], '🤝'),
            K(['myself|by myself|=me'], ['You did it yourself, well done!'], '💪', { f: 'What did you do by yourself?' }),
            L(['FAMILY', 'TEACHER', 'FRIEND'], ['Your {W} helped you, how nice!', 'Lovely, your {W} helped!'], '🤝', { f: 'How did they help you?' })
        ]));

    // ---------- DUYGULAR ----------
    const feelTr = E(['Mutluyum!', 'Bugün kendimi mutlu hissediyorum.', '😊', 'Sen nasıl hissediyorsun?'], 'Bugün nasılsın?', [
        K(['iyi değil|mutlu değil|=değilim|pek iyi'], ['Söylediğin için teşekkürler. Yanındayım!'], '🤗', { f: 'Seni ne rahatlatır?' }),
        L('FEEL_NEG', ['{Wc} hissettiğini söylemen çok güzel.', 'Bunu bana söylediğin için teşekkürler.'], '🤗', { f: 'Seni ne rahatlatır?' }),
        L('FEEL_POS', ['{Wc} hissetmene çok sevindim!', 'Ne güzel, {W} hissediyorsun!'], '😊', { f: 'Seni ne mutlu etti?' })
    ]);
    const feelEn = E(["I'm happy!", 'Today I feel happy.', '😊', 'How do you feel?'], 'How are you today?', [
        K(['not good|not happy|not okay|not great'], ['Thank you for telling me. I am here with you!'], '🤗', { f: 'What helps you feel better?' }),
        L('FEEL_NEG', ['Thank you for telling me you feel {W}.', 'It is good that you told me.'], '🤗', { f: 'What helps you feel better?' }),
        L('FEEL_POS', ['I am so glad you feel {W}!', 'How nice, you feel {W}!'], '😊', { f: 'What made you happy?' })
    ]);
    set('therapy_emotions_q1', feelTr, feelEn);

    set('therapy_emotions_q2',
        E(['Oyun oynamak!', 'Beni en hızlı oyun oynamak mutlu eder.', '😊', 'Seni ne mutlu eder?'], 'Seni ne mutlu eder?', [
            L('HUG', ['Sarılmak herkesi mutlu eder!'], '🤗', { f: 'En çok kime sarılırsın?' }),
            L(['FAMILY', 'FRIEND', 'TEACHER'], ['{Wc} seni mutlu ediyor, ne güzel!'], '💛', { f: 'Birlikte ne yaparsınız?' }),
            L(['GAMES', 'TOYS', 'SPORTS', 'TV', 'CARTOON', 'MUSIC', 'DRAW', 'BOOK', 'ANIMALS', 'FOOD', 'SNACK', 'FRUIT'], ['{Wc} seni mutlu ediyor, harika!', 'Oo, {W}! Ne güzel.'], '🎉', { f: 'Başka ne seni mutlu eder?' })
        ], { open: true, neg: true }),
        E(['Playing games!', 'Playing games makes me happy the fastest.', '😊', 'What makes you happy?'], 'What makes you happy?', [
            L('HUG', ['Hugs make everyone happy!'], '🤗', { f: 'Who do you hug the most?' }),
            L(['FAMILY', 'FRIEND', 'TEACHER'], ['Your {W} makes you happy, how lovely!'], '💛', { f: 'What do you do together?' }),
            L(['GAMES', 'TOYS', 'SPORTS', 'TV', 'CARTOON', 'MUSIC', 'DRAW', 'BOOK', 'ANIMALS', 'FOOD', 'SNACK', 'FRUIT'], ['{Wc} makes you happy, great!', 'Ooh, {W}! Lovely.'], '🎉', { f: 'What else makes you happy?' })
        ], { open: true, neg: true }));

    const sadNearTr = E(['Annem!', 'Üzülünce annem yanımda olsun isterim.', '🤗', 'Sen kimi istersin?'], 'Üzülünce kimi istersin?', [
        L('HUG', ['Sarılmak çok iyi gelir!'], '🤗', { f: 'Kime sarılmak istersin?' }),
        K(['elimi tutsun|el tut|elimi'], ['Birinin elini tutması çok iyi gelir!'], '🤝', { f: 'Kim elini tutsun?' }),
        L(['FAMILY', 'TEACHER', 'FRIEND'], ['{Wc} yanında olunca iyi gelir, değil mi?'], '🤗', { f: 'Sana ne söylesin?' }),
        L(['TOYS', 'ANIMALS'], ['Sevdiğin {W} yanında olunca iyi gelir!'], '🧸', { f: 'Başka ne iyi gelir?' })
    ]);
    const sadNearEn = E(['My mom!', 'When I am sad I want my mom next to me.', '🤗', 'Who do you want?'], 'Who do you want when you are sad?', [
        L('HUG', ['A hug really helps!'], '🤗', { f: 'Who do you want to hug?' }),
        K(['hold my hand|hold hands|hand'], ['Holding someone’s hand really helps!'], '🤝', { f: 'Who should hold your hand?' }),
        L(['FAMILY', 'TEACHER', 'FRIEND'], ['It helps when your {W} is with you, right?'], '🤗', { f: 'What should they say to you?' }),
        L(['TOYS', 'ANIMALS'], ['Your favorite {W} close by really helps!'], '🧸', { f: 'What else helps?' })
    ]);
    set('therapy_emotions_q3', sadNearTr, sadNearEn);

    const bodyExciteTrLex = ['kalbin hızlı atar|kalp|kalbim|=küt|hızlı atar', 'ellerin terler|terle|=ter|=terler', 'karnın kıpır kıpır olur|karnım|kıpır|mide|kelebek',
        'titrersin|titre', 'yanakların kızarır|kızarır|yanak', 'zıplamak istersin|zıpla|hopla', 'nefesin hızlanır|nefes', 'gülümsersin|gülerim|gülümser|gülüm'];
    set('therapy_emotions_q4',
        E(['Kalbim hızlı atar!', 'Heyecanlanınca kalbim hızlı atar.', '💓', 'Senin bedeninde ne olur?'], 'Heyecanlanınca ne olur?', [
            K(bodyExciteTrLex, ['Evet, heyecanlanınca {W}!', 'Aynen öyle, heyecanlanınca {W}!'], '💓', { w: ['Evet, aynen öyle!', 'Çok doğru!'], f: 'Sonra nasıl sakinleşirsin?' }),
            L('FEEL_POS', ['Heyecan güzel bir duygu! Bedenin de bunu hisseder.'], '💓', { f: 'Kalbin nasıl atar?' })
        ]),
        E(['My heart beats fast!', 'When I get excited my heart beats fast.', '💓', 'What happens in your body?'], 'What happens when you are excited?', [
            K(['heart beats fast|heart|fast', 'hands get sweaty|sweat|sweaty', 'butterflies in my tummy|butterflies|tummy', 'shake|shaky', 'cheeks go red|red|cheeks', 'want to jump|jump', 'breathe fast|breath', 'smile|giggle'],
                ['Yes, when we get excited our {W}!', 'Exactly, that happens when we are excited!'], '💓', { w: ['Yes, exactly!', 'So true!'], f: 'How do you calm down after?' })
        ]));

    set('therapy_emotions_q5',
        E(['Anneme!', 'Korkunca anneme haber veririm.', '🛡️', 'Sen kime söylersin?'], 'Korkunca kime söylersin?', [
            K(['=kimse|hiç kimse|=kimseye'], ['Korkunca bir büyüğe söylemek çok önemli! Annene ya da öğretmenine söyleyebilirsin.'], '🛡️'),
            L(['FAMILY', 'TEACHER'], ['{Wc} sana hemen yardım eder!', 'Evet, {W} sana yardım eder!'], '🛡️', { f: 'Ona ne söylersin?' }),
            K(['polis|doktor|büyük|büyüğe'], ['Evet, bir büyüğe söylemek çok doğru!'], '🛡️', { f: 'Ona ne söylersin?' })
        ]),
        E(['My mom!', 'When I am scared I tell my mom.', '🛡️', 'Who do you tell?'], 'Who do you tell when scared?', [
            K(['nobody|no one'], ['When you are scared it is important to tell a grown-up, like your mom or teacher!'], '🛡️'),
            L(['FAMILY', 'TEACHER'], ['Your {W} will help you right away!', 'Yes, your {W} will help you!'], '🛡️', { f: 'What do you say to them?' }),
            K(['police|doctor|grown up|adult'], ['Yes, telling a grown-up is just right!'], '🛡️', { f: 'What do you say to them?' })
        ]));

    set('therapy_emotions_q6',
        E(['Mutlu!', 'Arkadaşım beni sevindirince mutlu hissederim.', '😊', 'Sen ne hissedersin?'], 'Arkadaşın seni sevindirince ne hissedersin?', [
            L('THANKS', ['Teşekkür etmek çok güzel!'], '🙏', { f: 'Sen de onu nasıl sevindirirsin?' }),
            L('HUG', ['Sarılmak çok tatlı!'], '🤗', { f: 'Sen de onu nasıl sevindirirsin?' }),
            L('FEEL_POS', ['{Wc} hissetmen çok güzel!', 'Ne güzel, {W} hissediyorsun!'], '😊', { f: 'Sen de ona ne dersin?' })
        ]),
        E(['Happy!', 'When my friend makes me happy, I feel happy.', '😊', 'How do you feel?'], 'How do you feel when a friend makes you happy?', [
            L('THANKS', ['Saying thank you is lovely!'], '🙏', { f: 'How do you make them happy too?' }),
            L('HUG', ['A hug is so sweet!'], '🤗', { f: 'How do you make them happy too?' }),
            L('FEEL_POS', ['Feeling {W} is wonderful!', 'How nice, you feel {W}!'], '😊', { f: 'What do you say to them?' })
        ]));

    set('therapy_emotions_q7',
        E(['Derin nefes!', 'Canım sıkılınca derin nefes alırım.', '😌', 'Sen ne yaparsın?'], 'Canın sıkılınca ne yaparsın?', [
            K(['ağlarım|ağlıyorum|=ağla|ağlamak'], ['Ağlamak da olur. Sonra derin nefes almak iyi gelir.'], '🤗', { f: 'Kim sana sarılsın?' }),
            K(['kızarım|bağırırım|=vururum|kırarım|=atarım'], ['Bu duyguyu hissetmek normal. Derin nefes almak çok iyi gelir!'], '😌', { f: 'Seni ne rahatlatır?' }),
            L('CALM', ['{Wc} çok iyi bir fikir!', '{Wc} insanı rahatlatır, harika!'], '😌', { f: 'Başka ne seni rahatlatır?' }),
            L(['GAMES', 'TOYS', 'TV', 'CARTOON', 'DRAW', 'MUSIC'], ['{Wc}, çok iyi bir fikir!'], '😌', { f: 'Başka ne seni rahatlatır?' }),
            L('FAMILY', ['{Wc} ile konuşmak çok iyi gelir!'], '🤗', { f: 'Başka ne seni rahatlatır?' })
        ]),
        E(['Deep breaths!', 'When I feel bored or upset I take deep breaths.', '😌', 'What do you do?'], 'What do you do to calm down?', [
            K(['cry|crying'], ['It is okay to cry. Then taking deep breaths helps.'], '🤗', { f: 'Who should give you a hug?' }),
            L('CALM', ['{Wc} is a great idea!', '{Wc} really helps, great!'], '😌', { f: 'What else helps you?' }),
            L(['GAMES', 'TOYS', 'TV', 'CARTOON', 'DRAW', 'MUSIC'], ['{Wc}, a great idea!'], '😌', { f: 'What else helps you?' })
        ]));

    set('therapy_emotions_q8',
        E(['Evet, oldu!', 'Bugün bahçede bir kelebek gördüm, çok şaşırdım!', '😮', 'Seni ne şaşırttı?'], 'Bugün seni şaşırtan bir şey oldu mu?', [
            L('YES', ['Ooo, ne oldu? Anlatır mısın?'], '😮', { w: ['Ooo, ne oldu?'], max: 2 }),
            L('NO', ['Olsun! Belki yarın bir sürpriz olur.'], '😊', { max: 3 })
        ], { fb: { s: ['Anlattığın için teşekkürler! Sonra ne oldu?'], w: ['Teşekkürler!'], e: '😮' } }),
        E(['Yes!', 'Today I saw a butterfly in the garden. I was so surprised!', '😮', 'What surprised you?'], 'Did anything surprise you today?', [
            L('YES', ['Ooh, what happened? Can you tell me?'], '😮', { w: ['Ooh, what happened?'], max: 2 }),
            L('NO', ['That is okay! Maybe there will be a surprise tomorrow.'], '😊', { max: 3 })
        ], { fb: { s: ['Thank you for telling me! What happened next?'], w: ['Thank you!'], e: '😮' } }));

    set('therapy_emotions_q9',
        E(['Sakin konuşurum!', 'Kızınca sakin ve yavaş konuşurum.', '🤫', 'Sen nasıl konuşursun?'], 'Kızınca nasıl konuşmalısın?', [
            K(['sakin|sakince|yavaş|yavaşça|alçak ses|=alçak|kısık|=bağırmam|=bağırmamak|=bağırmadan|=bağırmayız|kibar|kibarca|nazik|nefes', 'kızgınım demek|kızgınım|=sinirliyim'],
                ['Harika! Sakin ve yavaş konuşmak en iyisi.', 'Evet! Bağırmadan, sakin konuşuruz.'], '🤫', { w: ['Evet, sakin konuşuruz!'], f: 'Sakinleşmek için ne yaparsın?' }),
            K(['bağır|=bağırırım|=bağırıyorum|=bağırmak'], ['Kızınca bağırmak isteyebiliriz. Ama sakin konuşmak daha iyi!'], '🤫', { w: ['Sakin konuşalım!'] })
        ]),
        E(['I talk calmly!', 'When I am angry I talk slowly and calmly.', '🤫', 'How do you talk?'], 'How should you talk when angry?', [
            K(['calm|calmly|slow|slowly|quiet|quietly|soft|softly|nicely|kind|dont shout|no shouting|breathe', 'say i am angry|im angry|i am mad'],
                ['Great! Talking slowly and calmly is best.', 'Yes! We talk calmly, without shouting.'], '🤫', { w: ['Yes, calmly!'], f: 'What helps you calm down?' }),
            K(['shout|yell|scream'], ['We may want to shout when angry. But talking calmly works better!'], '🤫', { w: ['Let’s talk calmly!'] })
        ]));

    set('therapy_emotions_q10',
        E(['Gülümseriz!', 'Mutlu olunca gülümseriz.', '😄', 'Bana gülümser misin?'], 'Mutlu olunca yüzün ne yapar?', [
            K(['gülümseriz|gülümse|gülümser|gülüm|gülerim|güleriz|güler|=gülüyor|tebessüm|sırıt|gülücük', 'gözlerimiz parlar|göz', 'yanaklarımız kızarır|yanak', 'dişlerimiz görünür|diş'],
                ['Evet, mutlu olunca {W}!', 'Çok doğru, mutlu olunca {W}!'], '😄', { w: ['Evet, gülümseriz!'], f: 'Sen bana gülümser misin?' }),
            L('FEEL_POS', ['Evet! Mutlu olunca yüzümüz güler.'], '😄', { f: 'Sen bana gülümser misin?' })
        ]),
        E(['We smile!', 'When we are happy we smile.', '😄', 'Can you smile at me?'], 'What does your face do when happy?', [
            K(['smile|smiling|grin|laugh|giggle', 'eyes shine|eyes', 'cheeks|rosy', 'teeth'], ['Yes, our face lights up when we are happy!', 'So true, we smile when we are happy!'], '😄', { w: ['Yes, we smile!'], f: 'Can you smile at me?' }),
            L('FEEL_POS', ['Yes! Our face smiles when we are happy.'], '😄', { f: 'Can you smile at me?' })
        ]));

    // ---------- SOSYAL İLETİŞİM ----------
    set('therapy_social_communication_q1',
        E(['Merhaba, hadi oynayalım!', 'Arkadaşıma “Merhaba, hadi oynayalım!” derim.', '👋', 'Sonra ne söylersin?'], 'Arkadaşına nasıl selam verirsin?', [
            K(['oynayalım mı|oynayalım|hadi oyna|gel oyna|oynar mısın'], ['Harika! “Hadi oynayalım” demek çok güzel.'], '👋', { f: 'Ne oynamak istersin?' }),
            L('GREETING', ['“{Wc}” demek çok güzel!', 'Harika, “{Wc}” diyerek selam verebilirsin!'], '👋', { f: 'Sonra ne söylersin?' }),
            L('WAVE', ['El sallamak da çok güzel bir selam!'], '👋', { f: 'Bir de “Merhaba” diyebilirsin!' })
        ]),
        E(["Hi, let's play!", "I say “Hi, let's play!” to my friend.", '👋', 'What do you say next?'], 'How do you say hi to a friend?', [
            K(["let's play|lets play|wanna play|want to play|play with me"], ["Great! Saying “Let's play” is lovely."], '👋', { f: 'What do you want to play?' }),
            L('GREETING', ['Saying “{Wc}” is lovely!', 'Great, you can say “{Wc}”!'], '👋', { f: 'What do you say next?' }),
            L('WAVE', ['Waving is a lovely hello too!'], '👋', { f: 'You can also say “Hi!”' })
        ]));

    const notUnderstoodTr = E(['Anlamadım!', 'Öğretmenim, anlamadım. Tekrar eder misiniz?', '🙋', 'Sonra öğretmenin ne yapar?'], 'Anlamayınca öğretmene ne dersin?', [
        K(['parmak kaldırırım|parmak|el kaldır|elimi kaldır'], ['Harika! Parmak kaldırıp “Anlamadım” diyebilirsin.'], '✋', { f: 'Sonra ne dersin?' }),
        K(['anlamadım|anlamad|anlamıyorum|anlayamadım|anlamadim', 'tekrar eder misiniz|tekrar|bir daha', 'açıklar mısınız|açıkla', 'soru sorarım|=sorarım|soru'],
            ['Çok güzel! “Anlamadım, tekrar eder misiniz?” diyebilirsin.', 'Harika, öğretmene sormak çok doğru!'], '🙋', { w: ['Harika, aynen öyle!'], f: 'Sonra öğretmenin ne yapar?' }),
        L('HELP', ['Harika, yardım istemek çok önemli!'], '🙋', { f: 'Öğretmenine nasıl seslenirsin?' }),
        L('DONT_KNOW', ['Evet, “Bunu bilmiyorum, yardım eder misiniz?” diyebilirsin.'], '🙋')
    ]);
    const notUnderstoodEn = E(["I don't understand!", "Teacher, I don't understand. Can you say it again?", '🙋', 'What does your teacher do then?'], 'What do you say when you do not understand?', [
        K(['raise my hand|raise hand|hand up'], ["Great! Raise your hand and say “I don't understand.”"], '✋', { f: 'What do you say then?' }),
        K(['dont understand|do not understand|didnt get|confused', 'say it again|again|repeat', 'explain', 'ask'],
            ["Great! You can say “I don't understand, can you say it again?”", 'Yes, asking your teacher is just right!'], '🙋', { w: ['Yes, exactly!'], f: 'What does your teacher do then?' }),
        L('HELP', ['Great, asking for help is so important!'], '🙋', { f: 'How do you call your teacher?' }),
        L('DONT_KNOW', ["Yes, you can say “I don't know, can you help me?”"], '🙋')
    ]);
    set(['therapy_social_communication_q2', 'city_school_q3'], notUnderstoodTr, notUnderstoodEn);

    const joinTr = E(['Ben de oynayabilir miyim?', 'Arkadaşıma “Ben de oynayabilir miyim?” derim.', '🤝', 'Arkadaşın “evet” derse ne dersin?'], 'Oyuna katılmak için ne dersin?', [
        K(['oynayabilir miyim|oynayabilirmiyim|ben de oyna|katılabilir miyim|katıl|ben de|bende oyna|bende'], ['Çok güzel! “Ben de oynayabilir miyim?” diye sorabilirsin.', 'Harika, kibarca sormak çok güzel!'], '🤝', { w: ['Harika, aynen öyle!'], f: 'Arkadaşın “evet” derse ne dersin?' }),
        K(['birlikte|beraber|oynayalım mı|oynayalım'], ['Harika! “Birlikte oynayalım mı?” demek çok güzel.'], '🤝', { f: 'Arkadaşın “evet” derse ne dersin?' }),
        L('PLEASE', ['“Lütfen” demen çok kibar! “Ben de oynayabilir miyim?” diyebilirsin.'], '🙏')
    ]);
    const joinEn = E(['Can I play too?', 'I ask my friend “Can I play too?”', '🤝', 'If your friend says yes, what do you say?'], 'What do you say to join a game?', [
        K(['can i play|play too|can i join|join|me too'], ['Great! You can ask “Can I play too?”', 'Lovely, asking nicely is great!'], '🤝', { w: ['Yes, exactly!'], f: 'If your friend says yes, what do you say?' }),
        K(['together|play with you|lets play|let\'s play'], ['Great! “Can we play together?” is lovely.'], '🤝', { f: 'If your friend says yes, what do you say?' }),
        L('PLEASE', ['Saying “please” is so polite! You can ask “Can I play too?”'], '🙏')
    ]);
    set(['therapy_social_communication_q3', 'city_school_q4'], joinTr, joinEn);

    set('therapy_social_communication_q4',
        E(['İyi misin?', 'Arkadaşıma “İyi misin? Yardım edeyim mi?” derim.', '🤗', 'Sonra ne yaparsın?'], 'Arkadaşın üzgünse ne dersin?', [
            K(['iyi misin|iyimisin|ne oldu|neyin var|üzülme|ağlama|geçecek|geçer|yanındayım|buradayım', 'yardım edeyim mi|yardım', 'sarılayım mı|sarıl', 'benimle oyna|oynayalım mı'],
                ['Çok güzel! Arkadaşını düşünmen harika.', 'Ne kadar nazik! Arkadaşın buna sevinir.'], '🤗', { w: ['Ne kadar nazik!'], f: 'Sonra ne yaparsın?' })
        ]),
        E(['Are you okay?', 'I say “Are you okay? Can I help you?”', '🤗', 'What do you do next?'], 'What do you say to a sad friend?', [
            K(['are you okay|you ok|are you alright|what happened|whats wrong|dont be sad|dont cry|it will be okay|im here', 'can i help|help', 'hug', 'play with me|lets play'],
                ['Lovely! Caring for your friend is wonderful.', 'So kind! Your friend will feel better.'], '🤗', { w: ['So kind!'], f: 'What do you do next?' })
        ]));

    const waitTr = E(['Sakin beklerim!', 'Sıramı sakin sakin beklerim.', '⏳', 'Sıra sana gelince ne yaparsın?'], 'Sıranı beklerken ne yaparsın?', [
        K(['beklerim|bekle|beklemek|=beklerim|beklerken', 'sakin dururum|sakin|sessiz|uslu', 'sıramı beklerim|=sıra|sırayla|sıram|sıramı', '=itmem|itmeden|araya girmem|kaynak yapmam|=itmeyiz', 'sabırlı|sabır', 'arkada dururum|arkada|arkasında'],
            ['Harika! Sıramızı sakin bekleriz.', 'Aferin, sabırla beklemek çok güzel!'], '⏳', { w: ['Aferin, sakin bekleriz!'], f: 'Sıra sana gelince ne yaparsın?' }),
        K(['=iterim|öne geçerim|araya girerim|kaynak yaparım'], ['Hmm, öne geçmeyiz. Sıramızı sakin bekleriz!'], '⏳')
    ]);
    const waitEn = E(['I wait calmly!', 'I wait for my turn calmly.', '⏳', 'What do you do when it is your turn?'], 'What do you do while waiting?', [
        K(['wait|waiting', 'calm|quiet|still', 'my turn|take turns|line', 'dont push|no pushing|dont cut', 'patient', 'stand behind|behind'],
            ['Great! We wait for our turn calmly.', 'Well done, waiting patiently is lovely!'], '⏳', { w: ['Yes, we wait calmly!'], f: 'What do you do when it is your turn?' }),
        K(['=push|cut in|go first'], ['Hmm, we don’t push. We wait for our turn calmly!'], '⏳')
    ]);
    set(['therapy_social_communication_q5', 'city_market_q4', 'city_park_q4'], waitTr, waitEn);

    set('therapy_social_communication_q6',
        E(['Özür dilerim!', '“Özür dilerim, iyi misin?” derim.', '🙏', 'Sonra ne yaparsın?'], 'Birine çarparsan ne dersin?', [
            L('SORRY', ['Harika! “{Wc}” demek çok kibar.', 'Aferin, “{Wc}” demek çok güzel!'], '🙏', { f: 'Sonra ne yaparsın?' }),
            K(['iyi misin|iyimisin|canın acıdı mı'], ['Çok nazik! Bir de “Özür dilerim” diyebilirsin.'], '🙏')
        ]),
        E(["I'm sorry!", 'I say “Sorry, are you okay?”', '🙏', 'What do you do next?'], 'What do you say if you bump into someone?', [
            L('SORRY', ['Great! Saying “{Wc}” is so polite.', 'Well done, “{Wc}” is lovely!'], '🙏', { f: 'What do you do next?' }),
            K(['are you okay|you ok|did it hurt'], ['So kind! You can also say “I’m sorry.”'], '🙏')
        ]));

    set('therapy_social_communication_q7',
        E(['İster misin?', 'Arkadaşıma “Sen de oynamak ister misin?” derim.', '🧸', 'Arkadaşın ne der?'], 'Oyuncağını nasıl paylaşırsın?', [
            K(['sen de oyna|sende oyna|sen de oynar mısın|ister misin|istermisin', 'birlikte oynayalım|birlikte|beraber', '=al|=alabilirsin|=buyur|buyrun|sen al',
                'paylaşalım|paylaş', 'sırayla oynayalım|sırayla|=sıra'],
                ['Çok güzel! “İster misin, birlikte oynayalım” diyebilirsin.', 'Paylaşmak çok güzel, aferin!'], '🧸', { w: ['Paylaşmak harika!'], f: 'Arkadaşın ne der?' })
        ]),
        E(['Do you want it?', 'I ask “Do you want to play with it too?”', '🧸', 'What does your friend say?'], 'How do you share a toy?', [
            K(['want to play|you can play|do you want|wanna|together|share|sharing|here you go|take it|your turn|take turns'],
                ['Great! You can say “Do you want it? Let’s play together.”', 'Sharing is lovely, well done!'], '🧸', { w: ['Sharing is great!'], f: 'What does your friend say?' })
        ]));

    const answerTr = E(['Dinler, cevap veririm!', 'Önce dinlerim, sonra cevap veririm.', '💬', 'Sonra sen ne sorarsın?'], 'Sana soru sorulunca ne yaparsın?', [
        K(['cevap veririm|cevap|yanıt', 'dinlerim|dinle', 'gözüne bakarım|bakarım|=bak', 'söylerim|anlatırım|anlat', 'kibarca|kibar|nazik|güzelce', 'evet|hayır'],
            ['Harika! Önce dinleriz, sonra cevap veririz.', 'Çok güzel, bakıp cevap vermek harika!'], '💬', { w: ['Harika, aynen öyle!'], f: 'Sonra sen ne sorarsın?' })
    ]);
    const answerEn = E(['I listen and answer!', 'First I listen, then I answer.', '💬', 'What do you ask back?'], 'What do you do when asked a question?', [
        K(['answer|reply', 'listen', 'look at|eyes', 'tell|say', 'nicely|kindly|polite', 'yes|no'],
            ['Great! First we listen, then we answer.', 'Lovely, looking and answering is great!'], '💬', { w: ['Yes, exactly!'], f: 'What do you ask back?' })
    ]);
    set(['therapy_social_communication_q8', 'city_hospital_q4'], answerTr, answerEn);

    const introTr = E(['Merhaba, benim adım...', 'Merhaba, benim adım ... diyerek adımı söylerim.', '🙋', 'Sonra ona adını sorabilirsin!'], 'Kendini nasıl tanıtırsın?', [
        { name: true, s: ['Memnun oldum, {NAME}! Çok güzel tanıttın.'], e: '🙋', f: 'Sonra ona adını sorabilirsin!' },
        K(['benim adım|=adım|ismim|=ben', 'memnun oldum|memnun|tanıştığıma'], ['Harika! “Merhaba, benim adım ...” diyebilirsin.'], '🙋', { f: 'Sonra ona adını sorabilirsin!' }),
        L('GREETING', ['“{Wc}” ile başlamak çok güzel! Sonra adını söyleyebilirsin.'], '👋')
    ]);
    const introEn = E(['Hi, my name is...', 'I say “Hi, my name is ...”', '🙋', 'Then you can ask their name!'], 'How do you introduce yourself?', [
        { name: true, s: ['Nice to meet you, {NAME}! Lovely introduction.'], e: '🙋', f: 'Then you can ask their name!' },
        K(['my name|name is|im|i am', 'nice to meet'], ['Great! You can say “Hi, my name is ...”'], '🙋', { f: 'Then you can ask their name!' }),
        L('GREETING', ['Starting with “{Wc}” is lovely! Then you can say your name.'], '👋')
    ]);
    set(['therapy_social_communication_q9', 'city_school_q8'], introTr, introEn);

    set('therapy_social_communication_q10',
        E(['Rica ederim!', '“Rica ederim, ne zaman istersen” derim.', '😊', 'Bugün kime yardım ettin?'], 'Yardım edince ne dersin?', [
            K(['rica ederim|=rica', 'bir şey değil|birşey değil|bişey değil|bi şey değil', 'sorun değil', 'ne zaman istersen', 'yine yardım ederim|yine', 'iyi günler'],
                ['Harika! “Rica ederim” demek çok kibar.', 'Çok güzel, ne nazik bir cevap!'], '😊', { w: ['Harika, rica ederim!'], f: 'Bugün kime yardım ettin?' }),
            L('THANKS', ['Teşekkür etmek de güzel! Yardım edince “Rica ederim” de diyebilirsin.'], '😊')
        ]),
        E(["You're welcome!", 'I say “You’re welcome, anytime!”', '😊', 'Who did you help today?'], 'What do you say after helping?', [
            K(['you are welcome|youre welcome|welcome', 'no problem', 'anytime', 'happy to help|glad to help', 'have a nice day'],
                ['Great! “You’re welcome” is so polite.', 'Lovely, what a kind answer!'], '😊', { w: ["Yes, you're welcome!"], f: 'Who did you help today?' }),
            L('THANKS', ['Saying thanks is nice too! After helping you can say “You’re welcome.”'], '😊')
        ]));

    // ---------- OYUN VE SPOR ----------
    const parkGameTr = E(['Salıncak!', 'Parkta en çok salıncakta sallanmayı severim.', '🛝', 'Sen ne oynarsın?'], 'Parkta ne oynarsın?', [
        L(['GAMES', 'SPORTS', 'TOYS'], ['{Wc}, çok eğlenceli!', 'Oo, {W}! Harika seçim.'], '🛝', { f: 'Kiminle oynarsın?' })
    ], { neg: true });
    const parkGameEn = E(['The swings!', 'At the park I love the swings the most.', '🛝', 'What do you play?'], 'What do you play at the park?', [
        L(['GAMES', 'SPORTS', 'TOYS'], ['{Wc}, so much fun!', 'Ooh, {W}! Great choice.'], '🛝', { f: 'Who do you play with?' })
    ], { neg: true });
    set(['therapy_play_sports_q1', 'city_park_q1'], parkGameTr, parkGameEn);

    set('therapy_play_sports_q2',
        E(['Futbol!', 'Bence futbol daha eğlenceli!', '⚽', 'Neden onu seviyorsun?'], 'Futbol mu, basketbol mu?', [
            K(['ikisi de|ikisi|ikiside|=hepsi|ikisini de'], ['İkisi de çok eğlenceli, haklısın!'], '⚽', { f: 'Hangisini daha çok oynarsın?' }),
            K(['futbol|=top|=maç|futbolu'], ['Futbol, harika! Gol atmak çok eğlenceli.'], '⚽', { f: 'Kiminle oynarsın?' }),
            K(['basketbol|basket|basketbolu'], ['Basketbol, süper! Potaya atmak çok eğlenceli.'], '🏀', { f: 'Kiminle oynarsın?' }),
            K(['=hiçbiri|hiçbirini'], ['Olsun! Sen hangi oyunu seversin?'], '😊'),
            L('SPORTS', ['{Wc}, o da çok eğlenceli!'], '🏅', { f: 'Neden onu seviyorsun?' })
        ]),
        E(['Football!', 'I think football is more fun!', '⚽', 'Why do you like it?'], 'Football or basketball?', [
            K(['both'], ['Both are so much fun, you are right!'], '⚽', { f: 'Which one do you play more?' }),
            K(['football|soccer|=ball'], ['Football, great! Scoring goals is so fun.'], '⚽', { f: 'Who do you play with?' }),
            K(['basketball|basket'], ['Basketball, super! Shooting hoops is so fun.'], '🏀', { f: 'Who do you play with?' }),
            K(['neither|none'], ['That is okay! Which game do you like?'], '😊'),
            L('SPORTS', ['{Wc} is fun too!'], '🏅', { f: 'Why do you like it?' })
        ]));

    set('therapy_play_sports_q3',
        E(['Kaleci!', 'Takımda kaleci olmak isterim.', '🥅', 'Sen ne olmak istersin?'], 'Takımda ne olmak istersin?', [
            K(['kaleci|=kale', 'golcü|gol atmak|=gol|forvet', 'defans|savunma|defansçı', 'kaptan', 'orta saha', 'hakem', 'pasör|pas veren', 'koşucu', 'oyuncu|takım oyuncusu'],
                ['{Wc}, çok önemli bir görev!', 'Harika, {W}! Takımın sana güvenir.'], '🥅', { f: 'Takımına nasıl yardım edersin?' })
        ]),
        E(['Goalkeeper!', 'In a team I want to be the goalkeeper.', '🥅', 'What do you want to be?'], 'What role do you want on a team?', [
            K(['goalkeeper|goalie|keeper', 'striker|score goals|goals|forward', 'defender|defense', 'captain', 'midfielder|midfield', 'referee', 'passer', 'runner', 'player|team player'],
                ['{Wc}, a very important job!', 'Great, {W}! Your team counts on you.'], '🥅', { f: 'How do you help your team?' })
        ]));

    const homeGameTr = E(['Lego!', 'Evde en çok lego oynamayı severim.', '🧱', 'Sen ne oynarsın?'], 'Evde ne oynarsın?', [
        L(['GAMES', 'TOYS'], ['Ne çok oyun biliyorsun, harika!'], '🎲', { min: 2, f: 'En çok hangisini seversin?' }),
        L(['GAMES', 'TOYS'], ['{Wc}, çok eğlenceli!', 'Oo, {W}! Harika bir oyun.'], '🎲', { f: 'Kiminle oynarsın?' })
    ], { neg: true, open: true });
    const homeGameEn = E(['Lego!', 'At home I love playing Lego the most.', '🧱', 'What do you play?'], 'What do you play at home?', [
        L(['GAMES', 'TOYS'], ['You know so many games, great!'], '🎲', { min: 2, f: 'Which one is your favorite?' }),
        L(['GAMES', 'TOYS'], ['{Wc}, so much fun!', 'Ooh, {W}! A great game.'], '🎲', { f: 'Who do you play with?' })
    ], { neg: true, open: true });
    set(['therapy_play_sports_q4', 'map_hobby_q3'], homeGameTr, homeGameEn);

    set('therapy_play_sports_q5',
        E(['Kurallara uyarım!', 'Oyunda kurallara uyarım ve sırayla oynarım.', '🤝', 'Sen neye dikkat edersin?'], 'Oyunda neye dikkat edersin?', [
            K(['kurallar|kural', '=sıra|sırayla|sıramı', 'hile yapmamak|hile', 'itmemek|=itmem|=itme|itmeden', 'paylaşmak|paylaş', 'kibar olmak|kibar|nazik',
                'arkadaşımı üzmemek|=üzmem|=üzme|kırmam', 'dikkatli olmak|dikkat', 'düşmemek|=düşme|güvenli', 'kaybedince kızmamak|kaybet|=kızmam', 'eğlenmek|eğlen'],
                ['{Wc}, çok önemli!', 'Evet, {W} oyunu güzelleştirir!'], '🤝', { w: ['Çok önemli, aferin!'], f: 'Başka neye dikkat edersin?' })
        ]),
        E(['Follow the rules!', 'In a game I follow the rules and take turns.', '🤝', 'What do you pay attention to?'], 'What is important in a game?', [
            K(['rules|rule', 'take turns|turns|my turn', 'no cheating|cheat', 'no pushing|dont push', 'share|sharing', 'be nice|kind|nice', 'be careful|careful|safe', 'dont get mad|lose', 'have fun|fun'],
                ['{Wc}, very important!', 'Yes, that makes the game better!'], '🤝', { w: ['Very important!'], f: 'What else is important?' })
        ]));

    set('therapy_play_sports_q6',
        E(['Bisiklet!', 'Bence bisiklet beni daha çok hareket ettirir.', '🚲', 'En son ne zaman bisiklete bindin?'], 'Bisiklet mi, top mu?', [
            K(['ikisi de|ikisi|ikiside|ikisini de'], ['İkisi de çok hareketli, haklısın!'], '🚲', { f: 'Hangisini daha çok seversin?' }),
            K(['bisiklet|bisiklete|bisikleti'], ['Bisiklet, harika! Pedal çevirmek çok hareketli.'], '🚲', { f: 'En son ne zaman bisiklete bindin?' }),
            K(['=top|top oyunu|futbol|=topu|basketbol'], ['Top oyunu, süper! Koşup durmak çok hareketli.'], '⚽', { f: 'Kiminle top oynarsın?' })
        ]),
        E(['Bike!', 'I think riding a bike gets me moving more.', '🚲', 'When did you last ride a bike?'], 'Bike or ball?', [
            K(['both'], ['Both get you moving, you are right!'], '🚲', { f: 'Which one do you like more?' }),
            K(['bike|bicycle|cycling'], ['Bike, great! Pedaling keeps you moving.'], '🚲', { f: 'When did you last ride a bike?' }),
            K(['ball|football|soccer|basketball'], ['Ball games, super! Running around keeps you moving.'], '⚽', { f: 'Who do you play ball with?' })
        ]));

    const bodySportTr = (prefix) => E(['Terlerim!', `${prefix} terlerim ve mutlu olurum.`, '💪', 'Senin bedenin nasıl hisseder?'], `${prefix} ne hissedersin?`, [
        K(['terlersin|terle|=ter|=terler|terledim', 'yorulursun|yorul|yorgun', 'kalbin hızlı atar|kalp|kalbim|hızlı atar', 'nefes nefese kalırsın|nefes', 'sıcak olur|=sıcak|ısın',
            'güçlü hissedersin|güçlü|kuvvet', 'mutlu olursun|mutlu|=iyi|güzel', 'enerjik olursun|enerji'],
            [`Evet, ${prefix.toLocaleLowerCase('tr')} {W}!`, 'Aynen öyle, bedenimiz çalışıyor!'], '💪', { w: ['Evet, aynen öyle!'], f: 'Sonra ne içersin?' })
    ]);
    const bodySportEn = (prefix) => E(['I get sweaty!', `${prefix} I get sweaty and happy.`, '💪', 'How does your body feel?'], `${prefix} how do you feel?`, [
        K(['sweaty|sweat', 'tired', 'heart beats fast|heart|fast', 'out of breath|breath|breathe', 'hot|warm', 'strong', 'happy|good|great', 'energy|energetic'],
            ['Yes, exactly! Our body is working hard.', 'So true, that is how our body feels!'], '💪', { w: ['Yes, exactly!'], f: 'What do you drink after?' })
    ]);
    set('therapy_play_sports_q7', bodySportTr('Spor yapınca'), bodySportEn('After sports'));
    set('city_park_q5', bodySportTr('Koşunca'), bodySportEn('When you run'));

    set('therapy_play_sports_q8',
        E(['Önce dinlerim!', 'Önce kuralları dinlerim, sonra denerim.', '🧩', 'Sonra ne yaparsın?'], 'Yeni oyunda önce ne yaparsın?', [
            K(['dinlemek|dinlerim|dinle', 'izlemek|izlerim|izle|bakarım|=bak', 'kuralları öğrenmek|kural|öğrenirim|öğren', 'soru sormak|=sorarım|soru|=sor', 'denemek|denerim|dene', 'okumak|okurum'],
                ['Harika! Önce {W}, sonra oynarız.', 'Çok güzel, böyle kolayca öğrenirsin!'], '🧩', { w: ['Harika, aynen öyle!'], f: 'Sonra ne yaparsın?' })
        ]),
        E(['I listen first!', 'First I listen to the rules, then I try.', '🧩', 'What do you do next?'], 'What do you do first in a new game?', [
            K(['listen', 'watch|look', 'learn the rules|rules|learn', 'ask', 'try', 'read'], ['Great! First we learn, then we play.', 'Lovely, that is how you learn easily!'], '🧩', { w: ['Yes, exactly!'], f: 'What do you do next?' })
        ]));

    const passTr = E(['Pas atar mısın?', 'Arkadaşıma “Bana pas atar mısın?” derim.', '⚽', 'Top gelince ne yaparsın?'], 'Pas istemek için ne dersin?', [
        K(['pas atar mısın|=pas|pas ver|pas at|pası', 'bana at|=bana|buraya', 'atar mısın|atarmısın|=at', 'verir misin|=ver', 'boştayım|=boş', 'adını söylerim|seslenirim|seslen', 'el kaldırırım|=el'],
            ['Harika! “Bana pas atar mısın?” diyebilirsin.', 'Süper, böyle söyleyince arkadaşın anlar!'], '⚽', { w: ['Süper, pas!'], f: 'Top gelince ne yaparsın?' }),
        L('PLEASE', ['“Lütfen” çok kibar! “Bana pas atar mısın lütfen?” diyebilirsin.'], '⚽')
    ]);
    const passEn = E(['Pass to me!', 'I say “Can you pass me the ball?”', '⚽', 'What do you do when the ball comes?'], 'What do you say to get the ball?', [
        K(['pass|pass me|pass it', 'to me|here|over here', 'throw|kick', 'im open|open', 'call|name', 'hand up|wave'],
            ['Great! You can say “Can you pass me the ball?”', 'Super, your friend will understand!'], '⚽', { w: ['Super, pass!'], f: 'What do you do when the ball comes?' }),
        L('PLEASE', ['“Please” is so polite! “Can you pass it, please?”'], '⚽')
    ]);
    set(['therapy_play_sports_q9', 'city_park_q3'], passTr, passEn);

    set('therapy_play_sports_q10',
        E(['Bisiklet!', 'Bugün bisiklet sürmeyi denemek isterdim.', '🏅', 'Sen hangi sporu denersin?'], 'Bugün hangi sporu denersin?', [
            L(['SPORTS', 'GAMES'], ['{Wc} denemek harika bir fikir!', 'Oo, {W}! Çok eğlenceli olur.'], '🏅', { f: 'Kiminle denemek istersin?' })
        ], { neg: true }),
        E(['Riding a bike!', 'Today I would like to try riding my bike.', '🏅', 'Which sport would you try?'], 'Which sport would you try today?', [
            L(['SPORTS', 'GAMES'], ['Trying {W} is a great idea!', 'Ooh, {W}! That would be fun.'], '🏅', { f: 'Who would you try it with?' })
        ], { neg: true }));

    // ---------- EV ----------
    set('city_home_q1',
        E(['Annemle!', 'Sabah ilk annemle konuşurum.', '🌞', 'Ona ne dersin?'], 'Sabah ilk kiminle konuşursun?', [
            K(['=kimse|kimseyle|hiç kimse'], ['Anladım. Sabah ailene “Günaydın” diyebilirsin!'], '🌞'),
            L(['FAMILY', 'ANIMALS'], ['{Wc}, ne güzel! Sabah sohbeti çok güzel.', 'Oo, {W}! Güne güzel başlıyorsun.'], '🌞', { f: 'Ona ne dersin?' }),
            L('GREETING', ['“{Wc}” demek çok güzel!'], '👋', { f: 'Kime söylersin?' })
        ]),
        E(['My mom!', 'In the morning I talk to my mom first.', '🌞', 'What do you say?'], 'Who do you talk to first in the morning?', [
            K(['nobody|no one'], ['I see. You can say “Good morning” to your family!'], '🌞'),
            L(['FAMILY', 'ANIMALS'], ['Your {W}, how nice! Morning chats are lovely.', 'Ooh, your {W}! A lovely start to the day.'], '🌞', { f: 'What do you say to them?' }),
            L('GREETING', ['Saying “{Wc}” is lovely!'], '👋', { f: 'Who do you say it to?' })
        ]));

    set('city_home_q3',
        E(['Yardım eder misin?', 'Anne, oyuncağımı bulamıyorum. Yardım eder misin?', '🧸', 'Bulunca ne dersin?'], 'Oyuncağını bulamazsan ne dersin?', [
            K(['bulamıyorum|bulamadım|bulamıyom|=bula', 'arar mısın|arayalım|=ara|=arar', 'nerede|=nerde|neredee'], ['Çok güzel! “Anne, oyuncağımı bulamıyorum, yardım eder misin?” diyebilirsin.'], '🧸', { w: ['Harika, aynen öyle!'], f: 'Bulunca ne dersin?' }),
            L('HELP', ['Harika, kibarca yardım istemek çok güzel!', 'Çok güzel! “Yardım eder misin?” demek harika.'], '🧸', { w: ['Harika, aynen öyle!'], f: 'Bulunca ne dersin?' }),
            L('PLEASE', ['“Lütfen” demen çok kibar!'], '🙏', { f: 'Bulunca ne dersin?' })
        ]),
        E(['Can you help me?', "Mom, I can't find my toy. Can you help me?", '🧸', 'What do you say when you find it?'], 'What do you say if you cannot find your toy?', [
            K(['cant find|can not find|lost|where is|look for|find'], ["Great! You can say “Mom, I can't find my toy, can you help me?”"], '🧸', { w: ['Yes, exactly!'], f: 'What do you say when you find it?' }),
            L('HELP', ['Great, asking for help nicely is lovely!'], '🧸', { w: ['Yes, exactly!'], f: 'What do you say when you find it?' }),
            L('PLEASE', ['Saying “please” is so polite!'], '🙏', { f: 'What do you say when you find it?' })
        ]));

    set('city_home_q5',
        E(['Diş fırçalarım!', 'Yatmadan önce dişlerimi fırçalarım ve pijamamı giyerim.', '🌙', 'Sen ne yaparsın?'], 'Yatmadan önce ne yaparsın?', [
            L('BEDTIME', ['{Wc}, çok güzel bir hazırlık!', 'Yatmadan önce {W}, harika!'], '🌙', { f: 'Sonra ne yaparsın?' })
        ]),
        E(['Brush my teeth!', 'Before bed I brush my teeth and put on my pajamas.', '🌙', 'What do you do?'], 'What do you do before bed?', [
            L('BEDTIME', ['{Wc}, great getting ready!', 'Before bed, {W}, well done!'], '🌙', { f: 'What do you do next?' })
        ]));

    set('city_home_q7',
        E(['Battaniye!', 'Üşüyünce battaniye isterim.', '🧣', 'Bunu kime söylersin?'], 'Üşüyünce ne istersin?', [
            K(['üşüdüm|üşüyorum|üşüdü'], ['Çok güzel! “Üşüdüm” demek çok doğru.'], '🧣', { f: 'Ne istersin?' }),
            L('COLD', ['{Wc}, seni ısıtır!', '{Wc} istemek çok iyi fikir!'], '🧣', { f: 'Bunu kime söylersin?' }),
            L('FAMILY', ['{Wc} sana yardım eder! “Üşüdüm” diyebilirsin.'], '🧣', { f: 'Ne istersin?' })
        ]),
        E(['A blanket!', 'When I am cold I ask for a blanket.', '🧣', 'Who do you tell?'], 'What do you want when cold?', [
            K(['cold|freezing|chilly'], ['Great! Saying “I’m cold” is just right.'], '🧣', { f: 'What do you ask for?' }),
            L('COLD', ['A {W} will keep you warm!', 'Asking for a {W} is a great idea!'], '🧣', { f: 'Who do you tell?' }),
            L('FAMILY', ['Your {W} can help! You can say “I’m cold.”'], '🧣', { f: 'What do you ask for?' })
        ]));

    set('city_home_q8',
        E(['Buyurun!', '“Tabii, buyurun” derim.', '🍽️', 'Sen bir şey istersen ne dersin?'], 'Bir şey uzatırken ne dersin?', [
            K(['buyurun|buyur|buyrun', '=al|=alın|=alin', 'tabii|=tabi|=tamam|=olur', 'veririm|uzatırım|=ver'], ['Harika! “Buyurun” demek çok kibar.', 'Çok güzel, “Tabii, buyurun” diyebilirsin!'], '🍽️', { w: ['Harika, buyurun!'], f: 'Sen bir şey istersen ne dersin?' }),
            L('PLEASE', ['Çok kibar! Uzatırken “Buyurun” da diyebilirsin.'], '🍽️')
        ]),
        E(['Here you go!', 'I say “Sure, here you go!”', '🍽️', 'What do you say when you want something?'], 'What do you say when passing something?', [
            K(['here you go|here you are|here', 'sure|okay|=ok|of course'], ['Great! “Here you go” is so polite.', 'Lovely, you can say “Sure, here you go!”'], '🍽️', { w: ['Yes, here you go!'], f: 'What do you say when you want something?' }),
            L('PLEASE', ['So polite! When passing, you can also say “Here you go.”'], '🍽️')
        ]));

    set('city_home_q9',
        E(['Oyuncaklarımı!', 'Oyuncaklarımı kutusuna koyarım.', '🧹', 'Başka neyi yerine koyarsın?'], 'Odanı toplarken neyi yerine koyarsın?', [
            L(['TOYS', 'ROOM_ITEMS', 'CLOTHES', 'SCHOOL_ITEMS'], ['{Wc}, aferin! Odan pırıl pırıl olur.', 'Harika, {W}! Toplamak çok güzel.'], '🧹', { f: 'Başka neyi yerine koyarsın?' })
        ]),
        E(['My toys!', 'I put my toys in the toy box.', '🧹', 'What else do you put away?'], 'What do you put away when tidying?', [
            L(['TOYS', 'ROOM_ITEMS', 'CLOTHES', 'SCHOOL_ITEMS'], ['{Wc}, well done! Your room will be sparkly clean.', 'Great, {W}! Tidying is lovely.'], '🧹', { f: 'What else do you put away?' })
        ]));

    set('city_home_q10',
        E(['Kek yaptık!', 'Annemle kek yaptığımızda çok mutlu oldum.', '🏠', 'O gün başka ne oldu?'], 'Evde mutlu olduğun bir an?', [
            K(['doğum günü|doğum|parti|kutlama'], ['Doğum günü çok mutlu bir an!'], '🎂', { f: 'O gün neler yaptın?' }),
            L('FAMILY', ['Ailenle mutlu anlar çok güzel!'], '👨‍👩‍👧', { f: 'Birlikte ne yaptınız?' }),
            L(['GAMES', 'TOYS', 'TV', 'CARTOON'], ['{Wc}, çok eğlenceli bir an!'], '🎉', { f: 'Kiminle yaptın?' }),
            L(['FOOD', 'SNACK', 'FRUIT'], ['{Wc}, çok tatlı bir an!'], '😋', { f: 'Kiminle yaptın?' })
        ], { open: true }),
        E(['We baked a cake!', 'I was very happy when I baked a cake with my mom.', '🏠', 'What else happened that day?'], 'A happy moment at home?', [
            K(['birthday|party|celebration'], ['A birthday is such a happy moment!'], '🎂', { f: 'What did you do that day?' }),
            L('FAMILY', ['Happy moments with family are lovely!'], '👨‍👩‍👧', { f: 'What did you do together?' }),
            L(['GAMES', 'TOYS', 'TV', 'CARTOON'], ['{Wc}, what a fun moment!'], '🎉', { f: 'Who were you with?' }),
            L(['FOOD', 'SNACK', 'FRUIT'], ['{Wc}, what a sweet moment!'], '😋', { f: 'Who were you with?' })
        ], { open: true }));

    // ---------- OKUL ----------
    set('city_school_q1',
        E(['Günaydın öğretmenim!', 'Sınıfa girince “Günaydın öğretmenim” derim.', '🌞', 'Öğretmenin sana ne der?'], 'Öğretmenine nasıl günaydın dersin?', [
            L('GREETING', ['“{Wc}” demek çok güzel!', 'Harika! “Günaydın öğretmenim” çok kibar.'], '🌞', { f: 'Öğretmenin sana ne der?' }),
            L('WAVE', ['El sallamak çok tatlı! “Günaydın öğretmenim” de diyebilirsin.'], '👋')
        ]),
        E(['Good morning, teacher!', 'When I walk in I say “Good morning, teacher!”', '🌞', 'What does your teacher say?'], 'How do you say good morning to your teacher?', [
            L('GREETING', ['Saying “{Wc}” is lovely!', 'Great! “Good morning, teacher” is so polite.'], '🌞', { f: 'What does your teacher say?' }),
            L('WAVE', ['Waving is sweet! You can also say “Good morning, teacher.”'], '👋')
        ]));

    set('city_school_q2',
        E(['Defterimi açarım!', 'Defterimi hemen açarım.', '📓', 'Sonra ne yaparsın?'], 'Öğretmen “defterini aç” derse ne yaparsın?', [
            K(['açarım|=açar|açmak|=aç|açıyorum|açtım', '=hemen|=tamam|=olur|=peki', 'dinlerim|dinle', 'kalemimi alırım|kalem'],
                ['Harika! Defterini açıp öğretmenini dinlersin.', 'Aferin, yönergeyi hemen yapmak çok güzel!'], '📓', { w: ['Aferin, hemen açarım!'], f: 'Sonra ne yaparsın?' })
        ]),
        E(['I open my notebook!', 'I open my notebook right away.', '📓', 'What do you do next?'], 'What do you do when told to open your notebook?', [
            K(['open|opening', 'right away|okay|=ok|sure', 'listen', 'pencil|pen'], ['Great! You open your notebook and listen.', 'Well done, following directions right away is lovely!'], '📓', { w: ['Well done!'], f: 'What do you do next?' })
        ]));

    set('city_school_q5',
        E(['Buyur, kalemin!', 'Kalemi alıp “Buyur” derim.', '✏️', 'Arkadaşın sana ne der?'], 'Kalemini düşüren arkadaşına ne dersin?', [
            K(['buyur|buyrun|=al|=alırım|alayım', 'yardım|yardım edeyim', 'toplarım|=topla|kaldırırım|=kaldır', 'düştü|düşürdün|kalemin', 'sorun değil|önemli değil', 'iyi misin'],
                ['Çok güzel! “Buyur, kalemin düştü” diyebilirsin.', 'Ne kadar nazik! Arkadaşın çok sevinir.'], '✏️', { w: ['Ne kadar nazik!'], f: 'Arkadaşın sana ne der?' })
        ]),
        E(['Here is your pencil!', 'I pick it up and say “Here you go!”', '✏️', 'What does your friend say?'], 'What do you say when a friend drops a pencil?', [
            K(['here you go|here|your pencil', 'help|can i help', 'pick it up|pick up', 'you dropped|dropped', 'no problem|its okay', 'are you okay'],
                ['Lovely! You can say “Here you go, you dropped it.”', 'So kind! Your friend will be happy.'], '✏️', { w: ['So kind!'], f: 'What does your friend say?' })
        ]));

    set('city_school_q6',
        E(['Parmak kaldırırım!', 'Parmağımı kaldırır, sıramı beklerim.', '✋', 'Öğretmen sana söz verince ne dersin?'], 'Konuşmak istersen sınıfta ne yaparsın?', [
            K(['parmak kaldırırım|parmak|el kaldır|elimi kaldır|elimi|=el', 'beklerim|bekle|=sıra|sıramı', 'öğretmenim|hocam', 'sessiz|sessizce|=sakin', 'izin isterim|izin|=söz'],
                ['Harika! Parmak kaldırıp sıramızı bekleriz.', 'Aferin, parmak kaldırmak çok güzel!'], '✋', { w: ['Aferin, parmak kaldırırız!'], f: 'Öğretmen sana söz verince ne dersin?' }),
            K(['bağırırım|=bağırırım|hemen söylerim'], ['Hmm, bağırmayız. Parmak kaldırıp sıramızı bekleriz!'], '✋')
        ]),
        E(['I raise my hand!', 'I raise my hand and wait for my turn.', '✋', 'What do you say when the teacher calls you?'], 'What do you do to speak in class?', [
            K(['raise my hand|raise hand|hand up|hand', 'wait|my turn', 'quiet|quietly|calm', 'ask'], ['Great! We raise our hand and wait for our turn.', 'Well done, raising your hand is lovely!'], '✋', { w: ['Yes, raise your hand!'], f: 'What do you say when the teacher calls you?' }),
            K(['shout|yell|just talk'], ['Hmm, we don’t shout. We raise our hand and wait!'], '✋')
        ]));

    set('city_school_q7',
        E(['Resim!', 'Benim en sevdiğim ders resim.', '📚', 'Senin en sevdiğin ders hangisi?'], 'En sevdiğin ders hangisi?', [
            L('SUBJECTS', ['{Wc}, çok güzel bir ders!', 'Oo, {W}! Harika seçim.'], '📚', { f: 'O derste ne yapmayı seversin?' })
        ], { neg: true }),
        E(['Art!', 'My favorite subject is art.', '📚', 'What is your favorite subject?'], 'What is your favorite subject?', [
            L('SUBJECTS', ['{Wc}, a great subject!', 'Ooh, {W}! Great choice.'], '📚', { f: 'What do you like doing in that class?' })
        ], { neg: true }));

    set('city_school_q9',
        E(['Lütfen, sıra bende!', 'Kibarca “Lütfen, sıra bende” derim.', '🧍', 'Arkadaşın ne yapar?'], 'Biri önüne geçerse ne dersin?', [
            K(['=iterim|vururum|döverim|kızarım|bağırırım'], ['Kızabiliriz ama itmeyiz. “Lütfen, sıra bende” diyebiliriz.'], '🧍'),
            K(['sıra bende|sıra benim|=sıra|sırada', 'arkaya geç|arkaya|=geç', 'ben vardım|önce ben|ben önce', 'beklemelisin|=bekle|beklesene', 'kibarca|kibar|nazik', 'öğretmene söylerim|öğretmen'],
                ['Çok güzel! “Lütfen, sıra bende” diyebilirsin.', 'Harika, kibarca söylemek en iyisi!'], '🧍', { w: ['Harika, sıra bende!'], f: 'Arkadaşın ne yapar?' }),
            L('PLEASE', ['“Lütfen” demek çok kibar! “Lütfen, sıra bende” diyebilirsin.'], '🧍')
        ]),
        E(['Please, it is my turn!', 'I say nicely “Please, it’s my turn.”', '🧍', 'What does your friend do?'], 'What do you say if someone cuts in?', [
            K(['=push|hit|shout|yell'], ['We can feel upset, but we don’t push. We can say “Please, it’s my turn.”'], '🧍'),
            K(['my turn|i was here|i was first|wait|back of the line|line|nicely|tell the teacher|teacher'],
                ['Lovely! You can say “Please, it’s my turn.”', 'Great, saying it nicely is best!'], '🧍', { w: ['Great!'], f: 'What does your friend do?' }),
            L('PLEASE', ['“Please” is so polite! “Please, it’s my turn.”'], '🧍')
        ]));

    const byeTeacherTr = E(['Hoşça kalın!', '“Hoşça kalın öğretmenim, yarın görüşürüz” derim.', '👋', 'Öğretmenin ne der?'], 'Okuldan çıkarken ne dersin?', [
        L('GOODBYE', ['“{Wc}” demek çok güzel!', 'Harika! “Hoşça kalın öğretmenim” çok kibar.'], '👋', { f: 'Öğretmenin ne der?' }),
        L('WAVE', ['El sallamak çok tatlı! “Hoşça kalın” da diyebilirsin.'], '👋'),
        L('HUG', ['Ne tatlı! Bir de “Hoşça kalın” diyebilirsin.'], '🤗')
    ]);
    const byeTeacherEn = E(['Goodbye!', 'I say “Goodbye teacher, see you tomorrow!”', '👋', 'What does your teacher say?'], 'What do you say when leaving school?', [
        L('GOODBYE', ['Saying “{Wc}” is lovely!', 'Great! “Goodbye, teacher” is so polite.'], '👋', { f: 'What does your teacher say?' }),
        L('WAVE', ['Waving is sweet! You can also say “Goodbye.”'], '👋'),
        L('HUG', ['So sweet! You can also say “Goodbye.”'], '🤗')
    ]);
    set('city_school_q10', byeTeacherTr, byeTeacherEn);

    // ---------- MARKET ----------
    set('city_market_q1',
        E(['Elma istiyorum!', '“Anne, elma alabilir miyiz?” derim.', '🛒', 'Başka ne istersin?'], 'Markette ilk ne istersin?', [
            L(['FRUIT', 'SNACK', 'DRINK', 'FOOD', 'TOYS'], ['“{Wc} istiyorum” demek çok güzel!', '{Wc}, güzel seçim! “Lütfen {W} alabilir miyiz?” diyebilirsin.'], '🛒', { f: 'Başka ne istersin?' }),
            K(['istiyorum|alabilir miyiz|alır mısın|alalım'], ['Harika, istediğini söylemek çok güzel!'], '🛒', { f: 'Ne almak istersin?' })
        ]),
        E(['I want an apple!', 'I say “Mom, can we get apples?”', '🛒', 'What else do you want?'], 'What do you want first at the store?', [
            L(['FRUIT', 'SNACK', 'DRINK', 'FOOD', 'TOYS'], ['Saying “I want {W}” is great!', '{Wc}, good choice! You can say “Can we get {W}, please?”'], '🛒', { f: 'What else do you want?' }),
            K(['i want|can we get|can we buy|lets get'], ['Great, saying what you want is lovely!'], '🛒', { f: 'What would you like to get?' })
        ]));

    set('city_market_q2',
        E(['Elma istiyorum!', '“Elma istiyorum, lütfen” derim.', '🍎', 'Hangi rengi seversin?'], 'Elma mı, muz mu?', [
            K(['ikisi de|ikisi|ikisini de|elma ve muz|ikiside'], ['İkisini istemek de olur! “Elma ve muz istiyorum” diyebilirsin.'], '🍎'),
            K(['elma|elmayı'], ['Elma, süper! “Elma istiyorum” diyebilirsin.'], '🍎', { f: 'Kırmızı mı, yeşil mi?' }),
            K(['=muz|=muzu|muzları'], ['Muz, harika! “Muz istiyorum” diyebilirsin.'], '🍌', { f: 'Muzu nasıl yersin?' }),
            L('FRUIT', ['{Wc}, o da çok güzel! “{Wc} istiyorum” diyebilirsin.'], '🍓')
        ]),
        E(['I want an apple!', 'I say “I want an apple, please.”', '🍎', 'Which color do you like?'], 'Apple or banana?', [
            K(['both|apple and banana'], ['You can want both! Say “I want an apple and a banana.”'], '🍎'),
            K(['apple'], ['Apple, super! You can say “I want an apple.”'], '🍎', { f: 'Red or green?' }),
            K(['banana'], ['Banana, great! You can say “I want a banana.”'], '🍌', { f: 'How do you eat it?' }),
            L('FRUIT', ['{Wc} is lovely too! You can say “I want {W}.”'], '🍓')
        ]));

    set('city_market_q3',
        E(['Uzatır mısın lütfen?', '“Anne, uzatır mısın lütfen?” derim.', '🧺', 'Annen uzatınca ne dersin?'], 'Annenden bir şey nasıl istersin?', [
            K(['uzatır mısın|uzatırmısın|=uzat|uzatabilir', 'verir misin|verirmisin|=ver', 'alabilir misin|alır mısın'], ['Harika! “Anne, uzatır mısın lütfen?” çok kibar.'], '🧺', { w: ['Harika, aynen öyle!'], f: 'Annen uzatınca ne dersin?' }),
            L('PLEASE', ['Çok güzel, “lütfen” demek harika!'], '🙏', { f: 'Annen uzatınca ne dersin?' })
        ]),
        E(['Can you pass it, please?', 'I say “Mom, can you pass it, please?”', '🧺', 'What do you say when she does?'], 'How do you ask Mom to hand you something?', [
            K(['can you pass|pass|hand me|give me|can you get'], ['Great! “Mom, can you pass it, please?” is so polite.'], '🧺', { w: ['Yes, exactly!'], f: 'What do you say when she does?' }),
            L('PLEASE', ['Lovely, saying “please” is great!'], '🙏', { f: 'What do you say when she does?' })
        ]));

    set('city_market_q5',
        E(['Yardım eder misiniz?', '“Affedersiniz, yardım eder misiniz?” derim.', '🙋', 'Görevli verince ne dersin?'], 'Yüksekteki ürün için ne dersin?', [
            K(['alabilir misiniz|alır mısınız|uzatır mısınız|verir misiniz', 'ulaşamıyorum|ulaşamadım|yetişemiyorum|yetiş|boyum yetmiyor', 'affedersiniz|pardon'],
                ['Çok güzel! “Affedersiniz, yardım eder misiniz?” çok kibar.'], '🙋', { w: ['Harika, çok kibar!'], f: 'Görevli verince ne dersin?' }),
            L('HELP', ['Harika, görevliden yardım istemek çok güzel!'], '🙋', { f: 'Görevli verince ne dersin?' }),
            L('PLEASE', ['“Lütfen” çok kibar! “Yardım eder misiniz, lütfen?” diyebilirsin.'], '🙏'),
            K(['tırmanırım|tırman|=çıkarım|zıplarım'], ['Tırmanmak tehlikeli olabilir. Görevliden yardım isteyelim!'], '⚠️')
        ]),
        E(['Can you help me?', 'I say “Excuse me, can you help me?”', '🙋', 'What do you say when they help?'], 'What do you say if something is too high?', [
            K(['can you get|can you reach|cant reach|too high|excuse me'], ['Lovely! “Excuse me, can you help me?” is so polite.'], '🙋', { w: ['So polite!'], f: 'What do you say when they help?' }),
            L('HELP', ['Great, asking a worker for help is lovely!'], '🙋', { f: 'What do you say when they help?' }),
            L('PLEASE', ['“Please” is so polite!'], '🙏'),
            K(['climb|jump'], ['Climbing can be dangerous. Let’s ask a worker for help!'], '⚠️')
        ]));

    set('city_market_q6',
        E(['Atıştırmalık istiyorum!', '“Anne, bir şey yiyebilir miyim?” derim.', '🍪', 'En çok ne yemek istersin?'], 'Atıştırmalık isteyince ne dersin?', [
            L('HUNGRY', ['Harika, “Acıktım” demek tam doğru!', 'Çok güzel! “Bir şey yiyebilir miyim?” diye sorabilirsin.'], '🍪', { f: 'En çok ne yemek istersin?' }),
            L(['SNACK', 'FRUIT', 'FOOD'], ['“{Wc} istiyorum” demek güzel!', '{Wc}, lezzetli! “Lütfen {W} alabilir miyim?” diyebilirsin.'], '🍪', { f: 'Bunu kime söylersin?' }),
            K(['canım istedi|istiyorum|alabilir miyim'], ['Çok güzel, istediğini söylemek harika!'], '🍪', { f: 'Ne istersin?' })
        ]),
        E(['I want a snack!', 'I say “Mom, can I have a snack?”', '🍪', 'What would you like?'], 'What do you say when you want a snack?', [
            L('HUNGRY', ['Great, saying “I’m hungry” is just right!', 'Lovely! You can ask “Can I have a snack?”'], '🍪', { f: 'What would you like?' }),
            L(['SNACK', 'FRUIT', 'FOOD'], ['Saying “I want {W}” is great!', '{Wc}, yummy! You can say “Can I have {W}, please?”'], '🍪', { f: 'Who do you ask?' }),
            K(['i want|can i have|snack'], ['Lovely, saying what you want is great!'], '🍪', { f: 'What would you like?' })
        ]));

    set('city_market_q7',
        E(['Süt istiyorum!', '“Ben süt istiyorum, lütfen” derim.', '🥛', 'Hangisini daha çok seversin?'], 'Süt mü, meyve suyu mu?', [
            K(['ikisi de|ikisi|ikisini de'], ['İkisi de güzel! Bugün hangisini istersin?'], '🥤'),
            K(['meyve suyu|meyvesuyu|meyve suyunu|=meyve'], ['Meyve suyu, harika! “Meyve suyu istiyorum” diyebilirsin.'], '🧃', { f: 'Hangi meyve suyunu seversin?' }),
            K(['süt|=sütü|=süt'], ['Süt, süper! “Süt istiyorum” diyebilirsin.'], '🥛', { f: 'Sütü sıcak mı seversin, soğuk mu?' }),
            L('DRINK', ['{Wc}, o da güzel! “{Wc} istiyorum” diyebilirsin.'], '🥤')
        ]),
        E(['I want milk!', 'I say “I want milk, please.”', '🥛', 'Which one do you like more?'], 'Milk or juice?', [
            K(['both'], ['Both are nice! Which one do you want today?'], '🥤'),
            K(['juice'], ['Juice, great! You can say “I want juice.”'], '🧃', { f: 'Which juice do you like?' }),
            K(['milk'], ['Milk, super! You can say “I want milk.”'], '🥛', { f: 'Warm or cold?' }),
            L('DRINK', ['{Wc} is nice too! You can say “I want {W}.”'], '🥤')
        ]));

    set('city_market_q8',
        E(['Teşekkür ederim!', 'Kasadaki kişiye “Teşekkür ederim” derim.', '🙏', 'O sana ne der?'], 'Teşekkür etmek için ne dersin?', [
            L('THANKS', ['Harika! “{Wc}” demek çok kibar.', 'Aferin, “{Wc}” çok güzel!'], '🙏', { w: ['Harika, çok kibar!'], f: 'O sana ne der?' }),
            L('GOODBYE', ['Çok güzel! Bir de “Teşekkür ederim” diyebilirsin.'], '🙏')
        ]),
        E(['Thank you!', 'I say “Thank you!” to the cashier.', '🙏', 'What do they say?'], 'What do you say to thank someone?', [
            L('THANKS', ['Great! Saying “{Wc}” is so polite.', 'Well done, “{Wc}” is lovely!'], '🙏', { w: ['So polite!'], f: 'What do they say?' }),
            L('GOODBYE', ['Lovely! You can also say “Thank you!”'], '🙏')
        ]));

    set('city_market_q9',
        E(['Yardım eder misin?', '“Çok ağır, yardım eder misin?” derim.', '🛍️', 'Yardım edene ne dersin?'], 'Poşet ağırsa ne dersin?', [
            K(['çok ağır|=ağır|ağırr', 'taşıyamıyorum|taşır mısın|=taşı', 'tutar mısın|=tut'], ['Çok güzel! “Çok ağır, yardım eder misin?” diyebilirsin.'], '🛍️', { w: ['Harika, aynen öyle!'], f: 'Yardım edene ne dersin?' }),
            L('HELP', ['Harika, yardım istemek çok güzel!'], '🛍️', { f: 'Yardım edene ne dersin?' }),
            L('PLEASE', ['“Lütfen” çok kibar!'], '🙏', { f: 'Yardım edene ne dersin?' })
        ]),
        E(['Can you help me?', 'I say “It’s too heavy, can you help me?”', '🛍️', 'What do you say to the helper?'], 'What do you say if the bag is heavy?', [
            K(['heavy|too heavy', 'cant carry|carry', 'hold'], ['Lovely! You can say “It’s too heavy, can you help me?”'], '🛍️', { w: ['Yes, exactly!'], f: 'What do you say to the helper?' }),
            L('HELP', ['Great, asking for help is lovely!'], '🛍️', { f: 'What do you say to the helper?' }),
            L('PLEASE', ['“Please” is so polite!'], '🙏', { f: 'What do you say to the helper?' })
        ]));

    set('city_market_q10',
        E(['Elma, süt, ekmek!', 'Elma, süt ve ekmek isterim.', '🛒', 'Hangisini en çok seversin?'], 'Marketten üç şey söyler misin?', [
            L(['FRUIT', 'FOOD', 'SNACK', 'DRINK', 'TOYS'], ['Harika, üç şey saydın! Aferin.', 'Süper liste! Hepsi çok güzel.'], '🛒', { min: 3, w: ['Harika, üç şey!'], f: 'Hangisini en çok seversin?' }),
            L(['FRUIT', 'FOOD', 'SNACK', 'DRINK', 'TOYS'], ['{Wc}, güzel! Başka ne alırsın?', 'Oo, {W}! Bir şey daha söyler misin?'], '🛒', { w: ['{Wc}! Başka ne?'] })
        ]),
        E(['Apples, milk, bread!', 'I want apples, milk and bread.', '🛒', 'Which one do you like most?'], 'Can you name three things?', [
            L(['FRUIT', 'FOOD', 'SNACK', 'DRINK', 'TOYS'], ['Great, you named three things! Well done.', 'Super list! All lovely.'], '🛒', { min: 3, w: ['Great, three things!'], f: 'Which one do you like most?' }),
            L(['FRUIT', 'FOOD', 'SNACK', 'DRINK', 'TOYS'], ['{Wc}, nice! What else would you get?', 'Ooh, {W}! Can you name one more?'], '🛒', { w: ['{Wc}! What else?'] })
        ]));

    // ---------- PARK ----------
    set('city_park_q2',
        E(['Hadi gel!', '“Hadi gel, birlikte sallanalım!” derim.', '🛝', 'Arkadaşın gelince ne yaparsınız?'], 'Arkadaşını salıncağa nasıl çağırırsın?', [
            K(['=gel|gelir misin|gelsene|=hadi|haydi', 'sallanalım|sallan', 'birlikte|beraber', 'ister misin|istermisin', 'salıncak|salıncağa'],
                ['Harika! “Hadi gel, birlikte sallanalım!” diyebilirsin.', 'Çok güzel, arkadaşını çağırmak harika!'], '🛝', { w: ['Harika, hadi gel!'], f: 'Arkadaşın gelince ne yaparsınız?' })
        ]),
        E(['Come on!', 'I say “Come on, let’s swing together!”', '🛝', 'What do you do together?'], 'How do you invite a friend to the swings?', [
            K(['come|come on', 'swing|swings', 'together', 'do you want|wanna|want to', 'lets|let\'s'],
                ['Great! You can say “Come on, let’s swing together!”', 'Lovely, inviting your friend is great!'], '🛝', { w: ['Great, come on!'], f: 'What do you do together?' })
        ]));

    set('city_park_q6',
        E(['Tamam, yarın oynarız!', '“Tamam, yarın yine oynarız” derim.', '🤝', 'Sonra sen ne yaparsın?'], 'Arkadaşın oyunu bırakırsa ne dersin?', [
            K(['üzülürüm|ağlarım|=üzül|kızarım|sinirlenirim'], ['Üzülebiliriz, bu normal. “Tamam, yarın oynarız” diyebiliriz.'], '🤗'),
            K(['=tamam|=peki|=olur', 'sorun değil|önemli değil', 'yarın oynarız|yarın|=sonra|başka zaman|tekrar|yine', 'yoruldun mu|yorgun|dinlen', 'neden|=niye'],
                ['Çok güzel! “Tamam, yarın yine oynarız” diyebilirsin.', 'Ne kadar anlayışlı, aferin!'], '🤝', { w: ['Aferin, çok anlayışlı!'], f: 'Sonra sen ne yaparsın?' }),
            L('GOODBYE', ['Çok güzel! “Görüşürüz, yarın yine oynarız” diyebilirsin.'], '👋')
        ]),
        E(['Okay, see you tomorrow!', 'I say “Okay, we can play again tomorrow.”', '🤝', 'What do you do next?'], 'What do you say if a friend wants to stop?', [
            K(['sad|cry|upset|angry|mad'], ['It is okay to feel sad. We can say “Okay, let’s play tomorrow.”'], '🤗'),
            K(['okay|=ok|alright|fine|no problem|tomorrow|later|another time|again|tired|rest|why'],
                ['Lovely! You can say “Okay, let’s play again tomorrow.”', 'So understanding, well done!'], '🤝', { w: ['So understanding!'], f: 'What do you do next?' }),
            L('GOODBYE', ['Lovely! You can say “See you, let’s play tomorrow.”'], '👋')
        ]));

    set('city_park_q7',
        E(['Saklambaç!', 'Bence saklambaç daha eğlenceli!', '🙈', 'Neden onu seviyorsun?'], 'Futbol mu, saklambaç mı?', [
            K(['ikisi de|ikisi|ikiside|ikisini de'], ['İkisi de çok eğlenceli, haklısın!'], '⚽', { f: 'Hangisini daha çok oynarsın?' }),
            K(['saklambaç|saklambac|saklanbaç|saklan'], ['Saklambaç, süper! Saklanmak çok eğlenceli.'], '🙈', { f: 'Nereye saklanırsın?' }),
            K(['futbol|=top|=maç'], ['Futbol, harika! Gol atmak çok eğlenceli.'], '⚽', { f: 'Kiminle oynarsın?' }),
            L('GAMES', ['{Wc}, o da çok eğlenceli!'], '🎉')
        ]),
        E(['Hide and seek!', 'I think hide and seek is more fun!', '🙈', 'Why do you like it?'], 'Football or hide-and-seek?', [
            K(['both'], ['Both are so much fun, you are right!'], '⚽', { f: 'Which do you play more?' }),
            K(['hide and seek|hide|seek'], ['Hide and seek, super! Hiding is so fun.'], '🙈', { f: 'Where do you hide?' }),
            K(['football|soccer|ball'], ['Football, great! Scoring goals is so fun.'], '⚽', { f: 'Who do you play with?' }),
            L('GAMES', ['{Wc} is fun too!'], '🎉')
        ]));

    set('city_park_q8',
        E(['Kuralları anlatırım!', '“Gelin, size kuralları anlatayım!” derim.', '🧩', 'Sonra ne dersin?'], 'Yeni oyunu nasıl öğretirsin?', [
            K(['kurallar|kural', 'dinleyin|dinle|bakın|=bak|izleyin|izle', 'şöyle oynanır|=şöyle|=böyle', '=önce|=ilk', 'anlatayım|anlatırım|anlat|göstereyim|gösteririm|göster',
                'hadi oynayalım|oynayalım', 'öğreteyim|öğretirim|öğret'],
                ['Harika! Önce kuralları anlatmak çok güzel.', 'Çok güzel! “Gelin, size göstereyim” diyebilirsin.'], '🧩', { w: ['Harika, aynen öyle!'], f: 'Sonra ne dersin?' })
        ]),
        E(['I explain the rules!', 'I say “Come, let me show you the rules!”', '🧩', 'What do you say next?'], 'How do you teach a new game?', [
            K(['rules|rule', 'listen|look|watch', 'like this', 'first', 'show|explain|tell', 'lets play', 'teach'], ['Great! Explaining the rules first is lovely.', 'Lovely! You can say “Come, let me show you.”'], '🧩', { w: ['Yes, exactly!'], f: 'What do you say next?' })
        ]));

    set('city_park_q9',
        E(['İyi misin?', '“İyi misin?” derim ve kalkmasına yardım ederim.', '🩹', 'Canı acırsa ne yaparsın?'], 'Arkadaşın düşerse ne yaparsın?', [
            K(['güler|gülerim|gülüyorum|güldüm|dalga geçerim|dalga'], ['Düşmek canı acıtır, gülmeyiz. “İyi misin?” diye sorarız.'], '🩹'),
            K(['iyi misin|iyimisin|canın acıdı mı|acıdı mı|acıyor mu', 'kaldırırım|=kaldır|kalkmasına', 'yardım ederim|yardım', 'geçmiş olsun', 'büyüğe söylerim|annesine|söylerim|haber veririm'],
                ['Çok güzel! “İyi misin?” diye sorup yardım edersin.', 'Ne kadar iyi bir arkadaşsın!'], '🩹', { w: ['Ne kadar iyi!'], f: 'Canı acırsa ne yaparsın?' }),
            L(['FAMILY', 'TEACHER'], ['Bir büyüğe haber vermek çok doğru!'], '🩹', { f: 'Arkadaşına ne dersin?' })
        ]),
        E(['Are you okay?', 'I ask “Are you okay?” and help them up.', '🩹', 'What do you do if it hurts?'], 'What do you do if a friend falls?', [
            K(['laugh'], ['Falling hurts, so we don’t laugh. We ask “Are you okay?”'], '🩹'),
            K(['are you okay|you ok|does it hurt', 'help|help up|pick up', 'tell a grown up|tell|adult'], ['Lovely! You ask “Are you okay?” and help.', 'What a good friend you are!'], '🩹', { w: ['So kind!'], f: 'What do you do if it hurts?' }),
            L(['FAMILY', 'TEACHER'], ['Telling a grown-up is just right!'], '🩹', { f: 'What do you say to your friend?' })
        ]));

    set('city_park_q10',
        E(['Hoşça kalın!', '“Hoşça kalın, yarın görüşürüz!” derim.', '👋', 'Arkadaşların ne der?'], 'Parktan çıkarken ne dersin?', [
            L('GOODBYE', ['“{Wc}” demek çok güzel!', 'Harika! “Hoşça kalın, yarın görüşürüz!” çok güzel.'], '👋', { f: 'Arkadaşların ne der?' }),
            L('WAVE', ['El sallamak çok tatlı! “Görüşürüz” de diyebilirsin.'], '👋')
        ]),
        E(['Bye, see you!', 'I say “Bye, see you tomorrow!”', '👋', 'What do your friends say?'], 'What do you say when leaving the park?', [
            L('GOODBYE', ['Saying “{Wc}” is lovely!', 'Great! “Bye, see you tomorrow!” is lovely.'], '👋', { f: 'What do your friends say?' }),
            L('WAVE', ['Waving is sweet! You can also say “See you!”'], '👋')
        ]));

    // ---------- HASTANE ----------
    set('city_hospital_q1',
        E(['Biraz heyecanlı!', 'Biraz heyecanlıyım ama iyiyim.', '🤗', 'Sen nasıl hissediyorsun?'], 'Hastanede nasıl hissediyorsun?', [
            K(['iyi değil|=değilim|pek iyi'], ['Söylediğin için teşekkürler. Doktorlar sana yardım eder.'], '🤗', { f: 'Seni ne rahatlatır?' }),
            L('FEEL_NEG', ['Hastanede {W} hissetmek normal. Doktorlar sana yardım eder.'], '🤗', { f: 'Seni ne rahatlatır?' }),
            L('FEEL_POS', ['Ne güzel, {W} hissediyorsun! Doktorlar sana yardım eder.'], '😊', { f: 'Yanında kim var?' })
        ]),
        E(['A bit nervous!', 'I am a bit nervous, but I am okay.', '🤗', 'How do you feel?'], 'How do you feel at the hospital?', [
            K(['not good|not okay|not great'], ['Thank you for telling me. The doctors will help you.'], '🤗', { f: 'What helps you feel better?' }),
            L('FEEL_NEG', ['It is normal to feel {W} at the hospital. The doctors will help you.'], '🤗', { f: 'What helps you feel better?' }),
            L('FEEL_POS', ['How nice, you feel {W}! The doctors will help you.'], '😊', { f: 'Who is with you?' })
        ]));

    set('city_hospital_q2',
        E(['Karnım ağrıyor!', '“Doktor, karnım ağrıyor” derim.', '🩺', 'Ağrı nerede?'], 'Karnın ağrırsa doktora ne dersin?', [
            K(['karnım ağrıyor|karnım|=karın|ağrıyor|=ağrı|acıyor|=acı|sızlıyor', 'midem|mide|bulanıyor', 'burası|burada|şurası|gösteririm|göster'],
                ['Çok güzel! Nasıl hissettiğini söylemek doktora yardım eder.', 'Harika, acıyan yeri göstermek de çok iyi!'], '🩺', { w: ['Harika, aynen öyle!'], f: 'Ağrı nerede?' })
        ]),
        E(['My tummy hurts!', 'I say “Doctor, my tummy hurts.”', '🩺', 'Where does it hurt?'], 'What do you tell the doctor if your tummy hurts?', [
            K(['tummy hurts|tummy|stomach|belly|hurts|ache|pain', 'here|show|point'], ['Great! Saying “My tummy hurts” helps the doctor.', 'Lovely, showing where it hurts is great too!'], '🩺', { w: ['Yes, exactly!'], f: 'Where does it hurt?' })
        ]));

    set('city_hospital_q3',
        E(['Annem!', 'İğne olurken annem elimi tutsun isterim.', '🤗', 'Sen ne istersin?'], 'İğneden korkunca ne istersin?', sadNearTr.i),
        E(['My mom!', 'During a shot I want my mom to hold my hand.', '🤗', 'What would you want?'], 'What do you want if scared of a shot?', sadNearEn.i));

    set('city_hospital_q5',
        E(['Canım acıyor!', '“Canım acıyor, yardım eder misiniz?” derim.', '🩹', 'Hemşire yardım edince ne dersin?'], 'Canın acırsa hemşireye ne dersin?', [
            K(['canım acıyor|acıyor|=acı|ağrıyor|=ağrı|sızlıyor', 'burası|burada|gösteririm'], ['Çok güzel! “Canım acıyor, yardım eder misiniz?” diyebilirsin.'], '🩹', { w: ['Harika, aynen öyle!'], f: 'Hemşire yardım edince ne dersin?' }),
            L('HELP', ['Harika, yardım istemek çok önemli!'], '🩹', { f: 'Neresi acıyor?' }),
            L('PLEASE', ['“Lütfen” çok kibar!'], '🙏', { f: 'Hemşire yardım edince ne dersin?' })
        ]),
        E(['It hurts!', 'I say “It hurts, can you help me?”', '🩹', 'What do you say when the nurse helps?'], 'What do you tell the nurse if it hurts?', [
            K(['it hurts|hurts|ouch|pain|ache', 'here|show'], ['Lovely! You can say “It hurts, can you help me?”'], '🩹', { w: ['Yes, exactly!'], f: 'What do you say when the nurse helps?' }),
            L('HELP', ['Great, asking for help is so important!'], '🩹', { f: 'Where does it hurt?' }),
            L('PLEASE', ['“Please” is so polite!'], '🙏', { f: 'What do you say when the nurse helps?' })
        ]));

    set('city_hospital_q6',
        E(['Oh, rahatladım!', '“Oh, rahatladım! Teşekkürler” derim.', '😌', 'Sonra ne yapmak istersin?'], 'Muayene bitince ne dersin?', [
            L('THANKS', ['Doktora teşekkür etmek çok güzel!'], '🙏', { f: 'Sonra ne yapmak istersin?' }),
            K(['=oh|oh be|ohh', 'rahatladım|=rahat', 'iyiyim|=iyi|daha iyi', 'geçti|bitti', 'mutluyum|=mutlu', 'korkmadım|cesur'],
                ['Harika! “Oh, rahatladım” demek çok güzel.', 'Aferin, çok cesurdun!'], '😌', { w: ['Aferin, çok cesurdun!'], f: 'Sonra ne yapmak istersin?' })
        ]),
        E(['Phew, I feel better!', 'I say “Phew, I feel better! Thank you.”', '😌', 'What do you want to do next?'], 'What do you say after the check-up?', [
            L('THANKS', ['Thanking the doctor is lovely!'], '🙏', { f: 'What do you want to do next?' }),
            K(['phew|relieved|better|okay|good|done|finished|happy|brave'], ['Great! “Phew, I feel better” is lovely.', 'Well done, you were so brave!'], '😌', { w: ['So brave!'], f: 'What do you want to do next?' })
        ]));

    set('city_hospital_q7',
        E(['Sıkıldım!', '“Anne, sıkıldım. Oyun oynayalım mı?” derim.', '⏳', 'Beklerken ne oynayabilirsin?'], 'Beklerken sıkılırsan ne dersin?', [
            K(['sıkıldım|sıkıl|sıkılıyorum', 'ne zaman|ne kadar', 'oyun oynayalım|=oyun|oynayalım|=oyna', 'gidelim mi|eve gidelim|gidelim'],
                ['Çok güzel! “Sıkıldım, oyun oynayalım mı?” diyebilirsin.', 'Harika, nasıl hissettiğini söylemek çok güzel!'], '⏳', { w: ['Harika, aynen öyle!'], f: 'Beklerken ne oynayabilirsin?' }),
            L(['BOOK', 'TV', 'CARTOON', 'GAMES', 'TOYS'], ['{Wc}, beklerken çok iyi bir fikir!'], '⏳', { f: 'Bunu kime söylersin?' }),
            L(['HUNGRY', 'DRINK'], ['Söylemen çok güzel! Annen sana yardım eder.'], '⏳')
        ]),
        E(["I'm bored!", 'I say “Mom, I’m bored. Can we play a game?”', '⏳', 'What can you play while waiting?'], 'What do you say if bored while waiting?', [
            K(['bored|boring', 'how long|when', 'play|game', 'go home|leave'], ['Lovely! You can say “I’m bored, can we play a game?”', 'Great, telling how you feel is lovely!'], '⏳', { w: ['Yes, exactly!'], f: 'What can you play while waiting?' }),
            L(['BOOK', 'TV', 'CARTOON', 'GAMES', 'TOYS'], ['{Wc}, a great idea while waiting!'], '⏳', { f: 'Who do you ask?' }),
            L(['HUNGRY', 'DRINK'], ['Good that you said it! Your mom will help you.'], '⏳')
        ]));

    set('city_hospital_q8',
        E(['Battaniye lütfen!', '“Üşüdüm, battaniye verir misiniz lütfen?” derim.', '🧣', 'Battaniyeyi alınca ne dersin?'], 'Battaniye için ne dersin?', [
            K(['battaniye|battaniy|örtü|yorgan', 'üşüdüm|üşüyorum', 'verir misiniz|verir misin|=ver', 'alabilir miyim|alabilir'],
                ['Harika! “Üşüdüm, battaniye verir misiniz lütfen?” çok kibar.'], '🧣', { w: ['Harika, çok kibar!'], f: 'Battaniyeyi alınca ne dersin?' }),
            L('PLEASE', ['Çok güzel, “lütfen” demek harika!'], '🙏', { f: 'Battaniyeyi alınca ne dersin?' })
        ]),
        E(['Blanket, please!', 'I say “I’m cold, can I have a blanket, please?”', '🧣', 'What do you say when you get it?'], 'What do you say to ask for a blanket?', [
            K(['blanket', 'cold', 'can i have|can you give|give'], ['Great! “I’m cold, can I have a blanket, please?” is so polite.'], '🧣', { w: ['So polite!'], f: 'What do you say when you get it?' }),
            L('PLEASE', ['Lovely, saying “please” is great!'], '🙏', { f: 'What do you say when you get it?' })
        ]));

    set('city_hospital_q9',
        E(['İyiyim, teşekkürler!', '“İyiyim, teşekkür ederim” derim.', '😊', 'Bir yerin acıyor mu?'], 'Doktor “iyi misin” derse ne dersin?', [
            K(['iyi değilim|=değilim|kötü|kötüyüm|ağrıyor|acıyor|hastayım'], ['Söylediğin için teşekkürler. Doktor sana yardım eder.'], '🩺', { f: 'Neresi acıyor?' }),
            K(['=biraz'], ['Biraz iyi olman güzel. Doktor sana yardım eder.'], '🩺', { f: 'Neresi acıyor?' }),
            K(['iyiyim|=iyi|daha iyi|çok iyi'], ['Harika! “İyiyim, teşekkür ederim” çok güzel.'], '😊', { w: ['Harika, iyiyim!'], f: 'Bir yerin acıyor mu?' }),
            L('THANKS', ['Teşekkür etmek çok kibar!'], '😊', { f: 'Nasıl hissediyorsun?' })
        ]),
        E(["I'm fine, thank you!", 'I say “I’m fine, thank you.”', '😊', 'Does anything hurt?'], 'What do you say if the doctor asks if you are okay?', [
            K(['not okay|not good|not fine|bad|hurts|sick'], ['Thank you for telling. The doctor will help you.'], '🩺', { f: 'Where does it hurt?' }),
            K(['a bit|=little'], ['A little better is good. The doctor will help you.'], '🩺', { f: 'Where does it hurt?' }),
            K(['fine|okay|=ok|good|better|great'], ['Great! “I’m fine, thank you” is lovely.'], '😊', { w: ["Great, I'm fine!"], f: 'Does anything hurt?' }),
            L('THANKS', ['Saying thanks is so polite!'], '😊', { f: 'How do you feel?' })
        ]));

    set('city_hospital_q10',
        E(['Teşekkür ederim!', '“Teşekkür ederim doktor, hoşça kalın!” derim.', '🙏', 'Doktor sana ne der?'], 'Doktora nasıl teşekkür edersin?', [
            L('THANKS', ['Harika! “Teşekkür ederim doktor” çok kibar.', 'Aferin, “{Wc}” çok güzel!'], '🙏', { w: ['Harika, çok kibar!'], f: 'Doktor sana ne der?' }),
            L('GOODBYE', ['Çok güzel! Bir de “Teşekkür ederim” diyebilirsin.'], '👋'),
            L('HUG', ['Ne tatlı! Bir de “Teşekkür ederim” diyebilirsin.'], '🤗')
        ]),
        E(['Thank you!', 'I say “Thank you, doctor, goodbye!”', '🙏', 'What does the doctor say?'], 'How do you thank the doctor?', [
            L('THANKS', ['Great! “Thank you, doctor” is so polite.', 'Well done, “{Wc}” is lovely!'], '🙏', { w: ['So polite!'], f: 'What does the doctor say?' }),
            L('GOODBYE', ['Lovely! You can also say “Thank you!”'], '👋'),
            L('HUG', ['So sweet! You can also say “Thank you!”'], '🤗')
        ]));

    // ---------- KONUŞMA HARİTASI ----------
    set('map_greet_q1',
        E(['Günaydın!', 'Sabah aileme “Günaydın” derim.', '🌞', 'Sonra ne yaparsın?'], 'Sabah ailene ne dersin?', [
            L('GREETING', ['“{Wc}” demek çok güzel!', 'Harika! “{Wc}” ile güne başlamak çok güzel.'], '🌞', { f: 'Sonra ne yaparsın?' }),
            L('HUG', ['Sabah sarılmak çok tatlı! “Günaydın” da diyebilirsin.'], '🤗')
        ]),
        E(['Good morning!', 'I say “Good morning!” to my family.', '🌞', 'What do you do next?'], 'What do you say to your family in the morning?', [
            L('GREETING', ['Saying “{Wc}” is lovely!', 'Great! Starting the day with “{Wc}” is lovely.'], '🌞', { f: 'What do you do next?' }),
            L('HUG', ['A morning hug is so sweet! You can also say “Good morning.”'], '🤗')
        ]));

    set('map_intro_q1',
        E(['Benim adım...', 'Benim adım Yıldız Can.', '🙋', 'Senin adın ne?'], 'Adın ne?', [
            { name: true, s: ['Memnun oldum, {NAME}!', 'Ne güzel bir isim, {NAME}!'], w: ['Memnun oldum, {NAME}!'], e: '🙋', f: 'Kaç yaşındasın?' }
        ], { fb: { s: ['Memnun oldum! Ne güzel bir isim.'], w: ['Memnun oldum!'], e: '🙋' } }),
        E(['My name is...', 'My name is Yıldız Can.', '🙋', 'What is your name?'], 'What is your name?', [
            { name: true, s: ['Nice to meet you, {NAME}!', 'What a lovely name, {NAME}!'], w: ['Hi, {NAME}!'], e: '🙋', f: 'How old are you?' }
        ], { fb: { s: ['Nice to meet you! What a lovely name.'], w: ['Nice to meet you!'], e: '🙋' } }));

    set('map_intro_q2',
        E(['Beş!', 'Ben beş yaşındayım.', '🎂', 'Sen kaç yaşındasın?'], 'Kaç yaşındasın?', [
            L('AGE', ['{Wc} yaşındasın, kocaman olmuşsun!', 'Vay, {W} yaş! Çok güzel.'], '🎂', { w: ['{Wc} yaş, harika!'], f: 'Doğum günün ne zaman?' })
        ], { fb: { s: ['Harika, kocaman olmuşsun!'], w: ['Harika!'], e: '🎂' } }),
        E(['Five!', 'I am five years old.', '🎂', 'How old are you?'], 'How old are you?', [
            L('AGE', ['{Wc} years old, you are so big!', 'Wow, {W}! Lovely.'], '🎂', { w: ['{Wc}, great!'], f: 'When is your birthday?' })
        ], { fb: { s: ['Great, you are getting so big!'], w: ['Great!'], e: '🎂' } }));

    set('map_intro_q3',
        E(['Annem, babam!', 'Annem, babam ve kardeşimle yaşıyorum.', '👨‍👩‍👧', 'Evde başka kim var?'], 'Evde kimler var?', [
            L('FAMILY', ['Ne güzel bir aile!', 'Kalabalık ve güzel bir aile!'], '👨‍👩‍👧', { min: 2, f: 'Birlikte ne yaparsınız?' }),
            L('FAMILY', ['{Wc}, ne güzel!', '{Wc} ile yaşamak çok güzel!'], '👨‍👩‍👧', { f: 'Başka kimler var?' }),
            L('ANIMALS', ['Evcil hayvanın da ailenden, ne tatlı!'], '🐱', { f: 'Başka kimler var?' })
        ], { fb: { s: ['Ne güzel bir aile!'], e: '👨‍👩‍👧' } }),
        E(['Mom and Dad!', 'I live with my mom, my dad and my brother.', '👨‍👩‍👧', 'Who else is at home?'], 'Who lives with you?', [
            L('FAMILY', ['What a lovely family!', 'A big, lovely family!'], '👨‍👩‍👧', { min: 2, f: 'What do you do together?' }),
            L('FAMILY', ['Your {W}, how nice!'], '👨‍👩‍👧', { f: 'Who else lives with you?' }),
            L('ANIMALS', ['Your pet is family too, how sweet!'], '🐱', { f: 'Who else lives with you?' })
        ], { fb: { s: ['What a lovely family!'], e: '👨‍👩‍👧' } }));

    set('map_intro_q4',
        E(['Ayıcığım!', 'Benim en sevdiğim oyuncak ayıcığım.', '🧸', 'Seninki ne?'], 'En sevdiğin oyuncak ne?', [
            L('TOYS', ['{Wc}, çok güzel bir oyuncak!', 'Oo, {W}! Harika.'], '🧸', { f: 'Onunla nasıl oynarsın?' })
        ], { open: true, neg: true }),
        E(['My teddy!', 'My favorite toy is my teddy bear.', '🧸', 'What is yours?'], 'What is your favorite toy?', [
            L('TOYS', ['A {W}, what a lovely toy!', 'Ooh, {W}! Great.'], '🧸', { f: 'How do you play with it?' })
        ], { open: true, neg: true }));

    set('map_food_q1',
        E(['Makarna!', 'Benim en sevdiğim yemek makarna.', '😋', 'Seninki ne?'], 'En sevdiğin yemek ne?', [
            L(['FOOD', 'FRUIT', 'SNACK'], ['{Wc}, çok lezzetli!', 'Mmm, {W}! Ben de severim.'], '😋', { f: 'Onu kim yapıyor?' })
        ], { neg: true }),
        E(['Pasta!', 'My favorite food is pasta.', '😋', 'What is yours?'], 'What is your favorite food?', [
            L(['FOOD', 'FRUIT', 'SNACK'], ['{Wc}, yummy!', 'Mmm, {W}! I like it too.'], '😋', { f: 'Who makes it?' })
        ], { neg: true }));

    const hobbyTr = E(['Resim yapmak!', 'Boş zamanımda resim yapmayı severim.', '🎨', 'Sen ne yaparsın?'], 'Boş zamanında ne yaparsın?', [
        L(['DRAW', 'MUSIC', 'BOOK', 'TV', 'CARTOON', 'GAMES', 'SPORTS', 'TOYS'], ['{Wc}, harika bir uğraş!', 'Oo, {W}! Çok eğlenceli.'], '🎨', { f: 'Bunu kiminle yaparsın?' }),
        L('PLACES', ['{Wc}, çok güzel bir yer!'], '🌳', { f: 'Orada ne yaparsın?' })
    ], { open: true, neg: true });
    const hobbyEn = E(['Drawing!', 'In my free time I like drawing.', '🎨', 'What do you do?'], 'What do you do in your free time?', [
        L(['DRAW', 'MUSIC', 'BOOK', 'TV', 'CARTOON', 'GAMES', 'SPORTS', 'TOYS'], ['{Wc}, what a great thing to do!', 'Ooh, {W}! So much fun.'], '🎨', { f: 'Who do you do it with?' }),
        L('PLACES', ['The {W}, a lovely place!'], '🌳', { f: 'What do you do there?' })
    ], { open: true, neg: true });
    set('map_hobby_q1', hobbyTr, hobbyEn);

    set('map_hobby_q2',
        E(['Pepee!', 'Benim en sevdiğim çizgi film Pepee.', '📺', 'Seninki hangisi?'], 'En sevdiğin çizgi film hangisi?', [
            L('CARTOON', ['{Wc}, çok eğlenceli!', 'Oo, {Wc}! Harika bir çizgi film.'], '📺', { f: 'En çok hangi karakteri seversin?' })
        ], { neg: true, fb: { s: ['Çok güzel bir seçim!', 'Ne güzel, onu izlemek eğlenceli olmalı!'], w: ['Güzel seçim!'], e: '📺' } }),
        E(['Bluey!', 'My favorite cartoon is Bluey.', '📺', 'Which one is yours?'], 'What is your favorite cartoon?', [
            L('CARTOON', ['{Wc}, so much fun!', 'Ooh, {Wc}! A great cartoon.'], '📺', { f: 'Who is your favorite character?' })
        ], { neg: true, fb: { s: ['Great choice!', 'How nice, that sounds fun to watch!'], w: ['Great choice!'], e: '📺' } }));

    set('map_places_q1',
        E(['Servisle!', 'Ben okula servisle giderim.', '🚌', 'Sen nasıl gidersin?'], 'Okula nasıl gidersin?', [
            K(['gitmiyorum|=gitmem|okula gitmiyorum'], ['Olsun! Bir yere giderken nasıl gidersin?'], '😊'),
            L('TRANSPORT', ['{Wc} gitmek çok güzel!', 'Oo, {W}! Harika.'], '🚌', { f: 'Okula kiminle gidersin?' }),
            L('FAMILY', ['{Wc} ile gitmek çok güzel!'], '🚗', { f: 'Yürüyerek mi, arabayla mı?' })
        ]),
        E(['By bus!', 'I go to school by school bus.', '🚌', 'How do you go?'], 'How do you get to school?', [
            K(['dont go|do not go'], ['That is okay! How do you go places?'], '😊'),
            L('TRANSPORT', ['Going by {W} is great!', 'Ooh, {W}! Great.'], '🚌', { f: 'Who do you go with?' }),
            L('FAMILY', ['Going with your {W} is lovely!'], '🚗', { f: 'Walking or by car?' })
        ]));

    set('map_places_q2',
        E(['Odamda!', 'Evde en çok kendi odamda olmayı severim.', '🏠', 'Sen hangi odayı seversin?'], 'Evde en çok hangi odayı seversin?', [
            L('ROOMS', ['{Wc}, çok güzel bir yer!', 'Oo, {W}! Harika.'], '🏠', { f: 'Orada ne yaparsın?' })
        ], { neg: true }),
        E(['My room!', 'I like being in my own room the most.', '🏠', 'Which room do you like?'], 'Which room do you like most?', [
            L('ROOMS', ['The {W}, a lovely place!', 'Ooh, the {W}! Great.'], '🏠', { f: 'What do you do there?' })
        ], { neg: true }));

    set('map_places_q3',
        E(['Parka gidelim mi?', '“Anne, parka gidebilir miyiz?” derim.', '🌳', 'Parkta ne oynarsın?'], 'Parka gitmek için kime ne dersin?', [
            K(['parka gidelim|gidebilir miyiz|gidelim mi|=gidelim|parka gidebilir|=parka'], ['Çok güzel! “Anne, parka gidebilir miyiz?” diye sorabilirsin.', 'Harika, kibarca sormak çok güzel!'], '🌳', { w: ['Harika, aynen öyle!'], f: 'Parkta ne oynarsın?' }),
            L('FAMILY', ['{Wc} sana yardım eder! “Parka gidebilir miyiz?” diye sorabilirsin.'], '🌳', { f: 'Parkta ne oynarsın?' }),
            L('PLEASE', ['“Lütfen” demek çok kibar!'], '🙏', { f: 'Parkta ne oynarsın?' })
        ]),
        E(['Can we go to the park?', 'I ask “Mom, can we go to the park?”', '🌳', 'What do you play at the park?'], 'Who do you ask to go to the park?', [
            K(['can we go|go to the park|lets go|park'], ['Lovely! You can ask “Mom, can we go to the park?”', 'Great, asking nicely is lovely!'], '🌳', { w: ['Yes, exactly!'], f: 'What do you play at the park?' }),
            L('FAMILY', ['Your {W} can take you! Ask “Can we go to the park?”'], '🌳', { f: 'What do you play at the park?' }),
            L('PLEASE', ['“Please” is so polite!'], '🙏', { f: 'What do you play at the park?' })
        ]));

    set('map_places_q4',
        E(['Deniz!', 'Ben denize gitmeyi çok severim.', '🏖️', 'Sen nereyi seversin?'], 'Park mı, deniz mi?', [
            L('PLACES', ['İkisi de çok güzel!'], '🏖️', { min: 2, f: 'Hangisine daha çok gidersin?' }),
            L('PLACES', ['{Wc}, harika bir yer!', '{Wc}, çok eğlenceli!'], '🏖️', { f: 'Orada ne yaparsın?' })
        ], { neg: true, open: true }),
        E(['The sea!', 'I love going to the sea.', '🏖️', 'Where do you like to go?'], 'The park or the sea?', [
            L('PLACES', ['Both are lovely!'], '🏖️', { min: 2, f: 'Which do you go to more?' }),
            L('PLACES', ['The {W}, a great place!', 'The {W}, so much fun!'], '🏖️', { f: 'What do you do there?' })
        ], { neg: true, open: true }));

    set('map_problem_q1',
        E(['Annemden!', 'Anneme “Yardım eder misin?” derim.', '🙋', 'Ona ne dersin?'], 'Yüksekteki şeye ulaşamazsan ne yaparsın?', [
            K(['sandalyeye çıkarım|sandalye|tırmanırım|tırman|=çıkarım|zıplarım'], ['Tırmanmak tehlikeli olabilir. Bir büyükten yardım isteyelim!'], '⚠️'),
            L(['FAMILY', 'TEACHER'], ['{Wc} sana yardım eder, çok güzel!'], '🙋', { f: 'Ona ne dersin?' }),
            L('HELP', ['Harika! “Yardım eder misin?” demek çok güzel.'], '🙋', { f: 'Kimden yardım istersin?' }),
            L('PLEASE', ['“Lütfen” demek çok kibar!'], '🙏', { f: 'Kimden yardım istersin?' })
        ]),
        E(['I ask my mom!', 'I ask my mom “Can you help me?”', '🙋', 'What do you say?'], 'What do you do if something is too high?', [
            K(['chair|climb|jump'], ['Climbing can be dangerous. Let’s ask a grown-up for help!'], '⚠️'),
            L(['FAMILY', 'TEACHER'], ['Your {W} can help you, great!'], '🙋', { f: 'What do you say to them?' }),
            L('HELP', ['Great! Saying “Can you help me?” is lovely.'], '🙋', { f: 'Who do you ask?' }),
            L('PLEASE', ['“Please” is so polite!'], '🙏', { f: 'Who do you ask?' })
        ]));

    set('map_problem_q2',
        E(['Tamir ederiz!', 'Anneme gösteririm, birlikte tamir ederiz.', '🔧', 'Başka ne yapabilirsin?'], 'Oyuncağın kırılırsa ne yaparsın?', [
            K(['üzülürüm|ağlarım|=üzül'], ['Üzülmek normal. Sonra bir büyüğe gösterebilirsin!'], '🤗'),
            K(['kızarım|sinirlenirim'], ['Kızmak normal. Derin nefes alıp yardım isteyebiliriz.'], '🤗'),
            K(['=atarım|çöpe'], ['Belki tamir edilebilir! Önce bir büyüğe gösterelim.'], '🔧'),
            K(['tamir|onar|yapıştır|=bant|düzelt'], ['Harika, tamir etmeyi denemek çok güzel!'], '🔧', { f: 'Kimden yardım alırsın?' }),
            L(['FAMILY', 'TEACHER'], ['{Wc} sana yardım eder, harika fikir!'], '🔧', { f: 'Ona ne dersin?' }),
            L('HELP', ['Harika, yardım istemek çok güzel!'], '🔧', { f: 'Kimden yardım istersin?' })
        ]),
        E(['We fix it!', 'I show my mom and we fix it together.', '🔧', 'What else can you do?'], 'What do you do if your toy breaks?', [
            K(['cry|sad'], ['It is okay to feel sad. Then you can show a grown-up!'], '🤗'),
            K(['angry|mad'], ['It is okay to feel angry. Take a deep breath and ask for help.'], '🤗'),
            K(['throw|trash|bin'], ['Maybe it can be fixed! Let’s show a grown-up first.'], '🔧'),
            K(['fix|glue|tape|repair'], ['Great, trying to fix it is lovely!'], '🔧', { f: 'Who helps you?' }),
            L(['FAMILY', 'TEACHER'], ['Your {W} can help, great idea!'], '🔧', { f: 'What do you say to them?' }),
            L('HELP', ['Great, asking for help is lovely!'], '🔧', { f: 'Who do you ask?' })
        ]));

    set('map_dream_q1',
        E(['Doktor!', 'Büyüyünce doktor olmak isterim.', '🌟', 'Sen ne olmak istersin?'], 'Büyüyünce ne olmak istersin?', [
            L('JOBS', ['{Wc} olmak harika bir hayal!', 'Vay, {W}! Çok güzel.'], '🌟', { f: '{Wc} olunca ne yaparsın?' })
        ], { open: true }),
        E(['A doctor!', 'When I grow up I want to be a doctor.', '🌟', 'What do you want to be?'], 'What do you want to be?', [
            L('JOBS', ['Being a {W} is a great dream!', 'Wow, a {W}! Lovely.'], '🌟', { f: 'What will you do as a {W}?' })
        ], { open: true }));

    set('map_dream_q2',
        E(['Uçmak!', 'Uçmak isterdim, gökyüzünde gezerdim.', '🦸', 'Senin süper gücün ne olurdu?'], 'Süper gücün olsa ne yapardın?', [
            L('POWER', ['{Wc}, harika bir süper güç!', 'Vay, {W}! Çok güzel.'], '🦸', { f: 'Bu güçle ne yapardın?' })
        ], { open: true }),
        E(['Fly!', 'I would fly and travel in the sky.', '🦸', 'What would your superpower be?'], 'If you had a superpower?', [
            L('POWER', ['{Wc}, a great superpower!', 'Wow, {W}! Lovely.'], '🦸', { f: 'What would you do with it?' })
        ], { open: true }));

    set('map_dream_q3',
        E(['Uzaya!', 'Bir gün uzaya gitmek isterdim!', '✈️', 'Sen nereye gitmek isterdin?'], 'Nereye gitmek isterdin?', [
            L(['TRAVEL', 'PLACES'], ['{Wc}, harika bir gezi olur!', 'Vay, {Wc}! Çok güzel.'], '✈️', { f: 'Orada ne görmek istersin?' })
        ], { open: true }),
        E(['To space!', 'One day I would like to go to space!', '✈️', 'Where would you go?'], 'Where would you travel?', [
            L(['TRAVEL', 'PLACES'], ['{Wc}, what a great trip!', 'Wow, {Wc}! Lovely.'], '✈️', { f: 'What would you see there?' })
        ], { open: true }));

    set('map_dream_q4',
        E(['Bisiklet!', 'Doğum günümde bisiklet isterim.', '🎁', 'Sen ne istersin?'], 'Doğum gününde ne istersin?', [
            L(['GIFT', 'TOYS', 'ANIMALS'], ['{Wc}, çok güzel bir hediye!', 'Oo, {W}! Harika bir dilek.'], '🎁', { f: 'Doğum gününde kimler gelsin?' })
        ], { open: true }),
        E(['A bike!', 'For my birthday I want a bike.', '🎁', 'What do you want?'], 'What do you want for your birthday?', [
            L(['GIFT', 'TOYS', 'ANIMALS'], ['A {W}, what a lovely present!', 'Ooh, a {W}! Great wish.'], '🎁', { f: 'Who should come to your party?' })
        ], { open: true }));

    set('map_dream_q5',
        E(['Parka gitmek!', 'Yarın parka gitmek isterim.', '📅', 'Sen yarın ne yapmak istersin?'], 'Yarın ne yapmak istersin?', [
            L(['PLACES'], ['{Wc}, harika bir plan!'], '📅', { f: 'Kiminle gitmek istersin?' }),
            L(['GAMES', 'SPORTS', 'DRAW', 'MUSIC', 'BOOK', 'TV', 'CARTOON', 'TOYS'], ['{Wc}, harika bir plan!', 'Oo, {W}! Çok eğlenceli olur.'], '📅', { f: 'Kiminle yapmak istersin?' })
        ], { open: true, neg: true }),
        E(['Go to the park!', 'Tomorrow I want to go to the park.', '📅', 'What do you want to do tomorrow?'], 'What do you want to do tomorrow?', [
            L(['PLACES'], ['The {W}, a great plan!'], '📅', { f: 'Who will you go with?' }),
            L(['GAMES', 'SPORTS', 'DRAW', 'MUSIC', 'BOOK', 'TV', 'CARTOON', 'TOYS'], ['{Wc}, a great plan!', 'Ooh, {W}! That will be fun.'], '📅', { f: 'Who will you do it with?' })
        ], { open: true, neg: true }));

    set('map_dream_q6',
        E(['Astronot olmak!', 'En büyük hayalim astronot olmak.', '🌈', 'Senin hayalin ne?'], 'En büyük hayalin ne?', [
            L('JOBS', ['{Wc} olmak harika bir hayal!'], '🌈', { f: 'Bu hayal için ne yapabilirsin?' }),
            L(['TRAVEL', 'PLACES'], ['{Wc}, ne güzel bir hayal!'], '🌈', { f: 'Orada ne yapmak istersin?' }),
            L('POWER', ['{Wc}, ne güzel bir hayal!'], '🌈', { f: 'Bununla ne yapardın?' }),
            L(['GIFT', 'TOYS', 'ANIMALS'], ['{Wc}, ne güzel bir hayal!'], '🌈', { f: 'Bunu neden istiyorsun?' })
        ], { open: true }),
        E(['Being an astronaut!', 'My biggest dream is to be an astronaut.', '🌈', 'What is your dream?'], 'What is your biggest dream?', [
            L('JOBS', ['Being a {W} is a great dream!'], '🌈', { f: 'What can you do for this dream?' }),
            L(['TRAVEL', 'PLACES'], ['{Wc}, what a lovely dream!'], '🌈', { f: 'What would you do there?' }),
            L('POWER', ['{Wc}, what a lovely dream!'], '🌈', { f: 'What would you do with it?' }),
            L(['GIFT', 'TOYS', 'ANIMALS'], ['{Wc}, what a lovely dream!'], '🌈', { f: 'Why do you want it?' })
        ], { open: true }));

    const data = { lex, generic, negation, q };
    if (typeof module !== 'undefined' && module.exports) module.exports = data;
    else root.ReplyData = data;
})(typeof window !== 'undefined' ? window : this);
