import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Pasien } from '../../types';

export default function KunjunganForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pasienList, setPasienList] = useState<Pasien[]>([]);
  const [formData, setFormData] = useState({
    idPasien: '',
    tanggalKunjungan: new Date().toISOString().split('T')[0],
    jamKunjungan: new Date().toTimeString().split(' ')[0].substring(0, 5),
    jenisKunjungan: 'rawat_jalan',
    keluhan: ''
  });

  useEffect(() => {
    fetchPasien();
  }, []);

  const fetchPasien = async () => {
    try {
      const response = await api.get('/pasien');
      setPasienList(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/kunjungan', formData);
      navigate('/kunjungan');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="mb-20">Kunjungan Baru</h1>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Pasien *</label>
            <select 
              className="form-select" 
              value={formData.idPasien}
              onChange={(e) => setFormData({ ...formData, idPasien: e.target.value })}
              required
            >
              <option value="">Pilih Pasien</option>
              {pasienList.map(p => (
                <option key={p.idPasien} value={p.idPasien}>
                  {p.noRekamMedis} - {p.namaLengkap}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Tanggal Kunjungan *</label>
            <input
              type="date"
              className="form-input"
              value={formData.tanggalKunjungan}
              onChange={(e) => setFormData({ ...formData, tanggalKunjungan: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Jam Kunjungan *</label>
            <input
              type="time"
              className="form-input"
              value={formData.jamKunjungan}
              onChange={(e) => setFormData({ ...formData, jamKunjungan: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Jenis Kunjungan *</label>
            <select 
              className="form-select"
              value={formData.jenisKunjungan}
              onChange={(e) => setFormData({ ...formData, jenisKunjungan: e.target.value })}
              required
            >
              <option value="rawat_jalan">Rawat Jalan</option>
              <option value="kontrol">Kontrol</option>
              <option value="darurat">Darurat</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Keluhan</label>
            <textarea
              className="form-textarea"
              value={formData.keluhan}
              onChange={(e) => setFormData({ ...formData, keluhan: e.target.value })}
            />
          </div>

          <div className="flex gap-10">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/kunjungan')}>
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
