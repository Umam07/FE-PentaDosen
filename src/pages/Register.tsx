import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Hexagon, Mail, Lock, User, Building2, GraduationCap, ChevronRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';

const FACULTY_MAJORS: Record<string, string[]> = {
  'Fakultas Kedokteran': ['Kedokteran'],
  'Fakultas Kedokteran Gigi': ['Kedokteran Gigi'],
  'Fakultas Teknologi Informasi': ['Teknik Informatika', 'Perpustakaan dan Sains Informasi'],
  'Fakultas Ekonomi Bisnis': ['Manajemen', 'Akuntansi'],
  'Fakultas Hukum': ['Hukum'],
  'Fakultas Psikologi': ['Psikologi'],
};

export default function Register({ setUser }: { setUser: any }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fakultas, setFakultas] = useState('');
  const [programStudi, setProgramStudi] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const availableMajors = fakultas ? FACULTY_MAJORS[fakultas] || [] : [];

  const handleFakultasChange = (val: string) => {
    setFakultas(val);
    const majors = FACULTY_MAJORS[val] || [];
    setProgramStudi(majors.length === 1 ? majors[0] : '');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, fakultas, program_studi: programStudi }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setUser(data.user);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Error saat membuat akun. Email mungkin sudah terdaftar.');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-primary-100 selection:text-primary-900 transition-all relative">
      {/* Back to Homepage Button */}
      <Link 
        to="/" 
        className="absolute top-4 left-4 md:top-8 md:left-8 inline-flex items-center gap-2 text-xs font-black text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 uppercase tracking-widest transition-all duration-200 group bg-white dark:bg-gray-900 px-4 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Kembali
      </Link>

      <div className="w-full max-w-[520px]">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-3.5 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl shadow-xl shadow-primary-100 dark:shadow-primary-900/30 mb-5"
          >
            <Hexagon className="w-8 h-8 text-white fill-white/20" />
          </motion.div>
          <motion.h1 
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase"
          >
            Create <span className="text-primary-600 dark:text-primary-400">Account</span>
          </motion.h1>
          <p className="text-gray-400 dark:text-gray-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">Daftar sebagai Dosen PentaV2</p>
        </div>

        {/* Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 p-8 lg:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-gray-800"
        >
          <form className="space-y-6" onSubmit={handleRegister}>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">
                  Full Name & Title
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r border-gray-100 dark:border-gray-800 pr-3">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-14 pr-4 py-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 transition-all outline-none text-sm placeholder:font-medium placeholder:text-gray-300 dark:placeholder:text-gray-600 dark:text-white"
                    placeholder="Prof. Dr. John Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r border-gray-100 dark:border-gray-800 pr-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-14 pr-4 py-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 transition-all outline-none text-sm placeholder:font-medium placeholder:text-gray-300 dark:placeholder:text-gray-600 dark:text-white"
                    placeholder="john.doe@univ.ac.id"
                  />
                </div>
              </div>

              {/* Fakultas Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">
                  Fakultas
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r border-gray-100 dark:border-gray-800 pr-3">
                    <Building2 className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    required
                    value={fakultas}
                    onChange={(e) => handleFakultasChange(e.target.value)}
                    className="w-full pl-14 pr-10 py-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl font-black focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 transition-all outline-none text-sm appearance-none cursor-pointer dark:text-white"
                  >
                    <option value="" disabled className="dark:bg-gray-900">Pilih Fakultas</option>
                    {Object.keys(FACULTY_MAJORS).map((fak) => (
                      <option key={fak} value={fak} className="dark:bg-gray-900">{fak}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <ChevronRight className="h-4 w-4 text-gray-400 rotate-90" />
                  </div>
                </div>
              </div>

              {/* Program Studi Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">
                  Program Studi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r border-gray-100 dark:border-gray-800 pr-3">
                    <GraduationCap className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    required
                    value={programStudi}
                    onChange={(e) => setProgramStudi(e.target.value)}
                    disabled={!fakultas}
                    className="w-full pl-14 pr-10 py-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl font-black focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 transition-all outline-none text-sm appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed dark:text-white"
                  >
                    <option value="" disabled className="dark:bg-gray-900">
                      {fakultas ? 'Pilih Program Studi' : 'Pilih Fakultas terlebih dahulu'}
                    </option>
                    {availableMajors.map((prodi) => (
                      <option key={prodi} value={prodi} className="dark:bg-gray-900">{prodi}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <ChevronRight className="h-4 w-4 text-gray-400 rotate-90" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">
                  Secret Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r border-gray-100 dark:border-gray-800 pr-3">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-14 pr-12 py-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 transition-all outline-none text-sm placeholder:font-medium placeholder:text-gray-300 dark:placeholder:text-gray-600 dark:text-white"
                    placeholder="Min. 6 chars"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider border border-red-100 dark:border-red-900/40"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4.5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-primary-100 dark:shadow-primary-900/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Profile
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-50 dark:border-gray-800 pt-8">
            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold">
              Sudah memiliki profil?{' '}
              <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors uppercase tracking-widest ml-1 underline underline-offset-4 decoration-2">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
