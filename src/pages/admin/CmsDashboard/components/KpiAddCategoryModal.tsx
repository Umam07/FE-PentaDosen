import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Layers, Zap, ShieldCheck, Book, FileSpreadsheet } from 'lucide-react';
import { cmsDashboardService } from '../services/cmsDashboardService';
import { lockBodyScroll, unlockBodyScroll } from '../../../../lib/utils';

interface KpiAddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  triggerMessage: (text: string, type?: 'success' | 'error') => void;
  defaultGroup?: 'scopus' | 'hki' | 'buku' | 'lain';
}

export default function KpiAddCategoryModal({
  isOpen,
  onClose,
  onSuccess,
  triggerMessage,
  defaultGroup = 'scopus'
}: KpiAddCategoryModalProps) {
  const [mainGroup, setMainGroup] = useState<'scopus' | 'hki' | 'buku' | 'lain'>(defaultGroup);
  const [subGroupOption, setSubGroupOption] = useState<string>('article-quartile');
  const [baseName, setBaseName] = useState<string>('');
  const [authorRole, setAuthorRole] = useState<'first' | 'member' | 'single' | 'standalone'>('first');
  const [weightValue, setWeightValue] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      lockBodyScroll();
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        unlockBodyScroll();
      };
    }
  }, [isOpen, onClose]);

  const handleGroupChange = (group: 'scopus' | 'hki' | 'buku' | 'lain') => {
    setMainGroup(group);
    if (group === 'scopus') setSubGroupOption('article-quartile');
    else if (group === 'hki') setSubGroupOption('paten');
    else if (group === 'buku') setSubGroupOption('referensi');
    else setSubGroupOption('metrik-lain');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!baseName.trim() || !weightValue) {
      triggerMessage('Harap lengkapi nama kategori dan nilai bobot.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      let finalCategoryName = baseName.trim();

      // Penyesuaian kata kunci grup agar terbaca oleh filter otomatis getGroupForCategory
      if (mainGroup === 'scopus') {
        if (!/scopus|sinta|quartile/i.test(finalCategoryName)) {
          finalCategoryName = `Scopus ${finalCategoryName}`;
        }
        if (subGroupOption === 'hyperauthor' && !/hyperauthor|hyper author/i.test(finalCategoryName)) {
          finalCategoryName = `${finalCategoryName} Hyperauthor`;
        } else if (subGroupOption === 'non-article' && !/non-article|non article/i.test(finalCategoryName)) {
          finalCategoryName = `${finalCategoryName} Non-Article`;
        }
      } else if (mainGroup === 'hki') {
        if (!/hki|paten|cipta|merek|merk/i.test(finalCategoryName)) {
          finalCategoryName = `HKI ${finalCategoryName}`;
        }
      } else if (mainGroup === 'buku') {
        if (!/buku|monograf|ajar|referensi/i.test(finalCategoryName)) {
          finalCategoryName = `Buku ${finalCategoryName}`;
        }
      }

      // Penambahan suffix Peran Penulis
      if (authorRole === 'first' && !/first author/i.test(finalCategoryName)) {
        finalCategoryName = `${finalCategoryName} (First Author)`;
      } else if (authorRole === 'member' && !/member author/i.test(finalCategoryName)) {
        finalCategoryName = `${finalCategoryName} (Member Author)`;
      } else if (authorRole === 'single' && !/single author/i.test(finalCategoryName)) {
        finalCategoryName = `${finalCategoryName} (Single Author)`;
      }

      const res = await cmsDashboardService.addWeightCategory(finalCategoryName, parseInt(weightValue));
      triggerMessage(res.message || 'Kategori KPI baru berhasil ditambahkan!');
      
      // Reset Form State
      setBaseName('');
      setWeightValue('');
      setAuthorRole('first');
      onSuccess();
      onClose();
    } catch (e: any) {
      triggerMessage(e.message || 'Gagal menambahkan kategori baru.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-ink/40 dark:bg-black/60 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-xl bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xl border border-hairline-light dark:border-hairline-dark p-6 md:p-8"
        >
          {/* Header Modal */}
          <div className="flex justify-between items-start mb-6 pb-4 border-b border-hairline-light-soft dark:border-hairline-dark-soft">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-surface-light-raised dark:bg-surface-dark-elevated text-accent dark:text-accent-on-dark border border-hairline-light-soft dark:border-hairline-dark-soft">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink-heading dark:text-on-dark tracking-tight">
                  Tambah Kategori KPI Baru
                </h3>
                <p className="text-xs text-muted dark:text-on-dark-muted mt-0.5">
                  Tentukan grup, sub-kategori, dan bobot poin resmi untuk master data KPI.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-muted hover:text-ink-heading dark:hover:text-on-dark rounded-xl hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 1. Pilih Kelompok / Grup Utama */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink-heading dark:text-on-dark uppercase tracking-wider">
                1. Kelompok Utama Poin
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'scopus', label: 'Publikasi', icon: Zap, color: 'text-chart-scholar' },
                  { id: 'hki', label: 'HKI', icon: ShieldCheck, color: 'text-chart-hki' },
                  { id: 'buku', label: 'Buku', icon: Book, color: 'text-chart-buku' },
                  { id: 'lain', label: 'Lainnya', icon: FileSpreadsheet, color: 'text-chart-penelitian' }
                ].map((g) => {
                  const isSelected = mainGroup === g.id;
                  const Icon = g.icon;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => handleGroupChange(g.id as any)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-surface-light-raised dark:bg-surface-dark-elevated border-hairline-light dark:border-hairline-dark text-ink-heading dark:text-on-dark shadow-xs'
                          : 'bg-surface-light dark:bg-surface-dark border-hairline-light-soft dark:border-hairline-dark-soft text-muted dark:text-on-dark-muted hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mb-1 ${g.color}`} />
                      <span>{g.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Pilih Sub-Kategori */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink-heading dark:text-on-dark uppercase tracking-wider">
                2. Sub-Kategori Group
              </label>
              {mainGroup === 'scopus' ? (
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'article-quartile', label: 'Article by Quartile (Q1-Q4)' },
                    { id: 'hyperauthor', label: 'Hyperauthor' },
                    { id: 'non-article', label: 'Non Article' },
                    { id: 'metrik-lain', label: 'Metrik & Kategori Lain' }
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setSubGroupOption(sub.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold text-left border transition-all cursor-pointer ${
                        subGroupOption === sub.id
                          ? 'bg-ink text-on-ink dark:bg-surface-dark-elevated dark:text-on-dark border-transparent shadow-xs'
                          : 'bg-surface-light dark:bg-surface-dark border-hairline-light dark:border-hairline-dark text-body dark:text-on-dark-soft hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  placeholder="Nama Sub-Kategori (misal: Paten, Buku Referensi, Hibah)"
                  value={subGroupOption}
                  onChange={(e) => setSubGroupOption(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-xl text-xs font-medium text-ink-heading dark:text-on-dark outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                />
              )}
            </div>

            {/* 3. Nama Kategori (Base Name) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink-heading dark:text-on-dark uppercase tracking-wider">
                3. Nama Kategori
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Q1, Paten Sederhana, Buku Monograf..."
                value={baseName}
                onChange={(e) => setBaseName(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-xl text-xs font-medium text-ink-heading dark:text-on-dark outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
              />
            </div>

            {/* 4. Peran Penulis / Tipe Bobot & Nilai Poin */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-8 space-y-1.5">
                <label className="text-xs font-semibold text-ink-heading dark:text-on-dark uppercase tracking-wider">
                  4. Peran Penulis
                </label>
                <select
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-xl text-xs font-semibold text-ink-heading dark:text-on-dark outline-none focus:ring-1 focus:ring-accent focus:border-accent cursor-pointer"
                >
                  <option value="first">First Author (Penulis Pertama)</option>
                  <option value="member">Member Author (Penulis Anggota)</option>
                  <option value="single">Single Author (Penulis Mandiri)</option>
                  <option value="standalone">Standalone (Tanpa Skema Penulis)</option>
                </select>
              </div>

              <div className="sm:col-span-4 space-y-1.5">
                <label className="text-xs font-semibold text-ink-heading dark:text-on-dark uppercase tracking-wider">
                  5. Bobot Poin
                </label>
                <input
                  type="number"
                  required
                  placeholder="Cth: 40"
                  value={weightValue}
                  onChange={(e) => setWeightValue(e.target.value)}
                  className="w-full px-3 py-2.5 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-xl text-xs font-mono font-bold text-center text-ink-heading dark:text-on-dark outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                />
              </div>
            </div>

            {/* Footer Modal Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-hairline-light-soft dark:border-hairline-dark-soft">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-surface-light hover:bg-surface-light-raised dark:bg-surface-dark dark:hover:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark text-ink-heading dark:text-on-dark rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-ink hover:bg-ink/90 dark:bg-surface-dark-elevated dark:hover:bg-surface-dark-elevated/80 active:scale-95 text-on-ink dark:text-on-dark rounded-xl text-xs font-semibold shadow-xs disabled:opacity-40 transition-all cursor-pointer flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>{submitting ? 'Menambahkan...' : 'Simpan Kategori'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
