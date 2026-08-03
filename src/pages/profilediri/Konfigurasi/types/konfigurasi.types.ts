import React from 'react';

export type IntegrationTone = 'scholar' | 'scopus';

export interface KonfigurasiUser {
  scholar_id?: string;
  scopus_id?: string;
  [key: string]: any;
}

export interface KonfigurasiProps {
  user: KonfigurasiUser | null | undefined;
  setUser: (user: any) => void;
  scholarId: string;
  setScholarId: (id: string) => void;
  scopusId: string;
  setScopusId: (id: string) => void;
  scholarData: any;
  setScholarData: (data: any) => void;
  scopusData: any;
  setScopusData: (data: any) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  checkingInfo: boolean;
  setCheckingInfo: (checking: boolean) => void;
  checkingScopus: boolean;
  setCheckingScopus: (checking: boolean) => void;
  checkedAuthor: any;
  setCheckedAuthor: (author: any) => void;
  checkedScopusAuthor: any;
  setCheckedScopusAuthor: (author: any) => void;
  handleCheckId: () => Promise<void>;
  handleSaveScholarId: () => Promise<void>;
  handleCheckScopusId: () => Promise<void>;
  handleSaveScopusId: () => Promise<void>;
  handleDeleteScholarId: () => Promise<void>;
  handleDeleteScopusId: () => Promise<void>;
  handleSync: () => Promise<void>;
  handleSyncScopus: () => Promise<void>;
  handleSyncAll: () => Promise<void>;
  message: { text: string; type: 'success' | 'error' | 'info' | '' };
  setMessage: (msg: { text: string; type: 'success' | 'error' | 'info' | '' }) => void;
  tabVariants: any;
}

export interface MetricTileProps {
  label: string;
  value: any;
  icon: React.ComponentType<any>;
}

export interface AuthorPreviewProps {
  author: any;
  tone: IntegrationTone;
}

export interface IntegrationCardProps {
  title: string;
  description: string;
  type: IntegrationTone;
  icon: React.ComponentType<any>;
  value: string;
  savedValue?: string;
  placeholder: string;
  data: any;
  checkedAuthor: any;
  checking: boolean;
  loading: boolean;
  onChange: (value: string) => void;
  onCheck: () => Promise<void>;
  onSave: () => Promise<void>;
  onDelete: () => void;
  onSync: () => Promise<void>;
}
