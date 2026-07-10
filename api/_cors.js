export function allowOrigin(req, res) {
    const allowed = (process.env.ALLOWED_ORIGIN || '')
        .split(',').map(o => o.trim()).filter(Boolean);
    const origin = req.headers.origin;
    if (!allowed.length) {
        res.setHeader('Access-Control-Allow-Origin', '*');
    } else if (origin && allowed.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
    } else {
        res.setHeader('Access-Control-Allow-Origin', allowed[0]);
    }
}
