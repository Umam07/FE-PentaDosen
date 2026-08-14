import React from 'react';
import { motion, Variants } from 'framer-motion';
import { TrendingUp, Zap, Database } from 'lucide-react';

interface StatItem {
  label: string;
  val: number;
  icon: React.ComponentType<any>;
  color: string;
  bg: string;
}

interface PerformanceSummaryProps {
  stats: StatItem[];
  grandTotal: number;
  internalPoints: number;
  apiPointsTotal: number;
}

export default function PerformanceSummary({
  stats,
  grandTotal,
  internalPoints,
  apiPointsTotal,
}: PerformanceSummaryProps) {
  const internalPct = grandTotal > 0 ? (internalPoints / grandTotal) * 100 : 0;
  const apiPct = grandTotal > 0 ? (apiPointsTotal / grandTotal) * 100 : 0;

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* ─── Hero Row: Title + Grand Total ─── */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 shadow-sm p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8"
      >
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-primary-500/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 right-1/3 w-48 h-48 rounded-full bg-amber-500/5 blur-2xl" />

        {/* Left: Heading */}
        <div className="relative z-10">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.22em] mb-2">
            Ringkasan Performa
          </p>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
            Dashboard{' '}
            <span className="text-primary-600">Performa</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mt-3 max-w-xs leading-relaxed">
            Akumulasi seluruh poin dari semua dokumen yang telah diverifikasi
          </p>
        </div>

        {/* Right: Grand Total Score */}
        <div className="relative z-10 flex-shrink-0 flex flex-col items-center lg:items-end gap-1">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.22em]">
            Total Poin KPI
          </p>
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.5, ease: 'backOut' }}
            className="text-6xl font-black text-slate-900 dark:text-white leading-none tabular-nums"
          >
            {grandTotal.toLocaleString()}
          </motion.p>
          <div className="flex items-center gap-1.5 mt-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">
              Kumulatif Semua Sumber
            </span>
          </div>
        </div>
      </motion.div>

      {/* ─── Stat Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="group relative overflow-hidden flex items-center gap-4 px-6 py-5 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary-200/60 dark:hover:border-primary-800/60 transition-all duration-300"
          >
            {/* Subtle gradient overlay on hover */}
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary-50/40 to-transparent dark:from-primary-950/20 rounded-[2rem]" />

            <div
              className={`relative z-10 w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center flex-shrink-0 shadow-sm`}
            >
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>

            <div className="relative z-10 min-w-0">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.18em] leading-none mb-1.5 truncate">
                {stat.label}
              </p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="text-2xl font-black text-slate-900 dark:text-white leading-none tabular-nums"
              >
                {stat.val.toLocaleString()}
              </motion.p>
            </div>

            {/* Right accent line */}
            <div className={`absolute right-0 top-4 bottom-4 w-0.5 rounded-full ${stat.bg} opacity-60 group-hover:opacity-100 transition-opacity`} />
          </motion.div>
        ))}
      </div>

      {/* ─── Contribution Visualization ─── */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 p-8 shadow-sm"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Kontribusi Poin
            </h3>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Perbandingan sumber poin Anda
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                Internal
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                API / Eksternal
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Stacked Progress Bar */}
          <div className="relative">
            <div className="relative h-5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${internalPct}%` }}
                transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 }}
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 relative"
              >
                {internalPct > 8 && (
                  <span className="absolute inset-0 flex items-center justify-center text-[7px] font-black text-white uppercase tracking-widest">
                    {internalPct.toFixed(0)}%
                  </span>
                )}
              </motion.div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${apiPct}%` }}
                transition={{ duration: 0.9, ease: 'easeOut', delay: 0.45 }}
                className="h-full bg-gradient-to-r from-blue-400 to-blue-500 relative"
              >
                {apiPct > 8 && (
                  <span className="absolute inset-0 flex items-center justify-center text-[7px] font-black text-white uppercase tracking-widest">
                    {apiPct.toFixed(0)}%
                  </span>
                )}
              </motion.div>
            </div>

            {/* Tick marks */}
            <div className="flex justify-between mt-1.5 px-0.5">
              {[0, 25, 50, 75, 100].map((tick) => (
                <span key={tick} className="text-[7px] font-bold text-slate-300 dark:text-slate-600">
                  {tick}%
                </span>
              ))}
            </div>
          </div>

          {/* Contribution Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Internal */}
            <motion.div
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="relative overflow-hidden p-5 rounded-2xl bg-amber-500/5 border border-amber-500/15 hover:border-amber-500/30 transition-colors"
            >
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />
              <div className="relative z-10 flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Database className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <p className="text-[8px] font-black text-amber-600 uppercase tracking-widest">
                  Internal Share
                </p>
              </div>
              <div className="relative z-10 flex items-end justify-between">
                <div>
                  <p className="text-3xl font-black text-amber-700 dark:text-amber-400 leading-none tabular-nums">
                    {internalPct.toFixed(1)}
                    <span className="text-lg ml-0.5">%</span>
                  </p>
                  <p className="text-[8px] font-bold text-amber-500/70 uppercase tracking-widest mt-1">
                    {internalPoints.toLocaleString()} poin
                  </p>
                </div>
                {/* Mini vertical bar */}
                <div className="relative w-2 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-full overflow-hidden self-end">
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: internalPct / 100 }}
                    transition={{ duration: 0.9, ease: 'easeOut', delay: 0.5 }}
                    className="absolute bottom-0 left-0 right-0 bg-amber-500 rounded-full origin-bottom"
                    style={{ height: '100%' }}
                  />
                </div>
              </div>
            </motion.div>

            {/* API */}
            <motion.div
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="relative overflow-hidden p-5 rounded-2xl bg-blue-500/5 border border-blue-500/15 hover:border-blue-500/30 transition-colors"
            >
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-400/10 rounded-full blur-xl pointer-events-none" />
              <div className="relative z-10 flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest">
                  API / Eksternal Share
                </p>
              </div>
              <div className="relative z-10 flex items-end justify-between">
                <div>
                  <p className="text-3xl font-black text-blue-700 dark:text-blue-400 leading-none tabular-nums">
                    {apiPct.toFixed(1)}
                    <span className="text-lg ml-0.5">%</span>
                  </p>
                  <p className="text-[8px] font-bold text-blue-500/70 uppercase tracking-widest mt-1">
                    {apiPointsTotal.toLocaleString()} poin
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
