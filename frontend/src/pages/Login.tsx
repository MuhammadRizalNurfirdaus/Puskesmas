import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="md:flex">
            {/* Left Section - Branding */}
            <div className="md:w-1/2 bg-gradient-to-br from-brand-700 to-brand-900 p-12 text-white flex flex-col justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="w-12 h-12 text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold mb-3">Puskesmas</h1>
                <p className="text-white/80 mb-8">Sistem Informasi Manajemen</p>
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Manajemen Pasien Terintegrasi</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Rekam Medis Digital</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Transaksi Pembayaran Otomatis</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Login Form */}
            <div className="md:w-1/2 p-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Selamat Datang!</h2>
              <p className="text-gray-600 mb-8">Silakan login untuk melanjutkan</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="label">Username</label>
                  <input
                    type="text"
                    className="input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Masukkan username"
                  />
                </div>
                
                <div>
                  <label className="label">Password</label>
                  <input
                    type="password"
                    className="input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Masukkan password"
                  />
                </div>
                
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <p className="text-red-700">{error}</p>
                  </div>
                )}
                
                <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                  {loading ? 'Memproses…' : 'Login'}
                </button>
              </form>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Akun Demo:</span>
                </p>
                <div className="space-y-2 text-sm">
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-brand-300 transition-colors">
                    <div className="font-semibold text-gray-800 flex items-center gap-2">
                      <svg className="w-4 h-4 text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Admin: <span className="text-brand-700">admin / admin123</span></span>
                    </div>
                    <div className="text-gray-600 text-xs mt-1">Kelola User, Backup Data, Kelola Resep</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-brand-300 transition-colors">
                    <div className="font-semibold text-gray-800 flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Pasien: <span className="text-brand-700">pasien / pasien123</span></span>
                    </div>
                    <div className="text-gray-600 text-xs mt-1">Lihat Antrian, Pembayaran</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-brand-300 transition-colors">
                    <div className="font-semibold text-gray-800 flex items-center gap-2">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                      <span>Pendaftaran: <span className="text-brand-700">pendaftaran / pendaftaran123</span></span>
                    </div>
                    <div className="text-gray-600 text-xs mt-1">Kelola Data Pasien</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-brand-300 transition-colors">
                    <div className="font-semibold text-gray-800 flex items-center gap-2">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>Dokter: <span className="text-brand-700">dokter / dokter123</span></span>
                    </div>
                    <div className="text-gray-600 text-xs mt-1">Pemeriksaan Medis, Rekam Medis</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-brand-300 transition-colors">
                    <div className="font-semibold text-gray-800 flex items-center gap-2">
                      <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                      <span>Apoteker: <span className="text-brand-700">apoteker / apoteker123</span></span>
                    </div>
                    <div className="text-gray-600 text-xs mt-1">Serahkan Obat, Kelola Stok</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-brand-300 transition-colors">
                    <div className="font-semibold text-gray-800 flex items-center gap-2">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      <span>Kepala: <span className="text-brand-700">kepala / kepala123</span></span>
                    </div>
                    <div className="text-gray-600 text-xs mt-1">Statistik, Verifikasi Pembayaran</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
