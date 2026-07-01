import React, { useState, useMemo } from 'react';
import { 
  Upload, Home, Landmark, Globe, CalendarDays, 
  ChevronDown, CheckCircle, Sparkles, XCircle 
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
  file: File | null;
  setFile: (val: File | null) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onErrorMsg: (msg: string) => void;
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
  file,
  setFile,
  loading,
  onSubmit,
  onErrorMsg,
}: ResearchUploadModalProps) {
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Scoring preview calculated locally based on program and danaDisetujui
  const scoringPreview = useMemo(() => {
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
  }, [program, danaDisetujui]);

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
      maxWidthClass="max-w-6xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        {/* Left Side: Upload Form */}
        <div className="lg:col-span-2">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Program Selector */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                Kategori Program Penelitian
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { key: 'hibah internal', label: 'Hibah Internal', icon: Home, pts: 3 },
                  { key: 'hibah dikti', label: 'Hibah Dikti', icon: Landmark, pts: 6 },
                  { key: 'hibah luar negeri', label: 'Hibah Luar Negeri', icon: Globe, pts: 10 },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setProgram(item.key)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      program === item.key
                        ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 font-extrabold shadow-sm'
                        : 'border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-500 hover:border-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-wider">{item.label}</span>
                    <span className="text-[9px] font-bold text-gray-400 mt-1 uppercase">{item.pts} Pts Base</span>
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
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('res-file-input-modal')?.click()}
                className={`relative group mt-1 flex justify-center px-6 py-8 border-2 rounded-xl transition-all duration-300 cursor-pointer ${
                  isDragging
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20 ring-8 ring-primary-500/10 scale-[1.01]'
                    : file
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                    : 'border-gray-200 dark:border-zinc-800 border-dashed bg-gray-50/30 dark:bg-zinc-800/30 hover:bg-white dark:hover:bg-zinc-900 hover:border-primary-400'
                }`}
              >
                <input
                  id="res-file-input-modal"
                  type="file"
                  accept=".pdf"
                  className="sr-only"
                  onChange={handleFileChange}
                />
                <div className="space-y-3 text-center">
                  <div
                    className={`mx-auto h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isDragging
                        ? 'scale-110 bg-primary-600'
                        : file
                        ? 'bg-emerald-100 dark:bg-emerald-900/40 shadow-sm'
                        : 'bg-white dark:bg-zinc-800 shadow-sm ring-1 ring-black/5 dark:ring-white/5'
                    }`}
                  >
                    {file ? (
                      <CheckCircle className="h-6 w-6 text-emerald-600 animate-bounce" />
                    ) : (
                      <Upload className="h-6 w-6 text-gray-400 group-hover:text-primary-600" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1 px-4">
                    <p className="text-xs font-black text-gray-800 dark:text-zinc-200">
                      {file ? 'Laporan Terpilih!' : 'Drag & Drop PDF'}
                    </p>
                    <p className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest truncate max-w-[250px]">
                      {file ? file.name : 'Klik atau seret file laporan ke sini'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
              {scoringPreview ? (
                <div className="px-4 py-2.5 rounded-xl border-2 flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400 w-full sm:w-auto">
                  <Upload className="h-5 w-5 shrink-0 text-emerald-600" />
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
                  disabled={loading}
                  className="px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary-200 dark:shadow-primary-900/20 transition-all active:scale-95 disabled:opacity-50 flex-1 sm:flex-none"
                >
                  {loading ? 'Mengunggah...' : 'Unggah Penelitian'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right Side: Guidelines & Stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* 1. Card Panduan Poin Penelitian */}
          <div className="bg-gray-50/50 dark:bg-zinc-800/20 border border-gray-100 dark:border-zinc-800/60 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100/80 dark:border-zinc-800 pb-2.5">
              <div className="p-1.5 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-zinc-200">
                Panduan Poin Penelitian
              </h4>
            </div>
            <div className="space-y-2.5">
              {[
                { label: 'Hibah Luar Negeri', pts: '10 Pts', desc: 'Penelitian tingkat internasional' },
                { label: 'Hibah Dikti (Eksternal)', pts: '6 Pts', desc: 'Hibah nasional / kementerian' },
                { label: 'Hibah Internal Institusi', pts: '3 Pts', desc: 'Pendanaan internal kampus' },
              ].map((w) => (
                <div
                  key={w.label}
                  className="flex justify-between items-center bg-white dark:bg-zinc-900 p-3 rounded-xl border border-gray-50 dark:border-zinc-800 hover:border-gray-100 dark:hover:border-zinc-700 transition-colors"
                >
                  <div>
                    <span className="block text-[10px] font-black text-gray-800 dark:text-zinc-300 uppercase tracking-wide">
                      {w.label}
                    </span>
                    <span className="block text-[9px] font-bold text-gray-400 mt-0.5">{w.desc}</span>
                  </div>
                  <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-lg border border-emerald-100 dark:border-emerald-900/30 shrink-0">
                    {w.pts}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Informasi Verifikasi */}
          <div className="p-4 bg-primary-50 dark:bg-primary-950/10 border border-primary-100 dark:border-primary-900/30 rounded-xl">
            <h4 className="text-[10px] font-black uppercase text-primary-800 dark:text-primary-300 tracking-wider mb-1">
              Informasi Verifikasi
            </h4>
            <p className="text-[9px] font-bold text-primary-700/80 dark:text-primary-400/80 leading-relaxed">
              Dokumen laporan penelitian yang diunggah akan diverifikasi terlebih dahulu sebelum masuk ke penghitungan
              performa kinerja KPI dosen.
            </p>
          </div>
        </div>
      </div>
    </BaseFormModal>
  );
}
