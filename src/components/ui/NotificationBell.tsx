import { useState, useEffect, useRef, useCallback, ElementType, MouseEvent as ReactMouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Bell, CheckCheck, Trash2, X,
  CheckCircle, XCircle, Clock, ShieldCheck,
  FileText, Beaker, RefreshCw
} from 'lucide-react';

interface NotificationItem {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  data: Record<string, any> | null;
  created_at: string;
}

interface NotificationBellProps {
  userId: number | string | undefined;
}

// ─── Styling helpers ────────────────────────────────────────────────────────
const typeConfig: Record<string, {
  icon: ElementType;
  iconColor: string;
  bg: string;
  dot: string;
}> = {
  doc_approved:          { icon: CheckCircle,  iconColor: 'text-emerald-500', bg: 'bg-emerald-500/10', dot: 'bg-emerald-500' },
  penelitian_approved:   { icon: CheckCircle,  iconColor: 'text-emerald-500', bg: 'bg-emerald-500/10', dot: 'bg-emerald-500' },
  doc_rejected:          { icon: XCircle,      iconColor: 'text-red-500',     bg: 'bg-red-500/10',     dot: 'bg-red-500'     },
  penelitian_rejected:   { icon: XCircle,      iconColor: 'text-red-500',     bg: 'bg-red-500/10',     dot: 'bg-red-500'     },
  doc_verified_prodi:    { icon: ShieldCheck,  iconColor: 'text-blue-500',    bg: 'bg-blue-500/10',    dot: 'bg-blue-500'    },
  penelitian_verified_prodi: { icon: ShieldCheck, iconColor: 'text-blue-500', bg: 'bg-blue-500/10',   dot: 'bg-blue-500'    },
  doc_pending_lppm:      { icon: Clock,        iconColor: 'text-amber-500',   bg: 'bg-amber-500/10',   dot: 'bg-amber-500'   },
  penelitian_pending_lppm: { icon: Clock,      iconColor: 'text-amber-500',   bg: 'bg-amber-500/10',   dot: 'bg-amber-500'   },
  doc_submitted:         { icon: FileText,     iconColor: 'text-indigo-500',  bg: 'bg-indigo-500/10',  dot: 'bg-indigo-500'  },
  penelitian_submitted:  { icon: Beaker,       iconColor: 'text-violet-500',  bg: 'bg-violet-500/10',  dot: 'bg-violet-500'  },
};

const getTypeConfig = (type: string) =>
  typeConfig[type] ?? { icon: Bell, iconColor: 'text-gray-500', bg: 'bg-gray-500/10', dot: 'bg-gray-400' };

