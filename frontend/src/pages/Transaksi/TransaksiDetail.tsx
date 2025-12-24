import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Transaksi } from '../../types';
import { useAuthStore } from '../../stores/authStore';

const TransaksiDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [transaksi, setTransaksi] = useState<Transaksi | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifikasiLoading, setVerifikasiLoading] = useState(false);
  const [catatan, setCatatan] = useState('');

  useEffect(() => {
    fetchTransaksi();
  }, [id]);

  const fetchTransaksi = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/transaksi/${id}`);
      setTransaksi(response.data);
    } catch (error) {
      console.error('Error fetching transaksi:', error);
      alert('Gagal memuat data transaksi');
      navigate('/transaksi');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifikasi = async (status: 'disetujui' | 'ditolak') => {
    if (!catatan && status === 'ditolak') {
      alert('Silakan masukkan catatan penolakan');
      return;
    }

    const confirmed = confirm(
      status === 'disetujui' 
        ? 'Apakah Anda yakin ingin menyetujui pembayaran ini?' 
        : 'Apakah Anda yakin ingin menolak pembayaran ini?'
    );

    if (!confirmed) return;

    try {
      setVerifikasiLoading(true);
      await api.patch(`/transaksi/${id}/verifikasi`, {
        statusVerifikasi: status,
        catatanVerifikasi: catatan || undefined
      });
      alert(`Pembayaran berhasil ${status === 'disetujui' ? 'disetujui' : 'ditolak'}`);
      fetchTransaksi();
      setCatatan('');
    } catch (error: any) {
      console.error('Error verifikasi transaksi:', error);
      alert(error.response?.data?.message || 'Gagal memverifikasi transaksi');
    } finally {
      setVerifikasiLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDateTime = (date: Date | string) => {
    return new Date(date).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { bg: string; text: string } } = {
      'lunas': { bg: 'bg-green-100', text: 'text-green-800' },
      'belum_dibayar': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      'dibatalkan': { bg: 'bg-red-100', text: 'text-red-800' }
    };
    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800' };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const getVerifikasiBadge = (status: string) => {
    const statusConfig: { [key: string]: { bg: string; text: string } } = {
      'menunggu': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      'disetujui': { bg: 'bg-green-100', text: 'text-green-800' },
      'ditolak': { bg: 'bg-red-100', text: 'text-red-800' }
    };
    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800' };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Memuat data...</div>
      </div>
    );
  }

  if (!transaksi) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Data transaksi tidak ditemukan</div>
      </div>
    );
  }

  const isKepalaPuskesmas = user?.role === 'kepala_puskesmas';
  const canVerify = isKepalaPuskesmas && transaksi.statusVerifikasi === 'menunggu';

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header dengan Gradient */}
      <div className="mb-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Detail Transaksi
            </h1>
            <p className="text-blue-100 mt-2">Informasi lengkap transaksi pembayaran</p>
          </div>
          <button
            onClick={() => navigate('/transaksi')}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali
          </button>
        </div>
      </div>

      {/* Header Transaksi dengan Card Modern */}
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg p-8 mb-6 border-l-4 border-blue-500">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-800">{transaksi.noTransaksi}</h2>
            </div>
            <p className="text-gray-600 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDateTime(transaksi.tanggalTransaksi)}
            </p>
          </div>
          <div className="text-right space-y-2">
            {getStatusBadge(transaksi.statusPembayaran)}
            {getVerifikasiBadge(transaksi.statusVerifikasi)}
          </div>
        </div>
      </div>

      {/* Data Pasien & Kunjungan - Card dengan Icon */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-t-4 border-green-500">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Data Pasien & Kunjungan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">No. Rekam Medis</p>
            <p className="font-bold text-gray-800 text-lg">{transaksi.pasien?.noRekamMedis || '-'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Nama Pasien</p>
            <p className="font-bold text-gray-800 text-lg">{transaksi.pasien?.namaLengkap || '-'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">No. Kunjungan</p>
            <p className="font-bold text-gray-800 text-lg">{transaksi.kunjungan?.noKunjungan || '-'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Tanggal Kunjungan</p>
            <p className="font-bold text-gray-800 text-lg">
              {transaksi.kunjungan?.tanggalKunjungan 
                ? new Date(transaksi.kunjungan.tanggalKunjungan).toLocaleDateString('id-ID')
                : '-'
              }
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Jenis Kunjungan</p>
            <p className="font-bold text-gray-800 text-lg capitalize">{transaksi.kunjungan?.jenisKunjungan || '-'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Keluhan</p>
            <p className="font-bold text-gray-800 text-lg">{transaksi.kunjungan?.keluhan || '-'}</p>
          </div>
        </div>
      </div>

      {/* Detail Biaya - Card dengan Shadow Modern */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-t-4 border-purple-500">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Rincian Biaya
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between py-4 border-b-2 border-gray-100 items-center">
            <span className="text-gray-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Biaya Pendaftaran
            </span>
            <span className="font-bold text-gray-800 text-lg">{formatCurrency(transaksi.biayaPendaftaran)}</span>
          </div>
          <div className="flex justify-between py-4 border-b-2 border-gray-100 items-center">
            <span className="text-gray-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Biaya Pemeriksaan
            </span>
            <span className="font-bold text-gray-800 text-lg">{formatCurrency(transaksi.biayaPemeriksaan)}</span>
          </div>
          <div className="flex justify-between py-4 border-b-2 border-gray-100 items-center">
            <span className="text-gray-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              Biaya Obat
            </span>
            <span className="font-bold text-gray-800 text-lg">{formatCurrency(transaksi.biayaObat)}</span>
          </div>
          <div className="flex justify-between py-4 border-b-2 border-gray-100 items-center">
            <span className="text-gray-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Biaya Tindakan
            </span>
            <span className="font-bold text-gray-800 text-lg">{formatCurrency(transaksi.biayaTindakan)}</span>
          </div>
          <div className="flex justify-between py-4 border-b-2 border-gray-200 items-center">
            <span className="text-gray-700 font-semibold">Subtotal</span>
            <span className="font-bold text-gray-800 text-lg">{formatCurrency(transaksi.totalBiaya + transaksi.diskon)}</span>
          </div>
          {transaksi.diskon > 0 && (
            <div className="flex justify-between py-4 border-b-2 border-gray-200 text-red-600 items-center">
              <span className="font-semibold">Diskon</span>
              <span className="font-bold text-lg">- {formatCurrency(transaksi.diskon)}</span>
            </div>
          )}
          <div className="flex justify-between py-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg px-6 mt-4">
            <span className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Total Pembayaran
            </span>
            <span className="text-3xl font-bold text-blue-600">{formatCurrency(transaksi.totalBiaya)}</span>
          </div>
        </div>
      </div>

      {/* Info Pembayaran */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-t-4 border-yellow-500">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Informasi Pembayaran
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Metode Pembayaran</p>
            <p className="font-bold text-gray-800 text-lg capitalize">
              {transaksi.metodePembayaran === 'tunai' && '💵 '}
              {transaksi.metodePembayaran === 'transfer' && '🏦 '}
              {transaksi.metodePembayaran === 'debit' && '💳 '}
              {transaksi.metodePembayaran === 'bpjs' && '🏥 '}
              {transaksi.metodePembayaran}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Kasir</p>
            <p className="font-bold text-gray-800 text-lg">{transaksi.kasir?.namaLengkap || '-'}</p>
          </div>
          {transaksi.keterangan && (
            <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Keterangan</p>
              <p className="font-bold text-gray-800 text-lg">{transaksi.keterangan}</p>
            </div>
          )}
        </div>
      </div>

      {/* Info Verifikasi */}
      {(transaksi.statusVerifikasi !== 'menunggu' || transaksi.catatanVerifikasi) && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-t-4 border-indigo-500">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Informasi Verifikasi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {transaksi.verifikator && (
              <>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Verifikator</p>
                  <p className="font-bold text-gray-800 text-lg">{transaksi.verifikator.namaLengkap}</p>
                </div>
                {transaksi.tanggalVerifikasi && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Tanggal Verifikasi</p>
                    <p className="font-bold text-gray-800 text-lg">{formatDateTime(transaksi.tanggalVerifikasi)}</p>
                  </div>
                )}
              </>
            )}
            {transaksi.catatanVerifikasi && (
              <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Catatan Verifikasi</p>
                <p className="font-bold text-gray-800 text-lg">{transaksi.catatanVerifikasi}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Form Verifikasi - Hanya untuk Kepala Puskesmas */}
      {canVerify && (
        <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl shadow-lg p-6 border-t-4 border-orange-500">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Verifikasi Pembayaran
          </h2>
          
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-3">
              📝 Catatan Verifikasi
            </label>
            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="Masukkan catatan verifikasi (opsional untuk persetujuan, wajib untuk penolakan)..."
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={() => handleVerifikasi('ditolak')}
              disabled={verifikasiLoading}
              className="px-8 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {verifikasiLoading ? 'Memproses...' : 'Tolak'}
            </button>
            <button
              onClick={() => handleVerifikasi('disetujui')}
              disabled={verifikasiLoading}
              className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {verifikasiLoading ? 'Memproses...' : 'Setujui'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransaksiDetail;
