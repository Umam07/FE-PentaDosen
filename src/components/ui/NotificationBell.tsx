import { useState, useEffect, useRef, useCallback, ElementType, MouseEvent as ReactMouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Bell, CheckCheck, Trash2, X,
  CheckCircle, XCircle, Clock, ShieldCheck,
  FileText, Beaker, RefreshCw, Megaphone,
  BellOff
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
  label: string;
  labelColor: string;
  labelBg: string;
}> = {
  doc_approved:              { icon: CheckCircle,  iconColor: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/40',   dot: 'bg-emerald-500', label: 'Disetujui',     labelColor: 'text-emerald-700 dark:text-emerald-400', labelBg: 'bg-emerald-100 dark:bg-emerald-900/50'   },
  penelitian_approved:       { icon: CheckCircle,  iconColor: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/40',   dot: 'bg-emerald-500', label: 'Disetujui',     labelColor: 'text-emerald-700 dark:text-emerald-400', labelBg: 'bg-emerald-100 dark:bg-emerald-900/50'   },
  doc_rejected:              { icon: XCircle,      iconColor: 'text-red-600',     bg: 'bg-red-50 dark:bg-red-950/40',           dot: 'bg-red-500',     label: 'Ditolak',       labelColor: 'text-red-700 dark:text-red-400',         labelBg: 'bg-red-100 dark:bg-red-900/50'           },
  penelitian_rejected:       { icon: XCircle,      iconColor: 'text-red-600',     bg: 'bg-red-50 dark:bg-red-950/40',           dot: 'bg-red-500',     label: 'Ditolak',       labelColor: 'text-red-700 dark:text-red-400',         labelBg: 'bg-red-100 dark:bg-red-900/50'           },
  doc_verified_prodi:        { icon: ShieldCheck,  iconColor: 'text-blue-600',    bg: 'bg-blue-50 dark:bg-blue-950/40',         dot: 'bg-blue-500',    label: 'Terverifikasi', labelColor: 'text-blue-700 dark:text-blue-400',       labelBg: 'bg-blue-100 dark:bg-blue-900/50'         },
  penelitian_verified_prodi: { icon: ShieldCheck,  iconColor: 'text-blue-600',    bg: 'bg-blue-50 dark:bg-blue-950/40',         dot: 'bg-blue-500',    label: 'Terverifikasi', labelColor: 'text-blue-700 dark:text-blue-400',       labelBg: 'bg-blue-100 dark:bg-blue-900/50'         },
  doc_pending_lppm:          { icon: Clock,        iconColor: 'text-amber-600',   bg: 'bg-amber-50 dark:bg-amber-950/40',       dot: 'bg-amber-500',   label: 'Menunggu',      labelColor: 'text-amber-700 dark:text-amber-400',     labelBg: 'bg-amber-100 dark:bg-amber-900/50'       },
  penelitian_pending_lppm:   { icon: Clock,        iconColor: 'text-amber-600',   bg: 'bg-amber-50 dark:bg-amber-950/40',       dot: 'bg-amber-500',   label: 'Menunggu',      labelColor: 'text-amber-700 dark:text-amber-400',     labelBg: 'bg-amber-100 dark:bg-amber-900/50'       },
  doc_submitted:             { icon: FileText,     iconColor: 'text-indigo-600',  bg: 'bg-indigo-50 dark:bg-indigo-950/40',     dot: 'bg-indigo-500',  label: 'Dikirim',       labelColor: 'text-indigo-700 dark:text-indigo-400',   labelBg: 'bg-indigo-100 dark:bg-indigo-900/50'     },
  penelitian_submitted:      { icon: Beaker,       iconColor: 'text-violet-600',  bg: 'bg-violet-50 dark:bg-violet-950/40',     dot: 'bg-violet-500',  label: 'Dikirim',       labelColor: 'text-violet-700 dark:text-violet-400',   labelBg: 'bg-violet-100 dark:bg-violet-900/50'     },
  announcement:              { icon: Megaphone,    iconColor: 'text-primary-600', bg: 'bg-primary-50 dark:bg-primary-950/40',   dot: 'bg-primary-500', label: 'Pengumuman',    labelColor: 'text-primary-700 dark:text-primary-400', labelBg: 'bg-primary-100 dark:bg-primary-900/50'   },
};

const getTypeConfig = (type: string) =>
  typeConfig[type] ?? { icon: Bell, iconColor: 'text-gray-500', bg: 'bg-gray-50 dark:bg-zinc-800', dot: 'bg-gray-400', label: 'Info', labelColor: 'text-gray-600 dark:text-gray-400', labelBg: 'bg-gray-100 dark:bg-zinc-700' };

function timeAgo(dateStr: string): string {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return 'Baru saja';
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
}

// ─── Notification Card Sub-Component ────────────────────────────────────────
function NotificationCard({
  notif,
  onClick,
  onDelete,
}: {
  notif: NotificationItem;
  onClick: (n: NotificationItem) => void;
  onDelete: (id: number, e: ReactMouseEvent<HTMLButtonElement>) => void;
}) {
  const cfg = getTypeConfig(notif.type);
  const Icon = cfg.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 12, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      onClick={() => onClick(notif)}
      className={`group relative flex gap-3.5 p-4 rounded-2xl mb-1.5 cursor-pointer transition-all duration-200 ${
        notif.is_read
          ? 'bg-transparent hover:bg-gray-50/80 dark:hover:bg-zinc-800/50'
          : 'bg-white dark:bg-zinc-800/80 shadow-sm shadow-black/5 hover:shadow-md hover:shadow-black/8'
      }`}
    >
      {/* Unread indicator stripe */}
      {!notif.is_read && (
        <span className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-full ${cfg.dot}`} />
      )}

      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-[18px] h-[18px] ${cfg.iconColor}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-7">
        {/* Title */}
        <p className={`text-sm font-semibold leading-snug mb-1 ${
          notif.is_read
            ? 'text-gray-500 dark:text-zinc-400'
            : 'text-gray-900 dark:text-zinc-100'
        }`}>
          {notif.title}
        </p>

        {/* Message */}
        <p className={`text-xs leading-relaxed line-clamp-2 ${
          notif.is_read
            ? 'text-gray-400 dark:text-zinc-500'
            : 'text-gray-600 dark:text-zinc-300'
        }`}>
          {notif.message}
        </p>

        {/* Status badge + time */}
        <div className="flex items-center gap-2 mt-2">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide ${cfg.labelColor} ${cfg.labelBg}`}>
            {cfg.label}
          </span>
          <span className="text-[11px] text-gray-400 dark:text-zinc-500">
            {timeAgo(notif.created_at)}
          </span>
          {!notif.is_read && (
            <span className={`ml-auto w-2 h-2 rounded-full ${cfg.dot} flex-shrink-0`} />
          )}
        </div>
      </div>

      {/* Delete button (hover reveal) */}
      <button
        onClick={(e) => onDelete(notif.id, e)}
        className="absolute top-3.5 right-3.5 p-1 rounded-lg opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-150"
        title="Hapus notifikasi"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function NotificationBell({ userId }: NotificationBellProps) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bellAnim, setBellAnim] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

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

  const handleNotifClick = async (notif: NotificationItem) => {
    if (!notif.is_read) {
      await markRead(notif.id);
    }

    if (notif.type === 'announcement') {
      navigate('/help');
      setIsOpen(false);
      return;
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

  // ── Dropdown position ────────────────────────────────────────────────────────
  const [dropPos, setDropPos] = useState({ top: 0, right: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      if (bellRef.current) {
        const rect = bellRef.current.getBoundingClientRect();
        setDropPos({ top: rect.bottom + 10, right: window.innerWidth - rect.right });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  // ── Filtered list ─────────────────────────────────────────────────────────
  const displayed = activeTab === 'unread'
    ? notifications.filter(n => !n.is_read)
    : notifications;

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      {/* Bell Button */}
      <button
        ref={bellRef}
        id="notification-bell-btn"
        onClick={() => setIsOpen(prev => !prev)}
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
              className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full shadow-md shadow-red-500/30 leading-none"
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
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                top: dropPos.top,
                left: isMobile ? '12px' : 'auto',
                right: isMobile ? '12px' : dropPos.right,
                zIndex: 9998,
              }}
              className="w-auto sm:w-[420px] bg-gray-50/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/15 border border-gray-200/80 dark:border-zinc-700/60 overflow-hidden flex flex-col"
            >
              {/* ── Header ────────────────────────────────────────────────── */}
              <div className="px-5 pt-5 pb-4">
                <div className="flex items-start justify-between">
                  {/* Title + subtitle */}
                  <div>
                    <div className="flex items-center gap-2.5 mb-0.5">
                      <div className="w-7 h-7 rounded-lg bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
                        <Bell className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-zinc-100 tracking-tight">
                        Notifikasi
                      </h3>
                    </div>
                    {unreadCount > 0 ? (
                      <p className="text-xs text-gray-500 dark:text-zinc-400 ml-9">
                        <span className="font-semibold text-primary-600 dark:text-primary-400">{unreadCount}</span> belum dibaca
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400 dark:text-zinc-500 ml-9">Semua sudah dibaca</p>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setLoading(true); fetchNotifications().finally(() => setLoading(false)); }}
                      className="p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-white dark:hover:bg-zinc-800 transition-all"
                      title="Refresh"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="p-2 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-white dark:hover:bg-zinc-800 transition-all"
                        title="Tandai semua dibaca"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAll}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-white dark:hover:bg-zinc-800 transition-all"
                        title="Hapus semua"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200 hover:bg-white dark:hover:bg-zinc-800 transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                {notifications.length > 0 && (
                  <div className="flex gap-1 mt-4 bg-white dark:bg-zinc-800 p-1 rounded-xl border border-gray-100 dark:border-zinc-700">
                    {(['all', 'unread'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                          activeTab === tab
                            ? 'bg-primary-600 text-white shadow-sm'
                            : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200'
                        }`}
                      >
                        {tab === 'all' ? 'Semua' : `Belum Dibaca${unreadCount > 0 ? ` (${unreadCount})` : ''}`}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-200/70 dark:bg-zinc-700/60 mx-5" />

              {/* ── List ──────────────────────────────────────────────────── */}
              <div className="overflow-y-auto max-h-[min(440px,calc(100vh-180px))] custom-scrollbar px-3 py-3">
                {displayed.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 flex items-center justify-center mb-4 shadow-sm">
                      <BellOff className="w-7 h-7 text-gray-300 dark:text-zinc-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-500 dark:text-zinc-400">
                      {activeTab === 'unread' ? 'Tidak ada notifikasi baru' : 'Tidak ada notifikasi'}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1 leading-relaxed">
                      {activeTab === 'unread'
                        ? 'Semua notifikasi sudah dibaca'
                        : 'Notifikasi baru akan muncul di sini'}
                    </p>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {displayed.map(notif => (
                      <NotificationCard
                        key={notif.id}
                        notif={notif}
                        onClick={handleNotifClick}
                        onDelete={deleteNotif}
                      />
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* ── Footer ────────────────────────────────────────────────── */}
              <div className="h-px bg-gray-200/70 dark:bg-zinc-700/60 mx-5" />
              <div className="px-5 py-3 flex items-center justify-between">
                <p className="text-[11px] text-gray-400 dark:text-zinc-500">
                  Pembaruan otomatis setiap 30 detik
                </p>
                <span className="text-[11px] font-semibold text-gray-400 dark:text-zinc-500">
                  PentaDosen
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
