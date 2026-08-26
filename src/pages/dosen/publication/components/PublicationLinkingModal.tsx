import React, { useState, useEffect, useMemo } from 'react';
import { Link, ChevronRight, Search, X, CheckCircle2, Unlink, Beaker, Calendar, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { lockBodyScroll, unlockBodyScroll } from '../../../../lib/utils';

interface PublicationLinkingModalProps {
  isOpen: boolean;
  onClose: () => void;
  approvedResearch: any[];
  docToLink: any;
  setDocToLink: (doc: any) => void;
  fetchDocuments: () => Promise<void>;
  onShowMessage: (msg: string, type: 'success' | 'error') => void;
}

export default function PublicationLinkingModal({
  isOpen,
  onClose,
  approvedResearch = [],
  docToLink,
  setDocToLink,
  fetchDocuments,
  onShowMessage,
}: PublicationLinkingModalProps) {
  const [isLinkingLoading, setIsLinkingLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      lockBodyScroll();
      setSearchQuery('');
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        unlockBodyScroll();
      };
    }
  }, [isOpen, onClose]);

  const filteredResearch = useMemo(() => {
    if (!searchQuery.trim()) return approvedResearch;
    const q = searchQuery.toLowerCase();
    return approvedResearch.filter((res: any) => {
      const title = (res.judul_penelitian || '').toLowerCase();
      const prog = (res.program || '').toLowerCase();
      const skema = (res.skema || '').toLowerCase();
      const tahun = String(res.tahun || '');
      return title.includes(q) || prog.includes(q) || skema.includes(q) || tahun.includes(q);
    });
  }, [approvedResearch, searchQuery]);

  const handleLinkToResearchInternal = async (penelitianId: number | null) => {
    if (!docToLink) return;
    try {
      setIsLinkingLoading(true);
      const res = await fetch(`/api/documents/${docToLink.id}/link-penelitian`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ penelitian_id: penelitianId })
      });
      const data = await res.json();
      if (data.success) {
        onShowMessage(
          penelitianId ? 'Dokumen publikasi berhasil dihubungkan ke penelitian!' : 'Tautan penelitian berhasil dilepas.',
          'success'
        );
        onClose();
        await fetchDocuments();
      } else {
        onShowMessage(data.message || 'Gagal menghubungkan dokumen.', 'error');
      }
    } catch (err) {
      console.error(err);
      onShowMessage('Gagal memperbarui tautan penelitian.', 'error');
    } finally {
      setIsLinkingLoading(false);
      setDocToLink(null);
    }
  };

  const currentLinkedId = docToLink?.penelitian_id || docToLink?.penelitian?.id;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 dark:bg-black/75 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-xl max-h-[90vh] bg-surface-light dark:bg-surface-dark rounded-3xl shadow-2xl border border-hairline-light dark:border-hairline-dark flex flex-col overflow-hidden my-auto"
          >
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-hairline-light dark:border-hairline-dark flex items-center justify-between bg-surface-light-raised/50 dark:bg-surface-dark shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark flex items-center justify-center text-body dark:text-on-dark-soft shrink-0">
                  <Link className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-ink-heading dark:text-on-dark tracking-tight truncate">
                    Hubungkan ke Penelitian Asal
                  </h3>
                  <p className="text-xs text-muted dark:text-on-dark-muted truncate">
                    {docToLink ? `Target Publikasi: "${docToLink.title}"` : 'Pilih riset asal yang mendasari publikasi ini'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup modal"
                className="p-2 rounded-xl text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
              {/* Currently Linked Notice */}
              {docToLink?.penelitian && (
                <div className="p-3.5 rounded-xl bg-surface-light-raised/70 dark:bg-surface-dark-elevated/60 border border-hairline-light dark:border-hairline-dark flex items-center justify-between gap-3">
                  <div className="min-w-0 flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-success dark:text-success-on-dark shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted dark:text-on-dark-muted">
                        Terhubung Saat Ini:
                      </p>
                      <p className="text-xs font-semibold text-ink-heading dark:text-on-dark truncate">
                        {docToLink.penelitian.judul_penelitian}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={isLinkingLoading}
                    onClick={() => handleLinkToResearchInternal(null)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-light dark:bg-surface-dark hover:bg-error-soft dark:hover:bg-error/20 text-muted hover:text-error dark:text-on-dark-muted dark:hover:text-error-on-dark border border-hairline-light dark:border-hairline-dark transition-colors cursor-pointer shrink-0"
                  >
                    <Unlink className="w-3.5 h-3.5" />
                    <span>Lepas Tautan</span>
                  </button>
                </div>
              )}

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-muted dark:text-on-dark-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari berdasarkan judul penelitian, program, skema, atau tahun..."
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-light dark:bg-surface-dark-elevated text-xs text-ink-heading dark:text-on-dark rounded-xl border border-hairline-light dark:border-hairline-dark focus:border-accent dark:focus:border-accent-on-dark focus:ring-2 focus:ring-accent/15 outline-none transition-all placeholder:text-muted dark:placeholder:text-on-dark-muted"
                />
              </div>

              {/* List of Research Items */}
              <div className="space-y-2.5">
                {filteredResearch.length > 0 ? (
                  filteredResearch.map((res: any) => {
                    const isSelected = currentLinkedId === res.id;
                    const tahunFormatted = res.tahun ? (String(res.tahun).includes('-') ? new Date(res.tahun).getFullYear() : res.tahun) : '-';

                    return (
                      <button
                        type="button"
                        key={res.id}
                        disabled={isLinkingLoading}
                        onClick={() => handleLinkToResearchInternal(res.id)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all group cursor-pointer ${
                          isSelected
                            ? 'bg-surface-light-raised dark:bg-surface-dark-elevated border-accent/60 dark:border-accent-on-dark/60 ring-1 ring-accent/30'
                            : 'bg-surface-light dark:bg-surface-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated border-hairline-light dark:border-hairline-dark hover:border-ink-border dark:hover:border-hairline-dark-soft'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-muted dark:text-on-dark-muted">
                                <Calendar className="w-3 h-3" />
                                {tahunFormatted}
                              </span>
                              {res.program && (
                                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark capitalize">
                                  {res.program}
                                </span>
                              )}
                              {res.skema && (
                                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated text-muted dark:text-on-dark-muted border border-hairline-light dark:border-hairline-dark capitalize">
                                  {res.skema}
                                </span>
                              )}
                              {res.status && (
                                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border ${
                                  res.status === 'Approved'
                                    ? 'bg-success-soft dark:bg-success/15 text-success-dark dark:text-success-on-dark border-success-border dark:border-success/30'
                                    : 'bg-warning-soft dark:bg-warning/15 text-warning dark:text-warning-on-dark border-warning-border dark:border-warning/30'
                                }`}>
                                  {res.status}
                                </span>
                              )}
                            </div>

                            <p className="text-xs sm:text-sm font-bold text-ink-heading dark:text-on-dark tracking-tight leading-snug">
                              {res.judul_penelitian}
                            </p>

                            {res.dana_disetujui > 0 && (
                              <p className="text-[11px] text-muted dark:text-on-dark-muted font-mono">
                                Dana: Rp {Number(res.dana_disetujui).toLocaleString('id-ID')}
                              </p>
                            )}
                          </div>

                          <div className="shrink-0 flex items-center gap-2">
                            {isSelected ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent dark:text-accent-on-dark bg-accent-soft dark:bg-accent/15 px-2.5 py-1 rounded-lg border border-accent-border dark:border-accent/30">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Terpilih
                              </span>
                            ) : (
                              <div className="p-2 rounded-xl bg-surface-light-raised dark:bg-surface-dark-elevated text-muted dark:text-on-dark-muted group-hover:text-ink-heading dark:group-hover:text-on-dark group-hover:bg-hairline-light dark:group-hover:bg-surface-dark transition-colors">
                                <ChevronRight className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="py-12 px-4 text-center rounded-2xl bg-surface-light-raised/40 dark:bg-surface-dark-elevated/30 border border-hairline-light-soft dark:border-hairline-dark-soft">
                    <Beaker className="w-10 h-10 text-muted-soft/60 dark:text-on-dark-muted/40 mx-auto mb-3" />
                    <h4 className="text-xs sm:text-sm font-bold text-ink-heading dark:text-on-dark">
                      {searchQuery ? 'Tidak ada penelitian yang cocok' : 'Belum ada data penelitian'}
                    </h4>
                    <p className="text-xs text-muted dark:text-on-dark-muted mt-1 max-w-sm mx-auto">
                      {searchQuery
                        ? 'Coba gunakan kata kunci pencarian lain atau periksa kembali ejaan Anda.'
                        : 'Daftarkan penelitian Anda pada menu Penelitian terlebih dahulu agar dapat dihubungkan ke publikasi.'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-hairline-light dark:border-hairline-dark bg-surface-light-raised/50 dark:bg-surface-dark flex items-center justify-between gap-3 shrink-0">
              <p className="text-[11px] text-muted dark:text-on-dark-muted">
                {filteredResearch.length} penelitian tersedia
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-surface-light dark:bg-surface-dark-elevated hover:bg-surface-light-raised dark:hover:bg-surface-dark text-body dark:text-on-dark-soft text-xs font-semibold rounded-lg border border-hairline-light dark:border-hairline-dark transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
