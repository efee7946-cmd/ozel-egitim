// Gemini kaldırıldı: konuşma pratiği cevapları artık cihazda hazır metinlerden
// seçiliyor (reply-engine.js). Eski uygulama sürümleri bu yanıtı alınca kendi
// yerel yedek cevabına düşer.
export default function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method === 'OPTIONS') return res.status(200).end();
    return res.status(410).json({ error: 'AI_DISABLED' });
}
