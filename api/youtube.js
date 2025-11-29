export default async function handler(req, res) {
    const { v } = req.query;
    const targetUrl = `https://www.youtube.com${req.url.replace('/api/youtube', '')}`;

    try {
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
        });

        const data = await response.text();
        res.status(200).send(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch from YouTube' });
    }
}
