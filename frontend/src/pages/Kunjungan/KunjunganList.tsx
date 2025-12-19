import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Kunjungan } from '../../types';

export default function KunjunganList() {
  const [kunjungan, setKunjungan] = useState<Kunjungan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKunjungan();
  }, []);

  const fetchKunjungan = async () => {
    try {
      const response = await api.get('/kunjungan');
      setKunjungan(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: any = {
      terdaftar: 'badge-info',
      pemeriksaan: 'badge-warning',
      farmasi: 'badge-warning',
      selesai: 'badge-success',
      batal: 'badge-danger'
    };
    return badges[status] || 'badge-info';
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="flex-between mb-20">
        <h1>Data Kunjungan</h1>
        <Link to="/kunjungan/tambah" className="btn btn-primary">➕ Kunjungan Baru</Link>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>No. Kunjungan</th>
                <th>Tanggal</th>
                <th>Pasien</th>
                <th>Jenis</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {kunjungan.map((k) => (
                <tr key={k.idKunjungan}>
                  <td>{k.noKunjungan}</td>
                  <td>{new Date(k.tanggalKunjungan).toLocaleDateString('id-ID')}</td>
                  <td>{k.pasien.namaLengkap}</td>
                  <td>{k.jenisKunjungan}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(k.status)}`}>
                      {k.status}
                    </span>
                  </td>
                  <td>
                    {!k.rekamMedis && k.status === 'terdaftar' && (
                      <Link to={`/rekam-medis/tambah/${k.idKunjungan}`} className="btn btn-primary" style={{ padding: '5px 10px', fontSize: '0.9rem' }}>
                        Periksa
                      </Link>
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
