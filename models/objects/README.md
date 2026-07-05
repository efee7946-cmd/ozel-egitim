# Nesne Tanıma — 3D model ekleme rehberi

Bu klasördeki `.glb` dosyaları, ana menüdeki 🔍 Nesne Tanıma ekranında çocuğun
döndürüp tanımaya çalıştığı 3D nesnelerdir.

## Blender'da hazırlarken dikkat edilecekler

1. **Dışa aktarım formatı:** `.glb` (glTF Binary) — tek dosya, dokular içine
   gömülü olur. `File → Export → glTF 2.0 (.glb/.gltf)`, format olarak
   **glTF Binary (.glb)** seç.
2. **Orijin:** Nesneyi Blender'da dünya orijinine (0,0,0) yakın, kendi
   merkezinde konumlandır. Uygulama kamerayı nesnenin boyutuna göre otomatik
   ayarlıyor, bu yüzden ölçek (scale) önemli değil — ama orijinden çok uzaksa
   nesne ekranın dışında/kenarında görünebilir.
3. **Poligon sayısı:** Mobil tarayıcıda sorunsuz dönebilmesi için ~20-50 bin
   üçgeni geçmemeye çalış (basit, oyuncak tarzı nesneler için fazlasıyla
   yeterli).
4. **Dosya boyutu:** Mümkünse birkaç MB altında tut (doku çözünürlüğünü
   1024x1024 civarında tutmak genelde yeterli).
5. **Adlandırma:** `elma.glb`, `araba.glb` gibi Türkçe/İngilizce karışık
   olmayan, küçük harf, boşluksuz isimler kullan.

## Yeni nesneyi uygulamaya eklemek

Dosyayı bu klasöre koyduktan sonra `script.js` içindeki
`OBJECT_RECOGNITION_ITEMS` dizisine (aratarak bulabilirsin: "NESNE TANIMA (3D)")
şu şekilde bir satır ekle:

```js
{ id: 'apple', type: 'glb', model: 'models/objects/elma.glb',
    answers: { tr: ['elma'], en: ['apple'] },
    get label() { return t('obj_apple'); } },
```

Sonra `script.js`'deki TR ve EN çeviri bloklarına `obj_apple: 'Elma'` /
`obj_apple: 'Apple'` satırlarını eklemen yeterli — kod tarafında başka bir
değişiklik gerekmez, oyun otomatik olarak yeni nesneyi de sıraya katar.

`answers` dizisine birden fazla kabul edilebilir kelime eklenebilir (örn.
çocuk "kırmızı elma" da derse yine doğru sayılsın istersen `['elma']` yeterli,
çünkü kontrol "içeriyor mu" mantığıyla çalışıyor — tam eşleşme şart değil).
