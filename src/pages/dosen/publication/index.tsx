import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import { PdfPreviewModal } from '../../../components/ui/pdf-preview-modal';
import { DocumentDetailDrawer } from '../../../components/ui/document-detail-drawer';

import PublicationHeader from './components/PublicationHeader';
import PublicationStats from './components/PublicationStats';
import PublicationActionBar from './components/PublicationActionBar';
import PublicationTable from './components/PublicationTable';
import PublicationUploadModal from './components/PublicationUploadModal';
import PublicationLinkingModal from './components/PublicationLinkingModal';
import PublicationEditModal from './components/PublicationEditModal';
import PublicationDeleteModal from './components/PublicationDeleteModal';

export default function Publication({ user }: { user: any }) {
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

  const [weights, setWeights] = useState<any[]>(() => {
    try {
      const cached = localStorage.getItem('penta_weights');
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      return [];
    }
  });

  const [category, setCategory] = useState('');
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
  const [uploadingPdfId, setUploadingPdfId] = useState<number | null>(null);

  const [previewDoc, setPreviewDoc] = useState<{ fileUrl: string; title: string; category: string } | null>(null);

  const [approvedResearch, setApprovedResearch] = useState<any[]>([]);
  const [isLinkingModalOpen, setIsLinkingModalOpen] = useState(false);
  const [docToLink, setDocToLink] = useState<any>(null);

  const [editDoc, setEditDoc] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [deleteDoc, setDeleteDoc] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Year filter
  const [filterYear, setFilterYear] = useState<number | null>(null);


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

  useEffect(() => {
    if (urlKategori) {
      setCategory(urlKategori);
      setFilterYear(null); // reset year filter when category changes
      setCurrentPage(1);
    }
  }, [urlKategori]);


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
      if (urlKategori) {
        setCategory(urlKategori);
      } else if (data.weights && data.weights.length > 0) {
        setCategory(data.weights[0].category);
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

  const filteredDocuments = useMemo(() => {
    let result = documents;
    if (urlKategori) {
      result = result.filter((d: any) =>
        (d.category || '').toLowerCase() === urlKategori.toLowerCase()
      );
    }
    if (filterYear) {
      result = result.filter((d: any) => {
        const y = d.published_at ? new Date(d.published_at).getFullYear() : null;
        return y === filterYear;
      });
    }
    return result;
  }, [documents, urlKategori, filterYear]);

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    years.add(new Date().getFullYear());
    documents.forEach((d: any) => {
      if (d.published_at) {
        const y = new Date(d.published_at).getFullYear();
        if (!isNaN(y)) {
          years.add(y);
        }
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [documents]);

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
        const template = data.templates?.find((t: any) => t.type === 'publication');
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

    const validCategories = weights.map((w: any) => w.category);
    validCategories.forEach((cat, idx) => {
      refSheet.getCell(`A${idx + 1}`).value = cat;
    });

    sheet.columns = [
      { header: 'Judul Publikasi', key: 'judul', width: 40 },
      { header: 'Kategori', key: 'kategori', width: 30 },
      { header: 'Tahun Terbit', key: 'tahun', width: 15 },
      { header: 'Tipe Dokumen', key: 'tipe', width: 20 },
    ];

    sheet.addRow({
      judul: 'Implementasi AI dalam Pendidikan',
      kategori: validCategories[0] || 'Jurnal Internasional',
      tahun: new Date().getFullYear(),
      tipe: 'kpi'
    });

    for (let i = 2; i <= 1000; i++) {
      if (validCategories.length > 0) {
        sheet.getCell(`B${i}`).dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: [`Referensi!$A$1:$A$${validCategories.length}`],
          showErrorMessage: true,
          errorTitle: 'Input Tidak Valid',
          error: 'Silakan pilih kategori dari daftar dropdown.'
        };
      }
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
    saveAs(new Blob([buffer]), 'Template_Import_Publikasi.xlsx');
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

        showMessage(`Mengimpor ${data.length} data...`, 'success');
        let successCount = 0;
        let failCount = 0;
        let lastErrorMessage = '';

        for (let i = 0; i < data.length; i++) {
          const row: any = data[i];
          const formData = new FormData();
          formData.append('user_id', user.id);
          formData.append('title', row['Judul Publikasi'] || '');
          formData.append('category', row['Kategori'] || '');
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
        setIsUploadModalOpen(false);

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
  const currentDocuments = useMemo(() => {
    return filteredDocuments.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredDocuments, indexOfFirstItem, indexOfLastItem]);

  return (
    <div className="max-w-none space-y-6 lg:space-y-10 pb-12">
      {/* Filter Banner */}
      <PublicationHeader urlKategori={urlKategori} />

      {/* Dashboard Summary Section */}
      <PublicationStats stats={stats} isTableLoading={isTableLoading} />

      {/* Upload Action Bar Section */}
      <PublicationActionBar 
        onUploadClick={() => setIsUploadModalOpen(true)}
        onDownloadTemplate={handleDownloadTemplate}
        onImportExcel={handleImportExcel}
        isImporting={isImporting}
      />

      {/* Document History Table */}
      <PublicationTable 
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
        openEditModal={(doc) => { setEditDoc(doc); setIsEditModalOpen(true); }}
        setDeleteDoc={setDeleteDoc}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
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

      {/* Upload Publikasi Modal Pop-up */}
      <PublicationUploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        user={user}
        documents={documents}
        category={category}
        weights={weights}
        isWeightsLoading={isWeightsLoading}
        fetchDocuments={fetchDocuments}
        setIsTableLoading={setIsTableLoading}
        setCurrentPage={setCurrentPage}
        onShowMessage={showMessage}
      />

      {/* Linking Modal */}
      <PublicationLinkingModal 
        isOpen={isLinkingModalOpen}
        onClose={() => setIsLinkingModalOpen(false)}
        approvedResearch={approvedResearch}
        docToLink={docToLink}
        setDocToLink={setDocToLink}
        fetchDocuments={fetchDocuments}
        onShowMessage={showMessage}
      />

      {/* Edit Modal */}
      <PublicationEditModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        editDoc={editDoc}
        weights={weights}
        fetchDocuments={fetchDocuments}
        setIsTableLoading={setIsTableLoading}
        onShowMessage={showMessage}
      />

      {/* Delete Modal */}
      <PublicationDeleteModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        deleteDoc={deleteDoc}
        setDeleteDoc={setDeleteDoc}
        fetchDocuments={fetchDocuments}
        setIsTableLoading={setIsTableLoading}
        setCurrentPage={setCurrentPage}
        onShowMessage={showMessage}
      />

      {/* Detail Slide-over Drawer */}
      <DocumentDetailDrawer
        isOpen={!!activeDetailDoc}
        onClose={() => setSelectedDocForDetail(null)}
        drawerTitle="Detail Publikasi"
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
        customMetadata={
          (activeDetailDoc?.quartile || activeDetailDoc?.author_role || activeDetailDoc?.is_corresponding !== undefined) && (
            <div className="col-span-2 pt-2 border-t border-gray-100 dark:border-zinc-800 space-y-2">
              <p className="text-[9px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest leading-none mb-1">Detail Scopus (Metrik SINTA)</p>
              <div className="flex flex-wrap gap-2">
                {activeDetailDoc.quartile && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-md border border-orange-100 dark:border-orange-900/30">
                    Quartile: {activeDetailDoc.quartile}
                  </span>
                )}
                {activeDetailDoc.author_role && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-900/30">
                    Peran: {activeDetailDoc.author_role}
                  </span>
                )}
                {activeDetailDoc.is_hyperauthor ? (
                  <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-md border border-red-100 dark:border-red-900/30">
                    Hyperauthor
                  </span>
                ) : null}
                {activeDetailDoc.is_corresponding !== undefined && (
                  <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${
                    activeDetailDoc.is_corresponding
                      ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30'
                      : 'text-gray-500 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-800 border-gray-100 dark:border-zinc-700'
                  }`}>
                    Korespondensi: {activeDetailDoc.is_corresponding ? 'Ya' : 'Tidak'}
                  </span>
                )}
              </div>
            </div>
          )
        }
      />

      {/* PDF Preview Modal */}
      <PdfPreviewModal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        fileUrl={previewDoc?.fileUrl ?? null}
        title={previewDoc?.title}
        category={previewDoc?.category}
      />
    </div>
  );
}
