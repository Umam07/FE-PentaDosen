import React from 'react';

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
}

export interface DetailInformasiProps {
  user: DetailInformasiUser | null | undefined;
  tabVariants: any;
}

export interface InfoTileProps {
  label: string;
  value?: string;
  icon: React.ComponentType<any>;
}

export type IdentityBadgeTone = 'blue' | 'rose' | 'orange' | 'emerald' | 'violet';


export interface IdentityBadgeProps {
  label: string;
  value?: string;
  icon: React.ComponentType<any>;
  tone: IdentityBadgeTone;
}
