import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { AuthRequest } from '../middleware/auth';

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password harus diisi' });
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { username } });

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'default_secret_key_change_this';
    const token = jwt.sign(
      { userId: user.idUser, role: user.role },
      jwtSecret,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login berhasil',
      token,
      user: {
        idUser: user.idUser,
        username: user.username,
        namaLengkap: user.namaLengkap,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    res.json({
      idUser: user.idUser,
      username: user.username,
      namaLengkap: user.namaLengkap,
      role: user.role,
      nip: user.nip,
      noTelp: user.noTelp
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  // Dalam implementasi JWT, logout dilakukan di sisi client dengan menghapus token
  res.json({ message: 'Logout berhasil' });
};
