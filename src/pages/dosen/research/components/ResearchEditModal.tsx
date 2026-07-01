import React, { useState } from 'react';
import { Pencil, Home, Landmark, Globe, CalendarDays, ChevronDown, Upload, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BaseFormModal } from '../../../../components/ui/BaseFormModal';
import { DatePicker } from '../../../../components/ui/DatePicker';

interface ResearchEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  editDoc: any;
  editJudul: string;
  setEditJudul: (val: string) => void;
  editDana: string;
  setEditDana: (val: string) => void;
  editProgram: string;
  setEditProgram: (val: string) => void;
  editSkema: string;
  setEditSkema: (val: string) => void;
  editFokus: string;
  setEditFokus: (val: string) => void;
  editTahun: Date | undefined;
  setEditTahun: (val: Date | undefined) => void;
  editFile: File | null;
  setEditFile: (val: File | null) => void;
  isEditLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ResearchEditModal({
  isOpen,
  onClose,
  editDoc,
  editJudul,
  setEditJudul,
  editDana,
  setEditDana,
  editProgram,
  setEditProgram,
  editSkema,
  setEditSkema,
  editFokus,
  setEditFokus,
  editTahun,
  setEditTahun,
  editFile,
  setEditFile,
  isEditLoading,
  onSubmit,
}: ResearchEditModalProps) {
  const [isDragging, setIsDragging] = useState(false);

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
        setEditFile(droppedFile);
      }
    }
  };

  return (
    <BaseFormModal
      isOpen={isOpen && !!editDoc}
      onClose={onClose}
      title="Edit Penelitian"
      subtitle={editDoc ? `Perbarui data penelitian #RES-${editDoc.id.toString().padStart(4, '0')}` : undefined}
      icon={Pencil}
      iconColorClass="text-blue-500"
      maxWidthClass="max-w-2xl"
    >
      {editDoc && (
        <form onSubmit={onSubmit} className="space-y-5">
          {/* Program */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
              Kategori Program
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'hibah internal', label: 'Hibah Internal', icon: Home, pts: 3 },
                { key: 'hibah dikti', label: 'Hibah Dikti', icon: Landmark, pts: 6 },
                { key: 'hibah luar negeri', label: 'Hibah Luar Negeri', icon: Globe, pts: 10 },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setEditProgram(item.key)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                    editProgram === item.key
                      ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 font-extrabold shadow-sm'
                      : 'border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-500 hover:border-gray-200'
                  }`}
                >
                  <item.icon className="w-4 h-4 mb-1" />
                  <span className="text-[9px] font-black uppercase tracking-wider">{item.label}</span>
                  <span className="text-[8px] font-bold text-gray-400 mt-0.5 uppercase">{item.pts} Pts</span>
                </button>
              ))}
            </div>
          </div>

          {/* Judul */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
              Judul Penelitian
            </label>
            <input
              type="text"
              required
              value={editJudul}
              onChange={(e) => setEditJudul(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/30 focus:border-primary-500 transition-all outline-none text-sm text-gray-900 dark:text-zinc-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Skema */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                Skema
              </label>
              <select
                value={editSkema}
                onChange={(e) => setEditSkema(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-sm text-gray-900 dark:text-zinc-100 cursor-pointer"
              >
                <option value="">Pilih Skema...</option>
                <option value="kompetisi">Kompetisi</option>
                <option value="pembinaan">Pembinaan</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>
            {/* Fokus */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                Fokus
              </label>
              <select
                value={editFokus}
                onChange={(e) => setEditFokus(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-sm text-gray-900 dark:text-zinc-100 cursor-pointer"
              >
                <option value="">Pilih Fokus...</option>
                <option value="kesehatan">Kesehatan</option>
                <option value="ekonomi">Ekonomi</option>
                <option value="teknologi">Teknologi</option>
                <option value="sosial">Sosial</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Dana */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                Dana Disetujui
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-sm font-black text-gray-400">Rp</span>
                </div>
                <input
                  type="text"
                  required
                  value={editDana}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setEditDana(val ? Number(val).toLocaleString('id-ID') : '');
                  }}
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
              <DatePicker date={editTahun} onDateChange={setEditTahun} placeholder="Pilih tanggal pelaksanaan" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">File Laporan Penelitian (PDF)</label>
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('research-edit-file-input')?.click()}
              className={`relative group mt-1 flex justify-center px-6 py-6 border-2 rounded-xl transition-all duration-300 cursor-pointer ${
                isDragging 
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20 ring-8 ring-primary-500/10 scale-[1.01]' 
                  : editFile 
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20' 
                    : 'border-gray-200 dark:border-zinc-800 border-dashed bg-gray-50/30 dark:bg-zinc-800/30 hover:bg-white dark:hover:bg-zinc-900 hover:border-primary-400'
              }`}
            >
              <input
                id="research-edit-file-input"
                type="file"
                accept=".pdf"
                className="sr-only"
                onChange={(e) => setEditFile(e.target.files?.[0] || null)}
              />
              <div className="space-y-2 text-center">
                <div className={`mx-auto h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isDragging ? 'scale-110 bg-primary-600' : 
                  editFile ? 'bg-emerald-100 dark:bg-emerald-900/40 shadow-sm' : 'bg-white dark:bg-zinc-800 shadow-sm ring-1 ring-black/5 dark:ring-white/5'
                }`}>
                  {editFile ? (
                    <CheckCircle className="h-5 w-5 text-emerald-600 animate-bounce" />
                  ) : (
                    <Upload className="h-5 w-5 text-gray-400 group-hover:text-primary-600" />
                  )}
                </div>
                <div className="flex flex-col gap-0.5 px-4">
                  <p className="text-xs font-black text-gray-800 dark:text-zinc-200">
                    {editFile ? 'Laporan Terpilih!' : 'Drag & Drop PDF'}
                  </p>
                  <p className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest truncate max-w-[250px]">
                    {editFile ? editFile.name : editDoc.file_url && editDoc.file_url !== '-' ? 'Replaced current file: ' + editDoc.file_url.split('/').pop() : 'Pilih file PDF jika ingin memperbarui/mengunggah'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isEditLoading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-200 dark:shadow-blue-900/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {isEditLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      )}
    </BaseFormModal>
  );
}
