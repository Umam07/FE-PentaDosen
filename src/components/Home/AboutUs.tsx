import { motion } from 'motion/react';
import { Quote, Instagram } from 'lucide-react';
import { CircularTestimonials } from '../ui/circular-testimonials';

export default function AboutUs() {
  const members = [
    {
      name: 'Kiki Aimar Wicaksana',
      npm: '1402022030',
      role: 'API Integrator',
      image: 'https://res.cloudinary.com/dr57ribr5/image/upload/w_500,h_600,c_fill,q_auto,f_auto/Kiki_l5i0u9.jpg',
      bgColor: 'primary',
      instagram: 'https://www.instagram.com/kim.aimarr?igsh=ZXRnNzM2cnJvbWV5',
      bio: "Fokus pada integrasi data dan performa sistem untuk memastikan pengalaman pengguna yang mulus."
    },
    {
      name: "Muhammad Syafi'ul Umam",
      npm: '1402022048',
      role: 'Frontend Engineer',
      image: 'https://res.cloudinary.com/dr57ribr5/image/upload/w_500,h_600,c_fill,q_auto,f_auto/Mamz_oz4gxx.jpg',
      bgColor: 'blue',
      instagram: 'https://www.instagram.com/umammskyy?igsh=MWY4Z212M3U5OGloag==',
      bio: "Menciptakan antarmuka yang modern, responsif, dan intuitif menggunakan teknologi web terkini."
    },
    {
      name: 'Rafi Daniswara',
      npm: '1402022050',
      role: 'Backend Engineer',
      image: 'https://res.cloudinary.com/dr57ribr5/image/upload/w_500,h_600,c_fill,q_auto,f_auto/Denis_ohil78.jpg',
      bgColor: 'violet',
      instagram: 'https://www.instagram.com/ravidnss?igsh=MWkyaWZmNWI4N3hxOQ==',
      bio: "Membangun arsitektur server yang kokoh dan scalable untuk mendukung seluruh ekosistem aplikasi."
    },
  ];

  // Map members to the format expected by CircularTestimonials
  const teamTestimonials = members.map(m => ({
    name: m.name,
    designation: `${m.role} • ${m.npm}`,
    quote: m.bio,
    src: m.image
  }));

  return (
    <section id="about" className="py-20 md:py-32 bg-[#F8FAFC] dark:bg-slate-950 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary-300 dark:bg-primary-900 rounded-full filter blur-[100px] animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-blue-300 dark:bg-blue-900 rounded-full filter blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-6"
          >
            Tentang <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500 dark:from-primary-400 dark:to-blue-400">Kami</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl font-medium text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Berkenalan dengan tim pengembang di balik sistem pemesanan digital yang revolusioner.
          </motion.p>
        </div>

        {/* Team Members Circular Section */}
        <div className="flex justify-center mb-20">
          <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-[3rem] p-4 md:p-12 shadow-2xl border border-white/20 dark:border-slate-800 w-full flex justify-center">
            <CircularTestimonials
              testimonials={teamTestimonials}
              autoplay={true}
              colors={{
                name: "var(--color-primary-600)",
                designation: "var(--color-slate-500)",
                testimony: "var(--color-slate-700)",
                arrowBackground: "var(--color-slate-900)",
                arrowForeground: "#fff",
                arrowHoverBackground: "var(--color-primary-500)",
              }}
              fontSizes={{
                name: "32px",
                designation: "18px",
                quote: "20px",
              }}
            />
          </div>
        </div>

        {/* Philosophy Section - Connected Style */}
        <div className="relative pt-10">
          {/* Connector Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-32 bg-gradient-to-b from-primary-500/20 to-transparent -translate-y-24 hidden md:block" />
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.21, 1.02, 0.47, 0.98] }}
            className="relative max-w-4xl mx-auto"
          >
            {/* Background Glows */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-full h-full bg-primary-500/5 blur-[100px] -z-10" />
            
            <div className="bg-white/30 dark:bg-slate-900/30 backdrop-blur-2xl rounded-[3rem] p-10 md:p-20 border border-white/20 dark:border-slate-800/50 shadow-2xl overflow-hidden group">
              {/* Decorative Quote Mark */}
              <Quote className="w-32 h-32 text-primary-500/5 absolute -top-6 -left-6 -z-0 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 pointer-events-none" />
              <Quote className="w-24 h-24 text-blue-500/5 absolute -bottom-4 -right-4 -z-0 -rotate-12 group-hover:-rotate-12 group-hover:scale-110 transition-all duration-700 pointer-events-none" />
              
              <div className="relative z-10 text-center flex flex-col items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="px-4 py-1.5 rounded-full bg-primary-500/10 dark:bg-primary-500/20 border border-primary-500/20 mb-8"
                >
                  <span className="text-[10px] md:text-xs font-black text-primary-600 dark:text-primary-400 uppercase tracking-[0.3em]">
                    Visi & Dedikasi
                  </span>
                </motion.div>
                
                <h3 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] mb-2">
                  "Fokus pada <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500 dark:from-primary-400 dark:to-blue-400">kesederhanaan</span>,
                </h3>
                <h3 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.1]">
                  hasilkan <span className="italic font-serif text-primary-600 dark:text-primary-400">keunggulan</span>."
                </h3>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}