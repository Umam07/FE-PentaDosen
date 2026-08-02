import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAnnouncementsTab } from '../hooks/useAnnouncementsTab';
import AnnouncementDeleteModal from './AnnouncementDeleteModal';
import AnnouncementsCalendar from './AnnouncementsCalendar';
import AnnouncementDetailDrawer from './AnnouncementDetailDrawer';

interface AnnouncementsTabProps {
  triggerMessage: (text: string, type?: 'success' | 'error') => void;
  user: { id: string | number };
}

/**
 * Tab Manajemen Pengumuman dengan Tampilan Kalender Bulanan Utama.
 */
export default function AnnouncementsTab({ triggerMessage, user }: AnnouncementsTabProps) {
  const {
    announcements,
    loading,
    editingId,
    title,
    setTitle,
    content,
    setContent,
    startDate,
    setStartDate,
    isActive,
    setIsActive,
    expiresAt,
    setExpiresAt,
    saving,
    isOpenForm,
    setIsOpenForm,
    deleteAnnouncement,
    setDeleteAnnouncement,
    handleOpenCreate,
    handleOpenEdit,
    handleSave,
    fetchAnnouncements
  } = useAnnouncementsTab(triggerMessage, user);

  // State untuk drawer detail tanggal terpilih
  const [selectedDateString, setSelectedDateString] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleSelectDate = (dateStr: string) => {
    setSelectedDateString(dateStr);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Komponen Utama Kalender Bulanan */}
      <AnnouncementsCalendar
        announcements={announcements}
        loading={loading}
        onOpenCreate={(defaultDate) => handleOpenCreate(defaultDate)}
        onSelectDate={handleSelectDate}
      />

      {/* Panel Detail Tanggal Terpilih (Drawer) */}
      <AnnouncementDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedDateString={selectedDateString}
        announcements={announcements}
        onEdit={handleOpenEdit}
        onDelete={setDeleteAnnouncement}
        onCreateNew={() => handleOpenCreate(selectedDateString || undefined)}
      />

      {/* Form Modal Editor Pengumuman (Create & Edit) */}
      <AnimatePresence>
        {isOpenForm && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpenForm(false)}
              className="fixed inset-0 bg-gray-950/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl border border-gray-200 dark:border-zinc-800 p-8 overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-base font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">
                    {editingId ? 'Edit Pengumuman' : 'Terbitkan Pengumuman Baru'}
                  </h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                    Informasikan informasi penting kepada seluruh dosen.
                  </p>
                </div>
                <button
                  onClick={() => setIsOpenForm(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest">
                    Judul Pengumuman
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Judul info..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-855 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold outline-none text-sm text-gray-900 dark:text-zinc-100 focus:border-primary-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest">
                    Konten / Isi Pengumuman
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tuliskan detail pengumuman..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-855 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold outline-none text-sm text-gray-900 dark:text-zinc-100 resize-none focus:border-primary-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest">
                      Tanggal Mulai Tayang
                    </label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-855 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold outline-none text-sm text-gray-900 dark:text-zinc-100 focus:border-primary-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest">
                      Batas Kedaluwarsa (Expired Date)
                    </label>
                    <input
                      type="date"
                      value={expiresAt}
                      onChange={(e) => setExpiresAt(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-855 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold outline-none text-sm text-gray-900 dark:text-zinc-100 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 pl-1">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                  />
                  <label
                    htmlFor="isActive"
                    className="text-xs font-black text-gray-700 dark:text-zinc-300 uppercase tracking-widest cursor-pointer select-none"
                  >
                    Tampilkan Langsung (Aktif)
                  </label>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOpenForm(false)}
                    className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-600 dark:text-zinc-300 rounded-xl text-xs font-black uppercase tracking-widest transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg disabled:opacity-40 transition-colors"
                  >
                    {saving ? 'Menerbitkan...' : 'Terbitkan Sekarang'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Konfirmasi Hapus */}
      <AnnouncementDeleteModal
        isOpen={!!deleteAnnouncement}
        onClose={() => setDeleteAnnouncement(null)}
        announcement={deleteAnnouncement}
        onSuccess={fetchAnnouncements}
        triggerMessage={triggerMessage}
      />
    </div>
  );
}
