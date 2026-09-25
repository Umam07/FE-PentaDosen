import { TourStep } from '../../../../components/features/tour';

export const INTEGRASI_TOUR_STORAGE_KEY = 'penta_integrasi_tour_seen';

export const INTEGRASI_DOSEN_STEPS: TourStep[] = [
  {
    targetId: 'tour-sync-sinta-btn',
    badge: 'Langkah 1 dari 2',
    title: 'Isi ID dari SINTA',
    description:
      'Klik tombol ini untuk mendeteksi Google Scholar ID & Scopus ID Anda secara otomatis dari SINTA tanpa perlu input manual.',
    placement: 'bottom',
  },
  {
    targetId: 'tour-sync-all-btn',
    badge: 'Langkah 2 dari 2',
    title: 'Sinkronkan Semua',
    description:
      'Setelah ID terisi, klik tombol ini untuk menarik seluruh data publikasi dan sitasi Anda ke sistem.',
    placement: 'bottom',
  },
];
