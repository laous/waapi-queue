import request from 'supertest';
import express, { Express } from 'express';
import { createServer } from 'http';
import { getExecutionTime } from '../../src/controllers/execution-time.controller'; // Replace with the actual path to your controller file.
import prisma from '../../src/config/prisma';

jest.mock('../../src/config/prisma', () => ({
  executionTime: {
    findFirst: jest.fn(),
  },
}));

describe('Testing execution-time.controller', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.get('/execution-time', getExecutionTime);
    (prisma.executionTime.findFirst as jest.Mock).mockResolvedValue({
      id: 1,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the execution time', async () => {
    const mockExecutionTime = {
      id: 1,
    };

    const response = await request(createServer(app)).get('/execution-time');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockExecutionTime);
  });

  it('should return a 500 error on failure', async () => {
    (prisma.executionTime.findFirst as jest.Mock).mockRejectedValueOnce(
      new Error('Internal Server Error')
    );

    const response = await request(createServer(app)).get('/execution-time');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Internal Server Error' });
  });
});
