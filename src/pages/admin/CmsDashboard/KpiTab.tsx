import React, { useState, useEffect } from 'react';
import { Trash2, Save, Plus, Calendar } from 'lucide-react';

export default function KpiTab({ triggerMessage }: { triggerMessage: (text: string, type?: 'success' | 'error') => void }) {
  const [weights, setWeights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingWeights, setSavingWeights] = useState(false);

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

  const handleWeightChange = (index: number, val: number) => {
    const updated = [...weights];
    updated[index].weight_value = val;
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
      {/* Bobot Point Table (Col-2) */}
      <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 p-6 space-y-6 shadow-sm">
        <div>
          <h3 className="text-base font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight flex items-center gap-2">
            Bobot KPI Poin Dokumen
          </h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Mengatur besaran poin dinamis dari masing-masing kategori berkas.</p>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-100 dark:bg-zinc-800 animate-pulse rounded-2xl" />)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-zinc-800 text-gray-400 font-bold uppercase tracking-widest">
                    <th className="py-3 text-left">Kategori Dokumen</th>
                    <th className="py-3 text-center w-24">Bobot Poin</th>
                    <th className="py-3 text-right w-16">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-zinc-800 font-bold text-gray-700 dark:text-zinc-300">
                  {weights.map((w, idx) => (
                    <tr key={w.category}>
                      <td className="py-3.5 text-left font-extrabold text-gray-900 dark:text-zinc-100 uppercase tracking-tight">{w.category}</td>
                      <td className="py-3.5 text-center">
                        <input
                           type="number"
                           value={w.weight_value}
                           onChange={(e) => handleWeightChange(idx, parseInt(e.target.value) || 0)}
                           className="w-16 px-2.5 py-1.5 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-lg text-center font-bold text-xs outline-none text-gray-900 dark:text-zinc-100"
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end pt-3">
            <button
              onClick={handleSaveWeights}
              disabled={savingWeights || loading}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary-200 dark:shadow-primary-900/20 disabled:opacity-40"
            >
              <Save className="w-4 h-4" />
              {savingWeights ? 'Menyimpan...' : 'Simpan Semua Bobot'}
            </button>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-zinc-800 pt-6 space-y-4">
          <div>
            <h4 className="text-xs font-black text-gray-900 dark:text-zinc-100 uppercase tracking-widest">Tambah Kategori Baru</h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Tambah jenis kategori penilaian KPI dosen baru ke sistem</p>
          </div>

          <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              placeholder="Nama kategori (e.g. Pengabdian)..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 px-4 py-3.5 bg-gray-50 dark:bg-zinc-850 border border-gray-100 dark:border-zinc-700 rounded-2xl text-xs font-bold outline-none text-gray-900 dark:text-zinc-100"
            />
            <input
              type="number"
              required
              placeholder="Poin..."
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              className="w-full sm:w-24 px-4 py-3.5 bg-gray-50 dark:bg-zinc-850 border border-gray-100 dark:border-zinc-700 rounded-2xl text-xs font-bold text-center outline-none text-gray-900 dark:text-zinc-100"
            />
            <button
              type="submit"
              disabled={addingCategory}
              className="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-md flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              <Plus className="w-4 h-4" />
              {addingCategory ? 'Adding...' : 'Tambah'}
            </button>
          </form>
        </div>
      </div>

      {/* KPI Period Settings (Col-1) */}
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
              className="w-full px-4 py-3.5 bg-gray-50 dark:bg-zinc-850 border border-gray-100 dark:border-zinc-700 rounded-2xl text-xs font-bold outline-none text-gray-900 dark:text-zinc-100"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Tanggal Mulai</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="date"
                required
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-zinc-855 border border-gray-100 dark:border-zinc-700 rounded-2xl text-xs font-bold outline-none text-gray-900 dark:text-zinc-100"
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
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-zinc-855 border border-gray-100 dark:border-zinc-700 rounded-2xl text-xs font-bold outline-none text-gray-900 dark:text-zinc-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={savingPeriod || loading}
            className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary-200 dark:shadow-primary-900/20 disabled:opacity-40 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {savingPeriod ? 'Menyimpan...' : 'Perbarui Periode'}
          </button>
        </form>
      </div>
    </div>
  );
}
