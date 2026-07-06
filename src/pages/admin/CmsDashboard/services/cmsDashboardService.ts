import { 
  UsersResponse, 
  KpiWeightsResponse, 
  KpiWeight,
  KpiSettings, 
  AnnouncementsResponse, 
  Announcement, 
  FaqsResponse, 
  TemplatesResponse 
} from '../types/cmsDashboard.types';

/**
 * Service untuk memusatkan komunikasi dengan backend API terkait CMS Dashboard.
 */
export const cmsDashboardService = {
  // --- HAK AKSES & USERS ---
  async fetchUsers(search: string, role: string, page: number, perPage: number): Promise<UsersResponse> {
    const res = await fetch(`/api/admin/cms/users?search=${encodeURIComponent(search)}&role=${encodeURIComponent(role)}&page=${page}&per_page=${perPage}`);
    if (!res.ok) {
      throw new Error('Gagal mengambil data user.');
    }
    return res.json();
  },

  async assignRole(userId: string | number, payload: { role: string; fakultas: string; program_studi: string }): Promise<{ message?: string }> {
    const res = await fetch(`/api/admin/cms/users/${userId}/assign-role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Gagal memperbarui hak akses.');
    }
    return data;
  },

  // --- KPI ---
  async fetchWeights(): Promise<KpiWeightsResponse> {
    const res = await fetch('/api/cms/weights');
    if (!res.ok) {
      throw new Error('Gagal mengambil data bobot KPI.');
    }
    return res.json();
  },

  async saveWeights(weights: KpiWeight[]): Promise<void> {
    const res = await fetch('/api/cms/weights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weights })
    });
    if (!res.ok) {
      throw new Error('Gagal menyimpan bobot poin.');
    }
  },

  async fetchSettings(): Promise<KpiSettings> {
    const res = await fetch('/api/cms/settings');
    if (!res.ok) {
      throw new Error('Gagal mengambil konfigurasi periode.');
    }
    return res.json();
  },

  async saveSettings(payload: KpiSettings): Promise<void> {
    const res = await fetch('/api/cms/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      throw new Error('Gagal menyimpan periode akreditasi.');
    }
  },

  async addWeightCategory(category: string, weightValue: number): Promise<{ message?: string }> {
    const res = await fetch('/api/cms/weights/new', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category,
        weight_value: weightValue
      })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Gagal menambahkan kategori.');
    }
    return data;
  },

  async deleteWeightCategory(category: string): Promise<void> {
    const res = await fetch(`/api/cms/weights/${encodeURIComponent(category)}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      throw new Error('Gagal menghapus kategori.');
    }
  },

  // --- PENGUMUMAN ---
  async fetchAnnouncements(): Promise<AnnouncementsResponse> {
    const res = await fetch('/api/cms/announcements');
    if (!res.ok) {
      throw new Error('Gagal mengambil data pengumuman.');
    }
    return res.json();
  },

  async createAnnouncement(payload: Omit<Announcement, 'id'>): Promise<{ message?: string }> {
    const res = await fetch('/api/cms/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Gagal membuat pengumuman.');
    }
    return data;
  },

  async updateAnnouncement(id: number, payload: Omit<Announcement, 'id'>): Promise<{ message?: string }> {
    const res = await fetch(`/api/cms/announcements/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Gagal memperbarui pengumuman.');
    }
    return data;
  },

  async deleteAnnouncement(id: number): Promise<void> {
    const res = await fetch(`/api/cms/announcements/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      throw new Error('Gagal menghapus pengumuman.');
    }
  },

  // --- FAQ & PANDUAN ---
  async fetchFaqs(): Promise<FaqsResponse> {
    const res = await fetch('/api/cms/faqs');
    if (!res.ok) {
      throw new Error('Gagal mengambil data FAQ.');
    }
    return res.json();
  },

  async saveFaq(formData: FormData, id?: number | null): Promise<{ message?: string }> {
    const url = id ? `/api/cms/faqs/${id}` : '/api/cms/faqs';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      body: formData
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Gagal menyimpan panduan.');
    }
    return data;
  },

  async deleteFaq(id: number): Promise<void> {
    const res = await fetch(`/api/cms/faqs/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      throw new Error('Gagal menghapus panduan.');
    }
  },

  // --- TEMPLATES ---
  async fetchTemplates(): Promise<TemplatesResponse> {
    const res = await fetch('/api/cms/templates');
    if (!res.ok) {
      throw new Error('Gagal mengambil data template.');
    }
    return res.json();
  },

  async uploadTemplate(formData: FormData): Promise<{ message?: string }> {
    const res = await fetch('/api/cms/templates/upload', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Gagal mengunggah template.');
    }
    return data;
  }
};
