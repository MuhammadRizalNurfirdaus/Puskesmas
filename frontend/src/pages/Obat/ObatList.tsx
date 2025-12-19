import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Obat } from '../../types';

export default function ObatList() {
  const [obat, setObat] = useState<Obat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchObat();
  }, []);

  const fetchObat = async () => {
    try {
      const response = await api.get('/obat');
      setObat(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="flex-between mb-20">
        <h1>Data Obat</h1>
        <Link to="/obat/tambah" className="btn btn-primary">➕ Tambah Obat</Link>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama Obat</th>
                <th>Satuan</th>
                <th>Stok</th>
                <th>Stok Minimal</th>
                <th>Harga</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {obat.map((o) => (
                <tr key={o.idObat}>
                  <td>{o.kodeObat}</td>
                  <td>{o.namaObat}</td>
                  <td>{o.satuan}</td>
                  <td>
                    <span className={o.stok <= o.stokMinimal ? 'badge badge-danger' : ''}>
                      {o.stok}
                    </span>
                  </td>
                  <td>{o.stokMinimal}</td>
                  <td>Rp {o.harga?.toLocaleString('id-ID')}</td>
                  <td>
                    <span className={`badge ${o.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {o.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td>
                    <Link to={`/obat/edit/${o.idObat}`} className="btn btn-primary" 
                      style={{ padding: '5px 10px', fontSize: '0.9rem' }}>
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
