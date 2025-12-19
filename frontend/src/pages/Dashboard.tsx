import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { DashboardData } from '../types';
import { useAuthStore } from '../stores/authStore';

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/laporan/dashboard');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>Dashboard</h1>
      
      <div className="card mb-20">
        <h2>Selamat Datang, {user?.namaLengkap}!</h2>
        <p>Role: {user?.role}</p>
      </div>

      {data && (
        <div className="dashboard-cards">
          <div className="stat-card">
            <div className="stat-label">Kunjungan Hari Ini</div>
            <div className="stat-value">{data.kunjunganHariIni}</div>
          </div>
          
          <div className="stat-card green">
            <div className="stat-label">Total Pasien</div>
            <div className="stat-value">{data.totalPasien}</div>
          </div>
          
          <div className="stat-card orange">
            <div className="stat-label">Resep Pending</div>
            <div className="stat-value">{data.resepPending}</div>
          </div>
          
          <div className="stat-card blue">
            <div className="stat-label">Obat Stok Rendah</div>
            <div className="stat-value">{data.obatStokRendah}</div>
          </div>
        </div>
      )}

      <div className="card">
        <h3 className="card-title">Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <Link to="/kunjungan/tambah" className="btn btn-primary">➕ Kunjungan Baru</Link>
          <Link to="/pasien/tambah" className="btn btn-success">👤 Pasien Baru</Link>
          <Link to="/rekam-medis" className="btn btn-primary">📋 Rekam Medis</Link>
          <Link to="/resep" className="btn btn-primary">💊 Resep</Link>
        </div>
      </div>
    </div>
  );
}
