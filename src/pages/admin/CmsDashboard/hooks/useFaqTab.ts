import React, { useState, useEffect } from 'react';
import { Faq } from '../types/cmsDashboard.types';
import { cmsDashboardService } from '../services/cmsDashboardService';

/**
 * Hook untuk mengelola state dan side-effect pada tab FAQ & Panduan.
 */
export function useFaqTab(triggerMessage: (text: string, type?: 'success' | 'error') => void) {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [editingId, setEditingId] = useState<number | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('Umum');
  const [orderIndex, setOrderIndex] = useState('0');
  const [saving, setSaving] = useState(false);
  const [isOpenForm, setIsOpenForm] = useState(false);

  // PDF specific states
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [existingFileUrl, setExistingFileUrl] = useState<string | null>(null);
  const [removeFile, setRemoveFile] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<{ fileUrl: string; title: string; category: string } | null>(null);

  // Delete state
  const [deleteFaq, setDeleteFaq] = useState<Faq | null>(null);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const data = await cmsDashboardService.fetchFaqs();
      setFaqs(data.faqs || []);
    } catch (e) {
      triggerMessage('Gagal mengambil data FAQ.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setQuestion('');
    setAnswer('');
    setCategory('Umum');
    setOrderIndex('0');
    setPdfFile(null);
    setExistingFileUrl(null);
    setRemoveFile(false);
    setIsOpenForm(true);
  };

  const handleOpenEdit = (f: Faq) => {
    setEditingId(f.id);
    setQuestion(f.question);
    setAnswer(f.answer);
    setCategory(f.category);
    setOrderIndex((f.order_index ?? 0).toString());
    setPdfFile(null);
    setExistingFileUrl(f.file_url || null);
    setRemoveFile(false);
    setIsOpenForm(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (file.type !== 'application/pdf') {
        triggerMessage('File harus berformat PDF.', 'error');
        e.target.value = '';
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        triggerMessage('Ukuran file maksimal 10MB.', 'error');
        e.target.value = '';
        return;
      }
      setPdfFile(file);
      setRemoveFile(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('question', question);
      formData.append('answer', answer);
      formData.append('category', category);
      formData.append('order_index', (parseInt(orderIndex) || 0).toString());

      if (pdfFile) {
        formData.append('file', pdfFile);
      }

      if (editingId) {
        formData.append('_method', 'PUT');
        if (removeFile) {
          formData.append('remove_file', 'true');
        }
      }

      const data = await cmsDashboardService.saveFaq(formData, editingId);
      triggerMessage(data.message || 'Panduan berhasil disimpan!');
      setIsOpenForm(false);
      fetchFaqs();
    } catch (e: any) {
      triggerMessage(e.message || 'Terjadi kesalahan.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return {
    faqs,
    loading,
    editingId,
    question,
    setQuestion,
    answer,
    setAnswer,
    category,
    setCategory,
    orderIndex,
    setOrderIndex,
    saving,
    isOpenForm,
    setIsOpenForm,
    pdfFile,
    setPdfFile,
    existingFileUrl,
    removeFile,
    setRemoveFile,
    previewDoc,
    setPreviewDoc,
    deleteFaq,
    setDeleteFaq,
    handleOpenCreate,
    handleOpenEdit,
    handleFileChange,
    handleSave,
    fetchFaqs
  };
}
