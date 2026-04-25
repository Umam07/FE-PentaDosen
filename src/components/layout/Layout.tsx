import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  FileText, CheckSquare, Users, 
  RefreshCw, FolderOpen, Beaker, Award, BookOpen,
  ClipboardList, FileSignature, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function Layout({ user, setUser }: { user: any, setUser: any }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
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
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  if (!user) {
    return <Outlet />;
  }

  // Nav items dengan children untuk dropdown
  const navItems = [
    // === DOSEN ===
    { 
      name: 'Publikasi', 
      path: '/publication', 
      icon: FileText, 
      roles: ['dosen'],
      children: [
        { name: 'Jurnal Internasional', path: '/publication?kategori=Jurnal Internasional', icon: BookOpen, categoryFilter: 'Jurnal Internasional', points: 40 },
        { name: 'Jurnal Nasional', path: '/publication?kategori=Jurnal Nasional', icon: BookOpen, categoryFilter: 'Jurnal Nasional', points: 20 },
      ]
    },
    { 
      name: 'HKI', 
      path: '/publication?kategori=HKI', 
      icon: Award, 
      roles: ['dosen'] 
    },
    { 
      name: 'Hasil Penelitian', 
      path: '/research', 
      icon: Beaker, 
      roles: ['dosen'] 
    },
    // === ADMIN / PRODI ===
    { name: 'Semua Dokumen', path: '/admin/documents/all', icon: FolderOpen, roles: ['admin lppm', 'admin prodi'] },
    { name: 'Verifikasi', path: '/admin/verify', icon: CheckSquare, roles: ['admin lppm', 'admin prodi'] },
    { name: 'Daftar Dosen', path: '/admin/lecturers', icon: Users, roles: ['admin lppm', 'admin prodi'] },
    { name: 'Sinkronisasi', path: '/admin/sync', icon: RefreshCw, roles: ['admin lppm', 'admin prodi'] },
    { name: 'Log Aktivitas', path: '/admin/activity-logs', icon: Activity, roles: ['admin lppm'] },
    // === HIDDEN (selalu di-hidden dari nav) ===
    { name: 'Profil Saya', path: '/profile', icon: Users, roles: ['admin lppm', 'admin prodi', 'dosen'], hidden: true },
  ];

  // Cari nama halaman aktif (termasuk children)
  const currentPage = (() => {
    for (const item of navItems) {
      if (item.children) {
        for (const child of item.children) {
          // Match by exact path atau child path tanpa query
          const childPathBase = child.path.split('?')[0];
          if (location.pathname === childPathBase) return child;
        }
        // Fallback ke parent (misal /documents tanpa query)
        if (item.path.split('?')[0] === location.pathname) return item;
      } else {
        if (item.path === location.pathname) return item;
      }
    }
    return null;
  })();

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-zinc-950 flex font-sans selection:bg-primary-100 selection:text-primary-900 overflow-x-hidden text-gray-900 dark:text-zinc-100">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <Sidebar 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobile={isMobile}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        user={user}
        navItems={navItems}
        currentPath={location.pathname}
        currentSearch={location.search}
      />

      {/* Main Content */}
      <motion.main 
        animate={{ marginLeft: isMobile ? 0 : (isCollapsed ? 88 : 288) }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="flex-1 flex flex-col min-h-screen w-full relative"
      >
        <Topbar 
          isMobile={isMobile}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          currentPageName={currentPage?.name}
          isDark={isDark}
          setIsDark={setIsDark}
          user={user}
          handleLogout={handleLogout}
        />

        <div className="p-4 sm:p-6 lg:p-10 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname + location.search}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet context={{ isCollapsed, user }} />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  );
}
