

import express from 'express';
import fetch from 'node-fetch';

const app = express();

async function fetchBalance(address) {
    try {
        const response = await fetch(`https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=0x1c3ba6cF2676cc795db02a3b2093E5076f5F330E&address=${address}&apikey=9AIZGEBJCA14B47UW7Z36166HF2RXMMYA2`);
        const data = await response.json();
        const balance = parseFloat(data.result);
        return balance;
    } catch (error) {
        console.error('Error fetching balance:', error);
        throw error;
    }
}

async function fetchTotalSupply() {
    try {
        const response = await fetch('https://api.bscscan.com/api?module=stats&action=tokensupply&contractaddress=0x1c3ba6cF2676cc795db02a3b2093E5076f5F330E&apikey=9AIZGEBJCA14B47UW7Z36166HF2RXMMYA2');
        const data = await response.json();
        const balance = parseFloat(data.result);
        return balance;
    } catch (error) {
        console.error('Error fetching total supply:', error);
        throw error;
    }
}

const contractAddresses = [
    "0xc72CE48c886838b2D5ca64d6c415C3818783A96a",
    "0x6664ECfd0f6135e2b6E53cFA467a37875158c61A",
    "0xEcA47C4E15f3a25F5Ed582C32bAf4822Adcb61f4",
    "0xC7f31E4122802EE56ED4D738C04aDEAC253059ec",
    "0x784e5b71EFf1FCb50bE90525152C6c438A0F3c00",
    "0x4276130AA0087dacDEFF7782cc9cD15E48688C55",
    "0x4982085C9e2F89F2eCb8131Eca71aFAD896e89CB",
    "0x3122C2B21DE5986bBf09c954A1349e1c78CF3f5f",
    "0x4487A472636c0E2Bd45d06f00895802Fe458d783",
    "0x2e8F79aD740de90dC5F5A9F0D8D9661a60725e64",
    "0x06fA82d33220616dc53F4557B4b3Df4F8043a6d4",
    "0xD98287c1A455Fe4B57Dc2932F8B6b5d8938C7255",
    "0x545AC66C5780f6685b440EE8836263db8b56903d"


    
];

async function calculateCirculationSupply() {
    try {
        const totalSupply = await fetchTotalSupply();
        let circulationSupply = totalSupply;

        for (const address of contractAddresses) {
            const balance = await fetchBalance(address);
            circulationSupply -= balance;
        }

        circulationSupply /= 1e15; // Divide by 1e15 to remove 15 zeros
        return circulationSupply;
    } catch (error) {
        console.error('Error calculating circulation supply:', error);
        throw error;
    }
}

app.get('/get', async (req, res) => {
    try {
        const circulationSupply = await calculateCirculationSupply();
        res.json({ circulationSupply });
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
