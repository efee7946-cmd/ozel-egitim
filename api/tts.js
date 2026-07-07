import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { sessionUsername } from './_auth.js';
import { checkRateLimit } from './_rateLimit.js';

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
    if (!fs.existsSync(piperExecPath) || !fs.existsSync(modelPath)) {
        console.error(`Piper executable or model not found at ${piperExecPath} / ${modelPath}.`);
        return res.status(500).json({ error: 'TTS_ENGINE_MISSING' });
    }

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
        console.error('Piper TTS failed:', piperError);
        return res.status(500).json({ error: 'TTS_FAILED', detail: piperError.message });
    }
}
