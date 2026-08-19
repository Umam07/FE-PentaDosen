import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Navbar from '../../../components/Home/Navbar';
import Footer from '../../../components/Home/Footer';
import SEO from '../../../components/SEO';
import { useLecturerList } from './hooks/useLecturerList';
import LecturerHeader from './components/LecturerHeader';
import LecturerFilterStrip from './components/LecturerFilterStrip';
import LecturerCard from './components/LecturerCard';
import LecturerSkeleton from './components/LecturerSkeleton';
import LecturerEmpty from './components/LecturerEmpty';

export default function LecturerList() {
  const navigate = useNavigate();
  const {
    searchTerm,
    setSearchTerm,
    selectedFakultas,
    setSelectedFakultas,
    loading,
    fakultasOptions,
    fakultasCounts,
    filteredLecturers
  } = useLecturerList();

  return (
    <div className="min-h-screen bg-canvas-light dark:bg-canvas-dark transition-colors duration-500 font-sans">
      <SEO
        title="Direktori Dosen & Portofolio Akademik — PentaDosen (Penta Dosen) Universitas YARSI"
        description="Direktori profil dosen, publikasi Google Scholar & Scopus, penelitian, dan HKI dosen Universitas YARSI di PentaDosen (Penta Dosen)."
        keywords="Direktori Dosen YARSI, Portofolio Dosen, Dosen Universitas YARSI, PentaDosen, Penta Dosen, Publikasi Dosen"
        canonical="https://www.pentadosen.site/lecturers"
      />
      <Navbar />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 space-y-8">
        
        {/* Header Section */}
        <LecturerHeader 
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          totalFiltered={filteredLecturers.length}
          onBack={() => navigate(-1)}
        />

        {/* Filter Strip */}
        <LecturerFilterStrip 
          fakultasOptions={fakultasOptions}
          selectedFakultas={selectedFakultas}
          onFakultasChange={setSelectedFakultas}
          fakultasCounts={fakultasCounts}
        />

        {/* Lecturer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="wait">
            {loading ? (
              <LecturerSkeleton />
            ) : filteredLecturers.length > 0 ? (
              filteredLecturers.map((lecturer, index) => (
                <LecturerCard 
                  key={lecturer.id}
                  lecturer={lecturer}
                  index={index}
                  onClick={() => navigate(`/lecturer/${lecturer.id}`)}
                />
              ))
            ) : (
              <LecturerEmpty />
            )}
          </AnimatePresence>
        </div>

      </main>

      <Footer />
    </div>
  );
}
