import * as React from "react"
import { Sparkles, RefreshCw, Layers, Users, CheckSquare, ShieldCheck, Database, Sliders } from "lucide-react"
import {
  DosenEcosystemIllustration,
  DosenSyncIllustration,
  DosenProfileIllustration,
  FacultyHubIllustration,
  FacultyVerifyIllustration,
  FacultyMonitoringIllustration,
  UniversityHubIllustration,
  MassSyncIllustration,
  CmsControlIllustration,
} from "./illustrations"

export type UserRole = "dosen" | "admin fakultas" | "admin penelitian"

export interface SlideItem {
  id: string
  badge: string
  title: string
  description: string
  icon: React.ReactNode
  Illustration: React.ComponentType
}

export const DOSEN_SLIDES: SlideItem[] = [
  {
    id: "dosen_welcome",
    badge: "PENTADOSEN 2.0",
    title: "Selamat Datang di PentaDosen",
    description: "Platform terintegrasi untuk pengelolaan KPI akademik, rekam jejak riset, dan pemantauan capaian Tri Dharma di lingkungan Universitas YARSI.",
    icon: <Sparkles className="w-5 h-5 text-accent dark:text-accent-on-dark" />,
    Illustration: DosenEcosystemIllustration,
  },
  {
    id: "dosen_sync",
    badge: "SINKRONISASI OTOMATIS",
    title: "Integrasi Scholar & Scopus",
    description: "Sinkronisasi publikasi dan sitasi secara otomatis dari Google Scholar dan Scopus untuk memperbarui data portofolio riset Anda tanpa input manual berulang.",
    icon: <RefreshCw className="w-5 h-5 text-accent dark:text-accent-on-dark" />,
    Illustration: DosenSyncIllustration,
  },
  {
    id: "dosen_profile",
    badge: "MULAI INTEGRASI",
    title: "Lengkapi Profil & Portofolio",
    description: "Hubungkan Google Scholar ID dan Scopus ID Anda di menu Integrasi Profil untuk mulai menarik riwayat publikasi dan memantau perolehan poin KPI.",
    icon: <Layers className="w-5 h-5 text-accent dark:text-accent-on-dark" />,
    Illustration: DosenProfileIllustration,
  },
]

export const ADMIN_FAKULTAS_SLIDES: SlideItem[] = [
  {
    id: "fakultas_welcome",
    badge: "ADMIN FAKULTAS",
    title: "Pusat Tata Kelola Riset Fakultas",
    description: "Kelola validasi berkas Tri Dharma, pantau produktivitas akademik dosen, dan koordinasikan capaian kinerja riset di seluruh program studi fakultas Anda.",
    icon: <Users className="w-5 h-5 text-accent dark:text-accent-on-dark" />,
    Illustration: FacultyHubIllustration,
  },
  {
    id: "fakultas_verify",
    badge: "WEWENANG VERIFIKASI",
    title: "Verifikasi Berkas Tri Dharma",
    description: "Tinjau dan validasi pengajuan publikasi, penelitian, HKI, dan buku ajar dari dosen fakultas secara cepat dan transparan sebelum poin KPI dihitung ke sistem.",
    icon: <CheckSquare className="w-5 h-5 text-accent dark:text-accent-on-dark" />,
    Illustration: FacultyVerifyIllustration,
  },
  {
    id: "fakultas_monitoring",
    badge: "MONITORING & INPUT",
    title: "Pemantauan Dosen & Bantuan Input",
    description: "Pantau daftar dan skor kinerja publikasi dosen di menu 'Daftar Dosen', serta manfaatkan fitur 'Dosen Mandiri' untuk membantu penginputan dokumen berkas.",
    icon: <Layers className="w-5 h-5 text-accent dark:text-accent-on-dark" />,
    Illustration: FacultyMonitoringIllustration,
  },
]

export const ADMIN_PENELITIAN_SLIDES: SlideItem[] = [
  {
    id: "penelitian_welcome",
    badge: "ADMIN PENELITIAN",
    title: "Pusat Riset Universitas & LPPM",
    description: "Wewenang institusional tingkat universitas untuk mengelola integrasi basis data riset, verifikasi lintas fakultas, analitik sitasi, dan kontrol sistem.",
    icon: <ShieldCheck className="w-5 h-5 text-accent dark:text-accent-on-dark" />,
    Illustration: UniversityHubIllustration,
  },
  {
    id: "penelitian_sync",
    badge: "SINKRONISASI MASSAL",
    title: "Otomasi Sinkronisasi Dosen",
    description: "Jalankan sinkronisasi data publikasi dan sitasi secara massal melalui menu 'Sinkronisasi' untuk memperbarui repositori riset seluruh dosen Universitas YARSI.",
    icon: <Database className="w-5 h-5 text-accent dark:text-accent-on-dark" />,
    Illustration: MassSyncIllustration,
  },
  {
    id: "penelitian_cms",
    badge: "KONTROL SISTEM & CMS",
    title: "Panel CMS & Manajemen Pengguna",
    description: "Kelola akun pengguna, penetapan peran (role assignment), pengaturan sistem, serta pantau jejak audit aktivitas secara menyeluruh pada Panel CMS.",
    icon: <Sliders className="w-5 h-5 text-accent dark:text-accent-on-dark" />,
    Illustration: CmsControlIllustration,
  },
]

export function getSlidesForRole(role: UserRole): SlideItem[] {
  if (role === "admin fakultas") return ADMIN_FAKULTAS_SLIDES
  if (role === "admin penelitian") return ADMIN_PENELITIAN_SLIDES
  return DOSEN_SLIDES
}

export function getStorageKeyForRole(role: UserRole): string {
  if (role === "admin fakultas") return "penta_onboarding_admin_fakultas_seen"
  if (role === "admin penelitian") return "penta_onboarding_admin_penelitian_seen"
  return "penta_onboarding_seen"
}

export function getCompletionRouteForRole(role: UserRole): string {
  if (role === "dosen") return "/profile?tab=integrasi"
  return "/admin/verify"
}
