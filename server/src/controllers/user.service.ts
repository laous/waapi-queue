import { Response } from 'express';
import prisma from '../config/prisma';
import IRequestUser from '../interfaces/request-user.interface';

export const getUser = async (req: IRequestUser, res: Response) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        actions: true,
        name: true,
      },
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
