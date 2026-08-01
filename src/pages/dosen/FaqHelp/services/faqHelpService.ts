import type { FaqItem, AnnouncementItem, SupportTicketItem } from '../types/faqHelp.types';

/**
 * Mengambil data FAQs dan Pengumuman sekaligus
 */
export async function fetchFaqsAndAnnouncements(): Promise<{ faqs: FaqItem[]; announcements: AnnouncementItem[] }> {
  const [faqsRes, annRes] = await Promise.all([
    fetch('/api/cms/faqs'),
    fetch('/api/dosen/announcements')
  ]);

  let faqs: FaqItem[] = [];
  let announcements: AnnouncementItem[] = [];

  if (faqsRes.ok) {
    const data = await faqsRes.json();
    faqs = data.faqs || [];
  }

  if (annRes.ok) {
    const data = await annRes.json();
    announcements = data.announcements || [];
  }

  return { faqs, announcements };
}

/**
 * Mengambil tiket dukungan milik dosen tertentu
 */
export async function fetchUserSupportTickets(userId: number): Promise<SupportTicketItem[]> {
  const res = await fetch(`/api/support-tickets?user_id=${userId}`);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const data = await res.json();
  return data.tickets || [];
}

/**
 * Mengirimkan tiket dukungan / pesan baru ke admin
 */
export async function createSupportTicket(formData: FormData): Promise<{ ok: boolean; data: any }> {
  const res = await fetch('/api/support-tickets', {
    method: 'POST',
    body: formData
  });
  const data = await res.json();
  return { ok: res.ok, data };
}
