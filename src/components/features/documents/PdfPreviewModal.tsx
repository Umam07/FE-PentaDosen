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
import { buildDownloadFilename, downloadWithFilename, lockBodyScroll, unlockBodyScroll } from '../../../lib/utils';

// Configure PDF.js worker using unpkg CDN matching pdfjs version
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export interface PdfPreviewModalProps {
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
      lockBodyScroll();
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        unlockBodyScroll();
      };
    }
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
        <div className="fixed inset-0 z-[9000] flex items-center justify-center p-3 sm:p-4 md:p-6 font-sans">
          {/* Backdrop (Warm Espresso / Deep Coffee Tint) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-canvas-dark/75 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Container — Warm Neutral Surface */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`relative flex flex-col bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark shadow-2xl overflow-hidden transition-all duration-300 ${
              isFullscreen
                ? 'w-screen h-screen rounded-none'
                : 'w-full max-w-5xl h-[88vh] rounded-2xl md:rounded-3xl'
            }`}
          >
            {/* 1. HEADER */}
            <div className="flex items-center gap-3.5 px-5 sm:px-6 py-3.5 border-b border-hairline-light dark:border-hairline-dark bg-surface-light-raised/70 dark:bg-surface-dark-elevated/70 backdrop-blur-sm shrink-0">
              {/* File Icon Badge */}
              <div className="w-9 h-9 rounded-lg bg-accent-soft dark:bg-accent/15 border border-accent-border/40 dark:border-accent/30 text-accent dark:text-accent-on-dark flex items-center justify-center shrink-0">
                <FileText className="w-4.5 h-4.5" />
              </div>

              {/* Title & Category */}
              <div className="flex-1 min-w-0">
                {category && (
                  <p className="font-mono text-[10px] sm:text-[11px] font-semibold text-accent dark:text-accent-on-dark uppercase tracking-wider mb-0.5">
                    {category}
                  </p>
                )}
                <h2 className="text-xs sm:text-sm font-bold text-ink-heading dark:text-on-dark truncate leading-tight">
                  {title || 'Preview Dokumen'}
                </h2>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {/* Download Button */}
                {isValidFileUrl && (
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="p-2 sm:p-2.5 rounded-lg bg-surface-light hover:bg-surface-light-raised dark:bg-surface-dark-elevated dark:hover:bg-surface-dark border border-hairline-light dark:border-hairline-dark text-body dark:text-on-dark-soft hover:text-ink-heading dark:hover:text-on-dark transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    title="Unduh File"
                  >
                    {isDownloading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-accent" />
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
                    className="p-2 sm:p-2.5 rounded-lg bg-surface-light hover:bg-surface-light-raised dark:bg-surface-dark-elevated dark:hover:bg-surface-dark border border-hairline-light dark:border-hairline-dark text-body dark:text-on-dark-soft hover:text-ink-heading dark:hover:text-on-dark transition-all shadow-xs flex items-center justify-center cursor-pointer"
                    title="Buka di Tab Baru"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                {/* Fullscreen toggle */}
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 sm:p-2.5 rounded-lg bg-surface-light hover:bg-surface-light-raised dark:bg-surface-dark-elevated dark:hover:bg-surface-dark border border-hairline-light dark:border-hairline-dark text-body dark:text-on-dark-soft hover:text-ink-heading dark:hover:text-on-dark transition-all shadow-xs cursor-pointer"
                  title={isFullscreen ? 'Keluar Fullscreen' : 'Fullscreen'}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="p-2 sm:p-2.5 rounded-lg bg-surface-light hover:bg-error-soft dark:bg-surface-dark-elevated dark:hover:bg-error/15 border border-hairline-light hover:border-error-border dark:border-hairline-dark dark:hover:border-error/30 text-body hover:text-error dark:text-on-dark-soft dark:hover:text-error-on-dark transition-all shadow-xs cursor-pointer"
                  title="Tutup (ESC)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2. TOOLBAR CONTROLS */}
            {isValidFileUrl && !loadError && (
              <div className="flex items-center justify-between px-5 sm:px-6 py-2 bg-surface-light dark:bg-surface-dark border-b border-hairline-light-soft dark:border-hairline-dark-soft shrink-0 z-10">
                {/* Page Navigation Group */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                    disabled={pageNumber <= 1 || isLoading}
                    className="p-1.5 rounded-lg border border-hairline-light dark:border-hairline-dark text-body dark:text-on-dark-soft hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
                    title="Halaman Sebelumnya (Panah Kiri)"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  <div className="px-3 py-1 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg border border-hairline-light-soft dark:border-hairline-dark-soft font-mono text-[11px] font-semibold text-ink-heading dark:text-on-dark tracking-tight min-w-[110px] text-center">
                    {numPages ? (
                      <>
                        Halaman <span className="font-bold text-accent dark:text-accent-on-dark">{pageNumber}</span> / <span>{numPages}</span>
                      </>
                    ) : (
                      'Memuat...'
                    )}
                  </div>

                  <button
                    onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages || 1))}
                    disabled={!numPages || pageNumber >= numPages || isLoading}
                    className="p-1.5 rounded-lg border border-hairline-light dark:border-hairline-dark text-body dark:text-on-dark-soft hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
                    title="Halaman Selanjutnya (Panah Kanan)"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Vertical Divider */}
                <div className="h-3.5 w-px bg-hairline-light dark:bg-hairline-dark mx-1.5 sm:mx-2" />

                {/* Zoom Control Group */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={zoomOut}
                    disabled={scale <= 0.5 || isLoading}
                    className="p-1.5 rounded-lg border border-hairline-light dark:border-hairline-dark text-body dark:text-on-dark-soft hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
                    title="Perkecil (-)"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={resetZoom}
                    disabled={isLoading}
                    className="px-2.5 py-1 bg-surface-light-raised hover:bg-surface-light dark:bg-surface-dark-elevated dark:hover:bg-surface-dark rounded-lg border border-hairline-light-soft dark:border-hairline-dark-soft font-mono text-[11px] font-bold text-ink-heading dark:text-on-dark min-w-[50px] text-center transition-all cursor-pointer"
                    title="Reset Zoom ke 100%"
                  >
                    {Math.round(scale * 100)}%
                  </button>

                  <button
                    onClick={zoomIn}
                    disabled={scale >= 2.5 || isLoading}
                    className="p-1.5 rounded-lg border border-hairline-light dark:border-hairline-dark text-body dark:text-on-dark-soft hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
                    title="Perbesar (+)"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>

                  {/* Fit to Width Button */}
                  <button
                    onClick={toggleFitToWidth}
                    disabled={isLoading}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      fitToWidth
                        ? 'bg-accent-soft dark:bg-accent/15 border-accent-border/60 dark:border-accent/40 text-accent dark:text-accent-on-dark'
                        : 'border-hairline-light dark:border-hairline-dark text-body dark:text-on-dark-soft hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated'
                    }`}
                    title="Sesuaikan Lebar Halaman"
                  >
                    <Maximize className="w-3 h-3" />
                    <span className="hidden sm:inline text-[11px]">Fit Lebar</span>
                  </button>
                </div>
              </div>
            )}

            {/* 3. PDF VIEWER CANVAS AREA */}
            <div
              ref={containerRef}
              className="flex-1 relative bg-canvas-light dark:bg-canvas-dark overflow-auto p-4 sm:p-6 flex items-flex-start justify-center"
            >
              {!isValidFileUrl ? (
                /* No file state */
                <div className="m-auto flex flex-col items-center justify-center gap-4 p-8 text-center max-w-md">
                  <div className="w-16 h-16 bg-warning-soft dark:bg-warning/15 border border-warning-border/50 dark:border-warning/30 rounded-2xl flex items-center justify-center text-warning dark:text-warning-on-dark">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-ink-heading dark:text-on-dark">
                      File Tidak Tersedia
                    </p>
                    <p className="text-xs text-muted dark:text-on-dark-muted leading-relaxed">
                      Dokumen ini berasal dari sinkronisasi otomatis dan tidak memiliki berkas PDF yang dapat ditampilkan.
                    </p>
                  </div>
                </div>
              ) : loadError ? (
                /* Load error state */
                <div className="m-auto flex flex-col items-center justify-center gap-4 p-8 text-center max-w-md">
                  <div className="w-16 h-16 bg-error-soft dark:bg-error/15 border border-error-border/50 dark:border-error/30 rounded-2xl flex items-center justify-center text-error dark:text-error-on-dark">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div className="space-y-1 mb-2">
                    <p className="text-sm font-bold text-ink-heading dark:text-on-dark">
                      Gagal Memuat Dokumen
                    </p>
                    <p className="text-xs text-muted dark:text-on-dark-muted leading-relaxed">
                      Berkas PDF tidak dapat dimuat secara langsung. Anda dapat mencoba lagi atau membukanya di tab baru.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        setLoadError(false);
                        setIsLoading(true);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-surface-light-raised hover:bg-surface-light dark:bg-surface-dark-elevated dark:hover:bg-surface-dark border border-hairline-light dark:border-hairline-dark text-ink-heading dark:text-on-dark rounded-lg text-xs font-semibold transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Coba Lagi
                    </button>
                    <a
                      href={resolvedUrl!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-ink hover:bg-ink-hover dark:bg-on-dark dark:hover:bg-on-dark-soft text-on-ink dark:text-ink rounded-lg text-xs font-semibold transition-all shadow-xs cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Buka di Tab Baru
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center my-auto min-h-full py-4">
                  {/* Loading Overlay */}
                  {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-20 bg-canvas-light/85 dark:bg-canvas-dark/85 backdrop-blur-xs">
                      <div className="w-9 h-9 border-2 border-hairline-light dark:border-hairline-dark border-t-accent dark:border-t-accent-on-dark rounded-full animate-spin" />
                      <p className="font-mono text-[11px] font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider">
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
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="bg-white rounded-xl shadow-xl shadow-black/5 dark:shadow-black/60 border border-hairline-light dark:border-hairline-dark overflow-hidden"
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
            <div className="flex items-center justify-between px-5 sm:px-6 py-2.5 border-t border-hairline-light dark:border-hairline-dark bg-surface-light-raised/60 dark:bg-surface-dark-elevated/60 shrink-0">
              <p className="text-[11px] font-mono text-muted dark:text-on-dark-muted">
                PentaDosen Academic Document Viewer
              </p>
              <p className="text-[10px] font-mono text-muted dark:text-on-dark-muted">
                Tekan <kbd className="px-1.5 py-0.5 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded text-[9px] font-bold text-ink-heading dark:text-on-dark">ESC</kbd> untuk menutup
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

