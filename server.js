import express from 'express';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import { spawn } from 'child_process';
import path from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.use(express.json());

// Depo kökünü servis etme — 0.0.0.0'a bağlandığımız için kökteki her dosya
// (android/app/keystore.jks dahil) yerel ağa açılır. Yalnızca uygulamanın
// gerçekten istediği dosyalar servis edilir.
const STATIC_FILES = [
    'index.html', 'error.html', 'privacy.html', 'gizlilik.html',
    'destek.html', 'delete-account.html',
    'script.js', 'style.css', 'aac.css', 'aac-data.js', 'db-client.js',
    'avatar3d.js', 'sw.js', 'avatar.png', 'bear_avatar.glb',
];
const STATIC_DIRS = ['aac-assets', 'map-assets', 'models', 'store-assets'];

app.get('/', (_req, res) => res.sendFile(path.join(__dirname, 'index.html')));
for (const file of STATIC_FILES) {
    app.get('/' + file, (_req, res) => res.sendFile(path.join(__dirname, file)));
}
for (const dir of STATIC_DIRS) {
    app.use('/' + dir, express.static(path.join(__dirname, dir)));
}

app.post('/api/chat', (req, res) => {
    res.json({ candidates: [{ content: { parts: [{ text: "Bu lokal test ortamı cevabıdır." }] } }] });
});

app.post('/api/tts', async (req, res) => {
    const { text, lang } = req.body;
    if (!text) return res.status(400).json({ error: 'text zorunlu.' });

    // Read config
    const configPath = path.join(__dirname, 'piper-config.json');
    if (!fs.existsSync(configPath)) {
        return res.status(500).json({ error: 'CONFIG_MISSING', detail: 'piper-config.json is missing.' });
    }
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    const isWin = process.platform === 'win32';
    const piperExecName = isWin ? 'piper.exe' : 'piper';
    const piperExecPath = path.join(__dirname, 'bin', 'piper', piperExecName);
    
    const voiceConfig = lang === 'en' ? config.voices.en : config.voices.tr;
    const modelName = `${voiceConfig.id}.onnx`;
    const modelPath = path.join(__dirname, 'bin', 'models', modelName);

    console.log(`[Local API] Piper TTS Synthesizing: "${text}" [${lang}] using model="${modelName}"`);

    if (fs.existsSync(piperExecPath) && fs.existsSync(modelPath)) {
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
                        reject(new Error(`Piper exited with code ${code}. Error: ${errorOutput}`));
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

        } catch (error) {
            console.error('[Local API] Piper synthesis failed:', error);
            return res.status(500).json({ error: 'TTS_FAILED', detail: error.message });
        }
    } else {
        console.warn(`[Local API] Piper exec or model not found at ${piperExecPath} or ${modelPath}`);
        return res.status(500).json({ error: 'PIPER_NOT_FOUND', detail: 'Piper or model files are missing.' });
    }
});

app.get('/api/video', (req, res) => {
    res.json({
        videos: [{
            video_files: [{
                file_type: 'video/mp4',
                height: 480,
                link: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
            }]
        }]
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
});
