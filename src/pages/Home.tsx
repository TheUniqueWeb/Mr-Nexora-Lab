import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Rocket, Code, Smartphone, Zap, Shield, Globe, ArrowRight, Star } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Home() {
  return (
    <div className="flex flex-col gap-24 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_50%)]" />
        
        <div className="relative z-10 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-brand-purple/30 text-brand-cyan text-sm font-medium mb-8">
                <Zap className="w-4 h-4 text-brand-purple animate-pulse" />
                Welcome to the Future of Innovation
              </span>
              <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tighter">
                Unleash Your <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-purple via-brand-pink to-brand-cyan bg-[length:200%_auto] animate-gradient">
                  Digital Excellence
                </span>
              </h1>
            <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              Mr Nexora Lab is your premier destination for high-end tools, professional code scripts, and revolutionary applications. Step into a world of curated digital resources.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                to="/tools"
                className="w-full sm:w-auto bg-brand-purple hover:bg-brand-purple/80 text-white px-8 py-4 rounded-2xl font-bold text-lg neon-glow transition-all flex items-center justify-center gap-2"
              >
                Explore Lab <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/about"
                className="w-full sm:w-auto glass hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 border border-white/10"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Animated Background Elements */}
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1],
            x: [0, 50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -z-10 top-1/4 -left-20 w-80 h-80 bg-brand-purple/30 blur-[100px] rounded-full"
        />
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1, 1.3, 1],
            x: [0, -40, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -z-10 bottom-1/4 -right-20 w-96 h-96 bg-brand-cyan/20 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{ 
            y: [0, -100, 0],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-pink/10 blur-[150px] rounded-full"
        />
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">The Lab Core</h2>
          <p className="text-slate-400">Discover our specialized departments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Power Tools",
              desc: "Professional web and desktop utilities for daily productivity.",
              icon: Rocket,
              color: "text-brand-purple",
              bg: "bg-brand-purple/10",
              link: "/tools"
            },
            {
              title: "Master Scripts",
              desc: "Handcrafted code templates and snippets in Top languages.",
              icon: Code,
              color: "text-brand-cyan",
              bg: "bg-brand-cyan/10",
              link: "/scripts"
            },
            {
              title: "Nexus App Store",
              desc: "Premium applications designed for seamless user experience.",
              icon: Smartphone,
              color: "text-brand-pink",
              bg: "bg-brand-pink/10",
              link: "/apps"
            }
          ].map((cat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="glass-card p-8 group relative overflow-hidden"
            >
              <div className={cn("inline-flex p-4 rounded-2xl mb-6", cat.bg)}>
                <cat.icon className={cn("w-8 h-8", cat.color)} />
              </div>
              <h3 className="text-2xl font-bold mb-4">{cat.title}</h3>
              <p className="text-slate-400 mb-8 leading-relaxed">{cat.desc}</p>
              <Link to={cat.link} className="flex items-center gap-2 text-brand-cyan font-semibold group-hover:gap-3 transition-all">
                Browse Collection <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="glass rounded-[32px] p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/10 blur-[80px] -z-10" />
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {[
              { label: "Active Users", value: "25k+", color: "from-brand-purple to-brand-indigo" },
              { label: "Code Scripts", value: "850+", color: "from-brand-cyan to-brand-indigo" },
              { label: "Curated Tools", value: "120+", color: "from-brand-pink to-brand-purple" },
              { label: "App Downloads", value: "100k+", color: "from-white to-slate-400" }
            ].map((stat, i) => (
              <div key={i} className="group">
                <div className={cn("text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-br transition-all duration-500 group-hover:scale-110", stat.color)}>
                  {stat.value}
                </div>
                <div className="text-slate-400 font-medium uppercase tracking-widest text-[10px]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
              Built for Security. <br />
              Optimized for Speed.
            </h2>
            <div className="space-y-6">
              {[
                { title: "Military-Grade Security", desc: "All our resources are scanned and verified for safety.", icon: Shield },
                { title: "Lightning Performance", desc: "Optimized code ensuring minimal latency and high speed.", icon: Zap },
                { title: "Global Infrastructure", desc: "Available anywhere, anytime across all devices.", icon: Globe }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-brand-purple" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">{item.title}</h4>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-square glass rounded-[40px] relative overflow-hidden neon-glow">
               {/* Mock UI/App Content */}
               <div className="absolute inset-8 rounded-3xl bg-slate-900 border border-white/10 p-6">
                  <div className="flex items-center justify-between mb-8">
                     <div className="w-32 h-4 bg-white/5 rounded-full" />
                     <div className="w-8 h-8 rounded-full bg-brand-purple" />
                  </div>
                  <div className="space-y-4">
                    <div className="h-24 w-full bg-white/5 rounded-2xl" />
                    <div className="grid grid-cols-2 gap-4">
                       <div className="h-32 bg-brand-purple/10 border border-brand-purple/20 rounded-2xl" />
                       <div className="h-32 bg-brand-cyan/10 border border-brand-cyan/20 rounded-2xl" />
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
