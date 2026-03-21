import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Menu, Search, Bell, LogOut, ChevronDown, User, X, Mail, GraduationCap, BookOpen, BadgeCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

interface TopbarProps {
  isMobile: boolean;
  setIsMobileMenuOpen: (value: boolean) => void;
  currentPageName?: string;
  isDark: boolean;
  setIsDark: (value: boolean) => void;
  user: any;
  handleLogout: () => void;
}

export default function Topbar({
  isMobile,
  setIsMobileMenuOpen,
  currentPageName,
  isDark,
  setIsDark,
  user,
  handleLogout
}: TopbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-20 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-4">
           {isMobile && (
             <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2.5 bg-primary-50 text-primary-600 rounded-xl lg:hidden"
             >
                <Menu className="w-6 h-6" />
             </button>
           )}
           <div>
              <h2 className="text-base lg:text-lg font-black text-gray-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
                {currentPageName || 'PentaV2'}
                <span className="hidden sm:inline text-[10px] font-bold text-primary-500 bg-primary-50 dark:bg-primary-950/50 px-2 py-0.5 rounded-full uppercase tracking-tighter">Live</span>
              </h2>
           </div>
      </div>

      <div className="flex items-center gap-3 lg:gap-5">
        <div className="hidden sm:flex items-center bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-2xl px-4 py-2 w-48 lg:w-72 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
           <Search className="w-4 h-4 text-gray-400 mr-2 lg:mr-3" />
           <input type="text" placeholder="Search..." className="bg-transparent border-none text-xs lg:text-sm dark:text-zinc-100 outline-none w-full font-medium" />
        </div>

        {/* Theme Toggle Component */}
        <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
        
        <button className="relative p-2.5 bg-gray-50 dark:bg-zinc-800 hover:bg-primary-50 text-gray-400 hover:text-primary-600 rounded-xl transition-all border border-gray-100 dark:border-zinc-700">
           <Bell className="w-5 h-5" />
           <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
        </button>

        {/* User Profile & Dropdown */}
        <div className="relative flex items-center gap-3 pl-3 border-l border-gray-200" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 p-1.5 rounded-xl transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-lg flex-shrink-0">
              <span className="text-lg font-black">{user?.name?.charAt(0) || 'U'}</span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">{user?.name}</p>
              <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">{user?.role}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 py-1.5 z-30"
              >
                <button 
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsDropdownOpen(false);
                  }} 
                  className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-gray-700 dark:text-zinc-300 hover:bg-primary-50 dark:hover:bg-zinc-800 hover:text-primary-600 w-full text-left transition-colors uppercase tracking-wider"
                >
                  <User className="w-4 h-4 text-primary-500" />
                  Lihat Profil
                </button>
                <div className="border-t border-gray-100 dark:border-zinc-800 my-1"></div>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 w-full text-left transition-colors uppercase tracking-wider"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Modal dengan Framer Motion */}
        {typeof document !== 'undefined' && createPortal(
          <AnimatePresence>
            {isModalOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4"
              >
                <motion.div 
                  initial={{ scale: 0.9, y: 20, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.9, y: 20, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-md shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden"
                >
                  
                  {/* Banner / Cover Header */}
                  <div className="h-28 bg-gradient-to-r from-primary-500 to-primary-700 relative">
                    <button 
                      onClick={() => setIsModalOpen(false)} 
                      className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white backdrop-blur-md transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Profile Avatar & Title */}
                  <div className="px-6 relative pb-4 border-b border-gray-100 dark:border-zinc-800">
                    <div className="w-20 h-20 rounded-2xl bg-white dark:bg-zinc-900 p-1.5 absolute -top-10 shadow-lg border border-gray-50 dark:border-zinc-800">
                      <div className="w-full h-full rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-3xl font-black shadow-inner">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                    </div>
                    
                    <div className="pt-12">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-black text-gray-900 tracking-tight">{user?.name || 'User Tanpa Nama'}</h3>
                        <BadgeCheck className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="bg-primary-50 text-primary-600 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 border border-primary-100">
                          {user?.role || 'Mahasiswa'}
                        </span>
                        <span className="bg-green-50 text-green-600 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border border-green-100">
                          Aktif
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Profile Details */}
                  <div className="p-6 space-y-4 bg-gray-50/50 dark:bg-zinc-900/50">
                    <div className="flex items-center p-4 bg-white dark:bg-zinc-800/80 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:border-primary-100 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 mr-4 flex-shrink-0">
                         <Mail className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Alamat Email</label>
                        <p className="text-sm font-bold text-gray-800 dark:text-zinc-200 truncate">{user?.email || '-'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-start p-4 bg-white dark:bg-zinc-800/80 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:border-primary-100 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-500 mr-3 flex-shrink-0 mt-0.5">
                           <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Fakultas</label>
                          <p className="text-sm font-bold text-gray-800 dark:text-zinc-200 line-clamp-2">{user?.fakultas || '-'}</p>
                        </div>
                      </div>

                      <div className="flex items-start p-4 bg-white dark:bg-zinc-800/80 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:border-primary-100 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-500 mr-3 flex-shrink-0 mt-0.5">
                           <GraduationCap className="w-4 h-4" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Program Studi</label>
                          <p className="text-sm font-bold text-gray-800 dark:text-zinc-200 line-clamp-2">{user?.program_studi || '-'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="p-4 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800">
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl font-black uppercase tracking-[0.15em] text-xs transition-all active:scale-[0.98] shadow-lg shadow-gray-900/20"
                    >
                      Tutup Profil
                    </button>
                  </div>

                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
      </div>
    </header>
  );
}