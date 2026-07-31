import React, { useState, useMemo } from 'react';
import { 
  Upload, Sparkles, Archive, AlertCircle, Shield, 
  CalendarDays, ChevronDown, CheckCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BaseFormModal } from '../../../../components/ui/BaseFormModal';
import { DatePicker, formatToYYYYMMDD } from '../../../../components/ui/DatePicker';
import { uploadWithProgress } from '../../../../lib/utils';
import { FileText, XCircle } from 'lucide-react';

interface PublicationUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  documents: any[];
  category: string;
  weights: any[];
  isWeightsLoading: boolean;
  fetchDocuments: () => Promise<void>;
  setIsTableLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  onShowMessage: (msg: string, type: 'success' | 'error') => void;
}

export default function PublicationUploadModal({
  isOpen,
  onClose,
  user,
  documents,
  category,
  weights,
  isWeightsLoading,
  fetchDocuments,
  setIsTableLoading,
  setCurrentPage,
  onShowMessage
}: PublicationUploadModalProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [docType, setDocType] = useState<'kpi' | 'arsip'>('kpi');
  const [file, setFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const duplicateFound = useMemo(() => {
    if (!title || title.length < 5) return null;
    return documents.find((doc: any) => 
      doc.title.toLowerCase().trim() === title.toLowerCase().trim() && 
      doc.is_kpi_counted
    );
  }, [title, documents]);

  const scoringPreview = useMemo(() => {
    if (docType === 'arsip') {
      return {
        type: 'arsip' as const,
        message: 'Kategori Arsip: Dokumen disimpan sebagai arsip (0 Poin)',
        points: 0,
      };
    }

    if (!date) return null;

    const selectedWeight = weights.find((w: any) => w.category === category);
    const pts = selectedWeight ? (selectedWeight as any).weight_value : 0;

    return {
      type: 'kpi' as const,
      message: `Masuk Penghitungan KPI: +${pts} Poin`,
      points: pts,
    };
  }, [date, docType, category, weights]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
      } else {
        onShowMessage('Hanya file PDF yang diperbolehkan.', 'error');
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !category || !date) {
      onShowMessage('Harap lengkapi semua field.', 'error');
      return;
    }

    if (duplicateFound) {
      onShowMessage('Dokumen ini sudah terdata dalam sistem.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('category', category);
    formData.append('user_id', user.id);
    formData.append('published_at', date ? formatToYYYYMMDD(date) : '');
    formData.append('doc_type', docType);

    try {
      setLoading(true);
      setUploadProgress(0);
      const res = await uploadWithProgress('/api/documents', 'POST', formData, setUploadProgress);
      
      if (res.ok) {
        await new Promise(r => setTimeout(r, 400));
        onShowMessage(res.data?.message || 'Dokumen berhasil diunggah!', 'success');
        setTitle('');
        setFile(null);
        setDate(new Date());
        onClose(); // Tutup modal saat sukses
        
        setIsTableLoading(true);
        await fetchDocuments();
        setCurrentPage(1); // Reset ke halaman 1
        setIsTableLoading(false);
      } else {
        onShowMessage('Gagal mengunggah dokumen.', 'error');
      }
    } catch (err) {
      onShowMessage('Terjadi kesalahan saat mengunggah.', 'error');
    } finally {
      setLoading(false);
      setUploadProgress(null);
    }
  };

  return (
    <BaseFormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Unggah Publikasi Baru"
      subtitle="Daftarkan Jurnal Ilmiah, Prosiding, atau Book Chapter"
      icon={Upload}
      iconColorClass="text-primary-500"
      maxWidthClass="max-w-4xl"
    >
      <form onSubmit={handleUpload} className="space-y-6">
        {duplicateFound && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-black text-amber-900 dark:text-amber-200 uppercase tracking-tight">Dokumen Sudah Terdata</p>
              <p className="text-[10px] font-bold text-amber-700/80 dark:text-amber-400/80 leading-relaxed">
                Dokumen dengan judul ini sudah terhitung dalam poin KPI.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setDocType('kpi')}
            className={`group relative flex items-center p-4 rounded-xl border-2 transition-all duration-300 ${
              docType === 'kpi'
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/10 ring-4 ring-emerald-500/10'
                : 'border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-gray-200 dark:hover:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:shadow-sm'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-colors ${
              docType === 'kpi' ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-gray-100 dark:bg-zinc-800 group-hover:bg-emerald-50'
            }`}>
              <Sparkles className={`w-5 h-5 ${docType === 'kpi' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 group-hover:text-emerald-500'}`} />
            </div>
            <div className="text-left min-w-0">
              <p className={`text-[11px] font-black uppercase tracking-tight ${docType === 'kpi' ? 'text-emerald-900 dark:text-emerald-200' : 'text-gray-500 group-hover:text-gray-900'}`}>
                KPI Dosen
              </p>
              <p className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Automated Scoring</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setDocType('arsip')}
            className={`group relative flex items-center p-4 rounded-xl border-2 transition-all duration-300 ${
              docType === 'arsip'
                ? 'border-gray-500 bg-gray-50 dark:bg-zinc-800 ring-4 ring-gray-500/10'
                : 'border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-gray-200 dark:hover:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:shadow-sm'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-colors ${
              docType === 'arsip' ? 'bg-gray-200 dark:bg-zinc-700' : 'bg-gray-100 dark:bg-zinc-800 group-hover:bg-gray-200/60'
            }`}>
              <Archive className={`w-5 h-5 ${docType === 'arsip' ? 'text-gray-600 dark:text-zinc-300' : 'text-gray-400 group-hover:text-gray-500'}`} />
            </div>
            <div className="text-left min-w-0">
              <p className={`text-[11px] font-black uppercase tracking-tight ${docType === 'arsip' ? 'text-gray-900 dark:text-zinc-100' : 'text-gray-500 group-hover:text-gray-900'}`}>
                Arsip Umum
              </p>
              <p className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Storage Only (0 Pts)</p>
            </div>
          </button>
        </div>

        <div className="space-y-2">
          <label htmlFor="pub-title" className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Judul Publikasi</label>
          <input 
            type="text"
            id="pub-title"
            required
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Masukkan judul publikasi..."
            className="w-full px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/30 focus:border-primary-500 transition-all outline-none text-sm text-gray-900 dark:text-zinc-100" 
          />
        </div>

        {category && (() => {
          const activeWeight = weights.find((w: any) => w.category === category);
          return (
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Kategori Publikasi</label>
              <div className="w-full px-4 py-3 bg-primary-50 dark:bg-primary-950/20 border-2 border-primary-200 dark:border-primary-800/40 rounded-xl flex items-center gap-3">
                <Shield className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <span className="text-sm font-black text-primary-800 dark:text-primary-200 uppercase tracking-tight flex-1">
                  {category}
                </span>
                {activeWeight && (
                  <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-900/30 flex-shrink-0">
                    +{activeWeight.weight_value} PTS
                  </span>
                )}
              </div>
            </div>
          );
        })()}

        <div className="space-y-2 relative">
          <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1 flex items-center">
            <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-primary-500" />
            Tanggal Terbit
          </label>
          <DatePicker date={date} onDateChange={setDate} placeholder="Pilih tanggal terbit" />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">File Publikasi (PDF)</label>
          {file ? (
            <div className="relative p-5 bg-gray-50/50 dark:bg-zinc-800/30 border border-gray-150 dark:border-zinc-800 rounded-2xl flex flex-col gap-4">
              <button 
                type="button"
                onClick={() => setFile(null)}
                disabled={loading}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-850 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                  <FileText className="w-6 h-6 text-gray-400 dark:text-zinc-500" />
                </div>
                
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-gray-900 dark:text-zinc-100 truncate pr-6 uppercase tracking-tight">
                    {file.name}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-2">
                <div className="flex-1 bg-gray-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    className="bg-gray-900 dark:bg-zinc-100 h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress !== null ? uploadProgress : 100}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <span className="text-xs font-bold text-gray-600 dark:text-zinc-400 min-w-[30px] text-right">
                  {uploadProgress !== null ? `${uploadProgress}%` : '100%'}
                </span>
              </div>
            </div>
          ) : (
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('pub-file-input-modal')?.click()}
              className={`relative group mt-1 flex justify-center px-6 py-8 border-2 rounded-xl transition-all duration-300 cursor-pointer border-gray-200 dark:border-zinc-800 border-dashed bg-gray-50/30 dark:bg-zinc-800/30 hover:bg-white dark:hover:bg-zinc-900 hover:border-primary-400`}
            >
              <input
                id="pub-file-input-modal"
                type="file"
                accept=".pdf"
                className="sr-only"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <div className="space-y-3 text-center">
                <div className={`mx-auto h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-300 bg-white dark:bg-zinc-800 shadow-sm ring-1 ring-black/5 dark:ring-white/5`}>
                  <Upload className={`h-6 w-6 text-gray-400 group-hover:text-primary-600`} />
                </div>
                <div className="flex flex-col gap-1 px-4">
                  <p className="text-xs font-black text-gray-800 dark:text-zinc-200">
                    Drag & Drop PDF
                  </p>
                  <p className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest truncate max-w-[250px]">
                    Klik atau seret file dokumen ke sini
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 border border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex-1 sm:flex-none"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading || !!duplicateFound}
            className="px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-sm transition-all active:scale-95 disabled:opacity-50 flex-1 sm:flex-none"
          >
            {loading ? 'Mengunggah...' : 'Unggah Publikasi'}
          </button>
        </div>
      </form>
    </BaseFormModal>
  );
}
