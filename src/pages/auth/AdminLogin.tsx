import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, User as UserIcon, Lock, ShieldCheck, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import AuthLayout from './components/AuthLayout';

export default function AdminLogin({ setUser }: { setUser: any }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        const data = await res.json();
        const role = data.user.role;
        const isAdmin = ['super admin', 'admin lppm', 'admin fakultas', 'reviewer'].includes(role);

        if (isAdmin) {
          setUser(data.user);
          navigate('/dashboard');
        } else {
          // Silent logout because user is not an admin
          await fetch('/api/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: data.user.id }),
          });
          setError('Akses Ditolak: Kredensial Anda terdaftar sebagai Dosen/Staf biasa, bukan Administrator.');
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.error || 'Username atau password admin salah');
      }
    } catch (err) {
      setError('Terjadi kesalahan sistem saat menghubungi server.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectShortcut = (email: string) => {
    setUsername(email);
    setPassword('password');
    setError('');
  };

  return (
    <AuthLayout 
      brandSubtitle="Admin Control Panel"
      title="Secure Login" 
      subtitle="PentaDosen Management System"
    >
      <form className="space-y-6" onSubmit={handleLogin}>
        <div className="space-y-2">
          <label htmlFor="username" className="text-[11px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-[0.2em] ml-1">
            Admin Username / Email
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors border-r border-gray-100 dark:border-gray-800 pr-3">
              <UserIcon className="h-4 w-4 text-slate-500 group-focus-within:text-primary-500" />
            </div>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-14 pr-4 py-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 transition-all outline-none text-sm placeholder:text-slate-400 dark:placeholder:text-slate-550 dark:text-white"
              placeholder="username"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-[11px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-[0.2em] ml-1">
            LDAP Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors border-r border-gray-100 dark:border-gray-800 pr-3">
              <Lock className="h-4 w-4 text-slate-500 group-focus-within:text-primary-500" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-14 pr-12 py-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 transition-all outline-none text-sm placeholder:text-slate-400 dark:placeholder:text-slate-550 dark:text-white"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 px-4 py-3 rounded-2xl text-xs font-bold border border-amber-100 dark:border-amber-900/40 flex items-start gap-2.5 leading-relaxed"
          >
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-primary-100 dark:shadow-primary-900/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <LogIn className="w-5 h-5" />
          )}
          Admin Login
        </button>
      </form>

      <div className="mt-8 pt-8 border-t border-gray-50 dark:border-gray-800">
        <div className="flex items-center justify-center gap-2 mb-4">
          <ShieldCheck className="w-4 h-4 text-slate-500 dark:text-slate-500" />
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Akun Dummy Admin Local DB</span>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {[
            { username: 'superadmin@univ.edu', role: 'Super Admin Access' },
            { username: 'penelitian@univ.edu', role: 'Admin Penelitian Access' },
            { username: 'fakultas@univ.edu', role: 'Admin Fakultas Access' }
          ].map((acc, i) => (
            <div 
              key={i} 
              onClick={() => handleSelectShortcut(acc.username)}
              className="bg-gray-50/50 dark:bg-gray-800/30 p-3 rounded-xl border border-gray-100 dark:border-gray-800 flex justify-between items-center group/acc cursor-pointer hover:border-primary-200 dark:hover:border-primary-800 transition-all"
            >
               <div className="text-left font-mono">
                  <p className="text-[10px] text-slate-650 dark:text-slate-400 font-bold group-hover/acc:text-primary-600 dark:group-hover/acc:text-primary-400 transition-colors">{acc.role}</p>
                  <p className="text-[11px] text-slate-850 dark:text-slate-350 font-black">{acc.username}</p>
               </div>
               <div className="text-[10px] bg-white dark:bg-gray-800 px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 font-black text-slate-700 dark:text-slate-350 group-hover/acc:bg-primary-600 group-hover/acc:text-white dark:group-hover/acc:bg-primary-600 group-hover/acc:border-primary-600 transition-all">SELECT</div>
            </div>
          ))}
        </div>
      </div>
    </AuthLayout>
  );
}
