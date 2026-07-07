import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { sessionUsername } from './_auth.js';
import { checkRateLimit } from './_rateLimit.js';
import { GoogleAuth } from 'google-auth-library';

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

// Google TTS Fallback function
async function googleTTSFallback(text, lang) {
    if (!process.env.GOOGLE_TTS_CREDENTIALS) {
        throw new Error('GOOGLE_TTS_CREDENTIALS eksik');
    }
    const voice = lang === 'en'
        ? { languageCode: 'en-US', name: 'en-US-Chirp3-HD-Aoede' }
        : { languageCode: 'tr-TR', name: 'tr-TR-Chirp3-HD-Aoede' };

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
        throw new Error(`Google TTS hatası: ${response.status} - ${errBody}`);
    }

    const data = await response.json();
    return {
        buffer: Buffer.from(data.audioContent, 'base64'),
        contentType: 'audio/mpeg'
    };
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Sadece POST isteği atılabilir.' });
    }

    const username = await sessionUsername(req);
    if (!username) {
        return res.status(401).json({ error: 'AUTH_REQUIRED' });
    }
    if (!(await checkRateLimit('tts:' + username, 120))) {
        return res.status(429).json({ error: 'RATE_LIMITED' });
    }

    const { text, lang } = req.body;
    if (!text) return res.status(400).json({ error: 'text zorunlu.' });
    if (String(text).length > 800) return res.status(400).json({ error: 'text çok uzun' });

    const rootDir = process.cwd();
    const isWin = process.platform === 'win32';
    const piperExecName = isWin ? 'piper.exe' : 'piper';
    const piperExecPath = path.join(rootDir, 'bin', 'piper', piperExecName);
    
    // Choose model based on language selection
    const modelName = lang === 'en' ? 'en_US-ljspeech-medium.onnx' : 'tr_TR-dfki-medium.onnx';
    const modelPath = path.join(rootDir, 'bin', 'models', modelName);

    console.log(`Piper TTS Synthesizing text "${text}" with lang="${lang}" using model="${modelName}"`);

    // Verify if Piper exists
    if (fs.existsSync(piperExecPath) && fs.existsSync(modelPath)) {
        try {
            // Apply execute permission for Linux if not already set (safety measure)
            if (!isWin) {
                try {
                    fs.chmodSync(piperExecPath, 0o755);
                } catch (e) {
                    console.warn('chmodSync error:', e.message);
                }
            }

            const audioBuffer = await new Promise((resolve, reject) => {
                const child = spawn(piperExecPath, ['-m', modelPath, '--output_file', '-']);
                const chunks = [];
                let errorOutput = '';

                child.stdout.on('data', (chunk) => chunks.push(chunk));
                child.stderr.on('data', (data) => {
                    errorOutput += data.toString();
                });

                child.on('close', (code) => {
                    if (code === 0) {
                        resolve(Buffer.concat(chunks));
                    } else {
                        reject(new Error(`Piper exited with code ${code}. Error details: ${errorOutput}`));
                    }
                });

                child.on('error', (err) => {
                    reject(err);
                });

                child.stdin.write(text);
                child.stdin.end();
            });

            res.setHeader('Content-Type', 'audio/wav');
            res.setHeader('Cache-Control', 'no-store');
            return res.send(audioBuffer);

        } catch (piperError) {
            console.error('Piper TTS failed, falling back to Google Cloud TTS:', piperError);
            try {
                const result = await googleTTSFallback(text, lang);
                res.setHeader('Content-Type', result.contentType);
                res.setHeader('Cache-Control', 'no-store');
                return res.send(result.buffer);
            } catch (fallbackError) {
                console.error('Google Cloud TTS fallback also failed:', fallbackError);
                return res.status(500).json({ error: 'TTS_FAILED', detail: fallbackError.message });
            }
        }
    } else {
        console.warn(`Piper executable or model not found at ${piperExecPath} / ${modelPath}. Falling back to Google Cloud TTS.`);
        try {
            const result = await googleTTSFallback(text, lang);
            res.setHeader('Content-Type', result.contentType);
            res.setHeader('Cache-Control', 'no-store');
            return res.send(result.buffer);
        } catch (fallbackError) {
            console.error('Google Cloud TTS fallback failed:', fallbackError);
            return res.status(500).json({ error: 'TTS_FAILED', detail: fallbackError.message });
        }
    }
}
