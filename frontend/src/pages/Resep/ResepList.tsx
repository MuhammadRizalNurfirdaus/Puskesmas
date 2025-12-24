import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Resep } from '../../types';

export default function ResepList() {
  const [resep, setResep] = useState<Resep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResep();
  }, []);

  const fetchResep = async () => {
    try {
      const response = await api.get('/resep');
      setResep(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await api.put(`/resep/${id}/status`, { status });
      fetchResep();
      alert('Status resep berhasil diupdate');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-700 to-brand-900 rounded-2xl shadow-sm ring-1 ring-black/5 p-8 text-white">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            Daftar Resep
          </h1>
          <p className="text-white/80 mt-2 text-lg">Manajemen resep obat pasien</p>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">No. Resep</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Pasien</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Dokter</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {resep.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-gray-500 font-medium">Tidak ada data resep</p>
                    </div>
                  </td>
                </tr>
              ) : (
                resep.map((r) => (
                  <tr key={r.idResep} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{r.noResep}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{new Date(r.tanggalResep).toLocaleDateString('id-ID')}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-800">{r.rekamMedis?.kunjungan?.pasien?.namaLengkap || '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{r.dokter.namaLengkap}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        r.status === 'selesai' 
                          ? 'bg-green-100 text-green-800 border border-green-300' 
                          : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {r.status === 'pending' && (
                        <button 
                          onClick={() => handleUpdateStatus(r.idResep, 'selesai')}
                          className="inline-flex items-center gap-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Selesaikan
                        </button>
                      )}
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
}
