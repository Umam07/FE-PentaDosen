import React, { useState, useMemo } from 'react';
import { 
  Upload, Sparkles, Archive, AlertCircle, 
  CalendarDays, Award, FileText, XCircle, BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import { BaseFormModal } from '../../../../components/ui/BaseFormModal';
import { DatePicker, formatToYYYYMMDD } from '../../../../components/ui/DatePicker';
import { uploadWithProgress } from '../../../../lib/utils';
import type { UserSession, PublicationDoc, WeightCategory } from '../types/publication.types';

interface PublicationUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserSession;
  documents: PublicationDoc[];
  category: string;
  weights: WeightCategory[];
  isWeightsLoading?: boolean;
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
  fetchDocuments,
  setIsTableLoading,
  setCurrentPage,
  onShowMessage
}: PublicationUploadModalProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [docType, setDocType] = useState<'kpi' | 'arsip'>('kpi');
  const [sintaRank, setSintaRank] = useState<string>('Non-SINTA');
  const [citations, setCitations] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const isNationalJournal = useMemo(() => {
    return (category || '').toLowerCase().includes('jurnal nasional');
  }, [category]);

  const modalSubtitle = useMemo(() => {
    if (!category) return 'Daftarkan Jurnal Ilmiah, Prosiding, atau Book Chapter';
    const catLower = category.toLowerCase();

    if (isNationalJournal) {
      const sintaPointsMap: Record<string, number> = {
        S1: 25,
        S2: 25,
        S3: 20,
        S4: 20,
        S5: 15,
        S6: 15,
        'Non-SINTA': 10
      };
      const pts = sintaPointsMap[sintaRank] ?? 10;
      return `Daftarkan ${catLower} Anda · Max +${pts} pts (${sintaRank})`;
    }

    const activeWeight = weights.find((w) => w.category === category);
    const points = activeWeight?.weight_value;

    if (points !== undefined && points !== null) {
      return `Daftarkan ${catLower} Anda · +${points} pts otomatis`;
    }
    return `Daftarkan ${catLower} Anda`;
  }, [category, isNationalJournal, sintaRank, weights]);

  const duplicateFound = useMemo(() => {
    if (!title || title.length < 5) return null;
    return documents.find((doc: PublicationDoc) => 
      doc.title.toLowerCase().trim() === title.toLowerCase().trim() && 
      doc.is_kpi_counted
    );
  }, [title, documents]);

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
    formData.append('user_id', String(user.id));
    formData.append('published_at', date ? formatToYYYYMMDD(date) : '');
    formData.append('doc_type', docType);
    if (isNationalJournal) {
      if (sintaRank) formData.append('sinta_rank', sintaRank);
      if (citations !== '') formData.append('citations', citations);
    }

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
        setSintaRank('Non-SINTA');
        setCitations('');
        onClose();
        
        setIsTableLoading(true);
        await fetchDocuments();
        setCurrentPage(1);
        setIsTableLoading(false);
      } else {
        onShowMessage('Gagal mengunggah dokumen.', 'error');
      }
    } catch {
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
      subtitle={modalSubtitle}
      icon={Upload}
      maxWidthClass="max-w-4xl"
    >
      <form onSubmit={handleUpload} className="space-y-4 sm:space-y-5">
        {duplicateFound && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-900 dark:text-amber-200">Dokumen Sudah Terdata</p>
              <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80 leading-relaxed mt-0.5">
                Dokumen dengan judul ini sudah terhitung dalam poin KPI.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setDocType('kpi')}
            className={`flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all cursor-pointer ${
              docType === 'kpi'
                ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/80 ring-2 ring-slate-900/10 dark:ring-white/10'
                : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <div className="text-left">
              <p className="text-xs font-bold text-slate-900 dark:text-white">KPI Dosen</p>
              <p className="text-[10px] text-slate-500">Automated Scoring</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setDocType('arsip')}
            className={`flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all cursor-pointer ${
              docType === 'arsip'
                ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/80 ring-2 ring-slate-900/10 dark:ring-white/10'
                : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
            }`}
          >
            <Archive className="w-4 h-4 text-slate-400" />
            <div className="text-left">
              <p className="text-xs font-bold text-slate-900 dark:text-white">Arsip Umum</p>
              <p className="text-[10px] text-slate-500">Storage Only (0 Poin)</p>
            </div>
          </button>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="pub-title" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Judul Publikasi</label>
          <input 
            type="text"
            id="pub-title"
            required
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Masukkan judul publikasi..."
            className="w-full px-3.5 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-accent/15 focus:border-accent transition-all outline-none text-xs text-slate-900 dark:text-white" 
          />
        </div>

        {isNationalJournal && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label htmlFor="pub-sinta-rank" className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                Akreditasi SINTA
              </label>
              <select
                id="pub-sinta-rank"
                value={sintaRank}
                onChange={(e) => setSintaRank(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-accent/15 focus:border-accent transition-all outline-none text-xs text-slate-900 dark:text-white cursor-pointer"
              >
                <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white" value="Non-SINTA">Non-SINTA (Tidak Terakreditasi)</option>
                <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white" value="S1">SINTA 1 (S1)</option>
                <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white" value="S2">SINTA 2 (S2)</option>
                <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white" value="S3">SINTA 3 (S3)</option>
                <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white" value="S4">SINTA 4 (S4)</option>
                <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white" value="S5">SINTA 5 (S5)</option>
                <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white" value="S6">SINTA 6 (S6)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="pub-citations" className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-blue-500" />
                Jumlah Sitasi (Opsional)
              </label>
              <input
                type="number"
                id="pub-citations"
                min="0"
                value={citations}
                onChange={(e) => setCitations(e.target.value)}
                placeholder="0"
                className="w-full px-3.5 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-accent/15 focus:border-accent transition-all outline-none text-xs text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>
        )}

        <div className="space-y-1.5 relative">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center">
            <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
            Tanggal Terbit
          </label>
          <DatePicker date={date} onDateChange={setDate} placeholder="Pilih tanggal terbit" />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">File Publikasi (PDF)</label>
          {file ? (
            <div className="relative p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col gap-3">
              <button 
                type="button"
                onClick={() => setFile(null)}
                disabled={loading}
                className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center shrink-0 shadow-2xs">
                  <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </div>
                
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate pr-6">
                    {file.name}
                  </p>
                  <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-1">
                <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    className="bg-slate-900 dark:bg-white h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress !== null ? uploadProgress : 100}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-400 min-w-[30px] text-right">
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
              className="relative group mt-1 flex justify-center px-6 py-6 border-2 border-dashed rounded-2xl transition-all cursor-pointer border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850/40 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-400"
            >
              <input
                id="pub-file-input-modal"
                type="file"
                accept=".pdf"
                className="sr-only"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <div className="space-y-2 text-center">
                <div className="mx-auto h-10 w-10 rounded-xl flex items-center justify-center transition-all bg-white dark:bg-slate-800 shadow-2xs border border-slate-200/80 dark:border-slate-700/80">
                  <Upload className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                </div>
                <div className="flex flex-col gap-0.5 px-4">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    Pilih File PDF Dokumen Publikasi
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[250px]">
                    Klik atau seret file dokumen ke sini (maks. 10MB)
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200/80 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading || !!duplicateFound}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Mengunggah...' : 'Unggah Publikasi'}
          </button>
        </div>
      </form>
    </BaseFormModal>
  );
}


