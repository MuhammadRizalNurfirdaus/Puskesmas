import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { AppDataSource } from '../config/database';
import { User, UserRole } from '../entities/User';
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

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body as { idToken?: string };

    if (!idToken) {
      return res.status(400).json({ message: 'idToken harus diisi' });
    }

    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      return res.status(500).json({ message: 'Google Sign-In belum dikonfigurasi di server' });
    }

    const client = new OAuth2Client(googleClientId);
    const ticket = await client.verifyIdToken({
      idToken,
      audience: googleClientId,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(401).json({ message: 'Token Google tidak valid' });
    }

    const googleId = payload.sub;
    const email = payload.email;
    const emailVerified = payload.email_verified;
    const name = payload.name || 'Pasien';

    if (!email || !emailVerified) {
      return res.status(401).json({ message: 'Email Google belum terverifikasi' });
    }

    const userRepository = AppDataSource.getRepository(User);
    let user = await userRepository.findOne({ where: [{ googleId }, { email }] });

    if (!user) {
      const randomPassword = crypto.randomBytes(24).toString('hex');
      const passwordHash = await bcrypt.hash(randomPassword, 10);

      // Use email as username for uniqueness and clarity
      user = userRepository.create({
        username: email,
        email,
        googleId,
        password: passwordHash,
        role: UserRole.PASIEN,
        namaLengkap: name,
        isActive: true,
      });
      await userRepository.save(user);
    } else {
      // Keep these fields in sync
      const needsUpdate = user.googleId !== googleId || user.email !== email || user.namaLengkap !== name;
      if (needsUpdate) {
        user.googleId = googleId;
        user.email = email;
        user.namaLengkap = name;
        if (!user.isActive) user.isActive = true;
        await userRepository.save(user);
      }
    }

    const jwtSecret = process.env.JWT_SECRET || 'default_secret_key_change_this';
    const jwtExpiresIn = (process.env.JWT_EXPIRES_IN || '24h') as SignOptions['expiresIn'];
    const token = jwt.sign(
      { userId: user.idUser, role: user.role },
      jwtSecret,
      { expiresIn: jwtExpiresIn }
    );

    res.json({
      message: 'Login Google berhasil',
      token,
      user: {
        idUser: user.idUser,
        username: user.username,
        namaLengkap: user.namaLengkap,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Google login error:', error);
    return res.status(401).json({ message: 'Token Google tidak valid' });
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
