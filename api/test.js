export default function handler(req, res) {
    if (req.method === 'GET') {
        res.status(200).json({ message: process.env.STRIPE_SECRET_KEY });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}