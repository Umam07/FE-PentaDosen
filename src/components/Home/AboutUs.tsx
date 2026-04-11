import { motion } from 'motion/react';
import { Quote, Instagram } from 'lucide-react';

export default function AboutUs() {
  const members = [
    {
      name: 'Kiki Aimar Wicaksana',
      npm: '1402022030',
      role: 'API Integrator',
      image: 'https://res.cloudinary.com/dr57ribr5/image/upload/w_500,h_600,c_fill,q_auto,f_auto/Kiki_l5i0u9.jpg',
      bgColor: 'primary',
      instagram: 'https://www.instagram.com/kim.aimarr?igsh=ZXRnNzM2cnJvbWV5',
    },
    {
      name: "Muhammad Syafi'ul Umam",
      npm: '1402022048',
      role: 'Frontend Engineer',
      image: 'https://res.cloudinary.com/dr57ribr5/image/upload/w_500,h_600,c_fill,q_auto,f_auto/Mamz_oz4gxx.jpg',
      bgColor: 'blue',
      instagram: 'https://www.instagram.com/umammskyy?igsh=MWY4Z212M3U5OGloag==',
    },
    {
      name: 'Rafi Daniswara',
      npm: '1402022050',
      role: 'Backend Engineer',
      image: 'https://res.cloudinary.com/dr57ribr5/image/upload/w_500,h_600,c_fill,q_auto,f_auto/Denis_ohil78.jpg',
      bgColor: 'violet',
      instagram: 'https://www.instagram.com/ravidnss?igsh=MWkyaWZmNWI4N3hxOQ==',
    },
  ];

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

        {/* Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto mb-24">
          {members.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
              /* FIX GECKO 1: Tambahkan transform-gpu, backface-hidden, dan translate-z-0 di parent pembungkus paling luar */
              className="group relative rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-500 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 isolate transform-gpu backface-hidden translate-z-0"
            >
              {/* Image Container */}
              <div 
                /* FIX GECKO 2: Pastikan properti 3D juga ada di container gambar */
                className="aspect-[4/5] relative overflow-hidden bg-gray-200 dark:bg-slate-800 transform-gpu backface-hidden translate-z-0"
                style={{ 
                  WebkitMaskImage: '-webkit-radial-gradient(white, black)',
                  /* FIX GECKO 3: Tambahkan properti mask-image standar untuk Firefox/Zen */
                  maskImage: 'radial-gradient(white, black)'
                }} 
              >
                <img 
                  src={member.image} 
                  alt={member.name}
                  loading="lazy"
                  decoding="async"
                  /* FIX GECKO 4: backface-hidden di img sangat penting untuk Firefox agar sudut tidak pecah */
                  className="w-full h-full object-cover transition-transform duration-700 ease-out transform-gpu will-change-transform group-hover:scale-110 backface-hidden translate-z-0"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300 pointer-events-none" />
                
                {/* Social Links */}
                <div className="absolute top-6 right-6 flex flex-col gap-3 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 ease-out z-20">
                  <a 
                    href={member.instagram} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-primary-500 text-white transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>

                {/* Info Container */}
                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 z-10">
                  <span className="inline-block px-3 py-1 mb-3 text-xs font-bold text-primary-100 bg-primary-600/80 backdrop-blur-sm rounded-full tracking-wider">
                    {member.npm}
                  </span>
                  <h4 className="text-2xl font-black text-white mb-1">{member.name}</h4>
                  <p className="text-sm font-medium text-gray-300">{member.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Philosophy Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-5xl mx-auto rounded-[2.5rem] p-10 md:p-16 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-900 dark:to-black shadow-2xl overflow-hidden group mb-10"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          
          <Quote className="w-32 h-32 text-white/5 absolute -top-6 -left-6 -z-0 group-hover:scale-110 group-hover:text-white/10 transition-all duration-700 rotate-12" />
          
          <div className="relative z-10 text-center flex flex-col items-center">
             <h4 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
               Filosofi Tim Kami
             </h4>
             <h3 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-blue-400 leading-tight max-w-3xl">
               "Fokus pada kesederhanaan, hasilkan keunggulan."
             </h3>
          </div>
        </motion.div>

      </div>
    </section>
  );
}