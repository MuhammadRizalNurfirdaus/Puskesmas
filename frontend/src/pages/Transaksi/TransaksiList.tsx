import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Transaksi } from '../../types';
import { useAuthStore } from '../../stores/authStore';

const TransaksiList = () => {
  const { user } = useAuthStore();
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: '',
    search: ''
  });

  useEffect(() => {
    fetchTransaksi();
  }, []);

  const fetchTransaksi = async () => {
    try {
      setLoading(true);
      const response = await api.get('/transaksi');
      setTransaksi(response.data);
    } catch (error) {
      console.error('Error fetching transaksi:', error);
      alert('Gagal memuat data transaksi');
    } finally {
      setLoading(false);
    }
  };

  const filteredTransaksi = transaksi.filter(t => {
    const matchStatus = !filter.status || t.statusPembayaran === filter.status;
    const matchSearch = !filter.search || 
      t.noTransaksi.toLowerCase().includes(filter.search.toLowerCase()) ||
      t.pasien?.namaLengkap.toLowerCase().includes(filter.search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      lunas: 'bg-green-100 text-green-800',
      dibatalkan: 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getVerifikasiBadge = (status: string) => {
    const badges: { [key: string]: string } = {
      belum_verifikasi: 'bg-gray-100 text-gray-800',
      terverifikasi: 'bg-green-100 text-green-800',
      ditolak: 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Memuat data...</div>
      </div>
    );
  }

  const getPageTitle = () => {
    switch (user?.role) {
      case 'pasien':
        return { title: 'Riwayat Pembayaran Saya', subtitle: 'Lihat riwayat pembayaran kunjungan Anda' };
      case 'kepala_puskesmas':
        return { title: 'Verifikasi Pembayaran', subtitle: 'Kelola verifikasi transaksi pembayaran' };
      case 'dokter':
      case 'apoteker':
        return { title: 'Riwayat Pembayaran Pasien', subtitle: 'Lihat riwayat pembayaran pasien' };
      default:
        return { title: 'Transaksi Pembayaran', subtitle: 'Kelola transaksi dan pembayaran pasien' };
    }
  };

  const canCreateTransaction = user?.role === 'admin' || user?.role === 'pendaftaran' || user?.role === 'pasien';
  const pageInfo = getPageTitle();

  return (
    <div className="space-y-6">
      {/* Header Section dengan Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {pageInfo.title}
            </h1>
            <p className="text-blue-100 mt-2 text-lg">{pageInfo.subtitle}</p>
          </div>
          {canCreateTransaction && (
            <Link
              to="/transaksi/tambah"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Transaksi Baru
            </Link>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Transaksi</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{filteredTransaksi.length}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Lunas</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {transaksi.filter(t => t.statusPembayaran === 'lunas').length}
              </p>
            </div>
            <div className="bg-blue-100 p-4 rounded-full">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Menunggu</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {transaksi.filter(t => t.statusVerifikasi === 'menunggu').length}
              </p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-full">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section dengan Style Lebih Baik */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filter & Pencarian
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🔍 Cari Transaksi
            </label>
            <input
              type="text"
              placeholder="Cari No. Transaksi atau Nama Pasien..."
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📊 Status Pembayaran
            </label>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Semua Status</option>
              <option value="pending">⏳ Pending</option>
              <option value="lunas">✅ Lunas</option>
              <option value="dibatalkan">❌ Dibatalkan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table dengan Design Modern */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  No. Transaksi
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Pasien
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Total Biaya
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Metode
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Verifikasi
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransaksi.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-gray-500 font-medium">Tidak ada data transaksi</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransaksi.map((t) => (
                  <tr key={t.idTransaksi} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-blue-600">{t.noTransaksi}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(t.tanggalTransaksi).toLocaleDateString('id-ID', { 
                          day: '2-digit', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(t.tanggalTransaksi).toLocaleTimeString('id-ID', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold">
                            {t.pasien?.namaLengkap?.charAt(0) || '?'}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {t.pasien?.namaLengkap}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-green-600">
                        {formatCurrency(t.totalBiaya)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-700 uppercase">
                        {t.metodePembayaran === 'tunai' && '💵'}
                        {t.metodePembayaran === 'transfer' && '🏦'}
                        {t.metodePembayaran === 'debit' && '💳'}
                        {t.metodePembayaran === 'bpjs' && '🏥'}
                        {' '}{t.metodePembayaran}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${getStatusBadge(t.statusPembayaran)}`}>
                        {t.statusPembayaran === 'lunas' && '✓ '}
                        {t.statusPembayaran === 'pending' && '⏳ '}
                        {t.statusPembayaran === 'dibatalkan' && '✗ '}
                        {t.statusPembayaran.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${getVerifikasiBadge(t.statusVerifikasi)}`}>
                        {t.statusVerifikasi === 'disetujui' && '✓ '}
                        {t.statusVerifikasi === 'menunggu' && '⏳ '}
                        {t.statusVerifikasi === 'ditolak' && '✗ '}
                        {t.statusVerifikasi.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/transaksi/${t.idTransaksi}`}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-900 font-semibold"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransaksiList;
