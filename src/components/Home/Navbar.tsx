import { useState, useEffect, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowRight, Home, Trophy, Sparkles, Settings, LogIn, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../layout/ThemeToggle';
import PentaDosenLogo from '../ui/PentaDosenLogo';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');
  const location = useLocation();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const storedUser = sessionStorage.getItem('pentadosen_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beranda', href: '#hero', icon: Home },
    { name: 'Leaderboard', href: '#leaderboard', icon: Trophy },
    { name: 'Fitur', href: '#features', icon: Sparkles },
    { name: 'Sistem Kerja', href: '#workflow', icon: Settings },
  ];

  const handleScrollTo = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (location.pathname !== '/') {
      // If we're not on the home page, just navigate to home
      // The browser will handle the hash if we navigate to /#id
      // but since we want custom scroll, we'll just navigate
      return;
    }
    
    e.preventDefault();
    setIsMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.header
        layout
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.6, 
          ease: [0.22, 1, 0.36, 1] 
        }}
        className={`fixed left-0 right-0 z-50 transition-all duration-700 mx-auto ${
          isScrolled 
            ? 'top-4 w-[calc(100%-1.5rem)] sm:w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] max-w-7xl py-3 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 dark:border-gray-800/50 rounded-2xl' 
            : 'top-0 w-full max-w-full py-6 bg-transparent border-transparent rounded-none'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 min-w-0">
            {/* Logo Co-Branding YARSI + PentaDosen */}
            <Link to="/" className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 group shrink min-w-0">
              <img 
                src="/YARSI-KOTAK-e1739161183276.png" 
                alt="Universitas YARSI" 
                className="h-7 sm:h-9 w-auto object-contain shrink-0"
              />
              <div className="h-5 sm:h-7 w-[1px] bg-gray-300 dark:bg-gray-700/80 shrink-0" />
              <div className="flex items-center gap-1.5 sm:gap-2 shrink min-w-0">
                <PentaDosenLogo className="w-7 h-7 sm:w-10 sm:h-10 shrink-0" />
                <span className="text-sm xs:text-base sm:text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase truncate">
                  Penta<span className="text-primary-600 dark:text-primary-500">Dosen</span>
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={location.pathname === '/' ? link.href : `/${link.href}`}
                  onClick={(e: any) => handleScrollTo(e, link.href)}
                  className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
              <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
              {user ? (
                <Link 
                  to="/dashboard"
                  className="flex items-center gap-2 text-sm font-black text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 px-6 py-2.5 rounded-xl transition-all duration-300 group"
                >
                      Insights
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ) : (
                      <>
                        <Link 
                          to="/login"
                          className="text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-2 rounded-xl transition-all"
                        >
                          Masuk
                        </Link>
                        <Link 
                          to="/insights"
                          className="flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 px-5 py-2.5 rounded-xl transition-all duration-300 group"
                        >
                          Insights
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                  </>
               )}
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:hidden shrink-0">
              <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1.5 sm:p-2 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
                aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
              >
                {isMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Slide-out Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[85vw] bg-white/95 dark:bg-gray-950/95 backdrop-blur-2xl border-l border-gray-100 dark:border-gray-800 shadow-2xl flex flex-col md:hidden"
            >
              {/* Header inside drawer */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setIsMenuOpen(false)}>
                  <img 
                    src="/YARSI-KOTAK-e1739161183276.png" 
                    alt="Universitas YARSI" 
                    className="h-7 w-auto object-contain"
                  />
                  <div className="h-5 w-[1px] bg-gray-300 dark:bg-gray-700" />
                  <div className="flex items-center gap-2">
                    <PentaDosenLogo className="w-7 h-7" />
                    <span className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">
                      Penta<span className="text-primary-600 dark:text-primary-500">Dosen</span>
                    </span>
                  </div>
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  aria-label="Tutup menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User profile section if logged in */}
              {user && (
                <div className="p-6 bg-gray-50/50 dark:bg-gray-900/30 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-950 flex items-center justify-center font-black text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-800 uppercase">
                      {user.name ? user.name.charAt(0) : 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-black text-gray-800 dark:text-gray-200 truncate uppercase tracking-tight">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.email || 'Dosen'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation links */}
              <div className="flex-1 overflow-y-auto py-6 px-4">
                <nav className="space-y-2">
                  {navLinks.map((link, idx) => {
                    const Icon = link.icon;
                    return (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 + 0.1 }}
                      >
                        <Link
                          to={location.pathname === '/' ? link.href : `/${link.href}`}
                          onClick={(e: any) => handleScrollTo(e, link.href)}
                          className="flex items-center gap-3.5 p-3 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-950/30 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl transition-all"
                        >
                          <Icon className="w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                          {link.name}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              {/* Footer inside drawer with Action Buttons */}
              <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-950/50">
                {user ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full p-3.5 text-sm font-black text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl hover:from-primary-700 hover:to-primary-600 transition-all shadow-lg shadow-primary-500/10 hover:shadow-primary-500/25"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full p-3.5 text-sm font-bold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
                    >
                      <LogIn className="w-4 h-4" />
                      Masuk
                    </Link>
                    <Link
                      to="/insights"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full p-3.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all"
                    >
                      Insights
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
