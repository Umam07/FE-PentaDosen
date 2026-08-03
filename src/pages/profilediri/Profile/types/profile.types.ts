import React from 'react';

export interface ProfileUser {
  id?: string;
  name?: string;
  avatar?: string | null;
  role?: string;
  scholar_id?: string | null;
  scopus_id?: string | null;
  program_studi?: string;
  penta_id?: string | null;
  [key: string]: any;
}

export interface ProfileStat {
  label: string;
  val: string;
  icon: React.ComponentType<any>;
  color: string;
}

export interface ToastMessage {
  text: string;
  type: 'success' | 'error' | 'info' | '';
}
