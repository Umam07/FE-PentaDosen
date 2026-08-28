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
    iconColor: 'text-body dark:text-on-dark-soft',
    iconBg: 'bg-surface-light-raised dark:bg-surface-dark-elevated',
    badgeBg: 'bg-surface-light-raised text-body dark:bg-surface-dark-elevated dark:text-on-dark-soft border-hairline-light dark:border-hairline-dark',
    label: 'Support'
  },
  new_support_ticket: {
    icon: MessageSquare,
    iconColor: 'text-body dark:text-on-dark-soft',
    iconBg: 'bg-surface-light-raised dark:bg-surface-dark-elevated',
    badgeBg: 'bg-surface-light-raised text-body dark:bg-surface-dark-elevated dark:text-on-dark-soft border-hairline-light dark:border-hairline-dark',
    label: 'Support'
  },
  doc_approved: {
    icon: CheckCircle2,
    iconColor: 'text-success dark:text-success-on-dark',
    iconBg: 'bg-success-soft dark:bg-success/20',
    badgeBg: 'bg-success-soft text-success dark:bg-success/20 dark:text-success-on-dark border-success-border/60 dark:border-success/30',
    label: 'Disetujui LPPM'
  },
  penelitian_approved: {
    icon: CheckCircle2,
    iconColor: 'text-success dark:text-success-on-dark',
    iconBg: 'bg-success-soft dark:bg-success/20',
    badgeBg: 'bg-success-soft text-success dark:bg-success/20 dark:text-success-on-dark border-success-border/60 dark:border-success/30',
    label: 'Disetujui LPPM'
  },
  doc_rejected: {
    icon: XCircle,
    iconColor: 'text-error dark:text-error-on-dark',
    iconBg: 'bg-error-soft dark:bg-error/20',
    badgeBg: 'bg-error-soft text-error dark:bg-error/20 dark:text-error-on-dark border-error-border/60 dark:border-error/30',
    label: 'Ditolak'
  },
  penelitian_rejected: {
    icon: XCircle,
    iconColor: 'text-error dark:text-error-on-dark',
    iconBg: 'bg-error-soft dark:bg-error/20',
    badgeBg: 'bg-error-soft text-error dark:bg-error/20 dark:text-error-on-dark border-error-border/60 dark:border-error/30',
    label: 'Ditolak'
  },
  doc_verified_fakultas: {
    icon: ShieldCheck,
    iconColor: 'text-accent dark:text-accent-on-dark',
    iconBg: 'bg-accent-soft dark:bg-accent/20',
    badgeBg: 'bg-accent-soft text-accent dark:bg-accent/20 dark:text-accent-on-dark border-accent-border/60 dark:border-accent/30',
    label: 'Verifikasi Fakultas'
  },
  doc_verified_prodi: {
    icon: ShieldCheck,
    iconColor: 'text-accent dark:text-accent-on-dark',
    iconBg: 'bg-accent-soft dark:bg-accent/20',
    badgeBg: 'bg-accent-soft text-accent dark:bg-accent/20 dark:text-accent-on-dark border-accent-border/60 dark:border-accent/30',
    label: 'Verifikasi Prodi'
  },
  penelitian_verified_prodi: {
    icon: ShieldCheck,
    iconColor: 'text-accent dark:text-accent-on-dark',
    iconBg: 'bg-accent-soft dark:bg-accent/20',
    badgeBg: 'bg-accent-soft text-accent dark:bg-accent/20 dark:text-accent-on-dark border-accent-border/60 dark:border-accent/30',
    label: 'Verifikasi Prodi'
  },
  doc_pending_lppm: {
    icon: Clock,
    iconColor: 'text-warning dark:text-warning-on-dark',
    iconBg: 'bg-warning-soft dark:bg-warning/20',
    badgeBg: 'bg-warning-soft text-warning dark:bg-warning/20 dark:text-warning-on-dark border-warning-border/60 dark:border-warning/30',
    label: 'Menunggu LPPM'
  },
  penelitian_pending_lppm: {
    icon: Clock,
    iconColor: 'text-warning dark:text-warning-on-dark',
    iconBg: 'bg-warning-soft dark:bg-warning/20',
    badgeBg: 'bg-warning-soft text-warning dark:bg-warning/20 dark:text-warning-on-dark border-warning-border/60 dark:border-warning/30',
    label: 'Menunggu LPPM'
  },
  doc_submitted: {
    icon: FileText,
    iconColor: 'text-body dark:text-on-dark-soft',
    iconBg: 'bg-surface-light-raised dark:bg-surface-dark-elevated',
    badgeBg: 'bg-surface-light-raised text-body dark:bg-surface-dark-elevated dark:text-on-dark-soft border-hairline-light dark:border-hairline-dark',
    label: 'Pengajuan'
  },
  penelitian_submitted: {
    icon: Beaker,
    iconColor: 'text-body dark:text-on-dark-soft',
    iconBg: 'bg-surface-light-raised dark:bg-surface-dark-elevated',
    badgeBg: 'bg-surface-light-raised text-body dark:bg-surface-dark-elevated dark:text-on-dark-soft border-hairline-light dark:border-hairline-dark',
    label: 'Penelitian'
  },
  announcement: {
    icon: Megaphone,
    iconColor: 'text-body dark:text-on-dark-soft',
    iconBg: 'bg-surface-light-raised dark:bg-surface-dark-elevated',
    badgeBg: 'bg-surface-light-raised text-body dark:bg-surface-dark-elevated dark:text-on-dark-soft border-hairline-light dark:border-hairline-dark',
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
    iconColor: 'text-body dark:text-on-dark-soft',
    iconBg: 'bg-surface-light-raised dark:bg-surface-dark-elevated',
    badgeBg: 'bg-surface-light-raised text-body dark:bg-surface-dark-elevated dark:text-on-dark-soft border-hairline-light dark:border-hairline-dark',
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
          ? 'bg-transparent border-transparent hover:bg-surface-light-raised/70 dark:hover:bg-surface-dark-elevated/50'
          : 'bg-surface-light-raised/60 dark:bg-surface-dark-elevated/60 border-hairline-light dark:border-hairline-dark shadow-2xs hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated'
      }`}
    >
      {!notif.is_read && (
        <span className="absolute left-1 top-3 bottom-3 w-1 rounded-full bg-accent dark:bg-accent-on-dark" />
      )}
      <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 transition-opacity border border-hairline-light/60 dark:border-hairline-dark/60 ${cfg.iconBg} ${
        notif.is_read ? 'opacity-60' : 'opacity-100'
      }`}>
        <Icon className={`w-4 h-4 ${cfg.iconColor}`} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0 pr-5">
        <h4 className={`text-xs sm:text-sm leading-snug truncate ${
          notif.is_read ? 'font-medium text-body dark:text-on-dark-soft' : 'font-semibold text-ink-heading dark:text-on-dark'
        }`}>
          {cleanTitle(notif.title)}
        </h4>
        <p className={`text-xs leading-relaxed line-clamp-2 mt-0.5 ${
          notif.is_read ? 'text-muted dark:text-on-dark-muted' : 'text-body dark:text-on-dark-soft'
        }`}>
          {notif.message}
        </p>
        <div className="flex items-center gap-2 mt-2 text-[11px]">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${cfg.badgeBg}`}>
            {cfg.label}
          </span>
          <span className="text-muted/40 dark:text-on-dark-muted/40">•</span>
          <span className={`text-[11px] font-mono ${
            notif.is_read ? 'text-muted-soft dark:text-on-dark-muted' : 'text-muted dark:text-on-dark font-medium'
          }`}>
            {timeAgo(notif.created_at)}
          </span>
        </div>
      </div>
      <button
        onClick={(e) => onDelete(notif.id, e)}
        className="absolute top-2.5 right-2.5 p-1 rounded-lg opacity-0 group-hover:opacity-100 text-muted hover:text-error hover:bg-error-soft dark:hover:bg-error/20 dark:hover:text-error-on-dark transition-all duration-150 cursor-pointer"
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
        className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-surface-light dark:bg-surface-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark text-body dark:text-on-dark-soft transition-all shrink-0 active:scale-95 shadow-2xs cursor-pointer"
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
              className="absolute -top-1 -right-1 min-w-[18px] h-4.5 px-1 flex items-center justify-center bg-accent text-white text-[10px] font-bold font-mono tabular-nums rounded-full leading-none shadow-xs border border-surface-light dark:border-surface-dark"
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
              className="w-auto sm:w-[410px] bg-surface-light/98 dark:bg-surface-dark/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-hairline-light dark:border-hairline-dark overflow-hidden flex flex-col"
            >
              <div className="p-4 sm:p-4.5 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-ink-heading dark:text-on-dark tracking-tight">Notifikasi</h3>
                    {unreadCount > 0 ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-accent-soft text-accent dark:bg-accent/20 dark:text-accent-on-dark border border-accent-border/50 dark:border-accent/30">
                        {unreadCount} Baru
                      </span>
                    ) : (
                      <span className="text-xs text-muted dark:text-on-dark-muted font-normal">Semua dibaca</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setLoading(true); fetchNotifications().finally(() => setLoading(false)); }}
                      className="p-1.5 rounded-lg text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-all cursor-pointer"
                      title="Muat ulang"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllRead} 
                        className="p-1.5 rounded-lg text-muted hover:text-success dark:text-on-dark-muted dark:hover:text-success-on-dark hover:bg-success-soft dark:hover:bg-success/20 transition-all cursor-pointer"
                        title="Tandai semua dibaca"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button 
                        onClick={clearAll} 
                        className="p-1.5 rounded-lg text-muted hover:text-error dark:text-on-dark-muted dark:hover:text-error-on-dark hover:bg-error-soft dark:hover:bg-error/20 transition-all cursor-pointer"
                        title="Hapus semua notifikasi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button 
                      onClick={() => setIsOpen(false)} 
                      className="p-1.5 rounded-lg text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-all cursor-pointer"
                      title="Tutup"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {notifications.length > 0 && (
                  <div className="grid grid-cols-2 gap-1 mt-3.5 p-1 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light-soft dark:border-hairline-dark-soft">
                    {(['all', 'unread'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`relative py-1 sm:py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                          activeTab === tab 
                            ? 'bg-surface-light dark:bg-surface-dark text-ink-heading dark:text-on-dark shadow-2xs font-bold' 
                            : 'text-muted dark:text-on-dark-muted hover:text-ink-heading dark:hover:text-on-dark'
                        }`}
                      >
                        {tab === 'all' ? 'Semua' : `Belum Dibaca${unreadCount > 0 ? ` (${unreadCount})` : ''}`}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="h-px bg-hairline-light-soft dark:bg-hairline-dark-soft mx-4" />
              <div className="overflow-y-auto max-h-[min(400px,calc(100vh-200px))] px-2.5 py-2 custom-scrollbar">
                {displayed.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark flex items-center justify-center mb-3 text-muted dark:text-on-dark-muted">
                      <BellOff className="w-5 h-5" />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-ink-heading dark:text-on-dark">
                      {activeTab === 'unread' ? 'Tidak ada notifikasi belum dibaca' : 'Belum ada notifikasi'}
                    </p>
                    <p className="text-[11px] text-muted dark:text-on-dark-muted mt-1 max-w-[220px]">
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
              <div className="h-px bg-hairline-light-soft dark:bg-hairline-dark-soft mx-4" />
              <div className="px-4 py-2.5 flex items-center justify-between bg-surface-light-raised/50 dark:bg-surface-dark-elevated/30 border-t border-hairline-light-soft dark:border-hairline-dark-soft">
                <span className="text-[10px] text-muted dark:text-on-dark-muted">
                  Update otomatis (30s)
                </span>
                <span className="text-[10px] font-semibold text-muted dark:text-on-dark-muted">
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