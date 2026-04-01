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

  // Form State for Projects
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
    } catch (error) { console.error(error); }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/track");
      const data = await res.json();
      if (data.success) {
        setVisitors(data.total);
        setChartData(data.chartData);
      }
    } catch (error) { console.error(error); }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (data.success) setProfileData(data.data);
    } catch (error) { console.error(error); }
  };

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

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
        alert("About Me photo updated!");
        fetchProfile();
      }
    } catch (error) { alert("Upload failed"); }
    finally { setIsUpdatingProfile(false); }
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
        alert("Success!");
        resetForm();
        fetchProjects();
        setActiveTab("list");
      }
    } catch (error) { console.error(error); }
    finally { setIsUploading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    fetchProjects();
  };

  const handleEdit = (project: any) => {
    setEditingId(project._id);
    setTitle(project.title);
    setCategory(project.category);
    setDescription(project.description);
    setLiveLink(project.liveLink || "");
    setProcessText(project.processText || "");
    setActiveTab("upload"); 
  };

  const resetForm = () => {
    setEditingId(null); setTitle(""); setCategory(""); setDescription("");
    setLiveLink(""); setProcessText(""); setImage(null);
    setProcessImage1(null); setProcessImage2(null);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 border border-zinc-700 p-3 rounded-lg">
          <p className="text-zinc-400 text-xs">{label}</p>
          <p className="text-benfic-blue font-bold">{payload[0].value} Visitors</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-zinc-900/50 border-r border-zinc-800 p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-10">Admin <span className="text-benfic-blue">Panel</span></h1>
        <nav className="flex-1 space-y-2">
          <button onClick={() => setActiveTab("overview")} className={`w-full text-left px-4 py-3 rounded-xl ${activeTab === "overview" ? "bg-benfic-blue" : "text-zinc-400"}`}>Overview</button>
          <button onClick={() => { resetForm(); setActiveTab("upload"); }} className={`w-full text-left px-4 py-3 rounded-xl ${activeTab === "upload" ? "bg-benfic-blue" : "text-zinc-400"}`}>Add/Edit Project</button>
          <button onClick={() => setActiveTab("list")} className={`w-full text-left px-4 py-3 rounded-xl ${activeTab === "list" ? "bg-benfic-blue" : "text-zinc-400"}`}>Manage Projects</button>
        </nav>
        <button onClick={() => signOut({ callbackUrl: "/" })} className="mt-auto text-red-400 p-4">Logout</button>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {activeTab === "overview" && (
          <div className="max-w-6xl">
            <h2 className="text-3xl font-bold mb-8">Dashboard Overview</h2>
            
            {/* THIS IS THE UPLOAD SECTION */}
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl mb-8 flex items-center gap-6">
               <div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-benfic-blue overflow-hidden">
                  {profileData?.profileImageUrl ? <img src={profileData.profileImageUrl} className="w-full h-full object-cover" /> : null}
               </div>
               <div>
                 <h3 className="font-bold mb-2">Change About Me Photo</h3>
                 <input type="file" accept="image/*" onChange={handleProfileUpload} className="text-xs text-zinc-400" />
                 {isUpdatingProfile && <p className="text-benfic-blue text-xs mt-2 animate-pulse">Uploading...</p>}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
                <p className="text-zinc-400 text-sm">Total Visitors</p>
                <p className="text-4xl font-bold">{visitors}</p>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
                <p className="text-zinc-400 text-sm">Projects</p>
                <p className="text-4xl font-bold">{projects.length}</p>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} />
                  <YAxis stroke="#a1a1aa" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="visitors" stroke="#0452DA" fill="#0452DA" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ... Rest of the tabs (Manage/Upload) stay exactly the same as previous version ... */}
        {/* (I'm keeping this code block short for clarity, ensure the rest of your form logic below remains intact) */}
      </main>
    </div>
  );
}