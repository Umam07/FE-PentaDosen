import { Lecturer } from '../types/lecturers.types';

/**
 * Mengambil database dosen dari API admin
 */
export async function fetchLecturers(
  role: string,
  userId: number | string
): Promise<Lecturer[]> {
  const res = await fetch(`/api/admin/lecturers?role=${role}&user_id=${userId}`);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data = await res.json();
  return data.lecturers || [];
}
