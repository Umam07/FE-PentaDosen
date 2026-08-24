import React from 'react';
import { UserX, ArrowLeft } from 'lucide-react';
import Navbar from '../../../../components/Home/Navbar';
import Footer from '../../../../components/Home/Footer';

interface ProfileNotFoundProps {
  onBack: () => void;
}

export default function ProfileNotFound({ onBack }: ProfileNotFoundProps) {
  return (
    <div className="min-h-screen bg-canvas-light dark:bg-canvas-dark flex flex-col justify-between font-sans transition-colors duration-500">
      <Navbar />
      
      <main id="main-content" className="flex-1 flex flex-col items-center justify-center px-4 py-32 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-hairline-light bg-surface-light-raised text-muted dark:border-hairline-dark dark:bg-surface-dark-elevated dark:text-on-dark-muted mb-4 shadow-xs">
          <UserX className="h-7 w-7" />
        </div>
        
        <h1 className="text-xl font-bold tracking-tight text-ink-heading dark:text-on-dark">
          Profil Dosen Tidak Ditemukan
        </h1>
        
        <p className="mt-1.5 text-sm text-muted dark:text-on-dark-muted max-w-md">
          Data profil dosen yang Anda tuju tidak ditemukan, ID tidak valid, atau belum terdaftar dalam direktori.
        </p>
        
        <button 
          onClick={onBack} 
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-ink px-5 py-2.5 text-sm font-semibold text-on-ink hover:bg-ink-hover dark:bg-on-dark dark:text-ink dark:hover:bg-on-dark-soft transition-colors shadow-xs cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Direktori</span>
        </button>
      </main>

      <Footer />
    </div>
  );
}
