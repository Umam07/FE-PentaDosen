import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Home/Navbar';
import Footer from '../../../components/Home/Footer';
import SEO from '../../../components/SEO';
import { useDepartementList } from './hooks/useDepartementList';
import DepartementHeader from './components/DepartementHeader';
import DepartementCard from './components/DepartementCard';
import DepartementSkeleton from './components/DepartementSkeleton';
import DepartementEmpty from './components/DepartementEmpty';

export default function DepartementList() {
  const navigate = useNavigate();
  const {
    search,
    setSearch,
    filteredDepartments,
    loading
  } = useDepartementList();

  return (
    <div className="min-h-screen bg-canvas-light dark:bg-canvas-dark transition-colors duration-500 font-sans">
      <SEO
        title="Fakultas & Program Studi — PentaDosen (Penta Dosen) Universitas YARSI"
        description="Daftar fakultas, program studi, dan kontribusi penelitian akademik di lingkungan Universitas YARSI melalui PentaDosen (Penta Dosen)."
        keywords="Fakultas YARSI, Program Studi YARSI, PentaDosen, Penta Dosen, Universitas YARSI"
        canonical="https://www.pentadosen.site/departments"
      />

      {/* Accessible Skip to Content Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none"
      >
        Lewati ke Konten Utama
      </a>

      <Navbar />
      
      <main id="main-content" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 space-y-8">
        {/* Header Section */}
        <DepartementHeader 
          search={search}
          onSearchChange={setSearch}
          totalFiltered={filteredDepartments.length}
          onBack={() => navigate('/insights')}
        />

        {/* Accessible Section Heading to maintain WCAG 2.1 AA heading-order (h1 -> h2 -> h3) */}
        <h2 className="sr-only">Daftar Fakultas dan Program Studi Universitas YARSI</h2>

        {loading ? (
          <DepartementSkeleton />
        ) : (
          <>
            {/* Departments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredDepartments.map((dept, i) => (
                <DepartementCard 
                  key={dept.id}
                  dept={dept}
                  index={i}
                  onClick={() => { navigate(`/lecturers?fakultas=${encodeURIComponent(dept.name)}`); }}
                />
              ))}
            </div>

            {filteredDepartments.length === 0 && (
              <DepartementEmpty onReset={() => setSearch('')} />
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
