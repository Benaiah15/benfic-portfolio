import connectToDatabase from "../../../../lib/mongodb";
import Project from "../../../../models/Project";
import Link from "next/link";

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  await connectToDatabase();

  const project = await Project.findById(resolvedParams.id).lean();

  if (!project) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
        <div className="text-center">
            <h1 className="text-5xl font-black text-benfic-blue mb-4">404</h1>
            <h2 className="text-2xl font-bold">Case Study Not Found</h2>
            <Link href="/portfolio" className="mt-6 inline-block text-zinc-400 hover:text-white transition-colors">← Back to Portfolio</Link>
        </div>
      </div>
    );
  }

  const isWebOrWP = project.category === "Web Development" || project.category === "Wordpress Development";

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-24 pb-20">
      
      {/* 1. HEADER SECTION */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center mb-16 animate-in fade-in slide-in-from-bottom-4">
        <div className="inline-block px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-benfic-blue text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(4,82,218,0.2)]">
          {project.category} {project.graphicDesignType ? `• ${project.graphicDesignType}` : ""}
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-6 drop-shadow-lg leading-tight text-white">{project.title}</h1>
        <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed whitespace-pre-wrap">
          {project.description}
        </p>
        
        {project.liveLink && (
          <a 
            href={project.liveLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block mt-8 px-8 py-4 rounded-full bg-benfic-blue text-white font-bold tracking-widest uppercase hover:bg-blue-600 shadow-[0_0_20px_rgba(4,82,218,0.4)] transition-all hover:-translate-y-1"
          >
            Visit Live Project
          </a>
        )}
      </div>

      {/* 2. MAIN COVER IMAGE */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-24 animate-in fade-in duration-700 delay-200">
        <div className="w-full aspect-[16/9] md:aspect-[21/9] rounded-[2rem] overflow-hidden border border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-zinc-900">
          {project.imageUrl ? (
            <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-600">No Cover Image</div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        
        {/* 3. CONDITIONAL WEB/WP MOCKUPS */}
        {isWebOrWP && (project.viewLaptopImageUrl || project.viewTabletImageUrl || project.viewMobileImageUrl) && (
          <div className="mb-24">
            <h2 className="text-3xl font-black text-center mb-12 text-white">Responsive <span className="text-benfic-blue">Views</span></h2>
            
            {project.viewLaptopImageUrl && (
              <div className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden border-4 border-zinc-800 bg-zinc-900 mb-8 shadow-2xl">
                 <img src={project.viewLaptopImageUrl} alt="Laptop View" className="w-full h-auto" />
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {project.viewTabletImageUrl && (
                <div className="rounded-[2rem] overflow-hidden border-[6px] border-zinc-800 bg-zinc-900 shadow-2xl mx-auto max-w-[400px]">
                   <img src={project.viewTabletImageUrl} alt="Tablet View" className="w-full h-auto" />
                </div>
              )}
              {project.viewMobileImageUrl && (
                <div className="rounded-[2rem] overflow-hidden border-[6px] border-zinc-800 bg-zinc-900 shadow-2xl mx-auto max-w-[250px]">
                   <img src={project.viewMobileImageUrl} alt="Mobile View" className="w-full h-auto" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. TECHNOLOGIES / PLUGINS LIST */}
        {((project.technologiesUsed && project.technologiesUsed.length > 0) || project.wpThemeUsed) && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 mb-24 flex flex-col md:flex-row gap-8 items-center justify-center text-center md:text-left">
            <div className="w-full">
              <h3 className="text-benfic-blue font-bold uppercase tracking-widest text-sm mb-4">Core Stack / Tools Used</h3>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {project.category === "Web Development" && project.technologiesUsed.map((tech: string, i: number) => (
                  <span key={i} className="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-300 font-medium">{tech}</span>
                ))}
                {project.category === "Wordpress Development" && (
                  <>
                    {project.wpThemeUsed && (
                        <span className="px-4 py-2 bg-zinc-950 border border-benfic-blue/50 text-benfic-blue rounded-lg text-sm font-bold shadow-[0_0_10px_rgba(4,82,218,0.2)]">{project.wpThemeUsed} (Theme)</span>
                    )}
                    {project.wpPluginsUsed?.map((plugin: string, i: number) => (
                      <span key={i} className="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-300 font-medium">{plugin}</span>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 5. PROBLEM & SOLUTION */}
        {(project.problemSolved || project.solutionText) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            {project.problemSolved && (
              <div className="bg-zinc-900/30 p-8 rounded-3xl border border-zinc-800/50 hover:border-red-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white">The Problem</h3>
                </div>
                <p className="text-zinc-400 leading-relaxed whitespace-pre-wrap">{project.problemSolved}</p>
              </div>
            )}
            {project.solutionText && (
              <div className="bg-zinc-900/30 p-8 rounded-3xl border border-zinc-800/50 hover:border-green-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white">The Solution</h3>
                </div>
                <p className="text-zinc-400 leading-relaxed whitespace-pre-wrap">{project.solutionText}</p>
              </div>
            )}
          </div>
        )}

        {/* 6. PROCESS BREAKDOWN & MULTIPLE IMAGES */}
        {(project.processBreakdown || (project.processImages && project.processImages.length > 0)) && (
          <div className="mb-24">
            {project.processBreakdown && (
              <div className="max-w-4xl mx-auto text-center mb-12">
                <h2 className="text-3xl font-black mb-6 text-white">The <span className="text-benfic-blue">Process</span></h2>
                <p className="text-lg text-zinc-400 leading-relaxed whitespace-pre-wrap text-left md:text-center">
                  {project.processBreakdown}
                </p>
              </div>
            )}

            {project.processImages && project.processImages.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {project.processImages.map((img: string, index: number) => (
                  <div key={index} className="w-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-lg">
                    <img src={img} alt={`Process step ${index + 1}`} className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FOOTER NAV */}
        <div className="border-t border-zinc-800 pt-12 text-center">
          <Link href="/portfolio" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-zinc-700 text-white font-bold hover:bg-zinc-800 hover:border-benfic-blue transition-all">
            ← Back to All Work
          </Link>
        </div>

      </div>
    </div>
  );
}