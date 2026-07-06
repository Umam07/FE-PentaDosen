export interface User {
  id: string | number;
  name: string;
  email: string;
  nidn: string | null;
  role: string;
  fakultas: string | null;
  program_studi: string | null;
  avatar?: string | null;
}

export interface UsersResponse {
  data: User[];
  last_page: number;
  total: number;
}

export interface KpiWeight {
  category: string;
  weight_value: number;
}

export interface KpiWeightsResponse {
  weights: KpiWeight[];
}

export interface KpiSettings {
  kpi_period_start: string | null;
  kpi_period_end: string | null;
  kpi_period_label: string | null;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  is_active: boolean;
  expires_at: string | null;
  created_by: string | number;
  created_at?: string;
}

export interface AnnouncementsResponse {
  announcements: Announcement[];
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
  category: string;
  order_index: number;
  file_url: string | null;
}

export interface FaqsResponse {
  faqs: Faq[];
}

export interface Template {
  type: string;
  file_name: string;
  uploaded_at: string;
}

export interface TemplatesResponse {
  templates: Template[];
}
