import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../../../components/Home/Navbar';
import Footer from '../../../components/Home/Footer';
import SEO from '../../../components/SEO';
import ExternalDocumentsView from '../../dosen/dashboard/components/ExternalDocumentsView';
import InternalDocumentsView from '../../dosen/dashboard/components/InternalDocumentsView';
import { useLecturerProfile } from './hooks/useLecturerProfile';
import ProfileHeroHeader from './components/ProfileHeroHeader';
import ViewSwitcher from './components/ViewSwitcher';
import LoginCta from './components/LoginCta';
import ProfileInsightsSkeleton from './components/ProfileInsightsSkeleton';
import ProfileNotFound from './components/ProfileNotFound';

const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15, ease: "easeIn" } }
};

export default function LecturerProfileInsights() {
  const {
    navigate,
    loading,
    profile,
    activeView,
    setActiveView,
    publicationSubTab,
    setPublicationSubTab,
    categoryFilter,
    setCategoryFilter,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    stats,
    scholarChartData,
    scopusChartData,
    internalDocumentsOnly,
    filteredDocs,
    fetchProfileAndDocs
  } = useLecturerProfile();

  if (loading) {
    return <ProfileInsightsSkeleton />;
  }

  if (!profile || !profile.user) {
    return <ProfileNotFound onBack={() => navigate(-1)} />;
  }

  return (
    <div className="min-h-screen bg-canvas-light dark:bg-canvas-dark transition-colors duration-500 font-sans">
      <SEO
        title={`Profil ${profile.user.name} — Insight Portofolio Dosen Universitas YARSI`}
        description={`Profil akademik, publikasi Google Scholar & Scopus, penelitian, dan HKI ${profile.user.name} di PentaDosen (Penta Dosen) Universitas YARSI.`}
        keywords={`Profil ${profile.user.name}, Dosen YARSI, PentaDosen, Penta Dosen, Publikasi Dosen, Portofolio Dosen`}
        canonical={`https://www.pentadosen.site/insights/lecturer/${profile.user.penta_id || ''}`}
      />

      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-ink focus:text-on-ink dark:focus:bg-on-dark dark:focus:text-ink focus:rounded-lg focus:shadow-lg"
      >
        Lewati ke Konten Utama
      </a>

      <Navbar />

      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-6">

        {/* Navigation Back Button */}
        <div>
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Kembali ke Direktori</span>
          </button>
        </div>

        {/* Profile Hero Header & KPI Stats */}
        <ProfileHeroHeader profile={profile} stats={stats} loading={loading} />

        {/* View Switcher Tabs */}
        <ViewSwitcher 
          activeView={activeView} 
          onViewChange={(view) => {
            setActiveView(view);
            setCurrentPage(1);
          }} 
        />

        {/* Main Tab Content */}
        <div className="mt-6">
          {activeView === 'external' ? (
            <ExternalDocumentsView 
              publicationSubTab={publicationSubTab}
              setPublicationSubTab={setPublicationSubTab}
              scopusChartData={scopusChartData}
              scholarChartData={scholarChartData}
              scopusData={profile.scopusData}
              scholarData={profile.scholarData}
              publications={profile.publications || []}
              scopusPublications={profile.scopusPublications || []}
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
              setItemsPerPage={setItemsPerPage}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              isPublic={true}
            />
          )}
        </div>

        {/* Minimalist Login CTA */}
        <LoginCta onLogin={() => navigate('/login')} />

      </main>

      <Footer />
    </div>
  );
}
