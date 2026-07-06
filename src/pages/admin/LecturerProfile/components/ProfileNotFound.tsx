import React from 'react';
import { User } from 'lucide-react';
import { ProfileNotFoundProps } from '../types/lecturerProfile.types';

export default function ProfileNotFound({
  onBack
}: ProfileNotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <User className="h-16 w-16 text-gray-300 dark:text-zinc-700 mb-4" />
      <h2 className="text-xl font-semibold text-gray-700 dark:text-zinc-300">User tidak ditemukan</h2>
      <button onClick={onBack} className="mt-4 text-primary-600 hover:underline">Kembali ke Daftar</button>
    </div>
  );
}
