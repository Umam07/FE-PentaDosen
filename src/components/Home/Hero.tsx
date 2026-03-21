import { motion } from 'motion/react';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
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
        <div className="text-center max-w-4xl mx-auto mb-16 md:mb-24">
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
            </Link>

            {/* Secondary Button */}
            <a
              href="#about"
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-2 border-slate-100 dark:border-slate-800 font-bold text-base px-10 py-5 rounded-2xl transition-all duration-300 shadow-sm dark:shadow-none"
            >
              <Play className="w-5 h-5 fill-current" />
              Pelajari Fitur
            </a>
          </motion.div>
        </div>

        {/* Video Section with MacOS Style */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative max-w-5xl mx-auto group"
        >
          {/* MacOS Window Mockup */}
          <div className="relative rounded-[1.5rem] bg-white dark:bg-slate-900 shadow-[0_40px_100px_-15px_rgba(0,0,0,0.15)] dark:shadow-2xl dark:shadow-black/50 border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-300">
            
            {/* MacOS Window Control Bar */}
            <div className="h-12 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-4 transition-colors duration-300">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border border-[#E0443E] dark:border-transparent shadow-sm" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border border-[#DEA123] dark:border-transparent shadow-sm" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border border-[#1AAB29] dark:border-transparent shadow-sm" />
              </div>
              <div className="flex-1 text-center text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                Video Pengenalan
              </div>
              <div className="w-14" /> {/* Spacer untuk menyeimbangkan layout header */}
            </div>

            {/* Video Container */}
            <div className="bg-slate-900 aspect-video relative">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/EW5SILLwP00?autoplay=0&controls=1&rel=0&modestbranding=1"
                title="PentaDosen Introduction"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* Decorative Glow behind video */}
          <div className="absolute -inset-4 bg-gradient-to-r from-primary-500 to-purple-500 rounded-[2rem] opacity-10 dark:opacity-20 blur-2xl -z-10 group-hover:opacity-20 dark:group-hover:opacity-30 transition-opacity duration-500"></div>
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