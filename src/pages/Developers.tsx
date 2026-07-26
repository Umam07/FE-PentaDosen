import Navbar from '../components/Home/Navbar';
import Footer from '../components/Home/Footer';
import { Instagram, Github, ArrowLeft, GraduationCap, Code2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface TeamMember {
  name: string;
  role: string;
  initials: string;
  photoUrl: string;
  socials: {
    instagram: string;
    github?: string;
  };
}

const supervisor: TeamMember = {
  name: "Nurmaya, S.Kom, M.Eng, Ph.D",
  role: "Dosen Pembimbing",
  initials: "N",
  photoUrl: "/team/nurmaya.png",
  socials: {
    instagram: "https://instagram.com",
  }
};

const developers: TeamMember[] = [
  {
    name: "Kiki Aimar Wicaksana",
    role: "Pengembang Website",
    initials: "KW",
    photoUrl: "/team/kiki.png",
    socials: {
      instagram: "https://instagram.com",
      github: "https://github.com",
    }
  },
  {
    name: "Muhammad Syafi'ul Umam",
    role: "Pengembang Website",
    initials: "MU",
    photoUrl: "/team/umam.png",
    socials: {
      instagram: "https://instagram.com",
      github: "https://github.com",
    }
  },
  {
    name: "Rafi Daniswara Anggoro Putra",
    role: "Pengembang Website",
    initials: "RP",
    photoUrl: "/team/rafi.png",
    socials: {
      instagram: "https://instagram.com",
      github: "https://github.com",
    }
  }
];

function MemberAvatar({ name, initials, photoUrl, isLarge = false }: { name: string; initials: string; photoUrl: string; isLarge?: boolean }) {
  const [imageFailed, setImageFailed] = useState(false);

  const containerClasses = isLarge
    ? "w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-amber-300 dark:border-amber-700/60 overflow-hidden bg-amber-100 dark:bg-amber-950/80 flex-shrink-0 flex items-center justify-center text-amber-800 dark:text-amber-300 shadow-sm"
    : "w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 flex items-center justify-center text-slate-800 dark:text-slate-200 shadow-sm group-hover:border-primary-500/50 transition-colors duration-200";

  if (imageFailed || !photoUrl) {
    return (
      <div className={containerClasses}>
        <span className={isLarge ? "text-3xl font-black tracking-wider" : "text-xl font-bold tracking-wider"}>
          {initials}
        </span>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <img
        src={photoUrl}
        alt={name}
        onError={() => setImageFailed(true)}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export default function Developers() {
  return (
    <div className="font-sans antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen flex flex-col selection:bg-primary-500/20 selection:text-primary-600">
      {/* Standard Header Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 space-y-12">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-150"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-150" />
            <span>Kembali ke Beranda</span>
          </Link>
          <div className="text-xs font-medium text-slate-400 dark:text-slate-500">
            Beranda / <span className="text-slate-700 dark:text-slate-300 font-semibold">DUK Team</span>
          </div>
        </div>

        {/* Page Title Section */}
        <div className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 border border-slate-300/60 dark:border-slate-700/60 text-xs font-semibold">
            <Users className="w-3.5 h-3.5" />
            <span>Tim Pengembang & Pembimbing</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            DUK Team — PentaDosen
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Profil Dosen Pembimbing dan Tim Pengembang di balik pembangunan platform tata kelola publikasi ilmiah PentaDosen Universitas YARSI.
          </p>
        </div>

        {/* Section 1: Dosen Pembimbing */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Dosen Pembimbing</h2>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-50/80 to-slate-50 dark:from-amber-950/20 dark:to-slate-900 border border-amber-200/80 dark:border-amber-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-amber-300 dark:hover:border-amber-800/80 transition-colors duration-200">
            <div className="flex items-center gap-5 sm:gap-6">
              <MemberAvatar
                name={supervisor.name}
                initials={supervisor.initials}
                photoUrl={supervisor.photoUrl}
                isLarge
              />
              <div className="space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {supervisor.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                  Supervisi & Bimbingan Strategis Sistem PentaDosen
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href={supervisor.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-sm active:scale-95 transition-all duration-150"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>

        {/* Section 2: Tim Pengembang */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20">
              <Code2 className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Tim Pengembang (Developers)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {developers.map((dev) => (
              <div
                key={dev.name}
                className="group p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between space-y-6 hover:border-slate-400 dark:hover:border-slate-600 transition-all duration-200"
              >
                <div className="space-y-5">
                  <div>
                    <MemberAvatar
                      name={dev.name}
                      initials={dev.initials}
                      photoUrl={dev.photoUrl}
                    />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-150">
                      {dev.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Pengembang Website DUK Team
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                  <a
                    href={dev.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-pink-50 dark:hover:bg-pink-950/40 text-slate-700 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400 border border-slate-200 dark:border-slate-700 text-xs font-semibold active:scale-95 transition-all duration-150"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>Instagram</span>
                  </a>

                  {dev.socials.github && (
                    <a
                      href={dev.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 text-xs font-semibold active:scale-95 transition-all duration-150"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Standard Footer */}
      <Footer />
    </div>
  );
}
