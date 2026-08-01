import React from 'react';
import {
  FileText, Upload, CalendarDays, Award, Zap,
  CheckCircle, XCircle, DollarSign, Sparkles, Archive, Loader2, ArrowRight
} from 'lucide-react';
import { DatePicker } from '../../../../components/ui/DatePicker';
import type { ManualDocumentFormProps } from '../types/adminInputDocument.types';
import LecturerSelectorDropdown from './LecturerSelectorDropdown';
import CategorySelector from './CategorySelector';

export default function ManualDocumentForm({
  users,
  selectedUserId,
  searchTerm,
  isDropdownOpen,
  dropdownRef,
  title,
  mainCategory,
  subCategoryOptions,
  subCategory,
  hkiType,
  inventorName,
  dateVal,
  docType,
  danaDisetujui,
  fokus,
  file,
  loading,
  message,
  messageType,
  isDragging,
  scoringPreview,
  mainCategories,
  onSearchUserChange,
  onSelectUser,
  onToggleDropdown,
  onTitleChange,
  onSelectMainCategory,
  onSelectSubCategory,
  onHkiTypeChange,
  onInventorNameChange,
  onDateChange,
  onDocTypeChange,
  onDanaDisetujuiChange,
  onFokusChange,
  onFileChange,
  onDragOver,
  onDragLeave,
  onDrop,
  onSubmit,
}: ManualDocumentFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-10">
      {/* Step 1: Pilih Dosen */}
      <LecturerSelectorDropdown
        users={users}
        selectedUserId={selectedUserId}
        searchTerm={searchTerm}
        isDropdownOpen={isDropdownOpen}
        dropdownRef={dropdownRef}
        onSearchChange={onSearchUserChange}
        onSelectUser={onSelectUser}
        onToggleDropdown={onToggleDropdown}
      />

      {/* Step 2: Pilih Kategori & Sub-Kategori */}
      <CategorySelector
        mainCategories={mainCategories}
        mainCategory={mainCategory}
        subCategoryOptions={subCategoryOptions}
        subCategory={subCategory}
        onSelectMainCategory={onSelectMainCategory}
        onSelectSubCategory={onSelectSubCategory}
      />

      {/* Selector Tipe Dokumen: KPI Dosen vs Arsip Umum (Non-Penelitian) */}
      {mainCategory !== 'Penelitian' && (
        <div className="space-y-3">
          <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
            Tipe Dokumen
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => onDocTypeChange('kpi')}
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
              onClick={() => onDocTypeChange('arsip')}
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
        </div>
      )}

      {/* Step 3: Detail Dokumen */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-primary-600">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Detail Dokumen</h3>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Judul Dokumen / Penelitian */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
              {mainCategory === 'Penelitian' ? 'Judul Penelitian' : mainCategory === 'HKI' ? 'Judul HKI' : mainCategory === 'Buku' ? 'Judul Buku' : 'Judul Publikasi'}
            </label>
            <input
              type="text"
              required
              placeholder={`Masukkan ${mainCategory === 'Penelitian' ? 'judul penelitian' : 'judul dokumen'}...`}
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="w-full px-6 py-4 bg-gray-50 dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-2xl text-sm font-bold text-gray-900 dark:text-zinc-100 focus:border-primary-500 focus:outline-none transition-all"
            />
          </div>

          {/* Additional fields for HKI */}
          {mainCategory === 'HKI' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                  Jenis Hak Cipta / Paten
                </label>
                <div className="relative">
                  <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Contoh: Hak Cipta Program Komputer"
                    value={hkiType}
                    onChange={(e) => onHkiTypeChange(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-2xl text-sm font-bold text-gray-900 dark:text-zinc-100 focus:border-primary-500 focus:outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                  Nama Penemu / Inventor
                </label>
                <div className="relative">
                  <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Contoh: Dr. Ahmad, M.T."
                    value={inventorName}
                    onChange={(e) => onInventorNameChange(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-2xl text-sm font-bold text-gray-900 dark:text-zinc-100 focus:border-primary-500 focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Additional fields for Penelitian */}
          {mainCategory === 'Penelitian' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                  Dana Disetujui (Rp)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 15.000.000"
                    value={danaDisetujui}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      onDanaDisetujuiChange(val ? Number(val).toLocaleString('id-ID') : '');
                    }}
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-2xl text-sm font-bold text-gray-900 dark:text-zinc-100 focus:border-primary-500 focus:outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                  Fokus Penelitian
                </label>
                <select
                  value={fokus}
                  onChange={(e) => onFokusChange(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-2xl text-sm font-bold text-gray-900 dark:text-zinc-100 focus:border-primary-500 focus:outline-none transition-all"
                >
                  <option value="kesehatan">Kesehatan</option>
                  <option value="ekonomi">Ekonomi</option>
                  <option value="teknologi">Teknologi</option>
                  <option value="hukum">Hukum</option>
                  <option value="sosial">Sosial & Humaniora</option>
                </select>
              </div>
            </div>
          )}

          {/* Date Picker Field */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
              {mainCategory === 'Penelitian' ? 'Tahun Penelitian' : mainCategory === 'HKI' ? 'Tanggal Perolehan' : 'Tanggal Terbit / Publish'}
            </label>
            <DatePicker
              date={dateVal}
              onDateChange={onDateChange}
              placeholder="Pilih Tanggal..."
              className="w-full"
            />
          </div>

          {/* Upload File Zone */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
              File Dokumen Bukti (PDF/Word/ZIP)
            </label>
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`relative border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/20'
                  : file
                  ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10'
                  : 'border-gray-200 dark:border-zinc-700 hover:border-primary-400 bg-gray-50/50 dark:bg-zinc-800/30'
              }`}
            >
              <input
                type="file"
                required
                onChange={(e) => onFileChange(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className={`p-4 rounded-2xl ${file ? 'bg-emerald-100 text-emerald-600' : 'bg-primary-50 dark:bg-primary-900/20 text-primary-600'}`}>
                  {file ? <CheckCircle className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900 dark:text-zinc-100">
                    {file ? file.name : 'Klik atau Drag & Drop File Bukti di Sini'}
                  </p>
                  <p className="text-xs text-gray-400 font-bold mt-1">
                    {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'PDF, DOC, DOCX, ZIP (Maksimal 20MB)'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Message */}
      {message && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 ${
          messageType === 'success' 
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/40' 
            : 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/40'
        }`}>
          {messageType === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
          <p className="text-xs font-bold">{message}</p>
        </div>
      )}

      {/* Scoring Preview & Submit Action */}
      <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block">Pratinjau Bobot KPI</span>
          <span className="text-lg font-black text-primary-600 dark:text-primary-400 font-mono">
            {scoringPreview.message}
          </span>
        </div>

        <button
          type="submit"
          disabled={loading || !selectedUserId || !file || !title}
          className="w-full sm:w-auto px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              Simpan & Setujui Otomatis
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
