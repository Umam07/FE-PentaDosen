import React from 'react';
import {
  FileText, Upload, Award, Zap,
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
    <form onSubmit={onSubmit} className="space-y-8">
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
          <label className="text-xs font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider ml-1">
            Tipe Dokumen
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => onDocTypeChange('kpi')}
              className={`group relative flex items-center p-4 rounded-xl border transition-all cursor-pointer ${
                docType === 'kpi'
                  ? 'border-accent dark:border-accent-on-dark bg-accent-soft/30 dark:bg-accent/10 ring-2 ring-accent/20'
                  : 'border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mr-3 transition-colors ${
                docType === 'kpi' ? 'bg-accent-soft text-accent dark:bg-accent/20 dark:text-accent-on-dark' : 'bg-surface-light-raised dark:bg-surface-dark-elevated text-muted dark:text-on-dark-muted'
              }`}>
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-heading dark:text-on-dark">
                  KPI Dosen
                </p>
                <p className="text-[10px] font-mono font-medium text-muted dark:text-on-dark-muted uppercase tracking-wider">Automated Scoring</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onDocTypeChange('arsip')}
              className={`group relative flex items-center p-4 rounded-xl border transition-all cursor-pointer ${
                docType === 'arsip'
                  ? 'border-accent dark:border-accent-on-dark bg-accent-soft/30 dark:bg-accent/10 ring-2 ring-accent/20'
                  : 'border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mr-3 transition-colors ${
                docType === 'arsip' ? 'bg-accent-soft text-accent dark:bg-accent/20 dark:text-accent-on-dark' : 'bg-surface-light-raised dark:bg-surface-dark-elevated text-muted dark:text-on-dark-muted'
              }`}>
                <Archive className="w-4 h-4" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-heading dark:text-on-dark">
                  Arsip Umum
                </p>
                <p className="text-[10px] font-mono font-medium text-muted dark:text-on-dark-muted uppercase tracking-wider">Storage Only (0 Pts)</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Detail Dokumen */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl text-ink-heading dark:text-on-dark border border-hairline-light-soft dark:border-hairline-dark-soft">
            <FileText className="w-5 h-5 text-accent dark:text-accent-on-dark" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-ink-heading dark:text-on-dark tracking-tight">Detail Dokumen</h3>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {/* Judul Dokumen / Penelitian */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-body dark:text-on-dark-soft uppercase tracking-wider ml-1">
              {mainCategory === 'Penelitian' ? 'Judul Penelitian' : mainCategory === 'HKI' ? 'Judul HKI' : mainCategory === 'Buku' ? 'Judul Buku' : 'Judul Publikasi'}
            </label>
            <input
              type="text"
              required
              placeholder={`Masukkan ${mainCategory === 'Penelitian' ? 'judul penelitian' : 'judul dokumen'}...`}
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="w-full px-4 py-3 bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-xl text-xs font-semibold text-ink-heading dark:text-on-dark focus:bg-surface-light dark:focus:bg-surface-dark focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none placeholder:text-muted dark:placeholder:text-on-dark-muted"
            />
          </div>

          {/* Additional fields for HKI */}
          {mainCategory === 'HKI' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-body dark:text-on-dark-soft uppercase tracking-wider ml-1">
                  Jenis Hak Cipta / Paten
                </label>
                <div className="relative">
                  <Award className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted dark:text-on-dark-muted" />
                  <input
                    type="text"
                    placeholder="Contoh: Hak Cipta Program Komputer"
                    value={hkiType}
                    onChange={(e) => onHkiTypeChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-xl text-xs font-semibold text-ink-heading dark:text-on-dark focus:bg-surface-light dark:focus:bg-surface-dark focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none placeholder:text-muted dark:placeholder:text-on-dark-muted"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-body dark:text-on-dark-soft uppercase tracking-wider ml-1">
                  Nama Penemu / Inventor
                </label>
                <div className="relative">
                  <Zap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted dark:text-on-dark-muted" />
                  <input
                    type="text"
                    placeholder="Contoh: Dr. Ahmad, M.T."
                    value={inventorName}
                    onChange={(e) => onInventorNameChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-xl text-xs font-semibold text-ink-heading dark:text-on-dark focus:bg-surface-light dark:focus:bg-surface-dark focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none placeholder:text-muted dark:placeholder:text-on-dark-muted"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Additional fields for Penelitian */}
          {mainCategory === 'Penelitian' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-body dark:text-on-dark-soft uppercase tracking-wider ml-1">
                  Dana Disetujui (Rp)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted dark:text-on-dark-muted" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 15.000.000"
                    value={danaDisetujui}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      onDanaDisetujuiChange(val ? Number(val).toLocaleString('id-ID') : '');
                    }}
                    className="w-full pl-10 pr-4 py-3 bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-xl text-xs font-mono font-semibold text-ink-heading dark:text-on-dark focus:bg-surface-light dark:focus:bg-surface-dark focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none placeholder:text-muted dark:placeholder:text-on-dark-muted"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-body dark:text-on-dark-soft uppercase tracking-wider ml-1">
                  Fokus Penelitian
                </label>
                <select
                  value={fokus}
                  onChange={(e) => onFokusChange(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-xl text-xs font-semibold text-ink-heading dark:text-on-dark focus:bg-surface-light dark:focus:bg-surface-dark focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none"
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
            <label className="text-xs font-semibold text-body dark:text-on-dark-soft uppercase tracking-wider ml-1">
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
            <label className="text-xs font-semibold text-body dark:text-on-dark-soft uppercase tracking-wider ml-1">
              File Dokumen Bukti (PDF/Word/ZIP)
            </label>
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-accent bg-accent-soft/40 dark:bg-accent/15'
                  : file
                  ? 'border-success-border bg-success-soft dark:bg-success/10'
                  : 'border-hairline-light dark:border-hairline-dark hover:border-accent/50 bg-surface-light-raised/50 dark:bg-surface-dark-elevated/50'
              }`}
            >
              <input
                type="file"
                required
                onChange={(e) => onFileChange(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center space-y-2.5">
                <div className={`p-3 rounded-xl ${file ? 'bg-success-soft text-success-dark dark:text-success-on-dark' : 'bg-surface-light-raised dark:bg-surface-dark-elevated text-accent dark:text-accent-on-dark border border-hairline-light-soft dark:border-hairline-dark-soft'}`}>
                  {file ? <CheckCircle className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
                </div>
                <div>
                  <p className="text-xs font-semibold text-ink-heading dark:text-on-dark">
                    {file ? file.name : 'Klik atau Drag & Drop File Bukti di Sini'}
                  </p>
                  <p className="text-[10px] font-mono text-muted dark:text-on-dark-muted mt-0.5">
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
        <div className={`p-4 rounded-xl flex items-center gap-3 text-xs font-semibold ${
          messageType === 'success' 
            ? 'bg-success-soft text-success-dark border border-success-border dark:bg-success/15 dark:text-success-on-dark dark:border-success/30' 
            : 'bg-error-soft text-error border border-error-border dark:bg-error/15 dark:text-error-on-dark dark:border-error/30'
        }`}>
          {messageType === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
          <p>{message}</p>
        </div>
      )}

      {/* Scoring Preview & Submit Action */}
      <div className="pt-4 border-t border-hairline-light dark:border-hairline-dark flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <span className="text-[10px] font-semibold uppercase text-muted dark:text-on-dark-muted tracking-wider block">Pratinjau Bobot KPI</span>
          <span className="text-base sm:text-lg font-bold text-ink-heading dark:text-on-dark font-mono">
            {scoringPreview.message}
          </span>
        </div>

        <button
          type="submit"
          disabled={loading || !selectedUserId || !file || !title}
          className="w-full sm:w-auto px-6 py-3 bg-ink hover:bg-ink-hover active:bg-ink-active text-on-ink dark:bg-surface-dark-elevated dark:text-on-dark dark:hover:bg-surface-dark-elevated/80 rounded-xl font-semibold text-xs uppercase tracking-wider shadow-xs transition-all disabled:opacity-40 flex items-center justify-center gap-2.5 cursor-pointer"
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
