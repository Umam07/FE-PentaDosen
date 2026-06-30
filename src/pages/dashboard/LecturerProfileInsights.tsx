import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Award, FileText, Building2, BookOpen, Calendar,
  GraduationCap, Users, Sparkles, TrendingUp, Zap,
  ArrowLeft, Search, ShieldCheck, Mail, MapPin,
  ExternalLink, Lock, Book, FileCode, CheckCircle2, Trophy,
  RefreshCw, Globe, Fingerprint
} from 'lucide-react';
import Navbar from '../../components/Home/Navbar';
import Footer from '../../components/Home/Footer';
import { calculateScholarPoints } from '../dosen/dashboard/pointsCalculator';
import ExternalDocumentsView from '../dosen/dashboard/components/ExternalDocumentsView';
import InternalDocumentsView from '../dosen/dashboard/components/InternalDocumentsView';



export default function LecturerProfileInsights() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [activeView, setActiveView] = useState<'external' | 'internal'>('external');
  const [publicationSubTab, setPublicationSubTab] = useState<'scopus' | 'scholar' | 'cross_indexed' | 'metriks'>('scopus');
  const [categoryFilter, setCategoryFilter] = useState<string>('penelitian');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchProfileAndDocs = () => {
    if (id) {
      setLoading(true);
      Promise.all([
        fetch(`/api/users/${id}`).then(res => res.json()),
        fetch(`/api/users/${id}/documents`).then(res => res.json())
      ])
        .then(([profileRes, docsRes]) => {
          setProfile(profileRes);
          setDocuments(docsRes.documents || []);
        })
        .catch(err => {
          console.error('Failed to fetch profile data', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchProfileAndDocs();
  }, [id]);

  const stats = useMemo(() => {
    if (!profile || !profile.user) return null;
    const user = profile.user;

    // Calculate API points from publications
    const { publications = [], scopusPublications = [] } = profile;
    const normalizeT = (t: string) => (t || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const crossTitles = new Set(
      (publications || []).filter((sd: any) => (scopusPublications || []).some((s: any) => normalizeT(s.title) === normalizeT(sd.title)))
        .map((d: any) => normalizeT(d.title))
    );

    const calculateScopusSintaPoints = (pub: any) => {
      if (pub.awarded_points !== undefined && pub.awarded_points !== null) {
        return Number(pub.awarded_points);
      }

      const role = pub.author_role === 'Member Author' || pub.author_role === 'Co-Author'
        ? 'Member Author'
        : (pub.author_role || 'Member Author');
      const totalAuthors = Number(pub.total_authors) || 1;
      const authorOrder = Number(pub.author_order) || (role === 'First Author' || role === 'Single Author' ? 1 : 2);
      const isCorresponding = !!pub.is_corresponding;
      const isHyper = !!pub.is_hyperauthor || totalAuthors > 16;
      const q = ['Q1', 'Q2', 'Q3', 'Q4'].includes(pub.quartile) ? pub.quartile : 'None';
      const isArticle = !pub.subtype || pub.subtype.toLowerCase() === 'ar' || pub.subtype.toLowerCase() === 'article';

      let awardedPoints = 0;

      if (isArticle) {
        if (isHyper) {
          if (role === 'Single Author') {
            awardedPoints = 40;
          } else if (role === 'First Author') {
            awardedPoints = 24;
          } else {
            awardedPoints = 1; // Hyperauthor Member = 1 pt flat
          }
        } else {
          // Base SKS points
          const basePointsMap: Record<string, number> = { Q1: 40, Q2: 38, Q3: 35, Q4: 33, None: 33 };
          const basePoints = basePointsMap[q] ?? 33;

          if (totalAuthors === 1 || (authorOrder === 1 && totalAuthors === 1)) {
            awardedPoints = basePoints;
          } else if (totalAuthors === 2) {
            if (authorOrder === 1) {
              awardedPoints = isCorresponding ? (0.6 * basePoints) : (0.5 * basePoints);
            } else {
              awardedPoints = isCorresponding ? (0.5 * basePoints) : (0.4 * basePoints);
            }
          } else {
            // > 2 Authors
            if (authorOrder === 1) {
              awardedPoints = isCorresponding ? (0.6 * basePoints) : (0.4 * basePoints);
            } else {
              // Member Author (2nd, 3rd, etc.)
              if (isCorresponding) {
                awardedPoints = 0.4 * basePoints;
              } else {
                // Default is Scenario 1: First Author is corresponding, so members get 40% / (n - 1)
                awardedPoints = (0.4 * basePoints) / (totalAuthors - 1);
              }
            }
          }
        }
      } else {
        // Non-Article
        if (role === 'Single Author') {
          awardedPoints = 30;
        } else if (role === 'First Author') {
          awardedPoints = 18;
        } else {
          const memberCount = Math.max(1, totalAuthors - 1);
          awardedPoints = 12 / memberCount;
        }
      }

      return Math.round(awardedPoints);
    };

    const extCross = (scopusPublications || []).filter((s: any) => crossTitles.has(normalizeT(s.title))).reduce((a: number, d: any) => a + calculateScopusSintaPoints(d), 0);
    const extScopus = (scopusPublications || []).filter((s: any) => !crossTitles.has(normalizeT(s.title))).reduce((a: number, d: any) => a + calculateScopusSintaPoints(d), 0);
    const extScholar = (publications || []).filter((s: any) => !crossTitles.has(normalizeT(s.title))).reduce((a: number, d: any) => a + calculateScholarPoints(d), 0);
    const apiTotal = Math.round(extCross + extScopus + extScholar);

    // Calculate Internal points from approved documents with file_url
    const internalTotal = Math.round(
      documents
        .filter(d => d.status === 'Approved' && d.file_url && d.file_url !== '')
        .reduce((acc, d) => acc + (Number(d.awarded_points) || 0), 0)
    );

    return [
      { 
        label: 'Total KPI', 
        val: (apiTotal + internalTotal).toLocaleString(), 
        icon: Award, 
        color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' 
      },
      { 
        label: 'Poin (External)',
        val: apiTotal.toLocaleString(),
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
  }, [profile, documents]);

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

  const internalDocumentsOnly = useMemo(() => {
    return (documents || []).filter((d: any) => d.status === 'Approved' && d.file_url && d.file_url !== '');
  }, [documents]);

  const filteredDocs = useMemo(() => {
    if (categoryFilter === 'all') return internalDocumentsOnly;
    return internalDocumentsOnly.filter((d: any) => d.category?.toLowerCase() === categoryFilter.toLowerCase());
  }, [internalDocumentsOnly, categoryFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 font-mono">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-6 animate-pulse">
          {/* Back button skeleton */}
          <div className="h-5 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg mb-10"></div>

          {/* Profile Card Shell */}
          <div className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            {/* Cover Banner */}
            <div className="h-28 sm:h-32 w-full bg-slate-105 dark:bg-slate-950 border-b border-slate-200/40 dark:border-slate-850"></div>
            
            <div className="px-6 pb-6 pt-0 sm:px-8 sm:pb-8">
              {/* Profile details row */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-8 relative z-10 mb-6">
                <div className="h-24 w-24 rounded-3xl bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-900"></div>
                <div className="space-y-2 pb-1 flex-1 text-center sm:text-left">
                  <div className="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded-md mx-auto sm:mx-0"></div>
                  <div className="h-6 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg mx-auto sm:mx-0"></div>
                  <div className="h-3.5 w-64 bg-slate-200 dark:bg-slate-800 rounded-md mx-auto sm:mx-0"></div>
                </div>
              </div>

              <div className="h-px w-full bg-slate-100 dark:bg-slate-800 mb-6" />

              {/* Stats Row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 w-full">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex min-h-[92px] items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 dark:border-slate-800 dark:bg-slate-950/50">
                    <div className="h-11 w-11 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
                      <div className="h-6 w-12 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Switcher Tab & Content Area */}
          <div className="h-14 w-96 bg-slate-200 dark:bg-slate-800 rounded-3xl mt-8"></div>
          <div className="h-96 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 mt-6"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!profile || !profile.user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center font-mono">
        <Navbar />
        <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">Dosen Tidak Ditemukan</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-primary-600 font-bold hover:underline">Kembali</button>
      </div>
    );
  }

  const { user, scholarData, scopusData } = profile;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-500 font-mono">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-8">

        {/* Navigation Breadcrumb */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Kembali ke Direktori</span>
        </motion.button>

        {/* Profile Hero Header & KPI Stats (Consistent with Admin Profile) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 relative z-10"
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
                      alt={user?.name || 'Lecturer'} 
                      className="h-full w-full rounded-2xl object-cover"
                    />
                  ) : user?.thumbnail ? (
                    <img 
                      src={user.thumbnail} 
                      alt={user?.name || 'Lecturer'} 
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
                <h2 className="text-2xl font-black leading-tight tracking-tight text-slate-955 dark:text-white min-h-[32px] flex items-center justify-center sm:justify-start">
                  {user?.name || 'User'}
                </h2>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <span className="capitalize">{user?.role || 'Lecturer'}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 hidden sm:inline" />
                  {user?.fakultas && (
                    <>
                      <span>{user.fakultas}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 hidden sm:inline" />
                    </>
                  )}
                  <span>{user?.program_studi || 'Lecturer'}</span>
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

            {/* Elegant Divider */}
            <div className="h-px w-full bg-slate-100 dark:bg-slate-800 mb-6" />

            {/* KPI Stats Row (Unified Inside Header Card) */}
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
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">{stat.label}</span>
                    <span className="mt-1.5 block text-2xl font-black leading-none tracking-tight text-slate-955 dark:text-white tabular-nums">
                      {stat.val}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      {/* View Switcher Tabs (Consistent with Admin) */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mt-8">
        <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 shadow-inner overflow-x-auto no-scrollbar max-w-full">
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
                  : 'text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <view.icon className={`w-4 h-4 ${activeView === view.id ? 'text-primary-600' : 'text-slate-400'}`} />
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="mt-6">
        {activeView === 'external' ? (
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
            loading={loading}
            isPublic={true}
          />
        ) : (
          <InternalDocumentsView 
            filteredDocs={filteredDocs}
            allInternalDocs={internalDocumentsOnly}
            loading={loading}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            isPublic={true}
          />
        )}
      </div>

      {/* Minimalist Login CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-10 p-1 bg-gradient-to-r from-slate-200 via-primary-500/20 to-slate-200 dark:from-slate-800 dark:via-primary-500/20 dark:to-slate-800 rounded-[2.5rem]"
      >
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-[2.4rem] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center border border-primary-500/20 shadow-inner">
              <Lock className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-1.5">Akses Profil Terbatas</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Masuk ke Portal Penta untuk melihat detail lengkap & analisis mendalam</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="group flex items-center gap-3 px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary-600 dark:hover:bg-primary-500 dark:hover:text-white transition-all shadow-2xl hover:scale-105 active:scale-95"
          >
            <span>Login ke Portal</span>
            <div className="w-6 h-6 rounded-full bg-white/20 dark:bg-slate-900/10 flex items-center justify-center group-hover:bg-white/40">
              <Zap className="w-3 h-3 rotate-12" />
            </div>
          </button>
        </div>
      </motion.div>


      </main>

      <Footer />
    </div>
  );
}
