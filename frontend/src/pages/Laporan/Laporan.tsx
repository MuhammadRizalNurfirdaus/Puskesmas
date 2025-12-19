import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function Laporan() {
  const [laporanKunjungan, setLaporanKunjungan] = useState<any>(null);
  const [statistikPasien, setStatistikPasien] = useState<any>(null);
  const [laporanObat, setLaporanObat] = useState<any>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchLaporanKunjungan = async () => {
    try {
      const response = await api.get('/laporan/kunjungan', {
        params: { startDate, endDate }
      });
      setLaporanKunjungan(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchStatistikPasien = async () => {
    try {
      const response = await api.get('/laporan/pasien');
      setStatistikPasien(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchLaporanObat = async () => {
    try {
      const response = await api.get('/laporan/obat');
      setLaporanObat(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchStatistikPasien();
    fetchLaporanObat();
  }, []);

  return (
    <div>
      <h1 className="mb-20">Laporan</h1>

      <div className="card mb-20">
        <h3 className="card-title">Statistik Pasien</h3>
        {statistikPasien && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div className="stat-card">
              <div className="stat-label">Total Pasien</div>
              <div className="stat-value">{statistikPasien.statistik.total}</div>
            </div>
            <div className="stat-card green">
              <div className="stat-label">Pasien Umum</div>
              <div className="stat-value">{statistikPasien.statistik.umum}</div>
            </div>
            <div className="stat-card blue">
              <div className="stat-label">Pasien BPJS</div>
              <div className="stat-value">{statistikPasien.statistik.bpjs}</div>
            </div>
          </div>
        )}
      </div>

      <div className="card mb-20">
        <h3 className="card-title">Laporan Kunjungan</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px', marginBottom: '20px' }}>
          <div className="form-group">
            <label className="form-label">Tanggal Mulai</label>
            <input type="date" className="form-input" value={startDate}
              onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Tanggal Akhir</label>
            <input type="date" className="form-input" value={endDate}
              onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={fetchLaporanKunjungan} 
            style={{ alignSelf: 'end', height: '42px' }}>
            Tampilkan
          </button>
        </div>

        {laporanKunjungan && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '20px' }}>
              <div className="stat-card">
                <div className="stat-label">Total Kunjungan</div>
                <div className="stat-value">{laporanKunjungan.statistik.total}</div>
              </div>
              <div className="stat-card green">
                <div className="stat-label">Pasien Umum</div>
                <div className="stat-value">{laporanKunjungan.statistik.umum}</div>
              </div>
              <div className="stat-card blue">
                <div className="stat-label">Pasien BPJS</div>
                <div className="stat-value">{laporanKunjungan.statistik.bpjs}</div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="card">
        <h3 className="card-title">Laporan Stok Obat</h3>
        {laporanObat && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '20px' }}>
              <div className="stat-card">
                <div className="stat-label">Total Obat</div>
                <div className="stat-value">{laporanObat.statistik.totalObat}</div>
              </div>
              <div className="stat-card orange">
                <div className="stat-label">Stok Rendah</div>
                <div className="stat-value">{laporanObat.statistik.stokRendah}</div>
              </div>
              <div className="stat-card" style={{ background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)' }}>
                <div className="stat-label">Stok Habis</div>
                <div className="stat-value">{laporanObat.statistik.stokHabis}</div>
              </div>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Kode</th>
                    <th>Nama Obat</th>
                    <th>Stok</th>
                    <th>Stok Minimal</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {laporanObat.data.map((obat: any) => (
                    <tr key={obat.idObat}>
                      <td>{obat.kodeObat}</td>
                      <td>{obat.namaObat}</td>
                      <td>{obat.stok}</td>
                      <td>{obat.stokMinimal}</td>
                      <td>
                        {obat.stok === 0 ? (
                          <span className="badge badge-danger">Habis</span>
                        ) : obat.stok <= obat.stokMinimal ? (
                          <span className="badge badge-warning">Rendah</span>
                        ) : (
                          <span className="badge badge-success">Aman</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
