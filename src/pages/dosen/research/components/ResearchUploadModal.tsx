import React, { useState, useMemo } from 'react';
import { 
  Upload, Home, Landmark, Globe, CalendarDays, 
  ChevronDown, CheckCircle, Sparkles, XCircle, FileText, Archive 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BaseFormModal } from '../../../../components/ui/BaseFormModal';
import { DatePicker } from '../../../../components/ui/DatePicker';

interface ResearchUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: string;
  setProgram: (val: string) => void;
  judulPenelitian: string;
  setJudulPenelitian: (val: string) => void;
  skema: string;
  setSkema: (val: string) => void;
  fokus: string;
  setFokus: (val: string) => void;
  danaDisetujui: string;
  setDanaDisetujui: (val: string) => void;
  tahun: Date | undefined;
  setTahun: (val: Date | undefined) => void;
  docType?: 'kpi' | 'arsip';
  setDocType?: (val: 'kpi' | 'arsip') => void;
  file: File | null;
  setFile: (val: File | null) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onErrorMsg: (msg: string) => void;
  uploadProgress?: number | null;
}

export default function ResearchUploadModal({
  isOpen,
  onClose,
  program,
  setProgram,
  judulPenelitian,
  setJudulPenelitian,
  skema,
  setSkema,
  fokus,
  setFokus,
  danaDisetujui,
  setDanaDisetujui,
  tahun,
  setTahun,
  docType = 'kpi',
  setDocType,
  file,
  setFile,
  loading,
  onSubmit,
  onErrorMsg,
  uploadProgress = null
}: ResearchUploadModalProps) {
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Scoring preview calculated locally based on docType, program, and danaDisetujui
  const scoringPreview = useMemo(() => {
    if (docType === 'arsip') {
      return {
        base: 0,
        dana: '0',
        total: '0',
        message: 'Kategori Arsip: Dokumen disimpan sebagai arsip (0 Poin)',
      };
    }

    const rawValue = danaDisetujui.replace(/\./g, '');
    if (!rawValue || isNaN(Number(rawValue))) return null;

    let basePoints = 0;
    if (program === 'hibah luar negeri') basePoints = 10;
    else if (program === 'hibah dikti') basePoints = 6;
    else if (program === 'hibah internal') basePoints = 3;

    return {
      base: basePoints,
      dana: '0',
      total: basePoints.toString(),
      message: `Estimasi Poin: ${basePoints} Poin`,
    };
  }, [docType, program, danaDisetujui]);

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
        if (droppedFile.size <= 10 * 1024 * 1024) {
          setFile(droppedFile);
        } else {
          onErrorMsg('Ukuran file maksimal 10MB.');
        }
      } else {
        onErrorMsg('Hanya file PDF yang diperbolehkan.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        if (selectedFile.size <= 10 * 1024 * 1024) {
          setFile(selectedFile);
        } else {
          onErrorMsg('Ukuran file maksimal 10MB.');
        }
      } else {
        onErrorMsg('Hanya file PDF yang diperbolehkan.');
      }
    }
  };

  return (
    <BaseFormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Unggah Penelitian Baru"
      subtitle="Registrasikan hasil penelitian hibah eksternal, internal, atau luar negeri"
      icon={Upload}
      iconColorClass="text-primary-500"
      maxWidthClass="max-w-4xl"
    >
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Selector Tipe Dokumen: KPI Dosen vs Arsip Umum */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setDocType?.('kpi')}
            className={`group relative flex items-center p-4 rounded-xl border-2 transition-all duration-300 ${
              docType === 'kpi'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20 ring-4 ring-primary-500/10'
                : 'border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-gray-200 dark:hover:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-colors ${
              docType === 'kpi' ? 'bg-primary-100 dark:bg-primary-900/40' : 'bg-gray-100 dark:bg-zinc-800 group-hover:bg-primary-50'
            }`}>
              <Sparkles className={`w-5 h-5 ${docType === 'kpi' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 group-hover:text-primary-500'}`} />
            </div>
            <div className="text-left min-w-0">
              <p className={`text-[11px] font-black uppercase tracking-tight ${docType === 'kpi' ? 'text-primary-900 dark:text-primary-200' : 'text-gray-500 group-hover:text-gray-900'}`}>
                KPI Dosen
              </p>
              <p className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Automated Scoring</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setDocType?.('arsip')}
            className={`group relative flex items-center p-4 rounded-xl border-2 transition-all duration-300 ${
              docType === 'arsip'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20 ring-4 ring-primary-500/10'
                : 'border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-gray-200 dark:hover:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-colors ${
              docType === 'arsip' ? 'bg-primary-100 dark:bg-primary-900/40' : 'bg-gray-100 dark:bg-zinc-800 group-hover:bg-primary-50'
            }`}>
              <Archive className={`w-5 h-5 ${docType === 'arsip' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 group-hover:text-primary-500'}`} />
            </div>
            <div className="text-left min-w-0">
              <p className={`text-[11px] font-black uppercase tracking-tight ${docType === 'arsip' ? 'text-primary-900 dark:text-primary-200' : 'text-gray-500 group-hover:text-gray-900'}`}>
                Arsip Umum
              </p>
              <p className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Storage Only (0 Pts)</p>
            </div>
          </button>
        </div>
        {/* Program Selector */}
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
            Kategori Program Penelitian
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { key: 'hibah internal', label: 'Hibah Internal', icon: Home, pts: 3 },
              { key: 'hibah dikti', label: 'Hibah Dikti', icon: Landmark, pts: 6 },
              { key: 'hibah luar negeri', label: 'Hibah Luar Negeri', icon: Globe, pts: 10 },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setProgram(item.key)}
                className={`group relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                  program === item.key
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20 ring-4 ring-primary-500/10'
                    : 'border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-gray-200 dark:hover:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 transition-colors ${
                  program === item.key ? 'bg-primary-100 dark:bg-primary-900/40' : 'bg-gray-100 dark:bg-zinc-800 group-hover:bg-primary-50'
                }`}>
                  <item.icon className={`w-4 h-4 ${program === item.key ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 group-hover:text-primary-500'}`} />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-wider text-center ${
                  program === item.key ? 'text-primary-900 dark:text-primary-200' : 'text-gray-800 dark:text-zinc-200'
                }`}>
                  {item.label}
                </span>
                <span className={`text-[9px] font-bold mt-1 uppercase ${
                  program === item.key ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'
                }`}>
                  {item.pts} Pts Base
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Judul Penelitian */}
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
            Judul Penelitian
          </label>
          <input
            type="text"
            required
            value={judulPenelitian}
            onChange={(e) => setJudulPenelitian(e.target.value)}
            placeholder="Masukkan judul penelitian..."
            className="w-full px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/30 focus:border-primary-500 transition-all outline-none text-sm text-gray-900 dark:text-zinc-100"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Skema */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
              Skema Penelitian
            </label>
            <select
              value={skema}
              onChange={(e) => setSkema(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-sm text-gray-900 dark:text-zinc-100 cursor-pointer"
            >
              <option className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-100" value="">
                Pilih Skema...
              </option>
              <option className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-100" value="kompetisi">
                Kompetisi
              </option>
              <option className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-100" value="pembinaan">
                Pembinaan
              </option>
              <option className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-100" value="lainnya">
                Lainnya
              </option>
            </select>
          </div>

          {/* Fokus */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
              Fokus Penelitian
            </label>
            <select
              value={fokus}
              onChange={(e) => setFokus(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-sm text-gray-900 dark:text-zinc-100 cursor-pointer"
            >
              <option className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-100" value="">
                Pilih Fokus...
              </option>
              <option className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-100" value="kesehatan">
                Kesehatan
              </option>
              <option className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-100" value="ekonomi">
                Ekonomi
              </option>
              <option className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-100" value="teknologi">
                Teknologi
              </option>
              <option className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-100" value="sosial">
                Sosial
              </option>
              <option className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-100" value="lainnya">
                Lainnya
              </option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Dana Disetujui */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
              Dana Disetujui
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-sm font-black text-gray-400 uppercase">Rp</span>
              </div>
              <input
                type="text"
                required
                value={danaDisetujui}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  const formatted = val ? Number(val).toLocaleString('id-ID') : '';
                  setDanaDisetujui(formatted);
                }}
                placeholder="Contoh: 10.000.000"
                className="w-full pl-12 pr-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-sm text-gray-900 dark:text-zinc-100"
              />
            </div>
          </div>

          {/* Tahun */}
          <div className="space-y-2 relative">
            <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1 flex items-center">
              <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-primary-500" />
              Tanggal Pelaksanaan
            </label>
            <DatePicker date={tahun} onDateChange={setTahun} placeholder="Pilih tanggal pelaksanaan" />
          </div>
        </div>

        {/* Drag and Drop PDF */}
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
            Laporan Kemajuan / Akhir (PDF)
          </label>
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
              onClick={() => document.getElementById('res-file-input-modal')?.click()}
              className={`relative group mt-1 flex justify-center px-6 py-8 border-2 rounded-xl transition-all duration-300 cursor-pointer border-gray-200 dark:border-zinc-800 border-dashed bg-gray-50/30 dark:bg-zinc-800/30 hover:bg-white dark:hover:bg-zinc-900 hover:border-primary-400`}
            >
              <input
                id="res-file-input-modal"
                type="file"
                accept=".pdf"
                className="sr-only"
                onChange={handleFileChange}
              />
              <div className="space-y-3 text-center">
                <div className={`mx-auto h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-300 bg-white dark:bg-zinc-800 shadow-sm ring-1 ring-black/5 dark:ring-white/5`}>
                  <Upload className="h-6 w-6 text-gray-400 group-hover:text-primary-600" />
                </div>
                <div className="flex flex-col gap-1 px-4">
                  <p className="text-xs font-black text-gray-800 dark:text-zinc-200">
                    Drag & Drop PDF
                  </p>
                  <p className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest truncate max-w-[250px]">
                    Klik atau seret file laporan ke sini
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
            disabled={loading}
            className="px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-sm transition-all active:scale-95 disabled:opacity-50 flex-1 sm:flex-none"
          >
            {loading ? 'Mengunggah...' : 'Unggah Penelitian'}
          </button>
        </div>
      </form>
    </BaseFormModal>
  );
}
