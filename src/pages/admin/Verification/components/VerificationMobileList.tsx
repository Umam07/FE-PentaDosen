import React from 'react';
import { FileText, CalendarDays, Beaker, Eye, ShieldCheck, X } from 'lucide-react';
import { VerificationMobileListProps } from '../types/verification.types';

export default function VerificationMobileList({
  activeTab,
  items,
  actionLoading,
  userRole,
  onVerify,
  onRejectStart,
  onPreview
}: VerificationMobileListProps) {
  return (
    <div className="md:hidden divide-y divide-gray-50 dark:divide-zinc-800/50">
      {items.map((item: any) => (
        <div key={item.id} className="p-6 space-y-5 bg-white dark:bg-zinc-900">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <p className="text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight line-clamp-1">
                {activeTab === 'penelitian' ? item.user?.name : (item.user?.name || item.user_name)}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Dosen Pengaju</p>
                {userRole === 'admin penelitian' && (
                  <span className="text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tighter bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 border border-indigo-100/50">
                    FAKULTAS VERIFIED
                  </span>
                )}
              </div>
            </div>
            <span className="text-[9px] font-black text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-xl border border-primary-100 dark:border-primary-900/30 uppercase tracking-widest shadow-sm">
              {activeTab === 'penelitian' ? item.program : item.category}
            </span>
          </div>

          <div className="flex items-center gap-4 bg-gray-50/50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-gray-100/50 dark:border-zinc-800/50">
            <div className="p-3 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700 text-gray-400">
              {activeTab === 'penelitian' ? <Beaker className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-gray-800 dark:text-zinc-200 uppercase tracking-tight line-clamp-2 leading-snug">
                {activeTab === 'penelitian' ? item.judul_penelitian : item.title}
              </p>
              <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 mt-2 uppercase tracking-widest flex items-center">
                <CalendarDays className="w-3.5 h-3.5 mr-1.5 text-primary-500/70" />
                {activeTab === 'penelitian' ? new Date(item.created_at).toLocaleDateString('id-ID') : (item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID') : '-')}
              </p>
            </div>
          </div>

          {activeTab === 'penelitian' && (
            <div className="grid grid-cols-2 gap-3">
               <div className="bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                  <p className="text-[8px] font-black uppercase text-emerald-600 tracking-widest mb-1.5 leading-none">Dana Disetujui</p>
                  <p className="text-sm font-black text-emerald-900 dark:text-emerald-100">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.dana_disetujui)}
                  </p>
               </div>
               <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-2xl border border-blue-100/50 dark:border-blue-900/30">
                  <p className="text-[8px] font-black uppercase text-blue-600 tracking-widest mb-1.5 leading-none">Skema/Fokus</p>
                  <p className="text-xs font-black text-blue-900 dark:text-blue-100 truncate">{item.skema}</p>
               </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-zinc-800">
            {/* Preview file button */}
            {(() => {
              const fileUrl = item.file_url;
              const judul = activeTab === 'penelitian' ? item.judul_penelitian : item.title;
              const kategori = activeTab === 'penelitian' ? item.program : item.category;
              return fileUrl && fileUrl !== '-' && fileUrl !== '' ? (
                <button
                  onClick={() => onPreview({ fileUrl, title: judul, category: kategori })}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-600 text-primary-600 dark:text-primary-400 hover:text-white rounded-xl border border-primary-100 dark:border-primary-900/30 hover:border-primary-600 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 whitespace-nowrap"
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </button>
              ) : (
                <div className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gray-50 dark:bg-zinc-800 text-gray-300 dark:text-zinc-600 rounded-xl border border-gray-100 dark:border-zinc-700 text-[10px] font-black uppercase tracking-widest cursor-not-allowed italic whitespace-nowrap">
                  <FileText className="h-4 w-4" />
                  No File
                </div>
              );
            })()}
            
            {/* Approve Button */}
            <button
              onClick={() => onVerify(item.id, 'Approved')}
              disabled={actionLoading === item.id}
              className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50 whitespace-nowrap"
            >
              {actionLoading === item.id ? (
                <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <ShieldCheck className="h-4 w-4" />
              )}
              Approve
            </button>

            {/* Reject Button */}
            <button
              onClick={() => {
                onRejectStart({
                  id: item.id,
                  title: activeTab === 'penelitian' ? item.judul_penelitian : item.title,
                  type: activeTab === 'penelitian' ? 'research' : 'documents'
                });
              }}
              disabled={actionLoading === item.id}
              className="p-2.5 bg-red-50 dark:bg-red-950/20 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all border border-red-100 dark:border-red-900/30 hover:border-red-500 active:scale-95 disabled:opacity-50 shrink-0"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
