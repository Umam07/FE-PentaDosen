import { Stethoscope, Cpu, Briefcase, Scale, Brain } from 'lucide-react';
import { FakultasMeta } from './types';

export const FAKULTAS_METADATA: Record<string, FakultasMeta> = {
  'Fakultas Kedokteran': { 
    icon: Stethoscope, 
    color: 'bg-emerald-500',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-100/50 dark:border-emerald-900/30',
    glowColor: 'group-hover:shadow-emerald-500/10',
    description: 'Mewujudkan Fakultas Kedokteran Islam bermutu tinggi, adaptif terhadap iptek, serta berkontribusi dalam kesehatan masyarakat nasional dan internasional.',
    prodi: ['Kedokteran']
  },
  'Fakultas Kedokteran Gigi': { 
    icon: Stethoscope, 
    color: 'bg-purple-500',
    textColor: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-500/10',
    badgeBg: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border-purple-100/50 dark:border-purple-900/30',
    glowColor: 'group-hover:shadow-purple-500/10',
    description: 'Mewujudkan Fakultas Kedokteran Gigi Islam bermutu tinggi di bidang kesehatan gigi dan mulut, serta mampu bersaing di tingkat nasional dan internasional.',
    prodi: ['Kedokteran Gigi']
  },
  'Fakultas Teknologi Informasi': { 
    icon: Cpu, 
    color: 'bg-sky-500',
    textColor: 'text-sky-600 dark:text-sky-400',
    bgColor: 'bg-sky-500/10',
    badgeBg: 'bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 border-sky-100/50 dark:border-sky-900/30',
    glowColor: 'group-hover:shadow-sky-500/10',
    description: 'Mewujudkan Fakultas Teknologi Informasi berkarakteristik Islam, terpandang, bermutu tinggi, serta mampu berkompetisi di tingkat nasional dan internasional.',
    prodi: ['Teknik Informatika', 'Perpustakaan dan Sains Informasi']
  },
  'Fakultas Ekonomi dan Bisnis': { 
    icon: Briefcase, 
    color: 'bg-amber-500',
    textColor: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-500/10',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-100/50 dark:border-amber-900/30',
    glowColor: 'group-hover:shadow-amber-500/10',
    description: 'Mewujudkan Fakultas Ekonomi dan Bisnis Islam bermutu tinggi, terpandang, berwibawa, serta mampu bersaing di tingkat nasional dan internasional.',
    prodi: ['Manajemen', 'Akuntansi']
  },
  'Fakultas Hukum': { 
    icon: Scale, 
    color: 'bg-red-500',
    textColor: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-500/10',
    badgeBg: 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-100/50 dark:border-red-900/30',
    glowColor: 'group-hover:shadow-red-500/10',
    description: 'Mewujudkan Fakultas Hukum berwawasan Islam, bermutu tinggi, berintegritas, serta mampu bersaing di tingkat nasional maupun regional Asia Tenggara.',
    prodi: ['Ilmu Hukum']
  },
  'Fakultas Psikologi': { 
    icon: Brain, 
    color: 'bg-pink-500',
    textColor: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-500/10',
    badgeBg: 'bg-pink-50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400 border-pink-100/50 dark:border-pink-900/30',
    glowColor: 'group-hover:shadow-pink-500/10',
    description: 'Mewujudkan Fakultas Psikologi Islami bermutu tinggi, terpandang, dan berwibawa dalam pengembangan Psikologi Kesehatan nasional dan internasional.',
    prodi: ['Psikologi']
  }
};

export const DEFAULT_NAMES = Object.keys(FAKULTAS_METADATA);
