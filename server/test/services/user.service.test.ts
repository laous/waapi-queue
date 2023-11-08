import {
  calculateUserActionsCreditForAllUsers,
  executeUserAction,
} from '../../src/services/user.service';
import prisma from '../../src/config/prisma';

jest.mock('../../src/config/prisma', () => ({
  user: {
    findMany: jest.fn(),
    update: jest.fn(),
    findUnique: jest.fn(),
  },
  action: {
    findMany: jest.fn(),
  },
}));

const mockUser1 = {
  id: '1',
  actions: [
    {
      actionId: '1',
      credit: 10,
    },
    {
      actionId: '2',
      credit: 10,
    },
  ],
};
const mockUser2 = {
  id: '2',
  actions: [
    {
      actionId: '1',
      credit: 10,
    },
    {
      actionId: '2',
      credit: 10,
    },
  ],
};

const mockAction1 = {
  id: '1',
  maxCredits: 10,
};
const mockAction2 = {
  id: '2',
  maxCredits: 10,
};

describe('Testing user.service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should calculate user actions credit for all users', async () => {
    (prisma.user.findMany as jest.Mock).mockResolvedValueOnce([
      mockUser1,
      mockUser2,
    ]);

    (prisma.action.findMany as jest.Mock).mockResolvedValueOnce([
      mockAction1,
      mockAction2,
    ]);

    await calculateUserActionsCreditForAllUsers();

    expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
    expect(prisma.action.findMany).toHaveBeenCalledTimes(1);
    expect(prisma.user.update).toHaveBeenCalledTimes(2);
    expect(prisma.user.update).toHaveBeenNthCalledWith(1, {
      where: {
        id: '1',
      },
      data: {
        actions: {
          set: expect.arrayContaining([
            expect.objectContaining({
              actionId: '1',
              credit: expect.any(Number),
            }),
            expect.objectContaining({
              actionId: '2',
              credit: expect.any(Number),
            }),
          ]),
        },
      },
    });
    expect(prisma.user.update).toHaveBeenNthCalledWith(2, {
      where: {
        id: '2',
      },
      data: {
        actions: {
          set: expect.arrayContaining([
            expect.objectContaining({
              actionId: '1',
              credit: expect.any(Number),
            }),
            expect.objectContaining({
              actionId: '2',
              credit: expect.any(Number),
            }),
          ]),
        },
      },
    });
  });

  it('should execute user action', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(mockUser1);

    await executeUserAction('1', '1');

    expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
    expect(prisma.user.update).toHaveBeenCalledTimes(1);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: {
        id: '1',
      },
      data: {
        actions: {
          set: expect.arrayContaining([
            expect.objectContaining({
              actionId: '1',
              credit: 9,
            }),
            expect.objectContaining({
              actionId: '2',
              credit: expect.any(Number),
            }),
          ]),
        },
      },
    });
  });
});
