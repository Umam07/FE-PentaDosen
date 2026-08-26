import React, { useEffect } from 'react';
import { Image as ImageIcon, ExternalLink, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { ImagePreviewModalProps } from '../types/faqHelp.types';
import { lockBodyScroll, unlockBodyScroll } from '../../../../lib/utils';

export default function ImagePreviewModal({
  fullViewImageUrl,
  onClose,
}: ImagePreviewModalProps) {
  const isOpen = Boolean(fullViewImageUrl);

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

  return (
    <AnimatePresence>
      {fullViewImageUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#171412]/85 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative max-w-4xl max-h-[90vh] z-10 overflow-hidden rounded-2xl border border-hairline-dark bg-surface-dark shadow-2xl p-3 flex flex-col"
          >
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-hairline-dark px-2">
              <div className="flex items-center gap-2 text-on-dark text-xs font-bold">
                <ImageIcon className="w-4 h-4 text-accent-on-dark" />
                <span>Pratinjau Tangkapan Layar Kendala</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={fullViewImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Buka gambar lampiran di tab baru"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-dark-elevated hover:bg-surface-dark-soft text-on-dark text-xs font-semibold border border-hairline-dark transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Tab Baru</span>
                </a>
                <button
                  onClick={onClose}
                  aria-label="Tutup pratinjau gambar"
                  className="p-1.5 rounded-lg bg-surface-dark-elevated hover:bg-surface-dark-soft text-on-dark-muted hover:text-on-dark border border-hairline-dark transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center overflow-auto p-2">
              <img
                src={fullViewImageUrl}
                alt="Full View Attachment"
                className="max-h-[80vh] w-auto max-w-full object-contain rounded-xl shadow-md border border-hairline-dark"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

