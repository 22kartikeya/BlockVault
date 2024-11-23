'use client'; // this is important
// The "use client"; directive in Next.js is a special marker introduced in Next.js 13 to explicitly define a Client Component when using the App Router. This directive tells Next.js to render the component on the client side instead of the server side.

// we are using this so that we don't have to add whole component again and again to the every page
// this file is for all of the context providers
import { SessionProvider } from "next-auth/react";

export const Providers = ({children}: {children: React.ReactNode}) => {
    return <SessionProvider>
        {children}
    </SessionProvider>
}