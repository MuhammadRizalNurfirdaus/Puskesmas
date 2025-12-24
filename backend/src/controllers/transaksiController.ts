import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AppDataSource } from '../config/database';
import { Transaksi, StatusPembayaran, StatusVerifikasi } from '../entities/Transaksi';
import { Kunjungan } from '../entities/Kunjungan';
import { Pasien } from '../entities/Pasien';
import { Resep } from '../entities/Resep';
import { ResepDetail } from '../entities/ResepDetail';

const transaksiRepository = AppDataSource.getRepository(Transaksi);
const kunjunganRepository = AppDataSource.getRepository(Kunjungan);
const resepRepository = AppDataSource.getRepository(Resep);
const resepDetailRepository = AppDataSource.getRepository(ResepDetail);

// Generate nomor transaksi
const generateNoTransaksi = async (): Promise<string> => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  const prefix = `TRX${year}${month}${day}`;
  
  const lastTransaksi = await transaksiRepository
    .createQueryBuilder('transaksi')
    .where('transaksi.noTransaksi LIKE :prefix', { prefix: `${prefix}%` })
    .orderBy('transaksi.noTransaksi', 'DESC')
    .getOne();
  
  let sequence = 1;
  if (lastTransaksi) {
    const lastSequence = parseInt(lastTransaksi.noTransaksi.slice(-4));
    sequence = lastSequence + 1;
  }
  
  return `${prefix}${String(sequence).padStart(4, '0')}`;
};

// Hitung total biaya dari kunjungan
const hitungTotalBiaya = async (idKunjungan: number) => {
  const biayaPendaftaran = 10000; // Default biaya pendaftaran
  const biayaPemeriksaan = 50000; // Default biaya pemeriksaan
  let biayaObat = 0;
  let biayaTindakan = 0;

  // Hitung biaya obat dari resep
  const resep = await resepRepository
    .createQueryBuilder('resep')
    .leftJoinAndSelect('resep.rekamMedis', 'rekamMedis')
    .leftJoinAndSelect('resep.detail', 'detail')
    .leftJoinAndSelect('detail.obat', 'obat')
    .where('rekamMedis.idKunjungan = :idKunjungan', { idKunjungan })
    .getOne();

  if (resep && resep.detail) {
    for (const detail of resep.detail) {
      if (detail.obat && detail.obat.harga) {
        biayaObat += Number(detail.obat.harga) * detail.jumlah;
      }
    }
  }

  return {
    biayaPendaftaran,
    biayaPemeriksaan,
    biayaObat,
    biayaTindakan,
    total: biayaPendaftaran + biayaPemeriksaan + biayaObat + biayaTindakan
  };
};

export const getAllTransaksi = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    let transaksi: Transaksi[];

    if (user?.role === 'pasien') {
      // Pasien hanya bisa lihat transaksi mereka sendiri
      const pasienRepository = AppDataSource.getRepository('Pasien');
      const pasien = await pasienRepository
        .createQueryBuilder('pasien')
        .where('pasien.createdById = :userId', { userId: user.idUser })
        .getOne();
      
      if (pasien) {
        transaksi = await transaksiRepository.find({
          where: { idPasien: (pasien as any).idPasien },
          relations: ['kunjungan', 'pasien', 'kasir', 'verifikator'],
          order: { createdAt: 'DESC' }
        });
      } else {
        transaksi = [];
      }
    } else {
      // Admin, Pendaftaran, Kepala Puskesmas, Dokter, Apoteker bisa lihat semua
      transaksi = await transaksiRepository.find({
        relations: ['kunjungan', 'pasien', 'kasir', 'verifikator'],
        order: { createdAt: 'DESC' }
      });
    }

    res.json(transaksi);
  } catch (error) {
    console.error('Error fetching transaksi:', error);
    res.status(500).json({ message: 'Error fetching transaksi' });
  }
};

export const getTransaksiById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const transaksi = await transaksiRepository.findOne({
      where: { idTransaksi: parseInt(id) },
      relations: ['kunjungan', 'kunjungan.pasien', 'kunjungan.rekamMedis', 'pasien', 'kasir', 'verifikator']
    });

    if (!transaksi) {
      return res.status(404).json({ message: 'Transaksi not found' });
    }

    // Validasi akses untuk pasien - hanya bisa lihat transaksi sendiri
    if (user?.role === 'pasien') {
      const pasienRepository = AppDataSource.getRepository('Pasien');
      const pasien = await pasienRepository
        .createQueryBuilder('pasien')
        .where('pasien.createdById = :userId', { userId: user.idUser })
        .getOne();
      
      if (!pasien || transaksi.idPasien !== (pasien as any).idPasien) {
        return res.status(403).json({ message: 'Forbidden: Anda tidak memiliki akses ke transaksi ini' });
      }
    }

    // Get resep detail
    const resep = await resepRepository
      .createQueryBuilder('resep')
      .leftJoinAndSelect('resep.rekamMedis', 'rekamMedis')
      .leftJoinAndSelect('resep.detail', 'detail')
      .leftJoinAndSelect('detail.obat', 'obat')
      .leftJoinAndSelect('resep.dokter', 'dokter')
      .leftJoinAndSelect('resep.apoteker', 'apoteker')
      .where('rekamMedis.idKunjungan = :idKunjungan', { idKunjungan: transaksi.idKunjungan })
      .getOne();

    const response = {
      ...transaksi,
      resep
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching transaksi:', error);
    res.status(500).json({ message: 'Error fetching transaksi' });
  }
};

