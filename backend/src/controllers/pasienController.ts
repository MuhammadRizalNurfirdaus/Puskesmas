import { Response } from 'express';
import { AppDataSource } from '../config/database';
import { Pasien, StatusPembayaran } from '../entities/Pasien';
import { AuthRequest } from '../middleware/auth';

export const getAllPasien = async (req: AuthRequest, res: Response) => {
  try {
    const { search, statusPembayaran } = req.query;
    const pasienRepository = AppDataSource.getRepository(Pasien);

    let queryBuilder = pasienRepository.createQueryBuilder('pasien')
      .leftJoinAndSelect('pasien.createdBy', 'user')
      .orderBy('pasien.createdAt', 'DESC');

    if (search) {
      queryBuilder = queryBuilder.where(
        'pasien.namaLengkap LIKE :search OR pasien.noRekamMedis LIKE :search OR pasien.nik LIKE :search',
        { search: `%${search}%` }
      );
    }

    if (statusPembayaran) {
      queryBuilder = queryBuilder.andWhere('pasien.statusPembayaran = :statusPembayaran', { statusPembayaran });
    }

    const pasien = await queryBuilder.getMany();

    res.json({ data: pasien });
  } catch (error) {
    console.error('Error fetching pasien:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const getPasienById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const pasienRepository = AppDataSource.getRepository(Pasien);

    const pasien = await pasienRepository.findOne({
      where: { idPasien: parseInt(id) },
      relations: ['createdBy', 'kunjungan']
    });

    if (!pasien) {
      return res.status(404).json({ message: 'Pasien tidak ditemukan' });
    }

    res.json({ data: pasien });
  } catch (error) {
    console.error('Error fetching pasien:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const createPasien = async (req: AuthRequest, res: Response) => {
  try {
    const pasienRepository = AppDataSource.getRepository(Pasien);

    // Generate nomor rekam medis
    const lastPasien = await pasienRepository
      .createQueryBuilder('pasien')
      .orderBy('pasien.idPasien', 'DESC')
      .getOne();

    const lastNumber = lastPasien ? parseInt(lastPasien.noRekamMedis.split('-')[1]) : 0;
    const noRekamMedis = `RM-${String(lastNumber + 1).padStart(6, '0')}`;

    const pasien = pasienRepository.create({
      ...req.body,
      noRekamMedis,
      createdById: req.user!.idUser
    });

    await pasienRepository.save(pasien);

    res.status(201).json({ 
      message: 'Pasien berhasil didaftarkan',
      data: pasien 
    });
  } catch (error) {
    console.error('Error creating pasien:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const updatePasien = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const pasienRepository = AppDataSource.getRepository(Pasien);

    const pasien = await pasienRepository.findOne({ where: { idPasien: parseInt(id) } });

    if (!pasien) {
      return res.status(404).json({ message: 'Pasien tidak ditemukan' });
    }

    pasienRepository.merge(pasien, req.body);
    await pasienRepository.save(pasien);

    res.json({ 
      message: 'Data pasien berhasil diupdate',
      data: pasien 
    });
  } catch (error) {
    console.error('Error updating pasien:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};
