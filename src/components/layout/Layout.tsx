import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  FileText, CheckSquare, Users, 
  RefreshCw, FolderOpen, Beaker, Award, BookOpen, Book,
  ClipboardList, FileSignature, Activity,
  ShieldCheck, PlusCircle, ShieldAlert, HelpCircle
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

  const handleLogout = async () => {
    try {
      if (user?.id) {
        await fetch('/api/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.id })
        });
      }
    } catch (error) {
      console.error('Logout logging failed', error);
    }
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
      name: 'Dashboard Poin', 
      path: '/lecturer-dashboard', 
      icon: Activity, 
      roles: ['dosen'] 
    },
    { 
      name: 'Publikasi', 
      path: '/publication', 
      icon: FileText, 
      roles: ['dosen'],
      children: [
        { name: 'Jurnal Internasional', path: '/publication?kategori=Jurnal Internasional', icon: FileText, categoryFilter: 'Jurnal Internasional' },
        { name: 'Jurnal Nasional', path: '/publication?kategori=Jurnal Nasional', icon: FileText, categoryFilter: 'Jurnal Nasional' },
      ]
    },
    { 
      name: 'Penelitian', 
      path: '/research', 
      icon: Beaker, 
      roles: ['dosen'] 
    },
    { 
      name: 'HKI', 
      path: '/hki', 
      icon: Award, 
      roles: ['dosen'] 
    },
    { 
      name: 'Buku', 
      path: '/buku', 
      icon: Book, 
      roles: ['dosen'] 
    },
    // === ADMIN / PRODI ===
    { name: 'Semua Dokumen', path: '/admin/documents/all', icon: FolderOpen, roles: ['admin penelitian', 'admin fakultas'] },
    { 
      name: 'Verifikasi', 
      path: '/admin/verify', 
      icon: CheckSquare, 
      roles: ['admin penelitian', 'admin fakultas'] 
    },
    { 
      name: 'Dosen Mandiri', 
      path: '/admin/input-document', 
      icon: PlusCircle, 
      roles: ['admin penelitian', 'admin fakultas'] 
    },
    { name: 'Daftar Dosen', path: '/admin/lecturers', icon: Users, roles: ['admin penelitian', 'admin fakultas'] },
    { name: 'Sinkronisasi', path: '/admin/sync', icon: RefreshCw, roles: ['admin penelitian'] },
    { name: 'Log Aktivitas', path: '/admin/activity-logs', icon: Activity, roles: ['admin penelitian', 'admin fakultas'] },
    // === SYSTEM / CMS & HELP ===
    { 
      name: 'Panel CMS', 
      path: '/admin/cms', 
      icon: ShieldAlert, 
      roles: ['super admin'] 
    },
    { 
      name: 'Panduan & Bantuan', 
      path: '/help', 
      icon: HelpCircle, 
      roles: ['dosen', 'admin penelitian', 'admin fakultas', 'super admin', 'staf', 'reviewer'] 
    },
  ];

  // Cari nama halaman aktif (termasuk children)
  // Cari nama halaman aktif (termasuk children)
  const currentPage = (() => {
    // Custom route matching for non-sidebar pages
    if (location.pathname === '/profile') {
      return { name: 'Profil Diri' };
    }
    if (location.pathname.startsWith('/admin/lecturers/')) {
      return { name: 'Detail Performa Dosen' };
    }

    // 1. Cari yang paling spesifik (cocok pathname + query search)
    for (const item of navItems) {
      if (item.children) {
        for (const child of item.children) {
          const childPathBase = child.path.split('?')[0];
          const childSearch = child.path.includes('?') ? '?' + child.path.split('?')[1] : '';
          if (location.pathname === childPathBase && decodeURIComponent(location.search) === decodeURIComponent(childSearch)) {
            return child;
          }
        }
      } else {
        const itemPathBase = item.path.split('?')[0];
        const itemSearch = item.path.includes('?') ? '?' + item.path.split('?')[1] : '';
        if (location.pathname === itemPathBase && decodeURIComponent(location.search) === decodeURIComponent(itemSearch)) {
          return item;
        }
      }
    }
    // 2. Fallback matching base pathname jika tidak ketemu query yang persis
    for (const item of navItems) {
      if (item.children) {
        for (const child of item.children) {
          const childPathBase = child.path.split('?')[0];
          if (location.pathname === childPathBase) return child;
        }
        if (item.path.split('?')[0] === location.pathname) return item;
      } else {
        if (item.path.split('?')[0] === location.pathname) return item;
      }
    }
    return null;
  })();

  const isLecturerPage = [
    '/lecturer-dashboard',
    '/publication',
    '/hki',
    '/research',
    '/buku'
  ].some(path => location.pathname === path || location.pathname.startsWith(path + '/'));

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
        className="flex-1 flex flex-col min-h-screen min-w-0 relative"
      >
        <Topbar 
          isMobile={isMobile}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          currentPageName={currentPage?.name}
          isDark={isDark}
          setIsDark={setIsDark}
          user={user}
          handleLogout={handleLogout}
          hideLiveBadge={isLecturerPage}
        />

        <div className="p-4 sm:p-6 lg:p-10 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
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
