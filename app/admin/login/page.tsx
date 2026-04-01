"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // 1. Set the Tab-Only memory key before logging in
    sessionStorage.setItem("tab_auth", "true");

    const result = await signIn("credentials", {
      password,
      redirect: false, 
    });

    if (result?.error) {
      setError("Incorrect master password.");
      sessionStorage.removeItem("tab_auth"); // Remove it if password was wrong
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-benfic-blue/20 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-10 z-10 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">Admin <span className="text-benfic-blue">Access</span></h1>
        <p className="text-zinc-400 text-center mb-8">Restricted area. Please verify your identity.</p>

        {/* Google Login Button */}
        <button 
          onClick={() => {
            // 2. Set the Tab-Only memory key before Google redirect
            sessionStorage.setItem("tab_auth", "true");
            signIn("google", { callbackUrl: "/admin" });
          }}
          className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-zinc-800"></div>
          <span className="flex-shrink-0 mx-4 text-zinc-500 text-sm">OR</span>
          <div className="flex-grow border-t border-zinc-800"></div>
        </div>

        {/* Password Form */}
        <form onSubmit={handlePasswordLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-zinc-400 mb-1 block">Master Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-benfic-blue focus:ring-1 focus:ring-benfic-blue transition-all"
              placeholder="••••••••••••"
              required
            />
          </div>
          
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-benfic-blue text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(4,82,218,0.4)] transition-all"
          >
            Unlock Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}