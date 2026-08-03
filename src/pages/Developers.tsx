import Navbar from '../components/Home/Navbar';
import Footer from '../components/Home/Footer';
import { Github, Instagram, ArrowLeft, GraduationCap, Code2, Users, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface TeamMember {
  name: string;
  role: string;
  initials: string;
  photoUrl: string;
  githubUrl?: string;
  instagramUrl?: string;
}

const supervisor: TeamMember = {
  name: "Nurmaya, S.Kom, M.Eng, Ph.D",
  role: "Pembimbing / Mentor Tim",
  initials: "N",
  photoUrl: "/team/nurmaya.png",
};

const developers: TeamMember[] = [
  {
    name: "Kiki Aimar Wicaksana",
    role: "Pengembang Website",
    initials: "KW",
    photoUrl: "/team/kiki.webp",
    githubUrl: "https://github.com/KikiAimarWicaksana",
    instagramUrl: "https://www.instagram.com/kikiaimar?igsh=ZXRnNzM2cnJvbWV5",
  },
  {
    name: "Muhammad Syafi'ul Umam",
    role: "Pengembang Website",
    initials: "MU",
    photoUrl: "/team/umam.webp",
    githubUrl: "https://github.com/Umam07",
    instagramUrl: "https://www.instagram.com/umammskyy?igsh=MWY4Z212M3U5OGloag==",
  },
  {
    name: "Rafi Daniswara Anggoro Putra",
    role: "Pengembang Website",
    initials: "RD",
    photoUrl: "/team/danis.webp",
    githubUrl: "https://github.com/DanisMf",
    instagramUrl: "https://www.instagram.com/ravidans?igsh=MWkyaWZmNWI4N3hxOQ==",
  }
];

function MemberAvatar({ name, initials, photoUrl, size = "normal" }: { name: string; initials: string; photoUrl: string; size?: "normal" | "large" }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (size === "large") {
    return (
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 overflow-hidden flex-shrink-0 flex items-center justify-center">
        {imageFailed || !photoUrl ? (
          <span className="text-2xl font-medium text-slate-600 dark:text-slate-400 font-mono">
            {initials}
          </span>
        ) : (
          <img
            src={photoUrl}
            alt={name}
            onError={() => setImageFailed(true)}
            className="w-full h-full object-cover"
          />
        )}
      </div>
    );
  }

  return (
    <div className="w-full aspect-[4/5] rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 overflow-hidden flex items-center justify-center mb-5">
      {imageFailed || !photoUrl ? (
        <span className="text-3xl font-medium text-slate-400 dark:text-slate-600 font-mono">
          {initials}
        </span>
      ) : (
        <img
          src={photoUrl}
          alt={name}
          onError={() => setImageFailed(true)}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}

export default function Developers() {
  return (
    <div className="font-sans antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen flex flex-col selection:bg-slate-200 dark:selection:bg-slate-800">
      {/* Header Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 space-y-16">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-150"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-150" />
            <span>Kembali ke Beranda</span>
          </Link>
          <div className="text-xs font-mono text-slate-400 dark:text-slate-500">
            PentaDosen / DUK Team
          </div>
        </div>

        {/* Page Hero Section */}
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 text-[11px] font-mono tracking-wider uppercase">
            <Users className="w-3 h-3 text-slate-500" />
            <span>Tim Pengembang & Pembimbing</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            DUK Team — PentaDosen
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
            Profil Pembimbing / Mentor Tim dan Tim Pengembang di balik pembangunan platform tata kelola publikasi ilmiah PentaDosen Universitas YARSI.
          </p>
        </div>

        {/* Section 1: Dosen Pembimbing */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <GraduationCap className="w-4 h-4 text-slate-500" />
            <h2 className="text-xs font-mono tracking-widest text-slate-500 dark:text-slate-400 uppercase font-semibold">
              Pembimbing / Mentor Tim
            </h2>
          </div>

          <div className="p-6 sm:p-8 rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5 sm:gap-6">
              <MemberAvatar
                name={supervisor.name}
                initials={supervisor.initials}
                photoUrl={supervisor.photoUrl}
                size="large"
              />
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {supervisor.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Dosen Pembimbing Sistem PentaDosen
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 text-xs font-mono border border-slate-200 dark:border-slate-700">
              <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
              <span>Pembimbing / Mentor Tim</span>
            </div>
          </div>
        </section>

        {/* Section 2: Tim Pengembang */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <Code2 className="w-4 h-4 text-slate-500" />
            <h2 className="text-xs font-mono tracking-widest text-slate-500 dark:text-slate-400 uppercase font-semibold">
              Tim Pengembang (Developers)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {developers.map((dev) => (
              <div
                key={dev.name}
                className="p-5 rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors duration-150"
              >
                <div>
                  <MemberAvatar
                    name={dev.name}
                    initials={dev.initials}
                    photoUrl={dev.photoUrl}
                  />

                  <div className="space-y-1 mb-6">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                      {dev.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {dev.role}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-2">
                  {dev.githubUrl && (
                    <a
                      href={dev.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 text-xs font-semibold transition-colors duration-150"
                    >
                      <div className="flex items-center gap-1.5">
                        <Github className="w-3.5 h-3.5" />
                        <span>GitHub</span>
                      </div>
                      <ExternalLink className="w-3 h-3 opacity-50" />
                    </a>
                  )}
                  {dev.instagramUrl && (
                    <a
                      href={dev.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 text-xs font-semibold transition-colors duration-150"
                    >
                      <div className="flex items-center gap-1.5">
                        <Instagram className="w-3.5 h-3.5" />
                        <span>Instagram</span>
                      </div>
                      <ExternalLink className="w-3 h-3 opacity-50" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
