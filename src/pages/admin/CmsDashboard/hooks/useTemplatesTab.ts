import React, { useState, useEffect } from 'react';
import { Template } from '../types/cmsDashboard.types';
import { cmsDashboardService } from '../services/cmsDashboardService';

/**
 * Hook untuk mengelola state dan side-effect pada tab Template Berkas.
 */
export function useTemplatesTab(triggerMessage: (text: string, type?: 'success' | 'error') => void) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingType, setUploadingType] = useState<string | null>(null);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const data = await cmsDashboardService.fetchTemplates();
      setTemplates(data.templates || []);
    } catch (e) {
      triggerMessage('Gagal mengambil data template.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      triggerMessage('Hanya file Excel (.xlsx, .xls) yang diperbolehkan.', 'error');
      return;
    }

    setUploadingType(type);
    const formData = new FormData();
    formData.append('type', type);
    formData.append('file', file);

    try {
      const data = await cmsDashboardService.uploadTemplate(formData);
      triggerMessage(data.message || 'Template berkas excel berhasil diunggah!');
      fetchTemplates();
    } catch (e: any) {
      triggerMessage(e.message || 'Gagal mengunggah template.', 'error');
    } finally {
      setUploadingType(null);
      if (e.target) e.target.value = '';
    }
  };

  const getTemplateForType = (type: string) => {
    return templates.find(t => t.type === type);
  };

  return {
    templates,
    loading,
    uploadingType,
    handleFileUpload,
    getTemplateForType,
    fetchTemplates
  };
}
