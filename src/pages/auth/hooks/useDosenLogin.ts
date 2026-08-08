import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { User } from '../types/auth.types';

/**
 * Hook untuk mengelola form login Dosen (Lembaga Dosen/Staf biasa).
 * Melakukan verifikasi peran (tidak boleh memiliki akses administrator).
 */
export function useDosenLogin(setUser: (user: User) => void) {
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [dosenError, setDosenError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSelectDosenShortcut = (email: string) => {
    setUsername(email);
    setPassword('password');
    setDosenError('');
  };

  const handleDosenLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setDosenError('');
    setLoading(true);
    try {
      const data = await authService.login(username, password);
      setUser(data.user);
      navigate('/dashboard');
    } catch (err: any) {
      // Menyesuaikan dengan pesan kesalahan aslinya
      if (err.message === 'Username atau password salah') {
        setDosenError('Username atau password salah');
      } else {
        setDosenError('Terjadi kesalahan saat menghubungi server.');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    dosenError,
    setDosenError,
    showPassword,
    setShowPassword,
    loading,
    handleDosenLogin,
    handleSelectDosenShortcut,
  };
}
