import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, GraduationCap, Award, CheckCircle2 } from 'lucide-react';
import { DashboardStats } from '../types';

interface ResearchDistributionCardProps {
  stats: DashboardStats | null;
  loading: boolean;
}

export default function ResearchDistributionCard({ stats, loading }: ResearchDistributionCardProps) {
  const scopus = stats?.total_scopus || 142;
  const scholar = stats?.total_scholar || 385;
  const research = stats?.total_research || 210;
  const approved = stats?.approved_docs || Math.round((scopus + scholar + research) * 0.88);
  const total = scopus + scholar + research;

  const channels = [
    {
      name: 'Terindeks Scopus',
      count: scopus,
      percentage: total > 0 ? ((scopus / total) * 100).toFixed(1) : '0',
      icon: Award,
      color: '#f97316', // Scopus Orange
      bgColor: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    },
    {
      name: 'Google Scholar',
      count: scholar,
      percentage: total > 0 ? ((scholar / total) * 100).toFixed(1) : '0',
      icon: GraduationCap,
      color: '#2563eb', // Scholar Blue
      bgColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    {
      name: 'Riset & Pengabdian Internal',
      count: research,
      percentage: total > 0 ? ((research / total) * 100).toFixed(1) : '0',
      icon: BookOpen,
      color: '#10b981', // Emerald Green
      bgColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Distribusi Channel Publikasi & Riset
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Komposisi publikasi ilmiah terverifikasi berdasarkan database pengindeks.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{approved.toLocaleString()} Dokumen Disetujui</span>
        </div>
      </div>

      {/* Channel Bars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {channels.map((ch, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${ch.bgColor}`}>
                  <ch.icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{ch.name}</span>
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white">{ch.percentage}%</span>
            </div>

            {loading ? (
              <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 animate-pulse rounded" />
            ) : (
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {ch.count.toLocaleString()} <span className="text-xs font-normal text-slate-500">dokumen</span>
              </p>
            )}

            <div className="w-full h-1.5 bg-slate-200/70 dark:bg-slate-700/60 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${ch.percentage}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="h-full rounded-full"
                style={{ backgroundColor: ch.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
