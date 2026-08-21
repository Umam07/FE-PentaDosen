import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Book, BookOpen, Globe, Zap, BarChart2, AlertCircle, Award } from 'lucide-react';
import { lockBodyScroll, unlockBodyScroll } from '../../../../lib/utils';

interface MetricsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

export default function MetricsGuideModal({ isOpen, onClose, category }: MetricsGuideModalProps) {
  const isInternasional = (category || '').toLowerCase().includes('internasional');
  const isNasional = (category || '').toLowerCase().includes('nasional');

  // Sub-tabs based on category
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    if (isInternasional) {
      setActiveTab('scopus-article');
    } else if (isNasional) {
      setActiveTab('sinta');
    } else {
      setActiveTab('all');
    }
  }, [category, isInternasional, isNasional, isOpen]);

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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-ink-active/60 dark:bg-canvas-dark/80 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xl border border-hairline-light dark:border-hairline-dark flex flex-col overflow-hidden my-auto"
          >
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-hairline-light dark:border-hairline-dark flex items-center justify-between bg-surface-light-raised dark:bg-surface-dark-elevated shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark flex items-center justify-center text-body dark:text-on-dark-soft">
                  <BarChart2 className="w-5 h-5 text-accent dark:text-accent-on-dark" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-ink-heading dark:text-on-dark tracking-tight">
                      {isInternasional
                        ? 'Panduan Metriks Penilaian Scopus (Jurnal Internasional)'
                        : isNasional
                        ? 'Panduan Metriks Penilaian SINTA & Scholar (Jurnal Nasional)'
                        : 'Panduan Metriks Penilaian KPI Publikasi'}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-accent-soft dark:bg-accent/20 text-accent dark:text-accent-on-dark border border-accent/20">
                      {isInternasional ? 'Khusus Scopus' : isNasional ? 'Khusus SINTA & Scholar' : 'Semua Indeksasi'}
                    </span>
                  </div>
                  <p className="text-xs text-muted dark:text-on-dark-muted mt-0.5">
                    {isInternasional
                      ? 'Sistem kalkulasi dan pembobotan poin KPI publikasi Scopus terindeks internasional'
                      : isNasional
                      ? 'Sistem kalkulasi poin publikasi terindeks SINTA (POAK) dan Google Scholar'
                      : 'Sistem kalkulasi dan pembobotan poin publikasi ilmiah'}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Sub-Tabs */}
            <div className="px-6 pt-3 pb-0 border-b border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark flex items-center gap-2 overflow-x-auto">
              {isInternasional ? (
                [
                  { id: 'scopus-article', label: 'Artikel Scopus (Quartile & Peran Penulis)' },
                  { id: 'scopus-non-article', label: 'Scopus Non-Artikel & Sitasi' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === tab.id
                        ? 'border-accent text-accent dark:border-accent-on-dark dark:text-accent-on-dark font-bold'
                        : 'border-transparent text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))
              ) : isNasional ? (
                [
                  { id: 'sinta', label: 'SINTA (POAK Base Points & Peran)' },
                  { id: 'scholar', label: 'Google Scholar (Formula Sitasi & Cut-Off)' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === tab.id
                        ? 'border-accent text-accent dark:border-accent-on-dark dark:text-accent-on-dark font-bold'
                        : 'border-transparent text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))
              ) : (
                [
                  { id: 'all', label: 'Semua Metriks' },
                  { id: 'scopus', label: 'Scopus (Jurnal Internasional)' },
                  { id: 'scholar', label: 'SINTA & Scholar (Jurnal Nasional)' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === tab.id
                        ? 'border-accent text-accent dark:border-accent-on-dark dark:text-accent-on-dark font-bold'
                        : 'border-transparent text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))
              )}
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Header Banner */}
              <div className="p-4 sm:p-5 bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-2xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-ink-heading dark:text-on-dark tracking-tight">
                      {isInternasional
                        ? 'Skema Penilaian Scopus Bereputasi'
                        : isNasional
                        ? 'Skema Penilaian Publikasi Nasional SINTA & Scholar'
                        : 'Skema Kalkulasi Otomatis KPI Publikasi'}
                    </h4>
                    <p className="text-xs text-body dark:text-on-dark-soft leading-relaxed">
                      {isInternasional
                        ? 'Poin publikasi Scopus ditentukan berdasarkan Quartile jurnal (Q1–Q4), jumlah penulis, urutan peran, dan kepemilikan status penulis korespondensi.'
                        : isNasional
                        ? 'Poin publikasi nasional dihitung berdasarkan akreditasi peringkat SINTA (S1–S6) menurut POAK atau melalui formula sitasi Google Scholar.'
                        : 'Poin dihitung secara transparan menurut jumlah penulis, urutan peran, akreditasi/quartile, serta status konfirmasi penulis korespondensi.'}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <span className="inline-flex items-center px-2.5 py-1 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark text-body dark:text-on-dark-soft rounded-lg text-[11px] font-semibold">
                      Sesuai Kebijakan KPI Terbaru
                    </span>
                  </div>
                </div>
              </div>

              {/* ════════════════════════════════════════════════════════════════════════
                  1. JURNAL INTERNASIONAL / SCOPUS SECTIONS
                 ════════════════════════════════════════════════════════════════════════ */}
              {(isInternasional || (!isNasional && (activeTab === 'all' || activeTab === 'scopus' || activeTab === 'scopus-article'))) && (
                <>
                  {/* Quartile Base Points Reference */}
                  <div className="bg-surface-light dark:bg-surface-dark p-5 sm:p-6 rounded-2xl border border-hairline-light dark:border-hairline-dark space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-surface-light-raised dark:bg-surface-dark-elevated flex items-center justify-center text-body dark:text-on-dark-soft shrink-0 border border-hairline-light dark:border-hairline-dark">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-bold text-ink-heading dark:text-on-dark tracking-tight">
                          Base Points Berdasarkan Quartile Scopus
                        </h4>
                        <p className="text-xs text-muted dark:text-on-dark-muted">
                          Bobot maksimal 100% sebelum dikalikan persentase peran penulis
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
                      <div className="p-3 bg-surface-light-raised/50 dark:bg-surface-dark-elevated/30 rounded-xl border border-hairline-light dark:border-hairline-dark">
                        <p className="text-[10px] font-bold text-muted dark:text-on-dark-muted uppercase tracking-wider">Quartile Q1</p>
                        <p className="text-lg sm:text-xl font-bold text-accent dark:text-accent-on-dark mt-0.5 font-mono tabular-nums">40 pts</p>
                      </div>
                      <div className="p-3 bg-surface-light-raised/50 dark:bg-surface-dark-elevated/30 rounded-xl border border-hairline-light dark:border-hairline-dark">
                        <p className="text-[10px] font-bold text-muted dark:text-on-dark-muted uppercase tracking-wider">Quartile Q2</p>
                        <p className="text-lg sm:text-xl font-bold text-accent dark:text-accent-on-dark mt-0.5 font-mono tabular-nums">38 pts</p>
                      </div>
                      <div className="p-3 bg-surface-light-raised/50 dark:bg-surface-dark-elevated/30 rounded-xl border border-hairline-light dark:border-hairline-dark">
                        <p className="text-[10px] font-bold text-muted dark:text-on-dark-muted uppercase tracking-wider">Quartile Q3</p>
                        <p className="text-lg sm:text-xl font-bold text-accent dark:text-accent-on-dark mt-0.5 font-mono tabular-nums">35 pts</p>
                      </div>
                      <div className="p-3 bg-surface-light-raised/50 dark:bg-surface-dark-elevated/30 rounded-xl border border-hairline-light dark:border-hairline-dark">
                        <p className="text-[10px] font-bold text-muted dark:text-on-dark-muted uppercase tracking-wider">Quartile Q4</p>
                        <p className="text-lg sm:text-xl font-bold text-accent dark:text-accent-on-dark mt-0.5 font-mono tabular-nums">33 pts</p>
                      </div>
                      <div className="p-3 bg-surface-light-raised/50 dark:bg-surface-dark-elevated/30 rounded-xl border border-hairline-light dark:border-hairline-dark col-span-2 sm:col-span-1">
                        <p className="text-[10px] font-bold text-muted dark:text-on-dark-muted uppercase tracking-wider">Tanpa Q / Scopus</p>
                        <p className="text-lg sm:text-xl font-bold text-accent dark:text-accent-on-dark mt-0.5 font-mono tabular-nums">33 pts</p>
                      </div>
                    </div>
                  </div>

                  {/* Scopus Article Matrix */}
                  {(activeTab === 'all' || activeTab === 'scopus' || activeTab === 'scopus-article') && (
                    <div className="bg-surface-light dark:bg-surface-dark p-5 sm:p-6 rounded-2xl border border-hairline-light dark:border-hairline-dark space-y-6">
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-surface-light-raised dark:bg-surface-dark-elevated flex items-center justify-center text-body dark:text-on-dark-soft shrink-0 border border-hairline-light dark:border-hairline-dark">
                          <Book className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-ink-heading dark:text-on-dark tracking-tight">
                            Matriks Distribusi Persentase Penulis Scopus (Article)
                          </h4>
                          <p className="text-xs text-muted dark:text-on-dark-muted">
                            Sistem distribusi persentase poin berdasarkan urutan peran dan status korespondensi
                          </p>
                        </div>
                      </div>

                      <div className="space-y-5">
                        {/* Subsection 1: Single Author */}
                        <div className="rounded-xl border border-hairline-light dark:border-hairline-dark bg-surface-light-raised/50 dark:bg-surface-dark-elevated/30 p-4 sm:p-5 space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-surface-light-raised dark:bg-surface-dark flex items-center justify-center text-[10px] font-bold text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark">
                              1
                            </span>
                            <h5 className="text-xs font-bold text-ink-heading dark:text-on-dark uppercase tracking-wider">
                              Penulis Tunggal (Single Author)
                            </h5>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="border-b border-hairline-light dark:border-hairline-dark">
                                  <th className="pb-2.5 font-bold text-[10px] text-muted dark:text-on-dark-muted uppercase tracking-wider">Kategori</th>
                                  <th className="pb-2.5 px-3 font-bold text-[10px] text-muted dark:text-on-dark-muted uppercase tracking-wider text-right">Base Points</th>
                                  <th className="pb-2.5 px-3 font-bold text-[10px] text-muted dark:text-on-dark-muted uppercase tracking-wider text-center">Jumlah Penulis</th>
                                  <th className="pb-2.5 px-3 font-bold text-[10px] text-muted dark:text-on-dark-muted uppercase tracking-wider">Peran</th>
                                  <th className="pb-2.5 font-bold text-[10px] text-muted dark:text-on-dark-muted uppercase tracking-wider text-right">Persentase Poin</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-hairline-light-soft dark:divide-hairline-dark-soft text-body dark:text-on-dark-soft">
                                <tr>
                                  <td className="py-2.5 font-medium">Semua Quartile (Q1 - Q4)</td>
                                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">100%</td>
                                  <td className="py-2.5 px-3 text-center font-mono tabular-nums">1</td>
                                  <td className="py-2.5 px-3 font-semibold text-ink-heading dark:text-on-dark">Single Author</td>
                                  <td className="py-2.5 text-right font-bold font-mono tabular-nums text-accent dark:text-accent-on-dark">100%</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Subsection 2: Author = 2 */}
                        <div className="rounded-xl border border-hairline-light dark:border-hairline-dark bg-surface-light-raised/50 dark:bg-surface-dark-elevated/30 p-4 sm:p-5 space-y-4">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-surface-light-raised dark:bg-surface-dark flex items-center justify-center text-[10px] font-bold text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark">
                              2
                            </span>
                            <h5 className="text-xs font-bold text-ink-heading dark:text-on-dark uppercase tracking-wider">
                              Jumlah Penulis = 2 Orang
                            </h5>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Sub-Section 2a: First = Corresponding */}
                            <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-3.5 sm:p-4 border border-hairline-light dark:border-hairline-dark space-y-2">
                              <h6 className="text-[11px] font-semibold text-body-strong dark:text-on-dark uppercase tracking-wider flex items-center gap-1.5">
                                <span className="px-1.5 py-0.5 rounded bg-surface-light-raised dark:bg-surface-dark text-[10px] font-mono font-bold text-muted dark:text-on-dark-muted border border-hairline-light dark:border-hairline-dark">
                                  2a
                                </span>
                                First Author = Corresponding Author
                              </h6>
                              <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-xs">
                                  <thead>
                                    <tr className="border-b border-hairline-light dark:border-hairline-dark">
                                      <th className="pb-2 font-bold text-[10px] text-muted dark:text-on-dark-muted uppercase tracking-wider">Role</th>
                                      <th className="pb-2 font-bold text-[10px] text-muted dark:text-on-dark-muted uppercase tracking-wider text-right">Persentase</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-hairline-light-soft dark:divide-hairline-dark-soft text-body dark:text-on-dark-soft">
                                    <tr>
                                      <td className="py-2 font-semibold text-ink-heading dark:text-on-dark">First + Corresponding</td>
                                      <td className="py-2 text-right font-bold font-mono tabular-nums text-accent dark:text-accent-on-dark">60%</td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 font-normal text-muted dark:text-on-dark-muted">Co-Author / Member</td>
                                      <td className="py-2 text-right font-bold font-mono tabular-nums text-accent dark:text-accent-on-dark">40%</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* Sub-Section 2b: First != Corresponding */}
                            <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-3.5 sm:p-4 border border-hairline-light dark:border-hairline-dark space-y-2">
                              <h6 className="text-[11px] font-semibold text-body-strong dark:text-on-dark uppercase tracking-wider flex items-center gap-1.5">
                                <span className="px-1.5 py-0.5 rounded bg-surface-light-raised dark:bg-surface-dark text-[10px] font-mono font-bold text-muted dark:text-on-dark-muted border border-hairline-light dark:border-hairline-dark">
                                  2b
                                </span>
                                First Author ≠ Corresponding Author
                              </h6>
                              <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-xs">
                                  <thead>
                                    <tr className="border-b border-hairline-light dark:border-hairline-dark">
                                      <th className="pb-2 font-bold text-[10px] text-muted dark:text-on-dark-muted uppercase tracking-wider">Role</th>
                                      <th className="pb-2 font-bold text-[10px] text-muted dark:text-on-dark-muted uppercase tracking-wider text-right">Persentase</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-hairline-light-soft dark:divide-hairline-dark-soft text-body dark:text-on-dark-soft">
                                    <tr>
                                      <td className="py-2 font-semibold text-ink-heading dark:text-on-dark">First Author</td>
                                      <td className="py-2 text-right font-bold font-mono tabular-nums text-accent dark:text-accent-on-dark">50%</td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 font-semibold text-ink-heading dark:text-on-dark">Member + Corresponding</td>
                                      <td className="py-2 text-right font-bold font-mono tabular-nums text-accent dark:text-accent-on-dark">50%</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Subsection 3: Author > 2 */}
                        <div className="rounded-xl border border-hairline-light dark:border-hairline-dark bg-surface-light-raised/50 dark:bg-surface-dark-elevated/30 p-4 sm:p-5 space-y-4">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-surface-light-raised dark:bg-surface-dark flex items-center justify-center text-[10px] font-bold text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark">
                              3
                            </span>
                            <h5 className="text-xs font-bold text-ink-heading dark:text-on-dark uppercase tracking-wider">
                              Jumlah Penulis &gt; 2 Orang
                            </h5>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Sub-Section 3a */}
                            <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-3.5 sm:p-4 border border-hairline-light dark:border-hairline-dark space-y-2">
                              <h6 className="text-[11px] font-semibold text-body-strong dark:text-on-dark uppercase tracking-wider flex items-center gap-1.5">
                                <span className="px-1.5 py-0.5 rounded bg-surface-light-raised dark:bg-surface-dark text-[10px] font-mono font-bold text-muted dark:text-on-dark-muted border border-hairline-light dark:border-hairline-dark">
                                  3a
                                </span>
                                First Author = Corresponding Author
                              </h6>
                              <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-xs">
                                  <thead>
                                    <tr className="border-b border-hairline-light dark:border-hairline-dark">
                                      <th className="pb-2 font-bold text-[10px] text-muted dark:text-on-dark-muted uppercase tracking-wider">Role</th>
                                      <th className="pb-2 font-bold text-[10px] text-muted dark:text-on-dark-muted uppercase tracking-wider text-right">Persentase</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-hairline-light-soft dark:divide-hairline-dark-soft text-body dark:text-on-dark-soft">
                                    <tr>
                                      <td className="py-2 font-semibold text-ink-heading dark:text-on-dark">First + Corresponding</td>
                                      <td className="py-2 text-right font-bold font-mono tabular-nums text-accent dark:text-accent-on-dark">60%</td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 font-normal text-muted dark:text-on-dark-muted">Co-Authors / Member</td>
                                      <td className="py-2 text-right font-bold font-mono tabular-nums text-accent dark:text-accent-on-dark">(40% ÷ [n - 1])</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* Sub-Section 3b */}
                            <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-3.5 sm:p-4 border border-hairline-light dark:border-hairline-dark space-y-2">
                              <h6 className="text-[11px] font-semibold text-body-strong dark:text-on-dark uppercase tracking-wider flex items-center gap-1.5">
                                <span className="px-1.5 py-0.5 rounded bg-surface-light-raised dark:bg-surface-dark text-[10px] font-mono font-bold text-muted dark:text-on-dark-muted border border-hairline-light dark:border-hairline-dark">
                                  3b
                                </span>
                                First Author ≠ Corresponding Author
                              </h6>
                              <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-xs">
                                  <thead>
                                    <tr className="border-b border-hairline-light dark:border-hairline-dark">
                                      <th className="pb-2 font-bold text-[10px] text-muted dark:text-on-dark-muted uppercase tracking-wider">Role</th>
                                      <th className="pb-2 font-bold text-[10px] text-muted dark:text-on-dark-muted uppercase tracking-wider text-right">Persentase</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-hairline-light-soft dark:divide-hairline-dark-soft text-body dark:text-on-dark-soft">
                                    <tr>
                                      <td className="py-2 font-semibold text-ink-heading dark:text-on-dark">First Author</td>
                                      <td className="py-2 text-right font-bold font-mono tabular-nums text-accent dark:text-accent-on-dark">40%</td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 font-semibold text-ink-heading dark:text-on-dark">Member + Corresponding</td>
                                      <td className="py-2 text-right font-bold font-mono tabular-nums text-accent dark:text-accent-on-dark">40%</td>
                                    </tr>
                                    <tr>
                                      <td className="py-2 font-normal text-muted dark:text-on-dark-muted">Co-Authors Lainnya</td>
                                      <td className="py-2 text-right font-bold font-mono tabular-nums text-accent dark:text-accent-on-dark">(20% ÷ [n - 2])</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Subsection 4: Fallback */}
                        <div className="rounded-xl border border-hairline-light dark:border-hairline-dark bg-surface-light-raised/50 dark:bg-surface-dark-elevated/30 p-4 sm:p-5 space-y-3">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-muted dark:text-on-dark-muted shrink-0" />
                            <h5 className="text-xs font-bold text-ink-heading dark:text-on-dark uppercase tracking-wider">
                              Fallback (Korespondensi Belum Dikonfirmasi)
                            </h5>
                          </div>
                          <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-3.5 sm:p-4 border border-hairline-light dark:border-hairline-dark">
                            <div className="overflow-x-auto">
                              <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                  <tr className="border-b border-hairline-light dark:border-hairline-dark">
                                    <th className="pb-2 font-bold text-[10px] text-muted dark:text-on-dark-muted uppercase tracking-wider">Role</th>
                                    <th className="pb-2 font-bold text-[10px] text-muted dark:text-on-dark-muted uppercase tracking-wider text-right">Persentase Default</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-hairline-light-soft dark:divide-hairline-dark-soft text-body dark:text-on-dark-soft">
                                  <tr>
                                    <td className="py-2 font-semibold text-ink-heading dark:text-on-dark">First Author</td>
                                    <td className="py-2 text-right font-bold font-mono tabular-nums text-accent dark:text-accent-on-dark">60%</td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 font-normal text-muted dark:text-on-dark-muted">Co-Authors / Anggota</td>
                                    <td className="py-2 text-right font-bold font-mono tabular-nums text-accent dark:text-accent-on-dark">(40% ÷ [n - 1])</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Scopus Non-Article & Citations */}
                  {(activeTab === 'all' || activeTab === 'scopus' || activeTab === 'scopus-non-article') && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Non-Article Card */}
                      <div className="bg-surface-light dark:bg-surface-dark p-5 sm:p-6 rounded-2xl border border-hairline-light dark:border-hairline-dark space-y-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-surface-light-raised dark:bg-surface-dark-elevated flex items-center justify-center text-body dark:text-on-dark-soft shrink-0 border border-hairline-light dark:border-hairline-dark">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-ink-heading dark:text-on-dark tracking-tight">Scopus Non-Article</h4>
                            <p className="text-xs text-muted dark:text-on-dark-muted">Proceeding, Review, Book Chapter, dll.</p>
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="border-b border-hairline-light dark:border-hairline-dark">
                                <th className="pb-2.5 font-bold text-[10px] text-muted dark:text-on-dark-muted uppercase tracking-wider">Kategori Peran</th>
                                <th className="pb-2.5 font-bold text-[10px] text-muted dark:text-on-dark-muted uppercase tracking-wider text-right">Poin KPI</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-hairline-light-soft dark:divide-hairline-dark-soft text-body dark:text-on-dark-soft">
                              <tr>
                                <td className="py-2.5 font-medium">Single Author</td>
                                <td className="py-2.5 text-right font-bold font-mono tabular-nums text-accent dark:text-accent-on-dark">30 Pts</td>
                              </tr>
                              <tr>
                                <td className="py-2.5 font-medium">First Author (Penulis Utama)</td>
                                <td className="py-2.5 text-right font-bold font-mono tabular-nums text-accent dark:text-accent-on-dark">18 Pts</td>
                              </tr>
                              <tr>
                                <td className="py-2.5 font-medium">Member Author (Anggota)</td>
                                <td className="py-2.5 text-right font-bold font-mono tabular-nums text-accent dark:text-accent-on-dark">12 ÷ n Pts</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Citations Card */}
                      <div className="bg-surface-light dark:bg-surface-dark p-5 sm:p-6 rounded-2xl border border-hairline-light dark:border-hairline-dark space-y-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-surface-light-raised dark:bg-surface-dark-elevated flex items-center justify-center text-body dark:text-on-dark-soft shrink-0 border border-hairline-light dark:border-hairline-dark">
                            <Zap className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-ink-heading dark:text-on-dark tracking-tight">Metriks Sitasi Scopus</h4>
                            <p className="text-xs text-muted dark:text-on-dark-muted">Dampak sitasi publikasi Scopus</p>
                          </div>
                        </div>

                        <div className="space-y-3 text-xs">
                          <div className="p-3.5 bg-surface-light-raised/60 dark:bg-surface-dark-elevated/30 border border-hairline-light dark:border-hairline-dark rounded-xl space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-md bg-surface-light dark:bg-surface-dark text-body dark:text-on-dark-soft flex items-center justify-center text-[10px] font-bold border border-hairline-light dark:border-hairline-dark">
                                1
                              </span>
                              <p className="font-semibold text-ink-heading dark:text-on-dark">Poin Sitasi Terbagi</p>
                            </div>
                            <p className="text-body dark:text-on-dark-soft pl-7 leading-relaxed">
                              Setiap sitasi bernilai 1 poin dan dibagi secara proporsional dengan jumlah penulis (<code className="px-1 py-0.5 rounded bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark font-mono text-[10px]">Poin = Sitasi / Penulis</code>).
                            </p>
                          </div>

                          <div className="p-3.5 bg-surface-light-raised/60 dark:bg-surface-dark-elevated/30 border border-hairline-light dark:border-hairline-dark rounded-xl space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-md bg-surface-light dark:bg-surface-dark text-body dark:text-on-dark-soft flex items-center justify-center text-[10px] font-bold border border-hairline-light dark:border-hairline-dark">
                                2
                              </span>
                              <p className="font-semibold text-ink-heading dark:text-on-dark">Bonus Dokumen Tersitasi</p>
                            </div>
                            <p className="text-body dark:text-on-dark-soft pl-7 leading-relaxed">
                              Dokumen yang memiliki minimal 1 sitasi mendapatkan tambahan bonus flat sebesar <strong className="font-bold text-ink-heading dark:text-on-dark">+5 Poin</strong>.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ════════════════════════════════════════════════════════════════════════
                  2. JURNAL NASIONAL / SINTA & SCHOLAR SECTIONS
                 ════════════════════════════════════════════════════════════════════════ */}
              {(isNasional || (!isInternasional && (activeTab === 'all' || activeTab === 'scholar' || activeTab === 'sinta'))) && (
                <div className="space-y-6">
                  {/* SINTA Section */}
                  {(activeTab === 'all' || activeTab === 'scholar' || activeTab === 'sinta') && (
                    <div className="bg-surface-light dark:bg-surface-dark p-5 sm:p-6 rounded-2xl border border-hairline-light dark:border-hairline-dark space-y-6">
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-surface-light-raised dark:bg-surface-dark-elevated flex items-center justify-center text-body dark:text-on-dark-soft shrink-0 border border-hairline-light dark:border-hairline-dark">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-ink-heading dark:text-on-dark tracking-tight">
                            Acuan Poin Akreditasi SINTA (POAK)
                          </h4>
                          <p className="text-xs text-muted dark:text-on-dark-muted">
                            Standar bobot dasar akreditasi Jurnal Nasional &amp; persentase peran penulis
                          </p>
                        </div>
                      </div>

                      {/* SINTA Base Points Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                        <div className="p-3.5 bg-surface-light-raised/50 dark:bg-surface-dark-elevated/30 rounded-xl border border-hairline-light dark:border-hairline-dark">
                          <p className="text-[10px] font-bold text-muted dark:text-on-dark-muted uppercase tracking-wider">SINTA 1 &amp; 2</p>
                          <p className="text-xl font-bold text-accent dark:text-accent-on-dark mt-1 font-mono tabular-nums">25 Pts</p>
                        </div>
                        <div className="p-3.5 bg-surface-light-raised/50 dark:bg-surface-dark-elevated/30 rounded-xl border border-hairline-light dark:border-hairline-dark">
                          <p className="text-[10px] font-bold text-muted dark:text-on-dark-muted uppercase tracking-wider">SINTA 3 &amp; 4</p>
                          <p className="text-xl font-bold text-accent dark:text-accent-on-dark mt-1 font-mono tabular-nums">20 Pts</p>
                        </div>
                        <div className="p-3.5 bg-surface-light-raised/50 dark:bg-surface-dark-elevated/30 rounded-xl border border-hairline-light dark:border-hairline-dark">
                          <p className="text-[10px] font-bold text-muted dark:text-on-dark-muted uppercase tracking-wider">SINTA 5 &amp; 6</p>
                          <p className="text-xl font-bold text-accent dark:text-accent-on-dark mt-1 font-mono tabular-nums">15 Pts</p>
                        </div>
                        <div className="p-3.5 bg-surface-light-raised/50 dark:bg-surface-dark-elevated/30 rounded-xl border border-hairline-light dark:border-hairline-dark">
                          <p className="text-[10px] font-bold text-muted dark:text-on-dark-muted uppercase tracking-wider">Non-SINTA / Lainnya</p>
                          <p className="text-xl font-bold text-accent dark:text-accent-on-dark mt-1 font-mono tabular-nums">10 Pts</p>
                        </div>
                      </div>

                      {/* POAK SINTA Role Distribution Table */}
                      <div className="rounded-xl border border-hairline-light dark:border-hairline-dark bg-surface-light-raised/50 dark:bg-surface-dark-elevated/30 p-4 sm:p-5 space-y-3">
                        <h5 className="text-xs font-bold text-ink-heading dark:text-on-dark uppercase tracking-wider">
                          Distribusi Peran Penulis SINTA (POAK)
                        </h5>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="border-b border-hairline-light dark:border-hairline-dark">
                                <th className="pb-2.5 font-bold text-[10px] text-muted dark:text-on-dark-muted uppercase tracking-wider">Peran Penulis</th>
                                <th className="pb-2.5 font-bold text-[10px] text-muted dark:text-on-dark-muted uppercase tracking-wider text-center">Persentase Poin</th>
                                <th className="pb-2.5 font-bold text-[10px] text-muted dark:text-on-dark-muted uppercase tracking-wider text-right">Keterangan</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-hairline-light-soft dark:divide-hairline-dark-soft text-body dark:text-on-dark-soft">
                              <tr>
                                <td className="py-2.5 font-semibold text-ink-heading dark:text-on-dark">Penulis Tunggal (Single Author)</td>
                                <td className="py-2.5 text-center font-bold font-mono text-accent dark:text-accent-on-dark">100%</td>
                                <td className="py-2.5 text-right text-muted dark:text-on-dark-muted">Memperoleh 100% Base Points</td>
                              </tr>
                              <tr>
                                <td className="py-2.5 font-semibold text-ink-heading dark:text-on-dark">Penulis Utama / First Author</td>
                                <td className="py-2.5 text-center font-bold font-mono text-accent dark:text-accent-on-dark">60%</td>
                                <td className="py-2.5 text-right text-muted dark:text-on-dark-muted">60% dari Base Points</td>
                              </tr>
                              <tr>
                                <td className="py-2.5 font-medium">Penulis Pendamping / Co-Authors</td>
                                <td className="py-2.5 text-center font-bold font-mono text-accent dark:text-accent-on-dark">40% ÷ n</td>
                                <td className="py-2.5 text-right text-muted dark:text-on-dark-muted">40% dibagi rata kepada seluruh anggota</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Google Scholar Card */}
                  {(activeTab === 'all' || activeTab === 'scholar') && (
                    <div className="bg-surface-light dark:bg-surface-dark p-5 sm:p-6 rounded-2xl border border-hairline-light dark:border-hairline-dark space-y-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-surface-light-raised dark:bg-surface-dark-elevated flex items-center justify-center text-body dark:text-on-dark-soft shrink-0 border border-hairline-light dark:border-hairline-dark">
                          <Globe className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-ink-heading dark:text-on-dark tracking-tight">
                            Google Scholar (GS Formula)
                          </h4>
                          <p className="text-xs text-muted dark:text-on-dark-muted">
                            Matriks Penyelarasan Publikasi Google Scholar
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="divide-y divide-hairline-light-soft dark:divide-hairline-dark-soft text-xs">
                          <div className="flex justify-between items-center py-2.5">
                            <span className="text-body dark:text-on-dark-soft font-medium">Poin Per Dokumen Scholar (GS Document)</span>
                            <span className="font-bold font-mono tabular-nums text-accent dark:text-accent-on-dark">+0.50 Pts</span>
                          </div>
                          <div className="flex justify-between items-center py-2.5">
                            <span className="text-body dark:text-on-dark-soft font-medium">Bonus Dokumen Tersitasi (Citations &gt; 0)</span>
                            <span className="font-bold font-mono tabular-nums text-accent dark:text-accent-on-dark">+0.50 Pts</span>
                          </div>
                          <div className="flex justify-between items-center py-2.5">
                            <span className="text-body dark:text-on-dark-soft font-medium">Poin Per Sitasi (GS Citation)</span>
                            <span className="font-bold font-mono tabular-nums text-accent dark:text-accent-on-dark">+0.25 Pts / Sitasi</span>
                          </div>
                        </div>

                        <div className="p-4 bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-xl space-y-2">
                          <p className="text-[10px] font-bold text-muted dark:text-on-dark-muted uppercase tracking-wider">
                            Ketentuan Batas Maksimal (Cut Off)
                          </p>
                          <p className="text-xs text-body dark:text-on-dark-soft leading-relaxed">
                            Penghitungan poin dari jumlah sitasi Google Scholar dibatasi maksimal (cut-off) pada <strong className="font-bold text-ink-heading dark:text-on-dark">500 sitasi</strong> per dokumen publikasi.
                          </p>
                          <div className="pt-1">
                            <span className="inline-block px-3 py-1.5 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-lg text-[11px] font-mono font-semibold text-ink-heading dark:text-on-dark">
                              Poin = 0.50 + (Sitasi &gt; 0 ? 0.50 : 0) + (Min(Sitasi, 500) × 0.25)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-hairline-light dark:border-hairline-dark bg-surface-light-raised dark:bg-surface-dark-elevated flex justify-end shrink-0">
              <button
                onClick={onClose}
                className="px-5 py-2 bg-ink hover:bg-ink-hover dark:bg-on-dark dark:hover:bg-white text-on-ink dark:text-ink rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
