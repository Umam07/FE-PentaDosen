import React from 'react';
import { LogIn, User as UserIcon, Lock, Eye, EyeOff, Hexagon, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useDosenLogin } from '../hooks/useDosenLogin';
import { User } from '../types/auth.types';

interface DosenLoginFormProps {
  setUser: (user: User) => void;
}

export function DosenLoginForm({ setUser }: DosenLoginFormProps) {
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
    { email: 'dosen1@univ.edu', password: 'password', shortName: 'Chandra (Dosen FTI)', role: 'Dosen' },
    { email: 'nurul.huda@univ.edu', password: 'password', shortName: 'Nurul Huda (Dosen FEB)', role: 'Dosen' },
    { email: 'penelitian@univ.edu', password: 'password', shortName: 'Admin Penelitian', role: 'Admin' },
    { email: 'fakultas@univ.edu', password: 'password', shortName: 'Admin FTI', role: 'Admin' },
  ];

  return (
    <div className="absolute top-0 bottom-0 w-full lg:w-[56%] left-0 lg:left-[44%] flex flex-col justify-center items-center px-5 py-10 sm:px-10 lg:px-16 z-10">
      <div className="w-full max-w-[400px] mt-10 lg:mt-0">
        {/* Mobile-only brand */}
        <div className="flex items-center gap-3 mb-8 lg:hidden">
          <div className="p-2.5 bg-ink text-on-ink rounded-lg">
            <Hexagon className="w-5 h-5 fill-white/20" />
          </div>
          <span className="text-ink-heading dark:text-on-dark font-extrabold text-lg tracking-tight uppercase">
            Penta<span className="text-accent dark:text-accent-on-dark">Dosen</span>
          </span>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h2 className="text-2xl font-black text-ink-heading dark:text-on-dark tracking-tight mb-2">
            Masuk ke Akun Anda
          </h2>
          <p className="text-muted dark:text-on-dark-muted text-sm font-medium">
            Gunakan kredensial Anda untuk melanjutkan ke dashboard.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleDosenLogin}>

          {/* Username field */}
          <div className="space-y-2">
            <label htmlFor="username" className="block text-[11px] font-bold text-muted dark:text-on-dark-muted uppercase tracking-wider">
              Username
            </label>
            <div className="relative group flex items-center border border-hairline-light dark:border-hairline-dark rounded-lg bg-surface-light-raised dark:bg-surface-dark-elevated focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 focus-within:bg-surface-light dark:focus-within:bg-surface-dark transition-all duration-200">
              <div className="absolute left-3.5 text-muted group-focus-within:text-accent dark:group-focus-within:text-accent-on-dark transition-colors pointer-events-none">
                <UserIcon className="h-4.5 w-4.5" />
              </div>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-transparent text-sm text-ink-heading dark:text-on-dark placeholder:text-muted dark:placeholder:text-on-dark-muted outline-none border-none font-medium"
                placeholder="username"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-[11px] font-bold text-muted dark:text-on-dark-muted uppercase tracking-wider">
              Password
            </label>
            <div className="relative group flex items-center border border-hairline-light dark:border-hairline-dark rounded-lg bg-surface-light-raised dark:bg-surface-dark-elevated focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 focus-within:bg-surface-light dark:focus-within:bg-surface-dark transition-all duration-200">
              <div className="absolute left-3.5 text-muted group-focus-within:text-accent dark:group-focus-within:text-accent-on-dark transition-colors pointer-events-none">
                <Lock className="h-4.5 w-4.5" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3 bg-transparent text-sm text-ink-heading dark:text-on-dark placeholder:text-muted dark:placeholder:text-on-dark-muted outline-none border-none font-medium"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                className="absolute right-3.5 text-muted hover:text-ink-heading dark:hover:text-on-dark transition-colors"
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
              className="text-xs font-semibold text-accent hover:text-accent-hover dark:text-accent-on-dark transition-colors"
            >
              Lupa password?
            </a>
          </div>

          {/* Error message */}
          {dosenError && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 bg-error-soft dark:bg-surface-dark-elevated border border-error-border dark:border-hairline-dark text-error dark:text-error-on-dark p-4 rounded-lg text-xs font-medium leading-relaxed"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{dosenError}</span>
            </motion.div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-ink hover:bg-ink-hover active:bg-ink-active text-on-ink rounded-lg font-bold text-sm tracking-wide transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none cursor-pointer shadow-sm"
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
        <div className="mt-4 pt-4 border-t border-dashed border-hairline-light dark:border-hairline-dark">
          <button
            type="button"
            onClick={() => setShowDemo(!showDemo)}
            className="w-full flex items-center justify-between text-xs font-semibold text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
              Gunakan Akun Demo
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
                    setPassword(acc.password);
                  }}
                  className="text-left p-2 border border-hairline-light dark:border-hairline-dark rounded-lg hover:border-ink-border dark:hover:border-hairline-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-all cursor-pointer group"
                >
                  <p className="text-xs font-bold text-body-strong dark:text-on-dark group-hover:text-accent dark:group-hover:text-accent-on-dark transition-colors truncate">
                    {acc.shortName}
                  </p>
                  <p className="text-[10px] text-muted dark:text-on-dark-muted truncate">
                    {acc.email}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

