import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { UserSession } from './types/research.types';
import { useResearch } from './hooks/useResearch';

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

  const totalPages = Math.ceil(res.filteredResearchList.length / res.itemsPerPage) || 1;
  const indexOfLastItem = res.currentPage * res.itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - res.itemsPerPage;
  const currentItems = res.filteredResearchList.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Notification */}
      <AnimatePresence>
        {res.message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-5 right-5 z-[999] p-4 rounded-xl shadow-lg border flex items-center gap-3 text-xs font-bold ${
              res.messageType === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800'
                : 'bg-red-50 dark:bg-red-950/90 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800'
            }`}
          >
            {res.messageType === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600" />
            )}
            <span>{res.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

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
        onEditClick={(doc) => {
          res.setEditDoc(doc);
          res.setIsEditModalOpen(true);
        }}
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
        onErrorMsg={(msg) => res.showMessage(msg, 'error')}
        onSubmit={async (e) => {
          e.preventDefault();
          res.setLoading(true);
          try {
            const formData = new FormData();
            formData.append('user_id', String(user.id));
            formData.append('judul_penelitian', res.judulPenelitian);
            formData.append('dana_disetujui', res.danaDisetujui);
            formData.append('program', res.program);
            formData.append('skema', res.skema);
            formData.append('fokus', res.fokus);
            formData.append('tahun', res.tahun ? String(res.tahun.getFullYear()) : String(new Date().getFullYear()));
            formData.append('doc_type', res.docType);
            if (res.file) formData.append('file', res.file);

            const r = await fetch('/api/penelitian', { method: 'POST', body: formData });
            const data = await r.json();
            if (r.ok) {
              res.showMessage('Penelitian berhasil ditambahkan!', 'success');
              res.setIsUploadModalOpen(false);
              res.setJudulPenelitian('');
              res.setDanaDisetujui('');
              res.setSkema('');
              res.setFokus('');
              res.setFile(null);
              await res.loadResearchList();
            } else {
              res.showMessage(data.message || 'Gagal menambahkan penelitian.', 'error');
            }
          } catch (err) {
            res.showMessage('Terjadi kesalahan koneksi.', 'error');
          } finally {
            res.setLoading(false);
          }
        }}
      />

      {res.editDoc && (
        <ResearchEditModal
          isOpen={res.isEditModalOpen}
          onClose={() => {
            res.setIsEditModalOpen(false);
            res.setEditDoc(null);
          }}
          editDoc={res.editDoc}
          editJudul={res.editDoc.judul_penelitian}
          setEditJudul={() => {}}
          editDana={String(res.editDoc.dana_disetujui)}
          setEditDana={() => {}}
          editProgram={res.editDoc.program}
          setEditProgram={() => {}}
          editSkema={res.editDoc.skema || ''}
          setEditSkema={() => {}}
          editFokus={res.editDoc.fokus || ''}
          setEditFokus={() => {}}
          editTahun={new Date(Number(res.editDoc.tahun), 0, 1)}
          setEditTahun={() => {}}
          editFile={null}
          setEditFile={() => {}}
          isEditLoading={false}
          onSubmit={async (e) => {
            e.preventDefault();
            res.setIsEditModalOpen(false);
            res.setEditDoc(null);
            await res.loadResearchList();
          }}
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
          isKpiCounted={res.activeDetailDoc.is_kpi_counted}
          fileUrl={res.activeDetailDoc.file_url}
          docId={res.activeDetailDoc.id}
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
