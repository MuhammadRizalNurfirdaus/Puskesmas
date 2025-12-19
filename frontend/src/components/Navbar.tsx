import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { UserRole } from '../types';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const canAccessPendaftaran = user?.role === UserRole.ADMIN || user?.role === UserRole.PENDAFTARAN;
  const canAccessDokter = user?.role === UserRole.ADMIN || user?.role === UserRole.DOKTER;
  const canAccessApoteker = user?.role === UserRole.ADMIN || user?.role === UserRole.APOTEKER;
  const canAccessLaporan = user?.role === UserRole.ADMIN || user?.role === UserRole.KEPALA_PUSKESMAS;

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            🏥 Puskesmas
          </Link>
        </div>
        
        <ul className="navbar-menu">
          <li><Link to="/">Dashboard</Link></li>
          
          {canAccessPendaftaran && (
            <>
              <li><Link to="/pasien">Pasien</Link></li>
              <li><Link to="/kunjungan">Kunjungan</Link></li>
            </>
          )}
          
          {canAccessDokter && (
            <li><Link to="/rekam-medis">Rekam Medis</Link></li>
          )}
          
          {canAccessApoteker && (
            <>
              <li><Link to="/resep">Resep</Link></li>
              <li><Link to="/obat">Obat</Link></li>
            </>
          )}
          
          {canAccessLaporan && (
            <li><Link to="/laporan">Laporan</Link></li>
          )}
        </ul>
        
        <div className="navbar-user">
          <span>{user?.namaLengkap}</span>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
