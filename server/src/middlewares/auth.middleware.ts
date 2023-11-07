import prisma from '../config/prisma';
import { NextFunction, Response } from 'express';
import IRequestUser from '../interfaces/request-user.interface';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const jwtMiddleware = (
  req: IRequestUser,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token || !JWT_SECRET)
    return res.sendStatus(401).json({ message: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET as string, async (err: Error, payload: any) => {
    if (err || !payload) {
      console.error(err);
      return res.sendStatus(403).json({ message: 'Invalid token' });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
      select: {
        id: true,
        email: true,
      },
    });

    req.user = user;

    next();
  });
};
