export interface DetailInformasiUser {
  name?: string;
  email?: string;
  fakultas?: string;
  program_studi?: string;
  scholar_id?: string;
  scopus_id?: string;
  phone?: string;
  nidn?: string;
  penta_id?: string;
  role?: string;
}

export interface DetailInformasiProps {
  user: DetailInformasiUser | null | undefined;
  tabVariants?: any;
  onNavigateTab?: (tab: 'integrasi' | 'info') => void;
}

export interface InfoTileProps {
  label: string;
  value?: string;
  icon: React.ComponentType<any>;
  copyable?: boolean;
  mono?: boolean;
}

export type IdentityBadgeTone = 'blue' | 'orange' | 'emerald' | 'slate';

export interface IdentityBadgeProps {
  platform: 'scholar' | 'scopus';
  label: string;
  description: string;
  value?: string;
  icon: React.ComponentType<any>;
  onNavigateTab?: (tab: 'integrasi' | 'info') => void;
}

