import PageHero from "../../components/PageHero";

export default function SkillsPage() {
  const skills = [
    { id: "graphics", title: "Graphics Design / Brand Identity", desc: "Crafting memorable visual identities that speak volumes. From striking logo designs to comprehensive brand guidelines...", icon: "🎨" },
    { id: "wordpress", title: "Wordpress Development", desc: "Building dynamic, high-converting eCommerce platforms and business sites using WordPress...", icon: "💻" },
    { id: "ui-ux", title: "UI/UX Design", desc: "Designing intuitive, user-centric interfaces. I wireframe and prototype digital experiences...", icon: "✨" },
    { id: "react", title: "Next.js / React", desc: "Architecting modern, scalable, and SEO-friendly web applications...", icon: "⚛️" },
    { id: "tailwind", title: "Tailwind CSS", desc: "Translating complex UI designs into flawless, responsive code using utility-first CSS...", icon: "🌊" },
    { id: "web-dev", title: "Web Development", desc: "Full-cycle development handling both the front-end visual structure and the foundational logic...", icon: "⚙️" },
  ];

  return (
    <div className="flex flex-col min-h-screen relative bg-zinc-950 text-white">
      {/* Background Animation Added */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-tech-grid opacity-40"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[800px] flex items-center justify-center opacity-40 mix-blend-screen">
          <div className="absolute top-10 -left-10 w-80 h-80 bg-benfic-blue rounded-full filter blur-[120px] animate-blob"></div>
        </div>
      </div>

      <PageHero title="Core" span="Capabilities" />

      <section className="py-20 px-6 lg:px-8 max-w-5xl mx-auto w-full z-10 relative">
        <div className="flex flex-col gap-8">
          {skills.map((skill, index) => (
            <div key={index} id={skill.id} className="scroll-mt-32 flex flex-col md:flex-row items-center md:items-start gap-8 bg-zinc-950/50 backdrop-blur-sm border border-zinc-800/50 rounded-3xl p-6 sm:p-8 hover:border-benfic-blue hover:shadow-[0_0_30px_rgba(4,82,218,0.1)] transition-all group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-2xl sm:text-3xl group-hover:bg-benfic-blue/20 group-hover:border-benfic-blue transition-all duration-500 group-hover:scale-110">
                {skill.icon}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-benfic-blue transition-colors">{skill.title}</h3>
                <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">{skill.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}