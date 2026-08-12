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
              className="fixed inset-0 bg-gray-950/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-gray-200 dark:border-zinc-800 p-6 md:p-8 overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100 tracking-tight">
                    {editingId ? 'Edit Pengumuman' : 'Terbitkan Pengumuman Baru'}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                    Sebarkan informasi penting kepada seluruh civitas dosen.
                  </p>
                </div>
                <button
                  onClick={() => setIsOpenForm(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-zinc-300">
                    Judul Pengumuman
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Judul pengumuman..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl font-medium outline-none text-sm text-gray-900 dark:text-zinc-100 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-zinc-300">
                    Konten / Isi Pengumuman
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tuliskan detail pengumuman..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl font-medium outline-none text-sm text-gray-900 dark:text-zinc-100 resize-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-zinc-300">
                      Tanggal Mulai Tayang
                    </label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl font-medium outline-none text-sm text-gray-900 dark:text-zinc-100 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-zinc-300">
                      Batas Kedaluwarsa (Expired Date)
                    </label>
                    <input
                      type="date"
                      value={expiresAt}
                      onChange={(e) => setExpiresAt(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl font-medium outline-none text-sm text-gray-900 dark:text-zinc-100 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                  />
                  <label
                    htmlFor="isActive"
                    className="text-xs font-semibold text-gray-700 dark:text-zinc-300 cursor-pointer select-none"
                  >
                    Tampilkan Langsung (Aktif)
                  </label>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOpenForm(false)}
                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold shadow-xs disabled:opacity-40 transition-colors"
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