function timeAgo(dateStr: string): string {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return 'Baru saja';
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function NotificationBell({ userId }: NotificationBellProps) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bellAnim, setBellAnim] = useState(false);

  const bellRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const prevUnread = useRef(0);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/notifications/${userId}`);
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications || []);

      const newCount = data.unread_count ?? 0;
      if (newCount > prevUnread.current) {
        // Ring animation on new notification
        setBellAnim(true);
        setTimeout(() => setBellAnim(false), 1000);
      }
      prevUnread.current = newCount;
      setUnreadCount(newCount);
    } catch {
      // silently fail
    }
  }, [userId]);

  // Initial fetch + polling every 30 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        bellRef.current && !bellRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Actions ────────────────────────────────────────────────────────────────
  const markRead = async (id: number) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    );
    setUnreadCount(c => Math.max(0, c - 1));
    await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
  };

  const markAllRead = async () => {
    if (!userId) return;
    setLoading(true);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
    await fetch(`/api/notifications/${userId}/read-all`, { method: 'POST' });
    setLoading(false);
  };

  const deleteNotif = async (id: number, e: ReactMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
    setUnreadCount(c => {
      const notif = notifications.find(n => n.id === id);
      return notif && !notif.is_read ? Math.max(0, c - 1) : c;
    });
    await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
  };

  const clearAll = async () => {
    if (!userId) return;
    setNotifications([]);
    setUnreadCount(0);
    await fetch(`/api/notifications/${userId}/clear-all`, { method: 'DELETE' });
  };

  const handleBellClick = () => {
    setIsOpen(prev => !prev);
  };

  const handleNotifClick = async (notif: NotificationItem) => {
    if (!notif.is_read) {
      await markRead(notif.id);
    }

    // Get current user information from sessionStorage to check role
    const storedUserStr = sessionStorage.getItem('pentadosen_user');
    let currentUser: any = null;
    if (storedUserStr) {
      try {
        currentUser = JSON.parse(storedUserStr);
      } catch (e) {
        console.error('Failed to parse user from sessionStorage', e);
      }
    }

    if (!currentUser) {
      setIsOpen(false);
      return;
    }

    const isDosen = currentUser.role === 'dosen';
    const isAdmin = currentUser.role === 'admin lppm' || currentUser.role === 'admin fakultas';
    const isSuperAdmin = currentUser.role === 'super admin';

    // 1. Check if it's a research (penelitian) notification
    const isResearch =
      notif.type.includes('penelitian') ||
      notif.message.toLowerCase().includes('penelitian') ||
      notif.title.toLowerCase().includes('penelitian') ||
      !!notif.data?.penelitian_id;

    if (isResearch) {
      if (isAdmin) {
        navigate('/admin/verify?tab=penelitian');
      } else if (isDosen) {
        navigate('/research');
      }
      setIsOpen(false);
      return;
    }

    // 2. Otherwise, it is a document-related notification (Publication, Buku, HKI)
    const docId = notif.data?.doc_id;
    let category = '';

    // Quick check based on message/title content as a primary filter or fallback
    const messageLower = notif.message.toLowerCase();
    const titleLower = notif.title.toLowerCase();

    if (messageLower.includes('buku') || titleLower.includes('buku')) {
      category = 'Buku';
    } else if (messageLower.includes('hki') || titleLower.includes('hki')) {
      category = 'HKI';
    }

    // If we have a docId, query the actual document to find its exact category
    if (docId) {
      try {
        if (isDosen) {
          const res = await fetch(`/api/users/${currentUser.id}/documents`);
          if (res.ok) {
            const data = await res.json();
            const doc = data.documents?.find((d: any) => d.id === docId);
            if (doc) {
              category = doc.category;
            }
          }
        } else if (isAdmin) {
          const res = await fetch(`/api/admin/documents?role=${currentUser.role}&user_id=${currentUser.id}`);
          if (res.ok) {
            const data = await res.json();
            const doc = data.documents?.find((d: any) => d.id === docId);
            if (doc) {
              category = doc.category;
            }
          }
        }
      } catch (err) {
        console.error('Error fetching document category for redirection:', err);
      }
    }

    // 3. Route based on the category and role
    const categoryLower = (category || '').toLowerCase();

    if (isAdmin) {
      if (categoryLower.includes('buku')) {
        navigate('/admin/verify?tab=buku');
      } else if (categoryLower.includes('hki')) {
        navigate('/admin/verify?tab=hki');
      } else {
        navigate('/admin/verify?tab=publikasi');
      }
    } else if (isDosen) {
      if (categoryLower.includes('buku')) {
        navigate(category ? `/buku?kategori=${encodeURIComponent(category)}` : '/buku');
      } else if (categoryLower.includes('hki')) {
        navigate('/hki');
      } else {
        navigate(category ? `/publication?kategori=${encodeURIComponent(category)}` : '/publication');
      }
    } else if (isSuperAdmin) {
      navigate('/admin/cms');
    }

    setIsOpen(false);
  };

  // ── Dropdown position (relative to bell button) ───────────────────────────
  const [dropPos, setDropPos] = useState({ top: 0, right: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      if (bellRef.current) {
        const rect = bellRef.current.getBoundingClientRect();
        setDropPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Bell Button */}
      <button
        ref={bellRef}
        id="notification-bell-btn"
        onClick={handleBellClick}
        className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 dark:bg-zinc-800 hover:bg-primary-50 dark:hover:bg-zinc-700 border border-gray-100 dark:border-zinc-700 text-gray-500 hover:text-primary-600 transition-all duration-200 flex-shrink-0"
        aria-label="Notifikasi"
      >
        <motion.div
          animate={bellAnim ? { rotate: [0, -15, 15, -10, 10, -5, 5, 0] } : { rotate: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        >
          <Bell className="w-[18px] h-[18px]" />
        </motion.div>

        {/* Unread Badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 text-white text-[9px] font-black rounded-full shadow-md shadow-red-500/30 leading-none"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Dropdown Portal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                top: dropPos.top,
                left: isMobile ? '16px' : 'auto',
                right: isMobile ? '16px' : dropPos.right,
                zIndex: 9998
              }}
              className="w-auto sm:w-[400px] bg-white dark:bg-zinc-900 rounded-[1.75rem] shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary-500/10 flex items-center justify-center">
                    <Bell className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-900 dark:text-zinc-100 uppercase tracking-widest">Notifikasi</p>
                    {unreadCount > 0 && (
                      <p className="text-[9px] font-bold text-primary-500 uppercase tracking-widest">
                        {unreadCount} belum dibaca
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* Refresh */}
                  <button
                    onClick={() => { setLoading(true); fetchNotifications().finally(() => setLoading(false)); }}
                    className="p-2 rounded-xl text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-zinc-800 transition-all"
                    title="Refresh"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                  {/* Mark all read */}
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="p-2 rounded-xl text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-zinc-800 transition-all"
                      title="Tandai semua dibaca"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {/* Clear all */}
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-zinc-800 transition-all"
                      title="Hapus semua"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {/* Close */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* List */}
              <div className="overflow-y-auto max-h-[min(420px,calc(100vh-150px))] custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center mb-4">
                      <Bell className="w-7 h-7 text-gray-300 dark:text-zinc-600" />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
                      Tidak ada notifikasi
                    </p>
                    <p className="text-[9px] font-bold text-gray-300 dark:text-zinc-600 mt-1">
                      Notifikasi baru akan muncul di sini
                    </p>
                  </div>
                ) : (
                  <div className="p-2">
                    {notifications.map((notif) => {
                      const cfg = getTypeConfig(notif.type);
                      const Icon = cfg.icon;
                      return (
                        <motion.div
                          key={notif.id}
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          onClick={() => handleNotifClick(notif)}
                          className={`group relative flex items-start gap-3 p-3.5 rounded-2xl mb-1 cursor-pointer transition-all duration-200 ${
                            notif.is_read
                              ? 'hover:bg-gray-50 dark:hover:bg-zinc-800/60'
                              : 'bg-primary-50/60 dark:bg-zinc-800 hover:bg-primary-50 dark:hover:bg-zinc-700/60'
                          }`}
                        >
                          {/* Unread dot */}
                          {!notif.is_read && (
                            <span className={`absolute top-4 right-3.5 w-2 h-2 rounded-full ${cfg.dot} shadow-sm`} />
                          )}

                          {/* Icon */}
                          <div className={`w-9 h-9 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <Icon className={`w-4 h-4 ${cfg.iconColor}`} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0 pr-4">
                            <p className={`text-[10px] font-black uppercase tracking-widest leading-none mb-1 ${
                              notif.is_read ? 'text-gray-500 dark:text-zinc-400' : 'text-gray-900 dark:text-zinc-100'
                            }`}>
                              {notif.title}
                            </p>
                            <p className="text-[10px] font-semibold text-gray-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
                              {notif.message}
                            </p>
                            <p className="text-[9px] font-bold text-gray-300 dark:text-zinc-600 uppercase tracking-widest mt-1.5">
                              {timeAgo(notif.created_at)}
                            </p>
                          </div>

                          {/* Delete button (visible on hover) */}
                          <button
                            onClick={(e) => deleteNotif(notif.id, e)}
                            className="absolute top-3 right-3 p-1 rounded-lg opacity-100 sm:opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="border-t border-gray-100 dark:border-zinc-800 px-4 py-3">
                  <p className="text-[9px] font-black text-center text-gray-300 dark:text-zinc-600 uppercase tracking-[0.2em]">
                    Pembaruan setiap 30 detik • PentaDosen
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
