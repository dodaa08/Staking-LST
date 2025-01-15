import { mintTo } from "@solana/spl-token";
import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import base58 from "bs58";

// Constants
const Token_Mint_Id = new PublicKey("yUfYfn8gTr2XnMG2FdgVyFhwLKhjh9n4Pu8THQDQ5Ln");
const connection = new Connection("https://devnet.helius-rpc.com/?api-key=5dbeddb8-0a08-4291-8020-5b72d355ad04");

// Decode the private key (consider using environment variables for security)
const privateKey = "45bzrYLdT7d4aR4HcXFF7AzcrKpyny2LegUEETz9yjvfBHKnX3wSZWvjrcTD12rdQRYYFEY83TSnCuxKj7dhshN3";
const payerKeypair = Keypair.fromSecretKey(base58.decode(privateKey));

// Mint function
export const mint = async (fromAddress, amount) => {
  try {
    // Validate inputs
    if (!fromAddress || !PublicKey.isOnCurve(fromAddress)) {
      throw new Error("Invalid recipient address");
    }

    if (amount <= 0 || !Number.isInteger(amount)) {
      throw new Error("Invalid amount. Must be a positive integer.");
    }

    const recipientAddress = new PublicKey(fromAddress);

    // Mint tokens
    await mintTo(
      connection,         // Solana connection
      payerKeypair,       // Payer's keypair
      Token_Mint_Id,      // Token Mint ID
      recipientAddress,   // Recipient's token account
      payerKeypair,       // Authority to mint tokens
      amount              // Amount to mint (adjust for decimals if needed)
    );

    console.log(`Successfully minted ${amount} tokens to ${fromAddress}`);
  } catch (error) {
    console.error("Error minting tokens:", error.message);
  }
};
