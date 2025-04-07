export default function handler(req, res) {
    if (req.method === 'GET') {
        res.status(200).json({ message: 'Hello from Vercel Serverless Function!' });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}