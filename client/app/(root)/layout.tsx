import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import TopBar from "@/components/shared/Topbar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";
import Bottombar from "@/components/shared/Bottombar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title : 'Unigram',
  description : 'Unigram - a social media website'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={inter.className}>
        <TopBar/>

        <main className="flex flow-row">
          <LeftSidebar/>

          <section className="main-container">
            <div className="w-full max-w-4xl">
              {children}
            </div>
          </section>
          <RightSidebar/>
        </main>
        <Bottombar/> 
        </body>
    </html>
    </ClerkProvider>
  );
}
 