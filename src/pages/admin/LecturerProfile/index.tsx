import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLecturerProfile } from './hooks/useLecturerProfile';
import ProfileSkeleton from './components/ProfileSkeleton';
import ProfileNotFound from './components/ProfileNotFound';
import ProfileCard from './components/ProfileCard';
import ProfileViewSwitcher from './components/ProfileViewSwitcher';
import ExternalDocumentsView from '../../dosen/dashboard/components/ExternalDocumentsView';
import InternalDocumentsView from '../../dosen/dashboard/components/InternalDocumentsView';

const tabVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.2, ease: "easeIn" } }
};

export default function AdminLecturerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    profile,
    filteredDocs,
    internalDocumentsOnly,
    stats,
    scholarChartData,
    scopusChartData,
    loading,
    message,
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
    loadProfileAndDocs
  } = useLecturerProfile(id);

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!profile || !profile.user) {
    return <ProfileNotFound onBack={() => navigate('/admin/lecturers')} />;
  }

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
      <ProfileCard
        profile={profile}
        loading={loading}
        stats={stats}
        message={message}
      />

      {/* View Switcher Tabs */}
      <ProfileViewSwitcher
        activeView={activeView}
        onViewChange={(view) => { setActiveView(view); setCurrentPage(1); }}
      />

      {/* View Contents */}
      <div className="mt-6">
        {activeView === 'external' && (
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
            onRefresh={loadProfileAndDocs}
            loading={loading}
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
            setItemsPerPage={setItemsPerPage}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
          />
        )}
      </div>
    </div>
  );
}
