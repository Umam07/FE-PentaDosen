import React from 'react';
import { Info, Sparkles, FileText, Globe, RefreshCw } from 'lucide-react';

import useLecturerDashboard from './useLecturerDashboard';
import PerformanceSummary from './components/PerformanceSummary';
import InternalDocumentsView from './components/InternalDocumentsView';
import ExternalDocumentsView from './components/ExternalDocumentsView';

export default function LecturerDashboard({ user }: { user: any }) {
  const {
    loading,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    categoryFilter,
    setCategoryFilter,
    activeView,
    setActiveView,
    publicationSubTab,
    setPublicationSubTab,
    profileData,
    fetchData,
    internalDocumentsOnly,
    approvedDocs,
    apiPoints,
    internalPoints,
    grandTotal,
    filteredDocs,
    stats,
    scholarChartData,
    scopusChartData
  } = useLecturerDashboard(user);

  const tabVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2, ease: "easeIn" } }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 pb-20">

      {/* Information Notice — minimalist inline */}
      <div className="flex items-start gap-2.5 px-4 py-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-2xl">
        <Info className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
        <p className="text-[11px] font-medium text-indigo-700 dark:text-indigo-300 leading-relaxed">
          <span className="font-bold">Informasi:</span> Poin berasal dari dokumen yang telah diverifikasi (<em>Approved</em>) oleh Admin. Bobot poin setiap kategori mengacu pada pedoman SINTA.
        </p>
      </div>

      {/* View Switcher Tabs & KPI Toggle */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-[2rem] border border-slate-200/60 dark:border-slate-700 shadow-inner overflow-x-auto no-scrollbar max-w-full">
          {[
            { id: 'all', label: 'Ringkasan Performa', icon: Sparkles },
            { id: 'internal', label: 'Dokumen Internal', icon: FileText },
            { id: 'external', label: 'Dokumen Eksternal (API)', icon: Globe },
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

        {/* Refresh Button */}
        <div className="flex items-center gap-4 px-6 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-6 py-3.5 bg-white dark:bg-slate-900 text-slate-500 hover:text-primary-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200/60 dark:border-slate-700 shadow-sm transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh Dokumen'}
          </button>
        </div>
      </div>

      {activeView === 'all' && (
        <PerformanceSummary 
          stats={stats}
          grandTotal={grandTotal}
          internalPoints={internalPoints}
          apiPointsTotal={apiPoints.total}
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

      {activeView === 'external' && (
        <div className="space-y-8">
          <ExternalDocumentsView 
            publicationSubTab={publicationSubTab}
            setPublicationSubTab={setPublicationSubTab}
            scopusChartData={scopusChartData}
            scholarChartData={scholarChartData}
            scopusData={profileData?.scopusData}
            scholarData={profileData?.scholarData}
            publications={profileData?.publications || []}
            scopusPublications={profileData?.scopusPublications || []}
            tabVariants={tabVariants}
            onRefresh={fetchData}
          />
        </div>
      )}
    </div>
  );
}
