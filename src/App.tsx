/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { LogOut, AlertCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ScrollToTop from './components/layout/ScrollToTop';
import { OnboardingDialog } from './components/ui/onboarding-dialog';

// Lazy load page components
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/auth/Login'));
const AdminLogin = lazy(() => import('./pages/auth/AdminLogin'));
const Insights = lazy(() => import('./pages/dashboard/Insights'));
const Profile = lazy(() => import('./pages/profilediri/Profile'));
const Publication = lazy(() => import('./pages/dosen/publication'));
const AdminVerification = lazy(() => import('./pages/admin/Verification'));
const AdminLecturers = lazy(() => import('./pages/admin/Lecturers'));
const AdminLecturerProfile = lazy(() => import('./pages/admin/LecturerProfile'));
const AdminInputDocument = lazy(() => import('./pages/admin/AdminInputDocument'));
const AdminSync = lazy(() => import('./pages/admin/AdminSync'));
const AdminAllDocuments = lazy(() => import('./pages/admin/AdminAllDocuments'));
const AdminActivityLogs = lazy(() => import('./pages/admin/ActivityLogs'));
const CmsDashboard = lazy(() => import('./pages/admin/CmsDashboard'));
const Research = lazy(() => import('./pages/dosen/research'));
const Buku = lazy(() => import('./pages/dosen/buku'));
const HKI = lazy(() => import('./pages/dosen/hki'));
const LecturerDashboard = lazy(() => import('./pages/dosen/dashboard/LecturerDashboard'));
const FaqHelp = lazy(() => import('./pages/dosen/FaqHelp'));
const LecturerList = lazy(() => import('./pages/dashboard/LecturerList'));
const LecturerProfileInsights = lazy(() => import('./pages/dashboard/LecturerProfileInsights'));
const DepartementList = lazy(() => import('./pages/dashboard/DepartementList'));
const Developers = lazy(() => import('./pages/Developers'));


function DashboardRedirect({ user }: { user: any }) {
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'admin penelitian' || user.role === 'admin fakultas') {
    return <Navigate to="/admin/verify" />;
  }
  if (user.role === 'super admin') {
    return <Navigate to="/admin/cms" />;
  }
  
  // Check if ID is missing for Dosen
  if (user.role === 'dosen' && (!user.scholar_id || !user.scopus_id)) {
    return <Navigate to="/profile?warning=true" />;
  }

  // Redirect new dosen users to profile page to complete setup
  const hasSeenOnboarding = localStorage.getItem('penta_onboarding_seen');
  if (!hasSeenOnboarding && user.role === 'dosen') {
    return <Navigate to="/profile" />;
  }
  
  return <Navigate to="/lecturer-dashboard" />;
}

