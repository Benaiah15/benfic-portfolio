"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DynamicLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true); // Triggers on initial load too

  useEffect(() => {
    setIsLoading(true);
    
    // Strictly clear the loader after 800ms
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-zinc-950/95 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex items-center justify-center">
        <div className="w-20 h-20 rounded-full border-2 border-benfic-blue/20 border-t-benfic-blue animate-spin shadow-[0_0_30px_rgba(4,82,218,0.5)]"></div>
        <div className="absolute inset-4 rounded-full border border-benfic-blue animate-pulse"></div>
      </div>
      <p className="mt-8 text-xl font-black text-white tracking-widest animate-pulse uppercase">
        BENFIC
      </p>
    </div>
  );
}