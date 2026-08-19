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
    <div className="min-h-screen bg-canvas-light dark:bg-canvas-dark transition-all duration-500 font-sans">
      <SEO
        title="Fakultas & Program Studi — PentaDosen (Penta Dosen) Universitas YARSI"
        description="Daftar fakultas, program studi, dan kontribusi penelitian akademik di lingkungan Universitas YARSI melalui PentaDosen (Penta Dosen)."
        keywords="Fakultas YARSI, Program Studi YARSI, PentaDosen, Penta Dosen, Universitas YARSI"
        canonical="https://www.pentadosen.site/departments"
      />
      <Navbar />
      
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {/* Header Section */}
        <DepartementHeader 
          search={search}
          onSearchChange={setSearch}
          totalFiltered={filteredDepartments.length}
          onBack={() => navigate('/insights')}
        />

        {loading ? (
          <DepartementSkeleton />
        ) : (
          <>
            {/* Departments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDepartments.map((dept, i) => (
                <DepartementCard 
                  key={dept.id}
                  dept={dept}
                  index={i}
                  onClick={() => { navigate(`/lecturers?fakultas=${dept.name}`); }}
                />
              ))}
            </div>

            {filteredDepartments.length === 0 && (
              <DepartementEmpty />
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
