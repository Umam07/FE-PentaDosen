import Navbar from '../components/Home/Navbar';
import Hero from '../components/Home/Hero';
import Features from '../components/Home/Features';
import Workflow from '../components/Home/Workflow';
import Footer from '../components/Home/Footer';
import SEO from '../components/SEO';

export default function Home() {
  return (
    <div className="font-sans antialiased bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100">
      <SEO
        title="PentaDosen 2.0 - Platform Portofolio & Tri Dharma Dosen Universitas YARSI"
        description="PentaDosen 2.0 adalah platform sistem informasi manajemen portofolio dan Tri Dharma Dosen Universitas YARSI. Otomatisasi sinkronisasi data publikasi Google Scholar & Scopus, penelitian, pengabdian, HKI, dan evaluasi kinerja akademik dosen."
        keywords="PentaDosen, Penta Dosen, Universitas YARSI, Dosen YARSI, Tri Dharma Dosen, Google Scholar, Scopus, Portofolio Dosen, Publikasi Dosen, Penelitian Dosen, HKI"
        canonical="https://www.pentadosen.site/"
      />
      <Navbar />
      <Hero />
      <Features />
      <Workflow />
      <Footer />
    </div>
  );
}

