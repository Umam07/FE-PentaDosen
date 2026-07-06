import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { User } from '../types/auth.types';

/**
 * Hook untuk mengelola form login Administrator.
 * Melakukan verifikasi peran (hanya mengizinkan akun dengan hak akses admin).
 */
export function useAdminLogin(setUser: (user: User) => void) {
  const navigate = useNavigate();

  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);

  const handleSelectAdminShortcut = (email: string) => {
    setAdminUsername(email);
    setAdminPassword('password');
    setAdminError('');
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setAdminLoading(true);
    try {
      const data = await authService.login(adminUsername, adminPassword);
      const role = data.user.role;
      const isAdminUser = ['super admin', 'admin lppm', 'admin fakultas', 'reviewer'].includes(role);

      if (isAdminUser) {
        setUser(data.user);
        navigate('/dashboard');
      } else {
        // Melakukan logout diam-diam jika akun non-admin mencoba login di portal admin
        await authService.logout(data.user.id);
        setAdminError(
          'Akses Ditolak: Kredensial Anda terdaftar sebagai Dosen/Staf biasa, bukan Administrator.'
        );
      }
    } catch (err: any) {
      // Menyesuaikan dengan pesan kesalahan aslinya
      setAdminError(err.message || 'Terjadi kesalahan sistem saat menghubungi server.');
    } finally {
      setAdminLoading(false);
    }
  };

  return {
    adminUsername,
    setAdminUsername,
    adminPassword,
    setAdminPassword,
    adminError,
    setAdminError,
    showAdminPassword,
    setShowAdminPassword,
    adminLoading,
    handleAdminLogin,
    handleSelectAdminShortcut,
  };
}
