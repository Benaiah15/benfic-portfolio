import { siteConfig } from "../config/site";

interface PageHeroProps {
  title: string;
  span?: string; // Optional third part of the title to color blue
}

export default function PageHero({ title, span }: PageHeroProps) {
  return (
    <section className="relative flex min-h-[40vh] flex-col items-center justify-center px-6 overflow-hidden">
        
      {/* 1. Futuristic Tech Animation (Reusable from Home Page) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/bg-grid.png')] bg-center bg-repeat-y opacity-10 animate-grid-lines"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-benfic-blue/10 blur-[128px]"></div>
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-benfic-blue/60 to-transparent blur-sm animate-glow-line"></div>
        <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-benfic-blue/60 to-transparent animate-glow-line"></div>
      </div>

      {/* Hero Content (z-10 to be above the animation) */}
      <div className="text-center z-10 relative">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl text-white">
          {title} {span && <span className="text-benfic-blue">{span}</span>}
        </h1>
        {/* We keep this section minimal, the main page will handle description, etc. */}
      </div>
    </section>
  );
}