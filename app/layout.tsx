import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VisitorTracker from "../components/VisitorTracker";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Benaiah Ajibade | Portfolio",
  description: "Graphic Designer and Web Developer portfolio for Benaiah Ajibade.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-zinc-950 text-white antialiased flex flex-col min-h-screen`}>
        {/* THE COOL TOP LOADER */}
        <NextTopLoader 
          color="#0452DA" 
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #0452DA,0 0 5px #0452DA"
        />
        
        <VisitorTracker />
        
        <Navbar />
        
        {/* PAGE FADE-IN WRAPPER */}
        <div className="pt-20 flex-grow animate-page-fade">
          {children}
        </div>

        <Footer />
      </body>
    </html>
  );
}