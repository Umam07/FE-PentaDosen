import { useState, useEffect, useRef, useCallback, ElementType, MouseEvent as ReactMouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Bell, CheckCheck, Trash2, X,
  CheckCircle2, XCircle, Clock, ShieldCheck,
  FileText, Beaker, RefreshCw, Megaphone,
  MessageSquare, BellOff
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

interface TypeConfigItem {
  icon: ElementType;
  iconColor: string;
  iconBg: string;
  badgeBg: string;
  label: string;
}

const typeConfigMap: Record<string, TypeConfigItem> = {
  support_ticket_replied: {
    icon: MessageSquare,
    iconColor: 'text-slate-700 dark:text-slate-300',
    iconBg: 'bg-slate-100 dark:bg-slate-800',
    badgeBg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/80',
    label: 'Support'
  },
  new_support_ticket: {
    icon: MessageSquare,
    iconColor: 'text-slate-700 dark:text-slate-300',
    iconBg: 'bg-slate-100 dark:bg-slate-800',
    badgeBg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/80',
    label: 'Support'
  },
  doc_approved: {
    icon: CheckCircle2,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    badgeBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/40',
    label: 'Disetujui LPPM'
  },
  penelitian_approved: {
    icon: CheckCircle2,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    badgeBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/40',
    label: 'Disetujui LPPM'
  },
  doc_rejected: {
    icon: XCircle,
    iconColor: 'text-rose-600 dark:text-rose-400',
    iconBg: 'bg-rose-50 dark:bg-rose-950/40',
    badgeBg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/40',
    label: 'Ditolak'
  },
  penelitian_rejected: {
    icon: XCircle,
    iconColor: 'text-rose-600 dark:text-rose-400',
    iconBg: 'bg-rose-50 dark:bg-rose-950/40',
    badgeBg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/40',
    label: 'Ditolak'
  },
  doc_verified_fakultas: {
    icon: ShieldCheck,
    iconColor: 'text-sky-600 dark:text-sky-400',
    iconBg: 'bg-sky-50 dark:bg-sky-950/40',
    badgeBg: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200/60 dark:border-sky-800/40',
    label: 'Verifikasi Fakultas'
  },
  doc_verified_prodi: {
    icon: ShieldCheck,
    iconColor: 'text-sky-600 dark:text-sky-400',
    iconBg: 'bg-sky-50 dark:bg-sky-950/40',
    badgeBg: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200/60 dark:border-sky-800/40',
    label: 'Verifikasi Prodi'
  },
  penelitian_verified_prodi: {
    icon: ShieldCheck,
    iconColor: 'text-sky-600 dark:text-sky-400',
    iconBg: 'bg-sky-50 dark:bg-sky-950/40',
    badgeBg: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200/60 dark:border-sky-800/40',
    label: 'Verifikasi Prodi'
  },
  doc_pending_lppm: {
    icon: Clock,
    iconColor: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-amber-50 dark:bg-amber-950/40',
    badgeBg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/40',
    label: 'Menunggu LPPM'
  },
  penelitian_pending_lppm: {
    icon: Clock,
    iconColor: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-amber-50 dark:bg-amber-950/40',
    badgeBg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/40',
    label: 'Menunggu LPPM'
  },
  doc_submitted: {
    icon: FileText,
    iconColor: 'text-slate-700 dark:text-slate-300',
    iconBg: 'bg-slate-100 dark:bg-slate-800',
    badgeBg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/80',
    label: 'Pengajuan'
  },
  penelitian_submitted: {
    icon: Beaker,
    iconColor: 'text-slate-700 dark:text-slate-300',
    iconBg: 'bg-slate-100 dark:bg-slate-800',
    badgeBg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/80',
    label: 'Penelitian'
  },
  announcement: {
    icon: Megaphone,
    iconColor: 'text-slate-700 dark:text-slate-300',
    iconBg: 'bg-slate-100 dark:bg-slate-800',
    badgeBg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/80',
    label: 'Pengumuman'
  },
};

const getTypeConfig = (type: string, title: string = '', message: string = ''): TypeConfigItem => {
  if (typeConfigMap[type]) return typeConfigMap[type];
  const combined = (type + ' ' + title + ' ' + message).toLowerCase();
  if (combined.includes('support') || combined.includes('pesan') || combined.includes('balas')) return typeConfigMap.support_ticket_replied;
  if (combined.includes('disetujui') || combined.includes('approved')) return typeConfigMap.doc_approved;
  if (combined.includes('ditolak') || combined.includes('rejected')) return typeConfigMap.doc_rejected;
  if (combined.includes('verifikasi')) return typeConfigMap.doc_verified_fakultas;
  if (combined.includes('menunggu') || combined.includes('pending')) return typeConfigMap.doc_pending_lppm;
  if (combined.includes('announcement')) return typeConfigMap.announcement;
  return {
    icon: Bell,
    iconColor: 'text-slate-700 dark:text-slate-300',
    iconBg: 'bg-slate-100 dark:bg-slate-800',
    badgeBg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/80',
    label: 'Informasi'
  };
};

function timeAgo(dateStr: string): string {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return 'Baru saja';
  if (diff < 3600) return `${Math.floor(diff / 60)} mnt lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hri lalu`;
}

function cleanTitle(title: string): string {
  return title.replace(/[\s✓✔!]+$/u, '').trim();
}

interface NotificationCardProps {
  notif: NotificationItem;
  onClick: (n: NotificationItem) => void | Promise<void>;
  onDelete: (id: number, e: ReactMouseEvent<HTMLButtonElement>) => void | Promise<void>;
}

function NotificationCard({ notif, onClick, onDelete }: NotificationCardProps) {
  const cfg = getTypeConfig(notif.type, notif.title, notif.message);
  const Icon = cfg.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 10, scale: 0.97 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onClick(notif)}
      className={`group relative flex items-start gap-3 p-3 sm:p-3.5 rounded-xl mb-1.5 cursor-pointer transition-all duration-200 border ${
        notif.is_read
          ? 'bg-transparent border-transparent hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/70 dark:border-slate-700/60 shadow-2xs hover:bg-slate-100/90 dark:hover:bg-slate-800'
      }`}
    >
      {!notif.is_read && (
        <span className="absolute left-1 top-3 bottom-3 w-1 rounded-full bg-blue-600 dark:bg-blue-500" />
      )}
      <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-opacity border border-slate-200/60 dark:border-slate-700/60 ${cfg.iconBg} ${
        notif.is_read ? 'opacity-60' : 'opacity-100'
      }`}>
        <Icon className={`w-4 h-4 ${cfg.iconColor}`} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0 pr-5">
        <h4 className={`text-xs sm:text-sm leading-snug truncate ${
          notif.is_read ? 'font-medium text-slate-700 dark:text-slate-300' : 'font-semibold text-slate-900 dark:text-white'
        }`}>
          {cleanTitle(notif.title)}
        </h4>
        <p className={`text-xs leading-relaxed line-clamp-2 ${
          notif.is_read ? 'text-slate-500 dark:text-slate-400' : 'text-slate-600 dark:text-slate-300'
        }`}>
          {notif.message}
        </p>
        <div className="flex items-center gap-2 mt-2 text-[11px]">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${cfg.badgeBg}`}>
            {cfg.label}
          </span>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span className={`text-[11px] font-mono ${
            notif.is_read ? 'text-slate-400 dark:text-slate-500' : 'text-slate-500 dark:text-slate-400 font-medium'
          }`}>
            {timeAgo(notif.created_at)}
          </span>
        </div>
      </div>
      <button
        onClick={(e) => onDelete(notif.id, e)}
        className="absolute top-2.5 right-2.5 p-1 rounded-lg opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-all duration-150 cursor-pointer"
        title="Hapus notifikasi"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

