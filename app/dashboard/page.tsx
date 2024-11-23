// This is a server component
import { getServerSession } from "next-auth";
import { ProfileCard } from "../components/ProfileCard";
import db from '@/app/db';
import {authConfig} from "../lib/auth"
 

// The main problem:
// next auth session does not contain a uuid for default
async function getUserWallet(){
    const session = await getServerSession(authConfig);
    const userWallet = await db.solWallet.findFirst({
        where: {
            userId: session?.user?.uid
        },
        select: {
            publicKey: true
        }
    })
    if(!userWallet){
        return {
            error: "No solana wallet found associated to the user"
        }
    }
    return  {error: null, userWallet};
}

// eslint-disable-next-line import/no-anonymous-default-export, react/display-name
export default async function(){
    const userWallet = await getUserWallet();

    // for error check
    // realistically it will never happen
    if(userWallet.error || !userWallet.userWallet?.publicKey){
        return <>No Solana wallet found</>
    }

    return <div>
        <ProfileCard publicKey={userWallet.userWallet?.publicKey} />
    </div>
}