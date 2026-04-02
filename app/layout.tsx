import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VisitorTracker from "../components/VisitorTracker";
import DynamicLoader from "../components/DynamicLoader"; // New client component for detection

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Benaiah Ajibade | Creative Studio",
  description: "Creativity That Speaks. Designs That Sell. Specialized in Web, Graphics, and WordPress Dev.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-zinc-950 text-white antialiased flex flex-col min-h-screen`}>
        {/* The cool flashy middle-screen overlay loader */}
        <DynamicLoader /> 
        
        <VisitorTracker />
        <Navbar />

        {/* Dynamic Entry Fade for pages to feel cooler */}
        <div className="pt-20 flex-grow animate-in fade-in duration-500">
          {children}
        </div>

        <Footer />
      </body>
    </html>
  );
}