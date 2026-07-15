import React from 'react';
import { LogIn, User as UserIcon, Lock, ShieldCheck, Eye, EyeOff, Hexagon, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useDosenLogin } from '../hooks/useDosenLogin';
import { User } from '../types/auth.types';

interface DosenLoginFormProps {
  isAdmin: boolean;
  setUser: (user: User) => void;
  onToggleMode: (toAdmin: boolean) => void;
}

export function DosenLoginForm({ isAdmin, setUser, onToggleMode }: DosenLoginFormProps) {
  const {
    username,
    setUsername,
    password,
    setPassword,
    dosenError,
    showPassword,
    setShowPassword,
    loading,
    handleDosenLogin,
  } = useDosenLogin(setUser);

  const [showDemo, setShowDemo] = React.useState(false);

  const demoAccounts = [
    { email: 'dosen1@univ.edu', name: 'Chandra Prasetyo Utomo', shortName: 'Chandra' },
    { email: 'dosen2@univ.edu', name: 'Kholis Ernawati', shortName: 'Kholis (FK)' },
    { email: 'kiki@univ.edu', name: 'Kiki Aimar Wicaksana', shortName: 'Kiki (FEB)' },
    { email: 'danis@univ.edu', name: 'Rafi Danis', shortName: 'Danis (FH)' },
    { email: 'umam@univ.edu', name: 'Umamz', shortName: 'Umamz (FPsi)' },
    { email: 'dosen_fkg@univ.edu', name: 'Anton Rahardjo', shortName: 'Anton (FKG)' },
  ];

  return (
    <div className={`absolute top-0 bottom-0 w-full lg:w-[56%] flex flex-col justify-center items-center px-5 py-10 sm:px-10 lg:px-16 transition-all duration-700 ease-in-out ${
      isAdmin 
        ? 'left-[-100%] lg:left-[-56%] opacity-0 z-0 pointer-events-none' 
        : 'left-0 lg:left-[44%] opacity-100 z-10 pointer-events-auto'
    }`}>
      <div className="w-full max-w-[400px] mt-10 lg:mt-0">
        {/* Mobile-only brand */}
        <div className="flex items-center gap-3 mb-8 lg:hidden">
          <div className="p-2.5 bg-primary-600 rounded-xl text-white">
            <Hexagon className="w-5 h-5 fill-white/20" />
          </div>
          <span className="text-slate-900 dark:text-white font-extrabold text-lg tracking-tight uppercase">
            Penta<span className="text-primary-600 dark:text-primary-400">Dosen</span>
          </span>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            Masuk ke Akun Anda
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Gunakan kredensial LDAP Anda untuk melanjutkan ke dashboard.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleDosenLogin}>

          {/* Username field */}
          <div className="space-y-2">
            <label htmlFor="username" className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              LDAP Username
            </label>
            <div className="relative group flex items-center border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 focus-within:border-primary-600 dark:focus-within:border-primary-500 focus-within:bg-white dark:focus-within:bg-slate-950 transition-all duration-200">
              <div className="absolute left-3.5 text-slate-400 group-focus-within:text-primary-600 dark:group-focus-within:text-primary-500 transition-colors pointer-events-none">
                <UserIcon className="h-4.5 w-4.5" />
              </div>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none border-none font-medium"
                placeholder="username@univ.edu"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              LDAP Password
            </label>
            <div className="relative group flex items-center border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 focus-within:border-primary-600 dark:focus-within:border-primary-500 focus-within:bg-white dark:focus-within:bg-slate-950 transition-all duration-200">
              <div className="absolute left-3.5 text-slate-400 group-focus-within:text-primary-600 dark:group-focus-within:text-primary-500 transition-colors pointer-events-none">
                <Lock className="h-4.5 w-4.5" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none border-none font-medium"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Forgot password link */}
          <div className="flex justify-end">
            <a
              href="https://www.yarsi.ac.id/ganti-password-akun-yarsi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
            >
              Lupa password atau username?
            </a>
          </div>

          {/* Error message */}
          {dosenError && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-xs font-medium leading-relaxed"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{dosenError}</span>
            </motion.div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-primary-600 dark:hover:bg-primary-500 active:scale-[0.99] text-white rounded-xl font-bold text-sm tracking-wide transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        {/* Demo Accounts Quick-Fill */}
        <div className="mt-4 pt-4 border-t border-dashed border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setShowDemo(!showDemo)}
            className="w-full flex items-center justify-between text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Gunakan Akun Demo Dosen
            </span>
            <span>{showDemo ? 'Sembunyikan' : 'Tampilkan'}</span>
          </button>
          
          {showDemo && (
            <div className="grid grid-cols-2 gap-2 mt-3 animate-fadeIn">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => {
                    setUsername(acc.email);
                    setPassword('password');
                  }}
                  className="text-left p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-primary-500 dark:hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-950/20 transition-all cursor-pointer group"
                >
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                    {acc.shortName}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                    {acc.email}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="relative flex py-3 items-center my-4">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">atau</span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        </div>

        {/* Admin portal link */}
        <button
          type="button"
          onClick={() => onToggleMode(true)}
          className="flex items-center justify-center gap-2.5 w-full py-3 px-4 border border-slate-200 dark:border-slate-800 rounded-xl text-[11px] font-bold uppercase tracking-widest text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 cursor-pointer w-full text-center"
        >
          <ShieldCheck className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          Portal Login Administrator
        </button>
      </div>
    </div>
  );
}
