import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Github, 
  Instagram, 
  GraduationCap, 
  Code2, 
  ExternalLink, 
  Building2, 
  ShieldCheck, 
  Database, 
  Layers,
  ChevronRight
} from 'lucide-react';
import Navbar from '../components/Home/Navbar';
import Footer from '../components/Home/Footer';
import SEO from '../components/SEO';

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
  name: "Nurmaya, S.Kom., M.Eng., Ph.D.",
  role: "Dosen Pembimbing Utama",
  institution: "Program Studi Teknik Informatika, Universitas YARSI",
  initials: "NM",
  photoUrl: "/team/nurmaya.jpg",
  photoFallbackUrl: "/team/nurmaya.jpg",
  bio: "Membimbing perancangan arsitektur sistem, tata kelola data publikasi akademik, metodologi evaluasi sitasi, serta integrasi standar Tri Dharma pada platform PentaDosen.",
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

const pillars = [
  {
    number: "01",
    tag: "ARSITEKTUR DATA",
    icon: ShieldCheck,
    title: "Tata Kelola Terintegrasi",
    description: "Memfasilitasi manajemen seluruh luaran publikasi ilmiah, penelitian, HKI, paten, dan buku akademik dosen dalam satu repositori terpusat dan terstruktur.",
    highlights: ["Portofolio Tri Dharma", "HKI & Buku Dosen", "Format Standar Pelaporan"]
  },
  {
    number: "02",
    tag: "SINKRONISASI SITASI",
    icon: Database,
    title: "Validasi & Integrasi Otomatis",
    description: "Integrasi analitik sitasi dengan sumber indeksasi resmi (Google Scholar & Scopus) guna menjamin validitas rekam jejak riset dan kalkulasi poin KPI yang objektif.",
    highlights: ["Google Scholar Sync", "Scopus Author API", "Kalkulasi KPI Otomatis"]
  },
  {
    number: "03",
    tag: "ENGINEERING STANDARDS",
    icon: Layers,
    title: "Standar Rekayasa Web Modern",
    description: "Dibangun dengan arsitektur Single Page Application yang responsif, sistem desain Warm Neutral Academic yang tenang, serta kepatuhan aksesibilitas penuh WCAG 2.1 AA.",
    highlights: ["Aksesibilitas WCAG 2.1 AA", "Warm Neutral System", "Performa Klien Cepat"]
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
      <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light-raised dark:bg-surface-dark-elevated overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
        {imageFailed || !currentSrc ? (
          <span className="text-3xl font-bold text-ink-heading dark:text-on-dark font-mono tracking-tight">
            {initials}
          </span>
        ) : (
          <img
            src={currentSrc}
            alt={`Foto ${name}`}
            loading="eager"
            decoding="async"
            onError={handleError}
            className="w-full h-full object-cover object-top"
          />
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[4/5] rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light-raised dark:bg-surface-dark-elevated overflow-hidden flex items-center justify-center mb-5 group/avatar shadow-xs">
      {imageFailed || !currentSrc ? (
        <span className="text-4xl font-bold text-muted dark:text-on-dark-muted font-mono tracking-tight">
          {initials}
        </span>
      ) : (
        <img
          src={currentSrc}
          alt={`Foto ${name}`}
          loading="eager"
          decoding="async"
          onError={handleError}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover/avatar:scale-[1.03]"
        />
      )}
    </div>
  );
}

export default function Developers() {
  return (
    <div className="font-sans antialiased bg-canvas-light dark:bg-canvas-dark text-body dark:text-on-dark min-h-screen flex flex-col selection:bg-accent/20 selection:text-ink-heading dark:selection:text-on-dark transition-colors duration-300">
      <SEO
        title="Tim Pengembang & Pembimbing DUK Team — PentaDosen Universitas YARSI"
        description="Profil Dosen Pembimbing dan Tim Pengembang (DUK Team) di balik platform tata kelola publikasi ilmiah dan portofolio akademik PentaDosen Universitas YARSI."
        keywords="DUK Team, Tim Pengembang PentaDosen, PentaDosen, Penta Dosen, Universitas YARSI, Nurmaya, Kiki Aimar Wicaksana, Muhammad Syafi'ul Umam, Rafi Daniswara Anggoro Putra"
        canonical="https://www.pentadosen.site/developers"
      />

      {/* Accessible Skip to Content Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none"
      >
        Lewati ke Konten Utama
      </a>

      {/* Header Navbar */}
      <Navbar />

      {/* Main Content Landmark */}
      <main id="main-content" className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 space-y-16">
        
        {/* Breadcrumb Navigation Bar */}
        <div className="border-b border-hairline-light dark:border-hairline-dark pb-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
            <Link
              to="/"
              className="text-body hover:text-ink-heading dark:text-on-dark-soft dark:hover:text-on-dark transition-colors font-medium hover:underline underline-offset-4"
            >
              Beranda
            </Link>
            <ChevronRight className="w-4 h-4 text-muted dark:text-on-dark-muted shrink-0" aria-hidden="true" />
            <span className="text-ink-heading dark:text-on-dark font-semibold" aria-current="page">
              Tim Pengembang
            </span>
          </nav>
        </div>

        {/* Page Hero Header Section */}
        <div className="space-y-4 max-w-3xl">
          <div className="space-y-3">
            <motion.h1 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-ink-heading dark:text-on-dark leading-tight"
            >
              DUK Team <span className="text-accent dark:text-accent-on-dark">— PentaDosen</span>
            </motion.h1>
            <p className="text-sm sm:text-base text-body dark:text-on-dark-soft leading-relaxed font-normal">
              Platform manajemen dan analitik portofolio Tri Dharma PentaDosen dirancang dan dikembangkan secara mandiri oleh <span className="font-semibold text-ink-heading dark:text-on-dark">DUK Team</span> (Danis, Umam, Kiki) di bawah bimbingan Program Studi Teknik Informatika, Fakultas Teknologi Informasi Universitas YARSI.
            </p>
          </div>

          {/* Quick Meta Indicators */}
          <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-body dark:text-on-dark-soft border-t border-hairline-light-soft dark:border-hairline-dark-soft">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-accent dark:text-accent-on-dark" />
              <span>Universitas YARSI</span>
            </div>
            <span className="text-hairline-light dark:text-hairline-dark">•</span>
            <div className="flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-accent dark:text-accent-on-dark" />
              <span>Fakultas Teknologi Informasi</span>
            </div>
            <span className="text-hairline-light dark:text-hairline-dark">•</span>
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <span>Rilis: PentaDosen v2.0</span>
            </div>
          </div>
        </div>

        {/* Section 1: Dosen Pembimbing Utama */}
        <section className="space-y-4" aria-labelledby="heading-supervisor">
          <div className="flex items-center gap-2 border-b border-hairline-light dark:border-hairline-dark pb-3">
            <GraduationCap className="w-4 h-4 text-accent dark:text-accent-on-dark" />
            <h2 id="heading-supervisor" className="text-xs font-mono tracking-wider text-body-strong dark:text-on-dark-soft uppercase font-bold">
              Dosen Pembimbing Utama
            </h2>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark shadow-xs transition-colors">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
              <MemberAvatar
                name={supervisor.name}
                initials={supervisor.initials}
                photoUrl={supervisor.photoUrl}
                fallbackUrl={supervisor.photoFallbackUrl}
                size="large"
              />
              
              <div className="space-y-2.5 flex-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-accent/10 dark:bg-accent/20 text-accent-hover dark:text-accent-on-dark font-mono border border-accent/20">
                  <GraduationCap className="w-3 h-3" />
                  <span>{supervisor.role}</span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-ink-heading dark:text-on-dark tracking-tight">
                    {supervisor.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-body dark:text-on-dark-soft font-medium mt-0.5">
                    {supervisor.institution}
                  </p>
                </div>

                {supervisor.bio && (
                  <p className="text-xs sm:text-sm text-body dark:text-on-dark-soft leading-relaxed max-w-2xl pt-1">
                    {supervisor.bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Tim Pengembang (DUK Team) */}
        <section className="space-y-6" aria-labelledby="heading-developers">
          <div className="border-b border-hairline-light dark:border-hairline-dark pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-accent dark:text-accent-on-dark" />
                <h2 id="heading-developers" className="text-xs font-mono tracking-wider text-body-strong dark:text-on-dark-soft uppercase font-bold">
                  Tim Pengembang Perangkat Lunak
                </h2>
              </div>
              <p className="text-sm font-semibold text-ink-heading dark:text-on-dark">
                DUK Team (Danis, Umam, Kiki)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {developers.map((dev) => (
              <div
                key={dev.name}
                className="group p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark flex flex-col justify-between hover:border-ink-border dark:hover:border-hairline-dark transition-all duration-300 shadow-xs"
              >
                <div>
                  <MemberAvatar
                    name={dev.name}
                    initials={dev.initials}
                    photoUrl={dev.photoUrl}
                  />

                  <div className="space-y-2 mb-6">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold uppercase tracking-wider bg-surface-light-raised dark:bg-surface-dark-elevated text-body-strong dark:text-on-dark border border-hairline-light-soft dark:border-hairline-dark-soft">
                      <Code2 className="w-3 h-3 text-accent dark:text-accent-on-dark" />
                      <span>{dev.role}</span>
                    </div>
                    
                    <h3 className="text-base sm:text-lg font-bold text-ink-heading dark:text-on-dark tracking-tight leading-snug group-hover:text-accent dark:group-hover:text-accent-on-dark transition-colors">
                      {dev.name}
                    </h3>
                    
                    <p className="text-xs text-body dark:text-on-dark-soft font-medium">
                      {dev.institution}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-hairline-light-soft dark:border-hairline-dark-soft flex items-center gap-2">
                  {dev.githubUrl && (
                    <a
                      href={dev.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-surface-light-raised dark:bg-surface-dark-elevated hover:bg-ink hover:text-on-ink dark:hover:bg-on-dark dark:hover:text-ink-heading text-body-strong dark:text-on-dark border border-hairline-light dark:border-hairline-dark text-xs font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent shadow-2xs cursor-pointer"
                      aria-label={`Profil GitHub ${dev.name}`}
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
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-surface-light-raised dark:bg-surface-dark-elevated hover:bg-ink hover:text-on-ink dark:hover:bg-on-dark dark:hover:text-ink-heading text-body-strong dark:text-on-dark border border-hairline-light dark:border-hairline-dark text-xs font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent shadow-2xs cursor-pointer"
                      aria-label={`Profil Instagram ${dev.name}`}
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
        <section className="space-y-6" aria-labelledby="heading-pillars">
          <div className="border-b border-hairline-light dark:border-hairline-dark pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-accent dark:text-accent-on-dark" />
                <h2 id="heading-pillars" className="text-xs font-mono tracking-wider text-body-strong dark:text-on-dark-soft uppercase font-bold">
                  Pilar Fondasi Sistem
                </h2>
              </div>
              <p className="text-sm font-semibold text-ink-heading dark:text-on-dark">
                Prinsip Arsitektur & Tata Kelola Platform PentaDosen
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((pillar) => {
              const IconComp = pillar.icon;
              return (
                <div 
                  key={pillar.number}
                  className="group relative p-6 sm:p-7 rounded-2xl bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark flex flex-col justify-between hover:border-ink-border dark:hover:border-hairline-dark transition-all duration-300 shadow-xs"
                >
                  <div className="space-y-5">
                    {/* Top Row: Icon Badge & Monospace Tag */}
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xl bg-accent/10 dark:bg-accent/20 border border-accent/20 flex items-center justify-center text-accent-hover dark:text-accent-on-dark">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono font-bold text-muted dark:text-on-dark-muted uppercase tracking-wider block">
                          {pillar.tag}
                        </span>
                        <span className="text-xs font-mono font-bold text-ink-heading dark:text-on-dark">
                          #{pillar.number}
                        </span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-2">
                      <h3 className="text-base sm:text-lg font-bold text-ink-heading dark:text-on-dark tracking-tight leading-snug group-hover:text-accent dark:group-hover:text-accent-on-dark transition-colors">
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-body dark:text-on-dark-soft leading-relaxed font-normal">
                        {pillar.description}
                      </p>
                    </div>
                  </div>

                  {/* Highlights Chips */}
                  <div className="pt-5 mt-5 border-t border-hairline-light-soft dark:border-hairline-dark-soft">
                    <div className="flex flex-wrap gap-1.5">
                      {pillar.highlights.map((tag) => (
                        <span 
                          key={tag}
                          className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated text-body-strong dark:text-on-dark border border-hairline-light-soft dark:border-hairline-dark-soft"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
