import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LogIn, User as UserIcon, Lock, ShieldCheck, ShieldAlert, Eye, EyeOff, ArrowLeft, Hexagon, AlertCircle, BookOpen, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Login({ setUser }: { setUser: any }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine mode based on pathname
  const [isAdmin, setIsAdmin] = useState(() => {
    return window.location.pathname === '/admin';
  });

  // Keep state in sync with URL location
  useEffect(() => {
    setIsAdmin(window.location.pathname === '/admin');
  }, [location.pathname]);

  const handleToggleMode = (toAdmin: boolean) => {
    setIsAdmin(toAdmin);
    window.history.pushState(null, '', toAdmin ? '/admin' : '/login');
  };

  // State Dosen
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [dosenError, setDosenError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // State Admin
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);

  // Stats
  const [totalDocs, setTotalDocs] = useState<number | string>('...');
  const [totalDosen, setTotalDosen] = useState<number | string>('...');

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Failed to fetch stats');
      })
      .then((data) => {
        const docCount = (data.total_docs || 0) + (data.total_research || 0);
        setTotalDocs(docCount);
        if (data.total_dosen !== undefined) setTotalDosen(data.total_dosen);
      })
      .catch((err) => {
        console.error('Error fetching stats:', err);
        setTotalDocs(1248);
        setTotalDosen(150);
      });
  }, []);

  const handleSelectDosenShortcut = (email: string) => {
    setUsername(email);
    setPassword('password');
    setDosenError('');
  };

  const handleSelectAdminShortcut = (email: string) => {
    setAdminUsername(email);
    setAdminPassword('password');
    setAdminError('');
  };

  const handleDosenLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setDosenError('');
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
        const isAdminUser = ['super admin', 'admin lppm', 'admin fakultas', 'reviewer'].includes(role);

        if (isAdminUser) {
          await fetch('/api/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: data.user.id }),
          });
          setDosenError('Akses Ditolak: Akun Administrator tidak diizinkan masuk melalui halaman ini. Silakan gunakan Portal khusus Admin (/admin).');
        } else {
          setUser(data.user);
          navigate('/dashboard');
        }
      } else {
        setDosenError('Username atau password salah');
      }
    } catch (err) {
      setDosenError('Terjadi kesalahan saat menghubungi server.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setAdminLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: adminUsername, password: adminPassword }),
      });
      if (res.ok) {
        const data = await res.json();
        const role = data.user.role;
        const isAdminUser = ['super admin', 'admin lppm', 'admin fakultas', 'reviewer'].includes(role);

        if (isAdminUser) {
          setUser(data.user);
          navigate('/dashboard');
        } else {
          // Silent logout because user is not an admin
          await fetch('/api/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: data.user.id }),
          });
          setAdminError('Akses Ditolak: Kredensial Anda terdaftar sebagai Dosen/Staf biasa, bukan Administrator.');
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        setAdminError(errData.error || 'Username atau password admin salah');
      }
    } catch (err) {
      setAdminError('Terjadi kesalahan sistem saat menghubungi server.');
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 flex font-sans transition-colors duration-300 relative overflow-hidden">
      
      {/* Back button (Fixed position, always top-left) */}
      <Link
        to="/"
        aria-label="Kembali ke halaman utama"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white uppercase tracking-wider transition-colors group z-30"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Kembali
      </Link>

      {/* ── Left Panel: Branding ── */}
      <div className={`hidden lg:flex flex-col justify-between w-[44%] bg-slate-50 dark:bg-slate-900/20 px-14 py-12 absolute top-0 bottom-0 transition-all duration-700 ease-in-out z-20 ${
        isAdmin 
          ? 'left-[56%] border-l border-slate-200/80 dark:border-slate-800/80' 
          : 'left-0 border-r border-slate-200/80 dark:border-slate-800/80'
      }`}>
        
        {/* Top: Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary-600 rounded-xl text-white">
              <Hexagon className="w-6 h-6 fill-white/20" />
            </div>
            <span className="text-slate-900 dark:text-white font-extrabold text-xl tracking-tight uppercase">
              Penta<span className="text-primary-600 dark:text-primary-400">Dosen</span>
            </span>
          </div>
        </div>

        {/* Center: Hero copy */}
        <div className="relative z-10 space-y-8 my-auto">
          <AnimatePresence mode="wait">
            {!isAdmin ? (
              <motion.div
                key="dosen-branding"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <p className="text-[11px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-[0.2em]">
                    Portal Akademik Dosen
                  </p>
                  <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-[1.2] tracking-tight">
                    Satu Platform Untuk<br />Penelitian & KPI<br />Akademik Anda.
                  </h1>
                </div>
                
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium max-w-sm">
                  PentaDosen mengintegrasikan rekam jejak akademik, kinerja penelitian, dan monitoring KPI dalam satu interface yang modern.
                </p>

                {/* Feature list */}
                <ul className="space-y-4">
                  {[
                    'Sinkronisasi Google Scholar & Scopus otomatis',
                    'Visualisasi pencapaian KPI secara real-time',
                    'Penyusunan berkas evaluasi kinerja akademik',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-slate-600 dark:text-slate-300 text-sm font-medium">
                      <div className="p-0.5 bg-primary-50 dark:bg-primary-950/50 rounded-md text-primary-600 dark:text-primary-400 shrink-0 mt-0.5">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ) : (
              <motion.div
                key="admin-branding"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <p className="text-[11px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-[0.2em]">
                    Portal Administrator
                  </p>
                  <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-[1.2] tracking-tight">
                    Manajemen Riset &<br />KPI Akademik Kampus<br />Lebih Terarah.
                  </h1>
                </div>
                
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium max-w-sm">
                  PentaDosen Control Panel memudahkan pengelolaan data dosen, verifikasi berkas bukti kinerja, dan pemantauan kriteria KPI secara komprehensif.
                </p>

                {/* Feature list */}
                <ul className="space-y-4">
                  {[
                    'Verifikasi berkas bukti fisik KPI secara real-time',
                    'Manajemen target, bobot, dan kriteria penilaian',
                    'Log aktivitas sistem dan audit trails lengkap',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-slate-600 dark:text-slate-300 text-sm font-medium">
                      <div className="p-0.5 bg-primary-50 dark:bg-primary-950/50 rounded-md text-primary-600 dark:text-primary-400 shrink-0 mt-0.5">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Minimal Statistics Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 rounded-2xl p-5 shadow-sm max-w-sm"
          >
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
              Statistik Kinerja Kampus
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 mb-1">
                  <BookOpen className="w-3.5 h-3.5 text-primary-500" />
                  <span className="text-[11px] font-semibold">Total Dokumen</span>
                </div>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {typeof totalDocs === 'number' ? `${totalDocs.toLocaleString('id-ID')}` : totalDocs}
                </p>
              </div>
              <div className="border-l border-slate-100 dark:border-slate-800 pl-4">
                <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 mb-1">
                  <Users className="w-3.5 h-3.5 text-primary-500" />
                  <span className="text-[11px] font-semibold">Dosen Aktif</span>
                </div>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {typeof totalDosen === 'number' ? `${totalDosen.toLocaleString('id-ID')}` : totalDosen}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom: Footer note */}
        <div className="relative z-10">
          <p className="text-slate-400 dark:text-slate-600 text-[10px] font-semibold uppercase tracking-wider">
            © 2026 PentaDosen · KPI & Research System
          </p>
        </div>
      </div>

      {/* ── Right Panel: Dosen Form ── */}
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

          {/* Divider */}
          <div className="relative flex py-3 items-center my-4">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">atau</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          {/* Admin portal link */}
          <button
            type="button"
            onClick={() => handleToggleMode(true)}
            className="flex items-center justify-center gap-2.5 w-full py-3 px-4 border border-slate-200 dark:border-slate-800 rounded-xl text-[11px] font-bold uppercase tracking-widest text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 cursor-pointer w-full text-center"
          >
            <ShieldCheck className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            Portal Login Administrator
          </button>

          {/* Dev shortcut section */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Akun Dummy · Local DB
              </span>
            </div>
            <div className="space-y-2.5">
              {[
                { username: 'dosen1@univ.edu', role: 'Dosen Access' },
              ].map((acc, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectDosenShortcut(acc.username)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 hover:border-primary-500 dark:hover:border-primary-500 hover:bg-white dark:hover:bg-slate-950 transition-all duration-200 group cursor-pointer text-left"
                >
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors uppercase tracking-wider">
                      {acc.role}
                    </p>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                      {acc.username}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-all duration-200 translate-x-0 group-hover:translate-x-1">
                    Pilih →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel: Admin Form ── */}
      <div className={`absolute top-0 bottom-0 w-full lg:w-[56%] flex flex-col justify-center items-center px-5 py-10 sm:px-10 lg:px-16 transition-all duration-700 ease-in-out ${
        isAdmin 
          ? 'left-0 lg:left-0 opacity-100 z-10 pointer-events-auto' 
          : 'left-[100%] opacity-0 z-0 pointer-events-none'
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
              Secure Admin Login
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Gunakan kredensial Administrator Anda untuk melanjutkan.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleAdminLogin}>

            {/* Username field */}
            <div className="space-y-2">
              <label htmlFor="adminUsername" className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Admin Username / Email
              </label>
              <div className="relative group flex items-center border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 focus-within:border-primary-600 dark:focus-within:border-primary-500 focus-within:bg-white dark:focus-within:bg-slate-950 transition-all duration-200">
                <div className="absolute left-3.5 text-slate-400 group-focus-within:text-primary-600 dark:group-focus-within:text-primary-500 transition-colors pointer-events-none">
                  <UserIcon className="h-4.5 w-4.5" />
                </div>
                <input
                  id="adminUsername"
                  type="text"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none border-none font-medium"
                  placeholder="username"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label htmlFor="adminPassword" className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                LDAP Password
              </label>
              <div className="relative group flex items-center border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 focus-within:border-primary-600 dark:focus-within:border-primary-500 focus-within:bg-white dark:focus-within:bg-slate-950 transition-all duration-200">
                <div className="absolute left-3.5 text-slate-400 group-focus-within:text-primary-600 dark:group-focus-within:text-primary-500 transition-colors pointer-events-none">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  id="adminPassword"
                  type={showAdminPassword ? 'text' : 'password'}
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none border-none font-medium"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  aria-label={showAdminPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showAdminPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {adminError && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-xs font-medium leading-relaxed"
              >
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{adminError}</span>
              </motion.div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={adminLoading}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-primary-600 dark:hover:bg-primary-500 active:scale-[0.99] text-white rounded-xl font-bold text-sm tracking-wide transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
            >
              {adminLoading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {adminLoading ? 'Memproses...' : 'Admin Login'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-3 items-center my-4">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">atau</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          {/* Lecturer portal link */}
          <button
            type="button"
            onClick={() => handleToggleMode(false)}
            className="flex items-center justify-center gap-2.5 w-full py-3 px-4 border border-slate-200 dark:border-slate-800 rounded-xl text-[11px] font-bold uppercase tracking-widest text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 cursor-pointer w-full text-center"
          >
            <UserIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            Portal Login Dosen
          </button>

          {/* Dev shortcut section */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Akun Dummy Admin · Local DB
              </span>
            </div>
            <div className="space-y-2.5">
              {[
                { username: 'superadmin@univ.edu', role: 'Super Admin Access' },
                { username: 'penelitian@univ.edu', role: 'Admin Penelitian Access' },
                { username: 'fakultas@univ.edu', role: 'Admin Fakultas Access' }
              ].map((acc, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectAdminShortcut(acc.username)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 hover:border-primary-500 dark:hover:border-primary-500 hover:bg-white dark:hover:bg-slate-950 transition-all duration-200 group cursor-pointer text-left"
                >
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors uppercase tracking-wider">
                      {acc.role}
                    </p>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                      {acc.username}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-all duration-200 translate-x-0 group-hover:translate-x-1">
                    Pilih →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}