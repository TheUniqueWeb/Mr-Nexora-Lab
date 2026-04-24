import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Download, Box, Code, Smartphone, 
  Plus, Trash2, Edit3, Save, X, Search,
  TrendingUp, Activity, MessageSquare, Briefcase
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  collection, onSnapshot, addDoc, deleteDoc, 
  updateDoc, doc, query, getDocs, orderBy, setDoc, where 
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { cn } from '../../lib/utils';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

type Tab = 'Stats' | 'Tools' | 'Scripts' | 'Apps' | 'Chats' | 'Settings';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('Stats');
  const [stats, setStats] = useState({
    users: 0,
    downloads: 0,
    tools: 0,
    scripts: 0,
    apps: 0
  });

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [ownerInfo, setOwnerInfo] = useState({
    name: 'Mr Nexora',
    role: 'Founder & CEO',
    bio: '',
    email: '',
  });

  useEffect(() => {
    if (!db) return;
    const fetchOwner = async () => {
      const docSnap = await getDocs(query(collection(db, 'settings'), where('id', '==', 'owner')));
      if (!docSnap.empty) {
        setOwnerInfo(docSnap.docs[0].data() as any);
      }
    };
    fetchOwner();
  }, []);

  useEffect(() => {
    if (!db) return;
    
    // Standard collections
    const collections = ['users', 'tools', 'scripts', 'apps'];
    const unsubscribes = collections.map(col => 
      onSnapshot(collection(db, col), (snap) => {
        setStats(prev => ({ ...prev, [col]: snap.size }));
      })
    );

    // Downloads count
    const unsubDownloads = onSnapshot(collection(db, 'downloads'), (snap) => {
      setStats(prev => ({ ...prev, downloads: snap.size }));
    });

    setLoading(false);

    return () => {
      unsubscribes.forEach(unsub => unsub());
      unsubDownloads();
    };
  }, []);

  const handleUpdateOwner = async () => {
    if (!db) return;
    try {
      await setDoc(doc(db, 'settings', 'owner'), ownerInfo);
      toast.success('Mainframe profile updated successfully');
    } catch (e: any) {
      toast.error(`Sync failed: ${e.message}`);
    }
  };
  
  // Chart Data (Mocked for visual)
  const chartData = [
    { name: 'Mon', downloads: 400, users: 240 },
    { name: 'Tue', downloads: 300, users: 139 },
    { name: 'Wed', downloads: 200, users: 980 },
    { name: 'Thu', downloads: 278, users: 390 },
    { name: 'Fri', downloads: 189, users: 480 },
    { name: 'Sat', downloads: 239, users: 380 },
    { name: 'Sun', downloads: 349, users: 430 },
  ];

  useEffect(() => {
    if (!db) return;

    // Real-time stats counting (In production, use batch count or functions)
    const fetchData = () => {
      onSnapshot(collection(db, 'users'), s => setStats(prev => ({ ...prev, users: s.size })));
      onSnapshot(collection(db, 'tools'), s => setStats(prev => ({ ...prev, tools: s.size })));
      onSnapshot(collection(db, 'scripts'), s => setStats(prev => ({ ...prev, scripts: s.size })));
      onSnapshot(collection(db, 'apps'), s => {
        let total = 0;
        s.docs.forEach(d => total += (d.data().downloadsCount || 0));
        setStats(prev => ({ ...prev, apps: s.size, downloads: total }));
      });
    };

    fetchData();
  }, []);

  // Fetch items based on tab
  useEffect(() => {
    if (!db || activeTab === 'Stats') return;
    
    setLoading(true);
    const collectionName = activeTab.toLowerCase();
    const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (s) => {
      setItems(s.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [activeTab]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen">
      <div className="flex flex-col md:flex-row gap-8 mb-12 items-center justify-between">
        <div>
           <h1 className="text-4xl font-bold mb-2">Nexora <span className="text-brand-purple">Control Center</span></h1>
           <p className="text-slate-500 font-medium">Welcome back, Admin. System status: Optimal.</p>
        </div>
        <div className="flex gap-4">
           <div className="px-6 py-3 glass rounded-2xl flex items-center gap-3 border-green-500/20">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-bold text-green-500 uppercase tracking-widest">Live Sync</span>
           </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
        {['Stats', 'Tools', 'Scripts', 'Apps', 'Chats', 'Settings'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as Tab)}
            className={cn(
              "px-8 py-3 rounded-2xl font-bold text-sm transition-all border whitespace-nowrap",
              activeTab === tab 
                ? "bg-brand-purple text-white border-brand-purple shadow-xl shadow-brand-purple/20" 
                : "glass text-slate-400 border-white/5 hover:bg-white/5"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Settings' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-10 max-w-2xl">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
             <User className="text-brand-cyan" /> Bio Architecture settings
          </h2>
          <div className="space-y-6">
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Founder Name</label>
                <input 
                  value={ownerInfo.name} 
                  onChange={e => setOwnerInfo({...ownerInfo, name: e.target.value})}
                  className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3"
                />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Role / Title</label>
                <input 
                  value={ownerInfo.role} 
                  onChange={e => setOwnerInfo({...ownerInfo, role: e.target.value})}
                  className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3"
                />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                <input 
                  value={ownerInfo.email} 
                  onChange={e => setOwnerInfo({...ownerInfo, email: e.target.value})}
                  className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3"
                />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Founder Biography</label>
                <textarea 
                  value={ownerInfo.bio} 
                  onChange={e => setOwnerInfo({...ownerInfo, bio: e.target.value})}
                  className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 h-32"
                />
             </div>
             <button 
               onClick={handleUpdateOwner}
               className="w-full bg-brand-cyan text-brand-dark font-bold py-4 rounded-xl neon-glow-cyan"
             >
                Save Profile Changes
             </button>
          </div>
        </motion.div>
      )}

      {activeTab === 'Stats' ? (
        <div className="space-y-8 animate-in fade-in duration-500">
           {/* Top Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                { label: 'Total Users', value: stats.users, icon: Users, color: 'text-brand-cyan' },
                { label: 'Downloads', value: stats.downloads, icon: Download, color: 'text-amber-400' },
                { label: 'Live Tools', value: stats.tools, icon: Box, color: 'text-brand-purple' },
                { label: 'Scripts', value: stats.scripts, icon: Code, color: 'text-emerald-400' },
                { label: 'Store Apps', value: stats.apps, icon: Smartphone, color: 'text-rose-400' }
              ].map((item, i) => (
                <div key={i} className="glass-card p-6 border-none">
                   <div className="flex items-center justify-between mb-4">
                      <div className={cn("p-3 rounded-xl bg-white/5", item.color)}>
                        <item.icon className="w-6 h-6" />
                      </div>
                      <TrendingUp className="text-slate-700 w-5 h-5" />
                   </div>
                   <div className="text-3xl font-bold">{item.value.toLocaleString()}</div>
                   <div className="text-xs font-bold text-slate-500 uppercase tracking-tighter mt-1">{item.label}</div>
                </div>
              ))}
           </div>

           {/* Charts */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 glass-card p-8">
                 <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                   <Activity className="w-5 h-5 text-brand-purple" /> Growth Analytics
                 </h3>
                 <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ background: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                          itemStyle={{ color: '#fff' }}
                        />
                        <Area type="monotone" dataKey="users" stroke="#a855f7" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={3} />
                        <Area type="monotone" dataKey="downloads" stroke="#22d3ee" fillOpacity={0} strokeDasharray="5 5" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              <div className="glass-card p-8 flex flex-col">
                 <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-amber-400" /> Recent Actions
                 </h3>
                 <div className="space-y-6 flex-grow">
                    {[
                      { action: 'Updated VPN v2.4.1', time: '2 mins ago', icon: Smartphone },
                      { action: 'New Tool: JSON Formatter', time: '45 mins ago', icon: Box },
                      { action: 'Admin login detected', time: '1 hour ago', icon: ShieldCheck },
                      { action: 'Script deleted: Legacy JS', time: '3 hours ago', icon: Code }
                    ].map((act, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                          <act.icon className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{act.action}</div>
                          <div className="text-[10px] text-slate-500 font-bold uppercase">{act.time}</div>
                        </div>
                      </div>
                    ))}
                 </div>
                 <button className="w-full mt-8 py-3 rounded-xl border border-white/5 text-slate-500 text-sm font-bold hover:bg-white/5 transition-all">
                    View Full Logs
                 </button>
              </div>
           </div>
        </div>
      ) : (
        <div className="animate-in slide-in-from-bottom-5 duration-500">
           <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                Manage {activeTab} 
                <span className="text-xs font-bold text-slate-600 bg-white/5 px-2 py-1 rounded-md">{items.length}</span>
              </h2>
              <button 
                onClick={() => setShowForm(true)}
                className="bg-brand-purple text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 neon-glow transition-all active:scale-95"
              >
                <Plus className="w-5 h-5" /> Add New {activeTab.slice(0, -1)}
              </button>
           </div>

           {/* Table/List View */}
           <div className="glass rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
              <table className="w-full text-left">
                 <thead className="bg-white/5">
                    <tr>
                       <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Name / ID</th>
                       <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Details</th>
                       <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                       <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors">
                         <td className="px-8 py-6">
                            <div className="font-bold text-white">{item.name}</div>
                            <div className="text-[10px] font-mono text-slate-600">{item.id}</div>
                         </td>
                         <td className="px-8 py-6">
                            <div className="text-sm text-slate-400 line-clamp-1">{item.description || item.lastMessage}</div>
                         </td>
                         <td className="px-8 py-6">
                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase border border-emerald-500/20">Active</span>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <div className="flex justify-end gap-2">
                               <button className="p-2 glass rounded-lg text-slate-400 hover:text-brand-cyan"><Edit3 className="w-4 h-4" /></button>
                               <button 
                                onClick={async () => {
                                  if (window.confirm('Delete this item?')) {
                                    await deleteDoc(doc(db!, activeTab.toLowerCase(), item.id));
                                  }
                                }}
                                className="p-2 glass rounded-lg text-slate-400 hover:text-red-500"
                               >
                                <Trash2 className="w-4 h-4" />
                               </button>
                            </div>
                         </td>
                      </tr>
                    ))}
                    {items.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-8 py-20 text-center text-slate-500 italic">No data records found in this vector.</td>
                      </tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {/* Simple Add Support - To be expanded for each model */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForm(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
             <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative glass-card p-10 w-full max-w-xl border-white/10 shadow-2xl">
                <h3 className="text-2xl font-bold mb-8">Add New {activeTab.slice(0,-1)}</h3>
                {/* Form fields here - simplified for brief turn */}
                <div className="space-y-6">
                   <input className="w-full bg-brand-dark border border-white/10 rounded-xl px-6 py-3" placeholder="Resource Name" />
                   <textarea className="w-full bg-brand-dark border border-white/10 rounded-xl px-6 py-3 h-32" placeholder="Description" />
                </div>
                <div className="flex gap-4 mt-10">
                   <button onClick={() => setShowForm(false)} className="flex-grow py-3 rounded-xl glass font-bold text-slate-400">Cancel</button>
                   <button className="flex-grow py-3 rounded-xl bg-brand-purple text-white font-bold neon-glow">Create Record</button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Add simple helper for lucide-react if missed
const ShieldCheck = (props: any) => <Activity {...props} />;
