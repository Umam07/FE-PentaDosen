import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Building2, GraduationCap, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import AuthLayout from './components/AuthLayout';

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
    <AuthLayout 
      title="Create Account" 
      subtitle="Daftar sebagai Dosen PentaV2"
      maxWidth="max-w-[520px]"
    >
      <form className="space-y-6" onSubmit={handleRegister}>
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">
              Full Name & Title
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r border-gray-100 dark:border-gray-800 pr-3">
                <User className="h-4 w-4 text-gray-400 group-focus-within:text-primary-500" />
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
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r border-gray-100 dark:border-gray-800 pr-3">
                <Mail className="h-4 w-4 text-gray-400 group-focus-within:text-primary-500" />
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
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r border-gray-100 dark:border-gray-800 pr-3">
                <Building2 className="h-4 w-4 text-gray-400 group-focus-within:text-primary-500" />
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
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r border-gray-100 dark:border-gray-800 pr-3">
                <GraduationCap className="h-4 w-4 text-gray-400 group-focus-within:text-primary-500" />
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
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r border-gray-100 dark:border-gray-800 pr-3">
                <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-primary-500" />
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
    </AuthLayout>
  );
}
