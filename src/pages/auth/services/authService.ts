import { DashboardStats, LoginResponse, User } from '../types/auth.types';

/**
 * Service untuk menangani semua request API terkait autentikasi dan statistik publik.
 */
export const authService = {
  /**
   * Mengambil data statistik dashboard dosen dan dokumen.
   */
  async fetchDashboardStats(): Promise<DashboardStats> {
    const res = await fetch('/api/dashboard/stats');
    if (!res.ok) {
      throw new Error('Gagal mengambil data statistik');
    }
    return res.json();
  },

  /**
   * Melakukan request login dengan kredensial LDAP.
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      // Mengambil pesan error jika ada, jika tidak pakai default error
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Username atau password salah');
    }

    return res.json();
  },

  /**
   * Melakukan logout jika user masuk ke portal yang salah (misal admin di portal dosen).
   */
  async logout(userId: string | number): Promise<void> {
    const res = await fetch('/api/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    });

    if (!res.ok) {
      throw new Error('Gagal melakukan logout otomatis');
    }
  }
};
