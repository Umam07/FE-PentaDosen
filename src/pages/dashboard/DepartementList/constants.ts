import { Stethoscope, Cpu, Briefcase, Scale, Brain } from 'lucide-react';
import { FakultasMeta } from './types';

export const FAKULTAS_METADATA: Record<string, FakultasMeta> = {
  'Fakultas Kedokteran': { 
    icon: Stethoscope, 
    color: 'bg-[#6a9158]',
    textColor: 'text-[#6a9158] dark:text-[#8cb878]',
    bgColor: 'bg-[#6a9158]/10',
    badgeBg: 'bg-[#6a9158]/10 text-[#6a9158] dark:text-[#8cb878] border-[#6a9158]/20',
    glowColor: 'group-hover:shadow-[#6a9158]/10',
    description: 'Mewujudkan Fakultas Kedokteran Islam bermutu tinggi, adaptif terhadap iptek, serta berkontribusi dalam kesehatan masyarakat nasional dan internasional.',
    prodi: ['Kedokteran']
  },
  'Fakultas Kedokteran Gigi': { 
    icon: Stethoscope, 
    color: 'bg-[#8773ae]',
    textColor: 'text-[#8773ae] dark:text-[#a897cc]',
    bgColor: 'bg-[#8773ae]/10',
    badgeBg: 'bg-[#8773ae]/10 text-[#8773ae] dark:text-[#a897cc] border-[#8773ae]/20',
    glowColor: 'group-hover:shadow-[#8773ae]/10',
    description: 'Mewujudkan Fakultas Kedokteran Gigi Islam bermutu tinggi di bidang kesehatan gigi dan mulut, serta mampu bersaing di tingkat nasional dan internasional.',
    prodi: ['Kedokteran Gigi']
  },
  'Fakultas Teknologi Informasi': { 
    icon: Cpu, 
    color: 'bg-[#e09a67]',
    textColor: 'text-[#e09a67] dark:text-[#f2b58a]',
    bgColor: 'bg-[#e09a67]/10',
    badgeBg: 'bg-[#e09a67]/10 text-[#e09a67] dark:text-[#f2b58a] border-[#e09a67]/20',
    glowColor: 'group-hover:shadow-[#e09a67]/10',
    description: 'Mewujudkan Fakultas Teknologi Informasi berkarakteristik Islam, terpandang, bermutu tinggi, serta mampu berkompetisi di tingkat nasional dan internasional.',
    prodi: ['Teknik Informatika', 'Perpustakaan dan Sains Informasi']
  },
  'Fakultas Ekonomi dan Bisnis': { 
    icon: Briefcase, 
    color: 'bg-[#036aac]',
    textColor: 'text-[#036aac] dark:text-[#429cd4]',
    bgColor: 'bg-[#036aac]/10',
    badgeBg: 'bg-[#036aac]/10 text-[#036aac] dark:text-[#429cd4] border-[#036aac]/20',
    glowColor: 'group-hover:shadow-[#036aac]/10',
    description: 'Mewujudkan Fakultas Ekonomi dan Bisnis Islam bermutu tinggi, terpandang, berwibawa, serta mampu bersaing di tingkat nasional dan internasional.',
    prodi: ['Manajemen', 'Akuntansi']
  },
  'Fakultas Hukum': { 
    icon: Scale, 
    color: 'bg-[#a93246]',
    textColor: 'text-[#a93246] dark:text-[#d65a6e]',
    bgColor: 'bg-[#a93246]/10',
    badgeBg: 'bg-[#a93246]/10 text-[#a93246] dark:text-[#d65a6e] border-[#a93246]/20',
    glowColor: 'group-hover:shadow-[#a93246]/10',
    description: 'Mewujudkan Fakultas Hukum berwawasan Islam, bermutu tinggi, berintegritas, serta mampu bersaing di tingkat nasional maupun regional Asia Tenggara.',
    prodi: ['Ilmu Hukum']
  },
  'Fakultas Psikologi': { 
    icon: Brain, 
    color: 'bg-[#8d396a]',
    textColor: 'text-[#8d396a] dark:text-[#bf6399]',
    bgColor: 'bg-[#8d396a]/10',
    badgeBg: 'bg-[#8d396a]/10 text-[#8d396a] dark:text-[#bf6399] border-[#8d396a]/20',
    glowColor: 'group-hover:shadow-[#8d396a]/10',
    description: 'Mewujudkan Fakultas Psikologi Islami bermutu tinggi, terpandang, dan berwibawa dalam pengembangan Psikologi Kesehatan nasional dan internasional.',
    prodi: ['Psikologi']
  }
};

export const DEFAULT_NAMES = Object.keys(FAKULTAS_METADATA);
