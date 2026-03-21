import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, GraduationCap, TrendingUp, BookOpen, Award, FileText, RefreshCw, CheckCircle, Globe, ExternalLink, Mail, User } from 'lucide-react';

export default function AdminLecturerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [syncingScholar, setSyncingScholar] = useState(false);
  const [syncingScopus, setSyncingScopus] = useState(false);
  const [message, setMessage] = useState('');
  
  const [pubFilter, setPubFilter] = useState<'all' | 'scholar' | 'scopus'>('all');
  const [pubPage, setPubPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/users/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  const handleSyncScholar = async () => {
    if (!profile?.user?.scholar_id) {
      setMessage('Dosen belum memiliki Google Scholar ID.');
      return;
    }
    try {
      setSyncingScholar(true);
      setMessage('');
      const res = await fetch(`/api/users/${id}/sync`, { method: 'POST' });
      if (res.ok) {
        setMessage('Data Google Scholar berhasil disinkronisasi.');
        const profileRes = await fetch(`/api/users/${id}`);
        const data = await profileRes.json();
        setProfile(data);
      } else {
        setMessage('Gagal melakukan sinkronisasi Google Scholar.');
      }
    } catch (err) {
      setMessage('Terjadi kesalahan koneksi.');
    } finally {
      setSyncingScholar(false);
    }
  };

  const handleSyncScopus = async () => {
    if (!profile?.user?.scopus_id) {
      setMessage('Dosen belum memiliki Scopus ID.');
      return;
    }
    try {
      setSyncingScopus(true);
      setMessage('');
      const res = await fetch(`/api/users/${id}/sync-scopus`, { method: 'POST' });
      if (res.ok) {
        setMessage('Data Scopus berhasil disinkronisasi.');
        const profileRes = await fetch(`/api/users/${id}`);
        const data = await profileRes.json();
        setProfile(data);
      } else {
        setMessage('Gagal melakukan sinkronisasi Scopus. Cek konfigurasi API.');
      }
    } catch (err) {
      setMessage('Terjadi kesalahan koneksi.');
    } finally {
      setSyncingScopus(false);
    }
  };

  // Modern Skeleton Loading
  if (loading) return (
    <div className="max-w-7xl mx-auto space-y-6 animate-pulse pb-12">
      <div className="h-6 w-48 bg-gray-200 dark:bg-zinc-800 rounded"></div>
      <div className="h-64 bg-gray-200 dark:bg-zinc-800 rounded-xl"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 h-96 bg-gray-200 dark:bg-zinc-800 rounded-xl"></div>
        <div className="lg:col-span-2 h-96 bg-gray-200 dark:bg-zinc-800 rounded-xl"></div>
      </div>
    </div>
  );

  if (!profile || !profile.user) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <User className="h-16 w-16 text-gray-300 dark:text-zinc-700 mb-4" />
      <h2 className="text-xl font-semibold text-gray-700 dark:text-zinc-300">User tidak ditemukan</h2>
      <button onClick={() => navigate('/admin/lecturers')} className="mt-4 text-primary-600 hover:underline">Kembali ke Daftar</button>
    </div>
  );

  const { user, scholarData, scopusData, publications, scopusPublications } = profile;

  // Merge and tag publications
  const scholarPubsTagged = (publications || []).map((p: any) => ({ ...p, source: 'scholar' }));
  const scopusPubsTagged = (scopusPublications || []).map((p: any) => ({ ...p, source: 'scopus' }));
  const allPubs = [...scholarPubsTagged, ...scopusPubsTagged].sort((a, b) => (b.year || 0) - (a.year || 0));

  const filteredPubs = pubFilter === 'all' ? allPubs 
    : pubFilter === 'scholar' ? scholarPubsTagged 
    : scopusPubsTagged;

  const totalPages = Math.ceil(filteredPubs.length / itemsPerPage);
  const startIdx = (pubPage - 1) * itemsPerPage;
  const currentPubs = filteredPubs.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 transition-all duration-300">
      <button 
        onClick={() => navigate('/admin/lecturers')}
        className="group flex items-center text-sm text-gray-500 hover:text-primary-600 font-medium transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
        Kembali ke Daftar Dosen
      </button>

      {/* Header Profile */}
      <div className="bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden relative">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-800 dark:to-primary-950 h-36"></div>
        <div className="px-6 sm:px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-16 mb-6">
            <div className="relative group">
              {scholarData?.thumbnail ? (
                <img 
                  src={scholarData.thumbnail} 
                  alt={user.name} 
                  className="h-32 w-32 rounded-full border-4 border-white dark:border-zinc-900 object-cover shadow-lg bg-white dark:bg-zinc-800"
                />
              ) : (
                <div className="h-32 w-32 rounded-full border-4 border-white dark:border-zinc-900 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 flex items-center justify-center text-primary-700 dark:text-primary-300 text-4xl font-bold shadow-lg">
                  {user.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex items-center bg-gradient-to-r from-primary-50 to-white dark:from-primary-900/20 dark:to-zinc-800 px-5 py-2.5 rounded-xl border border-primary-100 dark:border-primary-900/30 shadow-sm">
              <TrendingUp className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2.5" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-zinc-400 font-semibold leading-none mb-1">Total KPI</span>
                <span className="text-primary-900 dark:text-primary-300 font-bold leading-none">{user.total_kpi_points} Points</span>
              </div>
            </div>
          </div>
          
          <div className="pt-2">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{user.name}</h1>
            <div className="flex items-center text-gray-500 dark:text-zinc-400 mt-2">
              <Mail className="w-4 h-4 mr-1.5" />
              <p>{user.email}</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <div className="flex items-center text-sm text-gray-700 dark:text-zinc-200 bg-gray-100/80 dark:bg-zinc-800/80 px-4 py-2 rounded-lg border border-gray-200/50 dark:border-zinc-700/50">
                <GraduationCap className="h-4 w-4 mr-2 text-primary-500 dark:text-primary-400" />
                Program Studi: <span className="font-semibold ml-1.5">{user.program_studi || '-'}</span>
              </div>
              <div className="flex items-center text-sm text-gray-700 dark:text-zinc-200 bg-gray-100/80 dark:bg-zinc-800/80 px-4 py-2 rounded-lg border border-gray-200/50 dark:border-zinc-700/50">
                <Award className="h-4 w-4 mr-2 text-amber-500 dark:text-amber-400" />
                Role: <span className="font-semibold ml-1.5 capitalize">{user.role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Stats & Integrations */}
        <div className="lg:col-span-1 space-y-6">
          {/* Google Scholar Summary */}
          <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden hover:shadow-md transition-shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 bg-gradient-to-r from-gray-50 to-white dark:from-zinc-800/50 dark:to-zinc-900 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-lg mr-3">
                  <BookOpen className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Google Scholar</h3>
              </div>
            </div>
            
            {message && message.includes('Scholar') && (
              <div className="px-6 pt-4">
                <div className={`p-3 rounded-lg text-sm flex items-start ${message.includes('Gagal') ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                  <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  {message}
                </div>
              </div>
            )}

            <div className="p-6">
              {scholarData ? (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Scholar ID</p>
                      <p className="text-sm text-gray-900 dark:text-white font-mono bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded border border-gray-200 dark:border-zinc-700 inline-block">{user.scholar_id}</p>
                    </div>
                    <button
                      onClick={handleSyncScholar}
                      disabled={syncingScholar}
                      className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors shadow-sm"
                    >
                      <RefreshCw className={`mr-2 h-4 w-4 ${syncingScholar ? 'animate-spin' : ''}`} />
                      Sync Data
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 text-center hover:-translate-y-1 transition-transform duration-200">
                      <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Total Sitasi</p>
                      <p className="text-3xl font-extrabold text-blue-900 dark:text-blue-300">{scholarData.total_citations}</p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30 text-center hover:-translate-y-1 transition-transform duration-200">
                      <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">h-index</p>
                      <p className="text-3xl font-extrabold text-emerald-900 dark:text-emerald-300">{scholarData.h_index}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 p-4 rounded-xl border border-purple-100 dark:border-purple-900/30 text-center col-span-2 hover:-translate-y-1 transition-transform duration-200">
                      <p className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">i10-index</p>
                      <p className="text-3xl font-extrabold text-purple-900 dark:text-purple-300">{scholarData.i10_index}</p>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-400 dark:text-zinc-500 text-center pt-4 border-t border-gray-100 dark:border-zinc-800">
                    Update terakhir: {new Date(scholarData.last_synced).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 border border-gray-100 dark:border-zinc-700">
                    <BookOpen className="h-8 w-8 text-gray-300 dark:text-zinc-600" />
                  </div>
                  <p className="text-gray-500 dark:text-zinc-400 text-sm font-medium">Belum ada data Scholar terhubung.</p>
                </div>
              )}
            </div>
          </div>

          {/* Scopus Summary */}
          <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden hover:shadow-md transition-shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 bg-gradient-to-r from-orange-50 to-white dark:from-orange-950/20 dark:to-zinc-900 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg mr-3">
                  <Globe className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Scopus</h3>
              </div>
            </div>

            {message && message.includes('Scopus') && (
              <div className="px-6 pt-4">
                <div className={`p-3 rounded-lg text-sm flex items-start ${message.includes('Gagal') ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                  <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  {message}
                </div>
              </div>
            )}

            <div className="p-6">
              {scopusData ? (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Scopus ID</p>
                      <p className="text-sm text-gray-900 dark:text-white font-mono bg-orange-50 dark:bg-orange-950/20 px-2 py-1 rounded border border-orange-100 dark:border-orange-900/30 inline-block">{user.scopus_id}</p>
                    </div>
                    <button
                      onClick={handleSyncScopus}
                      disabled={syncingScopus}
                      className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-colors shadow-sm"
                    >
                      <RefreshCw className={`mr-2 h-4 w-4 ${syncingScopus ? 'animate-spin' : ''}`} />
                      Sync Data
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-800/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30 text-center col-span-2 hover:-translate-y-1 transition-transform duration-200">
                       <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">Total Dokumen</p>
                       <p className="text-3xl font-extrabold text-indigo-900 dark:text-indigo-300">{scopusData.document_count}</p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10 p-4 rounded-xl border border-amber-100 dark:border-amber-900/30 text-center hover:-translate-y-1 transition-transform duration-200">
                      <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">Sitasi</p>
                      <p className="text-3xl font-extrabold text-amber-900 dark:text-amber-300">{scopusData.total_citations}</p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30 text-center hover:-translate-y-1 transition-transform duration-200">
                      <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">h-index</p>
                      <p className="text-3xl font-extrabold text-emerald-900 dark:text-emerald-300">{scopusData.h_index}</p>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-400 dark:text-zinc-500 text-center pt-4 border-t border-gray-100 dark:border-zinc-800">
                    Update terakhir: {new Date(scopusData.last_synced).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 border border-gray-100 dark:border-zinc-700">
                    <Globe className="h-8 w-8 text-gray-300 dark:text-zinc-600" />
                  </div>
                  <p className="text-gray-500 dark:text-zinc-400 text-sm font-medium">Belum ada data Scopus terhubung.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Unified Publications List */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden flex flex-col h-full">
            {/* Header with Tabs */}
            <div className="px-6 py-5 border-b border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/30">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center">
                  <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-lg mr-3">
                    <FileText className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Daftar Publikasi</h3>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">Total {filteredPubs.length} dokumen ditemukan</p>
                  </div>
                </div>
                {/* Tab Filters */}
                <div className="flex bg-gray-100 dark:bg-zinc-800/80 rounded-xl p-1 border border-gray-200 dark:border-zinc-700">
                  <button
                    onClick={() => { setPubFilter('all'); setPubPage(1); }}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                      pubFilter === 'all'
                        ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-200 dark:ring-zinc-600'
                        : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200'
                    }`}
                  >
                    Semua ({allPubs.length})
                  </button>
                  <button
                    onClick={() => { setPubFilter('scholar'); setPubPage(1); }}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                      pubFilter === 'scholar'
                        ? 'bg-white dark:bg-zinc-700 text-primary-700 dark:text-primary-400 shadow-sm ring-1 ring-gray-200 dark:ring-zinc-600'
                        : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200'
                    }`}
                  >
                    Scholar ({scholarPubsTagged.length})
                  </button>
                  <button
                    onClick={() => { setPubFilter('scopus'); setPubPage(1); }}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                      pubFilter === 'scopus'
                        ? 'bg-white dark:bg-zinc-700 text-orange-700 dark:text-orange-400 shadow-sm ring-1 ring-gray-200 dark:ring-zinc-600'
                        : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200'
                    }`}
                  >
                    Scopus ({scopusPubsTagged.length})
                  </button>
                </div>
              </div>
            </div>

            {/* Publication Items */}
            <div className="divide-y divide-gray-100 dark:divide-zinc-800 flex-1">
              {currentPubs.length > 0 ? (
                currentPubs.map((pub: any, idx: number) => (
                  <div key={`${pub.source}-${pub.id}-${idx}`} className="group px-6 py-5 hover:bg-gray-50/80 dark:hover:bg-zinc-800/50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                            pub.source === 'scholar'
                              ? 'bg-primary-50 text-primary-700 border border-primary-100 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-800/30'
                              : 'bg-orange-50 text-orange-700 border border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/30'
                          }`}>
                            {pub.source === 'scholar' ? (
                              <><BookOpen className="h-3 w-3 mr-1.5" />Scholar</>
                            ) : (
                              <><Globe className="h-3 w-3 mr-1.5" />Scopus</>
                            )}
                          </span>
                          {pub.year && (
                            <span className="text-xs font-medium bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 px-2 py-1 rounded-md">
                              {pub.year}
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1.5 leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {pub.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-zinc-400 mb-3 line-clamp-1">{pub.authors}</p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-zinc-500">
                          {pub.journal && (
                            <span className="flex items-center bg-gray-50 dark:bg-zinc-800/50 px-2 py-1 rounded border border-gray-100 dark:border-zinc-700/50">
                              <ExternalLink className="h-3 w-3 mr-1.5 text-gray-400" />
                              <span className="truncate max-w-[200px] sm:max-w-[300px] italic">{pub.journal}</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center flex-shrink-0 w-16 h-16 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 group-hover:bg-white dark:group-hover:bg-zinc-800 group-hover:shadow-sm group-hover:border-gray-200 transition-all">
                        <span className="text-xl font-extrabold text-gray-900 dark:text-white">{pub.citations || 0}</span>
                        <span className="text-[9px] font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mt-0.5">Sitasi</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center h-full">
                  <div className="w-20 h-20 bg-gray-50 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-5 border border-gray-100 dark:border-zinc-800">
                    <FileText className="h-10 w-10 text-gray-300 dark:text-zinc-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Belum ada publikasi</h3>
                  <p className="text-gray-500 dark:text-zinc-400 text-sm max-w-sm">
                    {pubFilter === 'all' 
                      ? 'Dosen ini belum memiliki data publikasi di sistem.' 
                      : pubFilter === 'scholar' 
                        ? 'Belum ada data publikasi yang ditarik dari Google Scholar.'
                        : 'Belum ada data publikasi yang ditarik dari database Scopus.'}
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/30">
                <span className="text-sm text-gray-500 dark:text-zinc-400">
                  Menampilkan <span className="font-semibold text-gray-900 dark:text-white">{startIdx + 1}</span>–
                  <span className="font-semibold text-gray-900 dark:text-white">{Math.min(startIdx + itemsPerPage, filteredPubs.length)}</span> dari{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">{filteredPubs.length}</span>
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPubPage((p) => Math.max(p - 1, 1))}
                    disabled={pubPage === 1}
                    className="px-3 py-1.5 text-sm font-medium border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-white dark:hover:bg-zinc-700 hover:text-primary-600 text-gray-700 dark:text-zinc-300 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-700 transition-colors bg-transparent shadow-sm"
                  >
                    ← Prev
                  </button>
                  <button
                    onClick={() => setPubPage((p) => Math.min(p + 1, totalPages))}
                    disabled={pubPage === totalPages}
                    className="px-3 py-1.5 text-sm font-medium border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-white dark:hover:bg-zinc-700 hover:text-primary-600 text-gray-700 dark:text-zinc-300 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-700 transition-colors bg-transparent shadow-sm"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}