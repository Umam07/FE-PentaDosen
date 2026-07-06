import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../../../components/Home/Navbar';
import Footer from '../../../components/Home/Footer';
import ExternalDocumentsView from '../../dosen/dashboard/components/ExternalDocumentsView';
import InternalDocumentsView from '../../dosen/dashboard/components/InternalDocumentsView';
import { useLecturerProfile } from './hooks/useLecturerProfile';
import ProfileHeroHeader from './components/ProfileHeroHeader';
import ViewSwitcher from './components/ViewSwitcher';
import LoginCta from './components/LoginCta';
import ProfileInsightsSkeleton from './components/ProfileInsightsSkeleton';
import ProfileNotFound from './components/ProfileNotFound';

const tabVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.2, ease: "easeIn" } }
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

  const { user } = profile;

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

        {/* Profile Hero Header & KPI Stats */}
        <ProfileHeroHeader user={user} stats={stats} />

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
