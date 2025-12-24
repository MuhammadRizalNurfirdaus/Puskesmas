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
import transaksiRoutes from './routes/transaksiRoutes';
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
app.use('/api/transaksi', transaksiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Puskesmas API is running' });
});

// Error handler
app.use(errorHandler);

// Start server without waiting for database
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Initialize database connection (non-blocking)
AppDataSource.initialize()
  .then(async () => {
    console.log('✅ Database connected successfully');
    
    // Seed initial data
    try {
      await seedDatabase();
      console.log('✅ Database seeded successfully');
    } catch (error) {
      console.error('⚠️  Warning: Error seeding database:', error);
    }
  })
  .catch((error) => {
    console.error('❌ Error connecting to database:', error);
    console.error('⚠️  Server is running but database is not connected.');
    console.error('📝 Please check your database configuration in .env file:');
    console.error('   - DB_HOST:', process.env.DB_HOST);
    console.error('   - DB_PORT:', process.env.DB_PORT);
    console.error('   - DB_USERNAME:', process.env.DB_USERNAME);
    console.error('   - DB_DATABASE:', process.env.DB_DATABASE);
    console.error('\n💡 To setup the database, run:');
    console.error('   sudo mariadb');
    console.error('   Then execute these SQL commands:');
    console.error('   CREATE DATABASE IF NOT EXISTS puskesmas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
    console.error('   CREATE USER IF NOT EXISTS \'puskesmas_user\'@\'localhost\' IDENTIFIED BY \'puskesmas123\';');
    console.error('   GRANT ALL PRIVILEGES ON puskesmas_db.* TO \'puskesmas_user\'@\'localhost\';');
    console.error('   FLUSH PRIVILEGES;');
    console.error('   EXIT;');
  });

export default app;
