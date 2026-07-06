import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Home/Navbar';
import Footer from '../../../components/Home/Footer';
import { useInsights } from './hooks/useInsights';
import InsightsHero from './components/InsightsHero';
import InsightsStatsHighlights from './components/InsightsStatsHighlights';
import InsightsMetricsRow from './components/InsightsMetricsRow';
import FakultasPieChart from './components/FakultasPieChart';
import InsightsLeaderboard from './components/InsightsLeaderboard';

export default function Insights() {
  const navigate = useNavigate();
  const {
    leaderboard,
    stats,
    loading,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    showFilterDropdown,
    setShowFilterDropdown,
    totalFakultasPoints,
    sortedAndFilteredData,
    activeDataIndex,
    setActiveIndex
  } = useInsights();

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-all duration-500 font-sans">
      <Navbar />
      
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 space-y-16">
        
        {/* Premium Hero Section */}
        <InsightsHero stats={stats} loading={loading} />

        {/* Statistics highlights and metrics intelligence */}
        <div className="space-y-10">
          <InsightsStatsHighlights stats={stats} loading={loading} />
          
          <InsightsMetricsRow 
            stats={stats} 
            loading={loading}
            onLecturersClick={() => navigate('/lecturers')}
            onDepartmentsClick={() => navigate('/departments')}
          />
        </div>

        {/* Analytics visualisations and Leaderboard ranking */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <FakultasPieChart 
            loading={loading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            showFilterDropdown={showFilterDropdown}
            setShowFilterDropdown={setShowFilterDropdown}
            sortedAndFilteredData={sortedAndFilteredData}
            activeDataIndex={activeDataIndex}
            setActiveIndex={setActiveIndex}
            totalFakultasPoints={totalFakultasPoints}
            onFakultasClick={(fullName) => {
              navigate(`/departments?search=${encodeURIComponent(fullName)}`);
            }}
          />

          <InsightsLeaderboard 
            leaderboard={leaderboard}
            loading={loading}
            onUserClick={(userId) => navigate(`/lecturer/${userId}`)}
            onViewAllClick={() => navigate('/lecturers')}
          />
        </div>

      </main>

      <Footer />
    </div>
  );
}
