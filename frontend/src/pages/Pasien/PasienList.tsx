import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Pasien } from '../../types';

export default function PasienList() {
  const [pasien, setPasien] = useState<Pasien[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPasien();
  }, [search]);

  const fetchPasien = async () => {
    try {
      const response = await api.get('/pasien', { params: { search } });
      setPasien(response.data.data);
    } catch (error) {
      console.error('Error fetching pasien:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="flex-between mb-20">
        <h1>Data Pasien</h1>
        <Link to="/pasien/tambah" className="btn btn-primary">➕ Tambah Pasien</Link>
      </div>

      <div className="card">
        <div className="form-group">
          <input
            type="text"
            className="form-input"
            placeholder="Cari pasien (nama, NIK, no rekam medis)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>No. Rekam Medis</th>
                <th>NIK</th>
                <th>Nama Lengkap</th>
                <th>Jenis Kelamin</th>
                <th>No. Telp</th>
                <th>Status Pembayaran</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pasien.map((p) => (
                <tr key={p.idPasien}>
                  <td>{p.noRekamMedis}</td>
                  <td>{p.nik}</td>
                  <td>{p.namaLengkap}</td>
                  <td>{p.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                  <td>{p.noTelp}</td>
                  <td>
                    <span className={`badge ${p.statusPembayaran === 'bpjs' ? 'badge-success' : 'badge-info'}`}>
                      {p.statusPembayaran.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <Link to={`/pasien/edit/${p.idPasien}`} className="btn btn-primary" style={{ padding: '5px 10px', fontSize: '0.9rem' }}>
                      Edit
                    </Link>
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
