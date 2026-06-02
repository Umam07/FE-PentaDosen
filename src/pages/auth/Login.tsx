import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, User as UserIcon, Lock, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import AuthLayout from './components/AuthLayout';

export default function Login({ setUser }: { setUser: any }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSelectShortcut = (email: string) => {
    setUsername(email);
    setPassword('password');
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
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
          // Force logout for admin logging in via lecturer portal
          await fetch('/api/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: data.user.id }),
          });
          setError('Akses Ditolak: Akun Administrator tidak diizinkan masuk melalui halaman ini. Silakan gunakan Portal khusus Admin (/admin).');
        } else {
          setUser(data.user);
          navigate('/dashboard');
        }
      } else {
        setError('Username atau password salah');
      }
    } catch (err) {
      setError('An error occurred during login');
    }
  };

  return (
    <AuthLayout 
      title="" 
      subtitle=""
    >
      <form className="space-y-6" onSubmit={handleLogin}>
        <div className="space-y-2">
          <label htmlFor="username" className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">
            LDAP Username
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors border-r border-gray-100 dark:border-gray-800 pr-3">
              <UserIcon className="h-4 w-4 text-gray-400 group-focus-within:text-primary-500" />
            </div>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-14 pr-4 py-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 transition-all outline-none text-sm placeholder:text-gray-300 dark:placeholder:text-gray-600 dark:text-white"
              placeholder="Masukkan username atau NIK"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">
            LDAP Password
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

        <div className="mt-4 flex flex-col items-center gap-2">
          <a 
            href="https://www.yarsi.ac.id/ganti-password-akun-yarsi" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[10px] font-black text-gray-400 hover:text-primary-600 dark:text-gray-500 dark:hover:text-primary-400 uppercase tracking-widest transition-colors underline decoration-dashed"
          >
            Lupa Password atau Username?
          </a>
        </div>
      </form>

      <div className="mt-10 text-center space-y-4 flex flex-col items-center">
        <div className="bg-primary-50/50 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-900/30 p-4 rounded-2xl max-w-xs w-full transition-all">
          <p className="text-primary-700 dark:text-primary-400 text-[9px] font-black uppercase tracking-[0.15em] leading-relaxed">
            Silakan masuk menggunakan kredensial LDAP Universitas Anda.
          </p>
        </div>
        <div className="pt-2 w-full max-w-xs">
          <Link 
            to="/admin" 
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/40 dark:hover:bg-gray-800/80 border border-gray-100 dark:border-gray-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all shadow-sm cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span>Portal Login Administrator</span>
          </Link>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-gray-50 dark:border-gray-800">
        <div className="flex items-center justify-center gap-2 mb-4">
          <ShieldCheck className="w-4 h-4 text-gray-300 dark:text-gray-600" />
          <span className="text-[10px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest">Akun Dummy Serverless Local DB</span>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {[
            { username: 'dosen1@univ.edu', role: 'Dosen Access' }
          ].map((acc, i) => (
            <div 
              key={i} 
              onClick={() => handleSelectShortcut(acc.username)}
              className="bg-gray-50/50 dark:bg-gray-800/30 p-3 rounded-xl border border-gray-100 dark:border-gray-800 flex justify-between items-center group/acc cursor-pointer hover:border-primary-200 dark:hover:border-primary-800 transition-all"
            >
               <div className="text-left font-mono">
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold group-hover/acc:text-primary-600 dark:group-hover/acc:text-primary-400 transition-colors">{acc.role}</p>
                  <p className="text-[11px] text-gray-700 dark:text-gray-300 font-black">{acc.username}</p>
               </div>
               <div className="text-[10px] bg-white dark:bg-gray-800 px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 font-black dark:text-gray-300 group-hover/acc:bg-primary-600 group-hover/acc:text-white dark:group-hover/acc:bg-primary-600 group-hover/acc:border-primary-600 transition-all">SELECT</div>
            </div>
          ))}
        </div>
      </div>
    </AuthLayout>
  );
}
