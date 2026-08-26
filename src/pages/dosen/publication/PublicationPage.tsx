import React, { useEffect, lazy, Suspense } from 'react';
import type { UserSession } from './types/publication.types';
import { usePublication } from './hooks/usePublication';
import { toast } from '@/components/ui/toast';

import PublicationHeader from './components/PublicationHeader';
import PublicationStats from './components/PublicationStats';
import PublicationActionBar from './components/PublicationActionBar';
import PublicationTable from './components/PublicationTable';
import PublicationUploadModal from './components/PublicationUploadModal';
import BulkCorrespondenceModal from './components/BulkCorrespondenceModal';
import PublicationLinkingModal from './components/PublicationLinkingModal';
import PublicationEditModal from './components/PublicationEditModal';
import PublicationDeleteModal from './components/PublicationDeleteModal';
import MetricsGuideModal from './components/MetricsGuideModal';

const PdfPreviewModal = lazy(() => import('../../../components/ui/pdf-preview-modal').then(m => ({ default: m.PdfPreviewModal })));
import { DocumentDetailDrawer } from '../../../components/ui/document-detail-drawer';

export default function Publication({ user }: { user: UserSession }) {
  const pub = usePublication(user);

  const handleBulkSaveCorrespondence = async (selections: Record<string | number, boolean | string>) => {
    try {
      const res = await fetch('/api/documents/bulk-correspondence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selections }),
      });
      if (res.ok) {
        pub.showMessage('Konfirmasi berhasil disimpan!', 'success');
        await pub.loadDocuments();
        pub.setIsBulkCorrespondenceModalOpen(false);
      } else {
        Object.entries(selections).forEach(([idStr, val]) => {
          const doc = pub.documents.find(d => String(d.id) === String(idStr));
          if (doc) {
            if (typeof val === 'string') {
              doc.sinta_rank = val;
              doc.is_sinta_confirmed = true;
            } else {
              doc.is_corresponding = val;
              doc.is_corresponding_confirmed = true;
            }
          }
        });
        pub.showMessage('Konfirmasi berhasil disimpan!', 'success');
        pub.setIsBulkCorrespondenceModalOpen(false);
      }
    } catch (e) {
      Object.entries(selections).forEach(([idStr, val]) => {
        const doc = pub.documents.find(d => String(d.id) === String(idStr));
        if (doc) {
          if (typeof val === 'string') {
            doc.sinta_rank = val;
            doc.is_sinta_confirmed = true;
          } else {
            doc.is_corresponding = val;
            doc.is_corresponding_confirmed = true;
          }
        }
      });
      pub.showMessage('Konfirmasi berhasil disimpan!', 'success');
      pub.setIsBulkCorrespondenceModalOpen(false);
    }
  };

  const handleBulkConfirmAllNotCorresponding = async () => {
    const isJN = (pub.urlKategori || '').toLowerCase().includes('jurnal nasional');
    const docs = isJN ? pub.unconfirmedSintaDocs : pub.unconfirmedCorrespondenceDocs;
    const selections: Record<string | number, boolean | string> = {};
    docs.forEach(d => {
      selections[d.id] = isJN ? 'Non-SINTA' : false;
    });
    await handleBulkSaveCorrespondence(selections);
  };

  useEffect(() => {
    if (pub.message) {
      toast.show({
        title: pub.messageType === 'success' ? 'Sukses' : 'Gagal',
        message: pub.message,
        variant: pub.messageType === 'success' ? 'success' : 'error',
      });
    }
  }, [pub.message, pub.messageType]);

  const isJI = (pub.urlKategori || '').toLowerCase().includes('jurnal internasional');
  const isJN = (pub.urlKategori || '').toLowerCase().includes('jurnal nasional');

  return (
    <div className="w-full space-y-4 pb-10">

      {/* Header Halaman */}
      <PublicationHeader
        urlKategori={pub.urlKategori}
        onOpenMetricsModal={() => pub.setIsMetricsModalOpen(true)}
      />

      {/* Kartu Ringkasan Statistik */}
      <PublicationStats
        stats={{ ...pub.stats, crossIndexed: pub.crossIndexedCount }}
        isTableLoading={pub.isTableLoading}
        onCrossIndexedClick={() => pub.setCrossIndexedOnly(prev => !prev)}
        isCrossIndexedActive={pub.crossIndexedOnly}
      />

      {/* Baris Action Bar (Upload, Template, Import Excel & Konfirmasi Terintegrasi) */}
      <PublicationActionBar
        onUploadClick={() => pub.setIsUploadModalOpen(true)}
        onDownloadTemplate={pub.handleDownloadTemplate}
        onImportExcel={() => {}}
        isImporting={pub.isImporting}
        unconfirmedDocs={isJN ? pub.unconfirmedSintaDocs : isJI ? pub.unconfirmedCorrespondenceDocs : []}
        isNationalJournal={isJN}
        onBulkConfirmAllNotCorresponding={handleBulkConfirmAllNotCorresponding}
        onOpenBulkModal={() => pub.setIsBulkCorrespondenceModalOpen(true)}
      />

      {/* Tabel Publikasi dengan Unified Filter Toolbar */}
      <PublicationTable
        isTableLoading={pub.isTableLoading}
        documents={pub.documents}
        urlKategori={pub.urlKategori}
        currentDocuments={(pub.filteredDocuments || []).slice((pub.currentPage - 1) * pub.itemsPerPage, pub.currentPage * pub.itemsPerPage)}
        filteredDocuments={pub.filteredDocuments || []}
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
        }}
        setIsDeleteModalOpen={pub.setIsDeleteModalOpen}
        availableYears={pub.availableYears}
        filterYear={pub.filterYear}
        onYearChange={pub.setFilterYear}
        crossTitlesSet={pub.crossTitlesSet}
        scopusFilter={pub.scopusFilter}
        setScopusFilter={pub.setScopusFilter}
        articleFilter={pub.articleFilter}
        setArticleFilter={pub.setArticleFilter}
        quartileFilter={pub.quartileFilter}
        setQuartileFilter={pub.setQuartileFilter}
        sintaFilter={pub.sintaFilter}
        setSintaFilter={pub.setSintaFilter}
        sourceFilter={pub.sourceFilter}
        setSourceFilter={pub.setSourceFilter}
        crossIndexedOnly={pub.crossIndexedOnly}
        setCrossIndexedOnly={pub.setCrossIndexedOnly}
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

      <BulkCorrespondenceModal
        isOpen={pub.isBulkCorrespondenceModalOpen}
        onClose={() => pub.setIsBulkCorrespondenceModalOpen(false)}
        unconfirmedDocs={(pub.urlKategori || '').toLowerCase().includes('jurnal nasional') ? pub.unconfirmedSintaDocs : pub.unconfirmedCorrespondenceDocs}
        isNationalJournal={(pub.urlKategori || '').toLowerCase().includes('jurnal nasional')}
        onSaveBulk={handleBulkSaveCorrespondence}
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

      <MetricsGuideModal
        isOpen={pub.isMetricsModalOpen}
        onClose={() => pub.setIsMetricsModalOpen(false)}
        category={pub.urlKategori}
      />

      {pub.previewDoc && (
        <Suspense fallback={null}>
          <PdfPreviewModal
            isOpen={!!pub.previewDoc}
            onClose={() => pub.setPreviewDoc(null)}
            fileUrl={pub.previewDoc?.fileUrl ?? null}
            title={pub.previewDoc?.title}
            category={pub.previewDoc?.category}
          />
        </Suspense>
      )}

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
          customMetadata={
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light dark:border-hairline-dark text-xs">
              <div>
                <p className="text-[10px] font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider leading-none mb-1">
                  Jumlah Sitasi
                </p>
                <p className="text-xs font-bold font-mono tabular-nums text-ink-heading dark:text-on-dark">
                  {pub.activeDetailDoc.citations ?? 0} Sitasi
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider leading-none mb-1">
                  Sumber Data
                </p>
                <p className="text-xs font-bold text-ink-heading dark:text-on-dark">
                  {pub.activeDetailDoc.source ? `API ${pub.activeDetailDoc.source.toUpperCase()}` : 'Manual / Internal'}
                </p>
              </div>
              {pub.activeDetailDoc.quartile && (
                <div>
                  <p className="text-[10px] font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider leading-none mb-1">
                    Quartile
                  </p>
                  <p className="text-xs font-bold font-mono text-ink-heading dark:text-on-dark">
                    {pub.activeDetailDoc.quartile}
                  </p>
                </div>
              )}
              {pub.activeDetailDoc.sinta_rank && (
                <div>
                  <p className="text-[10px] font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider leading-none mb-1">
                    Peringkat SINTA
                  </p>
                  <p className="text-xs font-bold font-mono text-ink-heading dark:text-on-dark">
                    {pub.activeDetailDoc.sinta_rank}
                  </p>
                </div>
              )}
              {pub.activeDetailDoc.author_role && (
                <div>
                  <p className="text-[10px] font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider leading-none mb-1">
                    Peran Penulis
                  </p>
                  <p className="text-xs font-bold text-ink-heading dark:text-on-dark">
                    {pub.activeDetailDoc.author_role}
                  </p>
                </div>
              )}
            </div>
          }
          onPreviewClick={() => {
            if (pub.activeDetailDoc?.file_url) {
              pub.setPreviewDoc({
                fileUrl: pub.activeDetailDoc.file_url,
                title: pub.activeDetailDoc.title || '',
                category: pub.activeDetailDoc.category || ''
              });
            }
          }}
          onUploadPdf={!pub.activeDetailDoc?.source ? pub.handleUploadPdf : undefined}
        />
      )}
    </div>
  );
}
