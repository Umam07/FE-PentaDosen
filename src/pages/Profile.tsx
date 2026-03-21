import { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

export default function Profile({ user, setUser }: { user: any, setUser: any }) {
  const [scholarId, setScholarId] = useState(user.scholar_id || '');
  const [scholarData, setScholarData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [checkingInfo, setCheckingInfo] = useState(false);
  const [checkedAuthor, setCheckedAuthor] = useState<any>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/users/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setScholarData(data.scholarData);
          setScholarId(data.user.scholar_id || '');
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [user.id]);

  const handleCheckId = async () => {
    if (!scholarId) {
      setMessage('Please enter a Google Scholar ID first.');
      return;
    }
    try {
      setCheckingInfo(true);
      setMessage('');
      setCheckedAuthor(null);
      const res = await fetch(`/api/scholar/check/${scholarId}`);
      if (res.ok) {
        const data = await res.json();
        setCheckedAuthor(data);
        setMessage('Author found! Please verify and save.');
      } else {
        const errData = await res.json();
        setMessage(`Error: ${errData.error || 'Author not found'}`);
      }
    } catch (err) {
      setMessage('Failed to check Scholar ID.');
    } finally {
      setCheckingInfo(false);
    }
  };

  const handleSaveScholarId = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/users/${user.id}/scholar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scholar_id: scholarId }),
      });
      if (res.ok) {
        setMessage('Scholar ID saved successfully.');
        setUser({ ...user, scholar_id: scholarId });
        setCheckedAuthor(null);
      }
    } catch (err) {
      setMessage('Failed to save Scholar ID.');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (!scholarId) {
      setMessage('Please save your Google Scholar ID first.');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`/api/users/${user.id}/sync`, {
        method: 'POST',
      });
      if (res.ok) {
        setMessage('Data synced successfully.');
        // Refresh profile data
        const profileRes = await fetch(`/api/users/${user.id}`);
        const data = await profileRes.json();
        setScholarData(data.scholarData);
        setUser(data.user); // Update user points in context
      } else {
        setMessage('Failed to sync data.');
      }
    } catch (err) {
      setMessage('Error syncing data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">Profil Dosen</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
            <div>
              <label className="block text-sm font-medium text-gray-500">Nama Lengkap</label>
              <div className="mt-1 text-sm text-gray-900 font-medium">{user.name}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Email</label>
              <div className="mt-1 text-sm text-gray-900">{user.email}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Fakultas</label>
              <div className="mt-1 text-sm text-gray-900">{user.fakultas || '-'}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Program Studi</label>
              <div className="mt-1 text-sm text-gray-900">{user.program_studi || '-'}</div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-500">Total KPI Points</label>
              <div className="mt-1 text-lg font-bold text-primary-600 font-mono">{user.total_kpi_points || 0}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Integrasi Google Scholar</h3>
          {message && (
            <span className="text-sm text-emerald-600 flex items-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              {message}
            </span>
          )}
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label htmlFor="scholarId" className="block text-sm font-medium text-gray-700">
              Google Scholar ID
            </label>
            <div className="mt-2 flex rounded-md shadow-sm">
              <input
                type="text"
                name="scholarId"
                id="scholarId"
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="e.g. xxxxxxxAAAAJ"
                value={scholarId}
                onChange={(e) => {
                  setScholarId(e.target.value);
                  setCheckedAuthor(null);
                }}
              />
              <button
                type="button"
                onClick={handleCheckId}
                disabled={checkingInfo || !scholarId}
                className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
              >
                {checkingInfo ? 'Checking...' : 'Cek ID'}
              </button>
              <button
                type="button"
                onClick={handleSaveScholarId}
                disabled={loading || !scholarId || (scholarId !== user.scholar_id && !checkedAuthor)}
                className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-primary-600 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
              >
                Simpan
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              ID dapat ditemukan pada URL profil Google Scholar Anda (parameter user=...). Jika ID berubah, klik 'Cek ID' sebelum menyimpan.
            </p>
          </div>

          {checkedAuthor && (
            <div className="mt-4 p-4 border border-primary-100 bg-primary-50 rounded-lg flex items-start space-x-4">
              {checkedAuthor.thumbnail && (
                <img src={checkedAuthor.thumbnail} alt={checkedAuthor.name} className="w-16 h-16 rounded-full border border-gray-200" />
              )}
              <div>
                <h4 className="text-lg font-bold text-gray-900">{checkedAuthor.name}</h4>
                <p className="text-sm text-gray-600">{checkedAuthor.affiliations}</p>
                <p className="text-xs text-primary-600 mt-2 font-medium">Apakah profil ini benar? Jika ya, silakan klik Simpan.</p>
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-gray-900">Statistik Sitasi</h4>
              <button
                onClick={handleSync}
                disabled={loading || !scholarId}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Sync Data Scholar
              </button>
            </div>

            {scholarData ? (
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <p className="text-sm font-medium text-gray-500">Total Sitasi</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 font-mono">{scholarData.total_citations}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <p className="text-sm font-medium text-gray-500">H-Index</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 font-mono">{scholarData.h_index}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <p className="text-sm font-medium text-gray-500">i10-Index</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 font-mono">{scholarData.i10_index}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-100 border-dashed">
                <AlertCircle className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Belum ada data sitasi. Silakan sinkronisasi data.</p>
              </div>
            )}
            {scholarData && (
              <p className="mt-4 text-xs text-gray-400 text-right">
                Terakhir disinkronkan: {new Date(scholarData.last_synced).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
