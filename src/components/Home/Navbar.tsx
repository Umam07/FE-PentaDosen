import { useState, useEffect, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hexagon, Menu, X, ArrowRight } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from '../layout/ThemeToggle';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');
  const location = useLocation();
  const navigate = useNavigate();

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
    { name: 'Beranda', href: '#hero' },
    { name: 'Fitur', href: '#features' },
    { name: 'Sistem Kerja', href: '#workflow' },
    { name: 'Tentang Kami', href: '#about' },
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
          ? 'top-4 w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] max-w-7xl py-3 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 dark:border-gray-800/50 rounded-2xl' 
          : 'top-0 w-full max-w-full py-6 bg-transparent border-transparent rounded-none'
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-2.5 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl shadow-lg shadow-primary-100 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <Hexagon className="w-6 h-6 text-white fill-white/20" />
            </div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">
              Penta<span className="text-primary-600 dark:text-primary-500">Dosen</span>
            </h1>
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
                className="flex items-center gap-2 text-sm font-black text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 px-6 py-2.5 rounded-xl shadow-lg shadow-primary-100 hover:shadow-primary-200 transition-all duration-300 group"
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
                        className="flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 px-5 py-2.5 rounded-xl shadow-lg shadow-primary-100 hover:shadow-primary-200 transition-all duration-300 group"
                      >
                        Insights
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                </>
             )}
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className={`md:hidden absolute left-0 right-0 bg-white dark:bg-gray-900 border-b dark:border-gray-800 border-gray-100 shadow-xl transition-all duration-300 ${
              isScrolled ? 'top-[68px] rounded-b-xl mx-0' : 'top-[88px]'
            }`}
          >
            <div className="p-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={location.pathname === '/' ? link.href : `/${link.href}`}
                  onClick={(e: any) => handleScrollTo(e, link.href)}
                  className="block p-3 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl transition-all"
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-gray-100 my-2" />
              <div className="pt-2">
                {user ? (
                  <Link 
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center p-3 text-sm font-black text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl hover:from-primary-700 hover:to-primary-600 transition-all shadow-md shadow-primary-100"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link 
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center p-3 text-sm font-bold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                    >
                      Masuk
                    </Link>
                    <Link 
                      to="/insights"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center p-3 text-sm font-bold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-all shadow-md shadow-primary-100"
                    >
                      Insights
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
