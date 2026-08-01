import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { UserSession } from './types/publication.types';
import { usePublication } from './hooks/usePublication';

import PublicationHeader from './components/PublicationHeader';
import PublicationStats from './components/PublicationStats';
import PublicationActionBar from './components/PublicationActionBar';
import PublicationTable from './components/PublicationTable';
import PublicationUploadModal from './components/PublicationUploadModal';
import PublicationLinkingModal from './components/PublicationLinkingModal';
import PublicationEditModal from './components/PublicationEditModal';
import PublicationDeleteModal from './components/PublicationDeleteModal';
import ScopusFiltersBar from './components/ScopusFiltersBar';
import MetricsGuideModal from './components/MetricsGuideModal';
import UnconfirmedCorrespondenceBanner from './components/UnconfirmedCorrespondenceBanner';
import BulkCorrespondenceModal from './components/BulkCorrespondenceModal';

import { PdfPreviewModal } from '../../../components/ui/pdf-preview-modal';
import { DocumentDetailDrawer } from '../../../components/ui/document-detail-drawer';

export default function Publication({ user }: { user: UserSession }) {
  const pub = usePublication(user);

  const handleBulkSaveCorrespondence = async (selections: Record<string | number, boolean>) => {
    try {
      const res = await fetch('/api/documents/bulk-correspondence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selections }),
      });
      if (res.ok) {
        pub.showMessage('Konfirmasi status korespondensi berhasil disimpan!', 'success');
        await pub.loadDocuments();
        pub.setIsBulkCorrespondenceModalOpen(false);
      } else {
        const data = await res.json();
        pub.showMessage(data.message || 'Gagal menyimpan korespondensi.', 'error');
      }
    } catch (e) {
      pub.showMessage('Terjadi kesalahan saat menyimpan.', 'error');
    }
  };

  const handleBulkConfirmAllNotCorresponding = async () => {
    const selections: Record<string | number, boolean> = {};
    pub.unconfirmedCorrespondenceDocs.forEach(d => {
      selections[d.id] = false;
    });
    await handleBulkSaveCorrespondence(selections);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Notification */}
      <AnimatePresence>
        {pub.message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-5 right-5 z-[999] p-4 rounded-xl shadow-lg border flex items-center gap-3 text-xs font-bold ${
              pub.messageType === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800'
                : 'bg-red-50 dark:bg-red-950/90 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800'
            }`}
          >
            {pub.messageType === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600" />
            )}
            <span>{pub.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Halaman */}
      <PublicationHeader
        urlKategori={pub.urlKategori}
        onOpenMetricsModal={() => pub.setIsMetricsModalOpen(true)}
      />

      {/* Unconfirmed Correspondence Banner */}
      {pub.urlKategori === 'Jurnal Internasional' && pub.unconfirmedCorrespondenceDocs.length > 0 && (
        <UnconfirmedCorrespondenceBanner
          unconfirmedDocs={pub.unconfirmedCorrespondenceDocs}
          onBulkConfirmAllNotCorresponding={handleBulkConfirmAllNotCorresponding}
          onOpenBulkModal={() => pub.setIsBulkCorrespondenceModalOpen(true)}
          onFilterUnconfirmed={() => pub.setScopusFilter('unconfirmed')}
        />
      )}

      {/* Kartu Ringkasan Statistik */}
      <PublicationStats
        stats={{ ...pub.stats, crossIndexed: pub.crossIndexedCount }}
        isTableLoading={pub.isTableLoading}
        onCrossIndexedClick={() => pub.setCrossIndexedOnly(prev => !prev)}
        isCrossIndexedActive={pub.crossIndexedOnly}
      />

      {/* Baris Action Bar & Filter */}
      {!pub.urlKategori && (
        <PublicationActionBar
          onUploadClick={() => pub.setIsUploadModalOpen(true)}
          onDownloadTemplate={pub.handleDownloadTemplate}
          onImportExcel={() => {}}
          isImporting={pub.isImporting}
        />
      )}

      {/* Scopus Filters Bar */}
      {pub.urlKategori === 'Jurnal Internasional' && (
        <ScopusFiltersBar
          documents={pub.documents}
          scopusFilter={pub.scopusFilter}
          setScopusFilter={pub.setScopusFilter}
          articleFilter={pub.articleFilter}
          setArticleFilter={pub.setArticleFilter}
          quartileFilter={pub.quartileFilter}
          setQuartileFilter={pub.setQuartileFilter}
          sourceFilter={pub.sourceFilter}
          setSourceFilter={pub.setSourceFilter}
          crossIndexedOnly={pub.crossIndexedOnly}
          setCrossIndexedOnly={pub.setCrossIndexedOnly}
          onResetPage={() => pub.setCurrentPage(1)}
          onUploadClick={() => pub.setIsUploadModalOpen(true)}
          onDownloadTemplate={pub.handleDownloadTemplate}
          onImportExcel={() => {}}
          isImporting={pub.isImporting}
        />
      )}

      {/* Tabel Publikasi */}
      <PublicationTable
        isTableLoading={pub.isTableLoading}
        currentDocuments={pub.filteredDocuments.slice((pub.currentPage - 1) * pub.itemsPerPage, pub.currentPage * pub.itemsPerPage)}
        filteredDocuments={pub.filteredDocuments}
        currentPage={pub.currentPage}
        setCurrentPage={pub.setCurrentPage}
        itemsPerPage={pub.itemsPerPage}
        setItemsPerPage={pub.setItemsPerPage}
        setSelectedDocForDetail={pub.setSelectedDocForDetail}
        setPreviewDoc={pub.setPreviewDoc}
        uploadingPdfId={pub.uploadingPdfId}
        handleUploadPdf={pub.handleUploadPdf}
        openEditModal={(doc) => {
          pub.setEditDoc(doc);
          pub.setIsEditModalOpen(true);
        }}
        setDeleteDoc={(doc) => {
          pub.setDeleteDoc(doc);
          pub.setIsDeleteModalOpen(true);
        }}
        openLinkingModal={(doc) => {
          pub.setDocToLink(doc);
          pub.setIsLinkingModalOpen(true);
        }}
        fetchDocuments={pub.loadDocuments}
        onShowMessage={pub.showMessage}
      />

      {/* Modals */}
      <PublicationUploadModal
        isOpen={pub.isUploadModalOpen}
        onClose={() => pub.setIsUploadModalOpen(false)}
        user={user}
        documents={pub.documents}
        category={pub.category}
        weights={pub.weights}
        isWeightsLoading={pub.isWeightsLoading}
        fetchDocuments={pub.loadDocuments}
        setIsTableLoading={pub.setIsTableLoading}
        setCurrentPage={pub.setCurrentPage}
        onShowMessage={pub.showMessage}
      />

      <PublicationLinkingModal
        isOpen={pub.isLinkingModalOpen}
        onClose={() => {
          pub.setIsLinkingModalOpen(false);
          pub.setDocToLink(null);
        }}
        approvedResearch={pub.approvedResearch}
        docToLink={pub.docToLink}
        setDocToLink={pub.setDocToLink}
        fetchDocuments={pub.loadDocuments}
        onShowMessage={pub.showMessage}
      />

      <PublicationEditModal
        isOpen={pub.isEditModalOpen}
        onClose={() => {
          pub.setIsEditModalOpen(false);
          pub.setEditDoc(null);
        }}
        editDoc={pub.editDoc}
        weights={pub.weights}
        fetchDocuments={pub.loadDocuments}
        setIsTableLoading={pub.setIsTableLoading}
        onShowMessage={pub.showMessage}
      />

      <PublicationDeleteModal
        isOpen={pub.isDeleteModalOpen}
        onClose={() => {
          pub.setIsDeleteModalOpen(false);
          pub.setDeleteDoc(null);
        }}
        deleteDoc={pub.deleteDoc}
        setDeleteDoc={pub.setDeleteDoc}
        fetchDocuments={pub.loadDocuments}
        setIsTableLoading={pub.setIsTableLoading}
        setCurrentPage={pub.setCurrentPage}
        onShowMessage={pub.showMessage}
      />

      <BulkCorrespondenceModal
        isOpen={pub.isBulkCorrespondenceModalOpen}
        onClose={() => pub.setIsBulkCorrespondenceModalOpen(false)}
        unconfirmedDocs={pub.unconfirmedCorrespondenceDocs}
        onSaveBulk={handleBulkSaveCorrespondence}
      />

      <MetricsGuideModal
        isOpen={pub.isMetricsModalOpen}
        onClose={() => pub.setIsMetricsModalOpen(false)}
      />

      <PdfPreviewModal
        isOpen={!!pub.previewDoc}
        onClose={() => pub.setPreviewDoc(null)}
        fileUrl={pub.previewDoc?.fileUrl ?? null}
        title={pub.previewDoc?.title}
        category={pub.previewDoc?.category}
      />

      {pub.activeDetailDoc && (
        <DocumentDetailDrawer
          isOpen={!!pub.selectedDocForDetail}
          onClose={() => pub.setSelectedDocForDetail(null)}
          category={pub.activeDetailDoc.category || ''}
          title={pub.activeDetailDoc.title || ''}
          status={pub.activeDetailDoc.status || 'Pending'}
          catatan={pub.activeDetailDoc.catatan}
          year={pub.activeDetailDoc.published_at ? new Date(pub.activeDetailDoc.published_at).getFullYear() : '-'}
          points={pub.activeDetailDoc.awarded_points || 0}
          isKpiCounted={pub.activeDetailDoc.is_kpi_counted}
          fileUrl={pub.activeDetailDoc.file_url}
          docId={pub.activeDetailDoc.id}
          onPreviewClick={() => {
            if (pub.activeDetailDoc?.file_url) {
              pub.setPreviewDoc({
                fileUrl: pub.activeDetailDoc.file_url,
                title: pub.activeDetailDoc.title || '',
                category: pub.activeDetailDoc.category || ''
              });
            }
          }}
          onUploadPdf={pub.handleUploadPdf}
        />
      )}
    </div>
  );
}
