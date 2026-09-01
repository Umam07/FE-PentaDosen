import { useState, useEffect, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowRight, ArrowUpRight, Home, Trophy, Sparkles, Settings, LogIn, LayoutDashboard } from 'lucide-react';
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
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          ease: [0.22, 1, 0.36, 1] 
        }}
        className={`fixed left-0 right-0 z-50 transition-all duration-700 mx-auto ${
          isScrolled 
            ? 'top-4 w-[calc(100%-1.5rem)] sm:w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] max-w-7xl py-3 bg-surface-light/85 dark:bg-canvas-dark/85 backdrop-blur-xl shadow-md border border-hairline-light dark:border-hairline-dark rounded-2xl' 
            : 'top-0 w-full max-w-full py-6 bg-transparent border-transparent rounded-none'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 min-w-0">
            {/* Logo Co-Branding YARSI + PentaDosen (Symmetrical Icon + Text Lockup) */}
            <Link to="/" className="flex items-center gap-3 sm:gap-3.5 group shrink min-w-0" title="Universitas YARSI • PentaDosen">
              {/* Institution: Universitas YARSI */}
              <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                <img 
                  src="/YARSI-KOTAK-e1739161183276.png" 
                  alt="Universitas YARSI" 
                  width={36}
                  height={36}
                  className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0 transition-transform duration-200 group-hover:scale-105"
                />
                <div className="flex flex-col justify-center">
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-wider text-body dark:text-on-dark-soft uppercase leading-tight">
                    UNIVERSITAS
                  </span>
                  <span className="text-xs sm:text-sm font-black tracking-tight text-ink-heading dark:text-on-dark uppercase leading-tight">
                    YARSI
                  </span>
                </div>
              </div>

              {/* Centered Vertical Divider */}
              <div className="h-6 sm:h-7 w-[1px] bg-hairline-light dark:bg-hairline-dark shrink-0" />

              {/* Product: PentaDosen */}
              <div className="flex items-center gap-2 sm:gap-2.5 shrink min-w-0">
                <PentaDosenLogo className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 transition-transform duration-200 group-hover:scale-105" />
                <span className="text-sm sm:text-base font-black text-ink-heading dark:text-on-dark tracking-tight uppercase truncate leading-none">
                  Penta<span className="text-accent dark:text-accent-on-dark">Dosen</span>
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
                  className="text-sm font-semibold text-muted dark:text-on-dark-soft hover:text-ink-heading dark:hover:text-on-dark transition-colors duration-200 relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
              <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
              {user ? (
                <Link 
                  to="/dashboard"
                  className="flex items-center gap-2 text-sm font-semibold text-on-ink dark:text-ink bg-ink hover:bg-ink-hover dark:bg-on-dark dark:hover:bg-white active:scale-[0.98] px-6 py-2.5 rounded-lg transition-all duration-200 group shadow-sm"
                >
                  Dashboard
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <Link 
                  to="/login"
                  className="flex items-center gap-1.5 text-sm font-semibold text-on-ink dark:text-ink bg-ink hover:bg-ink-hover dark:bg-on-dark dark:hover:bg-white active:scale-[0.98] px-5 py-2.5 rounded-lg transition-all duration-200 group shadow-sm"
                >
                  <span>Masuk</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:hidden shrink-0">
              <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1.5 sm:p-2 bg-surface-light-raised dark:bg-surface-dark-elevated text-body dark:text-on-dark-soft rounded-lg hover:bg-ink-soft dark:hover:bg-surface-dark hover:text-ink-heading dark:hover:text-on-dark transition-all"
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
              className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[85vw] bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-2xl border-l border-hairline-light dark:border-hairline-dark shadow-2xl flex flex-col md:hidden"
            >
              {/* Header inside drawer */}
              <div className="flex items-center justify-between p-6 border-b border-hairline-light dark:border-hairline-dark">
                <Link to="/" className="flex items-center gap-2.5 group min-w-0" onClick={() => setIsMenuOpen(false)} title="Universitas YARSI • PentaDosen">
                  {/* Institution: Universitas YARSI */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <img 
                      src="/YARSI-KOTAK-e1739161183276.png" 
                      alt="Universitas YARSI" 
                      className="w-7 h-7 object-contain shrink-0"
                    />
                    <div className="flex flex-col justify-center">
                      <span className="text-[8px] font-mono font-bold tracking-wider text-body dark:text-on-dark-soft uppercase leading-tight">
                        UNIVERSITAS
                      </span>
                      <span className="text-xs font-black tracking-tight text-ink-heading dark:text-on-dark uppercase leading-tight">
                        YARSI
                      </span>
                    </div>
                  </div>

                  {/* Centered Vertical Divider */}
                  <div className="h-5 w-[1px] bg-hairline-light dark:bg-hairline-dark shrink-0" />

                  {/* Product: PentaDosen */}
                  <div className="flex items-center gap-1.5 shrink min-w-0">
                    <PentaDosenLogo className="w-7 h-7 shrink-0" />
                    <span className="text-sm font-black text-ink-heading dark:text-on-dark uppercase tracking-tight truncate leading-none">
                      Penta<span className="text-accent dark:text-accent-on-dark">Dosen</span>
                    </span>
                  </div>
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-muted dark:text-on-dark-muted hover:text-ink-heading dark:hover:text-on-dark rounded-lg hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-colors"
                  aria-label="Tutup menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User profile section if logged in */}
              {user && (
                <div className="p-6 bg-surface-light-raised dark:bg-surface-dark-elevated border-b border-hairline-light dark:border-hairline-dark">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-ink text-on-ink dark:bg-surface-dark dark:text-on-dark flex items-center justify-center font-black border border-ink-border dark:border-hairline-dark uppercase">
                      {user.name ? user.name.charAt(0) : 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-ink-heading dark:text-on-dark truncate uppercase tracking-tight">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted dark:text-on-dark-muted truncate">
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
                          className="flex items-center gap-3.5 p-3 text-sm font-semibold text-body dark:text-on-dark-soft hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated hover:text-ink-heading dark:hover:text-on-dark rounded-lg transition-all"
                        >
                          <Icon className="w-5 h-5 text-muted group-hover:text-ink-heading dark:group-hover:text-on-dark transition-colors" />
                          {link.name}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              {/* Footer inside drawer with Action Buttons */}
              <div className="p-6 border-t border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark">
                {user ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full p-3.5 text-sm font-semibold text-on-ink dark:text-ink bg-ink hover:bg-ink-hover dark:bg-on-dark dark:hover:bg-white rounded-lg transition-all shadow-sm"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full p-3.5 text-sm font-semibold text-on-ink dark:text-ink bg-ink hover:bg-ink-hover dark:bg-on-dark dark:hover:bg-white rounded-lg transition-all shadow-sm group"
                  >
                    <span>Masuk</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
