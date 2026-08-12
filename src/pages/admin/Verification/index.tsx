import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { SessionUser } from './types/verification.types';
import { useVerification } from './hooks/useVerification';
import VerificationHeader from './components/VerificationHeader';
import VerificationTabs from './components/VerificationTabs';
import VerificationFilter from './components/VerificationFilter';
import VerificationTable from './components/VerificationTable';
import VerificationMobileList from './components/VerificationMobileList';
import VerificationEmpty from './components/VerificationEmpty';
import VerificationPagination from './components/VerificationPagination';
import RejectConfirmationModal from './components/RejectConfirmationModal';
import { PdfPreviewModal } from '../../../components/ui/pdf-preview-modal';
import { DocumentHistoryModal } from '../../../components/ui/document-history-modal';

export default function AdminVerification() {
  const { user } = useOutletContext<{ user: SessionUser }>();
  
  const {
    activeTab,
    setActiveTab,
    loading,
    actionLoading,
    searchTerm,
    setSearchTerm,
    selectedFakultas,
    setSelectedFakultas,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    totalItems,
    currentItems,
    rejectingItem,
    setRejectingItem,
    feedbackText,
    setFeedbackText,
    previewDoc,
    setPreviewDoc,
    historyModal,
    setHistoryModal,
    handleVerify,
    handleConfirmReject
  } = useVerification(user);

  return (
    <div className="max-w-none space-y-8 pb-12">
      {/* Header Halaman */}
      <VerificationHeader
        totalPending={totalItems}
        loading={loading}
      />

      {/* Bagian Konten & Filter */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-xs">
        
        {/* Tab Navigasi Premium */}
        <VerificationTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Bar Filter & Pencarian */}
        <VerificationFilter
          activeTab={activeTab}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedFakultas={selectedFakultas}
          onFakultasChange={setSelectedFakultas}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          userRole={user?.role}
        />

        {/* Konten Antrean */}
        <div className="min-h-[400px]">
          {loading ? (
             <div className="p-20 text-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin mx-auto" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Sinkronisasi Antrean...</p>
             </div>
          ) : currentItems.length > 0 ? (
            <div>
              {/* Tampilan Mobile Card List */}
              <VerificationMobileList
                activeTab={activeTab}
                items={currentItems}
                actionLoading={actionLoading}
                userRole={user?.role}
                onVerify={handleVerify}
                onRejectStart={setRejectingItem}
                onPreview={setPreviewDoc}
              />

              {/* Tampilan Desktop Table */}
              <VerificationTable
                activeTab={activeTab}
                items={currentItems}
                actionLoading={actionLoading}
                userRole={user?.role}
                onVerify={handleVerify}
                onRejectStart={setRejectingItem}
                onPreview={setPreviewDoc}
                onHistory={(docId, title) => setHistoryModal({ isOpen: true, docId, title })}
              />
            </div>
          ) : (
            /* Antrean Kosong */
            <VerificationEmpty activeTab={activeTab} />
          )}
        </div>

        {/* Kontrol Navigasi Halaman */}
        {!loading && totalItems > 0 && (
          <VerificationPagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        )}
      </div>

      {/* Modal Konfirmasi Penolakan */}
      <RejectConfirmationModal
        rejectingItem={rejectingItem}
        onClose={() => setRejectingItem(null)}
        feedbackText={feedbackText}
        onFeedbackChange={setFeedbackText}
        actionLoading={actionLoading !== null}
        onConfirm={handleConfirmReject}
      />

      {/* Modal Preview PDF */}
      <PdfPreviewModal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        fileUrl={previewDoc?.fileUrl ?? null}
        title={previewDoc?.title}
        category={previewDoc?.category}
      />

      {/* Modal Riwayat Dokumen */}
      <DocumentHistoryModal
        isOpen={historyModal.isOpen}
        onClose={() => setHistoryModal({ ...historyModal, isOpen: false })}
        docId={historyModal.docId}
        title={historyModal.title}
      />
    </div>
  );
}
