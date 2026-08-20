import React, { useEffect } from 'react';
import type { UserSession } from './types/buku.types';
import { useBuku } from './hooks/useBuku';
import { toast } from '@/components/ui/toast';

import BukuHeader from './components/BukuHeader';
import BukuStats from './components/BukuStats';
import BukuActionBar from './components/BukuActionBar';
import BukuTable from './components/BukuTable';
import BukuUploadModal from './components/BukuUploadModal';
import BukuEditModal from './components/BukuEditModal';
import BukuLinkingModal from './components/BukuLinkingModal';
import BukuDeleteModal from './components/BukuDeleteModal';
import BukuMetricsGuideModal from './components/BukuMetricsGuideModal';

import { PdfPreviewModal } from '../../../components/ui/pdf-preview-modal';
import { DocumentDetailDrawer } from '../../../components/ui/document-detail-drawer';

export default function Buku({ user }: { user: UserSession }) {
  const buku = useBuku(user);

  const currentDocuments = buku.filteredDocuments.slice(
    (buku.currentPage - 1) * buku.itemsPerPage,
    buku.currentPage * buku.itemsPerPage
  );

  useEffect(() => {
    if (buku.message) {
      toast.show({
        title: buku.messageType === 'success' ? 'Sukses' : 'Gagal',
        message: buku.message,
        variant: buku.messageType === 'success' ? 'success' : 'error',
      });
    }
  }, [buku.message, buku.messageType]);

  return (
    <main id="main-content" className="w-full space-y-6 pb-12">
      {/* Accessible Skip to Content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-lg focus:shadow-lg"
      >
        Lewati ke Konten Utama
      </a>

      {/* Header Halaman */}
      <BukuHeader
        onOpenMetricsModal={() => buku.setIsMetricsModalOpen(true)}
      />

      {/* Kartu Ringkasan Statistik */}
      <BukuStats
        stats={buku.stats}
        isTableLoading={buku.isTableLoading}
      />

      {/* Baris Action Bar */}
      <BukuActionBar
        onUploadClick={() => buku.setIsUploadModalOpen(true)}
        onDownloadTemplate={buku.handleDownloadTemplate}
        onImportExcel={buku.handleImportExcel}
        isImporting={buku.isImporting}
      />

      {/* Tabel Buku */}
      <BukuTable
        isTableLoading={buku.isTableLoading}
        currentPage={buku.currentPage}
        setCurrentPage={buku.setCurrentPage}
        itemsPerPage={buku.itemsPerPage}
        setItemsPerPage={buku.setItemsPerPage}
        currentDocuments={currentDocuments}
        filteredDocuments={buku.filteredDocuments}
        setSelectedDocForDetail={buku.setSelectedDocForDetail}
        setPreviewDoc={buku.setPreviewDoc}
        uploadingPdfId={buku.uploadingPdfId}
        handleUploadPdf={buku.handleUploadPdf}
        openEditModal={(doc) => {
          buku.setEditDoc(doc);
          buku.setIsEditModalOpen(true);
        }}
        setDeleteDoc={buku.setDeleteDoc}
        setIsDeleteModalOpen={buku.setIsDeleteModalOpen}
        setDocToLink={buku.setDocToLink}
        setIsLinkingModalOpen={buku.setIsLinkingModalOpen}
        availableYears={buku.availableYears}
        filterYear={buku.filterYear}
        onYearChange={buku.setFilterYear}
      />

      {/* Modals */}
      <BukuUploadModal
        isOpen={buku.isUploadModalOpen}
        onClose={() => buku.setIsUploadModalOpen(false)}
        user={user}
        documents={buku.documents}
        fetchDocuments={buku.loadDocuments}
        setIsTableLoading={buku.setIsTableLoading}
        setCurrentPage={buku.setCurrentPage}
        onShowMessage={buku.showMessage}
      />

      <BukuEditModal
        isOpen={buku.isEditModalOpen}
        onClose={() => {
          buku.setIsEditModalOpen(false);
          buku.setEditDoc(null);
        }}
        editDoc={buku.editDoc}
        fetchDocuments={buku.loadDocuments}
        setIsTableLoading={buku.setIsTableLoading}
        onShowMessage={buku.showMessage}
      />

      <BukuLinkingModal
        isOpen={buku.isLinkingModalOpen}
        onClose={() => {
          buku.setIsLinkingModalOpen(false);
          buku.setDocToLink(null);
        }}
        approvedResearch={buku.approvedResearch}
        docToLink={buku.docToLink}
        setDocToLink={buku.setDocToLink}
        fetchDocuments={buku.loadDocuments}
        onShowMessage={buku.showMessage}
      />

      <BukuDeleteModal
        isOpen={buku.isDeleteModalOpen}
        onClose={() => {
          buku.setIsDeleteModalOpen(false);
          buku.setDeleteDoc(null);
        }}
        deleteDoc={buku.deleteDoc}
        setDeleteDoc={buku.setDeleteDoc}
        fetchDocuments={buku.loadDocuments}
        setIsTableLoading={buku.setIsTableLoading}
        setCurrentPage={buku.setCurrentPage}
        onShowMessage={buku.showMessage}
      />

      <BukuMetricsGuideModal
        isOpen={buku.isMetricsModalOpen}
        onClose={() => buku.setIsMetricsModalOpen(false)}
      />

      <PdfPreviewModal
        isOpen={!!buku.previewDoc}
        onClose={() => buku.setPreviewDoc(null)}
        fileUrl={buku.previewDoc?.fileUrl ?? null}
        title={buku.previewDoc?.title}
        category={buku.previewDoc?.category}
      />

      {buku.activeDetailDoc && (
        <DocumentDetailDrawer
          isOpen={!!buku.selectedDocForDetail}
          onClose={() => buku.setSelectedDocForDetail(null)}
          category={buku.activeDetailDoc.category || ''}
          title={buku.activeDetailDoc.title || ''}
          status={buku.activeDetailDoc.status || 'Pending'}
          catatan={buku.activeDetailDoc.catatan}
          year={buku.activeDetailDoc.published_at ? new Date(buku.activeDetailDoc.published_at).getFullYear() : '-'}
          points={buku.activeDetailDoc.awarded_points || 0}
          isKpiCounted={buku.activeDetailDoc.is_kpi_counted}
          fileUrl={buku.activeDetailDoc.file_url}
          docId={buku.activeDetailDoc.id}
          onPreviewClick={() => {
            if (buku.activeDetailDoc?.file_url) {
              buku.setPreviewDoc({
                fileUrl: buku.activeDetailDoc.file_url,
                title: buku.activeDetailDoc.title || '',
                category: buku.activeDetailDoc.category || ''
              });
            }
          }}
          onUploadPdf={buku.handleUploadPdf}
        />
      )}
    </main>
  );
}

