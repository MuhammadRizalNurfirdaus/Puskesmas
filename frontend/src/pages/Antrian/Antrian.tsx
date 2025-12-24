import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Kunjungan } from '../../types';

export default function Antrian() {
  const [kunjunganList, setKunjunganList] = useState<Kunjungan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKunjungan();
    // Auto refresh setiap 30 detik
    const interval = setInterval(fetchKunjungan, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchKunjungan = async () => {
    try {
      const response = await api.get('/kunjungan');
      // Filter hanya kunjungan hari ini
      const today = new Date().toISOString().split('T')[0];
      const todayVisits = response.data.filter((k: Kunjungan) => 
        k.tanggalKunjungan.startsWith(today)
      );
      setKunjunganList(todayVisits);
    } catch (error) {
      console.error('Error fetching kunjungan:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      terdaftar: 'from-yellow-500 to-yellow-600',
      pemeriksaan: 'from-blue-500 to-blue-600',
      farmasi: 'from-purple-500 to-purple-600',
      selesai: 'from-green-500 to-green-600',
      batal: 'from-red-500 to-red-600'
    };
    return colors[status] || 'from-gray-500 to-gray-600';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      terdaftar: 'Terdaftar',
      pemeriksaan: 'Pemeriksaan',
      farmasi: 'Farmasi',
      selesai: 'Selesai',
      batal: 'Batal'
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      terdaftar: '⏳',
      pemeriksaan: '🩺',
      farmasi: '💊',
      selesai: '✅',
      batal: '❌'
    };
    return icons[status] || '📋';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <span className="text-4xl">🎫</span>
              Antrian Kunjungan Hari Ini
            </h1>
            <p className="text-blue-100 mt-2 text-lg">
              {new Date().toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <button 
            onClick={fetchKunjungan} 
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Total Antrian: {kunjunganList.length}</h3>
            <p className="text-gray-600 mt-1">Data diperbarui otomatis setiap 30 detik</p>
          </div>
          <div className="text-4xl">📊</div>
        </div>
      </div>

      {/* Antrian List */}
      {kunjunganList.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-xl text-gray-500 font-medium">Tidak ada antrian hari ini</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {kunjunganList.map((kunjungan, index) => (
            <div 
              key={kunjungan.idKunjungan} 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-stretch">
                {/* Nomor Antrian */}
                <div className={`bg-gradient-to-br ${getStatusColor(kunjungan.status)} w-24 flex items-center justify-center`}>
                  <div className="text-center text-white">
                    <div className="text-4xl font-bold">{index + 1}</div>
                    <div className="text-xs mt-1">Antrian</div>
                  </div>
                </div>
                
                {/* Info Pasien */}
                <div className="flex-1 p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{kunjungan.pasien.namaLengkap}</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700">No. Kunjungan:</span>
                      <span className="text-gray-600">{kunjungan.noKunjungan}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700">No. Rekam Medis:</span>
                      <span className="text-gray-600">{kunjungan.pasien.noRekamMedis}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700">Jam Kunjungan:</span>
                      <span className="text-gray-600">{kunjungan.jamKunjungan}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700">Jenis:</span>
                      <span className="text-gray-600 capitalize">{kunjungan.jenisKunjungan.replace('_', ' ')}</span>
                    </div>
                    {kunjungan.keluhan && (
                      <div className="col-span-2 flex items-start gap-2">
                        <span className="font-semibold text-gray-700">Keluhan:</span>
                        <span className="text-gray-600">{kunjungan.keluhan}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Status */}
                <div className="w-48 flex items-center justify-center p-6 bg-gray-50">
                  <div className="text-center">
                    <div className="text-4xl mb-2">{getStatusIcon(kunjungan.status)}</div>
                    <div className={`px-4 py-2 bg-gradient-to-r ${getStatusColor(kunjungan.status)} text-white rounded-lg font-bold text-sm`}>
                      {getStatusLabel(kunjungan.status)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>📋</span>
          Keterangan Status:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center text-white text-xl">⏳</div>
            <div>
              <div className="font-semibold text-gray-800">Terdaftar</div>
              <div className="text-xs text-gray-600">Menunggu pemeriksaan</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-xl">🩺</div>
            <div>
              <div className="font-semibold text-gray-800">Pemeriksaan</div>
              <div className="text-xs text-gray-600">Sedang diperiksa dokter</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl">💊</div>
            <div>
              <div className="font-semibold text-gray-800">Farmasi</div>
              <div className="text-xs text-gray-600">Mengambil obat</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white text-xl">✅</div>
            <div>
              <div className="font-semibold text-gray-800">Selesai</div>
              <div className="text-xs text-gray-600">Sudah selesai</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
