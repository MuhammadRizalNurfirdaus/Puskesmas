import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Kunjungan, Pasien } from '../../types';
import { useAuthStore } from '../../stores/authStore';

const TransaksiForm = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [kunjunganList, setKunjunganList] = useState<Kunjungan[]>([]);
  const [currentPasien, setCurrentPasien] = useState<Pasien | null>(null);
  const [formData, setFormData] = useState({
    idKunjungan: '',
    metodePembayaran: 'tunai',
    diskon: 0,
    keterangan: ''
  });
  const [biayaDetail, setBiayaDetail] = useState({
    biayaPendaftaran: 10000,
    biayaPemeriksaan: 50000,
    biayaObat: 0,
    biayaTindakan: 0,
    total: 60000
  });

  useEffect(() => {
    if (user?.role === 'pasien') {
      fetchCurrentPasien();
    }
    fetchKunjungan();
  }, [user]);

  const fetchCurrentPasien = async () => {
    try {
      const response = await api.get('/pasien');
      // Cari pasien yang dibuat oleh user yang login
      const myPasien = response.data.find((p: Pasien) => p.createdBy?.idUser === user?.idUser);
      setCurrentPasien(myPasien || null);
    } catch (error) {
      console.error('Error fetching current pasien:', error);
    }
  };

  const fetchKunjungan = async () => {
    try {
      const response = await api.get('/kunjungan');
      let kunjunganSelesai = response.data.filter((k: Kunjungan) => 
        k.status === 'selesai' || k.status === 'farmasi'
      );

      // Filter untuk pasien - hanya tampilkan kunjungan sendiri
      if (user?.role === 'pasien' && currentPasien) {
        kunjunganSelesai = kunjunganSelesai.filter((k: Kunjungan) => 
          k.idPasien === currentPasien.idPasien
        );
      }

      setKunjunganList(kunjunganSelesai);
    } catch (error) {
      console.error('Error fetching kunjungan:', error);
    }
  };

  const handleKunjunganChange = async (idKunjungan: string) => {
    setFormData({ ...formData, idKunjungan });
    
    if (idKunjungan) {
      // TODO: Fetch detail biaya dari backend berdasarkan kunjungan
      // Untuk sementara gunakan nilai default
      const total = biayaDetail.biayaPendaftaran + biayaDetail.biayaPemeriksaan + biayaDetail.biayaObat + biayaDetail.biayaTindakan;
      setBiayaDetail({ ...biayaDetail, total });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.idKunjungan) {
      alert('Pilih kunjungan terlebih dahulu');
      return;
    }

    try {
      setLoading(true);
      await api.post('/transaksi', formData);
      alert('Transaksi berhasil dibuat');
      navigate('/transaksi');
    } catch (error: any) {
      console.error('Error creating transaksi:', error);
      alert(error.response?.data?.message || 'Gagal membuat transaksi');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const totalSetelahDiskon = biayaDetail.total - formData.diskon;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header dengan Gradient */}
      <div className="mb-6 bg-gradient-to-r from-green-600 to-green-800 rounded-xl shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Transaksi Pembayaran Baru
        </h1>
        <p className="text-green-100 mt-2 text-lg">Input data transaksi pembayaran pasien</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Data Kunjungan */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Data Kunjungan
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-1">
                <span className="text-red-500">*</span>
                Pilih Kunjungan
              </label>
              <select
                value={formData.idKunjungan}
                onChange={(e) => handleKunjunganChange(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              >
                <option value="">-- Pilih Kunjungan --</option>
                {kunjunganList.map((k) => (
                  <option key={k.idKunjungan} value={k.idKunjungan}>
                    {k.noKunjungan} - {k.pasien?.namaLengkap} ({new Date(k.tanggalKunjungan).toLocaleDateString('id-ID')})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Detail Biaya */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-500">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Detail Biaya
          </h2>
          
          <div className="space-y-4">
            <div className="flex justify-between py-4 border-b-2 border-gray-100 items-center">
              <span className="text-gray-700 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Biaya Pendaftaran
              </span>
              <span className="font-bold text-gray-800 text-lg">{formatCurrency(biayaDetail.biayaPendaftaran)}</span>
            </div>
            <div className="flex justify-between py-4 border-b-2 border-gray-100 items-center">
              <span className="text-gray-700 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Biaya Pemeriksaan
              </span>
              <span className="font-bold text-gray-800 text-lg">{formatCurrency(biayaDetail.biayaPemeriksaan)}</span>
            </div>
            <div className="flex justify-between py-4 border-b-2 border-gray-100 items-center">
              <span className="text-gray-700 flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                Biaya Obat
              </span>
              <span className="font-bold text-gray-800 text-lg">{formatCurrency(biayaDetail.biayaObat)}</span>
            </div>
            <div className="flex justify-between py-4 border-b-2 border-gray-100 items-center">
              <span className="text-gray-700 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Biaya Tindakan
              </span>
              <span className="font-bold text-gray-800 text-lg">{formatCurrency(biayaDetail.biayaTindakan)}</span>
            </div>
            <div className="flex justify-between py-4 border-b-2 border-gray-200 items-center">
              <span className="text-gray-700 font-semibold">Subtotal</span>
              <span className="font-bold text-gray-800 text-lg">{formatCurrency(biayaDetail.total)}</span>
            </div>
            
            <div className="pt-2">
              <label className="block text-sm font-bold text-gray-700 mb-3">
                💰 Diskon
              </label>
              <input
                type="number"
                min="0"
                value={formData.diskon}
                onChange={(e) => setFormData({ ...formData, diskon: Number(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex justify-between py-6 bg-gradient-to-r from-green-50 to-green-100 rounded-lg px-6 mt-4">
              <span className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Total Bayar
              </span>
              <span className="text-3xl font-bold text-green-600">{formatCurrency(totalSetelahDiskon)}</span>
            </div>
          </div>
        </div>

        {/* Data Pembayaran */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-yellow-500">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Data Pembayaran
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-1">
                <span className="text-red-500">*</span>
                Metode Pembayaran
              </label>
              <select
                value={formData.metodePembayaran}
                onChange={(e) => setFormData({ ...formData, metodePembayaran: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                required
              >
                <option value="tunai">💵 Tunai</option>
                <option value="transfer">🏦 Transfer Bank</option>
                <option value="debit">💳 Kartu Debit</option>
                <option value="bpjs">🏥 BPJS</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                📝 Keterangan
              </label>
              <textarea
                value={formData.keterangan}
                onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                placeholder="Catatan tambahan..."
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pb-6">
          <button
            type="button"
            onClick={() => navigate('/transaksi')}
            className="px-8 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {loading ? 'Menyimpan...' : 'Simpan Transaksi'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransaksiForm;
