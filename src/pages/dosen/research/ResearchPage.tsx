import React, { useEffect } from 'react';
import type { UserSession } from './types/research.types';
import { useResearch } from './hooks/useResearch';
import { toast } from '@/components/ui/toast';

import ResearchHeader from './components/ResearchHeader';
import ResearchStats from './components/ResearchStats';
import ResearchActionBar from './components/ResearchActionBar';
import ResearchTable from './components/ResearchTable';
import ResearchUploadModal from './components/ResearchUploadModal';
import ResearchEditModal from './components/ResearchEditModal';
import ResearchDeleteModal from './components/ResearchDeleteModal';
import ResearchMetricsGuideModal from './components/ResearchMetricsGuideModal';

import { PdfPreviewModal } from '../../../components/ui/pdf-preview-modal';
import { DocumentDetailDrawer } from '../../../components/ui/document-detail-drawer';

export default function Research({ user }: { user: UserSession }) {
  const res = useResearch(user);

  useEffect(() => {
    if (res.message) {
      toast.show({
        title: res.messageType === 'success' ? 'Sukses' : 'Gagal',
        message: res.message,
        variant: res.messageType === 'success' ? 'success' : 'error',
      });
    }
  }, [res.message, res.messageType]);

  const totalPages = Math.ceil(res.filteredResearchList.length / res.itemsPerPage) || 1;
  const indexOfLastItem = res.currentPage * res.itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - res.itemsPerPage;
  const currentItems = res.filteredResearchList.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Halaman */}
      <ResearchHeader
        onOpenMetricsModal={() => res.setIsMetricsModalOpen(true)}
      />

      {/* Kartu Ringkasan Statistik */}
      <ResearchStats
        stats={res.stats}
        isTableLoading={res.isTableLoading}
      />

      {/* Action Bar */}
      <ResearchActionBar
        onUploadClick={() => res.setIsUploadModalOpen(true)}
        onDownloadTemplate={res.handleDownloadTemplate}
        onImportExcel={() => {}}
        isImporting={res.isImporting}
      />

      {/* Tabel Research */}
      <ResearchTable
        researchList={res.filteredResearchList}
        currentItems={currentItems}
        isTableLoading={res.isTableLoading}
        currentPage={res.currentPage}
        itemsPerPage={res.itemsPerPage}
        totalPages={totalPages}
        indexOfFirstItem={indexOfFirstItem}
        indexOfLastItem={indexOfLastItem}
        setCurrentPage={res.setCurrentPage}
        setItemsPerPage={res.setItemsPerPage}
        onViewDetail={res.setSelectedDocForDetail}
        onPreviewPdf={res.setPreviewDoc}
        onUploadPdf={res.handleUploadPdf}
        uploadingPdfId={res.uploadingPdfId}
        onEditClick={res.openEditModal}
        onDeleteClick={(doc) => {
          res.setDeleteDoc(doc);
          res.setIsDeleteModalOpen(true);
        }}
        availableYears={res.availableYears}
        filterYear={res.filterYear}
        onYearChange={res.setFilterYear}
      />

      {/* Modals */}
      <ResearchUploadModal
        isOpen={res.isUploadModalOpen}
        onClose={() => res.setIsUploadModalOpen(false)}
        program={res.program}
        setProgram={res.setProgram}
        judulPenelitian={res.judulPenelitian}
        setJudulPenelitian={res.setJudulPenelitian}
        skema={res.skema}
        setSkema={res.setSkema}
        fokus={res.fokus}
        setFokus={res.setFokus}
        danaDisetujui={res.danaDisetujui}
        setDanaDisetujui={res.setDanaDisetujui}
        tahun={res.tahun}
        setTahun={res.setTahun}
        docType={res.docType}
        setDocType={res.setDocType}
        file={res.file}
        setFile={res.setFile}
        loading={res.loading}
        onSubmit={res.handleUpload}
        onErrorMsg={(msg) => res.showMessage(msg, 'error')}
        uploadProgress={res.uploadProgress}
      />

      {res.editDoc && (
        <ResearchEditModal
          isOpen={res.isEditModalOpen}
          onClose={() => {
            res.setIsEditModalOpen(false);
            res.setEditDoc(null);
          }}
          editDoc={res.editDoc}
          editJudul={res.editJudul}
          setEditJudul={res.setEditJudul}
          editDana={res.editDana}
          setEditDana={res.setEditDana}
          editProgram={res.editProgram}
          setEditProgram={res.setEditProgram}
          editSkema={res.editSkema}
          setEditSkema={res.setEditSkema}
          editFokus={res.editFokus}
          setEditFokus={res.setEditFokus}
          editTahun={res.editTahun}
          setEditTahun={res.setEditTahun}
          editFile={res.editFile}
          setEditFile={res.setEditFile}
          isEditLoading={res.isEditLoading}
          onSubmit={res.handleUpdate}
          uploadProgress={res.editUploadProgress}
        />
      )}

      <ResearchDeleteModal
        isOpen={res.isDeleteModalOpen}
        onClose={() => {
          res.setIsDeleteModalOpen(false);
          res.setDeleteDoc(null);
        }}
        deleteDoc={res.deleteDoc}
        onDelete={res.handleDeleteSubmit}
        isDeleteLoading={res.isDeleteLoading}
      />

      <ResearchMetricsGuideModal
        isOpen={res.isMetricsModalOpen}
        onClose={() => res.setIsMetricsModalOpen(false)}
      />

      <PdfPreviewModal
        isOpen={!!res.previewDoc}
        onClose={() => res.setPreviewDoc(null)}
        fileUrl={res.previewDoc?.fileUrl ?? null}
        title={res.previewDoc?.title}
        category={res.previewDoc?.category}
      />

      {res.activeDetailDoc && (
        <DocumentDetailDrawer
          isOpen={!!res.selectedDocForDetail}
          onClose={() => res.setSelectedDocForDetail(null)}
          category={res.activeDetailDoc.program || 'Penelitian'}
          title={res.activeDetailDoc.judul_penelitian || ''}
          status={res.activeDetailDoc.status || 'Pending'}
          catatan={res.activeDetailDoc.catatan}
          year={res.activeDetailDoc.tahun}
          points={res.activeDetailDoc.awarded_points || 0}
          isKpiCounted={true}
          hideKpiClassification={true}
          customMetadata={
            <div>
              <p className="text-[9px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest leading-none mb-1.5">
                Dana Disetujui
              </p>
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-gray-800 dark:text-zinc-200">
                Rp {Number(res.activeDetailDoc.dana_disetujui || 0).toLocaleString('id-ID')}
              </div>
            </div>
          }
          showResearchLink={false}
          fileUrl={res.activeDetailDoc.file_url}
          docId={res.activeDetailDoc.id}
          uploadingPdfId={res.uploadingPdfId}
          onPreviewClick={() => {
            if (res.activeDetailDoc?.file_url) {
              res.setPreviewDoc({
                fileUrl: res.activeDetailDoc.file_url,
                title: res.activeDetailDoc.judul_penelitian || '',
                category: res.activeDetailDoc.program || 'Penelitian',
              });
            }
          }}
          onUploadPdf={res.handleUploadPdf}
        />
      )}
    </div>
  );
}
