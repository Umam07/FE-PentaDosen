import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEO from '../../components/SEO';
import { AuthBrandingPanel } from './components/AuthBrandingPanel';
import { DosenLoginForm } from './components/DosenLoginForm';

export default function Login({ setUser }: { setUser: any }) {
  return (
    <main className="min-h-screen bg-canvas-light dark:bg-canvas-dark flex font-sans transition-colors duration-300 relative overflow-hidden">
      <SEO
        title="Masuk ke Akun — PentaDosen (Penta Dosen) Universitas YARSI"
        description="Portal login dosen dan verifikator administrasi penelitian & pengabdian PentaDosen (Penta Dosen) Universitas YARSI."
        keywords="Login PentaDosen, Masuk Penta Dosen, Portal Dosen YARSI"
        canonical="https://www.pentadosen.site/login"
      />
      
      {/* Tombol Kembali ke Beranda */}
      <Link
        to="/"
        aria-label="Kembali ke halaman utama"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-bold text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark uppercase tracking-wider transition-colors group z-30"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Kembali
      </Link>

      {/* Panel Kiri: Informasi Branding & Fitur */}
      <AuthBrandingPanel />

      {/* Form Login Tunggal */}
      <DosenLoginForm 
        setUser={setUser} 
      />

    </main>
  );
}