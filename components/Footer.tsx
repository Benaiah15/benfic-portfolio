import { siteConfig } from "../config/site";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 py-10 mt-auto z-10 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-sm text-zinc-500">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
        <div className="flex gap-6 flex-wrap justify-center">
          {Object.entries(siteConfig.socials).map(([platform, url]) => (
            <a 
              key={platform} 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm font-medium text-zinc-400 hover:text-benfic-blue capitalize transition-colors"
            >
              {platform}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}