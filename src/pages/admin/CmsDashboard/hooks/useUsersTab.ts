import React, { useState, useEffect } from 'react';
import { User } from '../types/cmsDashboard.types';
import { cmsDashboardService } from '../services/cmsDashboardService';

export const FAKULTAS_PRODI_MAP: Record<string, string[]> = {
  'Fakultas Kedokteran': ['Kedokteran'],
  'Fakultas Kedokteran Gigi': ['Kedokteran Gigi'],
  'Fakultas Teknologi Informasi': ['Teknik Informatika', 'Perpustakaan dan Sains Informasi'],
  'Fakultas Ekonomi dan Bisnis': ['Manajemen', 'Akuntansi'],
  'Fakultas Hukum': ['Ilmu Hukum'],
  'Fakultas Psikologi': ['Psikologi']
};

export const findNormalizedFakultas = (val: string) => {
  if (!val) return '';
  const key = Object.keys(FAKULTAS_PRODI_MAP).find(
    k => k.toLowerCase() === val.toLowerCase()
  );
  return key || '';
};

export const findNormalizedProdi = (fakultasKey: string, val: string) => {
  if (!fakultasKey || !val) return '';
  const list = FAKULTAS_PRODI_MAP[fakultasKey] || [];
  const found = list.find(p => p.toLowerCase() === val.toLowerCase());
  return found || '';
};

/**
 * Hook untuk mengelola state dan side-effect pada tab Manajemen User / Hak Akses.
 */
export function useUsersTab(triggerMessage: (text: string, type?: 'success' | 'error') => void) {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(20);

  // Edit user modal state
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editRole, setEditRole] = useState('');
  const [editFakultas, setEditFakultas] = useState('');
  const [editProdi, setEditProdi] = useState('');
  const [savingUser, setSavingUser] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await cmsDashboardService.fetchUsers(search, selectedRole, page, perPage);
      setUsers(data.data || []);
      setLastPage(data.last_page || 1);
      setTotal(data.total || 0);
    } catch (e) {
      console.error(e);
      triggerMessage('Gagal mengambil data user.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, selectedRole, perPage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleOpenEdit = (u: User) => {
    setEditingUser(u);
    setEditRole(u.role || 'dosen');
    const normFak = findNormalizedFakultas(u.fakultas || '');
    setEditFakultas(normFak);
    setEditProdi(findNormalizedProdi(normFak, u.program_studi || ''));
  };

  const handleFakultasChange = (fakKey: string) => {
    setEditFakultas(fakKey);
    const prodis = FAKULTAS_PRODI_MAP[fakKey] || [];
    if (prodis.length > 0) {
      setEditProdi(prodis[0]);
    } else {
      setEditProdi('');
    }
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    setSavingUser(true);
    try {
      const data = await cmsDashboardService.assignRole(editingUser.id, {
        role: editRole,
        fakultas: editFakultas,
        program_studi: editProdi
      });
      triggerMessage(data.message || 'Hak akses berhasil diperbarui!');
      setEditingUser(null);
      fetchUsers();
    } catch (e: any) {
      triggerMessage(e.message || 'Terjadi kesalahan.', 'error');
    } finally {
      setSavingUser(false);
    }
  };

  return {
    users,
    search,
    setSearch,
    selectedRole,
    setSelectedRole,
    loading,
    page,
    setPage,
    lastPage,
    total,
    perPage,
    setPerPage,
    editingUser,
    setEditingUser,
    editRole,
    setEditRole,
    editFakultas,
    editProdi,
    setEditProdi,
    savingUser,
    handleSearchSubmit,
    handleOpenEdit,
    handleFakultasChange,
    handleSaveUser,
    fetchUsers
  };
}
