import React from 'react';
import { Users } from 'lucide-react';

export default function LecturerEmpty() {
  return (
    <div className="col-span-full py-20 text-center space-y-4">
      <div className="mx-auto w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center border border-dashed border-slate-300 dark:border-slate-700">
        <Users className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest">Dosen Tidak Ditemukan</h3>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-tight">Coba gunakan kata kunci pencarian atau filter yang berbeda.</p>
    </div>
  );
}
