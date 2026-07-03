import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { XCircle, History, Loader2 } from 'lucide-react';

export interface DocumentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  docId: number | null;
  title: string;
}

export function DocumentHistoryModal({ isOpen, onClose, docId, title }: DocumentHistoryModalProps) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && docId) {
      setLoading(true);
      fetch(`/api/documents/${docId}/history`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setHistory(data.history || []);
          }
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, docId]);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-950/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-gray-100 dark:border-zinc-800"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-xl">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Riwayat Dokumen</h3>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5 line-clamp-1">{title}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Memuat Riwayat...</p>
                </div>
              ) : history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <History className="w-12 h-12 text-gray-200 dark:text-zinc-700 mb-4" />
                  <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Belum ada riwayat tercatat.</p>
                </div>
              ) : (
                <div className="relative pl-4 space-y-6 before:absolute before:inset-y-2 before:left-[19px] before:w-0.5 before:bg-gray-100 dark:before:bg-zinc-800">
                  {history.map((item, idx) => (
                    <div key={item.id} className="relative flex items-start gap-5">
                      <div className="absolute -left-[9px] mt-1.5 w-3 h-3 rounded-full bg-primary-500 ring-4 ring-white dark:ring-zinc-900 z-10" />
                      <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-2xl p-4 flex-1 border border-gray-100 dark:border-zinc-800">
                        <p className="text-sm font-black text-gray-900 dark:text-zinc-100">{item.action}</p>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 gap-2 sm:gap-0">
                          <span className="text-xs text-gray-500 dark:text-zinc-400 font-bold">Oleh: {item.user?.name}</span>
                          <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider bg-white dark:bg-zinc-900 px-2 py-1 rounded-md border border-gray-100 dark:border-zinc-800 inline-block w-fit">
                            {new Date(item.created_at).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {item.notes && (
                          <div className="mt-3 text-xs p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/30">
                            <span className="font-black uppercase tracking-wider text-[10px] block mb-1">Catatan Penolakan:</span> 
                            <span className="font-medium">{item.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
