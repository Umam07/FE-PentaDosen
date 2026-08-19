import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Home/Navbar';
import Footer from '../../../components/Home/Footer';
import SEO from '../../../components/SEO';
import { useInsights } from './hooks/useInsights';
import InsightsHero from './components/InsightsHero';
import InsightsStatsHighlights from './components/InsightsStatsHighlights';
import InsightsMetricsRow from './components/InsightsMetricsRow';
import ResearchDistributionCard from './components/ResearchDistributionCard';
import FakultasPieChart from './components/FakultasPieChart';
import InsightsLeaderboard from './components/InsightsLeaderboard';

export default function Insights() {
  const navigate = useNavigate();
  const {
    leaderboard,
    stats,
    periodKpiValues,
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
    setActiveIndex,
    chartViewMode,
    setChartViewMode,
  } = useInsights();

  return (
    <div className="min-h-screen bg-canvas-light dark:bg-canvas-dark transition-colors duration-300 font-sans antialiased text-body dark:text-on-dark">
      <SEO
        title="Insights & Analitik Kinerja — PentaDosen (Penta Dosen) Universitas YARSI"
        description="Visualisasi data analitik, skor KPI, sebaran publikasi, dan leaderboard riset dosen PentaDosen (Penta Dosen) Universitas YARSI."
        keywords="Insights PentaDosen, Penta Dosen, Analitik Dosen YARSI, Leaderboard Dosen, KPI Dosen YARSI, Universitas YARSI"
        canonical="https://www.pentadosen.site/insights"
      />
      <Navbar />

      <main className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-10">

        {/* Premium Hero Section */}
        <InsightsHero
          stats={stats}
          loading={loading}
          onExploreClick={() => {
            const chartElem = document.getElementById('fakultas-analytics');
            if (chartElem) {
              chartElem.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />

        {/* KPI Period Highlights */}
        <InsightsStatsHighlights stats={stats} loading={loading} periodKpiValues={periodKpiValues} />

        {/* Institutional Capacity & Academic Productivity Metrics */}
        <InsightsMetricsRow
          stats={stats}
          loading={loading}
          onLecturersClick={() => navigate('/lecturers')}
          onDepartmentsClick={() => navigate('/departments')}
        />

        {/* Publication & Research Source Channel Distribution */}
        <ResearchDistributionCard stats={stats} loading={loading} />

        {/* Analytics visualisations and Leaderboard ranking */}
        <div id="fakultas-analytics" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
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
            chartViewMode={chartViewMode}
            setChartViewMode={setChartViewMode}
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
