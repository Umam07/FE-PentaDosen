import { motion } from 'motion/react';
import { ArrowRight, Play, Terminal, CheckCircle2, ShieldCheck, Database, Activity, Code2, Braces, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  // Variants untuk efek mesin ketik
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 4.5, // Mulai ngetik setelah loading bar
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const typingText = "Mengkalkulasi poin KPI evaluasi dosen...";

  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-48 md:pb-40 overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-primary-100 dark:bg-primary-900/30 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-30 dark:opacity-40 animate-blob transition-colors duration-300" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-100 dark:bg-purple-900/30 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-30 dark:opacity-40 animate-blob animation-delay-2000 transition-colors duration-300" />
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-50 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 dark:opacity-30 transition-colors duration-300" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.05] dark:invert"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16 md:mb-24 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 px-4 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-primary-100 dark:border-primary-900/50 rounded-full mb-8 shadow-sm transition-colors duration-300"
          >
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-600 dark:bg-primary-500"></span>
            </span>
            <span className="text-[10px] md:text-xs font-bold text-primary-800 dark:text-primary-300 uppercase tracking-[0.2em]">Platform Evaluasi Kinerja Dosen #1</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.05] mb-8 transition-colors duration-300"
          >
            Masa Depan <br />
            <span className="relative inline-block mt-2">
              <span className="relative z-10 bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 dark:from-primary-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                Karir Akademik Anda
              </span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-primary-100/60 dark:bg-primary-900/40 -z-10 rotate-1"></span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl font-medium text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-12 transition-colors duration-300"
          >
            Otomatisasi sinkronisasi data <span className="text-slate-900 dark:text-white font-bold">Google Scholar</span> & <span className="text-slate-900 dark:text-white font-bold">Scopus</span>. 
            Kelola berkas evaluasi lebih cepat, akurat, dan transparan dalam satu dashboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 px-4"
          >
            {/* Primary Button */}
            <Link
              to="/register"
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-slate-900 dark:bg-primary-600 hover:bg-primary-600 dark:hover:bg-primary-500 text-white font-bold text-base px-10 py-5 rounded-2xl shadow-2xl shadow-slate-200 dark:shadow-none transition-all duration-300 group overflow-hidden relative"
            >
              <span className="relative z-10">Daftar Sekarang</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Shine Effect */}
              <motion.div
                className="absolute top-0 -inset-full h-full w-1/2 z-20 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                animate={{ left: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: 2, repeatDelay: 1 }}
              />
            </Link>

            {/* Secondary Button */}
            <a
              href="#about"
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-2 border-slate-100 dark:border-slate-800 font-bold text-base px-10 py-5 rounded-2xl transition-all duration-300 shadow-sm dark:shadow-none"
            >
              <Play className="w-5 h-5 fill-current text-primary-600 dark:text-primary-400" />
              Pelajari Fitur
            </a>
          </motion.div>
        </div>

        {/* --- --- --- Bagian Ilustrasi System Log / Terminal --- --- --- */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative max-w-4xl mx-auto group"
        >
          {/* Floating Decor Items (Di belakang terminal) */}
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute -left-10 -top-10 text-primary-200 dark:text-primary-900/40 -z-10"
          >
            <Braces className="w-24 h-24" strokeWidth={1} />
          </motion.div>
          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
            className="absolute -right-12 top-20 text-indigo-200 dark:text-indigo-900/30 -z-10"
          >
            <Code2 className="w-32 h-32" strokeWidth={1} />
          </motion.div>

          {/* Mockup Terminal Window ala macOS */}
          <motion.div 
            animate={{ y: [0, -8, 0] }} 
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="relative rounded-2xl bg-[#0d1117] border border-slate-700/80 shadow-2xl overflow-hidden transition-colors duration-300"
          >
            {/* Header Terminal */}
            <div className="h-12 bg-[#161b22] border-b border-slate-700/80 flex items-center px-4 relative justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
              
              <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs font-semibold text-slate-400">
                <Terminal className="w-4 h-4" />
                Penta Dosen — System Sync
              </div>

              {/* Live Status Indicator */}
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-mono text-emerald-500/80 uppercase tracking-wider hidden sm:block">Live Server</span>
              </div>
            </div>

            {/* Isi Terminal / Log System */}
            <div className="p-6 md:p-8 font-mono text-sm md:text-base">
              
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 0.8 }}
                className="flex items-start gap-3 mb-4 text-slate-300"
              >
                <div className="mt-0.5 text-blue-400"><Database className="w-4 h-4" /></div>
                <div>
                  <span className="text-slate-500 mr-2">[10:00:01]</span>
                  Memulai inisiasi sistem evaluasi dosen...
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 1.5 }}
                className="flex items-start gap-3 mb-4 text-slate-300"
              >
                <div className="mt-0.5 text-green-500"><CheckCircle2 className="w-4 h-4" /></div>
                <div>
                  <span className="text-slate-500 mr-2">[10:00:03]</span>
                  Koneksi ke API Google Scholar <span className="text-green-400 font-semibold">berhasil</span>. (Menarik 145 sitasi)
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 2.2 }}
                className="flex items-start gap-3 mb-6 text-slate-300"
              >
                <div className="mt-0.5 text-green-500"><CheckCircle2 className="w-4 h-4" /></div>
                <div>
                  <span className="text-slate-500 mr-2">[10:00:05]</span>
                  Sinkronisasi ID Scopus <span className="text-green-400 font-semibold">selesai</span>. Dokumen diperbarui.
                </div>
              </motion.div>

              <div className="h-[1px] w-full bg-slate-800 mb-6"></div>

              {/* Progress Bar Animation */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.8 }}
                className="mb-4"
              >
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <span>Menyusun metadata dokumen...</span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ delay: 3, duration: 1.5, repeat: Infinity }}
                  >
                    100%
                  </motion.span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 3, duration: 1.2, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                  />
                </div>
              </motion.div>

              {/* Animasi Mengetik - SUDAH DIPERBAIKI UNTUK RESPONSIVE */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 4.2 }}
                className="flex items-start gap-3 text-primary-400 font-semibold"
              >
                <div className="mt-0.5"><Activity className="w-4 h-4" /></div>
                
                {/* Mengubah flex container menjadi block (leading-relaxed) agar teks bisa membungkus alami ke bawah */}
                <div className="flex-1 leading-relaxed">
                  <span className="text-slate-500 font-normal mr-2">[10:00:08]</span>
                  
                  {/* Menghapus "flex" class dan menambahkan whitespace-pre-wrap agar spasi memotong kata secara alami */}
                  <motion.span
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="whitespace-pre-wrap inline"
                  >
                    {/* Menggunakan "letter" langsung tanpa menukarnya dengan \u00A0 agar tidak menjadi satu blok kata panjang */}
                    {typingText.split("").map((letter, index) => (
                      <motion.span key={index} variants={letterVariants}>
                        {letter}
                      </motion.span>
                    ))}
                  </motion.span>
                  
                  {/* Kursor Berkedip ditempatkan secara inline agar selalu mengikuti kata terakhir */}
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    className="inline-block w-2 h-4 bg-primary-400 ml-1 translate-y-[2px]"
                  />
                </div>
              </motion.div>

              {/* Animasi Hasil Kalkulasi KPI (Muncul setelah selesai mengetik) */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 7.2 }} 
                className="flex items-start gap-3 mt-6 pt-4 border-t border-slate-800/50"
              >
                <div className="mt-0.5 text-emerald-400"><Award className="w-5 h-5" /></div>
                <div className="flex-1">
                  <span className="text-slate-500 font-normal mr-2">[10:00:11]</span>
                  <span className="text-slate-300">Kalkulasi Selesai.</span>{" "}
                  <span className="inline-block mt-2 md:mt-0 text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-md">
                    +245 Poin KPI Terakumulasi! 🎉
                  </span>
                </div>
              </motion.div>

            </div>
          </motion.div>

          {/* Decorative Glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-[2rem] opacity-20 blur-2xl -z-10 group-hover:opacity-30 transition-opacity duration-500"></div>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}} />
    </section>
  );
}