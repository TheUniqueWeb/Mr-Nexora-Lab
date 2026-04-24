import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Code, Download, Copy, Check, Search, FileCode, Tag, X, Image as ImageIcon } from 'lucide-react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cn } from '../lib/utils';

interface Script {
  id: string;
  name: string;
  description: string;
  code: string;
  language: string;
  image?: string;
  downloadUrl?: string;
}

export default function Scripts() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!db) {
       setScripts([
         { 
           id: '1', 
           name: 'Firebase Auth Helper', 
           description: 'A custom hook for handling Firebase authentication state smoothly in React.', 
           code: `import { useState, useEffect } from 'react';\nimport { onAuthStateChanged } from 'firebase/auth';\nimport { auth } from './firebase';\n\nexport const useAuth = () => {\n  const [user, setUser] = useState(null);\n  useEffect(() => {\n    const unsub = onAuthStateChanged(auth, u => setUser(u));\n    return unsub;\n  }, []);\n  return user;\n};`, 
           language: 'javascript' 
         },
         { 
           id: '2', 
           name: 'Tailwind Glassmorphism', 
           description: 'CSS variables and utility classes for perfect glass effects.', 
           code: `.glass {\n  background: rgba(255, 255, 255, 0.05);\n  backdrop-filter: blur(12px);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n}`, 
           language: 'css' 
         },
         {
            id: '3',
            name: 'Python Web Scraper',
            description: 'Efficient BeautifulSoup based scraper for modern SPAs.',
            code: `import requests\nfrom bs4 import BeautifulSoup\n\ndef scrape(url):\n    res = requests.get(url)\n    soup = BeautifulSoup(res.text, 'html.parser')\n    return soup.title.string`,
            language: 'python'
         }
       ]);
       setLoading(false);
       return;
    }

    const q = query(collection(db, 'scripts'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Script));
      setScripts(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredScripts = scripts.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-10 pb-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Master <span className="text-brand-purple">Scripts</span></h1>
        <p className="text-slate-400">High-performance code templates for your next big project</p>
      </div>

      <div className="relative max-w-2xl mx-auto mb-16">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by name or language..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-12 pr-6 text-white focus:outline-none focus:border-brand-purple transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredScripts.map((script, i) => (
          <motion.div
            key={script.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card group overflow-hidden"
          >
            <div className="aspect-video bg-slate-800 relative overflow-hidden">
               {script.image ? (
                 <img src={script.image} alt={script.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-purple/20 to-brand-cyan/20">
                   <FileCode className="w-16 h-16 text-white/10" />
                 </div>
               )}
               <div className="absolute top-4 left-4">
                 <span className="bg-brand-dark/80 backdrop-blur-md text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                   <Tag className="w-3 h-3 text-brand-cyan" /> {script.language}
                 </span>
               </div>
            </div>

            <div className="p-8">
              <h3 className="text-2xl font-bold mb-3">{script.name}</h3>
              <p className="text-slate-400 text-sm mb-8 line-clamp-2">{script.description}</p>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedScript(script)}
                  className="flex-grow bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 border border-white/5"
                >
                  <Code className="w-4 h-4" /> View Code
                </button>
                <a
                  href={script.downloadUrl || '#'}
                  className="p-3 bg-brand-purple hover:opacity-80 text-white rounded-xl transition-all neon-glow"
                >
                  <Download className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Code Viewer Modal */}
      <AnimatePresence>
        {selectedScript && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedScript(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl glass rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-purple/20 flex items-center justify-center">
                    <Code className="w-6 h-6 text-brand-purple" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedScript.name}</h2>
                    <p className="text-sm text-slate-500">{selectedScript.language.toUpperCase()} • Script Viewer</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedScript(null)}
                  className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-grow overflow-auto p-0 bg-[#1a1b26]">
                 <div className="relative">
                   <button
                    onClick={() => handleCopy(selectedScript.code)}
                    className="absolute top-4 right-4 z-10 glass px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-white/10"
                   >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy Code'}
                   </button>
                   <SyntaxHighlighter
                    language={selectedScript.language.toLowerCase()}
                    style={atomDark}
                    customStyle={{
                      margin: 0,
                      padding: '24px',
                      fontSize: '14px',
                      background: 'transparent',
                    }}
                    showLineNumbers={true}
                   >
                    {selectedScript.code}
                   </SyntaxHighlighter>
                 </div>
              </div>

              <div className="p-6 border-t border-white/10 flex justify-end gap-4">
                <button
                  onClick={() => setSelectedScript(null)}
                  className="px-6 py-2 rounded-xl text-slate-400 hover:text-white font-medium"
                >
                  Close
                </button>
                <a
                  href={selectedScript.downloadUrl || '#'}
                  className="bg-brand-purple text-white px-8 py-2 rounded-xl font-bold flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download File
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
