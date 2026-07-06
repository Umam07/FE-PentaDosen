export interface User {
  id: string | number;
  role: string;
  username?: string;
  email?: string;
  name?: string;
  [key: string]: any;
}

export interface LoginResponse {
  user: User;
}

export interface DashboardStats {
  total_docs?: number;
  total_research?: number;
  total_scholar?: number;
  total_scopus?: number;
  total_dosen?: number;
}
