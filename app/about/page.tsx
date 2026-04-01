"use client";

import { useState, useEffect } from "react";
import PageHero from "../../components/PageHero";
import Link from "next/link";

export default function AboutPage() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (data.success) {
          setProfile(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white">
      <PageHero title="About" span="Me" />

      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto w-full z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* IMAGE SECTION */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-benfic-blue to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative aspect-[4/5] w-full bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden flex items-center justify-center">
              {isLoading ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-2 border-benfic-blue border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs text-zinc-500">Loading Profile...</p>
                </div>
              ) : profile?.profileImageUrl ? (
                <img 
                  src={profile.profileImageUrl} 
                  alt="Benaiah Ajibade" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="text-zinc-700 text-center p-8">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  <p className="text-sm">No photo uploaded yet.<br/>Upload one in the Admin Panel.</p>
                </div>
              )}
            </div>
          </div>

          {/* TEXT CONTENT SECTION */}
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Bridging the gap between <span className="text-benfic-blue">Design</span> and <span className="text-benfic-blue">Code</span>
              </h2>
              <p className="text-lg text-zinc-400 leading-relaxed mb-6">
                I am Benaiah Ajibade, a multi-disciplinary creative based in Nigeria. My journey in the digital space began with a fascination for visual storytelling, which naturally evolved into a deep-seated passion for building the technical foundations that bring those stories to life.
              </p>
              <p className="text-lg text-zinc-400 leading-relaxed">
                With a background in Graphics Design and a specialized focus on Modern Web Development, I help brands and individuals create digital products that are not only beautiful but also performant, accessible, and user-centric.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                <h3 className="text-benfic-blue font-bold mb-2">My Philosophy</h3>
                <p className="text-sm text-zinc-400">I believe that great design should be invisible—it should guide the user effortlessly while solving complex problems under the hood.</p>
              </div>
              <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                <h3 className="text-benfic-blue font-bold mb-2">My Goal</h3>
                <p className="text-sm text-zinc-400">To push the boundaries of what's possible on the web, one pixel and one line of code at a time.</p>
              </div>
            </div>

            <div className="flex items-center gap-6 mt-4">
              <Link href="/contact" className="px-8 py-3 bg-benfic-blue text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-[0_0_20px_rgba(4,82,218,0.3)]">
                Work With Me
              </Link>
              <Link href="/portfolio" className="text-zinc-300 hover:text-white font-medium transition-colors">
                View My Projects →
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}