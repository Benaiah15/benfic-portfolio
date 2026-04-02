import connectToDatabase from "../../lib/mongodb";
import Profile from "../../models/Profile";

export default async function AboutPage() {
  await connectToDatabase();
  
  // Fetch full profile data directly from MongoDB
  const profile = await Profile.findOne({}).lean();
  
  const fullBio = profile?.fullBio || "TRUST GRAPHICS is a professional graphics design brand delivering premium designs that elevate businesses. With hundreds of satisfied clients and a collection of stunning works across multiple industries, we create visuals that speak louder than words.";
  const profileImage = profile?.profileImageUrl || null;

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white relative">
      
      {/* Background Glows (Benfic Blue) */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-benfic-blue opacity-10 filter blur-[200px] translate-x-1/3 -translate-y-1/3 rounded-full"></div>
      </div>

      <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto w-full z-10 relative pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.2fr] gap-16 items-start">
          
          {/* IMAGE DESK SETUP (Flashy but Brand Colored) */}
          <div className="relative w-full aspect-[4/5] md:aspect-[3/4] lg:aspect-square xl:aspect-[4/5] rounded-[2rem] bg-zinc-900 border border-zinc-800 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] group">
            
            {/* Fake Neon Light bar element in background */}
            <div className="absolute right-8 top-12 bottom-12 w-3 bg-blue-400 rounded-full shadow-[0_0_30px_rgba(4,82,218,0.8)] z-0 opacity-80 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover rounded-2xl shadow-2xl z-10"
                />
              ) : (
                <div className="w-full h-full bg-zinc-950 rounded-2xl flex flex-col items-center justify-center text-zinc-600 border border-zinc-800 z-10">
                  <svg className="w-16 h-16 mb-4 opacity-30" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                  <p className="text-sm font-medium">No profile photo uploaded.</p>
                </div>
              )}
            </div>
          </div>

          {/* TEXT & GRID CONTENT */}
          <div className="flex flex-col pt-4">
            <h2 className="text-sm font-bold tracking-widest text-benfic-blue uppercase mb-4">About Me</h2>
            <h1 className="text-5xl md:text-6xl font-black text-white leading-[1.1] mb-8">
              We Create Designs That <span className="text-benfic-blue drop-shadow-lg">Speak Louder</span> Than Words
            </h1>
            
            <div className="text-lg leading-relaxed text-zinc-300 font-light mb-12 whitespace-pre-wrap">
              {fullBio}
            </div>

            {/* MISSION & VISION BOXES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800 p-8 rounded-3xl hover:border-benfic-blue/50 transition-colors">
                <h3 className="text-xl font-bold text-benfic-blue mb-3">Our Mission</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  To empower brands with visually compelling designs and flawless web systems that drive growth, engagement, and recognition in the digital space.
                </p>
              </div>
              <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800 p-8 rounded-3xl hover:border-benfic-blue/50 transition-colors">
                <h3 className="text-xl font-bold text-benfic-blue mb-3">Our Vision</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  To become the most trusted creative and technical partner for businesses worldwide, setting the benchmark for premium digital experiences.
                </p>
              </div>
            </div>

            {/* VALUES GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400 border border-blue-800">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">Creativity</h4>
                  <p className="text-xs text-zinc-500">Pushing boundaries with every design.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center text-benfic-blue border border-blue-800">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">Excellence</h4>
                  <p className="text-xs text-zinc-500">Pixel-perfect quality guaranteed.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center text-green-400 border border-green-800">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">Trust</h4>
                  <p className="text-xs text-zinc-500">Reliable partner for your brand.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center text-purple-400 border border-purple-800">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">Innovation</h4>
                  <p className="text-xs text-zinc-500">Staying ahead of design trends.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}