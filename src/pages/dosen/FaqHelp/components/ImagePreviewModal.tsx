import React from 'react';
import { Image as ImageIcon, ExternalLink, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { ImagePreviewModalProps } from '../types/faqHelp.types';

export default function ImagePreviewModal({
  fullViewImageUrl,
  onClose,
}: ImagePreviewModalProps) {
  return (
    <AnimatePresence>
      {fullViewImageUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative max-w-4xl max-h-[90vh] z-10 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl p-3 flex flex-col"
          >
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800 px-2">
              <div className="flex items-center gap-2 text-white text-xs font-bold">
                <ImageIcon className="w-4 h-4 text-indigo-400" />
                <span>Pratinjau Tangkapan Layar Kendala</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={fullViewImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Tab Baru</span>
                </a>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center overflow-auto p-2">
              <img
                src={fullViewImageUrl}
                alt="Full View Attachment"
                className="max-h-[80vh] w-auto max-w-full object-contain rounded-xl shadow-md border border-slate-800"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
