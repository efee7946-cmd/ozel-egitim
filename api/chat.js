export default async function handler(req, res) {
    // Vercel panelindeki GEMINI_KEY (Google AI Studio anahtarı ikisi için de geçerli)
    const GEMINI_KEY = process.env.GEMINI_KEY;

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Sadece POST isteği atılabilir.' });
    }

    const { contents } = req.body;
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_KEY}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents })
        });

        const data = await response.json();

        // Eğer Google hata döndürürse bunu yakalayalım
        if (!response.ok) {
            console.error("Google API Hatası:", data);
            return res.status(response.status).json(data);
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Backend hatası: ' + error.message });
    }
}