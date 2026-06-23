export default async function handler(req, res) {
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