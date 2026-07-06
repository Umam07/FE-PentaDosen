import { LeaderboardUser, FakultasRawItem, DashboardStats } from '../types';

// Mengambil data leaderboard peringkat dosen
export const fetchLeaderboard = async (): Promise<{ leaderboard: LeaderboardUser[] }> => {
  const response = await fetch('/api/leaderboard');
  if (!response.ok) {
    throw new Error('Failed to fetch leaderboard');
  }
  return response.json();
};

// Mengambil data poin fakultas untuk grafik
export const fetchFakultasData = async (): Promise<{ data: FakultasRawItem[] }> => {
  const response = await fetch('/api/charts/fakultas');
  if (!response.ok) {
    throw new Error('Failed to fetch fakultas stats');
  }
  return response.json();
};

// Mengambil data dashboard statistics ringkasan dosen
export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const response = await fetch('/api/dashboard/stats');
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard stats');
  }
  return response.json();
};

// Mengambil data seluruhnya secara paralel
export const getInsightsData = async (): Promise<{
  leaderboard: LeaderboardUser[];
  fakultasData: FakultasRawItem[];
  stats: DashboardStats;
}> => {
  const [lbRes, fakRes, statsRes] = await Promise.all([
    fetchLeaderboard(),
    fetchFakultasData(),
    fetchDashboardStats()
  ]);
  return {
    leaderboard: lbRes.leaderboard || [],
    fakultasData: fakRes.data || [],
    stats: statsRes
  };
};
