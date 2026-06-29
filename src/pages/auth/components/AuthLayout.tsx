import React from 'react';
import { Link } from 'react-router-dom';
import { Hexagon, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  brandTitle?: string;
  brandSubtitle?: string;
  maxWidth?: string;
}

export default function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  brandTitle = "PentaDosen", 
  brandSubtitle = "KPI & Research Repository System",
  maxWidth = "max-w-[480px]"
}: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans transition-all selection:bg-primary-100 selection:text-primary-900 relative">
      {/* Back to Homepage Button */}
      <Link 
        to="/" 
        aria-label="Kembali ke halaman utama"
        className="absolute top-4 left-4 md:top-8 md:left-8 inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 uppercase tracking-widest transition-all duration-200 group bg-white dark:bg-gray-900 px-4 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Kembali
      </Link>

      <div className={`w-full ${maxWidth}`}>
        {/* Brand */}
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-4 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl shadow-2xl shadow-primary-200 dark:shadow-primary-900/30 mb-6"
          >
            <Hexagon className="w-10 h-10 text-white fill-white/20" />
          </motion.div>
          <motion.h1 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase"
          >
            {brandTitle === "PentaDosen" ? (
              <>
                Penta<span className="text-primary-600 dark:text-primary-400">Dosen</span>
              </>
            ) : (
              <>{brandTitle}</>
            )}
          </motion.h1>
          <p className="text-slate-600 dark:text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">{brandSubtitle}</p>
        </div>

        {/* Auth Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 p-8 lg:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-800 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 dark:bg-primary-900/10 rounded-full -mr-16 -mt-16 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="relative z-10">
            {title && (
              <div className="mb-8 text-center sm:text-left">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase mb-1">{title}</h2>
                <p className="text-slate-600 dark:text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">{subtitle}</p>
              </div>
            )}
            
            {children}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
