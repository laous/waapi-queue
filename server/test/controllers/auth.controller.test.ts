import request from 'supertest';
import express, { Express, NextFunction, Response, Request } from 'express';
import { register, login } from '../../src/controllers/auth.controller';
import prisma from '../../src/config/prisma';

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mockToken'),
}));

jest.mock('../../src/config/prisma', () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  action: {
    findMany: jest.fn(),
  },
}));

const mockUser = {
  id: '1',
  name: 'Oussama',
  email: 'lamnaoueroussama1@gmail.com',
  password: 'hashedPassword',
};

describe('Testing auth.controller', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.post(
      '/register',
      (req: Request, res: Response, next: NextFunction) => {
        req.body = {
          name: mockUser.name,
          email: mockUser.email,
          password: mockUser.password,
        };
        next();
      },
      register
    );
    app.post(
      '/login',
      (req: Request, res: Response, next: NextFunction) => {
        req.body = {
          email: mockUser.email,
          password: mockUser.password,
        };
        next();
      },
      login
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
    (prisma.user.create as jest.Mock).mockResolvedValueOnce(mockUser);
    (prisma.action.findMany as jest.Mock).mockResolvedValueOnce([]);
    (prisma.user.update as jest.Mock).mockResolvedValueOnce(mockUser);

    const response = await request(app).post('/register');

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ user: mockUser, token: 'mockToken' });
  });

  it('should return 400 if email is already registered during registration', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(mockUser);

    const response = await request(app).post('/register');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Email is already registered' });
  });

  it('should return 500 on an error during registration', async () => {
    (prisma.user.findUnique as jest.Mock).mockRejectedValueOnce(
      new Error('Internal Server Error')
    );

    const response = await request(app).post('/register');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Internal Server Error' });
  });

  it('should login a user', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(mockUser);

    const response = await request(app).post('/login');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ user: mockUser, token: 'mockToken' });
  });

  it('should return 401 for invalid credentials during login', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

    const response = await request(app).post('/login');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Invalid credentials' });
  });

  it('should return 500 on an error during login', async () => {
    (prisma.user.findUnique as jest.Mock).mockRejectedValueOnce(
      new Error('Internal Server Error')
    );

    const response = await request(app).post('/login');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Internal Server Error' });
  });
});
