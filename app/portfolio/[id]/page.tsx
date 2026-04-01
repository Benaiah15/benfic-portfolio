import PageHero from "../../../components/PageHero";
import Link from "next/link";
import connectToDatabase from "../../../lib/mongodb";
import Project from "../../../models/Project";

export default async function ProjectDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const projectId = resolvedParams.id;

  await connectToDatabase();
  let project = null;

  try {
    project = await Project.findById(projectId).lean();
  } catch (error) {
    console.error("Invalid Project ID format");
  }

  if (!project) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-950 items-center justify-center">
        <div className="text-white text-center py-40 text-2xl font-bold">Project Not Found</div>
        <Link href="/portfolio" className="text-benfic-blue hover:underline">Return to Portfolio</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white">
       <PageHero title={project.title} span="" />
       
       <section className="py-20 px-6 lg:px-8 max-w-4xl mx-auto w-full z-10 relative">
         <div className="flex items-center justify-between mb-10">
           <Link href="/portfolio" className="text-zinc-400 hover:text-benfic-blue transition-colors inline-flex items-center gap-2 font-medium">
             <span>←</span> Back to Portfolio
           </Link>
           
           {/* Conditional Live Link Button */}
           {project.liveLink && (
             <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="bg-benfic-blue text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-600 hover:shadow-[0_0_15px_rgba(4,82,218,0.4)] transition-all flex items-center gap-2">
               Visit Live Site
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
             </a>
           )}
         </div>
         
         {/* Main Showcase Image */}
         <div className="aspect-video w-full bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-center mb-12 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden">
           {project.imageUrl && <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />}
         </div>

         <div className="bg-zinc-950/50 backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-zinc-800/50">
            <div className="text-benfic-blue font-bold uppercase tracking-widest text-sm mb-4">
              {project.category}
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-6">Project Overview</h2>
            <p className="text-zinc-400 text-lg leading-relaxed mb-12 whitespace-pre-wrap">
              {project.description}
            </p>
            
            <div className="w-full h-px bg-zinc-800/50 mb-12"></div>
            
            <h3 className="text-2xl font-bold text-white mb-6">The Process & Solution</h3>
            <p className="text-zinc-400 text-lg leading-relaxed mb-8 whitespace-pre-wrap">
              {project.processText ? project.processText : "Detailed case study coming soon."}
            </p>

            {/* Render Process Images if they exist */}
            {(project.processImage1 || project.processImage2) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                 {project.processImage1 && (
                   <div className="aspect-square bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                     <img src={project.processImage1} alt="Process 1" className="w-full h-full object-cover" />
                   </div>
                 )}
                 {project.processImage2 && (
                   <div className="aspect-square bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                     <img src={project.processImage2} alt="Process 2" className="w-full h-full object-cover" />
                   </div>
                 )}
              </div>
            )}
         </div>
       </section>
    </div>
  );
}