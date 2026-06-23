import express from 'express';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/chat', (req, res) => {
    res.json({ candidates: [{ content: { parts: [{ text: "Bu lokal test ortamı cevabıdır." }] } }] });
});

app.post('/api/tts', (req, res) => {
    res.status(500).json({ error: "Lokal ortamda TTS destegi yok, fallback kullanilacak" });
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
