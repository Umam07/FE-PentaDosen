import React from 'react';
import { Users, BookOpen, Globe } from 'lucide-react';
import type { SyncSummaryCardsProps } from '../types/adminSync.types';

export default function SyncSummaryCards({
  totalLecturers,
  scholarConnected,
  scopusConnected
}: SyncSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-zinc-900 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-none rounded-3xl border border-gray-100 dark:border-zinc-800 p-6 flex items-center justify-between group transition-all hover:border-gray-200 dark:hover:border-zinc-700 hover:shadow-sm">
         <div>
            <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Database Dosen</p>
            <p className="text-3xl font-black text-gray-900 dark:text-zinc-100 mt-1">{totalLecturers}</p>
         </div>
         <div className="p-4 bg-primary-50 dark:bg-primary-950/30 rounded-2xl text-primary-600 dark:text-primary-400 border border-primary-100/50 dark:border-primary-900/20">
            <Users className="h-6 w-6" />
         </div>
      </div>
      
      <div className="bg-white dark:bg-zinc-900 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-none rounded-3xl border border-gray-100 dark:border-zinc-800 p-6 flex items-center justify-between group transition-all hover:border-gray-200 dark:hover:border-zinc-700 hover:shadow-sm">
         <div>
            <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Scholar Connected</p>
            <p className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">{scholarConnected}</p>
         </div>
         <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-2xl text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/20">
            <BookOpen className="h-6 w-6" />
         </div>
      </div>
      
      <div className="bg-white dark:bg-zinc-900 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-none rounded-3xl border border-gray-100 dark:border-zinc-800 p-6 flex items-center justify-between group transition-all hover:border-gray-200 dark:hover:border-zinc-700 hover:shadow-sm">
         <div>
            <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Scopus Connected</p>
            <p className="text-3xl font-black text-orange-600 dark:text-orange-400 mt-1">{scopusConnected}</p>
         </div>
         <div className="p-4 bg-orange-50 dark:bg-orange-950/30 rounded-2xl text-orange-600 dark:text-orange-400 border border-orange-100/50 dark:border-orange-900/20">
            <Globe className="h-6 w-6" />
         </div>
      </div>
    </div>
  );
}
