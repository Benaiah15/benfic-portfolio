import PageHero from "../../components/PageHero";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHero title="About" span="Me" />

      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto w-full z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Futuristic Image Container */}
          <div className="relative group">
            {/* Outer glowing futuristic border */}
            <div className="absolute -inset-1 bg-gradient-to-r from-benfic-blue via-blue-500 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            
            {/* Inner tech border frame */}
            <div className="relative aspect-square rounded-2xl bg-zinc-900 border-2 border-zinc-800/50 p-2 overflow-hidden flex items-center justify-center">
              
              {/* Corner decorative tech accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-benfic-blue z-20"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-benfic-blue z-20"></div>
              
              {/* Placeholder for your actual photo */}
              <div className="w-full h-full bg-zinc-950 rounded-xl relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                <div className="absolute inset-0 flex items-center justify-center text-zinc-700 font-medium">
                  [Upload Your Photo Here]
                </div>
                {/* Subtle blue overlay */}
                <div className="absolute inset-0 bg-benfic-blue/10 mix-blend-overlay"></div>
              </div>
            </div>
          </div>

          {/* Right Side: Information */}
          <div className="bg-zinc-950/50 backdrop-blur-sm p-8 rounded-3xl border border-zinc-800/50">
            <h2 className="text-2xl font-bold tracking-tight text-white mb-6">
              Engineering Digital Experiences
            </h2>
            <p className="text-lg leading-8 text-zinc-400 mb-6">
              I am a passionate designer and developer who bridges the gap between striking visual aesthetics and flawless technical execution. With a strong foundation in both graphic design and modern web technologies, including <span className="text-benfic-blue font-semibold">Wordpress Development</span>, I don't just build websites—I engineer digital experiences.
            </p>
            <p className="text-lg leading-8 text-zinc-400">
              Whether I am crafting a brand identity from scratch or architecting a full-stack Next.js application, my goal is always the same: to create clean, scalable, and visually impactful solutions that leave a lasting impression.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}