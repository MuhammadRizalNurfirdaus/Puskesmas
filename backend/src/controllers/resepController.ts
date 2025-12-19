import { Response } from 'express';
import { AppDataSource } from '../config/database';
import { Resep, StatusResep } from '../entities/Resep';
import { ResepDetail } from '../entities/ResepDetail';
import { Obat } from '../entities/Obat';
import { Kunjungan, StatusKunjungan } from '../entities/Kunjungan';
import { AuthRequest } from '../middleware/auth';

export const getAllResep = async (req: AuthRequest, res: Response) => {
  try {
    const { status, tanggal } = req.query;
    const resepRepository = AppDataSource.getRepository(Resep);

    let queryBuilder = resepRepository.createQueryBuilder('resep')
      .leftJoinAndSelect('resep.rekamMedis', 'rekamMedis')
      .leftJoinAndSelect('rekamMedis.kunjungan', 'kunjungan')
      .leftJoinAndSelect('kunjungan.pasien', 'pasien')
      .leftJoinAndSelect('resep.dokter', 'dokter')
      .leftJoinAndSelect('resep.apoteker', 'apoteker')
      .leftJoinAndSelect('resep.detail', 'detail')
      .leftJoinAndSelect('detail.obat', 'obat')
      .orderBy('resep.createdAt', 'DESC');

    if (status) {
      queryBuilder = queryBuilder.where('resep.status = :status', { status });
    }

    if (tanggal) {
      queryBuilder = queryBuilder.andWhere('resep.tanggalResep = :tanggal', { tanggal });
    }

    const resep = await queryBuilder.getMany();

    res.json({ data: resep });
  } catch (error) {
    console.error('Error fetching resep:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const getResepById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const resepRepository = AppDataSource.getRepository(Resep);

    const resep = await resepRepository.findOne({
      where: { idResep: parseInt(id) },
      relations: [
        'rekamMedis',
        'rekamMedis.kunjungan',
        'rekamMedis.kunjungan.pasien',
        'dokter',
        'apoteker',
        'detail',
        'detail.obat'
      ]
    });

    if (!resep) {
      return res.status(404).json({ message: 'Resep tidak ditemukan' });
    }

    res.json({ data: resep });
  } catch (error) {
    console.error('Error fetching resep:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const createResep = async (req: AuthRequest, res: Response) => {
  try {
    const { idRekamMedis, catatan, detail } = req.body;
    
    const resepRepository = AppDataSource.getRepository(Resep);
    const obatRepository = AppDataSource.getRepository(Obat);
    const kunjunganRepository = AppDataSource.getRepository(Kunjungan);

    // Validasi stok obat
    for (const item of detail) {
      const obat = await obatRepository.findOne({ where: { idObat: item.idObat } });
      if (!obat) {
        return res.status(404).json({ message: `Obat dengan ID ${item.idObat} tidak ditemukan` });
      }
      if (obat.stok < item.jumlah) {
        return res.status(400).json({ 
          message: `Stok obat ${obat.namaObat} tidak mencukupi. Stok tersedia: ${obat.stok}` 
        });
      }
    }

    // Generate nomor resep
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const lastResep = await resepRepository
      .createQueryBuilder('resep')
      .where('resep.noResep LIKE :prefix', { prefix: `RSP-${today}%` })
      .orderBy('resep.idResep', 'DESC')
      .getOne();

    const lastNumber = lastResep ? parseInt(lastResep.noResep.split('-')[2]) : 0;
    const noResep = `RSP-${today}-${String(lastNumber + 1).padStart(4, '0')}`;

    // Buat resep
    const resep = resepRepository.create({
      noResep,
      idRekamMedis,
      idDokter: req.user!.idUser,
      tanggalResep: new Date(),
      catatan,
      status: StatusResep.PENDING
    });

    await resepRepository.save(resep);

    // Buat detail resep
    const resepDetailRepository = AppDataSource.getRepository(ResepDetail);
    for (const item of detail) {
      const resepDetail = resepDetailRepository.create({
        idResep: resep.idResep,
        ...item
      });
      await resepDetailRepository.save(resepDetail);
    }

    const savedResep = await resepRepository.findOne({
      where: { idResep: resep.idResep },
      relations: ['rekamMedis', 'rekamMedis.kunjungan', 'dokter', 'detail', 'detail.obat']
    });

    res.status(201).json({ 
      message: 'Resep berhasil dibuat',
      data: savedResep 
    });
  } catch (error) {
    console.error('Error creating resep:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const updateResepStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const resepRepository = AppDataSource.getRepository(Resep);
    const obatRepository = AppDataSource.getRepository(Obat);
    const kunjunganRepository = AppDataSource.getRepository(Kunjungan);

    const resep = await resepRepository.findOne({ 
      where: { idResep: parseInt(id) },
      relations: ['detail', 'detail.obat', 'rekamMedis', 'rekamMedis.kunjungan']
    });

    if (!resep) {
      return res.status(404).json({ message: 'Resep tidak ditemukan' });
    }

    if (status === StatusResep.SELESAI) {
      // Kurangi stok obat
      for (const item of resep.detail) {
        const obat = await obatRepository.findOne({ where: { idObat: item.idObat } });
        if (obat) {
          obat.stok -= item.jumlah;
          await obatRepository.save(obat);
        }
      }

      resep.idApoteker = req.user!.idUser;
      resep.tanggalDilayani = new Date();

      // Update status kunjungan
      await kunjunganRepository.update(
        { idKunjungan: resep.rekamMedis.idKunjungan },
        { status: StatusKunjungan.SELESAI }
      );
    }

    resep.status = status;
    await resepRepository.save(resep);

    res.json({ 
      message: 'Status resep berhasil diupdate',
      data: resep 
    });
  } catch (error) {
    console.error('Error updating resep status:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};
