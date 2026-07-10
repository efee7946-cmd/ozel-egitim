import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { sessionUsername, guestCallAllowed } from './_auth.js';
import { checkRateLimit } from './_rateLimit.js';
import { allowOrigin } from './_cors.js';

const GUEST_TTS_CAP = 80;

export default async function handler(req, res) {
    allowOrigin(req, res);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Sadece POST isteği atılabilir.' });
    }

    let actor = await sessionUsername(req);
    if (!actor) actor = await guestCallAllowed(req, 'tts_calls', GUEST_TTS_CAP);
    if (!actor) {
        return res.status(401).json({ error: 'AUTH_REQUIRED' });
    }
    if (!(await checkRateLimit('tts:' + actor, 120))) {
        return res.status(429).json({ error: 'RATE_LIMITED' });
    }

    const { text, lang } = req.body;
    if (!text) return res.status(400).json({ error: 'text zorunlu.' });
    if (String(text).length > 800) return res.status(400).json({ error: 'text çok uzun' });

    const rootDir = process.cwd();

    // Read config to find the active model ID
    const configPath = path.join(rootDir, 'piper-config.json');
    if (!fs.existsSync(configPath)) {
        console.error('piper-config.json not found!');
        return res.status(500).json({ error: 'CONFIG_MISSING' });
    }
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    const isWin = process.platform === 'win32';
    const piperExecName = isWin ? 'piper.exe' : 'piper';
    const piperExecPath = path.join(rootDir, 'bin', 'piper', piperExecName);
    
    // Select model from config
    const voiceConfig = lang === 'en' ? config.voices.en : config.voices.tr;
    const modelName = `${voiceConfig.id}.onnx`;
    const modelPath = path.join(rootDir, 'bin', 'models', modelName);

    console.log(`Piper TTS Synthesizing text "${text}" with lang="${lang}" using model="${modelName}"`);

    // Verify if Piper exists
    if (!fs.existsSync(piperExecPath) || !fs.existsSync(modelPath)) {
        console.error(`Piper executable or model not found at ${piperExecPath} / ${modelPath}.`);
        return res.status(500).json({ error: 'TTS_ENGINE_MISSING' });
    }

    try {

        const audioBuffer = await new Promise((resolve, reject) => {
            const args = ['-m', modelPath, '--output_file', '-'];
            if (voiceConfig.length_scale) {
                args.push('--length_scale', String(voiceConfig.length_scale));
            }
            const child = spawn(piperExecPath, args);
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
