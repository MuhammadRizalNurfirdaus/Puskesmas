import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PasienList from './pages/Pasien/PasienList';
import PasienForm from './pages/Pasien/PasienForm';
import KunjunganList from './pages/Kunjungan/KunjunganList';
import KunjunganForm from './pages/Kunjungan/KunjunganForm';
import RekamMedisList from './pages/RekamMedis/RekamMedisList';
import RekamMedisForm from './pages/RekamMedis/RekamMedisForm';
import ResepList from './pages/Resep/ResepList';
import ResepForm from './pages/Resep/ResepForm';
import ObatList from './pages/Obat/ObatList';
import ObatForm from './pages/Obat/ObatForm';
import TransaksiList from './pages/Transaksi/TransaksiList';
import TransaksiForm from './pages/Transaksi/TransaksiForm';
import TransaksiDetail from './pages/Transaksi/TransaksiDetail';
import Laporan from './pages/Laporan/LaporanV2';
import Antrian from './pages/Antrian/Antrian';
import Layout from './components/Layout';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          
          {/* Pasien Routes */}
          <Route path="pasien" element={<PasienList />} />
          <Route path="pasien/tambah" element={<PasienForm />} />
          <Route path="pasien/edit/:id" element={<PasienForm />} />
          
          {/* Kunjungan Routes */}
          <Route path="kunjungan" element={<KunjunganList />} />
          <Route path="kunjungan/tambah" element={<KunjunganForm />} />
          
          {/* Antrian Route */}
          <Route path="antrian" element={<Antrian />} />
          
          {/* Rekam Medis Routes */}
          <Route path="rekam-medis" element={<RekamMedisList />} />
          <Route path="rekam-medis/tambah/:kunjunganId" element={<RekamMedisForm />} />
          
          {/* Resep Routes */}
          <Route path="resep" element={<ResepList />} />
          <Route path="resep/tambah/:rekamMedisId" element={<ResepForm />} />
          
          {/* Obat Routes */}
          <Route path="obat" element={<ObatList />} />
          <Route path="obat/tambah" element={<ObatForm />} />
          <Route path="obat/edit/:id" element={<ObatForm />} />
          
          {/* Transaksi Routes */}
          <Route path="transaksi" element={<TransaksiList />} />
          <Route path="transaksi/tambah" element={<TransaksiForm />} />
          <Route path="transaksi/:id" element={<TransaksiDetail />} />
          
          {/* Laporan Route */}
          <Route path="laporan" element={<Laporan />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
