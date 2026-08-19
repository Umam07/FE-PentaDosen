import { MouseEvent } from 'react';
import { MapPin, Mail, Phone, ArrowRight, ShieldCheck, FileText, Database, Cpu, Lock, Share2, Users, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import PentaDosenLogo from '../ui/PentaDosenLogo';
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
    <footer id="contact" className="bg-footer-dark text-on-dark-soft pt-20 pb-2 relative overflow-hidden border-t border-hairline-dark">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,55,49,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,55,49,0.15)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-6">
          
          {/* Logo & About */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <img 
                src="/YARSI-KOTAK-e1739161183276.png" 
                alt="Universitas YARSI" 
                className="h-8 w-auto object-contain"
              />
              <div className="h-6 w-[1px] bg-hairline-dark" />
              <div className="flex items-center gap-2">
                <PentaDosenLogo className="w-9 h-9" />
                <span className="text-2xl sm:text-3xl font-black text-on-dark tracking-tighter uppercase">
                  Penta<span className="text-accent dark:text-accent-on-dark">Dosen</span>
                </span>
              </div>
            </Link>
            <p className="text-sm font-normal text-on-dark-soft leading-relaxed max-w-sm">
              Sistem terintegrasi untuk pendataan publikasi, sitasi, serta administrasi dokumen dosen secara aman, modern, dan dinamis.
            </p>
            <div className="pt-4 text-xs font-bold text-on-dark-muted leading-relaxed">
              <p>© {new Date().getFullYear()} PentaDosen.</p>
              <p className="mt-0.5">
                Developed by{' '}
                <Link
                  to="/developers"
                  className="text-on-dark hover:text-accent font-extrabold transition-all duration-300 hover:underline decoration-accent decoration-2 underline-offset-4"
                >
                  DUK Team
                </Link>
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="text-xs font-black text-on-dark uppercase tracking-widest border-l-2 border-accent pl-3">Navigasi</h3>
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
                    className="text-sm font-semibold text-on-dark-soft hover:text-on-dark flex items-center gap-2 group transition-all duration-300"
                  >
                    <ArrowRight className="w-3.5 h-3.5 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 text-accent dark:text-accent-on-dark transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                  </a>
                </li>
              ))}
              {/* Privacy Policy Trigger */}
              <li>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="text-sm font-semibold text-on-dark-soft hover:text-on-dark flex items-center gap-2 group transition-all duration-300 cursor-pointer text-left w-full">
                      <ArrowRight className="w-3.5 h-3.5 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 text-accent dark:text-accent-on-dark transition-all duration-300" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">Privacy Policy</span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,85vh)] sm:max-w-xl [&>button:last-child]:top-4.5 bg-surface-dark border border-hairline-dark rounded-2xl text-on-dark shadow-2xl overflow-hidden">
                    <DialogHeader className="contents space-y-0 text-left">
                      <div className="relative border-b border-hairline-dark px-6 py-5 bg-canvas-dark">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-[10px] font-bold text-accent-on-dark uppercase tracking-widest mb-2.5 w-fit">
                          Last Updated: July 2026
                        </div>
                        <DialogTitle className="flex items-center gap-3 text-lg font-black text-on-dark uppercase tracking-tight">
                          <div className="p-2 border border-hairline-dark rounded-lg text-accent-on-dark bg-surface-dark">
                            <ShieldCheck className="w-5 h-5" />
                          </div>
                          Privacy Policy
                        </DialogTitle>
                      </div>
                      <div className="overflow-y-auto max-h-[50vh] pr-1.5 scrollbar-thin">
                        <DialogDescription asChild>
                          <div className="px-6 py-6 text-sm leading-relaxed space-y-5">
                            {[
                              {
                                icon: Database,
                                title: "1. Pengumpulan Data",
                                text: "Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami saat mendaftar, termasuk nama, email, dan data publikasi ilmiah Anda.",
                                color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
                              },
                              {
                                icon: Cpu,
                                title: "2. Penggunaan Informasi",
                                text: "Informasi yang dikumpulkan digunakan untuk mengelola akun Anda, memvalidasi data publikasi melalui sistem TiDB, dan meningkatkan layanan kami.",
                                color: "text-blue-400 border-blue-500/20 bg-blue-500/5",
                              },
                              {
                                icon: Lock,
                                title: "3. Keamanan Data",
                                text: "Kami menerapkan standar keamanan enkripsi SSL 256-bit untuk melindungi dokumen dan data pribadi Anda dari akses tidak sah.",
                                color: "text-violet-400 border-violet-500/20 bg-violet-500/5",
                              },
                              {
                                icon: Share2,
                                title: "4. Berbagi Data",
                                text: "Kami tidak akan menjual data pribadi Anda kepada pihak ketiga. Data hanya dibagikan untuk kepentingan administrasi kampus sesuai regulasi yang berlaku.",
                                color: "text-amber-400 border-amber-500/20 bg-amber-500/5",
                              },
                            ].map((item, index) => (
                              <div key={index} className="flex items-start gap-4 p-4 rounded-xl border border-hairline-dark bg-canvas-dark hover:border-hairline-dark-soft transition-all duration-300 group/policy">
                                <div className={`p-2.5 border rounded-lg flex-shrink-0 transition-transform duration-300 group-hover/policy:scale-105 ${item.color}`}>
                                  <item.icon className="w-4 h-4" />
                                </div>
                                <div className="space-y-1">
                                  <h4 className="font-bold text-on-dark text-xs uppercase tracking-widest">{item.title}</h4>
                                  <p className="text-sm font-normal text-on-dark-soft leading-relaxed mt-1">{item.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </DialogDescription>
                      </div>
                      <div className="px-6 py-4 bg-canvas-dark border-t border-hairline-dark flex justify-end">
                        <DialogClose asChild>
                          <Button type="button" className="bg-surface-dark-elevated hover:bg-surface-dark text-on-dark border border-hairline-dark font-bold uppercase tracking-wider text-[11px] px-6 py-2 rounded-lg transition-all duration-300 cursor-pointer">Mengerti</Button>
                        </DialogClose>
                      </div>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </li>

              {/* Terms of Service Trigger */}
              <li>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="text-sm font-semibold text-on-dark-soft hover:text-on-dark flex items-center gap-2 group transition-all duration-300 cursor-pointer text-left w-full">
                      <ArrowRight className="w-3.5 h-3.5 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 text-accent dark:text-accent-on-dark transition-all duration-300" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">Terms of Service</span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,85vh)] sm:max-w-xl [&>button:last-child]:top-4.5 bg-surface-dark border border-hairline-dark rounded-2xl text-on-dark shadow-2xl overflow-hidden">
                    <DialogHeader className="contents space-y-0 text-left">
                      <div className="relative border-b border-hairline-dark px-6 py-5 bg-canvas-dark">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-[10px] font-bold text-accent-on-dark uppercase tracking-widest mb-2.5 w-fit">
                          Ketentuan Penggunaan
                        </div>
                        <DialogTitle className="flex items-center gap-3 text-lg font-black text-on-dark uppercase tracking-tight">
                          <div className="p-2 border border-hairline-dark rounded-lg text-accent-on-dark bg-surface-dark">
                            <FileText className="w-5 h-5" />
                          </div>
                          Terms of Service
                        </DialogTitle>
                      </div>
                      <div className="overflow-y-auto max-h-[50vh] pr-1.5 scrollbar-thin">
                        <DialogDescription asChild>
                          <div className="px-6 py-6 text-sm leading-relaxed space-y-5">
                            {[
                              {
                                icon: Users,
                                title: "1. Penerimaan Ketentuan",
                                text: "Dengan menggunakan platform PentaDosen, Anda setuju untuk terikat oleh syarat dan ketentuan penggunaan yang berlaku.",
                                color: "text-blue-400 border-blue-500/20 bg-blue-500/5",
                              },
                              {
                                icon: CheckCircle2,
                                title: "2. Akurasi Data",
                                text: "Dosen bertanggung jawab atas kebenaran data publikasi dan dokumen yang diunggah ke dalam sistem.",
                                color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
                              },
                              {
                                icon: AlertTriangle,
                                title: "3. Batasan Tanggung Jawab",
                                text: "Tim PentaDosen tidak bertanggung jawab atas kerugian yang timbul akibat kesalahan input data oleh pengguna atau penyalahgunaan akun.",
                                color: "text-rose-400 border-rose-500/20 bg-rose-500/5",
                              },
                              {
                                icon: RefreshCw,
                                title: "4. Perubahan Ketentuan",
                                text: "Kami berhak memperbarui syarat dan ketentuan ini sewaktu-waktu. Perubahan akan diinformasikan melalui platform kami.",
                                color: "text-violet-400 border-violet-500/20 bg-violet-500/5",
                              },
                            ].map((item, index) => (
                              <div key={index} className="flex items-start gap-4 p-4 rounded-xl border border-hairline-dark bg-canvas-dark hover:border-hairline-dark-soft transition-all duration-300 group/policy">
                                <div className={`p-2.5 border rounded-lg flex-shrink-0 transition-transform duration-300 group-hover/policy:scale-105 ${item.color}`}>
                                  <item.icon className="w-4 h-4" />
                                </div>
                                <div className="space-y-1">
                                  <h4 className="font-bold text-on-dark text-xs uppercase tracking-widest">{item.title}</h4>
                                  <p className="text-sm font-normal text-on-dark-soft leading-relaxed mt-1">{item.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </DialogDescription>
                      </div>
                      <div className="px-6 py-4 bg-canvas-dark border-t border-hairline-dark flex justify-end">
                        <DialogClose asChild>
                          <Button type="button" className="bg-surface-dark-elevated hover:bg-surface-dark text-on-dark border border-hairline-dark font-bold uppercase tracking-wider text-[11px] px-6 py-2 rounded-lg transition-all duration-300 cursor-pointer">Setuju</Button>
                        </DialogClose>
                      </div>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </li>
            </ul>
          </div>

          {/* Contact Support */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-xs font-black text-on-dark uppercase tracking-widest border-l-2 border-accent pl-3">Hubungi Kami</h3>
            <div className="space-y-4">
              
              {/* Address Card */}
              <div className="flex items-start gap-4 p-4 rounded-2xl border border-hairline-dark bg-surface-dark/40 hover:border-hairline-dark-soft transition-all duration-300 group/contact">
                <div className="p-2.5 border border-hairline-dark rounded-lg text-accent-on-dark bg-surface-dark-elevated flex-shrink-0 group-hover/contact:border-accent/30 transition-all duration-300">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-on-dark uppercase tracking-wider">Alamat Kantor</p>
                  <p className="text-sm font-medium text-on-dark-soft mt-1.5 leading-relaxed">
                    Jl. Letjen Suprapto No.26, Cempaka Putih, Kec. Cemp. Putih, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10510.
                  </p>
                </div>
              </div>

              {/* Email & Phone grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Email Card */}
                <div className="flex items-center gap-4 p-4 rounded-xl border border-hairline-dark bg-surface-dark/60 hover:border-hairline-dark-soft transition-all duration-300 group/contact">
                  <div className="p-2.5 border border-hairline-dark rounded-lg text-accent-on-dark bg-surface-dark-elevated flex-shrink-0 group-hover/contact:border-accent/30 transition-all duration-300">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-dark uppercase tracking-wider">Email</p>
                    <p className="text-sm font-bold text-on-dark-soft mt-1 break-all">teamduk.ta@gmail.com</p>
                  </div>
                </div>

                {/* Phone Card */}
                <div className="flex items-center gap-4 p-4 rounded-xl border border-hairline-dark bg-surface-dark/60 hover:border-hairline-dark-soft transition-all duration-300 group/contact">
                  <div className="p-2.5 border border-hairline-dark rounded-lg text-accent-on-dark bg-surface-dark-elevated flex-shrink-0 group-hover/contact:border-accent/30 transition-all duration-300">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-dark uppercase tracking-wider">Telepon</p>
                    <p className="text-sm font-bold text-on-dark-soft mt-1">+62(21)4206675</p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* Divider Line */}
        <div className="border-t border-hairline-dark mt-8 mb-0" />

        {/* Watermark Section */}
        <div className="flex justify-center items-center overflow-hidden pt-0 select-none pointer-events-none z-0">
          <span className="text-[14vw] font-extrabold text-white/[0.04] uppercase block leading-none select-none">
            DUK TEAM
          </span>
        </div>
      </div>
    </footer>
  );
}
