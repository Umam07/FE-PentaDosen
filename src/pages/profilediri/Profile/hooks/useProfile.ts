import { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Award, Globe, FileText, TrendingUp } from 'lucide-react';
import { ProfileUser, ProfileStat, ToastMessage } from '../types/profile.types';
import { calculateScopusSintaPoints } from '../utils/profileUtils';
import { calculateScholarPoints } from '../../../dosen/dashboard/pointsCalculator';
import * as profileService from '../services/profileService';
import { toast } from '@/components/ui/toast';

export const useProfile = (user: ProfileUser | null | undefined, setUser: (user: any) => void) => {
  const location = useLocation();
  const navigate = useNavigate();
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
        const avatar = profileData.user?.avatar || profileData.scholarData?.thumbnail || user?.avatar || null;
        const enrichedUser = {
          ...profileData.user,
          avatar
        };
        setUser(enrichedUser);
        try {
          sessionStorage.setItem('pentadosen_user', JSON.stringify(enrichedUser));
        } catch (e) {}

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

    const approvedManualTitles = new Set(
      (internalDocuments || [])
        .filter((d: any) => {
          if (d.status !== 'Approved') return false;
          if (d.source === 'scopus' || d.source === 'scholar' || d.category === 'Google Scholar') return false;
          return (d.file_url && d.file_url !== '' && d.file_url !== '-') || d.is_penelitian;
        })
        .map((d: any) => normalizeT(d.title))
        .filter(Boolean)
    );

    const extCross = (scopusPublications || [])
      .filter((s) => crossTitles.has(normalizeT(s.title)) && !approvedManualTitles.has(normalizeT(s.title)))
      .reduce((a: number, d: any) => a + calculateScopusSintaPoints(d), 0);
    const extScopus = (scopusPublications || [])
      .filter((s) => !crossTitles.has(normalizeT(s.title)) && !approvedManualTitles.has(normalizeT(s.title)))
      .reduce((a: number, d: any) => a + calculateScopusSintaPoints(d), 0);
    const extScholar = (publications || [])
      .filter((s) => !crossTitles.has(normalizeT(s.title)) && !approvedManualTitles.has(normalizeT(s.title)))
      .reduce((a: number, d: any) => a + calculateScholarPoints(d), 0);
    const extTotal = Math.round(extCross + extScopus + extScholar);

    const internalTotal = Math.round(
      (internalDocuments || [])
        .filter((d: any) => {
          if (d.status !== 'Approved') return false;
          if (d.source === 'scopus' || d.source === 'scholar' || d.category === 'Google Scholar') return false;
          return (d.file_url && d.file_url !== '' && d.file_url !== '-') || d.is_penelitian;
        })
        .reduce((acc: number, d: any) => acc + (Number(d.awarded_points) || 0), 0)
    );

    // --- 2. 3 YEARS (2024-2026) CALCULATION ---
    const publications3Years = (publications || []).filter(p => {
      const yr = Number(p.year);
      return yr >= currentYear - 2 && yr <= currentYear;
    });
    const scopus3Years = (scopusPublications || []).filter(s => {
      const yr = Number(s.year);
      return yr >= currentYear - 2 && yr <= currentYear;
    });

    const approvedManualTitles3Years = new Set(
      (internalDocuments || [])
        .filter((d: any) => {
          if (d.status !== 'Approved') return false;
          if (d.source === 'scopus' || d.source === 'scholar' || d.category === 'Google Scholar') return false;
          if (!((d.file_url && d.file_url !== '' && d.file_url !== '-') || d.is_penelitian)) return false;
          const yr = d.published_at ? new Date(d.published_at).getFullYear() : (d.tahun_pelaksanaan || d.tahun);
          return Number(yr) >= currentYear - 2 && Number(yr) <= currentYear;
        })
        .map((d: any) => normalizeT(d.title))
        .filter(Boolean)
    );

    const crossTitles3Years = new Set(
      publications3Years
        .filter(sd => scopus3Years.some(s => normalizeT(s.title) === normalizeT(sd.title)))
        .map(d => normalizeT(d.title))
    );

    const extCross3Years = scopus3Years
      .filter(s => crossTitles3Years.has(normalizeT(s.title)) && !approvedManualTitles3Years.has(normalizeT(s.title)))
      .reduce((a: number, d: any) => a + calculateScopusSintaPoints(d), 0);

    const extScopus3Years = scopus3Years
      .filter(s => !crossTitles3Years.has(normalizeT(s.title)) && !approvedManualTitles3Years.has(normalizeT(s.title)))
      .reduce((a: number, d: any) => a + calculateScopusSintaPoints(d), 0);

    const extScholar3Years = publications3Years
      .filter(s => !crossTitles3Years.has(normalizeT(s.title)) && !approvedManualTitles3Years.has(normalizeT(s.title)))
      .reduce((a: number, d: any) => a + calculateScholarPoints(d), 0);

    const api3Years = Math.round(extCross3Years + extScopus3Years + extScholar3Years);

    const internal3Years = Math.round(
      (internalDocuments || [])
        .filter((d: any) => {
          if (d.status !== 'Approved') return false;
          if (d.source === 'scopus' || d.source === 'scholar' || d.category === 'Google Scholar') return false;
          if (!((d.file_url && d.file_url !== '' && d.file_url !== '-') || d.is_penelitian)) return false;
          const yr = d.published_at ? new Date(d.published_at).getFullYear() : (d.tahun_pelaksanaan || d.tahun);
          return Number(yr) >= currentYear - 2 && Number(yr) <= currentYear;
        })
        .reduce((acc: number, d: any) => acc + (Number(d.awarded_points) || 0), 0)
    );

    // --- 3. THIS YEAR (2026) CALCULATION ---
    const publicationsThisYear = (publications || []).filter(p => Number(p.year) === currentYear);
    const scopusThisYear = (scopusPublications || []).filter(s => Number(s.year) === currentYear);

    const approvedManualTitlesThisYear = new Set(
      (internalDocuments || [])
        .filter((d: any) => {
          if (d.status !== 'Approved') return false;
          if (d.source === 'scopus' || d.source === 'scholar' || d.category === 'Google Scholar') return false;
          if (!((d.file_url && d.file_url !== '' && d.file_url !== '-') || d.is_penelitian)) return false;
          const yr = d.published_at ? new Date(d.published_at).getFullYear() : (d.tahun_pelaksanaan || d.tahun);
          return Number(yr) === currentYear;
        })
        .map((d: any) => normalizeT(d.title))
        .filter(Boolean)
    );

    const crossTitlesThisYear = new Set(
      publicationsThisYear
        .filter(sd => scopusThisYear.some(s => normalizeT(s.title) === normalizeT(sd.title)))
        .map(d => normalizeT(d.title))
    );

    const extCrossThisYear = scopusThisYear
      .filter(s => crossTitlesThisYear.has(normalizeT(s.title)) && !approvedManualTitlesThisYear.has(normalizeT(s.title)))
      .reduce((a: number, d: any) => a + calculateScopusSintaPoints(d), 0);

    const extScopusThisYear = scopusThisYear
      .filter(s => !crossTitlesThisYear.has(normalizeT(s.title)) && !approvedManualTitlesThisYear.has(normalizeT(s.title)))
      .reduce((a: number, d: any) => a + calculateScopusSintaPoints(d), 0);

    const extScholarThisYear = publicationsThisYear
      .filter(s => !crossTitlesThisYear.has(normalizeT(s.title)) && !approvedManualTitlesThisYear.has(normalizeT(s.title)))
      .reduce((a: number, d: any) => a + calculateScholarPoints(d), 0);

    const apiThisYear = Math.round(extCrossThisYear + extScopusThisYear + extScholarThisYear);

    const internalThisYear = Math.round(
      (internalDocuments || [])
        .filter((d: any) => {
          if (d.status !== 'Approved') return false;
          if (d.source === 'scopus' || d.source === 'scholar' || d.category === 'Google Scholar') return false;
          if (!((d.file_url && d.file_url !== '' && d.file_url !== '-') || d.is_penelitian)) return false;
          const yr = d.published_at ? new Date(d.published_at).getFullYear() : (d.tahun_pelaksanaan || d.tahun);
          return Number(yr) === currentYear;
        })
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
        label: 'Total KPI 3 Tahun',
        val: (api3Years + internal3Years).toLocaleString(),
        icon: TrendingUp,
        color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      },
      {
        label: 'Total KPI Tahun Ini',
        val: (apiThisYear + internalThisYear).toLocaleString(),
        icon: Globe,
        color: 'bg-primary-500/10 text-primary-600 dark:text-primary-400',
      },
    ];
  }, [user, publications, scopusPublications, internalDocuments]);

  // Handlers for Google Scholar and Scopus integrations

  const handleCheckId = async () => {
    if (!scholarId) {
      toast.error('Masukkan Google Scholar ID terlebih dahulu.', 'Google Scholar');
      return;
    }
    try {
      setCheckingInfo(true);
      setCheckedAuthor(null);
      const data = await profileService.checkScholarId(scholarId);
      setCheckedAuthor(data);
      toast.success('ID Scholar ditemukan! Silakan verifikasi dan simpan.', 'Google Scholar');
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengecek Google Scholar ID.', 'Google Scholar');
    } finally {
      setCheckingInfo(false);
    }
  };

  const handleSaveScholarId = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      await profileService.saveScholarId(user.id, scholarId, checkedAuthor?.thumbnail || null);
      toast.success('Google Scholar ID berhasil disimpan.', 'Google Scholar');
      setUser({
        ...user,
        scholar_id: scholarId,
        avatar: checkedAuthor?.thumbnail || user.avatar,
      });
      setCheckedAuthor(null);
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan Google Scholar ID.', 'Google Scholar');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckScopusId = async () => {
    if (!scopusId) {
      toast.error('Masukkan Scopus Author ID terlebih dahulu.', 'Scopus');
      return;
    }
    try {
      setCheckingScopus(true);
      setCheckedScopusAuthor(null);
      const data = await profileService.checkScopusId(scopusId);
      setCheckedScopusAuthor(data);
      toast.success('Scopus Author ID ditemukan! Silakan verifikasi dan simpan.', 'Scopus');
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengecek Scopus Author ID.', 'Scopus');
    } finally {
      setCheckingScopus(false);
    }
  };

  const handleSaveScopusId = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      await profileService.saveScopusId(user.id, scopusId);
      toast.success('Scopus Author ID berhasil disimpan.', 'Scopus');
      setUser({ ...user, scopus_id: scopusId });
      setCheckedScopusAuthor(null);
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan Scopus Author ID.', 'Scopus');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteScholarId = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      await profileService.saveScholarId(user.id, null, null);
      toast.success('Google Scholar ID berhasil dihapus.', 'Google Scholar');
      setScholarId('');
      setScholarData(null);
      setPublications([]);
      setUser({
        ...user,
        scholar_id: null,
        avatar: null,
      });
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus Google Scholar ID.', 'Google Scholar');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteScopusId = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      await profileService.saveScopusId(user.id, null);
      toast.success('Scopus Author ID berhasil dihapus.', 'Scopus');
      setScopusId('');
      setScopusData(null);
      setScopusPublications([]);
      setUser({ ...user, scopus_id: null });
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus Scopus Author ID.', 'Scopus');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (!user?.id) return;
    if (!scholarId) {
      toast.error('Simpan Google Scholar ID terlebih dahulu.', 'Google Scholar');
      return;
    }
    try {
      setLoading(true);
      window.dispatchEvent(new CustomEvent('penta-sync-start'));
      toast.info('Sedang menyinkronkan data Google Scholar...', 'Google Scholar');
      await profileService.syncScholar(user.id);
      toast.success('Data Google Scholar berhasil disinkronisasi.', 'Google Scholar');
      const data = await profileService.fetchProfileData(user.id);
      setScholarData(data.scholarData);
      setPublications(data.publications || []);
      setUser(data.user);
    } catch (err: any) {
      toast.error(err.message || 'Error sinkronisasi data Google Scholar.', 'Google Scholar');
    } finally {
      setLoading(false);
      window.dispatchEvent(new CustomEvent('penta-sync-end'));
    }
  };

  const handleSyncScopus = async () => {
    if (!user?.id) return;
    if (!scopusId) {
      toast.error('Simpan Scopus Author ID terlebih dahulu.', 'Scopus');
      return;
    }
    try {
      setLoading(true);
      window.dispatchEvent(new CustomEvent('penta-sync-start'));
      toast.info('Sedang menyinkronkan data Scopus...', 'Scopus');
      await profileService.syncScopus(user.id);
      toast.success('Data Scopus berhasil disinkronisasi.', 'Scopus');
      const data = await profileService.fetchProfileData(user.id);
      setScopusData(data.scopusData);
      setScopusPublications(data.scopusPublications || []);
      setUser(data.user);
    } catch (err: any) {
      toast.error(err.message || 'Error sinkronisasi data Scopus.', 'Scopus');
    } finally {
      setLoading(false);
      window.dispatchEvent(new CustomEvent('penta-sync-end'));
    }
  };

  const handleSyncAll = async () => {
    if (!user?.id) return;
    if (!scholarId && !scopusId) {
      toast.error('Simpan setidaknya satu ID (Scholar atau Scopus) terlebih dahulu.', 'Sinkronisasi');
      return;
    }
    try {
      setLoading(true);
      window.dispatchEvent(new CustomEvent('penta-sync-start'));
      toast.info('Sedang menyinkronkan seluruh data publikasi...', 'Sinkronisasi');

      const syncPromises = [];
      if (scholarId) syncPromises.push(profileService.syncScholar(user.id));
      if (scopusId) syncPromises.push(profileService.syncScopus(user.id));

      await Promise.all(syncPromises);
      toast.success('Semua data publikasi berhasil disinkronisasi.', 'Sinkronisasi');

      // Refresh data
      const data = await profileService.fetchProfileData(user.id);
      setScholarData(data.scholarData);
      setPublications(data.publications || []);
      setScopusData(data.scopusData);
      setScopusPublications(data.scopusPublications || []);
      setUser(data.user);

      // Arahkan langsung ke dashboard poin dosen
      navigate('/lecturer-dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Error saat sinkronisasi data.', 'Sinkronisasi');
    } finally {
      setLoading(false);
      window.dispatchEvent(new CustomEvent('penta-sync-end'));
    }
  };

  const handleSyncSinta = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      window.dispatchEvent(new CustomEvent('penta-sync-start'));
      toast.info('Sedang mendeteksi ID dari data SINTA...', 'Profil SINTA');
      const result = await profileService.syncSinta(user.id, true);
      toast.success(result.message || 'Scopus ID & Google Scholar ID berhasil terhubung dari data SINTA.', 'Profil SINTA');

      // Refresh data
      const data = await profileService.fetchProfileData(user.id);
      setScholarId(data.user.scholar_id || '');
      setScopusId(data.user.scopus_id || '');
      setUser(data.user);
    } catch (err: any) {
      toast.error(err.message || 'Gagal mendeteksi data dari SINTA.', 'Profil SINTA');
    } finally {
      setLoading(false);
      window.dispatchEvent(new CustomEvent('penta-sync-end'));
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
    handleSyncSinta,
  };
};
