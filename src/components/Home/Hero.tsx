import { motion } from 'motion/react';
import { LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import Leaderboard from './Leaderboard';

export default function Hero() {
  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-48 md:pb-40 overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-primary-100 dark:bg-primary-900/30 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-30 dark:opacity-40 animate-blob transition-colors duration-300" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-100 dark:bg-purple-900/30 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-30 dark:opacity-40 animate-blob animation-delay-2000 transition-colors duration-300" />
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-50 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 dark:opacity-30 transition-colors duration-300" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/cubes.png')] opacity-[0.03] dark:opacity-[0.05] dark:invert"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16 md:mb-24 relative">


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
              to="/insights"
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-slate-900 dark:bg-primary-600 hover:bg-primary-600 dark:hover:bg-primary-500 text-white font-bold text-base px-10 py-5 rounded-2xl shadow-2xl shadow-slate-200 dark:shadow-none transition-all duration-300 group overflow-hidden relative"
            >
              <span className="relative z-10">Lihat Lebih Lengkap</span>
              <LayoutDashboard className="w-5 h-5 group-hover:rotate-12 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Shine Effect */}
              <motion.div
                className="absolute top-0 -inset-full h-full w-1/2 z-20 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                animate={{ left: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: 2, repeatDelay: 1 }}
              />
            </Link>


          </motion.div>
        </div>

        {/* --- --- --- Bagian Leaderboard --- --- --- */}
        <div id="leaderboard" className="relative max-w-7xl mx-auto mt-16 md:mt-24">
          <Leaderboard isHero={true} />
        </div>
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