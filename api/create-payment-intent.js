const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    try {
        const AUTH_TOKEN = process.env.API_AUTH_TOKEN;

        if (!AUTH_TOKEN) {
            return res.status(500).json({ error: 'API_AUTH_TOKEN is not set' });
        }

        const token = req.headers.authorization?.split(' ')[1];
        if (token !== AUTH_TOKEN) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({ error: 'Request body must be valid JSON' });
        }
        
        const { amount, customerId } = req.body;

        if (typeof customerId !== 'string' || customerId.trim() === '') {
            return res.status(400).json({ error: 'Customer ID must be a non-empty string' });
        }

        // ✅ Check if amount is missing or not a valid number
        if (amount === undefined || isNaN(parseInt(amount))) {
            return res.status(400).json({ error: 'Amount is required and must be a valid number' });
        }

        const amountFloat = parseFloat(amount);
        const amountInt = Math.round(amountFloat * 100);

        // ✅ Check if amount is a positive integer
        if (isNaN(amountInt) || amountInt <= 0) {
            return res.status(400).json({ error: 'Amount must be a positive integer' });
        }
    
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInt,
            currency: 'aud',
            customer: customerId,
            setup_future_usage: 'off_session'
        });
        
        return res.status(200).json({ clientSecret: paymentIntent.client_secret	 }); 
    }
    catch (error) {
        console.error('Stripe error:', error);
        return res.status(500).json({ error: error.message });
    }
}