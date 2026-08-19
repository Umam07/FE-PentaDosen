import React from 'react';
import { MetricTileProps } from '../types/konfigurasi.types';

export const MetricTile: React.FC<MetricTileProps> = ({ label, value }) => {
  return (
    <div className="rounded-xl border border-hairline-light bg-surface-light-raised p-3.5 text-center dark:border-hairline-dark dark:bg-surface-dark-elevated flex flex-col justify-center items-center gap-1">
      <span className="text-[10px] font-bold uppercase tracking-wider text-muted dark:text-on-dark-muted">
        {label}
      </span>
      <span className="text-xl font-extrabold font-mono tabular-nums text-ink-heading dark:text-on-dark">
        {value !== undefined && value !== null ? Number(value).toLocaleString('id-ID') : 0}
      </span>
    </div>
  );
};

