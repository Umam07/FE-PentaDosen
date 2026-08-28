import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Menu, Search, LogOut, ChevronDown, User, Users, X, BookOpen, BadgeCheck, LayoutDashboard, ArrowUpRight, ShieldAlert, HelpCircle, Settings, Shield, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import { ActionSearchBar, Action } from '../shared/action-search-bar';
import NotificationBell from '../shared/NotificationBell';

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="h-20 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-xl border-b border-hairline-light dark:border-hairline-dark flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
           {isMobile && (
             <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 sm:p-2.5 bg-surface-light-raised dark:bg-surface-dark-elevated text-body dark:text-on-dark-soft rounded-lg lg:hidden shrink-0 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
             >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
             </button>
           )}
           <div className="hidden sm:block min-w-0 truncate">
              <h2 className="text-base lg:text-lg font-black text-ink-heading dark:text-on-dark tracking-tight flex items-center gap-2 truncate">
                {currentPageName || 'PentaDosen'}
              </h2>
           </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Interactive Search Bar Desktop / Global Command Palette */}
        <div className="hidden sm:block w-48 lg:w-72" ref={searchRef}>
          <ActionSearchBar 
            actions={searchActions} 
            onSelect={handleActionSelect}
            placeholder="Cari menu/dosen..."
            user={user}
            open={isSearchOpen}
            onOpenChange={setIsSearchOpen}
          />
        </div>

        {/* Theme Toggle Component */}
        <ThemeToggle isDark={isDark} setIsDark={setIsDark} />

        {/* Notification Bell */}
        <NotificationBell userId={user?.id} />
        
        {/* Divider khusus Mobile */}
        <div className="h-4 w-px bg-hairline-light dark:bg-hairline-dark sm:hidden" />
        
        {/* Mobile Search Button */}
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="flex sm:hidden items-center justify-center w-9 h-9 bg-surface-light-raised dark:bg-surface-dark-elevated hover:bg-surface-light dark:hover:bg-surface-dark text-muted dark:text-on-dark-muted hover:text-ink-heading dark:hover:text-on-dark rounded-lg transition-all border border-hairline-light dark:border-hairline-dark flex-shrink-0 cursor-pointer"
        >
           <Search className="w-4 h-4" />
        </button>

        {/* User Profile & Dropdown */}
        <div className="relative flex items-center gap-1.5 xs:gap-3 pl-1.5 xs:pl-3 border-l border-hairline-light dark:border-hairline-dark" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated p-1.5 rounded-lg transition-colors duration-150 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-ink text-on-ink dark:bg-surface-dark-elevated dark:text-on-dark flex items-center justify-center font-bold text-sm flex-shrink-0 overflow-hidden border border-ink-border dark:border-hairline-dark">
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
              <p className="text-sm font-semibold text-ink-heading dark:text-on-dark leading-tight truncate">{user?.name}</p>
              {user?.role && (
                <p className="text-[11px] font-medium text-muted dark:text-on-dark-muted capitalize truncate">{user.role}</p>
              )}
            </div>
            <ChevronDown className={`w-4 h-4 text-muted dark:text-on-dark-muted transition-transform duration-150 ${isDropdownOpen ? 'rotate-180' : ''} hidden md:block shrink-0`} />
          </button>

          {/* Dropdown Menu — Minimalist Single-Line List */}
          <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 top-full mt-2 w-52 bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-hairline-light dark:border-hairline-dark z-50 p-1 space-y-0.5 overflow-hidden"
                    >
                      <button
                        onClick={() => { navigate('/profile'); setIsDropdownOpen(false); }}
                        className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-colors duration-150 text-left cursor-pointer"
                      >
                        <div className="w-7 h-7 rounded-md bg-ink-soft dark:bg-surface-dark-elevated flex items-center justify-center flex-shrink-0 text-body dark:text-on-dark-soft">
                          <Settings className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-semibold text-ink-heading dark:text-on-dark">
                          Pengaturan Profil
                        </span>
                      </button>

                      <div className="my-1 border-t border-hairline-light dark:border-hairline-dark" />

                      <button
                        onClick={handleLogout}
                        data-logout-trigger
                        className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg hover:bg-error-soft dark:hover:bg-surface-dark-elevated transition-colors duration-150 text-left cursor-pointer"
                      >
                        <div className="w-7 h-7 rounded-md bg-error-soft dark:bg-surface-dark-elevated flex items-center justify-center flex-shrink-0 text-error dark:text-error-on-dark">
                          <LogOut className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-semibold text-error dark:text-error-on-dark">
                          Keluar Sistem
                        </span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
        </div>
      </div>
    </header>
  );
}