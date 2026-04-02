import connectToDatabase from "../../../../lib/mongodb";
import Project from "../../../../models/Project";
import Link from "next/link";

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  await connectToDatabase();

  const project = await Project.findById(resolvedParams.id).lean();

  if (!project) return <div className="min-h-screen flex items-center justify-center text-white">Not Found</div>;

  const isWebOrWP = project.category === "Web Development" || project.category === "Wordpress Development";

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-24 pb-20">
      
      {/* 1. HEADER SECTION */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center mb-16 animate-in fade-in slide-in-from-bottom-4">
        <div className="inline-block px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-benfic-blue text-xs font-bold tracking-widest uppercase mb-6">
          {project.category} {project.graphicDesignType ? `• ${project.graphicDesignType}` : ""}
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">{project.title}</h1>
        <p className="text-lg text-zinc-400 max-w-3xl mx-auto leading-relaxed whitespace-pre-wrap">
          {project.description}
        </p>
        {project.liveLink && (
          <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="inline-block mt-8 px-8 py-4 rounded-full bg-benfic-blue text-white font-bold uppercase hover:bg-blue-600 transition-all">Visit Live Project</a>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* 2. COVER IMAGE LEFT, PROBLEM/SOLUTION RIGHT (Responsive Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr,1fr] gap-10 lg:gap-16 mb-24 items-start">
            
            {/* Image resizes naturally without cropping */}
            <div className="w-full rounded-[2rem] overflow-hidden border border-zinc-800 bg-zinc-900 order-1">
              {project.imageUrl ? (
                <img src={project.imageUrl} alt={project.title} className="w-full h-auto block" />
              ) : (
                <div className="w-full aspect-video flex items-center justify-center text-zinc-600">No Cover Image</div>
              )}
            </div>

            {/* Problem / Solution Text Box */}
            <div className="flex flex-col gap-8 order-2">
                {project.problemSolved && (
                  <div className="bg-zinc-900/40 p-6 sm:p-8 rounded-3xl border border-zinc-800">
                    <h3 className="text-2xl font-bold text-white mb-4 border-b border-zinc-800 pb-3">The Problem</h3>
                    <p className="text-zinc-400 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">{project.problemSolved}</p>
                  </div>
                )}
                {project.solutionText && (
                  <div className="bg-zinc-900/40 p-6 sm:p-8 rounded-3xl border border-zinc-800">
                    <h3 className="text-2xl font-bold text-white mb-4 border-b border-zinc-800 pb-3">The Solution</h3>
                    <p className="text-zinc-400 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">{project.solutionText}</p>
                  </div>
                )}
                {!project.problemSolved && !project.solutionText && (
                  <div className="p-8 text-zinc-600 italic border border-zinc-800 border-dashed rounded-3xl text-center">No case study details provided.</div>
                )}
            </div>
        </div>

        {/* 3. CONDITIONAL WEB/WP MOCKUPS */}
        {isWebOrWP && (project.viewLaptopImageUrl || project.viewTabletImageUrl || project.viewMobileImageUrl) && (
          <div className="mb-24 text-center">
            <h2 className="text-3xl font-black mb-12">Responsive <span className="text-benfic-blue">Views</span></h2>
            {project.viewLaptopImageUrl && (
              <img src={project.viewLaptopImageUrl} alt="Laptop" className="w-full max-w-4xl h-auto mx-auto rounded-xl border border-zinc-800 mb-8" />
            )}
            <div className="flex flex-col sm:flex-row justify-center gap-8 max-w-4xl mx-auto">
              {project.viewTabletImageUrl && <img src={project.viewTabletImageUrl} alt="Tablet" className="w-full sm:w-1/2 h-auto rounded-xl border border-zinc-800" />}
              {project.viewMobileImageUrl && <img src={project.viewMobileImageUrl} alt="Mobile" className="w-[60%] sm:w-1/3 h-auto mx-auto rounded-xl border border-zinc-800" />}
            </div>
          </div>
        )}

        {/* 4. MASONRY PROCESS IMAGES ("Pinterest Style") */}
        {(project.processBreakdown || (project.processImages && project.processImages.length > 0)) && (
          <div className="mb-24">
            {project.processBreakdown && (
              <div className="max-w-4xl mx-auto text-center mb-12">
                <h2 className="text-3xl font-black mb-6 text-white">The <span className="text-benfic-blue">Process</span></h2>
                <p className="text-zinc-400 text-left sm:text-center whitespace-pre-wrap">{project.processBreakdown}</p>
              </div>
            )}

            {/* Pinterest Style CSS Columns (Masonry) */}
            {project.processImages && project.processImages.length > 0 && (
              <div className="columns-1 sm:columns-2 gap-6 space-y-6">
                {project.processImages.map((img: string, index: number) => (
                  <div key={index} className="w-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 break-inside-avoid shadow-lg">
                    {/* h-auto ensures placeholder resizes dynamically based on uploaded image */}
                    <img src={img} alt={`Process ${index + 1}`} className="w-full h-auto block" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}