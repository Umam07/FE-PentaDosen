import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lecturer, SessionUser } from '../types/lecturers.types';
import { fetchLecturers } from '../services/lecturersService';
import { exportToExcel } from '../utils/lecturersUtils';

export function useLecturers(user: SessionUser) {
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFakultas, setSelectedFakultas] = useState('');
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Memuat data database dosen dari API
  const getLecturersData = useCallback(async () => {
    if (!user?.role || !user?.id) return;
    try {
      setLoading(true);
      const data = await fetchLecturers(user.role, user.id);
      setLecturers(data);
    } catch (err) {
      console.error('Gagal mengambil data dosen:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    getLecturersData();
  }, [getLecturersData]);

  // Reset pagination ke halaman 1 ketika pencarian atau filter fakultas berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedFakultas]);

  // Menyaring data dosen berdasarkan kata kunci & filter fakultas
  const filteredLecturers = useMemo(() => {
    return lecturers.filter((l) => {
      const matchSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (l.program_studi && l.program_studi.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchFakultas = selectedFakultas ? l.fakultas === selectedFakultas : true;
      return matchSearch && matchFakultas;
    });
  }, [lecturers, searchTerm, selectedFakultas]);

  // Penghitungan Pagination
  const totalPages = useMemo(() => {
    return Math.ceil(filteredLecturers.length / itemsPerPage);
  }, [filteredLecturers.length, itemsPerPage]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  const currentItems = useMemo(() => {
    return filteredLecturers.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredLecturers, indexOfFirstItem, indexOfLastItem]);

  // Mengunduh database dosen terfilter ke file Excel
  const handleExportExcel = useCallback(async () => {
    await exportToExcel(filteredLecturers, user, selectedFakultas, searchTerm);
  }, [filteredLecturers, user, selectedFakultas, searchTerm]);

  // Navigasi ke detail profil dosen
  const handleNavigateToProfile = useCallback((id: number | string) => {
    navigate(`/admin/lecturers/${id}`);
  }, [navigate]);

  return {
    lecturers,
    loading,
    searchTerm,
    setSearchTerm,
    selectedFakultas,
    setSelectedFakultas,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    totalItems: filteredLecturers.length,
    currentItems,
    handleExportExcel,
    handleNavigateToProfile
  };
}
