import React, { useState, useEffect } from 'react';
import { KpiWeight } from '../types/cmsDashboard.types';
import { cmsDashboardService } from '../services/cmsDashboardService';

export const getGroupForCategory = (category: string): 'scopus' | 'hki' | 'buku' | 'lain' => {
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

/**
 * Hook untuk mengelola state dan side-effect pada tab Pengaturan Bobot & Periode KPI.
 */
export function useKpiTab(triggerMessage: (text: string, type?: 'success' | 'error') => void) {
  const [weights, setWeights] = useState<KpiWeight[]>([]);
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

  // Delete category state
  const [deleteCategory, setDeleteCategory] = useState<string | null>(null);

  const fetchKpiData = async () => {
    setLoading(true);
    try {
      const dataW = await cmsDashboardService.fetchWeights();
      setWeights(dataW.weights || []);

      const dataP = await cmsDashboardService.fetchSettings();
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
      await cmsDashboardService.saveWeights(weights);
      triggerMessage('Bobot poin KPI berhasil disimpan!');
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
      await cmsDashboardService.saveSettings({
        kpi_period_start: periodStart,
        kpi_period_end: periodEnd,
        kpi_period_label: periodLabel
      });
      triggerMessage('Periode akreditasi kpi berhasil diperbarui!');
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
      const data = await cmsDashboardService.addWeightCategory(newCategory, parseInt(newWeight));
      triggerMessage(data.message || 'Kategori KPI baru berhasil ditambahkan!');
      setNewCategory('');
      setNewWeight('');
      fetchKpiData();
    } catch (e: any) {
      triggerMessage(e.message || 'Gagal menambahkan kategori.', 'error');
    } finally {
      setAddingCategory(false);
    }
  };

  const filteredWeights = weights.filter(w => getGroupForCategory(w.category) === activeGroup);

  return {
    weights,
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
    newCategory,
    setNewCategory,
    newWeight,
    setNewWeight,
    addingCategory,
    deleteCategory,
    setDeleteCategory,
    filteredWeights,
    handleWeightChangeByCategory,
    handleSaveWeights,
    handleSavePeriod,
    handleAddCategory,
    fetchKpiData
  };
}
