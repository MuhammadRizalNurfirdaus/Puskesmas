import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/database';
import { User, UserRole } from '../entities/User';
import { Obat } from '../entities/Obat';
import { Pasien, JenisKelamin, StatusPembayaran } from '../entities/Pasien';
import { Kunjungan, StatusKunjungan, JenisKunjungan } from '../entities/Kunjungan';
import { RekamMedis } from '../entities/RekamMedis';
import { Resep, StatusResep } from '../entities/Resep';
import { ResepDetail } from '../entities/ResepDetail';
import { Transaksi, MetodePembayaran, StatusPembayaran as TransaksiStatusPembayaran, StatusVerifikasi } from '../entities/Transaksi';

export const seedDatabase = async () => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const obatRepository = AppDataSource.getRepository(Obat);
    const pasienRepository = AppDataSource.getRepository(Pasien);
    const kunjunganRepository = AppDataSource.getRepository(Kunjungan);
    const rekamMedisRepository = AppDataSource.getRepository(RekamMedis);
    const resepRepository = AppDataSource.getRepository(Resep);
    const resepDetailRepository = AppDataSource.getRepository(ResepDetail);
    const transaksiRepository = AppDataSource.getRepository(Transaksi);

    // Ensure default users exist (idempotent)
    console.log('🌱 Ensuring default users exist...');

    const defaultUsers = [
      {
        username: 'admin',
        passwordPlain: 'admin123',
        role: UserRole.ADMIN,
        namaLengkap: 'Admin Sistem',
        nip: '199001012020011001',
        noTelp: '081234567890'
      },
      {
        username: 'pasien',
        passwordPlain: 'pasien123',
        role: UserRole.PASIEN,
        namaLengkap: 'John Doe (Pasien)',
        noTelp: '081234567891'
      },
      {
        username: 'pendaftaran',
        passwordPlain: 'pendaftaran123',
        role: UserRole.PENDAFTARAN,
        namaLengkap: 'Petugas Pendaftaran',
        nip: '199002022020012001',
        noTelp: '081234567892'
      },
      {
        username: 'dokter',
        passwordPlain: 'dokter123',
        role: UserRole.DOKTER,
        namaLengkap: 'dr. Budi Santoso',
        nip: '199003032020013001',
        noTelp: '081234567893'
      },
      {
        username: 'apoteker',
        passwordPlain: 'apoteker123',
        role: UserRole.APOTEKER,
        namaLengkap: 'Apt. Siti Rahayu',
        nip: '199004042020014001',
        noTelp: '081234567894'
      },
      {
        username: 'kepala',
        passwordPlain: 'kepala123',
        role: UserRole.KEPALA_PUSKESMAS,
        namaLengkap: 'dr. Ahmad Wijaya, M.Kes',
        nip: '198501012015011001',
        noTelp: '081234567895'
      }
    ];

    for (const userData of defaultUsers) {
      const existing = await userRepository.findOne({ where: { username: userData.username } });
      if (existing) {
        let hasChanges = false;

        if (!existing.isActive) {
          existing.isActive = true;
          hasChanges = true;
        }

        if (existing.role !== userData.role) {
          existing.role = userData.role;
          hasChanges = true;
        }

        if (existing.namaLengkap !== userData.namaLengkap) {
          existing.namaLengkap = userData.namaLengkap;
          hasChanges = true;
        }

        if (existing.nip !== userData.nip) {
          existing.nip = userData.nip;
          hasChanges = true;
        }

        if (existing.noTelp !== userData.noTelp) {
          existing.noTelp = userData.noTelp;
          hasChanges = true;
        }

        // Ensure password always matches the documented demo credentials
        const passwordValid = await bcrypt.compare(userData.passwordPlain, existing.password);
        if (!passwordValid) {
          existing.password = await bcrypt.hash(userData.passwordPlain, 10);
          hasChanges = true;
        }

        if (hasChanges) {
          await userRepository.save(existing);
        }

        continue;
      }

      const password = await bcrypt.hash(userData.passwordPlain, 10);
      const user = userRepository.create({
        username: userData.username,
        password,
        role: userData.role,
        namaLengkap: userData.namaLengkap,
        nip: userData.nip,
        noTelp: userData.noTelp
      });
      await userRepository.save(user);
    }

    console.log('✅ Default users ensured');

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

    // Seed Pasien
    const pasienCount = await pasienRepository.count();
    const petugasPendaftaranForPasien = await userRepository.findOne({ where: { role: UserRole.PENDAFTARAN } });
    
    if (pasienCount === 0 && petugasPendaftaranForPasien) {
      console.log('🌱 Seeding pasien data...');
      
      const defaultPasien = [
        {
          noRekamMedis: 'RM001',
          nik: '3201012345670001',
          namaLengkap: 'Budi Santoso',
          jenisKelamin: JenisKelamin.LAKI_LAKI,
          tanggalLahir: new Date('1990-05-15'),
          alamat: 'Jl. Merdeka No. 10, Jakarta',
          noTelp: '081234567801',
          statusPembayaran: StatusPembayaran.BPJS,
          noBPJS: '0001234567890',
          golonganDarah: 'O',
          riwayatAlergi: 'Tidak ada',
          createdBy: petugasPendaftaranForPasien
        },
        {
          noRekamMedis: 'RM002',
          nik: '3201012345670002',
          namaLengkap: 'Siti Aminah',
          jenisKelamin: JenisKelamin.PEREMPUAN,
          tanggalLahir: new Date('1985-08-20'),
          alamat: 'Jl. Sudirman No. 25, Jakarta',
          noTelp: '081234567802',
          statusPembayaran: StatusPembayaran.BPJS,
          noBPJS: '0001234567891',
          golonganDarah: 'A',
          riwayatAlergi: 'Alergi seafood',
          createdBy: petugasPendaftaranForPasien
        },
        {
          noRekamMedis: 'RM003',
          nik: '3201012345670003',
          namaLengkap: 'Ahmad Yani',
          jenisKelamin: JenisKelamin.LAKI_LAKI,
          tanggalLahir: new Date('1995-03-10'),
          alamat: 'Jl. Gatot Subroto No. 5, Jakarta',
          noTelp: '081234567803',
          statusPembayaran: StatusPembayaran.BPJS,
          noBPJS: '0001234567892',
          golonganDarah: 'B',
          riwayatAlergi: 'Tidak ada',
          createdBy: petugasPendaftaranForPasien
        },
        {
          noRekamMedis: 'RM004',
          nik: '3201012345670004',
          namaLengkap: 'Dewi Lestari',
          jenisKelamin: JenisKelamin.PEREMPUAN,
          tanggalLahir: new Date('1992-11-25'),
          alamat: 'Jl. Diponegoro No. 15, Jakarta',
          noTelp: '081234567804',
          statusPembayaran: StatusPembayaran.BPJS,
          noBPJS: '0001234567893',
          golonganDarah: 'AB',
          riwayatAlergi: 'Alergi obat antibiotik tertentu',
          createdBy: petugasPendaftaranForPasien
        },
        {
          noRekamMedis: 'RM005',
          nik: '3201012345670005',
          namaLengkap: 'Rudi Hartono',
          jenisKelamin: JenisKelamin.LAKI_LAKI,
          tanggalLahir: new Date('1988-07-12'),
          alamat: 'Jl. Ahmad Yani No. 30, Jakarta',
          noTelp: '081234567805',
          statusPembayaran: StatusPembayaran.BPJS,
          noBPJS: '0001234567894',
          golonganDarah: 'O',
          riwayatAlergi: 'Tidak ada',
          createdBy: petugasPendaftaranForPasien
        },
        {
          noRekamMedis: 'RM006',
          nik: '3201012345670006',
          namaLengkap: 'Rina Susanti',
          jenisKelamin: JenisKelamin.PEREMPUAN,
          tanggalLahir: new Date('1998-02-28'),
          alamat: 'Jl. Veteran No. 8, Jakarta',
          noTelp: '081234567806',
          statusPembayaran: StatusPembayaran.UMUM,
          golonganDarah: 'A',
          riwayatAlergi: 'Alergi debu',
          createdBy: petugasPendaftaranForPasien
        },
        {
          noRekamMedis: 'RM007',
          nik: '3201012345670007',
          namaLengkap: 'Joko Widodo',
          jenisKelamin: JenisKelamin.LAKI_LAKI,
          tanggalLahir: new Date('1975-06-18'),
          alamat: 'Jl. Thamrin No. 12, Jakarta',
          noTelp: '081234567807',
          statusPembayaran: StatusPembayaran.BPJS,
          noBPJS: '0001234567895',
          golonganDarah: 'B',
          riwayatAlergi: 'Tidak ada',
          createdBy: petugasPendaftaranForPasien
        },
        {
          noRekamMedis: 'RM008',
          nik: '3201012345670008',
          namaLengkap: 'Sri Mulyani',
          jenisKelamin: JenisKelamin.PEREMPUAN,
          tanggalLahir: new Date('1980-09-05'),
          alamat: 'Jl. Rasuna Said No. 20, Jakarta',
          noTelp: '081234567808',
          statusPembayaran: StatusPembayaran.BPJS,
          noBPJS: '0001234567896',
          golonganDarah: 'O',
          riwayatAlergi: 'Alergi kacang-kacangan',
          createdBy: petugasPendaftaranForPasien
        }
      ];

      for (const pasienData of defaultPasien) {
        const pasien = pasienRepository.create(pasienData);
        await pasienRepository.save(pasien);
      }

      console.log('✅ Pasien data created successfully');
    }

    // Get saved data for relations
    const allPasien = await pasienRepository.find();
    const allDokter = await userRepository.find({ where: { role: UserRole.DOKTER } });
    const allApoteker = await userRepository.find({ where: { role: UserRole.APOTEKER } });
    const allObat = await obatRepository.find();
    const petugasPendaftaran = await userRepository.findOne({ where: { role: UserRole.PENDAFTARAN } });

    // Seed Kunjungan
    const kunjunganCount = await kunjunganRepository.count();
    if (kunjunganCount === 0 && allPasien.length > 0 && petugasPendaftaran) {
      console.log('🌱 Seeding kunjungan data...');
      
      const defaultKunjungan = [
        {
          noKunjungan: 'KNJ20241220001',
          pasien: allPasien[0],
          petugasPendaftaran: petugasPendaftaran,
          tanggalKunjungan: new Date('2024-12-20'),
          jamKunjungan: '08:30:00',
          jenisKunjungan: JenisKunjungan.RAWAT_JALAN,
          keluhan: 'Demam dan sakit kepala',
          status: StatusKunjungan.SELESAI
        },
        {
          noKunjungan: 'KNJ20241220002',
          pasien: allPasien[1],
          petugasPendaftaran: petugasPendaftaran,
          tanggalKunjungan: new Date('2024-12-20'),
          jamKunjungan: '09:00:00',
          jenisKunjungan: JenisKunjungan.RAWAT_JALAN,
          keluhan: 'Batuk dan pilek',
          status: StatusKunjungan.SELESAI
        },
        {
          noKunjungan: 'KNJ20241220003',
          pasien: allPasien[2],
          petugasPendaftaran: petugasPendaftaran,
          tanggalKunjungan: new Date('2024-12-20'),
          jamKunjungan: '10:15:00',
          jenisKunjungan: JenisKunjungan.RAWAT_JALAN,
          keluhan: 'Sakit perut',
          status: StatusKunjungan.SELESAI
        },
        {
          noKunjungan: 'KNJ20241221001',
          pasien: allPasien[3],
          petugasPendaftaran: petugasPendaftaran,
          tanggalKunjungan: new Date('2024-12-21'),
          jamKunjungan: '08:45:00',
          jenisKunjungan: JenisKunjungan.RAWAT_JALAN,
          keluhan: 'Pusing dan mual',
          status: StatusKunjungan.SELESAI
        },
        {
          noKunjungan: 'KNJ20241221002',
          pasien: allPasien[4],
          petugasPendaftaran: petugasPendaftaran,
          tanggalKunjungan: new Date('2024-12-21'),
          jamKunjungan: '09:30:00',
          jenisKunjungan: JenisKunjungan.RAWAT_JALAN,
          keluhan: 'Demam tinggi',
          status: StatusKunjungan.SELESAI
        },
        {
          noKunjungan: 'KNJ20241222001',
          pasien: allPasien[5],
          petugasPendaftaran: petugasPendaftaran,
          tanggalKunjungan: new Date('2024-12-22'),
          jamKunjungan: '08:00:00',
          jenisKunjungan: JenisKunjungan.RAWAT_JALAN,
          keluhan: 'Batuk berdahak',
          status: StatusKunjungan.SELESAI
        },
        {
          noKunjungan: 'KNJ20241223001',
          pasien: allPasien[6],
          petugasPendaftaran: petugasPendaftaran,
          tanggalKunjungan: new Date('2024-12-23'),
          jamKunjungan: '08:30:00',
          jenisKunjungan: JenisKunjungan.KONTROL,
          keluhan: 'Cek kesehatan rutin',
          status: StatusKunjungan.TERDAFTAR
        },
        {
          noKunjungan: 'KNJ20241223002',
          pasien: allPasien[7],
          petugasPendaftaran: petugasPendaftaran,
          tanggalKunjungan: new Date('2024-12-23'),
          jamKunjungan: '09:00:00',
          jenisKunjungan: JenisKunjungan.RAWAT_JALAN,
          keluhan: 'Sakit gigi',
          status: StatusKunjungan.TERDAFTAR
        }
      ];

      for (const kunjunganData of defaultKunjungan) {
        const kunjungan = kunjunganRepository.create(kunjunganData);
        await kunjunganRepository.save(kunjungan);
      }

      console.log('✅ Kunjungan data created successfully');
    }

    // Get kunjungan for rekam medis
    const allKunjungan = await kunjunganRepository.find({ relations: ['pasien'] });

    // Seed Rekam Medis
    const rekamMedisCount = await rekamMedisRepository.count();
    if (rekamMedisCount === 0 && allKunjungan.length > 0 && allDokter.length > 0) {
      console.log('🌱 Seeding rekam medis data...');
      
      const defaultRekamMedis = [
        {
          kunjungan: allKunjungan[0],
          dokter: allDokter[0],
          anamnesa: 'Pasien mengeluh demam sejak 2 hari yang lalu, disertai sakit kepala',
          pemeriksaanFisik: 'Keadaan umum: Tampak sakit ringan, Kesadaran: Compos mentis',
          tekananDarah: '120/80',
          beratBadan: 65.5,
          tinggiBadan: 170.0,
          suhuTubuh: 38.5,
          diagnosis: 'Influenza',
          tindakan: 'Pemberian obat penurun panas dan antibiotik',
          catatan: 'Pasien disarankan istirahat 3 hari'
        },
        {
          kunjungan: allKunjungan[1],
          dokter: allDokter[0],
          anamnesa: 'Batuk dan pilek sejak 3 hari, tidak ada demam',
          pemeriksaanFisik: 'Keadaan umum baik, tidak ada wheezing',
          tekananDarah: '110/70',
          beratBadan: 58.0,
          tinggiBadan: 160.0,
          suhuTubuh: 37.2,
          diagnosis: 'ISPA (Infeksi Saluran Pernapasan Akut)',
          tindakan: 'Pemberian obat batuk dan vitamin',
          catatan: 'Kontrol kembali jika batuk tidak membaik dalam 5 hari'
        },
        {
          kunjungan: allKunjungan[2],
          dokter: allDokter[0],
          anamnesa: 'Nyeri ulu hati, mual, sering terlambat makan',
          pemeriksaanFisik: 'Nyeri tekan epigastrium',
          tekananDarah: '125/85',
          beratBadan: 72.0,
          tinggiBadan: 175.0,
          suhuTubuh: 36.8,
          diagnosis: 'Gastritis',
          tindakan: 'Pemberian obat maag dan anjuran diet',
          catatan: 'Hindari makanan pedas dan asam'
        },
        {
          kunjungan: allKunjungan[3],
          dokter: allDokter[0],
          anamnesa: 'Pusing berputar sejak pagi, mual',
          pemeriksaanFisik: 'Nystagmus (-), Romberg test (+)',
          tekananDarah: '115/75',
          beratBadan: 54.0,
          tinggiBadan: 158.0,
          suhuTubuh: 36.5,
          diagnosis: 'Vertigo',
          tindakan: 'Pemberian obat anti vertigo',
          catatan: 'Istirahat cukup dan hindari pergerakan mendadak'
        },
        {
          kunjungan: allKunjungan[4],
          dokter: allDokter[0],
          anamnesa: 'Demam tinggi 5 hari, lemas, nafsu makan menurun',
          pemeriksaanFisik: 'Lidah kotor, hepatomegali',
          tekananDarah: '118/78',
          beratBadan: 68.0,
          tinggiBadan: 172.0,
          suhuTubuh: 39.0,
          diagnosis: 'Demam Tifoid',
          tindakan: 'Pemberian antibiotik dan obat penurun panas',
          catatan: 'Pasien perlu rawat jalan, kontrol 3 hari lagi'
        },
        {
          kunjungan: allKunjungan[5],
          dokter: allDokter[0],
          anamnesa: 'Batuk berdahak, sesak napas ringan',
          pemeriksaanFisik: 'Ronki basah kasar (+)',
          tekananDarah: '112/72',
          beratBadan: 60.0,
          tinggiBadan: 165.0,
          suhuTubuh: 37.5,
          diagnosis: 'Bronkitis',
          tindakan: 'Pemberian obat batuk ekspektoran dan antibiotik',
          catatan: 'Minum air putih yang cukup'
        }
      ];

      for (const rekamMedisData of defaultRekamMedis) {
        const rekamMedis = rekamMedisRepository.create(rekamMedisData);
        await rekamMedisRepository.save(rekamMedis);
      }

      console.log('✅ Rekam medis data created successfully');
    }

    // Get rekam medis for resep
    const allRekamMedis = await rekamMedisRepository.find({ relations: ['kunjungan', 'dokter'] });

    // Seed Resep
    const resepCount = await resepRepository.count();
    if (resepCount === 0 && allRekamMedis.length > 0 && allApoteker.length > 0) {
      console.log('🌱 Seeding resep data...');
      
      const defaultResep = [
        {
          noResep: 'RSP20241220001',
          rekamMedis: allRekamMedis[0],
          dokter: allRekamMedis[0].dokter,
          apoteker: allApoteker[0],
          tanggalResep: new Date('2024-12-20'),
          tanggalDilayani: new Date('2024-12-20 09:30:00'),
          status: StatusResep.SELESAI,
          catatan: 'Diminum setelah makan'
        },
        {
          noResep: 'RSP20241220002',
          rekamMedis: allRekamMedis[1],
          dokter: allRekamMedis[1].dokter,
          apoteker: allApoteker[0],
          tanggalResep: new Date('2024-12-20'),
          tanggalDilayani: new Date('2024-12-20 10:00:00'),
          status: StatusResep.SELESAI,
          catatan: 'Habiskan obat sesuai petunjuk'
        },
        {
          noResep: 'RSP20241220003',
          rekamMedis: allRekamMedis[2],
          dokter: allRekamMedis[2].dokter,
          apoteker: allApoteker[0],
          tanggalResep: new Date('2024-12-20'),
          tanggalDilayani: new Date('2024-12-20 11:00:00'),
          status: StatusResep.SELESAI,
          catatan: 'Diminum 30 menit sebelum makan'
        },
        {
          noResep: 'RSP20241221001',
          rekamMedis: allRekamMedis[3],
          dokter: allRekamMedis[3].dokter,
          apoteker: allApoteker[0],
          tanggalResep: new Date('2024-12-21'),
          tanggalDilayani: new Date('2024-12-21 09:45:00'),
          status: StatusResep.SELESAI,
          catatan: 'Konsumsi sesuai dosis'
        },
        {
          noResep: 'RSP20241221002',
          rekamMedis: allRekamMedis[4],
          dokter: allRekamMedis[4].dokter,
          apoteker: allApoteker[0],
          tanggalResep: new Date('2024-12-21'),
          tanggalDilayani: new Date('2024-12-21 10:30:00'),
          status: StatusResep.SELESAI,
          catatan: 'Obat diminum hingga habis'
        },
        {
          noResep: 'RSP20241222001',
          rekamMedis: allRekamMedis[5],
          dokter: allRekamMedis[5].dokter,
          tanggalResep: new Date('2024-12-22'),
          status: StatusResep.PENDING,
          catatan: 'Segera ambil di apotik'
        }
      ];

      for (const resepData of defaultResep) {
        const resep = resepRepository.create(resepData);
        await resepRepository.save(resep);
      }

      console.log('✅ Resep data created successfully');
    }

    // Get resep for resep detail
    const allResep = await resepRepository.find();

    // Seed Resep Detail
    const resepDetailCount = await resepDetailRepository.count();
    if (resepDetailCount === 0 && allResep.length > 0 && allObat.length > 0) {
      console.log('🌱 Seeding resep detail data...');
      
      const defaultResepDetail = [
        // Resep 1 - Influenza
        {
          resep: allResep[0],
          obat: allObat[0], // Paracetamol
          jumlah: 10,
          aturanPakai: '3x1 tablet sehari',
          keterangan: 'Diminum setelah makan'
        },
        {
          resep: allResep[0],
          obat: allObat[1], // Amoxicillin
          jumlah: 15,
          aturanPakai: '3x1 kapsul sehari',
          keterangan: 'Habiskan obat'
        },
        {
          resep: allResep[0],
          obat: allObat[3], // Vitamin C
          jumlah: 10,
          aturanPakai: '1x1 tablet sehari',
          keterangan: 'Untuk daya tahan tubuh'
        },
        // Resep 2 - ISPA
        {
          resep: allResep[1],
          obat: allObat[2], // OBH Kombi
          jumlah: 1,
          aturanPakai: '3x1 sendok makan',
          keterangan: 'Kocok sebelum diminum'
        },
        {
          resep: allResep[1],
          obat: allObat[3], // Vitamin C
          jumlah: 10,
          aturanPakai: '2x1 tablet sehari',
          keterangan: 'Pagi dan sore'
        },
        // Resep 3 - Gastritis
        {
          resep: allResep[2],
          obat: allObat[4], // Antasida
          jumlah: 12,
          aturanPakai: '3x1 tablet',
          keterangan: 'Diminum 30 menit sebelum makan'
        },
        {
          resep: allResep[2],
          obat: allObat[0], // Paracetamol
          jumlah: 6,
          aturanPakai: 'Bila perlu saat nyeri',
          keterangan: 'Maksimal 3x sehari'
        },
        // Resep 4 - Vertigo
        {
          resep: allResep[3],
          obat: allObat[0], // Paracetamol
          jumlah: 6,
          aturanPakai: '3x1 tablet bila pusing',
          keterangan: 'Setelah makan'
        },
        {
          resep: allResep[3],
          obat: allObat[3], // Vitamin C
          jumlah: 10,
          aturanPakai: '1x1 tablet sehari',
          keterangan: 'Suplemen'
        },
        // Resep 5 - Demam Tifoid
        {
          resep: allResep[4],
          obat: allObat[1], // Amoxicillin
          jumlah: 21,
          aturanPakai: '3x1 kapsul',
          keterangan: 'Habiskan 7 hari'
        },
        {
          resep: allResep[4],
          obat: allObat[0], // Paracetamol
          jumlah: 15,
          aturanPakai: '3x1 tablet',
          keterangan: 'Penurun panas'
        },
        {
          resep: allResep[4],
          obat: allObat[3], // Vitamin C
          jumlah: 14,
          aturanPakai: '2x1 tablet',
          keterangan: 'Untuk pemulihan'
        },
        // Resep 6 - Bronkitis
        {
          resep: allResep[5],
          obat: allObat[2], // OBH Kombi
          jumlah: 2,
          aturanPakai: '3x1 sendok makan',
          keterangan: 'Ekspektoran'
        },
        {
          resep: allResep[5],
          obat: allObat[1], // Amoxicillin
          jumlah: 15,
          aturanPakai: '3x1 kapsul',
          keterangan: 'Antibiotik 5 hari'
        },
        {
          resep: allResep[5],
          obat: allObat[3], // Vitamin C
          jumlah: 10,
          aturanPakai: '2x1 tablet',
          keterangan: 'Suplemen'
        }
      ];

      for (const resepDetailData of defaultResepDetail) {
        const resepDetail = resepDetailRepository.create(resepDetailData);
        await resepDetailRepository.save(resepDetail);
      }

      console.log('✅ Resep detail data created successfully');
    }

    // Seed Transaksi
    const transaksiCount = await transaksiRepository.count();
    
    if (transaksiCount === 0) {
      console.log('🌱 Seeding transaction data...');

      // Get all required data
      const allUsers = await userRepository.find();
      const allKunjungan = await kunjunganRepository.find({ relations: ['pasien'] });
      const kepalaPuskesmas = allUsers.find(u => u.role === UserRole.KEPALA_PUSKESMAS);
      const petugasPendaftaran = allUsers.find(u => u.role === UserRole.PENDAFTARAN);

      // Generate nomor transaksi helper
      const generateNoTransaksi = (index: number) => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const seq = String(index).padStart(4, '0');
        return `TRX/${year}${month}/${seq}`;
      };

      const defaultTransaksi = [
        // Transaksi 1 - Lunas dan Disetujui
        {
          noTransaksi: generateNoTransaksi(1),
          kunjungan: allKunjungan[0],
          pasien: allKunjungan[0].pasien,
          tanggalTransaksi: new Date('2024-01-15'),
          biayaPendaftaran: 10000,
          biayaPemeriksaan: 50000,
          biayaObat: 75000,
          biayaTindakan: 0,
          totalBiaya: 135000,
          diskon: 0,
          metodePembayaran: MetodePembayaran.TUNAI,
          statusPembayaran: TransaksiStatusPembayaran.LUNAS,
          statusVerifikasi: StatusVerifikasi.DISETUJUI,
          kasir: petugasPendaftaran,
          verifikator: kepalaPuskesmas,
          tanggalVerifikasi: new Date('2024-01-15'),
          catatanVerifikasi: 'Pembayaran sesuai, disetujui',
          keterangan: 'Pembayaran tunai lengkap'
        },
        // Transaksi 2 - Lunas dan Disetujui (Transfer)
        {
          noTransaksi: generateNoTransaksi(2),
          kunjungan: allKunjungan[1],
          pasien: allKunjungan[1].pasien,
          tanggalTransaksi: new Date('2024-01-16'),
          biayaPendaftaran: 10000,
          biayaPemeriksaan: 50000,
          biayaObat: 45000,
          biayaTindakan: 100000,
          totalBiaya: 205000,
          diskon: 5000,
          metodePembayaran: MetodePembayaran.TRANSFER,
          statusPembayaran: TransaksiStatusPembayaran.LUNAS,
          statusVerifikasi: StatusVerifikasi.DISETUJUI,
          kasir: petugasPendaftaran,
          verifikator: kepalaPuskesmas,
          tanggalVerifikasi: new Date('2024-01-16'),
          catatanVerifikasi: 'Transfer terverifikasi, disetujui',
          keterangan: 'Transfer ke rekening puskesmas'
        },
        // Transaksi 3 - Lunas, Menunggu Verifikasi
        {
          noTransaksi: generateNoTransaksi(3),
          kunjungan: allKunjungan[2],
          pasien: allKunjungan[2].pasien,
          tanggalTransaksi: new Date('2024-01-17'),
          biayaPendaftaran: 10000,
          biayaPemeriksaan: 50000,
          biayaObat: 30000,
          biayaTindakan: 0,
          totalBiaya: 90000,
          diskon: 0,
          metodePembayaran: MetodePembayaran.TUNAI,
          statusPembayaran: TransaksiStatusPembayaran.LUNAS,
          statusVerifikasi: StatusVerifikasi.MENUNGGU,
          kasir: petugasPendaftaran,
          keterangan: 'Menunggu verifikasi kepala puskesmas'
        },
        // Transaksi 4 - Lunas, Menunggu Verifikasi (BPJS)
        {
          noTransaksi: generateNoTransaksi(4),
          kunjungan: allKunjungan[3],
          pasien: allKunjungan[3].pasien,
          tanggalTransaksi: new Date('2024-01-18'),
          biayaPendaftaran: 10000,
          biayaPemeriksaan: 50000,
          biayaObat: 25000,
          biayaTindakan: 150000,
          totalBiaya: 235000,
          diskon: 235000, // Ditanggung BPJS
          metodePembayaran: MetodePembayaran.BPJS,
          statusPembayaran: TransaksiStatusPembayaran.LUNAS,
          statusVerifikasi: StatusVerifikasi.MENUNGGU,
          kasir: petugasPendaftaran,
          keterangan: 'Ditanggung BPJS, menunggu verifikasi'
        },
        // Transaksi 5 - Ditolak
        {
          noTransaksi: generateNoTransaksi(5),
          kunjungan: allKunjungan[4],
          pasien: allKunjungan[4].pasien,
          tanggalTransaksi: new Date('2024-01-19'),
          biayaPendaftaran: 10000,
          biayaPemeriksaan: 50000,
          biayaObat: 60000,
          biayaTindakan: 0,
          totalBiaya: 120000,
          diskon: 20000,
          metodePembayaran: MetodePembayaran.DEBIT,
          statusPembayaran: TransaksiStatusPembayaran.LUNAS,
          statusVerifikasi: StatusVerifikasi.DITOLAK,
          kasir: petugasPendaftaran,
          verifikator: kepalaPuskesmas,
          tanggalVerifikasi: new Date('2024-01-19'),
          catatanVerifikasi: 'Diskon tidak sesuai kebijakan, harap perbaiki',
          keterangan: 'Pembayaran dengan kartu debit'
        },
        // Transaksi 6 - Belum Dibayar
        {
          noTransaksi: generateNoTransaksi(6),
          kunjungan: allKunjungan[5],
          pasien: allKunjungan[5].pasien,
          tanggalTransaksi: new Date('2024-01-20'),
          biayaPendaftaran: 10000,
          biayaPemeriksaan: 50000,
          biayaObat: 40000,
          biayaTindakan: 0,
          totalBiaya: 100000,
          diskon: 0,
          metodePembayaran: MetodePembayaran.TUNAI,
          statusPembayaran: TransaksiStatusPembayaran.BELUM_DIBAYAR,
          statusVerifikasi: StatusVerifikasi.MENUNGGU,
          kasir: petugasPendaftaran,
          keterangan: 'Pasien akan bayar nanti'
        }
      ];

      for (const transaksiData of defaultTransaksi) {
        const transaksi = transaksiRepository.create(transaksiData);
        await transaksiRepository.save(transaksi);
      }

      console.log('✅ Transaction data created successfully');
    }

    console.log('✅ Database seeded successfully');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

// Allow running seeding directly: `npm run seed`
// (Does not run when imported by the app)
if (require.main === module) {
  AppDataSource.initialize()
    .then(async () => {
      await seedDatabase();
      await AppDataSource.destroy();
      process.exit(0);
    })
    .catch(async (error) => {
      console.error('❌ Error running seed:', error);
      try {
        if (AppDataSource.isInitialized) {
          await AppDataSource.destroy();
        }
      } catch {
        // ignore
      }
      process.exit(1);
    });
}
