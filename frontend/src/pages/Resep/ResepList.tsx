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

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div>
      <h1 className="mb-20">Daftar Resep</h1>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>No. Resep</th>
                <th>Tanggal</th>
                <th>Pasien</th>
                <th>Dokter</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {resep.map((r) => (
                <tr key={r.idResep}>
                  <td>{r.noResep}</td>
                  <td>{new Date(r.tanggalResep).toLocaleDateString('id-ID')}</td>
                  <td>{r.rekamMedis?.kunjungan?.pasien?.namaLengkap || '-'}</td>
                  <td>{r.dokter.namaLengkap}</td>
                  <td>
                    <span className={`badge ${r.status === 'selesai' ? 'badge-success' : 'badge-warning'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td>
                    {r.status === 'pending' && (
                      <button 
                        onClick={() => handleUpdateStatus(r.idResep, 'selesai')}
                        className="btn btn-success" 
                        style={{ padding: '5px 10px', fontSize: '0.9rem' }}
                      >
                        Selesaikan
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
