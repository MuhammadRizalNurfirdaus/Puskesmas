import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import pasienRoutes from './routes/pasienRoutes';
import kunjunganRoutes from './routes/kunjunganRoutes';
import rekamMedisRoutes from './routes/rekamMedisRoutes';
import resepRoutes from './routes/resepRoutes';
import obatRoutes from './routes/obatRoutes';
import laporanRoutes from './routes/laporanRoutes';
import { seedDatabase } from './utils/seed';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pasien', pasienRoutes);
app.use('/api/kunjungan', kunjunganRoutes);
app.use('/api/rekam-medis', rekamMedisRoutes);
app.use('/api/resep', resepRoutes);
app.use('/api/obat', obatRoutes);
app.use('/api/laporan', laporanRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Puskesmas API is running' });
});

// Error handler
app.use(errorHandler);

// Initialize database and start server
AppDataSource.initialize()
  .then(async () => {
    console.log('✅ Database connected successfully');
    
    // Seed initial data
    await seedDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error connecting to database:', error);
    process.exit(1);
  });

export default app;
