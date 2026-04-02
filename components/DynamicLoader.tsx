"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function DynamicLoader() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  useEffect(() => {
    if (pathname !== prevPathname) {
      setIsLoading(true); // Navigation started
      setPrevPathname(pathname);
      
      // We simulate navigation time so the flashy loader is cool/visible.
      const timer = setTimeout(() => {
        setIsLoading(false); // Navigation finished
      }, 1200); // flashy duration

      return () => clearTimeout(timer);
    }
  }, [pathname, prevPathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-950/95 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative flex items-center justify-center">
        {/* Flashy Neon Blue Spinner */}
        <div className="w-24 h-24 rounded-full border-2 border-benfic-blue/20 border-t-benfic-blue animate-spin shadow-[0_0_30px_rgba(4,82,218,0.5)]"></div>
        {/* Pulse inner ring */}
        <div className="absolute inset-4 rounded-full border border-benfic-blue animate-pulse"></div>
      </div>
      <p className="mt-8 text-2xl font-black text-white tracking-widest animate-pulse">
        TRUST <span className="text-benfic-blue">STUDIO</span>
      </p>
      <p className="mt-2 text-zinc-500 text-xs tracking-wider">CREATIVITY. CODE. SOLUTION.</p>
    </div>
  );
}