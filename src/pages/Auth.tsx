import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, CheckCircle2, AlertCircle, Rocket, ArrowRight, Loader2 } from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider, signInWithPopup } from '../lib/firebase';
import { cn } from '../lib/utils';

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) {
       setError("Firebase is not initialized. Please check console.");
       return;
    }
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/');
      } else if (mode === 'register') {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCred.user, { displayName: fullName });
        
        await setDoc(doc(db, 'users', userCred.user.uid), {
          uid: userCred.user.uid,
          email: userCred.user.email,
          displayName: fullName,
          role: userCred.user.email === 'mahamudurrahman778@gmail.com' ? 'admin' : 'user',
          createdAt: new Date().toISOString()
        });
        
        navigate('/');
      } else if (mode === 'reset') {
        await sendPasswordResetEmail(auth, email);
        setSuccess("Password reset email sent! Check your inbox.");
      }
    } catch (err: any) {
      const message = err.code === 'auth/popup-closed-by-user' 
        ? "Authorization popup was closed. Please try again." 
        : err.message || "An authentication error occurred.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth || !db) {
      setError("Firebase is not initialized. Please set up Firebase in the AI Studio settings.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: user.email === 'mahamudurrahman778@gmail.com' ? 'admin' : 'user',
          createdAt: new Date().toISOString()
        });
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || "Google Sign-In failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-purple/5 blur-[120px] -z-10 rounded-full animate-pulse" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-cyan/5 blur-[100px] -z-10" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            whileHover={{ rotate: 360 }}
            transition={{ duration: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-[28px] bg-gradient-to-br from-brand-purple to-brand-cyan mb-6 neon-glow shadow-brand-purple/50 cursor-pointer"
          >
            <Rocket className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-4xl font-black mb-3 tracking-tight">
            {mode === 'login' && 'Identity Verify'}
            {mode === 'register' && 'Access Protocol'}
            {mode === 'reset' && 'Repair Core'}
          </h2>
          <p className="text-slate-400 font-medium">
            {mode === 'login' && 'Sync with the Nexora Mainframe'}
            {mode === 'register' && 'Register your digital signature'}
            {mode === 'reset' && 'Reset your encrypted credentials'}
          </p>
        </div>

        <div className="glass-card p-1 md:p-10 relative border-white/5 bg-white/5 backdrop-blur-2xl">
          <form onSubmit={handleAuth} className="p-8 space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-medium"
                >
                  <AlertCircle className="shrink-0 w-5 h-5" />
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-3 text-green-500 text-sm font-medium"
                >
                  <CheckCircle2 className="shrink-0 w-5 h-5" />
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            {mode === 'register' && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase ml-1">Full Identity Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-brand-purple transition-colors" />
                  <input
                    required
                    type="text"
                    placeholder="Commander Example"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-brand-dark/40 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/20 transition-all outline-none"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase ml-1">Neuro-Email Port</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-brand-purple transition-colors" />
                <input
                  required
                  type="email"
                  placeholder="name@nexus.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-brand-dark/40 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/20 transition-all outline-none"
                />
              </div>
            </div>

            {mode !== 'reset' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                   <label className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">Security Key</label>
                   {mode === 'login' && (
                     <button 
                      type="button"
                      onClick={() => { setMode('reset'); setSuccess(null); setError(null); }}
                      className="text-[10px] font-bold text-brand-purple hover:text-brand-cyan transition-colors uppercase tracking-widest"
                     >
                       Bypass Key?
                     </button>
                   )}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-brand-purple transition-colors" />
                  <input
                    required
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-brand-dark/40 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/20 transition-all outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-brand-purple to-[#8b5cf6] text-white py-4 rounded-2xl font-bold neon-glow transition-all active:scale-95 flex items-center justify-center gap-3 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 flex items-center gap-2">
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                  <>
                    {mode === 'login' && 'Verify Credentials'}
                    {mode === 'register' && 'Initiate Access'}
                    {mode === 'reset' && 'Deploy Fix'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>

            {mode !== 'reset' && (
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.3em]"><span className="bg-brand-dark/0 px-4 text-slate-600 backdrop-blur-md">Or Connection via</span></div>
              </div>
            )}

            {mode !== 'reset' && (
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full glass hover:bg-white/10 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all border border-white/10 hover:border-white/20 shadow-xl"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                Auth with Cloud Sync
              </button>
            )}

            <div className="text-center pt-4">
              <p className="text-slate-500 text-sm font-medium">
                {mode === 'login' && (
                  <>No digital ID? <button type="button" onClick={() => setMode('register')} className="text-brand-cyan font-bold hover:text-brand-purple transition-colors">Apply for Access</button></>
                )}
                {(mode === 'register' || mode === 'reset') && (
                  <>Existing Member? <button type="button" onClick={() => setMode('login')} className="text-brand-cyan font-bold hover:text-brand-purple transition-colors">Recall Identity</button></>
                )}
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
