import { Response } from 'express';
import { AppDataSource } from '../config/database';
import { Kunjungan } from '../entities/Kunjungan';
import { Pasien, JenisKelamin, StatusPembayaran } from '../entities/Pasien';
import { Obat } from '../entities/Obat';
import { Resep, StatusResep } from '../entities/Resep';
import { AuthRequest } from '../middleware/auth';
import { Between } from 'typeorm';

export const getLaporanKunjungan = async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const kunjunganRepository = AppDataSource.getRepository(Kunjungan);

    let queryBuilder = kunjunganRepository.createQueryBuilder('kunjungan')
      .leftJoinAndSelect('kunjungan.pasien', 'pasien')
      .orderBy('kunjungan.tanggalKunjungan', 'DESC');

    if (startDate && endDate) {
      queryBuilder = queryBuilder.where(
        'kunjungan.tanggalKunjungan BETWEEN :startDate AND :endDate',
        { startDate, endDate }
      );
    }

    const kunjungan = await queryBuilder.getMany();

    // Statistik
    const total = kunjungan.length;
    const umum = kunjungan.filter(k => k.pasien.statusPembayaran === 'umum').length;
    const bpjs = kunjungan.filter(k => k.pasien.statusPembayaran === 'bpjs').length;

    res.json({ 
      data: kunjungan,
      statistik: {
        total,
        umum,
        bpjs
      }
    });
  } catch (error) {
    console.error('Error fetching laporan kunjungan:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const getStatistikPasien = async (req: AuthRequest, res: Response) => {
  try {
    const pasienRepository = AppDataSource.getRepository(Pasien);

    const total = await pasienRepository.count();
    const umum = await pasienRepository.count({ where: { statusPembayaran: StatusPembayaran.UMUM } });
    const bpjs = await pasienRepository.count({ where: { statusPembayaran: StatusPembayaran.BPJS } });
    const lakiLaki = await pasienRepository.count({ where: { jenisKelamin: JenisKelamin.LAKI_LAKI } });
    const perempuan = await pasienRepository.count({ where: { jenisKelamin: JenisKelamin.PEREMPUAN } });

    res.json({ 
      statistik: {
        total,
        umum,
        bpjs,
        lakiLaki,
        perempuan
      }
    });
  } catch (error) {
    console.error('Error fetching statistik pasien:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const getLaporanStokObat = async (req: AuthRequest, res: Response) => {
  try {
    const obatRepository = AppDataSource.getRepository(Obat);

    const obat = await obatRepository.find({ 
      where: { isActive: true },
      order: { namaObat: 'ASC' }
    });

    const stokRendah = obat.filter(o => o.stok <= o.stokMinimal);
    const stokHabis = obat.filter(o => o.stok === 0);

    res.json({ 
      data: obat,
      statistik: {
        totalObat: obat.length,
        stokRendah: stokRendah.length,
        stokHabis: stokHabis.length
      }
    });
  } catch (error) {
    console.error('Error fetching laporan stok obat:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const getDashboardData = async (req: AuthRequest, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const kunjunganRepository = AppDataSource.getRepository(Kunjungan);
    const pasienRepository = AppDataSource.getRepository(Pasien);
    const resepRepository = AppDataSource.getRepository(Resep);
    const obatRepository = AppDataSource.getRepository(Obat);

    const kunjunganHariIni = await kunjunganRepository.count({
      where: { tanggalKunjungan: today as any }
    });

    const totalPasien = await pasienRepository.count();

    const resepPending = await resepRepository.count({
      where: { status: StatusResep.PENDING }
    });

    const obatStokRendah = await obatRepository
      .createQueryBuilder('obat')
      .where('obat.stok <= obat.stokMinimal')
      .andWhere('obat.isActive = :isActive', { isActive: true })
      .getCount();

    res.json({
      kunjunganHariIni,
      totalPasien,
      resepPending,
      obatStokRendah
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};
