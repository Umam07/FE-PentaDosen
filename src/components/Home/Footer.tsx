import { MouseEvent, useState, useEffect, useRef } from 'react';
import { MapPin, Mail, Phone, ArrowRight, ExternalLink, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PentaDosenLogo from '../ui/PentaDosenLogo';

export default function Footer() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [shouldLoadMap, setShouldLoadMap] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current || shouldLoadMap) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoadMap(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(mapContainerRef.current);
    return () => observer.disconnect();
  }, [shouldLoadMap]);

  const handleScrollTo = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <footer id="contact" className="bg-surface-light dark:bg-footer-dark text-body dark:text-on-dark-soft py-14 sm:py-16 relative overflow-hidden border-t border-hairline-light dark:border-hairline-dark transition-colors duration-300">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(59,55,49,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,55,49,0.15)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Logo & About */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="flex items-center gap-3 sm:gap-3.5 group w-fit" title="Universitas YARSI • PentaDosen">
              {/* Institution: Universitas YARSI */}
              <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                <img 
                  src="/YARSI-KOTAK-e1739161183276.png" 
                  alt="Universitas YARSI" 
                  width={36}
                  height={36}
                  className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0 transition-transform duration-200 group-hover:scale-105"
                />
                <div className="flex flex-col justify-center">
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-wider text-body dark:text-on-dark-soft uppercase leading-tight">
                    UNIVERSITAS
                  </span>
                  <span className="text-xs sm:text-sm font-black tracking-tight text-ink-heading dark:text-on-dark uppercase leading-tight">
                    YARSI
                  </span>
                </div>
              </div>

              {/* Centered Vertical Divider */}
              <div className="h-7 sm:h-8 w-[1px] bg-hairline-light dark:bg-hairline-dark shrink-0" />

              {/* Product: PentaDosen */}
              <div className="flex items-center gap-2 sm:gap-2.5 shrink min-w-0">
                <PentaDosenLogo className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 transition-transform duration-200 group-hover:scale-105" />
                <span className="text-base sm:text-lg font-black text-ink-heading dark:text-on-dark tracking-tight uppercase truncate leading-none">
                  Penta<span className="text-accent dark:text-accent-on-dark">Dosen</span>
                </span>
              </div>
            </Link>
            <p className="text-sm font-normal text-body dark:text-on-dark-soft leading-relaxed max-w-sm">
              Platform Penelitian Dosen YARSI — mengelola publikasi, sitasi, dan dokumen akademik dalam satu ekosistem yang aman dan modern.
            </p>
            
            {/* Elegant Copyright & Developer Credit */}
            <div className="pt-2 text-xs text-muted dark:text-on-dark-muted flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-semibold text-ink-heading dark:text-on-dark">
                © {new Date().getFullYear()} PentaDosen
              </span>
              <span className="text-muted/40 dark:text-on-dark-muted/40">•</span>
              <span className="text-body dark:text-on-dark-soft">
                Developed by{' '}
                <Link
                  to="/developers"
                  className="font-semibold text-ink-heading dark:text-on-dark hover:text-accent dark:hover:text-accent-on-dark transition-colors inline-flex items-center gap-0.5 group/dev hover:underline underline-offset-4 decoration-accent"
                >
                  <span>DUK Team</span>
                  <ArrowUpRight className="w-3 h-3 text-muted dark:text-on-dark-muted group-hover/dev:text-accent dark:group-hover/dev:text-accent-on-dark transition-transform group-hover/dev:translate-x-0.5 group-hover/dev:-translate-y-0.5" />
                </Link>
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="text-xs font-black text-ink-heading dark:text-on-dark uppercase tracking-widest border-l-2 border-accent pl-3">Navigasi</h3>
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
                    className="text-sm font-semibold text-body dark:text-on-dark-soft hover:text-ink-heading dark:hover:text-on-dark flex items-center gap-2 group transition-all duration-300"
                  >
                    <ArrowRight className="w-3.5 h-3.5 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 text-accent dark:text-accent-on-dark transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Support */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-xs font-black text-ink-heading dark:text-on-dark uppercase tracking-widest border-l-2 border-accent pl-3">Hubungi Kami</h3>
            <div className="space-y-4">
              
              {/* Modern Interactive Maps Card */}
              <div className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark overflow-hidden transition-all duration-300 hover:border-ink-border dark:hover:border-hairline-dark-soft group/map shadow-sm">
                {/* Embedded Map Container (Lazy-loaded via IntersectionObserver) */}
                <div ref={mapContainerRef} className="relative h-36 sm:h-40 w-full overflow-hidden bg-canvas-light dark:bg-canvas-dark">
                  {shouldLoadMap ? (
                    <iframe
                      title="Lokasi Universitas YARSI"
                      src="https://maps.google.com/maps?q=Universitas+YARSI,+Jl.+Letjen+Suprapto+No.+Kav.+1,+Cempaka+Putih,+Jakarta+Pusat&t=&z=16&ie=UTF8&iwloc=&output=embed"
                      className="w-full h-full border-0 opacity-90 group-hover/map:opacity-100 transition-opacity duration-300"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  ) : (
                    <div className="w-full h-full bg-surface-light-raised dark:bg-surface-dark-elevated" />
                  )}
                </div>

                {/* Address Details & Action */}
                <div className="p-4 bg-surface-light dark:bg-surface-dark flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-hairline-light dark:border-hairline-dark">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2 border border-hairline-light dark:border-hairline-dark rounded-lg text-accent dark:text-accent-on-dark bg-surface-light-raised dark:bg-surface-dark-elevated flex-shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-ink-heading dark:text-on-dark uppercase tracking-wider">Alamat Kampus</p>
                      <p className="text-xs font-medium text-body dark:text-on-dark-soft mt-0.5 leading-relaxed line-clamp-2 sm:line-clamp-none">
                        Jl. Letjen Suprapto No.26, Cempaka Putih, Jakarta Pusat 10510
                      </p>
                    </div>
                  </div>
                  <a
                    href="https://maps.google.com/?q=Universitas+YARSI+Jakarta"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-accent-hover dark:text-accent-on-dark bg-accent/15 hover:bg-accent/25 border border-accent/30 transition-colors flex-shrink-0 self-start sm:self-center"
                  >
                    <span>Buka Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Redesigned Email & Phone interactive cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Email Card */}
                <a
                  href="mailto:teamduk.ta@gmail.com"
                  className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated hover:border-ink-border dark:hover:border-hairline-dark-soft transition-all duration-200 group/contact shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg border border-hairline-light dark:border-hairline-dark bg-surface-light-raised dark:bg-surface-dark-elevated flex items-center justify-center text-body dark:text-on-dark-soft group-hover/contact:text-accent dark:group-hover/contact:text-accent-on-dark group-hover/contact:border-accent/30 transition-all flex-shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-body dark:text-on-dark-soft uppercase tracking-wider">Email</p>
                      <p className="text-xs font-semibold text-ink-heading dark:text-on-dark truncate mt-0.5">teamduk.ta@gmail.com</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-body dark:text-on-dark-soft group-hover/contact:text-accent dark:group-hover/contact:text-accent-on-dark group-hover/contact:translate-x-0.5 group-hover/contact:-translate-y-0.5 transition-all flex-shrink-0" />
                </a>

                {/* Phone Card */}
                <a
                  href="tel:+62214206675"
                  className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated hover:border-ink-border dark:hover:border-hairline-dark-soft transition-all duration-200 group/contact shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg border border-hairline-light dark:border-hairline-dark bg-surface-light-raised dark:bg-surface-dark-elevated flex items-center justify-center text-body dark:text-on-dark-soft group-hover/contact:text-accent dark:group-hover/contact:text-accent-on-dark group-hover/contact:border-accent/30 transition-all flex-shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-body dark:text-on-dark-soft uppercase tracking-wider">Telepon</p>
                      <p className="text-xs font-semibold text-ink-heading dark:text-on-dark truncate mt-0.5">+62 (21) 420-6675</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-body dark:text-on-dark-soft group-hover/contact:text-accent dark:group-hover/contact:text-accent-on-dark group-hover/contact:translate-x-0.5 group-hover/contact:-translate-y-0.5 transition-all flex-shrink-0" />
                </a>

              </div>

            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
