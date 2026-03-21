/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import DocumentVault from './pages/DocumentVault';
import AdminVerification from './pages/AdminVerification';
import AdminLecturers from './pages/AdminLecturers';
import AdminLecturerProfile from './pages/AdminLecturerProfile';
import AdminSync from './pages/AdminSync';
import AdminAllDocuments from './pages/AdminAllDocuments';

import Home from './pages/Home';

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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        
        <Route element={<Layout user={user} setUser={setUser} />}>
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/documents" element={user?.role === 'dosen' ? <DocumentVault user={user} /> : <Navigate to="/dashboard" />} />
          <Route path="/admin/documents/all" element={user?.role === 'admin' ? <AdminAllDocuments /> : <Navigate to="/dashboard" />} />
          <Route path="/admin/verify" element={user?.role === 'admin' ? <AdminVerification /> : <Navigate to="/dashboard" />} />
          <Route path="/admin/lecturers" element={user?.role === 'admin' ? <AdminLecturers /> : <Navigate to="/dashboard" />} />
          <Route path="/admin/lecturers/:id" element={user?.role === 'admin' ? <AdminLecturerProfile /> : <Navigate to="/dashboard" />} />
          <Route path="/admin/sync" element={user?.role === 'admin' ? <AdminSync /> : <Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </Router>
  );
}
