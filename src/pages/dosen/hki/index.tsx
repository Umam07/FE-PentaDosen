import React, { useState, useEffect, useMemo } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import { PdfPreviewModal } from '../../../components/ui/pdf-preview-modal';
import { DocumentDetailDrawer } from '../../../components/ui/document-detail-drawer';

import HKIHeader from './components/HKIHeader';
import HKIStats from './components/HKIStats';
import HKIActionBar from './components/HKIActionBar';
import HKITable from './components/HKITable';
import HKIUploadModal from './components/HKIUploadModal';
import HKIEditModal from './components/HKIEditModal';
import HKILinkingModal from './components/HKILinkingModal';
import HKIDeleteModal from './components/HKIDeleteModal';
import HKIMetricsGuideModal from './components/HKIMetricsGuideModal';

import { HKI_CATEGORIES } from './constants';

export default function HKI({ user }: { user: any }) {
  const [selectedDocForDetail, setSelectedDocForDetail] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);

  const activeDetailDoc = useMemo(() => {
    if (!selectedDocForDetail) return null;
    return documents.find((d: any) => d.id === selectedDocForDetail.id) || selectedDocForDetail;
  }, [documents, selectedDocForDetail]);

  const [weights, setWeights] = useState<any[]>(() => {
    try {
      const cached = localStorage.getItem('penta_weights');
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      return [];
    }
  });

  const [isTableLoading, setIsTableLoading] = useState(true);
  const [isWeightsLoading, setIsWeightsLoading] = useState(() => {
    try {
      return !localStorage.getItem('penta_weights');
    } catch (e) {
      return true;
    }
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [isImporting, setIsImporting] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isMetricsModalOpen, setIsMetricsModalOpen] = useState(false);
  const [uploadingPdfId, setUploadingPdfId] = useState<number | null>(null);

  const [previewDoc, setPreviewDoc] = useState<{ fileUrl: string; title: string; category: string } | null>(null);

  // Edit states in main only to handle which document is open
  const [editDoc, setEditDoc] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Delete states in main only to handle which document is open
  const [deleteDoc, setDeleteDoc] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Linking research
  const [approvedResearch, setApprovedResearch] = useState<any[]>([]);
  const [isLinkingModalOpen, setIsLinkingModalOpen] = useState(false);
  const [docToLink, setDocToLink] = useState<any>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchWeights();
    fetchApprovedResearch();

    const loadDocuments = async () => {
      setIsTableLoading(true);
      await fetchDocuments();
      setIsTableLoading(false);
    };

    loadDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await fetch(`/api/users/${user.id}/documents`);
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWeights = async () => {
    if (!localStorage.getItem('penta_weights')) {
      setIsWeightsLoading(true);
    }
    try {
      const res = await fetch('/api/weights');
      const data = await res.json();
      if (data.weights) {
        setWeights(data.weights || []);
        localStorage.setItem('penta_weights', JSON.stringify(data.weights));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsWeightsLoading(false);
    }
  };

  const fetchApprovedResearch = async () => {
    try {
      const res = await fetch(`/api/users/${user.id}/approved-penelitian`);
      const data = await res.json();
      if (data.success) {
        setApprovedResearch(data.penelitian || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 4500);
  };

  const handleUploadPdf = async (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('pdf') && !file.type.includes('image')) {
      showMessage('Hanya file PDF atau gambar yang diperbolehkan.', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showMessage('Ukuran file maksimal 10MB.', 'error');
      return;
    }

    setUploadingPdfId(id);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`/api/documents/${id}/upload-pdf`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        showMessage('Dokumen HKI berhasil diunggah!', 'success');
        setIsTableLoading(true);
        await fetchDocuments();
        setIsTableLoading(false);
      } else {
        showMessage(data.message || 'Gagal mengunggah dokumen.', 'error');
      }
    } catch (err) {
      console.error(err);
      showMessage('Terjadi kesalahan saat mengunggah.', 'error');
    } finally {
      setUploadingPdfId(null);
      if (e.target) e.target.value = '';
    }
  };

  const openEditModal = (doc: any) => {
    setEditDoc(doc);
    setIsEditModalOpen(true);
  };

  const [filterYear, setFilterYear] = useState<number | null>(new Date().getFullYear());

  const filteredDocuments = useMemo(() => {
    const hkiDocs = documents.filter((d: any) =>
      (d.category || '').toLowerCase().includes('hki')
    );
    if (!filterYear) return hkiDocs;
    return hkiDocs.filter((d: any) => {
      const y = d.published_at ? new Date(d.published_at).getFullYear() : null;
      return y === filterYear;
    });
  }, [documents, filterYear]);

  const availableYears = useMemo(() => {
    return [new Date().getFullYear()];
  }, []);

  const stats = useMemo(() => {
    const src = filteredDocuments;
    return {
      total: src.length,
      approved: src.filter((d: any) => d.status === 'Approved').length,
      pending: src.filter((d: any) => d.status === 'Pending' || d.status === 'Verified by Fakultas').length,
      points: Math.round(src.reduce((acc: number, d: any) => acc + (Number(d.awarded_points) || 0), 0))
    };
  }, [filteredDocuments]);

  const handleDownloadTemplate = async () => {
    try {
      const res = await fetch('/api/cms/templates');
      if (res.ok) {
        const data = await res.json();
        const template = data.templates?.find((t: any) => t.type === 'hki');
        if (template && template.file_url) {
          window.open(template.file_url, '_blank');
          return;
        }
      }
    } catch (e) {
      console.error('Failed to fetch custom template, falling back to generated template', e);
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Template');
    const refSheet = workbook.addWorksheet('Referensi');
    refSheet.state = 'hidden';

    const validCategories = HKI_CATEGORIES.map(h => h.id);
    validCategories.forEach((cat, idx) => {
      refSheet.getCell(`A${idx + 1}`).value = cat;
    });

    sheet.columns = [
      { header: 'Judul HKI', key: 'judul', width: 40 },
      { header: 'Kategori HKI', key: 'kategori', width: 30 },
      { header: 'Tahun Perolehan', key: 'tahun', width: 15 },
      { header: 'Tipe Dokumen', key: 'tipe', width: 20 },
    ];

    sheet.addRow({
      judul: 'Sistem Deteksi Hama Tanaman berbasis AI',
      kategori: 'HKI Paten',
      tahun: new Date().getFullYear(),
      tipe: 'kpi'
    });

    for (let i = 2; i <= 1000; i++) {
      sheet.getCell(`B${i}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [`Referensi!$A$1:$A$${validCategories.length}`],
        showErrorMessage: true,
        errorTitle: 'Input Tidak Valid',
        error: 'Silakan pilih kategori HKI dari daftar dropdown.'
      };
      sheet.getCell(`D${i}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"kpi,arsip"'],
        showErrorMessage: true,
        errorTitle: 'Input Tidak Valid',
        error: 'Silakan pilih tipe dokumen (kpi / arsip).'
      };
    }

    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'Template_Import_HKI.xlsx');
  };

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    showMessage('Membaca file excel...', 'success');

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (data.length === 0) {
          showMessage('File excel kosong.', 'error');
          setIsImporting(false);
          return;
        }

        showMessage(`Mengimpor ${data.length} data HKI...`, 'success');
        let successCount = 0;
        let failCount = 0;
        let lastErrorMessage = '';

        for (let i = 0; i < data.length; i++) {
          const row: any = data[i];
          const formData = new FormData();
          formData.append('user_id', user.id);
          formData.append('title', row['Judul HKI'] || '');
          formData.append('category', row['Kategori HKI'] || 'HKI Paten');
          formData.append('published_at', `${row['Tahun Perolehan'] || new Date().getFullYear()}-01-01`);
          formData.append('doc_type', (row['Tipe Dokumen'] || 'kpi').toLowerCase());

          const res = await fetch('/api/documents', {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: formData,
          });

          if (res.ok) {
            successCount++;
          } else {
            failCount++;
            try {
              const errData = await res.json();
              if (errData.errors) {
                const firstErrorKey = Object.keys(errData.errors)[0];
                lastErrorMessage = errData.errors[firstErrorKey][0];
              } else if (errData.message) {
                lastErrorMessage = errData.message;
              }
            } catch (e) {}
          }
        }

        let finalMsg = `Import selesai. Berhasil: ${successCount}, Gagal: ${failCount}`;
        if (failCount > 0 && lastErrorMessage) {
          finalMsg += ` (Error: ${lastErrorMessage})`;
        }
        showMessage(finalMsg, failCount === 0 ? 'success' : 'error');

        setIsTableLoading(true);
        await fetchDocuments();
        setCurrentPage(1);
        setIsTableLoading(false);
      } catch (err) {
        console.error(err);
        showMessage('Terjadi kesalahan saat mengimpor excel.', 'error');
      } finally {
        setIsImporting(false);
        if (e.target) e.target.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDocuments = filteredDocuments.slice(indexOfFirstItem, indexOfLastItem);


  return (
    <div className="max-w-none space-y-6 lg:space-y-10 pb-12">
      {/* Header Banner */}
      <HKIHeader onOpenMetricsModal={() => setIsMetricsModalOpen(true)} />

      {/* Dashboard Summary Section */}
      <HKIStats stats={stats} isTableLoading={isTableLoading} />

      {/* Upload Action Bar Section */}
      <HKIActionBar 
        onUploadClick={() => setIsUploadModalOpen(true)}
        onDownloadTemplate={handleDownloadTemplate}
        onImportExcel={handleImportExcel}
        isImporting={isImporting}
      />

      {/* Floating Toast Notification */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border ${
                messageType === 'success' 
                  ? 'bg-emerald-50 dark:bg-emerald-950/90 backdrop-blur border-emerald-100 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-400' 
                  : 'bg-red-50 dark:bg-red-950/90 backdrop-blur border-red-100 dark:border-red-900/50 text-red-800 dark:text-red-400'
              }`}
            >
              {messageType === 'success' ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
              )}
              <span className="text-xs font-bold">{message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Upload HKI Modal Pop-up */}
      <HKIUploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        user={user}
        documents={documents}
        weights={weights}
        isWeightsLoading={isWeightsLoading}
        fetchDocuments={fetchDocuments}
        setIsTableLoading={setIsTableLoading}
        setCurrentPage={setCurrentPage}
        onShowMessage={showMessage}
      />

      {/* Document History Table */}
      <HKITable 
        isTableLoading={isTableLoading}
        currentDocuments={currentDocuments}
        filteredDocuments={filteredDocuments}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setSelectedDocForDetail={setSelectedDocForDetail}
        setPreviewDoc={setPreviewDoc}
        uploadingPdfId={uploadingPdfId}
        handleUploadPdf={handleUploadPdf}
        openEditModal={openEditModal}
        setDeleteDoc={setDeleteDoc}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        setDocToLink={setDocToLink}
        setIsLinkingModalOpen={setIsLinkingModalOpen}
        availableYears={availableYears}
        filterYear={filterYear}
        onYearChange={(y) => { setFilterYear(y); setCurrentPage(1); }}
      />

      {/* Linking Research Modal */}
      <HKILinkingModal 
        isOpen={isLinkingModalOpen}
        onClose={() => setIsLinkingModalOpen(false)}
        approvedResearch={approvedResearch}
        docToLink={docToLink}
        setDocToLink={setDocToLink}
        fetchDocuments={fetchDocuments}
        onShowMessage={showMessage}
      />

      {/* Detail Slide-over Drawer */}
      <DocumentDetailDrawer
        isOpen={!!activeDetailDoc}
        onClose={() => setSelectedDocForDetail(null)}
        drawerTitle="Detail HKI"
        drawerSubtitle="Informasi & Output Akademik"
        category={activeDetailDoc?.category ?? ''}
        title={activeDetailDoc?.title ?? ''}
        status={activeDetailDoc?.status ?? ''}
        catatan={activeDetailDoc?.catatan}
        year={activeDetailDoc?.published_at ? new Date(activeDetailDoc.published_at).getFullYear() : '-'}
        points={activeDetailDoc?.awarded_points || 0}
        isKpiCounted={activeDetailDoc?.is_kpi_counted}
        hideKpiClassification={false}
        customMetadata={
          (activeDetailDoc?.hki_type || activeDetailDoc?.inventor_name) && (
            <>
              {activeDetailDoc.hki_type && (
                <div>
                  <dt className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 mb-1">
                    Kategori Spesifik
                  </dt>
                  <dd className="text-xs font-bold text-gray-800 dark:text-zinc-200">
                    {activeDetailDoc.hki_type}
                  </dd>
                </div>
              )}
              {activeDetailDoc.inventor_name && (
                <div>
                  <dt className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 mb-1">
                    Nama Inventor
                  </dt>
                  <dd className="text-xs font-bold text-gray-800 dark:text-zinc-200">
                    {activeDetailDoc.inventor_name}
                  </dd>
                </div>
              )}
            </>
          )
        }
        showResearchLink={true}
        linkedResearch={activeDetailDoc?.penelitian}
        onChangeResearchClick={() => { setDocToLink(activeDetailDoc); setIsLinkingModalOpen(true); }}
        onLinkResearchClick={() => { setDocToLink(activeDetailDoc); setIsLinkingModalOpen(true); }}
        fileUrl={activeDetailDoc?.file_url}
        docId={activeDetailDoc?.id ?? 0}
        uploadingPdfId={uploadingPdfId}
        onPreviewClick={() => setPreviewDoc({ fileUrl: activeDetailDoc?.file_url, title: activeDetailDoc?.title, category: activeDetailDoc?.category })}
        onUploadPdf={handleUploadPdf}
      />

      {/* PDF Preview Modal */}
      <PdfPreviewModal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        fileUrl={previewDoc?.fileUrl ?? null}
        title={previewDoc?.title}
        category={previewDoc?.category}
      />

      {/* ===== EDIT MODAL ===== */}
      <HKIEditModal 
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditDoc(null);
        }}
        editDoc={editDoc}
        fetchDocuments={fetchDocuments}
        setIsTableLoading={setIsTableLoading}
        onShowMessage={showMessage}
      />

      {/* ===== DELETE MODAL ===== */}
      <HKIDeleteModal 
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteDoc(null);
        }}
        deleteDoc={deleteDoc}
        setDeleteDoc={setDeleteDoc}
        fetchDocuments={fetchDocuments}
        setIsTableLoading={setIsTableLoading}
        setCurrentPage={setCurrentPage}
        onShowMessage={showMessage}
      />

      {/* ===== METRICS GUIDE MODAL ===== */}
      <HKIMetricsGuideModal
        isOpen={isMetricsModalOpen}
        onClose={() => setIsMetricsModalOpen(false)}
      />
    </div>
  );
}
