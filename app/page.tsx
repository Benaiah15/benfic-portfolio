import { siteConfig } from "../config/site";
import ContactForm from "../components/ContactForm";
import Link from "next/link";
import connectToDatabase from "../lib/mongodb";
import Project from "../models/Project";
import Profile from "../models/Profile"; 

export default async function Home() {
  // 1. Connect to the database
  await connectToDatabase();

  // 2. Fetch Profile for the Home Page Excerpt
  const profile = await Profile.findOne({}).lean();
  const bioExcerpt = profile?.bioExcerpt || "I am a multi-disciplinary creative specialist dedicated to bridging the gap between visual design and technical execution. I generate designs that speak louder than words and sell your services effectively.";

  // 3. Define the exact categories we want to feature
  const categoriesToFeature = [
    "Graphic Design", 
    "UI/UX Design", 
    "Web Development", 
    "Wordpress Development"
  ];

  // 4. Fetch the newest single project from EACH category concurrently
  const featuredProjectsRaw = await Promise.all(
    categoriesToFeature.map((category) => 
      Project.findOne({ category }).sort({ createdAt: -1 }).lean()
    )
  );

  // 5. Filter out any 'null' results
  const featuredProjects = featuredProjectsRaw.filter(Boolean);

  // Map the skills to their specific IDs for smooth scrolling on the Skills page
  const skillsData = [
    { name: "Graphics Design / Brand Identity", id: "graphics" },
    { name: "Web Development", id: "web-dev" },
    { name: "Next.js / React", id: "react" },
    { name: "Tailwind CSS", id: "tailwind" },
    { name: "UI/UX Design", id: "ui-ux" },
    { name: "Wordpress Development", id: "wordpress" }
  ];

  return (
    <div className="flex flex-col bg-transparent text-white relative">
      
      {/* GLOBAL BACKGROUND ANIMATION (Original Brand Colors) */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-tech-grid opacity-40"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[800px] flex items-center justify-center opacity-40 mix-blend-screen">
          <div className="absolute top-10 -left-10 w-80 h-80 bg-benfic-blue rounded-full filter blur-[120px] animate-blob"></div>
          <div className="absolute top-20 -right-10 w-80 h-80 bg-blue-700 rounded-full filter blur-[120px] animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-10 left-32 w-80 h-80 bg-indigo-600 rounded-full filter blur-[120px] animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* 1. HERO SECTION (Original text + cool new additions) */}
      <section className="relative flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-6 z-10 pt-10">
        <div className="text-center w-full max-w-5xl mx-auto flex flex-col items-center">
          
          {/* Cool Top Pill (Inspiration) */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur-md mb-8 shadow-[0_0_15px_rgba(4,82,218,0.2)]">
            <span className="text-xl">🚀</span>
            <span className="text-sm font-medium text-blue-200 tracking-wide">Premium Creative Studio</span>
          </div>

          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl drop-shadow-lg leading-tight mb-4">
            Hi, I'm <span className="text-benfic-blue">{siteConfig.name}</span>
          </h1>
          
          <p className="mt-6 text-xl text-zinc-300 max-w-2xl mx-auto drop-shadow-md">
            {siteConfig.role}
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a href={siteConfig.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="rounded-md bg-benfic-blue px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(4,82,218,0.5)] hover:bg-blue-700 hover:shadow-[0_0_30px_rgba(4,82,218,0.7)] hover:-translate-y-1 transition-all duration-300">
              Let's Chat
            </a>
            <a href="#portfolio" className="text-sm font-semibold leading-6 text-white hover:text-benfic-blue transition-colors">
              View My Work <span aria-hidden="true">→</span>
            </a>
          </div>

          {/* Flashy Stats Row (Inspiration from Image 1) */}
          <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-10 w-full max-w-4xl border-t border-zinc-800/50 pt-10">
             <div className="flex flex-col items-center">
                <p className="text-4xl md:text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(4,82,218,0.4)]">500+</p>
                <p className="text-sm text-benfic-blue mt-2 font-bold tracking-widest uppercase">Projects Done</p>
             </div>
             <div className="flex flex-col items-center">
                <p className="text-4xl md:text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(4,82,218,0.4)]">200+</p>
                <p className="text-sm text-benfic-blue mt-2 font-bold tracking-widest uppercase">Happy Clients</p>
             </div>
             <div className="flex flex-col items-center">
                <p className="text-4xl md:text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(4,82,218,0.4)]">5+</p>
                <p className="text-sm text-benfic-blue mt-2 font-bold tracking-widest uppercase">Years Experience</p>
             </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT EXCERPT SECTION */}
      <section id="about" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto w-full z-10 relative">
        <div className="bg-zinc-900/40 backdrop-blur-md rounded-[2rem] border border-zinc-800 p-10 md:p-16 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
          {/* Decorative slash */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-benfic-blue/20 rounded-full filter blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,2fr] gap-12 items-center relative z-10">
            <div>
              <h2 className="text-sm font-bold tracking-widest text-benfic-blue uppercase mb-4">About Me</h2>
              <h3 className="text-4xl font-black text-white leading-tight mb-6">
                Bridging<br/>
                <span className="text-zinc-400">Design & Code.</span>
              </h3>
              <Link href="/about" className="inline-flex items-center gap-2 text-sm font-bold text-benfic-blue hover:text-white transition-colors uppercase tracking-wider group">
                Read Full Story 
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </Link>
            </div>
            
            <div className="border-l-2 border-zinc-800 pl-0 lg:pl-12">
              <p className="text-xl md:text-2xl leading-relaxed text-zinc-300 font-light">
                "{bioExcerpt}"
              </p>
              
              <div className="mt-10 flex flex-wrap gap-3">
                {skillsData.map((skill) => (
                  <Link href={`/skills#${skill.id}`} key={skill.id} className="px-4 py-2 rounded-full border border-zinc-700 bg-zinc-950 text-xs font-semibold text-zinc-400 uppercase tracking-wider hover:border-benfic-blue hover:text-white transition-colors cursor-pointer">
                    {skill.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED RECENT WORK */}
      <section id="portfolio" className="py-24 z-10 relative">
        <div className="px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-sm font-bold tracking-widest text-benfic-blue uppercase mb-4">Our Work</h2>
              <h3 className="text-4xl md:text-5xl font-black text-white">
                Featured <span className="text-benfic-blue">Portfolio</span>
              </h3>
            </div>
            <Link href="/portfolio" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors border-b border-zinc-700 hover:border-white pb-1">
              View All Categories
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredProjects.length === 0 ? (
              <div className="col-span-1 md:col-span-2 text-center py-10 text-zinc-500">
                No featured projects yet. Upload projects from the Admin Panel.
              </div>
            ) : (
              featuredProjects.map((project: any) => (
                <Link 
                  href={`/portfolio/details/${project._id}`} 
                  key={project._id.toString()} 
                  className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm transition-all hover:border-benfic-blue hover:shadow-[0_0_40px_rgba(4,82,218,0.15)] block cursor-pointer"
                >
                  <div className="aspect-[16/10] w-full bg-zinc-950 overflow-hidden p-2">
                    <div className="w-full h-full rounded-2xl overflow-hidden relative">
                        {project.imageUrl ? (
                        <img src={project.imageUrl} alt={project.title} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out"/>
                        ) : (
                        <span className="flex items-center justify-center w-full h-full text-zinc-600 font-medium">No Image</span>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80"></div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="inline-block px-3 py-1 mb-3 rounded-md bg-zinc-800/80 backdrop-blur-md border border-zinc-700 text-[10px] font-bold tracking-widest text-benfic-blue uppercase">
                        {project.category}
                    </div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-benfic-blue transition-colors drop-shadow-lg">{project.title}</h3>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 4. CONTACT SECTION */}
      <section id="contact" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto w-full z-10 relative">
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-10 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Let's Build Something <span className="text-benfic-blue">Incredible.</span>
              </h2>
              <p className="text-lg leading-relaxed text-zinc-400 mb-10">
                Ready to start your next project? Drop me a message and let's discuss how we can work together.
              </p>
              
              <a href={siteConfig.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-4 p-4 rounded-2xl bg-zinc-900 border border-zinc-700 hover:border-benfic-blue hover:shadow-[0_0_20px_rgba(4,82,218,0.2)] transition-all group w-full max-w-sm">
                <span className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </span>
                <div>
                  <p className="text-sm font-bold text-white uppercase tracking-wider">Chat on WhatsApp</p>
                  <p className="text-xs text-zinc-500 font-medium">Fastest response time</p>
                </div>
              </a>
            </div>
            
            <div className="bg-zinc-950 rounded-2xl p-6 border border-zinc-800">
                <ContactForm />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}