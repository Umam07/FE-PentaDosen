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
    <footer id="contact" className="bg-[#0B0F19] text-gray-400 pt-20 pb-2 relative overflow-hidden border-t border-gray-900">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-primary-500/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-96 h-96 bg-indigo-500/5 rounded-full filter blur-[120px] pointer-events-none" />
      
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-6">
          
          {/* Logo & About */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="p-2.5 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl shadow-xl shadow-primary-500/10 group-hover:scale-105 transition-all duration-300">
                <Hexagon className="w-6 h-6 text-white fill-white/10 group-hover:rotate-12 transition-transform duration-500" />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter uppercase">
                Penta<span className="text-primary-400 bg-clip-text bg-gradient-to-r from-primary-400 to-primary-300">Dosen</span>
              </span>
            </Link>
            <p className="text-sm font-medium text-gray-400 leading-relaxed max-w-sm">
              Sistem terintegrasi untuk pendataan publikasi, sitasi, serta administrasi dokumen dosen secara aman, modern, dan dinamis.
            </p>
            <div className="pt-4 text-xs font-bold text-gray-500 leading-relaxed">
              <p>© {new Date().getFullYear()} PentaDosen.</p>
              <p className="mt-0.5">Developed by <span className="text-gray-400 hover:text-primary-400 transition-colors">DUK Team</span></p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="text-xs font-black text-white uppercase tracking-widest border-l-2 border-primary-500 pl-3">Navigasi</h3>
            <ul className="space-y-3.5">
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
                    className="text-sm font-semibold text-gray-400 hover:text-white flex items-center gap-2 group transition-all duration-300"
                  >
                    <ArrowRight className="w-3.5 h-3.5 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 text-primary-400 transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                  </a>
                </li>
              ))}
              
              {/* Privacy Policy Trigger */}
              <li>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="text-sm font-semibold text-gray-400 hover:text-white flex items-center gap-2 group transition-all duration-300 cursor-pointer text-left w-full">
                      <ArrowRight className="w-3.5 h-3.5 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 text-primary-400 transition-all duration-300" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">Privacy Policy</span>
                    </button>
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
              </li>

              {/* Terms of Service Trigger */}
              <li>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="text-sm font-semibold text-gray-400 hover:text-white flex items-center gap-2 group transition-all duration-300 cursor-pointer text-left w-full">
                      <ArrowRight className="w-3.5 h-3.5 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 text-primary-400 transition-all duration-300" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">Terms of Service</span>
                    </button>
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
              </li>
            </ul>
          </div>

          {/* Contact Support */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-xs font-black text-white uppercase tracking-widest border-l-2 border-primary-500 pl-3">Hubungi Kami</h3>
            <div className="space-y-4">
              
              {/* Address Card */}
              <div className="flex items-start gap-4 p-4 rounded-2xl border border-gray-900 bg-gray-950/20 hover:border-gray-800 hover:bg-gray-950/40 transition-all duration-300 group/contact">
                <div className="p-2.5 border border-gray-850 rounded-xl text-primary-400 bg-gray-900/50 flex-shrink-0 group-hover/contact:border-primary-500/30 group-hover/contact:bg-primary-500/10 group-hover/contact:text-primary-300 transition-all duration-300">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-white uppercase tracking-wider">Alamat Kantor</p>
                  <p className="text-sm font-semibold text-gray-400 mt-1.5 leading-relaxed">
                    Jl. Letjen Suprapto No.26, Cempaka Putih, Kec. Cemp. Putih, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10510.
                  </p>
                </div>
              </div>

              {/* Email & Phone grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Email Card */}
                <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-900 bg-gray-950/20 hover:border-gray-800 hover:bg-gray-950/40 transition-all duration-300 group/contact">
                  <div className="p-2.5 border border-gray-850 rounded-xl text-primary-400 bg-gray-900/50 flex-shrink-0 group-hover/contact:border-primary-500/30 group-hover/contact:bg-primary-500/10 group-hover/contact:text-primary-300 transition-all duration-300">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-white uppercase tracking-wider">Email</p>
                    <p className="text-sm font-bold text-gray-400 mt-1 break-all">teamduk.ta@gmail.com</p>
                  </div>
                </div>

                {/* Phone Card */}
                <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-900 bg-gray-950/20 hover:border-gray-800 hover:bg-gray-950/40 transition-all duration-300 group/contact">
                  <div className="p-2.5 border border-gray-850 rounded-xl text-primary-400 bg-gray-900/50 flex-shrink-0 group-hover/contact:border-primary-500/30 group-hover/contact:bg-primary-500/10 group-hover/contact:text-primary-300 transition-all duration-300">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-white uppercase tracking-wider">Telepon</p>
                    <p className="text-sm font-bold text-gray-400 mt-1">+62(21)4206675</p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* Divider Line */}
        <div className="border-t border-gray-800/60 mt-8 mb-0" />

        {/* Watermark Section */}
        <div className="flex justify-center items-center overflow-hidden pt-0 select-none pointer-events-none z-0">
          <span className="text-[14vw] font-extrabold text-white/[0.05] uppercase block leading-none select-none">
            DUK TEAM
          </span>
        </div>
      </div>
    </footer>
  );
}
