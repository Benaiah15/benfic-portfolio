import connectToDatabase from "../../lib/mongodb";
import Profile from "../../models/Profile";

export default async function AboutPage() {
  await connectToDatabase();
  
  const profile = await Profile.findOne({}).lean();
  const fullBio = profile?.fullBio || "BENFIC is a professional design brand delivering premium digital experiences. We create visuals that speak louder than words.";
  const profileImage = profile?.profileImageUrl || null;

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white relative">
      
      {/* Background Glows */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-benfic-blue opacity-10 filter blur-[200px] -translate-x-1/3 -translate-y-1/3 rounded-full"></div>
      </div>

      <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto w-full z-10 relative pt-32">
        {/* Responsive Grid: Image Left, Text Right on Desktop. Stacks on Mobile. */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.2fr] gap-12 lg:gap-16 items-start">
          
          {/* IMAGE SECTION (LEFT) */}
          <div className="relative w-full h-auto rounded-[2rem] bg-zinc-900 border border-zinc-800 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] group order-1">
            <div className="absolute inset-0 z-10 p-2 sm:p-4 flex">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-full h-auto object-cover rounded-2xl shadow-2xl z-10 block"
                />
              ) : (
                <div className="w-full aspect-[4/5] bg-zinc-950 rounded-2xl flex flex-col items-center justify-center text-zinc-600 border border-zinc-800 z-10">
                  <p className="text-sm font-medium">No profile photo uploaded.</p>
                </div>
              )}
            </div>
          </div>

          {/* TEXT CONTENT (RIGHT) */}
          <div className="flex flex-col pt-4 order-2">
            <h2 className="text-sm font-bold tracking-widest text-benfic-blue uppercase mb-4 text-center lg:text-left">About Me</h2>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-8 text-center lg:text-left">
              We Create Designs That <span className="text-benfic-blue drop-shadow-lg">Speak Louder</span> Than Words
            </h1>
            
            <div className="text-base sm:text-lg leading-relaxed text-zinc-300 font-light mb-12 whitespace-pre-wrap text-center lg:text-left">
              {fullBio}
            </div>

            {/* MISSION & VISION BOXES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800 p-6 sm:p-8 rounded-3xl hover:border-benfic-blue/50 transition-colors">
                <h3 className="text-xl font-bold text-benfic-blue mb-3">Our Mission</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  To empower brands with visually compelling designs and flawless web systems that drive growth and recognition.
                </p>
              </div>
              <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800 p-6 sm:p-8 rounded-3xl hover:border-benfic-blue/50 transition-colors">
                <h3 className="text-xl font-bold text-benfic-blue mb-3">Our Vision</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  To become the most trusted creative and technical partner for businesses worldwide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}