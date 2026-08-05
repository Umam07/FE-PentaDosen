import { BookOpen, BookText, Library } from 'lucide-react';

export const BUKU_CATEGORIES = [
  { label: 'Buku Referensi', value: 'Buku Referensi', points: 40, desc: 'Buku kajian mendalam bidang ilmu', icon: BookOpen, color: 'blue' },
  { label: 'Buku Ajar', value: 'Buku Ajar', points: 20, desc: 'Buku pegangan proses belajar mengajar', icon: BookText, color: 'emerald' },
  { label: 'Buku Monograf', value: 'Buku Monograf', points: 20, desc: 'Buku hasil penelitian tunggal / spesifik', icon: Library, color: 'amber' },
];

