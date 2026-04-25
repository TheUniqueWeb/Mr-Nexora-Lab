import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Rocket, ChevronDown, User, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';
import { cn } from '../lib/utils';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: 'Tools', path: '/tools' },
    { name: 'Scripts', path: '/scripts' },
    { name: 'App Store', path: '/apps' },
    { name: 'Support', path: '/support' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-purple via-brand-pink to-brand-cyan flex items-center justify-center neon-glow">
            <Rocket className="text-white w-6 h-6 group-hover:rotate-12 transition-transform" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-brand-pink to-brand-indigo bg-[length:200%_auto] animate-gradient">
            Mr Nexora Lab
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-brand-cyan",
                isActive(link.path) ? "text-brand-cyan" : "text-slate-300"
              )}
            >
              {link.name}
            </Link>
          ))}
          
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 glass px-3 py-1.5 rounded-xl hover:bg-white/10 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-brand-purple/20 flex items-center justify-center border border-brand-purple/50">
                  <User className="w-4 h-4 text-brand-purple" />
                </div>
                <ChevronDown className={cn("w-4 h-4 transition-transform", showDropdown && "rotate-180")} />
              </button>
              
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 glass rounded-xl overflow-hidden shadow-2xl border border-white/10"
                  >
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2 px-4 py-3 hover:bg-white/5 text-sm"
                      >
                        <LayoutDashboard className="w-4 h-4 text-brand-cyan" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => auth?.signOut()}
                      className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-500/10 text-red-400 text-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/auth"
              className="bg-brand-purple hover:bg-brand-purple/80 text-white px-5 py-2 rounded-xl text-sm font-semibold neon-glow transition-all"
            >
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-2 glass rounded-2xl overflow-hidden px-4 py-6"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-slate-300 hover:text-brand-cyan"
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-white/10" />
              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="text-brand-cyan font-medium"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => auth?.signOut()}
                    className="text-red-400 text-left font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                  className="bg-brand-purple text-white px-5 py-3 rounded-xl text-center font-bold"
                >
                  Login / Sign Up
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
