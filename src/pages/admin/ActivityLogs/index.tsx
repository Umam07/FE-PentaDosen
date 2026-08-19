import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { SessionUser } from './types/activityLogs.types';
import { useActivityLogs } from './hooks/useActivityLogs';
import AccessDenied from './components/AccessDenied';
import ActivityLogsHeader from './components/ActivityLogsHeader';
import ActivityLogsStats from './components/ActivityLogsStats';
import ActivityLogsFilter from './components/ActivityLogsFilter';
import ActivityLogsTable from './components/ActivityLogsTable';
import ActivityLogsMobileTimeline from './components/ActivityLogsMobileTimeline';
import ActivityLogsEmpty from './components/ActivityLogsEmpty';
import ActivityLogsPagination from './components/ActivityLogsPagination';

export default function AdminActivityLogs() {
  const { user } = useOutletContext<{ user: SessionUser }>();

  // Memastikan bahwa hanya admin LPPM atau admin Fakultas yang dapat mengakses halaman ini
  if (user?.role !== 'admin penelitian' && user?.role !== 'admin fakultas') {
    return <AccessDenied />;
  }

  const {
    loading,
    searchTerm,
    setSearchTerm,
    selectedAction,
    setSelectedAction,
    copiedId,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalItems,
    totalPages,
    filteredLogs,
    loginCount,
    verifyCount,
    syncCount,
    handleCopy,
    handleExportExcel
  } = useActivityLogs(user);

  return (
    <div className="w-full space-y-8 pb-12">
      {/* Header Halaman */}
      <ActivityLogsHeader
        totalItems={totalItems}
        loading={loading}
        onExportExcel={handleExportExcel}
        exportDisabled={loading || totalItems === 0}
      />

      {/* Baris Ringkasan Statistik */}
      <ActivityLogsStats
        loginCount={loginCount}
        verifyCount={verifyCount}
        syncCount={syncCount}
      />

      {/* Wadah Utama Konten Log */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-hairline-light dark:border-hairline-dark overflow-hidden shadow-xs">
        {/* Pencarian dan Filter Aksi */}
        <ActivityLogsFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedAction={selectedAction}
          onActionChange={setSelectedAction}
          userRole={user?.role}
        />

        {/* Konten Daftar Log */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="p-20 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-ink-soft border-t-ink dark:border-surface-dark-elevated dark:border-t-accent-on-dark rounded-full animate-spin mx-auto" />
              <p className="text-[10px] font-semibold text-muted dark:text-on-dark-muted uppercase tracking-[0.2em]">Memuat Log Aktivitas...</p>
            </div>
          ) : filteredLogs.length > 0 ? (
            <>
              {/* Tabel Desktop */}
              <ActivityLogsTable
                logs={filteredLogs}
                copiedId={copiedId}
                onCopy={handleCopy}
              />

              {/* Timeline Mobile */}
              <ActivityLogsMobileTimeline
                logs={filteredLogs}
                copiedId={copiedId}
                onCopy={handleCopy}
              />
            </>
          ) : (
            /* Tampilan Kosong */
            <ActivityLogsEmpty hasFilters={!!(searchTerm || selectedAction)} />
          )}
        </div>

        {/* Kontrol Navigasi Halaman */}
        {!loading && totalItems > 0 && (
          <ActivityLogsPagination
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
