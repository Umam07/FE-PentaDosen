import React from 'react';
import Login from './Login';

export default function AdminLogin({ setUser }: { setUser: any }) {
  return <Login setUser={setUser} />;
}
