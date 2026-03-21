import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, CheckSquare, Users, 
  RefreshCw, FolderOpen 
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

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['dosen', 'admin', 'pimpinan'] },
    { name: 'Dokumen', path: '/documents', icon: FileText, roles: ['dosen'] },
    { name: 'Semua Dokumen', path: '/admin/documents/all', icon: FolderOpen, roles: ['admin'] },
    { name: 'Verifikasi', path: '/admin/verify', icon: CheckSquare, roles: ['admin'] },
    { name: 'Daftar Dosen', path: '/admin/lecturers', icon: Users, roles: ['admin'] },
    { name: 'Sinkronisasi', path: '/admin/sync', icon: RefreshCw, roles: ['admin'] },
  ];

  const currentPage = navItems.find(item => item.path === location.pathname);

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
              key={location.pathname}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet context={{ isCollapsed }} />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  );
}
