import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { Obat } from '../../types';

interface ResepDetailForm {
  idObat: string;
  jumlah: string;
  aturanPakai: string;
  keterangan: string;
}

export default function ResepForm() {
  const { rekamMedisId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [obatList, setObatList] = useState<Obat[]>([]);
  const [catatan, setCatatan] = useState('');
  const [detail, setDetail] = useState<ResepDetailForm[]>([
    { idObat: '', jumlah: '', aturanPakai: '', keterangan: '' }
  ]);

  useEffect(() => {
    fetchObat();
  }, []);

  const fetchObat = async () => {
    try {
      const response = await api.get('/obat');
      setObatList(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddDetail = () => {
    setDetail([...detail, { idObat: '', jumlah: '', aturanPakai: '', keterangan: '' }]);
  };

  const handleRemoveDetail = (index: number) => {
    setDetail(detail.filter((_, i) => i !== index));
  };

  const handleDetailChange = (index: number, field: string, value: string) => {
    const newDetail = [...detail];
    newDetail[index] = { ...newDetail[index], [field]: value };
    setDetail(newDetail);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/resep', {
        idRekamMedis: parseInt(rekamMedisId!),
        catatan,
        detail: detail.map(d => ({
          idObat: parseInt(d.idObat),
          jumlah: parseInt(d.jumlah),
          aturanPakai: d.aturanPakai,
          keterangan: d.keterangan
        }))
      });
      navigate('/resep');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="mb-20">Buat Resep Obat</h1>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <h3 className="card-title">Detail Obat</h3>
          
          {detail.map((item, index) => (
            <div key={index} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '15px', borderRadius: '4px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div className="form-group">
                  <label className="form-label">Obat *</label>
                  <select className="form-select" value={item.idObat} required
                    onChange={(e) => handleDetailChange(index, 'idObat', e.target.value)}>
                    <option value="">Pilih Obat</option>
                    {obatList.map(o => (
                      <option key={o.idObat} value={o.idObat}>
                        {o.namaObat} (Stok: {o.stok})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Jumlah *</label>
                  <input type="number" className="form-input" value={item.jumlah} required
                    onChange={(e) => handleDetailChange(index, 'jumlah', e.target.value)} />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Aturan Pakai *</label>
                <input type="text" className="form-input" value={item.aturanPakai} required
                  placeholder="Contoh: 3x sehari 1 tablet setelah makan"
                  onChange={(e) => handleDetailChange(index, 'aturanPakai', e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Keterangan</label>
                <input type="text" className="form-input" value={item.keterangan}
                  onChange={(e) => handleDetailChange(index, 'keterangan', e.target.value)} />
              </div>

              {detail.length > 1 && (
                <button type="button" className="btn btn-danger" onClick={() => handleRemoveDetail(index)}>
                  Hapus Obat
                </button>
              )}
            </div>
          ))}

          <button type="button" className="btn btn-secondary mb-20" onClick={handleAddDetail}>
            ➕ Tambah Obat
          </button>

          <div className="form-group">
            <label className="form-label">Catatan</label>
            <textarea className="form-textarea" value={catatan}
              onChange={(e) => setCatatan(e.target.value)} />
          </div>

          <div className="flex gap-10">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan Resep'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/resep')}>
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