function AdminRedirect({ user, setUser }: { user: any; setUser: any }) {
  if (!user) {
    return <AdminLogin setUser={setUser} />;
  }

  if (user.role === 'super admin') {
    return <Navigate to="/admin/cms" />;
  }
  if (user.role === 'admin penelitian' || user.role === 'admin fakultas') {
    return <Navigate to="/admin/verify" />;
  }

  return <Navigate to="/dashboard" />;
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<any>(() => {
    const storedUser = sessionStorage.getItem('pentadosen_user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        sessionStorage.removeItem('pentadosen_user');
        return null;
      }
    }
    return null;
  });

  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);

  // Global Interceptor for 429 (Rate Limit), 401 (Unauthorized), and 419 (Session Expired)
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        // Get request URL to bypass login endpoint
        const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request)?.url || '';
        const isLoginRequest = url.includes('/api/login');

        // Check if rate limit modal should be suppressed (e.g. background mass sync)
        const init = args[1] as RequestInit | undefined;
        let suppressRateLimitModal = false;
        if (init?.headers) {
          if (init.headers instanceof Headers) {
            suppressRateLimitModal = init.headers.get('x-suppress-rate-limit-modal') === 'true';
          } else if (Array.isArray(init.headers)) {
            suppressRateLimitModal = init.headers.some(([k, v]) => k.toLowerCase() === 'x-suppress-rate-limit-modal' && v === 'true');
          } else if (typeof init.headers === 'object') {
            const keys = Object.keys(init.headers);
            const targetKey = keys.find(k => k.toLowerCase() === 'x-suppress-rate-limit-modal');
            if (targetKey && (init.headers as Record<string, string>)[targetKey] === 'true') {
              suppressRateLimitModal = true;
            }
          }
        }

        if ((response.status === 401 || response.status === 419) && !isLoginRequest) {
          setIsSessionExpired(true);
        } else if (response.status === 429 && !suppressRateLimitModal) {
          setIsRateLimited(true);
        }
        return response;
      } catch (error) {
        return Promise.reject(error);
      }
    };
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const handleSessionExpiredAction = async () => {
    try {
      if (user?.id) {
        await fetch('/api/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.id })
        });
      }
    } catch (error) {
      console.error('Logout logging failed', error);
    }
    setIsSessionExpired(false);
    setUser(null);
    window.location.href = '/login';
  };

  useEffect(() => {
    // Initialize theme based on localStorage
    const isDark = localStorage.getItem('theme') === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    if (user && !isSessionExpired) {
      sessionStorage.setItem('pentadosen_user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('pentadosen_user');
    }
  }, [user, isSessionExpired]);

  // Automatic logout after 20 minutes of inactivity
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (user && !isSessionExpired) {
        // 20 minutes = 20 * 60 * 1000 ms
        timeoutId = setTimeout(() => {
          setIsSessionExpired(true); // Trigger the modal instead of immediate logout
          console.log('Session expired due to inactivity');
        }, 20 * 60 * 1000);
      }
    };

    const activityEvents = [
      'mousedown', 'mousemove', 'keydown',
      'scroll', 'touchstart', 'click'
    ];

    if (user && !isSessionExpired) {
      activityEvents.forEach(event => {
        window.addEventListener(event, resetTimer);
      });

      resetTimer();
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user, isSessionExpired]);
  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/insights" element={user ? <Navigate to="/dashboard" /> : <Insights />} />
          <Route path="/departments" element={<DepartementList />} />
          <Route path="/lecturers" element={<LecturerList />} />
          <Route path="/lecturer/:id" element={<LecturerProfileInsights />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} />
          <Route path="/admin" element={<AdminRedirect user={user} setUser={setUser} />} />

          <Route element={<Layout user={user} setUser={setUser} />}>
            <Route path="/dashboard" element={<DashboardRedirect user={user} />} />
            <Route path="/lecturer-dashboard" element={user?.role === 'dosen' ? <LecturerDashboard user={user} /> : <Navigate to="/dashboard" />} />
            <Route path="/publication" element={user?.role === 'dosen' ? <Publication user={user} /> : <Navigate to="/dashboard" />} />
            <Route path="/research" element={user?.role === 'dosen' ? <Research user={user} /> : <Navigate to="/dashboard" />} />
            <Route path="/buku" element={user?.role === 'dosen' ? <Buku user={user} /> : <Navigate to="/dashboard" />} />
            <Route path="/hki" element={user?.role === 'dosen' ? <HKI user={user} /> : <Navigate to="/dashboard" />} />
             <Route path="/admin/documents/all" element={user ? ((user.role === 'admin penelitian' || user.role === 'admin fakultas') ? <AdminAllDocuments /> : <Navigate to="/dashboard" />) : <Navigate to="/admin" />} />
            <Route path="/admin/verify" element={user ? ((user.role === 'admin penelitian' || user.role === 'admin fakultas') ? <AdminVerification /> : <Navigate to="/dashboard" />) : <Navigate to="/admin" />} />
            <Route path="/admin/lecturers" element={user ? ((user.role === 'admin penelitian' || user.role === 'admin fakultas') ? <AdminLecturers /> : <Navigate to="/dashboard" />) : <Navigate to="/admin" />} />
            <Route path="/admin/lecturers/:id" element={user ? ((user.role === 'admin penelitian' || user.role === 'admin fakultas') ? <AdminLecturerProfile /> : <Navigate to="/dashboard" />) : <Navigate to="/admin" />} />
            <Route path="/admin/sync" element={user ? (user.role === 'admin penelitian' ? <AdminSync /> : <Navigate to="/dashboard" />) : <Navigate to="/admin" />} />
            <Route path="/admin/input-document" element={user ? ((user.role === 'admin penelitian' || user.role === 'admin fakultas') ? <AdminInputDocument /> : <Navigate to="/dashboard" />) : <Navigate to="/admin" />} />
            <Route path="/admin/activity-logs" element={user ? ((user.role === 'admin penelitian' || user.role === 'admin fakultas') ? <AdminActivityLogs /> : <Navigate to="/dashboard" />) : <Navigate to="/admin" />} />
            <Route path="/admin/cms" element={user ? (user.role === 'super admin' ? <CmsDashboard user={user} /> : <Navigate to="/dashboard" />) : <Navigate to="/admin" />} />
            <Route path="/help" element={<FaqHelp user={user} />} />
            <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
          </Route>
        </Routes>
      </Suspense>

      {user?.role === 'dosen' && <OnboardingDialog />}
      {/* Session Expired Modal */}
      <AnimatePresence>
        {isSessionExpired && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-zinc-800 p-8 lg:p-10 overflow-hidden"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-500/5 rounded-full -ml-12 -mb-12" />
              
              <div className="relative">
                <div className="w-20 h-20 bg-amber-50 dark:bg-amber-950/20 rounded-3xl flex items-center justify-center mb-8 mx-auto ring-8 ring-amber-50/50 dark:ring-amber-950/10">
                  <AlertCircle className="w-10 h-10 text-amber-500" />
                </div>
                
                <h3 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-zinc-100 text-center mb-4 tracking-tight uppercase">
                  Sesi Berakhir
                </h3>
                
                <p className="text-gray-500 dark:text-zinc-400 text-center mb-10 font-bold leading-relaxed">
                  Waktu sesi Anda telah habis karena pembatasan akses atau inaktivitas. Silakan masuk kembali untuk melanjutkan pekerjaan Anda.
                </p>
                
                <div className="space-y-4">
                  <button
                    onClick={handleSessionExpiredAction}
                    className="w-full py-4 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center group"
                  >
                    Login Kembali
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500 text-center font-black uppercase tracking-[0.2em]">
                    PentaDosen Security Protocol
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Rate Limit Modal */}
      <AnimatePresence>
        {isRateLimited && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900/60 backdrop-blur-md"
              onClick={() => setIsRateLimited(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-zinc-800 p-8 lg:p-10 overflow-hidden"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-500/5 rounded-full -ml-12 -mb-12" />
              
              <div className="relative">
                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-950/20 rounded-3xl flex items-center justify-center mb-8 mx-auto ring-8 ring-blue-50/50 dark:ring-blue-950/10">
                  <AlertCircle className="w-10 h-10 text-blue-500" />
                </div>
                
                <h3 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-zinc-100 text-center mb-4 tracking-tight uppercase">
                  Terlalu Banyak Permintaan
                </h3>
                
                <p className="text-gray-500 dark:text-zinc-400 text-center mb-10 font-bold leading-relaxed">
                  Sistem mendeteksi aktivitas yang sangat cepat. Silakan tunggu beberapa saat sebelum mencoba kembali untuk kenyamanan dan keamanan data Anda.
                </p>
                
                <div className="space-y-4">
                  <button
                    onClick={() => setIsRateLimited(false)}
                    className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-200 dark:shadow-blue-900/20 transition-all flex items-center justify-center group"
                  >
                    Mengerti & Tutup
                  </button>
                  
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500 text-center font-black uppercase tracking-[0.2em]">
                    PentaDosen Security Protocol
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Router>
  );
}
