import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Layers, Zap, ShieldCheck, Book, FileSpreadsheet } from 'lucide-react';
import { cmsDashboardService } from '../services/cmsDashboardService';

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
          className="fixed inset-0 bg-gray-950/50 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-xl bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-gray-200 dark:border-zinc-800 p-6 md:p-8"
        >
          {/* Header Modal */}
          <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-100 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 border border-primary-200/50 dark:border-primary-800/40">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100 tracking-tight">
                  Tambah Kategori KPI Baru
                </h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                  Tentukan grup, sub-kategori, dan bobot poin resmi untuk master data KPI.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 1. Pilih Kelompok / Grup Utama */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-800 dark:text-zinc-200 uppercase tracking-wider">
                1. Kelompok Utama Poin
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'scopus', label: 'Publikasi', icon: Zap, color: 'text-amber-500' },
                  { id: 'hki', label: 'HKI', icon: ShieldCheck, color: 'text-purple-500' },
                  { id: 'buku', label: 'Buku', icon: Book, color: 'text-blue-500' },
                  { id: 'lain', label: 'Lainnya', icon: FileSpreadsheet, color: 'text-emerald-500' }
                ].map((g) => {
                  const isSelected = mainGroup === g.id;
                  const Icon = g.icon;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => handleGroupChange(g.id as any)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-primary-50/80 dark:bg-primary-950/40 border-primary-500 text-primary-700 dark:text-primary-300 ring-2 ring-primary-500/20'
                          : 'bg-gray-50/70 dark:bg-zinc-800/60 border-gray-200/80 dark:border-zinc-700/80 text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
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
              <label className="text-xs font-bold text-gray-800 dark:text-zinc-200 uppercase tracking-wider">
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
                          ? 'bg-primary-600 text-white border-primary-600 shadow-xs'
                          : 'bg-gray-50 dark:bg-zinc-800/70 border-gray-200 dark:border-zinc-700/70 text-gray-700 dark:text-zinc-300 hover:bg-gray-100'
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
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-800/70 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-medium text-gray-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              )}
            </div>

            {/* 3. Nama Kategori (Base Name) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-800 dark:text-zinc-200 uppercase tracking-wider">
                3. Nama Kategori
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Q1, Paten Sederhana, Buku Monograf..."
                value={baseName}
                onChange={(e) => setBaseName(e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-medium text-gray-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              />
            </div>

            {/* 4. Peran Penulis / Tipe Bobot & Nilai Poin */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-8 space-y-1.5">
                <label className="text-xs font-bold text-gray-800 dark:text-zinc-200 uppercase tracking-wider">
                  4. Peran Penulis
                </label>
                <select
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                >
                  <option value="first">First Author (Penulis Pertama)</option>
                  <option value="member">Member Author (Penulis Anggota)</option>
                  <option value="single">Single Author (Penulis Mandiri)</option>
                  <option value="standalone">Standalone (Tanpa Skema Penulis)</option>
                </select>
              </div>

              <div className="sm:col-span-4 space-y-1.5">
                <label className="text-xs font-bold text-gray-800 dark:text-zinc-200 uppercase tracking-wider">
                  5. Bobot Poin
                </label>
                <input
                  type="number"
                  required
                  placeholder="Cth: 40"
                  value={weightValue}
                  onChange={(e) => setWeightValue(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-center text-gray-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Footer Modal Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 active:scale-98 text-white rounded-xl text-xs font-semibold shadow-xs disabled:opacity-40 transition-all cursor-pointer flex items-center gap-2"
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
