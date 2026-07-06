import React from 'react';
import { Users } from 'lucide-react';

export default function LecturersEmpty() {
  return (
    <div className="p-20 text-center flex flex-col items-center">
      <div className="w-20 h-20 bg-gray-50 dark:bg-zinc-800 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
        <Users className="w-10 h-10 text-gray-200" />
      </div>
      <p className="text-sm font-black text-gray-400 uppercase tracking-widest italic tracking-[0.2em]">Data Tidak Ditemukan</p>
    </div>
  );
}
