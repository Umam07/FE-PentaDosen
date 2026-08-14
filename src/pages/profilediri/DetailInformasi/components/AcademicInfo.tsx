import React from 'react';
import { GraduationCap, Mail, Phone, BookOpen, BadgeCheck, Fingerprint } from 'lucide-react';
import { InfoTile } from './InfoTile';
import { DetailInformasiUser } from '../types/detailInformasi.types';

interface AcademicInfoProps {
  user: DetailInformasiUser | null | undefined;
}

export const AcademicInfo: React.FC<AcademicInfoProps> = ({ user }) => {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3.5">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Informasi Akademik & Identitas Dosen
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Data identitas resmi kelembagaan, akun sistem, dan kontak
          </p>
        </div>
      </div>

      {/* Grid Data Dosen */}
      <div className="space-y-4">
        {/* Section 1: Identitas Resmi & Sistem */}
        <div>
          <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Identitas Resmi & Sistem
          </p>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <InfoTile
              label="Nomor Induk Dosen Nasional (NIDN)"
              value={user?.nidn}
              icon={BadgeCheck}
              copyable
              mono
            />
            <InfoTile
              label="ID Penta Dosen"
              value={user?.penta_id}
              icon={Fingerprint}
              copyable
              mono
            />
          </div>
        </div>

        {/* Section 2: Data Institusi & Kontak */}
        <div className="pt-2">
          <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Institusi & Kontak
          </p>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            <InfoTile
              label="Fakultas"
              value={user?.fakultas}
              icon={BookOpen}
            />
            <InfoTile
              label="Program Studi"
              value={user?.program_studi}
              icon={GraduationCap}
            />
            <InfoTile
              label="Alamat Email"
              value={user?.email}
              icon={Mail}
              copyable
            />
            <InfoTile
              label="Nomor Telepon"
              value={user?.phone}
              icon={Phone}
              copyable
            />
          </div>
        </div>
      </div>
    </div>
  );
};

