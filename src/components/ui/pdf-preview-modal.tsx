import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, ZoomIn, ZoomOut, RotateCw, FileText, AlertCircle, ExternalLink, Maximize2, Minimize2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { buildDownloadFilename, downloadWithFilename } from '../../lib/utils';

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string | null;
  title?: string;
  category?: string;
}

export function PdfPreviewModal({ isOpen, onClose, fileUrl, title, category }: PdfPreviewModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  // Normalize file URL — if it's a relative /storage/... path, resolve it against the current origin
  const resolvedUrl = fileUrl
    ? fileUrl.startsWith('http')
      ? fileUrl
      : `${window.location.origin}${fileUrl}`
    : null;

  const handleDownload = async () => {
    if (!resolvedUrl) return;
    setIsDownloading(true);
    const filename = buildDownloadFilename(title || 'dokumen', resolvedUrl);
    await downloadWithFilename(resolvedUrl, filename);
    setIsDownloading(false);
  };


  // Reset error state when URL changes
  useEffect(() => {
    if (isOpen) {
      setLoadError(false);
      setIsLoading(true);
    }
  }, [isOpen, fileUrl]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const isValidFileUrl = resolvedUrl && resolvedUrl !== `${window.location.origin}-` && resolvedUrl !== `${window.location.origin}/`;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-gray-950/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={`relative flex flex-col bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl border border-gray-200 dark:border-zinc-700 overflow-hidden transition-all duration-300 ${
              isFullscreen
                ? 'w-screen h-screen rounded-none'
                : 'w-full max-w-5xl h-[90vh]'
            }`}
          >
            {/* Header */}
            <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/80 dark:bg-zinc-800/80 backdrop-blur-sm flex-shrink-0">
              {/* File Icon */}
              <div className="p-2.5 bg-primary-50 dark:bg-primary-900/30 rounded-xl border border-primary-100 dark:border-primary-900/30 flex-shrink-0">
                <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>

              {/* Title & Category */}
              <div className="flex-1 min-w-0">
                {category && (
                  <p className="text-[9px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-[0.2em] mb-0.5">
                    {category}
                  </p>
                )}
                <h2 className="text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight truncate">
                  {title || 'Preview Dokumen'}
                </h2>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Download */}
                {isValidFileUrl && (
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-zinc-400 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-200 dark:hover:border-primary-900/30 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    title="Unduh File"
                  >
                    {isDownloading
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Download className="w-4 h-4" />}
                  </button>
                )}

                {/* Open in new tab */}
                {isValidFileUrl && (
                  <a
                    href={resolvedUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-zinc-400 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-200 dark:hover:border-primary-900/30 transition-all shadow-sm"
                    title="Buka di Tab Baru"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                {/* Fullscreen toggle */}
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-zinc-400 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-200 dark:hover:border-primary-900/30 transition-all shadow-sm"
                  title={isFullscreen ? 'Keluar Fullscreen' : 'Fullscreen'}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                {/* Close */}
                <button
                  onClick={onClose}
                  className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-900/30 transition-all shadow-sm"
                  title="Tutup"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* PDF Viewer Body */}
            <div className="flex-1 relative bg-gray-100 dark:bg-zinc-950 overflow-hidden">
              {!isValidFileUrl ? (
                /* No file state */
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8">
                  <div className="w-24 h-24 bg-amber-50 dark:bg-amber-950/20 rounded-3xl flex items-center justify-center ring-8 ring-amber-50/50 dark:ring-amber-950/10">
                    <AlertCircle className="w-12 h-12 text-amber-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight mb-2">
                      File Tidak Tersedia
                    </p>
                    <p className="text-sm font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
                      Dokumen ini berasal dari sinkronisasi otomatis
                      <br />
                      dan tidak memiliki file yang dapat ditampilkan
                    </p>
                  </div>
                </div>
              ) : loadError ? (
                /* Load error state */
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8">
                  <div className="w-24 h-24 bg-red-50 dark:bg-red-950/20 rounded-3xl flex items-center justify-center ring-8 ring-red-50/50 dark:ring-red-950/10">
                    <FileText className="w-12 h-12 text-red-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight mb-2">
                      Gagal Memuat File
                    </p>
                    <p className="text-sm font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-6">
                      Browser tidak dapat menampilkan file ini secara langsung
                    </p>
                    <a
                      href={resolvedUrl!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary-200 dark:shadow-primary-900/20 transition-all active:scale-95"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Buka di Tab Baru
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  {/* Loading indicator */}
                  {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 bg-gray-100 dark:bg-zinc-950">
                      <div className="w-12 h-12 border-4 border-primary-100 dark:border-primary-900/40 border-t-primary-600 rounded-full animate-spin" />
                      <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
                        Memuat Dokumen...
                      </p>
                    </div>
                  )}

                  {/* PDF iframe */}
                  <iframe
                    key={resolvedUrl}
                    src={`${resolvedUrl}#toolbar=1&view=FitH`}
                    className="w-full h-full border-0"
                    title={title || 'Preview Dokumen'}
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                      setIsLoading(false);
                      setLoadError(true);
                    }}
                  />
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 flex-shrink-0">
              <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
                PentaDosen · Preview Dokumen
              </p>
              <p className="text-[10px] font-bold text-gray-300 dark:text-zinc-600 uppercase tracking-widest">
                Tekan <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-zinc-700 rounded text-[9px] font-black">ESC</kbd> untuk menutup
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null;
}
