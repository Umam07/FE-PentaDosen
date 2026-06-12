import React, { useState, useMemo } from 'react';
import { 
  Upload, Sparkles, Archive, AlertCircle, Shield, 
  CalendarDays, ChevronDown, CheckCircle, Zap 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BaseFormModal } from '../../../../components/ui/BaseFormModal';
import { BUKU_CATEGORIES } from '../constants';

interface BukuUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  documents: any[];
  fetchDocuments: () => Promise<void>;
  setIsTableLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  onShowMessage: (msg: string, type: 'success' | 'error') => void;
}

export default function BukuUploadModal({
  isOpen,
  onClose,
  user,
  documents,
  fetchDocuments,
  setIsTableLoading,
  setCurrentPage,
  onShowMessage
}: BukuUploadModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Buku Referensi');
  const [tahun, setTahun] = useState(new Date().getFullYear().toString());
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
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

  const selectedCat = BUKU_CATEGORIES.find(c => c.value === category);
  const scoringPreview = docType === 'arsip'
    ? { type: 'arsip' as const, points: 0, message: 'Arsip — tidak dihitung KPI (0 Poin)' }
    : { type: 'kpi' as const, points: selectedCat?.points || 0, message: `KPI: +${selectedCat?.points || 0} Poin` };

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
    if (!file || !title || !category || !tahun) {
      onShowMessage('Harap lengkapi semua field.', 'error');
      return;
    }

    if (duplicateFound) {
      onShowMessage('Dokumen ini sudah terdata.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('category', category);
    formData.append('user_id', user.id);
    formData.append('published_at', `${tahun}-01-01`);
    formData.append('doc_type', docType);

    try {
      setLoading(true);
      const res = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        onShowMessage(data.message || 'Buku berhasil diunggah!', 'success');
        setTitle('');
        setFile(null);
        setTahun(new Date().getFullYear().toString());
        onClose(); // Tutup modal saat sukses
        
        setIsTableLoading(true);
        await fetchDocuments();
        setCurrentPage(1); // Reset ke halaman 1 setelah upload
        setIsTableLoading(false);
      } else {
        let errorMsg = data.message || 'Gagal mengunggah.';
        if (data.errors && data.errors.title) {
          errorMsg = data.errors.title[0];
        }
        onShowMessage(errorMsg, 'error');
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
      title="Unggah Buku Baru"
      subtitle="Daftarkan Buku Ajar, Referensi, atau Monograf"
      icon={Upload}
      iconColorClass="text-primary-500"
      maxWidthClass="max-w-6xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        {/* Left Side: Upload Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleUpload} className="space-y-6">
            {duplicateFound && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl text-[11px] font-bold text-amber-700 dark:text-amber-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> Judul ini sudah ada di database.
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
              <label htmlFor="buku-title" className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Judul Buku</label>
              <input 
                type="text"
                id="buku-title"
                required
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="Masukkan judul buku..."
                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/30 focus:border-primary-500 transition-all outline-none text-sm text-gray-900 dark:text-zinc-100" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="buku-category" className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Kategori</label>
                <div className="relative">
                  <select 
                    id="buku-category"
                    value={category} 
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/30 focus:border-primary-500 transition-all outline-none text-sm appearance-none cursor-pointer text-gray-900 dark:text-zinc-100"
                  >
                    {BUKU_CATEGORIES.map(bc => (
                      <option className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-100" key={bc.value} value={bc.value}>{bc.label} (+{bc.points} pts)</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2 relative">
                <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1 flex items-center">
                  <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-primary-500" />
                  Tahun Terbit
                </label>
                <button 
                  type="button" 
                  onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                  className="w-full px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-sm text-left flex justify-between items-center text-gray-900 dark:text-zinc-100"
                >
                  <span>{tahun}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isYearDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isYearDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-20" onClick={() => setIsYearDropdownOpen(false)} />
                      <motion.div 
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute z-30 w-full mt-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden origin-top"
                      >
                        <div className="max-h-48 overflow-y-auto p-2.5 grid grid-cols-3 gap-1.5">
                          {Array.from({ length: 24 }, (_, i) => {
                            const y = (new Date().getFullYear() - 10 + i).toString();
                            return (
                              <button
                                key={y}
                                type="button"
                                onClick={() => { setTahun(y); setIsYearDropdownOpen(false); }}
                                className={`py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                  tahun === y
                                    ? 'bg-primary-600 border-primary-600 text-white'
                                    : 'border-transparent bg-gray-50/50 dark:bg-zinc-800/50 text-gray-600 dark:text-zinc-300 hover:border-primary-200'
                                }`}
                              >
                                {y}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">File Buku (PDF)</label>
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('buku-file-input-modal')?.click()}
                className={`relative group mt-1 flex justify-center px-6 py-8 border-2 rounded-xl transition-all duration-300 cursor-pointer ${
                  isDragging 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20 ring-8 ring-primary-500/10 scale-[1.01]' 
                    : file 
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20' 
                      : 'border-gray-200 dark:border-zinc-800 border-dashed bg-gray-50/30 dark:bg-zinc-800/30 hover:bg-white dark:hover:bg-zinc-900 hover:border-primary-400'
                }`}
              >
                <input
                  id="buku-file-input-modal"
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
                      {file ? 'Buku Terpilih!' : 'Drag & Drop PDF'}
                    </p>
                    <p className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest truncate max-w-[250px]">
                      {file ? file.name : 'Klik atau seret file buku ke sini'}
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
                  {loading ? 'Mengunggah...' : 'Kirim Buku'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right Side Guide Panel */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-gray-50/50 dark:bg-zinc-800/20 border border-gray-100 dark:border-zinc-800/60 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100/80 dark:border-zinc-800 pb-2.5">
              <div className="p-1.5 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-zinc-200">Panduan Poin Buku</h4>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Buku Referensi', pts: '40 PTS', desc: 'Buku kajian mendalam bidang ilmu' },
                { label: 'Buku Ajar', pts: '20 PTS', desc: 'Buku pegangan proses belajar mengajar' },
                { label: 'Buku Monograf', pts: '20 PTS', desc: 'Buku hasil penelitian tunggal / spesifik' },
              ].map((bc) => (
                <div key={bc.label} className="p-3 bg-primary-50 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-900 rounded-2xl flex items-center justify-between gap-3 shadow-sm hover:scale-[1.02] transition-transform duration-300">
                  <div>
                    <span className="block text-[10px] font-black text-gray-800 dark:text-zinc-200 uppercase tracking-wide">{bc.label}</span>
                    <span className="block text-[9px] font-bold text-gray-400 mt-0.5">{bc.desc}</span>
                  </div>
                  <span className="text-[10px] font-black text-primary-600 dark:text-primary-400 bg-white dark:bg-zinc-900 px-2.5 py-1.5 rounded-xl border border-primary-100 dark:border-primary-800/50 shrink-0 shadow-sm">
                    +{bc.pts}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-primary-50 dark:bg-primary-950/10 border border-primary-100 dark:border-primary-900/30 rounded-xl">
            <h4 className="text-[10px] font-black uppercase text-primary-800 dark:text-primary-300 tracking-wider mb-1">Informasi Verifikasi</h4>
            <p className="text-[9px] font-bold text-primary-700/80 dark:text-primary-400/80 leading-relaxed">
              Buku yang diunggah akan melalui proses verifikasi oleh LPPM sebelum secara resmi tercatat dalam performa kinerja KPI dosen.
            </p>
          </div>
        </div>
      </div>
    </BaseFormModal>
  );
}
