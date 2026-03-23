import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Menu, Search, Bell, LogOut, ChevronDown, User, Users, X, Mail, GraduationCap, BookOpen, BadgeCheck, LayoutDashboard, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [lecturers, setLecturers] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'admin') {
      fetch('/api/admin/lecturers')
        .then(res => res.json())
        .then(data => setLecturers(data.lecturers || []))
        .catch(err => console.error(err));
    }
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setActiveIndex(-1);
  }, [searchTerm]);

  const menuItems = user?.role === 'admin' ? [
    { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, category: 'Menu' },
    { title: 'Verifikasi Dokumen', path: '/admin/verify', icon: BadgeCheck, category: 'Menu' },
    { title: 'Kelola Dosen', path: '/admin/lecturers', icon: Users, category: 'Menu' },
    { title: 'Semua Dokumen', path: '/admin/documents/all', icon: BookOpen, category: 'Menu' },
    { title: 'Sync Data API', path: '/admin/sync', icon: ArrowUpRight, category: 'Menu' },
  ] : [
    { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, category: 'Menu' },
    { title: 'Dokumen Saya', path: '/documents', icon: BookOpen, category: 'Menu' },
  ];

  const dynamicItems = user?.role === 'admin' 
    ? lecturers.map((l: any) => ({
        title: l.name,
        path: `/admin/lecturers/${l.id}`,
        icon: User,
        category: 'Dosen',
        subtext: l.program_studi
      }))
    : [];

  const allSearchItems = [...menuItems, ...dynamicItems];
  
  const filteredItems = searchTerm.trim() === '' 
    ? [] 
    : allSearchItems.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.subtext && item.subtext.toLowerCase().includes(searchTerm.toLowerCase()))
      ).slice(0, 5);

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

      <div className="flex items-center gap-3 xs:gap-4 lg:gap-5">
        {/* Interactive Search Bar dengan Dropdown */}
        <div className="relative" ref={searchRef}>
          <div className="hidden sm:flex items-center bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-2xl px-4 py-2 w-48 lg:w-72 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
             <Search className="w-4 h-4 text-gray-400 mr-2 lg:mr-3" />
             <input 
               type="text" 
               placeholder="Search..." 
               value={searchTerm}
               onChange={(e) => { setSearchTerm(e.target.value); setIsSearchOpen(true); }}
               onFocus={() => setIsSearchOpen(true)}
               onKeyDown={(e) => {
                 if (e.key === 'ArrowDown') {
                   e.preventDefault();
                   setActiveIndex(prev => prev < filteredItems.length - 1 ? prev + 1 : prev);
                 } else if (e.key === 'ArrowUp') {
                   e.preventDefault();
                   setActiveIndex(prev => prev > -1 ? prev - 1 : prev);
                 } else if (e.key === 'Enter') {
                   if (activeIndex >= 0 && filteredItems[activeIndex]) {
                     navigate(filteredItems[activeIndex].path);
                     setIsSearchOpen(false);
                     setSearchTerm('');
                   }
                 } else if (e.key === 'Escape') {
                   setIsSearchOpen(false);
                 }
               }}
               className="bg-transparent border-none text-xs lg:text-sm dark:text-zinc-100 outline-none w-full font-medium" 
             />
          </div>
          
          <AnimatePresence>
            {isSearchOpen && filteredItems.length > 0 && (
               <motion.div 
                 initial={{ opacity: 0, y: -10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 transition={{ duration: 0.15 }}
                 className="absolute left-0 right-0 mt-2 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 py-1.5 z-40 max-h-64 overflow-y-auto w-48 lg:w-72"
               >
                 {filteredItems.map((item, index) => (
                   <button
                     key={item.path + index}
                     onClick={() => {
                        navigate(item.path);
                        setIsSearchOpen(false);
                        setSearchTerm('');
                     }}
                     className={`flex items-center gap-3 px-4 py-2.5 w-full text-left transition-colors group ${index === activeIndex ? 'bg-primary-50 dark:bg-zinc-800/60' : 'hover:bg-primary-50 dark:hover:bg-zinc-800/60'}`}
                   >
                     <div className={`p-1.5 rounded-lg transition-colors ${index === activeIndex ? 'bg-primary-100 dark:bg-primary-950/40 text-primary-600' : 'bg-gray-50 dark:bg-zinc-800 text-gray-400 group-hover:bg-primary-100 dark:group-hover:bg-primary-950/40 group-hover:text-primary-600'}`}>
                        <item.icon className="w-4 h-4" />
                     </div>
                     <div className="min-w-0 flex-1">
                       <p className="text-xs font-black text-gray-700 dark:text-zinc-200 truncate uppercase tracking-tight">{item.title}</p>
                       {item.subtext ? (
                        <p className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest truncate">{item.subtext}</p>
                       ) : (
                        <p className="text-[9px] font-bold text-primary-500 uppercase tracking-widest">{item.category}</p>
                       )}
                     </div>
                   </button>
                 ))}
               </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme Toggle Component */}
        <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
        
        {/* Divider khusus Mobile */}
        <div className="h-4 w-px bg-gray-200 dark:bg-zinc-800 sm:hidden" />
        
        {/* Mobile Search Button */}
        <button 
          onClick={() => setIsMobileSearchOpen(true)}
          className="flex sm:hidden items-center justify-center w-9 h-9 bg-gray-50 dark:bg-zinc-800 hover:bg-primary-50 text-gray-400 hover:text-primary-600 rounded-xl transition-all border border-gray-100 dark:border-zinc-700 flex-shrink-0"
        >
           <Search className="w-4 h-4" />
        </button>

        {/* User Profile & Dropdown */}
        <div className="relative flex items-center gap-1.5 xs:gap-3 pl-1.5 xs:pl-3 border-l border-gray-200" ref={dropdownRef}>
          <button             onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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

        {/* Mobile Search Modal */}
        {typeof document !== 'undefined' && createPortal(
          <AnimatePresence>
            {isMobileSearchOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[100] bg-white dark:bg-zinc-950 flex flex-col sm:hidden"
              >
                {/* Header Search */}
                <div className="h-20 px-6 flex items-center gap-4 border-b border-gray-100 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl">
                  <div className="flex-1 flex items-center bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
                    <Search className="w-5 h-5 text-gray-400 mr-2" />
                    <input 
                      type="text" 
                      placeholder="Cari menu atau dosen..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowDown') {
                          e.preventDefault();
                          setActiveIndex(prev => prev < filteredItems.length - 1 ? prev + 1 : prev);
                        } else if (e.key === 'ArrowUp') {
                          e.preventDefault();
                          setActiveIndex(prev => prev > -1 ? prev - 1 : prev);
                        } else if (e.key === 'Enter') {
                          if (activeIndex >= 0 && filteredItems[activeIndex]) {
                            navigate(filteredItems[activeIndex].path);
                            setIsMobileSearchOpen(false);
                            setSearchTerm('');
                          }
                        } else if (e.key === 'Escape') {
                          setIsMobileSearchOpen(false);
                        }
                      }}
                      className="bg-transparent border-none text-xs dark:text-zinc-100 outline-none w-full font-medium" 
                      autoFocus
                    />
                  </div>
                  <button 
                    onClick={() => { setIsMobileSearchOpen(false); setSearchTerm(''); }}
                    className="p-2.5 bg-gray-50 dark:bg-zinc-900 text-gray-500 rounded-xl border border-gray-200 dark:border-zinc-800 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Results with Scroll area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item, index) => (
                      <button
                        key={item.path + index}
                        onClick={() => {
                          navigate(item.path);
                          setIsMobileSearchOpen(false);
                          setSearchTerm('');
                        }}
                        className={`flex items-center gap-4 p-4 rounded-2xl w-full text-left transition-all duration-200 border shadow-sm flex-shrink-0 group ${index === activeIndex ? 'bg-primary-50 dark:bg-zinc-800/60 border-primary-100 dark:border-primary-900/40' : 'bg-gray-50 dark:bg-zinc-900/40 border-transparent hover:bg-primary-50 dark:hover:bg-zinc-800/60 hover:border-primary-100 dark:hover:border-primary-900/40'}`}
                      >
                        <div className={`p-2.5 rounded-xl transition-colors shadow-sm ${index === activeIndex ? 'bg-primary-100 dark:bg-primary-950/40 text-primary-600' : 'bg-white dark:bg-zinc-800 text-gray-400 group-hover:bg-primary-100 dark:group-hover:bg-primary-950/40 group-hover:text-primary-600'}`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-black text-gray-700 dark:text-zinc-200 truncate uppercase tracking-tight">{item.title}</p>
                          {item.subtext ? (
                            <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest truncate">{item.subtext}</p>
                          ) : (
                            <p className="text-[10px] font-bold text-primary-500 uppercase tracking-widest">{item.category}</p>
                          )}
                        </div>
                      </button>
                    ))
                  ) : (
                    searchTerm.trim() !== '' && (
                      <div className="text-center py-12 text-gray-400 dark:text-zinc-500 flex flex-col items-center justify-center">
                        <Search className="w-12 h-12 mb-3 opacity-20" />
                        <p className="text-sm font-bold">Tidak ada hasil ditemukan</p>
                        <p className="text-xs text-gray-400 dark:text-zinc-600 mt-1">Coba kata kunci lain</p>
                      </div>
                    )
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
      </div>
    </header>
  );
}