import express from 'express';
import { mint } from './Mint.js';

const PORT = 3002;
const app = express();

app.use(express.json());

let result;

const stake = async (req, res) => {
    try {
        const {
            nativeTransfers,
            feePayer,
            type,
            transactionError,
        } = req.body;
        result = nativeTransfers;
        if(nativeTransfers){
            console.log(nativeTransfers);
        }
        // Ensure this is a valid transfer transaction without errors
        if (type !== "TRANSFER" || transactionError) {
            return res.status(400).send('Invalid or failed transaction');
        }

        const vault = "9XoN8zyTAXcpFbHFdUUBLQKLoLN5wNbuU5m3jZyL4Quw"; // Vault account to monitor

        // Find the native transfer to the vault
        const incomingTransfer = nativeTransfers.find(
            (transfer) => transfer.toUserAccount === vault
        );

        if (!incomingTransfer) {
            return res.status(202).send("No relevant transfers to the vault");
        }

        const { fromUserAccount: fromAddress, amount } = incomingTransfer;

        // Log for debugging
        console.log(`Transfer detected: From ${fromAddress} -> Vault ${vault}, Amount: ${amount}`);

        // Convert amount from lamports (1 SOL = 1,000,000,000 lamports)
        const amountInSOL = amount / 1e9;

        // Mint tokens based on the transfer
        await mint(fromAddress, amountInSOL);

        return res.status(200).send(
            `Token Minted Successfully! From: ${fromAddress}, Amount: ${amountInSOL} SOL`
        );
    } catch (error) {
        console.error('Error processing Helius webhook:', error);
        return res.status(500).send('Internal server error');
    }
};


app.get("/",(req, res)=>{
    if(result){
        console.log(result);
        res.send("Result : ", result);
    }
})



app.post('/hellius', stake );


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
