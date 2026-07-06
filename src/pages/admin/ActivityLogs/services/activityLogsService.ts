import { ActivityLogsResponse, ActivityLog } from '../types/activityLogs.types';

/**
 * Mengambil data log aktivitas yang terpaginasi dari API
 */
export async function fetchActivityLogs(
  page: number,
  limit: number,
  action?: string
): Promise<ActivityLogsResponse> {
  let url = `/api/admin/activity-logs?page=${page}&per_page=${limit}`;
  if (action) {
    url += `&action=${action}`;
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data = await res.json();
  
  return {
    logs: data.logs || [],
    total: data.total || 0,
    last_page: data.last_page || 1,
  };
}

/**
 * Mengambil semua log aktivitas untuk kepentingan ekspor (per_page limit sangat tinggi)
 */
export async function fetchExportLogs(action?: string): Promise<ActivityLog[]> {
  let url = `/api/admin/activity-logs?page=1&per_page=100000`;
  if (action) {
    url += `&action=${action}`;
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data = await res.json();
  return data.logs || [];
}
