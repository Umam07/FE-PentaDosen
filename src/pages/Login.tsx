import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Hexagon, Mail, Lock, ShieldCheck, Zap, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login({ setUser }: { setUser: any }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        navigate('/dashboard');
      } else {
        setError('Email atau password salah');
      }
    } catch (err) {
      setError('An error occurred during login');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans transition-all selection:bg-primary-100 selection:text-primary-900 relative">
      {/* Back to Homepage Button */}
      <Link 
        to="/" 
        className="absolute top-4 left-4 md:top-8 md:left-8 inline-flex items-center gap-2 text-xs font-black text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 uppercase tracking-widest transition-all duration-200 group bg-white dark:bg-gray-900 px-4 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Kembali
      </Link>

      <div className="w-full max-w-[480px]">
        {/* Brand */}
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-4 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl shadow-2xl shadow-primary-200 dark:shadow-primary-900/30 mb-6"
          >
            <Hexagon className="w-10 h-10 text-white fill-white/20" />
          </motion.div>
          <motion.h1 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase"
          >
            Penta<span className="text-primary-600 dark:text-primary-400">Dosen</span> <span className="text-[10px] bg-primary-50 dark:bg-primary-500/10 text-primary-500 dark:text-primary-400 px-2 py-1 rounded-full align-top ml-1">V2</span>
          </motion.h1>
          <p className="text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-widest mt-2">KPI & Research Repository System</p>
        </div>

        {/* Login Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 p-8 lg:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-800 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 dark:bg-primary-900/10 rounded-full -mr-16 -mt-16 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
          
          <form className="space-y-6 relative z-10" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label htmlFor="email" className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">
                Institutional Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors border-r border-gray-100 dark:border-gray-800 pr-3">
                  <Mail className="h-4 w-4 text-gray-400 group-focus-within:text-primary-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 transition-all outline-none text-sm placeholder:text-gray-300 dark:placeholder:text-gray-600 dark:text-white"
                  placeholder="admin@univ.edu"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">
                Secure Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors border-r border-gray-100 dark:border-gray-800 pr-3">
                  <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-primary-500" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-12 py-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 transition-all outline-none text-sm placeholder:text-gray-300 dark:placeholder:text-gray-600 dark:text-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider border border-red-100 dark:border-red-900/40"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-primary-100 dark:shadow-primary-900/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Sign in
            </button>
          </form>

          <div className="mt-10 text-center relative z-10">
            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold">
              Belum punya akses?{' '}
              <Link to="/register" className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors uppercase tracking-widest ml-1 underline underline-offset-4 decoration-2">
                Daftar Sekarang
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-50 dark:border-gray-800 relative z-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <ShieldCheck className="w-4 h-4 text-gray-300 dark:text-gray-600" />
              <span className="text-[10px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest">Akun Dummy Serverless</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {[
                { email: 'dosen1@univ.edu', role: 'Dosen Access' },
                { email: 'admin@univ.edu', role: 'Admin Access' }
              ].map((acc, i) => (
                <div key={i} className="bg-gray-50/50 dark:bg-gray-800/30 p-3 rounded-xl border border-gray-100 dark:border-gray-800 flex justify-between items-center group/acc cursor-pointer hover:border-primary-200 dark:hover:border-primary-800 transition-all">
                   <div className="text-left font-mono">
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold group-hover/acc:text-primary-600 dark:group-hover/acc:text-primary-400 transition-colors">{acc.role}</p>
                      <p className="text-[11px] text-gray-700 dark:text-gray-300 font-black">{acc.email}</p>
                   </div>
                   <div className="text-[10px] bg-white dark:bg-gray-800 px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 font-black dark:text-gray-300 group-hover/acc:bg-primary-600 group-hover/acc:text-white dark:group-hover/acc:bg-primary-600 group-hover/acc:border-primary-600 transition-all">PASS</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
