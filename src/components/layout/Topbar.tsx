import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Menu, Search, LogOut, ChevronDown, User, Users, X, BookOpen, BadgeCheck, LayoutDashboard, ArrowUpRight, ShieldAlert, HelpCircle, Settings, Shield, Sparkles } from 'lucide-react';
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
    if (user?.role === 'admin penelitian' || user?.role === 'admin fakultas') {
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

  useEffect(() => {
    const performLogout = () => {
      handleLogout();
    };
    window.addEventListener("penta-logout", performLogout);
    return () => window.removeEventListener("penta-logout", performLogout);
  }, [handleLogout]);

  interface TopbarSearchItem {
    title: string;
    path: string;
    icon: any;
    category: string;
    subtext?: string;
  }

  const menuItems: TopbarSearchItem[] = (user?.role === 'admin penelitian' || user?.role === 'admin fakultas') ? [
    { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, category: 'Menu' },
    { title: 'Verifikasi Dokumen', path: '/admin/verify', icon: BadgeCheck, category: 'Menu' },
    { title: 'Kelola Dosen', path: '/admin/lecturers', icon: Users, category: 'Menu' },
    { title: 'Semua Dokumen', path: '/admin/documents/all', icon: BookOpen, category: 'Menu' },
    ...(user?.role === 'admin penelitian' ? [
      { title: 'Panel CMS', path: '/admin/cms', icon: ShieldAlert, category: 'Menu' },
      { title: 'Sync Data API', path: '/admin/sync', icon: ArrowUpRight, category: 'Menu' },
    ] : []),
  ] : [
    { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, category: 'Menu' },
    { title: 'Dokumen Saya', path: '/documents', icon: BookOpen, category: 'Menu' },
  ];

  const dynamicItems: TopbarSearchItem[] = (user?.role === 'admin penelitian' || user?.role === 'admin fakultas') 
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
    <header className="h-20 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between px-4 sm:px-6 lg:px-6 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
           {isMobile && (
             <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 sm:p-2.5 bg-primary-50 text-primary-600 rounded-xl lg:hidden shrink-0"
             >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
             </button>
           )}
           <div className="hidden sm:block min-w-0 truncate">
              <h2 className="text-base lg:text-lg font-black text-gray-900 dark:text-zinc-100 tracking-tight flex items-center gap-2 truncate">
                {currentPageName || 'PentaDosen'}
              </h2>
           </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Interactive Search Bar dengan Dropdown */}
        <div className="hidden sm:block w-48 lg:w-72" ref={searchRef}>
          <ActionSearchBar 
            actions={searchActions} 
            onSelect={handleActionSelect}
            placeholder="Cari menu/dosen..."
            user={user}
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
        <div className="relative flex items-center gap-1.5 xs:gap-3 pl-1.5 xs:pl-3 border-l border-gray-200 dark:border-zinc-800" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 hover:bg-gray-100/80 dark:hover:bg-zinc-800/60 p-1.5 rounded-xl transition-colors duration-150"
          >
            <div className="w-9 h-9 rounded-lg bg-primary-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 overflow-hidden">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{user?.name?.charAt(0) || 'U'}</span>
              )}
            </div>
            <div className="hidden md:block text-left min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-zinc-100 leading-tight truncate">{user?.name}</p>
              {user?.role && (
                <p className="text-[11px] font-medium text-gray-400 dark:text-zinc-400 capitalize truncate">{user.role}</p>
              )}
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-150 ${isDropdownOpen ? 'rotate-180' : ''} hidden md:block shrink-0`} />
          </button>

          {/* Dropdown Menu — Minimalist Single-Line List */}
          <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-200/90 dark:border-zinc-800 z-50 p-1 space-y-0.5 overflow-hidden"
                    >
                      <button
                        onClick={() => { navigate('/profile'); setIsDropdownOpen(false); }}
                        className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg hover:bg-gray-100/80 dark:hover:bg-zinc-800/80 transition-colors duration-150 text-left"
                      >
                        <div className="w-7 h-7 rounded-md bg-gray-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 text-gray-600 dark:text-zinc-300">
                          <Settings className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-semibold text-gray-800 dark:text-zinc-200">
                          Pengaturan Profil
                        </span>
                      </button>

                      <div className="my-1 border-t border-gray-100 dark:border-zinc-800/80" />

                      <button
                        onClick={handleLogout}
                        data-logout-trigger
                        className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors duration-150 text-left"
                      >
                        <div className="w-7 h-7 rounded-md bg-red-50 dark:bg-red-950/50 flex items-center justify-center flex-shrink-0 text-red-600 dark:text-red-400">
                          <LogOut className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                          Keluar Sistem
                        </span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
        </div>



        {/* Mobile Search Modal (Direct Command Dialog Popup) */}
        <ActionSearchBar 
          actions={searchActions} 
          onSelect={handleActionSelect}
          placeholder="Cari menu/dosen..."
          user={user}
          open={isMobileSearchOpen}
          onOpenChange={setIsMobileSearchOpen}
          hideTrigger
        />
      </div>
    </header>
  );
}