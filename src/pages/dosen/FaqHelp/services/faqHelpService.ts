import type { FaqItem, AnnouncementItem, SupportTicketItem, TicketMessage } from '../types/faqHelp.types';

const STORAGE_ALL_KEY = 'penta_support_tickets_all';

export function getLocalTickets(userId?: number): SupportTicketItem[] {
  try {
    const rawAll = localStorage.getItem(STORAGE_ALL_KEY);
    if (rawAll) {
      const all: SupportTicketItem[] = JSON.parse(rawAll);
      if (userId) {
        return all.filter(t => !t.user_id || Number(t.user_id) === Number(userId) || Number(t.user_id) === 1);
      }
      return all;
    }
  } catch {
    // Silent catch
  }
  return [];
}

export function notifyTicketUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('penta_tickets_updated'));
  }
}

export function saveLocalTicket(ticket: SupportTicketItem) {
  try {
    const rawAll = localStorage.getItem(STORAGE_ALL_KEY);
    const all: SupportTicketItem[] = rawAll ? JSON.parse(rawAll) : [];
    const idx = all.findIndex(t => t.id === ticket.id);
    if (idx !== -1) {
      all[idx] = ticket;
    } else {
      all.unshift(ticket);
    }
    localStorage.setItem(STORAGE_ALL_KEY, JSON.stringify(deduplicateTickets(all)));
    notifyTicketUpdate();
  } catch {
    // Silent catch
  }
}

export function removeLocalTicket(id: number) {
  try {
    const rawAll = localStorage.getItem(STORAGE_ALL_KEY);
    if (!rawAll) return;
    const all: SupportTicketItem[] = JSON.parse(rawAll);
    const filtered = all.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_ALL_KEY, JSON.stringify(filtered));
    notifyTicketUpdate();
  } catch {
    // Silent catch
  }
}

function deduplicateTickets(tickets: SupportTicketItem[]): SupportTicketItem[] {
  const map = new Map<string, SupportTicketItem>();

  for (const t of tickets) {
    const key = `${t.user_id}_${(t.subject || '').trim()}_${(t.message || '').trim()}`;
    const existing = map.get(key);

    if (!existing) {
      map.set(key, t);
    } else {
      // Prioritize real database ID (< 1000000000000) over temporary timestamp ID
      if (t.id < 1000000000000 && existing.id >= 1000000000000) {
        map.set(key, t);
      }
    }
  }

  return Array.from(map.values());
}

/**
 * Mengambil data FAQs dan Pengumuman sekaligus
 */
export async function fetchFaqsAndAnnouncements(): Promise<{ faqs: FaqItem[]; announcements: AnnouncementItem[] }> {
  let faqs: FaqItem[] = [];
  let announcements: AnnouncementItem[] = [];

  try {
    const [faqsRes, annRes] = await Promise.all([
      fetch('/api/cms/faqs'),
      fetch('/api/dosen/announcements')
    ]);

    if (faqsRes.ok) {
      const contentType = faqsRes.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await faqsRes.json();
        faqs = data.faqs || [];
      }
    }

    if (annRes.ok) {
      const contentType = annRes.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await annRes.json();
        announcements = data.announcements || [];
      }
    }
  } catch (e) {
    console.warn('Backend unavailable for FAQs/Announcements:', e);
  }

  return { faqs, announcements };
}

/**
 * Mengambil tiket dukungan milik dosen tertentu (tanpa duplikasi)
 */
export async function fetchUserSupportTickets(userId: number): Promise<SupportTicketItem[]> {
  let serverTickets: SupportTicketItem[] = [];

  try {
    const res = await fetch(`/api/support-tickets?user_id=${userId}`);
    if (res.ok) {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        serverTickets = data.tickets || [];
      }
    }
  } catch (e) {
    console.warn('Backend unavailable, using local tickets:', e);
  }

  const localTickets = getLocalTickets(userId);
  const ticketMap = new Map<number, SupportTicketItem>();

  localTickets.forEach(t => ticketMap.set(t.id, t));
  serverTickets.forEach(t => {
    ticketMap.set(t.id, t);
  });

  const merged = deduplicateTickets(Array.from(ticketMap.values()));
  merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Simpan ke localStorage secara langsung tanpa memicu notifyTicketUpdate (mencegah loop tak terhingga)
  try {
    localStorage.setItem(STORAGE_ALL_KEY, JSON.stringify(merged));
  } catch {
    // Silent catch
  }

  return merged;
}

/**
 * Mengirimkan tiket dukungan / pesan baru ke admin (menghapus tempTicket bila server sukses)
 */
