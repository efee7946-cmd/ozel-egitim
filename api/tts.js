
Copy

export default async function handler(req, res) {
    const ELEVEN_KEY = process.env.ELEVEN_KEY;
    const ELEVEN_VOICE_ID = process.env.ELEVENLABS_VOICE;
 
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Sadece POST isteği atılabilir.' });
    }
 
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'text zorunlu.' });
 
    try {
        const response = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_VOICE_ID}`,
            {
                method: 'POST',
                headers: {
                    'xi-api-key': ELEVEN_KEY,
                    'Content-Type': 'application/json',
                    'Accept': 'audio/mpeg'
                },
                body: JSON.stringify({
                    text,
                    model_id: 'eleven_flash_v2_5', // en ucuz, Türkçe destekli
                    voice_settings: { stability: 0.5, similarity_boost: 0.75 }
                })
            }
        );
 
        if (!response.ok) {
            // Kota bitti veya hata — frontend fallback'e geçer
            return res.status(response.status).json({ error: 'ElevenLabs hatası' });
        }
 
        const audioBuffer = await response.arrayBuffer();
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Cache-Control', 'no-store');
        res.send(Buffer.from(audioBuffer));
 
    } catch (error) {
        res.status(500).json({ error: 'Backend hatası: ' + error.message });
    }
}
 
