import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook untuk memantau dan mengubah mode login (Admin vs Dosen) berdasarkan URL path.
 * Menghubungkan state internal dengan window.history pushState.
 */
export function useLoginState() {
  const location = useLocation();

  const [isAdmin, setIsAdmin] = useState(() => {
    return window.location.pathname === '/admin';
  });

  useEffect(() => {
    setIsAdmin(window.location.pathname === '/admin');
  }, [location.pathname]);

  const handleToggleMode = (toAdmin: boolean) => {
    setIsAdmin(toAdmin);
    window.history.pushState(null, '', toAdmin ? '/admin' : '/login');
  };

  return {
    isAdmin,
    handleToggleMode
  };
}
