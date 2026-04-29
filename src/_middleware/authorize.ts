// src/_middleware/authorize.ts
import jwt from 'jsonwebtoken';
const config = require('../../config.json');
import { db } from '../_helpers/db';

export function authorize(roles: any = []) {
  return [
    // authenticate JWT token and attach user to request object (req.user)
    (req: any, res: any, next: any) => {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      try {
        const decoded = jwt.verify(token, config.jwtSecret) as any;
        req.user = decoded;
        next();
      } catch {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    },

    // authorize based on user role
    async (req: any, res: any, next: any) => {
      const account = await db.Account.findByPk(req.user.id);

    if (!account || (roles.length && !(roles as string[]).includes(account.role as string))) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      req.user.role = account.role;
      req.user.ownsToken = (token: string) =>
        db.RefreshToken.findOne({ where: { token, accountId: account.id } });

      next();
    },
  ];
}