import { useState, useEffect, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hexagon, Menu, X, ArrowRight, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');

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

    const storedUser = localStorage.getItem('pentadosen_user');
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
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-4 bg-white/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] border-b border-gray-100' 
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-2.5 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl shadow-lg shadow-primary-100 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <Hexagon className="w-6 h-6 text-white fill-white/20" />
            </div>
            <h1 className="text-xl font-black text-gray-900 tracking-tighter uppercase">
              Penta<span className="text-primary-600">Dosen</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className="text-sm font-bold text-gray-600 hover:text-primary-600 transition-colors duration-200 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className="relative flex items-center bg-gray-100 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 p-1 rounded-2xl w-14 h-8 transition-all duration-300 overflow-hidden group shadow-inner flex-shrink-0"
            >
              <motion.div
                layout
                className="absolute h-6 w-6 rounded-xl bg-white dark:bg-zinc-900 shadow-md flex items-center justify-center z-10"
                animate={{ x: isDark ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {isDark ? <Moon className="w-3.5 h-3.5 text-primary-500" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
              </motion.div>
              <div className="flex justify-between w-full px-1.5 z-0">
                <Sun className={`w-3.5 h-3.5 ${!isDark ? 'text-amber-500' : 'text-gray-400'} transition-colors duration-300`} />
                <Moon className={`w-3.5 h-3.5 ${isDark ? 'text-primary-500' : 'text-gray-400'} transition-colors duration-300`} />
              </div>
            </button>
            {user ? (
              <Link 
                to="/dashboard"
                className="flex items-center gap-2 text-sm font-black text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 px-6 py-2.5 rounded-xl shadow-lg shadow-primary-100 hover:shadow-primary-200 transition-all duration-300 group"
              >
                Dashboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
                <>
                  <Link 
                    to="/login"
                    className="text-sm font-bold text-gray-700 hover:text-primary-600 px-4 py-2 rounded-xl transition-all"
                  >
                    Masuk
                  </Link>
                  <Link 
                    to="/dashboard-all"
                    className="flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 px-5 py-2.5 rounded-xl shadow-lg shadow-primary-100 hover:shadow-primary-200 transition-all duration-300 group"
                  >
                    Dashboard
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </>
             )}
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setIsDark(!isDark)}
              className="relative flex items-center bg-gray-100 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 p-1 rounded-2xl w-14 h-8 transition-all duration-300 overflow-hidden group shadow-inner flex-shrink-0"
            >
              <motion.div
                layout
                className="absolute h-6 w-6 rounded-xl bg-white dark:bg-zinc-900 shadow-md flex items-center justify-center z-10"
                animate={{ x: isDark ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {isDark ? <Moon className="w-3.5 h-3.5 text-primary-500" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
              </motion.div>
              <div className="flex justify-between w-full px-1.5 z-0">
                <Sun className={`w-3.5 h-3.5 ${!isDark ? 'text-amber-500' : 'text-gray-400'} transition-colors duration-300`} />
                <Moon className={`w-3.5 h-3.5 ${isDark ? 'text-primary-500' : 'text-gray-400'} transition-colors duration-300`} />
              </div>
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-primary-50 hover:text-primary-600 transition-all"
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
            className="md:hidden absolute top-[73px] left-0 right-0 bg-white border-b border-gray-100 shadow-xl"
          >
            <div className="p-4 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className="block p-3 text-sm font-bold text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all"
                >
                  {link.name}
                </a>
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
                      className="flex items-center justify-center p-3 text-sm font-bold text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
                    >
                      Masuk
                    </Link>
                    <Link 
                      to="/dashboard-all"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center p-3 text-sm font-bold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-all shadow-md shadow-primary-100"
                    >
                      Dashboard
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
