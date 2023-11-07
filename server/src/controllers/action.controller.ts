import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const findAll = async (req: Request, res: Response) => {
  try {
    const actions = await prisma.action.findMany();
    res.status(200).json({ actions });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const { name, maxCredits } = req.body;

    const action = await prisma.action.create({
      data: {
        name,
        maxCredits,
      },
    });

    res.status(201).json({ action });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
