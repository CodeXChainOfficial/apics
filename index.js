import { calculateCirculationSupply } from './api/get.js'; // Adjust the path as necessary

export default async function(req, res) {
    try {
        console.log("Starting to process request...");
        const circulationSupply = await calculateCirculationSupply();
        console.log("Circulation supply calculated:", circulationSupply);
        if (circulationSupply === null) {
            console.error("Failed to calculate circulationSupply.");
            return res.status(500).json({ error: 'Failed to calculate circulationSupply. Check logs for details.' });
        }
        res.status(200).json({ circulationSupply });
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
