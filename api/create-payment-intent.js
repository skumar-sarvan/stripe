const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    const AUTH_TOKEN = process.env.API_AUTH_TOKEN;

    if (!AUTH_TOKEN) {
        return res.status(500).json({ error: 'API_AUTH_TOKEN is not set' });
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (token !== AUTH_TOKEN) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'POST') {
        const { amount, customerId } = req.body;

        // ✅ Check if customer is missing
        if (customerId === undefined) {
            return res.status(400).json({ error: 'Customer is required' });
        }

        // ✅ Check if amount is missing or not a valid number
        if (amount === undefined || isNaN(parseInt(amount))) {
            return res.status(400).json({ error: 'Amount is required and must be a valid number' });
        }

        const amountInt = parseInt(amount);

        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amountInt,
                currency: 'aud',
                customer: customerId,
                setup_future_usage: 'off_session'
            });
            return res.status(200).json({ clientSecret: paymentIntent.id });
        } catch (error) {
            console.error('Stripe error:', error);
            return res.status(500).json({ error: error.message });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}