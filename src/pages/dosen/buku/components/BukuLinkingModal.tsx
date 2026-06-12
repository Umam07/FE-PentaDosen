import React, { useState } from 'react';
import { Link, ChevronRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden"
          >
            <div className="p-8 lg:p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl text-indigo-600">
                  <Link className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Pilih Asal Penelitian</h3>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">Hubungkan buku ini dengan penelitian yang relevan</p>
                </div>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {approvedResearch.length > 0 ? (
                  approvedResearch.map((res: any) => (
                    <button
                      key={res.id}
                      disabled={isLinkingLoading}
                      onClick={() => handleLinkToResearchInternal(res.id)}
                      className="w-full text-left p-5 rounded-2xl border-2 border-gray-50 dark:border-zinc-800 hover:border-indigo-500 hover:bg-indigo-50/30 transition-all group"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="min-w-0">
                          <p className="text-xs font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight group-hover:text-indigo-700 dark:group-hover:text-indigo-300 leading-tight">
                            {res.judul_penelitian}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">{res.tahun}</span>
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 text-gray-500 text-[8px] font-black uppercase tracking-widest rounded-md">{res.program}</span>
                          </div>
                        </div>
                        <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg text-gray-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 group-hover:text-indigo-600 transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <AlertCircle className="w-10 h-10 text-gray-200 mx-auto mb-4" />
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Tidak ada penelitian yang disetujui</p>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-50 dark:border-zinc-800">
                <button 
                  onClick={onClose}
                  className="w-full py-4 bg-gray-50 dark:bg-zinc-800 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all"
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
