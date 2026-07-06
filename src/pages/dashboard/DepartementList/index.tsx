import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Home/Navbar';
import Footer from '../../../components/Home/Footer';
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
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-all duration-500 font-sans">
      <Navbar />
      
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {/* Header Section */}
        <DepartementHeader 
          search={search}
          onSearchChange={setSearch}
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
