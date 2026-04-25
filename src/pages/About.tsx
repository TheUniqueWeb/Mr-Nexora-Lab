import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Calendar, User, Shield, Github, Twitter, Instagram, Linkedin, ExternalLink, Award, Coffee, BookOpen, Globe } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cn } from '../lib/utils';

export default function About() {
  const [profile, setProfile] = useState({
    name: 'Mr Nexora',
    role: 'Founder & CEO',
    email: 'contact@mrnexoralab.app',
    age: '24',
    dob: 'May 15, 2002',
    bio: 'Visionary developer and security researcher with a passion for building scalable, high-performance digital tools. My mission is to bridge the gap between complex technology and end-user accessibility through clean design and robust engineering.',
    location: 'Silicon Valley of South Asia',
    experience: '8+ Years',
    projects: '250+',
    skills: ['Full Stack Dev', 'Cloud Architecture', 'Cyber Security', 'UI/UX Design', 'System Design']
  });

  useEffect(() => {
    if (!db) return;
    const fetchProfile = async () => {
      const snap = await getDoc(doc(db, 'settings', 'owner'));
      if (snap.exists()) {
        setProfile(prev => ({ ...prev, ...snap.data() }));
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 pt-10 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1 space-y-8">
           <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="glass-card p-8 text-center"
           >
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 md:w-48 md:h-48 rounded-[40px] overflow-hidden border-4 border-brand-purple shadow-2xl mx-auto bg-slate-800">
                   <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                   />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-brand-cyan text-brand-dark p-2 rounded-xl shadow-lg ring-4 ring-brand-dark">
                  <Award className="w-6 h-6" />
                </div>
              </div>

              <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
              <p className="text-brand-purple font-bold tracking-widest text-xs uppercase mb-8">{profile.role}</p>

              <div className="flex justify-center gap-4 mb-8">
                {[Github, Twitter, Instagram, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-slate-400 hover:text-brand-purple hover:border-brand-purple/50 transition-all">
                    <Icon className="w-6 h-6" />
                  </a>
                ))}
              </div>

              <button className="w-full bg-brand-purple text-white py-4 rounded-2xl font-bold neon-glow hover:scale-105 active:scale-95 transition-all">
                Send a Message
              </button>
           </motion.div>

           <div className="glass-card p-8 space-y-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                <User className="text-brand-cyan w-5 h-5" /> Information
              </h3>
              <div className="space-y-4">
                 {[
                   { label: 'Location', value: profile.location, icon: Globe },
                   { label: 'Experience', value: profile.experience, icon: Coffee },
                   { label: 'Completed', value: profile.projects, icon: BookOpen }
                 ].map((info, i) => (
                   <div key={i} className="flex items-center justify-between">
                     <span className="text-slate-500 text-sm flex items-center gap-2">
                       <info.icon className="w-4 h-4" /> {info.label}
                     </span>
                     <span className="text-white font-bold text-sm">{info.value}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Right Column - Experience & Details */}
        <div className="lg:col-span-2 space-y-12">
           <motion.section
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
           >
              <h2 className="text-4xl font-bold mb-8">Hello, I'm <span className="text-brand-cyan">Mr Nexora</span></h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                {profile.bio}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                   <div className="flex items-center gap-4 mb-4">
                     <div className="p-3 rounded-xl bg-brand-purple/10">
                       <Mail className="text-brand-purple w-6 h-6" />
                     </div>
                     <div>
                       <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</div>
                       <div className="text-white font-bold">{profile.email}</div>
                     </div>
                   </div>
                </div>
                <div className="glass-card p-6">
                   <div className="flex items-center gap-4 mb-4">
                     <div className="p-3 rounded-xl bg-brand-cyan/10">
                       <Calendar className="text-brand-cyan w-6 h-6" />
                     </div>
                     <div>
                       <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Born On</div>
                       <div className="text-white font-bold">{profile.dob}</div>
                     </div>
                   </div>
                </div>
              </div>
           </motion.section>

           <section className="space-y-8">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <Shield className="text-brand-cyan w-6 h-6" /> Professional Expertise
              </h3>
              
              <div className="flex flex-wrap gap-4">
                 {profile.skills.map((skill, i) => (
                   <div 
                    key={i} 
                    className="glass px-6 py-3 rounded-2xl border-white/5 hover:border-brand-purple/50 transition-all font-bold text-sm"
                   >
                     {skill}
                   </div>
                 ))}
              </div>
           </section>

           <section>
              <div className="glass rounded-[40px] p-12 bg-gradient-to-br from-brand-purple/10 to-transparent border-t border-brand-purple/20">
                 <h3 className="text-3xl font-bold mb-6">Our Philosophy</h3>
                 <p className="text-slate-400 leading-relaxed max-w-2xl mb-8">
                    We believe in open innovation and high-quality crafting. Every product emerging from Nexora Lab undergoes strict quality control and stress testing to ensure the best possible experience for our community.
                 </p>
                 <div className="flex gap-8">
                   <div className="flex -space-x-4">
                     {[1,2,3,4].map(i => (
                       <div key={i} className="w-12 h-12 rounded-full border-4 border-brand-dark bg-slate-800 overflow-hidden">
                         <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" />
                       </div>
                     ))}
                   </div>
                   <div className="text-sm">
                      <div className="text-white font-bold">Trusted by 2,500+ developers</div>
                      <div className="text-slate-500">Global community and contributors</div>
                   </div>
                 </div>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
}
