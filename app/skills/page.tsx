import PageHero from "../../components/PageHero";

export default function SkillsPage() {
  const skills = [
    { 
      id: "graphics", // Matches the Home page link
      title: "Graphics Design / Brand Identity", 
      desc: "Crafting memorable visual identities that speak volumes. From striking logo designs to comprehensive brand guidelines, I ensure your business stands out with a cohesive and premium aesthetic.",
      icon: "🎨" 
    },
    { 
      id: "wordpress", // Matches the Home page link
      title: "Wordpress Development", 
      desc: "Building dynamic, high-converting eCommerce platforms and business sites using WordPress. I focus on custom themes, plugin integration, and lightning-fast load speeds.",
      icon: "💻" 
    },
    { 
      id: "ui-ux", // Matches the Home page link
      title: "UI/UX Design", 
      desc: "Designing intuitive, user-centric interfaces. I wireframe and prototype digital experiences that not only look futuristic but map perfectly to user psychology and conversion goals.",
      icon: "✨" 
    },
    { 
      id: "react", // Matches the Home page link
      title: "Next.js / React", 
      desc: "Architecting modern, scalable, and SEO-friendly web applications using the industry's most powerful JavaScript frameworks to deliver seamless, app-like experiences.",
      icon: "⚛️" 
    },
    { 
      id: "tailwind", // Matches the Home page link
      title: "Tailwind CSS", 
      desc: "Translating complex UI designs into flawless, responsive code using utility-first CSS, ensuring your website looks perfect on any device, from massive monitors to mobile phones.",
      icon: "🌊" 
    },
    { 
      id: "web-dev", // Matches the Home page link
      title: "Web Development", 
      desc: "Full-cycle development handling both the front-end visual structure and the foundational logic to bring complex digital products to life securely and efficiently.",
      icon: "⚙️" 
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero title="Core" span="Capabilities" />

      <section className="py-20 px-6 lg:px-8 max-w-5xl mx-auto w-full z-10 relative">
        <div className="flex flex-col gap-8">
          {skills.map((skill, index) => (
            <div 
              key={index}
              id={skill.id} // This is the target for the URL fragment
              className="scroll-mt-32 flex flex-col md:flex-row items-center md:items-start gap-8 bg-zinc-950/50 backdrop-blur-sm border border-zinc-800/50 rounded-3xl p-8 hover:border-benfic-blue hover:shadow-[0_0_30px_rgba(4,82,218,0.1)] transition-all group"
            >
              <div className="w-20 h-20 shrink-0 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-3xl group-hover:bg-benfic-blue/20 group-hover:border-benfic-blue transition-all duration-500 group-hover:scale-110">
                {skill.icon}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-benfic-blue transition-colors">
                  {skill.title}
                </h3>
                <p className="text-zinc-400 text-lg leading-relaxed">
                  {skill.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}