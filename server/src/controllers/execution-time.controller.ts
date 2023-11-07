import prisma from '../config/prisma';
import { Request, Response } from 'express';

export const getExecutionTime = async (req: Request, res: Response) => {
  try {
    const executionTime = await prisma.executionTime.findFirst({
      where: {
        id: 1,
      },
    });
    res.status(200).json(executionTime);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
