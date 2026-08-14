import React from 'react';
import { GraduationCap, Mail, Phone, BookOpen, BadgeCheck, Fingerprint } from 'lucide-react';
import { InfoTile } from './InfoTile';
import { DetailInformasiUser } from '../types/detailInformasi.types';

interface AcademicInfoProps {
  user: DetailInformasiUser | null | undefined;
}

export const AcademicInfo: React.FC<AcademicInfoProps> = ({ user }) => {
  return (
    <div className="rounded-[2rem] border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950/20 dark:text-primary-300">
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

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <InfoTile label="Alamat Email" value={user?.email} icon={Mail} />
        <InfoTile label="Nomor Telepon" value={user?.phone} icon={Phone} />
        <InfoTile label="Fakultas" value={user?.fakultas} icon={BookOpen} />
        <InfoTile label="Program Studi" value={user?.program_studi} icon={GraduationCap} />
        <InfoTile label="NIDN" value={user?.nidn} icon={BadgeCheck} />
        <InfoTile label="ID Penta Dosen" value={user?.penta_id} icon={Fingerprint} />
      </div>
    </div>
  );
};
