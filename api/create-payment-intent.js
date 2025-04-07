const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res){
    if (req.method === 'POST') {
        const { amount } = req.body;

        const amountInt = parseInt(amount);
        if (isNaN(amountInt)) {
            return res.status(400).json({ error: 'Amount must be a number' });
        }

        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amountInt,
                currency: 'aud',
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