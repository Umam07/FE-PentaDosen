import Navbar from '../components/Home/Navbar';
import Footer from '../components/Home/Footer';
import SEO from '../components/SEO';
import { Github, Instagram, ArrowLeft, GraduationCap, Code2, Users, ExternalLink, Sparkles, Building2, ShieldCheck, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface TeamMember {
  name: string;
  role: string;
  institution: string;
  initials: string;
  photoUrl: string;
  photoFallbackUrl?: string;
  githubUrl?: string;
  instagramUrl?: string;
  bio?: string;
}

const supervisor: TeamMember = {
  name: "Nurmaya, S.Kom, M.Eng, Ph.D",
  role: "Dosen Pembimbing",
  institution: "Program Studi Teknik Informatika, Universitas YARSI",
  initials: "N",
  photoUrl: "/team/nurmaya.jpg",
  bio: "Membimbing perancangan arsitektur, tata kelola data publikasi, serta validasi metodologi platform PentaDosen.",
};

const developers: TeamMember[] = [
  {
    name: "Kiki Aimar Wicaksana",
    role: "Pengembang Website",
    institution: "Teknik Informatika • Universitas YARSI",
    initials: "KW",
    photoUrl: "/team/kiki.webp",
    githubUrl: "https://github.com/KikiAimarWicaksana",
    instagramUrl: "https://www.instagram.com/kikiaimar?igsh=ZXRnNzM2cnJvbWV5",
  },
  {
    name: "Muhammad Syafi'ul Umam",
    role: "Pengembang Website",
    institution: "Teknik Informatika • Universitas YARSI",
    initials: "MU",
    photoUrl: "/team/umam.webp",
    githubUrl: "https://github.com/Umam07",
    instagramUrl: "https://www.instagram.com/umammskyy?igsh=MWY4Z212M3U5OGloag==",
  },
  {
    name: "Rafi Daniswara Anggoro Putra",
    role: "Pengembang Website",
    institution: "Teknik Informatika • Universitas YARSI",
    initials: "RD",
    photoUrl: "/team/danis.webp",
    githubUrl: "https://github.com/DanisMf",
    instagramUrl: "https://www.instagram.com/ravidans?igsh=MWkyaWZmNWI4N3hxOQ==",
  }
];

function MemberAvatar({
  name,
  initials,
  photoUrl,
  fallbackUrl,
  size = "normal",
}: {
  name: string;
  initials: string;
  photoUrl: string;
  fallbackUrl?: string;
  size?: "normal" | "large";
}) {
  const [currentSrc, setCurrentSrc] = useState(photoUrl);
  const [imageFailed, setImageFailed] = useState(false);

  const handleError = () => {
    if (fallbackUrl && currentSrc !== fallbackUrl) {
      setCurrentSrc(fallbackUrl);
    } else {
      setImageFailed(true);
    }
  };

  if (size === "large") {
    return (
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/80 overflow-hidden shrink-0 flex items-center justify-center">
        {imageFailed || !currentSrc ? (
          <span className="text-2xl font-bold text-slate-600 dark:text-slate-400 font-mono tracking-tight">
            {initials}
          </span>
        ) : (
          <img
            src={currentSrc}
            alt={name}
            loading="eager"
            decoding="async"
            onError={handleError}
            className="w-full h-full object-cover object-center"
          />
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-square rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/80 overflow-hidden flex items-center justify-center mb-4 group/avatar">
      {imageFailed || !currentSrc ? (
        <span className="text-3xl font-bold text-slate-400 dark:text-slate-600 font-mono tracking-tight">
          {initials}
        </span>
      ) : (
        <img
          src={currentSrc}
          alt={name}
          loading="eager"
          decoding="async"
          onError={handleError}
          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover/avatar:scale-[1.03]"
        />
      )}
    </div>
  );
}

export default function Developers() {
  return (
    <div className="font-sans antialiased bg-canvas-light dark:bg-canvas-dark text-body dark:text-on-dark min-h-screen flex flex-col selection:bg-accent/20 selection:text-ink-heading">
      <SEO
        title="Tim Pengembang & Pembimbing DUK Team — PentaDosen Universitas YARSI"
        description="Profil Dosen Pembimbing dan Tim Pengembang (DUK Team) di balik platform tata kelola publikasi ilmiah PentaDosen Universitas YARSI."
        keywords="DUK Team, Tim Pengembang PentaDosen, Universitas YARSI, Nurmaya, Kiki Aimar Wicaksana, Muhammad Syafi'ul Umam, Rafi Daniswara Anggoro Putra"
        canonical="https://www.pentadosen.site/developers"
      />

      {/* Header Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 space-y-16">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-hairline-light dark:border-hairline-dark pb-5">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark transition-colors duration-150"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-150" />
            <span>Kembali ke Beranda</span>
          </Link>
          <div className="text-xs font-mono text-muted dark:text-on-dark-muted">
            PentaDosen / DUK Team
          </div>
        </div>

        {/* Page Hero Section */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-surface-light dark:bg-surface-dark text-body-strong dark:text-on-dark border border-hairline-light dark:border-hairline-dark text-[11px] font-mono tracking-wider uppercase font-semibold">
            <Users className="w-3.5 h-3.5 text-muted dark:text-on-dark-muted" />
            <span>Profil Tim & Pengarah</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink-heading dark:text-on-dark">
            DUK Team — PentaDosen
          </h1>
          <p className="text-sm sm:text-base text-body dark:text-on-dark-soft leading-relaxed font-normal">
            Platform tata kelola dan analitik publikasi ilmiah PentaDosen dikembangkan oleh DUK Team di bawah bimbingan Program Studi Teknik Informatika, Fakultas Teknologi Informasi Universitas YARSI.
          </p>
        </div>

        {/* Section 1: Dosen Pembimbing */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-muted dark:text-on-dark-muted" />
            <h2 className="text-xs font-mono tracking-widest text-muted dark:text-on-dark-muted uppercase font-semibold">
              Dosen Pembimbing
            </h2>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark transition-colors">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-start sm:items-center gap-5 sm:gap-6">
                <MemberAvatar
                  name={supervisor.name}
                  initials={supervisor.initials}
                  photoUrl={supervisor.photoUrl}
                  fallbackUrl={supervisor.photoFallbackUrl}
                  size="large"
                />
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono border border-slate-200/80 dark:border-slate-700/60">
                    <GraduationCap className="w-3 h-3 text-slate-500" />
                    <span>Pembimbing Utama</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {supervisor.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                    {supervisor.institution}
                  </p>
                  {supervisor.bio && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 pt-1 leading-relaxed max-w-xl">
                      {supervisor.bio}
                    </p>
                  )}
                </div>
              </div>

              <div className="hidden lg:flex flex-col items-end gap-1.5 text-right border-l border-slate-100 dark:border-slate-800/80 pl-6 py-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Universitas YARSI</span>
                </div>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  Fakultas Teknologi Informasi
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Tim Pengembang (DUK Team) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <h2 className="text-xs font-mono tracking-widest text-slate-600 dark:text-slate-400 uppercase font-semibold">
                Tim Pengembang (Developers)
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              3 Anggota • DUK Team
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {developers.map((dev) => (
              <div
                key={dev.name}
                className="p-5 rounded-2xl bg-white dark:bg-[#141722] border border-slate-200 dark:border-slate-800/90 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors duration-150"
              >
                <div>
                  <MemberAvatar
                    name={dev.name}
                    initials={dev.initials}
                    photoUrl={dev.photoUrl}
                  />

                  <div className="space-y-1.5 mb-5">
                    <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60">
                      {dev.role}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                      {dev.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {dev.institution}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
                  {dev.githubUrl && (
                    <a
                      href={dev.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 text-xs font-semibold transition-colors duration-150"
                      aria-label={`GitHub profil ${dev.name}`}
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                      <ExternalLink className="w-3 h-3 opacity-40 ml-0.5" />
                    </a>
                  )}
                  {dev.instagramUrl && (
                    <a
                      href={dev.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 text-xs font-semibold transition-colors duration-150"
                      aria-label={`Instagram profil ${dev.name}`}
                    >
                      <Instagram className="w-3.5 h-3.5" />
                      <span>Instagram</span>
                      <ExternalLink className="w-3 h-3 opacity-40 ml-0.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Pilar Fondasi Platform */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <h2 className="text-xs font-mono tracking-widest text-slate-600 dark:text-slate-400 uppercase font-semibold">
              Pilar Fondasi Sistem
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#141722] border border-slate-200 dark:border-slate-800/90 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors duration-150">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-center text-slate-700 dark:text-slate-300">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-slate-400 dark:text-slate-600">
                    01
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                  Tata Kelola Terintegrasi
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  Dirancang untuk memudahkan dosen mengelola data publikasi ilmiah, sitasi, dan dokumen pendukung dalam satu repositori terpadu.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#141722] border border-slate-200 dark:border-slate-800/90 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors duration-150">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-center text-slate-700 dark:text-slate-300">
                    <Database className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-slate-400 dark:text-slate-600">
                    02
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                  Validasi Data Akurat
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  Sinkronisasi berkala dengan indeksasi akademik nasional dan internasional untuk memastikan integritas rekam jejak riset.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#141722] border border-slate-200 dark:border-slate-800/90 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors duration-150">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-center text-slate-700 dark:text-slate-300">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-slate-400 dark:text-slate-600">
                    03
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                  Standar Rekayasa Web
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  Dibangun dengan standar rekayasa frontend modern berkecepatan tinggi, responsif, dan aksesibilitas tinggi untuk seluruh sivitas.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}


