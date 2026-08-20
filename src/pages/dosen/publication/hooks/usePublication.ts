import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import type {
  PublicationDoc, ApprovedResearch, WeightCategory,
  UserSession, PreviewDocState, StatsInfo, SintaFilterType
} from '../types/publication.types';
import {
  fetchUserDocuments, fetchCategoryWeights, fetchApprovedResearch, uploadPdfDocument
} from '../services/publicationService';
import { generatePublicationExcelTemplate } from '../utils/publicationUtils';
import { calculateScholarPoints } from '../../dashboard/pointsCalculator';

export function usePublication(user: UserSession) {
  const location = useLocation();
  const urlKategori = useMemo(() => {
    return new URLSearchParams(location.search).get('kategori') || '';
  }, [location.search]);

  const [selectedDocForDetail, setSelectedDocForDetail] = useState<any>(null);
  const [documents, setDocuments] = useState<PublicationDoc[]>([]);

  const activeDetailDoc = useMemo(() => {
    if (!selectedDocForDetail) return null;
    return documents.find((d) => d.id === selectedDocForDetail.id) || selectedDocForDetail;
  }, [documents, selectedDocForDetail]);

  const [weights, setWeights] = useState<WeightCategory[]>(() => {
    try {
      const cached = localStorage.getItem('penta_weights');
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      return [];
    }
  });

  const [category, setCategory] = useState('');
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [isWeightsLoading, setIsWeightsLoading] = useState(() => {
    try {
      return !localStorage.getItem('penta_weights');
    } catch (e) {
      return true;
    }
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [isImporting, setIsImporting] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isMetricsModalOpen, setIsMetricsModalOpen] = useState(false);
  const [uploadingPdfId, setUploadingPdfId] = useState<number | null>(null);

  const [previewDoc, setPreviewDoc] = useState<PreviewDocState | null>(null);

  const [approvedResearch, setApprovedResearch] = useState<ApprovedResearch[]>([]);
  const [isLinkingModalOpen, setIsLinkingModalOpen] = useState(false);
  const [docToLink, setDocToLink] = useState<PublicationDoc | null>(null);

  const [editDoc, setEditDoc] = useState<PublicationDoc | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [deleteDoc, setDeleteDoc] = useState<PublicationDoc | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Year filter
  const [filterYear, setFilterYear] = useState<number | null>(null);

  // Scopus & National Specific Filters
  const [scopusFilter, setScopusFilter] = useState<'all' | 'unconfirmed' | 'confirmed'>('all');
  const [sintaFilter, setSintaFilter] = useState<SintaFilterType>('all');
  const [articleFilter, setArticleFilter] = useState<'all' | 'article' | 'non-article'>('all');
  const [quartileFilter, setQuartileFilter] = useState<'all' | 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'None'>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'external' | 'manual'>('all');
  const [crossIndexedOnly, setCrossIndexedOnly] = useState(false);
  const [isBulkCorrespondenceModalOpen, setIsBulkCorrespondenceModalOpen] = useState(false);


  const showMessage = useCallback((msg: string, type: 'success' | 'error') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 4500);
  }, []);

  const loadDocuments = useCallback(async () => {
    if (!user?.id) return;
    try {
      const docs = await fetchUserDocuments(user.id);
      setDocuments(docs);
    } catch (err) {
      console.error(err);
    }
  }, [user?.id]);

  const loadWeights = useCallback(async () => {
    if (!localStorage.getItem('penta_weights')) {
      setIsWeightsLoading(true);
    }
    try {
      const weightsData = await fetchCategoryWeights();
      setWeights(weightsData);
      localStorage.setItem('penta_weights', JSON.stringify(weightsData));

      if (urlKategori) {
        setCategory(urlKategori);
      } else if (weightsData.length > 0) {
        const pubWeights = weightsData.filter((w) => {
          const catLower = (w.category || '').toLowerCase();
          return (
            !catLower.includes('hki') &&
            !catLower.includes('paten') &&
            !catLower.includes('cipta') &&
            !catLower.includes('merk') &&
            !catLower.includes('merek') &&
            !catLower.includes('buku') &&
            !catLower.includes('monograf') &&
            !catLower.includes('ajar') &&
            !catLower.includes('referensi') &&
            !catLower.includes('laporan') &&
            !catLower.includes('proposal')
          );
        });
        if (pubWeights.length > 0) {
          setCategory(pubWeights[0].category);
        } else {
          setCategory(weightsData[0].category);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsWeightsLoading(false);
    }
  }, [urlKategori]);

  const loadApprovedResearch = useCallback(async () => {
    if (!user?.id) return;
    try {
      const researchData = await fetchApprovedResearch(user.id);
      setApprovedResearch(researchData);
    } catch (err) {
      console.error(err);
    }
  }, [user?.id]);

  useEffect(() => {
    const initData = async () => {
      setIsTableLoading(true);
      await Promise.all([loadWeights(), loadApprovedResearch(), loadDocuments()]);
      setIsTableLoading(false);
    };
    initData();
  }, [loadWeights, loadApprovedResearch, loadDocuments]);

  useEffect(() => {
    if (urlKategori) {
      setIsTableLoading(true);
      setCategory(urlKategori);
      setFilterYear(null);
      setQuartileFilter('all');
      setSintaFilter('all');
      setSourceFilter('all');
      setScopusFilter('all');
      setCrossIndexedOnly(false);
      setCurrentPage(1);
      // Beri waktu satu tick agar filter & filteredDocuments selesai di-recalculate
      setTimeout(() => setIsTableLoading(false), 0);
    }
  }, [urlKategori]);

  const unconfirmedCorrespondenceDocs = useMemo(() => {
    return documents.filter((d) => {
      const isJI = (d.category || '').toLowerCase() === 'jurnal internasional' || d.source === 'scopus';
      if (!isJI) return false;

      const isArticle = !d.subtype || d.subtype.toLowerCase() === 'ar' || d.subtype.toLowerCase() === 'article';
      const totalAuthors = Number(d.total_authors) || 1;
      const showCorrespondingControls = d.author_role !== 'Single Author' && totalAuthors > 1 && d.source !== 'scholar';

      return isArticle && showCorrespondingControls && !d.is_corresponding_confirmed;
    });
  }, [documents]);

  const unconfirmedSintaDocs = useMemo(() => {
    return documents.filter((d) => {
      const isJN = (d.category || '').toLowerCase() === 'jurnal nasional' || d.source === 'scholar';
      if (!isJN) return false;
      return !d.is_sinta_confirmed;
    });
  }, [documents]);

  const crossTitlesSet = useMemo(() => {
    const norm = (t: string) => (t || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const scopusTitles = documents
      .filter((d) => d.source === 'scopus' || (d.category || '').toLowerCase() === 'jurnal internasional')
      .map((d) => norm(d.title));
    const scholarTitles = documents
      .filter((d) => d.source === 'scholar' || (d.category || '').toLowerCase() === 'jurnal nasional')
      .map((d) => norm(d.title));

    const set = new Set<string>();
    scopusTitles.forEach((t) => {
      if (t && scholarTitles.includes(t)) {
        set.add(t);
      }
    });
    return set;
  }, [documents]);

  const crossIndexedCount = useMemo(() => {
    const norm = (t: string) => (t || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (urlKategori) {
      const categoryDocs = documents.filter((d) => (d.category || '').toLowerCase() === urlKategori.toLowerCase());
      return categoryDocs.filter((d) => d.is_cross_indexed || crossTitlesSet.has(norm(d.title))).length;
    }
    return crossTitlesSet.size;
  }, [documents, urlKategori, crossTitlesSet]);

  const filteredDocuments = useMemo(() => {
    let result = documents || [];
    if (urlKategori) {
      const targetCat = urlKategori.toLowerCase();
      result = result.filter((d) => {
        const cat = String(d.category || '').toLowerCase();
        return cat === targetCat || cat.includes(targetCat) || targetCat.includes(cat);
      });
    }
    if (filterYear) {
      result = result.filter((d) => {
        const y = d.published_at ? new Date(d.published_at).getFullYear() : null;
        return y === filterYear;
      });
    }

    const isJIUrl = urlKategori.toLowerCase().includes('jurnal internasional');
    const isJNUrl = urlKategori.toLowerCase().includes('jurnal nasional');

    if (isJIUrl) {
      if (scopusFilter === 'unconfirmed') {
        result = result.filter((d) => {
          if (d.source === 'scopus') {
            const subtypeStr = String(d.subtype || '').toLowerCase();
            const isArticle = !d.subtype || subtypeStr === 'ar' || subtypeStr === 'article';
            const totalAuthors = Number(d.total_authors) || 1;
            return isArticle && totalAuthors > 1 && !d.is_corresponding_confirmed;
          }
          return false;
        });
      } else if (scopusFilter === 'confirmed') {
        result = result.filter((d) => {
          if (d.source === 'scopus') {
            const subtypeStr = String(d.subtype || '').toLowerCase();
            const isArticle = !d.subtype || subtypeStr === 'ar' || subtypeStr === 'article';
            const totalAuthors = Number(d.total_authors) || 1;
            return !isArticle || totalAuthors <= 1 || d.is_corresponding_confirmed;
          }
          return true;
        });
      }

      if (articleFilter === 'article') {
        result = result.filter((d) => {
          if (d.source === 'scopus') {
            const subtypeStr = String(d.subtype || '').toLowerCase();
            return !d.subtype || subtypeStr === 'ar' || subtypeStr === 'article';
          }
          return true;
        });
      } else if (articleFilter === 'non-article') {
        result = result.filter((d) => {
          if (d.source === 'scopus') {
            const subtypeStr = String(d.subtype || '').toLowerCase();
            return d.subtype && subtypeStr !== 'ar' && subtypeStr !== 'article';
          }
          return false;
        });
      }

      if (quartileFilter !== 'all') {
        result = result.filter((d) => {
          const qStr = String(d.quartile || '');
          const q = ['Q1', 'Q2', 'Q3', 'Q4'].includes(qStr) ? qStr : 'None';
          return q === quartileFilter;
        });
      }
    }

    if (isJNUrl) {
      if (sintaFilter !== 'all') {
        result = result.filter((d) => {
          const rank = String(d.sinta_rank || 'Non-SINTA').toUpperCase();
          return rank === sintaFilter.toUpperCase();
        });
      }

      if (scopusFilter === 'unconfirmed') {
        result = result.filter((d) => !d.is_sinta_confirmed);
      } else if (scopusFilter === 'confirmed') {
        result = result.filter((d) => !!d.is_sinta_confirmed);
      }
    }


    if (crossIndexedOnly) {
      const norm = (t: string) => (t || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      result = result.filter((d) => !d.is_cross_indexed && !crossTitlesSet.has(norm(d.title)));
    }

    if (sourceFilter === 'external') {
      result = result.filter((d) => d.source === 'scopus' || d.source === 'scholar' || d.source === 'sinta' || d.source === 'garuda');
    } else if (sourceFilter === 'manual') {
      result = result.filter((d) => d.source !== 'scopus' && d.source !== 'scholar' && d.source !== 'sinta' && d.source !== 'garuda');
    }

    return result;
  }, [documents, urlKategori, filterYear, scopusFilter, sintaFilter, articleFilter, quartileFilter, sourceFilter, crossIndexedOnly, crossTitlesSet]);


  const availableYears = useMemo(() => {
    const targetDocs = urlKategori
      ? documents.filter((d) => (d.category || '').toLowerCase() === urlKategori.toLowerCase())
      : documents;

    const yearsSet = new Set<number>();
    targetDocs.forEach((d) => {
      if (d.published_at) {
        const y = new Date(d.published_at).getFullYear();
        if (!isNaN(y) && y > 1900 && y <= 2100) {
          yearsSet.add(y);
        }
      }
    });
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [documents, urlKategori]);

  const stats: StatsInfo = useMemo(() => {
    const src = filteredDocuments;
    return {
      total: src.length,
      approved: src.filter((d) => d.status === 'Approved').length,
      pending: src.filter((d) => d.status === 'Pending' || d.status === 'Verified by Fakultas').length,
      points: Math.round(src.reduce((acc, d) => {
        const pts = d.source === 'scholar' ? calculateScholarPoints(d) : (Number(d.awarded_points) || 0);
        return acc + pts;
      }, 0)),
      citations: src.reduce((acc, d) => acc + (Number(d.citations) || 0), 0)
    };
  }, [filteredDocuments]);

  const handleUploadPdf = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('pdf') && !file.type.includes('image')) {
      showMessage('Hanya file PDF atau gambar yang diperbolehkan.', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showMessage('Ukuran file maksimal 10MB.', 'error');
      return;
    }

    setUploadingPdfId(id);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await uploadPdfDocument(id, formData);
      if (res.ok) {
        showMessage('Dokumen berhasil diunggah!', 'success');
        setIsTableLoading(true);
        await loadDocuments();
        setIsTableLoading(false);
      } else {
        showMessage(res.data?.message || 'Gagal mengunggah dokumen.', 'error');
      }
    } catch (err) {
      console.error(err);
      showMessage('Terjadi kesalahan saat mengunggah.', 'error');
    } finally {
      setUploadingPdfId(null);
      if (e.target) e.target.value = '';
    }
  }, [showMessage, loadDocuments]);

  const handleDownloadTemplate = useCallback(async () => {
    await generatePublicationExcelTemplate(weights);
  }, [weights]);

  return {
    urlKategori,
    selectedDocForDetail,
    setSelectedDocForDetail,
    activeDetailDoc,
    documents,
    setDocuments,
    weights,
    category,
    setCategory,
    isTableLoading,
    setIsTableLoading,
    isWeightsLoading,
    message,
    messageType,
    showMessage,
    isImporting,
    setIsImporting,
    isUploadModalOpen,
    setIsUploadModalOpen,
    isMetricsModalOpen,
    setIsMetricsModalOpen,
    uploadingPdfId,
    previewDoc,
    setPreviewDoc,
    approvedResearch,
    isLinkingModalOpen,
    setIsLinkingModalOpen,
    docToLink,
    setDocToLink,
    editDoc,
    setEditDoc,
    isEditModalOpen,
    setIsEditModalOpen,
    deleteDoc,
    setDeleteDoc,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    filterYear,
    setFilterYear,
    scopusFilter,
    setScopusFilter,
    sintaFilter,
    setSintaFilter,
    articleFilter,
    setArticleFilter,
    quartileFilter,
    setQuartileFilter,
    sourceFilter,
    setSourceFilter,
    crossIndexedOnly,
    setCrossIndexedOnly,
    isBulkCorrespondenceModalOpen,
    setIsBulkCorrespondenceModalOpen,
    unconfirmedCorrespondenceDocs,
    unconfirmedSintaDocs,
    crossIndexedCount,
    filteredDocuments,
    availableYears,
    stats,
    handleUploadPdf,
    handleDownloadTemplate,
    loadDocuments,
  };
}
