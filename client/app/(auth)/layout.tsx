import { ClerkProvider, SignIn, SignUp, UserButton } from "@clerk/nextjs"
import { Inter } from "next/font/google"
import '../globals.css'
//import { dark } from "@clerk/themes";

export const metadata = {
    title : 'Unigram',
    description : 'Unigram - a social media website'
}

const inter = Inter({ subsets: ["latin" ]})

/*function Header() {
    return (
        <header>
            <h1>{metadata.title}</h1>
            <SignIn/>
              
            <UserButton afterSignOutUrl="/"/>
            <SignUp/>
            <p>{metadata.description}</p>
        </header>
    
    )
}*/

export default function RootLayout({
    children ,
} : { 
    children : React.ReactNode 
}) {
    return (
    <ClerkProvider >
        <html lang="en">
            <body className={`${inter.className} bg-dark-1`}> {/*font */ }
                <div className="w-full flex justify-center items-center min-h-screen">
                {children}               
                </div>
            </body>
        </html>
    </ClerkProvider>
    )
}