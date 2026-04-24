import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Smartphone, Download, Star, Info, TrendingUp, Cpu, Battery, Sliders } from 'lucide-react';
import { collection, query, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cn } from '../lib/utils';

interface AppItem {
  id: string;
  name: string;
  description: string;
  version: string;
  image: string;
  downloadsCount: number;
  rating: number;
  downloadUrl: string;
  tags: string[];
}

export default function AppStore() {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setApps([
        {
          id: '1',
          name: 'Nexora VPN',
          description: 'Ultra-fast, military-grade encrypted VPN with 100+ locations.',
          version: 'v2.4.1',
          image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=400',
          downloadsCount: 12450,
          rating: 4.8,
          downloadUrl: '#',
          tags: ['Security', 'Privacy']
        },
        {
          id: '2',
          name: 'CodeFlow Mobile',
          description: 'Full-featured IDE for coding on the go. Supports 50+ languages.',
          version: 'v1.0.8',
          image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=400',
          downloadsCount: 8820,
          rating: 4.9,
          downloadUrl: '#',
          tags: ['Developer', 'Editor']
        }
      ]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'apps'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AppItem));
      setApps(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDownload = async (appId: string) => {
    if (db) {
      try {
        await updateDoc(doc(db, 'apps', appId), {
          downloadsCount: increment(1)
        });
      } catch (e) {
        console.error('Error updating download count', e);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-10 pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-20">
        <div className="max-w-2xl text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">Nexus <span className="text-amber-400">App Store</span></h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Experience the pinnacle of mobile and desktop software. Every app is hand-picked for performance, design, and utility. Join millions of users discovering elite software.
            </p>
          </motion.div>
        </div>
        
        <div className="hidden md:flex gap-4">
           {/* Visual Decorative elements */}
           <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center animate-bounce duration-1000">
             <TrendingUp className="text-amber-400 w-8 h-8" />
           </div>
           <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center animate-bounce delay-200">
             <Smartphone className="text-brand-purple w-8 h-8" />
           </div>
        </div>
      </div>

      <div className="space-y-8">
        {apps.map((app, i) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-4 md:p-8 flex flex-col md:flex-row items-center gap-8 group"
          >
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-[32px] overflow-hidden bg-slate-800 border-2 border-white/10 shrink-0 shadow-2xl">
              <img 
                src={app.image} 
                alt={app.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
            </div>

            <div className="flex-grow text-center md:text-left">
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                 {app.tags.map(tag => (
                   <span key={tag} className="text-[10px] font-bold uppercase tracking-widest bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                     {tag}
                   </span>
                 ))}
                 <span className="text-slate-500 text-xs font-bold leading-6">{app.version}</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">{app.name}</h2>
              <p className="text-slate-400 text-sm md:text-base mb-8 max-w-xl">
                {app.description}
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-12 text-center">
                 <div>
                   <div className="text-2xl font-bold text-white flex items-center gap-2">
                     <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> {app.rating}
                   </div>
                   <div className="text-[10px] uppercase font-bold text-slate-500 tracking-tighter mt-1">Average Rating</div>
                 </div>
                 <div>
                   <div className="text-2xl font-bold text-white flex items-center gap-2">
                     <Download className="w-5 h-5 text-brand-cyan" /> {app.downloadsCount.toLocaleString()}
                   </div>
                   <div className="text-[10px] uppercase font-bold text-slate-500 tracking-tighter mt-1">Total Downloads</div>
                 </div>
              </div>
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <a
                href={app.downloadUrl}
                onClick={() => handleDownload(app.id)}
                className="w-full bg-brand-purple hover:bg-brand-purple/80 text-white px-10 py-5 rounded-[24px] font-bold text-lg flex items-center justify-center gap-4 neon-glow transition-all active:scale-95"
              >
                <Download className="w-6 h-6" /> Download Now
              </a>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* App Features Overlay info */}
      <div className="mt-32 grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { icon: Cpu, label: "Optimization", text: "Optimized for all hardware" },
          { icon: Battery, label: "Energy", text: "Minimal energy consumption" },
          { icon: Sliders, label: "Customizable", text: "Fully adjustable settings" },
          { icon: Info, label: "Free Updates", text: "Lifetime periodic updates" }
        ].map((feat, i) => (
          <div key={i} className="text-center p-8 glass-card border-none bg-transparent">
             <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                <feat.icon className="text-brand-cyan w-8 h-8" />
             </div>
             <h4 className="font-bold text-white mb-2">{feat.label}</h4>
             <p className="text-slate-500 text-sm">{feat.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
