import { Response } from 'express';
import prisma from '../config/prisma';
import IRequestUser from 'interfaces/request-user.interface';

export const getQueue = async (req: IRequestUser, res: Response) => {
  try {
    const user = req.user;
    let queue = await prisma.queue.findFirst({
      where: {
        userId: user.id,
      },
      select: {
        actions: {
          select: {
            actionId: true,
            addedAt: true,
            executed: true,
          },
        },
      },
    });

    if (!queue) {
      queue = await prisma.queue.create({
        data: {
          actions: [],
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    }

    queue.actions = queue.actions
      .sort((a, b) => a.addedAt.getTime() - b.addedAt.getTime())
      .filter((action) => !action.executed);

    res.status(200).json({ queue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const addQueueAction = async (req: IRequestUser, res: Response) => {
  try {
    const user = req.user;
    const actionId = req.params.id;

    const action = await prisma.action.findUnique({
      where: {
        id: actionId,
      },
    });

    if (action === null) {
      res.status(404).json({ message: 'Action not found' });
      return;
    }

    const queue = await prisma.queue.update({
      where: {
        userId: user.id,
      },
      data: {
        actions: {
          push: {
            actionId: action.id,
            addedAt: new Date(),
          },
        },
      },
    });

    res.status(200).json({ queue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
