import bcrypt from 'bcrypt';
import { AppDataSource } from '../config/database';
import { User, UserRole } from '../entities/User';
import { Obat } from '../entities/Obat';

export const seedDatabase = async () => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const obatRepository = AppDataSource.getRepository(Obat);

    // Check if users already exist
    const userCount = await userRepository.count();
    
    if (userCount === 0) {
      console.log('🌱 Seeding default users...');
      
      const defaultUsers = [
        {
          username: 'admin',
          password: await bcrypt.hash('admin123', 10),
          role: UserRole.ADMIN,
          namaLengkap: 'Administrator',
          nip: '199001012020011001'
        },
        {
          username: 'pendaftaran',
          password: await bcrypt.hash('pendaftaran123', 10),
          role: UserRole.PENDAFTARAN,
          namaLengkap: 'Petugas Pendaftaran',
          nip: '199002022020012001'
        },
        {
          username: 'dokter',
          password: await bcrypt.hash('dokter123', 10),
          role: UserRole.DOKTER,
          namaLengkap: 'dr. Budi Santoso',
          nip: '199003032020013001'
        },
        {
          username: 'apoteker',
          password: await bcrypt.hash('apoteker123', 10),
          role: UserRole.APOTEKER,
          namaLengkap: 'Apt. Siti Rahayu',
          nip: '199004042020014001'
        },
        {
          username: 'kepala',
          password: await bcrypt.hash('kepala123', 10),
          role: UserRole.KEPALA_PUSKESMAS,
          namaLengkap: 'dr. Ahmad Wijaya',
          nip: '198501012015011001'
        }
      ];

      for (const userData of defaultUsers) {
        const user = userRepository.create(userData);
        await userRepository.save(user);
      }

      console.log('✅ Default users created successfully');
    }

    // Check if obat already exist
    const obatCount = await obatRepository.count();
    
    if (obatCount === 0) {
      console.log('🌱 Seeding default obat...');
      
      const defaultObat = [
        {
          kodeObat: 'OBT001',
          namaObat: 'Paracetamol 500mg',
          deskripsi: 'Obat penurun panas dan pereda nyeri',
          satuan: 'Tablet',
          stok: 500,
          stokMinimal: 100,
          harga: 500
        },
        {
          kodeObat: 'OBT002',
          namaObat: 'Amoxicillin 500mg',
          deskripsi: 'Antibiotik untuk infeksi bakteri',
          satuan: 'Kapsul',
          stok: 300,
          stokMinimal: 50,
          harga: 2000
        },
        {
          kodeObat: 'OBT003',
          namaObat: 'OBH Kombi',
          deskripsi: 'Obat batuk berdahak',
          satuan: 'Botol',
          stok: 150,
          stokMinimal: 30,
          harga: 15000
        },
        {
          kodeObat: 'OBT004',
          namaObat: 'Vitamin C 500mg',
          deskripsi: 'Suplemen vitamin C',
          satuan: 'Tablet',
          stok: 400,
          stokMinimal: 80,
          harga: 1000
        },
        {
          kodeObat: 'OBT005',
          namaObat: 'Antasida',
          deskripsi: 'Obat maag',
          satuan: 'Tablet',
          stok: 200,
          stokMinimal: 50,
          harga: 800
        }
      ];

      for (const obatData of defaultObat) {
        const obat = obatRepository.create(obatData);
        await obatRepository.save(obat);
      }

      console.log('✅ Default obat created successfully');
    }

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};
