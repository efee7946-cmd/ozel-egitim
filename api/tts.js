import { GoogleAuth } from 'google-auth-library';
import { sessionUsername } from './_auth.js';

let _authClient = null;

async function getAccessToken() {
    if (!_authClient) {
        const credentials = JSON.parse(process.env.GOOGLE_TTS_CREDENTIALS);
        const auth = new GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/cloud-platform'],
        });
        _authClient = await auth.getClient();
    }
    const { token } = await _authClient.getAccessToken();
    return token;
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Sadece POST isteği atılabilir.' });
    }

    if (!(await sessionUsername(req))) {
        return res.status(401).json({ error: 'AUTH_REQUIRED' });
    }

    if (!process.env.GOOGLE_TTS_CREDENTIALS) {
        return res.status(500).json({ error: 'GOOGLE_TTS_CREDENTIALS eksik' });
    }

    const { text, lang } = req.body;
    if (!text) return res.status(400).json({ error: 'text zorunlu.' });
    if (String(text).length > 800) return res.status(400).json({ error: 'text çok uzun' });

    const voice = lang === 'en'
        ? { languageCode: 'en-US', name: 'en-US-Chirp3-HD-Aoede' }
        : { languageCode: 'tr-TR', name: 'tr-TR-Chirp3-HD-Aoede' };

    try {
        const token = await getAccessToken();
        const response = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                input: { text },
                voice,
                audioConfig: { audioEncoding: 'MP3' },
            }),
        });

        if (!response.ok) {
            const errBody = await response.text();
            console.error('Google TTS hatası:', response.status, errBody);
            return res.status(response.status).json({
                error: 'Google TTS hatası',
                status: response.status,
                detail: errBody
            });
        }

        const data = await response.json();
        const audioBuffer = Buffer.from(data.audioContent, 'base64');
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Cache-Control', 'no-store');
        res.send(audioBuffer);

    } catch (error) {
        console.error('TTS backend hatası:', error);
        res.status(500).json({ error: 'SERVER_ERROR' });
    }
}
