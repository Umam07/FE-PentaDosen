import React from 'react';
import { MetricTileProps } from '../types/konfigurasi.types';

export const MetricTile: React.FC<MetricTileProps> = ({ label, value }) => {
  return (
    <div className="rounded-xl border border-slate-200/60 bg-slate-50/80 p-3.5 text-center dark:border-slate-800/60 dark:bg-slate-800/40 flex flex-col justify-center items-center gap-1">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <span className="text-xl font-extrabold tabular-nums text-slate-900 dark:text-white">
        {value !== undefined && value !== null ? Number(value).toLocaleString('id-ID') : 0}
      </span>
    </div>
  );
};

