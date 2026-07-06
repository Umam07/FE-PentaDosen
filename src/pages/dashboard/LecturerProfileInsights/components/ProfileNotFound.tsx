import Navbar from '../../../../components/Home/Navbar';

interface ProfileNotFoundProps {
  onBack: () => void;
}

export default function ProfileNotFound({ onBack }: ProfileNotFoundProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center font-mono">
      <Navbar />
      <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">Dosen Tidak Ditemukan</p>
      <button onClick={onBack} className="mt-4 text-primary-600 font-bold hover:underline">Kembali</button>
    </div>
  );
}
