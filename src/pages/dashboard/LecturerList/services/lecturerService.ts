import { LecturerItem } from '../types';

// Mengambil daftar dosen terdaftar dari API leaderboard
export const fetchLecturersList = async (): Promise<{ leaderboard: LecturerItem[] }> => {
  const response = await fetch('/api/leaderboard');
  if (!response.ok) {
    throw new Error('Failed to fetch lecturers list');
  }
  return response.json();
};
