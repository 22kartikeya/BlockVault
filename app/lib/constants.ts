import { Connection } from "@solana/web3.js"
import axios from "axios";
import { SUPPORTED_TOKENS } from "./tokens";

let LAST_UPDATED: number | null = null;
let prices: {[key: string]: {
    price: string;
}} = {};
const TOKEN_PRICE_REFRESH_INTERVAL = 60 * 1000;

// This line sets up a connection to the mainnet-beta cluster of the Solana blockchain. The mainnet-beta is the live Solana network where actual transactions and decentralized applications operate.
// This is the URL of the Solana mainnet-beta RPC endpoint.
// RPC (Remote Procedure Call) endpoints are used to communicate with Solana nodes to submit transactions and retrieve blockchain data.
export const connection = new Connection("https://solana-mainnet.g.alchemy.com/v2/-wCxlQxbWbXdCh7VtI9GHTiuGFj8LPwx")

export async function getSupportedTokens() {
    if (!LAST_UPDATED || new Date().getTime() - LAST_UPDATED < TOKEN_PRICE_REFRESH_INTERVAL){
        try {
            const response = await axios.get("https://price.jup.ag/v6/price?ids=SOL,USDC,USDT");
            prices = response.data.data;
            LAST_UPDATED = new Date().getTime();
        }catch(e) {
            console.log(e);
        }
    }
    return SUPPORTED_TOKENS.map(s => {
        const tokenPrice = prices[s.name]?.price || "0";
        if (!prices[s.name]) {
            console.warn(`Price data missing for token: ${s.name}`);
        }
        return {
            ...s,
            price: tokenPrice
        };
    });
}

getSupportedTokens();