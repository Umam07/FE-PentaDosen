import React, { useEffect } from 'react';
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
import ScopusFiltersBar from './components/ScopusFiltersBar';
import NationalFiltersBar from './components/NationalFiltersBar';
import MetricsGuideModal from './components/MetricsGuideModal';
import UnconfirmedCorrespondenceBanner from './components/UnconfirmedCorrespondenceBanner';

import { PdfPreviewModal } from '../../../components/ui/pdf-preview-modal';
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

  return (
    <div className="w-full space-y-6 pb-12">

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

      {/* Baris Action Bar & Filter */}
      {!pub.urlKategori && (
        <PublicationActionBar
          onUploadClick={() => pub.setIsUploadModalOpen(true)}
          onDownloadTemplate={pub.handleDownloadTemplate}
          onImportExcel={() => {}}
          isImporting={pub.isImporting}
        />
      )}

      {/* Scopus Filters Bar (Jurnal Internasional) */}
      {(pub.urlKategori || '').toLowerCase().includes('jurnal internasional') && (
        <ScopusFiltersBar
          documents={pub.documents || []}
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

      {/* National Filters Bar (Jurnal Nasional) */}
      {(pub.urlKategori || '').toLowerCase().includes('jurnal nasional') && (
        <NationalFiltersBar
          documents={pub.documents || []}
          sintaFilter={pub.sintaFilter}
          setSintaFilter={pub.setSintaFilter}
          sourceFilter={pub.sourceFilter}
          setSourceFilter={pub.setSourceFilter}
          correspondenceFilter={pub.scopusFilter}
          setCorrespondenceFilter={pub.setScopusFilter}
          crossIndexedOnly={pub.crossIndexedOnly}
          setCrossIndexedOnly={pub.setCrossIndexedOnly}
          onResetPage={() => pub.setCurrentPage(1)}
          onUploadClick={() => pub.setIsUploadModalOpen(true)}
          onDownloadTemplate={pub.handleDownloadTemplate}
          onImportExcel={() => {}}
          isImporting={pub.isImporting}
        />
      )}


      {/* Unconfirmed Banner (Correspondence for Jurnal Internasional, SINTA for Jurnal Nasional) */}
      {(() => {
        const isJI = (pub.urlKategori || '').toLowerCase().includes('jurnal internasional');
        const isJN = (pub.urlKategori || '').toLowerCase().includes('jurnal nasional');
        const docs = isJN ? (pub.unconfirmedSintaDocs || []) : isJI ? (pub.unconfirmedCorrespondenceDocs || []) : [];
        if (docs.length === 0) return null;

        return (
          <UnconfirmedCorrespondenceBanner
            unconfirmedDocs={docs}
            isNationalJournal={isJN}
            onBulkConfirmAllNotCorresponding={handleBulkConfirmAllNotCorresponding}
            onOpenBulkModal={() => pub.setIsBulkCorrespondenceModalOpen(true)}
            onFilterUnconfirmed={() => pub.setScopusFilter('unconfirmed')}
          />
        );
      })()}


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
        }}
        setIsDeleteModalOpen={pub.setIsDeleteModalOpen}
        availableYears={pub.availableYears}
        filterYear={pub.filterYear}
        onYearChange={pub.setFilterYear}
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
