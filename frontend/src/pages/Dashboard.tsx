import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { DashboardData, UserRole } from '../types';
import { useAuthStore } from '../stores/authStore';

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/laporan/dashboard');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: 'Admin Sistem',
      pasien: 'Pasien',
      pendaftaran: 'Petugas Pendaftaran',
      dokter: 'Dokter',
      apoteker: 'Apoteker',
      kepala_puskesmas: 'Kepala Puskesmas'
    };
    return labels[role] || role;
  };

  const renderQuickActions = () => {
    const buttonClass = "flex items-center gap-3 p-4 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white rounded-xl shadow-sm ring-1 ring-black/5 hover:shadow-md transition-all duration-200 font-semibold";
    
    switch (user?.role) {
      case UserRole.ADMIN:
        return (
          <>
            <Link to="/pasien" className={buttonClass}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Kelola User</span>
            </Link>
            <Link to="/obat" className={buttonClass}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Kelola Obat</span>
            </Link>
            <Link to="/laporan" className={buttonClass}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Backup Data</span>
            </Link>
            <Link to="/resep" className={buttonClass}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Kelola Resep</span>
            </Link>
          </>
        );
      
      case UserRole.PASIEN:
        return (
          <>
            <Link to="/antrian" className={buttonClass}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>Lihat Antrian</span>
            </Link>
            <Link to="/kunjungan" className={buttonClass}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Riwayat Pembayaran</span>
            </Link>
          </>
        );
      
      case UserRole.PENDAFTARAN:
        return (
          <>
            <Link to="/pasien" className={buttonClass}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Kelola Data Pasien</span>
            </Link>
            <Link to="/pasien/tambah" className={buttonClass}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span>Tambah Pasien</span>
            </Link>
            <Link to="/kunjungan/tambah" className={buttonClass}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span>Daftar Kunjungan</span>
            </Link>
          </>
        );
      
      case UserRole.DOKTER:
        return (
          <>
            <Link to="/kunjungan" className={buttonClass}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Pemeriksaan Medis</span>
            </Link>
            <Link to="/rekam-medis" className={buttonClass}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Rekam Medis</span>
            </Link>
            <Link to="/resep" className={buttonClass}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span>Buat Resep Obat</span>
            </Link>
          </>
        );
      
      case UserRole.APOTEKER:
        return (
          <>
            <Link to="/resep" className={buttonClass}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span>Serahkan Obat</span>
            </Link>
            <Link to="/obat" className={buttonClass}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>Kelola Stok Obat</span>
            </Link>
          </>
        );
      
      case UserRole.KEPALA_PUSKESMAS:
        return (
          <>
            <Link to="/laporan" className={buttonClass}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Statistik Pelayanan</span>
            </Link>
            <Link to="/transaksi" className={buttonClass}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Verifikasi Pembayaran</span>
            </Link>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/60 p-8 border-l-8 border-brand-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-brand-700 rounded-2xl flex items-center justify-center shadow-sm ring-1 ring-black/5">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">Selamat Datang, {user?.namaLengkap}</h1>
              <p className="text-brand-700 text-lg mt-1 font-bold">{getRoleLabel(user?.role || '')}</p>
            </div>
          </div>
          <div className="text-right bg-brand-50 px-6 py-3 rounded-xl ring-1 ring-brand-100">
            <p className="text-sm text-gray-600 font-semibold">Sistem Informasi</p>
            <p className="text-2xl font-black text-brand-800">Puskesmas</p>
          </div>
        </div>
      </div>

      {/* Stats Cards - Hide for Pasien */}
      {(user?.role !== UserRole.PASIEN) && data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl shadow-sm ring-1 ring-black/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-bold mb-2 uppercase">Kunjungan Hari Ini</p>
                <p className="text-5xl font-black text-white">{data.kunjunganHariIni}</p>
              </div>
                <div className="bg-white bg-opacity-30 p-3 rounded-xl">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl shadow-sm ring-1 ring-black/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-bold mb-2 uppercase">Total Pasien</p>
                <p className="text-5xl font-black text-white">{data.totalPasien}</p>
              </div>
              <div className="bg-white bg-opacity-30 p-4 rounded-xl">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-600 to-amber-800 rounded-2xl shadow-sm ring-1 ring-black/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-bold mb-2 uppercase">Resep Pending</p>
                <p className="text-5xl font-black text-white">{data.resepPending}</p>
              </div>
              <div className="bg-white bg-opacity-30 p-4 rounded-xl">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-rose-600 to-rose-800 rounded-2xl shadow-sm ring-1 ring-black/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-bold mb-2 uppercase">Stok Obat Rendah</p>
                <p className="text-5xl font-black text-white">{data.obatStokRendah}</p>
              </div>
              <div className="bg-white bg-opacity-30 p-4 rounded-xl">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Financial Stats - Show for specific roles */}
      {(user?.role === UserRole.KEPALA_PUSKESMAS || user?.role === UserRole.ADMIN) && data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-sm ring-1 ring-black/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-bold mb-2 uppercase">Total Pembayaran Lunas</p>
                <p className="text-4xl font-black text-white">
                  Rp {(data.totalPembayaran || 0).toLocaleString('id-ID')}
                </p>
                <p className="text-white/80 text-xs mt-2">Pendapatan terkonfirmasi</p>
              </div>
              <div className="bg-white bg-opacity-30 p-4 rounded-xl">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl shadow-sm ring-1 ring-black/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-bold mb-2 uppercase">Menunggu Verifikasi</p>
                <p className="text-4xl font-black text-white">
                  Rp {(data.pembayaranMenunggu || 0).toLocaleString('id-ID')}
                </p>
                <p className="text-white/80 text-xs mt-2">{data.jumlahMenungguVerifikasi || 0} transaksi pending</p>
              </div>
              <div className="bg-white bg-opacity-30 p-4 rounded-xl">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/60 p-6 border-t-4 border-brand-600">
        <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
          <svg className="w-7 h-7 text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Menu Akses Cepat
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderQuickActions()}
        </div>
      </div>
    </div>
  );
}
