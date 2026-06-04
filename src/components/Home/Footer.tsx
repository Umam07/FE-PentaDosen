import { MouseEvent } from 'react';
import { MapPin, Mail, Phone, Hexagon, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-sm font-black text-white uppercase tracking-widest">Navigasi</h4>
            <ul className="space-y-3">
              {[
                { name: 'Beranda', href: '#hero' },
                { name: 'Leaderboard', href: '#leaderboard' },
                { name: 'Fitur', href: '#features' },
                { name: 'Sistem Kerja', href: '#workflow' },
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
            {/* Privacy Policy Modal */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="hover:text-gray-400 transition-colors uppercase tracking-widest text-[10px]">Privacy Policy</button>
              </DialogTrigger>
              <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:top-3.5 bg-[#0B0F19] border-gray-800 text-gray-300">
                <DialogHeader className="contents space-y-0 text-left">
                  <DialogTitle className="border-b border-gray-800 px-6 py-4 text-base font-black text-white uppercase tracking-tighter">
                    Privacy Policy
                  </DialogTitle>
                  <div className="overflow-y-auto">
                    <DialogDescription asChild>
                      <div className="px-6 py-6 text-sm leading-relaxed space-y-6">
                        <div className="space-y-2">
                          <h4 className="font-black text-white uppercase text-xs tracking-widest">1. Pengumpulan Data</h4>
                          <p>Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami saat mendaftar, termasuk nama, email, dan data publikasi ilmiah Anda.</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-black text-white uppercase text-xs tracking-widest">2. Penggunaan Informasi</h4>
                          <p>Informasi yang dikumpulkan digunakan untuk mengelola akun Anda, memvalidasi data publikasi melalui sistem TiDB, dan meningkatkan layanan kami.</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-black text-white uppercase text-xs tracking-widest">3. Keamanan Data</h4>
                          <p>Kami menerapkan standar keamanan enkripsi SSL 256-bit untuk melindungi dokumen dan data pribadi Anda dari akses tidak sah.</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-black text-white uppercase text-xs tracking-widest">4. Berbagi Data</h4>
                          <p>Kami tidak akan menjual data pribadi Anda kepada pihak ketiga. Data hanya dibagikan untuk kepentingan administrasi kampus sesuai regulasi yang berlaku.</p>
                        </div>
                      </div>
                    </DialogDescription>
                    <DialogFooter className="px-6 pb-6 sm:justify-end">
                      <DialogClose asChild>
                        <Button type="button" className="bg-primary-500 hover:bg-primary-600 text-white font-bold uppercase tracking-widest text-[10px] px-6">Mengerti</Button>
                      </DialogClose>
                    </DialogFooter>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            <span className="text-gray-800">•</span>

            {/* Terms of Service Modal */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="hover:text-gray-400 transition-colors uppercase tracking-widest text-[10px]">Terms of Service</button>
              </DialogTrigger>
              <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:top-3.5 bg-[#0B0F19] border-gray-800 text-gray-300">
                <DialogHeader className="contents space-y-0 text-left">
                  <DialogTitle className="border-b border-gray-800 px-6 py-4 text-base font-black text-white uppercase tracking-tighter">
                    Terms of Service
                  </DialogTitle>
                  <div className="overflow-y-auto">
                    <DialogDescription asChild>
                      <div className="px-6 py-6 text-sm leading-relaxed space-y-6">
                        <div className="space-y-2">
                          <h4 className="font-black text-white uppercase text-xs tracking-widest">1. Penerimaan Ketentuan</h4>
                          <p>Dengan menggunakan platform PentaDosen, Anda setuju untuk terikat oleh syarat dan ketentuan penggunaan yang berlaku.</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-black text-white uppercase text-xs tracking-widest">2. Akurasi Data</h4>
                          <p>Dosen bertanggung jawab atas kebenaran data publikasi dan dokumen yang diunggah ke dalam sistem.</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-black text-white uppercase text-xs tracking-widest">3. Batasan Tanggung Jawab</h4>
                          <p>Tim PentaDosen tidak bertanggung jawab atas kerugian yang timbul akibat kesalahan input data oleh pengguna atau penyalahgunaan akun.</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-black text-white uppercase text-xs tracking-widest">4. Perubahan Ketentuan</h4>
                          <p>Kami berhak memperbarui syarat dan ketentuan ini sewaktu-waktu. Perubahan akan diinformasikan melalui platform kami.</p>
                        </div>
                      </div>
                    </DialogDescription>
                    <DialogFooter className="px-6 pb-6 sm:justify-end">
                      <DialogClose asChild>
                        <Button type="button" className="bg-primary-500 hover:bg-primary-600 text-white font-bold uppercase tracking-widest text-[10px] px-6">Setuju</Button>
                      </DialogClose>
                    </DialogFooter>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </footer>
  );
}
