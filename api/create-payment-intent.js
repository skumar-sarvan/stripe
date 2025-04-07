export default async function handler(req, res) {
    console.log("Received request to create-payment-intent");

    if(req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { amount, currency } = req.body;

        console.log("Amount received:", amount);

        res.status(200).json({amount: amount, currency: currency});
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }   
}