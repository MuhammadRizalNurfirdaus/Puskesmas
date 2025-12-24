import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../entities/User';
import { Pasien } from '../entities/Pasien';
import { Kunjungan } from '../entities/Kunjungan';
import { RekamMedis } from '../entities/RekamMedis';
import { Obat } from '../entities/Obat';
import { Resep } from '../entities/Resep';
import { ResepDetail } from '../entities/ResepDetail';
import { Transaksi } from '../entities/Transaksi';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'puskesmas_db',
  synchronize: true, // Set false in production, use migrations
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Pasien, Kunjungan, RekamMedis, Obat, Resep, ResepDetail, Transaksi],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: [],
});
