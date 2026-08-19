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
              className="fixed inset-0 bg-ink/40 dark:bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xl border border-hairline-light dark:border-hairline-dark p-6 md:p-8 overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-ink-heading dark:text-on-dark tracking-tight">
                    {editingId ? 'Edit Pengumuman' : 'Terbitkan Pengumuman Baru'}
                  </h3>
                  <p className="text-xs text-muted dark:text-on-dark-muted mt-0.5">
                    Sebarkan informasi penting kepada seluruh civitas dosen.
                  </p>
                </div>
                <button
                  onClick={() => setIsOpenForm(false)}
                  className="p-1.5 text-muted hover:text-ink-heading dark:hover:text-on-dark rounded-xl hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink-heading dark:text-on-dark">
                    Judul Pengumuman
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Judul pengumuman..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-xl font-medium outline-none text-xs text-ink-heading dark:text-on-dark focus:ring-1 focus:ring-accent focus:border-accent transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink-heading dark:text-on-dark">
                    Konten / Isi Pengumuman
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tuliskan detail pengumuman..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-xl font-medium outline-none text-xs text-ink-heading dark:text-on-dark resize-none focus:ring-1 focus:ring-accent focus:border-accent transition-all leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-ink-heading dark:text-on-dark">
                      Tanggal Mulai Tayang
                    </label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-2.5 bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-xl font-medium outline-none text-xs text-ink-heading dark:text-on-dark focus:ring-1 focus:ring-accent focus:border-accent transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-ink-heading dark:text-on-dark">
                      Batas Kedaluwarsa (Expired Date)
                    </label>
                    <input
                      type="date"
                      value={expiresAt}
                      onChange={(e) => setExpiresAt(e.target.value)}
                      className="w-full px-4 py-2.5 bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-xl font-medium outline-none text-xs text-ink-heading dark:text-on-dark focus:ring-1 focus:ring-accent focus:border-accent transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded border-hairline-light dark:border-hairline-dark text-accent focus:ring-accent cursor-pointer"
                  />
                  <label
                    htmlFor="isActive"
                    className="text-xs font-semibold text-ink-heading dark:text-on-dark cursor-pointer select-none"
                  >
                    Tampilkan Langsung (Aktif)
                  </label>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOpenForm(false)}
                    className="flex-1 py-2.5 bg-surface-light hover:bg-surface-light-raised dark:bg-surface-dark dark:hover:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark text-ink-heading dark:text-on-dark rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-2.5 bg-ink hover:bg-ink/90 dark:bg-surface-dark-elevated dark:hover:bg-surface-dark-elevated/80 text-on-ink dark:text-on-dark rounded-xl text-xs font-semibold shadow-xs disabled:opacity-40 transition-colors cursor-pointer"
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
