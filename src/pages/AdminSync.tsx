import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, AlertCircle, BookOpen, Search, User, GraduationCap, Globe } from 'lucide-react';

export default function AdminSync() {
  const [lecturers, setLecturers] = useState<any[]>([]);
  const [selectedLecturerId, setSelectedLecturerId] = useState<string>('');
  
  // States related to selected lecturer
  const [scholarId, setScholarId] = useState('');
  const [scholarData, setScholarData] = useState<any>(null);
  
  const [scopusId, setScopusId] = useState('');
  const [scopusData, setScopusData] = useState<any>(null);
  
  const [scholarUser, setScholarUser] = useState<any>(null); // the selected user data
  
  // UI states Scholar
  const [loadingScholar, setLoadingScholar] = useState(false);
  const [checkingInfoScholar, setCheckingInfoScholar] = useState(false);
  const [checkedAuthorScholar, setCheckedAuthorScholar] = useState<any>(null);
  const [messageScholar, setMessageScholar] = useState('');

  // UI states Scopus
  const [loadingScopus, setLoadingScopus] = useState(false);
  const [checkingInfoScopus, setCheckingInfoScopus] = useState(false);
  const [checkedAuthorScopus, setCheckedAuthorScopus] = useState<any>(null);
  const [messageScopus, setMessageScopus] = useState('');

  // Fetch all lecturers on mount
  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const res = await fetch('/api/admin/lecturers');
        const data = await res.json();
        setLecturers(data.lecturers);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLecturers();
  }, []);

  // Fetch specific lecturer data when selected
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

    const fetchProfile = async () => {
      try {
        setLoadingScholar(true);
        setLoadingScopus(true);
        const res = await fetch(`/api/users/${selectedLecturerId}`);
        if (res.ok) {
          const data = await res.json();
          setScholarData(data.scholarData);
          setScopusData(data.scopusData);
          setScholarUser(data.user);
          setScholarId(data.user.scholar_id || '');
          setScopusId(data.user.scopus_id || '');
          setMessageScholar('');
          setMessageScopus('');
          setCheckedAuthorScholar(null);
          setCheckedAuthorScopus(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingScholar(false);
        setLoadingScopus(false);
      }
    };

    fetchProfile();
  }, [selectedLecturerId]);

  const handleCheckIdScholar = async () => {
    if (!scholarId) {
      setMessageScholar('Masukkan Google Scholar ID terlebih dahulu.');
      return;
    }
    try {
      setCheckingInfoScholar(true);
      setMessageScholar('');
      setCheckedAuthorScholar(null);
      const res = await fetch(`/api/scholar/check/${scholarId}`);
      if (res.ok) {
        const data = await res.json();
        setCheckedAuthorScholar(data);
        setMessageScholar('Author ditemukan! Silakan verifikasi dan Simpan.');
      } else {
        const errData = await res.json();
        setMessageScholar(`Error: ${errData.error || 'Author tidak ditemukan'}`);
      }
    } catch (err) {
      setMessageScholar('Gagal mengecek Scholar ID.');
    } finally {
      setCheckingInfoScholar(false);
    }
  };

  const handleSaveScholarId = async () => {
    if (!selectedLecturerId) return;
    try {
      setLoadingScholar(true);
      const res = await fetch(`/api/users/${selectedLecturerId}/scholar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scholar_id: scholarId }),
      });
      if (res.ok) {
        setMessageScholar('Google Scholar ID berhasil disimpan.');
        setScholarUser({ ...scholarUser, scholar_id: scholarId });
        setCheckedAuthorScholar(null);
        setLecturers(lecturers.map(l => l.id == selectedLecturerId ? { ...l, scholar_id: scholarId } : l));
      }
    } catch (err) {
      setMessageScholar('Gagal menyimpan Scholar ID.');
    } finally {
      setLoadingScholar(false);
    }
  };

  const handleSyncScholar = async () => {
    if (!scholarId) {
      setMessageScholar('Simpan Google Scholar ID terlebih dahulu sebelum sync.');
      return;
    }
    try {
      setLoadingScholar(true);
      setMessageScholar('Sedang menarik data dari Google Scholar...');
      const res = await fetch(`/api/users/${selectedLecturerId}/sync`, {
        method: 'POST',
      });
      if (res.ok) {
        setMessageScholar('Data berhasil disinkronisasi dengan Google Scholar.');
        const profileRes = await fetch(`/api/users/${selectedLecturerId}`);
        const data = await profileRes.json();
        setScholarData(data.scholarData);
        setScholarUser(data.user);
      } else {
        setMessageScholar('Gagal melakukan sinkronisasi data.');
      }
    } catch (err) {
      setMessageScholar('Terjadi kesalahan saat sync data.');
    } finally {
      setLoadingScholar(false);
    }
  };

  const handleCheckIdScopus = async () => {
    if (!scopusId) {
      setMessageScopus('Masukkan Scopus ID terlebih dahulu.');
      return;
    }
    try {
      setCheckingInfoScopus(true);
      setMessageScopus('');
      setCheckedAuthorScopus(null);
      const res = await fetch(`/api/scopus/check/${scopusId}`);
      if (res.ok) {
        const data = await res.json();
        setCheckedAuthorScopus(data);
        setMessageScopus('Author Scopus ditemukan! Silakan verifikasi dan Simpan.');
      } else {
        const errData = await res.json();
        setMessageScopus(`Error: ${errData.error || 'Author tidak ditemukan'}`);
      }
    } catch (err) {
      setMessageScopus('Gagal mengecek Scopus ID.');
    } finally {
      setCheckingInfoScopus(false);
    }
  };

  const handleSaveScopusId = async () => {
    if (!selectedLecturerId) return;
    try {
      setLoadingScopus(true);
      const res = await fetch(`/api/users/${selectedLecturerId}/scopus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scopus_id: scopusId }),
      });
      if (res.ok) {
        setMessageScopus('Scopus ID berhasil disimpan.');
        setScholarUser({ ...scholarUser, scopus_id: scopusId });
        setCheckedAuthorScopus(null);
        setLecturers(lecturers.map(l => l.id == selectedLecturerId ? { ...l, scopus_id: scopusId } : l));
      }
    } catch (err) {
      setMessageScopus('Gagal menyimpan Scopus ID.');
    } finally {
      setLoadingScopus(false);
    }
  };

  const handleSyncScopus = async () => {
    if (!scopusId) {
      setMessageScopus('Simpan Scopus ID terlebih dahulu sebelum sync.');
      return;
    }
    try {
      setLoadingScopus(true);
      setMessageScopus('Sedang menarik data dari Scopus...');
      const res = await fetch(`/api/users/${selectedLecturerId}/sync-scopus`, {
        method: 'POST',
      });
      if (res.ok) {
        setMessageScopus('Data berhasil disinkronisasi dengan Scopus.');
        const profileRes = await fetch(`/api/users/${selectedLecturerId}`);
        const data = await profileRes.json();
        setScopusData(data.scopusData);
        setScholarUser(data.user);
      } else {
        setMessageScopus('Gagal melakukan sinkronisasi data Scopus. Kemungkinan API Key tidak valid.');
      }
    } catch (err) {
      setMessageScopus('Terjadi kesalahan saat sync data Scopus.');
    } finally {
      setLoadingScopus(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Select Lecturer Card */}
      <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50 flex items-center">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg mr-3">
            <RefreshCw className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100">Sinkronisasi Data Dosen</h3>
        </div>
        <div className="p-6">
          <label htmlFor="lecturer-select" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
            Pilih Dosen
          </label>
          <select
            id="lecturer-select"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md border"
            value={selectedLecturerId}
            onChange={(e) => setSelectedLecturerId(e.target.value)}
          >
            <option value="">-- Pilih Nama Dosen --</option>
            {lecturers.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {scholarUser && (
        <div className="space-y-8">
          {/* Identity Info */}
          <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden bg-gradient-to-r from-zinc-50/50 to-white dark:from-zinc-900/30 dark:to-zinc-900">
             <div className="p-6 flex flex-col md:flex-row gap-6 md:items-center">
                <div className="h-16 w-16 rounded-2xl bg-primary-500 dark:bg-primary-900/40 flex items-center justify-center text-white dark:text-primary-300 text-2xl font-black shadow-lg shadow-primary-500/10 transform rotate-3 hover:rotate-0 transition-all duration-300">
                  {scholarUser.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xl font-extrabold text-gray-900 dark:text-zinc-100">{scholarUser.name}</h4>
                  <div className="mt-1 flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4">
                    <p className="text-sm text-gray-500 dark:text-zinc-400 flex items-center">
                      <GraduationCap className="h-4 w-4 mr-1 text-gray-400" />
                      {scholarUser.program_studi || 'Prodi tidak diatur'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 flex items-center">
                      <Globe className="h-4 w-4 mr-1 text-gray-400" />
                      {scholarUser.email}
                    </p>
                  </div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* GOOGLE SCHOLAR INTEGRATION */}
            <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-2xl border border-blue-100 dark:border-blue-900/30 overflow-hidden hover:shadow-md transition-all">
              <div className="px-6 py-5 border-b border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-950/20 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                    <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-900 dark:text-zinc-100">Google Scholar</h3>
                </div>
                {messageScholar && (
                  <span className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1 rounded-full font-medium">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {messageScholar}
                  </span>
                )}
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label htmlFor="scholarId" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                    Google Scholar ID
                  </label>
                  <div className="mt-2 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="e.g. xxxxxxxAAAAJ"
                      value={scholarId}
                      onChange={(e) => {
                        setScholarId(e.target.value);
                        setCheckedAuthorScholar(null);
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleCheckIdScholar}
                      disabled={checkingInfoScholar || !scholarId}
                      className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                    >
                      {checkingInfoScholar ? 'Mengecek...' : 'Cek ID'}
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveScholarId}
                      disabled={loadingScholar || !scholarId || (scholarId !== scholarUser.scholar_id && !checkedAuthorScholar)}
                      className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                    >
                      Simpan
                    </button>
                  </div>
                </div>

                {checkedAuthorScholar && (
                  <div className="mt-4 p-4 border border-blue-100 dark:border-blue-900/30 bg-gradient-to-r from-blue-50/50 to-white dark:from-blue-950/10 dark:to-zinc-900/10 rounded-xl flex items-center shadow-sm">
                    {checkedAuthorScholar.thumbnail ? (
                      <img 
                        src={checkedAuthorScholar.thumbnail} 
                        alt={checkedAuthorScholar.name} 
                        className="h-14 w-14 rounded-full border border-white dark:border-zinc-800 bg-white dark:bg-zinc-800 mr-4 shadow-sm"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mr-4">
                         <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    )}
                    <div>
                        <h4 className="text-base font-bold text-gray-900 dark:text-zinc-100">{checkedAuthorScholar.name}</h4>
                        <p className="text-xs text-gray-600 dark:text-zinc-400">{checkedAuthorScholar.affiliations}</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mt-1">Total Sitasi: {checkedAuthorScholar.total_citations || 0}</p>
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 dark:border-zinc-800 pt-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                    <h4 className="text-md font-bold text-gray-900 dark:text-zinc-100">Statistik Sitasi Saat Ini</h4>
                    <button
                      onClick={handleSyncScholar}
                      disabled={loadingScholar || !scholarUser.scholar_id}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
                    >
                      <RefreshCw className={`mr-2 h-4 w-4 ${loadingScholar ? 'animate-spin' : ''}`} />
                      Sync Sekarang
                    </button>
                  </div>

                  {scholarData ? (
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 transition-all hover:scale-105">
                        <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Total Sitasi</p>
                        <p className="mt-1 text-3xl font-extrabold text-blue-900 dark:text-blue-100 font-mono">{scholarData.total_citations}</p>
                      </div>
                      <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30 transition-all hover:scale-105">
                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">H-Index</p>
                        <p className="mt-1 text-3xl font-extrabold text-emerald-900 dark:text-emerald-100 font-mono">{scholarData.h_index}</p>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-xl border border-purple-100 dark:border-purple-900/30 transition-all hover:scale-105">
                        <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">i10-Index</p>
                        <p className="mt-1 text-3xl font-extrabold text-purple-900 dark:text-zinc-100 font-mono">{scholarData.i10_index}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 dark:bg-zinc-800/50 text-gray-500 dark:text-zinc-400 rounded-xl border border-dotted border-gray-300 dark:border-zinc-700">
                      <BookOpen className="mx-auto h-8 w-8 mb-2 opacity-50" />
                      Belum ada data Google Scholar disinkronisasi.
                    </div>
                  )}
                  {scholarData && <p className="mt-4 text-xs text-gray-400 text-right">Terakhir disinkronisasi: {new Date(scholarData.last_synced).toLocaleString('id-ID')}</p>}
                </div>
              </div>
            </div>

            {/* SCOPUS INTEGRATION */}
            <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-2xl border border-orange-200 dark:border-orange-900/30 overflow-hidden hover:shadow-md transition-all">
              <div className="px-6 py-5 border-b border-orange-200 dark:border-orange-900/30 bg-orange-50/50 dark:bg-orange-950/20 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg mr-3">
                    <Globe className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="text-lg font-bold text-orange-900 dark:text-accent-orange-400">Scopus</h3>
                </div>
                {messageScopus && (
                  <span className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1 rounded-full font-medium">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {messageScopus}
                  </span>
                )}
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label htmlFor="scopusId" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                    Scopus ID
                  </label>
                  <div className="mt-2 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                      placeholder="e.g. 57xxxxxxxxx"
                      value={scopusId}
                      onChange={(e) => {
                        setScopusId(e.target.value);
                        setCheckedAuthorScopus(null);
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleCheckIdScopus}
                      disabled={checkingInfoScopus || !scopusId}
                      className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 disabled:opacity-50"
                    >
                      {checkingInfoScopus ? 'Mengecek...' : 'Cek ID'}
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveScopusId}
                      disabled={loadingScopus || !scopusId || (scopusId !== scholarUser.scopus_id && !checkedAuthorScopus)}
                      className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-orange-600 text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 disabled:opacity-50"
                    >
                      Simpan
                    </button>
                  </div>
                </div>

                {checkedAuthorScopus && (
                  <div className="mt-4 p-4 border border-orange-200 dark:border-orange-900/30 bg-gradient-to-r from-orange-50/50 to-white dark:from-orange-950/10 dark:to-zinc-900/10 rounded-xl flex items-start space-x-4 shadow-sm">
                    <div>
                      <h4 className="text-base font-bold text-gray-900 dark:text-zinc-100">{checkedAuthorScopus.name}</h4>
                      <p className="text-xs text-gray-600 dark:text-zinc-400">{checkedAuthorScopus.affiliations}</p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">Tekan tombol Simpan di atas jika sesuai.</p>
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 dark:border-zinc-800 pt-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                    <h4 className="text-md font-bold text-gray-900 dark:text-zinc-100">Statistik Sitasi Scopus</h4>
                    <button
                      onClick={handleSyncScopus}
                      disabled={loadingScopus || !scholarUser.scopus_id}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none disabled:opacity-50"
                    >
                      <RefreshCw className={`mr-2 h-4 w-4 ${loadingScopus ? 'animate-spin' : ''}`} />
                      Sync Sekarang
                    </button>
                  </div>

                  {scopusData ? (
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-xl border border-amber-100 dark:border-amber-900/30 transition-all hover:scale-105">
                        <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">Total Dokumen</p>
                        <p className="mt-1 text-3xl font-extrabold text-amber-900 dark:text-blue-100 font-mono">{scopusData.document_count}</p>
                      </div>
                      <div className="bg-sky-50 dark:bg-sky-950/30 p-4 rounded-xl border border-sky-100 dark:border-sky-900/30 transition-all hover:scale-105">
                        <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">Total Sitasi</p>
                        <p className="mt-1 text-3xl font-extrabold text-sky-900 dark:text-blue-100 font-mono">{scopusData.total_citations}</p>
                      </div>
                      <div className="bg-teal-50 dark:bg-teal-950/30 p-4 rounded-xl border border-teal-100 dark:border-teal-900/30 transition-all hover:scale-105">
                        <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1">H-Index</p>
                        <p className="mt-1 text-3xl font-extrabold text-teal-900 dark:text-blue-100 font-mono">{scopusData.h_index}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 dark:bg-zinc-800/50 text-gray-500 dark:text-zinc-400 rounded-xl border border-dotted border-gray-300 dark:border-zinc-700">
                      <Globe className="mx-auto h-8 w-8 mb-2 opacity-50" />
                      Belum ada data Scopus disinkronisasi.
                    </div>
                  )}
                  {scopusData && <p className="mt-4 text-xs text-gray-400 text-right">Terakhir disinkronisasi: {new Date(scopusData.last_synced).toLocaleString('id-ID')}</p>}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
