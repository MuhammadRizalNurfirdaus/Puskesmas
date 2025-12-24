import { Response } from 'express';
import { AppDataSource } from '../config/database';
import { Kunjungan, StatusKunjungan } from '../entities/Kunjungan';
import { AuthRequest } from '../middleware/auth';

export const getAllKunjungan = async (req: AuthRequest, res: Response) => {
  try {
    const { tanggal, status, idPasien } = req.query;
    const kunjunganRepository = AppDataSource.getRepository(Kunjungan);

    let queryBuilder = kunjunganRepository.createQueryBuilder('kunjungan')
      .leftJoinAndSelect('kunjungan.pasien', 'pasien')
      .leftJoinAndSelect('kunjungan.petugasPendaftaran', 'petugas')
      .leftJoinAndSelect('kunjungan.rekamMedis', 'rekamMedis')
      .orderBy('kunjungan.tanggalKunjungan', 'DESC')
      .addOrderBy('kunjungan.jamKunjungan', 'DESC');

    if (tanggal) {
      queryBuilder = queryBuilder.andWhere('kunjungan.tanggalKunjungan = :tanggal', { tanggal });
    }

    if (status) {
      queryBuilder = queryBuilder.andWhere('kunjungan.status = :status', { status });
    }

    if (idPasien) {
      queryBuilder = queryBuilder.andWhere('kunjungan.idPasien = :idPasien', { idPasien });
    }

    const kunjungan = await queryBuilder.getMany();

    res.json({ data: kunjungan });
  } catch (error) {
    console.error('Error fetching kunjungan:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const getKunjunganById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const kunjunganRepository = AppDataSource.getRepository(Kunjungan);

    const kunjungan = await kunjunganRepository.findOne({
      where: { idKunjungan: parseInt(id) },
      relations: [
        'pasien', 
        'petugasPendaftaran', 
        'rekamMedis', 
        'rekamMedis.dokter',
        'rekamMedis.resep',
        'rekamMedis.resep.detail',
        'rekamMedis.resep.detail.obat',
        'rekamMedis.resep.apoteker'
      ]
    });

    if (!kunjungan) {
      return res.status(404).json({ message: 'Kunjungan tidak ditemukan' });
    }

    res.json(kunjungan);
  } catch (error) {
    console.error('Error fetching kunjungan:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const createKunjungan = async (req: AuthRequest, res: Response) => {
  try {
    const kunjunganRepository = AppDataSource.getRepository(Kunjungan);

    // Generate nomor kunjungan
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const lastKunjungan = await kunjunganRepository
      .createQueryBuilder('kunjungan')
      .where('kunjungan.noKunjungan LIKE :prefix', { prefix: `KJ-${today}%` })
      .orderBy('kunjungan.idKunjungan', 'DESC')
      .getOne();

    const lastNumber = lastKunjungan ? parseInt(lastKunjungan.noKunjungan.split('-')[2]) : 0;
    const noKunjungan = `KJ-${today}-${String(lastNumber + 1).padStart(4, '0')}`;

    const kunjungan = kunjunganRepository.create({
      ...req.body,
      noKunjungan,
      idPetugasPendaftaran: req.user!.idUser,
      status: StatusKunjungan.TERDAFTAR
    });

    const savedEntity = await kunjunganRepository.save(kunjungan);
    const savedId = (savedEntity as any).idKunjungan || savedEntity;

    const savedKunjungan = await kunjunganRepository.findOne({
      where: { idKunjungan: savedId },
      relations: ['pasien', 'petugasPendaftaran']
    });

    res.status(201).json({ 
      message: 'Kunjungan berhasil didaftarkan',
      data: savedKunjungan 
    });
  } catch (error) {
    console.error('Error creating kunjungan:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const updateKunjunganStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const kunjunganRepository = AppDataSource.getRepository(Kunjungan);

    const kunjungan = await kunjunganRepository.findOne({ where: { idKunjungan: parseInt(id) } });

    if (!kunjungan) {
      return res.status(404).json({ message: 'Kunjungan tidak ditemukan' });
    }

    kunjungan.status = status;
    await kunjunganRepository.save(kunjungan);

    res.json({ 
      message: 'Status kunjungan berhasil diupdate',
      data: kunjungan 
    });
  } catch (error) {
    console.error('Error updating kunjungan:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};
