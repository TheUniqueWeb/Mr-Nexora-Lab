import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Github, Instagram, Rocket, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 pt-20 pb-10 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-purple/10 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-8 h-8 rounded-lg bg-brand-purple flex items-center justify-center">
                <Rocket className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold">Mr Nexora Lab</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              The ultimate hub for high-quality tools, scripts, and apps. Empowering developers and creators with cutting-edge resources.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Github, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-xl glass flex items-center justify-center text-slate-400 hover:text-brand-purple hover:border-brand-purple/50 transition-all"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Explore</h4>
            <ul className="space-y-4">
              {['Tools', 'Scripts', 'App Store', 'Premium'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase().replace(' ', '')}`} className="text-slate-400 hover:text-brand-cyan text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-4">
              {['Contact Us', 'Help Center', 'API Docs', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-400 hover:text-brand-cyan text-sm transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Mail className="w-4 h-4 text-brand-purple" />
                support@mrnexoralab.app
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <MapPin className="w-4 h-4 text-brand-purple" />
                Asia / Dhaka, BD
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
          <p>© {currentYear} Mr Nexora Lab. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
