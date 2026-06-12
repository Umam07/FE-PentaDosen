import React, { useState } from 'react';
import { Pencil, Home, Landmark, Globe, CalendarDays, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BaseFormModal } from '../../../../components/ui/BaseFormModal';

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
  editTahun: string;
  setEditTahun: (val: string) => void;
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
  isEditLoading,
  onSubmit,
}: ResearchEditModalProps) {
  const [isEditYearDropdownOpen, setIsEditYearDropdownOpen] = useState(false);

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
                { key: 'hibah internal', label: 'Hibah Internal', icon: Home, pts: 40 },
                { key: 'hibah dikti', label: 'Hibah Dikti', icon: Landmark, pts: 50 },
                { key: 'hibah luar negeri', label: 'Hibah Luar Negeri', icon: Globe, pts: 60 },
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
                Tahun
              </label>
              <button
                type="button"
                onClick={() => setIsEditYearDropdownOpen(!isEditYearDropdownOpen)}
                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-sm text-left flex justify-between items-center text-gray-900 dark:text-zinc-100"
              >
                <span>{editTahun}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    isEditYearDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {isEditYearDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setIsEditYearDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-30 w-full mt-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
                    >
                      <div className="max-h-48 overflow-y-auto p-2.5 grid grid-cols-3 gap-1.5">
                        {Array.from({ length: 24 }, (_, i) => {
                          const y = (new Date().getFullYear() - 10 + i).toString();
                          return (
                            <button
                              key={y}
                              type="button"
                              onClick={() => {
                                setEditTahun(y);
                                setIsEditYearDropdownOpen(false);
                              }}
                              className={`py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                editTahun === y
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
