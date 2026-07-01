export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const PEXELS_KEY = process.env.PEXELS_KEY;
    const { query } = req.query;

    try {
        const response = await fetch(`https://api.pexels.com/videos/search?query=${query}&per_page=5`, {
            headers: { Authorization: PEXELS_KEY }
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (e) { res.status(500).json({ error: e.message }); }
}