import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { SessionUser } from './types/lecturers.types';
import { useLecturers } from './hooks/useLecturers';
import LecturersHeader from './components/LecturersHeader';
import LecturersFilter from './components/LecturersFilter';
import LecturersTable from './components/LecturersTable';
import LecturersEmpty from './components/LecturersEmpty';
import LecturersPagination from './components/LecturersPagination';

export default function AdminLecturers() {
  const { user } = useOutletContext<{ user: SessionUser }>();
  
  const {
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
    totalItems,
    currentItems,
    handleExportExcel,
    handleNavigateToProfile
  } = useLecturers(user);

  return (
    <div className="max-w-none space-y-8 pb-12">
      {/* Header Halaman */}
      <LecturersHeader
        loading={loading}
        exportDisabled={totalItems === 0}
        onExportExcel={handleExportExcel}
      />

      {/* Bagian Utama Database Dosen */}
      <div className="bg-white dark:bg-zinc-900 shadow-[0_4px_25px_rgba(0,0,0,0.03)] rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 overflow-hidden">
        {/* Kolom Pencarian dan Dropdown Fakultas */}
        <LecturersFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedFakultas={selectedFakultas}
          onFakultasChange={setSelectedFakultas}
          loading={loading}
          userRole={user?.role}
        />

        {/* Konten Utama Tabel Dosen */}
        <div className="min-h-[400px]">
          {loading ? (
             <div className="p-20 text-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin mx-auto" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Memuat Database...</p>
             </div>
          ) : currentItems.length === 0 ? (
            /* Tampilan Data Dosen Kosong */
            <LecturersEmpty />
          ) : (
            /* Tabel Data Dosen Desktop */
            <LecturersTable
              items={currentItems}
              onItemClick={handleNavigateToProfile}
            />
          )}
        </div>

        {/* Kontrol Navigasi Halaman (Pagination) */}
        {!loading && totalItems > 0 && (
          <LecturersPagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        )}
      </div>
    </div>
  );
}
