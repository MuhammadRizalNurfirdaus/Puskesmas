import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';

export interface AuthRequest extends Request {
  user?: User;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token tidak ditemukan' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'default_secret_key_change_this';
    const decoded = jwt.verify(token, jwtSecret) as { userId: number };
    
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { idUser: decoded.userId } });

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'User tidak valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token tidak valid' });
  }
};
