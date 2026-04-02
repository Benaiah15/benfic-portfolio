import connectToDatabase from "../../../../lib/mongodb";
import Project from "../../../../models/Project";
import Link from "next/link";
import PageHero from "../../../../components/PageHero";

// Map the URL slug to the exact database category string
const slugToCategory: Record<string, string> = {
  "graphic-design": "Graphic Design",
  "web-development": "Web Development",
  "wordpress-development": "Wordpress Development",
  "ui-ux-design": "UI/UX Design",
};

// Next.js 15 requires params and searchParams to be treated as Promises
export default async function CategoryPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug: string }>, 
  searchParams: Promise<{ filter?: string }> 
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const slug = resolvedParams.slug;
  const currentFilter = resolvedSearchParams.filter || "All";
  const categoryName = slugToCategory[slug];

  if (!categoryName) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
        <h1 className="text-3xl font-bold">Category Not Found</h1>
      </div>
    );
  }

  await connectToDatabase();

  // Build the database query
  let query: any = { category: categoryName };
  
  // If we are in Graphic Design and a filter is selected, update the query
  if (categoryName === "Graphic Design" && currentFilter !== "All") {
    query.graphicDesignType = currentFilter;
  }

  // Fetch projects
  const projects = await Project.find(query).sort({ createdAt: -1 }).lean();

  // Define the toggles for Graphic Design
  const graphicDesignFilters = [
    "All", 
    "My Brand Design", 
    "My Social Media Design", 
    "My Poster Design", 
    "My Product Design", 
    "Other Design"
  ];

  return (
    <div className="flex flex-col min-h-screen text-white bg-zinc-950 relative">
      <PageHero title={categoryName.split(' ')[0]} span={categoryName.split(' ').slice(1).join(' ')} />

      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto w-full z-10 relative">
        
        {/* GRAPHIC DESIGN TOGGLE MENU */}
        {categoryName === "Graphic Design" && (
          <div className="flex flex-wrap justify-center gap-3 mb-16 animate-in fade-in slide-in-from-bottom-4">
            {graphicDesignFilters.map((filter) => {
              const isActive = currentFilter === filter;
              return (
                <Link 
                  key={filter}
                  href={`/portfolio/category/${slug}${filter === "All" ? "" : `?filter=${encodeURIComponent(filter)}`}`}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 border ${
                    isActive 
                      ? "bg-benfic-blue border-benfic-blue text-white shadow-[0_0_15px_rgba(4,82,218,0.4)]" 
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-benfic-blue hover:text-white"
                  }`}
                >
                  {filter}
                </Link>
              );
            })}
          </div>
        )}

        <div className="flex justify-between items-end mb-10">
            <h2 className="text-2xl font-bold text-white">
                {currentFilter === "All" ? "All Projects" : currentFilter} <span className="text-zinc-500 text-lg font-medium">({projects.length})</span>
            </h2>
            <Link href="/portfolio" className="text-sm font-bold text-benfic-blue hover:text-white transition-colors">
                ← Back to Categories
            </Link>
        </div>

        {/* PROJECTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800 border-dashed">
              <p className="text-xl text-zinc-500">No projects found in this section yet.</p>
            </div>
          ) : (
            projects.map((project: any) => (
              <Link 
                href={`/portfolio/details/${project._id}`} 
                key={project._id.toString()} 
                className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm transition-all hover:border-benfic-blue hover:shadow-[0_0_30px_rgba(4,82,218,0.2)] flex flex-col h-full"
              >
                <div className="aspect-[4/3] w-full bg-zinc-950 overflow-hidden relative">
                  {project.imageUrl ? (
                    <img 
                      src={project.imageUrl} 
                      alt={project.title} 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <span className="flex items-center justify-center w-full h-full text-zinc-600 font-medium">No Image</span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300"></div>
                </div>

                <div className="p-6 relative z-10 flex-grow flex flex-col">
                  {project.graphicDesignType && (
                    <span className="text-[10px] font-bold tracking-widest text-benfic-blue uppercase mb-2">
                        {project.graphicDesignType}
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-benfic-blue transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-zinc-400 line-clamp-2">
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