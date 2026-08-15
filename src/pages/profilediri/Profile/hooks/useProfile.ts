import { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Award, Globe, FileText } from 'lucide-react';
import { ProfileUser, ProfileStat, ToastMessage } from '../types/profile.types';
import { calculateScopusSintaPoints } from '../utils/profileUtils';
import { calculateScholarPoints } from '../../../dosen/dashboard/pointsCalculator';
import * as profileService from '../services/profileService';

export const useProfile = (user: ProfileUser | null | undefined, setUser: (user: any) => void) => {
  const location = useLocation();
  const [scholarId, setScholarId] = useState(user?.scholar_id || '');
  const [scopusId, setScopusId] = useState(user?.scopus_id || '');
  const [scholarData, setScholarData] = useState<any>(null);
  const [scopusData, setScopusData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [checkingInfo, setCheckingInfo] = useState(false);
  const [checkingScopus, setCheckingScopus] = useState(false);
  const [checkedAuthor, setCheckedAuthor] = useState<any>(null);
  const [checkedScopusAuthor, setCheckedScopusAuthor] = useState<any>(null);
  const [message, setMessage] = useState<ToastMessage>({ text: '', type: '' });
  const [showWarningModal, setShowWarningModal] = useState(false);

  const warningDismissedRef = useRef(false);
  const userLoadedRef = useRef(false);

  // Auto-dismiss notification message after 4.5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [message.text]);

  const [activeTab, setActiveTab] = useState<'info' | 'integrasi'>(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'integrasi' || params.get('warning') === 'true') {
      return 'integrasi';
    }
    if (tabParam === 'info') {
      return 'info';
    }
    if (user && user.role === 'dosen' && (!user.scholar_id || !user.scopus_id)) {
      return 'integrasi';
    }
    return 'info';
  });

  // URL query params and Warning Modal handling
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    const isWarningParam = params.get('warning') === 'true';
    const hasSeenOnboarding = localStorage.getItem('penta_onboarding_seen');

    if (tabParam === 'integrasi' || isWarningParam) {
      setActiveTab('integrasi');
    } else if (tabParam === 'info') {
      setActiveTab('info');
    } else if (user && !userLoadedRef.current) {
      userLoadedRef.current = true;
      if (user.role === 'dosen' && (!user.scholar_id || !user.scopus_id)) {
        setActiveTab('integrasi');
      }
    }

    if (
      user &&
      user.role === 'dosen' &&
      (!user.scholar_id || !user.scopus_id) &&
      !warningDismissedRef.current &&
      hasSeenOnboarding === 'true' &&
      isWarningParam
    ) {
      setShowWarningModal(true);
    }
  }, [user, location.search]);

  const [publications, setPublications] = useState<any[]>([]);
  const [scopusPublications, setScopusPublications] = useState<any[]>([]);
  const [internalDocuments, setInternalDocuments] = useState<any[]>([]);

  // Fetch initial profile stats, publication list, and internal documents
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) return;
      try {
        const [profileData, docsData] = await Promise.all([
          profileService.fetchProfileData(user.id),
          profileService.fetchInternalDocuments(user.id),
        ]);

        setScholarData(profileData.scholarData);
        setScopusData(profileData.scopusData);
        setPublications(profileData.publications || []);
        setScopusPublications(profileData.scopusPublications || []);
        setScholarId(profileData.user.scholar_id || '');
        setScopusId(profileData.user.scopus_id || '');
        setUser(profileData.user);

        setInternalDocuments(docsData.documents || []);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };
    fetchProfileData();
  }, [user?.id]);

  // Calculate KPI points and statistics (useMemo)
  const stats = useMemo<ProfileStat[] | null>(() => {
    if (!user) return null;

    const normalizeT = (t: string) => (t || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const currentYear = 2026; // Tahun KPI aktif saat ini

    // --- 1. OVERALL CALCULATION ---
    const crossTitles = new Set(
      (publications || [])
        .filter((sd) => (scopusPublications || []).some((s) => normalizeT(s.title) === normalizeT(sd.title)))
        .map((d) => normalizeT(d.title))
    );

    const extCross = (scopusPublications || [])
      .filter((s) => crossTitles.has(normalizeT(s.title)))
      .reduce((a: number, d: any) => a + calculateScopusSintaPoints(d), 0);
    const extScopus = (scopusPublications || [])
      .filter((s) => !crossTitles.has(normalizeT(s.title)))
      .reduce((a: number, d: any) => a + calculateScopusSintaPoints(d), 0);
    const extScholar = (publications || [])
      .filter((s) => !crossTitles.has(normalizeT(s.title)))
      .reduce((a: number, d: any) => a + calculateScholarPoints(d), 0);
    const extTotal = Math.round(extCross + extScopus + extScholar);

    const internalTotal = Math.round(
      (internalDocuments || [])
        .filter((d: any) => d.status === 'Approved' && d.file_url && d.file_url !== '')
        .reduce((acc: number, d: any) => acc + (Number(d.awarded_points) || 0), 0)
    );

    // --- 2. THIS YEAR (2026) CALCULATION ---
    const publicationsThisYear = (publications || []).filter(p => Number(p.year) === currentYear);
    const scopusThisYear = (scopusPublications || []).filter(s => Number(s.year) === currentYear);

    const crossTitlesThisYear = new Set(
      publicationsThisYear
        .filter(sd => scopusThisYear.some(s => normalizeT(s.title) === normalizeT(sd.title)))
        .map(d => normalizeT(d.title))
    );

    const extCrossThisYear = scopusThisYear
      .filter(s => crossTitlesThisYear.has(normalizeT(s.title)))
      .reduce((a: number, d: any) => a + calculateScopusSintaPoints(d), 0);

    const extScopusThisYear = scopusThisYear
      .filter(s => !crossTitlesThisYear.has(normalizeT(s.title)))
      .reduce((a: number, d: any) => a + calculateScopusSintaPoints(d), 0);

    const extScholarThisYear = publicationsThisYear
      .filter(s => !crossTitlesThisYear.has(normalizeT(s.title)))
      .reduce((a: number, d: any) => a + calculateScholarPoints(d), 0);

    const apiThisYear = Math.round(extCrossThisYear + extScopusThisYear + extScholarThisYear);

    const internalThisYear = Math.round(
      (internalDocuments || [])
        .filter((d: any) => d.status === 'Approved' && d.file_url && d.file_url !== '' && new Date(d.published_at).getFullYear() === currentYear)
        .reduce((acc: number, d: any) => acc + (Number(d.awarded_points) || 0), 0)
    );

    return [
      {
        label: 'Total KPI Overall',
        val: (extTotal + internalTotal).toLocaleString(),
        icon: Award,
        color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      },
      {
        label: 'Total KPI Tahun Ini',
        val: (apiThisYear + internalThisYear).toLocaleString(),
        icon: Globe,
        color: 'bg-primary-500/10 text-primary-600 dark:text-primary-400',
      },
      {
        label: 'Poin (Internal)',
        val: internalTotal.toLocaleString(),
        icon: FileText,
        color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      },
    ];
  }, [user, publications, scopusPublications, internalDocuments]);

  // Handlers for Google Scholar and Scopus integrations

  const handleCheckId = async () => {
    if (!scholarId) {
      setMessage({ text: 'Masukkan Google Scholar ID terlebih dahulu.', type: 'error' });
      return;
    }
    try {
      setCheckingInfo(true);
      setMessage({ text: '', type: '' });
      setCheckedAuthor(null);
      const data = await profileService.checkScholarId(scholarId);
      setCheckedAuthor(data);
      setMessage({ text: 'ID ditemukan! Silakan verifikasi dan simpan.', type: 'success' });
    } catch (err: any) {
      setMessage({ text: err.message || 'Gagal mengecek Scholar ID.', type: 'error' });
    } finally {
      setCheckingInfo(false);
    }
  };

  const handleSaveScholarId = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      await profileService.saveScholarId(user.id, scholarId, checkedAuthor?.thumbnail || null);
      setMessage({ text: 'Scholar ID berhasil disimpan.', type: 'success' });
      setUser({
        ...user,
        scholar_id: scholarId,
        avatar: checkedAuthor?.thumbnail || user.avatar,
      });
      setCheckedAuthor(null);
    } catch (err: any) {
      setMessage({ text: err.message || 'Gagal menyimpan Scholar ID.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckScopusId = async () => {
    if (!scopusId) {
      setMessage({ text: 'Masukkan Scopus Author ID terlebih dahulu.', type: 'error' });
      return;
    }
    try {
      setCheckingScopus(true);
      setMessage({ text: '', type: '' });
      setCheckedScopusAuthor(null);
      const data = await profileService.checkScopusId(scopusId);
      setCheckedScopusAuthor(data);
      setMessage({ text: 'ID Scopus ditemukan! Silakan verifikasi dan simpan.', type: 'success' });
    } catch (err: any) {
      setMessage({ text: err.message || 'Gagal mengecek Scopus ID.', type: 'error' });
    } finally {
      setCheckingScopus(false);
    }
  };

  const handleSaveScopusId = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      await profileService.saveScopusId(user.id, scopusId);
      setMessage({ text: 'Scopus ID berhasil disimpan.', type: 'success' });
      setUser({ ...user, scopus_id: scopusId });
      setCheckedScopusAuthor(null);
    } catch (err: any) {
      setMessage({ text: err.message || 'Gagal menyimpan Scopus ID.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteScholarId = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      await profileService.saveScholarId(user.id, null, null);
      setMessage({ text: 'Scholar ID berhasil dihapus.', type: 'success' });
      setScholarId('');
      setScholarData(null);
      setPublications([]);
      setUser({
        ...user,
        scholar_id: null,
        avatar: null,
      });
    } catch (err: any) {
      setMessage({ text: err.message || 'Gagal menghapus Scholar ID.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteScopusId = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      await profileService.saveScopusId(user.id, null);
      setMessage({ text: 'Scopus ID berhasil dihapus.', type: 'success' });
      setScopusId('');
      setScopusData(null);
      setScopusPublications([]);
      setUser({ ...user, scopus_id: null });
    } catch (err: any) {
      setMessage({ text: err.message || 'Gagal menghapus Scopus ID.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (!user?.id) return;
    if (!scholarId) {
      setMessage({ text: 'Simpan Google Scholar ID terlebih dahulu.', type: 'error' });
      return;
    }
    try {
      setLoading(true);
      await profileService.syncScholar(user.id);
      setMessage({ text: 'Data Scholar berhasil disinkronisasi.', type: 'success' });
      const data = await profileService.fetchProfileData(user.id);
      setScholarData(data.scholarData);
      setPublications(data.publications || []);
      setUser(data.user);
    } catch (err: any) {
      setMessage({ text: err.message || 'Error sinkronisasi data Scholar.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSyncScopus = async () => {
    if (!user?.id) return;
    if (!scopusId) {
      setMessage({ text: 'Simpan Scopus ID terlebih dahulu.', type: 'error' });
      return;
    }
    try {
      setLoading(true);
      await profileService.syncScopus(user.id);
      setMessage({ text: 'Data Scopus berhasil disinkronisasi.', type: 'success' });
      const data = await profileService.fetchProfileData(user.id);
      setScopusData(data.scopusData);
      setScopusPublications(data.scopusPublications || []);
      setUser(data.user);
    } catch (err: any) {
      setMessage({ text: err.message || 'Error sinkronisasi data Scopus.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSyncAll = async () => {
    if (!user?.id) return;
    if (!scholarId && !scopusId) {
      setMessage({ text: 'Simpan setidaknya satu ID (Scholar atau Scopus) terlebih dahulu.', type: 'error' });
      return;
    }
    try {
      setLoading(true);
      setMessage({ text: 'Sedang sinkronisasi data...', type: 'info' });

      const syncPromises = [];
      if (scholarId) syncPromises.push(profileService.syncScholar(user.id));
      if (scopusId) syncPromises.push(profileService.syncScopus(user.id));

      await Promise.all(syncPromises);
      setMessage({ text: 'Semua data berhasil disinkronisasi.', type: 'success' });

      // Refresh data
      const data = await profileService.fetchProfileData(user.id);
      setScholarData(data.scholarData);
      setPublications(data.publications || []);
      setScopusData(data.scopusData);
      setScopusPublications(data.scopusPublications || []);
      setUser(data.user);
    } catch (err: any) {
      setMessage({ text: err.message || 'Error saat sinkronisasi data.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return {
    scholarId,
    setScholarId,
    scopusId,
    setScopusId,
    scholarData,
    setScholarData,
    scopusData,
    setScopusData,
    loading,
    setLoading,
    checkingInfo,
    setCheckingInfo,
    checkingScopus,
    setCheckingScopus,
    checkedAuthor,
    setCheckedAuthor,
    checkedScopusAuthor,
    setCheckedScopusAuthor,
    message,
    setMessage,
    showWarningModal,
    setShowWarningModal,
    warningDismissedRef,
    activeTab,
    setActiveTab,
    stats,
    handleCheckId,
    handleSaveScholarId,
    handleCheckScopusId,
    handleSaveScopusId,
    handleDeleteScholarId,
    handleDeleteScopusId,
    handleSync,
    handleSyncScopus,
    handleSyncAll,
  };
};
