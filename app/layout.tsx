import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VisitorTracker from "../components/VisitorTracker"; // Added import

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
      {/* Added flex and min-h-screen to push the footer to the absolute bottom */}
      <body className={`${inter.className} bg-zinc-950 text-white antialiased flex flex-col min-h-screen`}>
        {/* The invisible tracker that pings your database */}
        <VisitorTracker />
        
        <Navbar />
        {/* flex-grow ensures the content takes up the middle space */}
        <div className="pt-20 flex-grow">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}