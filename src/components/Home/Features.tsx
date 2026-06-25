import { motion, useMotionValue, useMotionTemplate } from 'motion/react';
import { LineChart, Shield, Zap, RefreshCw, FileText, CheckCircle } from 'lucide-react';
import React from 'react';

interface FeatureCardProps {
  className?: string;
  lightColor: string;
  children: React.ReactNode;
  delay?: number;
}

function FeatureCard({ className = "", lightColor, children, delay = 0 }: FeatureCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      style={{ opacity: 0 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay, ease: [0.25, 1, 0.5, 1] }}
      onMouseMove={handleMouseMove}
      whileHover={{ y: -6, transition: { duration: 0.2, ease: "easeOut" } }}
      // Perbaikan: Mengganti transition-all menjadi transition-colors transition-shadow
      className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-8 border border-white/60 dark:border-slate-800/50 hover:border-transparent cursor-pointer shadow-[0_12px_40px_-15px_rgba(0,0,0,0.03)] dark:shadow-slate-950/40 hover:shadow-[0_20px_50px_-12px_rgba(30,27,75,0.08)] group transition-colors transition-shadow duration-300 relative overflow-hidden flex ${className}`}
    >
      {/* Spotlight Effect */}
      <motion.div
        style={{
          background: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, ${lightColor}, transparent)`,
        }}
        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"
      />

      <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-gray-50/40 dark:from-slate-900/40 to-transparent pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col h-full w-full">
        {children}
      </div>
    </motion.div>
  );
}

