import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Menu, Search, LogOut, ChevronDown, User, Users, X, BookOpen, BadgeCheck, LayoutDashboard, ArrowUpRight, ShieldAlert, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import { ActionSearchBar, Action } from '../ui/action-search-bar';
import NotificationBell from '../ui/NotificationBell';

interface TopbarProps {
  isMobile: boolean;
  setIsMobileMenuOpen: (value: boolean) => void;
  currentPageName?: string;
  isDark: boolean;
  setIsDark: (value: boolean) => void;
  user: any;
  handleLogout: () => void;
  hideLiveBadge?: boolean;
}

export default function Topbar({
  isMobile,
  setIsMobileMenuOpen,
  currentPageName,
  isDark,
  setIsDark,
  user,
  handleLogout,
  hideLiveBadge
}: TopbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [lecturers, setLecturers] = useState<any[]>([]);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'admin lppm' || user?.role === 'admin fakultas') {
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
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = user?.role === 'super admin' ? [
    { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, category: 'Menu' },
    { title: 'Panel CMS', path: '/admin/cms', icon: ShieldAlert, category: 'Menu' },
  ] : (user?.role === 'admin lppm' || user?.role === 'admin fakultas') ? [
    { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, category: 'Menu' },
    { title: 'Verifikasi Dokumen', path: '/admin/verify', icon: BadgeCheck, category: 'Menu' },
    { title: 'Kelola Dosen', path: '/admin/lecturers', icon: Users, category: 'Menu' },
    { title: 'Semua Dokumen', path: '/admin/documents/all', icon: BookOpen, category: 'Menu' },
    { title: 'Sync Data API', path: '/admin/sync', icon: ArrowUpRight, category: 'Menu' },
  ] : [
    { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, category: 'Menu' },
    { title: 'Dokumen Saya', path: '/documents', icon: BookOpen, category: 'Menu' },
  ];

  const dynamicItems = (user?.role === 'admin lppm' || user?.role === 'admin fakultas') 
    ? lecturers.map((l: any) => ({
        title: l.name,
        path: `/admin/lecturers/${l.id}`,
        icon: User,
        category: 'Dosen',
        subtext: l.program_studi
      }))
    : [];

  const allSearchItems = [...menuItems, ...dynamicItems];
  
  const searchActions: Action[] = allSearchItems.map((item, index) => ({
    id: `action-${index}`,
    label: item.title,
    icon: <item.icon className="h-4 w-4" />,
    description: item.subtext || item.category,
    path: item.path,
    end: item.subtext ? 'LECTURER' : 'MENU'
  }));

  const handleActionSelect = (action: Action) => {
    if (action.path) {
      navigate(action.path);
      setIsMobileSearchOpen(false);
    }
  };

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
           <div className="hidden sm:block">
              <h2 className="text-base lg:text-lg font-black text-gray-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
                {currentPageName || 'PentaV2'}
              </h2>
           </div>
      </div>

      <div className="flex items-center gap-3 xs:gap-4 lg:gap-5">
        {/* Interactive Search Bar dengan Dropdown */}
        <div className="hidden sm:block w-48 lg:w-72" ref={searchRef}>
          <ActionSearchBar 
            actions={searchActions} 
            onSelect={handleActionSelect}
            placeholder="Search commands or lecturers..."
          />
        </div>

        {/* Theme Toggle Component */}
        <ThemeToggle isDark={isDark} setIsDark={setIsDark} />

        {/* Notification Bell */}
        <NotificationBell userId={user?.id} />
        
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-lg flex-shrink-0 overflow-hidden">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-black">{user?.name?.charAt(0) || 'U'}</span>
              )}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">{user?.name}</p>
              <p className="text-[10px] font-bold text-slate-650 dark:text-slate-400 uppercase tracking-widest">
                {user?.role === 'super admin' ? 'Super Admin' : user?.role === 'admin lppm' ? 'Admin Penelitian' : user?.role === 'admin fakultas' ? 'Admin Fakultas' : user?.role}
              </p>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''} hidden md:block`} />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-zinc-800 py-3 z-30 overflow-hidden"
                >




                  <button 
                    onClick={() => {
                      navigate('/profile');
                      setIsDropdownOpen(false);
                    }} 
                    className="flex items-center gap-3 px-5 py-3 text-[10px] font-black text-gray-700 dark:text-zinc-300 hover:bg-primary-50 dark:hover:bg-zinc-800 hover:text-primary-600 w-full text-left transition-colors uppercase tracking-widest"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-500" />
                    </div>
                    Pengaturan Profil
                  </button>
                  <div className="border-t border-gray-100 dark:border-zinc-800 my-1"></div>
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center gap-3 px-5 py-3 text-[10px] font-black text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 w-full text-left transition-colors uppercase tracking-widest"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <LogOut className="w-4 h-4" />
                    </div>
                    Log Out Sistem
                  </button>
                </motion.div>
            )}
          </AnimatePresence>
        </div>



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
                {/* Results area - using ActionSearchBar internal logic */}
                <div className="flex-1 overflow-y-auto p-6">
                   <ActionSearchBar 
                    actions={searchActions} 
                    onSelect={handleActionSelect}
                    placeholder="Apa yang Anda cari?"
                    className="max-w-full"
                  />
                  <button 
                    onClick={() => setIsMobileSearchOpen(false)}
                    className="mt-4 w-full py-4 rounded-2xl bg-gray-50 dark:bg-zinc-900 text-gray-500 font-bold uppercase tracking-widest text-[10px] border border-gray-200 dark:border-zinc-800"
                  >
                    Tutup Pencarian
                  </button>
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