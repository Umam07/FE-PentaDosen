import Navbar from '../components/Home/Navbar';
import Hero from '../components/Home/Hero';
import Features from '../components/Home/Features';
import Workflow from '../components/Home/Workflow';
import Footer from '../components/Home/Footer';
import SEO from '../components/SEO';

export default function Home() {
  return (
    <div className="font-sans antialiased bg-canvas-light dark:bg-canvas-dark text-body dark:text-on-dark min-h-screen selection:bg-accent/20 selection:text-accent dark:selection:bg-accent/30 dark:selection:text-accent-on-dark">
      <SEO
        title="PentaDosen (Penta Dosen) — Platform Penelitian & Portofolio Dosen Universitas YARSI"
        description="PentaDosen (Penta Dosen) adalah platform penelitian dosen dan sistem manajemen portofolio Tri Dharma Universitas YARSI. Sinkronisasi data publikasi Google Scholar & Scopus, penelitian, pengabdian, HKI, dan evaluasi kinerja akademik dosen."
        keywords="PentaDosen, Penta Dosen, pentadosen, penta dosen, pentadosen yarsi, penta dosen yarsi, penelitian dosen, penelitian dosen yarsi, portofolio dosen yarsi, publikasi dosen yarsi, Universitas YARSI, Dosen YARSI, Tri Dharma Dosen, Google Scholar, Scopus, HKI, LPPM YARSI, DUK Team, pentadosen site, pentadosen.site"
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

