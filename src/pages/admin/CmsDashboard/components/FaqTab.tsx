import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, FileText, Eye, Search, FileQuestion, HelpCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PdfPreviewModal } from '../../../../components/ui/pdf-preview-modal';
import { useFaqTab } from '../hooks/useFaqTab';
import FaqDeleteModal from './FaqDeleteModal';

interface FaqTabProps {
  triggerMessage: (text: string, type?: 'success' | 'error') => void;
}

/**
 * Tab Manajemen Tanya Jawab / Panduan PDF.
 */
export default function FaqTab({ triggerMessage }: FaqTabProps) {
  const {
    faqs,
    loading,
    editingId,
    question,
    setQuestion,
    answer,
    setAnswer,
    category,
    setCategory,
    orderIndex,
    setOrderIndex,
    saving,
    isOpenForm,
    setIsOpenForm,
    existingFileUrl,
    removeFile,
    setRemoveFile,
    previewDoc,
    setPreviewDoc,
    deleteFaq,
    setDeleteFaq,
    handleOpenCreate,
    handleOpenEdit,
    handleFileChange,
    handleSave,
    fetchFaqs
  } = useFaqTab(triggerMessage);

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);

  const toggleExpandFaq = (id: number) => {
    setExpandedFaqId(prev => (prev === id ? null : id));
  };

  const filteredFaqs = faqs.filter(f => {
    const query = searchQuery.toLowerCase().trim();
    return (
      query === '' ||
      f.question.toLowerCase().includes(query) ||
      f.answer.toLowerCase().includes(query) ||
      (f.category && f.category.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-ink-heading dark:text-on-dark tracking-tight">Daftar Tanya Jawab &amp; Panduan</h3>
          <p className="text-xs text-muted dark:text-on-dark-muted mt-0.5">Kelola isi dan lampiran file panduan untuk civitas dosen.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-ink hover:bg-ink/90 dark:bg-surface-dark-elevated dark:hover:bg-surface-dark-elevated/80 text-on-ink dark:text-on-dark rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Tambah Panduan / FAQ
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted group-focus-within:text-accent dark:group-focus-within:text-accent-on-dark transition-colors" />
        <input
          type="text"
          placeholder="Cari panduan, kata kunci, atau topik..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-10 py-3 bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark hover:border-hairline-light-soft dark:hover:border-hairline-dark-soft rounded-xl text-xs font-medium outline-none focus:border-accent dark:focus:border-accent focus:ring-1 focus:ring-accent/20 dark:focus:ring-accent/20 transition-all text-ink-heading dark:text-on-dark placeholder-muted dark:placeholder-on-dark-muted shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-surface-light dark:hover:bg-surface-dark text-muted hover:text-ink-heading dark:hover:text-on-dark transition-colors cursor-pointer"
            title="Bersihkan pencarian"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Accordion Card List Container */}
      <div className="overflow-hidden rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark shadow-xs">
        {/* Container Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-hairline-light-soft dark:border-hairline-dark-soft">
          <div className="flex items-center gap-2.5">
            <FileQuestion className="w-4 h-4 text-accent dark:text-accent-on-dark" />
            <h3 className="text-sm font-bold text-ink-heading dark:text-on-dark">Manual Book &amp; Panduan Penggunaan</h3>
          </div>
          <span className="text-[10px] font-mono font-semibold text-muted dark:text-on-dark-muted bg-surface-light-raised dark:bg-surface-dark-elevated px-2.5 py-1 rounded-md border border-hairline-light-soft dark:border-hairline-dark-soft">
            {filteredFaqs.length} Panduan
          </span>
        </div>

        <div className="p-4 sm:p-5 space-y-2.5">
          {loading ? (
            <div className="block space-y-2.5 animate-pulse">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="h-16 w-full bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl flex items-center px-5 justify-between"
                >
                  <div className="flex items-center gap-3 w-2/3">
                    <div className="h-9 w-9 rounded-lg bg-surface-light-raised/80 dark:bg-surface-dark/80" />
                    <div className="h-3.5 bg-surface-light-raised/80 dark:bg-surface-dark/80 rounded w-4/5" />
                  </div>
                  <div className="h-4 w-4 bg-surface-light-raised/80 dark:bg-surface-dark/80 rounded-full" />
                </div>
              ))}
            </div>
          ) : filteredFaqs.length > 0 ? (
            filteredFaqs.map((f) => {
              const isExpanded = expandedFaqId === f.id;

              return (
                <div
                  key={f.id}
                  className={`rounded-xl border overflow-hidden transition-all ${
                    isExpanded
                      ? 'border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark shadow-2xs'
                      : 'border-hairline-light-soft dark:border-hairline-dark-soft bg-surface-light-raised/40 dark:bg-surface-dark-elevated/20 hover:border-hairline-light dark:hover:border-hairline-dark'
                  }`}
                >
                  {/* Card Header & Controls */}
                  <div className="w-full px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Left: Icon & Question */}
                    <div
                      onClick={() => toggleExpandFaq(f.id)}
                      className="flex items-center gap-3.5 min-w-0 flex-1 cursor-pointer select-none group"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent dark:text-accent-on-dark">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <h4 className="text-xs sm:text-sm font-semibold text-ink-heading dark:text-on-dark truncate group-hover:text-accent dark:group-hover:text-accent-on-dark transition-colors">
                          {f.question}
                        </h4>
                      </div>
                    </div>

                    {/* Right: Admin Action Buttons & Expand Arrow */}
                    <div className="flex items-center justify-end gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-hairline-light-soft dark:border-hairline-dark-soft">
                      {f.file_url && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewDoc({
                              fileUrl: f.file_url!,
                              title: f.question,
                              category: f.category
                            });
                          }}
                          className="p-2 text-muted hover:text-accent hover:bg-accent-soft dark:hover:bg-surface-dark-elevated rounded-lg transition-all cursor-pointer"
                          title="Preview PDF"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEdit(f);
                        }}
                        className="p-2 text-muted hover:text-accent hover:bg-accent-soft dark:hover:bg-surface-dark-elevated rounded-lg transition-all cursor-pointer"
                        title="Edit Panduan"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteFaq(f);
                        }}
                        className="p-2 text-muted hover:text-error hover:bg-error-soft rounded-lg transition-all cursor-pointer"
                        title="Hapus Panduan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleExpandFaq(f.id)}
                        className="p-2 text-muted hover:text-ink-heading dark:hover:text-on-dark transition-colors cursor-pointer"
                        title={isExpanded ? 'Sembunyikan detail' : 'Tampilkan detail'}
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-ink-heading dark:text-on-dark' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Accordion Expand Body */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                      >
                        <div className="px-5 pb-5 pt-1 border-t border-hairline-light-soft dark:border-hairline-dark-soft text-xs sm:text-sm font-medium text-body dark:text-on-dark-soft leading-relaxed whitespace-pre-line">
                          <p className="pl-[52px]">{f.answer}</p>
                          {f.file_url && (
                            <div className="mt-4 pl-[52px]">
                              <button
                                onClick={() => setPreviewDoc({
                                  fileUrl: f.file_url!,
                                  title: f.question,
                                  category: f.category
                                })}
                                className="inline-flex items-center gap-2 px-3.5 py-2 bg-surface-light-raised hover:bg-surface-light dark:bg-surface-dark-elevated dark:hover:bg-surface-dark text-ink-heading dark:text-on-dark border border-hairline-light dark:border-hairline-dark rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                              >
                                <FileText className="w-3.5 h-3.5 text-accent dark:text-accent-on-dark" />
                                <span>Lihat Panduan PDF</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          ) : searchQuery ? (
            <div className="py-14 px-4 text-center">
              <div className="w-12 h-12 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl flex items-center justify-center mx-auto mb-3.5 border border-hairline-light-soft dark:border-hairline-dark-soft">
                <HelpCircle className="w-6 h-6 text-muted-soft dark:text-on-dark-muted" />
              </div>
              <h3 className="text-sm font-bold text-ink-heading dark:text-on-dark mb-1">Panduan Tidak Ditemukan</h3>
              <p className="text-xs text-muted dark:text-on-dark-muted max-w-sm mx-auto leading-relaxed mb-4">
                Tidak ada panduan yang cocok dengan pencarian &quot;{searchQuery}&quot;.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-light-raised hover:bg-surface-light dark:bg-surface-dark-elevated dark:hover:bg-surface-dark border border-hairline-light dark:border-hairline-dark text-ink-heading dark:text-on-dark text-xs font-semibold transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Bersihkan Pencarian</span>
              </button>
            </div>
          ) : (
            <div className="py-14 px-4 text-center">
              <div className="w-12 h-12 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl flex items-center justify-center mx-auto mb-3.5 border border-hairline-light-soft dark:border-hairline-dark-soft">
                <FileQuestion className="w-6 h-6 text-muted-soft dark:text-on-dark-muted" />
              </div>
              <h3 className="text-sm font-bold text-ink-heading dark:text-on-dark mb-1">
                Belum Ada Panduan
              </h3>
              <p className="text-xs text-muted dark:text-on-dark-muted max-w-sm mx-auto leading-relaxed mb-4">
                Klik tombol &quot;Tambah Panduan / FAQ&quot; di atas untuk membuat panduan pertama.
              </p>
              <button
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ink hover:bg-ink/90 dark:bg-surface-dark-elevated dark:hover:bg-surface-dark-elevated/80 text-on-ink dark:text-on-dark text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Panduan Baru</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Editor Modal Popup */}
      <AnimatePresence>
        {isOpenForm && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpenForm(false)}
              className="fixed inset-0 bg-ink/40 dark:bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xl border border-hairline-light dark:border-hairline-dark p-6 md:p-8 overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-base font-bold text-ink-heading dark:text-on-dark tracking-tight">
                    {editingId ? 'Edit Panduan / FAQ' : 'Tambah Panduan / FAQ Baru'}
                  </h3>
                  <p className="text-xs text-muted dark:text-on-dark-muted mt-0.5">Panduan tata cara penggunaan fitur bagi pengguna dosen.</p>
                </div>
                <button onClick={() => setIsOpenForm(false)} className="p-1.5 text-muted hover:text-ink-heading dark:hover:text-on-dark rounded-xl hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated cursor-pointer transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink-heading dark:text-on-dark">Urutan Tampil (Order)</label>
                  <input
                    type="number"
                    required
                    value={orderIndex}
                    onChange={(e) => setOrderIndex(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-xl font-mono font-bold outline-none text-xs text-ink-heading dark:text-on-dark focus:ring-1 focus:ring-accent focus:border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink-heading dark:text-on-dark">Topik / Pertanyaan</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bagaimana cara menautkan profil Scopus?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-xl font-medium outline-none text-xs text-ink-heading dark:text-on-dark focus:ring-1 focus:ring-accent focus:border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink-heading dark:text-on-dark">Jawaban / Penjelasan Singkat</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tuliskan jawaban atau langkah ringkas..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="w-full p-4 bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-xl font-medium outline-none text-xs text-ink-heading dark:text-on-dark leading-relaxed resize-none focus:ring-1 focus:ring-accent focus:border-accent"
                  />
                </div>

                {/* File PDF Attachment */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink-heading dark:text-on-dark">File Panduan PDF (Opsional)</label>
                  {existingFileUrl && !removeFile ? (
                    <div className="flex items-center justify-between p-3 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light-soft dark:border-hairline-dark-soft text-xs">
                      <span className="font-semibold text-ink-heading dark:text-on-dark truncate">File Panduan PDF Terlampir</span>
                      <button
                        type="button"
                        onClick={() => setRemoveFile(true)}
                        className="text-error hover:text-error/80 font-semibold text-xs cursor-pointer"
                      >
                        Hapus Berkas
                      </button>
                    </div>
                  ) : (
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="w-full px-4 py-2.5 bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-xl font-medium text-xs text-ink-heading dark:text-on-dark file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-surface-light dark:file:bg-surface-dark file:text-ink-heading dark:file:text-on-dark cursor-pointer"
                    />
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-hairline-light-soft dark:border-hairline-dark-soft">
                  <button
                    type="button"
                    onClick={() => setIsOpenForm(false)}
                    className="px-5 py-2.5 border border-hairline-light dark:border-hairline-dark text-ink-heading dark:text-on-dark rounded-xl text-xs font-semibold hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-ink hover:bg-ink/90 dark:bg-surface-dark-elevated dark:hover:bg-surface-dark-elevated/80 text-on-ink dark:text-on-dark rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {saving ? 'Menyimpan...' : (editingId ? 'Simpan Perubahan' : 'Tambah Panduan')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <FaqDeleteModal
        isOpen={!!deleteFaq}
        onClose={() => setDeleteFaq(null)}
        faq={deleteFaq}
        onSuccess={fetchFaqs}
        triggerMessage={triggerMessage}
      />

      {/* PDF Preview Modal */}
      <PdfPreviewModal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        fileUrl={previewDoc?.fileUrl ?? null}
        title={previewDoc?.title}
        category={previewDoc?.category}
      />
    </div>
  );
}
