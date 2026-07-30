import { useState, useEffect, useMemo, FormEvent, ChangeEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import { PdfPreviewModal } from '../../../components/ui/pdf-preview-modal';
import { DocumentDetailDrawer } from '../../../components/ui/document-detail-drawer';
import { formatToYYYYMMDD } from '../../../components/ui/DatePicker';
import { uploadWithProgress } from '../../../lib/utils';

import ResearchHeader from './components/ResearchHeader';
import ResearchStats from './components/ResearchStats';
import ResearchActionBar from './components/ResearchActionBar';
import ResearchTable from './components/ResearchTable';
import ResearchUploadModal from './components/ResearchUploadModal';
import ResearchEditModal from './components/ResearchEditModal';
import ResearchDeleteModal from './components/ResearchDeleteModal';
import ResearchMetricsGuideModal from './components/ResearchMetricsGuideModal';

interface ResearchProps {
  user: {
    id: string;
    role: string;
  };
}

export default function Research({ user }: ResearchProps) {
  const location = useLocation();
  const urlKategori = new URLSearchParams(location.search).get('kategori') || '';

  const [researchList, setResearchList] = useState<any[]>([]);
  const [selectedDocForDetail, setSelectedDocForDetail] = useState<any>(null);

  const activeDetailDoc = useMemo(() => {
    if (!selectedDocForDetail) return null;
    return researchList.find((r: any) => r.id === selectedDocForDetail.id) || selectedDocForDetail;
  }, [researchList, selectedDocForDetail]);

  const [judulPenelitian, setJudulPenelitian] = useState('');
  const [danaDisetujui, setDanaDisetujui] = useState('');

  const [program, setProgram] = useState(() => {
    if (urlKategori === 'Penelitian Hibah Luar Negeri') return 'hibah luar negeri';
    if (urlKategori === 'Penelitian Hibah Eksternal') return 'hibah dikti';
    return 'hibah internal';
  });

  useEffect(() => {
    if (urlKategori === 'Penelitian Hibah Luar Negeri') setProgram('hibah luar negeri');
    else if (urlKategori === 'Penelitian Hibah Eksternal') setProgram('hibah dikti');
    else if (urlKategori === 'Penelitian Internal Institusi') setProgram('hibah internal');
  }, [urlKategori]);

  const [skema, setSkema] = useState('');
  const [fokus, setFokus] = useState('');
  const [tahun, setTahun] = useState<Date | undefined>(new Date());
  const [file, setFile] = useState<File | null>(null);

  // Loading states
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  // Toast notifications
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const [isImporting, setIsImporting] = useState(false);
  const [uploadingPdfId, setUploadingPdfId] = useState<number | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isMetricsModalOpen, setIsMetricsModalOpen] = useState(false);

  // Preview Modal
  const [previewDoc, setPreviewDoc] = useState<{ fileUrl: string; title: string; category: string } | null>(null);

  // Edit states
  const [editDoc, setEditDoc] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editJudul, setEditJudul] = useState('');
  const [editDana, setEditDana] = useState('');
  const [editProgram, setEditProgram] = useState('hibah internal');
  const [editSkema, setEditSkema] = useState('');
  const [editFokus, setEditFokus] = useState('');
  const [editTahun, setEditTahun] = useState<Date | undefined>(undefined);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [isEditLoading, setIsEditLoading] = useState(false);

  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [editUploadProgress, setEditUploadProgress] = useState<number | null>(null);

  // Delete states
  const [deleteDoc, setDeleteDoc] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Year filter
  const [filterYear, setFilterYear] = useState<number | null>(null);

  const availableYears = useMemo(() => {
    const yearsSet = new Set<number>();
    (researchList || []).forEach((r: any) => {
      const raw = r.tahun;
      if (raw) {
        const str = String(raw);
        const y = str.length === 4 ? parseInt(str, 10) : new Date(str).getFullYear();
        if (!isNaN(y) && y > 1900 && y <= 2100) {
          yearsSet.add(y);
        }
      }
    });
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [researchList]);

  const filteredResearchList = useMemo(() => {
    if (!filterYear) return researchList;
    return researchList.filter((r: any) => {
      const raw = r.tahun;
      if (!raw) return false;
      const str = String(raw);
      const y = str.length === 4 ? parseInt(str, 10) : new Date(str).getFullYear();
      return y === filterYear;
    });
  }, [researchList, filterYear]);


  useEffect(() => {
    const loadResearch = async () => {
      setIsTableLoading(true);
      await fetchResearch();
      setIsTableLoading(false);
    };

    loadResearch();
  }, []);

  const fetchResearch = async () => {
    try {
      const res = await fetch(`/api/penelitian?user_id=${user.id}&role=${user.role}`);
      const data = await res.json();
      setResearchList(data.penelitian || []);
    } catch (err) {
      console.error(err);
      setResearchList([]);
    }
  };

  const stats = useMemo(() => {
    return {
      total: researchList.length,
      approved: researchList.filter((d: any) => d.status === 'Approved').length,
      pending: researchList.filter((d: any) => d.status === 'Pending' || d.status === 'Verified by Fakultas').length,
      points: Math.round(researchList.reduce((acc: number, d: any) => acc + (Number(d.awarded_points) || 0), 0)),
    };
  }, [researchList]);

  // programStats is kept for data mapping consistency in the dashboard
  const programStats = useMemo(() => {
    const map = new Map();
    researchList.forEach((res: any) => {
      const prog = res.program || 'N/A';
      map.set(prog, (map.get(prog) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [researchList]);

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!judulPenelitian || !danaDisetujui || !program || !skema || !fokus || !tahun || !file) {
      setMessage('Harap isi semua data termasuk file PDF.');
      setMessageType('error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage('Ukuran file maksimal 10MB.');
      setMessageType('error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('judul_penelitian', judulPenelitian);
    formData.append('dana_disetujui', danaDisetujui.replace(/\./g, ''));
    formData.append('user_id', user.id);
    formData.append('program', program);
    formData.append('skema', skema);
    formData.append('fokus', fokus);
    formData.append('tahun', tahun ? formatToYYYYMMDD(tahun) : '');

    try {
      setLoading(true);
      setUploadProgress(0);
      const res = await uploadWithProgress('/api/penelitian', 'POST', formData, setUploadProgress);
      
      if (res.ok) {
        await new Promise(r => setTimeout(r, 400));
        setMessage(res.data?.message || 'Penelitian berhasil diunggah!');
        setMessageType('success');
        setJudulPenelitian('');
        setDanaDisetujui('');
        setSkema('');
        setFokus('');
        setFile(null);
        setTahun(new Date());
        setIsUploadModalOpen(false);

        setIsTableLoading(true);
        await fetchResearch();
        setCurrentPage(1);
        setIsTableLoading(false);
      } else {
        let errorMsg = res.data?.message || 'Gagal mengunggah penelitian.';
        if (res.data?.errors && res.data.errors.judul_penelitian) {
          errorMsg = res.data.errors.judul_penelitian[0];
        }
        setMessage(errorMsg);
        setMessageType('error');
      }
      setTimeout(() => setMessage(''), 4500);
    } catch (err) {
      setMessage('Terjadi kesalahan saat mengunggah.');
      setMessageType('error');
      setTimeout(() => setMessage(''), 4500);
    } finally {
      setLoading(false);
      setUploadProgress(null);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const res = await fetch('/api/cms/templates');
      if (res.ok) {
        const data = await res.json();
        const template = data.templates?.find((t: any) => t.type === 'research');
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
      { header: 'Judul Penelitian', key: 'judul', width: 35 },
      { header: 'Dana Disetujui', key: 'dana', width: 20 },
      { header: 'Program', key: 'program', width: 25 },
      { header: 'Skema', key: 'skema', width: 20 },
      { header: 'Fokus', key: 'fokus', width: 20 },
      { header: 'Tahun', key: 'tahun', width: 15 },
    ];

    sheet.addRow({
      judul: 'Analisis Sistem AI',
      dana: 10000000,
      program: 'hibah internal',
      skema: 'kompetisi',
      fokus: 'kesehatan',
      tahun: 2024,
    });

    for (let i = 2; i <= 1000; i++) {
      sheet.getCell(`C${i}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"hibah internal,hibah dikti,hibah luar negeri"'],
        showErrorMessage: true,
        errorTitle: 'Input Tidak Valid',
        error: 'Silakan pilih program dari daftar dropdown.',
      };

      sheet.getCell(`D${i}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"kompetisi,pembinaan"'],
        showErrorMessage: true,
        errorTitle: 'Input Tidak Valid',
        error: 'Silakan pilih skema dari daftar dropdown.',
      };

      sheet.getCell(`E${i}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"kesehatan,ekonomi"'],
        showErrorMessage: true,
        errorTitle: 'Input Tidak Valid',
        error: 'Silakan pilih fokus dari daftar dropdown.',
      };
    }

    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'Template_Import_Penelitian.xlsx');
  };

  const handleImportExcel = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setMessage('Membaca file excel...');
    setMessageType('success');

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (data.length === 0) {
          setMessage('File excel kosong.');
          setMessageType('error');
          setIsImporting(false);
          return;
        }

        setMessage(`Mengimpor ${data.length} data...`);
        let successCount = 0;
        let failCount = 0;
        let lastErrorMessage = '';

        for (let i = 0; i < data.length; i++) {
          const row: any = data[i];
          const formData = new FormData();
          formData.append('user_id', user.id);
          formData.append('judul_penelitian', row['Judul Penelitian'] || '');
          formData.append('dana_disetujui', (row['Dana Disetujui'] || '').toString().replace(/\./g, ''));
          formData.append('program', (row['Program'] || '').toLowerCase());
          formData.append('skema', (row['Skema'] || '').toLowerCase());
          formData.append('fokus', (row['Fokus'] || '').toLowerCase());
          formData.append('tahun', (row['Tahun'] || '').toString());

          const res = await fetch('/api/penelitian', {
            method: 'POST',
            headers: { Accept: 'application/json' },
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
        setMessage(finalMsg);
        setMessageType(failCount === 0 ? 'success' : 'error');
        setIsUploadModalOpen(false);

        setIsTableLoading(true);
        await fetchResearch();
        setCurrentPage(1);
        setIsTableLoading(false);
        setTimeout(() => setMessage(''), 4500);
      } catch (err) {
        console.error(err);
        setMessage('Terjadi kesalahan saat mengimpor excel.');
        setMessageType('error');
        setTimeout(() => setMessage(''), 4500);
      } finally {
        setIsImporting(false);
        if (e.target) e.target.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  const openEditModal = (res: any) => {
    setEditDoc(res);
    setEditJudul(res.judul_penelitian || '');
    setEditDana(res.dana_disetujui ? Number(res.dana_disetujui).toLocaleString('id-ID') : '');
    setEditProgram(res.program || 'hibah internal');
    setEditSkema(res.skema || '');
    setEditFokus(res.fokus || '');
    setEditTahun(res.tahun ? new Date(res.tahun) : new Date());
    setEditFile(null);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!editDoc) return;
    if (!editJudul || !editDana || !editProgram || !editSkema || !editFokus || !editTahun) {
      setMessage('Harap lengkapi semua field.');
      setMessageType('error');
      return;
    }
    try {
      setIsEditLoading(true);
      setEditUploadProgress(0);
      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append('judul_penelitian', editJudul);
      formData.append('dana_disetujui', editDana.replace(/\./g, ''));
      formData.append('program', editProgram);
      formData.append('skema', editSkema);
      formData.append('fokus', editFokus);
      formData.append('tahun', editTahun ? formatToYYYYMMDD(editTahun) : '');
      if (editFile) {
        formData.append('file', editFile);
      }

      const res = await uploadWithProgress(`/api/penelitian/${editDoc.id}`, 'POST', formData, setEditUploadProgress);
      if (res.ok) {
        await new Promise(r => setTimeout(r, 400));
        setMessage(res.data?.message || 'Penelitian berhasil diperbarui!');
        setMessageType('success');
        setEditFile(null);
        setIsEditModalOpen(false);
        setIsTableLoading(true);
        await fetchResearch();
        setIsTableLoading(false);
      } else {
        setMessage(res.data?.message || 'Gagal memperbarui penelitian.');
        setMessageType('error');
      }
      setTimeout(() => setMessage(''), 4500);
    } catch (err) {
      setMessage('Terjadi kesalahan saat memperbarui.');
      setMessageType('error');
      setTimeout(() => setMessage(''), 4500);
    } finally {
      setIsEditLoading(false);
      setEditUploadProgress(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteDoc) return;
    try {
      setIsDeleteLoading(true);
      const res = await fetch(`/api/penelitian/${deleteDoc.id}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Penelitian berhasil dihapus!');
        setMessageType('success');
        setIsDeleteModalOpen(false);
        setDeleteDoc(null);
        setIsTableLoading(true);
        await fetchResearch();
        setCurrentPage(1);
        setIsTableLoading(false);
      } else {
        setMessage(data.message || 'Gagal menghapus penelitian.');
        setMessageType('error');
      }
      setTimeout(() => setMessage(''), 4500);
    } catch (err) {
      setMessage('Terjadi kesalahan.');
      setMessageType('error');
      setTimeout(() => setMessage(''), 4500);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleUploadPdfForResearch = async (e: ChangeEvent<HTMLInputElement>, id: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setMessage('Hanya file PDF yang diperbolehkan.');
      setMessageType('error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage('Ukuran file maksimal 10MB.');
      setMessageType('error');
      return;
    }

    setUploadingPdfId(id);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`/api/penelitian/${id}/upload-pdf`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('PDF berhasil diunggah!');
        setMessageType('success');

        setIsTableLoading(true);
        await fetchResearch();
        setIsTableLoading(false);
      } else {
        setMessage(data.message || 'Gagal mengunggah PDF.');
        setMessageType('error');
      }
      setTimeout(() => setMessage(''), 4500);
    } catch (err) {
      console.error(err);
      setMessage('Terjadi kesalahan saat mengunggah PDF.');
      setMessageType('error');
      setTimeout(() => setMessage(''), 4500);
    } finally {
      setUploadingPdfId(null);
      if (e.target) e.target.value = '';
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredResearchList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredResearchList.length / itemsPerPage);


  const displayErrorMessage = (msg: string) => {
    setMessage(msg);
    setMessageType('error');
    setTimeout(() => setMessage(''), 4500);
  };

  return (
    <div className="max-w-none space-y-6 lg:space-y-10 pb-12">
      {/* Header Banner */}
      <ResearchHeader onOpenMetricsModal={() => setIsMetricsModalOpen(true)} />

      {/* Dashboard Stats Cards */}
      <ResearchStats stats={stats} isTableLoading={isTableLoading} />

      {/* Action Bar */}
      <ResearchActionBar
        onUploadClick={() => setIsUploadModalOpen(true)}
        onDownloadTemplate={handleDownloadTemplate}
        onImportExcel={handleImportExcel}
        isImporting={isImporting}
      />

      {/* Research Table List */}
      <ResearchTable
        researchList={filteredResearchList}
        currentItems={currentItems}
        isTableLoading={isTableLoading}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalPages={totalPages}
        indexOfFirstItem={indexOfFirstItem}
        indexOfLastItem={indexOfLastItem}
        setCurrentPage={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
        onViewDetail={setSelectedDocForDetail}
        onPreviewPdf={setPreviewDoc}
        onUploadPdf={handleUploadPdfForResearch}
        uploadingPdfId={uploadingPdfId}
        onEditClick={openEditModal}
        onDeleteClick={(doc) => {
          setDeleteDoc(doc);
          setIsDeleteModalOpen(true);
        }}
        availableYears={availableYears}
        filterYear={filterYear}
        onYearChange={(y) => { setFilterYear(y); setCurrentPage(1); }}
      />

      {/* Slide-over Detail Drawer */}
      <DocumentDetailDrawer
        isOpen={!!activeDetailDoc}
        onClose={() => setSelectedDocForDetail(null)}
        drawerTitle="Detail Penelitian"
        drawerSubtitle="Informasi & Output Akademik"
        category={activeDetailDoc?.program ?? ''}
        title={activeDetailDoc?.judul_penelitian ?? ''}
        status={activeDetailDoc?.status ?? ''}
        catatan={activeDetailDoc?.catatan}
        year={activeDetailDoc?.tahun || '-'}
        points={activeDetailDoc?.awarded_points || 0}
        isKpiCounted={true}
        hideKpiClassification={true}
        customMetadata={
          activeDetailDoc ? (
            <div>
              <p className="text-[9px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest leading-none mb-1.5">
                Dana Disetujui
              </p>
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-gray-800 dark:text-zinc-200">
                Rp {activeDetailDoc.dana_disetujui?.toLocaleString() || '-'}
              </div>
            </div>
          ) : undefined
        }
        showResearchLink={false}
        fileUrl={activeDetailDoc?.file_url}
        docId={activeDetailDoc?.id ?? 0}
        uploadingPdfId={uploadingPdfId}
        onPreviewClick={() =>
          setPreviewDoc({
            fileUrl: activeDetailDoc?.file_url,
            title: activeDetailDoc?.judul_penelitian,
            category: activeDetailDoc?.program,
          })
        }
        onUploadPdf={handleUploadPdfForResearch}
      />

      {/* Upload Modal */}
      <ResearchUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        program={program}
        setProgram={setProgram}
        judulPenelitian={judulPenelitian}
        setJudulPenelitian={setJudulPenelitian}
        skema={skema}
        setSkema={setSkema}
        fokus={fokus}
        setFokus={setFokus}
        danaDisetujui={danaDisetujui}
        setDanaDisetujui={setDanaDisetujui}
        tahun={tahun}
        setTahun={setTahun}
        file={file}
        setFile={setFile}
        loading={loading}
        onSubmit={handleUpload}
        onErrorMsg={displayErrorMessage}
        uploadProgress={uploadProgress}
      />

      {/* Edit Modal */}
      <ResearchEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        editDoc={editDoc}
        editJudul={editJudul}
        setEditJudul={setEditJudul}
        editDana={editDana}
        setEditDana={setEditDana}
        editProgram={editProgram}
        setEditProgram={setEditProgram}
        editSkema={editSkema}
        setEditSkema={setEditSkema}
        editFokus={editFokus}
        setEditFokus={setEditFokus}
        editTahun={editTahun}
        setEditTahun={setEditTahun}
        editFile={editFile}
        setEditFile={setEditFile}
        isEditLoading={isEditLoading}
        onSubmit={handleUpdate}
        uploadProgress={editUploadProgress}
      />

      {/* Delete Confirmation Modal */}
      <ResearchDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        deleteDoc={deleteDoc}
        onDelete={handleDelete}
        isDeleteLoading={isDeleteLoading}
      />

      {/* PDF Preview Modal */}
      <PdfPreviewModal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        fileUrl={previewDoc?.fileUrl ?? null}
        title={previewDoc?.title}
        category={previewDoc?.category}
      />

      {/* Toast notifications */}
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

      {/* ===== METRICS GUIDE MODAL ===== */}
      <ResearchMetricsGuideModal
        isOpen={isMetricsModalOpen}
        onClose={() => setIsMetricsModalOpen(false)}
      />
    </div>
  );
}
