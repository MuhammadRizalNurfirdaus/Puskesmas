import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { Kunjungan } from '../../types';

export default function RekamMedisForm() {
  const { kunjunganId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [kunjungan, setKunjungan] = useState<Kunjungan | null>(null);
  const [formData, setFormData] = useState({
    idKunjungan: kunjunganId,
    anamnesa: '',
    pemeriksaanFisik: '',
    tekananDarah: '',
    beratBadan: '',
    tinggiBadan: '',
    suhuTubuh: '',
    diagnosis: '',
    tindakan: '',
    catatan: ''
  });

  useEffect(() => {
    fetchKunjungan();
  }, []);

  const fetchKunjungan = async () => {
    try {
      const response = await api.get(`/kunjungan/${kunjunganId}`);
      setKunjungan(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/rekam-medis', formData);
      const rekamMedisId = response.data.data.idRekamMedis;
      
      // Arahkan ke form resep
      if (window.confirm('Rekam medis berhasil dibuat. Buat resep obat?')) {
        navigate(`/resep/tambah/${rekamMedisId}`);
      } else {
        navigate('/kunjungan');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="mb-20">Rekam Medis Pasien</h1>

      {kunjungan && (
        <div className="card mb-20">
          <h3>Informasi Kunjungan</h3>
          <p><strong>No. Kunjungan:</strong> {kunjungan.noKunjungan}</p>
          <p><strong>Pasien:</strong> {kunjungan.pasien.namaLengkap}</p>
          <p><strong>No. RM:</strong> {kunjungan.pasien.noRekamMedis}</p>
          <p><strong>Keluhan:</strong> {kunjungan.keluhan || '-'}</p>
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <h3 className="card-title">Pemeriksaan Fisik</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label className="form-label">Tekanan Darah</label>
              <input type="text" className="form-input" value={formData.tekananDarah}
                onChange={(e) => setFormData({ ...formData, tekananDarah: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Suhu Tubuh (°C)</label>
              <input type="number" step="0.1" className="form-input" value={formData.suhuTubuh}
                onChange={(e) => setFormData({ ...formData, suhuTubuh: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Berat Badan (kg)</label>
              <input type="number" step="0.1" className="form-input" value={formData.beratBadan}
                onChange={(e) => setFormData({ ...formData, beratBadan: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Tinggi Badan (cm)</label>
              <input type="number" step="0.1" className="form-input" value={formData.tinggiBadan}
                onChange={(e) => setFormData({ ...formData, tinggiBadan: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Anamnesa *</label>
            <textarea className="form-textarea" value={formData.anamnesa} required
              onChange={(e) => setFormData({ ...formData, anamnesa: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Pemeriksaan Fisik *</label>
            <textarea className="form-textarea" value={formData.pemeriksaanFisik} required
              onChange={(e) => setFormData({ ...formData, pemeriksaanFisik: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Diagnosis *</label>
            <textarea className="form-textarea" value={formData.diagnosis} required
              onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Tindakan</label>
            <textarea className="form-textarea" value={formData.tindakan}
              onChange={(e) => setFormData({ ...formData, tindakan: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Catatan</label>
            <textarea className="form-textarea" value={formData.catatan}
              onChange={(e) => setFormData({ ...formData, catatan: e.target.value })} />
          </div>

          <div className="flex gap-10">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan & Buat Resep'}
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
