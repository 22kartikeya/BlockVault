/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import GoogleProvider from "next-auth/providers/google"; // google provider
// signup/ signin with google
import db from "@/app/db";
// Keypair is pair of keys a public and private key available in every blockchain
import { Keypair } from "@solana/web3.js";
import { Session } from 'next-auth';

// created a custom session wiht uid
export interface session extends Session {
    user: {
        email: string;
        name: string;
        image: string;
        uid: string;
    };
}
export const authConfig = ({
    secret: process.env.NEXTAUTH_SECRET || 'secr3t', // secret key to decrypt jwt
    providers:[
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        })
    ],
    callbacks: {
        // a session here is temporary link between client and the server
        session: ({ session, token }: any): session => {
            const newSession: session = session as session;
            if (newSession.user && token.uid) {
              // @ts-ignore
              newSession.user.uid = token.uid ?? "";
            }
            return newSession!;
        },
        async jwt({token, account, profile}: any) {
            const user = await db.user.findFirst({
                where: {
                    sub: account?.providerAccountId ?? ""
                }
            })
            if(user) {
                token.uid = user.id;
            }
            return token;
        },
        async signIn({ user, account, profile, email, credentials }: any) {
            if(account?.provider == "google"){
                const email = user.email;
                if(!email){
                    return false;
                }
                const userDb = await db.user.findFirst({
                    where: {
                        username: email,
                    }
                })

                if(userDb){
                    return true;
                }

                // A public-private key pair is a fundamental concept in cryptography used for secure communication, encryption, and digital signatures.
                // It is based on asymmetric cryptography, where the keys are mathematically linked but serve different roles.
                // Public Key: shared openly and can be distributed to anyone. Used for encryption
                // Private key: kept secret and should never be shared. Used for decryption.
                // In the context of blockchain, a public-private key pair plays a crucial role in ensuring secure, decentralized, and tamper-proof operations.
                // It is used for identification, secure transactions, and ownership management in a blockchain network.
                const keypair  = Keypair.generate(); // to generate public-private key
                // public key and private key variables should be constructed to save the keys
                const publicKey = keypair.publicKey.toBase58(); // toBase58() function is to convert the public key in base58 can also be converted using toString() but base58 is famously used.
                const privateKey = keypair.secretKey; // private key is Uint8Array format it is array of integer of 8 bits (from 0-255) total array length of 64.
                // Solana use hashing algorithm of "ED25519" for saving public and private key
                // Any library helps you to create ED25519 hashing can be used not only solana
                await db.user.create({
                    data: {
                        username: email,
                        name: profile?.name,
                        //@ts-ignore
                        profilePicture: profile?.picture,
                        provider: "Google",
                        sub: account.providerAccountId, // saving google provided id in the database
                        // also needs to hava solana wallet for blockchain
                        // public and private key should be created that is valid in solana blockchain
                        // for that we are using solana library "@solana/web3.js" this is a crypto graphic library to help get connected to the bockchain
                        solWallet: { 
                            create: {
                                publicKey: publicKey, 
                                privateKey: privateKey.toString(),
                            }
                        },
                        // inr wallet for inr
                        inrWallet: {
                            create: {
                                balance: 0 // jus balance for now
                            }
                        }
                    }
                })
                return true;
            }
            return false;
        },
    }
})