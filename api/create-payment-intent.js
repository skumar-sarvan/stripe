const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res){
    if(req.method === 'POST'){
        const { amount } = req.body;

        if (!amount) {
            return res.status(400).json({ error: 'Amount is required in body' });
        }

        try{
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: 'aud',
            });
            res.status(200).json({clientSecret: paymentIntent.client_secret})
        }
        catch(error){
            res.status(500).json({error: error.message})
        }
    }
    else{
        res.status(405).json({error: 'Method not allowed'})
    }
}