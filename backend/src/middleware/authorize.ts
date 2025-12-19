import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { UserRole } from '../entities/User';

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Anda tidak memiliki akses' });
    }

    next();
  };
};
