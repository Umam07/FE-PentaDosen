import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Download,
  ZoomIn,
  ZoomOut,
  FileText,
  AlertCircle,
  ExternalLink,
  Maximize2,
  Minimize2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Maximize
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Document, Page, pdfjs } from 'react-pdf';
import { buildDownloadFilename, downloadWithFilename } from '../../lib/utils';

// Configure PDF.js worker using unpkg CDN matching pdfjs version
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

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

  // PDF navigation & view states
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [fitToWidth, setFitToWidth] = useState<boolean>(false);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize file URL — resolve relative /storage/... paths
  const resolvedUrl = fileUrl
    ? fileUrl.startsWith('http')
      ? fileUrl
      : `${window.location.origin}${fileUrl}`
    : null;

  const isValidFileUrl = Boolean(
    resolvedUrl &&
    resolvedUrl !== `${window.location.origin}-` &&
    resolvedUrl !== `${window.location.origin}/`
  );

  // Update container width on resize or when modal opens/fullscreen toggles
  const updateContainerWidth = useCallback(() => {
    if (containerRef.current) {
      // Subtract padding (approx 48px padding total)
      const width = containerRef.current.clientWidth - 48;
      if (width > 0) {
        setContainerWidth(width);
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      updateContainerWidth();
      window.addEventListener('resize', updateContainerWidth);
    }
    return () => {
      window.removeEventListener('resize', updateContainerWidth);
    };
  }, [isOpen, isFullscreen, updateContainerWidth]);

  // Reset state when modal opens or URL changes
  useEffect(() => {
    if (isOpen) {
      setLoadError(false);
      setIsLoading(true);
      setNumPages(null);
      setPageNumber(1);
      setScale(1.0);
      setFitToWidth(false);
    }
  }, [isOpen, fileUrl]);

  // Handle keyboard shortcuts (ESC to close, Left/Right arrows for page navigation)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        setPageNumber((prev) => Math.max(prev - 1, 1));
      } else if (e.key === 'ArrowRight' && numPages) {
        setPageNumber((prev) => Math.min(prev + 1, numPages));
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, numPages]);

  const handleDownload = async () => {
    if (!resolvedUrl) return;
    setIsDownloading(true);
    const filename = buildDownloadFilename(title || 'dokumen', resolvedUrl);
    await downloadWithFilename(resolvedUrl, filename);
    setIsDownloading(false);
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setIsLoading(false);
    setLoadError(false);
  };

  const onDocumentLoadError = () => {
    setIsLoading(false);
    setLoadError(true);
  };

  // Zoom handlers
  const zoomIn = () => {
    setFitToWidth(false);
    setScale((prev) => Math.min(Number((prev + 0.25).toFixed(2)), 2.5));
  };

  const zoomOut = () => {
    setFitToWidth(false);
    setScale((prev) => Math.max(Number((prev - 0.25).toFixed(2)), 0.5));
  };

  const resetZoom = () => {
    setFitToWidth(false);
    setScale(1.0);
  };

  const toggleFitToWidth = () => {
    setFitToWidth((prev) => !prev);
  };

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

          {/* Modal Container */}
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
            {/* 1. HEADER */}
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
                    {isDownloading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                  </button>
                )}

                {/* Open in new tab */}
                {isValidFileUrl && (
                  <a
                    href={resolvedUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-zinc-400 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-200 dark:hover:border-primary-900/30 transition-all shadow-sm flex items-center justify-center"
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

            {/* 2. CUSTOM MINIMAL TOOLBAR (Below Header) */}
            {isValidFileUrl && !loadError && (
              <div className="flex items-center justify-between px-6 py-2.5 bg-white dark:bg-zinc-900 border-b border-gray-200/80 dark:border-zinc-800 flex-shrink-0 z-10 shadow-xs">
                {/* Page Navigation Group */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                    disabled={pageNumber <= 1 || isLoading}
                    className="p-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
                    title="Halaman Sebelumnya (Panah Kiri)"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="px-3 py-1 bg-gray-50 dark:bg-zinc-800/80 rounded-lg border border-gray-200/60 dark:border-zinc-700/60 text-xs font-semibold text-gray-700 dark:text-zinc-200 tracking-tight min-w-[120px] text-center">
                    {numPages ? (
                      <>
                        Halaman <span className="font-bold text-primary-600 dark:text-primary-400">{pageNumber}</span> dari <span className="font-bold">{numPages}</span>
                      </>
                    ) : (
                      'Memuat...'
                    )}
                  </div>

                  <button
                    onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages || 1))}
                    disabled={!numPages || pageNumber >= numPages || isLoading}
                    className="p-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
                    title="Halaman Selanjutnya (Panah Kanan)"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Vertical Divider */}
                <div className="h-4 w-px bg-gray-200 dark:bg-zinc-800 mx-2" />

                {/* Zoom Control Group */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={zoomOut}
                    disabled={scale <= 0.5 || isLoading}
                    className="p-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
                    title="Perkecil (-)"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>

                  <button
                    onClick={resetZoom}
                    disabled={isLoading}
                    className="px-2.5 py-1 bg-gray-50 dark:bg-zinc-800/80 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg border border-gray-200/60 dark:border-zinc-700/60 text-xs font-bold text-gray-700 dark:text-zinc-200 min-w-[54px] text-center transition-all"
                    title="Reset Zoom ke 100%"
                  >
                    {Math.round(scale * 100)}%
                  </button>

                  <button
                    onClick={zoomIn}
                    disabled={scale >= 2.5 || isLoading}
                    className="p-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
                    title="Perbesar (+)"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>

                  {/* Fit to Width Button */}
                  <button
                    onClick={toggleFitToWidth}
                    disabled={isLoading}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      fitToWidth
                        ? 'bg-primary-50 dark:bg-primary-950/40 border-primary-300 dark:border-primary-800 text-primary-600 dark:text-primary-400'
                        : 'border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                    }`}
                    title="Sesuaikan Lebar Halaman"
                  >
                    <Maximize className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Fit Lebar</span>
                  </button>
                </div>
              </div>
            )}

            {/* 3. PDF VIEWER BODY (Canvas Area) */}
            <div
              ref={containerRef}
              className="flex-1 relative bg-slate-100/90 dark:bg-zinc-950 overflow-auto p-6 flex items-flex-start justify-center"
            >
              {!isValidFileUrl ? (
                /* No file state */
                <div className="m-auto flex flex-col items-center justify-center gap-5 p-8 text-center max-w-md">
                  <div className="w-20 h-20 bg-amber-50 dark:bg-amber-950/20 rounded-3xl flex items-center justify-center ring-8 ring-amber-50/50 dark:ring-amber-950/10">
                    <AlertCircle className="w-10 h-10 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-base font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight mb-2">
                      File Tidak Tersedia
                    </p>
                    <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 leading-relaxed">
                      Dokumen ini berasal dari sinkronisasi otomatis dan tidak memiliki berkas PDF yang dapat ditampilkan.
                    </p>
                  </div>
                </div>
              ) : loadError ? (
                /* Load error state */
                <div className="m-auto flex flex-col items-center justify-center gap-5 p-8 text-center max-w-md">
                  <div className="w-20 h-20 bg-red-50 dark:bg-red-950/20 rounded-3xl flex items-center justify-center ring-8 ring-red-50/50 dark:ring-red-950/10">
                    <FileText className="w-10 h-10 text-red-400" />
                  </div>
                  <div>
                    <p className="text-base font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight mb-1.5">
                      Gagal Memuat Dokumen
                    </p>
                    <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 leading-relaxed mb-6">
                      Berkas PDF tidak dapat dimuat secara langsung. Anda dapat mencoba lagi atau membukanya di tab baru.
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => {
                          setLoadError(false);
                          setIsLoading(true);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 text-gray-800 dark:text-zinc-200 rounded-xl text-xs font-bold transition-all active:scale-95"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Coba Lagi
                      </button>
                      <a
                        href={resolvedUrl!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-primary-200 dark:shadow-primary-950/30 transition-all active:scale-95"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Buka di Tab Baru
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center my-auto min-h-full py-4">
                  {/* Loading overlay / spinner */}
                  {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-20 bg-slate-100/90 dark:bg-zinc-950/90 backdrop-blur-xs">
                      <div className="w-10 h-10 border-3 border-primary-200 dark:border-primary-900/40 border-t-primary-600 rounded-full animate-spin" />
                      <p className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-widest">
                        Memuat Halaman PDF...
                      </p>
                    </div>
                  )}

                  {/* React PDF Document & Page Render */}
                  <Document
                    file={resolvedUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={null}
                    className="flex justify-center"
                  >
                    <motion.div
                      key={`${pageNumber}-${scale}-${fitToWidth}`}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="bg-white rounded-lg shadow-xl shadow-slate-900/10 dark:shadow-black/70 ring-1 ring-slate-900/5 dark:ring-white/10 overflow-hidden"
                    >
                      <Page
                        pageNumber={pageNumber}
                        scale={fitToWidth ? undefined : scale}
                        width={fitToWidth && containerWidth > 0 ? containerWidth : undefined}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        loading={null}
                      />
                    </motion.div>
                  </Document>
                </div>
              )}
            </div>

            {/* 4. FOOTER */}
            <div className="flex items-center justify-end px-6 py-3 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 flex-shrink-0">
              <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
                Tekan <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-zinc-700 rounded text-[9px] font-black text-gray-700 dark:text-zinc-300">ESC</kbd> untuk menutup
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
