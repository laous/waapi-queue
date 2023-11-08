import request from 'supertest';
import express, { Express, NextFunction, Response } from 'express';
import IRequestUser from '../../src/interfaces/request-user.interface';
import {
  getQueue,
  addQueueAction,
} from '../../src/controllers/queue.controller';
import prisma from '../../src/config/prisma';
import { Action, Queue, User } from '@prisma/client';

jest.mock('../../src/config/prisma', () => ({
  queue: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findUnique: jest.fn(),
  },
  action: {
    findUnique: jest.fn(),
  },
}));

jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

const mockUser = {
  id: '1',
  name: 'Oussama',
  email: 'lamnaoueroussama1@gmail.com',
};

const mockQueue = {
  actions: [
    {
      actionId: '1',
      addedAt: new Date(),
      executed: false,
      executedAt: null,
    },
  ],
} as Queue;

const mockAction = {
  id: '1',
  name: 'Action 1',
  maxCredits: 100,
} as Action;

describe('Testing queue.controller', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.get(
      '/queue',
      (req: IRequestUser, res: Response, next: NextFunction) => {
        req.user = mockUser as User;
        next();
      },
      getQueue
    );
    app.post(
      '/queue/:id',
      (req: IRequestUser, res: Response, next: NextFunction) => {
        req.user = mockUser as User;
        next();
      },
      addQueueAction
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the user queue', async () => {
    (prisma.queue.findFirst as jest.Mock).mockResolvedValueOnce(mockQueue);
    const response = await request(app).get('/queue');

    console.log(response.body);

    expect(response.status).toBe(200);
    expect(JSON.stringify(response.body)).toEqual(JSON.stringify(mockQueue));
  });

  it('should create a new queue if none exists', async () => {
    (prisma.queue.findFirst as jest.Mock).mockResolvedValueOnce(null);

    const mockCreatedQueue = {
      actions: [],
    };

    (prisma.queue.create as jest.Mock).mockImplementationOnce(async (data) => {
      expect(data).toEqual({
        data: {
          actions: [],
          user: {
            connect: {
              id: mockUser.id,
            },
          },
        },
      });
      return mockCreatedQueue;
    });

    const response = await request(app).get('/queue');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockCreatedQueue);
  });

  it('should return a 500 error on failure', async () => {
    (prisma.queue.findFirst as jest.Mock).mockRejectedValueOnce(
      new Error('Internal Server Error')
    );

    const response = await request(app).get('/queue');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Internal Server Error' });
  });

  it('should add an action to the queue', async () => {
    const actionId = '1';
    (prisma.action.findUnique as jest.Mock).mockResolvedValueOnce(mockAction);
    (prisma.queue.update as jest.Mock).mockImplementationOnce(async (data) => {
      expect(data).toEqual({
        where: {
          userId: mockUser.id,
        },
        data: {
          actions: {
            push: {
              actionId: mockAction.id,
              addedAt: new Date(),
            },
          },
        },
      });
      return mockQueue;
    });

    const response = await request(app).post(`/queue/${actionId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Action added to queue' });
  });

  it('should return 404 for a non-existent action', async () => {
    const actionId = '999';

    (prisma.action.findUnique as jest.Mock).mockResolvedValueOnce(null);

    const response = await request(app).post(`/queue/${actionId}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Action not found' });

    expect(prisma.queue.update).not.toHaveBeenCalled();
  });

  it('should return a 500 error on failure', async () => {
    const actionId = '1';
    (prisma.action.findUnique as jest.Mock).mockResolvedValueOnce(mockAction);
    (prisma.queue.update as jest.Mock).mockRejectedValueOnce(
      new Error('Internal Server Error')
    );

    const response = await request(app).post(`/queue/${actionId}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Internal Server Error' });
  });
});
