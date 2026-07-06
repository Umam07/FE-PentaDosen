import React, { useState, useEffect } from 'react';
import { Announcement } from '../types/cmsDashboard.types';
import { cmsDashboardService } from '../services/cmsDashboardService';

/**
 * Hook untuk mengelola state dan side-effect pada tab Pengumuman.
 */
export function useAnnouncementsTab(
  triggerMessage: (text: string, type?: 'success' | 'error') => void,
  user: { id: string | number }
) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [expiresAt, setExpiresAt] = useState('');
  const [saving, setSaving] = useState(false);
  const [isOpenForm, setIsOpenForm] = useState(false);

  // Delete state
  const [deleteAnnouncement, setDeleteAnnouncement] = useState<Announcement | null>(null);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await cmsDashboardService.fetchAnnouncements();
      setAnnouncements(data.announcements || []);
    } catch (e) {
      triggerMessage('Gagal mengambil data pengumuman.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setIsActive(true);
    setExpiresAt('');
    setIsOpenForm(true);
  };

  const handleOpenEdit = (a: Announcement) => {
    setEditingId(a.id);
    setTitle(a.title);
    setContent(a.content);
    setIsActive(a.is_active);
    setExpiresAt(a.expires_at ? a.expires_at.substring(0, 10) : '');
    setIsOpenForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title,
        content,
        is_active: isActive,
        expires_at: expiresAt || null,
        created_by: user.id
      };

      let data;
      if (editingId) {
        data = await cmsDashboardService.updateAnnouncement(editingId, payload);
      } else {
        data = await cmsDashboardService.createAnnouncement(payload);
      }

      triggerMessage(data.message || 'Pengumuman berhasil disimpan!');
      setIsOpenForm(false);
      fetchAnnouncements();
    } catch (e: any) {
      triggerMessage(e.message || 'Terjadi kesalahan.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return {
    announcements,
    loading,
    editingId,
    title,
    setTitle,
    content,
    setContent,
    isActive,
    setIsActive,
    expiresAt,
    setExpiresAt,
    saving,
    isOpenForm,
    setIsOpenForm,
    deleteAnnouncement,
    setDeleteAnnouncement,
    handleOpenCreate,
    handleOpenEdit,
    handleSave,
    fetchAnnouncements
  };
}
