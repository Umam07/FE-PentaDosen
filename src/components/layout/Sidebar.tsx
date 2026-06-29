import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Hexagon, PanelLeftOpen, PanelLeftClose, X, ChevronDown } from 'lucide-react';

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
      className="bg-white dark:bg-zinc-900 border-r border-gray-100 dark:border-zinc-800 flex flex-col fixed top-0 left-0 h-screen z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] overflow-hidden lg:z-30"
    >
      {/* Brand & Toggle Button */}
      <div className="h-20 lg:h-24 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-3 group overflow-hidden whitespace-nowrap">
          <div className="p-2.5 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl shadow-lg shadow-primary-200 flex-shrink-0">
            <Hexagon className="w-6 h-6 text-white fill-white/20" />
          </div>
          {showLabels && (
            <motion.h1 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-black text-gray-900 dark:text-zinc-100 tracking-tighter uppercase"
            >
              Penta<span className="text-primary-600">Dosen</span>
            </motion.h1>
          )}
        </div>
        
        {!isMobile ? (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`p-2 rounded-xl transition-all duration-300 hover:bg-primary-50 dark:hover:bg-zinc-800 text-gray-400 dark:text-zinc-500 hover:text-primary-600 flex-shrink-0 ${isCollapsed ? 'mx-auto' : ''}`}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-6 h-6 animate-pulse" />
            ) : (
              <PanelLeftClose className="w-6 h-6" />
            )}
          </button>
        ) : (
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 text-gray-400">
             <X className="w-6 h-6" />
          </button>
        )}
      </div>
      
      {/* Nav Area */}
      <div className={`mb-4 flex-1 overflow-y-auto overflow-x-hidden ${isCollapsed && !isMobile ? 'px-2' : 'px-4'}`}>
        <div className={`bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100/50 dark:border-zinc-700 ${isCollapsed && !isMobile ? 'p-1' : 'p-2'}`}>
          {showLabels && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest ml-3 mb-3"
            >
              Main Menu
            </motion.p>
          )}
          <nav className="space-y-1.5 font-bold">
            {navItems.filter(item => item.roles.includes(user.role) && !item.hidden).map((item) => {
              const Icon = item.icon;
              const hasChildren = !!(item.children && item.children.length > 0);
              const isOpen = openGroups[item.name];
              const parentActive = isParentActive(item);

              // === ITEM WITH CHILDREN (dropdown group) ===
              if (hasChildren) {
                return (
                  <div key={item.name}>
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
                      className={`group relative w-full flex items-center text-sm rounded-xl transition-all duration-300 ${
                        parentActive
                          ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                          : 'text-gray-500 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800 hover:text-primary-600 hover:shadow-md border border-transparent hover:border-gray-100 dark:hover:border-zinc-700'
                      } ${isCollapsed && !isMobile ? 'justify-center p-0 h-10 w-10 mx-auto' : 'px-4 py-3'}`}
                    >
                      <Icon className={`h-5 w-5 flex-shrink-0 transition-all duration-300 ${isCollapsed && !isMobile ? '' : 'mr-3'} ${parentActive ? 'text-white' : 'text-gray-400 group-hover:text-primary-600 group-hover:scale-110'}`} />
                      
                      {showLabels ? (
                        <>
                          <motion.span 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="whitespace-nowrap flex-1 text-left"
                          >
                            {item.name}
                          </motion.span>
                          <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.25 }}
                            className="flex-shrink-0 ml-1"
                          >
                            <ChevronDown className={`w-3.5 h-3.5 ${parentActive ? 'text-white/70' : 'text-gray-400 group-hover:text-primary-500'}`} />
                          </motion.div>
                        </>
                      ) : (
                        // Tooltip when collapsed
                        <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-[10px] font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl pointer-events-none">
                          {item.name}
                          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
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
                          <div className="mt-1 ml-3 pl-3 border-l-2 border-gray-100 dark:border-zinc-700 space-y-1 pb-1">
                            {item.children!.map((child) => {
                              const ChildIcon = child.icon;
                              const childActive = isChildActive(child);
                              return (
                                <button
                                  key={child.name}
                                  onClick={() => handleChildClick(child)}
                                  className={`group w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-wide transition-all duration-200 ${
                                    childActive
                                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                                      : 'text-gray-400 dark:text-zinc-500 hover:bg-white dark:hover:bg-zinc-800 hover:text-primary-600 dark:hover:text-primary-400 hover:shadow-sm'
                                  }`}
                                >
                                  <ChildIcon className={`h-3.5 w-3.5 flex-shrink-0 transition-transform group-hover:scale-110 ${childActive ? 'text-primary-600 dark:text-primary-400' : ''}`} />
                                  <span className="truncate">{child.name}</span>
                                  {child.points !== undefined && (
                                    <div className={`ml-auto px-1.5 py-0.5 rounded text-[8px] font-black tracking-widest flex-shrink-0 ${childActive ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400' : 'bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-zinc-400 group-hover:bg-primary-50 group-hover:text-primary-600'}`}>
                                      +{child.points} PTS
                                    </div>
                                  )}
                                  {childActive && child.points === undefined && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
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
                  className={`group relative flex items-center text-sm rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                      : 'text-gray-500 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800 hover:text-primary-600 hover:shadow-md border border-transparent hover:border-gray-100 dark:hover:border-zinc-700'
                  } ${isCollapsed && !isMobile ? 'justify-center p-0 h-10 w-10 mx-auto' : 'px-4 py-3'}`}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 transition-all duration-300 ${isCollapsed && !isMobile ? '' : 'mr-3'} ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary-600 group-hover:scale-110'}`} />
                  {showLabels ? (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  ) : (
                    <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-[10px] font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl pointer-events-none">
                      {item.name}
                      <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
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
