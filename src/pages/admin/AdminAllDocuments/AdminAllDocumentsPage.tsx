import React, { lazy, Suspense } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FileText } from 'lucide-react';
import type { SessionUser } from './types/adminAllDocuments.types';
import { useAdminAllDocuments } from './hooks/useAdminAllDocuments';
import AllDocumentsHeader from './components/AllDocumentsHeader';
import AllDocumentsSummaryCards from './components/AllDocumentsSummaryCards';
import AllDocumentsTabs from './components/AllDocumentsTabs';
import AllDocumentsFilterBar from './components/AllDocumentsFilterBar';
import AllDocumentsMobileList from './components/AllDocumentsMobileList';
import AllDocumentsTable from './components/AllDocumentsTable';
import AllDocumentsPagination from './components/AllDocumentsPagination';
const PdfPreviewModal = lazy(() => import('../../../components/ui/pdf-preview-modal').then(m => ({ default: m.PdfPreviewModal })));
import { DocumentHistoryModal } from '../../../components/ui/document-history-modal';

export default function AdminAllDocuments() {
  const { user } = useOutletContext<{ user: SessionUser }>();

  const docState = useAdminAllDocuments(user);

  return (
    <div className="w-full space-y-8 pb-12">
      {/* Header Halaman */}
      <AllDocumentsHeader
        loading={docState.loading}
        hasData={docState.documents.length > 0 || docState.research.length > 0}
        onExportExcel={docState.handleExportExcel}
      />

      {/* Kartu Ringkasan Statistik */}
      <AllDocumentsSummaryCards
        activeTab={docState.activeTab}
        totalCount={docState.totalCount}
        approvedCount={docState.approvedCount}
        pendingCount={docState.pendingCount}
        tabDetails={docState.tabDetails}
      />

      {/* Card Utama Navigasi Tab & Tabel Dokumen */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-hairline-light dark:border-hairline-dark overflow-hidden shadow-xs">
        
        {/* Tab Navigasi (Publikasi, HKI, Penelitian, Buku) */}
        <AllDocumentsTabs
          activeTab={docState.activeTab}
          tabDetails={docState.tabDetails}
          onTabChange={docState.setActiveTab}
        />

        {/* Filter Bar: Search, Fakultas, & Sort */}
        <AllDocumentsFilterBar
          activeTab={docState.activeTab}
          tabDetails={docState.tabDetails}
          searchTerm={docState.searchTerm}
          selectedFakultas={docState.selectedFakultas}
          sortOrder={docState.sortOrder}
          userRole={user?.role}
          onSearchChange={docState.setSearchTerm}
          onFakultasChange={docState.setSelectedFakultas}
          onSortOrderChange={docState.setSortOrder}
        />

        {/* Konten Tabel Dokumen */}
        <div className="min-h-[400px]">
          {docState.loading ? (
            <div className="p-20 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-ink-soft border-t-ink dark:border-surface-dark-elevated dark:border-t-accent-on-dark rounded-full animate-spin mx-auto" />
              <p className="text-[10px] font-semibold text-muted dark:text-on-dark-muted uppercase tracking-[0.2em]">Memuat Data...</p>
            </div>
          ) : docState.filteredDocuments.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl flex items-center justify-center mb-6 border border-hairline-light-soft dark:border-hairline-dark-soft">
                <FileText className="w-10 h-10 text-muted-soft dark:text-on-dark-muted" />
              </div>
              <p className="text-sm font-semibold text-muted dark:text-on-dark-muted uppercase tracking-widest italic">Data Tidak Ditemukan</p>
            </div>
          ) : (
            <div>
              {/* Mobile Card List */}
              <AllDocumentsMobileList
                items={docState.currentItems}
                activeTab={docState.activeTab}
                onPreview={docState.setPreviewDoc}
                onHistory={(docId, title) => docState.setHistoryModal({ isOpen: true, docId, title })}
              />

              {/* Desktop Table */}
              <AllDocumentsTable
                items={docState.currentItems}
                activeTab={docState.activeTab}
                onPreview={docState.setPreviewDoc}
                onHistory={(docId, title) => docState.setHistoryModal({ isOpen: true, docId, title })}
              />
            </div>
          )}
        </div>

        {/* Control Pagination */}
        {!docState.loading && docState.filteredDocuments.length > 0 && (
          <AllDocumentsPagination
            currentPage={docState.currentPage}
            itemsPerPage={docState.itemsPerPage}
            totalItems={docState.filteredDocuments.length}
            totalPages={docState.totalPages}
            indexOfFirstItem={docState.indexOfFirstItem}
            indexOfLastItem={docState.indexOfLastItem}
            onPageChange={docState.setCurrentPage}
            onItemsPerPageChange={docState.setItemsPerPage}
          />
        )}
      </div>

      {/* PDF Preview Modal */}
      {docState.previewDoc && (
        <Suspense fallback={null}>
          <PdfPreviewModal
            isOpen={!!docState.previewDoc}
            onClose={() => docState.setPreviewDoc(null)}
            fileUrl={docState.previewDoc?.fileUrl ?? null}
            title={docState.previewDoc?.title}
            category={docState.previewDoc?.category}
          />
        </Suspense>
      )}

      {/* History Modal */}
      <DocumentHistoryModal
        isOpen={docState.historyModal.isOpen}
        onClose={() => docState.setHistoryModal({ ...docState.historyModal, isOpen: false })}
        docId={docState.historyModal.docId}
        title={docState.historyModal.title}
      />
    </div>
  );
}