export const createTransaksi = async (req: AuthRequest, res: Response) => {
  try {
    const { 
      idKunjungan, 
      metodePembayaran, 
      diskon = 0,
      keterangan 
    } = req.body;

    const user = req.user;

    // Validasi kunjungan
    const kunjungan = await kunjunganRepository.findOne({
      where: { idKunjungan },
      relations: ['pasien']
    });

    if (!kunjungan) {
      return res.status(404).json({ message: 'Kunjungan not found' });
    }

    // Validasi untuk pasien - hanya bisa membuat transaksi untuk kunjungan sendiri
    if (user?.role === 'pasien') {
      const pasienRepository = AppDataSource.getRepository('Pasien');
      const pasien = await pasienRepository
        .createQueryBuilder('pasien')
        .where('pasien.createdById = :userId', { userId: user.idUser })
        .getOne();
      
      if (!pasien || kunjungan.idPasien !== (pasien as any).idPasien) {
        return res.status(403).json({ message: 'Forbidden: Anda hanya bisa membuat transaksi untuk kunjungan Anda sendiri' });
      }
    }

    // Cek apakah sudah ada transaksi untuk kunjungan ini
    const existingTransaksi = await transaksiRepository.findOne({
      where: { idKunjungan }
    });

    if (existingTransaksi) {
      return res.status(400).json({ message: 'Transaksi untuk kunjungan ini sudah ada' });
    }

    // Hitung biaya
    const biaya = await hitungTotalBiaya(idKunjungan);
    const totalBiaya = biaya.total - (diskon || 0);

    // Generate nomor transaksi
    const noTransaksi = await generateNoTransaksi();

    // Buat transaksi baru
    const transaksi = transaksiRepository.create({
      noTransaksi,
      idKunjungan,
      idPasien: kunjungan.pasien.idPasien,
      tanggalTransaksi: new Date(),
      biayaPendaftaran: biaya.biayaPendaftaran,
      biayaPemeriksaan: biaya.biayaPemeriksaan,
      biayaObat: biaya.biayaObat,
      biayaTindakan: biaya.biayaTindakan,
      diskon: diskon || 0,
      totalBiaya,
      metodePembayaran,
      statusPembayaran: StatusPembayaran.LUNAS,
      statusVerifikasi: StatusVerifikasi.MENUNGGU,
      idKasir: req.user?.idUser,
      keterangan
    });

    await transaksiRepository.save(transaksi);

    const savedTransaksi = await transaksiRepository.findOne({
      where: { idTransaksi: transaksi.idTransaksi },
      relations: ['kunjungan', 'pasien', 'kasir']
    });

    res.status(201).json(savedTransaksi);
  } catch (error) {
    console.error('Error creating transaksi:', error);
    res.status(500).json({ message: 'Error creating transaksi' });
  }
};

export const verifikasiTransaksi = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { statusVerifikasi, catatanVerifikasi } = req.body;

    const transaksi = await transaksiRepository.findOne({
      where: { idTransaksi: parseInt(id) }
    });

    if (!transaksi) {
      return res.status(404).json({ message: 'Transaksi not found' });
    }

    transaksi.statusVerifikasi = statusVerifikasi;
    transaksi.catatanVerifikasi = catatanVerifikasi;
    transaksi.tanggalVerifikasi = new Date();
    transaksi.idVerifikator = req.user?.idUser;

    await transaksiRepository.save(transaksi);

    const updatedTransaksi = await transaksiRepository.findOne({
      where: { idTransaksi: transaksi.idTransaksi },
      relations: ['kunjungan', 'pasien', 'kasir', 'verifikator']
    });

    res.json(updatedTransaksi);
  } catch (error) {
    console.error('Error verifying transaksi:', error);
    res.status(500).json({ message: 'Error verifying transaksi' });
  }
};

export const updateTransaksi = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const transaksi = await transaksiRepository.findOne({
      where: { idTransaksi: parseInt(id) }
    });

    if (!transaksi) {
      return res.status(404).json({ message: 'Transaksi not found' });
    }

    Object.assign(transaksi, updateData);
    await transaksiRepository.save(transaksi);

    const updatedTransaksi = await transaksiRepository.findOne({
      where: { idTransaksi: transaksi.idTransaksi },
      relations: ['kunjungan', 'pasien', 'kasir', 'verifikator']
    });

    res.json(updatedTransaksi);
  } catch (error) {
    console.error('Error updating transaksi:', error);
    res.status(500).json({ message: 'Error updating transaksi' });
  }
};

export const deleteTransaksi = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const transaksi = await transaksiRepository.findOne({
      where: { idTransaksi: parseInt(id) }
    });

    if (!transaksi) {
      return res.status(404).json({ message: 'Transaksi not found' });
    }

    await transaksiRepository.remove(transaksi);
    res.json({ message: 'Transaksi deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaksi:', error);
    res.status(500).json({ message: 'Error deleting transaksi' });
  }
};
