"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [projects, setProjects] = useState([]);
  const [visitors, setVisitors] = useState(0); 
  const [chartData, setChartData] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // --- Profile Photo State ---
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  // --- Form State for Projects ---
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [processText, setProcessText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [processImage1, setProcessImage1] = useState<File | null>(null);
  const [processImage2, setProcessImage2] = useState<File | null>(null);

  useEffect(() => {
    if (!sessionStorage.getItem("tab_auth")) {
      signOut({ callbackUrl: "/admin/login" });
    } else {
      fetchProjects();
      fetchStats();
      fetchProfile();
    }
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.success) setProjects(data.data);
    } catch (error) { console.error("Project fetch error:", error); }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/track");
      const data = await res.json();
      if (data.success) {
        setVisitors(data.total);
        setChartData(data.chartData);
      }
    } catch (error) { console.error("Stats fetch error:", error); }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (data.success) setProfileData(data.data);
    } catch (error) { console.error("Profile fetch error:", error); }
  };

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle Profile Photo Upload
  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUpdatingProfile(true);
    try {
      const base64 = await toBase64(file);
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileImageUrl: base64 }),
      });

      if (res.ok) {
        alert("About Me photo updated successfully!");
        fetchProfile();
      }
    } catch (error) {
      alert("Error uploading photo.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const payload: any = { title, category, description, liveLink, processText };
      
      if (image) payload.imageUrl = await toBase64(image);
      if (processImage1) payload.processImage1 = await toBase64(processImage1);
      if (processImage2) payload.processImage2 = await toBase64(processImage2);

      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/projects/${editingId}` : "/api/projects";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(`Project successfully ${editingId ? "updated" : "uploaded"}!`);
        resetForm();
        fetchProjects(); 
        setActiveTab("list"); 
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this project?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Project deleted.");
        fetchProjects();
      }
    } catch (error) { console.error(error); }
  };

  const handleEdit = (project: any) => {
    setEditingId(project._id);
    setTitle(project.title);
    setCategory(project.category);
    setDescription(project.description);
    setLiveLink(project.liveLink || "");
    setProcessText(project.processText || "");
    setImage(null);
    setProcessImage1(null);
    setProcessImage2(null);
    setActiveTab("upload"); 
  };

  const resetForm = () => {
    setEditingId(null); setTitle(""); setCategory(""); setDescription("");
    setLiveLink(""); setProcessText(""); setImage(null);
    setProcessImage1(null); setProcessImage2(null);
  };

  const isWebCategory = category === "Web Development" || category === "Wordpress Development";

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 border border-zinc-700 p-3 rounded-lg shadow-xl">
          <p className="text-zinc-400 text-xs mb-1">{label}</p>
          <p className="text-benfic-blue font-bold text-lg">{payload[0].value} Visitors</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-zinc-900/50 border-r border-zinc-800 p-6 flex flex-col">
        <div className="mb-10">
          <h1 className="text-2xl font-bold">Admin <span className="text-benfic-blue">Panel</span></h1>
        </div>

        <nav className="flex-1 space-y-2">
          <button onClick={() => setActiveTab("overview")} className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeTab === "overview" ? "bg-benfic-blue text-white" : "text-zinc-400 hover:bg-zinc-800"}`}>Overview</button>
          <button onClick={() => { resetForm(); setActiveTab("upload"); }} className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeTab === "upload" ? "bg-benfic-blue text-white" : "text-zinc-400 hover:bg-zinc-800"}`}>{editingId ? "Edit Project" : "Add New Project"}</button>
          <button onClick={() => setActiveTab("list")} className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeTab === "list" ? "bg-benfic-blue text-white" : "text-zinc-400 hover:bg-zinc-800"}`}>Manage Database</button>
        </nav>

        <button onClick={() => signOut({ callbackUrl: "/" })} className="mt-auto flex items-center gap-2 text-red-400 hover:bg-red-400/10 px-4 py-3 rounded-xl">
          Secure Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        
        {/* TAB: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl">
            <h2 className="text-3xl font-bold mb-8">Dashboard Overview</h2>
            
            {/* PROFILE PHOTO SECTION */}
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl mb-8 flex flex-col sm:flex-row items-center gap-6">
               <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-benfic-blue overflow-hidden flex-shrink-0">
                  {profileData?.profileImageUrl ? (
                    <img src={profileData.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">No Photo</div>
                  )}
               </div>
               <div className="flex-1 text-center sm:text-left">
                 <h3 className="text-lg font-bold text-white mb-2">About Me Photo</h3>
                 <p className="text-sm text-zinc-400 mb-4">Update your profile image displayed on the public About page.</p>
                 <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleProfileUpload} 
                    className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-benfic-blue file:text-white hover:file:bg-blue-600 cursor-pointer"
                  />
                  {isUpdatingProfile && <p className="text-xs text-benfic-blue mt-2 animate-pulse">Uploading to database...</p>}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
                <p className="text-zinc-400 text-sm mb-1">Total Visitors All-Time</p>
                <p className="text-4xl font-bold text-white">{visitors}</p>
                <p className="text-green-400 text-xs mt-2 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  Live traffic tracking
                </p>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
                <p className="text-zinc-400 text-sm mb-1">Total Projects in DB</p>
                <p className="text-4xl font-bold text-white">{projects.length}</p>
                <p className="text-benfic-blue text-xs mt-2">Currently displayed</p>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 h-[400px]">
              <h3 className="text-lg font-bold text-white mb-6">Traffic Over Last 7 Days</h3>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0452DA" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#0452DA" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="visitors" stroke="#0452DA" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitors)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-500">Analytics loading...</div>
              )}
            </div>
          </div>
        )}

        {/* TAB: LIST / MANAGE */}
        {activeTab === "list" && (
          <div className="max-w-5xl">
            <h2 className="text-3xl font-bold mb-8">Manage Existing Projects</h2>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6">
              {projects.length === 0 ? (
                <p className="text-zinc-500 text-center py-10">No projects found in database.</p>
              ) : (
                <div className="space-y-4">
                  {projects.map((proj: any) => (
                    <div key={proj._id} className="flex flex-col sm:flex-row items-center justify-between bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                      <div className="flex items-center gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
                        <img src={proj.imageUrl} alt="" className="w-16 h-12 object-cover rounded bg-zinc-800" />
                        <div>
                          <p className="font-bold text-white">{proj.title}</p>
                          <p className="text-xs text-benfic-blue">{proj.category}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => handleEdit(proj)} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors">Edit</button>
                        <button onClick={() => handleDelete(proj._id)} className="px-4 py-2 bg-red-900/50 hover:bg-red-600 text-red-200 hover:text-white rounded-lg text-sm font-medium transition-colors">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: UPLOAD / EDIT */}
        {activeTab === "upload" && (
          <div className="max-w-4xl">
            <h2 className="text-3xl font-bold mb-8">{editingId ? "Edit Project Details" : "Upload New Project"}</h2>
            
            <form onSubmit={handleUpload} className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Project Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3" required />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 appearance-none" required>
                    <option value="" disabled>Select a category</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Wordpress Development">Wordpress Development</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Graphic Design">Graphic Design</option>
                  </select>
                </div>
              </div>

              {isWebCategory && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className="block text-sm text-benfic-blue font-semibold mb-2">Live Website URL (Optional)</label>
                  <input type="url" value={liveLink} onChange={(e) => setLiveLink(e.target.value)} placeholder="https://..." className="w-full bg-zinc-950 border border-benfic-blue/50 rounded-xl px-4 py-3" />
                </div>
              )}

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Short Description (For Cards)</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 resize-none" required />
              </div>

              <div className="border-t border-zinc-800 pt-6">
                <h3 className="text-xl font-bold text-white mb-4">Case Study Details (Optional)</h3>
                <label className="block text-sm text-zinc-400 mb-2">The Process & Solution</label>
                <textarea value={processText} onChange={(e) => setProcessText(e.target.value)} rows={5} placeholder="Explain the problem, your approach, and the final result..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 resize-none mb-4" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Process Image 1</label>
                    <input type="file" accept="image/*" onChange={(e) => setProcessImage1(e.target.files?.[0] || null)} className="w-full bg-zinc-950 text-sm border border-zinc-800 rounded-xl p-2" />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Process Image 2</label>
                    <input type="file" accept="image/*" onChange={(e) => setProcessImage2(e.target.files?.[0] || null)} className="w-full bg-zinc-950 text-sm border border-zinc-800 rounded-xl p-2" />
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-6">
                <label className="block text-sm text-zinc-400 mb-2">Main Cover Image {editingId && "(Leave blank to keep existing)"}</label>
                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="w-full bg-zinc-950 text-sm border border-zinc-800 rounded-xl p-3" required={!editingId} />
              </div>

              <button type="submit" disabled={isUploading} className="w-full bg-benfic-blue text-white font-bold py-4 rounded-xl hover:bg-blue-600 transition-all mt-4 disabled:bg-blue-800 disabled:text-gray-400">
                {isUploading ? "Saving to Database..." : (editingId ? "Save Changes" : "Upload Project")}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="w-full text-zinc-400 hover:text-white mt-4">Cancel Edit</button>
              )}
            </form>
          </div>
        )}
      </main>
    </div>
  );
}