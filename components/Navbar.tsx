"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "../config/site";
import { Menu, X } from "lucide-react"; // Importing the new mobile icons

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Helper function to check if a link is active
  const isActive = (href: string) => pathname === href;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-11 h-11 rounded-full bg-white overflow-hidden border-[1.5px] border-white">
                <Image 
                  src="/logo.png" 
                  alt="Benfic Logo" 
                  width={44} 
                  height={44} 
                  // Sub-pixel centering for your sharp designer's eye
                  className="scale-[1.4] object-cover translate-x-[0.5px] translate-y-[0.5px]" 
                />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Benfic
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {siteConfig.navItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className={`text-sm font-medium transition-colors ${
                    isActive(item.href) ? "text-white font-semibold" : "text-zinc-300 hover:text-benfic-blue"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Get in Touch Button */}
          <div className="hidden md:block">
            <Link 
              href="/contact" 
              className="rounded-md bg-benfic-blue px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 shadow-[0_0_15px_rgba(4,82,218,0.5)]"
            >
              Get in Touch
            </Link>
          </div>
          
          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-benfic-blue focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
          <div className="px-6 pt-4 pb-6 space-y-4 flex flex-col items-center text-center">
            {siteConfig.navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
                className={`w-full py-2 text-lg font-medium transition-colors ${
                  isActive(item.href) ? "text-white font-semibold" : "text-zinc-300 hover:text-benfic-blue"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {/* Mobile Get in Touch Button */}
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center mt-4 rounded-md bg-benfic-blue px-5 py-3 text-lg font-semibold text-white transition-all hover:bg-blue-700 shadow-[0_0_15px_rgba(4,82,218,0.5)]"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}