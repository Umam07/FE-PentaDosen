import { motion } from 'framer-motion';
import {
  Award,
  BadgeCheck,
  BookOpen,
  Fingerprint,
  Globe,
  GraduationCap,
  Hash,
  Info,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from 'lucide-react';

interface DetailInformasiProps {
  user: any;
  tabVariants: any;
}

const emptyValue = '-';

function InfoTile({ label, value, icon: Icon }: { label: string; value?: string; icon: any }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
          {label}
        </p>
        <p
          className="mt-0.5 truncate text-sm font-black text-slate-900 dark:text-white"
          title={value || emptyValue}
        >
          {value || emptyValue}
        </p>
      </div>
    </div>
  );
}

function IdentityBadge({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value?: string;
  icon: any;
  tone: 'blue' | 'rose' | 'emerald' | 'violet';
}) {
  const tones = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/20',
      border: 'border-blue-100 dark:border-blue-900/40',
      icon: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
      label: 'text-blue-700 dark:text-blue-300',
      value: 'text-blue-900 dark:text-blue-100',
    },
    rose: {
      bg: 'bg-rose-50 dark:bg-rose-950/20',
      border: 'border-rose-100 dark:border-rose-900/40',
      icon: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300',
      label: 'text-rose-700 dark:text-rose-300',
      value: 'text-rose-900 dark:text-rose-100',
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/20',
      border: 'border-emerald-100 dark:border-emerald-900/40',
      icon: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
      label: 'text-emerald-700 dark:text-emerald-300',
      value: 'text-emerald-900 dark:text-emerald-100',
    },
    violet: {
      bg: 'bg-violet-50 dark:bg-violet-950/20',
      border: 'border-violet-100 dark:border-violet-900/40',
      icon: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300',
      label: 'text-violet-700 dark:text-violet-300',
      value: 'text-violet-900 dark:text-violet-100',
    },
  };

  const t = tones[tone];

  return (
    <div className={`flex items-center gap-4 rounded-2xl border p-4 transition-all hover:shadow-sm ${t.bg} ${t.border}`}>
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${t.icon}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-[10px] font-black uppercase tracking-widest ${t.label}`}>{label}</p>
        <p className={`mt-0.5 truncate font-mono text-sm font-black ${t.value}`} title={value || 'Belum diisi'}>
          {value || 'Belum diisi'}
        </p>
      </div>
    </div>
  );
}

export default function DetailInformasi({ user, tabVariants }: DetailInformasiProps) {
  const completionItems = [
    { label: 'Profil dasar', done: Boolean(user?.name && user?.email) },
    { label: 'Data institusi', done: Boolean(user?.fakultas && user?.program_studi) },
    { label: 'Identitas publikasi', done: Boolean(user?.scholar_id && user?.scopus_id) },
  ];

  const completed = completionItems.filter((item) => item.done).length;
  const completionPercent = Math.round((completed / completionItems.length) * 100);

  return (
    <motion.div
      key="info"
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >

      {/* Profile Completion */}
      <div className="rounded-[2rem] border border-slate-200/60 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Kelengkapan Profil
            </p>
            <p className="mt-1 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
              {completionPercent}%
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 dark:bg-amber-950/20">
            <Award className="h-6 w-6" />
          </div>
        </div>
        <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          {completionItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
              <BadgeCheck
                className={`h-4 w-4 ${item.done ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-700'}`}
              />
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Main info grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Informasi Akademik */}
        <div className="rounded-[2rem] border border-slate-200/60 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950/20 dark:text-primary-300">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">
                Informasi Akademik
              </h3>
              <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                Data utama akun dosen
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <InfoTile label="Alamat Email" value={user?.email} icon={Mail} />
            <InfoTile label="Nomor Telepon" value={user?.phone} icon={Phone} />
            <InfoTile label="Fakultas" value={user?.fakultas} icon={BookOpen} />
            <InfoTile label="Program Studi" value={user?.program_studi} icon={GraduationCap} />
            <InfoTile label="NIDN" value={user?.nidn} icon={BadgeCheck} />
            <InfoTile label="NIP" value={user?.nip} icon={Hash} />
          </div>
        </div>

        {/* Identitas Publikasi */}
        <div className="rounded-[2rem] border border-slate-200/60 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-300">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">
                Identitas Publikasi
              </h3>
              <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                ID sinkronisasi performa publikasi
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            <IdentityBadge label="Google Scholar" value={user?.scholar_id} icon={Globe} tone="blue" />
            <IdentityBadge label="Scopus" value={user?.scopus_id} icon={Hash} tone="rose" />
            <IdentityBadge label="Penta ID" value={user?.penta_id} icon={Fingerprint} tone="emerald" />
            <IdentityBadge label="NIDN / NIP" value={user?.nidn || user?.nip} icon={User} tone="violet" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
