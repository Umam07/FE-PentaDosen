/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ScrollToTop from './components/layout/ScrollToTop';
import Toaster from './components/ui/toast';
import { PageLoader } from './components/ui/PageLoader';

// Lazy load layout and dialog components
const Layout = lazy(() => import('./components/layout/Layout'));
const OnboardingDialog = lazy(() => import('./components/features/onboarding').then(m => ({ default: m.OnboardingDialog })));

// Lazy load page components
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/auth/LoginPage'));
const Insights = lazy(() => import('./pages/dashboard/Insights/InsightsPage'));
const Profile = lazy(() => import('./pages/profilediri/Profile/ProfilePage'));
const Publication = lazy(() => import('./pages/dosen/publication/PublicationPage'));
const AdminVerification = lazy(() => import('./pages/admin/Verification/VerificationPage'));
const AdminLecturers = lazy(() => import('./pages/admin/Lecturers/LecturersPage'));
const AdminLecturerProfile = lazy(() => import('./pages/admin/LecturerProfile/LecturerProfilePage'));
const AdminInputDocument = lazy(() => import('./pages/admin/AdminInputDocument/AdminInputDocumentPage'));
const AdminSync = lazy(() => import('./pages/admin/AdminSync/AdminSyncPage'));
const AdminAllDocuments = lazy(() => import('./pages/admin/AdminAllDocuments/AdminAllDocumentsPage'));
const AdminActivityLogs = lazy(() => import('./pages/admin/ActivityLogs/ActivityLogsPage'));
const CmsDashboard = lazy(() => import('./pages/admin/CmsDashboard/CmsDashboardPage'));
const Research = lazy(() => import('./pages/dosen/research/ResearchPage'));
const Buku = lazy(() => import('./pages/dosen/buku/BukuPage'));
const HKI = lazy(() => import('./pages/dosen/hki/HKIPage'));
const LecturerDashboard = lazy(() => import('./pages/dosen/dashboard/LecturerDashboardPage'));
const FaqHelp = lazy(() => import('./pages/dosen/FaqHelp/FaqHelpPage'));
const LecturerList = lazy(() => import('./pages/dashboard/LecturerList/LecturerListPage'));
const LecturerProfileInsights = lazy(() => import('./pages/dashboard/LecturerProfileInsights/LecturerProfileInsightsPage'));
const DepartementList = lazy(() => import('./pages/dashboard/DepartementList/DepartementListPage'));
const Developers = lazy(() => import('./pages/Developers'));


function DashboardRedirect({ user }: { user: any }) {
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'admin penelitian' || user.role === 'admin fakultas') {
    return <Navigate to="/admin/verify" />;
  }
  
  // 1. Redirect new dosen users to profile page to complete onboarding first
  const hasSeenOnboarding = localStorage.getItem('penta_onboarding_seen');
  if (!hasSeenOnboarding && user.role === 'dosen') {
    return <Navigate to="/profile?tab=integrasi" />;
  }

  // 2. Check if ID is missing for Dosen (only after onboarding has been seen)
  if (user.role === 'dosen' && (!user.scholar_id || !user.scopus_id)) {
    return <Navigate to="/profile?warning=true" />;
  }
  
  return <Navigate to="/lecturer-dashboard" />;
}

function AdminRedirect({ user }: { user: any }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'admin penelitian' || user.role === 'admin fakultas') {
    return <Navigate to="/admin/verify" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}

function LoadingFallback() {
  return <PageLoader title="PentaDosen" message="Menyiapkan data akademik..." />;
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
          <Route path="/admin" element={<AdminRedirect user={user} />} />

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
            <Route path="/admin/cms" element={user ? (user.role === 'admin penelitian' ? <CmsDashboard user={user} /> : <Navigate to="/dashboard" />) : <Navigate to="/admin" />} />
            <Route path="/help" element={user ? <FaqHelp user={user} /> : <Navigate to="/login" replace />} />
            <Route path="/profile" element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" replace />} />
          </Route>
        </Routes>
      </Suspense>

      {user && ['dosen', 'admin fakultas', 'admin penelitian'].includes(user.role) && (
        <Suspense fallback={null}>
          <OnboardingDialog user={user} />
        </Suspense>
      )}
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
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-zinc-800 p-6 sm:p-7 overflow-hidden"
            >
              {/* Accent bar tipis warna primary-orange dengan radius sudut menyatu dengan card */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-orange-500 rounded-t-2xl" />
              
              <div className="pt-2">
                {/* Flat circle background warna primary-orange (opacity 15%) dan ikon solid */}
                <div className="w-16 h-16 bg-orange-500/15 dark:bg-orange-500/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <AlertCircle className="w-8 h-8 text-orange-500" />
                </div>
                
                {/* Judul sentence case */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 text-center mb-3 tracking-tight">
                  Sesi berakhir
                </h3>
                
                {/* Copy body ringkas & personal dengan line-height lega */}
                <p className="text-sm text-gray-600 dark:text-zinc-400 text-center mb-7 leading-relaxed">
                  Kamu perlu masuk kembali untuk melanjutkan pekerjaan. Ini terjadi otomatis demi menjaga keamanan akunmu.
                </p>
                
                {/* Tombol aksi */}
                <button
                  onClick={handleSessionExpiredAction}
                  className="w-full py-3.5 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold text-sm transition-all flex items-center justify-center group"
                >
                  Masuk kembali
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
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
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500 text-center font-black uppercase tracking-[0.2em]">
                    PentaDosen Security Protocol
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Toast Notification System */}
      <Toaster defaultPosition="bottom-right" />
    </Router>
  );
}
