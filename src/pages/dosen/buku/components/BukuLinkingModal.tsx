import React, { useState, useEffect } from 'react';
import { Link, ChevronRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { lockBodyScroll, unlockBodyScroll } from '../../../../lib/utils';

interface BukuLinkingModalProps {
  isOpen: boolean;
  onClose: () => void;
  approvedResearch: any[];
  docToLink: any;
  setDocToLink: (doc: any) => void;
  fetchDocuments: () => Promise<void>;
  onShowMessage: (msg: string, type: 'success' | 'error') => void;
}

export default function BukuLinkingModal({
  isOpen,
  onClose,
  approvedResearch,
  docToLink,
  setDocToLink,
  fetchDocuments,
  onShowMessage
}: BukuLinkingModalProps) {
  const [isLinkingLoading, setIsLinkingLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      lockBodyScroll();
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        unlockBodyScroll();
      };
    }
  }, [isOpen, onClose]);

  const handleLinkToResearchInternal = async (penelitianId: number) => {
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
        onShowMessage('Buku berhasil dihubungkan ke penelitian!', 'success');
        onClose();
        await fetchDocuments();
      } else {
        onShowMessage(data.message || 'Gagal menghubungkan buku.', 'error');
      }
    } catch (err) {
      console.error(err);
      onShowMessage('Gagal menghubungkan buku.', 'error');
    } finally {
      setIsLinkingLoading(false);
      setDocToLink(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-xs"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg bg-surface-light dark:bg-surface-dark rounded-3xl shadow-2xl border border-hairline-light dark:border-hairline-dark overflow-hidden"
          >
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="p-2.5 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark">
                  <Link className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-ink-heading dark:text-on-dark tracking-tight">Hubungkan ke Penelitian</h3>
                  <p className="text-xs text-muted dark:text-on-dark-muted mt-0.5">Pilih penelitian asal yang melandasi penerbitan buku ini</p>
                </div>
              </div>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                {approvedResearch.length > 0 ? (
                  approvedResearch.map((res: any) => (
                    <button
                      type="button"
                      key={res.id}
                      disabled={isLinkingLoading}
                      onClick={() => handleLinkToResearchInternal(res.id)}
                      className="w-full text-left p-4 rounded-xl border border-hairline-light dark:border-hairline-dark hover:border-ink-border dark:hover:border-hairline-light-soft bg-surface-light dark:bg-surface-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-all group cursor-pointer shadow-2xs"
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-ink-heading dark:text-on-dark tracking-tight leading-snug">
                            {res.judul_penelitian}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[11px] font-mono text-muted dark:text-on-dark-muted">{res.tahun}</span>
                            <span className="px-2 py-0.5 bg-surface-light-raised dark:bg-surface-dark-elevated text-body dark:text-on-dark-soft text-[10px] font-semibold rounded-md border border-hairline-light dark:border-hairline-dark">{res.program}</span>
                          </div>
                        </div>
                        <div className="p-1.5 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg text-muted dark:text-on-dark-muted group-hover:text-ink-heading dark:group-hover:text-on-dark transition-colors shrink-0">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <AlertCircle className="w-10 h-10 text-muted-soft dark:text-on-dark-muted mx-auto mb-3" />
                    <p className="text-xs font-medium text-muted dark:text-on-dark-muted">Tidak ada penelitian yang disetujui</p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-hairline-light dark:border-hairline-dark">
                <button 
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 bg-surface-light-raised dark:bg-surface-dark-elevated hover:bg-hairline-light dark:hover:bg-surface-dark text-body dark:text-on-dark-soft text-xs font-semibold rounded-lg transition-all cursor-pointer"
                >
                  Batalkan
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}


