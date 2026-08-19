import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { PanelLeftOpen, PanelLeftClose, X, ChevronDown } from 'lucide-react';
import PentaDosenLogo from '../ui/PentaDosenLogo';

interface NavChild {
  name: string;
  path: string;
  icon: any;
  categoryFilter?: string;
  points?: number;
}

interface NavItem {
  name: string;
  path: string;
  icon: any;
  roles: string[];
  hidden?: boolean;
  children?: NavChild[];
}

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isMobile: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (value: boolean) => void;
  user: any;
  navItems: NavItem[];
  currentPath: string;
  currentSearch?: string;
}

const sidebarVariants = {
  expanded: { width: 288 },
  collapsed: { width: 88 },
  mobileOpen: { x: 0, width: 288 },
  mobileClosed: { x: -300 }
};

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  isMobile,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  user,
  navItems,
  currentPath,
  currentSearch = '',
}: SidebarProps) {
  const navigate = useNavigate();

  // Track which parent items are "open" (expanded dropdown)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  // Auto-open group if current path belongs to a child
  useEffect(() => {
    const currentFullPath = currentPath + currentSearch;
    navItems.forEach(item => {
      if (item.children) {
        const hasActiveChild = item.children.some(child => {
          const childPathBase = child.path.split('?')[0];
          const childSearch = child.path.includes('?') ? '?' + child.path.split('?')[1] : '';
          return currentPath === childPathBase && currentSearch === childSearch;
        });
        // Also open if parent path matches
        const parentActive = currentPath === item.path.split('?')[0];
        if (hasActiveChild || parentActive) {
          setOpenGroups(prev => ({ ...prev, [item.name]: true }));
        }
      }
    });
  }, [currentPath, currentSearch]);

  const toggleGroup = (name: string) => {
    setOpenGroups(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const isChildActive = (child: NavChild) => {
    const childPathBase = child.path.split('?')[0];
    const childSearch = child.path.includes('?') ? '?' + child.path.split('?')[1] : '';
    return currentPath === childPathBase && currentSearch === childSearch;
  };

  const isParentActive = (item: NavItem) => {
    // Active if current path matches parent, or any child is active
    if (item.children) {
      return item.children.some(child => isChildActive(child));
    }
    return currentPath === item.path;
  };

  const handleChildClick = (child: NavChild) => {
    if (isMobile) setIsMobileMenuOpen(false);
    navigate(child.path);
  };

  const showLabels = !isCollapsed || isMobile;

  return (
    <motion.aside 
      initial={isMobile ? "mobileClosed" : "expanded"}
      animate={isMobile ? (isMobileMenuOpen ? "mobileOpen" : "mobileClosed") : (isCollapsed ? "collapsed" : "expanded")}
      variants={sidebarVariants}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className={`bg-surface-light dark:bg-surface-dark border-r border-hairline-light dark:border-hairline-dark flex flex-col fixed top-0 left-0 h-screen z-50 shadow-sm lg:z-30 ${isCollapsed && !isMobile ? 'overflow-visible' : 'overflow-hidden'}`}
    >
      {/* Brand & Toggle Button */}
      <div className={`h-16 lg:h-20 flex items-center flex-shrink-0 transition-all duration-300 ${isCollapsed && !isMobile ? 'justify-center px-2' : 'justify-between px-3.5 sm:px-4'}`}>
        {!isCollapsed || isMobile ? (
          <>
            <Link to="/dashboard" className="flex items-center gap-2.5 group whitespace-nowrap min-w-0" aria-label="Dashboard PentaDosen">
              <img 
                src="/YARSI-KOTAK-e1739161183276.png" 
                alt="Universitas YARSI" 
                className="h-7 lg:h-8 w-auto object-contain flex-shrink-0"
              />
              <div className="h-6 w-[1px] bg-hairline-light dark:bg-hairline-dark flex-shrink-0" />
              <div className="flex items-center gap-2 min-w-0">
                <PentaDosenLogo className="w-7 h-7 lg:w-8 lg:h-8 flex-shrink-0" />
                <motion.h1 
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-base lg:text-[17px] font-bold text-ink-heading dark:text-on-dark tracking-tight uppercase"
                >
                  Penta<span className="text-accent dark:text-accent-on-dark">Dosen</span>
                </motion.h1>
              </div>
            </Link>
            
            {!isMobile ? (
              <button
                onClick={() => setIsCollapsed(true)}
                aria-label="Collapse sidebar"
                title="Kecilkan Sidebar"
                className="p-1.5 rounded-lg transition-colors duration-200 hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated text-muted dark:text-on-dark-muted hover:text-ink-heading dark:hover:text-on-dark flex-shrink-0"
              >
                <PanelLeftClose className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-muted hover:text-ink-heading dark:hover:text-on-dark lg:hidden flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </>
        ) : (
          /* Ultra-clean Collapsed Header: Only single centered toggle button */
          <button
            onClick={() => setIsCollapsed(false)}
            aria-label="Expand sidebar"
            title="Perluas Sidebar"
            className="p-2 rounded-lg transition-colors duration-200 hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated text-muted dark:text-on-dark-muted hover:text-ink-heading dark:hover:text-on-dark flex-shrink-0 mx-auto"
          >
            <PanelLeftOpen className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {/* Nav Area */}
      <div className={`mb-4 flex-1 overflow-y-auto ${isCollapsed && !isMobile ? 'overflow-x-visible px-2' : 'overflow-x-hidden px-4'}`}>
        <div className={`bg-canvas-light dark:bg-surface-dark-soft rounded-2xl border border-hairline-light dark:border-hairline-dark ${isCollapsed && !isMobile ? 'p-1 overflow-visible' : 'p-2'}`}>
          {showLabels && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[11px] font-semibold text-muted dark:text-on-dark-muted uppercase tracking-[1.2px] ml-3 mb-2.5"
            >
              Main Menu
            </motion.p>
          )}
          <nav className="space-y-1.5 font-semibold text-sm font-sans">
            {navItems.filter(item => item.roles.includes(user.role) && !item.hidden).map((item) => {
              const Icon = item.icon;
              const hasChildren = !!(item.children && item.children.length > 0);
              const isOpen = openGroups[item.name];
              const parentActive = isParentActive(item);

              // === ITEM WITH CHILDREN (dropdown group) ===
              if (hasChildren) {
                return (
                  <div key={item.name} className="relative">
                    {/* Parent Button */}
                    <button
                      onClick={() => {
                        if (isCollapsed && !isMobile) {
                          // When collapsed, expand sidebar first then open group
                          setIsCollapsed(false);
                          setOpenGroups(prev => ({ ...prev, [item.name]: true }));
                        } else {
                          toggleGroup(item.name);
                        }
                      }}
                      className={`group relative w-full flex items-center text-sm rounded-lg transition-all duration-200 ${
                        parentActive
                          ? 'bg-ink text-on-ink dark:bg-surface-dark-elevated dark:text-on-dark border-l-2 border-accent dark:border-accent-on-dark'
                          : 'text-body dark:text-on-dark-soft hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated hover:text-ink-heading dark:hover:text-on-dark border border-transparent'
                      } ${isCollapsed && !isMobile ? 'justify-center p-0 h-10 w-10 mx-auto' : 'px-4 py-3'}`}
                    >
                      <Icon className={`h-5 w-5 flex-shrink-0 transition-all duration-200 ${isCollapsed && !isMobile ? '' : 'mr-3'} ${parentActive ? 'text-on-ink dark:text-on-dark' : 'text-muted group-hover:text-ink-heading dark:text-on-dark-muted dark:group-hover:text-on-dark'}`} />
                      
                      {showLabels ? (
                        <>
                          <motion.span 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="whitespace-nowrap flex-1 text-left font-semibold"
                          >
                            {item.name}
                          </motion.span>
                          <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.25 }}
                            className="flex-shrink-0 ml-1"
                          >
                            <ChevronDown className={`w-3.5 h-3.5 ${parentActive ? 'text-on-ink/70 dark:text-on-dark/70' : 'text-muted group-hover:text-ink-heading dark:text-on-dark-muted dark:group-hover:text-on-dark'}`} />
                          </motion.div>
                        </>
                      ) : (
                        // Modern Tooltip when collapsed
                        <div className="absolute left-full ml-3.5 px-3 py-1.5 bg-ink dark:bg-surface-dark-elevated text-on-ink dark:text-on-dark text-xs font-semibold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible -translate-x-1 group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap z-[100] shadow-md pointer-events-none border border-hairline-light dark:border-hairline-dark flex items-center">
                          {item.name}
                          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-ink dark:bg-surface-dark-elevated rotate-45" />
                        </div>
                      )}
                    </button>

                    {/* Children (only show when expanded) */}
                    <AnimatePresence initial={false}>
                      {isOpen && showLabels && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="mt-1 ml-3 pl-3 border-l-2 border-hairline-light dark:border-hairline-dark space-y-1 pb-1">
                            {item.children!.map((child) => {
                              const ChildIcon = child.icon;
                              const childActive = isChildActive(child);
                              return (
                                <button
                                  key={child.name}
                                  onClick={() => handleChildClick(child)}
                                  className={`group w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all duration-200 ${
                                    childActive
                                      ? 'bg-surface-light-raised dark:bg-surface-dark-elevated text-ink-heading dark:text-on-dark font-semibold'
                                      : 'text-muted dark:text-on-dark-muted hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated hover:text-ink-heading dark:hover:text-on-dark'
                                  }`}
                                >
                                  <ChildIcon className={`h-3.5 w-3.5 flex-shrink-0 transition-colors ${childActive ? 'text-accent dark:text-accent-on-dark' : 'text-muted-soft dark:text-on-dark-muted group-hover:text-ink-heading dark:group-hover:text-on-dark'}`} />
                                  <span className="truncate">{child.name}</span>
                                  {child.points !== undefined && (
                                    <div className={`ml-auto px-1.5 py-0.5 rounded-md text-[9px] font-semibold font-mono tracking-wider flex-shrink-0 ${childActive ? 'bg-ink text-on-ink dark:bg-surface-dark dark:text-on-dark' : 'bg-surface-light-raised text-muted dark:bg-surface-dark dark:text-on-dark-muted group-hover:bg-ink-soft group-hover:text-ink-heading dark:group-hover:text-on-dark'}`}>
                                      +{child.points} PTS
                                    </div>
                                  )}
                                  {childActive && child.points === undefined && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent dark:bg-accent-on-dark flex-shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              // === PLAIN ITEM (no children) ===
              const itemPathBase = item.path.split('?')[0];
              const itemSearch = item.path.includes('?') ? '?' + item.path.split('?')[1] : '';
              const isActive = currentPath === itemPathBase && currentSearch === itemSearch;
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => isMobile && setIsMobileMenuOpen(false)}
                  className={`group relative flex items-center text-sm rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-ink text-on-ink dark:bg-surface-dark-elevated dark:text-on-dark border-l-2 border-accent dark:border-accent-on-dark'
                      : 'text-body dark:text-on-dark-soft hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated hover:text-ink-heading dark:hover:text-on-dark border border-transparent'
                  } ${isCollapsed && !isMobile ? 'justify-center p-0 h-10 w-10 mx-auto' : 'px-4 py-3'}`}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 transition-all duration-200 ${isCollapsed && !isMobile ? '' : 'mr-3'} ${isActive ? 'text-on-ink dark:text-on-dark' : 'text-muted group-hover:text-ink-heading dark:text-on-dark-muted dark:group-hover:text-on-dark'}`} />
                  {showLabels ? (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="whitespace-nowrap font-semibold"
                    >
                      {item.name}
                    </motion.span>
                  ) : (
                    // Modern Tooltip when collapsed
                    <div className="absolute left-full ml-3.5 px-3 py-1.5 bg-ink dark:bg-surface-dark-elevated text-on-ink dark:text-on-dark text-xs font-semibold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible -translate-x-1 group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap z-[100] shadow-md pointer-events-none border border-hairline-light dark:border-hairline-dark flex items-center">
                      {item.name}
                      <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-ink dark:bg-surface-dark-elevated rotate-45" />
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </motion.aside>
  );
}
