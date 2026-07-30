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

export interface SupportTicket {
  id: number;
  user_id: number;
  subject: string | null;
  message: string;
  status: 'menunggu' | 'dibalas' | 'selesai';
  admin_reply: string | null;
  replied_by: number | null;
  replied_at: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
    fakultas: string | null;
    program_studi: string | null;
  };
  replied_by_admin?: {
    id: number;
    name: string;
    role: string;
  };
}

export interface SupportTicketCounts {
  menunggu: number;
  dibalas: number;
  selesai: number;
  total: number;
}

