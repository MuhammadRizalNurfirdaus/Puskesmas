import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

export default function PasienForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nik: '',
    namaLengkap: '',
    tanggalLahir: '',
    jenisKelamin: 'L',
    alamat: '',
    noTelp: '',
    statusPembayaran: 'umum',
    noBPJS: '',
    golonganDarah: '',
    riwayatAlergi: ''
  });

  useEffect(() => {
    if (id) {
      fetchPasien();
    }
  }, [id]);

  const fetchPasien = async () => {
    try {
      const response = await api.get(`/pasien/${id}`);
      setFormData(response.data.data);
    } catch (error) {
      console.error('Error fetching pasien:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await api.put(`/pasien/${id}`, formData);
      } else {
        await api.post('/pasien', formData);
      }
      navigate('/pasien');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-brand-700 to-brand-900 rounded-2xl shadow-sm ring-1 ring-black/5 p-8 text-white">
        <h1 className="text-3xl font-extrabold">{id ? 'Edit' : 'Tambah'} Pasien</h1>
        <p className="mt-2 text-white/80">Lengkapi data pasien untuk kebutuhan pelayanan.</p>
      </div>

      <div className="card">
        <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">NIK *</label>
            <input
              type="text"
              name="nik"
              className="form-input"
              value={formData.nik}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nama Lengkap *</label>
            <input
              type="text"
              name="namaLengkap"
              className="form-input"
              value={formData.namaLengkap}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tanggal Lahir *</label>
            <input
              type="date"
              name="tanggalLahir"
              className="form-input"
              value={formData.tanggalLahir}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Jenis Kelamin *</label>
            <select name="jenisKelamin" className="form-select" value={formData.jenisKelamin} onChange={handleChange} required>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Alamat *</label>
            <textarea
              name="alamat"
              className="form-textarea"
              value={formData.alamat}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">No. Telepon *</label>
            <input
              type="text"
              name="noTelp"
              className="form-input"
              value={formData.noTelp}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Status Pembayaran *</label>
            <select name="statusPembayaran" className="form-select" value={formData.statusPembayaran} onChange={handleChange} required>
              <option value="umum">Umum</option>
              <option value="bpjs">BPJS</option>
            </select>
          </div>

          {formData.statusPembayaran === 'bpjs' && (
            <div className="form-group">
              <label className="form-label">No. BPJS</label>
              <input
                type="text"
                name="noBPJS"
                className="form-input"
                value={formData.noBPJS}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Golongan Darah</label>
            <input
              type="text"
              name="golonganDarah"
              className="form-input"
              value={formData.golonganDarah}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Riwayat Alergi</label>
            <textarea
              name="riwayatAlergi"
              className="form-textarea"
              value={formData.riwayatAlergi}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/pasien')}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
