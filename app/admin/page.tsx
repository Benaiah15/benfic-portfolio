"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [projects, setProjects] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // --- STATS/TRAFFIC STATE ---
  const [statsData, setStatsData] = useState<any>(null);
  const [statsTimeframe, setStatsTimeframe] = useState(7);
  const [visitors, setVisitors] = useState(0); 
  const [chartData, setChartData] = useState<any[]>([]);

  // --- PROFILE DATA STATE ---
  const [profileData, setProfileData] = useState<any>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  
  // --- CATEGORY CONFIG STATE ---
  const [categoryConfigs, setCategoryConfigs] = useState<any[]>([]);
  const [isUpdatingConfigs, setIsUpdatingConfigs] = useState(false);

  // --- Form State for Projects ---
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);

  // Case Study Sections
  const [problemSolved, setProblemSolved] = useState("");
  const [solutionText, setSolutionText] = useState("");
  const [processBreakdown, setProcessBreakdown] = useState("");
  const [processImageFiles, setProcessImageFiles] = useState<FileList | null>(null);

  // --- NEW DYNAMIC FIELDS STATE ---
  const [laptopViewFile, setLaptopViewFile] = useState<File | null>(null);
  const [tabletViewFile, setTabletViewFile] = useState<File | null>(null);
  const [mobileViewFile, setMobileViewFile] = useState<File | null>(null);
  
  const [technologiesUsed, setTechnologiesUsed] = useState(""); 
  const [wpThemeUsed, setWpThemeUsed] = useState("");
  const [wpPluginsUsed, setWpPluginsUsed] = useState(""); 
  
  const [graphicDesignType, setGraphicDesignType] = useState(""); 

  useEffect(() => {
    if (!sessionStorage.getItem("tab_auth")) {
      signOut({ callbackUrl: "/admin/login" });
    } else {
      fetchProjects();
      fetchProfile();
      fetchCategoryConfigs();
    }
  }, []);
  
  useEffect(() => {
    fetchStats();
  }, [statsTimeframe]);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.success) setProjects(data.data);
    } catch (error) { console.error("Project fetch error:", error); }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/track?timeframe=${statsTimeframe}`);
      const data = await res.json();
      if (data.success) {
        setVisitors(data.total);
        setChartData(data.chartData);
        setStatsData(data.trafficDetails);
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

  const fetchCategoryConfigs = async () => {
    try {
      const res = await fetch("/api/category-config");
      const data = await res.json();
      if (data.success) {
        const requiredCategories = ["Web Development", "Wordpress Development", "UI/UX Design", "Graphic Design"];
        const existingData = data.data;
        
        const initializedData = requiredCategories.map(cat => {
            const found = existingData.find((e: any) => e.categoryName === cat);
            return found || { categoryName: cat, shortDescription: "", featuredImageUrl: "" };
        });
        setCategoryConfigs(initializedData);
      }
    } catch (error) { console.error("CategoryConfig fetch error:", error); }
  };

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };
  
  const multiToBase64 = async (files: FileList | null): Promise<string[]> => {
    if (!files || files.length === 0) return [];
    const filesArray = Array.from(files);
    return Promise.all(filesArray.map(file => toBase64(file)));
  };

  const stringToArray = (str: string): string[] => {
    if (!str) return [];
    return str.split(',').map(item => item.trim()).filter(item => item !== "");
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    const form = e.target as HTMLFormElement;
    const formData: any = {
        bioExcerpt: (form.elements.namedItem("bioExcerpt") as HTMLTextAreaElement).value,
        fullBio: (form.elements.namedItem("fullBio") as HTMLTextAreaElement).value,
    };
    
    const fileInput = (form.elements.namedItem("profileImageUrl") as HTMLInputElement).files?.[0];
    if (fileInput) {
        formData.profileImageUrl = await toBase64(fileInput);
    }
    
    try {
        const res = await fetch("/api/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        if (res.ok) {
            alert("Profile settings updated!");
            fetchProfile();
        }
    } catch (error) { alert("Error uploading profile data"); }
    finally { setIsUpdatingProfile(false); }
  };

  const handleConfigsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingConfigs(true);
    
    const updatedConfigsWithBase64 = await Promise.all(categoryConfigs.map(async (config: any, index: number) => {
        const fileInputId = `featuredImageUrl_${index}`;
        const fileInput = document.getElementById(fileInputId) as HTMLInputElement;
        const file = fileInput.files?.[0];
        
        let newBase64 = config.featuredImageUrl; 
        if (file) {
            newBase64 = await toBase64(file);
        }
        return { ...config, featuredImageUrl: newBase64 };
    }));
    
    try {
        const res = await fetch("/api/category-config", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedConfigsWithBase64),
        });
        if (res.ok) {
            alert("Category featured images & descriptions updated!");
            fetchCategoryConfigs();
        }
    } catch (error) { alert("Error uploading configs data"); }
    finally { setIsUpdatingConfigs(false); }
  };

  const handleProjectUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const payload: any = { 
        title, category, description, liveLink, 
        problemSolved, solutionText, processBreakdown 
      };
      
      if (coverImage) payload.imageUrl = await toBase64(coverImage);
      if (processImageFiles) payload.processImages = await multiToBase64(processImageFiles);

      const isWebWP = category === "Web Development" || category === "Wordpress Development";
      if (isWebWP) {
        if (laptopViewFile) payload.viewLaptopImageUrl = await toBase64(laptopViewFile);
        if (tabletViewFile) payload.viewTabletImageUrl = await toBase64(tabletViewFile);
        if (mobileViewFile) payload.viewMobileImageUrl = await toBase64(mobileViewFile);
      }
      
      if (category === "Web Development") payload.technologiesUsed = stringToArray(technologiesUsed);
      if (category === "Wordpress Development") {
        payload.wpThemeUsed = wpThemeUsed;
        payload.wpPluginsUsed = stringToArray(wpPluginsUsed);
      }
      if (category === "Graphic Design") payload.graphicDesignType = graphicDesignType;

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

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this project case study?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Project deleted.");
        fetchProjects();
      }
    } catch (error) { console.error(error); }
  };

  const handleEditProject = (project: any) => {
    setEditingId(project._id);
    setTitle(project.title);
    setCategory(project.category);
    setDescription(project.description);
    setLiveLink(project.liveLink || "");
    setProblemSolved(project.problemSolved || "");
    setSolutionText(project.solutionText || "");
    setProcessBreakdown(project.processBreakdown || "");
    
    setCoverImage(null); setProcessImageFiles(null);
    setLaptopViewFile(null); setTabletViewFile(null); setMobileViewFile(null);
    
    setTechnologiesUsed(project.technologiesUsed?.join(', ') || "");
    setWpThemeUsed(project.wpThemeUsed || "");
    setWpPluginsUsed(project.wpPluginsUsed?.join(', ') || "");
    setGraphicDesignType(project.graphicDesignType || "");
    
    setActiveTab("upload"); 
  };

  const resetForm = () => {
    setEditingId(null); setTitle(""); setCategory(""); setDescription("");
    setLiveLink(""); setCoverImage(null); setProblemSolved(""); setSolutionText("");
    setProcessBreakdown(""); setProcessImageFiles(null);
    setLaptopViewFile(null); setTabletViewFile(null); setMobileViewFile(null);
    setTechnologiesUsed(""); setWpThemeUsed(""); setWpPluginsUsed("");
    setGraphicDesignType("");
  };

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
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-bold">BEN<span className="text-benfic-blue">FIC</span></h1>
          <p className="text-zinc-500 text-xs mt-1 tracking-wider">CREATIVE DASHBOARD</p>
        </div>

        <nav className="flex-1 space-y-2">
          <button onClick={() => setActiveTab("overview")} className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeTab === "overview" ? "bg-benfic-blue text-white" : "text-zinc-400 hover:bg-zinc-800"}`}>Live Traffic</button>
          <button onClick={() => setActiveTab("config")} className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeTab === "config" ? "bg-benfic-blue text-white" : "text-zinc-400 hover:bg-zinc-800"}`}>Site Configuration</button>
          <button onClick={() => { resetForm(); setActiveTab("upload"); }} className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeTab === "upload" ? "bg-benfic-blue text-white" : "text-zinc-400 hover:bg-zinc-800"}`}>{editingId ? "Edit Case Study" : "Add Case Study"}</button>
          <button onClick={() => setActiveTab("list")} className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeTab === "list" ? "bg-benfic-blue text-white" : "text-zinc-400 hover:bg-zinc-800"}`}>Manage Database</button>
        </nav>

        <button onClick={() => signOut({ callbackUrl: "/" })} className="mt-auto flex items-center justify-center gap-2 text-red-400 hover:bg-red-400/10 px-4 py-3 rounded-xl">
          Secure Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        
        {/* TAB: OVERVIEW (LIVE TRAFFIC) */}
        {activeTab === "overview" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              Real-time Traffic Monitor
            </h2>

            {/* Total Counters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
                <p className="text-zinc-400 text-sm mb-1">Total Visitors All-Time</p>
                <p className="text-5xl font-extrabold text-white">{visitors}</p>
                <p className="text-zinc-500 text-xs mt-2">Unique visit log entries</p>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
                <p className="text-zinc-400 text-sm mb-1">Total Case Studies</p>
                <p className="text-5xl font-extrabold text-white">{projects.length}</p>
                <p className="text-benfic-blue text-xs mt-2"> Dynanmic projects in database</p>
              </div>
            </div>
            
            {/* Chart Timeframe Toggle */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">Visit Stats</h3>
                    <div className="flex flex-wrap gap-2 bg-zinc-950 p-1.5 rounded-full border border-zinc-800 text-sm">
                        {[
                          {val: 7, label: '7D'}, {val: 30, label: '30D'}, 
                          {val: 90, label: '3M'}, {val: 180, label: '6M'}, {val: 365, label: '1Y'}
                        ].map(t => (
                            <button 
                                key={t.val}
                                onClick={() => setStatsTimeframe(t.val)}
                                className={`px-3 py-1.5 sm:px-4 rounded-full transition-colors ${statsTimeframe === t.val ? 'bg-benfic-blue text-white' : 'text-zinc-500 hover:bg-zinc-800 hover:text-white'}`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-[400px]">
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
                        <XAxis dataKey="name" stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="visitors" stroke="#0452DA" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitors)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600 bg-zinc-950/50 rounded-xl border border-zinc-800">Loading timeframe analytics...</div>
                  )}
                </div>
            </div>

            {/* Traffic Details (Country/Device) */}
            {statsData ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-6">Top Visitor Origins (Last {statsTimeframe}D)</h3>
                        <div className="space-y-4">
                            {statsData.countries.map((c: any) => (
                                <div key={c._id} className="flex items-center justify-between gap-4 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                                    <p className="font-bold text-white text-xl">{c._id}</p>
                                    <p className="text-benfic-blue font-bold">{c.count} Visits</p>
                                </div>
                            ))}
                            {statsData.countries.length === 0 && <p className="text-zinc-600 text-center py-6">No country data captured yet.</p>}
                        </div>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-6">Device Breakdown (Last {statsTimeframe}D)</h3>
                        <div className="space-y-4">
                            {statsData.devices.map((d: any) => (
                                <div key={d._id} className="flex items-center justify-between gap-4 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                                    <p className="font-bold text-white text-lg capitalize">{d._id}</p>
                                    <p className="text-benfic-blue font-bold">{d.count} Visits</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-zinc-700 text-center py-10 bg-zinc-900 rounded-2xl border border-zinc-800">Loading traffic details...</div>
            )}

          </div>
        )}

        {/* TAB: SITE CONFIG (ABOUT ME & CATEGORIES) */}
        {activeTab === "config" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
            <h2 className="text-3xl font-bold mb-8">Site Configuration & Dynanmic Bio</h2>
            
            <form onSubmit={handleProfileUpdate} className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl mb-12 space-y-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-zinc-800 text-center sm:text-left">
                  <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-benfic-blue overflow-hidden flex-shrink-0">
                    {profileData?.profileImageUrl ? (
                      <img src={profileData.profileImageUrl} alt="Benaiah Ajibade" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">No Photo</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">My Profile (About Me Page)</h3>
                    <input name="profileImageUrl" type="file" accept="image/*" className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-benfic-blue/20 file:text-benfic-blue hover:file:bg-benfic-blue/40 cursor-pointer" />
                  </div>
                </div>

                <div>
                    <label className="block text-sm text-zinc-400 mb-2 font-medium">Home Page Excerpt (Show some and put read more)</label>
                    <textarea name="bioExcerpt" defaultValue={profileData?.bioExcerpt} rows={4} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 resize-none" required placeholder="I generate designs that speak louder than words..."/>
                    <p className="text-zinc-600 text-xs mt-1.5">This short bio appears on the home page about section.</p>
                </div>

                <div>
                    <label className="block text-sm text-zinc-400 mb-2 font-medium">Full Biography (About Me Page)</label>
                    <textarea name="fullBio" defaultValue={profileData?.fullBio} rows={8} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 resize-none" required placeholder="Benaiah Ajibade isn't just a designer... Full detailed story."/>
                    <p className="text-zinc-600 text-xs mt-1.5">This detailed bio appears exclusively on the /about page.</p>
                </div>

                <button type="submit" disabled={isUpdatingProfile} className="w-full sm:w-auto px-8 py-3.5 bg-benfic-blue text-white rounded-xl font-bold hover:bg-blue-600 disabled:bg-zinc-700 disabled:text-zinc-400 transition-colors">
                    {isUpdatingProfile ? "Uploading Bio..." : "Save Bio Settings"}
                </button>
            </form>

            <form onSubmit={handleConfigsUpdate} className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-10">
                <h3 className="text-xl font-bold text-white pb-6 border-b border-zinc-800">Dynamic Portfolio Category Cover Pages</h3>
                <p className="text-zinc-400 text-sm">Set the featured images and short description (cover page) for each of your four main project sections.</p>

                {categoryConfigs.map((config: any, index: number) => (
                    <div key={config.categoryName} className="grid grid-cols-1 md:grid-cols-[150px,1fr] gap-6 p-6 bg-zinc-950 border border-zinc-800 rounded-2xl">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-full aspect-[4/3] bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                                {config.featuredImageUrl ? <img src={config.featuredImageUrl} alt="" className="w-full h-full object-cover"/> : null}
                            </div>
                            <input 
                                id={`featuredImageUrl_${index}`}
                                type="file" 
                                accept="image/*" 
                                className="block w-full text-xs text-zinc-600 file:mr-0 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-zinc-800 file:text-zinc-400 hover:file:bg-zinc-700 cursor-pointer" 
                            />
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-bold text-lg text-benfic-blue">{config.categoryName}</h4>
                            <textarea 
                                value={config.shortDescription}
                                onChange={(e) => {
                                    const newConfigs: any = [...categoryConfigs];
                                    newConfigs[index].shortDescription = e.target.value;
                                    setCategoryConfigs(newConfigs);
                                }}
                                rows={3} 
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 resize-none" 
                                required 
                                placeholder="Explaining what Benfic offers in this section (cover description)..."
                            />
                        </div>
                    </div>
                ))}

                <button type="submit" disabled={isUpdatingConfigs} className="w-full py-4 bg-zinc-800 text-white rounded-xl font-bold hover:bg-benfic-blue transition-colors disabled:bg-zinc-700">
                    {isUpdatingConfigs ? "Uploading Configurations..." : "Save Portfolio Cover Page Settings"}
                </button>
            </form>
          </div>
        )}

        {/* TAB: LIST / MANAGE DATABASE */}
        {activeTab === "list" && (
          <div className="max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-bold mb-8">Manage Existing Case Studies</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
              {projects.length === 0 ? (
                <p className="text-zinc-500 text-center py-10">No case studies found in database. Add one!</p>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {projects.map((proj: any) => (
                    <div key={proj._id} className="flex flex-col sm:flex-row items-center justify-between bg-zinc-950 p-5 rounded-2xl border border-zinc-800 gap-4">
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <img src={proj.imageUrl} alt="" className="w-20 h-16 object-cover rounded-xl bg-zinc-800 border border-zinc-800 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate">{proj.title}</p>
                          <p className="text-xs text-benfic-blue">{proj.category}</p>
                          {proj.graphicDesignType && <p className="text-xs text-zinc-500">{proj.graphicDesignType}</p>}
                        </div>
                      </div>
                      <div className="flex gap-3 w-full sm:w-auto shrink-0">
                        <button onClick={() => handleEditProject(proj)} className="flex-1 sm:flex-none px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors">Edit</button>
                        <button onClick={() => handleDeleteProject(proj._id)} className="flex-1 sm:flex-none px-4 py-2 bg-red-900/50 hover:bg-red-600 text-red-200 hover:text-white rounded-lg text-sm font-medium transition-colors">Delete</button>
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
          <div className="max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-bold mb-8">{editingId ? `Edit: ${title}` : "Upload New Case Study"}</h2>
            
            <form onSubmit={handleProjectUpload} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-zinc-800">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2 font-medium">Project Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5" required placeholder="My Amazing Design" />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2 font-medium">Main Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 appearance-none cursor-pointer" required>
                    <option value="" disabled>Select a main section</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Wordpress Development">Wordpress Development</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Graphic Design">Graphic Design</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[1fr,2fr] gap-6">
                <div>
                    <label className="block text-sm text-zinc-400 mb-2 font-medium">Main Cover Image {editingId && "(Leave blank to keep existing)"}</label>
                    <input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files?.[0] || null)} className="w-full bg-zinc-950 text-sm border border-zinc-800 rounded-xl p-3" required={!editingId} />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2 font-medium">Live Website/App URL (Optional)</label>
                  <input type="url" value={liveLink} onChange={(e) => setLiveLink(e.target.value)} placeholder="https://..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2 font-medium">Project Description (Case study detailed intro)</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 resize-none" required placeholder="Detailed backstory..."/>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-zinc-800 pt-6">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2 font-medium">The Problem</label>
                  <textarea value={problemSolved} onChange={(e) => setProblemSolved(e.target.value)} rows={4} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 resize-none" placeholder="What was the client's challenge?..."/>
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2 font-medium">The Solution</label>
                  <textarea value={solutionText} onChange={(e) => setSolutionText(e.target.value)} rows={4} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 resize-none" placeholder="How did Benfic solve it?..."/>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-6 space-y-4">
                  <h3 className="text-xl font-bold text-white">The Design/Development Process</h3>
                  <textarea value={processBreakdown} onChange={(e) => setProcessBreakdown(e.target.value)} rows={6} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 resize-none" placeholder="Explaining problem, approach, and final result breakdown..."/>
                  
                  <div>
                    <label className="block text-sm text-benfic-blue font-semibold mb-2">Process Images (upload ANY number of images)</label>
                    <input type="file" accept="image/*" multiple onChange={(e) => setProcessImageFiles(e.target.files)} className="w-full bg-zinc-950 text-sm border-2 border-dashed border-zinc-800 rounded-xl p-6 cursor-pointer hover:border-benfic-blue/50" />
                  </div>
              </div>
              
              {category === "Graphic Design" && (
                <div className="border-t border-benfic-blue/30 pt-6 bg-benfic-blue/5 p-6 rounded-2xl animate-in fade-in">
                    <h3 className="text-xl font-bold text-benfic-blue mb-4">Graphics Section</h3>
                    <label className="block text-sm text-zinc-300 mb-2 font-medium">Under which toggle section to add design?</label>
                    <select value={graphicDesignType} onChange={(e) => setGraphicDesignType(e.target.value)} className="w-full bg-zinc-950 border border-benfic-blue/40 rounded-xl px-4 py-3 appearance-none cursor-pointer" required>
                        <option value="" disabled>Select design toggle group</option>
                        <option value="My Brand Design">My Brand Design</option>
                        <option value="My Social Media Design">My Social Media Design</option>
                        <option value="My Poster Design">My Poster Design</option>
                        <option value="My Product Design">My Product Design</option>
                        <option value="Other Design">Other Design</option>
                    </select>
                </div>
              )}

              {(category === "Web Development" || category === "Wordpress Development") && (
                <div className="border-t border-benfic-blue/30 pt-6 bg-benfic-blue/5 p-6 rounded-2xl animate-in fade-in space-y-4">
                    <h3 className="text-xl font-bold text-benfic-blue">Development: Device Views Breakdown</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm text-zinc-300 mb-2 font-medium">Laptop View</label>
                            <input type="file" accept="image/*" onChange={(e) => setLaptopViewFile(e.target.files?.[0] || null)} className="w-full bg-zinc-950 text-sm border border-zinc-800 rounded-xl p-2" />
                        </div>
                        <div>
                            <label className="block text-sm text-zinc-300 mb-2 font-medium">Tablet View</label>
                            <input type="file" accept="image/*" onChange={(e) => setTabletViewFile(e.target.files?.[0] || null)} className="w-full bg-zinc-950 text-sm border border-zinc-800 rounded-xl p-2" />
                        </div>
                        <div>
                            <label className="block text-sm text-zinc-300 mb-2 font-medium">Mobile View</label>
                            <input type="file" accept="image/*" onChange={(e) => setMobileViewFile(e.target.files?.[0] || null)} className="w-full bg-zinc-950 text-sm border border-zinc-800 rounded-xl p-2" />
                        </div>
                    </div>
                </div>
              )}
              
              {category === "Web Development" && (
                <div className="animate-in fade-in pt-4">
                    <label className="block text-sm text-zinc-400 mb-2 font-medium">Technologies Used (Comma separated)</label>
                    <input type="text" value={technologiesUsed} onChange={(e) => setTechnologiesUsed(e.target.value)} placeholder="Next.js, React, TailwindCSS, MongoDB" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3" />
                </div>
              )}
              
              {category === "Wordpress Development" && (
                <div className="animate-in fade-in space-y-4 pt-4">
                    <div>
                        <label className="block text-sm text-zinc-400 mb-2 font-medium">Main Theme Used</label>
                        <input type="text" value={wpThemeUsed} onChange={(e) => setWpThemeUsed(e.target.value)} placeholder="Hello Elementor" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3" />
                    </div>
                    <div>
                        <label className="block text-sm text-zinc-400 mb-2 font-medium">Plugins Used (Comma separated)</label>
                        <input type="text" value={wpPluginsUsed} onChange={(e) => setWpPluginsUsed(e.target.value)} placeholder="WooCommerce, ACF, WP Rocket" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3" />
                    </div>
                </div>
              )}
              
              {category === "UI/UX Design" && (
                <div className="border border-benfic-blue p-6 rounded-2xl bg-benfic-blue/10 animate-in fade-in text-center">
                    <p className="font-bold text-white text-lg">UI/UX Project</p>
                    <p className="text-zinc-300 text-sm">Case study will use Problem, Solution, and Process multi-image sections above.</p>
                </div>
              )}

              <button type="submit" disabled={isUploading} className="w-full bg-benfic-blue text-white font-bold py-4.5 rounded-2xl hover:bg-blue-600 transition-all mt-6 disabled:bg-blue-800 disabled:text-gray-400 text-lg shadow-[0_0_20px_rgba(4,82,218,0.3)]">
                {isUploading ? "Processing uploads & saving..." : (editingId ? "Save Changes" : "Upload Case Study")}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="w-full text-zinc-400 hover:text-white mt-4 text-sm font-medium">Cancel Edit</button>
              )}
            </form>
          </div>
        )}
      </main>
    </div>
  );
}