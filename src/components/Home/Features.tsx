import { motion } from 'motion/react';
import { LineChart, Shield, Zap, RefreshCw, FileText, CheckCircle } from 'lucide-react';
import React from 'react';

interface FeatureCardProps {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}

function FeatureCard({ className = "", children, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease: [0.25, 1, 0.5, 1] }}
      whileHover={{ y: -4 }}
      className={`bg-white dark:bg-slate-900 rounded-2xl p-7 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 shadow-sm hover:shadow-md cursor-pointer group transition-all duration-200 relative overflow-hidden flex ${className}`}
    >
      <div className="relative z-10 flex flex-col h-full w-full">
        {children}
      </div>
    </motion.div>
  );
}

export default function Features() {
  return (
    <section id="features" className="py-20 md:py-32 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Structural Line Grid Pattern (No glows, no gradients) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
        <div className="h-full w-full bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4"
          >
            Platform Terpadu Kinerja <span className="text-primary-600 dark:text-primary-400">Penta Dosen</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base md:text-lg font-medium text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl"
          >
            Dirancang untuk memfasilitasi integrasi, verifikasi, dan analisis data Tri Dharma perguruan tinggi dalam satu dashboard modern.
          </motion.p>
        </div>

        {/* --- BENTO GRID START --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 relative z-10">

          {/* Card 1: Scopus Sync (Span 8) */}
          <FeatureCard className="md:col-span-8 md:flex-row items-center justify-between gap-6">
            <div className="max-w-md w-full md:w-1/2">
              <div className="w-11 h-11 bg-primary-600 text-white rounded-xl flex items-center justify-center mb-5 shadow-sm transform group-hover:scale-105 transition-transform">
                <LineChart className="w-5 h-5" />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2.5">Sinkronisasi Publikasi</h3>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">Sinkronisasi otomatis data publikasi, sitasi, dan H-Index dosen langsung dari API Scopus dan Google Scholar.</p>
            </div>
            <div className="relative w-full md:w-1/2 flex items-center justify-center h-40 mt-4 md:mt-0">
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute right-0 top-2 w-44 bg-slate-50 dark:bg-slate-800 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700 z-20 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-md bg-primary-600 text-white flex items-center justify-center font-bold text-[9px]">S</div>
                  <div><div className="text-[8px] font-mono font-bold text-slate-400">Scholar</div><div className="text-[10px] font-bold text-slate-800 dark:text-slate-200">Citations</div></div>
                </div>
                <div className="text-base font-mono font-bold text-slate-900 dark:text-white mb-1.5">+248 <span className="text-[9px] text-emerald-600 font-bold">▲ 12%</span></div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden"><div className="w-3/4 h-full bg-primary-600 rounded-full"></div></div>
              </motion.div>
              <motion.div 
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute right-8 top-16 w-40 bg-slate-100 dark:bg-slate-850 rounded-xl p-3 border border-slate-200 dark:border-slate-700 z-10 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded-md bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center font-bold text-[8px]">Sc</div>
                  <div className="text-[10px] font-bold text-slate-800 dark:text-slate-200">Scopus Index</div>
                </div>
                <div className="text-sm font-mono font-bold text-slate-900 dark:text-white">12 H-Index</div>
              </motion.div>
            </div>
          </FeatureCard>

          {/* Card 2: Validasi (Span 4) */}
          <FeatureCard className="md:col-span-4 flex-col justify-between" delay={0.1}>
            <div>
              <div className="w-11 h-11 bg-emerald-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Verifikasi Berjenjang</h3>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed mb-4">Sistem persetujuan berjenjang dari tingkat Fakultas hingga LPPM untuk menjamin validitas portofolio akademik.</p>
            </div>
            <div className="relative h-16 w-full mt-auto">
              <div className="absolute inset-x-0 bottom-2 flex items-center justify-between z-10">
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-mono font-bold text-xs">1</div>
                  <span className="text-[9px] font-mono font-bold text-slate-400 mt-1">Status</span>
                </div>
                <div className="h-0.5 flex-grow bg-emerald-200 dark:bg-emerald-950 relative mx-2">
                  <motion.div className="absolute inset-x-0 h-full bg-emerald-600" animate={{ width: ['0%', '100%'] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }} />
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs"><CheckCircle className="w-3.5 h-3.5" /></div>
                  <span className="text-[9px] font-mono font-bold text-slate-400 mt-1">Verified</span>
                </div>
              </div>
            </div>
          </FeatureCard>

          {/* Card 3: Visualisasi (Span 4, row-span 2) */}
          <FeatureCard className="md:col-span-4 flex-col md:row-span-2" delay={0.2}>
            <div className="relative flex-grow flex items-center justify-center h-44 mb-6 mt-2">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute w-32 h-32 rounded-full border-4 border-blue-200 dark:border-blue-900/50 border-t-blue-600" />
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute w-24 h-24 rounded-full border-4 border-slate-200 dark:border-slate-800 border-r-primary-500" />
              <div className="absolute flex flex-col items-center">
                <div className="text-2xl font-mono font-bold text-slate-900 dark:text-white">85%</div>
                <p className="text-[9px] font-mono font-bold text-slate-400 tracking-wider">TRI DHARMA</p>
              </div>
            </div>
            <div className="mt-auto">
              <div className="w-11 h-11 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Analisis &amp; Metrik</h3>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">Visualisasi performa riset dan tren publikasi dosen melalui diagram interaktif dan grafik metrik sitasi.</p>
            </div>
          </FeatureCard>

          {/* Card 4: Data Vault (Span 8) */}
          <FeatureCard className="md:col-span-8 md:flex-row justify-between items-center gap-6" delay={0.3}>
            <div className="relative w-full md:w-1/2 flex items-center h-28 md:h-full justify-center">
              <div className="relative w-full flex items-center justify-center">
                <motion.div whileHover={{ x: -6 }} className="absolute w-26 h-32 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 shadow-sm z-10 flex flex-col justify-end p-3">
                  <div className="w-full h-1 bg-amber-500 rounded"></div>
                </motion.div>
                <motion.div whileHover={{ x: 6, rotate: 3 }} className="absolute w-26 h-32 bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 shadow-md z-20 flex flex-col p-3">
                  <FileText className="w-5 h-5 text-amber-600 mb-2" />
                  <div className="text-[9px] font-mono font-bold text-slate-800 dark:text-slate-200 break-all">Jurnal_Q1_2026.pdf</div>
                  <div className="text-[8px] font-mono text-slate-400 mt-1">2.4 MB</div>
                </motion.div>
              </div>
            </div>
            <div className="max-w-md w-full md:w-1/2">
              <div className="w-11 h-11 bg-amber-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2.5">Arsip Digital Aman</h3>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">Pengarsipan dokumen digital aman untuk HKI, buku, penelitian, dan pengabdian masyarakat yang siap diunduh.</p>
            </div>
          </FeatureCard>

          {/* Card 5: Performa (Span 4) */}
          <FeatureCard className="md:col-span-4 flex-col justify-between" delay={0.4}>
            <div>
              <div className="w-11 h-11 bg-rose-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Akses Responsif</h3>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">Desain antarmuka responsif yang memudahkan akses dashboard dari perangkat mobile maupun desktop.</p>
            </div>
            <div className="relative h-16 w-full flex items-end justify-center mt-3">
              <motion.div whileHover={{ y: -3 }} className="w-12 h-20 bg-slate-900 dark:bg-slate-800 rounded-t-lg border-x-2 border-t-2 border-slate-700 z-20 flex flex-col p-1">
                <div className="w-full h-full bg-rose-900/30 rounded-t-md" />
              </motion.div>
              <motion.div whileHover={{ y: -3 }} className="absolute bottom-0 right-6 w-20 h-14 bg-slate-900 dark:bg-slate-800 rounded-t-lg border-x-2 border-t-2 border-slate-700 z-10 flex p-1">
                <div className="w-full h-full bg-rose-900/20 rounded-t-md" />
              </motion.div>
            </div>
          </FeatureCard>

          {/* Card 6: Keamanan (Span 4) */}
          <FeatureCard className="md:col-span-4 flex-col justify-between" delay={0.5}>
            <div>
              <div className="w-11 h-11 bg-violet-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Autentikasi Kampus</h3>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">Sistem login terintegrasi Active Directory kampus untuk kemudahan akses dan keamanan data pengguna.</p>
            </div>
            <div className="relative h-20 w-full flex items-center justify-center mt-2">
              <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.1, 0.4] }} transition={{ duration: 3, repeat: Infinity }} className="absolute w-14 h-14 rounded-full border border-violet-500" />
              <div className="z-10 bg-violet-600 text-white p-2.5 rounded-xl shadow-sm"><Shield className="w-5 h-5" /></div>
            </div>
          </FeatureCard>

        </div>
        {/* --- BENTO GRID END --- */}
      </div>
    </section>
  );
}