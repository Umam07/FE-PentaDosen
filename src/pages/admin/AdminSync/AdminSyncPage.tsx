import React from 'react';
import { useOutletContext } from 'react-router-dom';
import type { SessionUser } from './types/adminSync.types';
import { useAdminSync } from './hooks/useAdminSync';
import { useMassSync } from './hooks/useMassSync';
import SyncHeader from './components/SyncHeader';
import SyncSummaryCards from './components/SyncSummaryCards';
import SyncConsole from './components/SyncConsole';
import LecturerManagementPanel from './components/LecturerManagementPanel';
import SyncTrackerTable from './components/SyncTrackerTable';

export default function AdminSync() {
  const { user } = useOutletContext<{ user: SessionUser }>();

  const sync = useAdminSync(user);

  const massSync = useMassSync({
    user,
    lecturers: sync.lecturers,
    setLecturers: sync.setLecturers,
  });

  const handleScrollToConsole = () => {
    const el = document.getElementById('sync-console-panel');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="max-w-none space-y-8 pb-12">
      
      {/* Header Halaman */}
      <SyncHeader
        syncState={massSync.syncState}
        progressPercent={massSync.progressPercent}
        onStartMassSync={massSync.handleStartMassSync}
        onScrollToConsole={handleScrollToConsole}
      />

      {/* Kartu Ringkasan Statistik */}
      <SyncSummaryCards
        totalLecturers={sync.lecturers.length}
        scholarConnected={sync.lecturers.filter(l => l.scholar_id).length}
        scopusConnected={sync.lecturers.filter(l => l.scopus_id).length}
      />

      {/* Konsol Sinkronisasi Massal */}
      <SyncConsole
        syncState={massSync.syncState}
        syncStats={massSync.syncStats}
        syncLogs={massSync.syncLogs}
        progressPercent={massSync.progressPercent}
        etaSeconds={massSync.etaSeconds}
        copied={massSync.copied}
        terminalEndRef={massSync.terminalEndRef}
        onStart={massSync.handleStartMassSync}
        onPause={massSync.handlePauseMassSync}
        onCancel={massSync.handleCancelMassSync}
        onClose={massSync.handleCloseConsole}
        onCopyLogs={massSync.handleCopyLogs}
      />

      {/* Panel Kelola Dosen Individual */}
      {sync.scholarUser && (
        <LecturerManagementPanel
          scholarUser={sync.scholarUser}
          scholarData={sync.scholarData}
          scopusData={sync.scopusData}
          scholarId={sync.scholarId}
          scopusId={sync.scopusId}
          loadingScholar={sync.loadingScholar}
          loadingScopus={sync.loadingScopus}
          checkingInfoScholar={sync.checkingInfoScholar}
          checkingInfoScopus={sync.checkingInfoScopus}
          checkedAuthorScholar={sync.checkedAuthorScholar}
          checkedAuthorScopus={sync.checkedAuthorScopus}
          messageScholar={sync.messageScholar}
          messageScopus={sync.messageScopus}
          onScholarIdChange={sync.setScholarId}
          onScopusIdChange={sync.setScopusId}
          onCheckScholar={sync.handleCheckIdScholar}
          onSaveScholar={sync.handleSaveScholarId}
          onSyncScholar={sync.handleSyncScholar}
          onCheckScopus={sync.handleCheckIdScopus}
          onSaveScopus={sync.handleSaveScopusId}
          onSyncScopus={sync.handleSyncScopus}
          onClose={() => sync.setSelectedLecturerId('')}
          onClearCheckedScholar={() => sync.setCheckedAuthorScholar(null)}
          onClearCheckedScopus={() => sync.setCheckedAuthorScopus(null)}
        />
      )}

      {/* Tabel Tracker Integrasi Global */}
      <SyncTrackerTable
        lecturers={sync.lecturers}
        currentLecturers={sync.currentLecturers}
        filteredCount={sync.filteredLecturers.length}
        selectedLecturerId={sync.selectedLecturerId}
        currentSyncingId={massSync.currentSyncingId}
        searchTerm={sync.searchTerm}
        selectedFakultas={sync.selectedFakultas}
        currentPage={sync.currentPage}
        itemsPerPage={sync.itemsPerPage}
        totalPages={sync.totalPages}
        indexOfFirstItem={sync.indexOfFirstItem}
        indexOfLastItem={sync.indexOfLastItem}
        userRole={user.role}
        onSearchChange={sync.setSearchTerm}
        onFakultasChange={sync.setSelectedFakultas}
        onSelectLecturer={sync.handleSelectLecturer}
        onPageChange={sync.setCurrentPage}
        onItemsPerPageChange={sync.setItemsPerPage}
      />
    </div>
  );
}
