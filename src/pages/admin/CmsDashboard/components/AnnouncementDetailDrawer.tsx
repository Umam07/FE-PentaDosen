import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar as CalendarIcon, Megaphone, Edit3, Trash2, Plus, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Announcement } from '../types/cmsDashboard.types';
import {
  formatDateFullID,
  formatDateID,
  getAnnouncementStatus,
  isAnnouncementOnDate
} from '../utils/calendarUtils';

interface AnnouncementDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDateString: string | null;
  announcements: Announcement[];
  onEdit: (announcement: Announcement) => void;
  onDelete: (announcement: Announcement) => void;
  onCreateNew: () => void;
}

export default function AnnouncementDetailDrawer({
  isOpen,
  onClose,
  selectedDateString,
  announcements,
  onEdit,
  onDelete,
  onCreateNew
}: AnnouncementDetailDrawerProps) {
  if (!selectedDateString) return null;

  // Filter pengumuman yang aktif/terjadwal/kadaluarsa pada tanggal terpilih
  const dateAnnouncements = announcements.filter(a => isAnnouncementOnDate(a, selectedDateString));

  const formattedDate = formatDateFullID(selectedDateString);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] overflow-hidden flex justify-end">
          {/* Overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/40 dark:bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Slide-over panel (Drawer) */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full max-w-md bg-surface-light dark:bg-surface-dark border-l border-hairline-light dark:border-hairline-dark shadow-2xl h-full flex flex-col z-10"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-hairline-light-soft dark:border-hairline-dark-soft flex justify-between items-center bg-surface-light-raised dark:bg-surface-dark-elevated">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-surface-light dark:bg-surface-dark text-accent dark:text-accent-on-dark rounded-xl border border-hairline-light-soft dark:border-hairline-dark-soft">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted dark:text-on-dark-muted">Detail Pengumuman</p>
                  <h3 className="text-sm font-bold text-ink-heading dark:text-on-dark">
                    {formattedDate}
                  </h3>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-muted hover:text-ink-heading dark:hover:text-on-dark rounded-xl hover:bg-surface-light dark:hover:bg-surface-dark transition-colors cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-bar / Action header */}
            <div className="px-6 py-3 bg-surface-light dark:bg-surface-dark border-b border-hairline-light-soft dark:border-hairline-dark-soft flex justify-between items-center text-xs">
              <span className="text-xs text-muted dark:text-on-dark-muted">
                Total: <strong className="font-mono font-semibold text-ink-heading dark:text-on-dark">{dateAnnouncements.length}</strong> Pengumuman
              </span>
              <button
                onClick={() => {
                  onClose();
                  onCreateNew();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ink hover:bg-ink/90 dark:bg-surface-dark-elevated dark:hover:bg-surface-dark-elevated/80 text-on-ink dark:text-on-dark rounded-xl text-xs font-semibold uppercase tracking-wider transition-all active:scale-95 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Buat Baru
              </button>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {dateAnnouncements.length > 0 ? (
                dateAnnouncements.map((a) => {
                  const status = getAnnouncementStatus(a);

                  return (
                    <div
                      key={a.id}
                      className="bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl border border-hairline-light-soft dark:border-hairline-dark-soft p-5 space-y-3 relative group transition-all"
                    >
                      {/* Badge status */}
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Megaphone className="w-4 h-4 text-accent dark:text-accent-on-dark shrink-0" />
                        </div>

                        {status === 'active' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-success-soft text-success-dark dark:text-success-on-dark border border-success-border">
                            <CheckCircle2 className="w-3 h-3" />
                            Aktif
                          </span>
                        )}
                        {status === 'scheduled' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-accent-soft text-accent dark:text-accent-on-dark border border-accent/20">
                            <Clock className="w-3 h-3" />
                            Terjadwal
                          </span>
                        )}
                        {status === 'expired' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-surface-light dark:bg-surface-dark text-muted dark:text-on-dark-muted border border-hairline-light dark:border-hairline-dark">
                            <AlertCircle className="w-3 h-3" />
                            Kadaluarsa
                          </span>
                        )}
                      </div>

                      {/* Judul & Isi */}
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-ink-heading dark:text-on-dark">
                          {a.title}
                        </h4>
                        <p className="text-xs text-body dark:text-on-dark-soft leading-relaxed">
                          {a.content}
                        </p>
                      </div>

                      {/* Info Periode Tayang */}
                      <div className="pt-2 border-t border-hairline-light-soft dark:border-hairline-dark-soft flex justify-between items-center text-[10px] font-mono text-muted dark:text-on-dark-muted">
                        <span>Tayang: {formatDateID(a.created_at)}</span>
                        {a.expires_at ? (
                          <span>Exp: {formatDateID(a.expires_at)}</span>
                        ) : (
                          <span className="text-success-dark dark:text-success-on-dark">Tanpa Batas</span>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => {
                            onClose();
                            onEdit(a);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-light hover:bg-surface-light-raised dark:bg-surface-dark dark:hover:bg-surface-dark-elevated text-ink-heading dark:text-on-dark rounded-xl text-xs font-semibold border border-hairline-light dark:border-hairline-dark transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            onClose();
                            onDelete(a);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-error-soft hover:bg-error-soft/80 text-error rounded-xl text-xs font-semibold border border-error-border transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          Hapus
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                /* Empty state */
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-surface-light-raised/40 dark:bg-surface-dark-elevated/30 border border-dashed border-hairline-light dark:border-hairline-dark rounded-2xl space-y-3">
                  <div className="p-4 bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xs text-muted-soft dark:text-on-dark-muted border border-hairline-light-soft dark:border-hairline-dark-soft">
                    <Megaphone className="w-8 h-8" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-ink-heading dark:text-on-dark uppercase tracking-wider">
                      Tidak Ada Pengumuman
                    </h5>
                    <p className="text-xs text-muted dark:text-on-dark-muted mt-1 max-w-xs leading-relaxed">
                      Belum ada pengumuman yang aktif atau dijadwalkan pada tanggal ini.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onCreateNew();
                    }}
                    className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-ink hover:bg-ink/90 dark:bg-surface-dark-elevated dark:hover:bg-surface-dark-elevated/80 text-on-ink dark:text-on-dark rounded-xl text-xs font-semibold uppercase tracking-wider shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Terbitkan Pengumuman
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
