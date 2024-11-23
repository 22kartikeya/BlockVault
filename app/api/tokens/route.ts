/* eslint-disable prefer-const */
// balance for the each token that supports
import { NextRequest, NextResponse } from "next/server";
// In this library @solana/spl-token the main token is solana and every other token is just a smart contract
// this library helps to interact with spl tokens, this library exports bunch of library to help wiht tokens
import { getAssociatedTokenAddress, getAccount} from "@solana/spl-token";
import { getSupportedTokens, connection } from "@/app/lib/constants";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

// we have to create ata's and pda's to find there balances
// ata => associated token account
// pda => program derived address
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get('address') as unknown as string; // this address has the address of the token
    const supportedTokens = await getSupportedTokens();
    const balances = await Promise.all(supportedTokens.map(token => getAccountBalance(token, address)))

    const tokens = supportedTokens.map((token, index) => ({
        ...token,
        balance: balances[index].toFixed(2),
        usdBalance: (balances[index] * Number(token.price)).toFixed(2)
    }));

    return NextResponse.json({
        tokens,
        totalBalance: tokens.reduce((acc, val) => acc + Number(val.usdBalance), 0).toFixed(2)
    })
}

async function getAccountBalance(token: {
    name: string;
    mint: string;
    native: boolean;
    decimals: number
}, address: string) {
    if (token.native) {
        let balance = await connection.getBalance(new PublicKey(address));
        console.log("balance is " + balance)
        return balance / LAMPORTS_PER_SOL;
    }
    // ata
    const ata = await getAssociatedTokenAddress(new PublicKey(token.mint), new PublicKey(address));

    try {
        const account = await getAccount(connection, ata);   
        // const mint = await getMint(connection, new PublicKey(token.mint));
        return Number(account.amount) / (10 ** token.decimals)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch(e) {
        return 0;
    }
}