import React, { useState, useEffect, memo, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, GraduationCap, TrendingUp, BookOpen, Award, FileText, RefreshCw, CheckCircle, Globe, ExternalLink, Mail, User, Fingerprint, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { calculateScholarPoints, calculateScopusSintaPoints } from '../dosen/dashboard/pointsCalculator';
import ExternalDocumentsView from '../dosen/dashboard/components/ExternalDocumentsView';
import InternalDocumentsView from '../dosen/dashboard/components/InternalDocumentsView';

// 4. Komponen Utama Halaman
export default function AdminLecturerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [internalDocuments, setInternalDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  const [activeView, setActiveView] = useState<'external' | 'internal'>('external');
  const [publicationSubTab, setPublicationSubTab] = useState<'scopus' | 'scholar' | 'cross_indexed' | 'metriks'>('scopus');
  const [categoryFilter, setCategoryFilter] = useState<string>('penelitian');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const stats = useMemo(() => {
    const user = profile?.user;
    const publications = profile?.publications || [];
    const scopusPublications = profile?.scopusPublications || [];

    if (!user) return null;

    const normalizeT = (t: string) => (t || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const crossTitles = new Set(
      (publications || []).filter(sd => (scopusPublications || []).some(s => normalizeT(s.title) === normalizeT(sd.title)))
        .map(d => normalizeT(d.title))
    );

    const extCross    = (scopusPublications || []).filter(s => crossTitles.has(normalizeT(s.title))).reduce((a: number, d: any) => a + calculateScopusSintaPoints(d), 0);
    const extScopus   = (scopusPublications || []).filter(s => !crossTitles.has(normalizeT(s.title))).reduce((a: number, d: any) => a + calculateScopusSintaPoints(d), 0);
    const extScholar  = parseFloat(
      (publications || []).filter(s => !crossTitles.has(normalizeT(s.title))).reduce((a: number, d: any) => a + calculateScholarPoints(d), 0).toFixed(1)
    );
    const extTotal = parseFloat((extCross + extScopus + extScholar).toFixed(1));

    const internalTotal = (internalDocuments || [])
      .filter((d: any) => d.status === 'Approved' && d.file_url && d.file_url !== '')
      .reduce((acc: number, d: any) => acc + (Number(d.awarded_points) || 0), 0);

    const grandTotal = parseFloat((extTotal + internalTotal).toFixed(1));

    return [
      { 
        label: 'Total KPI', 
        val: grandTotal.toLocaleString(), 
        icon: Award, 
        color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' 
      },
      { 
        label: 'Poin (External)',
        val: extTotal.toLocaleString(),
        icon: Globe, 
        color: 'bg-primary-500/10 text-primary-600 dark:text-primary-400' 
      },
      { 
        label: 'Poin (Internal)',
        val: internalTotal.toLocaleString(),
        icon: FileText, 
        color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
      }
    ];
  }, [profile, internalDocuments]);

  const fetchProfileAndDocs = async () => {
    try {
      setLoading(true);
      const [profileRes, docsRes, penRes] = await Promise.all([
        fetch(`/api/users/${id}`),
        fetch(`/api/users/${id}/documents`),
        fetch(`/api/penelitian?user_id=${id}`)
      ]);

      let combinedDocs: any[] = [];

      if (docsRes.ok) {
        const docsData = await docsRes.json();
        combinedDocs = [...(docsData.documents || [])];
      }

      if (penRes.ok) {
        const data = await penRes.json();
        const penDocs = (data.penelitian || []).map((p: any) => ({
          ...p,
          id_dokumen: 'RESEARCH-' + p.id,
          category: 'Penelitian',
          title: p.judul_penelitian,
          published_at: null,
          tahun_pelaksanaan: p.tahun,
          is_penelitian: true,
        }));
        combinedDocs = [...combinedDocs, ...penDocs];
      }

      setInternalDocuments(combinedDocs);

      if (profileRes.ok) {
        const data = await profileRes.json();
        setProfile(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProfileAndDocs();
    }
  }, [id]);

  const internalDocumentsOnly = useMemo(() => {
    return internalDocuments.filter(doc => doc.file_url && doc.file_url !== '');
  }, [internalDocuments]);

  const approvedDocs = useMemo(() => {
    return internalDocumentsOnly.filter(doc => doc.status === 'Approved');
  }, [internalDocumentsOnly]);

  const filteredDocs = useMemo(() => {
    const base = internalDocumentsOnly;
    if (categoryFilter === 'all') return base;
    return base.filter(doc => doc.category?.toLowerCase().includes(categoryFilter.toLowerCase()));
  }, [internalDocumentsOnly, categoryFilter]);

  const scholarChartData = useMemo(() => {
    const publications = profile?.publications || [];
    if (!publications || publications.length === 0) return { chartData: [], leftMax: 10, rightMax: 10 };
    const chartDataMap = new Map();
    publications.forEach((pub: any) => {
       if (pub.year && pub.year !== 'Unknown') {
         const yearKey = String(pub.year).trim();
         if (!chartDataMap.has(yearKey)) {
            chartDataMap.set(yearKey, { name: yearKey, publications: 0, citations: 0 });
         }
         const current = chartDataMap.get(yearKey);
         current.publications += 1;
         current.citations += (Number(pub.citations) || 0);
       }
    });
    const chartData = Array.from(chartDataMap.values()).sort((a: any, b: any) => parseInt(a.name) - parseInt(b.name));
    const getNiceMax = (max: number) => {
      if (!max || max <= 0) return 10;
      const roughMax = max * 1.15; 
      const magnitude = Math.pow(10, Math.floor(Math.log10(roughMax)));
      return Math.ceil(roughMax / magnitude) * magnitude;
    };
    return { 
      chartData, 
      leftMax: getNiceMax(Math.max(...chartData.map(d => d.publications), 0)), 
      rightMax: getNiceMax(Math.max(...chartData.map(d => d.citations), 0)) 
    };
  }, [profile]);

  const scopusChartData = useMemo(() => {
    const scopusPublications = profile?.scopusPublications || [];
    if (!scopusPublications || scopusPublications.length === 0) return { chartData: [], leftMax: 10, rightMax: 10 };
    const chartDataMap = new Map();
    scopusPublications.forEach((pub: any) => {
       if (pub.year && pub.year !== 'Unknown') {
         const yearKey = String(pub.year).trim();
         if (!chartDataMap.has(yearKey)) {
            chartDataMap.set(yearKey, { name: yearKey, publications: 0, citations: 0 });
         }
         const current = chartDataMap.get(yearKey);
         current.publications += 1;
         current.citations += (Number(pub.citations) || 0);
       }
    });
    const chartData = Array.from(chartDataMap.values()).sort((a: any, b: any) => parseInt(a.name) - parseInt(b.name));
    const getNiceMax = (max: number) => {
      if (!max || max <= 0) return 10;
      const roughMax = max * 1.15; 
      const magnitude = Math.pow(10, Math.floor(Math.log10(roughMax)));
      return Math.ceil(roughMax / magnitude) * magnitude;
    };
    return { 
      chartData, 
      leftMax: getNiceMax(Math.max(...chartData.map(d => d.publications), 0)), 
      rightMax: getNiceMax(Math.max(...chartData.map(d => d.citations), 0)) 
    };
  }, [profile]);

  const tabVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2, ease: "easeIn" } }
  };

  if (loading) return (
    <div className="max-w-none space-y-6 animate-pulse pb-12">
      <div className="h-6 w-48 bg-gray-200 dark:bg-zinc-800 rounded"></div>
      <div className="h-96 bg-gray-200 dark:bg-zinc-800 rounded-xl"></div>
      <div className="h-96 bg-gray-200 dark:bg-zinc-800 rounded-xl"></div>
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

  return (
    <div className="space-y-6 max-w-none pb-12 transition-all duration-300">
      <button 
        onClick={() => navigate('/admin/lecturers')}
        className="group flex items-center text-sm text-gray-500 hover:text-primary-600 font-medium transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
        Kembali ke Daftar Dosen
      </button>

      {/* TOP COMPREHENSIVE HEADER CARD */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-[2rem] border border-slate-200/60 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        {/* Header Cover Banner (Adaptive, Premium & Shorter) */}
        <div className="h-28 sm:h-32 w-full bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden border-b border-slate-200/40 dark:border-slate-800/50">
          {/* Soft decorative glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-10 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/5 rounded-full blur-3xl" />
        </div>

        {/* Profile details & KPI stats container */}
        <div className="px-6 pb-6 pt-0 sm:px-8 sm:pb-8">
          {/* Profile details row */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left -mt-8 relative z-10 mb-6">
            <div className="relative">
              <div className="h-24 w-24 rounded-3xl bg-white p-1 shadow-lg dark:bg-slate-900 border-2 border-white dark:border-slate-800">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="h-full w-full rounded-2xl object-cover"
                  />
                ) : scholarData?.thumbnail ? (
                  <img 
                    src={scholarData.thumbnail} 
                    alt={user.name} 
                    className="h-full w-full rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-2xl bg-primary-600 text-2xl font-black text-white">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              <div className="absolute -right-1 -bottom-1 flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
              </div>
            </div>

            <div className="space-y-1.5 pb-1 flex-1">
              <div className="inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified Lecturer Profile
              </div>
              <h2 className="text-2xl font-black leading-tight tracking-tight text-slate-950 dark:text-white">
                {user?.name || 'User'}
              </h2>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>{user?.program_studi || 'Lecturer'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 hidden sm:inline" />
                <span className="capitalize">{user?.role || 'Lecturer'}</span>
                {user?.penta_id && (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 hidden sm:inline" />
                    <span className="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400">
                      <Fingerprint className="h-3.5 w-3.5" />
                      <span className="font-black">{user.penta_id}</span>
                    </span>
                  </>
                )}
                {user?.email && (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 hidden sm:inline" />
                    <span className="inline-flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      <span>{user.email}</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {message && (
            <div className={`mb-6 p-3 rounded-lg text-sm flex items-start ${message.includes('Gagal') ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              {message}
            </div>
          )}

          {/* Elegant Divider */}
          <div className="h-px w-full bg-slate-100 dark:bg-slate-800 mb-6" />

          {/* KPI Stats Row (Full Width - Zero Overlap!) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 w-full">
            {stats?.map((stat, i) => (
              <div 
                key={i} 
                className="flex min-h-[92px] items-center gap-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white/85 px-5 py-4 dark:border-slate-800 dark:bg-gradient-to-br dark:from-slate-950/50 dark:to-slate-900/30 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 group"
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.color} transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{stat.label}</span>
                  <span className="mt-1.5 block text-2xl font-black leading-none tracking-tight text-slate-950 dark:text-white tabular-nums">{stat.val}</span>
                </div>
              </div>
            ))}
          </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 dark:border-slate-800 pt-8">
              
              {/* Box Scholar */}
              <div className="rounded-3xl border border-slate-200/60 bg-slate-50/50 p-6 dark:border-slate-800/80 dark:bg-slate-950/20 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50/80 text-blue-600 dark:border-blue-900/30 dark:bg-blue-950/20 dark:text-blue-400 shadow-sm">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Google Scholar</h3>
                        {user.scholar_id ? (
                          <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-1">ID: {user.scholar_id}</p>
                        ) : (
                          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">ID tidak terkonfigurasi</p>
                        )}
                      </div>
                    </div>
                    <span
                       className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                        scholarData
                           ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300'
                           : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400'
                       }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${scholarData ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
                      {scholarData ? 'Tersinkron' : 'Belum Sinkron'}
                    </span>
                  </div>

                  {scholarData ? (
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col justify-center gap-1">
                        <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Sitasi</span>
                        <span className="text-2xl font-black text-blue-600 dark:text-blue-400 tabular-nums">{scholarData.total_citations}</span>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col justify-center gap-1">
                        <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">h-index</span>
                        <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">{scholarData.h_index}</span>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col justify-center gap-1">
                        <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">i10-index</span>
                        <span className="text-2xl font-black text-purple-600 dark:text-purple-400 tabular-nums">{scholarData.i10_index}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm">
                      <BookOpen className="h-8 w-8 text-slate-200 dark:text-slate-800 mb-2" />
                      <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold">Belum ada data terhubung</p>
                    </div>
                  )}
                </div>
                {scholarData && (
                  <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 text-right mt-5">
                    Update Terakhir: {new Date(scholarData.last_synced).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                )}
              </div>

              {/* Box Scopus */}
              <div className="rounded-3xl border border-slate-200/60 bg-slate-50/50 p-6 dark:border-slate-800/80 dark:bg-slate-950/20 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-orange-100 bg-orange-50/80 text-orange-600 dark:border-orange-900/30 dark:bg-orange-950/20 dark:text-orange-400 shadow-sm">
                        <Globe className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Scopus</h3>
                        {user.scopus_id ? (
                          <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-1">ID: {user.scopus_id}</p>
                        ) : (
                          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">ID tidak terkonfigurasi</p>
                        )}
                      </div>
                    </div>
                    <span
                       className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                        scopusData
                           ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300'
                           : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400'
                       }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${scopusData ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
                      {scopusData ? 'Tersinkron' : 'Belum Sinkron'}
                    </span>
                  </div>

                  {scopusData ? (
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col justify-center gap-1">
                        <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Dokumen</span>
                        <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tabular-nums">{scopusData.document_count}</span>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col justify-center gap-1">
                        <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Sitasi</span>
                        <span className="text-2xl font-black text-amber-600 dark:text-amber-400 tabular-nums">{scopusData.total_citations}</span>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col justify-center gap-1">
                        <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">h-index</span>
                        <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">{scopusData.h_index}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm">
                      <Globe className="h-8 w-8 text-slate-200 dark:text-slate-800 mb-2" />
                      <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold">Belum ada data terhubung</p>
                    </div>
                  )}
                </div>
                {scopusData && (
                  <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 text-right mt-5">
                    Update Terakhir: {new Date(scopusData.last_synced).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                )}
              </div>

            </div>
        </div>
      </motion.div>

      {/* View Switcher Tabs */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mt-8">
        <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-[2rem] border border-slate-200/60 dark:border-slate-700 shadow-inner overflow-x-auto no-scrollbar max-w-full">
          {[
            { id: 'external', label: 'Dokumen Eksternal (API)', icon: Globe },
            { id: 'internal', label: 'Dokumen Internal', icon: FileText },
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => { setActiveView(view.id as any); setCurrentPage(1); }}
              className={`flex items-center gap-3 px-6 lg:px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${
                activeView === view.id 
                  ? 'bg-white dark:bg-slate-900 text-primary-600 shadow-xl shadow-primary-500/10' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <view.icon className={`w-4 h-4 ${activeView === view.id ? 'text-primary-600' : 'text-slate-400'}`} />
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {/* View Contents */}
      <div className="mt-6">
        {activeView === 'external' && (
          <ExternalDocumentsView 
            publicationSubTab={publicationSubTab}
            setPublicationSubTab={setPublicationSubTab}
            scopusChartData={scopusChartData}
            scholarChartData={scholarChartData}
            scopusData={profile?.scopusData}
            scholarData={profile?.scholarData}
            publications={profile?.publications || []}
            scopusPublications={profile?.scopusPublications || []}
            tabVariants={tabVariants}
            onRefresh={fetchProfileAndDocs}
          />
        )}

        {activeView === 'internal' && (
          <InternalDocumentsView 
            filteredDocs={filteredDocs}
            allInternalDocs={internalDocumentsOnly}
            loading={loading}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
          />
        )}
      </div>
    </div>
  );
}