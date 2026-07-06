import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLoginState } from './hooks/useLoginState';
import { useAuthStats } from './hooks/useAuthStats';
import { AuthBrandingPanel } from './components/AuthBrandingPanel';
import { DosenLoginForm } from './components/DosenLoginForm';
import { AdminLoginForm } from './components/AdminLoginForm';

export default function Login({ setUser }: { setUser: any }) {
  const { isAdmin, handleToggleMode } = useLoginState();
  const { totalDocs, totalDosen } = useAuthStats();

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 flex font-sans transition-colors duration-300 relative overflow-hidden">
      
      {/* Tombol Kembali ke Beranda */}
      <Link
        to="/"
        aria-label="Kembali ke halaman utama"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white uppercase tracking-wider transition-colors group z-30"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Kembali
      </Link>

      {/* Panel Kiri: Informasi Branding & Statistik */}
      <AuthBrandingPanel 
        isAdmin={isAdmin} 
        totalDocs={totalDocs} 
        totalDosen={totalDosen} 
      />

      {/* Form Login Dosen */}
      <DosenLoginForm 
        isAdmin={isAdmin} 
        setUser={setUser} 
        onToggleMode={handleToggleMode} 
      />

      {/* Form Login Admin */}
      <AdminLoginForm 
        isAdmin={isAdmin} 
        setUser={setUser} 
        onToggleMode={handleToggleMode} 
      />

    </main>
  );
}