import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./Navbar/page";
import Footer from "./Footer/page";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Lava gaming center",
  description: "gaming center",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
          <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{height:"100vh"}}
        >
        <Navbar/>
        
        {children}
        <Footer/>
      </body>
    </html>
  );
}
