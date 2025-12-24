import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

export default function ObatForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    kodeObat: '',
    namaObat: '',
    deskripsi: '',
    satuan: 'Tablet',
    stok: 0,
    stokMinimal: 10,
    harga: 0,
    isActive: true
  });

  useEffect(() => {
    if (id) {
      fetchObat();
    }
  }, [id]);

  const fetchObat = async () => {
    try {
      const response = await api.get(`/obat/${id}`);
      setFormData(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await api.put(`/obat/${id}`, formData);
      } else {
        await api.post('/obat', formData);
      }
      navigate('/obat');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-brand-700 to-brand-900 rounded-2xl shadow-sm ring-1 ring-black/5 p-8 text-white">
        <h1 className="text-3xl font-extrabold">{id ? 'Edit' : 'Tambah'} Obat</h1>
        <p className="mt-2 text-white/80">Kelola data obat dan stok untuk kebutuhan apotek.</p>
      </div>

      <div className="card">
        <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Kode Obat *</label>
            <input type="text" className="form-input" value={formData.kodeObat} required
              onChange={(e) => setFormData({ ...formData, kodeObat: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Nama Obat *</label>
            <input type="text" className="form-input" value={formData.namaObat} required
              onChange={(e) => setFormData({ ...formData, namaObat: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Deskripsi</label>
            <textarea className="form-textarea" value={formData.deskripsi}
              onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })} />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="form-group">
              <label className="form-label">Satuan *</label>
              <select className="form-select" value={formData.satuan} required
                onChange={(e) => setFormData({ ...formData, satuan: e.target.value })}>
                <option value="Tablet">Tablet</option>
                <option value="Kapsul">Kapsul</option>
                <option value="Botol">Botol</option>
                <option value="Tube">Tube</option>
                <option value="Box">Box</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Harga</label>
              <input type="number" className="form-input" value={formData.harga}
                onChange={(e) => setFormData({ ...formData, harga: parseInt(e.target.value) })} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="form-group">
              <label className="form-label">Stok *</label>
              <input type="number" className="form-input" value={formData.stok} required
                onChange={(e) => setFormData({ ...formData, stok: parseInt(e.target.value) })} />
            </div>
            
            <div className="form-group">
              <label className="form-label">Stok Minimal *</label>
              <input type="number" className="form-input" value={formData.stokMinimal} required
                onChange={(e) => setFormData({ ...formData, stokMinimal: parseInt(e.target.value) })} />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/obat')}>
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
