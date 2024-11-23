'use client';
import { signIn, useSession } from "next-auth/react";
import { GoogleButton, SecondaryButton } from './Button';
import { useRouter } from "next/navigation";

export const Hero = () => {
    const session = useSession();
    const router = useRouter(); // for navigation to the other pages in nextjs
    return <div className="mt-40">
        <div className ="text-5xl font-semibold">
            <span>
                The Indian Cryptocurrency
            </span> 
            <span className="text-blue-500 pl-4">
                Revolution
            </span>
        </div>
        <div className="flex justify-center pt-4 text-2xl text-slate-500">
            Create a frictionless wallet form India with just a Google Account.
        </div>
        <div className="flex justify-center pt-2 text-2xl text-slate-500">
            Convert your INR into Cryptocurrency
        </div>
        <div 
        className="pt-8 flex justify-center">
            {session.data?.user ? <SecondaryButton onClick={() => {
                router.push("/dashboard"); // to navigate this page to the dashboard
            }}>
                Go to Dashboard
            </SecondaryButton> : <GoogleButton onClick={() => {
                signIn("google");
            }}>
                Login with Google
            </GoogleButton>}
        </div>
    </div>
}