import { DepartmentStats } from '../types';

// Mengambil data statistik fakultas dari API
export const fetchFakultasStats = async (): Promise<{ data: DepartmentStats[] }> => {
  const response = await fetch('/api/charts/fakultas');
  if (!response.ok) {
    throw new Error('Failed to fetch department statistics');
  }
  return response.json();
};
