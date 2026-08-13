import { useState, useEffect, useMemo } from 'react';
import { LeaderboardUser, FakultasRawItem, DashboardStats, FakultasFormattedItem } from '../types';
import { getInsightsData } from '../services/insightsService';
import { ALL_FAKULTAS_NAMES, FAKULTAS_COLORS, PRODI_COLORS, FAKULTAS_SHORT } from '../constants';

export const useInsights = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [fakultasData, setFakultasData] = useState<FakultasRawItem[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'points_desc' | 'points_asc' | 'alphabetical'>('points_desc');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [chartViewMode, setChartViewMode] = useState<'donut' | 'bar'>('donut');

  // Mengambil seluruh data dashboard secara paralel
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getInsightsData();
        setLeaderboard(data.leaderboard);
        setFakultasData(data.fakultasData);
        setStats(data.stats);
      } catch (error) {
        console.error('Failed to fetch insights data', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Kalkulasi nilai KPI per periode dengan memastikan hirarki logis:
  // Overall (allTime) >= 3-Tahun (threeYears) >= Tahun Ini (thisYear)
  const periodKpiValues = useMemo(() => {
    const rawAllTime = stats?.total_points || 0;
    const rawThreeYears = stats?.kpi_score_3_years || 0;
    const rawThisYear = stats?.kpi_score_this_year || 0;

    // Pastikan nilai tidak terbalik — overall harus paling besar
    const thisYear = rawThisYear;
    const threeYears = Math.max(rawThreeYears, thisYear);
    const allTime = Math.max(rawAllTime, threeYears);

    return { thisYear, threeYears, allTime };
  }, [stats]);

  // Menggabungkan data fakultas API dengan default list fakultas
  const mergedFakultasData = useMemo<FakultasRawItem[]>(() => {
    return ALL_FAKULTAS_NAMES.map(name => {
      const apiItem = fakultasData.find(f => f.fakultas === name);
      return apiItem || { fakultas: name, total_points: 0, dosen_count: 0 };
    });
  }, [fakultasData]);

  // Memformat data gabungan untuk keperluan grafik & rendering progress bar
  const formattedFakultasData = useMemo<FakultasFormattedItem[]>(() => {
    return mergedFakultasData.map((f, index) => {
      const rawName = f.fakultas || '';
      const normalizedKey = rawName.toLowerCase().replace(/fakultas/g, '').replace(/[^a-z0-9]/g, '');
      const color = FAKULTAS_COLORS[normalizedKey] || PRODI_COLORS[index % PRODI_COLORS.length];
      const shortName = FAKULTAS_SHORT[normalizedKey] || rawName.replace(/Fakultas\s/i, '').trim();
      const basePoints = Number(f.total_points) > 0 ? Number(f.total_points) : 0;

      return {
        ...f,
        name: shortName,
        fullName: rawName,
        value: basePoints,
        dosen: f.dosen_count || 0,
        color,
      };
    });
  }, [mergedFakultasData]);

  // Menghitung total poin seluruh fakultas
  const totalFakultasPoints = useMemo(() => {
    return formattedFakultasData.reduce((sum, f) => sum + f.value, 0);
  }, [formattedFakultasData]);

  // Menyaring data fakultas berdasarkan kolom search
  const filteredFakultasData = useMemo(() => {
    return formattedFakultasData.filter(f =>
      f.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [formattedFakultasData, searchQuery]);

  // Mengurutkan data fakultas berdasarkan tipe sort yang terpilih
  const sortedAndFilteredData = useMemo(() => {
    return [...filteredFakultasData].sort((a, b) => {
      if (sortBy === 'points_desc') return b.value - a.value;
      if (sortBy === 'points_asc') return a.value - b.value;
      return a.name.localeCompare(b.name);
    });
  }, [filteredFakultasData, sortBy]);

  // Menjaga agar pointer index Recharts tetap di dalam batas array setelah filter
  const activeDataIndex = useMemo(() => {
    return activeIndex >= sortedAndFilteredData.length ? 0 : activeIndex;
  }, [activeIndex, sortedAndFilteredData]);

  return {
    leaderboard,
    stats,
    periodKpiValues,
    loading,
    activeIndex,
    setActiveIndex,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    showFilterDropdown,
    setShowFilterDropdown,
    formattedFakultasData,
    totalFakultasPoints,
    sortedAndFilteredData,
    activeDataIndex,
    chartViewMode,
    setChartViewMode,
  };
};
