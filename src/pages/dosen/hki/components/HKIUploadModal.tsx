import React, { useState, useMemo } from 'react';
import { 
  Upload, Sparkles, Archive, AlertCircle, Shield, 
  CalendarDays, ChevronDown, CheckCircle, XCircle, Zap 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BaseFormModal } from '../../../../components/ui/BaseFormModal';
import { HKI_CATEGORIES } from '../constants';
import { DatePicker, formatToYYYYMMDD } from '../../../../components/ui/DatePicker';

interface HKIUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  documents: any[];
  weights: any[];
  isWeightsLoading: boolean;
  fetchDocuments: () => Promise<void>;
  setIsTableLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  onShowMessage: (msg: string, type: 'success' | 'error') => void;
}

export default function HKIUploadModal({
  isOpen,
  onClose,
  user,
  documents,
  weights,
  isWeightsLoading,
  fetchDocuments,
  setIsTableLoading,
  setCurrentPage,
  onShowMessage
}: HKIUploadModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('HKI Paten');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [docType, setDocType] = useState<'kpi' | 'arsip'>('kpi');
  const [file, setFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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
      onShowMessage('Dokumen HKI ini sudah terdata dalam sistem.', 'error');
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
      const res = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        onShowMessage(data.message || 'Dokumen HKI berhasil diunggah!', 'success');
        setTitle('');
        setFile(null);
        setDate(new Date());
        onClose(); // Tutup modal saat sukses
        
        setIsTableLoading(true);
        await fetchDocuments();
        setCurrentPage(1); // Reset ke halaman 1 setelah upload
        setIsTableLoading(false);
      } else {
        onShowMessage('Gagal mengunggah dokumen HKI.', 'error');
      }
    } catch (err) {
      onShowMessage('Terjadi kesalahan saat mengunggah.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseFormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Unggah Dokumen HKI Baru"
      subtitle="Daftarkan Paten, Merek, atau Hak Cipta"
      icon={Upload}
      iconColorClass="text-primary-500"
      maxWidthClass="max-w-6xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        {/* Left Side: Upload Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleUpload} className="space-y-6">
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
              <label htmlFor="title" className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                Judul HKI
              </label>
              <input
                type="text"
                id="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/30 focus:border-primary-500 transition-all outline-none text-sm text-gray-900 dark:text-zinc-100"
                placeholder="Masukkan judul paten / merek / hak cipta..."
              />
              {docType === 'kpi' && title.length > 3 && !duplicateFound && (
                <p className="text-[9px] font-bold text-primary-500 flex items-center bg-primary-50 px-2 py-1 rounded-lg w-fit">
                  <Zap className="w-3.5 h-3.5 mr-1.5 fill-current" />
                  Auto-Verification Enabled
                </p>
              )}
              {duplicateFound && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[9px] font-black text-amber-900 dark:text-amber-200 uppercase tracking-tight">Dokumen Sudah Terdata (Akses Dibatasi)</p>
                    <p className="text-[9px] font-bold text-amber-700/80 dark:text-amber-400/80 leading-relaxed">
                      Dokumen HKI dengan judul ini sudah terhitung dalam poin KPI. Pengunggahan dibatasi untuk menghindari duplikasi data.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Jenis HKI Card Selection */}
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1 flex items-center">
                <Shield className="w-3.5 h-3.5 mr-1.5 text-primary-500" />
                Jenis Hak Kekayaan Intelektual (HKI)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {HKI_CATEGORIES.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setCategory(opt.id)}
                    className={`group relative flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-300 ${
                      category === opt.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20 ring-4 ring-primary-500/10 shadow-sm'
                        : 'border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-gray-200 dark:hover:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 transition-all duration-300 ${
                      category === opt.id ? 'bg-primary-100 dark:bg-primary-900/40' : 'bg-gray-100 dark:bg-zinc-800'
                    }`}>
                      <opt.icon className={`w-4 h-4 ${category === opt.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 group-hover:text-primary-500'}`} />
                    </div>
                    <p className="text-[9px] font-black uppercase text-center tracking-tight text-gray-800 dark:text-zinc-200">
                      {opt.label}
                    </p>
                    <p className="text-[8px] font-bold mt-1 text-primary-500">+{opt.pts} Pts</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 relative">
              <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1 flex items-center">
                <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-primary-500" />
                Tanggal Perolehan HKI
              </label>
              <DatePicker date={date} onDateChange={setDate} placeholder="Pilih tanggal perolehan" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                File Sertifikat / Dokumen HKI (PDF)
              </label>
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('hki-file-upload-modal')?.click()}
                className={`relative group mt-1 flex justify-center px-6 py-8 border-2 rounded-xl transition-all duration-300 cursor-pointer ${
                  isDragging 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20 ring-8 ring-primary-500/10 scale-[1.01]' 
                    : file 
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20' 
                      : 'border-gray-200 dark:border-zinc-800 border-dashed bg-gray-50/30 dark:bg-zinc-800/30 hover:bg-white dark:hover:bg-zinc-900 hover:border-primary-400'
                }`}
              >
                <input
                  id="hki-file-upload-modal"
                  type="file"
                  accept=".pdf"
                  className="sr-only"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <div className="space-y-3 text-center">
                  <div className={`mx-auto h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isDragging ? 'scale-110 bg-primary-600' : 
                    file ? 'bg-emerald-100 dark:bg-emerald-900/40 shadow-sm' : 'bg-white dark:bg-zinc-800 shadow-sm ring-1 ring-black/5 dark:ring-white/5'
                  }`}>
                    {file ? (
                      <CheckCircle className="h-6 w-6 text-emerald-600 animate-bounce" />
                    ) : (
                      <Upload className={`h-6 w-6 text-gray-400 group-hover:text-primary-600`} />
                    )}
                  </div>
                  <div className="flex flex-col gap-1 px-4">
                    <p className="text-xs font-black text-gray-800 dark:text-zinc-200">
                      {file ? 'Sertifikat Terpilih!' : 'Drag & Drop PDF'}
                    </p>
                    <p className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest truncate max-w-[250px]">
                      {file ? file.name : 'Klik atau seret file sertifikat ke sini'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
              {scoringPreview ? (
                <div className="px-4 py-2.5 rounded-xl border-2 flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400 w-full sm:w-auto">
                  <Sparkles className="h-5 w-5 shrink-0 text-emerald-600" />
                  <div className="min-w-0">
                    <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Estimasi Poin</p>
                    <p className="text-xs font-black truncate">{scoringPreview.message}</p>
                  </div>
                </div>
              ) : (
                <div />
              )}

              <div className="flex items-center justify-end gap-3 w-full sm:w-auto">
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
                  className="px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary-200 dark:shadow-primary-900/20 transition-all active:scale-95 disabled:opacity-50 flex-1 sm:flex-none"
                >
                  {loading ? 'Mengunggah...' : 'Kirim HKI'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right Side Guide Panel */}
        <div className="space-y-6 lg:col-span-1">
          {isWeightsLoading ? (
            <div className="bg-gray-50/50 dark:bg-zinc-800/20 border border-gray-100 dark:border-zinc-800/60 rounded-xl p-4 animate-pulse">
              <div className="h-3.5 w-24 bg-gray-200 dark:bg-zinc-700 rounded mb-3"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-8 bg-white dark:bg-zinc-900 rounded-lg"></div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50/50 dark:bg-zinc-800/20 border border-gray-100 dark:border-zinc-800/60 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3 border-b border-gray-100/80 dark:border-zinc-800 pb-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-zinc-200">Panduan Poin HKI</h4>
              </div>
              <div className="space-y-2 font-black">
                {HKI_CATEGORIES.map((w: any) => {
                  const matchedWeight = weights.find(wt => wt.category === w.id);
                  const pts = matchedWeight ? matchedWeight.weight_value : w.pts;
                  return (
                    <div key={w.id} className="flex justify-between items-center bg-white dark:bg-zinc-900 p-2.5 rounded-xl border border-gray-50 dark:border-zinc-800">
                      <span className="text-[9px] font-bold text-gray-600 dark:text-zinc-300 uppercase tracking-wide">{w.label}</span>
                      <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-0.5 rounded border border-emerald-100">+{pts} PTS</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="p-4 bg-primary-50 dark:bg-primary-950/10 border border-primary-100 dark:border-primary-900/30 rounded-xl">
            <h4 className="text-[10px] font-black uppercase text-primary-800 dark:text-primary-300 tracking-wider mb-1">Informasi Verifikasi</h4>
            <p className="text-[9px] font-bold text-primary-700/80 dark:text-primary-400/80 leading-relaxed">
              Dokumen HKI yang diunggah akan melalui proses verifikasi oleh LPPM sebelum secara resmi tercatat dalam performa kinerja dosen.
            </p>
          </div>
        </div>
      </div>
    </BaseFormModal>
  );
}
