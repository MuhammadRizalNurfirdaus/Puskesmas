import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">🏥 Sistem Informasi Puskesmas</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Masukkan username"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Masukkan password"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '20px' }}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
        
        <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#666' }}>
          <p><strong>Default Users:</strong></p>
          <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
            <li>Admin: admin / admin123</li>
            <li>Pendaftaran: pendaftaran / pendaftaran123</li>
            <li>Dokter: dokter / dokter123</li>
            <li>Apoteker: apoteker / apoteker123</li>
            <li>Kepala Puskesmas: kepala / kepala123</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
