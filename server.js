const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(__dirname));

// Simulated endpoints for testing local app without Vercel Serverless environment setup
app.post('/api/chat', (req, res) => {
    res.json({ candidates: [{ content: { parts: [{ text: "Bu lokal test ortamı cevabıdır." }] } }] });
});

app.post('/api/tts', (req, res) => {
    res.status(500).json({ error: "Lokal ortamda TTS destegi yok, fallback kullanilacak" });
});

app.get('/api/video', (req, res) => {
    const fallbackVideo = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
    res.json({
        videos: [
            {
                video_files: [
                    {
                        file_type: 'video/mp4',
                        height: 480,
                        link: fallbackVideo
                    }
                ]
            }
        ]
    });
});

// Bind to 0.0.0.0
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
