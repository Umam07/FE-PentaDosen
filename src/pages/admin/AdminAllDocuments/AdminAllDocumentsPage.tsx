import React from 'react';
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
import { PdfPreviewModal } from '../../../components/ui/pdf-preview-modal';
import { DocumentHistoryModal } from '../../../components/ui/document-history-modal';

export default function AdminAllDocuments() {
  const { user } = useOutletContext<{ user: SessionUser }>();

  const docState = useAdminAllDocuments(user);

  return (
    <div className="space-y-8 pb-12">
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
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-xs">
        
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
              <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin mx-auto" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Sinkronisasi Data...</p>
            </div>
          ) : docState.filteredDocuments.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-50 dark:bg-zinc-800 rounded-3xl flex items-center justify-center mb-6">
                <FileText className="w-10 h-10 text-gray-200" />
              </div>
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest italic">Data Tidak Ditemukan</p>
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
      <PdfPreviewModal
        isOpen={!!docState.previewDoc}
        onClose={() => docState.setPreviewDoc(null)}
        fileUrl={docState.previewDoc?.fileUrl ?? null}
        title={docState.previewDoc?.title}
        category={docState.previewDoc?.category}
      />

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
