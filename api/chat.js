export default async function handler(req, res) {
    // Vercel panelindeki GEMINI_KEY (Google AI Studio anahtarı ikisi için de geçerli)
    const GEMINI_KEY = process.env.GEMINI_KEY;

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Sadece POST isteği atılabilir.' });
    }

    const { contents, system_instruction } = req.body;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_KEY}`;

    const requestBody = { contents };
    if (system_instruction) requestBody.system_instruction = system_instruction;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
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