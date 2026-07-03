import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import { PdfPreviewModal } from '../../../components/ui/pdf-preview-modal';
import { DocumentDetailDrawer } from '../../../components/ui/document-detail-drawer';

import BukuHeader from './components/BukuHeader';
import BukuStats from './components/BukuStats';
import BukuActionBar from './components/BukuActionBar';
import BukuTable from './components/BukuTable';
import BukuUploadModal from './components/BukuUploadModal';
import BukuEditModal from './components/BukuEditModal';
import BukuLinkingModal from './components/BukuLinkingModal';
import BukuDeleteModal from './components/BukuDeleteModal';

import { BUKU_CATEGORIES } from './constants';

export default function Buku({ user }: { user: any }) {
  const location = useLocation();
  const urlKategori = useMemo(() => {
    return new URLSearchParams(location.search).get('kategori') || '';
  }, [location.search]);

  const [selectedDocForDetail, setSelectedDocForDetail] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);

  const activeDetailDoc = useMemo(() => {
    if (!selectedDocForDetail) return null;
    return documents.find((d: any) => d.id === selectedDocForDetail.id) || selectedDocForDetail;
  }, [documents, selectedDocForDetail]);

  const [isTableLoading, setIsTableLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterKategori, setFilterKategori] = useState('');

  useEffect(() => {
    if (urlKategori) {
      setFilterKategori(urlKategori);
    }
  }, [urlKategori]);
  const [isImporting, setIsImporting] = useState(false);
  const [uploadingPdfId, setUploadingPdfId] = useState<number | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [previewDoc, setPreviewDoc] = useState<{ fileUrl: string; title: string; category: string } | null>(null);

  const [approvedResearch, setApprovedResearch] = useState<any[]>([]);
  const [isLinkingModalOpen, setIsLinkingModalOpen] = useState(false);
  const [docToLink, setDocToLink] = useState<any>(null);

  const [editDoc, setEditDoc] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [deleteDoc, setDeleteDoc] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const currentYear = new Date().getFullYear();

  // Year filter
  const [filterYear, setFilterYear] = useState<number | null>(new Date().getFullYear());

  useEffect(() => {
    const load = async () => {
      setIsTableLoading(true);
      await fetchDocuments();
      await fetchApprovedResearch();
      setIsTableLoading(false);
    };
    load();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await fetch(`/api/users/${user.id}/documents`);
      const data = await res.json();
      const bukuDocs = (data.documents || []).filter((d: any) =>
        BUKU_CATEGORIES.some(bc => bc.value.toLowerCase() === (d.category || '').toLowerCase())
      );
      setDocuments(bukuDocs);
    } catch (err) {
      console.error(err);
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
        showMessage('Dokumen berhasil diunggah!', 'success');
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

  const filteredDocuments = useMemo(() => {
    let result = documents;
    if (filterKategori) {
      result = result.filter(d => d.category === filterKategori);
    }
    if (filterYear) {
      result = result.filter((d: any) => {
        const y = d.published_at ? new Date(d.published_at).getFullYear() : null;
        return y === filterYear;
      });
    }
    return result;
  }, [documents, filterKategori, filterYear]);

  const availableYears = useMemo(() => {
    return [new Date().getFullYear()];
  }, []);

  const stats = useMemo(() => {
    const cutoffYear = currentYear - 2;
    const valid = filteredDocuments.filter(d => {
      const y = d.published_at ? new Date(d.published_at).getFullYear() : 0;
      return d.status === 'Approved' && y >= cutoffYear;
    });
    return {
      total: filteredDocuments.length,
      approved: filteredDocuments.filter(d => d.status === 'Approved').length,
      pending: filteredDocuments.filter(d => d.status === 'Pending' || d.status === 'Verified by Fakultas').length,
      points: Math.round(valid.reduce((acc, d) => acc + (Number(d.awarded_points) || 0), 0)),
      validCount: valid.length,
    };
  }, [filteredDocuments, currentYear]);

  const handleDownloadTemplate = async () => {
    try {
      const res = await fetch('/api/cms/templates');
      if (res.ok) {
        const data = await res.json();
        const template = data.templates?.find((t: any) => t.type === 'buku');
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

    sheet.columns = [
      { header: 'Judul Buku', key: 'judul', width: 40 },
      { header: 'Kategori', key: 'kategori', width: 25 },
      { header: 'Tahun Terbit', key: 'tahun', width: 15 },
      { header: 'Tipe Dokumen', key: 'tipe', width: 20 },
    ];

    sheet.addRow({
      judul: 'Dasar-Dasar Kecerdasan Buatan',
      kategori: 'Buku Referensi',
      tahun: new Date().getFullYear(),
      tipe: 'kpi'
    });

    for (let i = 2; i <= 1000; i++) {
      sheet.getCell(`B${i}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"Buku Referensi,Buku Ajar,Buku Monograf"'],
        showErrorMessage: true,
        errorTitle: 'Input Tidak Valid',
        error: 'Silakan pilih kategori dari daftar dropdown.'
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
    saveAs(new Blob([buffer]), 'Template_Import_Buku.xlsx');
  };

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    showMessage('Membaca file Excel...', 'success');
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

        showMessage(`Mengimpor ${data.length} data...`, 'success');
        let successCount = 0;
        let failCount = 0;
        let lastErrorMessage = '';

        for (let i = 0; i < data.length; i++) {
          const row: any = data[i];
          const formData = new FormData();
          formData.append('user_id', user.id);
          formData.append('title', row['Judul Buku'] || '');
          formData.append('category', row['Kategori'] || 'Buku Referensi');
          formData.append('published_at', `${row['Tahun Terbit'] || new Date().getFullYear()}-01-01`);
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
        showMessage('Terjadi kesalahan saat membaca file Excel.', 'error');
      } finally {
        setIsImporting(false);
        if (e.target) e.target.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  const paginatedDocs = useMemo(() => {
    return filteredDocuments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredDocuments, currentPage, itemsPerPage]);

  return (
    <div className="max-w-none space-y-6 lg:space-y-10 pb-12">
      {/* Header Banner */}
      <BukuHeader />

      {/* Dashboard Summary Section */}
      <BukuStats stats={stats} isTableLoading={isTableLoading} />

      {/* Upload Action Bar Section */}
      <BukuActionBar 
        onUploadClick={() => setIsUploadModalOpen(true)}
        onDownloadTemplate={handleDownloadTemplate}
        onImportExcel={handleImportExcel}
        isImporting={isImporting}
      />

      {/* Document History Table */}
      <BukuTable 
        isTableLoading={isTableLoading}
        filterKategori={filterKategori}
        setFilterKategori={(k) => { setFilterKategori(k); setCurrentPage(1); }}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        filteredDocuments={filteredDocuments}
        paginatedDocs={paginatedDocs}
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

      {/* Upload Buku Modal Pop-up */}
      <BukuUploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        user={user}
        documents={documents}
        fetchDocuments={fetchDocuments}
        setIsTableLoading={setIsTableLoading}
        setCurrentPage={setCurrentPage}
        onShowMessage={showMessage}
      />

      {/* Linking Modal */}
      <BukuLinkingModal 
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
        drawerTitle="Detail Buku"
        drawerSubtitle="Informasi & Output Akademik"
        category={activeDetailDoc?.category ?? ''}
        title={activeDetailDoc?.title ?? ''}
        status={activeDetailDoc?.status ?? ''}
        catatan={activeDetailDoc?.catatan}
        year={activeDetailDoc?.published_at ? new Date(activeDetailDoc.published_at).getFullYear() : '-'}
        points={activeDetailDoc?.awarded_points || 0}
        isKpiCounted={activeDetailDoc?.is_kpi_counted}
        hideKpiClassification={false}
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
      <BukuEditModal 
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
      <BukuDeleteModal 
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
    </div>
  );
}