export default function NotificationBell({ userId }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState(false);
  const [bellAnim, setBellAnim] = useState(false);
  const bellRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [dropPos, setDropPos] = useState({ top: 0, right: 0 });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/notifications?user_id=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || data || []);
      }
    } catch {}
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const prevCount = useRef(unreadCount);
  useEffect(() => {
    if (unreadCount > prevCount.current) {
      setBellAnim(true);
      const t = setTimeout(() => setBellAnim(false), 1000);
      return () => clearTimeout(t);
    }
    prevCount.current = unreadCount;
  }, [unreadCount]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) && bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

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

  const markAllRead = async () => {
    if (!userId) return;
    try {
      await fetch('/api/notifications/read-all', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId }) });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch {}
  };

  const clearAll = async () => {
    if (!userId) return;
    try {
      await fetch('/api/notifications/clear-all', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId }) });
      setNotifications([]);
    } catch {}
  };

  const deleteNotif = async (id: number, e: ReactMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch {}
  };

  const handleNotifClick = async (notif: NotificationItem) => {
    if (!notif.is_read) {
      try {
        await fetch(`/api/notifications/${notif.id}/read`, { method: 'PUT' });
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
      } catch {}
    }
    if (notif.data?.url) navigate(notif.data.url);
    setIsOpen(false);
  };

  const displayed = activeTab === 'unread' ? notifications.filter(n => !n.is_read) : notifications;

  return (
    <>
      <button
        ref={bellRef}
        id="notification-bell-btn"
        onClick={() => setIsOpen(prev => !prev)}
        className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 transition-all flex-shrink-0 active:scale-95 shadow-2xs cursor-pointer"
        aria-label="Notifikasi"
      >
        <motion.div
          animate={bellAnim ? { rotate: [0, -15, 15, -10, 10, -5, 5, 0] } : { rotate: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        >
          <Bell className="w-[18px] h-[18px]" strokeWidth={2} />
        </motion.div>
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 min-w-[18px] h-4.5 px-1 flex items-center justify-center bg-blue-600 text-white text-[10px] font-bold font-mono tabular-nums rounded-full leading-none shadow-xs border border-white dark:border-slate-900"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'fixed',
                top: dropPos.top,
                left: isMobile ? '12px' : 'auto',
                right: isMobile ? '12px' : dropPos.right,
                zIndex: 9998,
              }}
              className="w-auto sm:w-[410px] bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden flex flex-col"
            >
              <div className="p-4 sm:p-4.5 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 tracking-tight">Notifikasi</h3>
                    {unreadCount > 0 ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/40">
                        {unreadCount} Baru
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 dark:text-zinc-500 font-normal">Semua dibaca</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setLoading(true); fetchNotifications().finally(() => setLoading(false)); }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all cursor-pointer">
                        <CheckCheck className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button onClick={clearAll} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {notifications.length > 0 && (
                  <div className="grid grid-cols-2 gap-1 mt-3.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    {(['all', 'unread'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`relative py-1 sm:py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                          activeTab === tab ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                      >
                        {tab === 'all' ? 'Semua' : `Belum Dibaca${unreadCount > 0 ? ` (${unreadCount})` : ''}`}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="h-px bg-slate-100 dark:bg-slate-800 mx-4" />
              <div className="overflow-y-auto max-h-[min(400px,calc(100vh-200px))] px-2.5 py-2 custom-scrollbar">
                {displayed.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3 text-slate-400 dark:text-slate-500">
                      <BellOff className="w-5 h-5" />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-300">
                      {activeTab === 'unread' ? 'Tidak ada notifikasi belum dibaca' : 'Belum ada notifikasi'}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1 max-w-[220px]">
                      {activeTab === 'unread'
                        ? 'Semua notifikasi penting sudah Anda periksa'
                        : 'Informasi dan pembaruan sistem akan tampil di sini'}
                    </p>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {displayed.map(notif => (
                      <NotificationCard key={notif.id} notif={notif} onClick={handleNotifClick} onDelete={deleteNotif} />
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Minimalist Footer */}
              <div className="h-px bg-slate-100 dark:bg-slate-800 mx-4" />
              <div className="px-4 py-2.5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  Update otomatis (30s)
                </span>
                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
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