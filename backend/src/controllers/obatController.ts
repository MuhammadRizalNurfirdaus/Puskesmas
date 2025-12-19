import { Response } from 'express';
import { AppDataSource } from '../config/database';
import { Obat } from '../entities/Obat';
import { AuthRequest } from '../middleware/auth';

export const getAllObat = async (req: AuthRequest, res: Response) => {
  try {
    const { search, stokRendah } = req.query;
    const obatRepository = AppDataSource.getRepository(Obat);

    let queryBuilder = obatRepository.createQueryBuilder('obat')
      .where('obat.isActive = :isActive', { isActive: true })
      .orderBy('obat.namaObat', 'ASC');

    if (search) {
      queryBuilder = queryBuilder.andWhere(
        '(obat.namaObat LIKE :search OR obat.kodeObat LIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (stokRendah === 'true') {
      queryBuilder = queryBuilder.andWhere('obat.stok <= obat.stokMinimal');
    }

    const obat = await queryBuilder.getMany();

    res.json({ data: obat });
  } catch (error) {
    console.error('Error fetching obat:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const getObatById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const obatRepository = AppDataSource.getRepository(Obat);

    const obat = await obatRepository.findOne({ where: { idObat: parseInt(id) } });

    if (!obat) {
      return res.status(404).json({ message: 'Obat tidak ditemukan' });
    }

    res.json({ data: obat });
  } catch (error) {
    console.error('Error fetching obat:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const createObat = async (req: AuthRequest, res: Response) => {
  try {
    const obatRepository = AppDataSource.getRepository(Obat);

    const obat = obatRepository.create(req.body);
    await obatRepository.save(obat);

    res.status(201).json({ 
      message: 'Obat berhasil ditambahkan',
      data: obat 
    });
  } catch (error) {
    console.error('Error creating obat:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const updateObat = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const obatRepository = AppDataSource.getRepository(Obat);

    const obat = await obatRepository.findOne({ where: { idObat: parseInt(id) } });

    if (!obat) {
      return res.status(404).json({ message: 'Obat tidak ditemukan' });
    }

    obatRepository.merge(obat, req.body);
    await obatRepository.save(obat);

    res.json({ 
      message: 'Data obat berhasil diupdate',
      data: obat 
    });
  } catch (error) {
    console.error('Error updating obat:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const updateStokObat = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { stok } = req.body;
    const obatRepository = AppDataSource.getRepository(Obat);

    const obat = await obatRepository.findOne({ where: { idObat: parseInt(id) } });

    if (!obat) {
      return res.status(404).json({ message: 'Obat tidak ditemukan' });
    }

    obat.stok = stok;
    await obatRepository.save(obat);

    res.json({ 
      message: 'Stok obat berhasil diupdate',
      data: obat 
    });
  } catch (error) {
    console.error('Error updating stok obat:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};
