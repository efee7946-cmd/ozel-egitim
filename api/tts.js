export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const ELEVEN_KEY = process.env.ELEVEN_KEY;
    const ELEVEN_VOICE_ID = process.env.ELEVENLABS_VOICE;

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Sadece POST isteği atılabilir.' });
    }

    // Env değişkenleri kontrol
    if (!ELEVEN_KEY) return res.status(500).json({ error: 'ELEVEN_KEY eksik' });
    if (!ELEVEN_VOICE_ID) return res.status(500).json({ error: 'ELEVENLABS_VOICE eksik' });

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
                    model_id: 'eleven_multilingual_v2',
                    voice_settings: { stability: 0.5, similarity_boost: 0.75 }
                })
            }
        );

        if (!response.ok) {
            const errBody = await response.text();
            console.error('ElevenLabs hata:', response.status, errBody);
            return res.status(response.status).json({ 
                error: 'ElevenLabs hatası', 
                status: response.status,
                detail: errBody 
            });
        }

        const audioBuffer = await response.arrayBuffer();
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Cache-Control', 'no-store');
        res.send(Buffer.from(audioBuffer));

    } catch (error) {
        console.error('TTS backend hatası:', error);
        res.status(500).json({ error: 'Backend hatası: ' + error.message });
    }
}
