import React, { useState, useEffect } from 'react';
import { 
  Trash2, Save, Plus, Calendar, Award, ShieldCheck, 
  Book, Beaker, BookOpen, Zap, FileSpreadsheet 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function KpiTab({ triggerMessage }: { triggerMessage: (text: string, type?: 'success' | 'error') => void }) {
  const [weights, setWeights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingWeights, setSavingWeights] = useState(false);

  // Group selection state
  const [activeGroup, setActiveGroup] = useState<'scopus' | 'hki' | 'buku' | 'lain'>('scopus');

  // Period settings
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [periodLabel, setPeriodLabel] = useState('');
  const [savingPeriod, setSavingPeriod] = useState(false);

  // New category state
  const [newCategory, setNewCategory] = useState('');
  const [newWeight, setNewWeight] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);

  const fetchKpiData = async () => {
    setLoading(true);
    try {
      const resW = await fetch('/api/cms/weights');
      const dataW = await resW.json();
      setWeights(dataW.weights || []);

      const resP = await fetch('/api/cms/settings');
      const dataP = await resP.json();
      setPeriodStart(dataP.kpi_period_start || '');
      setPeriodEnd(dataP.kpi_period_end || '');
      setPeriodLabel(dataP.kpi_period_label || '');
    } catch (e) {
      triggerMessage('Gagal mengambil data master KPI.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKpiData();
  }, []);

  const getGroupForCategory = (category: string): 'scopus' | 'hki' | 'buku' | 'lain' => {
    const catLower = category.toLowerCase();
    if (catLower.includes('scopus') || catLower.includes('sinta') || catLower.includes('quartile')) {
      return 'scopus';
    }
    if (catLower.includes('hki') || catLower.includes('paten') || catLower.includes('cipta') || catLower.includes('merk') || catLower.includes('merek')) {
      return 'hki';
    }
    if (catLower.includes('buku') || catLower.includes('monograf') || catLower.includes('ajar') || catLower.includes('referensi')) {
      return 'buku';
    }
    return 'lain';
  };

  const handleWeightChangeByCategory = (category: string, val: number) => {
    const updated = weights.map(w => {
      if (w.category === category) {
        return { ...w, weight_value: val };
      }
      return w;
    });
    setWeights(updated);
  };

  const handleSaveWeights = async () => {
    setSavingWeights(true);
    try {
      const res = await fetch('/api/cms/weights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weights })
      });
      if (res.ok) {
        triggerMessage('Bobot poin KPI berhasil disimpan!');
      } else {
        triggerMessage('Gagal menyimpan bobot poin.', 'error');
      }
    } catch (e) {
      triggerMessage('Terjadi kesalahan.', 'error');
    } finally {
      setSavingWeights(false);
    }
  };

  const handleSavePeriod = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPeriod(true);
    try {
      const res = await fetch('/api/cms/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kpi_period_start: periodStart,
          kpi_period_end: periodEnd,
          kpi_period_label: periodLabel
        })
      });
      if (res.ok) {
        triggerMessage('Periode akreditasi kpi berhasil diperbarui!');
      } else {
        triggerMessage('Gagal menyimpan periode akreditasi.', 'error');
      }
    } catch (e) {
      triggerMessage('Terjadi kesalahan.', 'error');
    } finally {
      setSavingPeriod(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory || !newWeight) return;
    setAddingCategory(true);
    try {
      const res = await fetch('/api/cms/weights/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: newCategory,
          weight_value: parseInt(newWeight)
        })
      });
      const data = await res.json();
      if (res.ok) {
        triggerMessage('Kategori KPI baru berhasil ditambahkan!');
        setNewCategory('');
        setNewWeight('');
        fetchKpiData();
      } else {
        triggerMessage(data.message || 'Gagal menambahkan kategori.', 'error');
      }
    } catch (e) {
      triggerMessage('Terjadi kesalahan.', 'error');
    } finally {
      setAddingCategory(false);
    }
  };

  const handleDeleteCategory = async (category: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus kategori "${category}"?`)) return;
    try {
      const res = await fetch(`/api/cms/weights/${encodeURIComponent(category)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        triggerMessage('Kategori berhasil dihapus.');
        fetchKpiData();
      } else {
        triggerMessage('Gagal menghapus kategori.', 'error');
      }
    } catch (e) {
      triggerMessage('Terjadi kesalahan.', 'error');
    }
  };

  const filteredWeights = weights.filter(w => getGroupForCategory(w.category) === activeGroup);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
      {/* Left side: Interactive Configurations (Col-2) */}
      <div className="lg:col-span-2 space-y-6 lg:space-y-8">
        {/* Bobot Point Table */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 p-6 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight flex items-center gap-2">
                Bobot KPI Master Data
              </h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                Mengatur besaran poin dinamis untuk masing-masing kategori berkas / publikasi.
              </p>
            </div>
            
            <button
              onClick={handleSaveWeights}
              disabled={savingWeights || loading}
              className="inline-flex items-center gap-2 px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-md disabled:opacity-40 active:scale-95 transition-all outline-none"
            >
              <Save className="w-4 h-4" />
              {savingWeights ? 'Menyimpan...' : 'Simpan Semua Bobot'}
            </button>
          </div>

          {/* Group Selector Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1.5 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100/60 dark:border-zinc-850/50">
            {[
              { id: 'scopus', label: 'Scopus & SINTA', icon: Zap, color: 'text-orange-500' },
              { id: 'hki', label: 'HKI', icon: ShieldCheck, color: 'text-purple-500' },
              { id: 'buku', label: 'Buku', icon: Book, color: 'text-amber-500' },
              { id: 'lain', label: 'Lainnya', icon: FileSpreadsheet, color: 'text-emerald-500' }
            ].map(group => {
              const isActive = activeGroup === group.id;
              return (
                <button
                  key={group.id}
                  onClick={() => setActiveGroup(group.id as any)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all outline-none select-none ${
                    isActive
                      ? 'text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-800 dark:hover:text-zinc-200 hover:bg-gray-100/50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-kpi-group-tab"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className="absolute inset-0 bg-primary-600 rounded-xl"
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <group.icon className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-white' : group.color}`} />
                    {group.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Table Container */}
          <div className="space-y-4 min-h-[300px]">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-100 dark:bg-zinc-800 animate-pulse rounded-2xl" />)}
              </div>
            ) : filteredWeights.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-zinc-800 text-gray-400 font-bold uppercase tracking-widest">
                      <th className="py-3 text-left">Kategori Dokumen / Publikasi</th>
                      <th className="py-3 text-center w-24">Bobot Poin</th>
                      <th className="py-3 text-right w-16">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-zinc-800 font-bold text-gray-700 dark:text-zinc-300">
                    <AnimatePresence mode="popLayout">
                      {filteredWeights.map((w) => (
                        <motion.tr
                          key={w.category}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15 }}
                          className="hover:bg-gray-50/20 dark:hover:bg-zinc-800/10 transition-colors"
                        >
                          <td className="py-3.5 text-left font-extrabold text-gray-950 dark:text-zinc-100 uppercase tracking-tight flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700">
                              {activeGroup === 'scopus' && <Zap className="w-3.5 h-3.5 text-orange-500" />}
                              {activeGroup === 'hki' && <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />}
                              {activeGroup === 'buku' && <Book className="w-3.5 h-3.5 text-amber-500" />}
                              {activeGroup === 'lain' && <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />}
                            </div>
                            {w.category}
                          </td>
                          <td className="py-3.5 text-center">
                            <input
                               type="number"
                               value={w.weight_value}
                               onChange={(e) => handleWeightChangeByCategory(w.category, parseInt(e.target.value) || 0)}
                               className="w-16 px-2.5 py-1.5 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-lg text-center font-bold text-xs outline-none text-gray-900 dark:text-zinc-100 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30"
                            />
                          </td>
                          <td className="py-3.5 text-right">
                            <button
                              onClick={() => handleDeleteCategory(w.category)}
                              className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-16 text-center text-gray-400 font-bold italic uppercase text-xs tracking-widest flex flex-col items-center justify-center gap-3">
                <FileSpreadsheet className="w-8 h-8 text-gray-200" />
                <span>Tidak ada kategori dalam kelompok ini.</span>
              </div>
            )}
          </div>
        </div>

        {/* KPI Period Settings */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 p-6 space-y-6 shadow-sm">
          <div>
            <h3 className="text-base font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight flex items-center gap-2">
              Periode Akreditasi KPI
            </h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Mengatur range tanggal aktif dokumen yang dinilai untuk KPI.</p>
          </div>

          <form onSubmit={handleSavePeriod} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Label Periode</label>
              <input
                type="text"
                required
                placeholder="Contoh: 2025-2027"
                value={periodLabel}
                onChange={(e) => setPeriodLabel(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 dark:bg-zinc-855 border border-gray-100 dark:border-zinc-700 rounded-2xl text-xs font-bold outline-none text-gray-900 dark:text-zinc-100 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Tanggal Mulai</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    required
                    value={periodStart}
                    onChange={(e) => setPeriodStart(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-zinc-855 border border-gray-100 dark:border-zinc-700 rounded-2xl text-xs font-bold outline-none text-gray-900 dark:text-zinc-100 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Tanggal Selesai</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    required
                    value={periodEnd}
                    onChange={(e) => setPeriodEnd(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-zinc-855 border border-gray-100 dark:border-zinc-700 rounded-2xl text-xs font-bold outline-none text-gray-900 dark:text-zinc-100 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={savingPeriod || loading}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary-200 dark:shadow-primary-900/20 disabled:opacity-40 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              <Save className="w-4 h-4" />
              {savingPeriod ? 'Menyimpan...' : 'Perbarui Periode'}
            </button>
          </form>
        </div>
      </div>

      {/* Right side: Panduan Metriks Penilaian Resmi (Col-1) */}
      <div className="lg:col-span-1 space-y-6 lg:space-y-8">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 p-6 space-y-6 shadow-sm">
          <div>
            <h3 className="text-base font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight flex items-center gap-2">
              <Award className="w-5 h-5 text-primary-500" />
              Panduan Metriks Resmi
            </h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Referensi perhitungan poin KPI otomatis yang berlaku di sistem.
            </p>
          </div>

          <div className="space-y-4 text-xs font-bold text-gray-700 dark:text-zinc-300">
            {/* HKI */}
            <div className="p-4 bg-gray-50/50 dark:bg-zinc-800/30 rounded-2xl border border-gray-100 dark:border-zinc-800/50 space-y-3">
              <h4 className="font-extrabold text-gray-900 dark:text-zinc-100 uppercase tracking-wider text-[10px] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-500" />
                1. Hak Kekayaan Intelektual (HKI)
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                <div>Paten: <span className="font-black text-purple-600 dark:text-purple-400">40 pts</span></div>
                <div>Paten Sederhana: <span className="font-black text-purple-600 dark:text-purple-400">28 pts</span></div>
                <div>Merek: <span className="font-black text-purple-600 dark:text-purple-400">12 pts</span></div>
                <div>Hak Cipta: <span className="font-black text-purple-600 dark:text-purple-400">5 pts</span></div>
              </div>
            </div>

            {/* Buku Akademik */}
            <div className="p-4 bg-gray-50/50 dark:bg-zinc-800/30 rounded-2xl border border-gray-100 dark:border-zinc-800/50 space-y-3">
              <h4 className="font-extrabold text-gray-900 dark:text-zinc-100 uppercase tracking-wider text-[10px] flex items-center gap-2">
                <Book className="w-4 h-4 text-amber-500" />
                2. Buku Akademik
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                <div className="col-span-2 flex justify-between"><span>Buku Referensi:</span> <span className="font-black text-amber-600 dark:text-amber-400">40 pts</span></div>
                <div className="flex justify-between w-full col-span-2"><span>Buku Ajar:</span> <span className="font-black text-amber-600 dark:text-amber-400">20 pts</span></div>
                <div className="flex justify-between w-full col-span-2"><span>Buku Monograf:</span> <span className="font-black text-amber-600 dark:text-amber-400">20 pts</span></div>
              </div>
            </div>

            {/* Penelitian & Hibah */}
            <div className="p-4 bg-gray-50/50 dark:bg-zinc-800/30 rounded-2xl border border-gray-100 dark:border-zinc-800/50 space-y-3">
              <h4 className="font-extrabold text-gray-900 dark:text-zinc-100 uppercase tracking-wider text-[10px] flex items-center gap-2">
                <Beaker className="w-4 h-4 text-emerald-500" />
                3. Penelitian & Hibah
              </h4>
              <div className="space-y-1.5 text-[10px] font-bold">
                <div className="flex justify-between"><span>Hibah Luar Negeri:</span> <span className="font-black text-emerald-600 dark:text-emerald-400">10 pts</span></div>
                <div className="flex justify-between"><span>Hibah Eksternal (Dikti):</span> <span className="font-black text-emerald-600 dark:text-emerald-400">6 pts</span></div>
                <div className="flex justify-between"><span>Internal Institusi:</span> <span className="font-black text-emerald-600 dark:text-emerald-400">3 pts</span></div>
              </div>
            </div>

            {/* Google Scholar */}
            <div className="p-4 bg-gray-50/50 dark:bg-zinc-800/30 rounded-2xl border border-gray-100 dark:border-zinc-800/50 space-y-3">
              <h4 className="font-extrabold text-gray-900 dark:text-zinc-100 uppercase tracking-wider text-[10px] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                4. Publikasi Google Scholar
              </h4>
              <p className="text-[9.5px] text-gray-400 dark:text-zinc-500 font-semibold leading-relaxed">
                Poin dasar <span className="font-black text-blue-600 dark:text-blue-400">0.5</span> + bonus tersitasi <span className="font-black text-blue-600 dark:text-blue-400">0.5</span> + sitasi (<span className="font-black text-blue-600 dark:text-blue-400">0.25</span> per sitasi, max 500).
              </p>
            </div>

            {/* Scopus & SINTA */}
            <div className="p-4 bg-gray-50/50 dark:bg-zinc-800/30 rounded-2xl border border-gray-100 dark:border-zinc-800/50 space-y-3">
              <h4 className="font-extrabold text-gray-900 dark:text-zinc-100 uppercase tracking-wider text-[10px] flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-500" />
                5. Publikasi Scopus & SINTA
              </h4>
              <div className="space-y-1.5 text-[9.5px] font-semibold text-gray-500 dark:text-zinc-400 leading-relaxed">
                <p className="font-bold text-gray-800 dark:text-zinc-200">Base points per Quartile (Article):</p>
                <div className="grid grid-cols-3 gap-1 text-[9px] font-black text-orange-600 dark:text-orange-400">
                  <div>Q1: 40 pts</div>
                  <div>Q2: 38 pts</div>
                  <div>Q3: 35 pts</div>
                  <div>Q4: 33 pts</div>
                  <div>None: 33 pts</div>
                  <div>Non-Ar: 30</div>
                </div>
                <p className="border-t border-gray-150 dark:border-zinc-800 pt-1.5">
                  Skema peran penulis (60/40): Single Author = 100%, First Author = 60%, Member = 40% / (totalAuthors - 1).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
