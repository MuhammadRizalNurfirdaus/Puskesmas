import { Response } from 'express';
import { AppDataSource } from '../config/database';
import { RekamMedis } from '../entities/RekamMedis';
import { Kunjungan, StatusKunjungan } from '../entities/Kunjungan';
import { AuthRequest } from '../middleware/auth';

export const getRekamMedisByPasien = async (req: AuthRequest, res: Response) => {
  try {
    const { pasienId } = req.params;
    const rekamMedisRepository = AppDataSource.getRepository(RekamMedis);

    const rekamMedis = await rekamMedisRepository
      .createQueryBuilder('rm')
      .leftJoinAndSelect('rm.kunjungan', 'kunjungan')
      .leftJoinAndSelect('kunjungan.pasien', 'pasien')
      .leftJoinAndSelect('rm.dokter', 'dokter')
      .leftJoinAndSelect('rm.resep', 'resep')
      .where('pasien.idPasien = :pasienId', { pasienId })
      .orderBy('rm.createdAt', 'DESC')
      .getMany();

    res.json({ data: rekamMedis });
  } catch (error) {
    console.error('Error fetching rekam medis:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const getRekamMedisById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const rekamMedisRepository = AppDataSource.getRepository(RekamMedis);

    const rekamMedis = await rekamMedisRepository.findOne({
      where: { idRekamMedis: parseInt(id) },
      relations: ['kunjungan', 'kunjungan.pasien', 'dokter', 'resep']
    });

    if (!rekamMedis) {
      return res.status(404).json({ message: 'Rekam medis tidak ditemukan' });
    }

    res.json({ data: rekamMedis });
  } catch (error) {
    console.error('Error fetching rekam medis:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const createRekamMedis = async (req: AuthRequest, res: Response) => {
  try {
    const rekamMedisRepository = AppDataSource.getRepository(RekamMedis);
    const kunjunganRepository = AppDataSource.getRepository(Kunjungan);

    // Cek apakah kunjungan sudah memiliki rekam medis
    const existingRekamMedis = await rekamMedisRepository.findOne({
      where: { idKunjungan: req.body.idKunjungan }
    });

    if (existingRekamMedis) {
      return res.status(400).json({ message: 'Kunjungan ini sudah memiliki rekam medis' });
    }

    const rekamMedis = rekamMedisRepository.create({
      ...req.body,
      idDokter: req.user!.idUser
    });

    const savedEntity = await rekamMedisRepository.save(rekamMedis);
    const savedId = (savedEntity as any).idRekamMedis || savedEntity;

    // Update status kunjungan
    await kunjunganRepository.update(
      { idKunjungan: req.body.idKunjungan },
      { status: StatusKunjungan.PEMERIKSAAN }
    );

    const savedRekamMedis = await rekamMedisRepository.findOne({
      where: { idRekamMedis: savedId },
      relations: ['kunjungan', 'kunjungan.pasien', 'dokter']
    });

    res.status(201).json({ 
      message: 'Rekam medis berhasil dibuat',
      data: savedRekamMedis 
    });
  } catch (error) {
    console.error('Error creating rekam medis:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const updateRekamMedis = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const rekamMedisRepository = AppDataSource.getRepository(RekamMedis);

    const rekamMedis = await rekamMedisRepository.findOne({ 
      where: { idRekamMedis: parseInt(id) } 
    });

    if (!rekamMedis) {
      return res.status(404).json({ message: 'Rekam medis tidak ditemukan' });
    }

    // Hanya dokter yang membuat rekam medis yang bisa mengupdate
    if (rekamMedis.idDokter !== req.user!.idUser) {
      return res.status(403).json({ message: 'Anda tidak memiliki akses untuk mengupdate rekam medis ini' });
    }

    rekamMedisRepository.merge(rekamMedis, req.body);
    await rekamMedisRepository.save(rekamMedis);

    res.json({ 
      message: 'Rekam medis berhasil diupdate',
      data: rekamMedis 
    });
  } catch (error) {
    console.error('Error updating rekam medis:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};
