/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DashboardAll from './pages/dashboard/Dashboard';
import Profile from './pages/Profile';
import Publication from './pages/Publication';
import AdminVerification from './pages/admin/AdminVerification';
import AdminLecturers from './pages/admin/AdminLecturers';
import AdminLecturerProfile from './pages/admin/AdminLecturerProfile';
import AdminSync from './pages/admin/AdminSync';
import AdminAllDocuments from './pages/admin/AdminAllDocuments';
import Research from './pages/Research';
import Home from './pages/Home';
import ResearchDocs from './pages/ResearchDocs';
import LecturerList from './pages/dashboard/LecturerList';
import LecturerProfileDashboard from './pages/dashboard/LecturerProfileDashboard';
import DepartementList from './pages/dashboard/DepartementList';
import ScrollToTop from './components/layout/ScrollToTop';

function DashboardRedirect({ user }: { user: any }) {
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'admin lppm' || user.role === 'admin prodi') {
    return <Navigate to="/admin/verify" />;
  }
  return <Navigate to="/publication" />;
}

export default function App() {
  const [user, setUser] = useState<any>(() => {
    const storedUser = localStorage.getItem('pentadosen_user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        localStorage.removeItem('pentadosen_user');
        return null;
      }
    }
    return null;
  });

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
    if (user) {
      localStorage.setItem('pentadosen_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pentadosen_user');
    }
  }, [user]);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard-all" element={user ? <Navigate to="/dashboard" /> : <DashboardAll />} />
        <Route path="/departments" element={<DepartementList />} />
        <Route path="/lecturers" element={<LecturerList />} />
        <Route path="/lecturer/:id" element={<LecturerProfileDashboard />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register setUser={setUser} />} />
        
        <Route element={<Layout user={user} setUser={setUser} />}>
          <Route path="/dashboard" element={<DashboardRedirect user={user} />} />
          <Route path="/publication" element={user?.role === 'dosen' ? <Publication user={user} /> : <Navigate to="/dashboard" />} />
          <Route path="/research" element={user?.role === 'dosen' ? <Research user={user} /> : <Navigate to="/dashboard" />} />
          <Route path="/research/proposal" element={user?.role === 'dosen' ? <ResearchDocs user={user} /> : <Navigate to="/dashboard" />} />
          <Route path="/research/laporan" element={user?.role === 'dosen' ? <ResearchDocs user={user} /> : <Navigate to="/dashboard" />} />
          <Route path="/admin/documents/all" element={(user?.role === 'admin lppm' || user?.role === 'admin prodi') ? <AdminAllDocuments /> : <Navigate to="/dashboard" />} />
          <Route path="/admin/verify" element={(user?.role === 'admin lppm' || user?.role === 'admin prodi') ? <AdminVerification /> : <Navigate to="/dashboard" />} />
          <Route path="/admin/lecturers" element={(user?.role === 'admin lppm' || user?.role === 'admin prodi') ? <AdminLecturers /> : <Navigate to="/dashboard" />} />
          <Route path="/admin/lecturers/:id" element={(user?.role === 'admin lppm' || user?.role === 'admin prodi') ? <AdminLecturerProfile /> : <Navigate to="/dashboard" />} />
          <Route path="/admin/sync" element={(user?.role === 'admin lppm' || user?.role === 'admin prodi') ? <AdminSync /> : <Navigate to="/dashboard" />} />
          <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
        </Route>
      </Routes>
    </Router>
  );
}
