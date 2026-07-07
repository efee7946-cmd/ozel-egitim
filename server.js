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
app.use(express.static(__dirname));

app.post('/api/chat', (req, res) => {
    res.json({ candidates: [{ content: { parts: [{ text: "Bu lokal test ortamı cevabıdır." }] } }] });
});

app.post('/api/tts', async (req, res) => {
    const { text, lang } = req.body;
    if (!text) return res.status(400).json({ error: 'text zorunlu.' });

    const isWin = process.platform === 'win32';
    const piperExecName = isWin ? 'piper.exe' : 'piper';
    const piperExecPath = path.join(__dirname, 'bin', 'piper', piperExecName);
    
    const modelName = lang === 'en' ? 'en_US-ljspeech-medium.onnx' : 'tr_TR-dfki-medium.onnx';
    const modelPath = path.join(__dirname, 'bin', 'models', modelName);

    console.log(`[Local API] Piper TTS Synthesizing: "${text}" [${lang}]`);

    if (fs.existsSync(piperExecPath) && fs.existsSync(modelPath)) {
        try {
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
