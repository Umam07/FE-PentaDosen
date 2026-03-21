import Navbar from '../components/Home/Navbar';
import Hero from '../components/Home/Hero';
import Features from '../components/Home/Features';
import Workflow from '../components/Home/Workflow';
import AboutUs from '../components/Home/AboutUs';
import Footer from '../components/Home/Footer';

export default function Home() {
  return (
    <div className="font-sans antialiased bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100">
      <Navbar />
      <Hero />
      <Features />
      <Workflow />
      <AboutUs />
      <Footer />
    </div>
  );
}
