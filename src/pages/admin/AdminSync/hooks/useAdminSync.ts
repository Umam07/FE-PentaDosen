import { useState, useEffect, useMemo, useCallback } from 'react';
import type {
  SessionUser, Lecturer, ScholarData, ScopusData,
  LecturerUser, CheckedAuthor
} from '../types/adminSync.types';
import {
  fetchLecturers, fetchLecturerProfile,
  checkScholarId as checkScholarIdService, saveScholarId as saveScholarIdService, syncScholar as syncScholarService,
  checkScopusId as checkScopusIdService, saveScopusId as saveScopusIdService, syncScopus as syncScopusService,
} from '../services/adminSyncService';

export function useAdminSync(user: SessionUser) {
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [selectedLecturerId, setSelectedLecturerId] = useState<string>('');

  // State dosen terpilih
  const [scholarId, setScholarId] = useState('');
  const [scholarData, setScholarData] = useState<ScholarData | null>(null);
  const [scopusId, setScopusId] = useState('');
  const [scopusData, setScopusData] = useState<ScopusData | null>(null);
  const [scholarUser, setScholarUser] = useState<LecturerUser | null>(null);

  // UI states Scholar
  const [loadingScholar, setLoadingScholar] = useState(false);
  const [checkingInfoScholar, setCheckingInfoScholar] = useState(false);
  const [checkedAuthorScholar, setCheckedAuthorScholar] = useState<CheckedAuthor | null>(null);
  const [messageScholar, setMessageScholar] = useState('');

  // UI states Scopus
  const [loadingScopus, setLoadingScopus] = useState(false);
  const [checkingInfoScopus, setCheckingInfoScopus] = useState(false);
  const [checkedAuthorScopus, setCheckedAuthorScopus] = useState<CheckedAuthor | null>(null);
  const [messageScopus, setMessageScopus] = useState('');

  // Filter & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFakultas, setSelectedFakultas] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch daftar dosen saat mount
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchLecturers(user.role, user.id);
        setLecturers(data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [user.role, user.id]);

  // Fetch profil dosen terpilih
  useEffect(() => {
    if (!selectedLecturerId) {
      setScholarData(null);
      setScopusData(null);
      setScholarUser(null);
      setScholarId('');
      setScopusId('');
      setMessageScholar('');
      setMessageScopus('');
      setCheckedAuthorScholar(null);
      setCheckedAuthorScopus(null);
      return;
    }

    const load = async () => {
      try {
        setLoadingScholar(true);
        setLoadingScopus(true);
        const profile = await fetchLecturerProfile(selectedLecturerId);
        setScholarData(profile.scholarData);
        setScopusData(profile.scopusData);
        setScholarUser(profile.user);
        setScholarId(profile.user.scholar_id || '');
        setScopusId(profile.user.scopus_id || '');
        setMessageScholar('');
        setMessageScopus('');
        setCheckedAuthorScholar(null);
        setCheckedAuthorScopus(null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingScholar(false);
        setLoadingScopus(false);
      }
    };
    load();
  }, [selectedLecturerId]);

  // ==============================
  // Scholar handlers
  // ==============================
  const handleCheckIdScholar = useCallback(async () => {
    if (!scholarId) {
      setMessageScholar('Masukkan Google Scholar ID terlebih dahulu.');
      return;
    }
    try {
      setCheckingInfoScholar(true);
      setMessageScholar('');
      setCheckedAuthorScholar(null);
      const data = await checkScholarIdService(scholarId);
      setCheckedAuthorScholar(data);
      setMessageScholar('Author ditemukan! Silakan verifikasi dan Simpan.');
    } catch (err) {
      setMessageScholar(`Error: ${err instanceof Error ? err.message : 'Author tidak ditemukan'}`);
    } finally {
      setCheckingInfoScholar(false);
    }
  }, [scholarId]);

  const handleSaveScholarId = useCallback(async () => {
    if (!selectedLecturerId) return;
    try {
      setLoadingScholar(true);
      const ok = await saveScholarIdService(selectedLecturerId, scholarId);
      if (ok) {
        setMessageScholar('Google Scholar ID berhasil disimpan.');
        setScholarUser(prev => prev ? { ...prev, scholar_id: scholarId } : prev);
        setCheckedAuthorScholar(null);
        setLecturers(prev => prev.map(l => l.id == selectedLecturerId ? { ...l, scholar_id: scholarId } : l));
      }
    } catch {
      setMessageScholar('Gagal menyimpan Scholar ID.');
    } finally {
      setLoadingScholar(false);
    }
  }, [selectedLecturerId, scholarId]);

  const handleSyncScholar = useCallback(async () => {
    if (!scholarId) {
      setMessageScholar('Simpan Google Scholar ID terlebih dahulu sebelum sync.');
      return;
    }
    try {
      setLoadingScholar(true);
      setMessageScholar('Sedang menarik data dari Google Scholar...');
      const ok = await syncScholarService(selectedLecturerId);
      if (ok) {
        setMessageScholar('Data berhasil disinkronisasi dengan Google Scholar.');
        const profile = await fetchLecturerProfile(selectedLecturerId);
        setScholarData(profile.scholarData);
        setScholarUser(profile.user);
      } else {
        setMessageScholar('Gagal melakukan sinkronisasi data.');
      }
    } catch {
      setMessageScholar('Terjadi kesalahan saat sync data.');
    } finally {
      setLoadingScholar(false);
    }
  }, [selectedLecturerId, scholarId]);

  // ==============================
  // Scopus handlers
  // ==============================
  const handleCheckIdScopus = useCallback(async () => {
    if (!scopusId) {
      setMessageScopus('Masukkan Scopus ID terlebih dahulu.');
      return;
    }
    try {
      setCheckingInfoScopus(true);
      setMessageScopus('');
      setCheckedAuthorScopus(null);
      const data = await checkScopusIdService(scopusId);
      setCheckedAuthorScopus(data);
      setMessageScopus('Author Scopus ditemukan! Silakan verifikasi dan Simpan.');
    } catch (err) {
      setMessageScopus(`Error: ${err instanceof Error ? err.message : 'Author tidak ditemukan'}`);
    } finally {
      setCheckingInfoScopus(false);
    }
  }, [scopusId]);

  const handleSaveScopusId = useCallback(async () => {
    if (!selectedLecturerId) return;
    try {
      setLoadingScopus(true);
      const ok = await saveScopusIdService(selectedLecturerId, scopusId);
      if (ok) {
        setMessageScopus('Scopus ID berhasil disimpan.');
        setScholarUser(prev => prev ? { ...prev, scopus_id: scopusId } : prev);
        setCheckedAuthorScopus(null);
        setLecturers(prev => prev.map(l => l.id == selectedLecturerId ? { ...l, scopus_id: scopusId } : l));
      }
    } catch {
      setMessageScopus('Gagal menyimpan Scopus ID.');
    } finally {
      setLoadingScopus(false);
    }
  }, [selectedLecturerId, scopusId]);

  const handleSyncScopus = useCallback(async () => {
    if (!scopusId) {
      setMessageScopus('Simpan Scopus ID terlebih dahulu sebelum sync.');
      return;
    }
    try {
      setLoadingScopus(true);
      setMessageScopus('Sedang menarik data dari Scopus...');
      const ok = await syncScopusService(selectedLecturerId);
      if (ok) {
        setMessageScopus('Data berhasil disinkronisasi dengan Scopus.');
        const profile = await fetchLecturerProfile(selectedLecturerId);
        setScopusData(profile.scopusData);
        setScholarUser(profile.user);
      } else {
        setMessageScopus('Gagal melakukan sinkronisasi data Scopus.');
      }
    } catch {
      setMessageScopus('Terjadi kesalahan saat sync data Scopus.');
    } finally {
      setLoadingScopus(false);
    }
  }, [selectedLecturerId, scopusId]);

  // ==============================
  // Filter & Pagination
  // ==============================
  const filteredLecturers = useMemo(() => {
    return lecturers.filter((l) => {
      const matchSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (l.email && l.email.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchFakultas = selectedFakultas ? l.fakultas === selectedFakultas : true;
      return matchSearch && matchFakultas;
    });
  }, [lecturers, searchTerm, selectedFakultas]);

  const totalPages = Math.ceil(filteredLecturers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLecturers = useMemo(
    () => filteredLecturers.slice(indexOfFirstItem, indexOfLastItem),
    [filteredLecturers, indexOfFirstItem, indexOfLastItem]
  );

  // Reset ke halaman 1 saat filter berubah
  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedFakultas]);

  const handleSelectLecturer = useCallback((id: string) => {
    setSelectedLecturerId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return {
    // Data
    lecturers,
    setLecturers,
    selectedLecturerId,
    scholarUser,
    scholarData,
    scopusData,
    scholarId,
    scopusId,

    // UI states
    loadingScholar,
    loadingScopus,
    checkingInfoScholar,
    checkingInfoScopus,
    checkedAuthorScholar,
    checkedAuthorScopus,
    messageScholar,
    messageScopus,

    // Filter & Pagination
    searchTerm,
    setSearchTerm,
    selectedFakultas,
    setSelectedFakultas,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    indexOfFirstItem,
    indexOfLastItem,
    filteredLecturers,
    currentLecturers,

    // Handlers
    setScholarId,
    setScopusId,
    setSelectedLecturerId,
    handleCheckIdScholar,
    handleSaveScholarId,
    handleSyncScholar,
    handleCheckIdScopus,
    handleSaveScopusId,
    handleSyncScopus,
    handleSelectLecturer,
    setCheckedAuthorScholar,
    setCheckedAuthorScopus,
  };
}
