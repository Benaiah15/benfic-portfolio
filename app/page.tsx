import { siteConfig } from "../config/site";
import ContactForm from "../components/ContactForm";
import Link from "next/link";
import connectToDatabase from "../lib/mongodb";
import Project from "../models/Project";

export default async function Home() {
  // 1. Connect to the database
  await connectToDatabase();

  // 2. Define the exact categories we want to feature
  const categoriesToFeature = [
    "Graphic Design", 
    "UI/UX Design", 
    "Web Development", 
    "Wordpress Development"
  ];

  // 3. Fetch the newest single project from EACH category concurrently
  const featuredProjectsRaw = await Promise.all(
    categoriesToFeature.map((category) => 
      Project.findOne({ category }).sort({ createdAt: -1 }).lean()
    )
  );

  // 4. Filter out any 'null' results (in case a category doesn't have any uploads yet)
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
      
      {/* GLOBAL BACKGROUND ANIMATION */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-tech-grid opacity-40"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[800px] flex items-center justify-center opacity-40 mix-blend-screen">
          <div className="absolute top-10 -left-10 w-80 h-80 bg-benfic-blue rounded-full filter blur-[120px] animate-blob"></div>
          <div className="absolute top-20 -right-10 w-80 h-80 bg-blue-700 rounded-full filter blur-[120px] animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-10 left-32 w-80 h-80 bg-indigo-600 rounded-full filter blur-[120px] animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* 1. HERO SECTION */}
      <section className="relative flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-6 z-10">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl drop-shadow-lg">
            Hi, I'm <span className="text-benfic-blue">{siteConfig.name}</span>
          </h1>
          <p className="mt-6 text-xl text-zinc-300 max-w-2xl mx-auto drop-shadow-md">
            {siteConfig.role}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a href={siteConfig.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="rounded-md bg-benfic-blue px-5 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(4,82,218,0.5)] hover:bg-blue-700 hover:shadow-[0_0_30px_rgba(4,82,218,0.7)] hover:-translate-y-1 transition-all duration-300">
              Let's Chat
            </a>
            <a href="#portfolio" className="text-sm font-semibold leading-6 text-white hover:text-benfic-blue transition-colors">
              View My Work <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section id="about" className="py-24 sm:py-32 px-6 lg:px-8 max-w-7xl mx-auto w-full scroll-mt-24 z-10 relative bg-zinc-950/50 backdrop-blur-sm rounded-3xl border border-zinc-800/50 my-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* ABOUT ME: Entire block wrapped in Link */}
          <Link href="/about" className="group block p-4 -m-4 rounded-2xl hover:bg-zinc-900/40 transition-all cursor-pointer">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6 group-hover:text-blue-400 transition-colors">
              About <span className="text-benfic-blue">Me</span>
            </h2>
            <p className="text-lg leading-8 text-zinc-400 mb-6 group-hover:text-zinc-300 transition-colors">
              I am a passionate designer and developer who bridges the gap between striking visual aesthetics and flawless technical execution. With a strong foundation in both graphic design and modern web technologies, including <span className="text-benfic-blue group-hover:text-blue-400">Wordpress Development</span>, I don't just build websites—I engineer digital experiences.
            </p>
            <p className="text-lg leading-8 text-zinc-400 group-hover:text-zinc-300 transition-colors">
              Whether I am crafting a brand identity from scratch or architecting a full-stack Next.js application, my goal is always the same: to create clean, scalable, and visually impactful solutions that leave a lasting impression.
            </p>
          </Link>

          {/* CORE CAPABILITIES (SKILLS) */}
          <div id="skills" className="scroll-mt-24">
            <Link href="/skills" className="inline-block group mb-8">
              <h3 className="text-2xl font-bold tracking-tight group-hover:text-benfic-blue transition-colors cursor-pointer">
                Core Capabilities
              </h3>
            </Link>
            
            <div className="grid grid-cols-2 gap-4">
              {skillsData.map((skill) => (
                <Link 
                  href={`/skills#${skill.id}`}
                  key={skill.id} 
                  className="flex items-center justify-center p-4 rounded-lg border border-zinc-800 bg-zinc-900/80 text-zinc-300 font-medium hover:border-benfic-blue hover:text-white hover:shadow-[0_0_20px_rgba(4,82,218,0.2)] transition-all cursor-pointer text-center backdrop-blur-md"
                >
                  {skill.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. PORTFOLIO GALLERY SECTION */}
      <section id="portfolio" className="py-24 z-10 relative scroll-mt-20">
        <div className="px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <Link href="/portfolio" className="inline-block group">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl group-hover:text-gray-300 transition-colors cursor-pointer">
                Featured <span className="text-benfic-blue group-hover:text-blue-500 transition-colors">Work</span>
              </h2>
            </Link>
            <p className="mt-4 text-lg text-zinc-400">A selection of my latest design and development projects.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredProjects.length === 0 ? (
              <div className="col-span-1 md:col-span-2 text-center py-10 text-zinc-500">
                No featured projects yet. Upload projects from the Admin Panel to see them here.
              </div>
            ) : (
              featuredProjects.map((project: any) => (
                <Link 
                  href={`/portfolio/${project._id}`} 
                  key={project._id.toString()} 
                  className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm transition-all hover:border-benfic-blue hover:shadow-[0_0_30px_rgba(4,82,218,0.2)] block cursor-pointer flex flex-col h-full"
                >
                  <div className="aspect-[16/9] w-full bg-zinc-900 flex items-center justify-center relative overflow-hidden">
                    {project.imageUrl ? (
                      <img 
                        src={project.imageUrl} 
                        alt={project.title} 
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <span className="text-zinc-600 font-medium flex items-center gap-2">No Image</span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6 relative z-10 flex-grow flex flex-col">
                    <div className="text-xs font-semibold tracking-wide text-benfic-blue uppercase mb-2">{project.category}</div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-benfic-blue transition-colors">{project.title}</h3>
                    <p className="text-sm text-zinc-400 line-clamp-2">{project.description}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 4. CONTACT SECTION */}
      <section id="contact" className="py-24 sm:py-32 px-6 lg:px-8 max-w-7xl mx-auto w-full z-10 relative scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <Link href="/contact" className="inline-block group mb-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl group-hover:text-gray-300 transition-colors cursor-pointer">
                Let's <span className="text-benfic-blue group-hover:text-blue-500 transition-colors">Connect</span>
              </h2>
            </Link>
            <p className="text-lg leading-8 text-zinc-400 mb-8">Ready to start your next project? Drop me a message and let's discuss how we can work together.</p>
            <div className="flex flex-col gap-4">
              <a href={siteConfig.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-zinc-300 hover:text-benfic-blue transition-colors group">
                <span className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 group-hover:border-benfic-blue group-hover:shadow-[0_0_15px_rgba(4,82,218,0.4)] transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </span>
                <div>
                  <p className="text-sm font-medium text-white">Chat on WhatsApp</p>
                  <p className="text-sm text-zinc-500">Fastest response time</p>
                </div>
              </a>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}