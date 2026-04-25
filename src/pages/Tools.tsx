import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, ExternalLink, Bookmark, Zap, Wrench, Globe, Smartphone, Shield } from 'lucide-react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cn } from '../lib/utils';

interface Tool {
  id: string;
  title: string;
  description: string;
  link: string;
  tag: string;
  icon?: string;
  isPopular?: boolean;
}

export default function Tools() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = ['All', 'Web', 'Dev', 'Security', 'Design', 'Other'];

  useEffect(() => {
    if (!db) {
      // Mock data for demo if firebase not setup
      setTools([
        { id: '1', title: 'JSON Prettifier', description: 'Advanced JSON formatting and validation tool.', link: '#', tag: 'Dev', isPopular: true },
        { id: '2', title: 'CSS Gradient Gen', description: 'Visual editor for modern CSS gradients.', link: '#', tag: 'Design' },
      ]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'tools'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setTools(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || tool.tag === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-10 pb-20">
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold mb-4"
        >
          Curated <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-cyan to-brand-indigo">Tools</span>
        </motion.h1>
        <p className="text-slate-400">Essential utilities for the modern digital explorer</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-6 mb-12 items-center">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search tools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-brand-purple transition-all"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 w-full no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border",
                activeCategory === cat 
                  ? "bg-brand-purple text-white border-brand-purple shadow-lg shadow-brand-purple/20" 
                  : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card p-6 flex flex-col h-full animate-pulse">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/5 skeleton" />
                <div className="w-10 h-10 rounded-lg bg-white/5 skeleton" />
              </div>
              <div className="flex-grow space-y-4">
                <div className="h-6 w-3/4 bg-white/5 rounded skeleton" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-white/5 rounded skeleton" />
                  <div className="h-4 w-5/6 bg-white/5 rounded skeleton" />
                </div>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-6">
                <div className="h-4 w-16 bg-white/5 rounded skeleton" />
                <div className="h-4 w-24 bg-white/5 rounded skeleton" />
              </div>
            </div>
          ))
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredTools.map((tool, i) => (
            <motion.div
              key={tool.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-6 flex flex-col group h-full"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-purple to-brand-cyan flex items-center justify-center neon-glow">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <button 
                  onClick={() => toggleFavorite(tool.id)}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    favorites.includes(tool.id) ? "text-red-500 bg-red-500/10" : "text-slate-500 hover:bg-white/5"
                  )}
                >
                  <Bookmark className="w-5 h-5" fill={favorites.includes(tool.id) ? "currentColor" : "none"} />
                </button>
              </div>

              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-brand-pink transition-colors">{tool.title}</h3>
                  {tool.isPopular && (
                    <span className="text-[10px] uppercase font-bold tracking-tighter bg-brand-pink/20 text-brand-pink px-2 py-0.5 rounded-full border border-brand-pink/20">Popular</span>
                  )}
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {tool.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <span className="text-xs font-bold text-brand-cyan uppercase tracking-widest">{tool.tag}</span>
                <a
                  href={tool.link}
                  className="flex items-center gap-2 text-brand-pink font-bold text-sm hover:gap-3 transition-all"
                >
                  Open Tool <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>

      {filteredTools.length === 0 && !loading && (
        <div className="text-center py-20">
          <Wrench className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-slate-500">No tools found</h3>
          <p className="text-slate-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
