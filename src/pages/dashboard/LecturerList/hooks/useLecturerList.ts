import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LecturerItem } from '../types';
import { fetchLecturersList } from '../services/lecturerService';

export const useLecturerList = () => {
  const [searchParams] = useSearchParams();
  const initialFakultas = searchParams.get('fakultas') || 'Semua';

  const [lecturers, setLecturers] = useState<LecturerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFakultas, setSelectedFakultas] = useState(initialFakultas);

  // Mengambil data leaderboard dosen saat pertama kali load
  useEffect(() => {
    const loadLecturers = async () => {
      try {
        setLoading(true);
        const data = await fetchLecturersList();
        setLecturers(data.leaderboard || []);
      } catch (error) {
        console.error('Failed to fetch lecturers', error);
      } finally {
        setLoading(false);
      }
    };
    loadLecturers();
  }, []);

  // Membuat daftar opsi pilihan fakultas secara dinamis berdasarkan data API
  const fakultasOptions = useMemo(() => {
    return ['Semua', ...new Set(lecturers.map(l => l.fakultas).filter((f): f is string => !!f))];
  }, [lecturers]);

  // Melakukan penyaringan terhadap dosen berdasarkan keyword pencarian dan fakultas
  const filteredLecturers = useMemo(() => {
    return lecturers.filter(l => {
      const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (l.fakultas && l.fakultas.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (l.program_studi && l.program_studi.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFakultas = selectedFakultas === 'Semua' || l.fakultas === selectedFakultas;
      return matchesSearch && matchesFakultas;
    });
  }, [lecturers, searchTerm, selectedFakultas]);

  return {
    searchTerm,
    setSearchTerm,
    selectedFakultas,
    setSelectedFakultas,
    loading,
    fakultasOptions,
    filteredLecturers
  };
};
