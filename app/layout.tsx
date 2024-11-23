import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Appbar } from "./components/Appbar";
import { Providers } from "./providers";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "BlockVault",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers> {/* to use hook useSession from next next-auth hook */}
          {/* and to also avoid client component */}
          <Appbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
 