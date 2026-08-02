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
            className="fixed inset-0 bg-gray-950/50 backdrop-blur-xs transition-opacity"
          />

          {/* Slide-over panel (Drawer) */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full max-w-md bg-white dark:bg-zinc-900 border-l border-gray-100 dark:border-zinc-800 shadow-2xl h-full flex flex-col z-10"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-850/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 rounded-2xl border border-primary-100 dark:border-primary-900/30">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Detail Pengumuman</p>
                  <h3 className="text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">
                    {formattedDate}
                  </h3>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-bar / Action header */}
            <div className="px-6 py-3 bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center text-xs">
              <span className="text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                Total: <strong className="text-gray-900 dark:text-zinc-100">{dateAnnouncements.length}</strong> Pengumuman
              </span>
              <button
                onClick={() => {
                  onClose();
                  onCreateNew();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 shadow-xs"
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
                      className="bg-white dark:bg-zinc-850 rounded-2xl border border-gray-100 dark:border-zinc-800 p-5 space-y-3 relative group transition-all"
                    >
                      {/* Badge status */}
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Megaphone className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" />
                        </div>

                        {status === 'active' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40">
                            <CheckCircle2 className="w-3 h-3" />
                            Aktif
                          </span>
                        )}
                        {status === 'scheduled' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-900/40">
                            <Clock className="w-3 h-3" />
                            Terjadwal
                          </span>
                        )}
                        {status === 'expired' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400 border border-gray-200 dark:border-zinc-700">
                            <AlertCircle className="w-3 h-3" />
                            Kadaluarsa
                          </span>
                        )}
                      </div>

                      {/* Judul & Isi */}
                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">
                          {a.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
                          {a.content}
                        </p>
                      </div>

                      {/* Info Periode Tayang */}
                      <div className="pt-2 border-t border-gray-50 dark:border-zinc-800 flex justify-between items-center text-[10px] font-bold text-gray-400">
                        <span>Tayang: {formatDateID(a.created_at)}</span>
                        {a.expires_at ? (
                          <span>Exp: {formatDateID(a.expires_at)}</span>
                        ) : (
                          <span className="text-emerald-600 dark:text-emerald-400">Tanpa Batas</span>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => {
                            onClose();
                            onEdit(a);
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-50 hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-gray-700 dark:text-zinc-300 rounded-xl text-[10px] font-black uppercase tracking-wider border border-gray-200 dark:border-zinc-700 transition-colors"
                        >
                          <Edit3 className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            onClose();
                            onDelete(a);
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/30 dark:hover:bg-red-950/60 dark:text-red-400 rounded-xl text-[10px] font-black uppercase tracking-wider border border-red-200 dark:border-red-900/30 transition-colors"
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
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-gray-50/50 dark:bg-zinc-850/30 border border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl space-y-3">
                  <div className="p-4 bg-white dark:bg-zinc-800 rounded-2xl shadow-xs text-gray-300 dark:text-zinc-600">
                    <Megaphone className="w-8 h-8" />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-gray-700 dark:text-zinc-300 uppercase tracking-wider">
                      Tidak Ada Pengumuman
                    </h5>
                    <p className="text-[11px] text-gray-400 mt-1 max-w-xs leading-relaxed">
                      Belum ada pengumuman yang aktif atau dijadwalkan pada tanggal ini.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onCreateNew();
                    }}
                    className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow-xs transition-all active:scale-95"
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
