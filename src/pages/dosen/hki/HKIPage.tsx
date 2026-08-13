import React, { useEffect } from 'react';
import type { UserSession } from './types/hki.types';
import { useHki } from './hooks/useHki';
import { toast } from '@/components/ui/toast';

import HKIHeader from './components/HKIHeader';
import HKIStats from './components/HKIStats';
import HKIActionBar from './components/HKIActionBar';
import HKITable from './components/HKITable';
import HKIUploadModal from './components/HKIUploadModal';
import HKIEditModal from './components/HKIEditModal';
import HKILinkingModal from './components/HKILinkingModal';
import HKIDeleteModal from './components/HKIDeleteModal';
import HKIMetricsGuideModal from './components/HKIMetricsGuideModal';

import { PdfPreviewModal } from '../../../components/ui/pdf-preview-modal';
import { DocumentDetailDrawer } from '../../../components/ui/document-detail-drawer';

export default function HKI({ user }: { user: UserSession }) {
  const hki = useHki(user);

  const currentDocuments = hki.filteredDocuments.slice(
    (hki.currentPage - 1) * hki.itemsPerPage,
    hki.currentPage * hki.itemsPerPage
  );

  useEffect(() => {
    if (hki.message) {
      toast.show({
        title: hki.messageType === 'success' ? 'Sukses' : 'Gagal',
        message: hki.message,
        variant: hki.messageType === 'success' ? 'success' : 'error',
      });
    }
  }, [hki.message, hki.messageType]);

  return (
    <div className="w-full space-y-8 pb-12">

      {/* Header Halaman */}
      <HKIHeader
        onOpenMetricsModal={() => hki.setIsMetricsModalOpen(true)}
      />

      {/* Kartu Ringkasan Statistik */}
      <HKIStats
        stats={hki.stats}
        isTableLoading={hki.isTableLoading}
      />

      {/* Baris Action Bar */}
      <HKIActionBar
        onUploadClick={() => hki.setIsUploadModalOpen(true)}
        onDownloadTemplate={hki.handleDownloadTemplate}
        onImportExcel={hki.handleImportExcel}
        isImporting={hki.isImporting}
      />

      {/* Tabel HKI */}
      <HKITable
        isTableLoading={hki.isTableLoading}
        currentDocuments={currentDocuments}
        filteredDocuments={hki.filteredDocuments}
        currentPage={hki.currentPage}
        setCurrentPage={hki.setCurrentPage}
        itemsPerPage={hki.itemsPerPage}
        setItemsPerPage={hki.setItemsPerPage}
        setSelectedDocForDetail={hki.setSelectedDocForDetail}
        setPreviewDoc={hki.setPreviewDoc}
        uploadingPdfId={hki.uploadingPdfId}
        handleUploadPdf={hki.handleUploadPdf}
        openEditModal={(doc) => {
          hki.setEditDoc(doc);
          hki.setIsEditModalOpen(true);
        }}
        setDeleteDoc={hki.setDeleteDoc}
        setIsDeleteModalOpen={hki.setIsDeleteModalOpen}
        setDocToLink={hki.setDocToLink}
        setIsLinkingModalOpen={hki.setIsLinkingModalOpen}
        availableYears={hki.availableYears}
        filterYear={hki.filterYear}
        onYearChange={hki.setFilterYear}
      />

      {/* Modals */}
      <HKIUploadModal
        isOpen={hki.isUploadModalOpen}
        onClose={() => hki.setIsUploadModalOpen(false)}
        user={user}
        documents={hki.documents}
        weights={hki.weights}
        isWeightsLoading={hki.isWeightsLoading}
        fetchDocuments={hki.loadDocuments}
        setIsTableLoading={hki.setIsTableLoading}
        setCurrentPage={hki.setCurrentPage}
        onShowMessage={hki.showMessage}
      />

      <HKIEditModal
        isOpen={hki.isEditModalOpen}
        onClose={() => {
          hki.setIsEditModalOpen(false);
          hki.setEditDoc(null);
        }}
        editDoc={hki.editDoc}
        fetchDocuments={hki.loadDocuments}
        setIsTableLoading={hki.setIsTableLoading}
        onShowMessage={hki.showMessage}
      />

      <HKILinkingModal
        isOpen={hki.isLinkingModalOpen}
        onClose={() => {
          hki.setIsLinkingModalOpen(false);
          hki.setDocToLink(null);
        }}
        approvedResearch={hki.approvedResearch}
        docToLink={hki.docToLink}
        setDocToLink={hki.setDocToLink}
        fetchDocuments={hki.loadDocuments}
        onShowMessage={hki.showMessage}
      />

      <HKIDeleteModal
        isOpen={hki.isDeleteModalOpen}
        onClose={() => {
          hki.setIsDeleteModalOpen(false);
          hki.setDeleteDoc(null);
        }}
        deleteDoc={hki.deleteDoc}
        setDeleteDoc={hki.setDeleteDoc}
        fetchDocuments={hki.loadDocuments}
        setIsTableLoading={hki.setIsTableLoading}
        setCurrentPage={hki.setCurrentPage}
        onShowMessage={hki.showMessage}
      />

      <HKIMetricsGuideModal
        isOpen={hki.isMetricsModalOpen}
        onClose={() => hki.setIsMetricsModalOpen(false)}
      />

      <PdfPreviewModal
        isOpen={!!hki.previewDoc}
        onClose={() => hki.setPreviewDoc(null)}
        fileUrl={hki.previewDoc?.fileUrl ?? null}
        title={hki.previewDoc?.title}
        category={hki.previewDoc?.category}
      />

      {hki.activeDetailDoc && (
        <DocumentDetailDrawer
          isOpen={!!hki.selectedDocForDetail}
          onClose={() => hki.setSelectedDocForDetail(null)}
          category={hki.activeDetailDoc.category || ''}
          title={hki.activeDetailDoc.title || ''}
          status={hki.activeDetailDoc.status || 'Pending'}
          catatan={hki.activeDetailDoc.catatan}
          year={hki.activeDetailDoc.published_at ? new Date(hki.activeDetailDoc.published_at).getFullYear() : '-'}
          points={hki.activeDetailDoc.awarded_points || 0}
          isKpiCounted={hki.activeDetailDoc.is_kpi_counted}
          fileUrl={hki.activeDetailDoc.file_url}
          docId={hki.activeDetailDoc.id}
          onPreviewClick={() => {
            if (hki.activeDetailDoc?.file_url) {
              hki.setPreviewDoc({
                fileUrl: hki.activeDetailDoc.file_url,
                title: hki.activeDetailDoc.title || '',
                category: hki.activeDetailDoc.category || ''
              });
            }
          }}
          onUploadPdf={hki.handleUploadPdf}
        />
      )}
    </div>
  );
}