export default function Features() {
  return (
    <section id="features" className="py-24 md:py-36 bg-white dark:bg-slate-950 relative overflow-hidden">
      {/* Dynamic Background Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.45, 0.3],
            x: [0, 60, 0],
            y: [0, -40, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-12 -right-12 w-[400px] h-[400px] bg-primary-100/60 dark:bg-primary-900/20 rounded-full filter blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.35, 0.2],
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute -bottom-24 -left-24 w-[500px] h-[500px] bg-emerald-100/40 dark:bg-emerald-900/15 rounded-full filter blur-[100px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 flex flex-col items-center">

          <motion.h2
            style={{ opacity: 0 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-6"
          >
            Platform Terpadu <br />
            Kinerja <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">Penta Dosen</span>
          </motion.h2>
          
          <motion.p
            style={{ opacity: 0 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base md:text-lg font-bold text-gray-500 dark:text-gray-400 leading-relaxed"
          >
            Dirancang untuk memfasilitasi integrasi, verifikasi, dan analisis data Tri Dharma perguruan tinggi dalam satu dashboard modern.
          </motion.p>
        </div>

        {/* --- BENTO GRID START --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">

          {/* Card 1: Scopus Sync (Span 8) */}
          <FeatureCard className="md:col-span-8 md:flex-row items-center justify-between gap-6" lightColor="rgba(99, 102, 241, 0.15)">
            <div className="max-w-md w-full md:w-1/2">
              <div className={`w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                <LineChart className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-3">Sinkronisasi Publikasi</h3>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 leading-relaxed">Sinkronisasi otomatis data publikasi, sitasi, dan H-Index dosen langsung dari API Scopus dan Google Scholar.</p>
            </div>
            <div className="relative w-full md:w-1/2 flex items-center justify-center h-44 mt-4 md:mt-0">
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute right-0 top-4 w-44 bg-white/90 dark:bg-slate-800/90 rounded-2xl p-3 shadow-xl border border-white dark:border-slate-700 border-t-primary-50 dark:border-t-primary-900/50 z-20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center font-bold text-[9px] text-primary-600 dark:text-primary-400">S</div>
                  <div><div className="text-[8px] font-bold text-gray-400">Scholar</div><div className="text-[10px] font-black text-gray-800 dark:text-gray-200">Citations</div></div>
                </div>
                <div className="text-lg font-black text-gray-900 dark:text-white mb-1">+248 <span className="text-[9px] text-green-500 font-bold">▲ 12%</span></div>
                <div className="h-1 w-full bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden"><div className="w-3/4 h-full bg-primary-500 rounded-full"></div></div>
              </motion.div>
              <motion.div 
                animate={{ y: [0, 8, 0], rotate: [0, -2, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute right-10 top-20 w-40 bg-white/70 dark:bg-slate-800/70 rounded-2xl p-3 shadow-lg border border-white dark:border-slate-700 backdrop-blur-sm z-10"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center font-bold text-[8px] text-sky-600 dark:text-sky-400">Sc</div>
                  <div className="text-[10px] font-black text-gray-800 dark:text-gray-200">Scopus Index</div>
                </div>
                <div className="text-base font-black text-gray-900 dark:text-white">12 H-Index</div>
              </motion.div>
            </div>
          </FeatureCard>

          {/* Card 2: Validasi (Span 4) */}
          <FeatureCard className="md:col-span-4 flex-col justify-between" lightColor="rgba(16, 185, 129, 0.15)" delay={0.1}>
            <div>
              <div className={`w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight mb-2">Verifikasi Berjenjang</h3>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 leading-relaxed mb-4">Sistem persetujuan berjenjang dari tingkat Fakultas hingga LPPM untuk menjamin validitas portofolio akademik.</p>
            </div>
            <div className="relative h-20 w-full mt-auto">
              <div className="absolute inset-x-0 bottom-2 flex items-center justify-between z-10">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">1</div>
                  <span className="text-[8px] font-bold text-gray-400 mt-1">Status</span>
                </div>
                <div className="h-[2px] flex-grow bg-emerald-100 relative mx-2"><motion.div className="absolute inset-x-0 h-full bg-emerald-500" animate={{ width: ['0%', '100%'] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }} /></div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs"><CheckCircle className="w-4 h-4" /></div>
                  <span className="text-[8px] font-bold text-gray-400 mt-1">Verified</span>
                </div>
              </div>
            </div>
          </FeatureCard>

          {/* Card 3: Visualisasi (Span 4, row-span 2) */}
          <FeatureCard className="md:col-span-4 flex-col md:row-span-2" lightColor="rgba(59, 130, 246, 0.15)" delay={0.2}>
            <div className="relative flex-grow flex items-center justify-center h-48 mb-6 mt-4">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute w-36 h-36 rounded-full border-[8px] border-blue-50/50 dark:border-blue-950/50 border-t-blue-500" />
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute w-28 h-28 rounded-full border-[6px] border-sky-50/50 dark:border-sky-950/50 border-r-sky-400" />
              <div className="absolute flex flex-col items-center">
                <div className="text-2xl font-black text-gray-800 dark:text-white">85%</div><p className="text-[10px] font-bold text-gray-400 tracking-wider">Tri Dharma</p>
              </div>
            </div>
            <div className="mt-auto">
              <div className={`w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight mb-2">Analisis & Metrik</h3>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 leading-relaxed">Visualisasi performa riset dan tren publikasi dosen melalui diagram interaktif dan grafik metrik sitasi.</p>
            </div>
          </FeatureCard>

          {/* Card 4: Data Vault (Span 8) */}
          <FeatureCard className="md:col-span-8 md:flex-row justify-between items-center gap-8" lightColor="rgba(245, 158, 11, 0.15)" delay={0.3}>
            <div className="relative w-full md:w-1/2 flex items-center h-32 md:h-full justify-center">
              <div className="relative w-full flex items-center justify-center">
                <motion.div whileHover={{ x: -10 }} className="absolute w-28 h-36 bg-amber-500/10 backdrop-blur-md rounded-xl border border-amber-500/20 shadow-md z-10 flex flex-col justify-end p-3">
                   <div className="w-full h-1.5 bg-amber-500/30 rounded"></div>
                </motion.div>
                <motion.div whileHover={{ x: 10, rotate: 4 }} className="absolute w-28 h-36 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-md z-20 flex flex-col p-3">
                   <FileText className="w-6 h-6 text-amber-500 mb-2" />
                   <div className="text-[9px] font-black text-gray-800 dark:text-gray-200 break-all">Jurnal_Nasional_Q1.pdf</div>
                   <div className="text-[7px] text-gray-400 mt-1">2.4 MB</div>
                </motion.div>
              </div>
            </div>
            <div className="max-w-md w-full md:w-1/2">
              <div className={`w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-3">Arsip Digital Aman</h3>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 leading-relaxed">Pengarsipan dokumen digital aman untuk HKI, buku, penelitian, dan pengabdian masyarakat yang siap diunduh.</p>
            </div>
          </FeatureCard>

          {/* Card 5: Performa (Span 4) */}
          <FeatureCard className="md:col-span-4 flex-col justify-between" lightColor="rgba(244, 63, 94, 0.15)" delay={0.4}>
            <div>
              <div className={`w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight mb-2">Akses Responsif</h3>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 leading-relaxed">Desain antarmuka responsif yang memudahkan akses dashboard dari perangkat mobile maupun desktop.</p>
            </div>
            <div className="relative h-20 w-full flex items-end justify-center mt-4">
              <motion.div whileHover={{ y: -4 }} className="w-14 h-24 bg-gray-900 dark:bg-slate-800 rounded-t-xl border-x-4 border-t-4 border-gray-800 dark:border-slate-700 z-20 flex flex-col p-1">
                <div className="w-full h-full bg-rose-50 dark:bg-rose-950/40 rounded-t-lg" />
              </motion.div>
              <motion.div whileHover={{ y: -4 }} className="absolute bottom-0 right-4 w-24 h-16 bg-gray-900 dark:bg-slate-800 rounded-t-xl border-x-4 border-t-4 border-gray-800 dark:border-slate-700 z-10 flex p-1">
                <div className="w-full h-full bg-rose-100 dark:bg-rose-900/40 rounded-t-lg" />
              </motion.div>
            </div>
          </FeatureCard>

          {/* Card 6: Keamanan (Span 4) */}
          <FeatureCard className="md:col-span-4 flex-col justify-between" lightColor="rgba(139, 92, 246, 0.15)" delay={0.5}>
            <div>
              <div className={`w-12 h-12 bg-gradient-to-br from-violet-500 to-violet-600 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight mb-2">Autentikasi Kampus</h3>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 leading-relaxed">Sistem login terintegrasi Active Directory kampus untuk kemudahan akses dan keamanan data pengguna.</p>
            </div>
            <div className="relative h-24 w-full flex items-center justify-center mt-2">
               <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }} transition={{ duration: 3, repeat: Infinity }} className="absolute w-16 h-16 rounded-full border border-violet-500/30" />
               <motion.div animate={{ scale: [1, 1.35, 1], opacity: [0.3, 0, 0.3] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }} className="absolute w-24 h-24 rounded-full border border-violet-500/20" />
               <div className="z-10 bg-violet-500 text-white p-2.5 rounded-xl shadow-lg shadow-violet-500/20"><Shield className="w-5 h-5" /></div>
            </div>
          </FeatureCard>

        </div>
        {/* --- BENTO GRID END --- */}
      </div>
    </section>
  );
}