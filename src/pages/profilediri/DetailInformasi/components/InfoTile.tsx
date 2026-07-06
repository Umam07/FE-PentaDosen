import React from 'react';
import { InfoTileProps } from '../types/detailInformasi.types';

const EMPTY_VALUE = '-';

export const InfoTile: React.FC<InfoTileProps> = ({ label, value, icon: Icon }) => {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
          {label}
        </p>
        <p
          className="mt-0.5 truncate text-sm font-black text-slate-900 dark:text-white"
          title={value || EMPTY_VALUE}
        >
          {value || EMPTY_VALUE}
        </p>
      </div>
    </div>
  );
};
