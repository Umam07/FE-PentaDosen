import React from 'react';
import { MetricTileProps } from '../types/konfigurasi.types';

export const MetricTile: React.FC<MetricTileProps> = ({ label, value, icon: Icon }) => {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
          {label}
        </p>
        <Icon className="h-4 w-4 text-slate-400 dark:text-slate-600" />
      </div>
      <p className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">{value ?? 0}</p>
    </div>
  );
};
