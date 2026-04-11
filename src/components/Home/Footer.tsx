import { MouseEvent } from 'react';
import { MapPin, Mail, Phone, Hexagon, ArrowRight, Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const handleScrollTo = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <footer id="contact" className="bg-[#0B0F19] text-gray-400 pt-20 pb-10 relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary-500/10 rounded-full filter blur-3xl" />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-gray-800">
          
          {/* Logo & About */}
          <div className="md:col-span-4 space-y-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl shadow-lg shadow-primary-500/20">
                <Hexagon className="w-6 h-6 text-white fill-white/10" />
              </div>
              <h1 className="text-xl font-black text-white tracking-tighter uppercase">
                Penta<span className="text-primary-400">Dosen</span>
              </h1>
            </Link>
            <p className="text-sm font-bold text-gray-400 leading-relaxed max-w-sm">
              Sistem terintegrasi untuk pendataan publikasi, sitasi, serta administrasi dokumen dosen secara aman dan dinamis.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 border border-gray-800 rounded-xl hover:bg-gray-800 hover:text-white transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 border border-gray-800 rounded-xl hover:bg-gray-800 hover:text-white transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 border border-gray-800 rounded-xl hover:bg-gray-800 hover:text-white transition-all">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-sm font-black text-white uppercase tracking-widest">Navigasi</h4>
            <ul className="space-y-3">
              {[
                { name: 'Beranda', href: '#hero' },
                { name: 'Fitur', href: '#features' },
                { name: 'Sistem Kerja', href: '#workflow' },
                { name: 'Tentang Kami', href: '#about' },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleScrollTo(e, link.href)}
                    className="text-sm font-bold text-gray-500 hover:text-primary-400 flex items-center gap-1 group transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Support */}
          <div className="md:col-span-5 space-y-4">
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4">Kontak Kami</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 border border-gray-800 rounded-xl text-primary-400 bg-gray-900 flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-wider">Alamat Kantor</p>
                  <p className="text-sm font-bold text-gray-500 mt-1 leading-relaxed">
                    Jl. Letjen Suprapto No.26, Cempaka Putih, Kec. Cemp. Putih, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10510.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-2 border border-gray-800 rounded-xl text-primary-400 bg-gray-900 flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-wider">Email</p>
                  <p className="text-sm font-bold text-gray-500 mt-1">teamduk.ta@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-2 border border-gray-800 rounded-xl text-primary-400 bg-gray-900 flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-wider">Telepon</p>
                  <p className="text-sm font-bold text-gray-500 mt-1">+62 (21) 1234-5678</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 text-xs font-bold text-gray-600">
          <p>© {new Date().getFullYear()} PentaDosen Team. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