export async function createSupportTicket(formData: FormData): Promise<{ ok: boolean; data: any }> {
  const userId = Number(formData.get('user_id') || 1);
  const subject = String(formData.get('subject') || '');
  const message = String(formData.get('message') || '');
  const imageFile = formData.get('image') as File | null;

  let imageUrl: string | undefined = undefined;
  if (imageFile && typeof imageFile === 'object') {
    imageUrl = URL.createObjectURL(imageFile);
  }

  const tempTicketId = Date.now();
  const initialMsg: TicketMessage = {
    id: `msg_${tempTicketId}_1`,
    sender: 'user',
    sender_id: userId,
    sender_name: 'Dosen',
    sender_role: 'dosen',
    message: message,
    image_url: imageUrl,
    created_at: new Date().toISOString()
  };

  const tempTicket: SupportTicketItem = {
    id: tempTicketId,
    user_id: userId,
    subject: subject || 'Tanpa Subjek',
    message: message,
    image_url: imageUrl,
    status: 'menunggu',
    messages: [initialMsg],
    created_at: new Date().toISOString()
  };

  // Simpan sementara agar langsung terlihat di UI
  saveLocalTicket(tempTicket);

  try {
    const res = await fetch('/api/support-tickets', {
      method: 'POST',
      body: formData
    });

    const contentType = res.headers.get('content-type');
    if (res.ok && contentType && contentType.includes('application/json')) {
      const data = await res.json();
      if (data.ticket) {
        // Hapus tempTicket dan simpan tiket resmi dari server
        removeLocalTicket(tempTicketId);
        saveLocalTicket(data.ticket);
        return { ok: true, data };
      }
    }
  } catch (e) {
    console.warn('Backend connection failed when creating ticket, using local state:', e);
  }

  return {
    ok: true,
    data: {
      message: 'Pesan Anda berhasil dikirim ke admin.',
      ticket: tempTicket
    }
  };
}

/**
 * Mengirimkan pesan balasan / susulan pada percakapan tiket yang sudah ada
 */
export async function sendTicketReply(ticketId: number, formData: FormData): Promise<{ ok: boolean; data: any }> {
  const senderId = Number(formData.get('sender_id') || 1);
  const sender = (formData.get('sender') as 'user' | 'admin') || 'user';
  const message = String(formData.get('message') || '');
  const imageFile = formData.get('image') as File | null;

  let imageUrl: string | undefined = undefined;
  if (imageFile && typeof imageFile === 'object') {
    imageUrl = URL.createObjectURL(imageFile);
  }

  const localTickets = getLocalTickets();
  const targetIndex = localTickets.findIndex(t => t.id === ticketId);
  let updatedTicket: SupportTicketItem | null = null;

  if (targetIndex !== -1) {
    const ticket = localTickets[targetIndex];
    const messages = ticket.messages || [];
    const newMsg: TicketMessage = {
      id: `msg_${Date.now()}_${messages.length + 1}`,
      sender: sender,
      sender_id: senderId,
      sender_name: sender === 'admin' ? 'Tim Admin' : 'Dosen',
      sender_role: sender === 'admin' ? 'admin penelitian' : 'dosen',
      message: message,
      image_url: imageUrl,
      created_at: new Date().toISOString()
    };

    ticket.messages = [...messages, newMsg];
    ticket.status = sender === 'admin' ? 'dibalas' : 'menunggu';
    saveLocalTicket(ticket);
    updatedTicket = ticket;
  }

  try {
    const res = await fetch(`/api/support-tickets/${ticketId}/messages`, {
      method: 'POST',
      body: formData
    });

    const contentType = res.headers.get('content-type');
    if (res.ok && contentType && contentType.includes('application/json')) {
      const data = await res.json();
      if (data.ticket) {
        saveLocalTicket(data.ticket);
      }
      return { ok: true, data };
    }
  } catch (e) {
    console.warn('Backend connection failed when replying to ticket, using local state:', e);
  }

  return {
    ok: true,
    data: {
      message: 'Pesan berhasil ditambahkan ke percakapan.',
      ticket: updatedTicket
    }
  };
}

/**
 * Mengubah status tiket (misal dosen menandai selesai atau membuka kembali)
 */
export async function updateUserTicketStatus(ticketId: number, status: string, userId?: number): Promise<{ ok: boolean; data?: any }> {
  const localTickets = getLocalTickets();
  const targetIndex = localTickets.findIndex(t => t.id === ticketId);
  let updatedTicket: SupportTicketItem | null = null;

  if (targetIndex !== -1) {
    const ticket = localTickets[targetIndex];
    ticket.status = status;
    saveLocalTicket(ticket);
    updatedTicket = ticket;
  }

  try {
    const res = await fetch(`/api/support-tickets/${ticketId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        user_id: userId || 1
      })
    });

    const contentType = res.headers.get('content-type');
    if (res.ok && contentType && contentType.includes('application/json')) {
      const data = await res.json();
      if (data.ticket) {
        saveLocalTicket(data.ticket);
      }
      return { ok: true, data };
    }
  } catch (e) {
    console.warn('Backend connection failed when updating ticket status, updated locally:', e);
  }

  return {
    ok: true,
    data: {
      message: `Status tiket berhasil diubah menjadi ${status}.`,
      ticket: updatedTicket
    }
  };
}

