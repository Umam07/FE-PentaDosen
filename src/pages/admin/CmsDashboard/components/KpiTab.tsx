import React, { useState } from 'react';
import { 
  Trash2, Save, Plus, Calendar, ShieldCheck, 
  Book, Beaker, BookOpen, Zap, FileSpreadsheet, Layers,
  ChevronDown, ChevronUp, Search, X, HelpCircle, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useKpiTab } from '../hooks/useKpiTab';
import KpiDeleteModal from './KpiDeleteModal';
import KpiAddCategoryModal from './KpiAddCategoryModal';
import { KpiWeight } from '../types/cmsDashboard.types';

interface KpiTabProps {
  triggerMessage: (text: string, type?: 'success' | 'error') => void;
}

interface PairedRow {
  baseName: string;
  firstAuthor?: KpiWeight;
  memberAuthor?: KpiWeight;
  singleAuthor?: KpiWeight;
  standalone?: KpiWeight;
}

interface SubGroup {
  id: string;
  title: string;
  items: PairedRow[];
}

/**
 * Tab Pengaturan Bobot Poin KPI & Periode Akreditasi.
 */
export default function KpiTab({ triggerMessage }: KpiTabProps) {
  const {
    loading,
    savingWeights,
    activeGroup,
    setActiveGroup,
    periodStart,
    setPeriodStart,
    periodEnd,
    setPeriodEnd,
    periodLabel,
    setPeriodLabel,
    savingPeriod,
    deleteCategory,
    setDeleteCategory,
    filteredWeights,
    handleWeightChangeByCategory,
    handleSaveWeights,
    handleSavePeriod,
    fetchKpiData
  } = useKpiTab(triggerMessage);

  // State untuk pencarian kategori lokal, accordion collapse, & modal popup
  const [searchQuery, setSearchQuery] = useState('');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'article-quartile': true,
    'hyperauthor': false,
    'non-article': false,
    'metrik-lain': false
  });

  const toggleGroup = (groupId: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  // Helper untuk memecah & memadankan kategori ke dalam 4 sub-group utama
  const buildSubGroups = (items: KpiWeight[], query: string): SubGroup[] => {
    const q = query.toLowerCase().trim();
    const filtered = items.filter(w => !q || w.category.toLowerCase().includes(q));

    const groups: SubGroup[] = [
      { id: 'article-quartile', title: 'Article by Quartile', items: [] },
      { id: 'hyperauthor', title: 'Hyperauthor', items: [] },
      { id: 'non-article', title: 'Non Article', items: [] },
      { id: 'metrik-lain', title: 'Metrik & Kategori Lain', items: [] },
    ];

    const mapPair = (catList: KpiWeight[], targetGroupId: string) => {
      const pairMap = new Map<string, PairedRow>();

      catList.forEach(w => {
        let base = w.category;
        let role: 'first' | 'member' | 'single' | 'standalone' = 'standalone';

        if (/first author/i.test(w.category)) {
          base = w.category.replace(/\s*\(?first author\)?/i, '').trim();
          role = 'first';
        } else if (/member author/i.test(w.category)) {
          base = w.category.replace(/\s*\(?member author\)?/i, '').trim();
          role = 'member';
        } else if (/single author/i.test(w.category)) {
          base = w.category.replace(/\s*\(?single author\)?/i, '').trim();
          role = 'single';
        }

        if (!pairMap.has(base)) {
          pairMap.set(base, { baseName: base });
        }
        const row = pairMap.get(base)!;

        if (role === 'first') row.firstAuthor = w;
        else if (role === 'member') row.memberAuthor = w;
        else if (role === 'single') row.singleAuthor = w;
        else row.standalone = w;
      });

      const target = groups.find(g => g.id === targetGroupId);
      if (target) {
        target.items = Array.from(pairMap.values());
      }
    };

    const quartileItems: KpiWeight[] = [];
    const hyperItems: KpiWeight[] = [];
    const nonArticleItems: KpiWeight[] = [];
    const otherItems: KpiWeight[] = [];

    filtered.forEach(w => {
      const catLower = w.category.toLowerCase();
      if (catLower.includes('quartile') || catLower.includes('q1') || catLower.includes('q2') || catLower.includes('q3') || catLower.includes('q4')) {
        quartileItems.push(w);
      } else if (catLower.includes('hyperauthor') || catLower.includes('hyper author')) {
        hyperItems.push(w);
      } else if (catLower.includes('non-article') || catLower.includes('non article')) {
        nonArticleItems.push(w);
      } else {
        otherItems.push(w);
      }
    });

    mapPair(quartileItems, 'article-quartile');
    mapPair(hyperItems, 'hyperauthor');
    mapPair(nonArticleItems, 'non-article');
    mapPair(otherItems, 'metrik-lain');

    return groups.filter(g => g.items.length > 0);
  };

  const subGroups = buildSubGroups(filteredWeights, searchQuery);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* SISI KIRI (Col-8): Konfigurasi Bobot Master Data */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Bobot Point Table Card */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-hairline-light dark:border-hairline-dark p-5 sm:p-6 space-y-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-surface-light-raised dark:bg-surface-dark-elevated text-ink-heading dark:text-on-dark border border-hairline-light-soft dark:border-hairline-dark-soft">
                  <Layers className="w-4 h-4 text-accent dark:text-accent-on-dark" />
                </div>
                <h3 className="text-base font-bold text-ink-heading dark:text-on-dark tracking-tight">
                  Bobot KPI Master Data
                </h3>
              </div>
              <p className="text-xs text-muted dark:text-on-dark-muted mt-1">
                Atur besaran poin dinamis untuk masing-masing kategori berkas &amp; publikasi.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => setIsGuideOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-surface-light hover:bg-surface-light-raised dark:bg-surface-dark dark:hover:bg-surface-dark-elevated text-ink-heading dark:text-on-dark rounded-xl text-xs font-semibold transition-all cursor-pointer border border-hairline-light dark:border-hairline-dark shadow-xs"
                title="Buka Panduan Metriks Penilaian"
              >
                <HelpCircle className="w-4 h-4 text-accent dark:text-accent-on-dark" />
                <span>Panduan Metriks</span>
              </button>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-surface-light hover:bg-surface-light-raised dark:bg-surface-dark dark:hover:bg-surface-dark-elevated text-ink-heading dark:text-on-dark rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer border border-hairline-light dark:border-hairline-dark"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Kategori</span>
              </button>

              <button
                onClick={handleSaveWeights}
                disabled={savingWeights || loading}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-ink hover:bg-ink/90 dark:bg-surface-dark-elevated dark:hover:bg-surface-dark-elevated/80 active:scale-95 text-on-ink dark:text-on-dark rounded-xl text-xs font-semibold shadow-xs disabled:opacity-40 transition-all outline-none cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{savingWeights ? 'Menyimpan...' : 'Simpan Bobot'}</span>
              </button>
            </div>
          </div>

          {/* Group Selector Tabs */}
          <div className="flex flex-wrap gap-1 p-1 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light-soft dark:border-hairline-dark-soft">
            {[
              { id: 'scopus', label: 'Scopus & SINTA', icon: Zap, color: 'text-chart-scholar' },
              { id: 'hki', label: 'HKI', icon: ShieldCheck, color: 'text-chart-hki' },
              { id: 'buku', label: 'Buku', icon: Book, color: 'text-chart-buku' },
              { id: 'lain', label: 'Lainnya', icon: FileSpreadsheet, color: 'text-chart-penelitian' }
            ].map(group => {
              const isActive = activeGroup === group.id;
              const Icon = group.icon;
              return (
                <button
                  key={group.id}
                  onClick={() => setActiveGroup(group.id as any)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all outline-none select-none cursor-pointer ${
                    isActive
                      ? 'text-ink-heading dark:text-on-dark font-semibold'
                      : 'text-muted dark:text-on-dark-muted hover:text-ink-heading dark:hover:text-on-dark hover:bg-surface-light/50 dark:hover:bg-surface-dark/50'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-kpi-group-tab"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      className="absolute inset-0 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-lg shadow-xs"
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Icon className={`w-3.5 h-3.5 transition-colors ${group.color}`} />
                    {group.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Filter Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted dark:text-on-dark-muted" />
            <input
              type="text"
              placeholder="Cari kategori (misal: Q1, Hyperauthor, Paten)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-xl text-xs font-medium text-ink-heading dark:text-on-dark placeholder-muted dark:placeholder-on-dark-muted outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-muted hover:text-ink-heading dark:hover:text-on-dark cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* List Container dengan Sub-group Accordion & Paired Columns */}
          <div className="min-h-[280px] space-y-4">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-14 bg-surface-light-raised dark:bg-surface-dark-elevated animate-pulse rounded-xl" />)}
              </div>
            ) : subGroups.length > 0 ? (
              subGroups.map((group) => {
                const isOpen = openGroups[group.id] ?? (group.id === 'article-quartile');

                return (
                  <div 
                    key={group.id}
                    className="border border-hairline-light dark:border-hairline-dark rounded-xl overflow-hidden bg-surface-light dark:bg-surface-dark"
                  >
                    {/* Header Group Accordion */}
                    <button
                      onClick={() => toggleGroup(group.id)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-surface-light-raised dark:bg-surface-dark-elevated hover:bg-surface-light dark:hover:bg-surface-dark transition-colors select-none text-left cursor-pointer border-b border-hairline-light-soft dark:border-hairline-dark-soft"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-ink-heading dark:text-on-dark tracking-tight">
                          {group.title}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-surface-light dark:bg-surface-dark border border-hairline-light-soft dark:border-hairline-dark-soft text-muted dark:text-on-dark-muted">
                          {group.items.length} baris
                        </span>
                      </div>
                      <div className="text-muted dark:text-on-dark-muted">
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {/* Content Accordion Table */}
                    {isOpen && (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-hairline-light-soft dark:divide-hairline-dark-soft text-xs">
                          <thead className="bg-surface-light-raised dark:bg-surface-dark-elevated border-b border-hairline-light dark:border-hairline-dark">
                            <tr>
                              <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider">Kategori</th>
                              <th className="px-3 py-3.5 text-center w-36 text-xs font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider">First Author / Single</th>
                              <th className="px-3 py-3.5 text-center w-36 text-xs font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider">Member Author</th>
                              <th className="px-3 py-3.5 text-right w-16 text-xs font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-hairline-light-soft dark:divide-hairline-dark-soft bg-surface-light dark:bg-surface-dark">
                            {group.items.map((row) => (
                              <tr 
                                key={row.baseName}
                                className="hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-colors"
                              >
                                {/* Kolom Kategori */}
                                <td className="px-4 py-3 font-medium text-ink-heading dark:text-on-dark">
                                  <span>{row.baseName}</span>
                                </td>

                                {/* Kolom 1: First Author atau Single Author atau Standalone */}
                                <td className="px-3 py-3 text-center">
                                  {row.firstAuthor ? (
                                    <div className="flex items-center justify-center gap-1.5">
                                      <span className="text-[10px] text-muted dark:text-on-dark-muted font-normal hidden sm:inline">First:</span>
                                      <input
                                        type="number"
                                        value={row.firstAuthor.weight_value}
                                        onChange={(e) => handleWeightChangeByCategory(row.firstAuthor!.category, parseInt(e.target.value) || 0)}
                                        className="w-16 px-2 py-1 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-lg text-center font-mono font-bold text-xs outline-none text-ink-heading dark:text-on-dark focus:ring-1 focus:ring-accent focus:border-accent"
                                      />
                                    </div>
                                  ) : row.singleAuthor ? (
                                    <div className="flex items-center justify-center gap-1.5">
                                      <span className="text-[10px] text-muted dark:text-on-dark-muted font-normal hidden sm:inline">Single:</span>
                                      <input
                                        type="number"
                                        value={row.singleAuthor.weight_value}
                                        onChange={(e) => handleWeightChangeByCategory(row.singleAuthor!.category, parseInt(e.target.value) || 0)}
                                        className="w-16 px-2 py-1 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-lg text-center font-mono font-bold text-xs outline-none text-ink-heading dark:text-on-dark focus:ring-1 focus:ring-accent focus:border-accent"
                                      />
                                    </div>
                                  ) : row.standalone ? (
                                    <input
                                      type="number"
                                      value={row.standalone.weight_value}
                                      onChange={(e) => handleWeightChangeByCategory(row.standalone!.category, parseInt(e.target.value) || 0)}
                                      className="w-16 px-2 py-1 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-lg text-center font-mono font-bold text-xs outline-none text-ink-heading dark:text-on-dark focus:ring-1 focus:ring-accent focus:border-accent"
                                    />
                                  ) : (
                                    <span className="text-muted-soft dark:text-on-dark-muted">-</span>
                                  )}
                                </td>

                                {/* Kolom 2: Member Author */}
                                <td className="px-3 py-3 text-center">
                                  {row.memberAuthor ? (
                                    <div className="flex items-center justify-center gap-1.5">
                                      <span className="text-[10px] text-muted dark:text-on-dark-muted font-normal hidden sm:inline">Member:</span>
                                      <input
                                        type="number"
                                        value={row.memberAuthor.weight_value}
                                        onChange={(e) => handleWeightChangeByCategory(row.memberAuthor!.category, parseInt(e.target.value) || 0)}
                                        className="w-16 px-2 py-1 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-lg text-center font-mono font-bold text-xs outline-none text-ink-heading dark:text-on-dark focus:ring-1 focus:ring-accent focus:border-accent"
                                      />
                                    </div>
                                  ) : (
                                    <span className="text-muted-soft dark:text-on-dark-muted">-</span>
                                  )}
                                </td>

                                {/* Kolom 3: Aksi Hapus */}
                                <td className="px-3 py-3 text-right">
                                  <button
                                    onClick={() => {
                                      const targetCat = row.firstAuthor?.category || row.standalone?.category || row.memberAuthor?.category || row.singleAuthor?.category;
                                      if (targetCat) setDeleteCategory(targetCat);
                                    }}
                                    className="p-1.5 text-error hover:bg-error-soft rounded-lg transition-colors cursor-pointer"
                                    title="Hapus Kategori"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="py-16 border border-dashed border-hairline-light dark:border-hairline-dark rounded-xl text-center text-muted dark:text-on-dark-muted font-medium text-xs flex flex-col items-center justify-center gap-2">
                <FileSpreadsheet className="w-8 h-8 text-muted-soft dark:text-on-dark-muted" />
                <span>Tidak ada kategori yang cocok dengan pencarian/kelompok ini.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SISI KANAN (Col-4): Periode Akreditasi Card */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-hairline-light dark:border-hairline-dark p-6 space-y-5 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-surface-light-raised dark:bg-surface-dark-elevated text-accent dark:text-accent-on-dark border border-hairline-light-soft dark:border-hairline-dark-soft">
                <Calendar className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-ink-heading dark:text-on-dark tracking-tight">
                Periode Akreditasi KPI
              </h3>
            </div>
            <p className="text-xs text-muted dark:text-on-dark-muted mt-1">
              Atur rentang tanggal aktif dokumen yang dinilai untuk penilaian KPI.
            </p>
          </div>

          <form onSubmit={handleSavePeriod} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink-heading dark:text-on-dark">Label Periode</label>
              <input
                type="text"
                required
                placeholder="Contoh: 2025-2027"
                value={periodLabel}
                onChange={(e) => setPeriodLabel(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-xl text-xs font-medium outline-none text-ink-heading dark:text-on-dark focus:ring-1 focus:ring-accent focus:border-accent transition-all"
              />
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ink-heading dark:text-on-dark">Tanggal Mulai</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="date"
                    required
                    value={periodStart}
                    onChange={(e) => setPeriodStart(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-xl text-xs font-medium outline-none text-ink-heading dark:text-on-dark focus:ring-1 focus:ring-accent focus:border-accent transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ink-heading dark:text-on-dark">Tanggal Selesai</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="date"
                    required
                    value={periodEnd}
                    onChange={(e) => setPeriodEnd(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-xl text-xs font-medium outline-none text-ink-heading dark:text-on-dark focus:ring-1 focus:ring-accent focus:border-accent transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={savingPeriod || loading}
              className="w-full py-2.5 bg-ink hover:bg-ink/90 dark:bg-surface-dark-elevated dark:hover:bg-surface-dark-elevated/80 active:scale-95 text-on-ink dark:text-on-dark rounded-xl text-xs font-semibold shadow-xs disabled:opacity-40 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{savingPeriod ? 'Menyimpan...' : 'Perbarui Periode'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* MODAL POPUP: Tambah Kategori KPI Baru */}
      <KpiAddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchKpiData}
        triggerMessage={triggerMessage}
        defaultGroup={activeGroup}
      />

      {/* Delete Category Modal */}
      <KpiDeleteModal
        isOpen={!!deleteCategory}
        onClose={() => setDeleteCategory(null)}
        category={deleteCategory}
        onSuccess={fetchKpiData}
        triggerMessage={triggerMessage}
      />

      {/* MODAL POPUP: Panduan Metriks Penilaian */}
      <AnimatePresence>
        {isGuideOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsGuideOpen(false)}
              className="fixed inset-0 bg-ink/40 dark:bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-3xl bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xl border border-hairline-light dark:border-hairline-dark p-6 md:p-8 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6 pb-4 border-b border-hairline-light-soft dark:border-hairline-dark-soft">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-surface-light-raised dark:bg-surface-dark-elevated text-accent dark:text-accent-on-dark border border-hairline-light-soft dark:border-hairline-dark-soft">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-ink-heading dark:text-on-dark tracking-tight">
                      Panduan Metriks Penilaian
                    </h3>
                    <p className="text-xs text-muted dark:text-on-dark-muted mt-0.5">
                      Referensi lengkap skema otomatisasi poin KPI yang berlaku di sistem.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsGuideOpen(false)}
                  className="p-1.5 text-muted hover:text-ink-heading dark:hover:text-on-dark rounded-xl hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {/* HKI */}
                <div className="p-4 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light-soft dark:border-hairline-dark-soft space-y-2.5">
                  <div className="flex items-center gap-2 font-bold text-sm text-ink-heading dark:text-on-dark">
                    <ShieldCheck className="w-4.5 h-4.5 text-chart-hki shrink-0" />
                    <span>1. Hak Kekayaan Intelektual (HKI)</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-body dark:text-on-dark-soft pt-1 font-mono">
                    <div className="p-2.5 rounded-lg bg-surface-light dark:bg-surface-dark border border-hairline-light-soft dark:border-hairline-dark-soft">Paten: <span className="font-bold text-chart-hki block mt-0.5">40 pts</span></div>
                    <div className="p-2.5 rounded-lg bg-surface-light dark:bg-surface-dark border border-hairline-light-soft dark:border-hairline-dark-soft">Paten Sederhana: <span className="font-bold text-chart-hki block mt-0.5">28 pts</span></div>
                    <div className="p-2.5 rounded-lg bg-surface-light dark:bg-surface-dark border border-hairline-light-soft dark:border-hairline-dark-soft">Merek: <span className="font-bold text-chart-hki block mt-0.5">12 pts</span></div>
                    <div className="p-2.5 rounded-lg bg-surface-light dark:bg-surface-dark border border-hairline-light-soft dark:border-hairline-dark-soft">Hak Cipta: <span className="font-bold text-chart-hki block mt-0.5">5 pts</span></div>
                  </div>
                </div>

                {/* Buku Akademik */}
                <div className="p-4 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light-soft dark:border-hairline-dark-soft space-y-2.5">
                  <div className="flex items-center gap-2 font-bold text-sm text-ink-heading dark:text-on-dark">
                    <Book className="w-4.5 h-4.5 text-chart-buku shrink-0" />
                    <span>2. Buku Akademik</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-body dark:text-on-dark-soft pt-1 font-mono">
                    <div className="p-2.5 rounded-lg bg-surface-light dark:bg-surface-dark border border-hairline-light-soft dark:border-hairline-dark-soft flex justify-between items-center"><span>Buku Referensi:</span> <span className="font-bold text-chart-buku">40 pts</span></div>
                    <div className="p-2.5 rounded-lg bg-surface-light dark:bg-surface-dark border border-hairline-light-soft dark:border-hairline-dark-soft flex justify-between items-center"><span>Buku Ajar:</span> <span className="font-bold text-chart-buku">20 pts</span></div>
                    <div className="p-2.5 rounded-lg bg-surface-light dark:bg-surface-dark border border-hairline-light-soft dark:border-hairline-dark-soft flex justify-between items-center"><span>Buku Monograf:</span> <span className="font-bold text-chart-buku">20 pts</span></div>
                  </div>
                </div>

                {/* Penelitian & Hibah */}
                <div className="p-4 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light-soft dark:border-hairline-dark-soft space-y-2.5">
                  <div className="flex items-center gap-2 font-bold text-sm text-ink-heading dark:text-on-dark">
                    <Beaker className="w-4.5 h-4.5 text-chart-penelitian shrink-0" />
                    <span>3. Penelitian &amp; Hibah</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-body dark:text-on-dark-soft pt-1 font-mono">
                    <div className="p-2.5 rounded-lg bg-surface-light dark:bg-surface-dark border border-hairline-light-soft dark:border-hairline-dark-soft flex justify-between items-center"><span>Hibah Luar Negeri:</span> <span className="font-bold text-chart-penelitian">10 pts</span></div>
                    <div className="p-2.5 rounded-lg bg-surface-light dark:bg-surface-dark border border-hairline-light-soft dark:border-hairline-dark-soft flex justify-between items-center"><span>Hibah Eksternal (Dikti):</span> <span className="font-bold text-chart-penelitian">6 pts</span></div>
                    <div className="p-2.5 rounded-lg bg-surface-light dark:bg-surface-dark border border-hairline-light-soft dark:border-hairline-dark-soft flex justify-between items-center"><span>Internal Institusi:</span> <span className="font-bold text-chart-penelitian">3 pts</span></div>
                  </div>
                </div>

                {/* Google Scholar */}
                <div className="p-4 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light-soft dark:border-hairline-dark-soft space-y-2.5">
                  <div className="flex items-center gap-2 font-bold text-sm text-ink-heading dark:text-on-dark">
                    <BookOpen className="w-4.5 h-4.5 text-chart-scholar shrink-0" />
                    <span>4. Publikasi Google Scholar</span>
                  </div>
                  <p className="text-xs text-body dark:text-on-dark-soft leading-relaxed p-2.5 rounded-lg bg-surface-light dark:bg-surface-dark border border-hairline-light-soft dark:border-hairline-dark-soft font-mono">
                    Poin dasar <span className="font-bold text-chart-scholar">0.5</span> + bonus tersitasi <span className="font-bold text-chart-scholar">0.5</span> + sitasi (<span className="font-bold text-chart-scholar">0.25</span> / sitasi, max 500).
                  </p>
                </div>

                {/* Scopus & SINTA */}
                <div className="p-4 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light-soft dark:border-hairline-dark-soft space-y-2.5">
                  <div className="flex items-center gap-2 font-bold text-sm text-ink-heading dark:text-on-dark">
                    <Zap className="w-4.5 h-4.5 text-chart-scholar shrink-0" />
                    <span>5. Publikasi Scopus &amp; SINTA</span>
                  </div>
                  <div className="space-y-2 text-xs text-body dark:text-on-dark-soft leading-relaxed">
                    <p className="font-semibold text-ink-heading dark:text-on-dark">Base points per Quartile (Article):</p>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 font-bold font-mono text-chart-scholar">
                      <div className="p-2 rounded-lg bg-surface-light dark:bg-surface-dark border border-hairline-light-soft dark:border-hairline-dark-soft text-center">Q1: 40 pts</div>
                      <div className="p-2 rounded-lg bg-surface-light dark:bg-surface-dark border border-hairline-light-soft dark:border-hairline-dark-soft text-center">Q2: 38 pts</div>
                      <div className="p-2 rounded-lg bg-surface-light dark:bg-surface-dark border border-hairline-light-soft dark:border-hairline-dark-soft text-center">Q3: 35 pts</div>
                      <div className="p-2 rounded-lg bg-surface-light dark:bg-surface-dark border border-hairline-light-soft dark:border-hairline-dark-soft text-center">Q4: 33 pts</div>
                      <div className="p-2 rounded-lg bg-surface-light dark:bg-surface-dark border border-hairline-light-soft dark:border-hairline-dark-soft text-center">None: 33 pts</div>
                      <div className="p-2 rounded-lg bg-surface-light dark:bg-surface-dark border border-hairline-light-soft dark:border-hairline-dark-soft text-center">Non-Ar: 30</div>
                    </div>
                    <p className="p-2.5 rounded-lg bg-surface-light dark:bg-surface-dark border border-hairline-light-soft dark:border-hairline-dark-soft text-muted dark:text-on-dark-muted mt-2">
                      Skema peran penulis (60/40): Single Author = 100%, First Author = 60%, Member = 40% / (totalAuthors - 1).
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-hairline-light-soft dark:border-hairline-dark-soft flex justify-end">
                <button
                  onClick={() => setIsGuideOpen(false)}
                  className="px-5 py-2.5 bg-surface-light hover:bg-surface-light-raised dark:bg-surface-dark dark:hover:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark text-ink-heading dark:text-on-dark rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Tutup Panduan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
