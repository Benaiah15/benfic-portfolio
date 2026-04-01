import PageHero from "../../components/PageHero";
import Link from "next/link";
import connectToDatabase from "../../lib/mongodb";
import Project from "../../models/Project";

export default async function PortfolioPage() {
  // 1. Connect to the database
  await connectToDatabase();
  
  // 2. Fetch all projects, sorted by newest first
  // .lean() converts MongoDB documents into standard readable JavaScript objects
  const projects = await Project.find({}).sort({ createdAt: -1 }).lean();

  return (
    <div className="flex flex-col min-h-screen text-white bg-zinc-950">
      <PageHero title="Featured" span="Work" />

      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto w-full z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Fallback if no projects exist in the database yet */}
          {projects.length === 0 ? (
            <div className="col-span-1 md:col-span-2 text-center py-20 text-zinc-500 bg-zinc-900/30 rounded-2xl border border-zinc-800 border-dashed">
              <p className="text-xl">No projects found.</p>
              <p className="mt-2 text-sm">Head to the Admin Dashboard to upload your first project!</p>
            </div>
          ) : (
            // Map through the live database projects
            projects.map((project: any) => (
              <Link 
                href={`/portfolio/${project._id}`} 
                key={project._id.toString()} 
                className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm transition-all hover:border-benfic-blue hover:shadow-[0_0_30px_rgba(4,82,218,0.2)] flex flex-col h-full cursor-pointer"
              >
                {/* Image Section */}
                <div className="aspect-[16/9] w-full bg-zinc-900 flex items-center justify-center relative overflow-hidden">
                  {project.imageUrl ? (
                    <img 
                      src={project.imageUrl} 
                      alt={project.title} 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <span className="text-zinc-600 font-medium">No Image</span>
                  )}
                  {/* Subtle gradient overlay for style */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Text Content Section */}
                <div className="p-8 relative z-10 flex-grow flex flex-col">
                  <div className="text-xs font-semibold tracking-wide text-benfic-blue uppercase mb-3">
                    {project.category}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-benfic-blue transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}