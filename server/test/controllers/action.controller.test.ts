import request from 'supertest';
import express, { Express } from 'express';
import { findAll } from '../../src/controllers/action.controller';
import prisma from '../../src/config/prisma';

jest.mock('../../src/config/prisma', () => {
  return {
    action: {
      findMany: jest.fn(),
    },
  };
});

describe('Testing action.controller', () => {
  let app: Express;
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.get('/actions', findAll);
    (prisma.action.findMany as jest.Mock).mockResolvedValue([
      {
        id: 1,
        name: 'Action 1',
        maxCredits: 100,
      },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get all actions', async () => {
    const response = await request(app).get('/actions');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: 1,
        name: 'Action 1',
        maxCredits: 100,
      },
    ]);
  });

  it('should return 500 when get all actions', async () => {
    (prisma.action.findMany as jest.Mock).mockRejectedValueOnce(
      new Error('Internal Server Error')
    );
    const response = await request(app).get('/actions');
    expect(response.status).toBe(500);
  });
});
