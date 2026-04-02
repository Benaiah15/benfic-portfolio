import Link from "next/link";
import connectToDatabase from "../../lib/mongodb";
import CategoryConfig from "../../models/CategoryConfig";

export default async function PortfolioPage() {
  await connectToDatabase();
  
  // Fetch Category Configs to build the main navigation cards
  const categoryConfigsRaw = await CategoryConfig.find({}).lean();
  
  // Define the master order of categories
  const categoriesToFeature = [
    { name: "Graphic Design", slug: "graphic-design" },
    { name: "Web Development", slug: "web-development" },
    { name: "Wordpress Development", slug: "wordpress-development" },
    { name: "UI/UX Design", slug: "ui-ux-design" }
  ];

  // Map the DB data to our master array
  const displayCategories = categoriesToFeature.map(cat => {
    const configData: any = categoryConfigsRaw.find((c: any) => c.categoryName === cat.name);
    return {
      name: cat.name,
      slug: cat.slug,
      imageUrl: configData?.featuredImageUrl || null,
      description: configData?.shortDescription || "Click to explore our featured projects in this category."
    };
  });

  return (
    <div className="flex flex-col min-h-screen text-white bg-zinc-950 relative">
      
      {/* Subtle Background Glow (Brand Color) */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none flex justify-center">
        <div className="absolute top-0 w-full max-w-3xl h-64 bg-benfic-blue/20 filter blur-[100px] rounded-full"></div>
      </div>

      <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto w-full z-10 relative pt-32 text-center">
        
        <h2 className="text-sm font-bold tracking-widest text-benfic-blue uppercase mb-4">Our Work</h2>
        <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6 drop-shadow-lg">
          Featured <span className="text-benfic-blue">Portfolio</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-16 font-light">
          A showcase of our finest designs and technical builds across multiple industries. Choose a category below to explore the case studies.
        </p>

        {/* 4 CATEGORY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayCategories.map((category) => (
            <Link 
              href={`/portfolio/category/${category.slug}`} 
              key={category.slug} 
              className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm transition-all hover:border-benfic-blue hover:shadow-[0_0_40px_rgba(4,82,218,0.2)] block cursor-pointer min-h-[350px] flex flex-col"
            >
              {/* Image Background */}
              <div className="absolute inset-0 z-0">
                {category.imageUrl ? (
                  <img 
                    src={category.imageUrl} 
                    alt={category.name} 
                    className="object-cover w-full h-full opacity-40 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center text-zinc-700">
                    <svg className="w-12 h-12 mb-2 opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
                    <span className="text-xs uppercase tracking-widest">Image missing from Admin config</span>
                  </div>
                )}
                {/* Heavy gradient to ensure text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent"></div>
              </div>

              {/* Text Content overlay */}
              <div className="relative z-10 flex flex-col justify-end h-full p-10 text-left">
                <div className="w-12 h-1 bg-benfic-blue mb-6 rounded-full group-hover:w-24 group-hover:bg-blue-400 transition-all duration-500"></div>
                <h3 className="text-3xl font-black text-white mb-3 group-hover:text-benfic-blue transition-colors tracking-tight">
                  {category.name}
                </h3>
                <p className="text-zinc-400 font-light leading-relaxed mb-6 line-clamp-2">
                  {category.description}
                </p>
                <div className="inline-flex items-center gap-2 text-sm font-bold text-white tracking-widest uppercase opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  Explore Work <span className="text-benfic-blue">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
      </section>
    </div>
  );
}